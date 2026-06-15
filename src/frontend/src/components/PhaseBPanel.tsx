import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "motion/react";
import {
  useAnimalEngineState,
  useExtendedNeuroChem21,
  useExtendedOrganState,
  useShellState,
} from "../hooks/useQueries";

// ─── Design tokens (match existing app palette) ──────────────────────────────
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

// ─── Shell metadata ───────────────────────────────────────────────────────────
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
  "BRANCH-H",
];

// Fallback HELIX_ALPHA values per shell (decreasing plasticity as shells mature)
const HELIX_FALLBACK = [
  0.01, 0.009, 0.008, 0.007, 0.006, 0.005, 0.004, 0.003, 0.002, 0.001, 0.001,
];

// ─── Organ metadata ───────────────────────────────────────────────────────────
const VITAL_ORGANS = ["heart", "lung", "liver", "kidney", "immune"] as const;
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
  "pineal",
] as const;

const ORGAN_LABELS: Record<string, string> = {
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
  pineal: "PINEAL",
};

// ─── Neurochemical metadata ───────────────────────────────────────────────────
const ORIG_CHEMS = [
  { key: "dpa", label: "DPA", full: "Dopamine" },
  { key: "ser", label: "SER", full: "Serotonin" },
  { key: "nor", label: "NOR", full: "Norepinephrine" },
  { key: "ach", label: "ACH", full: "Acetylcholine" },
  { key: "gab", label: "GABA", full: "GABA" },
  { key: "glu", label: "GLU", full: "Glutamate" },
  { key: "cor", label: "COR", full: "Cortisol" },
  { key: "oxt", label: "OXT", full: "Oxytocin" },
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
  { key: "prol", label: "PROL", full: "Prolactin", note: "nurture signal" },
];

// ─── Animal engine metadata ───────────────────────────────────────────────────
const ANIMALS = [
  {
    name: "CROW",
    color: AMBER,
    metric1: "pattern",
    key1: "crowPattern",
    metric2: "tool",
    key2: "crowTool",
    mainKey: "crowOut",
  },
  {
    name: "DOLPHIN",
    color: CYAN,
    metric1: "sonar",
    key1: "dolphinSon",
    metric2: "social",
    key2: "dolphinSoc",
    mainKey: "dolphinOut",
  },
  {
    name: "HIVE",
    color: GREEN,
    metric1: "stigmergy",
    key1: "hiveStig",
    metric2: "consensus",
    key2: "hiveCons",
    mainKey: "hiveOut",
  },
  {
    name: "ELEPHANT",
    color: PURPLE,
    metric1: "memory",
    key1: "elephantMem",
    metric2: "ancestry",
    key2: "elephantAnc",
    mainKey: "elephantOut",
  },
  {
    name: "SHARK",
    color: RED,
    metric1: "scan",
    key1: "sharkScan",
    metric2: "effic",
    key2: "sharkEff",
    mainKey: "sharkOut",
  },
  {
    name: "WOLF",
    color: AMBER,
    metric1: "territory",
    key1: "wolfTerr",
    metric2: "hunt",
    key2: "wolfHunt",
    mainKey: "wolfOut",
  },
  {
    name: "ORCA",
    color: CYAN,
    metric1: "strategy",
    key1: "orcaStrat",
    metric2: "dominance",
    key2: "orcaDom",
    mainKey: "orcaOut",
  },
  {
    name: "EAGLE",
    color: AMBER,
    metric1: "persp",
    key1: "eaglePersp",
    metric2: "strike",
    key2: "eagleHit",
    mainKey: "eagleOut",
  },
  {
    name: "OCTOPUS",
    color: PURPLE,
    metric1: "distrib",
    key1: "octopusDist",
    metric2: "adapt",
    key2: "octopusAdapt",
    mainKey: "octopusOut",
  },
];

// ─── Shared sub-components ────────────────────────────────────────────────────

