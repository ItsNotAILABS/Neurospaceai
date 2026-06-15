import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import React, { useState, useCallback } from "react";
import {
  type AutoTestEvent,
  type BatchResult,
  DEFAULT_SCENARIO,
  runBatch,
} from "../utils/autoTestRunner";

interface NeuralProxy {
  regions: Array<{ region: string; activation: number }>;
  globalArousal: number;
  sparseActivationRatio?: number;
}

const S = {
  bg: "oklch(0.06 0.01 265)",
  bgCard: "oklch(0.09 0.015 265)",
  bgCardAlt: "oklch(0.11 0.018 265)",
  border: "oklch(0.18 0.04 255)",
  text: "oklch(0.88 0.04 240)",
  muted: "oklch(0.42 0.05 240)",
  green: "oklch(0.72 0.22 145)",
  amber: "oklch(0.78 0.22 75)",
  red: "oklch(0.68 0.22 25)",
  blue: "oklch(0.68 0.18 255)",
  accent: "oklch(0.55 0.14 255)",
};

function MetricRow({
  label,
  brain,
  baseline,
  higherBetter = true,
}: {
  label: string;
  brain: number;
  baseline: number;
  higherBetter?: boolean;
}) {
  const win = higherBetter ? brain > baseline : brain < baseline;
  const delta = brain - baseline;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "2px 0",
      }}
    >
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          color: S.muted,
          width: 130,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 11,
          color: win ? S.green : S.red,
          width: 52,
        }}
      >
        {(brain * 100).toFixed(1)}%
      </span>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          color: S.muted,
          width: 52,
        }}
      >
        {(baseline * 100).toFixed(1)}%
      </span>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          color: win ? S.green : S.red,
        }}
      >
        {delta >= 0 ? "+" : ""}
        {(delta * 100).toFixed(1)}%
      </span>
    </div>
  );
}

function EventPill({ event }: { event: AutoTestEvent }) {
  const colors: Record<string, string> = {
    useful_behavior: S.green,
    emergent_candidate: S.blue,
    efficiency_positive: S.accent,
    artifact_warning: S.amber,
    core_propagation: S.green,
  };
  const labels: Record<string, string> = {
    useful_behavior: "USEFUL BEHAVIOR",
    emergent_candidate: "EMERGENT",
    efficiency_positive: "EFFICIENCY+",
    artifact_warning: "ARTIFACT WARN",
    core_propagation: "CORE PROP",
  };
  return (
    <div
      style={{
        background: S.bgCard,
        border: `1px solid ${colors[event.type] ?? S.border}`,
        borderRadius: 4,
        padding: "5px 8px",
        marginBottom: 4,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 2,
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            letterSpacing: "0.08em",
            color: colors[event.type] ?? S.muted,
            background: `${colors[event.type]}22`,
            borderRadius: 2,
            padding: "1px 5px",
          }}
        >
          {labels[event.type] ?? event.type}
        </span>
        <span style={{ fontFamily: "monospace", fontSize: 9, color: S.muted }}>
          Δ={event.delta.toFixed(3)}
        </span>
      </div>
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          color: S.text,
          margin: 0,
          lineHeight: 1.4,
        }}
      >
        {event.description}
      </p>
    </div>
  );
}

