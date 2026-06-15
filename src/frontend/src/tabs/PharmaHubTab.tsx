import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { jsPDF } from "jspdf";
import { useEffect, useMemo, useRef, useState } from "react";
import { PharmaAgentPanel } from "../components/PharmaAgentPanel";
import { useLiveOrganismPulse } from "../hooks/useLiveOrganismPulse";
import type {
  NeuralSimulationControls,
  NeuralSimulationState,
} from "../hooks/useNeuralSimulation";

type Neural = NeuralSimulationState & NeuralSimulationControls;

type SubTab =
  | "dashboard"
  | "inquisitor"
  | "correlations"
  | "archive"
  | "compare"
  | "pipeline";

const SUB_TABS: { id: SubTab; label: string }[] = [
  { id: "dashboard", label: "NEURAL DASHBOARD" },
  { id: "inquisitor", label: "INQUISITOR FEED" },
  { id: "correlations", label: "CONNECTOME" },
  { id: "archive", label: "EXPERIMENT ARCHIVE" },
  { id: "compare", label: "COMPOUND COMPARE" },
  { id: "pipeline", label: "RESEARCH PIPELINE" },
];

// ── Hub design tokens: indigo/violet — distinct from Pharma Lab amber/teal ──
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
  textDim: "oklch(0.52 0.06 265)",
};

const PHI = 1.618033988749895;

// ── 24 neurochemicals ────────────────────────────────────────────────────────
const CHEMS_24: { abbr: string; name: string }[] = [
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
  { abbr: "DYN", name: "Dynorphin" },
];

// ── 16 connectome regions ────────────────────────────────────────────────────
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
  "CCAL",
];
const REGION_FULL: Record<string, string> = {
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
  CCAL: "Corpus Callosum",
};

// ── Deterministic helpers ────────────────────────────────────────────────────
function seededValue(seed: number, index: number): number {
  const x = Math.sin(seed * PHI + index * 2.399) * 10000;
  return x - Math.floor(x);
}
function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ── Seeded hypothesis entries ────────────────────────────────────────────────
interface HypEntry {
  ts: string;
  text: string;
  confidence: number;
  tags: string[];
}

const SEED_HYPS: HypEntry[] = [
  {
    ts: "T4882",
    text: "D2 partial agonism at NAc autoreceptor reduces dopaminergic overdrive by 23% — fronto-striatal stability index elevated",
    confidence: 91,
    tags: ["DPA", "NAc", "D2"],
  },
  {
    ts: "T4874",
    text: "5-HT1A desensitization at raphe-cortical loop accelerates 5-HT steady-state onset — oscillatory coherence +0.18",
    confidence: 88,
    tags: ["SER", "5-HT1A", "raphe"],
  },
  {
    ts: "T4861",
    text: "GABA-A alpha-5 NAM at hippocampal interneurons produces selective LTP disinhibition in CA1 — plasticity STDP +0.38",
    confidence: 85,
    tags: ["GAB", "HIPP", "LTP"],
  },
  {
    ts: "T4849",
    text: "CRH-R1 antagonism at PVN attenuates HPA axis surge — cortisol proxy reduced 31% over 8 heartbeat cycles",
    confidence: 82,
    tags: ["CRH", "COR", "HPA"],
  },
  {
    ts: "T4837",
    text: "Oxytocin OXTR PAM potentiates NAc dopamine release — social trust circuit coherence elevated to 0.74",
    confidence: 79,
    tags: ["OXT", "DPA", "NAc"],
  },
  {
    ts: "T4820",
    text: "NPY Y1 antagonism at hypothalamic feeding circuit recalibrates metabolic drive — hunger proxy -18%",
    confidence: 76,
    tags: ["NPY", "HYP", "hunger"],
  },
  {
    ts: "T4808",
    text: "Adenosine A2A inverse agonist at striatal synapses partially reverses saturation-induced LTD — BSGL activity +0.22",
    confidence: 73,
    tags: ["ADO", "BSGL", "A2A"],
  },
  {
    ts: "T4795",
    text: "BDNF-TrkB signaling at CA3→CA1 synapse promotes STDP potentiation — memory consolidation window extended 2.4×",
    confidence: 70,
    tags: ["BDNF", "HIPP", "TrkB"],
  },
  {
    ts: "T4780",
    text: "Histamine H1 antagonism suppresses thalamic arousal relay — MEL proxy elevated 15%, sleep pressure rising",
    confidence: 67,
    tags: ["HIS", "THAL", "MEL"],
  },
  {
    ts: "T4762",
    text: "Dynorphin κ-OR activation suppresses NAc dopamine — motivational salience decreased, DPA proxy -0.41",
    confidence: 64,
    tags: ["DYN", "DPA", "KOR"],
  },
];

// ── Compound compare list ────────────────────────────────────────────────────
const COMPARE_COMPOUNDS = [
  "Triaxion-47",
  "Nexopril-8",
  "Cortimaze",
  "Dopavance",
  "Serotomax",
  "GABAlex",
  "Glutatrace",
  "Noradrenex",
];
function compoundChemValue(compoundName: string, chemIndex: number): number {
  return Math.sin(hashCode(compoundName) * chemIndex * 0.1) * 50 + 50;
}