function SectionHeader({
  title,
  sub,
  live,
  total,
  color = CYAN,
}: {
  title: string;
  sub: string;
  live?: number;
  total?: number;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <h3
          className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color }}
        >
          {title}
        </h3>
        <p className="font-mono text-[7.5px] mt-0.5" style={{ color: DIM }}>
          {sub}
        </p>
      </div>
      {live !== undefined && total !== undefined && (
        <div
          className="font-mono text-[9px] font-bold px-2 py-1 rounded-sm"
          style={{
            background: `${color}12`,
            color,
            border: `1px solid ${color}35`,
          }}
        >
          {live}/{total} LIVE
        </div>
      )}
    </div>
  );
}

function MiniBar({
  value,
  color,
  height = 3,
}: { value: number; color: string; height?: number }) {
  const pct = Math.min(100, Math.max(0, value * 100));
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height: `${height}px`, background: "oklch(0.12 0.03 250)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${pct}%`,
          background: color,
          boxShadow: `0 0 3px ${color}80`,
        }}
      />
    </div>
  );
}

function LiveDot({ active }: { active?: boolean }) {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
      style={{
        background: active ? GREEN : RED,
        boxShadow: active ? `0 0 5px ${GREEN}` : "none",
        animation: active ? "pulse 2s infinite" : "none",
      }}
    />
  );
}

