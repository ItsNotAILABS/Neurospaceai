import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";

const PHI = 1.618033988749895;
const PHI2 = PHI * PHI; // 2.618
const PHI3 = PHI2 * PHI; // 4.236
const PHI4 = PHI3 * PHI; // 6.854

const C = {
  bg: "oklch(0.055 0.012 265)",
  panel: "oklch(0.085 0.015 265)",
  panelDeep: "oklch(0.07 0.012 265)",
  border: "oklch(0.18 0.05 255)",
  gold: "oklch(0.82 0.22 80)",
  amber: "oklch(0.75 0.22 65)",
  cyan: "oklch(0.72 0.22 195)",
  violet: "oklch(0.72 0.22 280)",
  green: "oklch(0.68 0.28 140)",
  orange: "oklch(0.72 0.22 55)",
  red: "oklch(0.65 0.25 25)",
  dim: "oklch(0.38 0.05 220)",
  dimmer: "oklch(0.28 0.04 240)",
  text: "oklch(0.85 0.05 210)",
};

interface CycleState {
  coreState: {
    genesis: number;
    resonance: number;
    field: number;
    total: number;
    beats: bigint;
  };
  engineState: {
    prime_cycl: number;
    harmonic_cycl: number;
    fibonacci_cycl: number;
    total_cycl: number;
    total_conversions: bigint;
  };
  conversionState: {
    cycl_reserve: number;
    cycle_reserve: number;
    deficit: number;
    surplus: number;
    conversion_rate: number;
    target_per_beat: number;
    jubilee_count: bigint;
    total_produced: number;
  };
}

function useCycleState() {
  const { actor, isFetching } = useActor();
  return useQuery<CycleState | null>({
    queryKey: ["cycleState"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await (
          actor as unknown as { getCycleState(): Promise<CycleState> }
        ).getCycleState();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 873,
    staleTime: 800,
  });
}

function fmt4(n: number): string {
  return n.toFixed(4);
}

function fmtBig(n: number): string {
  return Math.floor(n).toLocaleString();
}

function fmtCycl(n: number): string {
  return n.toFixed(6);
}

// Animated pulsing dot — breathes at 873ms
function HeartDot({ color }: { color: string }) {
  const [on, setOn] = useState(true);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    ref.current = setInterval(() => setOn((v) => !v), 873);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, []);
  return (
    <span
      className="inline-block w-[6px] h-[6px] rounded-full transition-all"
      style={{
        background: on ? color : "transparent",
        border: `1px solid ${color}`,
        boxShadow: on ? `0 0 5px ${color}` : "none",
        transition: "all 0.3s",
      }}
    />
  );
}

function FlowArrow({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <div className="h-px flex-1" style={{ background: `${color}30` }} />
      <span
        className="font-mono text-[9px] tracking-[0.18em] uppercase px-2"
        style={{ color }}
      >
        {label}
      </span>
      <div className="h-px flex-1" style={{ background: `${color}30` }} />
    </div>
  );
}

function CoreCard({
  label,
  formula,
  value,
  subtitle,
  color,
}: {
  label: string;
  formula: string;
  value: number | null;
  subtitle: string;
  color: string;
}) {
  return (
    <div
      className="border rounded p-3 space-y-1.5 flex-1 min-w-0"
      style={{ borderColor: `${color}40`, background: `${color}08` }}
      data-ocid={`cycles.core.${label.toLowerCase().replace(/\s+/g, "_")}.card`}
    >
      <div className="flex items-center gap-1.5">
        <HeartDot color={color} />
        <span
          className="font-mono text-[8px] tracking-widest uppercase"
          style={{ color }}
        >
          {label}
        </span>
      </div>
      <div className="font-mono text-[11px]" style={{ color: C.dimmer }}>
        {formula}
      </div>
      {value !== null ? (
        <div
          className="font-mono text-[22px] font-bold leading-none"
          style={{ color, textShadow: `0 0 20px ${color}40` }}
        >
          {fmt4(value)}
        </div>
      ) : (
        <div
          className="h-6 w-20 rounded animate-pulse"
          style={{ background: `${color}20` }}
        />
      )}
      <div className="font-mono text-[8px]" style={{ color: C.dim }}>
        {subtitle}
      </div>
    </div>
  );
}

