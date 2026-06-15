// CoreBrain Runtime Monitor Panel
// 7-subsystem always-on monitoring stack with live event log.
// Design: matches dark OKLCH system (ANSPanel / CognitiveDashboard pattern)

import { useState } from "react";
import type {
  CoreBrainMonitorState,
  MonitorEventEntry,
} from "../utils/coreBrainRuntimeMonitor";

interface Props {
  state: CoreBrainMonitorState;
}

// ─── Colors per subsystem ─────────────────────────────────────────────────────
const SUBSYSTEM_COLORS: Record<string, string> = {
  Conflict: "oklch(0.65 0.25 25)",
  WorkingMemory: "oklch(0.65 0.20 255)",
  Emergence: "oklch(0.65 0.22 290)",
  Regulation: "oklch(0.65 0.22 145)",
  Persistence: "oklch(0.72 0.22 60)",
  Compute: "oklch(0.72 0.18 195)",
  Topology: "oklch(0.65 0.18 270)",
};

// ─── Metric Bar ───────────────────────────────────────────────────────────────
function MiniBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
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
          {pct}%
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

// ─── Event Badge ─────────────────────────────────────────────────────────────
function EventBadge({ event, color }: { event: string | null; color: string }) {
  if (!event)
    return (
      <span
        style={{ color: "oklch(0.3 0.04 220)" }}
        className="font-mono text-[6px]"
      >
        —
      </span>
    );
  const isPositive =
    event.includes("Healthy") ||
    event.includes("Positive") ||
    event.includes("Win") ||
    event.includes("Success") ||
    event.includes("Useful") ||
    event.includes("Resolved-Well") ||
    event.includes("Candidate") ||
    event.includes("Reused") ||
    event.includes("Reactivation");
  const isNeg =
    event.includes("Overload") ||
    event.includes("Regression") ||
    event.includes("Failure") ||
    event.includes("Stall") ||
    event.includes("Artifact") ||
    event.includes("Shallow") ||
    event.includes("Insufficient") ||
    event.includes("Bottleneck") ||
    event.includes("Runaway");
  const badgeColor = isPositive
    ? "oklch(0.65 0.22 145)"
    : isNeg
      ? "oklch(0.65 0.25 25)"
      : color;
  return (
    <span
      className="font-mono text-[6px] px-1 py-0.5 rounded-sm"
      style={{
        background: `${badgeColor}22`,
        color: badgeColor,
        border: `1px solid ${badgeColor}44`,
      }}
    >
      {event.slice(0, 28)}
    </span>
  );
}

