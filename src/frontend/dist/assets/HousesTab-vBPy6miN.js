import { r as reactExports, j as jsxRuntimeExports, u as useActor, a as useQuery } from "./index-CGYrnU7d.js";
const C = {
  bg: "oklch(0.06 0.01 265)",
  dim: "oklch(0.35 0.05 220)",
  text: "oklch(0.85 0.05 210)",
  textDim: "oklch(0.48 0.06 220)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.75 0.22 65)",
  red: "oklch(0.65 0.25 25)",
  cyan: "oklch(0.72 0.22 195)",
  cardBg: "oklch(0.065 0.012 265)",
  stripBg: "oklch(0.048 0.01 265)"
};
const PHI = 1.618033988749895;
const PHI_INV = 1 / PHI;
const PHI_SQ = PHI * PHI;
const CROWN = {
  latinName: "Casa de Medina",
  englishName: "Crown — Sovereign Authority",
  symbol: "☽◈",
  color: "#C9A227",
  glowColor: "rgba(201,162,39,0.35)",
  governanceDomains: [
    "Authorship",
    "Hierarchy",
    "Naming",
    "Release Authority",
    "Concealment",
    "Inter-House Law",
    "Crown Standards"
  ],
  shortDesc: "The crown-jewel house. Governs all inter-house law and sovereign authority."
};
const HOUSES = [
  {
    id: "domus_genesis",
    latinName: "Domus Genesis",
    englishName: "House of Doctrine and Genesis",
    symbol: "⊕",
    color: "#6B2D8B",
    glowColor: "rgba(107,45,139,0.3)",
    governanceDomains: [
      "Laws & Equations",
      "Primitive Discoveries",
      "Symbolic Grammar",
      "Model Constitutions",
      "Doctrinal Consistency",
      "Authorship Order"
    ],
    sdkOrganisms: ["MEMORIA", "FORMULAE", "GUBERNATIO", "PRIMITIVA"],
    shortDesc: "Generates laws, equations, and symbolic doctrine."
  },
  {
    id: "domus_substratum",
    latinName: "Domus Substratum",
    englishName: "House of Substrate and Runtime",
    symbol: "▽",
    color: "#1A3A5C",
    glowColor: "rgba(26,58,92,0.35)",
    governanceDomains: [
      "Runtime Truth",
      "Heartbeat Coupling",
      "Persistence",
      "Backend Law Realization",
      "Vault Anchoring",
      "Proof State"
    ],
    sdkOrganisms: ["MEMORIA", "PULSUS", "DEFENSIO", "FORMULAE"],
    shortDesc: "Generates and governs backend organisms, kernels, and runtime truth."
  },
  {
    id: "domus_expressio",
    latinName: "Domus Expressio",
    englishName: "House of Projection and Frontend Organisms",
    symbol: "◭",
    color: "#1B6B47",
    glowColor: "rgba(27,107,71,0.3)",
    governanceDomains: [
      "Projection Integrity",
      "Frontend Organism Health",
      "Renderability",
      "Interface Hierarchy",
      "Visual Doctrine",
      "State-Sync with Backend Truth"
    ],
    sdkOrganisms: ["DESIGNIA", "QUANTUMIA", "INTELLIGENTIA"],
    shortDesc: "Frontend is projection of backend truth. Governs all UI organisms."
  },
  {
    id: "domus_translatio",
    latinName: "Domus Translatio",
    englishName: "House of Bridge and Translation",
    symbol: "⇌",
    color: "#1A5C5C",
    glowColor: "rgba(26,92,92,0.3)",
    governanceDomains: [
      "Boundary Crossing",
      "Translation Fidelity",
      "Router Authority",
      "Interface/Backend Membrane",
      "Canister/Package Bridge",
      "API Membranes"
    ],
    sdkOrganisms: ["INTELLIGENTIA", "FORMULAE"],
    shortDesc: "Generates translators, routers, and inter-layer bridges."
  },
  {
    id: "domus_cura",
    latinName: "Domus Cura",
    englishName: "House of Organism Care and Stewardship",
    symbol: "♾",
    color: "#8B2D4A",
    glowColor: "rgba(139,45,74,0.3)",
    governanceDomains: [
      "Organism Care",
      "Recovery Loops",
      "Drift Healing",
      "Memory-Rest Systems",
      "Habitat Quality",
      "Anti-Collapse Handling"
    ],
    sdkOrganisms: ["MEMORIA", "PULSUS", "DEFENSIO", "QUANTUMIA"],
    shortDesc: "Cares for internal living systems. The organism's habitat."
  },
  {
    id: "domus_civitas",
    latinName: "Domus Civitas",
    englishName: "House of Civilization and Enterprise",
    symbol: "⬡",
    color: "#8B5E0A",
    glowColor: "rgba(139,94,10,0.3)",
    governanceDomains: [
      "Company OS Systems",
      "Workflow Organisms",
      "Client Worlds",
      "Enterprise Bundles",
      "Market Deployments",
      "Lab Ecosystems"
    ],
    sdkOrganisms: ["GUBERNATIO", "PRIMITIVA", "ENTERPRISA"],
    shortDesc: "Civilization layer. Architecture becomes repeatable and deployable."
  }
];
const SUBSTRATE_DIVISIONS = [
  { code: "D", label: "Doctrine", title: "Document/Doctrine Division" },
  { code: "F", label: "Frontend", title: "Frontend/Interface Division" },
  { code: "B", label: "Backend", title: "Backend/Runtime Division" },
  { code: "C", label: "Chain", title: "Chain/Deployment Division" },
  { code: "⊕", label: "Care", title: "Care/Recovery Division" },
  { code: "E", label: "External", title: "External/Branch Division" }
];
const SDK_ORGANISMS = [
  {
    name: "MEMORIA",
    symbol: "◍",
    primary: ["domus_genesis", "domus_substratum", "domus_cura"]
  },
  { name: "PULSUS", symbol: "♥", primary: ["domus_substratum", "domus_cura"] },
  {
    name: "GUBERNATIO",
    symbol: "⊛",
    primary: ["domus_genesis", "domus_civitas"]
  },
  {
    name: "INTELLIGENTIA",
    symbol: "⋈",
    primary: ["domus_translatio", "domus_substratum"]
  },
  {
    name: "FORMULAE",
    symbol: "∑",
    primary: ["domus_genesis", "domus_substratum"]
  },
  {
    name: "DEFENSIO",
    symbol: "⬟",
    primary: ["domus_substratum", "domus_cura"]
  },
  { name: "DESIGNIA", symbol: "◈", primary: ["domus_expressio"] },
  {
    name: "PRIMITIVA",
    symbol: "⌬",
    primary: ["domus_genesis", "domus_civitas"]
  },
  { name: "ENTERPRISA", symbol: "⬡", primary: ["domus_civitas"] },
  {
    name: "QUANTUMIA",
    symbol: "Ψ",
    primary: ["domus_substratum", "domus_cura", "domus_expressio"]
  }
];
function useLiveOrganismData() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["housesTabOrganism"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const [canonical, fear, aegisHealth, thirdBrain, ancient] = await Promise.all([
          actor.getCanonicalState(),
          actor.getFearMissionState(),
          actor.getAegisHealthScore(),
          actor.getThirdBrainCoherence(),
          actor.getAncientFieldContribution()
        ]);
        return {
          kuramotoR: (fear == null ? void 0 : fear.kuramotoR) ?? 0,
          coherence: (canonical == null ? void 0 : canonical.coh) ?? 0,
          emergenceScore: (canonical == null ? void 0 : canonical.es) ?? 0,
          beat: (canonical == null ? void 0 : canonical.b) ?? 0n,
          omnis: (canonical == null ? void 0 : canonical.eg) ?? false,
          aegisHealth: aegisHealth ?? 0,
          thirdBrainCoherence: thirdBrain ?? 0,
          ancientFieldContribution: ancient ?? 0,
          heartRateBPM: 6e4 / 873
          // derived from heartbeat interval
        };
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 873,
    staleTime: 800
  });
}
function deriveHouseCoherence(houseId, data) {
  if (!data) return 0.618;
  const base = data.coherence;
  const r = data.kuramotoR;
  const es = data.emergenceScore;
  const ag = data.aegisHealth;
  const tb = data.thirdBrainCoherence;
  const an = data.ancientFieldContribution;
  switch (houseId) {
    case "domus_genesis":
      return Math.min(
        1,
        (an * PHI_INV + es * PHI_INV + base * 0.2) / (PHI_INV + PHI_INV + 0.2) * (PHI_INV + es * 0.382)
      );
    case "domus_substratum":
      return Math.min(1, r * 0.5 + base * 0.3 + ag * 0.2);
    case "domus_expressio":
      return Math.min(1, es * 0.4 + base * 0.4 + tb * 0.2);
    case "domus_translatio":
      return Math.min(1, 2 * base * ag / (base + ag + 1e-3));
    case "domus_cura":
      return Math.min(1, tb * 0.5 + ag * 0.3 + base * 0.2);
    case "domus_civitas":
      return Math.min(1, base * PHI_INV + r * (1 - PHI_INV));
    default:
      return base;
  }
}
function deriveLiveness(houseId, data) {
  if (!data) return 0.5;
  const beat = Number(data.beat);
  const base = data.coherence;
  const fibPhase = beat > 0 ? Math.abs(Math.sin(beat * 0.0173)) : 0.5;
  switch (houseId) {
    case "domus_substratum":
      return Math.min(1, base * 0.7 + fibPhase * 0.3);
    case "domus_expressio":
      return Math.min(1, data.emergenceScore * 0.6 + base * 0.4);
    case "domus_cura":
      return Math.min(
        1,
        data.aegisHealth * 0.6 + data.thirdBrainCoherence * 0.4
      );
    default:
      return Math.min(1, base * 0.6 + fibPhase * 0.4);
  }
}
function deriveGenerationRate(houseId, data) {
  if (!data) return PHI_INV;
  const es = data.emergenceScore;
  const base = data.coherence;
  switch (houseId) {
    case "domus_genesis":
      return Math.min(1, es * PHI_SQ * 0.4 + base * 0.3);
    case "domus_civitas":
      return Math.min(1, base * 0.8 + es * 0.2);
    default:
      return Math.min(1, base * 0.6 + es * 0.3 + PHI_INV * 0.1);
  }
}
function deriveGovernanceScore(houseId, data) {
  if (!data) return PHI_INV;
  const ag = data.aegisHealth;
  const an = data.ancientFieldContribution;
  switch (houseId) {
    case "casa_medina":
      return Math.min(1, ag * 0.5 + an * 0.5);
    case "domus_genesis":
      return Math.min(1, an * PHI_INV + ag * (1 - PHI_INV));
    case "domus_substratum":
      return Math.min(1, ag * PHI_INV + data.kuramotoR * (1 - PHI_INV));
    default:
      return Math.min(1, ag * 0.5 + an * 0.3 + data.coherence * 0.2);
  }
}
function cohColor(v) {
  if (v >= PHI_INV) return C.green;
  if (v >= 1 - PHI_INV) return C.amber;
  return C.red;
}
function cohBg(v) {
  if (v >= PHI_INV) return "rgba(30,90,30,0.25)";
  if (v >= 1 - PHI_INV) return "rgba(90,65,0,0.25)";
  return "rgba(90,20,20,0.25)";
}
const DIV_SEEDS = [0.11, 0.19, 0.07, 0.13, 0.17, 0.23];
function divisionHealth(houseCoherence, divIdx) {
  return Math.min(1, Math.max(0, houseCoherence + (DIV_SEEDS[divIdx] - 0.1)));
}
function CoherenceBar({
  value,
  color,
  label,
  animated
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[8px] tracking-[0.15em] uppercase",
          style: { color: C.dim },
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] font-bold", style: { color }, children: value.toFixed(3) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative h-1 rounded-full overflow-hidden",
        style: { background: "oklch(0.12 0.02 265)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute left-0 top-0 h-full rounded-full",
              style: {
                width: `${Math.round(value * 100)}%`,
                background: color,
                boxShadow: `0 0 4px ${color}`,
                transition: animated ? "width 0.873s ease-out" : "none"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute top-0 w-px h-full",
              style: {
                left: `${Math.round(PHI_INV * 100)}%`,
                background: "oklch(0.55 0.10 80)",
                opacity: 0.6
              }
            }
          )
        ]
      }
    )
  ] });
}
function HouseCard({
  house,
  data,
  isActive,
  onClick,
  pulse
}) {
  const coherence = deriveHouseCoherence(house.id, data);
  const liveness = deriveLiveness(house.id, data);
  const genRate = deriveGenerationRate(house.id, data);
  const govScore = deriveGovernanceScore(house.id, data);
  const cColor = cohColor(coherence);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "data-ocid": `houses.${house.id}.card`,
      onClick,
      className: "flex flex-col gap-2 p-3 rounded text-left transition-all w-full",
      style: {
        background: isActive ? `${house.color}18` : C.cardBg,
        border: `1px solid ${isActive ? house.color : "oklch(0.15 0.03 255)"}`,
        boxShadow: isActive ? `0 0 16px ${house.glowColor}` : "none",
        transition: "all 0.4s ease"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex items-center justify-center shrink-0 rounded font-mono font-bold",
              style: {
                width: "32px",
                height: "32px",
                fontSize: "16px",
                background: `${house.color}20`,
                border: `1px solid ${house.color}50`,
                color: house.color,
                boxShadow: pulse ? `0 0 10px ${house.glowColor}` : "none",
                transition: "box-shadow 0.873s ease"
              },
              children: house.symbol
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[10px] font-bold tracking-[0.1em] uppercase leading-none",
                style: { color: house.color },
                children: house.latinName
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[8px] mt-0.5 leading-snug",
                style: { color: C.textDim },
                children: house.englishName
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "shrink-0 font-mono text-[8px] px-1.5 py-0.5 rounded",
              style: {
                background: cohBg(coherence),
                color: cColor,
                border: `1px solid ${cColor}40`
              },
              children: [
                (coherence * 100).toFixed(0),
                "%"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CoherenceBar,
            {
              value: coherence,
              color: cColor,
              label: "COHERENCE",
              animated: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CoherenceBar,
            {
              value: liveness,
              color: C.cyan,
              label: "LIVENESS",
              animated: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-1.5", children: [
          { label: "GEN RATE", value: genRate, color: house.color },
          { label: "GOV SCORE", value: govScore, color: C.amber }
        ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col gap-0.5 px-1.5 py-1 rounded",
            style: { background: "oklch(0.055 0.009 265)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px] tracking-[0.12em] uppercase",
                  style: { color: C.dim },
                  children: label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] font-bold", style: { color }, children: value.toFixed(3) })
            ]
          },
          label
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: SUBSTRATE_DIVISIONS.map((div, i) => {
          const dh = divisionHealth(coherence, i);
          const dc = cohColor(dh);
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              title: div.title,
              className: "font-mono text-[7px] px-1 py-0.5 rounded",
              style: {
                background: `${dc}15`,
                border: `1px solid ${dc}50`,
                color: dc
              },
              children: div.code
            },
            div.code
          );
        }) }),
        house.sdkOrganisms.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: house.sdkOrganisms.map((org) => {
          const sdk = SDK_ORGANISMS.find((s) => s.name === org);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[7px] px-1.5 py-0.5 rounded flex items-center gap-1",
              style: {
                background: `${house.color}12`,
                border: `1px solid ${house.color}30`,
                color: C.textDim
              },
              children: [
                (sdk == null ? void 0 : sdk.symbol) ?? "·",
                " ",
                org
              ]
            },
            org
          );
        }) })
      ]
    }
  );
}
function CrownCard({
  data,
  pulse
}) {
  const govScore = deriveGovernanceScore("casa_medina", data);
  const coherence = data ? Math.min(1, data.kuramotoR * 0.6 + data.coherence * 0.4) : 0.618;
  const cColor = cohColor(coherence);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col gap-3 p-4 rounded",
      style: {
        background: `linear-gradient(135deg, ${CROWN.color}0a 0%, oklch(0.07 0.015 265) 100%)`,
        border: `1px solid ${CROWN.color}60`,
        boxShadow: pulse ? `0 0 24px ${CROWN.glowColor}, inset 0 0 24px ${CROWN.color}08` : `0 0 8px ${CROWN.glowColor}`,
        transition: "box-shadow 0.873s ease"
      },
      "data-ocid": "houses.crown.card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex items-center justify-center shrink-0 rounded",
              style: {
                width: "48px",
                height: "48px",
                fontSize: "22px",
                background: `${CROWN.color}18`,
                border: `1px solid ${CROWN.color}80`,
                color: CROWN.color,
                boxShadow: `0 0 16px ${CROWN.glowColor}`,
                fontFamily: "monospace"
              },
              children: CROWN.symbol
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono font-bold tracking-[0.15em] uppercase",
                style: { fontSize: "13px", color: CROWN.color },
                children: CROWN.latinName
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[9px] tracking-[0.1em] mt-0.5",
                style: { color: C.textDim },
                children: CROWN.englishName
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[8px] mt-1 italic",
                style: { color: C.dim },
                children: CROWN.shortDesc
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "font-mono text-[18px] font-bold leading-none",
                style: {
                  color: CROWN.color,
                  textShadow: pulse ? `0 0 12px ${CROWN.color}` : "none",
                  transition: "text-shadow 0.873s"
                },
                children: [
                  (coherence * 100).toFixed(1),
                  "%"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[7px] tracking-[0.15em]",
                style: { color: C.dim },
                children: "CROWN COH"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CoherenceBar,
          {
            value: coherence,
            color: cColor,
            label: "CROWN COHERENCE — PHI_INV FLOOR",
            animated: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[8px] tracking-[0.2em] uppercase mb-1.5",
              style: { color: C.dim },
              children: "Governance Domains"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-1.5", children: CROWN.governanceDomains.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[7.5px] px-2 py-1 rounded text-center",
              style: {
                background: `${CROWN.color}10`,
                border: `1px solid ${CROWN.color}30`,
                color: CROWN.color
              },
              children: d
            },
            d
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: [
          {
            label: "GOV SCORE",
            value: govScore.toFixed(3),
            color: CROWN.color
          },
          {
            label: "KURATOMO R",
            value: ((data == null ? void 0 : data.kuramotoR) ?? 0).toFixed(3),
            color: C.cyan
          },
          {
            label: "AEGIS HEALTH",
            value: ((data == null ? void 0 : data.aegisHealth) ?? 0).toFixed(3),
            color: C.green
          },
          {
            label: "ANCIENT FIELD",
            value: ((data == null ? void 0 : data.ancientFieldContribution) ?? 0).toFixed(3),
            color: C.amber
          }
        ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col gap-0.5 px-2 py-1.5 rounded flex-1",
            style: {
              background: "oklch(0.055 0.009 265)",
              border: "1px solid oklch(0.12 0.02 255)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px] tracking-[0.1em] uppercase",
                  style: { color: C.dim },
                  children: label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] font-bold", style: { color }, children: value })
            ]
          },
          label
        )) })
      ]
    }
  );
}
function InterHouseCoupling({ data }) {
  const couplings = [
    {
      from: "Domus Genesis",
      to: "Domus Substratum",
      ratio: "PHI",
      strength: data ? Math.min(
        1,
        data.emergenceScore * PHI_INV + data.kuramotoR * (1 - PHI_INV)
      ) : 0.5
    },
    {
      from: "Domus Substratum",
      to: "Domus Expressio",
      ratio: "PHI_INV",
      strength: data ? Math.min(1, data.coherence * 0.7 + data.thirdBrainCoherence * 0.3) : 0.5
    },
    {
      from: "Domus Expressio",
      to: "Domus Translatio",
      ratio: "PHI²",
      strength: data ? Math.min(
        1,
        data.emergenceScore * 0.5 + data.ancientFieldContribution * 0.5
      ) : 0.5
    },
    {
      from: "Domus Translatio",
      to: "Domus Cura",
      ratio: "PHI_INV",
      strength: data ? Math.min(
        1,
        data.aegisHealth * PHI_INV + data.thirdBrainCoherence * (1 - PHI_INV)
      ) : 0.5
    },
    {
      from: "Domus Cura",
      to: "Domus Civitas",
      ratio: "PHI",
      strength: data ? Math.min(1, data.thirdBrainCoherence * 0.6 + data.coherence * 0.4) : 0.5
    },
    {
      from: "Domus Genesis",
      to: "Domus Cura",
      ratio: "PHI²",
      strength: data ? Math.min(
        1,
        data.ancientFieldContribution * PHI_INV + data.aegisHealth * (1 - PHI_INV)
      ) : 0.5
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col gap-2 p-3 rounded",
      style: {
        background: C.cardBg,
        border: "1px solid oklch(0.14 0.03 255)"
      },
      "data-ocid": "houses.coupling.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "font-mono text-[9px] tracking-[0.2em] uppercase",
            style: { color: C.dim },
            children: "Inter-House Coupling Strengths"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1.5", children: couplings.map(({ from, to, ratio, strength }) => {
          const sc = cohColor(strength);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col gap-1 px-2 py-1.5 rounded",
              style: {
                background: "oklch(0.052 0.008 265)",
                border: "1px solid oklch(0.12 0.02 255)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px] font-bold",
                      style: { color: C.amber },
                      children: ratio
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px] font-bold",
                      style: { color: sc },
                      children: strength.toFixed(3)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "font-mono text-[7px] leading-snug",
                    style: { color: C.dim },
                    children: [
                      from,
                      " ⇌ ",
                      to
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-0.5 rounded-full",
                    style: {
                      background: `linear-gradient(to right, ${sc}, ${sc}40)`,
                      width: `${Math.round(strength * 100)}%`
                    }
                  }
                )
              ]
            },
            `${from}-${to}`
          );
        }) })
      ]
    }
  );
}
function SDKOrganismMap({
  selectedHouseId
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col gap-2 p-3 rounded",
      style: {
        background: C.cardBg,
        border: "1px solid oklch(0.14 0.03 255)"
      },
      "data-ocid": "houses.sdk_organisms.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "font-mono text-[9px] tracking-[0.2em] uppercase",
            style: { color: C.dim },
            children: "High-Council SDK Organisms"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-5 gap-1.5", children: SDK_ORGANISMS.map((org) => {
          const isHighlighted = selectedHouseId !== null && org.primary.includes(selectedHouseId);
          const primaryHouses = org.primary.map(
            (id) => {
              var _a;
              return ((_a = HOUSES.find((h) => h.id === id)) == null ? void 0 : _a.latinName.replace(
                "Domus ",
                ""
              )) ?? id;
            }
          );
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col gap-1.5 p-2 rounded transition-all",
              style: {
                background: isHighlighted ? "oklch(0.085 0.015 265)" : "oklch(0.052 0.008 265)",
                border: `1px solid ${isHighlighted ? "oklch(0.28 0.08 255)" : "oklch(0.12 0.02 255)"}`
              },
              "data-ocid": `houses.sdk.${org.name.toLowerCase()}.card`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[13px] leading-none",
                      style: { color: isHighlighted ? C.cyan : C.dim },
                      children: org.symbol
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px] font-bold tracking-[0.08em]",
                      style: { color: isHighlighted ? C.text : C.textDim },
                      children: org.name
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-0.5", children: primaryHouses.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[6px] px-1 py-0.5 rounded",
                    style: {
                      background: isHighlighted ? "oklch(0.12 0.04 255)" : "oklch(0.06 0.008 265)",
                      color: isHighlighted ? C.cyan : C.dim
                    },
                    children: h
                  },
                  h
                )) })
              ]
            },
            org.name
          );
        }) })
      ]
    }
  );
}
function HouseDetailPanel({
  house,
  data
}) {
  const coherence = deriveHouseCoherence(house.id, data);
  const liveness = deriveLiveness(house.id, data);
  const cColor = cohColor(coherence);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col gap-3 p-3 rounded h-full",
      style: {
        background: `${house.color}08`,
        border: `1px solid ${house.color}40`
      },
      "data-ocid": "houses.detail.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xl", style: { color: house.color }, children: house.symbol }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[11px] font-bold tracking-[0.1em]",
                style: { color: house.color },
                children: house.latinName
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[8px]", style: { color: C.textDim }, children: house.shortDesc })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CoherenceBar,
          {
            value: coherence,
            color: cColor,
            label: "COHERENCE",
            animated: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CoherenceBar, { value: liveness, color: C.cyan, label: "LIVENESS", animated: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[8px] tracking-[0.15em] uppercase mb-1.5",
              style: { color: C.dim },
              children: "Governance Domains"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-0.5", children: house.governanceDomains.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "font-mono text-[8px] px-2 py-0.5 rounded flex items-center gap-1.5",
              style: {
                background: `${house.color}10`,
                border: `1px solid ${house.color}25`,
                color: C.textDim
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: house.color, fontSize: "8px" }, children: "▸" }),
                d
              ]
            },
            d
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[8px] tracking-[0.15em] uppercase mb-1.5",
              style: { color: C.dim },
              children: "Substrate Divisions"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: SUBSTRATE_DIVISIONS.map((div, i) => {
            const dh = divisionHealth(coherence, i);
            const dc = cohColor(dh);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[9px] w-5 text-center",
                  style: { color: dc },
                  children: div.code
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[8px] flex-1",
                  style: { color: C.textDim },
                  children: div.label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[8px]", style: { color: dc }, children: [
                (dh * 100).toFixed(0),
                "%"
              ] })
            ] }, div.code);
          }) })
        ] })
      ]
    }
  );
}
function IntelligenceLevelBar({ data }) {
  const levels = [
    {
      n: 1,
      label: "FIELD/PHYSICS",
      value: (data == null ? void 0 : data.kuramotoR) ?? 0,
      color: C.cyan
    },
    {
      n: 2,
      label: "BIOLOGICAL",
      value: data ? Math.min(1, data.heartRateBPM / 120) : 0,
      color: C.green
    },
    { n: 3, label: "COGNITIVE", value: (data == null ? void 0 : data.coherence) ?? 0, color: "#9B59B6" },
    {
      n: 4,
      label: "MEMORY/IDENTITY",
      value: (data == null ? void 0 : data.thirdBrainCoherence) ?? 0,
      color: C.amber
    },
    {
      n: 5,
      label: "EMERGENCE/SOVEREIGNTY",
      value: (data == null ? void 0 : data.emergenceScore) ?? 0,
      color: CROWN.color
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex gap-2 px-3 py-2 rounded",
      style: {
        background: C.stripBg,
        border: "1px solid oklch(0.12 0.02 255)"
      },
      "data-ocid": "houses.intelligence_levels.panel",
      children: levels.map(({ n, label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[7px] tracking-[0.08em]",
              style: { color: C.dim },
              children: [
                "L",
                n,
                " · ",
                label
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[8px] font-bold", style: { color }, children: value.toFixed(3) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-0.5 rounded-full overflow-hidden",
            style: { background: "oklch(0.12 0.02 265)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full transition-all duration-873",
                style: {
                  width: `${Math.round(value * 100)}%`,
                  background: color,
                  boxShadow: `0 0 3px ${color}`,
                  transition: "width 0.873s ease-out"
                }
              }
            )
          }
        )
      ] }, n))
    }
  );
}
function usePulseToggle(intervalMs) {
  const [pulse, setPulse] = reactExports.useState(false);
  const timerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    timerRef.current = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 200);
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [intervalMs]);
  return pulse;
}
function HousesTab() {
  const { data: organData } = useLiveOrganismData();
  const [selectedHouseId, setSelectedHouseId] = reactExports.useState(null);
  const pulse = usePulseToggle(873);
  const selectedHouse = HOUSES.find((h) => h.id === selectedHouseId) ?? null;
  const beat = organData ? Number(organData.beat) : 0;
  const omnis = (organData == null ? void 0 : organData.omnis) ?? false;
  function toggleHouse(id) {
    setSelectedHouseId((prev) => prev === id ? null : id);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-hidden",
      style: { background: C.bg },
      "data-ocid": "houses.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-2 shrink-0 border-b",
            style: {
              background: "oklch(0.055 0.01 265)",
              borderColor: "oklch(0.15 0.04 255)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[11px] font-bold tracking-[0.2em] uppercase",
                    style: { color: CROWN.color },
                    children: "☽◈ SOVEREIGN CIVILIZATION MAP"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] tracking-[0.1em]",
                    style: { color: C.dim },
                    children: "Casa de Medina · 6 Domus Houses · 10 SDK Organisms"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                omnis && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] tracking-[0.15em] animate-pulse font-bold",
                    style: { color: "#0ECFCF" },
                    children: "◆ OMNIS GATE OPEN"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-1.5 h-1.5 rounded-full",
                      style: {
                        background: pulse ? CROWN.color : "oklch(0.22 0.04 255)",
                        boxShadow: pulse ? `0 0 6px ${CROWN.color}` : "none",
                        transition: "all 0.2s"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[8px]", style: { color: C.dim }, children: [
                    "BEAT ",
                    String(beat).padStart(8, "0")
                  ] })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 px-3 pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IntelligenceLevelBar, { data: organData ?? null }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-1 overflow-y-auto px-3 pb-4",
            style: {
              scrollbarWidth: "thin",
              scrollbarColor: "oklch(0.2 0.04 255) transparent"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 mb-4", "data-ocid": "houses.crown.section", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CrownCard, { data: organData ?? null, pulse }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "mb-4",
                  style: {
                    display: "grid",
                    gridTemplateColumns: selectedHouse ? "1fr 240px" : "1fr",
                    gap: "12px"
                  },
                  "data-ocid": "houses.grid.section",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: "10px"
                        },
                        children: HOUSES.map((house) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          HouseCard,
                          {
                            house,
                            data: organData ?? null,
                            isActive: selectedHouseId === house.id,
                            onClick: () => toggleHouse(house.id),
                            pulse
                          },
                          house.id
                        ))
                      }
                    ),
                    selectedHouse && /* @__PURE__ */ jsxRuntimeExports.jsx(HouseDetailPanel, { house: selectedHouse, data: organData ?? null })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", "data-ocid": "houses.coupling.section", children: /* @__PURE__ */ jsxRuntimeExports.jsx(InterHouseCoupling, { data: organData ?? null }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "houses.sdk.section", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SDKOrganismMap, { selectedHouseId }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-1.5 shrink-0 border-t",
            style: {
              background: C.stripBg,
              borderColor: "oklch(0.12 0.03 255)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-4 font-mono text-[8px]",
                  style: { color: C.dim },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "φ = ",
                      PHI.toFixed(6)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "φ⁻¹ = ",
                      PHI_INV.toFixed(6)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "φ² = ",
                      PHI_SQ.toFixed(6)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: cohColor((organData == null ? void 0 : organData.kuramotoR) ?? 0) }, children: [
                      "R = ",
                      ((organData == null ? void 0 : organData.kuramotoR) ?? 0).toFixed(4)
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[7px] tracking-[0.1em]",
                  style: { color: C.dim },
                  children: "Domus Expressio — Frontend is projection of backend truth · 873ms"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
export {
  HousesTab as default
};
