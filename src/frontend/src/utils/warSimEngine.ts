/**
 * warSimEngine.ts
 * Unified enterprise war simulation engine.
 * Three factions, full command hierarchy, unlimited soldiers, action tracking.
 * Driven by liveBrainBus state for emergent tactical AI.
 */

import { liveBrainBus } from "./liveBrainBus";

// ── Types ──────────────────────────────────────────────────────────────────

export type Faction = "IRON" | "VANGUARD" | "PHANTOM";
export type UnitType =
  | "rifleman"
  | "marksman"
  | "breacher"
  | "recon"
  | "medic"
  | "support_gunner";
export type UnitStatus = "active" | "wounded" | "kia";
export type CommandLayer =
  | "theater"
  | "operational"
  | "regional"
  | "squad"
  | "unit";
export type UnitAction =
  | "advance"
  | "hold"
  | "flank"
  | "support"
  | "suppress"
  | "breach"
  | "extract"
  | "recon"
  | "overwatch"
  | "rally"
  | "idle";

export type BattleOutcome = "success" | "partial" | "failure" | "neutral";

export interface Unit {
  id: string;
  type: UnitType;
  faction: Faction;
  commandLayer: CommandLayer;
  parentId: string | null;
  hp: number; // 0–100
  status: UnitStatus;
  position: { x: number; z: number };
  currentAction: UnitAction;
  actionCount: number;
  kills: number;
  assists: number;
  morale: number; // 0–1
  fatigue: number; // 0–1
  label: string;
}

export interface BattleLogEntry {
  tick: number;
  unitId: string;
  unitType: UnitType | CommandLayer;
  faction: Faction;
  action: string;
  outcome: BattleOutcome;
  x: number;
  z: number;
  isTheaterEvent?: boolean;
  message?: string;
}

export interface FactionStats {
  faction: Faction;
  color: string;
  totalUnits: number;
  activeUnits: number;
  woundedUnits: number;
  kia: number;
  objectivesHeld: number;
  morale: number;
  logisticsHealth: number;
  commsStatus: "operational" | "degraded" | "blackout";
  airSupportAvailable: boolean;
  strategicPressure: number;
}

export interface CommandNode {
  id: string;
  faction: Faction;
  layer: CommandLayer;
  label: string;
  parentId: string | null;
  childIds: string[];
  position: { x: number; z: number };
  aliveUnitsUnder: number;
  morale: number;
  burden: number; // 0–1
  lastOrder: string;
  lastOrderTick: number;
  lastOrderConfidence: number;
  lastOrderOutcome: BattleOutcome;
}

export interface TheaterEvent {
  tick: number;
  type:
    | "supply_drop"
    | "air_support"
    | "comms_blackout"
    | "reinforcement"
    | "ambush";
  faction: Faction;
  message: string;
}

export interface WarSimState {
  tick: number;
  totalActions: number;
  factions: Record<Faction, FactionStats>;
  units: Unit[];
  commandNodes: CommandNode[];
  battleLog: BattleLogEntry[];
  theaterEvents: TheaterEvent[];
  brainInfluence: {
    salience: number;
    arousal: number;
    threat: number;
    tacticalPressure: number;
  };
  activeOrders: Array<{
    nodeId: string;
    nodeFaction: Faction;
    nodeLayer: CommandLayer;
    nodeLabel: string;
    order: string;
    confidence: number;
    outcome: BattleOutcome;
    tick: number;
  }>;
}

// ── Constants ──────────────────────────────────────────────────────────────

const FACTION_COLORS: Record<Faction, string> = {
  IRON: "#f59e0b",
  VANGUARD: "#3b82f6",
  PHANTOM: "#ef4444",
};

const UNIT_TYPES: UnitType[] = [
  "rifleman",
  "marksman",
  "breacher",
  "recon",
  "medic",
  "support_gunner",
];

const ACTIONS: UnitAction[] = [
  "advance",
  "hold",
  "flank",
  "support",
  "suppress",
  "breach",
  "extract",
  "recon",
  "overwatch",
  "rally",
];

