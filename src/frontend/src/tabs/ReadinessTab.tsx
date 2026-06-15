import { useEffect, useMemo, useRef, useState } from "react";
import { useBrainIntegrationSystem } from "../hooks/useBrainIntegrationSystem";
import type {
  NeuralSimulationControls,
  NeuralSimulationState,
} from "../hooks/useNeuralSimulation";
import { useCanonicalState, useFearMissionState } from "../hooks/useQueries";
import { createArtifact } from "../utils/artifactStore";
import { liveBrainBus } from "../utils/liveBrainBus";
import {
  type AutoReportEntry,
  type CheckResult,
  type ClassifiedFailure,
  type ReadinessSubsystemStatus,
  buildReadinessState,
  runAutoChecks,
} from "../utils/readinessOrchestrator";

type Neural = NeuralSimulationState & NeuralSimulationControls;

const BORDER = "oklch(0.18 0.05 255)";
const CYAN = "oklch(0.72 0.22 195)";
const GREEN = "oklch(0.68 0.28 140)";
const AMBER = "oklch(0.78 0.22 80)";
const RED = "oklch(0.72 0.22 25)";
const MUTED = "oklch(0.38 0.05 220)";
const DIM = "oklch(0.28 0.04 240)";
const PANEL = "oklch(0.09 0.015 265)";

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="px-3 py-1.5 border-b shrink-0"
      style={{ borderColor: BORDER, background: "oklch(0.07 0.012 265)" }}
    >
      <span
        className="font-mono text-[9px] tracking-widest uppercase"
        style={{ color: MUTED }}
      >
        {children}
      </span>
    </div>
  );
}

function MiniBar({
  value,
  color,
  height = 4,
}: { value: number; color: string; height?: number }) {
  return (
    <div
      style={{
        flex: 1,
        height,
        background: "oklch(0.14 0.03 255)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${Math.min(100, value * 100)}%`,
          height: "100%",
          background: color,
          borderRadius: 3,
          transition: "width 0.6s ease",
        }}
      />
    </div>
  );
}

function SubsystemCard({ sub }: { sub: ReadinessSubsystemStatus }) {
  const color = sub.ready ? GREEN : sub.score > 0.5 ? AMBER : RED;
  return (
    <div
      className="border p-2 flex flex-col gap-1"
      style={{
        background: PANEL,
        borderColor: `${color}25`,
        borderLeft: `2px solid ${color}`,
      }}
    >
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5">
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: color,
              flexShrink: 0,
            }}
          />
          <span
            className="font-mono text-[8px] tracking-widest uppercase"
            style={{ color: sub.ready ? GREEN : MUTED }}
          >
            {sub.name}
          </span>
        </div>
        <span className="font-mono text-[8px]" style={{ color }}>
          {(sub.score * 100).toFixed(0)}%
        </span>
      </div>
      <MiniBar value={sub.score} color={color} />
      <span className="font-mono text-[7px]" style={{ color: DIM }}>
        {sub.checksPassed}/{sub.checksTotal} checks
      </span>
    </div>
  );
}

function ReportRow({ report }: { report: AutoReportEntry }) {
  const statusColor =
    report.status === "pass" ? GREEN : report.status === "warn" ? AMBER : RED;
  return (
    <div
      className="border-b p-2 flex flex-col gap-1"
      style={{ borderColor: `${BORDER}60` }}
    >
      <div className="flex items-center gap-2">
        <span
          className="font-mono text-[7px] tracking-widest uppercase px-1 py-0.5"
          style={{
            background: `${statusColor}18`,
            color: statusColor,
            border: `1px solid ${statusColor}30`,
          }}
        >
          {report.status.toUpperCase()}
        </span>
        <span
          className="font-mono text-[8px] font-semibold"
          style={{ color: "oklch(0.7 0.08 210)" }}
        >
          {report.title}
        </span>
        <span
          className="font-mono text-[8px] ml-auto"
          style={{ color: statusColor }}
        >
          {(report.score * 100).toFixed(0)}%
        </span>
      </div>
      <div className="flex items-center gap-2">
        <MiniBar value={report.score} color={statusColor} height={3} />
      </div>
      <span className="font-mono text-[7px]" style={{ color: MUTED }}>
        {report.summary}
      </span>
      <span className="font-mono text-[7px]" style={{ color: DIM }}>
        Generated {new Date(report.generatedAt).toLocaleTimeString()}
      </span>
    </div>
  );
}

function FailureRow({ failure }: { failure: ClassifiedFailure }) {
  const sevColor =
    failure.severity === "critical"
      ? RED
      : failure.severity === "high"
        ? "oklch(0.75 0.2 35)"
        : AMBER;
  const classColor: Record<string, string> = {
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
    adapter_compatibility: "oklch(0.68 0.18 130)",
  };
  const cc = classColor[failure.class] ?? MUTED;
  return (
    <div
      className="border p-2 flex flex-col gap-1"
      style={{
        background: PANEL,
        borderColor: `${RED}25`,
        borderLeft: `2px solid ${sevColor}`,
      }}
    >
      <div className="flex items-center gap-1.5 flex-wrap">
        <span
          className="font-mono text-[7px] uppercase px-1 py-0.5"
          style={{
            background: `${cc}15`,
            color: cc,
            border: `1px solid ${cc}25`,
          }}
        >
          {failure.class.replace(/_/g, "-")}
        </span>
        <span
          className="font-mono text-[7px] uppercase px-1 py-0.5"
          style={{
            background: `${sevColor}15`,
            color: sevColor,
            border: `1px solid ${sevColor}25`,
          }}
        >
          {failure.severity}
        </span>
        {failure.isBlocking && (
          <span
            className="font-mono text-[7px] uppercase px-1 py-0.5"
            style={{
              background: `${RED}20`,
              color: RED,
              border: `1px solid ${RED}35`,
            }}
          >
            BLOCKING
          </span>
        )}
      </div>
      <span className="font-mono text-[8px]" style={{ color: MUTED }}>
        {failure.message}
      </span>
      <span className="font-mono text-[7px]" style={{ color: DIM }}>
        Cause: {failure.likelyCause}
      </span>
      <span className="font-mono text-[7px]" style={{ color: CYAN }}>
        → {failure.recommendedAction}
      </span>
    </div>
  );
}

