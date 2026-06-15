// Goal Hierarchy — Phase 4 Additional Systems
// Three-tier goal structure derived from neural/drive state.
// Emergent: no goals are scripted — they arise from actual brain signals.
// The hierarchy enforces biologically-motivated priority rules.
//
// Tier 1 — Immediate drive: strongest biologically-urgent pressure
//   (threat, hunger, pain, extreme arousal)
// Tier 2 — Active task: current goal given moderate drives and world state
//   (explore, retrieve reward, investigate novel, consolidate memory)
// Tier 3 — Higher-priority override: when threat/urgency surpasses a threshold,
//   this overrides Tier 2 and sends the system into survival mode

export type GoalLabel =
  // Immediate drives
  | "THREAT_AVOID"
  | "HUNGER_RELIEF"
  | "AROUSAL_REGULATE"
  | "EXPLORATION"
  // Active tasks
  | "REWARD_PURSUIT"
  | "MEMORY_RETRIEVAL"
  | "INVESTIGATE_NOVEL"
  | "REST_CONSOLIDATE"
  | "SOCIAL_ORIENT"
  // Override states
  | "SURVIVAL_OVERRIDE"
  | "FREEZE_ASSESS"
  | "IDLE";

export interface GoalHierarchyState {
  immediateDrive: GoalLabel; // what's most urgent RIGHT NOW
  immediateStrength: number; // 0-1
  activeTask: GoalLabel; // current operative goal
  activeTaskStrength: number; // 0-1
  overrideActive: boolean; // true if survival override engaged
  overrideGoal: GoalLabel | null;
  overrideReason: string;
  // Composite goal vector for thought decoder
  goalVector: Record<GoalLabel, number>; // salience of each goal
  // Dominant goal (winner-take-most)
  dominantGoal: GoalLabel;
  dominantGoalStrength: number;
  // Conflict: are two goals competing at similar strength?
  goalConflictScore: number; // 0-1
  // Goal persistence (ticks current dominant goal has held)
  dominantGoalPersistenceTicks: number;
  // Threshold & prediction modulation outputs
  thresholdAdaptationDelta: number; // how much to shift thresholds this tick
  predictionCommitmentScale: number; // multiplier for prediction engine commitment
}

const OVERRIDE_THREAT_THRESHOLD = 0.75;
const OVERRIDE_HUNGER_THRESHOLD = 0.9; // hunger override only at extremes now (auto-relief handles it)

export function initGoalHierarchy(): GoalHierarchyState {
  const goalVector = {} as Record<GoalLabel, number>;
  const labels: GoalLabel[] = [
    "THREAT_AVOID",
    "HUNGER_RELIEF",
    "AROUSAL_REGULATE",
    "EXPLORATION",
    "REWARD_PURSUIT",
    "MEMORY_RETRIEVAL",
    "INVESTIGATE_NOVEL",
    "REST_CONSOLIDATE",
    "SOCIAL_ORIENT",
    "SURVIVAL_OVERRIDE",
    "FREEZE_ASSESS",
    "IDLE",
  ];
  for (const l of labels) goalVector[l] = 0;
  return {
    immediateDrive: "IDLE",
    immediateStrength: 0,
    activeTask: "EXPLORATION",
    activeTaskStrength: 0.4,
    overrideActive: false,
    overrideGoal: null,
    overrideReason: "",
    goalVector,
    dominantGoal: "EXPLORATION",
    dominantGoalStrength: 0.4,
    goalConflictScore: 0,
    dominantGoalPersistenceTicks: 0,
    thresholdAdaptationDelta: 0,
    predictionCommitmentScale: 1.0,
  };
}