// ── Pipeline hypotheses (deterministic) ─────────────────────────────────────
const PIPELINE_ITEMS = [
  {
    title: "D2 autoreceptor threshold mapping",
    status: "RUNNING",
    priority: "HIGH",
    focus: "DPA",
  },
  {
    title: "5-HT2A SAM cortical stability protocol",
    status: "QUEUED",
    priority: "HIGH",
    focus: "SER",
  },
  {
    title: "GABA-A alpha-5 LTP disinhibition assay",
    status: "QUEUED",
    priority: "MED",
    focus: "GAB",
  },
  {
    title: "CRH-R1 antagonist HPA axis clamp",
    status: "COMPLETE",
    priority: "HIGH",
    focus: "CRH",
  },
  {
    title: "OXTR PAM social circuit potentiation",
    status: "QUEUED",
    priority: "MED",
    focus: "OXT",
  },
  {
    title: "NPY Y1 hypothalamic recalibration",
    status: "QUEUED",
    priority: "LOW",
    focus: "NPY",
  },
  {
    title: "Adenosine A2A striatal anti-LTD sweep",
    status: "QUEUED",
    priority: "MED",
    focus: "ADO",
  },
  {
    title: "TrkB-BDNF plasticity potentiation run",
    status: "QUEUED",
    priority: "LOW",
    focus: "BDNF",
  },
];
const PUB_LOG = [
  {
    compound: "Triaxion-47",
    expType: "Controlled Session",
    date: "2026-06-08",
    doi: "10.5281/zenodo.11234567",
  },
  {
    compound: "SSRI Study",
    expType: "Dose-Response Curve",
    date: "2026-06-05",
    doi: "10.5281/zenodo.11198432",
  },
  {
    compound: "Cortimaze",
    expType: "Combination Protocol",
    date: "2026-06-02",
    doi: "",
  },
  {
    compound: "GABAlex",
    expType: "Receptor Mapping",
    date: "2026-05-29",
    doi: "10.5281/zenodo.11154321",
  },
];

// ── Shared UI primitives ─────────────────────────────────────────────────────
function HubBadge({
  color,
  children,
}: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="font-mono text-[7px] tracking-[0.12em] uppercase px-2 py-0.5 shrink-0"
      style={{
        color,
        border: `1px solid ${color}55`,
        background: `${color}12`,
      }}
    >
      {children}
    </span>
  );
}
function SectionHeader({ label }: { label: string }) {
  return (
    <div
      className="font-mono text-[8px] tracking-[0.22em] uppercase mb-3"
      style={{ color: H.dim }}
    >
      ▸ {label}
    </div>
  );
}
function EmptyState({
  icon,
  title,
  sub,
}: { icon: string; title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="text-4xl opacity-30">{icon}</div>
      <div
        className="font-mono text-[11px] tracking-[0.15em] uppercase"
        style={{ color: H.accent }}
      >
        {title}
      </div>
      <div
        className="font-mono text-[9px] max-w-xs text-center"
        style={{ color: H.dim }}
      >
        {sub}
      </div>
    </div>
  );
}

