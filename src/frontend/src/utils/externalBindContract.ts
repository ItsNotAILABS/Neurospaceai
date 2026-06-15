/**
 * externalBindContract.ts
 * Publishable contract module for external adapters (BattleOps, WarCommandOps).
 * Copy this file into your adapter project or install as a shared package.
 *
 * CONTRACT_VERSION: 1.0.0
 * PAYLOAD_SCHEMA_VERSION: 1.0.0
 */

import type { ActionParams, BrainActionPacket } from "./liveBrainBus";

export type { BrainActionPacket, ActionParams };

export const CONTRACT_VERSION = "1.0.0";
export const PAYLOAD_SCHEMA_VERSION = "1.0.0";

// ── Canonical instance types ────────────────────────────────────────────────
export const CANONICAL_INSTANCE_TYPES = [
  "individual_agent",
  "medic",
  "recon",
  "support_gunner",
  "rifleman",
  "marksman",
  "breacher",
  "squad_leader",
  "regional_command",
  "faction_command",
  "operational_command",
  "theater_command",
] as const;

export type CanonicalInstanceType = (typeof CANONICAL_INSTANCE_TYPES)[number];

// ── Adapter manifest ────────────────────────────────────────────────────────
export interface AdapterManifest {
  adapterId: string;
  adapterName: string;
  deploymentType: "battleops" | "warcommandops" | "custom";
  contractVersion: string;
  payloadSchemaVersion: string;
  supportedInstanceTypes: CanonicalInstanceType[];
  mutationBoundaryEnforced: boolean;
}

// ── Perception payload ───────────────────────────────────────────────────────
export interface PerceptionPayload {
  threat_level?: number;
  reward_level?: number;
  novelty?: number;
  urgency?: number;
  salience?: number;
  fatigue?: number;
}

// ── Verify-live result ───────────────────────────────────────────────────────
export interface VerifyLiveResult {
  adapterId: string;
  is_live: boolean;
  session_active: boolean;
  packets_returned: number;
  last_packet_ms: number;
  latency_ms: number;
  contract_version: string;
}

// ── Core bind interface method signatures ───────────────────────────────────
export interface CoreBindInterface {
  begin_adapter_session(adapterId: string, manifest: AdapterManifest): string;
  end_adapter_session(sessionId: string): void;
  step_brain(instanceId: string, payload: PerceptionPayload): BrainActionPacket;
  verify_live(adapterId: string): VerifyLiveResult;
  ingest_action_result(result: ExternalActionResult): void;
  ingest_outcome_trace(trace: ExternalOutcomeTrace): void;
  ingest_failure_event(event: ExternalFailureEvent): void;
}

// ── External trace types ─────────────────────────────────────────────────────
export interface ExternalActionResult {
  trace_id: string;
  adapter_id: string;
  instance_id: string;
  action_type: string;
  outcome: "success" | "failure" | "partial";
  reward_signal: number;
  timestamp: number;
}

export interface ExternalOutcomeTrace {
  trace_id: string;
  adapter_id: string;
  scenario_id?: string;
  outcome_summary: string;
  reward: number;
  timestamp: number;
}

export interface ExternalFailureEvent {
  trace_id: string;
  adapter_id: string;
  instance_id: string;
  failure_type: string;
  severity: number;
  timestamp: number;
}

// ── Type-safe action param helpers ──────────────────────────────────────────
// Use these in your adapter to safely route BrainActionPackets to behavior controllers.

export function isMoveAction(
  params: ActionParams,
): params is Extract<ActionParams, { action_type: "MOVE" }> {
  return params.action_type === "MOVE";
}

export function isAttackAction(
  params: ActionParams,
): params is Extract<ActionParams, { action_type: "ATTACK" }> {
  return params.action_type === "ATTACK";
}

export function isRetreatAction(
  params: ActionParams,
): params is Extract<ActionParams, { action_type: "RETREAT" }> {
  return params.action_type === "RETREAT";
}

export function isInvestigateAction(
  params: ActionParams,
): params is Extract<ActionParams, { action_type: "INVESTIGATE" }> {
  return params.action_type === "INVESTIGATE";
}

export function isInteractAction(
  params: ActionParams,
): params is Extract<ActionParams, { action_type: "INTERACT" }> {
  return params.action_type === "INTERACT";
}

export function isFreezeAction(
  params: ActionParams,
): params is Extract<ActionParams, { action_type: "FREEZE" }> {
  return params.action_type === "FREEZE";
}

