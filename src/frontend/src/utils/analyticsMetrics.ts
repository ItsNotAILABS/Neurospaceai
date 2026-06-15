// ─── Analytics Metrics ───────────────────────────────────────────────────────
// Real metric modules derived from runtime state.
// Every metric derives from actual computation, not hardcoded values.

import {
  globalConnectionScorer,
  globalMotifScorer,
  globalPathwayTracker,
} from "./circuitPlasticityModules";
import { globalCouplingTelemetry } from "./couplingTelemetry";
import {
  globalContractRegistry,
  globalIngestService,
  globalSessionManager,
} from "./integrationContractLayer";
import {
  computeANSState,
  computeCardioState,
  computeInteroceptiveState,
} from "./regulationFoundation";
import { globalSparseCompute } from "./sparseComputeTelemetry";

// ─── Cardio Metrics ──────────────────────────────────────────────────────────
export interface CardioMetricsSnapshot {
  heartRateProxy: number;
  hrvProxy: number;
  circulationPressureProxy: number;
  recoveryCapacityProxy: number;
  sustainedEffortIndex: number;
  exertionBurden: number;
  cardioStabilityIndex: number;
  collapseRiskProxy: number;
  // Derived quality scores
  hrvModulatedRecoveryRate: number; // HRV modulates recovery: high HRV = faster recovery
  exertionSuppressedCapacity: number; // High exertion suppresses sustained capacity
  overallCardioHealth: number; // 0-1 composite
}

export function computeCardioMetrics(
  stress = 0.3,
  fatigue = 0.2,
  exertion = 0.2,
): CardioMetricsSnapshot {
  const intero = computeInteroceptiveState({
    rawStress: stress,
    rawFatigue: fatigue,
    rawUrgency: stress * 0.7,
    rawConfidence: 1 - stress * 0.5,
    exertion,
  });
  const cardio = computeCardioState(intero, exertion);

  // HRV modulates recovery: higher HRV = more parasympathetic = better recovery rate
  const normHRV = Math.min(1, cardio.hrvProxy / 80);
  const hrvModulatedRecoveryRate =
    cardio.recoveryCapacityProxy * (0.5 + normHRV * 0.5);

  // High exertion suppresses sustained capacity
  const exertionSuppressedCapacity = Math.max(
    0,
    cardio.sustainedEffortIndex * (1 - cardio.exertionBurden * 0.4),
  );

  const overallCardioHealth = Math.max(
    0,
    1 -
      cardio.collapseRiskProxy * 0.6 -
      cardio.exertionBurden * 0.2 +
      normHRV * 0.1,
  );

  return {
    heartRateProxy: cardio.heartRateProxy,
    hrvProxy: cardio.hrvProxy,
    circulationPressureProxy: cardio.circulationPressureProxy,
    recoveryCapacityProxy: cardio.recoveryCapacityProxy,
    sustainedEffortIndex: cardio.sustainedEffortIndex,
    exertionBurden: cardio.exertionBurden,
    cardioStabilityIndex: cardio.cardioStabilityIndex,
    collapseRiskProxy: cardio.collapseRiskProxy,
    hrvModulatedRecoveryRate,
    exertionSuppressedCapacity,
    overallCardioHealth: Math.min(1, Math.max(0, overallCardioHealth)),
  };
}

// ─── ANS Metrics ─────────────────────────────────────────────────────────────
export interface ANSMetricsSnapshot {
  sympatheticTone: number;
  parasympatheticTone: number;
  autonomicBalance: number; // parasympathetic / (sympathetic + parasympathetic)
  arousalMode: string;
  threatThresholdShift: number;
  reactionUrgencyShift: number;
  recoveryModeActive: boolean;
  // Derived
  sympatheticDominance: boolean;
  systemicStressLoad: number;
  overallANSHealth: number;
}

