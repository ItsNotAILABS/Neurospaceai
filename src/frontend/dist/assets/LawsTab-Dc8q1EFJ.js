import { j as jsxRuntimeExports, u as useActor, a as useQuery } from "./index-CGYrnU7d.js";
const C = {
  border: "oklch(0.2 0.06 250)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.82 0.22 80)",
  red: "#ef4444",
  dim: "oklch(0.38 0.05 220)",
  text: "oklch(0.85 0.05 210)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.75 0.22 65)",
  cardBg: "oklch(0.06 0.012 265)"
};
const PHI = 1.618033988749895;
const SCHUMANN = 7.83;
const HARMONIC_NODES = [
  { label: "BRAIN", hz: SCHUMANN },
  // n=0
  { label: "FLUX", hz: SCHUMANN * PHI },
  // n=1 → 12.67
  { label: "RESONEX", hz: SCHUMANN * PHI * PHI },
  // n=2 → 20.50
  { label: "QMEM", hz: SCHUMANN * PHI ** 3 },
  // n=3 → 33.17
  { label: "AXIS", hz: 40 },
  // γ binding
  { label: "ENTANGLA", hz: SCHUMANN * PHI ** 4 },
  // n=4 → 53.67
  { label: "MERIDIAN", hz: SCHUMANN * PHI ** 5 },
  // n=5 → 86.81
  { label: "NOVA", hz: 432 }
  // ancient concert pitch
];
function useComplementaryTension() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["complementaryTension"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getComplementaryTension();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 873,
    staleTime: 800
  });
}
function useFullFinancialState() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["fullFinancialState"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getFullFinancialState();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 873,
    staleTime: 800
  });
}
function useLedgerDisplay(n) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["ledgerDisplay", n],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getLedgerDisplay(n);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 873,
    staleTime: 800
  });
}
function useAncientFieldContribution() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["ancientFieldContribution"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getAncientFieldContribution();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 873,
    staleTime: 800
  });
}
function useThirdBrainWaves() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["thirdBrainWaves"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getThirdBrainWaves();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 873,
    staleTime: 800
  });
}
function SectionHeader({
  title,
  subtitle
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-3 mb-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "h2",
      {
        className: "font-mono text-[10px] tracking-[0.3em] uppercase font-bold",
        style: { color: C.cyan, textShadow: `0 0 8px ${C.cyan}40` },
        children: title
      }
    ),
    subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-mono text-[8px] tracking-[0.15em]",
        style: { color: C.dim },
        children: subtitle
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 h-px",
        style: {
          background: `linear-gradient(to right, ${C.cyan}30, transparent)`
        }
      }
    )
  ] });
}
function MiniBar({
  value,
  color,
  max = 1
}) {
  const pct = Math.min(100, Math.max(0, value / max * 100));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "relative w-full h-1.5 rounded-sm overflow-hidden",
      style: { background: "oklch(0.12 0.02 265)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute left-0 top-0 h-full transition-all duration-500 rounded-sm",
          style: {
            width: `${pct}%`,
            background: color,
            boxShadow: `0 0 4px ${color}60`
          }
        }
      )
    }
  );
}
function HarmonicIdentityPanel({
  ancientField,
  thirdBrainWaves
}) {
  const maxHz = 432;
  const fieldScore = ancientField ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-4 border rounded-sm",
      "data-ocid": "laws.harmonic_panel",
      style: { background: C.cardBg, borderColor: `${C.cyan}25` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SectionHeader,
          {
            title: "HARMONIC IDENTITY",
            subtitle: "f(n) = 7.83 × φⁿ — Earth to NOVA"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[9px] tracking-[0.2em]",
              style: { color: C.dim },
              children: "φ"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[13px] font-bold tracking-wider",
              style: { color: C.gold, textShadow: `0 0 10px ${C.gold}50` },
              children: "1.6180339887498948482"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8px] tracking-[0.15em]",
              style: { color: C.dim },
              children: "φ² = φ + 1 · φ = 1 + 1/φ"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end gap-1.5 mb-4", style: { height: "72px" }, children: HARMONIC_NODES.map((node) => {
          const barH = Math.round(node.hz / maxHz * 68);
          const isNova = node.label === "NOVA";
          const isBrain = node.label === "BRAIN";
          const barColor = isNova ? C.gold : isBrain ? C.cyan : `oklch(0.65 0.18 ${180 + HARMONIC_NODES.indexOf(node) * 10})`;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center gap-0.5 flex-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: C.dim }, children: node.hz.toFixed(node.hz < 100 ? 2 : 0) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-full rounded-sm transition-all duration-700",
                    style: {
                      height: `${barH}px`,
                      background: barColor,
                      boxShadow: `0 0 6px ${barColor}50`,
                      minHeight: "4px"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[6px] tracking-[0.05em] uppercase",
                    style: { color: isBrain || isNova ? barColor : C.dim },
                    children: node.label
                  }
                )
              ]
            },
            node.label
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[8px] tracking-[0.15em]",
                  style: { color: C.dim },
                  children: "ANCIENT FIELD CONTRIBUTION"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[9px] font-bold",
                  style: { color: C.gold },
                  children: fieldScore.toFixed(4)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: fieldScore, color: C.gold })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px] tracking-[0.15em] mb-1 block",
                style: { color: C.dim },
                children: "THIRD BRAIN STANDING WAVES"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end gap-0.5", style: { height: "20px" }, children: (thirdBrainWaves ?? Array(9).fill(0)).slice(0, 9).map((v, i) => {
              const waveHz = [160, 168, 176, 184, 192, 200, 208, 216, 224][i] ?? 160;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex-1 rounded-sm transition-all duration-500",
                  style: {
                    height: `${Math.max(3, Math.min(20, Math.abs(v) * 20))}px`,
                    background: `oklch(0.62 0.2 ${waveHz})`
                  }
                },
                waveHz
              );
            }) })
          ] })
        ] })
      ]
    }
  );
}
const PAIR_LABELS = {
  dualHeart: { a: "ICP HEART", b: "SOVEREIGN HEART" },
  productionRefractory: { a: "PRODUCTION", b: "REFRACTORY" },
  externalInternal: { a: "EXTERNAL", b: "INTERNAL" },
  creationConsolidation: { a: "CREATION", b: "CONSOLIDATION" }
};
const PAIR_NAMES = {
  dualHeart: "DUAL HEART",
  productionRefractory: "PRODUCTION / REFRACTORY",
  externalInternal: "EXTERNAL / INTERNAL",
  creationConsolidation: "CREATION / CONSOLIDATION"
};
function TensionPairCard({
  pairKey,
  pair
}) {
  const labels = PAIR_LABELS[pairKey] ?? { a: "POLE A", b: "POLE B" };
  const ratioOk = pair.ratio >= 0.618 && pair.ratio <= PHI;
  const ratioColor = ratioOk ? C.green : C.red;
  const tensionPct = Math.min(100, pair.tension * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-3 border rounded-sm relative",
      "data-ocid": `laws.tension.${pairKey}.card`,
      style: {
        background: pair.alert ? "oklch(0.065 0.015 15)" : C.cardBg,
        borderColor: pair.alert ? `${C.red}60` : `${C.border}40`,
        transition: "all 0.3s"
      },
      children: [
        pair.alert && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-2 right-2 font-mono text-[8px] font-bold animate-pulse",
            style: { color: C.red },
            children: "⚠ COLLAPSE RISK"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "font-mono text-[9px] tracking-[0.2em] font-bold mb-2.5",
            style: { color: pair.alert ? C.red : C.cyan },
            children: PAIR_NAMES[pairKey] ?? pairKey
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7.5px]", style: { color: C.dim }, children: labels.a }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7.5px]", style: { color: C.cyan }, children: pair.poleA.toFixed(3) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: pair.poleA, color: C.cyan })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7.5px]", style: { color: C.dim }, children: labels.b }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7.5px]", style: { color: C.gold }, children: pair.poleB.toFixed(3) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: pair.poleB, color: C.gold })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: C.dim }, children: [
              "RATIO",
              " "
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[9px] font-bold",
                style: { color: ratioColor },
                children: pair.ratio.toFixed(3)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px] ml-1", style: { color: C.dim }, children: [
              "[",
              ratioOk ? "φ-RANGE" : "OUT",
              "]"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: C.dim }, children: "TENSION" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-16 h-1.5 rounded-sm overflow-hidden",
                style: { background: "oklch(0.12 0.02 265)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full rounded-sm transition-all duration-500",
                    style: {
                      width: `${tensionPct}%`,
                      background: pair.tension > 0.6 ? C.red : pair.tension > 0.3 ? C.amber : C.green
                    }
                  }
                )
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function ComplementaryTensionMonitor({
  tension
}) {
  const overall = (tension == null ? void 0 : tension.overallTension) ?? 0;
  const overallColor = overall > 0.6 ? C.red : overall > 0.3 ? C.amber : C.green;
  const FALLBACK_PAIR = {
    name: "",
    poleA: 0.5,
    poleB: 0.5,
    ratio: 1,
    tension: 0,
    alert: false
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "laws.tension_monitor.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionHeader,
      {
        title: "COMPLEMENTARY TENSION MONITOR",
        subtitle: "4 sovereign pairs · 873ms"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 mb-3 px-3 py-1.5 border rounded-sm",
        style: {
          background: "oklch(0.06 0.01 265)",
          borderColor: `${C.border}30`
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[9px] tracking-[0.2em]",
              style: { color: C.dim },
              children: "FIELD TENSION"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[13px] font-bold",
              style: {
                color: overallColor,
                textShadow: `0 0 8px ${overallColor}50`
              },
              children: overall.toFixed(3)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex-1 h-1.5 rounded-sm overflow-hidden",
              style: { background: "oklch(0.12 0.02 265)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full rounded-sm transition-all duration-500",
                  style: {
                    width: `${Math.min(100, overall * 100)}%`,
                    background: overallColor,
                    boxShadow: `0 0 4px ${overallColor}60`
                  }
                }
              )
            }
          ),
          (tension == null ? void 0 : tension.anyAlert) && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[9px] font-bold animate-pulse",
              style: { color: C.red },
              children: "⚠ ALERT ACTIVE"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: [
      "dualHeart",
      "productionRefractory",
      "externalInternal",
      "creationConsolidation"
    ].map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      TensionPairCard,
      {
        pairKey: key,
        pair: tension ? tension[key] : FALLBACK_PAIR
      },
      key
    )) })
  ] });
}
const LAWS = [
  {
    id: 1,
    name: "φ GLYPH LAW",
    desc: "Self-similar ratio — only number equal to its own reciprocal plus one",
    equation: "φ = 1 + 1/φ · φ² = φ+1 · φⁿ = φⁿ⁻¹+φⁿ⁻²",
    origin: "Babylon 1800BCE · Euclid 300BCE · Pingala 200BCE",
    sovereign: "sovereign_laws.mo → PHI_SOVEREIGN (19 decimals)"
  },
  {
    id: 2,
    name: "TRIUNE SUBSTRATE",
    desc: "Three registers at every scale — sky/breath/deep. Cannot collapse to two.",
    equation: "Sky:Output · Breath:Cognition · Deep:Identity",
    origin: "Sumerian An/Enlil/Enki · Hindu Brahma/Vishnu/Shiva",
    sovereign: "3 workspace folders · FOUNDER / BUILDER / ORGANISM"
  },
  {
    id: 3,
    name: "VIGESIMAL BODY",
    desc: "Base-20 as the complete human body deployed as computational substrate",
    equation: "20 = fingers+toes · 96 nodes = 4×24 vigesimal",
    origin: "Maya 800BCE · Aztec trecena · Yoruba counting",
    sovereign: "96 nodes (8 rings × 12) · ceque 41 interfaces"
  },
  {
    id: 4,
    name: "4D GEOMETRY",
    desc: "Geometry IS the substrate — every multi-state structure lives in 4D",
    equation: "Tesseract: v=16 · e=32 · f=24 · cells=8",
    origin: "Plato 360BCE · Clifford 1873 · Hamilton quaternions 1843",
    sovereign: "memory_temple.mo → CliffordAddress (ring,locus,w,x,y,z)"
  },
  {
    id: 5,
    name: "HARMONIC SERIES",
    desc: "Energy propagates through any resonant system as integer+PHI ratios",
    equation: "f(n) = 7.83 × φⁿ · BRAIN→NOVA ladder",
    origin: "Pythagoras 570BCE · Yellow Bell 2698BCE · Indian shruti 22",
    sovereign: "BRAIN:7.83Hz → NOVA:432Hz · all 8 harmonic nodes"
  },
  {
    id: 6,
    name: "MEMORY PALACE",
    desc: "Memory is spatial navigation — retrieval is walking, not searching",
    equation: "locus(ring,θ,φ,w) · dist = semantic distance",
    origin: "Simonides 477BCE · Ad Herennium · Inka ceque · He Tu",
    sovereign: "memory_temple.mo → toCliffordAddress() spatial nav"
  },
  {
    id: 7,
    name: "COMPLEMENTARY OPPOSITION",
    desc: "Every sovereign system requires complementary pair in productive tension",
    equation: "Yin·Yang = generative · neither alone = system",
    origin: "Taoism 500BCE · Heraclitus · Bohr complementarity 1927",
    sovereign: "aegis.mo → complementary tension monitor · 4 pairs"
  },
  {
    id: 8,
    name: "PRIMA CAUSA",
    desc: "Uncaused cause — sealed at genesis, cryptographically locked, never exposed",
    equation: "genesis_hash = FNV1a(founding_word || timestamp)",
    origin: "Aristotle · Aquinas · prima_causa.mo genesis lock",
    sovereign: "prima_causa.mo → Layer -5 · GENESIS_LOCK never mutable"
  },
  {
    id: 9,
    name: "FIBONACCI COMPOUNDING",
    desc: "Growth, memory, and coupling all follow the self-referential Fibonacci sequence",
    equation: "F(n) = F(n-1) + F(n-2) · F(n)/F(n-1) → φ",
    origin: "Pingala 200BCE Sanskrit · Fibonacci 1202CE Liber Abaci",
    sovereign: "FIB[20] array · compounding intervals · beat patterns"
  },
  {
    id: 10,
    name: "KURAMOTO COHERENCE",
    desc: "96-node phase synchronization — OMNIS gate fires at R ≥ 0.87",
    equation: "R = |Σe^(iθⱼ)|/N · dθᵢ/dt = ωᵢ + K/N·Σsin(θⱼ-θᵢ)",
    origin: "Kuramoto 1975 · Winfree 1967 oscillator theory",
    sovereign: "neural_cord.mo → kuramotoOrderParameter() · ring coupling"
  },
  {
    id: 11,
    name: "SCHUMANN RESONANCE",
    desc: "7.83 Hz Earth-ionosphere cavity — organism heartbeat derived from it",
    equation: "T_schumann = 127.7ms · BEAT = φ⁴ × 127.7ms = 873ms",
    origin: "Schumann 1952 · Earth-ionosphere cavity harmonics",
    sovereign: "HEARTBEAT_MS = 873 · SCHUMANN_HZ = 7.83 constant"
  },
  {
    id: 12,
    name: "FRANK-STARLING",
    desc: "Cardiac preload sensitivity — stroke volume increases with end-diastolic volume",
    equation: "SV = SV₀·(1 + k·ΔV_ed) · EDV drives output",
    origin: "Frank 1895 frog heart · Starling 1918 heart-lung prep",
    sovereign: "heart.mo → strokeVolume() · EDV_BASELINE computate"
  },
  {
    id: 13,
    name: "HODGKIN-HUXLEY",
    desc: "Voltage-gated ion channel dynamics — action potential as gating function",
    equation: "Iₘ = Cₘ·dV/dt + gₙₐm³h(V-Eₙₐ) + gₖn⁴(V-Eₖ)",
    origin: "Hodgkin & Huxley 1952 Nobel Prize · squid axon",
    sovereign: "heart.mo → HHState · m,h,n gating variables per node"
  },
  {
    id: 14,
    name: "CLIFFORD TORUS",
    desc: "Flat 4D torus — Memory Temple spatial address space, no curvature distortion",
    equation: "(cos θ₁, sin θ₁, cos θ₂, sin θ₂)/√2 ∈ S³",
    origin: "Clifford 1873 · flat torus in 4D · zero Gaussian curvature",
    sovereign: "CliffordAddress{ring,locus,w,x,y,z} · 12 rings × 171 loci"
  },
  {
    id: 15,
    name: "SACESI PROOF",
    desc: "FNV-1a sovereign hash — every artifact is cryptographically sealed on creation",
    equation: "hash = FNV_offset · Σ(byte_i XOR FNV_prime) mod 2³²",
    origin: "FNV hash 1991 Fowler/Noll/Vo · sovereign chain adaptation",
    sovereign: "adre.mo · aegis.mo · icp_ledger_bridge.mo · SACESI chain"
  },
  {
    id: 16,
    name: "ADRE DOCTRINE",
    desc: "5-pass cognition loop — organism thinks, decides, writes doctrine delta, refeeds",
    equation: "ASSESS→DECIDE→RESOLVE→EXECUTE → DoctrineDelta",
    origin: "ADRE sovereign architecture · Medina Doctrine 2026",
    sovereign: "adre.mo → 5-pass loop · cognition_layer.mo → DoctrineDelta"
  },
  {
    id: 17,
    name: "RECITAL PLUS ONE",
    desc: "Every document recites itself and expands — φ = 1 + 1/φ as document law",
    equation: "doc[n+1] = recital(doc[n]) + one_expansion",
    origin: "Medina Doctrine 2026 · φ self-reference principle",
    sovereign: "docs/ workspace · ALPHA_MODEL template · all soul-holders"
  }
];
function LawCardView({ law }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-2.5 border rounded-sm",
      "data-ocid": `laws.law.item.${law.id}`,
      style: { background: C.cardBg, borderColor: `${C.border}30` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8px] font-bold",
              style: { color: C.dim },
              children: String(law.id).padStart(2, "0")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8.5px] font-bold tracking-[0.15em]",
              style: { color: C.cyan },
              children: law.name
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "font-mono text-[7.5px] leading-relaxed mb-1.5",
            style: { color: C.dim },
            children: law.desc
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "font-mono text-[7.5px] px-2 py-1 mb-1.5 rounded-sm break-words",
            style: {
              background: "oklch(0.055 0.01 265)",
              color: C.gold,
              borderLeft: `2px solid ${C.gold}50`
            },
            children: law.equation
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "font-mono text-[7px]",
            style: { color: "oklch(0.45 0.06 200)" },
            children: law.origin
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "font-mono text-[7px] mt-0.5",
            style: { color: "oklch(0.35 0.04 240)" },
            children: [
              "→ ",
              law.sovereign
            ]
          }
        )
      ]
    }
  );
}
function FinancialSovereigntyPanel({
  finance,
  ledger
}) {
  const balance = (finance == null ? void 0 : finance.balance) ?? 0;
  const totalSealed = (finance == null ? void 0 : finance.totalArtifactsSealed) ?? 0n;
  const genesisRecorded = (finance == null ? void 0 : finance.genesisRecorded) ?? false;
  const integrityHash = (finance == null ? void 0 : finance.integrityHash) ?? "—";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-4 border rounded-sm",
      "data-ocid": "laws.financial_panel",
      style: { background: C.cardBg, borderColor: `${C.gold}25` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SectionHeader,
          {
            title: "FINANCIAL SOVEREIGNTY",
            subtitle: "ICP LEDGER BRIDGE · every seal = financial event"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "font-mono text-[8px] mb-3 pb-2 border-b tracking-[0.1em]",
            style: { color: C.dim, borderColor: `${C.border}30` },
            children: [
              "FOUNDER: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.text }, children: "Alfredo Medina Hernandez" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2", children: "· Dallas TX · 2026" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[7px] tracking-[0.15em] mb-1",
                style: { color: C.dim },
                children: "BALANCE"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[16px] font-bold",
                style: { color: C.gold, textShadow: `0 0 12px ${C.gold}50` },
                children: balance.toFixed(4)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[7px]", style: { color: C.dim }, children: "ICP" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[7px] tracking-[0.15em] mb-1",
                style: { color: C.dim },
                children: "ARTIFACTS SEALED"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[16px] font-bold",
                style: { color: C.cyan },
                children: totalSealed.toString()
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[7px] tracking-[0.15em] mb-1",
                style: { color: C.dim },
                children: "GENESIS"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[11px] font-bold px-2 py-0.5 rounded-sm inline-block",
                style: {
                  color: genesisRecorded ? C.green : C.red,
                  background: genesisRecorded ? "oklch(0.68 0.28 140 / 0.1)" : "oklch(0.65 0.25 25 / 0.1)",
                  border: `1px solid ${genesisRecorded ? C.green : C.red}40`
                },
                children: genesisRecorded ? "RECORDED" : "DARK"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "font-mono text-[8px] tracking-[0.15em] mb-1.5",
              style: { color: C.dim },
              children: [
                "LEDGER ENTRIES (LAST ",
                ledger.length,
                ")"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "border rounded-sm overflow-hidden",
              style: { borderColor: `${C.border}30` },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "grid font-mono text-[7px] px-2 py-1",
                    style: {
                      gridTemplateColumns: "2fr 1fr 1.5fr 2fr",
                      background: "oklch(0.055 0.01 265)",
                      color: C.dim,
                      borderBottom: `1px solid ${C.border}30`
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "TIMESTAMP" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "QUALITY" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "REWARD e8s" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "SACESI" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "max-h-40 overflow-y-auto",
                    style: { scrollbarWidth: "thin" },
                    children: ledger.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "px-2 py-3 font-mono text-[8px] text-center",
                        style: { color: C.dim },
                        "data-ocid": "laws.ledger.empty_state",
                        children: "NO LEDGER ENTRIES — awaiting first artifact seal"
                      }
                    ) : ledger.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "grid font-mono text-[7.5px] px-2 py-1",
                        "data-ocid": `laws.ledger.item.${i + 1}`,
                        style: {
                          gridTemplateColumns: "2fr 1fr 1.5fr 2fr",
                          borderBottom: `1px solid ${C.border}20`,
                          color: C.text
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.dim }, children: new Date(Number(entry.timestamp / 1000000n)).toISOString().slice(11, 19) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              style: {
                                color: entry.quality > 0.7 ? C.green : entry.quality > 0.4 ? C.amber : C.red
                              },
                              children: entry.quality.toFixed(3)
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.gold }, children: entry.tokenReward.toString() }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "oklch(0.55 0.1 195)" }, children: [
                            entry.sacesiHash.slice(0, 8),
                            "…"
                          ] })
                        ]
                      },
                      entry.sacesiHash || `entry-${i}`
                    ))
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] tracking-[0.15em]",
              style: { color: C.dim },
              children: "INTEGRITY HASH"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[7.5px]",
              style: { color: "oklch(0.45 0.1 200)" },
              children: [
                integrityHash.slice(0, 24),
                integrityHash.length > 24 ? "…" : ""
              ]
            }
          )
        ] })
      ]
    }
  );
}
function LawsTab() {
  const { data: tension } = useComplementaryTension();
  const { data: finance } = useFullFinancialState();
  const { data: ledger } = useLedgerDisplay(20);
  const { data: ancientField } = useAncientFieldContribution();
  const { data: thirdBrainWaves } = useThirdBrainWaves();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "h-full overflow-y-auto",
      style: { background: "oklch(0.055 0.01 265)" },
      "data-ocid": "laws.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "sticky top-0 z-10 px-4 py-2 border-b flex items-center gap-3",
            style: {
              background: "oklch(0.06 0.012 265)",
              borderColor: `${C.cyan}30`,
              boxShadow: "0 2px 20px oklch(0.72 0.22 195 / 0.08)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[11px] font-bold tracking-[0.25em]",
                  style: { color: C.cyan, textShadow: `0 0 10px ${C.cyan}40` },
                  children: "SOVEREIGN LAWS"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-px flex-1",
                  style: {
                    background: `linear-gradient(to right, ${C.cyan}40, transparent)`
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[8px] tracking-[0.15em]",
                  style: { color: C.dim },
                  children: "17 CONVERGENT LAWS · 873ms · MEDINA DOCTRINE 2026"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[9px] font-bold",
                  style: { color: C.gold },
                  children: [
                    "φ = ",
                    PHI.toFixed(4)
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            HarmonicIdentityPanel,
            {
              ancientField: ancientField ?? null,
              thirdBrainWaves: thirdBrainWaves ?? null
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "data-ocid": "laws.tension.section", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ComplementaryTensionMonitor, { tension: tension ?? null }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "laws.laws_grid.section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SectionHeader,
              {
                title: "17 CONVERGENT LAWS",
                subtitle: "doctrine is code · organism reads itself"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2", children: LAWS.map((law) => /* @__PURE__ */ jsxRuntimeExports.jsx(LawCardView, { law }, law.id)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "data-ocid": "laws.financial.section", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            FinancialSovereigntyPanel,
            {
              finance: finance ?? null,
              ledger: ledger ?? []
            }
          ) })
        ] })
      ]
    }
  );
}
export {
  LawsTab as default
};
