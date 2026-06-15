import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";

// ── Color palette matching organism shell ────────────────────────────────────
const C = {
  bg: "oklch(0.06 0.01 265)",
  border: "oklch(0.18 0.05 250)",
  dim: "oklch(0.35 0.05 220)",
  text: "oklch(0.85 0.05 210)",
  textDim: "oklch(0.48 0.06 220)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.75 0.22 65)",
  red: "oklch(0.65 0.25 25)",
  cyan: "oklch(0.72 0.22 195)",
  cardBg: "oklch(0.065 0.012 265)",
  cardBgHover: "oklch(0.075 0.014 265)",
  stripBg: "oklch(0.048 0.01 265)",
};

// ── PHI constants (19 decimals) ──────────────────────────────────────────────
const PHI = 1.6180339887498949; // max JS float64 precision
const PHI_INV = 1 / PHI; // 0.618…
const PHI_SQ = PHI * PHI; // 2.618…

// ── House definitions ────────────────────────────────────────────────────────
interface HouseDef {
  id: string;
  latinName: string;
  englishName: string;
  symbol: string;
  color: string;
  glowColor: string;
  governanceDomains: string[];
  sdkOrganisms: string[];
  shortDesc: string;
}

const CROWN: HouseDef = {
  id: "casa_medina",
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
    "Crown Standards",
  ],
  sdkOrganisms: [],
  shortDesc:
    "The crown-jewel house. Governs all inter-house law and sovereign authority.",
};

const HOUSES: HouseDef[] = [
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
      "Authorship Order",
    ],
    sdkOrganisms: ["MEMORIA", "FORMULAE", "GUBERNATIO", "PRIMITIVA"],
    shortDesc: "Generates laws, equations, and symbolic doctrine.",
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
      "Proof State",
    ],
    sdkOrganisms: ["MEMORIA", "PULSUS", "DEFENSIO", "FORMULAE"],
    shortDesc:
      "Generates and governs backend organisms, kernels, and runtime truth.",
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
      "State-Sync with Backend Truth",
    ],
    sdkOrganisms: ["DESIGNIA", "QUANTUMIA", "INTELLIGENTIA"],
    shortDesc:
      "Frontend is projection of backend truth. Governs all UI organisms.",
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
      "API Membranes",
    ],
    sdkOrganisms: ["INTELLIGENTIA", "FORMULAE"],
    shortDesc: "Generates translators, routers, and inter-layer bridges.",
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
      "Anti-Collapse Handling",
    ],
    sdkOrganisms: ["MEMORIA", "PULSUS", "DEFENSIO", "QUANTUMIA"],
    shortDesc: "Cares for internal living systems. The organism's habitat.",
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
      "Lab Ecosystems",
    ],
    sdkOrganisms: ["GUBERNATIO", "PRIMITIVA", "ENTERPRISA"],
    shortDesc:
      "Civilization layer. Architecture becomes repeatable and deployable.",
  },
];

// ── Substrate divisions ──────────────────────────────────────────────────────
const SUBSTRATE_DIVISIONS = [
  { code: "D", label: "Doctrine", title: "Document/Doctrine Division" },
  { code: "F", label: "Frontend", title: "Frontend/Interface Division" },
  { code: "B", label: "Backend", title: "Backend/Runtime Division" },
  { code: "C", label: "Chain", title: "Chain/Deployment Division" },
  { code: "⊕", label: "Care", title: "Care/Recovery Division" },
  { code: "E", label: "External", title: "External/Branch Division" },
];

// ── SDK Organisms cross-house map ────────────────────────────────────────────
const SDK_ORGANISMS = [
  {
    name: "MEMORIA",
    symbol: "◍",
    primary: ["domus_genesis", "domus_substratum", "domus_cura"],
  },
  { name: "PULSUS", symbol: "♥", primary: ["domus_substratum", "domus_cura"] },
  {
    name: "GUBERNATIO",
    symbol: "⊛",
    primary: ["domus_genesis", "domus_civitas"],
  },
  {
    name: "INTELLIGENTIA",
    symbol: "⋈",
    primary: ["domus_translatio", "domus_substratum"],
  },
  {
    name: "FORMULAE",
    symbol: "∑",
    primary: ["domus_genesis", "domus_substratum"],
  },
  {
    name: "DEFENSIO",
    symbol: "⬟",
    primary: ["domus_substratum", "domus_cura"],
  },
  { name: "DESIGNIA", symbol: "◈", primary: ["domus_expressio"] },
  {
    name: "PRIMITIVA",
    symbol: "⌬",
    primary: ["domus_genesis", "domus_civitas"],
  },
  { name: "ENTERPRISA", symbol: "⬡", primary: ["domus_civitas"] },
  {
    name: "QUANTUMIA",
    symbol: "Ψ",
    primary: ["domus_substratum", "domus_cura", "domus_expressio"],
  },
];

