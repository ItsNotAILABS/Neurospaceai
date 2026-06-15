import { useMemo, useState } from "react";
import type {
  NeuralSimulationControls,
  NeuralSimulationState,
} from "../hooks/useNeuralSimulation";

type Neural = NeuralSimulationState & NeuralSimulationControls;

// ── Pharma design tokens (teal/cyan) ──────────────────────────────────────────
const P = {
  primary: "var(--pharma-primary, oklch(0.72 0.18 195))",
  glow: "var(--pharma-glow, oklch(0.82 0.20 190))",
  accent: "var(--pharma-accent, oklch(0.68 0.22 185))",
  neon: "var(--pharma-neon-teal, oklch(0.88 0.22 192))",
  border: "var(--pharma-border, oklch(0.22 0.08 215))",
  surfaceMid: "var(--pharma-surface-mid, oklch(0.10 0.02 240))",
  surfaceLight: "var(--pharma-surface-light, oklch(0.13 0.03 235))",
  textPrimary: "var(--pharma-text-primary, oklch(0.88 0.06 210))",
  textSecondary: "var(--pharma-text-secondary, oklch(0.52 0.08 215))",
  dim: "oklch(0.38 0.05 220)",
} as const;

// ── Pharmacological class colors ──────────────────────────────────────────────
const CLASS_COLORS: Record<string, string> = {
  excitatory: "oklch(0.72 0.22 55)", // amber
  inhibitory: "oklch(0.68 0.22 140)", // green
  modulatory: "oklch(0.72 0.18 195)", // teal
  peptide: "oklch(0.68 0.22 290)", // purple
  gaseous: "oklch(0.72 0.20 165)", // lime-green
  neuropeptide: "oklch(0.65 0.20 255)", // blue
};

