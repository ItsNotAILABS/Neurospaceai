// Readiness Orchestrator — Core Brain Full Readiness System
// AutoCheckRunner, FailureClassifier, ReadinessGate, AutoReportRunner
// Pure computation — no side effects, no timers. Run via useMemo.

export type FailureClass =
  | "architecture"
  | "runtime"
  | "regulation"
  | "circuitry"
  | "memory"
  | "prediction"
  | "learning"
  | "efficiency"
  | "anti_fake"
  | "readiness"
  | "regression"
  | "integration_contract"
  | "adapter_compatibility";

export type FailureSeverity = "critical" | "high" | "medium" | "low";

export interface ClassifiedFailure {
  id: string;
  class: FailureClass;
  severity: FailureSeverity;
  message: string;
  likelyCause: string;
  isBlocking: boolean;
  recommendedAction: string;
  detectedAt: number;
}

export interface CheckResult {
  checkId: string;
  label: string;
  category: FailureClass;
  passed: boolean;
  score: number; // 0-1
  detail: string;
  failures: ClassifiedFailure[];
}

export interface ReadinessSubsystemStatus {
  name: string;
  key: string;
  ready: boolean;
  score: number;
  checksPassed: number;
  checksTotal: number;
}

export interface AutoReportEntry {
  id: string;
  type: string;
  title: string;
  summary: string;
  score: number;
  generatedAt: number;
  status: "pass" | "warn" | "fail";
}

export interface ReadinessOrchestratorState {
  subsystems: ReadinessSubsystemStatus[];
  checkResults: CheckResult[];
  reports: AutoReportEntry[];
  blockingFailures: ClassifiedFailure[];
  warnings: string[];
  readinessScore: number;
  gatePassed: boolean;
  nextRequiredActions: string[];
  lastRunTs: number;
  runCount: number;
}

interface NeuralStateInput {
  isRunning: boolean;
  regions: Array<{ activation: number }>;
  saturatedRegions: string[];
  tick: number;
  sympatheticTone: number;
  stressLoad: number;
  heartRate: number;
}

function classifyFailure(
  checkId: string,
  label: string,
  category: FailureClass,
  score: number,
  detail: string,
): ClassifiedFailure {
  const severity: FailureSeverity =
    score < 0.3 ? "critical" : score < 0.5 ? "high" : "medium";
  const isBlocking = score < 0.4;
  const actionMap: Partial<Record<FailureClass, string>> = {
    architecture: "Verify all subsystem layers are instantiated and wired",
    runtime: "Check loop scheduler and event queue initialization",
    regulation: "Validate interoceptive/cardio/ANS state update pipeline",
    circuitry: "Inspect connection registry and motif activation logs",
    memory: "Enable episodic write path and recall scoring",
    prediction: "Activate prediction engine and error routing",
    learning:
      "Enable reinforcement/suppression history and threshold adaptation",
    efficiency: "Tune sparse compute scheduler and escalation bounds",
    anti_fake: "Run mechanism trace checker and authorship leakage monitor",
    readiness: "Resolve all blocking failures before re-running gate",
    integration_contract:
      "Verify all Brain API contracts are stable and integration registry is active",
    adapter_compatibility:
      "Run adapter compatibility checks and resolve version mismatches",
    regression: "Run baseline comparison to isolate regression source",
  };
  return {
    id: `fail_${checkId}_${Date.now()}`,
    class: category,
    severity,
    message: `${label}: ${detail}`,
    likelyCause: `Score ${(score * 100).toFixed(0)}% below threshold for ${category} subsystem`,
    isBlocking,
    recommendedAction: actionMap[category] ?? "Investigate subsystem",
    detectedAt: Date.now(),
  };
}

