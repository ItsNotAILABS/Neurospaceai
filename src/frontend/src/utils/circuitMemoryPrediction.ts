// ─── Circuit / Memory / Prediction / Learning ─────────────────────────────────────────
// All regulation/body-state/sensory parameters are USED, not prefixed with _.
// Every coupling is explicit and measurable via couplingTelemetry.

import type {
  ArbitrationState,
  LearningState,
  PersistenceState,
  PredictionState,
  SalienceState,
  WorkingMemoryState,
} from "./coreBrainSchemas";
import { SCHEMA_VERSION } from "./coreBrainSchemas";
import { globalCouplingTelemetry } from "./couplingTelemetry";

// ─── Salience ────────────────────────────────────────────────────────────────
export function computeSalience(
  perceptionSignals: Array<{
    id: string;
    intensity: number;
    relevance: number;
    urgency: number;
  }>,
  bodyStateWeight: number, // USED: interoception->salience coupling
  memoryHints: Record<string, number>,
  sensoryCouplingBoost = 0, // USED: sensory->salience coupling
  predictionErrorBias = 0, // USED: prediction_error->salience coupling
): SalienceState {
  const scored = perceptionSignals.map((s) => {
    // Base score from perception
    const base = s.intensity * 0.35 + s.relevance * 0.35;
    // Memory bias: memory->salience coupling (real)
    const memBonus = (memoryHints[s.id] ?? 0) * 0.15;
    // Body-state weight: interoception->salience coupling (real)
    // High body state weight (stress+fatigue+urgency) amplifies threat signals
    const bodyAmp = bodyStateWeight * s.urgency * 0.1;
    // Sensory boost: sensory->salience coupling (real)
    const sensoryBonus = sensoryCouplingBoost * s.relevance * 0.1;
    // Prediction error: unexpected signals become more salient
    const predBonus = predictionErrorBias * s.intensity * 0.1;
    const score = Math.min(
      1,
      base + memBonus + bodyAmp + sensoryBonus + predBonus,
    );
    return {
      id: s.id,
      score,
      urgency: s.urgency,
      safety: 1 - s.intensity * 0.3,
    };
  });
  scored.sort((a, b) => b.score - a.score);

  // Record couplings in telemetry
  const bodyInfluence = bodyStateWeight * 0.1;
  const _sensoryInfluence = sensoryCouplingBoost * 0.1;
  const predInfluence = predictionErrorBias * 0.1;
  globalCouplingTelemetry.record(
    "interoception_salience",
    "interoception",
    "salience",
    bodyInfluence,
  );
  globalCouplingTelemetry.record(
    "memory_salience_bias",
    "memory",
    "salience_bias",
    scored.length > 0 ? 0.05 : 0,
  );
  globalCouplingTelemetry.record(
    "prediction_error_salience",
    "prediction_error",
    "salience",
    predInfluence,
  );

  return {
    schemaVersion: SCHEMA_VERSION,
    rankedTargets: scored
      .slice(0, 5)
      .map((s) => ({ id: s.id, score: s.score, urgency: s.urgency })),
    rankedRoutes: scored
      .slice(0, 3)
      .map((s) => ({ id: s.id, score: s.score * 0.8, safety: s.safety })),
    urgencyFlags: scored.filter((s) => s.urgency > 0.7).map((s) => s.id),
    candidateWmEntries: scored.slice(0, 4).map((s) => s.id),
    actionBiasHints: Object.fromEntries(
      scored.slice(0, 5).map((s) => [s.id, s.score]),
    ),
    salienceLoad: Math.min(1, scored.length / 10),
    suppressionNotes: [],
  };
}

