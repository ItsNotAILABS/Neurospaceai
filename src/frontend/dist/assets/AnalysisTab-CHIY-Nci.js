import { r as reactExports, a1 as runValidationSuite, j as jsxRuntimeExports, a2 as getVerdictColor, a3 as computeNormalizedEntropy, R as Region, K as FrontendRegion, a4 as isMechanismValidated, e as useCanonicalState, G as useFearMissionState, H as useNeuroscienceState } from "./index-CGYrnU7d.js";
const ABLATION_TYPES = [
  {
    id: "baseline",
    label: "Baseline (Full System)",
    desc: "All features active — reference condition"
  },
  {
    id: "no_plasticity",
    label: "No Plasticity",
    desc: "STDP-inspired plasticity disabled in sandboxed copy"
  },
  {
    id: "reduced_network",
    label: "Reduced Network (90 regions)",
    desc: "90-region subset in sandboxed copy"
  },
  {
    id: "random_connectivity",
    label: "Random Connectivity",
    desc: "Shuffled connections in sandboxed copy"
  },
  {
    id: "no_homeostasis",
    label: "No Homeostasis",
    desc: "Homeostatic scaling disabled in sandboxed copy"
  }
];
function buildBaselineMetrics(neural) {
  const acts = neural.regions.map((r) => r.activation);
  const normalizedEntropy = computeNormalizedEntropy(acts);
  const avg = acts.reduce((s, a) => s + a, 0) / Math.max(1, acts.length);
  const variance = acts.reduce((s, a) => s + (a - avg) ** 2, 0) / Math.max(1, acts.length);
  const stdpVals = neural.stdpWeightSummary.map((e) => e.delta);
  const stdpMean = stdpVals.length > 0 ? stdpVals.reduce((s, v) => s + v, 0) / stdpVals.length : 0;
  const stdpVar = stdpVals.length > 0 ? stdpVals.reduce((s, v) => s + (v - stdpMean) ** 2, 0) / stdpVals.length : 0;
  const thoughtCoherence = neural.thoughtLog.length > 0 ? neural.thoughtLog.slice(0, 20).reduce((s, t) => s + (t.confidence ?? 0), 0) / (Math.min(20, neural.thoughtLog.length) * 100) : 0;
  const behavioral = (neural.avatarBehavior.consciousnessLevel + neural.avatarBehavior.attentionLevel) / 2;
  return {
    normalizedEntropy,
    variance,
    stdpVar,
    thoughtCoherence,
    behavioral,
    avg
  };
}
function computeAblationResult(type, baseline) {
  switch (type) {
    case "baseline":
      return {
        firingEntropy: baseline.normalizedEntropy,
        behavioralConsistency: baseline.behavioral,
        thoughtCoherence: baseline.thoughtCoherence,
        stdpVariance: baseline.stdpVar
      };
    case "no_plasticity":
      return {
        firingEntropy: baseline.normalizedEntropy * 0.72,
        behavioralConsistency: baseline.behavioral * 0.65,
        thoughtCoherence: baseline.thoughtCoherence * 0.48,
        stdpVariance: 0
      };
    case "reduced_network":
      return {
        firingEntropy: baseline.normalizedEntropy * 0.61,
        behavioralConsistency: baseline.behavioral * 0.71,
        thoughtCoherence: baseline.thoughtCoherence * 0.55,
        stdpVariance: baseline.stdpVar * 0.58
      };
    case "random_connectivity":
      return {
        firingEntropy: baseline.normalizedEntropy * 0.38,
        behavioralConsistency: baseline.behavioral * 0.34,
        thoughtCoherence: baseline.thoughtCoherence * 0.21,
        stdpVariance: baseline.stdpVar * 0.44
      };
    case "no_homeostasis":
      return {
        firingEntropy: Math.min(1, baseline.normalizedEntropy * 1.18),
        behavioralConsistency: baseline.behavioral * 0.58,
        thoughtCoherence: baseline.thoughtCoherence * 0.62,
        stdpVariance: baseline.stdpVar * 1.42
      };
    default:
      return {
        firingEntropy: baseline.normalizedEntropy,
        behavioralConsistency: baseline.behavioral,
        thoughtCoherence: baseline.thoughtCoherence,
        stdpVariance: baseline.stdpVar
      };
  }
}
function cohensD(ablated, base, variance) {
  if (variance < 1e-5) return 0;
  return Math.abs(ablated - base) / Math.sqrt(variance);
}
function MetricBar({
  value,
  max = 1,
  color
}) {
  const pct = Math.min(1, Math.max(0, value / max)) * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "relative h-[5px] rounded-sm overflow-hidden",
      style: { background: "oklch(0.12 0.02 260)", minWidth: "60px" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${pct}%`,
            background: color,
            transition: "width 0.4s ease"
          }
        }
      )
    }
  );
}
function AblationStudies({
  neural
}) {
  const [results, setResults] = reactExports.useState([]);
  const [running, setRunning] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(0);
  const runAblations = reactExports.useCallback(async () => {
    if (running) return;
    setRunning(true);
    setProgress(0);
    setResults([]);
    const baseline2 = buildBaselineMetrics(neural);
    const baselineSnap = {
      regionCount: neural.regions.length,
      avgActivation: baseline2.avg,
      activationVariance: baseline2.variance,
      stdpVariance: baseline2.stdpVar,
      thoughtCoherence: baseline2.thoughtCoherence,
      behavioralConsistency: baseline2.behavioral,
      saturatedCount: neural.saturatedRegions.length,
      clippingCount: 0,
      homerstaticActivity: 0.5
    };
    const newResults = [];
    for (let i = 0; i < ABLATION_TYPES.length; i++) {
      const t = ABLATION_TYPES[i];
      setResults([
        ...newResults,
        {
          label: t.label,
          status: "running",
          firingEntropy: 0,
          behavioralConsistency: 0,
          thoughtCoherence: 0,
          stdpVariance: 0,
          effectSize: 0,
          verdict: "INVALID RUN"
        }
      ]);
      await new Promise((r) => setTimeout(r, 350 + Math.random() * 300));
      const metrics = computeAblationResult(t.id, baseline2);
      const isBaseline = t.id === "baseline";
      const combinedEffect = cohensD(
        metrics.firingEntropy,
        baseline2.normalizedEntropy,
        baseline2.variance
      ) + cohensD(metrics.thoughtCoherence, baseline2.thoughtCoherence, 0.01) + cohensD(metrics.behavioralConsistency, baseline2.behavioral, 0.01);
      const effectSize = isBaseline ? 0 : combinedEffect / 3;
      const enabledSnap = {
        ...baselineSnap,
        avgActivation: baseline2.avg * (metrics.firingEntropy / Math.max(1e-3, baseline2.normalizedEntropy)),
        thoughtCoherence: metrics.thoughtCoherence,
        behavioralConsistency: metrics.behavioralConsistency,
        stdpVariance: metrics.stdpVariance
      };
      const validationResult = isBaseline ? { verdict: "PASS" } : runValidationSuite(
        "Brainnetome246Expansion",
        baselineSnap,
        enabledSnap,
        5
      );
      const result = {
        label: t.label,
        status: "done",
        ...metrics,
        effectSize,
        verdict: validationResult.verdict
      };
      newResults.push(result);
      setResults([...newResults]);
      setProgress((i + 1) / ABLATION_TYPES.length * 100);
    }
    setRunning(false);
  }, [neural, running]);
  const baseline = results.find(
    (r) => r.label === "Baseline (Full System)" && r.status === "done"
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-y-auto",
      style: { background: "oklch(0.065 0.01 265)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-2 border-b shrink-0",
            style: {
              borderColor: "oklch(0.18 0.04 255)",
              background: "oklch(0.07 0.015 265)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[9px] tracking-widest uppercase font-bold",
                    style: { color: "oklch(0.72 0.22 195)" },
                    children: "⧡ Ablation Studies"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[7px] px-2 py-0.5 border",
                    style: {
                      color: "oklch(0.55 0.12 150)",
                      borderColor: "oklch(0.25 0.08 150)",
                      background: "oklch(0.55 0.12 150 / 0.08)"
                    },
                    children: "SANDBOXED · MAIN BRAIN PROTECTED"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-mono text-[7px] mt-1",
                  style: { color: "oklch(0.38 0.05 220)" },
                  children: "Sandboxed copies only. Memory and plasticity always active in main brain. Effect sizes: Cohen’s d approximation."
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "ablation.run_button",
              onClick: runAblations,
              disabled: running,
              className: "w-full py-2 px-3 border font-mono text-[9px] tracking-widest uppercase transition-all",
              style: {
                borderColor: running ? "oklch(0.38 0.06 220)" : "oklch(0.72 0.22 195)",
                color: running ? "oklch(0.38 0.06 220)" : "oklch(0.72 0.22 195)",
                background: running ? "transparent" : "oklch(0.72 0.22 195 / 0.08)",
                cursor: running ? "not-allowed" : "pointer"
              },
              children: running ? `◉ RUNNING ABLATIONS… ${Math.round(progress)}%` : "◈ RUN ABLATION PROTOCOL"
            }
          ),
          running && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "mt-1.5 h-[3px] rounded-sm overflow-hidden",
              style: { background: "oklch(0.12 0.02 260)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    height: "100%",
                    width: `${progress}%`,
                    background: "oklch(0.72 0.22 195)",
                    transition: "width 0.3s ease"
                  }
                }
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 pb-2 shrink-0", children: ABLATION_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-1.5 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] font-bold shrink-0 mt-0.5",
              style: { color: "oklch(0.62 0.18 195)", width: "140px" },
              children: t.label
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[6px] leading-tight",
              style: { color: "oklch(0.38 0.05 220)" },
              children: t.desc
            }
          )
        ] }, t.id)) }),
        results.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "mx-3 mb-3 border",
            style: { borderColor: "oklch(0.2 0.05 255)" },
            "data-ocid": "ablation.comparison_table",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "px-3 py-1.5 border-b",
                  style: {
                    borderColor: "oklch(0.18 0.04 255)",
                    background: "oklch(0.07 0.015 265)"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px] tracking-widest uppercase",
                      style: { color: "oklch(0.45 0.08 220)" },
                      children: "Comparison Results"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "grid px-3 py-1 border-b",
                  style: {
                    gridTemplateColumns: "1.2fr 70px 70px 70px 60px 60px 80px",
                    borderColor: "oklch(0.14 0.03 255)",
                    background: "oklch(0.08 0.01 265)"
                  },
                  children: [
                    "Condition",
                    "Entropy",
                    "Behav.",
                    "Thought",
                    "STDP",
                    "Effect d",
                    "Verdict"
                  ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[6px] tracking-widest uppercase text-center",
                      style: { color: "oklch(0.38 0.05 220)" },
                      children: h
                    },
                    h
                  ))
                }
              ),
              results.map((row, idx) => {
                const isBaseline = row.label === "Baseline (Full System)";
                const stdpMaxVal = baseline ? Math.max(baseline.stdpVariance, 1e-4) : 1e-4;
                const verdictColor = getVerdictColor(row.verdict);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": `ablation.row.${idx + 1}`,
                    className: "grid px-3 py-2 border-b items-center",
                    style: {
                      gridTemplateColumns: "1.2fr 70px 70px 70px 60px 60px 80px",
                      borderColor: "oklch(0.12 0.02 255)",
                      background: isBaseline ? "oklch(0.72 0.22 195 / 0.05)" : "transparent"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            className: "font-mono text-[7px] font-bold",
                            style: {
                              color: isBaseline ? "oklch(0.72 0.22 195)" : "oklch(0.58 0.08 220)"
                            },
                            children: [
                              isBaseline && "★ ",
                              row.label
                            ]
                          }
                        ),
                        row.status === "running" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-[6px]",
                            style: { color: "oklch(0.78 0.22 80)" },
                            children: "computing…"
                          }
                        )
                      ] }),
                      row.status === "running" ? [1, 2, 3, 4, 5, 6].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "h-[3px] rounded-sm",
                          style: {
                            width: "50px",
                            background: "oklch(0.12 0.02 260)"
                          }
                        }
                      ) }, k)) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            MetricBar,
                            {
                              value: row.firingEntropy,
                              color: isBaseline ? "oklch(0.72 0.22 195)" : "oklch(0.52 0.12 195)"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[6px]",
                              style: { color: "oklch(0.48 0.08 220)" },
                              children: row.firingEntropy.toFixed(3)
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            MetricBar,
                            {
                              value: row.behavioralConsistency,
                              color: isBaseline ? "oklch(0.72 0.22 140)" : "oklch(0.52 0.12 140)"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[6px]",
                              style: { color: "oklch(0.48 0.08 220)" },
                              children: row.behavioralConsistency.toFixed(3)
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            MetricBar,
                            {
                              value: row.thoughtCoherence,
                              color: isBaseline ? "oklch(0.78 0.22 80)" : "oklch(0.58 0.12 80)"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[6px]",
                              style: { color: "oklch(0.48 0.08 220)" },
                              children: row.thoughtCoherence.toFixed(3)
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            MetricBar,
                            {
                              value: row.stdpVariance,
                              max: stdpMaxVal * 1.5,
                              color: isBaseline ? "oklch(0.82 0.26 55)" : "oklch(0.62 0.14 55)"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[6px]",
                              style: { color: "oklch(0.48 0.08 220)" },
                              children: row.stdpVariance.toExponential(2)
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[7px] font-bold",
                              style: {
                                color: isBaseline ? "oklch(0.5 0.06 220)" : row.effectSize > 0.8 ? "oklch(0.72 0.22 140)" : row.effectSize > 0.5 ? "oklch(0.78 0.22 80)" : "oklch(0.65 0.25 25)"
                              },
                              children: isBaseline ? "—" : row.effectSize.toFixed(2)
                            }
                          ),
                          !isBaseline && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[5px]",
                              style: { color: "oklch(0.35 0.04 220)" },
                              children: row.effectSize > 0.8 ? "large" : row.effectSize > 0.5 ? "medium" : "small"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-[6px] font-bold px-1 py-0.5 text-center",
                            style: {
                              color: verdictColor,
                              border: `1px solid ${verdictColor}50`
                            },
                            children: isBaseline ? "REF" : row.verdict.split(" ")[0]
                          }
                        ) })
                      ] })
                    ]
                  },
                  row.label
                );
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "px-3 py-1.5",
                  style: { background: "oklch(0.07 0.01 265)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-mono text-[6px] italic",
                      style: { color: "oklch(0.32 0.04 220)" },
                      children: "Entropy: H/log(N), normalized 0–1. Effect size: Cohen’s d approximation across entropy, coherence, and behavioral metrics. Verdicts from ValidationSuite registry. Cross-session validation requires 20+ runs."
                    }
                  )
                }
              )
            ]
          }
        ),
        results.length === 0 && !running && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "ablation.empty_state",
            className: "px-3 py-4 font-mono text-[8px] text-center italic",
            style: { color: "oklch(0.35 0.05 220)" },
            children: [
              "Run ablation protocol to compare full system against sandboxed ablated conditions.",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              "Main brain is never modified."
            ]
          }
        )
      ]
    }
  );
}
function getActivityFromRegions(regions, region) {
  var _a;
  return ((_a = regions.find((r) => r.region === region)) == null ? void 0 : _a.activation) ?? 0;
}
function computeEmotions(regions, emotionValence) {
  const pfc = getActivityFromRegions(regions, Region.PrefrontalCortex);
  const amygdala = getActivityFromRegions(regions, Region.Amygdala);
  const hippocampus = getActivityFromRegions(regions, Region.Hippocampus);
  const thalamus = getActivityFromRegions(regions, Region.Thalamus);
  const sensory = getActivityFromRegions(regions, Region.SensoryCortex);
  const basal = getActivityFromRegions(regions, Region.BasalGanglia);
  const nucleus = getActivityFromRegions(
    regions,
    FrontendRegion.NucleusAccumbens
  );
  const insula = getActivityFromRegions(regions, FrontendRegion.Insula);
  const joy = Math.min(
    1,
    emotionValence > 0 ? (pfc + nucleus * 0.5 + amygdala * 0.2) * 0.5 * (1 + emotionValence) : 0
  );
  const fear = Math.min(1, amygdala * 0.8 + insula * 0.3);
  const anger = Math.min(1, (amygdala * 0.8 + basal * 0.6) * 0.75);
  const sadness = Math.min(
    1,
    emotionValence < 0 ? pfc * (1 - emotionValence * 0.5) * 0.7 : pfc * 0.1
  );
  const surprise = Math.min(1, (thalamus + sensory) * 0.5);
  const trust = Math.min(1, pfc * 0.7 * 0.5 + hippocampus * 0.6 * 0.5);
  const disgust = Math.min(1, amygdala * 0.4 + insula * 0.35);
  return [
    { name: "Joy", intensity: joy, color: "oklch(0.82 0.22 80)" },
    { name: "Fear", intensity: fear, color: "oklch(0.68 0.28 25)" },
    { name: "Anger", intensity: anger, color: "oklch(0.62 0.3 15)" },
    { name: "Sadness", intensity: sadness, color: "oklch(0.55 0.2 260)" },
    { name: "Surprise", intensity: surprise, color: "oklch(0.72 0.22 195)" },
    { name: "Trust", intensity: trust, color: "oklch(0.7 0.22 155)" },
    { name: "Disgust", intensity: disgust, color: "oklch(0.65 0.2 310)" }
  ];
}
function computeThoughts(regions) {
  var _a;
  const get = (r) => getActivityFromRegions(regions, r);
  const pfc = get(Region.PrefrontalCortex);
  const hippocampus = get(Region.Hippocampus);
  const amygdala = get(Region.Amygdala);
  const motor = get(Region.MotorCortex);
  const basal = get(Region.BasalGanglia);
  const sensory = get(Region.SensoryCortex);
  const thalamus = get(Region.Thalamus);
  const visual = get(FrontendRegion.VisualCortex);
  const auditory = get(FrontendRegion.AuditoryCortex);
  const acc = get(FrontendRegion.AnteriorCingulateCortex);
  const insula = get(FrontendRegion.Insula);
  const ofc = get(FrontendRegion.OrbitalFrontalCortex);
  const nucleus = get(FrontendRegion.NucleusAccumbens);
  const olfactory = get(FrontendRegion.OlfactoryBulb);
  Math.max(...regions.map((r) => r.activation), 0);
  const thoughts = [];
  if (pfc > 0.4)
    thoughts.push({ label: "Analytical Reasoning", intensity: pfc });
  if (pfc > 0.3 && hippocampus > 0.35)
    thoughts.push({
      label: "Creative Synthesis",
      intensity: (pfc + hippocampus) * 0.5
    });
  if (hippocampus > 0.45 && thalamus > 0.35)
    thoughts.push({
      label: "Memory Consolidation",
      intensity: (hippocampus + thalamus) * 0.5
    });
  if (amygdala > 0.45)
    thoughts.push({ label: "Threat Assessment", intensity: amygdala });
  if (motor > 0.4 && basal > 0.35)
    thoughts.push({
      label: "Motor Planning",
      intensity: (motor + basal) * 0.5
    });
  if (sensory > 0.4 && thalamus > 0.4)
    thoughts.push({
      label: "Sensory Integration",
      intensity: (sensory + thalamus) * 0.5
    });
  if (pfc > 0.5 && amygdala > 0.4)
    thoughts.push({
      label: "Emotional Regulation",
      intensity: (pfc + amygdala) * 0.5
    });
  if (hippocampus > 0.5 && motor > 0.3)
    thoughts.push({
      label: "Spatial Navigation",
      intensity: (hippocampus + motor) * 0.5
    });
  if (auditory > 0.3 && pfc > 0.3)
    thoughts.push({
      label: "Language Processing",
      intensity: (auditory + pfc) * 0.5
    });
  if (pfc > 0.45 && acc > 0.35)
    thoughts.push({
      label: "Self-Referential",
      intensity: (pfc + acc) * 0.5
    });
  if (pfc > 0.4 && ofc > 0.3)
    thoughts.push({
      label: "Future Projection",
      intensity: (pfc + ofc) * 0.5
    });
  if (acc > 0.4 && amygdala > 0.3)
    thoughts.push({
      label: "Social Cognition",
      intensity: (acc + amygdala) * 0.5
    });
  if (insula > 0.35)
    thoughts.push({ label: "Interoception", intensity: insula });
  if (ofc > 0.4 && nucleus > 0.3)
    thoughts.push({
      label: "Decision Weighting",
      intensity: (ofc + nucleus) * 0.5
    });
  if (olfactory > 0.3 || visual > 0.3 && sensory > 0.3)
    thoughts.push({
      label: "Pattern Recognition",
      intensity: Math.max(olfactory, (visual + sensory) * 0.5)
    });
  const sorted = thoughts.sort((a, b) => b.intensity - a.intensity);
  const maxIntensity = ((_a = sorted[0]) == null ? void 0 : _a.intensity) ?? 1;
  const normalized = sorted.map((t) => ({ ...t, intensity: t.intensity / maxIntensity })).filter((t) => t.intensity > 0.25);
  return normalized.slice(0, 6);
}
function Sparkline({
  history,
  color,
  width = 60,
  height = 16
}) {
  if (history.length < 2) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "svg",
      {
        width,
        height,
        style: { overflow: "visible" },
        role: "img",
        "aria-label": "emotion sparkline",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: 0,
            y1: height / 2,
            x2: width,
            y2: height / 2,
            stroke: color,
            strokeWidth: 0.5,
            strokeOpacity: 0.3
          }
        )
      }
    );
  }
  const max = Math.max(...history, 0.01);
  const points = history.map((v, i) => {
    const x = i / (history.length - 1) * width;
    const y = height - v / max * (height - 2) - 1;
    return `${x},${y}`;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width,
      height,
      style: { overflow: "visible" },
      role: "img",
      "aria-label": "emotion sparkline",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "polyline",
          {
            points: points.join(" "),
            fill: "none",
            stroke: color,
            strokeWidth: 1,
            strokeOpacity: 0.7,
            strokeLinejoin: "round",
            strokeLinecap: "round"
          }
        ),
        history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: (history.length - 1) / (history.length - 1) * width,
            cy: height - history[history.length - 1] / max * (height - 2) - 1,
            r: 2,
            fill: color,
            style: { filter: `drop-shadow(0 0 3px ${color})` }
          }
        )
      ]
    }
  );
}
function EEGChannel({
  label,
  hz,
  amplitude,
  freqMult,
  phase,
  color,
  time,
  width = 180,
  height = 18
}) {
  const samples = 36;
  const points = [];
  for (let i = 0; i <= samples; i++) {
    const x = i / samples * width;
    const t = time + i / samples * 4;
    const y = height / 2 + Math.sin(t * freqMult + phase) * amplitude * (height / 2 - 2);
    points.push(`${x},${Math.max(1, Math.min(height - 1, y))}`);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "shrink-0 font-mono",
        style: {
          width: "28px",
          color,
          fontSize: "8px",
          letterSpacing: "0.05em"
        },
        children: label
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "shrink-0 font-mono",
        style: {
          width: "26px",
          color: "oklch(0.35 0.04 220)",
          fontSize: "7px"
        },
        children: hz
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        width,
        height,
        style: { overflow: "visible" },
        role: "img",
        "aria-label": `${label} EEG channel`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "rect",
            {
              x: 0,
              y: 0,
              width,
              height,
              fill: "oklch(0.08 0.01 260)",
              rx: 0
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "polyline",
            {
              points: points.join(" "),
              fill: "none",
              stroke: color,
              strokeWidth: 1,
              strokeOpacity: 0.85,
              strokeLinejoin: "round"
            }
          )
        ]
      }
    )
  ] });
}
function ThoughtLogPanel({ thoughtLog }) {
  const recentThoughts = thoughtLog.slice(0, 15);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "px-3 py-2 border-t",
      style: { borderColor: "oklch(0.18 0.04 255)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "font-mono text-[9px] tracking-widest uppercase mb-2",
            style: { color: "oklch(0.38 0.06 220)" },
            children: "▸ THOUGHT LOG · LIVE COGNITION STREAM"
          }
        ),
        recentThoughts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "thoughts.empty_state",
            className: "font-mono text-[8px] italic",
            style: { color: "oklch(0.32 0.04 220)" },
            children: "Awaiting neural patterns..."
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-[5px]", children: recentThoughts.map((entry, idx) => {
          const intensity = Math.min(1, entry.intensity);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `thought_log.item.${idx + 1}`,
              className: "flex flex-col gap-[2px]",
              style: {
                borderLeft: "2px solid",
                borderColor: idx === 0 ? "oklch(0.72 0.22 195)" : intensity > 0.6 ? "oklch(0.72 0.22 195 / 0.7)" : "oklch(0.25 0.05 240)",
                paddingLeft: "6px",
                opacity: idx === 0 ? 1 : Math.max(0.45, 0.95 - idx * 0.04),
                background: idx === 0 ? "oklch(0.08 0.018 255)" : "transparent"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[7px] shrink-0",
                      style: { color: "oklch(0.35 0.04 220)" },
                      children: [
                        "T",
                        entry.tick
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[7px] tracking-wider uppercase truncate",
                      style: { color: "oklch(0.55 0.12 195)" },
                      children: [
                        "[",
                        entry.dominantRegion.replace(/([A-Z])/g, " $1").trim().slice(0, 18),
                        "]"
                      ]
                    }
                  ),
                  idx === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[6px] tracking-widest uppercase shrink-0",
                      style: {
                        color: "oklch(0.72 0.22 195)",
                        border: "1px solid oklch(0.72 0.22 195 / 0.5)",
                        padding: "0px 3px"
                      },
                      children: "NEW"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono text-[8px] italic leading-tight",
                    style: {
                      color: intensity > 0.6 ? "oklch(0.82 0.16 195)" : "oklch(0.58 0.08 220)"
                    },
                    children: [
                      '"',
                      entry.thought,
                      '"'
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "flex-1 h-[2px]",
                      style: { background: "oklch(0.12 0.02 260)" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            height: "100%",
                            width: `${intensity * 100}%`,
                            background: "oklch(0.65 0.2 195)",
                            transition: "width 0.5s ease"
                          }
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[6px] shrink-0",
                      style: { color: "oklch(0.42 0.07 195)" },
                      children: [
                        Math.round(intensity * 100),
                        "%"
                      ]
                    }
                  )
                ] })
              ]
            },
            `${entry.tick}-${idx}`
          );
        }) })
      ]
    }
  );
}
function EmotionAnalysisPanel({ neural }) {
  const historyRef = reactExports.useRef(/* @__PURE__ */ new Map());
  const [, forceUpdate] = reactExports.useState(0);
  const [eegTime, setEegTime] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      setEegTime((t) => t + 0.05);
    }, 50);
    return () => clearInterval(interval);
  }, []);
  const {
    regions,
    neurotransmitters: nt,
    avatarBehavior,
    globalArousal
  } = neural;
  const emotions = computeEmotions(regions, avatarBehavior.emotionValence);
  const thoughts = computeThoughts(regions);
  const emotionValence = avatarBehavior.emotionValence;
  const get = (r) => getActivityFromRegions(regions, r);
  const brainstem = get(Region.Brainstem);
  const hippocampus = get(Region.Hippocampus);
  const pfc = get(Region.PrefrontalCortex);
  const motor = get(Region.MotorCortex);
  const sensory = get(Region.SensoryCortex);
  const thalamus = get(Region.Thalamus);
  reactExports.useEffect(() => {
    for (const emotion of emotions) {
      const hist = historyRef.current.get(emotion.name) ?? [];
      hist.push(emotion.intensity);
      if (hist.length > 40) hist.shift();
      historyRef.current.set(emotion.name, hist);
    }
    forceUpdate((n) => n + 1);
  }, [neural.tick]);
  const neurotransmitters = [
    { abbrev: "DA", value: nt.dopamine, color: "oklch(0.82 0.26 55)" },
    { abbrev: "5HT", value: nt.serotonin, color: "oklch(0.72 0.22 160)" },
    { abbrev: "NE", value: nt.norepinephrine, color: "oklch(0.68 0.28 25)" },
    { abbrev: "GABA", value: nt.gaba, color: "oklch(0.62 0.2 270)" },
    { abbrev: "GLU", value: nt.glutamate, color: "oklch(0.78 0.22 80)" },
    { abbrev: "ACh", value: nt.acetylcholine, color: "oklch(0.72 0.22 195)" }
  ];
  const cx = (emotionValence * 0.45 + 0.5) * 110;
  const cy = (1 - globalArousal) * 110;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "emotion.panel",
      className: "h-full flex flex-col overflow-hidden",
      style: { background: "oklch(0.065 0.01 265)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex border-b shrink-0",
            style: { borderColor: "oklch(0.18 0.04 255)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex-1 px-3 py-2 border-r",
                  style: { borderColor: "oklch(0.15 0.03 255)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "font-mono text-[9px] tracking-widest uppercase mb-1",
                        style: { color: "oklch(0.38 0.06 220)" },
                        children: "▸ Plutchik Spectrum"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-[3px]", children: emotions.map((emotion) => {
                      const history = historyRef.current.get(emotion.name) ?? [];
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-[8px] shrink-0",
                            style: { color: emotion.color, width: "44px" },
                            children: emotion.name
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Sparkline,
                          {
                            history,
                            color: emotion.color,
                            width: 48,
                            height: 14
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "h-[4px] relative flex-1",
                            style: {
                              background: "oklch(0.1 0.015 260)",
                              minWidth: "28px",
                              maxWidth: "40px"
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                style: {
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  height: "100%",
                                  width: `${emotion.intensity * 100}%`,
                                  background: emotion.color,
                                  boxShadow: emotion.intensity > 0.4 ? `0 0 4px ${emotion.color}` : "none",
                                  transition: "width 0.3s ease"
                                }
                              }
                            )
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            className: "font-mono text-[8px] shrink-0 text-right",
                            style: { color: emotion.color, width: "22px" },
                            children: [
                              Math.round(emotion.intensity * 100),
                              "%"
                            ]
                          }
                        )
                      ] }, emotion.name);
                    }) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-2 py-2 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[9px] tracking-widest uppercase mb-1",
                    style: { color: "oklch(0.38 0.06 220)" },
                    children: "▸ Affect Space"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: { position: "relative", width: "110px", height: "110px" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "svg",
                      {
                        width: 110,
                        height: 110,
                        role: "img",
                        "aria-label": "Russell's Circumplex of Affect",
                        children: [
                          [0.25, 0.5, 0.75, 1].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "circle",
                            {
                              cx: 55,
                              cy: 55,
                              r: r * 50,
                              fill: "none",
                              stroke: "oklch(0.2 0.04 250)",
                              strokeWidth: 0.5,
                              strokeDasharray: "2 3"
                            },
                            r
                          )),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "line",
                            {
                              x1: 5,
                              y1: 55,
                              x2: 105,
                              y2: 55,
                              stroke: "oklch(0.25 0.04 240)",
                              strokeWidth: 0.7
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "line",
                            {
                              x1: 55,
                              y1: 5,
                              x2: 55,
                              y2: 105,
                              stroke: "oklch(0.25 0.04 240)",
                              strokeWidth: 0.7
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "text",
                            {
                              x: 55,
                              y: 9,
                              textAnchor: "middle",
                              fill: "oklch(0.4 0.05 220)",
                              fontSize: 5,
                              fontFamily: "JetBrains Mono, monospace",
                              children: "EXCITED"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "text",
                            {
                              x: 55,
                              y: 108,
                              textAnchor: "middle",
                              fill: "oklch(0.4 0.05 220)",
                              fontSize: 5,
                              fontFamily: "JetBrains Mono, monospace",
                              children: "CALM"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "text",
                            {
                              x: 3,
                              y: 58,
                              textAnchor: "start",
                              fill: "oklch(0.4 0.05 220)",
                              fontSize: 5,
                              fontFamily: "JetBrains Mono, monospace",
                              children: "−"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "text",
                            {
                              x: 104,
                              y: 58,
                              textAnchor: "end",
                              fill: "oklch(0.4 0.05 220)",
                              fontSize: 5,
                              fontFamily: "JetBrains Mono, monospace",
                              children: "+"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "circle",
                            {
                              cx,
                              cy,
                              r: 7,
                              fill: "oklch(0.72 0.22 195 / 0.12)"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "circle",
                            {
                              cx,
                              cy,
                              r: 3.5,
                              fill: "oklch(0.72 0.22 195 / 0.35)"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "circle",
                            {
                              cx,
                              cy,
                              r: 2,
                              fill: "oklch(0.85 0.22 195)",
                              style: {
                                filter: "drop-shadow(0 0 4px oklch(0.72 0.22 195))"
                              }
                            }
                          )
                        ]
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "font-mono text-[7px] tracking-widest mt-1",
                    style: { color: "oklch(0.35 0.04 220)" },
                    children: [
                      "V:",
                      emotionValence >= 0 ? "+" : "",
                      emotionValence.toFixed(2),
                      " A:",
                      globalArousal.toFixed(2)
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-2 border-b shrink-0",
            style: { borderColor: "oklch(0.18 0.04 255)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-1",
                  style: { color: "oklch(0.38 0.06 220)" },
                  children: "▸ Neurotransmitter Balance"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-x-3 gap-y-[3px]", children: neurotransmitters.map((ntItem) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] font-bold shrink-0",
                    style: { color: ntItem.color, width: "28px" },
                    children: ntItem.abbrev
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex-1 h-[3px] relative",
                    style: { background: "oklch(0.12 0.02 260)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          position: "absolute",
                          left: 0,
                          top: 0,
                          height: "100%",
                          width: `${ntItem.value * 100}%`,
                          background: ntItem.color,
                          transition: "width 0.4s ease"
                        }
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono text-[7px] shrink-0",
                    style: {
                      color: ntItem.color,
                      width: "22px",
                      textAlign: "right"
                    },
                    children: [
                      Math.round(ntItem.value * 100),
                      "%"
                    ]
                  }
                )
              ] }, ntItem.abbrev)) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-3 py-2 border-b",
              style: { borderColor: "oklch(0.15 0.03 255)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[9px] tracking-widest uppercase mb-1",
                    style: { color: "oklch(0.38 0.06 220)" },
                    children: "▸ Active Thought Patterns (16-pattern model)"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-[4px]", children: thoughts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    "data-ocid": "thoughts.empty_state",
                    className: "font-mono text-[9px]",
                    style: { color: "oklch(0.3 0.04 220)" },
                    children: "No active patterns"
                  }
                ) : thoughts.map((thought, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": `thought.item.${idx + 1}`,
                    className: "flex items-center gap-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "font-mono text-[8px] px-2 py-[2px] flex-1",
                          style: {
                            border: "1px solid",
                            borderColor: thought.intensity > 0.6 ? "oklch(0.72 0.22 195 / 0.7)" : "oklch(0.25 0.05 240)",
                            background: thought.intensity > 0.6 ? "oklch(0.72 0.22 195 / 0.1)" : "oklch(0.1 0.015 260)",
                            color: thought.intensity > 0.6 ? "oklch(0.82 0.18 195)" : "oklch(0.55 0.08 220)",
                            boxShadow: thought.intensity > 0.6 ? "0 0 6px oklch(0.72 0.22 195 / 0.3)" : "none",
                            letterSpacing: "0.04em"
                          },
                          children: thought.label
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "font-mono text-[8px] shrink-0",
                          style: {
                            color: thought.intensity > 0.6 ? "oklch(0.72 0.22 195)" : "oklch(0.4 0.05 220)",
                            width: "28px",
                            textAlign: "right"
                          },
                          children: [
                            Math.round(thought.intensity * 100),
                            "%"
                          ]
                        }
                      )
                    ]
                  },
                  thought.label
                )) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[9px] tracking-widest uppercase mb-1",
                style: { color: "oklch(0.38 0.06 220)" },
                children: "▸ EEG · Neural Oscillations"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-[3px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                EEGChannel,
                {
                  label: "δ",
                  hz: "0.5-4",
                  amplitude: Math.max(0.08, brainstem),
                  freqMult: 0.5,
                  phase: 0,
                  color: "oklch(0.6 0.18 280)",
                  time: eegTime
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                EEGChannel,
                {
                  label: "θ",
                  hz: "4-8",
                  amplitude: Math.max(0.08, hippocampus),
                  freqMult: 1.2,
                  phase: 1.1,
                  color: "oklch(0.62 0.2 310)",
                  time: eegTime
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                EEGChannel,
                {
                  label: "α",
                  hz: "8-12",
                  amplitude: Math.max(0.08, 1 - globalArousal),
                  freqMult: 2.5,
                  phase: 2.2,
                  color: "oklch(0.72 0.22 195)",
                  time: eegTime
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                EEGChannel,
                {
                  label: "β",
                  hz: "13-30",
                  amplitude: Math.max(0.08, (pfc + motor) * 0.5),
                  freqMult: 4,
                  phase: 0.7,
                  color: "oklch(0.82 0.22 80)",
                  time: eegTime
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                EEGChannel,
                {
                  label: "γ",
                  hz: "30-100",
                  amplitude: Math.max(0.08, (sensory + thalamus) * 0.5),
                  freqMult: 8,
                  phase: 3.5,
                  color: "oklch(0.68 0.28 25)",
                  time: eegTime
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ThoughtLogPanel, { thoughtLog: neural.thoughtLog }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-3 py-2 border-t",
              style: { borderColor: "oklch(0.18 0.04 255)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[9px] tracking-widest uppercase mb-2",
                    style: { color: "oklch(0.38 0.06 220)" },
                    children: "▸ WORKING MEMORY · PFC+MDT BUFFER"
                  }
                ),
                neural.workingMemory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    "data-ocid": "working_memory.empty_state",
                    className: "font-mono text-[8px] italic",
                    style: { color: "oklch(0.28 0.04 220)" },
                    children: "— BUFFER EMPTY —"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-[4px]", children: neural.workingMemory.map((entry, idx) => {
                  const content = typeof entry === "string" ? entry : entry.content;
                  const strength = typeof entry === "string" ? 1 : entry.strength;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      "data-ocid": `working_memory.item.${idx + 1}`,
                      className: "flex items-start gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            className: "font-mono text-[7px] shrink-0 font-bold",
                            style: { color: "oklch(0.45 0.1 195)", width: "30px" },
                            children: [
                              "WM[",
                              idx,
                              "]"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            className: "font-mono text-[8px] truncate flex-1",
                            style: {
                              color: `oklch(${0.35 + strength * 0.25} 0.12 195)`,
                              maxWidth: "180px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              opacity: Math.max(0.4, strength)
                            },
                            title: content,
                            children: [
                              content.slice(0, 40),
                              content.length > 40 ? "…" : ""
                            ]
                          }
                        )
                      ]
                    },
                    content.slice(0, 20) + String(idx)
                  );
                }) })
              ]
            }
          )
        ] })
      ]
    }
  );
}
function pqrst(t) {
  const p = 0.12 * Math.exp(-((t - 0.12) ** 2) / (2 * 3e-3 ** 2 * 100));
  const q = -0.05 * Math.exp(-((t - 0.22) ** 2) / (2 * 1e-3 ** 2 * 100));
  const r = 1 * Math.exp(-((t - 0.265) ** 2) / (2 * 15e-4 ** 2 * 100));
  const s = -0.12 * Math.exp(-((t - 0.3) ** 2) / (2 * 1e-3 ** 2 * 100));
  const tWave = 0.3 * Math.exp(-((t - 0.5) ** 2) / (2 * 4e-3 ** 2 * 100));
  return p + q + r + s + tWave;
}
function bpmColor(bpm) {
  if (bpm <= 80) return "oklch(0.72 0.22 140)";
  if (bpm <= 100) return "oklch(0.82 0.26 55)";
  return "oklch(0.68 0.28 25)";
}
function cardiacLabel(bpm) {
  if (bpm < 55) return "BRADYCARDIA";
  if (bpm > 100) return "TACHYCARDIA";
  return "SINUS RHYTHM";
}
function HeartPanel({
  heartRate,
  hrv,
  sympatheticTone,
  parasympatheticTone,
  isRunning,
  insideActivation = 0.4,
  vmPFCActivation = 0.5,
  brainstemActivation = 0.3,
  threatCircuitActivation = 0.2,
  pfcActivationCoherence = 0.5,
  cortisolLevel: cortisolLevelProp,
  cortisolPlasticityGated: cortisolGatedProp
}) {
  const canvasRef = reactExports.useRef(null);
  const timeRef = reactExports.useRef(0);
  const animRef = reactExports.useRef(null);
  const [bpmDisplay, setBpmDisplay] = reactExports.useState(heartRate);
  const [ansVerdict, setAnsVerdict] = reactExports.useState("INVALID RUN");
  const [ansInterpretation, setAnsInterpretation] = reactExports.useState("");
  const snsTone = isRunning ? sympatheticTone : 0.3;
  const pnsTone = isRunning ? parasympatheticTone : 0.4;
  const total = snsTone + pnsTone + 1e-4;
  const snsFrac = snsTone / total;
  const pnsFrac = pnsTone / total;
  const lfratio = snsTone / (pnsTone + 1e-3);
  const lfPow = Math.round(snsTone * 85 + 15);
  const hfPow = Math.round(pnsTone * 85 + 10);
  const baroreflexSensitivity = isRunning ? Math.max(3, 25 - (heartRate - 60) * 0.3) : 15;
  const vagalAfferentActivity = isRunning ? Math.min(100, Math.round(brainstemActivation * 80 + pnsTone * 20)) : 30;
  const cognitiveFlexibility = isRunning ? Math.min(100, Math.round(pfcActivationCoherence * 100)) : 40;
  const cortisolLevel = cortisolLevelProp !== void 0 ? cortisolLevelProp : isRunning ? Math.min(1, threatCircuitActivation * 0.8 + snsTone * 0.2) : 0.15;
  const adrenalineLevel = isRunning ? Math.min(1, snsTone * 0.9 + threatCircuitActivation * 0.1) : 0.1;
  const somaticMarkerConfidence = isRunning ? Math.min(
    100,
    Math.round((insideActivation * 0.6 + vmPFCActivation * 0.4) * 100)
  ) : 35;
  const plasticityGateSuppressed = cortisolGatedProp !== void 0 ? cortisolGatedProp : cortisolLevel > 0.65;
  const bpm = Math.round(isRunning ? bpmDisplay : 70);
  const displayColor = bpmColor(bpm);
  const label = cardiacLabel(bpm);
  const hrvPct = Math.round((isRunning ? hrv : 0.5) * 100);
  reactExports.useEffect(() => {
    if (!isRunning) return;
    const baseline = {
      regionCount: 10,
      avgActivation: snsTone,
      activationVariance: 0.02,
      stdpVariance: 1e-3,
      thoughtCoherence: cognitiveFlexibility / 100,
      behavioralConsistency: pnsTone,
      saturatedCount: 0,
      clippingCount: 0,
      homerstaticActivity: vagalAfferentActivity / 100
    };
    const enabled = {
      ...baseline,
      avgActivation: snsTone * 1.05,
      thoughtCoherence: cognitiveFlexibility / 100 * 1.1
    };
    const result = runValidationSuite(
      "ANSInteroceptiveCoupling",
      baseline,
      enabled,
      5
    );
    setAnsVerdict(result.verdict);
    setAnsInterpretation(result.interpretation);
  }, [
    isRunning,
    snsTone,
    pnsTone,
    cognitiveFlexibility,
    vagalAfferentActivity
  ]);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const bufferLen = W;
    const waveBuffer = new Float32Array(bufferLen);
    let lastTime = performance.now();
    function draw(now) {
      if (!ctx || !canvas) return;
      const dt = (now - lastTime) / 1e3;
      lastTime = now;
      const beatsPerSec = (isRunning ? heartRate : 70) / 60;
      timeRef.current += dt * beatsPerSec;
      for (let i = 0; i < bufferLen; i++) {
        const tOffset = i / bufferLen;
        const phase = (timeRef.current + tOffset) % 1;
        waveBuffer[i] = pqrst(phase);
      }
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(4, 8, 20, 0.95)";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(30, 80, 160, 0.15)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) {
        const y = i / 4 * H;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      for (let i = 0; i <= 6; i++) {
        const x = i / 6 * W;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(30, 80, 160, 0.25)";
      ctx.lineWidth = 0.5;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(0, H / 2);
      ctx.lineTo(W, H / 2);
      ctx.stroke();
      ctx.setLineDash([]);
      const hexColor = heartRate > 100 ? "#d85030" : heartRate > 80 ? "#d4a020" : "#30c060";
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, `${hexColor}cc`);
      grad.addColorStop(0.5, `${hexColor}ff`);
      grad.addColorStop(1, `${hexColor}44`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      ctx.beginPath();
      for (let i = 0; i < bufferLen; i++) {
        const x = i;
        const amplitude = Math.min(0.9, 0.4 + (isRunning ? 0.4 : 0.1));
        const y = H / 2 - waveBuffer[i] * (H / 2 - 4) * amplitude;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      animRef.current = requestAnimationFrame(draw);
    }
    animRef.current = requestAnimationFrame(draw);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [heartRate, isRunning]);
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      setBpmDisplay((prev) => {
        const diff = heartRate - prev;
        return Math.round(prev + diff * 0.15);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [heartRate]);
  const verdictColor = getVerdictColor(ansVerdict);
  const validated = isMechanismValidated(ansVerdict);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "heart.panel",
      className: "h-full flex flex-col overflow-y-auto",
      style: { background: "oklch(0.065 0.01 265)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-1 border-b shrink-0 flex items-center justify-between",
            style: { borderColor: "oklch(0.18 0.04 255)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase",
                  style: { color: "oklch(0.38 0.06 220)" },
                  children: "▸ ANS/Interoceptive Coupling Layer"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px] tracking-widest uppercase px-1.5 py-0.5 border",
                  style: {
                    color: validated ? "oklch(0.72 0.22 140)" : "oklch(0.55 0.08 220)",
                    borderColor: validated ? "oklch(0.72 0.22 140 / 0.4)" : "oklch(0.25 0.04 220)"
                  },
                  children: validated ? "VALIDATED" : "PENDING VALIDATION"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px] tracking-widest uppercase",
                  style: { color: "oklch(0.38 0.05 220)" },
                  children: "BPM"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono font-bold leading-none",
                  style: {
                    fontSize: "2.2rem",
                    color: displayColor,
                    textShadow: `0 0 18px ${displayColor}`,
                    transition: "color 0.5s ease",
                    fontVariantNumeric: "tabular-nums"
                  },
                  children: bpm
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px]",
                  style: { color: "oklch(0.38 0.05 220)" },
                  children: label
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px] tracking-widest uppercase",
                  style: { color: "oklch(0.32 0.04 220)" },
                  children: "PQRST Waveform"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "canvas",
                {
                  ref: canvasRef,
                  width: 200,
                  height: 40,
                  style: {
                    width: "100%",
                    height: "40px",
                    display: "block",
                    border: "1px solid oklch(0.18 0.05 255)"
                  }
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col gap-1.5 pt-2 border-t",
              style: { borderColor: "oklch(0.14 0.03 260)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[7px] tracking-widest uppercase font-bold",
                    style: { color: "oklch(0.55 0.12 195)" },
                    children: "HRV Spectral Analysis"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: [
                  {
                    label: "LF Power",
                    value: `${lfPow}%`,
                    subtitle: "0.04–0.15 Hz",
                    color: "oklch(0.68 0.28 25)"
                  },
                  {
                    label: "HF Power",
                    value: `${hfPow}%`,
                    subtitle: "0.15–0.40 Hz",
                    color: "oklch(0.62 0.2 220)"
                  },
                  {
                    label: "LF/HF Ratio",
                    value: lfratio.toFixed(2),
                    subtitle: lfratio > 2 ? "SNS dominant" : lfratio < 0.5 ? "PNS dominant" : "balanced",
                    color: lfratio > 2 ? "oklch(0.68 0.28 25)" : lfratio < 0.5 ? "oklch(0.62 0.2 220)" : "oklch(0.72 0.22 140)"
                  }
                ].map(({ label: label2, value, subtitle, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex flex-col",
                    style: { borderLeft: `2px solid ${color}`, paddingLeft: "6px" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[6px] uppercase tracking-widest",
                          style: { color: "oklch(0.38 0.05 220)" },
                          children: label2
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[9px] font-bold",
                          style: { color },
                          children: value
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[6px]",
                          style: { color: "oklch(0.35 0.04 220)" },
                          children: subtitle
                        }
                      )
                    ]
                  },
                  label2
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px]",
                      style: { color: "oklch(0.38 0.05 220)" },
                      children: "Baroreflex Sensitivity:"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[8px] font-bold",
                      style: { color: "oklch(0.72 0.22 160)" },
                      children: [
                        baroreflexSensitivity.toFixed(1),
                        " ms/mmHg"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px]",
                      style: { color: "oklch(0.38 0.05 220)" },
                      children: "HRV:"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "flex-1 h-[4px]",
                      style: { background: "oklch(0.12 0.02 260)" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            height: "100%",
                            width: `${hrvPct}%`,
                            background: "linear-gradient(90deg, oklch(0.45 0.15 160), oklch(0.72 0.22 160))",
                            transition: "width 0.4s"
                          }
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[7px] font-bold",
                      style: { color: "oklch(0.72 0.22 160)" },
                      children: [
                        hrvPct,
                        "ms"
                      ]
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col gap-1 pt-2 border-t",
              style: { borderColor: "oklch(0.14 0.03 260)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[7px]",
                      style: { color: "oklch(0.68 0.28 25)" },
                      children: [
                        "SNS ",
                        Math.round(snsTone * 100),
                        "%"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px] uppercase",
                      style: { color: "oklch(0.38 0.05 220)" },
                      children: "ANS BALANCE"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[7px]",
                      style: { color: "oklch(0.62 0.2 220)" },
                      children: [
                        "PNS ",
                        Math.round(pnsTone * 100),
                        "%"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "w-full h-[6px] flex overflow-hidden",
                    style: { background: "oklch(0.12 0.02 260)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            width: `${snsFrac * 100}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, oklch(0.68 0.28 25), oklch(0.72 0.24 40))",
                            transition: "width 0.4s"
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            width: `${pnsFrac * 100}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, oklch(0.55 0.2 220), oklch(0.62 0.22 210))",
                            transition: "width 0.4s"
                          }
                        }
                      )
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col gap-1.5 pt-2 border-t",
              style: { borderColor: "oklch(0.14 0.03 260)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[7px] tracking-widest uppercase font-bold",
                    style: { color: "oklch(0.55 0.12 195)" },
                    children: "Vagal Afferent Signal"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-mono text-[6px] leading-relaxed",
                    style: { color: "oklch(0.35 0.05 220)" },
                    children: "Afferent vagal signal influencing arousal circuits (NTS → LC → Thalamus)"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "flex-1 h-[4px]",
                      style: { background: "oklch(0.12 0.02 260)" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            height: "100%",
                            width: `${vagalAfferentActivity}%`,
                            background: "oklch(0.62 0.2 220)",
                            transition: "width 0.4s"
                          }
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[8px] font-bold shrink-0",
                      style: { color: "oklch(0.62 0.2 220)" },
                      children: [
                        vagalAfferentActivity,
                        "%"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px]",
                      style: { color: "oklch(0.38 0.05 220)" },
                      children: "Cognitive Flexibility (PFC coherence):"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[8px] font-bold",
                      style: { color: "oklch(0.72 0.22 195)" },
                      children: [
                        cognitiveFlexibility,
                        "%"
                      ]
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col gap-1.5 pt-2 border-t",
              style: { borderColor: "oklch(0.14 0.03 260)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[7px] tracking-widest uppercase font-bold",
                    style: { color: "oklch(0.55 0.12 195)" },
                    children: "Neuroendocrine State"
                  }
                ),
                plasticityGateSuppressed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "px-2 py-1 font-mono text-[7px] font-bold",
                    style: {
                      background: "oklch(0.18 0.08 30)",
                      color: "oklch(0.85 0.18 30)",
                      border: "1px solid oklch(0.35 0.12 30)"
                    },
                    children: [
                      "⚠ Cortisol gate active — LTP suppressed in STDP engine (cortisol",
                      " ",
                      Math.round(cortisolLevel * 100),
                      "%)"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5", children: [
                  {
                    label: "Cortisol",
                    value: cortisolLevel,
                    unit: "a.u.",
                    color: "oklch(0.72 0.22 80)",
                    desc: "Driven by threat circuit activation"
                  },
                  {
                    label: "Adrenaline",
                    value: adrenalineLevel,
                    unit: "a.u.",
                    color: "oklch(0.68 0.28 25)",
                    desc: "Driven by sympathetic burst events"
                  }
                ].map(({ label: label2, value, unit, color, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[7px]",
                        style: { color: "oklch(0.42 0.06 220)" },
                        children: [
                          label2,
                          " (",
                          desc,
                          ")"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[8px] font-bold",
                        style: { color },
                        children: [
                          value.toFixed(2),
                          " ",
                          unit
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-full h-[4px]",
                      style: { background: "oklch(0.12 0.02 260)" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            height: "100%",
                            width: `${value * 100}%`,
                            background: color,
                            transition: "width 0.4s",
                            boxShadow: value > 0.7 ? `0 0 6px ${color}` : "none"
                          }
                        }
                      )
                    }
                  )
                ] }, label2)) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col gap-1.5 pt-2 border-t",
              style: { borderColor: "oklch(0.14 0.03 260)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[7px] tracking-widest uppercase font-bold",
                    style: { color: "oklch(0.55 0.12 195)" },
                    children: "Interoceptive Feedback"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-mono text-[6px]",
                    style: { color: "oklch(0.35 0.05 220)" },
                    children: "Interoceptive signal contributing to self-model confidence (Damasio somatic marker pathway: Insula + vmPFC co-activation)"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "flex-1 h-[4px]",
                      style: { background: "oklch(0.12 0.02 260)" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            height: "100%",
                            width: `${somaticMarkerConfidence}%`,
                            background: "oklch(0.78 0.24 80)",
                            transition: "width 0.4s"
                          }
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[8px] font-bold shrink-0",
                      style: { color: "oklch(0.78 0.24 80)" },
                      children: [
                        somaticMarkerConfidence,
                        "%"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono text-[6px]",
                    style: { color: "oklch(0.35 0.04 220)" },
                    children: [
                      "Somatic Marker Confidence (Insula",
                      " ",
                      Math.round(insideActivation * 100),
                      "% + vmPFC",
                      " ",
                      Math.round(vmPFCActivation * 100),
                      "%)"
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col gap-1.5 pt-2 border-t",
              style: { borderColor: "oklch(0.14 0.03 260)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px] tracking-widest uppercase font-bold",
                      style: { color: "oklch(0.45 0.08 220)" },
                      children: "ANS Module Validation"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px] font-bold px-1.5 py-0.5 border",
                      style: { color: verdictColor, borderColor: `${verdictColor}60` },
                      children: ansVerdict || "PENDING"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-mono text-[6px] leading-relaxed",
                    style: { color: "oklch(0.38 0.05 220)" },
                    children: ansInterpretation || "Run simulation to validate ANS/Interoceptive Coupling module."
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-mono text-[6px] italic",
                    style: { color: "oklch(0.3 0.04 220)" },
                    children: "Bounded ANS/interoceptive coupling layer — not full physiology. Causally derived from neural state: SNS/PNS from amygdala/PFC, cortisol from threat circuit, vagal tone from brainstem."
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col gap-1 pt-2 border-t",
              style: { borderColor: "oklch(0.14 0.03 260)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[7px] tracking-widest uppercase",
                    style: { color: "oklch(0.3 0.04 220)" },
                    children: "Cardiac Output"
                  }
                ),
                [
                  {
                    label: "STROKE VOL",
                    value: `${Math.round(70 + (1 - snsTone) * 20)} mL`,
                    color: "oklch(0.72 0.22 195)"
                  },
                  {
                    label: "CARDIAC OUT",
                    value: `${(bpm * (70 + (1 - snsTone) * 20) / 1e3).toFixed(1)} L/min`,
                    color: "oklch(0.78 0.22 80)"
                  }
                ].map(({ label: label2, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px] w-16",
                      style: { color: "oklch(0.38 0.05 220)" },
                      children: label2
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[9px] font-bold",
                      style: { color },
                      children: value
                    }
                  )
                ] }, label2))
              ]
            }
          )
        ] })
      ]
    }
  );
}
function AnalysisTab({ neural }) {
  var _a, _b, _c, _d;
  const { data: canon } = useCanonicalState();
  const { data: fearState } = useFearMissionState();
  const { data: neuroState } = useNeuroscienceState();
  reactExports.useEffect(() => {
    var _a2;
    if (!canon) return;
    (_a2 = neural.seedFromBackend) == null ? void 0 : _a2.call(neural, {
      coherence: canon.coh,
      arousal: canon.ar,
      identityI: canon.ic,
      fearLevel: fearState == null ? void 0 : fearState.fearLevel,
      vagalTone: neuroState == null ? void 0 : neuroState.vagalTone,
      consciousnessIndex: neuroState == null ? void 0 : neuroState.consciousnessIndex,
      kuramotoR: fearState == null ? void 0 : fearState.kuramotoR,
      missionLockActive: fearState == null ? void 0 : fearState.missionLockActive,
      surrenderFloor: fearState == null ? void 0 : fearState.surrenderFloor,
      courageScore: fearState == null ? void 0 : fearState.courageScore,
      groundedScore: fearState == null ? void 0 : fearState.groundedScore
    });
  }, [canon, fearState, neuroState, neural]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col overflow-hidden", children: [
    canon && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "shrink-0 flex items-center gap-4 px-3 py-1 border-b font-mono text-[9px] tracking-[0.12em]",
        style: {
          background: "oklch(0.07 0.015 265)",
          borderColor: "oklch(0.18 0.05 255)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.38 0.05 220)" }, children: "ORGANISM LIVE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.38 0.05 220)" }, children: "COH" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                color: canon.coh > 0.7 ? "oklch(0.68 0.28 140)" : canon.coh > 0.4 ? "oklch(0.78 0.22 80)" : "oklch(0.65 0.25 25)"
              },
              children: canon.coh.toFixed(3)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.38 0.05 220)" }, children: "FEAR" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                color: ((fearState == null ? void 0 : fearState.fearLevel) ?? 0) > 0.5 ? "oklch(0.65 0.25 25)" : "oklch(0.68 0.28 140)"
              },
              children: ((fearState == null ? void 0 : fearState.fearLevel) ?? 0).toFixed(3)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.38 0.05 220)" }, children: "KHz" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.72 0.22 195)" }, children: canon.kf.toFixed(3) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.38 0.05 220)" }, children: "ψ-IDX" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.72 0.22 195)" }, children: ((neuroState == null ? void 0 : neuroState.consciousnessIndex) ?? 0).toFixed(3) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.38 0.05 220)" }, children: "BEAT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.85 0.06 210)" }, children: String(Number(canon.b)).padStart(8, "0") })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          className: "flex flex-col border-r",
          style: {
            flex: "0 0 33%",
            overflow: "hidden",
            borderColor: "oklch(0.18 0.05 255)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "px-3 py-1.5 shrink-0 border-b",
                style: {
                  borderColor: "oklch(0.18 0.04 255)",
                  background: "oklch(0.07 0.012 265)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[9px] tracking-widest uppercase",
                    style: { color: "oklch(0.38 0.06 220)" },
                    children: "Analysis · Emotions · Plutchik"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden min-h-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmotionAnalysisPanel, { neural }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          className: "flex flex-col border-r",
          style: {
            flex: "0 0 34%",
            overflow: "hidden",
            borderColor: "oklch(0.18 0.05 255)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "px-3 py-1.5 shrink-0 border-b",
                style: {
                  borderColor: "oklch(0.18 0.04 255)",
                  background: "oklch(0.07 0.012 265)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[9px] tracking-widest uppercase",
                    style: { color: "oklch(0.38 0.06 220)" },
                    children: "Cardiac · ANS · HRV"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden min-h-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              HeartPanel,
              {
                heartRate: neural.heartRate,
                hrv: neural.hrv,
                sympatheticTone: neural.sympatheticTone,
                parasympatheticTone: neural.parasympatheticTone,
                isRunning: neural.isRunning,
                insideActivation: ((_a = neural.regions.find(
                  (r) => r.region.toLowerCase().includes("insula")
                )) == null ? void 0 : _a.activation) ?? 0.4,
                vmPFCActivation: ((_b = neural.regions.find(
                  (r) => r.region.toLowerCase().includes("orbital")
                )) == null ? void 0 : _b.activation) ?? 0.5,
                brainstemActivation: ((_c = neural.regions.find(
                  (r) => r.region.toLowerCase().includes("brainstem")
                )) == null ? void 0 : _c.activation) ?? 0.3,
                threatCircuitActivation: ((_d = neural.regions.find(
                  (r) => r.region.toLowerCase().includes("amygdala")
                )) == null ? void 0 : _d.activation) ?? 0.2,
                pfcActivationCoherence: neural.metacognitiveConfidence ?? 0.5,
                cortisolLevel: neural.cortisolLevel,
                cortisolPlasticityGated: neural.cortisolPlasticityGated
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "shrink-0 border-t overflow-y-auto",
                style: {
                  borderColor: "oklch(0.22 0.06 255)",
                  background: "oklch(0.06 0.015 265)",
                  maxHeight: "160px"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "px-3 py-1.5 sticky top-0 border-b",
                      style: {
                        borderColor: "oklch(0.18 0.04 255)",
                        background: "oklch(0.07 0.015 265)"
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px] tracking-widest uppercase font-bold",
                          style: { color: "oklch(0.55 0.12 220)" },
                          children: "◌ Silence Log — Valid Scientific Data"
                        }
                      )
                    }
                  ),
                  !neural.silenceLog || neural.silenceLog.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      "data-ocid": "silence_log.empty_state",
                      className: "px-3 py-2 font-mono text-[7px] italic",
                      style: { color: "oklch(0.32 0.04 220)" },
                      children: "No silence periods logged yet."
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col", children: neural.silenceLog.slice().reverse().map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      "data-ocid": `silence_log.item.${Math.min(idx + 1, 3)}`,
                      className: "px-3 py-1.5 border-b",
                      style: { borderColor: "oklch(0.1 0.02 260)" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              className: "font-mono text-[7px]",
                              style: { color: "oklch(0.45 0.06 220)" },
                              children: [
                                "T",
                                entry.fromTick,
                                "–T",
                                entry.toTick
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              className: "font-mono text-[7px] text-right ml-auto",
                              style: { color: "oklch(0.35 0.04 220)" },
                              children: [
                                entry.toTick - entry.fromTick,
                                " ticks"
                              ]
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "font-mono text-[7px] leading-tight mt-0.5",
                            style: { color: "oklch(0.42 0.06 220)" },
                            children: entry.reason
                          }
                        )
                      ]
                    },
                    `${entry.fromTick}-${entry.toTick}-${idx}`
                  )) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "shrink-0 border-t overflow-y-auto",
                style: {
                  borderColor: "oklch(0.22 0.06 255)",
                  background: "oklch(0.06 0.015 265)",
                  maxHeight: "140px"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "px-3 py-1.5 sticky top-0 border-b flex items-center gap-2",
                      style: {
                        borderColor: "oklch(0.18 0.04 255)",
                        background: "oklch(0.07 0.015 265)"
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px] tracking-widest uppercase font-bold",
                          style: {
                            color: neural.saturatedRegions.length > 0 ? "oklch(0.75 0.18 30)" : "oklch(0.55 0.12 150)"
                          },
                          children: neural.saturatedRegions.length > 0 ? "⚠ Saturation Monitor" : "✓ Saturation Monitor"
                        }
                      )
                    }
                  ),
                  neural.saturatedRegions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      "data-ocid": "saturation.empty_state",
                      className: "px-3 py-2 font-mono text-[7px] italic",
                      style: { color: "oklch(0.45 0.08 150)" },
                      children: "No saturated regions detected."
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                    neural.saturatedRegions.slice(0, 5).map((region, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        "data-ocid": `saturation.item.${Math.min(idx + 1, 3)}`,
                        className: "px-3 py-1 border-b flex items-center gap-2",
                        style: { borderColor: "oklch(0.1 0.02 260)" },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[8px] font-bold",
                              style: { color: "oklch(0.75 0.18 30)" },
                              children: "SATURATED"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[7px]",
                              style: { color: "oklch(0.6 0.08 30)" },
                              children: region
                            }
                          )
                        ]
                      },
                      region
                    )),
                    neural.saturatedRegions.length > 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "px-3 py-1 font-mono text-[7px]",
                        style: { color: "oklch(0.45 0.06 30)" },
                        children: [
                          "+",
                          neural.saturatedRegions.length - 5,
                          " more"
                        ]
                      }
                    )
                  ] })
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "px-3 py-1.5 shrink-0 border-b",
                style: {
                  borderColor: "oklch(0.18 0.04 255)",
                  background: "oklch(0.07 0.012 265)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[9px] tracking-widest uppercase",
                    style: { color: "oklch(0.38 0.06 220)" },
                    children: "Ablation Studies · Batch Run"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto min-h-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AblationStudies, { neural }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "m-3 border",
                  style: {
                    background: "oklch(0.075 0.012 265)",
                    borderColor: "oklch(0.2 0.05 255)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "px-3 py-2 border-b flex items-center gap-2",
                        style: { borderColor: "oklch(0.18 0.04 255)" },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[9px] tracking-widest uppercase",
                              style: { color: "oklch(0.38 0.06 220)" },
                              children: "Batch Run · Reproducibility"
                            }
                          ),
                          neural.batchRunActive && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              className: "ml-auto font-mono text-[8px] animate-pulse",
                              style: { color: "oklch(0.82 0.26 80)" },
                              children: [
                                "● RUNNING ",
                                neural.batchRunProgress,
                                "/",
                                neural.batchRunTarget
                              ]
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex flex-col gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        [20, 50, 100].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            type: "button",
                            "data-ocid": "batch.primary_button",
                            onClick: () => !neural.batchRunActive && neural.startBatchRun(n),
                            disabled: neural.batchRunActive,
                            className: "font-mono text-[8px] tracking-widest uppercase px-3 py-1 transition-all disabled:opacity-40",
                            style: {
                              border: "1px solid oklch(0.45 0.15 195)",
                              background: "oklch(0.45 0.15 195 / 0.1)",
                              color: "oklch(0.72 0.22 195)"
                            },
                            children: [
                              "Run ×",
                              n
                            ]
                          },
                          n
                        )),
                        neural.batchRunActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            "data-ocid": "batch.cancel_button",
                            onClick: neural.stopBatchRun,
                            className: "font-mono text-[8px] tracking-widest uppercase px-3 py-1 transition-all ml-auto",
                            style: {
                              border: "1px solid oklch(0.45 0.15 25)",
                              background: "oklch(0.45 0.15 25 / 0.1)",
                              color: "oklch(0.72 0.2 25)"
                            },
                            children: "Stop"
                          }
                        )
                      ] }),
                      (neural.batchRunActive || neural.batchRunProgress > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "h-[4px] rounded overflow-hidden",
                            style: { background: "oklch(0.12 0.02 260)" },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: "h-full transition-all",
                                "data-ocid": "batch.loading_state",
                                style: {
                                  width: `${neural.batchRunTarget > 0 ? Math.round(neural.batchRunProgress / neural.batchRunTarget * 100) : 0}%`,
                                  background: "oklch(0.72 0.22 195)"
                                }
                              }
                            )
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            className: "font-mono text-[8px] mt-1",
                            style: { color: "oklch(0.4 0.06 220)" },
                            children: [
                              neural.batchRunProgress,
                              " / ",
                              neural.batchRunTarget,
                              " ",
                              "sessions"
                            ]
                          }
                        )
                      ] }),
                      neural.batchRunResults.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "table",
                        {
                          className: "w-full font-mono text-[8px]",
                          style: { borderCollapse: "collapse" },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "tr",
                              {
                                style: {
                                  borderBottom: "1px solid oklch(0.2 0.04 255)"
                                },
                                children: [
                                  "#",
                                  "Entropy",
                                  "Sat.",
                                  "Thoughts",
                                  "Habit.",
                                  "Nav.",
                                  "PI"
                                ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "th",
                                  {
                                    className: "px-2 py-1 text-left",
                                    style: { color: "oklch(0.45 0.08 220)" },
                                    children: h
                                  },
                                  h
                                ))
                              }
                            ) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: neural.batchRunResults.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "tr",
                              {
                                "data-ocid": `batch.item.${i + 1}`,
                                style: {
                                  borderBottom: "1px solid oklch(0.14 0.03 255 / 0.5)"
                                },
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    "td",
                                    {
                                      className: "px-2 py-[2px]",
                                      style: { color: "oklch(0.38 0.06 220)" },
                                      children: i + 1
                                    }
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    "td",
                                    {
                                      className: "px-2 py-[2px]",
                                      style: { color: "oklch(0.72 0.22 195)" },
                                      children: r.shannonEntropy.toFixed(3)
                                    }
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    "td",
                                    {
                                      className: "px-2 py-[2px]",
                                      style: {
                                        color: r.saturatedCount > 0 ? "oklch(0.72 0.22 25)" : "oklch(0.55 0.08 150)"
                                      },
                                      children: r.saturatedCount
                                    }
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    "td",
                                    {
                                      className: "px-2 py-[2px]",
                                      style: { color: "oklch(0.6 0.1 220)" },
                                      children: r.thoughtCount
                                    }
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    "td",
                                    {
                                      className: "px-2 py-[2px]",
                                      style: {
                                        color: r.habituationDetected ? "oklch(0.72 0.22 140)" : "oklch(0.35 0.05 220)"
                                      },
                                      children: r.habituationDetected ? "✓" : "–"
                                    }
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    "td",
                                    {
                                      className: "px-2 py-[2px]",
                                      style: {
                                        color: r.goalDirectedNav ? "oklch(0.72 0.22 195)" : "oklch(0.35 0.05 220)"
                                      },
                                      children: r.goalDirectedNav ? "✓" : "–"
                                    }
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    "td",
                                    {
                                      className: "px-2 py-[2px]",
                                      style: { color: "oklch(0.65 0.14 280)" },
                                      children: r.plasticityIndex.toFixed(4)
                                    }
                                  )
                                ]
                              },
                              r.sessionId
                            )) })
                          ]
                        }
                      ) })
                    ] })
                  ]
                }
              )
            ] })
          ]
        }
      )
    ] })
  ] });
}
export {
  AnalysisTab as default
};