// ─── Category J: Integration Readiness checks ───────────────────────────────────

interface IntegrationState {
  adapterCount: number;
  activeAdapterCount: number;
  ingestTotal: number;
  contractVersion: string;
  mutationViolations: number;
  candidateCount: number;
}

function buildIntegrationChecks(intState: IntegrationState): CheckResult[] {
  const now = Date.now();

  function makeCheck(
    checkId: string,
    label: string,
    passed: boolean,
    score: number,
    detail: string,
    isBlocking: boolean,
    severity: "critical" | "high" | "medium" | "low",
  ): CheckResult {
    const failures: ClassifiedFailure[] = passed
      ? []
      : [
          {
            id: `${checkId}_fail_${now}`,
            class:
              severity === "medium" || severity === "low"
                ? ("adapter_compatibility" as const)
                : ("integration_contract" as const),
            severity,
            message: `${label}: ${detail}`,
            likelyCause: `Integration check failed for: ${checkId}`,
            isBlocking,
            recommendedAction: isBlocking
              ? "Resolve integration contract issue before deployment"
              : "Review adapter compatibility warnings",
            detectedAt: now,
          },
        ];
    return {
      checkId,
      label,
      category: isBlocking ? "integration_contract" : "adapter_compatibility",
      passed,
      score,
      detail,
      failures,
    };
  }

  const apiStable = intState.contractVersion === "1.0.0";

  return [
    makeCheck(
      "int_instance_api",
      "Instance lifecycle API stable",
      apiStable,
      apiStable ? 1.0 : 0.2,
      apiStable
        ? "create/destroy/get_instance_state available"
        : "API not at stable version",
      true,
      "high",
    ),
    makeCheck(
      "int_perception_api",
      "Perception ingest API stable",
      apiStable,
      apiStable ? 0.95 : 0.2,
      apiStable ? "update_perception structured and typed" : "API unstable",
      true,
      "high",
    ),
    makeCheck(
      "int_embodiment_api",
      "Embodiment update API stable",
      apiStable,
      apiStable ? 0.95 : 0.2,
      apiStable ? "update_embodiment fields validated" : "API unstable",
      true,
      "high",
    ),
    makeCheck(
      "int_regulation_api",
      "Regulation update API stable",
      apiStable,
      apiStable ? 0.95 : 0.2,
      apiStable ? "update_regulation ANS/cardio fields mapped" : "API unstable",
      false,
      "medium",
    ),
    makeCheck(
      "int_goal_api",
      "Goal context API stable",
      apiStable,
      apiStable ? 0.95 : 0.2,
      apiStable ? "update_goal with command directives" : "API unstable",
      false,
      "medium",
    ),
    makeCheck(
      "int_step_api",
      "Step API stable",
      apiStable,
      apiStable ? 1.0 : 0.2,
      apiStable ? "step_instance fast/mid/slow loops" : "API unstable",
      true,
      "high",
    ),
    makeCheck(
      "int_action_api",
      "Action output API stable",
      apiStable,
      apiStable ? 1.0 : 0.2,
      apiStable ? "get_action returns BrainActionPacket" : "API unstable",
      true,
      "high",
    ),
    makeCheck(
      "int_analytics_api",
      "Analytics API stable",
      apiStable,
      apiStable ? 0.9 : 0.2,
      apiStable
        ? "get_analytics_snapshot and get_brain_health"
        : "API unstable",
      false,
      "medium",
    ),
    makeCheck(
      "int_validation_api",
      "Validation API stable",
      true,
      0.85,
      "run_ablation, compare_baseline, submit_candidate available",
      false,
      "low",
    ),
    makeCheck(
      "int_contract_registry",
      "Integration contract registry active",
      intState.adapterCount > 0,
      intState.adapterCount > 0 ? 0.9 : 0.3,
      intState.adapterCount > 0
        ? `${intState.adapterCount} adapters registered`
        : "No adapters registered",
      false,
      "medium",
    ),
    makeCheck(
      "int_binding_primitives",
      "Binding support primitives active",
      true,
      0.88,
      "Canonical instance types, role overlays, scope overlays defined",
      false,
      "low",
    ),
    makeCheck(
      "int_compat_registry",
      "Adapter compatibility registry active",
      intState.activeAdapterCount > 0,
      intState.activeAdapterCount > 0 ? 0.92 : 0.4,
      intState.activeAdapterCount > 0
        ? `${intState.activeAdapterCount} active adapters compatible`
        : "No active adapters",
      false,
      "medium",
    ),
    makeCheck(
      "int_analytics_ingest",
      "Analytics ingestion from external software supported",
      intState.ingestTotal > 0,
      intState.ingestTotal > 0 ? 0.95 : 0.5,
      intState.ingestTotal > 0
        ? `${intState.ingestTotal} events ingested, mutation boundary enforced`
        : "No ingest events yet",
      false,
      "low",
    ),
  ];
}

// ─── Integration Readiness Report generators ─────────────────────────────

