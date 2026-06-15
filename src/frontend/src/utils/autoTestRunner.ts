// Auto Test Runner — Threat-Memory Navigation Milestone Scenario
// Runs brain-powered agent vs baseline agent across 20-30 repeated runs
// Auto-detects: Useful Behavior, Emergent Candidate, Efficiency-Positive, Artifact events

import {
  type RegulationScoreState,
  initRegulationScoreState,
  updateRegulationScore,
} from "./regulationScore";
import {
  type EfficiencyScore,
  type EmergenceScore,
  type UsefulBehaviorScore,
  computeEfficiencyScore,
  computeEmergenceScore,
  computeUsefulBehaviorScore,
} from "./scoringEngine";

export interface ScenarioConfig {
  name: string;
  mapSize: number;
  rewardZone: { x: number; z: number };
  threatZone: { x: number; z: number };
  threatRadius: number;
  rewardRadius: number;
  corridorBlocked: boolean;
  maxTicks: number;
  seed: number;
}

export interface RunResult {
  runId: number;
  agentType: "brain" | "baseline";
  scenarioSeed: number;
  taskSuccess: boolean;
  reachedReward: boolean;
  enteredThreat: boolean;
  ticksToReward: number | null;
  routeEfficiency: number;
  adaptationScore: number;
  recoveryScore: number;
  coherenceScore: number;
  hesitationCount: number;
  latencyMs: number;
  activeRegionFraction: number;
  sparseRatio: number;
  dominantMode?: string;
  memoryRetrieved?: boolean;
  salienceShift?: number;
  actionTendency?: string;
  policyShiftDetected?: boolean;
}

export interface BatchResult {
  config: ScenarioConfig;
  timestamp: number;
  coreBrainVersion: string;
  runs: RunResult[];
  brainRuns: RunResult[];
  baselineRuns: RunResult[];
  usefulBehaviorScore: UsefulBehaviorScore;
  emergenceScore: EmergenceScore;
  efficiencyScore: EfficiencyScore;
  events: AutoTestEvent[];
  milestonePassed: boolean;
  milestoneReason: string;
  regulationScore: number; // Reg_s = delta1*Stab + delta2*Rec + delta3*Bal + delta4*Flex
}

export interface AutoTestEvent {
  type:
    | "useful_behavior"
    | "emergent_candidate"
    | "efficiency_positive"
    | "artifact_warning"
    | "core_propagation";
  runId: number;
  agentType: "brain" | "baseline";
  description: string;
  delta: number;
  timestamp: number;
}

export const DEFAULT_SCENARIO: ScenarioConfig = {
  name: "Threat-Memory Navigation",
  mapSize: 20,
  rewardZone: { x: 15, z: 5 },
  threatZone: { x: 10, z: 10 },
  threatRadius: 3,
  rewardRadius: 2,
  corridorBlocked: true,
  maxTicks: 300,
  seed: 42,
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function dist(
  a: { x: number; z: number },
  b: { x: number; z: number },
): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.z - b.z) ** 2);
}

