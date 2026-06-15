// Cognitive Dashboard — Phase 4 Additional Systems
// Surfaces: Self-State Model, Goal Hierarchy, Prediction/Expectation, Failure Memory
// All values are live, derived from actual brain state — not scripted.

import type { FailureMemoryState } from "../utils/failureMemory";
import type { GoalHierarchyState } from "../utils/goalHierarchy";
import type { PredictionState } from "../utils/predictionExpectationLayer";
import type { SelfStateModel } from "../utils/selfStateModel";

const C = {
  bg: "oklch(0.055 0.012 265)",
  panel: "oklch(0.07 0.015 265)",
  border: "oklch(0.18 0.05 255)",
  borderSub: "oklch(0.13 0.03 255)",
  label: "oklch(0.38 0.06 220)",
  dim: "oklch(0.32 0.04 220)",
  bright: "oklch(0.88 0.04 210)",
  threat: "oklch(0.72 0.28 25)",
  reward: "oklch(0.78 0.26 55)",
  memory: "oklch(0.72 0.22 195)",
  executive: "oklch(0.75 0.24 260)",
  good: "oklch(0.72 0.22 145)",
  warn: "oklch(0.82 0.22 65)",
  danger: "oklch(0.75 0.28 15)",
  purple: "oklch(0.68 0.22 280)",
};

