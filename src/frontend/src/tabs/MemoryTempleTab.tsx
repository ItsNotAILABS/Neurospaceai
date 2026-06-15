import {
  useExtendedOrganState,
  useMemoryTempleState,
} from "../hooks/useQueries";

// ── Constants ────────────────────────────────────────────────────────────────
// PHI = 1.6180339887498948 (truncated to float64 precision)
const PHI = 1.618033988749895;

const C = {
  bg: "oklch(0.055 0.012 265)",
  panel: "oklch(0.085 0.015 265)",
  panelDeep: "oklch(0.065 0.012 265)",
  border: "oklch(0.18 0.05 255)",
  borderDim: "oklch(0.13 0.04 255)",
  cyan: "oklch(0.72 0.22 195)",
  cyanDim: "oklch(0.72 0.22 195 / 0.15)",
  purple: "oklch(0.72 0.22 280)",
  purpleDim: "oklch(0.72 0.22 280 / 0.15)",
  gold: "oklch(0.82 0.22 80)",
  goldDim: "oklch(0.82 0.22 80 / 0.15)",
  red: "oklch(0.65 0.25 25)",
  redDim: "oklch(0.65 0.25 25 / 0.15)",
  green: "oklch(0.68 0.28 140)",
  greenDim: "oklch(0.68 0.28 140 / 0.2)",
  dim: "oklch(0.38 0.05 220)",
  dimDeep: "oklch(0.26 0.04 220)",
  text: "oklch(0.85 0.05 210)",
  textDim: "oklch(0.55 0.04 220)",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function attractorStrength(lineageDepth: bigint): number {
  const d = Number(lineageDepth);
  return d * PHI ** d;
}

function biasColor(bias: string): string {
  if (bias === "episodic") return C.cyan;
  if (bias === "semantic") return C.purple;
  if (bias === "doctrine") return C.gold;
  return C.red;
}

function biasLabel(bias: string): string {
  return bias.toUpperCase();
}

function goldIntensity(strength: number, maxStr: number): string {
  if (maxStr <= 0) return C.goldDim;
  const t = Math.min(strength / maxStr, 1);
  const l = 0.15 + t * 0.67; // 0.15 → 0.82
  const c = 0.04 + t * 0.18; // 0.04 → 0.22
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} 80)`;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonBlock({
  h = "h-8",
  w = "w-full",
}: { h?: string; w?: string }) {
  return (
    <div
      className={`${h} ${w} rounded`}
      style={{
        background: "oklch(0.12 0.02 265)",
        animation: "terminal-cursor 1.2s ease-in-out infinite",
      }}
    />
  );
}

// ── Offline State ─────────────────────────────────────────────────────────────
function MemoryOffline() {
  return (
    <div
      className="h-full flex flex-col items-center justify-center gap-3"
      style={{ background: C.bg }}
    >
      <div
        className="font-mono text-[11px] tracking-[0.3em] uppercase font-bold"
        style={{
          color: C.red,
          textShadow: `0 0 12px ${C.red}`,
          animation: "terminal-cursor 1.4s step-end infinite",
        }}
        data-ocid="memory-temple.offline.label"
      >
        ◆ MEMORY FIELD OFFLINE — RECONNECTING
      </div>
      <div
        className="font-mono text-[8px] tracking-[0.2em]"
        style={{ color: C.dim }}
      >
        POLLING AT 873ms · PEDESTAL NETWORK AWAITING
      </div>
    </div>
  );
}

// ── Pedestal Card ─────────────────────────────────────────────────────────────
function PedestalCard({
  id,
  lineageDepth,
  phaseBias,
  active,
  maxStrength,
}: {
  id: bigint;
  lineageDepth: bigint;
  phaseBias: number;
  active: boolean;
  maxStrength: number;
}) {
  const strength = attractorStrength(lineageDepth);
  const accentColor = goldIntensity(strength, maxStrength);

  return (
    <div
      className="relative border rounded p-2.5 space-y-1.5"
      style={{
        borderColor: active ? accentColor : C.borderDim,
        background: C.panelDeep,
        boxShadow: active ? `0 0 8px ${accentColor}30` : "none",
        transition: "border-color 0.4s, box-shadow 0.4s",
      }}
      data-ocid={`memory-temple.pedestal.${id}.card`}
    >
      {/* ID + active pulse */}
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-[8px] tracking-[0.2em]"
          style={{ color: accentColor }}
        >
          PDL-{String(id).padStart(2, "0")}
        </span>
        {active && (
          <span
            className="inline-block w-[6px] h-[6px] rounded-full"
            style={{
              background: C.green,
              boxShadow: `0 0 6px ${C.green}`,
              animation: "terminal-cursor 1.6s ease-in-out infinite",
            }}
          />
        )}
      </div>

      {/* Lineage depth */}
      <div className="space-y-0.5">
        <div
          className="font-mono text-[7px] tracking-[0.15em]"
          style={{ color: C.dimDeep }}
        >
          LINEAGE DEPTH
        </div>
        <div
          className="font-mono text-[9px] font-bold"
          style={{ color: C.gold }}
        >
          {String(lineageDepth)}
        </div>
      </div>

      {/* Phase bias */}
      <div className="space-y-0.5">
        <div
          className="font-mono text-[7px] tracking-[0.15em]"
          style={{ color: C.dimDeep }}
        >
          PHASE BIAS
        </div>
        <div className="font-mono text-[9px]" style={{ color: C.cyan }}>
          {phaseBias.toFixed(4)}
        </div>
      </div>

      {/* Attractor strength */}
      <div className="space-y-0.5">
        <div
          className="font-mono text-[7px] tracking-[0.15em]"
          style={{ color: C.dimDeep }}
        >
          ATTRACTOR
        </div>
        <div
          className="font-mono text-[9px] font-bold"
          style={{ color: accentColor }}
        >
          {strength.toFixed(4)}
        </div>
      </div>

      {/* Strength mini-bar */}
      <div
        className="w-full h-[2px] rounded-full"
        style={{ background: C.borderDim }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min((strength / Math.max(maxStrength, 1)) * 100, 100)}%`,
            background: accentColor,
            boxShadow: `0 0 4px ${accentColor}`,
            transition: "width 0.5s",
          }}
        />
      </div>
    </div>
  );
}