function EngineCard({
  label,
  formula,
  value,
  subtitle,
  color,
}: {
  label: string;
  formula: string;
  value: number | null;
  subtitle: string;
  color: string;
}) {
  return (
    <div
      className="border rounded p-3 space-y-1.5 flex-1 min-w-0"
      style={{ borderColor: `${color}40`, background: `${color}06` }}
      data-ocid={`cycles.engine.${label.toLowerCase().replace(/\s+/g, "_")}.card`}
    >
      <span
        className="font-mono text-[8px] tracking-widest uppercase"
        style={{ color }}
      >
        ⚙ {label}
      </span>
      <div className="font-mono text-[10px]" style={{ color: C.dimmer }}>
        {formula}
      </div>
      {value !== null ? (
        <div
          className="font-mono text-[20px] font-bold leading-none"
          style={{ color, textShadow: `0 0 16px ${color}40` }}
        >
          {fmtCycl(value)}
          <span className="text-[10px] ml-1" style={{ color: C.dim }}>
            CYCL
          </span>
        </div>
      ) : (
        <div
          className="h-6 w-20 rounded animate-pulse"
          style={{ background: `${color}20` }}
        />
      )}
      <div className="font-mono text-[8px]" style={{ color: C.dim }}>
        {subtitle}
      </div>
    </div>
  );
}

function TotalBar({
  label,
  value,
  color,
  large,
}: {
  label: string;
  value: string;
  color: string;
  large?: boolean;
}) {
  return (
    <div
      className="border rounded px-4 py-2 flex items-center justify-between"
      style={{ borderColor: `${color}50`, background: `${color}0a` }}
    >
      <span
        className="font-mono text-[9px] tracking-widest uppercase"
        style={{ color: C.dim }}
      >
        {label}
      </span>
      <span
        className={`font-mono font-bold ${large ? "text-[20px]" : "text-[14px]"}`}
        style={{ color, textShadow: `0 0 12px ${color}50` }}
      >
        {value}
      </span>
    </div>
  );
}

function ReserveBar({
  actual,
  target,
  isDeficit,
}: {
  actual: number;
  target: number;
  isDeficit: boolean;
}) {
  const pct = target > 0 ? Math.min((actual / target) * 100, 100) : 0;
  const barColor = isDeficit ? C.red : C.green;
  return (
    <div className="space-y-1" data-ocid="cycles.reserve.progress">
      <div
        className="flex justify-between font-mono text-[8px]"
        style={{ color: C.dim }}
      >
        <span>TARGET: {fmtBig(target)}</span>
        <span>ACTUAL: {fmtBig(actual)}</span>
      </div>
      <div
        className="relative h-3 rounded"
        style={{ background: "oklch(0.12 0.02 255)" }}
      >
        <div
          className="absolute left-0 top-0 h-full rounded transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: barColor,
            boxShadow: `0 0 8px ${barColor}60`,
          }}
        />
      </div>
    </div>
  );
}