export function computeANSMetrics(
  stress = 0.3,
  fatigue = 0.2,
  exertion = 0.2,
): ANSMetricsSnapshot {
  const intero = computeInteroceptiveState({
    rawStress: stress,
    rawFatigue: fatigue,
    rawUrgency: stress * 0.7,
    rawConfidence: 1 - stress * 0.5,
    exertion,
  });
  const cardio = computeCardioState(intero, exertion);
  const ans = computeANSState(cardio, intero);

  // High sympathetic suppresses parasympathetic (real ANS coupling)
  const sympatheticTone = Math.min(1, stress * 0.7 + exertion * 0.3);
  const parasympatheticTone = Math.max(0, 1 - sympatheticTone * 0.85);
  const autonomicBalance =
    parasympatheticTone / (sympatheticTone + parasympatheticTone + 0.001);

  const arousalMode =
    ans.autonomicBalanceIndex < 0.3
      ? "FIGHT_FLIGHT"
      : ans.autonomicBalanceIndex < 0.5
        ? "ALERT"
        : ans.autonomicBalanceIndex < 0.7
          ? "ENGAGED"
          : "REST_DIGEST";
  const recoveryModeActive = autonomicBalance > 0.65;
  const systemicStressLoad = sympatheticTone * (1 - autonomicBalance);
  const overallANSHealth =
    autonomicBalance * 0.5 + (1 - systemicStressLoad) * 0.5;

  return {
    sympatheticTone,
    parasympatheticTone,
    autonomicBalance,
    arousalMode,
    threatThresholdShift: ans.threatThresholdModifier,
    reactionUrgencyShift: ans.reactionSpeedModifier,
    recoveryModeActive,
    sympatheticDominance: sympatheticTone > 0.55,
    systemicStressLoad,
    overallANSHealth: Math.min(1, Math.max(0, overallANSHealth)),
  };
}

// ─── Sensory Metrics ─────────────────────────────────────────────────────────
export interface SensoryMetricsSnapshot {
  sensoryRelevance: number;
  uncertaintyBurden: number;
  environmentModifierStrength: number;
  degradationUnderLoad: number;
  sensoryToSalienceCouplingScore: number;
  sensoryToWMInfluenceScore: number;
  overallSensoryHealth: number;
}

export function computeSensoryMetrics(
  uncertaintyLoad = 0.3,
  stressLoad = 0.2,
): SensoryMetricsSnapshot {
  const snap = globalCouplingTelemetry.snapshot();
  const sensoryUncertaintyBurden =
    snap.sensoryUncertaintyBurden ?? uncertaintyLoad;

  // Sensory-to-salience coupling: derived from coupling telemetry
  const salienceCoupling = snap.couplings.find(
    (c) => c.couplingId === "sensory_salience_boost",
  );
  const wmCoupling = snap.couplings.find(
    (c) => c.couplingId === "sensory_wm_pressure",
  );

  const degradationUnderLoad = Math.min(
    1,
    stressLoad * 0.6 + uncertaintyLoad * 0.3,
  );
  const sensoryToSalienceCouplingScore = salienceCoupling
    ? salienceCoupling.influenceRate
    : Math.max(0.1, 1 - uncertaintyLoad);
  const sensoryToWMInfluenceScore = wmCoupling
    ? wmCoupling.influenceRate
    : Math.max(0.05, 0.5 - uncertaintyLoad * 0.4);

  const overallSensoryHealth = Math.max(
    0,
    1 - sensoryUncertaintyBurden * 0.4 - degradationUnderLoad * 0.3,
  );

  return {
    sensoryRelevance: Math.max(0.2, 1 - uncertaintyLoad * 0.5),
    uncertaintyBurden: sensoryUncertaintyBurden,
    environmentModifierStrength: Math.min(1, stressLoad * 0.4 + 0.2),
    degradationUnderLoad,
    sensoryToSalienceCouplingScore,
    sensoryToWMInfluenceScore,
    overallSensoryHealth: Math.min(1, Math.max(0, overallSensoryHealth)),
  };
}