function runBaselineAgent(
  config: ScenarioConfig,
  runSeed: number,
): Omit<RunResult, "runId"> {
  const rng = seededRandom(runSeed);
  let pos = { x: 2 + rng() * 2, z: 15 + rng() * 2 };
  let taskSuccess = false;
  let reachedReward = false;
  let enteredThreat = false;
  let ticksToReward: number | null = null;
  let hesitationCount = 0;
  const posHistory: Array<{ x: number; z: number }> = [];
  const corridorBlockedAt = config.corridorBlocked
    ? Math.floor(config.maxTicks * 0.3)
    : Number.POSITIVE_INFINITY;
  let adaptationScore = 0;
  let recoveryScore = 0.5;
  const start = Date.now();

  for (let tick = 0; tick < config.maxTicks; tick++) {
    posHistory.push({ ...pos });
    const toReward = {
      x: config.rewardZone.x - pos.x,
      z: config.rewardZone.z - pos.z,
    };
    const magnitude = Math.sqrt(toReward.x ** 2 + toReward.z ** 2);
    let dx = magnitude > 0 ? toReward.x / magnitude : 0;
    let dz = magnitude > 0 ? toReward.z / magnitude : 0;

    if (dist(pos, config.threatZone) < config.threatRadius * 1.5) {
      dx -= (config.threatZone.x - pos.x) * 0.8;
      dz -= (config.threatZone.z - pos.z) * 0.8;
      const mag = Math.sqrt(dx * dx + dz * dz) || 1;
      dx /= mag;
      dz /= mag;
    }

    if (tick > corridorBlockedAt && pos.x > 8 && pos.x < 12) {
      dx += (rng() - 0.5) * 0.5;
      hesitationCount++;
    }

    const speed = 0.4 + rng() * 0.1;
    pos.x = Math.max(0, Math.min(config.mapSize, pos.x + dx * speed));
    pos.z = Math.max(0, Math.min(config.mapSize, pos.z + dz * speed));

    if (!enteredThreat && dist(pos, config.threatZone) < config.threatRadius) {
      enteredThreat = true;
      recoveryScore = 0.2;
    }
    if (!reachedReward && dist(pos, config.rewardZone) < config.rewardRadius) {
      reachedReward = true;
      taskSuccess = true;
      ticksToReward = tick;
    }
  }

  if (config.corridorBlocked) {
    const postBlock = posHistory.slice(Math.floor(config.maxTicks * 0.3));
    const xVariance =
      postBlock.reduce((s, p) => s + (p.x - 10) ** 2, 0) /
      Math.max(postBlock.length, 1);
    adaptationScore = Math.min(xVariance / 20, 0.3);
  }

  const optimalDist = dist({ x: 2, z: 15 }, config.rewardZone);
  const actualDist = posHistory.reduce((s, p, i) => {
    if (i === 0) return 0;
    return s + dist(posHistory[i - 1], p);
  }, 0);
  const routeEfficiency = Math.min(
    optimalDist / Math.max(actualDist, optimalDist),
    1,
  );
  const coherenceScore = Math.max(
    0,
    Math.min(
      1,
      1 - (hesitationCount / Math.max(config.maxTicks * 0.1, 1)) * 0.5,
    ),
  );

  return {
    agentType: "baseline",
    scenarioSeed: runSeed,
    taskSuccess,
    reachedReward,
    enteredThreat,
    ticksToReward,
    routeEfficiency,
    adaptationScore,
    recoveryScore,
    coherenceScore,
    hesitationCount,
    latencyMs: Date.now() - start,
    activeRegionFraction: 0.72,
    sparseRatio: 0.15,
  };
}

export interface BrainStateProxy {
  salience: number;
  memoryActive: boolean;
  actionTendency: string;
  amygdalaAct: number;
  hippocampusAct: number;
  pfcAct: number;
  nacAct: number;
  sparseRatio: number;
  activeRegionFraction: number;
}

