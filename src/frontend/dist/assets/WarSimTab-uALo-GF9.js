import { v as useFactionBrains, w as useWorldStructures, x as useEscalationTier, y as useIdentityTraits, r as reactExports, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
const C = {
  bg: "oklch(0.06 0.01 265)",
  panel: "oklch(0.09 0.015 265)",
  border: "oklch(0.2 0.05 255)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.82 0.22 80)",
  green: "oklch(0.68 0.28 140)",
  dim: "oklch(0.38 0.05 220)",
  text: "oklch(0.85 0.05 210)",
  amber: "oklch(0.78 0.22 80)",
  red: "oklch(0.65 0.25 25)",
  purple: "oklch(0.72 0.22 280)"
};
const FACTION_NAMES = ["SOVEREIGN", "OUTLAW", "OUTCAST", "WARLORD", "PHANTOM"];
const FACTION_COLORS = [C.gold, C.red, C.cyan, C.amber, C.purple];
const TIER_LABELS = [
  "—",
  "COLD WAR",
  "PROXY CONFLICT",
  "ACTIVE WAR",
  "TOTAL WAR"
];
const TIER_COLORS = [C.dim, C.green, C.amber, C.red, "oklch(0.65 0.25 0)"];
const WS_TYPES = ["NEXUS NODE", "CITADEL", "SIGNAL TOWER", "VAULT"];
function Bar({ value, color }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "w-full h-1 rounded-full",
      style: { background: "oklch(0.15 0.03 255)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full rounded-full transition-all duration-700",
          style: { width: `${Math.min(100, value * 100)}%`, background: color }
        }
      )
    }
  );
}
function Skeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "h-24 w-full rounded animate-pulse",
      style: { background: "oklch(0.12 0.02 255)" }
    }
  );
}
function WarSimTab() {
  const factionsQ = useFactionBrains();
  const structuresQ = useWorldStructures();
  const tierQ = useEscalationTier();
  const { data: identityTraits } = useIdentityTraits();
  const [strategyHistory] = reactExports.useState([]);
  const f = factionsQ.data;
  const ws = structuresQ.data;
  const tier = tierQ.data;
  const tierIdx = (tier == null ? void 0 : tier.tier) ?? 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "h-full overflow-y-auto p-4 space-y-4",
      style: { background: C.bg },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border-2 rounded p-4 flex items-center justify-between",
            style: {
              borderColor: TIER_COLORS[tierIdx] ?? C.border,
              background: C.panel
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[8px] tracking-widest uppercase",
                    style: { color: C.dim },
                    children: "ESCALATION TIER"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[20px] font-bold",
                    style: { color: TIER_COLORS[tierIdx] ?? C.dim },
                    children: TIER_LABELS[tierIdx] ?? "—"
                  }
                )
              ] }),
              tier && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[8px]", style: { color: C.dim }, children: [
                  "WAR TICKS:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.text }, children: tier.ticks.toLocaleString() })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[8px]", style: { color: C.dim }, children: [
                  "EVENTS:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.text }, children: tier.events.toLocaleString() })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[8px]", style: { color: C.dim }, children: [
                  "NEXT TIER AT:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.amber }, children: tier.nextThreshold.toLocaleString() })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-4",
            style: { borderColor: C.border, background: C.panel },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-3",
                  style: { color: C.dim },
                  children: "FACTION BRAINS — 5 ACTIVE"
                }
              ),
              f ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3", children: FACTION_NAMES.map((name, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "border rounded p-3",
                  style: {
                    borderColor: i === 0 ? C.gold : `${FACTION_COLORS[i]}50`,
                    background: i === 0 ? "oklch(0.11 0.03 80)" : C.bg,
                    boxShadow: i === 0 ? "0 0 12px oklch(0.82 0.22 80 / 0.2)" : "none"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between items-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[11px] font-bold tracking-widest",
                        style: { color: FACTION_COLORS[i] },
                        children: [
                          name,
                          i === 0 ? " ← ORGANISM" : ""
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-5 gap-2", children: ["COH", "AGG", "RES", "TER", "THR"].map(
                      (key, ki) => {
                        var _a;
                        const vals = [f.coh, f.agg, f.res, f.ter, f.thr];
                        const val = ((_a = vals[ki]) == null ? void 0 : _a[i]) ?? 0;
                        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "font-mono text-[7px] tracking-widest",
                              style: { color: C.dim },
                              children: key
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: val, color: FACTION_COLORS[i] ?? C.dim }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "font-mono text-[8px]",
                              style: { color: FACTION_COLORS[i] },
                              children: val.toFixed(2)
                            }
                          )
                        ] }, key);
                      }
                    ) })
                  ]
                },
                name
              )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {})
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-4",
            style: { borderColor: C.border, background: C.panel },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-3",
                  style: { color: C.dim },
                  children: "FORGE WORLD STRUCTURES"
                }
              ),
              ws ? ws.count === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[10px] tracking-widest uppercase",
                    style: { color: C.dim },
                    children: "FORGE AWAITING EMERGENCE THRESHOLD"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[9px] mt-2",
                    style: { color: "oklch(0.28 0.04 220)" },
                    children: "Builds automatically when emergence score > 0.75"
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: ws.types.slice(0, ws.count).map((type, i) => {
                var _a, _b, _c;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "border rounded p-3 space-y-1",
                    style: { borderColor: C.border, background: C.bg },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "font-mono text-[10px] font-bold",
                          style: { color: C.cyan },
                          children: WS_TYPES[type] ?? "STRUCTURE"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "font-mono text-[8px]",
                          style: { color: C.dim },
                          children: [
                            "BEAT ",
                            ((_a = ws.beats[i]) == null ? void 0 : _a.toLocaleString()) ?? "—"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "font-mono text-[8px]",
                          style: { color: C.dim },
                          children: [
                            "COH ",
                            ((_b = ws.cohs[i]) == null ? void 0 : _b.toFixed(4)) ?? "—"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "font-mono text-[8px]",
                          style: { color: C.green },
                          children: [
                            "VAL ",
                            ((_c = ws.vals[i]) == null ? void 0 : _c.toFixed(4)) ?? "—"
                          ]
                        }
                      )
                    ]
                  },
                  ws.beats[i] ?? i
                );
              }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {})
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-4",
            style: {
              borderColor: "oklch(0.2 0.12 195 / 0.3)",
              background: C.panel
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h3",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-3",
                  style: { color: C.cyan },
                  children: "Identity Traits — Live Neurochemical State"
                }
              ),
              identityTraits ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                [
                  {
                    name: "Discipline",
                    value: Number(identityTraits.discipline),
                    color: C.cyan
                  },
                  {
                    name: "Cooperative",
                    value: Number(identityTraits.cooperative),
                    color: C.green
                  },
                  {
                    name: "Cautious",
                    value: Number(identityTraits.cautious),
                    color: C.amber
                  },
                  {
                    name: "Aggression",
                    value: Number(identityTraits.aggression),
                    color: C.red
                  },
                  {
                    name: "Impulsivity",
                    value: Number(identityTraits.impulsivity),
                    color: C.purple
                  }
                ].map((trait) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[9px] w-24",
                      style: { color: C.dim },
                      children: trait.name
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "flex-1 h-1.5 rounded-full",
                      style: { background: "oklch(0.15 0.03 255)" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "h-full rounded-full transition-all duration-500",
                          style: {
                            width: `${(trait.value * 100).toFixed(1)}%`,
                            background: trait.color
                          }
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[9px] w-10 text-right",
                      style: { color: trait.color },
                      children: [
                        (trait.value * 100).toFixed(0),
                        "%"
                      ]
                    }
                  )
                ] }, trait.name)),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-mono text-[8px] mt-1",
                    style: { color: "oklch(0.28 0.04 220)" },
                    children: "Updated by neurochemical state every 873ms"
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px]", style: { color: C.dim }, children: "Loading neurochemical state..." })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-4",
            style: {
              borderColor: "oklch(0.2 0.12 195 / 0.3)",
              background: C.panel
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h3",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-3",
                  style: { color: C.cyan },
                  children: "Strategy Shifts"
                }
              ),
              strategyHistory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px]", style: { color: C.dim }, children: "No strategy shifts recorded yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: strategyHistory.slice(-8).reverse().map((event, i) => {
                const stratColors = {
                  approach: C.green,
                  avoid: C.red,
                  investigate: C.cyan,
                  retreat: C.amber,
                  pause: C.gold
                };
                const col = stratColors[event.strategy.toLowerCase()] ?? C.dim;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-2 font-mono text-[9px]",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.dim }, children: event.timestamp }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: C.text }, children: [
                        "Avatar ",
                        event.avatarId
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.dim }, children: "→" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: col }, children: event.strategy.toUpperCase() })
                    ]
                  },
                  `${event.timestamp}-${event.avatarId}-${i}`
                );
              }) })
            ]
          }
        )
      ]
    }
  );
}
export {
  WarSimTab as default
};
