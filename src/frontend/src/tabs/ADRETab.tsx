// ADRE — Auro Deliberation & Resonance Engine
// 5-pass deliberation loop: Forward → Back-pass → Resonance → Compression → Gate
// Polls backend at 873ms to match the sovereign heartbeat.
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";

// ── Color palette (organism dark theme) ─────────────────────────────────────
const C = {
  bg: "oklch(0.055 0.01 265)",
  panel: "oklch(0.075 0.012 265)",
  panelDeep: "oklch(0.065 0.01 265)",
  border: "oklch(0.18 0.05 250)",
  borderLo: "oklch(0.14 0.04 250)",
  dim: "oklch(0.38 0.05 220)",
  dimlo: "oklch(0.26 0.04 220)",
  fg: "oklch(0.85 0.05 210)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.82 0.22 80)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.78 0.22 65)",
  red: "oklch(0.72 0.22 25)",
  purple: "oklch(0.72 0.22 280)",
  adre: "oklch(0.74 0.22 230)",
};

// ── TypeScript types (mirror Motoko types) ───────────────────────────────────
interface ADREHypothesis {
  action: string;
  predictedCoherence: number;
  predictedR: number;
  confidenceScore: number;
  ringFamily: number;
  beatCreated: bigint;
}

interface ADRECriticReport {
  criticId: string;
  violationCount: number;
  passCount: number;
  alignmentScore: number;
  riskScore: number;
  opportunityScore: number;
  contradictionDetected: boolean;
  recommendation: string;
}

interface ADREDecision {
  beat: bigint;
  actionId: string;
  hypothesis: ADREHypothesis;
  critics: ADRECriticReport[];
  finalConfidence: number;
  finalRisk: number;
  gateResult: boolean;
  sacesiHash: number;
  memoryCommit: string;
  passTrace: string[];
}

interface ADREResonanceState {
  globalMeaningShift: number;
  fieldCoherenceTrend: number;
  contradictionCount: number;
  lastUpdatedBeat: bigint;
}

interface ADRELawSummary {
  passes: number;
  violations: number;
  omnisFired: boolean;
}

// ── Ring family labels ────────────────────────────────────────────────────────
const RING_LABELS: Record<number, string> = {
  0: "DELTA GROUND",
  1: "THETA BRIDGE",
  2: "ALPHA FIELD",
  3: "BETA COMPUTE",
  4: "GAMMA SHARP",
  5: "HIGH GAMMA",
  6: "SUPRA GAMMA",
  7: "OMNIS APEX",
};

// ── Sub-components ─────────────────────────────────────────────────────────────
function PanelBox({
  children,
  className = "",
  accent,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <div
      className={`border p-3 ${className}`}
      style={{
        background: C.panel,
        borderColor: accent ? `${accent}40` : C.border,
        borderTop: accent ? `1px solid ${accent}` : undefined,
      }}
    >
      {children}
    </div>
  );
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-mono text-[9px] tracking-widest uppercase mb-2 pb-1 border-b"
      style={{ color: C.adre, borderColor: `${C.adre}40` }}
    >
      {children}
    </div>
  );
}

function MetricCard({
  label,
  value,
  color,
  sub,
}: {
  label: string;
  value: string;
  color: string;
  sub?: string;
}) {
  return (
    <div
      className="flex flex-col gap-1 p-3 border"
      style={{ background: C.panelDeep, borderColor: `${color}30` }}
    >
      <span
        className="font-mono text-[8px] tracking-widest uppercase"
        style={{ color: C.dim }}
      >
        {label}
      </span>
      <span
        className="font-mono text-xl font-bold leading-none"
        style={{ color, textShadow: `0 0 12px ${color}50` }}
      >
        {value}
      </span>
      {sub && (
        <span className="font-mono text-[7px]" style={{ color: C.dimlo }}>
          {sub}
        </span>
      )}
    </div>
  );
}

