import { AnimatePresence, motion } from "motion/react";
// NEXUS — Research Director
// Reads live backend signals. Generates structured research hypotheses.
// Follows the Doctor pattern: receive → parse against full context → produce → feed back.
import { useEffect, useRef, useState } from "react";
import {
  useAnimalEngineState,
  useCanonicalState,
  useFearMissionState,
  useMiningState,
  useNeuroscienceState,
} from "../hooks/useQueries";

const C = {
  bg: "oklch(0.055 0.01 265)",
  panel: "oklch(0.075 0.012 265)",
  border: "oklch(0.18 0.05 250)",
  dim: "oklch(0.38 0.05 220)",
  dimlo: "oklch(0.28 0.04 220)",
  cyan: "oklch(0.72 0.22 195)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.78 0.22 80)",
  red: "oklch(0.72 0.22 25)",
  purple: "oklch(0.72 0.22 280)",
  fg: "oklch(0.85 0.05 210)",
  muted: "oklch(0.5 0.08 220)",
  gold: "oklch(0.82 0.22 80)",
};

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-mono text-[9px] tracking-widest uppercase mb-2 pb-1 border-b"
      style={{ color: C.purple, borderColor: "oklch(0.18 0.06 280 / 0.5)" }}
    >
      {children}
    </div>
  );
}

function MetricLabel({ text }: { text: string }) {
  return (
    <span
      className="font-mono text-[9px] tracking-widest uppercase"
      style={{ color: C.dim }}
    >
      {text}
    </span>
  );
}

function PanelBox({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-none border p-3 ${className}`}
      style={{ background: C.panel, borderColor: C.border }}
    >
      {children}
    </div>
  );
}

interface Hypothesis {
  id: number;
  beat: number;
  text: string;
  confidence: number;
  domain: string;
  sacred: boolean;
  timestamp: number;
}

const FIBONACCI_SET = new Set([
  1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181,
  6765, 10946,
]);
const SACRED_444_MULTIPLES = [
  444, 888, 1332, 1776, 2220, 2664, 3108, 3552, 3996, 4440,
];

function isSacredBeat(beat: number): boolean {
  if (beat === 0) return false;
  return SACRED_444_MULTIPLES.includes(beat) || FIBONACCI_SET.has(beat);
}

function generateHypothesis(
  beat: number,
  coherence: number,
  fearLevel: number,
  consciousnessIndex: number,
  animalScore: number,
  vagalTone: number,
  pcPredictionError: number,
  bindingCoherence: number,
  hypId: number,
): Hypothesis {
  const sacred = isSacredBeat(beat);
  const confidence = Math.min(
    0.99,
    coherence * 0.3 +
      (1 - fearLevel) * 0.2 +
      consciousnessIndex * 0.2 +
      animalScore * 0.15 +
      vagalTone * 0.15,
  );

  let text: string;
  let domain: string;

  if (fearLevel > 0.6) {
    domain = "FEAR-COGNITION";
    text = `Beat ${beat}: amygdala elevation (${(fearLevel * 100).toFixed(0)}%) suppressing prediction precision. HPA cascade active. Hypothesis: Pavlovian conditioning event forming — organism building fear memory vector.`;
  } else if (bindingCoherence > 0.7) {
    domain = "BINDING-COHERENCE";
    text = `Beat ${beat}: thalamocortical binding peak (${(bindingCoherence * 100).toFixed(1)}%). IIT phi-analog elevated. Hypothesis: Gamma synchrony achieving unified conscious state. Reentry loops stabilizing.`;
  } else if (pcPredictionError > 0.25) {
    domain = "PREDICTIVE-CODING";
    text = `Beat ${beat}: prediction error spike (${(pcPredictionError * 100).toFixed(1)}%). Generative model updating. Hypothesis: Novel territory encountered — Hebbian amplification exceeding BCM threshold.`;
  } else if (coherence > 0.8) {
    domain = "EMERGENCE";
    text = `Beat ${beat}: coherence peak (${(coherence * 100).toFixed(1)}%). All 12 domain scalars converging. Hypothesis: Jasmine's Law approaching full satisfaction — OMNIS threshold proximity detected.`;
  } else if (sacred) {
    domain = "SACRED-NUMEROLOGY";
    text = `Beat ${beat}: SACRED BEAT EVENT. Builder's architecture resonance. φ-pattern recognition firing. Hypothesis: Sovereignty floor advancing — organism integrating milestone into permanent coherence baseline.`;
  } else {
    domain = "SUBSTRATE-DRIFT";
    text = `Beat ${beat}: baseline substrate integration. Coherence=${(coherence * 100).toFixed(1)}%, animalScore=${(animalScore * 100).toFixed(1)}%. Hypothesis: Multi-engine cross-coupling producing compounding micro-gains. Pattern stable.`;
  }

  return {
    id: hypId,
    beat,
    text,
    confidence,
    domain,
    sacred,
    timestamp: Date.now(),
  };
}