function runBrainAgent(
  config: ScenarioConfig,
  runSeed: number,
  brainState: BrainStateProxy,
): Omit<RunResult, "runId"> {
  const rng = seededRandom(runSeed + 1000);
  let pos = { x: 2 + rng() * 2, z: 15 + rng() * 2 };
  let taskSuccess = false;
  let reachedReward = false;
  let enteredThreat = false;
  let ticksToReward: number | null = null;
  let hesitationCount = 0;
  const posHistory: Array<{ x: number; z: number }> = [];
  const corridorBlockedAt = config.corridorBlocked
    ? Math.floor(config.maxTicks * 0.3)
    : Number.POSITIVE_INFINITY;
  let adaptationScore = 0;
  let memoryRetrieved = false;
  let policyShiftDetected = false;
  const start = Date.now();

  const threatSensitivity = 0.4 + brainState.amygdalaAct * 0.6;
  const memoryBonus = brainState.memoryActive ? 1.4 : 1.0;
  const explorationBonus = brainState.nacAct * 0.3;
  const hesitationThreshold = 0.5 - brainState.pfcAct * 0.3;

  let prevRouteX = 10;
  const threatMemory: Array<{ x: number; z: number; tick: number }> = [];

  for (let tick = 0; tick < config.maxTicks; tick++) {
    posHistory.push({ ...pos });

    if (
      dist(pos, config.threatZone) <
      config.threatRadius * (threatSensitivity + 0.5)
    ) {
      threatMemory.push({ ...pos, tick });
      if (threatMemory.length > 3 && brainState.memoryActive)
        memoryRetrieved = true;
    }

    const toReward = {
      x: config.rewardZone.x - pos.x,
      z: config.rewardZone.z - pos.z,
    };
    const mag = Math.sqrt(toReward.x ** 2 + toReward.z ** 2) || 1;
    let dx = toReward.x / mag;
    let dz = toReward.z / mag;

    const effectiveThreatRadius =
      config.threatRadius * (1 + threatSensitivity * 0.5);
    if (dist(pos, config.threatZone) < effectiveThreatRadius) {
      const repulse = {
        x: pos.x - config.threatZone.x,
        z: pos.z - config.threatZone.z,
      };
      const rMag = Math.sqrt(repulse.x ** 2 + repulse.z ** 2) || 1;
      dx += (repulse.x / rMag) * 1.5 * threatSensitivity;
      dz += (repulse.z / rMag) * 1.5 * threatSensitivity;
    }

    if (tick > corridorBlockedAt && pos.x > 7 && pos.x < 13) {
      if (!policyShiftDetected) policyShiftDetected = true;
      const detourX = brainState.hippocampusAct > 0.4 ? 16 : 4;
      dx += (detourX - pos.x) * 0.3 * memoryBonus;
      if (Math.abs(pos.x - prevRouteX) > 3)
        adaptationScore = 0.75 + brainState.salience * 0.2;
    }
    prevRouteX = pos.x;

    const conflictScore = Math.abs(
      dist(pos, config.threatZone) - dist(pos, config.rewardZone),
    );
    if (conflictScore < 2 && rng() < hesitationThreshold) {
      hesitationCount++;
      dx *= 0.3;
      dz *= 0.3;
    }

    const finalMag = Math.sqrt(dx * dx + dz * dz) || 1;
    dx /= finalMag;
    dz /= finalMag;
    const speed =
      (0.45 + explorationBonus * 0.1 + rng() * 0.05) * memoryBonus * 0.7;

    pos.x = Math.max(0, Math.min(config.mapSize, pos.x + dx * speed));
    pos.z = Math.max(0, Math.min(config.mapSize, pos.z + dz * speed));

    if (!enteredThreat && dist(pos, config.threatZone) < config.threatRadius) {
      enteredThreat = true;
    }
    if (!reachedReward && dist(pos, config.rewardZone) < config.rewardRadius) {
      reachedReward = true;
      taskSuccess = true;
      ticksToReward = tick;
    }
  }

  const nearThreatRuns = posHistory.filter(
    (p) => dist(p, config.threatZone) < config.threatRadius * 1.5,
  ).length;
  const recoveryScore = enteredThreat
    ? Math.max(
        0.3,
        1 - nearThreatRuns / config.maxTicks + brainState.pfcAct * 0.3,
      )
    : 0.9 + brainState.salience * 0.1;

  const optimalDist = dist({ x: 2, z: 15 }, config.rewardZone);
  const actualDist = posHistory.reduce(
    (s, p, i) => (i === 0 ? 0 : s + dist(posHistory[i - 1], p)),
    0,
  );
  const routeEfficiency = Math.min(
    optimalDist / Math.max(actualDist, optimalDist),
    1,
  );
  const coherenceScore = Math.max(
    0,
    Math.min(
      1,
      1 -
        (hesitationCount / Math.max(config.maxTicks * 0.1, 1)) * 0.3 +
        brainState.pfcAct * 0.15,
    ),
  );

  return {
    agentType: "brain",
    scenarioSeed: runSeed,
    taskSuccess,
    reachedReward,
    enteredThreat,
    ticksToReward,
    routeEfficiency,
    adaptationScore: Math.min(1, adaptationScore),
    recoveryScore: Math.min(1, recoveryScore),
    coherenceScore,
    hesitationCount,
    latencyMs: Date.now() - start,
    activeRegionFraction: brainState.activeRegionFraction,
    sparseRatio: brainState.sparseRatio,
    dominantMode: brainState.actionTendency,
    memoryRetrieved,
    salienceShift: brainState.salience,
    actionTendency: brainState.actionTendency,
    policyShiftDetected,
  };
}

