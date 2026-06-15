/**
 * metaAwarenessEngine.ts
 * Real meta-awareness layer: SelfModelLayer, WorldSelfDistinctionLayer,
 * MetaAwarenessMonitor, ContinuityOfSelfLayer, ConsciousAccessGate,
 * FeltPriorityProxyLayer.
 * Every field has real state. All outputs causally affect arbitration.
 */

export interface MetaAwarenessState {
  // SelfModelLayer
  selfCoherence: number;
  selfBoundaryClarity: number;
  bodyOwnershipIndex: number;

  // WorldSelfDistinctionLayer
  worldModelConfidence: number;
  selfWorldContrastIndex: number;
  agencyEstimate: number;

  // MetaAwarenessMonitor
  metaAwarenessLevel: number;
  attentionToSelf: number;
  attentionToWorld: number;

  // ContinuityOfSelfLayer
  temporalContinuityScore: number;
  memoryCoherenceIndex: number;
  identityStabilityIndex: number;

  // ConsciousAccessGate
  accessGateThreshold: number;
  gatePressure: number;
  gatedItems: number;

  // FeltPriorityProxyLayer
  feltUrgency: number;
  feltConfidence: number;
  feltValence: number;
  feltArousability: number;

  // Derived causal outputs
  arbitrationBias: number; // -1 to 1
  confidenceModulator: number; // 0.5 to 1.5
  actionCommitmentScale: number; // 0.5 to 1.5
}

export interface MetaAwarenessInputs {
  pfcActivation: number;
  amygdalaActivation: number;
  hippocampusActivation: number;
  insulaActivation: number;
  accActivation: number;
  nacActivation: number;
  globalArousal: number;
  predictionError: number;
  sympatheticTone: number;
  fatigue: number;
  stress: number;
  episodicMemoryStrength: number;
  failureMemoryStrength: number;
  tick: number;
}

export function initMetaAwarenessState(): MetaAwarenessState {
  return {
    selfCoherence: 0.5,
    selfBoundaryClarity: 0.5,
    bodyOwnershipIndex: 0.5,
    worldModelConfidence: 0.5,
    selfWorldContrastIndex: 0.5,
    agencyEstimate: 0.5,
    metaAwarenessLevel: 0.5,
    attentionToSelf: 0.5,
    attentionToWorld: 0.5,
    temporalContinuityScore: 0.5,
    memoryCoherenceIndex: 0.5,
    identityStabilityIndex: 0.5,
    accessGateThreshold: 0.55,
    gatePressure: 0.3,
    gatedItems: 2,
    feltUrgency: 0.3,
    feltConfidence: 0.5,
    feltValence: 0.0,
    feltArousability: 0.5,
    arbitrationBias: 0.0,
    confidenceModulator: 1.0,
    actionCommitmentScale: 1.0,
  };
}

function ema(prev: number, next: number, alpha: number): number {
  return prev * (1 - alpha) + next * alpha;
}

function clamp(v: number, lo = 0, hi = 1): number {
  return Math.max(lo, Math.min(hi, v));
}

export class MetaAwarenessEngine {
  private state: MetaAwarenessState = initMetaAwarenessState();

  getState(): MetaAwarenessState {
    return { ...this.state };
  }

