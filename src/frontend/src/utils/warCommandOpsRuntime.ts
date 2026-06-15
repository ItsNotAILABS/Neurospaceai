/**
 * warCommandOpsRuntime.ts
 * Command theater runtime for WarCommandOps.
 * 9 command nodes (3 factions × 3 layers) driven by Core Brain.
 */

import { liveBrainBus } from "./liveBrainBus";
import { globalMetaAwareness } from "./metaAwarenessEngine";

export type CommandLayer = "theater" | "operational" | "regional";
export type CommandFaction = "delta" | "alpha" | "omega";

export interface CommandNode {
  id: string;
  instanceId: string;
  name: string;
  layer: CommandLayer;
  faction: CommandFaction;
  position: [number, number, number];
  objectives: string[];
  burdenLevel: number;
  uncertaintyLevel: number;
  supplyStatus: number;
  morale: number;
  lastActionType: string;
  lastConfidence: number;
  metaAwarenessScore: number;
  tick: number;
  cumulativeScore: number;
}

export interface CommandTraceEntry {
  tick: number;
  nodeId: string;
  layer: CommandLayer;
  faction: CommandFaction;
  actionType: string;
  confidence: number;
  metaAwarenessScore: number;
  outcome: "success" | "failure" | "neutral";
}

export interface TheaterState {
  tick: number;
  sessionId: string;
  nodes: CommandNode[];
  deltaScore: number;
  alphaScore: number;
  omegaScore: number;
  strategicPressure: number;
  logisticsHealth: number;
  sensingUncertainty: number;
  traceLog: CommandTraceEntry[];
}

const NODE_DEFS: Array<{
  name: string;
  layer: CommandLayer;
  faction: CommandFaction;
  pos: [number, number, number];
  objectives: string[];
}> = [
  // Delta (benchmark)
  {
    name: "DELTA THEATER CMD",
    layer: "theater",
    faction: "delta",
    pos: [0, 8, 0],
    objectives: ["Maintain strategic balance", "Monitor all sectors"],
  },
  {
    name: "DELTA OPS NORTH",
    layer: "operational",
    faction: "delta",
    pos: [-30, 4, -30],
    objectives: ["Secure northern corridor", "Establish supply line"],
  },
  {
    name: "DELTA REGIONAL EAST",
    layer: "regional",
    faction: "delta",
    pos: [40, 2, 20],
    objectives: ["Hold eastern perimeter", "Coordinate recon"],
  },
  // Alpha
  {
    name: "ALPHA THEATER CMD",
    layer: "theater",
    faction: "alpha",
    pos: [-50, 8, -50],
    objectives: ["Advance on delta positions", "Disrupt supply"],
  },
  {
    name: "ALPHA OPS WEST",
    layer: "operational",
    faction: "alpha",
    pos: [-70, 4, 10],
    objectives: ["Flank from west", "Secure fuel depot"],
  },
  {
    name: "ALPHA REGIONAL SOUTH",
    layer: "regional",
    faction: "alpha",
    pos: [-30, 2, 60],
    objectives: ["Hold southern flank", "Maintain comms"],
  },
  // Omega
  {
    name: "OMEGA THEATER CMD",
    layer: "theater",
    faction: "omega",
    pos: [50, 8, 50],
    objectives: ["Counter-advance", "Protect strategic assets"],
  },
  {
    name: "OMEGA OPS EAST",
    layer: "operational",
    faction: "omega",
    pos: [70, 4, -20],
    objectives: ["Eastern pincer", "Cut supply lines"],
  },
  {
    name: "OMEGA REGIONAL NORTH",
    layer: "regional",
    faction: "omega",
    pos: [20, 2, -70],
    objectives: ["Northern defense", "Intercept scouts"],
  },
];

export class WarCommandOpsRuntime {
  private state: TheaterState | null = null;
  private initialized = false;

  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    const nodes: CommandNode[] = NODE_DEFS.map((def) => ({
      id: def.name.toLowerCase().replace(/\s+/g, "_"),
      instanceId: `warcommand_${def.name.toLowerCase().replace(/\s+/g, "_")}`,
      name: def.name,
      layer: def.layer,
      faction: def.faction,
      position: def.pos,
      objectives: def.objectives,
      burdenLevel: 0.2 + Math.random() * 0.3,
      uncertaintyLevel: 0.2 + Math.random() * 0.3,
      supplyStatus: 0.6 + Math.random() * 0.3,
      morale: 0.5 + Math.random() * 0.4,
      lastActionType: "EXPLORE",
      lastConfidence: 0.5,
      metaAwarenessScore: 0.5,
      tick: 0,
      cumulativeScore: 0,
    }));

    if (!liveBrainBus.isActive) liveBrainBus.start();

