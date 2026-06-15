import { useEffect, useRef, useState } from "react";
import type {
  LayerAState,
  LayerBIdentity,
  NeuralSimulationState,
} from "../hooks/useNeuralSimulation";
import { FrontendRegion, Region } from "../hooks/useQueries";
import type { ExtendedRegion } from "../hooks/useQueries";

interface StatsPanelProps {
  neural: NeuralSimulationState;
}

const REGION_LABELS: Partial<Record<ExtendedRegion, string>> = {
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
  [FrontendRegion.RetroSplenialCortex]: "Retrosplenial Cortex",
};

const REGION_ORDER: ExtendedRegion[] = [
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
  FrontendRegion.RetroSplenialCortex,
];

function activityToBarColor(activity: number): string {
  if (activity < 0.25) return `oklch(${0.35 + activity * 0.6} 0.12 260)`;
  if (activity < 0.5) return `oklch(${0.55 + (activity - 0.25) * 0.6} 0.2 200)`;
  if (activity < 0.75)
    return `oklch(${0.7 + (activity - 0.5) * 0.2} 0.22 ${160 - (activity - 0.5) * 320})`;
  return `oklch(${0.68 - (activity - 0.75) * 0.12} 0.28 ${80 - (activity - 0.75) * 320})`;
}

function ActivityBar({
  activity,
  label,
  isSaturated,
}: { activity: number; label: string; isSaturated?: boolean }) {
  const pct = Math.round(activity * 100);
  const color = activityToBarColor(activity);

  return (
    <div className="flex items-center gap-1 group">
      <span
        className="font-mono text-[9px] tracking-wider shrink-0 truncate"
        style={{
          color: "oklch(0.5 0.08 220)",
          width: "108px",
          textAlign: "right",
        }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-[5px] relative"
        style={{ background: "oklch(0.12 0.02 260)" }}
      >
        <div
          className="activity-bar-fill"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: activity > 0.5 ? `0 0 5px ${color}66` : "none",
          }}
        />
      </div>
      <span
        className="font-mono text-[9px] shrink-0"
        style={{ color, width: "30px", textAlign: "right" }}
      >
        {pct}%
      </span>
      {isSaturated && (
        <span
          className="font-mono text-[8px] font-bold shrink-0 px-1 rounded"
          style={{
            background: "oklch(0.35 0.22 25)",
            color: "oklch(0.95 0.15 25)",
          }}
        >
          SAT
        </span>
      )}
    </div>
  );
}

