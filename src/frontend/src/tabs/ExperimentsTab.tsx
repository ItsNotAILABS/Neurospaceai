import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useRef, useState } from "react";
import AutoTestPanel from "../components/AutoTestPanel";
import { ExperimentLab } from "../components/ExperimentLab";
import { SimulationControls } from "../components/SimulationControls";
import type {
  NeuralSimulationControls,
  NeuralSimulationState,
} from "../hooks/useNeuralSimulation";
import {
  type ExperimentConfig,
  type ExperimentProgress,
  type ExperimentResult,
  coreBrainExperimentRunner,
} from "../utils/coreBrainExperimentRunner";
import { maturityTracker } from "../utils/maturityTracker";

type Neural = NeuralSimulationState & NeuralSimulationControls;

const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

// ── Maturity Dashboard ──────────────────────────────────────────────────────────────────
function MaturityDashboard({ neural }: { neural: Neural }) {
  // Derive maturity metrics from neural simulation state
  const saturationRate = clamp(
    neural.regions.filter((r) => r.activation > 0.85).length /
      Math.max(1, neural.regions.length),
  );
  const oscillationIndex = clamp(1 - neural.globalArousal * 0.8 - 0.1);
  const competitionScore = clamp(0.4 + neural.sparseActivationRatio * 0.4);
  const wmOccupancy = clamp(0.3 + neural.globalArousal * 0.4);
  const wmChurnRate = clamp(0.2 + (1 - neural.sparseActivationRatio) * 0.3);

  // Update tracker on each render
  maturityTracker.update({
    tick: neural.tick ?? 0,
    saturationRate,
    oscillationIndex,
    competitionScore,
    wmOccupancy,
    wmChurnRate,
    persistentTensionCount: Math.floor(neural.globalArousal * 5),
    ansModulationActive: neural.globalArousal > 0.2,
    predictionErrorActive: neural.sparseActivationRatio > 0.2,
    failureMemoryActive: (neural.tick ?? 0) > 50,
    sparseActivationRatio: neural.sparseActivationRatio,
    experimentRunnerLive: true,
    recordSystemLive: true,
    reportsGenerated: coreBrainExperimentRunner.getReportsGenerated(),
  });

  const state = maturityTracker.getState();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div
        className="px-3 py-1.5 shrink-0 border-b flex items-center justify-between"
        style={{
          borderColor: "oklch(0.18 0.04 255)",
          background: "oklch(0.07 0.012 265)",
        }}
      >
        <span
          className="font-mono text-[9px] tracking-widest uppercase"
          style={{ color: "oklch(0.38 0.06 220)" }}
        >
          Maturity Dashboard
        </span>
        <Badge
          data-ocid="maturity.primary_button"
          style={{
            background: state.isExperimentReady
              ? "oklch(0.55 0.2 145)"
              : "oklch(0.5 0.18 55)",
            color: "oklch(0.95 0.02 120)",
            fontSize: "8px",
            letterSpacing: "0.1em",
            padding: "2px 6px",
          }}
        >
          {state.isExperimentReady
            ? "EXPERIMENT-READY"
            : `${state.maturityScore}/9`}
        </Badge>
      </div>

      {/* Score bar */}
      <div
        className="px-3 py-2 shrink-0"
        style={{ borderBottom: "1px solid oklch(0.14 0.03 255)" }}
      >
        <div className="flex items-center justify-between mb-1">
          <span
            className="font-mono text-[8px]"
            style={{ color: "oklch(0.45 0.07 220)" }}
          >
            MATURITY
          </span>
          <span
            className="font-mono text-[10px] font-bold"
            style={{
              color: state.isExperimentReady
                ? "oklch(0.7 0.2 145)"
                : "oklch(0.65 0.18 55)",
            }}
          >
            {state.maturityScore}/9
          </span>
        </div>
        <Progress
          data-ocid="maturity.panel"
          value={state.maturityFraction * 100}
          className="h-1.5"
          style={{
            background: "oklch(0.14 0.03 255)",
          }}
        />
        <div
          className="mt-1 font-mono text-[7px] tracking-widest"
          style={{
            color: state.isExperimentReady
              ? "oklch(0.6 0.2 145)"
              : "oklch(0.5 0.12 55)",
          }}
        >
          {state.readinessLabel}
        </div>
      </div>

      {/* Conditions list */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {state.conditions.map((c, i) => (
          <div
            key={c.id}
            data-ocid={`maturity.item.${i + 1}`}
            className="flex items-start gap-2 px-2 py-1.5 rounded mb-0.5"
            style={{
              background: c.passed
                ? "oklch(0.1 0.025 145 / 0.4)"
                : "oklch(0.08 0.01 260 / 0.3)",
              border: `1px solid ${c.passed ? "oklch(0.3 0.1 145 / 0.4)" : "oklch(0.2 0.04 255 / 0.4)"}`,
            }}
          >
            <div
              className="shrink-0 mt-0.5"
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: c.passed
                  ? "oklch(0.7 0.22 145)"
                  : "oklch(0.5 0.18 55)",
                boxShadow: c.passed
                  ? "0 0 6px oklch(0.7 0.22 145 / 0.4)"
                  : "none",
              }}
            />
            <div className="flex-1 min-w-0">
              <div
                className="font-mono text-[8px] font-semibold tracking-wide truncate"
                style={{
                  color: c.passed
                    ? "oklch(0.75 0.15 145)"
                    : "oklch(0.55 0.08 220)",
                }}
              >
                {c.label}
              </div>
              <div
                className="font-mono text-[7px] mt-0.5 leading-tight"
                style={{ color: "oklch(0.35 0.05 220)", lineHeight: 1.3 }}
              >
                {c.evidence}
              </div>
            </div>
            <div
              className="shrink-0 font-mono text-[7px]"
              style={{
                color: c.passed ? "oklch(0.65 0.2 145)" : "oklch(0.45 0.12 55)",
              }}
            >
              {(c.score * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Experiment Runner Panel ─────────────────────────────────────────────────────────────
function ExperimentRunnerPanel({
  onResult,
}: {
  onResult: (r: ExperimentResult) => void;
}) {
  const [runCount, setRunCount] = useState(5);
  const [includeDecoupled, setIncludeDecoupled] = useState(false);
  const [ablations, setAblations] = useState({
    memoryLayer: false,
    predictionLayer: false,
    regulationLayer: false,
    recurrenceDepth: false,
    sparseUpdates: false,
  });
  const [progress, setProgress] = useState<ExperimentProgress | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const runIdRef = useRef(0);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    setProgress(null);
    runIdRef.current++;
    const expId = `exp_${Date.now()}_${runIdRef.current}`;

    const scenario = coreBrainExperimentRunner.getDefaultThreatMemoryScenario();
    const seeds = Array.from({ length: runCount }, (_, i) => 42 + i * 7);

    const enabledModules = [
      "memory",
      "prediction",
      "regulation",
      "recurrence",
      "sparse",
    ].filter((m) => {
      const abl = ablations as Record<string, boolean>;
      const keyMap: Record<string, string> = {
        memory: "memoryLayer",
        prediction: "predictionLayer",
        regulation: "regulationLayer",
        recurrence: "recurrenceDepth",
        sparse: "sparseUpdates",
      };
      return !abl[keyMap[m]];
    });

    const config: ExperimentConfig = {
      experimentId: expId,
      scenario,
      baselineConfig: {
        type: "baseline",
        enabledModules: [],
        coreBrainVersion: "v1-baseline",
      },
      brainConfig: {
        type: "brain-powered",
        enabledModules,
        coreBrainVersion: "v3.7",
      },
      runCount,
      seeds,
      includeDecoupledControl: includeDecoupled,
      metricProfile: "standard",
      captureStateTrace: true,
      ablations,
    };

    try {
      const result = await coreBrainExperimentRunner.runExperiment(
        config,
        (p) => setProgress(p),
      );
      onResult(result);
    } catch (e) {
      setError(String(e));
    } finally {
      setIsRunning(false);
    }
  }, [runCount, includeDecoupled, ablations, onResult]);

  const toggleAblation = (key: keyof typeof ablations) => {
    setAblations((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const phaseColors: Record<string, string> = {
    baseline: "oklch(0.55 0.1 220)",
    brain: "oklch(0.65 0.2 145)",
    decoupled: "oklch(0.55 0.15 280)",
    analysis: "oklch(0.6 0.15 60)",
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
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
          Experiment Runner · Threat-Memory Navigation
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
        {/* Scenario info */}
        <div
          className="rounded p-2"
          style={{
            background: "oklch(0.09 0.015 265)",
            border: "1px solid oklch(0.18 0.04 255)",
          }}
        >
          <div
            className="font-mono text-[8px] tracking-widest uppercase mb-1"
            style={{ color: "oklch(0.45 0.08 220)" }}
          >
            Scenario
          </div>
          <div
            className="font-mono text-[9px]"
            style={{ color: "oklch(0.7 0.12 210)" }}
          >
            Threat-Memory Navigation
          </div>
          <div
            className="font-mono text-[7px] mt-0.5 leading-snug"
            style={{ color: "oklch(0.38 0.05 220)" }}
          >
            10×10 grid · Reward at (8,8) · Threat at (5,5) · Path blocks at tick
            50
          </div>
          <div
            className="font-mono text-[7px] mt-0.5"
            style={{ color: "oklch(0.35 0.05 220)" }}
          >
            Primary: task success while avoiding threat · Secondary: route
            efficiency, adaptation speed
          </div>
        </div>

        {/* Run count */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span
              className="font-mono text-[8px] tracking-widest uppercase"
              style={{ color: "oklch(0.45 0.07 220)" }}
            >
              Runs per agent
            </span>
            <span
              className="font-mono text-[10px] font-bold"
              style={{ color: "oklch(0.7 0.15 210)" }}
            >
              {runCount}
            </span>
          </div>
          <Slider
            data-ocid="experiment.select"
            min={1}
            max={30}
            step={1}
            value={[runCount]}
            onValueChange={([v]) => setRunCount(v)}
            disabled={isRunning}
            className="w-full"
          />
        </div>

        {/* Ablation toggles */}
        <div>
          <div
            className="font-mono text-[8px] tracking-widest uppercase mb-1.5"
            style={{ color: "oklch(0.45 0.07 220)" }}
          >
            Ablation controls (disable module)
          </div>
          <div className="space-y-1">
            {(
              [
                ["memoryLayer", "Memory Layer"],
                ["predictionLayer", "Prediction Layer"],
                ["regulationLayer", "Regulation Layer"],
                ["recurrenceDepth", "Recurrence Depth"],
                ["sparseUpdates", "Sparse Updates"],
              ] as const
            ).map(([key, label], i) => (
              <div
                key={key}
                data-ocid={`experiment.toggle.${i + 1}`}
                className="flex items-center justify-between px-2 py-1 rounded"
                style={{
                  background: "oklch(0.09 0.01 265)",
                  border: "1px solid oklch(0.16 0.03 255)",
                }}
              >
                <span
                  className="font-mono text-[8px]"
                  style={{
                    color: ablations[key]
                      ? "oklch(0.55 0.18 25)"
                      : "oklch(0.55 0.08 220)",
                  }}
                >
                  {label} {ablations[key] ? "— ABLATED" : ""}
                </span>
                <Switch
                  checked={ablations[key]}
                  onCheckedChange={() => toggleAblation(key)}
                  disabled={isRunning}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Decoupled control */}
        <div
          className="flex items-center justify-between px-2 py-1.5 rounded"
          style={{
            background: "oklch(0.09 0.01 265)",
            border: "1px solid oklch(0.16 0.03 255)",
          }}
        >
          <span
            className="font-mono text-[8px]"
            style={{ color: "oklch(0.5 0.08 220)" }}
          >
            Include decoupled/shuffled control
          </span>
          <Switch
            data-ocid="experiment.switch"
            checked={includeDecoupled}
            onCheckedChange={setIncludeDecoupled}
            disabled={isRunning}
          />
        </div>

        {/* Run button */}
        <Button
          data-ocid="experiment.primary_button"
          onClick={handleRun}
          disabled={isRunning}
          className="w-full font-mono text-[9px] tracking-widest uppercase"
          style={{
            background: isRunning
              ? "oklch(0.22 0.05 255)"
              : "oklch(0.45 0.18 240)",
            color: "oklch(0.9 0.05 210)",
            border: "none",
          }}
        >
          {isRunning ? "Running…" : "Run Experiment"}
        </Button>

        {/* Progress */}
        {isRunning && progress && (
          <div
            data-ocid="experiment.loading_state"
            className="rounded p-2 space-y-1.5"
            style={{
              background: "oklch(0.09 0.015 265)",
              border: "1px solid oklch(0.2 0.05 255)",
            }}
          >
            <div className="flex items-center justify-between">
              <Badge
                style={{
                  background: `${phaseColors[progress.currentPhase]} / 0.15`,
                  color: phaseColors[progress.currentPhase],
                  fontSize: "7px",
                  letterSpacing: "0.1em",
                  padding: "1px 5px",
                  border: `1px solid ${phaseColors[progress.currentPhase]} / 0.4`,
                }}
              >
                {progress.currentPhase.toUpperCase()}
              </Badge>
              <span
                className="font-mono text-[8px]"
                style={{ color: "oklch(0.5 0.08 220)" }}
              >
                {progress.currentRun}/{progress.totalRuns}
              </span>
            </div>
            <Progress value={progress.progressFraction * 100} className="h-1" />
            <div
              className="font-mono text-[7px] truncate"
              style={{ color: "oklch(0.4 0.06 220)" }}
            >
              {progress.lastEvent}
            </div>
          </div>
        )}

        {error && (
          <div
            data-ocid="experiment.error_state"
            className="rounded px-2 py-1.5"
            style={{
              background: "oklch(0.1 0.02 25 / 0.4)",
              border: "1px solid oklch(0.35 0.15 25 / 0.5)",
            }}
          >
            <span
              className="font-mono text-[8px]"
              style={{ color: "oklch(0.65 0.2 25)" }}
            >
              {error}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Results Panel ───────────────────────────────────────────────────────────────────────
function ResultsPanel({ result }: { result: ExperimentResult | null }) {
  if (!result) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
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
            Results
          </span>
        </div>
        <div
          data-ocid="results.empty_state"
          className="flex-1 flex items-center justify-center"
        >
          <span
            className="font-mono text-[9px] tracking-widest"
            style={{ color: "oklch(0.3 0.05 220)" }}
          >
            No experiment run yet
          </span>
        </div>
      </div>
    );
  }

  const deltaColor = (d: number) =>
    d > 0.03
      ? "oklch(0.7 0.22 145)"
      : d < -0.03
        ? "oklch(0.65 0.22 25)"
        : "oklch(0.55 0.1 60)";
  const deltaLabel = (d: number) =>
    `${(d > 0 ? "+" : "") + (d * 100).toFixed(1)}%`;

  const verdictStyle = {
    keep: {
      bg: "oklch(0.12 0.03 145 / 0.5)",
      color: "oklch(0.7 0.22 145)",
      border: "oklch(0.3 0.12 145 / 0.4)",
    },
    revise: {
      bg: "oklch(0.12 0.03 60 / 0.5)",
      color: "oklch(0.7 0.18 60)",
      border: "oklch(0.35 0.12 60 / 0.4)",
    },
    reject: {
      bg: "oklch(0.12 0.03 25 / 0.5)",
      color: "oklch(0.65 0.2 25)",
      border: "oklch(0.3 0.12 25 / 0.4)",
    },
  };

  const verdict = result.milestonePassed
    ? "keep"
    : result.usefulBehaviorDelta < 0
      ? "reject"
      : "revise";
  const vs = verdictStyle[verdict];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div
        className="px-3 py-1.5 shrink-0 border-b flex items-center justify-between"
        style={{
          borderColor: "oklch(0.18 0.04 255)",
          background: "oklch(0.07 0.012 265)",
        }}
      >
        <span
          className="font-mono text-[9px] tracking-widest uppercase"
          style={{ color: "oklch(0.38 0.06 220)" }}
        >
          Results
        </span>
        <Badge
          data-ocid="results.primary_button"
          style={{
            background:
              result.status === "complete"
                ? "oklch(0.2 0.08 145 / 0.4)"
                : "oklch(0.2 0.06 55 / 0.4)",
            color:
              result.status === "complete"
                ? "oklch(0.7 0.18 145)"
                : "oklch(0.65 0.15 55)",
            fontSize: "7px",
          }}
        >
          {result.status.toUpperCase()}
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {/* ΔU — useful behavior delta */}
        <div
          data-ocid="results.card"
          className="rounded p-2.5"
          style={{
            background: `${deltaColor(result.usefulBehaviorDelta)} / 0.08`,
            border: `1px solid ${deltaColor(result.usefulBehaviorDelta)} / 0.3`,
          }}
        >
          <div
            className="font-mono text-[7px] tracking-widest uppercase mb-1"
            style={{ color: "oklch(0.4 0.06 220)" }}
          >
            ΔU — Useful Behavior Delta
          </div>
          <div
            className="font-mono text-2xl font-bold"
            style={{ color: deltaColor(result.usefulBehaviorDelta) }}
          >
            {deltaLabel(result.usefulBehaviorDelta)}
          </div>
          <div
            className="font-mono text-[7px] mt-0.5"
            style={{ color: "oklch(0.38 0.05 220)" }}
          >
            brain-powered vs baseline · {result.totalRuns} total runs
          </div>
        </div>

        {/* 4 metric rows */}
        {(
          [
            ["Useful Behavior", result.usefulBehaviorDelta],
            ["Emergence", result.emergenceDelta],
            ["Regulation", result.regulationDelta],
            ["Efficiency", result.efficiencyDelta],
          ] as const
        ).map(([label, delta], i) => (
          <div
            key={label}
            data-ocid={`results.item.${i + 1}`}
            className="flex items-center justify-between px-2 py-1.5 rounded"
            style={{
              background: "oklch(0.09 0.01 265)",
              border: "1px solid oklch(0.16 0.03 255)",
            }}
          >
            <span
              className="font-mono text-[8px]"
              style={{ color: "oklch(0.5 0.07 220)" }}
            >
              {label}
            </span>
            <span
              className="font-mono text-[9px] font-semibold"
              style={{ color: deltaColor(Number(delta)) }}
            >
              {deltaLabel(Number(delta))}
            </span>
          </div>
        ))}

        {/* Verdict */}
        <div
          className="rounded p-2 text-center"
          style={{ background: vs.bg, border: `1px solid ${vs.border}` }}
        >
          <div
            className="font-mono text-[7px] tracking-widest uppercase mb-0.5"
            style={{ color: `${vs.color} / 0.7` }}
          >
            Verdict
          </div>
          <div
            className="font-mono text-base font-bold tracking-widest uppercase"
            style={{ color: vs.color }}
          >
            {verdict}
          </div>
        </div>

        {/* Milestone status */}
        {!result.milestonePassed && result.milestoneFailReasons.length > 0 && (
          <div
            data-ocid="results.error_state"
            className="rounded p-2 space-y-0.5"
            style={{
              background: "oklch(0.09 0.01 265)",
              border: "1px solid oklch(0.25 0.08 255 / 0.4)",
            }}
          >
            <div
              className="font-mono text-[7px] tracking-widest uppercase"
              style={{ color: "oklch(0.45 0.08 220)" }}
            >
              Milestone gate issues:
            </div>
            {result.milestoneFailReasons.map((r) => (
              <div
                key={r}
                className="font-mono text-[7px]"
                style={{ color: "oklch(0.55 0.15 25)" }}
              >
                • {r}
              </div>
            ))}
          </div>
        )}

        {result.promotionCandidate && (
          <div
            data-ocid="results.success_state"
            className="rounded p-2 text-center"
            style={{
              background: "oklch(0.1 0.025 145 / 0.4)",
              border: "1px solid oklch(0.35 0.15 145 / 0.4)",
            }}
          >
            <span
              className="font-mono text-[8px] tracking-widest"
              style={{ color: "oklch(0.7 0.2 145)" }}
            >
              PROMOTION CANDIDATE — See Report tab
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main ExperimentsTab ────────────────────────────────────────────────────────────────────
export default function ExperimentsTab({ neural }: { neural: Neural }) {
  const [latestResult, setLatestResult] = useState<ExperimentResult | null>(
    null,
  );
  const [subTab, setSubTab] = useState<"probe" | "proof">("proof");

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Tab switcher */}
      <div
        className="shrink-0 px-3 py-1 flex items-center gap-2 border-b"
        style={{
          borderColor: "oklch(0.16 0.04 255)",
          background: "oklch(0.065 0.01 265)",
        }}
      >
        <button
          type="button"
          data-ocid="experiments.tab"
          onClick={() => setSubTab("proof")}
          className="font-mono text-[8px] tracking-widest uppercase px-2 py-0.5 rounded"
          style={{
            background:
              subTab === "proof" ? "oklch(0.18 0.05 255)" : "transparent",
            color:
              subTab === "proof"
                ? "oklch(0.7 0.15 210)"
                : "oklch(0.35 0.05 220)",
          }}
        >
          Proof System
        </button>
        <button
          type="button"
          data-ocid="experiments.tab"
          onClick={() => setSubTab("probe")}
          className="font-mono text-[8px] tracking-widest uppercase px-2 py-0.5 rounded"
          style={{
            background:
              subTab === "probe" ? "oklch(0.18 0.05 255)" : "transparent",
            color:
              subTab === "probe"
                ? "oklch(0.7 0.15 210)"
                : "oklch(0.35 0.05 220)",
          }}
        >
          Lab &amp; Probes
        </button>
      </div>

      {subTab === "proof" ? (
        /* Proof System: 3-column layout */
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Left: Maturity Dashboard */}
          <section
            className="flex flex-col border-r"
            style={{
              flex: "0 0 280px",
              overflow: "hidden",
              borderColor: "oklch(0.18 0.05 255)",
            }}
          >
            <MaturityDashboard neural={neural} />
          </section>

          {/* Center: Experiment Runner */}
          <section
            className="flex flex-col border-r"
            style={{
              flex: "0 0 280px",
              overflow: "hidden",
              borderColor: "oklch(0.18 0.05 255)",
            }}
          >
            <ExperimentRunnerPanel onResult={setLatestResult} />
          </section>

          {/* Right: Results */}
          <section className="flex flex-col flex-1 overflow-hidden min-h-0">
            <ResultsPanel result={latestResult} />
          </section>
        </div>
      ) : (
        /* Lab & Probes: original layout */
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div
            className="flex overflow-hidden"
            style={{ flex: "0 0 60%", minHeight: 0 }}
          >
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
                  Experiment Lab · Behavior · Probes
                </span>
              </div>
              <div className="flex-1 overflow-hidden min-h-0">
                <ExperimentLab neural={neural} />
              </div>
            </section>
            <section
              className="flex flex-col"
              style={{ flex: 1, overflow: "hidden" }}
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
                  Simulation Controls · 12 Stimulus Channels
                </span>
              </div>
              <div className="flex-1 overflow-hidden min-h-0">
                <SimulationControls neural={neural} />
              </div>
            </section>
          </div>
          <div
            className="flex flex-col border-t"
            style={{
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
              borderColor: "oklch(0.18 0.05 255)",
            }}
          >
            <AutoTestPanel
              neural={{
                regions: neural.regions.map((r) => ({
                  region: r.region as string,
                  activation: r.activation,
                })),
                globalArousal: neural.globalArousal,
                sparseActivationRatio: neural.sparseActivationRatio,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