// ─── Subsystem Row ────────────────────────────────────────────────────────────
function SubsystemRow({
  name,
  color,
  keyMetric,
  keyMetricLabel,
  lastEvent,
  bars,
}: {
  name: string;
  color: string;
  keyMetric: number;
  keyMetricLabel: string;
  lastEvent: string | null;
  bars: Array<{ label: string; value: number }>;
}) {
  const [expanded, setExpanded] = useState(false);
  const pct = Math.round(keyMetric * 100);
  return (
    <div
      className="mb-1 rounded-sm overflow-hidden"
      style={{
        background: "oklch(0.11 0.02 260)",
        border: "1px solid oklch(0.16 0.03 260)",
      }}
    >
      <button
        type="button"
        className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 transition-colors text-left"
        onClick={() => setExpanded((e) => !e)}
      >
        {/* Subsystem name */}
        <span
          className="font-mono text-[7px] tracking-widest uppercase font-bold w-[80px] shrink-0"
          style={{ color }}
        >
          {name}
        </span>
        {/* Key metric bar */}
        <div
          className="flex-1 rounded-sm"
          style={{ height: 4, background: "oklch(0.14 0.03 260)" }}
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
        {/* Metric value */}
        <span
          className="font-mono text-[7px] font-bold w-[28px] text-right shrink-0"
          style={{ color }}
        >
          {pct}%
        </span>
        {/* Metric label */}
        <span
          className="font-mono text-[6px] w-[52px] shrink-0"
          style={{ color: "oklch(0.35 0.05 220)" }}
        >
          {keyMetricLabel}
        </span>
        {/* Last event */}
        <div className="flex-1 flex justify-end">
          <EventBadge event={lastEvent} color={color} />
        </div>
        {/* Expand arrow */}
        <span
          className="font-mono text-[6px] ml-1 shrink-0"
          style={{
            color: "oklch(0.3 0.04 220)",
            transform: expanded ? "rotate(90deg)" : "none",
            display: "inline-block",
            transition: "transform 0.2s",
          }}
        >
          ▶
        </span>
      </button>
      {expanded && (
        <div
          className="px-2 pb-2 pt-1"
          style={{ borderTop: "1px solid oklch(0.14 0.03 260)" }}
        >
          {bars.map((b) => (
            <MiniBar
              key={b.label}
              label={b.label}
              value={b.value}
              color={color}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Event Log Entry ──────────────────────────────────────────────────────────
function EventLogRow({ entry }: { entry: MonitorEventEntry }) {
  const color = SUBSYSTEM_COLORS[entry.subsystem] ?? "oklch(0.55 0.08 220)";
  return (
    <div
      className="flex items-start gap-2 py-0.5"
      style={{ borderBottom: "1px solid oklch(0.13 0.02 260)" }}
    >
      <span
        className="font-mono text-[6px] shrink-0 w-[28px]"
        style={{ color: "oklch(0.35 0.05 220)" }}
      >
        T{entry.tick}
      </span>
      <span
        className="font-mono text-[6px] shrink-0 w-[60px] truncate"
        style={{ color }}
      >
        {entry.subsystem}
      </span>
      <span
        className="font-mono text-[6px] flex-1 leading-relaxed"
        style={{ color: "oklch(0.50 0.07 220)" }}
      >
        {entry.description}
      </span>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
export function CoreBrainMonitorPanel({ state }: Props) {
  const [logExpanded, setLogExpanded] = useState(false);
  const hs = state.overallHealthScore;
  const healthColor =
    hs > 0.7
      ? "oklch(0.65 0.22 145)"
      : hs > 0.4
        ? "oklch(0.72 0.22 60)"
        : "oklch(0.65 0.25 25)";
  const healthLabel = hs > 0.7 ? "HEALTHY" : hs > 0.4 ? "NOMINAL" : "CRITICAL";
  const sr = state.selfRegulation;
  const driftColor =
    sr.driftClass === "None"
      ? "oklch(0.65 0.22 145)"
      : sr.driftSeverity > 0.6
        ? "oklch(0.65 0.25 25)"
        : "oklch(0.72 0.22 60)";

  return (
    <div
      data-ocid="core_monitor.panel"
      style={{
        background: "oklch(0.09 0.02 260)",
        border: "1px solid oklch(0.16 0.03 260)",
        borderRadius: 6,
        padding: "10px",
      }}
    >
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 mb-2 pb-1.5"
        style={{ borderBottom: "1px solid oklch(0.14 0.03 260)" }}
      >
        <span
          className="font-mono text-[8px] tracking-widest uppercase font-bold"
          style={{ color: "oklch(0.55 0.10 260)" }}
        >
          CORE BRAIN RUNTIME MONITOR
        </span>
        <div className="flex-1" />
        {/* Overall health */}
        <div className="flex items-center gap-1.5">
          <div
            className="rounded-full"
            style={{
              width: 6,
              height: 6,
              background: healthColor,
              boxShadow: `0 0 6px ${healthColor}`,
            }}
          />
          <span
            className="font-mono text-[7px] font-bold"
            style={{ color: healthColor }}
          >
            {healthLabel} {Math.round(hs * 100)}%
          </span>
        </div>
        {/* Drift */}
        <div
          className="px-1.5 py-0.5 rounded-sm"
          style={{
            background: `${driftColor}22`,
            border: `1px solid ${driftColor}44`,
          }}
        >
          <span
            className="font-mono text-[6px] font-bold"
            style={{ color: driftColor }}
          >
            {sr.driftClass === "None" ? "STABLE" : sr.driftClass.toUpperCase()}
          </span>
        </div>
        {/* Tick */}
        <span
          className="font-mono text-[6px]"
          style={{ color: "oklch(0.30 0.04 220)" }}
        >
          T{state.tick}
        </span>
      </div>

      {/* Self-regulation summary row */}
      <div className="flex items-center gap-3 mb-2">
        <span
          className="font-mono text-[6px] uppercase tracking-widest"
          style={{ color: "oklch(0.35 0.05 220)" }}
        >
          SELF-REG
        </span>
        <MiniBar
          label=""
          value={sr.controlStateScore}
          color="oklch(0.65 0.15 260)"
        />
        <span
          className="font-mono text-[6px]"
          style={{ color: "oklch(0.40 0.06 220)" }}
        >
          {sr.correctionEngineActive ? "⚡ Correction active" : "✓ No drift"}
        </span>
        <span
          className="font-mono text-[6px]"
          style={{ color: "oklch(0.30 0.04 220)" }}
        >
          Updates: {sr.adaptivePolicyUpdates}
        </span>
      </div>

      {/* ── 7 Subsystem Rows ──────────────────────────────────────────── */}
      <SubsystemRow
        name="Conflict"
        color={SUBSYSTEM_COLORS.Conflict ?? "oklch(0.65 0.25 25)"}
        keyMetric={1 - state.conflict.currentConflictSeverity}
        keyMetricLabel="resolution"
        lastEvent={state.conflict.lastEvent}
        bars={[
          { label: "severity", value: state.conflict.currentConflictSeverity },
          {
            label: "hesitation",
            value: Math.min(1, state.conflict.hesitationWithoutResolution / 20),
          },
          {
            label: "oscillation",
            value: state.conflict.oscillationFrequency / 10,
          },
        ]}
      />
      <SubsystemRow
        name="WorkingMem"
        color={SUBSYSTEM_COLORS.WorkingMemory ?? "oklch(0.65 0.20 255)"}
        keyMetric={state.workingMemory.decisiveFactRetentionRate}
        keyMetricLabel="decisive ret."
        lastEvent={state.workingMemory.lastEvent}
        bars={[
          {
            label: "occupancy",
            value: state.workingMemory.activeSlotCount / 8,
          },
          {
            label: "stale rate",
            value: state.workingMemory.staleRetentionRate,
          },
          { label: "gate prec.", value: state.workingMemory.gatePrecision },
        ]}
      />
      <SubsystemRow
        name="Emergence"
        color={SUBSYSTEM_COLORS.Emergence ?? "oklch(0.65 0.22 290)"}
        keyMetric={state.emergence.emergenceScore}
        keyMetricLabel="emerg. score"
        lastEvent={state.emergence.lastEvent}
        bars={[
          { label: "novelty", value: state.emergence.noveltyScore },
          { label: "diversity", value: state.emergence.thoughtDiversity },
          { label: "coherence", value: state.emergence.coherenceScore },
        ]}
      />
      <SubsystemRow
        name="Regulation"
        color={SUBSYSTEM_COLORS.Regulation ?? "oklch(0.65 0.22 145)"}
        keyMetric={state.regulation.autonomicBalanceStability}
        keyMetricLabel="ANS balance"
        lastEvent={state.regulation.lastEvent}
        bars={[
          { label: "stability", value: state.regulation.prevStability },
          { label: "stress", value: state.regulation.stressMagnitude },
          {
            label: "recovery slope",
            value: clamp01(state.regulation.recoverySlope),
          },
        ]}
      />
      <SubsystemRow
        name="Persistence"
        color={SUBSYSTEM_COLORS.Persistence ?? "oklch(0.72 0.22 60)"}
        keyMetric={1 - state.persistence.persistenceOverloadRisk}
        keyMetricLabel="headroom"
        lastEvent={state.persistence.lastEvent}
        bars={[
          {
            label: "unresolved",
            value: state.persistence.unresolvedTensionCount / 12,
          },
          { label: "relevance", value: state.persistence.carryoverRelevance },
          {
            label: "failure recall",
            value: state.persistence.failureMemoryRecallRate,
          },
        ]}
      />
      <SubsystemRow
        name="Compute"
        color={SUBSYSTEM_COLORS.Compute ?? "oklch(0.72 0.18 195)"}
        keyMetric={state.compute.sparseActivationRatio}
        keyMetricLabel="sparse ratio"
        lastEvent={state.compute.lastEvent}
        bars={[
          { label: "active frac.", value: state.compute.activeRegionFraction },
          {
            label: "efficiency trend",
            value: clamp01(state.compute.efficiencyTrend + 0.5),
          },
          { label: "compute proxy", value: state.compute.computeProxy },
        ]}
      />
      <SubsystemRow
        name="Topology"
        color={SUBSYSTEM_COLORS.Topology ?? "oklch(0.65 0.18 270)"}
        keyMetric={state.topology.predictionActionCoupling}
        keyMetricLabel="pred-act coup."
        lastEvent={state.topology.lastEvent}
        bars={[
          { label: "recurrence", value: state.topology.recurrenceDepth },
          { label: "reg. reach", value: state.topology.regulationReach },
          {
            label: "competition",
            value: state.topology.moduleCompetitionSaturation,
          },
        ]}
      />

      {/* ── Event Log ─────────────────────────────────────────────────── */}
      <div className="mt-2">
        <button
          type="button"
          className="w-full flex items-center gap-2 py-1 hover:opacity-80 transition-opacity"
          onClick={() => setLogExpanded((e) => !e)}
          data-ocid="core_monitor.toggle"
        >
          <span
            className="font-mono text-[7px] tracking-widest uppercase font-bold"
            style={{ color: "oklch(0.40 0.07 260)" }}
          >
            Event Log
          </span>
          <span
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.30 0.04 220)" }}
          >
            ({state.eventLog.length} events)
          </span>
          <div className="flex-1" />
          <span
            className="font-mono text-[6px]"
            style={{
              color: "oklch(0.3 0.04 220)",
              transform: logExpanded ? "rotate(90deg)" : "none",
              display: "inline-block",
              transition: "transform 0.2s",
            }}
          >
            ▶
          </span>
        </button>
        {logExpanded && (
          <div
            className="mt-1 overflow-y-auto"
            style={{
              maxHeight: 160,
              background: "oklch(0.08 0.015 260)",
              borderRadius: 3,
              padding: "4px 6px",
            }}
          >
            {state.eventLog.slice(0, 10).map((e, i) => (
              <EventLogRow key={`${e.tick}-${e.subsystem}-${i}`} entry={e} />
            ))}
            {state.eventLog.length === 0 && (
              <span
                className="font-mono text-[6px]"
                style={{ color: "oklch(0.25 0.04 220)" }}
              >
                No events yet — run simulation to generate data.
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
