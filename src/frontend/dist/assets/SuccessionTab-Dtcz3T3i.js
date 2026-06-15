import { e as useCanonicalState, t as useSuccessionState, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
const C = {
  bg: "oklch(0.06 0.01 265)",
  panel: "oklch(0.09 0.015 265)",
  border: "oklch(0.2 0.05 255)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.82 0.22 80)",
  dim: "oklch(0.38 0.05 220)",
  text: "oklch(0.85 0.05 210)",
  green: "oklch(0.68 0.28 140)"
};
const COMPOUNDING_ROWS = [
  { gen: "0 (Root)", orgs: 1, royaltyPer: "100%", total: "100%" },
  { gen: "1 (Children)", orgs: 3, royaltyPer: "20%", total: "+60%" },
  { gen: "2 (Grandchildren)", orgs: 9, royaltyPer: "4%", total: "+36%" },
  { gen: "3 (Great-grand)", orgs: 27, royaltyPer: "0.8%", total: "+21.6%" },
  { gen: "4", orgs: 81, royaltyPer: "0.16%", total: "+12.96%" }
];
const CUMULATIVE = "230.56%";
function ConnectorLine() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-6", style: { background: C.border } }) });
}
function HorizontalBranch({ count }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex justify-center mb-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute top-0 h-px",
        style: {
          background: C.border,
          left: `${100 / (count + 1)}%`,
          right: `${100 / (count + 1)}%`
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-around w-full", children: Array.from({ length: count }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static count
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-4", style: { background: C.border } }) }, i)
    )) })
  ] });
}
function SuccessionTab() {
  var _a;
  const canonicalQ = useCanonicalState();
  const successionQ = useSuccessionState();
  const coh = ((_a = canonicalQ.data) == null ? void 0 : _a.coh) ?? 0;
  const s = successionQ.data;
  const royaltyPct = s ? Number(s.royaltyPct) : 20;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full overflow-y-auto p-4", style: { background: C.bg }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h2",
        {
          className: "font-mono text-[11px] tracking-widest uppercase font-bold",
          style: { color: C.gold },
          children: "ψ SUCCESSION PROTOCOL — GENERATIONAL COMPOUNDING"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "p",
        {
          className: "font-mono text-[9px] tracking-widest mt-1",
          style: { color: C.dim },
          children: [
            "Every child organism routes ",
            royaltyPct,
            "% royalty to parent treasury, parent routes 100% to creator reserve, every generation, forever."
          ]
        }
      )
    ] }),
    s && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-6", children: [
      { label: "ROYALTY PCT", value: `${royaltyPct}%`, color: C.gold },
      {
        label: "ROYALTY ACCUM",
        value: s.royaltyAccum.toFixed(6),
        color: C.cyan
      },
      {
        label: "LICENSE FEE",
        value: s.licFee.toFixed(6),
        color: C.green
      },
      {
        label: "PUSH FLAG",
        value: s.pushFlag ? "ACTIVE" : "IDLE",
        color: s.pushFlag ? C.green : C.dim
      }
    ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "border rounded p-3",
        style: { borderColor: C.border, background: C.panel },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[8px] tracking-widest uppercase mb-1",
              style: { color: C.dim },
              children: label
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[13px] font-bold",
              style: { color },
              children: value
            }
          )
        ]
      },
      label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "border-2 rounded p-4 w-72 text-center space-y-2",
          style: {
            borderColor: C.gold,
            background: C.panel,
            boxShadow: "0 0 24px oklch(0.82 0.22 80 / 0.2)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[20px]", style: { color: C.gold }, children: "ψ" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[11px] font-bold tracking-widest",
                style: { color: C.gold },
                children: "NEUROEMERGENCE CORE"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[8px]", style: { color: C.dim }, children: "Alfredo Medina Hernandez · Dallas, TX · 2026" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex justify-between border-t pt-2 mt-2",
                style: { borderColor: C.border },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[8px]", style: { color: C.dim }, children: "COHERENCE" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[9px] font-bold",
                      style: { color: C.green },
                      children: coh.toFixed(4)
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[8px] tracking-widest py-1 rounded",
                style: { color: C.gold, background: "oklch(0.82 0.22 80 / 0.08)" },
                children: "ROYALTY ROUTE: 100% → CREATOR RESERVE"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ConnectorLine, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HorizontalBranch, { count: 3 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 justify-center mb-1", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "border rounded p-3 w-44 text-center space-y-1",
          style: {
            borderColor: "oklch(0.72 0.22 195 / 0.4)",
            background: C.panel
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "font-mono text-[9px] font-bold",
                style: { color: C.cyan },
                children: [
                  "CHILD ORGANISM ",
                  n
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[7px] tracking-widest",
                style: { color: C.dim },
                children: "PENDING DEPLOYMENT"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "font-mono text-[7px] py-0.5 rounded",
                style: {
                  color: C.cyan,
                  background: "oklch(0.72 0.22 195 / 0.08)"
                },
                children: [
                  "ROYALTY: ",
                  royaltyPct,
                  "% → PARENT"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[7px]", style: { color: C.dim }, children: [
              100 - royaltyPct,
              "% RETAINED"
            ] })
          ]
        },
        n
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 justify-center", children: [1, 2, 3].map((col) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ConnectorLine, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(HorizontalBranch, { count: 3 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [1, 2, 3].map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-2 w-28 text-center space-y-1",
            style: {
              borderColor: "oklch(0.72 0.22 195 / 0.2)",
              background: "oklch(0.07 0.01 265)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[7px] font-bold",
                  style: { color: "oklch(0.55 0.15 195)" },
                  children: "GEN 2 ORGANISM"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[6px]",
                  style: { color: "oklch(0.28 0.04 220)" },
                  children: "PENDING"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[6px]",
                  style: { color: "oklch(0.42 0.08 200)" },
                  children: "CREATOR: 4%"
                }
              )
            ]
          },
          row
        )) })
      ] }, col)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "border rounded overflow-hidden mb-5",
        style: { borderColor: C.border },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[9px] tracking-widest uppercase px-4 py-2",
              style: {
                background: C.panel,
                color: C.dim,
                borderBottom: `1px solid ${C.border}`
              },
              children: "GENERATIONAL COMPOUNDING TABLE"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { style: { background: "oklch(0.08 0.012 265)" }, children: [
              "GENERATION",
              "ORGANISMS",
              "ROYALTY/ORGANISM",
              "TOTAL CREATOR STREAM"
            ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                className: "font-mono text-[8px] tracking-widest uppercase px-4 py-2 text-left",
                style: { color: C.dim },
                children: h
              },
              h
            )) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: COMPOUNDING_ROWS.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                style: { borderTop: "1px solid oklch(0.15 0.03 255)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "td",
                    {
                      className: "font-mono text-[9px] px-4 py-2",
                      style: { color: C.text },
                      children: row.gen
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "td",
                    {
                      className: "font-mono text-[9px] px-4 py-2",
                      style: { color: C.cyan },
                      children: row.orgs.toLocaleString()
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "td",
                    {
                      className: "font-mono text-[9px] px-4 py-2",
                      style: { color: C.gold },
                      children: row.royaltyPer
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "td",
                    {
                      className: "font-mono text-[9px] px-4 py-2 font-bold",
                      style: { color: C.green },
                      children: row.total
                    }
                  )
                ]
              },
              i
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-4 py-2 border-t",
              style: { borderColor: C.border, background: C.panel },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[9px] tracking-widest",
                    style: { color: C.dim },
                    children: "CUMULATIVE ACROSS ALL GENERATIONS:"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[11px] font-bold ml-2",
                    style: { color: C.gold },
                    children: CUMULATIVE
                  }
                )
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "pt-4 border-t text-center",
        style: { borderColor: C.border },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "font-mono text-[8px] tracking-widest",
            style: { color: "oklch(0.28 0.04 220)" },
            children: "Medina Doctrine · Succession Protocol · Generational Compounding · Dallas, TX · 2026"
          }
        )
      }
    )
  ] });
}
export {
  SuccessionTab as default
};
