import { useBehavioralEconomicsState } from "../hooks/useQueries";

const C = {
  bg: "oklch(0.06 0.01 265)",
  card: "oklch(0.085 0.015 265)",
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

const MENTAL_DOMAINS = [
  "SOMA",
  "COGNITION",
  "ENERGY",
  "MEMORY",
  "EMOTION",
  "REWARD",
  "THREAT",
  "SOCIAL",
  "TEMPORAL",
  "CREATIVE",
  "SOVEREIGN",
  "GENESIS",
];

function CardTitle({ label, color }: { label: string; color?: string }) {
  return (
    <p
      className="font-mono text-[8px] uppercase tracking-widest mb-2"
      style={{ color: color ?? C.cyan }}
    >
      {label}
    </p>
  );
}

function MetricLine({
  label,
  value,
  color,
}: { label: string; value: string; color?: string }) {
  return (
    <div
      className="flex items-center justify-between py-0.5"
      style={{ borderBottom: `1px solid ${C.borderDim}` }}
    >
      <span className="font-mono text-[9px]" style={{ color: C.dim }}>
        {label}
      </span>
      <span
        className="font-mono text-[10px] font-bold"
        style={{ color: color ?? C.bright }}
      >
        {value}
      </span>
    </div>
  );
}

function MiniBar({
  pct,
  color,
  label,
}: { pct: number; color: string; label: string }) {
  const p = Math.min(100, Math.max(0, pct * 100));
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between">
        <span className="font-mono text-[7px]" style={{ color: C.dim }}>
          {label}
        </span>
        <span className="font-mono text-[7px]" style={{ color }}>
          {p.toFixed(0)}%
        </span>
      </div>
      <div
        className="h-[2px] rounded-full"
        style={{ background: "oklch(0.12 0.03 250)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${p}%`, background: color }}
        />
      </div>
    </div>
  );
}

function FatigueBar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value * 100));
  const color = pct > 70 ? C.red : pct > 40 ? C.yellow : C.green;
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="font-mono text-[9px]" style={{ color: C.dim }}>
          Decision Fatigue
        </span>
        <span className="font-mono text-[10px] font-bold" style={{ color }}>
          {pct.toFixed(1)}%
        </span>
      </div>
      <div
        className="h-2 rounded-sm"
        style={{ background: "oklch(0.12 0.03 250)" }}
      >
        <div
          className="h-full rounded-sm transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: color,
            boxShadow: `0 0 6px ${color}60`,
          }}
        />
      </div>
    </div>
  );
}

