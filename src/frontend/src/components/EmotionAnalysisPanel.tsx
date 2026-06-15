import { useEffect, useRef, useState } from "react";
import type {
  NeuralSimulationState,
  ThoughtEntry,
} from "../hooks/useNeuralSimulation";
import { FrontendRegion, Region } from "../hooks/useQueries";
import type { ExtendedRegion } from "../hooks/useQueries";

interface EmotionAnalysisPanelProps {
  neural: NeuralSimulationState;
}

interface EmotionData {
  name: string;
  intensity: number;
  color: string;
}

function getActivityFromRegions(
  regions: NeuralSimulationState["regions"],
  region: ExtendedRegion,
): number {
  return regions.find((r) => r.region === region)?.activation ?? 0;
}

function computeEmotions(
  regions: NeuralSimulationState["regions"],
  emotionValence: number,
): EmotionData[] {
  const pfc = getActivityFromRegions(regions, Region.PrefrontalCortex);
  const amygdala = getActivityFromRegions(regions, Region.Amygdala);
  const hippocampus = getActivityFromRegions(regions, Region.Hippocampus);
  const thalamus = getActivityFromRegions(regions, Region.Thalamus);
  const sensory = getActivityFromRegions(regions, Region.SensoryCortex);
  const basal = getActivityFromRegions(regions, Region.BasalGanglia);
  const nucleus = getActivityFromRegions(
    regions,
    FrontendRegion.NucleusAccumbens,
  );
  const insula = getActivityFromRegions(regions, FrontendRegion.Insula);

  const joy = Math.min(
    1,
    emotionValence > 0
      ? (pfc + nucleus * 0.5 + amygdala * 0.2) * 0.5 * (1 + emotionValence)
      : 0,
  );
  const fear = Math.min(1, amygdala * 0.8 + insula * 0.3);
  const anger = Math.min(1, (amygdala * 0.8 + basal * 0.6) * 0.75);
  const sadness = Math.min(
    1,
    emotionValence < 0 ? pfc * (1 - emotionValence * 0.5) * 0.7 : pfc * 0.1,
  );
  const surprise = Math.min(1, (thalamus + sensory) * 0.5);
  const trust = Math.min(1, pfc * 0.7 * 0.5 + hippocampus * 0.6 * 0.5);
  const disgust = Math.min(1, amygdala * 0.4 + insula * 0.35);

  return [
    { name: "Joy", intensity: joy, color: "oklch(0.82 0.22 80)" },
    { name: "Fear", intensity: fear, color: "oklch(0.68 0.28 25)" },
    { name: "Anger", intensity: anger, color: "oklch(0.62 0.3 15)" },
    { name: "Sadness", intensity: sadness, color: "oklch(0.55 0.2 260)" },
    { name: "Surprise", intensity: surprise, color: "oklch(0.72 0.22 195)" },
    { name: "Trust", intensity: trust, color: "oklch(0.7 0.22 155)" },
    { name: "Disgust", intensity: disgust, color: "oklch(0.65 0.2 310)" },
  ];
}