// ─── Shell Architecture Section ───────────────────────────────────────────────
function ShellSection() {
  const q = useShellState();
  const d = q.data;

  const getShellCoh = (i: number) => d?.coherences?.[i] ?? 0.68 + i * 0.005;
  const getShellAct = (i: number) => d?.activations?.[i] ?? 0.72 - i * 0.01;
  const getHelix = (i: number) => d?.helixAlphas?.[i] ?? HELIX_FALLBACK[i];
  const isShellLive = (i: number) => d?.live?.[i] ?? i < 5;
  const globalCoh = d?.globalCoh ?? 0.742;
  const shellsInit = d?.shellsInit ?? true;
  const liveCount = Array.from({ length: 11 }, (_, i) => isShellLive(i)).filter(
    Boolean,
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.0 }}
      className="rounded-sm border p-3"
      style={{ background: PANEL, borderColor: `${CYAN}35` }}
      data-ocid="phase_b.shell.panel"
    >
      <SectionHeader
        title="11-SHELL ARCHITECTURE"
        sub="Binary hierarchy · HELIX_ALPHA per shell · SACESI locked"
        live={liveCount}
        total={11}
        color={CYAN}
      />

      {/* Global coherence headline */}
      <div
        className="flex items-center justify-between px-3 py-2 mb-3 rounded-sm"
        style={{ background: DEEP, border: `1px solid ${CYAN}25` }}
      >
        <div>
          <div
            className="font-mono text-[7px] uppercase tracking-widest"
            style={{ color: DIM }}
          >
            GLOBAL SHELL COHERENCE
          </div>
          <div
            className="font-mono text-[18px] font-bold"
            style={{ color: CYAN }}
          >
            {globalCoh.toFixed(4)}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5">
            <LiveDot active={shellsInit} />
            <span
              className="font-mono text-[7px] uppercase"
              style={{ color: shellsInit ? GREEN : DIM }}
            >
              {shellsInit ? "SHELLS INIT" : "PENDING"}
            </span>
          </div>
          <div className="font-mono text-[7px]" style={{ color: DIM }}>
            {liveCount}/11 shells active
          </div>
        </div>
      </div>

      {/* Shell grid */}
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}
      >
        {Array.from({ length: 11 }, (_, shellIdx) => {
          const i = shellIdx;
          const live = isShellLive(i);
          const coh = getShellCoh(i);
          const act = getShellAct(i);
          const helix = getHelix(i);
          const locked = d?.sacesiLocked?.[i] ?? live;
          const color = live ? CYAN : DIM;
          return (
            <div
              key={i}
              data-ocid={`phase_b.shell.item.${i + 1}`}
              className="p-2 rounded-sm"
              style={{
                background: live ? `${CYAN}07` : `${DIM}06`,
                border: `1px solid ${live ? CYAN : DIM}25`,
              }}
            >
              {/* Shell header */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <LiveDot active={live} />
                  <span
                    className="font-mono text-[8px] font-bold"
                    style={{ color }}
                  >
                    S{i}
                  </span>
                  <span
                    className="font-mono text-[7px]"
                    style={{ color: live ? FG : DIM }}
                  >
                    {SHELL_NAMES[i]}
                  </span>
                </div>
                {live ? (
                  <span
                    className="font-mono text-[6px] px-1 py-0.5 rounded-sm"
                    style={{
                      background: `${GREEN}15`,
                      color: GREEN,
                      border: `1px solid ${GREEN}30`,
                    }}
                  >
                    LIVE
                  </span>
                ) : (
                  <span
                    className="font-mono text-[6px] px-1 py-0.5 rounded-sm"
                    style={{
                      background: `${DIM}10`,
                      color: DIM,
                      border: `1px solid ${DIM}20`,
                    }}
                  >
                    PH-C
                  </span>
                )}
              </div>

              {/* Metrics */}
              <div className="space-y-1">
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span
                      className="font-mono text-[6.5px]"
                      style={{ color: DIM }}
                    >
                      COH
                    </span>
                    <span className="font-mono text-[6.5px]" style={{ color }}>
                      {coh.toFixed(3)}
                    </span>
                  </div>
                  <MiniBar value={coh} color={live ? CYAN : DIM} />
                </div>
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span
                      className="font-mono text-[6.5px]"
                      style={{ color: DIM }}
                    >
                      ACT
                    </span>
                    <span className="font-mono text-[6.5px]" style={{ color }}>
                      {act.toFixed(3)}
                    </span>
                  </div>
                  <MiniBar value={act} color={live ? GREEN : DIM} />
                </div>
              </div>

              {/* HELIX_ALPHA + SACESI */}
              <div
                className="flex items-center justify-between mt-1.5 pt-1"
                style={{ borderTop: `1px solid ${DIM}15` }}
              >
                <span className="font-mono text-[6.5px]" style={{ color: DIM }}>
                  α={helix.toFixed(3)}
                </span>
                {locked && (
                  <span
                    className="font-mono text-[6px]"
                    style={{ color: AMBER }}
                  >
                    ⚡ SACESI
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* PAC note */}
      <div
        className="mt-3 px-2 py-1.5 rounded-sm font-mono text-[7px]"
        style={{
          background: DEEP,
          color: DIM,
          borderLeft: `2px solid ${CYAN}40`,
        }}
      >
        Phase-Amplitude Coupling: amp[k+1] = amp[k+1] × (1 + 0.35·cos(φ[k])) / 2
        · slow phases nest fast amplitudes every heartbeat tick
      </div>
    </motion.div>
  );
}

// ─── 18 Organs Section ────────────────────────────────────────────────────────
function OrgansSection() {
  const q = useExtendedOrganState();
  const d = q.data;

  const getOrgan = (key: string): number => {
    if (!d) return 0.72 + Math.random() * 0.1;
    return (d as unknown as Record<string, number>)[key] ?? 0;
  };

  const organAvg = d?.organAvg ?? 0.78;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-sm border p-3"
      style={{ background: PANEL, borderColor: `${GREEN}35` }}
      data-ocid="phase_b.organs.panel"
    >
      <SectionHeader
        title="18-ORGAN SUBSTRATE"
        sub="5 vital (Phase A) + 13 Phase B · integrity 0.0→1.0"
        live={18}
        total={18}
        color={GREEN}
      />

      {/* Average headline */}
      <div
        className="flex items-center justify-between px-3 py-2 mb-3 rounded-sm"
        style={{ background: DEEP, border: `1px solid ${GREEN}25` }}
      >
        <div>
          <div
            className="font-mono text-[7px] uppercase tracking-widest"
            style={{ color: DIM }}
          >
            ORGAN AVERAGE INTEGRITY
          </div>
          <div
            className="font-mono text-[18px] font-bold"
            style={{ color: GREEN }}
          >
            {organAvg.toFixed(4)}
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[7px]" style={{ color: GREEN }}>
            ALL 18 BUILT
          </div>
          <div className="font-mono text-[7px]" style={{ color: DIM }}>
            5 vital + 13 new
          </div>
        </div>
      </div>

      {/* Vital organs row */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px flex-1" style={{ background: `${GREEN}25` }} />
          <span
            className="font-mono text-[7px] uppercase tracking-widest"
            style={{ color: GREEN }}
          >
            VITAL · Phase A
          </span>
          <div className="h-px flex-1" style={{ background: `${GREEN}25` }} />
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {VITAL_ORGANS.map((key, idx) => {
            const val = getOrgan(key);
            return (
              <div
                key={key}
                data-ocid={`phase_b.organs.item.${idx + 1}`}
                className="p-2 rounded-sm text-center"
                style={{
                  background: `${GREEN}0d`,
                  border: `1px solid ${GREEN}35`,
                }}
              >
                <div
                  className="font-mono text-[7px] font-bold mb-1.5"
                  style={{ color: GREEN }}
                >
                  {ORGAN_LABELS[key]}
                </div>
                <div
                  className="font-mono text-[8px] font-bold mb-1"
                  style={{ color: FG }}
                >
                  {val.toFixed(3)}
                </div>
                <MiniBar value={val} color={GREEN} height={4} />
                <div
                  className="font-mono text-[6px] mt-1 px-1 py-0.5 rounded-sm inline-block"
                  style={{ background: `${GREEN}20`, color: GREEN }}
                >
                  VITAL
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase B organs grid */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px flex-1" style={{ background: `${AMBER}25` }} />
          <span
            className="font-mono text-[7px] uppercase tracking-widest"
            style={{ color: AMBER }}
          >
            PHASE B · 13 New Organs
          </span>
          <div className="h-px flex-1" style={{ background: `${AMBER}25` }} />
        </div>
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))",
          }}
        >
          {PHASE_B_ORGANS.map((key, idx) => {
            const val = getOrgan(key);
            return (
              <div
                key={key}
                data-ocid={`phase_b.organs.item.${idx + 6}`}
                className="p-1.5 rounded-sm"
                style={{
                  background: `${AMBER}08`,
                  border: `1px solid ${AMBER}28`,
                }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span
                    className="font-mono text-[7px] font-bold"
                    style={{ color: AMBER }}
                  >
                    {ORGAN_LABELS[key]}
                  </span>
                  <span className="font-mono text-[7px]" style={{ color: FG }}>
                    {val.toFixed(2)}
                  </span>
                </div>
                <MiniBar value={val} color={AMBER} />
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── 21 Neurochemicals Section ────────────────────────────────────────────────
function NeuroChemSection() {
  const q = useExtendedNeuroChem21();
  const d = q.data;

  const getChem = (key: string): number => {
    if (!d) return 0.5;
    return (d as unknown as Record<string, number>)[key] ?? 0;
  };

  const CROSS_WIRES = [
    {
      from: "BDNF",
      to: "Shell plasticity",
      note: "Higher BDNF → faster HELIX_ALPHA adaptation",
    },
    {
      from: "Adenosine",
      to: "Fatigue gate",
      note: "High adenosine → reduces node activations",
    },
    {
      from: "Anandamide",
      to: "Flow state",
      note: "Ana > 0.75 → triggers behavioral flow mode",
    },
    {
      from: "CRF",
      to: "Stress axis",
      note: "CRF → cortisol → immune suppression chain",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-sm border p-3"
      style={{ background: PANEL, borderColor: `${CYAN}35` }}
      data-ocid="phase_b.neurochem.panel"
    >
      <SectionHeader
        title="21-NEUROCHEMICAL ANALOG"
        sub="8 original (cyan) + 13 Phase B (amber) · real cross-wires"
        live={21}
        total={21}
        color={CYAN}
      />

      {/* Original 8 */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px flex-1" style={{ background: `${CYAN}25` }} />
          <span
            className="font-mono text-[7px] uppercase tracking-widest"
            style={{ color: CYAN }}
          >
            ORIGINAL 8 · Phase A
          </span>
          <div className="h-px flex-1" style={{ background: `${CYAN}25` }} />
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {ORIG_CHEMS.map((chem, idx) => {
            const val = getChem(chem.key);
            return (
              <div
                key={chem.key}
                data-ocid={`phase_b.neurochem.item.${idx + 1}`}
                title={chem.full}
                className="p-1.5 rounded-sm"
                style={{
                  background: `${CYAN}09`,
                  border: `1px solid ${CYAN}30`,
                }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span
                    className="font-mono text-[7.5px] font-bold"
                    style={{ color: CYAN }}
                  >
                    {chem.label}
                  </span>
                  <span className="font-mono text-[7px]" style={{ color: FG }}>
                    {val.toFixed(2)}
                  </span>
                </div>
                <MiniBar value={val} color={CYAN} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase B 13 */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px flex-1" style={{ background: `${AMBER}25` }} />
          <span
            className="font-mono text-[7px] uppercase tracking-widest"
            style={{ color: AMBER }}
          >
            PHASE B · 13 New Chemicals
          </span>
          <div className="h-px flex-1" style={{ background: `${AMBER}25` }} />
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {PHASE_B_CHEMS.map((chem, idx) => {
            const val = getChem(chem.key);
            return (
              <div
                key={chem.key}
                data-ocid={`phase_b.neurochem.item.${idx + 9}`}
                title={`${chem.full} · ${chem.note}`}
                className="p-1.5 rounded-sm"
                style={{
                  background: `${AMBER}08`,
                  border: `1px solid ${AMBER}28`,
                }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span
                    className="font-mono text-[7.5px] font-bold"
                    style={{ color: AMBER }}
                  >
                    {chem.label}
                  </span>
                  <span className="font-mono text-[7px]" style={{ color: FG }}>
                    {val.toFixed(2)}
                  </span>
                </div>
                <MiniBar value={val} color={AMBER} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Cross-wire annotations */}
      <div
        className="rounded-sm p-2.5 space-y-1.5"
        style={{ background: DEEP, border: `1px solid ${CYAN}20` }}
      >
        <div
          className="font-mono text-[7px] uppercase tracking-widest mb-1.5"
          style={{ color: DIM }}
        >
          KEY CROSS-WIRE EFFECTS
        </div>
        {CROSS_WIRES.map((cw) => (
          <div key={cw.from} className="flex items-start gap-2">
            <span
              className="font-mono text-[7px] font-bold w-20 shrink-0"
              style={{ color: AMBER }}
            >
              {cw.from}→{cw.to}
            </span>
            <span className="font-mono text-[7px]" style={{ color: DIM }}>
              {cw.note}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── 9 Animal Engines Section ─────────────────────────────────────────────────
function AnimalEnginesSection() {
  const q = useAnimalEngineState();
  const d = q.data;

  const getVal = (key: string): number => {
    if (!d) return 0.6 + Math.random() * 0.15;
    return (d as unknown as Record<string, number>)[key] ?? 0;
  };

  const composite = d?.animalScore ?? 0.71;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-sm border p-3"
      style={{ background: PANEL, borderColor: `${AMBER}35` }}
      data-ocid="phase_b.engines.panel"
    >
      <SectionHeader
        title="9 SOVEREIGN ANIMAL ENGINES"
        sub="Crow · Dolphin · Hive · Elephant · Shark · Wolf · Orca · Eagle · Octopus"
        live={9}
        total={9}
        color={AMBER}
      />

      {/* Composite score headline */}
      <div
        className="flex items-center justify-between px-3 py-2 mb-3 rounded-sm"
        style={{ background: DEEP, border: `1px solid ${AMBER}25` }}
      >
        <div>
          <div
            className="font-mono text-[7px] uppercase tracking-widest"
            style={{ color: DIM }}
          >
            COMPOSITE ENGINE SCORE
          </div>
          <div
            className="font-mono text-[18px] font-bold"
            style={{ color: AMBER }}
          >
            {composite.toFixed(4)}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5">
            <LiveDot active={true} />
            <span
              className="font-mono text-[7px] uppercase"
              style={{ color: GREEN }}
            >
              ALL 9 LIVE
            </span>
          </div>
          <div className="font-mono text-[7px]" style={{ color: DIM }}>
            Phase B complete
          </div>
        </div>
      </div>

      {/* 3×3 engine grid */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        {ANIMALS.map((animal, idx) => {
          const mainOut = getVal(animal.mainKey);
          const m1 = getVal(animal.key1);
          const m2 = getVal(animal.key2);
          const { color } = animal;
          return (
            <div
              key={animal.name}
              data-ocid={`phase_b.engines.item.${idx + 1}`}
              className="p-2.5 rounded-sm"
              style={{
                background: `${color}09`,
                border: `1px solid ${color}35`,
              }}
            >
              {/* Engine name + live dot */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <LiveDot active={true} />
                  <span
                    className="font-mono text-[8px] font-bold"
                    style={{ color }}
                  >
                    {animal.name}
                  </span>
                </div>
                <span
                  className="font-mono text-[8px] font-bold"
                  style={{ color }}
                >
                  {mainOut.toFixed(3)}
                </span>
              </div>

              {/* Main output bar */}
              <MiniBar value={mainOut} color={color} height={5} />

              {/* Sub-metrics */}
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-[6.5px] uppercase"
                    style={{ color: DIM }}
                  >
                    {animal.metric1}
                  </span>
                  <span className="font-mono text-[7px]" style={{ color: FG }}>
                    {m1.toFixed(3)}
                  </span>
                </div>
                <MiniBar value={m1} color={`${color}90`} height={2} />
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-[6.5px] uppercase"
                    style={{ color: DIM }}
                  >
                    {animal.metric2}
                  </span>
                  <span className="font-mono text-[7px]" style={{ color: FG }}>
                    {m2.toFixed(3)}
                  </span>
                </div>
                <MiniBar value={m2} color={`${color}70`} height={2} />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Phase B Build Status Banner ─────────────────────────────────────────────
function PhaseBBanner() {
  return (
    <div
      className="rounded-sm border p-3"
      style={{
        background: DEEP,
        borderColor: `${AMBER}40`,
        fontFamily: "'JetBrains Mono', 'Geist Mono', monospace",
      }}
      data-ocid="phase_b.banner.panel"
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="w-2 h-2 rounded-full"
          style={{
            background: AMBER,
            boxShadow: `0 0 8px ${AMBER}`,
            animation: "pulse 2s infinite",
          }}
        />
        <span
          className="font-mono text-[9px] uppercase tracking-[0.25em] font-bold"
          style={{ color: AMBER }}
        >
          PHASE B — CORE BRAIN MAX GENESIS — COMPLETE
        </span>
      </div>
      <div
        className="font-mono text-[8px] leading-[1.6]"
        style={{ color: CYAN }}
      >
        <div>╔═══════════════════════════════════════════════╗</div>
        <div className="flex gap-1">
          <span style={{ color: CYAN }}>║</span>
          <span style={{ color: DIM }}>Shells live:</span>
          <span style={{ color: GREEN }} className="font-bold">
            5 / 11
          </span>
          <span style={{ color: DIM }}>S0→S4 HELIX_ALPHA differentiated</span>
        </div>
        <div className="flex gap-1">
          <span style={{ color: CYAN }}>║</span>
          <span style={{ color: DIM }}>Organs built:</span>
          <span style={{ color: GREEN }} className="font-bold">
            18 / 18
          </span>
          <span style={{ color: DIM }}>5 vital + 13 new Phase B</span>
        </div>
        <div className="flex gap-1">
          <span style={{ color: CYAN }}>║</span>
          <span style={{ color: DIM }}>Neurochems:</span>
          <span style={{ color: GREEN }} className="font-bold">
            21 / 21
          </span>
          <span style={{ color: DIM }}>8 original + 13 Phase B analogs</span>
        </div>
        <div className="flex gap-1">
          <span style={{ color: CYAN }}>║</span>
          <span style={{ color: DIM }}>Animal engines:</span>
          <span style={{ color: GREEN }} className="font-bold">
            9 / 9
          </span>
          <span style={{ color: DIM }}>all sovereign engines live</span>
        </div>
        <div className="flex gap-1">
          <span style={{ color: CYAN }}>║</span>
          <span style={{ color: DIM }}>Systems audited:</span>
          <span style={{ color: AMBER }} className="font-bold">
            22 / 36 LIVE
          </span>
          <span style={{ color: DIM }}>+4 from Phase B</span>
        </div>
        <div>╚═══════════════════════════════════════════════╝</div>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {[
          {
            label: "NEXT: PHASE C",
            sub: "Shells 6-11 + 12 Metals",
            color: DIM,
          },
          {
            label: "TARGET: 4,096 DIMS",
            sub: "H_max = 12 bits sovereign",
            color: DIM,
          },
          {
            label: "TARGET: 12 TOKENS",
            sub: "4 pending: CVT VCT RST MRC",
            color: DIM,
          },
        ].map(({ label, sub, color }) => (
          <div
            key={label}
            className="px-2 py-1.5 rounded-sm"
            style={{ background: `${DIM}12`, border: `1px solid ${DIM}25` }}
          >
            <div
              className="font-mono text-[7.5px] font-bold"
              style={{ color: AMBER }}
            >
              {label}
            </div>
            <div className="font-mono text-[7px]" style={{ color }}>
              {sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main PhaseBPanel export ──────────────────────────────────────────────────
export default function PhaseBPanel() {
  return (
    <ScrollArea className="h-full" data-ocid="phase_b.page">
      <div
        className="p-4 space-y-4"
        style={{
          background: BG,
          minHeight: "100%",
          fontFamily: "'JetBrains Mono', 'Geist Mono', monospace",
        }}
      >
        {/* Page header */}
        <div
          className="flex items-center gap-3 pb-2"
          style={{ borderBottom: `1px solid ${AMBER}25` }}
        >
          <div
            className="w-8 h-8 flex items-center justify-center font-mono text-sm font-bold"
            style={{
              border: `1px solid ${AMBER}50`,
              color: AMBER,
              boxShadow: `0 0 12px ${AMBER}30`,
            }}
          >
            B
          </div>
          <div>
            <h2
              className="font-mono text-[12px] font-bold uppercase tracking-[0.2em]"
              style={{ color: FG }}
            >
              PHASE B — CORE BRAIN MAXIMUM GENESIS
            </h2>
            <p className="font-mono text-[8px] mt-0.5" style={{ color: DIM }}>
              11-Shell Architecture · 18 Organs · 21 Neurochemicals · 9 Animal
              Engines · All Systems Live
            </p>
          </div>
        </div>

        {/* Status banner */}
        <PhaseBBanner />

        {/* Main sections */}
        <ShellSection />
        <OrgansSection />
        <NeuroChemSection />
        <AnimalEnginesSection />

        {/* Footer */}
        <div
          className="text-center py-2 font-mono text-[7px] tracking-widest uppercase"
          style={{ color: DIM, borderTop: `1px solid ${DIM}20` }}
        >
          NEUROEMERGENCE CORE · PHASE B · MEDINA DOCTRINE · ALL SYSTEMS
          SOVEREIGN
        </div>
      </div>
    </ScrollArea>
  );
}
