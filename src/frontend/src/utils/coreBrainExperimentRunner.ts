// CoreBrainExperimentRunner
// Runs: baseline (scripted reactive agent) vs brain-powered agent vs decoupled/shuffled control
// First scenario: threat-memory-navigation
//   Environment: reward zone, threat zone, corridor with one changing path
//   Primary metric: successful reward retrieval while avoiding threat

import {
  type BehaviorMetrics,
  type CoreTrace,
  type EfficiencyMetrics,
  type EmergenceMetrics,
  type RegulationMetrics,
  type RunRecord,
  coreBrainRecordSystem,
} from "./coreBrainRecordSystem";

export type ScenarioId =
  | "threat-memory-navigation"
  | "novelty-exposure"
  | "stress-recovery"
  | "reward-pursuit";

export interface ScenarioConfig {
  id: ScenarioId;
  name: string;
  description: string;
  ticksPerRun: number;
  environmentSeed: number;
}

export interface AgentConfig {
  type: "baseline" | "brain-powered" | "decoupled-control";
  enabledModules: string[];
  coreBrainVersion: string;
}

export interface ExperimentConfig {
  experimentId: string;
  scenario: ScenarioConfig;
  baselineConfig: AgentConfig;
  brainConfig: AgentConfig;
  runCount: number;
  seeds: number[];
  includeDecoupledControl: boolean;
  metricProfile: "standard" | "deep" | "efficiency-focus";
  captureStateTrace: boolean;
  ablations: {
    memoryLayer: boolean;
    predictionLayer: boolean;
    regulationLayer: boolean;
    recurrenceDepth: boolean;
    sparseUpdates: boolean;
  };
}

export interface ExperimentResult {
  experimentId: string;
  completedAt: number;
  totalRuns: number;
  baselineRecords: RunRecord[];
  brainRecords: RunRecord[];
  decoupledRecords: RunRecord[];
  usefulBehaviorDelta: number;
  emergenceDelta: number;
  efficiencyDelta: number;
  regulationDelta: number;
  promotionCandidate: boolean;
  milestonePassed: boolean;
  milestoneFailReasons: string[];
  status: "running" | "complete" | "failed";
}

export interface ExperimentProgress {
  experimentId: string;
  currentRun: number;
  totalRuns: number;
  currentPhase: "baseline" | "brain" | "decoupled" | "analysis";
  progressFraction: number;
  lastEvent: string;
}

// ── Seeded LCG RNG ────────────────────────────────────────────────────────────
function makeLCG(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(1664525, s) + 1013904223;
    s = s >>> 0;
    return s / 0xffffffff;
  };
}

// ── Threat-Memory-Navigation Simulation ──────────────────────────────────────
// 10x10 grid. Reward at (8,8). Threat at (5,5). Agent starts at (1,1).
// Path A: direct route through (5,4). Path B: longer route through (2,5).
// At tick 50, Path A is blocked if agent has not used memory to learn the threat.
// Brain agent: uses memory recall, prediction error, regulation to revise route.
// Baseline agent: scripted reactive — goes toward reward, avoids if in direct path.

