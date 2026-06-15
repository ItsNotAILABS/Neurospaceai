import { e as useCanonicalState, H as useNeuroscienceState, G as useFearMissionState, c as useMiningState, r as reactExports, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
import { m as motion } from "./proxy-BnoGaVMl.js";
const C = {
  bg: "oklch(0.055 0.01 265)",
  panel: "oklch(0.075 0.012 265)",
  border: "oklch(0.18 0.05 250)",
  dim: "oklch(0.38 0.05 220)",
  dimlo: "oklch(0.28 0.04 220)",
  cyan: "oklch(0.72 0.22 195)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.78 0.22 80)",
  red: "oklch(0.72 0.22 25)",
  teal: "oklch(0.72 0.18 175)",
  fg: "oklch(0.85 0.05 210)",
  muted: "oklch(0.5 0.08 220)"
};
function PanelTitle({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "font-mono text-[9px] tracking-widest uppercase mb-2 pb-1 border-b",
      style: { color: C.teal, borderColor: "oklch(0.18 0.06 175 / 0.5)" },
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
function DomainScalarsPanel({ canon }) {
  const domains = [
    { label: "IDENTITY", key: "id", val: 0.5 },
    { label: "MISSION", key: "ms", val: 0.5 },
    { label: "COGNITION", key: "cg", val: 0.5 },
    { label: "MEMORY", key: "mm", val: 0.5 },
    { label: "ADAPTATION", key: "ad", val: 0.5 },
    { label: "TEMPORAL", key: "tm", val: 0.5 }
  ];
  const allVals = [
    (canon == null ? void 0 : canon.coh) ?? 0.5,
    (canon == null ? void 0 : canon.kf) ?? 0.5,
    (canon == null ? void 0 : canon.ar) ?? 0.3,
    (canon == null ? void 0 : canon.fe) ?? 0.1,
    (canon == null ? void 0 : canon.es) ?? 0.5,
    (canon == null ? void 0 : canon.coh) ?? 0.5
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ 12 DOMAIN SCALAR MONITOR" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5", children: domains.map((d, i) => {
      const val = allVals[i] ?? 0.5;
      const color = val > 0.7 ? C.green : val > 0.4 ? C.amber : C.red;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[8px] w-20 shrink-0",
            style: { color: C.dim },
            children: d.label
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
                style: { width: `${val * 100}%`, background: color }
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "font-mono text-[9px] w-12 text-right",
            style: { color },
            children: [
              (val * 100).toFixed(1),
              "%"
            ]
          }
        )
      ] }, d.key);
    }) })
  ] });
}
function MomentumPanel({ windows }) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const indicators = [
    {
      label: "COH MOMENTUM",
      current: ((_a = windows[0]) == null ? void 0 : _a.coherence) ?? 0,
      prev: ((_b = windows[10]) == null ? void 0 : _b.coherence) ?? 0,
      trend: "stable",
      color: C.teal
    },
    {
      label: "BINDING MOMENTUM",
      current: ((_c = windows[0]) == null ? void 0 : _c.bindingCoherence) ?? 0,
      prev: ((_d = windows[10]) == null ? void 0 : _d.bindingCoherence) ?? 0,
      trend: "stable",
      color: C.cyan
    },
    {
      label: "INFERENCE MOMENTUM",
      current: ((_e = windows[0]) == null ? void 0 : _e.pcActiveInferenceScore) ?? 0,
      prev: ((_f = windows[10]) == null ? void 0 : _f.pcActiveInferenceScore) ?? 0,
      trend: "stable",
      color: C.green
    },
    {
      label: "CONSCIOUSNESS MOMENTUM",
      current: ((_g = windows[0]) == null ? void 0 : _g.consciousnessIndex) ?? 0,
      prev: ((_h = windows[10]) == null ? void 0 : _h.consciousnessIndex) ?? 0,
      trend: "stable",
      color: C.amber
    }
  ].map((ind) => ({
    ...ind,
    trend: ind.current > ind.prev + 5e-3 ? "up" : ind.current < ind.prev - 5e-3 ? "down" : "stable"
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ MOMENTUM VECTORS (ROLLING WINDOW)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: indicators.map((ind) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[8px] w-36 shrink-0",
          style: { color: C.dim },
          children: ind.label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-lg leading-none",
          style: {
            color: ind.trend === "up" ? C.green : ind.trend === "down" ? C.red : C.muted
          },
          children: ind.trend === "up" ? "↑" : ind.trend === "down" ? "↓" : "→"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "font-mono text-[10px] font-bold",
          style: { color: ind.color },
          children: [
            (ind.current * 100).toFixed(1),
            "%"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[8px]", style: { color: C.dimlo }, children: [
        "prev: ",
        (ind.prev * 100).toFixed(1),
        "%"
      ] })
    ] }, ind.label)) })
  ] });
}
function SessionReportPanel({ reports }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ SESSION REPORTS — ACADEMIC FORMAT" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col gap-2 max-h-80 overflow-y-auto",
        style: { scrollbarWidth: "none" },
        children: [
          reports.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[9px]",
              style: { color: C.dimlo },
              "data-ocid": "cognus.reports.empty_state",
              children: "Reports generate automatically every 100 beats."
            }
          ),
          reports.map((rpt, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "p-2 border",
              style: {
                borderColor: C.border,
                background: "oklch(0.065 0.01 265)"
              },
              "data-ocid": `cognus.report.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[9px] font-bold",
                      style: { color: C.teal },
                      children: [
                        "BEATS ",
                        rpt.beatRange
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[8px]", style: { color: C.dimlo }, children: new Date(rpt.generated).toLocaleTimeString() })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 mb-1", children: [
                  ["AVG COH", rpt.avgCoherence],
                  ["AVG BIND", rpt.avgBinding],
                  ["AVG INF", rpt.avgInference]
                ].map(([lbl, val]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px]",
                      style: { color: C.dim },
                      children: lbl
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[10px] font-bold",
                      style: { color: C.fg },
                      children: [
                        (Number(val) * 100).toFixed(1),
                        "%"
                      ]
                    }
                  )
                ] }, String(lbl))) }),
                rpt.anomalies.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: rpt.anomalies.map((a, ai) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "font-mono text-[8px]",
                    style: { color: C.amber },
                    children: [
                      "⚠ ",
                      a
                    ]
                  },
                  `anomaly-${String(ai)}`
                )) })
              ]
            },
            rpt.generated
          ))
        ]
      }
    )
  ] });
}
function CognusTab() {
  const { data: canon } = useCanonicalState();
  const { data: neuro } = useNeuroscienceState();
  const { data: fearM } = useFearMissionState();
  const { data: mining } = useMiningState();
  const [windows, setWindows] = reactExports.useState([]);
  const [reports, setReports] = reactExports.useState([]);
  const windowBeatRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    if (!canon) return;
    const beat2 = Number(canon.b);
    if (beat2 === windowBeatRef.current) return;
    windowBeatRef.current = beat2;
    const win = {
      beat: beat2,
      coherence: canon.coh ?? 0,
      bindingCoherence: (neuro == null ? void 0 : neuro.bindingCoherence) ?? 0,
      pcActiveInferenceScore: (neuro == null ? void 0 : neuro.pcActiveInferenceScore) ?? 0,
      vagalTone: (neuro == null ? void 0 : neuro.vagalTone) ?? 0.5,
      salienceNetworkScore: (neuro == null ? void 0 : neuro.salienceNetworkScore) ?? 0,
      bdnfLevel: (neuro == null ? void 0 : neuro.bdnfLevel) ?? 0.5,
      fearLevel: (fearM == null ? void 0 : fearM.fearLevel) ?? 0,
      consciousnessIndex: (neuro == null ? void 0 : neuro.consciousnessIndex) ?? 0
    };
    setWindows((prev) => [win, ...prev].slice(0, 200));
    if (beat2 > 0 && beat2 % 100 === 0) {
      setWindows((prevW) => {
        const recent = prevW.slice(0, Math.min(100, prevW.length));
        if (recent.length === 0) return prevW;
        const avg = (key) => recent.reduce((s, w) => s + Number(w[key]), 0) / recent.length;
        const avgCoh = avg("coherence");
        const avgBind = avg("bindingCoherence");
        const avgInf = avg("pcActiveInferenceScore");
        const anomalies = [];
        if (avgCoh < 0.5)
          anomalies.push(
            `Coherence below baseline: ${(avgCoh * 100).toFixed(1)}%`
          );
        if (avg("fearLevel") > 0.5)
          anomalies.push(
            `Elevated fear suppression: ${(avg("fearLevel") * 100).toFixed(1)}%`
          );
        if (avg("bdnfLevel") < 0.3)
          anomalies.push(
            `BDNF deficiency detected: ${(avg("bdnfLevel") * 100).toFixed(1)}%`
          );
        const report = {
          beatRange: `${beat2 - 100}–${beat2}`,
          avgCoherence: avgCoh,
          avgBinding: avgBind,
          avgInference: avgInf,
          anomalies,
          generated: Date.now()
        };
        setReports((prev) => [report, ...prev].slice(0, 20));
        return prevW;
      });
    }
  }, [canon, neuro, fearM]);
  const beat = Number((canon == null ? void 0 : canon.b) ?? 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-y-auto",
      style: { background: C.bg },
      "data-ocid": "cognus.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -4 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4 },
            className: "flex items-center justify-between px-4 py-3 border-b",
            style: { background: "oklch(0.065 0.012 175)", borderColor: C.border },
            "data-ocid": "cognus.header.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-3 h-3 rounded-full",
                    style: { background: C.teal, boxShadow: `0 0 10px ${C.teal}` }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-lg font-bold tracking-widest",
                    style: { color: C.teal },
                    children: "COGNUS"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[9px] tracking-widest uppercase",
                    style: { color: C.dim },
                    children: "ANALYTICS ENGINE"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: [
                ["BEAT", beat.toLocaleString(), C.cyan],
                ["WINDOWS", windows.length.toString(), C.teal],
                ["REPORTS", reports.length.toString(), C.green],
                [
                  "MINING",
                  mining ? String(mining.miningLevel ?? 0) : "—",
                  C.amber
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
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "grid grid-cols-1 md:grid-cols-2 gap-3",
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.35, delay: 0.05 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DomainScalarsPanel, { canon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(MomentumPanel, { windows })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.35, delay: 0.1 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SessionReportPanel, { reports })
            }
          )
        ] })
      ]
    }
  );
}
export {
  CognusTab as default
};