export function updateGoalHierarchy(
  prev: GoalHierarchyState,
  inputs: {
    threatLevel: number; // Amygdala
    hungerDrive: number; // homeostatic drive
    nacActivation: number; // reward approach
    hippocampusActivation: number; // memory retrieval
    noveltyScore: number; // from prediction layer
    explorationTimer: number; // ticks since last jolt
    globalArousal: number;
    pfcActivation: number;
    conflictSignal: number; // dACC
    sleepPressure: number;
  },
): GoalHierarchyState {
  const clamp = (v: number) => Math.max(0, Math.min(1, v));

  // Compute goal strengths from actual neural signals
  const goalVector = { ...prev.goalVector };

  goalVector.THREAT_AVOID = clamp(inputs.threatLevel * 1.1);
  goalVector.HUNGER_RELIEF = clamp(inputs.hungerDrive * 0.9);
  goalVector.AROUSAL_REGULATE = clamp(
    Math.abs(inputs.globalArousal - 0.45) * 1.2,
  );
  goalVector.EXPLORATION = clamp(
    (1 - inputs.threatLevel) * 0.4 +
      (inputs.explorationTimer > 100 ? 0.4 : 0.1) +
      inputs.noveltyScore * 0.3,
  );
  goalVector.REWARD_PURSUIT = clamp(inputs.nacActivation * 0.9);
  goalVector.MEMORY_RETRIEVAL = clamp(
    inputs.hippocampusActivation * 0.7 + inputs.noveltyScore * 0.2,
  );
  goalVector.INVESTIGATE_NOVEL = clamp(inputs.noveltyScore * 0.8);
  goalVector.REST_CONSOLIDATE = clamp(
    inputs.sleepPressure * 0.6 + (1 - inputs.globalArousal) * 0.3,
  );
  goalVector.SOCIAL_ORIENT = clamp(inputs.pfcActivation * 0.3);
  goalVector.FREEZE_ASSESS = clamp(inputs.conflictSignal * 0.8);
  goalVector.IDLE = clamp((1 - inputs.globalArousal) * 0.3);
  goalVector.SURVIVAL_OVERRIDE = clamp(
    Math.max(inputs.threatLevel - OVERRIDE_THREAT_THRESHOLD, 0) * 4 +
      Math.max(inputs.hungerDrive - OVERRIDE_HUNGER_THRESHOLD, 0) * 8,
  );

  // Survival override check
  const overrideActive =
    inputs.threatLevel > OVERRIDE_THREAT_THRESHOLD ||
    inputs.hungerDrive > OVERRIDE_HUNGER_THRESHOLD;
  const overrideGoal: GoalLabel | null = overrideActive
    ? inputs.threatLevel > inputs.hungerDrive
      ? "THREAT_AVOID"
      : "HUNGER_RELIEF"
    : null;
  const overrideReason = overrideActive
    ? inputs.threatLevel > inputs.hungerDrive
      ? `Amygdala threat ${(inputs.threatLevel * 100).toFixed(0)}% → survival override`
      : `Hunger ${(inputs.hungerDrive * 100).toFixed(0)}% → relief override`
    : "";

  // Find dominant and immediate drive
  let dominantGoal: GoalLabel = "IDLE";
  let dominantGoalStrength = 0;
  let immediateDrive: GoalLabel = "IDLE";
  let immediateStrength = 0;

  const driveGoals: GoalLabel[] = [
    "THREAT_AVOID",
    "HUNGER_RELIEF",
    "AROUSAL_REGULATE",
  ];

  // Winner-take-most
  for (const [label, strength] of Object.entries(goalVector) as [
    GoalLabel,
    number,
  ][]) {
    if (strength > dominantGoalStrength) {
      dominantGoalStrength = strength;
      dominantGoal = label;
    }
    if (driveGoals.includes(label) && strength > immediateStrength) {
      immediateStrength = strength;
      immediateDrive = label;
    }
  }

  // Active task: highest non-drive goal
  let activeTask: GoalLabel = "IDLE";
  let activeTaskStrength = 0;
  for (const [label, strength] of Object.entries(goalVector) as [
    GoalLabel,
    number,
  ][]) {
    if (
      !driveGoals.includes(label) &&
      label !== "SURVIVAL_OVERRIDE" &&
      strength > activeTaskStrength
    ) {
      activeTaskStrength = strength;
      activeTask = label;
    }
  }

  // Goal conflict: top two goals competing?
  const sorted = Object.values(goalVector).sort((a, b) => b - a);
  const goalConflictScore =
    sorted.length >= 2 && sorted[0] > 0.1
      ? clamp(1 - Math.abs(sorted[0] - sorted[1]) / sorted[0])
      : 0;

  // Persistence tracking
  const dominantGoalPersistenceTicks =
    dominantGoal === prev.dominantGoal
      ? prev.dominantGoalPersistenceTicks + 1
      : 0;

  // Threshold adaptation and prediction commitment scaling
  let thresholdAdaptationDelta = 0;
  let predictionCommitmentScale = 1.0;
  if (overrideActive) {
    thresholdAdaptationDelta = -0.05; // lower thresholds = urgent reactive mode
    predictionCommitmentScale = 0.7; // reduce commitment = reactive
  } else if (dominantGoalStrength > 0.7) {
    thresholdAdaptationDelta = 0.02; // raise thresholds = stable focused mode
    predictionCommitmentScale = 1.2; // increase commitment = deliberate
  }

  return {
    immediateDrive,
    immediateStrength,
    activeTask,
    activeTaskStrength,
    overrideActive,
    overrideGoal,
    overrideReason,
    goalVector,
    dominantGoal,
    dominantGoalStrength,
    goalConflictScore,
    dominantGoalPersistenceTicks,
    thresholdAdaptationDelta,
    predictionCommitmentScale,
  };
}