    this.state = {
      tick: 0,
      sessionId: `theater_session_${Date.now()}`,
      nodes,
      deltaScore: 0,
      alphaScore: 0,
      omegaScore: 0,
      strategicPressure: 0.3,
      logisticsHealth: 0.7,
      sensingUncertainty: 0.4,
      traceLog: [],
    };
  }

  tick(_deltaMs: number): TheaterState {
    if (!this.state) return this._emptyState();

    const s = this.state;
    s.tick++;
    const newTraces: CommandTraceEntry[] = [];

    for (const node of s.nodes) {
      // Dynamic burden and uncertainty shift
      node.burdenLevel = Math.min(
        1,
        node.burdenLevel * 0.95 +
          s.strategicPressure * 0.08 +
          Math.random() * 0.02,
      );
      node.uncertaintyLevel = Math.min(
        1,
        node.uncertaintyLevel * 0.92 +
          s.sensingUncertainty * 0.1 +
          Math.random() * 0.03,
      );

      // Route through Core Brain
      const packet = liveBrainBus.routePayload(`warcommand_${node.id}`, {
        threat_level: node.burdenLevel * 0.8 + node.uncertaintyLevel * 0.2,
        reward_level: node.supplyStatus * 0.6 + node.morale * 0.4,
        novelty: node.uncertaintyLevel * 0.5,
        urgency: node.burdenLevel * 0.9,
        salience: (node.burdenLevel + node.uncertaintyLevel) * 0.5,
      });

      node.lastActionType = packet.action_type;
      node.lastConfidence = packet.confidence;
      node.tick = s.tick;

      // Update meta-awareness
      const maState = globalMetaAwareness.update({
        pfcActivation: packet.confidence,
        amygdalaActivation: node.burdenLevel,
        hippocampusActivation: 1 - node.uncertaintyLevel,
        insulaActivation: node.burdenLevel * 0.6,
        accActivation: node.uncertaintyLevel,
        nacActivation: node.morale,
        globalArousal: (node.burdenLevel + node.uncertaintyLevel) * 0.5,
        predictionError: node.uncertaintyLevel,
        sympatheticTone: node.burdenLevel,
        fatigue: 1 - node.supplyStatus,
        stress: node.burdenLevel,
        episodicMemoryStrength: node.morale,
        failureMemoryStrength: 1 - node.morale,
        tick: s.tick,
      });
      node.metaAwarenessScore = maState.metaAwarenessLevel;

      // State changes from action
      switch (packet.action_type) {
        case "MOVE":
          node.morale = Math.min(1, node.morale + 0.01);
          node.burdenLevel = Math.max(0, node.burdenLevel - 0.005);
          break;
        case "RETREAT":
        case "FREEZE":
          node.uncertaintyLevel = Math.min(1, node.uncertaintyLevel + 0.01);
          break;
        case "ESCALATE":
          node.burdenLevel = Math.min(1, node.burdenLevel + 0.02);
          node.supplyStatus = Math.max(0, node.supplyStatus - 0.005);
          break;
        case "INVESTIGATE":
          node.uncertaintyLevel = Math.max(0, node.uncertaintyLevel - 0.01);
          break;
        default:
          node.supplyStatus = Math.min(1, node.supplyStatus + 0.003);
      }

      // Cumulative score
      const tickScore =
        packet.confidence * node.morale * (1 - node.burdenLevel * 0.5);
      node.cumulativeScore += tickScore;

      const outcome: "success" | "failure" | "neutral" =
        packet.action_type === "MOVE" || packet.action_type === "INVESTIGATE"
          ? Math.random() < packet.confidence
            ? "success"
            : "neutral"
          : packet.action_type === "RETREAT" || packet.action_type === "FREEZE"
            ? "neutral"
            : "failure";

      newTraces.push({
        tick: s.tick,
        nodeId: node.id,
        layer: node.layer,
        faction: node.faction,
        actionType: packet.action_type,
        confidence: packet.confidence,
        metaAwarenessScore: node.metaAwarenessScore,
        outcome,
      });
    }

    // Theater-level stats
    const allBurden =
      s.nodes.reduce((a, n) => a + n.burdenLevel, 0) / s.nodes.length;
    s.strategicPressure = Math.min(1, allBurden * 1.2);
    const allSupply =
      s.nodes.reduce((a, n) => a + n.supplyStatus, 0) / s.nodes.length;
    s.logisticsHealth = allSupply;
    const allUncertainty =
      s.nodes.reduce((a, n) => a + n.uncertaintyLevel, 0) / s.nodes.length;
    s.sensingUncertainty = allUncertainty;

    // Scores
    s.deltaScore = s.nodes
      .filter((n) => n.faction === "delta")
      .reduce((a, n) => a + n.cumulativeScore, 0);
    s.alphaScore = s.nodes
      .filter((n) => n.faction === "alpha")
      .reduce((a, n) => a + n.cumulativeScore, 0);
    s.omegaScore = s.nodes
      .filter((n) => n.faction === "omega")
      .reduce((a, n) => a + n.cumulativeScore, 0);

    s.traceLog = [...newTraces, ...s.traceLog].slice(0, 60);

    return { ...s, nodes: s.nodes.map((n) => ({ ...n })) };
  }

  getLeaderboard(): { delta: number; alpha: number; omega: number } {
    if (!this.state) return { delta: 0, alpha: 0, omega: 0 };
    return {
      delta: this.state.deltaScore,
      alpha: this.state.alphaScore,
      omega: this.state.omegaScore,
    };
  }

  getState(): TheaterState | null {
    return this.state;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  private _emptyState(): TheaterState {
    return {
      tick: 0,
      sessionId: "none",
      nodes: [],
      deltaScore: 0,
      alphaScore: 0,
      omegaScore: 0,
      strategicPressure: 0,
      logisticsHealth: 1,
      sensingUncertainty: 0,
      traceLog: [],
    };
  }
}

export const globalWarCommandOpsRuntime = new WarCommandOpsRuntime();