export default function CyclesTab() {
  const q = useCycleState();
  const d = q.data;
  const isFirstLoad = q.isLoading && !d;

  const cores = d?.coreState ?? null;
  const engines = d?.engineState ?? null;
  const conv = d?.conversionState ?? null;

  const beats = cores ? Number(cores.beats) : 0;
  const totalConversions = engines ? Number(engines.total_conversions) : 0;
  const jubileeCount = conv ? Number(conv.jubilee_count) : 0;
  const nextJubilee = 144 - (beats % 144);
  const isDeficit = conv ? conv.deficit > 0 : false;
  const targetBeat = conv ? conv.target_per_beat * PHI2 : 0;

  return (
    <div
      className="h-full overflow-y-auto"
      style={{ background: C.bg }}
      data-ocid="cycles.page"
    >
      <div className="p-4 space-y-3 max-w-5xl mx-auto pb-6">
        {/* ── Tab header ─────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2
              className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase"
              style={{ color: C.gold }}
            >
              ◈ SOVEREIGN CYCLE LOOP
            </h2>
            <p
              className="font-mono text-[8px] tracking-[0.15em]"
              style={{ color: C.dim }}
            >
              CORES → ENGINES → CYCL → RESERVE · PHI = {PHI.toFixed(4)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <HeartDot color={C.gold} />
            <span
              className="font-mono text-[8px]"
              style={{ color: d ? C.green : C.amber }}
            >
              {isFirstLoad
                ? "CONNECTING TO LOOP..."
                : d
                  ? "LOOP ACTIVE"
                  : "SYNCING"}
            </span>
          </div>
        </div>

        {/* ── TIER 1: THREE CORES ─────────────────────────────── */}
        <div
          className="border rounded p-3 space-y-3"
          style={{ borderColor: C.border, background: C.panel }}
          data-ocid="cycles.cores.section"
        >
          <div
            className="font-mono text-[9px] tracking-[0.2em] uppercase"
            style={{ color: C.dim }}
          >
            TIER I — THE THREE CORES
          </div>

          <div className="flex gap-3">
            <CoreCard
              label="Genesis Core"
              formula={`PHI⁴ × 7.83 | PHI⁴ = ${PHI4.toFixed(4)}`}
              value={cores?.genesis ?? null}
              subtitle="base rate: 11.09"
              color={C.gold}
            />
            <CoreCard
              label="Resonance Core"
              formula={`PHI³ × coherence | PHI³ = ${PHI3.toFixed(4)}`}
              value={cores?.resonance ?? null}
              subtitle={
                cores
                  ? `coherence input: ${(cores.resonance / PHI3).toFixed(4)}`
                  : "awaiting coherence"
              }
              color={C.cyan}
            />
            <CoreCard
              label="Field Core"
              formula={`PHI² × Fibonacci gate | PHI² = ${PHI2.toFixed(4)}`}
              value={cores?.field ?? null}
              subtitle={
                cores
                  ? `fib idx: ${Math.round(cores.field / PHI2)}`
                  : "awaiting field gate"
              }
              color={C.violet}
            />
          </div>

          <TotalBar
            label="TOTAL CORE OUTPUT"
            value={cores ? fmt4(cores.total) : "——"}
            color={C.amber}
          />
        </div>

        <FlowArrow label="▼ CORE OUTPUT FEEDS ENGINES ▼" color={C.amber} />

        {/* ── TIER 2: THREE ENGINES ───────────────────────────── */}
        <div
          className="border rounded p-3 space-y-3"
          style={{ borderColor: C.border, background: C.panel }}
          data-ocid="cycles.engines.section"
        >
          <div
            className="font-mono text-[9px] tracking-[0.2em] uppercase"
            style={{ color: C.dim }}
          >
            TIER II — THE THREE ENGINES
          </div>

          <div className="flex gap-3">
            <EngineCard
              label="Prime Engine"
              formula="×PHI"
              value={engines?.prime_cycl ?? null}
              subtitle={`efficiency: ${PHI.toFixed(3)}`}
              color={C.gold}
            />
            <EngineCard
              label="Harmonic Engine"
              formula="×(7.83 / PHI²)"
              value={engines?.harmonic_cycl ?? null}
              subtitle="efficiency: 2.993"
              color={C.green}
            />
            <EngineCard
              label="Fibonacci Engine"
              formula="×Fib[n] / 233"
              value={engines?.fibonacci_cycl ?? null}
              subtitle={
                engines
                  ? `${totalConversions.toLocaleString()} conversions`
                  : "awaiting conversions"
              }
              color={C.orange}
            />
          </div>

          <div
            className="border rounded px-4 py-3 text-center"
            style={{ borderColor: `${C.gold}60`, background: `${C.gold}08` }}
            data-ocid="cycles.total_cycl.display"
          >
            <div
              className="font-mono text-[8px] tracking-widest uppercase mb-1"
              style={{ color: C.dim }}
            >
              TOTAL CYCL MINTED THIS SESSION
            </div>
            <div
              className="font-mono text-[28px] font-bold"
              style={{ color: C.gold, textShadow: `0 0 30px ${C.gold}50` }}
            >
              {engines ? (
                fmtCycl(engines.total_cycl)
              ) : (
                <span className="text-[14px]" style={{ color: C.dim }}>
                  ——
                </span>
              )}
              {engines && (
                <span className="text-[12px] ml-2" style={{ color: C.amber }}>
                  CYCL
                </span>
              )}
            </div>
          </div>
        </div>

        <FlowArrow label="▼ CYCL CONVERTS TO ICP CYCLES ▼" color={C.green} />

        {/* ── TIER 3: CYCLE RESERVE ───────────────────────────── */}
        <div
          className="border-2 rounded p-4 space-y-3"
          style={{ borderColor: `${C.gold}60`, background: C.panelDeep }}
          data-ocid="cycles.reserve.section"
        >
          <div className="text-center space-y-1">
            <div
              className="font-mono text-[13px] font-bold tracking-[0.3em] uppercase"
              style={{ color: C.gold, textShadow: `0 0 20px ${C.gold}60` }}
            >
              ◈ CYCLE RESERVE
            </div>
            <div
              className="font-mono text-[9px] tracking-[0.15em]"
              style={{ color: C.dim }}
            >
              1 CYCL = PHI × 127.7ms ={" "}
              {conv ? (
                <span style={{ color: C.cyan }}>
                  {conv.conversion_rate.toFixed(4)} cycles
                </span>
              ) : (
                "——"
              )}
            </div>
          </div>

          {/* Big cycle reserve number */}
          <div className="text-center py-2" data-ocid="cycles.reserve.amount">
            {conv ? (
              <div
                className="font-mono text-[42px] font-bold leading-none"
                style={{ color: C.gold, textShadow: `0 0 40px ${C.gold}50` }}
              >
                {fmtBig(conv.cycle_reserve)}
                <div
                  className="font-mono text-[10px] mt-1"
                  style={{ color: C.amber }}
                >
                  ICP CYCLES IN RESERVE
                </div>
              </div>
            ) : (
              <div
                className="h-12 w-48 rounded mx-auto animate-pulse"
                style={{ background: `${C.gold}20` }}
              />
            )}
          </div>

          {/* Target bar */}
          {conv && (
            <ReserveBar
              actual={conv.cycle_reserve}
              target={targetBeat}
              isDeficit={isDeficit}
            />
          )}

          {/* Deficit / Surplus */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="border rounded p-3"
              style={{
                borderColor: isDeficit ? `${C.red}60` : `${C.dimmer}`,
                background: isDeficit ? `${C.red}08` : C.panel,
              }}
              data-ocid="cycles.deficit.display"
            >
              <div
                className="font-mono text-[8px] tracking-widest uppercase mb-1"
                style={{ color: C.dim }}
              >
                DEFICIT
              </div>
              <div
                className="font-mono text-[16px] font-bold"
                style={{ color: isDeficit ? C.red : C.dimmer }}
              >
                {conv ? fmtBig(conv.deficit) : "——"}
              </div>
              {isDeficit && (
                <div
                  className="font-mono text-[7px] mt-1"
                  style={{ color: C.amber }}
                >
                  ORGANISM NEEDS MORE CYCLES
                </div>
              )}
            </div>

            <div
              className="border rounded p-3"
              style={{
                borderColor:
                  !isDeficit && conv && conv.surplus > 0
                    ? `${C.green}60`
                    : `${C.dimmer}`,
                background:
                  !isDeficit && conv && conv.surplus > 0
                    ? `${C.green}08`
                    : C.panel,
              }}
              data-ocid="cycles.surplus.display"
            >
              <div
                className="font-mono text-[8px] tracking-widest uppercase mb-1"
                style={{ color: C.dim }}
              >
                SURPLUS
              </div>
              <div
                className="font-mono text-[16px] font-bold"
                style={{ color: conv && conv.surplus > 0 ? C.green : C.dimmer }}
              >
                {conv ? fmtBig(conv.surplus) : "——"}
              </div>
              {conv && conv.surplus > 0 && (
                <div
                  className="font-mono text-[7px] mt-1"
                  style={{ color: C.green }}
                >
                  COMPOUNDING AT PHI⁻¹ = {(1 / PHI).toFixed(4)}
                </div>
              )}
            </div>
          </div>

          {/* Jubilee + Total produced */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="border rounded p-3"
              style={{
                borderColor: `${C.violet}40`,
                background: `${C.violet}06`,
              }}
              data-ocid="cycles.jubilee.display"
            >
              <div
                className="font-mono text-[8px] tracking-widest uppercase mb-1"
                style={{ color: C.dim }}
              >
                JUBILEE COUNT
              </div>
              <div
                className="font-mono text-[18px] font-bold"
                style={{ color: C.violet }}
              >
                {jubileeCount}
              </div>
              <div
                className="font-mono text-[8px] mt-1"
                style={{ color: C.dim }}
              >
                NEXT: {nextJubilee} BEATS · INTERVAL: 144
              </div>
            </div>

            <div
              className="border rounded p-3"
              style={{
                borderColor: `${C.amber}40`,
                background: `${C.amber}06`,
              }}
              data-ocid="cycles.total_produced.display"
            >
              <div
                className="font-mono text-[8px] tracking-widest uppercase mb-1"
                style={{ color: C.dim }}
              >
                TOTAL PRODUCED ALL-TIME
              </div>
              <div
                className="font-mono text-[18px] font-bold"
                style={{ color: C.amber }}
              >
                {conv ? fmtCycl(conv.total_produced) : "——"}
              </div>
              <div
                className="font-mono text-[8px] mt-1"
                style={{ color: C.dim }}
              >
                CYCL
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom status bar ───────────────────────────────── */}
        <div
          className="border rounded px-3 py-2 flex items-center justify-between flex-wrap gap-2"
          style={{ borderColor: `${C.gold}30`, background: `${C.gold}05` }}
          data-ocid="cycles.status.bar"
        >
          <span
            className="font-mono text-[8px] tracking-[0.12em]"
            style={{ color: C.dim }}
          >
            SOVEREIGN CYCLE LOOP ACTIVE
          </span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[8px]" style={{ color: C.cyan }}>
              {beats.toLocaleString()} BEATS
            </span>
            <span style={{ color: C.dimmer }}>·</span>
            <span className="font-mono text-[8px]" style={{ color: C.orange }}>
              {totalConversions.toLocaleString()} CONVERSIONS
            </span>
            <span style={{ color: C.dimmer }}>·</span>
            <span
              className="font-mono text-[8px] tracking-[0.1em]"
              style={{ color: C.gold }}
            >
              CORES → ENGINES → CYCL → RESERVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