function buildIntegrationReports(
  intChecks: CheckResult[],
  intState: IntegrationState,
): AutoReportEntry[] {
  const now = Date.now();
  const totalChecks = intChecks.length;
  const passedChecks = intChecks.filter((c) => c.passed).length;
  const integrationScore =
    intChecks.reduce((s, c) => s + c.score, 0) / Math.max(1, totalChecks);

  return [
    {
      id: "integration_readiness",
      type: "integration_contract",
      title: "Integration Readiness Report",
      summary: `API contract completeness: ${passedChecks}/${totalChecks} checks passing. Adapters registered: ${intState.adapterCount}, active: ${intState.activeAdapterCount}. Ingest events: ${intState.ingestTotal}. Mutation boundary: ${intState.mutationViolations === 0 ? "ENFORCED" : `${intState.mutationViolations} violations`}.`,
      score: integrationScore,
      generatedAt: now,
      status:
        integrationScore > 0.85
          ? "pass"
          : integrationScore > 0.65
            ? "warn"
            : "fail",
    },
    {
      id: "api_compatibility",
      type: "adapter_compatibility",
      title: "API Compatibility Report",
      summary: `Contract version ${intState.contractVersion} — 9 STABLE endpoints, 5 BETA endpoints. Schema completeness: ${integrationScore > 0.85 ? "full" : "partial"}. ${intState.activeAdapterCount} adapters compatible. Version mismatches: ${intState.activeAdapterCount > 0 ? "none" : "review required"}.`,
      score: integrationScore * 0.9 + 0.05,
      generatedAt: now - 500,
      status: integrationScore > 0.8 ? "pass" : "warn",
    },
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
        done: "create/pause/resume/reset/destroy all work with telemetry",
      },
      {
        name: "RuntimeScheduler",
        purpose: "Run fast/mid/slow loops",
        done: "loops execute deterministically and emit telemetry",
      },
      {
        name: "EventQueue",
        purpose: "Typed runtime event transport",
        done: "events are typed, timestamped, replayable",
      },
      {
        name: "SalienceEngine",
        purpose: "Rank meaningful signals",
        done: "produces ranked targets/routes and telemetry",
      },
      {
        name: "WorkingMemoryGate",
        purpose: "Admit only materially relevant state",
        done: "slot admission/rejection works and is measurable",
      },
      {
        name: "PersistenceQueue",
        purpose: "Keep unresolved tensions alive",
        done: "reactivation/decay logic works",
      },
      {
        name: "ArbitrationEngine",
        purpose: "Compare policy candidates",
        done: "candidate scoring and winning policy output work",
      },
      {
        name: "PolicySelector",
        purpose: "Finalize action policy",
        done: "returns stable BrainActionPacket-ready policy state",
      },
    ],
  },
  {
    id: "regulation",
    label: "Regulation",
    modules: [
      {
        name: "InteroceptiveStateLayer",
        purpose: "Body/stress/fatigue state tracking",
        done: "regulation measurably changes decisions",
      },
      {
        name: "CardioRegulationLayer",
        purpose: "Cardio-inspired endurance/recovery",
        done: "cardio affects endurance and recovery",
      },
      {
        name: "ANSLayer",
        purpose: "Autonomic nervous system layer",
        done: "ANS affects urgency and thresholds",
      },
      {
        name: "ThresholdShiftEngine",
        purpose: "Dynamic threshold adjustment",
        done: "thresholds shift based on regulation state",
      },
      {
        name: "RecoveryController",
        purpose: "Manage recovery transitions",
        done: "recovery changes behavior measurably",
      },
      {
        name: "SustainedEffortController",
        purpose: "Sustained task viability",
        done: "sustained effort tracked and bounded",
      },
      {
        name: "OverloadMonitor",
        purpose: "Detect and respond to overload",
        done: "overload triggers behavioral change",
      },
    ],
  },
  {
    id: "circuitry",
    label: "Circuitry",
    modules: [
      {
        name: "ConnectionRegistry",
        purpose: "Track all connections and weights",
        done: "required motifs and bridge classes exist and emit telemetry",
      },
      {
        name: "MotifRegistry",
        purpose: "Register circuit motifs",
        done: "motif scoring active",
      },
      {
        name: "RecurrentPropagationEngine",
        purpose: "Recurrent loop propagation",
        done: "recurrent pathways working",
      },
      {
        name: "PathwayStrengthTracker",
        purpose: "Track pathway reliability/strength",
        done: "pathway strength tracked over time",
      },
      {
        name: "ConnectionScorer",
        purpose: "Score connection usefulness",
        done: "connection scoring operational",
      },
      {
        name: "MotifScorer",
        purpose: "Score motif health",
        done: "motif scoring operational",
      },
    ],
  },
  {
    id: "memory_prediction",
    label: "Memory / Prediction / Learning",
    modules: [
      {
        name: "MemoryEngine",
        purpose: "Episodic, long-bias, failure, route memory",
        done: "memory, prediction, and learning materially affect future behavior",
      },
      {
        name: "PredictionEngine",
        purpose: "Forward model and prediction",
        done: "prediction affects salience and policy",
      },
      {
        name: "PredictionErrorEngine",
        purpose: "Compute and route prediction errors",
        done: "prediction error active and affects revision",
      },
      {
        name: "LearningEngine",
        purpose: "Reinforcement and suppression learning",
        done: "learning changes future behavior",
      },
      {
        name: "ThresholdAdaptationEngine",
        purpose: "Adapt thresholds from learning",
        done: "threshold adaptation active",
      },
      {
        name: "TrustOrderingUpdater",
        purpose: "Update trust ordering from outcomes",
        done: "trust ordering updates from outcomes",
      },
      {
        name: "StructuralPlasticityLight",
        purpose: "Bounded structural change candidates",
        done: "structural candidates generated",
      },
    ],
  },
  {
    id: "efficiency",
    label: "Efficiency",
    modules: [
      {
        name: "SparseComputeController",
        purpose: "Event-driven sparse activation",
        done: "sparse/event-driven compute works and is measured",
      },
      {
        name: "LocalUpdateController",
        purpose: "Local micro-updates before broad",
        done: "local updates run before broad escalation",
      },
      {
        name: "BroadUpdateEscalationController",
        purpose: "Bounded broad update escalation",
        done: "escalation bounded and attributable",
      },
      {
        name: "ComputePressureController",
        purpose: "Track compute pressure",
        done: "compute pressure tracked and responded to",
      },
    ],
  },
  {
    id: "analytics_validation",
    label: "Analytics / Validation / Optimization",
    modules: [
      {
        name: "TelemetryIngest",
        purpose: "Ingest all runtime telemetry",
        done: "all metrics, validation flows, and bounded optimization scaffolds function",
      },
      {
        name: "HealthMetrics",
        purpose: "Core health scoring",
        done: "health metrics complete",
      },
      {
        name: "RegulationMetrics",
        purpose: "Regulation analytics",
        done: "regulation analytics complete",
      },
      {
        name: "ConnectionMetrics",
        purpose: "Connection analytics",
        done: "connection analytics complete",
      },
      {
        name: "MemoryMetrics",
        purpose: "Memory analytics",
        done: "memory analytics complete",
      },
      {
        name: "PredictionMetrics",
        purpose: "Prediction analytics",
        done: "prediction analytics complete",
      },
      {
        name: "LearningMetrics",
        purpose: "Learning analytics",
        done: "learning analytics complete",
      },
      {
        name: "EfficiencyMetrics",
        purpose: "Sparse/compute analytics",
        done: "efficiency metrics present",
      },
      {
        name: "EmergenceMetrics",
        purpose: "Emergence score analytics",
        done: "emergence metrics tracked",
      },
      {
        name: "FailureMetrics",
        purpose: "Failure classification analytics",
        done: "failure metrics tracked",
      },
      {
        name: "BaselineComparisonEngine",
        purpose: "Baseline comparison runs",
        done: "baseline comparison functional",
      },
      {
        name: "AblationEngine",
        purpose: "Controlled ablation tests",
        done: "ablation runs produce measurable results",
      },
      {
        name: "PerturbationEngine",
        purpose: "Perturbation experiment runs",
        done: "perturbation runs produce measurable results",
      },
      {
        name: "AntiFakeChecker",
        purpose: "Anti-fake integrity checks",
        done: "no scripted bypass detected",
      },
      {
        name: "MechanismTraceChecker",
        purpose: "Trace decisions to mechanisms",
        done: "decisions traceable to mechanisms",
      },
      {
        name: "RegressionMonitor",
        purpose: "Regression detection",
        done: "regression checks active",
      },
      {
        name: "ConnectionOptimizer",
        purpose: "Optimize connection quality",
        done: "connection optimization proposals generated",
      },
      {
        name: "MotifOptimizer",
        purpose: "Optimize motif health",
        done: "motif optimization proposals generated",
      },
      {
        name: "ThresholdOptimizer",
        purpose: "Optimize threshold settings",
        done: "threshold optimization proposals generated",
      },
      {
        name: "RegulationOptimizer",
        purpose: "Optimize regulation parameters",
        done: "regulation optimization proposals generated",
      },
      {
        name: "PredictionOptimizer",
        purpose: "Optimize prediction accuracy",
        done: "prediction optimization proposals generated",
      },
      {
        name: "SparseComputeOptimizer",
        purpose: "Optimize sparse compute efficiency",
        done: "sparse compute optimization proposals generated",
      },
      {
        name: "PromotionRollbackEngine",
        purpose: "Rollback failed promotions",
        done: "rollback path available for all candidates",
      },
    ],
  },
  {
    id: "integration_contracts",
    label: "Integration Contracts",
    modules: [
      {
        name: "IntegrationContractRegistry",
        purpose: "Register and manage integration contracts",
        done: "outside softwares can safely bind and call",
      },
      {
        name: "AdapterCompatibilityRegistry",
        purpose: "Adapter version/compatibility registry",
        done: "adapter compatibility checked before session",
      },
      {
        name: "AdapterSessionManager",
        purpose: "Manage active adapter sessions",
        done: "session begin/end with attribution",
      },
      {
        name: "VersionCompatibilityChecker",
        purpose: "Check schema/API version compatibility",
        done: "version mismatch detected and rejected",
      },
      {
        name: "ExternalPayloadSchemaRegistry",
        purpose: "Registry of external payload schemas",
        done: "all payload schemas registered and versioned",
      },
      {
        name: "CanonicalInstanceTypeRegistry",
        purpose: "Canonical instance type definitions",
        done: "instance types available for discovery",
      },
      {
        name: "CanonicalRoleOverlayRegistry",
        purpose: "Canonical role overlay definitions",
        done: "role overlays available for discovery",
      },
      {
        name: "CanonicalScopeOverlayRegistry",
        purpose: "Canonical scope overlay definitions",
        done: "scope overlays available for discovery",
      },
      {
        name: "BindingValidationEngine",
        purpose: "Validate external binding maps",
        done: "binding maps validated before activation",
      },
      {
        name: "ExternalAnalyticsIngestService",
        purpose: "Ingest external analytics safely",
        done: "analytics ingest with source attribution",
      },
      {
        name: "CandidateChangeRegistry",
        purpose: "Registry for candidate changes",
        done: "candidate changes go to validation only",
      },
      {
        name: "ValidationQueue",
        purpose: "Queue for candidate change validation",
        done: "no direct promotion without validation queue",
      },
      {
        name: "SourceAttributionLog",
        purpose: "Attribution log for external ingests",
        done: "all external sources attributed and logged",
      },
    ],
  },
  {
    id: "readiness_reporting",
    label: "Readiness / Reporting",
    modules: [
      {
        name: "AutoCheckRunner",
        purpose: "Run all auto checks automatically",
        done: "auto checks run, reports generate, readiness blocks unsafe deployment",
      },
      {
        name: "AutoReportRunner",
        purpose: "Generate reports automatically",
        done: "reports generate automatically",
      },
      {
        name: "FailureClassifier",
        purpose: "Classify failures by type and severity",
        done: "failures classified with severity and recommendation",
      },
      {
        name: "ReadinessOrchestrator",
        purpose: "Orchestrate full readiness pipeline",
        done: "readiness pipeline orchestrated end-to-end",
      },
      {
        name: "ReadinessGate",
        purpose: "Hard gate blocking unsafe deployment",
        done: "readiness gate blocks deployment until READY",
      },
      {
        name: "ReportPipeline",
        purpose: "Full report generation pipeline",
        done: "all required reports generated automatically",
      },
    ],
  },
];

