// useBrainIntegrationSystem — Full Integration Contract Layer
// IntegrationContractRegistry, AdapterCompatibilityRegistry, AdapterSessionManager,
// ExternalAnalyticsIngestService, CandidateChangeRegistry, CanonicalRegistries, ReadinessGate
// No direct promotion — all changes go through validation queue.

import { useCallback, useState } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

export type DeploymentType =
  | "npc"
  | "agent"
  | "scenario"
  | "robotics"
  | "war_game"
  | "command_testbed";

export type AdapterStatus = "active" | "inactive" | "incompatible";

export interface AdapterManifest {
  adapter_id: string;
  adapter_name: string;
  deployment_type: DeploymentType;
  contract_version: string;
  supported_payload_versions: string[];
  supported_instance_types: string[];
  supported_role_overlays: string[];
  supported_scope_overlays: string[];
  analytics_ingest_capabilities: string[];
  registered_at: number;
  status: AdapterStatus;
}

export interface CompatibilityResult {
  compatible: boolean;
  warnings: string[];
  errors: string[];
}

export interface AdapterSession {
  session_id: string;
  adapter_id: string;
  started_at: number;
  status: "active" | "ended";
  event_count: number;
}

export type IngestType =
  | "action_result"
  | "outcome_trace"
  | "failure_event"
  | "route_outcome"
  | "command_outcome"
  | "experiment_result";

export interface IngestEntry {
  id: string;
  source_adapter: string;
  type: IngestType;
  payload_summary: string;
  ingested_at: number;
  schema_valid: boolean;
  attribution: string;
}

export interface IngestStats {
  total: number;
  valid: number;
  invalid: number;
  by_type: Record<IngestType, number>;
}

export type ExternalCandidateStatus =
  | "pending"
  | "reviewing"
  | "promoted"
  | "rejected"
  | "rollback";

export interface ExternalCandidate {
  id: string;
  source_type: "internal" | "external";
  source_adapter_id?: string;
  description: string;
  evidence: string[];
  status: ExternalCandidateStatus;
  submitted_at: number;
  attribution: string;
  review_rationale?: string;
  reviewed_at?: number;
}

export interface MutationBoundaryStatus {
  violations: number;
  boundary_enforced: boolean;
  last_check_ts: number;
}

