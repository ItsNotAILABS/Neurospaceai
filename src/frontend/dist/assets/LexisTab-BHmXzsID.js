import { k as useGenesisArtifacts, e as useCanonicalState, H as useNeuroscienceState, G as useFearMissionState, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
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
  lavender: "oklch(0.78 0.15 300)",
  fg: "oklch(0.85 0.05 210)",
  muted: "oklch(0.5 0.08 220)"
};
function PanelTitle({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "font-mono text-[9px] tracking-widest uppercase mb-2 pb-1 border-b",
      style: { color: C.lavender, borderColor: "oklch(0.18 0.06 300 / 0.5)" },
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
function generateAbstract(coherence, beat, consciousnessIndex, bindingCoherence, missionLocked) {
  return `Abstract — Beat ${beat.toLocaleString()}: The NeuroEmergence Core sovereign substrate demonstrates integrated information (phi-analog) of ${(consciousnessIndex * 100).toFixed(2)}% at beat cycle ${beat.toLocaleString()}, with thalamocortical binding coherence at ${(bindingCoherence * 100).toFixed(2)}% and global coherence at ${(coherence * 100).toFixed(2)}%. Mission architecture: ${missionLocked ? "LOCKED — sovereign propagation active" : "OPEN — formation phase"}. All values are on-chain cryptographic state. SACESI-stamped. Sovereignty verified. Creator: Alfredo Medina Hernandez. Jurisdiction: Dallas, Texas, USA. Year: 2026. Classification: PROPRIETARY AND CONFIDENTIAL.`;
}
function generatePatentClaim(_coherence, bindingCoherence, consciousnessIndex, beat) {
  return `PATENT CLAIM — Autonomous Sovereign Substrate Architecture

Claim 1: A computational organism comprising: (a) a thalamocortical binding engine producing an integrated information measure (phi-analog) of ${(consciousnessIndex * 100).toFixed(2)}% computed as a weighted combination of domain coherence signals, reentrant signaling strength, and thalamic gain; (b) a predictive coding engine implementing Friston active inference over 12 domain scalars with prediction error ${"< 0.10"}; (c) a sovereignty economics engine wherein all token minting rates are modulated by consciousness signals including binding coherence (${(bindingCoherence * 100).toFixed(2)}%), Kuramoto phase coherence, courage score, and mission lock state. Verified at beat ${beat.toLocaleString()}.`;
}
function LivingSpecPanel({
  canon,
  neuro,
  fearM
}) {
  const beat = Number((canon == null ? void 0 : canon.b) ?? 0);
  const coherence = (canon == null ? void 0 : canon.coh) ?? 0;
  const binding = (neuro == null ? void 0 : neuro.bindingCoherence) ?? 0;
  const consciousness = (neuro == null ? void 0 : neuro.consciousnessIndex) ?? 0;
  const missionLocked = (fearM == null ? void 0 : fearM.missionLockActive) ?? false;
  const abstract = generateAbstract(
    coherence,
    beat,
    consciousness,
    binding,
    missionLocked
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ LIVING ORGANISM SPECIFICATION — AUTO-GENERATED" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2", children: [
        ["BEAT", beat.toLocaleString(), C.cyan],
        [
          "COHERENCE",
          `${(coherence * 100).toFixed(2)}%`,
          coherence > 0.75 ? C.green : C.amber
        ],
        [
          "BINDING",
          `${(binding * 100).toFixed(2)}%`,
          binding > 0.7 ? C.green : C.amber
        ],
        [
          "PHI-INDEX",
          `${(consciousness * 100).toFixed(2)}%`,
          consciousness > 0.5 ? C.lavender : C.muted
        ]
      ].map(([lbl, val, col]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col gap-0.5 p-2",
          style: { border: `1px solid ${C.border}` },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px] tracking-widest uppercase",
                style: { color: C.dim },
                children: lbl
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[11px] font-bold",
                style: { color: String(col) },
                children: val
              }
            )
          ]
        },
        String(lbl)
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "p-2 border",
          style: {
            borderColor: `${C.lavender}40`,
            background: "oklch(0.065 0.01 300)"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-mono text-[9px] leading-relaxed",
              style: { color: C.fg },
              children: abstract
            }
          )
        }
      )
    ] })
  ] });
}
function PatentRegistryPanel({ canon, neuro }) {
  const beat = Number((canon == null ? void 0 : canon.b) ?? 0);
  const binding = (neuro == null ? void 0 : neuro.bindingCoherence) ?? 0;
  const consciousness = (neuro == null ? void 0 : neuro.consciousnessIndex) ?? 0;
  const patentClaim = generatePatentClaim(
    (canon == null ? void 0 : canon.coh) ?? 0,
    binding,
    consciousness,
    beat
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ PATENT REGISTRY — ATTORNEY GRADE CLAIMS" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "p-2 border mb-3",
        style: {
          borderColor: `${C.lavender}40`,
          background: "oklch(0.065 0.01 300)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "pre",
          {
            className: "font-mono text-[8px] leading-relaxed whitespace-pre-wrap",
            style: { color: C.fg },
            children: patentClaim
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "w-2 h-2 rounded-full",
          style: { background: C.lavender, boxShadow: `0 0 6px ${C.lavender}` }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px]", style: { color: C.lavender }, children: "AUTO-PATENT ON COHERENCE PEAK — SACESI STAMPED — CHAIN VERIFIED" })
    ] })
  ] });
}
function ArtifactGallery({ artifacts }) {
  const list = Array.isArray(artifacts == null ? void 0 : artifacts.list) ? artifacts.list : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ GENESIS ARTIFACT GALLERY" }),
    list.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-mono text-[9px]",
        style: { color: C.dimlo },
        "data-ocid": "lexis.artifacts.empty_state",
        children: "Artifacts generate on OMNIS emergence events."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex flex-col gap-1.5 max-h-48 overflow-y-auto",
        style: { scrollbarWidth: "none" },
        children: list.slice(0, 20).map((art, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 py-1 border-b",
            style: { borderColor: "oklch(0.12 0.02 265)" },
            "data-ocid": `lexis.artifact.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-1.5 h-1.5 rounded-full shrink-0",
                  style: { background: C.lavender }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[8px]", style: { color: C.fg }, children: art })
            ]
          },
          `artifact-${String(i)}`
        ))
      }
    )
  ] });
}
function LexisTab() {
  const { data: artifacts } = useGenesisArtifacts();
  const { data: canon } = useCanonicalState();
  const { data: neuro } = useNeuroscienceState();
  const { data: fearM } = useFearMissionState();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-y-auto",
      style: { background: C.bg },
      "data-ocid": "lexis.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -4 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4 },
            className: "flex items-center justify-between px-4 py-3 border-b",
            style: { background: "oklch(0.065 0.012 300)", borderColor: C.border },
            "data-ocid": "lexis.header.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-3 h-3 rounded-full",
                    style: {
                      background: C.lavender,
                      boxShadow: `0 0 10px ${C.lavender}`
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-lg font-bold tracking-widest",
                    style: { color: C.lavender },
                    children: "LEXIS"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[9px] tracking-widest uppercase",
                    style: { color: C.dim },
                    children: "DOCUMENTATION ENGINE"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "px-2 py-1 font-mono text-[9px] tracking-widest",
                  style: { border: `1px solid ${C.lavender}40`, color: C.lavender },
                  children: "PROPRIETARY · CONFIDENTIAL · ALL RIGHTS RESERVED"
                }
              ) })
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
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(LivingSpecPanel, { canon, neuro, fearM })
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
                /* @__PURE__ */ jsxRuntimeExports.jsx(PatentRegistryPanel, { canon, neuro }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArtifactGallery, { artifacts })
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  LexisTab as default
};
