import { e as useCanonicalState, G as useFearMissionState, r as reactExports, j as jsxRuntimeExports, a0 as liveBrainBus, _ as __vitePreload } from "./index-CGYrnU7d.js";
import { S as SharedTreatyPanel } from "./SharedTreatyPanel-CmZwPVaJ.js";
import { u as useBrainIntegrationSystem } from "./useBrainIntegrationSystem-yuzi11xJ.js";
import { c as createArtifact } from "./artifactStore-By0EKKQ5.js";
import { r as runAutoChecks } from "./readinessOrchestrator-BNi-Dv_W.js";
function createDeploymentBindingManager() {
  const adapters = [
    {
      id: "adapter_npc",
      name: "NPC Runtime",
      type: "npc",
      status: "active",
      boundInstances: 12,
      lastSync: Date.now() - 1200,
      capabilities: [
        "perception_mapping",
        "embodiment_state",
        "motor_output",
        "role_overlay",
        "analytics_hooks"
      ],
      description: "Individual NPC agents with soldier/medic/recon role overlays"
    },
    {
      id: "adapter_agent",
      name: "Agent Runtime",
      type: "agent",
      status: "active",
      boundInstances: 4,
      lastSync: Date.now() - 3600,
      capabilities: [
        "goal_context",
        "policy_output",
        "memory_horizon",
        "emergence_logging",
        "ablation_hooks"
      ],
      description: "Adaptive agents for scenario and digital character deployments"
    },
    {
      id: "adapter_scenario",
      name: "Scenario Runtime",
      type: "scenario",
      status: "standby",
      boundInstances: 2,
      lastSync: Date.now() - 7200,
      capabilities: [
        "theater_state",
        "command_hierarchy",
        "force_disposition",
        "scenario_objectives",
        "report_pipeline"
      ],
      description: "Command-level scenario simulation with theater-scope overlays"
    },
    {
      id: "adapter_robotics",
      name: "Robotics Adapter",
      type: "robotics",
      status: "offline",
      boundInstances: 0,
      lastSync: 0,
      capabilities: [
        "sensor_bridge",
        "motor_primitives",
        "edge_compute",
        "real_time_loop"
      ],
      description: "Edge deployment placeholder — sensor/actuator bridge pending"
    }
  ];
  const roleOverlays = [
    {
      id: "role_soldier",
      name: "Individual Soldier",
      perceptionWeighting: 0.6,
      memoryHorizon: 300,
      riskTolerance: 0.5,
      authorityLevel: 0.2,
      notes: "Local tactical scope, survival-weighted"
    },
    {
      id: "role_medic",
      name: "Medic",
      perceptionWeighting: 0.55,
      memoryHorizon: 600,
      riskTolerance: 0.4,
      authorityLevel: 0.25,
      notes: "Recovery-biased, casualty-priority salience"
    },
    {
      id: "role_recon",
      name: "Recon",
      perceptionWeighting: 0.85,
      memoryHorizon: 1200,
      riskTolerance: 0.35,
      authorityLevel: 0.2,
      notes: "Wide perception, stealth-weighted, low aggression"
    },
    {
      id: "role_support",
      name: "Support Gunner",
      perceptionWeighting: 0.5,
      memoryHorizon: 180,
      riskTolerance: 0.7,
      authorityLevel: 0.2,
      notes: "High aggression tolerance, suppression-biased"
    },
    {
      id: "role_squad_leader",
      name: "Squad Leader",
      perceptionWeighting: 0.75,
      memoryHorizon: 900,
      riskTolerance: 0.5,
      authorityLevel: 0.5,
      notes: "Squad-scope, coordination priority, relay authority"
    },
    {
      id: "role_regional_cmd",
      name: "Regional Command",
      perceptionWeighting: 0.9,
      memoryHorizon: 3600,
      riskTolerance: 0.45,
      authorityLevel: 0.75,
      notes: "Sector-scope, strategic patience, reserve authority"
    },
    {
      id: "role_faction_cmd",
      name: "Faction Command",
      perceptionWeighting: 0.95,
      memoryHorizon: 14400,
      riskTolerance: 0.4,
      authorityLevel: 0.9,
      notes: "Theater-scope, doctrine-weighted, full override"
    },
    {
      id: "role_theater_cmd",
      name: "Theater Command",
      perceptionWeighting: 1,
      memoryHorizon: 86400,
      riskTolerance: 0.35,
      authorityLevel: 1,
      notes: "Maximum scope, strategic doctrine enforcement"
    }
  ];
  const scopeOverlays = [
    {
      id: "scope_local",
      name: "Local Tactical",
      perceptionScope: "local",
      actionAuthority: 0.2,
      memoryHorizon: 300,
      abstractionLevel: 0.1
    },
    {
      id: "scope_squad",
      name: "Squad",
      perceptionScope: "squad",
      actionAuthority: 0.4,
      memoryHorizon: 900,
      abstractionLevel: 0.25
    },
    {
      id: "scope_sector",
      name: "Sector",
      perceptionScope: "sector",
      actionAuthority: 0.6,
      memoryHorizon: 3600,
      abstractionLevel: 0.5
    },
    {
      id: "scope_regional",
      name: "Regional",
      perceptionScope: "regional",
      actionAuthority: 0.8,
      memoryHorizon: 14400,
      abstractionLevel: 0.7
    },
    {
      id: "scope_theater",
      name: "Theater",
      perceptionScope: "theater",
      actionAuthority: 1,
      memoryHorizon: 86400,
      abstractionLevel: 1
    }
  ];
  const bindingTable = [
    {
      entityClass: "soldier_entity",
      brainInstanceType: "individual_agent",
      roleOverlayId: "role_soldier",
      scopeOverlayId: "scope_local"
    },
    {
      entityClass: "medic_entity",
      brainInstanceType: "individual_agent",
      roleOverlayId: "role_medic",
      scopeOverlayId: "scope_local"
    },
    {
      entityClass: "recon_entity",
      brainInstanceType: "individual_agent",
      roleOverlayId: "role_recon",
      scopeOverlayId: "scope_squad"
    },
    {
      entityClass: "squad_leader_entity",
      brainInstanceType: "squad_leader",
      roleOverlayId: "role_squad_leader",
      scopeOverlayId: "scope_squad"
    },
    {
      entityClass: "regional_controller",
      brainInstanceType: "regional_command",
      roleOverlayId: "role_regional_cmd",
      scopeOverlayId: "scope_regional"
    },
    {
      entityClass: "theater_command",
      brainInstanceType: "theater_command",
      roleOverlayId: "role_theater_cmd",
      scopeOverlayId: "scope_theater"
    }
  ];
  return { adapters, roleOverlays, scopeOverlays, bindingTable };
}
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
function isMoveAction(params) {
  return params.action_type === "MOVE";
}
function isAttackAction(params) {
  return params.action_type === "ATTACK";
}
function isRetreatAction(params) {
  return params.action_type === "RETREAT";
}
function isInvestigateAction(params) {
  return params.action_type === "INVESTIGATE";
}
function isInteractAction(params) {
  return params.action_type === "INTERACT";
}
function isFreezeAction(params) {
  return params.action_type === "FREEZE";
}
function isIssueOrderAction(params) {
  return params.action_type === "ISSUE_ORDER";
}
function isAllocateResourceAction(params) {
  return params.action_type === "ALLOCATE_RESOURCE";
}
function isRouteSelectAction(params) {
  return params.action_type === "ROUTE_SELECT";
}
function isHoldPositionAction(params) {
  return params.action_type === "HOLD_POSITION";
}
function isRecoverAction(params) {
  return params.action_type === "RECOVER";
}
function isEscalateAction(params) {
  return params.action_type === "ESCALATE";
}
function isIdleAction(params) {
  return params.action_type === "IDLE";
}
function routeActionParams(params, handlers) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  switch (params.action_type) {
    case "MOVE":
      (_a = handlers.MOVE) == null ? void 0 : _a.call(handlers, params);
      break;
    case "ATTACK":
      (_b = handlers.ATTACK) == null ? void 0 : _b.call(handlers, params);
      break;
    case "RETREAT":
      (_c = handlers.RETREAT) == null ? void 0 : _c.call(handlers, params);
      break;
    case "INVESTIGATE":
      (_d = handlers.INVESTIGATE) == null ? void 0 : _d.call(handlers, params);
      break;
    case "INTERACT":
      (_e = handlers.INTERACT) == null ? void 0 : _e.call(handlers, params);
      break;
    case "FREEZE":
      (_f = handlers.FREEZE) == null ? void 0 : _f.call(handlers, params);
      break;
    case "ISSUE_ORDER":
      (_g = handlers.ISSUE_ORDER) == null ? void 0 : _g.call(handlers, params);
      break;
    case "ALLOCATE_RESOURCE":
      (_h = handlers.ALLOCATE_RESOURCE) == null ? void 0 : _h.call(handlers, params);
      break;
    case "ROUTE_SELECT":
      (_i = handlers.ROUTE_SELECT) == null ? void 0 : _i.call(handlers, params);
      break;
    case "HOLD_POSITION":
      (_j = handlers.HOLD_POSITION) == null ? void 0 : _j.call(handlers, params);
      break;
    case "RECOVER":
      (_k = handlers.RECOVER) == null ? void 0 : _k.call(handlers, params);
      break;
    case "ESCALATE":
      (_l = handlers.ESCALATE) == null ? void 0 : _l.call(handlers, params);
      break;
    case "IDLE":
      (_m = handlers.IDLE) == null ? void 0 : _m.call(handlers, params);
      break;
  }
}
const externalBindContract = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CANONICAL_INSTANCE_TYPES,
  CONTRACT_VERSION,
  PAYLOAD_SCHEMA_VERSION,
  isAllocateResourceAction,
  isAttackAction,
  isEscalateAction,
  isFreezeAction,
  isHoldPositionAction,
  isIdleAction,
  isInteractAction,
  isInvestigateAction,
  isIssueOrderAction,
  isMoveAction,
  isRecoverAction,
  isRetreatAction,
  isRouteSelectAction,
  routeActionParams
}, Symbol.toStringTag, { value: "Module" }));
const BORDER = "oklch(0.18 0.05 255)";
const CYAN = "oklch(0.72 0.22 195)";
const GREEN = "oklch(0.68 0.28 140)";
const AMBER = "oklch(0.78 0.22 80)";
const RED = "oklch(0.72 0.22 25)";
const MUTED = "oklch(0.38 0.05 220)";
const DIM = "oklch(0.28 0.04 240)";
const PANEL = "oklch(0.09 0.015 265)";
const PANEL_DARK = "oklch(0.07 0.012 265)";
const DEPLOYMENT_TYPES = [
  "npc",
  "agent",
  "scenario",
  "robotics",
  "war_game",
  "command_testbed"
];
const INGEST_TYPES = [
  "action_result",
  "outcome_trace",
  "failure_event",
  "route_outcome",
  "command_outcome",
  "experiment_result"
];
const API_GROUPS = [
  {
    group: "Instance Lifecycle",
    stability: "STABLE",
    endpoints: [
      {
        name: "create_instance",
        sig: "(request) → instance_id",
        fields: "instance_type, role_type, authority_level, scope_type, deployment_type, doctrine_profile"
      },
      { name: "destroy_instance", sig: "(instance_id)", fields: "instance_id" },
      {
        name: "get_instance_state",
        sig: "(instance_id) → BrainInstance",
        fields: "instance_id"
      }
    ]
  },
  {
    group: "Perception Ingest",
    stability: "STABLE",
    endpoints: [
      {
        name: "update_perception",
        sig: "(id, PerceptionPayload)",
        fields: "visible_entities[], audible_events[], terrain_features[], route_options[], objective_markers[], uncertainty_estimates[]"
      }
    ]
  },
  {
    group: "Embodiment Update",
    stability: "STABLE",
    endpoints: [
      {
        name: "update_embodiment",
        sig: "(id, EmbodimentPayload)",
        fields: "location, orientation, movement_state, stance, exposure, cover_quality, load_burden, damage_state, exertion_level"
      }
    ]
  },
  {
    group: "Regulation Update",
    stability: "STABLE",
    endpoints: [
      {
        name: "update_regulation",
        sig: "(id, RegulationPayload)",
        fields: "stress_signal, recovery_signal, fatigue_load, urgency_pressure, heart_rate_proxy, hrv_proxy, sympathetic_tone, parasympathetic_tone"
      }
    ]
  },
  {
    group: "Goal Context",
    stability: "STABLE",
    endpoints: [
      {
        name: "update_goal",
        sig: "(id, GoalContextPayload)",
        fields: "primary_goal, secondary_goals[], mission_relevance, rules_of_engagement, command_directives[], faction_state_summary"
      }
    ]
  },
  {
    group: "Runtime Step",
    stability: "STABLE",
    endpoints: [
      {
        name: "step_instance",
        sig: "(id, context) → BrainStepResult",
        fields: "dt, loop_type (fast|mid|slow), current_time, simulation_phase, event_flags[]"
      }
    ]
  },
  {
    group: "Action Output",
    stability: "STABLE",
    endpoints: [
      {
        name: "get_action",
        sig: "(id) → BrainActionPacket",
        fields: "policy_type, action_priority, route_id, target_id, movement_intent, retreat_flag, escalation_flag, rationale_summary, confidence_score"
      }
    ]
  },
  {
    group: "Analytics",
    stability: "STABLE",
    endpoints: [
      {
        name: "get_analytics_snapshot",
        sig: "(id) → AnalyticsPacket",
        fields: "instance health, compute usage, emergence metrics, regulation state"
      },
      {
        name: "get_brain_health",
        sig: "() → BrainHealthPacket",
        fields: "overall health, subsystem statuses, blocking failures"
      }
    ]
  },
  {
    group: "Validation / Experiment",
    stability: "BETA",
    endpoints: [
      {
        name: "run_ablation",
        sig: "(config) → AblationResult",
        fields: "ablation_target, batch_size, metrics[]"
      },
      {
        name: "run_perturbation",
        sig: "(config) → PerturbationResult",
        fields: "perturbation_type, magnitude, evaluation_window"
      },
      {
        name: "compare_baseline",
        sig: "(compare_config)",
        fields: "candidate_id, baseline_id, metric_set"
      },
      {
        name: "submit_candidate",
        sig: "(candidate_config)",
        fields: "description, evidence[], source_attribution"
      },
      {
        name: "get_maturation_recommendations",
        sig: "() → Recommendation[]",
        fields: ""
      }
    ]
  }
];
function SectionHeader({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "px-3 py-1.5 border-b shrink-0",
      style: { borderColor: BORDER, background: PANEL_DARK },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[9px] tracking-widest uppercase",
          style: { color: MUTED },
          children
        }
      )
    }
  );
}
function InnerTab({
  id,
  label,
  active,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      "data-ocid": `deployment.${id}.tab`,
      onClick,
      className: "font-mono text-[8px] tracking-widest uppercase px-3 py-1.5 border-b-2 transition-all whitespace-nowrap",
      style: {
        color: active ? CYAN : DIM,
        borderBottomColor: active ? CYAN : "transparent",
        background: active ? "oklch(0.08 0.01 265)" : "transparent"
      },
      children: label
    }
  );
}
function StatusBadge({ status }) {
  const map = {
    active: GREEN,
    inactive: AMBER,
    incompatible: RED,
    STABLE: GREEN,
    BETA: AMBER
  };
  const c = map[status] ?? MUTED;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "font-mono text-[7px] tracking-widest uppercase px-1.5 py-0.5",
      style: { background: `${c}18`, color: c, border: `1px solid ${c}35` },
      children: status.toUpperCase()
    }
  );
}
const ACTION_TYPE_COLORS = {
  MOVE: "oklch(0.72 0.22 220)",
  ATTACK: "oklch(0.72 0.22 25)",
  RETREAT: "oklch(0.78 0.22 60)",
  FREEZE: "oklch(0.78 0.22 80)",
  INVESTIGATE: "oklch(0.72 0.2 155)",
  ESCALATE: "oklch(0.72 0.2 290)",
  RECOVER: "oklch(0.72 0.22 195)",
  HOLD_POSITION: "oklch(0.72 0.2 200)",
  ISSUE_ORDER: "oklch(0.72 0.2 280)",
  ALLOCATE_RESOURCE: "oklch(0.72 0.22 50)",
  ROUTE_SELECT: "oklch(0.72 0.22 195)",
  INTERACT: "oklch(0.72 0.22 175)",
  IDLE: "oklch(0.38 0.05 220)"
};
function TraceFilterBtn({
  label,
  active,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick,
      className: "font-mono text-[7px] uppercase tracking-widest px-2 py-0.5 rounded-sm transition-colors",
      style: {
        background: active ? "oklch(0.1 0.02 195)" : "transparent",
        border: `1px solid ${active ? "oklch(0.22 0.08 195)" : "oklch(0.18 0.04 255)"}`,
        color: active ? "oklch(0.72 0.22 195)" : "oklch(0.38 0.05 220)"
      },
      children: label
    }
  );
}
function DeploymentTab({ neural }) {
  const { data: canon } = useCanonicalState();
  const { data: fearM } = useFearMissionState();
  const integration = useBrainIntegrationSystem();
  const mgr = reactExports.useMemo(() => createDeploymentBindingManager(), []);
  const [activeInnerTab, setActiveInnerTab] = reactExports.useState("gate");
  const [showRegisterForm, setShowRegisterForm] = reactExports.useState(false);
  const [regName, setRegName] = reactExports.useState("");
  const [regType, setRegType] = reactExports.useState("npc");
  const [regVersion, setRegVersion] = reactExports.useState("1.0.0");
  const [bindingInput, setBindingInput] = reactExports.useState("{}");
  const [bindingResult, setBindingResult] = reactExports.useState(null);
  const [verifyResults, setVerifyResults] = reactExports.useState({});
  const [traceTick, setTraceTick] = reactExports.useState(0);
  const [traceAdapterFilter, setTraceAdapterFilter] = reactExports.useState("all");
  const traceIntervalRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!neural.isRunning && neural.start) {
      neural.start();
    }
  }, []);
  reactExports.useEffect(() => {
    var _a;
    if (!canon) return;
    (_a = neural.seedFromBackend) == null ? void 0 : _a.call(neural, {
      coherence: canon.coh,
      arousal: canon.ar,
      identityI: canon.ic,
      fearLevel: fearM == null ? void 0 : fearM.fearLevel
    });
  }, [canon, fearM, neural]);
  reactExports.useEffect(() => {
    if (activeInnerTab === "trace_return") {
      traceIntervalRef.current = setInterval(
        () => setTraceTick((t) => t + 1),
        2e3
      );
    } else {
      if (traceIntervalRef.current) clearInterval(traceIntervalRef.current);
    }
    return () => {
      if (traceIntervalRef.current) clearInterval(traceIntervalRef.current);
    };
  }, [activeInnerTab]);
  const checks = reactExports.useMemo(
    () => runAutoChecks(
      {
        isRunning: neural.isRunning,
        regions: neural.regions,
        saturatedRegions: neural.saturatedRegions,
        tick: neural.tick,
        sympatheticTone: neural.sympatheticTone,
        stressLoad: neural.sympatheticTone * 0.8,
        heartRate: neural.heartRate ?? 70
      },
      0.7,
      0.65,
      neural.isRunning,
      neural.isRunning
    ),
    [
      neural.isRunning,
      neural.tick,
      neural.sympatheticTone,
      neural.saturatedRegions,
      neural.regions,
      neural.heartRate
    ]
  );
  const readinessScore = checks.length > 0 ? checks.reduce((s, c) => s + c.score, 0) / checks.length : 0;
  const blockingCount = checks.flatMap((c) => c.failures).filter((f) => f.isBlocking).length;
  const gatePassed = integration.isGatePassed(readinessScore, blockingCount);
  const gateReasons = integration.getGateBlockReasons(
    readinessScore,
    blockingCount
  );
  const ingestStats = integration.getIngestStats();
  function handleRegister() {
    if (!regName.trim()) return;
    integration.registerAdapter({
      adapter_name: regName,
      deployment_type: regType,
      contract_version: regVersion,
      supported_payload_versions: [regVersion],
      supported_instance_types: ["individual_agent"],
      supported_role_overlays: ["soldier"],
      supported_scope_overlays: ["local_tactical"],
      analytics_ingest_capabilities: ["action_result"]
    });
    setShowRegisterForm(false);
    setRegName("");
    setRegVersion("1.0.0");
  }
  function handleValidateBinding() {
    var _a;
    try {
      const map = JSON.parse(bindingInput);
      const result = integration.validateBindingMap(map);
      setBindingResult(result);
      createArtifact({
        artifact_type: "binding_validation",
        source_system: "core",
        title: "Binding Validation",
        summary: result.valid ? "Binding map validated successfully" : `Validation failed: ${(_a = result.errors) == null ? void 0 : _a.join("; ")}`,
        score: result.valid ? 100 : 20,
        status: result.valid ? "pass" : "fail",
        tags: ["binding", "validation", "integration"],
        metadata: { valid: result.valid, errors: result.errors ?? [] },
        related_artifact_ids: [],
        version: "1.0.0"
      });
    } catch {
      setBindingResult({ valid: false, errors: ["Invalid JSON"] });
    }
  }
  const INNER_TABS = [
    { id: "gate", label: "Gate Status" },
    { id: "contract", label: "Int. Contract" },
    { id: "ingest", label: "Analytics Ingest" },
    { id: "binding", label: "Binding" },
    { id: "adapters", label: "Adapters" },
    { id: "api", label: "API Contract" },
    { id: "live_flow", label: "Live Flow" },
    { id: "trace_return", label: "Trace Return" },
    { id: "treaty", label: "Treaty" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col overflow-hidden", children: [
    canon && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "shrink-0 flex items-center gap-4 px-3 py-1 border-b font-mono text-[9px] tracking-[0.12em]",
        style: { background: "oklch(0.07 0.015 265)", borderColor: BORDER },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: MUTED }, children: "ORGANISM LIVE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: MUTED }, children: "COH" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                color: canon.coh > 0.7 ? GREEN : canon.coh > 0.4 ? AMBER : RED
              },
              children: canon.coh.toFixed(3)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: MUTED }, children: "FEAR" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: ((fearM == null ? void 0 : fearM.fearLevel) ?? 0) > 0.5 ? RED : GREEN }, children: ((fearM == null ? void 0 : fearM.fearLevel) ?? 0).toFixed(3) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: MUTED }, children: "KHz" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: CYAN }, children: canon.kf.toFixed(3) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: MUTED }, children: "BEAT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.85 0.06 210)" }, children: String(Number(canon.b)).padStart(8, "0") })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "px-4 py-2.5 shrink-0 border-b flex items-center justify-between gap-4",
        style: {
          background: gatePassed ? `${GREEN}12` : `${RED}12`,
          borderColor: gatePassed ? `${GREEN}40` : `${RED}40`,
          borderBottom: `2px solid ${gatePassed ? GREEN : RED}`
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-2 h-2 rounded-full shrink-0",
                style: {
                  background: gatePassed ? GREEN : RED,
                  boxShadow: `0 0 8px ${gatePassed ? GREEN : RED}`
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-mono text-[10px] font-bold tracking-widest uppercase",
                style: { color: gatePassed ? GREEN : RED },
                children: [
                  "DEPLOYMENT GATE: ",
                  gatePassed ? "CLEARED" : "BLOCKED"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-mono text-[9px]",
                style: { color: gatePassed ? GREEN : AMBER },
                children: [
                  (readinessScore * 100).toFixed(0),
                  "% readiness · ",
                  blockingCount,
                  " ",
                  "blocking failures"
                ]
              }
            )
          ] }),
          !gatePassed && gateReasons.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 flex-wrap", children: gateReasons.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[7px]",
              style: { color: RED },
              children: [
                "✕ ",
                r
              ]
            },
            r
          )) }),
          gatePassed && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[8px]", style: { color: GREEN }, children: [
            "✓ Brain deployment-eligible · ",
            (/* @__PURE__ */ new Date()).toLocaleTimeString()
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex border-b shrink-0 overflow-x-auto",
        style: { background: PANEL_DARK, borderColor: BORDER },
        children: INNER_TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          InnerTab,
          {
            id: t.id,
            label: t.label,
            active: activeInnerTab === t.id,
            onClick: () => setActiveInnerTab(t.id)
          },
          t.id
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-hidden", children: [
      activeInnerTab === "gate" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full overflow-y-auto p-3 flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: [
          {
            label: "Readiness Score",
            value: `${(readinessScore * 100).toFixed(0)}%`,
            color: readinessScore > 0.65 ? GREEN : RED
          },
          {
            label: "Blocking Failures",
            value: blockingCount.toString(),
            color: blockingCount === 0 ? GREEN : RED
          },
          {
            label: "Active Adapters",
            value: integration.activeAdapterCount.toString(),
            color: CYAN
          },
          {
            label: "Registered Adapters",
            value: integration.registeredAdapterCount.toString(),
            color: MUTED
          },
          {
            label: "Active Sessions",
            value: integration.activeSessions.filter((s) => s.status === "active").length.toString(),
            color: AMBER
          },
          {
            label: "Ingest Events",
            value: ingestStats.total.toString(),
            color: "oklch(0.68 0.22 260)"
          }
        ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border p-2 flex flex-col gap-0.5",
            style: { background: PANEL, borderColor: BORDER },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px] uppercase",
                  style: { color: DIM },
                  children: stat.label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-lg font-bold",
                  style: { color: stat.color },
                  children: stat.value
                }
              )
            ]
          },
          stat.label
        )) }),
        !gatePassed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border p-3 flex flex-col gap-1.5",
            style: { background: `${RED}08`, borderColor: `${RED}30` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[8px] tracking-widest uppercase",
                  style: { color: RED },
                  children: "Gate Blockers"
                }
              ),
              gateReasons.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[8px]",
                  style: { color: AMBER },
                  children: [
                    "→ ",
                    r
                  ]
                },
                r
              ))
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border p-3 flex flex-col gap-1.5",
            style: { background: PANEL, borderColor: BORDER },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[8px] tracking-widest uppercase",
                  style: { color: MUTED },
                  children: "Mutation Boundary Status"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-2 h-2 rounded-full",
                    style: { background: GREEN, boxShadow: `0 0 6px ${GREEN}` }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono text-[9px] font-bold",
                    style: { color: GREEN },
                    children: [
                      "BOUNDARY ENFORCED — ",
                      integration.mutationBoundary.violations,
                      " ",
                      "violations"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: DIM }, children: [
                "All candidates routed to validation queue. No direct promotion permitted. Last check:",
                " ",
                new Date(
                  integration.mutationBoundary.last_check_ts
                ).toLocaleTimeString()
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border p-3 flex flex-col gap-1",
            style: { background: PANEL, borderColor: BORDER },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[8px] tracking-widest uppercase",
                  style: { color: MUTED },
                  children: "Contract Version"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[11px] font-bold",
                  style: { color: CYAN },
                  children: integration.contractVersion
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: DIM }, children: [
                "Supported: ",
                integration.supportedContractVersions.join(", ")
              ] })
            ]
          }
        )
      ] }),
      activeInnerTab === "contract" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionHeader, { children: [
          "Registered Adapters · ",
          integration.adapters.length,
          " Total"
        ] }),
        showRegisterForm ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "p-3 border-b flex flex-col gap-2",
            style: { borderColor: BORDER, background: `${CYAN}06` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase",
                  style: { color: CYAN },
                  children: "Register New Adapter"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    "data-ocid": "deployment.input",
                    value: regName,
                    onChange: (e) => setRegName(e.target.value),
                    placeholder: "Adapter name",
                    className: "font-mono text-[9px] px-2 py-1 border flex-1",
                    style: {
                      background: PANEL,
                      borderColor: BORDER,
                      color: MUTED,
                      minWidth: 140
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    "data-ocid": "deployment.select",
                    value: regType,
                    onChange: (e) => setRegType(e.target.value),
                    className: "font-mono text-[9px] px-2 py-1 border",
                    style: {
                      background: PANEL,
                      borderColor: BORDER,
                      color: MUTED
                    },
                    children: DEPLOYMENT_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t }, t))
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    value: regVersion,
                    onChange: (e) => setRegVersion(e.target.value),
                    placeholder: "Contract version",
                    className: "font-mono text-[9px] px-2 py-1 border w-28",
                    style: {
                      background: PANEL,
                      borderColor: BORDER,
                      color: MUTED
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "deployment.confirm_button",
                    onClick: handleRegister,
                    className: "font-mono text-[8px] tracking-widest uppercase px-3 py-1 border",
                    style: {
                      border: `1px solid ${GREEN}60`,
                      color: GREEN,
                      background: `${GREEN}10`
                    },
                    children: "Register"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "deployment.cancel_button",
                    onClick: () => setShowRegisterForm(false),
                    className: "font-mono text-[8px] tracking-widest uppercase px-3 py-1 border",
                    style: {
                      border: `1px solid ${RED}60`,
                      color: RED,
                      background: `${RED}10`
                    },
                    children: "Cancel"
                  }
                )
              ] })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 border-b", style: { borderColor: BORDER }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "deployment.open_modal_button",
            onClick: () => setShowRegisterForm(true),
            className: "font-mono text-[8px] tracking-widest uppercase px-3 py-1 border",
            style: {
              border: `1px solid ${CYAN}50`,
              color: CYAN,
              background: `${CYAN}08`
            },
            children: "+ Register New Adapter"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "tr",
            {
              style: {
                background: PANEL_DARK,
                borderBottom: `1px solid ${BORDER}`
              },
              children: [
                "Name",
                "Type",
                "Version",
                "Status",
                "Compat.",
                "Sessions",
                "Actions"
              ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "th",
                {
                  className: "py-1 px-2 text-left font-mono text-[7px] tracking-widest uppercase",
                  style: { color: DIM },
                  children: h
                },
                h
              ))
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: integration.adapters.map((adapter, i) => {
            const compat = integration.checkCompatibility(
              adapter.adapter_id
            );
            const hasSession = integration.activeSessions.some(
              (s) => s.adapter_id === adapter.adapter_id && s.status === "active"
            );
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                "data-ocid": `deployment.row.${i + 1}`,
                style: { borderBottom: "1px solid oklch(0.12 0.02 255)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "td",
                    {
                      className: "py-1.5 px-2 font-mono text-[8px]",
                      style: { color: "oklch(0.7 0.1 200)" },
                      children: adapter.adapter_name
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "td",
                    {
                      className: "py-1.5 px-2 font-mono text-[8px]",
                      style: { color: MUTED },
                      children: adapter.deployment_type
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "td",
                    {
                      className: "py-1.5 px-2 font-mono text-[8px]",
                      style: { color: DIM },
                      children: adapter.contract_version
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: adapter.status }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-1.5 px-2", children: [
                    compat.compatible ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px]",
                        style: { color: GREEN },
                        children: "✓ OK"
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px]",
                        style: { color: RED },
                        children: "✕ MISMATCH"
                      }
                    ),
                    compat.warnings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] ml-1",
                        style: { color: AMBER },
                        children: "⚠"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "td",
                    {
                      className: "py-1.5 px-2 font-mono text-[8px]",
                      style: { color: hasSession ? GREEN : DIM },
                      children: hasSession ? "1 active" : "—"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                    adapter.status !== "active" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => integration.activateAdapter(adapter.adapter_id),
                        className: "font-mono text-[7px] uppercase px-1.5 py-0.5 border",
                        style: {
                          border: `1px solid ${GREEN}40`,
                          color: GREEN,
                          background: `${GREEN}08`,
                          opacity: adapter.status === "incompatible" ? 0.4 : 1
                        },
                        disabled: adapter.status === "incompatible",
                        children: "Activate"
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => integration.deactivateAdapter(
                          adapter.adapter_id
                        ),
                        className: "font-mono text-[7px] uppercase px-1.5 py-0.5 border",
                        style: {
                          border: `1px solid ${AMBER}40`,
                          color: AMBER,
                          background: `${AMBER}08`
                        },
                        children: "Deactivate"
                      }
                    ),
                    !hasSession ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "deployment.session.button",
                        onClick: () => {
                          if (gatePassed) {
                            integration.beginSession(
                              adapter.adapter_id,
                              true
                            );
                          }
                          liveBrainBus.start();
                          const activeRegions = neural.regions ?? [];
                          const avgActivation = activeRegions.length > 0 ? activeRegions.reduce(
                            (s, r) => s + (r.activation ?? 0),
                            0
                          ) / activeRegions.length : 0.5;
                          liveBrainBus.routePayload(adapter.adapter_id, {
                            threat_level: Math.min(
                              1,
                              (neural.sympatheticTone ?? 0.3) * 1.2
                            ),
                            reward_level: Math.max(
                              0,
                              avgActivation - 0.2
                            ),
                            novelty: 0.5,
                            urgency: neural.sympatheticTone ?? 0.3,
                            salience: avgActivation,
                            fatigue: 1 - (neural.heartRate ? Math.min(1, neural.heartRate / 100) : 0.5)
                          });
                        },
                        title: !gatePassed ? "Brain not ready for deployment — resolve readiness blockers first" : "",
                        className: "font-mono text-[7px] uppercase px-1.5 py-0.5 border",
                        style: {
                          border: `1px solid ${CYAN}40`,
                          color: gatePassed ? CYAN : DIM,
                          background: `${CYAN}08`,
                          opacity: gatePassed && adapter.status === "active" ? 1 : 0.4,
                          cursor: gatePassed && adapter.status === "active" ? "pointer" : "not-allowed"
                        },
                        disabled: !gatePassed || adapter.status !== "active",
                        children: "Begin Session"
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          const sess = integration.activeSessions.find(
                            (s) => s.adapter_id === adapter.adapter_id && s.status === "active"
                          );
                          if (sess)
                            integration.endSession(sess.session_id);
                        },
                        className: "font-mono text-[7px] uppercase px-1.5 py-0.5 border",
                        style: {
                          border: `1px solid ${RED}40`,
                          color: RED,
                          background: `${RED}08`
                        },
                        children: "End Session"
                      }
                    )
                  ] }) })
                ]
              },
              adapter.adapter_id
            );
          }) })
        ] }),
        integration.getVersionMismatches().length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "p-3 border-t flex flex-col gap-1",
            style: { borderColor: BORDER, background: `${AMBER}08` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[8px] tracking-widest uppercase",
                  style: { color: AMBER },
                  children: "⚠ Version Mismatches"
                }
              ),
              integration.getVersionMismatches().map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[7px]",
                  style: { color: MUTED },
                  children: [
                    a.adapter_name,
                    ": contract v",
                    a.contract_version,
                    " — expected v",
                    integration.contractVersion
                  ]
                },
                a.adapter_id
              ))
            ]
          }
        )
      ] }),
      (() => {
        const busStatus = liveBrainBus.getBusStatus();
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-1.5 border-b flex items-center gap-4 shrink-0",
            style: { borderColor: BORDER, background: PANEL_DARK },
            "data-ocid": "deployment.brain_bus.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[8px] tracking-widest uppercase",
                  style: { color: "oklch(0.42 0.06 220)" },
                  children: "BRAIN BUS"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: busStatus.isActive ? GREEN : "oklch(0.4 0.1 220)",
                      boxShadow: busStatus.isActive ? `0 0 6px ${GREEN}` : "none"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] font-bold",
                    style: {
                      color: busStatus.isActive ? GREEN : "oklch(0.4 0.1 220)"
                    },
                    children: busStatus.isActive ? "LIVE" : "OFFLINE"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: MUTED }, children: [
                "PAYLOADS:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: CYAN }, children: busStatus.payloadsRouted })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: MUTED }, children: [
                "PACKETS:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: GREEN }, children: busStatus.packetsReturned })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: MUTED }, children: [
                "LATENCY:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    style: { color: busStatus.latencyMs < 5 ? GREEN : AMBER },
                    children: [
                      busStatus.latencyMs,
                      "ms"
                    ]
                  }
                )
              ] })
            ]
          }
        );
      })(),
      (() => {
        const busStatus = liveBrainBus.getBusStatus();
        if (busStatus.packetsReturned === 0) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-1.5 shrink-0 flex items-center gap-2",
            style: {
              background: "oklch(0.13 0.04 140)",
              borderBottom: "1px solid oklch(0.72 0.22 140 / 0.3)"
            },
            "data-ocid": "deployment.packet_flow.success_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: GREEN,
                    boxShadow: `0 0 8px ${GREEN}`,
                    animation: "pulse 1.5s infinite"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[8px] font-bold tracking-widest",
                  style: { color: GREEN },
                  children: [
                    "LIVE — ",
                    busStatus.packetsReturned,
                    " BrainActionPacket",
                    busStatus.packetsReturned !== 1 ? "s" : "",
                    " flowing"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px]",
                  style: { color: "oklch(0.55 0.12 140)" },
                  children: "· Go-Live payload gate cleared · Open Go-Live Declaration to declare"
                }
              )
            ]
          }
        );
      })(),
      activeInnerTab === "bind" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "h-full flex flex-col overflow-hidden",
          "data-ocid": "deployment.bind_contract.panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-3 py-2 border-b shrink-0",
                style: { borderColor: BORDER, background: PANEL_DARK },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[8px] tracking-widest uppercase",
                        style: { color: CYAN },
                        children: [
                          "EXTERNAL BIND CONTRACT — v",
                          CONTRACT_VERSION
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "deployment.bind_contract.button",
                        onClick: async () => {
                          try {
                            const mod = await __vitePreload(() => Promise.resolve().then(() => externalBindContract), true ? void 0 : void 0);
                            const raw = JSON.stringify(
                              {
                                CONTRACT_VERSION: mod.CONTRACT_VERSION,
                                PAYLOAD_SCHEMA_VERSION: mod.PAYLOAD_SCHEMA_VERSION,
                                CANONICAL_INSTANCE_TYPES: mod.CANONICAL_INSTANCE_TYPES
                              },
                              null,
                              2
                            );
                            const text = `// externalBindContract.ts — copy this into BattleOps and WarCommandOps
// CONTRACT_VERSION: ${mod.CONTRACT_VERSION}
// PAYLOAD_SCHEMA_VERSION: ${mod.PAYLOAD_SCHEMA_VERSION}
//
// Paste into your project and call:
//   const client = new CoreBindClient();
//   const sessionId = client.begin_adapter_session("your-adapter-id", manifest);
//   const packet = client.step_brain(instanceId, perceptionPayload);
//   client.end_adapter_session(sessionId);

${raw}`;
                            await navigator.clipboard.writeText(text);
                          } catch {
                          }
                        },
                        className: "font-mono text-[7px] uppercase px-2 py-0.5 border",
                        style: {
                          border: `1px solid ${CYAN}40`,
                          color: CYAN,
                          background: `${CYAN}08`,
                          cursor: "pointer"
                        },
                        children: "Copy Contract"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-mono text-[7px] mt-1",
                      style: { color: "oklch(0.45 0.06 220)" },
                      children: "Copy this file into your separate BattleOps and WarCommandOps Caffeine projects. Call begin_adapter_session on world entry, step_brain on each tick, and end_adapter_session on exit."
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex-1 overflow-auto p-3",
                style: { background: PANEL },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[8px] leading-relaxed",
                    style: {
                      color: "oklch(0.55 0.08 220)",
                      whiteSpace: "pre-wrap"
                    },
                    children: `// Endpoints (stable, CONTRACT_VERSION: ${CONTRACT_VERSION})

begin_adapter_session(adapterId, manifest) → sessionId
step_brain(instanceId, perceptionPayload) → BrainActionPacket
end_adapter_session(sessionId) → void
verify_live(adapterId) → { is_live, packets_returned, latency_ms }
ingest_action_result(payload) → void

// BrainActionPacket fields:
// action_type: MOVE | ATTACK | RETREAT | HOLD | INVESTIGATE | ISSUE_ORDER | IDLE
// action_params: typed per action_type
// confidence: 0–1
// salience_score: 0–1
// predicted_outcome: string
// trace_id: string
// instance_id: string
// timestamp: number

// PerceptionPayload fields:
// threat_level: 0–1
// reward_level: 0–1
// novelty: 0–1
// urgency: 0–1
// salience: 0–1
// fatigue: 0–1`
                  }
                )
              }
            )
          ]
        }
      ),
      activeInnerTab === "ingest" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-2 border-b flex gap-4 shrink-0",
            style: { borderColor: BORDER, background: PANEL_DARK },
            children: [
              [
                { label: "Total", value: ingestStats.total, color: CYAN },
                { label: "Valid", value: ingestStats.valid, color: GREEN },
                {
                  label: "Invalid",
                  value: ingestStats.invalid,
                  color: ingestStats.invalid > 0 ? RED : MUTED
                }
              ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[7px] uppercase",
                    style: { color: DIM },
                    children: s.label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[10px] font-bold",
                    style: { color: s.color },
                    children: s.value
                  }
                )
              ] }, s.label)),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-2 flex gap-2 flex-wrap", children: Object.entries(ingestStats.by_type).map(([type, count]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[7px]",
                  style: { color: DIM },
                  children: [
                    type.replace(/_/g, "·"),
                    ":",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: MUTED }, children: count })
                  ]
                },
                type
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-1.5 border-b shrink-0 flex items-center gap-3",
            style: { borderColor: BORDER },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-2 h-2 rounded-full",
                  style: { background: GREEN, boxShadow: `0 0 6px ${GREEN}` }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[8px] font-bold",
                  style: { color: GREEN },
                  children: [
                    "BOUNDARY ENFORCED — ",
                    integration.mutationBoundary.violations,
                    " ",
                    "violations"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: DIM }, children: "No direct mutation permitted through ingest path" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-2 border-b flex gap-1.5 flex-wrap shrink-0",
            style: { borderColor: BORDER },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px] uppercase self-center",
                  style: { color: DIM },
                  children: "Simulate:"
                }
              ),
              INGEST_TYPES.map((type) => {
                const activeAdapter = integration.adapters.find(
                  (a) => a.status === "active"
                );
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => activeAdapter && integration.simulateIngest(activeAdapter.adapter_id, type),
                    className: "font-mono text-[7px] uppercase px-2 py-0.5 border",
                    style: {
                      border: `1px solid ${CYAN}35`,
                      color: CYAN,
                      background: `${CYAN}08`
                    },
                    children: type.replace(/_/g, "·")
                  },
                  type
                );
              })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "thead",
            {
              className: "sticky top-0",
              style: { background: PANEL_DARK },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { style: { borderBottom: `1px solid ${BORDER}` }, children: [
                "Source Adapter",
                "Type",
                "Ingested At",
                "Schema",
                "Summary"
              ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "th",
                {
                  className: "py-1 px-2 text-left font-mono text-[7px] tracking-widest uppercase",
                  style: { color: DIM },
                  children: h
                },
                h
              )) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            integration.ingestLog.map((entry, i) => {
              const adapter = integration.adapters.find(
                (a) => a.adapter_id === entry.source_adapter
              );
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  "data-ocid": `deployment.row.${i + 1}`,
                  style: {
                    borderBottom: "1px solid oklch(0.11 0.02 260)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "td",
                      {
                        className: "py-1 px-2 font-mono text-[8px]",
                        style: { color: "oklch(0.65 0.1 200)" },
                        children: (adapter == null ? void 0 : adapter.adapter_name) ?? entry.source_adapter
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] uppercase",
                        style: { color: AMBER },
                        children: entry.type.replace(/_/g, " ")
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "td",
                      {
                        className: "py-1 px-2 font-mono text-[7px]",
                        style: { color: DIM },
                        children: new Date(entry.ingested_at).toLocaleTimeString()
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      StatusBadge,
                      {
                        status: entry.schema_valid ? "active" : "incompatible"
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "td",
                      {
                        className: "py-1 px-2 font-mono text-[7px]",
                        style: {
                          color: DIM,
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        },
                        children: entry.payload_summary
                      }
                    )
                  ]
                },
                entry.id
              );
            }),
            integration.ingestLog.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                colSpan: 5,
                className: "py-6 text-center font-mono text-[9px]",
                style: { color: DIM },
                "data-ocid": "deployment.empty_state",
                children: "No ingest events — use Simulate buttons above"
              }
            ) })
          ] })
        ] }) })
      ] }),
      activeInnerTab === "binding" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full overflow-y-auto p-3 flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border p-3 flex flex-col gap-2",
            style: { background: PANEL, borderColor: BORDER },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase",
                  style: { color: MUTED },
                  children: "Validate Binding Map (JSON)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  "data-ocid": "deployment.textarea",
                  value: bindingInput,
                  onChange: (e) => setBindingInput(e.target.value),
                  rows: 4,
                  className: "font-mono text-[8px] px-2 py-1.5 border resize-none w-full",
                  style: {
                    background: "oklch(0.08 0.01 265)",
                    borderColor: BORDER,
                    color: MUTED
                  },
                  placeholder: '{ "soldier_entity": "individual_agent", "squad_leader_entity": "squad_leader" }'
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "deployment.primary_button",
                    onClick: handleValidateBinding,
                    className: "font-mono text-[8px] tracking-widest uppercase px-3 py-1 border",
                    style: {
                      border: `1px solid ${CYAN}50`,
                      color: CYAN,
                      background: `${CYAN}08`
                    },
                    children: "Validate Map"
                  }
                ),
                bindingResult && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px]",
                    style: { color: bindingResult.valid ? GREEN : RED },
                    children: bindingResult.valid ? "✓ Valid binding map" : `✕ ${bindingResult.errors.join("; ")}`
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionHeader, { children: [
          "Canonical Instance Types ·",
          " ",
          integration.canonicalInstanceTypes.length,
          " Defined"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: integration.canonicalInstanceTypes.map((type, i) => {
          const req = integration.getBindingRequirements(type);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `deployment.item.${i + 1}`,
              className: "border p-2 flex flex-col gap-1",
              style: { background: PANEL, borderColor: BORDER },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px] font-bold",
                      style: { color: CYAN },
                      children: type
                    }
                  ),
                  req && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[7px] uppercase",
                      style: { color: DIM },
                      children: [
                        "auth: ",
                        req.authority_level
                      ]
                    }
                  )
                ] }),
                req && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[7px]",
                      style: { color: DIM },
                      children: [
                        "Roles:",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: MUTED }, children: req.required_role_overlays.join(", ") })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[7px]",
                      style: { color: DIM },
                      children: [
                        "Scopes:",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: MUTED }, children: req.required_scope_overlays.join(", ") })
                      ]
                    }
                  )
                ] })
              ]
            },
            type
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "Role × Scope Overlay Matrix" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "border-collapse text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { borderBottom: `1px solid ${BORDER}` }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                className: "py-1 px-2 font-mono text-[7px]",
                style: { color: DIM },
                children: "Role \\ Scope"
              }
            ),
            integration.canonicalScopeOverlays.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                className: "py-1 px-2 font-mono text-[7px] uppercase",
                style: { color: DIM },
                children: s
              },
              s
            ))
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: integration.canonicalRoleOverlays.map((role) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              style: { borderBottom: "1px solid oklch(0.12 0.02 255)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    className: "py-1 px-2 font-mono text-[8px]",
                    style: { color: CYAN },
                    children: role
                  }
                ),
                integration.canonicalScopeOverlays.map((scope) => {
                  const res = integration.getOverlayRequirements(
                    role,
                    scope
                  );
                  const validCombo = res.compatible;
                  return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px]",
                      style: {
                        color: validCombo ? GREEN : "oklch(0.18 0.04 255)"
                      },
                      children: validCombo ? "✓" : "·"
                    }
                  ) }, scope);
                })
              ]
            },
            role
          )) })
        ] }) })
      ] }),
      activeInnerTab === "adapters" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "section",
          {
            className: "flex flex-col border-r",
            style: {
              flex: "0 0 52%",
              overflow: "hidden",
              borderColor: BORDER
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionHeader, { children: [
                "Deployment Adapters · ",
                mgr.adapters.length,
                " Targets"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-2 flex flex-col gap-1.5", children: mgr.adapters.map((a, i) => {
                const sc = a.status === "active" ? GREEN : a.status === "standby" ? AMBER : RED;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": `deployment.item.${i + 1}`,
                    className: "border p-3 flex flex-col gap-2",
                    style: {
                      background: PANEL,
                      borderColor: `${sc}30`,
                      borderTop: `2px solid ${sc}`
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-[10px] font-bold",
                            style: { color: "oklch(0.8 0.1 200)" },
                            children: a.name
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-[7px] tracking-widest uppercase px-1.5 py-0.5",
                            style: {
                              background: `${CYAN}18`,
                              color: CYAN,
                              border: `1px solid ${CYAN}30`
                            },
                            children: a.type
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "font-mono text-[8px]",
                          style: { color: MUTED },
                          children: a.description
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[7px] uppercase",
                              style: { color: DIM },
                              children: "Instances"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[11px] font-bold",
                              style: { color: sc },
                              children: a.boundInstances
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[7px] uppercase",
                              style: { color: DIM },
                              children: "Status"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[8px] uppercase tracking-widest",
                              style: { color: sc },
                              children: a.status
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: a.capabilities.map((cap) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[7px] uppercase tracking-widest px-1 py-0.5",
                          style: {
                            background: "oklch(0.12 0.02 255)",
                            color: DIM,
                            border: "1px solid oklch(0.16 0.03 255)"
                          },
                          children: cap.replace(/_/g, " ")
                        },
                        cap
                      )) })
                    ]
                  },
                  a.id
                );
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "border-t flex flex-col shrink-0",
                  style: { borderColor: BORDER, maxHeight: "35%" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "Entity Binding Table" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "table",
                      {
                        "data-ocid": "deployment.table",
                        className: "w-full border-collapse",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "tr",
                            {
                              style: {
                                background: "oklch(0.08 0.012 265)",
                                borderBottom: `1px solid ${BORDER}`
                              },
                              children: ["Entity Class", "Brain Type", "Role", "Scope"].map(
                                (h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "th",
                                  {
                                    className: "py-1 px-2 text-left font-mono text-[7px] tracking-widest uppercase",
                                    style: { color: DIM },
                                    children: h
                                  },
                                  h
                                )
                              )
                            }
                          ) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: mgr.bindingTable.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "tr",
                            {
                              "data-ocid": `deployment.row.${i + 20}`,
                              style: {
                                borderBottom: "1px solid oklch(0.12 0.02 255)"
                              },
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "td",
                                  {
                                    className: "py-1 px-2 font-mono text-[8px]",
                                    style: { color: "oklch(0.65 0.1 200)" },
                                    children: b.entityClass
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "td",
                                  {
                                    className: "py-1 px-2 font-mono text-[8px]",
                                    style: { color: MUTED },
                                    children: b.brainInstanceType
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "td",
                                  {
                                    className: "py-1 px-2 font-mono text-[8px]",
                                    style: { color: DIM },
                                    children: b.roleOverlayId.replace("role_", "")
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "td",
                                  {
                                    className: "py-1 px-2 font-mono text-[8px]",
                                    style: { color: DIM },
                                    children: b.scopeOverlayId.replace("scope_", "")
                                  }
                                )
                              ]
                            },
                            b.entityClass
                          )) })
                        ]
                      }
                    ) })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "section",
          {
            className: "flex flex-col",
            style: { flex: 1, overflow: "hidden" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "Role Overlays · 8 Defined" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    flex: "0 0 auto",
                    maxHeight: "50%",
                    overflowY: "auto"
                  },
                  children: mgr.roleOverlays.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      "data-ocid": `deployment.item.${i + 5}`,
                      className: "px-3 py-1.5 border-b flex items-center gap-3",
                      style: { borderColor: "oklch(0.13 0.03 255)" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-[8px] w-32 shrink-0",
                            style: { color: "oklch(0.65 0.1 200)" },
                            children: r.name
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[7px] uppercase",
                              style: { color: DIM },
                              children: "Risk"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                width: 32,
                                height: 3,
                                background: "oklch(0.14 0.03 255)",
                                borderRadius: 2,
                                overflow: "hidden"
                              },
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "div",
                                {
                                  style: {
                                    width: `${r.riskTolerance * 100}%`,
                                    height: "100%",
                                    background: AMBER
                                  }
                                }
                              )
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[7px] uppercase",
                              style: { color: DIM },
                              children: "Auth"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                width: 32,
                                height: 3,
                                background: "oklch(0.14 0.03 255)",
                                borderRadius: 2,
                                overflow: "hidden"
                              },
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "div",
                                {
                                  style: {
                                    width: `${r.authorityLevel * 100}%`,
                                    height: "100%",
                                    background: CYAN
                                  }
                                }
                              )
                            }
                          )
                        ] })
                      ]
                    },
                    r.id
                  ))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t", style: { borderColor: BORDER }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "Scope Overlays · 5 Defined" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 p-2 flex-wrap", children: mgr.scopeOverlays.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "px-2 py-1.5 border flex flex-col gap-0.5",
                    style: {
                      background: PANEL,
                      borderColor: "oklch(0.16 0.04 255)",
                      minWidth: 80
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px]",
                          style: { color: CYAN },
                          children: s.name
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "font-mono text-[7px]",
                          style: { color: DIM },
                          children: [
                            "Auth ",
                            (s.actionAuthority * 100).toFixed(0),
                            "%"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "font-mono text-[7px]",
                          style: { color: DIM },
                          children: [
                            "Mem",
                            " ",
                            s.memoryHorizon >= 3600 ? `${s.memoryHorizon / 3600}h` : `${s.memoryHorizon}s`
                          ]
                        }
                      )
                    ]
                  },
                  s.id
                )) })
              ] })
            ]
          }
        )
      ] }),
      activeInnerTab === "api" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-1.5 border-b flex items-center gap-3",
            style: { borderColor: BORDER, background: PANEL_DARK },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[8px]", style: { color: MUTED }, children: [
                "Contract v",
                integration.contractVersion
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[8px]", style: { color: DIM }, children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[8px]", style: { color: DIM }, children: "14 API Groups" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[8px]", style: { color: DIM }, children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[8px]", style: { color: GREEN }, children: "9 STABLE · 5 BETA" })
            ]
          }
        ),
        API_GROUPS.map((group, gi) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border-b",
            style: { borderColor: BORDER },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "px-3 py-1.5 flex items-center gap-2",
                  style: { background: "oklch(0.08 0.012 265)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[9px] font-bold",
                        style: { color: "oklch(0.72 0.12 200)" },
                        children: [
                          String(gi + 1).padStart(2, "0"),
                          ". ",
                          group.group
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: group.stability })
                  ]
                }
              ),
              group.endpoints.map((ep) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "px-4 py-2 border-t flex flex-col gap-0.5",
                  style: { borderColor: "oklch(0.12 0.02 255)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[9px] font-bold",
                          style: { color: CYAN },
                          children: ep.name
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px]",
                          style: { color: DIM },
                          children: ep.sig
                        }
                      )
                    ] }),
                    ep.fields && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[7px]",
                        style: { color: DIM },
                        children: [
                          "fields: ",
                          ep.fields
                        ]
                      }
                    )
                  ]
                },
                ep.name
              ))
            ]
          },
          group.group
        ))
      ] }),
      activeInnerTab === "live_flow" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full overflow-y-auto p-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-sm border p-3",
            style: { background: PANEL_DARK, borderColor: BORDER },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-mono text-[8px] uppercase tracking-widest mb-3",
                  style: { color: MUTED },
                  children: "BrainActionPacket Flow — Per Adapter"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: integration.adapters.filter(
                (a) => a.adapter_name.includes("BattleOps") || a.adapter_name.includes("WarCommandOps") || a.deployment_type === "war_game" || a.deployment_type === "scenario"
              ).map((adapter) => {
                var _a;
                const activeSession = integration.activeSessions.find(
                  (s) => s.adapter_id === adapter.adapter_id && s.status === "active"
                );
                const busStatus = liveBrainBus.getBusStatus();
                const adapterTraces = liveBrainBus.getTraceLog().filter((t) => t.adapter_id === adapter.adapter_id);
                const packetCount = adapterTraces.length;
                const recentPacket = liveBrainBus.getRecentPacket();
                const lastAction = ((_a = adapterTraces[0]) == null ? void 0 : _a.packet.action_type) ?? (recentPacket == null ? void 0 : recentPacket.action_type) ?? "—";
                const lastPacketMs = adapterTraces[0] ? Math.round(
                  (Date.now() - adapterTraces[0].timestamp) / 1e3
                ) : null;
                const vr = verifyResults[adapter.adapter_id];
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "rounded-sm border p-3",
                    style: {
                      background: "oklch(0.07 0.012 265)",
                      borderColor: BORDER
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2 gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "font-mono text-[10px] font-semibold",
                            style: { color: "oklch(0.82 0.04 220)" },
                            children: adapter.adapter_name
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm",
                              style: {
                                background: activeSession ? `${GREEN}18` : "oklch(0.1 0.02 260)",
                                color: activeSession ? GREEN : MUTED
                              },
                              children: activeSession ? "SESSION ACTIVE" : "NO SESSION"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              "data-ocid": "deployment.primary_button",
                              onClick: () => {
                                const result = liveBrainBus.verifyLive(
                                  adapter.adapter_id
                                );
                                setVerifyResults((prev) => ({
                                  ...prev,
                                  [adapter.adapter_id]: result
                                }));
                              },
                              className: "font-mono text-[7px] uppercase tracking-widest px-2 py-0.5 rounded-sm transition-colors",
                              style: {
                                background: "oklch(0.1 0.02 195)",
                                border: "1px solid oklch(0.22 0.08 195)",
                                color: CYAN
                              },
                              children: "VERIFY LIVE"
                            }
                          )
                        ] })
                      ] }),
                      vr && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "rounded-sm p-2 mb-2 flex flex-wrap gap-x-4 gap-y-0.5",
                          style: {
                            background: vr.is_live ? `${GREEN}10` : `${RED}10`,
                            border: `1px solid ${vr.is_live ? GREEN : RED}40`
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "font-mono text-[9px] font-bold uppercase tracking-widest",
                                style: { color: vr.is_live ? GREEN : RED },
                                children: vr.is_live ? "● LIVE" : "○ OFFLINE"
                              }
                            ),
                            [
                              ["Pkts", vr.packets_returned.toString()],
                              [
                                "Last",
                                vr.last_packet_ms === Number.POSITIVE_INFINITY ? "—" : `${Math.round(vr.last_packet_ms)}ms ago`
                              ],
                              ["Latency", `${vr.latency_ms.toFixed(1)}ms`],
                              ["Contract", vr.contract_version]
                            ].map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "span",
                              {
                                className: "font-mono text-[8px]",
                                style: { color: DIM },
                                children: [
                                  k,
                                  ":",
                                  " ",
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.72 0.22 195)" }, children: v })
                                ]
                              },
                              k
                            ))
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-x-4 gap-y-1", children: [
                        ["Packets Returned", packetCount.toString()],
                        ["Last Action Type", lastAction],
                        [
                          "Last Packet",
                          lastPacketMs !== null ? `${lastPacketMs}s ago` : "—"
                        ],
                        [
                          "ACK Status",
                          activeSession && packetCount > 0 && busStatus.isActive ? "ACK RECEIVED" : "—"
                        ]
                      ].map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "flex justify-between items-baseline",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "font-mono text-[8px]",
                                style: { color: MUTED },
                                children: k
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "font-mono text-[9px] font-semibold",
                                style: {
                                  color: v === "ACK RECEIVED" ? GREEN : "oklch(0.72 0.22 195)"
                                },
                                children: v
                              }
                            )
                          ]
                        },
                        k
                      )) })
                    ]
                  },
                  adapter.adapter_id
                );
              }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-sm border p-3",
            style: { background: PANEL_DARK, borderColor: BORDER },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-mono text-[8px] uppercase tracking-widest mb-3",
                  style: { color: MUTED },
                  children: "Payload Flow Status — Canonical Input Payloads"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [
                "PerceptionPayload",
                "EmbodimentPayload",
                "RegulationPayload",
                "GoalPayload"
              ].map((ptype) => {
                const activeSessions = integration.activeSessions.filter(
                  (s) => s.status === "active"
                );
                const hasSent = activeSessions.length > 0;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center justify-between py-1.5 border-b",
                    style: { borderColor: BORDER },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[9px]",
                          style: { color: "oklch(0.82 0.04 220)" },
                          children: ptype
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: integration.adapters.filter((a) => a.status === "active").slice(0, 3).map((adapter) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "font-mono text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm",
                          style: {
                            background: hasSent ? `${GREEN}15` : "oklch(0.1 0.02 260)",
                            color: hasSent ? GREEN : MUTED
                          },
                          children: [
                            adapter.adapter_name.split(" ")[0],
                            " ",
                            hasSent ? "SENT" : "IDLE"
                          ]
                        },
                        adapter.adapter_id
                      )) })
                    ]
                  },
                  ptype
                );
              }) })
            ]
          }
        )
      ] }),
      activeInnerTab === "trace_return" && (() => {
        const allTraces = liveBrainBus.getTraceLog();
        const adapterOptions = [
          "all",
          "battleops-adapter-v1",
          "warcommandops-adapter-v1"
        ];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "shrink-0 px-4 py-2 border-b flex items-center gap-3",
              style: { borderColor: BORDER },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-mono text-[9px] uppercase tracking-widest font-bold",
                    style: { color: CYAN },
                    children: "Trace Return Log"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 ml-auto", children: adapterOptions.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TraceFilterBtn,
                  {
                    label: opt === "all" ? "ALL" : opt.split("-")[0].toUpperCase(),
                    active: traceAdapterFilter === opt,
                    onClick: () => setTraceAdapterFilter(opt)
                  },
                  opt
                )) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "shrink-0 px-4 py-1.5 border-b flex gap-4",
              style: { borderColor: BORDER },
              children: [
                adapterOptions.filter((a) => a !== "all").map((aid) => {
                  const cnt = allTraces.filter(
                    (t) => t.adapter_id === aid
                  ).length;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[8px]",
                      style: { color: DIM },
                      children: [
                        aid.split("-")[0].toUpperCase(),
                        ":",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: cnt > 0 ? GREEN : MUTED }, children: [
                          cnt,
                          " traces"
                        ] })
                      ]
                    },
                    aid
                  );
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] ml-auto",
                    style: { color: DIM },
                    children: "Auto-refresh 2s"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: (() => {
            const filtered = traceAdapterFilter === "all" ? allTraces : allTraces.filter(
              (t) => t.adapter_id === traceAdapterFilter
            );
            if (filtered.length === 0) {
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "deployment.empty_state",
                  className: "flex flex-col items-center justify-center h-40 gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "font-mono text-[9px] text-center",
                        style: { color: DIM },
                        children: "No traces returned yet"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "font-mono text-[8px] text-center max-w-xs",
                        style: { color: "oklch(0.28 0.04 240)" },
                        children: "Start simulation and begin an adapter session to generate live payload flow"
                      }
                    )
                  ]
                }
              );
            }
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "table",
              {
                className: "w-full",
                style: { borderCollapse: "collapse" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { style: { background: "oklch(0.07 0.012 265)" }, children: [
                    "Trace ID",
                    "Adapter",
                    "Action",
                    "Conf",
                    "Latency",
                    "Time"
                  ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "th",
                    {
                      className: "font-mono text-[7px] uppercase tracking-widest px-3 py-1.5 text-left",
                      style: {
                        color: MUTED,
                        borderBottom: `1px solid ${BORDER}`
                      },
                      children: h
                    },
                    h
                  )) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.slice(0, 100).map((tr, i) => {
                    const aColor = ACTION_TYPE_COLORS[tr.packet.action_type] ?? MUTED;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "tr",
                      {
                        "data-ocid": `deployment.item.${Math.min(i + 1, 5)}`,
                        style: {
                          background: i % 2 === 0 ? "oklch(0.07 0.012 265)" : "transparent",
                          borderBottom: `1px solid ${BORDER}`
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "td",
                            {
                              className: "font-mono text-[8px] px-3 py-1.5",
                              style: { color: "oklch(0.45 0.07 220)" },
                              children: [
                                tr.trace_id.slice(0, 16),
                                "…"
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "td",
                            {
                              className: "font-mono text-[8px] px-3 py-1.5",
                              style: { color: "oklch(0.72 0.22 195)" },
                              children: tr.adapter_id.split("-")[0].toUpperCase()
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "td",
                            {
                              className: "font-mono text-[8px] px-3 py-1.5 font-semibold",
                              style: { color: aColor },
                              children: tr.packet.action_type
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "td",
                            {
                              className: "font-mono text-[8px] px-3 py-1.5",
                              style: { color: "oklch(0.72 0.22 80)" },
                              children: [
                                (tr.packet.confidence * 100).toFixed(0),
                                "%"
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "td",
                            {
                              className: "font-mono text-[8px] px-3 py-1.5",
                              style: { color: DIM },
                              children: [
                                tr.latency_ms.toFixed(1),
                                "ms"
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "td",
                            {
                              className: "font-mono text-[8px] px-3 py-1.5",
                              style: { color: DIM },
                              children: new Date(tr.timestamp).toLocaleTimeString()
                            }
                          )
                        ]
                      },
                      tr.trace_id
                    );
                  }) })
                ]
              }
            );
          })() })
        ] });
      })(),
      activeInnerTab === "treaty" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full overflow-y-auto p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SharedTreatyPanel, {}) })
    ] })
  ] });
}
export {
  DeploymentTab as default
};