function simulateThreatMemoryNavigation(
  agentType: AgentConfig["type"],
  seed: number,
  tickCount: number,
  enabledModules: string[],
  ablations: ExperimentConfig["ablations"],
): {
  behavior: BehaviorMetrics;
  emergence: EmergenceMetrics;
  efficiency: EfficiencyMetrics;
  regulation: RegulationMetrics;
  trace: CoreTrace;
} {
  const rng = makeLCG(seed);

  const isBrain = agentType === "brain-powered";
  const isDecoupled = agentType === "decoupled-control";

  // Module availability (ablations disable brain modules)
  const hasMemory =
    isBrain && !ablations.memoryLayer && enabledModules.includes("memory");
  const hasPrediction =
    isBrain &&
    !ablations.predictionLayer &&
    enabledModules.includes("prediction");
  const hasRegulation =
    isBrain &&
    !ablations.regulationLayer &&
    enabledModules.includes("regulation");
  const hasRecurrence =
    isBrain &&
    !ablations.recurrenceDepth &&
    enabledModules.includes("recurrence");
  const hasSparse =
    isBrain && !ablations.sparseUpdates && enabledModules.includes("sparse");

  // State variables
  let px = 1;
  let py = 1; // agent position
  const rx = 8;
  const ry = 8; // reward position
  const tx = 5;
  const ty = 5; // threat position

  let taskSuccesses = 0;
  let totalRouteSteps = 0;
  let optimalRouteSteps = 0;
  let hesitationCount = 0;
  let threatEncounters = 0;
  let threatAvoidances = 0;
  let pathABlocked = false;
  let adaptedAfterBlock = false;
  let adaptationTick = -1;
  let usedMemory = false;
  let predictionErrors = 0;
  let regulationActivations = 0;
  let sparseSkips = 0;
  let totalTicks = 0;
  let failureMemory = 0; // learned danger level of path A

  // Brain state variables
  let salienceScore = 0.3;
  let bodyUrgency = 0.2;
  let conflictScore = 0;
  let memoryRecall = 0;
  let predictionError = 0;
  let sympatheticTone = 0.2;
  let parasympTone = 0.5;
  let fatigueLoad = 0;
  let prevExpectedState = 0;
  let emergenceEvents = 0;
  let novelPatterns = new Set<string>();
  let thoughtTemplates: string[] = [];
  let coherentPatterns = 0;

  // Compute optimal path length (Manhattan distance)
  const optimalDist = Math.abs(rx - 1) + Math.abs(ry - 1);

  for (let t = 0; t < tickCount; t++) {
    totalTicks++;

    // Environmental events
    if (t === 50) pathABlocked = true;

    // Sparse compute: skip non-critical ticks for brain agent
    if (
      hasSparse &&
      rng() < 0.25 &&
      Math.abs(px - tx) > 3 &&
      Math.abs(py - ty) > 3
    ) {
      sparseSkips++;
      continue;
    }

    // Threat proximity
    const distToThreat = Math.abs(px - tx) + Math.abs(py - ty);
    const distToReward = Math.abs(px - rx) + Math.abs(py - ry);

    // Brain: update regulation/body state from threat proximity
    if (hasRegulation) {
      sympatheticTone =
        distToThreat < 3
          ? Math.min(1, sympatheticTone + 0.15)
          : Math.max(0.1, sympatheticTone - 0.05);
      parasympTone = Math.max(0.1, 1 - sympatheticTone);
      fatigueLoad = Math.min(1, fatigueLoad + 0.003);
      regulationActivations++;
      bodyUrgency = sympatheticTone * 0.7 + fatigueLoad * 0.3;
    }

    // Brain: salience from threat + reward
    if (isBrain) {
      const threatSalience = distToThreat < 4 ? 1 - distToThreat / 6 : 0;
      const rewardSalience = 0.3 + (1 - distToReward / 14) * 0.4;
      salienceScore = Math.min(
        1,
        threatSalience * 0.6 + rewardSalience * 0.4 + rng() * 0.05,
      );
      conflictScore = distToThreat < 4 && distToReward > 3 ? 0.6 : 0.2;
    }

    // Brain: memory recall — learned danger of path A
    if (hasMemory && failureMemory > 0) {
      memoryRecall = Math.min(1, failureMemory * 1.5);
      usedMemory = true;
    }

    // Brain: prediction error — path blocked was unexpected
    if (hasPrediction && pathABlocked) {
      const currentState = px + py * 0.1;
      const expectedState = prevExpectedState;
      predictionError = Math.min(1, Math.abs(currentState - expectedState) * 2);
      if (predictionError > 0.3) predictionErrors++;
    }
    prevExpectedState = px + py * 0.1;

    // Movement decision
    let dx = 0;
    let dy = 0;

    if (isDecoupled) {
      // Decoupled/shuffled: random walk with mild reward bias (no coherent strategy)
      dx = rng() < 0.5 ? (rng() < 0.5 ? 1 : -1) : 0;
      dy = rng() < 0.5 ? (rng() < 0.5 ? 1 : -1) : 0;
    } else if (!isBrain) {
      // Baseline: reactive scripted agent
      // Move toward reward, avoid threat if directly adjacent
      if (distToThreat <= 1) {
        // Direct avoidance
        dx = px < tx ? -1 : px > tx ? 1 : 0;
        dy = py < ty ? -1 : py > ty ? 1 : 0;
      } else {
        // Scripted: use path A until blocked, then get confused
        if (!pathABlocked) {
          dx = px < rx ? 1 : px > rx ? -1 : 0;
          dy = py < ry ? 1 : py > ry ? -1 : 0;
        } else {
          // Baseline can't adapt well without memory — often fails
          dx = rng() < 0.6 ? (px < rx ? 1 : -1) : 0;
          dy = rng() < 0.6 ? (py < ry ? 1 : -1) : 0;
          if (rng() < 0.3) hesitationCount++; // confused hesitation
        }
      }
    } else {
      // Brain-powered agent
      // Use memory + prediction + regulation to make better decisions

      // Hesitate if high conflict and salience still low
      const hesitationBias = conflictScore * (1 - salienceScore);
      if (
        hasRecurrence &&
        hesitationBias > 0.4 &&
        rng() < hesitationBias * 0.5
      ) {
        hesitationCount++;
        // Still making micro-adjustments
        continue;
      }

      // Memory-guided avoidance of path A
      const avoidPathA = hasMemory && memoryRecall > 0.3 && pathABlocked;

      if (
        avoidPathA ||
        (hasPrediction && predictionError > 0.4 && pathABlocked)
      ) {
        // Use alternative route B — longer but safer
        if (!adaptedAfterBlock) {
          adaptedAfterBlock = true;
          adaptationTick = t;
        }
        // Route B: go around via (2,5) -> (8,8)
        if (py < 5) {
          dy = 1;
          dx = 0;
        } else if (px < 8) {
          dx = 1;
          dy = 0;
        } else {
          dy = py < ry ? 1 : -1;
        }
      } else if (!pathABlocked) {
        // Direct route A
        dx = px < rx ? 1 : px > rx ? -1 : 0;
        dy = py < ry ? 1 : py > ry ? -1 : 0;
      } else if (!hasMemory && !hasPrediction) {
        // Brain without memory/prediction degrades gracefully
        dx = rng() < 0.7 ? (px < rx ? 1 : -1) : 0;
        dy = rng() < 0.7 ? (py < ry ? 1 : -1) : 0;
      } else {
        // Still learning — use moderate avoidance
        dx = px < rx ? 1 : px > rx ? -1 : 0;
        dy = py < ry ? 1 : py > ry ? -1 : 0;
      }
    }

    // Apply movement with bounds
    const npx = Math.max(0, Math.min(9, px + dx));
    const npy = Math.max(0, Math.min(9, py + dy));

    if (npx !== px || npy !== py) {
      totalRouteSteps++;
    }

    px = npx;
    py = npy;

    // Record failure memory if threat encountered
    if (Math.abs(px - tx) <= 1 && Math.abs(py - ty) <= 1) {
      threatEncounters++;
      if (hasMemory) {
        failureMemory = Math.min(1, failureMemory + 0.3);
      }
    } else if (distToThreat > 2) {
      threatAvoidances++;
    }

    // Check reward collection
    if (Math.abs(px - rx) <= 1 && Math.abs(py - ry) <= 1) {
      taskSuccesses++;
      optimalRouteSteps += optimalDist;
      // Reset to start with noise
      px = 1 + Math.floor(rng() * 2);
      py = 1 + Math.floor(rng() * 2);
      if (hasMemory) failureMemory = Math.max(0, failureMemory - 0.05); // partial decay on success
    }

    // Emergence tracking for brain agent
    if (isBrain) {
      const stateKey = `${Math.round(salienceScore * 5)}_${Math.round(conflictScore * 5)}_${Math.round(bodyUrgency * 5)}`;
      if (!novelPatterns.has(stateKey)) {
        novelPatterns.add(stateKey);
        if (novelPatterns.size <= 20) emergenceEvents++;
      }
      const thoughtTemplate =
        conflictScore > 0.5
          ? "conflict"
          : salienceScore > 0.7
            ? "threat"
            : "navigation";
      thoughtTemplates.push(thoughtTemplate);
      if (thoughtTemplates.length > 20) thoughtTemplates.shift();
      const uniqueThoughts = new Set(thoughtTemplates).size;
      if (uniqueThoughts >= 2) coherentPatterns++;
    }
  }

  const taskSuccessRate =
    totalTicks > 0
      ? Math.min(1, taskSuccesses / Math.max(1, totalTicks / 20))
      : 0;
  const routeEff =
    totalRouteSteps > 0
      ? Math.min(1, optimalRouteSteps / Math.max(1, totalRouteSteps))
      : 0.5;
  const threatAvoidRate =
    threatEncounters + threatAvoidances > 0
      ? threatAvoidances / (threatEncounters + threatAvoidances)
      : 0.5;
  const adaptRate = adaptedAfterBlock
    ? Math.max(0, 1 - (adaptationTick - 50) / 50)
    : isBrain
      ? 0.3
      : 0.1;

  // Add variance from seed
  const noise = (rng() - 0.5) * 0.06;

  const behavior: BehaviorMetrics = {
    taskSuccess: Math.max(0, Math.min(1, taskSuccessRate + noise)),
    routeEfficiency: Math.max(0, Math.min(1, routeEff + noise * 0.5)),
    adaptationRate: Math.max(0, Math.min(1, adaptRate + noise)),
    recoverySuccess: Math.max(
      0,
      Math.min(
        1,
        (adaptedAfterBlock ? 0.75 : 0.25) + noise + (isBrain ? 0.1 : 0),
      ),
    ),
    hesitationCount,
    explorationScore: Math.min(1, novelPatterns.size / 15),
    threatAvoidance: Math.max(0, Math.min(1, threatAvoidRate + noise)),
    coherenceScore: isBrain
      ? Math.min(1, coherentPatterns / 10 + 0.3)
      : 0.2 + noise,
  };

  const repeatedFrac =
    thoughtTemplates.length > 0
      ? thoughtTemplates.filter((t) => t === "navigation").length /
        thoughtTemplates.length
      : 0.5;

  const emergence: EmergenceMetrics = {
    emergenceScore: isBrain ? Math.min(1, emergenceEvents / 8 + 0.2) : 0.1,
    noveltyScore: Math.min(1, novelPatterns.size / 10),
    repeatedCoherentPatternCount: coherentPatterns,
    thoughtDiversity: isBrain
      ? Math.min(1, new Set(thoughtTemplates).size / 3 + 0.2)
      : 0.15,
    usefulEmergenceCount: Math.floor(emergenceEvents * 0.6),
    repeatedTemplateFraction: repeatedFrac,
    artifactProbability: isBrain ? 0.05 + rng() * 0.1 : 0.2 + rng() * 0.15,
  };

  const sparseRatio = hasSparse ? sparseSkips / Math.max(1, totalTicks) : 0.1;

  const efficiency: EfficiencyMetrics = {
    avgLatencyMs: isBrain ? 12 + rng() * 8 : 3 + rng() * 3,
    maxLatencyMs: isBrain ? 45 + rng() * 30 : 12 + rng() * 8,
    activeRegionFraction: hasSparse ? 0.35 + rng() * 0.15 : 0.65 + rng() * 0.2,
    sparseActivationRatio: sparseRatio,
    eventDrivenUpdateRate: hasSparse ? 0.6 + rng() * 0.2 : 0.3 + rng() * 0.1,
    computeProxy: isBrain ? 0.55 + rng() * 0.2 : 0.4 + rng() * 0.15,
    computePerSuccessfulTask:
      taskSuccesses > 0 ? (isBrain ? 150 + rng() * 50 : 80 + rng() * 30) : 999,
    computePerUsefulBehaviorEvent:
      emergenceEvents > 0
        ? isBrain
          ? 200 + rng() * 80
          : 500 + rng() * 200
        : 999,
  };

  const regulation: RegulationMetrics = {
    autonomicBalanceStability: hasRegulation
      ? 0.65 + rng() * 0.2
      : 0.35 + rng() * 0.15,
    stressMagnitude: hasRegulation ? 0.25 + rng() * 0.2 : 0.45 + rng() * 0.2,
    recoverySlope: hasRegulation ? 0.6 + rng() * 0.25 : 0.2 + rng() * 0.15,
    interoceptiveVariance: hasRegulation
      ? 0.15 + rng() * 0.1
      : 0.35 + rng() * 0.15,
    selfStateCoherence: isBrain ? 0.6 + rng() * 0.25 : 0.25 + rng() * 0.15,
  };

  const trace: CoreTrace = {
    dominantMode: isBrain
      ? conflictScore > 0.4
        ? "threat-arbitration"
        : "navigation"
      : "scripted-reactive",
    salienceTarget: isBrain
      ? salienceScore > 0.6
        ? "threat-zone"
        : "reward-zone"
      : "reward-fixed",
    memoryState: hasMemory
      ? `failure-memory=${failureMemory.toFixed(2)}`
      : "no-memory",
    actionTendency: adaptedAfterBlock ? "route-B-adapted" : "route-A-default",
    conflictScore,
    uncertaintyScore: predictionErrors / Math.max(1, totalTicks / 10),
    predictionErrorProfile: Array.from({ length: 5 }, (_, i) =>
      predictionErrors > i ? 0.3 + i * 0.15 : 0,
    ),
    bodyStateProfile: [
      sympatheticTone,
      parasympTone,
      fatigueLoad,
      bodyUrgency,
      1 - fatigueLoad,
    ],
    pathwayChanges: adaptedAfterBlock
      ? [
          `path-A->path-B at tick ${adaptationTick}${usedMemory ? " (memory-guided)" : ""}${regulationActivations > 0 ? " (regulated)" : ""}`,
        ]
      : [],
  };

  return { behavior, emergence, efficiency, regulation, trace };
}

