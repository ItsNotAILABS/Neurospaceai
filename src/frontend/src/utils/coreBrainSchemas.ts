// ─── Core Brain Canonical Schemas v1.0.0 ────────────────────────────────────
// All schemas are versioned. Compile-time type safety enforced.

export const SCHEMA_VERSION = "1.0.0";

export interface BrainInstance {
  schemaVersion: string;
  instanceId: string;
  instanceType: string;
  roleType: string;
  authorityLevel: number;
  scopeType: string;
  deploymentType?: string;
  currentGoalId?: string;
  currentPolicyMode: string;
  runtimePhase: "idle" | "running" | "paused" | "resetting" | "destroyed";
  lastTransitionTs: number;
  activeFlags: string[];
  embodimentStateId?: string;
  interoceptiveStateId?: string;
  cardioStateId?: string;
  autonomicStateId?: string;
  salienceStateId?: string;
  workingMemoryStateId?: string;
  persistenceStateId?: string;
  memoryStateId?: string;
  predictionStateId?: string;
  arbitrationStateId?: string;
  learningStateId?: string;
  energyComputeStateId?: string;
  connectionStateId?: string;
  validationStateId?: string;
  readinessStateId?: string;
}

export interface EmbodimentState {
  schemaVersion: string;
  location: [number, number, number];
  orientation: [number, number, number];
  movementState: "static" | "moving" | "sprinting" | "prone";
  stance: string;
  exposure: number;
  coverQuality: number;
  terrainType: string;
  loadBurden: number;
  equipmentWeight: number;
  taskConstraintFlags: string[];
  damageState?: number;
  exertionLevel: number;
}

export interface InteroceptiveState {
  schemaVersion: string;
  stressSignal: number;
  recoverySignal: number;
  fatigueLoad: number;
  urgencyPressure: number;
  stabilityPressure: number;
  overloadLevel: number;
  confidencePressure: number;
  selfStateWeight: number;
  interoceptiveCoherence: number;
}

export interface CardioState {
  schemaVersion: string;
  heartRateProxy: number;
  hrvProxy: number;
  circulationPressureProxy: number;
  recoveryCapacityProxy: number;
  sustainedEffortIndex: number;
  exertionBurden: number;
  cardioStabilityIndex: number;
  collapseRiskProxy: number;
}

export interface AutonomicState {
  schemaVersion: string;
  sympatheticTone: number;
  parasympatheticTone: number;
  autonomicBalanceIndex: number;
  arousalMode: "calm" | "alert" | "reactive" | "overloaded";
  threatThresholdModifier: number;
  reactionSpeedModifier: number;
  recoveryTransitionState: "normal" | "transitioning" | "recovering";
}

export interface SalienceState {
  schemaVersion: string;
  rankedTargets: Array<{ id: string; score: number; urgency: number }>;
  rankedRoutes: Array<{ id: string; score: number; safety: number }>;
  urgencyFlags: string[];
  candidateWmEntries: string[];
  actionBiasHints: Record<string, number>;
  salienceLoad: number;
  suppressionNotes: string[];
}

export interface WorkingMemoryState {
  schemaVersion: string;
  activeWorldSlots: string[];
  activeBodySlots: string[];
  activeConflictSlots: string[];
  activeGoalSlot?: string;
  recalledMemorySlot?: string;
  gatePressure: number;
  staleContextScore: number;
  slotLoad: number;
}

export interface PersistenceState {
  schemaVersion: string;
  persistentItems: Array<{
    itemId: string;
    itemType: string;
    importance: number;
    missionRelevance: number;
    conflictSeverity: number;
    regulationRelevance: number;
    recency: number;
    decay: number;
    reactivationTrigger?: string;
    lastActivationTs: number;
  }>;
  reactivationCandidates: string[];
  unresolvedTensionCount: number;
  overloadRisk: number;
}

export interface MemoryState {
  schemaVersion: string;
  episodicTraceStore: Array<{
    id: string;
    ts: number;
    content: unknown;
    weight: number;
  }>;
  longBiasStore: Record<string, number>;
  failureMemoryStore: Array<{
    id: string;
    pattern: string;
    severity: number;
    ts: number;
  }>;
  routeMemoryStore: Array<{ routeId: string; safety: number; uses: number }>;
  stateContextStore: Record<string, unknown>;
  recallHistory: string[];
  memoryLoad: number;
  falseRecallRisk: number;
}

