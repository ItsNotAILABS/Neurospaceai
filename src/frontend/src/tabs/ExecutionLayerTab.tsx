import { useCallback, useMemo, useState } from "react";
import type {
  NeuralSimulationControls,
  NeuralSimulationState,
} from "../hooks/useNeuralSimulation";
import { createArtifact } from "../utils/artifactStore";
import {
  type BrainReport,
  type ModuleCheckResult,
  REPORT_TYPES,
  type ReadinessGateResult,
  calculateReadinessScore,
  generateReport,
  getBlockers,
  resolveDeploymentEligibility,
  runAllChecks,
} from "../utils/autoChecksReports";
import {
  globalContractRegistry,
  globalIngestService,
} from "../utils/integrationContractLayer";

type Neural = NeuralSimulationState & NeuralSimulationControls;

const C = {
  bg: "oklch(0.055 0.01 265)",
  panel: "oklch(0.09 0.015 265)",
  border: "oklch(0.18 0.05 255)",
  borderDim: "oklch(0.13 0.03 260)",
  cyan: "oklch(0.72 0.22 195)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.78 0.22 80)",
  red: "oklch(0.72 0.22 25)",
  muted: "oklch(0.38 0.05 220)",
  dim: "oklch(0.26 0.04 240)",
  text: "oklch(0.82 0.05 210)",
};

const STATUS_COLOR: Record<string, string> = {
  pass: C.green,
  warn: C.amber,
  fail: C.red,
  pending: C.muted,
};

const PHASE_META = [
  {
    num: 1,
    name: "Core Runtime Foundation",
    short: "RUNTIME",
    desc: "Schemas, BrainInstanceManager, RuntimeScheduler, EventQueue",
  },
  {
    num: 2,
    name: "Regulation Foundation",
    short: "REGULATION",
    desc: "Interoceptive, Cardio, ANS, Threshold, Recovery, Overload",
  },
  {
    num: 3,
    name: "Circuit / Memory / Prediction / Learning",
    short: "CIRCUIT",
    desc: "Salience, WM, Arbitration, Connections, Memory, Prediction, Learning",
  },
  {
    num: 4,
    name: "Sparse Compute + Telemetry",
    short: "EFFICIENCY",
    desc: "SparseCompute, LocalUpdate, BroadUpdate, TelemetryIngest, all Metrics",
  },
  {
    num: 5,
    name: "Validation + Anti-Fake",
    short: "VALIDATION",
    desc: "Baseline, Ablation, Perturbation, AntiFake, Mechanism Trace, Regression",
  },
  {
    num: 6,
    name: "Optimization + Auto-Maturation",
    short: "OPTIMIZATION",
    desc: "ConnectionOpt, MotifOpt, ThresholdOpt, PromotionRollback",
  },
  {
    num: 7,
    name: "External Integration Contract",
    short: "INTEGRATION",
    desc: "ContractRegistry, Sessions, Binding, IngestService, MutationBoundary",
  },
  {
    num: 8,
    name: "Auto-Checks + Reports + Gate",
    short: "ORCHESTRATION",
    desc: "CheckRegistry, AutoChecks, AutoReports, ReadinessGate, Classifier",
  },
  {
    num: 9,
    name: "Deployment Readiness Verification",
    short: "DEPLOYMENT",
    desc: "Phase 9 is pass/fail only. All previous phases must pass.",
  },
];

interface VerifyDeployResult {
  verdict: "READY" | "BLOCKED";
  score: number;
  adapterCount: number;
  ingestTotal: number;
  blockers: string[];
  warnings: string[];
  timestamp: string;
}

