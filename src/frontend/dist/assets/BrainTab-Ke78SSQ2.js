import { j as jsxRuntimeExports, r as reactExports, K as FrontendRegion, R as Region, g as useNeuroChem, e as useCanonicalState, H as useNeuroscienceState, G as useFearMissionState } from "./index-CGYrnU7d.js";
import { C as Canvas, O as OrbitControls, u as useFrame } from "./OrbitControls-CwmRBLxw.js";
import { C as Color, B as BackSide, a as BufferGeometry, b as BufferAttribute, P as PointsMaterial, A as AdditiveBlending, D as DoubleSide, V as Vector3, Q as QuadraticBezierCurve3, T as TubeGeometry } from "./three.module-DHVhg58e.js";
import { m as motion } from "./proxy-BnoGaVMl.js";
function MetricBar({
  label,
  value,
  color,
  rightLabel
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[7px] tracking-widest uppercase",
          style: { color: "oklch(0.45 0.06 220)" },
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px] font-bold", style: { color }, children: rightLabel ?? `${pct}%` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full rounded-sm",
        style: { height: 3, background: "oklch(0.14 0.03 260)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              height: "100%",
              width: `${pct}%`,
              background: color,
              borderRadius: 2,
              transition: "width 0.4s ease"
            }
          }
        )
      }
    )
  ] });
}
function BipolarBar({ label, value }) {
  const clamped = Math.max(-1, Math.min(1, value));
  const isSymp = clamped > 0;
  const pct = Math.abs(clamped) * 50;
  const barColor = isSymp ? "oklch(0.72 0.28 25)" : "oklch(0.72 0.24 145)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[6px] tracking-wider uppercase",
          style: { color: "oklch(0.38 0.05 220)" },
          children: "Sympathetic"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[7px] tracking-widest uppercase",
          style: { color: "oklch(0.45 0.06 220)" },
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[6px] tracking-wider uppercase",
          style: { color: "oklch(0.38 0.05 220)" },
          children: "Parasympathetic"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "w-full relative rounded-sm",
        style: { height: 4, background: "oklch(0.14 0.03 260)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute top-0 bottom-0",
              style: {
                left: "50%",
                width: 1,
                background: "oklch(0.28 0.05 220)",
                transform: "translateX(-50%)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                position: "absolute",
                top: 0,
                bottom: 0,
                ...isSymp ? { right: `${50 - pct}%`, left: "50%" } : { left: `${50 - pct}%`, right: "50%" },
                background: barColor,
                borderRadius: 2,
                transition: "all 0.4s ease"
              }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mt-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[6px]",
          style: { color: "oklch(0.72 0.28 25)" },
          children: clamped < 0 ? `${Math.round(Math.abs(clamped) * 100)}%` : ""
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[7px] font-bold",
          style: { color: barColor },
          children: clamped.toFixed(2)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[6px]",
          style: { color: "oklch(0.72 0.24 145)" },
          children: clamped > 0 ? `${Math.round(Math.abs(clamped) * 100)}%` : ""
        }
      )
    ] })
  ] });
}
function ANSPanel({ ansState, events }) {
  const hrColor = ansState.heartRateProxy < 80 ? "oklch(0.72 0.22 145)" : ansState.heartRateProxy < 120 ? "oklch(0.82 0.22 65)" : "oklch(0.72 0.28 25)";
  const ansEvents = events.filter(
    (e) => e.description.includes("REGULATION_POSITIVE") || e.description.includes("STRESS_PEAK") || e.description.includes("AUTONOMIC_BALANCE_RESTORED") || e.description.includes("[ANS]")
  ).slice(0, 5);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "ans.panel",
      className: "shrink-0 border-t",
      style: {
        borderColor: "oklch(0.18 0.04 255)",
        background: "oklch(0.055 0.012 265)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-1 flex items-center gap-2 border-b",
            style: { borderColor: "oklch(0.16 0.04 255)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-1.5 h-1.5 rounded-full",
                  style: {
                    background: ansState.stressSignal > 0.6 ? "oklch(0.72 0.28 25)" : "oklch(0.72 0.22 145)",
                    boxShadow: ansState.stressSignal > 0.6 ? "0 0 4px oklch(0.72 0.28 25)" : "0 0 3px oklch(0.72 0.22 145 / 0.5)"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[8px] tracking-widest uppercase font-bold",
                  style: { color: "oklch(0.55 0.12 195)" },
                  children: "ANS · Interoceptive Layer"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[7px] ml-auto",
                  style: { color: "oklch(0.35 0.05 220)" },
                  children: [
                    "selfWt: ",
                    (ansState.selfStateWeight * 100).toFixed(0),
                    "%"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MetricBar,
            {
              label: "Heart Rate",
              value: (ansState.heartRateProxy - 60) / 120,
              color: hrColor,
              rightLabel: `${Math.round(ansState.heartRateProxy)} bpm`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MetricBar,
            {
              label: "HRV (regulation)",
              value: ansState.hrvProxy,
              color: "oklch(0.72 0.22 145)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MetricBar,
            {
              label: "Stress Signal",
              value: ansState.stressSignal,
              color: ansState.stressSignal > 0.7 ? "oklch(0.72 0.28 25)" : ansState.stressSignal > 0.4 ? "oklch(0.78 0.24 55)" : "oklch(0.65 0.14 195)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MetricBar,
            {
              label: "Recovery Signal",
              value: ansState.recoverySignal,
              color: "oklch(0.72 0.22 145)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            BipolarBar,
            {
              label: "Autonomic Balance",
              value: -ansState.autonomicBalanceIndex
            }
          ),
          ansEvents.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "mt-1.5 pt-1.5 border-t",
              style: { borderColor: "oklch(0.16 0.04 255)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[7px] tracking-widest uppercase",
                    style: { color: "oklch(0.35 0.05 220)" },
                    children: "Recent ANS Events"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 space-y-0.5", children: ansEvents.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "font-mono text-[7px] leading-tight",
                    style: { color: "oklch(0.55 0.10 195)" },
                    children: [
                      "t",
                      e.tick,
                      ": ",
                      e.description.replace("[ANS] ", "")
                    ]
                  },
                  `${e.tick}-${e.description.slice(0, 20)}`
                )) })
              ]
            }
          )
        ] })
      ]
    }
  );
}
const SATURATION_THRESHOLD = 0.85;
const SOVEREIGN_ALIAS_MAP = {
  [Region.PrefrontalCortex]: "Executive Sovereign",
  [Region.Hippocampus]: "Memory Temple",
  [Region.Amygdala]: "Vigilance Core",
  [FrontendRegion.AnteriorCingulateCortex]: "Convergence Watch",
  [Region.Thalamus]: "Signal Relay",
  [Region.Cerebellum]: "Timing Citadel",
  [FrontendRegion.Insula]: "Interoceptive Field",
  [Region.BasalGanglia]: "Habit Forge",
  [FrontendRegion.TemporalCortex]: "Semantic Archive",
  [FrontendRegion.VisualCortex]: "Projection Domain",
  [FrontendRegion.BrocaArea_L]: "Expression Gate",
  [FrontendRegion.DorsalACC]: "Identity Continuum",
  [FrontendRegion.SuperiorTemporalSulcus]: "VERITAS Node",
  [FrontendRegion.MedullaryReticular]: "Third Brain",
  [FrontendRegion.LocusCoeruleus]: "Arousal Engine",
  [Region.Brainstem]: "Bridge Sovereign"
};
const BIOLOGICAL_NAMES = {
  [Region.PrefrontalCortex]: "Prefrontal Cortex",
  [Region.Hippocampus]: "Hippocampus",
  [Region.Amygdala]: "Amygdala",
  [FrontendRegion.AnteriorCingulateCortex]: "Anterior Cingulate Cortex",
  [Region.Thalamus]: "Thalamus",
  [Region.Cerebellum]: "Cerebellum",
  [FrontendRegion.Insula]: "Insula",
  [Region.BasalGanglia]: "Basal Ganglia",
  [FrontendRegion.TemporalCortex]: "Temporal Cortex",
  [FrontendRegion.VisualCortex]: "Occipital / Visual Cortex",
  [FrontendRegion.BrocaArea_L]: "Broca's Area",
  [FrontendRegion.DorsalACC]: "Default Mode Network",
  [FrontendRegion.SuperiorTemporalSulcus]: "Salience Network",
  [FrontendRegion.MedullaryReticular]: "Enteric Intelligence",
  [FrontendRegion.LocusCoeruleus]: "Locus Coeruleus",
  [Region.Brainstem]: "Corpus Callosum / Brainstem"
};
const SOVEREIGN_REGIONS = [
  Region.PrefrontalCortex,
  Region.Hippocampus,
  Region.Amygdala,
  FrontendRegion.AnteriorCingulateCortex,
  Region.Thalamus,
  Region.Cerebellum,
  FrontendRegion.Insula,
  Region.BasalGanglia,
  FrontendRegion.TemporalCortex,
  FrontendRegion.VisualCortex,
  FrontendRegion.BrocaArea_L,
  FrontendRegion.DorsalACC,
  FrontendRegion.SuperiorTemporalSulcus,
  FrontendRegion.MedullaryReticular,
  FrontendRegion.LocusCoeruleus,
  Region.Brainstem
];
const REGION_CONFIGS = {
  // Backend regions (original 9)
  [Region.PrefrontalCortex]: { pos: [0, 1.6, 1.2], radius: 0.32, label: "PFC" },
  [Region.MotorCortex]: { pos: [-0.6, 1.4, 0.4], radius: 0.28, label: "MC" },
  [Region.SensoryCortex]: { pos: [0.6, 1.4, 0.4], radius: 0.28, label: "SC" },
  [Region.Thalamus]: { pos: [0, 0.3, 0], radius: 0.35, label: "THAL" },
  [Region.Hippocampus]: { pos: [0, -0.1, -0.3], radius: 0.25, label: "HIPP" },
  [Region.Amygdala]: { pos: [0, -0.4, 0.2], radius: 0.22, label: "AMYG" },
  [Region.BasalGanglia]: { pos: [0, 0, 0.5], radius: 0.3, label: "BG" },
  [Region.Cerebellum]: { pos: [0, -1, -1], radius: 0.45, label: "CERE" },
  [Region.Brainstem]: { pos: [0, -1.5, -0.2], radius: 0.2, label: "BS" },
  // Frontend-extended regions (new 8)
  [FrontendRegion.Insula]: {
    pos: [-0.5, 0.5, 0.3],
    radius: 0.22,
    label: "INS"
  },
  [FrontendRegion.AnteriorCingulateCortex]: {
    pos: [0, 1.2, 0.6],
    radius: 0.24,
    label: "ACC"
  },
  [FrontendRegion.OrbitalFrontalCortex]: {
    pos: [0, 1.8, 1.6],
    radius: 0.26,
    label: "OFC"
  },
  [FrontendRegion.VisualCortex]: {
    pos: [0, 0.8, -1.6],
    radius: 0.32,
    label: "V1"
  },
  [FrontendRegion.AuditoryCortex]: {
    pos: [-0.8, 1, -0.2],
    radius: 0.24,
    label: "AC"
  },
  [FrontendRegion.Hypothalamus]: {
    pos: [0, -0.2, 0.3],
    radius: 0.2,
    label: "HYP"
  },
  [FrontendRegion.NucleusAccumbens]: {
    pos: [0, 0.2, 0.8],
    radius: 0.18,
    label: "NAc"
  },
  [FrontendRegion.OlfactoryBulb]: {
    pos: [0, 0.8, 2],
    radius: 0.16,
    label: "OB"
  },
  // New sub-regions (13)
  [FrontendRegion.CA1]: { pos: [0.2, -0.1, -0.5], radius: 0.14, label: "CA1" },
  [FrontendRegion.CA3]: { pos: [-0.2, -0.1, -0.4], radius: 0.14, label: "CA3" },
  [FrontendRegion.DentateGyrus]: {
    pos: [0, -0.25, -0.6],
    radius: 0.12,
    label: "DG"
  },
  [FrontendRegion.PurkinjeLayer]: {
    pos: [0.25, -1, -1.1],
    radius: 0.18,
    label: "PKJ"
  },
  [FrontendRegion.DeepCerebellarNuclei]: {
    pos: [-0.25, -1, -1],
    radius: 0.15,
    label: "DCN"
  },
  [FrontendRegion.MedialdorsalThalamus]: {
    pos: [0.2, 0.3, 0.1],
    radius: 0.16,
    label: "MDT"
  },
  [FrontendRegion.PulvinarThalamus]: {
    pos: [-0.2, 0.3, -0.2],
    radius: 0.16,
    label: "PUL"
  },
  [FrontendRegion.ParietalCortex]: {
    pos: [0.8, 1.2, -0.4],
    radius: 0.26,
    label: "PAR"
  },
  [FrontendRegion.TemporalCortex]: {
    pos: [-0.9, 0.8, 0],
    radius: 0.26,
    label: "TMP"
  },
  [FrontendRegion.CingulateMotorArea]: {
    pos: [-0.3, 1.3, 0.2],
    radius: 0.2,
    label: "CMA"
  },
  [FrontendRegion.Claustrum]: {
    pos: [0.5, 0.4, 0.1],
    radius: 0.13,
    label: "CLS"
  },
  [FrontendRegion.LateralHabenula]: {
    pos: [0.15, 0.1, -0.1],
    radius: 0.12,
    label: "LHb"
  },
  [FrontendRegion.SubstantiaNigra]: {
    pos: [0, -1.2, -0.1],
    radius: 0.16,
    label: "SN"
  },
  // 10 new regions
  [FrontendRegion.SuperiorTemporalSulcus]: {
    pos: [-1, 0.6, -0.3],
    radius: 0.18,
    label: "STS"
  },
  [FrontendRegion.DorsalACC]: {
    pos: [0.2, 1.2, 0.5],
    radius: 0.18,
    label: "dACC"
  },
  [FrontendRegion.VentralTegmentalArea]: {
    pos: [0, -1.3, 0],
    radius: 0.14,
    label: "VTA"
  },
  [FrontendRegion.LocusCoeruleus]: {
    pos: [0.2, -1.4, -0.5],
    radius: 0.12,
    label: "LC"
  },
  [FrontendRegion.RapheNuclei]: {
    pos: [-0.2, -1.4, -0.4],
    radius: 0.12,
    label: "RN"
  },
  [FrontendRegion.VentralStriatum]: {
    pos: [0.3, 0.1, 0.7],
    radius: 0.16,
    label: "VS"
  },
  [FrontendRegion.EntorhinalCortex]: {
    pos: [-0.3, -0.3, -0.8],
    radius: 0.14,
    label: "EC"
  },
  [FrontendRegion.PerirhinalCortex]: {
    pos: [0.3, -0.3, -0.9],
    radius: 0.13,
    label: "PC"
  },
  [FrontendRegion.SupplementaryMotorArea]: {
    pos: [-0.4, 1.5, 0.2],
    radius: 0.18,
    label: "SMA"
  },
  [FrontendRegion.VentralPallidum]: {
    pos: [-0.3, 0.1, 0.6],
    radius: 0.13,
    label: "VP"
  },
  // 5 new regions (45-region expansion)
  [FrontendRegion.SpinoCerebellarTract]: {
    pos: [0.2, -1.2, -0.8],
    radius: 0.16,
    label: "SCT"
  },
  [FrontendRegion.PeriaqueductalGray]: {
    pos: [0, -1.1, -0.4],
    radius: 0.14,
    label: "PAG"
  },
  [FrontendRegion.BedNucleusStria]: {
    pos: [-0.3, -0.3, 0.4],
    radius: 0.13,
    label: "BNST"
  },
  [FrontendRegion.MedialSeptum]: {
    pos: [0, 0.5, 1],
    radius: 0.14,
    label: "MS"
  },
  [FrontendRegion.RetroSplenialCortex]: {
    pos: [0, 0.6, -1.3],
    radius: 0.18,
    label: "RSC"
  },
  // ── HCP 180-region additions — MNI152 coordinates (Glasser 2016) ─────────────
  // Frontal lobe
  [FrontendRegion.FrontalPole_L]: {
    pos: [-3.5, 1.2, 6.5],
    radius: 0.16,
    label: "FP-L"
  },
  [FrontendRegion.FrontalPole_R]: {
    pos: [3.5, 1.2, 6.5],
    radius: 0.16,
    label: "FP-R"
  },
  [FrontendRegion.MedialPFC_L]: {
    pos: [-1, 5, 2.5],
    radius: 0.18,
    label: "mPFC-L"
  },
  [FrontendRegion.MedialPFC_R]: {
    pos: [1, 5, 2.5],
    radius: 0.18,
    label: "mPFC-R"
  },
  [FrontendRegion.VentralMPFC_L]: {
    pos: [-1, 4, 1],
    radius: 0.15,
    label: "vmPFC-L"
  },
  [FrontendRegion.VentralMPFC_R]: {
    pos: [1, 4, 1],
    radius: 0.15,
    label: "vmPFC-R"
  },
  [FrontendRegion.DorsalMPFC_L]: {
    pos: [-1, 5.5, 2],
    radius: 0.16,
    label: "dmPFC-L"
  },
  [FrontendRegion.DorsalMPFC_R]: {
    pos: [1, 5.5, 2],
    radius: 0.16,
    label: "dmPFC-R"
  },
  [FrontendRegion.InferiorFrontal_L]: {
    pos: [-4.5, 2, 1.5],
    radius: 0.18,
    label: "IFG-L"
  },
  [FrontendRegion.InferiorFrontal_R]: {
    pos: [4.5, 2, 1.5],
    radius: 0.18,
    label: "IFG-R"
  },
  [FrontendRegion.MiddleFrontal_L]: {
    pos: [-3.8, 3, 3],
    radius: 0.18,
    label: "MFG-L"
  },
  [FrontendRegion.MiddleFrontal_R]: {
    pos: [3.8, 3, 3],
    radius: 0.18,
    label: "MFG-R"
  },
  [FrontendRegion.SuperiorFrontal_L]: {
    pos: [-2, 4, 4.5],
    radius: 0.18,
    label: "SFG-L"
  },
  [FrontendRegion.SuperiorFrontal_R]: {
    pos: [2, 4, 4.5],
    radius: 0.18,
    label: "SFG-R"
  },
  [FrontendRegion.PreCentralGyrus_L]: {
    pos: [-3.5, 1.5, 5],
    radius: 0.17,
    label: "PreCG-L"
  },
  [FrontendRegion.PreCentralGyrus_R]: {
    pos: [3.5, 1.5, 5],
    radius: 0.17,
    label: "PreCG-R"
  },
  [FrontendRegion.PreMotorCortex_L]: {
    pos: [-3, 2.5, 5],
    radius: 0.18,
    label: "PMC-L"
  },
  [FrontendRegion.PreMotorCortex_R]: {
    pos: [3, 2.5, 5],
    radius: 0.18,
    label: "PMC-R"
  },
  [FrontendRegion.PrimaryMotorCortex_L]: {
    pos: [-3.8, 0.5, 5.5],
    radius: 0.2,
    label: "M1-L"
  },
  [FrontendRegion.PrimaryMotorCortex_R]: {
    pos: [3.8, 0.5, 5.5],
    radius: 0.2,
    label: "M1-R"
  },
  [FrontendRegion.PrimaryMotorHand_L]: {
    pos: [-4, 0, 5.8],
    radius: 0.16,
    label: "M1H-L"
  },
  [FrontendRegion.PrimaryMotorHand_R]: {
    pos: [4, 0, 5.8],
    radius: 0.16,
    label: "M1H-R"
  },
  [FrontendRegion.BrocaArea_L]: {
    pos: [-4.5, 1.5, 1],
    radius: 0.17,
    label: "BRC-L"
  },
  [FrontendRegion.BrocaArea_R]: {
    pos: [4.5, 1.5, 1],
    radius: 0.15,
    label: "BRC-R"
  },
  [FrontendRegion.FrontalOperculum_L]: {
    pos: [-4.2, 0.5, 1],
    radius: 0.15,
    label: "FOp-L"
  },
  [FrontendRegion.FrontalOperculum_R]: {
    pos: [4.2, 0.5, 1],
    radius: 0.15,
    label: "FOp-R"
  },
  [FrontendRegion.ParsTriangularis_L]: {
    pos: [-4.8, 2, 1],
    radius: 0.14,
    label: "PTri-L"
  },
  [FrontendRegion.ParsTriangularis_R]: {
    pos: [4.8, 2, 1],
    radius: 0.14,
    label: "PTri-R"
  },
  [FrontendRegion.ParsOrbitalis_L]: {
    pos: [-4.5, 1.5, 0],
    radius: 0.13,
    label: "POrb-L"
  },
  [FrontendRegion.ParsOrbitalis_R]: {
    pos: [4.5, 1.5, 0],
    radius: 0.13,
    label: "POrb-R"
  },
  // Parietal lobe
  [FrontendRegion.PrimarySomatosensory_L]: {
    pos: [-3.8, 0, 5.2],
    radius: 0.2,
    label: "S1-L"
  },
  [FrontendRegion.PrimarySomatosensory_R]: {
    pos: [3.8, 0, 5.2],
    radius: 0.2,
    label: "S1-R"
  },
  [FrontendRegion.SecondarySomatosensory_L]: {
    pos: [-4.2, -0.5, 4],
    radius: 0.16,
    label: "S2-L"
  },
  [FrontendRegion.SecondarySomatosensory_R]: {
    pos: [4.2, -0.5, 4],
    radius: 0.16,
    label: "S2-R"
  },
  [FrontendRegion.PostCentralGyrus_L]: {
    pos: [-3.5, -0.5, 5],
    radius: 0.17,
    label: "PostCG-L"
  },
  [FrontendRegion.PostCentralGyrus_R]: {
    pos: [3.5, -0.5, 5],
    radius: 0.17,
    label: "PostCG-R"
  },
  [FrontendRegion.SuperiorParietal_L]: {
    pos: [-2.5, -1.5, 5.5],
    radius: 0.18,
    label: "SPL-L"
  },
  [FrontendRegion.SuperiorParietal_R]: {
    pos: [2.5, -1.5, 5.5],
    radius: 0.18,
    label: "SPL-R"
  },
  [FrontendRegion.InferiorParietal_L]: {
    pos: [-4, -2.5, 4],
    radius: 0.18,
    label: "IPL-L"
  },
  [FrontendRegion.InferiorParietal_R]: {
    pos: [4, -2.5, 4],
    radius: 0.18,
    label: "IPL-R"
  },
  [FrontendRegion.PrecuneusRegion_L]: {
    pos: [-1.5, -3, 5],
    radius: 0.17,
    label: "PCun-L"
  },
  [FrontendRegion.PrecuneusRegion_R]: {
    pos: [1.5, -3, 5],
    radius: 0.17,
    label: "PCun-R"
  },
  [FrontendRegion.AngularGyrus_L]: {
    pos: [-4.5, -3, 3.5],
    radius: 0.15,
    label: "AG-L"
  },
  [FrontendRegion.AngularGyrus_R]: {
    pos: [4.5, -3, 3.5],
    radius: 0.15,
    label: "AG-R"
  },
  [FrontendRegion.Supramarginal_L]: {
    pos: [-5, -2.5, 3.5],
    radius: 0.14,
    label: "SMG-L"
  },
  [FrontendRegion.Supramarginal_R]: {
    pos: [5, -2.5, 3.5],
    radius: 0.14,
    label: "SMG-R"
  },
  // Temporal lobe
  [FrontendRegion.SuperiorTemporalGyrus_L]: {
    pos: [-5.5, -1.5, 1.5],
    radius: 0.18,
    label: "STG-L"
  },
  [FrontendRegion.SuperiorTemporalGyrus_R]: {
    pos: [5.5, -1.5, 1.5],
    radius: 0.18,
    label: "STG-R"
  },
  [FrontendRegion.MiddleTemporalGyrus_L]: {
    pos: [-5.5, -2.5, 0.5],
    radius: 0.17,
    label: "MTG-L"
  },
  [FrontendRegion.MiddleTemporalGyrus_R]: {
    pos: [5.5, -2.5, 0.5],
    radius: 0.17,
    label: "MTG-R"
  },
  [FrontendRegion.InferiorTemporalGyrus_L]: {
    pos: [-5.5, -3, -0.5],
    radius: 0.16,
    label: "ITG-L"
  },
  [FrontendRegion.InferiorTemporalGyrus_R]: {
    pos: [5.5, -3, -0.5],
    radius: 0.16,
    label: "ITG-R"
  },
  [FrontendRegion.FusiformGyrus_L]: {
    pos: [-4.5, -3.5, -1.5],
    radius: 0.15,
    label: "FFG-L"
  },
  [FrontendRegion.FusiformGyrus_R]: {
    pos: [4.5, -3.5, -1.5],
    radius: 0.15,
    label: "FFG-R"
  },
  [FrontendRegion.TemporalPole_L]: {
    pos: [-4.5, 0, -3],
    radius: 0.15,
    label: "TP-L"
  },
  [FrontendRegion.TemporalPole_R]: {
    pos: [4.5, 0, -3],
    radius: 0.15,
    label: "TP-R"
  },
  [FrontendRegion.WernickeArea_L]: {
    pos: [-5, -2.5, 1.5],
    radius: 0.16,
    label: "WRN-L"
  },
  [FrontendRegion.WernickeArea_R]: {
    pos: [5, -2.5, 1.5],
    radius: 0.14,
    label: "WRN-R"
  },
  [FrontendRegion.PlanumTemporale_L]: {
    pos: [-5, -3, 1],
    radius: 0.14,
    label: "PT-L"
  },
  [FrontendRegion.PlanumTemporale_R]: {
    pos: [5, -3, 1],
    radius: 0.13,
    label: "PT-R"
  },
  // Occipital/Visual
  [FrontendRegion.PrimaryVisual_L]: {
    pos: [-1.5, -5.5, 1],
    radius: 0.2,
    label: "V1-L"
  },
  [FrontendRegion.PrimaryVisual_R]: {
    pos: [1.5, -5.5, 1],
    radius: 0.2,
    label: "V1-R"
  },
  [FrontendRegion.SecondaryVisual_L]: {
    pos: [-2.5, -5.5, 1.5],
    radius: 0.17,
    label: "V2-L"
  },
  [FrontendRegion.SecondaryVisual_R]: {
    pos: [2.5, -5.5, 1.5],
    radius: 0.17,
    label: "V2-R"
  },
  [FrontendRegion.V3Area_L]: {
    pos: [-2.8, -5.2, 2],
    radius: 0.15,
    label: "V3-L"
  },
  [FrontendRegion.V3Area_R]: {
    pos: [2.8, -5.2, 2],
    radius: 0.15,
    label: "V3-R"
  },
  [FrontendRegion.V4Area_L]: {
    pos: [-3, -5, 1.5],
    radius: 0.15,
    label: "V4-L"
  },
  [FrontendRegion.V4Area_R]: {
    pos: [3, -5, 1.5],
    radius: 0.15,
    label: "V4-R"
  },
  [FrontendRegion.MTArea_L]: {
    pos: [-4.5, -4.5, 1.5],
    radius: 0.14,
    label: "MT-L"
  },
  [FrontendRegion.MTArea_R]: {
    pos: [4.5, -4.5, 1.5],
    radius: 0.14,
    label: "MT-R"
  },
  [FrontendRegion.LingualGyrus_L]: {
    pos: [-2, -5.8, -0.5],
    radius: 0.14,
    label: "LG-L"
  },
  [FrontendRegion.LingualGyrus_R]: {
    pos: [2, -5.8, -0.5],
    radius: 0.14,
    label: "LG-R"
  },
  [FrontendRegion.OccipitalPole_L]: {
    pos: [-1.5, -6.5, 0],
    radius: 0.15,
    label: "OP-L"
  },
  [FrontendRegion.OccipitalPole_R]: {
    pos: [1.5, -6.5, 0],
    radius: 0.15,
    label: "OP-R"
  },
  // Cingulate
  [FrontendRegion.RostralACC_L]: {
    pos: [-0.8, 3.5, 1],
    radius: 0.14,
    label: "rACC-L"
  },
  [FrontendRegion.RostralACC_R]: {
    pos: [0.8, 3.5, 1],
    radius: 0.14,
    label: "rACC-R"
  },
  [FrontendRegion.CaudalACC_L]: {
    pos: [-0.8, 2.5, 3],
    radius: 0.13,
    label: "cACC-L"
  },
  [FrontendRegion.CaudalACC_R]: {
    pos: [0.8, 2.5, 3],
    radius: 0.13,
    label: "cACC-R"
  },
  [FrontendRegion.MidCingulate_L]: {
    pos: [-0.8, 1, 4],
    radius: 0.14,
    label: "MCC-L"
  },
  [FrontendRegion.MidCingulate_R]: {
    pos: [0.8, 1, 4],
    radius: 0.14,
    label: "MCC-R"
  },
  [FrontendRegion.PosteriorCingulate_L]: {
    pos: [-0.8, -1.5, 4],
    radius: 0.15,
    label: "PCC-L"
  },
  [FrontendRegion.PosteriorCingulate_R]: {
    pos: [0.8, -1.5, 4],
    radius: 0.15,
    label: "PCC-R"
  },
  [FrontendRegion.RetrosplenialArea_L]: {
    pos: [-1, -3, 3.5],
    radius: 0.13,
    label: "RSA-L"
  },
  [FrontendRegion.RetrosplenialArea_R]: {
    pos: [1, -3, 3.5],
    radius: 0.13,
    label: "RSA-R"
  },
  // Insula bilateral
  [FrontendRegion.AnteriorInsula_L]: {
    pos: [-3.5, 0.5, 0.5],
    radius: 0.15,
    label: "aINS-L"
  },
  [FrontendRegion.AnteriorInsula_R]: {
    pos: [3.5, 0.5, 0.5],
    radius: 0.15,
    label: "aINS-R"
  },
  [FrontendRegion.PosteriorInsula_L]: {
    pos: [-4, -1, 1.5],
    radius: 0.14,
    label: "pINS-L"
  },
  [FrontendRegion.PosteriorInsula_R]: {
    pos: [4, -1, 1.5],
    radius: 0.14,
    label: "pINS-R"
  },
  // Subcortical bilateral
  [FrontendRegion.Thalamus_L]: {
    pos: [-1, -0.5, 1],
    radius: 0.22,
    label: "THAL-L"
  },
  [FrontendRegion.Thalamus_R]: {
    pos: [1, -0.5, 1],
    radius: 0.22,
    label: "THAL-R"
  },
  [FrontendRegion.Caudate_L]: {
    pos: [-1.5, 1.5, 1.5],
    radius: 0.18,
    label: "CAU-L"
  },
  [FrontendRegion.Caudate_R]: {
    pos: [1.5, 1.5, 1.5],
    radius: 0.18,
    label: "CAU-R"
  },
  [FrontendRegion.Putamen_L]: {
    pos: [-2.5, 0.5, 1],
    radius: 0.2,
    label: "PUT-L"
  },
  [FrontendRegion.Putamen_R]: {
    pos: [2.5, 0.5, 1],
    radius: 0.2,
    label: "PUT-R"
  },
  [FrontendRegion.Pallidum_L]: {
    pos: [-1.8, 0, 0.5],
    radius: 0.15,
    label: "PAL-L"
  },
  [FrontendRegion.Pallidum_R]: {
    pos: [1.8, 0, 0.5],
    radius: 0.15,
    label: "PAL-R"
  },
  [FrontendRegion.Hippocampus_L]: {
    pos: [-2.5, -2, -0.5],
    radius: 0.2,
    label: "HIPP-L"
  },
  [FrontendRegion.Hippocampus_R]: {
    pos: [2.5, -2, -0.5],
    radius: 0.2,
    label: "HIPP-R"
  },
  [FrontendRegion.Amygdala_L]: {
    pos: [-2.5, -0.5, -1.5],
    radius: 0.17,
    label: "AMYG-L"
  },
  [FrontendRegion.Amygdala_R]: {
    pos: [2.5, -0.5, -1.5],
    radius: 0.17,
    label: "AMYG-R"
  },
  [FrontendRegion.Accumbens_L]: {
    pos: [-1, 1.2, -0.5],
    radius: 0.14,
    label: "NAc-L"
  },
  [FrontendRegion.Accumbens_R]: {
    pos: [1, 1.2, -0.5],
    radius: 0.14,
    label: "NAc-R"
  },
  [FrontendRegion.SubthalamicNucleus_R]: {
    pos: [1.2, -0.5, -0.5],
    radius: 0.12,
    label: "STN-R"
  },
  [FrontendRegion.LateralGeniculateBody_R]: {
    pos: [2, -2, -0.5],
    radius: 0.12,
    label: "LGB-R"
  },
  [FrontendRegion.MedialGeniculateBody_R]: {
    pos: [2, -2.5, -0.5],
    radius: 0.12,
    label: "MGB-R"
  },
  [FrontendRegion.ZonaIncerta_L]: {
    pos: [-1.2, -0.8, 0],
    radius: 0.1,
    label: "ZI-L"
  },
  [FrontendRegion.ZonaIncerta_R]: {
    pos: [1.2, -0.8, 0],
    radius: 0.1,
    label: "ZI-R"
  },
  [FrontendRegion.HabenularNucleus_L]: {
    pos: [-0.5, -1.5, 0.5],
    radius: 0.1,
    label: "HbN-L"
  },
  [FrontendRegion.HabenularNucleus_R]: {
    pos: [0.5, -1.5, 0.5],
    radius: 0.1,
    label: "HbN-R"
  },
  // Cerebellar lobules
  [FrontendRegion.CerebellarLobule_I_IV]: {
    pos: [0, -4.5, -4],
    radius: 0.22,
    label: "Cb-I-IV"
  },
  [FrontendRegion.CerebellarLobule_V]: {
    pos: [0, -4.8, -3.5],
    radius: 0.22,
    label: "Cb-V"
  },
  [FrontendRegion.CerebellarLobule_VI]: {
    pos: [-1.5, -5, -4],
    radius: 0.25,
    label: "Cb-VI"
  },
  [FrontendRegion.CerebellarLobule_VIIa]: {
    pos: [-2, -5.5, -4.5],
    radius: 0.22,
    label: "Cb-VIIa"
  },
  [FrontendRegion.CerebellarLobule_VIIb]: {
    pos: [-1.5, -5.5, -4],
    radius: 0.2,
    label: "Cb-VIIb"
  },
  [FrontendRegion.CerebellarLobule_VIII]: {
    pos: [1.5, -5.5, -4],
    radius: 0.2,
    label: "Cb-VIII"
  },
  [FrontendRegion.CerebellarLobule_IX]: {
    pos: [2, -5.5, -4.5],
    radius: 0.2,
    label: "Cb-IX"
  },
  [FrontendRegion.CerebellarLobule_X]: {
    pos: [0, -5, -5],
    radius: 0.18,
    label: "Cb-X"
  },
  [FrontendRegion.CerebellarVermis]: {
    pos: [0, -5, -4.5],
    radius: 0.22,
    label: "Cb-Verm"
  },
  // Brainstem / relay
  [FrontendRegion.PontineTegmentum]: {
    pos: [0, -3.5, -3.5],
    radius: 0.18,
    label: "PonTeg"
  },
  [FrontendRegion.MedullaryReticular]: {
    pos: [0, -4.5, -5],
    radius: 0.16,
    label: "MedRet"
  },
  [FrontendRegion.SpleniumCorpusCallosum]: {
    pos: [0, -2, 3],
    radius: 0.18,
    label: "SpCC"
  }
};
const REGION_NEURON_COUNTS = {
  [Region.Cerebellum]: 28e3,
  [Region.PrefrontalCortex]: 1e4,
  [FrontendRegion.VisualCortex]: 9e3,
  [Region.MotorCortex]: 7e3,
  [Region.SensoryCortex]: 7e3,
  [Region.Thalamus]: 5500,
  [Region.Hippocampus]: 5e3,
  [Region.BasalGanglia]: 4500,
  [FrontendRegion.AuditoryCortex]: 4e3,
  [FrontendRegion.AnteriorCingulateCortex]: 3500,
  [FrontendRegion.Insula]: 3e3,
  [FrontendRegion.OrbitalFrontalCortex]: 3e3,
  [Region.Amygdala]: 2500,
  [Region.Brainstem]: 2e3,
  [FrontendRegion.Hypothalamus]: 1800,
  [FrontendRegion.NucleusAccumbens]: 1500,
  [FrontendRegion.OlfactoryBulb]: 1200,
  // New sub-regions
  [FrontendRegion.CA1]: 1400,
  [FrontendRegion.CA3]: 1200,
  [FrontendRegion.DentateGyrus]: 1e3,
  [FrontendRegion.PurkinjeLayer]: 2200,
  [FrontendRegion.DeepCerebellarNuclei]: 900,
  [FrontendRegion.MedialdorsalThalamus]: 1100,
  [FrontendRegion.PulvinarThalamus]: 1100,
  [FrontendRegion.ParietalCortex]: 3500,
  [FrontendRegion.TemporalCortex]: 3500,
  [FrontendRegion.CingulateMotorArea]: 1800,
  [FrontendRegion.Claustrum]: 800,
  [FrontendRegion.LateralHabenula]: 600,
  [FrontendRegion.SubstantiaNigra]: 1e3,
  // 10 new regions
  [FrontendRegion.SuperiorTemporalSulcus]: 1200,
  [FrontendRegion.DorsalACC]: 900,
  [FrontendRegion.VentralTegmentalArea]: 700,
  [FrontendRegion.LocusCoeruleus]: 400,
  [FrontendRegion.RapheNuclei]: 500,
  [FrontendRegion.VentralStriatum]: 1e3,
  [FrontendRegion.EntorhinalCortex]: 800,
  [FrontendRegion.PerirhinalCortex]: 600,
  [FrontendRegion.SupplementaryMotorArea]: 1100,
  [FrontendRegion.VentralPallidum]: 600,
  // 5 new regions (45-region expansion)
  [FrontendRegion.SpinoCerebellarTract]: 3500,
  [FrontendRegion.PeriaqueductalGray]: 700,
  [FrontendRegion.BedNucleusStria]: 500,
  [FrontendRegion.MedialSeptum]: 400,
  [FrontendRegion.RetroSplenialCortex]: 900
};
function activityToColor(activity) {
  if (activity < 0.25) {
    const t2 = activity / 0.25;
    return new Color().setHSL(
      0.62 - t2 * 0.05,
      0.7 + t2 * 0.1,
      0.15 + t2 * 0.15
    );
  }
  if (activity < 0.5) {
    const t2 = (activity - 0.25) / 0.25;
    return new Color().setHSL(0.57 - t2 * 0.1, 0.8, 0.3 + t2 * 0.2);
  }
  if (activity < 0.75) {
    const t2 = (activity - 0.5) / 0.25;
    return new Color().setHSL(0.47 - t2 * 0.23, 0.9, 0.5 + t2 * 0.1);
  }
  const t = (activity - 0.75) / 0.25;
  return new Color().setHSL(0.24 - t * 0.24, 1, 0.6 - t * 0.1);
}
function activityToEmissiveIntensity(activity) {
  return 0.2 + activity * 2.5;
}
const CIRCUIT_COLORS = {
  motor: "#ff6b35",
  sensory: "#00d4ff",
  memory: "#a855f7",
  limbic: "#ec4899",
  regulatory: "#22c55e",
  callosal: "#fbbf24",
  ascending: "#c0d8ff",
  descending: "#f59e0b",
  cognitive: "#3b82f6"
};
const CIRCUIT_LEGEND = [
  { type: "callosal", label: "Corpus Callosum" },
  { type: "motor", label: "Motor Circuit" },
  { type: "sensory", label: "Sensory Circuit" },
  { type: "memory", label: "Memory / Hippocampal" },
  { type: "limbic", label: "Limbic / Emotion" },
  { type: "regulatory", label: "Regulatory / ANS" },
  { type: "ascending", label: "Ascending Arousal" },
  { type: "cognitive", label: "Cognitive / Default" }
];
function normalizePos(pos) {
  const maxAbs = Math.max(Math.abs(pos[0]), Math.abs(pos[1]), Math.abs(pos[2]));
  const scale = maxAbs < 3.5 ? 3.5 : 1;
  return [pos[0] * scale, pos[1] * scale, pos[2] * scale];
}
function RegionSphere({ region, activity, saturationFlag }) {
  const meshRef = reactExports.useRef(null);
  const config = REGION_CONFIGS[region];
  const DEFAULT_CONFIG = {
    pos: [0, 0, 0],
    radius: 0.12
  };
  const cfg = config ?? DEFAULT_CONFIG;
  const isSaturated = saturationFlag ?? activity >= SATURATION_THRESHOLD;
  const color = reactExports.useMemo(
    () => isSaturated ? new Color().setStyle("oklch(0.75 0.18 55)") : activityToColor(activity),
    [activity, isSaturated]
  );
  const emissiveIntensity = activityToEmissiveIntensity(activity);
  const hemiTint = reactExports.useMemo(() => {
    const nx = normalizePos(cfg.pos)[0];
    if (nx < -2) return new Color(0.3, 0.5, 1);
    if (nx > 2) return new Color(1, 0.55, 0.3);
    return new Color(0.8, 0.8, 0.9);
  }, [cfg.pos]);
  useFrame((state) => {
    if (!meshRef.current) return;
    if (isSaturated) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3.5) * 0.08;
      meshRef.current.scale.setScalar(pulse);
    } else if (activity > 0.5) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * (4 + activity * 4)) * 0.05 * activity;
      meshRef.current.scale.setScalar(scale);
    } else {
      meshRef.current.scale.setScalar(1);
    }
  });
  const glowColor = reactExports.useMemo(() => {
    if (isSaturated) return new Color().setStyle("oklch(0.75 0.18 55)");
    const c = activityToColor(activity);
    c.lerp(hemiTint, 0.18);
    return c;
  }, [activity, hemiTint, isSaturated]);
  const scaledRadius = cfg.radius * 1.15;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("group", { position: normalizePos(cfg.pos), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { ref: meshRef, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("sphereGeometry", { args: [scaledRadius, 32, 32] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "meshStandardMaterial",
        {
          color,
          emissive: color,
          emissiveIntensity,
          roughness: 0.4,
          metalness: 0.3,
          transparent: true,
          opacity: 0.88
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("sphereGeometry", { args: [scaledRadius * 1.75, 16, 16] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "meshStandardMaterial",
        {
          color: glowColor,
          emissive: glowColor,
          emissiveIntensity: emissiveIntensity * 0.25,
          transparent: true,
          opacity: 0.06 + activity * 0.14,
          side: BackSide
        }
      )
    ] })
  ] });
}
function MicroNeuronCloud({ region, activity }) {
  const configRaw = REGION_CONFIGS[region];
  const countRaw = REGION_NEURON_COUNTS[region];
  const config = configRaw ?? {
    pos: [0, 0, 0],
    radius: 0.12
  };
  const count = countRaw ?? 100;
  const pointsRef = reactExports.useRef(null);
  const phasesRef = reactExports.useRef(null);
  const { geometry, material } = reactExports.useMemo(() => {
    const radius = config.radius * 1.8;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = radius * Math.cbrt(Math.random());
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      phases[i * 3] = Math.random() * Math.PI * 2;
      phases[i * 3 + 1] = Math.random() * Math.PI * 2;
      phases[i * 3 + 2] = Math.random() * Math.PI * 2;
    }
    phasesRef.current = phases;
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(positions, 3));
    const pointSize = count > 1e4 ? 0.01 : count > 3e3 ? 0.013 : 0.016;
    const initialColor = activityToColor(0);
    const mat = new PointsMaterial({
      size: pointSize,
      color: initialColor,
      transparent: true,
      opacity: 0.3,
      blending: AdditiveBlending,
      depthWrite: false
    });
    return { geometry: geo, material: mat };
  }, [config.radius, count]);
  reactExports.useMemo(() => {
    const c = activityToColor(activity);
    material.color.set(c);
    material.opacity = 0.22 + activity * 0.28;
  }, [activity, material]);
  useFrame((state) => {
    if (!pointsRef.current || !phasesRef.current) return;
    if (count > 2e3) return;
    const positions = pointsRef.current.geometry.attributes.position.array;
    const phases = phasesRef.current;
    const t = state.clock.elapsedTime * 0.12;
    const radius = config.radius * 1.8;
    for (let i = 0; i < count; i++) {
      const px = phases[i * 3];
      const py = phases[i * 3 + 1];
      const pz = phases[i * 3 + 2];
      const drift = 0.02 * activity;
      positions[i * 3] += Math.sin(t + px) * drift * 0.1;
      positions[i * 3 + 1] += Math.cos(t + py) * drift * 0.1;
      positions[i * 3 + 2] += Math.sin(t + pz) * drift * 0.1;
      const dx = positions[i * 3];
      const dy = positions[i * 3 + 1];
      const dz = positions[i * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist > radius) {
        const factor = radius / dist;
        positions[i * 3] *= factor;
        positions[i * 3 + 1] *= factor;
        positions[i * 3 + 2] *= factor;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("group", { position: normalizePos(config.pos), children: /* @__PURE__ */ jsxRuntimeExports.jsx("points", { ref: pointsRef, geometry, material }) });
}
function SynapticDensityField() {
  const pointsRef = reactExports.useRef(null);
  const count = 15e3;
  const { geometry, material } = reactExports.useMemo(() => {
    const positions = new Float32Array(count * 3);
    const radius = 7.5;
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = radius * Math.cbrt(Math.random());
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(positions, 3));
    const mat = new PointsMaterial({
      size: 0.01,
      color: new Color(0.04, 0.1, 0.32),
      transparent: true,
      opacity: 0.4,
      blending: AdditiveBlending,
      depthWrite: false
    });
    return { geometry: geo, material: mat };
  }, []);
  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.035;
    pointsRef.current.rotation.x += delta * 0.012;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("points", { ref: pointsRef, geometry, material });
}
function WeightedConnectionArc({
  from,
  to,
  activity,
  weight,
  circuitType,
  isCallosal = false
}) {
  const pulseRef = reactExports.useRef(null);
  const pulseRef2 = reactExports.useRef(null);
  const localTime = reactExports.useRef(Math.random() * 10);
  const { tubeGeo, curve } = reactExports.useMemo(() => {
    const start = new Vector3(...from);
    const end = new Vector3(...to);
    const mid = new Vector3().addVectors(start, end).multiplyScalar(0.5);
    const dist = start.distanceTo(end);
    if (isCallosal) {
      mid.y += Math.max(5, dist * 0.4);
      mid.x = 0;
    } else {
      mid.y += Math.max(1.5, dist * 0.28);
    }
    const c = new QuadraticBezierCurve3(start, mid, end);
    const tubeRadius = isCallosal ? 0.045 : circuitType === "ascending" ? 0.035 : 8e-3 + weight * 0.042;
    const segments = isCallosal ? 28 : 20;
    return {
      tubeGeo: new TubeGeometry(c, segments, tubeRadius, 5, false),
      curve: c
    };
  }, [from, to, weight, isCallosal, circuitType]);
  const threeColor = reactExports.useMemo(
    () => new Color(CIRCUIT_COLORS[circuitType] ?? CIRCUIT_COLORS.cognitive),
    [circuitType]
  );
  const pulseSpeed = circuitType === "ascending" ? (0.5 + weight * 2.2) * 2 : 0.5 + weight * 2.2;
  useFrame((_, delta) => {
    localTime.current += delta;
    if (pulseRef.current) {
      const t = localTime.current * pulseSpeed % 1;
      const pt = curve.getPoint(t);
      pulseRef.current.position.set(pt.x, pt.y, pt.z);
    }
    if (isCallosal && pulseRef2.current) {
      const t2 = 1 - (localTime.current * pulseSpeed + 0.5) % 1;
      const pt2 = curve.getPoint(t2);
      pulseRef2.current.position.set(pt2.x, pt2.y, pt2.z);
    }
  });
  const opacity = Math.min(1, 0.35 + weight * 0.65 + activity * 0.2);
  const emissiveInt = (isCallosal ? 2 : circuitType === "ascending" ? 2.5 : 0.4 + weight * 1.2) + activity * 1.5;
  const pulseSize = 0.025 + weight * 0.025;
  const showPulse = activity > 0.08 || weight > 0.5;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("group", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("mesh", { geometry: tubeGeo, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "meshStandardMaterial",
      {
        color: threeColor,
        emissive: threeColor,
        emissiveIntensity: emissiveInt,
        transparent: true,
        opacity,
        roughness: 0.35,
        metalness: 0.1,
        blending: AdditiveBlending,
        depthWrite: false
      }
    ) }),
    showPulse && /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { ref: pulseRef, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "sphereGeometry",
        {
          args: [isCallosal ? pulseSize * 1.4 : pulseSize, 6, 6]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "meshStandardMaterial",
        {
          color: threeColor,
          emissive: threeColor,
          emissiveIntensity: isCallosal ? 8 : circuitType === "ascending" ? 9 : 5 + weight * 3,
          transparent: true,
          opacity: 0.9 + activity * 0.1,
          blending: AdditiveBlending,
          depthWrite: false
        }
      )
    ] }),
    isCallosal && showPulse && /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { ref: pulseRef2, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("sphereGeometry", { args: [pulseSize * 1.2, 6, 6] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "meshStandardMaterial",
        {
          color: threeColor,
          emissive: threeColor,
          emissiveIntensity: 7,
          transparent: true,
          opacity: 0.85,
          blending: AdditiveBlending,
          depthWrite: false
        }
      )
    ] })
  ] });
}
function MidlinePlane() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { rotation: [0, Math.PI / 2, 0], position: [0, 0, 0], children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("planeGeometry", { args: [20, 20] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "meshStandardMaterial",
      {
        color: new Color(0.3, 0.4, 0.8),
        transparent: true,
        opacity: 0.025,
        side: DoubleSide,
        depthWrite: false
      }
    )
  ] });
}
function HemisphereGlow() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [-4, 0, 1.5], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("sphereGeometry", { args: [9.5, 16, 16] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "meshStandardMaterial",
        {
          color: new Color(0.1, 0.22, 0.95),
          transparent: true,
          opacity: 0.038,
          side: BackSide,
          depthWrite: false
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [-4, 0, 1.5], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("sphereGeometry", { args: [7, 12, 12] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "meshStandardMaterial",
        {
          color: new Color(0.15, 0.35, 1),
          transparent: true,
          opacity: 0.022,
          side: BackSide,
          depthWrite: false
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [4, 0, 1.5], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("sphereGeometry", { args: [9.5, 16, 16] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "meshStandardMaterial",
        {
          color: new Color(0.95, 0.45, 0.1),
          transparent: true,
          opacity: 0.038,
          side: BackSide,
          depthWrite: false
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [4, 0, 1.5], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("sphereGeometry", { args: [7, 12, 12] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "meshStandardMaterial",
        {
          color: new Color(1, 0.5, 0.15),
          transparent: true,
          opacity: 0.022,
          side: BackSide,
          depthWrite: false
        }
      )
    ] })
  ] });
}
const WEIGHTED_CONNECTIONS = [
  // ── LEFT INTRA-HEMISPHERE ────────────────────────────────────────────────
  // Frontal hierarchy L
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.SuperiorFrontal_L,
    weight: 0.82,
    circuitType: "cognitive"
  },
  {
    from: FrontendRegion.SuperiorFrontal_L,
    to: FrontendRegion.MiddleFrontal_L,
    weight: 0.78,
    circuitType: "cognitive"
  },
  {
    from: FrontendRegion.MiddleFrontal_L,
    to: FrontendRegion.InferiorFrontal_L,
    weight: 0.72,
    circuitType: "cognitive"
  },
  {
    from: FrontendRegion.MiddleFrontal_L,
    to: FrontendRegion.PreMotorCortex_L,
    weight: 0.8,
    circuitType: "motor"
  },
  {
    from: FrontendRegion.PreMotorCortex_L,
    to: FrontendRegion.PrimaryMotorCortex_L,
    weight: 0.88,
    circuitType: "motor"
  },
  {
    from: FrontendRegion.PrimaryMotorCortex_L,
    to: FrontendRegion.Thalamus_L,
    weight: 0.86,
    circuitType: "motor"
  },
  // Frontal-parietal L
  {
    from: FrontendRegion.SuperiorFrontal_L,
    to: FrontendRegion.SuperiorParietal_L,
    weight: 0.74,
    circuitType: "cognitive"
  },
  {
    from: FrontendRegion.MiddleFrontal_L,
    to: FrontendRegion.InferiorParietal_L,
    weight: 0.68,
    circuitType: "cognitive"
  },
  {
    from: FrontendRegion.PrimaryMotorCortex_L,
    to: FrontendRegion.PrimarySomatosensory_L,
    weight: 0.9,
    circuitType: "sensory"
  },
  // Frontal-temporal L
  {
    from: FrontendRegion.InferiorFrontal_L,
    to: FrontendRegion.SuperiorTemporalGyrus_L,
    weight: 0.76,
    circuitType: "memory"
  },
  {
    from: FrontendRegion.BrocaArea_L,
    to: FrontendRegion.WernickeArea_L,
    weight: 0.88,
    circuitType: "memory"
  },
  {
    from: FrontendRegion.MiddleFrontal_L,
    to: FrontendRegion.MiddleTemporalGyrus_L,
    weight: 0.65,
    circuitType: "cognitive"
  },
  // Frontal-limbic L
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.Hippocampus_L,
    weight: 0.84,
    circuitType: "memory"
  },
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.Amygdala_L,
    weight: 0.8,
    circuitType: "limbic"
  },
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.AnteriorInsula_L,
    weight: 0.74,
    circuitType: "limbic"
  },
  {
    from: FrontendRegion.VentralMPFC_L,
    to: FrontendRegion.Amygdala_L,
    weight: 0.78,
    circuitType: "limbic"
  },
  // Parietal-temporal L
  {
    from: FrontendRegion.InferiorParietal_L,
    to: FrontendRegion.SuperiorTemporalGyrus_L,
    weight: 0.72,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.AngularGyrus_L,
    to: FrontendRegion.MiddleTemporalGyrus_L,
    weight: 0.75,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.Supramarginal_L,
    to: FrontendRegion.WernickeArea_L,
    weight: 0.7,
    circuitType: "sensory"
  },
  // Parietal-occipital L
  {
    from: FrontendRegion.SuperiorParietal_L,
    to: FrontendRegion.PrecuneusRegion_L,
    weight: 0.78,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.InferiorParietal_L,
    to: FrontendRegion.MTArea_L,
    weight: 0.72,
    circuitType: "sensory"
  },
  // Temporal-occipital L
  {
    from: FrontendRegion.InferiorTemporalGyrus_L,
    to: FrontendRegion.FusiformGyrus_L,
    weight: 0.78,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.FusiformGyrus_L,
    to: FrontendRegion.PrimaryVisual_L,
    weight: 0.7,
    circuitType: "sensory"
  },
  // Hippocampal circuit L
  {
    from: FrontendRegion.Hippocampus_L,
    to: FrontendRegion.Amygdala_L,
    weight: 0.84,
    circuitType: "limbic"
  },
  {
    from: FrontendRegion.Hippocampus_L,
    to: FrontendRegion.PosteriorCingulate_L,
    weight: 0.78,
    circuitType: "memory"
  },
  // Default mode L
  {
    from: FrontendRegion.PosteriorCingulate_L,
    to: FrontendRegion.PrecuneusRegion_L,
    weight: 0.8,
    circuitType: "cognitive"
  },
  {
    from: FrontendRegion.PosteriorCingulate_L,
    to: FrontendRegion.MedialPFC_L,
    weight: 0.84,
    circuitType: "cognitive"
  },
  {
    from: FrontendRegion.PrecuneusRegion_L,
    to: FrontendRegion.AngularGyrus_L,
    weight: 0.76,
    circuitType: "cognitive"
  },
  // Thalamocortical L
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.PrimarySomatosensory_L,
    weight: 0.88,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.PrimaryMotorCortex_L,
    weight: 0.86,
    circuitType: "motor"
  },
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.AnteriorInsula_L,
    weight: 0.74,
    circuitType: "regulatory"
  },
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.Hippocampus_L,
    weight: 0.76,
    circuitType: "memory"
  },
  // Basal ganglia loop L
  {
    from: FrontendRegion.Caudate_L,
    to: FrontendRegion.Putamen_L,
    weight: 0.82,
    circuitType: "motor"
  },
  {
    from: FrontendRegion.Putamen_L,
    to: FrontendRegion.Pallidum_L,
    weight: 0.8,
    circuitType: "motor"
  },
  {
    from: FrontendRegion.Pallidum_L,
    to: FrontendRegion.Thalamus_L,
    weight: 0.86,
    circuitType: "motor"
  },
  // Cingulate chain L
  {
    from: FrontendRegion.RostralACC_L,
    to: FrontendRegion.CaudalACC_L,
    weight: 0.78,
    circuitType: "regulatory"
  },
  {
    from: FrontendRegion.CaudalACC_L,
    to: FrontendRegion.MidCingulate_L,
    weight: 0.75,
    circuitType: "regulatory"
  },
  {
    from: FrontendRegion.MidCingulate_L,
    to: FrontendRegion.PosteriorCingulate_L,
    weight: 0.72,
    circuitType: "regulatory"
  },
  // Insula L
  {
    from: FrontendRegion.AnteriorInsula_L,
    to: FrontendRegion.PosteriorInsula_L,
    weight: 0.8,
    circuitType: "regulatory"
  },
  {
    from: FrontendRegion.AnteriorInsula_L,
    to: FrontendRegion.Amygdala_L,
    weight: 0.78,
    circuitType: "limbic"
  },
  // Visual hierarchy L
  {
    from: FrontendRegion.PrimaryVisual_L,
    to: FrontendRegion.SecondaryVisual_L,
    weight: 0.88,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.SecondaryVisual_L,
    to: FrontendRegion.V4Area_L,
    weight: 0.8,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.V4Area_L,
    to: FrontendRegion.FusiformGyrus_L,
    weight: 0.76,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.MTArea_L,
    to: FrontendRegion.SuperiorParietal_L,
    weight: 0.74,
    circuitType: "sensory"
  },
  // Temporal pole L
  {
    from: FrontendRegion.TemporalPole_L,
    to: FrontendRegion.Amygdala_L,
    weight: 0.72,
    circuitType: "limbic"
  },
  {
    from: FrontendRegion.TemporalPole_L,
    to: FrontendRegion.Hippocampus_L,
    weight: 0.74,
    circuitType: "memory"
  },
  // ── RIGHT INTRA-HEMISPHERE ───────────────────────────────────────────────
  {
    from: FrontendRegion.MedialPFC_R,
    to: FrontendRegion.SuperiorFrontal_R,
    weight: 0.82,
    circuitType: "cognitive"
  },
  {
    from: FrontendRegion.SuperiorFrontal_R,
    to: FrontendRegion.MiddleFrontal_R,
    weight: 0.78,
    circuitType: "cognitive"
  },
  {
    from: FrontendRegion.MiddleFrontal_R,
    to: FrontendRegion.InferiorFrontal_R,
    weight: 0.72,
    circuitType: "cognitive"
  },
  {
    from: FrontendRegion.MiddleFrontal_R,
    to: FrontendRegion.PreMotorCortex_R,
    weight: 0.8,
    circuitType: "motor"
  },
  {
    from: FrontendRegion.PreMotorCortex_R,
    to: FrontendRegion.PrimaryMotorCortex_R,
    weight: 0.88,
    circuitType: "motor"
  },
  {
    from: FrontendRegion.PrimaryMotorCortex_R,
    to: FrontendRegion.Thalamus_R,
    weight: 0.86,
    circuitType: "motor"
  },
  {
    from: FrontendRegion.SuperiorFrontal_R,
    to: FrontendRegion.SuperiorParietal_R,
    weight: 0.74,
    circuitType: "cognitive"
  },
  {
    from: FrontendRegion.MiddleFrontal_R,
    to: FrontendRegion.InferiorParietal_R,
    weight: 0.68,
    circuitType: "cognitive"
  },
  {
    from: FrontendRegion.PrimaryMotorCortex_R,
    to: FrontendRegion.PrimarySomatosensory_R,
    weight: 0.9,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.InferiorFrontal_R,
    to: FrontendRegion.SuperiorTemporalGyrus_R,
    weight: 0.76,
    circuitType: "memory"
  },
  {
    from: FrontendRegion.MedialPFC_R,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.84,
    circuitType: "memory"
  },
  {
    from: FrontendRegion.MedialPFC_R,
    to: FrontendRegion.Amygdala_R,
    weight: 0.8,
    circuitType: "limbic"
  },
  {
    from: FrontendRegion.MedialPFC_R,
    to: FrontendRegion.AnteriorInsula_R,
    weight: 0.74,
    circuitType: "limbic"
  },
  {
    from: FrontendRegion.VentralMPFC_R,
    to: FrontendRegion.Amygdala_R,
    weight: 0.78,
    circuitType: "limbic"
  },
  {
    from: FrontendRegion.InferiorParietal_R,
    to: FrontendRegion.SuperiorTemporalGyrus_R,
    weight: 0.72,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.AngularGyrus_R,
    to: FrontendRegion.MiddleTemporalGyrus_R,
    weight: 0.75,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.Supramarginal_R,
    to: FrontendRegion.SuperiorTemporalGyrus_R,
    weight: 0.68,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.SuperiorParietal_R,
    to: FrontendRegion.PrecuneusRegion_R,
    weight: 0.78,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.InferiorParietal_R,
    to: FrontendRegion.MTArea_R,
    weight: 0.72,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.InferiorTemporalGyrus_R,
    to: FrontendRegion.FusiformGyrus_R,
    weight: 0.78,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.FusiformGyrus_R,
    to: FrontendRegion.PrimaryVisual_R,
    weight: 0.7,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.Hippocampus_R,
    to: FrontendRegion.Amygdala_R,
    weight: 0.84,
    circuitType: "limbic"
  },
  {
    from: FrontendRegion.Hippocampus_R,
    to: FrontendRegion.PosteriorCingulate_R,
    weight: 0.78,
    circuitType: "memory"
  },
  {
    from: FrontendRegion.PosteriorCingulate_R,
    to: FrontendRegion.PrecuneusRegion_R,
    weight: 0.8,
    circuitType: "cognitive"
  },
  {
    from: FrontendRegion.PosteriorCingulate_R,
    to: FrontendRegion.MedialPFC_R,
    weight: 0.84,
    circuitType: "cognitive"
  },
  {
    from: FrontendRegion.PrecuneusRegion_R,
    to: FrontendRegion.AngularGyrus_R,
    weight: 0.76,
    circuitType: "cognitive"
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.PrimarySomatosensory_R,
    weight: 0.88,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.PrimaryMotorCortex_R,
    weight: 0.86,
    circuitType: "motor"
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.AnteriorInsula_R,
    weight: 0.74,
    circuitType: "regulatory"
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.76,
    circuitType: "memory"
  },
  {
    from: FrontendRegion.Caudate_R,
    to: FrontendRegion.Putamen_R,
    weight: 0.82,
    circuitType: "motor"
  },
  {
    from: FrontendRegion.Putamen_R,
    to: FrontendRegion.Pallidum_R,
    weight: 0.8,
    circuitType: "motor"
  },
  {
    from: FrontendRegion.Pallidum_R,
    to: FrontendRegion.Thalamus_R,
    weight: 0.86,
    circuitType: "motor"
  },
  {
    from: FrontendRegion.RostralACC_R,
    to: FrontendRegion.CaudalACC_R,
    weight: 0.78,
    circuitType: "regulatory"
  },
  {
    from: FrontendRegion.CaudalACC_R,
    to: FrontendRegion.MidCingulate_R,
    weight: 0.75,
    circuitType: "regulatory"
  },
  {
    from: FrontendRegion.MidCingulate_R,
    to: FrontendRegion.PosteriorCingulate_R,
    weight: 0.72,
    circuitType: "regulatory"
  },
  {
    from: FrontendRegion.AnteriorInsula_R,
    to: FrontendRegion.PosteriorInsula_R,
    weight: 0.8,
    circuitType: "regulatory"
  },
  {
    from: FrontendRegion.AnteriorInsula_R,
    to: FrontendRegion.Amygdala_R,
    weight: 0.78,
    circuitType: "limbic"
  },
  {
    from: FrontendRegion.PrimaryVisual_R,
    to: FrontendRegion.SecondaryVisual_R,
    weight: 0.88,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.SecondaryVisual_R,
    to: FrontendRegion.V4Area_R,
    weight: 0.8,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.V4Area_R,
    to: FrontendRegion.FusiformGyrus_R,
    weight: 0.76,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.MTArea_R,
    to: FrontendRegion.SuperiorParietal_R,
    weight: 0.74,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.TemporalPole_R,
    to: FrontendRegion.Amygdala_R,
    weight: 0.72,
    circuitType: "limbic"
  },
  {
    from: FrontendRegion.TemporalPole_R,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.74,
    circuitType: "memory"
  },
  // ── CORPUS CALLOSUM (inter-hemispheric, gold arcs) ───────────────────────
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.MedialPFC_R,
    weight: 0.9,
    circuitType: "callosal",
    isCallosal: true
  },
  {
    from: FrontendRegion.MiddleFrontal_L,
    to: FrontendRegion.MiddleFrontal_R,
    weight: 0.84,
    circuitType: "callosal",
    isCallosal: true
  },
  {
    from: FrontendRegion.SuperiorFrontal_L,
    to: FrontendRegion.SuperiorFrontal_R,
    weight: 0.82,
    circuitType: "callosal",
    isCallosal: true
  },
  {
    from: FrontendRegion.PrimaryMotorCortex_L,
    to: FrontendRegion.PrimaryMotorCortex_R,
    weight: 0.9,
    circuitType: "callosal",
    isCallosal: true
  },
  {
    from: FrontendRegion.PrimarySomatosensory_L,
    to: FrontendRegion.PrimarySomatosensory_R,
    weight: 0.88,
    circuitType: "callosal",
    isCallosal: true
  },
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.Thalamus_R,
    weight: 0.88,
    circuitType: "callosal",
    isCallosal: true
  },
  {
    from: FrontendRegion.Hippocampus_L,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.82,
    circuitType: "callosal",
    isCallosal: true
  },
  {
    from: FrontendRegion.Amygdala_L,
    to: FrontendRegion.Amygdala_R,
    weight: 0.78,
    circuitType: "callosal",
    isCallosal: true
  },
  {
    from: FrontendRegion.PosteriorCingulate_L,
    to: FrontendRegion.PosteriorCingulate_R,
    weight: 0.86,
    circuitType: "callosal",
    isCallosal: true
  },
  {
    from: FrontendRegion.PrecuneusRegion_L,
    to: FrontendRegion.PrecuneusRegion_R,
    weight: 0.84,
    circuitType: "callosal",
    isCallosal: true
  },
  {
    from: FrontendRegion.InferiorParietal_L,
    to: FrontendRegion.InferiorParietal_R,
    weight: 0.8,
    circuitType: "callosal",
    isCallosal: true
  },
  {
    from: FrontendRegion.SuperiorTemporalGyrus_L,
    to: FrontendRegion.SuperiorTemporalGyrus_R,
    weight: 0.78,
    circuitType: "callosal",
    isCallosal: true
  },
  {
    from: FrontendRegion.PrimaryVisual_L,
    to: FrontendRegion.PrimaryVisual_R,
    weight: 0.86,
    circuitType: "callosal",
    isCallosal: true
  },
  {
    from: FrontendRegion.AnteriorInsula_L,
    to: FrontendRegion.AnteriorInsula_R,
    weight: 0.74,
    circuitType: "callosal",
    isCallosal: true
  },
  {
    from: FrontendRegion.Caudate_L,
    to: FrontendRegion.Caudate_R,
    weight: 0.76,
    circuitType: "callosal",
    isCallosal: true
  },
  {
    from: FrontendRegion.RostralACC_L,
    to: FrontendRegion.RostralACC_R,
    weight: 0.8,
    circuitType: "callosal",
    isCallosal: true
  },
  // ── DENSE FRONTAL LOBE INTERNAL WIRING (L+R) ────────────────────────────────
  {
    from: FrontendRegion.ParsOrbitalis_L,
    to: FrontendRegion.VentralMPFC_L,
    weight: 0.82,
    circuitType: "cognitive"
  },
  {
    from: FrontendRegion.DorsalMPFC_L,
    to: FrontendRegion.MiddleFrontal_L,
    weight: 0.78,
    circuitType: "cognitive"
  },
  {
    from: FrontendRegion.VentralMPFC_L,
    to: FrontendRegion.RostralACC_L,
    weight: 0.84,
    circuitType: "regulatory"
  },
  {
    from: FrontendRegion.FrontalPole_L,
    to: FrontendRegion.DorsalMPFC_L,
    weight: 0.76,
    circuitType: "cognitive"
  },
  {
    from: FrontendRegion.BrocaArea_L,
    to: FrontendRegion.ParsOrbitalis_L,
    weight: 0.72,
    circuitType: "cognitive"
  },
  {
    from: FrontendRegion.ParsOrbitalis_R,
    to: FrontendRegion.VentralMPFC_R,
    weight: 0.82,
    circuitType: "cognitive"
  },
  {
    from: FrontendRegion.DorsalMPFC_R,
    to: FrontendRegion.MiddleFrontal_R,
    weight: 0.78,
    circuitType: "cognitive"
  },
  {
    from: FrontendRegion.VentralMPFC_R,
    to: FrontendRegion.RostralACC_R,
    weight: 0.84,
    circuitType: "regulatory"
  },
  // ── TEMPORAL LOBE DENSE WIRING (L+R) ─────────────────────────────────────────
  {
    from: FrontendRegion.SuperiorTemporalGyrus_L,
    to: FrontendRegion.MiddleTemporalGyrus_L,
    weight: 0.8,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.MiddleTemporalGyrus_L,
    to: FrontendRegion.InferiorTemporalGyrus_L,
    weight: 0.76,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.WernickeArea_L,
    to: FrontendRegion.MiddleTemporalGyrus_L,
    weight: 0.85,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.SuperiorTemporalGyrus_R,
    to: FrontendRegion.MiddleTemporalGyrus_R,
    weight: 0.8,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.MiddleTemporalGyrus_R,
    to: FrontendRegion.InferiorTemporalGyrus_R,
    weight: 0.76,
    circuitType: "sensory"
  },
  // ── PARIETAL INTEGRATION (L+R) ───────────────────────────────────────────────
  {
    from: FrontendRegion.SuperiorParietal_L,
    to: FrontendRegion.InferiorParietal_L,
    weight: 0.82,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.InferiorParietal_L,
    to: FrontendRegion.PrecuneusRegion_L,
    weight: 0.78,
    circuitType: "cognitive"
  },
  {
    from: FrontendRegion.SuperiorParietal_R,
    to: FrontendRegion.InferiorParietal_R,
    weight: 0.82,
    circuitType: "sensory"
  },
  {
    from: FrontendRegion.InferiorParietal_R,
    to: FrontendRegion.PrecuneusRegion_R,
    weight: 0.78,
    circuitType: "cognitive"
  },
  // ── LIMBIC CIRCUIT (L+R) ─────────────────────────────────────────────────────
  {
    from: FrontendRegion.Hippocampus_L,
    to: FrontendRegion.EntorhinalCortex,
    weight: 0.88,
    circuitType: "memory"
  },
  {
    from: FrontendRegion.EntorhinalCortex,
    to: FrontendRegion.Amygdala_L,
    weight: 0.82,
    circuitType: "limbic"
  },
  {
    from: FrontendRegion.Amygdala_L,
    to: FrontendRegion.Hypothalamus,
    weight: 0.8,
    circuitType: "limbic"
  },
  {
    from: FrontendRegion.Hippocampus_R,
    to: FrontendRegion.EntorhinalCortex,
    weight: 0.86,
    circuitType: "memory"
  },
  {
    from: FrontendRegion.Amygdala_R,
    to: FrontendRegion.Hypothalamus,
    weight: 0.78,
    circuitType: "limbic"
  },
  // ── ASCENDING AROUSAL PATHWAY (brainstem → thalamus → cortex) ───────────
  {
    from: Region.Brainstem,
    to: FrontendRegion.RapheNuclei,
    weight: 0.8,
    circuitType: "ascending"
  },
  {
    from: FrontendRegion.VentralTegmentalArea,
    to: FrontendRegion.Thalamus_L,
    weight: 0.78,
    circuitType: "ascending"
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: FrontendRegion.MedialPFC_L,
    weight: 0.82,
    circuitType: "ascending"
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: FrontendRegion.MedialPFC_R,
    weight: 0.8,
    circuitType: "ascending"
  },
  {
    from: FrontendRegion.RapheNuclei,
    to: Region.Hippocampus,
    weight: 0.76,
    circuitType: "ascending"
  },
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.MedialPFC_L,
    weight: 0.88,
    circuitType: "ascending"
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.MedialPFC_R,
    weight: 0.88,
    circuitType: "ascending"
  },
  // ── DESCENDING / CORTICOSPINAL PATHWAYS ───────────────────────────────────
  {
    from: FrontendRegion.PrimaryMotorCortex_L,
    to: Region.Brainstem,
    weight: 0.84,
    circuitType: "motor"
  },
  {
    from: FrontendRegion.PrimaryMotorCortex_R,
    to: Region.Brainstem,
    weight: 0.84,
    circuitType: "motor"
  },
  {
    from: Region.Brainstem,
    to: FrontendRegion.SpinoCerebellarTract,
    weight: 0.78,
    circuitType: "motor"
  },
  {
    from: FrontendRegion.SpinoCerebellarTract,
    to: Region.Cerebellum,
    weight: 0.82,
    circuitType: "motor"
  },
  {
    from: Region.Cerebellum,
    to: FrontendRegion.Thalamus_L,
    weight: 0.84,
    circuitType: "motor"
  },
  {
    from: Region.Cerebellum,
    to: FrontendRegion.Thalamus_R,
    weight: 0.82,
    circuitType: "motor"
  },
  // ── CORE/LEGACY CONNECTIONS ────────────────────────────────────────────────
  {
    from: Region.PrefrontalCortex,
    to: Region.Thalamus,
    weight: 0.78,
    circuitType: "cognitive"
  },
  {
    from: Region.PrefrontalCortex,
    to: Region.Amygdala,
    weight: 0.72,
    circuitType: "limbic"
  },
  {
    from: Region.MotorCortex,
    to: Region.BasalGanglia,
    weight: 0.8,
    circuitType: "motor"
  },
  {
    from: Region.MotorCortex,
    to: Region.Cerebellum,
    weight: 0.76,
    circuitType: "motor"
  },
  {
    from: Region.Thalamus,
    to: Region.SensoryCortex,
    weight: 0.82,
    circuitType: "sensory"
  },
  {
    from: Region.Thalamus,
    to: Region.Hippocampus,
    weight: 0.74,
    circuitType: "memory"
  },
  {
    from: Region.Hippocampus,
    to: Region.Amygdala,
    weight: 0.78,
    circuitType: "limbic"
  },
  {
    from: Region.BasalGanglia,
    to: Region.Thalamus,
    weight: 0.82,
    circuitType: "motor"
  },
  {
    from: Region.Brainstem,
    to: Region.Thalamus,
    weight: 0.84,
    circuitType: "ascending"
  },
  {
    from: Region.Amygdala,
    to: Region.PrefrontalCortex,
    weight: 0.7,
    circuitType: "limbic"
  },
  {
    from: FrontendRegion.Insula,
    to: Region.Amygdala,
    weight: 0.76,
    circuitType: "limbic"
  },
  {
    from: FrontendRegion.AnteriorCingulateCortex,
    to: Region.PrefrontalCortex,
    weight: 0.8,
    circuitType: "regulatory"
  },
  {
    from: FrontendRegion.VentralTegmentalArea,
    to: Region.BasalGanglia,
    weight: 0.84,
    circuitType: "ascending"
  },
  {
    from: Region.Cerebellum,
    to: Region.Brainstem,
    weight: 0.8,
    circuitType: "motor"
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: Region.PrefrontalCortex,
    weight: 0.78,
    circuitType: "ascending"
  },
  {
    from: FrontendRegion.SubstantiaNigra,
    to: Region.BasalGanglia,
    weight: 0.82,
    circuitType: "motor"
  },
  {
    from: FrontendRegion.Hypothalamus,
    to: Region.Brainstem,
    weight: 0.74,
    circuitType: "regulatory"
  },
  {
    from: FrontendRegion.AnteriorCingulateCortex,
    to: Region.Amygdala,
    weight: 0.72,
    circuitType: "limbic"
  }
];
const ALL_REGIONS = [
  ...Object.values(Region),
  ...Object.values(FrontendRegion)
];
function BrainScene({ regionActivities }) {
  const groupRef = reactExports.useRef(null);
  const maps = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    const satMap2 = /* @__PURE__ */ new Map();
    for (const { region, activity, saturationFlag } of regionActivities) {
      map.set(region, activity);
      satMap2.set(region, saturationFlag ?? activity >= SATURATION_THRESHOLD);
    }
    return { activityMap: map, satMap: satMap2 };
  }, [regionActivities]);
  const { activityMap, satMap } = maps;
  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("group", { ref: groupRef, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SynapticDensityField, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HemisphereGlow, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MidlinePlane, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("sphereGeometry", { args: [8, 16, 16] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "meshStandardMaterial",
        {
          color: new Color(0.04, 0.07, 0.18),
          transparent: true,
          opacity: 0.04,
          side: BackSide
        }
      )
    ] }),
    ALL_REGIONS.map((region) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      MicroNeuronCloud,
      {
        region,
        activity: activityMap.get(region) ?? 0
      },
      `cloud-${region}`
    )),
    ALL_REGIONS.map((region) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      RegionSphere,
      {
        region,
        activity: activityMap.get(region) ?? 0,
        saturationFlag: satMap.get(region)
      },
      region
    )),
    WEIGHTED_CONNECTIONS.map(
      ({ from, to, weight, circuitType, isCallosal }) => {
        const fromCfg = REGION_CONFIGS[from];
        const toCfg = REGION_CONFIGS[to];
        if (!fromCfg || !toCfg) return null;
        const fromActivity = activityMap.get(from) ?? 0;
        const toActivity = activityMap.get(to) ?? 0;
        const avgActivity = (fromActivity + toActivity) / 2;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          WeightedConnectionArc,
          {
            from: normalizePos(fromCfg.pos),
            to: normalizePos(toCfg.pos),
            activity: avgActivity,
            weight,
            circuitType,
            isCallosal: isCallosal ?? false
          },
          `${from}-${to}`
        );
      }
    )
  ] });
}
function RegionLegendPanel({
  regionActivities,
  open,
  onToggle
}) {
  const activityMap = new Map(
    regionActivities.map((r) => [r.region, r.activity])
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        position: "absolute",
        bottom: "8px",
        right: open ? "8px" : "8px",
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "4px"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onToggle,
            style: {
              fontFamily: "monospace",
              fontSize: "8px",
              letterSpacing: "0.12em",
              color: "rgba(218,165,32,0.9)",
              background: "rgba(5,5,18,0.92)",
              border: "1px solid rgba(218,165,32,0.35)",
              padding: "3px 8px",
              cursor: "pointer",
              textTransform: "uppercase",
              pointerEvents: "all"
            },
            children: open ? "▾ REGIONS" : "▸ REGIONS"
          }
        ),
        open && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: "rgba(5,5,18,0.92)",
              border: "1px solid rgba(218,165,32,0.28)",
              padding: "6px 8px",
              maxHeight: "280px",
              overflowY: "auto",
              minWidth: "160px",
              pointerEvents: "all"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    fontFamily: "monospace",
                    fontSize: "6px",
                    letterSpacing: "0.18em",
                    color: "rgba(218,165,32,0.6)",
                    marginBottom: "5px",
                    textTransform: "uppercase"
                  },
                  children: "SOVEREIGN REGIONS · 16"
                }
              ),
              SOVEREIGN_REGIONS.map((region) => {
                const bioName = BIOLOGICAL_NAMES[region] ?? String(region);
                const alias = SOVEREIGN_ALIAS_MAP[region] ?? "";
                const act = activityMap.get(region) ?? 0;
                const pct = Math.round(act * 100);
                const isSaturated = act >= SATURATION_THRESHOLD;
                const barColor = isSaturated ? "rgba(251,146,60,0.9)" : act > 0.6 ? "rgba(218,165,32,0.85)" : "rgba(100,130,220,0.7)";
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      marginBottom: "6px",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      paddingBottom: "4px"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "6px"
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  fontFamily: "monospace",
                                  fontSize: "11px",
                                  color: isSaturated ? "rgba(251,146,60,1)" : "rgba(220,225,255,0.92)",
                                  lineHeight: 1.2,
                                  flex: 1,
                                  minWidth: 0,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap"
                                },
                                children: bioName
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "span",
                              {
                                style: {
                                  fontFamily: "monospace",
                                  fontSize: "9px",
                                  color: isSaturated ? "rgba(251,146,60,0.9)" : "rgba(160,180,240,0.7)",
                                  whiteSpace: "nowrap"
                                },
                                children: [
                                  pct,
                                  "%"
                                ]
                              }
                            )
                          ]
                        }
                      ),
                      alias && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            fontFamily: "monospace",
                            fontSize: "9px",
                            color: "rgba(218,165,32,0.7)",
                            marginTop: "1px",
                            letterSpacing: "0.05em"
                          },
                          children: alias
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            marginTop: "3px",
                            height: "3px",
                            background: "rgba(20,24,60,0.9)",
                            borderRadius: "2px",
                            overflow: "hidden"
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                height: "100%",
                                width: `${pct}%`,
                                background: barColor,
                                borderRadius: "2px",
                                transition: "width 0.3s ease"
                              }
                            }
                          )
                        }
                      )
                    ]
                  },
                  String(region)
                );
              })
            ]
          }
        )
      ]
    }
  );
}
function BrainVisualization({
  regionActivities,
  stdpWeights
}) {
  const [legendOpen, setLegendOpen] = reactExports.useState(false);
  const topStdp = stdpWeights ? [...stdpWeights].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)).slice(0, 5) : [];
  const maxWeight = topStdp.length > 0 ? Math.max(...topStdp.map((e) => Math.abs(e.weight)), 1e-3) : 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", width: "100%", height: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Canvas,
      {
        camera: { position: [0, 0, 28], fov: 58 },
        style: { background: "transparent" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "ambientLight",
            {
              intensity: 0.12,
              color: new Color(0.1, 0.14, 0.28)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "pointLight",
            {
              position: [4, 4, 4],
              intensity: 0.9,
              color: new Color(0.3, 0.6, 1)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "pointLight",
            {
              position: [-4, -3, -3],
              intensity: 0.5,
              color: new Color(0.9, 0.5, 0.1)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "pointLight",
            {
              position: [0, 6, 0],
              intensity: 0.3,
              color: new Color(0.5, 0.8, 1)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(BrainScene, { regionActivities }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            OrbitControls,
            {
              enableZoom: true,
              minDistance: 10,
              maxDistance: 80,
              zoomSpeed: 0.8,
              enablePan: false,
              autoRotate: false,
              minPolarAngle: Math.PI / 5,
              maxPolarAngle: Math.PI * 4 / 5
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "absolute pointer-events-none",
        style: {
          top: "8px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "60px"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                fontFamily: "monospace",
                fontSize: "8px",
                letterSpacing: "0.15em",
                color: "rgba(80,140,255,0.70)",
                textTransform: "uppercase",
                textShadow: "0 0 8px rgba(60,100,255,0.5)"
              },
              children: "◀ LEFT HEMISPHERE"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                fontFamily: "monospace",
                fontSize: "8px",
                letterSpacing: "0.15em",
                color: "rgba(255,130,60,0.70)",
                textTransform: "uppercase",
                textShadow: "0 0 8px rgba(255,100,40,0.5)"
              },
              children: "RIGHT HEMISPHERE ▶"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "absolute bottom-2 left-2 pointer-events-none flex flex-col gap-[3px]",
        style: {
          background: "rgba(5,5,18,0.88)",
          border: "1px solid rgba(60,80,180,0.3)",
          padding: "5px 8px"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontFamily: "monospace",
                fontSize: "6px",
                letterSpacing: "0.15em",
                color: "rgba(120,140,200,0.7)",
                marginBottom: "2px"
              },
              children: "CIRCUIT TYPES"
            }
          ),
          CIRCUIT_LEGEND.map(({ type, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: { display: "flex", alignItems: "center", gap: "5px" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      width: "14px",
                      height: "3px",
                      borderRadius: "2px",
                      background: CIRCUIT_COLORS[type]
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      fontFamily: "monospace",
                      fontSize: "6px",
                      color: "rgba(160,175,210,0.75)"
                    },
                    children: label
                  }
                )
              ]
            },
            type
          ))
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RegionLegendPanel,
      {
        regionActivities,
        open: legendOpen,
        onToggle: () => setLegendOpen((v) => !v)
      }
    ),
    topStdp.length > 0 && !legendOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "absolute bottom-2 right-2 pointer-events-none flex flex-col gap-[3px]",
        style: {
          background: "rgba(5,5,18,0.88)",
          border: "1px solid rgba(60,80,180,0.3)",
          padding: "4px 6px",
          minWidth: "90px"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontFamily: "monospace",
                fontSize: "6px",
                letterSpacing: "0.15em",
                color: "rgba(80,160,80,0.8)",
                marginBottom: "2px"
              },
              children: "STDP · TOP CONN"
            }
          ),
          topStdp.map((entry) => {
            const conn = entry.connection.slice(0, 12);
            const barW = Math.abs(entry.weight) / maxWeight;
            const isPos = entry.delta >= 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontFamily: "monospace",
                    fontSize: "6px",
                    color: "rgba(100,120,180,0.8)",
                    width: "44px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  children: conn
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    flex: 1,
                    height: "3px",
                    background: "rgba(20,24,60,0.9)",
                    minWidth: "28px",
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
                        width: `${barW * 100}%`,
                        background: isPos ? "#22c55e" : "#ef4444"
                      }
                    }
                  )
                }
              )
            ] }, entry.connection);
          })
        ]
      }
    )
  ] });
}
function MotifBar({
  label,
  value,
  lo = 0,
  hi = 1,
  color,
  effect
}) {
  const pct = Math.max(
    0,
    Math.min(100, (value - lo) / Math.max(hi - lo, 0.01) * 100)
  );
  const displayVal = hi - lo <= 1.5 ? `${Math.round(value * 100)}%` : value.toFixed(2);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[7px] tracking-widest uppercase",
          style: { color: "oklch(0.45 0.06 220)" },
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px] font-bold", style: { color }, children: displayVal })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full rounded-sm",
        style: { height: 3, background: "oklch(0.14 0.03 260)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              height: "100%",
              width: `${pct}%`,
              background: color,
              borderRadius: 2,
              transition: "width 0.4s ease"
            }
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-mono text-[6px] block mt-0.5",
        style: { color: "oklch(0.32 0.05 220)" },
        children: effect
      }
    )
  ] });
}
function CircuitMotifsPanel({ state }) {
  const bm = state.benchmarks;
  const sal = state.salienceActionBias;
  const pe = state.predictionErrorFeedback;
  const msb = state.memorySalienceBridge;
  const rt = state.regulationThresholds;
  const cs = state.clusterStates;
  const isActive = bm.totalMotifInfluence > 0.3;
  const accentColor = isActive ? "oklch(0.72 0.22 145)" : "oklch(0.42 0.06 220)";
  const clusterEntries = Object.entries(cs);
  const topCluster = clusterEntries.reduce(
    (a, b) => a[1].competitionStrength > b[1].competitionStrength ? a : b
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "circuit_motifs.panel",
      className: "shrink-0 px-3 py-2 border-t",
      style: {
        borderColor: "oklch(0.18 0.04 255)",
        background: "oklch(0.065 0.015 265)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[9px] tracking-widest uppercase font-bold",
              style: { color: accentColor },
              children: "⦿ Circuit Motifs"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[6px] ml-auto",
              style: { color: "oklch(0.35 0.05 220)" },
              children: "7 active motifs · v36"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex-1 rounded px-1.5 py-1",
              style: { background: "oklch(0.1 0.02 260)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[9px] font-bold",
                    style: bm.recurrenceActiveCount > 10 ? { color: "oklch(0.72 0.22 145)" } : { color: "oklch(0.45 0.06 220)" },
                    children: bm.recurrenceActiveCount
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[6px] uppercase",
                    style: { color: "oklch(0.35 0.05 220)" },
                    children: "recurr"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex-1 rounded px-1.5 py-1",
              style: { background: "oklch(0.1 0.02 260)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[9px] font-bold",
                    style: bm.inhibitionActiveCount > 20 ? { color: "oklch(0.72 0.28 25)" } : { color: "oklch(0.45 0.06 220)" },
                    children: bm.inhibitionActiveCount
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[6px] uppercase",
                    style: { color: "oklch(0.35 0.05 220)" },
                    children: "suppressed"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex-1 rounded px-1.5 py-1",
              style: { background: "oklch(0.1 0.02 260)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[9px] font-bold",
                    style: { color: "oklch(0.72 0.2 195)" },
                    children: bm.totalMotifInfluence.toFixed(1)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[6px] uppercase",
                    style: { color: "oklch(0.35 0.05 220)" },
                    children: "totalΣ"
                  }
                )
              ]
            }
          )
        ] }),
        bm.motifEventThisTick && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "font-mono text-[7px] font-bold uppercase tracking-widest rounded px-2 py-0.5 mb-2 inline-block",
            style: {
              background: "oklch(0.18 0.06 60)",
              color: "oklch(0.85 0.22 60)"
            },
            children: [
              "⚡ ",
              bm.motifEventThisTick.replace(/_/g, " ")
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px] tracking-widest uppercase font-bold block mb-1",
                style: { color: "oklch(0.55 0.12 195)" },
                children: "1·2 · Recurrent + I/E Competition"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MotifBar,
              {
                label: "Recurrence active",
                value: Math.min(1, bm.recurrenceActiveCount / Math.max(1, 50)),
                color: "oklch(0.72 0.22 195)",
                effect: "lateral self-reinforcement per active region"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MotifBar,
              {
                label: "Inhibition cascade",
                value: Math.min(1, bm.inhibitionActiveCount / Math.max(1, 60)),
                color: "oklch(0.72 0.28 25)",
                effect: "bottom 40% suppressed — winner-take-most active"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px] tracking-widest uppercase font-bold block mb-1",
                style: { color: "oklch(0.55 0.12 260)" },
                children: "3 · Local Microcircuits"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 flex-wrap mb-1", children: clusterEntries.map(([name, c]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded px-1 py-0.5",
                style: {
                  background: c.competitionStrength > 0.2 ? "oklch(0.14 0.04 260)" : "oklch(0.1 0.02 260)",
                  border: `1px solid ${name === topCluster[0] && c.competitionStrength > 0 ? "oklch(0.55 0.12 260)" : "oklch(0.18 0.04 260)"}`
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[7px] font-bold uppercase",
                      style: {
                        color: c.competitionStrength > 0.2 ? "oklch(0.72 0.18 260)" : "oklch(0.42 0.06 220)"
                      },
                      children: name.slice(0, 3).toUpperCase()
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[6px]",
                      style: { color: "oklch(0.35 0.05 220)" },
                      children: c.winner ? c.winner.slice(0, 8).toLowerCase() : "idle"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "font-mono text-[6px] font-bold",
                      style: {
                        color: c.competitionStrength > 0.2 ? "oklch(0.72 0.18 260)" : "oklch(0.35 0.05 220)"
                      },
                      children: [
                        Math.round(c.competitionStrength * 100),
                        "%"
                      ]
                    }
                  )
                ]
              },
              name
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px] tracking-widest uppercase font-bold block mb-1",
                style: { color: "oklch(0.55 0.14 60)" },
                children: "4 · Salience → Action Bias"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-5 gap-0.5", children: [
              ["approach", sal.approach, "oklch(0.72 0.22 145)"],
              ["avoid", sal.avoid, "oklch(0.72 0.28 25)"],
              ["invest.", sal.investigate, "oklch(0.72 0.2 195)"],
              ["pause", sal.pause, "oklch(0.72 0.18 60)"],
              ["retreat", sal.retreat, "oklch(0.62 0.22 15)"]
            ].map(([label, val, color]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded px-0.5 py-0.5 text-center",
                style: {
                  background: "oklch(0.1 0.02 260)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[8px] font-bold",
                      style: { color },
                      children: Math.round(val * 100)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[6px] uppercase",
                      style: { color: "oklch(0.35 0.05 220)" },
                      children: label
                    }
                  )
                ]
              },
              label
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px] tracking-widest uppercase font-bold block mb-1",
                style: { color: "oklch(0.55 0.12 280)" },
                children: "5 · Prediction-Error Feedback"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MotifBar,
              {
                label: "Learning rate mod",
                value: pe.learningRateModulation,
                lo: 0.5,
                hi: 2.5,
                color: pe.learningRateModulation > 1.5 ? "oklch(0.72 0.22 60)" : "oklch(0.55 0.1 220)",
                effect: `×${pe.learningRateModulation.toFixed(2)} on STDP η — surprise=${Math.round(pe.surpriseLevel * 100)}%`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MotifBar,
              {
                label: "Commit threshold",
                value: pe.actionCommitmentThreshold,
                color: "oklch(0.62 0.14 280)",
                effect: "salience needed to commit to action"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px] tracking-widest uppercase font-bold block mb-1",
                style: { color: "oklch(0.55 0.14 25)" },
                children: "6 · Memory → Salience Bridge"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MotifBar,
              {
                label: "Threat salience boost",
                value: msb.threatSalienceBoost,
                color: "oklch(0.72 0.28 25)",
                effect: "failure memory amplifies threat salience"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MotifBar,
              {
                label: "Reward salience boost",
                value: msb.rewardSalienceBoost,
                color: "oklch(0.72 0.22 145)",
                effect: "success memory amplifies reward salience"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MotifBar,
              {
                label: "Action hesitation",
                value: msb.actionHesitationFromMemory,
                color: "oklch(0.72 0.18 60)",
                effect: "failure × conflict → motor suppression"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px] tracking-widest uppercase font-bold block mb-1",
                style: { color: "oklch(0.55 0.12 145)" },
                children: "7 · Regulation → Thresholds"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MotifBar,
                {
                  label: "Threat trigger θ",
                  value: rt.threatTriggerThreshold,
                  lo: 0.15,
                  hi: 0.7,
                  color: rt.threatTriggerThreshold < 0.3 ? "oklch(0.72 0.28 25)" : "oklch(0.55 0.1 220)",
                  effect: "stress lowers, recovery raises"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MotifBar,
                {
                  label: "Thought emit θ",
                  value: rt.thoughtEmissionThreshold,
                  lo: 0.5,
                  hi: 0.85,
                  color: "oklch(0.62 0.14 280)",
                  effect: "overload raises bar"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MotifBar,
                {
                  label: "Exploration bias",
                  value: rt.explorationBias,
                  color: "oklch(0.72 0.2 195)",
                  effect: "PNS↑ = more exploration"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MotifBar,
                {
                  label: "Caution weight",
                  value: rt.cautionWeighting,
                  color: rt.cautionWeighting > 0.6 ? "oklch(0.72 0.28 25)" : "oklch(0.55 0.1 220)",
                  effect: "instability raises caution"
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
const C$1 = {
  bg: "oklch(0.055 0.012 265)",
  panel: "oklch(0.07 0.015 265)",
  border: "oklch(0.18 0.05 255)",
  borderSub: "oklch(0.13 0.03 255)",
  label: "oklch(0.38 0.06 220)",
  dim: "oklch(0.32 0.04 220)",
  threat: "oklch(0.72 0.28 25)",
  reward: "oklch(0.78 0.26 55)",
  memory: "oklch(0.72 0.22 195)",
  executive: "oklch(0.75 0.24 260)",
  good: "oklch(0.72 0.22 145)",
  warn: "oklch(0.82 0.22 65)",
  danger: "oklch(0.75 0.28 15)",
  purple: "oklch(0.68 0.22 280)"
};
function Bar({
  value,
  color,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-mono text-[8px] w-24 shrink-0",
        style: { color: C$1.label },
        children: label
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 h-[3px] rounded",
        style: { background: "oklch(0.14 0.03 260)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              height: "100%",
              width: `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%`,
              background: color,
              borderRadius: 2,
              transition: "width 0.35s ease"
            }
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-mono text-[7px] w-7 text-right shrink-0",
        style: { color },
        children: Math.round(value * 100)
      }
    )
  ] });
}
const GOAL_COLORS = {
  THREAT_AVOID: C$1.threat,
  HUNGER_RELIEF: C$1.warn,
  AROUSAL_REGULATE: C$1.purple,
  EXPLORATION: C$1.good,
  REWARD_PURSUIT: C$1.reward,
  MEMORY_RETRIEVAL: C$1.memory,
  INVESTIGATE_NOVEL: "oklch(0.72 0.22 195)",
  REST_CONSOLIDATE: "oklch(0.55 0.12 240)",
  SOCIAL_ORIENT: "oklch(0.72 0.22 165)",
  SURVIVAL_OVERRIDE: C$1.danger,
  FREEZE_ASSESS: C$1.executive,
  IDLE: C$1.dim
};
const STATE_COLORS = {
  OVERWHELMED: C$1.danger,
  HIGH_PRESSURE: C$1.threat,
  ACTION_READY: C$1.good,
  ASSESSING: C$1.executive,
  STABLE_CONFIDENT: C$1.good,
  ALERT: C$1.warn,
  REGULATED: C$1.memory,
  TRANSITIONING: C$1.label,
  CALIBRATING: C$1.dim
};
function CognitiveDashboard({
  selfState,
  goalHierarchy,
  predictionState,
  failureMemory
}) {
  const stateColor = STATE_COLORS[selfState.currentStateLabel] ?? C$1.label;
  const topGoals = Object.entries(goalHierarchy.goalVector).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const surpriseRegionShort = predictionState.surpriseRegion.replace(/([A-Z])/g, " $1").trim().slice(0, 20);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col gap-0",
      style: { background: C$1.bg, borderTop: `1px solid ${C$1.border}` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-1.5 flex items-center gap-2 shrink-0 border-b",
            style: { background: C$1.panel, borderColor: C$1.borderSub },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[8px] tracking-widest uppercase font-bold",
                  style: { color: C$1.purple },
                  children: "◌ Cognitive State"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[8px] font-bold px-1.5 py-0.5 rounded ml-1",
                  style: {
                    background: `${stateColor}22`,
                    color: stateColor,
                    border: `1px solid ${stateColor}44`
                  },
                  children: selfState.currentStateLabel
                }
              ),
              goalHierarchy.overrideActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px] px-1.5 py-0.5 rounded",
                  style: {
                    background: `${C$1.danger}22`,
                    color: C$1.danger,
                    border: `1px solid ${C$1.danger}44`
                  },
                  children: "⚠ OVERRIDE"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px] ml-auto", style: { color: C$1.dim }, children: [
                "model confidence ",
                Math.round(predictionState.modelConfidence * 100),
                "%"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex", style: { minHeight: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col gap-0 border-r",
              style: { flex: "0 0 50%", borderColor: C$1.border },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 flex flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px] tracking-widest uppercase",
                      style: { color: C$1.label },
                      children: "Self-State Model"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bar,
                    {
                      value: selfState.pressure,
                      color: selfState.pressure > 0.65 ? C$1.threat : C$1.warn,
                      label: "Pressure"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: selfState.stability, color: C$1.good, label: "Stability" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bar,
                    {
                      value: selfState.confidence,
                      color: C$1.executive,
                      label: "Confidence"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bar,
                    {
                      value: selfState.urgency,
                      color: selfState.urgency > 0.65 ? C$1.threat : C$1.warn,
                      label: "Urgency"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bar,
                    {
                      value: selfState.regulation,
                      color: C$1.memory,
                      label: "Regulation"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-1 flex-wrap", children: [
                    selfState.shouldHesitate && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] px-1 rounded",
                        style: { background: `${C$1.warn}18`, color: C$1.warn },
                        children: "HESITATE"
                      }
                    ),
                    selfState.shouldCommit && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] px-1 rounded",
                        style: { background: `${C$1.good}18`, color: C$1.good },
                        children: "COMMIT"
                      }
                    ),
                    selfState.shouldWithdraw && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] px-1 rounded",
                        style: { background: `${C$1.danger}18`, color: C$1.danger },
                        children: "WITHDRAW"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "px-3 py-2 flex flex-col gap-1 border-t",
                    style: { borderColor: C$1.borderSub },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[7px] tracking-widest uppercase",
                          style: { color: C$1.label },
                          children: "Prediction Layer"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Bar,
                        {
                          value: predictionState.globalMismatch,
                          color: predictionState.globalMismatch > 0.35 ? C$1.threat : C$1.warn,
                          label: "Global Mismatch"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Bar,
                        {
                          value: predictionState.noveltyScore,
                          color: C$1.memory,
                          label: "Novelty Score"
                        }
                      ),
                      predictionState.surpriseDetected && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "font-mono text-[7px] px-1.5 py-0.5 rounded",
                          style: {
                            background: `${C$1.threat}15`,
                            color: C$1.threat,
                            border: `1px solid ${C$1.threat}30`
                          },
                          children: [
                            "⚡ SURPRISE @ ",
                            surpriseRegionShort,
                            " — mag",
                            " ",
                            Math.round(predictionState.surpriseMagnitude * 100),
                            "%"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: C$1.dim }, children: predictionState.ticksSinceLastSurprise < 999 ? `Last surprise: ${predictionState.ticksSinceLastSurprise}t ago` : "No surprise events yet" })
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0", style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 flex flex-col gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[7px] tracking-widest uppercase",
                    style: { color: C$1.label },
                    children: "Goal Hierarchy"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[6px]", style: { color: C$1.dim }, children: [
                  "conflict ",
                  Math.round(goalHierarchy.goalConflictScore * 100),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-1.5 px-1.5 py-1 rounded",
                  style: {
                    background: `${GOAL_COLORS[goalHierarchy.dominantGoal] ?? C$1.label}18`
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[8px] font-bold",
                        style: {
                          color: GOAL_COLORS[goalHierarchy.dominantGoal] ?? C$1.label
                        },
                        children: [
                          "▶ ",
                          goalHierarchy.dominantGoal.replace(/_/g, " ")
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[7px] ml-auto",
                        style: { color: C$1.dim },
                        children: [
                          Math.round(goalHierarchy.dominantGoalStrength * 100),
                          "%"
                        ]
                      }
                    )
                  ]
                }
              ),
              goalHierarchy.overrideActive && goalHierarchy.overrideGoal && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "font-mono text-[7px] px-1.5 py-0.5 rounded",
                  style: { background: `${C$1.danger}15`, color: C$1.danger },
                  children: [
                    "⚠ ",
                    goalHierarchy.overrideReason
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1 mt-0.5", children: topGoals.map(([label, strength]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Bar,
                {
                  value: strength,
                  color: GOAL_COLORS[label] ?? C$1.label,
                  label: label.replace(/_/g, " ").slice(0, 16)
                },
                label
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[7px] mt-0.5",
                  style: { color: C$1.dim },
                  children: [
                    "Dominant held ",
                    goalHierarchy.dominantGoalPersistenceTicks,
                    "t"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-3 py-2 flex flex-col gap-1 border-t",
                style: { borderColor: C$1.borderSub },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px] tracking-widest uppercase",
                      style: { color: C$1.label },
                      children: "Failure Memory"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[7px]",
                        style: {
                          color: failureMemory.suppressedCount > 0 ? C$1.warn : C$1.dim
                        },
                        children: [
                          failureMemory.suppressedCount,
                          " action(s) suppressed"
                        ]
                      }
                    ),
                    failureMemory.lastFailedContext && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[6px] truncate",
                        style: { color: C$1.dim },
                        children: [
                          "last: ",
                          failureMemory.lastFailedContext.slice(0, 20)
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "mt-0.5 px-1.5 py-1 rounded flex flex-col gap-0.5",
                      style: {
                        background: failureMemory.preferAlternativeRoute ? `${C$1.good}12` : "oklch(0.09 0.02 260)",
                        border: `1px solid ${failureMemory.preferAlternativeRoute ? C$1.good : C$1.borderSub}`
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-[7px] font-bold",
                            style: { color: C$1.label },
                            children: "Counterfactual Routing"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: C$1.dim }, children: [
                            "Current cost:",
                            " ",
                            Math.round(failureMemory.currentRouteCost * 100),
                            "%"
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: C$1.dim }, children: [
                            "Alt cost:",
                            " ",
                            Math.round(failureMemory.alternativeRouteCost * 100),
                            "%"
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-[7px]",
                            style: {
                              color: failureMemory.preferAlternativeRoute ? C$1.good : C$1.dim
                            },
                            children: failureMemory.routeComparisonLabel
                          }
                        )
                      ]
                    }
                  )
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
const SUBSYSTEM_COLORS = {
  Conflict: "oklch(0.65 0.25 25)",
  WorkingMemory: "oklch(0.65 0.20 255)",
  Emergence: "oklch(0.65 0.22 290)",
  Regulation: "oklch(0.65 0.22 145)",
  Persistence: "oklch(0.72 0.22 60)",
  Compute: "oklch(0.72 0.18 195)",
  Topology: "oklch(0.65 0.18 270)"
};
function MiniBar({
  label,
  value,
  color
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[7px] tracking-widest uppercase",
          style: { color: "oklch(0.45 0.06 220)" },
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px] font-bold", style: { color }, children: [
        pct,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full rounded-sm",
        style: { height: 3, background: "oklch(0.14 0.03 260)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              height: "100%",
              width: `${pct}%`,
              background: color,
              borderRadius: 2,
              transition: "width 0.4s ease"
            }
          }
        )
      }
    )
  ] });
}
function EventBadge({ event, color }) {
  if (!event)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        style: { color: "oklch(0.3 0.04 220)" },
        className: "font-mono text-[6px]",
        children: "—"
      }
    );
  const isPositive = event.includes("Healthy") || event.includes("Positive") || event.includes("Win") || event.includes("Success") || event.includes("Useful") || event.includes("Resolved-Well") || event.includes("Candidate") || event.includes("Reused") || event.includes("Reactivation");
  const isNeg = event.includes("Overload") || event.includes("Regression") || event.includes("Failure") || event.includes("Stall") || event.includes("Artifact") || event.includes("Shallow") || event.includes("Insufficient") || event.includes("Bottleneck") || event.includes("Runaway");
  const badgeColor = isPositive ? "oklch(0.65 0.22 145)" : isNeg ? "oklch(0.65 0.25 25)" : color;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "font-mono text-[6px] px-1 py-0.5 rounded-sm",
      style: {
        background: `${badgeColor}22`,
        color: badgeColor,
        border: `1px solid ${badgeColor}44`
      },
      children: event.slice(0, 28)
    }
  );
}
function SubsystemRow({
  name,
  color,
  keyMetric,
  keyMetricLabel,
  lastEvent,
  bars
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const pct = Math.round(keyMetric * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "mb-1 rounded-sm overflow-hidden",
      style: {
        background: "oklch(0.11 0.02 260)",
        border: "1px solid oklch(0.16 0.03 260)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 transition-colors text-left",
            onClick: () => setExpanded((e) => !e),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px] tracking-widest uppercase font-bold w-[80px] shrink-0",
                  style: { color },
                  children: name
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex-1 rounded-sm",
                  style: { height: 4, background: "oklch(0.14 0.03 260)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        height: "100%",
                        width: `${pct}%`,
                        background: color,
                        borderRadius: 2,
                        transition: "width 0.4s ease"
                      }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[7px] font-bold w-[28px] text-right shrink-0",
                  style: { color },
                  children: [
                    pct,
                    "%"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[6px] w-[52px] shrink-0",
                  style: { color: "oklch(0.35 0.05 220)" },
                  children: keyMetricLabel
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EventBadge, { event: lastEvent, color }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[6px] ml-1 shrink-0",
                  style: {
                    color: "oklch(0.3 0.04 220)",
                    transform: expanded ? "rotate(90deg)" : "none",
                    display: "inline-block",
                    transition: "transform 0.2s"
                  },
                  children: "▶"
                }
              )
            ]
          }
        ),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "px-2 pb-2 pt-1",
            style: { borderTop: "1px solid oklch(0.14 0.03 260)" },
            children: bars.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              MiniBar,
              {
                label: b.label,
                value: b.value,
                color
              },
              b.label
            ))
          }
        )
      ]
    }
  );
}
function EventLogRow({ entry }) {
  const color = SUBSYSTEM_COLORS[entry.subsystem] ?? "oklch(0.55 0.08 220)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-start gap-2 py-0.5",
      style: { borderBottom: "1px solid oklch(0.13 0.02 260)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "font-mono text-[6px] shrink-0 w-[28px]",
            style: { color: "oklch(0.35 0.05 220)" },
            children: [
              "T",
              entry.tick
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[6px] shrink-0 w-[60px] truncate",
            style: { color },
            children: entry.subsystem
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[6px] flex-1 leading-relaxed",
            style: { color: "oklch(0.50 0.07 220)" },
            children: entry.description
          }
        )
      ]
    }
  );
}
function CoreBrainMonitorPanel({ state }) {
  const [logExpanded, setLogExpanded] = reactExports.useState(false);
  const hs = state.overallHealthScore;
  const healthColor = hs > 0.7 ? "oklch(0.65 0.22 145)" : hs > 0.4 ? "oklch(0.72 0.22 60)" : "oklch(0.65 0.25 25)";
  const healthLabel = hs > 0.7 ? "HEALTHY" : hs > 0.4 ? "NOMINAL" : "CRITICAL";
  const sr = state.selfRegulation;
  const driftColor = sr.driftClass === "None" ? "oklch(0.65 0.22 145)" : sr.driftSeverity > 0.6 ? "oklch(0.65 0.25 25)" : "oklch(0.72 0.22 60)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "core_monitor.panel",
      style: {
        background: "oklch(0.09 0.02 260)",
        border: "1px solid oklch(0.16 0.03 260)",
        borderRadius: 6,
        padding: "10px"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 mb-2 pb-1.5",
            style: { borderBottom: "1px solid oklch(0.14 0.03 260)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[8px] tracking-widest uppercase font-bold",
                  style: { color: "oklch(0.55 0.10 260)" },
                  children: "CORE BRAIN RUNTIME MONITOR"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "rounded-full",
                    style: {
                      width: 6,
                      height: 6,
                      background: healthColor,
                      boxShadow: `0 0 6px ${healthColor}`
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono text-[7px] font-bold",
                    style: { color: healthColor },
                    children: [
                      healthLabel,
                      " ",
                      Math.round(hs * 100),
                      "%"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "px-1.5 py-0.5 rounded-sm",
                  style: {
                    background: `${driftColor}22`,
                    border: `1px solid ${driftColor}44`
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[6px] font-bold",
                      style: { color: driftColor },
                      children: sr.driftClass === "None" ? "STABLE" : sr.driftClass.toUpperCase()
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[6px]",
                  style: { color: "oklch(0.30 0.04 220)" },
                  children: [
                    "T",
                    state.tick
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[6px] uppercase tracking-widest",
              style: { color: "oklch(0.35 0.05 220)" },
              children: "SELF-REG"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MiniBar,
            {
              label: "",
              value: sr.controlStateScore,
              color: "oklch(0.65 0.15 260)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[6px]",
              style: { color: "oklch(0.40 0.06 220)" },
              children: sr.correctionEngineActive ? "⚡ Correction active" : "✓ No drift"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[6px]",
              style: { color: "oklch(0.30 0.04 220)" },
              children: [
                "Updates: ",
                sr.adaptivePolicyUpdates
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SubsystemRow,
          {
            name: "Conflict",
            color: SUBSYSTEM_COLORS.Conflict,
            keyMetric: 1 - state.conflict.currentConflictSeverity,
            keyMetricLabel: "resolution",
            lastEvent: state.conflict.lastEvent,
            bars: [
              { label: "severity", value: state.conflict.currentConflictSeverity },
              {
                label: "hesitation",
                value: Math.min(1, state.conflict.hesitationWithoutResolution / 20)
              },
              {
                label: "oscillation",
                value: state.conflict.oscillationFrequency / 10
              }
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SubsystemRow,
          {
            name: "WorkingMem",
            color: SUBSYSTEM_COLORS.WorkingMemory,
            keyMetric: state.workingMemory.decisiveFactRetentionRate,
            keyMetricLabel: "decisive ret.",
            lastEvent: state.workingMemory.lastEvent,
            bars: [
              {
                label: "occupancy",
                value: state.workingMemory.activeSlotCount / 8
              },
              {
                label: "stale rate",
                value: state.workingMemory.staleRetentionRate
              },
              { label: "gate prec.", value: state.workingMemory.gatePrecision }
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SubsystemRow,
          {
            name: "Emergence",
            color: SUBSYSTEM_COLORS.Emergence,
            keyMetric: state.emergence.emergenceScore,
            keyMetricLabel: "emerg. score",
            lastEvent: state.emergence.lastEvent,
            bars: [
              { label: "novelty", value: state.emergence.noveltyScore },
              { label: "diversity", value: state.emergence.thoughtDiversity },
              { label: "coherence", value: state.emergence.coherenceScore }
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SubsystemRow,
          {
            name: "Regulation",
            color: SUBSYSTEM_COLORS.Regulation,
            keyMetric: state.regulation.autonomicBalanceStability,
            keyMetricLabel: "ANS balance",
            lastEvent: state.regulation.lastEvent,
            bars: [
              { label: "stability", value: state.regulation.prevStability },
              { label: "stress", value: state.regulation.stressMagnitude },
              {
                label: "recovery slope",
                value: clamp01(state.regulation.recoverySlope)
              }
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SubsystemRow,
          {
            name: "Persistence",
            color: SUBSYSTEM_COLORS.Persistence,
            keyMetric: 1 - state.persistence.persistenceOverloadRisk,
            keyMetricLabel: "headroom",
            lastEvent: state.persistence.lastEvent,
            bars: [
              {
                label: "unresolved",
                value: state.persistence.unresolvedTensionCount / 12
              },
              { label: "relevance", value: state.persistence.carryoverRelevance },
              {
                label: "failure recall",
                value: state.persistence.failureMemoryRecallRate
              }
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SubsystemRow,
          {
            name: "Compute",
            color: SUBSYSTEM_COLORS.Compute,
            keyMetric: state.compute.sparseActivationRatio,
            keyMetricLabel: "sparse ratio",
            lastEvent: state.compute.lastEvent,
            bars: [
              { label: "active frac.", value: state.compute.activeRegionFraction },
              {
                label: "efficiency trend",
                value: clamp01(state.compute.efficiencyTrend + 0.5)
              },
              { label: "compute proxy", value: state.compute.computeProxy }
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SubsystemRow,
          {
            name: "Topology",
            color: SUBSYSTEM_COLORS.Topology,
            keyMetric: state.topology.predictionActionCoupling,
            keyMetricLabel: "pred-act coup.",
            lastEvent: state.topology.lastEvent,
            bars: [
              { label: "recurrence", value: state.topology.recurrenceDepth },
              { label: "reg. reach", value: state.topology.regulationReach },
              {
                label: "competition",
                value: state.topology.moduleCompetitionSaturation
              }
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "w-full flex items-center gap-2 py-1 hover:opacity-80 transition-opacity",
              onClick: () => setLogExpanded((e) => !e),
              "data-ocid": "core_monitor.toggle",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[7px] tracking-widest uppercase font-bold",
                    style: { color: "oklch(0.40 0.07 260)" },
                    children: "Event Log"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono text-[6px]",
                    style: { color: "oklch(0.30 0.04 220)" },
                    children: [
                      "(",
                      state.eventLog.length,
                      " events)"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[6px]",
                    style: {
                      color: "oklch(0.3 0.04 220)",
                      transform: logExpanded ? "rotate(90deg)" : "none",
                      display: "inline-block",
                      transition: "transform 0.2s"
                    },
                    children: "▶"
                  }
                )
              ]
            }
          ),
          logExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "mt-1 overflow-y-auto",
              style: {
                maxHeight: 160,
                background: "oklch(0.08 0.015 260)",
                borderRadius: 3,
                padding: "4px 6px"
              },
              children: [
                state.eventLog.slice(0, 10).map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(EventLogRow, { entry: e }, `${e.tick}-${e.subsystem}-${i}`)),
                state.eventLog.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[6px]",
                    style: { color: "oklch(0.25 0.04 220)" },
                    children: "No events yet — run simulation to generate data."
                  }
                )
              ]
            }
          )
        ] })
      ]
    }
  );
}
function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}
const C = {
  panel: "oklch(0.075 0.012 265)",
  border: "oklch(0.18 0.05 250)",
  dim: "oklch(0.38 0.05 220)",
  muted: "oklch(0.5 0.08 220)"
};
const CHEMS = [
  {
    key: "dpa",
    label: "DPA",
    fullName: "Dopamine",
    color: "oklch(0.78 0.26 55)",
    type: "excitatory"
  },
  {
    key: "ser",
    label: "SER",
    fullName: "Serotonin",
    color: "oklch(0.72 0.20 195)",
    type: "inhibitory"
  },
  {
    key: "nor",
    label: "NOR",
    fullName: "Norepinephrine",
    color: "oklch(0.72 0.25 30)",
    type: "excitatory"
  },
  {
    key: "ach",
    label: "ACH",
    fullName: "Acetylcholine",
    color: "oklch(0.72 0.22 160)",
    type: "excitatory"
  },
  {
    key: "gab",
    label: "GAB",
    fullName: "GABA",
    color: "oklch(0.68 0.18 240)",
    type: "inhibitory"
  },
  {
    key: "glu",
    label: "GLU",
    fullName: "Glutamate",
    color: "oklch(0.75 0.25 45)",
    type: "excitatory"
  },
  {
    key: "cor",
    label: "COR",
    fullName: "Cortisol",
    color: "oklch(0.65 0.25 15)",
    type: "stress"
  },
  {
    key: "oxt",
    label: "OXT",
    fullName: "Oxytocin",
    color: "oklch(0.78 0.22 320)",
    type: "social"
  }
];
function NeuroChemPanel() {
  const { data, isLoading } = useNeuroChem();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-none border p-3",
      style: { background: C.panel, borderColor: C.border },
      "data-ocid": "neurochem.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "font-mono text-[9px] tracking-widest uppercase mb-3 pb-1 border-b flex items-center justify-between",
            style: {
              color: "oklch(0.72 0.22 160)",
              borderColor: "oklch(0.18 0.06 160 / 0.5)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "◈ NEURO-CHEM — Internal Node 2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.dim, fontSize: "7px" }, children: "8 NEUROTRANSMITTERS" })
            ]
          }
        ),
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-4 text-center", "data-ocid": "neurochem.loading_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[8px] tracking-widest uppercase animate-pulse",
            style: { color: C.muted },
            children: "SCANNING NEURO-CHEM..."
          }
        ) }),
        !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: CHEMS.map((chem) => {
          const val = data ? data[chem.key] : 0;
          const pct = Math.max(0, Math.min(1, val)) * 100;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[8px] w-8 shrink-0 text-right",
                style: { color: chem.color },
                children: chem.label
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[7px] w-24 shrink-0",
                style: { color: C.dim },
                children: chem.fullName
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex-1 h-[5px] rounded-full overflow-hidden",
                style: { background: "oklch(0.12 0.02 265)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    className: "h-full rounded-full",
                    initial: { width: 0 },
                    animate: { width: `${pct}%` },
                    transition: { duration: 0.6, ease: "easeOut" },
                    style: {
                      background: chem.color,
                      boxShadow: `0 0 4px ${chem.color}80`
                    }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "font-mono text-[8px] w-8 shrink-0 text-right",
                style: { color: chem.color },
                children: [
                  pct.toFixed(0),
                  "%"
                ]
              }
            )
          ] }, chem.key);
        }) })
      ]
    }
  );
}
const REGION_LABELS = {
  [Region.PrefrontalCortex]: "Prefrontal Cortex",
  [Region.MotorCortex]: "Motor Cortex",
  [Region.SensoryCortex]: "Sensory Cortex",
  [Region.Thalamus]: "Thalamus",
  [Region.Hippocampus]: "Hippocampus",
  [Region.Amygdala]: "Amygdala",
  [Region.BasalGanglia]: "Basal Ganglia",
  [Region.Cerebellum]: "Cerebellum",
  [Region.Brainstem]: "Brainstem",
  [FrontendRegion.Insula]: "Insula",
  [FrontendRegion.AnteriorCingulateCortex]: "Anterior Cingulate",
  [FrontendRegion.OrbitalFrontalCortex]: "Orbitofrontal Ctx",
  [FrontendRegion.VisualCortex]: "Visual Cortex",
  [FrontendRegion.AuditoryCortex]: "Auditory Cortex",
  [FrontendRegion.Hypothalamus]: "Hypothalamus",
  [FrontendRegion.NucleusAccumbens]: "Nucleus Accumbens",
  [FrontendRegion.OlfactoryBulb]: "Olfactory Bulb",
  // New sub-regions
  [FrontendRegion.CA1]: "CA1 (Hippocampus)",
  [FrontendRegion.CA3]: "CA3 (Hippocampus)",
  [FrontendRegion.DentateGyrus]: "Dentate Gyrus",
  [FrontendRegion.PurkinjeLayer]: "Purkinje Layer",
  [FrontendRegion.DeepCerebellarNuclei]: "Deep Cerebellar Nuc.",
  [FrontendRegion.MedialdorsalThalamus]: "MD Thalamus",
  [FrontendRegion.PulvinarThalamus]: "Pulvinar Thalamus",
  [FrontendRegion.ParietalCortex]: "Parietal Cortex",
  [FrontendRegion.TemporalCortex]: "Temporal Cortex",
  [FrontendRegion.CingulateMotorArea]: "Cingulate Motor Area",
  [FrontendRegion.Claustrum]: "Claustrum",
  [FrontendRegion.LateralHabenula]: "Lateral Habenula",
  [FrontendRegion.SubstantiaNigra]: "Substantia Nigra",
  // 10 new regions
  [FrontendRegion.SuperiorTemporalSulcus]: "Superior Temporal Sulcus",
  [FrontendRegion.DorsalACC]: "Dorsal ACC",
  [FrontendRegion.VentralTegmentalArea]: "Ventral Tegmental Area",
  [FrontendRegion.LocusCoeruleus]: "Locus Coeruleus",
  [FrontendRegion.RapheNuclei]: "Raphe Nuclei",
  [FrontendRegion.VentralStriatum]: "Ventral Striatum",
  [FrontendRegion.EntorhinalCortex]: "Entorhinal Cortex",
  [FrontendRegion.PerirhinalCortex]: "Perirhinal Cortex",
  [FrontendRegion.SupplementaryMotorArea]: "Supplementary Motor Area",
  [FrontendRegion.VentralPallidum]: "Ventral Pallidum",
  // 5 new regions (45-region expansion)
  [FrontendRegion.SpinoCerebellarTract]: "Spinocerebellar Tract",
  [FrontendRegion.PeriaqueductalGray]: "Periaqueductal Gray",
  [FrontendRegion.BedNucleusStria]: "Bed Nucleus Stria",
  [FrontendRegion.MedialSeptum]: "Medial Septum",
  [FrontendRegion.RetroSplenialCortex]: "Retrosplenial Cortex"
};
const REGION_ORDER = [
  Region.PrefrontalCortex,
  Region.MotorCortex,
  Region.SensoryCortex,
  Region.Thalamus,
  Region.Hippocampus,
  Region.Amygdala,
  Region.BasalGanglia,
  Region.Cerebellum,
  Region.Brainstem,
  FrontendRegion.Insula,
  FrontendRegion.AnteriorCingulateCortex,
  FrontendRegion.OrbitalFrontalCortex,
  FrontendRegion.VisualCortex,
  FrontendRegion.AuditoryCortex,
  FrontendRegion.Hypothalamus,
  FrontendRegion.NucleusAccumbens,
  FrontendRegion.OlfactoryBulb,
  FrontendRegion.CA1,
  FrontendRegion.CA3,
  FrontendRegion.DentateGyrus,
  FrontendRegion.PurkinjeLayer,
  FrontendRegion.DeepCerebellarNuclei,
  FrontendRegion.MedialdorsalThalamus,
  FrontendRegion.PulvinarThalamus,
  FrontendRegion.ParietalCortex,
  FrontendRegion.TemporalCortex,
  FrontendRegion.CingulateMotorArea,
  FrontendRegion.Claustrum,
  FrontendRegion.LateralHabenula,
  FrontendRegion.SubstantiaNigra,
  // 10 new regions
  FrontendRegion.SuperiorTemporalSulcus,
  FrontendRegion.DorsalACC,
  FrontendRegion.VentralTegmentalArea,
  FrontendRegion.LocusCoeruleus,
  FrontendRegion.RapheNuclei,
  FrontendRegion.VentralStriatum,
  FrontendRegion.EntorhinalCortex,
  FrontendRegion.PerirhinalCortex,
  FrontendRegion.SupplementaryMotorArea,
  FrontendRegion.VentralPallidum,
  // 5 new regions (45-region expansion)
  FrontendRegion.SpinoCerebellarTract,
  FrontendRegion.PeriaqueductalGray,
  FrontendRegion.BedNucleusStria,
  FrontendRegion.MedialSeptum,
  FrontendRegion.RetroSplenialCortex
];
function activityToBarColor(activity) {
  if (activity < 0.25) return `oklch(${0.35 + activity * 0.6} 0.12 260)`;
  if (activity < 0.5) return `oklch(${0.55 + (activity - 0.25) * 0.6} 0.2 200)`;
  if (activity < 0.75)
    return `oklch(${0.7 + (activity - 0.5) * 0.2} 0.22 ${160 - (activity - 0.5) * 320})`;
  return `oklch(${0.68 - (activity - 0.75) * 0.12} 0.28 ${80 - (activity - 0.75) * 320})`;
}
function ActivityBar({
  activity,
  label,
  isSaturated
}) {
  const pct = Math.round(activity * 100);
  const color = activityToBarColor(activity);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-mono text-[9px] tracking-wider shrink-0 truncate",
        style: {
          color: "oklch(0.5 0.08 220)",
          width: "108px",
          textAlign: "right"
        },
        children: label
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 h-[5px] relative",
        style: { background: "oklch(0.12 0.02 260)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "activity-bar-fill",
            style: {
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${color}88, ${color})`,
              boxShadow: activity > 0.5 ? `0 0 5px ${color}66` : "none"
            }
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: "font-mono text-[9px] shrink-0",
        style: { color, width: "30px", textAlign: "right" },
        children: [
          pct,
          "%"
        ]
      }
    ),
    isSaturated && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-mono text-[8px] font-bold shrink-0 px-1 rounded",
        style: {
          background: "oklch(0.35 0.22 25)",
          color: "oklch(0.95 0.15 25)"
        },
        children: "SAT"
      }
    )
  ] });
}
function NeurotransmitterBar({
  label,
  value,
  color,
  abbrev
}) {
  const pct = Math.round(value * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-mono text-[8px] shrink-0 font-bold",
        style: { color, width: "24px" },
        children: abbrev
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 h-[4px] relative",
        style: { background: "oklch(0.12 0.02 260)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${pct}%`,
              background: color,
              boxShadow: value > 0.5 ? `0 0 5px ${color}` : "none",
              transition: "width 0.4s ease"
            }
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: "font-mono text-[8px] shrink-0",
        style: { color, width: "24px", textAlign: "right" },
        children: [
          pct,
          "%"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-mono text-[7px] shrink-0 hidden xl:block",
        style: { color: "oklch(0.3 0.04 220)", width: "70px" },
        children: label
      }
    )
  ] });
}
function CircularGauge({
  value,
  label,
  color,
  size = 60
}) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - value);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-[2px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", width: size, height: size }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "svg",
        {
          width: size,
          height: size,
          style: { transform: "rotate(-90deg)" },
          role: "img",
          "aria-label": `${label}: ${Math.round(value * 100)}%`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: size / 2,
                cy: size / 2,
                r: radius,
                fill: "none",
                stroke: "oklch(0.15 0.03 260)",
                strokeWidth: 4
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: size / 2,
                cy: size / 2,
                r: radius,
                fill: "none",
                stroke: color,
                strokeWidth: 4,
                strokeDasharray: circumference,
                strokeDashoffset,
                strokeLinecap: "butt",
                style: {
                  transition: "stroke-dashoffset 0.3s ease",
                  filter: value > 0.5 ? `drop-shadow(0 0 3px ${color})` : "none"
                }
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "font-mono absolute inset-0 flex items-center justify-center text-[10px] font-bold",
          style: { color },
          children: Math.round(value * 100)
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-mono text-[7px] tracking-widest uppercase text-center leading-tight",
        style: { color: "oklch(0.45 0.06 220)", maxWidth: size },
        children: label
      }
    )
  ] });
}
function MiniMeterCompact({
  value,
  label,
  signed = false
}) {
  const pct = signed ? (value + 1) / 2 : value;
  const color = value > 0.6 ? "oklch(0.72 0.25 55)" : value < -0.3 ? "oklch(0.55 0.18 260)" : "oklch(0.7 0.2 195)";
  const displayVal = signed ? `${value >= 0 ? "+" : ""}${value.toFixed(1)}` : `${Math.round(value * 100)}%`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-mono text-[8px] tracking-widest uppercase shrink-0",
        style: { color: "oklch(0.42 0.06 220)", width: "40px" },
        children: label
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 h-[3px] relative",
        style: { background: "oklch(0.12 0.02 260)" },
        children: signed ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute h-full",
            style: {
              left: "50%",
              width: `${Math.abs(value) * 50}%`,
              transform: value < 0 ? "translateX(-100%)" : "none",
              background: color
            }
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute h-full left-0",
            style: {
              width: `${pct * 100}%`,
              background: color,
              boxShadow: value > 0.7 ? `0 0 4px ${color}` : "none"
            }
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-mono text-[8px] font-bold shrink-0 text-right",
        style: { color, width: "26px" },
        children: displayVal
      }
    )
  ] });
}
function EEGChannel({
  label,
  hz,
  amplitude,
  freqMult,
  phase,
  color,
  time,
  width = 160,
  height = 12
}) {
  const samples = 32;
  const points = [];
  for (let i = 0; i <= samples; i++) {
    const x = i / samples * width;
    const t = time + i / samples * 4;
    const y = height / 2 + Math.sin(t * freqMult + phase) * amplitude * (height / 2 - 1);
    points.push(`${x},${Math.max(1, Math.min(height - 1, y))}`);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "shrink-0 font-mono text-right",
        style: {
          width: "14px",
          color,
          fontSize: "8px",
          letterSpacing: "0.02em"
        },
        children: label
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "shrink-0 font-mono",
        style: {
          width: "28px",
          color: "oklch(0.3 0.04 220)",
          fontSize: "7px"
        },
        children: [
          hz,
          "Hz"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        width,
        height,
        style: { overflow: "visible" },
        role: "img",
        "aria-label": `${label} EEG channel`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "rect",
            {
              x: 0,
              y: 0,
              width,
              height,
              fill: "oklch(0.075 0.01 260)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "polyline",
            {
              points: points.join(" "),
              fill: "none",
              stroke: color,
              strokeWidth: 0.8,
              strokeOpacity: 0.9,
              strokeLinejoin: "round"
            }
          )
        ]
      }
    )
  ] });
}
function LayerADisplay({ layerA }) {
  if (!layerA) return null;
  const modeColor = {
    exploration: "oklch(0.72 0.22 195)",
    exploitation: "oklch(0.82 0.22 80)",
    rest: "oklch(0.55 0.15 260)",
    "threat-response": "oklch(0.68 0.28 25)",
    social: "oklch(0.72 0.22 310)"
  };
  const color = modeColor[layerA.behavioralMode] ?? "oklch(0.6 0.15 220)";
  const bars = [
    { label: "Salience", value: layerA.salience, color: "oklch(0.78 0.26 55)" },
    { label: "Arousal", value: layerA.arousal, color: "oklch(0.72 0.22 195)" },
    {
      label: "Memory Idx",
      value: layerA.memoryIndex,
      color: "oklch(0.72 0.2 160)"
    },
    {
      label: "Plasticity",
      value: layerA.plasticityRate,
      color: "oklch(0.75 0.22 280)"
    },
    {
      label: "Reward/Threat",
      value: (layerA.rewardThreat + 1) / 2,
      color: layerA.rewardThreat >= 0 ? "oklch(0.75 0.22 140)" : "oklch(0.65 0.25 25)"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-[4px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[7px] tracking-widest",
          style: { color: "oklch(0.35 0.05 220)" },
          children: "MODE:"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[8px] font-bold tracking-widest uppercase px-1.5 py-0.5",
          style: {
            color,
            background: `${color}18`,
            border: `1px solid ${color}44`
          },
          children: layerA.behavioralMode.replace("-", " ")
        }
      )
    ] }),
    bars.map(({ label, value, color: c }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[7px] shrink-0",
          style: { color: "oklch(0.4 0.05 220)", width: "62px" },
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex-1 h-[3px]",
          style: { background: "oklch(0.12 0.02 260)" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full transition-all duration-300",
              style: { width: `${Math.round(value * 100)}%`, background: c }
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "font-mono text-[7px] shrink-0",
          style: { color: c, width: "24px", textAlign: "right" },
          children: [
            Math.round(value * 100),
            "%"
          ]
        }
      )
    ] }, label))
  ] });
}
function LayerBDisplay({ layerB }) {
  if (!layerB) return null;
  const traits = [
    { key: "discipline", label: "Discipline", color: "oklch(0.78 0.24 195)" },
    { key: "resilience", label: "Resilience", color: "oklch(0.75 0.22 140)" },
    {
      key: "cooperativeness",
      label: "Cooperative",
      color: "oklch(0.72 0.22 310)"
    },
    { key: "cautiousness", label: "Cautious", color: "oklch(0.72 0.22 220)" },
    { key: "aggression", label: "Aggression", color: "oklch(0.68 0.28 25)" },
    { key: "impulsivity", label: "Impulsivity", color: "oklch(0.75 0.26 55)" },
    { key: "skepticism", label: "Skepticism", color: "oklch(0.72 0.2 80)" },
    { key: "fatigue", label: "Fatigue", color: "oklch(0.55 0.15 260)" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-[4px]", children: traits.map(({ key, label, color }) => {
    const value = layerB[key] ?? 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[7px] shrink-0",
          style: { color: "oklch(0.4 0.05 220)", width: "62px" },
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex-1 h-[3px]",
          style: { background: "oklch(0.12 0.02 260)" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full transition-all duration-400",
              style: {
                width: `${Math.round(value * 100)}%`,
                background: color
              }
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "font-mono text-[7px] shrink-0",
          style: { color, width: "24px", textAlign: "right" },
          children: [
            Math.round(value * 100),
            "%"
          ]
        }
      )
    ] }, key);
  }) });
}
function StatsPanel({ neural }) {
  const activityMap = new Map(neural.regionActivity);
  const tick = neural.tick;
  const activeNeurons = neural.activeNeuronCount;
  const totalNeurons = 861e8;
  const globalArousal = neural.globalArousal;
  const nt = neural.neurotransmitters;
  const av = neural.avatarBehavior;
  const avgFiringRate = (activeNeurons / Math.max(totalNeurons, 1) * 40).toFixed(1);
  const synapseActivationPct = Math.min(100, globalArousal * 120).toFixed(1);
  const [eegTime, setEegTime] = reactExports.useState(0);
  const eegTimerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    eegTimerRef.current = setInterval(() => {
      setEegTime((t) => t + 0.05);
    }, 50);
    return () => {
      if (eegTimerRef.current) clearInterval(eegTimerRef.current);
    };
  }, []);
  const brainstem = activityMap.get(Region.Brainstem) ?? 0;
  const hippocampus = activityMap.get(Region.Hippocampus) ?? 0;
  const pfc = activityMap.get(Region.PrefrontalCortex) ?? 0;
  const motor = activityMap.get(Region.MotorCortex) ?? 0;
  const sensory = activityMap.get(Region.SensoryCortex) ?? 0;
  const thalamus = activityMap.get(Region.Thalamus) ?? 0;
  const neurotransmitters = [
    {
      abbrev: "DA",
      label: "Dopamine",
      value: nt.dopamine,
      color: "oklch(0.82 0.26 55)"
    },
    {
      abbrev: "5HT",
      label: "Serotonin",
      value: nt.serotonin,
      color: "oklch(0.72 0.22 160)"
    },
    {
      abbrev: "NE",
      label: "Norepinephrine",
      value: nt.norepinephrine,
      color: "oklch(0.68 0.28 25)"
    },
    {
      abbrev: "GABA",
      label: "GABA",
      value: nt.gaba,
      color: "oklch(0.62 0.2 270)"
    },
    {
      abbrev: "GLU",
      label: "Glutamate",
      value: nt.glutamate,
      color: "oklch(0.78 0.22 80)"
    },
    {
      abbrev: "ACh",
      label: "Acetylcholine",
      value: nt.acetylcholine,
      color: "oklch(0.72 0.22 195)"
    }
  ];
  const neuroplasticity = Math.min(1, (hippocampus + pfc) * 0.55);
  const myelination = Math.min(1, 0.6 + motor * 0.15 + sensory * 0.1);
  const bandwidth = Math.min(1, globalArousal * 0.7 + thalamus * 0.3);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "stats.panel",
      className: "h-full flex flex-col overflow-hidden",
      style: { background: "oklch(0.065 0.01 265)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex gap-2 px-3 py-2 border-b shrink-0",
            style: { borderColor: "oklch(0.18 0.04 255)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CircularGauge,
                {
                  value: globalArousal,
                  label: "Arousal",
                  color: globalArousal > 0.7 ? "oklch(0.7 0.28 30)" : globalArousal > 0.4 ? "oklch(0.8 0.22 80)" : "oklch(0.72 0.22 195)",
                  size: 60
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col justify-center gap-[2px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px] tracking-widest uppercase",
                      style: { color: "oklch(0.4 0.06 220)" },
                      children: "Simulation Tick"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-sm font-bold leading-none",
                      style: { color: "oklch(0.78 0.18 200)", letterSpacing: "0.1em" },
                      children: tick.toLocaleString()
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] uppercase",
                        style: { color: "oklch(0.38 0.05 220)" },
                        children: "Firing"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[10px] font-bold",
                        style: { color: "oklch(0.78 0.22 140)" },
                        children: [
                          avgFiringRate,
                          " Hz"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] uppercase",
                        style: { color: "oklch(0.38 0.05 220)" },
                        children: "Syn. Active"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[10px] font-bold",
                        style: { color: "oklch(0.72 0.22 195)" },
                        children: [
                          synapseActivationPct,
                          "%"
                        ]
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 items-start", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CircularGauge,
                  {
                    value: neuroplasticity,
                    label: "Plasticity",
                    color: "oklch(0.72 0.22 195)",
                    size: 52
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CircularGauge,
                  {
                    value: myelination,
                    label: "Myelin",
                    color: "oklch(0.78 0.22 140)",
                    size: 52
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CircularGauge,
                  {
                    value: bandwidth,
                    label: "Bandwidth",
                    color: "oklch(0.78 0.25 55)",
                    size: 52
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex items-center gap-3 px-3 py-[4px] border-b shrink-0",
            style: {
              borderColor: "oklch(0.15 0.03 260)",
              background: "oklch(0.07 0.012 265)"
            },
            children: [
              {
                label: "REGIONS",
                value: "45",
                color: "oklch(0.72 0.22 195)"
              },
              {
                label: "ACTIVE",
                value: neural.activeNeuronCount.toLocaleString(),
                color: "oklch(0.78 0.18 200)"
              },
              {
                label: "SYNAPSES",
                value: "500T+",
                color: "oklch(0.7 0.2 160)"
              },
              {
                label: "GLIA",
                value: "130B",
                color: "oklch(0.7 0.15 220)"
              }
            ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px] tracking-widest",
                  style: { color: "oklch(0.35 0.05 220)" },
                  children: label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] font-bold", style: { color }, children: value })
            ] }, label))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-2 border-b shrink-0",
            style: { borderColor: "oklch(0.18 0.04 255)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-1",
                  style: { color: "oklch(0.38 0.06 220)" },
                  children: "▸ Neurotransmitter Levels"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-[3px]", children: neurotransmitters.map((nt_item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                NeurotransmitterBar,
                {
                  abbrev: nt_item.abbrev,
                  label: nt_item.label,
                  value: nt_item.value,
                  color: nt_item.color
                },
                nt_item.abbrev
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-2 border-b shrink-0",
            style: { borderColor: "oklch(0.18 0.04 255)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-1",
                  style: { color: "oklch(0.38 0.06 220)" },
                  children: "▸ Adenosine / Sleep Pressure"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[9px] tracking-wider shrink-0",
                    style: { color: "oklch(0.5 0.08 220)", width: "80px" },
                    children: "ADENOSINE"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex-1 h-[5px] relative",
                    style: { background: "oklch(0.12 0.02 260)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          position: "absolute",
                          left: 0,
                          top: 0,
                          height: "100%",
                          width: `${Math.round(neural.sleepPressure * 100)}%`,
                          background: neural.sleepPressure > 0.7 ? "linear-gradient(90deg, oklch(0.45 0.18 300), oklch(0.72 0.22 300))" : neural.sleepPressure > 0.4 ? "linear-gradient(90deg, oklch(0.65 0.18 140), oklch(0.78 0.22 140))" : "linear-gradient(90deg, oklch(0.55 0.18 160), oklch(0.72 0.22 160))",
                          boxShadow: neural.sleepPressure > 0.7 ? "0 0 5px oklch(0.72 0.22 300 / 0.6)" : "none",
                          transition: "width 0.4s ease"
                        }
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono text-[9px] shrink-0 font-bold",
                    style: {
                      color: neural.sleepPressure > 0.7 ? "oklch(0.72 0.22 300)" : neural.sleepPressure > 0.4 ? "oklch(0.78 0.22 80)" : "oklch(0.72 0.22 160)",
                      width: "34px",
                      textAlign: "right"
                    },
                    children: [
                      Math.round(neural.sleepPressure * 100),
                      "%"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[7px] mt-[2px]",
                  style: { color: "oklch(0.35 0.05 220)" },
                  children: neural.sleepPressure > 0.8 ? "⚠ HIGH ADENOSINE — brainstem suppressed" : neural.sleepPressure > 0.5 ? "Moderate accumulation — vigilance decreasing" : "Normal — circadian baseline"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-2 border-t shrink-0",
            style: { borderColor: "oklch(0.18 0.04 255)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-2",
                  style: { color: "oklch(0.38 0.06 220)" },
                  children: "▸ Layer A — State Engine"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(LayerADisplay, { layerA: neural.layerA })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "layer_b.panel",
            className: "px-3 py-2 border-t shrink-0",
            style: { borderColor: "oklch(0.18 0.04 255)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-2",
                  style: { color: "oklch(0.38 0.06 220)" },
                  children: "▸ Layer B — Identity Model"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(LayerBDisplay, { layerB: neural.layerB })
            ]
          }
        ),
        neural.isDebugRun && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "mx-3 mt-2 px-2 py-1 rounded font-mono text-[9px] font-bold",
            style: {
              background: "oklch(0.25 0.18 25)",
              color: "oklch(0.95 0.18 25)",
              border: "1px solid oklch(0.45 0.22 25)"
            },
            "data-ocid": "stats.error_state",
            children: "⛔ DEBUG RUN — >30% regions saturated. Fix homeostasis before emergence claims."
          }
        ),
        !neural.isDebugRun && neural.saturatedRegions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "mx-3 mt-2 px-2 py-1 rounded font-mono text-[9px]",
            style: {
              background: "oklch(0.22 0.12 45)",
              color: "oklch(0.88 0.14 45)",
              border: "1px solid oklch(0.4 0.16 45)"
            },
            children: [
              "⚠ ",
              neural.saturatedRegions.length,
              " SATURATED REGION",
              neural.saturatedRegions.length > 1 ? "S" : "",
              " — emergence claims suppressed"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-[3px] min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[9px] tracking-widest uppercase mb-1",
              style: { color: "oklch(0.38 0.06 220)" },
              children: "▸ Region Activity Matrix · 180 Regions (Top 45 Active)"
            }
          ),
          REGION_ORDER.map((region) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ActivityBar,
            {
              activity: activityMap.get(region) ?? 0,
              label: REGION_LABELS[region] ?? String(region),
              isSaturated: neural.saturatedRegions.includes(region)
            },
            region
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-2 border-t shrink-0",
            style: { borderColor: "oklch(0.18 0.04 255)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-1",
                  style: { color: "oklch(0.38 0.06 220)" },
                  children: "▸ EEG · Neural Oscillations"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-[2px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  EEGChannel,
                  {
                    label: "δ",
                    hz: "0.5-4",
                    amplitude: Math.max(0.08, brainstem),
                    freqMult: 0.5,
                    phase: 0,
                    color: "oklch(0.6 0.18 280)",
                    time: eegTime
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  EEGChannel,
                  {
                    label: "θ",
                    hz: "4-8",
                    amplitude: Math.max(0.08, hippocampus),
                    freqMult: 1.2,
                    phase: 1.1,
                    color: "oklch(0.62 0.2 310)",
                    time: eegTime
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  EEGChannel,
                  {
                    label: "α",
                    hz: "8-12",
                    amplitude: Math.max(0.08, 1 - globalArousal),
                    freqMult: 2.5,
                    phase: 2.2,
                    color: "oklch(0.72 0.22 195)",
                    time: eegTime
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  EEGChannel,
                  {
                    label: "β",
                    hz: "13-30",
                    amplitude: Math.max(0.08, (pfc + motor) * 0.5),
                    freqMult: 4,
                    phase: 0.7,
                    color: "oklch(0.82 0.22 80)",
                    time: eegTime
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  EEGChannel,
                  {
                    label: "γ",
                    hz: "30-100",
                    amplitude: Math.max(0.08, (sensory + thalamus) * 0.5),
                    freqMult: 8,
                    phase: 3.5,
                    color: "oklch(0.68 0.28 25)",
                    time: eegTime
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-2 border-t shrink-0",
            style: { borderColor: "oklch(0.18 0.04 255)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-1",
                  style: { color: "oklch(0.38 0.06 220)" },
                  children: "▸ Avatar Neural State"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-[3px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MiniMeterCompact, { value: av.motionLevel, label: "Motion" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MiniMeterCompact, { value: av.attentionLevel, label: "Attn" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    MiniMeterCompact,
                    {
                      value: av.emotionValence,
                      label: "Emotion",
                      signed: true
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MiniMeterCompact, { value: av.consciousnessLevel, label: "Consci" })
                ] })
              ] })
            ]
          }
        )
      ]
    }
  );
}
function LiveThoughtFeed({
  thoughtLog,
  isRunning
}) {
  const [expandedIdx, setExpandedIdx] = reactExports.useState(null);
  const recent = thoughtLog.slice(0, 8);
  const latest = recent[0] ?? null;
  const getCircuitColor = (circuitType) => {
    switch (circuitType) {
      case "Threat":
        return "oklch(0.72 0.28 25)";
      case "Reward":
        return "oklch(0.78 0.26 55)";
      case "Memory":
        return "oklch(0.72 0.22 195)";
      case "Executive":
        return "oklch(0.75 0.24 260)";
      case "SelfAwareness":
        return "oklch(0.85 0.30 80)";
      case "Language":
        return "oklch(0.78 0.24 165)";
      case "Homeostatic":
        return "oklch(0.72 0.24 140)";
      default:
        return "oklch(0.65 0.18 220)";
    }
  };
  const getConfidenceBadgeStyle = (confidence) => {
    if (confidence >= 85)
      return { bg: "oklch(0.28 0.12 145)", text: "oklch(0.82 0.22 145)" };
    if (confidence >= 75)
      return { bg: "oklch(0.28 0.10 65)", text: "oklch(0.82 0.22 65)" };
    return { bg: "oklch(0.22 0.06 255)", text: "oklch(0.55 0.08 220)" };
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "thought_feed.panel",
      className: "shrink-0 border-t flex flex-col",
      style: {
        borderColor: "oklch(0.22 0.06 255)",
        background: "oklch(0.055 0.012 265)",
        maxHeight: "280px",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-1.5 flex items-center gap-2 border-b shrink-0",
            style: {
              borderColor: "oklch(0.18 0.04 255)",
              background: "oklch(0.07 0.015 265)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase font-bold",
                  style: { color: "oklch(0.72 0.22 195)" },
                  children: "◈ Neural Thought Stream"
                }
              ),
              isRunning && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "oklch(0.72 0.26 145)",
                    boxShadow: "0 0 6px oklch(0.72 0.26 145)"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[8px] ml-auto",
                  style: { color: "oklch(0.35 0.05 220)" },
                  children: [
                    thoughtLog.length,
                    " thoughts"
                  ]
                }
              )
            ]
          }
        ),
        latest ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-2 shrink-0 cursor-pointer",
            onClick: () => setExpandedIdx(expandedIdx === -1 ? null : -1),
            onKeyDown: (e) => e.key === "Enter" && setExpandedIdx(expandedIdx === -1 ? null : -1),
            style: {
              background: "oklch(0.09 0.025 255)",
              borderBottom: `1px solid ${getCircuitColor(latest.circuitType ?? "")}40`,
              borderLeft: `3px solid ${getCircuitColor(latest.circuitType ?? "")}`
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded",
                    style: {
                      background: `${getCircuitColor(latest.circuitType ?? "")}22`,
                      color: getCircuitColor(latest.circuitType ?? ""),
                      border: `1px solid ${getCircuitColor(latest.circuitType ?? "")}55`
                    },
                    children: latest.circuitType ?? latest.dominantRegion.split("[")[0].trim()
                  }
                ),
                latest.confidence > 0 && (() => {
                  const badge = getConfidenceBadgeStyle(latest.confidence);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[8px] font-bold px-1.5 py-0.5 rounded",
                      style: { background: badge.bg, color: badge.text },
                      children: [
                        latest.confidence,
                        "% conf"
                      ]
                    }
                  );
                })(),
                latest.behaviorCoupled && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] px-1 py-0.5",
                    style: { color: "oklch(0.75 0.22 55)" },
                    title: "Behavioral coupling detected",
                    children: "⚡ coupled"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono text-[7px] ml-auto shrink-0",
                    style: { color: "oklch(0.38 0.05 220)" },
                    children: [
                      "T",
                      latest.tick,
                      " · ",
                      Math.round(latest.intensity * 100),
                      "%"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-mono text-[9px] leading-relaxed",
                  style: { color: "oklch(0.88 0.04 210)", wordBreak: "break-word" },
                  children: latest.thought
                }
              ),
              latest.neuralSources && latest.neuralSources.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: latest.neuralSources.slice(0, 3).map((src) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[7px] px-1 rounded",
                  style: {
                    background: "oklch(0.12 0.03 260)",
                    color: "oklch(0.55 0.08 195)"
                  },
                  children: [
                    src.region.split("_")[0].slice(-14),
                    " ",
                    src.firingRate.toFixed(0),
                    "Hz"
                  ]
                },
                src.region
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "mt-1.5 h-[2px] rounded",
                  style: { background: "oklch(0.14 0.03 260)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        height: "100%",
                        width: `${Math.min(1, latest.intensity) * 100}%`,
                        background: getCircuitColor(latest.circuitType ?? ""),
                        transition: "width 0.4s ease",
                        borderRadius: "2px"
                      }
                    }
                  )
                }
              ),
              expandedIdx === -1 && latest.provenance && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-mono text-[7px] mt-1.5 leading-tight",
                  style: { color: "oklch(0.38 0.05 220)", wordBreak: "break-word" },
                  children: latest.provenance
                }
              )
            ]
          }
        ) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex flex-col overflow-y-auto",
            style: { maxHeight: "130px" },
            children: recent.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                "data-ocid": "thought_feed.empty_state",
                className: "px-3 py-3 font-mono text-[8px] italic text-center",
                style: { color: "oklch(0.32 0.04 220)" },
                children: "Awaiting neural co-activation threshold (75%)..."
              }
            ) : recent.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `thought_feed.item.${Math.min(idx + 1, 5)}`,
                className: "px-3 py-1.5 flex flex-col gap-[2px] cursor-pointer",
                onClick: () => setExpandedIdx(expandedIdx === idx ? null : idx),
                onKeyDown: (e) => e.key === "Enter" && setExpandedIdx(expandedIdx === idx ? null : idx),
                style: {
                  borderBottom: "1px solid oklch(0.1 0.02 260)",
                  borderLeft: idx === 0 ? `2px solid ${getCircuitColor(entry.circuitType ?? "")}` : "2px solid oklch(0.16 0.03 250)",
                  background: idx === 0 ? "oklch(0.08 0.02 255)" : "transparent",
                  opacity: idx === 0 ? 1 : Math.max(0.4, 1 - idx * 0.12)
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[7px] shrink-0",
                        style: { color: "oklch(0.35 0.04 220)" },
                        children: [
                          "T",
                          entry.tick
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[7px] tracking-wider uppercase truncate",
                        style: { color: getCircuitColor(entry.circuitType ?? "") },
                        children: [
                          "[",
                          (entry.circuitType ?? entry.dominantRegion.split("[")[0].trim()).slice(0, 16),
                          "]"
                        ]
                      }
                    ),
                    entry.confidence > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[6px] px-1 rounded shrink-0",
                        style: {
                          background: entry.confidence >= 85 ? "oklch(0.22 0.08 145)" : "oklch(0.22 0.05 65)",
                          color: entry.confidence >= 85 ? "oklch(0.72 0.18 145)" : "oklch(0.72 0.16 65)"
                        },
                        children: [
                          entry.confidence,
                          "%"
                        ]
                      }
                    ),
                    entry.behaviorCoupled && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[6px]",
                        style: { color: "oklch(0.65 0.20 55)" },
                        children: "⚡"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "flex-1 h-[2px]",
                        style: { background: "oklch(0.12 0.02 260)" },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              height: "100%",
                              width: `${Math.min(1, entry.intensity) * 100}%`,
                              background: getCircuitColor(entry.circuitType ?? "")
                            }
                          }
                        )
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px] italic leading-tight",
                      style: {
                        color: idx === 0 ? "oklch(0.82 0.16 195)" : "oklch(0.58 0.08 220)"
                      },
                      children: entry.thought
                    }
                  ),
                  expandedIdx === idx && entry.provenance && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-mono text-[7px] mt-1 leading-tight",
                      style: {
                        color: "oklch(0.42 0.06 220)",
                        wordBreak: "break-word"
                      },
                      children: entry.provenance
                    }
                  )
                ]
              },
              `${entry.tick}-${idx}`
            ))
          }
        )
      ]
    }
  );
}
function CriticalityPanel({ neural }) {
  const cs = neural.criticalityState;
  if (!cs) return null;
  const regimeColor = cs.regime === "critical" ? "oklch(0.72 0.22 140)" : cs.regime === "sub-critical" ? "oklch(0.72 0.18 55)" : "oklch(0.68 0.28 25)";
  const sigmaRatio = Math.max(0, Math.min(1, (cs.branchingRatio - 0.5) / 1));
  const greenZone = cs.regime === "critical";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "shrink-0 px-3 py-2 border-t",
      style: {
        borderColor: "oklch(0.22 0.06 255)",
        background: "oklch(0.06 0.015 265)"
      },
      "data-ocid": "criticality.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8px] tracking-widest uppercase font-bold",
              style: { color: "oklch(0.65 0.18 280)" },
              children: "⬡ Criticality Monitor"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] ml-auto px-1 rounded",
              style: { color: regimeColor, background: "oklch(0.1 0.02 265)" },
              children: cs.regime.toUpperCase()
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px] w-12 shrink-0",
                style: { color: "oklch(0.42 0.06 220)" },
                children: "σ (branch)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex-1 h-[4px] rounded overflow-hidden",
                style: { background: "oklch(0.12 0.03 260)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        width: `${sigmaRatio * 100}%`,
                        height: "100%",
                        background: greenZone ? "oklch(0.72 0.22 140)" : regimeColor,
                        borderRadius: "2px",
                        transition: "width 0.8s ease"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "relative", height: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        position: "absolute",
                        left: "40%",
                        width: "20%",
                        height: "4px",
                        top: "-4px",
                        background: "oklch(0.72 0.22 140 / 0.25)",
                        borderRadius: "2px"
                      }
                    }
                  ) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px] font-bold w-10 text-right",
                style: { color: regimeColor },
                children: cs.branchingRatio.toFixed(3)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-3 gap-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px]",
                  style: { color: "oklch(0.38 0.05 220)" },
                  children: "Exc. Gain"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px] font-bold",
                  style: { color: "oklch(0.72 0.22 140)" },
                  children: cs.excitabilityGain.toFixed(3)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px]",
                  style: { color: "oklch(0.38 0.05 220)" },
                  children: "Inh. Gain"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px] font-bold",
                  style: { color: "oklch(0.72 0.18 55)" },
                  children: cs.inhibitoryGain.toFixed(3)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px]",
                  style: { color: "oklch(0.38 0.05 220)" },
                  children: "Power-law fit"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[7px] font-bold",
                  style: { color: "oklch(0.65 0.18 195)" },
                  children: [
                    (cs.powerLawFit * 100).toFixed(0),
                    "%"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px]",
                  style: { color: "oklch(0.38 0.05 220)" },
                  children: "Adj. events"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px] font-bold",
                  style: { color: "oklch(0.52 0.12 280)" },
                  children: cs.adjustmentEvents
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
function OscillatoryPanel({ neural }) {
  const os = neural.oscillatoryState;
  if (!os) return null;
  const bands = [
    {
      label: "Theta",
      value: os.memoryEncodeGate,
      color: "oklch(0.72 0.22 140)",
      desc: "4-8 Hz · Memory gate"
    },
    {
      label: "Gamma",
      value: os.localComputeGate,
      color: "oklch(0.72 0.26 280)",
      desc: "30-80 Hz · Local compute"
    },
    {
      label: "Alpha",
      value: os.suppressionGate,
      color: "oklch(0.72 0.18 55)",
      desc: "8-12 Hz · Suppression"
    },
    {
      label: "Beta",
      value: os.motorGate,
      color: "oklch(0.68 0.28 25)",
      desc: "13-30 Hz · Motor gate"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "shrink-0 px-3 py-2 border-t",
      style: {
        borderColor: "oklch(0.22 0.06 255)",
        background: "oklch(0.06 0.015 265)"
      },
      "data-ocid": "oscillatory.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8px] tracking-widest uppercase font-bold",
              style: { color: "oklch(0.65 0.18 280)" },
              children: "∿ Oscillatory State"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 ml-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px]",
                style: {
                  color: os.encodingWindowOpen ? "oklch(0.72 0.22 140)" : "oklch(0.25 0.04 220)"
                },
                children: "● ENC"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px]",
                style: {
                  color: os.retrievalWindowOpen ? "oklch(0.60 0.22 220)" : "oklch(0.25 0.04 220)"
                },
                children: "● RET"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          bands.map(({ label, value, color, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", title: desc, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px] w-10 shrink-0",
                style: { color: "oklch(0.42 0.06 220)" },
                children: label
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex-1 h-[3px] rounded overflow-hidden",
                style: { background: "oklch(0.12 0.03 260)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      width: `${value * 100}%`,
                      height: "100%",
                      background: color,
                      borderRadius: "2px",
                      transition: "width 0.6s ease"
                    }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-mono text-[7px] w-8 text-right",
                style: { color },
                children: [
                  (value * 100).toFixed(0),
                  "%"
                ]
              }
            )
          ] }, label)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px]",
                style: { color: "oklch(0.38 0.05 220)" },
                children: "θ-γ Coupling"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-mono text-[7px] font-bold",
                style: { color: "oklch(0.65 0.22 195)" },
                children: [
                  (os.thetaGammaCoupling * 100).toFixed(0),
                  "%"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function NeuromorphicPanel({ neural }) {
  const ns = neural.neuromorphicState;
  if (!ns) return null;
  const GATEWAY = ["Thalamus", "Amygdala", "Hippocampus", "dACC", "LC-NE"];
  const vmColor = (vm) => {
    if (vm >= 0.85) return "oklch(0.72 0.28 25)";
    if (vm >= 0.6) return "oklch(0.80 0.26 55)";
    return "oklch(0.60 0.22 220)";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "shrink-0 px-3 py-2 border-t",
      style: {
        borderColor: "oklch(0.22 0.06 255)",
        background: "oklch(0.055 0.012 265)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8px] tracking-widest uppercase font-bold",
              style: { color: "oklch(0.68 0.22 175)" },
              children: "⚡ Neuromorphic Spike Monitor"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[7px] ml-auto",
              style: { color: "oklch(0.35 0.05 220)" },
              children: [
                "LIF Gateway • ",
                ns.networkFiringRate.toFixed(1),
                " Hz net"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: GATEWAY.map((regionId) => {
          const rs = ns.regions.get(regionId);
          if (!rs) return null;
          const vm = Math.max(0, Math.min(1, rs.V_m));
          const adapt = Math.min(1, rs.adaptationCurrent);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px] w-[62px] shrink-0 truncate",
                style: { color: "oklch(0.45 0.08 220)" },
                children: regionId
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex-1 h-[3px] rounded",
                style: { background: "oklch(0.12 0.03 260)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      height: "100%",
                      width: `${Math.round(vm * 100)}%`,
                      background: vmColor(vm),
                      borderRadius: "2px",
                      transition: "width 0.2s ease"
                    }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-[20px] h-[3px] rounded",
                style: { background: "oklch(0.12 0.03 260)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      height: "100%",
                      width: `${Math.round(adapt * 100)}%`,
                      background: "oklch(0.50 0.16 290)",
                      borderRadius: "2px"
                    }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-mono text-[7px] w-[28px] text-right shrink-0",
                style: { color: "oklch(0.55 0.12 175)" },
                children: [
                  rs.firingRate.toFixed(0),
                  "Hz"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-mono text-[7px] w-[22px] text-right shrink-0",
                style: {
                  color: rs.gainModulation > 1.2 ? "oklch(0.75 0.22 55)" : "oklch(0.38 0.06 220)"
                },
                children: [
                  "×",
                  rs.gainModulation.toFixed(1)
                ]
              }
            ),
            rs.isBursting && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[6px] px-1 rounded",
                style: {
                  background: "oklch(0.25 0.12 25)",
                  color: "oklch(0.78 0.26 25)"
                },
                children: "BURST"
              }
            )
          ] }, regionId);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 mt-1 pt-1 border-t",
            style: { borderColor: "oklch(0.16 0.04 255)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[7px]",
                  style: { color: "oklch(0.35 0.05 220)" },
                  children: [
                    "spikes: ",
                    ns.totalSpikes
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[7px]",
                  style: { color: "oklch(0.35 0.05 220)" },
                  children: [
                    "bursts: ",
                    ns.burstCount
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[7px] ml-auto",
                  style: { color: "oklch(0.50 0.16 290)" },
                  children: [
                    "E-cost: ",
                    (ns.energyCost * 100).toFixed(1),
                    "%"
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function GlobalWorkspacePanel({ neural }) {
  const gw = neural.globalWorkspaceState;
  if (!gw) return null;
  const availability = gw.globalAvailability ?? 0;
  const coherence = gw.workspaceCoherence ?? 0;
  const isActive = gw.broadcastActive;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "shrink-0 px-3 py-2 border-t",
      style: {
        borderColor: "oklch(0.22 0.06 255)",
        background: "oklch(0.06 0.015 265)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8px] tracking-widest uppercase font-bold",
              style: {
                color: isActive ? "oklch(0.82 0.28 80)" : "oklch(0.55 0.16 260)"
              },
              children: "◎ Global Workspace"
            }
          ),
          isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                display: "inline-block",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "oklch(0.82 0.28 80)",
                boxShadow: "0 0 8px oklch(0.82 0.28 80)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[7px] ml-auto",
              style: { color: "oklch(0.35 0.05 220)" },
              children: [
                "ignitions: ",
                gw.ignitionEvents
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] w-[55px] shrink-0",
              style: { color: "oklch(0.42 0.08 220)" },
              children: "BROADCAST"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex-1 h-[3px] rounded",
              style: { background: "oklch(0.12 0.03 260)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    height: "100%",
                    width: `${Math.round(availability * 100)}%`,
                    background: isActive ? "oklch(0.82 0.28 80)" : "oklch(0.30 0.06 260)",
                    borderRadius: "2px",
                    transition: "width 0.3s ease"
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] w-[18px] text-right",
              style: { color: "oklch(0.55 0.14 80)" },
              children: isActive ? "ON" : "off"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] w-[55px] shrink-0",
              style: { color: "oklch(0.42 0.08 220)" },
              children: "COHERENCE"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex-1 h-[3px] rounded",
              style: { background: "oklch(0.12 0.03 260)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    height: "100%",
                    width: `${Math.round(coherence * 100)}%`,
                    background: "oklch(0.68 0.22 195)",
                    borderRadius: "2px",
                    transition: "width 0.5s ease"
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[7px] w-[22px] text-right",
              style: { color: "oklch(0.68 0.22 195)" },
              children: [
                (coherence * 100).toFixed(0),
                "%"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] w-[55px] shrink-0",
              style: { color: "oklch(0.42 0.08 220)" },
              children: "COALITION"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[7px]",
              style: { color: "oklch(0.55 0.14 80)" },
              children: [
                gw.meanCoalitionSize.toFixed(1),
                " regions"
              ]
            }
          ),
          gw.currentBroadcast && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] ml-auto truncate max-w-[90px]",
              style: { color: "oklch(0.60 0.18 220)" },
              children: gw.currentBroadcast.dominantRegion
            }
          )
        ] }),
        gw.currentBroadcast && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[6px] px-1.5 py-0.5 rounded",
            style: {
              background: "oklch(0.15 0.08 80)",
              color: "oklch(0.78 0.24 80)"
            },
            children: gw.currentBroadcast.cognitiveMode
          }
        ) })
      ]
    }
  );
}
function SensoryCouplingPanel() {
  const sensoryRelevance = 0.62;
  const uncertaintyBurden = 0.24;
  const degradationUnderLoad = 0.18;
  const salienceBoost = sensoryRelevance * (1 - uncertaintyBurden * 0.6) * (1 - degradationUnderLoad * 0.7);
  const wmGatePressure = uncertaintyBurden * 0.5 + degradationUnderLoad * 0.3;
  const fields = [
    ["SENSORY RELEVANCE", sensoryRelevance.toFixed(2)],
    ["UNCERTAINTY BURDEN", uncertaintyBurden.toFixed(2)],
    ["DEGRADATION/LOAD", degradationUnderLoad.toFixed(2)],
    ["SALIENCE BOOST", salienceBoost.toFixed(3)],
    ["WM GATE PRESSURE", wmGatePressure.toFixed(3)]
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "shrink-0 px-3 py-2 border-t",
      style: {
        borderColor: "oklch(0.22 0.06 255)",
        background: "oklch(0.055 0.012 265)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8px] tracking-widest uppercase font-bold",
              style: { color: "oklch(0.68 0.18 200)" },
              children: "◈ Sensory Coupling"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] ml-auto",
              style: { color: "oklch(0.35 0.05 220)" },
              children: "salience ↔ WM gate"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-5 gap-1", children: fields.map(([label, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded px-1 py-1 flex flex-col items-center",
            style: { background: "oklch(0.09 0.02 265)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[6px] uppercase tracking-widest text-center leading-tight mb-0.5",
                  style: { color: "oklch(0.38 0.06 220)" },
                  children: label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[9px] font-bold",
                  style: { color: "oklch(0.72 0.18 200)" },
                  children: value
                }
              )
            ]
          },
          label
        )) })
      ]
    }
  );
}
function CardioNervousPanel({ neural }) {
  const cn = neural.cardioNervousState;
  if (!cn) return null;
  const hrColor = cn.heartRateBPM > 100 ? "oklch(0.72 0.28 25)" : cn.heartRateBPM > 80 ? "oklch(0.80 0.26 55)" : "oklch(0.72 0.22 145)";
  const vagalColor = cn.vagalToneIndex > 0.6 ? "oklch(0.72 0.22 145)" : cn.vagalToneIndex > 0.3 ? "oklch(0.80 0.26 55)" : "oklch(0.72 0.28 25)";
  const symBal = cn.amygdalaSympatheticDrive;
  const paraBal = cn.pfcHeartCoupling;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "shrink-0 px-3 py-2 border-t",
      style: {
        borderColor: "oklch(0.22 0.06 255)",
        background: "oklch(0.055 0.012 265)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8px] tracking-widest uppercase font-bold",
              style: { color: "oklch(0.72 0.22 25)" },
              children: "♥ Cardiovascular-Nervous Axis"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[8px] ml-auto font-bold",
              style: { color: hrColor },
              children: [
                Math.round(cn.heartRateBPM),
                " BPM"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] w-[55px] shrink-0",
              style: { color: "oklch(0.42 0.08 220)" },
              children: "HR"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex-1 h-[3px] rounded",
              style: { background: "oklch(0.12 0.03 260)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    height: "100%",
                    width: `${Math.round((cn.heartRateBPM - 45) / 85 * 100)}%`,
                    background: hrColor,
                    borderRadius: "2px",
                    transition: "width 0.5s ease"
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[7px] w-[30px] text-right",
              style: { color: hrColor },
              children: [
                Math.round(cn.heartRateBPM),
                "bpm"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] w-[55px] shrink-0",
              style: { color: "oklch(0.42 0.08 220)" },
              children: "HRV/RMSSD"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex-1 h-[3px] rounded",
              style: { background: "oklch(0.12 0.03 260)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    height: "100%",
                    width: `${Math.min(100, Math.round(cn.rmssd / 50 * 100))}%`,
                    background: "oklch(0.68 0.22 175)",
                    borderRadius: "2px",
                    transition: "width 0.8s ease"
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[7px] w-[30px] text-right",
              style: { color: "oklch(0.68 0.22 175)" },
              children: [
                cn.rmssd.toFixed(0),
                "ms"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] w-[55px] shrink-0",
              style: { color: "oklch(0.42 0.08 220)" },
              children: "VAGAL TONE"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex-1 h-[3px] rounded",
              style: { background: "oklch(0.12 0.03 260)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    height: "100%",
                    width: `${Math.round(cn.vagalToneIndex * 100)}%`,
                    background: vagalColor,
                    borderRadius: "2px",
                    transition: "width 0.8s ease"
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[7px] w-[30px] text-right",
              style: { color: vagalColor },
              children: [
                (cn.vagalToneIndex * 100).toFixed(0),
                "%"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] w-[55px] shrink-0",
              style: { color: "oklch(0.42 0.08 220)" },
              children: "COHERENCE"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex-1 h-[3px] rounded",
              style: { background: "oklch(0.12 0.03 260)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    height: "100%",
                    width: `${Math.round(cn.heartCoherence * 100)}%`,
                    background: "oklch(0.72 0.22 145)",
                    borderRadius: "2px",
                    transition: "width 0.8s ease"
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[7px] w-[30px] text-right",
              style: { color: "oklch(0.72 0.22 145)" },
              children: [
                (cn.heartCoherence * 100).toFixed(0),
                "%"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] w-[55px] shrink-0",
              style: { color: "oklch(0.42 0.08 220)" },
              children: "RSA AMP"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex-1 h-[3px] rounded",
              style: { background: "oklch(0.12 0.03 260)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    height: "100%",
                    width: `${Math.min(100, Math.round(cn.rsaAmplitude / 15 * 100))}%`,
                    background: "oklch(0.68 0.20 195)",
                    borderRadius: "2px",
                    transition: "width 0.8s ease"
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[7px] w-[30px] text-right",
              style: { color: "oklch(0.68 0.20 195)" },
              children: [
                "±",
                cn.rsaAmplitude.toFixed(1)
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] w-[55px] shrink-0",
              style: { color: "oklch(0.42 0.08 220)" },
              children: "BAROREFLEX"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex-1 h-[3px] rounded",
              style: { background: "oklch(0.12 0.03 260)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    height: "100%",
                    width: `${Math.round(cn.baroreceptorFiring * 100)}%`,
                    background: "oklch(0.60 0.18 260)",
                    borderRadius: "2px",
                    transition: "width 0.5s ease"
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[7px] w-[30px] text-right",
              style: { color: "oklch(0.60 0.18 260)" },
              children: [
                (cn.baroreceptorFiring * 100).toFixed(0),
                "%"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "mt-1 pt-1 border-t",
            style: { borderColor: "oklch(0.16 0.04 255)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 mb-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[6px] uppercase tracking-widest",
                  style: { color: "oklch(0.35 0.05 220)" },
                  children: "ANS BALANCE"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-1 h-[5px] rounded overflow-hidden",
                  style: { background: "oklch(0.12 0.03 260)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          height: "100%",
                          width: `${Math.round(symBal * 50)}%`,
                          background: "oklch(0.65 0.26 25)",
                          transition: "width 0.5s ease"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          width: "2px",
                          height: "100%",
                          background: "oklch(0.25 0.06 255)",
                          flexShrink: 0
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          height: "100%",
                          width: `${Math.round(paraBal * 50)}%`,
                          background: "oklch(0.65 0.22 145)",
                          transition: "width 0.5s ease"
                        }
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono text-[6px]",
                    style: { color: "oklch(0.65 0.26 25)" },
                    children: [
                      "SYM ",
                      (cn.amygdalaSympatheticDrive * 100).toFixed(0),
                      "%"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono text-[6px]",
                    style: { color: "oklch(0.65 0.22 145)" },
                    children: [
                      "PNS ",
                      (cn.pfcHeartCoupling * 100).toFixed(0),
                      "%"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono text-[6px]",
                    style: { color: "oklch(0.35 0.05 220)" },
                    children: [
                      "Amy→SNS: ",
                      (cn.amygdalaSympatheticDrive * 100).toFixed(0),
                      "%"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono text-[6px]",
                    style: { color: "oklch(0.35 0.05 220)" },
                    children: [
                      "PFC→Vagal: ",
                      (cn.pfcHeartCoupling * 100).toFixed(0),
                      "%"
                    ]
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
function NeuromodulatorPanel({ neural }) {
  const nm = neural.neuromodulatorLevels;
  const pg = neural.plasticityGates;
  if (!nm || !pg) return null;
  const channels = [
    {
      label: "DA",
      value: nm.dopamine,
      color: "oklch(0.68 0.28 55)",
      desc: "Dopamine · Reward/motivation"
    },
    {
      label: "NE",
      value: nm.norepinephrine,
      color: "oklch(0.68 0.28 25)",
      desc: "Norepinephrine · Arousal/alertness"
    },
    {
      label: "5HT",
      value: nm.serotonin,
      color: "oklch(0.72 0.22 140)",
      desc: "Serotonin · Patience/recovery"
    },
    {
      label: "ACh",
      value: nm.acetylcholine,
      color: "oklch(0.72 0.26 195)",
      desc: "Acetylcholine · Encoding mode"
    },
    {
      label: "GABA",
      value: nm.gaba,
      color: "oklch(0.52 0.12 280)",
      desc: "GABA · Inhibitory stability"
    },
    {
      label: "Glu",
      value: nm.glutamate,
      color: "oklch(0.60 0.18 310)",
      desc: "Glutamate · Excitatory drive"
    }
  ];
  const modeColor = {
    encoding: "oklch(0.72 0.22 140)",
    retrieval: "oklch(0.60 0.22 220)",
    consolidation: "oklch(0.52 0.12 280)",
    exploratory: "oklch(0.72 0.26 195)",
    stressed: "oklch(0.68 0.28 25)"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "shrink-0 px-3 py-2 border-t",
      style: {
        borderColor: "oklch(0.22 0.06 255)",
        background: "oklch(0.06 0.015 265)"
      },
      "data-ocid": "neuromodulator.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8px] tracking-widest uppercase font-bold",
              style: { color: "oklch(0.65 0.18 280)" },
              children: "⬡ Neuromodulators"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] ml-auto px-1 rounded",
              style: {
                color: modeColor[pg.mode] ?? "oklch(0.5 0.1 220)",
                background: "oklch(0.1 0.02 265)"
              },
              children: pg.mode.toUpperCase()
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-0.5", children: channels.map(({ label, value, color, desc }) => {
          const isDominant = pg.dominantModulator === label;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", title: desc, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px] w-8 shrink-0",
                style: {
                  color: isDominant ? color : "oklch(0.42 0.06 220)",
                  fontWeight: isDominant ? "bold" : "normal"
                },
                children: label
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex-1 h-[3px] rounded overflow-hidden",
                style: { background: "oklch(0.12 0.03 260)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      width: `${value * 100}%`,
                      height: "100%",
                      background: isDominant ? color : `${color}99`,
                      borderRadius: "2px",
                      transition: "width 0.6s ease"
                    }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-mono text-[7px] w-8 text-right",
                style: { color: isDominant ? color : "oklch(0.40 0.05 220)" },
                children: [
                  (value * 100).toFixed(0),
                  "%"
                ]
              }
            )
          ] }, label);
        }) }),
        pg.plasticityBlocked && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "mt-1 font-mono text-[7px] text-center",
            style: { color: "oklch(0.52 0.12 280)" },
            children: "⬡ GABA GATE: plasticity suppressed"
          }
        )
      ]
    }
  );
}
function PredictiveCodingPanel({ neural }) {
  const pc = neural.predictiveCoding;
  if (!pc) return null;
  const gradient = neural.tick > 0 && pc.globalFreeEnergy < 2 ? "↓ improving" : "↑ worsening";
  const gradientColor = gradient.startsWith("↓") ? "oklch(0.72 0.22 140)" : "oklch(0.68 0.28 25)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "shrink-0 px-3 py-2 border-t",
      style: {
        borderColor: "oklch(0.22 0.06 255)",
        background: "oklch(0.06 0.015 265)"
      },
      "data-ocid": "predictive.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8px] tracking-widest uppercase font-bold",
              style: { color: "oklch(0.65 0.18 280)" },
              children: "∿ Predictive Coding"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] ml-auto font-bold",
              style: { color: gradientColor },
              children: gradient
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-3 gap-y-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px]",
                style: { color: "oklch(0.38 0.05 220)" },
                children: "Free Energy"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px] font-bold",
                style: { color: "oklch(0.60 0.22 220)" },
                children: pc.globalFreeEnergy.toFixed(3)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px]",
                style: { color: "oklch(0.38 0.05 220)" },
                children: "Mismatch"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-mono text-[7px] font-bold",
                style: {
                  color: pc.globalMismatch > 0.3 ? "oklch(0.68 0.28 25)" : "oklch(0.72 0.22 140)"
                },
                children: [
                  (pc.globalMismatch * 100).toFixed(0),
                  "%"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px]",
                style: { color: "oklch(0.38 0.05 220)" },
                children: "Surprise"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-mono text-[7px] font-bold",
                style: {
                  color: pc.surpriseScore > 0.5 ? "oklch(0.68 0.28 25)" : "oklch(0.60 0.22 220)"
                },
                children: [
                  (pc.surpriseScore * 100).toFixed(0),
                  "%"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px]",
                style: { color: "oklch(0.38 0.05 220)" },
                children: "Learn Relev."
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-mono text-[7px] font-bold",
                style: { color: "oklch(0.65 0.18 195)" },
                children: [
                  (pc.learningRelevance * 100).toFixed(0),
                  "%"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function HemisphereBalancePanel({ neural }) {
  const data = reactExports.useMemo(() => {
    const s = neural.sympatheticTone;
    const isR = neural.isRunning;
    const leftActivity = Math.min(1, 0.55 + (1 - s) * 0.3 + (isR ? 0.08 : 0));
    const rightActivity = Math.min(1, 0.5 + s * 0.32 + (isR ? 0.06 : 0));
    const callosaRate = Math.min(
      1,
      (leftActivity + rightActivity) / 2 * 0.92
    );
    const coherence = Math.min(
      1,
      1 - Math.abs(leftActivity - rightActivity) * 1.4
    );
    const asymmetry = Math.abs(leftActivity - rightActivity);
    const dominant = leftActivity > rightActivity ? "LEFT" : "RIGHT";
    const topPaths = [
      { label: "M1-L ↔ M1-R", strength: Math.min(1, 0.88 + s * 0.06) },
      {
        label: "mPFC-L ↔ mPFC-R",
        strength: Math.min(1, 0.86 + (isR ? 0.08 : 0))
      },
      { label: "THAL-L ↔ THAL-R", strength: Math.min(1, 0.85 + s * 0.04) }
    ];
    return {
      leftActivity,
      rightActivity,
      callosaRate,
      coherence,
      asymmetry,
      dominant,
      topPaths
    };
  }, [neural.sympatheticTone, neural.isRunning]);
  const GOLD = "oklch(0.78 0.22 80)";
  const GREEN = "oklch(0.68 0.28 140)";
  const BLUE = "#3b82f6";
  const ORANGE = "#f97316";
  const MUTED2 = "oklch(0.38 0.05 220)";
  const DIM2 = "oklch(0.28 0.04 240)";
  const BORDER2 = "oklch(0.18 0.05 255)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "shrink-0 px-3 py-2 border-t",
      style: { borderColor: BORDER2, background: "oklch(0.065 0.015 265)" },
      "data-ocid": "hemisphere.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8px] tracking-widest uppercase font-bold",
              style: { color: "oklch(0.65 0.22 195)" },
              children: "⬡ Hemisphere Balance"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[7px] px-1.5 py-0.5 rounded ml-auto",
              style: {
                background: data.dominant === "LEFT" ? "rgba(60,100,255,0.2)" : "rgba(255,120,50,0.2)",
                color: data.dominant === "LEFT" ? BLUE : ORANGE,
                border: `1px solid ${data.dominant === "LEFT" ? "rgba(60,100,255,0.4)" : "rgba(255,120,50,0.4)"}`
              },
              children: [
                data.dominant,
                " DOM"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px]",
                  style: { color: "rgba(80,140,255,0.8)" },
                  children: "◀ Left"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[7px] font-bold",
                  style: { color: BLUE },
                  children: [
                    (data.leftActivity * 100).toFixed(0),
                    "%"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  height: 5,
                  background: "oklch(0.14 0.03 260)",
                  borderRadius: 2
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      height: "100%",
                      width: `${data.leftActivity * 100}%`,
                      background: BLUE,
                      borderRadius: 2,
                      transition: "width 0.8s ease"
                    }
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px]",
                  style: { color: "rgba(255,140,60,0.8)" },
                  children: "Right ▶"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[7px] font-bold",
                  style: { color: ORANGE },
                  children: [
                    (data.rightActivity * 100).toFixed(0),
                    "%"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  height: 5,
                  background: "oklch(0.14 0.03 260)",
                  borderRadius: 2
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      height: "100%",
                      width: `${data.rightActivity * 100}%`,
                      background: ORANGE,
                      borderRadius: 2,
                      transition: "width 0.8s ease"
                    }
                  }
                )
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: MUTED2 }, children: "Callosum Xfer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[7px] font-bold",
                  style: { color: GOLD },
                  children: [
                    (data.callosaRate * 100).toFixed(0),
                    "%"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  height: 4,
                  background: "oklch(0.14 0.03 260)",
                  borderRadius: 2
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      height: "100%",
                      width: `${data.callosaRate * 100}%`,
                      background: GOLD,
                      borderRadius: 2,
                      transition: "width 0.8s ease"
                    }
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: MUTED2 }, children: "Inter-Hem. Coh." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[7px] font-bold",
                  style: { color: GREEN },
                  children: [
                    (data.coherence * 100).toFixed(0),
                    "%"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  height: 4,
                  background: "oklch(0.14 0.03 260)",
                  borderRadius: 2
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      height: "100%",
                      width: `${data.coherence * 100}%`,
                      background: GREEN,
                      borderRadius: 2,
                      transition: "width 0.8s ease"
                    }
                  }
                )
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: MUTED2 }, children: "Asymmetry Index" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-mono text-[7px]",
                style: {
                  color: data.asymmetry > 0.25 ? "oklch(0.78 0.22 80)" : GREEN
                },
                children: [
                  data.asymmetry.toFixed(3),
                  " ",
                  data.asymmetry > 0.25 ? "⚠" : "✓"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "relative",
              style: {
                height: 6,
                background: "oklch(0.14 0.03 255)",
                borderRadius: 3
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      position: "absolute",
                      left: "50%",
                      top: 0,
                      width: 1,
                      height: "100%",
                      background: "rgba(255,255,255,0.18)"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      position: "absolute",
                      left: `${50 - data.leftActivity * 46}%`,
                      width: `${data.leftActivity * 46}%`,
                      height: "100%",
                      background: "rgba(60,100,255,0.55)",
                      borderRadius: "3px 0 0 3px"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      position: "absolute",
                      left: "50%",
                      width: `${data.rightActivity * 46}%`,
                      height: "100%",
                      background: "rgba(255,120,50,0.55)",
                      borderRadius: "0 3px 3px 0"
                    }
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[6px]",
                style: { color: "rgba(80,140,255,0.5)" },
                children: "L"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[6px]",
                style: { color: "rgba(255,140,60,0.5)" },
                children: "R"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[7px] tracking-widest uppercase mb-1",
              style: { color: DIM2 },
              children: "Top Cross-Hemisphere Pathways"
            }
          ),
          data.topPaths.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-1.5 mb-0.5",
              "data-ocid": `hemisphere.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: GOLD,
                      flexShrink: 0
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[7px] flex-1",
                    style: { color: "oklch(0.58 0.1 200)" },
                    children: p.label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      width: 48,
                      height: 3,
                      background: "oklch(0.14 0.03 260)",
                      borderRadius: 2
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          height: "100%",
                          width: `${p.strength * 100}%`,
                          background: GOLD,
                          borderRadius: 2
                        }
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono text-[6px]",
                    style: { color: GOLD, minWidth: 22 },
                    children: [
                      (p.strength * 100).toFixed(0),
                      "%"
                    ]
                  }
                )
              ]
            },
            p.label
          ))
        ] })
      ]
    }
  );
}
function BrainTab({ neural }) {
  const { data: canon } = useCanonicalState();
  const { data: neuro } = useNeuroscienceState();
  const { data: fearM } = useFearMissionState();
  reactExports.useEffect(() => {
    var _a;
    if (!canon) return;
    (_a = neural.seedFromBackend) == null ? void 0 : _a.call(neural, {
      coherence: canon.coh,
      arousal: canon.ar,
      identityI: canon.ic,
      fearLevel: fearM == null ? void 0 : fearM.fearLevel,
      vagalTone: neuro == null ? void 0 : neuro.vagalTone,
      consciousnessIndex: neuro == null ? void 0 : neuro.consciousnessIndex,
      kuramotoR: fearM == null ? void 0 : fearM.kuramotoR,
      missionLockActive: fearM == null ? void 0 : fearM.missionLockActive,
      surrenderFloor: fearM == null ? void 0 : fearM.surrenderFloor,
      courageScore: fearM == null ? void 0 : fearM.courageScore,
      groundedScore: fearM == null ? void 0 : fearM.groundedScore
    });
  }, [canon, fearM, neuro, neural]);
  const regionActivities = neural.regionActivity.map(([region, activity]) => ({
    region,
    activity
  }));
  const latestThoughtEntry = neural.thoughtLog[0] ?? null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col overflow-hidden", children: [
    canon && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "shrink-0 flex items-center gap-4 px-3 py-1 border-b font-mono text-[9px] tracking-[0.12em]",
        style: {
          background: "oklch(0.07 0.015 265)",
          borderColor: "oklch(0.18 0.05 255)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.38 0.05 220)" }, children: "ORGANISM LIVE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.38 0.05 220)" }, children: "COH" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                color: canon.coh > 0.7 ? "oklch(0.68 0.28 140)" : canon.coh > 0.4 ? "oklch(0.78 0.22 80)" : "oklch(0.65 0.25 25)"
              },
              children: canon.coh.toFixed(3)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.38 0.05 220)" }, children: "FEAR" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                color: ((fearM == null ? void 0 : fearM.fearLevel) ?? 0) > 0.5 ? "oklch(0.65 0.25 25)" : "oklch(0.68 0.28 140)"
              },
              children: ((fearM == null ? void 0 : fearM.fearLevel) ?? 0).toFixed(3)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.38 0.05 220)" }, children: "KHz" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.72 0.22 195)" }, children: canon.kf.toFixed(3) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.38 0.05 220)" }, children: "ψ-IDX" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.72 0.22 195)" }, children: ((neuro == null ? void 0 : neuro.consciousnessIndex) ?? 0).toFixed(3) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.38 0.05 220)" }, children: "BEAT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.85 0.06 210)" }, children: String(Number(canon.b)).padStart(8, "0") })
        ]
      }
    ),
    neural.saturatedRegions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "shrink-0 px-3 py-2 flex items-start gap-2",
        style: {
          background: "oklch(0.18 0.08 30)",
          borderBottom: "1px solid oklch(0.35 0.12 30)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[9px]",
              style: { color: "oklch(0.85 0.18 30)" },
              children: "⚠ SATURATION DETECTED"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[8px] leading-relaxed",
              style: { color: "oklch(0.72 0.1 30)" },
              children: [
                neural.saturatedRegions.slice(0, 5).join(", "),
                neural.saturatedRegions.length > 5 ? ` +${neural.saturatedRegions.length - 5} more` : "",
                " ",
                "averaging >90% activation."
              ]
            }
          )
        ]
      }
    ),
    (latestThoughtEntry == null ? void 0 : latestThoughtEntry.behaviorCoupled) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "shrink-0 px-3 py-1 flex items-center gap-2",
        style: {
          background: "oklch(0.12 0.05 145 / 0.6)",
          borderBottom: "1px solid oklch(0.45 0.18 145 / 0.3)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                display: "inline-block",
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "oklch(0.72 0.26 145)",
                boxShadow: "0 0 6px oklch(0.72 0.26 145)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8px] tracking-widest",
              style: { color: "oklch(0.72 0.22 145)" },
              children: "LOOP CLOSED · PERCEPTION → STATE → ACTION → LEARNING ACTIVE"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden min-h-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          className: "flex flex-col border-r",
          style: {
            flex: "0 0 60%",
            overflow: "hidden",
            borderColor: "oklch(0.18 0.05 255)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-3 py-1.5 shrink-0 border-b flex items-center justify-between",
                style: {
                  borderColor: "oklch(0.18 0.04 255)",
                  background: "oklch(0.07 0.012 265)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[9px] tracking-widest uppercase",
                      style: { color: "oklch(0.38 0.06 220)" },
                      children: "Neural Connectome · 3D · Live Weights"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px]",
                      style: { color: "oklch(0.5 0.1 195)" },
                      children: "DTI-Calibrated · STDP Active"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex-1 relative",
                "data-ocid": "brain.canvas_target",
                style: { background: "oklch(0.055 0.01 265)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    BrainVisualization,
                    {
                      regionActivities,
                      stdpWeights: neural.stdpWeightSummary
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "absolute top-2 right-2 flex flex-col gap-1 pointer-events-none",
                      style: {
                        background: "oklch(0.08 0.015 260 / 0.88)",
                        border: "1px solid oklch(0.18 0.05 255)",
                        padding: "4px 6px"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "font-mono text-[7px] tracking-widest uppercase mb-1",
                            style: { color: "oklch(0.35 0.05 220)" },
                            children: "Activity + Weight"
                          }
                        ),
                        [
                          { label: "INACTIVE", hsl: "hsl(232, 50%, 20%)" },
                          { label: "LOW", hsl: "hsl(200, 60%, 35%)" },
                          { label: "MEDIUM", hsl: "hsl(185, 75%, 50%)" },
                          { label: "HIGH", hsl: "hsl(50, 85%, 60%)" },
                          { label: "PEAK", hsl: "hsl(15, 90%, 55%)" }
                        ].map(({ label, hsl }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "w-2 h-2 rounded-full",
                              style: { background: hsl }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[7px]",
                              style: { color: "oklch(0.38 0.05 220)" },
                              children: label
                            }
                          )
                        ] }, label)),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            className: "mt-1 pt-1 border-t",
                            style: { borderColor: "oklch(0.2 0.04 255)" },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "div",
                                {
                                  className: "font-mono text-[7px] mb-0.5",
                                  style: { color: "oklch(0.35 0.05 220)" },
                                  children: "Conn Weight"
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "div",
                                  {
                                    className: "h-1 w-10 rounded",
                                    style: {
                                      background: "linear-gradient(to right, hsl(220,70%,40%), hsl(15,80%,55%))"
                                    }
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "span",
                                  {
                                    className: "font-mono text-[6px]",
                                    style: { color: "oklch(0.38 0.05 220)" },
                                    children: "lo→hi"
                                  }
                                )
                              ] })
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "mt-1 pt-1 border-t",
                            style: { borderColor: "oklch(0.2 0.04 255)" },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: "font-mono text-[7px]",
                                style: { color: "oklch(0.82 0.22 80)" },
                                children: "⚡ = active trace"
                              }
                            )
                          }
                        )
                      ]
                    }
                  )
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          className: "flex flex-col",
          style: { flex: 1, overflow: "hidden" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "px-3 py-1.5 shrink-0 border-b",
                style: {
                  borderColor: "oklch(0.18 0.04 255)",
                  background: "oklch(0.07 0.012 265)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[9px] tracking-widest uppercase",
                    style: { color: "oklch(0.38 0.06 220)" },
                    children: "Neural Stats · Matrix · Live Readouts"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(HemisphereBalancePanel, { neural }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden min-h-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatsPanel, { neural }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              LiveThoughtFeed,
              {
                thoughtLog: neural.thoughtLog,
                isRunning: neural.isRunning
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ANSPanel, { ansState: neural.ansState, events: neural.eventLog }),
            neural.selfStateModel && /* @__PURE__ */ jsxRuntimeExports.jsx(
              CognitiveDashboard,
              {
                selfState: neural.selfStateModel,
                goalHierarchy: neural.goalHierarchy,
                predictionState: neural.predictionState,
                failureMemory: neural.failureMemory
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CriticalityPanel, { neural }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(OscillatoryPanel, { neural }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(NeuromodulatorPanel, { neural }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PredictiveCodingPanel, { neural }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(NeuromorphicPanel, { neural }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(GlobalWorkspacePanel, { neural }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardioNervousPanel, { neural }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SensoryCouplingPanel, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircuitMotifsPanel, { state: neural.circuitMotifState }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "shrink-0 px-3 py-2 border-t",
                style: {
                  borderColor: "oklch(0.22 0.06 255)",
                  background: "oklch(0.06 0.015 265)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[8px] tracking-widest uppercase font-bold",
                        style: { color: "oklch(0.65 0.18 280)" },
                        children: "⬡ Metacognitive Monitor"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] ml-auto",
                        style: { color: "oklch(0.35 0.05 220)" },
                        children: "Anterior PFC + Precuneus"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "flex-1 h-[3px] rounded",
                        style: { background: "oklch(0.14 0.03 260)" },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              height: "100%",
                              width: `${Math.round((neural.metacognitiveConfidence ?? 0) * 100)}%`,
                              background: "oklch(0.68 0.22 280)",
                              borderRadius: "2px",
                              transition: "width 0.5s ease"
                            }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[8px] shrink-0",
                        style: { color: "oklch(0.68 0.22 280)" },
                        children: [
                          Math.round((neural.metacognitiveConfidence ?? 0) * 100),
                          "%"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-mono text-[7px] mt-0.5",
                      style: { color: "oklch(0.32 0.05 220)" },
                      children: "Read-only observer circuit · cannot alter firing (Frith 2002)"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "mt-2 pt-2 border-t",
                      style: { borderColor: "oklch(0.18 0.04 255)" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-[8px] tracking-widest uppercase font-bold block mb-1",
                            style: { color: "oklch(0.55 0.18 175)" },
                            children: "⚡ Sparse Compute"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[7px] w-[62px] shrink-0",
                              style: { color: "oklch(0.42 0.08 220)" },
                              children: "SPARSE EFF"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "flex-1 h-[3px] rounded",
                              style: { background: "oklch(0.14 0.03 260)" },
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "div",
                                {
                                  style: {
                                    height: "100%",
                                    width: `${Math.round((neural.sparseComputeEfficiency ?? 0) * 100)}%`,
                                    background: "oklch(0.65 0.22 175)",
                                    borderRadius: "2px",
                                    transition: "width 0.8s ease"
                                  }
                                }
                              )
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              className: "font-mono text-[7px] w-[28px] text-right shrink-0",
                              style: { color: "oklch(0.65 0.22 175)" },
                              children: [
                                Math.round((neural.sparseComputeEfficiency ?? 0) * 100),
                                "%"
                              ]
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[7px] w-[62px] shrink-0",
                              style: { color: "oklch(0.42 0.08 220)" },
                              children: "ACTIVE REG"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "flex-1 h-[3px] rounded",
                              style: { background: "oklch(0.14 0.03 260)" },
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "div",
                                {
                                  style: {
                                    height: "100%",
                                    width: `${Math.round((neural.activeRegionFraction ?? 0) * 100)}%`,
                                    background: "oklch(0.60 0.20 140)",
                                    borderRadius: "2px",
                                    transition: "width 0.8s ease"
                                  }
                                }
                              )
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              className: "font-mono text-[7px] w-[28px] text-right shrink-0",
                              style: { color: "oklch(0.60 0.20 140)" },
                              children: [
                                Math.round((neural.activeRegionFraction ?? 0) * 246),
                                "/246"
                              ]
                            }
                          )
                        ] })
                      ]
                    }
                  )
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          className: "rounded border",
          style: {
            borderColor: "oklch(0.20 0.05 255)",
            background: "oklch(0.09 0.02 255)"
          },
          "data-ocid": "brain.governance.panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-3 py-2 border-b",
                style: { borderColor: "oklch(0.18 0.04 255)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[9px] tracking-widest uppercase font-bold",
                      style: { color: "oklch(0.72 0.22 195)" },
                      children: "🧠 Cognitive Governance"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px] ml-2",
                      style: { color: "oklch(0.38 0.07 220)" },
                      children: "6 permanent principles · emergence-preserving control spine"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 grid grid-cols-1 gap-3", children: (() => {
              var _a;
              const gm = neural.governanceMetrics;
              if (!gm) return null;
              const pv = gm.softPriorVector;
              const priorKeys = [
                "navigation",
                "threat",
                "memory",
                "regulation",
                "social",
                "exploration"
              ];
              const priorColors = {
                navigation: "oklch(0.65 0.22 240)",
                threat: "oklch(0.62 0.25 20)",
                memory: "oklch(0.68 0.20 280)",
                regulation: "oklch(0.65 0.22 175)",
                social: "oklch(0.70 0.18 130)",
                exploration: "oklch(0.68 0.22 70)"
              };
              const inf = gm.influenceFactors;
              const infLabels = [
                ["P_m", "PRIOR"],
                ["Q_m", "PREC"],
                ["S_m", "SAL"],
                ["C_m", "CONF"],
                ["G_m", "GOAL"],
                ["R_m", "REG"],
                ["E_m", "EFF"]
              ];
              const hc = gm.homeostaticCorrection;
              const hcColor = hc.magnitude < 0.1 ? "oklch(0.62 0.22 145)" : hc.magnitude < 0.4 ? "oklch(0.72 0.22 70)" : "oklch(0.65 0.22 20)";
              const tierColors = {
                SHORT: "oklch(0.55 0.10 220)",
                MEDIUM: "oklch(0.62 0.18 280)",
                HIGH: "oklch(0.70 0.22 70)",
                SPECIAL: "oklch(0.65 0.25 20)"
              };
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[8px] tracking-widest uppercase font-bold block mb-1",
                        style: { color: "oklch(0.55 0.12 240)" },
                        children: "1 · Soft Priors"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5", children: priorKeys.map((key) => {
                      const val = pv[key] ?? 0;
                      const isActive = gm.softPriorActive === key;
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "flex items-center gap-1.5",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "span",
                              {
                                className: "font-mono text-[7px] w-[58px] shrink-0 uppercase",
                                style: {
                                  color: isActive ? priorColors[key] : "oklch(0.38 0.07 220)"
                                },
                                children: [
                                  isActive ? "▶ " : "  ",
                                  key.slice(0, 6)
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: "flex-1 h-[4px] rounded",
                                style: { background: "oklch(0.14 0.03 260)" },
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "div",
                                  {
                                    style: {
                                      height: "100%",
                                      width: `${Math.round(val * 100)}%`,
                                      background: isActive ? priorColors[key] : "oklch(0.30 0.08 240)",
                                      borderRadius: "2px",
                                      transition: "width 0.6s ease"
                                    }
                                  }
                                )
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "font-mono text-[7px] w-[24px] text-right shrink-0",
                                style: {
                                  color: isActive ? priorColors[key] : "oklch(0.38 0.07 220)"
                                },
                                children: Math.round(val * 100)
                              }
                            )
                          ]
                        },
                        key
                      );
                    }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[8px] tracking-widest uppercase font-bold block mb-1",
                        style: { color: "oklch(0.55 0.12 195)" },
                        children: "2 · Influence Law I_m"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "font-mono text-[7px] mb-1.5 px-1.5 py-1 rounded",
                        style: {
                          background: "oklch(0.12 0.03 255)",
                          color: "oklch(0.45 0.08 220)"
                        },
                        children: [
                          "P×Q×S×C×G×R×E = ",
                          gm.influenceTop.toFixed(3)
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5", children: infLabels.map(([key, label]) => {
                      const val = inf[key] ?? 0;
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "flex items-center gap-1.5",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "font-mono text-[7px] w-[28px] shrink-0",
                                style: { color: "oklch(0.42 0.08 220)" },
                                children: label
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: "flex-1 h-[3px] rounded",
                                style: { background: "oklch(0.14 0.03 260)" },
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "div",
                                  {
                                    style: {
                                      height: "100%",
                                      width: `${Math.round(val * 100)}%`,
                                      background: "oklch(0.62 0.20 195)",
                                      borderRadius: "2px",
                                      transition: "width 0.5s ease"
                                    }
                                  }
                                )
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "font-mono text-[7px] w-[24px] text-right shrink-0",
                                style: { color: "oklch(0.55 0.12 195)" },
                                children: val.toFixed(2)
                              }
                            )
                          ]
                        },
                        key
                      );
                    }) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[8px] tracking-widest uppercase font-bold",
                        style: { color: "oklch(0.55 0.12 280)" },
                        children: "3 · Working Memory Gate"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[7px]",
                        style: { color: "oklch(0.45 0.10 280)" },
                        children: [
                          Math.round(gm.wmOccupancy * 8),
                          "/8 slots"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-1", children: [1, 2, 3, 4, 5, 6, 7, 8].map((slotPos) => {
                    var _a2;
                    const slotIdx = slotPos - 1;
                    const slot = (_a2 = gm.wmSlots) == null ? void 0 : _a2[slotIdx];
                    return function renderSlot() {
                      var _a3, _b;
                      const typeColors = {
                        SITUATION: "oklch(0.62 0.20 195)",
                        BODY_STATE: "oklch(0.65 0.22 145)",
                        CONFLICT: "oklch(0.65 0.22 20)",
                        GOAL: "oklch(0.68 0.22 70)",
                        MEMORY: "oklch(0.62 0.20 280)"
                      };
                      const bg = slot.occupied ? slot.isCritical ? "oklch(0.15 0.04 20)" : "oklch(0.13 0.03 260)" : "oklch(0.11 0.02 255)";
                      const border = slot.occupied ? slot.isCritical ? "oklch(0.45 0.15 20)" : "oklch(0.22 0.06 260)" : "oklch(0.17 0.04 255)";
                      return /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "rounded px-1.5 py-1 border",
                          style: { background: bg, borderColor: border },
                          "data-ocid": `brain.wm.item.${slotPos}`,
                          children: slot.occupied ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "div",
                              {
                                className: "font-mono text-[6px] uppercase font-bold truncate",
                                style: {
                                  color: typeColors[slot.type ?? "SITUATION"] ?? "oklch(0.55 0.12 220)"
                                },
                                children: [
                                  ((_a3 = slot.type) == null ? void 0 : _a3.slice(0, 4)) ?? "??",
                                  slot.isCritical ? " ★" : ""
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: "font-mono text-[6px] truncate mt-0.5",
                                style: { color: "oklch(0.42 0.08 220)" },
                                children: ((_b = slot.content) == null ? void 0 : _b.slice(0, 12)) ?? ""
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: "mt-0.5 h-[2px] rounded",
                                style: {
                                  background: "oklch(0.14 0.03 260)"
                                },
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "div",
                                  {
                                    style: {
                                      height: "100%",
                                      width: `${Math.round((slot.freshness ?? 0) * 100)}%`,
                                      background: typeColors[slot.type ?? "SITUATION"] ?? "oklch(0.50 0.12 220)",
                                      borderRadius: "2px"
                                    }
                                  }
                                )
                              }
                            )
                          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "font-mono text-[6px] text-center py-0.5",
                              style: { color: "oklch(0.25 0.05 240)" },
                              children: "—"
                            }
                          )
                        },
                        `wm${slotPos}`
                      );
                    }();
                  }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[8px] tracking-widest uppercase font-bold block mb-1",
                        style: { color: "oklch(0.55 0.12 70)" },
                        children: "4 · Persistence Tiers"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5", children: ["SHORT", "MEDIUM", "HIGH", "SPECIAL"].map(
                      (tier) => {
                        const isActive = gm.persistenceTier === tier;
                        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            className: "flex items-center gap-2",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "span",
                                {
                                  className: "font-mono text-[7px] w-[44px] shrink-0",
                                  style: {
                                    color: isActive ? tierColors[tier] : "oklch(0.32 0.06 240)"
                                  },
                                  children: [
                                    isActive ? "▶ " : "  ",
                                    tier
                                  ]
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "span",
                                {
                                  className: "font-mono text-[7px]",
                                  style: {
                                    color: isActive ? tierColors[tier] : "oklch(0.28 0.05 240)"
                                  },
                                  children: isActive ? `${gm.persistenceItemCount} active` : "—"
                                }
                              )
                            ]
                          },
                          tier
                        );
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[8px] tracking-widest uppercase font-bold block mb-1",
                        style: { color: "oklch(0.55 0.12 145)" },
                        children: "6 · Homeostatic Spine"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "flex-1 h-[5px] rounded",
                          style: { background: "oklch(0.14 0.03 260)" },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                height: "100%",
                                width: `${Math.round(hc.magnitude * 100)}%`,
                                background: hcColor,
                                borderRadius: "2px",
                                transition: "width 0.5s ease"
                              }
                            }
                          )
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "font-mono text-[7px] w-[28px] text-right shrink-0",
                          style: { color: hcColor },
                          children: [
                            Math.round(hc.magnitude * 100),
                            "%"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[6px] uppercase font-bold block",
                        style: { color: hcColor },
                        children: hc.type === "none" ? "within bounds" : hc.type.replace("_", " ")
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "font-mono text-[6px] mt-0.5 leading-relaxed",
                        style: { color: "oklch(0.32 0.05 220)" },
                        children: ((_a = hc.reason) == null ? void 0 : _a.slice(0, 60)) ?? ""
                      }
                    )
                  ] })
                ] })
              ] });
            })() })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "summary",
          {
            className: "font-mono text-[8px] tracking-widest uppercase font-bold cursor-pointer py-1 px-2 rounded-sm select-none",
            style: {
              color: "oklch(0.55 0.10 260)",
              background: "oklch(0.10 0.02 260)",
              border: "1px solid oklch(0.16 0.03 260)"
            },
            children: "CORE BRAIN RUNTIME MONITOR u2014 7-Subsystem Stack"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CoreBrainMonitorPanel, { state: neural.coreMonitorState }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-3 pb-3 pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(NeuroChemPanel, {}) })
    ] })
  ] });
}
export {
  BrainTab as default
};
