const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Connectome3D-BMnyDfM4.js","assets/index-CGYrnU7d.js","assets/index-BdopbMkg.css","assets/OrbitControls-CwmRBLxw.js","assets/three.module-DHVhg58e.js"])))=>i.map(i=>d[i]);
import { r as reactExports, e as useCanonicalState, f as useDoctorReport, g as useNeuroChem, h as useVitalSubstrate, i as useEcologyState, j as jsxRuntimeExports, _ as __vitePreload } from "./index-CGYrnU7d.js";
const Connectome3D = reactExports.lazy(() => __vitePreload(() => import("./Connectome3D-BMnyDfM4.js"), true ? __vite__mapDeps([0,1,2,3,4]) : void 0));
const C = {
  bg: "oklch(0.06 0.01 265)",
  panel: "oklch(0.09 0.015 265)",
  border: "oklch(0.2 0.05 255)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.82 0.22 80)",
  green: "oklch(0.68 0.28 140)",
  dim: "oklch(0.38 0.05 220)",
  amber: "oklch(0.78 0.22 80)",
  red: "oklch(0.65 0.25 25)"
};
function Bar({
  value,
  color,
  label,
  max = 1
}) {
  const pct = Math.min(100, value / max * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[8px] tracking-widest uppercase",
          style: { color: C.dim },
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px]", style: { color }, children: value.toFixed(3) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-1.5 rounded-full",
        style: { background: "oklch(0.15 0.03 255)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full rounded-full transition-all duration-1000",
            style: { width: `${pct}%`, background: color }
          }
        )
      }
    )
  ] });
}
function Skeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "h-4 w-full rounded animate-pulse",
      style: { background: "oklch(0.12 0.02 255)" }
    }
  );
}
const HZ_LABELS = [
  "IDENTITY",
  "MISSION",
  "BODY",
  "WORLD",
  "SOCIAL",
  "COGNITION",
  "GOALS",
  "MEMORY",
  "CONSEQUENCE",
  "ADAPTATION",
  "TEMPORAL",
  "EVALUATION"
];
function OrganismTab() {
  const [fullscreen, setFullscreen] = reactExports.useState(false);
  const canonicalQ = useCanonicalState();
  const doctorQ = useDoctorReport();
  const neuroChemQ = useNeuroChem();
  const vitalQ = useVitalSubstrate();
  const ecologyQ = useEcologyState();
  const c = canonicalQ.data;
  const doc = doctorQ.data;
  const nc = neuroChemQ.data;
  const vital = vitalQ.data;
  const eco = ecologyQ.data;
  const isOmnis = (c == null ? void 0 : c.eg) ?? false;
  const coh = (c == null ? void 0 : c.coh) ?? 0;
  const isCritical = coh < 0.3;
  const glowColor = isOmnis ? C.cyan : isCritical ? C.red : C.green;
  const healthColor = (v) => v > 0.7 ? C.green : v > 0.4 ? C.amber : C.red;
  const docStatus = doc ? Number(doc.sh) === 0 ? "HEALTHY" : Number(doc.sh) === 1 ? "WARNING" : "CRITICAL" : "—";
  const docStatusColor = doc ? Number(doc.sh) === 0 ? C.green : Number(doc.sh) === 1 ? C.amber : C.red : C.dim;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "h-full overflow-y-auto p-4 space-y-4",
      style: {
        background: C.bg,
        boxShadow: isOmnis ? "inset 0 0 60px oklch(0.72 0.22 195 / 0.08)" : "none"
      },
      children: [
        fullscreen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50", style: { background: "#050811" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            reactExports.Suspense,
            {
              fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-full h-full flex items-center justify-center",
                  style: {
                    color: C.dim,
                    fontFamily: "monospace",
                    fontSize: "10px"
                  },
                  children: "LOADING CONNECTOME…"
                }
              ),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Connectome3D, { fullscreen: true })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setFullscreen(false),
              className: "absolute top-4 right-4 font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 border z-10",
              style: {
                borderColor: C.cyan,
                color: C.cyan,
                background: "oklch(0.06 0.01 265 / 0.9)"
              },
              "data-ocid": "organism.connectome.close_button",
              children: "⊟ COLLAPSE"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded overflow-hidden relative",
            style: {
              borderColor: isOmnis ? C.cyan : C.border,
              background: "#050811",
              boxShadow: isOmnis ? "0 0 20px oklch(0.72 0.22 195 / 0.2)" : "none"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 right-2 z-10 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] tracking-widest",
                    style: { color: C.dim },
                    children: "3D CONNECTOME — LIVE"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setFullscreen(true),
                    className: "font-mono text-[8px] tracking-widest uppercase px-2 py-1 border",
                    style: {
                      borderColor: C.border,
                      color: C.dim,
                      background: "oklch(0.06 0.01 265 / 0.8)"
                    },
                    "data-ocid": "organism.connectome.open_modal_button",
                    children: "⊞ FULL VIEW"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                reactExports.Suspense,
                {
                  fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        height: "280px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "monospace",
                        fontSize: "10px",
                        color: "#334"
                      },
                      children: "INITIALIZING CONNECTOME…"
                    }
                  ),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Connectome3D, { fullscreen: false })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-4",
            style: {
              borderColor: isOmnis ? C.cyan : C.border,
              background: C.panel,
              boxShadow: isOmnis ? "0 0 20px oklch(0.72 0.22 195 / 0.2)" : "none"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-3",
                  style: { color: C.dim },
                  children: "ORGANISM CORE STATE — LIVE"
                }
              ),
              c ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[9px] tracking-widest uppercase",
                        style: { color: C.dim },
                        children: "COHERENCE"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[22px] font-bold",
                        style: {
                          color: glowColor,
                          textShadow: `0 0 20px ${glowColor}`
                        },
                        children: coh.toFixed(4)
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-full h-3 rounded-full",
                      style: { background: "oklch(0.15 0.03 255)" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "h-full rounded-full transition-all duration-1000",
                          style: {
                            width: `${coh * 100}%`,
                            background: glowColor,
                            boxShadow: `0 0 8px ${glowColor}`
                          }
                        }
                      )
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: c.es, color: C.cyan, label: "EMERGENCE" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: c.ic, color: C.gold, label: "IDENTITY COH" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: c.ar, color: C.amber, label: "AROUSAL" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: c.fe, color: C.red, label: "FREE ENERGY" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: c.kf, color: C.green, label: "kfHz SYNC" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: c.qh, color: "oklch(0.72 0.22 280)", label: "Q-HIVE" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "mt-3 pt-3 border-t flex items-center justify-between",
                    style: { borderColor: C.border },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[9px] tracking-widest uppercase",
                          style: { color: C.dim },
                          children: "BEAT"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[13px] font-bold",
                          style: { color: C.cyan },
                          children: Number(c.b).toLocaleString()
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[9px] tracking-widest uppercase",
                          style: { color: C.dim },
                          children: "EXPRESSION GATE"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[11px] font-bold",
                          style: { color: c.eg ? C.green : C.dim },
                          children: c.eg ? "OPEN" : "CLOSED"
                        }
                      )
                    ]
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
                  children: "DOCTOR AGENT"
                }
              ),
              doc ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[8px]", style: { color: C.dim }, children: "STATUS" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[12px] font-bold",
                      style: { color: docStatusColor },
                      children: docStatus
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[8px]", style: { color: C.dim }, children: "SCANS" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[12px] font-bold",
                      style: { color: C.cyan },
                      children: Number(doc.scan).toLocaleString()
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[8px]", style: { color: C.dim }, children: "CRITICAL" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[12px] font-bold",
                      style: { color: doc.cc > 0 ? C.red : C.green },
                      children: Number(doc.cc)
                    }
                  )
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {})
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-4 space-y-2",
            style: { borderColor: C.border, background: C.panel },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-2",
                  style: { color: C.dim },
                  children: "NEUROTRANSMITTERS"
                }
              ),
              nc ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-4 gap-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: nc.dpa, color: C.gold, label: "DOPAMINE" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: nc.ser, color: C.cyan, label: "SEROTONIN" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: nc.nor, color: C.amber, label: "NOREPINEPHRINE" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: nc.ach, color: C.green, label: "ACETYLCHOLINE" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: nc.gab, color: "oklch(0.72 0.22 280)", label: "GABA" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Bar,
                  {
                    value: nc.glu,
                    color: "oklch(0.72 0.22 320)",
                    label: "GLUTAMATE"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: nc.cor, color: C.red, label: "CORTISOL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Bar,
                  {
                    value: nc.oxt,
                    color: "oklch(0.72 0.22 160)",
                    label: "OXYTOCIN"
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {})
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-4 space-y-2",
            style: { borderColor: C.border, background: C.panel },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-2",
                  style: { color: C.dim },
                  children: "VITAL ORGANS"
                }
              ),
              vital ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-4 gap-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bar,
                    {
                      value: vital.heart,
                      color: healthColor(vital.heart),
                      label: "HEART"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bar,
                    {
                      value: vital.lung,
                      color: healthColor(vital.lung),
                      label: "LUNG"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bar,
                    {
                      value: vital.liver,
                      color: healthColor(vital.liver),
                      label: "LIVER"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bar,
                    {
                      value: vital.kidney,
                      color: healthColor(vital.kidney),
                      label: "KIDNEY"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bar,
                    {
                      value: vital.immune,
                      color: healthColor(vital.immune),
                      label: "IMMUNE"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: vital.threat, color: C.red, label: "THREAT LEVEL" })
                ] }),
                vital.aegisLock && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "mt-2 font-mono text-[9px] tracking-widest uppercase text-center py-1 rounded",
                    style: {
                      color: C.red,
                      background: "oklch(0.65 0.25 25 / 0.1)",
                      border: `1px solid ${C.red}`
                    },
                    children: [
                      "⚠ AEGIS LOCK ACTIVE — BEAT",
                      " ",
                      Number(vital.aegisBeat).toLocaleString()
                    ]
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
                  children: "12 Hz SUBSTRATE NODES"
                }
              ),
              eco ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: eco.freqs.slice(0, 12).map((freq, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static array
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[7px] tracking-widest",
                      style: { color: C.dim },
                      children: HZ_LABELS[i] ?? `N${i}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "mx-auto rounded-full flex items-center justify-center",
                      style: {
                        width: "36px",
                        height: "36px",
                        border: `1px solid oklch(0.72 0.22 195 / ${Math.min(1, freq)})`,
                        background: `oklch(0.72 0.22 195 / ${Math.min(0.3, freq * 0.3)})`,
                        boxShadow: freq > 0.7 ? "0 0 8px oklch(0.72 0.22 195 / 0.5)" : "none"
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px] font-bold",
                          style: { color: C.cyan },
                          children: freq.toFixed(2)
                        }
                      )
                    }
                  )
                ] }, i)
              )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {})
            ]
          }
        )
      ]
    }
  );
}
export {
  OrganismTab as default
};