// ── Trace Type Card ───────────────────────────────────────────────────────────
function TraceCard({
  type,
  color,
  borderColor,
  children,
}: {
  type: string;
  color: string;
  borderColor: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="border rounded p-3 space-y-2"
      style={{
        borderColor: C.border,
        borderLeftColor: borderColor,
        borderLeftWidth: "3px",
        background: C.panel,
      }}
      data-ocid={`memory-temple.trace.${type.toLowerCase()}.card`}
    >
      <div
        className="font-mono text-[9px] tracking-[0.2em] font-bold uppercase"
        style={{ color }}
      >
        {type}
      </div>
      {children}
    </div>
  );
}

function StatRow({
  label,
  value,
  color,
}: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <span
        className="font-mono text-[7.5px] tracking-[0.12em]"
        style={{ color: C.dim }}
      >
        {label}
      </span>
      <span
        className="font-mono text-[8.5px] font-bold"
        style={{ color: color ?? C.text }}
      >
        {value}
      </span>
    </div>
  );
}

// ── Retrieval Bias Gauge ──────────────────────────────────────────────────────
function RetrievalBiasDisplay({
  heartCoherence,
  brainCoherence,
  gutCoherence,
  leader,
}: {
  heartCoherence: number;
  brainCoherence: number;
  gutCoherence: number;
  leader: string;
}) {
  const leaderColor = biasColor(leader);
  const gauges = [
    { label: "HEART", value: heartCoherence, color: C.red },
    { label: "BRAIN", value: brainCoherence, color: C.cyan },
    { label: "GUT-BRAIN", value: gutCoherence, color: C.purple },
  ];

  return (
    <div
      className="border rounded p-4 space-y-4"
      style={{
        borderColor: leaderColor,
        background: C.panel,
        transition: "border-color 0.5s",
      }}
      data-ocid="memory-temple.retrieval-bias.display"
    >
      <div className="text-center space-y-1">
        <div
          className="font-mono text-[8px] tracking-[0.2em]"
          style={{ color: C.dim }}
        >
          DOMINANT RETRIEVAL CHANNEL
        </div>
        <div
          className="font-mono text-[20px] font-bold tracking-[0.15em]"
          style={{
            color: leaderColor,
            textShadow: `0 0 20px ${leaderColor}60`,
            transition: "color 0.5s, text-shadow 0.5s",
          }}
        >
          {biasLabel(leader)}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {gauges.map(({ label, value, color }) => (
          <div key={label} className="space-y-1.5 text-center">
            <div
              className="font-mono text-[7px] tracking-[0.15em]"
              style={{ color: C.dim }}
            >
              {label}
            </div>
            <div
              className="relative w-full h-[80px] flex items-end justify-center"
              style={{ background: C.panelDeep, borderRadius: "4px" }}
            >
              <div
                className="w-full absolute bottom-0 rounded-b"
                style={{
                  height: `${value * 100}%`,
                  background: `${color}30`,
                  borderBottom: `2px solid ${color}`,
                  transition: "height 0.5s",
                }}
              />
              <span
                className="relative z-10 font-mono text-[10px] font-bold mb-1"
                style={{ color }}
              >
                {value.toFixed(3)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Analyst Queue ─────────────────────────────────────────────────────────────
function AnalystQueue({
  items,
}: {
  items: Array<{
    consolidate: bigint[];
    surface: bigint[];
    lineage_pattern: bigint;
    analyst_cycle: bigint;
    confidence: number;
  }>;
}) {
  return (
    <div
      className="border rounded overflow-hidden"
      style={{ borderColor: C.border, background: C.panel }}
      data-ocid="memory-temple.analyst-queue.list"
    >
      <div
        className="px-3 py-2 border-b flex items-center justify-between"
        style={{ borderColor: C.borderDim, background: C.panelDeep }}
      >
        <span
          className="font-mono text-[9px] tracking-[0.2em] font-bold"
          style={{ color: C.purple }}
        >
          ANALYST RECOMMENDATIONS
        </span>
        <span
          className="font-mono text-[7px] tracking-[0.1em]"
          style={{ color: C.dim }}
        >
          LAST {items.length} CYCLES
        </span>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: "200px" }}>
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-16">
            <span
              className="font-mono text-[8px] tracking-[0.15em]"
              style={{ color: C.dimDeep }}
            >
              QUEUE EMPTY — AWAITING ANALYST CYCLE
            </span>
          </div>
        ) : (
          items.map((item, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: analyst queue items
              key={i}
              className="px-3 py-2 border-b"
              style={{ borderColor: C.borderDim }}
              data-ocid={`memory-temple.analyst-queue.item.${i}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono text-[7px]"
                    style={{ color: C.dim }}
                  >
                    CYC-{String(item.analyst_cycle)}
                  </span>
                  <span
                    className="font-mono text-[7.5px]"
                    style={{ color: C.gold }}
                  >
                    PDL-{String(item.lineage_pattern)}
                  </span>
                  <span
                    className="font-mono text-[7px]"
                    style={{ color: C.cyan }}
                  >
                    CONSOL:{item.consolidate.length}
                  </span>
                  <span
                    className="font-mono text-[7px]"
                    style={{ color: C.purple }}
                  >
                    SURF:{item.surface.length}
                  </span>
                </div>
                <span
                  className="font-mono text-[7.5px] font-bold"
                  style={{ color: C.text }}
                >
                  {(item.confidence * 100).toFixed(1)}%
                </span>
              </div>
              {/* Confidence bar */}
              <div
                className="w-full h-[2px] rounded-full"
                style={{ background: C.borderDim }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${item.confidence * 100}%`,
                    background:
                      item.confidence > 0.7
                        ? C.green
                        : item.confidence > 0.4
                          ? C.gold
                          : C.red,
                    transition: "width 0.3s",
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Memory Coherence Gauge ────────────────────────────────────────────────────
function MemoryCoherenceGauge({ value }: { value: number }) {
  const pct = value * 100;
  const gaugeColor = value > 0.7 ? C.green : value > 0.4 ? C.gold : C.red;

  return (
    <div
      className="border rounded p-4 flex flex-col items-center gap-3"
      style={{
        borderColor: gaugeColor,
        background: C.panel,
        transition: "border-color 0.5s",
      }}
      data-ocid="memory-temple.coherence-gauge.display"
    >
      <div
        className="font-mono text-[8px] tracking-[0.25em]"
        style={{ color: C.dim }}
      >
        MEMORY FIELD COHERENCE
      </div>

      {/* Arc-style gauge */}
      <div className="relative w-32 h-16 flex items-end justify-center">
        <svg
          viewBox="0 0 128 72"
          className="absolute inset-0 w-full h-full"
          aria-label="Memory coherence arc gauge"
        >
          <title>Memory coherence arc gauge</title>
          {/* Track arc */}
          <path
            d="M 8 64 A 56 56 0 0 1 120 64"
            fill="none"
            stroke="oklch(0.15 0.03 265)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Fill arc */}
          <path
            d="M 8 64 A 56 56 0 0 1 120 64"
            fill="none"
            stroke={gaugeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * 175.9} 175.9`}
            style={{
              filter: `drop-shadow(0 0 4px ${gaugeColor})`,
              transition: "stroke-dasharray 0.6s, stroke 0.5s",
            }}
          />
        </svg>
        <div
          className="font-mono text-[22px] font-bold leading-none relative z-10"
          style={{
            color: gaugeColor,
            textShadow: `0 0 16px ${gaugeColor}60`,
            animation: "organism-pulse 873ms ease-in-out infinite",
            transition: "color 0.5s",
          }}
        >
          {value.toFixed(4)}
        </div>
      </div>

      {/* Bar representation */}
      <div className="w-full space-y-1">
        <div
          className="w-full h-[3px] rounded-full"
          style={{ background: "oklch(0.15 0.03 265)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: gaugeColor,
              boxShadow: `0 0 6px ${gaugeColor}`,
              transition: "width 0.6s",
            }}
          />
        </div>
        <div className="flex justify-between">
          <span className="font-mono text-[7px]" style={{ color: C.dimDeep }}>
            0.0
          </span>
          <span className="font-mono text-[7px]" style={{ color: C.dimDeep }}>
            1.0
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main Tab ──────────────────────────────────────────────────────────────────
export default function MemoryTempleTab() {
  const { data, isLoading, isError } = useMemoryTempleState();
  // Real organ integrity from the 18-organ substrate (getExtendedOrganState)
  const { data: organs } = useExtendedOrganState();

  if (isError) return <MemoryOffline />;

  // Compute max attractor strength for color scaling
  const maxStrength = data
    ? Math.max(
        ...data.pedestals.map((p) => attractorStrength(p.lineage_depth)),
        1,
      )
    : 1;

  // Real organ coherences — from sovereign 18-organ state (no arithmetic proxies)
  // heartCoh: heartIntegrity — cardiac organ integrity
  // brainCoh: brainIntegrity — neural organ integrity
  // gutCoh:   intestineIntegrity — enteric/gut-brain organ integrity
  const heartCoh: number = organs?.heart ?? 0;
  const brainCoh: number = organs?.brain ?? 0;
  const gutCoh: number = organs?.intestine ?? 0;

  return (
    <div className="h-full overflow-y-auto" style={{ background: C.bg }}>
      <div className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div
          className="border-b pb-3 flex items-end justify-between"
          style={{ borderColor: C.borderDim }}
        >
          <div>
            <h1
              className="font-mono text-[14px] font-bold tracking-[0.3em] uppercase"
              style={{
                color: C.gold,
                textShadow: `0 0 20px ${C.gold}50`,
                animation: "organism-pulse 873ms ease-in-out infinite",
              }}
              data-ocid="memory-temple.header.title"
            >
              ◈ MEMORY TEMPLE
            </h1>
            <p
              className="font-mono text-[8px] tracking-[0.2em] mt-0.5"
              style={{ color: C.dim }}
            >
              Pedestal Coupling Network — Active Lineage Anchors
            </p>
          </div>
          <div className="flex items-center gap-4">
            {data && (
              <>
                <div className="text-right">
                  <div
                    className="font-mono text-[7px] tracking-[0.15em]"
                    style={{ color: C.dim }}
                  >
                    ANALYST CYCLE
                  </div>
                  <div
                    className="font-mono text-[10px] font-bold"
                    style={{ color: C.purple }}
                  >
                    {String(data.last_analyst_cycle)}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="font-mono text-[7px] tracking-[0.15em]"
                    style={{ color: C.dim }}
                  >
                    BIAS
                  </div>
                  <div
                    className="font-mono text-[10px] font-bold"
                    style={{ color: biasColor(data.current_retrieval_bias) }}
                  >
                    {biasLabel(data.current_retrieval_bias)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── PEDESTAL GRID ────────────────────────────────────────────────── */}
        <section>
          <div
            className="font-mono text-[8px] tracking-[0.2em] mb-2"
            style={{ color: C.dim }}
          >
            PEDESTAL NODES — LINEAGE COUPLING MATRIX
          </div>
          {isLoading ? (
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                <SkeletonBlock key={i} h="h-32" />
              ))}
            </div>
          ) : (
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
              data-ocid="memory-temple.pedestal-grid"
            >
              {(data?.pedestals ?? []).slice(0, 12).map((p) => (
                <PedestalCard
                  key={String(p.id)}
                  id={p.id}
                  lineageDepth={p.lineage_depth}
                  phaseBias={p.phase_bias}
                  active={p.active}
                  maxStrength={maxStrength}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── TRACE TYPE CARDS ─────────────────────────────────────────────── */}
        <section>
          <div
            className="font-mono text-[8px] tracking-[0.2em] mb-2"
            style={{ color: C.dim }}
          >
            MEMORY TRACE FIELDS
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                <SkeletonBlock key={i} h="h-24" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <TraceCard type="EPISODIC" color={C.cyan} borderColor={C.cyan}>
                <StatRow
                  label="COUNT"
                  value={String(data?.episodic_count ?? 0n)}
                  color={C.cyan}
                />
                <StatRow
                  label="DOMINANT BIAS"
                  value={
                    data?.current_retrieval_bias === "episodic"
                      ? "ACTIVE"
                      : "PASSIVE"
                  }
                  color={
                    data?.current_retrieval_bias === "episodic"
                      ? C.green
                      : C.dim
                  }
                />
              </TraceCard>

              <TraceCard
                type="SEMANTIC"
                color={C.purple}
                borderColor={C.purple}
              >
                <StatRow
                  label="COUNT"
                  value={String(data?.semantic_count ?? 0n)}
                  color={C.purple}
                />
                <StatRow
                  label="DOMINANT BIAS"
                  value={
                    data?.current_retrieval_bias === "semantic"
                      ? "ACTIVE"
                      : "PASSIVE"
                  }
                  color={
                    data?.current_retrieval_bias === "semantic"
                      ? C.green
                      : C.dim
                  }
                />
              </TraceCard>

              <TraceCard type="DOCTRINE" color={C.gold} borderColor={C.gold}>
                <StatRow
                  label="COUNT"
                  value={String(data?.doctrine_count ?? 0n)}
                  color={C.gold}
                />
                <StatRow
                  label="DOMINANT BIAS"
                  value={
                    data?.current_retrieval_bias === "doctrine"
                      ? "ACTIVE"
                      : "PASSIVE"
                  }
                  color={
                    data?.current_retrieval_bias === "doctrine"
                      ? C.green
                      : C.dim
                  }
                />
              </TraceCard>

              <TraceCard type="MISSION" color={C.red} borderColor={C.red}>
                <StatRow
                  label="COUNT"
                  value={String(data?.mission_count ?? 0n)}
                  color={C.red}
                />
                <StatRow
                  label="DOMINANT BIAS"
                  value={
                    data?.current_retrieval_bias === "mission"
                      ? "ACTIVE"
                      : "PASSIVE"
                  }
                  color={
                    data?.current_retrieval_bias === "mission" ? C.green : C.dim
                  }
                />
              </TraceCard>
            </div>
          )}
        </section>

        {/* ── RETRIEVAL BIAS + ANALYST QUEUE (2-col) ───────────────────────── */}
        <section className="grid md:grid-cols-2 gap-4">
          {/* Retrieval Bias */}
          {isLoading ? (
            <SkeletonBlock h="h-48" />
          ) : (
            <RetrievalBiasDisplay
              heartCoherence={heartCoh}
              brainCoherence={brainCoh}
              gutCoherence={gutCoh}
              leader={data?.current_retrieval_bias ?? "episodic"}
            />
          )}

          {/* Analyst Queue */}
          {isLoading ? (
            <SkeletonBlock h="h-48" />
          ) : (
            <AnalystQueue items={data?.analyst_queue ?? []} />
          )}
        </section>

        {/* ── MEMORY COHERENCE GAUGE ────────────────────────────────────────── */}
        <section className="flex justify-center">
          {isLoading ? (
            <SkeletonBlock h="h-36" w="w-64" />
          ) : (
            <div className="w-full max-w-sm">
              <MemoryCoherenceGauge value={data?.memory_coherence ?? 0} />
            </div>
          )}
        </section>

        {/* ── PHASE SUM ─────────────────────────────────────────────────────── */}
        {!isLoading && data && (
          <div
            className="border rounded px-4 py-2 flex items-center justify-between"
            style={{ borderColor: C.borderDim, background: C.panelDeep }}
          >
            <span
              className="font-mono text-[8px] tracking-[0.2em]"
              style={{ color: C.dim }}
            >
              PEDESTAL PHASE SUM
            </span>
            <span
              className="font-mono text-[10px] font-bold"
              style={{ color: C.cyan }}
            >
              {data.pedestal_phase_sum.toFixed(4)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
