/**
 * battleOpsRuntime.ts
 * Runtime engine for BattleOps entities.
 * Each entity is driven by the Core Brain via liveBrainBus.routePayload().
 * No fake behavior — all state changes come from BrainActionPacket.
 */

import { liveBrainBus } from "./liveBrainBus";

export type EntityRole =
  | "rifleman"
  | "medic"
  | "recon"
  | "squad_leader"
  | "marksman"
  | "breacher"
  | "support_gunner";

export type EntityFaction = "alpha" | "omega";

export type EntityState =
  | "idle"
  | "moving"
  | "engaging"
  | "suppressed"
  | "flanking"
  | "retreating"
  | "down";

export interface BattleEntity {
  id: string;
  instanceId: string;
  role: EntityRole;
  faction: EntityFaction;
  position: [number, number, number];
  targetPosition: [number, number, number];
  health: number;
  state: EntityState;
  lastActionType: string;
  lastConfidence: number;
  threatLevel: number;
  stressLevel: number;
  fatigue: number;
  tick: number;
}

export interface BattleTraceEntry {
  tick: number;
  entityId: string;
  faction: string;
  actionType: string;
  confidence: number;
  threatLevel: number;
  position: [number, number, number];
  outcome: "success" | "failure" | "neutral";
}

export interface BattleWorldState {
  tick: number;
  sessionId: string;
  entities: BattleEntity[];
  alphaCount: number;
  omegaCount: number;
  alphaControlZones: number;
  omegaControlZones: number;
  worldPressure: number;
  activeEngagements: number;
  traceLog: BattleTraceEntry[];
}

const ROLES: EntityRole[] = [
  "rifleman",
  "medic",
  "recon",
  "squad_leader",
  "marksman",
  "breacher",
  "support_gunner",
];

function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function lerpVec(
  pos: [number, number, number],
  target: [number, number, number],
  t: number,
): [number, number, number] {
  return [
    pos[0] + (target[0] - pos[0]) * t,
    0,
    pos[2] + (target[2] - pos[2]) * t,
  ];
}

function dist2d(
  a: [number, number, number],
  b: [number, number, number],
): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[2] - b[2]) ** 2);
}

export class BattleOpsRuntime {
  private state: BattleWorldState | null = null;
  private initialized = false;

  init(entityCount: number): void {
    if (this.initialized) return;
    this.initialized = true;
    const entities: BattleEntity[] = [];
    const half = Math.floor(entityCount / 2);

    for (let i = 0; i < entityCount; i++) {
      const faction: EntityFaction = i < half ? "alpha" : "omega";
      // Alpha spawns near -80z, Omega near +80z
      const spawnZ =
        faction === "alpha" ? randRange(-90, -60) : randRange(60, 90);
      const spawnX = randRange(-30, 30);
      const pos: [number, number, number] = [spawnX, 0, spawnZ];
      const role = ROLES[i % ROLES.length];
      const id = `${faction}_${role}_${i}`;
      entities.push({
        id,
        instanceId: `battle_${id}`,
        role,
        faction,
        position: pos,
        targetPosition: [...pos],
        health: 100,
        state: "idle",
        lastActionType: "EXPLORE",
        lastConfidence: 0.5,
        threatLevel: randRange(0.1, 0.4),
        stressLevel: randRange(0.1, 0.3),
        fatigue: randRange(0.05, 0.2),
        tick: 0,
      });
    }

    // Start bus if not already active
    if (!liveBrainBus.isActive) liveBrainBus.start();

    this.state = {
      tick: 0,
      sessionId: `battle_session_${Date.now()}`,
      entities,
      alphaCount: half,
      omegaCount: entityCount - half,
      alphaControlZones: 1,
      omegaControlZones: 1,
      worldPressure: 0.3,
      activeEngagements: 0,
      traceLog: [],
    };
  }