// ── 24 Neurochemical definitions ──────────────────────────────────────────────
const CHEMICALS = [
  // Classic 8
  {
    id: "DPA",
    name: "Dopamine",
    abbr: "DPA",
    class: "excitatory",
    synth: 0.72,
    decay: 0.41,
    key: "dopamine" as const,
    group: "classic",
  },
  {
    id: "SER",
    name: "Serotonin",
    abbr: "SER",
    class: "modulatory",
    synth: 0.58,
    decay: 0.3,
    key: "serotonin" as const,
    group: "classic",
  },
  {
    id: "NOR",
    name: "Norepinephrine",
    abbr: "NOR",
    class: "excitatory",
    synth: 0.65,
    decay: 0.38,
    key: "norepinephrine" as const,
    group: "classic",
  },
  {
    id: "ACH",
    name: "Acetylcholine",
    abbr: "ACH",
    class: "excitatory",
    synth: 0.6,
    decay: 0.45,
    key: "acetylcholine" as const,
    group: "classic",
  },
  {
    id: "GAB",
    name: "GABA",
    abbr: "GAB",
    class: "inhibitory",
    synth: 0.55,
    decay: 0.28,
    key: "gaba" as const,
    group: "classic",
  },
  {
    id: "GLU",
    name: "Glutamate",
    abbr: "GLU",
    class: "excitatory",
    synth: 0.8,
    decay: 0.52,
    key: "glutamate" as const,
    group: "classic",
  },
  {
    id: "COR",
    name: "Cortisol",
    abbr: "COR",
    class: "modulatory",
    synth: 0.4,
    decay: 0.18,
    key: null,
    group: "classic",
  },
  {
    id: "OXT",
    name: "Oxytocin",
    abbr: "OXT",
    class: "peptide",
    synth: 0.35,
    decay: 0.22,
    key: null,
    group: "classic",
  },
  // Extended 16
  {
    id: "MEL",
    name: "Melatonin",
    abbr: "MEL",
    class: "modulatory",
    synth: 0.3,
    decay: 0.15,
    key: null,
    group: "extended",
  },
  {
    id: "BEND",
    name: "β-Endorphin",
    abbr: "BEND",
    class: "peptide",
    synth: 0.38,
    decay: 0.2,
    key: null,
    group: "extended",
  },
  {
    id: "ANA",
    name: "Anandamide",
    abbr: "ANA",
    class: "modulatory",
    synth: 0.45,
    decay: 0.35,
    key: null,
    group: "extended",
  },
  {
    id: "SUBP",
    name: "Substance P",
    abbr: "SUB-P",
    class: "neuropeptide",
    synth: 0.42,
    decay: 0.25,
    key: null,
    group: "extended",
  },
  {
    id: "NPY",
    name: "Neuropeptide Y",
    abbr: "NPY",
    class: "neuropeptide",
    synth: 0.5,
    decay: 0.28,
    key: null,
    group: "extended",
  },
  {
    id: "CRH",
    name: "CRH",
    abbr: "CRH",
    class: "neuropeptide",
    synth: 0.35,
    decay: 0.2,
    key: null,
    group: "extended",
  },
  {
    id: "VIP",
    name: "VIP",
    abbr: "VIP",
    class: "neuropeptide",
    synth: 0.4,
    decay: 0.22,
    key: null,
    group: "extended",
  },
  {
    id: "CCK",
    name: "Cholecystokinin",
    abbr: "CCK",
    class: "neuropeptide",
    synth: 0.44,
    decay: 0.26,
    key: null,
    group: "extended",
  },
  {
    id: "ADO",
    name: "Adenosine",
    abbr: "ADO",
    class: "inhibitory",
    synth: 0.55,
    decay: 0.3,
    key: null,
    group: "extended",
  },
  {
    id: "HIS",
    name: "Histamine",
    abbr: "HIS",
    class: "excitatory",
    synth: 0.48,
    decay: 0.33,
    key: null,
    group: "extended",
  },
  {
    id: "NO",
    name: "Nitric Oxide",
    abbr: "NO",
    class: "gaseous",
    synth: 0.6,
    decay: 0.55,
    key: null,
    group: "extended",
  },
  {
    id: "BDNF",
    name: "BDNF",
    abbr: "BDNF",
    class: "modulatory",
    synth: 0.32,
    decay: 0.12,
    key: null,
    group: "extended",
  },
  {
    id: "IGF1",
    name: "IGF-1",
    abbr: "IGF-1",
    class: "modulatory",
    synth: 0.28,
    decay: 0.1,
    key: null,
    group: "extended",
  },
  {
    id: "PRL",
    name: "Prolactin",
    abbr: "PRL",
    class: "peptide",
    synth: 0.3,
    decay: 0.16,
    key: null,
    group: "extended",
  },
  {
    id: "AVP",
    name: "Vasopressin",
    abbr: "AVP",
    class: "peptide",
    synth: 0.36,
    decay: 0.2,
    key: null,
    group: "extended",
  },
  {
    id: "DYN",
    name: "Dynorphin",
    abbr: "DYN",
    class: "peptide",
    synth: 0.4,
    decay: 0.24,
    key: null,
    group: "extended",
  },
] as const;

type _ChemKey = (typeof CHEMICALS)[number]["id"];

