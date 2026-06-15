import { q as useTreasuryState, b as useCreatorReserve, s as useMarketVisionState, t as useSuccessionState, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
const C = {
  bg: "oklch(0.06 0.01 265)",
  panel: "oklch(0.09 0.015 265)",
  border: "oklch(0.2 0.05 255)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.82 0.22 80)",
  green: "oklch(0.68 0.28 140)",
  dim: "oklch(0.38 0.05 220)",
  amber: "oklch(0.78 0.22 80)"
};
function Stat({
  label,
  value,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border rounded p-3 space-y-1",
      style: { borderColor: C.border, background: C.panel },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "font-mono text-[8px] tracking-widest uppercase",
            style: { color: C.dim },
            children: label
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[14px] font-bold", style: { color }, children: value })
      ]
    }
  );
}
function Skeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "h-10 w-full rounded animate-pulse",
      style: { background: "oklch(0.12 0.02 255)" }
    }
  );
}
function TreasuryTab() {
  const treasuryQ = useTreasuryState();
  const reserveQ = useCreatorReserve();
  const marketQ = useMarketVisionState();
  const successionQ = useSuccessionState();
  const t = treasuryQ.data;
  const r = reserveQ.data;
  const m = marketQ.data;
  const s = successionQ.data;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "h-full overflow-y-auto p-4 space-y-4",
      style: { background: C.bg },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border-2 rounded p-4 text-center",
            style: { borderColor: C.gold, background: "oklch(0.10 0.02 80)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-1",
                  style: { color: C.dim },
                  children: "MASTER ACCUMULATOR — TOTAL CREATOR EARNINGS"
                }
              ),
              r ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[28px] font-bold",
                  style: {
                    color: C.gold,
                    textShadow: "0 0 30px oklch(0.82 0.22 80 / 0.5)"
                  },
                  children: r.masterAccum.toFixed(6)
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {})
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-4",
            style: { borderColor: C.border, background: C.panel },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[9px] tracking-widest uppercase",
                    style: { color: C.dim },
                    children: "MARKET VISION — LIVE HTTP OUTCALLS"
                  }
                ),
                m && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "font-mono text-[8px]",
                    style: { color: m.fallback ? C.amber : C.green },
                    children: [
                      m.fallback ? "COINCAP FALLBACK" : "COINGECKO",
                      " · ",
                      m.fetchCount,
                      " ",
                      "FETCHES"
                    ]
                  }
                )
              ] }),
              m ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Stat,
                  {
                    label: "BTC PRICE",
                    value: m.btc > 0 ? `$${m.btc.toLocaleString()}` : "FETCHING",
                    color: C.gold
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Stat,
                  {
                    label: "ETH PRICE",
                    value: m.eth > 0 ? `$${m.eth.toLocaleString()}` : "FETCHING",
                    color: "oklch(0.72 0.22 280)"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Stat,
                  {
                    label: "ICP PRICE",
                    value: m.icp > 0 ? `$${m.icp.toFixed(2)}` : "FETCHING",
                    color: C.cyan
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {}),
              m && m.blindEvents > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "mt-2 font-mono text-[8px] tracking-widest",
                  style: { color: C.amber },
                  children: [
                    "⚠ ",
                    m.blindEvents,
                    " BLIND EVENTS — ORGANISM LOGGED MARKET VISION FAILURES"
                  ]
                }
              )
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
                  children: "TREASURY BALANCES"
                }
              ),
              t ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "ckBTC", value: t.ckBtc.toFixed(8), color: C.gold }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Stat,
                  {
                    label: "BTC FLOOR RESERVE",
                    value: t.btcFloor.toFixed(8),
                    color: C.amber
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Stat,
                  {
                    label: "ETH PRODUCTIVE",
                    value: t.ethProd.toFixed(8),
                    color: "oklch(0.72 0.22 280)"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Stat,
                  {
                    label: "ETH STAKING YIELD",
                    value: t.ethYield.toFixed(8),
                    color: C.green
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Stat,
                  {
                    label: "ETH SIGNAL",
                    value: t.ethSignal.toFixed(4),
                    color: C.dim
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Stat,
                  {
                    label: "ICP SIGNAL",
                    value: t.icpSignal.toFixed(4),
                    color: C.cyan
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Stat,
                  {
                    label: "NNS REWARDS",
                    value: t.nnsRewards.toFixed(8),
                    color: C.green
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Stat,
                  {
                    label: "FORMA (INTERNAL)",
                    value: t.forma.toFixed(6),
                    color: C.dim
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {})
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
                  children: "CREATOR RESERVE — ALL 7 TOKENS"
                }
              ),
              r ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "SEED", value: r.seed.toFixed(6), color: C.green }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "MTC", value: r.mtc.toFixed(6), color: C.cyan }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Stat,
                  {
                    label: "HBT",
                    value: r.hbt.toFixed(6),
                    color: "oklch(0.72 0.22 280)"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Stat,
                  {
                    label: "OMS",
                    value: r.oms.toFixed(6),
                    color: "oklch(0.72 0.22 320)"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "DRT", value: r.drt.toFixed(6), color: C.amber }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Stat,
                  {
                    label: "ANT",
                    value: r.ant.toFixed(6),
                    color: "oklch(0.72 0.22 160)"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "MTH", value: r.mth.toFixed(6), color: C.gold })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {})
            ]
          }
        ),
        s && /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
                  children: "SUCCESSION PROTOCOL"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "ROYALTY %", value: `${s.royaltyPct}%`, color: C.gold }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Stat,
                  {
                    label: "ROYALTY ACCUM",
                    value: s.royaltyAccum.toFixed(6),
                    color: C.amber
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Stat,
                  {
                    label: "LICENSE FEE",
                    value: s.licFee.toFixed(6),
                    color: C.green
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
export {
  TreasuryTab as default
};