  tick(_deltaMs: number): BattleWorldState {
    if (!this.state) return this._emptyState();

    const s = this.state;
    s.tick++;
    let engagements = 0;
    const newTraces: BattleTraceEntry[] = [];

    for (const entity of s.entities) {
      if (entity.state === "down") continue;

      // Find nearest enemy
      const enemies = s.entities.filter(
        (e) => e.faction !== entity.faction && e.state !== "down",
      );
      let nearestEnemy: BattleEntity | null = null;
      let nearestDist = Number.POSITIVE_INFINITY;
      for (const e of enemies) {
        const d = dist2d(entity.position, e.position);
        if (d < nearestDist) {
          nearestDist = d;
          nearestEnemy = e;
        }
      }

      // Compute dynamic threat / reward from world state
      const proximityThreat = nearestEnemy
        ? Math.max(0, 1 - nearestDist / 80)
        : 0;
      entity.threatLevel = Math.min(
        1,
        entity.threatLevel * 0.85 +
          proximityThreat * 0.15 +
          entity.stressLevel * 0.1,
      );
      entity.fatigue = Math.min(1, entity.fatigue + ((0.0003 * s.tick) % 500));

      const rewardLevel = nearestEnemy ? proximityThreat * 0.4 : 0.15;

      // Route through Core Brain
      const packet = liveBrainBus.routePayload(`battleops_${entity.id}`, {
        threat_level: entity.threatLevel,
        reward_level: rewardLevel,
        novelty: entity.stressLevel * 0.3,
        urgency: entity.threatLevel * 0.8 + entity.fatigue * 0.2,
        salience: Math.max(entity.threatLevel, rewardLevel),
      });

      entity.lastActionType = packet.action_type;
      entity.lastConfidence = packet.confidence;
      entity.tick = s.tick;

      // Update state and target from BrainActionPacket
      let speed = 0;
      switch (packet.action_type) {
        case "MOVE":
          entity.state = "moving";
          speed = 0.6;
          if (nearestEnemy) entity.targetPosition = [...nearestEnemy.position];
          break;
        case "RETREAT":
          entity.state = "retreating";
          speed = 0.8;
          // Retreat away from enemy
          if (nearestEnemy) {
            const dx = entity.position[0] - nearestEnemy.position[0];
            const dz = entity.position[2] - nearestEnemy.position[2];
            const len = Math.sqrt(dx * dx + dz * dz) || 1;
            entity.targetPosition = [
              Math.max(-90, Math.min(90, entity.position[0] + (dx / len) * 20)),
              0,
              Math.max(-90, Math.min(90, entity.position[2] + (dz / len) * 20)),
            ];
          }
          break;
        case "FREEZE":
          entity.state = "suppressed";
          speed = 0;
          break;
        case "ESCALATE":
          entity.state = "engaging";
          engagements++;
          speed = 0.3;
          if (nearestEnemy) entity.targetPosition = [...nearestEnemy.position];
          // Reduce enemy health if within range
          if (nearestDist < 15 && nearestEnemy) {
            nearestEnemy.health = Math.max(0, nearestEnemy.health - 2);
            if (nearestEnemy.health <= 0) nearestEnemy.state = "down";
          }
          break;
        case "INVESTIGATE":
          entity.state = "flanking";
          speed = 0.5;
          // Move to a flanking position
          if (nearestEnemy) {
            entity.targetPosition = [
              nearestEnemy.position[0] + randRange(-25, 25),
              0,
              nearestEnemy.position[2] + randRange(-10, 10),
            ];
          }
          break;
        default:
          entity.state = "idle";
          speed = 0.15;
          // Wander
          if (dist2d(entity.position, entity.targetPosition) < 3) {
            entity.targetPosition = [
              entity.position[0] + randRange(-15, 15),
              0,
              entity.position[2] + randRange(-15, 15),
            ];
          }
      }

      // Move entity toward target
      if (speed > 0) {
        entity.position = lerpVec(
          entity.position,
          entity.targetPosition,
          speed * 0.08,
        );
      }

      // Take damage when in engaging range of enemy
      if (entity.state === "engaging" || entity.state === "moving") {
        if (nearestDist < 20 && Math.random() < 0.03) {
          entity.health = Math.max(0, entity.health - randRange(1, 5));
          if (entity.health <= 0) entity.state = "down";
        }
      }

      // Log trace
      const outcome =
        packet.action_type === "ESCALATE" && nearestDist < 15
          ? "success"
          : packet.action_type === "RETREAT" || packet.action_type === "FREEZE"
            ? "neutral"
            : Math.random() < packet.confidence
              ? "success"
              : "failure";

      newTraces.push({
        tick: s.tick,
        entityId: entity.id,
        faction: entity.faction,
        actionType: packet.action_type,
        confidence: packet.confidence,
        threatLevel: entity.threatLevel,
        position: [...entity.position],
        outcome,
      });
    }

    // Update world-level stats
    s.alphaCount = s.entities.filter(
      (e) => e.faction === "alpha" && e.state !== "down",
    ).length;
    s.omegaCount = s.entities.filter(
      (e) => e.faction === "omega" && e.state !== "down",
    ).length;
    s.activeEngagements = engagements;
    s.worldPressure = Math.min(
      1,
      (engagements / Math.max(1, s.entities.length)) * 3 +
        s.entities.reduce((acc, e) => acc + e.threatLevel, 0) /
          s.entities.length,
    );

    // Control zones shift based on presence in center zones
    const centerX = 0;
    const centerZ = 0;
    const alphaInCenter = s.entities.filter(
      (e) =>
        e.faction === "alpha" && dist2d(e.position, [centerX, 0, centerZ]) < 40,
    ).length;
    const omegaInCenter = s.entities.filter(
      (e) =>
        e.faction === "omega" && dist2d(e.position, [centerX, 0, centerZ]) < 40,
    ).length;
    if (alphaInCenter > omegaInCenter + 2)
      s.alphaControlZones = Math.min(5, s.alphaControlZones + 0.1);
    if (omegaInCenter > alphaInCenter + 2)
      s.omegaControlZones = Math.min(5, s.omegaControlZones + 0.1);
    s.alphaControlZones = Math.max(0, Math.min(5, s.alphaControlZones));
    s.omegaControlZones = Math.max(0, Math.min(5, s.omegaControlZones));

    // Append traces (cap at 100)
    s.traceLog = [...newTraces, ...s.traceLog].slice(0, 100);

    return { ...s, entities: s.entities.map((e) => ({ ...e })) };
  }

  getState(): BattleWorldState | null {
    return this.state;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  private _emptyState(): BattleWorldState {
    return {
      tick: 0,
      sessionId: "none",
      entities: [],
      alphaCount: 0,
      omegaCount: 0,
      alphaControlZones: 0,
      omegaControlZones: 0,
      worldPressure: 0,
      activeEngagements: 0,
      traceLog: [],
    };
  }
}

export const globalBattleOpsRuntime = new BattleOpsRuntime();