function NeurotransmitterBar({
  label,
  value,
  color,
  abbrev,
}: {
  label: string;
  value: number;
  color: string;
  abbrev: string;
}) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-1">
      <span
        className="font-mono text-[8px] shrink-0 font-bold"
        style={{ color, width: "24px" }}
      >
        {abbrev}
      </span>
      <div
        className="flex-1 h-[4px] relative"
        style={{ background: "oklch(0.12 0.02 260)" }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${pct}%`,
            background: color,
            boxShadow: value > 0.5 ? `0 0 5px ${color}` : "none",
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <span
        className="font-mono text-[8px] shrink-0"
        style={{ color, width: "24px", textAlign: "right" }}
      >
        {pct}%
      </span>
      <span
        className="font-mono text-[7px] shrink-0 hidden xl:block"
        style={{ color: "oklch(0.3 0.04 220)", width: "70px" }}
      >
        {label}
      </span>
    </div>
  );
}

function CircularGauge({
  value,
  label,
  color,
  size = 60,
}: {
  value: number;
  label: string;
  color: string;
  size?: number;
}) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - value);

  return (
    <div className="flex flex-col items-center gap-[2px]">
      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          width={size}
          height={size}
          style={{ transform: "rotate(-90deg)" }}
          role="img"
          aria-label={`${label}: ${Math.round(value * 100)}%`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="oklch(0.15 0.03 260)"
            strokeWidth={4}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={4}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="butt"
            style={{
              transition: "stroke-dashoffset 0.3s ease",
              filter: value > 0.5 ? `drop-shadow(0 0 3px ${color})` : "none",
            }}
          />
        </svg>
        <div
          className="font-mono absolute inset-0 flex items-center justify-center text-[10px] font-bold"
          style={{ color }}
        >
          {Math.round(value * 100)}
        </div>
      </div>
      <span
        className="font-mono text-[7px] tracking-widest uppercase text-center leading-tight"
        style={{ color: "oklch(0.45 0.06 220)", maxWidth: size }}
      >
        {label}
      </span>
    </div>
  );
}

function MiniMeterCompact({
  value,
  label,
  signed = false,
}: {
  value: number;
  label: string;
  signed?: boolean;
}) {
  const pct = signed ? (value + 1) / 2 : value;
  const color =
    value > 0.6
      ? "oklch(0.72 0.25 55)"
      : value < -0.3
        ? "oklch(0.55 0.18 260)"
        : "oklch(0.7 0.2 195)";

  const displayVal = signed
    ? `${value >= 0 ? "+" : ""}${value.toFixed(1)}`
    : `${Math.round(value * 100)}%`;

  return (
    <div className="flex items-center gap-1">
      <span
        className="font-mono text-[8px] tracking-widest uppercase shrink-0"
        style={{ color: "oklch(0.42 0.06 220)", width: "40px" }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-[3px] relative"
        style={{ background: "oklch(0.12 0.02 260)" }}
      >
        {signed ? (
          <div
            className="absolute h-full"
            style={{
              left: "50%",
              width: `${Math.abs(value) * 50}%`,
              transform: value < 0 ? "translateX(-100%)" : "none",
              background: color,
            }}
          />
        ) : (
          <div
            className="absolute h-full left-0"
            style={{
              width: `${pct * 100}%`,
              background: color,
              boxShadow: value > 0.7 ? `0 0 4px ${color}` : "none",
            }}
          />
        )}
      </div>
      <span
        className="font-mono text-[8px] font-bold shrink-0 text-right"
        style={{ color, width: "26px" }}
      >
        {displayVal}
      </span>
    </div>
  );
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
  height = 12,
}: {
  label: string;
  hz: string;
  amplitude: number;
  freqMult: number;
  phase: number;
  color: string;
  time: number;
  width?: number;
  height?: number;
}) {
  const samples = 32;
  const points: string[] = [];

  for (let i = 0; i <= samples; i++) {
    const x = (i / samples) * width;
    const t = time + (i / samples) * 4;
    const y =
      height / 2 +
      Math.sin(t * freqMult + phase) * amplitude * (height / 2 - 1);
    points.push(`${x},${Math.max(1, Math.min(height - 1, y))}`);
  }

  return (
    <div className="flex items-center gap-1">
      <div
        className="shrink-0 font-mono text-right"
        style={{
          width: "14px",
          color,
          fontSize: "8px",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </div>
      <div
        className="shrink-0 font-mono"
        style={{
          width: "28px",
          color: "oklch(0.3 0.04 220)",
          fontSize: "7px",
        }}
      >
        {hz}Hz
      </div>
      <svg
        width={width}
        height={height}
        style={{ overflow: "visible" }}
        role="img"
        aria-label={`${label} EEG channel`}
      >
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="oklch(0.075 0.01 260)"
        />
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke={color}
          strokeWidth={0.8}
          strokeOpacity={0.9}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ─── Layer A State Engine Display ─────────────────────────────────────────────
function LayerADisplay({ layerA }: { layerA: LayerAState | undefined }) {
  if (!layerA) return null;
  const modeColor: Record<string, string> = {
    exploration: "oklch(0.72 0.22 195)",
    exploitation: "oklch(0.82 0.22 80)",
    rest: "oklch(0.55 0.15 260)",
    "threat-response": "oklch(0.68 0.28 25)",
    social: "oklch(0.72 0.22 310)",
  };
  const color = modeColor[layerA.behavioralMode] ?? "oklch(0.6 0.15 220)";
  const bars: Array<{
    label: string;
    value: number;
    color: string;
    signed?: boolean;
  }> = [
    { label: "Salience", value: layerA.salience, color: "oklch(0.78 0.26 55)" },
    { label: "Arousal", value: layerA.arousal, color: "oklch(0.72 0.22 195)" },
    {
      label: "Memory Idx",
      value: layerA.memoryIndex,
      color: "oklch(0.72 0.2 160)",
    },
    {
      label: "Plasticity",
      value: layerA.plasticityRate,
      color: "oklch(0.75 0.22 280)",
    },
    {
      label: "Reward/Threat",
      value: (layerA.rewardThreat + 1) / 2,
      color:
        layerA.rewardThreat >= 0
          ? "oklch(0.75 0.22 140)"
          : "oklch(0.65 0.25 25)",
    },
  ];
  return (
    <div className="flex flex-col gap-[4px]">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="font-mono text-[7px] tracking-widest"
          style={{ color: "oklch(0.35 0.05 220)" }}
        >
          MODE:
        </span>
        <span
          className="font-mono text-[8px] font-bold tracking-widest uppercase px-1.5 py-0.5"
          style={{
            color,
            background: `${color}18`,
            border: `1px solid ${color}44`,
          }}
        >
          {layerA.behavioralMode.replace("-", " ")}
        </span>
      </div>
      {bars.map(({ label, value, color: c }) => (
        <div key={label} className="flex items-center gap-1">
          <span
            className="font-mono text-[7px] shrink-0"
            style={{ color: "oklch(0.4 0.05 220)", width: "62px" }}
          >
            {label}
          </span>
          <div
            className="flex-1 h-[3px]"
            style={{ background: "oklch(0.12 0.02 260)" }}
          >
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${Math.round(value * 100)}%`, background: c }}
            />
          </div>
          <span
            className="font-mono text-[7px] shrink-0"
            style={{ color: c, width: "24px", textAlign: "right" }}
          >
            {Math.round(value * 100)}%
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Layer B Identity Model Display ───────────────────────────────────────────
function LayerBDisplay({ layerB }: { layerB: LayerBIdentity | undefined }) {
  if (!layerB) return null;
  const traits: Array<{
    key: keyof LayerBIdentity;
    label: string;
    color: string;
  }> = [
    { key: "discipline", label: "Discipline", color: "oklch(0.78 0.24 195)" },
    { key: "resilience", label: "Resilience", color: "oklch(0.75 0.22 140)" },
    {
      key: "cooperativeness",
      label: "Cooperative",
      color: "oklch(0.72 0.22 310)",
    },
    { key: "cautiousness", label: "Cautious", color: "oklch(0.72 0.22 220)" },
    { key: "aggression", label: "Aggression", color: "oklch(0.68 0.28 25)" },
    { key: "impulsivity", label: "Impulsivity", color: "oklch(0.75 0.26 55)" },
    { key: "skepticism", label: "Skepticism", color: "oklch(0.72 0.2 80)" },
    { key: "fatigue", label: "Fatigue", color: "oklch(0.55 0.15 260)" },
  ];
  return (
    <div className="flex flex-col gap-[4px]">
      {traits.map(({ key, label, color }) => {
        const value = layerB[key] ?? 0;
        return (
          <div key={key} className="flex items-center gap-1">
            <span
              className="font-mono text-[7px] shrink-0"
              style={{ color: "oklch(0.4 0.05 220)", width: "62px" }}
            >
              {label}
            </span>
            <div
              className="flex-1 h-[3px]"
              style={{ background: "oklch(0.12 0.02 260)" }}
            >
              <div
                className="h-full transition-all duration-400"
                style={{
                  width: `${Math.round(value * 100)}%`,
                  background: color,
                }}
              />
            </div>
            <span
              className="font-mono text-[7px] shrink-0"
              style={{ color, width: "24px", textAlign: "right" }}
            >
              {Math.round(value * 100)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function StatsPanel({ neural }: StatsPanelProps) {
  const activityMap = new Map<ExtendedRegion, number>(neural.regionActivity);

  const tick = neural.tick;
  const activeNeurons = neural.activeNeuronCount;
  const totalNeurons = 86100000000; // 86.1B
  const globalArousal = neural.globalArousal;
  const nt = neural.neurotransmitters;

  const av = neural.avatarBehavior;

  // Firing rate
  const avgFiringRate = (
    (activeNeurons / Math.max(totalNeurons, 1)) *
    40
  ).toFixed(1);
  // Synapse activation %
  const synapseActivationPct = Math.min(100, globalArousal * 120).toFixed(1);

  // EEG animation
  const [eegTime, setEegTime] = useState(0);
  const eegTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
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
      color: "oklch(0.82 0.26 55)",
    },
    {
      abbrev: "5HT",
      label: "Serotonin",
      value: nt.serotonin,
      color: "oklch(0.72 0.22 160)",
    },
    {
      abbrev: "NE",
      label: "Norepinephrine",
      value: nt.norepinephrine,
      color: "oklch(0.68 0.28 25)",
    },
    {
      abbrev: "GABA",
      label: "GABA",
      value: nt.gaba,
      color: "oklch(0.62 0.2 270)",
    },
    {
      abbrev: "GLU",
      label: "Glutamate",
      value: nt.glutamate,
      color: "oklch(0.78 0.22 80)",
    },
    {
      abbrev: "ACh",
      label: "Acetylcholine",
      value: nt.acetylcholine,
      color: "oklch(0.72 0.22 195)",
    },
  ];

  const neuroplasticity = Math.min(1, (hippocampus + pfc) * 0.55);
  const myelination = Math.min(1, 0.6 + motor * 0.15 + sensory * 0.1);
  const bandwidth = Math.min(1, globalArousal * 0.7 + thalamus * 0.3);

  return (
    <div
      data-ocid="stats.panel"
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "oklch(0.065 0.01 265)" }}
    >
      {/* Header metrics row */}
      <div
        className="flex gap-2 px-3 py-2 border-b shrink-0"
        style={{ borderColor: "oklch(0.18 0.04 255)" }}
      >
        {/* Global arousal gauge */}
        <CircularGauge
          value={globalArousal}
          label="Arousal"
          color={
            globalArousal > 0.7
              ? "oklch(0.7 0.28 30)"
              : globalArousal > 0.4
                ? "oklch(0.8 0.22 80)"
                : "oklch(0.72 0.22 195)"
          }
          size={60}
        />

        {/* Tick + neuron counters */}
        <div className="flex-1 flex flex-col justify-center gap-[2px]">
          <div className="flex flex-col">
            <span
              className="font-mono text-[7px] tracking-widest uppercase"
              style={{ color: "oklch(0.4 0.06 220)" }}
            >
              Simulation Tick
            </span>
            <span
              className="font-mono text-sm font-bold leading-none"
              style={{ color: "oklch(0.78 0.18 200)", letterSpacing: "0.1em" }}
            >
              {tick.toLocaleString()}
            </span>
          </div>
          <div className="flex gap-3 mt-1">
            <div className="flex flex-col">
              <span
                className="font-mono text-[7px] uppercase"
                style={{ color: "oklch(0.38 0.05 220)" }}
              >
                Firing
              </span>
              <span
                className="font-mono text-[10px] font-bold"
                style={{ color: "oklch(0.78 0.22 140)" }}
              >
                {avgFiringRate} Hz
              </span>
            </div>
            <div className="flex flex-col">
              <span
                className="font-mono text-[7px] uppercase"
                style={{ color: "oklch(0.38 0.05 220)" }}
              >
                Syn. Active
              </span>
              <span
                className="font-mono text-[10px] font-bold"
                style={{ color: "oklch(0.72 0.22 195)" }}
              >
                {synapseActivationPct}%
              </span>
            </div>
          </div>
        </div>

        {/* 3 gauges */}
        <div className="flex gap-1 items-start">
          <CircularGauge
            value={neuroplasticity}
            label="Plasticity"
            color="oklch(0.72 0.22 195)"
            size={52}
          />
          <CircularGauge
            value={myelination}
            label="Myelin"
            color="oklch(0.78 0.22 140)"
            size={52}
          />
          <CircularGauge
            value={bandwidth}
            label="Bandwidth"
            color="oklch(0.78 0.25 55)"
            size={52}
          />
        </div>
      </div>

      {/* Region count badge */}
      <div
        className="flex items-center gap-3 px-3 py-[4px] border-b shrink-0"
        style={{
          borderColor: "oklch(0.15 0.03 260)",
          background: "oklch(0.07 0.012 265)",
        }}
      >
        {[
          {
            label: "REGIONS",
            value: "45",
            color: "oklch(0.72 0.22 195)",
          },
          {
            label: "ACTIVE",
            value: neural.activeNeuronCount.toLocaleString(),
            color: "oklch(0.78 0.18 200)",
          },
          {
            label: "SYNAPSES",
            value: "500T+",
            color: "oklch(0.7 0.2 160)",
          },
          {
            label: "GLIA",
            value: "130B",
            color: "oklch(0.7 0.15 220)",
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex flex-col items-center">
            <span
              className="font-mono text-[7px] tracking-widest"
              style={{ color: "oklch(0.35 0.05 220)" }}
            >
              {label}
            </span>
            <span className="font-mono text-[10px] font-bold" style={{ color }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Neurotransmitter levels */}
      <div
        className="px-3 py-2 border-b shrink-0"
        style={{ borderColor: "oklch(0.18 0.04 255)" }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-1"
          style={{ color: "oklch(0.38 0.06 220)" }}
        >
          ▸ Neurotransmitter Levels
        </div>
        <div className="flex flex-col gap-[3px]">
          {neurotransmitters.map((nt_item) => (
            <NeurotransmitterBar
              key={nt_item.abbrev}
              abbrev={nt_item.abbrev}
              label={nt_item.label}
              value={nt_item.value}
              color={nt_item.color}
            />
          ))}
        </div>
      </div>

      {/* Sleep Pressure / Adenosine readout */}
      <div
        className="px-3 py-2 border-b shrink-0"
        style={{ borderColor: "oklch(0.18 0.04 255)" }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-1"
          style={{ color: "oklch(0.38 0.06 220)" }}
        >
          ▸ Adenosine / Sleep Pressure
        </div>
        <div className="flex items-center gap-1">
          <span
            className="font-mono text-[9px] tracking-wider shrink-0"
            style={{ color: "oklch(0.5 0.08 220)", width: "80px" }}
          >
            ADENOSINE
          </span>
          <div
            className="flex-1 h-[5px] relative"
            style={{ background: "oklch(0.12 0.02 260)" }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${Math.round(neural.sleepPressure * 100)}%`,
                background:
                  neural.sleepPressure > 0.7
                    ? "linear-gradient(90deg, oklch(0.45 0.18 300), oklch(0.72 0.22 300))"
                    : neural.sleepPressure > 0.4
                      ? "linear-gradient(90deg, oklch(0.65 0.18 140), oklch(0.78 0.22 140))"
                      : "linear-gradient(90deg, oklch(0.55 0.18 160), oklch(0.72 0.22 160))",
                boxShadow:
                  neural.sleepPressure > 0.7
                    ? "0 0 5px oklch(0.72 0.22 300 / 0.6)"
                    : "none",
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <span
            className="font-mono text-[9px] shrink-0 font-bold"
            style={{
              color:
                neural.sleepPressure > 0.7
                  ? "oklch(0.72 0.22 300)"
                  : neural.sleepPressure > 0.4
                    ? "oklch(0.78 0.22 80)"
                    : "oklch(0.72 0.22 160)",
              width: "34px",
              textAlign: "right",
            }}
          >
            {Math.round(neural.sleepPressure * 100)}%
          </span>
        </div>
        <div
          className="font-mono text-[7px] mt-[2px]"
          style={{ color: "oklch(0.35 0.05 220)" }}
        >
          {neural.sleepPressure > 0.8
            ? "⚠ HIGH ADENOSINE — brainstem suppressed"
            : neural.sleepPressure > 0.5
              ? "Moderate accumulation — vigilance decreasing"
              : "Normal — circadian baseline"}
        </div>
      </div>

      {/* Cognitive Architecture Panels */}
      <div
        className="px-3 py-2 border-t shrink-0"
        style={{ borderColor: "oklch(0.18 0.04 255)" }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-2"
          style={{ color: "oklch(0.38 0.06 220)" }}
        >
          ▸ Layer A — State Engine
        </div>
        <LayerADisplay layerA={neural.layerA} />
      </div>
      <div
        data-ocid="layer_b.panel"
        className="px-3 py-2 border-t shrink-0"
        style={{ borderColor: "oklch(0.18 0.04 255)" }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-2"
          style={{ color: "oklch(0.38 0.06 220)" }}
        >
          ▸ Layer B — Identity Model
        </div>
        <LayerBDisplay layerB={neural.layerB} />
      </div>

      {/* Region activity bars */}

      {/* Debug run banner */}
      {neural.isDebugRun && (
        <div
          className="mx-3 mt-2 px-2 py-1 rounded font-mono text-[9px] font-bold"
          style={{
            background: "oklch(0.25 0.18 25)",
            color: "oklch(0.95 0.18 25)",
            border: "1px solid oklch(0.45 0.22 25)",
          }}
          data-ocid="stats.error_state"
        >
          ⛔ DEBUG RUN — &gt;30% regions saturated. Fix homeostasis before
          emergence claims.
        </div>
      )}

      {/* Saturation warning */}
      {!neural.isDebugRun && neural.saturatedRegions.length > 0 && (
        <div
          className="mx-3 mt-2 px-2 py-1 rounded font-mono text-[9px]"
          style={{
            background: "oklch(0.22 0.12 45)",
            color: "oklch(0.88 0.14 45)",
            border: "1px solid oklch(0.4 0.16 45)",
          }}
        >
          ⚠ {neural.saturatedRegions.length} SATURATED REGION
          {neural.saturatedRegions.length > 1 ? "S" : ""} — emergence claims
          suppressed
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-[3px] min-h-0">
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-1"
          style={{ color: "oklch(0.38 0.06 220)" }}
        >
          ▸ Region Activity Matrix · 180 Regions (Top 45 Active)
        </div>
        {REGION_ORDER.map((region) => (
          <ActivityBar
            key={region}
            activity={activityMap.get(region) ?? 0}
            label={REGION_LABELS[region] ?? String(region)}
            isSaturated={neural.saturatedRegions.includes(region)}
          />
        ))}
      </div>

      {/* EEG Oscilloscope */}
      <div
        className="px-3 py-2 border-t shrink-0"
        style={{ borderColor: "oklch(0.18 0.04 255)" }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-1"
          style={{ color: "oklch(0.38 0.06 220)" }}
        >
          ▸ EEG · Neural Oscillations
        </div>
        <div className="flex flex-col gap-[2px]">
          <EEGChannel
            label="δ"
            hz="0.5-4"
            amplitude={Math.max(0.08, brainstem)}
            freqMult={0.5}
            phase={0}
            color="oklch(0.6 0.18 280)"
            time={eegTime}
          />
          <EEGChannel
            label="θ"
            hz="4-8"
            amplitude={Math.max(0.08, hippocampus)}
            freqMult={1.2}
            phase={1.1}
            color="oklch(0.62 0.2 310)"
            time={eegTime}
          />
          <EEGChannel
            label="α"
            hz="8-12"
            amplitude={Math.max(0.08, 1 - globalArousal)}
            freqMult={2.5}
            phase={2.2}
            color="oklch(0.72 0.22 195)"
            time={eegTime}
          />
          <EEGChannel
            label="β"
            hz="13-30"
            amplitude={Math.max(0.08, (pfc + motor) * 0.5)}
            freqMult={4.0}
            phase={0.7}
            color="oklch(0.82 0.22 80)"
            time={eegTime}
          />
          <EEGChannel
            label="γ"
            hz="30-100"
            amplitude={Math.max(0.08, (sensory + thalamus) * 0.5)}
            freqMult={8.0}
            phase={3.5}
            color="oklch(0.68 0.28 25)"
            time={eegTime}
          />
        </div>
      </div>

      {/* Compact Avatar state row */}
      <div
        className="px-3 py-2 border-t shrink-0"
        style={{ borderColor: "oklch(0.18 0.04 255)" }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-1"
          style={{ color: "oklch(0.38 0.06 220)" }}
        >
          ▸ Avatar Neural State
        </div>
        <div className="flex flex-col gap-[3px]">
          <div className="grid grid-cols-2 gap-x-3">
            <MiniMeterCompact value={av.motionLevel} label="Motion" />
            <MiniMeterCompact value={av.attentionLevel} label="Attn" />
          </div>
          <div className="grid grid-cols-2 gap-x-3">
            <MiniMeterCompact
              value={av.emotionValence}
              label="Emotion"
              signed
            />
            <MiniMeterCompact value={av.consciousnessLevel} label="Consci" />
          </div>
        </div>
      </div>
    </div>
  );
}