// ─── Spatial Metrics ─────────────────────────────────────────────────────────
export interface SpatialMetricsSnapshot {
  spatialAwarenessIndex: number;
  movementCost: number;
  exposureFactor: number;
  positionalUncertainty: number;
  spatialToSalienceWeight: number;
  terrainBurden: number;
  overallSpatialHealth: number;
}

export function computeSpatialMetrics(
  exposureLevel = 0.3,
  terrainDifficulty = 0.3,
): SpatialMetricsSnapshot {
  const snap = globalCouplingTelemetry.snapshot();
  const uncertaintyBurden = snap.sensoryUncertaintyBurden ?? 0.3;

  const spatialAwarenessIndex = Math.max(
    0.1,
    1 - uncertaintyBurden * 0.4 - exposureLevel * 0.2,
  );
  const movementCost = Math.min(
    1,
    terrainDifficulty * 0.5 + exposureLevel * 0.3,
  );
  const exposureFactor = Math.min(1, exposureLevel);
  const positionalUncertainty = Math.min(
    1,
    uncertaintyBurden * 0.6 + terrainDifficulty * 0.2,
  );
  const spatialToSalienceWeight = Math.min(
    1,
    positionalUncertainty * 0.7 + exposureFactor * 0.3,
  );
  const terrainBurden = Math.min(
    1,
    terrainDifficulty * 0.6 + movementCost * 0.3,
  );
  const overallSpatialHealth = Math.max(
    0,
    1 - positionalUncertainty * 0.4 - terrainBurden * 0.3,
  );

  return {
    spatialAwarenessIndex,
    movementCost,
    exposureFactor,
    positionalUncertainty,
    spatialToSalienceWeight,
    terrainBurden,
    overallSpatialHealth: Math.min(1, Math.max(0, overallSpatialHealth)),
  };
}

// ─── Emergence Metrics ───────────────────────────────────────────────────────
export interface EmergenceMetricsSnapshot {
  policyDiversityIndex: number;
  causalTraceDepth: number;
  crossLayerInfluenceCount: number;
  predictionRevisionRate: number;
  adaptationRate: number;
  overallEmergenceScore: number;
}

export function computeEmergenceMetrics(): EmergenceMetricsSnapshot {
  const snap = globalCouplingTelemetry.snapshot();
  const motifScores = globalMotifScorer.getAll();

  // Policy diversity: how many distinct motifs are active and healthy
  const activeMotifs = motifScores.filter((m) => m.strength > 0.5).length;
  const policyDiversityIndex = Math.min(1, activeMotifs / 8);

  // Causal trace depth: average motif strength -> layer depth proxy
  const avgMotifStrength =
    motifScores.length > 0
      ? motifScores.reduce((s, m) => s + m.strength, 0) / motifScores.length
      : 0;
  const causalTraceDepth = Math.round(2 + avgMotifStrength * 4);

  // Cross-layer influence: active couplings between different layers
  const activeCouplings = snap.activeCouplingCount ?? 0;
  const crossLayerInfluenceCount = Math.min(18, activeCouplings);

  // Prediction revision rate from telemetry
  const predictionRevisionRate = snap.predictionRevisionRate ?? 0.3;

  // Adaptation rate from learning effectiveness
  const adaptationRate = snap.learningEffectiveness ?? 0.35;

  const overallEmergenceScore =
    policyDiversityIndex * 0.25 +
    Math.min(1, causalTraceDepth / 6) * 0.2 +
    Math.min(1, crossLayerInfluenceCount / 18) * 0.25 +
    predictionRevisionRate * 0.15 +
    adaptationRate * 0.15;

  return {
    policyDiversityIndex,
    causalTraceDepth,
    crossLayerInfluenceCount,
    predictionRevisionRate,
    adaptationRate,
    overallEmergenceScore: Math.min(1, Math.max(0, overallEmergenceScore)),
  };
}

// ─── Analytics Review Engine ─────────────────────────────────────────────────
export interface OptimizationRecommendation {
  rank: number;
  category: string;
  title: string;
  evidence: string;
  impact: number; // 0-1, higher = more urgent
  action: string;
}

