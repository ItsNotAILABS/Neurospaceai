// ─── Movement Substrate Types v1.0.0 ──────────────────────────────────────────
// Shared movement substrate for NeuroEmergence Core entities.
// WarCommand and BattleOps inject intent; they do not own the movement engine.

export const MOVEMENT_SUBSTRATE_VERSION = "1.0.0";

// ── Body regions (Layer 2) ──────────────────────────────────────────────────
export type BodyRegionId =
  | "head_neck"
  | "torso_spine"
  | "left_arm"
  | "right_arm"
  | "left_hand"
  | "right_hand"
  | "pelvis_hips"
  | "left_leg"
  | "right_leg";

export const BODY_REGIONS: BodyRegionId[] = [
  "head_neck",
  "torso_spine",
  "left_arm",
  "right_arm",
  "left_hand",
  "right_hand",
  "pelvis_hips",
  "left_leg",
  "right_leg",
];

// ── Joint clusters (Layer 3) ────────────────────────────────────────────────
export type JointClusterId =
  | "neck"
  | "upper_spine"
  | "lower_spine_pelvis"
  | "left_shoulder"
  | "right_shoulder"
  | "left_elbow_forearm"
  | "right_elbow_forearm"
  | "left_wrist"
  | "right_wrist"
  | "left_hand_fingers"
  | "right_hand_fingers"
  | "left_hip"
  | "right_hip"
  | "left_knee"
  | "right_knee"
  | "left_ankle_foot"
  | "right_ankle_foot";

export const JOINT_CLUSTERS: JointClusterId[] = [
  "neck",
  "upper_spine",
  "lower_spine_pelvis",
  "left_shoulder",
  "right_shoulder",
  "left_elbow_forearm",
  "right_elbow_forearm",
  "left_wrist",
  "right_wrist",
  "left_hand_fingers",
  "right_hand_fingers",
  "left_hip",
  "right_hip",
  "left_knee",
  "right_knee",
  "left_ankle_foot",
  "right_ankle_foot",
];

export const CLUSTER_TO_REGION: Record<JointClusterId, BodyRegionId> = {
  neck: "head_neck",
  upper_spine: "torso_spine",
  lower_spine_pelvis: "pelvis_hips",
  left_shoulder: "left_arm",
  right_shoulder: "right_arm",
  left_elbow_forearm: "left_arm",
  right_elbow_forearm: "right_arm",
  left_wrist: "left_hand",
  right_wrist: "right_hand",
  left_hand_fingers: "left_hand",
  right_hand_fingers: "right_hand",
  left_hip: "pelvis_hips",
  right_hip: "pelvis_hips",
  left_knee: "left_leg",
  right_knee: "right_leg",
  left_ankle_foot: "left_leg",
  right_ankle_foot: "right_leg",
};

// ── Reflex types (Layer 4) ──────────────────────────────────────────────────
export type ReflexType =
  | "slip_correction"
  | "stumble_recovery"
  | "balance_rescue"
  | "joint_overload_reduction"
  | "grip_correction"
  | "collision_micro_avoidance"
  | "foot_placement_correction"
  | "posture_rescue"
  | "contact_recoil"
  | "terrain_adaptation_snap";

export interface ReflexEvent {
  reflexType: ReflexType;
  clusterId: JointClusterId;
  regionId: BodyRegionId;
  activationReason: string;
  intensity: number; // 0–1
  remainingTicks: number;
  startedAt: number;
}

// ── Body-state sensor mesh (Layer 5) ───────────────────────────────────────
export interface JointSensorState {
  clusterId: JointClusterId;
  angle: number; // normalized −1 to 1
  velocity: number; // normalized 0–1
  load: number; // effort / force 0–1
  orientation: [number, number, number]; // euler xyz normalized
  stabilityScore: number; // 0–1 (1 = stable)
  fatigueAnalog: number; // 0–1
  damageAnalog: number; // 0–1 (0 = healthy)
  slipRisk: number; // 0–1
  mobilityConstraint: number; // 0–1 (0 = free)
}

export interface BodyStateMesh {
  joints: Record<JointClusterId, JointSensorState>;
  centerOfMassEstimate: [number, number, number];
  overallStabilityScore: number;
  contactPoints: Partial<Record<JointClusterId, boolean>>;
  terrainDifficultyEstimate: number;
  motionSmoothnessScore: number;
  proprioceptiveConfidence: number;
  totalFatigueLoad: number;
  totalDamageLoad: number;
}

// ── Movement modes ─────────────────────────────────────────────────────────
export type MovementMode =
  | "idle"
  | "walk"
  | "run"
  | "sprint"
  | "crouch"
  | "prone"
  | "climb"
  | "swim"
  | "combat_stance"
  | "carry"
  | "recovery";

export type PostureBias =
  | "upright"
  | "forward_lean"
  | "low_profile"
  | "combat_ready"
  | "defensive"
  | "balanced"
  | "exhausted";

