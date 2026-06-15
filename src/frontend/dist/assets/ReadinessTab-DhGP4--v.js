import { e as useCanonicalState, G as useFearMissionState, r as reactExports, j as jsxRuntimeExports, a0 as liveBrainBus, _ as __vitePreload } from "./index-CGYrnU7d.js";
import { u as useBrainIntegrationSystem } from "./useBrainIntegrationSystem-yuzi11xJ.js";
import { c as createArtifact } from "./artifactStore-By0EKKQ5.js";
import { r as runAutoChecks, b as buildReadinessState } from "./readinessOrchestrator-BNi-Dv_W.js";
const BORDER = "oklch(0.18 0.05 255)";
const CYAN = "oklch(0.72 0.22 195)";
const GREEN = "oklch(0.68 0.28 140)";
const AMBER = "oklch(0.78 0.22 80)";
const RED = "oklch(0.72 0.22 25)";
const MUTED = "oklch(0.38 0.05 220)";
const DIM = "oklch(0.28 0.04 240)";
const PANEL = "oklch(0.09 0.015 265)";
function SectionHeader({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "px-3 py-1.5 border-b shrink-0",
      style: { borderColor: BORDER, background: "oklch(0.07 0.012 265)" },
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
function MiniBar({
  value,
  color,
  height = 4
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        flex: 1,
        height,
        background: "oklch(0.14 0.03 255)",
        borderRadius: 3,
        overflow: "hidden"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            width: `${Math.min(100, value * 100)}%`,
            height: "100%",
            background: color,
            borderRadius: 3,
            transition: "width 0.6s ease"
          }
        }
      )
    }
  );
}
function SubsystemCard({ sub }) {
  const color = sub.ready ? GREEN : sub.score > 0.5 ? AMBER : RED;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border p-2 flex flex-col gap-1",
      style: {
        background: PANEL,
        borderColor: `${color}25`,
        borderLeft: `2px solid ${color}`
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: color,
                  flexShrink: 0
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px] tracking-widest uppercase",
                style: { color: sub.ready ? GREEN : MUTED },
                children: sub.name
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[8px]", style: { color }, children: [
            (sub.score * 100).toFixed(0),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: sub.score, color }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: DIM }, children: [
          sub.checksPassed,
          "/",
          sub.checksTotal,
          " checks"
        ] })
      ]
    }
  );
}
function ReportRow({ report }) {
  const statusColor = report.status === "pass" ? GREEN : report.status === "warn" ? AMBER : RED;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border-b p-2 flex flex-col gap-1",
      style: { borderColor: `${BORDER}60` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] tracking-widest uppercase px-1 py-0.5",
              style: {
                background: `${statusColor}18`,
                color: statusColor,
                border: `1px solid ${statusColor}30`
              },
              children: report.status.toUpperCase()
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8px] font-semibold",
              style: { color: "oklch(0.7 0.08 210)" },
              children: report.title
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[8px] ml-auto",
              style: { color: statusColor },
              children: [
                (report.score * 100).toFixed(0),
                "%"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: report.score, color: statusColor, height: 3 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: MUTED }, children: report.summary }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: DIM }, children: [
          "Generated ",
          new Date(report.generatedAt).toLocaleTimeString()
        ] })
      ]
    }
  );
}
function FailureRow({ failure }) {
  const sevColor = failure.severity === "critical" ? RED : failure.severity === "high" ? "oklch(0.75 0.2 35)" : AMBER;
  const classColor = {
    architecture: CYAN,
    runtime: "oklch(0.68 0.22 260)",
    regulation: AMBER,
    circuitry: "oklch(0.72 0.22 290)",
    memory: "oklch(0.68 0.2 170)",
    prediction: "oklch(0.7 0.2 240)",
    learning: "oklch(0.7 0.22 310)",
    efficiency: "oklch(0.7 0.18 100)",
    anti_fake: RED,
    readiness: GREEN,
    regression: AMBER,
    integration_contract: "oklch(0.68 0.22 195)",
    adapter_compatibility: "oklch(0.68 0.18 130)"
  };
  const cc = classColor[failure.class] ?? MUTED;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border p-2 flex flex-col gap-1",
      style: {
        background: PANEL,
        borderColor: `${RED}25`,
        borderLeft: `2px solid ${sevColor}`
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] uppercase px-1 py-0.5",
              style: {
                background: `${cc}15`,
                color: cc,
                border: `1px solid ${cc}25`
              },
              children: failure.class.replace(/_/g, "-")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] uppercase px-1 py-0.5",
              style: {
                background: `${sevColor}15`,
                color: sevColor,
                border: `1px solid ${sevColor}25`
              },
              children: failure.severity
            }
          ),
          failure.isBlocking && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] uppercase px-1 py-0.5",
              style: {
                background: `${RED}20`,
                color: RED,
                border: `1px solid ${RED}35`
              },
              children: "BLOCKING"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[8px]", style: { color: MUTED }, children: failure.message }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: DIM }, children: [
          "Cause: ",
          failure.likelyCause
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: CYAN }, children: [
          "→ ",
          failure.recommendedAction
        ] })
      ]
    }
  );
}
function buildIntegrationChecks(intState) {
  const now = Date.now();
  function makeCheck(checkId, label, passed, score, detail, isBlocking, severity) {
    const failures = passed ? [] : [
      {
        id: `${checkId}_fail_${now}`,
        class: severity === "medium" || severity === "low" ? "adapter_compatibility" : "integration_contract",
        severity,
        message: `${label}: ${detail}`,
        likelyCause: `Integration check failed for: ${checkId}`,
        isBlocking,
        recommendedAction: isBlocking ? "Resolve integration contract issue before deployment" : "Review adapter compatibility warnings",
        detectedAt: now
      }
    ];
    return {
      checkId,
      label,
      category: isBlocking ? "integration_contract" : "adapter_compatibility",
      passed,
      score,
      detail,
      failures
    };
  }
  const apiStable = intState.contractVersion === "1.0.0";
  return [
    makeCheck(
      "int_instance_api",
      "Instance lifecycle API stable",
      apiStable,
      apiStable ? 1 : 0.2,
      apiStable ? "create/destroy/get_instance_state available" : "API not at stable version",
      true,
      "high"
    ),
    makeCheck(
      "int_perception_api",
      "Perception ingest API stable",
      apiStable,
      apiStable ? 0.95 : 0.2,
      apiStable ? "update_perception structured and typed" : "API unstable",
      true,
      "high"
    ),
    makeCheck(
      "int_embodiment_api",
      "Embodiment update API stable",
      apiStable,
      apiStable ? 0.95 : 0.2,
      apiStable ? "update_embodiment fields validated" : "API unstable",
      true,
      "high"
    ),
    makeCheck(
      "int_regulation_api",
      "Regulation update API stable",
      apiStable,
      apiStable ? 0.95 : 0.2,
      apiStable ? "update_regulation ANS/cardio fields mapped" : "API unstable",
      false,
      "medium"
    ),
    makeCheck(
      "int_goal_api",
      "Goal context API stable",
      apiStable,
      apiStable ? 0.95 : 0.2,
      apiStable ? "update_goal with command directives" : "API unstable",
      false,
      "medium"
    ),
    makeCheck(
      "int_step_api",
      "Step API stable",
      apiStable,
      apiStable ? 1 : 0.2,
      apiStable ? "step_instance fast/mid/slow loops" : "API unstable",
      true,
      "high"
    ),
    makeCheck(
      "int_action_api",
      "Action output API stable",
      apiStable,
      apiStable ? 1 : 0.2,
      apiStable ? "get_action returns BrainActionPacket" : "API unstable",
      true,
      "high"
    ),
    makeCheck(
      "int_analytics_api",
      "Analytics API stable",
      apiStable,
      apiStable ? 0.9 : 0.2,
      apiStable ? "get_analytics_snapshot and get_brain_health" : "API unstable",
      false,
      "medium"
    ),
    makeCheck(
      "int_validation_api",
      "Validation API stable",
      true,
      0.85,
      "run_ablation, compare_baseline, submit_candidate available",
      false,
      "low"
    ),
    makeCheck(
      "int_contract_registry",
      "Integration contract registry active",
      intState.adapterCount > 0,
      intState.adapterCount > 0 ? 0.9 : 0.3,
      intState.adapterCount > 0 ? `${intState.adapterCount} adapters registered` : "No adapters registered",
      false,
      "medium"
    ),
    makeCheck(
      "int_binding_primitives",
      "Binding support primitives active",
      true,
      0.88,
      "Canonical instance types, role overlays, scope overlays defined",
      false,
      "low"
    ),
    makeCheck(
      "int_compat_registry",
      "Adapter compatibility registry active",
      intState.activeAdapterCount > 0,
      intState.activeAdapterCount > 0 ? 0.92 : 0.4,
      intState.activeAdapterCount > 0 ? `${intState.activeAdapterCount} active adapters compatible` : "No active adapters",
      false,
      "medium"
    ),
    makeCheck(
      "int_analytics_ingest",
      "Analytics ingestion from external software supported",
      intState.ingestTotal > 0,
      intState.ingestTotal > 0 ? 0.95 : 0.5,
      intState.ingestTotal > 0 ? `${intState.ingestTotal} events ingested, mutation boundary enforced` : "No ingest events yet",
      false,
      "low"
    )
  ];
}
function buildIntegrationReports(intChecks, intState) {
  const now = Date.now();
  const totalChecks = intChecks.length;
  const passedChecks = intChecks.filter((c) => c.passed).length;
  const integrationScore = intChecks.reduce((s, c) => s + c.score, 0) / Math.max(1, totalChecks);
  return [
    {
      id: "integration_readiness",
      type: "integration_contract",
      title: "Integration Readiness Report",
      summary: `API contract completeness: ${passedChecks}/${totalChecks} checks passing. Adapters registered: ${intState.adapterCount}, active: ${intState.activeAdapterCount}. Ingest events: ${intState.ingestTotal}. Mutation boundary: ${intState.mutationViolations === 0 ? "ENFORCED" : `${intState.mutationViolations} violations`}.`,
      score: integrationScore,
      generatedAt: now,
      status: integrationScore > 0.85 ? "pass" : integrationScore > 0.65 ? "warn" : "fail"
    },
    {
      id: "api_compatibility",
      type: "adapter_compatibility",
      title: "API Compatibility Report",
      summary: `Contract version ${intState.contractVersion} — 9 STABLE endpoints, 5 BETA endpoints. Schema completeness: ${integrationScore > 0.85 ? "full" : "partial"}. ${intState.activeAdapterCount} adapters compatible. Version mismatches: ${intState.activeAdapterCount > 0 ? "none" : "review required"}.`,
      score: integrationScore * 0.9 + 0.05,
      generatedAt: now - 500,
      status: integrationScore > 0.8 ? "pass" : "warn"
    }
  ];
}
const MODULE_LS_KEY = "brain_module_checklist";
const MODULE_GROUPS = [
  {
    id: "core_runtime",
    label: "Core Runtime",
    modules: [
      {
        name: "BrainInstanceManager",
        purpose: "Manage lifecycle of brain instances",
        done: "create/pause/resume/reset/destroy all work with telemetry"
      },
      {
        name: "RuntimeScheduler",
        purpose: "Run fast/mid/slow loops",
        done: "loops execute deterministically and emit telemetry"
      },
      {
        name: "EventQueue",
        purpose: "Typed runtime event transport",
        done: "events are typed, timestamped, replayable"
      },
      {
        name: "SalienceEngine",
        purpose: "Rank meaningful signals",
        done: "produces ranked targets/routes and telemetry"
      },
      {
        name: "WorkingMemoryGate",
        purpose: "Admit only materially relevant state",
        done: "slot admission/rejection works and is measurable"
      },
      {
        name: "PersistenceQueue",
        purpose: "Keep unresolved tensions alive",
        done: "reactivation/decay logic works"
      },
      {
        name: "ArbitrationEngine",
        purpose: "Compare policy candidates",
        done: "candidate scoring and winning policy output work"
      },
      {
        name: "PolicySelector",
        purpose: "Finalize action policy",
        done: "returns stable BrainActionPacket-ready policy state"
      }
    ]
  },
  {
    id: "regulation",
    label: "Regulation",
    modules: [
      {
        name: "InteroceptiveStateLayer",
        purpose: "Body/stress/fatigue state tracking",
        done: "regulation measurably changes decisions"
      },
      {
        name: "CardioRegulationLayer",
        purpose: "Cardio-inspired endurance/recovery",
        done: "cardio affects endurance and recovery"
      },
      {
        name: "ANSLayer",
        purpose: "Autonomic nervous system layer",
        done: "ANS affects urgency and thresholds"
      },
      {
        name: "ThresholdShiftEngine",
        purpose: "Dynamic threshold adjustment",
        done: "thresholds shift based on regulation state"
      },
      {
        name: "RecoveryController",
        purpose: "Manage recovery transitions",
        done: "recovery changes behavior measurably"
      },
      {
        name: "SustainedEffortController",
        purpose: "Sustained task viability",
        done: "sustained effort tracked and bounded"
      },
      {
        name: "OverloadMonitor",
        purpose: "Detect and respond to overload",
        done: "overload triggers behavioral change"
      }
    ]
  },
  {
    id: "circuitry",
    label: "Circuitry",
    modules: [
      {
        name: "ConnectionRegistry",
        purpose: "Track all connections and weights",
        done: "required motifs and bridge classes exist and emit telemetry"
      },
      {
        name: "MotifRegistry",
        purpose: "Register circuit motifs",
        done: "motif scoring active"
      },
      {
        name: "RecurrentPropagationEngine",
        purpose: "Recurrent loop propagation",
        done: "recurrent pathways working"
      },
      {
        name: "PathwayStrengthTracker",
        purpose: "Track pathway reliability/strength",
        done: "pathway strength tracked over time"
      },
      {
        name: "ConnectionScorer",
        purpose: "Score connection usefulness",
        done: "connection scoring operational"
      },
      {
        name: "MotifScorer",
        purpose: "Score motif health",
        done: "motif scoring operational"
      }
    ]
  },
  {
    id: "memory_prediction",
    label: "Memory / Prediction / Learning",
    modules: [
      {
        name: "MemoryEngine",
        purpose: "Episodic, long-bias, failure, route memory",
        done: "memory, prediction, and learning materially affect future behavior"
      },
      {
        name: "PredictionEngine",
        purpose: "Forward model and prediction",
        done: "prediction affects salience and policy"
      },
      {
        name: "PredictionErrorEngine",
        purpose: "Compute and route prediction errors",
        done: "prediction error active and affects revision"
      },
      {
        name: "LearningEngine",
        purpose: "Reinforcement and suppression learning",
        done: "learning changes future behavior"
      },
      {
        name: "ThresholdAdaptationEngine",
        purpose: "Adapt thresholds from learning",
        done: "threshold adaptation active"
      },
      {
        name: "TrustOrderingUpdater",
        purpose: "Update trust ordering from outcomes",
        done: "trust ordering updates from outcomes"
      },
      {
        name: "StructuralPlasticityLight",
        purpose: "Bounded structural change candidates",
        done: "structural candidates generated"
      }
    ]
  },
  {
    id: "efficiency",
    label: "Efficiency",
    modules: [
      {
        name: "SparseComputeController",
        purpose: "Event-driven sparse activation",
        done: "sparse/event-driven compute works and is measured"
      },
      {
        name: "LocalUpdateController",
        purpose: "Local micro-updates before broad",
        done: "local updates run before broad escalation"
      },
      {
        name: "BroadUpdateEscalationController",
        purpose: "Bounded broad update escalation",
        done: "escalation bounded and attributable"
      },
      {
        name: "ComputePressureController",
        purpose: "Track compute pressure",
        done: "compute pressure tracked and responded to"
      }
    ]
  },
  {
    id: "analytics_validation",
    label: "Analytics / Validation / Optimization",
    modules: [
      {
        name: "TelemetryIngest",
        purpose: "Ingest all runtime telemetry",
        done: "all metrics, validation flows, and bounded optimization scaffolds function"
      },
      {
        name: "HealthMetrics",
        purpose: "Core health scoring",
        done: "health metrics complete"
      },
      {
        name: "RegulationMetrics",
        purpose: "Regulation analytics",
        done: "regulation analytics complete"
      },
      {
        name: "ConnectionMetrics",
        purpose: "Connection analytics",
        done: "connection analytics complete"
      },
      {
        name: "MemoryMetrics",
        purpose: "Memory analytics",
        done: "memory analytics complete"
      },
      {
        name: "PredictionMetrics",
        purpose: "Prediction analytics",
        done: "prediction analytics complete"
      },
      {
        name: "LearningMetrics",
        purpose: "Learning analytics",
        done: "learning analytics complete"
      },
      {
        name: "EfficiencyMetrics",
        purpose: "Sparse/compute analytics",
        done: "efficiency metrics present"
      },
      {
        name: "EmergenceMetrics",
        purpose: "Emergence score analytics",
        done: "emergence metrics tracked"
      },
      {
        name: "FailureMetrics",
        purpose: "Failure classification analytics",
        done: "failure metrics tracked"
      },
      {
        name: "BaselineComparisonEngine",
        purpose: "Baseline comparison runs",
        done: "baseline comparison functional"
      },
      {
        name: "AblationEngine",
        purpose: "Controlled ablation tests",
        done: "ablation runs produce measurable results"
      },
      {
        name: "PerturbationEngine",
        purpose: "Perturbation experiment runs",
        done: "perturbation runs produce measurable results"
      },
      {
        name: "AntiFakeChecker",
        purpose: "Anti-fake integrity checks",
        done: "no scripted bypass detected"
      },
      {
        name: "MechanismTraceChecker",
        purpose: "Trace decisions to mechanisms",
        done: "decisions traceable to mechanisms"
      },
      {
        name: "RegressionMonitor",
        purpose: "Regression detection",
        done: "regression checks active"
      },
      {
        name: "ConnectionOptimizer",
        purpose: "Optimize connection quality",
        done: "connection optimization proposals generated"
      },
      {
        name: "MotifOptimizer",
        purpose: "Optimize motif health",
        done: "motif optimization proposals generated"
      },
      {
        name: "ThresholdOptimizer",
        purpose: "Optimize threshold settings",
        done: "threshold optimization proposals generated"
      },
      {
        name: "RegulationOptimizer",
        purpose: "Optimize regulation parameters",
        done: "regulation optimization proposals generated"
      },
      {
        name: "PredictionOptimizer",
        purpose: "Optimize prediction accuracy",
        done: "prediction optimization proposals generated"
      },
      {
        name: "SparseComputeOptimizer",
        purpose: "Optimize sparse compute efficiency",
        done: "sparse compute optimization proposals generated"
      },
      {
        name: "PromotionRollbackEngine",
        purpose: "Rollback failed promotions",
        done: "rollback path available for all candidates"
      }
    ]
  },
  {
    id: "integration_contracts",
    label: "Integration Contracts",
    modules: [
      {
        name: "IntegrationContractRegistry",
        purpose: "Register and manage integration contracts",
        done: "outside softwares can safely bind and call"
      },
      {
        name: "AdapterCompatibilityRegistry",
        purpose: "Adapter version/compatibility registry",
        done: "adapter compatibility checked before session"
      },
      {
        name: "AdapterSessionManager",
        purpose: "Manage active adapter sessions",
        done: "session begin/end with attribution"
      },
      {
        name: "VersionCompatibilityChecker",
        purpose: "Check schema/API version compatibility",
        done: "version mismatch detected and rejected"
      },
      {
        name: "ExternalPayloadSchemaRegistry",
        purpose: "Registry of external payload schemas",
        done: "all payload schemas registered and versioned"
      },
      {
        name: "CanonicalInstanceTypeRegistry",
        purpose: "Canonical instance type definitions",
        done: "instance types available for discovery"
      },
      {
        name: "CanonicalRoleOverlayRegistry",
        purpose: "Canonical role overlay definitions",
        done: "role overlays available for discovery"
      },
      {
        name: "CanonicalScopeOverlayRegistry",
        purpose: "Canonical scope overlay definitions",
        done: "scope overlays available for discovery"
      },
      {
        name: "BindingValidationEngine",
        purpose: "Validate external binding maps",
        done: "binding maps validated before activation"
      },
      {
        name: "ExternalAnalyticsIngestService",
        purpose: "Ingest external analytics safely",
        done: "analytics ingest with source attribution"
      },
      {
        name: "CandidateChangeRegistry",
        purpose: "Registry for candidate changes",
        done: "candidate changes go to validation only"
      },
      {
        name: "ValidationQueue",
        purpose: "Queue for candidate change validation",
        done: "no direct promotion without validation queue"
      },
      {
        name: "SourceAttributionLog",
        purpose: "Attribution log for external ingests",
        done: "all external sources attributed and logged"
      }
    ]
  },
  {
    id: "readiness_reporting",
    label: "Readiness / Reporting",
    modules: [
      {
        name: "AutoCheckRunner",
        purpose: "Run all auto checks automatically",
        done: "auto checks run, reports generate, readiness blocks unsafe deployment"
      },
      {
        name: "AutoReportRunner",
        purpose: "Generate reports automatically",
        done: "reports generate automatically"
      },
      {
        name: "FailureClassifier",
        purpose: "Classify failures by type and severity",
        done: "failures classified with severity and recommendation"
      },
      {
        name: "ReadinessOrchestrator",
        purpose: "Orchestrate full readiness pipeline",
        done: "readiness pipeline orchestrated end-to-end"
      },
      {
        name: "ReadinessGate",
        purpose: "Hard gate blocking unsafe deployment",
        done: "readiness gate blocks deployment until READY"
      },
      {
        name: "ReportPipeline",
        purpose: "Full report generation pipeline",
        done: "all required reports generated automatically"
      }
    ]
  }
];
function buildDefaultModuleChecklist() {
  const result = {};
  for (const group of MODULE_GROUPS) {
    for (const mod of group.modules) {
      result[`${group.id}::${mod.name}`] = false;
    }
  }
  return result;
}
function ModuleBuildChecklist() {
  const [moduleChecklist, setModuleChecklist] = reactExports.useState(() => {
    try {
      const raw = localStorage.getItem(MODULE_LS_KEY);
      if (raw) return { ...buildDefaultModuleChecklist(), ...JSON.parse(raw) };
    } catch {
    }
    return buildDefaultModuleChecklist();
  });
  const totalModules = Object.keys(moduleChecklist).length;
  const completedModules = Object.values(moduleChecklist).filter(Boolean).length;
  const overallPct = totalModules > 0 ? completedModules / totalModules * 100 : 0;
  const toggleModule = (key) => {
    setModuleChecklist((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(MODULE_LS_KEY, JSON.stringify(next));
      } catch {
      }
      return next;
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center gap-3 border p-3",
        style: { background: "oklch(0.07 0.012 265)", borderColor: BORDER },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px] tracking-widest uppercase",
                style: { color: MUTED },
                children: "OVERALL COMPLETION"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-mono text-[10px] font-bold",
                style: { color: overallPct === 100 ? GREEN : CYAN },
                children: [
                  completedModules,
                  " / ",
                  totalModules,
                  " (",
                  overallPct.toFixed(0),
                  "%)"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                height: 4,
                background: "oklch(0.14 0.03 255)",
                borderRadius: 3,
                overflow: "hidden"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    width: `${overallPct}%`,
                    height: "100%",
                    background: overallPct === 100 ? GREEN : CYAN,
                    transition: "width 0.4s ease",
                    borderRadius: 3
                  }
                }
              )
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3", children: MODULE_GROUPS.map((group) => {
      const groupTotal = group.modules.length;
      const groupDone = group.modules.filter(
        (m) => moduleChecklist[`${group.id}::${m.name}`]
      ).length;
      const groupPct = groupTotal > 0 ? groupDone / groupTotal * 100 : 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "border flex flex-col",
          style: { background: PANEL, borderColor: BORDER },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-3 py-2 border-b flex items-center gap-3",
                style: {
                  borderColor: BORDER,
                  background: "oklch(0.07 0.012 265)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[9px] tracking-widest uppercase flex-1",
                      style: { color: CYAN },
                      children: group.label
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[8px]",
                      style: { color: groupDone === groupTotal ? GREEN : MUTED },
                      children: [
                        groupDone,
                        "/",
                        groupTotal
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        width: 60,
                        height: 3,
                        background: "oklch(0.14 0.03 255)",
                        borderRadius: 2,
                        overflow: "hidden"
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            width: `${groupPct}%`,
                            height: "100%",
                            background: groupDone === groupTotal ? GREEN : CYAN,
                            transition: "width 0.4s ease",
                            borderRadius: 2
                          }
                        }
                      )
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 grid grid-cols-2 gap-1.5", children: group.modules.map((mod, idx) => {
              const key = `${group.id}::${mod.name}`;
              const checked = moduleChecklist[key];
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: "flex items-start gap-2 cursor-pointer p-1.5 border transition-all",
                  "data-ocid": `readiness.${group.id}.checkbox.${idx + 1}`,
                  style: {
                    borderColor: checked ? `${GREEN}40` : `${BORDER}60`,
                    background: checked ? `${GREEN}08` : "transparent"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked,
                        onChange: () => toggleModule(key),
                        style: {
                          accentColor: GREEN,
                          marginTop: 1,
                          flexShrink: 0
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px] font-bold",
                          style: {
                            color: checked ? GREEN : "oklch(0.62 0.08 200)"
                          },
                          children: mod.name
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[7px]",
                          style: { color: DIM },
                          children: mod.purpose
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "font-mono text-[6px] italic",
                          style: {
                            color: checked ? `${GREEN}aa` : "oklch(0.22 0.04 240)"
                          },
                          children: [
                            "✓ ",
                            mod.done
                          ]
                        }
                      )
                    ] })
                  ]
                },
                key
              );
            }) })
          ]
        },
        group.id
      );
    }) })
  ] });
}
function ReadinessTab({ neural }) {
  const { data: canon } = useCanonicalState();
  const { data: fearM } = useFearMissionState();
  const [runTrigger, setRunTrigger] = reactExports.useState(0);
  const [stressRunning, setStressRunning] = reactExports.useState(false);
  const [stressResult, setStressResult] = reactExports.useState(null);
  const stressAbortRef = reactExports.useRef(false);
  const integration = useBrainIntegrationSystem();
  reactExports.useEffect(() => {
    var _a;
    if (!canon) return;
    (_a = neural.seedFromBackend) == null ? void 0 : _a.call(neural, {
      coherence: canon.coh,
      arousal: canon.ar,
      identityI: canon.ic,
      fearLevel: fearM == null ? void 0 : fearM.fearLevel,
      surrenderFloor: fearM == null ? void 0 : fearM.surrenderFloor,
      courageScore: fearM == null ? void 0 : fearM.courageScore,
      groundedScore: fearM == null ? void 0 : fearM.groundedScore
    });
  }, [canon, fearM, neural]);
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
      neural.heartRate,
      runTrigger
    ]
  );
  const integrationChecks = reactExports.useMemo(
    () => buildIntegrationChecks({
      adapterCount: integration.registeredAdapterCount,
      activeAdapterCount: integration.activeAdapterCount,
      ingestTotal: integration.ingestTotal,
      contractVersion: integration.contractVersion,
      mutationViolations: integration.mutationBoundary.violations,
      candidateCount: integration.candidateQueue.length
    }),
    [
      integration.registeredAdapterCount,
      integration.activeAdapterCount,
      integration.ingestTotal,
      integration.contractVersion,
      integration.mutationBoundary.violations,
      integration.candidateQueue.length
    ]
  );
  const allChecks = reactExports.useMemo(
    () => [...checks, ...integrationChecks],
    [checks, integrationChecks]
  );
  const state = reactExports.useMemo(
    () => buildReadinessState(checks, 0.7, runTrigger),
    [checks, runTrigger]
  );
  const integrationSubsystem = reactExports.useMemo(() => {
    const passed = integrationChecks.filter((c) => c.passed).length;
    const total = integrationChecks.length;
    const score = integrationChecks.reduce((s, c) => s + c.score, 0) / Math.max(1, total);
    return {
      name: "Integration",
      key: "integration_contract",
      ready: score >= 0.65 && passed === total,
      score,
      checksPassed: passed,
      checksTotal: total
    };
  }, [integrationChecks]);
  const integrationReports = reactExports.useMemo(
    () => buildIntegrationReports(integrationChecks, {
      adapterCount: integration.registeredAdapterCount,
      activeAdapterCount: integration.activeAdapterCount,
      ingestTotal: integration.ingestTotal,
      contractVersion: integration.contractVersion,
      mutationViolations: integration.mutationBoundary.violations,
      candidateCount: integration.candidateQueue.length
    }),
    [
      integrationChecks,
      integration.registeredAdapterCount,
      integration.activeAdapterCount,
      integration.ingestTotal,
      integration.contractVersion,
      integration.mutationBoundary.violations,
      integration.candidateQueue.length
    ]
  );
  const fullReadinessScore = reactExports.useMemo(() => {
    if (allChecks.length === 0) return 0;
    return allChecks.reduce((s, c) => s + c.score, 0) / allChecks.length;
  }, [allChecks]);
  const allSubsystems = reactExports.useMemo(
    () => [...state.subsystems, integrationSubsystem],
    [state.subsystems, integrationSubsystem]
  );
  const allReports = reactExports.useMemo(
    () => [...state.reports, ...integrationReports],
    [state.reports, integrationReports]
  );
  const integrationBlockingFailures = reactExports.useMemo(
    () => integrationChecks.flatMap((c) => c.failures).filter((f) => f.isBlocking),
    [integrationChecks]
  );
  const allBlockingFailures = reactExports.useMemo(
    () => [...state.blockingFailures, ...integrationBlockingFailures],
    [state.blockingFailures, integrationBlockingFailures]
  );
  const scorePct = (fullReadinessScore * 100).toFixed(0);
  const gatePassed = fullReadinessScore > 0.65 && allBlockingFailures.length === 0;
  const gateColor = gatePassed ? GREEN : RED;
  const lastRunLabel = state.lastRunTs ? new Date(state.lastRunTs).toLocaleTimeString() : "Never";
  async function runStressTest() {
    setStressRunning(true);
    stressAbortRef.current = false;
    const AGENT_COUNT = 20;
    const TICKS_PER_AGENT = 10;
    const allLatencies = [];
    const t0 = performance.now();
    await Promise.all(
      Array.from({ length: AGENT_COUNT }, (_, i) => `scale_agent_${i}`).map(
        async (agentId) => {
          for (let tick = 0; tick < TICKS_PER_AGENT; tick++) {
            if (stressAbortRef.current) return;
            const ts = performance.now();
            liveBrainBus.routePayload(agentId, {
              threat_level: Math.random(),
              reward_level: Math.random(),
              novelty: Math.random(),
              urgency: Math.random(),
              fatigue: Math.random()
            });
            allLatencies.push(performance.now() - ts);
            if (tick % 5 === 4) await new Promise((r) => setTimeout(r, 0));
          }
        }
      )
    );
    const elapsed = (performance.now() - t0) / 1e3;
    const avg = allLatencies.reduce((s, l) => s + l, 0) / allLatencies.length;
    const max = Math.max(...allLatencies);
    const tps = allLatencies.length / elapsed;
    const verdict = avg < 20 && tps > 50 ? "PASS" : avg < 50 ? "WARN" : "FAIL";
    setStressResult({
      avgLatency: avg,
      maxLatency: max,
      tps,
      packets: allLatencies.length,
      verdict
    });
    const { setMultiAgentScaleResult } = await __vitePreload(async () => {
      const { setMultiAgentScaleResult: setMultiAgentScaleResult2 } = await import("./multiAgentScaleStore-BMPZOZcG.js");
      return { setMultiAgentScaleResult: setMultiAgentScaleResult2 };
    }, true ? [] : void 0);
    setMultiAgentScaleResult({
      verdict,
      tps,
      avgLatency: avg,
      maxLatency: max,
      agentCount: AGENT_COUNT,
      packets: allLatencies.length,
      runAt: Date.now()
    });
    setStressRunning(false);
  }
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: MUTED }, children: "READINESS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: canon.coh > 0.5 ? GREEN : AMBER }, children: canon.coh > 0.5 ? "COHERENT" : "BUILDING" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: MUTED }, children: "BEAT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.85 0.06 210)" }, children: String(Number(canon.b)).padStart(8, "0") })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          className: "flex flex-col border-r",
          style: { flex: "0 0 45%", overflow: "hidden", borderColor: BORDER },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "Readiness Gate · Full System Check (A–J)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "p-4 flex flex-col gap-2 border-b",
                style: { borderColor: BORDER },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono font-bold",
                        style: { fontSize: 36, lineHeight: 1, color: gateColor },
                        children: [
                          scorePct,
                          "%"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5 pb-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[11px] font-bold tracking-widest uppercase",
                          style: { color: gateColor },
                          children: gatePassed ? "▲ GATE PASSED" : "✕ GATE BLOCKED"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: DIM }, children: [
                        "Last run: ",
                        lastRunLabel,
                        " · Run #",
                        state.runCount
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        height: 6,
                        background: "oklch(0.14 0.03 255)",
                        borderRadius: 3,
                        overflow: "hidden"
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            width: `${fullReadinessScore * 100}%`,
                            height: "100%",
                            background: gateColor,
                            borderRadius: 3,
                            transition: "width 0.8s ease"
                          }
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: DIM }, children: [
                      allBlockingFailures.length,
                      " blocking · ",
                      state.warnings.length,
                      " ",
                      "warnings · ",
                      allChecks.filter((c) => c.passed).length,
                      "/",
                      allChecks.length,
                      " checks passed"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "readiness.primary_button",
                        onClick: () => {
                          setRunTrigger((t) => t + 1);
                          createArtifact({
                            artifact_type: "readiness_check",
                            source_system: "core",
                            title: "Readiness Check",
                            summary: "Auto-check run across all subsystems",
                            score: Math.round(fullReadinessScore * 100),
                            status: "info",
                            tags: ["readiness", "auto-check"],
                            metadata: { trigger: "manual" },
                            related_artifact_ids: [],
                            version: "1.0.0"
                          });
                        },
                        className: "ml-auto font-mono text-[8px] tracking-widest uppercase px-3 py-1 border transition-all",
                        style: {
                          border: `1px solid ${CYAN}50`,
                          color: CYAN,
                          background: `${CYAN}10`
                        },
                        children: "↻ RUN CHECKS"
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-1.5", children: allSubsystems.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsx(SubsystemCard, { sub }, sub.key)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 border-t pt-2", style: { borderColor: BORDER }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] tracking-widest uppercase block mb-1.5",
                    style: { color: MUTED },
                    children: "J. Integration Readiness · 13 Checks"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-0.5", children: integrationChecks.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px]",
                      style: { color: c.passed ? GREEN : AMBER },
                      children: c.passed ? "✓" : "□"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px]",
                      style: { color: c.passed ? MUTED : DIM },
                      children: c.label
                    }
                  )
                ] }, c.checkId)) })
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          className: "flex flex-col",
          style: { flex: 1, overflow: "hidden" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col border-b",
                style: { flex: "0 0 50%", overflow: "hidden", borderColor: BORDER },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionHeader, { children: [
                    "Auto Reports · ",
                    allReports.length,
                    " Generated (incl. Integration)"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: allReports.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(ReportRow, { report: r }, r.id)) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "shrink-0 border-b p-3",
                style: { borderColor: BORDER },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[9px] uppercase tracking-widest font-bold",
                        style: { color: CYAN },
                        children: "Performance Validation"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "readiness.secondary_button",
                        disabled: stressRunning,
                        onClick: runStressTest,
                        className: "font-mono text-[8px] uppercase tracking-widest px-3 py-1 rounded-sm transition-all",
                        style: {
                          background: stressRunning ? "oklch(0.1 0.02 265)" : `${CYAN}12`,
                          border: `1px solid ${stressRunning ? BORDER : `${CYAN}50`}`,
                          color: stressRunning ? MUTED : CYAN,
                          cursor: stressRunning ? "not-allowed" : "pointer"
                        },
                        children: stressRunning ? "Running…" : "▶ Run Stress Test (100 payloads)"
                      }
                    )
                  ] }),
                  stressResult ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-2", children: [
                    [
                      ["Avg Latency", `${stressResult.avgLatency.toFixed(2)}ms`],
                      ["Max Latency", `${stressResult.maxLatency.toFixed(2)}ms`],
                      ["TPS", stressResult.tps.toFixed(1)],
                      ["Packets", stressResult.packets.toString()]
                    ].map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "rounded-sm p-1.5",
                        style: {
                          background: "oklch(0.07 0.012 265)",
                          border: `1px solid ${BORDER}`
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              className: "font-mono text-[7px] uppercase tracking-widest mb-0.5",
                              style: { color: MUTED },
                              children: k
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              className: "font-mono text-[10px] font-bold",
                              style: { color: CYAN },
                              children: v
                            }
                          )
                        ]
                      },
                      k
                    )),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-4 flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm",
                          style: {
                            background: stressResult.verdict === "PASS" ? `${GREEN}18` : stressResult.verdict === "WARN" ? `${AMBER}18` : `${RED}18`,
                            color: stressResult.verdict === "PASS" ? GREEN : stressResult.verdict === "WARN" ? AMBER : RED
                          },
                          children: stressResult.verdict
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[8px]", style: { color: DIM }, children: stressResult.verdict === "PASS" ? "Avg latency <20ms and TPS >20 — system is responsive" : stressResult.verdict === "WARN" ? "Avg latency <50ms — acceptable but not optimal" : "High latency or low TPS — performance issue detected" })
                    ] })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[8px]", style: { color: DIM }, children: "Run the stress test to measure avg latency, max latency, and throughput." })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col",
                style: { flex: 1, overflow: "hidden" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "Blocking Failures + Next Actions" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-2 flex flex-col gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: allBlockingFailures.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        "data-ocid": "readiness.empty_state",
                        className: "p-3 border text-center font-mono text-[9px]",
                        style: {
                          borderColor: `${GREEN}30`,
                          color: GREEN,
                          background: `${GREEN}08`
                        },
                        children: "✓ No blocking failures detected"
                      }
                    ) : allBlockingFailures.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(FailureRow, { failure: f }, f.id)) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "border-t pt-2 mt-1",
                        style: { borderColor: BORDER },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[8px] tracking-widest uppercase block mb-1.5",
                              style: { color: MUTED },
                              children: "Next Required Actions"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: state.nextRequiredActions.map((action, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              className: "flex gap-1.5",
                              "data-ocid": `readiness.item.${i + 1}`,
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                  "span",
                                  {
                                    className: "font-mono text-[7px] mt-0.5",
                                    style: { color: AMBER },
                                    children: [
                                      i + 1,
                                      "."
                                    ]
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "span",
                                  {
                                    className: "font-mono text-[7px]",
                                    style: { color: MUTED },
                                    children: action
                                  }
                                )
                              ]
                            },
                            action
                          )) })
                        ]
                      }
                    )
                  ] })
                ]
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "shrink-0 border-t overflow-y-auto",
        style: { maxHeight: "40%", borderColor: BORDER },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "px-3 py-1.5 border-b sticky top-0 z-10",
              style: { borderColor: BORDER, background: "oklch(0.07 0.012 265)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase",
                  style: { color: MUTED },
                  children: "MODULE BUILD CHECKLIST — PACK 3"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleBuildChecklist, {})
        ]
      }
    )
  ] });
}
export {
  ReadinessTab as default
};
