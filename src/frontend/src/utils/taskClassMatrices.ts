// Task-Class Control Matrices
// CRITICAL DESIGN RULE: These matrices operate ONLY at:
//   1. Perception INPUT weighting (sensory signal gain modulation)
//   2. Action OUTPUT selection (motor arbitration priority weighting)
// They NEVER touch internal brain dynamics.
// Internal dynamics = pure emergence from Wilson-Cowan + plasticity + neuromodulators.
//
// Biological basis: PFC/ACC top-down attentional set modulates sensory gain
// (Desimone & Duncan 1995) and action selection (Frank 2006)
// but does not pre-script thought content.

export type TaskClass =
  | "THREAT"
  | "NAVIGATE"
  | "EXPLORE"
  | "REST"
  | "CONFLICT"
  | "REWARD"
  | "MEMORY_RECALL"
  | "STRATEGY_SHIFT";

export interface SoftPriorVectorEntry {
  navigation: number; // initial readiness bias [0,1]
  threat: number;
  memory: number;
  regulation: number;
  social: number;
  exploration: number;
}

export interface ControlMatrix {
  taskClass: TaskClass;
  // Core arbitration parameters
  salienceWeight: number; // [0,1] amplify threat/reward signals
  arbitrationPriority: number; // [0,1] urgency resolving competing actions
  escalationThreshold: number; // [0,1] how easily system escalates compute
  evalEmphasis: number; // [0,1] outcome evaluation strictness
  redTeamFactor: number; // [0,1] counterfactual safety check strength
  missionConsistencyWeight: number; // [0,1] goal alignment requirement
  // Soft prior readiness biases (overridable by live salience/arbitration)
  softPriorVector: SoftPriorVectorEntry;
  // Perception gain (applied at sensor interface only)
  threatSensitivityBoost: number;
  rewardSensitivityBoost: number;
  noveltyGain: number;
  spatialGain: number;
  // Action output bias (applied at motor selection interface only)
  approachBias: number;
  avoidBias: number;
  investigateBias: number;
  pauseBias: number;
  persistBias: number;
  switchBias: number;
}