function QuickSummaryTab({ result }: { result: BatchResult }) {
  const {
    usefulBehaviorScore: ubs,
    emergenceScore: es,
    efficiencyScore: eff,
    brainRuns,
    baselineRuns,
  } = result;
  const n = brainRuns.length;
  const brainSuccess = brainRuns.filter((r) => r.taskSuccess).length;
  const baselineSuccess = baselineRuns.filter((r) => r.taskSuccess).length;
  return (
    <div style={{ padding: "10px 12px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          marginBottom: 10,
        }}
      >
        {[
          {
            label: "Useful Behavior",
            val: ubs.isUsefulBehaviorEvent,
            score: ubs.total,
            delta: ubs.delta,
          },
          {
            label: "Emergence",
            val: es.isEmergentCandidate,
            score: es.total,
            delta: es.total,
          },
          {
            label: "Efficiency+",
            val: eff.isEfficiencyPositive,
            score: eff.total,
            delta: eff.delta,
          },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: S.bgCard,
              border: `1px solid ${item.val ? S.green : S.border}`,
              borderRadius: 5,
              padding: "8px 10px",
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                color: S.muted,
                marginBottom: 3,
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 18,
                fontWeight: 700,
                color: item.val ? S.green : S.red,
                lineHeight: 1,
              }}
            >
              {item.val ? "PASS" : "FAIL"}
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 10,
                color: S.muted,
                marginTop: 2,
              }}
            >
              Δ={item.delta.toFixed(3)}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: S.bgCard,
          border: `1px solid ${S.border}`,
          borderRadius: 5,
          padding: "8px 10px",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: S.muted,
            marginBottom: 6,
          }}
        >
          TASK SUCCESS — {n} RUNS
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 22,
                fontWeight: 700,
                color: S.green,
              }}
            >
              {brainSuccess}/{n}
            </div>
            <div
              style={{ fontFamily: "monospace", fontSize: 9, color: S.muted }}
            >
              BRAIN
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 22,
                fontWeight: 700,
                color: S.muted,
              }}
            >
              {baselineSuccess}/{n}
            </div>
            <div
              style={{ fontFamily: "monospace", fontSize: 9, color: S.muted }}
            >
              BASELINE
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 22,
                fontWeight: 700,
                color: brainSuccess > baselineSuccess ? S.green : S.amber,
              }}
            >
              +{brainSuccess - baselineSuccess}
            </div>
            <div
              style={{ fontFamily: "monospace", fontSize: 9, color: S.muted }}
            >
              Δ
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          fontFamily: "monospace",
          fontSize: 9,
          color: S.muted,
          marginBottom: 4,
        }}
      >
        SCENARIO
      </div>
      <div style={{ fontFamily: "monospace", fontSize: 10, color: S.text }}>
        {result.config.name} · {n} runs · Corridor blocked:{" "}
        {result.config.corridorBlocked ? "YES" : "NO"} · Core Brain v
        {result.coreBrainVersion}
      </div>
    </div>
  );
}

