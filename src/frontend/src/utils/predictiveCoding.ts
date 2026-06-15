// Hierarchical Predictive Coding
// Rao & Ballard 1999 (predictive coding in visual cortex)
// Friston 2005 (free energy principle)
//
// Higher regions send top-down PREDICTIONS to lower regions.
// Lower regions send bottom-up PREDICTION ERRORS back up.
// Only errors propagate — not raw signals.
// Free energy: F = sum_i (error_i^2 / (2 * precision_i))
// Minimizing F = minimizing prediction error = learning.

export interface PredictiveCodingState {
  predictions: Map<string, number>; // top-down predicted activation per region
  predictionErrors: Map<string, number>; // |actual - predicted|
  precisions: Map<string, number>; // 1/sigma^2 per region (updated from error EMA)
  globalFreeEnergy: number; // sum(error^2 / 2*precision) — decreases with learning
  globalMismatch: number; // mean prediction error
  surpriseScore: number; // proportion of regions with high simultaneous error
  noveltyFromError: number; // sustained mismatch = genuine novelty
  errorHistory: Map<string, number[]>; // last 50 errors per region
  freeEnergyGradient: number; // dF/dt — negative = predictions improving
  learningRelevance: number; // high error → high plasticity relevance
}

export function initPredictiveCodingState(
  regionIds: string[],
): PredictiveCodingState {
  const predictions = new Map<string, number>();
  const predictionErrors = new Map<string, number>();
  const precisions = new Map<string, number>();
  const errorHistory = new Map<string, number[]>();
  for (const id of regionIds) {
    predictions.set(id, 0.25);
    predictionErrors.set(id, 0);
    precisions.set(id, 1.0);
    errorHistory.set(id, []);
  }
  return {
    predictions,
    predictionErrors,
    precisions,
    globalFreeEnergy: 0,
    globalMismatch: 0,
    surpriseScore: 0,
    noveltyFromError: 0,
    errorHistory,
    freeEnergyGradient: 0,
    learningRelevance: 0,
  };
}

export function updatePredictiveCoding(
  state: PredictiveCodingState,
  actualActivations: Map<string, number>,
): PredictiveCodingState {
  const PRED_LR = 0.05;
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const prevFreeEnergy = state.globalFreeEnergy;
  let totalFreeEnergy = 0;
  let totalError = 0;
  let highErrorCount = 0;
  const regionIds = Array.from(actualActivations.keys());

  for (const regionId of regionIds) {
    const actual = actualActivations.get(regionId) ?? 0;
    const predicted = state.predictions.get(regionId) ?? 0.25;
    const precision = state.precisions.get(regionId) ?? 1.0;

    const signedError = actual - predicted;
    const absError = Math.abs(signedError);
    state.predictionErrors.set(regionId, absError);

    const hist = state.errorHistory.get(regionId) ?? [];
    hist.push(absError);
    if (hist.length > 50) hist.shift();
    state.errorHistory.set(regionId, hist);

    const meanSqError =
      hist.reduce((s, e) => s + e * e, 0) / Math.max(hist.length, 1);
    const newPrecision = clamp(1 / (meanSqError + 0.01));
    const smoothedPrecision = precision + (newPrecision - precision) / 50;
    state.precisions.set(regionId, clamp(smoothedPrecision));

    const newPrediction = clamp(
      predicted + PRED_LR * signedError * smoothedPrecision,
    );
    state.predictions.set(regionId, newPrediction);

    const freeEnergyContrib =
      (absError * absError) / (2 * smoothedPrecision + 0.001);
    totalFreeEnergy += freeEnergyContrib;
    totalError += absError;
    if (absError > 0.4) highErrorCount++;
  }

  const n = Math.max(regionIds.length, 1);
  state.globalFreeEnergy = totalFreeEnergy;
  state.globalMismatch = totalError / n;
  state.freeEnergyGradient = totalFreeEnergy - prevFreeEnergy;
  state.surpriseScore = clamp(highErrorCount / n);
  state.noveltyFromError = clamp(
    state.globalMismatch * 0.7 + state.surpriseScore * 0.3,
  );
  state.learningRelevance = clamp(state.globalMismatch * 1.5);
  return state;
}

export function getPrecisionWeightedError(
  state: PredictiveCodingState,
  regionId: string,
): number {
  return (
    (state.predictionErrors.get(regionId) ?? 0) *
    (state.precisions.get(regionId) ?? 1.0)
  );
}

export function getTopDownPrediction(
  state: PredictiveCodingState,
  regionId: string,
): number {
  return state.predictions.get(regionId) ?? 0.25;
}