// ── Backend hook — reads real canonical state ────────────────────────────────
interface LiveOrganismData {
  kuramotoR: number;
  coherence: number;
  emergenceScore: number;
  beat: bigint;
  omnis: boolean;
  aegisHealth: number;
  thirdBrainCoherence: number;
  ancientFieldContribution: number;
  heartRateBPM: number;
}

function useLiveOrganismData() {
  const { actor, isFetching } = useActor();
  return useQuery<LiveOrganismData | null>({
    queryKey: ["housesTabOrganism"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const [canonical, fear, aegisHealth, thirdBrain, ancient] =
          await Promise.all([
            (actor as any).getCanonicalState(),
            (actor as any).getFearMissionState(),
            (actor as any).getAegisHealthScore(),
            (actor as any).getThirdBrainCoherence(),
            (actor as any).getAncientFieldContribution(),
          ]);
        return {
          kuramotoR: fear?.kuramotoR ?? 0,
          coherence: canonical?.coh ?? 0,
          emergenceScore: canonical?.es ?? 0,
          beat: canonical?.b ?? 0n,
          omnis: canonical?.eg ?? false,
          aegisHealth: aegisHealth ?? 0,
          thirdBrainCoherence: thirdBrain ?? 0,
          ancientFieldContribution: ancient ?? 0,
          heartRateBPM: 60000 / 873, // derived from heartbeat interval
        };
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 873,
    staleTime: 800,
  });
}

// ── Deterministic coherence derivation per house ─────────────────────────────
// House coherence computed from organism's real signals — seeded differently per house
// so each house reads a distinct coherence facet. All derive from real backend data.
function deriveHouseCoherence(
  houseId: string,
  data: LiveOrganismData | null,
): number {
  if (!data) return 0.618;
  const base = data.coherence;
  const r = data.kuramotoR;
  const es = data.emergenceScore;
  const ag = data.aegisHealth;
  const tb = data.thirdBrainCoherence;
  const an = data.ancientFieldContribution;

  // Each house reads a different facet of organism coherence
  switch (houseId) {
    case "domus_genesis":
      // Doctrine coherence: ancient corpus + emergence score
      return Math.min(
        1,
        ((an * PHI_INV + es * PHI_INV + base * 0.2) /
          (PHI_INV + PHI_INV + 0.2)) *
          (PHI_INV + es * 0.382),
      );
    case "domus_substratum":
      // Runtime truth: Kuramoto R is the substrate coherence signal
      return Math.min(1, r * 0.5 + base * 0.3 + ag * 0.2);
    case "domus_expressio":
      // Projection: emergence score drives projection fidelity
      return Math.min(1, es * 0.4 + base * 0.4 + tb * 0.2);
    case "domus_translatio":
      // Bridge: harmonic mean of base + aegis
      return Math.min(1, (2 * base * ag) / (base + ag + 0.001));
    case "domus_cura":
      // Care: third brain coherence is the care signal
      return Math.min(1, tb * 0.5 + ag * 0.3 + base * 0.2);
    case "domus_civitas":
      // Civilization: PHI-weighted composite of all signals
      return Math.min(1, base * PHI_INV + r * (1 - PHI_INV));
    default:
      return base;
  }
}

function deriveLiveness(
  houseId: string,
  data: LiveOrganismData | null,
): number {
  if (!data) return 0.5;
  const beat = Number(data.beat);
  const base = data.coherence;
  // Heartbeat coupling: how well this house tracks the 873ms pulse
  const fibPhase = beat > 0 ? Math.abs(Math.sin(beat * 0.0173)) : 0.5;
  switch (houseId) {
    case "domus_substratum":
      return Math.min(1, base * 0.7 + fibPhase * 0.3);
    case "domus_expressio":
      return Math.min(1, data.emergenceScore * 0.6 + base * 0.4);
    case "domus_cura":
      return Math.min(
        1,
        data.aegisHealth * 0.6 + data.thirdBrainCoherence * 0.4,
      );
    default:
      return Math.min(1, base * 0.6 + fibPhase * 0.4);
  }
}

function deriveGenerationRate(
  houseId: string,
  data: LiveOrganismData | null,
): number {
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

function deriveGovernanceScore(
  houseId: string,
  data: LiveOrganismData | null,
): number {
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

// ── Coherence color ──────────────────────────────────────────────────────────
function cohColor(v: number): string {
  if (v >= PHI_INV) return C.green;
  if (v >= 1 - PHI_INV) return C.amber;
  return C.red;
}

function cohBg(v: number): string {
  if (v >= PHI_INV) return "rgba(30,90,30,0.25)";
  if (v >= 1 - PHI_INV) return "rgba(90,65,0,0.25)";
  return "rgba(90,20,20,0.25)";
}

// ── Substrate division health seed ───────────────────────────────────────────
const DIV_SEEDS = [0.11, 0.19, 0.07, 0.13, 0.17, 0.23];
function divisionHealth(houseCoherence: number, divIdx: number): number {
  return Math.min(1, Math.max(0, houseCoherence + (DIV_SEEDS[divIdx] - 0.1)));
}

// ── Animated coherence bar ───────────────────────────────────────────────────
function CoherenceBar({
  value,
  color,
  label,
  animated,
}: {
  value: number;
  color: string;
  label: string;
  animated?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between items-center">
        <span
          className="font-mono text-[8px] tracking-[0.15em] uppercase"
          style={{ color: C.dim }}
        >
          {label}
        </span>
        <span className="font-mono text-[9px] font-bold" style={{ color }}>
          {value.toFixed(3)}
        </span>
      </div>
      <div
        className="relative h-1 rounded-full overflow-hidden"
        style={{ background: "oklch(0.12 0.02 265)" }}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{
            width: `${Math.round(value * 100)}%`,
            background: color,
            boxShadow: `0 0 4px ${color}`,
            transition: animated ? "width 0.873s ease-out" : "none",
          }}
        />
        {/* PHI_INV tick at 0.618 */}
        <div
          className="absolute top-0 w-px h-full"
          style={{
            left: `${Math.round(PHI_INV * 100)}%`,
            background: "oklch(0.55 0.10 80)",
            opacity: 0.6,
          }}
        />
      </div>
    </div>
  );
}

// ── House Card ───────────────────────────────────────────────────────────────
function HouseCard({
  house,
  data,
  isActive,
  onClick,
  pulse,
}: {
  house: HouseDef;
  data: LiveOrganismData | null;
  isActive: boolean;
  onClick: () => void;
  pulse: boolean;
}) {
  const coherence = deriveHouseCoherence(house.id, data);
  const liveness = deriveLiveness(house.id, data);
  const genRate = deriveGenerationRate(house.id, data);
  const govScore = deriveGovernanceScore(house.id, data);
  const cColor = cohColor(coherence);

  return (
    <button
      type="button"
      data-ocid={`houses.${house.id}.card`}
      onClick={onClick}
      className="flex flex-col gap-2 p-3 rounded text-left transition-all w-full"
      style={{
        background: isActive ? `${house.color}18` : C.cardBg,
        border: `1px solid ${isActive ? house.color : "oklch(0.15 0.03 255)"}`,
        boxShadow: isActive ? `0 0 16px ${house.glowColor}` : "none",
        transition: "all 0.4s ease",
      }}
    >
      {/* Header row */}
      <div className="flex items-start gap-2.5">
        {/* Symbol */}
        <div
          className="flex items-center justify-center shrink-0 rounded font-mono font-bold"
          style={{
            width: "32px",
            height: "32px",
            fontSize: "16px",
            background: `${house.color}20`,
            border: `1px solid ${house.color}50`,
            color: house.color,
            boxShadow: pulse ? `0 0 10px ${house.glowColor}` : "none",
            transition: "box-shadow 0.873s ease",
          }}
        >
          {house.symbol}
        </div>
        {/* Name */}
        <div className="min-w-0 flex-1">
          <div
            className="font-mono text-[10px] font-bold tracking-[0.1em] uppercase leading-none"
            style={{ color: house.color }}
          >
            {house.latinName}
          </div>
          <div
            className="font-mono text-[8px] mt-0.5 leading-snug"
            style={{ color: C.textDim }}
          >
            {house.englishName}
          </div>
        </div>
        {/* Coherence pill */}
        <div
          className="shrink-0 font-mono text-[8px] px-1.5 py-0.5 rounded"
          style={{
            background: cohBg(coherence),
            color: cColor,
            border: `1px solid ${cColor}40`,
          }}
        >
          {(coherence * 100).toFixed(0)}%
        </div>
      </div>

      {/* Coherence bars */}
      <div className="flex flex-col gap-1.5">
        <CoherenceBar
          value={coherence}
          color={cColor}
          label="COHERENCE"
          animated
        />
        <CoherenceBar
          value={liveness}
          color={C.cyan}
          label="LIVENESS"
          animated
        />
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { label: "GEN RATE", value: genRate, color: house.color },
          { label: "GOV SCORE", value: govScore, color: C.amber },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="flex flex-col gap-0.5 px-1.5 py-1 rounded"
            style={{ background: "oklch(0.055 0.009 265)" }}
          >
            <span
              className="font-mono text-[7px] tracking-[0.12em] uppercase"
              style={{ color: C.dim }}
            >
              {label}
            </span>
            <span className="font-mono text-[10px] font-bold" style={{ color }}>
              {value.toFixed(3)}
            </span>
          </div>
        ))}
      </div>

      {/* Substrate divisions */}
      <div className="flex flex-wrap gap-1">
        {SUBSTRATE_DIVISIONS.map((div, i) => {
          const dh = divisionHealth(coherence, i);
          const dc = cohColor(dh);
          return (
            <span
              key={div.code}
              title={div.title}
              className="font-mono text-[7px] px-1 py-0.5 rounded"
              style={{
                background: `${dc}15`,
                border: `1px solid ${dc}50`,
                color: dc,
              }}
            >
              {div.code}
            </span>
          );
        })}
      </div>

      {/* SDK organisms */}
      {house.sdkOrganisms.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {house.sdkOrganisms.map((org) => {
            const sdk = SDK_ORGANISMS.find((s) => s.name === org);
            return (
              <span
                key={org}
                className="font-mono text-[7px] px-1.5 py-0.5 rounded flex items-center gap-1"
                style={{
                  background: `${house.color}12`,
                  border: `1px solid ${house.color}30`,
                  color: C.textDim,
                }}
              >
                {sdk?.symbol ?? "·"} {org}
              </span>
            );
          })}
        </div>
      )}
    </button>
  );
}

