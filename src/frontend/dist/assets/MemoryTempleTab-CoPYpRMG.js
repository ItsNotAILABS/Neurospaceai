import { B as useMemoryTempleState, D as useExtendedOrganState, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
const PHI = 1.618033988749895;
const C = {
  bg: "oklch(0.055 0.012 265)",
  panel: "oklch(0.085 0.015 265)",
  panelDeep: "oklch(0.065 0.012 265)",
  border: "oklch(0.18 0.05 255)",
  borderDim: "oklch(0.13 0.04 255)",
  cyan: "oklch(0.72 0.22 195)",
  purple: "oklch(0.72 0.22 280)",
  gold: "oklch(0.82 0.22 80)",
  goldDim: "oklch(0.82 0.22 80 / 0.15)",
  red: "oklch(0.65 0.25 25)",
  green: "oklch(0.68 0.28 140)",
  dim: "oklch(0.38 0.05 220)",
  dimDeep: "oklch(0.26 0.04 220)",
  text: "oklch(0.85 0.05 210)"
};
function attractorStrength(lineageDepth) {
  const d = Number(lineageDepth);
  return d * PHI ** d;
}
function biasColor(bias) {
  if (bias === "episodic") return C.cyan;
  if (bias === "semantic") return C.purple;
  if (bias === "doctrine") return C.gold;
  return C.red;
}
function biasLabel(bias) {
  return bias.toUpperCase();
}
function goldIntensity(strength, maxStr) {
  if (maxStr <= 0) return C.goldDim;
  const t = Math.min(strength / maxStr, 1);
  const l = 0.15 + t * 0.67;
  const c = 0.04 + t * 0.18;
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} 80)`;
}
function SkeletonBlock({
  h = "h-8",
  w = "w-full"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `${h} ${w} rounded`,
      style: {
        background: "oklch(0.12 0.02 265)",
        animation: "terminal-cursor 1.2s ease-in-out infinite"
      }
    }
  );
}
function MemoryOffline() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "h-full flex flex-col items-center justify-center gap-3",
      style: { background: C.bg },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "font-mono text-[11px] tracking-[0.3em] uppercase font-bold",
            style: {
              color: C.red,
              textShadow: `0 0 12px ${C.red}`,
              animation: "terminal-cursor 1.4s step-end infinite"
            },
            "data-ocid": "memory-temple.offline.label",
            children: "◆ MEMORY FIELD OFFLINE — RECONNECTING"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "font-mono text-[8px] tracking-[0.2em]",
            style: { color: C.dim },
            children: "POLLING AT 873ms · PEDESTAL NETWORK AWAITING"
          }
        )
      ]
    }
  );
}
function PedestalCard({
  id,
  lineageDepth,
  phaseBias,
  active,
  maxStrength
}) {
  const strength = attractorStrength(lineageDepth);
  const accentColor = goldIntensity(strength, maxStrength);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative border rounded p-2.5 space-y-1.5",
      style: {
        borderColor: active ? accentColor : C.borderDim,
        background: C.panelDeep,
        boxShadow: active ? `0 0 8px ${accentColor}30` : "none",
        transition: "border-color 0.4s, box-shadow 0.4s"
      },
      "data-ocid": `memory-temple.pedestal.${id}.card`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[8px] tracking-[0.2em]",
              style: { color: accentColor },
              children: [
                "PDL-",
                String(id).padStart(2, "0")
              ]
            }
          ),
          active && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "inline-block w-[6px] h-[6px] rounded-full",
              style: {
                background: C.green,
                boxShadow: `0 0 6px ${C.green}`,
                animation: "terminal-cursor 1.6s ease-in-out infinite"
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[7px] tracking-[0.15em]",
              style: { color: C.dimDeep },
              children: "LINEAGE DEPTH"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[9px] font-bold",
              style: { color: C.gold },
              children: String(lineageDepth)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[7px] tracking-[0.15em]",
              style: { color: C.dimDeep },
              children: "PHASE BIAS"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[9px]", style: { color: C.cyan }, children: phaseBias.toFixed(4) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[7px] tracking-[0.15em]",
              style: { color: C.dimDeep },
              children: "ATTRACTOR"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[9px] font-bold",
              style: { color: accentColor },
              children: strength.toFixed(4)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-full h-[2px] rounded-full",
            style: { background: C.borderDim },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full",
                style: {
                  width: `${Math.min(strength / Math.max(maxStrength, 1) * 100, 100)}%`,
                  background: accentColor,
                  boxShadow: `0 0 4px ${accentColor}`,
                  transition: "width 0.5s"
                }
              }
            )
          }
        )
      ]
    }
  );
}
function TraceCard({
  type,
  color,
  borderColor,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border rounded p-3 space-y-2",
      style: {
        borderColor: C.border,
        borderLeftColor: borderColor,
        borderLeftWidth: "3px",
        background: C.panel
      },
      "data-ocid": `memory-temple.trace.${type.toLowerCase()}.card`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "font-mono text-[9px] tracking-[0.2em] font-bold uppercase",
            style: { color },
            children: type
          }
        ),
        children
      ]
    }
  );
}
function StatRow({
  label,
  value,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-baseline", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-mono text-[7.5px] tracking-[0.12em]",
        style: { color: C.dim },
        children: label
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-mono text-[8.5px] font-bold",
        style: { color: color ?? C.text },
        children: value
      }
    )
  ] });
}
function RetrievalBiasDisplay({
  heartCoherence,
  brainCoherence,
  gutCoherence,
  leader
}) {
  const leaderColor = biasColor(leader);
  const gauges = [
    { label: "HEART", value: heartCoherence, color: C.red },
    { label: "BRAIN", value: brainCoherence, color: C.cyan },
    { label: "GUT-BRAIN", value: gutCoherence, color: C.purple }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border rounded p-4 space-y-4",
      style: {
        borderColor: leaderColor,
        background: C.panel,
        transition: "border-color 0.5s"
      },
      "data-ocid": "memory-temple.retrieval-bias.display",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[8px] tracking-[0.2em]",
              style: { color: C.dim },
              children: "DOMINANT RETRIEVAL CHANNEL"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[20px] font-bold tracking-[0.15em]",
              style: {
                color: leaderColor,
                textShadow: `0 0 20px ${leaderColor}60`,
                transition: "color 0.5s, text-shadow 0.5s"
              },
              children: biasLabel(leader)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: gauges.map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[7px] tracking-[0.15em]",
              style: { color: C.dim },
              children: label
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "relative w-full h-[80px] flex items-end justify-center",
              style: { background: C.panelDeep, borderRadius: "4px" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-full absolute bottom-0 rounded-b",
                    style: {
                      height: `${value * 100}%`,
                      background: `${color}30`,
                      borderBottom: `2px solid ${color}`,
                      transition: "height 0.5s"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "relative z-10 font-mono text-[10px] font-bold mb-1",
                    style: { color },
                    children: value.toFixed(3)
                  }
                )
              ]
            }
          )
        ] }, label)) })
      ]
    }
  );
}
function AnalystQueue({
  items
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border rounded overflow-hidden",
      style: { borderColor: C.border, background: C.panel },
      "data-ocid": "memory-temple.analyst-queue.list",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-2 border-b flex items-center justify-between",
            style: { borderColor: C.borderDim, background: C.panelDeep },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[9px] tracking-[0.2em] font-bold",
                  style: { color: C.purple },
                  children: "ANALYST RECOMMENDATIONS"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[7px] tracking-[0.1em]",
                  style: { color: C.dim },
                  children: [
                    "LAST ",
                    items.length,
                    " CYCLES"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto", style: { maxHeight: "200px" }, children: items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[8px] tracking-[0.15em]",
            style: { color: C.dimDeep },
            children: "QUEUE EMPTY — AWAITING ANALYST CYCLE"
          }
        ) }) : items.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-2 border-b",
            style: { borderColor: C.borderDim },
            "data-ocid": `memory-temple.analyst-queue.item.${i}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[7px]",
                      style: { color: C.dim },
                      children: [
                        "CYC-",
                        String(item.analyst_cycle)
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[7.5px]",
                      style: { color: C.gold },
                      children: [
                        "PDL-",
                        String(item.lineage_pattern)
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[7px]",
                      style: { color: C.cyan },
                      children: [
                        "CONSOL:",
                        item.consolidate.length
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[7px]",
                      style: { color: C.purple },
                      children: [
                        "SURF:",
                        item.surface.length
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono text-[7.5px] font-bold",
                    style: { color: C.text },
                    children: [
                      (item.confidence * 100).toFixed(1),
                      "%"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-full h-[2px] rounded-full",
                  style: { background: C.borderDim },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full rounded-full",
                      style: {
                        width: `${item.confidence * 100}%`,
                        background: item.confidence > 0.7 ? C.green : item.confidence > 0.4 ? C.gold : C.red,
                        transition: "width 0.3s"
                      }
                    }
                  )
                }
              )
            ]
          },
          i
        )) })
      ]
    }
  );
}
function MemoryCoherenceGauge({ value }) {
  const pct = value * 100;
  const gaugeColor = value > 0.7 ? C.green : value > 0.4 ? C.gold : C.red;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border rounded p-4 flex flex-col items-center gap-3",
      style: {
        borderColor: gaugeColor,
        background: C.panel,
        transition: "border-color 0.5s"
      },
      "data-ocid": "memory-temple.coherence-gauge.display",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "font-mono text-[8px] tracking-[0.25em]",
            style: { color: C.dim },
            children: "MEMORY FIELD COHERENCE"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-32 h-16 flex items-end justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "svg",
            {
              viewBox: "0 0 128 72",
              className: "absolute inset-0 w-full h-full",
              "aria-label": "Memory coherence arc gauge",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Memory coherence arc gauge" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "path",
                  {
                    d: "M 8 64 A 56 56 0 0 1 120 64",
                    fill: "none",
                    stroke: "oklch(0.15 0.03 265)",
                    strokeWidth: "8",
                    strokeLinecap: "round"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "path",
                  {
                    d: "M 8 64 A 56 56 0 0 1 120 64",
                    fill: "none",
                    stroke: gaugeColor,
                    strokeWidth: "8",
                    strokeLinecap: "round",
                    strokeDasharray: `${pct / 100 * 175.9} 175.9`,
                    style: {
                      filter: `drop-shadow(0 0 4px ${gaugeColor})`,
                      transition: "stroke-dasharray 0.6s, stroke 0.5s"
                    }
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[22px] font-bold leading-none relative z-10",
              style: {
                color: gaugeColor,
                textShadow: `0 0 16px ${gaugeColor}60`,
                animation: "organism-pulse 873ms ease-in-out infinite",
                transition: "color 0.5s"
              },
              children: value.toFixed(4)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-full h-[3px] rounded-full",
              style: { background: "oklch(0.15 0.03 265)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full rounded-full",
                  style: {
                    width: `${pct}%`,
                    background: gaugeColor,
                    boxShadow: `0 0 6px ${gaugeColor}`,
                    transition: "width 0.6s"
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: C.dimDeep }, children: "0.0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: C.dimDeep }, children: "1.0" })
          ] })
        ] })
      ]
    }
  );
}
function MemoryTempleTab() {
  const { data, isLoading, isError } = useMemoryTempleState();
  const { data: organs } = useExtendedOrganState();
  if (isError) return /* @__PURE__ */ jsxRuntimeExports.jsx(MemoryOffline, {});
  const maxStrength = data ? Math.max(
    ...data.pedestals.map((p) => attractorStrength(p.lineage_depth)),
    1
  ) : 1;
  const heartCoh = (organs == null ? void 0 : organs.heart) ?? 0;
  const brainCoh = (organs == null ? void 0 : organs.brain) ?? 0;
  const gutCoh = (organs == null ? void 0 : organs.intestine) ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full overflow-y-auto", style: { background: C.bg }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "border-b pb-3 flex items-end justify-between",
        style: { borderColor: C.borderDim },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h1",
              {
                className: "font-mono text-[14px] font-bold tracking-[0.3em] uppercase",
                style: {
                  color: C.gold,
                  textShadow: `0 0 20px ${C.gold}50`,
                  animation: "organism-pulse 873ms ease-in-out infinite"
                },
                "data-ocid": "memory-temple.header.title",
                children: "◈ MEMORY TEMPLE"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "font-mono text-[8px] tracking-[0.2em] mt-0.5",
                style: { color: C.dim },
                children: "Pedestal Coupling Network — Active Lineage Anchors"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: data && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[7px] tracking-[0.15em]",
                  style: { color: C.dim },
                  children: "ANALYST CYCLE"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[10px] font-bold",
                  style: { color: C.purple },
                  children: String(data.last_analyst_cycle)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[7px] tracking-[0.15em]",
                  style: { color: C.dim },
                  children: "BIAS"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[10px] font-bold",
                  style: { color: biasColor(data.current_retrieval_bias) },
                  children: biasLabel(data.current_retrieval_bias)
                }
              )
            ] })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "font-mono text-[8px] tracking-[0.2em] mb-2",
          style: { color: C.dim },
          children: "PEDESTAL NODES — LINEAGE COUPLING MATRIX"
        }
      ),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: Array.from({ length: 12 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
        /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonBlock, { h: "h-32" }, i)
      )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid gap-2",
          style: { gridTemplateColumns: "repeat(4, 1fr)" },
          "data-ocid": "memory-temple.pedestal-grid",
          children: ((data == null ? void 0 : data.pedestals) ?? []).slice(0, 12).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            PedestalCard,
            {
              id: p.id,
              lineageDepth: p.lineage_depth,
              phaseBias: p.phase_bias,
              active: p.active,
              maxStrength
            },
            String(p.id)
          ))
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "font-mono text-[8px] tracking-[0.2em] mb-2",
          style: { color: C.dim },
          children: "MEMORY TRACE FIELDS"
        }
      ),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: Array.from({ length: 4 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
        /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonBlock, { h: "h-24" }, i)
      )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TraceCard, { type: "EPISODIC", color: C.cyan, borderColor: C.cyan, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatRow,
            {
              label: "COUNT",
              value: String((data == null ? void 0 : data.episodic_count) ?? 0n),
              color: C.cyan
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatRow,
            {
              label: "DOMINANT BIAS",
              value: (data == null ? void 0 : data.current_retrieval_bias) === "episodic" ? "ACTIVE" : "PASSIVE",
              color: (data == null ? void 0 : data.current_retrieval_bias) === "episodic" ? C.green : C.dim
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TraceCard,
          {
            type: "SEMANTIC",
            color: C.purple,
            borderColor: C.purple,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatRow,
                {
                  label: "COUNT",
                  value: String((data == null ? void 0 : data.semantic_count) ?? 0n),
                  color: C.purple
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatRow,
                {
                  label: "DOMINANT BIAS",
                  value: (data == null ? void 0 : data.current_retrieval_bias) === "semantic" ? "ACTIVE" : "PASSIVE",
                  color: (data == null ? void 0 : data.current_retrieval_bias) === "semantic" ? C.green : C.dim
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TraceCard, { type: "DOCTRINE", color: C.gold, borderColor: C.gold, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatRow,
            {
              label: "COUNT",
              value: String((data == null ? void 0 : data.doctrine_count) ?? 0n),
              color: C.gold
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatRow,
            {
              label: "DOMINANT BIAS",
              value: (data == null ? void 0 : data.current_retrieval_bias) === "doctrine" ? "ACTIVE" : "PASSIVE",
              color: (data == null ? void 0 : data.current_retrieval_bias) === "doctrine" ? C.green : C.dim
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TraceCard, { type: "MISSION", color: C.red, borderColor: C.red, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatRow,
            {
              label: "COUNT",
              value: String((data == null ? void 0 : data.mission_count) ?? 0n),
              color: C.red
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatRow,
            {
              label: "DOMINANT BIAS",
              value: (data == null ? void 0 : data.current_retrieval_bias) === "mission" ? "ACTIVE" : "PASSIVE",
              color: (data == null ? void 0 : data.current_retrieval_bias) === "mission" ? C.green : C.dim
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid md:grid-cols-2 gap-4", children: [
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonBlock, { h: "h-48" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        RetrievalBiasDisplay,
        {
          heartCoherence: heartCoh,
          brainCoherence: brainCoh,
          gutCoherence: gutCoh,
          leader: (data == null ? void 0 : data.current_retrieval_bias) ?? "episodic"
        }
      ),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonBlock, { h: "h-48" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnalystQueue, { items: (data == null ? void 0 : data.analyst_queue) ?? [] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "flex justify-center", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonBlock, { h: "h-36", w: "w-64" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MemoryCoherenceGauge, { value: (data == null ? void 0 : data.memory_coherence) ?? 0 }) }) }),
    !isLoading && data && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "border rounded px-4 py-2 flex items-center justify-between",
        style: { borderColor: C.borderDim, background: C.panelDeep },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8px] tracking-[0.2em]",
              style: { color: C.dim },
              children: "PEDESTAL PHASE SUM"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[10px] font-bold",
              style: { color: C.cyan },
              children: data.pedestal_phase_sum.toFixed(4)
            }
          )
        ]
      }
    )
  ] }) });
}
export {
  MemoryTempleTab as default
};