const THEATER_COMMANDS: Record<Faction, string> = {
  IRON: "IRON THEATER CMD",
  VANGUARD: "VANGUARD THEATER CMD",
  PHANTOM: "PHANTOM THEATER CMD",
};

const OPERATIONAL_NAMES: Record<Faction, string[]> = {
  IRON: ["IRON OPS ALPHA", "IRON OPS BRAVO"],
  VANGUARD: ["VANGUARD OPS ALPHA", "VANGUARD OPS BRAVO"],
  PHANTOM: ["PHANTOM OPS ALPHA", "PHANTOM OPS BRAVO"],
};

const REGIONAL_NAMES: Record<Faction, string[]> = {
  IRON: ["IRON REG NORTH", "IRON REG CENTRAL", "IRON REG SOUTH"],
  VANGUARD: [
    "VANGUARD REG NORTH",
    "VANGUARD REG CENTRAL",
    "VANGUARD REG SOUTH",
  ],
  PHANTOM: ["PHANTOM REG NORTH", "PHANTOM REG CENTRAL", "PHANTOM REG SOUTH"],
};

const SQUAD_LABELS: Record<Faction, string[]> = {
  IRON: [
    "IRON-SQUAD-A",
    "IRON-SQUAD-B",
    "IRON-SQUAD-C",
    "IRON-SQUAD-D",
    "IRON-SQUAD-E",
    "IRON-SQUAD-F",
    "IRON-SQUAD-G",
    "IRON-SQUAD-H",
    "IRON-SQUAD-I",
  ],
  VANGUARD: [
    "VG-SQUAD-A",
    "VG-SQUAD-B",
    "VG-SQUAD-C",
    "VG-SQUAD-D",
    "VG-SQUAD-E",
    "VG-SQUAD-F",
    "VG-SQUAD-G",
    "VG-SQUAD-H",
    "VG-SQUAD-I",
  ],
  PHANTOM: [
    "PH-SQUAD-A",
    "PH-SQUAD-B",
    "PH-SQUAD-C",
    "PH-SQUAD-D",
    "PH-SQUAD-E",
    "PH-SQUAD-F",
    "PH-SQUAD-G",
    "PH-SQUAD-H",
    "PH-SQUAD-I",
  ],
};

// ── Helpers ────────────────────────────────────────────────────────────────