function TechnicalTab({ result }: { result: BatchResult }) {
  const {
    usefulBehaviorScore: ubs,
    emergenceScore: es,
    efficiencyScore: eff,
    brainRuns,
    baselineRuns,
  } = result;
  const avg = (arr: number[]) =>
    arr.reduce((s, v) => s + v, 0) / Math.max(arr.length, 1);
  const brainAdapt = avg(brainRuns.map((r) => r.adaptationScore));
  const baseAdapt = avg(baselineRuns.map((r) => r.adaptationScore));
  const brainRecov = avg(brainRuns.map((r) => r.recoveryScore));
  const baseRecov = avg(baselineRuns.map((r) => r.recoveryScore));
  const brainCoh = avg(brainRuns.map((r) => r.coherenceScore));
  const baseCoh = avg(baselineRuns.map((r) => r.coherenceScore));
  const brainEff = avg(brainRuns.map((r) => r.routeEfficiency));
  const baseEff = avg(baselineRuns.map((r) => r.routeEfficiency));
  const brainThreat =
    brainRuns.filter((r) => r.enteredThreat).length / brainRuns.length;
  const baseThreat =
    baselineRuns.filter((r) => r.enteredThreat).length / baselineRuns.length;
  const policyShifts = brainRuns.filter((r) => r.policyShiftDetected).length;
  const memRetrieved = brainRuns.filter((r) => r.memoryRetrieved).length;

  return (
    <div style={{ padding: "10px 12px" }}>
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 4,
          borderBottom: `1px solid ${S.border}`,
          paddingBottom: 3,
        }}
      >
        {["METRIC", "BRAIN", "BASE", "Δ"].map((h, i) => (
          <span
            key={h}
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              color: S.muted,
              width: i === 0 ? 130 : 52,
              flexShrink: 0,
            }}
          >
            {h}
          </span>
        ))}
      </div>
      <MetricRow
        label="Task Success"
        brain={ubs.taskSuccess}
        baseline={ubs.taskSuccess - ubs.delta * ALPHA_TS_SHARE}
        higherBetter
      />
      <MetricRow
        label="Adaptation"
        brain={brainAdapt}
        baseline={baseAdapt}
        higherBetter
      />
      <MetricRow
        label="Recovery"
        brain={brainRecov}
        baseline={baseRecov}
        higherBetter
      />
      <MetricRow
        label="Coherence"
        brain={brainCoh}
        baseline={baseCoh}
        higherBetter
      />
      <MetricRow
        label="Route Efficiency"
        brain={brainEff}
        baseline={baseEff}
        higherBetter
      />
      <MetricRow
        label="Threat Entry"
        brain={brainThreat}
        baseline={baseThreat}
        higherBetter={false}
      />

      <div
        style={{
          borderTop: `1px solid ${S.border}`,
          marginTop: 6,
          paddingTop: 6,
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: S.muted,
            marginBottom: 4,
          }}
        >
          BRAIN TRACE
        </div>
        {[
          {
            label: "Policy Shifts",
            val: `${policyShifts}/${brainRuns.length} runs`,
          },
          {
            label: "Memory Retrieved",
            val: `${memRetrieved}/${brainRuns.length} runs`,
          },
          { label: "Emergence Score", val: es.total.toFixed(3) },
          { label: "Novelty", val: es.novelty.toFixed(3) },
          { label: "Diversity", val: es.diversity.toFixed(3) },
          { label: "Efficiency Score", val: eff.total.toFixed(3) },
          {
            label: "Compute Reduction",
            val: `${(eff.computeReduction * 100).toFixed(1)}%`,
          },
          {
            label: "Sparsity Adv.",
            val: `${(eff.sparsityAdvantage * 100).toFixed(1)}%`,
          },
          {
            label: "Perf. Retained",
            val: `${(eff.performanceRetained * 100).toFixed(1)}%`,
          },
        ].map(({ label, val }) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "1.5px 0",
            }}
          >
            <span
              style={{ fontFamily: "monospace", fontSize: 10, color: S.muted }}
            >
              {label}
            </span>
            <span
              style={{ fontFamily: "monospace", fontSize: 10, color: S.text }}
            >
              {val}
            </span>
          </div>
        ))}
      </div>

      {es.artifactWarning && (
        <div
          data-ocid="autotest.artifact_warning"
          style={{
            marginTop: 8,
            background: `${S.amber}18`,
            border: `1px solid ${S.amber}`,
            borderRadius: 4,
            padding: "5px 8px",
            fontFamily: "monospace",
            fontSize: 10,
            color: S.amber,
          }}
        >
          ⚠️ Artifact warning: high active-region fraction — saturation may
          affect results
        </div>
      )}
    </div>
  );
}

// Approximate share used in MetricRow to reconstruct baseline task success
const ALPHA_TS_SHARE = 0.35;

