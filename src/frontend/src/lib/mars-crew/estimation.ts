/**
 * Small, dependency-free estimators for the Mars crew simulator.
 * These are research primitives, not flight-certified navigation software.
 */

export type ScalarEstimate = {
  value: number;
  variance: number;
};

export type ScalarMeasurement = {
  value: number;
  variance: number;
};

export type Innovation = {
  residual: number;
  innovationVariance: number;
  normalizedInnovationSquared: number;
};

/** Constant-velocity scalar Kalman predict/update primitive. */
export function predictScalar(
  estimate: ScalarEstimate,
  ratePerSecond: number,
  dtSeconds: number,
  processVariance: number,
): ScalarEstimate {
  return {
    value: estimate.value + ratePerSecond * dtSeconds,
    variance: estimate.variance + Math.max(0, processVariance),
  };
}

export function updateScalar(
  estimate: ScalarEstimate,
  measurement: ScalarMeasurement,
): { estimate: ScalarEstimate; innovation: Innovation } {
  const innovationVariance = estimate.variance + measurement.variance;
  const residual = measurement.value - estimate.value;
  const gain = estimate.variance / Math.max(innovationVariance, Number.EPSILON);

  return {
    estimate: {
      value: estimate.value + gain * residual,
      variance: (1 - gain) * estimate.variance,
    },
    innovation: {
      residual,
      innovationVariance,
      normalizedInnovationSquared:
        (residual * residual) / Math.max(innovationVariance, Number.EPSILON),
    },
  };
}

export function isOutlier(
  innovation: Innovation,
  threshold = 9.0,
): boolean {
  return innovation.normalizedInnovationSquared > threshold;
}

/**
 * Consensus step for a connected or partially connected rover graph.
 * Missing neighbors model packet loss or a disconnected link.
 */
export function consensusStep(
  localValue: number,
  neighborValues: number[],
  gain: number,
): number {
  if (gain < 0 || gain > 1) throw new Error("gain must be in [0, 1]");
  if (neighborValues.length === 0) return localValue;
  const delta =
    neighborValues.reduce((sum, value) => sum + value - localValue, 0) /
    neighborValues.length;
  return localValue + gain * delta;
}

export type TaskBid = {
  roverId: string;
  taskId: string;
  informationGain: number;
  energyCost: number;
  timeCost: number;
  risk: number;
  capabilityMatch: number;
};

export function scoreTaskBid(
  bid: TaskBid,
  weights = {
    informationGain: 1,
    energyCost: 1,
    timeCost: 1,
    risk: 2,
    capabilityMatch: 1,
  },
): number {
  return (
    weights.informationGain * bid.informationGain -
    weights.energyCost * bid.energyCost -
    weights.timeCost * bid.timeCost -
    weights.risk * bid.risk +
    weights.capabilityMatch * bid.capabilityMatch
  );
}

export function chooseWinningBid(
  bids: TaskBid[],
  weights?: Parameters<typeof scoreTaskBid>[1],
): TaskBid | null {
  return bids.reduce<TaskBid | null>((winner, candidate) => {
    if (!winner) return candidate;
    return scoreTaskBid(candidate, weights) > scoreTaskBid(winner, weights)
      ? candidate
      : winner;
  }, null);
}