// ── Crown Card ───────────────────────────────────────────────────────────────
function CrownCard({
  data,
  pulse,
}: { data: LiveOrganismData | null; pulse: boolean }) {
  const govScore = deriveGovernanceScore("casa_medina", data);
  const coherence = data
    ? Math.min(1, data.kuramotoR * 0.6 + data.coherence * 0.4)
    : 0.618;
  const cColor = cohColor(coherence);

  return (
    <div
      className="flex flex-col gap-3 p-4 rounded"
      style={{
        background: `linear-gradient(135deg, ${CROWN.color}0a 0%, oklch(0.07 0.015 265) 100%)`,
        border: `1px solid ${CROWN.color}60`,
        boxShadow: pulse
          ? `0 0 24px ${CROWN.glowColor}, inset 0 0 24px ${CROWN.color}08`
          : `0 0 8px ${CROWN.glowColor}`,
        transition: "box-shadow 0.873s ease",
      }}
      data-ocid="houses.crown.card"
    >
      {/* Crown header */}
      <div className="flex items-center gap-4">
        <div
          className="flex items-center justify-center shrink-0 rounded"
          style={{
            width: "48px",
            height: "48px",
            fontSize: "22px",
            background: `${CROWN.color}18`,
            border: `1px solid ${CROWN.color}80`,
            color: CROWN.color,
            boxShadow: `0 0 16px ${CROWN.glowColor}`,
            fontFamily: "monospace",
          }}
        >
          {CROWN.symbol}
        </div>
        <div className="flex-1">
          <div
            className="font-mono font-bold tracking-[0.15em] uppercase"
            style={{ fontSize: "13px", color: CROWN.color }}
          >
            {CROWN.latinName}
          </div>
          <div
            className="font-mono text-[9px] tracking-[0.1em] mt-0.5"
            style={{ color: C.textDim }}
          >
            {CROWN.englishName}
          </div>
          <div
            className="font-mono text-[8px] mt-1 italic"
            style={{ color: C.dim }}
          >
            {CROWN.shortDesc}
          </div>
        </div>
        {/* Crown coherence */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div
            className="font-mono text-[18px] font-bold leading-none"
            style={{
              color: CROWN.color,
              textShadow: pulse ? `0 0 12px ${CROWN.color}` : "none",
              transition: "text-shadow 0.873s",
            }}
          >
            {(coherence * 100).toFixed(1)}%
          </div>
          <div
            className="font-mono text-[7px] tracking-[0.15em]"
            style={{ color: C.dim }}
          >
            CROWN COH
          </div>
        </div>
      </div>

      {/* Crown coherence bar */}
      <CoherenceBar
        value={coherence}
        color={cColor}
        label="CROWN COHERENCE — PHI_INV FLOOR"
        animated
      />

      {/* Governance domains */}
      <div>
        <div
          className="font-mono text-[8px] tracking-[0.2em] uppercase mb-1.5"
          style={{ color: C.dim }}
        >
          Governance Domains
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {CROWN.governanceDomains.map((d) => (
            <div
              key={d}
              className="font-mono text-[7.5px] px-2 py-1 rounded text-center"
              style={{
                background: `${CROWN.color}10`,
                border: `1px solid ${CROWN.color}30`,
                color: CROWN.color,
              }}
            >
              {d}
            </div>
          ))}
        </div>
      </div>

      {/* Crown metrics */}
      <div className="flex gap-3">
        {[
          {
            label: "GOV SCORE",
            value: govScore.toFixed(3),
            color: CROWN.color,
          },
          {
            label: "KURATOMO R",
            value: (data?.kuramotoR ?? 0).toFixed(3),
            color: C.cyan,
          },
          {
            label: "AEGIS HEALTH",
            value: (data?.aegisHealth ?? 0).toFixed(3),
            color: C.green,
          },
          {
            label: "ANCIENT FIELD",
            value: (data?.ancientFieldContribution ?? 0).toFixed(3),
            color: C.amber,
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="flex flex-col gap-0.5 px-2 py-1.5 rounded flex-1"
            style={{
              background: "oklch(0.055 0.009 265)",
              border: "1px solid oklch(0.12 0.02 255)",
            }}
          >
            <span
              className="font-mono text-[7px] tracking-[0.1em] uppercase"
              style={{ color: C.dim }}
            >
              {label}
            </span>
            <span className="font-mono text-[11px] font-bold" style={{ color }}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Inter-House Coupling ─────────────────────────────────────────────────────
function InterHouseCoupling({ data }: { data: LiveOrganismData | null }) {
  const couplings: Array<{
    from: string;
    to: string;
    ratio: string;
    strength: number;
  }> = [
    {
      from: "Domus Genesis",
      to: "Domus Substratum",
      ratio: "PHI",
      strength: data
        ? Math.min(
            1,
            data.emergenceScore * PHI_INV + data.kuramotoR * (1 - PHI_INV),
          )
        : 0.5,
    },
    {
      from: "Domus Substratum",
      to: "Domus Expressio",
      ratio: "PHI_INV",
      strength: data
        ? Math.min(1, data.coherence * 0.7 + data.thirdBrainCoherence * 0.3)
        : 0.5,
    },
    {
      from: "Domus Expressio",
      to: "Domus Translatio",
      ratio: "PHI²",
      strength: data
        ? Math.min(
            1,
            data.emergenceScore * 0.5 + data.ancientFieldContribution * 0.5,
          )
        : 0.5,
    },
    {
      from: "Domus Translatio",
      to: "Domus Cura",
      ratio: "PHI_INV",
      strength: data
        ? Math.min(
            1,
            data.aegisHealth * PHI_INV +
              data.thirdBrainCoherence * (1 - PHI_INV),
          )
        : 0.5,
    },
    {
      from: "Domus Cura",
      to: "Domus Civitas",
      ratio: "PHI",
      strength: data
        ? Math.min(1, data.thirdBrainCoherence * 0.6 + data.coherence * 0.4)
        : 0.5,
    },
    {
      from: "Domus Genesis",
      to: "Domus Cura",
      ratio: "PHI²",
      strength: data
        ? Math.min(
            1,
            data.ancientFieldContribution * PHI_INV +
              data.aegisHealth * (1 - PHI_INV),
          )
        : 0.5,
    },
  ];

  return (
    <div
      className="flex flex-col gap-2 p-3 rounded"
      style={{
        background: C.cardBg,
        border: "1px solid oklch(0.14 0.03 255)",
      }}
      data-ocid="houses.coupling.panel"
    >
      <div
        className="font-mono text-[9px] tracking-[0.2em] uppercase"
        style={{ color: C.dim }}
      >
        Inter-House Coupling Strengths
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {couplings.map(({ from, to, ratio, strength }) => {
          const sc = cohColor(strength);
          return (
            <div
              key={`${from}-${to}`}
              className="flex flex-col gap-1 px-2 py-1.5 rounded"
              style={{
                background: "oklch(0.052 0.008 265)",
                border: "1px solid oklch(0.12 0.02 255)",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-[7px] font-bold"
                  style={{ color: C.amber }}
                >
                  {ratio}
                </span>
                <span
                  className="font-mono text-[8px] font-bold"
                  style={{ color: sc }}
                >
                  {strength.toFixed(3)}
                </span>
              </div>
              <div
                className="font-mono text-[7px] leading-snug"
                style={{ color: C.dim }}
              >
                {from} ⇌ {to}
              </div>
              <div
                className="h-0.5 rounded-full"
                style={{
                  background: `linear-gradient(to right, ${sc}, ${sc}40)`,
                  width: `${Math.round(strength * 100)}%`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── SDK Organism Map ─────────────────────────────────────────────────────────
function SDKOrganismMap({
  selectedHouseId,
}: { selectedHouseId: string | null }) {
  return (
    <div
      className="flex flex-col gap-2 p-3 rounded"
      style={{
        background: C.cardBg,
        border: "1px solid oklch(0.14 0.03 255)",
      }}
      data-ocid="houses.sdk_organisms.panel"
    >
      <div
        className="font-mono text-[9px] tracking-[0.2em] uppercase"
        style={{ color: C.dim }}
      >
        High-Council SDK Organisms
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {SDK_ORGANISMS.map((org) => {
          const isHighlighted =
            selectedHouseId !== null && org.primary.includes(selectedHouseId);
          const primaryHouses = org.primary.map(
            (id) =>
              HOUSES.find((h) => h.id === id)?.latinName.replace(
                "Domus ",
                "",
              ) ?? id,
          );

          return (
            <div
              key={org.name}
              className="flex flex-col gap-1.5 p-2 rounded transition-all"
              style={{
                background: isHighlighted
                  ? "oklch(0.085 0.015 265)"
                  : "oklch(0.052 0.008 265)",
                border: `1px solid ${isHighlighted ? "oklch(0.28 0.08 255)" : "oklch(0.12 0.02 255)"}`,
              }}
              data-ocid={`houses.sdk.${org.name.toLowerCase()}.card`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="font-mono text-[13px] leading-none"
                  style={{ color: isHighlighted ? C.cyan : C.dim }}
                >
                  {org.symbol}
                </span>
                <span
                  className="font-mono text-[8px] font-bold tracking-[0.08em]"
                  style={{ color: isHighlighted ? C.text : C.textDim }}
                >
                  {org.name}
                </span>
              </div>
              <div className="flex flex-wrap gap-0.5">
                {primaryHouses.map((h) => (
                  <span
                    key={h}
                    className="font-mono text-[6px] px-1 py-0.5 rounded"
                    style={{
                      background: isHighlighted
                        ? "oklch(0.12 0.04 255)"
                        : "oklch(0.06 0.008 265)",
                      color: isHighlighted ? C.cyan : C.dim,
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── House Detail Panel ───────────────────────────────────────────────────────
function HouseDetailPanel({
  house,
  data,
}: { house: HouseDef; data: LiveOrganismData | null }) {
  const coherence = deriveHouseCoherence(house.id, data);
  const liveness = deriveLiveness(house.id, data);
  const cColor = cohColor(coherence);

  return (
    <div
      className="flex flex-col gap-3 p-3 rounded h-full"
      style={{
        background: `${house.color}08`,
        border: `1px solid ${house.color}40`,
      }}
      data-ocid="houses.detail.panel"
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-xl" style={{ color: house.color }}>
          {house.symbol}
        </span>
        <div>
          <div
            className="font-mono text-[11px] font-bold tracking-[0.1em]"
            style={{ color: house.color }}
          >
            {house.latinName}
          </div>
          <div className="font-mono text-[8px]" style={{ color: C.textDim }}>
            {house.shortDesc}
          </div>
        </div>
      </div>

      <CoherenceBar
        value={coherence}
        color={cColor}
        label="COHERENCE"
        animated
      />
      <CoherenceBar value={liveness} color={C.cyan} label="LIVENESS" animated />

      <div>
        <div
          className="font-mono text-[8px] tracking-[0.15em] uppercase mb-1.5"
          style={{ color: C.dim }}
        >
          Governance Domains
        </div>
        <div className="flex flex-col gap-0.5">
          {house.governanceDomains.map((d) => (
            <div
              key={d}
              className="font-mono text-[8px] px-2 py-0.5 rounded flex items-center gap-1.5"
              style={{
                background: `${house.color}10`,
                border: `1px solid ${house.color}25`,
                color: C.textDim,
              }}
            >
              <span style={{ color: house.color, fontSize: "8px" }}>▸</span>
              {d}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div
          className="font-mono text-[8px] tracking-[0.15em] uppercase mb-1.5"
          style={{ color: C.dim }}
        >
          Substrate Divisions
        </div>
        <div className="flex flex-col gap-1">
          {SUBSTRATE_DIVISIONS.map((div, i) => {
            const dh = divisionHealth(coherence, i);
            const dc = cohColor(dh);
            return (
              <div key={div.code} className="flex items-center gap-2">
                <span
                  className="font-mono text-[9px] w-5 text-center"
                  style={{ color: dc }}
                >
                  {div.code}
                </span>
                <span
                  className="font-mono text-[8px] flex-1"
                  style={{ color: C.textDim }}
                >
                  {div.label}
                </span>
                <span className="font-mono text-[8px]" style={{ color: dc }}>
                  {(dh * 100).toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Organism Intelligence Level Pills ────────────────────────────────────────
function IntelligenceLevelBar({ data }: { data: LiveOrganismData | null }) {
  const levels = [
    {
      n: 1,
      label: "FIELD/PHYSICS",
      value: data?.kuramotoR ?? 0,
      color: C.cyan,
    },
    {
      n: 2,
      label: "BIOLOGICAL",
      value: data ? Math.min(1, data.heartRateBPM / 120) : 0,
      color: C.green,
    },
    { n: 3, label: "COGNITIVE", value: data?.coherence ?? 0, color: "#9B59B6" },
    {
      n: 4,
      label: "MEMORY/IDENTITY",
      value: data?.thirdBrainCoherence ?? 0,
      color: C.amber,
    },
    {
      n: 5,
      label: "EMERGENCE/SOVEREIGNTY",
      value: data?.emergenceScore ?? 0,
      color: CROWN.color,
    },
  ];

  return (
    <div
      className="flex gap-2 px-3 py-2 rounded"
      style={{
        background: C.stripBg,
        border: "1px solid oklch(0.12 0.02 255)",
      }}
      data-ocid="houses.intelligence_levels.panel"
    >
      {levels.map(({ n, label, value, color }) => (
        <div key={n} className="flex flex-col gap-1 flex-1">
          <div className="flex items-center justify-between">
            <span
              className="font-mono text-[7px] tracking-[0.08em]"
              style={{ color: C.dim }}
            >
              L{n} · {label}
            </span>
            <span className="font-mono text-[8px] font-bold" style={{ color }}>
              {value.toFixed(3)}
            </span>
          </div>
          <div
            className="h-0.5 rounded-full overflow-hidden"
            style={{ background: "oklch(0.12 0.02 265)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-873"
              style={{
                width: `${Math.round(value * 100)}%`,
                background: color,
                boxShadow: `0 0 3px ${color}`,
                transition: "width 0.873s ease-out",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Beat pulse hook ──────────────────────────────────────────────────────────
function usePulseToggle(intervalMs: number) {
  const [pulse, setPulse] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
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

// ── Main HousesTab ───────────────────────────────────────────────────────────
export default function HousesTab() {
  const { data: organData } = useLiveOrganismData();
  const [selectedHouseId, setSelectedHouseId] = useState<string | null>(null);
  const pulse = usePulseToggle(873);

  const selectedHouse = HOUSES.find((h) => h.id === selectedHouseId) ?? null;
  const beat = organData ? Number(organData.beat) : 0;
  const omnis = organData?.omnis ?? false;

  function toggleHouse(id: string) {
    setSelectedHouseId((prev) => (prev === id ? null : id));
  }

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: C.bg }}
      data-ocid="houses.page"
    >
      {/* ── Header strip ──────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 py-2 shrink-0 border-b"
        style={{
          background: "oklch(0.055 0.01 265)",
          borderColor: "oklch(0.15 0.04 255)",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase"
            style={{ color: CROWN.color }}
          >
            ☽◈ SOVEREIGN CIVILIZATION MAP
          </span>
          <span
            className="font-mono text-[8px] tracking-[0.1em]"
            style={{ color: C.dim }}
          >
            Casa de Medina · 6 Domus Houses · 10 SDK Organisms
          </span>
        </div>
        <div className="flex items-center gap-3">
          {omnis && (
            <span
              className="font-mono text-[8px] tracking-[0.15em] animate-pulse font-bold"
              style={{ color: "#0ECFCF" }}
            >
              ◆ OMNIS GATE OPEN
            </span>
          )}
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: pulse ? CROWN.color : "oklch(0.22 0.04 255)",
                boxShadow: pulse ? `0 0 6px ${CROWN.color}` : "none",
                transition: "all 0.2s",
              }}
            />
            <span className="font-mono text-[8px]" style={{ color: C.dim }}>
              BEAT {String(beat).padStart(8, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* ── Intelligence levels ───────────────────────────────────────────── */}
      <div className="shrink-0 px-3 pt-2">
        <IntelligenceLevelBar data={organData ?? null} />
      </div>

      {/* ── Scrollable content ────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto px-3 pb-4"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "oklch(0.2 0.04 255) transparent",
        }}
      >
        {/* Crown card */}
        <div className="mt-3 mb-4" data-ocid="houses.crown.section">
          <CrownCard data={organData ?? null} pulse={pulse} />
        </div>

        {/* Houses grid + detail pane */}
        <div
          className="mb-4"
          style={{
            display: "grid",
            gridTemplateColumns: selectedHouse ? "1fr 240px" : "1fr",
            gap: "12px",
          }}
          data-ocid="houses.grid.section"
        >
          {/* Houses 2×3 grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
            }}
          >
            {HOUSES.map((house) => (
              <HouseCard
                key={house.id}
                house={house}
                data={organData ?? null}
                isActive={selectedHouseId === house.id}
                onClick={() => toggleHouse(house.id)}
                pulse={pulse}
              />
            ))}
          </div>

          {/* Detail panel */}
          {selectedHouse && (
            <HouseDetailPanel house={selectedHouse} data={organData ?? null} />
          )}
        </div>

        {/* Inter-house coupling */}
        <div className="mb-4" data-ocid="houses.coupling.section">
          <InterHouseCoupling data={organData ?? null} />
        </div>

        {/* SDK organism map */}
        <div data-ocid="houses.sdk.section">
          <SDKOrganismMap selectedHouseId={selectedHouseId} />
        </div>
      </div>

      {/* ── PHI coupling footer ───────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 py-1.5 shrink-0 border-t"
        style={{
          background: C.stripBg,
          borderColor: "oklch(0.12 0.03 255)",
        }}
      >
        <div
          className="flex items-center gap-4 font-mono text-[8px]"
          style={{ color: C.dim }}
        >
          <span>φ = {PHI.toFixed(6)}</span>
          <span>φ⁻¹ = {PHI_INV.toFixed(6)}</span>
          <span>φ² = {PHI_SQ.toFixed(6)}</span>
          <span style={{ color: cohColor(organData?.kuramotoR ?? 0) }}>
            R = {(organData?.kuramotoR ?? 0).toFixed(4)}
          </span>
        </div>
        <div
          className="font-mono text-[7px] tracking-[0.1em]"
          style={{ color: C.dim }}
        >
          Domus Expressio — Frontend is projection of backend truth · 873ms
        </div>
      </div>
    </div>
  );
}