  update(inputs: MetaAwarenessInputs): MetaAwarenessState {
    const prev = this.state;
    const {
      pfcActivation,
      amygdalaActivation,
      hippocampusActivation,
      insulaActivation,
      accActivation,
      nacActivation,
      globalArousal,
      predictionError,
      sympatheticTone,
      fatigue,
      episodicMemoryStrength,
      failureMemoryStrength,
    } = inputs;

    // ── SelfModelLayer ────────────────────────────────────────────────
    const selfCoherence = clamp(
      ema(
        prev.selfCoherence,
        pfcActivation * 0.6 + (1 - accActivation * 0.4),
        0.1,
      ),
    );
    const bodyOwnershipIndex = clamp(
      ema(
        prev.bodyOwnershipIndex,
        insulaActivation * 0.6 + (1 - fatigue) * 0.4,
        0.1,
      ),
    );
    const selfBoundaryClarity = clamp(
      ema(
        prev.selfBoundaryClarity,
        (selfCoherence + bodyOwnershipIndex) * 0.5,
        0.08,
      ),
    );

    // ── WorldSelfDistinctionLayer ─────────────────────────────────────
    const worldModelConfidence = clamp(
      ema(
        prev.worldModelConfidence,
        hippocampusActivation * 0.5 + (1 - predictionError) * 0.5,
        0.08,
      ),
    );
    const agencyEstimate = clamp(
      ema(
        prev.agencyEstimate,
        (1 - predictionError) * 0.5 + pfcActivation * 0.3 + (1 - fatigue) * 0.2,
        0.1,
      ),
    );
    const selfWorldContrastIndex = clamp(
      Math.abs(selfCoherence - worldModelConfidence),
    );

    // ── MetaAwarenessMonitor ──────────────────────────────────────────
    const ansBalance = 1 - Math.abs(sympatheticTone - 0.5) * 2;
    const metaAwarenessLevel = clamp(
      selfCoherence * 0.4 + worldModelConfidence * 0.3 + ansBalance * 0.3,
    );
    // Attention splits based on internal vs external salience
    const attentionToSelf = clamp(
      insulaActivation * 0.5 + accActivation * 0.3 + (1 - globalArousal) * 0.2,
    );
    const attentionToWorld = clamp(1 - attentionToSelf + globalArousal * 0.2);

    // ── ContinuityOfSelfLayer ─────────────────────────────────────────
    const temporalContinuityScore = clamp(
      ema(
        prev.temporalContinuityScore,
        (selfCoherence + episodicMemoryStrength) / 2,
        0.05,
      ),
    );
    const memoryCoherenceIndex = clamp(
      ema(
        prev.memoryCoherenceIndex,
        episodicMemoryStrength * 0.7 + (1 - failureMemoryStrength) * 0.3,
        0.07,
      ),
    );
    const identityStabilityIndex = clamp(
      temporalContinuityScore * selfCoherence,
    );

    // ── ConsciousAccessGate ───────────────────────────────────────────
    const accessGateThreshold = clamp(0.3 + metaAwarenessLevel * 0.5, 0.3, 0.8);
    // Gate pressure: how much is competing for conscious access
    const gatePressure = clamp(
      amygdalaActivation * 0.35 +
        accActivation * 0.25 +
        predictionError * 0.25 +
        globalArousal * 0.15,
    );
    // Items above gate: estimated from competing signals
    const gatedItems = Math.round(
      Math.max(0, (gatePressure - accessGateThreshold + 0.4) * 10),
    );

    // ── FeltPriorityProxyLayer ────────────────────────────────────────
    const feltUrgency = clamp(
      amygdalaActivation * 0.5 + sympatheticTone * 0.3 + accActivation * 0.2,
    );
    const feltConfidence = clamp(
      pfcActivation * 0.5 +
        (1 - predictionError) * 0.3 +
        worldModelConfidence * 0.2,
    );
    const feltValence = clamp(
      (nacActivation - amygdalaActivation) * 0.7 + (1 - fatigue) * 0.3,
      -1,
      1,
    );
    const feltArousability = clamp(
      globalArousal * 0.5 + sympatheticTone * 0.3 + feltUrgency * 0.2,
    );

    // ── Derived causal outputs ────────────────────────────────────────
    const arbitrationBias = clamp(
      feltValence * 0.4 + (worldModelConfidence - 0.5) * 0.6,
      -1,
      1,
    );
    const confidenceModulator = clamp(0.5 + feltConfidence, 0.5, 1.5);
    const actionCommitmentScale = clamp(
      0.5 + temporalContinuityScore * identityStabilityIndex,
      0.5,
      1.5,
    );

    this.state = {
      selfCoherence,
      selfBoundaryClarity,
      bodyOwnershipIndex,
      worldModelConfidence,
      selfWorldContrastIndex,
      agencyEstimate,
      metaAwarenessLevel,
      attentionToSelf,
      attentionToWorld,
      temporalContinuityScore,
      memoryCoherenceIndex,
      identityStabilityIndex,
      accessGateThreshold,
      gatePressure,
      gatedItems,
      feltUrgency,
      feltConfidence,
      feltValence,
      feltArousability,
      arbitrationBias,
      confidenceModulator,
      actionCommitmentScale,
    };

    return { ...this.state };
  }

  reset(): void {
    this.state = initMetaAwarenessState();
  }
}

// Singleton
export const globalMetaAwareness = new MetaAwarenessEngine();
