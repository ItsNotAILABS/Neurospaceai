// ─── Sensory Coupling Layer ───────────────────────────────────────────────────
// Real implementation: sensory relevance, uncertainty burden, environment
// modifiers, degradation under load, and explicit coupling functions that
// measurably influence salience and working-memory gate pressure.

import type { AutonomicState, InteroceptiveState } from "./coreBrainSchemas";

export interface SensoryCouplingState {
  schemaVersion: string;
  // Raw sensory fields
  sensoryRelevance: number; // 0-1: how relevant sensory stream is to current goal
  uncertaintyBurden: number; // 0-1: ambiguity/noise in sensory input
  environmentModifiers: Record<string, number>; // per-domain env factors
  degradationUnderLoad: number; // 0-1: how much sensory fidelity is lost under stress
  // Coupling output fields (written by coupling functions)
  sensoryToSalienceBoost: number; // added to salience score from sensory layer
  sensoryToWMGatePressure: number; // added to WM gate pressure from sensory uncertainty
  // Telemetry
  influenceRate: number; // fraction of ticks where sensory changed salience
  lastInfluenceMagnitude: number;
}

export function createDefaultSensoryCouplingState(): SensoryCouplingState {
  return {
    schemaVersion: "1.0.0",
    sensoryRelevance: 0.5,
    uncertaintyBurden: 0.2,
    environmentModifiers: {},
    degradationUnderLoad: 0,
    sensoryToSalienceBoost: 0,
    sensoryToWMGatePressure: 0,
    influenceRate: 0,
    lastInfluenceMagnitude: 0,
  };
}

/**
 * Compute sensory degradation under regulatory load.
 * High interoceptive overload + sympathetic dominance narrows sensory bandwidth.
 * Real coupling: overload -> degradationUnderLoad -> reduced sensory relevance.
 */
export function computeSensoryDegradation(
  interoceptive: InteroceptiveState,
  autonomic: AutonomicState,
): number {
  // Under high sympathetic tone + fatigue, sensory fidelity degrades
  const degradation =
    interoceptive.overloadLevel * 0.5 +
    autonomic.sympatheticTone * 0.3 +
    interoceptive.fatigueLoad * 0.2;
  return Math.min(1, Math.max(0, degradation));
}

/**
 * Compute salience boost from sensory coupling.
 * High sensory relevance + low uncertainty -> boosts salience.
 * Degradation under load reduces this boost (real coupling measurable in telemetry).
 */
export function computeSensoryToSalienceBoost(
  sensoryRelevance: number,
  uncertaintyBurden: number,
  degradationUnderLoad: number,
  environmentModifiers: Record<string, number>,
): number {
  const envMod =
    Object.values(environmentModifiers).reduce((s, v) => s + v, 0) /
    Math.max(1, Object.values(environmentModifiers).length);
  // High relevance + low uncertainty = strong salience contribution
  const base = sensoryRelevance * (1 - uncertaintyBurden * 0.6);
  // Degradation under load reduces the boost
  const afterDegradation = base * (1 - degradationUnderLoad * 0.7);
  // Environment modifiers (cover, fog, night) scale the contribution
  const boost = afterDegradation * (0.7 + Math.min(0.3, envMod * 0.3));
  return Math.min(0.4, Math.max(0, boost)); // max 0.4 boost to salience
}

/**
 * Compute WM gate pressure from sensory uncertainty.
 * High uncertainty means more candidates compete for WM slots -> gate pressure rises.
 * This is the sensory-to-working-memory influence coupling.
 */
export function computeSensoryToWMGatePressure(
  uncertaintyBurden: number,
  degradationUnderLoad: number,
): number {
  // Uncertain sensory input floods WM candidates -> pressure rises
  const pressure = uncertaintyBurden * 0.5 + degradationUnderLoad * 0.3;
  return Math.min(0.6, Math.max(0, pressure));
}

/**
 * Update full sensory coupling state. Returns new state and coupling delta
 * for telemetry recording.
 */
export function updateSensoryCoupling(
  prev: SensoryCouplingState,
  inputs: {
    sensoryRelevance: number;
    uncertaintyBurden: number;
    environmentModifiers: Record<string, number>;
    interoceptive: InteroceptiveState;
    autonomic: AutonomicState;
  },
  _tickCount: number,
): SensoryCouplingState {
  const degradation = computeSensoryDegradation(
    inputs.interoceptive,
    inputs.autonomic,
  );
  const salienceBoost = computeSensoryToSalienceBoost(
    inputs.sensoryRelevance,
    inputs.uncertaintyBurden,
    degradation,
    inputs.environmentModifiers,
  );
  const wmPressure = computeSensoryToWMGatePressure(
    inputs.uncertaintyBurden,
    degradation,
  );

  // Influence rate: EMA of whether sensory boost was non-trivial (>0.05)
  const didInfluence = salienceBoost > 0.05 || wmPressure > 0.1 ? 1 : 0;
  const influenceRate = prev.influenceRate * 0.95 + didInfluence * 0.05;
  const lastInfluenceMagnitude = Math.abs(
    salienceBoost - prev.sensoryToSalienceBoost,
  );

  return {
    schemaVersion: "1.0.0",
    sensoryRelevance: inputs.sensoryRelevance,
    uncertaintyBurden: inputs.uncertaintyBurden,
    environmentModifiers: { ...inputs.environmentModifiers },
    degradationUnderLoad: degradation,
    sensoryToSalienceBoost: salienceBoost,
    sensoryToWMGatePressure: wmPressure,
    influenceRate,
    lastInfluenceMagnitude,
  };
}
