import { j as jsxRuntimeExports, u as useActor, a as useQuery, r as reactExports } from "./index-CGYrnU7d.js";
const PHI = 1.618033988749895;
const PHI2 = PHI * PHI;
const PHI3 = PHI2 * PHI;
const PHI4 = PHI3 * PHI;
const C = {
  bg: "oklch(0.055 0.012 265)",
  panel: "oklch(0.085 0.015 265)",
  panelDeep: "oklch(0.07 0.012 265)",
  border: "oklch(0.18 0.05 255)",
  gold: "oklch(0.82 0.22 80)",
  amber: "oklch(0.75 0.22 65)",
  cyan: "oklch(0.72 0.22 195)",
  violet: "oklch(0.72 0.22 280)",
  green: "oklch(0.68 0.28 140)",
  orange: "oklch(0.72 0.22 55)",
  red: "oklch(0.65 0.25 25)",
  dim: "oklch(0.38 0.05 220)",
  dimmer: "oklch(0.28 0.04 240)"
};
function useCycleState() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["cycleState"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCycleState();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 873,
    staleTime: 800
  });
}
function fmt4(n) {
  return n.toFixed(4);
}
function fmtBig(n) {
  return Math.floor(n).toLocaleString();
}
function fmtCycl(n) {
  return n.toFixed(6);
}
function HeartDot({ color }) {
  const [on, setOn] = reactExports.useState(true);
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    ref.current = setInterval(() => setOn((v) => !v), 873);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "inline-block w-[6px] h-[6px] rounded-full transition-all",
      style: {
        background: on ? color : "transparent",
        border: `1px solid ${color}`,
        boxShadow: on ? `0 0 5px ${color}` : "none",
        transition: "all 0.3s"
      }
    }
  );
}
function FlowArrow({ label, color }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 py-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1", style: { background: `${color}30` } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-mono text-[9px] tracking-[0.18em] uppercase px-2",
        style: { color },
        children: label
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1", style: { background: `${color}30` } })
  ] });
}
function CoreCard({
  label,
  formula,
  value,
  subtitle,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border rounded p-3 space-y-1.5 flex-1 min-w-0",
      style: { borderColor: `${color}40`, background: `${color}08` },
      "data-ocid": `cycles.core.${label.toLowerCase().replace(/\s+/g, "_")}.card`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(HeartDot, { color }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8px] tracking-widest uppercase",
              style: { color },
              children: label
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[11px]", style: { color: C.dimmer }, children: formula }),
        value !== null ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "font-mono text-[22px] font-bold leading-none",
            style: { color, textShadow: `0 0 20px ${color}40` },
            children: fmt4(value)
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-6 w-20 rounded animate-pulse",
            style: { background: `${color}20` }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[8px]", style: { color: C.dim }, children: subtitle })
      ]
    }
  );
}
function EngineCard({
  label,
  formula,
  value,
  subtitle,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border rounded p-3 space-y-1.5 flex-1 min-w-0",
      style: { borderColor: `${color}40`, background: `${color}06` },
      "data-ocid": `cycles.engine.${label.toLowerCase().replace(/\s+/g, "_")}.card`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "font-mono text-[8px] tracking-widest uppercase",
            style: { color },
            children: [
              "⚙ ",
              label
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px]", style: { color: C.dimmer }, children: formula }),
        value !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "font-mono text-[20px] font-bold leading-none",
            style: { color, textShadow: `0 0 16px ${color}40` },
            children: [
              fmtCycl(value),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] ml-1", style: { color: C.dim }, children: "CYCL" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-6 w-20 rounded animate-pulse",
            style: { background: `${color}20` }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[8px]", style: { color: C.dim }, children: subtitle })
      ]
    }
  );
}
function TotalBar({
  label,
  value,
  color,
  large
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border rounded px-4 py-2 flex items-center justify-between",
      style: { borderColor: `${color}50`, background: `${color}0a` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[9px] tracking-widest uppercase",
            style: { color: C.dim },
            children: label
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `font-mono font-bold ${large ? "text-[20px]" : "text-[14px]"}`,
            style: { color, textShadow: `0 0 12px ${color}50` },
            children: value
          }
        )
      ]
    }
  );
}
function ReserveBar({
  actual,
  target,
  isDeficit
}) {
  const pct = target > 0 ? Math.min(actual / target * 100, 100) : 0;
  const barColor = isDeficit ? C.red : C.green;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", "data-ocid": "cycles.reserve.progress", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex justify-between font-mono text-[8px]",
        style: { color: C.dim },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "TARGET: ",
            fmtBig(target)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "ACTUAL: ",
            fmtBig(actual)
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "relative h-3 rounded",
        style: { background: "oklch(0.12 0.02 255)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute left-0 top-0 h-full rounded transition-all duration-700",
            style: {
              width: `${pct}%`,
              background: barColor,
              boxShadow: `0 0 8px ${barColor}60`
            }
          }
        )
      }
    )
  ] });
}
function CyclesTab() {
  const q = useCycleState();
  const d = q.data;
  const isFirstLoad = q.isLoading && !d;
  const cores = (d == null ? void 0 : d.coreState) ?? null;
  const engines = (d == null ? void 0 : d.engineState) ?? null;
  const conv = (d == null ? void 0 : d.conversionState) ?? null;
  const beats = cores ? Number(cores.beats) : 0;
  const totalConversions = engines ? Number(engines.total_conversions) : 0;
  const jubileeCount = conv ? Number(conv.jubilee_count) : 0;
  const nextJubilee = 144 - beats % 144;
  const isDeficit = conv ? conv.deficit > 0 : false;
  const targetBeat = conv ? conv.target_per_beat * PHI2 : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "h-full overflow-y-auto",
      style: { background: C.bg },
      "data-ocid": "cycles.page",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3 max-w-5xl mx-auto pb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h2",
              {
                className: "font-mono text-[11px] font-bold tracking-[0.25em] uppercase",
                style: { color: C.gold },
                children: "◈ SOVEREIGN CYCLE LOOP"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "font-mono text-[8px] tracking-[0.15em]",
                style: { color: C.dim },
                children: [
                  "CORES → ENGINES → CYCL → RESERVE · PHI = ",
                  PHI.toFixed(4)
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(HeartDot, { color: C.gold }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px]",
                style: { color: d ? C.green : C.amber },
                children: isFirstLoad ? "CONNECTING TO LOOP..." : d ? "LOOP ACTIVE" : "SYNCING"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-3 space-y-3",
            style: { borderColor: C.border, background: C.panel },
            "data-ocid": "cycles.cores.section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-[0.2em] uppercase",
                  style: { color: C.dim },
                  children: "TIER I — THE THREE CORES"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CoreCard,
                  {
                    label: "Genesis Core",
                    formula: `PHI⁴ × 7.83 | PHI⁴ = ${PHI4.toFixed(4)}`,
                    value: (cores == null ? void 0 : cores.genesis) ?? null,
                    subtitle: "base rate: 11.09",
                    color: C.gold
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CoreCard,
                  {
                    label: "Resonance Core",
                    formula: `PHI³ × coherence | PHI³ = ${PHI3.toFixed(4)}`,
                    value: (cores == null ? void 0 : cores.resonance) ?? null,
                    subtitle: cores ? `coherence input: ${(cores.resonance / PHI3).toFixed(4)}` : "awaiting coherence",
                    color: C.cyan
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CoreCard,
                  {
                    label: "Field Core",
                    formula: `PHI² × Fibonacci gate | PHI² = ${PHI2.toFixed(4)}`,
                    value: (cores == null ? void 0 : cores.field) ?? null,
                    subtitle: cores ? `fib idx: ${Math.round(cores.field / PHI2)}` : "awaiting field gate",
                    color: C.violet
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TotalBar,
                {
                  label: "TOTAL CORE OUTPUT",
                  value: cores ? fmt4(cores.total) : "——",
                  color: C.amber
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FlowArrow, { label: "▼ CORE OUTPUT FEEDS ENGINES ▼", color: C.amber }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-3 space-y-3",
            style: { borderColor: C.border, background: C.panel },
            "data-ocid": "cycles.engines.section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-[0.2em] uppercase",
                  style: { color: C.dim },
                  children: "TIER II — THE THREE ENGINES"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  EngineCard,
                  {
                    label: "Prime Engine",
                    formula: "×PHI",
                    value: (engines == null ? void 0 : engines.prime_cycl) ?? null,
                    subtitle: `efficiency: ${PHI.toFixed(3)}`,
                    color: C.gold
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  EngineCard,
                  {
                    label: "Harmonic Engine",
                    formula: "×(7.83 / PHI²)",
                    value: (engines == null ? void 0 : engines.harmonic_cycl) ?? null,
                    subtitle: "efficiency: 2.993",
                    color: C.green
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  EngineCard,
                  {
                    label: "Fibonacci Engine",
                    formula: "×Fib[n] / 233",
                    value: (engines == null ? void 0 : engines.fibonacci_cycl) ?? null,
                    subtitle: engines ? `${totalConversions.toLocaleString()} conversions` : "awaiting conversions",
                    color: C.orange
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "border rounded px-4 py-3 text-center",
                  style: { borderColor: `${C.gold}60`, background: `${C.gold}08` },
                  "data-ocid": "cycles.total_cycl.display",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "font-mono text-[8px] tracking-widest uppercase mb-1",
                        style: { color: C.dim },
                        children: "TOTAL CYCL MINTED THIS SESSION"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "font-mono text-[28px] font-bold",
                        style: { color: C.gold, textShadow: `0 0 30px ${C.gold}50` },
                        children: [
                          engines ? fmtCycl(engines.total_cycl) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[14px]", style: { color: C.dim }, children: "——" }),
                          engines && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12px] ml-2", style: { color: C.amber }, children: "CYCL" })
                        ]
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FlowArrow, { label: "▼ CYCL CONVERTS TO ICP CYCLES ▼", color: C.green }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border-2 rounded p-4 space-y-3",
            style: { borderColor: `${C.gold}60`, background: C.panelDeep },
            "data-ocid": "cycles.reserve.section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[13px] font-bold tracking-[0.3em] uppercase",
                    style: { color: C.gold, textShadow: `0 0 20px ${C.gold}60` },
                    children: "◈ CYCLE RESERVE"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "font-mono text-[9px] tracking-[0.15em]",
                    style: { color: C.dim },
                    children: [
                      "1 CYCL = PHI × 127.7ms =",
                      " ",
                      conv ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: C.cyan }, children: [
                        conv.conversion_rate.toFixed(4),
                        " cycles"
                      ] }) : "——"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-2", "data-ocid": "cycles.reserve.amount", children: conv ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "font-mono text-[42px] font-bold leading-none",
                  style: { color: C.gold, textShadow: `0 0 40px ${C.gold}50` },
                  children: [
                    fmtBig(conv.cycle_reserve),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "font-mono text-[10px] mt-1",
                        style: { color: C.amber },
                        children: "ICP CYCLES IN RESERVE"
                      }
                    )
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-12 w-48 rounded mx-auto animate-pulse",
                  style: { background: `${C.gold}20` }
                }
              ) }),
              conv && /* @__PURE__ */ jsxRuntimeExports.jsx(
                ReserveBar,
                {
                  actual: conv.cycle_reserve,
                  target: targetBeat,
                  isDeficit
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "border rounded p-3",
                    style: {
                      borderColor: isDeficit ? `${C.red}60` : `${C.dimmer}`,
                      background: isDeficit ? `${C.red}08` : C.panel
                    },
                    "data-ocid": "cycles.deficit.display",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "font-mono text-[8px] tracking-widest uppercase mb-1",
                          style: { color: C.dim },
                          children: "DEFICIT"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "font-mono text-[16px] font-bold",
                          style: { color: isDeficit ? C.red : C.dimmer },
                          children: conv ? fmtBig(conv.deficit) : "——"
                        }
                      ),
                      isDeficit && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "font-mono text-[7px] mt-1",
                          style: { color: C.amber },
                          children: "ORGANISM NEEDS MORE CYCLES"
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "border rounded p-3",
                    style: {
                      borderColor: !isDeficit && conv && conv.surplus > 0 ? `${C.green}60` : `${C.dimmer}`,
                      background: !isDeficit && conv && conv.surplus > 0 ? `${C.green}08` : C.panel
                    },
                    "data-ocid": "cycles.surplus.display",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "font-mono text-[8px] tracking-widest uppercase mb-1",
                          style: { color: C.dim },
                          children: "SURPLUS"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "font-mono text-[16px] font-bold",
                          style: { color: conv && conv.surplus > 0 ? C.green : C.dimmer },
                          children: conv ? fmtBig(conv.surplus) : "——"
                        }
                      ),
                      conv && conv.surplus > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "font-mono text-[7px] mt-1",
                          style: { color: C.green },
                          children: [
                            "COMPOUNDING AT PHI⁻¹ = ",
                            (1 / PHI).toFixed(4)
                          ]
                        }
                      )
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "border rounded p-3",
                    style: {
                      borderColor: `${C.violet}40`,
                      background: `${C.violet}06`
                    },
                    "data-ocid": "cycles.jubilee.display",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "font-mono text-[8px] tracking-widest uppercase mb-1",
                          style: { color: C.dim },
                          children: "JUBILEE COUNT"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "font-mono text-[18px] font-bold",
                          style: { color: C.violet },
                          children: jubileeCount
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "font-mono text-[8px] mt-1",
                          style: { color: C.dim },
                          children: [
                            "NEXT: ",
                            nextJubilee,
                            " BEATS · INTERVAL: 144"
                          ]
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "border rounded p-3",
                    style: {
                      borderColor: `${C.amber}40`,
                      background: `${C.amber}06`
                    },
                    "data-ocid": "cycles.total_produced.display",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "font-mono text-[8px] tracking-widest uppercase mb-1",
                          style: { color: C.dim },
                          children: "TOTAL PRODUCED ALL-TIME"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "font-mono text-[18px] font-bold",
                          style: { color: C.amber },
                          children: conv ? fmtCycl(conv.total_produced) : "——"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "font-mono text-[8px] mt-1",
                          style: { color: C.dim },
                          children: "CYCL"
                        }
                      )
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
            className: "border rounded px-3 py-2 flex items-center justify-between flex-wrap gap-2",
            style: { borderColor: `${C.gold}30`, background: `${C.gold}05` },
            "data-ocid": "cycles.status.bar",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[8px] tracking-[0.12em]",
                  style: { color: C.dim },
                  children: "SOVEREIGN CYCLE LOOP ACTIVE"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[8px]", style: { color: C.cyan }, children: [
                  beats.toLocaleString(),
                  " BEATS"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.dimmer }, children: "·" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[8px]", style: { color: C.orange }, children: [
                  totalConversions.toLocaleString(),
                  " CONVERSIONS"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.dimmer }, children: "·" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] tracking-[0.1em]",
                    style: { color: C.gold },
                    children: "CORES → ENGINES → CYCL → RESERVE"
                  }
                )
              ] })
            ]
          }
        )
      ] })
    }
  );
}
export {
  CyclesTab as default
};