export interface PredictionState {
  schemaVersion: string;
  expectedNextState: Record<string, number>;
  expectedThreat: number;
  expectedReward: number;
  expectedRouteSafety: number;
  expectedRegulationBurden: number;
  expectedSuccessProbability: number;
  observedNextState: Record<string, number>;
  predictionErrorVector: number[];
  predictionConfidence: number;
  predictionUsefulnessScore: number;
}

export interface ArbitrationState {
  schemaVersion: string;
  candidatePolicies: string[];
  influenceScores: number[];
  conflictLoad: number;
  winningPolicy: string;
  suppressedPolicies: string[];
  hesitationScore: number;
  commitmentThreshold: number;
  counterfactualResults?: Record<string, number>;
}

export interface LearningState {
  schemaVersion: string;
  recentSuccesses: number;
  recentFailures: number;
  trustOrdering: Record<string, number>;
  thresholdAdaptationState: Record<string, number>;
  plasticityFlags: string[];
  structuralCandidates: string[];
  learningLoad: number;
  reinforcementHistory: number[];
  suppressionHistory: number[];
}

export interface EnergyComputeState {
  schemaVersion: string;
  activeRegionFraction: number;
  sparseActivationRatio: number;
  eventQueueDepth: number;
  localUpdateRate: number;
  broadUpdateRate: number;
  computePressure: number;
  overloadEscalationCount: number;
  computePerDecision: number;
  computePerUsefulBehavior: number;
}

export interface ConnectionState {
  schemaVersion: string;
  connectionRegistry: Array<{
    id: string;
    source: string;
    target: string;
    weight: number;
    reliability: number;
    activationFrequency: number;
    usefulnessScore: number;
    failureAssociationScore: number;
    computeCost: number;
    decay: number;
    stateSensitivity: number;
    promotionCandidateFlag: boolean;
    pruningCandidateFlag: boolean;
  }>;
  motifRegistry: Array<{
    id: string;
    type: string;
    strength: number;
    active: boolean;
  }>;
  pathwayStrengthMap: Record<string, number>;
  usefulActivationHistory: number[];
  harmfulActivationHistory: number[];
  promotionCandidates: string[];
  pruningCandidates: string[];
}

export interface ValidationState {
  schemaVersion: string;
  baselineStatus: "pass" | "warn" | "fail" | "pending";
  ablationStatus: "pass" | "warn" | "fail" | "pending";
  perturbationStatus: "pass" | "warn" | "fail" | "pending";
  mechanismTraceStatus: "pass" | "warn" | "fail" | "pending";
  antiFakeStatus: "pass" | "warn" | "fail" | "pending";
  regressionStatus: "pass" | "warn" | "fail" | "pending";
  conservativeClaimStatus: "pass" | "warn" | "fail" | "pending";
  lastValidationRunTs: number;
  openFailures: string[];
}

export interface ReadinessState {
  schemaVersion: string;
  architectureReady: boolean;
  runtimeReady: boolean;
  regulationReady: boolean;
  circuitryReady: boolean;
  memoryReady: boolean;
  predictionReady: boolean;
  learningReady: boolean;
  sparseComputeReady: boolean;
  analyticsReady: boolean;
  validationReady: boolean;
  optimizationReady: boolean;
  antiFakeReady: boolean;
  integrationReady: boolean;
  deploymentReady: boolean;
  readinessScore: number;
  blockingFailures: string[];
  warnings: string[];
  lastReadinessCheckTs: number;
}

export function createDefaultBrainInstance(
  config: Partial<BrainInstance> = {},
): BrainInstance {
  return {
    schemaVersion: SCHEMA_VERSION,
    instanceId: `brain_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    instanceType: config.instanceType ?? "individual_agent",
    roleType: config.roleType ?? "default",
    authorityLevel: config.authorityLevel ?? 1,
    scopeType: config.scopeType ?? "local",
    deploymentType: config.deploymentType,
    currentGoalId: config.currentGoalId,
    currentPolicyMode: config.currentPolicyMode ?? "default",
    runtimePhase: "idle",
    lastTransitionTs: Date.now(),
    activeFlags: [],
    ...config,
  };
}

export function createDefaultReadinessState(): ReadinessState {
  return {
    schemaVersion: SCHEMA_VERSION,
    architectureReady: false,
    runtimeReady: false,
    regulationReady: false,
    circuitryReady: false,
    memoryReady: false,
    predictionReady: false,
    learningReady: false,
    sparseComputeReady: false,
    analyticsReady: false,
    validationReady: false,
    optimizationReady: false,
    antiFakeReady: false,
    integrationReady: false,
    deploymentReady: false,
    readinessScore: 0,
    blockingFailures: [],
    warnings: [],
    lastReadinessCheckTs: 0,
  };
}
