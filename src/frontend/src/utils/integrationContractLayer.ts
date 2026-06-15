export const CONTRACT_VERSION = "1.0.0";

export const SYSTEM_NAMES = {
  core: "NeuroEmergence Core",
  battleOps: "Emergent BattleOps",
  warCommandOps: "Emergent WarCommandOps",
} as const;

export const PAYLOAD_SCHEMA_VERSION = "1.0.0";

export interface AdapterManifest {
  adapterId: string;
  adapterName: string;
  softwareName: string;
  contractVersion: string;
  supportedInstanceTypes: string[];
  supportedRoles: string[];
  payloadSchemaVersion: string;
}

export interface AdapterSession {
  sessionId: string;
  adapterId: string;
  startedAt: number;
  active: boolean;
  callCount: number;
}

export interface IngestPayload {
  sourceAdapterId: string;
  payloadType: string;
  schemaVersion: string;
  data: unknown;
  timestamp: number;
}

const CANONICAL_INSTANCE_TYPES = [
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
];

const CANONICAL_ROLE_OVERLAYS = [
  "medic_overlay",
  "recon_overlay",
  "support_gunner_overlay",
  "rifleman_overlay",
  "marksman_overlay",
  "breacher_overlay",
  "squad_leader_overlay",
  "regional_command_overlay",
  "faction_command_overlay",
  "operational_command_overlay",
  "theater_command_overlay",
];

const CANONICAL_SCOPE_OVERLAYS = [
  "local_tactical_scope",
  "squad_scope",
  "sector_scope",
  "regional_scope",
  "theater_scope",
];

const MUTATION_BLOCKED_OPERATIONS = [
  "mutate_weights",
  "mutate_thresholds",
  "mutate_memory",
  "bypass_arbitration",
  "inject_conclusion",
  "direct_promote",
];

export class IntegrationContractRegistry {
  private adapters = new Map<string, AdapterManifest>();

  register(manifest: AdapterManifest): { success: boolean; reason: string } {
    if (manifest.contractVersion !== CONTRACT_VERSION) {
      return {
        success: false,
        reason: `Version mismatch: expected ${CONTRACT_VERSION}`,
      };
    }
    this.adapters.set(manifest.adapterId, manifest);
    return { success: true, reason: "Registered" };
  }

  get(id: string): AdapterManifest | undefined {
    return this.adapters.get(id);
  }
  getAll(): AdapterManifest[] {
    return [...this.adapters.values()];
  }
  count(): number {
    return this.adapters.size;
  }
}

export class AdapterSessionManager {
  private sessions = new Map<string, AdapterSession>();

  begin(adapterId: string): AdapterSession {
    const session: AdapterSession = {
      sessionId: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      adapterId,
      startedAt: Date.now(),
      active: true,
      callCount: 0,
    };
    this.sessions.set(session.sessionId, session);
    return session;
  }

  end(sessionId: string): void {
    const s = this.sessions.get(sessionId);
    if (s) s.active = false;
  }

  recordCall(sessionId: string): void {
    const s = this.sessions.get(sessionId);
    if (s) s.callCount++;
  }

  getActive(): AdapterSession[] {
    return [...this.sessions.values()].filter((s) => s.active);
  }
}

export class BindingValidationEngine {
  validateBindingMap(bindingMap: Record<string, string>): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    for (const [external, canonical] of Object.entries(bindingMap)) {
      if (
        !CANONICAL_INSTANCE_TYPES.includes(canonical) &&
        !CANONICAL_ROLE_OVERLAYS.includes(canonical)
      ) {
        errors.push(`Unknown canonical type for "${external}": "${canonical}"`);
      }
    }
    return { valid: errors.length === 0, errors };
  }

  getBindingRequirements(instanceType: string): string[] {
    return CANONICAL_INSTANCE_TYPES.includes(instanceType)
      ? ["instanceId", "roleType", "scopeType", "payloadSchemaVersion"]
      : [];
  }
}

export class ExternalAnalyticsIngestService {
  private log: Array<{
    ts: number;
    type: string;
    sourceId: string;
    valid: boolean;
  }> = [];