function computeThoughts(
  regions: NeuralSimulationState["regions"],
): { label: string; intensity: number }[] {
  const get = (r: ExtendedRegion) => getActivityFromRegions(regions, r);

  const pfc = get(Region.PrefrontalCortex);
  const hippocampus = get(Region.Hippocampus);
  const amygdala = get(Region.Amygdala);
  const motor = get(Region.MotorCortex);
  const basal = get(Region.BasalGanglia);
  const sensory = get(Region.SensoryCortex);
  const thalamus = get(Region.Thalamus);
  const visual = get(FrontendRegion.VisualCortex);
  const auditory = get(FrontendRegion.AuditoryCortex);
  const acc = get(FrontendRegion.AnteriorCingulateCortex);
  const insula = get(FrontendRegion.Insula);
  const ofc = get(FrontendRegion.OrbitalFrontalCortex);
  const nucleus = get(FrontendRegion.NucleusAccumbens);
  const olfactory = get(FrontendRegion.OlfactoryBulb);

  const _maxActivity = Math.max(...regions.map((r) => r.activation), 0);

  const thoughts: { label: string; intensity: number }[] = [];

  if (pfc > 0.4)
    thoughts.push({ label: "Analytical Reasoning", intensity: pfc });
  if (pfc > 0.3 && hippocampus > 0.35)
    thoughts.push({
      label: "Creative Synthesis",
      intensity: (pfc + hippocampus) * 0.5,
    });
  if (hippocampus > 0.45 && thalamus > 0.35)
    thoughts.push({
      label: "Memory Consolidation",
      intensity: (hippocampus + thalamus) * 0.5,
    });
  if (amygdala > 0.45)
    thoughts.push({ label: "Threat Assessment", intensity: amygdala });
  if (motor > 0.4 && basal > 0.35)
    thoughts.push({
      label: "Motor Planning",
      intensity: (motor + basal) * 0.5,
    });
  if (sensory > 0.4 && thalamus > 0.4)
    thoughts.push({
      label: "Sensory Integration",
      intensity: (sensory + thalamus) * 0.5,
    });
  if (pfc > 0.5 && amygdala > 0.4)
    thoughts.push({
      label: "Emotional Regulation",
      intensity: (pfc + amygdala) * 0.5,
    });
  if (hippocampus > 0.5 && motor > 0.3)
    thoughts.push({
      label: "Spatial Navigation",
      intensity: (hippocampus + motor) * 0.5,
    });
  if (auditory > 0.3 && pfc > 0.3)
    thoughts.push({
      label: "Language Processing",
      intensity: (auditory + pfc) * 0.5,
    });
  if (pfc > 0.45 && acc > 0.35)
    thoughts.push({
      label: "Self-Referential",
      intensity: (pfc + acc) * 0.5,
    });
  if (pfc > 0.4 && ofc > 0.3)
    thoughts.push({
      label: "Future Projection",
      intensity: (pfc + ofc) * 0.5,
    });
  if (acc > 0.4 && amygdala > 0.3)
    thoughts.push({
      label: "Social Cognition",
      intensity: (acc + amygdala) * 0.5,
    });
  if (insula > 0.35)
    thoughts.push({ label: "Interoception", intensity: insula });
  if (ofc > 0.4 && nucleus > 0.3)
    thoughts.push({
      label: "Decision Weighting",
      intensity: (ofc + nucleus) * 0.5,
    });
  if (olfactory > 0.3 || (visual > 0.3 && sensory > 0.3))
    thoughts.push({
      label: "Pattern Recognition",
      intensity: Math.max(olfactory, (visual + sensory) * 0.5),
    });

  // Normalize so the top thought = 1.0, others scale proportionally
  const sorted = thoughts.sort((a, b) => b.intensity - a.intensity);
  const maxIntensity = sorted[0]?.intensity ?? 1;
  const normalized = sorted
    .map((t) => ({ ...t, intensity: t.intensity / maxIntensity }))
    .filter((t) => t.intensity > 0.25);
  return normalized.slice(0, 6);
}

interface SparklineProps {
  history: number[];
  color: string;
  width?: number;
  height?: number;
}

