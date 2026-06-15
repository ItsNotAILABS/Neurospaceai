// Neural Criticality Control
// Maintains the brain near the critical point: branching ratio sigma ~ 1.0
// Sources: Beggs & Plenz 2003, Shew & Plenz 2013, Haldeman & Beggs 2005
//
// sigma < 0.9: sub-critical — activity dies, low dynamic range
// sigma = 1.0: critical — power-law avalanches, max information transfer
// sigma > 1.1: super-critical — runaway, saturation

const WINDOW_SIZE = 100;
const CRITICALITY_TARGET = 1.0;
const SUB_CRITICAL_THRESHOLD = 0.9;
const SUPER_CRITICAL_THRESHOLD = 1.1;
const GAIN_ADJUSTMENT_RATE = 0.05;
const GAIN_MIN = 0.5;
const GAIN_MAX = 2.0;

export interface CriticalityState {
  branchingRatio: number;
  avalancheHistory: number[];
  excitabilityGain: number; // homeostatic excitatory gain [0.5, 2.0]
  inhibitoryGain: number; // homeostatic inhibitory gain [0.5, 2.0]
  criticalityScore: number; // 0-1: closeness to sigma=1.0
  regime: "sub-critical" | "critical" | "super-critical";
  measurementWindow: number[][];
  windowSize: number;
  ticksInWindow: number;
  adjustmentEvents: number;
  lastAvalancheSize: number;
  powerLawFit: number; // R2 of power-law fit [0,1]
}

export function initCriticalityState(): CriticalityState {
  return {
    branchingRatio: 1.0,
    avalancheHistory: [],
    excitabilityGain: 1.0,
    inhibitoryGain: 1.0,
    criticalityScore: 1.0,
    regime: "critical",
    measurementWindow: [],
    windowSize: WINDOW_SIZE,
    ticksInWindow: 0,
    adjustmentEvents: 0,
    lastAvalancheSize: 0,
    powerLawFit: 0.5,
  };
}

function measureBranchingRatio(windowSnapshots: number[][]): number {
  if (windowSnapshots.length < 2) return 1.0;
  const threshold = 0.3;
  let totalAncestors = 0;
  let totalDescendants = 0;
  for (let t = 0; t < windowSnapshots.length - 1; t++) {
    const current = windowSnapshots[t];
    const next = windowSnapshots[t + 1];
    if (!current || !next) continue;
    const ancestors = current.filter((a) => a > threshold).length;
    const descendants = next.filter((a) => a > threshold).length;
    if (ancestors > 0) {
      totalAncestors += ancestors;
      totalDescendants += descendants;
    }
  }
  if (totalAncestors === 0) return 1.0;
  return totalDescendants / totalAncestors;
}

function estimatePowerLawFit(avalancheSizes: number[]): number {
  if (avalancheSizes.length < 10) return 0.5;
  const sorted = [...avalancheSizes].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  if (max <= min) return 0.5;
  const rangeScore = Math.min(1, Math.log10(max / Math.max(min, 1)) / 2);
  const mean =
    avalancheSizes.reduce((a, b) => a + b, 0) / avalancheSizes.length;
  const variance =
    avalancheSizes.reduce((s, x) => s + (x - mean) ** 2, 0) /
    avalancheSizes.length;
  const cvScore = Math.min(1, Math.sqrt(variance) / Math.max(mean, 0.01));
  return rangeScore * 0.6 + Math.min(cvScore, 1) * 0.4;
}

export function updateCriticality(
  state: CriticalityState,
  regionActivations: number[],
): CriticalityState {
  state.measurementWindow.push([...regionActivations]);
  state.ticksInWindow++;

  const threshold = 0.3;
  const avalancheSize = regionActivations.filter((a) => a > threshold).length;
  state.lastAvalancheSize = avalancheSize;
  if (avalancheSize > 0) {
    state.avalancheHistory = [...state.avalancheHistory, avalancheSize].slice(
      -200,
    );
  }

  if (state.ticksInWindow >= WINDOW_SIZE) {
    const sigma = measureBranchingRatio(state.measurementWindow);
    state.branchingRatio = sigma;
    state.measurementWindow = state.measurementWindow.slice(-20);
    state.ticksInWindow = 0;

    state.regime =
      sigma < SUB_CRITICAL_THRESHOLD
        ? "sub-critical"
        : sigma > SUPER_CRITICAL_THRESHOLD
          ? "super-critical"
          : "critical";

    if (Math.abs(CRITICALITY_TARGET - sigma) > 0.05) {
      if (sigma < SUB_CRITICAL_THRESHOLD) {
        state.excitabilityGain = Math.min(
          GAIN_MAX,
          state.excitabilityGain + GAIN_ADJUSTMENT_RATE,
        );
        state.inhibitoryGain = Math.max(
          GAIN_MIN,
          state.inhibitoryGain - GAIN_ADJUSTMENT_RATE * 0.5,
        );
      } else {
        state.excitabilityGain = Math.max(
          GAIN_MIN,
          state.excitabilityGain - GAIN_ADJUSTMENT_RATE,
        );
        state.inhibitoryGain = Math.min(
          GAIN_MAX,
          state.inhibitoryGain + GAIN_ADJUSTMENT_RATE * 0.5,
        );
      }
      state.adjustmentEvents++;
    }
    state.criticalityScore =
      1 - Math.min(1, Math.abs(CRITICALITY_TARGET - sigma) * 5);
    state.powerLawFit = estimatePowerLawFit(state.avalancheHistory);
  }
  return state;
}

export function getCriticalityGainModifiers(state: CriticalityState): {
  excitabilityMultiplier: number;
  inhibitionMultiplier: number;
} {
  return {
    excitabilityMultiplier: state.excitabilityGain,
    inhibitionMultiplier: state.inhibitoryGain,
  };
}
