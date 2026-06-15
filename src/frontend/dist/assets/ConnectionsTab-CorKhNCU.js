import { r as reactExports, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
import { c as createConnectionRegistry, u as updateConnectionWeights, g as getOptimizationRecommendations } from "./connectionRegistry-BpvrHavl.js";
const BG = "oklch(0.06 0.01 265)";
const PANEL = "oklch(0.09 0.015 265)";
const BORDER = "oklch(0.18 0.05 255)";
const CYAN = "oklch(0.72 0.22 195)";
const GREEN = "oklch(0.68 0.28 140)";
const AMBER = "oklch(0.78 0.22 80)";
const RED = "oklch(0.72 0.22 25)";
const MUTED = "oklch(0.38 0.05 220)";
const DIM = "oklch(0.28 0.04 240)";
const GOLD = "oklch(0.78 0.22 80)";
const CIRCUIT_TYPE_COLORS = {
  motor: "#ff6b35",
  sensory: "#00d4ff",
  memory: "#a855f7",
  limbic: "#ec4899",
  regulatory: "#22c55e",
  callosal: "#fbbf24",
  ascending: "#c0d8ff",
  cognitive: "#3b82f6"
};
function inferCircuitType(id) {
  const lower = id.toLowerCase();
  if (lower.includes("motor") || lower.includes("cerebellum") || lower.includes("basal") || lower.includes("striatum"))
    return "motor";
  if (lower.includes("sensory") || lower.includes("visual") || lower.includes("auditory") || lower.includes("thalamus"))
    return "sensory";
  if (lower.includes("hippocampus") || lower.includes("memory") || lower.includes("prediction") || lower.includes("learning"))
    return "memory";
  if (lower.includes("amygdala") || lower.includes("limbic") || lower.includes("emotion") || lower.includes("insula"))
    return "limbic";
  if (lower.includes("cingulate") || lower.includes("regulation") || lower.includes("body") || lower.includes("cardio") || lower.includes("ans"))
    return "regulatory";
  if (lower.includes("brainstem") || lower.includes("arousal") || lower.includes("locus") || lower.includes("vta"))
    return "ascending";
  return "cognitive";
}
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
  width = 80
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "relative overflow-hidden",
      style: {
        width,
        height: 4,
        background: "oklch(0.14 0.03 255)",
        borderRadius: 2
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            width: `${value * 100}%`,
            height: "100%",
            background: color,
            borderRadius: 2,
            transition: "width 0.5s ease"
          }
        }
      )
    }
  );
}
function weightColor(v) {
  if (v > 0.75) return GREEN;
  if (v > 0.55) return CYAN;
  if (v > 0.4) return AMBER;
  return RED;
}
function actionColor(action) {
  const map = {
    strengthen: GREEN,
    promote: CYAN,
    gate: AMBER,
    weaken: AMBER,
    prune: RED
  };
  return map[action] ?? CYAN;
}
function ConnectionRow({ conn }) {
  const wc = weightColor(conn.weight);
  const uc = weightColor(conn.usefulness);
  const circuitType = inferCircuitType(conn.id);
  const circuitColor = CIRCUIT_TYPE_COLORS[circuitType] ?? CIRCUIT_TYPE_COLORS.cognitive;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { borderBottom: "1px solid oklch(0.13 0.03 255)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-1 px-2", style: { maxWidth: 150, overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "font-mono text-[9px] truncate",
          style: { color: "oklch(0.7 0.1 200)" },
          children: conn.id.replace(/_/g, " ")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: circuitColor,
              flexShrink: 0
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[7px] uppercase tracking-wider",
            style: { color: circuitColor, opacity: 0.85 },
            children: circuitType
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: conn.weight, color: wc, width: 50 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[8px]", style: { color: wc }, children: [
        (conn.weight * 100).toFixed(0),
        "%"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: conn.usefulness, color: uc, width: 44 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[8px]", style: { color: uc }, children: [
        (conn.usefulness * 100).toFixed(0),
        "%"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MiniBar,
      {
        value: conn.reliability,
        color: weightColor(conn.reliability),
        width: 36
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "td",
      {
        className: "py-1 px-2 font-mono text-[8px]",
        style: { color: conn.failureAssociation > 0.25 ? RED : DIM },
        children: [
          (conn.failureAssociation * 100).toFixed(0),
          "%"
        ]
      }
    )
  ] });
}
function MotifRow({ motif }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { borderBottom: "1px solid oklch(0.13 0.03 255)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "td",
      {
        className: "py-1 px-2 font-mono text-[9px]",
        style: { color: "oklch(0.65 0.1 200)" },
        children: motif.label
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: motif.activationFreq, color: CYAN, width: 44 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[8px]", style: { color: MUTED }, children: [
        (motif.activationFreq * 100).toFixed(0),
        "%"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: motif.stabilityContribution, color: GREEN, width: 40 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MiniBar,
      {
        value: motif.adaptationContribution,
        color: AMBER,
        width: 40
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: "font-mono text-[8px]",
        style: { color: motif.collapseRisk > 0.2 ? RED : DIM },
        children: [
          (motif.collapseRisk * 100).toFixed(0),
          "%"
        ]
      }
    ) })
  ] });
}
function useHemisphereConnectivity(neural) {
  return reactExports.useMemo(() => {
    const stress = neural.sympatheticTone;
    const isRunning = neural.isRunning;
    const base = isRunning ? 0.62 : 0.48;
    const leftInternalScore = Math.min(
      1,
      base + (1 - stress) * 0.22 + Math.sin(Date.now() * 3e-4) * 0.05
    );
    const rightInternalScore = Math.min(
      1,
      base + stress * 0.18 + Math.cos(Date.now() * 4e-4) * 0.04
    );
    const callosaScore = Math.min(
      1,
      (leftInternalScore + rightInternalScore) / 2 * 0.92
    );
    const coherence = Math.min(
      1,
      1 - Math.abs(leftInternalScore - rightInternalScore) * 1.5
    );
    const dominance = leftInternalScore > rightInternalScore ? "LEFT" : "RIGHT";
    const asymmetryIndex = Math.abs(leftInternalScore - rightInternalScore);
    const topCrossPathways = [
      {
        label: "M1-L ↔ M1-R",
        type: "callosal",
        strength: 0.88 + stress * 0.06
      },
      {
        label: "mPFC-L ↔ mPFC-R",
        type: "callosal",
        strength: 0.86 + (isRunning ? 0.08 : 0)
      },
      { label: "HIPP-L ↔ HIPP-R", type: "callosal", strength: 0.8 },
      { label: "V1-L ↔ V1-R", type: "callosal", strength: 0.82 },
      {
        label: "THAL-L ↔ THAL-R",
        type: "callosal",
        strength: 0.85 + stress * 0.04
      }
    ];
    return {
      leftInternalScore,
      rightInternalScore,
      callosaScore,
      coherence,
      dominance,
      asymmetryIndex,
      topCrossPathways
    };
  }, [neural.sympatheticTone, neural.isRunning]);
}
function HemisphereConnectivityPanel({ neural }) {
  const hemi = useHemisphereConnectivity(neural);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "shrink-0 border-t",
      style: { borderColor: BORDER },
      "data-ocid": "hemisphere.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "Hemisphere Connectivity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-2 py-1.5 rounded border",
                style: {
                  background: "oklch(0.09 0.02 250)",
                  borderColor: "rgba(60,100,255,0.3)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[7px] tracking-widest uppercase mb-1",
                      style: { color: "rgba(80,140,255,0.8)" },
                      children: "Left Hemisphere"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      MiniBar,
                      {
                        value: hemi.leftInternalScore,
                        color: "#3b82f6",
                        width: 50
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[8px] font-bold",
                        style: { color: "#3b82f6" },
                        children: [
                          (hemi.leftInternalScore * 100).toFixed(0),
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
                className: "px-2 py-1.5 rounded border",
                style: {
                  background: "oklch(0.09 0.02 250)",
                  borderColor: "rgba(255,120,50,0.3)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[7px] tracking-widest uppercase mb-1",
                      style: { color: "rgba(255,140,60,0.8)" },
                      children: "Right Hemisphere"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      MiniBar,
                      {
                        value: hemi.rightInternalScore,
                        color: "#f97316",
                        width: 50
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[8px] font-bold",
                        style: { color: "#f97316" },
                        children: [
                          (hemi.rightInternalScore * 100).toFixed(0),
                          "%"
                        ]
                      }
                    )
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: MUTED }, children: "Corpus Callosum" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: hemi.callosaScore, color: GOLD, width: 44 }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono text-[7px] font-bold",
                    style: { color: GOLD },
                    children: [
                      (hemi.callosaScore * 100).toFixed(0),
                      "%"
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: MUTED }, children: "Coherence" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: hemi.coherence, color: GREEN, width: 44 }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono text-[7px] font-bold",
                    style: { color: GREEN },
                    children: [
                      (hemi.coherence * 100).toFixed(0),
                      "%"
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: MUTED }, children: "Dominance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[9px] font-bold px-1.5 py-0.5 rounded text-center",
                  style: {
                    background: hemi.dominance === "LEFT" ? "rgba(60,100,255,0.2)" : "rgba(255,120,50,0.2)",
                    color: hemi.dominance === "LEFT" ? "#3b82f6" : "#f97316",
                    border: `1px solid ${hemi.dominance === "LEFT" ? "rgba(60,100,255,0.4)" : "rgba(255,120,50,0.4)"}`
                  },
                  children: hemi.dominance
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: MUTED }, children: "Asymmetry Index" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px]",
                  style: { color: hemi.asymmetryIndex > 0.2 ? AMBER : GREEN },
                  children: hemi.asymmetryIndex.toFixed(3)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "relative",
                style: {
                  height: 6,
                  background: "oklch(0.14 0.03 255)",
                  borderRadius: 3
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        position: "absolute",
                        left: "50%",
                        top: 0,
                        width: 1,
                        height: "100%",
                        background: "rgba(255,255,255,0.2)"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        position: "absolute",
                        left: `${50 - hemi.leftInternalScore * 48}%`,
                        width: `${hemi.leftInternalScore * 48}%`,
                        height: "100%",
                        background: "rgba(60,100,255,0.6)",
                        borderRadius: "3px 0 0 3px"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        position: "absolute",
                        left: "50%",
                        width: `${hemi.rightInternalScore * 48}%`,
                        height: "100%",
                        background: "rgba(255,120,50,0.6)",
                        borderRadius: "0 3px 3px 0"
                      }
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[6px]",
                  style: { color: "rgba(80,140,255,0.6)" },
                  children: "L"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[6px]",
                  style: { color: "rgba(255,140,60,0.6)" },
                  children: "R"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[7px] tracking-widest uppercase mb-1",
                style: { color: DIM },
                children: "Top Cross-Hemisphere Pathways"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-0.5", children: hemi.topCrossPathways.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-1.5",
                "data-ocid": `hemisphere.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: GOLD,
                        flexShrink: 0
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px] flex-1",
                      style: { color: "oklch(0.65 0.1 200)" },
                      children: p.label
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: p.strength, color: GOLD, width: 48 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: GOLD }, children: [
                    (p.strength * 100).toFixed(0),
                    "%"
                  ] })
                ]
              },
              p.label
            )) })
          ] })
        ] })
      ]
    }
  );
}
function ConnectionsTab({ neural }) {
  const registry = reactExports.useMemo(() => {
    const r = createConnectionRegistry();
    return updateConnectionWeights(r, {
      stressLoad: neural.sympatheticTone,
      sympatheticTone: neural.sympatheticTone,
      isRunning: neural.isRunning
    });
  }, [neural.sympatheticTone, neural.isRunning]);
  const recs = reactExports.useMemo(
    () => getOptimizationRecommendations(registry),
    [registry]
  );
  const couplingPairs = reactExports.useMemo(() => {
    const s = neural.sympatheticTone;
    const isR = neural.isRunning;
    return [
      {
        a: "Body-State",
        b: "Salience",
        strength: Math.min(1, 0.55 + s * 0.25),
        type: "regulatory"
      },
      {
        a: "Cardio/ANS",
        b: "Threshold",
        strength: Math.min(1, 0.49 + s * 0.32),
        type: "regulatory"
      },
      {
        a: "Regulation",
        b: "Policy",
        strength: Math.min(1, 0.62 + (isR ? 0.12 : 0)),
        type: "regulatory"
      },
      {
        a: "Memory",
        b: "Salience",
        strength: Math.min(1, 0.63 + (isR ? 0.1 : 0)),
        type: "memory"
      },
      {
        a: "PredErr",
        b: "Learning",
        strength: Math.min(1, 0.79 + (isR ? 0.08 : 0)),
        type: "ascending"
      },
      {
        a: "Salience",
        b: "WorkMem",
        strength: Math.min(1, 0.74 + (isR ? 0.1 : 0)),
        type: "cognitive"
      }
    ];
  }, [neural.sympatheticTone, neural.isRunning]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex overflow-hidden", style: { background: BG }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "flex flex-col border-r",
        style: { flex: "0 0 42%", overflow: "hidden", borderColor: BORDER },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionHeader, { children: [
            "Connection Classes · ",
            registry.connections.length,
            " Pathways"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto min-h-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "tr",
              {
                style: {
                  background: "oklch(0.08 0.012 265)",
                  borderBottom: `1px solid ${BORDER}`
                },
                children: ["Connection / Type", "Weight", "Useful", "Rel.", "Fail"].map(
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: registry.connections.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              ConnectionRow,
              {
                conn: c,
                "data-ocid": "connections.row"
              },
              c.id
            )) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 border-t", style: { borderColor: BORDER }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "Cross-Layer Coupling · Live" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 grid grid-cols-2 gap-1", children: couplingPairs.map((pair) => {
              const col = CIRCUIT_TYPE_COLORS[pair.type] ?? CYAN;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 px-2 py-1 rounded",
                  style: {
                    background: PANEL,
                    borderLeft: `2px solid ${col}50`
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "font-mono text-[8px]",
                          style: { color: "oklch(0.6 0.1 200)" },
                          children: [
                            pair.a,
                            " → ",
                            pair.b
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: pair.strength, color: col, width: 56 })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] font-bold",
                        style: { color: pair.strength < 0.55 ? AMBER : GREEN },
                        children: pair.strength < 0.55 ? "WEAK" : "OK"
                      }
                    )
                  ]
                },
                `${pair.a}-${pair.b}`
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(HemisphereConnectivityPanel, { neural })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "flex flex-col",
        style: { flex: 1, overflow: "hidden" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionHeader, { children: [
            "Circuit Motif Registry · ",
            registry.motifs.length,
            " Motifs"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                flex: "0 0 auto",
                overflow: "hidden",
                maxHeight: "38%",
                overflowY: "auto"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "tr",
                  {
                    style: {
                      background: "oklch(0.08 0.012 265)",
                      borderBottom: `1px solid ${BORDER}`
                    },
                    children: ["Motif", "Freq", "Stab", "Adapt", "Risk"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "th",
                      {
                        className: "py-1 px-2 text-left font-mono text-[8px] tracking-widest uppercase",
                        style: { color: DIM },
                        children: h
                      },
                      h
                    ))
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: registry.motifs.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(MotifRow, { motif: m }, m.id)) })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col border-t",
              style: { borderColor: BORDER, flex: 1, overflow: "hidden" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "Optimization Engine · Top Recommendations" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-2 flex flex-col gap-1.5", children: [
                  recs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      "data-ocid": "connections.empty_state",
                      className: "p-4 text-center font-mono text-[9px]",
                      style: { color: DIM },
                      children: "No recommendations — system within bounds"
                    }
                  ),
                  recs.map((rec, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      "data-ocid": `connections.item.${i + 1}`,
                      className: "px-3 py-2 border flex flex-col gap-0.5",
                      style: {
                        background: PANEL,
                        borderColor: `${actionColor(rec.action)}40`,
                        borderLeft: `2px solid ${actionColor(rec.action)}`
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[9px]",
                              style: { color: "oklch(0.65 0.1 200)" },
                              children: rec.connectionId.replace(/_/g, " ")
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5",
                              style: {
                                background: `${actionColor(rec.action)}20`,
                                color: actionColor(rec.action),
                                border: `1px solid ${actionColor(rec.action)}40`
                              },
                              children: rec.action
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[8px]", style: { color: MUTED }, children: rec.reason }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          MiniBar,
                          {
                            value: rec.priority,
                            color: actionColor(rec.action),
                            width: 120
                          }
                        ) })
                      ]
                    },
                    rec.connectionId
                  ))
                ] })
              ]
            }
          )
        ]
      }
    )
  ] });
}
export {
  ConnectionsTab as default
};
