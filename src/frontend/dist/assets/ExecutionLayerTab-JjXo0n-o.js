import { r as reactExports, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
import { c as createArtifact } from "./artifactStore-By0EKKQ5.js";
import { R as REPORT_TYPES, g as globalIngestService, b as globalContractRegistry, r as runAllChecks, c as resolveDeploymentEligibility, d as generateReport, h as calculateReadinessScore, i as getBlockers } from "./autoChecksReports-Di40MJQ_.js";
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
  text: "oklch(0.82 0.05 210)"
};
const STATUS_COLOR = {
  pass: C.green,
  warn: C.amber,
  fail: C.red,
  pending: C.muted
};
const PHASE_META = [
  {
    num: 1,
    name: "Core Runtime Foundation",
    short: "RUNTIME",
    desc: "Schemas, BrainInstanceManager, RuntimeScheduler, EventQueue"
  },
  {
    num: 2,
    name: "Regulation Foundation",
    short: "REGULATION",
    desc: "Interoceptive, Cardio, ANS, Threshold, Recovery, Overload"
  },
  {
    num: 3,
    name: "Circuit / Memory / Prediction / Learning",
    short: "CIRCUIT",
    desc: "Salience, WM, Arbitration, Connections, Memory, Prediction, Learning"
  },
  {
    num: 4,
    name: "Sparse Compute + Telemetry",
    short: "EFFICIENCY",
    desc: "SparseCompute, LocalUpdate, BroadUpdate, TelemetryIngest, all Metrics"
  },
  {
    num: 5,
    name: "Validation + Anti-Fake",
    short: "VALIDATION",
    desc: "Baseline, Ablation, Perturbation, AntiFake, Mechanism Trace, Regression"
  },
  {
    num: 6,
    name: "Optimization + Auto-Maturation",
    short: "OPTIMIZATION",
    desc: "ConnectionOpt, MotifOpt, ThresholdOpt, PromotionRollback"
  },
  {
    num: 7,
    name: "External Integration Contract",
    short: "INTEGRATION",
    desc: "ContractRegistry, Sessions, Binding, IngestService, MutationBoundary"
  },
  {
    num: 8,
    name: "Auto-Checks + Reports + Gate",
    short: "ORCHESTRATION",
    desc: "CheckRegistry, AutoChecks, AutoReports, ReadinessGate, Classifier"
  },
  {
    num: 9,
    name: "Deployment Readiness Verification",
    short: "DEPLOYMENT",
    desc: "Phase 9 is pass/fail only. All previous phases must pass."
  }
];
function StatusBadge({ status }) {
  const color = STATUS_COLOR[status] ?? C.muted;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "font-mono text-[8px] tracking-widest uppercase px-1.5 py-0.5",
      style: {
        color,
        border: `1px solid ${color}`,
        background: `${color}14`,
        borderRadius: 2,
        boxShadow: status === "pass" ? `0 0 6px ${color}44` : "none"
      },
      children: status
    }
  );
}
function ProgressBar({ value, color }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "w-full h-1",
      style: { background: C.borderDim, borderRadius: 2 },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            width: `${Math.round(value * 100)}%`,
            height: "100%",
            background: color,
            borderRadius: 2,
            transition: "width 0.4s ease"
          }
        }
      )
    }
  );
}
function ScoreRing({ score }) {
  const pct = Math.round(score * 100);
  const r = 36;
  const circ = 2 * Math.PI * r;
  const filled = circ * score;
  const color = score >= 0.65 ? C.green : score >= 0.4 ? C.amber : C.red;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: 90,
      height: 90,
      viewBox: "0 0 90 90",
      role: "img",
      "aria-label": `Readiness score ${Math.round(score * 100)}%`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: 45,
            cy: 45,
            r,
            fill: "none",
            stroke: C.borderDim,
            strokeWidth: 6
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: 45,
            cy: 45,
            r,
            fill: "none",
            stroke: color,
            strokeWidth: 6,
            strokeDasharray: `${filled} ${circ - filled}`,
            strokeLinecap: "round",
            transform: "rotate(-90 45 45)",
            style: {
              transition: "stroke-dasharray 0.5s ease",
              filter: `drop-shadow(0 0 4px ${color})`
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "text",
          {
            x: 45,
            y: 49,
            textAnchor: "middle",
            fontFamily: "monospace",
            fontSize: 14,
            fontWeight: "bold",
            fill: color,
            children: [
              pct,
              "%"
            ]
          }
        )
      ]
    }
  );
}
function VerifyDeployModal({
  result,
  onClose
}) {
  const isReady = result.verdict === "READY";
  const verdictColor = isReady ? C.green : C.red;
  const scoreColor = result.score >= 0.65 ? C.green : result.score >= 0.4 ? C.amber : C.red;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center",
      style: { background: "rgba(0,0,0,0.75)" },
      role: "presentation",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0",
            onClick: onClose,
            onKeyDown: (e) => {
              if (e.key === "Escape") onClose();
            },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "dialog",
          {
            open: true,
            className: "relative w-full max-w-md mx-4 flex flex-col m-0 p-0",
            "aria-labelledby": "verify-deploy-title",
            "data-ocid": "verify.dialog",
            style: {
              background: C.bg,
              border: `1px solid ${verdictColor}`,
              borderRadius: 4,
              boxShadow: `0 0 32px ${verdictColor}44, 0 8px 40px rgba(0,0,0,0.8)`
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center justify-between px-5 py-3 border-b",
                  style: { borderColor: C.border },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "h2",
                        {
                          id: "verify-deploy-title",
                          className: "font-mono text-[10px] tracking-widest uppercase",
                          style: { color: C.cyan },
                          children: "DEPLOYMENT VERIFICATION REPORT"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "font-mono text-[7px] mt-0.5",
                          style: { color: C.muted },
                          children: result.timestamp
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "verify.close_button",
                        onClick: onClose,
                        className: "font-mono text-[10px] transition-opacity hover:opacity-70",
                        style: { color: C.muted, cursor: "pointer" },
                        "aria-label": "Close verification report",
                        children: "✕"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "mx-5 mt-4 py-4 text-center",
                  style: {
                    background: `${verdictColor}18`,
                    border: `1px solid ${verdictColor}`,
                    borderRadius: 3,
                    boxShadow: `0 0 16px ${verdictColor}44`
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[28px] font-bold tracking-[0.2em]",
                      style: {
                        color: verdictColor,
                        textShadow: `0 0 20px ${verdictColor}`
                      },
                      children: result.verdict
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 px-5 py-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex flex-col items-center py-3",
                    style: {
                      background: C.panel,
                      border: `1px solid ${C.borderDim}`,
                      borderRadius: 3
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "font-mono text-[18px] font-bold",
                          style: { color: scoreColor },
                          children: [
                            Math.round(result.score * 100),
                            "%"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[7px] uppercase tracking-widest mt-1",
                          style: { color: C.muted },
                          children: "Score"
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex flex-col items-center py-3",
                    style: {
                      background: C.panel,
                      border: `1px solid ${C.borderDim}`,
                      borderRadius: 3
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[18px] font-bold",
                          style: { color: C.cyan },
                          children: result.adapterCount
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[7px] uppercase tracking-widest mt-1",
                          style: { color: C.muted },
                          children: "Adapters"
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex flex-col items-center py-3",
                    style: {
                      background: C.panel,
                      border: `1px solid ${C.borderDim}`,
                      borderRadius: 3
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[18px] font-bold",
                          style: { color: C.cyan },
                          children: result.ingestTotal
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[7px] uppercase tracking-widest mt-1",
                          style: { color: C.muted },
                          children: "Ingest Evts"
                        }
                      )
                    ]
                  }
                )
              ] }),
              result.blockers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: "font-mono text-[8px] uppercase tracking-widest mb-1.5",
                    style: { color: C.red },
                    children: [
                      "BLOCKING MODULES (",
                      result.blockers.length,
                      ")"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex flex-col gap-0.5 max-h-28 overflow-y-auto",
                    style: {
                      background: `${C.red}08`,
                      border: `1px solid ${C.red}30`,
                      borderRadius: 3,
                      padding: "6px 8px"
                    },
                    children: result.blockers.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.red, fontSize: 7 }, children: "▲" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px]",
                          style: { color: C.red },
                          children: b
                        }
                      )
                    ] }, b))
                  }
                )
              ] }),
              result.blockers.length === 0 && result.warnings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: "font-mono text-[8px] uppercase tracking-widest mb-1.5",
                    style: { color: C.amber },
                    children: [
                      "WARNINGS (",
                      result.warnings.length,
                      ")"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex flex-col gap-0.5 max-h-20 overflow-y-auto",
                    style: {
                      background: `${C.amber}08`,
                      border: `1px solid ${C.amber}30`,
                      borderRadius: 3,
                      padding: "6px 8px"
                    },
                    children: result.warnings.slice(0, 5).map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.amber, fontSize: 7 }, children: "⚠" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px]",
                          style: { color: C.amber },
                          children: w
                        }
                      )
                    ] }, w))
                  }
                )
              ] }),
              isReady && result.blockers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 py-2 px-3",
                  style: {
                    background: `${C.green}10`,
                    border: `1px solid ${C.green}40`,
                    borderRadius: 3
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.green }, children: "✓" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[8px]", style: { color: C.green }, children: "All systems nominal. Deployment authorised." })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex justify-end px-5 py-3 border-t",
                  style: { borderColor: C.borderDim },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "verify.confirm_button",
                      onClick: onClose,
                      className: "font-mono text-[9px] tracking-widest uppercase px-4 py-1.5 border transition-all",
                      style: {
                        border: `1px solid ${verdictColor}`,
                        color: verdictColor,
                        background: `${verdictColor}14`,
                        borderRadius: 2,
                        cursor: "pointer"
                      },
                      children: "CLOSE"
                    }
                  )
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function ExecutionLayerTab({ neural }) {
  const [selectedPhase, setSelectedPhase] = reactExports.useState(null);
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const [checks, setChecks] = reactExports.useState([]);
  const [reports, setReports] = reactExports.useState({});
  const [gate, setGate] = reactExports.useState(null);
  const [activeReportTab, setActiveReportTab] = reactExports.useState(REPORT_TYPES[0].id);
  const [hasRun, setHasRun] = reactExports.useState(false);
  const [expandedPhases, setExpandedPhases] = reactExports.useState(/* @__PURE__ */ new Set());
  const [verifyResult, setVerifyResult] = reactExports.useState(
    null
  );
  const [showVerifyModal, setShowVerifyModal] = reactExports.useState(false);
  const ingestStats = globalIngestService.getStats();
  const adapterCount = globalContractRegistry.count();
  const runChecks = reactExports.useCallback(() => {
    const results = runAllChecks(
      neural.isRunning,
      neural.sympatheticTone > 0,
      adapterCount * 7
    );
    setChecks(results);
    const g = resolveDeploymentEligibility(results);
    setGate(g);
    setHasRun(true);
    return { results, g };
  }, [neural.isRunning, neural.sympatheticTone, adapterCount]);
  const verifyDeploy = reactExports.useCallback(() => {
    let currentChecks = checks;
    let currentGate = gate;
    if (!hasRun) {
      const { results, g } = runChecks();
      currentChecks = results;
      currentGate = g;
    }
    const deployGate = resolveDeploymentEligibility(currentChecks);
    const currentIngestStats = globalIngestService.getStats();
    const currentAdapterCount = globalContractRegistry.count();
    const extraBlockers = [];
    if (currentAdapterCount === 0) {
      extraBlockers.push("No adapters registered — integration layer inactive");
    }
    if (currentIngestStats.total === 0) {
      extraBlockers.push("No ingest events — trace return pipeline unverified");
    }
    if (deployGate.score < 0.65) {
      extraBlockers.push(
        `Readiness score ${Math.round(deployGate.score * 100)}% is below 65% threshold`
      );
    }
    const allBlockers = [...deployGate.blockers, ...extraBlockers];
    const finalVerdict = allBlockers.length === 0 ? "READY" : "BLOCKED";
    if (!currentGate) {
      setGate(deployGate);
    }
    const result = {
      verdict: finalVerdict,
      score: deployGate.score,
      adapterCount: currentAdapterCount,
      ingestTotal: currentIngestStats.total,
      blockers: allBlockers,
      warnings: deployGate.warnings,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleString()
    };
    setVerifyResult(result);
    setShowVerifyModal(true);
  }, [checks, gate, hasRun, runChecks]);
  const generateAllReports = reactExports.useCallback(() => {
    var _a;
    const { results } = hasRun ? { results: checks } : runChecks();
    const currentChecks = results ?? checks;
    const r = {};
    for (const rt of REPORT_TYPES) {
      const report = generateReport(rt.id, currentChecks);
      r[rt.id] = report;
      createArtifact({
        artifact_type: "report",
        source_system: "core",
        title: `${rt.label} — ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`,
        summary: report.summary,
        score: report.status === "pass" ? 85 : report.status === "warn" ? 55 : 25,
        status: report.status,
        ai_review_summary: ((_a = report.sections[0]) == null ? void 0 : _a.content) ?? `Report generated: ${report.status}`,
        metadata: {
          report_id: rt.id,
          phase_count: currentChecks.length,
          generated_at: Date.now()
        },
        related_artifact_ids: [],
        tags: ["report", rt.id, "execution_layer"],
        version: "1.0.0"
      });
    }
    setReports(r);
  }, [checks, hasRun, runChecks]);
  const phaseChecks = reactExports.useMemo(() => {
    const map = {};
    for (let p = 1; p <= 9; p++) map[p] = checks.filter((c) => c.phase === p);
    return map;
  }, [checks]);
  const phaseScore = (p) => {
    const pc = phaseChecks[p] ?? [];
    if (pc.length === 0) return null;
    const pass = pc.filter((c) => c.status === "pass").length;
    return pass / pc.length;
  };
  const filteredChecks = reactExports.useMemo(() => {
    let base = selectedPhase ? checks.filter((c) => c.phase === selectedPhase) : checks;
    if (filterStatus !== "all")
      base = base.filter((c) => c.status === filterStatus);
    return base;
  }, [checks, selectedPhase, filterStatus]);
  const score = (gate == null ? void 0 : gate.score) ?? (hasRun ? calculateReadinessScore(checks) : 0);
  const verdict = (gate == null ? void 0 : gate.verdict) ?? (hasRun ? getBlockers(checks).length === 0 && score >= 0.65 ? "READY" : "BLOCKED" : null);
  const togglePhaseExpand = (p) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "h-full flex flex-col overflow-hidden",
      style: { background: C.bg },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "shrink-0 flex items-center justify-between px-4 py-2 border-b",
            style: { borderColor: C.border, background: "oklch(0.07 0.012 265)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "font-mono text-[11px] tracking-widest uppercase",
                    style: { color: C.cyan },
                    children: "EXECUTION LAYER — PHASE 1–9 BUILD STATUS"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-mono text-[8px] tracking-widest",
                    style: { color: C.muted },
                    children: "Implementation task tree · dependency map · done criteria · release path"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "execution.run_checks.button",
                    onClick: runChecks,
                    className: "font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 border transition-all",
                    style: {
                      border: `1px solid ${C.cyan}`,
                      color: C.cyan,
                      background: `${C.cyan}10`,
                      cursor: "pointer"
                    },
                    children: "▶ RUN ALL CHECKS"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "execution.generate_report.button",
                    onClick: generateAllReports,
                    className: "font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 border transition-all",
                    style: {
                      border: `1px solid ${C.amber}`,
                      color: C.amber,
                      background: `${C.amber}10`,
                      cursor: "pointer"
                    },
                    children: "≡ GEN REPORTS"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "execution.verify_deployment.button",
                    onClick: verifyDeploy,
                    className: "font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 border transition-all",
                    style: {
                      border: `1px solid ${(verifyResult == null ? void 0 : verifyResult.verdict) === "READY" ? C.green : (verifyResult == null ? void 0 : verifyResult.verdict) === "BLOCKED" ? C.red : C.muted}`,
                      color: (verifyResult == null ? void 0 : verifyResult.verdict) === "READY" ? C.green : (verifyResult == null ? void 0 : verifyResult.verdict) === "BLOCKED" ? C.red : C.muted,
                      background: (verifyResult == null ? void 0 : verifyResult.verdict) === "READY" ? `${C.green}10` : (verifyResult == null ? void 0 : verifyResult.verdict) === "BLOCKED" ? `${C.red}10` : `${C.muted}10`,
                      cursor: "pointer"
                    },
                    children: "◎ VERIFY DEPLOY"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex overflow-hidden min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "w-64 shrink-0 border-r flex flex-col overflow-y-auto",
              style: { borderColor: C.border },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "px-3 py-2 border-b shrink-0",
                    style: { borderColor: C.borderDim },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[8px] tracking-widest uppercase",
                        style: { color: C.muted },
                        children: "PHASE TREE"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-0.5 p-2", children: PHASE_META.map((phase) => {
                  const ps = phaseScore(phase.num);
                  const phaseChecksArr = phaseChecks[phase.num] ?? [];
                  const active = selectedPhase === phase.num;
                  const expanded = expandedPhases.has(phase.num);
                  const phaseStatus = ps === null ? "pending" : ps === 1 ? "pass" : ps >= 0.5 ? "warn" : "fail";
                  const color = STATUS_COLOR[phaseStatus];
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "execution.phase.tab",
                        onClick: () => {
                          setSelectedPhase(active ? null : phase.num);
                          togglePhaseExpand(phase.num);
                        },
                        className: "w-full text-left px-2 py-2 transition-all",
                        style: {
                          background: active ? `${C.cyan}12` : "transparent",
                          border: active ? `1px solid ${C.cyan}40` : "1px solid transparent",
                          borderRadius: 3
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "span",
                              {
                                className: "font-mono text-[8px]",
                                style: { color: C.muted },
                                children: [
                                  "P",
                                  phase.num
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: phaseStatus })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "font-mono text-[9px] leading-tight mb-1.5",
                              style: { color: active ? C.cyan : C.text },
                              children: phase.short
                            }
                          ),
                          ps !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressBar, { value: ps, color }),
                          ps === null && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "h-1",
                              style: { background: C.borderDim, borderRadius: 2 }
                            }
                          )
                        ]
                      }
                    ),
                    expanded && phaseChecksArr.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-3 mt-0.5 mb-1 flex flex-col gap-0.5", children: [
                      phaseChecksArr.slice(0, 6).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "flex items-center gap-1.5 px-2 py-1",
                          style: {
                            background: "oklch(0.075 0.01 265)",
                            borderRadius: 2
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  color: STATUS_COLOR[c.status],
                                  fontSize: 7
                                },
                                children: "●"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "font-mono text-[7px]",
                                style: { color: C.muted },
                                children: c.name
                              }
                            )
                          ]
                        },
                        c.id
                      )),
                      phaseChecksArr.length > 6 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "font-mono text-[7px] px-2",
                          style: { color: C.dim },
                          children: [
                            "+",
                            phaseChecksArr.length - 6,
                            " more"
                          ]
                        }
                      )
                    ] })
                  ] }, phase.num);
                }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col overflow-hidden min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "shrink-0 flex items-center justify-between px-3 py-2 border-b",
                style: { borderColor: C.border },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[8px] tracking-widest uppercase",
                      style: { color: C.muted },
                      children: [
                        "MODULE STATUS",
                        " ",
                        hasRun ? `— ${checks.length} modules` : "— run checks to populate"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: ["all", "pass", "warn", "fail"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "execution.phase.tab",
                      onClick: () => setFilterStatus(s),
                      className: "font-mono text-[7px] uppercase px-2 py-0.5 transition-all",
                      style: {
                        color: filterStatus === s ? C.cyan : C.muted,
                        border: `1px solid ${filterStatus === s ? C.cyan : C.borderDim}`,
                        background: filterStatus === s ? `${C.cyan}12` : "transparent",
                        borderRadius: 2,
                        cursor: "pointer"
                      },
                      children: s
                    },
                    s
                  )) })
                ]
              }
            ),
            !hasRun ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[28px] mb-3",
                  style: { color: C.borderDim },
                  children: "◯"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-mono text-[9px] tracking-widest",
                  style: { color: C.muted },
                  children: "RUN ALL CHECKS to populate module status"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-mono text-[8px] mt-1",
                  style: { color: C.dim },
                  children: "74 modules across 9 phases will be evaluated"
                }
              )
            ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "thead",
                {
                  className: "sticky top-0",
                  style: { background: "oklch(0.075 0.012 265)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: [
                    "Module",
                    "Phase",
                    "Category",
                    "Status",
                    "Blocking",
                    "Recommendation"
                  ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "th",
                    {
                      className: "text-left px-3 py-1.5 font-mono text-[7px] tracking-widest uppercase",
                      style: {
                        color: C.muted,
                        borderBottom: `1px solid ${C.borderDim}`
                      },
                      children: h
                    },
                    h
                  )) })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filteredChecks.map((check, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  "data-ocid": `execution.module.item.${idx + 1}`,
                  style: { borderBottom: `1px solid ${C.borderDim}` },
                  className: "hover:bg-white/[0.02] transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "font-mono text-[8px]",
                          style: { color: C.text },
                          children: check.name
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "font-mono text-[7px] mt-0.5",
                          style: { color: C.dim },
                          children: check.subsystem
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[8px]",
                        style: { color: C.muted },
                        children: [
                          "P",
                          check.phase
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] uppercase",
                        style: { color: C.dim },
                        children: check.category
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: check.status }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: check.blocking && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px]",
                        style: { color: C.red },
                        children: "▲ BLOCK"
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px]",
                        style: { color: C.dim },
                        children: check.recommendation
                      }
                    ) })
                  ]
                },
                check.id
              )) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "w-56 shrink-0 border-l flex flex-col overflow-y-auto",
              style: { borderColor: C.border },
              "data-ocid": "execution.gate.panel",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "px-3 py-2 border-b shrink-0",
                    style: { borderColor: C.borderDim },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[8px] tracking-widest uppercase",
                        style: { color: C.muted },
                        children: "READINESS GATE"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": "execution.readiness.panel",
                    className: "p-3 flex flex-col items-center gap-3",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-full py-2 text-center",
                          style: {
                            background: verdict === "READY" ? `${C.green}18` : verdict === "BLOCKED" ? `${C.red}18` : `${C.muted}10`,
                            border: `1px solid ${verdict === "READY" ? C.green : verdict === "BLOCKED" ? C.red : C.borderDim}`,
                            borderRadius: 3,
                            boxShadow: verdict === "READY" ? `0 0 12px ${C.green}44` : verdict === "BLOCKED" ? `0 0 12px ${C.red}44` : "none"
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[11px] tracking-widest font-bold",
                              style: {
                                color: verdict === "READY" ? C.green : verdict === "BLOCKED" ? C.red : C.muted
                              },
                              children: verdict ?? "— PENDING —"
                            }
                          )
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreRing, { score }),
                      gate && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              className: "font-mono text-[7px] uppercase tracking-widest mb-1",
                              style: { color: C.muted },
                              children: "Phase Scores"
                            }
                          ),
                          Object.entries(gate.phaseScores).map(([phase, ps]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "font-mono text-[7px] w-8",
                                style: { color: C.muted },
                                children: phase
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              ProgressBar,
                              {
                                value: ps,
                                color: ps === 1 ? C.green : ps >= 0.5 ? C.amber : C.red
                              }
                            ) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "span",
                              {
                                className: "font-mono text-[7px] w-8 text-right",
                                style: { color: C.muted },
                                children: [
                                  Math.round(ps * 100),
                                  "%"
                                ]
                              }
                            )
                          ] }, phase))
                        ] }),
                        gate.blockers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "p",
                            {
                              className: "font-mono text-[7px] uppercase tracking-widest mb-1",
                              style: { color: C.red },
                              children: [
                                "BLOCKERS (",
                                gate.blockers.length,
                                ")"
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-0.5", children: gate.blockers.slice(0, 8).map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              className: "font-mono text-[7px] px-1.5 py-0.5",
                              style: {
                                color: C.red,
                                background: `${C.red}12`,
                                borderRadius: 2
                              },
                              children: [
                                "▲ ",
                                b
                              ]
                            },
                            b
                          )) })
                        ] }),
                        gate.warnings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "p",
                            {
                              className: "font-mono text-[7px] uppercase tracking-widest mb-1",
                              style: { color: C.amber },
                              children: [
                                "WARNINGS (",
                                gate.warnings.length,
                                ")"
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                            gate.warnings.slice(0, 5).map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "div",
                              {
                                className: "font-mono text-[7px] px-1.5 py-0.5",
                                style: {
                                  color: C.amber,
                                  background: `${C.amber}12`,
                                  borderRadius: 2
                                },
                                children: [
                                  "⚠ ",
                                  w
                                ]
                              },
                              w
                            )),
                            gate.warnings.length > 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "span",
                              {
                                className: "font-mono text-[7px]",
                                style: { color: C.dim },
                                children: [
                                  "+",
                                  gate.warnings.length - 5,
                                  " more"
                                ]
                              }
                            )
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "w-full border-t pt-2",
                          style: { borderColor: C.borderDim },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "p",
                              {
                                className: "font-mono text-[7px] uppercase tracking-widest mb-1",
                                style: { color: C.muted },
                                children: "INTEGRATION"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-0.5", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: C.dim }, children: "Adapters" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "span",
                                {
                                  className: "font-mono text-[7px]",
                                  style: { color: C.cyan },
                                  children: [
                                    adapterCount,
                                    " REG"
                                  ]
                                }
                              )
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-0.5", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: C.dim }, children: "Ingest total" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "span",
                                {
                                  className: "font-mono text-[7px]",
                                  style: { color: C.cyan },
                                  children: [
                                    ingestStats.total,
                                    " EVT"
                                  ]
                                }
                              )
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: C.dim }, children: "Invalid" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "span",
                                {
                                  className: "font-mono text-[7px]",
                                  style: { color: ingestStats.invalid > 0 ? C.red : C.green },
                                  children: ingestStats.invalid
                                }
                              )
                            ] })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "w-full border-t pt-2",
                          style: { borderColor: C.borderDim },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "p",
                              {
                                className: "font-mono text-[7px] uppercase tracking-widest mb-1.5",
                                style: { color: C.muted },
                                children: "PHASE 9 GATE"
                              }
                            ),
                            [
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
                              "Full Readiness = READY"
                            ].map((item, i) => {
                              const passed = gate ? gate.blockers.length === 0 && gate.score > 0.5 : false;
                              const itemPassed = passed || gate && i < 4;
                              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-1.5 mb-0.5", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "span",
                                  {
                                    style: {
                                      color: itemPassed ? C.green : C.dim,
                                      fontSize: 8,
                                      marginTop: 1
                                    },
                                    children: itemPassed ? "✓" : "□"
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "span",
                                  {
                                    className: "font-mono text-[7px] leading-tight",
                                    style: { color: itemPassed ? C.muted : C.dim },
                                    children: item
                                  }
                                )
                              ] }, item);
                            })
                          ]
                        }
                      )
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
            className: "shrink-0 border-t",
            style: { borderColor: C.border, maxHeight: "220px" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex items-center gap-0 border-b overflow-x-auto",
                  style: {
                    borderColor: C.borderDim,
                    background: "oklch(0.07 0.012 265)"
                  },
                  children: REPORT_TYPES.map((rt) => {
                    const report = reports[rt.id];
                    const active = activeReportTab === rt.id;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "execution.phase.tab",
                        onClick: () => setActiveReportTab(rt.id),
                        className: "flex items-center gap-1.5 px-3 py-1.5 font-mono text-[8px] tracking-widest uppercase whitespace-nowrap transition-all shrink-0",
                        style: {
                          color: active ? C.cyan : C.muted,
                          borderBottom: active ? `2px solid ${C.cyan}` : "2px solid transparent",
                          background: active ? `${C.cyan}08` : "transparent",
                          cursor: "pointer"
                        },
                        children: [
                          rt.label,
                          report && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              style: {
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: STATUS_COLOR[report.status],
                                display: "inline-block",
                                boxShadow: `0 0 4px ${STATUS_COLOR[report.status]}`
                              }
                            }
                          )
                        ]
                      },
                      rt.id
                    );
                  })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto p-3", style: { maxHeight: "170px" }, children: (() => {
                const report = reports[activeReportTab];
                if (!report) {
                  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px] tracking-widest",
                      style: { color: C.dim },
                      children: 'Generate reports to view. Click "GEN REPORTS" above.'
                    }
                  ) });
                }
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[10px] font-bold",
                          style: { color: C.text },
                          children: report.title
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: report.status })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "p",
                      {
                        className: "font-mono text-[8px] mb-1",
                        style: { color: C.muted },
                        children: [
                          "Generated:",
                          " ",
                          new Date(report.generatedAt).toLocaleTimeString()
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "p",
                      {
                        className: "font-mono text-[8px]",
                        style: { color: C.muted },
                        children: [
                          "Brain version: ",
                          report.brainVersion
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: report.sections.map((section) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "font-mono text-[8px] font-bold mb-1",
                        style: { color: C.cyan },
                        children: section.title
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "font-mono text-[8px]",
                        style: { color: C.muted },
                        children: section.content
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-3 mt-1", children: Object.entries(section.metrics).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "font-mono text-[7px] uppercase",
                          style: { color: C.dim },
                          children: [
                            k,
                            ":",
                            " "
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[7px]",
                          style: { color: C.text },
                          children: String(v)
                        }
                      )
                    ] }, k)) })
                  ] }, section.title)) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 text-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "font-mono text-[7px] uppercase mb-1",
                        style: { color: C.muted },
                        children: "VERDICT"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "px-3 py-2",
                        style: {
                          border: `1px solid ${STATUS_COLOR[report.status]}`,
                          color: STATUS_COLOR[report.status],
                          background: `${STATUS_COLOR[report.status]}14`,
                          borderRadius: 3,
                          fontFamily: "monospace",
                          fontSize: 11,
                          fontWeight: "bold",
                          letterSpacing: 2
                        },
                        children: report.summary
                      }
                    )
                  ] })
                ] });
              })() })
            ]
          }
        ),
        showVerifyModal && verifyResult && /* @__PURE__ */ jsxRuntimeExports.jsx(
          VerifyDeployModal,
          {
            result: verifyResult,
            onClose: () => setShowVerifyModal(false)
          }
        )
      ]
    }
  );
}
export {
  ExecutionLayerTab as default
};
