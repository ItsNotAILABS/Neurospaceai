/**
 * liveBrainBus.ts
 * Singleton payload router: connects adapter sessions to the Core Brain.
 * Every routed payload creates a trace entry and returns a BrainActionPacket.
 * If a neural step function is registered, it drives action selection.
 */

import { globalBrainInstanceManager } from "./brainInstanceManager";

// ── Typed discriminated union for action_params ────────────────────────────
export type ActionParams =
  | {
      action_type: "MOVE";
      direction: { x: number; y: number; z: number };
      velocity: number;
      sprint: boolean;
    }
  | {
      action_type: "ATTACK";
      target_id: string;
      force: number;
      weapon_type: string;
      confidence: number;
    }
  | {
      action_type: "RETREAT";
      direction: { x: number; y: number; z: number };
      urgency: number;
    }
  | {
      action_type: "INVESTIGATE";
      target_position: { x: number; y: number; z: number };
      curiosity: number;
    }
  | {
      action_type: "INTERACT";
      target_id: string;
      interaction_type: string;
      intent: string;
    }
  | { action_type: "FREEZE"; duration_ms: number; reason: string }
  | {
      action_type: "ISSUE_ORDER";
      order_type: string;
      scope_id: string;
      priority: number;
      parameters: Record<string, unknown>;
    }
  | {
      action_type: "ALLOCATE_RESOURCE";
      resource_type: string;
      amount: number;
      target_scope: string;
    }
  | {
      action_type: "ROUTE_SELECT";
      route_id: string;
      confidence: number;
      fallback_route_id?: string;
    }
  | { action_type: "HOLD_POSITION"; duration_ms: number; readiness: number }
  | { action_type: "RECOVER"; recovery_type: string; intensity: number }
  | {
      action_type: "ESCALATE";
      escalation_type: string;
      target_layer: string;
      urgency: number;
    }
  | { action_type: "IDLE"; reason: string; duration_ms: number };

export type BrainActionPacket = {
  trace_id: string;
  instance_id: string;
  action_type: ActionParams["action_type"];
  action_params: ActionParams;
  confidence: number;
  salience_score: number;
  predicted_outcome: number;
  timestamp: number;
};

export type BusStatus = {
  isActive: boolean;
  payloadsRouted: number;
  packetsReturned: number;
  latencyMs: number;
};

type TraceEntry = {
  trace_id: string;
  adapter_id: string;
  instance_id: string;
  payload_summary: string;
  packet: BrainActionPacket;
  latency_ms: number;
  timestamp: number;
};

// ── Helper: build typed ActionParams from neural outputs ─────────────────
function buildActionParams(
  actionType: ActionParams["action_type"],
  inputs: {
    threatLevel: number;
    rewardLevel: number;
    urgency: number;
    novelty: number;
    fatigue: number;
    velocity: number;
    approachAvoid: number;
  },
  confidence: number,
): ActionParams {
  const dir = (bias: number) => ({
    x: Math.cos(bias * Math.PI) * 0.7,
    y: 0,
    z: Math.sin(bias * Math.PI) * 0.7,
  });

  switch (actionType) {
    case "MOVE":
      return {
        action_type: "MOVE",
        direction: dir(inputs.approachAvoid),
        velocity: inputs.velocity,
        sprint: inputs.urgency > 0.65,
      };
    case "ATTACK":
      return {
        action_type: "ATTACK",
        target_id: "nearest_threat",
        force: inputs.threatLevel,
        weapon_type: inputs.threatLevel > 0.8 ? "primary" : "secondary",
        confidence,
      };
    case "RETREAT":
      return {
        action_type: "RETREAT",
        direction: dir(-inputs.approachAvoid),
        urgency: inputs.threatLevel,
      };
    case "INVESTIGATE":
      return {
        action_type: "INVESTIGATE",
        target_position: dir(inputs.novelty),
        curiosity: inputs.novelty,
      };
    case "FREEZE":
      return {
        action_type: "FREEZE",
        duration_ms: Math.round(200 + inputs.threatLevel * 800),
        reason:
          inputs.threatLevel > 0.85 ? "extreme_threat" : "threat_assessment",
      };
    case "ESCALATE":
      return {
        action_type: "ESCALATE",
        escalation_type: inputs.urgency > 0.8 ? "critical" : "elevated",
        target_layer: "command",
        urgency: inputs.urgency,
      };
    case "RECOVER":
      return {
        action_type: "RECOVER",
        recovery_type: inputs.fatigue > 0.7 ? "rest" : "regroup",
        intensity: 1 - inputs.fatigue,
      };
    case "HOLD_POSITION":
      return {
        action_type: "HOLD_POSITION",
        duration_ms: 2000,
        readiness: confidence,
      };
    case "ISSUE_ORDER":
      return {
        action_type: "ISSUE_ORDER",
        order_type: "advance",
        scope_id: "squad",
        priority: Math.round(inputs.urgency * 10),
        parameters: { threat: inputs.threatLevel, reward: inputs.rewardLevel },
      };
    case "ALLOCATE_RESOURCE":
      return {
        action_type: "ALLOCATE_RESOURCE",
        resource_type: "ammo",
        amount: Math.round(inputs.rewardLevel * 100),
        target_scope: "local",
      };
    case "ROUTE_SELECT":
      return {
        action_type: "ROUTE_SELECT",
        route_id: inputs.approachAvoid > 0 ? "route_alpha" : "route_bravo",
        confidence,
      };
    case "INTERACT":
      return {
        action_type: "INTERACT",
        target_id: "nearest_object",
        interaction_type: "inspect",
        intent: "gather_intel",
      };
    default:
      return {
        action_type: "IDLE",
        reason: "low_salience",
        duration_ms: 500,
      };
  }
}