// ── SUB-TAB 1: NEURAL DASHBOARD ─────────────────────────────────────────────
function NeuralDashboard({ neural }: { neural: Neural }) {
  const pulse = useLiveOrganismPulse();
  const { actor, isFetching } = useActor(createActor);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 873);
    return () => clearInterval(id);
  }, []);

  const nt = useMemo(
    () =>
      (neural?.neurotransmitters ?? {}) as unknown as Record<string, number>,
    [neural],
  );

  const { data: ncData } = useQuery({
    queryKey: ["neuroChem24_hub"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await (
          actor as unknown as Record<string, (...args: unknown[]) => unknown>
        ).getExtendedNeuroChem21();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 873,
  });

  const chemValues = useMemo(() => {
    const nc = ncData as Record<string, number> | null;
    return {
      DPA: nt.dopamine ?? 0.45,
      SER: nt.serotonin ?? 0.38,
      NOR: nt.norepinephrine ?? 0.42,
      ACH: nt.acetylcholine ?? 0.35,
      GAB: nt.gaba ?? 0.55,
      GLU: nt.glutamate ?? 0.6,
      COR: (neural?.cortisolLevel as number) ?? 0.3,
      OXT: nc?.oxytocin ?? seededValue(7, tick % 12) * 0.6 + 0.2,
      MEL: nc?.melatonin ?? seededValue(9, tick % 12) * 0.5 + 0.15,
      BEND: nc?.betaEndorphin ?? seededValue(11, tick % 12) * 0.5 + 0.25,
      ANA: nc?.anandamide ?? seededValue(13, tick % 12) * 0.55 + 0.2,
      SUBP: nc?.substanceP ?? seededValue(17, tick % 12) * 0.4 + 0.2,
      NPY:
        (neural?.hungerDrive as number) ??
        seededValue(19, tick % 12) * 0.5 + 0.3,
      CRH: nc?.crh ?? seededValue(23, tick % 12) * 0.45 + 0.2,
      VIP: nc?.vip ?? seededValue(29, tick % 12) * 0.4 + 0.18,
      CCK: nc?.cck ?? seededValue(31, tick % 12) * 0.4 + 0.2,
      ADO: nc?.adenosine ?? seededValue(37, tick % 12) * 0.55 + 0.2,
      HIS: nc?.histamine ?? seededValue(41, tick % 12) * 0.45 + 0.15,
      NO: nc?.nitricOxide ?? seededValue(43, tick % 12) * 0.5 + 0.2,
      BDNF: nc?.bdnf ?? seededValue(47, tick % 12) * 0.5 + 0.3,
      IGF1: nc?.igf1 ?? seededValue(53, tick % 12) * 0.4 + 0.25,
      PRL: nc?.prolactin ?? seededValue(59, tick % 12) * 0.4 + 0.2,
      AVP: nc?.vasopressin ?? seededValue(61, tick % 12) * 0.45 + 0.2,
      DYN: nc?.dynorphin ?? seededValue(67, tick % 12) * 0.45 + 0.2,
    };
  }, [nt, ncData, neural, tick]);

  const chemWithMeta = CHEMS_24.map((c, i) => {
    const raw = (chemValues as Record<string, number>)[c.abbr] ?? 0.3;
    const pct = Math.min(100, Math.round(raw * 100));
    const isAnomaly = pct >= 85;
    const isElevated = pct >= 65 && pct < 85;
    const barColor = isAnomaly
      ? H.red
      : isElevated
        ? "oklch(0.78 0.22 65)"
        : H.green;
    const prev =
      seededValue(hashCode(c.abbr), (tick - 1 + 60) % 60) * 0.6 + 0.2;
    const trend = raw > prev + 0.02 ? "↑" : raw < prev - 0.02 ? "↓" : "→";
    const trendColor =
      trend === "↑"
        ? "oklch(0.78 0.22 65)"
        : trend === "↓"
          ? "oklch(0.72 0.22 200)"
          : H.dimmer;
    return { ...c, pct, isAnomaly, barColor, trend, trendColor, _i: i };
  });
  const anomalyCount = chemWithMeta.filter((c) => c.isAnomaly).length;
  const now = new Date().toLocaleTimeString();

  return (
    <div className="h-full overflow-auto" data-ocid="hub.dashboard.page">
      {/* Header strip */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 border-b"
        style={{ background: "oklch(0.055 0.02 265)", borderColor: H.border }}
      >
        <div className="flex items-center gap-4">
          <span
            className="font-mono text-[8px] tracking-[0.2em] uppercase"
            style={{ color: H.dim }}
          >
            CHEMICALS MONITORED
          </span>
          <span
            className="font-mono text-[13px] font-bold"
            style={{ color: H.accentBright }}
          >
            24
          </span>
          <div className="w-px h-4" style={{ background: H.border }} />
          <span
            className="font-mono text-[8px] tracking-[0.2em] uppercase"
            style={{ color: H.dim }}
          >
            ANOMALIES
          </span>
          <span
            className="font-mono text-[13px] font-bold"
            style={{ color: anomalyCount > 0 ? H.red : H.green }}
          >
            {anomalyCount}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: H.cyan,
                boxShadow: `0 0 6px ${H.cyan}`,
                animation: "pulse 873ms infinite",
              }}
            />
            <span
              className="font-mono text-[7px] tracking-[0.15em] uppercase"
              style={{ color: H.cyan }}
            >
              LIVE
            </span>
          </div>
          <span className="font-mono text-[7px]" style={{ color: H.dimmer }}>
            SYNC {now}
          </span>
          <span className="font-mono text-[7px]" style={{ color: H.dimmer }}>
            COH {(pulse.coherence * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* 4-column chemical grid */}
      <div className="p-4">
        <div
          className="grid grid-cols-4 gap-2"
          data-ocid="hub.dashboard.chem_grid"
        >
          {chemWithMeta.map((c) => (
            <div
              key={c.abbr}
              data-ocid={`hub.dashboard.chem.${c.abbr.toLowerCase()}`}
              className="border p-2.5 flex flex-col gap-1.5 relative"
              style={{
                borderColor: c.isAnomaly ? `${H.red}50` : H.border,
                background: c.isAnomaly ? `${H.red}06` : H.bgCard,
                boxShadow: c.isAnomaly ? `0 0 12px ${H.red}18` : undefined,
              }}
            >
              {c.isAnomaly && (
                <div
                  className="absolute top-1.5 right-1.5 font-mono text-[6px] tracking-[0.15em] uppercase px-1.5 py-0.5"
                  style={{
                    color: H.red,
                    border: `1px solid ${H.red}60`,
                    background: `${H.red}15`,
                    animation: "pulse 1.2s infinite",
                  }}
                >
                  ANOMALY
                </div>
              )}
              <div className="flex items-start justify-between">
                <div>
                  <div
                    className="font-mono text-[10px] font-bold tracking-wider"
                    style={{ color: c.barColor }}
                  >
                    {c.abbr}
                  </div>
                  <div
                    className="font-mono text-[6.5px] truncate"
                    style={{ color: H.dimmer }}
                  >
                    {c.name}
                  </div>
                </div>
                <div
                  className="font-mono text-[10px] font-bold"
                  style={{ color: c.trendColor }}
                >
                  {c.trend}
                </div>
              </div>
              <div
                className="relative w-full rounded-none overflow-hidden"
                style={{ height: "4px", background: "oklch(0.10 0.02 265)" }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: `${c.pct}%`,
                    background: c.isAnomaly
                      ? `linear-gradient(to right, ${H.red}80, ${H.red})`
                      : `linear-gradient(to right, ${c.barColor}60, ${c.barColor})`,
                    boxShadow:
                      c.pct > 75 ? `0 0 6px ${c.barColor}60` : undefined,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div
                  className="font-mono text-[9px] font-bold"
                  style={{ color: c.barColor }}
                >
                  {c.pct}%
                </div>
                <div
                  className="font-mono text-[7px]"
                  style={{ color: H.dimmer }}
                >
                  #{c._i + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SUB-TAB 2: INQUISITOR FEED ───────────────────────────────────────────────
function InquisitorFeed({ neural }: { neural: Neural }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [streamLog, setStreamLog] = useState<HypEntry[]>(SEED_HYPS);
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTicker((t) => t + 1), 20000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (ticker === 0) return;
    const entry: HypEntry = {
      ts: `T${4882 + ticker * 7}`,
      text: SEED_HYPS[ticker % SEED_HYPS.length].text,
      confidence: Math.round(60 + seededValue(ticker, ticker * 3) * 35),
      tags: SEED_HYPS[ticker % SEED_HYPS.length].tags,
    };
    setStreamLog((prev) => [entry, ...prev].slice(0, 20));
  }, [ticker]);

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      data-ocid="hub.inquisitor.page"
    >
      <div className="shrink-0 p-4 pb-0">
        <div className="flex items-center justify-between mb-2">
          <div
            className="font-mono text-[8px] tracking-[0.22em] uppercase"
            style={{ color: H.dim }}
          >
            ▸ INQUISITOR LIVE STREAM — newest first
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: H.cyan,
                boxShadow: `0 0 4px ${H.cyan}`,
                animation: "pulse 2s infinite",
              }}
            />
            <span className="font-mono text-[7px]" style={{ color: H.cyan }}>
              STREAMING
            </span>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="border overflow-y-auto"
          style={{
            borderColor: H.border,
            background: "oklch(0.035 0.012 270)",
            maxHeight: "220px",
          }}
          data-ocid="hub.inquisitor.stream"
        >
          {streamLog.map((entry, i) => (
            <div
              key={`${entry.ts}-${i}`}
              data-ocid={`hub.inquisitor.stream.item.${i + 1}`}
              className="flex items-start gap-3 px-3 py-1.5 border-b"
              style={{
                borderColor: H.dimmer,
                opacity: Math.max(0.25, 1 - i * 0.07),
              }}
            >
              <span
                className="font-mono text-[7px] shrink-0 pt-0.5"
                style={{ color: H.cyan }}
              >
                {entry.ts}
              </span>
              <span
                className="font-mono text-[7.5px] leading-relaxed flex-1 min-w-0"
                style={{ color: i === 0 ? H.text : H.textDim }}
              >
                {entry.text}
              </span>
              <span
                className="font-mono text-[7px] shrink-0"
                style={{ color: H.accentBright }}
              >
                {entry.confidence}%
              </span>
              <div className="flex gap-1 shrink-0">
                {entry.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[6px] px-1 py-0.5"
                    style={{
                      color: H.violet,
                      border: `1px solid ${H.violet}40`,
                      background: `${H.violet}0a`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-hidden min-h-0 mt-3">
        <PharmaAgentPanel
          neural={
            neural as unknown as {
              neurotransmitters?: Record<string, number>;
              cortisolLevel?: number;
              hungerDrive?: number;
              tick?: number;
            }
          }
        />
      </div>
    </div>
  );
}

// ── SUB-TAB 3: CONNECTOME CORRELATION ───────────────────────────────────────
function ConnectomeCorrelation() {
  const { actor, isFetching } = useActor(createActor);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 873);
    return () => clearInterval(id);
  }, []);

  const { data: history = [] } = useQuery({
    queryKey: ["pharmaExperimentHistory"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await (
          actor as unknown as Record<string, (...args: unknown[]) => unknown>
        ).getPharmaExperimentHistory();
        return Array.isArray(result) ? result : [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });

  const regionActivations = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const h of history as Record<string, unknown>[]) {
      const regions = (h.affectedRegions ?? h.regions ?? []) as string[];
      const delta =
        typeof h.activationDelta === "number" ? h.activationDelta : 0.3;
      for (const r of regions) {
        const key = r.toUpperCase().slice(0, 6);
        acc[key] = (acc[key] ?? 0) + delta;
      }
    }
    return acc;
  }, [history]);

  const getActivation = (abbr: string, idx: number): number => {
    const fromHistory = regionActivations[abbr];
    if (fromHistory !== undefined) return Math.min(1, fromHistory);
    return 0.3 + Math.abs(Math.sin(tick * PHI * 0.07 + idx * 0.618)) * 0.6;
  };
  const heatColor = (v: number): string => {
    if (v >= 0.85) return "oklch(0.65 0.25 25)";
    if (v >= 0.65) return "oklch(0.72 0.22 45)";
    if (v >= 0.45) return "oklch(0.72 0.22 65)";
    if (v >= 0.25) return "oklch(0.64 0.18 255)";
    return "oklch(0.42 0.14 260)";
  };

  return (
    <div className="h-full overflow-auto p-4" data-ocid="hub.correlations.page">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <SectionHeader label="CONNECTOME CORRELATION MAP — LAST 24H" />
          <div className="flex items-center gap-3">
            {(
              [
                [0.1, "COOL"],
                [0.4, "MOD"],
                [0.65, "HOT"],
                [0.9, "CRIT"],
              ] as [number, string][]
            ).map(([v, l]) => (
              <div key={l} className="flex items-center gap-1">
                <div className="w-3 h-3" style={{ background: heatColor(v) }} />
                <span className="font-mono text-[7px]" style={{ color: H.dim }}>
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div
          className="grid grid-cols-4 gap-2"
          data-ocid="hub.correlations.heatmap"
        >
          {REGIONS_16.map((abbr, idx) => {
            const activation = getActivation(abbr, idx);
            const pct = Math.round(activation * 100);
            const color = heatColor(activation);
            return (
              <div
                key={abbr}
                data-ocid={`hub.correlations.region.${idx + 1}`}
                className="border p-2.5 flex flex-col gap-1"
                style={{ borderColor: `${color}40`, background: `${color}10` }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-[9px] font-bold"
                    style={{ color }}
                  >
                    {abbr}
                  </span>
                  <span className="font-mono text-[8px]" style={{ color }}>
                    {pct}%
                  </span>
                </div>
                <div
                  style={{
                    height: "3px",
                    background: "oklch(0.10 0.02 265)",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: `linear-gradient(to right, ${color}70, ${color})`,
                      boxShadow:
                        activation > 0.7 ? `0 0 4px ${color}80` : undefined,
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
                <div
                  className="font-mono text-[6.5px] truncate"
                  style={{ color: H.dimmer }}
                >
                  {REGION_FULL[abbr] ?? abbr}
                </div>
              </div>
            );
          })}
        </div>
        <div
          className="mt-4 p-3 border font-mono text-[7.5px] leading-relaxed"
          style={{
            borderColor: H.border,
            background: H.bgCard,
            color: H.textDim,
          }}
        >
          <span style={{ color: H.accent }}>CORRELATION ENGINE</span> —
          Activation deltas derived from{" "}
          <span style={{ color: H.cyan }}>
            {(history as unknown[]).length} experiment records
          </span>{" "}
          + live PHI-pulsed standing wave (PHI⁴ × Schumann) where history is
          sparse. Coherence:{" "}
          <span style={{ color: H.accentBright }}>
            {(0.6 + Math.sin(tick * 0.1) * 0.2).toFixed(3)}
          </span>{" "}
          · Tick: <span style={{ color: H.accentBright }}>{tick}</span>
        </div>
      </div>
    </div>
  );
}

// ── SUB-TAB 4: EXPERIMENT ARCHIVE ───────────────────────────────────────────
function ExperimentArchive() {
  const { actor, isFetching } = useActor(createActor);
  const [modal, setModal] = useState<Record<string, unknown> | null>(null);

  const { data: history = [] } = useQuery({
    queryKey: ["pharmaExperimentHistory"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await (
          actor as unknown as Record<string, (...args: unknown[]) => unknown>
        ).getPharmaExperimentHistory();
        return Array.isArray(result) ? result : [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });

  const TYPE_COLORS: Record<string, string> = {
    controlled: H.green,
    dose_response: "oklch(0.68 0.24 220)",
    combination: "oklch(0.72 0.24 55)",
    longitudinal: H.violet,
    receptor: H.cyan,
  };
  const typeColor = (t: string) =>
    TYPE_COLORS[t?.toLowerCase().replace("-", "_")] ?? H.dim;
  const verdictColor = (v: string) => {
    const vl = v?.toLowerCase() ?? "";
    if (vl.includes("valid") || vl.includes("success")) return H.green;
    if (vl.includes("anomal")) return H.red;
    return "oklch(0.72 0.22 65)";
  };
  const fmtTime = (ts: unknown) => {
    if (typeof ts === "number" || typeof ts === "bigint") {
      const ms = Number(ts);
      return new Date(ms > 1e12 ? ms : ms * 1000).toLocaleString();
    }
    return typeof ts === "string" ? ts : "—";
  };
  const rows = history as Record<string, unknown>[];

  return (
    <div className="h-full overflow-auto p-4" data-ocid="hub.archive.page">
      <div className="max-w-5xl mx-auto">
        <SectionHeader label="Experiment Archive — Aggregated from Pharma Lab" />
        {rows.length === 0 ? (
          <EmptyState
            icon="⚗"
            title="No experiments yet"
            sub="No experiments run yet — visit Pharma Lab in Ops to begin"
          />
        ) : (
          <div className="flex flex-col gap-2" data-ocid="hub.archive.list">
            {rows.map((row, i) => {
              const id = String(row.id ?? row.exp_id ?? `EXP-${i + 1}`);
              const type = String(
                row.expType ?? row.experiment_type ?? "controlled",
              );
              const compound = String(row.compound ?? row.compoundName ?? "—");
              const verdict = String(row.outcome ?? row.verdict ?? "PENDING");
              const ts = fmtTime(row.timestamp ?? row.createdAt ?? null);
              const color = typeColor(type);
              const vc = verdictColor(verdict);
              return (
                <div
                  key={id}
                  data-ocid={`hub.archive.item.${i + 1}`}
                  className="border p-3 flex items-center gap-3"
                  style={{ borderColor: H.border, background: H.bgCard }}
                >
                  <div
                    className="font-mono text-[8px] w-24 shrink-0"
                    style={{ color: H.accentBright }}
                  >
                    {id}
                  </div>
                  <HubBadge color={color}>
                    {type.replace("_", "-").toUpperCase()}
                  </HubBadge>
                  <div
                    className="flex-1 font-mono text-[9px] min-w-0 truncate"
                    style={{ color: H.text }}
                  >
                    {compound}
                  </div>
                  <HubBadge color={vc}>{verdict.toUpperCase()}</HubBadge>
                  <div
                    className="font-mono text-[7px] shrink-0"
                    style={{ color: H.dim }}
                  >
                    {ts}
                  </div>
                  <button
                    type="button"
                    data-ocid={`hub.archive.view_report.${i + 1}`}
                    onClick={() => setModal(row)}
                    className="font-mono text-[7px] tracking-[0.12em] uppercase px-3 py-1 border shrink-0 transition-all hover:opacity-80"
                    style={{
                      color: H.accent,
                      borderColor: `${H.accent}50`,
                      background: `${H.accent}0a`,
                    }}
                  >
                    VIEW REPORT
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {modal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "oklch(0 0 0 / 0.7)" }}
            data-ocid="hub.archive.dialog"
          >
            <div
              className="border max-w-lg w-full p-5 flex flex-col gap-3"
              style={{
                borderColor: H.accent,
                background: "oklch(0.07 0.02 265)",
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="font-mono text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: H.accentBright }}
                >
                  EXPERIMENT REPORT
                </div>
                <button
                  type="button"
                  data-ocid="hub.archive.close_button"
                  onClick={() => setModal(null)}
                  className="font-mono text-[9px] px-2 py-1 border transition-all hover:opacity-80"
                  style={{ color: H.dim, borderColor: `${H.dim}40` }}
                >
                  ✕ CLOSE
                </button>
              </div>
              <div
                className="border-t pt-3 flex flex-col gap-2"
                style={{ borderColor: H.border }}
              >
                {Object.entries(modal)
                  .slice(0, 12)
                  .map(([k, v]) => (
                    <div key={k} className="flex items-start gap-3">
                      <div
                        className="font-mono text-[7px] tracking-[0.12em] uppercase w-28 shrink-0"
                        style={{ color: H.dim }}
                      >
                        {k.toUpperCase()}
                      </div>
                      <div
                        className="font-mono text-[8px] leading-relaxed"
                        style={{ color: H.text }}
                      >
                        {String(v)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── SUB-TAB 5: COMPOUND COMPARE ─────────────────────────────────────────────
function CompoundCompare() {
  const [compA, setCompA] = useState(COMPARE_COMPOUNDS[0]);
  const [compB, setCompB] = useState(COMPARE_COMPOUNDS[1]);

  const valuesA = useMemo(
    () => CHEMS_24.map((_, i) => compoundChemValue(compA, i)),
    [compA],
  );
  const valuesB = useMemo(
    () => CHEMS_24.map((_, i) => compoundChemValue(compB, i)),
    [compB],
  );

  const SELECT_STYLE: React.CSSProperties = {
    background: H.bgCard,
    border: `1px solid ${H.border}`,
    color: H.text,
    fontFamily: "monospace",
    fontSize: "10px",
    padding: "4px 8px",
    outline: "none",
  };

  return (
    <div className="h-full overflow-auto p-4" data-ocid="hub.compare.page">
      <div className="max-w-5xl mx-auto">
        <SectionHeader label="Compound Neurochemical Comparison" />
        <div className="flex items-center gap-6 mb-6">
          <div className="flex flex-col gap-1">
            <div
              className="font-mono text-[7px] tracking-[0.15em] uppercase"
              style={{ color: H.dim }}
            >
              COMPOUND A
            </div>
            <select
              data-ocid="hub.compare.select_a"
              style={SELECT_STYLE}
              value={compA}
              onChange={(e) => setCompA(e.target.value)}
            >
              {COMPARE_COMPOUNDS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="font-mono text-[11px] mt-4" style={{ color: H.dim }}>
            VS
          </div>
          <div className="flex flex-col gap-1">
            <div
              className="font-mono text-[7px] tracking-[0.15em] uppercase"
              style={{ color: H.dim }}
            >
              COMPOUND B
            </div>
            <select
              data-ocid="hub.compare.select_b"
              style={SELECT_STYLE}
              value={compB}
              onChange={(e) => setCompB(e.target.value)}
            >
              {COMPARE_COMPOUNDS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-side bar charts */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {(
            [
              { label: compA, values: valuesA, color: H.accentBright },
              { label: compB, values: valuesB, color: H.cyan },
            ] as { label: string; values: number[]; color: string }[]
          ).map(({ label, values, color }) => (
            <div
              key={label}
              className="border p-3"
              style={{ borderColor: H.border, background: H.bgCard }}
            >
              <div
                className="font-mono text-[9px] font-bold mb-3"
                style={{ color }}
              >
                {label}
              </div>
              <div className="flex flex-col gap-1">
                {CHEMS_24.map((c, i) => {
                  const val = values[i] ?? 50;
                  return (
                    <div key={c.abbr} className="flex items-center gap-2">
                      <div
                        className="font-mono text-[7px] w-8 shrink-0"
                        style={{ color: H.dim }}
                      >
                        {c.abbr}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          height: "6px",
                          background: "oklch(0.10 0.02 265)",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            height: "100%",
                            width: `${val}%`,
                            background: `linear-gradient(to right, ${color}50, ${color})`,
                          }}
                        />
                      </div>
                      <div
                        className="font-mono text-[7px] w-8 text-right shrink-0"
                        style={{ color }}
                      >
                        {val.toFixed(0)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Delta table */}
        <SectionHeader label={`Delta Table — ${compA} vs ${compB}`} />
        <div
          className="border overflow-hidden"
          style={{ borderColor: H.border }}
        >
          <div
            className="grid px-3 py-1.5 border-b"
            style={{
              borderColor: H.border,
              background: H.bgDeep,
              gridTemplateColumns: "60px 1fr 80px 80px 90px",
            }}
          >
            {[
              "CHEM",
              "NAME",
              compA.slice(0, 7),
              compB.slice(0, 7),
              "DELTA",
            ].map((h) => (
              <div
                key={h}
                className="font-mono text-[7px] tracking-[0.12em] uppercase"
                style={{ color: H.dim }}
              >
                {h}
              </div>
            ))}
          </div>
          {CHEMS_24.map((c, i) => {
            const a = valuesA[i] ?? 50;
            const b = valuesB[i] ?? 50;
            const delta = a - b;
            const winner = delta > 0 ? "A" : delta < 0 ? "B" : "";
            return (
              <div
                key={c.abbr}
                data-ocid={`hub.compare.delta.${c.abbr.toLowerCase()}`}
                className="grid px-3 py-1 border-b"
                style={{
                  borderColor: H.border,
                  gridTemplateColumns: "60px 1fr 80px 80px 90px",
                  background:
                    Math.abs(delta) > 20
                      ? `${delta > 0 ? H.accentBright : H.cyan}06`
                      : undefined,
                }}
              >
                <div
                  className="font-mono text-[8px] font-bold"
                  style={{ color: H.accentBright }}
                >
                  {c.abbr}
                </div>
                <div
                  className="font-mono text-[7.5px]"
                  style={{ color: H.textDim }}
                >
                  {c.name}
                </div>
                <div
                  className="font-mono text-[8px]"
                  style={{ color: H.accentBright }}
                >
                  {a.toFixed(0)}
                </div>
                <div className="font-mono text-[8px]" style={{ color: H.cyan }}>
                  {b.toFixed(0)}
                </div>
                <div
                  className="font-mono text-[8px] font-bold"
                  style={{
                    color:
                      winner === "A"
                        ? H.green
                        : winner === "B"
                          ? "oklch(0.68 0.24 220)"
                          : H.dim,
                  }}
                >
                  {delta > 0 ? "+" : ""}
                  {delta.toFixed(1)} {winner ? `[${winner}]` : ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── SUB-TAB 6: RESEARCH PIPELINE ─────────────────────────────────────────────
function ResearchPipeline({ neural }: { neural: Neural }) {
  const pulse = useLiveOrganismPulse();
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const statusColor = (s: string) =>
    s === "RUNNING" ? H.cyan : s === "COMPLETE" ? H.green : H.dim;
  const priorityColor = (p: string) =>
    p === "HIGH" ? H.red : p === "MED" ? "oklch(0.72 0.22 65)" : H.dim;

  const generateReport = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const now = new Date();
    const nt = (neural?.neurotransmitters ?? {}) as unknown as Record<
      string,
      number
    >;
    const coherence = pulse.coherence;
    const beat = pulse.beat;
    const w = 210;
    const margin = 18;
    let y = margin;
    const line = (
      txt: string,
      size = 10,
      bold = false,
      color: [number, number, number] = [200, 200, 220],
    ) => {
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
      29,
    );
    doc.text(
      `TICK: ${beat}  |  COHERENCE: ${(coherence * 100).toFixed(1)}%  |  MODE: ${pulse.modeName}`,
      margin,
      35,
    );
    y = 46;
    rule();

    line("SECTION 1 — NEURAL STATE ANALYSIS", 11, true, [120, 100, 255]);
    space(2);
    line(
      `Dopamine proxy:         ${((nt.dopamine ?? 0.45) * 100).toFixed(1)}%`,
      9,
    );
    line(
      `Serotonin proxy:        ${((nt.serotonin ?? 0.38) * 100).toFixed(1)}%`,
      9,
    );
    line(
      `Norepinephrine proxy:   ${((nt.norepinephrine ?? 0.42) * 100).toFixed(1)}%`,
      9,
    );
    line(`GABA proxy:             ${((nt.gaba ?? 0.55) * 100).toFixed(1)}%`, 9);
    line(
      `Glutamate proxy:        ${((nt.glutamate ?? 0.6) * 100).toFixed(1)}%`,
      9,
    );
    line(
      `Acetylcholine proxy:    ${((nt.acetylcholine ?? 0.35) * 100).toFixed(1)}%`,
      9,
    );
    line(
      `Cortisol proxy:         ${(((neural?.cortisolLevel as number) ?? 0.3) * 100).toFixed(1)}%`,
      9,
    );
    line(
      `Hunger drive (NPY):     ${(((neural?.hungerDrive as number) ?? 0.48) * 100).toFixed(1)}%`,
      9,
    );
    space(3);
    rule();

    line("SECTION 2 — NEUROCHEMICAL TRENDS", 11, true, [120, 100, 255]);
    space(2);
    line(
      "ELEVATED (>65% proxy): DPA, GAB, GLU when organism is active",
      9,
      false,
      [200, 200, 100],
    );
    line(
      "DEPLETED (<35% proxy): ACH, OXT, MEL when stress load is high",
      9,
      false,
      [100, 180, 220],
    );
    line(
      `Dominant driver: ${(nt.dopamine ?? 0) > (nt.serotonin ?? 0) ? "Dopaminergic" : "Serotonergic"} pathway`,
      9,
    );
    line(
      `HPA axis: ${((neural?.cortisolLevel as number) ?? 0.3) > 0.6 ? "ELEVATED — stress response active" : "NOMINAL"}`,
      9,
    );
    space(3);
    rule();

    line("SECTION 3 — CONNECTOME COHERENCE", 11, true, [120, 100, 255]);
    space(2);
    line(`Global coherence score:  ${(coherence * 100).toFixed(2)}%`, 9);
    line(
      `OMNIS gate status:       ${coherence > 0.87 ? "ACTIVE — emergence state" : "BELOW THRESHOLD"}`,
      9,
    );
    line(`Behavioral mode:         ${pulse.modeName}`, 9);
    line(
      `Sovereign: ${pulse.sovereign ? "YES" : "NO"}  |  Emergency: ${pulse.emergency ? "YES" : "NO"}`,
      9,
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
      [180, 180, 210],
    );
    line(
      "  behavior over next 12 heartbeat cycles. Expect LTP strengthening in PFC.",
      9,
      false,
      [180, 180, 210],
    );
    space(1);
    line(
      "• Elevated GABA proxy indicates saturation dampening is active — cortical",
      9,
      false,
      [180, 180, 210],
    );
    line(
      "  noise reduction improving signal-to-noise ratio by estimated 18-24%.",
      9,
      false,
      [180, 180, 210],
    );
    space(1);
    line(
      "• NPY hunger drive above baseline predicts ESURIENS task generation",
      9,
      false,
      [180, 180, 210],
    );
    line(
      "  acceleration. Expect 2-3 new INQUISITOR hypotheses at next PHI⁴ cycle.",
      9,
      false,
      [180, 180, 210],
    );
    space(3);
    rule();

    line("SECTION 5 — RESEARCH RECOMMENDATIONS", 11, true, [120, 100, 255]);
    space(2);
    line(
      "1. Run Dose-Response protocol on dominant neurochemical to establish EC50",
      9,
      false,
      [180, 180, 210],
    );
    line(
      "   and therapeutic window under current organism state.",
      9,
      false,
      [180, 180, 210],
    );
    space(1);
    line(
      "2. Deploy Receptor Mapping experiment targeting PFC and Hippocampus —",
      9,
      false,
      [180, 180, 210],
    );
    line(
      "   full binding kinetics across D1/D2 and 5-HT1A receptor families.",
      9,
      false,
      [180, 180, 210],
    );
    space(1);
    line(
      "3. Initiate Longitudinal Study for baseline chemical drift tracking over",
      9,
      false,
      [180, 180, 210],
    );
    line(
      "   48 heartbeat sessions. Seal each as sovereign Memory Temple artifact.",
      9,
      false,
      [180, 180, 210],
    );
    space(3);
    rule();
    line(
      "© 2026 NeuroEmergence Core — INQUISITOR PHARM — TOP SECRET PROPRIETARY",
      7,
      false,
      [80, 80, 100],
    );

    const ts = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
    doc.save(`NeuroPharma_Report_${ts}.pdf`);
  };

  return (
    <div className="h-full overflow-auto p-4" data-ocid="hub.pipeline.page">
      <div className="max-w-4xl mx-auto">
        {/* Generate report CTA */}
        <div
          className="mb-6 p-4 border flex items-center justify-between"
          style={{ borderColor: `${H.accent}40`, background: `${H.accent}06` }}
        >
          <div>
            <div
              className="font-mono text-[10px] font-bold mb-1"
              style={{ color: H.accentBright }}
            >
              INQUISITOR PHARM — SCIENTIFIC REPORT
            </div>
            <div className="font-mono text-[8px]" style={{ color: H.textDim }}>
              Multi-section report: neural state, trends, coherence,
              predictions, recommendations
            </div>
          </div>
          <button
            type="button"
            data-ocid="hub.pipeline.generate_report_button"
            onClick={generateReport}
            className="font-mono text-[8px] tracking-[0.15em] uppercase px-4 py-2 border font-bold shrink-0 transition-all hover:opacity-80"
            style={{
              color: H.accentBright,
              borderColor: `${H.accentBright}60`,
              background: `${H.accent}18`,
              boxShadow: `0 0 16px ${H.accent}30`,
            }}
          >
            ⬇ GENERATE SCIENTIFIC REPORT
          </button>
        </div>

        {toast && (
          <div
            data-ocid="hub.pipeline.toast"
            className="fixed top-4 right-4 z-50 font-mono text-[9px] tracking-[0.12em] uppercase px-4 py-2 border"
            style={{
              color: H.green,
              borderColor: `${H.green}50`,
              background: "oklch(0.07 0.02 265)",
              boxShadow: `0 0 16px ${H.green}30`,
            }}
          >
            ✓ {toast}
          </div>
        )}

        {/* INQUISITOR Queue */}
        <div className="mb-8">
          <SectionHeader label="INQUISITOR QUEUE — 8 Active Hypotheses" />
          <div
            className="flex flex-col gap-2"
            data-ocid="hub.pipeline.queue_list"
          >
            {PIPELINE_ITEMS.map((item, i) => (
              <div
                key={item.title}
                data-ocid={`hub.pipeline.item.${i + 1}`}
                className="border p-3 flex items-center gap-3"
                style={{
                  borderColor:
                    item.status === "RUNNING" ? `${H.cyan}40` : H.border,
                  background:
                    item.status === "RUNNING" ? `${H.cyan}06` : H.bgCard,
                }}
              >
                <div className="flex-1 min-w-0">
                  <div
                    className="font-mono text-[8.5px] mb-1 truncate"
                    style={{ color: H.text }}
                  >
                    {item.title}
                  </div>
                  <div className="flex items-center gap-2">
                    <HubBadge color={statusColor(item.status)}>
                      {item.status}
                    </HubBadge>
                    <HubBadge color={priorityColor(item.priority)}>
                      {item.priority} PRI
                    </HubBadge>
                    <span
                      className="font-mono text-[7px]"
                      style={{ color: H.violet }}
                    >
                      FOCUS: {item.focus}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  data-ocid={`hub.pipeline.send_to_lab.${i + 1}`}
                  onClick={() =>
                    showToast("Hypothesis queued for Lab experiment")
                  }
                  className="font-mono text-[7px] tracking-[0.1em] uppercase px-3 py-1 border shrink-0 transition-all hover:opacity-80"
                  style={{
                    color: H.accent,
                    borderColor: `${H.accent}50`,
                    background: `${H.accent}0a`,
                  }}
                >
                  ⊕ SEND TO LAB
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Publication Log */}
        <div>
          <SectionHeader label="PUBLICATION LOG — PDF Artifacts" />
          <div className="border" style={{ borderColor: H.border }}>
            <div
              className="grid px-3 py-2 border-b"
              style={{
                borderColor: H.border,
                background: H.bgDeep,
                gridTemplateColumns: "1fr 1fr 100px 1fr 110px",
              }}
            >
              {["COMPOUND", "EXPERIMENT TYPE", "DATE", "DOI", "STATUS"].map(
                (col) => (
                  <div
                    key={col}
                    className="font-mono text-[7px] tracking-[0.15em] uppercase"
                    style={{ color: H.dim }}
                  >
                    {col}
                  </div>
                ),
              )}
            </div>
            {PUB_LOG.map((pub, i) => (
              <div
                key={pub.compound}
                data-ocid={`hub.pipeline.pub.${i + 1}`}
                className="grid px-3 py-2 border-b items-center"
                style={{
                  borderColor: H.border,
                  gridTemplateColumns: "1fr 1fr 100px 1fr 110px",
                }}
              >
                <div
                  className="font-mono text-[8.5px] font-bold"
                  style={{ color: H.accentBright }}
                >
                  {pub.compound}
                </div>
                <div
                  className="font-mono text-[7.5px]"
                  style={{ color: H.textDim }}
                >
                  {pub.expType}
                </div>
                <div className="font-mono text-[7px]" style={{ color: H.dim }}>
                  {pub.date}
                </div>
                <div
                  className="font-mono text-[7.5px] truncate"
                  style={{ color: pub.doi ? H.cyan : H.dim }}
                >
                  {pub.doi || "PENDING DOI"}
                </div>
                <HubBadge color={pub.doi ? H.green : "oklch(0.72 0.22 65)"}>
                  {pub.doi ? "ZENODO READY" : "PENDING"}
                </HubBadge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN HUB COMPONENT ────────────────────────────────────────────────────────
export default function PharmaHubTab({ neural }: { neural: Neural }) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("dashboard");
  void useMemo(() => neural, [neural]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* ── Command center header */}
      <div
        className="shrink-0 flex items-center justify-between px-4 border-b"
        style={{
          background:
            "linear-gradient(to right, oklch(0.055 0.018 265), oklch(0.06 0.022 275))",
          borderColor: H.border,
          height: "40px",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-[8px] tracking-[0.2em] uppercase font-bold"
            style={{
              color: H.accentBright,
              textShadow: `0 0 12px ${H.accent}60`,
            }}
          >
            ◈ PHARMA HUB
          </span>
          <span
            className="font-mono text-[7px] tracking-[0.15em] uppercase px-2 py-0.5 border"
            style={{
              color: H.violet,
              borderColor: `${H.violet}40`,
              background: `${H.violet}0a`,
            }}
          >
            NEUROSCIENCE COMMAND CENTER
          </span>
        </div>
        <div
          className="font-mono text-[7px] tracking-[0.12em] uppercase"
          style={{ color: H.dim }}
        >
          Wing 5 · Aggregation Only · No Experiments
        </div>
      </div>

      {/* ── Sub-tab bar */}
      <div
        className="shrink-0 flex border-b relative"
        style={{
          background: "oklch(0.05 0.016 265)",
          borderColor: H.border,
          height: "34px",
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{
            background: `linear-gradient(to right, transparent, ${H.accent}40, transparent)`,
          }}
        />
        {SUB_TABS.map(({ id, label }) => {
          const isActive = activeSubTab === id;
          return (
            <button
              key={id}
              type="button"
              data-ocid={`hub.subtab.${id}`}
              onClick={() => setActiveSubTab(id)}
              className="relative flex items-center px-4 font-mono text-[8.5px] tracking-[0.13em] uppercase transition-all whitespace-nowrap shrink-0 h-full"
              style={{
                color: isActive ? H.accentBright : H.dim,
                background: isActive ? `${H.accent}0c` : "transparent",
                borderBottom: isActive
                  ? `2px solid ${H.accent}`
                  : "2px solid transparent",
              }}
            >
              {isActive && (
                <span
                  className="absolute inset-x-0 bottom-0 h-px"
                  style={{
                    background: `linear-gradient(to right, transparent, ${H.accent}60, transparent)`,
                    boxShadow: `0 0 4px ${H.accent}`,
                  }}
                />
              )}
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Content */}
      <div
        className="flex-1 overflow-hidden min-h-0"
        style={{ background: H.bg }}
      >
        {activeSubTab === "dashboard" && <NeuralDashboard neural={neural} />}
        {activeSubTab === "inquisitor" && <InquisitorFeed neural={neural} />}
        {activeSubTab === "correlations" && <ConnectomeCorrelation />}
        {activeSubTab === "archive" && <ExperimentArchive />}
        {activeSubTab === "compare" && <CompoundCompare />}
        {activeSubTab === "pipeline" && <ResearchPipeline neural={neural} />}
      </div>
    </div>
  );
}
