import { j as jsxRuntimeExports, C as useShellState, D as useExtendedOrganState, E as useExtendedNeuroChem21, F as useAnimalEngineState } from "./index-CGYrnU7d.js";
import { S as ScrollArea } from "./scroll-area-t--KCaVV.js";
import { m as motion } from "./proxy-BnoGaVMl.js";
import "./index-D1cPK64R.js";
import "./utils-DpgYLn5a.js";
const BG = "oklch(0.06 0.01 265)";
const PANEL = "oklch(0.075 0.012 265)";
const DEEP = "oklch(0.042 0.008 265)";
const CYAN = "oklch(0.72 0.22 195)";
const GREEN = "oklch(0.72 0.2 155)";
const RED = "oklch(0.7 0.22 25)";
const AMBER = "oklch(0.78 0.22 75)";
const DIM = "oklch(0.38 0.05 220)";
const FG = "oklch(0.82 0.04 220)";
const PURPLE = "oklch(0.72 0.22 280)";
const SHELL_NAMES = [
  "VITAL",
  "COGNITIVE",
  "BEHAVIORAL",
  "BRANCH-A",
  "BRANCH-B",
  "BRANCH-C",
  "BRANCH-D",
  "BRANCH-E",
  "BRANCH-F",
  "BRANCH-G",
  "BRANCH-H"
];
const HELIX_FALLBACK = [
  0.01,
  9e-3,
  8e-3,
  7e-3,
  6e-3,
  5e-3,
  4e-3,
  3e-3,
  2e-3,
  1e-3,
  1e-3
];
const VITAL_ORGANS = ["heart", "lung", "liver", "kidney", "immune"];
const PHASE_B_ORGANS = [
  "brain",
  "adrenal",
  "thyroid",
  "pancreas",
  "spleen",
  "stomach",
  "intestine",
  "marrow",
  "lymph",
  "skin",
  "eyes",
  "ears",
  "pineal"
];
const ORGAN_LABELS = {
  heart: "HEART",
  lung: "LUNG",
  liver: "LIVER",
  kidney: "KIDNEY",
  immune: "IMMUNE",
  brain: "BRAIN",
  adrenal: "ADRENAL",
  thyroid: "THYROID",
  pancreas: "PANCREAS",
  spleen: "SPLEEN",
  stomach: "STOMACH",
  intestine: "INTEST",
  marrow: "MARROW",
  lymph: "LYMPH",
  skin: "SKIN",
  eyes: "EYES",
  ears: "EARS",
  pineal: "PINEAL"
};
const ORIG_CHEMS = [
  { key: "dpa", label: "DPA", full: "Dopamine" },
  { key: "ser", label: "SER", full: "Serotonin" },
  { key: "nor", label: "NOR", full: "Norepinephrine" },
  { key: "ach", label: "ACH", full: "Acetylcholine" },
  { key: "gab", label: "GABA", full: "GABA" },
  { key: "glu", label: "GLU", full: "Glutamate" },
  { key: "cor", label: "COR", full: "Cortisol" },
  { key: "oxt", label: "OXT", full: "Oxytocin" }
];
const PHASE_B_CHEMS = [
  { key: "aden", label: "ADEN", full: "Adenosine", note: "fatigue gate" },
  { key: "hist", label: "HIST", full: "Histamine", note: "arousal/immune" },
  { key: "mela", label: "MELA", full: "Melatonin", note: "circadian" },
  { key: "endo", label: "ENDO", full: "Endorphin", note: "reward" },
  { key: "ana", label: "ANA", full: "Anandamide", note: "flow state" },
  { key: "subP", label: "SUBP", full: "Substance P", note: "pain signal" },
  { key: "npy", label: "NPY", full: "NPY", note: "energy balance" },
  { key: "crf", label: "CRF", full: "CRF", note: "stress axis" },
  { key: "bdnf", label: "BDNF", full: "BDNF", note: "shell plasticity" },
  { key: "no", label: "NO", full: "Nitric Oxide", note: "vasodilation" },
  { key: "enk", label: "ENK", full: "Enkephalin", note: "pain modulation" },
  { key: "vaso", label: "VASO", full: "Vasopressin", note: "social bond" },
  { key: "prol", label: "PROL", full: "Prolactin", note: "nurture signal" }
];
const ANIMALS = [
  {
    name: "CROW",
    color: AMBER,
    metric1: "pattern",
    key1: "crowPattern",
    metric2: "tool",
    key2: "crowTool",
    mainKey: "crowOut"
  },
  {
    name: "DOLPHIN",
    color: CYAN,
    metric1: "sonar",
    key1: "dolphinSon",
    metric2: "social",
    key2: "dolphinSoc",
    mainKey: "dolphinOut"
  },
  {
    name: "HIVE",
    color: GREEN,
    metric1: "stigmergy",
    key1: "hiveStig",
    metric2: "consensus",
    key2: "hiveCons",
    mainKey: "hiveOut"
  },
  {
    name: "ELEPHANT",
    color: PURPLE,
    metric1: "memory",
    key1: "elephantMem",
    metric2: "ancestry",
    key2: "elephantAnc",
    mainKey: "elephantOut"
  },
  {
    name: "SHARK",
    color: RED,
    metric1: "scan",
    key1: "sharkScan",
    metric2: "effic",
    key2: "sharkEff",
    mainKey: "sharkOut"
  },
  {
    name: "WOLF",
    color: AMBER,
    metric1: "territory",
    key1: "wolfTerr",
    metric2: "hunt",
    key2: "wolfHunt",
    mainKey: "wolfOut"
  },
  {
    name: "ORCA",
    color: CYAN,
    metric1: "strategy",
    key1: "orcaStrat",
    metric2: "dominance",
    key2: "orcaDom",
    mainKey: "orcaOut"
  },
  {
    name: "EAGLE",
    color: AMBER,
    metric1: "persp",
    key1: "eaglePersp",
    metric2: "strike",
    key2: "eagleHit",
    mainKey: "eagleOut"
  },
  {
    name: "OCTOPUS",
    color: PURPLE,
    metric1: "distrib",
    key1: "octopusDist",
    metric2: "adapt",
    key2: "octopusAdapt",
    mainKey: "octopusOut"
  }
];
function SectionHeader({
  title,
  sub,
  live,
  total,
  color = CYAN
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h3",
        {
          className: "font-mono text-[10px] font-bold uppercase tracking-[0.2em]",
          style: { color },
          children: title
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[7.5px] mt-0.5", style: { color: DIM }, children: sub })
    ] }),
    live !== void 0 && total !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "font-mono text-[9px] font-bold px-2 py-1 rounded-sm",
        style: {
          background: `${color}12`,
          color,
          border: `1px solid ${color}35`
        },
        children: [
          live,
          "/",
          total,
          " LIVE"
        ]
      }
    )
  ] });
}
function MiniBar({
  value,
  color,
  height = 3
}) {
  const pct = Math.min(100, Math.max(0, value * 100));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "w-full rounded-full overflow-hidden",
      style: { height: `${height}px`, background: "oklch(0.12 0.03 250)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full rounded-full transition-all duration-700",
          style: {
            width: `${pct}%`,
            background: color,
            boxShadow: `0 0 3px ${color}80`
          }
        }
      )
    }
  );
}
function LiveDot({ active }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "inline-block w-1.5 h-1.5 rounded-full shrink-0",
      style: {
        background: active ? GREEN : RED,
        boxShadow: active ? `0 0 5px ${GREEN}` : "none",
        animation: active ? "pulse 2s infinite" : "none"
      }
    }
  );
}
function ShellSection() {
  const q = useShellState();
  const d = q.data;
  const getShellCoh = (i) => {
    var _a;
    return ((_a = d == null ? void 0 : d.coherences) == null ? void 0 : _a[i]) ?? 0.68 + i * 5e-3;
  };
  const getShellAct = (i) => {
    var _a;
    return ((_a = d == null ? void 0 : d.activations) == null ? void 0 : _a[i]) ?? 0.72 - i * 0.01;
  };
  const getHelix = (i) => {
    var _a;
    return ((_a = d == null ? void 0 : d.helixAlphas) == null ? void 0 : _a[i]) ?? HELIX_FALLBACK[i];
  };
  const isShellLive = (i) => {
    var _a;
    return ((_a = d == null ? void 0 : d.live) == null ? void 0 : _a[i]) ?? i < 5;
  };
  const globalCoh = (d == null ? void 0 : d.globalCoh) ?? 0.742;
  const shellsInit = (d == null ? void 0 : d.shellsInit) ?? true;
  const liveCount = Array.from({ length: 11 }, (_, i) => isShellLive(i)).filter(
    Boolean
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, delay: 0 },
      className: "rounded-sm border p-3",
      style: { background: PANEL, borderColor: `${CYAN}35` },
      "data-ocid": "phase_b.shell.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SectionHeader,
          {
            title: "11-SHELL ARCHITECTURE",
            sub: "Binary hierarchy · HELIX_ALPHA per shell · SACESI locked",
            live: liveCount,
            total: 11,
            color: CYAN
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-3 py-2 mb-3 rounded-sm",
            style: { background: DEEP, border: `1px solid ${CYAN}25` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[7px] uppercase tracking-widest",
                    style: { color: DIM },
                    children: "GLOBAL SHELL COHERENCE"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[18px] font-bold",
                    style: { color: CYAN },
                    children: globalCoh.toFixed(4)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LiveDot, { active: shellsInit }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px] uppercase",
                      style: { color: shellsInit ? GREEN : DIM },
                      children: shellsInit ? "SHELLS INIT" : "PENDING"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[7px]", style: { color: DIM }, children: [
                  liveCount,
                  "/11 shells active"
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid gap-1.5",
            style: { gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" },
            children: Array.from({ length: 11 }, (_, shellIdx) => {
              var _a;
              const i = shellIdx;
              const live = isShellLive(i);
              const coh = getShellCoh(i);
              const act = getShellAct(i);
              const helix = getHelix(i);
              const locked = ((_a = d == null ? void 0 : d.sacesiLocked) == null ? void 0 : _a[i]) ?? live;
              const color = live ? CYAN : DIM;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": `phase_b.shell.item.${i + 1}`,
                  className: "p-2 rounded-sm",
                  style: {
                    background: live ? `${CYAN}07` : `${DIM}06`,
                    border: `1px solid ${live ? CYAN : DIM}25`
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(LiveDot, { active: live }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            className: "font-mono text-[8px] font-bold",
                            style: { color },
                            children: [
                              "S",
                              i
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-[7px]",
                            style: { color: live ? FG : DIM },
                            children: SHELL_NAMES[i]
                          }
                        )
                      ] }),
                      live ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[6px] px-1 py-0.5 rounded-sm",
                          style: {
                            background: `${GREEN}15`,
                            color: GREEN,
                            border: `1px solid ${GREEN}30`
                          },
                          children: "LIVE"
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[6px] px-1 py-0.5 rounded-sm",
                          style: {
                            background: `${DIM}10`,
                            color: DIM,
                            border: `1px solid ${DIM}20`
                          },
                          children: "PH-C"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[6.5px]",
                              style: { color: DIM },
                              children: "COH"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[6.5px]", style: { color }, children: coh.toFixed(3) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: coh, color: live ? CYAN : DIM })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[6.5px]",
                              style: { color: DIM },
                              children: "ACT"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[6.5px]", style: { color }, children: act.toFixed(3) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: act, color: live ? GREEN : DIM })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "flex items-center justify-between mt-1.5 pt-1",
                        style: { borderTop: `1px solid ${DIM}15` },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[6.5px]", style: { color: DIM }, children: [
                            "α=",
                            helix.toFixed(3)
                          ] }),
                          locked && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[6px]",
                              style: { color: AMBER },
                              children: "⚡ SACESI"
                            }
                          )
                        ]
                      }
                    )
                  ]
                },
                i
              );
            })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "mt-3 px-2 py-1.5 rounded-sm font-mono text-[7px]",
            style: {
              background: DEEP,
              color: DIM,
              borderLeft: `2px solid ${CYAN}40`
            },
            children: "Phase-Amplitude Coupling: amp[k+1] = amp[k+1] × (1 + 0.35·cos(φ[k])) / 2 · slow phases nest fast amplitudes every heartbeat tick"
          }
        )
      ]
    }
  );
}
function OrgansSection() {
  const q = useExtendedOrganState();
  const d = q.data;
  const getOrgan = (key) => {
    if (!d) return 0.72 + Math.random() * 0.1;
    return d[key] ?? 0;
  };
  const organAvg = (d == null ? void 0 : d.organAvg) ?? 0.78;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, delay: 0.1 },
      className: "rounded-sm border p-3",
      style: { background: PANEL, borderColor: `${GREEN}35` },
      "data-ocid": "phase_b.organs.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SectionHeader,
          {
            title: "18-ORGAN SUBSTRATE",
            sub: "5 vital (Phase A) + 13 Phase B · integrity 0.0→1.0",
            live: 18,
            total: 18,
            color: GREEN
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-3 py-2 mb-3 rounded-sm",
            style: { background: DEEP, border: `1px solid ${GREEN}25` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[7px] uppercase tracking-widest",
                    style: { color: DIM },
                    children: "ORGAN AVERAGE INTEGRITY"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[18px] font-bold",
                    style: { color: GREEN },
                    children: organAvg.toFixed(4)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[7px]", style: { color: GREEN }, children: "ALL 18 BUILT" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[7px]", style: { color: DIM }, children: "5 vital + 13 new" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1", style: { background: `${GREEN}25` } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px] uppercase tracking-widest",
                style: { color: GREEN },
                children: "VITAL · Phase A"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1", style: { background: `${GREEN}25` } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-5 gap-1.5", children: VITAL_ORGANS.map((key, idx) => {
            const val = getOrgan(key);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `phase_b.organs.item.${idx + 1}`,
                className: "p-2 rounded-sm text-center",
                style: {
                  background: `${GREEN}0d`,
                  border: `1px solid ${GREEN}35`
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[7px] font-bold mb-1.5",
                      style: { color: GREEN },
                      children: ORGAN_LABELS[key]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[8px] font-bold mb-1",
                      style: { color: FG },
                      children: val.toFixed(3)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: val, color: GREEN, height: 4 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[6px] mt-1 px-1 py-0.5 rounded-sm inline-block",
                      style: { background: `${GREEN}20`, color: GREEN },
                      children: "VITAL"
                    }
                  )
                ]
              },
              key
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1", style: { background: `${AMBER}25` } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px] uppercase tracking-widest",
                style: { color: AMBER },
                children: "PHASE B · 13 New Organs"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1", style: { background: `${AMBER}25` } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid gap-1",
              style: {
                gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))"
              },
              children: PHASE_B_ORGANS.map((key, idx) => {
                const val = getOrgan(key);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": `phase_b.organs.item.${idx + 6}`,
                    className: "p-1.5 rounded-sm",
                    style: {
                      background: `${AMBER}08`,
                      border: `1px solid ${AMBER}28`
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-[7px] font-bold",
                            style: { color: AMBER },
                            children: ORGAN_LABELS[key]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: FG }, children: val.toFixed(2) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: val, color: AMBER })
                    ]
                  },
                  key
                );
              })
            }
          )
        ] })
      ]
    }
  );
}
function NeuroChemSection() {
  const q = useExtendedNeuroChem21();
  const d = q.data;
  const getChem = (key) => {
    if (!d) return 0.5;
    return d[key] ?? 0;
  };
  const CROSS_WIRES = [
    {
      from: "BDNF",
      to: "Shell plasticity",
      note: "Higher BDNF → faster HELIX_ALPHA adaptation"
    },
    {
      from: "Adenosine",
      to: "Fatigue gate",
      note: "High adenosine → reduces node activations"
    },
    {
      from: "Anandamide",
      to: "Flow state",
      note: "Ana > 0.75 → triggers behavioral flow mode"
    },
    {
      from: "CRF",
      to: "Stress axis",
      note: "CRF → cortisol → immune suppression chain"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, delay: 0.2 },
      className: "rounded-sm border p-3",
      style: { background: PANEL, borderColor: `${CYAN}35` },
      "data-ocid": "phase_b.neurochem.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SectionHeader,
          {
            title: "21-NEUROCHEMICAL ANALOG",
            sub: "8 original (cyan) + 13 Phase B (amber) · real cross-wires",
            live: 21,
            total: 21,
            color: CYAN
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1", style: { background: `${CYAN}25` } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px] uppercase tracking-widest",
                style: { color: CYAN },
                children: "ORIGINAL 8 · Phase A"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1", style: { background: `${CYAN}25` } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-1.5", children: ORIG_CHEMS.map((chem, idx) => {
            const val = getChem(chem.key);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `phase_b.neurochem.item.${idx + 1}`,
                title: chem.full,
                className: "p-1.5 rounded-sm",
                style: {
                  background: `${CYAN}09`,
                  border: `1px solid ${CYAN}30`
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7.5px] font-bold",
                        style: { color: CYAN },
                        children: chem.label
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: FG }, children: val.toFixed(2) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: val, color: CYAN })
                ]
              },
              chem.key
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1", style: { background: `${AMBER}25` } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px] uppercase tracking-widest",
                style: { color: AMBER },
                children: "PHASE B · 13 New Chemicals"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1", style: { background: `${AMBER}25` } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-1.5", children: PHASE_B_CHEMS.map((chem, idx) => {
            const val = getChem(chem.key);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `phase_b.neurochem.item.${idx + 9}`,
                title: `${chem.full} · ${chem.note}`,
                className: "p-1.5 rounded-sm",
                style: {
                  background: `${AMBER}08`,
                  border: `1px solid ${AMBER}28`
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7.5px] font-bold",
                        style: { color: AMBER },
                        children: chem.label
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: FG }, children: val.toFixed(2) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: val, color: AMBER })
                ]
              },
              chem.key
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-sm p-2.5 space-y-1.5",
            style: { background: DEEP, border: `1px solid ${CYAN}20` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[7px] uppercase tracking-widest mb-1.5",
                  style: { color: DIM },
                  children: "KEY CROSS-WIRE EFFECTS"
                }
              ),
              CROSS_WIRES.map((cw) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono text-[7px] font-bold w-20 shrink-0",
                    style: { color: AMBER },
                    children: [
                      cw.from,
                      "→",
                      cw.to
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: DIM }, children: cw.note })
              ] }, cw.from))
            ]
          }
        )
      ]
    }
  );
}
function AnimalEnginesSection() {
  const q = useAnimalEngineState();
  const d = q.data;
  const getVal = (key) => {
    if (!d) return 0.6 + Math.random() * 0.15;
    return d[key] ?? 0;
  };
  const composite = (d == null ? void 0 : d.animalScore) ?? 0.71;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, delay: 0.3 },
      className: "rounded-sm border p-3",
      style: { background: PANEL, borderColor: `${AMBER}35` },
      "data-ocid": "phase_b.engines.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SectionHeader,
          {
            title: "9 SOVEREIGN ANIMAL ENGINES",
            sub: "Crow · Dolphin · Hive · Elephant · Shark · Wolf · Orca · Eagle · Octopus",
            live: 9,
            total: 9,
            color: AMBER
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-3 py-2 mb-3 rounded-sm",
            style: { background: DEEP, border: `1px solid ${AMBER}25` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[7px] uppercase tracking-widest",
                    style: { color: DIM },
                    children: "COMPOSITE ENGINE SCORE"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[18px] font-bold",
                    style: { color: AMBER },
                    children: composite.toFixed(4)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LiveDot, { active: true }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px] uppercase",
                      style: { color: GREEN },
                      children: "ALL 9 LIVE"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[7px]", style: { color: DIM }, children: "Phase B complete" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid gap-2",
            style: { gridTemplateColumns: "repeat(3, 1fr)" },
            children: ANIMALS.map((animal, idx) => {
              const mainOut = getVal(animal.mainKey);
              const m1 = getVal(animal.key1);
              const m2 = getVal(animal.key2);
              const { color } = animal;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": `phase_b.engines.item.${idx + 1}`,
                  className: "p-2.5 rounded-sm",
                  style: {
                    background: `${color}09`,
                    border: `1px solid ${color}35`
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(LiveDot, { active: true }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-[8px] font-bold",
                            style: { color },
                            children: animal.name
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px] font-bold",
                          style: { color },
                          children: mainOut.toFixed(3)
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: mainOut, color, height: 5 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-[6.5px] uppercase",
                            style: { color: DIM },
                            children: animal.metric1
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: FG }, children: m1.toFixed(3) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: m1, color: `${color}90`, height: 2 }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-[6.5px] uppercase",
                            style: { color: DIM },
                            children: animal.metric2
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: FG }, children: m2.toFixed(3) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: m2, color: `${color}70`, height: 2 })
                    ] })
                  ]
                },
                animal.name
              );
            })
          }
        )
      ]
    }
  );
}
function PhaseBBanner() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-sm border p-3",
      style: {
        background: DEEP,
        borderColor: `${AMBER}40`,
        fontFamily: "'JetBrains Mono', 'Geist Mono', monospace"
      },
      "data-ocid": "phase_b.banner.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "w-2 h-2 rounded-full",
              style: {
                background: AMBER,
                boxShadow: `0 0 8px ${AMBER}`,
                animation: "pulse 2s infinite"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[9px] uppercase tracking-[0.25em] font-bold",
              style: { color: AMBER },
              children: "PHASE B — CORE BRAIN MAX GENESIS — COMPLETE"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "font-mono text-[8px] leading-[1.6]",
            style: { color: CYAN },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "╔═══════════════════════════════════════════════╗" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: CYAN }, children: "║" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: DIM }, children: "Shells live:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: GREEN }, className: "font-bold", children: "5 / 11" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: DIM }, children: "S0→S4 HELIX_ALPHA differentiated" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: CYAN }, children: "║" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: DIM }, children: "Organs built:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: GREEN }, className: "font-bold", children: "18 / 18" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: DIM }, children: "5 vital + 13 new Phase B" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: CYAN }, children: "║" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: DIM }, children: "Neurochems:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: GREEN }, className: "font-bold", children: "21 / 21" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: DIM }, children: "8 original + 13 Phase B analogs" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: CYAN }, children: "║" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: DIM }, children: "Animal engines:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: GREEN }, className: "font-bold", children: "9 / 9" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: DIM }, children: "all sovereign engines live" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: CYAN }, children: "║" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: DIM }, children: "Systems audited:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: AMBER }, className: "font-bold", children: "22 / 36 LIVE" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: DIM }, children: "+4 from Phase B" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "╚═══════════════════════════════════════════════╝" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mt-3", children: [
          {
            label: "NEXT: PHASE C",
            sub: "Shells 6-11 + 12 Metals",
            color: DIM
          },
          {
            label: "TARGET: 4,096 DIMS",
            sub: "H_max = 12 bits sovereign",
            color: DIM
          },
          {
            label: "TARGET: 12 TOKENS",
            sub: "4 pending: CVT VCT RST MRC",
            color: DIM
          }
        ].map(({ label, sub, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-2 py-1.5 rounded-sm",
            style: { background: `${DIM}12`, border: `1px solid ${DIM}25` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[7.5px] font-bold",
                  style: { color: AMBER },
                  children: label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[7px]", style: { color }, children: sub })
            ]
          },
          label
        )) })
      ]
    }
  );
}
function PhaseBPanel() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-full", "data-ocid": "phase_b.page", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-4 space-y-4",
      style: {
        background: BG,
        minHeight: "100%",
        fontFamily: "'JetBrains Mono', 'Geist Mono', monospace"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 pb-2",
            style: { borderBottom: `1px solid ${AMBER}25` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-8 h-8 flex items-center justify-center font-mono text-sm font-bold",
                  style: {
                    border: `1px solid ${AMBER}50`,
                    color: AMBER,
                    boxShadow: `0 0 12px ${AMBER}30`
                  },
                  children: "B"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "font-mono text-[12px] font-bold uppercase tracking-[0.2em]",
                    style: { color: FG },
                    children: "PHASE B — CORE BRAIN MAXIMUM GENESIS"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[8px] mt-0.5", style: { color: DIM }, children: "11-Shell Architecture · 18 Organs · 21 Neurochemicals · 9 Animal Engines · All Systems Live" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PhaseBBanner, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShellSection, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(OrgansSection, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(NeuroChemSection, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimalEnginesSection, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "text-center py-2 font-mono text-[7px] tracking-widest uppercase",
            style: { color: DIM, borderTop: `1px solid ${DIM}20` },
            children: "NEUROEMERGENCE CORE · PHASE B · MEDINA DOCTRINE · ALL SYSTEMS SOVEREIGN"
          }
        )
      ]
    }
  ) });
}
export {
  PhaseBPanel as default
};