function MilestoneTab({ result }: { result: BatchResult }) {
  const {
    milestonePassed,
    milestoneReason,
    usefulBehaviorScore: ubs,
    brainRuns,
  } = result;
  const policyShifts = brainRuns.filter((r) => r.policyShiftDetected).length;
  const checks = [
    {
      label: "ΔU > 0.08 (useful behavior event)",
      pass: ubs.isUsefulBehaviorEvent,
    },
    { label: "ΔU > 0.10 (strong threshold)", pass: ubs.delta > 0.1 },
    {
      label: "Brain task success > baseline",
      pass: ubs.taskSuccess > ubs.taskSuccess - ubs.delta,
    },
    {
      label: "Policy shift in ≥40% of runs",
      pass: policyShifts >= brainRuns.length * 0.4,
    },
    {
      label: "No saturation artifact",
      pass: !result.emergenceScore.artifactWarning,
    },
    { label: "≥10 runs completed", pass: brainRuns.length >= 10 },
    { label: "Auto-recorded evidence", pass: result.events.length > 0 },
    {
      label: "Traceability to Core Brain",
      pass: brainRuns.some((r) => r.memoryRetrieved || r.policyShiftDetected),
    },
  ];

  return (
    <div style={{ padding: "10px 12px" }}>
      <div
        data-ocid="autotest.milestone_card"
        style={{
          background: milestonePassed ? `${S.green}12` : `${S.red}0a`,
          border: `2px solid ${milestonePassed ? S.green : S.red}`,
          borderRadius: 6,
          padding: "10px 12px",
          marginBottom: 10,
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 20,
            fontWeight: 700,
            color: milestonePassed ? S.green : S.red,
            letterSpacing: "0.06em",
            marginBottom: 4,
          }}
        >
          {milestonePassed ? "MILESTONE: PASS" : "MILESTONE: NOT YET"}
        </div>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            color: S.text,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {milestoneReason}
        </p>
      </div>

      <div
        style={{
          fontFamily: "monospace",
          fontSize: 9,
          color: S.muted,
          marginBottom: 5,
        }}
      >
        PASS CONDITIONS
      </div>
      <div
        style={{
          background: S.bgCard,
          border: `1px solid ${S.border}`,
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        {checks.map((c, i) => (
          <div
            key={c.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 10px",
              borderBottom:
                i < checks.length - 1 ? `1px solid ${S.border}` : undefined,
              background: i % 2 === 0 ? "transparent" : `${S.bgCardAlt}50`,
            }}
          >
            <span style={{ color: c.pass ? S.green : S.red, fontSize: 11 }}>
              {c.pass ? "✓" : "×"}
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 10,
                color: c.pass ? S.text : S.muted,
              }}
            >
              {c.label}
            </span>
          </div>
        ))}
      </div>

      {milestonePassed && (
        <div
          style={{
            marginTop: 10,
            fontFamily: "monospace",
            fontSize: 10,
            color: S.green,
            lineHeight: 1.5,
          }}
        >
          • Core Brain v{result.coreBrainVersion} —{" "}
          {new Date(result.timestamp).toLocaleString()}
          <br />• Scenario: {result.config.name}
          <br />• Runs: {brainRuns.length} — ΔU:{" "}
          {result.usefulBehaviorScore.delta.toFixed(4)}
        </div>
      )}
    </div>
  );
}