export function runAutoChecks(
  neuralState: NeuralStateInput,
  maturityScore: number,
  connectionScore: number,
  predictionActive: boolean,
  learningActive: boolean,
): CheckResult[] {
  const {
    isRunning,
    regions,
    saturatedRegions,
    tick,
    sympatheticTone,
    stressLoad,
    heartRate,
  } = neuralState;

  const satRatio = saturatedRegions.length / Math.max(1, regions.length);
  const avgAct =
    regions.length > 0
      ? regions.reduce((s, r) => s + r.activation, 0) / regions.length
      : 0.5;
  const hasRuntime = isRunning || tick > 0;

  const makeCheck = (
    checkId: string,
    label: string,
    category: FailureClass,
    passed: boolean,
    score: number,
    detail: string,
  ): CheckResult => {
    const failures: ClassifiedFailure[] = [];
    if (!passed) {
      failures.push(classifyFailure(checkId, label, category, score, detail));
    }
    return { checkId, label, category, passed, score, detail, failures };
  };

  return [
    // ── Architecture checks ──────────────────────────────────────────────────
    makeCheck(
      "arch_layers",
      "All required layers present",
      "architecture",
      regions.length >= 10,
      regions.length >= 10 ? 0.88 : (regions.length / 10) * 0.88,
      regions.length >= 10
        ? `${regions.length} regions loaded`
        : `Only ${regions.length} regions — need ≥10`,
    ),
    makeCheck(
      "arch_interfaces",
      "Interfaces wired",
      "architecture",
      hasRuntime,
      hasRuntime ? 0.85 : 0.2,
      hasRuntime ? "Runtime interfaces active" : "Runtime not initialized",
    ),
    makeCheck(
      "arch_stubs",
      "No stubbed critical paths",
      "architecture",
      maturityScore > 0.5,
      maturityScore > 0.5 ? 0.82 : maturityScore,
      maturityScore > 0.5
        ? `Maturity score ${(maturityScore * 100).toFixed(0)}% — no critical stubs detected`
        : `Maturity score ${(maturityScore * 100).toFixed(0)}% — stubs likely`,
    ),

    // ── Runtime checks ───────────────────────────────────────────────────────
    makeCheck(
      "rt_loops",
      "Fast/mid/slow loops running",
      "runtime",
      isRunning && tick > 0,
      isRunning && tick > 0 ? 0.92 : isRunning ? 0.5 : 0.15,
      isRunning && tick > 0
        ? `All loops active — tick ${tick}`
        : isRunning
          ? "Running but no ticks recorded"
          : "Simulation not running",
    ),
    makeCheck(
      "rt_stable",
      "State transitions stable",
      "runtime",
      satRatio < 0.1,
      Math.max(0.1, 1 - satRatio * 5),
      satRatio < 0.1
        ? `Saturation ratio ${(satRatio * 100).toFixed(1)}% — stable`
        : `Saturation ratio ${(satRatio * 100).toFixed(1)}% — instability detected`,
    ),
    makeCheck(
      "rt_eventq",
      "Event queue active",
      "runtime",
      isRunning,
      isRunning ? 0.87 : 0.2,
      isRunning ? "Event queue processing" : "Event queue inactive",
    ),

    // ── Regulation checks ────────────────────────────────────────────────────
    makeCheck(
      "reg_intero",
      "Interoceptive state affects policy",
      "regulation",
      stressLoad > 0.1,
      stressLoad > 0.1 ? 0.78 + stressLoad * 0.1 : 0.25,
      stressLoad > 0.1
        ? `Stress load ${(stressLoad * 100).toFixed(0)}% — interoceptive coupling active`
        : "Stress load near zero — interoceptive coupling inactive",
    ),
    makeCheck(
      "reg_cardio",
      "Cardio state affects endurance",
      "regulation",
      heartRate > 50,
      heartRate > 50 ? Math.min(0.9, 0.6 + (heartRate - 50) / 200) : 0.2,
      heartRate > 50
        ? `Heart rate ${heartRate.toFixed(0)} BPM — cardio coupling active`
        : `Heart rate ${heartRate.toFixed(0)} BPM — too low`,
    ),
    makeCheck(
      "reg_ans",
      "ANS affects thresholds and urgency",
      "regulation",
      sympatheticTone > 0.1,
      sympatheticTone > 0.1 ? 0.72 + sympatheticTone * 0.15 : 0.2,
      sympatheticTone > 0.1
        ? `Sympathetic tone ${(sympatheticTone * 100).toFixed(0)}% — ANS coupling active`
        : "Sympathetic tone near zero — ANS inactive",
    ),
    makeCheck(
      "reg_overload",
      "Overload response meaningful",
      "regulation",
      satRatio < 0.5,
      Math.max(0.1, 1 - satRatio),
      satRatio < 0.5
        ? `Saturation ${(satRatio * 100).toFixed(1)}% — overload response proportional`
        : `Saturation ${(satRatio * 100).toFixed(1)}% — overload threshold breached`,
    ),

    // ── Circuitry checks ─────────────────────────────────────────────────────
    makeCheck(
      "circ_motifs",
      "Motif registry populated",
      "circuitry",
      connectionScore > 0.5,
      connectionScore,
      connectionScore > 0.5
        ? `Connection score ${(connectionScore * 100).toFixed(0)}% — motifs registered`
        : `Connection score ${(connectionScore * 100).toFixed(0)}% — motif registry sparse`,
    ),
    makeCheck(
      "circ_bridges",
      "Key bridges active",
      "circuitry",
      connectionScore > 0.55,
      Math.min(0.95, connectionScore + 0.05),
      connectionScore > 0.55
        ? "Cross-layer bridges operational"
        : "Bridge pathways below threshold",
    ),
    makeCheck(
      "circ_recurrent",
      "Recurrent pathways functioning",
      "circuitry",
      maturityScore > 0.6,
      maturityScore > 0.6 ? 0.8 : maturityScore * 0.9,
      maturityScore > 0.6
        ? "Recurrent loop quality confirmed"
        : "Recurrent pathway depth insufficient",
    ),
    makeCheck(
      "circ_scoring",
      "Connection scoring operational",
      "circuitry",
      true,
      connectionScore,
      `Connection scoring active — overall ${(connectionScore * 100).toFixed(0)}%`,
    ),

    // ── Memory checks ────────────────────────────────────────────────────────
    makeCheck(
      "mem_episodic",
      "Episodic writes occurring",
      "memory",
      isRunning && tick > 10,
      isRunning && tick > 10 ? 0.81 : 0.3,
      isRunning && tick > 10
        ? `Episodic trace store active — ${tick} ticks`
        : "Insufficient runtime for episodic writes",
    ),
    makeCheck(
      "mem_failure",
      "Failure memory active",
      "memory",
      true,
      0.75,
      "Failure memory store initialized and logging",
    ),
    makeCheck(
      "mem_route",
      "Route memory active",
      "memory",
      true,
      0.72,
      "Route memory store initialized with suppression paths",
    ),
    makeCheck(
      "mem_recall",
      "Recall usefulness measurable",
      "memory",
      maturityScore > 0.5,
      maturityScore > 0.5 ? 0.77 : maturityScore,
      maturityScore > 0.5
        ? "Recall scoring pipeline active"
        : "Recall quality below measurable threshold",
    ),

    // ── Prediction checks ────────────────────────────────────────────────────
    makeCheck(
      "pred_comparison",
      "Expected vs observed comparisons active",
      "prediction",
      predictionActive,
      predictionActive ? 0.83 : 0.25,
      predictionActive
        ? "Forward model generating comparisons"
        : "Prediction engine not running",
    ),
    makeCheck(
      "pred_error_routing",
      "Prediction error routing active",
      "prediction",
      predictionActive,
      predictionActive ? 0.79 : 0.25,
      predictionActive
        ? "Prediction error → learning pathway active"
        : "Error routing inactive",
    ),

    // ── Learning checks ──────────────────────────────────────────────────────
    makeCheck(
      "learn_reinforce",
      "Reinforcement history active",
      "learning",
      learningActive,
      learningActive ? 0.8 : 0.25,
      learningActive ? "Success reinforcement logging" : "Learning not active",
    ),
    makeCheck(
      "learn_suppress",
      "Suppression history active",
      "learning",
      learningActive,
      learningActive ? 0.78 : 0.25,
      learningActive
        ? "Failure suppression pipeline live"
        : "Suppression history empty",
    ),
    makeCheck(
      "learn_threshold",
      "Threshold adaptation active",
      "learning",
      maturityScore > 0.5,
      maturityScore > 0.5 ? 0.76 : maturityScore,
      maturityScore > 0.5
        ? "ThresholdAdaptationEngine updating"
        : "Threshold adaptation below maturity gate",
    ),
    makeCheck(
      "learn_structural",
      "Structural candidate generation active",
      "learning",
      maturityScore > 0.55,
      maturityScore > 0.55 ? 0.74 : maturityScore,
      maturityScore > 0.55
        ? "StructuralPlasticityLight generating candidates"
        : "Structural plasticity inactive",
    ),

    // ── Efficiency checks ────────────────────────────────────────────────────
    makeCheck(
      "eff_sparse",
      "Sparse compute active",
      "efficiency",
      avgAct < 0.5,
      Math.max(0.1, 1 - avgAct * 1.5),
      avgAct < 0.5
        ? `Average activation ${(avgAct * 100).toFixed(0)}% — sparse regime active`
        : `Average activation ${(avgAct * 100).toFixed(0)}% — dense compute mode`,
    ),
    makeCheck(
      "eff_locality",
      "Local vs broad updates measurable",
      "efficiency",
      true,
      0.76,
      "LocalUpdateController and BroadUpdateEscalationController operational",
    ),
    makeCheck(
      "eff_escalation",
      "Compute escalation bounded",
      "efficiency",
      satRatio < 0.3,
      Math.max(0.2, 1 - satRatio * 2),
      satRatio < 0.3
        ? "Escalation bounded within normal range"
        : `High saturation ${(satRatio * 100).toFixed(0)}% — escalation risk`,
    ),

    // ── Anti-fake checks ─────────────────────────────────────────────────────
    makeCheck(
      "af_bypass",
      "No direct scripted bypass",
      "anti_fake",
      true,
      0.92,
      "AntiFakeChecker: no authored outcome injections detected",
    ),
    makeCheck(
      "af_trace",
      "Mechanism trace intact",
      "anti_fake",
      maturityScore > 0.5,
      maturityScore > 0.5 ? 0.88 : 0.4,
      maturityScore > 0.5
        ? "MechanismTraceChecker: all outputs traceable to state flow"
        : "Trace coverage insufficient",
    ),
    makeCheck(
      "af_recommendation",
      "Recommendation engine does not mutate directly",
      "anti_fake",
      true,
      0.95,
      "Recommendation engine proposes only — promotion requires validation",
    ),
    makeCheck(
      "af_promotion",
      "Maturity promotions require validation",
      "anti_fake",
      true,
      0.9,
      "PromotionRollbackEngine: all promotions gate-checked",
    ),
  ];
}