export interface BindingRequirement {
  instance_type: string;
  required_role_overlays: string[];
  required_scope_overlays: string[];
  authority_level: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// ─── Constants ──────────────────────────────────────────────────────────────

const CURRENT_CONTRACT_VERSION = "1.0.0";
const SUPPORTED_CONTRACT_VERSIONS = ["1.0.0"];

export const CANONICAL_INSTANCE_TYPES = [
  "individual_agent",
  "squad_leader",
  "regional_command",
  "theater_command",
  "tactical_group",
  "sector_command",
  "operational_command",
  "medic_agent",
  "recon_agent",
  "support_agent",
];

export const CANONICAL_ROLE_OVERLAYS = [
  "soldier",
  "medic",
  "recon",
  "support_gunner",
  "squad_leader",
  "regional_command",
  "faction_command",
  "theater_command",
];

export const CANONICAL_SCOPE_OVERLAYS = [
  "local_tactical",
  "squad",
  "sector",
  "regional",
  "theater",
];

const BINDING_REQUIREMENTS: Record<string, BindingRequirement> = {
  individual_agent: {
    instance_type: "individual_agent",
    required_role_overlays: ["soldier", "medic", "recon", "support_gunner"],
    required_scope_overlays: ["local_tactical", "squad"],
    authority_level: "individual",
  },
  squad_leader: {
    instance_type: "squad_leader",
    required_role_overlays: ["squad_leader"],
    required_scope_overlays: ["squad", "sector"],
    authority_level: "squad",
  },
  regional_command: {
    instance_type: "regional_command",
    required_role_overlays: ["regional_command"],
    required_scope_overlays: ["sector", "regional"],
    authority_level: "regional",
  },
  theater_command: {
    instance_type: "theater_command",
    required_role_overlays: ["theater_command", "faction_command"],
    required_scope_overlays: ["regional", "theater"],
    authority_level: "theater",
  },
  tactical_group: {
    instance_type: "tactical_group",
    required_role_overlays: ["squad_leader", "regional_command"],
    required_scope_overlays: ["local_tactical", "squad", "sector"],
    authority_level: "squad",
  },
  sector_command: {
    instance_type: "sector_command",
    required_role_overlays: ["regional_command"],
    required_scope_overlays: ["sector", "regional"],
    authority_level: "sector",
  },
  operational_command: {
    instance_type: "operational_command",
    required_role_overlays: ["regional_command", "faction_command"],
    required_scope_overlays: ["regional", "theater"],
    authority_level: "operational",
  },
  medic_agent: {
    instance_type: "medic_agent",
    required_role_overlays: ["medic"],
    required_scope_overlays: ["local_tactical", "squad"],
    authority_level: "individual",
  },
  recon_agent: {
    instance_type: "recon_agent",
    required_role_overlays: ["recon"],
    required_scope_overlays: ["local_tactical", "squad"],
    authority_level: "individual",
  },
  support_agent: {
    instance_type: "support_agent",
    required_role_overlays: ["support_gunner"],
    required_scope_overlays: ["local_tactical", "squad"],
    authority_level: "individual",
  },
};

const INITIAL_ADAPTERS: AdapterManifest[] = [
  {
    adapter_id: "adapter_npc_001",
    adapter_name: "NPC Runtime Adapter",
    deployment_type: "npc",
    contract_version: "1.0.0",
    supported_payload_versions: ["1.0.0"],
    supported_instance_types: ["individual_agent", "squad_leader"],
    supported_role_overlays: [
      "soldier",
      "medic",
      "recon",
      "support_gunner",
      "squad_leader",
    ],
    supported_scope_overlays: ["local_tactical", "squad", "sector"],
    analytics_ingest_capabilities: [
      "action_result",
      "outcome_trace",
      "failure_event",
    ],
    registered_at: Date.now() - 86400000 * 7,
    status: "active",
  },
  {
    adapter_id: "adapter_agent_001",
    adapter_name: "Adaptive Agent Adapter",
    deployment_type: "agent",
    contract_version: "1.0.0",
    supported_payload_versions: ["1.0.0"],
    supported_instance_types: [
      "individual_agent",
      "recon_agent",
      "medic_agent",
    ],
    supported_role_overlays: ["soldier", "recon", "medic"],
    supported_scope_overlays: ["local_tactical", "squad"],
    analytics_ingest_capabilities: [
      "action_result",
      "experiment_result",
      "route_outcome",
    ],
    registered_at: Date.now() - 86400000 * 5,
    status: "active",
  },
  {
    adapter_id: "adapter_scenario_001",
    adapter_name: "Scenario System Adapter",
    deployment_type: "scenario",
    contract_version: "1.0.0",
    supported_payload_versions: ["1.0.0"],
    supported_instance_types: [
      "tactical_group",
      "sector_command",
      "regional_command",
    ],
    supported_role_overlays: ["squad_leader", "regional_command"],
    supported_scope_overlays: ["squad", "sector", "regional"],
    analytics_ingest_capabilities: [
      "command_outcome",
      "outcome_trace",
      "experiment_result",
    ],
    registered_at: Date.now() - 86400000 * 3,
    status: "active",
  },
  {
    adapter_id: "adapter_wargame_001",
    adapter_name: "Emergent BattleOps",
    deployment_type: "war_game",
    contract_version: "1.0.0",
    supported_payload_versions: ["1.0.0"],
    supported_instance_types: [
      "individual_agent",
      "squad_leader",
      "regional_command",
      "theater_command",
    ],
    supported_role_overlays: CANONICAL_ROLE_OVERLAYS,
    supported_scope_overlays: CANONICAL_SCOPE_OVERLAYS,
    analytics_ingest_capabilities: [
      "action_result",
      "outcome_trace",
      "failure_event",
      "command_outcome",
      "route_outcome",
    ],
    registered_at: Date.now() - 86400000 * 2,
    status: "inactive",
  },
  {
    adapter_id: "adapter_warcommandops_001",
    adapter_name: "Emergent WarCommandOps",
    deployment_type: "scenario",
    contract_version: "1.0.0",
    supported_payload_versions: ["1.0.0"],
    supported_instance_types: [
      "regional_command",
      "operational_command",
      "theater_command",
      "sector_command",
    ],
    supported_role_overlays: [
      "squad_leader",
      "regional_command",
      "faction_command",
      "theater_command",
    ],
    supported_scope_overlays: CANONICAL_SCOPE_OVERLAYS,
    analytics_ingest_capabilities: [
      "command_outcome",
      "outcome_trace",
      "experiment_result",
      "route_outcome",
    ],
    registered_at: Date.now() - 86400000 * 1,
    status: "inactive",
  },
];

const INITIAL_INGEST_LOG: IngestEntry[] = [
  {
    id: "ingest_001",
    source_adapter: "adapter_npc_001",
    type: "action_result",
    payload_summary: "policy=approach, confidence=0.82, outcome=success",
    ingested_at: Date.now() - 3600000,
    schema_valid: true,
    attribution: "NPC Runtime Adapter / instance_id=inst_npc_042",
  },
  {
    id: "ingest_002",
    source_adapter: "adapter_agent_001",
    type: "outcome_trace",
    payload_summary:
      "memory_influence=0.71, prediction_error=0.18, regulation_burden=0.44",
    ingested_at: Date.now() - 2400000,
    schema_valid: true,
    attribution: "Adaptive Agent Adapter / instance_id=inst_agent_007",
  },
  {
    id: "ingest_003",
    source_adapter: "adapter_scenario_001",
    type: "command_outcome",
    payload_summary:
      "sector_held=true, casualty_pressure=0.22, supply_state=nominal",
    ingested_at: Date.now() - 1800000,
    schema_valid: true,
    attribution: "Scenario System Adapter / instance_id=inst_cmd_003",
  },
  {
    id: "ingest_004",
    source_adapter: "adapter_agent_001",
    type: "failure_event",
    payload_summary:
      "route_suppressed=true, failure_type=threat_memory_recall, retry=in_progress",
    ingested_at: Date.now() - 900000,
    schema_valid: true,
    attribution: "Adaptive Agent Adapter / instance_id=inst_agent_012",
  },
];

// ─── Helper: version parsing ─────────────────────────────────────────────────

function parseVersion(v: string): [number, number, number] {
  const parts = v.split(".").map(Number);
  return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0];
}