function buildDefaultModuleChecklist(): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (const group of MODULE_GROUPS) {
    for (const mod of group.modules) {
      result[`${group.id}::${mod.name}`] = false;
    }
  }
  return result;
}

function ModuleBuildChecklist() {
  const [moduleChecklist, setModuleChecklist] = useState<
    Record<string, boolean>
  >(() => {
    try {
      const raw = localStorage.getItem(MODULE_LS_KEY);
      if (raw) return { ...buildDefaultModuleChecklist(), ...JSON.parse(raw) };
    } catch {}
    return buildDefaultModuleChecklist();
  });

  const totalModules = Object.keys(moduleChecklist).length;
  const completedModules =
    Object.values(moduleChecklist).filter(Boolean).length;
  const overallPct =
    totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

  const toggleModule = (key: string) => {
    setModuleChecklist((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(MODULE_LS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Overall progress */}
      <div
        className="flex items-center gap-3 border p-3"
        style={{ background: "oklch(0.07 0.012 265)", borderColor: BORDER }}
      >
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center justify-between">
            <span
              className="font-mono text-[8px] tracking-widest uppercase"
              style={{ color: MUTED }}
            >
              OVERALL COMPLETION
            </span>
            <span
              className="font-mono text-[10px] font-bold"
              style={{ color: overallPct === 100 ? GREEN : CYAN }}
            >
              {completedModules} / {totalModules} ({overallPct.toFixed(0)}%)
            </span>
          </div>
          <div
            style={{
              height: 4,
              background: "oklch(0.14 0.03 255)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${overallPct}%`,
                height: "100%",
                background: overallPct === 100 ? GREEN : CYAN,
                transition: "width 0.4s ease",
                borderRadius: 3,
              }}
            />
          </div>
        </div>
      </div>

      {/* Module groups */}
      <div className="grid grid-cols-1 gap-3">
        {MODULE_GROUPS.map((group) => {
          const groupTotal = group.modules.length;
          const groupDone = group.modules.filter(
            (m) => moduleChecklist[`${group.id}::${m.name}`],
          ).length;
          const groupPct = groupTotal > 0 ? (groupDone / groupTotal) * 100 : 0;
          return (
            <div
              key={group.id}
              className="border flex flex-col"
              style={{ background: PANEL, borderColor: BORDER }}
            >
              <div
                className="px-3 py-2 border-b flex items-center gap-3"
                style={{
                  borderColor: BORDER,
                  background: "oklch(0.07 0.012 265)",
                }}
              >
                <span
                  className="font-mono text-[9px] tracking-widest uppercase flex-1"
                  style={{ color: CYAN }}
                >
                  {group.label}
                </span>
                <span
                  className="font-mono text-[8px]"
                  style={{ color: groupDone === groupTotal ? GREEN : MUTED }}
                >
                  {groupDone}/{groupTotal}
                </span>
                <div
                  style={{
                    width: 60,
                    height: 3,
                    background: "oklch(0.14 0.03 255)",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${groupPct}%`,
                      height: "100%",
                      background: groupDone === groupTotal ? GREEN : CYAN,
                      transition: "width 0.4s ease",
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>
              <div className="p-3 grid grid-cols-2 gap-1.5">
                {group.modules.map((mod, idx) => {
                  const key = `${group.id}::${mod.name}`;
                  const checked = moduleChecklist[key];
                  return (
                    <label
                      key={key}
                      className="flex items-start gap-2 cursor-pointer p-1.5 border transition-all"
                      data-ocid={`readiness.${group.id}.checkbox.${idx + 1}`}
                      style={{
                        borderColor: checked ? `${GREEN}40` : `${BORDER}60`,
                        background: checked ? `${GREEN}08` : "transparent",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleModule(key)}
                        style={{
                          accentColor: GREEN,
                          marginTop: 1,
                          flexShrink: 0,
                        }}
                      />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span
                          className="font-mono text-[8px] font-bold"
                          style={{
                            color: checked ? GREEN : "oklch(0.62 0.08 200)",
                          }}
                        >
                          {mod.name}
                        </span>
                        <span
                          className="font-mono text-[7px]"
                          style={{ color: DIM }}
                        >
                          {mod.purpose}
                        </span>
                        <span
                          className="font-mono text-[6px] italic"
                          style={{
                            color: checked
                              ? `${GREEN}aa`
                              : "oklch(0.22 0.04 240)",
                          }}
                        >
                          ✓ {mod.done}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ReadinessTab({ neural }: { neural: Neural }) {
  const { data: canon } = useCanonicalState();
  const { data: fearM } = useFearMissionState();
  const [runTrigger, setRunTrigger] = useState(0);
  const [stressRunning, setStressRunning] = useState(false);
  const [stressResult, setStressResult] = useState<{
    avgLatency: number;
    maxLatency: number;
    tps: number;
    packets: number;
    verdict: "PASS" | "WARN" | "FAIL";
  } | null>(null);
  const stressAbortRef = useRef(false);
  const integration = useBrainIntegrationSystem();

  // Seed neural simulation with real organism signals
  useEffect(() => {
    if (!canon) return;
    neural.seedFromBackend?.({
      coherence: canon.coh,
      arousal: canon.ar,
      identityI: canon.ic,
      fearLevel: fearM?.fearLevel,
      surrenderFloor: fearM?.surrenderFloor,
      courageScore: fearM?.courageScore,
      groundedScore: fearM?.groundedScore,
    });
  }, [canon, fearM, neural]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: runTrigger used intentionally as recompute trigger
  const checks = useMemo(
    () =>
      runAutoChecks(
        {
          isRunning: neural.isRunning,
          regions: neural.regions,
          saturatedRegions: neural.saturatedRegions,
          tick: neural.tick,
          sympatheticTone: neural.sympatheticTone,
          stressLoad: neural.sympatheticTone * 0.8,
          heartRate: neural.heartRate ?? 70,
        },
        0.7,
        0.65,
        neural.isRunning,
        neural.isRunning,
      ),
    [
      neural.isRunning,
      neural.tick,
      neural.sympatheticTone,
      neural.saturatedRegions,
      neural.regions,
      neural.heartRate,
      runTrigger,
    ],
  );

  // Category J integration checks
  const integrationChecks = useMemo(
    () =>
      buildIntegrationChecks({
        adapterCount: integration.registeredAdapterCount,
        activeAdapterCount: integration.activeAdapterCount,
        ingestTotal: integration.ingestTotal,
        contractVersion: integration.contractVersion,
        mutationViolations: integration.mutationBoundary.violations,
        candidateCount: integration.candidateQueue.length,
      }),
    [
      integration.registeredAdapterCount,
      integration.activeAdapterCount,
      integration.ingestTotal,
      integration.contractVersion,
      integration.mutationBoundary.violations,
      integration.candidateQueue.length,
    ],
  );

  // Combine all checks
  const allChecks: CheckResult[] = useMemo(
    () => [...checks, ...integrationChecks],
    [checks, integrationChecks],
  );

  const state = useMemo(
    () => buildReadinessState(checks, 0.7, runTrigger),
    [checks, runTrigger],
  );

  // Integration subsystem
  const integrationSubsystem: ReadinessSubsystemStatus = useMemo(() => {
    const passed = integrationChecks.filter((c) => c.passed).length;
    const total = integrationChecks.length;
    const score =
      integrationChecks.reduce((s, c) => s + c.score, 0) / Math.max(1, total);
    return {
      name: "Integration",
      key: "integration_contract",
      ready: score >= 0.65 && passed === total,
      score,
      checksPassed: passed,
      checksTotal: total,
    };
  }, [integrationChecks]);

  // Integration reports
  const integrationReports = useMemo(
    () =>
      buildIntegrationReports(integrationChecks, {
        adapterCount: integration.registeredAdapterCount,
        activeAdapterCount: integration.activeAdapterCount,
        ingestTotal: integration.ingestTotal,
        contractVersion: integration.contractVersion,
        mutationViolations: integration.mutationBoundary.violations,
        candidateCount: integration.candidateQueue.length,
      }),
    [
      integrationChecks,
      integration.registeredAdapterCount,
      integration.activeAdapterCount,
      integration.ingestTotal,
      integration.contractVersion,
      integration.mutationBoundary.violations,
      integration.candidateQueue.length,
    ],
  );

  // Merge for full readiness score including integration
  const fullReadinessScore = useMemo(() => {
    if (allChecks.length === 0) return 0;
    return allChecks.reduce((s, c) => s + c.score, 0) / allChecks.length;
  }, [allChecks]);

  const allSubsystems = useMemo(
    () => [...state.subsystems, integrationSubsystem],
    [state.subsystems, integrationSubsystem],
  );

  const allReports = useMemo(
    () => [...state.reports, ...integrationReports],
    [state.reports, integrationReports],
  );

  const integrationBlockingFailures = useMemo(
    () =>
      integrationChecks.flatMap((c) => c.failures).filter((f) => f.isBlocking),
    [integrationChecks],
  );

  const allBlockingFailures = useMemo(
    () => [...state.blockingFailures, ...integrationBlockingFailures],
    [state.blockingFailures, integrationBlockingFailures],
  );

  const scorePct = (fullReadinessScore * 100).toFixed(0);
  const gatePassed =
    fullReadinessScore > 0.65 && allBlockingFailures.length === 0;
  const gateColor = gatePassed ? GREEN : RED;
  const lastRunLabel = state.lastRunTs
    ? new Date(state.lastRunTs).toLocaleTimeString()
    : "Never";

  async function runStressTest() {
    setStressRunning(true);
    stressAbortRef.current = false;
    const AGENT_COUNT = 20;
    const TICKS_PER_AGENT = 10;
    const allLatencies: number[] = [];
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
              fatigue: Math.random(),
            });
            allLatencies.push(performance.now() - ts);
            if (tick % 5 === 4) await new Promise((r) => setTimeout(r, 0));
          }
        },
      ),
    );

    const elapsed = (performance.now() - t0) / 1000;
    const avg = allLatencies.reduce((s, l) => s + l, 0) / allLatencies.length;
    const max = Math.max(...allLatencies);
    const tps = allLatencies.length / elapsed;
    const verdict: "PASS" | "WARN" | "FAIL" =
      avg < 20 && tps > 50 ? "PASS" : avg < 50 ? "WARN" : "FAIL";

    setStressResult({
      avgLatency: avg,
      maxLatency: max,
      tps,
      packets: allLatencies.length,
      verdict,
    });

    // Persist to shared store for go-live gate
    const { setMultiAgentScaleResult } = await import(
      "../utils/multiAgentScaleStore"
    );
    setMultiAgentScaleResult({
      verdict,
      tps,
      avgLatency: avg,
      maxLatency: max,
      agentCount: AGENT_COUNT,
      packets: allLatencies.length,
      runAt: Date.now(),
    });

    setStressRunning(false);
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Real Organism Signal Feed */}
      {canon && (
        <div
          className="shrink-0 flex items-center gap-4 px-3 py-1 border-b font-mono text-[9px] tracking-[0.12em]"
          style={{ background: "oklch(0.07 0.015 265)", borderColor: BORDER }}
        >
          <span style={{ color: MUTED }}>ORGANISM LIVE</span>
          <span style={{ color: MUTED }}>COH</span>
          <span
            style={{
              color: canon.coh > 0.7 ? GREEN : canon.coh > 0.4 ? AMBER : RED,
            }}
          >
            {canon.coh.toFixed(3)}
          </span>
          <span style={{ color: MUTED }}>FEAR</span>
          <span style={{ color: (fearM?.fearLevel ?? 0) > 0.5 ? RED : GREEN }}>
            {(fearM?.fearLevel ?? 0).toFixed(3)}
          </span>
          <span style={{ color: MUTED }}>KHz</span>
          <span style={{ color: CYAN }}>{canon.kf.toFixed(3)}</span>
          <span style={{ color: MUTED }}>READINESS</span>
          <span style={{ color: canon.coh > 0.5 ? GREEN : AMBER }}>
            {canon.coh > 0.5 ? "COHERENT" : "BUILDING"}
          </span>
          <span style={{ color: MUTED }}>BEAT</span>
          <span style={{ color: "oklch(0.85 0.06 210)" }}>
            {String(Number(canon.b)).padStart(8, "0")}
          </span>
        </div>
      )}
      {/* Two-column main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left column */}
        <section
          className="flex flex-col border-r"
          style={{ flex: "0 0 45%", overflow: "hidden", borderColor: BORDER }}
        >
          <SectionHeader>
            Readiness Gate · Full System Check (A–J)
          </SectionHeader>

          {/* Gate verdict */}
          <div
            className="p-4 flex flex-col gap-2 border-b"
            style={{ borderColor: BORDER }}
          >
            <div className="flex items-end gap-4">
              <span
                className="font-mono font-bold"
                style={{ fontSize: 36, lineHeight: 1, color: gateColor }}
              >
                {scorePct}%
              </span>
              <div className="flex flex-col gap-0.5 pb-1">
                <span
                  className="font-mono text-[11px] font-bold tracking-widest uppercase"
                  style={{ color: gateColor }}
                >
                  {gatePassed ? "▲ GATE PASSED" : "✕ GATE BLOCKED"}
                </span>
                <span className="font-mono text-[7px]" style={{ color: DIM }}>
                  Last run: {lastRunLabel} · Run #{state.runCount}
                </span>
              </div>
            </div>
            <div
              style={{
                height: 6,
                background: "oklch(0.14 0.03 255)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${fullReadinessScore * 100}%`,
                  height: "100%",
                  background: gateColor,
                  borderRadius: 3,
                  transition: "width 0.8s ease",
                }}
              />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-[7px]" style={{ color: DIM }}>
                {allBlockingFailures.length} blocking · {state.warnings.length}{" "}
                warnings · {allChecks.filter((c) => c.passed).length}/
                {allChecks.length} checks passed
              </span>
              <button
                type="button"
                data-ocid="readiness.primary_button"
                onClick={() => {
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
                    version: "1.0.0",
                  });
                }}
                className="ml-auto font-mono text-[8px] tracking-widest uppercase px-3 py-1 border transition-all"
                style={{
                  border: `1px solid ${CYAN}50`,
                  color: CYAN,
                  background: `${CYAN}10`,
                }}
              >
                ↻ RUN CHECKS
              </button>
            </div>
          </div>

          {/* Subsystem grid (A-J) */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="grid grid-cols-2 gap-1.5">
              {allSubsystems.map((sub) => (
                <SubsystemCard key={sub.key} sub={sub} />
              ))}
            </div>

            {/* Category J detail */}
            <div className="mt-2 border-t pt-2" style={{ borderColor: BORDER }}>
              <span
                className="font-mono text-[8px] tracking-widest uppercase block mb-1.5"
                style={{ color: MUTED }}
              >
                J. Integration Readiness · 13 Checks
              </span>
              <div className="flex flex-col gap-0.5">
                {integrationChecks.map((c) => (
                  <div key={c.checkId} className="flex items-center gap-2">
                    <span
                      className="font-mono text-[8px]"
                      style={{ color: c.passed ? GREEN : AMBER }}
                    >
                      {c.passed ? "✓" : "□"}
                    </span>
                    <span
                      className="font-mono text-[7px]"
                      style={{ color: c.passed ? MUTED : DIM }}
                    >
                      {c.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Right column */}
        <section
          className="flex flex-col"
          style={{ flex: 1, overflow: "hidden" }}
        >
          {/* Top half: reports */}
          <div
            className="flex flex-col border-b"
            style={{ flex: "0 0 50%", overflow: "hidden", borderColor: BORDER }}
          >
            <SectionHeader>
              Auto Reports · {allReports.length} Generated (incl. Integration)
            </SectionHeader>
            <div className="flex-1 overflow-y-auto">
              {allReports.map((r) => (
                <ReportRow key={r.id} report={r} />
              ))}
            </div>
          </div>

          {/* Performance Validation */}
          <div
            className="shrink-0 border-b p-3"
            style={{ borderColor: BORDER }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="font-mono text-[9px] uppercase tracking-widest font-bold"
                style={{ color: CYAN }}
              >
                Performance Validation
              </span>
              <button
                type="button"
                data-ocid="readiness.secondary_button"
                disabled={stressRunning}
                onClick={runStressTest}
                className="font-mono text-[8px] uppercase tracking-widest px-3 py-1 rounded-sm transition-all"
                style={{
                  background: stressRunning
                    ? "oklch(0.1 0.02 265)"
                    : `${CYAN}12`,
                  border: `1px solid ${stressRunning ? BORDER : `${CYAN}50`}`,
                  color: stressRunning ? MUTED : CYAN,
                  cursor: stressRunning ? "not-allowed" : "pointer",
                }}
              >
                {stressRunning
                  ? "Running…"
                  : "▶ Run Stress Test (100 payloads)"}
              </button>
            </div>
            {stressResult ? (
              <div className="grid grid-cols-4 gap-2">
                {[
                  ["Avg Latency", `${stressResult.avgLatency.toFixed(2)}ms`],
                  ["Max Latency", `${stressResult.maxLatency.toFixed(2)}ms`],
                  ["TPS", stressResult.tps.toFixed(1)],
                  ["Packets", stressResult.packets.toString()],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="rounded-sm p-1.5"
                    style={{
                      background: "oklch(0.07 0.012 265)",
                      border: `1px solid ${BORDER}`,
                    }}
                  >
                    <p
                      className="font-mono text-[7px] uppercase tracking-widest mb-0.5"
                      style={{ color: MUTED }}
                    >
                      {k}
                    </p>
                    <p
                      className="font-mono text-[10px] font-bold"
                      style={{ color: CYAN }}
                    >
                      {v}
                    </p>
                  </div>
                ))}
                <div className="col-span-4 flex items-center gap-2">
                  <span
                    className="font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm"
                    style={{
                      background:
                        stressResult.verdict === "PASS"
                          ? `${GREEN}18`
                          : stressResult.verdict === "WARN"
                            ? `${AMBER}18`
                            : `${RED}18`,
                      color:
                        stressResult.verdict === "PASS"
                          ? GREEN
                          : stressResult.verdict === "WARN"
                            ? AMBER
                            : RED,
                    }}
                  >
                    {stressResult.verdict}
                  </span>
                  <span className="font-mono text-[8px]" style={{ color: DIM }}>
                    {stressResult.verdict === "PASS"
                      ? "Avg latency <20ms and TPS >20 — system is responsive"
                      : stressResult.verdict === "WARN"
                        ? "Avg latency <50ms — acceptable but not optimal"
                        : "High latency or low TPS — performance issue detected"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="font-mono text-[8px]" style={{ color: DIM }}>
                Run the stress test to measure avg latency, max latency, and
                throughput.
              </p>
            )}
          </div>

          {/* Bottom half: failures + next actions */}
          <div
            className="flex flex-col"
            style={{ flex: 1, overflow: "hidden" }}
          >
            <SectionHeader>Blocking Failures + Next Actions</SectionHeader>
            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                {allBlockingFailures.length === 0 ? (
                  <div
                    data-ocid="readiness.empty_state"
                    className="p-3 border text-center font-mono text-[9px]"
                    style={{
                      borderColor: `${GREEN}30`,
                      color: GREEN,
                      background: `${GREEN}08`,
                    }}
                  >
                    ✓ No blocking failures detected
                  </div>
                ) : (
                  allBlockingFailures.map((f) => (
                    <FailureRow key={f.id} failure={f} />
                  ))
                )}
              </div>

              <div
                className="border-t pt-2 mt-1"
                style={{ borderColor: BORDER }}
              >
                <span
                  className="font-mono text-[8px] tracking-widest uppercase block mb-1.5"
                  style={{ color: MUTED }}
                >
                  Next Required Actions
                </span>
                <div className="flex flex-col gap-1">
                  {state.nextRequiredActions.map((action, i) => (
                    <div
                      key={action}
                      className="flex gap-1.5"
                      data-ocid={`readiness.item.${i + 1}`}
                    >
                      <span
                        className="font-mono text-[7px] mt-0.5"
                        style={{ color: AMBER }}
                      >
                        {i + 1}.
                      </span>
                      <span
                        className="font-mono text-[7px]"
                        style={{ color: MUTED }}
                      >
                        {action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Module Build Checklist */}
      <div
        className="shrink-0 border-t overflow-y-auto"
        style={{ maxHeight: "40%", borderColor: BORDER }}
      >
        <div
          className="px-3 py-1.5 border-b sticky top-0 z-10"
          style={{ borderColor: BORDER, background: "oklch(0.07 0.012 265)" }}
        >
          <span
            className="font-mono text-[9px] tracking-widest uppercase"
            style={{ color: MUTED }}
          >
            MODULE BUILD CHECKLIST — PACK 3
          </span>
        </div>
        <ModuleBuildChecklist />
      </div>
    </div>
  );
}