export default function BehavioralEconomicsPanel() {
  const beQ = useBehavioralEconomicsState();
  const be = beQ.data;

  const netProspect = be?.netProspect ?? 0;
  const gain = be?.gain ?? 0;
  const loss = be?.loss ?? 0;
  const lossAversion = be?.lossAversion ?? 2.25;
  const discountedValue = be?.discountedValue ?? 0;
  const endowmentReserve = be?.endowmentReserve ?? 0;
  const peakCoherence = be?.peakCoherence ?? 0;
  const peakEndScore = be?.peakEndScore ?? 0;
  const decisionFatigue = be?.decisionFatigue ?? 0;
  const decisionCount = be ? Number(be.decisionCount) : 0;
  const flowState = be?.flowState ?? false;
  const flowBeatCount = be ? Number(be.flowBeatCount) : 0;
  const availabilityBias = be?.availabilityBias ?? 0;
  const mentalAccounts = be?.mentalAccounts ?? Array(12).fill(0);
  const lastCoherence =
    peakEndScore > 0 ? peakEndScore / (peakCoherence + 0.001) : 0;

  return (
    <div data-ocid="behavioral_economics.panel">
      <div className="flex items-center gap-2 mb-4">
        <span
          className="w-2 h-2 rounded-full"
          style={{
            background: C.cyan,
            boxShadow: `0 0 6px ${C.cyan}`,
            animation: "pulse 2s infinite",
          }}
        />
        <h2
          className="font-mono text-[11px] tracking-widest uppercase font-bold"
          style={{ color: C.bright }}
        >
          BEHAVIORAL ECONOMICS ENGINE
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* 1. Prospect Theory */}
        <div
          className="p-3 rounded"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
          data-ocid="behavioral_economics.prospect.card"
        >
          <CardTitle label="PROSPECT THEORY" color={C.green} />
          <div
            className="text-center py-1 mb-2 rounded"
            style={{
              background: netProspect >= 0 ? `${C.green}15` : `${C.red}15`,
              border: `1px solid ${netProspect >= 0 ? C.green : C.red}40`,
            }}
          >
            <span
              className="font-mono text-[18px] font-bold"
              style={{ color: netProspect >= 0 ? C.green : C.red }}
            >
              {netProspect >= 0 ? "+" : ""}
              {netProspect.toFixed(4)}
            </span>
          </div>
          <MetricLine
            label="Gain"
            value={`+${gain.toFixed(4)}`}
            color={C.green}
          />
          <MetricLine
            label="Loss"
            value={`-${Math.abs(loss).toFixed(4)}`}
            color={C.red}
          />
          <MetricLine
            label="Loss Aversion λ"
            value={`${lossAversion.toFixed(2)}×`}
            color={C.yellow}
          />
          <div
            className="mt-2 font-mono text-[7px] text-center"
            style={{
              color: C.dim,
              fontStyle: "italic",
            }}
          >
            L-74: Losses weighted {lossAversion.toFixed(2)}× vs gains
          </div>
        </div>

        {/* 2. Hyperbolic Discounting */}
        <div
          className="p-3 rounded"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
          data-ocid="behavioral_economics.hyperbolic.card"
        >
          <CardTitle label="HYPERBOLIC DISCOUNTING" color={C.cyan} />
          <div className="text-center py-2 mb-2">
            <span
              className="font-mono text-[16px] font-bold"
              style={{ color: C.cyan }}
            >
              {discountedValue.toFixed(6)}
            </span>
          </div>
          <div
            className="font-mono text-[8px] text-center mb-2 px-2 py-1 rounded"
            style={{
              background: `${C.cyan}10`,
              border: `1px solid ${C.cyan}25`,
              color: C.mid,
            }}
          >
            V = x / (1 + k·t)
          </div>
          <MetricLine
            label="Discounted Value"
            value={discountedValue.toFixed(6)}
            color={C.cyan}
          />
          <div
            className="mt-2 font-mono text-[7px] text-center"
            style={{ color: C.dim }}
          >
            Immediate rewards weighted over future
          </div>
        </div>

        {/* 3. Endowment Effect */}
        <div
          className="p-3 rounded"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
          data-ocid="behavioral_economics.endowment.card"
        >
          <CardTitle label="ENDOWMENT EFFECT" color={C.gold} />
          <div className="text-center py-2 mb-2">
            <span
              className="font-mono text-[16px] font-bold"
              style={{ color: C.gold }}
            >
              {endowmentReserve.toFixed(6)}
            </span>
          </div>
          <MetricLine
            label="Reserve"
            value={endowmentReserve.toFixed(6)}
            color={C.gold}
          />
          <MetricLine label="Ownership Factor" value="1.50×" color={C.yellow} />
          <div
            className="mt-2 font-mono text-[7px] text-center"
            style={{ color: C.dim }}
          >
            Creator values owned assets 1.5× more
          </div>
        </div>

        {/* 4. Mental Accounting */}
        <div
          className="p-3 rounded"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
          data-ocid="behavioral_economics.mental_accounts.card"
        >
          <CardTitle label="MENTAL ACCOUNTING" color={C.purple} />
          <div className="space-y-1">
            {MENTAL_DOMAINS.map((domain, i) => {
              const val = mentalAccounts[i] ?? 0;
              const color =
                val > 0.7
                  ? C.green
                  : val > 0.4
                    ? C.cyan
                    : val > 0.2
                      ? C.yellow
                      : C.dim;
              return (
                <MiniBar key={domain} label={domain} pct={val} color={color} />
              );
            })}
          </div>
        </div>

        {/* 5. Peak-End Rule */}
        <div
          className="p-3 rounded"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
          data-ocid="behavioral_economics.peak_end.card"
        >
          <CardTitle label="PEAK-END RULE" color={C.yellow} />
          <div className="flex gap-2 mb-2">
            <div
              className="flex-1 text-center py-1 rounded"
              style={{
                background: `${C.yellow}10`,
                border: `1px solid ${C.yellow}25`,
              }}
            >
              <p
                className="font-mono text-[7px] uppercase"
                style={{ color: C.dim }}
              >
                Peak
              </p>
              <p
                className="font-mono text-[14px] font-bold"
                style={{ color: C.yellow }}
              >
                {peakCoherence.toFixed(3)}
              </p>
            </div>
            <div
              className="flex-1 text-center py-1 rounded"
              style={{
                background: `${C.cyan}10`,
                border: `1px solid ${C.cyan}25`,
              }}
            >
              <p
                className="font-mono text-[7px] uppercase"
                style={{ color: C.dim }}
              >
                Last
              </p>
              <p
                className="font-mono text-[14px] font-bold"
                style={{ color: C.cyan }}
              >
                {lastCoherence.toFixed(3)}
              </p>
            </div>
          </div>
          <MetricLine
            label="Peak-End Score"
            value={peakEndScore.toFixed(4)}
            color={C.yellow}
          />
          <div
            className="mt-2 font-mono text-[7px] text-center"
            style={{ color: C.dim }}
          >
            Score = (Peak + End) / 2
          </div>
        </div>

        {/* 6. Decision Fatigue */}
        <div
          className="p-3 rounded"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
          data-ocid="behavioral_economics.fatigue.card"
        >
          <CardTitle label="DECISION FATIGUE" color={C.red} />
          <div className="mb-3">
            <FatigueBar value={decisionFatigue} />
          </div>
          <MetricLine
            label="Decision Count"
            value={decisionCount.toLocaleString()}
            color={C.bright}
          />
          <MetricLine
            label="Availability Bias"
            value={availabilityBias.toFixed(4)}
            color={C.yellow}
          />
          <div
            className="mt-2 flex items-center gap-2 px-2 py-1 rounded"
            style={{
              background: flowState ? `${C.green}10` : `${C.dim}10`,
              border: `1px solid ${flowState ? C.green : C.dim}30`,
            }}
            data-ocid="behavioral_economics.flow.toggle"
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: flowState ? C.green : C.dim,
                boxShadow: flowState ? `0 0 5px ${C.green}` : "none",
              }}
            />
            <span
              className="font-mono text-[8px]"
              style={{ color: flowState ? C.green : C.dim }}
            >
              {flowState ? "FLOW ACTIVE" : "FLOW DORMANT"}
            </span>
          </div>
        </div>

        {/* 7. Flow State */}
        <div
          className="p-3 rounded"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
          data-ocid="behavioral_economics.flow_state.card"
        >
          <CardTitle label="FLOW STATE" color={flowState ? C.green : C.dim} />
          <div
            className="text-center py-3 mb-2 rounded"
            style={{
              background: flowState ? `${C.green}15` : `${C.dim}08`,
              border: `1px solid ${flowState ? C.green : C.dim}40`,
            }}
          >
            <span
              className="font-mono text-[12px] font-bold tracking-widest"
              style={{
                color: flowState ? C.green : C.dim,
                textShadow: flowState ? `0 0 20px ${C.green}80` : "none",
              }}
            >
              {flowState ? "● FLOW ACTIVE" : "○ DORMANT"}
            </span>
          </div>
          <MetricLine
            label="Flow Beat Count"
            value={flowBeatCount.toLocaleString()}
            color={flowState ? C.green : C.dim}
          />
          <MetricLine
            label="Availability Bias"
            value={availabilityBias.toFixed(4)}
            color={C.yellow}
          />
          <MetricLine
            label="Satisfice Threshold"
            value={(be?.satisficeThresh ?? 0).toFixed(4)}
            color={C.cyan}
          />
          <div
            className="mt-2 font-mono text-[7px] text-center"
            style={{ color: C.dim }}
          >
            Flow: fatigue &lt; 0.3 ∧ coherence &gt; 0.8
          </div>
        </div>
      </div>
    </div>
  );
}
