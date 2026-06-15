import { useLawsRegistryState, useRLEngineState } from "../hooks/useQueries";

const C = {
  bg: "oklch(0.06 0.01 265)",
  card: "oklch(0.085 0.015 265)",
  deep: "oklch(0.042 0.008 265)",
  border: "oklch(0.18 0.05 255)",
  borderDim: "oklch(0.14 0.03 255)",
  cyan: "oklch(0.72 0.22 195)",
  green: "oklch(0.68 0.28 140)",
  yellow: "oklch(0.78 0.22 80)",
  red: "oklch(0.65 0.25 25)",
  purple: "oklch(0.65 0.2 285)",
  dim: "oklch(0.38 0.05 220)",
  mid: "oklch(0.55 0.1 210)",
  bright: "oklch(0.85 0.06 210)",
  gold: "oklch(0.82 0.22 80)",
};

const DRIVE_LABELS = [
  "Drive-0 · Coherence",
  "Drive-1 · Drift Ctrl",
  "Drive-2 · Free Energy",
  "Drive-3 · Memory",
  "Drive-4 · Regulation",
];

function QBar({ label, value }: { label: string; value: number }) {
  // Q-values range -1 to +1
  const norm = Math.min(1, Math.max(-1, value));
  const pct = ((norm + 1) / 2) * 100; // map -1..+1 to 0..100%
  const color = norm > 0.3 ? C.green : norm > -0.3 ? C.cyan : C.red;
  return (
    <div className="mb-1.5">
      <div className="flex items-center justify-between mb-0.5">
        <span className="font-mono text-[9px]" style={{ color: C.dim }}>
          {label}
        </span>
        <span className="font-mono text-[10px] font-bold" style={{ color }}>
          {norm >= 0 ? "+" : ""}
          {norm.toFixed(4)}
        </span>
      </div>
      <div
        className="h-2 rounded-sm relative"
        style={{ background: "oklch(0.12 0.03 250)" }}
      >
        {/* Center line */}
        <div
          className="absolute top-0 bottom-0 w-px"
          style={{ left: "50%", background: `${C.dim}60` }}
        />
        {norm >= 0 ? (
          <div
            className="absolute top-0 bottom-0 rounded-sm transition-all duration-700"
            style={{
              left: "50%",
              width: `${pct - 50}%`,
              background: color,
              boxShadow: `0 0 5px ${color}60`,
            }}
          />
        ) : (
          <div
            className="absolute top-0 bottom-0 rounded-sm transition-all duration-700"
            style={{
              right: `${100 - pct}%`,
              width: `${50 - pct}%`,
              background: color,
              boxShadow: `0 0 5px ${color}60`,
            }}
          />
        )}
      </div>
    </div>
  );
}