function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLOR[status] ?? C.muted;
  return (
    <span
      className="font-mono text-[8px] tracking-widest uppercase px-1.5 py-0.5"
      style={{
        color,
        border: `1px solid ${color}`,
        background: `${color}14`,
        borderRadius: 2,
        boxShadow: status === "pass" ? `0 0 6px ${color}44` : "none",
      }}
    >
      {status}
    </span>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div
      className="w-full h-1"
      style={{ background: C.borderDim, borderRadius: 2 }}
    >
      <div
        style={{
          width: `${Math.round(value * 100)}%`,
          height: "100%",
          background: color,
          borderRadius: 2,
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const r = 36;
  const circ = 2 * Math.PI * r;
  const filled = circ * score;
  const color = score >= 0.65 ? C.green : score >= 0.4 ? C.amber : C.red;
  return (
    <svg
      width={90}
      height={90}
      viewBox="0 0 90 90"
      role="img"
      aria-label={`Readiness score ${Math.round(score * 100)}%`}
    >
      <circle
        cx={45}
        cy={45}
        r={r}
        fill="none"
        stroke={C.borderDim}
        strokeWidth={6}
      />
      <circle
        cx={45}
        cy={45}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeLinecap="round"
        transform="rotate(-90 45 45)"
        style={{
          transition: "stroke-dasharray 0.5s ease",
          filter: `drop-shadow(0 0 4px ${color})`,
        }}
      />
      <text
        x={45}
        y={49}
        textAnchor="middle"
        fontFamily="monospace"
        fontSize={14}
        fontWeight="bold"
        fill={color}
      >
        {pct}%
      </text>
    </svg>
  );
}

function VerifyDeployModal({
  result,
  onClose,
}: {
  result: VerifyDeployResult;
  onClose: () => void;
}) {
  const isReady = result.verdict === "READY";
  const verdictColor = isReady ? C.green : C.red;
  const scoreColor =
    result.score >= 0.65 ? C.green : result.score >= 0.4 ? C.amber : C.red;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.75)" }}
      role="presentation"
    >
      {/* Backdrop click closes - keyboard accessible */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        aria-hidden="true"
      />

      <dialog
        open
        className="relative w-full max-w-md mx-4 flex flex-col m-0 p-0"
        aria-labelledby="verify-deploy-title"
        data-ocid="verify.dialog"
        style={{
          background: C.bg,
          border: `1px solid ${verdictColor}`,
          borderRadius: 4,
          boxShadow: `0 0 32px ${verdictColor}44, 0 8px 40px rgba(0,0,0,0.8)`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b"
          style={{ borderColor: C.border }}
        >
          <div>
            <h2
              id="verify-deploy-title"
              className="font-mono text-[10px] tracking-widest uppercase"
              style={{ color: C.cyan }}
            >
              DEPLOYMENT VERIFICATION REPORT
            </h2>
            <p
              className="font-mono text-[7px] mt-0.5"
              style={{ color: C.muted }}
            >
              {result.timestamp}
            </p>
          </div>
          <button
            type="button"
            data-ocid="verify.close_button"
            onClick={onClose}
            className="font-mono text-[10px] transition-opacity hover:opacity-70"
            style={{ color: C.muted, cursor: "pointer" }}
            aria-label="Close verification report"
          >
            ✕
          </button>
        </div>

        {/* Verdict banner */}
        <div
          className="mx-5 mt-4 py-4 text-center"
          style={{
            background: `${verdictColor}18`,
            border: `1px solid ${verdictColor}`,
            borderRadius: 3,
            boxShadow: `0 0 16px ${verdictColor}44`,
          }}
        >
          <span
            className="font-mono text-[28px] font-bold tracking-[0.2em]"
            style={{
              color: verdictColor,
              textShadow: `0 0 20px ${verdictColor}`,
            }}
          >
            {result.verdict}
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 px-5 py-4">
          <div
            className="flex flex-col items-center py-3"
            style={{
              background: C.panel,
              border: `1px solid ${C.borderDim}`,
              borderRadius: 3,
            }}
          >
            <span
              className="font-mono text-[18px] font-bold"
              style={{ color: scoreColor }}
            >
              {Math.round(result.score * 100)}%
            </span>
            <span
              className="font-mono text-[7px] uppercase tracking-widest mt-1"
              style={{ color: C.muted }}
            >
              Score
            </span>
          </div>
          <div
            className="flex flex-col items-center py-3"
            style={{
              background: C.panel,
              border: `1px solid ${C.borderDim}`,
              borderRadius: 3,
            }}
          >
            <span
              className="font-mono text-[18px] font-bold"
              style={{ color: C.cyan }}
            >
              {result.adapterCount}
            </span>
            <span
              className="font-mono text-[7px] uppercase tracking-widest mt-1"
              style={{ color: C.muted }}
            >
              Adapters
            </span>
          </div>
          <div
            className="flex flex-col items-center py-3"
            style={{
              background: C.panel,
              border: `1px solid ${C.borderDim}`,
              borderRadius: 3,
            }}
          >
            <span
              className="font-mono text-[18px] font-bold"
              style={{ color: C.cyan }}
            >
              {result.ingestTotal}
            </span>
            <span
              className="font-mono text-[7px] uppercase tracking-widest mt-1"
              style={{ color: C.muted }}
            >
              Ingest Evts
            </span>
          </div>
        </div>

        {/* Blockers */}
        {result.blockers.length > 0 && (
          <div className="px-5 pb-3">
            <p
              className="font-mono text-[8px] uppercase tracking-widest mb-1.5"
              style={{ color: C.red }}
            >
              BLOCKING MODULES ({result.blockers.length})
            </p>
            <div
              className="flex flex-col gap-0.5 max-h-28 overflow-y-auto"
              style={{
                background: `${C.red}08`,
                border: `1px solid ${C.red}30`,
                borderRadius: 3,
                padding: "6px 8px",
              }}
            >
              {result.blockers.map((b) => (
                <div key={b} className="flex items-center gap-1.5">
                  <span style={{ color: C.red, fontSize: 7 }}>▲</span>
                  <span
                    className="font-mono text-[8px]"
                    style={{ color: C.red }}
                  >
                    {b}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings shown when no blockers */}
        {result.blockers.length === 0 && result.warnings.length > 0 && (
          <div className="px-5 pb-3">
            <p
              className="font-mono text-[8px] uppercase tracking-widest mb-1.5"
              style={{ color: C.amber }}
            >
              WARNINGS ({result.warnings.length})
            </p>
            <div
              className="flex flex-col gap-0.5 max-h-20 overflow-y-auto"
              style={{
                background: `${C.amber}08`,
                border: `1px solid ${C.amber}30`,
                borderRadius: 3,
                padding: "6px 8px",
              }}
            >
              {result.warnings.slice(0, 5).map((w) => (
                <div key={w} className="flex items-center gap-1.5">
                  <span style={{ color: C.amber, fontSize: 7 }}>⚠</span>
                  <span
                    className="font-mono text-[8px]"
                    style={{ color: C.amber }}
                  >
                    {w}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All-clear message */}
        {isReady && result.blockers.length === 0 && (
          <div className="px-5 pb-3">
            <div
              className="flex items-center gap-2 py-2 px-3"
              style={{
                background: `${C.green}10`,
                border: `1px solid ${C.green}40`,
                borderRadius: 3,
              }}
            >
              <span style={{ color: C.green }}>✓</span>
              <span className="font-mono text-[8px]" style={{ color: C.green }}>
                All systems nominal. Deployment authorised.
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          className="flex justify-end px-5 py-3 border-t"
          style={{ borderColor: C.borderDim }}
        >
          <button
            type="button"
            data-ocid="verify.confirm_button"
            onClick={onClose}
            className="font-mono text-[9px] tracking-widest uppercase px-4 py-1.5 border transition-all"
            style={{
              border: `1px solid ${verdictColor}`,
              color: verdictColor,
              background: `${verdictColor}14`,
              borderRadius: 2,
              cursor: "pointer",
            }}
          >
            CLOSE
          </button>
        </div>
      </dialog>
    </div>
  );
}

export default function ExecutionLayerTab({ neural }: { neural: Neural }) {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [checks, setChecks] = useState<ModuleCheckResult[]>([]);
  const [reports, setReports] = useState<Record<string, BrainReport>>({});
  const [gate, setGate] = useState<ReadinessGateResult | null>(null);
  const [activeReportTab, setActiveReportTab] = useState(REPORT_TYPES[0].id);
  const [hasRun, setHasRun] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set());
  const [verifyResult, setVerifyResult] = useState<VerifyDeployResult | null>(
    null,
  );
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const ingestStats = globalIngestService.getStats();
  const adapterCount = globalContractRegistry.count();

  const runChecks = useCallback(() => {
    const results = runAllChecks(
      neural.isRunning,
      neural.sympatheticTone > 0,
      adapterCount * 7,
    );
    setChecks(results);
    const g = resolveDeploymentEligibility(results);
    setGate(g);
    setHasRun(true);
    return { results, g };
  }, [neural.isRunning, neural.sympatheticTone, adapterCount]);

  const verifyDeploy = useCallback(() => {
    // Ensure checks have been run — run them if not yet done
    let currentChecks = checks;
    let currentGate = gate;
    if (!hasRun) {
      const { results, g } = runChecks();
      currentChecks = results;
      currentGate = g;
    }

    // Re-resolve deployment eligibility from current check state
    const deployGate = resolveDeploymentEligibility(currentChecks);
    const currentIngestStats = globalIngestService.getStats();
    const currentAdapterCount = globalContractRegistry.count();

    // Additional deployment-specific checks beyond the readiness gate
    const extraBlockers: string[] = [];
    if (currentAdapterCount === 0) {
      extraBlockers.push("No adapters registered — integration layer inactive");
    }
    if (currentIngestStats.total === 0) {
      extraBlockers.push("No ingest events — trace return pipeline unverified");
    }
    if (deployGate.score < 0.65) {
      extraBlockers.push(
        `Readiness score ${Math.round(deployGate.score * 100)}% is below 65% threshold`,
      );
    }

    const allBlockers = [...deployGate.blockers, ...extraBlockers];
    const finalVerdict: "READY" | "BLOCKED" =
      allBlockers.length === 0 ? "READY" : "BLOCKED";

    // Sync gate state if it changed
    if (!currentGate) {
      setGate(deployGate);
    }

    const result: VerifyDeployResult = {
      verdict: finalVerdict,
      score: deployGate.score,
      adapterCount: currentAdapterCount,
      ingestTotal: currentIngestStats.total,
      blockers: allBlockers,
      warnings: deployGate.warnings,
      timestamp: new Date().toLocaleString(),
    };

    setVerifyResult(result);
    setShowVerifyModal(true);
  }, [checks, gate, hasRun, runChecks]);

  const generateAllReports = useCallback(() => {
    const { results } = hasRun ? { results: checks } : runChecks();
    const currentChecks = results ?? checks;
    const r: Record<string, BrainReport> = {};
    for (const rt of REPORT_TYPES) {
      const report = generateReport(rt.id, currentChecks);
      r[rt.id] = report;
      // Create artifact for each generated report
      createArtifact({
        artifact_type: "report",
        source_system: "core",
        title: `${rt.label} — ${new Date().toLocaleTimeString()}`,
        summary: report.summary,
        score:
          report.status === "pass" ? 85 : report.status === "warn" ? 55 : 25,
        status: report.status as "pass" | "warn" | "fail",
        ai_review_summary:
          report.sections[0]?.content ?? `Report generated: ${report.status}`,
        metadata: {
          report_id: rt.id,
          phase_count: currentChecks.length,
          generated_at: Date.now(),
        },
        related_artifact_ids: [],
        tags: ["report", rt.id, "execution_layer"],
        version: "1.0.0",
      });
    }
    setReports(r);
  }, [checks, hasRun, runChecks]);

  const phaseChecks = useMemo(() => {
    const map: Record<number, ModuleCheckResult[]> = {};
    for (let p = 1; p <= 9; p++) map[p] = checks.filter((c) => c.phase === p);
    return map;
  }, [checks]);

  const phaseScore = (p: number) => {
    const pc = phaseChecks[p] ?? [];
    if (pc.length === 0) return null;
    const pass = pc.filter((c) => c.status === "pass").length;
    return pass / pc.length;
  };

  const filteredChecks = useMemo(() => {
    let base = selectedPhase
      ? checks.filter((c) => c.phase === selectedPhase)
      : checks;
    if (filterStatus !== "all")
      base = base.filter((c) => c.status === filterStatus);
    return base;
  }, [checks, selectedPhase, filterStatus]);

  const score = gate?.score ?? (hasRun ? calculateReadinessScore(checks) : 0);
  const verdict =
    gate?.verdict ??
    (hasRun
      ? getBlockers(checks).length === 0 && score >= 0.65
        ? "READY"
        : "BLOCKED"
      : null);

  const togglePhaseExpand = (p: number) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  };

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: C.bg }}
    >
      {/* Top bar */}
      <div
        className="shrink-0 flex items-center justify-between px-4 py-2 border-b"
        style={{ borderColor: C.border, background: "oklch(0.07 0.012 265)" }}
      >
        <div>
          <h2
            className="font-mono text-[11px] tracking-widest uppercase"
            style={{ color: C.cyan }}
          >
            EXECUTION LAYER — PHASE 1–9 BUILD STATUS
          </h2>
          <p
            className="font-mono text-[8px] tracking-widest"
            style={{ color: C.muted }}
          >
            Implementation task tree · dependency map · done criteria · release
            path
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="execution.run_checks.button"
            onClick={runChecks}
            className="font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 border transition-all"
            style={{
              border: `1px solid ${C.cyan}`,
              color: C.cyan,
              background: `${C.cyan}10`,
              cursor: "pointer",
            }}
          >
            ▶ RUN ALL CHECKS
          </button>
          <button
            type="button"
            data-ocid="execution.generate_report.button"
            onClick={generateAllReports}
            className="font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 border transition-all"
            style={{
              border: `1px solid ${C.amber}`,
              color: C.amber,
              background: `${C.amber}10`,
              cursor: "pointer",
            }}
          >
            ≡ GEN REPORTS
          </button>
          <button
            type="button"
            data-ocid="execution.verify_deployment.button"
            onClick={verifyDeploy}
            className="font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 border transition-all"
            style={{
              border: `1px solid ${
                verifyResult?.verdict === "READY"
                  ? C.green
                  : verifyResult?.verdict === "BLOCKED"
                    ? C.red
                    : C.muted
              }`,
              color:
                verifyResult?.verdict === "READY"
                  ? C.green
                  : verifyResult?.verdict === "BLOCKED"
                    ? C.red
                    : C.muted,
              background:
                verifyResult?.verdict === "READY"
                  ? `${C.green}10`
                  : verifyResult?.verdict === "BLOCKED"
                    ? `${C.red}10`
                    : `${C.muted}10`,
              cursor: "pointer",
            }}
          >
            ◎ VERIFY DEPLOY
          </button>
        </div>
      </div>

      {/* Main 3-panel layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* LEFT: Phase Tree */}
        <div
          className="w-64 shrink-0 border-r flex flex-col overflow-y-auto"
          style={{ borderColor: C.border }}
        >
          <div
            className="px-3 py-2 border-b shrink-0"
            style={{ borderColor: C.borderDim }}
          >
            <span
              className="font-mono text-[8px] tracking-widest uppercase"
              style={{ color: C.muted }}
            >
              PHASE TREE
            </span>
          </div>
          <div className="flex flex-col gap-0.5 p-2">
            {PHASE_META.map((phase) => {
              const ps = phaseScore(phase.num);
              const phaseChecksArr = phaseChecks[phase.num] ?? [];
              const active = selectedPhase === phase.num;
              const expanded = expandedPhases.has(phase.num);
              const phaseStatus =
                ps === null
                  ? "pending"
                  : ps === 1
                    ? "pass"
                    : ps >= 0.5
                      ? "warn"
                      : "fail";
              const color = STATUS_COLOR[phaseStatus];
              return (
                <div key={phase.num}>
                  <button
                    type="button"
                    data-ocid="execution.phase.tab"
                    onClick={() => {
                      setSelectedPhase(active ? null : phase.num);
                      togglePhaseExpand(phase.num);
                    }}
                    className="w-full text-left px-2 py-2 transition-all"
                    style={{
                      background: active ? `${C.cyan}12` : "transparent",
                      border: active
                        ? `1px solid ${C.cyan}40`
                        : "1px solid transparent",
                      borderRadius: 3,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="font-mono text-[8px]"
                        style={{ color: C.muted }}
                      >
                        P{phase.num}
                      </span>
                      <StatusBadge status={phaseStatus} />
                    </div>
                    <div
                      className="font-mono text-[9px] leading-tight mb-1.5"
                      style={{ color: active ? C.cyan : C.text }}
                    >
                      {phase.short}
                    </div>
                    {ps !== null && <ProgressBar value={ps} color={color} />}
                    {ps === null && (
                      <div
                        className="h-1"
                        style={{ background: C.borderDim, borderRadius: 2 }}
                      />
                    )}
                  </button>

                  {expanded && phaseChecksArr.length > 0 && (
                    <div className="ml-3 mt-0.5 mb-1 flex flex-col gap-0.5">
                      {phaseChecksArr.slice(0, 6).map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center gap-1.5 px-2 py-1"
                          style={{
                            background: "oklch(0.075 0.01 265)",
                            borderRadius: 2,
                          }}
                        >
                          <span
                            style={{
                              color: STATUS_COLOR[c.status],
                              fontSize: 7,
                            }}
                          >
                            ●
                          </span>
                          <span
                            className="font-mono text-[7px]"
                            style={{ color: C.muted }}
                          >
                            {c.name}
                          </span>
                        </div>
                      ))}
                      {phaseChecksArr.length > 6 && (
                        <span
                          className="font-mono text-[7px] px-2"
                          style={{ color: C.dim }}
                        >
                          +{phaseChecksArr.length - 6} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER: Module Status Table */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div
            className="shrink-0 flex items-center justify-between px-3 py-2 border-b"
            style={{ borderColor: C.border }}
          >
            <span
              className="font-mono text-[8px] tracking-widest uppercase"
              style={{ color: C.muted }}
            >
              MODULE STATUS{" "}
              {hasRun
                ? `— ${checks.length} modules`
                : "— run checks to populate"}
            </span>
            <div className="flex items-center gap-1">
              {["all", "pass", "warn", "fail"].map((s) => (
                <button
                  key={s}
                  type="button"
                  data-ocid="execution.phase.tab"
                  onClick={() => setFilterStatus(s)}
                  className="font-mono text-[7px] uppercase px-2 py-0.5 transition-all"
                  style={{
                    color: filterStatus === s ? C.cyan : C.muted,
                    border: `1px solid ${filterStatus === s ? C.cyan : C.borderDim}`,
                    background:
                      filterStatus === s ? `${C.cyan}12` : "transparent",
                    borderRadius: 2,
                    cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {!hasRun ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div
                  className="font-mono text-[28px] mb-3"
                  style={{ color: C.borderDim }}
                >
                  ◯
                </div>
                <p
                  className="font-mono text-[9px] tracking-widest"
                  style={{ color: C.muted }}
                >
                  RUN ALL CHECKS to populate module status
                </p>
                <p
                  className="font-mono text-[8px] mt-1"
                  style={{ color: C.dim }}
                >
                  74 modules across 9 phases will be evaluated
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <table className="w-full border-collapse">
                <thead
                  className="sticky top-0"
                  style={{ background: "oklch(0.075 0.012 265)" }}
                >
                  <tr>
                    {[
                      "Module",
                      "Phase",
                      "Category",
                      "Status",
                      "Blocking",
                      "Recommendation",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-3 py-1.5 font-mono text-[7px] tracking-widest uppercase"
                        style={{
                          color: C.muted,
                          borderBottom: `1px solid ${C.borderDim}`,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredChecks.map((check, idx) => (
                    <tr
                      key={check.id}
                      data-ocid={`execution.module.item.${idx + 1}`}
                      style={{ borderBottom: `1px solid ${C.borderDim}` }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-3 py-2">
                        <div
                          className="font-mono text-[8px]"
                          style={{ color: C.text }}
                        >
                          {check.name}
                        </div>
                        <div
                          className="font-mono text-[7px] mt-0.5"
                          style={{ color: C.dim }}
                        >
                          {check.subsystem}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className="font-mono text-[8px]"
                          style={{ color: C.muted }}
                        >
                          P{check.phase}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className="font-mono text-[7px] uppercase"
                          style={{ color: C.dim }}
                        >
                          {check.category}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <StatusBadge status={check.status} />
                      </td>
                      <td className="px-3 py-2">
                        {check.blocking && (
                          <span
                            className="font-mono text-[7px]"
                            style={{ color: C.red }}
                          >
                            ▲ BLOCK
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className="font-mono text-[7px]"
                          style={{ color: C.dim }}
                        >
                          {check.recommendation}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RIGHT: Readiness Gate */}
        <div
          className="w-56 shrink-0 border-l flex flex-col overflow-y-auto"
          style={{ borderColor: C.border }}
          data-ocid="execution.gate.panel"
        >
          <div
            className="px-3 py-2 border-b shrink-0"
            style={{ borderColor: C.borderDim }}
          >
            <span
              className="font-mono text-[8px] tracking-widest uppercase"
              style={{ color: C.muted }}
            >
              READINESS GATE
            </span>
          </div>

          <div
            data-ocid="execution.readiness.panel"
            className="p-3 flex flex-col items-center gap-3"
          >
            {/* Verdict banner */}
            <div
              className="w-full py-2 text-center"
              style={{
                background:
                  verdict === "READY"
                    ? `${C.green}18`
                    : verdict === "BLOCKED"
                      ? `${C.red}18`
                      : `${C.muted}10`,
                border: `1px solid ${verdict === "READY" ? C.green : verdict === "BLOCKED" ? C.red : C.borderDim}`,
                borderRadius: 3,
                boxShadow:
                  verdict === "READY"
                    ? `0 0 12px ${C.green}44`
                    : verdict === "BLOCKED"
                      ? `0 0 12px ${C.red}44`
                      : "none",
              }}
            >
              <span
                className="font-mono text-[11px] tracking-widest font-bold"
                style={{
                  color:
                    verdict === "READY"
                      ? C.green
                      : verdict === "BLOCKED"
                        ? C.red
                        : C.muted,
                }}
              >
                {verdict ?? "— PENDING —"}
              </span>
            </div>

            <ScoreRing score={score} />

            {gate && (
              <>
                {/* Phase scores */}
                <div className="w-full">
                  <p
                    className="font-mono text-[7px] uppercase tracking-widest mb-1"
                    style={{ color: C.muted }}
                  >
                    Phase Scores
                  </p>
                  {Object.entries(gate.phaseScores).map(([phase, ps]) => (
                    <div key={phase} className="flex items-center gap-1.5 mb-1">
                      <span
                        className="font-mono text-[7px] w-8"
                        style={{ color: C.muted }}
                      >
                        {phase}
                      </span>
                      <div className="flex-1">
                        <ProgressBar
                          value={ps}
                          color={
                            ps === 1 ? C.green : ps >= 0.5 ? C.amber : C.red
                          }
                        />
                      </div>
                      <span
                        className="font-mono text-[7px] w-8 text-right"
                        style={{ color: C.muted }}
                      >
                        {Math.round(ps * 100)}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Blockers */}
                {gate.blockers.length > 0 && (
                  <div className="w-full">
                    <p
                      className="font-mono text-[7px] uppercase tracking-widest mb-1"
                      style={{ color: C.red }}
                    >
                      BLOCKERS ({gate.blockers.length})
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {gate.blockers.slice(0, 8).map((b) => (
                        <div
                          key={b}
                          className="font-mono text-[7px] px-1.5 py-0.5"
                          style={{
                            color: C.red,
                            background: `${C.red}12`,
                            borderRadius: 2,
                          }}
                        >
                          ▲ {b}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {gate.warnings.length > 0 && (
                  <div className="w-full">
                    <p
                      className="font-mono text-[7px] uppercase tracking-widest mb-1"
                      style={{ color: C.amber }}
                    >
                      WARNINGS ({gate.warnings.length})
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {gate.warnings.slice(0, 5).map((w) => (
                        <div
                          key={w}
                          className="font-mono text-[7px] px-1.5 py-0.5"
                          style={{
                            color: C.amber,
                            background: `${C.amber}12`,
                            borderRadius: 2,
                          }}
                        >
                          ⚠ {w}
                        </div>
                      ))}
                      {gate.warnings.length > 5 && (
                        <span
                          className="font-mono text-[7px]"
                          style={{ color: C.dim }}
                        >
                          +{gate.warnings.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Integration stats */}
            <div
              className="w-full border-t pt-2"
              style={{ borderColor: C.borderDim }}
            >
              <p
                className="font-mono text-[7px] uppercase tracking-widest mb-1"
                style={{ color: C.muted }}
              >
                INTEGRATION
              </p>
              <div className="flex justify-between mb-0.5">
                <span className="font-mono text-[7px]" style={{ color: C.dim }}>
                  Adapters
                </span>
                <span
                  className="font-mono text-[7px]"
                  style={{ color: C.cyan }}
                >
                  {adapterCount} REG
                </span>
              </div>
              <div className="flex justify-between mb-0.5">
                <span className="font-mono text-[7px]" style={{ color: C.dim }}>
                  Ingest total
                </span>
                <span
                  className="font-mono text-[7px]"
                  style={{ color: C.cyan }}
                >
                  {ingestStats.total} EVT
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-[7px]" style={{ color: C.dim }}>
                  Invalid
                </span>
                <span
                  className="font-mono text-[7px]"
                  style={{ color: ingestStats.invalid > 0 ? C.red : C.green }}
                >
                  {ingestStats.invalid}
                </span>
              </div>
            </div>

            {/* Phase 9 checklist */}
            <div
              className="w-full border-t pt-2"
              style={{ borderColor: C.borderDim }}
            >
              <p
                className="font-mono text-[7px] uppercase tracking-widest mb-1.5"
                style={{ color: C.muted }}
              >
                PHASE 9 GATE
              </p>
              {[
                "Runtime stable",
                "Regulation influences action",
                "Memory / Prediction / Learning active",
                "Sparse compute functioning",
                "Anti-fake passes",
                "APIs callable",
                "Integration contracts active",
                "External analytics ingest active",
                "Binding validation active",
                "No blocking failures",
                "Full Readiness = READY",
              ].map((item, i) => {
                const passed = gate
                  ? gate.blockers.length === 0 && gate.score > 0.5
                  : false;
                const itemPassed = passed || (gate && i < 4);
                return (
                  <div key={item} className="flex items-start gap-1.5 mb-0.5">
                    <span
                      style={{
                        color: itemPassed ? C.green : C.dim,
                        fontSize: 8,
                        marginTop: 1,
                      }}
                    >
                      {itemPassed ? "✓" : "□"}
                    </span>
                    <span
                      className="font-mono text-[7px] leading-tight"
                      style={{ color: itemPassed ? C.muted : C.dim }}
                    >
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reports panel */}
      <div
        className="shrink-0 border-t"
        style={{ borderColor: C.border, maxHeight: "220px" }}
      >
        <div
          className="flex items-center gap-0 border-b overflow-x-auto"
          style={{
            borderColor: C.borderDim,
            background: "oklch(0.07 0.012 265)",
          }}
        >
          {REPORT_TYPES.map((rt) => {
            const report = reports[rt.id];
            const active = activeReportTab === rt.id;
            return (
              <button
                key={rt.id}
                type="button"
                data-ocid="execution.phase.tab"
                onClick={() => setActiveReportTab(rt.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[8px] tracking-widest uppercase whitespace-nowrap transition-all shrink-0"
                style={{
                  color: active ? C.cyan : C.muted,
                  borderBottom: active
                    ? `2px solid ${C.cyan}`
                    : "2px solid transparent",
                  background: active ? `${C.cyan}08` : "transparent",
                  cursor: "pointer",
                }}
              >
                {rt.label}
                {report && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: STATUS_COLOR[report.status],
                      display: "inline-block",
                      boxShadow: `0 0 4px ${STATUS_COLOR[report.status]}`,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="overflow-y-auto p-3" style={{ maxHeight: "170px" }}>
          {(() => {
            const report = reports[activeReportTab];
            if (!report) {
              return (
                <div className="flex items-center justify-center h-16">
                  <span
                    className="font-mono text-[8px] tracking-widest"
                    style={{ color: C.dim }}
                  >
                    Generate reports to view. Click "GEN REPORTS" above.
                  </span>
                </div>
              );
            }
            return (
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="font-mono text-[10px] font-bold"
                      style={{ color: C.text }}
                    >
                      {report.title}
                    </span>
                    <StatusBadge status={report.status} />
                  </div>
                  <p
                    className="font-mono text-[8px] mb-1"
                    style={{ color: C.muted }}
                  >
                    Generated:{" "}
                    {new Date(report.generatedAt).toLocaleTimeString()}
                  </p>
                  <p
                    className="font-mono text-[8px]"
                    style={{ color: C.muted }}
                  >
                    Brain version: {report.brainVersion}
                  </p>
                </div>
                <div className="flex-1">
                  {report.sections.map((section) => (
                    <div key={section.title} className="mb-2">
                      <p
                        className="font-mono text-[8px] font-bold mb-1"
                        style={{ color: C.cyan }}
                      >
                        {section.title}
                      </p>
                      <p
                        className="font-mono text-[8px]"
                        style={{ color: C.muted }}
                      >
                        {section.content}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-1">
                        {Object.entries(section.metrics).map(([k, v]) => (
                          <div key={k}>
                            <span
                              className="font-mono text-[7px] uppercase"
                              style={{ color: C.dim }}
                            >
                              {k}:{" "}
                            </span>
                            <span
                              className="font-mono text-[7px]"
                              style={{ color: C.text }}
                            >
                              {String(v)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="shrink-0 text-center">
                  <p
                    className="font-mono text-[7px] uppercase mb-1"
                    style={{ color: C.muted }}
                  >
                    VERDICT
                  </p>
                  <div
                    className="px-3 py-2"
                    style={{
                      border: `1px solid ${STATUS_COLOR[report.status]}`,
                      color: STATUS_COLOR[report.status],
                      background: `${STATUS_COLOR[report.status]}14`,
                      borderRadius: 3,
                      fontFamily: "monospace",
                      fontSize: 11,
                      fontWeight: "bold",
                      letterSpacing: 2,
                    }}
                  >
                    {report.summary}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Verify Deploy Modal */}
      {showVerifyModal && verifyResult && (
        <VerifyDeployModal
          result={verifyResult}
          onClose={() => setShowVerifyModal(false)}
        />
      )}
    </div>
  );
}
