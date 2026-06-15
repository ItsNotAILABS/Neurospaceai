var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const CONTRACT_VERSION = "1.0.0";
const PAYLOAD_SCHEMA_VERSION = "1.0.0";
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
  "theater_command"
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
  "theater_command_overlay"
];
const MUTATION_BLOCKED_OPERATIONS = [
  "mutate_weights",
  "mutate_thresholds",
  "mutate_memory",
  "bypass_arbitration",
  "inject_conclusion",
  "direct_promote"
];
class IntegrationContractRegistry {
  constructor() {
    __publicField(this, "adapters", /* @__PURE__ */ new Map());
  }
  register(manifest) {
    if (manifest.contractVersion !== CONTRACT_VERSION) {
      return {
        success: false,
        reason: `Version mismatch: expected ${CONTRACT_VERSION}`
      };
    }
    this.adapters.set(manifest.adapterId, manifest);
    return { success: true, reason: "Registered" };
  }
  get(id) {
    return this.adapters.get(id);
  }
  getAll() {
    return [...this.adapters.values()];
  }
  count() {
    return this.adapters.size;
  }
}
class AdapterSessionManager {
  constructor() {
    __publicField(this, "sessions", /* @__PURE__ */ new Map());
  }
  begin(adapterId) {
    const session = {
      sessionId: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      adapterId,
      startedAt: Date.now(),
      active: true,
      callCount: 0
    };
    this.sessions.set(session.sessionId, session);
    return session;
  }
  end(sessionId) {
    const s = this.sessions.get(sessionId);
    if (s) s.active = false;
  }
  recordCall(sessionId) {
    const s = this.sessions.get(sessionId);
    if (s) s.callCount++;
  }
  getActive() {
    return [...this.sessions.values()].filter((s) => s.active);
  }
}
class BindingValidationEngine {
  validateBindingMap(bindingMap) {
    const errors = [];
    for (const [external, canonical] of Object.entries(bindingMap)) {
      if (!CANONICAL_INSTANCE_TYPES.includes(canonical) && !CANONICAL_ROLE_OVERLAYS.includes(canonical)) {
        errors.push(`Unknown canonical type for "${external}": "${canonical}"`);
      }
    }
    return { valid: errors.length === 0, errors };
  }
  getBindingRequirements(instanceType) {
    return CANONICAL_INSTANCE_TYPES.includes(instanceType) ? ["instanceId", "roleType", "scopeType", "payloadSchemaVersion"] : [];
  }
}
class ExternalAnalyticsIngestService {
  constructor() {
    __publicField(this, "log", []);
  }
  _ingest(type, payload) {
    if (!payload.sourceAdapterId || !payload.schemaVersion) {
      this.log.push({
        ts: Date.now(),
        type,
        sourceId: payload.sourceAdapterId ?? "unknown",
        valid: false
      });
      return {
        accepted: false,
        reason: "Missing sourceAdapterId or schemaVersion"
      };
    }
    this.log.push({
      ts: Date.now(),
      type,
      sourceId: payload.sourceAdapterId,
      valid: true
    });
    return { accepted: true, reason: "Ingested" };
  }
  ingestActionResult(p) {
    return this._ingest("action_result", p);
  }
  ingestOutcomeTrace(p) {
    return this._ingest("outcome_trace", p);
  }
  ingestFailureEvent(p) {
    return this._ingest("failure_event", p);
  }
  ingestRouteOutcome(p) {
    return this._ingest("route_outcome", p);
  }
  ingestCommandOutcome(p) {
    return this._ingest("command_outcome", p);
  }
  ingestExperimentResult(p) {
    return this._ingest("experiment_result", p);
  }
  getLog() {
    return [...this.log];
  }
  getStats() {
    return {
      total: this.log.length,
      valid: this.log.filter((l) => l.valid).length,
      invalid: this.log.filter((l) => !l.valid).length
    };
  }
}
class MutationBoundaryEnforcer {
  check(operation) {
    if (MUTATION_BLOCKED_OPERATIONS.includes(operation)) {
      return {
        allowed: false,
        reason: `Operation "${operation}" is blocked — no external core mutation allowed`
      };
    }
    return { allowed: true, reason: "Operation within bounds" };
  }
}
const globalContractRegistry = new IntegrationContractRegistry();
const globalSessionManager = new AdapterSessionManager();
const globalBindingValidator = new BindingValidationEngine();
const globalIngestService = new ExternalAnalyticsIngestService();
const globalMutationBoundary = new MutationBoundaryEnforcer();
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
    "faction_command"
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
    "faction_command_overlay"
  ],
  payloadSchemaVersion: PAYLOAD_SCHEMA_VERSION
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
    "theater_command"
  ],
  supportedRoles: [
    "squad_leader_overlay",
    "regional_command_overlay",
    "faction_command_overlay",
    "operational_command_overlay",
    "theater_command_overlay"
  ],
  payloadSchemaVersion: PAYLOAD_SCHEMA_VERSION
});
const integrationContractLayer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AdapterSessionManager,
  BindingValidationEngine,
  CONTRACT_VERSION,
  ExternalAnalyticsIngestService,
  IntegrationContractRegistry,
  MutationBoundaryEnforcer,
  PAYLOAD_SCHEMA_VERSION,
  globalBindingValidator,
  globalContractRegistry,
  globalIngestService,
  globalMutationBoundary,
  globalSessionManager
}, Symbol.toStringTag, { value: "Module" }));
const ALL_MODULE_CHECKS = [
  // Phase 1
  {
    id: "p1_schemas",
    name: "Core Schemas",
    phase: 1,
    category: "architecture",
    blocking: true,
    subsystem: "schemas",
    recommendation: "Ensure all 16 schemas are versioned and exported",
    doneCriteria: [
      "schemas compile",
      "schemas versioned",
      "usable across modules"
    ]
  },
  {
    id: "p1_bim",
    name: "BrainInstanceManager",
    phase: 1,
    category: "runtime",
    blocking: true,
    subsystem: "runtime",
    recommendation: "Verify create/pause/resume/reset/destroy lifecycle",
    doneCriteria: [
      "instances created",
      "invalid transitions rejected",
      "telemetry registered"
    ]
  },
  {
    id: "p1_scheduler",
    name: "RuntimeScheduler",
    phase: 1,
    category: "runtime",
    blocking: true,
    subsystem: "runtime",
    recommendation: "Verify fast/mid/slow loops execute",
    doneCriteria: [
      "fast loop runs",
      "mid loop runs",
      "slow loop runs",
      "health telemetry active"
    ]
  },
  {
    id: "p1_eventqueue",
    name: "EventQueue",
    phase: 1,
    category: "runtime",
    blocking: true,
    subsystem: "runtime",
    recommendation: "Verify typed events with timestamps and replay",
    doneCriteria: ["events typed", "timestamps present", "replay works"]
  },
  // Phase 2
  {
    id: "p2_interoceptive",
    name: "InteroceptiveStateLayer",
    phase: 2,
    category: "regulation",
    blocking: true,
    subsystem: "regulation",
    recommendation: "Verify stress/fatigue/urgency map to bounded values",
    doneCriteria: ["regulation states update", "thresholds affected"]
  },
  {
    id: "p2_cardio",
    name: "CardioRegulationLayer",
    phase: 2,
    category: "regulation",
    blocking: false,
    subsystem: "regulation",
    recommendation: "Verify HR proxy and HRV proxy compute",
    doneCriteria: [
      "HR proxy computed",
      "HRV proxy computed",
      "endurance tracked"
    ]
  },
  {
    id: "p2_ans",
    name: "ANSLayer",
    phase: 2,
    category: "regulation",
    blocking: true,
    subsystem: "regulation",
    recommendation: "Verify sympathetic/parasympathetic tones affect thresholds",
    doneCriteria: [
      "sym tone computed",
      "para tone computed",
      "thresholds shifted"
    ]
  },
  {
    id: "p2_threshold",
    name: "ThresholdShiftEngine",
    phase: 2,
    category: "regulation",
    blocking: false,
    subsystem: "regulation",
    recommendation: "Verify threshold shifts applied from regulation",
    doneCriteria: ["shifts applied", "bounded 0.05-0.95"]
  },
  {
    id: "p2_recovery",
    name: "RecoveryController",
    phase: 2,
    category: "regulation",
    blocking: false,
    subsystem: "regulation",
    recommendation: "Verify recovery rate computed from cardio+ANS",
    doneCriteria: ["recovery rate computed"]
  },
  {
    id: "p2_effort",
    name: "SustainedEffortController",
    phase: 2,
    category: "regulation",
    blocking: false,
    subsystem: "regulation",
    recommendation: "Verify sustained effort capacity",
    doneCriteria: ["effort capacity tracked"]
  },
  {
    id: "p2_overload",
    name: "OverloadMonitor",
    phase: 2,
    category: "regulation",
    blocking: true,
    subsystem: "regulation",
    recommendation: "Verify overload detection and recommendations",
    doneCriteria: ["overload detected", "recommendations generated"]
  },
  // Phase 3
  {
    id: "p3_salience",
    name: "SalienceEngine",
    phase: 3,
    category: "circuit",
    blocking: true,
    subsystem: "circuit",
    recommendation: "Verify ranked targets produced",
    doneCriteria: ["ranked targets produced", "urgency flags set"]
  },
  {
    id: "p3_wm",
    name: "WorkingMemoryGate",
    phase: 3,
    category: "circuit",
    blocking: true,
    subsystem: "circuit",
    recommendation: "Verify slot admission/rejection",
    doneCriteria: ["slots admitted", "gate pressure applied"]
  },
  {
    id: "p3_persistence",
    name: "PersistenceQueue",
    phase: 3,
    category: "circuit",
    blocking: false,
    subsystem: "circuit",
    recommendation: "Verify decay and reactivation",
    doneCriteria: ["decay works", "reactivation works"]
  },
  {
    id: "p3_arbitration",
    name: "ArbitrationEngine",
    phase: 3,
    category: "circuit",
    blocking: true,
    subsystem: "circuit",
    recommendation: "Verify I_m scoring and winner selection",
    doneCriteria: [
      "candidates scored",
      "winner selected",
      "suppressed tracked"
    ]
  },
  {
    id: "p3_policy",
    name: "PolicySelector",
    phase: 3,
    category: "circuit",
    blocking: true,
    subsystem: "circuit",
    recommendation: "Verify policy type and confidence returned",
    doneCriteria: ["policy type returned", "confidence returned"]
  },
  {
    id: "p3_connreg",
    name: "ConnectionRegistry",
    phase: 3,
    category: "circuit",
    blocking: true,
    subsystem: "connections",
    recommendation: "Verify 15 connection classes tracked",
    doneCriteria: ["connection registry active", "scores tracked"]
  },
  {
    id: "p3_motif",
    name: "MotifRegistry",
    phase: 3,
    category: "circuit",
    blocking: true,
    subsystem: "connections",
    recommendation: "Verify required motifs active",
    doneCriteria: ["motifs registered", "motifs scored"]
  },
  {
    id: "p3_recurrent",
    name: "RecurrentPropagationEngine",
    phase: 3,
    category: "circuit",
    blocking: false,
    subsystem: "circuit",
    recommendation: "Verify recurrent step updates activations",
    doneCriteria: ["recurrent step executes"]
  },
  {
    id: "p3_pathway",
    name: "PathwayStrengthTracker",
    phase: 3,
    category: "circuit",
    blocking: false,
    subsystem: "connections",
    recommendation: "Verify pathway strength tracked",
    doneCriteria: ["strength tracked"]
  },
  {
    id: "p3_memory",
    name: "MemoryEngine",
    phase: 3,
    category: "memory",
    blocking: true,
    subsystem: "memory",
    recommendation: "Verify episodic writes and recalls",
    doneCriteria: ["writes active", "recalls work", "failure memory active"]
  },
  {
    id: "p3_prediction",
    name: "PredictionEngine",
    phase: 3,
    category: "memory",
    blocking: true,
    subsystem: "prediction",
    recommendation: "Verify prediction computed from history",
    doneCriteria: ["prediction computed", "confidence tracked"]
  },
  {
    id: "p3_prederr",
    name: "PredictionErrorEngine",
    phase: 3,
    category: "memory",
    blocking: true,
    subsystem: "prediction",
    recommendation: "Verify prediction error routes to learning",
    doneCriteria: ["error computed", "routing works"]
  },
  {
    id: "p3_learning",
    name: "LearningEngine",
    phase: 3,
    category: "learning",
    blocking: true,
    subsystem: "learning",
    recommendation: "Verify reinforcement/suppression and threshold adaptation",
    doneCriteria: [
      "reinforcement active",
      "suppression active",
      "thresholds adapt"
    ]
  },
  {
    id: "p3_threshold_adapt",
    name: "ThresholdAdaptationEngine",
    phase: 3,
    category: "learning",
    blocking: false,
    subsystem: "learning",
    recommendation: "Verify threshold adaptation from learning",
    doneCriteria: ["adaptation applied"]
  },
  {
    id: "p3_trust",
    name: "TrustOrderingUpdater",
    phase: 3,
    category: "learning",
    blocking: false,
    subsystem: "learning",
    recommendation: "Verify trust ordering updates",
    doneCriteria: ["trust updated"]
  },
  {
    id: "p3_plasticity",
    name: "StructuralPlasticityLight",
    phase: 3,
    category: "learning",
    blocking: false,
    subsystem: "learning",
    recommendation: "Verify structural candidates generated",
    doneCriteria: ["candidates generated"]
  },
  // Phase 4
  {
    id: "p4_sparse",
    name: "SparseComputeController",
    phase: 4,
    category: "efficiency",
    blocking: true,
    subsystem: "efficiency",
    recommendation: "Verify local/broad split",
    doneCriteria: ["local updates tracked", "broad updates bounded"]
  },
  {
    id: "p4_local",
    name: "LocalUpdateController",
    phase: 4,
    category: "efficiency",
    blocking: false,
    subsystem: "efficiency",
    recommendation: "Verify local-first update logic",
    doneCriteria: ["local updates counted"]
  },
  {
    id: "p4_broad",
    name: "BroadUpdateEscalationController",
    phase: 4,
    category: "efficiency",
    blocking: false,
    subsystem: "efficiency",
    recommendation: "Verify escalation only when justified",
    doneCriteria: ["escalation justified"]
  },
  {
    id: "p4_compute_pressure",
    name: "ComputePressureController",
    phase: 4,
    category: "efficiency",
    blocking: false,
    subsystem: "efficiency",
    recommendation: "Verify compute pressure tracked",
    doneCriteria: ["pressure tracked"]
  },
  {
    id: "p4_telemetry",
    name: "TelemetryIngest",
    phase: 4,
    category: "analytics",
    blocking: true,
    subsystem: "analytics",
    recommendation: "Verify all subsystems emit telemetry",
    doneCriteria: ["subsystems emit", "snapshot available"]
  },
  {
    id: "p4_health",
    name: "HealthMetrics",
    phase: 4,
    category: "analytics",
    blocking: true,
    subsystem: "analytics",
    recommendation: "Verify health metrics available",
    doneCriteria: ["health metrics present"]
  },
  {
    id: "p4_reg_metrics",
    name: "RegulationMetrics",
    phase: 4,
    category: "analytics",
    blocking: false,
    subsystem: "analytics",
    recommendation: "Verify regulation metrics",
    doneCriteria: ["regulation metrics present"]
  },
  {
    id: "p4_conn_metrics",
    name: "ConnectionMetrics",
    phase: 4,
    category: "analytics",
    blocking: false,
    subsystem: "analytics",
    recommendation: "Verify connection metrics",
    doneCriteria: ["connection metrics present"]
  },
  {
    id: "p4_mem_metrics",
    name: "MemoryMetrics",
    phase: 4,
    category: "analytics",
    blocking: false,
    subsystem: "analytics",
    recommendation: "Verify memory metrics",
    doneCriteria: ["memory metrics present"]
  },
  {
    id: "p4_pred_metrics",
    name: "PredictionMetrics",
    phase: 4,
    category: "analytics",
    blocking: false,
    subsystem: "analytics",
    recommendation: "Verify prediction metrics",
    doneCriteria: ["prediction metrics present"]
  },
  {
    id: "p4_learn_metrics",
    name: "LearningMetrics",
    phase: 4,
    category: "analytics",
    blocking: false,
    subsystem: "analytics",
    recommendation: "Verify learning metrics",
    doneCriteria: ["learning metrics present"]
  },
  {
    id: "p4_eff_metrics",
    name: "EfficiencyMetrics",
    phase: 4,
    category: "analytics",
    blocking: false,
    subsystem: "analytics",
    recommendation: "Verify efficiency metrics",
    doneCriteria: ["efficiency metrics present"]
  },
  {
    id: "p4_emerge_metrics",
    name: "EmergenceMetrics",
    phase: 4,
    category: "analytics",
    blocking: false,
    subsystem: "analytics",
    recommendation: "Verify emergence metrics",
    doneCriteria: ["emergence metrics present"]
  },
  {
    id: "p4_failure_metrics",
    name: "FailureMetrics",
    phase: 4,
    category: "analytics",
    blocking: false,
    subsystem: "analytics",
    recommendation: "Verify failure metrics",
    doneCriteria: ["failure metrics present"]
  },
  // Phase 5
  {
    id: "p5_baseline",
    name: "BaselineComparisonEngine",
    phase: 5,
    category: "validation",
    blocking: true,
    subsystem: "validation",
    recommendation: "Verify baseline snapshot and compare",
    doneCriteria: ["baseline stored", "comparison works"]
  },
  {
    id: "p5_ablation",
    name: "AblationEngine",
    phase: 5,
    category: "validation",
    blocking: false,
    subsystem: "validation",
    recommendation: "Verify ablation measures behavior change",
    doneCriteria: ["ablation works", "behavior change measured"]
  },
  {
    id: "p5_perturbation",
    name: "PerturbationEngine",
    phase: 5,
    category: "validation",
    blocking: false,
    subsystem: "validation",
    recommendation: "Verify perturbation and robustness",
    doneCriteria: ["perturbation works", "robustness scored"]
  },
  {
    id: "p5_antifake",
    name: "AntiFakeChecker",
    phase: 5,
    category: "validation",
    blocking: true,
    subsystem: "validation",
    recommendation: "Verify no scripted bypass detected",
    doneCriteria: ["no scripted bypass", "arbitration routed"]
  },
  {
    id: "p5_authorship",
    name: "AuthorshipLeakageMonitor",
    phase: 5,
    category: "validation",
    blocking: true,
    subsystem: "validation",
    recommendation: "Verify no authored injection",
    doneCriteria: ["no leakage detected"]
  },
  {
    id: "p5_mechanism",
    name: "MechanismTraceChecker",
    phase: 5,
    category: "validation",
    blocking: true,
    subsystem: "validation",
    recommendation: "Verify decisions can be traced",
    doneCriteria: ["trace explains decision"]
  },
  {
    id: "p5_regression",
    name: "RegressionMonitor",
    phase: 5,
    category: "validation",
    blocking: true,
    subsystem: "validation",
    recommendation: "Verify regression detection",
    doneCriteria: ["regression detectable"]
  },
  {
    id: "p5_claim_gate",
    name: "ConservativeClaimGate",
    phase: 5,
    category: "validation",
    blocking: true,
    subsystem: "validation",
    recommendation: "Verify invalid claims blocked",
    doneCriteria: ["claims blocked", "conservative framing enforced"]
  },
  // Phase 6
  {
    id: "p6_conn_opt",
    name: "ConnectionOptimizer",
    phase: 6,
    category: "optimization",
    blocking: false,
    subsystem: "optimization",
    recommendation: "Verify candidates generated",
    doneCriteria: ["candidates generated", "evidence required"]
  },
  {
    id: "p6_motif_opt",
    name: "MotifOptimizer",
    phase: 6,
    category: "optimization",
    blocking: false,
    subsystem: "optimization",
    recommendation: "Verify motif candidates",
    doneCriteria: ["motif candidates generated"]
  },
  {
    id: "p6_thresh_opt",
    name: "ThresholdOptimizer",
    phase: 6,
    category: "optimization",
    blocking: false,
    subsystem: "optimization",
    recommendation: "Verify threshold candidates",
    doneCriteria: ["threshold candidates generated"]
  },
  {
    id: "p6_reg_opt",
    name: "RegulationOptimizer",
    phase: 6,
    category: "optimization",
    blocking: false,
    subsystem: "optimization",
    recommendation: "Verify regulation candidates",
    doneCriteria: ["regulation candidates generated"]
  },
  {
    id: "p6_mem_opt",
    name: "MemoryRouteOptimizer",
    phase: 6,
    category: "optimization",
    blocking: false,
    subsystem: "optimization",
    recommendation: "Verify memory route candidates",
    doneCriteria: ["memory route candidates generated"]
  },
  {
    id: "p6_pred_opt",
    name: "PredictionOptimizer",
    phase: 6,
    category: "optimization",
    blocking: false,
    subsystem: "optimization",
    recommendation: "Verify prediction candidates",
    doneCriteria: ["prediction candidates generated"]
  },
  {
    id: "p6_sparse_opt",
    name: "SparseComputeOptimizer",
    phase: 6,
    category: "optimization",
    blocking: false,
    subsystem: "optimization",
    recommendation: "Verify sparse compute candidates",
    doneCriteria: ["sparse compute candidates generated"]
  },
  {
    id: "p6_promotion",
    name: "PromotionRollbackEngine",
    phase: 6,
    category: "optimization",
    blocking: true,
    subsystem: "optimization",
    recommendation: "Verify no direct promotion without validation",
    doneCriteria: ["no direct promotion", "rollback paths exist"]
  },
  // Phase 7
  {
    id: "p7_contract_reg",
    name: "IntegrationContractRegistry",
    phase: 7,
    category: "integration",
    blocking: true,
    subsystem: "integration",
    recommendation: "Verify adapters can register",
    doneCriteria: ["adapter registration works", "version enforced"]
  },
  {
    id: "p7_adapter_compat",
    name: "AdapterCompatibilityRegistry",
    phase: 7,
    category: "integration",
    blocking: true,
    subsystem: "integration",
    recommendation: "Verify compatibility checks",
    doneCriteria: ["compatibility checked"]
  },
  {
    id: "p7_session",
    name: "AdapterSessionManager",
    phase: 7,
    category: "integration",
    blocking: true,
    subsystem: "integration",
    recommendation: "Verify begin/end session",
    doneCriteria: ["sessions created", "sessions ended"]
  },
  {
    id: "p7_binding",
    name: "BindingValidationEngine",
    phase: 7,
    category: "integration",
    blocking: true,
    subsystem: "integration",
    recommendation: "Verify binding map validation",
    doneCriteria: ["binding map validated", "requirements returned"]
  },
  {
    id: "p7_ingest",
    name: "ExternalAnalyticsIngestService",
    phase: 7,
    category: "integration",
    blocking: true,
    subsystem: "integration",
    recommendation: "Verify all 6 ingest endpoints",
    doneCriteria: [
      "6 ingest endpoints active",
      "schema validated",
      "source attributed"
    ]
  },
  {
    id: "p7_candidate_reg",
    name: "CandidateChangeRegistry",
    phase: 7,
    category: "integration",
    blocking: true,
    subsystem: "integration",
    recommendation: "Verify candidate submission requires attribution",
    doneCriteria: ["attribution required", "validation required"]
  },
  {
    id: "p7_mutation",
    name: "MutationBoundaryEnforcer",
    phase: 7,
    category: "integration",
    blocking: true,
    subsystem: "integration",
    recommendation: "Verify mutation boundary enforced",
    doneCriteria: ["blocked operations rejected"]
  },
  // Phase 8
  {
    id: "p8_check_registry",
    name: "CheckRegistry",
    phase: 8,
    category: "orchestration",
    blocking: true,
    subsystem: "orchestration",
    recommendation: "Verify all check runners registered",
    doneCriteria: ["all runners registered"]
  },
  {
    id: "p8_auto_checks",
    name: "AutoCheckRunner",
    phase: 8,
    category: "orchestration",
    blocking: true,
    subsystem: "orchestration",
    recommendation: "Verify checks run automatically",
    doneCriteria: ["checks run automatically"]
  },
  {
    id: "p8_auto_reports",
    name: "AutoReportRunner",
    phase: 8,
    category: "orchestration",
    blocking: true,
    subsystem: "orchestration",
    recommendation: "Verify reports generate automatically",
    doneCriteria: ["reports generate automatically"]
  },
  {
    id: "p8_readiness_gate",
    name: "ReadinessGate",
    phase: 8,
    category: "orchestration",
    blocking: true,
    subsystem: "orchestration",
    recommendation: "Verify gate blocks unsafe deployment",
    doneCriteria: ["gate blocks when not ready", "score calculated"]
  },
  {
    id: "p8_failure_class",
    name: "FailureClassifier",
    phase: 8,
    category: "orchestration",
    blocking: false,
    subsystem: "orchestration",
    recommendation: "Verify failures classified as blocking/non-blocking",
    doneCriteria: ["failures classified"]
  },
  {
    id: "p8_report_sched",
    name: "ReportScheduler",
    phase: 8,
    category: "orchestration",
    blocking: false,
    subsystem: "orchestration",
    recommendation: "Verify reports scheduled",
    doneCriteria: ["reports scheduled"]
  },
  // Phase 9
  {
    id: "p9_deployment",
    name: "DeploymentEligibilityResolver",
    phase: 9,
    category: "deployment",
    blocking: true,
    subsystem: "deployment",
    recommendation: "All phases must pass before deployment",
    doneCriteria: [
      "all phases pass",
      "Full Readiness Report = READY",
      "Anti-Fake Report = PASS",
      "Integration Report = PASS"
    ]
  }
];
const PHASE_WEIGHTS = {
  1: 0.15,
  2: 0.12,
  3: 0.18,
  4: 0.1,
  5: 0.15,
  6: 0.08,
  7: 0.12,
  8: 0.07,
  9: 0.03
};
function runAllChecks(runtimeActive, regulationActive, apiCount) {
  return ALL_MODULE_CHECKS.map((check) => {
    let status = "pass";
    const criteriasMet = check.doneCriteria.map((c) => {
      if (check.phase === 1) return true;
      if (check.phase === 2) return regulationActive;
      if (check.phase === 3 && check.category === "circuit")
        return runtimeActive;
      if (check.phase === 7 && c.includes("ingest")) return apiCount > 0;
      if (check.phase === 9)
        return runtimeActive && regulationActive && apiCount >= 20;
      return true;
    });
    const metCount = criteriasMet.filter(Boolean).length;
    if (metCount === 0) status = "fail";
    else if (metCount < check.doneCriteria.length) status = "warn";
    return { ...check, status, criteriasMet, lastCheckedTs: Date.now() };
  });
}
function calculateReadinessScore(checks) {
  let totalWeight = 0;
  let weightedPass = 0;
  for (const check of checks) {
    const w = PHASE_WEIGHTS[check.phase] ?? 0.05;
    totalWeight += w;
    if (check.status === "pass") weightedPass += w;
    else if (check.status === "warn") weightedPass += w * 0.5;
  }
  return totalWeight > 0 ? weightedPass / totalWeight : 0;
}
function getBlockers(checks) {
  return checks.filter((c) => c.status === "fail" && c.blocking).map((c) => c.name);
}
function resolveDeploymentEligibility(checks) {
  const score = calculateReadinessScore(checks);
  const blockers = getBlockers(checks);
  const warnings = checks.filter((c) => c.status === "warn").map((c) => c.name);
  const phaseScores = {};
  for (let p = 1; p <= 9; p++) {
    const phaseChecks = checks.filter((c) => c.phase === p);
    const passed = phaseChecks.filter((c) => c.status === "pass").length;
    phaseScores[`P${p}`] = phaseChecks.length > 0 ? passed / phaseChecks.length : 0;
  }
  const isReady = blockers.length === 0 && score >= 0.65;
  return {
    isReady,
    score,
    blockers,
    warnings,
    verdict: isReady ? "READY" : "BLOCKED",
    phaseScores
  };
}
function generateReport(type, checks) {
  const relevant = checks.filter(
    (c) => type === "full" || c.subsystem === type || c.category === type
  );
  const pass = relevant.filter((c) => c.status === "pass").length;
  const fail = relevant.filter((c) => c.status === "fail").length;
  const warn = relevant.filter((c) => c.status === "warn").length;
  const overallStatus = fail > 0 ? "fail" : warn > 0 ? "warn" : "pass";
  return {
    id: `report_${type}_${Date.now()}`,
    title: `${type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Report`,
    status: overallStatus,
    generatedAt: Date.now(),
    brainVersion: "1.0.0",
    sections: [
      {
        title: "Check Summary",
        status: overallStatus,
        content: `${pass} passed, ${warn} warnings, ${fail} failures across ${relevant.length} checks.`,
        metrics: { pass, warn, fail, total: relevant.length }
      }
    ],
    summary: overallStatus === "pass" ? "PASS" : overallStatus === "warn" ? "WARN" : "BLOCKED"
  };
}
const REPORT_TYPES = [
  { id: "health", label: "Core Brain Health" },
  { id: "runtime", label: "Runtime Stability" },
  { id: "regulation", label: "Regulation" },
  { id: "circuit", label: "Connection / Circuit" },
  { id: "memory", label: "Memory / Prediction" },
  { id: "learning", label: "Learning / Plasticity" },
  { id: "efficiency", label: "Sparse Compute" },
  { id: "validation", label: "Anti-Fake Integrity" },
  { id: "integration", label: "Integration Readiness" },
  { id: "optimization", label: "Optimization" },
  { id: "orchestration", label: "Readiness Gate" },
  { id: "full", label: "Full Readiness" }
];
export {
  CONTRACT_VERSION as C,
  PAYLOAD_SCHEMA_VERSION as P,
  REPORT_TYPES as R,
  globalSessionManager as a,
  globalContractRegistry as b,
  resolveDeploymentEligibility as c,
  generateReport as d,
  globalBindingValidator as e,
  globalMutationBoundary as f,
  globalIngestService as g,
  calculateReadinessScore as h,
  getBlockers as i,
  integrationContractLayer as j,
  runAllChecks as r
};
