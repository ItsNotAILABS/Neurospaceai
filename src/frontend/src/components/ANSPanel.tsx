// ANS / Interoceptive Regulation Panel
// Displays live autonomic nervous system state for the running simulation.

import type { NeuralEvent } from "../hooks/useNeuralSimulation";
import type { ANSState } from "../utils/ansLayer";

interface ANSPanelProps {
  ansState: ANSState;
  events: NeuralEvent[];
}

function MetricBar({
  label,
  value,
  color,
  rightLabel,
}: {
  label: string;
  value: number;
  color: string;
  rightLabel?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div className="mb-1.5">
      <div className="flex justify-between items-center mb-0.5">
        <span
          className="font-mono text-[7px] tracking-widest uppercase"
          style={{ color: "oklch(0.45 0.06 220)" }}
        >
          {label}
        </span>
        <span className="font-mono text-[7px] font-bold" style={{ color }}>
          {rightLabel ?? `${pct}%`}
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
    </div>
  );
}

function BipolarBar({ label, value }: { label: string; value: number }) {
  const clamped = Math.max(-1, Math.min(1, value));
  const isSymp = clamped > 0;
  const pct = Math.abs(clamped) * 50;
  const barColor = isSymp ? "oklch(0.72 0.28 25)" : "oklch(0.72 0.24 145)";

  return (
    <div className="mb-1.5">
      <div className="flex justify-between items-center mb-0.5">
        <span
          className="font-mono text-[6px] tracking-wider uppercase"
          style={{ color: "oklch(0.38 0.05 220)" }}
        >
          Sympathetic
        </span>
        <span
          className="font-mono text-[7px] tracking-widest uppercase"
          style={{ color: "oklch(0.45 0.06 220)" }}
        >
          {label}
        </span>
        <span
          className="font-mono text-[6px] tracking-wider uppercase"
          style={{ color: "oklch(0.38 0.05 220)" }}
        >
          Parasympathetic
        </span>
      </div>
      <div
        className="w-full relative rounded-sm"
        style={{ height: 4, background: "oklch(0.14 0.03 260)" }}
      >
        {/* Center marker */}
        <div
          className="absolute top-0 bottom-0"
          style={{
            left: "50%",
            width: 1,
            background: "oklch(0.28 0.05 220)",
            transform: "translateX(-50%)",
          }}
        />
        {/* Bar from center toward dominant side */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            ...(isSymp
              ? { right: `${50 - pct}%`, left: "50%" }
              : { left: `${50 - pct}%`, right: "50%" }),
            background: barColor,
            borderRadius: 2,
            transition: "all 0.4s ease",
          }}
        />
      </div>
      <div className="flex justify-between mt-0.5">
        <span
          className="font-mono text-[6px]"
          style={{ color: "oklch(0.72 0.28 25)" }}
        >
          {clamped < 0 ? `${Math.round(Math.abs(clamped) * 100)}%` : ""}
        </span>
        <span
          className="font-mono text-[7px] font-bold"
          style={{ color: barColor }}
        >
          {clamped.toFixed(2)}
        </span>
        <span
          className="font-mono text-[6px]"
          style={{ color: "oklch(0.72 0.24 145)" }}
        >
          {clamped > 0 ? `${Math.round(Math.abs(clamped) * 100)}%` : ""}
        </span>
      </div>
    </div>
  );
}

export function ANSPanel({ ansState, events }: ANSPanelProps) {
  const hrColor =
    ansState.heartRateProxy < 80
      ? "oklch(0.72 0.22 145)"
      : ansState.heartRateProxy < 120
        ? "oklch(0.82 0.22 65)"
        : "oklch(0.72 0.28 25)";

  const ansEvents = events
    .filter(
      (e) =>
        e.description.includes("REGULATION_POSITIVE") ||
        e.description.includes("STRESS_PEAK") ||
        e.description.includes("AUTONOMIC_BALANCE_RESTORED") ||
        e.description.includes("[ANS]"),
    )
    .slice(0, 5);

  return (
    <div
      data-ocid="ans.panel"
      className="shrink-0 border-t"
      style={{
        borderColor: "oklch(0.18 0.04 255)",
        background: "oklch(0.055 0.012 265)",
      }}
    >
      {/* Header */}
      <div
        className="px-3 py-1 flex items-center gap-2 border-b"
        style={{ borderColor: "oklch(0.16 0.04 255)" }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background:
              ansState.stressSignal > 0.6
                ? "oklch(0.72 0.28 25)"
                : "oklch(0.72 0.22 145)",
            boxShadow:
              ansState.stressSignal > 0.6
                ? "0 0 4px oklch(0.72 0.28 25)"
                : "0 0 3px oklch(0.72 0.22 145 / 0.5)",
          }}
        />
        <span
          className="font-mono text-[8px] tracking-widest uppercase font-bold"
          style={{ color: "oklch(0.55 0.12 195)" }}
        >
          ANS · Interoceptive Layer
        </span>
        <span
          className="font-mono text-[7px] ml-auto"
          style={{ color: "oklch(0.35 0.05 220)" }}
        >
          selfWt: {(ansState.selfStateWeight * 100).toFixed(0)}%
        </span>
      </div>

      <div className="px-3 py-2">
        {/* Heart Rate Proxy */}
        <MetricBar
          label="Heart Rate"
          value={(ansState.heartRateProxy - 60) / 120}
          color={hrColor}
          rightLabel={`${Math.round(ansState.heartRateProxy)} bpm`}
        />

        {/* HRV */}
        <MetricBar
          label="HRV (regulation)"
          value={ansState.hrvProxy}
          color="oklch(0.72 0.22 145)"
        />

        {/* Stress */}
        <MetricBar
          label="Stress Signal"
          value={ansState.stressSignal}
          color={
            ansState.stressSignal > 0.7
              ? "oklch(0.72 0.28 25)"
              : ansState.stressSignal > 0.4
                ? "oklch(0.78 0.24 55)"
                : "oklch(0.65 0.14 195)"
          }
        />

        {/* Recovery */}
        <MetricBar
          label="Recovery Signal"
          value={ansState.recoverySignal}
          color="oklch(0.72 0.22 145)"
        />

        {/* Autonomic Balance — negative = parasympathetic dominant (displayed as right) */}
        <BipolarBar
          label="Autonomic Balance"
          value={-ansState.autonomicBalanceIndex}
        />

        {/* ANS Events feed */}
        {ansEvents.length > 0 && (
          <div
            className="mt-1.5 pt-1.5 border-t"
            style={{ borderColor: "oklch(0.16 0.04 255)" }}
          >
            <span
              className="font-mono text-[7px] tracking-widest uppercase"
              style={{ color: "oklch(0.35 0.05 220)" }}
            >
              Recent ANS Events
            </span>
            <div className="mt-1 space-y-0.5">
              {ansEvents.map((e) => (
                <div
                  key={`${e.tick}-${e.description.slice(0, 20)}`}
                  className="font-mono text-[7px] leading-tight"
                  style={{ color: "oklch(0.55 0.10 195)" }}
                >
                  t{e.tick}: {e.description.replace("[ANS] ", "")}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