function Bar({
  value,
  color,
  label,
}: { value: number; color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="font-mono text-[8px] w-24 shrink-0"
        style={{ color: C.label }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-[3px] rounded"
        style={{ background: "oklch(0.14 0.03 260)" }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%`,
            background: color,
            borderRadius: 2,
            transition: "width 0.35s ease",
          }}
        />
      </div>
      <span
        className="font-mono text-[7px] w-7 text-right shrink-0"
        style={{ color }}
      >
        {Math.round(value * 100)}
      </span>
    </div>
  );
}

const GOAL_COLORS: Record<string, string> = {
  THREAT_AVOID: C.threat,
  HUNGER_RELIEF: C.warn,
  AROUSAL_REGULATE: C.purple,
  EXPLORATION: C.good,
  REWARD_PURSUIT: C.reward,
  MEMORY_RETRIEVAL: C.memory,
  INVESTIGATE_NOVEL: "oklch(0.72 0.22 195)",
  REST_CONSOLIDATE: "oklch(0.55 0.12 240)",
  SOCIAL_ORIENT: "oklch(0.72 0.22 165)",
  SURVIVAL_OVERRIDE: C.danger,
  FREEZE_ASSESS: C.executive,
  IDLE: C.dim,
};

const STATE_COLORS: Record<string, string> = {
  OVERWHELMED: C.danger,
  HIGH_PRESSURE: C.threat,
  ACTION_READY: C.good,
  ASSESSING: C.executive,
  STABLE_CONFIDENT: C.good,
  ALERT: C.warn,
  REGULATED: C.memory,
  TRANSITIONING: C.label,
  CALIBRATING: C.dim,
};

export function CognitiveDashboard({
  selfState,
  goalHierarchy,
  predictionState,
  failureMemory,
}: {
  selfState: SelfStateModel;
  goalHierarchy: GoalHierarchyState;
  predictionState: PredictionState;
  failureMemory: FailureMemoryState;
}) {
  const stateColor = STATE_COLORS[selfState.currentStateLabel] ?? C.label;
  const topGoals = Object.entries(goalHierarchy.goalVector)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const surpriseRegionShort = predictionState.surpriseRegion
    .replace(/([A-Z])/g, " $1")
    .trim()
    .slice(0, 20);

  return (
    <div
      className="flex flex-col gap-0"
      style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}
    >
      {/* Header */}
      <div
        className="px-3 py-1.5 flex items-center gap-2 shrink-0 border-b"
        style={{ background: C.panel, borderColor: C.borderSub }}
      >
        <span
          className="font-mono text-[8px] tracking-widest uppercase font-bold"
          style={{ color: C.purple }}
        >
          ◌ Cognitive State
        </span>
        <span
          className="font-mono text-[8px] font-bold px-1.5 py-0.5 rounded ml-1"
          style={{
            background: `${stateColor}22`,
            color: stateColor,
            border: `1px solid ${stateColor}44`,
          }}
        >
          {selfState.currentStateLabel}
        </span>
        {goalHierarchy.overrideActive && (
          <span
            className="font-mono text-[7px] px-1.5 py-0.5 rounded"
            style={{
              background: `${C.danger}22`,
              color: C.danger,
              border: `1px solid ${C.danger}44`,
            }}
          >
            ⚠ OVERRIDE
          </span>
        )}
        <span className="font-mono text-[7px] ml-auto" style={{ color: C.dim }}>
          model confidence {Math.round(predictionState.modelConfidence * 100)}%
        </span>
      </div>

      <div className="flex" style={{ minHeight: 0 }}>
        {/* Left: Self-State + Prediction */}
        <div
          className="flex flex-col gap-0 border-r"
          style={{ flex: "0 0 50%", borderColor: C.border }}
        >
          {/* Self-State */}
          <div className="px-3 py-2 flex flex-col gap-1.5">
            <span
              className="font-mono text-[7px] tracking-widest uppercase"
              style={{ color: C.label }}
            >
              Self-State Model
            </span>
            <Bar
              value={selfState.pressure}
              color={selfState.pressure > 0.65 ? C.threat : C.warn}
              label="Pressure"
            />
            <Bar value={selfState.stability} color={C.good} label="Stability" />
            <Bar
              value={selfState.confidence}
              color={C.executive}
              label="Confidence"
            />
            <Bar
              value={selfState.urgency}
              color={selfState.urgency > 0.65 ? C.threat : C.warn}
              label="Urgency"
            />
            <Bar
              value={selfState.regulation}
              color={C.memory}
              label="Regulation"
            />
            <div className="flex gap-2 mt-1 flex-wrap">
              {selfState.shouldHesitate && (
                <span
                  className="font-mono text-[7px] px-1 rounded"
                  style={{ background: `${C.warn}18`, color: C.warn }}
                >
                  HESITATE
                </span>
              )}
              {selfState.shouldCommit && (
                <span
                  className="font-mono text-[7px] px-1 rounded"
                  style={{ background: `${C.good}18`, color: C.good }}
                >
                  COMMIT
                </span>
              )}
              {selfState.shouldWithdraw && (
                <span
                  className="font-mono text-[7px] px-1 rounded"
                  style={{ background: `${C.danger}18`, color: C.danger }}
                >
                  WITHDRAW
                </span>
              )}
            </div>
          </div>

          {/* Prediction Layer */}
          <div
            className="px-3 py-2 flex flex-col gap-1 border-t"
            style={{ borderColor: C.borderSub }}
          >
            <span
              className="font-mono text-[7px] tracking-widest uppercase"
              style={{ color: C.label }}
            >
              Prediction Layer
            </span>
            <Bar
              value={predictionState.globalMismatch}
              color={predictionState.globalMismatch > 0.35 ? C.threat : C.warn}
              label="Global Mismatch"
            />
            <Bar
              value={predictionState.noveltyScore}
              color={C.memory}
              label="Novelty Score"
            />
            {predictionState.surpriseDetected && (
              <div
                className="font-mono text-[7px] px-1.5 py-0.5 rounded"
                style={{
                  background: `${C.threat}15`,
                  color: C.threat,
                  border: `1px solid ${C.threat}30`,
                }}
              >
                ⚡ SURPRISE @ {surpriseRegionShort} — mag{" "}
                {Math.round(predictionState.surpriseMagnitude * 100)}%
              </div>
            )}
            <span className="font-mono text-[7px]" style={{ color: C.dim }}>
              {predictionState.ticksSinceLastSurprise < 999
                ? `Last surprise: ${predictionState.ticksSinceLastSurprise}t ago`
                : "No surprise events yet"}
            </span>
          </div>
        </div>

        {/* Right: Goal Hierarchy + Failure Memory */}
        <div className="flex flex-col gap-0" style={{ flex: 1 }}>
          {/* Goal Hierarchy */}
          <div className="px-3 py-2 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span
                className="font-mono text-[7px] tracking-widest uppercase"
                style={{ color: C.label }}
              >
                Goal Hierarchy
              </span>
              <span className="font-mono text-[6px]" style={{ color: C.dim }}>
                conflict {Math.round(goalHierarchy.goalConflictScore * 100)}%
              </span>
            </div>
            {/* Dominant goal */}
            <div
              className="flex items-center gap-1.5 px-1.5 py-1 rounded"
              style={{
                background: `${GOAL_COLORS[goalHierarchy.dominantGoal] ?? C.label}18`,
              }}
            >
              <span
                className="font-mono text-[8px] font-bold"
                style={{
                  color: GOAL_COLORS[goalHierarchy.dominantGoal] ?? C.label,
                }}
              >
                ▶ {goalHierarchy.dominantGoal.replace(/_/g, " ")}
              </span>
              <span
                className="font-mono text-[7px] ml-auto"
                style={{ color: C.dim }}
              >
                {Math.round(goalHierarchy.dominantGoalStrength * 100)}%
              </span>
            </div>
            {goalHierarchy.overrideActive && goalHierarchy.overrideGoal && (
              <div
                className="font-mono text-[7px] px-1.5 py-0.5 rounded"
                style={{ background: `${C.danger}15`, color: C.danger }}
              >
                ⚠ {goalHierarchy.overrideReason}
              </div>
            )}
            {/* Top 5 goal bars */}
            <div className="flex flex-col gap-1 mt-0.5">
              {topGoals.map(([label, strength]) => (
                <Bar
                  key={label}
                  value={strength as number}
                  color={GOAL_COLORS[label] ?? C.label}
                  label={label.replace(/_/g, " ").slice(0, 16)}
                />
              ))}
            </div>
            <span
              className="font-mono text-[7px] mt-0.5"
              style={{ color: C.dim }}
            >
              Dominant held {goalHierarchy.dominantGoalPersistenceTicks}t
            </span>
          </div>

          {/* Failure Memory + Counterfactual */}
          <div
            className="px-3 py-2 flex flex-col gap-1 border-t"
            style={{ borderColor: C.borderSub }}
          >
            <span
              className="font-mono text-[7px] tracking-widest uppercase"
              style={{ color: C.label }}
            >
              Failure Memory
            </span>
            <div className="flex gap-2">
              <span
                className="font-mono text-[7px]"
                style={{
                  color: failureMemory.suppressedCount > 0 ? C.warn : C.dim,
                }}
              >
                {failureMemory.suppressedCount} action(s) suppressed
              </span>
              {failureMemory.lastFailedContext && (
                <span
                  className="font-mono text-[6px] truncate"
                  style={{ color: C.dim }}
                >
                  last: {failureMemory.lastFailedContext.slice(0, 20)}
                </span>
              )}
            </div>
            {/* Counterfactual routing */}
            <div
              className="mt-0.5 px-1.5 py-1 rounded flex flex-col gap-0.5"
              style={{
                background: failureMemory.preferAlternativeRoute
                  ? `${C.good}12`
                  : "oklch(0.09 0.02 260)",
                border: `1px solid ${failureMemory.preferAlternativeRoute ? C.good : C.borderSub}`,
              }}
            >
              <span
                className="font-mono text-[7px] font-bold"
                style={{ color: C.label }}
              >
                Counterfactual Routing
              </span>
              <div className="flex gap-2">
                <span className="font-mono text-[7px]" style={{ color: C.dim }}>
                  Current cost:{" "}
                  {Math.round(failureMemory.currentRouteCost * 100)}%
                </span>
                <span className="font-mono text-[7px]" style={{ color: C.dim }}>
                  Alt cost:{" "}
                  {Math.round(failureMemory.alternativeRouteCost * 100)}%
                </span>
              </div>
              <span
                className="font-mono text-[7px]"
                style={{
                  color: failureMemory.preferAlternativeRoute ? C.good : C.dim,
                }}
              >
                {failureMemory.routeComparisonLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