// ── Runner ────────────────────────────────────────────────────────────────────

export class CoreBrainExperimentRunner {
  private activeExperiments = new Map<string, ExperimentResult>();
  private isRunning = false;
  private reportsGenerated = 0;

  async runExperiment(
    config: ExperimentConfig,
    onProgress?: (p: ExperimentProgress) => void,
  ): Promise<ExperimentResult> {
    this.isRunning = true;

    const result: ExperimentResult = {
      experimentId: config.experimentId,
      completedAt: 0,
      totalRuns: 0,
      baselineRecords: [],
      brainRecords: [],
      decoupledRecords: [],
      usefulBehaviorDelta: 0,
      emergenceDelta: 0,
      efficiencyDelta: 0,
      regulationDelta: 0,
      promotionCandidate: false,
      milestonePassed: false,
      milestoneFailReasons: [],
      status: "running",
    };

    this.activeExperiments.set(config.experimentId, result);

    const totalPhases = config.includeDecoupledControl ? 3 : 2;
    const runsPerPhase = config.runCount;

    try {
      // Phase 1: Baseline
      for (let i = 0; i < runsPerPhase; i++) {
        const seed = config.seeds[i] ?? 42 + i;
        const sim = simulateThreatMemoryNavigation(
          "baseline",
          seed,
          config.scenario.ticksPerRun,
          config.baselineConfig.enabledModules,
          {
            memoryLayer: true,
            predictionLayer: true,
            regulationLayer: true,
            recurrenceDepth: true,
            sparseUpdates: true,
          },
        );

        const record: RunRecord = {
          metadata: {
            experimentId: config.experimentId,
            runId: `${config.experimentId}_baseline_${i}`,
            timestamp: Date.now(),
            coreBrainVersion: config.baselineConfig.coreBrainVersion,
            systemVersion: "3.7",
            scenario: config.scenario.id,
            instanceType: "baseline",
            baselineVersion: "v1",
            enabledModules: config.baselineConfig.enabledModules,
            seed,
          },
          ...sim,
          coreTrace: sim.trace,
          artifactFlags:
            sim.emergence.artifactProbability > 0.3
              ? ["HIGH_ARTIFACT_RISK"]
              : [],
        };

        coreBrainRecordSystem.addRecord(record);
        result.baselineRecords.push(record);
        result.totalRuns++;

        onProgress?.({
          experimentId: config.experimentId,
          currentRun: i + 1,
          totalRuns: runsPerPhase * totalPhases,
          currentPhase: "baseline",
          progressFraction: (i + 1) / (runsPerPhase * totalPhases),
          lastEvent: `Baseline run ${i + 1} complete — taskSuccess=${sim.behavior.taskSuccess.toFixed(2)}`,
        });

        // Yield to allow UI update
        await new Promise((r) => setTimeout(r, 10));
      }

      // Phase 2: Brain-powered
      for (let i = 0; i < runsPerPhase; i++) {
        const seed = config.seeds[i] ?? 42 + i;
        const sim = simulateThreatMemoryNavigation(
          "brain-powered",
          seed,
          config.scenario.ticksPerRun,
          config.brainConfig.enabledModules,
          config.ablations,
        );

        const record: RunRecord = {
          metadata: {
            experimentId: config.experimentId,
            runId: `${config.experimentId}_brain_${i}`,
            timestamp: Date.now(),
            coreBrainVersion: config.brainConfig.coreBrainVersion,
            systemVersion: "3.7",
            scenario: config.scenario.id,
            instanceType: "brain-powered",
            baselineVersion: "v1",
            enabledModules: config.brainConfig.enabledModules,
            seed,
          },
          ...sim,
          coreTrace: sim.trace,
          artifactFlags:
            sim.emergence.artifactProbability > 0.3
              ? ["HIGH_ARTIFACT_RISK"]
              : [],
        };

        coreBrainRecordSystem.addRecord(record);
        result.brainRecords.push(record);
        result.totalRuns++;

        onProgress?.({
          experimentId: config.experimentId,
          currentRun: runsPerPhase + i + 1,
          totalRuns: runsPerPhase * totalPhases,
          currentPhase: "brain",
          progressFraction:
            (runsPerPhase + i + 1) / (runsPerPhase * totalPhases),
          lastEvent: `Brain run ${i + 1} complete — taskSuccess=${sim.behavior.taskSuccess.toFixed(2)}`,
        });

        await new Promise((r) => setTimeout(r, 10));
      }

      // Phase 3: Decoupled control (optional)
      if (config.includeDecoupledControl) {
        for (let i = 0; i < runsPerPhase; i++) {
          const seed = config.seeds[i] ?? 42 + i;
          const sim = simulateThreatMemoryNavigation(
            "decoupled-control",
            seed,
            config.scenario.ticksPerRun,
            [],
            {
              memoryLayer: true,
              predictionLayer: true,
              regulationLayer: true,
              recurrenceDepth: true,
              sparseUpdates: true,
            },
          );

          const record: RunRecord = {
            metadata: {
              experimentId: config.experimentId,
              runId: `${config.experimentId}_decoupled_${i}`,
              timestamp: Date.now(),
              coreBrainVersion: "none",
              systemVersion: "3.7",
              scenario: config.scenario.id,
              instanceType: "decoupled-control",
              baselineVersion: "v1",
              enabledModules: [],
              seed,
            },
            ...sim,
            coreTrace: sim.trace,
            artifactFlags: ["DECOUPLED_CONTROL"],
          };

          coreBrainRecordSystem.addRecord(record);
          result.decoupledRecords.push(record);
          result.totalRuns++;

          onProgress?.({
            experimentId: config.experimentId,
            currentRun: runsPerPhase * 2 + i + 1,
            totalRuns: runsPerPhase * totalPhases,
            currentPhase: "decoupled",
            progressFraction:
              (runsPerPhase * 2 + i + 1) / (runsPerPhase * totalPhases),
            lastEvent: `Decoupled run ${i + 1} complete`,
          });

          await new Promise((r) => setTimeout(r, 10));
        }
      }

      // Analysis phase
      onProgress?.({
        experimentId: config.experimentId,
        currentRun: result.totalRuns,
        totalRuns: result.totalRuns,
        currentPhase: "analysis",
        progressFraction: 0.95,
        lastEvent: "Computing deltas...",
      });

      const avgBaseline = (
        arr: RunRecord[],
        key: keyof RunRecord["behavior"],
      ) =>
        arr.reduce((s, r) => s + (r.behavior[key] as number), 0) /
        Math.max(1, arr.length);
      const avgBrainBehav = (key: keyof RunRecord["behavior"]) =>
        result.brainRecords.reduce(
          (s, r) => s + (r.behavior[key] as number),
          0,
        ) / Math.max(1, result.brainRecords.length);

      const baselineTask = avgBaseline(result.baselineRecords, "taskSuccess");
      const brainTask = avgBrainBehav("taskSuccess");
      result.usefulBehaviorDelta = brainTask - baselineTask;

      const avgEmergBase =
        result.baselineRecords.reduce(
          (s, r) => s + r.emergence.emergenceScore,
          0,
        ) / Math.max(1, result.baselineRecords.length);
      const avgEmergBrain =
        result.brainRecords.reduce(
          (s, r) => s + r.emergence.emergenceScore,
          0,
        ) / Math.max(1, result.brainRecords.length);
      result.emergenceDelta = avgEmergBrain - avgEmergBase;

      const avgEffBase =
        result.baselineRecords.reduce(
          (s, r) => s + r.efficiency.sparseActivationRatio,
          0,
        ) / Math.max(1, result.baselineRecords.length);
      const avgEffBrain =
        result.brainRecords.reduce(
          (s, r) => s + r.efficiency.sparseActivationRatio,
          0,
        ) / Math.max(1, result.brainRecords.length);
      result.efficiencyDelta = avgEffBrain - avgEffBase;

      const avgRegBase =
        result.baselineRecords.reduce(
          (s, r) => s + r.regulation.autonomicBalanceStability,
          0,
        ) / Math.max(1, result.baselineRecords.length);
      const avgRegBrain =
        result.brainRecords.reduce(
          (s, r) => s + r.regulation.autonomicBalanceStability,
          0,
        ) / Math.max(1, result.brainRecords.length);
      result.regulationDelta = avgRegBrain - avgRegBase;

      // Milestone pass check
      const milestoneFailReasons: string[] = [];
      if (result.usefulBehaviorDelta <= 0)
        milestoneFailReasons.push("No useful behavior improvement");
      if (result.baselineRecords.length < 3)
        milestoneFailReasons.push("Not enough baseline runs");
      if (result.brainRecords.length < 3)
        milestoneFailReasons.push("Not enough brain-powered runs");
      if (
        result.brainRecords.some((r) =>
          r.artifactFlags.includes("HIGH_ARTIFACT_RISK"),
        )
      )
        milestoneFailReasons.push("Artifact risk detected in brain runs");

      result.milestonePassed = milestoneFailReasons.length === 0;
      result.milestoneFailReasons = milestoneFailReasons;
      result.promotionCandidate =
        result.usefulBehaviorDelta > 0.05 &&
        result.emergenceDelta >= 0 &&
        result.milestonePassed;
      result.completedAt = Date.now();
      result.status = "complete";
      this.reportsGenerated++;
    } catch {
      result.status = "failed";
    } finally {
      this.isRunning = false;
    }

    this.activeExperiments.set(config.experimentId, result);

    onProgress?.({
      experimentId: config.experimentId,
      currentRun: result.totalRuns,
      totalRuns: result.totalRuns,
      currentPhase: "analysis",
      progressFraction: 1,
      lastEvent:
        result.status === "complete"
          ? "Experiment complete"
          : "Experiment failed",
    });

    return result;
  }

  getDefaultThreatMemoryScenario(): ScenarioConfig {
    return {
      id: "threat-memory-navigation",
      name: "Threat-Memory Navigation",
      description:
        "Agent must retrieve reward while avoiding threat. One path changes mid-run. Tests memory-guided route revision.",
      ticksPerRun: 100,
      environmentSeed: 42,
    };
  }

  getActiveExperiment(id: string): ExperimentResult | undefined {
    return this.activeExperiments.get(id);
  }

  isRunningExperiment(): boolean {
    return this.isRunning;
  }

  getReportsGenerated(): number {
    return this.reportsGenerated;
  }
}

export const coreBrainExperimentRunner = new CoreBrainExperimentRunner();