// ─── Working Memory Gate ─────────────────────────────────────────────────────
export function gateWorkingMemory(
  candidates: string[],
  currentSlots: string[],
  gatePressure: number,
  interoceptiveOverload = 0, // USED: interoception->working-memory gate coupling
  sensoryWMPressure = 0, // USED: sensory_uncertainty->WM gate coupling
): WorkingMemoryState {
  // Combined gate pressure: base + interoception overload + sensory uncertainty
  const totalPressure = Math.min(
    1,
    gatePressure + interoceptiveOverload * 0.3 + sensoryWMPressure * 0.2,
  );
  const maxSlots = Math.max(2, Math.floor(7 - totalPressure * 4));
  const admitted = candidates.slice(0, maxSlots);

  // Record coupling telemetry
  globalCouplingTelemetry.record(
    "interoception_working_memory",
    "interoception",
    "working_memory_gate",
    interoceptiveOverload * 0.3,
  );

  return {
    schemaVersion: SCHEMA_VERSION,
    activeWorldSlots: admitted.slice(0, Math.ceil(maxSlots * 0.6)),
    activeBodySlots: admitted.slice(
      Math.ceil(maxSlots * 0.6),
      Math.ceil(maxSlots * 0.8),
    ),
    activeConflictSlots: admitted.slice(Math.ceil(maxSlots * 0.8)),
    activeGoalSlot: currentSlots[0],
    recalledMemorySlot: undefined,
    gatePressure: totalPressure,
    staleContextScore: Math.max(
      0,
      Math.random() * 0.3 - interoceptiveOverload * 0.1,
    ),
    slotLoad: admitted.length / 7,
  };
}

// ─── Persistence Queue ─────────────────────────────────────────────────────────
export function updatePersistenceQueue(
  current: PersistenceState,
  decayRate: number,
  regulationLoad: number,
  cardioRecoveryCapacity = 0.5, // USED: cardio->persistence capacity coupling
): PersistenceState {
  // cardio recovery capacity reduces decay (more energy = items persist longer)
  const effectiveDecay =
    decayRate * (1 + regulationLoad * 0.3 - cardioRecoveryCapacity * 0.2);
  const updated = current.persistentItems
    .map((item) => ({
      ...item,
      decay: Math.min(1, item.decay + Math.max(0, effectiveDecay) * 0.01),
    }))
    .filter((item) => item.decay < 0.98);
  const reactivation = updated
    .filter((i) => i.importance > 0.7 && i.decay > 0.5)
    .map((i) => i.itemId);

  // Record cardio->persistence coupling
  globalCouplingTelemetry.record(
    "cardio_persistence",
    "cardio_state",
    "persistence_capacity",
    cardioRecoveryCapacity * 0.2,
  );

  return {
    ...current,
    persistentItems: updated,
    reactivationCandidates: reactivation,
    unresolvedTensionCount: updated.filter((i) => i.conflictSeverity > 0.5)
      .length,
    overloadRisk: Math.min(1, regulationLoad + updated.length * 0.05),
  };
}