function RewardSparkline({ history }: { history: number[] }) {
  const W = 340;
  const H = 64;
  const PAD = 4;
  const vals = history.length > 0 ? history : Array(20).fill(0);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const last = vals[vals.length - 1] ?? 0;

  const points = vals.map((v, i) => {
    const x = PAD + (i / Math.max(vals.length - 1, 1)) * (W - PAD * 2);
    const y = PAD + ((max - v) / range) * (H - PAD * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;

  // Zero line
  const zeroY = max !== min ? PAD + ((max - 0) / range) * (H - PAD * 2) : H / 2;
  const clampedZeroY = Math.min(H - PAD, Math.max(PAD, zeroY));

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span
          className="font-mono text-[8px] uppercase tracking-widest"
          style={{ color: C.dim }}
        >
          REWARD HISTORY — LAST {vals.length} BEATS
        </span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[8px]" style={{ color: C.dim }}>
            min <span style={{ color: C.red }}>{min.toFixed(4)}</span>
          </span>
          <span className="font-mono text-[8px]" style={{ color: C.dim }}>
            max <span style={{ color: C.green }}>{max.toFixed(4)}</span>
          </span>
          <span className="font-mono text-[8px]" style={{ color: C.dim }}>
            last{" "}
            <span style={{ color: last >= 0 ? C.cyan : C.yellow }}>
              {last.toFixed(4)}
            </span>
          </span>
        </div>
      </div>
      <div
        className="rounded overflow-hidden"
        style={{ background: C.deep, border: `1px solid ${C.borderDim}` }}
        data-ocid="rl_engine.chart_point"
      >
        <svg
          width="100%"
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          aria-label="Reward history sparkline"
        >
          <title>Reward history sparkline</title>
          {/* Zero line */}
          <line
            x1={PAD}
            y1={clampedZeroY}
            x2={W - PAD}
            y2={clampedZeroY}
            stroke={`${C.dim}40`}
            strokeWidth={0.5}
            strokeDasharray="2 3"
          />
          {/* Area fill */}
          {vals.length > 1 && (
            <path
              d={`${pathD} L ${PAD + ((vals.length - 1) / Math.max(vals.length - 1, 1)) * (W - PAD * 2)},${H - PAD} L ${PAD},${H - PAD} Z`}
              fill={`${C.cyan}18`}
            />
          )}
          {/* Line */}
          {vals.length > 1 && (
            <path
              d={pathD}
              fill="none"
              stroke={C.cyan}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 0 3px ${C.cyan}80)` }}
            />
          )}
          {/* Last point dot */}
          {vals.length > 0 && (
            <circle
              cx={W - PAD}
              cy={PAD + ((max - last) / range) * (H - PAD * 2)}
              r={3}
              fill={last >= 0 ? C.green : C.yellow}
              style={{
                filter: `drop-shadow(0 0 4px ${last >= 0 ? C.green : C.yellow})`,
              }}
            />
          )}
        </svg>
      </div>
    </div>
  );
}

export default function RLEnginePanel() {
  const rlQ = useRLEngineState();
  const lawsQ = useLawsRegistryState();
  const rl = rlQ.data;
  const laws = lawsQ.data;

  const qValues = rl?.qValues ?? [0, 0, 0, 0, 0];
  const rewardHistory = rl?.rewardHistory ?? [];
  const lawOutcome = rl?.lawOutcome ?? [];
  const lastReward = rl?.lastReward ?? 0;
  const totalReward = rl?.totalReward ?? 0;
  const pathwayBoost = rl?.pathwayBoost ?? 0;
  const alpha = rl?.alpha ?? 0.1;
  const gamma = rl?.gamma ?? 0.9;

  // Top 5 law correlations by absolute value
  const topLaws = lawOutcome
    .map((v, i) => ({ idx: i, val: v }))
    .sort((a, b) => Math.abs(b.val) - Math.abs(a.val))
    .slice(0, 5);

  return (
    <div data-ocid="rl_engine.panel">
      <div className="flex items-center gap-2 mb-4">
        <span
          className="w-2 h-2 rounded-full"
          style={{
            background: C.green,
            boxShadow: `0 0 6px ${C.green}`,
            animation: "pulse 2s infinite",
          }}
        />
        <h2
          className="font-mono text-[11px] tracking-widest uppercase font-bold"
          style={{ color: C.bright }}
        >
          REINFORCEMENT LEARNING ENGINE
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Q-Values Grid */}
        <div
          className="p-3 rounded"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
          data-ocid="rl_engine.qvalues.panel"
        >
          <p
            className="font-mono text-[8px] uppercase tracking-widest mb-3"
            style={{ color: C.cyan }}
          >
            Q-VALUE DRIVES
          </p>
          <div className="text-center mb-3">
            <div
              className="inline-flex items-center gap-4 font-mono text-[8px] px-3 py-1 rounded"
              style={{
                background: `${C.dim}10`,
                border: `1px solid ${C.dim}30`,
              }}
            >
              <span style={{ color: C.dim }}>
                -1.0 ←<span style={{ color: C.red }}> neg</span>
              </span>
              <span style={{ color: C.dim }}>│</span>
              <span style={{ color: C.dim }}>
                <span style={{ color: C.green }}>pos</span> → +1.0
              </span>
            </div>
          </div>
          {DRIVE_LABELS.map((label, i) => (
            <QBar key={label} label={label} value={qValues[i] ?? 0} />
          ))}
        </div>

        {/* Engine Stats */}
        <div
          className="p-3 rounded"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
          data-ocid="rl_engine.stats.panel"
        >
          <p
            className="font-mono text-[8px] uppercase tracking-widest mb-3"
            style={{ color: C.green }}
          >
            ENGINE STATISTICS
          </p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div
              className="text-center py-2 rounded"
              style={{
                background: lastReward >= 0 ? `${C.green}10` : `${C.red}10`,
                border: `1px solid ${lastReward >= 0 ? C.green : C.red}30`,
              }}
            >
              <p
                className="font-mono text-[7px] uppercase"
                style={{ color: C.dim }}
              >
                Last Reward
              </p>
              <p
                className="font-mono text-[15px] font-bold"
                style={{ color: lastReward >= 0 ? C.green : C.red }}
              >
                {lastReward >= 0 ? "+" : ""}
                {lastReward.toFixed(6)}
              </p>
            </div>
            <div
              className="text-center py-2 rounded"
              style={{
                background: `${C.gold}10`,
                border: `1px solid ${C.gold}30`,
              }}
            >
              <p
                className="font-mono text-[7px] uppercase"
                style={{ color: C.dim }}
              >
                Total Reward
              </p>
              <p
                className="font-mono text-[15px] font-bold"
                style={{ color: C.gold }}
              >
                {totalReward.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Pathway Boost bar */}
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="font-mono text-[9px]" style={{ color: C.dim }}>
                Pathway Boost
              </span>
              <span
                className="font-mono text-[10px] font-bold"
                style={{ color: C.cyan }}
              >
                {(pathwayBoost * 100).toFixed(1)}%
              </span>
            </div>
            <div
              className="h-2 rounded-sm"
              style={{ background: "oklch(0.12 0.03 250)" }}
            >
              <div
                className="h-full rounded-sm transition-all duration-700"
                style={{
                  width: `${Math.min(100, pathwayBoost * 100)}%`,
                  background: C.cyan,
                  boxShadow: `0 0 6px ${C.cyan}60`,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-[9px]">
            <div
              className="flex justify-between px-2 py-1 rounded"
              style={{
                background: `${C.purple}10`,
                border: `1px solid ${C.purple}25`,
              }}
            >
              <span style={{ color: C.dim }}>α (alpha)</span>
              <span style={{ color: C.purple }}>{alpha.toFixed(2)}</span>
            </div>
            <div
              className="flex justify-between px-2 py-1 rounded"
              style={{
                background: `${C.yellow}10`,
                border: `1px solid ${C.yellow}25`,
              }}
            >
              <span style={{ color: C.dim }}>γ (gamma)</span>
              <span style={{ color: C.yellow }}>{gamma.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reward History Sparkline */}
      <div
        className="mt-3 p-3 rounded"
        style={{ background: C.card, border: `1px solid ${C.border}` }}
      >
        <RewardSparkline history={rewardHistory} />
      </div>

      {/* Top Law Correlations */}
      <div
        className="mt-3 p-3 rounded"
        style={{ background: C.card, border: `1px solid ${C.border}` }}
        data-ocid="rl_engine.law_correlations.panel"
      >
        <p
          className="font-mono text-[8px] uppercase tracking-widest mb-3"
          style={{ color: C.yellow }}
        >
          TOP LAW-OUTCOME CORRELATIONS
        </p>
        {topLaws.length === 0 ? (
          <div
            className="text-center py-3"
            data-ocid="rl_engine.law_correlations.empty_state"
          >
            <p className="font-mono text-[9px]" style={{ color: C.dim }}>
              No law outcome data yet — RL engine accumulating...
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {topLaws.map((item, rank) => {
              const color =
                item.val > 0.3
                  ? C.green
                  : item.val > 0
                    ? C.cyan
                    : item.val < -0.3
                      ? C.red
                      : C.yellow;
              return (
                <div
                  key={item.idx}
                  data-ocid={`rl_engine.law_correlations.item.${rank + 1}`}
                  className="flex items-center justify-between px-2 py-1 rounded"
                  style={{
                    background: `${color}08`,
                    border: `1px solid ${color}25`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-[8px] px-1.5 py-0.5 rounded-sm"
                      style={{
                        background: `${color}15`,
                        color,
                        border: `1px solid ${color}40`,
                      }}
                    >
                      #{rank + 1}
                    </span>
                    <span
                      className="font-mono text-[9px]"
                      style={{ color: C.bright }}
                    >
                      Law #{item.idx}
                    </span>
                  </div>
                  <span
                    className="font-mono text-[11px] font-bold"
                    style={{ color }}
                  >
                    {item.val >= 0 ? "+" : ""}
                    {item.val.toFixed(4)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        {laws && (
          <div
            className="mt-2 flex items-center justify-between font-mono text-[8px]"
            style={{ borderTop: `1px solid ${C.borderDim}`, paddingTop: "6px" }}
          >
            <span style={{ color: C.dim }}>
              Total law fires:{" "}
              <span style={{ color: C.cyan }}>
                {Number(laws.totalFires).toLocaleString()}
              </span>
            </span>
            <span style={{ color: C.dim }}>
              Top law idx:{" "}
              <span style={{ color: C.yellow }}>#{Number(laws.topLawIdx)}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