class LiveBrainBus {
  private _isActive = false;
  private _payloadsRouted = 0;
  private _packetsReturned = 0;
  private _lastLatencyMs = 0;
  private _traceLog: TraceEntry[] = [];
  private _packetLog: BrainActionPacket[] = [];
  private _persistDebounce: ReturnType<typeof setTimeout> | null = null;

  // Registered neural step function — when set, drives real neural computation
  private _neuralStepRef:
    | ((inputs: Record<string, number>) => Record<string, number>)
    | null = null;

  constructor() {
    try {
      const saved = localStorage.getItem("brain_bus_state");
      if (saved) {
        const s = JSON.parse(saved) as {
          packetsReturned?: number;
          payloadsRouted?: number;
          traceLog?: TraceEntry[];
        };
        this._packetsReturned = s.packetsReturned ?? 0;
        this._payloadsRouted = s.payloadsRouted ?? 0;
        this._traceLog = s.traceLog ?? [];
      }
    } catch {
      // ignore
    }
  }

  private _schedulePersist(): void {
    if (this._persistDebounce) clearTimeout(this._persistDebounce);
    this._persistDebounce = setTimeout(() => {
      try {
        localStorage.setItem(
          "brain_bus_state",
          JSON.stringify({
            packetsReturned: this._packetsReturned,
            payloadsRouted: this._payloadsRouted,
            traceLog: this._traceLog.slice(0, 50),
          }),
        );
      } catch {
        // ignore
      }
    }, 500);
  }

  /**
   * Register a neural step function from the live simulation.
   * When registered, routePayload uses real neural computation to determine
   * action type and confidence instead of scalar heuristics.
   */
  registerNeuralStep(
    fn: (inputs: Record<string, number>) => Record<string, number>,
  ): void {
    this._neuralStepRef = fn;
  }

  isNeuralStepRegistered(): boolean {
    return this._neuralStepRef !== null;
  }

  start(): void {
    this._isActive = true;
  }

