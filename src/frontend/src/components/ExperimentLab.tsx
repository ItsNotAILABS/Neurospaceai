import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AvatarBehavior,
  NeuralEvent,
  NeuralSimulationControls,
  NeuralSimulationState,
  SessionReport,
} from "../hooks/useNeuralSimulation";
import { FrontendRegion, Region } from "../hooks/useQueries";
import type { ExtendedRegion } from "../hooks/useQueries";
import { SessionReportModal } from "./SessionReportModal";

interface ExperimentLabProps {
  neural: NeuralSimulationState & NeuralSimulationControls;
}

// Behavior history for oscilloscope traces
const HISTORY_LENGTH = 120;

interface OscilloscopeTraceProps {
  history: number[];
  color: string;
  label: string;
  currentValue: number;
  signed?: boolean;
  height?: number;
}

function OscilloscopeTrace({
  history,
  color,
  label,
  currentValue,
  signed = false,
  height = 24,
}: OscilloscopeTraceProps) {
  const width = 200;

  const points = history.map((v, i) => {
    const x = (i / Math.max(history.length - 1, 1)) * width;
    const normalized = signed ? (v + 1) / 2 : v;
    const y = height - normalized * (height - 2) - 1;
    return `${x},${Math.max(1, Math.min(height - 1, y))}`;
  });

  const displayVal = signed
    ? `${currentValue >= 0 ? "+" : ""}${currentValue.toFixed(2)}`
    : `${Math.round(currentValue * 100)}%`;

  return (
    <div className="flex items-center gap-2">
      <span
        className="font-mono text-[8px] tracking-wider shrink-0"
        style={{ color: "oklch(0.45 0.06 220)", width: "50px" }}
      >
        {label}
      </span>
      <div className="flex-1 relative" style={{ minWidth: 0 }}>
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={`${label} trace`}
        >
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="oklch(0.06 0.01 260)"
          />
          {history.length >= 2 && (
            <polyline
              points={points.join(" ")}
              fill="none"
              stroke={color}
              strokeWidth={1}
              strokeOpacity={0.85}
              strokeLinejoin="round"
            />
          )}
          {/* Baseline center line for signed values */}
          {signed && (
            <line
              x1={0}
              y1={height / 2}
              x2={width}
              y2={height / 2}
              stroke={color}
              strokeOpacity={0.15}
              strokeWidth={0.5}
              strokeDasharray="2 3"
            />
          )}
        </svg>
      </div>
      <span
        className="font-mono text-[9px] font-bold shrink-0 text-right"
        style={{ color, width: "32px" }}
      >
        {displayVal}
      </span>
    </div>
  );
}

// Complexity scale description
function getScaleDescription(level: number): string {
  if (level <= 3) return "PRIMITIVE — Simple reflex arc";
  if (level <= 6) return "DEVELOPING — Mammalian complexity";
  if (level <= 9) return "ADVANCED — Primate-level integration";
  return "PEAK — Approaching human baseline";
}

function getScaleColor(level: number): string {
  if (level <= 3) return "oklch(0.55 0.18 220)";
  if (level <= 6) return "oklch(0.72 0.22 80)";
  if (level <= 9) return "oklch(0.72 0.22 195)";
  return "oklch(0.82 0.22 55)";
}

function formatNeuronCount(level: number): string {
  const count = Math.round(1000 * level ** 2.5);
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toLocaleString();
}

const EVENT_TYPE_COLORS = {
  surge: "oklch(0.72 0.22 195)",
  drop: "oklch(0.78 0.22 55)",
  cascade: "oklch(0.72 0.22 310)",
  stimulus: "oklch(0.78 0.22 80)",
};

const POSTURE_COLORS: Record<AvatarBehavior["postureState"], string> = {
  fearful: "oklch(0.65 0.28 25)",
  motivated: "oklch(0.82 0.26 55)",
  focused: "oklch(0.72 0.22 195)",
  sleeping: "oklch(0.55 0.18 270)",
  alert: "oklch(0.78 0.24 80)",
  resting: "oklch(0.5 0.06 220)",
};