// Concrete matrices — grounded in task-demand literature
// Botvinick 2007 (conflict), Rushworth 2004 (reward), LeDoux 2000 (threat)
export const TASK_CLASS_MATRICES: Record<TaskClass, ControlMatrix> = {
  THREAT: {
    taskClass: "THREAT",
    salienceWeight: 0.9,
    arbitrationPriority: 0.95,
    escalationThreshold: 0.3,
    evalEmphasis: 0.8,
    redTeamFactor: 0.9,
    missionConsistencyWeight: 0.85,
    softPriorVector: {
      navigation: 0.3,
      threat: 0.9,
      memory: 0.5,
      regulation: 0.6,
      social: 0.2,
      exploration: 0.1,
    },
    threatSensitivityBoost: 1.6,
    rewardSensitivityBoost: 0.4,
    noveltyGain: 0.7,
    spatialGain: 1.3,
    approachBias: 0.1,
    avoidBias: 0.9,
    investigateBias: 0.15,
    pauseBias: 0.4,
    persistBias: 0.3,
    switchBias: 0.7,
  },
  NAVIGATE: {
    taskClass: "NAVIGATE",
    salienceWeight: 0.6,
    arbitrationPriority: 0.6,
    escalationThreshold: 0.5,
    evalEmphasis: 0.7,
    redTeamFactor: 0.5,
    missionConsistencyWeight: 0.7,
    softPriorVector: {
      navigation: 0.9,
      threat: 0.3,
      memory: 0.5,
      regulation: 0.4,
      social: 0.3,
      exploration: 0.4,
    },
    threatSensitivityBoost: 0.9,
    rewardSensitivityBoost: 1.2,
    noveltyGain: 0.8,
    spatialGain: 1.5,
    approachBias: 0.7,
    avoidBias: 0.4,
    investigateBias: 0.4,
    pauseBias: 0.2,
    persistBias: 0.7,
    switchBias: 0.3,
  },
  EXPLORE: {
    taskClass: "EXPLORE",
    salienceWeight: 0.5,
    arbitrationPriority: 0.4,
    escalationThreshold: 0.7,
    evalEmphasis: 0.5,
    redTeamFactor: 0.3,
    missionConsistencyWeight: 0.5,
    softPriorVector: {
      navigation: 0.5,
      threat: 0.2,
      memory: 0.4,
      regulation: 0.3,
      social: 0.4,
      exploration: 0.9,
    },
    threatSensitivityBoost: 0.8,
    rewardSensitivityBoost: 1.1,
    noveltyGain: 1.6,
    spatialGain: 1.2,
    approachBias: 0.65,
    avoidBias: 0.25,
    investigateBias: 0.85,
    pauseBias: 0.3,
    persistBias: 0.5,
    switchBias: 0.5,
  },
  REST: {
    taskClass: "REST",
    salienceWeight: 0.2,
    arbitrationPriority: 0.2,
    escalationThreshold: 0.9,
    evalEmphasis: 0.2,
    redTeamFactor: 0.1,
    missionConsistencyWeight: 0.4,
    softPriorVector: {
      navigation: 0.2,
      threat: 0.1,
      memory: 0.4,
      regulation: 0.9,
      social: 0.5,
      exploration: 0.2,
    },
    threatSensitivityBoost: 0.6,
    rewardSensitivityBoost: 0.6,
    noveltyGain: 0.5,
    spatialGain: 0.5,
    approachBias: 0.2,
    avoidBias: 0.2,
    investigateBias: 0.3,
    pauseBias: 0.9,
    persistBias: 0.3,
    switchBias: 0.1,
  },
  CONFLICT: {
    taskClass: "CONFLICT",
    salienceWeight: 0.7,
    arbitrationPriority: 0.8,
    escalationThreshold: 0.4,
    evalEmphasis: 0.9,
    redTeamFactor: 0.8,
    missionConsistencyWeight: 0.9,
    softPriorVector: {
      navigation: 0.3,
      threat: 0.6,
      memory: 0.5,
      regulation: 0.7,
      social: 0.6,
      exploration: 0.3,
    },
    threatSensitivityBoost: 1.1,
    rewardSensitivityBoost: 1.1,
    noveltyGain: 0.7,
    spatialGain: 0.9,
    approachBias: 0.4,
    avoidBias: 0.4,
    investigateBias: 0.5,
    pauseBias: 0.7,
    persistBias: 0.3,
    switchBias: 0.6,
  },
  REWARD: {
    taskClass: "REWARD",
    salienceWeight: 0.7,
    arbitrationPriority: 0.65,
    escalationThreshold: 0.55,
    evalEmphasis: 0.75,
    redTeamFactor: 0.4,
    missionConsistencyWeight: 0.7,
    softPriorVector: {
      navigation: 0.6,
      threat: 0.2,
      memory: 0.5,
      regulation: 0.4,
      social: 0.5,
      exploration: 0.6,
    },
    threatSensitivityBoost: 0.7,
    rewardSensitivityBoost: 1.5,
    noveltyGain: 0.8,
    spatialGain: 1.2,
    approachBias: 0.8,
    avoidBias: 0.2,
    investigateBias: 0.45,
    pauseBias: 0.2,
    persistBias: 0.75,
    switchBias: 0.25,
  },
  MEMORY_RECALL: {
    taskClass: "MEMORY_RECALL",
    salienceWeight: 0.5,
    arbitrationPriority: 0.5,
    escalationThreshold: 0.6,
    evalEmphasis: 0.6,
    redTeamFactor: 0.4,
    missionConsistencyWeight: 0.6,
    softPriorVector: {
      navigation: 0.3,
      threat: 0.3,
      memory: 0.9,
      regulation: 0.4,
      social: 0.3,
      exploration: 0.4,
    },
    threatSensitivityBoost: 0.8,
    rewardSensitivityBoost: 0.9,
    noveltyGain: 0.6,
    spatialGain: 1.1,
    approachBias: 0.5,
    avoidBias: 0.3,
    investigateBias: 0.6,
    pauseBias: 0.5,
    persistBias: 0.5,
    switchBias: 0.3,
  },
  STRATEGY_SHIFT: {
    taskClass: "STRATEGY_SHIFT",
    salienceWeight: 0.6,
    arbitrationPriority: 0.7,
    escalationThreshold: 0.5,
    evalEmphasis: 0.8,
    redTeamFactor: 0.9,
    missionConsistencyWeight: 0.8,
    softPriorVector: {
      navigation: 0.5,
      threat: 0.4,
      memory: 0.6,
      regulation: 0.5,
      social: 0.4,
      exploration: 0.7,
    },
    threatSensitivityBoost: 1.0,
    rewardSensitivityBoost: 1.0,
    noveltyGain: 1.2,
    spatialGain: 1.0,
    approachBias: 0.4,
    avoidBias: 0.5,
    investigateBias: 0.6,
    pauseBias: 0.4,
    persistBias: 0.2,
    switchBias: 0.9,
  },
};

