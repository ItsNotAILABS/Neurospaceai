import { h as useVitalSubstrate, j as jsxRuntimeExports, e as useCanonicalState, f as useDoctorReport, a5 as useCoreStates, i as useEcologyState, a6 as useMilestoneAlerts } from "./index-CGYrnU7d.js";
import { m as motion } from "./proxy-BnoGaVMl.js";
const C$1 = {
  panel: "oklch(0.075 0.012 265)",
  border: "oklch(0.18 0.05 250)",
  dim: "oklch(0.38 0.05 220)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.78 0.22 80)",
  red: "oklch(0.72 0.22 25)",
  muted: "oklch(0.5 0.08 220)"
};
const ORGANS = [
  { key: "heart", label: "HEART" },
  { key: "lung", label: "LUNG" },
  { key: "liver", label: "LIVER" },
  { key: "kidney", label: "KIDNEY" },
  { key: "immune", label: "IMMUNE" }
];
function organColor(v) {
  if (v > 0.8) return C$1.green;
  if (v > 0.5) return C$1.amber;
  return C$1.red;
}
function VitalSubstratePanel() {
  const { data, isLoading } = useVitalSubstrate();
  const threat = (data == null ? void 0 : data.threat) ?? 0;
  const aegisLock = (data == null ? void 0 : data.aegisLock) ?? false;
  const aegisBeat = data ? Number(data.aegisBeat) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-none border p-3",
      style: { background: C$1.panel, borderColor: C$1.border },
      "data-ocid": "vital.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "font-mono text-[9px] tracking-widest uppercase mb-3 pb-1 border-b flex items-center justify-between",
            style: { color: C$1.green, borderColor: "oklch(0.18 0.06 140 / 0.5)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "◈ VITAL SUBSTRATE — Internal Node 5" }),
              aegisLock && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px] px-1.5 py-0.5",
                  style: {
                    background: "oklch(0.72 0.22 25 / 0.18)",
                    color: C$1.red,
                    border: "1px solid oklch(0.72 0.22 25 / 0.5)",
                    animation: "pulse 1s infinite"
                  },
                  "data-ocid": "vital.aegis.toggle",
                  children: "⚠ AEGIS LOCK"
                }
              )
            ]
          }
        ),
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-4 text-center", "data-ocid": "vital.loading_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[8px] tracking-widest uppercase animate-pulse",
            style: { color: C$1.muted },
            children: "SCANNING VITAL SUBSTRATE..."
          }
        ) }),
        !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
          ORGANS.map((organ) => {
            const val = data ? data[organ.key] : 0;
            const pct = Math.max(0, Math.min(1, val)) * 100;
            const color = organColor(val);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[8px] w-14 shrink-0",
                  style: { color },
                  children: organ.label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex-1 h-[5px] rounded-none overflow-hidden",
                  style: { background: "oklch(0.12 0.02 265)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      className: "h-full",
                      initial: { width: 0 },
                      animate: { width: `${pct}%` },
                      transition: { duration: 0.5, ease: "easeOut" },
                      style: {
                        background: color,
                        boxShadow: `0 0 3px ${color}88`
                      }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "font-mono text-[8px] w-8 shrink-0 text-right",
                  style: { color },
                  children: [
                    pct.toFixed(0),
                    "%"
                  ]
                }
              )
            ] }, organ.key);
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-1 h-[1px]", style: { background: C$1.border } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[8px] w-14 shrink-0",
                style: {
                  color: threat > 0.8 ? C$1.red : threat > 0.5 ? C$1.amber : C$1.dim
                },
                children: "THREAT"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex-1 h-[5px] rounded-none overflow-hidden",
                style: { background: "oklch(0.12 0.02 265)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    className: "h-full",
                    initial: { width: 0 },
                    animate: { width: `${threat * 100}%` },
                    transition: { duration: 0.5, ease: "easeOut" },
                    style: {
                      background: threat > 0.8 ? C$1.red : threat > 0.5 ? C$1.amber : C$1.green,
                      boxShadow: threat > 0.8 ? `0 0 6px ${C$1.red}` : "none"
                    }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "font-mono text-[8px] w-8 shrink-0 text-right",
                style: { color: threat > 0.8 ? C$1.red : C$1.dim },
                children: [
                  (threat * 100).toFixed(0),
                  "%"
                ]
              }
            )
          ] }),
          aegisBeat > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[7px] mt-1", style: { color: C$1.dim }, children: [
            "AEGIS LOCK BEAT: ",
            aegisBeat.toLocaleString()
          ] })
        ] })
      ]
    }
  );
}
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
  fg: "oklch(0.85 0.05 210)",
  muted: "oklch(0.5 0.08 220)"
};
function MetricLabel({ text }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "font-mono text-[9px] tracking-widest uppercase",
      style: { color: C.dim },
      children: text
    }
  );
}
function PanelBox({
  children,
  className = "",
  style = {}
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `rounded-none border p-3 ${className}`,
      style: {
        background: C.panel,
        borderColor: C.border,
        ...style
      },
      children
    }
  );
}
function PanelTitle({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "font-mono text-[9px] tracking-widest uppercase mb-2 pb-1 border-b",
      style: { color: C.cyan, borderColor: "oklch(0.18 0.06 195 / 0.5)" },
      children
    }
  );
}
function SovereignHealthBanner() {
  const { data: doc, isLoading } = useDoctorReport();
  const { data: canon } = useCanonicalState();
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full px-4 py-3 flex items-center justify-center",
        style: {
          background: "oklch(0.08 0.015 265)",
          borderBottom: `1px solid ${C.border}`
        },
        "data-ocid": "doctor.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[10px] tracking-widest uppercase animate-pulse",
            style: { color: C.muted },
            children: "SCANNING SUBSTRATE..."
          }
        )
      }
    );
  }
  const sh = doc ? Number(doc.sh) : 0;
  const statusLabel = sh === 0 ? "HEALTHY" : sh === 1 ? "WARNING" : "CRITICAL";
  const statusColor = sh === 0 ? C.green : sh === 1 ? C.amber : C.red;
  const bannerBg = sh === 0 ? "oklch(0.068 0.012 140)" : sh === 1 ? "oklch(0.072 0.014 80)" : "oklch(0.072 0.016 25)";
  const scan = doc ? Number(doc.scan) : 0;
  const cc = doc ? Number(doc.cc) : 0;
  const rd = doc ? `${(doc.rd * 100).toFixed(1)}%` : "—";
  const ds = doc ? `${(doc.ds * 100).toFixed(1)}%` : "—";
  const beatCount = canon ? Number(canon.b) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: -4 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
      className: "w-full px-5 py-3 flex flex-wrap items-center gap-4 border-b",
      style: { background: bannerBg, borderColor: `${statusColor} / 0.3` },
      "data-ocid": "doctor.health.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-3 h-3 rounded-full",
              style: {
                background: statusColor,
                boxShadow: `0 0 10px ${statusColor}`
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-lg font-bold tracking-widest uppercase",
              style: { color: statusColor },
              children: statusLabel
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-px", style: { background: C.border } }),
        [
          ["SCAN #", scan.toLocaleString()],
          ["CRITICAL", cc.toString()],
          ["REG DEBT", rd],
          ["DRIFT", ds],
          ["BEAT", beatCount.toLocaleString()]
        ].map(([lbl, val]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetricLabel, { text: lbl }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[13px] font-bold tracking-wider",
              style: {
                color: lbl === "CRITICAL" && cc > 0 ? C.red : lbl === "DRIFT" && doc && doc.ds > 0.3 ? C.amber : C.fg
              },
              children: val
            }
          )
        ] }, lbl))
      ]
    }
  );
}
function CanonicalStrip() {
  const { data: c } = useCanonicalState();
  const metrics = [
    {
      lbl: "BEAT",
      val: c ? Number(c.b).toLocaleString() : "—",
      color: C.cyan
    },
    {
      lbl: "COH",
      val: c ? `${(c.coh * 100).toFixed(1)}%` : "—",
      color: (c == null ? void 0 : c.coh) != null && c.coh > 0.75 ? C.green : (c == null ? void 0 : c.coh) != null && c.coh > 0.5 ? C.amber : C.red
    },
    {
      lbl: "KF-HZ",
      val: c ? c.kf.toFixed(3) : "—",
      color: C.cyan
    },
    {
      lbl: "AROUSAL",
      val: c ? c.ar.toFixed(3) : "—",
      color: (c == null ? void 0 : c.ar) != null && c.ar > 0.85 ? C.red : (c == null ? void 0 : c.ar) != null && c.ar > 0.5 ? C.amber : C.green
    },
    {
      lbl: "FREE-ENERGY",
      val: c ? c.fe.toFixed(4) : "—",
      color: C.muted
    },
    {
      lbl: "EMERGENCE",
      val: c ? `${(c.es * 100).toFixed(1)}%` : "—",
      color: (c == null ? void 0 : c.es) != null && c.es > 0.8 ? C.green : (c == null ? void 0 : c.es) != null && c.es > 0.5 ? C.amber : C.muted
    },
    {
      lbl: "OMNIS",
      val: c ? c.qh >= 1 ? "FIRING" : "WAIT" : "—",
      color: (c == null ? void 0 : c.qh) != null && c.qh >= 1 ? C.green : C.dimlo
    },
    {
      lbl: "BOOTSTRAP",
      val: c ? c.bc ? "DONE" : "INIT" : "—",
      color: (c == null ? void 0 : c.bc) ? C.green : C.amber
    },
    {
      lbl: "DRIVE",
      val: c ? Number(c.ad).toString() : "—",
      color: C.cyan
    },
    {
      lbl: "EXPR-GATE",
      val: c ? c.eg ? "OPEN" : "CLOSED" : "—",
      color: (c == null ? void 0 : c.eg) ? C.green : C.dimlo
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { "data-ocid": "doctor.canonical.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ CANONICAL STATE STRIP" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-4", children: metrics.map(({ lbl, val, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center min-w-[60px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricLabel, { text: lbl }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[12px] font-bold tracking-wider",
          style: { color },
          children: val
        }
      )
    ] }, lbl)) })
  ] });
}
function CoreCard({ core, coreIndex }) {
  const diag = Number(core.diag);
  const cardColor = !core.active ? "oklch(0.1 0.008 265)" : diag === 0 ? "oklch(0.075 0.015 140)" : diag <= 2 ? "oklch(0.08 0.015 80)" : "oklch(0.08 0.015 25)";
  const accentColor = !core.active ? C.dimlo : diag === 0 ? C.green : diag <= 2 ? C.amber : C.red;
  const diagLabels = ["OK", "DRF", "COH", "CNS", "CRT"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col p-1.5 border",
      style: {
        width: "78px",
        background: cardColor,
        borderColor: `${accentColor} / 0.3`
      },
      "data-ocid": `doctor.core.item.${coreIndex + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[9px] font-bold tracking-wider",
              style: { color: accentColor },
              children: [
                "C-",
                String(coreIndex).padStart(2, "0")
              ]
            }
          ),
          core.vital && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px]",
              style: { color: C.cyan },
              title: "Vital substrate",
              children: "★"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1", style: { background: "oklch(0.12 0.01 265)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              width: `${Math.min(100, core.coh)}%`,
              height: "100%",
              background: C.green,
              transition: "width 0.5s ease"
            }
          }
        ) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1", style: { background: "oklch(0.12 0.01 265)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              width: `${Math.min(100, core.drift)}%`,
              height: "100%",
              background: C.red,
              transition: "width 0.5s ease"
            }
          }
        ) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8px] tracking-wider",
              style: { color: accentColor },
              children: diagLabels[diag] ?? "?"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-[5px] h-[5px] rounded-full",
              style: {
                background: core.active ? accentColor : C.dimlo,
                boxShadow: core.active ? `0 0 4px ${accentColor}` : "none"
              }
            }
          )
        ] })
      ]
    }
  );
}
function CoreGrid() {
  const { data: cores, isLoading } = useCoreStates();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { "data-ocid": "doctor.cores.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ 43-CORE SUBSTRATE GRID" }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "font-mono text-[9px] tracking-widest uppercase animate-pulse",
        style: { color: C.muted },
        "data-ocid": "doctor.cores.loading_state",
        children: "SCANNING CORES..."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
      (cores ?? []).map((core, coreIndex) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        CoreCard,
        {
          core,
          coreIndex
        },
        `core-qsi-${String(core.qsi)}`
      )),
      (!cores || cores.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[9px] tracking-widest uppercase",
          style: { color: C.muted },
          "data-ocid": "doctor.cores.empty_state",
          children: "NO CORE DATA"
        }
      )
    ] })
  ] });
}
function NeuralEcologyPanel() {
  const { data: eco, isLoading } = useEcologyState();
  const budget = (eco == null ? void 0 : eco.budget) ?? Array(12).fill(0);
  const freqs = (eco == null ? void 0 : eco.freqs) ?? Array(12).fill(0);
  const pressure = (eco == null ? void 0 : eco.pressure) ?? 0;
  const maxBudget = Math.max(...budget, 1e-4);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { "data-ocid": "doctor.ecology.panel", className: "h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ NEURAL ECOLOGY" }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "font-mono text-[9px] tracking-widest uppercase animate-pulse",
        style: { color: C.muted },
        "data-ocid": "doctor.ecology.loading_state",
        children: "SCANNING ECOLOGY..."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetricLabel, { text: "ECOLOGY PRESSURE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[9px] font-bold",
              style: {
                color: pressure > 0.7 ? C.red : pressure > 0.4 ? C.amber : C.green
              },
              children: `${(pressure * 100).toFixed(1)}%`
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-1.5",
            style: { background: "oklch(0.12 0.01 265)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  width: `${pressure * 100}%`,
                  height: "100%",
                  background: pressure > 0.7 ? C.red : pressure > 0.4 ? C.amber : C.green,
                  transition: "width 0.5s ease"
                }
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: budget.slice(0, 12).map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-mono text-[8px] w-8 shrink-0",
                style: { color: C.dim },
                children: [
                  "H-",
                  String(i).padStart(2, "0")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex-1 h-1",
                style: { background: "oklch(0.12 0.01 265)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      width: `${b / maxBudget * 100}%`,
                      height: "100%",
                      background: C.cyan,
                      opacity: 0.85,
                      transition: "width 0.5s ease"
                    }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px] w-12 text-right shrink-0",
                style: { color: C.muted },
                children: freqs[i] != null ? `${freqs[i].toFixed(2)} Hz` : "—"
              }
            )
          ]
        },
        `hz-region-H${String(i).padStart(2, "0")}`
      )) })
    ] })
  ] });
}
function MilestoneLedgerPanel() {
  const { data: m, isLoading } = useMilestoneAlerts();
  const milestones = [
    {
      key: "omnis",
      milestoneLabel: "OMNIS THRESHOLD",
      hit: (m == null ? void 0 : m.omnis) ?? false,
      beat: m == null ? void 0 : m.omnisB,
      color: C.green
    },
    {
      key: "emer",
      milestoneLabel: "EMERGENCE EVENT",
      hit: (m == null ? void 0 : m.emer) ?? false,
      beat: m == null ? void 0 : m.emerB,
      color: C.cyan
    },
    {
      key: "crit",
      milestoneLabel: "CRITICAL STATE",
      hit: (m == null ? void 0 : m.crit) ?? false,
      beat: m == null ? void 0 : m.critB,
      color: C.red
    },
    {
      key: "boot",
      milestoneLabel: "BOOTSTRAP COMPLETE",
      hit: (m == null ? void 0 : m.boot) ?? false,
      beat: m == null ? void 0 : m.bootB,
      color: C.amber
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { "data-ocid": "doctor.milestones.panel", className: "h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ MILESTONE LEDGER" }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "font-mono text-[9px] tracking-widest uppercase animate-pulse",
        style: { color: C.muted },
        "data-ocid": "doctor.milestones.loading_state",
        children: "LOADING LEDGER..."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: milestones.map(({ key, milestoneLabel, hit, beat, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 py-2 border-b",
        style: {
          borderColor: "oklch(0.15 0.03 250)",
          opacity: hit ? 1 : 0.45
        },
        "data-ocid": `doctor.milestone.${key}.row`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-2.5 h-2.5 rounded-full shrink-0",
              style: {
                background: hit ? color : "oklch(0.15 0.02 265)",
                boxShadow: hit ? `0 0 8px ${color}` : "none",
                border: `1px solid ${hit ? color : "oklch(0.25 0.03 265)"}`
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[10px] tracking-widest uppercase font-bold",
                style: { color: hit ? color : C.dimlo },
                children: milestoneLabel
              }
            ),
            hit && beat !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "font-mono text-[8px] tracking-wider",
                style: { color: C.muted },
                children: [
                  "Beat #",
                  Number(beat).toLocaleString()
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[9px] tracking-widest",
              style: { color: hit ? color : C.dimlo },
              children: hit ? "✓" : "○"
            }
          )
        ]
      },
      key
    )) })
  ] });
}
function NoSubstrate() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center gap-3 py-16",
      "data-ocid": "doctor.error_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-8 h-8 flex items-center justify-center border",
            style: { borderColor: C.border, color: C.dim },
            children: "✕"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[11px] tracking-widest uppercase",
            style: { color: C.dim },
            children: "CONNECT TO SUBSTRATE"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[9px] tracking-widest",
            style: { color: C.dimlo },
            children: "Backend not responding — deploy canister first"
          }
        )
      ]
    }
  );
}
function DoctorTab() {
  const { data: canon, isLoading: canonLoading } = useCanonicalState();
  const showNoData = !canonLoading && canon === null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-y-auto",
      style: { background: C.bg },
      "data-ocid": "doctor.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SovereignHealthBanner, {}),
        showNoData ? /* @__PURE__ */ jsxRuntimeExports.jsx(NoSubstrate, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.35, delay: 0.05 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CanonicalStrip, {})
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.35, delay: 0.1 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CoreGrid, {})
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "grid grid-cols-1 md:grid-cols-2 gap-3",
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.35, delay: 0.15 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(NeuralEcologyPanel, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx(MilestoneLedgerPanel, {})
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.35, delay: 0.2 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(VitalSubstratePanel, {})
            }
          )
        ] })
      ]
    }
  );
}
export {
  DoctorTab as default
};