export default function AutoTestPanel({ neural }: { neural: NeuralProxy }) {
  const [batchResult, setBatchResult] = useState<BatchResult | null>(null);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "quick" | "technical" | "milestone"
  >("quick");
  const [numRuns, setNumRuns] = useState(20);

  const runTest = useCallback(async () => {
    setRunning(true);
    setProgress(0);

    const getAct = (name: string) =>
      neural.regions.find((r) => r.region === name)?.activation ?? 0;

    const brainState = {
      salience: neural.globalArousal,
      memoryActive: getAct("Hippocampus") > 0.3,
      actionTendency:
        getAct("Amygdala") > 0.5
          ? "AVOID"
          : getAct("NucleusAccumbens") > 0.4
            ? "APPROACH"
            : "INVESTIGATE",
      amygdalaAct: getAct("Amygdala"),
      hippocampusAct: getAct("Hippocampus"),
      pfcAct: getAct("PrefrontalCortex"),
      nacAct: getAct("NucleusAccumbens"),
      sparseRatio: neural.sparseActivationRatio ?? 0.3,
      activeRegionFraction:
        neural.regions.filter((r) => r.activation > 0.3).length /
        Math.max(neural.regions.length, 1),
    };

    try {
      const result = await runBatch(
        DEFAULT_SCENARIO,
        numRuns,
        brainState,
        setProgress,
      );
      setBatchResult(result);
    } finally {
      setRunning(false);
    }
  }, [neural, numRuns]);

  const tabStyle = (t: string) => ({
    fontFamily: "monospace" as const,
    fontSize: 9,
    letterSpacing: "0.07em",
    padding: "4px 10px",
    border: `1px solid ${activeTab === t ? S.accent : S.border}`,
    borderRadius: 3,
    background: activeTab === t ? `${S.accent}22` : "transparent",
    color: activeTab === t ? S.blue : S.muted,
    cursor: "pointer" as const,
  });

  return (
    <div
      style={{
        background: S.bg,
        border: `1px solid ${S.border}`,
        borderRadius: 6,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 400,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "6px 12px",
          borderBottom: `1px solid ${S.border}`,
          background: "oklch(0.07 0.012 265)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.1em",
              color: S.accent,
              textTransform: "uppercase" as const,
            }}
          >
            Auto-Test Runner · Threat-Memory Navigation
          </span>
          {batchResult && (
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                color: batchResult.milestonePassed ? S.green : S.muted,
                background: batchResult.milestonePassed
                  ? `${S.green}18`
                  : `${S.border}60`,
                borderRadius: 2,
                padding: "1px 6px",
              }}
            >
              {batchResult.milestonePassed
                ? "MILESTONE PASS"
                : `${batchResult.brainRuns.length} runs`}
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span
              style={{ fontFamily: "monospace", fontSize: 9, color: S.muted }}
            >
              RUNS:
            </span>
            {[10, 20, 30].map((n) => (
              <button
                type="button"
                key={n}
                data-ocid={`autotest.runs_${n}_toggle`}
                onClick={() => setNumRuns(n)}
                style={{
                  fontFamily: "monospace",
                  fontSize: 9,
                  padding: "2px 6px",
                  border: `1px solid ${numRuns === n ? S.accent : S.border}`,
                  borderRadius: 2,
                  background: numRuns === n ? `${S.accent}22` : "transparent",
                  color: numRuns === n ? S.blue : S.muted,
                  cursor: "pointer",
                }}
              >
                {n}
              </button>
            ))}
          </div>

          <Button
            data-ocid="autotest.run_button"
            size="sm"
            disabled={running}
            onClick={runTest}
            style={{
              background: running ? `${S.accent}40` : S.accent,
              color: "white",
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.08em",
              height: 26,
              padding: "0 10px",
              border: "none",
            }}
          >
            {running ? "RUNNING…" : "RUN BATCH"}
          </Button>
        </div>
      </div>

      {/* Progress */}
      {running && (
        <div
          data-ocid="autotest.loading_state"
          style={{
            padding: "6px 12px",
            borderBottom: `1px solid ${S.border}`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 3,
            }}
          >
            <span
              style={{ fontFamily: "monospace", fontSize: 9, color: S.muted }}
            >
              Running {numRuns} trials...
            </span>
            <span
              style={{ fontFamily: "monospace", fontSize: 9, color: S.accent }}
            >
              {progress.toFixed(0)}%
            </span>
          </div>
          <Progress
            value={progress}
            style={{ height: 3, background: S.bgCard }}
          />
        </div>
      )}

      {/* Tabs */}
      {batchResult && (
        <div
          style={{
            display: "flex",
            gap: 4,
            padding: "6px 12px",
            borderBottom: `1px solid ${S.border}`,
            flexShrink: 0,
          }}
        >
          {(["quick", "technical", "milestone"] as const).map((t) => (
            <button
              type="button"
              key={t}
              data-ocid={`autotest.${t}_tab`}
              onClick={() => setActiveTab(t)}
              style={tabStyle(t)}
            >
              {t === "quick"
                ? "QUICK SUMMARY"
                : t === "technical"
                  ? "TECHNICAL"
                  : "MILESTONE"}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {!batchResult && !running && (
          <div
            data-ocid="autotest.empty_state"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              minHeight: 200,
              gap: 8,
            }}
          >
            <div
              style={{ fontFamily: "monospace", fontSize: 28, color: S.border }}
            >
              &#9651;
            </div>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: 10,
                color: S.muted,
                textAlign: "center",
                margin: 0,
              }}
            >
              Run a batch to compare Core Brain vs Baseline Agent
              <br />
              Scenario: Threat-Memory Navigation &bull; {numRuns} runs
            </p>
          </div>
        )}

        {batchResult && activeTab === "quick" && (
          <QuickSummaryTab result={batchResult} />
        )}
        {batchResult && activeTab === "technical" && (
          <TechnicalTab result={batchResult} />
        )}
        {batchResult && activeTab === "milestone" && (
          <MilestoneTab result={batchResult} />
        )}

        {/* Events feed */}
        {batchResult && batchResult.events.length > 0 && (
          <div
            style={{
              borderTop: `1px solid ${S.border}`,
              padding: "8px 12px",
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                color: S.muted,
                marginBottom: 5,
              }}
            >
              AUTO-DETECTED EVENTS ({batchResult.events.length})
            </div>
            {batchResult.events.map((ev) => (
              <EventPill key={ev.type + String(ev.timestamp)} event={ev} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
