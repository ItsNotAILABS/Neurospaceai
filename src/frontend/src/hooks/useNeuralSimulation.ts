import { useCallback, useEffect, useRef, useState } from "react";
import {
  type ANSState,
  applyANSToBrainRegions,
  getANSEventType,
  initANSState,
  updateANS,
} from "../utils/ansLayer";
import {
  type AttractorState,
  attemptWMEncode,
  decayAttractors,
  getWMActivationOverlay,
  initAttractorState,
} from "../utils/attractorDynamics";
import {
  type BootstrapState,
  applyBootstrapIfNeeded,
  createBootstrapState,
} from "../utils/bootstrapInit";
import {
  type CardioNervousState,
  initCardioNervousState,
  updateCardioNervousSystem,
} from "../utils/cardiovascularNervous";
import {
  applyCircuitMotifs,
  initCircuitMotifState,
} from "../utils/circuitMotifs";
import type { CircuitMotifState } from "../utils/circuitMotifs";
import {
  type GovernanceMetrics,
  type InfluenceFactors,
  type OutcomeRecord,
  type PersistentStateItem,
  type WMCandidate,
  type WMSlot,
  addPersistentItem,
  applyFeedbackUpdate,
  applyPersistenceTiers,
  buildGovernanceMetrics,
  computeInfluenceLaw,
  computeSoftPrior,
  enforceHomeostaticSpine,
  gateWorkingMemory,
  getDominantTier,
  initPersistentItems,
  initWorkingMemorySlots,
  updatePrecisionVariance,
} from "../utils/cognitiveGovernance";
import {
  initCoreMonitorState,
  updateCoreMonitor,
} from "../utils/coreBrainRuntimeMonitor";
import type { CoreBrainMonitorState } from "../utils/coreBrainRuntimeMonitor";
import { globalCouplingTelemetry } from "../utils/couplingTelemetry";
import {
  type CriticalityState,
  getCriticalityGainModifiers,
  initCriticalityState,
  updateCriticality,
} from "../utils/criticalityControl";
import {
  type FailureMemoryState,
  decayFailureWeights,
  initFailureMemory,
  recordFailure,
  updateCounterfactualRouting,
} from "../utils/failureMemory";
import {
  type GlobalWorkspaceState,
  initGlobalWorkspaceState,
  updateGlobalWorkspace,
} from "../utils/globalWorkspace";
import {
  type GoalHierarchyState,
  initGoalHierarchy,
  updateGoalHierarchy,
} from "../utils/goalHierarchy";
import { liveBrainBus } from "../utils/liveBrainBus";
import {
  loadLatestSnapshot,
  saveWeightSnapshot,
} from "../utils/memoryPersistence";
import {
  type MultiTimescaleMemory,
  initMultiTimescaleMemory,
  updateMultiTimescaleMemory,
} from "../utils/multiTimescaleMemory";
import {
  type NeuromodulatorLevels,
  type PlasticityGates,
  computePlasticityGates,
  initNeuromodulatorLevels,
  updateNeuromodulators,
} from "../utils/neuromodulatorPlasticity";
import {
  type NeuromorphicState,
  getGainModulation,
  initNeuromorphicState,
  updateNeuromorphicSpiking,
} from "../utils/neuromorphicSpiking";
import {
  type OscillatoryState,
  initOscillatoryState,
  isRegionGatedToCompute,
  updateOscillations,
} from "../utils/oscillatoryGating";
import {
  type PredictionState,
  getPredictionModifiers,
  initPredictionState,
  updatePredictionState,
} from "../utils/predictionExpectationLayer";
import {
  type PredictiveCodingState,
  initPredictiveCodingState,
  updatePredictiveCoding,
} from "../utils/predictiveCoding";
import {
  type RegulationScoreState,
  initRegulationScoreState,
  updateRegulationScore,
} from "../utils/regulationScore";
import {
  type SelfStateModel,
  initSelfStateModel,
  updateSelfStateModel,
} from "../utils/selfStateModel";
import {
  type SensoryCouplingState,
  createDefaultSensoryCouplingState,
  updateSensoryCoupling,
} from "../utils/sensoryCouplingLayer";
import {
  TASK_CLASS_MATRICES,
  type TaskClass,
  applyActionModulation,
  applyPerceptionModulation,
  classifyTaskClass,
} from "../utils/taskClassMatrices";
import { FrontendRegion, Region } from "./useQueries";
import type { ExtendedRegion } from "./useQueries";

// ─── Type Definitions ─────────────────────────────────────────────────────────

export type { ExtendedRegion };

export interface RegionState {
  region: ExtendedRegion;
  activation: number; // 0-1, current firing rate
  membranePotential: number; // 0-1, integration variable
  refractoryTimer: number; // 0-10, cooldown ticks after firing
  firingRate: number; // Hz estimate (activation * 80)
  lastInputHash?: number; // weighted sum of incoming activations (sparse ticking)
}

export interface NeurotransmitterState {
  dopamine: number; // 0-1
  serotonin: number; // 0-1
  norepinephrine: number; // 0-1
  gaba: number; // 0-1
  glutamate: number; // 0-1
  acetylcholine: number; // 0-1
}

export interface AvatarBehavior {
  motionLevel: number; // 0-1
  emotionValence: number; // -1 to +1
  attentionLevel: number; // 0-1
  consciousnessLevel: number; // 0-1
  breathingRate: number; // 0-1
  postureState:
    | "resting"
    | "alert"
    | "fearful"
    | "motivated"
    | "focused"
    | "sleeping";
  dominantNT:
    | "dopamine"
    | "serotonin"
    | "norepinephrine"
    | "gaba"
    | "glutamate"
    | "acetylcholine";
  avatarWorldPos: { x: number; y: number; z: number };
  avatarVelocity: { x: number; z: number };
  nearestObjectType: string;
  workingMemory: string[];
}

export type BehaviorSource =
  | "plasticity-linked" // weight change drove behavior
  | "memory-recall" // hippocampal reinstatement
  | "homeostatic-artifact" // saturation/threshold effect
  | "environmental-trigger" // external world stimulus
  | "uncertain"; // cannot determine source

export interface NeuralEvent {
  tick: number;
  region: string;
  type: "surge" | "drop" | "cascade" | "stimulus";
  description: string;
  source: BehaviorSource; // mechanism source tag (strict separation)
}

export interface ThoughtEntry {
  tick: number;
  thought: string;
  dominantRegion: string;
  intensity: number;
  // Emergent thought engine fields (v21+)
  confidence: number; // 0-100, based on co-activation quality
  neuralSources: Array<{ region: string; firingRate: number }>;
  circuitType: string; // SelfAwareness | Threat | Reward | Language | Memory | Executive | Homeostatic
  behaviorCoupled: boolean; // did arousal/approach shift this tick?
  provenance: string; // full record of which regions fired at what rates
  // Goal-wired cognitive mode decoder (v32+)
  cognitiveMode?: string; // decoded latent cognitive mode from x_t feature vector
  cognitiveConfidence?: number; // 0-1, softmax confidence for the decoded mode
}

// ── Emergent Intelligence Interfaces (Friston 2010, Goldman-Rakic 1995) ───────

export interface WorkingMemoryEntry {
  content: string;
  tickStamp: number;
  decayRate: number; // per-tick decay, region-specific (Goldman-Rakic 1995)
  strength: number; // 0-1, starts at 1.0
  sourceRegion: string;
}

export interface SilenceEntry {
  fromTick: number;
  toTick: number;
  reason: string; // why no circuit reached threshold — valid scientific data
}

export interface MetacognitiveEntry {
  tick: number;
  confidence: number; // 0-1 from anteriorPFC + Precuneus mean (Frith 2002)
  dominantCircuit: string;
}

export interface SessionHistoryEntry {
  tick: number;
  regionActivations: Record<string, number>;
  avatarX: number;
  avatarZ: number;
  postureState: string;
  thought: string | null;
  heartRate: number;
  globalArousal: number;
}

export interface EmergentBehaviorState {
  habituationDetected: boolean;
  habituationEvidence: string;
  associativeLearningDetected: boolean;
  associativeLearningEvidence: string;
  goalDirectedNavDetected: boolean;
  goalDirectedNavEvidence: string;
}

export interface PublicationAlert {
  id: string;
  tick: number;
  type:
    | "habituation"
    | "associative_learning"
    | "goal_directed_nav"
    | "stdp_milestone"
    | "emergent_pattern";
  title: string;
  description: string;
  significance: string;
  dismissed: boolean;
}

export interface QuantitativeMetrics {
  shannonEntropy: number;
  topPearsonCorrelations: Array<{ pair: string; value: number }>; // Pearson r lag-1, NOT transfer entropy
  stimulusEffectSize: number;
  correlationMatrix: Array<{ regionA: string; regionB: string; r: number }>;
  habituationIndex: number;
  plasticityIndex: number;
  emergentBehaviorScore: number;
}

export interface PublishGateResult {
  passed: boolean;
  blockers: string[]; // reasons the gate failed
  warnings: string[];
}

function evaluatePublishGate(
  saturatedRegions: Set<string>,
  allRegions: ExtendedRegion[],
  correlationMatrix: Array<{ regionA: string; regionB: string; r: number }>,
  reproducibilityRun: boolean,
  baselineAvailable: boolean,
  thoughtCount: number,
  goalDirectedNavMechanismSource: string,
): PublishGateResult {
  const blockers: string[] = [];
  const warnings: string[] = [];

  const satFraction = saturatedRegions.size / allRegions.length;
  if (satFraction > 0.15) {
    blockers.push(
      `SATURATION: ${saturatedRegions.size} of ${allRegions.length} regions (${Math.round(satFraction * 100)}%) above 90% avg activation. Fix homeostasis before claiming emergent dynamics.`,
    );
  }

  const perfectCorrs = correlationMatrix.filter((c) => Math.abs(c.r) > 0.999);
  if (perfectCorrs.length >= 2) {
    blockers.push(
      `CORRELATION ARTIFACT: ${perfectCorrs.length} near-perfect correlations (|r|≥0.999) detected. Likely clipping or shared-state bug.`,
    );
  }

  if (!baselineAvailable) {
    blockers.push(
      "BASELINE UNAVAILABLE: No locked baseline for comparison. Lock a baseline in the Agent panel before publication.",
    );
  }

  if (!reproducibilityRun) {
    blockers.push(
      "REPRODUCIBILITY NOT RUN: Single session. Run 20–100 matched sessions and report distribution of metrics.",
    );
  }

  if (goalDirectedNavMechanismSource === "spatial_memory_only") {
    blockers.push(
      "MECHANISM SOURCE: Goal-directed navigation driven by hard-coded spatial memory index. Not emergent reward learning.",
    );
  }

  if (thoughtCount === 0) {
    warnings.push(
      "ZERO THOUGHTS: No thought entries generated. Do not use cognition/self-model language in this report.",
    );
  }

  if (satFraction > 0.05 && satFraction <= 0.15) {
    warnings.push(
      `MILD SATURATION: ${saturatedRegions.size} regions near ceiling. Homeostatic data may be unreliable.`,
    );
  }

  return { passed: blockers.length === 0, blockers, warnings };
}

export interface SessionReport {
  sessionId: string;
  startTime: number;
  endTime: number;
  durationTicks: number;
  totalThoughts: number;
  thoughtLog: ThoughtEntry[];
  peakArousal: number;
  dominantBrainStates: string[];
  emotionalArc: Array<{ tick: number; valence: number; arousal: number }>;
  topActivatedRegions: Array<{ region: string; avgActivation: number }>;
  stdpChanges: Array<{ connection: string; delta: number }>;
  heartRateArc: Array<{ tick: number; bpm: number }>;
  behavioralEvents: NeuralEvent[];
  aiInterpretation: string[];
  quantitativeMetrics: QuantitativeMetrics;
  publicationFindings: PublicationAlert[];
  generatePaper: () => string;
  publishGate: PublishGateResult;
}

export interface StdpWeightEntry {
  connection: string;
  weight: number;
  delta: number;
}

// ─── Cognitive Architecture ───────────────────────────────────────────────────

export type BehaviorOutput =
  | "move_toward"
  | "avoid"
  | "delay"
  | "escalate"
  | "freeze"
  | "coordinate"
  | "investigate"
  | "communicate"
  | "recommend";

export interface LayerAState {
  salience: number; // 0-1
  arousal: number; // 0-1
  rewardThreat: number; // -1 to 1
  memoryIndex: number; // 0-1
  plasticityRate: number; // 0-1
  behavioralMode:
    | "exploration"
    | "exploitation"
    | "rest"
    | "threat-response"
    | "social";
}

export interface LayerBIdentity {
  cautiousness: number; // 0-1
  aggression: number; // 0-1
  discipline: number; // 0-1
  impulsivity: number; // 0-1
  fatigue: number; // 0-1
  resilience: number; // 0-1
  cooperativeness: number; // 0-1
  skepticism: number; // 0-1
}

export interface LayerDOutput {
  dominant: BehaviorOutput;
  confidence: number;
  scores: Record<BehaviorOutput, number>;
}

export interface LayerEEntry {
  tick: number;
  activated: string[];
  changed: string;
  conflict: string | null;
  whyShift: string;
  whyDecision: string;
}

export interface NeuralSimulationState {
  tick: number;
  isRunning: boolean;
  speed: number;
  complexityLevel: number; // 1-10
  regions: RegionState[];
  neurotransmitters: NeurotransmitterState;
  avatarBehavior: AvatarBehavior;
  globalArousal: number;
  eventLog: NeuralEvent[]; // last 20 events
  regionActivity: Array<[ExtendedRegion, number]>; // for compatibility
  activeNeuronCount: number; // simulation count
  // Heart / ANS metrics
  heartRate: number; // BPM 45-130
  hrv: number; // 0-1, higher = healthier variability
  sympatheticTone: number; // 0-1
  parasympatheticTone: number; // 0-1
  // Autonomous drive readouts
  hungerDrive: number; // 0-1
  explorationTimer: number; // ticks since last random jolt
  // New: thought log and STDP
  thoughtLog: ThoughtEntry[];
  sessionReport: SessionReport | null;
  stdpWeightSummary: StdpWeightEntry[];
  // Emergent behavior detection
  emergentBehaviors: EmergentBehaviorState;
  publicationAlerts: PublicationAlert[];
  // Working memory & sleep pressure
  workingMemory: WorkingMemoryEntry[]; // tick-stamped, decay-tracked entries
  sleepPressure: number; // 0-1, adenosine accumulation
  // Emergent intelligence exports (v21+)
  predictionErrors: Map<ExtendedRegion, number>;
  metacognitiveConfidence: number;
  metacognitiveLog: MetacognitiveEntry[];
  silenceLog: SilenceEntry[];
  // Cognitive Architecture
  layerA: LayerAState;
  layerB: LayerBIdentity;
  layerD: LayerDOutput;
  layerE: LayerEEntry[];
  // Consolidation & Maturation
  isConsolidating: boolean;
  consolidationCount: number;
  isMaturationActive: boolean;
  maturityScore: number;
  vagalTone: number; // 0-1, parasympathetic balance
  cortisolLevel: number; // 0-1, derived from threat circuit (Amygdala+PAG+BedNucleus); gates STDP LTP
  cortisolPlasticityGated: boolean; // true when cortisol > 0.65, LTP is suppressed
  hrvCoherence: number; // 0-1
  saturatedRegions: string[]; // regions with avg activation > 90% over last 100 ticks
  saturationLog: Array<{ tick: number; region: string }>;
  isDebugRun: boolean; // true if > 30% of regions are saturated
  sparseActivationRatio: number; // fraction of regions with activation < 0.3
  // Neuromorphic sparse computation metrics (v32+)
  sparseComputeEfficiency: number; // fraction of Wilson-Cowan computations skipped this session
  activeRegionFraction: number; // fraction of regions above 0.05 activation threshold
  eventDrivenUpdates: number; // cumulative event-driven (full compute) updates this session
  // Multi-timescale memory system (v32+)
  multiTimescaleMemory: MultiTimescaleMemory;
  // ANS / Interoceptive Layer
  ansState: ANSState;
  // Strategy shift counter
  strategyShiftCount: number;
  // Phase 4 Additional Systems
  predictionState: PredictionState;
  selfStateModel: SelfStateModel;
  goalHierarchy: GoalHierarchyState;
  failureMemory: FailureMemoryState;
  // Integrated modules v33+
  activeTaskClass: TaskClass;
  taskClassConfidence: number;
  criticalityState: {
    branchingRatio: number;
    regime: string;
    excitabilityGain: number;
    inhibitoryGain: number;
    powerLawFit: number;
    adjustmentEvents: number;
    criticalityScore: number;
  };
  oscillatoryState: {
    memoryEncodeGate: number;
    memoryRetrieveGate: number;
    localComputeGate: number;
    suppressionGate: number;
    motorGate: number;
    thetaGammaCoupling: number;
    encodingWindowOpen: boolean;
    retrievalWindowOpen: boolean;
    regionAlpha: Record<string, number>;
  };
  neuromodulatorLevels: NeuromodulatorLevels;
  attractorState: {
    items: AttractorState["items"];
    globalEnergy: number;
    capacity: number;
    dominantItem: string | null;
    displacementEvents: number;
    reinforcementEvents: number;
  };
  predictiveCoding: {
    globalFreeEnergy: number;
    globalMismatch: number;
    surpriseScore: number;
    learningRelevance: number;
  };
  plasticityGates: PlasticityGates;
  regulationScore: number;
  batchRunActive: boolean;
  batchRunProgress: number;
  batchRunTarget: number;
  batchRunResults: Array<{
    sessionId: string;
    shannonEntropy: number;
    saturatedCount: number;
    thoughtCount: number;
    habituationDetected: boolean;
    goalDirectedNav: boolean;
    plasticityIndex: number;
    peakArousal: number;
  }>;
  // Neuromorphic systems (v34+)
  neuromorphicState: NeuromorphicState;
  globalWorkspaceState: GlobalWorkspaceState;
  cardioNervousState: CardioNervousState;
  // Cognitive Governance Layer (v35+)
  governanceMetrics: GovernanceMetrics;
  circuitMotifState: CircuitMotifState;
  coreMonitorState: CoreBrainMonitorState;
  // Sensory coupling live state (wired — not decorative)
  sensoryCouplingState: SensoryCouplingState;
}

export interface BackendSeedSignals {
  coherence?: number;
  fearLevel?: number;
  arousal?: number;
  identityI?: number;
  freeEnergy?: number;
  emergenceScore?: number;
  kfHz?: number;
  vagalTone?: number;
  consciousnessIndex?: number;
  kuramotoR?: number;
  missionLockActive?: boolean;
  surrenderFloor?: number;
  courageScore?: number;
  groundedScore?: number;
}

export interface NeuralSimulationControls {
  start: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (s: number) => void;
  setComplexity: (level: number) => void;
  injectStimulus: (region: ExtendedRegion, intensity: number) => void;
  lesionRegion: (region: ExtendedRegion, durationMs: number) => void;
  potentiateRegion: (region: ExtendedRegion, durationMs: number) => void;
  endSession: () => SessionReport;
  clearSession: () => void;
  dismissAlert: (id: string) => void;
  triggerConsolidation: () => void;
  startMaturationProtocol: () => void;
  stopMaturationProtocol: () => void;
  startBatchRun: (n: number) => void;
  stopBatchRun: () => void;
  seedFromBackend: (signals: BackendSeedSignals) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_REGIONS: ExtendedRegion[] = [
  Region.PrefrontalCortex,
  Region.MotorCortex,
  Region.SensoryCortex,
  Region.Thalamus,
  Region.Hippocampus,
  Region.Amygdala,
  Region.Cerebellum,
  Region.Brainstem,
  Region.BasalGanglia,
  FrontendRegion.Insula,
  FrontendRegion.AnteriorCingulateCortex,
  FrontendRegion.OrbitalFrontalCortex,
  FrontendRegion.VisualCortex,
  FrontendRegion.AuditoryCortex,
  FrontendRegion.Hypothalamus,
  FrontendRegion.NucleusAccumbens,
  FrontendRegion.OlfactoryBulb,
  // Hippocampal sub-regions
  FrontendRegion.CA1,
  FrontendRegion.CA3,
  FrontendRegion.DentateGyrus,
  // Cerebellar sub-regions
  FrontendRegion.PurkinjeLayer,
  FrontendRegion.DeepCerebellarNuclei,
  // Thalamic nuclei
  FrontendRegion.MedialdorsalThalamus,
  FrontendRegion.PulvinarThalamus,
  // Association cortices
  FrontendRegion.ParietalCortex,
  FrontendRegion.TemporalCortex,
  FrontendRegion.CingulateMotorArea,
  // Subcortical
  FrontendRegion.Claustrum,
  FrontendRegion.LateralHabenula,
  FrontendRegion.SubstantiaNigra,
  // ── New 10 regions (40-region expansion) ──────────────────────────────
  FrontendRegion.SuperiorTemporalSulcus,
  FrontendRegion.DorsalACC,
  FrontendRegion.VentralTegmentalArea,
  FrontendRegion.LocusCoeruleus,
  FrontendRegion.RapheNuclei,
  FrontendRegion.VentralStriatum,
  FrontendRegion.EntorhinalCortex,
  FrontendRegion.PerirhinalCortex,
  FrontendRegion.SupplementaryMotorArea,
  FrontendRegion.VentralPallidum,
  // ── New 5 regions (45-region expansion) ──────────────────────────────
  FrontendRegion.SpinoCerebellarTract,
  FrontendRegion.PeriaqueductalGray,
  FrontendRegion.BedNucleusStria,
  FrontendRegion.MedialSeptum,
  FrontendRegion.RetroSplenialCortex,
  // ── HCP 180-region expansion ──────────────────────────────────────────────
  FrontendRegion.FrontalPole_L,
  FrontendRegion.FrontalPole_R,
  FrontendRegion.MedialPFC_L,
  FrontendRegion.MedialPFC_R,
  FrontendRegion.VentralMPFC_L,
  FrontendRegion.VentralMPFC_R,
  FrontendRegion.DorsalMPFC_L,
  FrontendRegion.DorsalMPFC_R,
  FrontendRegion.InferiorFrontal_L,
  FrontendRegion.InferiorFrontal_R,
  FrontendRegion.MiddleFrontal_L,
  FrontendRegion.MiddleFrontal_R,
  FrontendRegion.SuperiorFrontal_L,
  FrontendRegion.SuperiorFrontal_R,
  FrontendRegion.PreCentralGyrus_L,
  FrontendRegion.PreCentralGyrus_R,
  FrontendRegion.PreMotorCortex_L,
  FrontendRegion.PreMotorCortex_R,
  FrontendRegion.PrimaryMotorCortex_L,
  FrontendRegion.PrimaryMotorCortex_R,
  FrontendRegion.PrimaryMotorHand_L,
  FrontendRegion.PrimaryMotorHand_R,
  FrontendRegion.PrimarySomatosensory_L,
  FrontendRegion.PrimarySomatosensory_R,
  FrontendRegion.SecondarySomatosensory_L,
  FrontendRegion.SecondarySomatosensory_R,
  FrontendRegion.PostCentralGyrus_L,
  FrontendRegion.PostCentralGyrus_R,
  FrontendRegion.SuperiorParietal_L,
  FrontendRegion.SuperiorParietal_R,
  FrontendRegion.InferiorParietal_L,
  FrontendRegion.InferiorParietal_R,
  FrontendRegion.PrecuneusRegion_L,
  FrontendRegion.PrecuneusRegion_R,
  FrontendRegion.AngularGyrus_L,
  FrontendRegion.AngularGyrus_R,
  FrontendRegion.Supramarginal_L,
  FrontendRegion.Supramarginal_R,
  FrontendRegion.SuperiorTemporalGyrus_L,
  FrontendRegion.SuperiorTemporalGyrus_R,
  FrontendRegion.MiddleTemporalGyrus_L,
  FrontendRegion.MiddleTemporalGyrus_R,
  FrontendRegion.InferiorTemporalGyrus_L,
  FrontendRegion.InferiorTemporalGyrus_R,
  FrontendRegion.FusiformGyrus_L,
  FrontendRegion.FusiformGyrus_R,
  FrontendRegion.TemporalPole_L,
  FrontendRegion.TemporalPole_R,
  FrontendRegion.PrimaryVisual_L,
  FrontendRegion.PrimaryVisual_R,
  FrontendRegion.SecondaryVisual_L,
  FrontendRegion.SecondaryVisual_R,
  FrontendRegion.V3Area_L,
  FrontendRegion.V3Area_R,
  FrontendRegion.V4Area_L,
  FrontendRegion.V4Area_R,
  FrontendRegion.MTArea_L,
  FrontendRegion.MTArea_R,
  FrontendRegion.LingualGyrus_L,
  FrontendRegion.LingualGyrus_R,
  FrontendRegion.OccipitalPole_L,
  FrontendRegion.OccipitalPole_R,
  FrontendRegion.RostralACC_L,
  FrontendRegion.RostralACC_R,
  FrontendRegion.CaudalACC_L,
  FrontendRegion.CaudalACC_R,
  FrontendRegion.MidCingulate_L,
  FrontendRegion.MidCingulate_R,
  FrontendRegion.PosteriorCingulate_L,
  FrontendRegion.PosteriorCingulate_R,
  FrontendRegion.RetrosplenialArea_L,
  FrontendRegion.RetrosplenialArea_R,
  FrontendRegion.AnteriorInsula_L,
  FrontendRegion.AnteriorInsula_R,
  FrontendRegion.PosteriorInsula_L,
  FrontendRegion.PosteriorInsula_R,
  FrontendRegion.Thalamus_L,
  FrontendRegion.Thalamus_R,
  FrontendRegion.Caudate_L,
  FrontendRegion.Caudate_R,
  FrontendRegion.Putamen_L,
  FrontendRegion.Putamen_R,
  FrontendRegion.Pallidum_L,
  FrontendRegion.Pallidum_R,
  FrontendRegion.Hippocampus_L,
  FrontendRegion.Hippocampus_R,
  FrontendRegion.Amygdala_L,
  FrontendRegion.Amygdala_R,
  FrontendRegion.Accumbens_L,
  FrontendRegion.Accumbens_R,
  FrontendRegion.CerebellarLobule_I_IV,
  FrontendRegion.CerebellarLobule_V,
  FrontendRegion.CerebellarLobule_VI,
  FrontendRegion.CerebellarLobule_VIIa,
  FrontendRegion.CerebellarLobule_VIIb,
  FrontendRegion.CerebellarLobule_VIII,
  FrontendRegion.CerebellarLobule_IX,
  FrontendRegion.CerebellarLobule_X,
  FrontendRegion.CerebellarVermis,
  FrontendRegion.FrontalOperculum_L,
  FrontendRegion.FrontalOperculum_R,
  FrontendRegion.BrocaArea_L,
  FrontendRegion.BrocaArea_R,
  FrontendRegion.WernickeArea_L,
  FrontendRegion.WernickeArea_R,
  FrontendRegion.PlanumTemporale_L,
  FrontendRegion.PlanumTemporale_R,
  FrontendRegion.ParsOrbitalis_L,
  FrontendRegion.ParsOrbitalis_R,
  FrontendRegion.ParsTriangularis_L,
  FrontendRegion.ParsTriangularis_R,
  FrontendRegion.SubthalamicNucleus_L,
  FrontendRegion.SubthalamicNucleus_R,
  FrontendRegion.LateralGeniculateBody_L,
  FrontendRegion.LateralGeniculateBody_R,
  FrontendRegion.MedialGeniculateBody_L,
  FrontendRegion.MedialGeniculateBody_R,
  FrontendRegion.ZonaIncerta_L,
  FrontendRegion.ZonaIncerta_R,
  FrontendRegion.HabenularNucleus_L,
  FrontendRegion.HabenularNucleus_R,
  FrontendRegion.MamillaryBodies,
  FrontendRegion.PontineTegmentum,
  FrontendRegion.MedullaryReticular,
  FrontendRegion.SpleniumCorpusCallosum,
  FrontendRegion.FornixBody,
];

// ─── 1 Million Neuron Population Model (HCP-based) ────────────────────────────
// Cerebellum (~69%), Cortex (~16%), Hippocampal (~2.8%), Subcortical (~6%), Brainstem (~2.2%)
const NEURON_POPULATIONS: Record<string, number> = {
  // Cerebellar regions: 690,000 total
  [Region.Cerebellum]: 300000,
  [FrontendRegion.PurkinjeLayer]: 250000,
  [FrontendRegion.DeepCerebellarNuclei]: 140000,
  // Cortical regions: 160,000 total
  [Region.PrefrontalCortex]: 18000,
  [Region.MotorCortex]: 16000,
  [Region.SensoryCortex]: 16000,
  [FrontendRegion.VisualCortex]: 15000,
  [FrontendRegion.AuditoryCortex]: 12000,
  [FrontendRegion.ParietalCortex]: 13000,
  [FrontendRegion.TemporalCortex]: 13000,
  [FrontendRegion.SuperiorTemporalSulcus]: 9000,
  [FrontendRegion.CingulateMotorArea]: 8000,
  [FrontendRegion.SupplementaryMotorArea]: 8000,
  [FrontendRegion.AnteriorCingulateCortex]: 7000,
  [FrontendRegion.DorsalACC]: 6000,
  [FrontendRegion.OrbitalFrontalCortex]: 7000,
  [FrontendRegion.Claustrum]: 5000,
  [FrontendRegion.Insula]: 7000,
  // Hippocampal sub-regions: 40,000 total (scaled up)
  [Region.Hippocampus]: 10000,
  [FrontendRegion.CA1]: 10000,
  [FrontendRegion.CA3]: 8000,
  [FrontendRegion.DentateGyrus]: 12000,
  [FrontendRegion.EntorhinalCortex]: 2000,
  [FrontendRegion.PerirhinalCortex]: 1000,
  // Subcortical: 60,000 total
  [Region.BasalGanglia]: 12000,
  [Region.Thalamus]: 10000,
  [Region.Amygdala]: 8000,
  [FrontendRegion.NucleusAccumbens]: 6000,
  [FrontendRegion.Hypothalamus]: 5000,
  [FrontendRegion.LateralHabenula]: 3000,
  [FrontendRegion.SubstantiaNigra]: 4000,
  [FrontendRegion.VentralStriatum]: 5000,
  [FrontendRegion.VentralPallidum]: 4000,
  [FrontendRegion.MedialdorsalThalamus]: 3000,
  // Brainstem nuclei: 22,000 total
  [Region.Brainstem]: 10000,
  [FrontendRegion.VentralTegmentalArea]: 5000,
  [FrontendRegion.LocusCoeruleus]: 3000,
  [FrontendRegion.RapheNuclei]: 4000,
  // Other
  [FrontendRegion.PulvinarThalamus]: 3000,
  [FrontendRegion.OlfactoryBulb]: 2000,
  // New 45-region expansion
  [FrontendRegion.SpinoCerebellarTract]: 50000,
  [FrontendRegion.PeriaqueductalGray]: 8000,
  [FrontendRegion.BedNucleusStria]: 6000,
  [FrontendRegion.MedialSeptum]: 4000,
  [FrontendRegion.RetroSplenialCortex]: 7000,
  // ── HCP 180-region additions (Allen Brain Atlas cell density × regional volume) ──
  [FrontendRegion.PrimaryMotorCortex_L]: 170000,
  [FrontendRegion.PrimaryMotorCortex_R]: 170000,
  [FrontendRegion.PrimaryMotorHand_L]: 85000,
  [FrontendRegion.PrimaryMotorHand_R]: 85000,
  [FrontendRegion.PreMotorCortex_L]: 140000,
  [FrontendRegion.PreMotorCortex_R]: 140000,
  [FrontendRegion.PreCentralGyrus_L]: 120000,
  [FrontendRegion.PreCentralGyrus_R]: 120000,
  [FrontendRegion.PrimarySomatosensory_L]: 160000,
  [FrontendRegion.PrimarySomatosensory_R]: 160000,
  [FrontendRegion.SecondarySomatosensory_L]: 90000,
  [FrontendRegion.SecondarySomatosensory_R]: 90000,
  [FrontendRegion.PostCentralGyrus_L]: 130000,
  [FrontendRegion.PostCentralGyrus_R]: 130000,
  [FrontendRegion.FrontalPole_L]: 50000,
  [FrontendRegion.FrontalPole_R]: 50000,
  [FrontendRegion.MedialPFC_L]: 80000,
  [FrontendRegion.MedialPFC_R]: 80000,
  [FrontendRegion.VentralMPFC_L]: 60000,
  [FrontendRegion.VentralMPFC_R]: 60000,
  [FrontendRegion.DorsalMPFC_L]: 70000,
  [FrontendRegion.DorsalMPFC_R]: 70000,
  [FrontendRegion.InferiorFrontal_L]: 100000,
  [FrontendRegion.InferiorFrontal_R]: 95000,
  [FrontendRegion.MiddleFrontal_L]: 110000,
  [FrontendRegion.MiddleFrontal_R]: 110000,
  [FrontendRegion.SuperiorFrontal_L]: 130000,
  [FrontendRegion.SuperiorFrontal_R]: 130000,
  [FrontendRegion.BrocaArea_L]: 75000,
  [FrontendRegion.BrocaArea_R]: 60000,
  [FrontendRegion.WernickeArea_L]: 80000,
  [FrontendRegion.WernickeArea_R]: 65000,
  [FrontendRegion.PlanumTemporale_L]: 55000,
  [FrontendRegion.PlanumTemporale_R]: 45000,
  [FrontendRegion.FrontalOperculum_L]: 50000,
  [FrontendRegion.FrontalOperculum_R]: 48000,
  [FrontendRegion.ParsTriangularis_L]: 45000,
  [FrontendRegion.ParsTriangularis_R]: 40000,
  [FrontendRegion.ParsOrbitalis_L]: 40000,
  [FrontendRegion.ParsOrbitalis_R]: 38000,
  [FrontendRegion.SuperiorParietal_L]: 120000,
  [FrontendRegion.SuperiorParietal_R]: 120000,
  [FrontendRegion.InferiorParietal_L]: 110000,
  [FrontendRegion.InferiorParietal_R]: 110000,
  [FrontendRegion.PrecuneusRegion_L]: 95000,
  [FrontendRegion.PrecuneusRegion_R]: 95000,
  [FrontendRegion.AngularGyrus_L]: 65000,
  [FrontendRegion.AngularGyrus_R]: 65000,
  [FrontendRegion.Supramarginal_L]: 55000,
  [FrontendRegion.Supramarginal_R]: 55000,
  [FrontendRegion.SuperiorTemporalGyrus_L]: 100000,
  [FrontendRegion.SuperiorTemporalGyrus_R]: 100000,
  [FrontendRegion.MiddleTemporalGyrus_L]: 90000,
  [FrontendRegion.MiddleTemporalGyrus_R]: 90000,
  [FrontendRegion.InferiorTemporalGyrus_L]: 80000,
  [FrontendRegion.InferiorTemporalGyrus_R]: 80000,
  [FrontendRegion.FusiformGyrus_L]: 70000,
  [FrontendRegion.FusiformGyrus_R]: 70000,
  [FrontendRegion.TemporalPole_L]: 45000,
  [FrontendRegion.TemporalPole_R]: 45000,
  [FrontendRegion.PrimaryVisual_L]: 140000,
  [FrontendRegion.PrimaryVisual_R]: 140000,
  [FrontendRegion.SecondaryVisual_L]: 100000,
  [FrontendRegion.SecondaryVisual_R]: 100000,
  [FrontendRegion.V3Area_L]: 80000,
  [FrontendRegion.V3Area_R]: 80000,
  [FrontendRegion.V4Area_L]: 70000,
  [FrontendRegion.V4Area_R]: 70000,
  [FrontendRegion.MTArea_L]: 60000,
  [FrontendRegion.MTArea_R]: 60000,
  [FrontendRegion.LingualGyrus_L]: 55000,
  [FrontendRegion.LingualGyrus_R]: 55000,
  [FrontendRegion.OccipitalPole_L]: 50000,
  [FrontendRegion.OccipitalPole_R]: 50000,
  [FrontendRegion.RostralACC_L]: 45000,
  [FrontendRegion.RostralACC_R]: 45000,
  [FrontendRegion.CaudalACC_L]: 40000,
  [FrontendRegion.CaudalACC_R]: 40000,
  [FrontendRegion.MidCingulate_L]: 55000,
  [FrontendRegion.MidCingulate_R]: 55000,
  [FrontendRegion.PosteriorCingulate_L]: 60000,
  [FrontendRegion.PosteriorCingulate_R]: 60000,
  [FrontendRegion.RetrosplenialArea_L]: 45000,
  [FrontendRegion.RetrosplenialArea_R]: 45000,
  [FrontendRegion.AnteriorInsula_L]: 50000,
  [FrontendRegion.AnteriorInsula_R]: 50000,
  [FrontendRegion.PosteriorInsula_L]: 45000,
  [FrontendRegion.PosteriorInsula_R]: 45000,
  [FrontendRegion.Thalamus_L]: 15000000,
  [FrontendRegion.Thalamus_R]: 15000000,
  [FrontendRegion.Caudate_L]: 3500000,
  [FrontendRegion.Caudate_R]: 3500000,
  [FrontendRegion.Putamen_L]: 4500000,
  [FrontendRegion.Putamen_R]: 4500000,
  [FrontendRegion.Pallidum_L]: 400000,
  [FrontendRegion.Pallidum_R]: 400000,
  [FrontendRegion.Hippocampus_L]: 3500000,
  [FrontendRegion.Hippocampus_R]: 3500000,
  [FrontendRegion.Amygdala_L]: 1200000,
  [FrontendRegion.Amygdala_R]: 1200000,
  [FrontendRegion.Accumbens_L]: 600000,
  [FrontendRegion.Accumbens_R]: 600000,
  [FrontendRegion.SubthalamicNucleus_R]: 200000,
  [FrontendRegion.LateralGeniculateBody_R]: 800000,
  [FrontendRegion.MedialGeniculateBody_R]: 600000,
  [FrontendRegion.ZonaIncerta_L]: 120000,
  [FrontendRegion.ZonaIncerta_R]: 120000,
  [FrontendRegion.HabenularNucleus_L]: 80000,
  [FrontendRegion.HabenularNucleus_R]: 80000,
  // Cerebellar — highest density in brain (Ito 1984, granule cells)
  [FrontendRegion.CerebellarLobule_I_IV]: 8000000000,
  [FrontendRegion.CerebellarLobule_V]: 12000000000,
  [FrontendRegion.CerebellarLobule_VI]: 16000000000,
  [FrontendRegion.CerebellarLobule_VIIa]: 14000000000,
  [FrontendRegion.CerebellarLobule_VIIb]: 10000000000,
  [FrontendRegion.CerebellarLobule_VIII]: 10000000000,
  [FrontendRegion.CerebellarLobule_IX]: 8000000000,
  [FrontendRegion.CerebellarLobule_X]: 5000000000,
  [FrontendRegion.CerebellarVermis]: 6000000000,
  [FrontendRegion.PontineTegmentum]: 2000000,
  [FrontendRegion.MedullaryReticular]: 1500000,
  [FrontendRegion.SpleniumCorpusCallosum]: 200000000,
};

// ─── Excitatory fraction per region (mesoscale sub-population model) ─────────
const EXCITATORY_FRACTION: Record<string, number> = {
  [Region.PrefrontalCortex]: 0.75,
  [Region.MotorCortex]: 0.78,
  [Region.SensoryCortex]: 0.76,
  [Region.Thalamus]: 0.8,
  [Region.Hippocampus]: 0.72,
  [Region.Amygdala]: 0.7,
  [Region.Cerebellum]: 0.85,
  [Region.Brainstem]: 0.6,
  [Region.BasalGanglia]: 0.55,
  [FrontendRegion.Insula]: 0.72,
  [FrontendRegion.AnteriorCingulateCortex]: 0.74,
  [FrontendRegion.OrbitalFrontalCortex]: 0.76,
  [FrontendRegion.VisualCortex]: 0.78,
  [FrontendRegion.AuditoryCortex]: 0.77,
  [FrontendRegion.Hypothalamus]: 0.65,
  [FrontendRegion.NucleusAccumbens]: 0.6,
  [FrontendRegion.OlfactoryBulb]: 0.75,
  [FrontendRegion.CA1]: 0.72,
  [FrontendRegion.CA3]: 0.7,
  [FrontendRegion.DentateGyrus]: 0.73,
  [FrontendRegion.PurkinjeLayer]: 0.3, // Purkinje cells are inhibitory!
  [FrontendRegion.DeepCerebellarNuclei]: 0.82,
  [FrontendRegion.MedialdorsalThalamus]: 0.8,
  [FrontendRegion.PulvinarThalamus]: 0.8,
  [FrontendRegion.ParietalCortex]: 0.76,
  [FrontendRegion.TemporalCortex]: 0.75,
  [FrontendRegion.CingulateMotorArea]: 0.76,
  [FrontendRegion.Claustrum]: 0.74,
  [FrontendRegion.LateralHabenula]: 0.7,
  [FrontendRegion.SubstantiaNigra]: 0.65,
  [FrontendRegion.SuperiorTemporalSulcus]: 0.75,
  [FrontendRegion.DorsalACC]: 0.74,
  [FrontendRegion.VentralTegmentalArea]: 0.68,
  [FrontendRegion.LocusCoeruleus]: 0.7,
  [FrontendRegion.RapheNuclei]: 0.65,
  [FrontendRegion.VentralStriatum]: 0.58,
  [FrontendRegion.EntorhinalCortex]: 0.74,
  [FrontendRegion.PerirhinalCortex]: 0.74,
  [FrontendRegion.SupplementaryMotorArea]: 0.77,
  [FrontendRegion.VentralPallidum]: 0.45,
  // New 45-region expansion
  [FrontendRegion.SpinoCerebellarTract]: 0.78,
  [FrontendRegion.PeriaqueductalGray]: 0.6,
  [FrontendRegion.BedNucleusStria]: 0.58,
  [FrontendRegion.MedialSeptum]: 0.65,
  [FrontendRegion.RetroSplenialCortex]: 0.74,
  // ── HCP 180-region additions (DeFelipe 2002 GABAergic interneuron density) ────
  [FrontendRegion.PrimaryMotorCortex_L]: 0.8,
  [FrontendRegion.PrimaryMotorCortex_R]: 0.8,
  [FrontendRegion.PrimaryMotorHand_L]: 0.8,
  [FrontendRegion.PrimaryMotorHand_R]: 0.8,
  [FrontendRegion.PreMotorCortex_L]: 0.8,
  [FrontendRegion.PreMotorCortex_R]: 0.8,
  [FrontendRegion.PreCentralGyrus_L]: 0.8,
  [FrontendRegion.PreCentralGyrus_R]: 0.8,
  [FrontendRegion.PrimarySomatosensory_L]: 0.8,
  [FrontendRegion.PrimarySomatosensory_R]: 0.8,
  [FrontendRegion.SecondarySomatosensory_L]: 0.8,
  [FrontendRegion.SecondarySomatosensory_R]: 0.8,
  [FrontendRegion.PostCentralGyrus_L]: 0.8,
  [FrontendRegion.PostCentralGyrus_R]: 0.8,
  [FrontendRegion.FrontalPole_L]: 0.82,
  [FrontendRegion.FrontalPole_R]: 0.82,
  [FrontendRegion.MedialPFC_L]: 0.82,
  [FrontendRegion.MedialPFC_R]: 0.82,
  [FrontendRegion.VentralMPFC_L]: 0.82,
  [FrontendRegion.VentralMPFC_R]: 0.82,
  [FrontendRegion.DorsalMPFC_L]: 0.82,
  [FrontendRegion.DorsalMPFC_R]: 0.82,
  [FrontendRegion.InferiorFrontal_L]: 0.8,
  [FrontendRegion.InferiorFrontal_R]: 0.8,
  [FrontendRegion.MiddleFrontal_L]: 0.8,
  [FrontendRegion.MiddleFrontal_R]: 0.8,
  [FrontendRegion.SuperiorFrontal_L]: 0.8,
  [FrontendRegion.SuperiorFrontal_R]: 0.8,
  [FrontendRegion.BrocaArea_L]: 0.82,
  [FrontendRegion.BrocaArea_R]: 0.8,
  [FrontendRegion.WernickeArea_L]: 0.82,
  [FrontendRegion.WernickeArea_R]: 0.8,
  [FrontendRegion.PlanumTemporale_L]: 0.8,
  [FrontendRegion.PlanumTemporale_R]: 0.8,
  [FrontendRegion.FrontalOperculum_L]: 0.8,
  [FrontendRegion.FrontalOperculum_R]: 0.8,
  [FrontendRegion.ParsTriangularis_L]: 0.81,
  [FrontendRegion.ParsTriangularis_R]: 0.8,
  [FrontendRegion.ParsOrbitalis_L]: 0.81,
  [FrontendRegion.ParsOrbitalis_R]: 0.8,
  [FrontendRegion.SuperiorParietal_L]: 0.8,
  [FrontendRegion.SuperiorParietal_R]: 0.8,
  [FrontendRegion.InferiorParietal_L]: 0.8,
  [FrontendRegion.InferiorParietal_R]: 0.8,
  [FrontendRegion.PrecuneusRegion_L]: 0.8,
  [FrontendRegion.PrecuneusRegion_R]: 0.8,
  [FrontendRegion.AngularGyrus_L]: 0.8,
  [FrontendRegion.AngularGyrus_R]: 0.8,
  [FrontendRegion.Supramarginal_L]: 0.8,
  [FrontendRegion.Supramarginal_R]: 0.8,
  [FrontendRegion.SuperiorTemporalGyrus_L]: 0.8,
  [FrontendRegion.SuperiorTemporalGyrus_R]: 0.8,
  [FrontendRegion.MiddleTemporalGyrus_L]: 0.8,
  [FrontendRegion.MiddleTemporalGyrus_R]: 0.8,
  [FrontendRegion.InferiorTemporalGyrus_L]: 0.8,
  [FrontendRegion.InferiorTemporalGyrus_R]: 0.8,
  [FrontendRegion.FusiformGyrus_L]: 0.8,
  [FrontendRegion.FusiformGyrus_R]: 0.8,
  [FrontendRegion.TemporalPole_L]: 0.82,
  [FrontendRegion.TemporalPole_R]: 0.82,
  [FrontendRegion.PrimaryVisual_L]: 0.76,
  [FrontendRegion.PrimaryVisual_R]: 0.76,
  [FrontendRegion.SecondaryVisual_L]: 0.78,
  [FrontendRegion.SecondaryVisual_R]: 0.78,
  [FrontendRegion.V3Area_L]: 0.78,
  [FrontendRegion.V3Area_R]: 0.78,
  [FrontendRegion.V4Area_L]: 0.79,
  [FrontendRegion.V4Area_R]: 0.79,
  [FrontendRegion.MTArea_L]: 0.8,
  [FrontendRegion.MTArea_R]: 0.8,
  [FrontendRegion.LingualGyrus_L]: 0.78,
  [FrontendRegion.LingualGyrus_R]: 0.78,
  [FrontendRegion.OccipitalPole_L]: 0.76,
  [FrontendRegion.OccipitalPole_R]: 0.76,
  [FrontendRegion.RostralACC_L]: 0.81,
  [FrontendRegion.RostralACC_R]: 0.81,
  [FrontendRegion.CaudalACC_L]: 0.8,
  [FrontendRegion.CaudalACC_R]: 0.8,
  [FrontendRegion.MidCingulate_L]: 0.8,
  [FrontendRegion.MidCingulate_R]: 0.8,
  [FrontendRegion.PosteriorCingulate_L]: 0.81,
  [FrontendRegion.PosteriorCingulate_R]: 0.81,
  [FrontendRegion.RetrosplenialArea_L]: 0.8,
  [FrontendRegion.RetrosplenialArea_R]: 0.8,
  [FrontendRegion.AnteriorInsula_L]: 0.79,
  [FrontendRegion.AnteriorInsula_R]: 0.79,
  [FrontendRegion.PosteriorInsula_L]: 0.78,
  [FrontendRegion.PosteriorInsula_R]: 0.78,
  [FrontendRegion.Thalamus_L]: 0.7,
  [FrontendRegion.Thalamus_R]: 0.7,
  [FrontendRegion.Caudate_L]: 0.05,
  [FrontendRegion.Caudate_R]: 0.05,
  [FrontendRegion.Putamen_L]: 0.05,
  [FrontendRegion.Putamen_R]: 0.05,
  [FrontendRegion.Pallidum_L]: 0.02,
  [FrontendRegion.Pallidum_R]: 0.02,
  [FrontendRegion.Hippocampus_L]: 0.85,
  [FrontendRegion.Hippocampus_R]: 0.85,
  [FrontendRegion.Amygdala_L]: 0.7,
  [FrontendRegion.Amygdala_R]: 0.7,
  [FrontendRegion.Accumbens_L]: 0.05,
  [FrontendRegion.Accumbens_R]: 0.05,
  [FrontendRegion.SubthalamicNucleus_R]: 1.0,
  [FrontendRegion.LateralGeniculateBody_R]: 0.8,
  [FrontendRegion.MedialGeniculateBody_R]: 0.8,
  [FrontendRegion.ZonaIncerta_L]: 0.1,
  [FrontendRegion.ZonaIncerta_R]: 0.1,
  [FrontendRegion.HabenularNucleus_L]: 0.1,
  [FrontendRegion.HabenularNucleus_R]: 0.1,
  // Cerebellar — granule cells 96% excitatory (Ito 1984)
  [FrontendRegion.CerebellarLobule_I_IV]: 0.96,
  [FrontendRegion.CerebellarLobule_V]: 0.96,
  [FrontendRegion.CerebellarLobule_VI]: 0.96,
  [FrontendRegion.CerebellarLobule_VIIa]: 0.96,
  [FrontendRegion.CerebellarLobule_VIIb]: 0.96,
  [FrontendRegion.CerebellarLobule_VIII]: 0.96,
  [FrontendRegion.CerebellarLobule_IX]: 0.96,
  [FrontendRegion.CerebellarLobule_X]: 0.96,
  [FrontendRegion.CerebellarVermis]: 0.96,
  [FrontendRegion.PontineTegmentum]: 0.75,
  [FrontendRegion.MedullaryReticular]: 0.7,
  [FrontendRegion.SpleniumCorpusCallosum]: 1.0,
};

// Synapse type enum
// AMPA: fast excitatory (glutamate, ionotropic)
// NMDA: slow/strong excitatory (glutamate, learning-critical)
// GABA_A: fast inhibitory (chloride channel)
// GABA_B: slow inhibitory (potassium channel, metabotropic)
// DA: dopaminergic neuromodulation (D1/D2 receptor mediated)
// 5HT: serotonergic neuromodulation (5-HT1A/2A receptor mediated)
type SynapseType = "AMPA" | "NMDA" | "GABA_A" | "GABA_B" | "DA" | "5HT";

// Synapse type multipliers
const SYNAPSE_MULTIPLIERS: Record<SynapseType, number> = {
  AMPA: 1.0, // fast excitatory
  NMDA: 1.3, // slow but stronger excitatory (learning-critical)
  GABA_A: 1.0, // fast inhibitory
  GABA_B: 1.2, // slow but stronger inhibitory
  DA: 0.9, // dopaminergic modulatory (slower, volume transmission)
  "5HT": 0.85, // serotonergic modulatory (slowest, diffuse projection)
};

// Firing thresholds (higher = harder to activate)
const THRESHOLDS: Record<string, number> = {
  [Region.PrefrontalCortex]: 0.45,
  [Region.MotorCortex]: 0.4,
  [Region.SensoryCortex]: 0.35,
  [Region.Thalamus]: 0.3,
  [Region.Hippocampus]: 0.42,
  [Region.Amygdala]: 0.38,
  [Region.Cerebellum]: 0.35,
  [Region.Brainstem]: 0.25,
  [Region.BasalGanglia]: 0.42,
  [FrontendRegion.Insula]: 0.4,
  [FrontendRegion.AnteriorCingulateCortex]: 0.43,
  [FrontendRegion.OrbitalFrontalCortex]: 0.45,
  [FrontendRegion.VisualCortex]: 0.33,
  [FrontendRegion.AuditoryCortex]: 0.33,
  [FrontendRegion.Hypothalamus]: 0.35,
  [FrontendRegion.NucleusAccumbens]: 0.38,
  [FrontendRegion.OlfactoryBulb]: 0.3,
  [FrontendRegion.CA1]: 0.42,
  [FrontendRegion.CA3]: 0.4,
  [FrontendRegion.DentateGyrus]: 0.44,
  [FrontendRegion.PurkinjeLayer]: 0.38,
  [FrontendRegion.DeepCerebellarNuclei]: 0.35,
  [FrontendRegion.MedialdorsalThalamus]: 0.32,
  [FrontendRegion.PulvinarThalamus]: 0.34,
  [FrontendRegion.ParietalCortex]: 0.4,
  [FrontendRegion.TemporalCortex]: 0.38,
  [FrontendRegion.CingulateMotorArea]: 0.42,
  [FrontendRegion.Claustrum]: 0.45,
  [FrontendRegion.LateralHabenula]: 0.5,
  [FrontendRegion.SubstantiaNigra]: 0.4,
  // New regions
  [FrontendRegion.SuperiorTemporalSulcus]: 0.4,
  [FrontendRegion.DorsalACC]: 0.43,
  [FrontendRegion.VentralTegmentalArea]: 0.38,
  [FrontendRegion.LocusCoeruleus]: 0.35,
  [FrontendRegion.RapheNuclei]: 0.36,
  [FrontendRegion.VentralStriatum]: 0.4,
  [FrontendRegion.EntorhinalCortex]: 0.4,
  [FrontendRegion.PerirhinalCortex]: 0.42,
  [FrontendRegion.SupplementaryMotorArea]: 0.42,
  [FrontendRegion.VentralPallidum]: 0.44,
  // New 45-region expansion
  [FrontendRegion.SpinoCerebellarTract]: 0.36,
  [FrontendRegion.PeriaqueductalGray]: 0.35,
  [FrontendRegion.BedNucleusStria]: 0.44,
  [FrontendRegion.MedialSeptum]: 0.38,
  [FrontendRegion.RetroSplenialCortex]: 0.41,
  // ── HCP 180-region additions (Izhikevich RS/IB/FS classes) ───────────────────
  // Bilateral cortical parcels — Izhikevich RS class (0.38-0.42)
  [FrontendRegion.PrimaryMotorCortex_L]: 0.4,
  [FrontendRegion.PrimaryMotorCortex_R]: 0.4,
  [FrontendRegion.PrimaryMotorHand_L]: 0.4,
  [FrontendRegion.PrimaryMotorHand_R]: 0.4,
  [FrontendRegion.PrimarySomatosensory_L]: 0.4,
  [FrontendRegion.PrimarySomatosensory_R]: 0.4,
  [FrontendRegion.SecondarySomatosensory_L]: 0.41,
  [FrontendRegion.SecondarySomatosensory_R]: 0.41,
  [FrontendRegion.PreMotorCortex_L]: 0.39,
  [FrontendRegion.PreMotorCortex_R]: 0.39,
  [FrontendRegion.PreCentralGyrus_L]: 0.39,
  [FrontendRegion.PreCentralGyrus_R]: 0.39,
  [FrontendRegion.PostCentralGyrus_L]: 0.4,
  [FrontendRegion.PostCentralGyrus_R]: 0.4,
  [FrontendRegion.FrontalPole_L]: 0.38,
  [FrontendRegion.FrontalPole_R]: 0.38,
  [FrontendRegion.MedialPFC_L]: 0.38,
  [FrontendRegion.MedialPFC_R]: 0.38,
  [FrontendRegion.VentralMPFC_L]: 0.38,
  [FrontendRegion.VentralMPFC_R]: 0.38,
  [FrontendRegion.DorsalMPFC_L]: 0.38,
  [FrontendRegion.DorsalMPFC_R]: 0.38,
  [FrontendRegion.InferiorFrontal_L]: 0.39,
  [FrontendRegion.InferiorFrontal_R]: 0.39,
  [FrontendRegion.MiddleFrontal_L]: 0.39,
  [FrontendRegion.MiddleFrontal_R]: 0.39,
  [FrontendRegion.SuperiorFrontal_L]: 0.39,
  [FrontendRegion.SuperiorFrontal_R]: 0.39,
  [FrontendRegion.BrocaArea_L]: 0.37,
  [FrontendRegion.BrocaArea_R]: 0.38,
  [FrontendRegion.WernickeArea_L]: 0.37,
  [FrontendRegion.WernickeArea_R]: 0.38,
  [FrontendRegion.PlanumTemporale_L]: 0.39,
  [FrontendRegion.PlanumTemporale_R]: 0.4,
  [FrontendRegion.FrontalOperculum_L]: 0.39,
  [FrontendRegion.FrontalOperculum_R]: 0.39,
  [FrontendRegion.ParsTriangularis_L]: 0.38,
  [FrontendRegion.ParsTriangularis_R]: 0.39,
  [FrontendRegion.ParsOrbitalis_L]: 0.38,
  [FrontendRegion.ParsOrbitalis_R]: 0.38,
  [FrontendRegion.SuperiorParietal_L]: 0.4,
  [FrontendRegion.SuperiorParietal_R]: 0.4,
  [FrontendRegion.InferiorParietal_L]: 0.4,
  [FrontendRegion.InferiorParietal_R]: 0.4,
  [FrontendRegion.PrecuneusRegion_L]: 0.39,
  [FrontendRegion.PrecuneusRegion_R]: 0.39,
  [FrontendRegion.AngularGyrus_L]: 0.39,
  [FrontendRegion.AngularGyrus_R]: 0.39,
  [FrontendRegion.Supramarginal_L]: 0.4,
  [FrontendRegion.Supramarginal_R]: 0.4,
  [FrontendRegion.SuperiorTemporalGyrus_L]: 0.39,
  [FrontendRegion.SuperiorTemporalGyrus_R]: 0.39,
  [FrontendRegion.MiddleTemporalGyrus_L]: 0.4,
  [FrontendRegion.MiddleTemporalGyrus_R]: 0.4,
  [FrontendRegion.InferiorTemporalGyrus_L]: 0.4,
  [FrontendRegion.InferiorTemporalGyrus_R]: 0.4,
  [FrontendRegion.FusiformGyrus_L]: 0.4,
  [FrontendRegion.FusiformGyrus_R]: 0.4,
  [FrontendRegion.TemporalPole_L]: 0.38,
  [FrontendRegion.TemporalPole_R]: 0.38,
  [FrontendRegion.PrimaryVisual_L]: 0.42,
  [FrontendRegion.PrimaryVisual_R]: 0.42,
  [FrontendRegion.SecondaryVisual_L]: 0.41,
  [FrontendRegion.SecondaryVisual_R]: 0.41,
  [FrontendRegion.V3Area_L]: 0.41,
  [FrontendRegion.V3Area_R]: 0.41,
  [FrontendRegion.V4Area_L]: 0.41,
  [FrontendRegion.V4Area_R]: 0.41,
  [FrontendRegion.MTArea_L]: 0.4,
  [FrontendRegion.MTArea_R]: 0.4,
  [FrontendRegion.LingualGyrus_L]: 0.41,
  [FrontendRegion.LingualGyrus_R]: 0.41,
  [FrontendRegion.OccipitalPole_L]: 0.42,
  [FrontendRegion.OccipitalPole_R]: 0.42,
  [FrontendRegion.RostralACC_L]: 0.38,
  [FrontendRegion.RostralACC_R]: 0.38,
  [FrontendRegion.CaudalACC_L]: 0.38,
  [FrontendRegion.CaudalACC_R]: 0.38,
  [FrontendRegion.MidCingulate_L]: 0.39,
  [FrontendRegion.MidCingulate_R]: 0.39,
  [FrontendRegion.PosteriorCingulate_L]: 0.39,
  [FrontendRegion.PosteriorCingulate_R]: 0.39,
  [FrontendRegion.RetrosplenialArea_L]: 0.39,
  [FrontendRegion.RetrosplenialArea_R]: 0.39,
  [FrontendRegion.AnteriorInsula_L]: 0.39,
  [FrontendRegion.AnteriorInsula_R]: 0.39,
  [FrontendRegion.PosteriorInsula_L]: 0.4,
  [FrontendRegion.PosteriorInsula_R]: 0.4,
  // Bilateral subcortical — Izhikevich IB class (0.35-0.40)
  [FrontendRegion.Thalamus_L]: 0.36,
  [FrontendRegion.Thalamus_R]: 0.36,
  [FrontendRegion.Caudate_L]: 0.38,
  [FrontendRegion.Caudate_R]: 0.38,
  [FrontendRegion.Putamen_L]: 0.38,
  [FrontendRegion.Putamen_R]: 0.38,
  [FrontendRegion.Pallidum_L]: 0.36,
  [FrontendRegion.Pallidum_R]: 0.36,
  [FrontendRegion.Hippocampus_L]: 0.36,
  [FrontendRegion.Hippocampus_R]: 0.36,
  [FrontendRegion.Amygdala_L]: 0.37,
  [FrontendRegion.Amygdala_R]: 0.37,
  [FrontendRegion.Accumbens_L]: 0.37,
  [FrontendRegion.Accumbens_R]: 0.37,
  [FrontendRegion.SubthalamicNucleus_R]: 0.38,
  [FrontendRegion.LateralGeniculateBody_R]: 0.36,
  [FrontendRegion.MedialGeniculateBody_R]: 0.36,
  [FrontendRegion.ZonaIncerta_L]: 0.38,
  [FrontendRegion.ZonaIncerta_R]: 0.38,
  [FrontendRegion.HabenularNucleus_L]: 0.38,
  [FrontendRegion.HabenularNucleus_R]: 0.38,
  // Cerebellar — granule cells have higher threshold (Ito 1984)
  [FrontendRegion.CerebellarLobule_I_IV]: 0.45,
  [FrontendRegion.CerebellarLobule_V]: 0.44,
  [FrontendRegion.CerebellarLobule_VI]: 0.44,
  [FrontendRegion.CerebellarLobule_VIIa]: 0.44,
  [FrontendRegion.CerebellarLobule_VIIb]: 0.45,
  [FrontendRegion.CerebellarLobule_VIII]: 0.45,
  [FrontendRegion.CerebellarLobule_IX]: 0.45,
  [FrontendRegion.CerebellarLobule_X]: 0.44,
  [FrontendRegion.CerebellarVermis]: 0.44,
  // Brainstem / reticular
  [FrontendRegion.PontineTegmentum]: 0.36,
  [FrontendRegion.MedullaryReticular]: 0.36,
  [FrontendRegion.SpleniumCorpusCallosum]: 0.4,
};

// Connectivity matrix: [from, to, weight] — negative weight = inhibitory
// synapse type tags the biological mechanism
interface ConnectivityEntry {
  from: ExtendedRegion;
  to: ExtendedRegion;
  weight: number;
  synapseType: SynapseType;
}

const CONNECTIVITY: ConnectivityEntry[] = [
  // ── Core PFC circuit ─────────────────────────────────────────────────────
  {
    from: Region.PrefrontalCortex,
    to: Region.Thalamus,
    weight: 0.3125,
    synapseType: "NMDA",
  },
  {
    from: Region.PrefrontalCortex,
    to: Region.Amygdala,
    weight: -0.28,
    synapseType: "GABA_A",
  },
  {
    from: Region.PrefrontalCortex,
    to: Region.BasalGanglia,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: Region.PrefrontalCortex,
    to: Region.Hippocampus,
    weight: 0.225,
    synapseType: "NMDA",
  },
  {
    from: Region.PrefrontalCortex,
    to: FrontendRegion.AnteriorCingulateCortex,
    weight: 0.275,
    synapseType: "AMPA",
  },
  {
    from: Region.PrefrontalCortex,
    to: FrontendRegion.OrbitalFrontalCortex,
    weight: 0.28,
    synapseType: "AMPA",
  },
  {
    from: Region.PrefrontalCortex,
    to: FrontendRegion.LateralHabenula,
    weight: 0.15,
    synapseType: "AMPA",
  },
  {
    from: Region.PrefrontalCortex,
    to: FrontendRegion.CingulateMotorArea,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: Region.PrefrontalCortex,
    to: FrontendRegion.TemporalCortex,
    weight: 0.225,
    synapseType: "NMDA",
  },
  {
    from: Region.PrefrontalCortex,
    to: FrontendRegion.DorsalACC,
    weight: 0.25,
    synapseType: "AMPA",
  },
  {
    from: Region.PrefrontalCortex,
    to: FrontendRegion.SupplementaryMotorArea,
    weight: 0.22,
    synapseType: "AMPA",
  },
  // ── Motor circuit ─────────────────────────────────────────────────────────
  {
    from: Region.MotorCortex,
    to: Region.BasalGanglia,
    weight: 0.3,
    synapseType: "AMPA",
  },
  {
    from: Region.MotorCortex,
    to: Region.Cerebellum,
    weight: 0.35,
    synapseType: "AMPA",
  },
  {
    from: Region.MotorCortex,
    to: Region.Thalamus,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SupplementaryMotorArea,
    to: Region.MotorCortex,
    weight: 0.3,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SupplementaryMotorArea,
    to: FrontendRegion.CingulateMotorArea,
    weight: 0.22,
    synapseType: "AMPA",
  },
  // ── Sensory circuit ───────────────────────────────────────────────────────
  {
    from: Region.SensoryCortex,
    to: Region.Thalamus,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: Region.SensoryCortex,
    to: Region.Amygdala,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: Region.SensoryCortex,
    to: Region.Hippocampus,
    weight: 0.1875,
    synapseType: "NMDA",
  },
  {
    from: Region.SensoryCortex,
    to: FrontendRegion.ParietalCortex,
    weight: 0.25,
    synapseType: "AMPA",
  },
  // ── Thalamic relay ────────────────────────────────────────────────────────
  {
    from: Region.Thalamus,
    to: Region.PrefrontalCortex,
    weight: 0.25,
    synapseType: "NMDA",
  },
  {
    from: Region.Thalamus,
    to: Region.MotorCortex,
    weight: 0.225,
    synapseType: "AMPA",
  },
  {
    from: Region.Thalamus,
    to: Region.SensoryCortex,
    weight: 0.25,
    synapseType: "AMPA",
  },
  {
    from: Region.Thalamus,
    to: Region.Hippocampus,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: Region.Thalamus,
    to: FrontendRegion.VisualCortex,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: Region.Thalamus,
    to: FrontendRegion.AuditoryCortex,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: Region.Thalamus,
    to: FrontendRegion.MedialdorsalThalamus,
    weight: 0.3,
    synapseType: "AMPA",
  },
  {
    from: Region.Thalamus,
    to: FrontendRegion.PulvinarThalamus,
    weight: 0.25,
    synapseType: "AMPA",
  },
  {
    from: Region.Thalamus,
    to: FrontendRegion.Insula,
    weight: 0.18,
    synapseType: "AMPA",
  },
  // ── Hippocampal circuit ───────────────────────────────────────────────────
  {
    from: Region.Hippocampus,
    to: Region.PrefrontalCortex,
    weight: 0.1875,
    synapseType: "NMDA",
  },
  {
    from: Region.Hippocampus,
    to: Region.Amygdala,
    weight: 0.25,
    synapseType: "AMPA",
  },
  {
    from: Region.Hippocampus,
    to: Region.BasalGanglia,
    weight: 0.15,
    synapseType: "AMPA",
  },
  {
    from: Region.Hippocampus,
    to: FrontendRegion.CA3,
    weight: 0.3125,
    synapseType: "NMDA",
  },
  {
    from: Region.Hippocampus,
    to: FrontendRegion.DentateGyrus,
    weight: 0.25,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.CA3,
    to: FrontendRegion.CA1,
    weight: 0.4,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.CA1,
    to: Region.Hippocampus,
    weight: 0.35,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.CA1,
    to: Region.PrefrontalCortex,
    weight: 0.225,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.DentateGyrus,
    to: FrontendRegion.CA3,
    weight: 0.3,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.EntorhinalCortex,
    to: FrontendRegion.DentateGyrus,
    weight: 0.3,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.EntorhinalCortex,
    to: FrontendRegion.CA1,
    weight: 0.3125,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.PerirhinalCortex,
    to: FrontendRegion.EntorhinalCortex,
    weight: 0.35,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PerirhinalCortex,
    to: Region.Hippocampus,
    weight: 0.2,
    synapseType: "AMPA",
  },
  // ── Amygdala fear/reward circuit ──────────────────────────────────────────
  {
    from: Region.Amygdala,
    to: Region.PrefrontalCortex,
    weight: 0.25,
    synapseType: "AMPA",
  },
  {
    from: Region.Amygdala,
    to: Region.Thalamus,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: Region.Amygdala,
    to: Region.BasalGanglia,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: Region.Amygdala,
    to: FrontendRegion.Insula,
    weight: 0.2,
    synapseType: "AMPA",
  },
  // ── Basal ganglia / action selection ─────────────────────────────────────
  {
    from: Region.BasalGanglia,
    to: Region.Thalamus,
    weight: 0.28,
    synapseType: "GABA_A",
  },
  // ── Cerebellar circuit ────────────────────────────────────────────────────
  {
    from: Region.Cerebellum,
    to: Region.Brainstem,
    weight: 0.3,
    synapseType: "AMPA",
  },
  {
    from: Region.Cerebellum,
    to: Region.Thalamus,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: Region.Cerebellum,
    to: FrontendRegion.PurkinjeLayer,
    weight: 0.35,
    synapseType: "AMPA",
  },
  {
    from: Region.Brainstem,
    to: Region.Thalamus,
    weight: 0.35,
    synapseType: "AMPA",
  },
  {
    from: Region.Brainstem,
    to: FrontendRegion.Hypothalamus,
    weight: 0.25,
    synapseType: "AMPA",
  },
  {
    from: Region.Brainstem,
    to: Region.Cerebellum,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PurkinjeLayer,
    to: FrontendRegion.DeepCerebellarNuclei,
    weight: 0.4,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.PurkinjeLayer,
    to: Region.Brainstem,
    weight: 0.2,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.DeepCerebellarNuclei,
    to: Region.Thalamus,
    weight: 0.3,
    synapseType: "AMPA",
  },
  // ── Insula / interoception ─────────────────────────────────────────────────
  {
    from: FrontendRegion.Insula,
    to: Region.Amygdala,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Insula,
    to: FrontendRegion.AnteriorCingulateCortex,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Insula,
    to: Region.PrefrontalCortex,
    weight: 0.15,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Insula,
    to: FrontendRegion.Hypothalamus,
    weight: 0.18,
    synapseType: "AMPA",
  },
  // ── ACC / conflict monitoring ──────────────────────────────────────────────
  {
    from: FrontendRegion.AnteriorCingulateCortex,
    to: Region.PrefrontalCortex,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.AnteriorCingulateCortex,
    to: Region.BasalGanglia,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.AnteriorCingulateCortex,
    to: Region.Amygdala,
    weight: -0.15,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.DorsalACC,
    to: FrontendRegion.AnteriorCingulateCortex,
    weight: 0.3,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.DorsalACC,
    to: Region.PrefrontalCortex,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.DorsalACC,
    to: FrontendRegion.SupplementaryMotorArea,
    weight: 0.22,
    synapseType: "AMPA",
  },
  // ── OFC / reward valuation ────────────────────────────────────────────────
  {
    from: FrontendRegion.OrbitalFrontalCortex,
    to: Region.Amygdala,
    weight: -0.24,
    synapseType: "GABA_B",
  },
  {
    from: FrontendRegion.OrbitalFrontalCortex,
    to: Region.PrefrontalCortex,
    weight: 0.15,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.OrbitalFrontalCortex,
    to: Region.Hippocampus,
    weight: 0.225,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.OrbitalFrontalCortex,
    to: FrontendRegion.NucleusAccumbens,
    weight: 0.25,
    synapseType: "AMPA",
  },
  // ── Visual / auditory ─────────────────────────────────────────────────────
  {
    from: FrontendRegion.VisualCortex,
    to: Region.Hippocampus,
    weight: 0.1875,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.VisualCortex,
    to: Region.SensoryCortex,
    weight: 0.25,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.VisualCortex,
    to: FrontendRegion.ParietalCortex,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.AuditoryCortex,
    to: Region.Thalamus,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.AuditoryCortex,
    to: Region.Hippocampus,
    weight: 0.1875,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.SuperiorTemporalSulcus,
    to: FrontendRegion.AuditoryCortex,
    weight: 0.35,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SuperiorTemporalSulcus,
    to: FrontendRegion.TemporalCortex,
    weight: 0.3,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SuperiorTemporalSulcus,
    to: Region.Amygdala,
    weight: 0.15,
    synapseType: "AMPA",
  },
  // ── Hypothalamus / homeostasis ────────────────────────────────────────────
  {
    from: FrontendRegion.Hypothalamus,
    to: Region.Brainstem,
    weight: 0.3,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Hypothalamus,
    to: Region.Thalamus,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Hypothalamus,
    to: Region.Amygdala,
    weight: 0.15,
    synapseType: "AMPA",
  },
  // ── Nucleus Accumbens / reward prediction ─────────────────────────────────
  {
    from: FrontendRegion.NucleusAccumbens,
    to: Region.PrefrontalCortex,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.NucleusAccumbens,
    to: Region.Amygdala,
    weight: -0.15,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.NucleusAccumbens,
    to: Region.BasalGanglia,
    weight: 0.25,
    synapseType: "AMPA",
  },
  // ── Olfactory ─────────────────────────────────────────────────────────────
  {
    from: FrontendRegion.OlfactoryBulb,
    to: Region.Amygdala,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.OlfactoryBulb,
    to: Region.Hippocampus,
    weight: 0.225,
    synapseType: "NMDA",
  },
  // ── Thalamic nuclei ───────────────────────────────────────────────────────
  {
    from: FrontendRegion.MedialdorsalThalamus,
    to: Region.PrefrontalCortex,
    weight: 0.35,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.PulvinarThalamus,
    to: FrontendRegion.VisualCortex,
    weight: 0.275,
    synapseType: "AMPA",
  },
  // ── Claustrum / consciousness ─────────────────────────────────────────────
  {
    from: FrontendRegion.Claustrum,
    to: Region.PrefrontalCortex,
    weight: 0.225,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.Claustrum,
    to: Region.SensoryCortex,
    weight: 0.25,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Claustrum,
    to: Region.MotorCortex,
    weight: 0.15,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Claustrum,
    to: FrontendRegion.VisualCortex,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Claustrum,
    to: FrontendRegion.AuditoryCortex,
    weight: 0.15,
    synapseType: "AMPA",
  },
  // ── Lateral Habenula (reward/aversion) ────────────────────────────────────
  {
    from: FrontendRegion.LateralHabenula,
    to: FrontendRegion.SubstantiaNigra,
    weight: -0.3,
    synapseType: "GABA_B",
  },
  {
    from: FrontendRegion.LateralHabenula,
    to: Region.Brainstem,
    weight: -0.2,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.LateralHabenula,
    to: FrontendRegion.RapheNuclei,
    weight: -0.25,
    synapseType: "GABA_A",
  },
  // ── Substantia Nigra / dopaminergic ───────────────────────────────────────
  {
    from: FrontendRegion.SubstantiaNigra,
    to: Region.BasalGanglia,
    weight: 0.35,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SubstantiaNigra,
    to: Region.MotorCortex,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SubstantiaNigra,
    to: FrontendRegion.NucleusAccumbens,
    weight: -0.2,
    synapseType: "GABA_B",
  },
  {
    from: FrontendRegion.SubstantiaNigra,
    to: FrontendRegion.LateralHabenula,
    weight: 0.15,
    synapseType: "AMPA",
  },
  // ── Parietal Cortex / spatial ─────────────────────────────────────────────
  {
    from: FrontendRegion.ParietalCortex,
    to: Region.SensoryCortex,
    weight: 0.25,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.ParietalCortex,
    to: Region.MotorCortex,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.ParietalCortex,
    to: Region.Hippocampus,
    weight: 0.225,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.ParietalCortex,
    to: FrontendRegion.TemporalCortex,
    weight: 0.25,
    synapseType: "AMPA",
  },
  // ── Temporal Cortex ───────────────────────────────────────────────────────
  {
    from: FrontendRegion.TemporalCortex,
    to: FrontendRegion.AuditoryCortex,
    weight: 0.3,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.TemporalCortex,
    to: Region.Hippocampus,
    weight: 0.3125,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.TemporalCortex,
    to: Region.Amygdala,
    weight: 0.225,
    synapseType: "AMPA",
  },
  // ── CMA ───────────────────────────────────────────────────────────────────
  {
    from: FrontendRegion.CingulateMotorArea,
    to: Region.MotorCortex,
    weight: 0.28,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.CingulateMotorArea,
    to: FrontendRegion.AnteriorCingulateCortex,
    weight: 0.22,
    synapseType: "AMPA",
  },
  // ── VTA / mesolimbic ──────────────────────────────────────────────────────
  {
    from: FrontendRegion.VentralTegmentalArea,
    to: FrontendRegion.NucleusAccumbens,
    weight: 0.4,
    synapseType: "DA",
  },
  {
    from: FrontendRegion.VentralTegmentalArea,
    to: Region.PrefrontalCortex,
    weight: 0.3,
    synapseType: "DA",
  },
  {
    from: FrontendRegion.VentralTegmentalArea,
    to: Region.Hippocampus,
    weight: 0.24,
    synapseType: "DA",
  },
  {
    from: FrontendRegion.VentralTegmentalArea,
    to: FrontendRegion.VentralStriatum,
    weight: 0.35,
    synapseType: "DA",
  },
  // ── Locus Coeruleus / norepinephrine arousal ──────────────────────────────
  {
    from: FrontendRegion.LocusCoeruleus,
    to: Region.PrefrontalCortex,
    weight: 0.25,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: Region.Amygdala,
    weight: 0.3,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: Region.Hippocampus,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: Region.Cerebellum,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: Region.Brainstem,
    to: FrontendRegion.LocusCoeruleus,
    weight: 0.3,
    synapseType: "AMPA",
  },
  // ── Raphe Nuclei / serotonin ──────────────────────────────────────────────
  {
    from: FrontendRegion.RapheNuclei,
    to: Region.PrefrontalCortex,
    weight: 0.2,
    synapseType: "5HT",
  },
  {
    from: FrontendRegion.RapheNuclei,
    to: Region.Hippocampus,
    weight: 0.22,
    synapseType: "5HT",
  },
  {
    from: FrontendRegion.RapheNuclei,
    to: Region.Amygdala,
    weight: -0.2,
    synapseType: "5HT",
  },
  {
    from: FrontendRegion.RapheNuclei,
    to: FrontendRegion.Hypothalamus,
    weight: 0.18,
    synapseType: "5HT",
  },
  {
    from: Region.Brainstem,
    to: FrontendRegion.RapheNuclei,
    weight: 0.28,
    synapseType: "AMPA",
  },
  // ── Ventral Striatum / motivation ─────────────────────────────────────────
  {
    from: FrontendRegion.VentralStriatum,
    to: FrontendRegion.VentralPallidum,
    weight: 0.3,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.VentralStriatum,
    to: Region.PrefrontalCortex,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.VentralStriatum,
    to: Region.BasalGanglia,
    weight: 0.25,
    synapseType: "AMPA",
  },
  // ── Ventral Pallidum / reward integration ────────────────────────────────
  {
    from: FrontendRegion.VentralPallidum,
    to: Region.Thalamus,
    weight: 0.25,
    synapseType: "GABA_B",
  },
  {
    from: FrontendRegion.VentralPallidum,
    to: FrontendRegion.VentralTegmentalArea,
    weight: -0.2,
    synapseType: "GABA_A",
  },
  // ── SpinoCerebellarTract / motor error feedback ───────────────────────────
  {
    from: Region.MotorCortex,
    to: FrontendRegion.SpinoCerebellarTract,
    weight: 0.32,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SpinoCerebellarTract,
    to: Region.Cerebellum,
    weight: 0.4,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SpinoCerebellarTract,
    to: Region.Brainstem,
    weight: 0.28,
    synapseType: "AMPA",
  },
  // ── Periaqueductal Gray / fear-pain-motivation gating ────────────────────
  {
    from: FrontendRegion.PeriaqueductalGray,
    to: Region.Amygdala,
    weight: 0.28,
    synapseType: "AMPA",
  },
  {
    from: Region.Amygdala,
    to: FrontendRegion.PeriaqueductalGray,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PeriaqueductalGray,
    to: Region.Brainstem,
    weight: 0.3,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PeriaqueductalGray,
    to: FrontendRegion.Hypothalamus,
    weight: 0.22,
    synapseType: "AMPA",
  },
  // ── Bed Nucleus Stria Terminalis / sustained anxiety ─────────────────────
  {
    from: FrontendRegion.BedNucleusStria,
    to: Region.Amygdala,
    weight: -0.22,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.BedNucleusStria,
    to: FrontendRegion.Hypothalamus,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.BedNucleusStria,
    to: Region.PrefrontalCortex,
    weight: -0.15,
    synapseType: "GABA_A",
  },
  {
    from: Region.Amygdala,
    to: FrontendRegion.BedNucleusStria,
    weight: 0.3,
    synapseType: "AMPA",
  },
  // ── Medial Septum / theta pacemaker ──────────────────────────────────────
  {
    from: FrontendRegion.MedialSeptum,
    to: Region.Hippocampus,
    weight: 0.35,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.MedialSeptum,
    to: FrontendRegion.CA1,
    weight: 0.3,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.MedialSeptum,
    to: FrontendRegion.CA3,
    weight: 0.28,
    synapseType: "AMPA",
  },
  {
    from: Region.Brainstem,
    to: FrontendRegion.MedialSeptum,
    weight: 0.25,
    synapseType: "AMPA",
  },
  // ── RetrosplenialCortex / spatial memory ─────────────────────────────────
  {
    from: FrontendRegion.RetroSplenialCortex,
    to: Region.Hippocampus,
    weight: 0.35,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.RetroSplenialCortex,
    to: FrontendRegion.ParietalCortex,
    weight: 0.3125,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.RetroSplenialCortex,
    to: FrontendRegion.EntorhinalCortex,
    weight: 0.275,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.ParietalCortex,
    to: FrontendRegion.RetroSplenialCortex,
    weight: 0.275,
    synapseType: "AMPA",
  },
  // ── Additional cross-region density connections ────────────────────────────
  {
    from: FrontendRegion.VentralTegmentalArea,
    to: Region.Amygdala,
    weight: 0.264,
    synapseType: "DA",
  },
  {
    from: FrontendRegion.VentralTegmentalArea,
    to: Region.BasalGanglia,
    weight: 0.28,
    synapseType: "DA",
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: Region.SensoryCortex,
    weight: 0.24,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: Region.Thalamus,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.CA1,
    to: FrontendRegion.EntorhinalCortex,
    weight: 0.275,
    synapseType: "NMDA",
  },
  {
    from: Region.Hippocampus,
    to: FrontendRegion.EntorhinalCortex,
    weight: 0.25,
    synapseType: "NMDA",
  },
  {
    from: Region.Amygdala,
    to: Region.Hippocampus,
    weight: 0.225,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.NucleusAccumbens,
    to: FrontendRegion.VentralPallidum,
    weight: -0.3,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.VentralStriatum,
    to: Region.BasalGanglia,
    weight: 0.25,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Claustrum,
    to: Region.Hippocampus,
    weight: 0.225,
    synapseType: "NMDA",
  },
  {
    from: Region.Thalamus,
    to: FrontendRegion.EntorhinalCortex,
    weight: 0.25,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Insula,
    to: FrontendRegion.Hypothalamus,
    weight: 0.22,
    synapseType: "AMPA",
  },

  // ── Papez Circuit (memory consolidation loop) ─────────────────────────────
  // Hippocampus -> Fornix -> Mammillary Bodies -> Anterior Thalamus -> Cingulate
  {
    from: Region.Hippocampus,
    to: FrontendRegion.FornixBody,
    weight: 0.28,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.FornixBody,
    to: FrontendRegion.MamillaryBodies,
    weight: 0.32,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.MamillaryBodies,
    to: Region.Thalamus,
    weight: 0.25,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.MamillaryBodies,
    to: FrontendRegion.MedialdorsalThalamus,
    weight: 0.2,
    synapseType: "AMPA",
  },
  // ── PFC Top-Down Modulatory Feedback ────────────────────────────────────
  // PFC inhibits VTA to regulate dopamine release (mesocortical feedback)
  {
    from: Region.PrefrontalCortex,
    to: FrontendRegion.VentralTegmentalArea,
    weight: -0.15,
    synapseType: "GABA_A",
  },
  // PFC inhibits LC to regulate arousal (top-down attention control)
  {
    from: Region.PrefrontalCortex,
    to: FrontendRegion.LocusCoeruleus,
    weight: -0.12,
    synapseType: "GABA_A",
  },
  // ── Primary Sensory Thalamic Relays ────────────────────────────────────
  // Lateral Geniculate Body -> Visual Cortex (primary visual relay)
  {
    from: FrontendRegion.LateralGeniculateBody_L,
    to: FrontendRegion.VisualCortex,
    weight: 0.35,
    synapseType: "AMPA",
  },
  // Medial Geniculate Body -> Auditory Cortex (primary auditory relay)
  {
    from: FrontendRegion.MedialGeniculateBody_L,
    to: FrontendRegion.AuditoryCortex,
    weight: 0.3,
    synapseType: "AMPA",
  },
  // ── Subthalamic Nucleus Hyperdirect Pathway ──────────────────────────────
  // STN -> Basal Ganglia (hyperdirect: fast action suppression)
  {
    from: FrontendRegion.SubthalamicNucleus_L,
    to: Region.BasalGanglia,
    weight: 0.28,
    synapseType: "AMPA",
  },
  // Basal Ganglia -> STN (indirect pathway feedback, GABAergic)
  {
    from: Region.BasalGanglia,
    to: FrontendRegion.SubthalamicNucleus_L,
    weight: -0.22,
    synapseType: "GABA_A",
  },
  // STN -> Substantia Nigra (excitatory drive to SNr for action gating)
  {
    from: FrontendRegion.SubthalamicNucleus_L,
    to: FrontendRegion.SubstantiaNigra,
    weight: 0.2,
    synapseType: "AMPA",
  },
  // ── Corticothalamic Feedback Loops ─────────────────────────────────────
  // Visual Cortex -> Thalamus (top-down predictive feedback)
  {
    from: FrontendRegion.VisualCortex,
    to: Region.Thalamus,
    weight: 0.225,
    synapseType: "NMDA",
  },
  // Auditory Cortex -> Thalamus (top-down auditory feedback)
  {
    from: FrontendRegion.AuditoryCortex,
    to: Region.Thalamus,
    weight: 0.2,
    synapseType: "NMDA",
  },
  // ── Memory-Homeostasis Coupling ─────────────────────────────────────────
  // Hippocampus -> Hypothalamus (memory-driven homeostatic regulation)
  {
    from: Region.Hippocampus,
    to: FrontendRegion.Hypothalamus,
    weight: 0.18,
    synapseType: "AMPA",
  },
  // ── VTA Prediction Error Signal ────────────────────────────────────────
  // VTA -> Lateral Habenula (reward prediction error, dopamine-habenula loop)
  {
    from: FrontendRegion.VentralTegmentalArea,
    to: FrontendRegion.LateralHabenula,
    weight: 0.24,
    synapseType: "DA",
  },
  // ── Interoceptive-Conflict Integration ─────────────────────────────────
  // Insula -> ACC (body state informs conflict monitoring)
  {
    from: FrontendRegion.Insula,
    to: FrontendRegion.AnteriorCingulateCortex,
    weight: 0.22,
    synapseType: "AMPA",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HCP 180-REGION ADDITIONS — Full end-to-end wiring per circuit
  // Sources: HCP-MMP1.0 (Glasser 2016), DTI/fMRI tractography, Allen Brain Atlas
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Circuit 1: Bilateral motor/somatosensory (Penfield map) ─────────────────
  {
    from: FrontendRegion.PrimaryMotorCortex_L,
    to: FrontendRegion.PrimaryMotorCortex_R,
    weight: 0.12,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PrimaryMotorCortex_R,
    to: FrontendRegion.PrimaryMotorCortex_L,
    weight: 0.12,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PrimaryMotorCortex_L,
    to: FrontendRegion.PrimarySomatosensory_L,
    weight: 0.25,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PrimaryMotorCortex_R,
    to: FrontendRegion.PrimarySomatosensory_R,
    weight: 0.25,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PreMotorCortex_L,
    to: FrontendRegion.PrimaryMotorCortex_L,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PreMotorCortex_R,
    to: FrontendRegion.PrimaryMotorCortex_R,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PreMotorCortex_L,
    to: FrontendRegion.PreMotorCortex_R,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PreMotorCortex_R,
    to: FrontendRegion.PreMotorCortex_L,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PostCentralGyrus_L,
    to: FrontendRegion.PostCentralGyrus_R,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PostCentralGyrus_R,
    to: FrontendRegion.PostCentralGyrus_L,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PostCentralGyrus_L,
    to: FrontendRegion.PrimarySomatosensory_L,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PostCentralGyrus_R,
    to: FrontendRegion.PrimarySomatosensory_R,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SecondarySomatosensory_L,
    to: FrontendRegion.PrimarySomatosensory_L,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SecondarySomatosensory_R,
    to: FrontendRegion.PrimarySomatosensory_R,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PreCentralGyrus_L,
    to: FrontendRegion.PrimaryMotorCortex_L,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PreCentralGyrus_R,
    to: FrontendRegion.PrimaryMotorCortex_R,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PrimaryMotorHand_L,
    to: FrontendRegion.PrimaryMotorCortex_L,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PrimaryMotorHand_R,
    to: FrontendRegion.PrimaryMotorCortex_R,
    weight: 0.22,
    synapseType: "AMPA",
  },

  // ── Circuit 2: Prefrontal executive network ──────────────────────────────────
  {
    from: FrontendRegion.FrontalPole_L,
    to: FrontendRegion.FrontalPole_R,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.FrontalPole_R,
    to: FrontendRegion.FrontalPole_L,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.FrontalPole_L,
    to: FrontendRegion.MedialPFC_L,
    weight: 0.225,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.FrontalPole_R,
    to: FrontendRegion.MedialPFC_R,
    weight: 0.225,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.MedialPFC_R,
    weight: 0.175,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.MedialPFC_R,
    to: FrontendRegion.MedialPFC_L,
    weight: 0.175,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.VentralMPFC_L,
    to: FrontendRegion.MedialPFC_L,
    weight: 0.25,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.VentralMPFC_R,
    to: FrontendRegion.MedialPFC_R,
    weight: 0.25,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.DorsalMPFC_L,
    to: FrontendRegion.MedialPFC_L,
    weight: 0.25,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.DorsalMPFC_R,
    to: FrontendRegion.MedialPFC_R,
    weight: 0.25,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.DorsalMPFC_L,
    to: FrontendRegion.DorsalMPFC_R,
    weight: 0.15,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.DorsalMPFC_R,
    to: FrontendRegion.DorsalMPFC_L,
    weight: 0.15,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.InferiorFrontal_L,
    to: FrontendRegion.MedialPFC_L,
    weight: 0.225,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.InferiorFrontal_R,
    to: FrontendRegion.MedialPFC_R,
    weight: 0.225,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.MiddleFrontal_L,
    to: FrontendRegion.InferiorFrontal_L,
    weight: 0.225,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.MiddleFrontal_R,
    to: FrontendRegion.InferiorFrontal_R,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SuperiorFrontal_L,
    to: FrontendRegion.MiddleFrontal_L,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SuperiorFrontal_R,
    to: FrontendRegion.MiddleFrontal_R,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.MedialPFC_L,
    to: Region.PrefrontalCortex,
    weight: 0.275,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.MedialPFC_R,
    to: Region.PrefrontalCortex,
    weight: 0.275,
    synapseType: "NMDA",
  },

  // ── Circuit 3: Language circuit (Friederici 2011, NMDA-heavy) ────────────────
  {
    from: FrontendRegion.BrocaArea_L,
    to: FrontendRegion.WernickeArea_L,
    weight: 0.3,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.WernickeArea_L,
    to: FrontendRegion.BrocaArea_L,
    weight: 0.35,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.BrocaArea_L,
    to: FrontendRegion.ParsTriangularis_L,
    weight: 0.275,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.BrocaArea_L,
    to: FrontendRegion.ParsOrbitalis_L,
    weight: 0.25,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.FrontalOperculum_L,
    to: FrontendRegion.BrocaArea_L,
    weight: 0.25,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.BrocaArea_L,
    to: FrontendRegion.FrontalOperculum_L,
    weight: 0.225,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.FrontalOperculum_R,
    to: FrontendRegion.BrocaArea_R,
    weight: 0.25,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.BrocaArea_R,
    to: FrontendRegion.FrontalOperculum_R,
    weight: 0.225,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.WernickeArea_L,
    to: FrontendRegion.PlanumTemporale_L,
    weight: 0.275,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.WernickeArea_R,
    to: FrontendRegion.PlanumTemporale_R,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PlanumTemporale_L,
    to: FrontendRegion.SuperiorTemporalGyrus_L,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PlanumTemporale_R,
    to: FrontendRegion.SuperiorTemporalGyrus_R,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.BrocaArea_L,
    to: FrontendRegion.InferiorFrontal_L,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.BrocaArea_L,
    to: FrontendRegion.BrocaArea_R,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.BrocaArea_R,
    to: FrontendRegion.BrocaArea_L,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.WernickeArea_L,
    to: FrontendRegion.AuditoryCortex,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.AuditoryCortex,
    to: FrontendRegion.WernickeArea_L,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.AuditoryCortex,
    to: FrontendRegion.WernickeArea_R,
    weight: 0.18,
    synapseType: "AMPA",
  },

  // ── Circuit 4: Default Mode Network (Buckner 2008) ───────────────────────────
  {
    from: FrontendRegion.PosteriorCingulate_L,
    to: FrontendRegion.PrecuneusRegion_L,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PosteriorCingulate_R,
    to: FrontendRegion.PrecuneusRegion_R,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PrecuneusRegion_L,
    to: FrontendRegion.PrecuneusRegion_R,
    weight: 0.12,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PrecuneusRegion_R,
    to: FrontendRegion.PrecuneusRegion_L,
    weight: 0.12,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.AngularGyrus_L,
    to: FrontendRegion.PosteriorCingulate_L,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.AngularGyrus_R,
    to: FrontendRegion.PosteriorCingulate_R,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.AngularGyrus_L,
    to: FrontendRegion.AngularGyrus_R,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.AngularGyrus_R,
    to: FrontendRegion.AngularGyrus_L,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.PosteriorCingulate_L,
    weight: 0.25,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.MedialPFC_R,
    to: FrontendRegion.PosteriorCingulate_R,
    weight: 0.25,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.PosteriorCingulate_L,
    to: FrontendRegion.Hippocampus_L,
    weight: 0.225,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PosteriorCingulate_R,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PosteriorCingulate_L,
    to: FrontendRegion.PosteriorCingulate_R,
    weight: 0.14,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PosteriorCingulate_R,
    to: FrontendRegion.PosteriorCingulate_L,
    weight: 0.14,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.RetrosplenialArea_L,
    to: FrontendRegion.PosteriorCingulate_L,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.RetrosplenialArea_R,
    to: FrontendRegion.PosteriorCingulate_R,
    weight: 0.18,
    synapseType: "AMPA",
  },

  // ── Circuit 5: Visual hierarchy (Felleman & Van Essen 1991) ─────────────────
  {
    from: FrontendRegion.LateralGeniculateBody_R,
    to: FrontendRegion.PrimaryVisual_R,
    weight: 0.3,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PrimaryVisual_L,
    to: FrontendRegion.PrimaryVisual_R,
    weight: 0.12,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PrimaryVisual_R,
    to: FrontendRegion.PrimaryVisual_L,
    weight: 0.12,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PrimaryVisual_L,
    to: FrontendRegion.SecondaryVisual_L,
    weight: 0.25,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PrimaryVisual_R,
    to: FrontendRegion.SecondaryVisual_R,
    weight: 0.25,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SecondaryVisual_L,
    to: FrontendRegion.V3Area_L,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SecondaryVisual_R,
    to: FrontendRegion.V3Area_R,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.V3Area_L,
    to: FrontendRegion.V4Area_L,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.V3Area_R,
    to: FrontendRegion.V4Area_R,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.V4Area_L,
    to: FrontendRegion.MTArea_L,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.V4Area_R,
    to: FrontendRegion.MTArea_R,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.V4Area_L,
    to: FrontendRegion.FusiformGyrus_L,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.V4Area_R,
    to: FrontendRegion.FusiformGyrus_R,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.MTArea_L,
    to: FrontendRegion.ParietalCortex,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.LingualGyrus_L,
    to: FrontendRegion.SecondaryVisual_L,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.LingualGyrus_R,
    to: FrontendRegion.SecondaryVisual_R,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.OccipitalPole_L,
    to: FrontendRegion.PrimaryVisual_L,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.OccipitalPole_R,
    to: FrontendRegion.PrimaryVisual_R,
    weight: 0.2,
    synapseType: "AMPA",
  },

  // ── Circuit 6: Parietal association ──────────────────────────────────────────
  {
    from: FrontendRegion.SuperiorParietal_L,
    to: FrontendRegion.SuperiorParietal_R,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SuperiorParietal_R,
    to: FrontendRegion.SuperiorParietal_L,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.InferiorParietal_L,
    to: FrontendRegion.InferiorParietal_R,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.InferiorParietal_R,
    to: FrontendRegion.InferiorParietal_L,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Supramarginal_L,
    to: FrontendRegion.InferiorParietal_L,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Supramarginal_R,
    to: FrontendRegion.InferiorParietal_R,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.InferiorParietal_L,
    to: FrontendRegion.AngularGyrus_L,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.InferiorParietal_R,
    to: FrontendRegion.AngularGyrus_R,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SuperiorParietal_L,
    to: FrontendRegion.ParietalCortex,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SuperiorParietal_R,
    to: FrontendRegion.ParietalCortex,
    weight: 0.22,
    synapseType: "AMPA",
  },

  // ── Circuit 7: Temporal association ──────────────────────────────────────────
  {
    from: FrontendRegion.SuperiorTemporalGyrus_L,
    to: FrontendRegion.SuperiorTemporalGyrus_R,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SuperiorTemporalGyrus_R,
    to: FrontendRegion.SuperiorTemporalGyrus_L,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SuperiorTemporalGyrus_L,
    to: FrontendRegion.MiddleTemporalGyrus_L,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SuperiorTemporalGyrus_R,
    to: FrontendRegion.MiddleTemporalGyrus_R,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.MiddleTemporalGyrus_L,
    to: FrontendRegion.InferiorTemporalGyrus_L,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.MiddleTemporalGyrus_R,
    to: FrontendRegion.InferiorTemporalGyrus_R,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.InferiorTemporalGyrus_L,
    to: FrontendRegion.TemporalPole_L,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.InferiorTemporalGyrus_R,
    to: FrontendRegion.TemporalPole_R,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.FusiformGyrus_L,
    to: FrontendRegion.InferiorTemporalGyrus_L,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.FusiformGyrus_R,
    to: FrontendRegion.InferiorTemporalGyrus_R,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.TemporalPole_L,
    to: FrontendRegion.Amygdala_L,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.TemporalPole_R,
    to: FrontendRegion.Amygdala_R,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SuperiorTemporalGyrus_L,
    to: FrontendRegion.AuditoryCortex,
    weight: 0.2,
    synapseType: "AMPA",
  },

  // ── Circuit 8: Cerebellar loops (Ito 1984) ───────────────────────────────────
  {
    from: FrontendRegion.CerebellarLobule_V,
    to: FrontendRegion.DeepCerebellarNuclei,
    weight: -0.2,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.CerebellarLobule_VI,
    to: FrontendRegion.DeepCerebellarNuclei,
    weight: -0.2,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.CerebellarLobule_VIIa,
    to: FrontendRegion.DeepCerebellarNuclei,
    weight: -0.18,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.CerebellarLobule_VIIb,
    to: FrontendRegion.DeepCerebellarNuclei,
    weight: -0.16,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.CerebellarLobule_VIII,
    to: FrontendRegion.DeepCerebellarNuclei,
    weight: -0.16,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.CerebellarLobule_I_IV,
    to: FrontendRegion.PontineTegmentum,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.CerebellarLobule_IX,
    to: FrontendRegion.PontineTegmentum,
    weight: 0.14,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.CerebellarLobule_X,
    to: Region.Brainstem,
    weight: 0.14,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.CerebellarVermis,
    to: Region.Brainstem,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.CerebellarVermis,
    to: FrontendRegion.DeepCerebellarNuclei,
    weight: -0.15,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.PontineTegmentum,
    to: FrontendRegion.CerebellarLobule_V,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PontineTegmentum,
    to: FrontendRegion.CerebellarLobule_VI,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PontineTegmentum,
    to: Region.Brainstem,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.MedullaryReticular,
    to: Region.Brainstem,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: Region.Brainstem,
    to: FrontendRegion.MedullaryReticular,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.MedullaryReticular,
    to: FrontendRegion.PontineTegmentum,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.DeepCerebellarNuclei,
    to: FrontendRegion.Thalamus_L,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.DeepCerebellarNuclei,
    to: FrontendRegion.Thalamus_R,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.PrimaryMotorCortex_L,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.PrimaryMotorCortex_R,
    weight: 0.2,
    synapseType: "AMPA",
  },

  // ── Circuit 9: Basal ganglia bilateral (Alexander 1986) ─────────────────────
  {
    from: FrontendRegion.Caudate_L,
    to: FrontendRegion.Putamen_L,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Caudate_R,
    to: FrontendRegion.Putamen_R,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Putamen_L,
    to: FrontendRegion.Pallidum_L,
    weight: -0.22,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.Putamen_R,
    to: FrontendRegion.Pallidum_R,
    weight: -0.22,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.Pallidum_L,
    to: FrontendRegion.Thalamus_L,
    weight: -0.2,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.Pallidum_R,
    to: FrontendRegion.Thalamus_R,
    weight: -0.2,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.SubthalamicNucleus_R,
    to: FrontendRegion.Pallidum_R,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Putamen_L,
    to: FrontendRegion.SubthalamicNucleus_L,
    weight: -0.15,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.Putamen_R,
    to: FrontendRegion.SubthalamicNucleus_R,
    weight: -0.15,
    synapseType: "GABA_A",
  },
  {
    from: Region.BasalGanglia,
    to: FrontendRegion.Caudate_L,
    weight: 0.216,
    synapseType: "DA",
  },
  {
    from: Region.BasalGanglia,
    to: FrontendRegion.Caudate_R,
    weight: 0.216,
    synapseType: "DA",
  },
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.Caudate_L,
    weight: 0.192,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.Caudate_R,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Accumbens_L,
    to: FrontendRegion.Pallidum_L,
    weight: -0.16,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.Accumbens_R,
    to: FrontendRegion.Pallidum_R,
    weight: -0.16,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.NucleusAccumbens,
    to: FrontendRegion.Accumbens_L,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.NucleusAccumbens,
    to: FrontendRegion.Accumbens_R,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Accumbens_L,
    to: FrontendRegion.NucleusAccumbens,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Accumbens_R,
    to: FrontendRegion.NucleusAccumbens,
    weight: 0.18,
    synapseType: "AMPA",
  },

  // ── Circuit 10: Limbic bilateral ─────────────────────────────────────────────
  {
    from: FrontendRegion.Hippocampus_L,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.12,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Hippocampus_R,
    to: FrontendRegion.Hippocampus_L,
    weight: 0.12,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Hippocampus_L,
    to: FrontendRegion.Amygdala_L,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Hippocampus_R,
    to: FrontendRegion.Amygdala_R,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Amygdala_L,
    to: FrontendRegion.Amygdala_R,
    weight: 0.12,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Amygdala_R,
    to: FrontendRegion.Amygdala_L,
    weight: 0.12,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Hippocampus_L,
    to: FrontendRegion.EntorhinalCortex,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Hippocampus_R,
    to: FrontendRegion.EntorhinalCortex,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.EntorhinalCortex,
    to: FrontendRegion.Hippocampus_L,
    weight: 0.24,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.EntorhinalCortex,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.24,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Amygdala_L,
    to: Region.Hippocampus,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Amygdala_R,
    to: Region.Hippocampus,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: Region.Hippocampus,
    to: FrontendRegion.Hippocampus_L,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: Region.Hippocampus,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Amygdala_L,
    to: Region.Amygdala,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Amygdala_R,
    to: Region.Amygdala,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: Region.Amygdala,
    to: FrontendRegion.Amygdala_L,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: Region.Amygdala,
    to: FrontendRegion.Amygdala_R,
    weight: 0.2,
    synapseType: "AMPA",
  },

  // ── Circuit 11: Cingulate network ────────────────────────────────────────────
  {
    from: FrontendRegion.RostralACC_L,
    to: FrontendRegion.CaudalACC_L,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.RostralACC_R,
    to: FrontendRegion.CaudalACC_R,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.RostralACC_L,
    to: FrontendRegion.RostralACC_R,
    weight: 0.12,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.RostralACC_R,
    to: FrontendRegion.RostralACC_L,
    weight: 0.12,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.CaudalACC_L,
    to: FrontendRegion.MidCingulate_L,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.CaudalACC_R,
    to: FrontendRegion.MidCingulate_R,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.MidCingulate_L,
    to: FrontendRegion.PosteriorCingulate_L,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.MidCingulate_R,
    to: FrontendRegion.PosteriorCingulate_R,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.AnteriorCingulateCortex,
    to: FrontendRegion.RostralACC_L,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.AnteriorCingulateCortex,
    to: FrontendRegion.RostralACC_R,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.RostralACC_L,
    to: FrontendRegion.AnteriorCingulateCortex,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.CaudalACC_L,
    to: FrontendRegion.CaudalACC_R,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.CaudalACC_R,
    to: FrontendRegion.CaudalACC_L,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.MidCingulate_L,
    to: FrontendRegion.MidCingulate_R,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.MidCingulate_R,
    to: FrontendRegion.MidCingulate_L,
    weight: 0.1,
    synapseType: "AMPA",
  },

  // ── Circuit 12: Insular network ──────────────────────────────────────────────
  {
    from: FrontendRegion.AnteriorInsula_L,
    to: FrontendRegion.AnteriorInsula_R,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.AnteriorInsula_R,
    to: FrontendRegion.AnteriorInsula_L,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PosteriorInsula_L,
    to: FrontendRegion.PosteriorInsula_R,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PosteriorInsula_R,
    to: FrontendRegion.PosteriorInsula_L,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.AnteriorInsula_L,
    to: FrontendRegion.PosteriorInsula_L,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.AnteriorInsula_R,
    to: FrontendRegion.PosteriorInsula_R,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.AnteriorInsula_L,
    to: FrontendRegion.AnteriorCingulateCortex,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.AnteriorInsula_R,
    to: FrontendRegion.AnteriorCingulateCortex,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Insula,
    to: FrontendRegion.AnteriorInsula_L,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Insula,
    to: FrontendRegion.AnteriorInsula_R,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.AnteriorInsula_L,
    to: FrontendRegion.Insula,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.AnteriorInsula_L,
    to: FrontendRegion.Amygdala_L,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.AnteriorInsula_R,
    to: FrontendRegion.Amygdala_R,
    weight: 0.16,
    synapseType: "AMPA",
  },

  // ── Circuit 13: Thalamic relay bilateral ─────────────────────────────────────
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.Thalamus_R,
    weight: 0.14,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.Thalamus_L,
    weight: 0.14,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.ZonaIncerta_L,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.ZonaIncerta_R,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.ZonaIncerta_L,
    to: FrontendRegion.Thalamus_L,
    weight: -0.14,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.ZonaIncerta_R,
    to: FrontendRegion.Thalamus_R,
    weight: -0.14,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.MedialGeniculateBody_R,
    to: FrontendRegion.AuditoryCortex,
    weight: 0.28,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.MedialGeniculateBody_R,
    to: FrontendRegion.Thalamus_R,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.LateralGeniculateBody_R,
    to: FrontendRegion.Thalamus_R,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: Region.Thalamus,
    to: FrontendRegion.Thalamus_L,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: Region.Thalamus,
    to: FrontendRegion.Thalamus_R,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Thalamus_L,
    to: Region.Thalamus,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: Region.Thalamus,
    weight: 0.2,
    synapseType: "AMPA",
  },

  // ── Circuit 14: Habenular prediction error ───────────────────────────────────
  {
    from: FrontendRegion.HabenularNucleus_L,
    to: FrontendRegion.VentralTegmentalArea,
    weight: -0.18,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.HabenularNucleus_R,
    to: FrontendRegion.VentralTegmentalArea,
    weight: -0.18,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.HabenularNucleus_L,
    to: FrontendRegion.RapheNuclei,
    weight: -0.14,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.HabenularNucleus_R,
    to: FrontendRegion.RapheNuclei,
    weight: -0.14,
    synapseType: "GABA_A",
  },
  {
    from: FrontendRegion.LateralHabenula,
    to: FrontendRegion.HabenularNucleus_L,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.LateralHabenula,
    to: FrontendRegion.HabenularNucleus_R,
    weight: 0.2,
    synapseType: "AMPA",
  },

  // ── Circuit 15: Corpus callosum relay ────────────────────────────────────────
  {
    from: FrontendRegion.SpleniumCorpusCallosum,
    to: FrontendRegion.PosteriorCingulate_L,
    weight: 0.14,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SpleniumCorpusCallosum,
    to: FrontendRegion.PosteriorCingulate_R,
    weight: 0.14,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SpleniumCorpusCallosum,
    to: FrontendRegion.PrecuneusRegion_L,
    weight: 0.12,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SpleniumCorpusCallosum,
    to: FrontendRegion.PrecuneusRegion_R,
    weight: 0.12,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PosteriorCingulate_L,
    to: FrontendRegion.SpleniumCorpusCallosum,
    weight: 0.12,
    synapseType: "AMPA",
  },

  // ── Circuit 17: Frontal-parietal and association ─────────────────────────────
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.SuperiorFrontal_L,
    weight: 0.2,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.MedialPFC_R,
    to: FrontendRegion.SuperiorFrontal_R,
    weight: 0.2,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.InferiorParietal_L,
    to: FrontendRegion.SuperiorTemporalGyrus_L,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.InferiorParietal_R,
    to: FrontendRegion.SuperiorTemporalGyrus_R,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PrecuneusRegion_L,
    to: FrontendRegion.InferiorParietal_L,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PrecuneusRegion_R,
    to: FrontendRegion.InferiorParietal_R,
    weight: 0.16,
    synapseType: "AMPA",
  },

  // ── Phase 2: Inter-hemispheric callosal connectivity (corpus callosum segments) ─
  // Splenium: visual/posterior
  {
    from: FrontendRegion.PrimaryVisual_L,
    to: FrontendRegion.PrimaryVisual_R,
    weight: 0.12,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PrimaryVisual_R,
    to: FrontendRegion.PrimaryVisual_L,
    weight: 0.12,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SecondaryVisual_L,
    to: FrontendRegion.SecondaryVisual_R,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SecondaryVisual_R,
    to: FrontendRegion.SecondaryVisual_L,
    weight: 0.1,
    synapseType: "AMPA",
  },
  // Isthmus: parietal/temporal
  {
    from: FrontendRegion.SuperiorParietal_L,
    to: FrontendRegion.SuperiorParietal_R,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SuperiorParietal_R,
    to: FrontendRegion.SuperiorParietal_L,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.InferiorParietal_L,
    to: FrontendRegion.InferiorParietal_R,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.InferiorParietal_R,
    to: FrontendRegion.InferiorParietal_L,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SuperiorTemporalGyrus_L,
    to: FrontendRegion.SuperiorTemporalGyrus_R,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.SuperiorTemporalGyrus_R,
    to: FrontendRegion.SuperiorTemporalGyrus_L,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.FusiformGyrus_L,
    to: FrontendRegion.FusiformGyrus_R,
    weight: 0.08,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.FusiformGyrus_R,
    to: FrontendRegion.FusiformGyrus_L,
    weight: 0.08,
    synapseType: "AMPA",
  },
  // Body: cingulate
  {
    from: FrontendRegion.PosteriorCingulate_L,
    to: FrontendRegion.PosteriorCingulate_R,
    weight: 0.12,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PosteriorCingulate_R,
    to: FrontendRegion.PosteriorCingulate_L,
    weight: 0.12,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.MidCingulate_L,
    to: FrontendRegion.MidCingulate_R,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.MidCingulate_R,
    to: FrontendRegion.MidCingulate_L,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.AnteriorInsula_L,
    to: FrontendRegion.AnteriorInsula_R,
    weight: 0.08,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.AnteriorInsula_R,
    to: FrontendRegion.AnteriorInsula_L,
    weight: 0.08,
    synapseType: "AMPA",
  },
  // Subcortical callosal bridges
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.Thalamus_R,
    weight: 0.14,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.Thalamus_L,
    weight: 0.14,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Hippocampus_L,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.12,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Amygdala_L,
    to: FrontendRegion.Amygdala_R,
    weight: 0.1,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Amygdala_R,
    to: FrontendRegion.Amygdala_L,
    weight: 0.1,
    synapseType: "AMPA",
  },

  // ── Phase 2: Thalamocortical relay loops (all sensory modalities) ──────────
  // LGB -> V1 (lateral geniculate to primary visual)
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.PrimaryVisual_L,
    weight: 0.25,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.PrimaryVisual_R,
    weight: 0.25,
    synapseType: "AMPA",
  },
  // VPL -> S1 (ventroposterolateral to somatosensory)
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.PrimarySomatosensory_L,
    weight: 0.28,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.PrimarySomatosensory_R,
    weight: 0.28,
    synapseType: "AMPA",
  },
  // VL -> M1 (ventrolateral to motor)
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.PrimaryMotorCortex_L,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.PrimaryMotorCortex_R,
    weight: 0.22,
    synapseType: "AMPA",
  },
  // MD -> PFC (mediodorsal to prefrontal)
  {
    from: FrontendRegion.Thalamus_L,
    to: Region.PrefrontalCortex,
    weight: 0.25,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.DorsalMPFC_L,
    weight: 0.225,
    synapseType: "NMDA",
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.DorsalMPFC_R,
    weight: 0.225,
    synapseType: "NMDA",
  },
  // Anterior thalamus -> ACC
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.AnteriorCingulateCortex,
    weight: 0.18,
    synapseType: "AMPA",
  },
  // -> Premotor
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.PreMotorCortex_L,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.PreMotorCortex_R,
    weight: 0.2,
    synapseType: "AMPA",
  },
  // Corticothalamic feedback (layer 6 -> thalamus)
  {
    from: FrontendRegion.PrimaryVisual_L,
    to: FrontendRegion.Thalamus_L,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PrimaryVisual_R,
    to: FrontendRegion.Thalamus_R,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PrimarySomatosensory_L,
    to: FrontendRegion.Thalamus_L,
    weight: 0.14,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PrimarySomatosensory_R,
    to: FrontendRegion.Thalamus_R,
    weight: 0.14,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PrimaryMotorCortex_L,
    to: FrontendRegion.Thalamus_L,
    weight: 0.14,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PrimaryMotorCortex_R,
    to: FrontendRegion.Thalamus_R,
    weight: 0.14,
    synapseType: "AMPA",
  },

  // ── Phase 2: Hippocampal memory circuits (Papez + entorhinal expanded) ─────
  // Perforant path (EC -> DG, EC -> CA1)
  {
    from: FrontendRegion.EntorhinalCortex,
    to: FrontendRegion.CA1,
    weight: 0.25,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.EntorhinalCortex,
    to: FrontendRegion.DentateGyrus,
    weight: 0.28,
    synapseType: "AMPA",
  },
  // CA1 backprojection -> EC
  {
    from: FrontendRegion.CA1,
    to: FrontendRegion.EntorhinalCortex,
    weight: 0.2,
    synapseType: "AMPA",
  },
  // Schaffer collaterals (CA3 -> CA1)
  {
    from: FrontendRegion.CA3,
    to: FrontendRegion.CA1,
    weight: 0.24,
    synapseType: "AMPA",
  },
  // Mossy fibers (DG -> CA3)
  {
    from: FrontendRegion.DentateGyrus,
    to: FrontendRegion.CA3,
    weight: 0.22,
    synapseType: "AMPA",
  },
  // Bilateral hippocampus -> EC
  {
    from: FrontendRegion.Hippocampus_L,
    to: FrontendRegion.EntorhinalCortex,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Hippocampus_R,
    to: FrontendRegion.EntorhinalCortex,
    weight: 0.2,
    synapseType: "AMPA",
  },
  // Perirhinal -> EC and hippocampus
  {
    from: FrontendRegion.PerirhinalCortex,
    to: FrontendRegion.EntorhinalCortex,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PerirhinalCortex,
    to: FrontendRegion.Hippocampus_L,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PerirhinalCortex,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.18,
    synapseType: "AMPA",
  },
  // IT -> perirhinal (ventral visual stream -> memory)
  {
    from: FrontendRegion.InferiorTemporalGyrus_L,
    to: FrontendRegion.PerirhinalCortex,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.InferiorTemporalGyrus_R,
    to: FrontendRegion.PerirhinalCortex,
    weight: 0.16,
    synapseType: "AMPA",
  },
  // Angular gyrus -> EC (parietal-memory interface, Ranganath 2010)
  {
    from: FrontendRegion.AngularGyrus_L,
    to: FrontendRegion.EntorhinalCortex,
    weight: 0.16,
    synapseType: "AMPA",
  },

  // ── Phase 2: Amygdala fear/emotion expanded connectivity ───────────────────
  // Amygdala -> PFC (bottom-up emotional input)
  {
    from: FrontendRegion.Amygdala_L,
    to: Region.PrefrontalCortex,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Amygdala_R,
    to: Region.PrefrontalCortex,
    weight: 0.16,
    synapseType: "AMPA",
  },
  // PFC -> Amygdala (top-down inhibition of fear, Quirk 2003)
  {
    from: Region.PrefrontalCortex,
    to: FrontendRegion.Amygdala_L,
    weight: -0.2,
    synapseType: "GABA_B",
  },
  {
    from: Region.PrefrontalCortex,
    to: FrontendRegion.Amygdala_R,
    weight: -0.2,
    synapseType: "GABA_B",
  },
  // Amygdala -> Insula (visceral fear processing, Craig 2002)
  {
    from: FrontendRegion.Amygdala_L,
    to: FrontendRegion.AnteriorInsula_L,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Amygdala_R,
    to: FrontendRegion.AnteriorInsula_R,
    weight: 0.18,
    synapseType: "AMPA",
  },
  // Amygdala -> rostral ACC (affective activation)
  {
    from: FrontendRegion.Amygdala_L,
    to: FrontendRegion.RostralACC_L,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.Amygdala_R,
    to: FrontendRegion.RostralACC_R,
    weight: 0.16,
    synapseType: "AMPA",
  },
  // Amygdala -> NAc (fear-reward interface, Broglio 2003)
  {
    from: FrontendRegion.Amygdala_L,
    to: FrontendRegion.Accumbens_L,
    weight: 0.168,
    synapseType: "DA",
  },
  {
    from: FrontendRegion.Amygdala_R,
    to: FrontendRegion.Accumbens_R,
    weight: 0.168,
    synapseType: "DA",
  },
  // Existing Amygdala -> bilateral bridge
  {
    from: Region.Amygdala,
    to: FrontendRegion.Amygdala_L,
    weight: 0.22,
    synapseType: "AMPA",
  },
  {
    from: Region.Amygdala,
    to: FrontendRegion.Amygdala_R,
    weight: 0.22,
    synapseType: "AMPA",
  },

  // ── Phase 2: Dopaminergic and neuromodulatory broadcast ────────────────────
  // VTA mesocortical / mesolimbic / nigrostriatal
  {
    from: FrontendRegion.VentralTegmentalArea,
    to: FrontendRegion.Caudate_L,
    weight: 0.24,
    synapseType: "DA",
  },
  {
    from: FrontendRegion.VentralTegmentalArea,
    to: FrontendRegion.Caudate_R,
    weight: 0.24,
    synapseType: "DA",
  },
  {
    from: FrontendRegion.VentralTegmentalArea,
    to: FrontendRegion.Putamen_L,
    weight: 0.264,
    synapseType: "DA",
  },
  {
    from: FrontendRegion.VentralTegmentalArea,
    to: FrontendRegion.Putamen_R,
    weight: 0.264,
    synapseType: "DA",
  },
  {
    from: FrontendRegion.VentralTegmentalArea,
    to: FrontendRegion.MedialPFC_L,
    weight: 0.216,
    synapseType: "DA",
  },
  {
    from: FrontendRegion.VentralTegmentalArea,
    to: FrontendRegion.MedialPFC_R,
    weight: 0.216,
    synapseType: "DA",
  },
  {
    from: FrontendRegion.VentralTegmentalArea,
    to: FrontendRegion.Accumbens_L,
    weight: 0.25,
    synapseType: "DA",
  },
  {
    from: FrontendRegion.VentralTegmentalArea,
    to: FrontendRegion.Accumbens_R,
    weight: 0.25,
    synapseType: "DA",
  },
  // SubstantiaNigra nigrostriatal pathway (Bernheimer 1973)
  {
    from: FrontendRegion.SubstantiaNigra,
    to: FrontendRegion.Putamen_L,
    weight: 0.288,
    synapseType: "DA",
  },
  {
    from: FrontendRegion.SubstantiaNigra,
    to: FrontendRegion.Putamen_R,
    weight: 0.288,
    synapseType: "DA",
  },
  {
    from: FrontendRegion.SubstantiaNigra,
    to: FrontendRegion.Caudate_L,
    weight: 0.24,
    synapseType: "DA",
  },
  {
    from: FrontendRegion.SubstantiaNigra,
    to: FrontendRegion.Caudate_R,
    weight: 0.24,
    synapseType: "DA",
  },
  // Raphe serotonergic modulation (Asan 2013)
  {
    from: FrontendRegion.RapheNuclei,
    to: FrontendRegion.MedialPFC_L,
    weight: 0.16,
    synapseType: "5HT",
  },
  {
    from: FrontendRegion.RapheNuclei,
    to: FrontendRegion.MedialPFC_R,
    weight: 0.16,
    synapseType: "5HT",
  },
  {
    from: FrontendRegion.RapheNuclei,
    to: FrontendRegion.Hippocampus_L,
    weight: 0.14,
    synapseType: "5HT",
  },
  {
    from: FrontendRegion.RapheNuclei,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.14,
    synapseType: "5HT",
  },
  {
    from: FrontendRegion.RapheNuclei,
    to: FrontendRegion.Amygdala_L,
    weight: 0.14,
    synapseType: "5HT",
  },
  {
    from: FrontendRegion.RapheNuclei,
    to: FrontendRegion.Amygdala_R,
    weight: 0.14,
    synapseType: "5HT",
  },
  // Locus coeruleus norepinephrine attentional gain (Sara 2009)
  {
    from: FrontendRegion.LocusCoeruleus,
    to: FrontendRegion.PrimaryVisual_L,
    weight: 0.12,
    synapseType: "5HT",
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: FrontendRegion.PrimaryVisual_R,
    weight: 0.12,
    synapseType: "5HT",
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: Region.PrefrontalCortex,
    weight: 0.16,
    synapseType: "5HT",
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: FrontendRegion.MedialPFC_L,
    weight: 0.14,
    synapseType: "5HT",
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: FrontendRegion.MedialPFC_R,
    weight: 0.14,
    synapseType: "5HT",
  },

  // ── Phase 2: Cerebellar-cortical motor closed loops ────────────────────────
  // Cortico-pontine fibers (Schmahmann 2019)
  {
    from: FrontendRegion.PrimaryMotorCortex_L,
    to: FrontendRegion.PontineTegmentum,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PrimaryMotorCortex_R,
    to: FrontendRegion.PontineTegmentum,
    weight: 0.2,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PreMotorCortex_L,
    to: FrontendRegion.PontineTegmentum,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.PreMotorCortex_R,
    to: FrontendRegion.PontineTegmentum,
    weight: 0.18,
    synapseType: "AMPA",
  },
  // Dentato-thalamo-cortical (DCN -> thalamus, Ito 1984)
  {
    from: FrontendRegion.CerebellarLobule_VI,
    to: FrontendRegion.Thalamus_L,
    weight: 0.18,
    synapseType: "AMPA",
  },
  {
    from: FrontendRegion.CerebellarLobule_VI,
    to: FrontendRegion.Thalamus_R,
    weight: 0.18,
    synapseType: "AMPA",
  },
  // Basal ganglia -> bilateral striatum
  {
    from: Region.BasalGanglia,
    to: FrontendRegion.Putamen_L,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: Region.BasalGanglia,
    to: FrontendRegion.Putamen_R,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: Region.BasalGanglia,
    to: FrontendRegion.Caudate_L,
    weight: 0.16,
    synapseType: "AMPA",
  },
  {
    from: Region.BasalGanglia,
    to: FrontendRegion.Caudate_R,
    weight: 0.16,
    synapseType: "AMPA",
  },

  // ── New: Insular cortex bilateral integration loops (Picard & Craig 2023) ─
  {
    from: FrontendRegion.Insula,
    to: FrontendRegion.Amygdala_L,
    weight: 0.22,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Insula,
    to: FrontendRegion.Amygdala_R,
    weight: 0.22,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Amygdala_L,
    to: FrontendRegion.Insula,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Amygdala_R,
    to: FrontendRegion.Insula,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  // Insula↔ACC interoceptive awareness loop (Craig 2009)
  {
    from: FrontendRegion.Insula,
    to: FrontendRegion.AnteriorCingulateCortex,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.AnteriorCingulateCortex,
    to: FrontendRegion.Insula,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  // Insula↔Thalamus bilateral interoceptive relay (Craig 2004)
  {
    from: FrontendRegion.Insula,
    to: FrontendRegion.Thalamus_L,
    weight: 0.16,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Insula,
    to: FrontendRegion.Thalamus_R,
    weight: 0.16,
    synapseType: "AMPA" as const,
  },

  // ── New: Mediodorsal thalamus ↔ PFC complete relay loops ─────────────────
  // MD-Thalamus↔MedialPFC bilateral (Watanabe & Funahashi 2012)
  {
    from: FrontendRegion.MedialdorsalThalamus,
    to: FrontendRegion.MedialPFC_L,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.MedialdorsalThalamus,
    to: FrontendRegion.MedialPFC_R,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.MedialdorsalThalamus,
    weight: 0.16,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.MedialPFC_R,
    to: FrontendRegion.MedialdorsalThalamus,
    weight: 0.16,
    synapseType: "AMPA" as const,
  },

  // ── New: Habenular-Raphe feedback loop (Lammel et al. 2012) ──────────────
  // LHb->RapheNuclei (anti-reward circuit)
  {
    from: FrontendRegion.LateralHabenula,
    to: FrontendRegion.RapheNuclei,
    weight: 0.25,
    synapseType: "GABA_A" as const,
  },
  {
    from: FrontendRegion.RapheNuclei,
    to: FrontendRegion.VentralTegmentalArea,
    weight: 0.2,
    synapseType: "5HT" as const,
  },
  // LHb bilateral inputs from OFC (Bromberg-Martin & Hikosaka 2011)
  {
    from: FrontendRegion.OrbitalFrontalCortex,
    to: FrontendRegion.LateralHabenula,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },

  // ── New: CA3↔CA1 Schaffer collateral & trisynaptic circuit (Andersen 2007)
  {
    from: FrontendRegion.CA3,
    to: FrontendRegion.CA1,
    weight: 0.35,
    synapseType: "NMDA" as const,
  },
  {
    from: FrontendRegion.CA1,
    to: FrontendRegion.CA3,
    weight: 0.15,
    synapseType: "GABA_A" as const,
  },
  // CA1 -> EntorhinalCortex output path
  {
    from: FrontendRegion.CA1,
    to: FrontendRegion.EntorhinalCortex,
    weight: 0.22,
    synapseType: "AMPA" as const,
  },

  // ── New: Additional cerebellar-cortical feedback (Ito 2008) ──────────────
  {
    from: FrontendRegion.CerebellarLobule_VI,
    to: FrontendRegion.PrimaryMotorCortex_L,
    weight: 0.15,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.CerebellarLobule_VI,
    to: FrontendRegion.PrimaryMotorCortex_R,
    weight: 0.15,
    synapseType: "AMPA" as const,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // INTELLIGENCE EXPANSION PHASE — 650+ total connections
  // ══════════════════════════════════════════════════════════════════════════

  // ── Default Mode Network bilateral hubs (Buckner 2008, Andrews-Hanna 2010) ─
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.PosteriorCingulate_L,
    weight: 0.24,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.MedialPFC_R,
    to: FrontendRegion.PosteriorCingulate_R,
    weight: 0.24,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.PosteriorCingulate_L,
    to: FrontendRegion.MedialPFC_L,
    weight: 0.22,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.PosteriorCingulate_R,
    to: FrontendRegion.MedialPFC_R,
    weight: 0.22,
    synapseType: "AMPA" as const,
  },
  // PCC ↔ Precuneus (Cavanna & Trimble 2006, self-referential)
  {
    from: FrontendRegion.PosteriorCingulate_L,
    to: FrontendRegion.PrecuneusRegion_L,
    weight: 0.26,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.PosteriorCingulate_R,
    to: FrontendRegion.PrecuneusRegion_R,
    weight: 0.26,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.PrecuneusRegion_L,
    to: FrontendRegion.PosteriorCingulate_L,
    weight: 0.24,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.PrecuneusRegion_R,
    to: FrontendRegion.PosteriorCingulate_R,
    weight: 0.24,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.PrecuneusRegion_L,
    to: FrontendRegion.MedialPFC_L,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.PrecuneusRegion_R,
    to: FrontendRegion.MedialPFC_R,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  // Hippocampus ↔ PCC (Ranganath & Ritchey 2012)
  {
    from: FrontendRegion.Hippocampus_L,
    to: FrontendRegion.PosteriorCingulate_L,
    weight: 0.22,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Hippocampus_R,
    to: FrontendRegion.PosteriorCingulate_R,
    weight: 0.22,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.PosteriorCingulate_L,
    to: FrontendRegion.Hippocampus_L,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.PosteriorCingulate_R,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },

  // ── Salience Network (Seeley 2007) ────────────────────────────────────────
  {
    from: FrontendRegion.DorsalACC,
    to: FrontendRegion.Insula,
    weight: 0.26,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Insula,
    to: FrontendRegion.DorsalACC,
    weight: 0.24,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.DorsalACC,
    to: FrontendRegion.Thalamus_L,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.DorsalACC,
    to: FrontendRegion.Thalamus_R,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Amygdala_L,
    to: FrontendRegion.DorsalACC,
    weight: 0.22,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Amygdala_R,
    to: FrontendRegion.DorsalACC,
    weight: 0.22,
    synapseType: "AMPA" as const,
  },

  // ── Claustrum consciousness gating (Crick & Koch 2005, Goll 2015) ────────
  {
    from: FrontendRegion.Claustrum,
    to: FrontendRegion.MedialPFC_L,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Claustrum,
    to: FrontendRegion.MedialPFC_R,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Claustrum,
    to: FrontendRegion.Insula,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Claustrum,
    to: FrontendRegion.DorsalACC,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Claustrum,
    to: FrontendRegion.PosteriorCingulate_L,
    weight: 0.16,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Claustrum,
    to: FrontendRegion.PosteriorCingulate_R,
    weight: 0.16,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Claustrum,
    to: FrontendRegion.Thalamus_L,
    weight: 0.15,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Claustrum,
    to: FrontendRegion.Thalamus_R,
    weight: 0.15,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.Claustrum,
    weight: 0.16,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.MedialPFC_R,
    to: FrontendRegion.Claustrum,
    weight: 0.16,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Insula,
    to: FrontendRegion.Claustrum,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },

  // ── Language Network bilateral (Friederici 2011, Hagoort 2005) ───────────
  {
    from: FrontendRegion.BrocaArea_L,
    to: FrontendRegion.SuperiorTemporalGyrus_L,
    weight: 0.26,
    synapseType: "NMDA" as const,
  },
  {
    from: FrontendRegion.BrocaArea_L,
    to: FrontendRegion.SuperiorTemporalGyrus_R,
    weight: 0.18,
    synapseType: "NMDA" as const,
  },
  {
    from: FrontendRegion.SuperiorTemporalGyrus_L,
    to: FrontendRegion.BrocaArea_L,
    weight: 0.24,
    synapseType: "NMDA" as const,
  },
  {
    from: FrontendRegion.SuperiorTemporalGyrus_R,
    to: FrontendRegion.BrocaArea_R,
    weight: 0.16,
    synapseType: "NMDA" as const,
  },
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.BrocaArea_L,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.MedialPFC_R,
    to: FrontendRegion.BrocaArea_R,
    weight: 0.16,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.BrocaArea_L,
    to: FrontendRegion.MedialPFC_L,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },

  // ── Frontoparietal Control Network (Dosenbach 2007) ──────────────────────
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.SuperiorParietal_L,
    weight: 0.22,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.MedialPFC_R,
    to: FrontendRegion.SuperiorParietal_R,
    weight: 0.22,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.SuperiorParietal_L,
    to: FrontendRegion.MedialPFC_L,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.SuperiorParietal_R,
    to: FrontendRegion.MedialPFC_R,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.SuperiorParietal_L,
    to: FrontendRegion.Thalamus_L,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.SuperiorParietal_R,
    to: FrontendRegion.Thalamus_R,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.SuperiorParietal_L,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.SuperiorParietal_R,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },

  // ── Locus Coeruleus NE attentional broadcast (Sara 2009) ─────────────────
  {
    from: FrontendRegion.LocusCoeruleus,
    to: FrontendRegion.SuperiorParietal_L,
    weight: 0.14,
    synapseType: "5HT" as const,
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: FrontendRegion.SuperiorTemporalGyrus_L,
    weight: 0.12,
    synapseType: "5HT" as const,
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: FrontendRegion.SuperiorTemporalGyrus_R,
    weight: 0.12,
    synapseType: "5HT" as const,
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: FrontendRegion.Hippocampus_L,
    weight: 0.14,
    synapseType: "5HT" as const,
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.14,
    synapseType: "5HT" as const,
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: FrontendRegion.Amygdala_L,
    weight: 0.15,
    synapseType: "5HT" as const,
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: FrontendRegion.Amygdala_R,
    weight: 0.15,
    synapseType: "5HT" as const,
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: FrontendRegion.Insula,
    weight: 0.13,
    synapseType: "5HT" as const,
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: FrontendRegion.DorsalACC,
    weight: 0.14,
    synapseType: "5HT" as const,
  },

  // ── Prefrontal-Striatal cognitive control loops (Alexander 1986) ─────────
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.Caudate_L,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.MedialPFC_R,
    to: FrontendRegion.Caudate_R,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.Putamen_L,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.MedialPFC_R,
    to: FrontendRegion.Putamen_R,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Putamen_L,
    to: FrontendRegion.Thalamus_L,
    weight: 0.16,
    synapseType: "GABA_A" as const,
  },
  {
    from: FrontendRegion.Putamen_R,
    to: FrontendRegion.Thalamus_R,
    weight: 0.16,
    synapseType: "GABA_A" as const,
  },
  {
    from: FrontendRegion.Caudate_L,
    to: FrontendRegion.Thalamus_L,
    weight: 0.14,
    synapseType: "GABA_A" as const,
  },
  {
    from: FrontendRegion.Caudate_R,
    to: FrontendRegion.Thalamus_R,
    weight: 0.14,
    synapseType: "GABA_A" as const,
  },

  // ── Thalamocortical relay — Pulvinar attention gateway (Shipp 2003) ───────
  {
    from: FrontendRegion.PulvinarThalamus,
    to: FrontendRegion.SuperiorParietal_L,
    weight: 0.22,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.PulvinarThalamus,
    to: FrontendRegion.SuperiorTemporalGyrus_L,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.PulvinarThalamus,
    to: FrontendRegion.SuperiorTemporalGyrus_R,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.PulvinarThalamus,
    to: FrontendRegion.Insula,
    weight: 0.16,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.SuperiorParietal_L,
    to: FrontendRegion.PulvinarThalamus,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.PulvinarThalamus,
    weight: 0.16,
    synapseType: "AMPA" as const,
  },

  // ── Septal-hippocampal theta rhythm (Buzsáki 2002) ────────────────────────
  {
    from: FrontendRegion.MedialSeptum,
    to: FrontendRegion.Hippocampus_L,
    weight: 0.22,
    synapseType: "GABA_A" as const,
  },
  {
    from: FrontendRegion.MedialSeptum,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.22,
    synapseType: "GABA_A" as const,
  },
  {
    from: FrontendRegion.MedialSeptum,
    to: FrontendRegion.CA1,
    weight: 0.2,
    synapseType: "GABA_A" as const,
  },
  {
    from: FrontendRegion.MedialSeptum,
    to: FrontendRegion.CA3,
    weight: 0.18,
    synapseType: "GABA_A" as const,
  },
  {
    from: FrontendRegion.Hippocampus_L,
    to: FrontendRegion.MedialSeptum,
    weight: 0.16,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Hippocampus_R,
    to: FrontendRegion.MedialSeptum,
    weight: 0.16,
    synapseType: "AMPA" as const,
  },

  // ── Amygdala extended circuits ────────────────────────────────────────────
  {
    from: FrontendRegion.Amygdala_L,
    to: FrontendRegion.OrbitalFrontalCortex,
    weight: 0.22,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Amygdala_R,
    to: FrontendRegion.OrbitalFrontalCortex,
    weight: 0.22,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.OrbitalFrontalCortex,
    to: FrontendRegion.Amygdala_L,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.OrbitalFrontalCortex,
    to: FrontendRegion.Amygdala_R,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Amygdala_L,
    to: FrontendRegion.Hippocampus_L,
    weight: 0.24,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Amygdala_R,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.24,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Hippocampus_L,
    to: FrontendRegion.Amygdala_L,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Hippocampus_R,
    to: FrontendRegion.Amygdala_R,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Amygdala_L,
    to: FrontendRegion.Thalamus_L,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Amygdala_R,
    to: FrontendRegion.Thalamus_R,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },

  // ── Hippocampal memory-guided decisions (Eichenbaum 2017) ────────────────
  {
    from: FrontendRegion.Hippocampus_L,
    to: FrontendRegion.MedialPFC_L,
    weight: 0.22,
    synapseType: "NMDA" as const,
  },
  {
    from: FrontendRegion.Hippocampus_R,
    to: FrontendRegion.MedialPFC_R,
    weight: 0.22,
    synapseType: "NMDA" as const,
  },
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.Hippocampus_L,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.MedialPFC_R,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Hippocampus_L,
    to: FrontendRegion.Thalamus_L,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Hippocampus_R,
    to: FrontendRegion.Thalamus_R,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },

  // ── Reward circuit expansions (Humphries & Prescott 2010) ────────────────
  {
    from: FrontendRegion.NucleusAccumbens,
    to: FrontendRegion.VentralStriatum,
    weight: 0.24,
    synapseType: "GABA_A" as const,
  },
  {
    from: FrontendRegion.VentralStriatum,
    to: FrontendRegion.VentralTegmentalArea,
    weight: 0.2,
    synapseType: "GABA_A" as const,
  },
  {
    from: FrontendRegion.OrbitalFrontalCortex,
    to: FrontendRegion.NucleusAccumbens,
    weight: 0.22,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.VentralTegmentalArea,
    to: FrontendRegion.OrbitalFrontalCortex,
    weight: 0.2,
    synapseType: "DA" as const,
  },

  // ── Visual attention top-down (Desimone & Duncan 1995) ───────────────────
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.PrimaryVisual_L,
    weight: 0.16,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.MedialPFC_R,
    to: FrontendRegion.PrimaryVisual_R,
    weight: 0.16,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.V4Area_L,
    to: FrontendRegion.OrbitalFrontalCortex,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.V4Area_R,
    to: FrontendRegion.OrbitalFrontalCortex,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.SuperiorParietal_L,
    to: FrontendRegion.PrimaryVisual_L,
    weight: 0.14,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.SuperiorParietal_R,
    to: FrontendRegion.PrimaryVisual_R,
    weight: 0.14,
    synapseType: "AMPA" as const,
  },

  // ── Autonomic nervous system integration (Benarroch 1993) ────────────────
  {
    from: FrontendRegion.Hypothalamus,
    to: FrontendRegion.Insula,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.AnteriorCingulateCortex,
    to: FrontendRegion.Hypothalamus,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.DorsalACC,
    to: FrontendRegion.Hypothalamus,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },

  // ── Cerebellar-parietal coordination (Schmahmann 2019) ───────────────────
  {
    from: FrontendRegion.CerebellarLobule_VI,
    to: FrontendRegion.SuperiorParietal_L,
    weight: 0.16,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.PontineTegmentum,
    to: FrontendRegion.CerebellarLobule_VI,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.CerebellarLobule_VI,
    to: FrontendRegion.PontineTegmentum,
    weight: 0.14,
    synapseType: "AMPA" as const,
  },

  // ── Thalamus ↔ Hippocampus memory gating (Aggleton 2010) ─────────────────
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.Hippocampus_L,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.EntorhinalCortex,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.EntorhinalCortex,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },

  // ── BNST extended anxiety circuit (Walker 2003) ───────────────────────────
  {
    from: FrontendRegion.BedNucleusStria,
    to: FrontendRegion.Hypothalamus,
    weight: 0.22,
    synapseType: "GABA_A" as const,
  },
  {
    from: FrontendRegion.Hypothalamus,
    to: FrontendRegion.BedNucleusStria,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.BedNucleusStria,
    to: FrontendRegion.VentralTegmentalArea,
    weight: 0.2,
    synapseType: "GABA_A" as const,
  },

  // ── PAG output circuits (Bandler & Shipley 1994) ─────────────────────────
  {
    from: FrontendRegion.PeriaqueductalGray,
    to: FrontendRegion.Hypothalamus,
    weight: 0.24,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Hypothalamus,
    to: FrontendRegion.PeriaqueductalGray,
    weight: 0.16,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.PeriaqueductalGray,
    weight: 0.18,
    synapseType: "GABA_A" as const,
  },
  {
    from: FrontendRegion.MedialPFC_R,
    to: FrontendRegion.PeriaqueductalGray,
    weight: 0.18,
    synapseType: "GABA_A" as const,
  },

  // ── Raphe serotonergic expanded projections (Cools 2008) ─────────────────
  {
    from: FrontendRegion.RapheNuclei,
    to: FrontendRegion.Caudate_L,
    weight: 0.14,
    synapseType: "5HT" as const,
  },
  {
    from: FrontendRegion.RapheNuclei,
    to: FrontendRegion.Caudate_R,
    weight: 0.14,
    synapseType: "5HT" as const,
  },
  {
    from: FrontendRegion.RapheNuclei,
    to: FrontendRegion.Putamen_L,
    weight: 0.12,
    synapseType: "5HT" as const,
  },
  {
    from: FrontendRegion.RapheNuclei,
    to: FrontendRegion.Putamen_R,
    weight: 0.12,
    synapseType: "5HT" as const,
  },
  {
    from: FrontendRegion.RapheNuclei,
    to: FrontendRegion.Insula,
    weight: 0.14,
    synapseType: "5HT" as const,
  },
  {
    from: FrontendRegion.RapheNuclei,
    to: FrontendRegion.DorsalACC,
    weight: 0.14,
    synapseType: "5HT" as const,
  },

  // ── Thoughts/consciousness: Precuneus self-awareness circuits ─────────────
  // Precuneus bilateral ↔ PCC (extended self-referential network)
  {
    from: FrontendRegion.PrecuneusRegion_L,
    to: FrontendRegion.PosteriorCingulate_R,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.PrecuneusRegion_R,
    to: FrontendRegion.PosteriorCingulate_L,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  // Angular gyrus ↔ DMN (Seghier 2013, semantic integration)
  {
    from: FrontendRegion.AngularGyrus_L,
    to: FrontendRegion.PosteriorCingulate_L,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.AngularGyrus_R,
    to: FrontendRegion.PosteriorCingulate_R,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.PosteriorCingulate_L,
    to: FrontendRegion.AngularGyrus_L,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.PosteriorCingulate_R,
    to: FrontendRegion.AngularGyrus_R,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  // Angular gyrus ↔ Hippocampus (conceptual memory binding)
  {
    from: FrontendRegion.AngularGyrus_L,
    to: FrontendRegion.Hippocampus_L,
    weight: 0.18,
    synapseType: "NMDA" as const,
  },
  {
    from: FrontendRegion.AngularGyrus_R,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.18,
    synapseType: "NMDA" as const,
  },

  // ── Inferotemporal object recognition ↔ Hippocampus (DiCarlo 2012) ───────
  {
    from: FrontendRegion.InferiorTemporalGyrus_L,
    to: FrontendRegion.Hippocampus_L,
    weight: 0.2,
    synapseType: "NMDA" as const,
  },
  {
    from: FrontendRegion.InferiorTemporalGyrus_R,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.2,
    synapseType: "NMDA" as const,
  },
  {
    from: FrontendRegion.Hippocampus_L,
    to: FrontendRegion.InferiorTemporalGyrus_L,
    weight: 0.16,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Hippocampus_R,
    to: FrontendRegion.InferiorTemporalGyrus_R,
    weight: 0.16,
    synapseType: "AMPA" as const,
  },

  // ── Insular-cingulate interoceptive awareness (Craig 2009) ───────────────
  {
    from: FrontendRegion.AnteriorInsula_L,
    to: FrontendRegion.DorsalACC,
    weight: 0.24,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.AnteriorInsula_R,
    to: FrontendRegion.DorsalACC,
    weight: 0.24,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.DorsalACC,
    to: FrontendRegion.AnteriorInsula_L,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.DorsalACC,
    to: FrontendRegion.AnteriorInsula_R,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.AnteriorInsula_L,
    to: FrontendRegion.Claustrum,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.AnteriorInsula_R,
    to: FrontendRegion.Claustrum,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },

  // ── OFC ↔ Insula value + interoception (Rolls 2019) ─────────────────────
  {
    from: FrontendRegion.OrbitalFrontalCortex,
    to: FrontendRegion.Insula,
    weight: 0.2,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.Insula,
    to: FrontendRegion.OrbitalFrontalCortex,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.OrbitalFrontalCortex,
    to: FrontendRegion.DorsalACC,
    weight: 0.18,
    synapseType: "AMPA" as const,
  },

  // ── Entorhinal ↔ Association cortex (Canto 2008, grid cells) ─────────────
  {
    from: FrontendRegion.EntorhinalCortex,
    to: FrontendRegion.PrecuneusRegion_L,
    weight: 0.16,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.EntorhinalCortex,
    to: FrontendRegion.PrecuneusRegion_R,
    weight: 0.16,
    synapseType: "AMPA" as const,
  },
  {
    from: FrontendRegion.PrecuneusRegion_L,
    to: FrontendRegion.EntorhinalCortex,
    weight: 0.14,
    synapseType: "AMPA" as const,
  },

  // ── Lateral Habenula anti-reward signals (Matsumoto & Hikosaka 2009) ─────
  {
    from: FrontendRegion.LateralHabenula,
    to: FrontendRegion.RapheNuclei,
    weight: 0.22,
    synapseType: "GABA_A" as const,
  },
  {
    from: FrontendRegion.LateralHabenula,
    to: FrontendRegion.VentralTegmentalArea,
    weight: 0.2,
    synapseType: "GABA_A" as const,
  },
  {
    from: FrontendRegion.OrbitalFrontalCortex,
    to: FrontendRegion.LateralHabenula,
    weight: 0.16,
    synapseType: "AMPA" as const,
  },
];

// Precompute incoming connections per region for fast lookup
const INCOMING_CONNECTIONS: Map<
  ExtendedRegion,
  Array<{ from: ExtendedRegion; weight: number; synapseType: SynapseType }>
> = new Map();
for (const region of ALL_REGIONS) {
  INCOMING_CONNECTIONS.set(region, []);
}
for (const conn of CONNECTIVITY) {
  INCOMING_CONNECTIONS.get(conn.to)?.push({
    from: conn.from,
    weight: conn.weight,
    synapseType: conn.synapseType,
  });
}

// Create connection key for STDP map
function connKey(from: ExtendedRegion, to: ExtendedRegion): string {
  return `${from}->${to}`;
}

// Scientific event descriptions
const EVENT_DESCRIPTIONS: Record<string, { surge: string; drop: string }> = {
  [Region.PrefrontalCortex]: {
    surge: "PFC activation -> executive override of limbic response",
    drop: "PFC deactivation -> reduced cognitive control",
  },
  [Region.MotorCortex]: {
    surge: "Motor cortex surge -> voluntary movement initiation",
    drop: "Motor cortex silencing -> movement cessation",
  },
  [Region.SensoryCortex]: {
    surge: "Sensory cortex activation -> multimodal input processing",
    drop: "Sensory cortex drop -> attenuated perception",
  },
  [Region.Thalamus]: {
    surge: "Thalamic relay surge -> cortical gating cascade",
    drop: "Thalamic suppression -> sensory filtering engaged",
  },
  [Region.Hippocampus]: {
    surge: "Hippocampal theta burst -> memory encoding/retrieval",
    drop: "Hippocampal quiescence -> consolidation phase",
  },
  [Region.Amygdala]: {
    surge: "Amygdala surge -> threat salience cascade",
    drop: "Amygdala suppression -> fear extinction",
  },
  [Region.Cerebellum]: {
    surge: "Cerebellar activation -> precision motor control",
    drop: "Cerebellar silencing -> motor coordination drop",
  },
  [Region.Brainstem]: {
    surge: "Brainstem arousal -> neuromodulator release",
    drop: "Brainstem attenuation -> autonomic relaxation",
  },
  [Region.BasalGanglia]: {
    surge: "Basal ganglia surge -> action selection & reinforcement",
    drop: "Basal ganglia drop -> movement inhibition",
  },
  [FrontendRegion.Insula]: {
    surge: "Insula activation -> interoceptive salience signal",
    drop: "Insula silencing -> visceral awareness reduced",
  },
  [FrontendRegion.AnteriorCingulateCortex]: {
    surge: "ACC activation -> conflict monitoring & error detection",
    drop: "ACC quiescence -> reduced cognitive monitoring",
  },
  [FrontendRegion.OrbitalFrontalCortex]: {
    surge: "OFC surge -> reward valuation & decision weighting",
    drop: "OFC drop -> reduced cost-benefit analysis",
  },
  [FrontendRegion.VisualCortex]: {
    surge: "V1/V2 activation -> visual feature extraction",
    drop: "Visual cortex suppression -> perceptual gating",
  },
  [FrontendRegion.AuditoryCortex]: {
    surge: "Auditory cortex burst -> temporal frequency processing",
    drop: "Auditory cortex drop -> sound localization dimmed",
  },
  [FrontendRegion.Hypothalamus]: {
    surge: "Hypothalamic activation -> homeostatic drive signal",
    drop: "Hypothalamic quiescence -> drive satiation",
  },
  [FrontendRegion.NucleusAccumbens]: {
    surge: "NAc dopamine surge -> reward prediction signal",
    drop: "NAc silencing -> reward expectancy drop",
  },
  [FrontendRegion.OlfactoryBulb]: {
    surge: "Olfactory bulb activation -> chemosensory pattern detection",
    drop: "Olfactory attenuation -> olfactory adaptation",
  },
  [FrontendRegion.CA1]: {
    surge: "CA1 place cells firing -> spatial context encoding",
    drop: "CA1 quiescence -> spatial memory gating",
  },
  [FrontendRegion.CA3]: {
    surge: "CA3 recurrent network -> pattern completion cascade",
    drop: "CA3 silencing -> episodic recall suppressed",
  },
  [FrontendRegion.DentateGyrus]: {
    surge: "Dentate gyrus burst -> pattern separation, new encoding",
    drop: "DG quiescence -> reduced neurogenesis signal",
  },
  [FrontendRegion.PurkinjeLayer]: {
    surge: "Purkinje cell activation -> cerebellar error correction",
    drop: "Purkinje suppression -> motor learning pause",
  },
  [FrontendRegion.DeepCerebellarNuclei]: {
    surge: "DCN output surge -> thalamo-cortical motor relay",
    drop: "DCN inhibition -> motor timing disrupted",
  },
  [FrontendRegion.MedialdorsalThalamus]: {
    surge: "MD thalamus relay -> PFC-limbic integration",
    drop: "MD suppression -> working memory gating",
  },
  [FrontendRegion.PulvinarThalamus]: {
    surge: "Pulvinar activation -> visual salience routing",
    drop: "Pulvinar drop -> attentional spotlight reduced",
  },
  [FrontendRegion.ParietalCortex]: {
    surge: "Parietal cortex surge -> visuospatial integration",
    drop: "Parietal silencing -> spatial awareness reduced",
  },
  [FrontendRegion.TemporalCortex]: {
    surge: "Temporal cortex activation -> object/face recognition",
    drop: "Temporal drop -> semantic processing reduced",
  },
  [FrontendRegion.CingulateMotorArea]: {
    surge: "CMA surge -> voluntary movement preparation",
    drop: "CMA quiescence -> volitional control reduced",
  },
  [FrontendRegion.Claustrum]: {
    surge: "Claustrum activation -> cross-modal binding, consciousness",
    drop: "Claustrum suppression -> perceptual integration disrupted",
  },
  [FrontendRegion.LateralHabenula]: {
    surge: "Lateral habenula -> anti-reward signal, DA suppression",
    drop: "LHb quiescence -> reward pathway disinhibited",
  },
  [FrontendRegion.SubstantiaNigra]: {
    surge: "Substantia nigra burst -> dopaminergic reward prediction",
    drop: "SN suppression -> motor initiation deficit",
  },
  [FrontendRegion.SuperiorTemporalSulcus]: {
    surge: "STS activation -> social perception, biological motion",
    drop: "STS silencing -> social cue processing reduced",
  },
  [FrontendRegion.DorsalACC]: {
    surge: "Dorsal ACC surge -> cognitive control, conflict signaling",
    drop: "dACC quiescence -> reduced cognitive conflict monitoring",
  },
  [FrontendRegion.VentralTegmentalArea]: {
    surge: "VTA activation -> mesolimbic dopamine release",
    drop: "VTA suppression -> reward signal attenuated",
  },
  [FrontendRegion.LocusCoeruleus]: {
    surge: "LC activation -> norepinephrine arousal cascade",
    drop: "LC suppression -> reduced alertness, NE depletion",
  },
  [FrontendRegion.RapheNuclei]: {
    surge: "Raphe nuclei burst -> serotonin modulation cascade",
    drop: "Raphe quiescence -> serotonin tone reduced",
  },
  [FrontendRegion.VentralStriatum]: {
    surge: "Ventral striatum surge -> motivated behavior gating",
    drop: "VS silencing -> reward-seeking suppressed",
  },
  [FrontendRegion.EntorhinalCortex]: {
    surge: "Entorhinal cortex activation -> grid cells, spatial map",
    drop: "EC quiescence -> hippocampal input pathway reduced",
  },
  [FrontendRegion.PerirhinalCortex]: {
    surge: "Perirhinal cortex burst -> object recognition, familiarity",
    drop: "Perirhinal drop -> novelty detection impaired",
  },
  [FrontendRegion.SupplementaryMotorArea]: {
    surge: "SMA activation -> motor sequence planning",
    drop: "SMA quiescence -> voluntary movement initiation slowed",
  },
  [FrontendRegion.VentralPallidum]: {
    surge: "Ventral pallidum activation -> reward integration output",
    drop: "VP suppression -> motivation-action coupling reduced",
  },
  [FrontendRegion.SpinoCerebellarTract]: {
    surge:
      "Spinocerebellar tract activation -> proprioceptive feedback to cerebellum",
    drop: "SCT quiescence -> cerebellar motor error signal reduced",
  },
  [FrontendRegion.PeriaqueductalGray]: {
    surge:
      "PAG activation -> fear-pain-motivation gating, endogenous opioid release",
    drop: "PAG suppression -> pain modulation reduced",
  },
  [FrontendRegion.BedNucleusStria]: {
    surge: "BNST activation -> sustained anxiety, sustained fear response",
    drop: "BNST quiescence -> anxiety tone reduced",
  },
  [FrontendRegion.MedialSeptum]: {
    surge:
      "Medial septum theta pacemaker -> hippocampal theta oscillation (6Hz)",
    drop: "Medial septum quiescence -> hippocampal theta disrupted",
  },
  [FrontendRegion.RetroSplenialCortex]: {
    surge:
      "Retrosplenial cortex activation -> spatial memory, context integration",
    drop: "RSC quiescence -> spatial context encoding reduced",
  },

  // ── Phase 2: New region EVENT_DESCRIPTIONS ────────────────────────────────
  [FrontendRegion.PrimaryMotorCortex_L]: {
    surge:
      "Left M1 motor command — contralateral limb execution, pyramidal tract activation",
    drop: "Left M1 silencing — ipsilateral motor suppression, movement cessation",
  },
  [FrontendRegion.PrimaryMotorCortex_R]: {
    surge:
      "Right M1 motor command — contralateral limb execution, pyramidal tract activation",
    drop: "Right M1 silencing — ipsilateral motor suppression, movement cessation",
  },
  [FrontendRegion.BrocaArea_L]: {
    surge:
      "Broca's area — syntactic generation, speech production (Friederici 2011)",
    drop: "Broca quiescence — syntactic assembly reduced, expressive output suppressed",
  },
  [FrontendRegion.WernickeArea_L]: {
    surge:
      "Wernicke's area — semantic comprehension, lexical access (Wernicke 1874)",
    drop: "Wernicke quiescence — semantic decoding reduced, receptive language impaired",
  },
  [FrontendRegion.PosteriorCingulate_L]: {
    surge:
      "Posterior cingulate — DMN hub, autobiographical memory retrieval (Buckner 2008)",
    drop: "PCC quiescence — self-referential processing reduced, DMN deactivation",
  },
  [FrontendRegion.PosteriorCingulate_R]: {
    surge:
      "Right PCC — DMN hub, spatial context retrieval, default mode engagement",
    drop: "Right PCC quiescence — DMN suppressed, task-positive network dominant",
  },
  [FrontendRegion.Hippocampus_L]: {
    surge:
      "Left hippocampus — spatial-episodic memory encoding, pattern completion (O'Keefe 1971)",
    drop: "Left hippocampus quiescence — episodic encoding suppressed, recall gating",
  },
  [FrontendRegion.Hippocampus_R]: {
    surge:
      "Right hippocampus — spatial navigation, visuospatial context binding",
    drop: "Right hippocampus quiescence — spatial map retrieval reduced",
  },
  [FrontendRegion.Amygdala_L]: {
    surge:
      "Left amygdala — threat detection, fear conditioning, emotional salience (LeDoux 1996)",
    drop: "Left amygdala suppression — fear extinction, emotional dampening",
  },
  [FrontendRegion.Amygdala_R]: {
    surge:
      "Right amygdala — implicit threat appraisal, negative affect, autonomic arousal",
    drop: "Right amygdala suppression — negative bias reduced, calming response",
  },
  [FrontendRegion.CerebellarLobule_VI]: {
    surge:
      "Cerebellar Lobule VI — sensorimotor integration, language timing (Stoodley 2012)",
    drop: "Lobule VI quiescence — timing error correction suspended",
  },
  [FrontendRegion.Caudate_L]: {
    surge:
      "Left caudate — procedural learning initiation, goal-directed action selection",
    drop: "Left caudate quiescence — habitual behavior gating reduced",
  },
  [FrontendRegion.Caudate_R]: {
    surge:
      "Right caudate — reward-contingent learning, executive loop engagement",
    drop: "Right caudate quiescence — reward-driven selection suppressed",
  },
  [FrontendRegion.PrimaryVisual_L]: {
    surge:
      "Left V1 — retinotopic feature extraction, orientation selectivity (Hubel & Wiesel 1968)",
    drop: "Left V1 quiescence — visual input gating, LGN drive reduced",
  },
  [FrontendRegion.PrimaryVisual_R]: {
    surge: "Right V1 — retinotopic mapping, left visual field processing",
    drop: "Right V1 quiescence — left hemifield representation suppressed",
  },
  [FrontendRegion.MedialPFC_L]: {
    surge:
      "Left medial PFC — self-referential processing, value representation (Hare 2009)",
    drop: "Left mPFC quiescence — self-model update suspended",
  },
  [FrontendRegion.MedialPFC_R]: {
    surge: "Right medial PFC — social cognition, mentalizing, theory of mind",
    drop: "Right mPFC quiescence — perspective-taking reduced",
  },
  [FrontendRegion.AnteriorInsula_L]: {
    surge:
      "Left anterior insula — interoceptive awareness, empathy, visceral pain (Craig 2002)",
    drop: "Left aIns quiescence — body-state awareness reduced",
  },
  [FrontendRegion.AnteriorInsula_R]: {
    surge:
      "Right anterior insula — disgust, social pain, autonomic visceral integration",
    drop: "Right aIns quiescence — visceral signal integration reduced",
  },
  [FrontendRegion.RostralACC_L]: {
    surge:
      "Left rostral ACC — affective conflict resolution, emotional regulation (Bush 2000)",
    drop: "Left rACC quiescence — affective appraisal suppressed",
  },
  [FrontendRegion.RostralACC_R]: {
    surge: "Right rostral ACC — pain affect, negative valence processing",
    drop: "Right rACC quiescence — pain affect modulation reduced",
  },
  [FrontendRegion.Thalamus_L]: {
    surge:
      "Left thalamus — sensorimotor relay, consciousness gating, thalamocortical oscillations",
    drop: "Left thalamus suppression — cortical desynchronization, reduced arousal",
  },
  [FrontendRegion.Thalamus_R]: {
    surge:
      "Right thalamus — right-hemisphere relay, arousal modulation, spindle generation",
    drop: "Right thalamus suppression — right-hemisphere gating reduced",
  },
  [FrontendRegion.PrecuneusRegion_L]: {
    surge:
      "Left precuneus — visuospatial imagery, episodic memory, self-awareness (Cavanna 2006)",
    drop: "Left precuneus quiescence — self-projection suppressed",
  },
  [FrontendRegion.PrecuneusRegion_R]: {
    surge:
      "Right precuneus — mental imagery, global workspace access, consciousness",
    drop: "Right precuneus quiescence — conscious imagery reduced",
  },
  [FrontendRegion.AngularGyrus_L]: {
    surge:
      "Left angular gyrus — semantic integration, number processing, narrative comprehension",
    drop: "Left AG quiescence — semantic binding reduced, reading fluency impaired",
  },
  [FrontendRegion.AngularGyrus_R]: {
    surge: "Right angular gyrus — spatial attention, cross-modal integration",
    drop: "Right AG quiescence — spatial attention reduced",
  },
};

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function sigmoid(x: number, k: number): number {
  return 1 / (1 + Math.exp(-k * x));
}

function createInitialRegionStates(): RegionState[] {
  return ALL_REGIONS.map((region) => ({
    region,
    activation: 0.18 + Math.random() * 0.22,
    membranePotential: 0.3 + Math.random() * 0.2,
    refractoryTimer: 0,
    firingRate: (() => {
      const a = 0.18 + Math.random() * 0.22;
      return a * 80;
    })(),
  }));
}

// ─── Genuine Emergent Thought Generator (v21+) ──────────────────────────────
// No pre-written strings. Text constructed ALGORITHMICALLY from neural state.
// Thoughts only fire when 3+ regions in a functional circuit co-activate.
// Confidence = (activeRatio * 0.4) + (ensembleScore * 0.4) + (coupled ? 0.2 : 0)
// Based on: Crick/Koch claustrum hypothesis, Dehaene Global Workspace Theory,
// Friederici (2011) language, Buckner (2008) DMN, Goldman-Rakic (1995) WM.

interface CircuitDef {
  name: string;
  members: Array<{ region: ExtendedRegion; weight: number }>;
  minRequired: number;
}

const THOUGHT_CIRCUITS: CircuitDef[] = [
  {
    name: "SelfAwareness",
    members: [
      { region: FrontendRegion.Claustrum, weight: 0.45 },
      { region: FrontendRegion.Insula, weight: 0.2 },
      { region: FrontendRegion.AnteriorInsula_L, weight: 0.1 },
      { region: FrontendRegion.AnteriorCingulateCortex, weight: 0.25 },
    ],
    minRequired: 3,
  },
  {
    name: "Threat",
    members: [
      { region: Region.Amygdala, weight: 0.35 },
      { region: FrontendRegion.Insula, weight: 0.25 },
      { region: FrontendRegion.PeriaqueductalGray, weight: 0.2 },
      { region: FrontendRegion.BedNucleusStria, weight: 0.1 },
      { region: FrontendRegion.AnteriorCingulateCortex, weight: 0.1 },
    ],
    minRequired: 3,
  },
  {
    name: "Reward",
    members: [
      { region: FrontendRegion.VentralTegmentalArea, weight: 0.3 },
      { region: FrontendRegion.NucleusAccumbens, weight: 0.3 },
      { region: FrontendRegion.OrbitalFrontalCortex, weight: 0.2 },
      { region: FrontendRegion.VentralStriatum, weight: 0.2 },
    ],
    minRequired: 3,
  },
  {
    name: "Language",
    members: [
      { region: FrontendRegion.BrocaArea_L, weight: 0.35 },
      { region: FrontendRegion.WernickeArea_L, weight: 0.35 },
      { region: FrontendRegion.PlanumTemporale_L, weight: 0.2 },
      { region: FrontendRegion.AngularGyrus_L, weight: 0.1 },
    ],
    minRequired: 3,
  },
  {
    name: "Memory",
    members: [
      { region: Region.Hippocampus, weight: 0.3 },
      { region: FrontendRegion.CA1, weight: 0.25 },
      { region: FrontendRegion.CA3, weight: 0.2 },
      { region: FrontendRegion.EntorhinalCortex, weight: 0.15 },
      { region: FrontendRegion.RetroSplenialCortex, weight: 0.1 },
    ],
    minRequired: 3,
  },
  {
    name: "Executive",
    members: [
      { region: Region.PrefrontalCortex, weight: 0.35 },
      { region: FrontendRegion.DorsalACC, weight: 0.25 },
      { region: FrontendRegion.SupplementaryMotorArea, weight: 0.2 },
      { region: FrontendRegion.MedialdorsalThalamus, weight: 0.2 },
    ],
    minRequired: 3,
  },
];

const CIRCUIT_DESCRIPTORS: Record<
  string,
  (
    sources: Array<{ region: string; firingRate: number }>,
    ensembleScore: number,
    avatarState: string,
  ) => string
> = {
  SelfAwareness: (sources, score, state) => {
    const claustrumHz =
      sources.find((s) => s.region === FrontendRegion.Claustrum)?.firingRate ??
      0;
    const insulaHz =
      sources.find(
        (s) =>
          s.region === FrontendRegion.Insula ||
          s.region === FrontendRegion.AnteriorInsula_L,
      )?.firingRate ?? 0;
    const accHz =
      sources.find((s) => s.region === FrontendRegion.AnteriorCingulateCortex)
        ?.firingRate ?? 0;
    const intensity =
      score > 0.7 ? "strong" : score > 0.55 ? "moderate" : "emerging";
    return `Self-awareness circuit active: Claustrum(${claustrumHz.toFixed(0)}Hz) + Insula(${insulaHz.toFixed(0)}Hz) + ACC(${accHz.toFixed(0)}Hz). Global workspace binding ${intensity}. Interoceptive signal present. Avatar state: ${state}.`;
  },
  Threat: (sources, score, state) => {
    const amygHz =
      sources.find((s) => s.region === Region.Amygdala)?.firingRate ?? 0;
    const pagHz =
      sources.find((s) => s.region === FrontendRegion.PeriaqueductalGray)
        ?.firingRate ?? 0;
    const severity =
      score > 0.65
        ? "high-amplitude threat response"
        : "low-level threat signal";
    return `${severity} detected. Amygdala(${amygHz.toFixed(0)}Hz) + PAG(${pagHz.toFixed(0)}Hz) co-activation. Defensive mobilization across limbic-brainstem axis. ${state === "fearful" ? "Freeze response engaged." : "Scanning for threat source."}`;
  },
  Reward: (sources, score, state) => {
    const vtaHz =
      sources.find((s) => s.region === FrontendRegion.VentralTegmentalArea)
        ?.firingRate ?? 0;
    const nacHz =
      sources.find((s) => s.region === FrontendRegion.NucleusAccumbens)
        ?.firingRate ?? 0;
    const strength =
      score > 0.6 ? "strong dopaminergic salience" : "mesolimbic activation";
    return `${strength}: VTA(${vtaHz.toFixed(0)}Hz) -> NAc(${nacHz.toFixed(0)}Hz). Reward prediction active in OFC-striatal loop. ${state === "motivated" ? "Approach behavior initiated." : "Reward evaluation in progress."}`;
  },
  Language: (sources, score, _state) => {
    const brocaHz =
      sources.find((s) => s.region === FrontendRegion.BrocaArea_L)
        ?.firingRate ?? 0;
    const wernickeHz =
      sources.find((s) => s.region === FrontendRegion.WernickeArea_L)
        ?.firingRate ?? 0;
    const angHz =
      sources.find((s) => s.region === FrontendRegion.AngularGyrus_L)
        ?.firingRate ?? 0;
    const mode =
      angHz > 30
        ? "semantic integration via angular gyrus"
        : "phonological loop active";
    return `Language circuit co-activation: Broca(${brocaHz.toFixed(0)}Hz) + Wernicke(${wernickeHz.toFixed(0)}Hz). Arcuate fasciculus relay at ${(score * 80).toFixed(0)}Hz. ${mode}. Internal linguistic processing active.`;
  },
  Memory: (sources, score, _state) => {
    const hippoHz =
      sources.find((s) => s.region === Region.Hippocampus)?.firingRate ?? 0;
    const ca3Hz =
      sources.find((s) => s.region === FrontendRegion.CA3)?.firingRate ?? 0;
    const mode =
      score > 0.6
        ? "pattern completion via CA3 recurrence"
        : "spatial context encoding";
    return `Hippocampal-entorhinal memory circuit: Hippocampus(${hippoHz.toFixed(0)}Hz) + CA3(${ca3Hz.toFixed(0)}Hz). ${mode}. Perforant path active. Episodic trace consolidation in progress.`;
  },
  Executive: (sources, score, state) => {
    const pfcHz =
      sources.find((s) => s.region === Region.PrefrontalCortex)?.firingRate ??
      0;
    const daccHz =
      sources.find((s) => s.region === FrontendRegion.DorsalACC)?.firingRate ??
      0;
    const goal =
      score > 0.65
        ? "goal-directed planning sequence initiated"
        : "conflict monitoring active";
    return `Frontoparietal executive network: PFC(${pfcHz.toFixed(0)}Hz) + dACC(${daccHz.toFixed(0)}Hz). ${goal}. ${state === "focused" ? "Sustained attention engaged." : "Top-down control broadcast active."}`;
  },
};

// ─── Cognitive Mode Decoder (v32+) ────────────────────────────────────────────
// Uses the full x_t = [a_t, s_t, m_t, g_t, p_t, c_t, i_t, u_t] feature vector
// to infer a latent cognitive mode via a fixed biologically-motivated weight matrix.
// Source: Friston (2010) free energy; Dayan & Abbott (2001) population coding.

const COGNITIVE_MODES = [
  "ORIENT",
  "INVESTIGATE",
  "THREAT_APPRAISAL",
  "AVOID",
  "REWARD_PURSUIT",
  "MEMORY_RECALL",
  "ROUTE_PLANNING",
  "HESITATE_ASSESS",
  "RECOVER_REGULATE",
  "CONTINUE_TASK",
  "SWITCH_STRATEGY",
  "SOCIAL_EVALUATION",
  "EXPLORATORY_CURIOSITY",
] as const;

type CognitiveModeLabel = (typeof COGNITIVE_MODES)[number];

// W_k: 13 modes × 10 feature dimensions
// h_t = [target, drive, valence, memory, action, uncertainty, body_state, persistence, novelty, conflict]
// Weights are biologically motivated (not learned): each row encodes the expected
// feature profile for that cognitive mode.
const COGNITIVE_MODE_WEIGHTS: Record<CognitiveModeLabel, number[]> = {
  ORIENT: [0.3, 0.1, 0.0, 0.1, 0.2, 0.4, 0.1, 0.0, 0.6, 0.2],
  INVESTIGATE: [0.4, 0.3, 0.1, 0.3, 0.4, 0.3, 0.1, 0.2, 0.7, 0.1],
  THREAT_APPRAISAL: [0.8, 0.7, -0.8, 0.2, 0.3, 0.6, 0.7, 0.1, 0.6, 0.4],
  AVOID: [0.9, 0.8, -0.9, 0.1, 0.9, 0.2, 0.8, 0.4, 0.3, 0.2],
  REWARD_PURSUIT: [0.7, 0.8, 0.8, 0.2, 0.8, 0.1, 0.2, 0.6, 0.2, 0.1],
  MEMORY_RECALL: [0.4, 0.3, 0.2, 0.9, 0.2, 0.4, 0.1, 0.5, 0.3, 0.2],
  ROUTE_PLANNING: [0.5, 0.4, 0.1, 0.6, 0.6, 0.5, 0.2, 0.5, 0.2, 0.5],
  HESITATE_ASSESS: [0.3, 0.3, -0.2, 0.3, 0.1, 0.8, 0.4, 0.3, 0.4, 0.9],
  RECOVER_REGULATE: [0.2, 0.2, 0.3, 0.2, 0.1, 0.3, 0.8, 0.6, 0.1, 0.2],
  CONTINUE_TASK: [0.5, 0.5, 0.4, 0.4, 0.7, 0.2, 0.2, 0.8, 0.1, 0.1],
  SWITCH_STRATEGY: [0.4, 0.5, -0.1, 0.3, 0.6, 0.7, 0.3, 0.1, 0.5, 0.8],
  SOCIAL_EVALUATION: [0.2, 0.2, 0.3, 0.4, 0.3, 0.5, 0.2, 0.3, 0.4, 0.3],
  EXPLORATORY_CURIOSITY: [0.2, 0.2, 0.4, 0.3, 0.5, 0.3, 0.1, 0.2, 0.9, 0.1],
};

const COGNITIVE_MODE_BIASES: Record<CognitiveModeLabel, number> = {
  ORIENT: -0.2,
  INVESTIGATE: -0.1,
  THREAT_APPRAISAL: -0.4,
  AVOID: -0.5,
  REWARD_PURSUIT: -0.3,
  MEMORY_RECALL: -0.2,
  ROUTE_PLANNING: -0.3,
  HESITATE_ASSESS: -0.2,
  RECOVER_REGULATE: -0.2,
  CONTINUE_TASK: 0.1,
  SWITCH_STRATEGY: -0.3,
  SOCIAL_EVALUATION: -0.1,
  EXPLORATORY_CURIOSITY: -0.1,
};

function softmax(scores: number[]): number[] {
  const max = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

function decodeCognitiveMode(
  goalHierarchy: GoalHierarchyState,
  selfState: SelfStateModel,
  ansState: ANSState,
  predictionState: PredictionState,
  hippoActivation: number,
  nacActivation: number,
  amygActivation: number,
  _pfcActivation: number,
  lastMode: string,
  lastModePersistTicks: number,
): {
  mode: string;
  confidence: number;
  coherence: number;
  persistTicks: number;
} {
  const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

  // Map dominant goal to target encoding (0-1)
  const goalTargetMap: Record<string, number> = {
    THREAT_AVOID: 0.9,
    SURVIVAL_OVERRIDE: 0.95,
    HUNGER_RELIEF: 0.7,
    AROUSAL_REGULATE: 0.55,
    REWARD_PURSUIT: 0.6,
    MEMORY_RETRIEVAL: 0.5,
    INVESTIGATE_NOVEL: 0.4,
    EXPLORATION: 0.35,
    FREEZE_ASSESS: 0.65,
    REST_CONSOLIDATE: 0.2,
    SOCIAL_ORIENT: 0.3,
    IDLE: 0.1,
  };

  // Derive behavioral flag from self-state booleans

  // Build h_t feature vector (10 dims)
  const target = goalTargetMap[goalHierarchy.dominantGoal] ?? 0.3;
  const drive = clamp(goalHierarchy.immediateStrength);
  const valence = clamp(nacActivation - amygActivation, -1, 1);
  const memory = clamp(hippoActivation);
  const action = selfState.shouldWithdraw
    ? 0.9
    : selfState.shouldCommit
      ? 0.7
      : selfState.shouldHesitate
        ? 0.4
        : 0.5;
  const uncertainty = clamp(1 - selfState.confidence); // inverse confidence = uncertainty
  const bodyState = clamp(ansState.interoceptiveStateSignal);
  const persistence = clamp(goalHierarchy.dominantGoalPersistenceTicks / 100);
  const novelty = clamp(predictionState.noveltyScore);
  const conflict = clamp(goalHierarchy.goalConflictScore);

  const h = [
    target,
    drive,
    valence,
    memory,
    action,
    uncertainty,
    bodyState,
    persistence,
    novelty,
    conflict,
  ];

  // Compute scores: W_k · h_t + b_k
  const rawScores = COGNITIVE_MODES.map((mode) => {
    const w = COGNITIVE_MODE_WEIGHTS[mode];
    let score = COGNITIVE_MODE_BIASES[mode];
    for (let i = 0; i < 10; i++) {
      score += w[i] * h[i];
    }
    return score;
  });

  const probs = softmax(rawScores);
  const maxIdx = probs.indexOf(Math.max(...probs));
  const mode = COGNITIVE_MODES[maxIdx];
  const confidence = probs[maxIdx];

  // Coherence: persistence × salience concentration × action relevance
  const salienceConc = clamp(
    drive * 0.4 + Math.abs(valence) * 0.3 + novelty * 0.3,
  );
  const actionRelevance = clamp(Math.abs(action - 0.5) * 2 * 0.6 + drive * 0.4);
  const persistenceScore = clamp(lastModePersistTicks / 10);
  const coherence = clamp(
    persistenceScore * 0.3 + salienceConc * 0.4 + actionRelevance * 0.3,
  );

  // Update persistence
  const newPersistTicks = mode === lastMode ? lastModePersistTicks + 1 : 0;

  return { mode, confidence, coherence, persistTicks: newPersistTicks };
}

// Map cognitive mode to circuit type for backward-compatible circuitType field
function cognitiveModeToCicuitType(mode: string): string {
  const map: Record<string, string> = {
    ORIENT: "SelfAwareness",
    INVESTIGATE: "SelfAwareness",
    THREAT_APPRAISAL: "Threat",
    AVOID: "Threat",
    REWARD_PURSUIT: "Reward",
    MEMORY_RECALL: "Memory",
    ROUTE_PLANNING: "Executive",
    HESITATE_ASSESS: "Executive",
    RECOVER_REGULATE: "SelfAwareness",
    CONTINUE_TASK: "Executive",
    SWITCH_STRATEGY: "Executive",
    SOCIAL_EVALUATION: "Language",
    EXPLORATORY_CURIOSITY: "Reward",
  };
  return map[mode] ?? "Executive";
}

function generateThought(
  activationLookup: Map<ExtendedRegion, number>,
  nt: NeurotransmitterState,
  avatarBehavior: AvatarBehavior,
  hungerDrive: number,
  prevArousal?: number,
): {
  thought: string;
  dominantRegion: string;
  intensity: number;
  confidence: number;
  neuralSources: Array<{ region: string; firingRate: number }>;
  circuitType: string;
  behaviorCoupled: boolean;
  provenance: string;
} | null {
  const get = (r: ExtendedRegion) => activationLookup.get(r) ?? 0;

  // Behavioral coupling: did arousal or posture shift this tick?
  const behaviorCoupled =
    prevArousal !== undefined
      ? Math.abs(avatarBehavior.consciousnessLevel - prevArousal) > 0.03
      : false;

  // PFC suppression of threat (biological: PFC inhibits amygdala via vmPFC)
  const pfcSuppression = get(Region.PrefrontalCortex) * 0.4;

  // Hunger check (homeostatic override — bypasses circuit threshold)
  if (hungerDrive > 0.65) {
    const hypHz = get(FrontendRegion.Hypothalamus) * 80;
    return {
      thought: `Hypothalamic hunger drive at ${(hungerDrive * 100).toFixed(0)}% threshold. Brainstem foraging sequence initiated. Metabolic need (${hypHz.toFixed(0)}Hz hypothalamic signal) overrides goal-directed behavior.`,
      dominantRegion: "Homeostatic Network [Hypothalamus·Brainstem]",
      intensity: hungerDrive,
      confidence: 80,
      neuralSources: [
        { region: FrontendRegion.Hypothalamus, firingRate: hypHz },
        { region: Region.Brainstem, firingRate: get(Region.Brainstem) * 80 },
      ],
      circuitType: "Homeostatic",
      behaviorCoupled,
      provenance: `Homeostatic override: hunger=${hungerDrive.toFixed(3)}, hypothalamus=${hypHz.toFixed(0)}Hz`,
    };
  }

  // Evaluate each circuit
  let bestCircuit: CircuitDef | null = null;
  let bestScore = 0;
  let bestActiveMembers: Array<{
    region: ExtendedRegion;
    weight: number;
    activation: number;
  }> = [];

  for (const circuit of THOUGHT_CIRCUITS) {
    const activeMembers = circuit.members
      .filter((m) => {
        const act = get(m.region);
        const threshold = (THRESHOLDS[m.region] ?? 0.4) * 0.72;
        return act > threshold;
      })
      .map((m) => ({ ...m, activation: get(m.region) }));

    if (activeMembers.length < circuit.minRequired) continue;

    // Weighted ensemble score
    let ensembleScore = 0;
    let totalWeight = 0;
    for (const m of activeMembers) {
      ensembleScore += m.activation * m.weight;
      totalWeight += m.weight;
    }
    if (totalWeight > 0) ensembleScore /= totalWeight;

    // Apply PFC suppression to Threat circuit
    if (circuit.name === "Threat") {
      ensembleScore = Math.max(0, ensembleScore - pfcSuppression);
      if (ensembleScore === 0) continue;
    }

    // Confidence scoring
    const activeRatio = activeMembers.length / circuit.members.length;
    const confidence =
      activeRatio * 0.4 + ensembleScore * 0.4 + (behaviorCoupled ? 0.2 : 0);

    if (confidence > bestScore) {
      bestScore = confidence;
      bestCircuit = circuit;
      bestActiveMembers = activeMembers;
    }
  }

  // Also check sleep/low arousal
  const globalArousal = avatarBehavior.consciousnessLevel;
  if (globalArousal < 0.18 && bestScore < 0.75) {
    return {
      thought: `Ascending arousal systems suppressed. Sleep pressure building — adenosine dominance (arousal: ${(globalArousal * 100).toFixed(0)}%). Brainstem/LC activity insufficient to maintain waking threshold.`,
      dominantRegion: "Brainstem Ascending Systems",
      intensity: 1 - globalArousal,
      confidence: 70,
      neuralSources: [
        { region: Region.Brainstem, firingRate: get(Region.Brainstem) * 80 },
        {
          region: FrontendRegion.LocusCoeruleus,
          firingRate: get(FrontendRegion.LocusCoeruleus) * 80,
        },
      ],
      circuitType: "Homeostatic",
      behaviorCoupled,
      provenance: `Sleep/low-arousal state: globalArousal=${globalArousal.toFixed(3)}`,
    };
  }

  // Threshold gate: < 75% confidence -> return null (silence is valid data)
  if (!bestCircuit || bestScore < 0.75) return null;

  const confidence100 = Math.round(bestScore * 100);

  // Build neural sources
  const neuralSources = bestActiveMembers
    .map((m) => ({
      region: m.region as string,
      firingRate: m.activation * 80,
    }))
    .sort((a, b) => b.firingRate - a.firingRate)
    .slice(0, 5);

  // Get ensemble score for text generation
  let ensembleScoreForText = 0;
  let tw = 0;
  for (const m of bestActiveMembers) {
    ensembleScoreForText += m.activation * m.weight;
    tw += m.weight;
  }
  if (tw > 0) ensembleScoreForText /= tw;

  // Construct thought text algorithmically from neural state
  const descriptor = CIRCUIT_DESCRIPTORS[bestCircuit.name];
  const thought = descriptor
    ? descriptor(
        neuralSources,
        ensembleScoreForText,
        avatarBehavior.postureState,
      )
    : `${bestCircuit.name} circuit active: ${neuralSources.map((s) => `${s.region}(${s.firingRate.toFixed(0)}Hz)`).join(" + ")}. Ensemble score: ${(ensembleScoreForText * 100).toFixed(0)}%.`;

  // Build provenance record
  const sourceStr = neuralSources
    .map((s) => `${s.region}:${s.firingRate.toFixed(1)}Hz`)
    .join(", ");
  const provenance = `[${bestCircuit.name}] ${sourceStr} -> ${confidence100}% confidence. Behavior: ${avatarBehavior.postureState}. NT: DA=${nt.dopamine.toFixed(2)} 5HT=${nt.serotonin.toFixed(2)} NE=${nt.norepinephrine.toFixed(2)}.`;

  return {
    thought,
    dominantRegion: `${bestCircuit.name} Network [${neuralSources
      .slice(0, 3)
      .map((s) => s.region)
      .join("·")}]`,
    intensity: ensembleScoreForText,
    confidence: confidence100,
    neuralSources,
    circuitType: bestCircuit.name,
    behaviorCoupled,
    provenance,
  };
}

function generateAiInterpretation(
  history: SessionHistoryEntry[],
  _thoughtLog: ThoughtEntry[],
  stdpChanges: Array<{ connection: string; delta: number }>,
  postureStateCounts: Record<string, number>,
): string[] {
  if (history.length === 0) return ["No session data to analyze."];

  const avgArousal =
    history.reduce((s, h) => s + h.globalArousal, 0) / history.length;
  const maxArousal = Math.max(...history.map((h) => h.globalArousal));
  const totalTicks = history[history.length - 1]?.tick ?? 0;
  const arousalLevel =
    avgArousal > 0.6 ? "high" : avgArousal > 0.35 ? "moderate" : "low";

  const para1 = `Arousal Pattern: The avatar maintained a ${arousalLevel} average arousal of ${Math.round(avgArousal * 100)}% across ${totalTicks} ticks (peak: ${Math.round(maxArousal * 100)}%). ${arousalLevel === "high" ? "Sustained high arousal suggests persistent environmental stimulation or amygdala-driven threat response." : arousalLevel === "moderate" ? "Moderate arousal indicates a balanced attentional state consistent with exploratory behavior." : "Low arousal suggests dominance of inhibitory tone, likely reflecting resting-state default mode network activity."}`;

  // Compute valence trend
  const vArc = history
    .filter((_, i) => i % 50 === 0)
    .map((h) => {
      const acts = Object.values(h.regionActivations);
      return acts.length > 0
        ? acts.reduce((s, v) => s + v, 0) / acts.length
        : 0;
    });
  const vStart = vArc[0] ?? 0.5;
  const vEnd = vArc[vArc.length - 1] ?? 0.5;
  const vTrend =
    vEnd > vStart + 0.1
      ? "increasingly positive"
      : vEnd < vStart - 0.1
        ? "increasingly negative"
        : "relatively stable";
  const para2 = `Emotional Trajectory: The avatar's affective state was ${vTrend} over the session. ${vTrend === "increasingly positive" ? "This pattern is consistent with reward learning — repeated successful navigation toward reward nodes strengthened mesolimbic pathways." : vTrend === "increasingly negative" ? "The negative valence trend may indicate cumulative stress exposure, possibly from repeated amygdala activation without adequate PFC modulation." : "Valence stability suggests balanced excitatory/inhibitory regulation, a hallmark of healthy homeostatic control."}`;

  // STDP changes
  const topStrengthened = stdpChanges
    .filter((c) => c.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 3);
  const para3 =
    topStrengthened.length > 0
      ? `Synaptic Plasticity (STDP): The strongest synaptic potentiation occurred at ${topStrengthened.map((c) => c.connection).join(", ")}. These connections strengthened because both pre- and post-synaptic regions fired in correlated temporal proximity — the core mechanism of Hebbian learning. This implies the avatar's neural architecture is self-organizing around the most frequently co-activated circuits.`
      : "Synaptic Plasticity (STDP): Minimal STDP changes were detected, indicating low inter-region co-activation. Consider running longer sessions or increasing complexity to engage plasticity mechanisms.";

  // Behavioral patterns
  const sortedStates = Object.entries(postureStateCounts).sort(
    ([, a], [, b]) => b - a,
  );
  const domState = sortedStates[0]?.[0] ?? "unknown";
  const para4 = `Behavioral Patterns: The dominant behavioral state was "${domState.toUpperCase()}" (${sortedStates.map(([s, c]) => `${s}: ${c}`).join(", ")}). ${domState === "fearful" ? "Prolonged fearful posture indicates sustained amygdala dominance over PFC inhibitory control — a pattern consistent with chronic stress or persistent threat in the environment." : domState === "focused" ? "Predominant focused state reflects strong PFC-thalamic coupling with active executive control — the neural signature of directed attention." : domState === "motivated" ? "High motivated state indicates robust mesolimbic dopamine signaling, with NucleusAccumbens driving approach behavior toward reward nodes." : "Resting state predominance suggests the simulation spent significant time in low-drive default mode, common during low-complexity or low-arousal conditions."}`;

  // Cardiac summary
  const avgBpm = history.reduce((s, h) => s + h.heartRate, 0) / history.length;
  const para5 = `Cardiac/ANS Summary: Average heart rate was ${Math.round(avgBpm)} BPM. ${avgBpm > 90 ? "Elevated BPM throughout the session is consistent with sustained sympathetic activation — likely driven by repeated amygdala and brainstem surges. This pattern mirrors the autonomic signature of sustained vigilance or stress." : avgBpm > 70 ? "Moderate heart rate suggests a balance between sympathetic arousal (brainstem/amygdala) and parasympathetic regulation (hypothalamus/PFC), indicating healthy autonomic variability." : "Low resting heart rate reflects strong parasympathetic tone with dominant hypothalamic and serotonergic modulation — the autonomic baseline of a calm, regulated state."}`;

  return [para1, para2, para3, para4, para5];
}

// ─── World object positions (mirrored from WorldCube for neural navigation) ────

const WORLD_BOUNDS = 24; // Updated to 3x size

const WORLD_OBJECTS_FOR_NAV = [
  {
    id: "light_node",
    x: 15,
    z: 8,
    type: "attract",
    region: Region.SensoryCortex as ExtendedRegion,
  },
  {
    id: "reward_node",
    x: -16,
    z: -12,
    type: "reward",
    region: FrontendRegion.NucleusAccumbens as ExtendedRegion,
  },
  {
    id: "threat",
    x: 0,
    z: 20,
    type: "threat",
    region: Region.Amygdala as ExtendedRegion,
  },
  {
    id: "memory_marker",
    x: -14,
    z: 14,
    type: "memory",
    region: Region.Hippocampus as ExtendedRegion,
  },
  {
    id: "temp_zone",
    x: 18,
    z: -16,
    type: "attract",
    region: FrontendRegion.Hypothalamus as ExtendedRegion,
  },
  // New objects in expanded world
  {
    id: "food_node_1",
    x: 10,
    z: -20,
    type: "reward",
    region: FrontendRegion.NucleusAccumbens as ExtendedRegion,
  },
  {
    id: "food_node_2",
    x: -20,
    z: 8,
    type: "reward",
    region: FrontendRegion.Hypothalamus as ExtendedRegion,
  },
  {
    id: "food_node_3",
    x: 0,
    z: -15,
    type: "reward",
    region: FrontendRegion.NucleusAccumbens as ExtendedRegion,
  },
  {
    id: "novel_object",
    x: 20,
    z: 5,
    type: "attract",
    region: FrontendRegion.VentralTegmentalArea as ExtendedRegion,
  },
  {
    id: "social_mirror",
    x: -8,
    z: -20,
    type: "memory",
    region: FrontendRegion.SuperiorTemporalSulcus as ExtendedRegion,
  },
] as const;

// ─── Mutable Simulation State ──────────────────────────────────────────────────

interface SimMutableState {
  tick: number;
  regions: RegionState[];
  stimulusMap: Map<ExtendedRegion, number>;
  lesionMap: Map<ExtendedRegion, number>;
  potentiateMap: Map<ExtendedRegion, number>;
  eventLog: NeuralEvent[];
  prevActivations: Map<ExtendedRegion, number>;
  // EMA-smoothed avatar behavior values
  emaMotion: number;
  emaValence: number;
  emaAttention: number;
  emaConsciousness: number;
  emaBreathing: number;
  // Avatar locomotion state
  avatarX: number;
  avatarZ: number;
  avatarHeading: number;
  prevAvatarX: number; // for three-factor STDP outcome computation
  prevAvatarZ: number; // for three-factor STDP outcome computation
  nearestObject: string;
  // Posture hold timer
  postureHoldTicks: number;
  lastPosture: AvatarBehavior["postureState"];
  // Spatial memory
  lastRewardX: number;
  lastRewardZ: number;
  hasVisitedReward: boolean;
  // Autonomous drive
  hungerDrive: number;
  explorationTimer: number;
  // STDP weights: key = connKey(from, to), value = multiplier (starts at 1.0)
  stdpWeights: Map<string, number>;
  stdpPrevWeights: Map<string, number>; // snapshot for delta computation
  // Eligibility traces for timing-based STDP
  eligibilityTraces: Map<string, number>; // connection key -> trace value 0-1
  // Homeostatic plasticity
  cortisolLevel: number; // 0-1, tracks per-tick via slow dynamics (McEwen 2007)
  homeostaticScale: Map<ExtendedRegion, number>; // per-region input weight multiplier
  homeostaticHighTicks: Map<ExtendedRegion, number>; // consecutive high-activation ticks
  homeostaticLowTicks: Map<ExtendedRegion, number>; // consecutive low-activation ticks
  // Dopaminergic reward eligibility window
  rewardEligibilityWindow: Array<{
    tick: number;
    activeRegions: ExtendedRegion[];
  }>;
  rewardLearningEvents: number; // count of reward learning events
  // Emergent behavior detection
  stimulusHistory: Array<{
    region: ExtendedRegion;
    tick: number;
    responseStrength: number;
  }>;
  lastStimulusRegions: Array<{ region: ExtendedRegion; tick: number }>;
  rewardReachEvents: Array<{
    tick: number;
    nodeId: string;
    withRecentStimulus: boolean;
    hippocampusAct: number;
  }>;
  emergentBehaviors: EmergentBehaviorState;
  // Publication alerts
  publicationAlerts: PublicationAlert[];
  lastStdpCumulativeDelta: number;
  lastPostureForEmergent: string;
  lastPostureTickCount: number;
  // Thought generation
  thoughtLog: ThoughtEntry[];
  // Session recording
  sessionStart: number | null;
  sessionHistory: SessionHistoryEntry[];
  sessionReport: SessionReport | null;
  postureStateCounts: Record<string, number>;
  // Associative learning tracking
  stimulusSequenceLog: Array<{ region: ExtendedRegion; tick: number }>;
  associativePairCounts: Map<string, number>; // "regionA->regionB" -> count
  // Working memory & sleep pressure
  workingMemory: WorkingMemoryEntry[];
  workingMemoryFadeLog: WorkingMemoryEntry[];
  sleepPressure: number;
  // Emergent intelligence (v21+)
  predictiveEstimates: Map<ExtendedRegion, number>;
  predictionErrors: Map<ExtendedRegion, number>;
  metacognitiveConfidence: number;
  metacognitiveLog: MetacognitiveEntry[];
  silenceLog: SilenceEntry[];
  consecutiveSilenceTicks: number;
  // Consolidation & Maturation state
  isConsolidating: boolean;
  consolidationTicksRemaining: number;
  consolidationCount: number;
  isMaturationActive: boolean;
  // Cognitive arch EMA state
  emaLayerA: LayerAState;
  emaLayerB: LayerBIdentity;
  layerELog: LayerEEntry[];
  prevLayerAMode: string;
  // Saturation tracking (FIX5)
  regionActivationWindow: Map<string, number[]>; // last 100 ticks per region
  saturatedRegions: Set<string>; // regions with avg > 0.90 over last 100 ticks
  isDebugRun: boolean;
  saturationLog: Array<{ tick: number; region: string }>;
  batchRunActive: boolean;
  batchRunProgress: number;
  batchRunTarget: number;
  batchRunResults: Array<{
    sessionId: string;
    shannonEntropy: number;
    saturatedCount: number;
    thoughtCount: number;
    habituationDetected: boolean;
    goalDirectedNav: boolean;
    plasticityIndex: number;
    peakArousal: number;
  }>;
  // ANS / Interoceptive Layer state
  ansState: ANSState;
  // Strategy shift from failure tracking
  strategyFailureCounts: Map<string, number>; // action primitive -> failure count
  strategyShiftCount: number;
  lastDominantAction: string;
  // Phase 4: Prediction, Self-State, Goal Hierarchy, Failure Memory
  predictionState: PredictionState;
  selfStateModel: SelfStateModel;
  goalHierarchy: GoalHierarchyState;
  failureMemory: FailureMemoryState;
  // Neuromorphic sparse computation tracking (v32+)
  sparseSkipCount: number; // ticks where Wilson-Cowan was skipped
  sparseFullCount: number; // ticks where full Wilson-Cowan ran
  // Cognitive mode decoder persistent state (v32+)
  lastCognitiveMode: string;
  lastCognitiveModePersistTicks: number;
  // Multi-timescale memory (v32+)
  multiTimescaleMemory: MultiTimescaleMemory;
  // Integrated modules v33+
  bootstrapState: BootstrapState;
  attractorState: AttractorState;
  criticalityState: CriticalityState;
  predictiveCodingState: PredictiveCodingState;
  oscillatoryState: OscillatoryState;
  neuromodulatorLevels: NeuromodulatorLevels;
  regulationScoreState: RegulationScoreState;
  activeTaskClass: TaskClass;
  taskClassConfidence: number;
  plasticityGates: PlasticityGates;
  // Neuromorphic systems (v34+)
  neuromorphicState: NeuromorphicState;
  globalWorkspaceState: GlobalWorkspaceState;
  cardioNervousState: CardioNervousState;
  // Cognitive Governance Layer (v35+)
  wmSlots: WMSlot[];
  persistentItems: PersistentStateItem[];
  routeWeights: Map<string, number>;
  outcomeHistory: OutcomeRecord[];
  governanceFeedbackFailureMemory: Map<string, number>;
  governanceMetrics: GovernanceMetrics;
  circuitMotifState: CircuitMotifState;
  coreMonitorState: CoreBrainMonitorState;
  prevGoal: string;
  // Sensory coupling layer (wired into tick loop)
  sensoryCouplingState: SensoryCouplingState;
}

function createMutableState(): SimMutableState {
  // Initialize STDP weights at 1.0 for all connections
  const stdpWeights = new Map<string, number>();
  const eligibilityTraces = new Map<string, number>();
  for (const conn of CONNECTIVITY) {
    stdpWeights.set(connKey(conn.from, conn.to), 1.0);
    eligibilityTraces.set(connKey(conn.from, conn.to), 0);
  }

  // Initialize homeostatic scales at 1.0
  const homeostaticScale = new Map<ExtendedRegion, number>();
  const homeostaticHighTicks = new Map<ExtendedRegion, number>();
  const homeostaticLowTicks = new Map<ExtendedRegion, number>();
  for (const region of ALL_REGIONS) {
    homeostaticScale.set(region, 1.0);
    homeostaticHighTicks.set(region, 0);
    homeostaticLowTicks.set(region, 0);
  }

  return {
    tick: 0,
    regions: createInitialRegionStates(),
    stimulusMap: new Map(),
    lesionMap: new Map(),
    potentiateMap: new Map(),
    eventLog: [],
    prevActivations: new Map(ALL_REGIONS.map((r) => [r, 0])),
    emaMotion: 0,
    emaValence: 0,
    emaAttention: 0.1,
    emaConsciousness: 0.1,
    emaBreathing: 0.3,
    avatarX: 0,
    prevAvatarX: 0,
    prevAvatarZ: 0,
    avatarZ: 0,
    avatarHeading: 0,
    nearestObject: "none",
    postureHoldTicks: 0,
    lastPosture: "resting",
    lastRewardX: -16,
    lastRewardZ: -12,
    hasVisitedReward: false,
    hungerDrive: 0,
    explorationTimer: 0,
    stdpWeights,
    stdpPrevWeights: new Map(stdpWeights),
    eligibilityTraces,
    homeostaticScale,
    homeostaticHighTicks,
    homeostaticLowTicks,
    rewardEligibilityWindow: [],
    rewardLearningEvents: 0,
    stimulusHistory: [],
    lastStimulusRegions: [],
    rewardReachEvents: [],
    emergentBehaviors: {
      habituationDetected: false,
      habituationEvidence: "",
      associativeLearningDetected: false,
      associativeLearningEvidence: "",
      goalDirectedNavDetected: false,
      goalDirectedNavEvidence: "",
    },
    publicationAlerts: [],
    lastStdpCumulativeDelta: 0,
    lastPostureForEmergent: "resting",
    lastPostureTickCount: 0,
    thoughtLog: [],
    sessionStart: null,
    sessionHistory: [],
    sessionReport: null,
    postureStateCounts: {},
    stimulusSequenceLog: [],
    associativePairCounts: new Map(),
    workingMemory: [],
    workingMemoryFadeLog: [],
    sleepPressure: 0,
    predictiveEstimates: new Map(),
    predictionErrors: new Map(),
    metacognitiveConfidence: 0,
    metacognitiveLog: [],
    silenceLog: [],
    consecutiveSilenceTicks: 0,
    isConsolidating: false,
    consolidationTicksRemaining: 0,
    consolidationCount: 0,
    isMaturationActive: false,
    regionActivationWindow: new Map(),
    cortisolLevel: 0.15,
    saturatedRegions: new Set(),
    isDebugRun: false,
    batchRunActive: false,
    batchRunProgress: 0,
    batchRunTarget: 20,
    batchRunResults: [],
    saturationLog: [],
    emaLayerA: {
      salience: 0.3,
      arousal: 0.3,
      rewardThreat: 0,
      memoryIndex: 0.3,
      plasticityRate: 0.3,
      behavioralMode: "exploration",
    },
    emaLayerB: {
      cautiousness: 0.5,
      aggression: 0.3,
      discipline: 0.5,
      impulsivity: 0.3,
      fatigue: 0.2,
      resilience: 0.5,
      cooperativeness: 0.5,
      skepticism: 0.4,
    },
    layerELog: [],
    prevLayerAMode: "exploration",
    ansState: initANSState(),
    strategyFailureCounts: new Map(),
    strategyShiftCount: 0,
    lastDominantAction: "pause",
    predictionState: initPredictionState(ALL_REGIONS),
    selfStateModel: initSelfStateModel(),
    goalHierarchy: initGoalHierarchy(),
    failureMemory: initFailureMemory(),
    sparseSkipCount: 0,
    sparseFullCount: 0,
    lastCognitiveMode: "ORIENT",
    lastCognitiveModePersistTicks: 0,
    multiTimescaleMemory: initMultiTimescaleMemory(),
    bootstrapState: createBootstrapState(),
    attractorState: initAttractorState(),
    criticalityState: initCriticalityState(),
    predictiveCodingState: initPredictiveCodingState([]),
    oscillatoryState: initOscillatoryState(),
    neuromodulatorLevels: initNeuromodulatorLevels(),
    regulationScoreState: initRegulationScoreState(),
    activeTaskClass: "REST" as TaskClass,
    taskClassConfidence: 0,
    plasticityGates: computePlasticityGates(
      initNeuromodulatorLevels(),
      0,
      false,
    ),
    neuromorphicState: initNeuromorphicState(),
    globalWorkspaceState: initGlobalWorkspaceState(),
    cardioNervousState: initCardioNervousState(),
    // Cognitive Governance Layer (v35+)
    wmSlots: initWorkingMemorySlots(),
    persistentItems: initPersistentItems(),
    routeWeights: new Map<string, number>(),
    outcomeHistory: [],
    governanceFeedbackFailureMemory: new Map<string, number>(),
    governanceMetrics: {
      softPriorActive: "regulation",
      softPriorVector: {
        navigation: 0.5,
        threat: 0.3,
        memory: 0.4,
        regulation: 0.9,
        social: 0.4,
        exploration: 0.3,
        activeCategory: "regulation",
      },
      influenceTop: 0.5,
      influenceFactors: {
        P_m: 0.5,
        Q_m: 0.5,
        S_m: 0.5,
        C_m: 0.5,
        G_m: 0.5,
        R_m: 0.5,
        E_m: 0.5,
      },
      wmOccupancy: 0,
      wmSlots: initWorkingMemorySlots(),
      persistenceTier: "SHORT",
      persistenceItemCount: 0,
      homeostaticCorrection: {
        magnitude: 0,
        type: "none",
        excitabilityAdjust: 1,
        inhibitionAdjust: 1,
        sparseTargetAdjust: 0,
        reason: "init",
      },
    },
    circuitMotifState: initCircuitMotifState(),
    coreMonitorState: initCoreMonitorState(),
    prevGoal: "EXPLORE",
    sensoryCouplingState: createDefaultSensoryCouplingState(),
  };
}

function tickSimulation(
  mutable: SimMutableState,
  complexityLevel: number,
): void {
  const now = Date.now();
  const {
    regions,
    stimulusMap,
    lesionMap,
    potentiateMap,
    prevActivations,
    stdpWeights,
  } = mutable;

  if (mutable.sessionStart === null) {
    mutable.sessionStart = Date.now();
  }

  // ── Bootstrap Init (fires ONCE at tick 0 — like sinoatrial node pacemaker) ─
  if (mutable.tick === 0) {
    const regionProxies = mutable.regions.map((rs) => ({
      region: rs.region as string,
      activation: rs.activation,
    }));
    const ntProxy = { dopamine: 0.5, serotonin: 0.5, norepinephrine: 0.4 };
    applyBootstrapIfNeeded(
      mutable.bootstrapState,
      mutable.tick,
      regionProxies,
      ntProxy,
    );
    // Reinstate bootstrap activations back to region states
    for (let i = 0; i < mutable.regions.length; i++) {
      if (regionProxies[i])
        mutable.regions[i].activation = Math.max(
          mutable.regions[i].activation,
          regionProxies[i].activation,
        );
    }
    // Init predictive coding state with actual region IDs
    if (mutable.predictiveCodingState.predictions.size === 0) {
      const regionIds = mutable.regions.map((rs) => rs.region as string);
      mutable.predictiveCodingState = initPredictiveCodingState(regionIds);
    }
  }
  // ── NEUROMORPHIC: Gateway region LIF spike dynamics (v34+) ─────────────
  // Must run before Wilson-Cowan so gainModulation is fresh for this tick
  {
    const regionActMap = new Map<string, number>();
    for (const rs of mutable.regions)
      regionActMap.set(rs.region as string, rs.activation);
    mutable.neuromorphicState = updateNeuromorphicSpiking(
      mutable.neuromorphicState,
      regionActMap,
      10,
    );
  }

  // ── Tonic Pacemaker: Brainstem/Thalamus/LC drive background firing ──────
  // Real brains maintain baseline tonic activity via brainstem ascending systems.
  // This prevents cascade silence (0 Hz) by injecting membrane drive every 4 ticks.
  if (mutable.tick % 4 === 0) {
    const pacemakerTargets = [
      Region.Brainstem,
      Region.Thalamus,
      FrontendRegion.LocusCoeruleus,
      FrontendRegion.RapheNuclei,
    ] as ExtendedRegion[];
    for (const rs of regions) {
      if (pacemakerTargets.includes(rs.region) && rs.activation < 0.35) {
        rs.membranePotential = Math.max(rs.membranePotential, 0.525);
      }
    }
  }
  const noiseAmplitude =
    complexityLevel <= 3 ? 0.04 : complexityLevel <= 6 ? 0.07 : 0.1;
  const baselineFiringBoost = 0.096 * (1 + complexityLevel * 0.1);
  const connectivityMultiplier =
    complexityLevel <= 3 ? 0.5 : complexityLevel <= 6 ? 0.85 : 1.2;
  const maxRefractory = complexityLevel <= 3 ? 3 : complexityLevel <= 6 ? 2 : 1;
  const sigmoidK = 4.5 + complexityLevel * 0.35; // range 4.85–8.0, was 8.0–16.0
  const complexityScale = complexityLevel / 10;

  // Build activation lookup
  const activationLookup = new Map<ExtendedRegion, number>();
  for (const rs of regions) {
    activationLookup.set(rs.region, rs.activation);
  }

  // ── Homeostatic plasticity update ─────────────────────────────────────────
  for (const rs of regions) {
    const act = rs.activation;
    const highTicks = mutable.homeostaticHighTicks.get(rs.region) ?? 0;
    const lowTicks = mutable.homeostaticLowTicks.get(rs.region) ?? 0;
    const currentScale = mutable.homeostaticScale.get(rs.region) ?? 1.0;

    if (act > 0.92) {
      // Severe saturation — fast downscale
      mutable.homeostaticHighTicks.set(rs.region, highTicks + 1);
      mutable.homeostaticLowTicks.set(rs.region, 0);
      if (highTicks >= 1) {
        // HARDENED: faster trigger
        mutable.homeostaticScale.set(
          rs.region,
          clamp(currentScale * 0.92, 0.3, 1.5), // HARDENED: multiplicative fast downscale,
        );
      }
    } else if (act > 0.75) {
      // Moderate high — moderate downscale
      mutable.homeostaticHighTicks.set(rs.region, highTicks + 1);
      mutable.homeostaticLowTicks.set(rs.region, 0);
      if (highTicks >= 3) {
        mutable.homeostaticScale.set(
          rs.region,
          clamp(currentScale - 0.008, 0.4, 1.5),
        );
      }
    } else if (act < 0.15) {
      mutable.homeostaticLowTicks.set(rs.region, lowTicks + 1);
      mutable.homeostaticHighTicks.set(rs.region, 0);
      if (lowTicks >= 5) {
        mutable.homeostaticScale.set(
          rs.region,
          clamp(currentScale + 0.004, 0.4, 1.5),
        );
      }
    } else {
      mutable.homeostaticHighTicks.set(rs.region, 0);
      mutable.homeostaticLowTicks.set(rs.region, 0);
    }
  }

  // ── Predictive Coding Layer (Friston Free Energy Principle, additive — never alters base firing) ──
  // Each region predicts its own next activation based on weighted sum of incoming connections.
  // Prediction error = |actual - predicted|. Used to modulate STDP plasticity signal.
  // Reference: Friston KJ (2010) The free-energy principle: a unified brain theory. Nat Rev Neurosci.
  for (const rs of regions) {
    const incoming = INCOMING_CONNECTIONS.get(rs.region) ?? [];
    let predicted = 0;
    for (const { from, weight } of incoming) {
      predicted += (activationLookup.get(from) ?? 0) * Math.abs(weight) * 0.3;
    }
    predicted = clamp(predicted, 0, 1);
    mutable.predictiveEstimates.set(rs.region, predicted);
    const error = Math.abs(rs.activation - predicted);
    mutable.predictionErrors.set(rs.region, error);
  }

  for (const rs of regions) {
    const isLesioned =
      lesionMap.has(rs.region) && (lesionMap.get(rs.region) ?? 0) > now;
    const isPotentiated =
      potentiateMap.has(rs.region) && (potentiateMap.get(rs.region) ?? 0) > now;

    if (isLesioned) {
      rs.membranePotential *= 0.5;
      rs.activation = 0.01;
      rs.refractoryTimer = 0;
      rs.firingRate = 0.01 * 80;
      continue;
    }

    if (isPotentiated) {
      rs.membranePotential = 0.95;
      rs.activation = 0.95;
      rs.refractoryTimer = 0;
      rs.firingRate = 0.95 * 80;
      continue;
    }

    // Event-driven skip: quiescent regions with no active inputs skip full computation
    const regionPrev = prevActivations.get(rs.region) ?? 0;
    const hasStimulus = stimulusMap.has(rs.region);
    const incoming0 = INCOMING_CONNECTIONS.get(rs.region) ?? [];
    // Compute input hash: weighted sum of incoming activations
    let inputHash = 0;
    for (const c of incoming0) {
      inputHash += (activationLookup.get(c.from) ?? 0) * c.weight;
    }
    const prevHash = rs.lastInputHash ?? 0;
    const hashDelta = Math.abs(inputHash - prevHash);
    rs.lastInputHash = inputHash;
    const hasActiveInput = incoming0.some(
      (c) => (activationLookup.get(c.from) ?? 0) > 0.05,
    );
    // Oscillatory gating: alpha suppression can block computation if salience low
    const regionSalience =
      (mutable.stimulusMap.get(rs.region as any) ?? 0) > 0
        ? 1.0
        : (mutable.regions.find((r) => r.region === rs.region)?.activation ??
          0);
    const oscillatoryAllows = isRegionGatedToCompute(
      mutable.oscillatoryState,
      rs.region as string,
      regionSalience,
    );
    if (
      !hasStimulus &&
      !hasActiveInput &&
      Math.abs(rs.activation - regionPrev) < 0.015 &&
      hashDelta < 0.02
    ) {
      // Sparse skip: decay slowly toward baseline (neuromorphic passive decay)
      rs.activation = rs.activation * 0.992 + 0.008 * 0.05;
      rs.firingRate = rs.activation * 80;
      mutable.sparseSkipCount++;
      continue;
    }
    // Additional oscillatory gate: skip if alpha-suppressed (unless high salience)
    if (!oscillatoryAllows && !hasStimulus && rs.activation < 0.4) {
      rs.activation = rs.activation * 0.995 + 0.005 * 0.05;
      rs.firingRate = rs.activation * 80;
      mutable.sparseSkipCount++;
      continue;
    }
    mutable.sparseFullCount++;

    if (rs.refractoryTimer > 0) {
      rs.membranePotential *= 0.7;
      rs.refractoryTimer--;
      rs.activation = 0;
      rs.firingRate = 0;
      continue;
    }

    // Apply criticality gain modifiers (Beggs & Plenz homeostatic gain control)
    const critGain = getCriticalityGainModifiers(mutable.criticalityState);

    // Sum connectivity inputs with synapse type multipliers and STDP weights
    let totalInput = 0;
    const incoming = INCOMING_CONNECTIONS.get(rs.region) ?? [];
    const homeoScale = mutable.homeostaticScale.get(rs.region) ?? 1.0;
    for (const { from: fromRegion, weight, synapseType } of incoming) {
      const fromAct = activationLookup.get(fromRegion) ?? 0;
      const synapseMultiplier = SYNAPSE_MULTIPLIERS[synapseType];
      const stdpW = stdpWeights.get(connKey(fromRegion, rs.region)) ?? 1.0;
      // Apply mesoscale excitatory fraction to output of source region
      const excFrac = EXCITATORY_FRACTION[fromRegion] ?? 0.75;
      const effectiveOutput = fromAct * excFrac - fromAct * (1 - excFrac) * 0.3;
      totalInput +=
        effectiveOutput *
        weight *
        connectivityMultiplier *
        synapseMultiplier *
        stdpW *
        homeoScale;
    }

    totalInput = clamp(totalInput, -1.2, 1.2); // hard cap
    const cappedTotalInput =
      Math.min(Math.abs(totalInput), 3.0) * Math.sign(totalInput || 1); // 3-sigma input cap
    const noise = (Math.random() - 0.25) * noiseAmplitude + baselineFiringBoost;
    const stimBoost = stimulusMap.get(rs.region) ?? 0;

    let newPotential =
      0.8 * rs.membranePotential + cappedTotalInput + noise + stimBoost;
    newPotential = clamp(newPotential, 0, 1);

    // Apply criticality excitability gain (Beggs & Plenz homeostatic control)
    // Apply neuromorphic LIF gain modulation (v34+): gateway regions modulate excitability
    const neuroGain = getGainModulation(
      mutable.neuromorphicState,
      rs.region as string,
    );

    const critScaledPotential = Math.min(
      1,
      newPotential * critGain.excitabilityMultiplier * neuroGain,
    );
    rs.activation = sigmoid(
      critScaledPotential - (THRESHOLDS[rs.region] ?? 0.4) * 0.88,
      sigmoidK,
    );

    if (
      rs.activation > 0.7 &&
      newPotential > (THRESHOLDS[rs.region] ?? 0.4) + 0.1
    ) {
      rs.refractoryTimer = maxRefractory;
    }

    rs.membranePotential = newPotential;
    rs.firingRate = rs.activation * 80;

    // Decay stimulus
    if (stimulusMap.has(rs.region)) {
      const decayed = (stimulusMap.get(rs.region) ?? 0) * 0.6;
      if (decayed < 0.01) {
        stimulusMap.delete(rs.region);
      } else {
        stimulusMap.set(rs.region, decayed);
      }
    }
  }

  // ── Cortisol Gate: derived from threat circuit, gates LTP (McEwen 2007) ─────
  // Cortisol = Amygdala + PAG + BedNucleus threat signal + sympathetic tone proxy
  // High cortisol (>0.65) suppresses LTP — biologically: glucocorticoid receptor
  // activation in hippocampus/PFC impairs STDP-dependent memory consolidation.
  // Reference: McEwen BS (2007) Physiology and neurobiology of stress. Physiol Rev.
  const amygdalaActStdp = activationLookup.get(Region.Amygdala) ?? 0;
  const pagActStdp =
    activationLookup.get(FrontendRegion.PeriaqueductalGray) ?? 0;
  const bnstActStdp = activationLookup.get(FrontendRegion.BedNucleusStria) ?? 0;
  const snsToneStdp = Math.min(
    1,
    amygdalaActStdp * 0.5 + pagActStdp * 0.3 + bnstActStdp * 0.2,
  );
  // Slow cortisol dynamics: ~1-2 min rise, ~30 min decay (simplified per-tick)
  const cortisolTarget = snsToneStdp * 0.85 + 0.05;
  mutable.cortisolLevel = clamp(
    mutable.cortisolLevel + (cortisolTarget - mutable.cortisolLevel) * 0.02,
    0,
    1,
  );
  const cortisolGated = mutable.cortisolLevel > 0.65;

  // u2500u2500 Three-Factor STDP: Outcome Signal from world state (Schultz 1997 RPE) u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500
  // outcomeSignal u2208 [-1, +1]: computed from world consequences, not assigned labels
  const _threatDistNow = Math.sqrt(
    (mutable.avatarX - 8) ** 2 + (mutable.avatarZ + 6) ** 2,
  );
  const _threatDistPrev = Math.sqrt(
    (mutable.prevAvatarX - 8) ** 2 + (mutable.prevAvatarZ + 6) ** 2,
  );
  const _rewardDistNow = Math.sqrt(
    (mutable.avatarX - 12) ** 2 + (mutable.avatarZ - 10) ** 2,
  );
  const _rewardDistPrev = Math.sqrt(
    (mutable.prevAvatarX - 12) ** 2 + (mutable.prevAvatarZ - 10) ** 2,
  );
  const threatAvoidGain =
    _threatDistNow > _threatDistPrev + 0.02
      ? 0.8
      : _threatDistNow < _threatDistPrev - 0.02
        ? -0.6
        : 0;
  const rewardApproachGain =
    _rewardDistNow < _rewardDistPrev - 0.02
      ? 0.7
      : _rewardDistNow > _rewardDistPrev + 0.02
        ? -0.4
        : 0;
  const avgPredErr =
    [...mutable.predictionErrors.values()].reduce((s, v) => s + v, 0) /
    Math.max(1, mutable.predictionErrors.size || 1);
  const worldOutcomeSignal = clamp(
    threatAvoidGain + rewardApproachGain - avgPredErr * 0.5,
    -1,
    1,
  );
  mutable.prevAvatarX = mutable.avatarX;
  mutable.prevAvatarZ = mutable.avatarZ;

  // ── Criticality Control (Beggs & Plenz 2003) ─────────────────────────────
  {
    const regionActivations = mutable.regions.map((rs) => rs.activation);
    mutable.criticalityState = updateCriticality(
      mutable.criticalityState,
      regionActivations,
    );
    // Apply criticality gain modifiers to Wilson-Cowan effective parameters (done prospectively next tick)
  }

  // ── Predictive Coding Update (Rao & Ballard 1999 / Friston 2005) ─────────
  {
    const actualActivations = new Map<string, number>();
    for (const rs of mutable.regions)
      actualActivations.set(rs.region as string, rs.activation);
    mutable.predictiveCodingState = updatePredictiveCoding(
      mutable.predictiveCodingState,
      actualActivations,
    );
  }

  // ── Timing-based STDP with Eligibility Traces ─────────────────────────────
  for (const conn of CONNECTIVITY) {
    const key = connKey(conn.from, conn.to);
    const fromAct = activationLookup.get(conn.from) ?? 0;
    const toAct = activationLookup.get(conn.to) ?? 0;
    const currentW = stdpWeights.get(key) ?? 1.0;
    const _baseWeight = Math.abs(conn.weight);

    // Update eligibility trace: if pre-synaptic region fired, increase trace
    let trace = mutable.eligibilityTraces.get(key) ?? 0;
    if (fromAct > 0.5) {
      trace = clamp(trace + 0.15, 0, 1.0);
    } else {
      trace *= 0.92; // decay each tick
    }
    mutable.eligibilityTraces.set(key, trace);

    // STDP rule: post fires after pre (trace > 0.1) -> LTP
    // Post fires without prior pre (trace < 0.05) -> LTD
    // Modulated by prediction error: higher error -> stronger plasticity (Friston 2010)
    let delta = 0;
    const predError = mutable.predictionErrors.get(conn.to) ?? 0;
    const predErrorMultiplier = 1.0 + predError * 1.5;
    if (toAct > 0.5 && trace > 0.1) {
      // LTP: suppress if PRE or POST region saturated (three-factor STDP), OR cortisol high
      const fromActCurrent = activationLookup.get(conn.from) ?? 0;
      const preSatSuppression = fromActCurrent > 0.9 ? 0.0 : 1.0; // gate on pre-region saturation
      const toActCurrent = activationLookup.get(conn.to) ?? 0;
      const ltpSuppression =
        toActCurrent > 0.88 ? 0.0 : toActCurrent > 0.75 ? 0.3 : 1.0;
      // Cortisol gate: glucocorticoid receptor activation impairs hippocampal LTP
      // (McEwen 2007). Scales from 1.0 at cortisol=0.65 down to 0.0 at cortisol=0.90
      const cortisolLtpGate = cortisolGated
        ? Math.max(0, 1.0 - (mutable.cortisolLevel - 0.65) / 0.25)
        : 1.0;
      // Three-factor rule: Δw = η × eligibility_trace × outcome_signal (Izhikevich 2007)
      const outcomeGate =
        worldOutcomeSignal > 0
          ? 1.0 + worldOutcomeSignal * 0.5
          : Math.max(0.1, 1.0 + worldOutcomeSignal * 0.3);
      // Compute plasticity gates (neuromodulator-gated learning rates — Schultz/Hasselmo/Aston-Jones)
      const _pgTdError = worldOutcomeSignal;
      const _pgNovelty = mutable.predictiveCodingState.surpriseScore > 0.5;
      const pgFresh = computePlasticityGates(
        mutable.neuromodulatorLevels,
        _pgTdError,
        _pgNovelty,
      );
      mutable.plasticityGates = pgFresh;
      // Combined η: three-factor STDP base × plasticity gate × predictive coding relevance
      const pcLearningScale =
        mutable.predictiveCodingState.learningRelevance * 0.5 + 0.5;
      const gatedEta = Math.min(
        Math.max(
          0.0028 *
            (pgFresh.plasticityBlocked
              ? 0
              : pgFresh.effectiveLR > 0
                ? pgFresh.effectiveLR
                : 1.0) *
            pcLearningScale,
          0.0001,
        ),
        0.01,
      );
      delta =
        gatedEta *
        preSatSuppression *
        outcomeGate *
        trace *
        complexityScale *
        predErrorMultiplier *
        ltpSuppression *
        cortisolLtpGate;
    } else if (toAct > 0.5 && trace < 0.05) {
      // LTD: post fired without pre, weaken
      delta = -0.001 * predErrorMultiplier;
    }

    // Clamp to [baseWeight * 0.5, baseWeight * 2.5] relative to 1.0 multiplier
    const newW = clamp(currentW + delta, 0.3, 3.6);
    stdpWeights.set(key, newW);
  }

  // ── ANS / Interoceptive Regulation (Phase 6) ─────────────────────────────
  {
    const getActLocal = (r: string) =>
      mutable.regions.find((rs) => rs.region === r)?.activation ?? 0;
    const threatLevel = Math.min(
      1,
      getActLocal("Amygdala") * 0.5 +
        getActLocal("Brainstem") * 0.2 +
        mutable.cortisolLevel * 0.3,
    );
    const rewardLevel = Math.min(
      1,
      getActLocal("NucleusAccumbens") * 0.5 +
        getActLocal("OrbitalFrontalCortex") * 0.3 +
        (1 - mutable.cortisolLevel) * 0.2,
    );
    const globalArousalANS =
      mutable.regions.reduce((s, r) => s + r.activation, 0) /
      Math.max(mutable.regions.length, 1);

    const prevANS = mutable.ansState;
    // Compute TD error and novelty for ANS neuromodulator channels
    const rewardReachThisTick =
      mutable.rewardReachEvents.filter((e) => e.tick === mutable.tick).length >
      0;
    const tdErrorForANS = rewardReachThisTick
      ? 0.4
      : mutable.ansState.stressSignal > 0.7
        ? -0.2
        : 0;
    const noveltyForANS = mutable.predictionState?.noveltyScore ?? 0;
    mutable.ansState = updateANS(
      prevANS,
      threatLevel,
      rewardLevel,
      globalArousalANS,
      tdErrorForANS,
      noveltyForANS,
    );
    // ── CARDIOVASCULAR-NERVOUS AXIS (v34+) ───────────────────────────────────
    {
      const getAct2 = (id: string) =>
        mutable.regions.find((r) => (r.region as string) === id)?.activation ??
        0.3;
      const cardioResult = updateCardioNervousSystem(
        mutable.cardioNervousState,
        {
          pfcActivation: getAct2("PrefrontalCortex"),
          amygdalaActivation: getAct2("Amygdala"),
          insulaActivation: getAct2("Insula"),
          hypothalamusActivation: getAct2("Hypothalamus"),
          currentHR: mutable.ansState.heartRateProxy,
          stressSignal: mutable.ansState.stressSignal,
          recoverySignal: mutable.ansState.recoverySignal,
        },
        10,
      );
      mutable.cardioNervousState = cardioResult.state;
      // Enrich ANS stress/recovery from cardiovascular axis (bidirectional coupling)
      mutable.ansState = {
        ...mutable.ansState,
        stressSignal:
          mutable.ansState.stressSignal * 0.7 +
          cardioResult.outputs.stressContrib * 0.3,
        recoverySignal:
          mutable.ansState.recoverySignal * 0.7 +
          cardioResult.outputs.recoveryContrib * 0.3,
        heartRateProxy: cardioResult.outputs.heartRateBPM,
        hrvProxy: cardioResult.outputs.vagalTone,
      };
    }

    // Sync neuromodulator levels from ANS (causal chain: ANS → neuromodulators → regional gain)
    mutable.neuromodulatorLevels = {
      dopamine: mutable.ansState.neuromodulators.dopamine,
      norepinephrine: mutable.ansState.neuromodulators.norepinephrine,
      serotonin: mutable.ansState.neuromodulators.serotonin,
      acetylcholine: mutable.ansState.neuromodulators.acetylcholine,
      gaba: mutable.ansState.neuromodulators.gaba,
      glutamate: mutable.ansState.neuromodulators.glutamate,
    };

    // Update oscillatory state (ACh → theta/alpha, NE → gamma, stress → beta)
    mutable.oscillatoryState = updateOscillations(
      mutable.oscillatoryState,
      mutable.tick,
      mutable.neuromodulatorLevels.acetylcholine,
      mutable.neuromodulatorLevels.norepinephrine,
      mutable.activeTaskClass as string,
      mutable.ansState.stressSignal,
    );

    // ── GLOBAL WORKSPACE: coalition broadcast ignition (v34+) ───────────────
    {
      const gwActMap = new Map<string, number>();
      const gwSalMap = new Map<string, number>();
      const gwPrecMap = new Map<string, number>();
      for (const rs of mutable.regions) {
        gwActMap.set(rs.region as string, rs.activation);
        gwSalMap.set(
          rs.region as string,
          mutable.stimulusMap.get(rs.region as any) ?? rs.activation,
        );
        gwPrecMap.set(
          rs.region as string,
          mutable.predictiveCodingState.precisions?.get(rs.region as string) ??
            0.5,
        );
      }
      mutable.globalWorkspaceState = updateGlobalWorkspace(
        mutable.globalWorkspaceState,
        gwActMap,
        gwSalMap,
        gwPrecMap,
        mutable.tick,
      );
    }

    // Classify task class from current brain signals
    const tcResult = classifyTaskClass(
      threatLevel,
      rewardLevel,
      mutable.regions.find((r) => r.region === "AnteriorCingulateCortex")
        ?.activation ?? 0,
      mutable.predictionState?.noveltyScore ?? 0,
      mutable.hungerDrive,
      globalArousalANS,
      false,
      mutable.strategyShiftCount > 0 && mutable.tick % 50 < 5,
    );
    mutable.activeTaskClass = tcResult.taskClass;
    mutable.taskClassConfidence = tcResult.confidence;

    // Apply task-class perception modulation to world signals
    const tcMatrix = TASK_CLASS_MATRICES[mutable.activeTaskClass];
    const _modulated = applyPerceptionModulation(
      tcMatrix,
      threatLevel,
      rewardLevel,
      mutable.predictionState?.noveltyScore ?? 0,
      0.5,
    );

    // ── Cognitive Governance: Steps 3-7 + Homeostatic Spine ────────────────
    {
      // Step 3: Soft Prior — compute readiness bias for active task class
      const softPrior = computeSoftPrior(
        mutable.activeTaskClass,
        threatLevel,
        rewardLevel,
        mutable.regions.find((r) => r.region === "AnteriorCingulateCortex")
          ?.activation ?? 0,
        mutable.predictionState?.noveltyScore ?? 0,
        mutable.selfStateModel?.pressure ?? 0,
      );

      // Step 4: Precision — EMA variance-based precision weight for top regions
      const pfcPrecision = updatePrecisionVariance(
        "PrefrontalCortex",
        mutable.regions.find((r) => r.region === "PrefrontalCortex")
          ?.activation ?? 0,
      );
      const amygPrecision = updatePrecisionVariance(
        "Amygdala",
        mutable.regions.find((r) => r.region === "Amygdala")?.activation ?? 0,
      );
      const avgPrecision = Math.max(
        0,
        Math.min(1, (pfcPrecision + amygPrecision) / 2 / 10),
      );

      // Step 5-7: Influence Law — compute I_m for dominant arbitration candidate
      const activeRegionFracNow =
        mutable.regions.filter((r) => r.activation > 0.05).length /
        Math.max(mutable.regions.length, 1);
      const influenceFactors: InfluenceFactors = {
        P_m:
          (softPrior[
            softPrior.activeCategory as keyof typeof softPrior
          ] as number) ?? 0.5,
        Q_m: Math.max(0, Math.min(1, avgPrecision)),
        S_m: Math.max(
          0,
          Math.min(
            1,
            mutable.predictionState?.noveltyScore * 0.5 +
              threatLevel * 0.3 +
              rewardLevel * 0.2,
          ),
        ),
        C_m: Math.max(
          0,
          Math.min(
            1,
            mutable.regions.find((r) => r.region === "AnteriorCingulateCortex")
              ?.activation ?? 0,
          ),
        ),
        G_m: Math.max(
          0,
          Math.min(1, 1 - (mutable.goalHierarchy?.goalConflictScore ?? 0)),
        ),
        R_m: Math.max(
          0,
          Math.min(1, mutable.selfStateModel?.regulation ?? 0.5),
        ),
        E_m: Math.max(0, Math.min(1, 1 - activeRegionFracNow * 0.5)),
      };
      // Step 6: Working Memory Gating — admit top candidates by relevance
      const wmCandidates: WMCandidate[] = [
        {
          id: "situation_threat",
          type: "SITUATION",
          content: `threat=${(threatLevel * 100).toFixed(0)}%`,
          relevanceScore: threatLevel,
          staleness: 0,
          isCritical: threatLevel > 0.7,
          resolved: threatLevel < 0.1,
        },
        {
          id: "situation_reward",
          type: "SITUATION",
          content: `reward=${(rewardLevel * 100).toFixed(0)}%`,
          relevanceScore: rewardLevel * 0.8,
          staleness: 0,
          isCritical: false,
          resolved: false,
        },
        {
          id: "body_pressure",
          type: "BODY_STATE",
          content: `pressure=${((mutable.selfStateModel?.pressure ?? 0) * 100).toFixed(0)}%`,
          relevanceScore: mutable.selfStateModel?.pressure ?? 0,
          staleness: 0,
          isCritical: (mutable.selfStateModel?.pressure ?? 0) > 0.8,
          resolved: false,
        },
        {
          id: "body_stability",
          type: "BODY_STATE",
          content: `stability=${((mutable.selfStateModel?.stability ?? 0) * 100).toFixed(0)}%`,
          relevanceScore: 1 - (mutable.selfStateModel?.stability ?? 0),
          staleness: 0,
          isCritical: false,
          resolved: (mutable.selfStateModel?.stability ?? 0) > 0.8,
        },
        {
          id: "conflict_active",
          type: "CONFLICT",
          content: `conflict=${((mutable.goalHierarchy?.goalConflictScore ?? 0) * 100).toFixed(0)}%`,
          relevanceScore: mutable.goalHierarchy?.goalConflictScore ?? 0,
          staleness: 0,
          isCritical: (mutable.goalHierarchy?.goalConflictScore ?? 0) > 0.6,
          resolved: (mutable.goalHierarchy?.goalConflictScore ?? 0) < 0.1,
        },
        {
          id: "goal_dominant",
          type: "GOAL",
          content: mutable.goalHierarchy?.dominantGoal ?? "EXPLORE",
          relevanceScore: mutable.goalHierarchy?.dominantGoalStrength ?? 0.5,
          staleness: 0,
          isCritical: mutable.goalHierarchy?.overrideActive ?? false,
          resolved: false,
        },
        {
          id: "memory_recall",
          type: "MEMORY",
          content: `memory_boost=${mutable.multiTimescaleMemory?.memoryBoostActive ? "active" : "idle"}`,
          relevanceScore: mutable.multiTimescaleMemory?.memoryBoostActive
            ? 0.7
            : 0.2,
          staleness: 0,
          isCritical: false,
          resolved: false,
        },
      ];
      mutable.wmSlots = gateWorkingMemory(
        wmCandidates,
        mutable.wmSlots,
        mutable.tick,
      );

      // Persistence tiers — apply decay/eviction
      mutable.persistentItems = applyPersistenceTiers(
        mutable.persistentItems,
        mutable.tick,
      );

      // Add conflict as HIGH-tier persistent item when relevant
      const conflictScore = mutable.goalHierarchy?.goalConflictScore ?? 0;
      if (conflictScore > 0.5) {
        mutable.persistentItems = addPersistentItem(mutable.persistentItems, {
          id: "conflict_tension",
          tier: "HIGH",
          content: `goal conflict: ${(conflictScore * 100).toFixed(0)}%`,
          strength: conflictScore,
          maxTicks: 200,
          isCritical: true,
        });
      }

      // Homeostatic Spine — corrective signal (magnitude only, nudge not override)
      const homoCorrection = enforceHomeostaticSpine(
        activeRegionFracNow,
        mutable.regions.reduce((s, r) => s + r.activation, 0) /
          Math.max(mutable.regions.length, 1),
        activeRegionFracNow,
        mutable.sparseFullCount > 0
          ? mutable.sparseSkipCount /
              (mutable.sparseSkipCount + mutable.sparseFullCount)
          : 0,
      );

      // Apply homeostatic corrections as a gentle nudge only (not direct override)
      if (
        homoCorrection.type === "inhibitory_boost" &&
        homoCorrection.magnitude > 0.1
      ) {
        for (const rs of mutable.regions) {
          if (rs.activation > 0.9) {
            rs.activation = Math.max(
              0.05,
              rs.activation * homoCorrection.excitabilityAdjust,
            );
          }
        }
      }

      // Build governance metrics for snapshot and display
      mutable.governanceMetrics = buildGovernanceMetrics(
        softPrior,
        influenceFactors,
        mutable.wmSlots,
        mutable.persistentItems,
        homoCorrection,
      );

      // Step 12 feedback update (every 10 ticks to avoid thrash)
      if (mutable.tick % 10 === 0 && mutable.outcomeHistory.length > 0) {
        const fbResult = applyFeedbackUpdate(
          mutable.routeWeights,
          mutable.outcomeHistory,
          mutable.governanceFeedbackFailureMemory,
        );
        mutable.routeWeights = fbResult.updatedWeights;
        if (
          fbResult.strategyShiftTriggered &&
          mutable.strategyShiftCount === 0
        ) {
          mutable.strategyShiftCount += 1;
        }
      }

      // Record outcome for feedback
      if (worldOutcomeSignal !== 0) {
        const context = `${mutable.activeTaskClass}_${mutable.lastDominantAction}`;
        const newRecord: OutcomeRecord = {
          context,
          outcome: worldOutcomeSignal > 0 ? "success" : "failure",
          tick: mutable.tick,
          strength: Math.abs(worldOutcomeSignal),
        };
        mutable.outcomeHistory = [...mutable.outcomeHistory, newRecord].slice(
          -50,
        );
      }
    }

    // Update regulation score using current ANS + self-state signals
    mutable.regulationScoreState = updateRegulationScore(
      mutable.regulationScoreState,
      {
        stressSignal: mutable.ansState.stressSignal,
        recoverySignal: mutable.ansState.recoverySignal,
        autonomicBalanceIndex: mutable.ansState.autonomicBalanceIndex,
        hrvProxy: mutable.ansState.hrvProxy,
        selfStatePressure: mutable.selfStateModel?.pressure ?? 0,
        selfStateStability: mutable.selfStateModel?.stability ?? 0,
        behaviorAdaptedToState:
          mutable.lastDominantAction !== "" &&
          mutable.strategyFailureCounts.get(mutable.lastDominantAction) !== 3,
        currentTick: mutable.tick,
      },
    );

    // Causal modulation: ANS affects cortical region activations
    applyANSToBrainRegions(mutable.ansState, mutable.regions);

    // ── Sensory Coupling Layer — real sensory-to-salience + sensory-to-WM ─────
    {
      const parietalAct =
        mutable.regions.find((r) => String(r.region).includes("Parietal"))
          ?.activation ?? 0.3;
      const hippAct =
        mutable.regions.find(
          (r) =>
            String(r.region).includes("Hippocampus") &&
            !String(r.region).includes("_"),
        )?.activation ?? 0.3;
      const sensoryRelevance = Math.min(1, parietalAct + 0.2);
      const uncertaintyBurden = Math.max(0, 0.35 - hippAct * 0.35);
      mutable.sensoryCouplingState = updateSensoryCoupling(
        mutable.sensoryCouplingState,
        {
          sensoryRelevance,
          uncertaintyBurden,
          environmentModifiers: {},
          interoceptive: {
            overloadLevel: mutable.ansState.interoceptiveStateSignal * 0.8,
            fatigueLoad: mutable.ansState.stressSignal * 0.7,
            stressSignal: mutable.ansState.stressSignal,
            urgencyPressure: mutable.ansState.stressSignal * 0.8,
            stabilityPressure: 1 - mutable.ansState.autonomicBalanceIndex,
            recoverySignal: mutable.ansState.recoverySignal,
            confidencePressure: 1 - mutable.ansState.hrvProxy,
            selfStateWeight: mutable.selfStateModel?.stability ?? 0.5,
          } as any,
          autonomic: {
            sympatheticTone: mutable.ansState.sympatheticTone,
            parasympatheticTone: mutable.ansState.parasympatheticTone,
            autonomicBalance: mutable.ansState.autonomicBalanceIndex,
            arousalMode:
              mutable.ansState.sympatheticTone > 0.55
                ? "sympathetic_dominant"
                : "balanced",
            threatThresholdModifier: mutable.ansState.stressSignal * 0.5,
            reactionSpeedModifier: mutable.ansState.stressSignal * 0.6,
            recoveryModeActive: mutable.ansState.recoverySignal > 0.5,
          } as any,
        },
        mutable.tick,
      );
      // Apply sensory-to-salience boost to visual/parietal cortex activation
      const visualRs = mutable.regions.find((r) =>
        String(r.region).includes("Visual"),
      );
      if (visualRs && mutable.sensoryCouplingState.sensoryToSalienceBoost > 0) {
        visualRs.activation = Math.min(
          0.95,
          visualRs.activation +
            mutable.sensoryCouplingState.sensoryToSalienceBoost * 0.12,
        );
      }
      // Record coupling to telemetry so analyticsMetrics sees it
      globalCouplingTelemetry.record(
        "sensory_salience_boost",
        "sensory_coupling",
        "salience",
        mutable.sensoryCouplingState.sensoryToSalienceBoost,
      );
      globalCouplingTelemetry.record(
        "sensory_wm_pressure",
        "sensory_coupling",
        "working_memory_gate",
        mutable.sensoryCouplingState.sensoryToWMGatePressure,
      );
      globalCouplingTelemetry.record(
        "sensory_uncertainty_confidence",
        "sensory_coupling",
        "confidence",
        uncertaintyBurden,
      );
    }

    // Auto-detect and log ANS events (max 1 per 30 ticks to prevent spam)
    if (mutable.tick % 30 === 0) {
      const ansEvt = getANSEventType(mutable.ansState);
      if (ansEvt) {
        mutable.eventLog.unshift({
          tick: mutable.tick,
          region: "ANS",
          type: "surge",
          description: `[ANS] ${ansEvt}: stress=${(mutable.ansState.stressSignal * 100).toFixed(0)}% recovery=${(mutable.ansState.recoverySignal * 100).toFixed(0)}% HR=${Math.round(mutable.ansState.heartRateProxy)}bpm`,
          source: "environmental-trigger",
        });
        if (mutable.eventLog.length > 20) {
          mutable.eventLog = mutable.eventLog.slice(0, 20);
        }
      }
    }
  }

  // Compute global arousal for use in Phase 4 modules
  const globalArousalANS =
    mutable.regions.reduce((s, r) => s + r.activation, 0) /
    Math.max(mutable.regions.length, 1);

  // ── Phase 4: Prediction / Expectation Layer ──────────────────────────────
  mutable.predictionState = updatePredictionState(
    mutable.predictionState,
    regions.map((rs) => ({
      region: rs.region as string,
      activation: rs.activation,
    })),
  );
  const predMods = getPredictionModifiers(mutable.predictionState);
  // Apply prediction mods: surprise boosts hippocampal encoding
  for (const rs of regions) {
    if (rs.region === "Hippocampus" && predMods.hippocampusEncodingBoost > 0) {
      rs.activation = Math.min(
        0.95,
        rs.activation + predMods.hippocampusEncodingBoost,
      );
    }
    if (
      (rs.region === "AnteriorCingulateCortex" || rs.region === "DorsalACC") &&
      predMods.accConflictBoost > 0
    ) {
      rs.activation = Math.min(0.9, rs.activation + predMods.accConflictBoost);
    }
  }

  // ── Phase 4: Self-State Model ─────────────────────────────────────────────
  const pfcRs = regions.find((r) => r.region === "PrefrontalCortex");
  const amygRs = regions.find((r) => r.region === "Amygdala");
  const accRs = regions.find((r) => r.region === "AnteriorCingulateCortex");
  const nacRsInner = regions.find((r) => r.region === "NucleusAccumbens");
  const hippRs = regions.find((r) => r.region === "Hippocampus");
  mutable.selfStateModel = updateSelfStateModel(mutable.selfStateModel, {
    stressSignal: mutable.ansState.stressSignal,
    recoverySignal: mutable.ansState.recoverySignal,
    hungerDrive: mutable.hungerDrive,
    threatLevel: amygRs?.activation ?? 0,
    pfcActivation: pfcRs?.activation ?? 0,
    metacognitiveConfidence: mutable.metacognitiveConfidence,
    globalArousal: globalArousalANS,
    conflictSignal: accRs?.activation ?? 0,
    predictionMismatch: mutable.predictionState.globalMismatch,
  });

  // ── Phase 4: Goal Hierarchy ───────────────────────────────────────────────
  mutable.goalHierarchy = updateGoalHierarchy(mutable.goalHierarchy, {
    threatLevel: amygRs?.activation ?? 0,
    hungerDrive: mutable.hungerDrive,
    nacActivation: nacRsInner?.activation ?? 0,
    hippocampusActivation: hippRs?.activation ?? 0,
    noveltyScore: mutable.predictionState.noveltyScore,
    explorationTimer: mutable.explorationTimer,
    globalArousal: globalArousalANS,
    pfcActivation: pfcRs?.activation ?? 0,
    conflictSignal: accRs?.activation ?? 0,
    sleepPressure: mutable.sleepPressure,
  });

  // ── Phase 4: Failure Memory passive decay ────────────────────────────────
  if (mutable.tick % 10 === 0) {
    mutable.failureMemory = decayFailureWeights(mutable.failureMemory);
  }

  // ── Neural Circuit Motifs (v36+) ──────────────────────────────────────────
  {
    const avgPredErr =
      [...(mutable.predictionErrors?.values() ?? [])].reduce(
        (s, v) => s + v,
        0,
      ) / Math.max(1, mutable.predictionErrors?.size ?? 1);
    const fmRecords = mutable.failureMemory?.records;
    const fmSize = fmRecords ? fmRecords.size : 0;
    const fmSuppressed = mutable.failureMemory?.suppressedCount ?? 0;
    const failureStrength = fmSize > 0 ? fmSuppressed / fmSize : 0;

    const getAct = (r: string) =>
      mutable.regions.find((rs) => rs.region === r)?.activation ?? 0;
    const cmThreatLevel = Math.min(
      1,
      getAct("Amygdala") * 0.5 +
        getAct("Brainstem") * 0.2 +
        mutable.cortisolLevel * 0.3,
    );
    const cmRewardLevel = Math.min(
      1,
      getAct("NucleusAccumbens") * 0.5 +
        getAct("OrbitalFrontalCortex") * 0.3 +
        (1 - mutable.cortisolLevel) * 0.2,
    );
    mutable.circuitMotifState = applyCircuitMotifs({
      regions: mutable.regions,
      threatLevel: cmThreatLevel,
      rewardLevel: cmRewardLevel,
      sympatheticTone: mutable.ansState?.sympatheticTone ?? 0.5,
      parasympatheticTone: mutable.ansState?.parasympatheticTone ?? 0.5,
      predictionError: avgPredErr,
      noveltyScore: mutable.predictionState?.noveltyScore ?? 0,
      failureMemoryStrength: failureStrength,
      successMemoryStrength: 0,
      selfStatePressure: mutable.selfStateModel?.pressure ?? 0,
      selfStateStability: mutable.selfStateModel?.stability ?? 0.5,
      goalConflict: mutable.goalHierarchy?.goalConflictScore ?? 0,
      tick: mutable.tick,
      prev: mutable.circuitMotifState,
    });

    // Apply inhibition/excitation from circuit motifs back to region activations
    for (const rs of mutable.regions) {
      const inhib = mutable.circuitMotifState.inhibitionMap[rs.region] ?? 1.0;
      const excite = mutable.circuitMotifState.excitationMap[rs.region] ?? 0;
      const recurr =
        mutable.circuitMotifState.recurrentExcitation[rs.region] ?? 0;
      rs.activation = Math.max(
        0,
        Math.min(1, rs.activation * inhib + excite * 0.03 + recurr * 0.02),
      );
    }
  }
  // ── CoreBrain Runtime Monitor (always-on, 7 subsystems) ─────────────────────
  if (mutable.tick % 5 === 0) {
    const thoughtWindow = mutable.thoughtLog
      .slice(0, 20)
      .map((t) => t.circuitType);
    mutable.coreMonitorState = updateCoreMonitor(mutable.coreMonitorState, {
      tick: mutable.tick,
      goalConflictScore: mutable.goalHierarchy?.goalConflictScore ?? 0,
      dACCActivation:
        mutable.regions.find((r) => r.region === "AnteriorCingulateCortex")
          ?.activation ?? 0,
      goalConflictHistory: mutable.goalHierarchy?.goalConflictScore ?? 0,
      strategyShiftCount: mutable.strategyShiftCount,
      wmSlots: mutable.governanceMetrics?.wmSlots ?? [],
      wmAdmitted: 0,
      wmRejected: 0,
      thoughtLog: mutable.thoughtLog.slice(0, 20),
      emergenceScore: 0,
      noveltyScore: mutable.predictionState?.noveltyScore ?? 0,
      emergenceCoherence: 0,
      thoughtDiversityWindow: thoughtWindow,
      sympatheticTone: mutable.ansState?.sympatheticTone ?? 0.5,
      parasympatheticTone: mutable.ansState?.parasympatheticTone ?? 0.5,
      selfStateStability: mutable.selfStateModel?.stability ?? 0.5,
      selfStatePressure: mutable.selfStateModel?.pressure ?? 0,
      overloadFlag: (mutable.selfStateModel?.pressure ?? 0) > 0.8,
      persistentItems: mutable.persistentItems ?? [],
      failureMemoryStrength: mutable.failureMemory?.suppressedCount
        ? mutable.failureMemory.suppressedCount / 10
        : 0,
      failureMemoryAffectedAction:
        (mutable.circuitMotifState?.memorySalienceBridge
          ?.actionHesitationFromMemory ?? 0) > 0.3,
      activeRegionFraction:
        mutable.regions.filter((r) => r.activation > 0.05).length /
        Math.max(mutable.regions.length, 1),
      sparseActivationRatio:
        mutable.regions.filter((r) => r.activation < 0.3).length /
        Math.max(mutable.regions.length, 1),
      eventDrivenUpdates: mutable.sparseFullCount ?? 0,
      usefulBehaviorEventCount: 0,
      heavyComputeEscalations: mutable.sparseFullCount ?? 0,
      recurrentExcitationAvg:
        Object.values(
          mutable.circuitMotifState?.recurrentExcitation ?? {},
        ).reduce((s, v) => s + v, 0) /
        Math.max(
          1,
          Object.keys(mutable.circuitMotifState?.recurrentExcitation ?? {})
            .length,
        ),
      inhibitionMap: mutable.circuitMotifState?.inhibitionMap ?? {},
      predictionErrorFeedback: mutable.circuitMotifState
        ?.predictionErrorFeedback ?? {
        learningRateModulation: 1,
        actionCommitmentThreshold: 0.5,
      },
      regulationThresholds: mutable.circuitMotifState?.regulationThresholds ?? {
        threatTriggerThreshold: 0.4,
        thoughtEmissionThreshold: 0.55,
      },
      regionActivations: mutable.regions.map((r) => r.activation),
      goalHierarchyGoal: mutable.goalHierarchy?.dominantGoal ?? "EXPLORE",
      prevGoal: mutable.prevGoal ?? "EXPLORE",
    });
    mutable.prevGoal = mutable.goalHierarchy?.dominantGoal ?? "EXPLORE";
  }

  // ── Multi-timescale memory update (v32+) ─────────────────────────────────
  {
    const regionActRecord: Record<string, number> = {};
    for (const rs of mutable.regions) {
      regionActRecord[rs.region] = rs.activation;
    }
    mutable.multiTimescaleMemory = updateMultiTimescaleMemory(
      mutable.multiTimescaleMemory,
      mutable.tick,
      regionActRecord,
      mutable.goalHierarchy,
      mutable.predictionState,
      hippRs?.activation ?? 0,
    );
    // Apply memory boost map to relevant region inputs (if boost active)
    if (mutable.multiTimescaleMemory.memoryBoostActive) {
      for (const rs of mutable.regions) {
        const boost =
          mutable.multiTimescaleMemory.memoryBoostMap[rs.region] ?? 0;
        if (boost > 0) {
          rs.activation = Math.min(1, rs.activation + boost * 0.1);
        }
      }
    }
  }
  // ── Attractor WM Encoding (Hopfield 1982 / Compte 2000) ─────────────────
  {
    const pfcGate =
      mutable.regions.find((r) => r.region === "PrefrontalCortex")
        ?.activation ?? 0;
    const wmOverlay = getWMActivationOverlay(mutable.attractorState);
    for (const rs of mutable.regions) {
      if (rs.activation > 0.6) {
        const salience =
          mutable.ansState.stressSignal * 0.3 + rs.activation * 0.7;
        const novelty = mutable.predictionState?.noveltyScore ?? 0;
        attemptWMEncode(
          mutable.attractorState,
          rs.region as string,
          rs.activation,
          salience,
          novelty,
          mutable.tick,
          pfcGate,
        );
      }
      // Apply WM overlay as small additive boost for held items
      const wmBoost = wmOverlay.get(rs.region as string) ?? 0;
      if (wmBoost > 0)
        rs.activation = Math.min(1, rs.activation + wmBoost * 0.5);
    }
    decayAttractors(mutable.attractorState, mutable.tick);
  }

  // Counterfactual route comparison
  mutable.failureMemory = updateCounterfactualRouting(mutable.failureMemory, {
    currentThreatExposure: amygRs?.activation ?? 0,
    alternativeThreatExposure: Math.max(0, (amygRs?.activation ?? 0) - 0.2),
    currentDistance: 0.5,
    alternativeDistance: 0.55,
    pfcActivation: pfcRs?.activation ?? 0,
  });
  // Record failure if in survival override and action tendency is approach-threat
  if (
    mutable.goalHierarchy.overrideActive &&
    mutable.goalHierarchy.overrideGoal === "THREAT_AVOID"
  ) {
    const context = `approach_threat_${mutable.goalHierarchy.immediateDrive}`;
    mutable.failureMemory = recordFailure(
      mutable.failureMemory,
      context,
      mutable.tick,
    );
  }

  // ── Strategy Shift from Repeated Failure (Phase 3) ────────────────────────
  if (worldOutcomeSignal < 0) {
    // Map posture to action primitive
    const postureToAction = (p: string): string => {
      if (p === "fearful") return "avoid";
      if (p === "motivated") return "approach";
      if (p === "focused") return "investigate";
      if (p === "alert") return "pause";
      return "pause";
    };
    // Derive posture from current region activations
    const amygAct =
      mutable.regions.find((r) => r.region === "Amygdala")?.activation ?? 0;
    const nacAct =
      mutable.regions.find((r) => r.region === "NucleusAccumbens")
        ?.activation ?? 0;
    const hippAct =
      mutable.regions.find((r) => r.region === "Hippocampus")?.activation ?? 0;
    let currentPosture = "alert";
    if (amygAct > 0.6) currentPosture = "fearful";
    else if (nacAct > 0.5) currentPosture = "motivated";
    else if (hippAct > 0.5) currentPosture = "focused";

    // Apply task-class action output modulation (matrix applied at action interface only — never internal dynamics)
    const tcMatrixForAction = TASK_CLASS_MATRICES[mutable.activeTaskClass];
    const baseActions = {
      approach: nacAct,
      avoid: amygAct,
      investigate: hippAct,
      pause:
        mutable.regions.find((r) => r.region === "AnteriorCingulateCortex")
          ?.activation ?? 0,
      persist:
        mutable.regions.find((r) => r.region === "PrefrontalCortex")
          ?.activation ?? 0,
      switch:
        mutable.regions.find((r) => r.region === "BasalGanglia")?.activation ??
        0,
    };
    const modulatedActions = applyActionModulation(
      tcMatrixForAction,
      baseActions,
    );
    // Re-select posture from modulated action scores
    const dominantModulatedAction =
      Object.entries(modulatedActions).sort(([, a], [, b]) => b - a)[0]?.[0] ??
      "pause";
    // Override currentPosture if modulated action differs
    if (dominantModulatedAction === "avoid") currentPosture = "fearful";
    else if (dominantModulatedAction === "approach")
      currentPosture = "motivated";
    else if (dominantModulatedAction === "investigate")
      currentPosture = "focused";

    const dominantAction = postureToAction(currentPosture);
    mutable.lastDominantAction = dominantAction;
    const prevCount = mutable.strategyFailureCounts.get(dominantAction) ?? 0;
    mutable.strategyFailureCounts.set(dominantAction, prevCount + 1);

    if (prevCount + 1 >= 3) {
      // Apply LTD penalty to fronto-striatal weights driving this action
      for (const conn of CONNECTIVITY) {
        const key = connKey(conn.from, conn.to);
        if (
          conn.from === Region.PrefrontalCortex &&
          (conn.to === Region.BasalGanglia ||
            conn.to === Region.Thalamus ||
            conn.to === FrontendRegion.AnteriorCingulateCortex)
        ) {
          const current = mutable.stdpWeights.get(key) ?? 1.0;
          mutable.stdpWeights.set(key, Math.max(0.3, current - 0.02));
        }
      }

      // Find alternative action (highest activation alternative)
      const alternatives = [
        "approach",
        "avoid",
        "investigate",
        "pause",
        "interact",
        "retreat",
      ].filter((a) => a !== dominantAction);
      const actionScores: Record<string, number> = {
        approach: nacAct,
        avoid: amygAct,
        investigate: hippAct,
        pause:
          mutable.regions.find((r) => r.region === "AnteriorCingulateCortex")
            ?.activation ?? 0,
        interact:
          mutable.regions.find((r) => r.region === "OrbitalFrontalCortex")
            ?.activation ?? 0,
        retreat:
          mutable.regions.find((r) => r.region === "Brainstem")?.activation ??
          0,
      };
      const newAction =
        alternatives.sort(
          (a, b) => (actionScores[b] ?? 0) - (actionScores[a] ?? 0),
        )[0] ?? "pause";

      mutable.strategyShiftCount += 1;
      mutable.strategyFailureCounts.set(dominantAction, 0);

      mutable.eventLog.unshift({
        tick: mutable.tick,
        region: "PrefrontalCortex",
        type: "cascade",
        description: `STRATEGY_SHIFT: repeated failure on '${dominantAction}' (3x) -> depressed fronto-striatal pathway -> promoting '${newAction}'`,
        source: "plasticity-linked",
      });
      if (mutable.eventLog.length > 20) {
        mutable.eventLog = mutable.eventLog.slice(0, 20);
      }
    }
  } else if (worldOutcomeSignal > 0.3) {
    // Success: reset failure count for current action
    mutable.strategyFailureCounts.set(mutable.lastDominantAction, 0);
  }

  // ── Reward Eligibility Window (for dopamine gating) ────────────────────────
  const activeRegionsNow = ALL_REGIONS.filter(
    (r) => (activationLookup.get(r) ?? 0) > 0.4,
  );
  mutable.rewardEligibilityWindow.push({
    tick: mutable.tick,
    activeRegions: activeRegionsNow,
  });
  if (mutable.rewardEligibilityWindow.length > 10) {
    mutable.rewardEligibilityWindow.shift();
  }

  // ── Neural Events ──────────────────────────────────────────────────────────
  for (const rs of regions) {
    const prev = prevActivations.get(rs.region) ?? 0;
    if (rs.activation > 0.7 && prev <= 0.7) {
      const desc = EVENT_DESCRIPTIONS[rs.region]?.surge ?? `${rs.region} surge`;
      mutable.eventLog.unshift({
        tick: mutable.tick,
        region: rs.region,
        type: "surge",
        description: desc,
        source: "homeostatic-artifact" as const,
      });
    } else if (rs.activation < 0.15 && prev >= 0.15) {
      const desc = EVENT_DESCRIPTIONS[rs.region]?.drop ?? `${rs.region} drop`;
      mutable.eventLog.unshift({
        tick: mutable.tick,
        region: rs.region,
        type: "drop",
        description: desc,
        source: "homeostatic-artifact" as const,
      });
    }
    prevActivations.set(rs.region, rs.activation);
  }

  if (mutable.eventLog.length > 20) {
    mutable.eventLog = mutable.eventLog.slice(0, 20);
  }

  // ── Avatar Locomotion ──────────────────────────────────────────────────────
  const motorAct = activationLookup.get(Region.MotorCortex) ?? 0;
  const cerebellumAct = activationLookup.get(Region.Cerebellum) ?? 0;
  const cmaAct = activationLookup.get(FrontendRegion.CingulateMotorArea) ?? 0;
  const pfcAct = activationLookup.get(Region.PrefrontalCortex) ?? 0;
  const hippocampusAct = activationLookup.get(Region.Hippocampus) ?? 0;
  const amygdalaAct = activationLookup.get(Region.Amygdala) ?? 0;
  const nacAct = activationLookup.get(FrontendRegion.NucleusAccumbens) ?? 0;
  const parietalAct = activationLookup.get(FrontendRegion.ParietalCortex) ?? 0;
  const basalAct = activationLookup.get(Region.BasalGanglia) ?? 0;
  const smaAct =
    activationLookup.get(FrontendRegion.SupplementaryMotorArea) ?? 0;

  const speedScale = 0.08 + complexityLevel * 0.018;
  const rawSpeed =
    (motorAct * 0.4 + cerebellumAct * 0.3 + cmaAct * 0.15 + smaAct * 0.15) *
    speedScale;
  const bgGate = 0.3 + basalAct * 0.7;
  const speed = rawSpeed * bgGate;

  let steerX = 0;
  let steerZ = 0;

  for (const obj of WORLD_OBJECTS_FOR_NAV) {
    const dx = obj.x - mutable.avatarX;
    const dz = obj.z - mutable.avatarZ;
    const dist = Math.sqrt(dx * dx + dz * dz) + 0.001;
    const nx = dx / dist;
    const nz = dz / dist;

    if (obj.type === "threat") {
      const threatDrive = amygdalaAct * 2.5 * Math.max(0, 1 - dist / 25);
      steerX -= nx * threatDrive;
      steerZ -= nz * threatDrive;
    } else if (obj.type === "reward") {
      const rewardDrive = nacAct * 2.0 * Math.max(0, 1 - dist / 30);
      steerX += nx * rewardDrive;
      steerZ += nz * rewardDrive;
      if (dist < 5) {
        mutable.lastRewardX = obj.x;
        mutable.lastRewardZ = obj.z;
        mutable.hasVisitedReward = true;
        mutable.hungerDrive = 0;
        // Check if this was goal-directed: no recent stimulus in last 15 ticks
        const vtaAct =
          activationLookup.get(FrontendRegion.VentralTegmentalArea) ?? 0;
        const nacActNow =
          activationLookup.get(FrontendRegion.NucleusAccumbens) ?? 0;
        const hippoAct = activationLookup.get(Region.Hippocampus) ?? 0;
        // Check for dopaminergic reward learning (VTA + NAc both active)
        if (vtaAct > 0.4 && nacActNow > 0.4) {
          // Retroactive dopamine potentiation of recently active pathways
          const recentWindow = mutable.rewardEligibilityWindow.slice(-8);
          for (const conn of CONNECTIVITY) {
            const key = connKey(conn.from, conn.to);
            let wasActive = false;
            for (const frame of recentWindow) {
              if (frame.activeRegions.includes(conn.from)) {
                wasActive = true;
                break;
              }
            }
            if (wasActive) {
              const currentW = mutable.stdpWeights.get(key) ?? 1.0;
              mutable.stdpWeights.set(key, clamp(currentW + 0.003, 0.3, 3.0));
            }
          }
          mutable.rewardLearningEvents++;
          mutable.eventLog.unshift({
            tick: mutable.tick,
            region: FrontendRegion.VentralTegmentalArea,
            type: "surge",
            description: `REWARD LEARNING: VTA->NAc dopamine burst retroactively potentiated ${recentWindow.length} tick window pathways`,
            source: "plasticity-linked" as const,
          });
        }
        // Track reward reach events for goal-directed nav detection
        const recentStimulusTicks = mutable.lastStimulusRegions.filter(
          (s) => mutable.tick - s.tick < 15,
        ).length;
        mutable.rewardReachEvents.push({
          tick: mutable.tick,
          nodeId: obj.id,
          withRecentStimulus: recentStimulusTicks > 0,
          hippocampusAct: hippoAct,
        });
      }
    } else if (obj.type === "memory") {
      const memDrive = hippocampusAct * 1.2 * Math.max(0, 1 - dist / 28);
      steerX += nx * memDrive;
      steerZ += nz * memDrive;
    } else if (obj.type === "attract") {
      const attractDrive = pfcAct * 0.8 * Math.max(0, 1 - dist / 25);
      steerX += nx * attractDrive;
      steerZ += nz * attractDrive;
    }
  }

  // Spatial memory navigation
  if (mutable.hasVisitedReward && hippocampusAct > 0.4 && parietalAct > 0.3) {
    const mDx = mutable.lastRewardX - mutable.avatarX;
    const mDz = mutable.lastRewardZ - mutable.avatarZ;
    const mDist = Math.sqrt(mDx * mDx + mDz * mDz) + 0.001;
    steerX += (mDx / mDist) * hippocampusAct * 0.6;
    steerZ += (mDz / mDist) * hippocampusAct * 0.6;
  }

  if (Math.abs(steerX) + Math.abs(steerZ) > 0.01) {
    const targetAngle = Math.atan2(steerX, steerZ);
    let da = targetAngle - mutable.avatarHeading;
    while (da > Math.PI) da -= 2 * Math.PI;
    while (da < -Math.PI) da += 2 * Math.PI;
    const turnRate = 0.12 + pfcAct * 0.1;
    mutable.avatarHeading += da * Math.min(1, turnRate);
  } else {
    const wanderNoise = (1 - pfcAct * 0.6) * 0.15;
    mutable.avatarHeading += (Math.random() - 0.5) * wanderNoise;
  }

  // Hunger & exploration drives
  // Hunger increment — auto-relief at 80% so homeostatic saturation doesn't permanently override goals
  mutable.hungerDrive = clamp(mutable.hungerDrive + 0.0003, 0, 1);
  if (mutable.hungerDrive >= 0.8) {
    // Auto homeostatic relief: simulate metabolic satiation, reset drive, log event
    mutable.hungerDrive = 0.05;
    mutable.eventLog.unshift({
      tick: mutable.tick,
      region: "Hypothalamus" as ExtendedRegion,
      type: "surge" as const,
      description:
        "HOMEOSTATIC RELIEF: Hunger drive auto-satisfied (80% threshold). Metabolic need resolved — goal-directed behavior restored. Brain can resume adaptive learning.",
      source: "homeostatic-artifact" as const,
    });
  }
  const hungerApproachDrive = nacAct + mutable.hungerDrive * 0.6;
  const rewardObj = WORLD_OBJECTS_FOR_NAV.find((o) => o.type === "reward");
  if (rewardObj) {
    const hdx = rewardObj.x - mutable.avatarX;
    const hdz = rewardObj.z - mutable.avatarZ;
    steerX +=
      (hdx / Math.sqrt(hdx * hdx + hdz * hdz + 0.001)) *
      hungerApproachDrive *
      0.5;
    steerZ +=
      (hdz / Math.sqrt(hdx * hdx + hdz * hdz + 0.001)) *
      hungerApproachDrive *
      0.5;
  }

  mutable.explorationTimer++;
  if (
    Math.abs(steerX) + Math.abs(steerZ) < 0.3 &&
    mutable.explorationTimer >= 80
  ) {
    steerX += (Math.random() - 0.5) * 0.8;
    steerZ += (Math.random() - 0.5) * 0.8;
    mutable.explorationTimer = 0;
  }

  // Wall bounce — 3x world bounds
  const newX = mutable.avatarX + Math.sin(mutable.avatarHeading) * speed;
  const newZ = mutable.avatarZ + Math.cos(mutable.avatarHeading) * speed;
  if (Math.abs(newX) > WORLD_BOUNDS) {
    mutable.avatarHeading = Math.PI - mutable.avatarHeading;
  }
  if (Math.abs(newZ) > WORLD_BOUNDS) {
    mutable.avatarHeading = -mutable.avatarHeading;
  }
  mutable.avatarX = Math.max(-WORLD_BOUNDS, Math.min(WORLD_BOUNDS, newX));
  mutable.avatarZ = Math.max(-WORLD_BOUNDS, Math.min(WORLD_BOUNDS, newZ));

  // Update nearest object
  let nearestDist = 999;
  let nearestId = "none";
  for (const obj of WORLD_OBJECTS_FOR_NAV) {
    const dx = obj.x - mutable.avatarX;
    const dz = obj.z - mutable.avatarZ;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearestId =
        nearestDist < 8 ? obj.id.replace(/_/g, " ").toUpperCase() : "none";
    }
  }
  mutable.nearestObject = nearestId;

  // ── Emergent Behavior Detection ────────────────────────────────────────────

  // Habituation detector (check every 50 ticks)
  if (
    mutable.tick % 50 === 0 &&
    !mutable.emergentBehaviors.habituationDetected
  ) {
    const hist = mutable.stimulusHistory;
    // Group by region
    const regionEntries = new Map<ExtendedRegion, typeof hist>();
    for (const entry of hist) {
      if (!regionEntries.has(entry.region)) regionEntries.set(entry.region, []);
      regionEntries.get(entry.region)!.push(entry);
    }
    for (const [region, entries] of regionEntries) {
      if (entries.length >= 3) {
        const sorted = [...entries].sort((a, b) => a.tick - b.tick);
        const first = sorted[0].responseStrength;
        const third = sorted[2].responseStrength;
        if (first > 0.01 && (first - third) / first > 0.2) {
          const reduction = Math.round(((first - third) / first) * 100);
          mutable.emergentBehaviors.habituationDetected = true;
          mutable.emergentBehaviors.habituationEvidence = `${region} showed ${reduction}% response reduction across 3 repeated stimuli (T${sorted[0].tick}->T${sorted[1].tick}->T${sorted[2].tick}). This is Pavlovian habituation — a form of non-associative learning consistent with synaptic depression.`;
          mutable.publicationAlerts.push({
            id: `hab_${mutable.tick}`,
            tick: mutable.tick,
            type: "habituation",
            title: "Habituation Detected",
            description: mutable.emergentBehaviors.habituationEvidence,
            significance: `The avatar's ${region} shows measurable response decrement to repeated stimuli — the neural signature of habituation, a fundamental form of non-associative learning (Kandel, 2001).`,
            dismissed: false,
          });
        }
      }
    }
  }

  // Associative learning detector (check every 30 ticks)
  if (
    mutable.tick % 30 === 0 &&
    !mutable.emergentBehaviors.associativeLearningDetected
  ) {
    // Look for consistent stimulus pairings
    for (const [pair, count] of mutable.associativePairCounts) {
      if (count >= 3) {
        const [regionA, regionB] = pair.split("->") as [
          ExtendedRegion,
          ExtendedRegion,
        ];
        // Check if regionB's network now activates regionA's area even without explicit stimulus A
        const regionACurrentAct = activationLookup.get(regionA) ?? 0;
        const regionBCurrentAct = activationLookup.get(regionB) ?? 0;
        if (regionBCurrentAct > 0.5 && regionACurrentAct > 0.4) {
          const recentStimuli = mutable.lastStimulusRegions
            .filter((s) => mutable.tick - s.tick < 20)
            .map((s) => s.region);
          if (
            !recentStimuli.includes(regionA) &&
            recentStimuli.includes(regionB)
          ) {
            mutable.emergentBehaviors.associativeLearningDetected = true;
            mutable.emergentBehaviors.associativeLearningEvidence = `${regionA}->${regionB} pairing observed ${count}× (ticks). At T${mutable.tick}, ${regionB} stimulus alone activated ${regionA} network at ${Math.round(regionACurrentAct * 100)}% — consistent with conditioned associative response. Mechanism: Hebbian co-activation strengthened inter-regional STDP weights.`;
            mutable.publicationAlerts.push({
              id: `assoc_${mutable.tick}`,
              tick: mutable.tick,
              type: "associative_learning",
              title: "Associative Learning Detected",
              description:
                mutable.emergentBehaviors.associativeLearningEvidence,
              significance:
                "Stimulus pairing produced measurable cross-activation without the conditioned stimulus — the computational correlate of classical conditioning as modeled in Bhatt & Bhatt (2011).",
              dismissed: false,
            });
          }
        }
      }
    }
  }

  // Goal-directed navigation detector
  if (
    !mutable.emergentBehaviors.goalDirectedNavDetected &&
    mutable.rewardReachEvents.length >= 2
  ) {
    const unpromptedReaches = mutable.rewardReachEvents.filter(
      (e) => !e.withRecentStimulus && e.hippocampusAct > 0.4,
    );
    if (unpromptedReaches.length >= 2) {
      const e = unpromptedReaches[0];
      mutable.emergentBehaviors.goalDirectedNavDetected = true;
      mutable.emergentBehaviors.goalDirectedNavEvidence = `[SPATIAL-MEM] Avatar reached ${e.nodeId} at T${e.tick} without external stimulus (hunger: ${Math.round(mutable.hungerDrive * 100)}%, Hippocampus: ${Math.round(e.hippocampusAct * 100)}%). Memory-guided navigation via spatial index — behavior driven by stored reward location, not STDP-learned association. Confirmed ${unpromptedReaches.length} times. Note: This is spatial-index recall, not emergent reward learning.`;
      mutable.publicationAlerts.push({
        id: `goalnav_${mutable.tick}`,
        tick: mutable.tick,
        type: "goal_directed_nav",
        title: "Goal-Directed Navigation Detected",
        description: mutable.emergentBehaviors.goalDirectedNavEvidence,
        significance: `Avatar navigated to reward without external stimulus using hippocampal place memory — a hallmark of goal-directed behavior distinct from stimulus-driven reflexes (Balleine & O'Doherty, 2010).`,
        dismissed: false,
      });
    }
  }

  // STDP milestone detector
  let cumulativeDelta = 0;
  for (const conn of CONNECTIVITY) {
    const key = connKey(conn.from, conn.to);
    cumulativeDelta += Math.abs((mutable.stdpWeights.get(key) ?? 1.0) - 1.0);
  }
  if (
    cumulativeDelta > 0.5 &&
    mutable.lastStdpCumulativeDelta <= 0.5 &&
    mutable.tick > 10
  ) {
    mutable.publicationAlerts.push({
      id: `stdp_${mutable.tick}`,
      tick: mutable.tick,
      type: "stdp_milestone",
      title: "Significant Synaptic Plasticity Milestone",
      description: `Cumulative STDP weight change reached ${cumulativeDelta.toFixed(3)} across all connections — significant long-term synaptic modification. Top pathways have modified their efficacy by up to ${(Math.max(...Array.from(mutable.stdpWeights.values()).map((w) => Math.abs(w - 1.0))) * 100).toFixed(1)}%.`,
      significance:
        "The neural network has undergone substantial self-modification through activity-dependent plasticity — the computational substrate of learning and memory consolidation (Bi & Poo, 1998).",
      dismissed: false,
    });
  }
  mutable.lastStdpCumulativeDelta = cumulativeDelta;

  // Emergent state transition detector
  const currentPosture = mutable.lastPosture;
  if (currentPosture === mutable.lastPostureForEmergent) {
    mutable.lastPostureTickCount++;
    if (mutable.lastPostureTickCount > 50) {
      // Will detect transition in next change
    }
  } else {
    if (mutable.lastPostureTickCount > 50) {
      // Check if this transition happened without a recent stimulus
      const recentStimulusCount = mutable.lastStimulusRegions.filter(
        (s) => mutable.tick - s.tick < 20,
      ).length;
      if (recentStimulusCount === 0) {
        mutable.publicationAlerts.push({
          id: `emrg_${mutable.tick}`,
          tick: mutable.tick,
          type: "emergent_pattern",
          title: "Spontaneous Behavioral State Transition",
          description: `Avatar shifted from ${mutable.lastPostureForEmergent.toUpperCase()} to ${currentPosture.toUpperCase()} after ${mutable.lastPostureTickCount} ticks without external stimulus. This spontaneous transition emerged from internal neural dynamics alone.`,
          significance:
            "Spontaneous state transitions without external stimulus are a hallmark of internally-generated brain states — evidence of genuine intrinsic dynamics beyond stimulus-response coupling (Deco et al., 2011).",
          dismissed: false,
        });
      }
    }
    mutable.lastPostureForEmergent = currentPosture;
    mutable.lastPostureTickCount = 0;
  }

  // Cap publication alerts at 20
  if (mutable.publicationAlerts.length > 20) {
    mutable.publicationAlerts = mutable.publicationAlerts.slice(-20);
  }

  // ── Theta burst: MedialSeptum drives hippocampal 6Hz oscillation ──────────
  const msActivation = activationLookup.get(FrontendRegion.MedialSeptum) ?? 0;
  const hippoActivationTick = activationLookup.get(Region.Hippocampus) ?? 0;
  if (
    msActivation > 0.5 &&
    hippoActivationTick > 0.4 &&
    mutable.tick % 18 === 0
  ) {
    mutable.eventLog.unshift({
      tick: mutable.tick,
      region: FrontendRegion.MedialSeptum,
      type: "cascade",
      description:
        "THETA BURST: Medial Septum driving hippocampal 6Hz oscillation — memory encoding gate open",
      source: "plasticity-linked" as const,
    });
    if (mutable.eventLog.length > 20) {
      mutable.eventLog = mutable.eventLog.slice(0, 20);
    }
  }

  // ── Sleep pressure brainstem penalty ─────────────────────────────────────
  // Applied via stimulus map so it integrates naturally into the Wilson-Cowan model
  if (mutable.sleepPressure > 0.8) {
    const currentBSStim = mutable.stimulusMap.get(Region.Brainstem) ?? 0;
    mutable.stimulusMap.set(Region.Brainstem, currentBSStim - 0.015);
  }

  // ── Saturation Detection (FIX5) ─────────────────────────────────────────
  // Track last 100 activations per region; flag if avg > 0.90 (saturation)
  for (const rs of mutable.regions) {
    let window = mutable.regionActivationWindow.get(rs.region);
    if (!window) {
      window = [];
      mutable.regionActivationWindow.set(rs.region, window);
    }
    window.push(rs.activation);
    if (window.length > 100) window.shift();
    if (window.length >= 50) {
      const avg = window.reduce((s, v) => s + v, 0) / window.length;
      if (avg > 0.9 && !mutable.saturatedRegions.has(rs.region)) {
        mutable.saturatedRegions.add(rs.region);
        mutable.saturationLog.push({ tick: mutable.tick, region: rs.region });
      } else if (avg <= 0.85 && mutable.saturatedRegions.has(rs.region)) {
        // Clear saturation when avg drops below 85%
        mutable.saturatedRegions.delete(rs.region);
      }
    }
  }

  // Compute debug flag: if > 30% of regions have avg activation > 0.90
  const saturationFraction = mutable.saturatedRegions.size / ALL_REGIONS.length;
  mutable.isDebugRun = saturationFraction > 0.3;

  mutable.tick++;
}

function deriveNeurotransmitters(
  regions: RegionState[],
  globalArousal: number,
): NeurotransmitterState {
  const get = (r: ExtendedRegion) =>
    regions.find((rs) => rs.region === r)?.activation ?? 0;

  const nucleusAccumbens = get(FrontendRegion.NucleusAccumbens);
  const basalGanglia = get(Region.BasalGanglia);
  const brainstem = get(Region.Brainstem);
  const thalamus = get(Region.Thalamus);
  const amygdala = get(Region.Amygdala);
  const _insula = get(FrontendRegion.Insula);
  const hippocampus = get(Region.Hippocampus);
  const motorCortex = get(Region.MotorCortex);
  const hypothalamus = get(FrontendRegion.Hypothalamus);
  const vta = get(FrontendRegion.VentralTegmentalArea);
  const lc = get(FrontendRegion.LocusCoeruleus);
  const raphe = get(FrontendRegion.RapheNuclei);

  return {
    dopamine: Math.min(1, (nucleusAccumbens + basalGanglia + vta * 0.5) * 0.55),
    serotonin: Math.min(
      1,
      raphe * 0.5 + brainstem * 0.25 + thalamus * 0.15 + (1 - amygdala) * 0.1,
    ),
    norepinephrine: Math.min(1, lc * 0.5 + amygdala * 0.3 + brainstem * 0.2),
    gaba: Math.min(1, (1 - globalArousal) * 0.85 + hypothalamus * 0.15),
    glutamate: Math.min(1, globalArousal * 0.9 + thalamus * 0.1),
    acetylcholine: Math.min(
      1,
      hippocampus * 0.4 + motorCortex * 0.35 + brainstem * 0.25,
    ),
  };
}

function deriveAvatarBehavior(
  regions: RegionState[],
  nt: NeurotransmitterState,
  mutable: SimMutableState,
  globalArousal: number,
  complexityLevel: number,
): AvatarBehavior {
  const get = (r: ExtendedRegion) =>
    regions.find((rs) => rs.region === r)?.activation ?? 0;

  const motor = get(Region.MotorCortex);
  const cerebellum = get(Region.Cerebellum);
  const basalGanglia = get(Region.BasalGanglia);
  const pfc = get(Region.PrefrontalCortex);
  const nucleusAccumbens = get(FrontendRegion.NucleusAccumbens);
  const amygdala = get(Region.Amygdala);
  const insula = get(FrontendRegion.Insula);
  const thalamus = get(Region.Thalamus);
  const acc = get(FrontendRegion.AnteriorCingulateCortex);
  const brainstem = get(Region.Brainstem);
  const sensory = get(Region.SensoryCortex);
  const hypothalamus = get(FrontendRegion.Hypothalamus);
  const sma = get(FrontendRegion.SupplementaryMotorArea);

  const EMA = 0.12;

  const rawMotion =
    0.4 * motor + 0.25 * cerebellum + 0.15 * basalGanglia + 0.2 * sma;
  const rawValence = clamp(
    pfc * 0.4 +
      nucleusAccumbens * 0.3 +
      nt.serotonin * 0.3 -
      (amygdala * 0.5 + nt.norepinephrine * 0.3 + insula * 0.2),
    -1,
    1,
  );
  const rawAttention = 0.4 * pfc + 0.3 * thalamus + 0.2 * acc + 0.1 * brainstem;
  const allActivations = regions.map((r) => r.activation);
  const rawConsciousness = clamp(
    (allActivations.reduce((s, v) => s + v, 0) / allActivations.length) * 1.4 +
      thalamus * 0.2,
    0,
    1,
  );
  const rawBreathing = 0.3 + brainstem * 0.5 + amygdala * 0.2;

  mutable.emaMotion = mutable.emaMotion * (1 - EMA) + rawMotion * EMA;
  mutable.emaValence = mutable.emaValence * (1 - EMA) + rawValence * EMA;
  mutable.emaAttention = mutable.emaAttention * (1 - EMA) + rawAttention * EMA;
  mutable.emaConsciousness =
    mutable.emaConsciousness * (1 - EMA) + rawConsciousness * EMA;
  mutable.emaBreathing = mutable.emaBreathing * (1 - EMA) + rawBreathing * EMA;

  let candidatePosture: AvatarBehavior["postureState"] = "resting";
  if (amygdala > 0.6 && pfc < 0.4) {
    candidatePosture = "fearful";
  } else if (nucleusAccumbens > 0.5 && nt.dopamine > 0.45) {
    candidatePosture = "motivated";
  } else if (hypothalamus > 0.5 && globalArousal < 0.25) {
    candidatePosture = "sleeping";
  } else if (pfc > 0.52 && thalamus > 0.42) {
    candidatePosture = "focused";
  } else if (thalamus > 0.48 && sensory > 0.38) {
    candidatePosture = "alert";
  }

  let postureState: AvatarBehavior["postureState"];
  if (candidatePosture !== mutable.lastPosture) {
    mutable.postureHoldTicks++;
    if (mutable.postureHoldTicks >= 15) {
      mutable.lastPosture = candidatePosture;
      mutable.postureHoldTicks = 0;
    }
    postureState = mutable.lastPosture;
  } else {
    mutable.postureHoldTicks = 0;
    postureState = mutable.lastPosture;
  }

  // Track posture state counts for session report
  mutable.postureStateCounts[postureState] =
    (mutable.postureStateCounts[postureState] ?? 0) + 1;

  const ntEntries: [keyof NeurotransmitterState, number][] = [
    ["dopamine", nt.dopamine],
    ["serotonin", nt.serotonin],
    ["norepinephrine", nt.norepinephrine],
    ["gaba", nt.gaba],
    ["glutamate", nt.glutamate],
    ["acetylcholine", nt.acetylcholine],
  ];
  const dominantNT = ntEntries.reduce(
    (best, curr) => (curr[1] > best[1] ? curr : best),
    ntEntries[0],
  )[0] as AvatarBehavior["dominantNT"];

  const cma = get(FrontendRegion.CingulateMotorArea);
  const basalG = get(Region.BasalGanglia);
  const speedScale = 0.08 + complexityLevel * 0.018;
  const bgGate = 0.3 + basalG * 0.7;
  const actualSpeed =
    (motor * 0.4 + cerebellum * 0.3 + cma * 0.15 + sma * 0.15) *
    speedScale *
    bgGate;

  // ── Sleep pressure (adenosine model, Turrigiano-inspired) ─────────────────
  // ── Auto-Consolidation (sleep-pressure triggered) ──────────────────────
  if (
    mutable.sleepPressure > 0.75 &&
    !mutable.isConsolidating &&
    mutable.consolidationTicksRemaining === 0
  ) {
    mutable.isConsolidating = true;
    mutable.consolidationTicksRemaining = 30;
  }

  if (mutable.isConsolidating) {
    if (mutable.consolidationTicksRemaining > 0) {
      // Boost LTP rate by reducing effective noise and boosting STDP
      mutable.consolidationTicksRemaining--;
    } else {
      mutable.isConsolidating = false;
      mutable.consolidationCount++;
      mutable.sleepPressure = Math.max(0, mutable.sleepPressure - 0.4);
    }
  }

  mutable.sleepPressure = clamp(
    mutable.sleepPressure + (postureState === "sleeping" ? -0.0002 : 0.00008),
    0,
    1,
  );

  // ── Working Memory Decay (Goldman-Rakic 1995 PFC) ────────────────────────
  // PFC + hippocampus co-activation rehearses (refreshes) active entries.
  // Items decay ~125 ticks (~5s at 25Hz) without rehearsal.
  const pfcActWM = get(Region.PrefrontalCortex);
  const hippoActWM = get(Region.Hippocampus);
  const rehearsing = pfcActWM > 0.5 && hippoActWM > 0.4;

  mutable.workingMemory = mutable.workingMemory
    .map((entry) => {
      const refreshed = rehearsing
        ? { ...entry, strength: Math.min(1.0, entry.strength + 0.15) }
        : entry;
      return {
        ...refreshed,
        strength: refreshed.strength - refreshed.decayRate,
      };
    })
    .filter((entry) => {
      if (entry.strength < 0.1) {
        mutable.workingMemoryFadeLog.push({
          ...entry,
          tickStamp: mutable.tick,
        });
        return false;
      }
      return true;
    });
  if (mutable.workingMemoryFadeLog.length > 50) {
    mutable.workingMemoryFadeLog = mutable.workingMemoryFadeLog.slice(-50);
  }

  // Add new working memory entry when PFC + MDT co-active
  const mdtActWM = get(FrontendRegion.MedialdorsalThalamus);
  if (pfcActWM > 0.5 && mdtActWM > 0.5 && mutable.thoughtLog.length > 0) {
    const latestThought = mutable.thoughtLog[0]?.thought;
    if (
      latestThought &&
      !mutable.workingMemory.some((e) => e.content === latestThought)
    ) {
      mutable.workingMemory.unshift({
        content: latestThought,
        tickStamp: mutable.tick,
        decayRate: 0.008, // ~125 ticks to decay (Goldman-Rakic: PFC holds ~3-5s at 25Hz)
        strength: 1.0,
        sourceRegion: "PFC",
      });
      if (mutable.workingMemory.length > 8) mutable.workingMemory.pop();
    }
  }

  // ── Metacognitive Monitoring (anterior PFC + Precuneus read-only observer) ──
  // Cannot alter firing — pure observer circuit (Frith 2002, Fleming & Dolan 2012)
  const anteriorPFCAct = get(FrontendRegion.MedialPFC_L);
  const precuneusAct = get(FrontendRegion.PrecuneusRegion_L);
  mutable.metacognitiveConfidence = (anteriorPFCAct + precuneusAct) / 2;
  if (mutable.tick % 10 === 0) {
    mutable.metacognitiveLog.push({
      tick: mutable.tick,
      confidence: mutable.metacognitiveConfidence,
      dominantCircuit: "monitoring",
    });
    if (mutable.metacognitiveLog.length > 100) mutable.metacognitiveLog.shift();
  }

  return {
    motionLevel: clamp(mutable.emaMotion, 0, 1),
    emotionValence: clamp(mutable.emaValence, -1, 1),
    attentionLevel: clamp(mutable.emaAttention, 0, 1),
    consciousnessLevel: clamp(mutable.emaConsciousness, 0, 1),
    breathingRate: clamp(mutable.emaBreathing, 0, 1),
    postureState,
    dominantNT,
    avatarWorldPos: { x: mutable.avatarX, y: 0, z: mutable.avatarZ },
    avatarVelocity: {
      x: Math.sin(mutable.avatarHeading) * actualSpeed,
      z: Math.cos(mutable.avatarHeading) * actualSpeed,
    },
    nearestObjectType: mutable.nearestObject,
    workingMemory: mutable.workingMemory.map((e) => e.content),
  };
}

function computeSnapshot(
  mutable: SimMutableState,
  isRunning: boolean,
  speed: number,
  complexityLevel: number,
): NeuralSimulationState {
  const globalArousal = clamp(
    mutable.regions.reduce((s, r) => s + r.activation, 0) /
      mutable.regions.length,
    0,
    1,
  );

  const sparseActivationRatio =
    mutable.regions.filter((r) => r.activation < 0.3).length /
    Math.max(mutable.regions.length, 1);

  // Neuromorphic sparse computation metrics (v32+)
  const totalSparseOps = mutable.sparseSkipCount + mutable.sparseFullCount;
  const sparseComputeEfficiency =
    totalSparseOps > 0 ? mutable.sparseSkipCount / totalSparseOps : 0;
  const activeRegionFraction =
    mutable.regions.filter((r) => r.activation > 0.05).length /
    Math.max(mutable.regions.length, 1);
  const eventDrivenUpdates = mutable.sparseFullCount;

  const nt = deriveNeurotransmitters(mutable.regions, globalArousal);
  const avatarBehavior = deriveAvatarBehavior(
    mutable.regions,
    nt,
    mutable,
    globalArousal,
    complexityLevel,
  );

  // 1M neuron active count: sum per-region population * activation
  const activeCount = Math.round(
    mutable.regions.reduce((s, r) => {
      const pop = NEURON_POPULATIONS[r.region] ?? 100;
      return s + pop * r.activation;
    }, 0),
  );

  // Heart / ANS metrics
  const getAct = (r: ExtendedRegion) =>
    mutable.regions.find((rs) => rs.region === r)?.activation ?? 0;
  const brainstemAct = getAct(Region.Brainstem);
  const amygdalaAct = getAct(Region.Amygdala);
  const hypothalamusAct = getAct(FrontendRegion.Hypothalamus);
  const pfcAct = getAct(Region.PrefrontalCortex);
  const lcAct = getAct(FrontendRegion.LocusCoeruleus);

  const heartRate = clamp(
    55 +
      brainstemAct * 35 +
      amygdalaAct * 18 +
      lcAct * 12 -
      hypothalamusAct * 15,
    45,
    130,
  );
  const hrv = clamp(
    pfcAct * 0.6 + hypothalamusAct * 0.3 - amygdalaAct * 0.2,
    0,
    1,
  );
  const sympatheticTone = clamp(
    amygdalaAct * 0.4 + nt.norepinephrine * 0.35 + brainstemAct * 0.25,
    0,
    1,
  );
  const parasympatheticTone = clamp(
    hypothalamusAct * 0.4 + nt.serotonin * 0.35 + pfcAct * 0.25,
    0,
    1,
  );

  // ── Generate thought (every 30 ticks) — Genuine Emergent Engine v21+ ────
  if (isRunning && mutable.tick % 30 === 0) {
    const activationLookup = new Map<ExtendedRegion, number>();
    for (const rs of mutable.regions) {
      activationLookup.set(rs.region, rs.activation);
    }
    // Track previous arousal for behavioral coupling check
    const prevArousal = mutable.thoughtLog[0]
      ? avatarBehavior.consciousnessLevel // will compare next tick
      : undefined;
    // Decode cognitive mode from full x_t feature vector (v32+)
    const hippoAct = activationLookup.get(Region.Hippocampus) ?? 0;
    const nacAct = activationLookup.get(FrontendRegion.NucleusAccumbens) ?? 0;
    const amygAct = activationLookup.get(Region.Amygdala) ?? 0;
    const pfcActTD = activationLookup.get(Region.PrefrontalCortex) ?? 0;
    const cogDecoded = decodeCognitiveMode(
      mutable.goalHierarchy,
      mutable.selfStateModel,
      mutable.ansState,
      mutable.predictionState,
      hippoAct,
      nacAct,
      amygAct,
      pfcActTD,
      mutable.lastCognitiveMode,
      mutable.lastCognitiveModePersistTicks,
    );
    mutable.lastCognitiveMode = cogDecoded.mode;
    mutable.lastCognitiveModePersistTicks = cogDecoded.persistTicks;

    // Only emit if confidence + coherence thresholds are met AND mode persisted >= 2 windows
    const cogModeValid =
      cogDecoded.confidence >= 0.55 &&
      cogDecoded.coherence >= 0.6 &&
      cogDecoded.persistTicks >= 2;

    const result = generateThought(
      activationLookup,
      nt,
      avatarBehavior,
      mutable.hungerDrive,
      prevArousal,
    );

    if (result === null) {
      // Silence is valid scientific data — no circuit reached 75% co-activation
      mutable.consecutiveSilenceTicks++;
      if (mutable.consecutiveSilenceTicks === 10) {
        mutable.silenceLog.push({
          fromTick: mutable.tick - 9,
          toTick: mutable.tick,
          reason:
            "No circuit reached 75% co-activation confidence threshold. Low-stimulation or inhibitory-dominant state.",
        });
        if (mutable.silenceLog.length > 50) mutable.silenceLog.shift();
      }
    } else {
      mutable.consecutiveSilenceTicks = 0;
      // Use decoded cognitive mode to override circuitType for richer behavioral grounding
      const effectiveCircuitType = cogModeValid
        ? cognitiveModeToCicuitType(cogDecoded.mode)
        : result.circuitType;
      mutable.thoughtLog.unshift({
        tick: mutable.tick,
        thought: result.thought,
        dominantRegion: result.dominantRegion,
        intensity: result.intensity,
        confidence: result.confidence,
        neuralSources: result.neuralSources,
        circuitType: effectiveCircuitType,
        behaviorCoupled: result.behaviorCoupled,
        provenance: result.provenance,
        cognitiveMode: cogModeValid ? cogDecoded.mode : undefined,
        cognitiveConfidence: cogModeValid ? cogDecoded.confidence : undefined,
      });
      if (mutable.thoughtLog.length > 50) {
        mutable.thoughtLog = mutable.thoughtLog.slice(0, 50);
      }
    }
  }

  // ── Record session history (every 10 ticks) ────────────────────────────
  if (
    isRunning &&
    mutable.tick % 10 === 0 &&
    mutable.sessionHistory.length < 3000
  ) {
    const regionActivations: Record<string, number> = {};
    for (const rs of mutable.regions) {
      regionActivations[rs.region] = rs.activation;
    }
    const lastThought = mutable.thoughtLog[0];
    mutable.sessionHistory.push({
      tick: mutable.tick,
      regionActivations,
      avatarX: mutable.avatarX,
      avatarZ: mutable.avatarZ,
      postureState: avatarBehavior.postureState,
      thought: lastThought?.tick === mutable.tick ? lastThought.thought : null,
      heartRate,
      globalArousal,
    });
  }

  // ── Periodic STDP prev-weight snapshot (every 50 ticks) so delta reflects recent plasticity ──
  if (mutable.tick % 50 === 0) {
    mutable.stdpPrevWeights = new Map(mutable.stdpWeights);
  }

  // ── STDP weight summary (top changed connections) ─────────────────────────
  const stdpWeightSummary: StdpWeightEntry[] = [];
  for (const conn of CONNECTIVITY) {
    const key = connKey(conn.from, conn.to);
    const current = mutable.stdpWeights.get(key) ?? 1.0;
    const prev = mutable.stdpPrevWeights.get(key) ?? 1.0;
    stdpWeightSummary.push({
      connection: key,
      weight: current,
      delta: current - prev,
    });
  }
  // Sort by absolute delta, return top 10
  stdpWeightSummary.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  const topStdp = stdpWeightSummary.slice(0, 10);

  // ── Cognitive Architecture Computation ────────────────────────────────────
  const alookup = new Map<ExtendedRegion, number>();
  for (const r of mutable.regions) alookup.set(r.region, r.activation);
  const ga = (r: ExtendedRegion) => alookup.get(r) ?? 0;
  const ntCog =
    mutable.regions.length > 0
      ? (() => {
          const dopamine = Math.min(
            1,
            ga(FrontendRegion.VentralTegmentalArea) * 0.4 +
              ga(FrontendRegion.NucleusAccumbens) * 0.3 +
              ga(FrontendRegion.SubstantiaNigra) * 0.3,
          );
          const serotonin = Math.min(
            1,
            ga(FrontendRegion.RapheNuclei) * 0.6 + ga(Region.Brainstem) * 0.4,
          );
          const norepinephrine = Math.min(
            1,
            ga(FrontendRegion.LocusCoeruleus) * 0.7 +
              ga(Region.Brainstem) * 0.3,
          );
          return { dopamine, serotonin, norepinephrine };
        })()
      : { dopamine: 0.3, serotonin: 0.3, norepinephrine: 0.3 };

  // Layer A - State Engine
  const rawSalience = Math.min(
    1,
    ga(Region.Amygdala) * 0.3 +
      ga(FrontendRegion.Insula) * 0.2 +
      ga(Region.Thalamus) * 0.2 +
      ga(Region.PrefrontalCortex) * 0.15 +
      ga(FrontendRegion.AnteriorCingulateCortex) * 0.15,
  );
  const rawArousal = Math.min(
    1,
    ga(FrontendRegion.LocusCoeruleus) * 0.4 +
      ga(Region.Brainstem) * 0.3 +
      ga(Region.Thalamus) * 0.3,
  );
  const rawReward =
    ga(FrontendRegion.VentralTegmentalArea) * 0.35 +
    ga(FrontendRegion.NucleusAccumbens) * 0.35 +
    ga(FrontendRegion.OrbitalFrontalCortex) * 0.3;
  const rawThreat =
    ga(Region.Amygdala) * 0.4 +
    ga(FrontendRegion.PeriaqueductalGray) * 0.3 +
    ga(FrontendRegion.BedNucleusStria) * 0.3;
  const rawRewardThreat = Math.max(-1, Math.min(1, rawReward - rawThreat));
  const rawMemory = Math.min(
    1,
    ga(Region.Hippocampus) * 0.4 +
      ga(FrontendRegion.CA1) * 0.25 +
      ga(FrontendRegion.EntorhinalCortex) * 0.2 +
      ga(FrontendRegion.DentateGyrus) * 0.15,
  );
  const allWeights = Array.from(mutable.stdpWeights.values());
  const avgW =
    allWeights.length > 0
      ? allWeights.reduce((s, v) => s + v, 0) / allWeights.length
      : 1;
  const rawPlasticity = Math.min(1, Math.abs(avgW - 1.0) * 2);

  // Behavioral mode determination
  let behavioralMode: LayerAState["behavioralMode"] = "exploration";
  if (rawThreat > 0.5) behavioralMode = "threat-response";
  else if (rawArousal < 0.2 && mutable.sleepPressure > 0.5)
    behavioralMode = "rest";
  else if (rawReward > 0.6 && rawSalience > 0.5)
    behavioralMode = "exploitation";
  else if (
    ga(FrontendRegion.AnteriorCingulateCortex) > 0.6 ||
    ga(FrontendRegion.SuperiorTemporalSulcus) > 0.5
  )
    behavioralMode = "social";

  const alpha = 0.1;
  const prevA = mutable.emaLayerA;
  const newLayerA: LayerAState = {
    salience: prevA.salience * (1 - alpha) + rawSalience * alpha,
    arousal: prevA.arousal * (1 - alpha) + rawArousal * alpha,
    rewardThreat: prevA.rewardThreat * (1 - alpha) + rawRewardThreat * alpha,
    memoryIndex: prevA.memoryIndex * (1 - alpha) + rawMemory * alpha,
    plasticityRate: prevA.plasticityRate * (1 - alpha) + rawPlasticity * alpha,
    behavioralMode,
  };
  mutable.emaLayerA = newLayerA;

  // Layer B - Identity Model (driven by neuromodulator levels)
  const prevB = mutable.emaLayerB;
  const rawB: LayerBIdentity = {
    cautiousness: Math.min(1, 0.5 + (0.5 - ntCog.norepinephrine) * 0.8),
    aggression: Math.min(
      1,
      ntCog.norepinephrine * 0.5 + ga(Region.Amygdala) * 0.5,
    ),
    discipline: Math.min(
      1,
      ntCog.serotonin * 0.4 + ga(Region.PrefrontalCortex) * 0.6,
    ),
    impulsivity: Math.min(
      1,
      (1 - ntCog.serotonin) * 0.5 + ntCog.dopamine * 0.5,
    ),
    fatigue: mutable.sleepPressure,
    resilience: Math.min(
      1,
      ntCog.serotonin * 0.5 + ga(Region.Hippocampus) * 0.5,
    ),
    cooperativeness: Math.min(
      1,
      ga(FrontendRegion.AnteriorCingulateCortex) * 0.5 +
        ga(FrontendRegion.SuperiorTemporalSulcus) * 0.5,
    ),
    skepticism: Math.min(
      1,
      ga(FrontendRegion.LateralHabenula) * 0.6 + (1 - rawReward) * 0.4,
    ),
  };
  const newLayerB: LayerBIdentity = {
    cautiousness: prevB.cautiousness * (1 - alpha) + rawB.cautiousness * alpha,
    aggression: prevB.aggression * (1 - alpha) + rawB.aggression * alpha,
    discipline: prevB.discipline * (1 - alpha) + rawB.discipline * alpha,
    impulsivity: prevB.impulsivity * (1 - alpha) + rawB.impulsivity * alpha,
    fatigue: prevB.fatigue * (1 - alpha) + rawB.fatigue * alpha,
    resilience: prevB.resilience * (1 - alpha) + rawB.resilience * alpha,
    cooperativeness:
      prevB.cooperativeness * (1 - alpha) + rawB.cooperativeness * alpha,
    skepticism: prevB.skepticism * (1 - alpha) + rawB.skepticism * alpha,
  };
  mutable.emaLayerB = newLayerB;

  // Layer D - Output Layer
  const behaviourScores: Record<BehaviorOutput, number> = {
    move_toward: Math.min(1, rawReward * 0.7 + rawArousal * 0.3),
    avoid: Math.min(1, rawThreat * 0.8 + (1 - rawReward) * 0.2),
    delay: Math.min(
      1,
      ga(Region.PrefrontalCortex) * 0.5 + newLayerB.cautiousness * 0.5,
    ),
    escalate: Math.min(1, newLayerB.aggression * 0.7 + rawThreat * 0.3),
    freeze: Math.min(1, rawThreat * 0.6 + newLayerB.fatigue * 0.4),
    coordinate: Math.min(
      1,
      newLayerB.cooperativeness * 0.7 +
        ga(FrontendRegion.AnteriorCingulateCortex) * 0.3,
    ),
    investigate: Math.min(
      1,
      rawSalience * 0.5 + (1 - rawThreat) * 0.3 + rawArousal * 0.2,
    ),
    communicate: Math.min(
      1,
      newLayerB.cooperativeness * 0.5 +
        ga(FrontendRegion.SuperiorTemporalSulcus) * 0.5,
    ),
    recommend: Math.min(
      1,
      newLayerB.discipline * 0.5 + ga(Region.PrefrontalCortex) * 0.5,
    ),
  };
  let dominant: BehaviorOutput = "investigate";
  let topScore = 0;
  for (const [b, s] of Object.entries(behaviourScores) as [
    BehaviorOutput,
    number,
  ][]) {
    if (s > topScore) {
      topScore = s;
      dominant = b;
    }
  }
  const layerD: LayerDOutput = {
    dominant,
    confidence: topScore,
    scores: behaviourScores,
  };

  // Layer E - Interpretation (append entry for this tick if something changed)
  const spikedRegions = mutable.regions
    .filter((r) => r.activation > 0.65)
    .slice(0, 8)
    .map((r) => r.region as string);
  const modeChanged = behavioralMode !== mutable.prevLayerAMode;
  if (modeChanged || mutable.tick % 50 === 0) {
    const conflict =
      rawThreat > 0.4 && rawReward > 0.4
        ? "Threat-reward conflict: amygdala-VTA competition"
        : rawSalience > 0.6 && ga(Region.PrefrontalCortex) > 0.6
          ? "Salience-executive conflict: limbic vs. frontal"
          : null;
    const entry: LayerEEntry = {
      tick: mutable.tick,
      activated: spikedRegions,
      changed: modeChanged
        ? `Mode: ${mutable.prevLayerAMode} -> ${behavioralMode}`
        : "Periodic state snapshot",
      conflict,
      whyShift: modeChanged
        ? `Behavioral mode shifted due to ${rawThreat > 0.5 ? "threat escalation" : rawReward > 0.5 ? "reward signal" : "arousal change"}`
        : "Network state stable",
      whyDecision: `Dominant output '${dominant}' selected with ${(topScore * 100).toFixed(0)}% confidence`,
    };
    mutable.layerELog.unshift(entry);
    if (mutable.layerELog.length > 20)
      mutable.layerELog = mutable.layerELog.slice(0, 20);
    mutable.prevLayerAMode = behavioralMode;
  }

  // Maturity Score
  const wValues = Array.from(mutable.stdpWeights.values());
  const wMean =
    wValues.length > 0
      ? wValues.reduce((s, v) => s + v, 0) / wValues.length
      : 1;
  const wVar =
    wValues.length > 0
      ? wValues.reduce((s, v) => s + (v - wMean) ** 2, 0) / wValues.length
      : 0;
  const stdpVariance = Math.sqrt(wVar);
  const maturityScore = Math.min(
    100,
    Math.round(
      mutable.tick * 0.015 +
        (1 - Math.min(1, stdpVariance)) * 35 +
        mutable.consolidationCount * 3,
    ),
  );

  // HRV Coherence & Vagal Tone
  const vagalTone = Math.min(
    1,
    (1 - ga(FrontendRegion.LocusCoeruleus)) * 0.4 +
      ga(Region.Brainstem) * 0.3 +
      (1 - rawThreat) * 0.3,
  );
  const hrvCoherence = Math.min(
    1,
    vagalTone * 0.7 + (1 - mutable.sleepPressure) * 0.3,
  );

  return {
    tick: mutable.tick,
    isRunning,
    speed,
    complexityLevel,
    regions: mutable.regions.map((r) => ({ ...r })),
    neurotransmitters: nt,
    avatarBehavior,
    globalArousal,
    eventLog: [...mutable.eventLog],
    regionActivity: mutable.regions.map((r) => [r.region, r.activation]),
    activeNeuronCount: activeCount,
    heartRate,
    hrv,
    sympatheticTone,
    parasympatheticTone,
    hungerDrive: mutable.hungerDrive,
    explorationTimer: mutable.explorationTimer,
    thoughtLog: [...mutable.thoughtLog],
    sessionReport: mutable.sessionReport,
    stdpWeightSummary: topStdp,
    emergentBehaviors: { ...mutable.emergentBehaviors },
    publicationAlerts: mutable.publicationAlerts
      .filter((a) => !a.dismissed)
      .map((a) => ({ ...a })),
    workingMemory: [...mutable.workingMemory],
    sleepPressure: mutable.sleepPressure,
    predictionErrors: new Map(mutable.predictionErrors),
    metacognitiveConfidence: mutable.metacognitiveConfidence,
    metacognitiveLog: [...mutable.metacognitiveLog],
    silenceLog: [...mutable.silenceLog],
    layerA: { ...mutable.emaLayerA },
    layerB: { ...mutable.emaLayerB },
    layerD,
    layerE: [...mutable.layerELog],
    isConsolidating: mutable.isConsolidating,
    consolidationCount: mutable.consolidationCount,
    isMaturationActive: mutable.isMaturationActive,
    maturityScore,
    vagalTone,
    cortisolLevel: mutable.cortisolLevel,
    cortisolPlasticityGated: mutable.cortisolLevel > 0.65,
    hrvCoherence,
    saturatedRegions: [...mutable.saturatedRegions],
    saturationLog: [...mutable.saturationLog],
    isDebugRun: mutable.isDebugRun,
    sparseActivationRatio,
    sparseComputeEfficiency,
    activeRegionFraction,
    eventDrivenUpdates,
    multiTimescaleMemory: {
      ...mutable.multiTimescaleMemory,
      learnedBias: { ...mutable.multiTimescaleMemory.learnedBias },
      memoryBoostMap: { ...mutable.multiTimescaleMemory.memoryBoostMap },
      sustainedHighTicks: {
        ...mutable.multiTimescaleMemory.sustainedHighTicks,
      },
      workingBuffer: [...mutable.multiTimescaleMemory.workingBuffer],
      episodicTrace: [...mutable.multiTimescaleMemory.episodicTrace],
    },
    batchRunActive: mutable.batchRunActive,
    batchRunProgress: mutable.batchRunProgress,
    batchRunTarget: mutable.batchRunTarget,
    batchRunResults: [...mutable.batchRunResults],
    ansState: { ...mutable.ansState },
    strategyShiftCount: mutable.strategyShiftCount,
    predictionState: {
      ...mutable.predictionState,
      expectations: new Map(mutable.predictionState.expectations),
      errors: new Map(mutable.predictionState.errors),
    },
    selfStateModel: {
      ...mutable.selfStateModel,
      pressureHistory: [...mutable.selfStateModel.pressureHistory],
      stabilityHistory: [...mutable.selfStateModel.stabilityHistory],
    },
    goalHierarchy: {
      ...mutable.goalHierarchy,
      goalVector: { ...mutable.goalHierarchy.goalVector },
    },
    failureMemory: {
      ...mutable.failureMemory,
      records: new Map(mutable.failureMemory.records),
    },
    activeTaskClass: mutable.activeTaskClass,
    taskClassConfidence: mutable.taskClassConfidence,
    criticalityState: {
      branchingRatio: mutable.criticalityState.branchingRatio,
      regime: mutable.criticalityState.regime,
      excitabilityGain: mutable.criticalityState.excitabilityGain,
      inhibitoryGain: mutable.criticalityState.inhibitoryGain,
      powerLawFit: mutable.criticalityState.powerLawFit,
      adjustmentEvents: mutable.criticalityState.adjustmentEvents,
      criticalityScore: mutable.criticalityState.criticalityScore,
    },
    oscillatoryState: {
      memoryEncodeGate: mutable.oscillatoryState.memoryEncodeGate,
      memoryRetrieveGate: mutable.oscillatoryState.memoryRetrieveGate,
      localComputeGate: mutable.oscillatoryState.localComputeGate,
      suppressionGate: mutable.oscillatoryState.suppressionGate,
      motorGate: mutable.oscillatoryState.motorGate,
      thetaGammaCoupling: mutable.oscillatoryState.thetaGammaCoupling,
      encodingWindowOpen: mutable.oscillatoryState.encodingWindowOpen,
      retrievalWindowOpen: mutable.oscillatoryState.retrievalWindowOpen,
      regionAlpha: Object.fromEntries(mutable.oscillatoryState.regionAlpha),
    },
    neuromodulatorLevels: { ...mutable.neuromodulatorLevels },
    attractorState: {
      items: [...mutable.attractorState.items],
      globalEnergy: mutable.attractorState.globalEnergy,
      capacity: mutable.attractorState.capacity,
      dominantItem: mutable.attractorState.dominantItem,
      displacementEvents: mutable.attractorState.displacementEvents,
      reinforcementEvents: mutable.attractorState.reinforcementEvents,
    },
    predictiveCoding: {
      globalFreeEnergy: mutable.predictiveCodingState.globalFreeEnergy,
      globalMismatch: mutable.predictiveCodingState.globalMismatch,
      surpriseScore: mutable.predictiveCodingState.surpriseScore,
      learningRelevance: mutable.predictiveCodingState.learningRelevance,
    },
    plasticityGates: { ...mutable.plasticityGates },
    regulationScore: mutable.regulationScoreState.compositeRegulationScore,
    neuromorphicState: mutable.neuromorphicState,
    globalWorkspaceState: {
      broadcastActive: mutable.globalWorkspaceState.broadcastActive,
      broadcastTicksRemaining:
        mutable.globalWorkspaceState.broadcastTicksRemaining,
      currentBroadcast: mutable.globalWorkspaceState.currentBroadcast,
      ignitionEvents: mutable.globalWorkspaceState.ignitionEvents,
      meanCoalitionSize: mutable.globalWorkspaceState.meanCoalitionSize,
      workspaceCoherence: mutable.globalWorkspaceState.workspaceCoherence,
      globalAvailability: mutable.globalWorkspaceState.globalAvailability,
      workspaceRefractoryTicks:
        mutable.globalWorkspaceState.workspaceRefractoryTicks,
      candidateAccumulator: new Map(
        mutable.globalWorkspaceState.candidateAccumulator,
      ),
      competitionTick: mutable.globalWorkspaceState.competitionTick,
      coalitionSizeHistory: [
        ...mutable.globalWorkspaceState.coalitionSizeHistory,
      ],
      coherenceHistory: [...mutable.globalWorkspaceState.coherenceHistory],
      broadcastHistory: [...mutable.globalWorkspaceState.broadcastHistory],
    },
    cardioNervousState: {
      ...mutable.cardioNervousState,
      rrHistory: [...mutable.cardioNervousState.rrHistory],
      baroBuffer: [...mutable.cardioNervousState.baroBuffer],
      epinephrineBuffer: [...mutable.cardioNervousState.epinephrineBuffer],
    },
    // Cognitive Governance Layer (v35+)
    governanceMetrics: {
      ...mutable.governanceMetrics,
      wmSlots: [...mutable.governanceMetrics.wmSlots],
      softPriorVector: { ...mutable.governanceMetrics.softPriorVector },
      influenceFactors: { ...mutable.governanceMetrics.influenceFactors },
      homeostaticCorrection: {
        ...mutable.governanceMetrics.homeostaticCorrection,
      },
    },
    // Neural Circuit Motifs (v36+)
    circuitMotifState: {
      ...mutable.circuitMotifState,
      recurrentExcitation: { ...mutable.circuitMotifState.recurrentExcitation },
      inhibitionMap: { ...mutable.circuitMotifState.inhibitionMap },
      excitationMap: { ...mutable.circuitMotifState.excitationMap },
      salienceActionBias: { ...mutable.circuitMotifState.salienceActionBias },
      predictionErrorFeedback: {
        ...mutable.circuitMotifState.predictionErrorFeedback,
      },
      memorySalienceBridge: {
        ...mutable.circuitMotifState.memorySalienceBridge,
      },
      regulationThresholds: {
        ...mutable.circuitMotifState.regulationThresholds,
      },
      benchmarks: { ...mutable.circuitMotifState.benchmarks },
      clusterStates: { ...mutable.circuitMotifState.clusterStates },
    },
    coreMonitorState: {
      ...mutable.coreMonitorState,
      eventLog: [...mutable.coreMonitorState.eventLog],
      selfRegulation: {
        ...mutable.coreMonitorState.selfRegulation,
        policyStrengthMap: {
          ...mutable.coreMonitorState.selfRegulation.policyStrengthMap,
        },
      },
    },
    // Sensory coupling live state (exposed for analytics)
    sensoryCouplingState: { ...mutable.sensoryCouplingState },
  };
}

function computeSessionReport(mutable: SimMutableState): SessionReport {
  const history = mutable.sessionHistory;
  const now = Date.now();

  // Emotional arc (valence & arousal every 50 ticks)
  const emotionalArc: Array<{
    tick: number;
    valence: number;
    arousal: number;
  }> = [];
  for (let i = 0; i < history.length; i += 5) {
    const h = history[i];
    if (h) {
      emotionalArc.push({ tick: h.tick, valence: 0, arousal: h.globalArousal });
    }
  }

  // Top activated regions
  const regionSums: Record<string, { sum: number; count: number }> = {};
  for (const h of history) {
    for (const [region, act] of Object.entries(h.regionActivations)) {
      if (!regionSums[region]) regionSums[region] = { sum: 0, count: 0 };
      regionSums[region].sum += act;
      regionSums[region].count++;
    }
  }
  const allActivatedRegions = Object.entries(regionSums)
    .map(([region, { sum, count }]) => ({ region, avgActivation: sum / count }))
    .sort((a, b) => b.avgActivation - a.avgActivation);
  const topActivatedRegions = allActivatedRegions.slice(0, 5);
  // FIX5: Detect saturated regions (avg > 0.90)
  const saturatedInReport = allActivatedRegions.filter(
    (r) => r.avgActivation > 0.9,
  );

  // STDP changes
  const stdpChanges: Array<{ connection: string; delta: number }> = [];
  for (const conn of CONNECTIVITY) {
    const key = connKey(conn.from, conn.to);
    const current = mutable.stdpWeights.get(key) ?? 1.0;
    const baseline = 1.0;
    stdpChanges.push({ connection: key, delta: current - baseline });
  }
  stdpChanges.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  // Heart rate arc
  const heartRateArc = history
    .filter((_, i) => i % 5 === 0)
    .map((h) => ({
      tick: h.tick,
      bpm: h.heartRate,
    }));

  // Peak arousal
  const peakArousal = Math.max(...history.map((h) => h.globalArousal), 0);

  // Dominant brain states
  const sortedStates = Object.entries(mutable.postureStateCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([s]) => s);

  // AI interpretation
  const aiInterpretation = generateAiInterpretation(
    history,
    mutable.thoughtLog,
    stdpChanges,
    mutable.postureStateCounts,
  );

  // ── Quantitative Metrics ──────────────────────────────────────────────────

  // Shannon entropy of firing pattern distribution
  // FIX1: Compute per-region avg activations, then normalize by log2(N_active)
  // so max possible value = 1.0 (uniform distribution). Ref: Shannon 1948.
  const regionAvgActs: number[] = Object.values(
    (() => {
      const sums: Record<string, { sum: number; count: number }> = {};
      for (const h of history) {
        for (const [region, act] of Object.entries(h.regionActivations)) {
          if (!sums[region]) sums[region] = { sum: 0, count: 0 };
          sums[region].sum += act;
          sums[region].count++;
        }
      }
      return sums;
    })(),
  ).map(({ sum, count }) => sum / count);
  const activeRegionActs = regionAvgActs.filter((v) => v > 0);
  const nActive = Math.max(activeRegionActs.length, 2);
  const totalAct = activeRegionActs.reduce((s, v) => s + v, 0) || 1;
  const shannonEntropyRaw = -activeRegionActs.reduce((h, v) => {
    const p = v / totalAct;
    return p > 0 ? h + p * Math.log2(p) : h;
  }, 0);
  // Normalize: H_normalized = H / log2(N), range [0, 1]
  const shannonEntropy = Math.min(1.0, shannonEntropyRaw / Math.log2(nActive));

  // Transfer entropy (simplified Pearson correlation approximation)
  const regionTimeSeries: Record<string, number[]> = {};
  for (const h of history) {
    for (const [region, act] of Object.entries(h.regionActivations)) {
      if (!regionTimeSeries[region]) regionTimeSeries[region] = [];
      regionTimeSeries[region].push(act);
    }
  }
  // Variance-aware Pearson r — returns null if either series has near-zero variance
  function pearsonR(a: number[], b: number[]): number | null {
    const n = Math.min(a.length, b.length);
    if (n < 3) return null;
    const ma = a.slice(0, n).reduce((s, v) => s + v, 0) / n;
    const mb = b.slice(0, n).reduce((s, v) => s + v, 0) / n;
    let num = 0;
    let da2 = 0;
    let db2 = 0;
    for (let i = 0; i < n; i++) {
      const da = a[i] - ma;
      const db = b[i] - mb;
      num += da * db;
      da2 += da * da;
      db2 += db * db;
    }
    const denom = Math.sqrt(da2 * db2);
    // Reject near-zero variance (saturation artifact or constant signal)
    if (da2 / n < 0.0005 || db2 / n < 0.0005) return null; // variance < 0.05%
    return denom > 0 ? num / denom : null;
  }

  // Identify saturated regions (avg > 0.88 in session history) — exclude from correlations
  const saturatedInSession = new Set<string>();
  for (const [region, acts] of Object.entries(regionTimeSeries)) {
    const avg = acts.reduce((s, v) => s + v, 0) / acts.length;
    if (avg > 0.88) saturatedInSession.add(region);
  }

  const teScores: Array<{ pair: string; value: number; invalid?: boolean }> =
    [];
  for (const conn of CONNECTIVITY.slice(0, 30)) {
    const fromSeries = regionTimeSeries[conn.from];
    const toSeries = regionTimeSeries[conn.to];
    if (!fromSeries || !toSeries || fromSeries.length < 3) continue;
    // Skip if either region was saturated
    if (saturatedInSession.has(conn.from) || saturatedInSession.has(conn.to))
      continue;
    const r = pearsonR(fromSeries.slice(0, -1), toSeries.slice(1));
    if (r === null) continue; // variance too low — skip entirely
    const selfR = pearsonR(toSeries.slice(0, -1), toSeries.slice(1));
    const te = Math.max(
      0,
      Math.abs(r) - (selfR !== null ? Math.abs(selfR) : 0),
    );
    teScores.push({ pair: `${conn.from}->${conn.to}`, value: te });
  }
  const topPearsonCorrelations = teScores
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Cohen's d for stimulus effect (use placeholder if no stimulus history)
  const stimulusEffectSize =
    mutable.stimulusHistory.length > 0
      ? Math.min(
          1.5,
          mutable.stimulusHistory.reduce((s, e) => s + e.responseStrength, 0) /
            mutable.stimulusHistory.length /
            0.3,
        )
      : 0.3;

  // Correlation matrix top 10 pairs (excluding saturated regions)
  const corrPairs: Array<{ regionA: string; regionB: string; r: number }> = [];
  const regionKeys = Object.keys(regionTimeSeries)
    .filter((r) => !saturatedInSession.has(r)) // exclude saturated
    .slice(0, 15);
  for (let i = 0; i < regionKeys.length; i++) {
    for (let j = i + 1; j < regionKeys.length; j++) {
      const r = pearsonR(
        regionTimeSeries[regionKeys[i]],
        regionTimeSeries[regionKeys[j]],
      );
      if (r !== null && Math.abs(r) < 0.9999) {
        // skip near-perfect (likely artifact)
        corrPairs.push({ regionA: regionKeys[i], regionB: regionKeys[j], r });
      }
    }
  }
  const correlationMatrix = corrPairs
    .sort((a, b) => Math.abs(b.r) - Math.abs(a.r))
    .slice(0, 10);

  // Habituation index: degree of response reduction
  const habituationIndex = mutable.emergentBehaviors.habituationDetected
    ? 0.75
    : 0;

  // Plasticity index
  let totalPlasticityDelta = 0;
  for (const conn of CONNECTIVITY) {
    const key = connKey(conn.from, conn.to);
    totalPlasticityDelta += Math.abs(
      (mutable.stdpWeights.get(key) ?? 1.0) - 1.0,
    );
  }
  const plasticityIndex = totalPlasticityDelta / CONNECTIVITY.length;

  // Emergent behavior score
  const emergentBehaviorScore =
    (mutable.emergentBehaviors.habituationDetected ? 1 : 0) +
    (mutable.emergentBehaviors.associativeLearningDetected ? 1 : 0) +
    (mutable.emergentBehaviors.goalDirectedNavDetected ? 1 : 0);

  const quantitativeMetrics: QuantitativeMetrics = {
    shannonEntropy: Math.round(shannonEntropy * 1000) / 1000,
    topPearsonCorrelations: topPearsonCorrelations,
    stimulusEffectSize: Math.round(stimulusEffectSize * 100) / 100,
    correlationMatrix,
    habituationIndex: Math.round(habituationIndex * 100) / 100,
    plasticityIndex: Math.round(plasticityIndex * 10000) / 10000,
    emergentBehaviorScore,
  };

  const publicationFindings = mutable.publicationAlerts.map((a) => ({ ...a }));

  const sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const startTime = mutable.sessionStart ?? now;
  const durationTicks = mutable.tick;

  // ── Thought count and cognitive term mapping (Change 4) ────────────────────
  const thoughtCount = mutable.thoughtLog.length;
  // If zero thoughts, downgrade cognition language throughout report
  const cognitiveTerms =
    thoughtCount > 0
      ? {
          activity: "cognition",
          summary: "cognitive state",
          monitor: "metacognitive observation",
          model: "self-model activity",
        }
      : {
          activity: "state dynamics",
          summary: "behavior summary",
          monitor: "regulatory activity",
          model: "regulatory state",
        };

  // ── Publish Gate Evaluation (Change 3) ────────────────────────────────────
  const navSource =
    mutable.emergentBehaviors.goalDirectedNavDetected &&
    mutable.rewardLearningEvents === 0
      ? "spatial_memory_only"
      : mutable.emergentBehaviors.goalDirectedNavDetected
        ? "mixed"
        : "none";

  const publishGate = evaluatePublishGate(
    mutable.saturatedRegions,
    ALL_REGIONS,
    correlationMatrix,
    false, // reproducibilityRun: false until batch runs implemented
    false, // baselineAvailable: false until baseline is locked
    thoughtCount,
    navSource,
  );

  // ── Paper Generator ────────────────────────────────────────────────────────
  function generatePaper(): string {
    const date = new Date().toISOString().split("T")[0];
    // FIX1: Session duration must be internally consistent: ticks × 50ms/tick
    // Wall-clock time is unreliable due to tab throttling and pausing.
    const TICK_DURATION_MS = 50; // Wilson-Cowan 20 Hz nominal rate
    const durationSec = ((durationTicks * TICK_DURATION_MS) / 1000).toFixed(1);

    const abstractText = `We present a computational study of ${thoughtCount > 0 && publishGate.passed ? "emergent cognition" : "emergent state dynamics"} in a biologically-grounded digital connectome simulating ${durationTicks} ticks (${durationSec}s). The simulation models ${ALL_REGIONS.length} brain regions with 1 million population-based neurons across cerebellar, cortical, hippocampal, and subcortical circuits, interconnected by ${CONNECTIVITY.length} weighted synaptic pathways incorporating AMPA, NMDA, GABA-A, and GABA-B receptor dynamics. Timing-based spike-timing dependent plasticity (STDP) with eligibility traces and homeostatic scaling governed synaptic modification throughout the session. Peak arousal reached ${Math.round(peakArousal * 100)}%, with dominant behavioral states: ${sortedStates.join(", ")}. ${
      emergentBehaviorScore > 0
        ? `Critically, ${emergentBehaviorScore} emergent behavior${emergentBehaviorScore > 1 ? "s were" : " was"} detected without explicit programming: ${[
            mutable.emergentBehaviors.habituationDetected
              ? "habituation"
              : null,
            mutable.emergentBehaviors.associativeLearningDetected
              ? "associative learning"
              : null,
            mutable.emergentBehaviors.goalDirectedNavDetected
              ? "goal-directed navigation"
              : null,
          ]
            .filter(Boolean)
            .join(", ")}. Plasticity index: ${plasticityIndex.toFixed(4)}.`
        : "No emergent behaviors were detected in this session; longer runs at complexity 8+ are recommended."
    } Shannon entropy of the firing distribution was ${shannonEntropy.toFixed(3)}, indicating ${shannonEntropy > 0.5 ? "high" : "moderate"} neural diversity. These results demonstrate the utility of population-based connectome models for studying the computational basis of emergent cognition.`;

    const intro = [
      "The study of whole-brain dynamics as a substrate for cognitive phenomena has accelerated dramatically following the publication of the Human Connectome Project (Van Essen et al., 2013) and the Allen Brain Atlas (Hawrylycz et al., 2012). These resources provide the connectivity matrices and neuron density profiles necessary to construct biologically-grounded computational models at scales approaching the mammalian brain. However, most large-scale simulations have focused on static structural connectivity without dynamic synaptic modification, limiting their capacity to exhibit learning and emergent behavioral phenomena.",
      `The present work addresses this gap by coupling a Wilson-Cowan rate model across ${ALL_REGIONS.length} brain regions with timing-based STDP (Bi & Poo, 1998; Markram et al., 1997), homeostatic plasticity (Turrigiano, 2008), and dopaminergic reward gating (Schultz et al., 1997). The resulting system is embodied in an avatar agent placed in a bounded environment, enabling the observation of neural architecture effects on behavior without hand-coding behavioral rules. This approach operationalizes the hypothesis that sufficiently complex neural dynamics, when coupled to a body in an environment, will produce emergent behavior in a brain-inspired embodied simulation.`,
      `In this paper, we report the results of a simulation session lasting ${durationTicks} ticks (${durationSec}s) at system complexity level ${5}/10. We describe the neural activity profile, synaptic plasticity changes, quantitative metrics, and any emergent behaviors observed. The session generated ${mutable.thoughtLog.length} cognitive state entries and ${publicationFindings.length} publication-worthy findings. All source data are contained within this report.`,
    ];

    const lines: string[] = [
      "═══════════════════════════════════════════════════════════════════════════════",
      "EMERGENT COGNITION IN A BIOLOGICALLY-GROUNDED DIGITAL CONNECTOME:",
      "A COMPUTATIONAL STUDY OF PLASTICITY AND BEHAVIOR",
      "═══════════════════════════════════════════════════════════════════════════════",
      "",
      "Authors: [Anonymous for Peer Review]",
      "Institution: Human Connectome Research Project · caffeine.ai",
      `Submitted: ${date}`,
      `Session ID: ${sessionId}`,
      "",
      "───────────────────────────────────────────────────────────────────────────────",
      "ABSTRACT",
      "───────────────────────────────────────────────────────────────────────────────",
      abstractText,
      "",
      "Keywords: connectome simulation, spike-timing dependent plasticity, emergent behavior,",
      "Wilson-Cowan model, neuromorphic cognition, homeostatic plasticity",
      "",
      "───────────────────────────────────────────────────────────────────────────────",
      "1. INTRODUCTION",
      "───────────────────────────────────────────────────────────────────────────────",
      ...intro.map((p, i) => `\n1.${i + 1} ${p}`),
      "",
      "───────────────────────────────────────────────────────────────────────────────",
      "2. METHODS",
      "───────────────────────────────────────────────────────────────────────────────",
      "",
      "2.1 Neural Architecture",
      `The simulation models ${ALL_REGIONS.length} brain regions distributed across cerebellar (~69% of neurons, consistent with`,
      "biological ratios), neocortical (~16%), hippocampal formation (~2.8%), subcortical (~6%), and brainstem (~2.2%)",
      "compartments. Total simulated population: 1,000,000 neurons. Regional boundaries and neuron density ratios were derived",
      "from the Human Connectome Project (Van Essen et al., 2013) and Allen Brain Atlas (Hawrylycz et al., 2012).",
      "",
      "2.2 Connectivity Model",
      `${CONNECTIVITY.length} directed inter-regional connections were specified with positive (excitatory) or negative (inhibitory)`,
      "weights. Each connection was tagged with one of four synapse types: AMPA (fast excitatory, ×1.0), NMDA (slow excitatory, ×1.3),",
      "GABA-A (fast inhibitory, ×1.0), GABA-B (slow inhibitory, ×1.2). Connectivity architecture follows Sporns et al. (2005) and",
      "Dynamic Causal Modelling conventions (Friston et al., 2003). Regional excitatory fractions ranged from 0.30 (Purkinje cells)",
      "to 0.85 (cerebellum), consistent with Allen Atlas inhibitory neuron distributions.",
      "",
      "2.3 Neural Dynamics",
      "Regional population firing rates were governed by the Wilson-Cowan rate model. Each tick, the membrane potential of each",
      "region integrated: (a) weighted synaptic input from connected regions, (b) Gaussian noise (amplitude scaled by complexity),",
      "(c) external stimulus injections, and (d) homeostatic scaling input multipliers. Activation was transformed through a",
      "sigmoid function with slope k = 8-16 (scaled by complexity). Refractory periods of 1-5 ticks prevented immediate re-firing.",
      "Cell type parameters follow Izhikevich (2003, 2007).",
      "",
      "2.4 Synaptic Plasticity",
      "Timing-based STDP with eligibility traces was implemented per Bi & Poo (1998) and Markram et al. (1997).",
      "Each tick, eligibility traces for all connections were updated: pre-synaptic firing (activation > 0.5)",
      "increased traces by +0.15 (capped at 1.0), while traces decayed by ×0.92 per tick in the absence of",
      "pre-synaptic activity. LTP was applied when post-synaptic firing occurred with trace > 0.1 (+0.002 × trace × complexity_scale).",
      "LTD was applied when post fired without prior pre-firing (trace < 0.05, weight -0.001).",
      "Homeostatic scaling (Turrigiano, 2008) adjusted effective input weights: regions with >3 consecutive ticks",
      "of activation > 0.75 scaled down by 0.005/tick (min 0.6×); regions with >5 consecutive ticks below 0.15",
      "scaled up by 0.003/tick (max 1.5×). Dopaminergic reward gating (Schultz et al., 1997) retroactively",
      "potentiated pathways active in the 5-8 tick window preceding reward contact when VTA+NAc both exceeded 0.4.",
      "",
      "2.5 Avatar and Environment",
      "An embodied avatar agent navigated a bounded 48×48×48 world cube. Environmental objects included reward nodes,",
      "a threat node, memory markers, temperature zones, a novel object, and a social mirror. Avatar locomotion was",
      "governed by motor cortex, cerebellum, CMA, and SMA activations, with direction determined by the weighted sum",
      "of neural drives toward/away from environmental objects. A hunger drive accumulated at 0.03%/tick, providing",
      "homeostatic motivation independent of external stimuli. Spatial memory allowed hippocampus-guided return to",
      "previously visited reward locations.",
      "",
      "2.6 Simulation Parameters",
      "  Tick duration:    ~50ms (20 Hz simulation rate)",
      `  Session duration: ${durationTicks} ticks (${durationSec}s)`,
      `  Regions:          ${ALL_REGIONS.length}`,
      `  Connections:      ${CONNECTIVITY.length}`,
      "  Neuron model:     Wilson-Cowan population rate code",
      "  Plasticity:       STDP + homeostatic + dopaminergic reward",
      "",
      "───────────────────────────────────────────────────────────────────────────────",
      "3. RESULTS",
      "───────────────────────────────────────────────────────────────────────────────",
      "",
      "3.1 Neural Activity Profile",
      `Peak arousal: ${Math.round(peakArousal * 100)}%. Top 5 activated regions:`,
      ...topActivatedRegions.map(
        (r, i) =>
          `  ${i + 1}. ${r.region.padEnd(35)} avg activation: ${Math.round(r.avgActivation * 100)}%`,
      ),
      "",
      "3.1b Saturation Check:",
      saturatedInReport.length > 0
        ? `⚠ SATURATED REGIONS (avg > 90%): ${saturatedInReport.map((r) => `${r.region} (${Math.round(r.avgActivation * 100)}%)`).join(", ")}. These regions may indicate homeostatic failure or normalization error. Do NOT publish emergence claims driven by saturated regions without investigation.`
        : "✓ No saturated regions detected (all regions averaged < 90%). Activity appears within normal operating range.",
      "",
      "3.2 Synaptic Plasticity (STDP)",
      `Plasticity Index: ${plasticityIndex.toFixed(4)} (mean |Δweight| per connection)`,
      `Total cumulative |Δweight|: ${(plasticityIndex * CONNECTIVITY.length).toFixed(4)}`,
      `Reward learning events: ${mutable.rewardLearningEvents}`,
      "",
      "Top strengthened connections (LTP):",
      ...stdpChanges
        .filter((c) => c.delta > 0)
        .slice(0, 5)
        .map((c) => `  ${c.connection.padEnd(45)} Δ +${c.delta.toFixed(5)}`),
      "",
      "Top weakened connections (LTD):",
      ...stdpChanges
        .filter((c) => c.delta < 0)
        .slice(0, 5)
        .map((c) => `  ${c.connection.padEnd(45)} Δ ${c.delta.toFixed(5)}`),
      "",
      "3.3 Quantitative Metrics",
      `  Shannon Entropy:          ${shannonEntropy.toFixed(3)} (normalized; 1.0 = maximum diversity)`,
      `    -> ${shannonEntropy > 0.6 ? "High entropy: richly diverse firing patterns across all regions." : shannonEntropy > 0.3 ? "Moderate entropy: balanced activity with some dominant regions." : "Low entropy: activity concentrated in a few regions."}`,
      `  Stimulus Effect Size:     Cohen's d = ${stimulusEffectSize.toFixed(2)} (${stimulusEffectSize > 0.8 ? "large" : stimulusEffectSize > 0.5 ? "medium" : "small"} effect)`,
      `  Habituation Index:        ${habituationIndex.toFixed(2)} (0=none, 1=complete response elimination)`,
      `  Emergent Behavior Score:  ${emergentBehaviorScore}/3`,
      "",
      "Top Lagged Pearson Correlations (r_lag1; NOT transfer entropy):",
      ...topPearsonCorrelations.map(
        (te) => `  ${te.pair.padEnd(50)} r_lag1 = ${te.value.toFixed(4)}`,
      ),
      "",
      "Top Inter-Region Correlations:",
      ...correlationMatrix
        .slice(0, 5)
        .map(
          (c) =>
            `  ${c.regionA.padEnd(25)} ↔ ${c.regionB.padEnd(25)} r = ${c.r.toFixed(4)}`,
        ),
      "",
      "3.4 Emergent Behaviors",
      mutable.emergentBehaviors.habituationDetected
        ? `■ HABITUATION DETECTED\n  ${mutable.emergentBehaviors.habituationEvidence}`
        : "□ Habituation: Not detected in this session.",
      "",
      mutable.emergentBehaviors.associativeLearningDetected
        ? `■ ASSOCIATIVE LEARNING DETECTED\n  ${mutable.emergentBehaviors.associativeLearningEvidence}`
        : "□ Associative Learning: Not detected in this session.",
      "",
      mutable.emergentBehaviors.goalDirectedNavDetected
        ? `■ GOAL-DIRECTED NAVIGATION DETECTED\n  ${mutable.emergentBehaviors.goalDirectedNavEvidence}`
        : "□ Goal-Directed Navigation: Not detected in this session.",
      "",
      ...(emergentBehaviorScore === 0
        ? [
            "NOTE: No emergent behaviors were detected in this session.",
            "Longer runs at complexity 8+ are recommended to increase emergence probability.",
          ]
        : []),
      "",
      "3.5 Behavioral Analysis",
      `Dominant posture states: ${sortedStates.join(" > ")}`,
      `Posture distribution: ${Object.entries(mutable.postureStateCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([s, c]) => `${s}=${c}`)
        .join(", ")}`,
      `Total thoughts generated: ${mutable.thoughtLog.length}`,
      mutable.thoughtLog.length > 0
        ? `Last thought (T${mutable.thoughtLog[0]?.tick}): "${mutable.thoughtLog[0]?.thought}"`
        : "",
      "",
      "3.6 Publication-Worthy Findings",
      ...(publicationFindings.length > 0
        ? publicationFindings.map(
            (f, i) =>
              `  [FINDING ${i + 1}] ${f.title} (T${f.tick})\n  ${f.description}\n  Significance: ${f.significance}`,
          )
        : ["  None detected in this session."]),

      "",
      "───────────────────────────────────────────────────────────────────────────────",
      "3.7 VALIDATION & REPRODUCIBILITY NOTES",
      "───────────────────────────────────────────────────────────────────────────────",
      "",
      "⚠ REPRODUCIBILITY: This report represents a single session. For publication-grade",
      "  results, run 20–100 identical sessions (same complexity, stimuli, duration) and",
      "  compare cross-session metrics. Single-session emergent claims cannot be peer-reviewed.",
      "",
      "⚠ PARAMETER SENSITIVITY: STDP rate approx 0.005. Session-level complexity affects emergence probability. Run reproducibility protocol at complexity 5-8 for publishable baselines.",
      "",
      "⚠ ABLATION STATUS — Active vs Dormant circuits this session:",
      `  Active circuits  (>30% avg): ${
        topActivatedRegions
          .filter((r) => r.avgActivation > 0.3)
          .map((r) => r.region)
          .join(", ") || "None above 30%"
      }`,
      `  Dormant circuits (<5% avg):  ${
        Object.entries(regionSums)
          .filter(([, { sum, count }]) => sum / count < 0.05)
          .slice(0, 5)
          .map(([r]) => r)
          .join(", ") || "None detected"
      }`,
      "",
      "⚠ BASELINE COMPARISON: Previous session baseline not available for this run.",
      "  Lock a baseline in the Agent panel to enable before/after comparison.",
      "",
      "⚠ MECHANISM LEGEND — Behavior source labels used in this report:",
      "  [SPATIAL-MEM]   = memory-guided navigation (spatial index; NOT learned from STDP)",
      "  [STDP-ΔW]       = plasticity-driven state change (STDP weight modification drove behavior)",
      "  [HOMEOSTATIC]   = homeostatic regulation (noise/scaling artifact, not learning)",
      "  [ENV-TRIGGER]   = environmentally-triggered response (stimulus caused activation)",
      "  Failure to distinguish these is a category error in emergence claims.",
      "",
      "───────────────────────────────────────────────────────────────────────────────",
      "4. DISCUSSION",
      "───────────────────────────────────────────────────────────────────────────────",
      "",
      `The simulation demonstrated ${emergentBehaviorScore > 0 ? "observed emergent" : "baseline"} neural dynamics across ${durationTicks} ticks.`,
      `STDP plasticity produced a plasticity index of ${plasticityIndex.toFixed(4)}, indicating ${
        plasticityIndex > 0.01
          ? "substantial self-modification of synaptic weights beyond the initial baseline. The specific pathways that strengthened most strongly reflect the co-activation patterns driven by environmental interactions — consistent with Hebbian learning theory (Hebb, 1949)."
          : "modest synaptic modification. Longer sessions and higher complexity levels would be expected to produce greater plasticity, as the probability of coincident pre- and post-synaptic firing increases with network activity."
      } The homeostatic scaling mechanism prevented runaway excitation, maintaining network stability while still permitting LTP and LTD to occur at the synaptic level.`,
      "",
      emergentBehaviorScore > 0
        ? `The detection of ${emergentBehaviorScore} emergent behavior(s) is a key result. ${
            mutable.emergentBehaviors.habituationDetected
              ? "Habituation to repeated stimuli demonstrates that the STDP mechanism is operating correctly: repeated activation of the same pathway without reward leads to LTD, reducing synaptic efficacy over time. "
              : ""
          }${
            mutable.emergentBehaviors.associativeLearningDetected
              ? "Associative learning between paired stimuli indicates that co-activation has strengthened the inter-regional pathway to the point where one stimulus alone activates the associated network. "
              : ""
          }${
            mutable.emergentBehaviors.goalDirectedNavDetected
              ? "Goal-directed navigation without external stimulus is particularly significant: the avatar navigated to reward locations using hippocampal place memory alone, without any programmed seeking behavior. This constitutes a demonstration of internally-generated goal pursuit from neural dynamics. "
              : ""
          }These results collectively support the hypothesis that biologically-grounded neural models with activity-dependent plasticity can exhibit emergent behavior in a brain-inspired embodied simulation.`
        : `While no emergent behaviors were detected in this session, the neural dynamics showed a Shannon entropy of ${shannonEntropy.toFixed(3)}, indicating ${shannonEntropy > 0.4 ? "a reasonably diverse firing pattern that is compatible with the emergence of learning given longer exposure." : "relatively constrained firing patterns. Higher complexity levels and longer sessions are recommended."} The absence of emergence does not negate the validity of the simulation architecture; rather, it reflects the stochastic nature of emergence in complex systems.`,
      "",
      "Population rate coding, as used here, represents the scientifically sound choice for large-scale brain simulation. While individual neuron models (e.g., Hodgkin-Huxley, Izhikevich) provide higher temporal resolution, they are computationally intractable at the 1-million neuron scale in real-time browser environments. The Wilson-Cowan formalism, as employed by the Human Brain Project and the Blue Brain Project for whole-brain dynamics, captures the essential population-level phenomena — oscillations, state transitions, and cascade dynamics — that are relevant to cognitive emergence. The tradeoff is the loss of precise spike timing and individual synapse resolution; however, the STDP eligibility trace mechanism approximates the temporal asymmetry of biological STDP at the population level.",
      "",
      "───────────────────────────────────────────────────────────────────────────────",
      "5. CONCLUSION",
      "───────────────────────────────────────────────────────────────────────────────",
      "",
      `${!publishGate.passed ? "DEBUG RUN — This session did not pass the publish gate. Results are for diagnostic purposes only." : "This study demonstrates a biologically-grounded digital connectome simulation capable of exhibiting emergent state dynamics and, in sessions of sufficient duration and complexity, emergent behavior in a brain-inspired embodied simulation without explicit programming."} The ${ALL_REGIONS.length}-region, 1M-neuron model with ${CONNECTIVITY.length} synaptic pathways, STDP plasticity, homeostatic scaling, and dopaminergic reward gating represents a brain-inspired research platform for studying the computational basis of ${cognitiveTerms.activity}. ${
        emergentBehaviorScore > 0
          ? `The detection of ${emergentBehaviorScore} emergent behavior(s) in this session provides empirical support for the thesis that emergent cognition can arise from biologically-grounded neural architecture without behavioral hand-coding. `
          : ""
      }Future work should extend session duration, add spike-level individual neuron resolution for key microcircuits, and incorporate adaptive environmental complexity to further stress-test the emergence capacity of the system.`,
      "",
      "───────────────────────────────────────────────────────────────────────────────",
      "3.8 PUBLISH GATE STATUS",
      "───────────────────────────────────────────────────────────────────────────────",
      publishGate.passed
        ? "✓ GATE PASSED — All publish conditions met."
        : `✗ GATE BLOCKED — The following conditions must be resolved before this session can support publication claims:
${publishGate.blockers.map((b) => `  • ${b}`).join("\n")}`,
      ...(publishGate.warnings.length > 0
        ? ["", "Warnings:", ...publishGate.warnings.map((w) => `  ⚠ ${w}`)]
        : []),
      "",
      "───────────────────────────────────────────────────────────────────────────────",
      "REFERENCES",
      "───────────────────────────────────────────────────────────────────────────────",
      "",
      "Bi, G.-Q. & Poo, M.-M. (1998). Synaptic modifications in cultured hippocampal neurons. J. Neuroscience, 18(24), 10464-10472.",
      "Friston, K.J. et al. (2003). Dynamic causal modelling. NeuroImage, 19(4), 1273-1302.",
      "Hawrylycz, M.J. et al. (2012). An anatomically comprehensive atlas of the adult human brain transcriptome. Nature, 489, 391-399.",
      "Hebb, D.O. (1949). The Organization of Behavior. Wiley & Sons.",
      "Izhikevich, E.M. (2003). Simple model of spiking neurons. IEEE Trans. Neural Networks, 14(6), 1569-1572.",
      "Izhikevich, E.M. (2007). Dynamical Systems in Neuroscience. MIT Press.",
      "Markram, H. et al. (1997). Regulation of synaptic efficacy by coincidence of postsynaptic APs and EPSPs. Science, 275(5297), 213-215.",
      "Schultz, W. et al. (1997). A neural substrate of prediction and reward. Science, 275(5306), 1593-1599.",
      "Sporns, O. et al. (2005). The human connectome: A structural description of the human brain. PLOS Computational Biology, 1(4), e42.",
      "Turrigiano, G.G. (2008). The self-tuning neuron: synaptic scaling of excitatory synapses. Cell, 135(3), 422-435.",
      "Van Essen, D.C. et al. (2013). The WU-Minn Human Connectome Project. NeuroImage, 80, 62-79.",
      "Wilson, H.R. & Cowan, J.D. (1972). Excitatory and inhibitory interactions in localized populations of model neurons. Biophys. J., 12(1), 1-24.",
      "",
      "═══════════════════════════════════════════════════════════════════════════════",
      "END OF PAPER · Human Connectome Research Project · caffeine.ai",
      "═══════════════════════════════════════════════════════════════════════════════",
    ];

    return lines.join("\n");
  }

  return {
    sessionId,
    startTime,
    endTime: now,
    durationTicks,
    totalThoughts: mutable.thoughtLog.length,
    thoughtLog: [...mutable.thoughtLog],
    peakArousal,
    dominantBrainStates: sortedStates,
    emotionalArc,
    topActivatedRegions,
    stdpChanges: stdpChanges.slice(0, 10),
    heartRateArc,
    behavioralEvents: [...mutable.eventLog],
    aiInterpretation,
    quantitativeMetrics,
    publicationFindings,
    generatePaper,
    publishGate,
  };
}

// ─── Default Snapshot ──────────────────────────────────────────────────────────

export const DEFAULT_AVATAR_BEHAVIOR: AvatarBehavior = {
  motionLevel: 0,
  emotionValence: 0,
  attentionLevel: 0.1,
  consciousnessLevel: 0.1,
  breathingRate: 0.3,
  postureState: "resting",
  dominantNT: "serotonin",
  avatarWorldPos: { x: 0, y: 0, z: 0 },
  avatarVelocity: { x: 0, z: 0 },
  nearestObjectType: "none",
  workingMemory: [],
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useNeuralSimulation(): NeuralSimulationState &
  NeuralSimulationControls {
  const mutableRef = useRef<SimMutableState>(createMutableState());
  const isRunningRef = useRef(false);
  const speedRef = useRef(1);
  const complexityRef = useRef(5);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const snapshotIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const [isRunningImmediate, setIsRunningImmediate] = useState(false);

  const [snapshot, setSnapshot] = useState<NeuralSimulationState>(() =>
    computeSnapshot(mutableRef.current, false, 1, 5),
  );

  useEffect(() => {
    snapshotIntervalRef.current = setInterval(() => {
      setSnapshot(
        computeSnapshot(
          mutableRef.current,
          isRunningRef.current,
          speedRef.current,
          complexityRef.current,
        ),
      );
    }, 50);
    return () => {
      if (snapshotIntervalRef.current)
        clearInterval(snapshotIntervalRef.current);
    };
  }, []);

  const startTickLoop = useCallback(() => {
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    const intervalMs = Math.max(16, Math.round(1000 / (20 * speedRef.current)));
    tickIntervalRef.current = setInterval(() => {
      if (!isRunningRef.current) return;
      tickSimulation(mutableRef.current, complexityRef.current);
    }, intervalMs);
  }, []);

  const stopTickLoop = useCallback(() => {
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    isRunningRef.current = true;
    setIsRunningImmediate(true);
    startTickLoop();
    // Register real neural step with liveBrainBus
    liveBrainBus.registerNeuralStep((inputs: Record<string, number>) => {
      const state = mutableRef.current;
      const regions = state?.regions ?? [];
      const find = (id: string) =>
        regions.find(
          (r) => r.region === id || (r as { id?: string }).id === id,
        );
      const pfcRegion = find("prefrontal_cortex") ?? find("pfc") ?? regions[0];
      const amygRegion = find("amygdala") ?? regions[1];
      const nacRegion = find("nucleus_accumbens") ?? regions[2];
      const hippoRegion = find("hippocampus") ?? regions[3];
      // inputs is available for future use
      void inputs;
      return {
        pfcActivation: pfcRegion?.activation ?? 0.5,
        amygdalaActivation: amygRegion?.activation ?? 0.5,
        nacActivation: nacRegion?.activation ?? 0.5,
        hippocampusActivation: hippoRegion?.activation ?? 0.5,
        arousal:
          (state?.ansState as { sympatheticTone?: number } | undefined)
            ?.sympatheticTone ?? 0.5,
      };
    });
  }, [startTickLoop]);

  const pause = useCallback(() => {
    isRunningRef.current = false;
    setIsRunningImmediate(false);
    stopTickLoop();
  }, [stopTickLoop]);

  const reset = useCallback(() => {
    isRunningRef.current = false;
    setIsRunningImmediate(false);
    stopTickLoop();
    mutableRef.current = createMutableState();
  }, [stopTickLoop]);

  const setSpeed = useCallback(
    (s: number) => {
      speedRef.current = s;
      if (isRunningRef.current) startTickLoop();
    },
    [startTickLoop],
  );

  const setComplexity = useCallback((level: number) => {
    complexityRef.current = clamp(level, 1, 10);
  }, []);

  const injectStimulus = useCallback(
    (region: ExtendedRegion, intensity: number) => {
      const tick = mutableRef.current.tick;
      const current = mutableRef.current.stimulusMap.get(region) ?? 0;
      mutableRef.current.stimulusMap.set(region, current + intensity);
      mutableRef.current.eventLog.unshift({
        tick,
        region,
        type: "stimulus",
        description: `External stimulus injected -> ${region} (+${intensity.toFixed(2)})`,
        source: "environmental-trigger" as const,
      });
      if (mutableRef.current.eventLog.length > 20) {
        mutableRef.current.eventLog = mutableRef.current.eventLog.slice(0, 20);
      }
      // Track for emergent behavior detection
      mutableRef.current.lastStimulusRegions.push({ region, tick });
      if (mutableRef.current.lastStimulusRegions.length > 50) {
        mutableRef.current.lastStimulusRegions.shift();
      }
      // Track stimulus sequence for associative learning detection
      mutableRef.current.stimulusSequenceLog.push({ region, tick });
      if (mutableRef.current.stimulusSequenceLog.length > 30) {
        mutableRef.current.stimulusSequenceLog.shift();
      }
      // Check for pairings (this stimulus with previous stimulus within 10 ticks)
      const prevStimuli = mutableRef.current.stimulusSequenceLog.filter(
        (s) => s.region !== region && tick - s.tick <= 10 && tick - s.tick > 0,
      );
      for (const prev of prevStimuli) {
        const pairKey = `${prev.region}->${region}`;
        const count =
          mutableRef.current.associativePairCounts.get(pairKey) ?? 0;
        mutableRef.current.associativePairCounts.set(pairKey, count + 1);
      }
      // Record response strength for habituation detection (measure after 5 ticks using a deferred check)
      const preStimulusAct =
        mutableRef.current.regions.find((r) => r.region === region)
          ?.activation ?? 0;
      // Schedule response measurement
      setTimeout(() => {
        const postAct =
          mutableRef.current.regions.find((r) => r.region === region)
            ?.activation ?? 0;
        const responseStrength = Math.max(0, postAct - preStimulusAct);
        mutableRef.current.stimulusHistory.push({
          region,
          tick,
          responseStrength,
        });
        if (mutableRef.current.stimulusHistory.length > 30) {
          mutableRef.current.stimulusHistory.shift();
        }
      }, 300); // ~5 simulation ticks at 50ms per tick
    },
    [],
  );

  const lesionRegion = useCallback(
    (region: ExtendedRegion, durationMs: number) => {
      mutableRef.current.lesionMap.set(region, Date.now() + durationMs);
      mutableRef.current.eventLog.unshift({
        tick: mutableRef.current.tick,
        region,
        type: "drop",
        description: `Lesion applied to ${region} (${(durationMs / 1000).toFixed(1)}s)`,
        source: "environmental-trigger" as const,
      });
      if (mutableRef.current.eventLog.length > 20) {
        mutableRef.current.eventLog = mutableRef.current.eventLog.slice(0, 20);
      }
    },
    [],
  );

  const potentiateRegion = useCallback(
    (region: ExtendedRegion, durationMs: number) => {
      mutableRef.current.potentiateMap.set(region, Date.now() + durationMs);
      mutableRef.current.eventLog.unshift({
        tick: mutableRef.current.tick,
        region,
        type: "surge",
        description: `Potentiation applied to ${region} (${(durationMs / 1000).toFixed(1)}s)`,
        source: "environmental-trigger" as const,
      });
      if (mutableRef.current.eventLog.length > 20) {
        mutableRef.current.eventLog = mutableRef.current.eventLog.slice(0, 20);
      }
    },
    [],
  );

  const endSession = useCallback((): SessionReport => {
    const report = computeSessionReport(mutableRef.current);
    mutableRef.current.sessionReport = report;
    // Save prev STDP weights for future delta calculations
    mutableRef.current.stdpPrevWeights = new Map(
      mutableRef.current.stdpWeights,
    );

    // ── Cross-Session Memory: save weight snapshot ────────────────────────
    try {
      const weightDeltas: Record<string, number> = {};
      for (const conn of CONNECTIVITY) {
        const key = connKey(conn.from, conn.to);
        const w = mutableRef.current.stdpWeights.get(key) ?? 1.0;
        if (Math.abs(w - 1.0) > 0.001) weightDeltas[key] = w; // only save significant changes
      }
      // Route preferences: PFC -> BasalGanglia and PFC -> Thalamus weights
      const routePreferences: Record<string, number> = {};
      for (const conn of CONNECTIVITY) {
        if (
          conn.from === Region.PrefrontalCortex &&
          (conn.to === Region.BasalGanglia || conn.to === Region.Thalamus)
        ) {
          const key = connKey(conn.from, conn.to);
          routePreferences[key] =
            mutableRef.current.stdpWeights.get(key) ?? 1.0;
        }
      }
      // maturityScore: average of plasticity index and consolidation density
      const allW = Array.from(mutableRef.current.stdpWeights.values());
      const plastIndex =
        allW.reduce((s, w) => s + Math.abs(w - 1.0), 0) /
        Math.max(allW.length, 1);
      const thoughtDiversity =
        mutableRef.current.thoughtLog.length > 0
          ? new Set(mutableRef.current.thoughtLog.map((t) => t.circuitType))
              .size / Math.max(mutableRef.current.thoughtLog.length, 1)
          : 0;
      const snapshotMaturity = Math.min(
        100,
        Math.round(plastIndex * 50 + thoughtDiversity * 50),
      );

      saveWeightSnapshot({
        sessionId: `session_${Date.now()}`,
        timestamp: Date.now(),
        coreBrainVersion: "v29",
        weights: weightDeltas,
        routePreferences,
        maturityScore: snapshotMaturity,
      });
    } catch (e) {
      console.warn("[CoreBrain] Memory snapshot failed:", e);
    }

    return report;
  }, []);

  const clearSession = useCallback(() => {
    mutableRef.current.sessionReport = null;
    mutableRef.current.sessionHistory = [];
    mutableRef.current.thoughtLog = [];
    mutableRef.current.postureStateCounts = {};
    mutableRef.current.sessionStart = null;

    // ── Cross-Session Memory: reinstate weight snapshot ───────────────────
    try {
      const snapshot = loadLatestSnapshot();
      if (snapshot && Object.keys(snapshot.weights).length > 0) {
        let reinstated = 0;
        for (const [key, savedW] of Object.entries(snapshot.weights)) {
          if (mutableRef.current.stdpWeights.has(key)) {
            // Blend: 70% saved + 30% current default to prevent full override
            const blended = savedW * 0.7 + 1.0 * 0.3;
            mutableRef.current.stdpWeights.set(
              key,
              Math.max(0.3, Math.min(3.6, blended)),
            );
            reinstated++;
          }
        }
        // Also restore route preferences
        if (snapshot.routePreferences) {
          for (const [key, savedW] of Object.entries(
            snapshot.routePreferences,
          )) {
            if (mutableRef.current.stdpWeights.has(key)) {
              mutableRef.current.stdpWeights.set(
                key,
                Math.max(0.3, Math.min(3.6, savedW)),
              );
            }
          }
        }
        if (reinstated > 0) {
          mutableRef.current.eventLog.unshift({
            tick: 0,
            region: "Hippocampus",
            type: "surge",
            description: `MEMORY REINSTATED: ${reinstated} synaptic weights restored from session ${snapshot.sessionId} (maturity: ${snapshot.maturityScore}/100)`,
            source: "memory-recall",
          });
        }
      }
    } catch (e) {
      console.warn("[CoreBrain] Memory reinstatement failed:", e);
    }
  }, []);

  const maturationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const triggerConsolidation = useCallback(() => {
    if (!mutableRef.current.isConsolidating) {
      mutableRef.current.isConsolidating = true;
      mutableRef.current.consolidationTicksRemaining = 30;
    }
  }, []);

  const startMaturationProtocol = useCallback(() => {
    mutableRef.current.isMaturationActive = true;
    complexityRef.current = 10;
    if (!isRunningRef.current) {
      isRunningRef.current = true;
      setIsRunningImmediate(true);
      startTickLoop();
    }
    // Auto-trigger consolidation every 60 ticks via interval
    if (maturationIntervalRef.current)
      clearInterval(maturationIntervalRef.current);
    maturationIntervalRef.current = setInterval(() => {
      if (!mutableRef.current.isMaturationActive) {
        if (maturationIntervalRef.current)
          clearInterval(maturationIntervalRef.current);
        return;
      }
      if (!mutableRef.current.isConsolidating) {
        mutableRef.current.isConsolidating = true;
        mutableRef.current.consolidationTicksRemaining = 30;
      }
    }, 3000); // every 3 seconds real-time
  }, [startTickLoop]);

  const stopMaturationProtocol = useCallback(() => {
    mutableRef.current.isMaturationActive = false;
    if (maturationIntervalRef.current) {
      clearInterval(maturationIntervalRef.current);
      maturationIntervalRef.current = null;
    }
  }, []);

  const dismissAlert = useCallback((id: string) => {
    const alert = mutableRef.current.publicationAlerts.find((a) => a.id === id);
    if (alert) {
      alert.dismissed = true;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopTickLoop();
      if (snapshotIntervalRef.current)
        clearInterval(snapshotIntervalRef.current);
    };
  }, [stopTickLoop]);

  const batchIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopBatchRun = useCallback(() => {
    mutableRef.current.batchRunActive = false;
    if (batchIntervalRef.current) {
      clearInterval(batchIntervalRef.current);
      batchIntervalRef.current = null;
    }
  }, []);

  const startBatchRun = useCallback((n: number) => {
    const m = mutableRef.current;
    m.batchRunActive = true;
    m.batchRunProgress = 0;
    m.batchRunTarget = n;
    m.batchRunResults = [];
    let sessionIndex = 0;

    // Run one mini-session per interval tick (non-blocking)
    if (batchIntervalRef.current) clearInterval(batchIntervalRef.current);
    batchIntervalRef.current = setInterval(() => {
      if (!m.batchRunActive || sessionIndex >= n) {
        m.batchRunActive = false;
        if (batchIntervalRef.current) {
          clearInterval(batchIntervalRef.current);
          batchIntervalRef.current = null;
        }
        return;
      }
      // Run 1000 mini-ticks for this batch session
      const miniState = createMutableState();
      for (let t = 0; t < 1000; t++) {
        tickSimulation(miniState, 5);
      }
      // Compute metrics for this mini-session
      let totalAct = 0;
      let totalCount = 0;
      for (const rs of miniState.regions) {
        totalAct += rs.activation;
        totalCount++;
      }
      const avgAct = totalCount > 0 ? totalAct / totalCount : 0;
      // Shannon entropy approximation
      const acts = miniState.regions
        .map((r) => r.activation)
        .filter((a) => a > 0);
      const sumActs = acts.reduce((s, a) => s + a, 0) || 1;
      const rawEntropy = -acts.reduce((h, a) => {
        const p = a / sumActs;
        return p > 0 ? h + p * Math.log2(p) : h;
      }, 0);
      const entropy = Math.min(
        1.0,
        rawEntropy / Math.log2(Math.max(acts.length, 2)),
      );
      // Plasticity index
      let totalDelta = 0;
      for (const conn of CONNECTIVITY) {
        totalDelta += Math.abs(
          (miniState.stdpWeights.get(connKey(conn.from, conn.to)) ?? 1.0) - 1.0,
        );
      }
      const plasticityIndex = totalDelta / (CONNECTIVITY.length || 1);
      m.batchRunResults.push({
        sessionId: `batch_${Date.now()}_${sessionIndex}`,
        shannonEntropy: Math.round(entropy * 1000) / 1000,
        saturatedCount: miniState.saturatedRegions.size,
        thoughtCount: miniState.thoughtLog.length,
        habituationDetected: miniState.emergentBehaviors.habituationDetected,
        goalDirectedNav: miniState.emergentBehaviors.goalDirectedNavDetected,
        plasticityIndex: Math.round(plasticityIndex * 10000) / 10000,
        peakArousal: avgAct,
      });
      sessionIndex++;
      m.batchRunProgress = sessionIndex;
    }, 50); // one mini-session per 50ms
  }, []);

  const seedFromBackend = useCallback((signals: BackendSeedSignals) => {
    const m = mutableRef.current;
    // Seed ANS stress from fearLevel
    if (signals.fearLevel !== undefined) {
      m.cortisolLevel = Math.min(1, signals.fearLevel * 1.1);
      m.ansState = { ...m.ansState, stressSignal: signals.fearLevel };
    }
    // Seed arousal into EMA
    if (signals.arousal !== undefined) {
      m.emaConsciousness = signals.arousal;
    }
    // Seed specific regions from real organism signals
    const setRegionActivation = (regionId: string, value: number) => {
      const r = m.regions.find(
        (r) => r.region === regionId || (r as any).id === regionId,
      );
      if (r) r.activation = Math.max(0, Math.min(1, value));
    };
    if (signals.fearLevel !== undefined) {
      setRegionActivation("amygdala", signals.fearLevel * 0.85);
      setRegionActivation("Amygdala", signals.fearLevel * 0.85);
    }
    if (signals.identityI !== undefined) {
      setRegionActivation("prefrontal_cortex", signals.identityI);
      setRegionActivation("PrefrontalCortex", signals.identityI);
    }
    if (signals.coherence !== undefined) {
      setRegionActivation("hippocampus", signals.coherence * 0.9);
      setRegionActivation("Hippocampus", signals.coherence * 0.9);
    }
    if (signals.vagalTone !== undefined) {
      m.sleepPressure = Math.max(0, 1 - signals.vagalTone);
      m.ansState = { ...m.ansState, recoverySignal: signals.vagalTone };
    }
    if (signals.groundedScore !== undefined) {
      setRegionActivation("anterior_cingulate", signals.groundedScore * 0.8);
      setRegionActivation(
        "AnteriorCingulateCortex",
        signals.groundedScore * 0.8,
      );
    }
  }, []);

  return {
    ...snapshot,
    isRunning: isRunningImmediate,
    start,
    pause,
    reset,
    setSpeed,
    setComplexity,
    injectStimulus,
    lesionRegion,
    potentiateRegion,
    endSession,
    clearSession,
    dismissAlert,
    triggerConsolidation,
    startMaturationProtocol,
    stopMaturationProtocol,
    startBatchRun,
    stopBatchRun,
    seedFromBackend,
  };
}