// ── Strategic / tactical intent interfaces ─────────────────────────────────
export interface StrategicMovementIntent {
  source: "warcommand";
  movementPriority:
    | "advance"
    | "hold"
    | "retreat"
    | "flank"
    | "regroup"
    | "none";
  speedBias: number; // 0–1
  stealthBias: number; // 0–1
  aggressionBias: number; // 0–1
  cautionBias: number; // 0–1
  formationConstraint?: string;
  objectiveVector?: [number, number, number];
  timestamp: number;
}

export interface TacticalMovementContext {
  source: "battleops";
  immediateThreats: number; // 0–1 threat density nearby
  coverOpportunity: number; // 0–1
  terrainChallenge: number; // 0–1
  suppressionLevel: number; // 0–1
  urgencyMultiplier: number; // 0–1
  contactEngaged: boolean;
  timestamp: number;
}

// ── Tuning parameters ─────────────────────────────────────────────────────
export interface MovementSubstrateTuning {
  embodimentFidelity: number; // 0–1 (1 = fully distributed)
  reflexSensitivity: number; // 0–1
  bodyPreservationWeight: number; // 0–1
  balancePriority: number; // 0–1
  smoothnessVsAggression: number; // 0 = smooth, 1 = aggressive
  recoveryAggressiveness: number; // 0–1
  terrainAdaptationWeight: number; // 0–1
  injuryCompensationScale: number; // 0–1
  contactConfidence: number; // 0–1
  // per-region tuning
  regionalStiffness: Record<BodyRegionId, number>;
  regionalResponsiveness: Record<BodyRegionId, number>;
  // gait
  stepFrequency: number; // steps/sec normalized
  strideLength: number; // normalized 0–1
  hipSwing: number; // 0–1
  armSwing: number; // 0–1
}

// ── Layer states ───────────────────────────────────────────────────────────
export interface MainMovementBrainState {
  movementMode: MovementMode;
  postureBias: PostureBias;
  speedEnvelope: number; // 0–1
  forceEnvelope: number; // 0–1
  contactPreference: number; // 0–1 (1 = maximize contact)
  stabilityThreshold: number; // below this → reflex trigger
  bodyPreservationBias: number; // 0–1
  coordinationPriority: "speed" | "stability" | "stealth" | "recovery";
  perRegionTargets: Record<BodyRegionId, number>; // activation targets 0–1
  strategicInfluence: number; // 0–1 how much WarCommand is driving
  tacticalInfluence: number; // 0–1 how much BattleOps is driving
  conflictResolutionLog: string[];
}

export interface RegionalMovementBrainState {
  regionId: BodyRegionId;
  targetActivation: number; // from Main Brain
  currentActivation: number; // actual
  coordinationLoad: number; // 0–1
  neighborNegotiations: Partial<Record<BodyRegionId, number>>;
  localStabilityScore: number;
  postureContribution: number; // 0–1
  locomotionContribution: number; // 0–1
  manipulationContribution: number; // 0–1
  reflexOverrideActive: boolean;
}

export interface JointClusterState {
  clusterId: JointClusterId;
  regionId: BodyRegionId;
  desiredActivation: number; // 0–1
  currentActivation: number; // 0–1
  stiffness: number; // 0–1
  damping: number; // 0–1
  contactAdaptation: number; // 0–1
  localStabilization: number; // 0–1
  smoothedOutput: number; // filtered execution output
  reflexOverride: boolean;
  loadBearing: boolean;
}

export interface MovementSubstrateState {
  version: string;
  tickCount: number;
  timestampMs: number;
  mainBrain: MainMovementBrainState;
  regions: Record<BodyRegionId, RegionalMovementBrainState>;
  clusters: Record<JointClusterId, JointClusterState>;
  reflexLayer: ReflexEvent[];
  bodyMesh: BodyStateMesh;
  tuning: MovementSubstrateTuning;
  telemetry: MovementTelemetry;
}

export interface MovementTelemetry {
  activeMovementMode: MovementMode;
  strategicInfluenceSummary: string;
  tacticalInfluenceSummary: string;
  stabilityScore: number;
  bodyPreservationStatus: "nominal" | "compensating" | "critical";
  movementSmoothness: number;
  impairmentCompensation: number;
  contactConfidence: number;
  currentPostureBias: PostureBias;
  activeReflexCount: number;
  highLoadClusters: JointClusterId[];
  regionPriorityMap: Record<BodyRegionId, number>;
  pipelineStepStatus: Record<PipelineStep, "ok" | "warn" | "skip">;
}

export type PipelineStep =
  | "body_state_ingest"
  | "env_ingest"
  | "strategic_ingest"
  | "tactical_ingest"
  | "main_brain_arbitration"
  | "regional_decomposition"
  | "cluster_execution"
  | "reflex_interception"
  | "output_ik"
  | "telemetry_return";

export const PIPELINE_STEPS: PipelineStep[] = [
  "body_state_ingest",
  "env_ingest",
  "strategic_ingest",
  "tactical_ingest",
  "main_brain_arbitration",
  "regional_decomposition",
  "cluster_execution",
  "reflex_interception",
  "output_ik",
  "telemetry_return",
];