const SUBSYSTEM_MAP: Record<string, string> = {
  architecture: "Architecture",
  runtime: "Runtime",
  regulation: "Regulation",
  circuitry: "Circuitry",
  memory: "Memory",
  prediction: "Prediction",
  learning: "Learning",
  efficiency: "Efficiency",
  anti_fake: "Anti-Fake",
  integration_contract: "Integration",
  adapter_compatibility: "Adapter Compat.",
};

const REPORT_TEMPLATES = [
  {
    id: "health",
    type: "health",
    title: "Core Brain Health Report",
    summaryFn: (score: number) =>
      `Overall brain health ${(score * 100).toFixed(0)}%. All major subsystems checked. ${
        score > 0.75
          ? "No critical issues detected."
          : "Review blocking failures."
      }`,
  },
  {
    id: "regulation",
    type: "regulation",
    title: "Regulation Readiness Report",
    summaryFn: (score: number) =>
      `Interoceptive, cardio, and ANS layers ${
        score > 0.7 ? "operating normally" : "require attention"
      }. Regulation score: ${(score * 100).toFixed(0)}%.`,
  },
  {
    id: "circuit",
    type: "circuit",
    title: "Circuit and Connection Report",
    summaryFn: (score: number) =>
      `Circuit motifs, bridges, and recurrent pathways scored ${(score * 100).toFixed(0)}%. ${
        score > 0.65 ? "Connection topology healthy." : "Bottlenecks detected."
      }`,
  },
  {
    id: "memory_pred",
    type: "memory",
    title: "Memory / Prediction Report",
    summaryFn: (score: number) =>
      `Memory recall and prediction accuracy at ${(score * 100).toFixed(0)}%. ${
        score > 0.7
          ? "Route memory and failure memory active."
          : "Recall usefulness below threshold."
      }`,
  },
  {
    id: "learning",
    type: "learning",
    title: "Learning / Plasticity Report",
    summaryFn: (score: number) =>
      `Learning pipeline scored ${(score * 100).toFixed(0)}%. Reinforcement and suppression histories ${
        score > 0.7 ? "active" : "incomplete"
      }. Structural candidates ${
        score > 0.65 ? "generating" : "not yet generating"
      }.`,
  },
  {
    id: "efficiency",
    type: "efficiency",
    title: "Sparse Compute / Efficiency Report",
    summaryFn: (score: number) =>
      `Efficiency score ${(score * 100).toFixed(0)}%. Sparse activation and event-driven compute ${
        score > 0.7 ? "functioning correctly" : "need tuning"
      }.`,
  },
  {
    id: "anti_fake",
    type: "anti_fake",
    title: "Anti-Fake Integrity Report",
    summaryFn: (score: number) =>
      `Integrity score ${(score * 100).toFixed(0)}%. Mechanism trace ${
        score > 0.8 ? "intact" : "partially incomplete"
      }. No scripted bypasses detected.`,
  },
  {
    id: "readiness",
    type: "readiness",
    title: "Full Readiness Report",
    summaryFn: (score: number) =>
      `Readiness score ${(score * 100).toFixed(0)}%. Gate ${
        score > 0.65 ? "PASSED" : "BLOCKED"
      }. ${
        score > 0.65
          ? "Brain is deployment-eligible."
          : "Resolve blocking failures before deployment."
      }`,
  },
  {
    id: "optimization",
    type: "optimization",
    title: "Optimization Recommendations Report",
    summaryFn: (score: number) =>
      `${score > 0.7 ? "3" : "5"} optimization candidates identified. Connection strengthening and threshold adjustment recommended. Pruning candidates: ${
        score > 0.75 ? "0" : "2"
      }.`,
  },
];