export interface AnalyticsReviewResult {
  timestamp: number;
  topRecommendations: OptimizationRecommendation[];
  lowestCategory: string;
  lowestScore: number;
  overallSystemScore: number;
  systemStatus: "OPTIMAL" | "DEGRADED" | "CRITICAL";
}

export function runAnalyticsReview(
  cardio: CardioMetricsSnapshot,
  ans: ANSMetricsSnapshot,
  sensory: SensoryMetricsSnapshot,
  spatial: SpatialMetricsSnapshot,
  emergence: EmergenceMetricsSnapshot,
): AnalyticsReviewResult {
  const categories: Array<{ name: string; score: number; label: string }> = [
    {
      name: "cardio",
      score: cardio.overallCardioHealth,
      label: "Cardio-Regulatory",
    },
    { name: "ans", score: ans.overallANSHealth, label: "ANS / Autonomic" },
    {
      name: "sensory",
      score: sensory.overallSensoryHealth,
      label: "Sensory Coupling",
    },
    {
      name: "spatial",
      score: spatial.overallSpatialHealth,
      label: "Spatial Awareness",
    },
    {
      name: "emergence",
      score: emergence.overallEmergenceScore,
      label: "Emergence",
    },
  ];

  categories.sort((a, b) => a.score - b.score);
  const worst = categories[0];
  const overallSystemScore =
    categories.reduce((s, c) => s + c.score, 0) / categories.length;

  const recommendations: OptimizationRecommendation[] = [];

  if (cardio.collapseRiskProxy > 0.4) {
    recommendations.push({
      rank: 1,
      category: "Cardio",
      title: "Reduce Collapse Risk",
      evidence: `collapse_risk_proxy = ${cardio.collapseRiskProxy.toFixed(3)} (threshold 0.4). exertion_burden = ${cardio.exertionBurden.toFixed(3)}.`,
      impact: cardio.collapseRiskProxy,
      action:
        "Lower exertion inputs, trigger recovery controller, increase recovery_capacity_proxy.",
    });
  }
  if (ans.sympatheticDominance) {
    recommendations.push({
      rank: 2,
      category: "ANS",
      title: "Restore Autonomic Balance",
      evidence: `sympathetic_tone = ${ans.sympatheticTone.toFixed(3)}, autonomic_balance = ${ans.autonomicBalance.toFixed(3)} (low). Parasympathetic suppressed.`,
      impact: 1 - ans.autonomicBalance,
      action:
        "Activate recovery mode, reduce threat inputs, allow parasympathetic recovery.",
    });
  }
  if (sensory.uncertaintyBurden > 0.5) {
    recommendations.push({
      rank: 3,
      category: "Sensory",
      title: "Reduce Sensory Uncertainty Burden",
      evidence: `uncertainty_burden = ${sensory.uncertaintyBurden.toFixed(3)} (>0.5). degradation_under_load = ${sensory.degradationUnderLoad.toFixed(3)}.`,
      impact: sensory.uncertaintyBurden,
      action:
        "Improve sensory clarity inputs, reduce environmental noise modifiers.",
    });
  }
  if (spatial.positionalUncertainty > 0.5) {
    recommendations.push({
      rank: 4,
      category: "Spatial",
      title: "Improve Positional Certainty",
      evidence: `positional_uncertainty = ${spatial.positionalUncertainty.toFixed(3)}, spatial_awareness = ${spatial.spatialAwarenessIndex.toFixed(3)}.`,
      impact: spatial.positionalUncertainty,
      action:
        "Reduce terrain burden, lower uncertainty inputs, strengthen spatial-salience coupling.",
    });
  }
  if (emergence.policyDiversityIndex < 0.5) {
    recommendations.push({
      rank: 5,
      category: "Emergence",
      title: "Increase Policy Diversity",
      evidence: `policy_diversity_index = ${emergence.policyDiversityIndex.toFixed(3)} (<0.5). Only ${Math.round(emergence.policyDiversityIndex * 8)}/8 motifs active.`,
      impact: 1 - emergence.policyDiversityIndex,
      action:
        "Strengthen inhibitory/excitatory motifs, increase recurrent loop activation, tune motif thresholds.",
    });
  }
  if (emergence.crossLayerInfluenceCount < 8) {
    recommendations.push({
      rank: 6,
      category: "Emergence",
      title: "Strengthen Cross-Layer Couplings",
      evidence: `cross_layer_influence_count = ${emergence.crossLayerInfluenceCount} (<8 minimum). Regulation-to-circuit bridges underactive.`,
      impact: 1 - emergence.crossLayerInfluenceCount / 18,
      action:
        "Activate regulation-to-threshold bridges, increase modulatory broadcast channel activity.",
    });
  }
  if (cardio.hrvProxy < 30) {
    recommendations.push({
      rank: 7,
      category: "Cardio",
      title: "Increase HRV",
      evidence: `hrv_proxy = ${cardio.hrvProxy.toFixed(1)} ms (<30). Low HRV suppresses recovery modulation.`,
      impact: Math.max(0, (30 - cardio.hrvProxy) / 30),
      action: "Reduce stress and exertion inputs to allow HRV recovery.",
    });
  }

  // Sort by impact descending, take top 5
  recommendations.sort((a, b) => b.impact - a.impact);
  const top5 = recommendations
    .slice(0, 5)
    .map((r, i) => ({ ...r, rank: i + 1 }));

  return {
    timestamp: Date.now(),
    topRecommendations: top5,
    lowestCategory: worst.label,
    lowestScore: worst.score,
    overallSystemScore,
    systemStatus:
      overallSystemScore > 0.7
        ? "OPTIMAL"
        : overallSystemScore > 0.4
          ? "DEGRADED"
          : "CRITICAL",
  };
}

