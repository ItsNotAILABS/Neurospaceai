import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { PublicationAlertBanner } from "../components/PublicationAlertBanner";
import type {
  NeuralSimulationControls,
  NeuralSimulationState,
  StdpWeightEntry,
} from "../hooks/useNeuralSimulation";
import {
  type AnalyticsReport,
  generateAllAnalyticsReports,
} from "../utils/analyticsReports";
import { createArtifact } from "../utils/artifactStore";
import type { ExperimentResult } from "../utils/coreBrainExperimentRunner";
import { coreBrainRecordSystem } from "../utils/coreBrainRecordSystem";
import {
  type DetailedTechnicalReport,
  type PromotionReport,
  type QuickSummaryReport,
  coreBrainReportPipeline,
} from "../utils/coreBrainReportPipeline";
import {
  type RicherRegimeCandidateEvent,
  richerRegimeDetector,
} from "../utils/richerRegimeDetector";

type Neural = NeuralSimulationState & NeuralSimulationControls;

function StdpWeightTable({ weights }: { weights: StdpWeightEntry[] }) {
  const top = weights
    .slice()
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 20);
  if (top.length === 0) {
    return (
      <div
        data-ocid="report.empty_state"
        className="flex items-center justify-center h-full"
        style={{ color: "oklch(0.35 0.05 220)" }}
      >
        <span className="font-mono text-[10px] tracking-widest">
          No STDP data yet — run the simulation
        </span>
      </div>
    );
  }
  return (
    <div className="overflow-y-auto h-full">
      <table
        className="w-full font-mono text-[8px]"
        style={{ borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid oklch(0.2 0.05 255)" }}>
            {["CONNECTION", "WEIGHT", "Δ DELTA", "SOURCE", "DIRECTION"].map(
              (h) => (
                <th
                  key={h}
                  className="text-left px-3 py-2 tracking-widest uppercase"
                  style={{ color: "oklch(0.38 0.05 220)", fontWeight: 600 }}
                >
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {top.map((w, i) => (
            <tr
              key={w.connection}
              data-ocid={`report.row.${i + 1}`}
              style={{
                borderBottom: "1px solid oklch(0.14 0.03 255)",
                background:
                  i % 2 === 0 ? "transparent" : "oklch(0.065 0.01 265 / 0.5)",
              }}
            >
              <td
                className="px-3 py-1.5"
                style={{ color: "oklch(0.62 0.1 210)" }}
              >
                {w.connection}
              </td>
              <td
                className="px-3 py-1.5"
                style={{ color: "oklch(0.65 0.12 195)" }}
              >
                {w.weight.toFixed(3)}
              </td>
              <td
                className="px-3 py-1.5 font-bold"
                style={{
                  color:
                    w.delta > 0
                      ? "oklch(0.72 0.22 140)"
                      : w.delta < 0
                        ? "oklch(0.65 0.25 25)"
                        : "oklch(0.4 0.05 220)",
                }}
              >
                {w.delta > 0 ? "+" : ""}
                {w.delta.toFixed(4)}
              </td>
              <td
                className="px-3 py-1.5"
                style={{ color: "oklch(0.45 0.07 260)" }}
              >
                {"stdp"}
              </td>
              <td
                className="px-3 py-1.5"
                style={{
                  color:
                    w.delta > 0
                      ? "oklch(0.72 0.22 140)"
                      : "oklch(0.65 0.25 25)",
                }}
              >
                {w.delta > 0 ? "▲ LTP" : "▼ LTD"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Quick Summary Report ──────────────────────────────────────────────────────────────
function QuickSummarySection({ report }: { report: QuickSummaryReport }) {
  const verdictColors = {
    keep: {
      bg: "oklch(0.12 0.03 145 / 0.4)",
      color: "oklch(0.7 0.22 145)",
      border: "oklch(0.3 0.12 145 / 0.5)",
    },
    revise: {
      bg: "oklch(0.12 0.03 60 / 0.4)",
      color: "oklch(0.7 0.18 60)",
      border: "oklch(0.35 0.12 60 / 0.5)",
    },
    reject: {
      bg: "oklch(0.12 0.03 25 / 0.4)",
      color: "oklch(0.65 0.2 25)",
      border: "oklch(0.3 0.12 25 / 0.5)",
    },
  };
  const vc = verdictColors[report.overallVerdict];

  const deltaColor = (v: "improved" | "no-change" | "degraded") =>
    v === "improved"
      ? "oklch(0.7 0.22 145)"
      : v === "degraded"
        ? "oklch(0.65 0.2 25)"
        : "oklch(0.6 0.12 60)";

  const deltaSign = (d: number) =>
    `${(d > 0 ? "+" : "") + (d * 100).toFixed(1)}%`;

  return (
    <div className="space-y-2">
      <div
        className="font-mono text-[7px] tracking-widest uppercase"
        style={{ color: "oklch(0.38 0.06 220)" }}
      >
        {report.whatWasTested}
      </div>
      <div className="flex items-center gap-2">
        <span
          className="font-mono text-[8px]"
          style={{ color: "oklch(0.4 0.06 220)" }}
        >
          {report.baselineLabel}
        </span>
        <span style={{ color: "oklch(0.3 0.04 220)" }}>vs</span>
        <span
          className="font-mono text-[8px]"
          style={{ color: "oklch(0.6 0.12 210)" }}
        >
          {report.enabledLabel}
        </span>
      </div>

      {/* 4 metric verdicts */}
      <div className="grid grid-cols-2 gap-1.5">
        {(
          [
            ["Useful Behavior", report.usefulBehaviorResult],
            ["Emergence", report.emergenceResult],
            ["Regulation", report.regulationResult],
            ["Efficiency", report.efficiencyResult],
          ] as const
        ).map(([label, res], i) => (
          <div
            key={label}
            data-ocid={`report.item.${i + 1}`}
            className="rounded px-2 py-1.5"
            style={{
              background: "oklch(0.09 0.01 265)",
              border: `1px solid ${deltaColor(res.verdict)} / 0.2`,
            }}
          >
            <div
              className="font-mono text-[7px] tracking-wide"
              style={{ color: "oklch(0.4 0.05 220)" }}
            >
              {label}
            </div>
            <div className="flex items-center justify-between mt-0.5">
              <span
                className="font-mono text-[9px] font-bold"
                style={{ color: deltaColor(res.verdict) }}
              >
                {deltaSign(res.delta)}
              </span>
              <span
                className="font-mono text-[7px] tracking-wide uppercase"
                style={{ color: deltaColor(res.verdict) }}
              >
                {res.verdict}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Artifact warnings */}
      {report.artifactWarnings.length > 0 && (
        <div
          data-ocid="report.error_state"
          className="rounded px-2 py-1.5"
          style={{
            background: "oklch(0.1 0.02 60 / 0.4)",
            border: "1px solid oklch(0.35 0.12 60 / 0.4)",
          }}
        >
          <div
            className="font-mono text-[7px] tracking-widest uppercase mb-0.5"
            style={{ color: "oklch(0.6 0.15 60)" }}
          >
            Artifact Warnings
          </div>
          {report.artifactWarnings.map((w) => (
            <div
              key={w}
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.55 0.12 60)" }}
            >
              ⚠ {w}
            </div>
          ))}
        </div>
      )}

      {/* Overall verdict */}
      <div
        data-ocid="report.panel"
        className="rounded p-2 text-center"
        style={{ background: vc.bg, border: `1px solid ${vc.border}` }}
      >
        <div
          className="font-mono text-[7px] tracking-widest uppercase"
          style={{ color: `${vc.color} / 0.7` }}
        >
          Overall Verdict
        </div>
        <div
          className="font-mono text-lg font-bold tracking-widest uppercase"
          style={{ color: vc.color }}
        >
          {report.overallVerdict}
        </div>
      </div>
    </div>
  );
}

// ── Detailed Technical Report ─────────────────────────────────────────────────────────────
function DetailedReportSection({
  report,
}: { report: DetailedTechnicalReport }) {
  const [expanded, setExpanded] = useState(false);

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
  const recColors = {
    keep: "oklch(0.7 0.22 145)",
    revise: "oklch(0.7 0.18 60)",
    reject: "oklch(0.65 0.2 25)",
  };

  return (
    <div
      className="rounded overflow-hidden"
      style={{ border: "1px solid oklch(0.18 0.04 255)" }}
    >
      <button
        type="button"
        data-ocid="report.toggle"
        onClick={() => setExpanded((e) => !e)}
        className="w-full px-3 py-2 flex items-center justify-between"
        style={{ background: "oklch(0.09 0.015 265)" }}
      >
        <span
          className="font-mono text-[8px] tracking-widest uppercase"
          style={{ color: "oklch(0.5 0.08 220)" }}
        >
          Detailed Technical Report
        </span>
        <div className="flex items-center gap-2">
          <Badge
            style={{
              background: "oklch(0.15 0.04 255 / 0.5)",
              color: recColors[report.recommendation],
              fontSize: "7px",
            }}
          >
            {report.recommendation.toUpperCase()}
          </Badge>
          <span
            className="font-mono text-[8px]"
            style={{ color: "oklch(0.4 0.06 220)" }}
          >
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </button>

      {expanded && (
        <div
          className="px-3 py-2 space-y-2"
          style={{ borderTop: "1px solid oklch(0.16 0.03 255)" }}
        >
          {/* Distributions */}
          <div className="grid grid-cols-2 gap-1.5">
            {(
              [
                [
                  "Baseline Task Success",
                  report.distributions.baselineTaskSuccess,
                ],
                ["Brain Task Success", report.distributions.brainTaskSuccess],
              ] as const
            ).map(([label, dist]) => (
              <div
                key={label}
                className="rounded p-2"
                style={{
                  background: "oklch(0.08 0.01 265)",
                  border: "1px solid oklch(0.16 0.03 255)",
                }}
              >
                <div
                  className="font-mono text-[7px] tracking-wide mb-1"
                  style={{ color: "oklch(0.4 0.06 220)" }}
                >
                  {label}
                </div>
                <div
                  className="font-mono text-[8px]"
                  style={{ color: "oklch(0.65 0.12 210)" }}
                >
                  μ={pct(dist.mean)} σ={pct(dist.std)}
                </div>
                <div
                  className="font-mono text-[7px]"
                  style={{ color: "oklch(0.38 0.05 220)" }}
                >
                  [{pct(dist.min)}, {pct(dist.max)}]
                </div>
              </div>
            ))}
          </div>

          {/* Best/worst run */}
          {report.bestRun && (
            <div
              className="rounded p-2"
              style={{
                background: "oklch(0.09 0.015 145 / 0.2)",
                border: "1px solid oklch(0.25 0.1 145 / 0.3)",
              }}
            >
              <div
                className="font-mono text-[7px] tracking-wide mb-0.5"
                style={{ color: "oklch(0.55 0.15 145)" }}
              >
                Best run: {report.bestRun.metadata.runId}
              </div>
              <div
                className="font-mono text-[7px]"
                style={{ color: "oklch(0.45 0.08 210)" }}
              >
                taskSuccess={pct(report.bestRun.behavior.taskSuccess)}{" "}
                adaptation={pct(report.bestRun.behavior.adaptationRate)}
              </div>
            </div>
          )}

          {/* Subsystem effects */}
          <div className="space-y-0.5">
            <div
              className="font-mono text-[7px] tracking-widest uppercase"
              style={{ color: "oklch(0.38 0.06 220)" }}
            >
              Subsystem Effects
            </div>
            {Object.entries(report.subsystemEffects).map(([k, v]) => (
              <div
                key={k}
                className="font-mono text-[7px]"
                style={{ color: "oklch(0.45 0.07 220)" }}
              >
                <span style={{ color: "oklch(0.55 0.12 210)" }}>[{k}]</span> {v}
              </div>
            ))}
          </div>

          {/* Event log */}
          {report.eventLog.length > 0 && (
            <div
              className="rounded p-2 overflow-y-auto"
              style={{
                maxHeight: 120,
                background: "oklch(0.07 0.01 265)",
                border: "1px solid oklch(0.16 0.03 255)",
              }}
            >
              {report.eventLog.map((e) => (
                <div
                  key={e}
                  className="font-mono text-[7px] leading-snug"
                  style={{ color: "oklch(0.4 0.06 220)" }}
                >
                  {e}
                </div>
              ))}
            </div>
          )}

          <div
            className="font-mono text-[7px]"
            style={{ color: recColors[report.recommendation] }}
          >
            {report.recommendationReason}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Richer Regime Events ────────────────────────────────────────────────────────────────────
function RicherRegimeSection() {
  const events = richerRegimeDetector.getEvents();
  const indicators = richerRegimeDetector.getIndicators();
  const activeCount = richerRegimeDetector.getActiveCount();

  const levelColors = {
    1: {
      bg: "oklch(0.1 0.02 220 / 0.3)",
      color: "oklch(0.55 0.1 220)",
      border: "oklch(0.25 0.06 220 / 0.4)",
    },
    2: {
      bg: "oklch(0.1 0.02 270 / 0.3)",
      color: "oklch(0.6 0.15 270)",
      border: "oklch(0.3 0.1 270 / 0.4)",
    },
    3: {
      bg: "oklch(0.1 0.025 240 / 0.3)",
      color: "oklch(0.65 0.12 240)",
      border: "oklch(0.35 0.1 240 / 0.5)",
    },
  };

  return (
    <div className="space-y-3">
      {/* Disclaimer */}
      <div
        className="rounded px-2 py-1.5"
        style={{
          background: "oklch(0.09 0.01 265)",
          border: "1px solid oklch(0.2 0.04 255 / 0.5)",
        }}
      >
        <div
          className="font-mono text-[7px] leading-relaxed"
          style={{ color: "oklch(0.4 0.06 220)" }}
        >
          Pre-registered indicators. Claim levels enforced before results are
          observed. Not a consciousness detector. Level 1: better adaptive
          behavior. Level 2: richer emergence substrate. Level 3: possible
          deeper regime shift — warrants study.
        </div>
      </div>

      {/* Indicator status */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="font-mono text-[7px] tracking-widest uppercase"
            style={{ color: "oklch(0.38 0.06 220)" }}
          >
            Pre-Registered Indicators ({activeCount}/10)
          </span>
          <Progress value={activeCount * 10} className="h-1 w-24" />
        </div>
        <div className="grid grid-cols-2 gap-1">
          {indicators.map((ind, i) => (
            <div
              key={ind.id}
              data-ocid={`report.indicator.item.${i + 1}`}
              className="flex items-center gap-1.5 px-2 py-1 rounded"
              style={{
                background: ind.active
                  ? "oklch(0.1 0.025 270 / 0.2)"
                  : "oklch(0.08 0.01 265)",
                border: `1px solid ${ind.active ? "oklch(0.3 0.08 270 / 0.4)" : "oklch(0.15 0.03 255 / 0.4)"}`,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: ind.active
                    ? "oklch(0.65 0.2 270)"
                    : "oklch(0.28 0.05 255)",
                  flexShrink: 0,
                }}
              />
              <span
                className="font-mono text-[7px] leading-tight truncate"
                style={{
                  color: ind.active
                    ? "oklch(0.6 0.12 270)"
                    : "oklch(0.35 0.05 220)",
                }}
              >
                {ind.label}
              </span>
              {ind.active && (
                <span
                  className="font-mono text-[6px] ml-auto shrink-0"
                  style={{ color: "oklch(0.55 0.1 270)" }}
                >
                  {(ind.strength * 100).toFixed(0)}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Events */}
      {events.length === 0 ? (
        <div
          data-ocid="report.richer_regime.empty_state"
          className="rounded px-3 py-3 text-center"
          style={{
            background: "oklch(0.08 0.01 265)",
            border: "1px solid oklch(0.16 0.03 255)",
          }}
        >
          <span
            className="font-mono text-[8px]"
            style={{ color: "oklch(0.3 0.05 220)" }}
          >
            No candidate events yet — run simulation to accumulate indicators
          </span>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div
            className="font-mono text-[7px] tracking-widest uppercase"
            style={{ color: "oklch(0.38 0.06 220)" }}
          >
            Candidate Events ({events.length})
          </div>
          {events
            .slice(-10)
            .reverse()
            .map((ev, i) => {
              const lc = levelColors[ev.claimLevel];
              return (
                <div
                  key={`${ev.tick}-${ev.coOccurrenceScore}-${ev.claimLevel}`}
                  data-ocid={`report.regime.item.${i + 1}`}
                  className="rounded p-2"
                  style={{
                    background: lc.bg,
                    border: `1px solid ${lc.border}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Badge
                      style={{
                        background: `${lc.color} / 0.15`,
                        color: lc.color,
                        fontSize: "6px",
                        letterSpacing: "0.08em",
                        padding: "1px 4px",
                      }}
                    >
                      {ev.claimLabel}
                    </Badge>
                    <span
                      className="font-mono text-[7px]"
                      style={{ color: "oklch(0.38 0.05 220)" }}
                    >
                      tick {ev.tick} · {ev.coOccurrenceScore}/10
                    </span>
                  </div>
                  <div
                    className="font-mono text-[7px] leading-snug"
                    style={{ color: lc.color }}
                  >
                    {ev.claimDescription}
                  </div>
                  {ev.claimLevel === 3 && (
                    <div
                      className="mt-1 rounded px-1.5 py-0.5 font-mono text-[6px] tracking-wide"
                      style={{
                        background: "oklch(0.12 0.03 240 / 0.4)",
                        color: "oklch(0.55 0.1 240)",
                      }}
                    >
                      WARRANTS STUDY — not a detection claim
                    </div>
                  )}
                  <div
                    className="font-mono text-[6px] mt-1 leading-snug"
                    style={{ color: "oklch(0.35 0.05 220)" }}
                  >
                    {ev.noteForResearcher}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

// ── Promotion Report ────────────────────────────────────────────────────────────────────────
function PromotionSection({ report }: { report: PromotionReport }) {
  const verdictStyle = {
    promote: {
      color: "oklch(0.7 0.22 145)",
      bg: "oklch(0.1 0.025 145 / 0.4)",
      border: "oklch(0.3 0.12 145 / 0.4)",
    },
    "hold-experimental": {
      color: "oklch(0.7 0.18 60)",
      bg: "oklch(0.1 0.025 60 / 0.4)",
      border: "oklch(0.35 0.12 60 / 0.4)",
    },
    reject: {
      color: "oklch(0.65 0.2 25)",
      bg: "oklch(0.1 0.025 25 / 0.4)",
      border: "oklch(0.3 0.12 25 / 0.4)",
    },
  };
  const vs = verdictStyle[report.promotionVerdict];

  return (
    <div
      className="rounded p-3 space-y-2"
      style={{ border: `1px solid ${vs.border}`, background: vs.bg }}
    >
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-[8px] tracking-widest uppercase"
          style={{ color: "oklch(0.45 0.07 220)" }}
        >
          Promotion Report
        </span>
        <Badge
          data-ocid="report.promotion.primary_button"
          style={{
            background: `${vs.color} / 0.15`,
            color: vs.color,
            fontSize: "7px",
          }}
        >
          {report.promotionVerdict.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-1">
        {(Object.entries(report.gateResults) as [string, boolean][]).map(
          ([key, passed], i) => (
            <div
              key={key}
              data-ocid={`report.gate.item.${i + 1}`}
              className="flex items-center gap-2"
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: passed
                    ? "oklch(0.7 0.22 145)"
                    : "oklch(0.5 0.18 25)",
                  flexShrink: 0,
                }}
              />
              <span
                className="font-mono text-[7px]"
                style={{
                  color: passed ? "oklch(0.65 0.15 145)" : "oklch(0.5 0.1 25)",
                }}
              >
                {key.replace(/([A-Z])/g, " $1").toLowerCase()}
              </span>
            </div>
          ),
        )}
      </div>

      <div className="font-mono text-[7px]" style={{ color: vs.color }}>
        {report.promotionReason}
      </div>
    </div>
  );
}

// ── Experiment Reports Section ──────────────────────────────────────────────────────────────
function ExperimentReportsSection() {
  const records = coreBrainRecordSystem.getRecords();
  const experiments = [...new Set(records.map((r) => r.metadata.experimentId))];
  const [selectedExp, setSelectedExp] = useState<string>(
    experiments[experiments.length - 1] ?? "",
  );

  // Generate reports for latest experiment
  const result: ExperimentResult | null = selectedExp
    ? (() => {
        const expRecords = coreBrainRecordSystem.getByExperiment(selectedExp);
        const baselineRecords = expRecords.filter(
          (r) => r.metadata.instanceType === "baseline",
        );
        const brainRecords = expRecords.filter(
          (r) => r.metadata.instanceType === "brain-powered",
        );
        const decoupledRecords = expRecords.filter(
          (r) => r.metadata.instanceType === "decoupled-control",
        );
        if (expRecords.length === 0) return null;

        const avg = (arr: number[]) =>
          arr.reduce((s, v) => s + v, 0) / Math.max(1, arr.length);
        const usefulBehaviorDelta =
          avg(brainRecords.map((r) => r.behavior.taskSuccess)) -
          avg(baselineRecords.map((r) => r.behavior.taskSuccess));
        const emergenceDelta =
          avg(brainRecords.map((r) => r.emergence.emergenceScore)) -
          avg(baselineRecords.map((r) => r.emergence.emergenceScore));
        const efficiencyDelta =
          avg(brainRecords.map((r) => r.efficiency.sparseActivationRatio)) -
          avg(baselineRecords.map((r) => r.efficiency.sparseActivationRatio));
        const regulationDelta =
          avg(brainRecords.map((r) => r.regulation.autonomicBalanceStability)) -
          avg(
            baselineRecords.map((r) => r.regulation.autonomicBalanceStability),
          );

        return {
          experimentId: selectedExp,
          completedAt:
            expRecords[expRecords.length - 1]?.metadata.timestamp ?? Date.now(),
          totalRuns: expRecords.length,
          baselineRecords,
          brainRecords,
          decoupledRecords,
          usefulBehaviorDelta,
          emergenceDelta,
          efficiencyDelta,
          regulationDelta,
          promotionCandidate: usefulBehaviorDelta > 0.05,
          milestonePassed:
            usefulBehaviorDelta > 0 && baselineRecords.length >= 2,
          milestoneFailReasons: [],
          status: "complete" as const,
        };
      })()
    : null;

  const quickReport = result
    ? coreBrainReportPipeline.generateQuickSummary(result)
    : null;
  const detailedReport = result
    ? coreBrainReportPipeline.generateDetailedReport(result)
    : null;
  const promotionReport = result
    ? coreBrainReportPipeline.generatePromotionReport(result)
    : null;

  const handleExport = () => {
    const csv = coreBrainRecordSystem.exportCSV(selectedExp || undefined);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `core_brain_${selectedExp || "all"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      {/* Experiment selector */}
      <div className="flex items-center gap-2">
        <span
          className="font-mono text-[7px] tracking-widest uppercase"
          style={{ color: "oklch(0.38 0.06 220)" }}
        >
          Experiment:
        </span>
        {experiments.length === 0 ? (
          <span
            className="font-mono text-[8px]"
            style={{ color: "oklch(0.3 0.05 220)" }}
          >
            None run yet — go to Experiments tab
          </span>
        ) : (
          <select
            data-ocid="report.select"
            value={selectedExp}
            onChange={(e) => setSelectedExp(e.target.value)}
            className="font-mono text-[8px] rounded px-1 py-0.5"
            style={{
              background: "oklch(0.1 0.015 265)",
              color: "oklch(0.6 0.1 210)",
              border: "1px solid oklch(0.22 0.05 255)",
            }}
          >
            {experiments.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        )}
        {records.length > 0 && (
          <Button
            data-ocid="report.secondary_button"
            onClick={handleExport}
            className="font-mono text-[7px] tracking-widest uppercase"
            style={{
              background: "oklch(0.15 0.04 255)",
              color: "oklch(0.55 0.1 220)",
              border: "1px solid oklch(0.22 0.05 255)",
              padding: "2px 8px",
              height: "auto",
            }}
          >
            Export CSV
          </Button>
        )}
      </div>

      {quickReport && <QuickSummarySection report={quickReport} />}
      {detailedReport && <DetailedReportSection report={detailedReport} />}
      {promotionReport?.eligible && (
        <PromotionSection report={promotionReport} />
      )}

      {!result && (
        <div
          data-ocid="report.experiments.empty_state"
          className="rounded px-3 py-3 text-center"
          style={{
            background: "oklch(0.08 0.01 265)",
            border: "1px solid oklch(0.16 0.03 255)",
          }}
        >
          <span
            className="font-mono text-[8px]"
            style={{ color: "oklch(0.3 0.05 220)" }}
          >
            No experiment data — run an experiment in the Experiments tab
          </span>
        </div>
      )}
    </div>
  );
}

// ── Main ReportTab ────────────────────────────────────────────────────────────────────────────
export default function ReportTab({
  neural,
  avgHz,
  pendingAlerts: _pendingAlerts,
  onNavigate: _onNavigate,
}: {
  neural: Neural;
  avgHz: number;
  pendingAlerts: number;
  onNavigate: (tab: string) => void;
}) {
  const [reportSection, setReportSection] = useState<
    "neural" | "experiments" | "regime" | "analytics"
  >("neural");
  const [analyticsReports, setAnalyticsReports] = useState<AnalyticsReport[]>(
    [],
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <PublicationAlertBanner
        alerts={neural.publicationAlerts ?? []}
        onDismiss={() => {}}
      />

      {/* Section tabs */}
      <div
        className="shrink-0 px-3 py-1 flex items-center gap-1 border-b"
        style={{
          borderColor: "oklch(0.16 0.04 255)",
          background: "oklch(0.065 0.01 265)",
        }}
      >
        {(
          [
            ["neural", "Neural Reports"],
            ["experiments", "Experiment Reports"],
            ["regime", "Richer-Regime Events"],
            ["analytics", "Analytics Reports"],
          ] as const
        ).map(([key, label]) => (
          <button
            type="button"
            key={key}
            data-ocid={`report.${key}.tab`}
            onClick={() => setReportSection(key)}
            className="font-mono text-[8px] tracking-widest uppercase px-2 py-0.5 rounded"
            style={{
              background:
                reportSection === key ? "oklch(0.18 0.05 255)" : "transparent",
              color:
                reportSection === key
                  ? "oklch(0.7 0.15 210)"
                  : "oklch(0.35 0.05 220)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden min-h-0">
        {reportSection === "neural" && (
          <div className="h-full flex overflow-hidden">
            {/* Left: session metrics */}
            <section
              className="flex flex-col border-r"
              style={{
                flex: "0 0 55%",
                overflow: "hidden",
                borderColor: "oklch(0.18 0.05 255)",
              }}
            >
              <div
                className="px-3 py-1.5 shrink-0 border-b"
                style={{
                  borderColor: "oklch(0.18 0.04 255)",
                  background: "oklch(0.07 0.012 265)",
                }}
              >
                <span
                  className="font-mono text-[9px] tracking-widest uppercase"
                  style={{ color: "oklch(0.38 0.06 220)" }}
                >
                  Session Report · Neural Activity · ANS Metrics
                </span>
              </div>
              <div className="flex-1 overflow-auto p-3">
                {/* Session stats */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {(
                    [
                      ["Avg Hz", `${avgHz.toFixed(1)}`],
                      [
                        "Active Regions",
                        `${(neural.sparseActivationRatio * 100).toFixed(0)}% sparse`,
                      ],
                      [
                        "Global Arousal",
                        `${(neural.globalArousal * 100).toFixed(0)}%`,
                      ],
                      ["Tick", `${neural.tick ?? 0}`],
                    ] as const
                  ).map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded p-2"
                      style={{
                        background: "oklch(0.09 0.015 265)",
                        border: "1px solid oklch(0.18 0.04 255)",
                      }}
                    >
                      <div
                        className="font-mono text-[7px] tracking-widest uppercase"
                        style={{ color: "oklch(0.38 0.06 220)" }}
                      >
                        {label}
                      </div>
                      <div
                        className="font-mono text-[11px] font-bold mt-0.5"
                        style={{ color: "oklch(0.7 0.15 210)" }}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Top regions */}
                <div
                  className="font-mono text-[7px] tracking-widest uppercase mb-1"
                  style={{ color: "oklch(0.38 0.06 220)" }}
                >
                  Top active regions
                </div>
                {neural.regions
                  .slice()
                  .sort((a, b) => b.activation - a.activation)
                  .slice(0, 8)
                  .map((r, i) => (
                    <div
                      key={r.region as string}
                      data-ocid={`report.region.item.${i + 1}`}
                      className="flex items-center gap-2 mb-0.5"
                    >
                      <span
                        className="font-mono text-[7px] truncate"
                        style={{
                          color: "oklch(0.5 0.08 220)",
                          width: 120,
                          flexShrink: 0,
                        }}
                      >
                        {(r.region as string).slice(0, 22)}
                      </span>
                      <div
                        className="flex-1 h-1 rounded-full"
                        style={{ background: "oklch(0.12 0.02 255)" }}
                      >
                        <div
                          className="h-1 rounded-full"
                          style={{
                            width: `${r.activation * 100}%`,
                            background:
                              r.activation > 0.7
                                ? "oklch(0.65 0.22 25)"
                                : r.activation > 0.4
                                  ? "oklch(0.65 0.18 60)"
                                  : "oklch(0.55 0.15 210)",
                          }}
                        />
                      </div>
                      <span
                        className="font-mono text-[7px] shrink-0"
                        style={{
                          color: "oklch(0.45 0.07 220)",
                          width: 32,
                          textAlign: "right",
                        }}
                      >
                        {(r.activation * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
              </div>
            </section>

            {/* Right: STDP table */}
            <section className="flex flex-col flex-1 overflow-hidden min-h-0">
              <div
                className="px-3 py-1.5 shrink-0 border-b"
                style={{
                  borderColor: "oklch(0.18 0.04 255)",
                  background: "oklch(0.07 0.012 265)",
                }}
              >
                <span
                  className="font-mono text-[9px] tracking-widest uppercase"
                  style={{ color: "oklch(0.38 0.06 220)" }}
                >
                  STDP Weight Changes · Top 20 by Delta · With Source Tag
                </span>
              </div>
              <div className="flex-1 overflow-hidden min-h-0">
                <StdpWeightTable weights={neural.stdpWeightSummary} />
              </div>
            </section>
          </div>
        )}

        {reportSection === "experiments" && (
          <div className="h-full overflow-y-auto px-4 py-3">
            <ExperimentReportsSection />
          </div>
        )}

        {reportSection === "regime" && (
          <div className="h-full overflow-y-auto px-4 py-3">
            <RicherRegimeSection />
          </div>
        )}

        {reportSection === "analytics" && (
          <div className="h-full overflow-y-auto px-4 py-3">
            <div className="mb-3 flex items-center gap-3">
              <span
                className="font-mono text-[9px] tracking-widest uppercase font-bold"
                style={{ color: "oklch(0.62 0.1 210)" }}
              >
                Architecture Analytics Reports
              </span>
              <button
                type="button"
                data-ocid="report.analytics.generate_button"
                onClick={() => {
                  const rpts = generateAllAnalyticsReports();
                  setAnalyticsReports(rpts);
                  createArtifact({
                    artifact_type: "report",
                    source_system: "core",
                    title: "Analytics Reports Bundle",
                    summary: `Generated ${rpts.length} analytics reports from live system state`,
                    score: rpts.length > 0 ? Math.min(100, rpts.length * 8) : 0,
                    status: "info",
                    tags: ["analytics", "reports", "bundle"],
                    metadata: { report_count: rpts.length },
                    related_artifact_ids: [],
                    version: "1.0.0",
                  });
                }}
                className="font-mono text-[8px] tracking-widest uppercase px-3 py-1 rounded border ml-auto"
                style={{
                  background: "oklch(0.10 0.025 265)",
                  borderColor: "oklch(0.28 0.07 210)",
                  color: "oklch(0.72 0.18 210)",
                }}
              >
                GENERATE ALL REPORTS
              </button>
            </div>
            {analyticsReports.length === 0 ? (
              <div
                className="flex items-center justify-center h-32 rounded border"
                style={{
                  borderColor: "oklch(0.18 0.04 255)",
                  background: "oklch(0.07 0.01 265)",
                }}
              >
                <span
                  className="font-mono text-[9px]"
                  style={{ color: "oklch(0.35 0.05 220)" }}
                >
                  Press GENERATE ALL REPORTS to evaluate the system
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {analyticsReports.map((report, idx) => {
                  const statusColor =
                    report.status === "PASS"
                      ? "oklch(0.72 0.22 145)"
                      : report.status === "WARN"
                        ? "oklch(0.80 0.26 85)"
                        : "oklch(0.72 0.28 25)";
                  const statusBg =
                    report.status === "PASS"
                      ? "oklch(0.14 0.04 145)"
                      : report.status === "WARN"
                        ? "oklch(0.14 0.04 85)"
                        : "oklch(0.14 0.04 25)";
                  return (
                    <div
                      key={report.id}
                      data-ocid={`report.analytics.item.${idx + 1}`}
                      className="rounded border p-3"
                      style={{
                        borderColor: "oklch(0.18 0.04 255)",
                        background: "oklch(0.07 0.01 265)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="font-mono text-[9px] font-bold"
                          style={{ color: "oklch(0.72 0.12 210)" }}
                        >
                          {report.title}
                        </span>
                        <span
                          className="font-mono text-[7px] px-1.5 py-0.5 rounded ml-auto"
                          style={{ background: statusBg, color: statusColor }}
                        >
                          {report.status}
                        </span>
                      </div>
                      <p
                        className="font-mono text-[8px] mb-2 leading-relaxed"
                        style={{ color: "oklch(0.50 0.07 220)" }}
                      >
                        {report.summary}
                      </p>
                      {/* Metrics table */}
                      <div className="mb-2">
                        <table
                          className="w-full text-[7px] font-mono"
                          style={{ borderCollapse: "collapse" }}
                        >
                          <tbody>
                            {report.metrics.map((m) => {
                              const mColor =
                                m.status === "PASS"
                                  ? "oklch(0.72 0.22 145)"
                                  : m.status === "WARN"
                                    ? "oklch(0.80 0.26 85)"
                                    : "oklch(0.72 0.28 25)";
                              return (
                                <tr key={m.label}>
                                  <td
                                    style={{
                                      color: "oklch(0.35 0.05 220)",
                                      paddingRight: "8px",
                                      paddingBottom: "2px",
                                    }}
                                  >
                                    {m.label}
                                  </td>
                                  <td
                                    style={{
                                      color: "oklch(0.65 0.10 210)",
                                      paddingRight: "8px",
                                    }}
                                  >
                                    {String(m.value)}
                                    {m.unit ? ` ${m.unit}` : ""}
                                  </td>
                                  <td>
                                    <span style={{ color: mColor }}>●</span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      {/* Findings */}
                      {report.findings.length > 0 && (
                        <div className="mb-1.5">
                          <span
                            className="font-mono text-[7px] uppercase tracking-widest"
                            style={{ color: "oklch(0.38 0.06 220)" }}
                          >
                            Findings
                          </span>
                          <ul className="mt-0.5">
                            {report.findings.map((f, fi) => (
                              <li
                                // biome-ignore lint/suspicious/noArrayIndexKey: static string list
                                key={fi}
                                className="font-mono text-[7px]"
                                style={{ color: "oklch(0.48 0.07 220)" }}
                              >
                                · {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {/* Recommendations */}
                      {report.recommendations.length > 0 && (
                        <div>
                          <span
                            className="font-mono text-[7px] uppercase tracking-widest"
                            style={{ color: "oklch(0.38 0.06 220)" }}
                          >
                            Recommendations
                          </span>
                          <ul className="mt-0.5">
                            {report.recommendations.map((r, ri) => (
                              <li
                                // biome-ignore lint/suspicious/noArrayIndexKey: static string list
                                key={ri}
                                className="font-mono text-[7px] italic"
                                style={{ color: "oklch(0.42 0.06 220)" }}
                              >
                                · {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
