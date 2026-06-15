// Circuit Motifs Panel — Live 7-motif display
// Shows all neural circuit motif outputs in real time.
// All values are causally active — they change region activations each tick.

import type { CircuitMotifState } from "../utils/circuitMotifs";

interface CircuitMotifsPanelProps {
  state: CircuitMotifState;
}

function MotifBar({
  label,
  value,
  lo = 0,
  hi = 1,
  color,
  effect,
}: {
  label: string;
  value: number;
  lo?: number;
  hi?: number;
  color: string;
  effect: string;
}) {
  const pct = Math.max(
    0,
    Math.min(100, ((value - lo) / Math.max(hi - lo, 0.01)) * 100),
  );
  const displayVal =
    hi - lo <= 1.5 ? `${Math.round(value * 100)}%` : value.toFixed(2);

  return (
    <div className="mb-1">
      <div className="flex justify-between items-center mb-0.5">
        <span
          className="font-mono text-[7px] tracking-widest uppercase"
          style={{ color: "oklch(0.45 0.06 220)" }}
        >
          {label}
        </span>
        <span className="font-mono text-[7px] font-bold" style={{ color }}>
          {displayVal}
        </span>
      </div>
      <div
        className="w-full rounded-sm"
        style={{ height: 3, background: "oklch(0.14 0.03 260)" }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 2,
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <span
        className="font-mono text-[6px] block mt-0.5"
        style={{ color: "oklch(0.32 0.05 220)" }}
      >
        {effect}
      </span>
    </div>
  );
}

export function CircuitMotifsPanel({ state }: CircuitMotifsPanelProps) {
  const bm = state.benchmarks;
  const sal = state.salienceActionBias;
  const pe = state.predictionErrorFeedback;
  const msb = state.memorySalienceBridge;
  const rt = state.regulationThresholds;
  const cs = state.clusterStates;

  const isActive = bm.totalMotifInfluence > 0.3;
  const accentColor = isActive
    ? "oklch(0.72 0.22 145)"
    : "oklch(0.42 0.06 220)";

  // Pick strongest inhibited cluster for display
  const clusterEntries = Object.entries(cs) as Array<
    [string, { winner: string; competitionStrength: number }]
  >;
  const topCluster = clusterEntries.reduce((a, b) =>
    a[1].competitionStrength > b[1].competitionStrength ? a : b,
  );

  return (
    <div
      data-ocid="circuit_motifs.panel"
      className="shrink-0 px-3 py-2 border-t"
      style={{
        borderColor: "oklch(0.18 0.04 255)",
        background: "oklch(0.065 0.015 265)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="font-mono text-[9px] tracking-widest uppercase font-bold"
          style={{ color: accentColor }}
        >
          ⦿ Circuit Motifs
        </span>
        <span
          className="font-mono text-[6px] ml-auto"
          style={{ color: "oklch(0.35 0.05 220)" }}
        >
          7 active motifs · v36
        </span>
      </div>

      {/* Benchmark counters */}
      <div className="flex gap-2 mb-2">
        <div
          className="flex-1 rounded px-1.5 py-1"
          style={{ background: "oklch(0.1 0.02 260)" }}
        >
          <div
            className="font-mono text-[9px] font-bold"
            style={
              bm.recurrenceActiveCount > 10
                ? { color: "oklch(0.72 0.22 145)" }
                : { color: "oklch(0.45 0.06 220)" }
            }
          >
            {bm.recurrenceActiveCount}
          </div>
          <div
            className="font-mono text-[6px] uppercase"
            style={{ color: "oklch(0.35 0.05 220)" }}
          >
            recurr
          </div>
        </div>
        <div
          className="flex-1 rounded px-1.5 py-1"
          style={{ background: "oklch(0.1 0.02 260)" }}
        >
          <div
            className="font-mono text-[9px] font-bold"
            style={
              bm.inhibitionActiveCount > 20
                ? { color: "oklch(0.72 0.28 25)" }
                : { color: "oklch(0.45 0.06 220)" }
            }
          >
            {bm.inhibitionActiveCount}
          </div>
          <div
            className="font-mono text-[6px] uppercase"
            style={{ color: "oklch(0.35 0.05 220)" }}
          >
            suppressed
          </div>
        </div>
        <div
          className="flex-1 rounded px-1.5 py-1"
          style={{ background: "oklch(0.1 0.02 260)" }}
        >
          <div
            className="font-mono text-[9px] font-bold"
            style={{ color: "oklch(0.72 0.2 195)" }}
          >
            {bm.totalMotifInfluence.toFixed(1)}
          </div>
          <div
            className="font-mono text-[6px] uppercase"
            style={{ color: "oklch(0.35 0.05 220)" }}
          >
            totalΣ
          </div>
        </div>
      </div>

      {/* Motif event badge */}
      {bm.motifEventThisTick && (
        <div
          className="font-mono text-[7px] font-bold uppercase tracking-widest rounded px-2 py-0.5 mb-2 inline-block"
          style={{
            background: "oklch(0.18 0.06 60)",
            color: "oklch(0.85 0.22 60)",
          }}
        >
          ⚡ {bm.motifEventThisTick.replace(/_/g, " ")}
        </div>
      )}

      {/* Motif rows — 6 sections */}
      <div className="space-y-0">
        {/* 1+2: Recurrence + Inhibition summary */}
        <div className="mb-2">
          <span
            className="font-mono text-[8px] tracking-widest uppercase font-bold block mb-1"
            style={{ color: "oklch(0.55 0.12 195)" }}
          >
            1·2 · Recurrent + I/E Competition
          </span>
          <MotifBar
            label="Recurrence active"
            value={Math.min(1, bm.recurrenceActiveCount / Math.max(1, 50))}
            color="oklch(0.72 0.22 195)"
            effect="lateral self-reinforcement per active region"
          />
          <MotifBar
            label="Inhibition cascade"
            value={Math.min(1, bm.inhibitionActiveCount / Math.max(1, 60))}
            color="oklch(0.72 0.28 25)"
            effect="bottom 40% suppressed — winner-take-most active"
          />
        </div>

        {/* 3: Microcircuits */}
        <div className="mb-2">
          <span
            className="font-mono text-[8px] tracking-widest uppercase font-bold block mb-1"
            style={{ color: "oklch(0.55 0.12 260)" }}
          >
            3 · Local Microcircuits
          </span>
          <div className="flex gap-1 flex-wrap mb-1">
            {clusterEntries.map(([name, c]) => (
              <div
                key={name}
                className="rounded px-1 py-0.5"
                style={{
                  background:
                    c.competitionStrength > 0.2
                      ? "oklch(0.14 0.04 260)"
                      : "oklch(0.1 0.02 260)",
                  border: `1px solid ${
                    name === topCluster[0] && c.competitionStrength > 0
                      ? "oklch(0.55 0.12 260)"
                      : "oklch(0.18 0.04 260)"
                  }`,
                }}
              >
                <div
                  className="font-mono text-[7px] font-bold uppercase"
                  style={{
                    color:
                      c.competitionStrength > 0.2
                        ? "oklch(0.72 0.18 260)"
                        : "oklch(0.42 0.06 220)",
                  }}
                >
                  {name.slice(0, 3).toUpperCase()}
                </div>
                <div
                  className="font-mono text-[6px]"
                  style={{ color: "oklch(0.35 0.05 220)" }}
                >
                  {c.winner ? c.winner.slice(0, 8).toLowerCase() : "idle"}
                </div>
                <div
                  className="font-mono text-[6px] font-bold"
                  style={{
                    color:
                      c.competitionStrength > 0.2
                        ? "oklch(0.72 0.18 260)"
                        : "oklch(0.35 0.05 220)",
                  }}
                >
                  {Math.round(c.competitionStrength * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4: Salience-action */}
        <div className="mb-2">
          <span
            className="font-mono text-[8px] tracking-widest uppercase font-bold block mb-1"
            style={{ color: "oklch(0.55 0.14 60)" }}
          >
            4 · Salience → Action Bias
          </span>
          <div className="grid grid-cols-5 gap-0.5">
            {(
              [
                ["approach", sal.approach, "oklch(0.72 0.22 145)"],
                ["avoid", sal.avoid, "oklch(0.72 0.28 25)"],
                ["invest.", sal.investigate, "oklch(0.72 0.2 195)"],
                ["pause", sal.pause, "oklch(0.72 0.18 60)"],
                ["retreat", sal.retreat, "oklch(0.62 0.22 15)"],
              ] as [string, number, string][]
            ).map(([label, val, color]) => (
              <div
                key={label}
                className="rounded px-0.5 py-0.5 text-center"
                style={{
                  background: "oklch(0.1 0.02 260)",
                }}
              >
                <div
                  className="font-mono text-[8px] font-bold"
                  style={{ color }}
                >
                  {Math.round(val * 100)}
                </div>
                <div
                  className="font-mono text-[6px] uppercase"
                  style={{ color: "oklch(0.35 0.05 220)" }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5: Prediction-error */}
        <div className="mb-2">
          <span
            className="font-mono text-[8px] tracking-widest uppercase font-bold block mb-1"
            style={{ color: "oklch(0.55 0.12 280)" }}
          >
            5 · Prediction-Error Feedback
          </span>
          <MotifBar
            label="Learning rate mod"
            value={pe.learningRateModulation}
            lo={0.5}
            hi={2.5}
            color={
              pe.learningRateModulation > 1.5
                ? "oklch(0.72 0.22 60)"
                : "oklch(0.55 0.1 220)"
            }
            effect={`×${pe.learningRateModulation.toFixed(2)} on STDP η — surprise=${Math.round(pe.surpriseLevel * 100)}%`}
          />
          <MotifBar
            label="Commit threshold"
            value={pe.actionCommitmentThreshold}
            color="oklch(0.62 0.14 280)"
            effect="salience needed to commit to action"
          />
        </div>

        {/* 6: Memory-salience bridge */}
        <div className="mb-2">
          <span
            className="font-mono text-[8px] tracking-widest uppercase font-bold block mb-1"
            style={{ color: "oklch(0.55 0.14 25)" }}
          >
            6 · Memory → Salience Bridge
          </span>
          <MotifBar
            label="Threat salience boost"
            value={msb.threatSalienceBoost}
            color="oklch(0.72 0.28 25)"
            effect="failure memory amplifies threat salience"
          />
          <MotifBar
            label="Reward salience boost"
            value={msb.rewardSalienceBoost}
            color="oklch(0.72 0.22 145)"
            effect="success memory amplifies reward salience"
          />
          <MotifBar
            label="Action hesitation"
            value={msb.actionHesitationFromMemory}
            color="oklch(0.72 0.18 60)"
            effect="failure × conflict → motor suppression"
          />
        </div>

        {/* 7: Regulation thresholds */}
        <div className="mb-0">
          <span
            className="font-mono text-[8px] tracking-widest uppercase font-bold block mb-1"
            style={{ color: "oklch(0.55 0.12 145)" }}
          >
            7 · Regulation → Thresholds
          </span>
          <div className="grid grid-cols-2 gap-1">
            <MotifBar
              label="Threat trigger θ"
              value={rt.threatTriggerThreshold}
              lo={0.15}
              hi={0.7}
              color={
                rt.threatTriggerThreshold < 0.3
                  ? "oklch(0.72 0.28 25)"
                  : "oklch(0.55 0.1 220)"
              }
              effect="stress lowers, recovery raises"
            />
            <MotifBar
              label="Thought emit θ"
              value={rt.thoughtEmissionThreshold}
              lo={0.5}
              hi={0.85}
              color="oklch(0.62 0.14 280)"
              effect="overload raises bar"
            />
            <MotifBar
              label="Exploration bias"
              value={rt.explorationBias}
              color="oklch(0.72 0.2 195)"
              effect="PNS↑ = more exploration"
            />
            <MotifBar
              label="Caution weight"
              value={rt.cautionWeighting}
              color={
                rt.cautionWeighting > 0.6
                  ? "oklch(0.72 0.28 25)"
                  : "oklch(0.55 0.1 220)"
              }
              effect="instability raises caution"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