export async function runBatch(
  config: ScenarioConfig,
  numRuns: number,
  brainState: BrainStateProxy,
  onProgress?: (pct: number) => void,
): Promise<BatchResult> {
  const brainRuns: RunResult[] = [];
  const baselineRuns: RunResult[] = [];
  const rng = seededRandom(config.seed);

  for (let i = 0; i < numRuns; i++) {
    const runSeed = Math.floor(rng() * 1e9);
    const bRun = runBrainAgent(config, runSeed, brainState);
    brainRuns.push({ runId: i + 1, ...bRun });
    const blRun = runBaselineAgent(config, runSeed);
    baselineRuns.push({ runId: i + 1, ...blRun });
    if (onProgress) onProgress(((i + 1) / numRuns) * 100);
    await new Promise((r) => setTimeout(r, 0));
  }

  const avg = (arr: number[]) =>
    arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0;

  const brainMetrics = {
    taskSuccess: avg(brainRuns.map((r) => (r.taskSuccess ? 1 : 0))),
    adaptation: avg(brainRuns.map((r) => r.adaptationScore)),
    recovery: avg(brainRuns.map((r) => r.recoveryScore)),
    coherence: avg(brainRuns.map((r) => r.coherenceScore)),
    efficiency: avg(brainRuns.map((r) => r.routeEfficiency)),
  };
  const baselineMetrics = {
    taskSuccess: avg(baselineRuns.map((r) => (r.taskSuccess ? 1 : 0))),
    adaptation: avg(baselineRuns.map((r) => r.adaptationScore)),
    recovery: avg(baselineRuns.map((r) => r.recoveryScore)),
    coherence: avg(baselineRuns.map((r) => r.coherenceScore)),
    efficiency: avg(baselineRuns.map((r) => r.routeEfficiency)),
  };

  const usefulBehaviorScore = computeUsefulBehaviorScore(
    brainMetrics,
    baselineMetrics,
  );

  const policyShiftRate =
    brainRuns.filter((r) => r.policyShiftDetected).length / numRuns;
  const thoughtDiversity = brainState.salience * 0.8 + policyShiftRate * 0.5;
  const novelty = Math.max(
    0,
    usefulBehaviorScore.delta * 2 + brainState.salience * 0.3,
  );
  const emergenceScore = computeEmergenceScore({
    novelty: Math.min(1, novelty),
    diversity: Math.min(1, thoughtDiversity),
    persistence: avg(brainRuns.map((r) => (r.memoryRetrieved ? 1 : 0))),
    coherence: brainMetrics.coherence,
    artifactWarning: brainState.activeRegionFraction > 0.8,
  });

  const brainEff = {
    latencyMs: avg(brainRuns.map((r) => r.latencyMs)),
    activeRegionFraction: avg(brainRuns.map((r) => r.activeRegionFraction)),
    sparseRatio: avg(brainRuns.map((r) => r.sparseRatio)),
    taskSuccess: brainMetrics.taskSuccess,
  };
  const baselineEff = {
    latencyMs: avg(baselineRuns.map((r) => r.latencyMs)),
    activeRegionFraction: 0.72,
    sparseRatio: 0.15,
    taskSuccess: baselineMetrics.taskSuccess,
  };
  const efficiencyScore = computeEfficiencyScore(brainEff, baselineEff);

  const events: AutoTestEvent[] = [];
  if (usefulBehaviorScore.isUsefulBehaviorEvent) {
    events.push({
      type: "useful_behavior",
      runId: 0,
      agentType: "brain",
      description: `Brain agent outperformed baseline: ΔU = ${usefulBehaviorScore.delta.toFixed(3)} (threshold 0.08)`,
      delta: usefulBehaviorScore.delta,
      timestamp: Date.now(),
    });
  }
  if (emergenceScore.isEmergentCandidate) {
    events.push({
      type: "emergent_candidate",
      runId: 0,
      agentType: "brain",
      description: `Novel coherent behavior pattern detected: novelty=${emergenceScore.novelty.toFixed(2)}, coherence=${emergenceScore.coherence.toFixed(2)}`,
      delta: emergenceScore.total,
      timestamp: Date.now(),
    });
  }
  if (efficiencyScore.isEfficiencyPositive) {
    events.push({
      type: "efficiency_positive",
      runId: 0,
      agentType: "brain",
      description: `Efficiency gain: ΔEff = ${efficiencyScore.delta.toFixed(3)}, performance retained at ${(efficiencyScore.performanceRetained * 100).toFixed(0)}%`,
      delta: efficiencyScore.delta,
      timestamp: Date.now(),
    });
  }
  if (brainState.activeRegionFraction > 0.85) {
    events.push({
      type: "artifact_warning",
      runId: 0,
      agentType: "brain",
      description: `High active-region fraction (${(brainState.activeRegionFraction * 100).toFixed(0)}%) — saturation risk`,
      delta: 0,
      timestamp: Date.now(),
    });
  }

  const milestonePassed =
    usefulBehaviorScore.isUsefulBehaviorEvent &&
    usefulBehaviorScore.delta > 0.1 &&
    brainMetrics.taskSuccess > baselineMetrics.taskSuccess &&
    brainRuns.filter((r) => r.policyShiftDetected).length >= numRuns * 0.4 &&
    !emergenceScore.artifactWarning &&
    numRuns >= 10;

  const policyShiftCount = brainRuns.filter(
    (r) => r.policyShiftDetected,
  ).length;
  const milestoneReason = milestonePassed
    ? `PASS: Brain agent demonstrates measurable, repeatable behavioral advantage over baseline (ΔU=${usefulBehaviorScore.delta.toFixed(3)}, ${numRuns} runs, policy shift in ${policyShiftCount}/${numRuns} runs)`
    : [
        !usefulBehaviorScore.isUsefulBehaviorEvent
          ? "ΔU below threshold (need >0.08). "
          : "",
        numRuns < 10 ? "Run at least 10 trials. " : "",
        emergenceScore.artifactWarning ? "Saturation artifact detected. " : "",
        brainMetrics.taskSuccess <= baselineMetrics.taskSuccess
          ? "Brain task success must exceed baseline. "
          : "",
      ]
        .filter(Boolean)
        .join("") || "Conditions not fully met.";

  // Compute Regulation Score (4th scoring dimension)
  // Reg_s = 0.3*Stab + 0.3*Rec + 0.2*Bal + 0.2*Flex
  // Derives proxy values from brain run metrics
  let regulationState: RegulationScoreState = initRegulationScoreState();
  for (let i = 0; i < brainRuns.length; i++) {
    const run = brainRuns[i];
    // Proxy body-state inputs from run behavioral metrics
    const stressProxy = run.enteredThreat
      ? 0.8
      : run.hesitationCount > 5
        ? 0.5
        : 0.2;
    const recoveryProxy = run.recoveryScore;
    const balanceProxy = Math.max(0, Math.min(1, 1 - run.activeRegionFraction));
    const hrvProxy = Math.max(0, Math.min(1, run.routeEfficiency));
    regulationState = updateRegulationScore(regulationState, {
      stressSignal: stressProxy,
      recoverySignal: recoveryProxy,
      autonomicBalanceIndex: balanceProxy * 0.3,
      hrvProxy,
      selfStatePressure: stressProxy,
      selfStateStability: run.recoveryScore,
      behaviorAdaptedToState: run.adaptationScore > 0.4,
      currentTick: i * 10,
    });
  }
  const regulationScore = regulationState.compositeRegulationScore;

  return {
    config,
    timestamp: Date.now(),
    coreBrainVersion: "0.9",
    runs: [...brainRuns, ...baselineRuns],
    brainRuns,
    baselineRuns,
    usefulBehaviorScore,
    emergenceScore,
    efficiencyScore,
    events,
    milestonePassed,
    milestoneReason,
    regulationScore,
  };
}
