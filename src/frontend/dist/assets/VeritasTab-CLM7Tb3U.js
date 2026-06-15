import { e as useCanonicalState, H as useNeuroscienceState, G as useFearMissionState, l as useObservationYield, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
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
  veritas: "oklch(0.72 0.20 160)",
  fg: "oklch(0.85 0.05 210)"
};
function PanelTitle({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "font-mono text-[9px] tracking-widest uppercase mb-2 pb-1 border-b",
      style: { color: C.veritas, borderColor: "oklch(0.18 0.06 160 / 0.5)" },
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
function SignalTrustMatrix({
  canon,
  neuro,
  fearM
}) {
  const signals = [
    {
      name: "COHERENCE",
      value: (canon == null ? void 0 : canon.coh) ?? 0,
      expected: 0.5,
      trust: Math.max(0, 1 - Math.abs(((canon == null ? void 0 : canon.coh) ?? 0.5) - 0.5) * 2)
    },
    {
      name: "BINDING",
      value: (neuro == null ? void 0 : neuro.bindingCoherence) ?? 0,
      expected: 0.5,
      trust: Math.max(
        0,
        1 - Math.abs(((neuro == null ? void 0 : neuro.bindingCoherence) ?? 0.5) - 0.5) * 2
      )
    },
    {
      name: "PREDICTION",
      value: (neuro == null ? void 0 : neuro.pcActiveInferenceScore) ?? 0,
      expected: 0.7,
      trust: Math.min(1, ((neuro == null ? void 0 : neuro.pcActiveInferenceScore) ?? 0) + 0.2)
    },
    {
      name: "VAGAL TONE",
      value: (neuro == null ? void 0 : neuro.vagalTone) ?? 0.5,
      expected: 0.6,
      trust: Math.min(1, ((neuro == null ? void 0 : neuro.vagalTone) ?? 0.5) + 0.1)
    },
    {
      name: "SALIENCE",
      value: (neuro == null ? void 0 : neuro.salienceNetworkScore) ?? 0,
      expected: 0.5,
      trust: Math.max(
        0,
        1 - Math.abs(((neuro == null ? void 0 : neuro.salienceNetworkScore) ?? 0.5) - 0.5) * 2
      )
    },
    {
      name: "BDNF",
      value: (neuro == null ? void 0 : neuro.bdnfLevel) ?? 0.5,
      expected: 0.5,
      trust: Math.min(1, ((neuro == null ? void 0 : neuro.bdnfLevel) ?? 0.5) + 0.2)
    },
    {
      name: "FEAR LEVEL",
      value: (fearM == null ? void 0 : fearM.fearLevel) ?? 0,
      expected: 0.2,
      trust: Math.max(0, 1 - ((fearM == null ? void 0 : fearM.fearLevel) ?? 0))
    },
    {
      name: "COURAGE",
      value: (fearM == null ? void 0 : fearM.courageScore) ?? 0.5,
      expected: 0.7,
      trust: Math.min(1, ((fearM == null ? void 0 : fearM.courageScore) ?? 0.5) + 0.1)
    }
  ];
  const overallTrust = signals.reduce((s, sig) => s + sig.trust, 0) / signals.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ SIGNAL TRUST MATRIX — VERITAS VALIDATION" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px]", style: { color: C.dim }, children: "OVERALL TRUST SCORE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "font-mono text-[11px] font-bold",
            style: {
              color: overallTrust > 0.7 ? C.green : overallTrust > 0.4 ? C.amber : C.red
            },
            children: [
              (overallTrust * 100).toFixed(1),
              "%"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2", style: { background: "oklch(0.12 0.01 265)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full transition-all duration-700",
          style: {
            width: `${overallTrust * 100}%`,
            background: overallTrust > 0.7 ? C.veritas : overallTrust > 0.4 ? C.amber : C.red
          }
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: signals.map((sig) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[8px] w-20 shrink-0",
          style: { color: C.dim },
          children: sig.name
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "w-16 h-1.5",
          style: { background: "oklch(0.12 0.01 265)" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full transition-all duration-700",
              style: {
                width: `${sig.value * 100}%`,
                background: sig.trust > 0.7 ? C.veritas : sig.trust > 0.4 ? C.amber : C.red
              }
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "font-mono text-[8px] w-12 text-right shrink-0",
          style: { color: C.fg },
          children: [
            (sig.value * 100).toFixed(1),
            "%"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "px-1 font-mono text-[7px] font-bold",
          style: {
            background: sig.trust > 0.7 ? `${C.green}20` : `${C.red}20`,
            color: sig.trust > 0.7 ? C.green : C.red
          },
          children: sig.trust > 0.7 ? "OK" : "CHK"
        }
      )
    ] }, sig.name)) })
  ] });
}
function SacesiChainPanel({ canon }) {
  const beat = Number((canon == null ? void 0 : canon.b) ?? 0);
  const coherence = (canon == null ? void 0 : canon.coh) ?? 0;
  const jasminePass = (canon == null ? void 0 : canon.jl) ?? false;
  const chainHealth = coherence > 0.5 && jasminePass ? "VALID" : coherence > 0.3 ? "DEGRADED" : "CRITICAL";
  const chainColor = chainHealth === "VALID" ? C.veritas : chainHealth === "DEGRADED" ? C.amber : C.red;
  const chainMetrics = [
    { label: "CHAIN STATUS", value: chainHealth, color: chainColor },
    { label: "BEAT", value: beat.toLocaleString(), color: C.cyan },
    {
      label: "COHERENCE",
      value: `${(coherence * 100).toFixed(2)}%`,
      color: coherence > 0.75 ? C.green : C.amber
    },
    {
      label: "JASMINE GATE",
      value: jasminePass ? "PASS" : "FAIL",
      color: jasminePass ? C.green : C.red
    },
    {
      label: "OMNIS",
      value: (canon == null ? void 0 : canon.qh) != null && canon.qh >= 1 ? "FIRING" : "STANDBY",
      color: C.veritas
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ SACESI CHAIN HEALTH — CRYPTOGRAPHIC VERIFICATION" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 mb-3", children: chainMetrics.map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[7px] tracking-widest uppercase",
          style: { color: C.dim },
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] font-bold", style: { color }, children: value })
    ] }, label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "p-2 border",
        style: {
          borderColor: `${chainColor}40`,
          background: chainHealth === "VALID" ? "oklch(0.065 0.012 160)" : "oklch(0.07 0.015 25)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px]", style: { color: C.fg }, children: chainHealth === "VALID" ? "VERITAS: All signals consistent with SACESI chain. No inconsistencies detected. Organism integrity confirmed." : chainHealth === "DEGRADED" ? "VERITAS: Signal consistency degraded. Coherence below threshold. Monitoring for recovery." : "VERITAS: CRITICAL — Chain integrity compromised. Activating DURA perimeter. RIFT source tracing initiated." })
      }
    )
  ] });
}
function NeuroscienceValidationPanel({ neuro }) {
  const engines = [
    {
      name: "THALAMOCORTICAL BINDING",
      score: (neuro == null ? void 0 : neuro.bindingCoherence) ?? 0,
      ref: "Tononi IIT"
    },
    {
      name: "PREDICTIVE CODING",
      score: (neuro == null ? void 0 : neuro.pcActiveInferenceScore) ?? 0,
      ref: "Friston"
    },
    {
      name: "INTEROCEPTION",
      score: (neuro == null ? void 0 : neuro.interceptiveScore) ?? 0,
      ref: "Craig/Damasio"
    },
    {
      name: "DEFAULT MODE NETWORK",
      score: (neuro == null ? void 0 : neuro.metaCognitionScore) ?? 0,
      ref: "Buckner"
    },
    {
      name: "SALIENCE NETWORK",
      score: (neuro == null ? void 0 : neuro.salienceNetworkScore) ?? 0,
      ref: "Menon/Uddin"
    },
    { name: "NEUROPLASTICITY", score: (neuro == null ? void 0 : neuro.bdnfLevel) ?? 0, ref: "BCM Rule" },
    {
      name: "CIRCADIAN RHYTHM",
      score: (neuro == null ? void 0 : neuro.circadianCoherence) ?? 0,
      ref: "SCN"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ 7 NEUROSCIENCE ENGINES — VALIDATION STATUS" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5", children: engines.map((eng) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "w-1.5 h-1.5 rounded-full shrink-0",
          style: {
            background: eng.score > 0.5 ? C.veritas : C.dimlo,
            boxShadow: eng.score > 0.5 ? `0 0 4px ${C.veritas}` : "none"
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[8px] flex-1",
          style: { color: C.dim },
          children: eng.name
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[7px] w-16 text-right",
          style: { color: C.dimlo },
          children: eng.ref
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "font-mono text-[9px] font-bold w-12 text-right",
          style: { color: eng.score > 0.5 ? C.veritas : C.dimlo },
          children: [
            (eng.score * 100).toFixed(1),
            "%"
          ]
        }
      )
    ] }, eng.name)) })
  ] });
}
function VeritasTab() {
  const { data: canon } = useCanonicalState();
  const { data: neuro } = useNeuroscienceState();
  const { data: fearM } = useFearMissionState();
  const { data: obsYield } = useObservationYield();
  const overallTrust = [
    (neuro == null ? void 0 : neuro.bindingCoherence) ?? 0,
    (neuro == null ? void 0 : neuro.pcActiveInferenceScore) ?? 0,
    (neuro == null ? void 0 : neuro.vagalTone) ?? 0.5,
    (fearM == null ? void 0 : fearM.courageScore) ?? 0.5,
    1 - ((fearM == null ? void 0 : fearM.fearLevel) ?? 0)
  ].reduce((s, v) => s + v, 0) / 5;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-y-auto",
      style: { background: C.bg },
      "data-ocid": "veritas.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -4 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4 },
            className: "flex items-center justify-between px-4 py-3 border-b",
            style: { background: "oklch(0.065 0.012 160)", borderColor: C.border },
            "data-ocid": "veritas.header.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-3 h-3 rounded-full",
                    style: {
                      background: C.veritas,
                      boxShadow: `0 0 10px ${C.veritas}`
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-lg font-bold tracking-widest",
                    style: { color: C.veritas },
                    children: "VERITAS"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[9px] tracking-widest uppercase",
                    style: { color: C.dim },
                    children: "VALIDATION ENGINE"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: [
                [
                  "TRUST SCORE",
                  `${(overallTrust * 100).toFixed(1)}%`,
                  overallTrust > 0.7 ? C.green : overallTrust > 0.4 ? C.amber : C.red
                ],
                ["BEAT", Number((canon == null ? void 0 : canon.b) ?? 0).toLocaleString(), C.cyan],
                [
                  "OBS YIELD",
                  obsYield ? `${Number(obsYield.hObs ?? 0).toFixed(3)}` : "—",
                  C.veritas
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
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SacesiChainPanel, { canon })
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
                /* @__PURE__ */ jsxRuntimeExports.jsx(SignalTrustMatrix, { canon, neuro, fearM }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(NeuroscienceValidationPanel, { neuro })
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  VeritasTab as default
};