function isVersionCompatible(
  adapterVersion: string,
  supportedVersions: string[],
): boolean {
  const [aMaj] = parseVersion(adapterVersion);
  return supportedVersions.some((sv) => {
    const [sMaj] = parseVersion(sv);
    return aMaj === sMaj;
  });
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useBrainIntegrationSystem() {
  // IntegrationContractRegistry
  const [adapters, setAdapters] = useState<AdapterManifest[]>(INITIAL_ADAPTERS);

  // AdapterSessionManager
  const [activeSessions, setActiveSessions] = useState<AdapterSession[]>([]);

  // ExternalAnalyticsIngestService
  const [ingestLog, setIngestLog] = useState<IngestEntry[]>(INITIAL_INGEST_LOG);

  // CandidateChangeRegistry
  const [candidateQueue, setCandidateQueue] = useState<ExternalCandidate[]>([]);

  // MutationBoundaryStatus
  const [mutationBoundary] = useState<MutationBoundaryStatus>({
    violations: 0,
    boundary_enforced: true,
    last_check_ts: Date.now(),
  });

  // ─── IntegrationContractRegistry ───────────────────────────────────────────

  const registerAdapter = useCallback(
    (
      manifest: Omit<
        AdapterManifest,
        "adapter_id" | "registered_at" | "status"
      >,
    ) => {
      const compatible = isVersionCompatible(
        manifest.contract_version,
        SUPPORTED_CONTRACT_VERSIONS,
      );
      const newAdapter: AdapterManifest = {
        ...manifest,
        adapter_id: `adapter_${manifest.deployment_type}_${Date.now()}`,
        registered_at: Date.now(),
        status: compatible ? "inactive" : "incompatible",
      };
      setAdapters((prev) => [...prev, newAdapter]);
      return newAdapter.adapter_id;
    },
    [],
  );

  const getAdapterById = useCallback(
    (id: string): AdapterManifest | undefined => {
      return adapters.find((a) => a.adapter_id === id);
    },
    [adapters],
  );

  const deactivateAdapter = useCallback((id: string) => {
    setAdapters((prev) =>
      prev.map((a) =>
        a.adapter_id === id ? { ...a, status: "inactive" as AdapterStatus } : a,
      ),
    );
    setActiveSessions((prev) =>
      prev.map((s) =>
        s.adapter_id === id && s.status === "active"
          ? { ...s, status: "ended" as const }
          : s,
      ),
    );
  }, []);

  const activateAdapter = useCallback((id: string) => {
    setAdapters((prev) =>
      prev.map((a) => {
        if (a.adapter_id !== id) return a;
        if (a.status === "incompatible") return a;
        return { ...a, status: "active" as AdapterStatus };
      }),
    );
  }, []);

  // ─── AdapterCompatibilityRegistry ──────────────────────────────────────────

  const checkCompatibility = useCallback(
    (adapterId: string): CompatibilityResult => {
      const adapter = adapters.find((a) => a.adapter_id === adapterId);
      if (!adapter)
        return {
          compatible: false,
          warnings: [],
          errors: ["Adapter not found"],
        };

      const errors: string[] = [];
      const warnings: string[] = [];

      if (
        !isVersionCompatible(
          adapter.contract_version,
          SUPPORTED_CONTRACT_VERSIONS,
        )
      ) {
        errors.push(
          `Contract version ${adapter.contract_version} not supported (supported: ${SUPPORTED_CONTRACT_VERSIONS.join(", ")})`,
        );
      }

      const unknownInstances = adapter.supported_instance_types.filter(
        (t) => !CANONICAL_INSTANCE_TYPES.includes(t),
      );
      if (unknownInstances.length > 0) {
        warnings.push(`Unknown instance types: ${unknownInstances.join(", ")}`);
      }

      const unknownRoles = adapter.supported_role_overlays.filter(
        (r) => !CANONICAL_ROLE_OVERLAYS.includes(r),
      );
      if (unknownRoles.length > 0) {
        warnings.push(`Unknown role overlays: ${unknownRoles.join(", ")}`);
      }

      return { compatible: errors.length === 0, warnings, errors };
    },
    [adapters],
  );

  const getVersionMismatches = useCallback((): AdapterManifest[] => {
    return adapters.filter(
      (a) =>
        !isVersionCompatible(a.contract_version, SUPPORTED_CONTRACT_VERSIONS),
    );
  }, [adapters]);

  // ─── AdapterSessionManager ─────────────────────────────────────────────────

  const beginSession = useCallback(
    (adapterId: string, readinessPassed: boolean): string | null => {
      if (!readinessPassed) return null;
      const adapter = adapters.find((a) => a.adapter_id === adapterId);
      if (!adapter || adapter.status !== "active") return null;

      const sessionId = `sess_${adapterId}_${Date.now()}`;
      const session: AdapterSession = {
        session_id: sessionId,
        adapter_id: adapterId,
        started_at: Date.now(),
        status: "active",
        event_count: 0,
      };
      setActiveSessions((prev) => [...prev, session]);
      return sessionId;
    },
    [adapters],
  );

  const endSession = useCallback((sessionId: string) => {
    setActiveSessions((prev) =>
      prev.map((s) =>
        s.session_id === sessionId ? { ...s, status: "ended" as const } : s,
      ),
    );
  }, []);

  const getSessionCount = useCallback(
    () => activeSessions.filter((s) => s.status === "active").length,
    [activeSessions],
  );

  // ─── ExternalAnalyticsIngestService ────────────────────────────────────────

  const ingestEvent = useCallback(
    (
      adapterId: string,
      type: IngestType,
      payloadSummary: string,
      attribution?: string,
    ) => {
      const adapter = adapters.find((a) => a.adapter_id === adapterId);
      const schemaValid =
        !!adapter && adapter.analytics_ingest_capabilities.includes(type);
      const entry: IngestEntry = {
        id: `ingest_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        source_adapter: adapterId,
        type,
        payload_summary: payloadSummary,
        ingested_at: Date.now(),
        schema_valid: schemaValid,
        attribution: attribution ?? `${adapter?.adapter_name ?? adapterId}`,
      };
      setIngestLog((prev) => [entry, ...prev].slice(0, 200));
    },
    [adapters],
  );

  const ingestActionResult = useCallback(
    (adapterId: string, payload: Record<string, unknown>) => {
      ingestEvent(
        adapterId,
        "action_result",
        `policy=${payload.policy ?? "?"}, confidence=${payload.confidence ?? "?"}`,
      );
    },
    [ingestEvent],
  );

  const ingestOutcomeTrace = useCallback(
    (adapterId: string, payload: Record<string, unknown>) => {
      ingestEvent(
        adapterId,
        "outcome_trace",
        `memory_influence=${payload.memory_influence ?? "?"}, pred_error=${payload.prediction_error ?? "?"}`,
      );
    },
    [ingestEvent],
  );

  const ingestFailureEvent = useCallback(
    (adapterId: string, payload: Record<string, unknown>) => {
      ingestEvent(
        adapterId,
        "failure_event",
        `type=${payload.failure_type ?? "?"}, route_suppressed=${payload.route_suppressed ?? false}`,
      );
    },
    [ingestEvent],
  );

  const ingestRouteOutcome = useCallback(
    (adapterId: string, payload: Record<string, unknown>) => {
      ingestEvent(
        adapterId,
        "route_outcome",
        `route=${payload.route_id ?? "?"}, outcome=${payload.outcome ?? "?"}`,
      );
    },
    [ingestEvent],
  );

  const ingestCommandOutcome = useCallback(
    (adapterId: string, payload: Record<string, unknown>) => {
      ingestEvent(
        adapterId,
        "command_outcome",
        `sector=${payload.sector ?? "?"}, result=${payload.result ?? "?"}`,
      );
    },
    [ingestEvent],
  );

  const ingestExperimentResult = useCallback(
    (adapterId: string, payload: Record<string, unknown>) => {
      ingestEvent(
        adapterId,
        "experiment_result",
        `experiment=${payload.experiment_id ?? "?"}, delta=${payload.delta ?? "?"}`,
      );
    },
    [ingestEvent],
  );

  const simulateIngest = useCallback(
    (adapterId: string, type: IngestType) => {
      const mockPayloads: Record<IngestType, Record<string, unknown>> = {
        action_result: {
          policy: "approach",
          confidence: (0.6 + Math.random() * 0.35).toFixed(2),
          outcome: "success",
        },
        outcome_trace: {
          memory_influence: Math.random().toFixed(2),
          prediction_error: Math.random().toFixed(2),
          regulation_burden: Math.random().toFixed(2),
        },
        failure_event: {
          failure_type: "route_blocked",
          route_suppressed: true,
          retry: "in_progress",
        },
        route_outcome: {
          route_id: `route_${Math.floor(Math.random() * 100)}`,
          outcome: Math.random() > 0.3 ? "safe" : "contested",
        },
        command_outcome: {
          sector: `sector_${Math.floor(Math.random() * 10)}`,
          result: Math.random() > 0.4 ? "held" : "contested",
        },
        experiment_result: {
          experiment_id: `exp_${Date.now()}`,
          delta: (Math.random() * 0.2 - 0.05).toFixed(3),
        },
      };
      const ingestFns: Record<
        IngestType,
        (id: string, p: Record<string, unknown>) => void
      > = {
        action_result: ingestActionResult,
        outcome_trace: ingestOutcomeTrace,
        failure_event: ingestFailureEvent,
        route_outcome: ingestRouteOutcome,
        command_outcome: ingestCommandOutcome,
        experiment_result: ingestExperimentResult,
      };
      ingestFns[type](adapterId, mockPayloads[type]);
    },
    [
      ingestActionResult,
      ingestOutcomeTrace,
      ingestFailureEvent,
      ingestRouteOutcome,
      ingestCommandOutcome,
      ingestExperimentResult,
    ],
  );

  const getIngestStats = useCallback((): IngestStats => {
    const by_type: Record<IngestType, number> = {
      action_result: 0,
      outcome_trace: 0,
      failure_event: 0,
      route_outcome: 0,
      command_outcome: 0,
      experiment_result: 0,
    };
    for (const e of ingestLog) by_type[e.type] = (by_type[e.type] ?? 0) + 1;
    return {
      total: ingestLog.length,
      valid: ingestLog.filter((e) => e.schema_valid).length,
      invalid: ingestLog.filter((e) => !e.schema_valid).length,
      by_type,
    };
  }, [ingestLog]);

  // ─── CandidateChangeRegistry ────────────────────────────────────────────────

  const submitCandidate = useCallback(
    (candidate: Omit<ExternalCandidate, "id" | "submitted_at" | "status">) => {
      if (candidate.evidence.length < 1) {
        console.warn(
          "[MutationBoundary] Candidate rejected: evidence array requires min 1 item",
        );
        return null;
      }
      const id = `ext_cand_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
      const entry: ExternalCandidate = {
        ...candidate,
        id,
        submitted_at: Date.now(),
        status: "pending",
      };
      setCandidateQueue((prev) => [entry, ...prev]);
      return id;
    },
    [],
  );

  const reviewCandidate = useCallback(
    (
      id: string,
      decision: "promote" | "reject" | "rollback",
      rationale: string,
    ) => {
      setCandidateQueue((prev) =>
        prev.map((c) =>
          c.id !== id
            ? c
            : {
                ...c,
                status:
                  decision === "promote"
                    ? "promoted"
                    : decision === "reject"
                      ? "rejected"
                      : "rollback",
                review_rationale: rationale,
                reviewed_at: Date.now(),
              },
        ),
      );
    },
    [],
  );

  const getAttributionLog = useCallback(
    () =>
      candidateQueue.map((c) => ({
        id: c.id,
        attribution: c.attribution,
        source_type: c.source_type,
        source_adapter_id: c.source_adapter_id,
        description: c.description,
        submitted_at: c.submitted_at,
        status: c.status,
      })),
    [candidateQueue],
  );

  // ─── CanonicalRegistries ────────────────────────────────────────────────────

  const validateBindingMap = useCallback(
    (map: Record<string, string>): ValidationResult => {
      const errors: string[] = [];
      for (const [entityClass, instanceType] of Object.entries(map)) {
        if (!CANONICAL_INSTANCE_TYPES.includes(instanceType)) {
          errors.push(
            `${entityClass}: unknown instance type "${instanceType}"`,
          );
        }
      }
      return { valid: errors.length === 0, errors };
    },
    [],
  );

  const getBindingRequirements = useCallback(
    (instanceType: string): BindingRequirement | null => {
      return BINDING_REQUIREMENTS[instanceType] ?? null;
    },
    [],
  );

  const getOverlayRequirements = useCallback(
    (roleType: string, scopeType: string) => {
      const roleValid = CANONICAL_ROLE_OVERLAYS.includes(roleType);
      const scopeValid = CANONICAL_SCOPE_OVERLAYS.includes(scopeType);
      return {
        role_valid: roleValid,
        scope_valid: scopeValid,
        compatible: roleValid && scopeValid,
        role_in_registry: roleType,
        scope_in_registry: scopeType,
      };
    },
    [],
  );

  // ─── ReadinessGate integration ──────────────────────────────────────────────

  const isGatePassed = useCallback(
    (readinessScore: number, blockingFailures: number): boolean => {
      return readinessScore >= 0.65 && blockingFailures === 0;
    },
    [],
  );

  const getGateBlockReasons = useCallback(
    (readinessScore: number, blockingFailures: number): string[] => {
      const reasons: string[] = [];
      if (readinessScore < 0.65) {
        reasons.push(
          `Readiness score ${(readinessScore * 100).toFixed(0)}% below required 65%`,
        );
      }
      if (blockingFailures > 0) {
        reasons.push(
          `${blockingFailures} blocking failure${blockingFailures > 1 ? "s" : ""} must be resolved`,
        );
      }
      return reasons;
    },
    [],
  );

  // ─── Computed summaries ─────────────────────────────────────────────────────

  const registeredAdapterCount = adapters.length;
  const activeAdapterCount = adapters.filter(
    (a) => a.status === "active",
  ).length;
  const ingestTotal = ingestLog.length;
  const contractVersion = CURRENT_CONTRACT_VERSION;
  const supportedContractVersions = SUPPORTED_CONTRACT_VERSIONS;

  return {
    // State
    adapters,
    activeSessions,
    ingestLog,
    candidateQueue,
    mutationBoundary,

    // IntegrationContractRegistry
    registerAdapter,
    getAdapterById,
    deactivateAdapter,
    activateAdapter,

    // AdapterCompatibilityRegistry
    contractVersion,
    supportedContractVersions,
    checkCompatibility,
    getVersionMismatches,

    // AdapterSessionManager
    beginSession,
    endSession,
    getSessionCount,

    // ExternalAnalyticsIngestService
    ingestActionResult,
    ingestOutcomeTrace,
    ingestFailureEvent,
    ingestRouteOutcome,
    ingestCommandOutcome,
    ingestExperimentResult,
    simulateIngest,
    getIngestStats,

    // CandidateChangeRegistry
    submitCandidate,
    reviewCandidate,
    getAttributionLog,
    getMutationBoundaryStatus: () => mutationBoundary,

    // CanonicalRegistries
    canonicalInstanceTypes: CANONICAL_INSTANCE_TYPES,
    canonicalRoleOverlays: CANONICAL_ROLE_OVERLAYS,
    canonicalScopeOverlays: CANONICAL_SCOPE_OVERLAYS,
    validateBindingMap,
    getBindingRequirements,
    getOverlayRequirements,

    // ReadinessGate
    isGatePassed,
    getGateBlockReasons,

    // Computed
    registeredAdapterCount,
    activeAdapterCount,
    ingestTotal,
  };
}
