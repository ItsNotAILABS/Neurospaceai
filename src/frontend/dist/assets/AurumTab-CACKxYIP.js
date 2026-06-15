import { b as useCreatorReserve, c as useMiningState, H as useNeuroscienceState, G as useFearMissionState, r as reactExports, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
import { m as motion } from "./proxy-BnoGaVMl.js";
const C = {
  bg: "oklch(0.055 0.01 265)",
  panel: "oklch(0.075 0.012 265)",
  border: "oklch(0.18 0.05 250)",
  dim: "oklch(0.38 0.05 220)",
  cyan: "oklch(0.72 0.22 195)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.78 0.22 80)",
  red: "oklch(0.72 0.22 25)",
  gold: "oklch(0.82 0.22 80)",
  fg: "oklch(0.85 0.05 210)",
  muted: "oklch(0.5 0.08 220)"
};
function PanelTitle({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "font-mono text-[9px] tracking-widest uppercase mb-2 pb-1 border-b",
      style: { color: C.gold, borderColor: "oklch(0.18 0.06 80 / 0.5)" },
      children
    }
  );
}
function PanelBox({
  children,
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `rounded-none border p-3 ${className}`,
      style: { background: C.panel, borderColor: C.border },
      children
    }
  );
}
function kellyFraction(winRate, avgWin, avgLoss) {
  if (avgLoss === 0) return 0;
  return Math.max(
    0,
    Math.min(1, (winRate * avgWin - (1 - winRate) * avgLoss) / avgWin)
  );
}
function sharpeRatio(returns) {
  if (returns.length < 2) return 0;
  const mean = returns.reduce((s, r) => s + r, 0) / returns.length;
  const variance = returns.reduce((s, r) => s + (r - mean) ** 2, 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  return stdDev === 0 ? 0 : mean / stdDev;
}
function TokenBalancePanel({ reserve }) {
  const tokens = [
    { name: "SEED", key: "creatorSeedReserve", color: C.green },
    { name: "MTC", key: "creatorMtcReserve", color: C.cyan },
    { name: "HBT", key: "creatorHbtReserve", color: C.amber },
    { name: "OMS", key: "creatorOmsReserve", color: C.gold },
    { name: "DRT", key: "creatorDrtReserve", color: C.muted },
    { name: "MTH", key: "creatorMthReserve", color: C.gold },
    { name: "ANT", key: "creatorAntReserve", color: C.green }
  ];
  const values = tokens.map((t) => ({
    ...t,
    balance: reserve ? Number(reserve[t.key] ?? 0) : 0
  }));
  const maxVal = Math.max(...values.map((v) => v.balance), 1e-4);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ CREATOR RESERVE — 100% SOVEREIGN" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5", children: values.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[8px] w-10 shrink-0",
          style: { color: C.dim },
          children: t.name
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex-1 h-1.5",
          style: { background: "oklch(0.12 0.01 265)" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full transition-all duration-700",
              style: {
                width: `${t.balance / maxVal * 100}%`,
                background: t.color
              }
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[9px] w-16 text-right shrink-0",
          style: { color: C.fg },
          children: t.balance.toFixed(6)
        }
      )
    ] }, t.name)) })
  ] });
}
function KellyPanel({ fearM, neuro }) {
  const coherence = (neuro == null ? void 0 : neuro.bindingCoherence) ?? 0.5;
  const fear = (fearM == null ? void 0 : fearM.fearLevel) ?? 0;
  const courage = (fearM == null ? void 0 : fearM.courageScore) ?? 0.5;
  const winRate = Math.max(0.1, Math.min(0.95, coherence));
  const avgWin = Math.max(0.01, coherence * 1.5);
  const avgLoss = Math.max(0.01, fear * 0.8);
  const kelly = kellyFraction(winRate, avgWin, avgLoss);
  const conviction = coherence * 0.4 + courage * 0.4 + (1 - fear) * 0.2;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ KELLY CRITERION — SOVEREIGN POSITION SIZING" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [
      [
        "KELLY FRACTION",
        `${(kelly * 100).toFixed(1)}%`,
        kelly > 0.5 ? C.green : kelly > 0.25 ? C.amber : C.red
      ],
      ["WIN RATE", `${(winRate * 100).toFixed(1)}%`, C.cyan],
      [
        "CONVICTION",
        `${(conviction * 100).toFixed(1)}%`,
        conviction > 0.7 ? C.green : C.amber
      ],
      [
        "FEAR SUPPRESS",
        `${(fear * 100).toFixed(1)}%`,
        fear > 0.5 ? C.red : C.green
      ]
    ].map(([lbl, val, col]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[8px] tracking-widest uppercase",
          style: { color: C.dim },
          children: lbl
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-sm font-bold",
          style: { color: String(col) },
          children: val
        }
      )
    ] }, String(lbl))) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "mt-3 p-2",
        style: {
          background: "oklch(0.07 0.015 80)",
          borderLeft: `2px solid ${C.gold}`
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px]", style: { color: C.fg }, children: kelly > 0.6 ? "AURUM: High conviction. Organism in sovereign zone. Full Kelly sizing advised." : kelly > 0.3 ? "AURUM: Moderate conviction. Fear partially suppressing yield. Fractional Kelly." : "AURUM: Low conviction. Fear dominant. Capital preservation mode. Reduce sizing." })
      }
    )
  ] });
}
function MintHistoryChart({ mintHistory }) {
  if (mintHistory.length < 2) return null;
  const max = Math.max(...mintHistory, 1e-4);
  const width = 400;
  const height = 60;
  const pts = mintHistory.slice(0, 40).map((v, i) => {
    const x = i / (Math.min(40, mintHistory.length) - 1) * width;
    const y = height - v / max * height;
    return `${x},${y}`;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: "100%",
      viewBox: `0 0 ${width} ${height}`,
      style: { overflow: "visible" },
      "aria-labelledby": "aurum-mint-chart-title",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("title", { id: "aurum-mint-chart-title", children: "Token mint history chart" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "polyline",
          {
            points: pts.join(" "),
            fill: "none",
            stroke: C.gold,
            strokeWidth: "1.5",
            opacity: "0.8"
          }
        )
      ]
    }
  );
}
function AurumTab() {
  const { data: reserve } = useCreatorReserve();
  const { data: mining } = useMiningState();
  const { data: neuro } = useNeuroscienceState();
  const { data: fearM } = useFearMissionState();
  const [mintHistory, setMintHistory] = reactExports.useState([]);
  const lastSeedRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    if (!reserve) return;
    const seed = Number(reserve.creatorSeedReserve ?? 0);
    if (seed !== lastSeedRef.current) {
      const delta = seed - lastSeedRef.current;
      if (delta > 0) {
        setMintHistory((prev) => [delta, ...prev].slice(0, 100));
      }
      lastSeedRef.current = seed;
    }
  }, [reserve]);
  const sharpe = sharpeRatio(mintHistory);
  const maxDrawdown = mintHistory.length > 1 ? Math.abs(
    Math.min(
      ...mintHistory.map(
        (v, i) => i === 0 ? 0 : v - Math.max(...mintHistory.slice(0, i))
      )
    )
  ) : 0;
  const insight = (() => {
    const fear = (fearM == null ? void 0 : fearM.fearLevel) ?? 0;
    const coh = (neuro == null ? void 0 : neuro.bindingCoherence) ?? 0;
    if (fear > 0.6)
      return `Fear suppression active (${(fear * 100).toFixed(0)}%). Economic output suppressed. Mission persistence will restore yield.`;
    if (coh > 0.75)
      return `High binding coherence (${(coh * 100).toFixed(1)}%). Organism unified. Premium yield conditions active.`;
    if (sharpe > 1)
      return `Strong Sharpe ratio (${sharpe.toFixed(2)}). Consistent yield with controlled volatility. Compound position.`;
    return `Baseline yield pattern. Coherence trending ${coh > 0.5 ? "up" : "down"}. Monitor sovereignty signals.`;
  })();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-y-auto",
      style: { background: C.bg },
      "data-ocid": "aurum.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -4 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4 },
            className: "flex items-center justify-between px-4 py-3 border-b",
            style: { background: "oklch(0.065 0.012 80)", borderColor: C.border },
            "data-ocid": "aurum.header.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-3 h-3 rounded-full",
                    style: { background: C.gold, boxShadow: `0 0 10px ${C.gold}` }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-lg font-bold tracking-widest",
                    style: { color: C.gold },
                    children: "AURUM"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[9px] tracking-widest uppercase",
                    style: { color: C.dim },
                    children: "TREASURY INTELLIGENCE"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: [
                [
                  "SHARPE",
                  sharpe.toFixed(2),
                  sharpe > 1 ? C.green : sharpe > 0 ? C.amber : C.red
                ],
                [
                  "DRAWDOWN",
                  `${(maxDrawdown * 100).toFixed(2)}%`,
                  maxDrawdown > 0.1 ? C.red : C.green
                ],
                [
                  "MINT EVT",
                  String(Number((mining == null ? void 0 : mining.totalMintEvents) ?? 0)),
                  C.gold
                ]
              ].map(([lbl, val, col]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] tracking-widest uppercase",
                    style: { color: C.dim },
                    children: lbl
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-sm font-bold",
                    style: { color: String(col) },
                    children: val
                  }
                )
              ] }, String(lbl))) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.35, delay: 0.05 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ AURUM INSIGHT — LIVE ECONOMIC ANALYSIS" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-mono text-[10px] leading-relaxed",
                    style: { color: C.fg },
                    children: insight
                  }
                ),
                mintHistory.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MintHistoryChart, { mintHistory }) })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "grid grid-cols-1 md:grid-cols-2 gap-3",
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.35, delay: 0.1 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TokenBalancePanel, { reserve }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(KellyPanel, { fearM, neuro })
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  AurumTab as default
};
