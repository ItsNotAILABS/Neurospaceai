// Core Brain Scoring Engine
// Three scoring systems: Useful Behavior, Emergence, Efficiency
// All formulas derived from user spec. Delta vs baseline required for events.

export interface UsefulBehaviorScore {
  taskSuccess: number; // T_s: 0-1
  adaptation: number; // A_s: 0-1
  recovery: number; // R_s: 0-1
  coherence: number; // C_s: 0-1
  efficiency: number; // E_s: 0-1
  total: number; // U_s = weighted sum
  delta: number; // ΔU_s = U_brain - U_baseline
  isUsefulBehaviorEvent: boolean; // ΔU > threshold
}

export interface EmergenceScore {
  novelty: number; // N_t: 0-1
  diversity: number; // D_t: 0-1
  persistence: number; // P_t: 0-1
  coherence: number; // C_t: 0-1
  total: number; // E_t = weighted sum
  isEmergentCandidate: boolean;
  artifactWarning: boolean;
}

export interface EfficiencyScore {
  latencyAdvantage: number; // L_s: 0-1
  computeReduction: number; // C_s: 0-1
  sparsityAdvantage: number; // A_s: 0-1
  performanceRetained: number; // P_s: 0-1
  total: number; // Eff_s = weighted sum
  delta: number; // ΔEff_s
  isEfficiencyPositive: boolean;
}

// Weights α for useful behavior
const ALPHA = {
  taskSuccess: 0.35,
  adaptation: 0.25,
  recovery: 0.2,
  coherence: 0.12,
  efficiency: 0.08,
};
// Weights β for emergence
const BETA = {
  novelty: 0.3,
  diversity: 0.25,
  persistence: 0.25,
  coherence: 0.2,
};
// Weights γ for efficiency
const GAMMA = { latency: 0.3, compute: 0.3, sparsity: 0.25, performance: 0.15 };

const USEFUL_THRESHOLD = 0.08;
const EFFICIENCY_THRESHOLD = 0.03;

export function computeUsefulBehaviorScore(
  brain: {
    taskSuccess: number;
    adaptation: number;
    recovery: number;
    coherence: number;
    efficiency: number;
  },
  baseline: {
    taskSuccess: number;
    adaptation: number;
    recovery: number;
    coherence: number;
    efficiency: number;
  },
): UsefulBehaviorScore {
  const brainTotal =
    ALPHA.taskSuccess * brain.taskSuccess +
    ALPHA.adaptation * brain.adaptation +
    ALPHA.recovery * brain.recovery +
    ALPHA.coherence * brain.coherence +
    ALPHA.efficiency * brain.efficiency;
  const baselineTotal =
    ALPHA.taskSuccess * baseline.taskSuccess +
    ALPHA.adaptation * baseline.adaptation +
    ALPHA.recovery * baseline.recovery +
    ALPHA.coherence * baseline.coherence +
    ALPHA.efficiency * baseline.efficiency;
  const delta = brainTotal - baselineTotal;
  return {
    ...brain,
    total: brainTotal,
    delta,
    isUsefulBehaviorEvent: delta > USEFUL_THRESHOLD,
  };
}

export function computeEmergenceScore(params: {
  novelty: number;
  diversity: number;
  persistence: number;
  coherence: number;
  artifactWarning: boolean;
}): EmergenceScore {
  const total =
    BETA.novelty * params.novelty +
    BETA.diversity * params.diversity +
    BETA.persistence * params.persistence +
    BETA.coherence * params.coherence;
  const isEmergentCandidate =
    params.novelty > 0.6 &&
    params.coherence > 0.55 &&
    !params.artifactWarning &&
    total > 0.55;
  return { ...params, total, isEmergentCandidate };
}

export function computeEfficiencyScore(
  brain: {
    latencyMs: number;
    activeRegionFraction: number;
    sparseRatio: number;
    taskSuccess: number;
  },
  baseline: {
    latencyMs: number;
    activeRegionFraction: number;
    sparseRatio: number;
    taskSuccess: number;
  },
): EfficiencyScore {
  const latencyAdvantage = Math.max(
    0,
    1 - brain.latencyMs / Math.max(baseline.latencyMs, 1),
  );
  const computeReduction = Math.max(
    0,
    1 -
      brain.activeRegionFraction /
        Math.max(baseline.activeRegionFraction, 0.01),
  );
  const sparsityAdvantage = Math.max(
    0,
    brain.sparseRatio - baseline.sparseRatio,
  );
  const performanceRetained =
    brain.taskSuccess >= baseline.taskSuccess * 0.95
      ? 1.0
      : brain.taskSuccess / Math.max(baseline.taskSuccess, 0.01);
  const brainTotal =
    GAMMA.latency * latencyAdvantage +
    GAMMA.compute * computeReduction +
    GAMMA.sparsity * sparsityAdvantage +
    GAMMA.performance * performanceRetained;
  const delta = brainTotal;
  const isEfficiencyPositive =
    delta > EFFICIENCY_THRESHOLD && performanceRetained >= 0.95;
  return {
    latencyAdvantage,
    computeReduction,
    sparsityAdvantage,
    performanceRetained,
    total: brainTotal,
    delta,
    isEfficiencyPositive,
  };
}