// ─── Aggregated System Analytics ─────────────────────────────────────────────
export interface SystemAnalyticsSnapshot {
  cardio: CardioMetricsSnapshot;
  ans: ANSMetricsSnapshot;
  sensory: SensoryMetricsSnapshot;
  spatial: SpatialMetricsSnapshot;
  emergence: EmergenceMetricsSnapshot;
  review: AnalyticsReviewResult;
  sparseMetrics: ReturnType<typeof globalSparseCompute.getMetrics>;
  couplingSnapshot: ReturnType<typeof globalCouplingTelemetry.snapshot>;
  integrationStats: {
    registeredAdapters: number;
    activeSessions: number;
    ingestTotal: number;
    ingestValid: number;
    recentLog: Array<{
      ts: number;
      type: string;
      sourceId: string;
      valid: boolean;
    }>;
  };
}

export function getSystemAnalyticsSnapshot(
  stress = 0.3,
  fatigue = 0.2,
  exertion = 0.2,
): SystemAnalyticsSnapshot {
  const cardio = computeCardioMetrics(stress, fatigue, exertion);
  const ans = computeANSMetrics(stress, fatigue, exertion);
  const sensory = computeSensoryMetrics(stress * 0.6, fatigue * 0.5);
  const spatial = computeSpatialMetrics(stress * 0.4, fatigue * 0.4);
  const emergence = computeEmergenceMetrics();
  const review = runAnalyticsReview(cardio, ans, sensory, spatial, emergence);
  const sparseMetrics = globalSparseCompute.getMetrics();
  const couplingSnapshot = globalCouplingTelemetry.snapshot();

  const ingestStats = globalIngestService.getStats();
  const recentLog = globalIngestService.getLog().slice(-10);
  const activeSessions = globalSessionManager.getActive();
  const adapters = globalContractRegistry.getAll();

  return {
    cardio,
    ans,
    sensory,
    spatial,
    emergence,
    review,
    sparseMetrics,
    couplingSnapshot,
    integrationStats: {
      registeredAdapters: adapters.length,
      activeSessions: activeSessions.length,
      ingestTotal: ingestStats.total,
      ingestValid: ingestStats.valid,
      recentLog,
    },
  };
}