// Pass status strip — 5 passes of the deliberation loop
function PassStrip({ decision }: { decision: ADREDecision | null }) {
  const PASSES = [
    { id: "FWD", label: "FORWARD", desc: "Ingest & classify signal" },
    { id: "BCK", label: "BACK-PASS", desc: "Cross-check against law registry" },
    { id: "RES", label: "RESONANCE", desc: "Test global meaning shift" },
    { id: "CMP", label: "COMPRESSION", desc: "Reduce to stable invariants" },
    { id: "GATE", label: "GATE", desc: "Emit if all constraints pass" },
  ];

  const complete = decision !== null;
  const gatePass = decision?.gateResult ?? false;

  return (
    <div className="flex gap-1" data-ocid="adre.pass_strip.section">
      {PASSES.map((pass, i) => {
        const isGate = pass.id === "GATE";
        const passColor = isGate
          ? gatePass
            ? C.green
            : C.red
          : complete
            ? C.green
            : C.dimlo;
        const bgColor = isGate
          ? gatePass
            ? `${C.green}18`
            : `${C.red}12`
          : complete
            ? `${C.green}10`
            : "transparent";
        return (
          <div
            key={pass.id}
            className="flex-1 flex flex-col items-center gap-1 py-2 px-1 border transition-all"
            style={{ borderColor: `${passColor}50`, background: bgColor }}
          >
            <span
              className="font-mono text-[8px] tracking-widest font-bold"
              style={{ color: passColor }}
            >
              {complete ? (isGate ? (gatePass ? "✓" : "✗") : "✓") : "○"} P
              {i + 1}
            </span>
            <span
              className="font-mono text-[7px] tracking-wide text-center"
              style={{ color: complete ? C.dim : C.dimlo }}
            >
              {pass.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Law summary bar
function LawSummaryBar({ summary }: { summary: ADRELawSummary | null }) {
  const passes = summary?.passes ?? 0;
  const violations = summary?.violations ?? 0;
  const omnis = summary?.omnisFired ?? false;
  const pct = Math.round((passes / 60) * 100);

  return (
    <PanelBox accent={omnis ? C.gold : undefined}>
      <div className="flex items-center justify-between mb-2">
        <PanelTitle>▸ 60 SOVEREIGN LAWS</PanelTitle>
        {omnis && (
          <div
            className="font-mono text-[8px] tracking-[0.2em] px-2 py-0.5 border font-bold animate-pulse"
            style={{
              color: C.gold,
              borderColor: C.gold,
              background: `${C.gold}15`,
              boxShadow: `0 0 12px ${C.gold}60`,
            }}
            data-ocid="adre.omnis.badge"
          >
            ◆ OMNIS FIRED
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 mb-2">
        <div
          className="flex-1 h-2"
          style={{ background: "oklch(0.12 0.01 265)" }}
        >
          <div
            className="h-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: C.green,
              boxShadow: pct > 90 ? `0 0 8px ${C.green}` : "none",
            }}
          />
        </div>
        <span
          className="font-mono text-[10px] font-bold shrink-0"
          style={{ color: C.green }}
        >
          {passes}/60
        </span>
        <span
          className="font-mono text-[8px] shrink-0"
          style={{ color: violations > 0 ? C.red : C.dim }}
        >
          {violations} violations
        </span>
      </div>
    </PanelBox>
  );
}

// Current hypothesis panel
function HypothesisPanel({ decision }: { decision: ADREDecision | null }) {
  if (!decision) {
    return (
      <PanelBox>
        <PanelTitle>▸ CURRENT HYPOTHESIS</PanelTitle>
        <div
          className="flex items-center justify-center h-16 font-mono text-[9px] tracking-widest"
          style={{ color: C.dimlo }}
          data-ocid="adre.hypothesis.empty_state"
        >
          AWAITING FIRST DELIBERATION CYCLE…
        </div>
      </PanelBox>
    );
  }

  const h = decision.hypothesis;
  const ringLabel = RING_LABELS[h.ringFamily] ?? `RING ${h.ringFamily}`;
  const ringColor =
    h.ringFamily === 7 ? C.gold : h.ringFamily >= 4 ? C.purple : C.cyan;
  const confPct = Math.round(h.confidenceScore * 100);

  return (
    <PanelBox accent={C.adre}>
      <PanelTitle>
        ▸ CURRENT HYPOTHESIS — BEAT {String(decision.beat)}
      </PanelTitle>
      <div className="mb-3">
        <div
          className="font-mono text-base font-bold tracking-wide mb-1"
          style={{ color: C.fg, wordBreak: "break-word" }}
          data-ocid="adre.hypothesis.action"
        >
          {h.action}
        </div>
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[7px] px-1.5 py-0.5 border"
            style={{
              color: ringColor,
              borderColor: `${ringColor}50`,
              background: `${ringColor}10`,
            }}
          >
            RING {h.ringFamily}: {ringLabel}
          </span>
          <span className="font-mono text-[7px]" style={{ color: C.dim }}>
            BEAT CREATED {String(h.beatCreated)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          {
            label: "CONFIDENCE",
            value: `${confPct}%`,
            color: confPct > 80 ? C.green : confPct > 50 ? C.amber : C.red,
          },
          {
            label: "PRED COHERENCE",
            value: h.predictedCoherence.toFixed(4),
            color: h.predictedCoherence > 0.87 ? C.green : C.amber,
          },
          {
            label: "PRED R",
            value: h.predictedR.toFixed(4),
            color: h.predictedR > 0.87 ? C.green : C.amber,
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex flex-col gap-0.5">
            <span
              className="font-mono text-[7px] tracking-widest uppercase"
              style={{ color: C.dim }}
            >
              {label}
            </span>
            <span className="font-mono text-[11px] font-bold" style={{ color }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Pass trace flow */}
      {decision.passTrace.length > 0 && (
        <div
          className="flex items-center gap-1 flex-wrap"
          data-ocid="adre.pass_trace.section"
        >
          <span
            className="font-mono text-[7px] tracking-widest"
            style={{ color: C.dim }}
          >
            TRACE:
          </span>
          {decision.passTrace.map((step, i) => (
            <span key={step}>
              <span
                className="font-mono text-[8px] px-1 py-0.5"
                style={{ color: C.adre, background: `${C.adre}15` }}
              >
                {step}
              </span>
              {i < decision.passTrace.length - 1 && (
                <span
                  className="font-mono text-[8px] mx-0.5"
                  style={{ color: C.dimlo }}
                >
                  →
                </span>
              )}
            </span>
          ))}
        </div>
      )}
    </PanelBox>
  );
}

// Critics panel
function CriticsPanel({ decision }: { decision: ADREDecision | null }) {
  if (!decision || decision.critics.length === 0) {
    return (
      <PanelBox>
        <PanelTitle>▸ INTERNAL CRITICS</PanelTitle>
        <div
          className="flex items-center justify-center h-12 font-mono text-[9px] tracking-widest"
          style={{ color: C.dimlo }}
          data-ocid="adre.critics.empty_state"
        >
          NO CRITICS ACTIVE
        </div>
      </PanelBox>
    );
  }

  return (
    <PanelBox>
      <PanelTitle>
        ▸ INTERNAL CRITICS — {decision.critics.length} ACTIVE
      </PanelTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {decision.critics.map((critic, i) => {
          const alignPct = Math.round(critic.alignmentScore * 100);
          const alignColor =
            alignPct > 70 ? C.green : alignPct > 40 ? C.amber : C.red;
          return (
            <div
              key={critic.criticId}
              className="border p-2 flex flex-col gap-1.5"
              style={{
                borderColor: critic.contradictionDetected
                  ? `${C.red}60`
                  : C.borderLo,
                background: critic.contradictionDetected
                  ? `${C.red}08`
                  : C.panelDeep,
              }}
              data-ocid={`adre.critic.item.${i + 1}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-[8px] font-bold tracking-wide"
                  style={{ color: C.adre }}
                >
                  {critic.criticId}
                </span>
                {critic.contradictionDetected && (
                  <span
                    className="font-mono text-[6px] px-1 py-0.5 font-bold"
                    style={{ color: C.red, background: `${C.red}20` }}
                  >
                    CONTRADICTION
                  </span>
                )}
              </div>

              {/* Alignment bar */}
              <div>
                <div className="flex justify-between mb-0.5">
                  <span
                    className="font-mono text-[7px]"
                    style={{ color: C.dim }}
                  >
                    ALIGNMENT
                  </span>
                  <span
                    className="font-mono text-[7px] font-bold"
                    style={{ color: alignColor }}
                  >
                    {alignPct}%
                  </span>
                </div>
                <div
                  className="h-1"
                  style={{ background: "oklch(0.12 0.01 265)" }}
                >
                  <div
                    className="h-full transition-all"
                    style={{ width: `${alignPct}%`, background: alignColor }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <div>
                  <span
                    className="font-mono text-[6px]"
                    style={{ color: C.dim }}
                  >
                    PASS
                  </span>
                  <span
                    className="font-mono text-[8px] font-bold ml-1"
                    style={{ color: C.green }}
                  >
                    {critic.passCount}
                  </span>
                </div>
                <div>
                  <span
                    className="font-mono text-[6px]"
                    style={{ color: C.dim }}
                  >
                    VIOLATION
                  </span>
                  <span
                    className="font-mono text-[8px] font-bold ml-1"
                    style={{ color: critic.violationCount > 0 ? C.red : C.dim }}
                  >
                    {critic.violationCount}
                  </span>
                </div>
                <div>
                  <span
                    className="font-mono text-[6px]"
                    style={{ color: C.dim }}
                  >
                    RISK
                  </span>
                  <span
                    className="font-mono text-[8px] font-bold ml-1"
                    style={{ color: critic.riskScore > 0.6 ? C.red : C.amber }}
                  >
                    {critic.riskScore.toFixed(2)}
                  </span>
                </div>
              </div>

              {critic.recommendation && (
                <div
                  className="font-mono text-[7px] leading-relaxed border-t pt-1 line-clamp-2"
                  style={{ color: C.dim, borderColor: C.borderLo }}
                  title={critic.recommendation}
                >
                  {critic.recommendation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PanelBox>
  );
}

// Decision queue row
function DecisionRow({
  decision,
  index,
  expanded,
  onToggle,
}: {
  decision: ADREDecision;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const confPct = Math.round(decision.finalConfidence * 100);
  const riskPct = Math.round(decision.finalRisk * 100);
  const rowBg = decision.gateResult ? `${C.green}08` : `${C.red}06`;
  const gateColor = decision.gateResult ? C.green : C.red;

  return (
    <div
      className="border-b"
      style={{ borderColor: C.borderLo, background: rowBg }}
      data-ocid={`adre.decision.item.${index}`}
    >
      <button
        type="button"
        className="w-full flex items-center gap-2 px-2 py-1.5 cursor-pointer transition-all text-left"
        onClick={onToggle}
      >
        <span
          className="font-mono text-[8px] w-16 shrink-0"
          style={{ color: C.dimlo }}
        >
          #{String(decision.beat)}
        </span>
        <span
          className="font-mono text-[8px] flex-1 min-w-0 truncate"
          style={{ color: C.fg }}
        >
          {decision.actionId}
        </span>
        <span
          className="font-mono text-[8px] w-10 text-right shrink-0"
          style={{ color: confPct > 80 ? C.green : C.amber }}
        >
          {confPct}%
        </span>
        <span
          className="font-mono text-[8px] w-8 text-right shrink-0"
          style={{ color: riskPct > 60 ? C.red : C.dim }}
        >
          R{riskPct}
        </span>
        <div
          className="font-mono text-[7px] px-1.5 py-0.5 shrink-0 font-bold"
          style={{
            color: gateColor,
            background: `${gateColor}15`,
            border: `1px solid ${gateColor}40`,
          }}
        >
          {decision.gateResult ? "EMITTED" : "QUEUED"}
        </div>
        <span className="font-mono text-[8px]" style={{ color: C.dimlo }}>
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {expanded && (
        <div
          className="px-2 pb-2 pt-1 border-t"
          style={{ borderColor: C.borderLo }}
        >
          <div className="grid grid-cols-2 gap-1 mb-2">
            {[
              ["ACTION", decision.hypothesis.action],
              [
                "RING FAMILY",
                `${decision.hypothesis.ringFamily}: ${RING_LABELS[decision.hypothesis.ringFamily] ?? "UNKNOWN"}`,
              ],
              [
                "SACESI HASH",
                `0x${decision.sacesiHash.toString(16).toUpperCase()}`,
              ],
              ["MEMORY COMMIT", `${decision.memoryCommit.slice(0, 24)}…`],
            ].map(([label, value]) => (
              <div key={label}>
                <span className="font-mono text-[7px]" style={{ color: C.dim }}>
                  {label}:{" "}
                </span>
                <span className="font-mono text-[7px]" style={{ color: C.fg }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          {decision.critics.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {decision.critics.map((c) => (
                <span
                  key={c.criticId}
                  className="font-mono text-[6px] px-1 py-0.5 border"
                  style={{
                    color: c.contradictionDetected ? C.red : C.dim,
                    borderColor: c.contradictionDetected
                      ? `${C.red}50`
                      : C.borderLo,
                  }}
                >
                  {c.criticId} {c.alignmentScore.toFixed(2)}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ADRETab() {
  const { actor, isFetching } = useActor();
  const [resonanceState, setResonanceState] =
    useState<ADREResonanceState | null>(null);
  const [lawSummary, setLawSummary] = useState<ADRELawSummary | null>(null);
  const [lastDecision, setLastDecision] = useState<ADREDecision | null>(null);
  const [decisionQueue, setDecisionQueue] = useState<ADREDecision[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!actor || isFetching) return;

    const poll = async () => {
      try {
        const [res, law, last, queue] = await Promise.all([
          (actor as any).getADREResonanceState?.(),
          (actor as any).getADRELawSummary?.(),
          (actor as any).getADRELastDecision?.(),
          (actor as any).getADREDecisionQueue?.(),
        ]);

        if (res) setResonanceState(res as ADREResonanceState);
        if (law) setLawSummary(law as ADRELawSummary);
        if (last && Array.isArray(last) && last.length > 0)
          setLastDecision(last[0] as ADREDecision);
        else if (last && !Array.isArray(last))
          setLastDecision(last as ADREDecision);
        if (queue && Array.isArray(queue))
          setDecisionQueue(queue.slice(0, 20) as ADREDecision[]);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 873);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [actor, isFetching]);

  // Metric colors
  const meaningColor = !resonanceState
    ? C.dim
    : resonanceState.globalMeaningShift < 0.1
      ? C.green
      : resonanceState.globalMeaningShift < 0.2
        ? C.amber
        : C.red;

  const coherenceTrendColor = !resonanceState
    ? C.dim
    : resonanceState.fieldCoherenceTrend > 0.87
      ? C.green
      : resonanceState.fieldCoherenceTrend > 0.7
        ? C.amber
        : C.red;

  const contColor = !resonanceState
    ? C.dim
    : resonanceState.contradictionCount <= 3
      ? C.green
      : resonanceState.contradictionCount <= 7
        ? C.amber
        : C.red;

  const isActive = resonanceState !== null;
  const beatDisplay = resonanceState
    ? String(resonanceState.lastUpdatedBeat)
    : "—";

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: C.bg }}
      data-ocid="adre.page"
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between px-4 py-3 border-b shrink-0"
        style={{ background: "oklch(0.065 0.012 230)", borderColor: C.border }}
        data-ocid="adre.header.panel"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{
              background: isActive ? C.adre : C.dimlo,
              boxShadow: isActive ? `0 0 10px ${C.adre}` : "none",
              transition: "all 0.5s",
            }}
          />
          <span
            className="font-mono text-xl font-bold tracking-widest"
            style={{ color: C.adre }}
          >
            ADRE
          </span>
          <span
            className="font-mono text-[9px] tracking-widest uppercase"
            style={{ color: C.dim }}
          >
            Auro Deliberation &amp; Resonance Engine
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span
              className="font-mono text-[7px] tracking-widest uppercase"
              style={{ color: C.dim }}
            >
              BEAT
            </span>
            <span
              className="font-mono text-sm font-bold"
              style={{ color: C.cyan }}
            >
              {beatDisplay}
            </span>
          </div>
          <div
            className="font-mono text-[8px] tracking-[0.15em] px-2 py-0.5 border font-bold"
            style={{
              color: isActive ? C.green : C.dimlo,
              borderColor: isActive ? `${C.green}50` : C.borderLo,
              background: isActive ? `${C.green}10` : "transparent",
            }}
            data-ocid="adre.status.indicator"
          >
            {loading ? "INITIALIZING" : isActive ? "● REASONING" : "○ STANDBY"}
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col gap-3 p-3">
        {/* ── Pass Status Strip ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <PanelBox>
            <PanelTitle>▸ 5-PASS DELIBERATION LOOP</PanelTitle>
            <PassStrip decision={lastDecision} />
          </PanelBox>
        </motion.div>

        {/* ── Live Resonance Metrics ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          data-ocid="adre.resonance_metrics.section"
        >
          <div className="grid grid-cols-3 gap-2">
            <MetricCard
              label="Global Meaning Shift"
              value={
                resonanceState
                  ? resonanceState.globalMeaningShift.toFixed(4)
                  : "——"
              }
              color={meaningColor}
              sub={
                !resonanceState
                  ? "awaiting data"
                  : resonanceState.globalMeaningShift < 0.1
                    ? "stable"
                    : resonanceState.globalMeaningShift < 0.2
                      ? "moderate drift"
                      : "high drift"
              }
            />
            <MetricCard
              label="Field Coherence Trend"
              value={
                resonanceState
                  ? resonanceState.fieldCoherenceTrend.toFixed(4)
                  : "——"
              }
              color={coherenceTrendColor}
              sub={
                !resonanceState
                  ? "awaiting data"
                  : resonanceState.fieldCoherenceTrend > 0.87
                    ? "above OMNIS threshold"
                    : resonanceState.fieldCoherenceTrend > 0.7
                      ? "below threshold"
                      : "degraded"
              }
            />
            <MetricCard
              label="Contradictions"
              value={
                resonanceState ? String(resonanceState.contradictionCount) : "—"
              }
              color={contColor}
              sub={
                !resonanceState
                  ? "awaiting data"
                  : resonanceState.contradictionCount <= 3
                    ? "nominal"
                    : resonanceState.contradictionCount <= 7
                      ? "elevated"
                      : "critical"
              }
            />
          </div>
        </motion.div>

        {/* ── Law Summary Bar ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <LawSummaryBar summary={lawSummary} />
        </motion.div>

        {/* ── Hypothesis + Critics (2 columns on wide screens) ──────────────── */}
        <motion.div
          className="grid grid-cols-1 xl:grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <HypothesisPanel decision={lastDecision} />
          <CriticsPanel decision={lastDecision} />
        </motion.div>

        {/* ── Decision Queue ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <PanelBox>
            <PanelTitle>
              ▸ DECISION QUEUE — LAST {decisionQueue.length} CYCLES
            </PanelTitle>
            {decisionQueue.length === 0 ? (
              <div
                className="flex items-center justify-center h-16 font-mono text-[9px] tracking-widest"
                style={{ color: C.dimlo }}
                data-ocid="adre.decision_queue.empty_state"
              >
                {loading
                  ? "LOADING DECISION HISTORY…"
                  : "NO DECISIONS RECORDED YET"}
              </div>
            ) : (
              <div
                className="overflow-y-auto"
                style={{ maxHeight: "320px" }}
                data-ocid="adre.decision_queue.list"
              >
                {/* Header row */}
                <div
                  className="flex items-center gap-2 px-2 py-1 border-b"
                  style={{ borderColor: C.borderLo, background: C.panelDeep }}
                >
                  {["BEAT", "ACTION ID", "CONF", "RISK", "STATUS"].map((h) => (
                    <span
                      key={h}
                      className={`font-mono text-[7px] tracking-widest uppercase shrink-0 ${h === "ACTION ID" ? "flex-1" : h === "BEAT" ? "w-16" : h === "CONF" ? "w-10 text-right" : h === "RISK" ? "w-8 text-right" : ""}`}
                      style={{ color: C.dimlo }}
                    >
                      {h}
                    </span>
                  ))}
                  <span className="w-4" />
                </div>
                {decisionQueue.map((d, i) => (
                  <DecisionRow
                    key={`${d.beat}-${i}`}
                    decision={d}
                    index={i + 1}
                    expanded={expandedRow === i}
                    onToggle={() =>
                      setExpandedRow(expandedRow === i ? null : i)
                    }
                  />
                ))}
              </div>
            )}
          </PanelBox>
        </motion.div>
      </div>
    </div>
  );
}