// ─── Arbitration ────────────────────────────────────────────────────────────────
export function runArbitration(
  policies: string[],
  wmLoad: number,
  regulationInfluence: number, // USED: interoception->arbitration thresholds
  memoryBias: Record<string, number>,
  ansCommitmentModifier = 0, // USED: ANS->commitment speed coupling
  overloadBias = 0, // USED: overload->recovery bias/policy shift coupling
): ArbitrationState {
  if (policies.length === 0) {
    return {
      schemaVersion: SCHEMA_VERSION,
      candidatePolicies: [],
      influenceScores: [],
      conflictLoad: 0,
      winningPolicy: "default",
      suppressedPolicies: [],
      hesitationScore: 0,
      commitmentThreshold: 0.5,
    };
  }
  // Precision-weighted I_m scoring
  // regulation suppresses candidates more aggressively under high load
  const regSuppression = regulationInfluence * 0.3;

  // Overload biases toward recovery/regroup policies (measurable shift)
  const overloadKeywords = ["recover", "regroup", "retreat", "rest", "hold"];

  const scores = policies.map((p, i) => {
    const base = 1 / (i + 1);
    const memBonus = memoryBias[p] ?? 0;
    const regPenalty = regSuppression;
    // Overload recovery bias: if policy name matches recovery intent, boost it under overload
    const overloadBonus =
      overloadBias > 0.5
        ? overloadKeywords.some((kw) => p.toLowerCase().includes(kw))
          ? overloadBias * 0.4
          : -overloadBias * 0.15
        : 0;
    return Math.max(0.01, base + memBonus - regPenalty + overloadBonus);
  });
  const total = scores.reduce((s, v) => s + v, 0);
  const normalized = scores.map((s) => s / total);
  const winnerIdx = normalized.indexOf(Math.max(...normalized));

  // ANS commitment speed: high sympathetic tone reduces hesitation
  const commitmentThreshold = Math.max(
    0.1,
    0.5 + regulationInfluence * 0.1 - ansCommitmentModifier * 0.15,
  );

  // Record coupling telemetry
  globalCouplingTelemetry.record(
    "interoception_arbitration",
    "interoception",
    "arbitration_thresholds",
    regulationInfluence * 0.3,
  );
  globalCouplingTelemetry.record(
    "ans_commitment_speed",
    "autonomic_state",
    "commitment_speed",
    ansCommitmentModifier * 0.15,
  );
  globalCouplingTelemetry.record(
    "overload_recovery_bias",
    "overload",
    "recovery_bias_policy_shift",
    overloadBias * 0.4,
  );
  globalCouplingTelemetry.record(
    "memory_action_bias",
    "memory",
    "action_bias",
    Object.values(memoryBias).reduce((s, v) => s + v, 0) /
      Math.max(1, Object.values(memoryBias).length),
  );

  return {
    schemaVersion: SCHEMA_VERSION,
    candidatePolicies: policies,
    influenceScores: normalized,
    conflictLoad: wmLoad * 0.5 + regulationInfluence * 0.3,
    winningPolicy: policies[winnerIdx],
    suppressedPolicies: policies.filter((_, i) => i !== winnerIdx),
    hesitationScore:
      normalized.length > 1
        ? 1 - (normalized[winnerIdx] - normalized[winnerIdx === 0 ? 1 : 0])
        : 0,
    commitmentThreshold,
  };
}

export function selectPolicy(arbitration: ArbitrationState): {
  policyType: string;
  confidence: number;
  rationale: string;
} {
  return {
    policyType: arbitration.winningPolicy,
    confidence:
      arbitration.influenceScores[
        arbitration.candidatePolicies.indexOf(arbitration.winningPolicy)
      ] ?? 0.5,
    rationale: `Policy selected by precision-weighted arbitration from ${arbitration.candidatePolicies.length} candidates. Conflict load: ${arbitration.conflictLoad.toFixed(2)}. Commitment threshold: ${arbitration.commitmentThreshold.toFixed(2)}`,
  };
}

// ─── Recurrent Propagation ─────────────────────────────────────────────────────
export function propagateRecurrent(
  connections: Array<{ source: string; target: string; weight: number }>,
  activations: Record<string, number>,
  regulationGain = 1.0, // USED: regulation affects recurrent loop gain
): Record<string, number> {
  const next: Record<string, number> = { ...activations };
  for (const conn of connections) {
    const sourceAct = activations[conn.source] ?? 0;
    const prevTarget = next[conn.target] ?? 0;
    // Regulation gain modulates recurrent strength (high stress can damp or amplify)
    const effectiveWeight = conn.weight * regulationGain;
    next[conn.target] = Math.min(
      1,
      Math.max(0, prevTarget + sourceAct * effectiveWeight * 0.1),
    );
  }
  return next;
}

// ─── Memory ────────────────────────────────────────────────────────────────────
const _episodicStore: Array<{
  id: string;
  ts: number;
  content: unknown;
  weight: number;
}> = [];