let _idCounter = 0;
function uid(prefix: string): string {
  return `${prefix}_${(++_idCounter).toString(36)}`;
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randInt(min: number, max: number): number {
  return Math.floor(rand(min, max + 1));
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function actionOutcome(
  _action: UnitAction,
  morale: number,
  fatigue: number,
  threat: number,
): BattleOutcome {
  const base = morale * (1 - fatigue * 0.5);
  const pressure = threat * 0.3;
  const roll = Math.random();
  if (roll < base - pressure) return "success";
  if (roll < base + 0.2) return "partial";
  return "failure";
}

// ── Engine class ───────────────────────────────────────────────────────────

class WarSimEngine {
  private _tick = 0;
  private _totalActions = 0;
  private _units: Map<string, Unit> = new Map();
  private _commandNodes: Map<string, CommandNode> = new Map();
  private _battleLog: BattleLogEntry[] = [];
  private _theaterEvents: TheaterEvent[] = [];
  private _factions: Map<Faction, FactionStats> = new Map();
  private _activeOrders: WarSimState["activeOrders"] = [];
  private _brainInfluence = {
    salience: 0.5,
    arousal: 0.4,
    threat: 0.3,
    tacticalPressure: 0.4,
  };
  private _intervalId: ReturnType<typeof setInterval> | null = null;
  private _lastBrainPollTick = 0;

  constructor() {
    this._initFactions();
    this._generateFaction("IRON");
    this._generateFaction("VANGUARD");
    this._generateFaction("PHANTOM");
    this._startHeartbeat();
    this._startBrainPolling();
  }

  private _initFactions(): void {
    for (const f of ["IRON", "VANGUARD", "PHANTOM"] as Faction[]) {
      this._factions.set(f, {
        faction: f,
        color: FACTION_COLORS[f],
        totalUnits: 0,
        activeUnits: 0,
        woundedUnits: 0,
        kia: 0,
        objectivesHeld: randInt(1, 4),
        morale: rand(0.6, 0.9),
        logisticsHealth: rand(0.7, 1.0),
        commsStatus: "operational",
        airSupportAvailable: Math.random() > 0.5,
        strategicPressure: rand(0.2, 0.6),
      });
    }
  }

  private _generateFaction(faction: Faction): void {
    // Theater command node
    const theaterId = uid(`theater_${faction}`);
    const theaterPos = this._factionBasePos(faction);
    const theaterNode: CommandNode = {
      id: theaterId,
      faction,
      layer: "theater",
      label: THEATER_COMMANDS[faction],
      parentId: null,
      childIds: [],
      position: theaterPos,
      aliveUnitsUnder: 0,
      morale: rand(0.7, 0.95),
      burden: rand(0.1, 0.4),
      lastOrder: "ESTABLISH_THEATER",
      lastOrderTick: 0,
      lastOrderConfidence: 0.9,
      lastOrderOutcome: "success",
    };
    this._commandNodes.set(theaterId, theaterNode);

    // 2 operational command nodes
    for (let op = 0; op < 2; op++) {
      const opId = uid(`operational_${faction}_${op}`);
      const opPos = {
        x: theaterPos.x + rand(-30, 30),
        z: theaterPos.z + rand(-20, 20),
      };
      const opNode: CommandNode = {
        id: opId,
        faction,
        layer: "operational",
        label: OPERATIONAL_NAMES[faction][op],
        parentId: theaterId,
        childIds: [],
        position: opPos,
        aliveUnitsUnder: 0,
        morale: rand(0.65, 0.9),
        burden: rand(0.15, 0.5),
        lastOrder: "ADVANCE",
        lastOrderTick: 0,
        lastOrderConfidence: 0.8,
        lastOrderOutcome: "success",
      };
      this._commandNodes.set(opId, opNode);
      theaterNode.childIds.push(opId);

      // 3 regional commands per operational (but split 2 per op for 3+3 total → actually use all 3 regionals, assign to ops)
      const regionalsPerOp = op === 0 ? [0, 1] : [2];
      for (const ri of regionalsPerOp) {
        const regId = uid(`regional_${faction}_${ri}`);
        const regPos = {
          x: opPos.x + rand(-20, 20),
          z: opPos.z + rand(-15, 15),
        };
        const regNode: CommandNode = {
          id: regId,
          faction,
          layer: "regional",
          label: REGIONAL_NAMES[faction][ri],
          parentId: opId,
          childIds: [],
          position: regPos,
          aliveUnitsUnder: 0,
          morale: rand(0.6, 0.88),
          burden: rand(0.2, 0.55),
          lastOrder: "HOLD_SECTOR",
          lastOrderTick: 0,
          lastOrderConfidence: 0.75,
          lastOrderOutcome: "success",
        };
        this._commandNodes.set(regId, regNode);
        opNode.childIds.push(regId);

        // 3 squads per regional
        const squadIndexBase = ri * 3;
        for (let sq = 0; sq < 3; sq++) {
          const squadLabelIndex = squadIndexBase + sq;
          const squadId = uid(`squad_${faction}_${ri}_${sq}`);
          const squadPos = {
            x: regPos.x + rand(-15, 15),
            z: regPos.z + rand(-10, 10),
          };
          const squadLabel =
            SQUAD_LABELS[faction][
              Math.min(squadLabelIndex, SQUAD_LABELS[faction].length - 1)
            ];
          const squadNode: CommandNode = {
            id: squadId,
            faction,
            layer: "squad",
            label: squadLabel,
            parentId: regId,
            childIds: [],
            position: squadPos,
            aliveUnitsUnder: 0,
            morale: rand(0.55, 0.85),
            burden: rand(0.2, 0.6),
            lastOrder: "PATROL",
            lastOrderTick: 0,
            lastOrderConfidence: 0.7,
            lastOrderOutcome: "success",
          };
          this._commandNodes.set(squadId, squadNode);
          regNode.childIds.push(squadId);

          // 5-8 units per squad
          const unitCount = randInt(5, 8);
          for (let u = 0; u < unitCount; u++) {
            const unitType = UNIT_TYPES[u % UNIT_TYPES.length];
            const unitId = uid(`unit_${faction}`);
            const unit: Unit = {
              id: unitId,
              type: unitType,
              faction,
              commandLayer: "unit",
              parentId: squadId,
              hp: randInt(70, 100),
              status: "active",
              position: {
                x: squadPos.x + rand(-8, 8),
                z: squadPos.z + rand(-8, 8),
              },
              currentAction: pickRandom(ACTIONS),
              actionCount: randInt(0, 5),
              kills: 0,
              assists: 0,
              morale: rand(0.55, 0.9),
              fatigue: rand(0.1, 0.4),
              label: `${faction[0]}-${unitType.substring(0, 3).toUpperCase()}-${u + 1}`,
            };
            this._units.set(unitId, unit);
            squadNode.childIds.push(unitId);
          }
        }
      }
    }

    this._updateFactionStats(faction);
  }

  private _factionBasePos(faction: Faction): { x: number; z: number } {
    switch (faction) {
      case "IRON":
        return { x: -80, z: -80 };
      case "VANGUARD":
        return { x: 80, z: -80 };
      case "PHANTOM":
        return { x: 0, z: 80 };
    }
  }

  private _updateFactionStats(faction: Faction): void {
    const stats = this._factions.get(faction);
    if (!stats) return;
    let total = 0;
    let active = 0;
    let wounded = 0;
    let kia = 0;
    for (const u of this._units.values()) {
      if (u.faction !== faction) continue;
      total++;
      if (u.status === "active") active++;
      else if (u.status === "wounded") wounded++;
      else kia++;
    }
    stats.totalUnits = total;
    stats.activeUnits = active;
    stats.woundedUnits = wounded;
    stats.kia = kia;
    // Update morale from units
    let moraleSum = 0;
    let n = 0;
    for (const u of this._units.values()) {
      if (u.faction === faction && u.status !== "kia") {
        moraleSum += u.morale;
        n++;
      }
    }
    stats.morale = n > 0 ? moraleSum / n : 0;
    // Update command node aliveUnitsUnder
    for (const node of this._commandNodes.values()) {
      if (node.faction !== faction) continue;
      node.aliveUnitsUnder = this._countAliveUnder(node.id);
    }
  }

  private _countAliveUnder(nodeId: string): number {
    const node = this._commandNodes.get(nodeId);
    if (!node) return 0;
    let count = 0;
    for (const childId of node.childIds) {
      if (this._commandNodes.has(childId)) {
        count += this._countAliveUnder(childId);
      } else {
        const unit = this._units.get(childId);
        if (unit && unit.status !== "kia") count++;
      }
    }
    return count;
  }

  private _startHeartbeat(): void {
    this._intervalId = setInterval(() => this._tick_(), 800);
  }

  private _startBrainPolling(): void {
    setInterval(() => {
      try {
        const packet = liveBrainBus.routePayload("warsim_engine", {
          threat_level: this._brainInfluence.threat,
          urgency: this._brainInfluence.tacticalPressure,
          salience: this._brainInfluence.salience,
          novelty: Math.random() * 0.3,
        });
        const newSalience = packet.salience_score;
        const newThreat =
          packet.action_type === "ATTACK" || packet.action_type === "ESCALATE"
            ? Math.min(1, this._brainInfluence.threat + 0.1)
            : Math.max(0, this._brainInfluence.threat - 0.05);
        const newArousal = packet.confidence;
        this.injectBrainState({
          salience: newSalience,
          arousal: newArousal,
          threat: newThreat,
          tacticalPressure: (newSalience + newArousal) / 2,
        });
      } catch {
        // liveBrainBus not active, use self-generated drift
        this.injectBrainState({
          salience: Math.min(
            1,
            Math.max(
              0,
              this._brainInfluence.salience + (Math.random() - 0.5) * 0.1,
            ),
          ),
          arousal: Math.min(
            1,
            Math.max(
              0,
              this._brainInfluence.arousal + (Math.random() - 0.5) * 0.08,
            ),
          ),
          threat: Math.min(
            1,
            Math.max(
              0,
              this._brainInfluence.threat + (Math.random() - 0.5) * 0.06,
            ),
          ),
          tacticalPressure: Math.min(
            1,
            Math.max(
              0,
              this._brainInfluence.tacticalPressure +
                (Math.random() - 0.5) * 0.09,
            ),
          ),
        });
      }
    }, 2000);
  }

  injectBrainState(state: {
    salience: number;
    arousal: number;
    threat: number;
    tacticalPressure: number;
  }): void {
    this._brainInfluence = state;
  }

  private _tick_(): void {
    this._tick++;
    const bi = this._brainInfluence;

    // Theater events triggered by arousal spikes
    if (bi.arousal > 0.75 && Math.random() < 0.15) {
      this._triggerTheaterEvent();
    }

    // Comms blackout recovery
    for (const [f, stats] of this._factions.entries()) {
      if (stats.commsStatus === "blackout" && Math.random() < 0.08) {
        stats.commsStatus = "degraded";
      } else if (stats.commsStatus === "degraded" && Math.random() < 0.12) {
        stats.commsStatus = "operational";
      }
      // Logistics drift
      stats.logisticsHealth = Math.min(
        1,
        Math.max(0.1, stats.logisticsHealth + (Math.random() - 0.52) * 0.02),
      );
      stats.strategicPressure = Math.min(
        1,
        Math.max(
          0,
          stats.strategicPressure +
            (bi.threat - 0.5) * 0.02 +
            (Math.random() - 0.5) * 0.03,
        ),
      );
      this._factions.set(f, stats);
    }

    // Tick all active units
    const units = Array.from(this._units.values());
    const newLogEntries: BattleLogEntry[] = [];

    for (const unit of units) {
      if (unit.status === "kia") continue;

      // Wounded recovery chance
      if (unit.status === "wounded") {
        if (Math.random() < 0.04) unit.status = "active";
        continue;
      }

      // Choose action based on brain state
      const action = this._selectAction(unit, bi);
      unit.currentAction = action;
      unit.actionCount++;
      this._totalActions++;

      // Move unit slightly
      const speed =
        action === "advance"
          ? 1.5
          : action === "flank"
            ? 2
            : action === "extract"
              ? 2.5
              : action === "hold"
                ? 0
                : 0.5;
      const angle =
        Math.atan2(unit.position.z, unit.position.x) +
        (Math.random() - 0.5) * 0.6;
      unit.position.x = Math.max(
        -120,
        Math.min(
          120,
          unit.position.x +
            Math.cos(angle) * speed * (Math.random() * 0.8 + 0.2),
        ),
      );
      unit.position.z = Math.max(
        -120,
        Math.min(
          120,
          unit.position.z +
            Math.sin(angle) * speed * (Math.random() * 0.8 + 0.2),
        ),
      );

      // Fatigue / morale drift
      unit.fatigue = Math.min(
        1,
        unit.fatigue +
          0.002 * (action === "advance" || action === "breach" ? 2 : 1),
      );
      unit.morale = Math.max(
        0.1,
        unit.morale - 0.001 + (Math.random() < 0.1 ? 0.01 : 0),
      );

      // Compute outcome
      const outcome = actionOutcome(
        action,
        unit.morale,
        unit.fatigue,
        bi.threat,
      );

      // Casualties from combat actions under high threat
      if (
        bi.threat > 0.6 &&
        (action === "advance" || action === "breach" || action === "suppress")
      ) {
        const casualtyRoll = Math.random();
        if (casualtyRoll < 0.012) {
          unit.status = "kia";
          unit.hp = 0;
        } else if (casualtyRoll < 0.04) {
          unit.status = "wounded";
          unit.hp = Math.max(10, unit.hp - randInt(20, 40));
        } else {
          unit.hp = Math.max(10, unit.hp - randInt(0, 8));
        }
      }

      // Kills / assists
      if (
        outcome === "success" &&
        (action === "suppress" || action === "advance") &&
        bi.threat > 0.5
      ) {
        if (Math.random() < 0.1) unit.kills++;
        else if (Math.random() < 0.15) unit.assists++;
      }

      // Log every Nth action to keep log manageable but rich
      if (
        this._tick % 2 === 0 ||
        outcome === "failure" ||
        unit.status !== "active"
      ) {
        newLogEntries.push({
          tick: this._tick,
          unitId: unit.id,
          unitType: unit.type,
          faction: unit.faction,
          action,
          outcome,
          x: unit.position.x,
          z: unit.position.z,
        });
      }
    }

    // Issue command orders from command nodes
    if (this._tick % 5 === 0) {
      this._issueCommandOrders();
    }

    // Update faction stats
    for (const f of ["IRON", "VANGUARD", "PHANTOM"] as Faction[]) {
      this._updateFactionStats(f);
    }

    // Rolling battle log (max 500)
    this._battleLog = [...newLogEntries, ...this._battleLog].slice(0, 500);
  }

  private _selectAction(
    unit: Unit,
    bi: {
      salience: number;
      arousal: number;
      threat: number;
      tacticalPressure: number;
    },
  ): UnitAction {
    const tp = bi.tacticalPressure;
    const threat = bi.threat;
    const arousal = bi.arousal;

    // Unit type specialization
    if (unit.type === "medic") {
      return Math.random() < 0.6
        ? "support"
        : threat > 0.7
          ? "extract"
          : "rally";
    }
    if (unit.type === "recon") {
      return Math.random() < 0.5 ? "recon" : threat > 0.6 ? "hold" : "advance";
    }
    if (unit.type === "marksman") {
      return Math.random() < 0.5
        ? "overwatch"
        : threat > 0.7
          ? "suppress"
          : "flank";
    }
    if (unit.type === "support_gunner") {
      return Math.random() < 0.5
        ? "suppress"
        : threat > 0.8
          ? "hold"
          : "advance";
    }
    if (unit.type === "breacher") {
      return tp > 0.65 ? "breach" : threat > 0.7 ? "flank" : "advance";
    }

    // Rifleman default: driven by brain state
    if (arousal > 0.8) return Math.random() < 0.6 ? "advance" : "suppress";
    if (threat > 0.75) return Math.random() < 0.5 ? "hold" : "suppress";
    if (tp > 0.6) return Math.random() < 0.4 ? "advance" : "flank";
    return pickRandom(["advance", "hold", "flank", "overwatch", "recon"]);
  }

  private _issueCommandOrders(): void {
    const bi = this._brainInfluence;
    const orders = [
      "ADVANCE SECTOR",
      "HOLD POSITION",
      "FLANKING MANEUVER",
      "SUPPRESS ENEMY",
      "RECON FORWARD",
      "BREACH POINT",
      "EXTRACT WOUNDED",
      "OVERWATCH RIDGE",
      "RALLY SQUADS",
      "AIR SUPPORT REQUEST",
    ];

    const nodes = Array.from(this._commandNodes.values());
    const commandLayers: CommandLayer[] = [
      "theater",
      "operational",
      "regional",
      "squad",
    ];

    const newOrders: WarSimState["activeOrders"] = [];

    for (const node of nodes) {
      if (!commandLayers.includes(node.layer)) continue;
      if (Math.random() > 0.3) continue; // not every node issues every cycle

      const order = pickRandom(orders);
      const confidence = rand(0.55, 0.95) * (bi.salience * 0.3 + 0.7);
      const outcome = actionOutcome(
        "advance",
        node.morale,
        node.burden,
        bi.threat,
      );

      node.lastOrder = order;
      node.lastOrderTick = this._tick;
      node.lastOrderConfidence = confidence;
      node.lastOrderOutcome = outcome;
      node.burden = Math.min(1, node.burden + 0.02);

      newOrders.push({
        nodeId: node.id,
        nodeFaction: node.faction,
        nodeLayer: node.layer,
        nodeLabel: node.label,
        order,
        confidence,
        outcome,
        tick: this._tick,
      });
    }

    // Keep last 20 orders
    this._activeOrders = [...newOrders, ...this._activeOrders].slice(0, 20);
  }

  private _triggerTheaterEvent(): void {
    const factions: Faction[] = ["IRON", "VANGUARD", "PHANTOM"];
    const faction = pickRandom(factions);
    const types: TheaterEvent["type"][] = [
      "supply_drop",
      "air_support",
      "comms_blackout",
      "reinforcement",
      "ambush",
    ];
    const type = pickRandom(types);

    const messages: Record<TheaterEvent["type"], string> = {
      supply_drop: `${faction} THEATER: Supply drop inbound — logistics restored`,
      air_support: `${faction} THEATER: Air support authorized — CAS executing`,
      comms_blackout: `${faction} THEATER: COMMS BLACKOUT — signal disrupted`,
      reinforcement: `${faction} THEATER: Reinforcements en route — +12 units`,
      ambush: `${faction} THEATER: AMBUSH DETECTED — units under fire`,
    };

    const event: TheaterEvent = {
      tick: this._tick,
      type,
      faction,
      message: messages[type],
    };
    this._theaterEvents = [event, ...this._theaterEvents].slice(0, 50);

    // Apply effects
    const stats = this._factions.get(faction);
    if (stats) {
      if (type === "comms_blackout") stats.commsStatus = "blackout";
      if (type === "air_support") {
        stats.airSupportAvailable = false;
        setTimeout(() => {
          if (stats) stats.airSupportAvailable = true;
        }, 15000);
      }
      if (type === "supply_drop")
        stats.logisticsHealth = Math.min(1, stats.logisticsHealth + 0.2);
      if (type === "reinforcement") {
        // Spawn new units for this faction
        this._spawnReinforcements(faction, 12);
      }
      if (type === "ambush") {
        stats.strategicPressure = Math.min(1, stats.strategicPressure + 0.15);
      }
    }

    // Add to battle log as theater event
    this._battleLog = [
      {
        tick: this._tick,
        unitId: `theater_${faction}`,
        unitType: "theater" as CommandLayer,
        faction,
        action: type,
        outcome: "neutral" as BattleOutcome,
        x: 0,
        z: 0,
        isTheaterEvent: true,
        message: messages[type],
      },
      ...this._battleLog,
    ].slice(0, 500);
  }

  private _spawnReinforcements(faction: Faction, count: number): void {
    const base = this._factionBasePos(faction);
    // Find an existing squad to attach to
    const squads = Array.from(this._commandNodes.values()).filter(
      (n) => n.faction === faction && n.layer === "squad",
    );
    if (squads.length === 0) return;
    const squad = pickRandom(squads);

    for (let i = 0; i < count; i++) {
      const unitType = UNIT_TYPES[i % UNIT_TYPES.length];
      const unitId = uid(`unit_${faction}_reinf`);
      const unit: Unit = {
        id: unitId,
        type: unitType,
        faction,
        commandLayer: "unit",
        parentId: squad.id,
        hp: 100,
        status: "active",
        position: { x: base.x + rand(-10, 10), z: base.z + rand(-10, 10) },
        currentAction: "advance",
        actionCount: 0,
        kills: 0,
        assists: 0,
        morale: rand(0.75, 0.95),
        fatigue: 0.05,
        label: `${faction[0]}-REINF-${i + 1}`,
      };
      this._units.set(unitId, unit);
      squad.childIds.push(unitId);
    }
  }

  getSimState(): WarSimState {
    return {
      tick: this._tick,
      totalActions: this._totalActions,
      factions: Object.fromEntries(this._factions) as Record<
        Faction,
        FactionStats
      >,
      units: Array.from(this._units.values()),
      commandNodes: Array.from(this._commandNodes.values()),
      battleLog: [...this._battleLog],
      theaterEvents: [...this._theaterEvents],
      brainInfluence: { ...this._brainInfluence },
      activeOrders: [...this._activeOrders],
    };
  }

  stop(): void {
    if (this._intervalId) clearInterval(this._intervalId);
  }
}

export const globalWarSimEngine = new WarSimEngine();
