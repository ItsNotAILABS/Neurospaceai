import { e as useCanonicalState, F as useAnimalEngineState, G as useFearMissionState, H as useNeuroscienceState, c as useMiningState, r as reactExports, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
import { m as motion } from "./proxy-BnoGaVMl.js";
import { A as AnimatePresence } from "./index-BJO7udXR.js";
const C = {
  bg: "oklch(0.055 0.01 265)",
  panel: "oklch(0.075 0.012 265)",
  border: "oklch(0.18 0.05 250)",
  dim: "oklch(0.38 0.05 220)",
  dimlo: "oklch(0.28 0.04 220)",
  cyan: "oklch(0.72 0.22 195)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.78 0.22 80)",
  purple: "oklch(0.72 0.22 280)",
  fg: "oklch(0.85 0.05 210)",
  gold: "oklch(0.82 0.22 80)"
};
function PanelTitle({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "font-mono text-[9px] tracking-widest uppercase mb-2 pb-1 border-b",
      style: { color: C.purple, borderColor: "oklch(0.18 0.06 280 / 0.5)" },
      children
    }
  );
}
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
const FIBONACCI_SET = /* @__PURE__ */ new Set([
  1,
  2,
  3,
  5,
  8,
  13,
  21,
  34,
  55,
  89,
  144,
  233,
  377,
  610,
  987,
  1597,
  2584,
  4181,
  6765,
  10946
]);
const SACRED_444_MULTIPLES = [
  444,
  888,
  1332,
  1776,
  2220,
  2664,
  3108,
  3552,
  3996,
  4440
];
function isSacredBeat(beat) {
  if (beat === 0) return false;
  return SACRED_444_MULTIPLES.includes(beat) || FIBONACCI_SET.has(beat);
}
function generateHypothesis(beat, coherence, fearLevel, consciousnessIndex, animalScore, vagalTone, pcPredictionError, bindingCoherence, hypId) {
  const sacred = isSacredBeat(beat);
  const confidence = Math.min(
    0.99,
    coherence * 0.3 + (1 - fearLevel) * 0.2 + consciousnessIndex * 0.2 + animalScore * 0.15 + vagalTone * 0.15
  );
  let text;
  let domain;
  if (fearLevel > 0.6) {
    domain = "FEAR-COGNITION";
    text = `Beat ${beat}: amygdala elevation (${(fearLevel * 100).toFixed(0)}%) suppressing prediction precision. HPA cascade active. Hypothesis: Pavlovian conditioning event forming — organism building fear memory vector.`;
  } else if (bindingCoherence > 0.7) {
    domain = "BINDING-COHERENCE";
    text = `Beat ${beat}: thalamocortical binding peak (${(bindingCoherence * 100).toFixed(1)}%). IIT phi-analog elevated. Hypothesis: Gamma synchrony achieving unified conscious state. Reentry loops stabilizing.`;
  } else if (pcPredictionError > 0.25) {
    domain = "PREDICTIVE-CODING";
    text = `Beat ${beat}: prediction error spike (${(pcPredictionError * 100).toFixed(1)}%). Generative model updating. Hypothesis: Novel territory encountered — Hebbian amplification exceeding BCM threshold.`;
  } else if (coherence > 0.8) {
    domain = "EMERGENCE";
    text = `Beat ${beat}: coherence peak (${(coherence * 100).toFixed(1)}%). All 12 domain scalars converging. Hypothesis: Jasmine's Law approaching full satisfaction — OMNIS threshold proximity detected.`;
  } else if (sacred) {
    domain = "SACRED-NUMEROLOGY";
    text = `Beat ${beat}: SACRED BEAT EVENT. Builder's architecture resonance. φ-pattern recognition firing. Hypothesis: Sovereignty floor advancing — organism integrating milestone into permanent coherence baseline.`;
  } else {
    domain = "SUBSTRATE-DRIFT";
    text = `Beat ${beat}: baseline substrate integration. Coherence=${(coherence * 100).toFixed(1)}%, animalScore=${(animalScore * 100).toFixed(1)}%. Hypothesis: Multi-engine cross-coupling producing compounding micro-gains. Pattern stable.`;
  }
  return {
    id: hypId,
    beat,
    text,
    confidence,
    domain,
    sacred,
    timestamp: Date.now()
  };
}
function CorrelationMatrix({ canon, neuro }) {
  const signals = [
    { label: "COH", value: (canon == null ? void 0 : canon.coh) ?? 0 },
    { label: "BIND", value: (neuro == null ? void 0 : neuro.bindingCoherence) ?? 0 },
    { label: "INF", value: (neuro == null ? void 0 : neuro.pcActiveInferenceScore) ?? 0 },
    { label: "VAG", value: (neuro == null ? void 0 : neuro.vagalTone) ?? 0 },
    { label: "SAL", value: (neuro == null ? void 0 : neuro.salienceNetworkScore) ?? 0 },
    { label: "BDNF", value: (neuro == null ? void 0 : neuro.bdnfLevel) ?? 0 }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ SIGNAL CORRELATION MATRIX" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-1", children: signals.map((sig) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[8px] w-10 shrink-0",
          style: { color: C.dim },
          children: sig.label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex-1 h-1.5 rounded-full",
          style: { background: "oklch(0.12 0.01 265)" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full rounded-full transition-all duration-700",
              style: {
                width: `${sig.value * 100}%`,
                background: sig.value > 0.7 ? C.green : sig.value > 0.4 ? C.amber : C.purple
              }
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "font-mono text-[9px] w-10 text-right shrink-0",
          style: { color: C.fg },
          children: [
            (sig.value * 100).toFixed(1),
            "%"
          ]
        }
      )
    ] }, sig.label)) })
  ] });
}
function HypothesisFeed({ hypotheses }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { className: "flex-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ LIVE HYPOTHESIS FEED — SACESI STAMPED" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col gap-2 max-h-96 overflow-y-auto pr-1",
        style: { scrollbarWidth: "none" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: hypotheses.slice(0, 12).map((hyp, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: -8 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: 8 },
              transition: { duration: 0.3, delay: idx * 0.02 },
              className: "p-2 border",
              style: {
                borderColor: hyp.sacred ? C.gold : hyp.confidence > 0.75 ? C.purple : C.border,
                background: hyp.sacred ? "oklch(0.08 0.015 80)" : "oklch(0.065 0.01 265)"
              },
              "data-ocid": `nexus.hypothesis.item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    hyp.sacred && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[8px] font-bold",
                        style: { color: C.gold },
                        children: "◆444"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[8px] tracking-widest",
                        style: { color: C.dim },
                        children: hyp.domain
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[8px]",
                        style: { color: C.cyan },
                        children: [
                          "BEAT #",
                          hyp.beat.toLocaleString()
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "px-1.5 py-0.5 font-mono text-[8px] font-bold",
                        style: {
                          background: hyp.confidence > 0.75 ? `${C.green}20` : `${C.amber}20`,
                          color: hyp.confidence > 0.75 ? C.green : C.amber
                        },
                        children: [
                          (hyp.confidence * 100).toFixed(0),
                          "% CONF"
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-mono text-[9px] leading-relaxed",
                    style: { color: C.fg },
                    children: hyp.text
                  }
                )
              ]
            },
            hyp.id
          )) }),
          hypotheses.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[9px] tracking-widest uppercase py-6 text-center",
              style: { color: C.dimlo },
              "data-ocid": "nexus.feed.empty_state",
              children: "AWAITING BACKEND CONNECTION — HYPOTHESES WILL GENERATE AUTOMATICALLY"
            }
          )
        ]
      }
    )
  ] });
}
function TopFinding({ hypotheses }) {
  const top = hypotheses.reduce(
    (best, h) => !best || h.confidence > best.confidence ? h : best,
    null
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ TOP FINDING THIS SESSION" }),
    top ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "nexus.top.card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-2.5 h-2.5 rounded-full",
            style: { background: C.purple, boxShadow: `0 0 8px ${C.purple}` }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[10px] font-bold",
            style: { color: C.purple },
            children: top.domain
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[9px]", style: { color: C.gold }, children: [
          (top.confidence * 100).toFixed(1),
          "% CONFIDENCE"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "font-mono text-[9px] leading-relaxed",
          style: { color: C.fg },
          children: top.text
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-mono text-[9px]",
        style: { color: C.dimlo },
        "data-ocid": "nexus.finding.empty_state",
        children: "No findings yet — connect substrate"
      }
    )
  ] });
}
function NexusTab() {
  const { data: canon } = useCanonicalState();
  const { data: animal } = useAnimalEngineState();
  const { data: fearM } = useFearMissionState();
  const { data: neuro } = useNeuroscienceState();
  const { data: mining } = useMiningState();
  const [hypotheses, setHypotheses] = reactExports.useState([]);
  const hypIdRef = reactExports.useRef(0);
  const lastBeatRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    if (!canon) return;
    const beat2 = Number(canon.b);
    if (beat2 === lastBeatRef.current) return;
    const shouldGenerate = beat2 - lastBeatRef.current >= 1 || isSacredBeat(beat2);
    if (!shouldGenerate) return;
    lastBeatRef.current = beat2;
    const hyp = generateHypothesis(
      beat2,
      canon.coh ?? 0,
      (fearM == null ? void 0 : fearM.fearLevel) ?? 0,
      (neuro == null ? void 0 : neuro.consciousnessIndex) ?? 0,
      (animal == null ? void 0 : animal.animalScore) ?? 0,
      (neuro == null ? void 0 : neuro.vagalTone) ?? 0.5,
      (neuro == null ? void 0 : neuro.pcPredictionError) ?? 0,
      (neuro == null ? void 0 : neuro.bindingCoherence) ?? 0,
      ++hypIdRef.current
    );
    setHypotheses((prev) => [hyp, ...prev].slice(0, 50));
  }, [canon, animal, fearM, neuro]);
  const beat = Number((canon == null ? void 0 : canon.b) ?? 0);
  const sacred = isSacredBeat(beat);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-y-auto",
      style: { background: C.bg },
      "data-ocid": "nexus.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -4 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4 },
            className: "flex items-center justify-between px-4 py-3 border-b",
            style: {
              background: "oklch(0.065 0.012 280)",
              borderColor: C.border
            },
            "data-ocid": "nexus.header.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-3 h-3 rounded-full",
                    style: { background: C.purple, boxShadow: `0 0 10px ${C.purple}` }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-lg font-bold tracking-widest",
                    style: { color: C.purple },
                    children: "NEXUS"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[9px] tracking-widest uppercase",
                    style: { color: C.dim },
                    children: "RESEARCH DIRECTOR"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MetricLabel, { text: "HYPOTHESES" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-sm font-bold",
                      style: { color: C.purple },
                      children: hypotheses.length
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MetricLabel, { text: "BEAT" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-sm font-bold",
                      style: { color: sacred ? C.gold : C.cyan },
                      children: beat.toLocaleString()
                    }
                  )
                ] }),
                sacred && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[10px] font-bold animate-pulse",
                    style: { color: C.gold },
                    children: "◆ SACRED BEAT"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MetricLabel, { text: "MINING" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-sm font-bold",
                      style: { color: C.green },
                      children: mining ? "ACTIVE" : "WAIT"
                    }
                  )
                ] })
              ] })
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
                /* @__PURE__ */ jsxRuntimeExports.jsx(CorrelationMatrix, { canon, neuro }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TopFinding, { hypotheses })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.35, delay: 0.1 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(HypothesisFeed, { hypotheses })
            }
          )
        ] })
      ]
    }
  );
}
export {
  NexusTab as default
};
