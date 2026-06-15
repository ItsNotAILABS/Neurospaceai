// Prediction / Expectation Layer — Phase 4 Additional Systems
// The brain maintains a forward model: expected next state vs actual next state.
// Mismatch (prediction error) feeds: dACC (conflict), PFC (update), Hippocampus (encoding).
// Also drives novelty detection and surprise-gated plasticity.
// Reference: Friston (2005) A theory of cortical responses. Phil Trans R Soc B.
// Reference: Clark (2013) Whatever next? Predictive brains, situated agents. BBS.

export interface PredictionState {
  // Per-region expectations maintained as exponential moving average
  expectations: Map<string, number>; // region -> expected activation
  // Prediction error = |actual - expected|
  errors: Map<string, number>;
  // Global mismatch signal — averaged across regions, weighted by importance
  globalMismatch: number; // 0-1
  // Surprise: large sudden mismatch (> threshold)
  surpriseDetected: boolean;
  surpriseRegion: string;
  surpriseMagnitude: number;
  // Novelty accumulator: running average of recent mismatch
  noveltyScore: number; // 0-1, EMA of globalMismatch
  // How many ticks since last large mismatch
  ticksSinceLastSurprise: number;
  // Forward model confidence: 1 - avg prediction error
  modelConfidence: number;
}

const SURPRISE_THRESHOLD = 0.35;
const EXPECTATION_LR = 0.08; // learning rate for updating expectations
const NOVELTY_EMA = 0.05;

// High-importance regions for mismatch weighting
const IMPORTANT_REGIONS = new Set([
  "PrefrontalCortex",
  "Hippocampus",
  "Amygdala",
  "AnteriorCingulateCortex",
  "NucleusAccumbens",
  "Thalamus",
  "Insula",
]);

export function initPredictionState(regionNames: string[]): PredictionState {
  const expectations = new Map<string, number>();
  const errors = new Map<string, number>();
  for (const r of regionNames) {
    expectations.set(r, 0.2);
    errors.set(r, 0);
  }
  return {
    expectations,
    errors,
    globalMismatch: 0,
    surpriseDetected: false,
    surpriseRegion: "",
    surpriseMagnitude: 0,
    noveltyScore: 0,
    ticksSinceLastSurprise: 999,
    modelConfidence: 0.8,
  };
}

export function updatePredictionState(
  prev: PredictionState,
  regions: Array<{ region: string; activation: number }>,
): PredictionState {
  const expectations = new Map(prev.expectations);
  const errors = new Map(prev.errors);

  let totalError = 0;
  let importantError = 0;
  let importantCount = 0;
  let maxError = 0;
  let maxErrorRegion = "";

  for (const rs of regions) {
    const expected = expectations.get(rs.region) ?? 0.2;
    const error = Math.abs(rs.activation - expected);
    errors.set(rs.region, error);

    // Update expectation toward actual (slow learning = stable model)
    expectations.set(
      rs.region,
      expected + (rs.activation - expected) * EXPECTATION_LR,
    );

    totalError += error;
    if (IMPORTANT_REGIONS.has(rs.region)) {
      importantError += error;
      importantCount++;
    }
    if (error > maxError) {
      maxError = error;
      maxErrorRegion = rs.region;
    }
  }

  const avgTotal = totalError / Math.max(regions.length, 1);
  // Weight global mismatch toward important regions
  const avgImportant =
    importantCount > 0 ? importantError / importantCount : avgTotal;
  const globalMismatch = Math.min(1, avgTotal * 0.4 + avgImportant * 0.6);

  // Surprise detection
  const surpriseDetected = maxError > SURPRISE_THRESHOLD;
  const ticksSinceLastSurprise = surpriseDetected
    ? 0
    : prev.ticksSinceLastSurprise + 1;

  // Novelty EMA
  const noveltyScore =
    prev.noveltyScore * (1 - NOVELTY_EMA) + globalMismatch * NOVELTY_EMA;

  const modelConfidence = Math.max(0, 1 - globalMismatch * 1.5);

  return {
    expectations,
    errors,
    globalMismatch,
    surpriseDetected,
    surpriseRegion: surpriseDetected ? maxErrorRegion : prev.surpriseRegion,
    surpriseMagnitude: surpriseDetected ? maxError : prev.surpriseMagnitude,
    noveltyScore,
    ticksSinceLastSurprise,
    modelConfidence,
  };
}

// Returns modifiers for downstream systems based on prediction state
export function getPredictionModifiers(state: PredictionState): {
  accConflictBoost: number; // feeds dACC — higher mismatch → more conflict monitoring
  hippocampusEncodingBoost: number; // surprise → stronger encoding
  salienceBoost: number; // novel stimuli get higher salience
  plasticityGain: number; // prediction error gates STDP magnitude
} {
  return {
    accConflictBoost: state.globalMismatch * 0.15,
    hippocampusEncodingBoost: state.surpriseDetected
      ? 0.12
      : state.noveltyScore * 0.06,
    salienceBoost: state.noveltyScore * 0.1,
    plasticityGain: 1 + state.globalMismatch * 0.5, // Friston: error-gated plasticity
  };
}