  private _ingest(
    type: string,
    payload: IngestPayload,
  ): { accepted: boolean; reason: string } {
    if (!payload.sourceAdapterId || !payload.schemaVersion) {
      this.log.push({
        ts: Date.now(),
        type,
        sourceId: payload.sourceAdapterId ?? "unknown",
        valid: false,
      });
      return {
        accepted: false,
        reason: "Missing sourceAdapterId or schemaVersion",
      };
    }
    this.log.push({
      ts: Date.now(),
      type,
      sourceId: payload.sourceAdapterId,
      valid: true,
    });
    return { accepted: true, reason: "Ingested" };
  }

  ingestActionResult(p: IngestPayload) {
    return this._ingest("action_result", p);
  }
  ingestOutcomeTrace(p: IngestPayload) {
    return this._ingest("outcome_trace", p);
  }
  ingestFailureEvent(p: IngestPayload) {
    return this._ingest("failure_event", p);
  }
  ingestRouteOutcome(p: IngestPayload) {
    return this._ingest("route_outcome", p);
  }
  ingestCommandOutcome(p: IngestPayload) {
    return this._ingest("command_outcome", p);
  }
  ingestExperimentResult(p: IngestPayload) {
    return this._ingest("experiment_result", p);
  }

  getLog() {
    return [...this.log];
  }
  getStats() {
    return {
      total: this.log.length,
      valid: this.log.filter((l) => l.valid).length,
      invalid: this.log.filter((l) => !l.valid).length,
    };
  }
}

export class MutationBoundaryEnforcer {
  check(operation: string): { allowed: boolean; reason: string } {
    if (MUTATION_BLOCKED_OPERATIONS.includes(operation)) {
      return {
        allowed: false,
        reason: `Operation "${operation}" is blocked — no external core mutation allowed`,
      };
    }
    return { allowed: true, reason: "Operation within bounds" };
  }
}

export function getSupportedContractVersions(): string[] {
  return [CONTRACT_VERSION];
}
export function getSupportedInstanceTypes(): string[] {
  return CANONICAL_INSTANCE_TYPES;
}
export function getSupportedRoleOverlays(): string[] {
  return CANONICAL_ROLE_OVERLAYS;
}
export function getSupportedScopeOverlays(): string[] {
  return CANONICAL_SCOPE_OVERLAYS;
}

export const globalContractRegistry = new IntegrationContractRegistry();
export const globalSessionManager = new AdapterSessionManager();
export const globalBindingValidator = new BindingValidationEngine();
export const globalIngestService = new ExternalAnalyticsIngestService();
export const globalMutationBoundary = new MutationBoundaryEnforcer();

// Seed Emergent BattleOps + Emergent WarCommandOps adapters
globalContractRegistry.register({
  adapterId: "battleops_adapter_v1",
  adapterName: "BattleOps Integration Adapter",
  softwareName: "Emergent BattleOps",
  contractVersion: CONTRACT_VERSION,
  supportedInstanceTypes: [
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
  ],
  supportedRoles: [
    "medic_overlay",
    "recon_overlay",
    "support_gunner_overlay",
    "rifleman_overlay",
    "marksman_overlay",
    "breacher_overlay",
    "squad_leader_overlay",
    "regional_command_overlay",
    "faction_command_overlay",
  ],
  payloadSchemaVersion: PAYLOAD_SCHEMA_VERSION,
});

globalContractRegistry.register({
  adapterId: "warcommandops_adapter_v1",
  adapterName: "WarCommandOps Integration Adapter",
  softwareName: "Emergent WarCommandOps",
  contractVersion: CONTRACT_VERSION,
  supportedInstanceTypes: [
    "individual_agent",
    "squad_leader",
    "regional_command",
    "faction_command",
    "operational_command",
    "theater_command",
  ],
  supportedRoles: [
    "squad_leader_overlay",
    "regional_command_overlay",
    "faction_command_overlay",
    "operational_command_overlay",
    "theater_command_overlay",
  ],
  payloadSchemaVersion: PAYLOAD_SCHEMA_VERSION,
});