// ── Compound library ─────────────────────────────────────────────────────────
const COMPOUND_LIBRARY = [
  {
    id: "C01",
    name: "DA Agonist D1",
    target: "D1/D5",
    mechanism: "Agonist",
    regions: ["PrefrontalCortex", "NucleusAccumbens"],
    affects: ["DPA"],
    Kd: 2.4e-9,
    EC50: 8e-9,
    IC50: null,
    Hill: 1.1,
  },
  {
    id: "C02",
    name: "DA Agonist D2",
    target: "D2/D3",
    mechanism: "Agonist",
    regions: ["BasalGanglia", "NucleusAccumbens", "Striatum"],
    affects: ["DPA"],
    Kd: 1.8e-9,
    EC50: 5e-9,
    IC50: null,
    Hill: 0.9,
  },
  {
    id: "C03",
    name: "SSRI Fluoxetine",
    target: "SERT (5-HT)",
    mechanism: "Reuptake Inhibitor",
    regions: ["Hippocampus", "PrefrontalCortex", "Amygdala"],
    affects: ["SER"],
    Kd: 0.8e-9,
    EC50: null,
    IC50: 1e-9,
    Hill: 1.0,
  },
  {
    id: "C04",
    name: "5-HT1A Agonist",
    target: "5-HT1A",
    mechanism: "Agonist",
    regions: ["Hippocampus", "Raphe Nuclei"],
    affects: ["SER"],
    Kd: 0.5e-9,
    EC50: 2e-9,
    IC50: null,
    Hill: 1.2,
  },
  {
    id: "C05",
    name: "GABA-A Enhancer",
    target: "GABA-A",
    mechanism: "Positive Modulator",
    regions: ["Thalamus", "Cerebellum", "Amygdala"],
    affects: ["GAB"],
    Kd: 5.0e-9,
    EC50: 20e-9,
    IC50: null,
    Hill: 1.5,
  },
  {
    id: "C06",
    name: "NMDA Antagonist",
    target: "NMDA (Glu)",
    mechanism: "Antagonist",
    regions: ["Hippocampus", "PrefrontalCortex", "ACC"],
    affects: ["GLU"],
    Kd: 1.2e-9,
    EC50: null,
    IC50: 2.5e-9,
    Hill: 1.0,
  },
  {
    id: "C07",
    name: "NET Inhibitor",
    target: "NET (NE)",
    mechanism: "Reuptake Inhibitor",
    regions: ["LC-NE", "PrefrontalCortex", "Amygdala"],
    affects: ["NOR"],
    Kd: 0.9e-9,
    EC50: null,
    IC50: 1.5e-9,
    Hill: 1.1,
  },
  {
    id: "C08",
    name: "nAChR Agonist",
    target: "nAChR (ACh)",
    mechanism: "Agonist",
    regions: ["MotorCortex", "Hippocampus", "Thalamus"],
    affects: ["ACH"],
    Kd: 3.5e-9,
    EC50: 15e-9,
    IC50: null,
    Hill: 1.8,
  },
  {
    id: "C09",
    name: "CB1 Agonist (ANA)",
    target: "CB1 (Endo)",
    mechanism: "Agonist",
    regions: ["BasalGanglia", "Cerebellum", "Hippocampus"],
    affects: ["ANA"],
    Kd: 0.3e-9,
    EC50: 1e-9,
    IC50: null,
    Hill: 1.0,
  },
  {
    id: "C10",
    name: "μ-Opioid Agonist",
    target: "μ-OR",
    mechanism: "Agonist",
    regions: ["NucleusAccumbens", "PAG", "Thalamus"],
    affects: ["BEND", "DYN"],
    Kd: 0.4e-9,
    EC50: 2e-9,
    IC50: null,
    Hill: 1.3,
  },
  {
    id: "C11",
    name: "NPY Y1 Agonist",
    target: "Y1/Y2 (NPY)",
    mechanism: "Agonist",
    regions: ["Hypothalamus", "Amygdala", "Hippocampus"],
    affects: ["NPY"],
    Kd: 1.1e-9,
    EC50: 5e-9,
    IC50: null,
    Hill: 1.0,
  },
  {
    id: "C12",
    name: "BDNF TrkB Agonist",
    target: "TrkB (BDNF)",
    mechanism: "Agonist",
    regions: ["Hippocampus", "PrefrontalCortex", "Cerebellum"],
    affects: ["BDNF"],
    Kd: 0.6e-9,
    EC50: 3e-9,
    IC50: null,
    Hill: 1.0,
  },
  {
    id: "C13",
    name: "A1R Antagonist",
    target: "A1R (ADO)",
    mechanism: "Antagonist",
    regions: ["Hippocampus", "Thalamus", "Striatum"],
    affects: ["ADO"],
    Kd: 2.0e-9,
    EC50: null,
    IC50: 8e-9,
    Hill: 1.1,
  },
  {
    id: "C14",
    name: "CRH-R1 Antagonist",
    target: "CRH-R1",
    mechanism: "Antagonist",
    regions: ["Amygdala", "Hypothalamus", "LC-NE"],
    affects: ["CRH"],
    Kd: 1.5e-9,
    EC50: null,
    IC50: 4e-9,
    Hill: 1.2,
  },
] as const;