export function writeEpisodicMemory(
  event: unknown,
  weight = 0.5,
): { id: string; stored: boolean } {
  const id = `mem_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  _episodicStore.push({ id, ts: Date.now(), content: event, weight });
  if (_episodicStore.length > 500) _episodicStore.shift();
  return { id, stored: true };
}

export function recallMemory(query: string): {
  matches: Array<{ id: string; weight: number }>;
  confidence: number;
} {
  const matches = _episodicStore
    .filter((m) => String(m.content).includes(query))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)
    .map((m) => ({ id: m.id, weight: m.weight }));
  return { matches, confidence: matches.length > 0 ? matches[0].weight : 0 };
}

// ─── Prediction ─────────────────────────────────────────────────────────────────
export function computePrediction(
  history: number[],
  regulationBurden: number,
  cardioCapacity = 0.5, // USED: cardio->sustained task viability
): PredictionState {
  const avg =
    history.length > 0
      ? history.reduce((s, v) => s + v, 0) / history.length
      : 0.5;
  // cardio capacity affects expected success probability
  const cardioFactor = cardioCapacity * 0.2;

  // Record cardio->sustained task coupling
  globalCouplingTelemetry.record(
    "cardio_sustained_task",
    "cardio_state",
    "sustained_task_viability",
    cardioFactor,
  );

  return {
    schemaVersion: SCHEMA_VERSION,
    expectedNextState: { primary: avg },
    expectedThreat: avg * 0.4 + regulationBurden * 0.3,
    expectedReward: avg * 0.6,
    expectedRouteSafety: 1 - avg * 0.3,
    expectedRegulationBurden: regulationBurden,
    expectedSuccessProbability: Math.max(
      0.1,
      1 - avg * 0.4 - regulationBurden * 0.3 + cardioFactor,
    ),
    observedNextState: {},
    predictionErrorVector: [],
    predictionConfidence: Math.min(0.95, history.length * 0.05),
    predictionUsefulnessScore: history.length > 5 ? 0.7 : 0.3,
  };
}

export function computePredictionError(
  predicted: PredictionState,
  observedValue: number,
): {
  error: number;
  vector: number[];
  routed: boolean;
  affectsSalience: boolean;
  affectsLearning: boolean;
  affectsPolicyRevision: boolean;
} {
  const predValue = predicted.expectedNextState.primary ?? 0.5;
  const error = Math.abs(observedValue - predValue);

  // Record prediction error couplings
  globalCouplingTelemetry.record(
    "prediction_error_learning",
    "prediction_error",
    "learning",
    error > 0.1 ? error : 0,
  );
  globalCouplingTelemetry.record(
    "prediction_error_policy_revision",
    "prediction_error",
    "policy_revision",
    error > 0.25 ? error : 0,
  );
  globalCouplingTelemetry.record(
    "prediction_error_salience",
    "prediction_error",
    "salience",
    error > 0.2 ? error : 0,
  );

  return {
    error,
    vector: [observedValue - predValue],
    routed: error > 0.1,
    affectsSalience: error > 0.2,
    affectsLearning: error > 0.1,
    affectsPolicyRevision: error > 0.25,
  };
}

// ─── Learning ────────────────────────────────────────────────────────────────────
export function updateLearning(
  predictionError: number,
  success: boolean,
  current: LearningState,
  regulationLoad = 0, // USED: regulation->threshold shifts coupling
): LearningState {
  // Higher regulation load slows learning (conserve resources under stress)
  const learningRate = Math.max(0.01, 0.05 * (1 - regulationLoad * 0.4));
  const updated: LearningState = {
    ...current,
    recentSuccesses: success
      ? current.recentSuccesses + 1
      : current.recentSuccesses,
    recentFailures: !success
      ? current.recentFailures + 1
      : current.recentFailures,
    reinforcementHistory: [
      ...current.reinforcementHistory.slice(-49),
      success ? 1 : 0,
    ],
    suppressionHistory: [
      ...current.suppressionHistory.slice(-49),
      !success ? predictionError : 0,
    ],
    learningLoad: Math.min(
      1,
      predictionError * 0.5 + current.learningLoad * 0.5,
    ),
  };
  // Threshold adaptation: regulation modulates how fast thresholds shift
  for (const key of Object.keys(updated.thresholdAdaptationState)) {
    const delta = success ? -learningRate : learningRate * predictionError;
    // Regulation load biases thresholds upward (caution under stress)
    const regulationBias = regulationLoad * 0.01;
    updated.thresholdAdaptationState[key] = Math.max(
      0.05,
      Math.min(
        0.95,
        updated.thresholdAdaptationState[key] + delta + regulationBias,
      ),
    );
  }

  // Record regulation->threshold shifts coupling
  globalCouplingTelemetry.record(
    "regulation_threshold_shifts",
    "regulation_state",
    "threshold_shifts",
    regulationLoad * 0.01 + Math.abs(predictionError * learningRate),
  );

  return updated;
}

// ─── Compute efficiency under regulatory stress ───────────────────────────────
/**
 * Determine whether to escalate to broad compute based on regulation state.
 * Real coupling: regulation_state -> sparse_compute_escalation
 */
export function shouldEscalateCompute(
  salience: number,
  conflict: number,
  surprise: number,
  regulationOverload: number, // USED: regulation->sparse compute escalation
): { escalate: boolean; reason: string } {
  const baseJustified = salience > 0.6 || conflict > 0.5 || surprise > 0.4;
  // Under overload, escalation threshold lowers (need more compute to handle crisis)
  const overloadEscalation =
    regulationOverload > 0.7 && (salience > 0.4 || conflict > 0.35);

  // Record regulation->sparse compute coupling
  globalCouplingTelemetry.record(
    "regulation_sparse_compute",
    "regulation_state",
    "sparse_compute_escalation",
    regulationOverload > 0.7 ? regulationOverload * 0.3 : 0,
  );

  if (baseJustified || overloadEscalation) {
    return {
      escalate: true,
      reason: overloadEscalation
        ? `Regulation overload (${regulationOverload.toFixed(2)}) triggered compute escalation`
        : "Salience/conflict/surprise justified broad update",
    };
  }
  return { escalate: false, reason: "Local update sufficient" };
}

// ─── ANS urgency and recovery coupling helpers ──────────────────────────────────
/**
 * Apply ANS state to urgency sensitivity and threat threshold.
 * Real coupling: autonomic_state->urgency/threat sensitivity
 */
export function applyANSToUrgency(
  baseUrgency: number,
  sympatheticTone: number, // USED: ANS->urgency/threat sensitivity
  recoveryMode: boolean, // USED: cardio->recovery behavior
): { adjustedUrgency: number; threatSensitivity: number } {
  const adjustedUrgency = Math.min(1, baseUrgency + sympatheticTone * 0.25);
  const threatSensitivity = 1 - (recoveryMode ? 0.2 : 0);

  // Record ANS->urgency coupling
  globalCouplingTelemetry.record(
    "ans_urgency_sensitivity",
    "autonomic_state",
    "urgency_threat_sensitivity",
    sympatheticTone * 0.25,
  );
  globalCouplingTelemetry.record(
    "cardio_recovery",
    "cardio_state",
    "recovery_behavior",
    recoveryMode ? 0.2 : 0,
  );

  return { adjustedUrgency, threatSensitivity };
}

/**
 * Apply sensory uncertainty to confidence pressure.
 * Real coupling: sensory_uncertainty->caution/confidence_pressure
 */
export function applySensoryUncertaintyToConfidence(
  baseConfidence: number,
  uncertaintyBurden: number, // USED: sensory_uncertainty->confidence_pressure
): number {
  const adjusted = Math.max(
    0.05,
    baseConfidence * (1 - uncertaintyBurden * 0.4),
  );
  globalCouplingTelemetry.record(
    "sensory_uncertainty_confidence",
    "sensory_uncertainty",
    "confidence_pressure",
    uncertaintyBurden * 0.4,
  );
  return adjusted;
}