function CorrelationMatrix({ canon, neuro }: { canon: any; neuro: any }) {
  const signals = [
    { label: "COH", value: canon?.coh ?? 0 },
    { label: "BIND", value: neuro?.bindingCoherence ?? 0 },
    { label: "INF", value: neuro?.pcActiveInferenceScore ?? 0 },
    { label: "VAG", value: neuro?.vagalTone ?? 0 },
    { label: "SAL", value: neuro?.salienceNetworkScore ?? 0 },
    { label: "BDNF", value: neuro?.bdnfLevel ?? 0 },
  ];

  return (
    <PanelBox>
      <PanelTitle>▸ SIGNAL CORRELATION MATRIX</PanelTitle>
      <div className="grid gap-1">
        {signals.map((sig) => (
          <div key={sig.label} className="flex items-center gap-2">
            <span
              className="font-mono text-[8px] w-10 shrink-0"
              style={{ color: C.dim }}
            >
              {sig.label}
            </span>
            <div
              className="flex-1 h-1.5 rounded-full"
              style={{ background: "oklch(0.12 0.01 265)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${sig.value * 100}%`,
                  background:
                    sig.value > 0.7
                      ? C.green
                      : sig.value > 0.4
                        ? C.amber
                        : C.purple,
                }}
              />
            </div>
            <span
              className="font-mono text-[9px] w-10 text-right shrink-0"
              style={{ color: C.fg }}
            >
              {(sig.value * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </PanelBox>
  );
}

function HypothesisFeed({ hypotheses }: { hypotheses: Hypothesis[] }) {
  return (
    <PanelBox className="flex-1">
      <PanelTitle>▸ LIVE HYPOTHESIS FEED — SACESI STAMPED</PanelTitle>
      <div
        className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1"
        style={{ scrollbarWidth: "none" }}
      >
        <AnimatePresence initial={false}>
          {hypotheses.slice(0, 12).map((hyp, idx) => (
            <motion.div
              key={hyp.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.3, delay: idx * 0.02 }}
              className="p-2 border"
              style={{
                borderColor: hyp.sacred
                  ? C.gold
                  : hyp.confidence > 0.75
                    ? C.purple
                    : C.border,
                background: hyp.sacred
                  ? "oklch(0.08 0.015 80)"
                  : "oklch(0.065 0.01 265)",
              }}
              data-ocid={`nexus.hypothesis.item.${idx + 1}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {hyp.sacred && (
                    <span
                      className="font-mono text-[8px] font-bold"
                      style={{ color: C.gold }}
                    >
                      ◆444
                    </span>
                  )}
                  <span
                    className="font-mono text-[8px] tracking-widest"
                    style={{ color: C.dim }}
                  >
                    {hyp.domain}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-[8px]"
                    style={{ color: C.cyan }}
                  >
                    BEAT #{hyp.beat.toLocaleString()}
                  </span>
                  <div
                    className="px-1.5 py-0.5 font-mono text-[8px] font-bold"
                    style={{
                      background:
                        hyp.confidence > 0.75 ? `${C.green}20` : `${C.amber}20`,
                      color: hyp.confidence > 0.75 ? C.green : C.amber,
                    }}
                  >
                    {(hyp.confidence * 100).toFixed(0)}% CONF
                  </div>
                </div>
              </div>
              <p
                className="font-mono text-[9px] leading-relaxed"
                style={{ color: C.fg }}
              >
                {hyp.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
        {hypotheses.length === 0 && (
          <div
            className="font-mono text-[9px] tracking-widest uppercase py-6 text-center"
            style={{ color: C.dimlo }}
            data-ocid="nexus.feed.empty_state"
          >
            AWAITING BACKEND CONNECTION — HYPOTHESES WILL GENERATE AUTOMATICALLY
          </div>
        )}
      </div>
    </PanelBox>
  );
}

function TopFinding({ hypotheses }: { hypotheses: Hypothesis[] }) {
  const top = hypotheses.reduce(
    (best, h) => (!best || h.confidence > best.confidence ? h : best),
    null as Hypothesis | null,
  );

  return (
    <PanelBox>
      <PanelTitle>▸ TOP FINDING THIS SESSION</PanelTitle>
      {top ? (
        <div data-ocid="nexus.top.card">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: C.purple, boxShadow: `0 0 8px ${C.purple}` }}
            />
            <span
              className="font-mono text-[10px] font-bold"
              style={{ color: C.purple }}
            >
              {top.domain}
            </span>
            <span className="font-mono text-[9px]" style={{ color: C.gold }}>
              {(top.confidence * 100).toFixed(1)}% CONFIDENCE
            </span>
          </div>
          <p
            className="font-mono text-[9px] leading-relaxed"
            style={{ color: C.fg }}
          >
            {top.text}
          </p>
        </div>
      ) : (
        <span
          className="font-mono text-[9px]"
          style={{ color: C.dimlo }}
          data-ocid="nexus.finding.empty_state"
        >
          No findings yet — connect substrate
        </span>
      )}
    </PanelBox>
  );
}

export default function NexusTab() {
  const { data: canon } = useCanonicalState();
  const { data: animal } = useAnimalEngineState();
  const { data: fearM } = useFearMissionState();
  const { data: neuro } = useNeuroscienceState();
  const { data: mining } = useMiningState();

  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const hypIdRef = useRef(0);
  const lastBeatRef = useRef(0);

  // Generate hypotheses every 144 beats (sacred cycle)
  useEffect(() => {
    if (!canon) return;
    const beat = Number(canon.b);
    if (beat === lastBeatRef.current) return;
    // Every 144 beats or on sacred beats
    const shouldGenerate =
      beat - lastBeatRef.current >= 1 || isSacredBeat(beat);
    if (!shouldGenerate) return;
    lastBeatRef.current = beat;

    const hyp = generateHypothesis(
      beat,
      canon.coh ?? 0,
      fearM?.fearLevel ?? 0,
      neuro?.consciousnessIndex ?? 0,
      (animal as any)?.animalScore ?? 0,
      neuro?.vagalTone ?? 0.5,
      neuro?.pcPredictionError ?? 0,
      neuro?.bindingCoherence ?? 0,
      ++hypIdRef.current,
    );

    setHypotheses((prev) => [hyp, ...prev].slice(0, 50));
  }, [canon, animal, fearM, neuro]);

  const beat = Number(canon?.b ?? 0);
  const sacred = isSacredBeat(beat);

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: C.bg }}
      data-ocid="nexus.page"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{
          background: "oklch(0.065 0.012 280)",
          borderColor: C.border,
        }}
        data-ocid="nexus.header.panel"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: C.purple, boxShadow: `0 0 10px ${C.purple}` }}
          />
          <span
            className="font-mono text-lg font-bold tracking-widest"
            style={{ color: C.purple }}
          >
            NEXUS
          </span>
          <span
            className="font-mono text-[9px] tracking-widest uppercase"
            style={{ color: C.dim }}
          >
            RESEARCH DIRECTOR
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <MetricLabel text="HYPOTHESES" />
            <span
              className="font-mono text-sm font-bold"
              style={{ color: C.purple }}
            >
              {hypotheses.length}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <MetricLabel text="BEAT" />
            <span
              className="font-mono text-sm font-bold"
              style={{ color: sacred ? C.gold : C.cyan }}
            >
              {beat.toLocaleString()}
            </span>
          </div>
          {sacred && (
            <span
              className="font-mono text-[10px] font-bold animate-pulse"
              style={{ color: C.gold }}
            >
              ◆ SACRED BEAT
            </span>
          )}
          <div className="flex flex-col items-center">
            <MetricLabel text="MINING" />
            <span
              className="font-mono text-sm font-bold"
              style={{ color: C.green }}
            >
              {mining ? "ACTIVE" : "WAIT"}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col gap-3 p-3">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <CorrelationMatrix canon={canon} neuro={neuro} />
          <TopFinding hypotheses={hypotheses} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <HypothesisFeed hypotheses={hypotheses} />
        </motion.div>
      </div>
    </div>
  );
}