type CompoundId = (typeof COMPOUND_LIBRARY)[number]["id"];

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatKd(v: number | null): string {
  if (v === null) return "—";
  const nm = v * 1e9;
  return nm < 10 ? `${nm.toFixed(1)} nM` : `${nm.toFixed(0)} nM`;
}

function getLiveLevel(
  chem: (typeof CHEMICALS)[number],
  neural: Neural,
): number {
  const nm = neural.neuromodulatorLevels;
  if (chem.key === "dopamine") return nm.dopamine;
  if (chem.key === "serotonin") return nm.serotonin;
  if (chem.key === "norepinephrine") return nm.norepinephrine;
  if (chem.key === "acetylcholine") return nm.acetylcholine;
  if (chem.key === "gaba") return nm.gaba;
  if (chem.key === "glutamate") return nm.glutamate;
  // Derive extended chemicals from available signals
  const t = neural.neurotransmitters;
  const tick = neural.tick;
  switch (chem.id) {
    case "COR":
      return neural.cortisolLevel;
    case "OXT":
      return neural.ansState
        ? ((neural.ansState as { parasympatheticBalance?: number })
            .parasympatheticBalance ?? 0.4)
        : 0.4;
    case "MEL":
      return 0.3 + 0.15 * Math.sin(tick * 0.002);
    case "BEND":
      return Math.min(1, t.dopamine * 0.6 + 0.15);
    case "ANA":
      return Math.min(1, (1 - t.glutamate) * 0.5 + 0.25);
    case "SUBP":
      return Math.min(1, t.norepinephrine * 0.55 + 0.18);
    case "NPY":
      return Math.min(1, neural.hungerDrive * 0.7 + 0.15);
    case "CRH":
      return Math.min(1, neural.cortisolLevel * 0.8 + 0.1);
    case "VIP":
      return Math.min(1, neural.parasympatheticTone * 0.6 + 0.2);
    case "CCK":
      return Math.min(1, neural.hungerDrive * 0.5 + 0.25);
    case "ADO":
      return Math.min(1, neural.sleepPressure * 0.85 + 0.1);
    case "HIS":
      return Math.min(1, neural.globalArousal * 0.65 + 0.15);
    case "NO":
      return Math.min(1, t.glutamate * 0.4 + t.dopamine * 0.25 + 0.1);
    case "BDNF":
      return Math.min(1, neural.metacognitiveConfidence * 0.5 + 0.25);
    case "IGF1":
      return Math.min(1, neural.maturityScore * 0.4 + 0.2);
    case "PRL":
      return Math.min(1, neural.parasympatheticTone * 0.4 + 0.2);
    case "AVP":
      return Math.min(1, (1 - neural.parasympatheticTone) * 0.3 + 0.25);
    case "DYN":
      return Math.min(1, t.gaba * 0.5 + 0.2);
    default:
      return 0.35;
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ChemBar({
  name,
  abbr,
  pharmClass,
  level,
  synth,
  decay,
}: {
  name: string;
  abbr: string;
  pharmClass: string;
  level: number;
  synth: number;
  decay: number;
}) {
  const classColor = CLASS_COLORS[pharmClass] ?? P.primary;
  const pct = Math.round(level * 100);
  return (
    <div
      className="flex flex-col gap-0.5 px-2 py-1.5 border"
      style={{
        borderColor: `${classColor}25`,
        background: `${classColor}08`,
      }}
    >
      <div className="flex items-center justify-between gap-1 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="font-mono text-[8px] font-bold tracking-wide shrink-0"
            style={{ color: classColor }}
          >
            {abbr}
          </span>
          <span
            className="font-mono text-[7px] truncate"
            style={{ color: P.textSecondary }}
          >
            {name}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[7px]" style={{ color: P.dim }}>
            s:{synth.toFixed(2)} d:{decay.toFixed(2)}
          </span>
          <span
            className="font-mono text-[8px] font-bold w-8 text-right"
            style={{ color: classColor }}
          >
            {pct}%
          </span>
        </div>
      </div>
      <div
        className="h-[3px] w-full rounded-none"
        style={{ background: `${classColor}18` }}
      >
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(to right, ${classColor}80, ${classColor})`,
            boxShadow: pct > 75 ? `0 0 4px ${classColor}` : undefined,
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-[6px] uppercase tracking-wide"
          style={{ color: classColor, opacity: 0.7 }}
        >
          {pharmClass}
        </span>
      </div>
    </div>
  );
}

function NeurochemPanel({ neural }: { neural: Neural }) {
  const classic = CHEMICALS.filter((c) => c.group === "classic");
  const extended = CHEMICALS.filter((c) => c.group === "extended");

  return (
    <div className="flex flex-col gap-3">
      {/* Classic 8 */}
      <div>
        <div
          className="font-mono text-[8px] tracking-[0.2em] uppercase mb-2 pb-1 border-b"
          style={{ color: P.primary, borderColor: `${P.border}` }}
        >
          ◈ CLASSIC MONOAMINES & PRIMARY NT (8)
        </div>
        <div className="grid grid-cols-2 gap-1">
          {classic.map((c) => (
            <ChemBar
              key={c.id}
              name={c.name}
              abbr={c.abbr}
              pharmClass={c.class}
              level={getLiveLevel(c, neural)}
              synth={c.synth}
              decay={c.decay}
            />
          ))}
        </div>
      </div>
      {/* Extended 16 */}
      <div>
        <div
          className="font-mono text-[8px] tracking-[0.2em] uppercase mb-2 pb-1 border-b"
          style={{ color: P.accent, borderColor: `${P.border}` }}
        >
          ◈ EXTENDED NEUROMODULATOR MATRIX (16)
        </div>
        <div className="grid grid-cols-2 gap-1">
          {extended.map((c) => (
            <ChemBar
              key={c.id}
              name={c.name}
              abbr={c.abbr}
              pharmClass={c.class}
              level={getLiveLevel(c, neural)}
              synth={c.synth}
              decay={c.decay}
            />
          ))}
        </div>
      </div>
      {/* Class legend */}
      <div
        className="flex flex-wrap gap-x-3 gap-y-1 pt-1 border-t"
        style={{ borderColor: P.border }}
      >
        {Object.entries(CLASS_COLORS).map(([cls, color]) => (
          <div key={cls} className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-none"
              style={{ background: color }}
            />
            <span
              className="font-mono text-[6px] uppercase tracking-wide"
              style={{ color: P.dim }}
            >
              {cls}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompoundLibraryPanel({
  selected,
  onSelect,
}: {
  selected: CompoundId | null;
  onSelect: (id: CompoundId) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {COMPOUND_LIBRARY.map((c, i) => {
        const isSelected = selected === c.id;
        return (
          <button
            key={c.id}
            type="button"
            data-ocid={`pharma.compound_lib.item.${i + 1}`}
            onClick={() => onSelect(c.id)}
            className="text-left px-2.5 py-2 border transition-all"
            style={{
              borderColor: isSelected ? P.primary : `${P.border}`,
              background: isSelected ? `${P.primary}12` : `${P.surfaceMid}`,
              boxShadow: isSelected ? `0 0 6px ${P.primary}30` : "none",
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div
                  className="font-mono text-[9px] font-bold tracking-wide truncate"
                  style={{ color: isSelected ? P.neon : P.textPrimary }}
                >
                  {c.name}
                </div>
                <div
                  className="font-mono text-[7px] mt-0.5"
                  style={{ color: P.textSecondary }}
                >
                  {c.target} · {c.mechanism}
                </div>
              </div>
              <span
                className="font-mono text-[7px] px-1.5 py-0.5 shrink-0 border"
                style={{
                  color: P.accent,
                  borderColor: `${P.accent}40`,
                  background: `${P.accent}10`,
                }}
              >
                {c.id}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {c.regions.map((r) => (
                <span
                  key={r}
                  className="font-mono text-[6px] px-1 border"
                  style={{
                    color: P.dim,
                    borderColor: `${P.border}`,
                  }}
                >
                  {r}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function InteractionMapPanel({ selected }: { selected: CompoundId | null }) {
  const selectedCompound = selected
    ? COMPOUND_LIBRARY.find((c) => c.id === selected)
    : null;
  const affectedChems = selectedCompound
    ? new Set(selectedCompound.affects as readonly string[])
    : new Set<string>();

  return (
    <div>
      <div className="overflow-x-auto">
        <table style={{ borderCollapse: "collapse", minWidth: "100%" }}>
          <thead>
            <tr>
              <th
                className="font-mono text-[7px] px-2 py-1 text-left"
                style={{ color: P.dim, background: P.surfaceMid }}
              >
                COMPOUND
              </th>
              {CHEMICALS.map((c) => (
                <th
                  key={c.id}
                  className="font-mono text-[6px] px-1 py-1 text-center"
                  style={{
                    color: affectedChems.has(c.id) ? P.neon : P.dim,
                    background: P.surfaceMid,
                    minWidth: "28px",
                  }}
                >
                  {c.abbr.substring(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPOUND_LIBRARY.map((comp, ci) => {
              const isRowSelected = selected === comp.id;
              return (
                <tr
                  key={comp.id}
                  data-ocid={`pharma.interaction_map.row.${ci + 1}`}
                  style={{
                    background: isRowSelected
                      ? `${P.primary}10`
                      : ci % 2 === 0
                        ? "transparent"
                        : `${P.surfaceMid}80`,
                  }}
                >
                  <td
                    className="font-mono text-[7px] px-2 py-1 whitespace-nowrap"
                    style={{
                      color: isRowSelected ? P.neon : P.textSecondary,
                      borderRight: `1px solid ${P.border}`,
                    }}
                  >
                    {comp.name}
                  </td>
                  {CHEMICALS.map((chem) => {
                    const hits = (comp.affects as readonly string[]).includes(
                      chem.id,
                    );
                    const highlighted = isRowSelected && hits;
                    return (
                      <td
                        key={chem.id}
                        className="text-center px-1 py-1"
                        style={{
                          background: highlighted
                            ? `${P.neon}30`
                            : hits
                              ? `${P.primary}15`
                              : "transparent",
                          border: highlighted
                            ? `1px solid ${P.neon}60`
                            : undefined,
                        }}
                      >
                        {hits && (
                          <span
                            className="font-mono text-[8px]"
                            style={{
                              color: highlighted ? P.neon : P.primary,
                            }}
                          >
                            ●
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BindingParamsPanel({ selected }: { selected: CompoundId | null }) {
  const comp = selected
    ? COMPOUND_LIBRARY.find((c) => c.id === selected)
    : null;
  if (!comp) {
    return (
      <div
        className="flex items-center justify-center h-24"
        data-ocid="pharma.binding.empty_state"
      >
        <span
          className="font-mono text-[9px] tracking-widest"
          style={{ color: P.dim }}
        >
          Select a compound to view binding parameters
        </span>
      </div>
    );
  }
  const params = [
    {
      label: "Kd — Binding Constant",
      val: formatKd(comp.Kd),
      note: "equilibrium dissociation",
    },
    {
      label: "EC₅₀ — Half-max Effective Conc.",
      val: formatKd(comp.EC50),
      note: "50% maximal response",
    },
    {
      label: "IC₅₀ — Inhibitory Concentration",
      val: formatKd(comp.IC50),
      note: "50% inhibition",
    },
    {
      label: "Hill Coefficient (nH)",
      val: comp.Hill.toFixed(2),
      note: "cooperativity index",
    },
  ];
  return (
    <div className="flex flex-col gap-2" data-ocid="pharma.binding.panel">
      <div
        className="font-mono text-[7px] uppercase tracking-widest mb-1"
        style={{ color: P.textSecondary }}
      >
        {comp.name} · {comp.target} · {comp.mechanism}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {params.map((p) => (
          <div
            key={p.label}
            className="border p-2"
            style={{
              borderColor: `${P.primary}30`,
              background: `${P.primary}06`,
            }}
          >
            <div
              className="font-mono text-[7px] uppercase tracking-wide mb-0.5"
              style={{ color: P.textSecondary }}
            >
              {p.label}
            </div>
            <div
              className="font-mono text-[14px] font-bold leading-none"
              style={{ color: P.neon }}
            >
              {p.val}
            </div>
            <div
              className="font-mono text-[6px] mt-0.5"
              style={{ color: P.dim }}
            >
              {p.note}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1 pt-1">
        <span
          className="font-mono text-[6px] uppercase tracking-widest"
          style={{ color: P.dim }}
        >
          Primary regions:
        </span>
        {comp.regions.map((r) => (
          <span
            key={r}
            className="font-mono text-[6px] px-1.5 py-0.5 border"
            style={{
              color: P.accent,
              borderColor: `${P.accent}35`,
              background: `${P.accent}08`,
            }}
          >
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function PharmaNeuroPanel({ neural }: { neural: Neural }) {
  const [selectedCompound, setSelectedCompound] = useState<CompoundId | null>(
    null,
  );
  const [innerTab, setInnerTab] = useState<
    "neuro" | "compounds" | "map" | "binding"
  >("neuro");

  const INNER_TABS = [
    { id: "neuro", label: "NEUROCHEM 24" },
    { id: "compounds", label: "COMPOUND LIB" },
    { id: "map", label: "INTERACTION MAP" },
    { id: "binding", label: "BINDING PARAMS" },
  ] as const;

  const liveStats = useMemo(() => {
    const levels = CHEMICALS.map((c) => getLiveLevel(c, neural));
    const avg = levels.reduce((a, b) => a + b, 0) / levels.length;
    const high = levels.filter((l) => l > 0.75).length;
    const low = levels.filter((l) => l < 0.25).length;
    return { avg: (avg * 100).toFixed(1), high, low };
  }, [neural]);

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "oklch(0.06 0.012 245)" }}
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div
        className="shrink-0 px-4 py-2 border-b flex items-center justify-between"
        style={{
          borderColor: P.border,
          background: "oklch(0.08 0.015 245)",
        }}
      >
        <div>
          <div
            className="font-mono text-[8px] tracking-[0.25em] uppercase"
            style={{ color: P.textSecondary }}
          >
            INQUISITOR PHARM · NEUROPHARMACOLOGY LAB
          </div>
          <div
            className="font-mono text-[11px] font-bold tracking-[0.12em]"
            style={{
              color: P.neon,
              textShadow: `0 0 12px ${P.glow}`,
            }}
          >
            24-NEUROCHEMICAL SOVEREIGN SUBSTRATE
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          {[
            { label: "AVG LEVEL", value: `${liveStats.avg}%` },
            {
              label: "HIGH (&gt;75%)",
              value: String(liveStats.high),
              color: "oklch(0.72 0.22 55)",
            },
            {
              label: "LOW (&lt;25%)",
              value: String(liveStats.low),
              color: "oklch(0.68 0.18 290)",
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-right">
              <div
                className="font-mono text-[6px] tracking-widest uppercase"
                style={{ color: P.dim }}
                // biome-ignore lint/security/noDangerouslySetInnerHtml: static label
                dangerouslySetInnerHTML={{ __html: label }}
              />
              <div
                className="font-mono text-[12px] font-bold leading-none"
                style={{ color: color ?? P.neon }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Inner tab bar ───────────────────────────────────────────── */}
      <div
        className="shrink-0 flex border-b"
        style={{ borderColor: P.border, background: "oklch(0.075 0.014 245)" }}
      >
        {INNER_TABS.map(({ id, label }) => {
          const active = innerTab === id;
          return (
            <button
              key={id}
              type="button"
              data-ocid={`pharma.neuro_panel.${id}.tab`}
              onClick={() => setInnerTab(id)}
              className="px-3 py-2 font-mono text-[8px] tracking-[0.12em] uppercase transition-all whitespace-nowrap shrink-0"
              style={{
                color: active ? P.neon : P.dim,
                background: active ? `${P.primary}12` : "transparent",
                borderBottom: active
                  ? `2px solid ${P.neon}`
                  : "2px solid transparent",
                boxShadow: active ? `inset 0 0 8px ${P.primary}18` : "none",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4">
        {innerTab === "neuro" && <NeurochemPanel neural={neural} />}

        {innerTab === "compounds" && (
          <div>
            <div
              className="font-mono text-[8px] tracking-[0.2em] uppercase mb-3"
              style={{ color: P.textSecondary }}
            >
              {COMPOUND_LIBRARY.length} COMPOUNDS · SELECT TO ANALYZE
            </div>
            <CompoundLibraryPanel
              selected={selectedCompound}
              onSelect={(id) => {
                setSelectedCompound(id);
                setInnerTab("binding");
              }}
            />
          </div>
        )}

        {innerTab === "map" && (
          <div>
            <div
              className="font-mono text-[8px] tracking-[0.2em] uppercase mb-3"
              style={{ color: P.textSecondary }}
            >
              DRUG ↔ NEUROCHEMICAL INTERACTION MAP · HIGHLIGHTED = SELECTED
              COMPOUND
            </div>
            <div className="mb-2 flex gap-2">
              {selectedCompound ? (
                <span
                  className="font-mono text-[8px] px-2 py-0.5 border"
                  style={{
                    color: P.neon,
                    borderColor: `${P.neon}50`,
                    background: `${P.neon}0a`,
                  }}
                >
                  SELECTED:{" "}
                  {
                    COMPOUND_LIBRARY.find((c) => c.id === selectedCompound)
                      ?.name
                  }
                </span>
              ) : (
                <span className="font-mono text-[7px]" style={{ color: P.dim }}>
                  Select a compound from the library to highlight its targets
                </span>
              )}
            </div>
            <InteractionMapPanel selected={selectedCompound} />
          </div>
        )}

        {innerTab === "binding" && (
          <div>
            <div
              className="font-mono text-[8px] tracking-[0.2em] uppercase mb-3"
              style={{ color: P.textSecondary }}
            >
              RECEPTOR BINDING PARAMETERS · Kd / EC₅₀ / IC₅₀ / Hill
            </div>
            {!selectedCompound && (
              <div
                className="font-mono text-[8px] mb-3"
                style={{ color: P.dim }}
              >
                Choose a compound from the library first:
              </div>
            )}
            {!selectedCompound && (
              <CompoundLibraryPanel
                selected={null}
                onSelect={(id) => setSelectedCompound(id)}
              />
            )}
            {selectedCompound && (
              <>
                <button
                  type="button"
                  data-ocid="pharma.binding.back_button"
                  onClick={() => setSelectedCompound(null)}
                  className="mb-3 font-mono text-[7px] px-2 py-1 border transition-all"
                  style={{
                    color: P.textSecondary,
                    borderColor: P.border,
                    background: P.surfaceMid,
                  }}
                >
                  ← CHANGE COMPOUND
                </button>
                <BindingParamsPanel selected={selectedCompound} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