export function classifyTaskClass(
  threatLevel: number,
  rewardSignal: number,
  conflictSignal: number,
  noveltyScore: number,
  hungerDrive: number,
  globalArousal: number,
  memoryRecallActive: boolean,
  strategyShiftTriggered: boolean,
): { taskClass: TaskClass; confidence: number } {
  const scores: Record<TaskClass, number> = {
    THREAT: threatLevel * 0.7 + globalArousal * 0.2 + (1 - rewardSignal) * 0.1,
    NAVIGATE:
      (1 - threatLevel) * 0.4 + rewardSignal * 0.3 + (1 - conflictSignal) * 0.3,
    EXPLORE:
      noveltyScore * 0.5 + (1 - threatLevel) * 0.3 + (1 - hungerDrive) * 0.2,
    REST:
      (1 - globalArousal) * 0.5 +
      (1 - threatLevel) * 0.3 +
      (1 - hungerDrive) * 0.2,
    CONFLICT: conflictSignal * 0.6 + globalArousal * 0.2 + threatLevel * 0.2,
    REWARD: rewardSignal * 0.6 + hungerDrive * 0.3 + (1 - threatLevel) * 0.1,
    MEMORY_RECALL:
      (memoryRecallActive ? 0.8 : 0.1) +
      noveltyScore * 0.1 +
      (1 - globalArousal) * 0.1,
    STRATEGY_SHIFT:
      (strategyShiftTriggered ? 0.9 : 0.05) + conflictSignal * 0.05,
  };
  const keys = Object.keys(scores) as TaskClass[];
  const vals = keys.map((k) => scores[k]);
  const maxVal = Math.max(...vals);
  const exps = vals.map((v) => Math.exp(v - maxVal));
  const sumExp = exps.reduce((a, b) => a + b, 0);
  const probs = exps.map((e) => e / sumExp);
  const maxIdx = probs.indexOf(Math.max(...probs));
  return { taskClass: keys[maxIdx], confidence: probs[maxIdx] };
}

export function applyPerceptionModulation(
  matrix: ControlMatrix,
  rawThreat: number,
  rawReward: number,
  rawNovelty: number,
  rawSpatial: number,
): { threat: number; reward: number; novelty: number; spatial: number } {
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  return {
    threat: clamp(rawThreat * matrix.threatSensitivityBoost),
    reward: clamp(rawReward * matrix.rewardSensitivityBoost),
    novelty: clamp(rawNovelty * matrix.noveltyGain),
    spatial: clamp(rawSpatial * matrix.spatialGain),
  };
}

export function applyActionModulation(
  matrix: ControlMatrix,
  base: {
    approach: number;
    avoid: number;
    investigate: number;
    pause: number;
    persist: number;
    switch: number;
  },
): {
  approach: number;
  avoid: number;
  investigate: number;
  pause: number;
  persist: number;
  switch: number;
} {
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  return {
    approach: clamp(
      base.approach * matrix.approachBias + matrix.approachBias * 0.1,
    ),
    avoid: clamp(base.avoid * matrix.avoidBias + matrix.avoidBias * 0.1),
    investigate: clamp(
      base.investigate * matrix.investigateBias + matrix.investigateBias * 0.1,
    ),
    pause: clamp(base.pause * matrix.pauseBias + matrix.pauseBias * 0.1),
    persist: clamp(
      base.persist * matrix.persistBias + matrix.persistBias * 0.1,
    ),
    switch: clamp(base.switch * matrix.switchBias + matrix.switchBias * 0.1),
  };
}