const PROBE_REGIONS: Array<{
  label: string;
  region: ExtendedRegion;
  scope: string;
}> = [
  { label: "PFC", region: Region.PrefrontalCortex, scope: "probe.pfc" },
  { label: "AMYGDALA", region: Region.Amygdala, scope: "probe.amygdala" },
  {
    label: "HIPPOCAMPUS",
    region: Region.Hippocampus,
    scope: "probe.hippocampus",
  },
  { label: "THALAMUS", region: Region.Thalamus, scope: "probe.thalamus" },
  { label: "MOTOR CTX", region: Region.MotorCortex, scope: "probe.motor" },
  { label: "NAc", region: FrontendRegion.NucleusAccumbens, scope: "probe.nac" },
  { label: "INSULA", region: FrontendRegion.Insula, scope: "probe.insula" },
  {
    label: "HYPOTHAL.",
    region: FrontendRegion.Hypothalamus,
    scope: "probe.hypothal",
  },
];

const CASCADE_REGIONS: ExtendedRegion[] = [
  Region.PrefrontalCortex,
  Region.Thalamus,
  Region.SensoryCortex,
  Region.Amygdala,
  Region.Hippocampus,
  Region.MotorCortex,
  Region.BasalGanglia,
  Region.Cerebellum,
];

export function ExperimentLab({ neural }: ExperimentLabProps) {
  // Behavior history tracking
  const historyRef = useRef<{
    motion: number[];
    valence: number[];
    attention: number[];
    consciousness: number[];
  }>({
    motion: [],
    valence: [],
    attention: [],
    consciousness: [],
  });

  // Baseline recording
  const baselineRef = useRef<Map<ExtendedRegion, number> | null>(null);
  const [baselineRecorded, setBaselineRecorded] = useState(false);
  const [baselineDeltas, setBaselineDeltas] = useState<
    Map<ExtendedRegion, number>
  >(new Map());

  // Session report modal
  const [sessionReport, setSessionReport] = useState<SessionReport | null>(
    null,
  );

  // Active probe states for visual feedback
  const [activeProbes, setActiveProbes] = useState<Set<string>>(new Set());

  // Goal-directed streak counter
  const [goalStreak, setGoalStreak] = useState(0);
  const prevGoalDetectedRef = useRef(false);

  // Update behavior history
  const { avatarBehavior } = neural;

  // Push to history (capped at HISTORY_LENGTH)
  const hist = historyRef.current;
  hist.motion.push(avatarBehavior.motionLevel);
  hist.valence.push(avatarBehavior.emotionValence);
  hist.attention.push(avatarBehavior.attentionLevel);
  hist.consciousness.push(avatarBehavior.consciousnessLevel);
  if (hist.motion.length > HISTORY_LENGTH) hist.motion.shift();
  if (hist.valence.length > HISTORY_LENGTH) hist.valence.shift();
  if (hist.attention.length > HISTORY_LENGTH) hist.attention.shift();
  if (hist.consciousness.length > HISTORY_LENGTH) hist.consciousness.shift();

  // Track goal-directed nav streak
  const goalNavDetected = neural.emergentBehaviors.goalDirectedNavDetected;
  useEffect(() => {
    if (goalNavDetected && neural.isRunning) {
      setGoalStreak((prev) => prev + 1);
    } else if (!goalNavDetected && prevGoalDetectedRef.current) {
      setGoalStreak(0);
    }
    prevGoalDetectedRef.current = goalNavDetected;
  }, [goalNavDetected, neural.isRunning]);

  const handleProbe = useCallback(
    (scope: string, region: ExtendedRegion, type: "lesion" | "boost") => {
      const key = `${scope}.${type}`;
      setActiveProbes((prev) => new Set([...prev, key]));
      setTimeout(() => {
        setActiveProbes((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }, 800);

      if (type === "lesion") {
        neural.lesionRegion(region, 5000);
      } else {
        neural.potentiateRegion(region, 3000);
      }
    },
    [neural],
  );

  const handleEndSession = useCallback(() => {
    const report = neural.endSession();
    setSessionReport(report);
  }, [neural]);

  const handleCascade = useCallback(() => {
    // Pick 3 random regions
    const shuffled = [...CASCADE_REGIONS].sort(() => Math.random() - 0.5);
    const targets = shuffled.slice(0, 3);
    for (const region of targets) {
      neural.injectStimulus(region, 0.9);
    }
  }, [neural]);

  const handleRecordBaseline = useCallback(() => {
    const baseline = new Map<ExtendedRegion, number>();
    for (const [region, activity] of neural.regionActivity) {
      baseline.set(region, activity);
    }
    baselineRef.current = baseline;
    setBaselineRecorded(true);
    setBaselineDeltas(new Map());

    // Compute deltas after 2 seconds
    setTimeout(() => {
      if (!baselineRef.current) return;
      const deltas = new Map<ExtendedRegion, number>();
      for (const [region, activity] of neural.regionActivity) {
        const base = baselineRef.current.get(region) ?? activity;
        deltas.set(region, activity - base);
      }
      setBaselineDeltas(deltas);
    }, 2000);
  }, [neural]);

  const postureColor = POSTURE_COLORS[avatarBehavior.postureState];

  // Live Findings computations (top-level, not inside IIFE)
  const liveActivations = neural.regionActivity.map(([, a]) => a);
  const liveEntropy = (() => {
    const total2 = liveActivations.reduce((s, v) => s + v, 0) || 1;
    return (
      -liveActivations.reduce((h, v) => {
        const p = v / total2;
        return p > 0 ? h + p * Math.log2(p) : h;
      }, 0) / Math.log2(Math.max(liveActivations.length, 2))
    );
  })();
  const livePlasticityIndex =
    neural.stdpWeightSummary.length > 0
      ? neural.stdpWeightSummary.reduce((s, e) => s + Math.abs(e.delta), 0) /
        neural.stdpWeightSummary.length
      : 0;

  return (
    <div
      data-ocid="experiment.panel"
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "oklch(0.065 0.01 265)" }}
    >
      {/* ── End Session Button ── */}
      <div
        className="shrink-0 px-3 py-2 border-b"
        style={{ borderColor: "oklch(0.2 0.05 255)" }}
      >
        <button
          type="button"
          data-ocid="experiment.end_session_button"
          onClick={handleEndSession}
          className="w-full font-mono text-[9px] tracking-widest uppercase py-2 transition-all flex items-center justify-center gap-2"
          style={{
            border: "1px solid oklch(0.62 0.22 195)",
            background: "oklch(0.62 0.22 195 / 0.1)",
            color: "oklch(0.78 0.2 195)",
            boxShadow: "0 0 12px oklch(0.62 0.22 195 / 0.2)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "oklch(0.62 0.22 195 / 0.25)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 20px oklch(0.62 0.22 195 / 0.35)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "oklch(0.62 0.22 195 / 0.1)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 12px oklch(0.62 0.22 195 / 0.2)";
          }}
        >
          <span style={{ fontSize: "0.75rem" }}>◈</span>
          END SESSION · GENERATE REPORT
        </button>
      </div>

      {/* Session report modal */}
      {sessionReport && (
        <SessionReportModal
          report={sessionReport}
          onClose={() => setSessionReport(null)}
        />
      )}

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* ─── SECTION A: Avatar Behavior Monitor ─── */}
        <div
          className="flex flex-col border-r"
          style={{
            width: "45%",
            borderColor: "oklch(0.18 0.05 255)",
            overflow: "hidden",
          }}
        >
          <div
            className="px-3 py-1 border-b shrink-0 flex items-center justify-between"
            style={{ borderColor: "oklch(0.18 0.04 255)" }}
          >
            <span
              className="font-mono text-[9px] tracking-widest uppercase"
              style={{ color: "oklch(0.38 0.06 220)" }}
            >
              ▸ AVATAR BEHAVIOR MONITOR
            </span>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col px-3 py-2 gap-2 min-h-0">
            {/* Posture state badge */}
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-[8px] tracking-wider"
                style={{ color: "oklch(0.38 0.05 220)" }}
              >
                STATE:
              </span>
              <span
                className="font-mono text-sm font-bold tracking-widest uppercase"
                style={{
                  color: postureColor,
                  textShadow: `0 0 12px ${postureColor}`,
                }}
              >
                {avatarBehavior.postureState}
              </span>
              <span
                className="font-mono text-[8px] tracking-widest ml-1"
                style={{ color: "oklch(0.38 0.05 220)" }}
              >
                NT:
              </span>
              <span
                className="font-mono text-[9px] font-bold tracking-widest uppercase"
                style={{ color: "oklch(0.72 0.22 195)" }}
              >
                {avatarBehavior.dominantNT.toUpperCase()}
              </span>
            </div>

            {/* Oscilloscope traces */}
            <div className="flex flex-col gap-[5px] flex-1">
              <div
                className="font-mono text-[8px] tracking-widest uppercase mb-1"
                style={{ color: "oklch(0.3 0.04 220)" }}
              >
                Neural State Oscilloscope
              </div>
              <OscilloscopeTrace
                history={hist.motion}
                color="oklch(0.72 0.22 195)"
                label="MOTION"
                currentValue={avatarBehavior.motionLevel}
              />
              <OscilloscopeTrace
                history={hist.valence}
                color={
                  avatarBehavior.emotionValence >= 0
                    ? "oklch(0.82 0.26 55)"
                    : "oklch(0.6 0.2 260)"
                }
                label="VALENCE"
                currentValue={avatarBehavior.emotionValence}
                signed
              />
              <OscilloscopeTrace
                history={hist.attention}
                color="oklch(0.72 0.22 140)"
                label="ATTN"
                currentValue={avatarBehavior.attentionLevel}
              />
              <OscilloscopeTrace
                history={hist.consciousness}
                color="oklch(0.85 0.05 220)"
                label="CONSCI"
                currentValue={avatarBehavior.consciousnessLevel}
              />
            </div>

            {/* Autonomous Drive Readouts */}
            <div
              className="shrink-0 flex flex-col gap-[3px] border-t pt-1"
              style={{ borderColor: "oklch(0.15 0.03 260)" }}
            >
              <div
                className="font-mono text-[7px] tracking-widest uppercase"
                style={{ color: "oklch(0.3 0.04 220)" }}
              >
                Autonomous Drive
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-[7px] shrink-0"
                  style={{ color: "oklch(0.42 0.06 220)", width: "44px" }}
                >
                  HUNGER
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
                      width: `${neural.hungerDrive * 100}%`,
                      background:
                        neural.hungerDrive > 0.8
                          ? "oklch(0.62 0.26 25)"
                          : neural.hungerDrive < 0.2
                            ? "oklch(0.72 0.22 142)"
                            : "oklch(0.78 0.22 55)",
                      transition: "width 0.3s ease, background 0.5s ease",
                    }}
                  />
                </div>
                <span
                  className="font-mono text-[7px] font-bold shrink-0"
                  style={{
                    color:
                      neural.hungerDrive > 0.8
                        ? "oklch(0.62 0.26 25)"
                        : neural.hungerDrive < 0.2
                          ? "oklch(0.72 0.22 142)"
                          : "oklch(0.78 0.22 55)",
                    width: "26px",
                    textAlign: "right",
                  }}
                >
                  {Math.round(neural.hungerDrive * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-[7px] shrink-0"
                  style={{ color: "oklch(0.42 0.06 220)", width: "44px" }}
                >
                  EXPLR T
                </span>
                <span
                  className="font-mono text-[7px] font-bold"
                  style={{ color: "oklch(0.62 0.2 220)" }}
                >
                  {neural.explorationTimer} ticks
                </span>
              </div>
            </div>

            {/* Neural Event Log */}
            <div
              className="border-t pt-2 flex-1 overflow-hidden flex flex-col min-h-0"
              style={{ borderColor: "oklch(0.15 0.03 260)" }}
            >
              <div
                className="font-mono text-[8px] tracking-widest uppercase mb-1 shrink-0"
                style={{ color: "oklch(0.3 0.04 220)" }}
              >
                Neural Event Log
              </div>
              <div className="overflow-y-auto flex flex-col gap-[3px] min-h-0 flex-1">
                {neural.eventLog.length === 0 ? (
                  <div
                    className="font-mono text-[8px]"
                    style={{ color: "oklch(0.25 0.03 220)" }}
                  >
                    No events yet — run simulation
                  </div>
                ) : (
                  neural.eventLog.slice(0, 12).map((evt: NeuralEvent, idx) => (
                    <div
                      key={`${evt.tick}-${evt.region}-${idx}`}
                      className="flex items-start gap-1"
                    >
                      <span
                        className="font-mono text-[7px] shrink-0"
                        style={{ color: "oklch(0.35 0.05 220)", width: "28px" }}
                      >
                        T{evt.tick}
                      </span>
                      <span
                        className="font-mono text-[7px] leading-tight"
                        style={{ color: EVENT_TYPE_COLORS[evt.type] }}
                      >
                        {evt.description}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── SECTION B: Complexity Scaling Lab ─── */}
        <div
          className="flex flex-col border-r"
          style={{
            width: "30%",
            borderColor: "oklch(0.18 0.05 255)",
            overflow: "hidden",
          }}
        >
          <div
            className="px-3 py-1 border-b shrink-0"
            style={{ borderColor: "oklch(0.18 0.04 255)" }}
          >
            <span
              className="font-mono text-[9px] tracking-widest uppercase"
              style={{ color: "oklch(0.38 0.06 220)" }}
            >
              ▸ NEURAL COMPLEXITY SCALE
            </span>
          </div>

          <div className="flex-1 px-3 py-2 flex flex-col gap-3 overflow-y-auto min-h-0">
            {/* Level display */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span
                  className="font-mono text-[8px] tracking-widest"
                  style={{ color: "oklch(0.35 0.05 220)" }}
                >
                  LEVEL
                </span>
                <span
                  className="font-mono font-bold leading-none"
                  style={{
                    fontSize: "2.5rem",
                    color: getScaleColor(neural.complexityLevel),
                    textShadow: `0 0 20px ${getScaleColor(neural.complexityLevel)}`,
                  }}
                >
                  {neural.complexityLevel}
                </span>
              </div>
              <div className="flex flex-col flex-1">
                <span
                  className="font-mono text-[7px] tracking-widest uppercase leading-tight"
                  style={{ color: getScaleColor(neural.complexityLevel) }}
                >
                  {getScaleDescription(neural.complexityLevel)}
                </span>
                <div
                  className="mt-1 h-[3px] w-full"
                  style={{ background: "oklch(0.12 0.02 260)" }}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${(neural.complexityLevel / 10) * 100}%`,
                      background: getScaleColor(neural.complexityLevel),
                      boxShadow: `0 0 6px ${getScaleColor(neural.complexityLevel)}`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-[7px]"
                  style={{ color: "oklch(0.35 0.05 220)" }}
                >
                  PRIMITIVE
                </span>
                <span
                  className="font-mono text-[7px]"
                  style={{ color: "oklch(0.35 0.05 220)" }}
                >
                  HUMAN
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={neural.complexityLevel}
                data-ocid="experiment.complexity_slider"
                onChange={(e) => neural.setComplexity(Number(e.target.value))}
                className="w-full"
                style={{
                  accentColor: getScaleColor(neural.complexityLevel),
                  cursor: "pointer",
                }}
                aria-label="Neural complexity level"
              />
            </div>

            {/* Derived stats */}
            <div
              className="flex flex-col gap-[6px] border rounded-sm p-2"
              style={{
                borderColor: "oklch(0.2 0.05 255)",
                background: "oklch(0.07 0.012 265)",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-[8px]"
                  style={{ color: "oklch(0.4 0.05 220)" }}
                >
                  Effective Neurons
                </span>
                <span
                  className="font-mono text-[9px] font-bold"
                  style={{ color: "oklch(0.72 0.22 195)" }}
                >
                  {formatNeuronCount(neural.complexityLevel)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-[8px]"
                  style={{ color: "oklch(0.4 0.05 220)" }}
                >
                  Connectivity Density
                </span>
                <span
                  className="font-mono text-[9px] font-bold"
                  style={{ color: "oklch(0.72 0.22 140)" }}
                >
                  {neural.complexityLevel * 9 + 10}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-[8px]"
                  style={{ color: "oklch(0.4 0.05 220)" }}
                >
                  Spontaneous Rate
                </span>
                <span
                  className="font-mono text-[9px] font-bold"
                  style={{ color: "oklch(0.78 0.22 55)" }}
                >
                  {(neural.complexityLevel * 0.8 + 0.4).toFixed(1)} Hz
                </span>
              </div>
              <div
                className="border-t pt-2"
                style={{ borderColor: "oklch(0.15 0.03 260)" }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-[8px]"
                    style={{ color: "oklch(0.4 0.05 220)" }}
                  >
                    Active (Sim.)
                  </span>
                  <span
                    className="font-mono text-[9px] font-bold"
                    style={{ color: "oklch(0.72 0.22 310)" }}
                  >
                    {neural.activeNeuronCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Findings mini-panel */}
            {(() => {
              const eb = neural.emergentBehaviors;
              const rows = [
                {
                  label: "HABITUATION",
                  detected: eb.habituationDetected,
                  color: "oklch(0.72 0.22 140)",
                },
                {
                  label: "ASSOC. LEARNING",
                  detected: eb.associativeLearningDetected,
                  color: "oklch(0.82 0.26 80)",
                },
                {
                  label: "GOAL-DIRECTED NAV",
                  detected: eb.goalDirectedNavDetected,
                  color: "oklch(0.72 0.22 195)",
                },
              ];
              return (
                <div
                  data-ocid="experiment.emergence_panel"
                  className="border-t pt-2 flex flex-col gap-2"
                  style={{ borderColor: "oklch(0.25 0.08 80 / 0.5)" }}
                >
                  <div
                    className="font-mono text-[8px] tracking-widest uppercase flex items-center gap-2"
                    style={{ color: "oklch(0.65 0.2 80)" }}
                  >
                    ◈ LIVE FINDINGS
                  </div>
                  {rows.map(({ label, detected, color }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div
                        className="w-[6px] h-[6px] rounded-full shrink-0"
                        style={{
                          background: detected ? color : "oklch(0.28 0.04 255)",
                          boxShadow: detected ? `0 0 6px ${color}` : "none",
                        }}
                      />
                      <span
                        className="font-mono text-[7px] tracking-widest uppercase"
                        style={{
                          color: detected ? color : "oklch(0.35 0.04 220)",
                        }}
                      >
                        {label}
                      </span>
                      {detected && (
                        <span
                          className="font-mono text-[6px] uppercase px-1"
                          style={{
                            background: `${color.replace(")", " / 0.12)")}`,
                            border: `1px solid ${color.replace(")", " / 0.4)")}`,
                            color,
                          }}
                        >
                          DETECTED
                        </span>
                      )}
                    </div>
                  ))}
                  {/* Goal-directed streak */}
                  <div
                    data-ocid="experiment.goal_streak"
                    className="flex items-center gap-2 mt-1"
                  >
                    <span
                      className="font-mono text-[7px] tracking-widest uppercase"
                      style={{ color: "oklch(0.38 0.05 220)" }}
                    >
                      STREAK:
                    </span>
                    <span
                      className="font-mono text-[9px] font-bold tracking-widest"
                      style={{
                        color:
                          goalStreak > 0
                            ? "oklch(0.72 0.22 140)"
                            : "oklch(0.35 0.04 220)",
                        textShadow:
                          goalStreak > 0
                            ? "0 0 8px oklch(0.72 0.22 140 / 0.6)"
                            : "none",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {goalStreak}τ
                    </span>
                    {goalStreak > 0 && (
                      <span
                        className="font-mono text-[6px] uppercase px-1"
                        style={{
                          background: "oklch(0.72 0.22 140 / 0.12)",
                          border: "1px solid oklch(0.72 0.22 140 / 0.4)",
                          color: "oklch(0.72 0.22 140)",
                        }}
                      >
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span
                      className="font-mono text-[7px]"
                      style={{ color: "oklch(0.38 0.05 220)" }}
                    >
                      Plasticity Idx
                    </span>
                    <span
                      className="font-mono text-[8px] font-bold"
                      style={{ color: "oklch(0.72 0.22 310)" }}
                    >
                      {livePlasticityIndex.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="font-mono text-[7px]"
                      style={{ color: "oklch(0.38 0.05 220)" }}
                    >
                      Shannon H
                    </span>
                    <span
                      className="font-mono text-[8px] font-bold"
                      style={{ color: "oklch(0.72 0.22 195)" }}
                    >
                      {liveEntropy.toFixed(3)}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Baseline recording */}
            <div
              className="border-t pt-2 flex flex-col gap-2"
              style={{ borderColor: "oklch(0.15 0.03 260)" }}
            >
              <div
                className="font-mono text-[8px] tracking-widest uppercase"
                style={{ color: "oklch(0.35 0.05 220)" }}
              >
                Baseline Comparison
              </div>
              <button
                type="button"
                data-ocid="experiment.baseline_button"
                onClick={handleRecordBaseline}
                className="font-mono text-[8px] tracking-widest uppercase px-3 py-1 transition-all"
                style={{
                  border: "1px solid oklch(0.5 0.12 195)",
                  background: baselineRecorded
                    ? "oklch(0.72 0.22 195 / 0.15)"
                    : "oklch(0.1 0.015 265)",
                  color: baselineRecorded
                    ? "oklch(0.82 0.18 195)"
                    : "oklch(0.6 0.12 195)",
                }}
              >
                {baselineRecorded
                  ? "↺ RE-RECORD BASELINE"
                  : "◉ RECORD BASELINE"}
              </button>
              {baselineRecorded && baselineDeltas.size > 0 && (
                <div className="flex flex-col gap-1">
                  <div
                    className="font-mono text-[7px] tracking-widest"
                    style={{ color: "oklch(0.3 0.04 220)" }}
                  >
                    Δ from baseline (2s later):
                  </div>
                  {Array.from(baselineDeltas.entries())
                    .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
                    .slice(0, 5)
                    .map(([region, delta]) => (
                      <div key={region} className="flex items-center gap-1">
                        <span
                          className="font-mono text-[7px] truncate"
                          style={{
                            color: "oklch(0.45 0.06 220)",
                            width: "80px",
                          }}
                        >
                          {region
                            .replace(/([A-Z])/g, " $1")
                            .trim()
                            .slice(0, 14)}
                        </span>
                        <span
                          className="font-mono text-[7px] font-bold"
                          style={{
                            color:
                              delta > 0
                                ? "oklch(0.72 0.22 140)"
                                : "oklch(0.68 0.28 25)",
                          }}
                        >
                          {delta >= 0 ? "+" : ""}
                          {(delta * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── SECTION C: Experiment Probes ─── */}
        <div
          className="flex flex-col"
          style={{ width: "25%", overflow: "hidden" }}
        >
          <div
            className="px-3 py-1 border-b shrink-0"
            style={{ borderColor: "oklch(0.18 0.04 255)" }}
          >
            <span
              className="font-mono text-[9px] tracking-widest uppercase"
              style={{ color: "oklch(0.38 0.06 220)" }}
            >
              ▸ EXPERIMENT PROBES
            </span>
          </div>

          <div className="flex-1 px-2 py-2 flex flex-col gap-[4px] overflow-y-auto min-h-0">
            {PROBE_REGIONS.map(({ label, region, scope }) => {
              const lesionActive = activeProbes.has(`${scope}.lesion`);
              const boostActive = activeProbes.has(`${scope}.boost`);

              return (
                <div key={scope} className="flex items-center gap-1">
                  <span
                    className="font-mono text-[7px] tracking-wider shrink-0"
                    style={{ color: "oklch(0.45 0.06 220)", width: "52px" }}
                  >
                    {label}
                  </span>
                  <button
                    type="button"
                    data-ocid={`${scope}_lesion`}
                    onClick={() => handleProbe(scope, region, "lesion")}
                    className="font-mono text-[7px] px-1 py-[2px] flex-1 transition-all"
                    style={{
                      border: "1px solid",
                      borderColor: lesionActive
                        ? "oklch(0.65 0.28 25)"
                        : "oklch(0.3 0.1 25)",
                      background: lesionActive
                        ? "oklch(0.65 0.28 25 / 0.2)"
                        : "oklch(0.1 0.015 265)",
                      color: lesionActive
                        ? "oklch(0.82 0.18 25)"
                        : "oklch(0.55 0.15 25)",
                    }}
                  >
                    LESION
                  </button>
                  <button
                    type="button"
                    data-ocid={`${scope}_boost`}
                    onClick={() => handleProbe(scope, region, "boost")}
                    className="font-mono text-[7px] px-1 py-[2px] flex-1 transition-all"
                    style={{
                      border: "1px solid",
                      borderColor: boostActive
                        ? "oklch(0.72 0.22 140)"
                        : "oklch(0.3 0.1 140)",
                      background: boostActive
                        ? "oklch(0.72 0.22 140 / 0.2)"
                        : "oklch(0.1 0.015 265)",
                      color: boostActive
                        ? "oklch(0.82 0.18 140)"
                        : "oklch(0.55 0.15 140)",
                    }}
                  >
                    BOOST
                  </button>
                </div>
              );
            })}

            {/* Cascade burst */}
            <div
              className="border-t pt-2 mt-1 flex flex-col gap-1"
              style={{ borderColor: "oklch(0.15 0.03 260)" }}
            >
              <button
                type="button"
                data-ocid="experiment.cascade_button"
                onClick={handleCascade}
                className="font-mono text-[8px] tracking-widest uppercase py-2 transition-all"
                style={{
                  border: "1px solid oklch(0.6 0.25 310)",
                  background: "oklch(0.6 0.25 310 / 0.1)",
                  color: "oklch(0.78 0.22 310)",
                  boxShadow: "0 0 8px oklch(0.6 0.25 310 / 0.3)",
                }}
              >
                ⚡ CASCADE BURST
              </button>
            </div>

            {/* NT readouts */}
            <div
              className="border-t pt-2 mt-1"
              style={{ borderColor: "oklch(0.15 0.03 260)" }}
            >
              <div
                className="font-mono text-[7px] tracking-widest uppercase mb-1"
                style={{ color: "oklch(0.3 0.04 220)" }}
              >
                Live NT Levels
              </div>
              {(
                [
                  [
                    "DA",
                    neural.neurotransmitters.dopamine,
                    "oklch(0.82 0.26 55)",
                  ],
                  [
                    "5HT",
                    neural.neurotransmitters.serotonin,
                    "oklch(0.72 0.22 140)",
                  ],
                  [
                    "NE",
                    neural.neurotransmitters.norepinephrine,
                    "oklch(0.68 0.28 25)",
                  ],
                  [
                    "GABA",
                    neural.neurotransmitters.gaba,
                    "oklch(0.62 0.2 270)",
                  ],
                  [
                    "GLU",
                    neural.neurotransmitters.glutamate,
                    "oklch(0.78 0.22 80)",
                  ],
                  [
                    "ACh",
                    neural.neurotransmitters.acetylcholine,
                    "oklch(0.72 0.22 195)",
                  ],
                ] as [string, number, string][]
              ).map(([abbrev, value, color]) => (
                <div key={abbrev} className="flex items-center gap-1 mb-[2px]">
                  <span
                    className="font-mono text-[7px] font-bold shrink-0"
                    style={{ color, width: "28px" }}
                  >
                    {abbrev}
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
                        width: `${value * 100}%`,
                        background: color,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <span
                    className="font-mono text-[7px] shrink-0"
                    style={{ color, width: "22px", textAlign: "right" }}
                  >
                    {Math.round(value * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