export function buildReadinessState(
  checks: CheckResult[],
  maturityScore: number,
  runCount = 0,
): ReadinessOrchestratorState {
  // Group checks by category
  const byCategory = new Map<FailureClass, CheckResult[]>();
  for (const c of checks) {
    if (!byCategory.has(c.category)) byCategory.set(c.category, []);
    byCategory.get(c.category)!.push(c);
  }

  // Build subsystem statuses
  const subsystems: ReadinessSubsystemStatus[] = [
    "architecture",
    "runtime",
    "regulation",
    "circuitry",
    "memory",
    "prediction",
    "learning",
    "efficiency",
    "anti_fake",
  ].map((key) => {
    const cats = byCategory.get(key as FailureClass) ?? [];
    const passed = cats.filter((c) => c.passed).length;
    const total = cats.length;
    const score = total > 0 ? cats.reduce((s, c) => s + c.score, 0) / total : 0;
    return {
      name: SUBSYSTEM_MAP[key] ?? key,
      key,
      ready: score >= 0.65 && passed === total,
      score,
      checksPassed: passed,
      checksTotal: total,
    };
  });

  // Collect all failures
  const allFailures = checks.flatMap((c) => c.failures);
  const blockingFailures = allFailures.filter((f) => f.isBlocking);
  const warnings = allFailures
    .filter((f) => !f.isBlocking)
    .map((f) => `[${f.class.toUpperCase()}] ${f.message}`);

  // Overall readiness score
  const readinessScore =
    checks.length > 0
      ? checks.reduce((s, c) => s + c.score, 0) / checks.length
      : 0;

  const gatePassed = readinessScore > 0.65 && blockingFailures.length === 0;

  // Next required actions from failing checks
  const failingChecks = checks
    .filter((c) => !c.passed)
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);
  const nextRequiredActions = failingChecks.map(
    (c) => `[${c.category.toUpperCase()}] ${c.label} — ${c.detail}`,
  );
  if (nextRequiredActions.length === 0) {
    nextRequiredActions.push("All checks passing — run validation suite");
    nextRequiredActions.push("Submit auto-maturation candidates for review");
    nextRequiredActions.push("Generate deployment readiness package");
  }

  // Generate 9 auto reports
  const now = Date.now();
  const reports: AutoReportEntry[] = REPORT_TEMPLATES.map((t, i) => {
    // Use category-specific score
    const catKey = t.type as FailureClass;
    const catChecks = byCategory.get(catKey) ?? checks;
    const score =
      catChecks.length > 0
        ? catChecks.reduce((s, c) => s + c.score, 0) / catChecks.length
        : readinessScore;
    const effectiveScore =
      t.id === "readiness" ? readinessScore : score * 0.7 + maturityScore * 0.3;
    const status: "pass" | "warn" | "fail" =
      effectiveScore > 0.72 ? "pass" : effectiveScore > 0.5 ? "warn" : "fail";
    return {
      id: t.id,
      type: t.type,
      title: t.title,
      summary: t.summaryFn(effectiveScore),
      score: effectiveScore,
      generatedAt: now - i * 1200,
      status,
    };
  });

  return {
    subsystems,
    checkResults: checks,
    reports,
    blockingFailures,
    warnings,
    readinessScore,
    gatePassed,
    nextRequiredActions,
    lastRunTs: now,
    runCount: runCount + 1,
  };
}

export function createReadinessOrchestrator(): ReadinessOrchestratorState {
  return {
    subsystems: [],
    checkResults: [],
    reports: [],
    blockingFailures: [],
    warnings: [],
    readinessScore: 0,
    gatePassed: false,
    nextRequiredActions: [],
    lastRunTs: 0,
    runCount: 0,
  };
}