  stop(): void {
    this._isActive = false;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  getBusStatus(): BusStatus {
    return {
      isActive: this._isActive,
      payloadsRouted: this._payloadsRouted,
      packetsReturned: this._packetsReturned,
      latencyMs: this._lastLatencyMs,
    };
  }

  /**
   * Route a perception payload through the Core Brain and return a BrainActionPacket.
   * If _neuralStepRef is set, action type and confidence come from real neural output.
   * Otherwise falls back to scalar heuristics.
   */
  routePayload(
    adapterId: string,
    perceptionPayload: {
      threat_level?: number;
      reward_level?: number;
      novelty?: number;
      urgency?: number;
      salience?: number;
      fatigue?: number;
    },
  ): BrainActionPacket {
    if (!this._isActive) this._isActive = true; // auto-activate on first payload
    const t0 = performance.now();
    this._payloadsRouted++;

    // Get or create an instance for this adapter
    const instanceId = `adapter_${adapterId}_instance`;
    let inst = globalBrainInstanceManager.getState(instanceId);
    if (!inst) {
      const newId = globalBrainInstanceManager.create({
        instanceId,
        instanceType: "individual_agent",
      });
      inst = globalBrainInstanceManager.getState(newId);
    }

    const threatLevel = perceptionPayload.threat_level ?? 0;
    const rewardLevel = perceptionPayload.reward_level ?? 0;
    const urgency = perceptionPayload.urgency ?? 0;
    const salience = perceptionPayload.salience ?? 0.5;
    const novelty = perceptionPayload.novelty ?? 0;
    const fatigue = perceptionPayload.fatigue ?? 0.3;
    const velocity = Math.max(0.1, 1 - threatLevel * 0.8);
    const approachAvoid = rewardLevel - threatLevel;

    let actionType: ActionParams["action_type"] = "IDLE";
    let confidence = Math.max(
      0.1,
      1 - Math.abs(threatLevel - rewardLevel) * 0.5,
    );

    if (this._neuralStepRef) {
      // ── Real neural computation path ──────────────────────────────────────
      const neural = this._neuralStepRef({
        threatLevel,
        rewardLevel,
        urgency,
        novelty,
        fatigue,
      });

      const pfcOut = neural.pfcOut ?? 0.5;
      const amygOut = neural.amygOut ?? threatLevel;
      const nacOut = neural.nacOut ?? rewardLevel;
      const arousal = neural.arousal ?? urgency;

      if (amygOut > 0.7) {
        actionType = "FREEZE";
      } else if (amygOut > 0.45 && nacOut < 0.4) {
        actionType = fatigue > 0.7 ? "RECOVER" : "RETREAT";
      } else if (nacOut > 0.55 && amygOut < 0.5) {
        actionType = "MOVE";
      } else if (arousal > 0.65 && pfcOut > 0.5) {
        actionType = "ESCALATE";
      } else if (
        neural.noveltyOut !== undefined
          ? neural.noveltyOut > 0.5
          : novelty > 0.5
      ) {
        actionType = "INVESTIGATE";
      } else {
        actionType = "IDLE";
      }

      confidence = Math.max(
        0.1,
        Math.min(1.0, pfcOut * 0.6 + (1 - Math.abs(arousal - 0.5)) * 0.4),
      );
    } else {
      // ── Scalar fallback path ───────────────────────────────────────────────
      if (threatLevel > 0.7) actionType = "FREEZE";
      else if (threatLevel > 0.4)
        actionType = fatigue > 0.7 ? "RECOVER" : "RETREAT";
      else if (rewardLevel > 0.6) actionType = "MOVE";
      else if (urgency > 0.7) actionType = "ESCALATE";
      else if (novelty > 0.5) actionType = "INVESTIGATE";
      else actionType = "IDLE";
    }

    const predictedOutcome =
      rewardLevel * 0.7 - threatLevel * 0.5 + novelty * 0.2;

    const actionParams = buildActionParams(
      actionType,
      {
        threatLevel,
        rewardLevel,
        urgency,
        novelty,
        fatigue,
        velocity,
        approachAvoid,
      },
      confidence,
    );

    const packet: BrainActionPacket = {
      trace_id: `trace_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      instance_id: instanceId,
      action_type: actionType,
      action_params: actionParams,
      confidence,
      salience_score: salience,
      predicted_outcome: Math.max(-1, Math.min(1, predictedOutcome)),
      timestamp: Date.now(),
    };

    const latencyMs = performance.now() - t0;
    this._lastLatencyMs = Math.round(latencyMs * 10) / 10;
    this._packetsReturned++;
    this._schedulePersist();

    const entry: TraceEntry = {
      trace_id: packet.trace_id,
      adapter_id: adapterId,
      instance_id: instanceId,
      payload_summary: `threat=${(threatLevel * 100).toFixed(0)}% reward=${(rewardLevel * 100).toFixed(0)}% urgency=${(urgency * 100).toFixed(0)}%`,
      packet,
      latency_ms: this._lastLatencyMs,
      timestamp: Date.now(),
    };
    this._traceLog.unshift(entry);
    if (this._traceLog.length > 200) this._traceLog.pop();

    return packet;
  }

  /**
   * Log a pre-computed BrainActionPacket (from avatar motor output loop).
   */
  logPacket(packet: BrainActionPacket): void {
    this._packetLog.unshift(packet);
    if (this._packetLog.length > 100) this._packetLog.pop();
    this._packetsReturned++;
  }

  /**
   * Verify live status for an adapter.
   */
  verifyLive(
    adapterId: string,
  ): import("./externalBindContract").VerifyLiveResult {
    const recent = this._packetLog[0];
    const lastPacketMs = recent
      ? Date.now() - recent.timestamp
      : Number.POSITIVE_INFINITY;
    return {
      adapterId,
      is_live: this._isActive && this._packetsReturned > 0,
      session_active: this._isActive,
      packets_returned: this._packetsReturned,
      last_packet_ms: lastPacketMs,
      latency_ms: this._lastLatencyMs,
      contract_version: "1.0.0",
    };
  }

  getTraceLog(): TraceEntry[] {
    return this._traceLog;
  }

  getPacketLog(): BrainActionPacket[] {
    return this._packetLog;
  }

  getRecentPacket(): BrainActionPacket | null {
    return this._packetLog[0] ?? null;
  }
}

// Singleton export
export const liveBrainBus = new LiveBrainBus();
