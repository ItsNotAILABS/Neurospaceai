// Multi-Timescale Memory System
// Three-layer memory: working (10 ticks), episodic trace (50-tick compressed), long-term bias
// Wired into the neural simulation tick — regions with sustained high activation develop
// a learned bias that slightly boosts their activation on recall.
//
// Sources: Baddeley (1992) working memory; Tulving (2002) episodic memory;
//          Bhattacharya et al. (2022) multi-timescale plasticity.

import type { GoalHierarchyState } from "./goalHierarchy";
import type { PredictionState } from "./predictionExpectationLayer";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface WorkingBufferEntry {
  tick: number;
  activationSnapshot: Record<string, number>;
  salienceScore: number; // top-k mean activation of high-salience regions
  goalLabel: string;
}

export interface EpisodicTraceEntry {
  tickRange: [number, number];
  dominantMode: string; // dominant goal label at time of compression
  avgActivation: number; // mean activation across all regions
  goalLabel: string;
  noveltyScore: number;
  topRegions: Array<{ region: string; avgAct: number }>; // top-3 most active
}

export interface MultiTimescaleMemory {
  // Layer 1: Working memory buffer — last 10 tick snapshots, high fidelity
  workingBuffer: WorkingBufferEntry[];
  workingCapacity: 10;

  // Layer 2: Short-term episodic trace — compressed every 50 ticks, up to 20 entries
  episodicTrace: EpisodicTraceEntry[];
  episodicCapacity: 20;

  // Layer 3: Long-term learned bias — very slow accumulation and decay
  // regionId -> bias weight (0–0.4 range); decays 0.00005/tick
  learnedBias: Record<string, number>;

  // Memory boost: hippocampus-gated activation reinstatement
  memoryBoostActive: boolean;
  memoryBoostMap: Record<string, number>; // regionId -> additive boost (0-0.15)
  lastReinstatedTick: number;

  // Internal bookkeeping
  sustainedHighTicks: Record<string, number>; // how many consecutive ticks above 0.6
  lastEpisodicCompressTick: number;
}

// ── Init ──────────────────────────────────────────────────────────────────────

export function initMultiTimescaleMemory(): MultiTimescaleMemory {
  return {
    workingBuffer: [],
    workingCapacity: 10,
    episodicTrace: [],
    episodicCapacity: 20,
    learnedBias: {},
    memoryBoostActive: false,
    memoryBoostMap: {},
    lastReinstatedTick: 0,
    sustainedHighTicks: {},
    lastEpisodicCompressTick: 0,
  };
}

// ── Update ────────────────────────────────────────────────────────────────────

export function updateMultiTimescaleMemory(
  prev: MultiTimescaleMemory,
  tick: number,
  regionActivations: Record<string, number>,
  goalHierarchy: GoalHierarchyState,
  predictionState: PredictionState,
  hippocampusActivation: number,
): MultiTimescaleMemory {
  const next: MultiTimescaleMemory = {
    ...prev,
    workingBuffer: [...prev.workingBuffer],
    episodicTrace: [...prev.episodicTrace],
    learnedBias: { ...prev.learnedBias },
    memoryBoostMap: {},
    sustainedHighTicks: { ...prev.sustainedHighTicks },
  };

  // ── Layer 1: Working buffer ────────────────────────────────────────────────
  // Compute salience score: mean of top-10% most active regions
  const activations = Object.values(regionActivations);
  activations.sort((a, b) => b - a);
  const topSlice = activations.slice(
    0,
    Math.max(1, Math.floor(activations.length * 0.1)),
  );
  const salienceScore = topSlice.reduce((s, v) => s + v, 0) / topSlice.length;

  next.workingBuffer.push({
    tick,
    activationSnapshot: { ...regionActivations },
    salienceScore,
    goalLabel: goalHierarchy.dominantGoal,
  });

  // Evict oldest beyond capacity 10
  if (next.workingBuffer.length > 10) {
    next.workingBuffer = next.workingBuffer.slice(-10);
  }

  // ── Layer 2: Episodic compression (every 50 ticks) ────────────────────────
  if (
    tick - prev.lastEpisodicCompressTick >= 50 &&
    next.workingBuffer.length >= 3
  ) {
    const window = next.workingBuffer;

    // Compute per-region average activation across window
    const regionSums: Record<string, number> = {};
    for (const entry of window) {
      for (const [reg, act] of Object.entries(entry.activationSnapshot)) {
        regionSums[reg] = (regionSums[reg] ?? 0) + act;
      }
    }
    const regionAvgs: Record<string, number> = {};
    for (const [reg, sum] of Object.entries(regionSums)) {
      regionAvgs[reg] = sum / window.length;
    }

    // Overall average
    const allAvgs = Object.values(regionAvgs);
    const avgActivation =
      allAvgs.length > 0
        ? allAvgs.reduce((s, v) => s + v, 0) / allAvgs.length
        : 0;

    // Top-3 most active regions
    const sortedRegions = Object.entries(regionAvgs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([region, avgAct]) => ({ region, avgAct }));

    // Dominant goal across window
    const goalCounts: Record<string, number> = {};
    for (const entry of window) {
      goalCounts[entry.goalLabel] = (goalCounts[entry.goalLabel] ?? 0) + 1;
    }
    const dominantMode =
      Object.entries(goalCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "IDLE";

    const newEntry: EpisodicTraceEntry = {
      tickRange: [window[0].tick, window[window.length - 1].tick],
      dominantMode,
      avgActivation,
      goalLabel: goalHierarchy.dominantGoal,
      noveltyScore: predictionState.noveltyScore,
      topRegions: sortedRegions,
    };

    next.episodicTrace.unshift(newEntry);
    if (next.episodicTrace.length > 20) {
      next.episodicTrace = next.episodicTrace.slice(0, 20);
    }
    next.lastEpisodicCompressTick = tick;
  }

  // ── Layer 3: Learned bias accumulation and decay ──────────────────────────
  for (const [regionId, activation] of Object.entries(regionActivations)) {
    const sustained = prev.sustainedHighTicks[regionId] ?? 0;

    if (activation > 0.6) {
      next.sustainedHighTicks[regionId] = sustained + 1;
      if (sustained + 1 >= 20) {
        // Accumulate learned bias for sustained high activation
        const current = prev.learnedBias[regionId] ?? 0;
        next.learnedBias[regionId] = Math.min(0.4, current + 0.001);
      }
    } else {
      next.sustainedHighTicks[regionId] = Math.max(0, sustained - 1);
    }

    // Slow decay on all biases
    if (next.learnedBias[regionId] !== undefined) {
      next.learnedBias[regionId] = Math.max(
        0,
        next.learnedBias[regionId] - 0.00005,
      );
    }
  }

  // ── Memory boost: hippocampus-gated reinstatement ─────────────────────────
  next.memoryBoostActive = hippocampusActivation > 0.65;
  if (next.memoryBoostActive) {
    // Apply learnedBias * 0.15 as activation boost to relevant regions
    for (const [regionId, bias] of Object.entries(next.learnedBias)) {
      if (bias > 0.01) {
        next.memoryBoostMap[regionId] = bias * 0.15;
      }
    }
    next.lastReinstatedTick = tick;
  }

  return next;
}
