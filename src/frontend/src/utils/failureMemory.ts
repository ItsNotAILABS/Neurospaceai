// Failure Memory + Negative Weighting — Phase 4 Additional Systems
// The system remembers what failed and down-weights those routes/actions.
// This is distinct from strategy shift (which handles repeated same-action failure).
// Failure memory acts as a longer-term negative episodic trace.
//
// For each action primitive + context, a failure count and down-weight is tracked.
// Persistent failures lead to route avoidance and policy suppression.
// Success on a previously-failed route gradually restores its weight.

export type ActionContext = string; // e.g. "approach_high_threat" or "explore_low_hrv"

export interface FailureRecord {
  actionContext: ActionContext;
  failureCount: number;
  successCount: number;
  negativeWeight: number; // 0-1: how much to suppress this action (0 = no suppression)
  lastFailTick: number;
  lastSuccessTick: number;
  isDownweighted: boolean;
}

export interface FailureMemoryState {
  records: Map<ActionContext, FailureRecord>;
  // Global failure index: how many contexts are currently suppressed
  suppressedCount: number;
  // Most recently failed context
  lastFailedContext: string;
  // Counterfactual route comparison: current route vs alternative
  currentRouteCost: number;
  alternativeRouteCost: number;
  preferAlternativeRoute: boolean;
  routeComparisonLabel: string;
}

const FAILURE_WEIGHT_INCREASE = 0.2;
const SUCCESS_WEIGHT_DECREASE = 0.08;
const DOWNWEIGHT_THRESHOLD = 0.5;
const WEIGHT_DECAY_PER_TICK = 0.0005; // slow decay back to neutral

export function initFailureMemory(): FailureMemoryState {
  return {
    records: new Map(),
    suppressedCount: 0,
    lastFailedContext: "",
    currentRouteCost: 0.5,
    alternativeRouteCost: 0.5,
    preferAlternativeRoute: false,
    routeComparisonLabel: "Both routes comparable",
  };
}

export function recordFailure(
  state: FailureMemoryState,
  context: ActionContext,
  tick: number,
): FailureMemoryState {
  const records = new Map(state.records);
  const existing = records.get(context) ?? {
    actionContext: context,
    failureCount: 0,
    successCount: 0,
    negativeWeight: 0,
    lastFailTick: 0,
    lastSuccessTick: 0,
    isDownweighted: false,
  };
  const negativeWeight = Math.min(
    1,
    existing.negativeWeight + FAILURE_WEIGHT_INCREASE,
  );
  records.set(context, {
    ...existing,
    failureCount: existing.failureCount + 1,
    negativeWeight,
    lastFailTick: tick,
    isDownweighted: negativeWeight >= DOWNWEIGHT_THRESHOLD,
  });
  return {
    ...state,
    records,
    suppressedCount: [...records.values()].filter((r) => r.isDownweighted)
      .length,
    lastFailedContext: context,
  };
}

export function recordSuccess(
  state: FailureMemoryState,
  context: ActionContext,
  tick: number,
): FailureMemoryState {
  const records = new Map(state.records);
  const existing = records.get(context);
  if (!existing) return state;
  const negativeWeight = Math.max(
    0,
    existing.negativeWeight - SUCCESS_WEIGHT_DECREASE,
  );
  records.set(context, {
    ...existing,
    successCount: existing.successCount + 1,
    negativeWeight,
    lastSuccessTick: tick,
    isDownweighted: negativeWeight >= DOWNWEIGHT_THRESHOLD,
  });
  return {
    ...state,
    records,
    suppressedCount: [...records.values()].filter((r) => r.isDownweighted)
      .length,
  };
}

// Passive decay: reduce negative weights slightly each tick
export function decayFailureWeights(
  state: FailureMemoryState,
): FailureMemoryState {
  if (state.records.size === 0) return state;
  const records = new Map(state.records);
  for (const [key, rec] of records) {
    if (rec.negativeWeight > 0) {
      records.set(key, {
        ...rec,
        negativeWeight: Math.max(0, rec.negativeWeight - WEIGHT_DECAY_PER_TICK),
        isDownweighted:
          rec.negativeWeight - WEIGHT_DECAY_PER_TICK >= DOWNWEIGHT_THRESHOLD,
      });
    }
  }
  return { ...state, records };
}

// Get suppression weight for an action (0 = no suppression, 1 = fully suppressed)
export function getActionSuppression(
  state: FailureMemoryState,
  context: ActionContext,
): number {
  return state.records.get(context)?.negativeWeight ?? 0;
}

// Counterfactual route comparison — light version
// Compares current route cost vs an alternative based on brain state
export function updateCounterfactualRouting(
  state: FailureMemoryState,
  inputs: {
    currentThreatExposure: number; // threat along current route
    alternativeThreatExposure: number; // threat along alternative
    currentDistance: number; // path length ratio
    alternativeDistance: number;
    pfcActivation: number; // planning quality
  },
): FailureMemoryState {
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  // Cost = threat_exposure * 0.6 + distance_cost * 0.4
  const currentRouteCost = clamp(
    inputs.currentThreatExposure * 0.6 + inputs.currentDistance * 0.4,
  );
  const alternativeRouteCost = clamp(
    inputs.alternativeThreatExposure * 0.6 + inputs.alternativeDistance * 0.4,
  );

  const costDiff = currentRouteCost - alternativeRouteCost;
  const preferAlternativeRoute = costDiff > 0.1 && inputs.pfcActivation > 0.3;

  let routeComparisonLabel: string;
  if (preferAlternativeRoute) {
    routeComparisonLabel = `Alt route preferred (ΔCost: -${(costDiff * 100).toFixed(0)}%, lower threat)`;
  } else if (costDiff < -0.1) {
    routeComparisonLabel = `Current route preferred (ΔCost: +${(Math.abs(costDiff) * 100).toFixed(0)}%, acceptable risk)`;
  } else {
    routeComparisonLabel = `Routes comparable (ΔCost: ${(costDiff * 100).toFixed(1)}%)`;
  }

  return {
    ...state,
    currentRouteCost,
    alternativeRouteCost,
    preferAlternativeRoute,
    routeComparisonLabel,
  };
}
