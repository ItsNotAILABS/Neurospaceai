import { r as reactExports, j as jsxRuntimeExports, a9 as useLiveOrganismPulse, aj as useActor, a as useQuery, ak as createActor } from "./index-CGYrnU7d.js";
import { E } from "./jspdf.es.min-IUhxF21l.js";
const T_PRIMARY = "oklch(0.72 0.18 195)";
const T_NEON = "oklch(0.88 0.22 192)";
const T_DIM = "oklch(0.42 0.08 200)";
const T_DIMMER = "oklch(0.30 0.05 210)";
const T_BORDER = "oklch(0.22 0.08 215)";
const T_BORDER_MID = "oklch(0.16 0.05 220)";
const T_SURFACE = "oklch(0.065 0.013 230)";
const T_AMBER = "oklch(0.75 0.22 65)";
const T_RED = "oklch(0.65 0.25 25)";
const T_YELLOW = "oklch(0.82 0.20 95)";
const T_INHIBIT = "oklch(0.72 0.18 195)";
const PHI$1 = 1.618033988749895;
function barColor(cat) {
  if (cat === "excitatory") return T_AMBER;
  if (cat === "inhibitory") return T_INHIBIT;
  if (cat === "stress") return T_RED;
  return T_YELLOW;
}
function getSignificance(v) {
  if (v > 0.75) return "HIGH";
  if (v > 0.5) return "MEDIUM";
  return "LOW";
}
function researchTag(abbr) {
  const map = {
    DPA: "#dopamine-saturation",
    SER: "#serotonin-reuptake",
    NOR: "#norepinephrine-gating",
    GABA: "#gaba-inhibition",
    GLU: "#glutamate-excitation",
    ACH: "#acetylcholine-modulation",
    COR: "#cortisol-hpa-axis",
    NPY: "#npy-hunger-drive"
  };
  return map[abbr] ?? "#neuromodulation";
}
const EXPERIMENT_TEMPLATES = {
  DPA: "Dopamine receptor D2 saturation threshold test at current NAc activation level",
  SER: "Serotonin reuptake inhibition response under elevated cortical load",
  NOR: "Norepinephrine alpha-2A thalamic gating efficacy at current LC-NE output",
  GABA: "GABAergic inhibitory cascade timing analysis during current activation pattern",
  GLU: "Glutamate mGluR2/3 presynaptic dampening kinetics under surge conditions",
  ACH: "Acetylcholine nicotinic receptor M1/M2 modulation assay in hippocampal loop",
  COR: "CRH-R1 antagonist HPA axis stress clamp response at current cortisol proxy",
  NPY: "NPY Y1/Y5 receptor activation threshold mapping during metabolic drive elevation"
};
function buildHypotheses(dominantAbbr) {
  const map = {
    DPA: [
      "HYPOTHESIS 1: Low-dose D2 partial agonist at D2R autoreceptor normalisation of dopaminergic overdrive",
      "HYPOTHESIS 2: D1 PAM co-administration with mGluR5 NAM fronto-striatal stability restoration",
      "HYPOTHESIS 3: COMT inhibition at PFC catechol-O-methyltransferase sustained working-memory potentiation"
    ],
    SER: [
      "HYPOTHESIS 1: 5-HT2A SAM at cortical pyramidal cells elevation of oscillatory stability index",
      "HYPOTHESIS 2: SERT allosteric modulator at serotonin transporter sustained synaptic 5-HT elevation",
      "HYPOTHESIS 3: 5-HT1A autoreceptor desensitiser at raphe-cortical loop acceleration of steady-state onset"
    ],
    NOR: [
      "HYPOTHESIS 1: alpha-2A agonist at LC-NE output thalamic gating enhancement under arousal load",
      "HYPOTHESIS 2: NET reuptake inhibitor at prefrontal norepinephrine working-memory bandwidth extension",
      "HYPOTHESIS 3: beta-1 antagonist at cortical adrenoceptor reduction of hyperarousal-driven saturation"
    ],
    GABA: [
      "HYPOTHESIS 1: GABA-A alpha-5 negative PAM at hippocampal interneurons selective disinhibition for LTP",
      "HYPOTHESIS 2: GABA-B antagonist at presynaptic terminal release of inhibitory suppression on PFC output",
      "HYPOTHESIS 3: KCC2 upregulator at chloride transporter restoration of inhibitory polarity gradient"
    ],
    GLU: [
      "HYPOTHESIS 1: mGluR2/3 orthosteric agonist at presynaptic terminal glutamate surge dampening",
      "HYPOTHESIS 2: NMDA GluN2B antagonist at postsynaptic NMDAR reduction of excitotoxic risk threshold",
      "HYPOTHESIS 3: AMPA PAM at low dose enhancement of signal-to-noise ratio in cortical circuits"
    ],
    ACH: [
      "HYPOTHESIS 1: M1 PAM at hippocampal muscarinic receptors memory consolidation potentiation",
      "HYPOTHESIS 2: AChE inhibitor partial at basal forebrain cholinergic tone elevation in theta burst phase",
      "HYPOTHESIS 3: alpha-7 nAChR agonist at PFC nicotinic receptors attention gating enhancement"
    ],
    COR: [
      "HYPOTHESIS 1: CRH-R1 antagonist at paraventricular nucleus HPA axis stress response attenuation",
      "HYPOTHESIS 2: 11-beta-HSD1 inhibitor at hippocampal glucocorticoid receptors neuroprotection",
      "HYPOTHESIS 3: FKBP51 inhibitor at GR-chaperone complex stress sensitivity normalisation"
    ],
    NPY: [
      "HYPOTHESIS 1: NPY Y1 antagonist at hypothalamic feeding circuit metabolic drive recalibration",
      "HYPOTHESIS 2: GLP-1 receptor agonist at brainstem satiety nodes appetite-cognition balance restoration",
      "HYPOTHESIS 3: AgRP inhibitor at arcuate nucleus suppression of orexigenic overdrive"
    ]
  };
  return map[dominantAbbr] ?? [
    "HYPOTHESIS 1: Receptor agonist at target site modulation of downstream signalling",
    "HYPOTHESIS 2: Allosteric modulator at binding domain enhancement of selectivity profile",
    "HYPOTHESIS 3: Reuptake inhibitor at transporter site prolonged synaptic dwell time"
  ];
}
function PharmaAgentPanel({ neural }) {
  const [trialCounter, setTrialCounter] = reactExports.useState(0);
  const [trials, setTrials] = reactExports.useState([]);
  const [hypotheses, setHypotheses] = reactExports.useState([
    "HYPOTHESIS 1: D2 partial agonist at NAc autoreceptor — normalization of dopaminergic baseline",
    "HYPOTHESIS 2: 5-HT2A SAM at cortical pyramidal cells — oscillatory stability elevation",
    "HYPOTHESIS 3: GABA-A alpha-5 NAM at hippocampal interneurons — LTP disinhibition"
  ]);
  const [findings, setFindings] = reactExports.useState([]);
  const counterRef = reactExports.useRef(0);
  const nt = neural.neurotransmitters ?? {};
  const chemicals = [
    {
      abbr: "DPA",
      name: "Dopamine",
      value: Math.min(1, (nt.dopamine ?? 0.45) * 100) / 100,
      category: "excitatory"
    },
    {
      abbr: "SER",
      name: "Serotonin",
      value: Math.min(1, (nt.serotonin ?? 0.38) * 100) / 100,
      category: "inhibitory"
    },
    {
      abbr: "NOR",
      name: "Norepinephrine",
      value: Math.min(1, (nt.norepinephrine ?? 0.42) * 100) / 100,
      category: "excitatory"
    },
    {
      abbr: "GABA",
      name: "GABA",
      value: Math.min(1, (nt.gaba ?? 0.55) * 100) / 100,
      category: "inhibitory"
    },
    {
      abbr: "GLU",
      name: "Glutamate",
      value: Math.min(1, (nt.glutamate ?? 0.6) * 100) / 100,
      category: "excitatory"
    },
    {
      abbr: "ACH",
      name: "Acetylcholine",
      value: Math.min(1, (nt.acetylcholine ?? 0.35) * 100) / 100,
      category: "inhibitory"
    },
    {
      abbr: "COR",
      name: "Cortisol",
      value: Math.min(1, (neural.cortisolLevel ?? 0.3) * 100) / 100,
      category: "stress"
    },
    {
      abbr: "NPY",
      name: "NPY Proxy",
      value: Math.min(1, (neural.hungerDrive ?? 0.48) * 100) / 100,
      category: "hunger"
    }
  ];
  const dominant = chemicals.reduce((a, b) => a.value > b.value ? a : b);
  const tick = neural.tick ?? 0;
  reactExports.useEffect(() => {
    const id = setInterval(() => {
      counterRef.current += 1;
      const cnt = counterRef.current;
      setTrialCounter(cnt);
      const abbr = chemicals.reduce((a, b) => a.value > b.value ? a : b).abbr;
      const desc = EXPERIMENT_TEMPLATES[abbr] ?? "Neuromodulator receptor binding kinetics analysis";
      const entry = `TRIAL-${abbr}-${String(cnt).padStart(3, "0")}: ${desc}`;
      setTrials((prev) => [entry, ...prev].slice(0, 10));
    }, 8e3);
    return () => clearInterval(id);
  }, []);
  reactExports.useEffect(() => {
    const id = setInterval(() => {
      const abbr = chemicals.reduce((a, b) => a.value > b.value ? a : b).abbr;
      setHypotheses(buildHypotheses(abbr));
    }, 15e3);
    return () => clearInterval(id);
  }, []);
  reactExports.useEffect(() => {
    const id = setInterval(() => {
      const chem = chemicals.reduce((a, b) => a.value > b.value ? a : b);
      const sig = getSignificance(chem.value);
      const tag = researchTag(chem.abbr);
      setFindings(
        (prev) => [
          { tick: neural.tick ?? 0, chem: chem.name, sig, tag },
          ...prev
        ].slice(0, 8)
      );
    }, 2e4);
    return () => clearInterval(id);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "h-full overflow-y-auto flex flex-col gap-0",
      style: { background: T_SURFACE },
      "data-ocid": "pharma.agent.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "shrink-0 px-5 py-4 border-b",
            style: {
              borderColor: T_BORDER,
              background: "oklch(0.075 0.016 225)",
              boxShadow: `0 0 24px ${T_PRIMARY}14`
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-8 h-0.5 mb-2",
                      style: { background: T_NEON, boxShadow: `0 0 8px ${T_NEON}` }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[15px] font-bold tracking-[0.25em] uppercase leading-none",
                      style: { color: T_NEON, textShadow: `0 0 12px ${T_NEON}80` },
                      children: "INQUISITOR PHARM"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[8px] tracking-[0.3em] uppercase mt-1",
                      style: { color: T_DIM },
                      children: "SOVEREIGN NEUROPHARMACOLOGY RESEARCHER"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-2 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px] tracking-[0.15em] px-2 py-0.5 border",
                      style: {
                        color: T_PRIMARY,
                        borderColor: T_BORDER,
                        background: "oklch(0.12 0.04 210 / 0.6)"
                      },
                      children: "v1.0.0"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-1.5 h-1.5 rounded-full",
                        style: {
                          background: T_NEON,
                          boxShadow: `0 0 6px ${T_NEON}`,
                          animation: "pulse 2s infinite"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] tracking-[0.2em] uppercase",
                        style: { color: T_DIM },
                        children: "ACTIVE | MONITORING"
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "mt-3 pt-3 border-t font-mono text-[7px] tracking-[0.12em] uppercase",
                  style: { borderColor: T_BORDER_MID, color: T_DIMMER },
                  children: [
                    "PHI=",
                    PHI$1,
                    " · HEARTBEAT=873ms · SUBSTRATE=CONNECTOME · DOMAIN=NEUROPHARMACOLOGY"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "shrink-0 px-4 py-4 border-b",
            style: { borderColor: T_BORDER_MID },
            "data-ocid": "pharma.agent.chem_monitor",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[8px] tracking-[0.25em] uppercase mb-3",
                  style: { color: T_DIM },
                  children: "LIVE CHEMICAL SUBSTRATE MONITOR"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: chemicals.map((c) => {
                const pct = Math.round(c.value * 100);
                const col = barColor(c.category);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "border p-2 flex flex-col gap-1",
                    style: {
                      borderColor: `${col}30`,
                      background: `${col}06`
                    },
                    "data-ocid": `pharma.agent.chem.${c.abbr.toLowerCase()}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-[9px] font-bold tracking-wider",
                            style: { color: col },
                            children: c.abbr
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[8px]", style: { color: col }, children: [
                          pct,
                          "%"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "relative h-[3px] w-full rounded-none overflow-hidden",
                          style: { background: "oklch(0.12 0.02 230)" },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                position: "absolute",
                                left: 0,
                                top: 0,
                                height: "100%",
                                width: `${pct}%`,
                                background: col,
                                boxShadow: pct > 75 ? `0 0 4px ${col}` : void 0,
                                transition: "width 0.4s ease"
                              }
                            }
                          )
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[6px] tracking-[0.1em] truncate",
                          style: { color: T_DIMMER },
                          children: c.name
                        }
                      )
                    ]
                  },
                  c.abbr
                );
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "mt-2 font-mono text-[7px] tracking-[0.12em] uppercase",
                  style: { color: T_DIMMER },
                  children: [
                    "DOMINANT: ",
                    dominant.abbr,
                    " — ",
                    Math.round(dominant.value * 100),
                    "% · TICK",
                    " ",
                    tick
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "shrink-0 px-4 py-4 border-b",
            style: { borderColor: T_BORDER_MID },
            "data-ocid": "pharma.agent.trial_log",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[8px] tracking-[0.25em] uppercase mb-2",
                  style: { color: T_DIM },
                  children: "AUTO-EXPERIMENT GENERATOR"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[7px] mb-3", style: { color: T_DIMMER }, children: [
                "Autonomous trial generation · interval = 8000ms · focus:",
                " ",
                dominant.abbr
              ] }),
              trials.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[7px] text-center py-4 border",
                  style: { borderColor: T_BORDER_MID, color: T_DIMMER },
                  "data-ocid": "pharma.agent.trial_log.empty_state",
                  children: "AWAITING FIRST TRIAL CYCLE..."
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "overflow-y-auto flex flex-col gap-0.5",
                  style: { maxHeight: "200px" },
                  children: trials.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "px-3 py-1.5 border-l-2 font-mono text-[7px] leading-relaxed",
                      style: {
                        borderColor: i === 0 ? T_NEON : T_BORDER,
                        color: i === 0 ? T_PRIMARY : T_DIMMER,
                        background: i === 0 ? "oklch(0.72 0.18 195 / 0.05)" : "transparent"
                      },
                      "data-ocid": `pharma.agent.trial_log.item.${i + 1}`,
                      children: t
                    },
                    t
                  ))
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "shrink-0 px-4 py-4 border-b",
            style: { borderColor: T_BORDER_MID },
            "data-ocid": "pharma.agent.hypotheses",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[8px] tracking-[0.25em] uppercase mb-3",
                  style: { color: T_DIM },
                  children: "COMPOUND HYPOTHESIS PANEL"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[7px] mb-3", style: { color: T_DIMMER }, children: [
                "Updated every 15000ms · dominant chemical: ",
                dominant.abbr
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: hypotheses.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "border-l-2 px-3 py-2",
                  style: {
                    borderColor: i === 0 ? T_NEON : T_BORDER,
                    background: "oklch(0.085 0.015 225)"
                  },
                  "data-ocid": `pharma.agent.hypothesis.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[7px] leading-relaxed",
                      style: { color: i === 0 ? T_PRIMARY : T_DIMMER },
                      children: h
                    }
                  )
                },
                h
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 px-4 py-4", "data-ocid": "pharma.agent.findings_log", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[8px] tracking-[0.25em] uppercase mb-2",
              style: { color: T_DIM },
              children: "RESEARCH FINDINGS LOG"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[7px] mb-3", style: { color: T_DIMMER }, children: "Entries recorded every 20000ms · max 8 entries" }),
          findings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[7px] text-center py-4 border",
              style: { borderColor: T_BORDER_MID, color: T_DIMMER },
              "data-ocid": "pharma.agent.findings_log.empty_state",
              children: "NO FINDINGS RECORDED YET — MONITORING ACTIVE"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: findings.map((f, i) => {
            const sigColor = f.sig === "HIGH" ? T_RED : f.sig === "MEDIUM" ? T_AMBER : T_DIM;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between px-3 py-1.5 border font-mono text-[7px]",
                style: {
                  borderColor: T_BORDER_MID,
                  background: "oklch(0.08 0.014 225)"
                },
                "data-ocid": `pharma.agent.findings_log.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: T_DIMMER }, children: [
                      "T",
                      f.tick
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: T_PRIMARY }, className: "truncate", children: f.chem }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: { color: f.tag ? T_DIMMER : T_DIMMER },
                        className: "truncate",
                        children: f.tag
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "shrink-0 px-2 py-0.5 border font-mono text-[6px] tracking-[0.15em] uppercase",
                      style: {
                        color: sigColor,
                        borderColor: `${sigColor}40`,
                        background: `${sigColor}0a`
                      },
                      children: f.sig
                    }
                  )
                ]
              },
              `${f.tick}-${i}`
            );
          }) })
        ] })
      ]
    }
  );
}
const SUB_TABS = [
  { id: "dashboard", label: "NEURAL DASHBOARD" },
  { id: "inquisitor", label: "INQUISITOR FEED" },
  { id: "correlations", label: "CONNECTOME" },
  { id: "archive", label: "EXPERIMENT ARCHIVE" },
  { id: "compare", label: "COMPOUND COMPARE" },
  { id: "pipeline", label: "RESEARCH PIPELINE" }
];
const H = {
  bg: "oklch(0.04 0.014 265)",
  bgCard: "oklch(0.07 0.018 265)",
  bgDeep: "oklch(0.055 0.016 258)",
  border: "oklch(0.16 0.04 265)",
  accent: "oklch(0.62 0.22 270)",
  accentBright: "oklch(0.74 0.26 270)",
  violet: "oklch(0.70 0.24 295)",
  cyan: "oklch(0.74 0.20 200)",
  green: "oklch(0.72 0.22 140)",
  red: "oklch(0.65 0.25 25)",
  dim: "oklch(0.40 0.06 265)",
  dimmer: "oklch(0.28 0.04 265)",
  text: "oklch(0.82 0.06 265)",
  textDim: "oklch(0.52 0.06 265)"
};
const PHI = 1.618033988749895;
const CHEMS_24 = [
  { abbr: "DPA", name: "Dopamine" },
  { abbr: "SER", name: "Serotonin" },
  { abbr: "NOR", name: "Norepinephrine" },
  { abbr: "ACH", name: "Acetylcholine" },
  { abbr: "GAB", name: "GABA" },
  { abbr: "GLU", name: "Glutamate" },
  { abbr: "COR", name: "Cortisol" },
  { abbr: "OXT", name: "Oxytocin" },
  { abbr: "MEL", name: "Melatonin" },
  { abbr: "BEND", name: "β-Endorphin" },
  { abbr: "ANA", name: "Anandamide" },
  { abbr: "SUBP", name: "Substance P" },
  { abbr: "NPY", name: "NPY" },
  { abbr: "CRH", name: "CRH" },
  { abbr: "VIP", name: "VIP" },
  { abbr: "CCK", name: "CCK" },
  { abbr: "ADO", name: "Adenosine" },
  { abbr: "HIS", name: "Histamine" },
  { abbr: "NO", name: "Nitric Oxide" },
  { abbr: "BDNF", name: "BDNF" },
  { abbr: "IGF1", name: "IGF-1" },
  { abbr: "PRL", name: "Prolactin" },
  { abbr: "AVP", name: "Vasopressin" },
  { abbr: "DYN", name: "Dynorphin" }
];
const REGIONS_16 = [
  "PFC",
  "HIPP",
  "AMYG",
  "ACC",
  "THAL",
  "CBLM",
  "INSL",
  "BSGL",
  "TMPRL",
  "OCCIP",
  "BROCA",
  "DMN",
  "SALNW",
  "ENTRC",
  "RETFM",
  "CCAL"
];
const REGION_FULL = {
  PFC: "Prefrontal Cortex",
  HIPP: "Hippocampus",
  AMYG: "Amygdala",
  ACC: "Ant. Cingulate",
  THAL: "Thalamus",
  CBLM: "Cerebellum",
  INSL: "Insula",
  BSGL: "Basal Ganglia",
  TMPRL: "Temporal Cortex",
  OCCIP: "Occipital Cortex",
  BROCA: "Broca's Area",
  DMN: "Default Mode Net",
  SALNW: "Salience Network",
  ENTRC: "Enteric Brain",
  RETFM: "Reticular Formation",
  CCAL: "Corpus Callosum"
};
function seededValue(seed, index) {
  const x = Math.sin(seed * PHI + index * 2.399) * 1e4;
  return x - Math.floor(x);
}
function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return Math.abs(h);
}
const SEED_HYPS = [
  {
    ts: "T4882",
    text: "D2 partial agonism at NAc autoreceptor reduces dopaminergic overdrive by 23% — fronto-striatal stability index elevated",
    confidence: 91,
    tags: ["DPA", "NAc", "D2"]
  },
  {
    ts: "T4874",
    text: "5-HT1A desensitization at raphe-cortical loop accelerates 5-HT steady-state onset — oscillatory coherence +0.18",
    confidence: 88,
    tags: ["SER", "5-HT1A", "raphe"]
  },
  {
    ts: "T4861",
    text: "GABA-A alpha-5 NAM at hippocampal interneurons produces selective LTP disinhibition in CA1 — plasticity STDP +0.38",
    confidence: 85,
    tags: ["GAB", "HIPP", "LTP"]
  },
  {
    ts: "T4849",
    text: "CRH-R1 antagonism at PVN attenuates HPA axis surge — cortisol proxy reduced 31% over 8 heartbeat cycles",
    confidence: 82,
    tags: ["CRH", "COR", "HPA"]
  },
  {
    ts: "T4837",
    text: "Oxytocin OXTR PAM potentiates NAc dopamine release — social trust circuit coherence elevated to 0.74",
    confidence: 79,
    tags: ["OXT", "DPA", "NAc"]
  },
  {
    ts: "T4820",
    text: "NPY Y1 antagonism at hypothalamic feeding circuit recalibrates metabolic drive — hunger proxy -18%",
    confidence: 76,
    tags: ["NPY", "HYP", "hunger"]
  },
  {
    ts: "T4808",
    text: "Adenosine A2A inverse agonist at striatal synapses partially reverses saturation-induced LTD — BSGL activity +0.22",
    confidence: 73,
    tags: ["ADO", "BSGL", "A2A"]
  },
  {
    ts: "T4795",
    text: "BDNF-TrkB signaling at CA3→CA1 synapse promotes STDP potentiation — memory consolidation window extended 2.4×",
    confidence: 70,
    tags: ["BDNF", "HIPP", "TrkB"]
  },
  {
    ts: "T4780",
    text: "Histamine H1 antagonism suppresses thalamic arousal relay — MEL proxy elevated 15%, sleep pressure rising",
    confidence: 67,
    tags: ["HIS", "THAL", "MEL"]
  },
  {
    ts: "T4762",
    text: "Dynorphin κ-OR activation suppresses NAc dopamine — motivational salience decreased, DPA proxy -0.41",
    confidence: 64,
    tags: ["DYN", "DPA", "KOR"]
  }
];
const COMPARE_COMPOUNDS = [
  "Triaxion-47",
  "Nexopril-8",
  "Cortimaze",
  "Dopavance",
  "Serotomax",
  "GABAlex",
  "Glutatrace",
  "Noradrenex"
];
function compoundChemValue(compoundName, chemIndex) {
  return Math.sin(hashCode(compoundName) * chemIndex * 0.1) * 50 + 50;
}
const PIPELINE_ITEMS = [
  {
    title: "D2 autoreceptor threshold mapping",
    status: "RUNNING",
    priority: "HIGH",
    focus: "DPA"
  },
  {
    title: "5-HT2A SAM cortical stability protocol",
    status: "QUEUED",
    priority: "HIGH",
    focus: "SER"
  },
  {
    title: "GABA-A alpha-5 LTP disinhibition assay",
    status: "QUEUED",
    priority: "MED",
    focus: "GAB"
  },
  {
    title: "CRH-R1 antagonist HPA axis clamp",
    status: "COMPLETE",
    priority: "HIGH",
    focus: "CRH"
  },
  {
    title: "OXTR PAM social circuit potentiation",
    status: "QUEUED",
    priority: "MED",
    focus: "OXT"
  },
  {
    title: "NPY Y1 hypothalamic recalibration",
    status: "QUEUED",
    priority: "LOW",
    focus: "NPY"
  },
  {
    title: "Adenosine A2A striatal anti-LTD sweep",
    status: "QUEUED",
    priority: "MED",
    focus: "ADO"
  },
  {
    title: "TrkB-BDNF plasticity potentiation run",
    status: "QUEUED",
    priority: "LOW",
    focus: "BDNF"
  }
];
const PUB_LOG = [
  {
    compound: "Triaxion-47",
    expType: "Controlled Session",
    date: "2026-06-08",
    doi: "10.5281/zenodo.11234567"
  },
  {
    compound: "SSRI Study",
    expType: "Dose-Response Curve",
    date: "2026-06-05",
    doi: "10.5281/zenodo.11198432"
  },
  {
    compound: "Cortimaze",
    expType: "Combination Protocol",
    date: "2026-06-02",
    doi: ""
  },
  {
    compound: "GABAlex",
    expType: "Receptor Mapping",
    date: "2026-05-29",
    doi: "10.5281/zenodo.11154321"
  }
];
function HubBadge({
  color,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "font-mono text-[7px] tracking-[0.12em] uppercase px-2 py-0.5 shrink-0",
      style: {
        color,
        border: `1px solid ${color}55`,
        background: `${color}12`
      },
      children
    }
  );
}
function SectionHeader({ label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "font-mono text-[8px] tracking-[0.22em] uppercase mb-3",
      style: { color: H.dim },
      children: [
        "▸ ",
        label
      ]
    }
  );
}
function EmptyState({
  icon,
  title,
  sub
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl opacity-30", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "font-mono text-[11px] tracking-[0.15em] uppercase",
        style: { color: H.accent },
        children: title
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "font-mono text-[9px] max-w-xs text-center",
        style: { color: H.dim },
        children: sub
      }
    )
  ] });
}
function NeuralDashboard({ neural }) {
  const pulse = useLiveOrganismPulse();
  const { actor, isFetching } = useActor(createActor);
  const [tick, setTick] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 873);
    return () => clearInterval(id);
  }, []);
  const nt = reactExports.useMemo(
    () => (neural == null ? void 0 : neural.neurotransmitters) ?? {},
    [neural]
  );
  const { data: ncData } = useQuery({
    queryKey: ["neuroChem24_hub"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getExtendedNeuroChem21();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 873
  });
  const chemValues = reactExports.useMemo(() => {
    const nc = ncData;
    return {
      DPA: nt.dopamine ?? 0.45,
      SER: nt.serotonin ?? 0.38,
      NOR: nt.norepinephrine ?? 0.42,
      ACH: nt.acetylcholine ?? 0.35,
      GAB: nt.gaba ?? 0.55,
      GLU: nt.glutamate ?? 0.6,
      COR: (neural == null ? void 0 : neural.cortisolLevel) ?? 0.3,
      OXT: (nc == null ? void 0 : nc.oxytocin) ?? seededValue(7, tick % 12) * 0.6 + 0.2,
      MEL: (nc == null ? void 0 : nc.melatonin) ?? seededValue(9, tick % 12) * 0.5 + 0.15,
      BEND: (nc == null ? void 0 : nc.betaEndorphin) ?? seededValue(11, tick % 12) * 0.5 + 0.25,
      ANA: (nc == null ? void 0 : nc.anandamide) ?? seededValue(13, tick % 12) * 0.55 + 0.2,
      SUBP: (nc == null ? void 0 : nc.substanceP) ?? seededValue(17, tick % 12) * 0.4 + 0.2,
      NPY: (neural == null ? void 0 : neural.hungerDrive) ?? seededValue(19, tick % 12) * 0.5 + 0.3,
      CRH: (nc == null ? void 0 : nc.crh) ?? seededValue(23, tick % 12) * 0.45 + 0.2,
      VIP: (nc == null ? void 0 : nc.vip) ?? seededValue(29, tick % 12) * 0.4 + 0.18,
      CCK: (nc == null ? void 0 : nc.cck) ?? seededValue(31, tick % 12) * 0.4 + 0.2,
      ADO: (nc == null ? void 0 : nc.adenosine) ?? seededValue(37, tick % 12) * 0.55 + 0.2,
      HIS: (nc == null ? void 0 : nc.histamine) ?? seededValue(41, tick % 12) * 0.45 + 0.15,
      NO: (nc == null ? void 0 : nc.nitricOxide) ?? seededValue(43, tick % 12) * 0.5 + 0.2,
      BDNF: (nc == null ? void 0 : nc.bdnf) ?? seededValue(47, tick % 12) * 0.5 + 0.3,
      IGF1: (nc == null ? void 0 : nc.igf1) ?? seededValue(53, tick % 12) * 0.4 + 0.25,
      PRL: (nc == null ? void 0 : nc.prolactin) ?? seededValue(59, tick % 12) * 0.4 + 0.2,
      AVP: (nc == null ? void 0 : nc.vasopressin) ?? seededValue(61, tick % 12) * 0.45 + 0.2,
      DYN: (nc == null ? void 0 : nc.dynorphin) ?? seededValue(67, tick % 12) * 0.45 + 0.2
    };
  }, [nt, ncData, neural, tick]);
  const chemWithMeta = CHEMS_24.map((c, i) => {
    const raw = chemValues[c.abbr] ?? 0.3;
    const pct = Math.min(100, Math.round(raw * 100));
    const isAnomaly = pct >= 85;
    const isElevated = pct >= 65 && pct < 85;
    const barColor2 = isAnomaly ? H.red : isElevated ? "oklch(0.78 0.22 65)" : H.green;
    const prev = seededValue(hashCode(c.abbr), (tick - 1 + 60) % 60) * 0.6 + 0.2;
    const trend = raw > prev + 0.02 ? "↑" : raw < prev - 0.02 ? "↓" : "→";
    const trendColor = trend === "↑" ? "oklch(0.78 0.22 65)" : trend === "↓" ? "oklch(0.72 0.22 200)" : H.dimmer;
    return { ...c, pct, isAnomaly, barColor: barColor2, trend, trendColor, _i: i };
  });
  const anomalyCount = chemWithMeta.filter((c) => c.isAnomaly).length;
  const now = (/* @__PURE__ */ new Date()).toLocaleTimeString();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full overflow-auto", "data-ocid": "hub.dashboard.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "sticky top-0 z-10 flex items-center justify-between px-4 py-2 border-b",
        style: { background: "oklch(0.055 0.02 265)", borderColor: H.border },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px] tracking-[0.2em] uppercase",
                style: { color: H.dim },
                children: "CHEMICALS MONITORED"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[13px] font-bold",
                style: { color: H.accentBright },
                children: "24"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-4", style: { background: H.border } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px] tracking-[0.2em] uppercase",
                style: { color: H.dim },
                children: "ANOMALIES"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[13px] font-bold",
                style: { color: anomalyCount > 0 ? H.red : H.green },
                children: anomalyCount
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-1.5 h-1.5 rounded-full",
                  style: {
                    background: H.cyan,
                    boxShadow: `0 0 6px ${H.cyan}`,
                    animation: "pulse 873ms infinite"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px] tracking-[0.15em] uppercase",
                  style: { color: H.cyan },
                  children: "LIVE"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: H.dimmer }, children: [
              "SYNC ",
              now
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: H.dimmer }, children: [
              "COH ",
              (pulse.coherence * 100).toFixed(0),
              "%"
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-4 gap-2",
        "data-ocid": "hub.dashboard.chem_grid",
        children: chemWithMeta.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `hub.dashboard.chem.${c.abbr.toLowerCase()}`,
            className: "border p-2.5 flex flex-col gap-1.5 relative",
            style: {
              borderColor: c.isAnomaly ? `${H.red}50` : H.border,
              background: c.isAnomaly ? `${H.red}06` : H.bgCard,
              boxShadow: c.isAnomaly ? `0 0 12px ${H.red}18` : void 0
            },
            children: [
              c.isAnomaly && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute top-1.5 right-1.5 font-mono text-[6px] tracking-[0.15em] uppercase px-1.5 py-0.5",
                  style: {
                    color: H.red,
                    border: `1px solid ${H.red}60`,
                    background: `${H.red}15`,
                    animation: "pulse 1.2s infinite"
                  },
                  children: "ANOMALY"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[10px] font-bold tracking-wider",
                      style: { color: c.barColor },
                      children: c.abbr
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[6.5px] truncate",
                      style: { color: H.dimmer },
                      children: c.name
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[10px] font-bold",
                    style: { color: c.trendColor },
                    children: c.trend
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "relative w-full rounded-none overflow-hidden",
                  style: { height: "4px", background: "oklch(0.10 0.02 265)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        position: "absolute",
                        left: 0,
                        top: 0,
                        height: "100%",
                        width: `${c.pct}%`,
                        background: c.isAnomaly ? `linear-gradient(to right, ${H.red}80, ${H.red})` : `linear-gradient(to right, ${c.barColor}60, ${c.barColor})`,
                        boxShadow: c.pct > 75 ? `0 0 6px ${c.barColor}60` : void 0,
                        transition: "width 0.4s ease"
                      }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "font-mono text-[9px] font-bold",
                    style: { color: c.barColor },
                    children: [
                      c.pct,
                      "%"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "font-mono text-[7px]",
                    style: { color: H.dimmer },
                    children: [
                      "#",
                      c._i + 1
                    ]
                  }
                )
              ] })
            ]
          },
          c.abbr
        ))
      }
    ) })
  ] });
}
function InquisitorFeed({ neural }) {
  const scrollRef = reactExports.useRef(null);
  const [streamLog, setStreamLog] = reactExports.useState(SEED_HYPS);
  const [ticker, setTicker] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const id = setInterval(() => setTicker((t) => t + 1), 2e4);
    return () => clearInterval(id);
  }, []);
  reactExports.useEffect(() => {
    if (ticker === 0) return;
    const entry = {
      ts: `T${4882 + ticker * 7}`,
      text: SEED_HYPS[ticker % SEED_HYPS.length].text,
      confidence: Math.round(60 + seededValue(ticker, ticker * 3) * 35),
      tags: SEED_HYPS[ticker % SEED_HYPS.length].tags
    };
    setStreamLog((prev) => [entry, ...prev].slice(0, 20));
  }, [ticker]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "h-full flex flex-col overflow-hidden",
      "data-ocid": "hub.inquisitor.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 p-4 pb-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[8px] tracking-[0.22em] uppercase",
                style: { color: H.dim },
                children: "▸ INQUISITOR LIVE STREAM — newest first"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-1.5 h-1.5 rounded-full",
                  style: {
                    background: H.cyan,
                    boxShadow: `0 0 4px ${H.cyan}`,
                    animation: "pulse 2s infinite"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: H.cyan }, children: "STREAMING" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              ref: scrollRef,
              className: "border overflow-y-auto",
              style: {
                borderColor: H.border,
                background: "oklch(0.035 0.012 270)",
                maxHeight: "220px"
              },
              "data-ocid": "hub.inquisitor.stream",
              children: streamLog.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": `hub.inquisitor.stream.item.${i + 1}`,
                  className: "flex items-start gap-3 px-3 py-1.5 border-b",
                  style: {
                    borderColor: H.dimmer,
                    opacity: Math.max(0.25, 1 - i * 0.07)
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] shrink-0 pt-0.5",
                        style: { color: H.cyan },
                        children: entry.ts
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7.5px] leading-relaxed flex-1 min-w-0",
                        style: { color: i === 0 ? H.text : H.textDim },
                        children: entry.text
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[7px] shrink-0",
                        style: { color: H.accentBright },
                        children: [
                          entry.confidence,
                          "%"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 shrink-0", children: entry.tags.slice(0, 2).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[6px] px-1 py-0.5",
                        style: {
                          color: H.violet,
                          border: `1px solid ${H.violet}40`,
                          background: `${H.violet}0a`
                        },
                        children: tag
                      },
                      tag
                    )) })
                  ]
                },
                `${entry.ts}-${i}`
              ))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden min-h-0 mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          PharmaAgentPanel,
          {
            neural
          }
        ) })
      ]
    }
  );
}
function ConnectomeCorrelation() {
  const { actor, isFetching } = useActor(createActor);
  const [tick, setTick] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 873);
    return () => clearInterval(id);
  }, []);
  const { data: history = [] } = useQuery({
    queryKey: ["pharmaExperimentHistory"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getPharmaExperimentHistory();
        return Array.isArray(result) ? result : [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5e3
  });
  const regionActivations = reactExports.useMemo(() => {
    const acc = {};
    for (const h of history) {
      const regions = h.affectedRegions ?? h.regions ?? [];
      const delta = typeof h.activationDelta === "number" ? h.activationDelta : 0.3;
      for (const r of regions) {
        const key = r.toUpperCase().slice(0, 6);
        acc[key] = (acc[key] ?? 0) + delta;
      }
    }
    return acc;
  }, [history]);
  const getActivation = (abbr, idx) => {
    const fromHistory = regionActivations[abbr];
    if (fromHistory !== void 0) return Math.min(1, fromHistory);
    return 0.3 + Math.abs(Math.sin(tick * PHI * 0.07 + idx * 0.618)) * 0.6;
  };
  const heatColor = (v) => {
    if (v >= 0.85) return "oklch(0.65 0.25 25)";
    if (v >= 0.65) return "oklch(0.72 0.22 45)";
    if (v >= 0.45) return "oklch(0.72 0.22 65)";
    if (v >= 0.25) return "oklch(0.64 0.18 255)";
    return "oklch(0.42 0.14 260)";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full overflow-auto p-4", "data-ocid": "hub.correlations.page", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { label: "CONNECTOME CORRELATION MAP — LAST 24H" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: [
        [0.1, "COOL"],
        [0.4, "MOD"],
        [0.65, "HOT"],
        [0.9, "CRIT"]
      ].map(([v, l]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3", style: { background: heatColor(v) } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: H.dim }, children: l })
      ] }, l)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-4 gap-2",
        "data-ocid": "hub.correlations.heatmap",
        children: REGIONS_16.map((abbr, idx) => {
          const activation = getActivation(abbr, idx);
          const pct = Math.round(activation * 100);
          const color = heatColor(activation);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `hub.correlations.region.${idx + 1}`,
              className: "border p-2.5 flex flex-col gap-1",
              style: { borderColor: `${color}40`, background: `${color}10` },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[9px] font-bold",
                      style: { color },
                      children: abbr
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[8px]", style: { color }, children: [
                    pct,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      height: "3px",
                      background: "oklch(0.10 0.02 265)",
                      width: "100%"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          height: "100%",
                          width: `${pct}%`,
                          background: `linear-gradient(to right, ${color}70, ${color})`,
                          boxShadow: activation > 0.7 ? `0 0 4px ${color}80` : void 0,
                          transition: "width 0.4s ease"
                        }
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[6.5px] truncate",
                    style: { color: H.dimmer },
                    children: REGION_FULL[abbr] ?? abbr
                  }
                )
              ]
            },
            abbr
          );
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mt-4 p-3 border font-mono text-[7.5px] leading-relaxed",
        style: {
          borderColor: H.border,
          background: H.bgCard,
          color: H.textDim
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: H.accent }, children: "CORRELATION ENGINE" }),
          " — Activation deltas derived from",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: H.cyan }, children: [
            history.length,
            " experiment records"
          ] }),
          " ",
          "+ live PHI-pulsed standing wave (PHI⁴ × Schumann) where history is sparse. Coherence:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: H.accentBright }, children: (0.6 + Math.sin(tick * 0.1) * 0.2).toFixed(3) }),
          " ",
          "· Tick: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: H.accentBright }, children: tick })
        ]
      }
    )
  ] }) });
}
function ExperimentArchive() {
  const { actor, isFetching } = useActor(createActor);
  const [modal, setModal] = reactExports.useState(null);
  const { data: history = [] } = useQuery({
    queryKey: ["pharmaExperimentHistory"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getPharmaExperimentHistory();
        return Array.isArray(result) ? result : [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5e3
  });
  const TYPE_COLORS = {
    controlled: H.green,
    dose_response: "oklch(0.68 0.24 220)",
    combination: "oklch(0.72 0.24 55)",
    longitudinal: H.violet,
    receptor: H.cyan
  };
  const typeColor = (t) => TYPE_COLORS[t == null ? void 0 : t.toLowerCase().replace("-", "_")] ?? H.dim;
  const verdictColor = (v) => {
    const vl = (v == null ? void 0 : v.toLowerCase()) ?? "";
    if (vl.includes("valid") || vl.includes("success")) return H.green;
    if (vl.includes("anomal")) return H.red;
    return "oklch(0.72 0.22 65)";
  };
  const fmtTime = (ts) => {
    if (typeof ts === "number" || typeof ts === "bigint") {
      const ms = Number(ts);
      return new Date(ms > 1e12 ? ms : ms * 1e3).toLocaleString();
    }
    return typeof ts === "string" ? ts : "—";
  };
  const rows = history;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full overflow-auto p-4", "data-ocid": "hub.archive.page", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { label: "Experiment Archive — Aggregated from Pharma Lab" }),
    rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: "⚗",
        title: "No experiments yet",
        sub: "No experiments run yet — visit Pharma Lab in Ops to begin"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", "data-ocid": "hub.archive.list", children: rows.map((row, i) => {
      const id = String(row.id ?? row.exp_id ?? `EXP-${i + 1}`);
      const type = String(
        row.expType ?? row.experiment_type ?? "controlled"
      );
      const compound = String(row.compound ?? row.compoundName ?? "—");
      const verdict = String(row.outcome ?? row.verdict ?? "PENDING");
      const ts = fmtTime(row.timestamp ?? row.createdAt ?? null);
      const color = typeColor(type);
      const vc = verdictColor(verdict);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `hub.archive.item.${i + 1}`,
          className: "border p-3 flex items-center gap-3",
          style: { borderColor: H.border, background: H.bgCard },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[8px] w-24 shrink-0",
                style: { color: H.accentBright },
                children: id
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(HubBadge, { color, children: type.replace("_", "-").toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex-1 font-mono text-[9px] min-w-0 truncate",
                style: { color: H.text },
                children: compound
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(HubBadge, { color: vc, children: verdict.toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[7px] shrink-0",
                style: { color: H.dim },
                children: ts
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `hub.archive.view_report.${i + 1}`,
                onClick: () => setModal(row),
                className: "font-mono text-[7px] tracking-[0.12em] uppercase px-3 py-1 border shrink-0 transition-all hover:opacity-80",
                style: {
                  color: H.accent,
                  borderColor: `${H.accent}50`,
                  background: `${H.accent}0a`
                },
                children: "VIEW REPORT"
              }
            )
          ]
        },
        id
      );
    }) }),
    modal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4",
        style: { background: "oklch(0 0 0 / 0.7)" },
        "data-ocid": "hub.archive.dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border max-w-lg w-full p-5 flex flex-col gap-3",
            style: {
              borderColor: H.accent,
              background: "oklch(0.07 0.02 265)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[10px] tracking-[0.2em] uppercase",
                    style: { color: H.accentBright },
                    children: "EXPERIMENT REPORT"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "hub.archive.close_button",
                    onClick: () => setModal(null),
                    className: "font-mono text-[9px] px-2 py-1 border transition-all hover:opacity-80",
                    style: { color: H.dim, borderColor: `${H.dim}40` },
                    children: "✕ CLOSE"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "border-t pt-3 flex flex-col gap-2",
                  style: { borderColor: H.border },
                  children: Object.entries(modal).slice(0, 12).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "font-mono text-[7px] tracking-[0.12em] uppercase w-28 shrink-0",
                        style: { color: H.dim },
                        children: k.toUpperCase()
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "font-mono text-[8px] leading-relaxed",
                        style: { color: H.text },
                        children: String(v)
                      }
                    )
                  ] }, k))
                }
              )
            ]
          }
        )
      }
    )
  ] }) });
}
function CompoundCompare() {
  const [compA, setCompA] = reactExports.useState(COMPARE_COMPOUNDS[0]);
  const [compB, setCompB] = reactExports.useState(COMPARE_COMPOUNDS[1]);
  const valuesA = reactExports.useMemo(
    () => CHEMS_24.map((_, i) => compoundChemValue(compA, i)),
    [compA]
  );
  const valuesB = reactExports.useMemo(
    () => CHEMS_24.map((_, i) => compoundChemValue(compB, i)),
    [compB]
  );
  const SELECT_STYLE = {
    background: H.bgCard,
    border: `1px solid ${H.border}`,
    color: H.text,
    fontFamily: "monospace",
    fontSize: "10px",
    padding: "4px 8px",
    outline: "none"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full overflow-auto p-4", "data-ocid": "hub.compare.page", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { label: "Compound Neurochemical Comparison" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "font-mono text-[7px] tracking-[0.15em] uppercase",
            style: { color: H.dim },
            children: "COMPOUND A"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            "data-ocid": "hub.compare.select_a",
            style: SELECT_STYLE,
            value: compA,
            onChange: (e) => setCompA(e.target.value),
            children: COMPARE_COMPOUNDS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: c }, c))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[11px] mt-4", style: { color: H.dim }, children: "VS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "font-mono text-[7px] tracking-[0.15em] uppercase",
            style: { color: H.dim },
            children: "COMPOUND B"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            "data-ocid": "hub.compare.select_b",
            style: SELECT_STYLE,
            value: compB,
            onChange: (e) => setCompB(e.target.value),
            children: COMPARE_COMPOUNDS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: c }, c))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4 mb-6", children: [
      { label: compA, values: valuesA, color: H.accentBright },
      { label: compB, values: valuesB, color: H.cyan }
    ].map(({ label, values, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "border p-3",
        style: { borderColor: H.border, background: H.bgCard },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[9px] font-bold mb-3",
              style: { color },
              children: label
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: CHEMS_24.map((c, i) => {
            const val = values[i] ?? 50;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[7px] w-8 shrink-0",
                  style: { color: H.dim },
                  children: c.abbr
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    flex: 1,
                    height: "6px",
                    background: "oklch(0.10 0.02 265)",
                    position: "relative"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        position: "absolute",
                        left: 0,
                        top: 0,
                        height: "100%",
                        width: `${val}%`,
                        background: `linear-gradient(to right, ${color}50, ${color})`
                      }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[7px] w-8 text-right shrink-0",
                  style: { color },
                  children: val.toFixed(0)
                }
              )
            ] }, c.abbr);
          }) })
        ]
      },
      label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { label: `Delta Table — ${compA} vs ${compB}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "border overflow-hidden",
        style: { borderColor: H.border },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid px-3 py-1.5 border-b",
              style: {
                borderColor: H.border,
                background: H.bgDeep,
                gridTemplateColumns: "60px 1fr 80px 80px 90px"
              },
              children: [
                "CHEM",
                "NAME",
                compA.slice(0, 7),
                compB.slice(0, 7),
                "DELTA"
              ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[7px] tracking-[0.12em] uppercase",
                  style: { color: H.dim },
                  children: h
                },
                h
              ))
            }
          ),
          CHEMS_24.map((c, i) => {
            const a = valuesA[i] ?? 50;
            const b = valuesB[i] ?? 50;
            const delta = a - b;
            const winner = delta > 0 ? "A" : delta < 0 ? "B" : "";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `hub.compare.delta.${c.abbr.toLowerCase()}`,
                className: "grid px-3 py-1 border-b",
                style: {
                  borderColor: H.border,
                  gridTemplateColumns: "60px 1fr 80px 80px 90px",
                  background: Math.abs(delta) > 20 ? `${delta > 0 ? H.accentBright : H.cyan}06` : void 0
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[8px] font-bold",
                      style: { color: H.accentBright },
                      children: c.abbr
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[7.5px]",
                      style: { color: H.textDim },
                      children: c.name
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[8px]",
                      style: { color: H.accentBright },
                      children: a.toFixed(0)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[8px]", style: { color: H.cyan }, children: b.toFixed(0) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "font-mono text-[8px] font-bold",
                      style: {
                        color: winner === "A" ? H.green : winner === "B" ? "oklch(0.68 0.24 220)" : H.dim
                      },
                      children: [
                        delta > 0 ? "+" : "",
                        delta.toFixed(1),
                        " ",
                        winner ? `[${winner}]` : ""
                      ]
                    }
                  )
                ]
              },
              c.abbr
            );
          })
        ]
      }
    )
  ] }) });
}
function ResearchPipeline({ neural }) {
  const pulse = useLiveOrganismPulse();
  const [toast, setToast] = reactExports.useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4e3);
  };
  const statusColor = (s) => s === "RUNNING" ? H.cyan : s === "COMPLETE" ? H.green : H.dim;
  const priorityColor = (p) => p === "HIGH" ? H.red : p === "MED" ? "oklch(0.72 0.22 65)" : H.dim;
  const generateReport = () => {
    const doc = new E({ unit: "mm", format: "a4" });
    const now = /* @__PURE__ */ new Date();
    const nt = (neural == null ? void 0 : neural.neurotransmitters) ?? {};
    const coherence = pulse.coherence;
    const beat = pulse.beat;
    const w = 210;
    const margin = 18;
    let y = margin;
    const line = (txt, size = 10, bold = false, color = [200, 200, 220]) => {
      doc.setFontSize(size);
      doc.setFont("courier", bold ? "bold" : "normal");
      doc.setTextColor(...color);
      doc.text(txt, margin, y);
      y += size * 0.45 + 1;
    };
    const rule = () => {
      doc.setDrawColor(80, 80, 120);
      doc.line(margin, y, w - margin, y);
      y += 4;
    };
    const space = (n = 4) => {
      y += n;
    };
    doc.setFillColor(8, 8, 24);
    doc.rect(0, 0, w, 297, "F");
    doc.setFillColor(20, 20, 50);
    doc.rect(0, 0, w, 38, "F");
    doc.setFontSize(16);
    doc.setFont("courier", "bold");
    doc.setTextColor(120, 100, 255);
    doc.text("INQUISITOR PHARM", margin, 16);
    doc.setFontSize(9);
    doc.setFont("courier", "normal");
    doc.setTextColor(160, 160, 200);
    doc.text("AUTONOMOUS NEUROSCIENCE REPORT", margin, 23);
    doc.text(
      `DATE: ${now.toISOString().slice(0, 10)}  |  ORGANISM: NEUROEMERGENCE-CORE`,
      margin,
      29
    );
    doc.text(
      `TICK: ${beat}  |  COHERENCE: ${(coherence * 100).toFixed(1)}%  |  MODE: ${pulse.modeName}`,
      margin,
      35
    );
    y = 46;
    rule();
    line("SECTION 1 — NEURAL STATE ANALYSIS", 11, true, [120, 100, 255]);
    space(2);
    line(
      `Dopamine proxy:         ${((nt.dopamine ?? 0.45) * 100).toFixed(1)}%`,
      9
    );
    line(
      `Serotonin proxy:        ${((nt.serotonin ?? 0.38) * 100).toFixed(1)}%`,
      9
    );
    line(
      `Norepinephrine proxy:   ${((nt.norepinephrine ?? 0.42) * 100).toFixed(1)}%`,
      9
    );
    line(`GABA proxy:             ${((nt.gaba ?? 0.55) * 100).toFixed(1)}%`, 9);
    line(
      `Glutamate proxy:        ${((nt.glutamate ?? 0.6) * 100).toFixed(1)}%`,
      9
    );
    line(
      `Acetylcholine proxy:    ${((nt.acetylcholine ?? 0.35) * 100).toFixed(1)}%`,
      9
    );
    line(
      `Cortisol proxy:         ${(((neural == null ? void 0 : neural.cortisolLevel) ?? 0.3) * 100).toFixed(1)}%`,
      9
    );
    line(
      `Hunger drive (NPY):     ${(((neural == null ? void 0 : neural.hungerDrive) ?? 0.48) * 100).toFixed(1)}%`,
      9
    );
    space(3);
    rule();
    line("SECTION 2 — NEUROCHEMICAL TRENDS", 11, true, [120, 100, 255]);
    space(2);
    line(
      "ELEVATED (>65% proxy): DPA, GAB, GLU when organism is active",
      9,
      false,
      [200, 200, 100]
    );
    line(
      "DEPLETED (<35% proxy): ACH, OXT, MEL when stress load is high",
      9,
      false,
      [100, 180, 220]
    );
    line(
      `Dominant driver: ${(nt.dopamine ?? 0) > (nt.serotonin ?? 0) ? "Dopaminergic" : "Serotonergic"} pathway`,
      9
    );
    line(
      `HPA axis: ${((neural == null ? void 0 : neural.cortisolLevel) ?? 0.3) > 0.6 ? "ELEVATED — stress response active" : "NOMINAL"}`,
      9
    );
    space(3);
    rule();
    line("SECTION 3 — CONNECTOME COHERENCE", 11, true, [120, 100, 255]);
    space(2);
    line(`Global coherence score:  ${(coherence * 100).toFixed(2)}%`, 9);
    line(
      `OMNIS gate status:       ${coherence > 0.87 ? "ACTIVE — emergence state" : "BELOW THRESHOLD"}`,
      9
    );
    line(`Behavioral mode:         ${pulse.modeName}`, 9);
    line(
      `Sovereign: ${pulse.sovereign ? "YES" : "NO"}  |  Emergency: ${pulse.emergency ? "YES" : "NO"}`,
      9
    );
    line(`Current tick:            ${beat}`, 9);
    space(3);
    rule();
    line("SECTION 4 — BEHAVIORAL PREDICTIONS", 11, true, [120, 100, 255]);
    space(2);
    line(
      "• High dopaminergic drive suggests increased NAc salience and goal-directed",
      9,
      false,
      [180, 180, 210]
    );
    line(
      "  behavior over next 12 heartbeat cycles. Expect LTP strengthening in PFC.",
      9,
      false,
      [180, 180, 210]
    );
    space(1);
    line(
      "• Elevated GABA proxy indicates saturation dampening is active — cortical",
      9,
      false,
      [180, 180, 210]
    );
    line(
      "  noise reduction improving signal-to-noise ratio by estimated 18-24%.",
      9,
      false,
      [180, 180, 210]
    );
    space(1);
    line(
      "• NPY hunger drive above baseline predicts ESURIENS task generation",
      9,
      false,
      [180, 180, 210]
    );
    line(
      "  acceleration. Expect 2-3 new INQUISITOR hypotheses at next PHI⁴ cycle.",
      9,
      false,
      [180, 180, 210]
    );
    space(3);
    rule();
    line("SECTION 5 — RESEARCH RECOMMENDATIONS", 11, true, [120, 100, 255]);
    space(2);
    line(
      "1. Run Dose-Response protocol on dominant neurochemical to establish EC50",
      9,
      false,
      [180, 180, 210]
    );
    line(
      "   and therapeutic window under current organism state.",
      9,
      false,
      [180, 180, 210]
    );
    space(1);
    line(
      "2. Deploy Receptor Mapping experiment targeting PFC and Hippocampus —",
      9,
      false,
      [180, 180, 210]
    );
    line(
      "   full binding kinetics across D1/D2 and 5-HT1A receptor families.",
      9,
      false,
      [180, 180, 210]
    );
    space(1);
    line(
      "3. Initiate Longitudinal Study for baseline chemical drift tracking over",
      9,
      false,
      [180, 180, 210]
    );
    line(
      "   48 heartbeat sessions. Seal each as sovereign Memory Temple artifact.",
      9,
      false,
      [180, 180, 210]
    );
    space(3);
    rule();
    line(
      "© 2026 NeuroEmergence Core — INQUISITOR PHARM — TOP SECRET PROPRIETARY",
      7,
      false,
      [80, 80, 100]
    );
    const ts = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
    doc.save(`NeuroPharma_Report_${ts}.pdf`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full overflow-auto p-4", "data-ocid": "hub.pipeline.page", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mb-6 p-4 border flex items-center justify-between",
        style: { borderColor: `${H.accent}40`, background: `${H.accent}06` },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[10px] font-bold mb-1",
                style: { color: H.accentBright },
                children: "INQUISITOR PHARM — SCIENTIFIC REPORT"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[8px]", style: { color: H.textDim }, children: "Multi-section report: neural state, trends, coherence, predictions, recommendations" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "hub.pipeline.generate_report_button",
              onClick: generateReport,
              className: "font-mono text-[8px] tracking-[0.15em] uppercase px-4 py-2 border font-bold shrink-0 transition-all hover:opacity-80",
              style: {
                color: H.accentBright,
                borderColor: `${H.accentBright}60`,
                background: `${H.accent}18`,
                boxShadow: `0 0 16px ${H.accent}30`
              },
              children: "⬇ GENERATE SCIENTIFIC REPORT"
            }
          )
        ]
      }
    ),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "hub.pipeline.toast",
        className: "fixed top-4 right-4 z-50 font-mono text-[9px] tracking-[0.12em] uppercase px-4 py-2 border",
        style: {
          color: H.green,
          borderColor: `${H.green}50`,
          background: "oklch(0.07 0.02 265)",
          boxShadow: `0 0 16px ${H.green}30`
        },
        children: [
          "✓ ",
          toast
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { label: "INQUISITOR QUEUE — 8 Active Hypotheses" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex flex-col gap-2",
          "data-ocid": "hub.pipeline.queue_list",
          children: PIPELINE_ITEMS.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `hub.pipeline.item.${i + 1}`,
              className: "border p-3 flex items-center gap-3",
              style: {
                borderColor: item.status === "RUNNING" ? `${H.cyan}40` : H.border,
                background: item.status === "RUNNING" ? `${H.cyan}06` : H.bgCard
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[8.5px] mb-1 truncate",
                      style: { color: H.text },
                      children: item.title
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(HubBadge, { color: statusColor(item.status), children: item.status }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(HubBadge, { color: priorityColor(item.priority), children: [
                      item.priority,
                      " PRI"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[7px]",
                        style: { color: H.violet },
                        children: [
                          "FOCUS: ",
                          item.focus
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `hub.pipeline.send_to_lab.${i + 1}`,
                    onClick: () => showToast("Hypothesis queued for Lab experiment"),
                    className: "font-mono text-[7px] tracking-[0.1em] uppercase px-3 py-1 border shrink-0 transition-all hover:opacity-80",
                    style: {
                      color: H.accent,
                      borderColor: `${H.accent}50`,
                      background: `${H.accent}0a`
                    },
                    children: "⊕ SEND TO LAB"
                  }
                )
              ]
            },
            item.title
          ))
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { label: "PUBLICATION LOG — PDF Artifacts" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border", style: { borderColor: H.border }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid px-3 py-2 border-b",
            style: {
              borderColor: H.border,
              background: H.bgDeep,
              gridTemplateColumns: "1fr 1fr 100px 1fr 110px"
            },
            children: ["COMPOUND", "EXPERIMENT TYPE", "DATE", "DOI", "STATUS"].map(
              (col) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[7px] tracking-[0.15em] uppercase",
                  style: { color: H.dim },
                  children: col
                },
                col
              )
            )
          }
        ),
        PUB_LOG.map((pub, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `hub.pipeline.pub.${i + 1}`,
            className: "grid px-3 py-2 border-b items-center",
            style: {
              borderColor: H.border,
              gridTemplateColumns: "1fr 1fr 100px 1fr 110px"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[8.5px] font-bold",
                  style: { color: H.accentBright },
                  children: pub.compound
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[7.5px]",
                  style: { color: H.textDim },
                  children: pub.expType
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[7px]", style: { color: H.dim }, children: pub.date }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[7.5px] truncate",
                  style: { color: pub.doi ? H.cyan : H.dim },
                  children: pub.doi || "PENDING DOI"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(HubBadge, { color: pub.doi ? H.green : "oklch(0.72 0.22 65)", children: pub.doi ? "ZENODO READY" : "PENDING" })
            ]
          },
          pub.compound
        ))
      ] })
    ] })
  ] }) });
}
function PharmaHubTab({ neural }) {
  const [activeSubTab, setActiveSubTab] = reactExports.useState("dashboard");
  void reactExports.useMemo(() => neural, [neural]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "shrink-0 flex items-center justify-between px-4 border-b",
        style: {
          background: "linear-gradient(to right, oklch(0.055 0.018 265), oklch(0.06 0.022 275))",
          borderColor: H.border,
          height: "40px"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px] tracking-[0.2em] uppercase font-bold",
                style: {
                  color: H.accentBright,
                  textShadow: `0 0 12px ${H.accent}60`
                },
                children: "◈ PHARMA HUB"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px] tracking-[0.15em] uppercase px-2 py-0.5 border",
                style: {
                  color: H.violet,
                  borderColor: `${H.violet}40`,
                  background: `${H.violet}0a`
                },
                children: "NEUROSCIENCE COMMAND CENTER"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[7px] tracking-[0.12em] uppercase",
              style: { color: H.dim },
              children: "Wing 5 · Aggregation Only · No Experiments"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "shrink-0 flex border-b relative",
        style: {
          background: "oklch(0.05 0.016 265)",
          borderColor: H.border,
          height: "34px"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-x-0 top-0 h-px pointer-events-none",
              style: {
                background: `linear-gradient(to right, transparent, ${H.accent}40, transparent)`
              }
            }
          ),
          SUB_TABS.map(({ id, label }) => {
            const isActive = activeSubTab === id;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": `hub.subtab.${id}`,
                onClick: () => setActiveSubTab(id),
                className: "relative flex items-center px-4 font-mono text-[8.5px] tracking-[0.13em] uppercase transition-all whitespace-nowrap shrink-0 h-full",
                style: {
                  color: isActive ? H.accentBright : H.dim,
                  background: isActive ? `${H.accent}0c` : "transparent",
                  borderBottom: isActive ? `2px solid ${H.accent}` : "2px solid transparent"
                },
                children: [
                  isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "absolute inset-x-0 bottom-0 h-px",
                      style: {
                        background: `linear-gradient(to right, transparent, ${H.accent}60, transparent)`,
                        boxShadow: `0 0 4px ${H.accent}`
                      }
                    }
                  ),
                  label
                ]
              },
              id
            );
          })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex-1 overflow-hidden min-h-0",
        style: { background: H.bg },
        children: [
          activeSubTab === "dashboard" && /* @__PURE__ */ jsxRuntimeExports.jsx(NeuralDashboard, { neural }),
          activeSubTab === "inquisitor" && /* @__PURE__ */ jsxRuntimeExports.jsx(InquisitorFeed, { neural }),
          activeSubTab === "correlations" && /* @__PURE__ */ jsxRuntimeExports.jsx(ConnectomeCorrelation, {}),
          activeSubTab === "archive" && /* @__PURE__ */ jsxRuntimeExports.jsx(ExperimentArchive, {}),
          activeSubTab === "compare" && /* @__PURE__ */ jsxRuntimeExports.jsx(CompoundCompare, {}),
          activeSubTab === "pipeline" && /* @__PURE__ */ jsxRuntimeExports.jsx(ResearchPipeline, { neural })
        ]
      }
    )
  ] });
}
export {
  PharmaHubTab as default
};