function Sparkline({
  history,
  color,
  width = 60,
  height = 16,
}: SparklineProps) {
  if (history.length < 2) {
    return (
      <svg
        width={width}
        height={height}
        style={{ overflow: "visible" }}
        role="img"
        aria-label="emotion sparkline"
      >
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke={color}
          strokeWidth={0.5}
          strokeOpacity={0.3}
        />
      </svg>
    );
  }

  const max = Math.max(...history, 0.01);
  const points = history.map((v, i) => {
    const x = (i / (history.length - 1)) * width;
    const y = height - (v / max) * (height - 2) - 1;
    return `${x},${y}`;
  });

  return (
    <svg
      width={width}
      height={height}
      style={{ overflow: "visible" }}
      role="img"
      aria-label="emotion sparkline"
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={1}
        strokeOpacity={0.7}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {history.length > 0 && (
        <circle
          cx={((history.length - 1) / (history.length - 1)) * width}
          cy={height - (history[history.length - 1] / max) * (height - 2) - 1}
          r={2}
          fill={color}
          style={{ filter: `drop-shadow(0 0 3px ${color})` }}
        />
      )}
    </svg>
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
  width = 180,
  height = 18,
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
  const samples = 36;
  const points: string[] = [];

  for (let i = 0; i <= samples; i++) {
    const x = (i / samples) * width;
    const t = time + (i / samples) * 4;
    const y =
      height / 2 +
      Math.sin(t * freqMult + phase) * amplitude * (height / 2 - 2);
    points.push(`${x},${Math.max(1, Math.min(height - 1, y))}`);
  }

  return (
    <div className="flex items-center gap-1">
      <div
        className="shrink-0 font-mono"
        style={{
          width: "28px",
          color,
          fontSize: "8px",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>
      <div
        className="shrink-0 font-mono"
        style={{
          width: "26px",
          color: "oklch(0.35 0.04 220)",
          fontSize: "7px",
        }}
      >
        {hz}
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
          fill="oklch(0.08 0.01 260)"
          rx={0}
        />
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke={color}
          strokeWidth={1}
          strokeOpacity={0.85}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ─── Thought Log Panel ────────────────────────────────────────────────────────

function ThoughtLogPanel({ thoughtLog }: { thoughtLog: ThoughtEntry[] }) {
  const recentThoughts = thoughtLog.slice(0, 15);

  return (
    <div
      className="px-3 py-2 border-t"
      style={{ borderColor: "oklch(0.18 0.04 255)" }}
    >
      <div
        className="font-mono text-[9px] tracking-widest uppercase mb-2"
        style={{ color: "oklch(0.38 0.06 220)" }}
      >
        ▸ THOUGHT LOG · LIVE COGNITION STREAM
      </div>
      {recentThoughts.length === 0 ? (
        <div
          data-ocid="thoughts.empty_state"
          className="font-mono text-[8px] italic"
          style={{ color: "oklch(0.32 0.04 220)" }}
        >
          Awaiting neural patterns...
        </div>
      ) : (
        <div className="flex flex-col gap-[5px]">
          {recentThoughts.map((entry, idx) => {
            const intensity = Math.min(1, entry.intensity);
            return (
              <div
                key={`${entry.tick}-${idx}`}
                data-ocid={`thought_log.item.${idx + 1}`}
                className="flex flex-col gap-[2px]"
                style={{
                  borderLeft: "2px solid",
                  borderColor:
                    idx === 0
                      ? "oklch(0.72 0.22 195)"
                      : intensity > 0.6
                        ? "oklch(0.72 0.22 195 / 0.7)"
                        : "oklch(0.25 0.05 240)",
                  paddingLeft: "6px",
                  opacity: idx === 0 ? 1 : Math.max(0.45, 0.95 - idx * 0.04),
                  background:
                    idx === 0 ? "oklch(0.08 0.018 255)" : "transparent",
                }}
              >
                {/* Tick + region */}
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-[7px] shrink-0"
                    style={{ color: "oklch(0.35 0.04 220)" }}
                  >
                    T{entry.tick}
                  </span>
                  <span
                    className="font-mono text-[7px] tracking-wider uppercase truncate"
                    style={{ color: "oklch(0.55 0.12 195)" }}
                  >
                    [
                    {entry.dominantRegion
                      .replace(/([A-Z])/g, " $1")
                      .trim()
                      .slice(0, 18)}
                    ]
                  </span>
                  {idx === 0 && (
                    <span
                      className="font-mono text-[6px] tracking-widest uppercase shrink-0"
                      style={{
                        color: "oklch(0.72 0.22 195)",
                        border: "1px solid oklch(0.72 0.22 195 / 0.5)",
                        padding: "0px 3px",
                      }}
                    >
                      NEW
                    </span>
                  )}
                </div>
                {/* Thought text */}
                <span
                  className="font-mono text-[8px] italic leading-tight"
                  style={{
                    color:
                      intensity > 0.6
                        ? "oklch(0.82 0.16 195)"
                        : "oklch(0.58 0.08 220)",
                  }}
                >
                  "{entry.thought}"
                </span>
                {/* Intensity bar */}
                <div className="flex items-center gap-1">
                  <div
                    className="flex-1 h-[2px]"
                    style={{ background: "oklch(0.12 0.02 260)" }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${intensity * 100}%`,
                        background: "oklch(0.65 0.2 195)",
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                  <span
                    className="font-mono text-[6px] shrink-0"
                    style={{ color: "oklch(0.42 0.07 195)" }}
                  >
                    {Math.round(intensity * 100)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function EmotionAnalysisPanel({ neural }: EmotionAnalysisPanelProps) {
  const historyRef = useRef<Map<string, number[]>>(new Map());
  const [, forceUpdate] = useState(0);
  const [eegTime, setEegTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setEegTime((t) => t + 0.05);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const {
    regions,
    neurotransmitters: nt,
    avatarBehavior,
    globalArousal,
  } = neural;

  const emotions = computeEmotions(regions, avatarBehavior.emotionValence);
  const thoughts = computeThoughts(regions);

  const emotionValence = avatarBehavior.emotionValence;

  const get = (r: ExtendedRegion) => getActivityFromRegions(regions, r);
  const brainstem = get(Region.Brainstem);
  const hippocampus = get(Region.Hippocampus);
  const pfc = get(Region.PrefrontalCortex);
  const motor = get(Region.MotorCortex);
  const sensory = get(Region.SensoryCortex);
  const thalamus = get(Region.Thalamus);

  // Update history — intentionally running when tick changes to sample per-tick
  // biome-ignore lint/correctness/useExhaustiveDependencies: sample emotions per tick, not per emotion reference change
  useEffect(() => {
    for (const emotion of emotions) {
      const hist = historyRef.current.get(emotion.name) ?? [];
      hist.push(emotion.intensity);
      if (hist.length > 40) hist.shift();
      historyRef.current.set(emotion.name, hist);
    }
    forceUpdate((n) => n + 1);
  }, [neural.tick]);

  const neurotransmitters = [
    { abbrev: "DA", value: nt.dopamine, color: "oklch(0.82 0.26 55)" },
    { abbrev: "5HT", value: nt.serotonin, color: "oklch(0.72 0.22 160)" },
    { abbrev: "NE", value: nt.norepinephrine, color: "oklch(0.68 0.28 25)" },
    { abbrev: "GABA", value: nt.gaba, color: "oklch(0.62 0.2 270)" },
    { abbrev: "GLU", value: nt.glutamate, color: "oklch(0.78 0.22 80)" },
    { abbrev: "ACh", value: nt.acetylcholine, color: "oklch(0.72 0.22 195)" },
  ];

  // Russell's Circumplex position
  const cx = (emotionValence * 0.45 + 0.5) * 110;
  const cy = (1 - globalArousal) * 110;

  return (
    <div
      data-ocid="emotion.panel"
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "oklch(0.065 0.01 265)" }}
    >
      {/* Two-column layout: emotions + circumplex */}
      <div
        className="flex border-b shrink-0"
        style={{ borderColor: "oklch(0.18 0.04 255)" }}
      >
        {/* Emotion bars */}
        <div
          className="flex-1 px-3 py-2 border-r"
          style={{ borderColor: "oklch(0.15 0.03 255)" }}
        >
          <div
            className="font-mono text-[9px] tracking-widest uppercase mb-1"
            style={{ color: "oklch(0.38 0.06 220)" }}
          >
            ▸ Plutchik Spectrum
          </div>
          <div className="flex flex-col gap-[3px]">
            {emotions.map((emotion) => {
              const history = historyRef.current.get(emotion.name) ?? [];
              return (
                <div key={emotion.name} className="flex items-center gap-1">
                  <span
                    className="font-mono text-[8px] shrink-0"
                    style={{ color: emotion.color, width: "44px" }}
                  >
                    {emotion.name}
                  </span>
                  <Sparkline
                    history={history}
                    color={emotion.color}
                    width={48}
                    height={14}
                  />
                  <div
                    className="h-[4px] relative flex-1"
                    style={{
                      background: "oklch(0.1 0.015 260)",
                      minWidth: "28px",
                      maxWidth: "40px",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        height: "100%",
                        width: `${emotion.intensity * 100}%`,
                        background: emotion.color,
                        boxShadow:
                          emotion.intensity > 0.4
                            ? `0 0 4px ${emotion.color}`
                            : "none",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <span
                    className="font-mono text-[8px] shrink-0 text-right"
                    style={{ color: emotion.color, width: "22px" }}
                  >
                    {Math.round(emotion.intensity * 100)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Circumplex */}
        <div className="px-2 py-2 shrink-0">
          <div
            className="font-mono text-[9px] tracking-widest uppercase mb-1"
            style={{ color: "oklch(0.38 0.06 220)" }}
          >
            ▸ Affect Space
          </div>
          <div
            style={{ position: "relative", width: "110px", height: "110px" }}
          >
            <svg
              width={110}
              height={110}
              role="img"
              aria-label="Russell's Circumplex of Affect"
            >
              {[0.25, 0.5, 0.75, 1.0].map((r) => (
                <circle
                  key={r}
                  cx={55}
                  cy={55}
                  r={r * 50}
                  fill="none"
                  stroke="oklch(0.2 0.04 250)"
                  strokeWidth={0.5}
                  strokeDasharray="2 3"
                />
              ))}
              <line
                x1={5}
                y1={55}
                x2={105}
                y2={55}
                stroke="oklch(0.25 0.04 240)"
                strokeWidth={0.7}
              />
              <line
                x1={55}
                y1={5}
                x2={55}
                y2={105}
                stroke="oklch(0.25 0.04 240)"
                strokeWidth={0.7}
              />
              <text
                x={55}
                y={9}
                textAnchor="middle"
                fill="oklch(0.4 0.05 220)"
                fontSize={5}
                fontFamily="JetBrains Mono, monospace"
              >
                EXCITED
              </text>
              <text
                x={55}
                y={108}
                textAnchor="middle"
                fill="oklch(0.4 0.05 220)"
                fontSize={5}
                fontFamily="JetBrains Mono, monospace"
              >
                CALM
              </text>
              <text
                x={3}
                y={58}
                textAnchor="start"
                fill="oklch(0.4 0.05 220)"
                fontSize={5}
                fontFamily="JetBrains Mono, monospace"
              >
                −
              </text>
              <text
                x={104}
                y={58}
                textAnchor="end"
                fill="oklch(0.4 0.05 220)"
                fontSize={5}
                fontFamily="JetBrains Mono, monospace"
              >
                +
              </text>
              <circle
                cx={cx}
                cy={cy}
                r={7}
                fill="oklch(0.72 0.22 195 / 0.12)"
              />
              <circle
                cx={cx}
                cy={cy}
                r={3.5}
                fill="oklch(0.72 0.22 195 / 0.35)"
              />
              <circle
                cx={cx}
                cy={cy}
                r={2}
                fill="oklch(0.85 0.22 195)"
                style={{
                  filter: "drop-shadow(0 0 4px oklch(0.72 0.22 195))",
                }}
              />
            </svg>
          </div>
          <div
            className="font-mono text-[7px] tracking-widest mt-1"
            style={{ color: "oklch(0.35 0.04 220)" }}
          >
            V:{emotionValence >= 0 ? "+" : ""}
            {emotionValence.toFixed(2)} A:{globalArousal.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Neurotransmitter balance */}
      <div
        className="px-3 py-2 border-b shrink-0"
        style={{ borderColor: "oklch(0.18 0.04 255)" }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-1"
          style={{ color: "oklch(0.38 0.06 220)" }}
        >
          ▸ Neurotransmitter Balance
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-[3px]">
          {neurotransmitters.map((ntItem) => (
            <div key={ntItem.abbrev} className="flex items-center gap-1">
              <span
                className="font-mono text-[8px] font-bold shrink-0"
                style={{ color: ntItem.color, width: "28px" }}
              >
                {ntItem.abbrev}
              </span>
              <div
                className="flex-1 h-[3px] relative"
                style={{ background: "oklch(0.12 0.02 260)" }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: `${ntItem.value * 100}%`,
                    background: ntItem.color,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
              <span
                className="font-mono text-[7px] shrink-0"
                style={{
                  color: ntItem.color,
                  width: "22px",
                  textAlign: "right",
                }}
              >
                {Math.round(ntItem.value * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Thought Patterns + EEG */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Thought patterns */}
        <div
          className="px-3 py-2 border-b"
          style={{ borderColor: "oklch(0.15 0.03 255)" }}
        >
          <div
            className="font-mono text-[9px] tracking-widest uppercase mb-1"
            style={{ color: "oklch(0.38 0.06 220)" }}
          >
            ▸ Active Thought Patterns (16-pattern model)
          </div>
          <div className="flex flex-col gap-[4px]">
            {thoughts.length === 0 ? (
              <div
                data-ocid="thoughts.empty_state"
                className="font-mono text-[9px]"
                style={{ color: "oklch(0.3 0.04 220)" }}
              >
                No active patterns
              </div>
            ) : (
              thoughts.map((thought, idx) => (
                <div
                  key={thought.label}
                  data-ocid={`thought.item.${idx + 1}`}
                  className="flex items-center gap-2"
                >
                  <div
                    className="font-mono text-[8px] px-2 py-[2px] flex-1"
                    style={{
                      border: "1px solid",
                      borderColor:
                        thought.intensity > 0.6
                          ? "oklch(0.72 0.22 195 / 0.7)"
                          : "oklch(0.25 0.05 240)",
                      background:
                        thought.intensity > 0.6
                          ? "oklch(0.72 0.22 195 / 0.1)"
                          : "oklch(0.1 0.015 260)",
                      color:
                        thought.intensity > 0.6
                          ? "oklch(0.82 0.18 195)"
                          : "oklch(0.55 0.08 220)",
                      boxShadow:
                        thought.intensity > 0.6
                          ? "0 0 6px oklch(0.72 0.22 195 / 0.3)"
                          : "none",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {thought.label}
                  </div>
                  <span
                    className="font-mono text-[8px] shrink-0"
                    style={{
                      color:
                        thought.intensity > 0.6
                          ? "oklch(0.72 0.22 195)"
                          : "oklch(0.4 0.05 220)",
                      width: "28px",
                      textAlign: "right",
                    }}
                  >
                    {Math.round(thought.intensity * 100)}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* EEG Oscilloscope */}
        <div className="px-3 py-2">
          <div
            className="font-mono text-[9px] tracking-widest uppercase mb-1"
            style={{ color: "oklch(0.38 0.06 220)" }}
          >
            ▸ EEG · Neural Oscillations
          </div>
          <div className="flex flex-col gap-[3px]">
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

        {/* Thought Log */}
        <ThoughtLogPanel thoughtLog={neural.thoughtLog} />

        {/* Working Memory */}
        <div
          className="px-3 py-2 border-t"
          style={{ borderColor: "oklch(0.18 0.04 255)" }}
        >
          <div
            className="font-mono text-[9px] tracking-widest uppercase mb-2"
            style={{ color: "oklch(0.38 0.06 220)" }}
          >
            ▸ WORKING MEMORY · PFC+MDT BUFFER
          </div>
          {neural.workingMemory.length === 0 ? (
            <div
              data-ocid="working_memory.empty_state"
              className="font-mono text-[8px] italic"
              style={{ color: "oklch(0.28 0.04 220)" }}
            >
              — BUFFER EMPTY —
            </div>
          ) : (
            <div className="flex flex-col gap-[4px]">
              {neural.workingMemory.map((entry, idx) => {
                const content =
                  typeof entry === "string" ? entry : entry.content;
                const strength = typeof entry === "string" ? 1 : entry.strength;
                return (
                  <div
                    key={content.slice(0, 20) + String(idx)}
                    data-ocid={`working_memory.item.${idx + 1}`}
                    className="flex items-start gap-2"
                  >
                    <span
                      className="font-mono text-[7px] shrink-0 font-bold"
                      style={{ color: "oklch(0.45 0.1 195)", width: "30px" }}
                    >
                      WM[{idx}]
                    </span>
                    <span
                      className="font-mono text-[8px] truncate flex-1"
                      style={{
                        color: `oklch(${0.35 + strength * 0.25} 0.12 195)`,
                        maxWidth: "180px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        opacity: Math.max(0.4, strength),
                      }}
                      title={content}
                    >
                      {content.slice(0, 40)}
                      {content.length > 40 ? "…" : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