export function isIssueOrderAction(
  params: ActionParams,
): params is Extract<ActionParams, { action_type: "ISSUE_ORDER" }> {
  return params.action_type === "ISSUE_ORDER";
}

export function isAllocateResourceAction(
  params: ActionParams,
): params is Extract<ActionParams, { action_type: "ALLOCATE_RESOURCE" }> {
  return params.action_type === "ALLOCATE_RESOURCE";
}

export function isRouteSelectAction(
  params: ActionParams,
): params is Extract<ActionParams, { action_type: "ROUTE_SELECT" }> {
  return params.action_type === "ROUTE_SELECT";
}

export function isHoldPositionAction(
  params: ActionParams,
): params is Extract<ActionParams, { action_type: "HOLD_POSITION" }> {
  return params.action_type === "HOLD_POSITION";
}

export function isRecoverAction(
  params: ActionParams,
): params is Extract<ActionParams, { action_type: "RECOVER" }> {
  return params.action_type === "RECOVER";
}

export function isEscalateAction(
  params: ActionParams,
): params is Extract<ActionParams, { action_type: "ESCALATE" }> {
  return params.action_type === "ESCALATE";
}

export function isIdleAction(
  params: ActionParams,
): params is Extract<ActionParams, { action_type: "IDLE" }> {
  return params.action_type === "IDLE";
}

/**
 * Route a BrainActionPacket.action_params to a set of typed handlers.
 * All handlers are optional — unhandled action types are a no-op.
 *
 * Example usage in BattleOps:
 *   routeActionParams(packet.action_params, {
 *     MOVE: (p) => entity.moveTo(p.direction, p.velocity),
 *     ATTACK: (p) => entity.attack(p.target_id, p.force),
 *   });
 */
export function routeActionParams(
  params: ActionParams,
  handlers: Partial<{
    MOVE: (p: Extract<ActionParams, { action_type: "MOVE" }>) => void;
    ATTACK: (p: Extract<ActionParams, { action_type: "ATTACK" }>) => void;
    RETREAT: (p: Extract<ActionParams, { action_type: "RETREAT" }>) => void;
    INVESTIGATE: (
      p: Extract<ActionParams, { action_type: "INVESTIGATE" }>,
    ) => void;
    INTERACT: (p: Extract<ActionParams, { action_type: "INTERACT" }>) => void;
    FREEZE: (p: Extract<ActionParams, { action_type: "FREEZE" }>) => void;
    ISSUE_ORDER: (
      p: Extract<ActionParams, { action_type: "ISSUE_ORDER" }>,
    ) => void;
    ALLOCATE_RESOURCE: (
      p: Extract<ActionParams, { action_type: "ALLOCATE_RESOURCE" }>,
    ) => void;
    ROUTE_SELECT: (
      p: Extract<ActionParams, { action_type: "ROUTE_SELECT" }>,
    ) => void;
    HOLD_POSITION: (
      p: Extract<ActionParams, { action_type: "HOLD_POSITION" }>,
    ) => void;
    RECOVER: (p: Extract<ActionParams, { action_type: "RECOVER" }>) => void;
    ESCALATE: (p: Extract<ActionParams, { action_type: "ESCALATE" }>) => void;
    IDLE: (p: Extract<ActionParams, { action_type: "IDLE" }>) => void;
  }>,
): void {
  switch (params.action_type) {
    case "MOVE":
      handlers.MOVE?.(params);
      break;
    case "ATTACK":
      handlers.ATTACK?.(params);
      break;
    case "RETREAT":
      handlers.RETREAT?.(params);
      break;
    case "INVESTIGATE":
      handlers.INVESTIGATE?.(params);
      break;
    case "INTERACT":
      handlers.INTERACT?.(params);
      break;
    case "FREEZE":
      handlers.FREEZE?.(params);
      break;
    case "ISSUE_ORDER":
      handlers.ISSUE_ORDER?.(params);
      break;
    case "ALLOCATE_RESOURCE":
      handlers.ALLOCATE_RESOURCE?.(params);
      break;
    case "ROUTE_SELECT":
      handlers.ROUTE_SELECT?.(params);
      break;
    case "HOLD_POSITION":
      handlers.HOLD_POSITION?.(params);
      break;
    case "RECOVER":
      handlers.RECOVER?.(params);
      break;
    case "ESCALATE":
      handlers.ESCALATE?.(params);
      break;
    case "IDLE":
      handlers.IDLE?.(params);
      break;
  }
}
