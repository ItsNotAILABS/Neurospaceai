// CoreBrain Runtime Monitor — Always-On 7-Subsystem Monitoring Stack
// Each subsystem runs every 5 ticks and feeds auto-detected events into a shared log.
// No framework feature counts as implemented until benchmark behavior changes.

import { governanceBoundary } from "./governanceBoundaryRule";
import { maturityTracker } from "./maturityTracker";
import { richerRegimeDetector } from "./richerRegimeDetector";
const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

// ─── Event Types ──────────────────────────────────────────────────────────────
export type MonitorEvent =
  // Conflict
  | "Conflict-Resolved-Well"
  | "Conflict-Stall"
  | "Conflict-Oscillation"
  | "Conflict-Misresolution"
  | "Conflict-Driven-Strategy-Switch"
  // Working Memory
  | "WM-Gate-Healthy"
  | "WM-Overload"
  | "WM-Context-Flood"
  | "WM-Stale-Retention"
  | "WM-Decisive-Fact-Miss"
  // Emergence
  | "Emergent-Candidate"
  | "Useful-Emergence"
  | "Collapse-to-Repetition"
  | "High-Novelty-Low-Coherence"
  | "Artifact-Likely"
  // Regulation
  | "Regulation-Positive"
  | "Overload-State"
  | "Recovery-Success"
  | "Recovery-Failure"
  | "Threshold-Protective-Shift"
  | "Runaway-Activation-Risk"
  // Persistence
  | "Persistence-Useful"
  | "Persistence-Overload"
  | "Good-Reactivation"
  | "Failure-Memory-Reused"
  | "Meaningless-Carryover"
  // Compute
  | "Efficiency-Positive"
  | "Efficiency-Regression"
  | "Sparse-Control-Win"
  | "Unnecessary-Broad-Update"
  | "Escalation-Needed"
  | "Escalation-Waste"
  // Topology
  | "Topology-Limiting-Competition"
  | "Memory-Interference-Bottleneck"
  | "Prediction-Action-Weak-Link"
  | "Recurrence-Too-Shallow"
  | "Regulation-Reach-Insufficient"
  | "Topology-Expansion-Justified"
  // Governance & Richer Regime
  | "RicherRegimeCandidateEvent"
  | "AuthorshipLeakageWarning";

export interface MonitorEventEntry {
  tick: number;
  subsystem: string;
  event: MonitorEvent;
  value: number;
  description: string;
}

// ─── Subsystem States ─────────────────────────────────────────────────────────

export interface ConflictMonitor {
  currentConflictSeverity: number;
  competingPoliciesCount: number;
  ticksSinceConflictStart: number;
  timeToResolution: number;
  oscillationFrequency: number;
  unresolvedCarryover: number;
  hesitationWithoutResolution: number;
  lastEvent: MonitorEvent | null;
  conflictHistory: number[];
}

export interface WorkingMemoryMonitor {
  activeSlotCount: number;
  slotOccupancyByClass: Record<string, number>;
  admittedThisTick: number;
  rejectedThisTick: number;
  staleRetentionRate: number;
  decisiveFactRetentionRate: number;
  churnRate: number;
  overloadFrequency: number;
  gatePrecision: number;
  churnHistory: number[];
  lastEvent: MonitorEvent | null;
}

export interface EmergenceMonitor {
  emergenceScore: number;
  noveltyScore: number;
  coherenceScore: number;
  diversityScore: number;
  repeatedCoherentPatterns: number;
  latentModeDiversity: number;
  thoughtDiversity: number;
  repeatedTemplateFraction: number;
  artifactProbability: number;
  usefulEmergenceCount: number;
  thoughtHistory: string[];
  lastEvent: MonitorEvent | null;
}

export interface RegulationMonitor {
  autonomicBalanceStability: number;
  stressMagnitude: number;
  recoverySlope: number;
  overloadFrequency: number;
  regulationToThresholdShifts: number;
  stabilityUnderHighConflict: number;
  degradationUnderPressure: number;
  recoverySuccessRate: number;
  stabilityHistory: number[];
  prevStability: number;
  lastEvent: MonitorEvent | null;
}

export interface PersistenceMonitor {
  unresolvedTensionCount: number;
  persistenceUsefulnessScore: number;
  activeGoalRecurrence: number;
  persistenceOverloadRisk: number;
  carryoverRelevance: number;
  reactivationQuality: number;
  failureMemoryRecallRate: number;
  persistenceHistory: number[];
  lastEvent: MonitorEvent | null;
}

export interface ComputeMonitor {
  activeRegionFraction: number;
  sparseActivationRatio: number;
  eventDrivenUpdateRate: number;
  computeProxy: number;
  computePerUsefulBehavior: number;
  heavyComputeEscalations: number;
  broadVsLocalRatio: number;
  efficiencyTrend: number;
  efficiencyHistory: number[];
  lastEvent: MonitorEvent | null;
}

export interface TopologyMonitor {
  moduleCompetitionSaturation: number;
  recurrenceDepth: number;
  memoryInterferenceRate: number;
  predictionActionCoupling: number;
  regulationReach: number;
  unusedPathwayFraction: number;
  overloadedPathwayFraction: number;
  effectiveConnectivity: number;
  expansionJustified: boolean;
  lastEvent: MonitorEvent | null;
}

export type DriftClass =
  | "Depth-Drift"
  | "Arbitration-Drift"
  | "State-Drift"
  | "Efficiency-Drift"
  | "Emergence-Drift"
  | "Regulation-Drift"
  | "None";

export interface SelfRegulationStack {
  controlStateScore: number;
  driftClass: DriftClass;
  driftSeverity: number;
  correctionEngineActive: boolean;
  adaptivePolicyUpdates: number;
  consolidationEvents: number;
  policyStrengthMap: Record<string, number>;
  lastCorrectionTick: number;
  lastEvent: string | null;
}

export interface CoreBrainMonitorState {
  conflict: ConflictMonitor;
  workingMemory: WorkingMemoryMonitor;
  emergence: EmergenceMonitor;
  regulation: RegulationMonitor;
  persistence: PersistenceMonitor;
  compute: ComputeMonitor;
  topology: TopologyMonitor;
  selfRegulation: SelfRegulationStack;
  eventLog: MonitorEventEntry[];
  overallHealthScore: number;
  tick: number;
}

// ─── Init ─────────────────────────────────────────────────────────────────────

export function initCoreMonitorState(): CoreBrainMonitorState {
  return {
    conflict: {
      currentConflictSeverity: 0,
      competingPoliciesCount: 0,
      ticksSinceConflictStart: 0,
      timeToResolution: 0,
      oscillationFrequency: 0,
      unresolvedCarryover: 0,
      hesitationWithoutResolution: 0,
      lastEvent: null,
      conflictHistory: [],
    },
    workingMemory: {
      activeSlotCount: 0,
      slotOccupancyByClass: {},
      admittedThisTick: 0,
      rejectedThisTick: 0,
      staleRetentionRate: 0,
      decisiveFactRetentionRate: 0,
      churnRate: 0,
      overloadFrequency: 0,
      gatePrecision: 0,
      churnHistory: [],
      lastEvent: null,
    },
    emergence: {
      emergenceScore: 0,
      noveltyScore: 0,
      coherenceScore: 0,
      diversityScore: 0,
      repeatedCoherentPatterns: 0,
      latentModeDiversity: 0,
      thoughtDiversity: 0,
      repeatedTemplateFraction: 0,
      artifactProbability: 0,
      usefulEmergenceCount: 0,
      thoughtHistory: [],
      lastEvent: null,
    },
    regulation: {
      autonomicBalanceStability: 0,
      stressMagnitude: 0,
      recoverySlope: 0,
      overloadFrequency: 0,
      regulationToThresholdShifts: 0,
      stabilityUnderHighConflict: 0,
      degradationUnderPressure: 0,
      recoverySuccessRate: 0,
      stabilityHistory: [],
      prevStability: 0.5,
      lastEvent: null,
    },
    persistence: {
      unresolvedTensionCount: 0,
      persistenceUsefulnessScore: 0,
      activeGoalRecurrence: 0,
      persistenceOverloadRisk: 0,
      carryoverRelevance: 0,
      reactivationQuality: 0,
      failureMemoryRecallRate: 0,
      persistenceHistory: [],
      lastEvent: null,
    },
    compute: {
      activeRegionFraction: 0,
      sparseActivationRatio: 0,
      eventDrivenUpdateRate: 0,
      computeProxy: 0,
      computePerUsefulBehavior: 0,
      heavyComputeEscalations: 0,
      broadVsLocalRatio: 0,
      efficiencyTrend: 0,
      efficiencyHistory: [],
      lastEvent: null,
    },
    topology: {
      moduleCompetitionSaturation: 0,
      recurrenceDepth: 0,
      memoryInterferenceRate: 0,
      predictionActionCoupling: 0,
      regulationReach: 0,
      unusedPathwayFraction: 0,
      overloadedPathwayFraction: 0,
      effectiveConnectivity: 0,
      expansionJustified: false,
      lastEvent: null,
    },
    selfRegulation: {
      controlStateScore: 0,
      driftClass: "None",
      driftSeverity: 0,
      correctionEngineActive: false,
      adaptivePolicyUpdates: 0,
      consolidationEvents: 0,
      policyStrengthMap: {},
      lastCorrectionTick: 0,
      lastEvent: null,
    },
    eventLog: [],
    overallHealthScore: 0,
    tick: 0,
  };
}

// ─── UpdateParams ─────────────────────────────────────────────────────────────

export interface MonitorUpdateParams {
  tick: number;
  goalConflictScore: number;
  dACCActivation: number;
  goalConflictHistory: number;
  strategyShiftCount: number;
  wmSlots: Array<{
    occupied: boolean;
    type: string | null;
    freshness: number;
    isCritical: boolean;
  }>;
  wmAdmitted: number;
  wmRejected: number;
  thoughtLog: Array<{
    circuitType: string;
    confidence: number;
    cognitiveMode?: string;
  }>;
  emergenceScore: number;
  noveltyScore: number;
  emergenceCoherence: number;
  thoughtDiversityWindow: string[];
  sympatheticTone: number;
  parasympatheticTone: number;
  selfStateStability: number;
  selfStatePressure: number;
  overloadFlag: boolean;
  persistentItems: Array<{
    tier: string;
    strength: number;
    isResolved: boolean;
    isCritical?: boolean;
  }>;
  failureMemoryStrength: number;
  failureMemoryAffectedAction: boolean;
  activeRegionFraction: number;
  sparseActivationRatio: number;
  eventDrivenUpdates: number;
  usefulBehaviorEventCount: number;
  heavyComputeEscalations: number;
  recurrentExcitationAvg: number;
  inhibitionMap: Record<string, number>;
  predictionErrorFeedback: {
    learningRateModulation: number;
    actionCommitmentThreshold: number;
  };
  regulationThresholds: {
    threatTriggerThreshold: number;
    thoughtEmissionThreshold: number;
  };
  regionActivations: number[];
  goalHierarchyGoal: string;
  prevGoal: string;
}

function rolling<T>(arr: T[], item: T, max = 20): T[] {
  return [...arr, item].slice(-max);
}

function addEvent(
  log: MonitorEventEntry[],
  entry: MonitorEventEntry,
): MonitorEventEntry[] {
  return [entry, ...log].slice(0, 100);
}

// ─── Main Update ─────────────────────────────────────────────────────────────

export function updateCoreMonitor(
  prev: CoreBrainMonitorState,
  p: MonitorUpdateParams,
): CoreBrainMonitorState {
  let eventLog = [...prev.eventLog];

  // ── 1. Conflict Monitor ──────────────────────────────────────────────────
  const severity = clamp(p.goalConflictScore * 0.6 + p.dACCActivation * 0.4);
  const conflictHistory = rolling(prev.conflict.conflictHistory, severity);

  // Oscillation: count direction flips in last 20 values
  let flips = 0;
  for (let i = 1; i < conflictHistory.length; i++) {
    const prev_v = conflictHistory[i - 1];
    const curr_v = conflictHistory[i];
    if (prev_v !== undefined && curr_v !== undefined) {
      if (
        (curr_v - prev_v) *
          ((conflictHistory[i - 1] ?? 0) - (conflictHistory[i - 2] ?? 0)) <
        0
      ) {
        flips++;
      }
    }
  }

  const ticksInConflict =
    severity > 0.4 ? prev.conflict.ticksSinceConflictStart + 5 : 0;
  const hesitation =
    severity > 0.5 ? prev.conflict.hesitationWithoutResolution + 1 : 0;

  let conflictEvent: MonitorEvent | null = null;
  if (severity < 0.2 && prev.conflict.currentConflictSeverity > 0.4) {
    conflictEvent = "Conflict-Resolved-Well";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Conflict",
      event: conflictEvent,
      value: severity,
      description: `Conflict resolved: severity dropped ${(prev.conflict.currentConflictSeverity * 100).toFixed(0)}% → ${(severity * 100).toFixed(0)}%`,
    });
  } else if (severity > 0.6 && ticksInConflict >= 10) {
    conflictEvent = "Conflict-Stall";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Conflict",
      event: conflictEvent,
      value: severity,
      description: `Conflict stall: severity ${(severity * 100).toFixed(0)}% for ${ticksInConflict} ticks`,
    });
  } else if (flips > 4) {
    conflictEvent = "Conflict-Oscillation";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Conflict",
      event: conflictEvent,
      value: flips / 20,
      description: `Conflict oscillating: ${flips} direction flips in last 20 values`,
    });
  } else if (
    p.strategyShiftCount >
    (prev.selfRegulation.policyStrengthMap.strategyShift ?? 0)
  ) {
    conflictEvent = "Conflict-Driven-Strategy-Switch";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Conflict",
      event: conflictEvent,
      value: severity,
      description: "Strategy switch triggered by unresolved conflict",
    });
  }

  const conflictMonitor: ConflictMonitor = {
    currentConflictSeverity: severity,
    competingPoliciesCount: Math.round(severity * 5),
    ticksSinceConflictStart: ticksInConflict,
    timeToResolution: severity > 0.3 ? Math.round((1 - severity) * 20) : 0,
    oscillationFrequency: flips,
    unresolvedCarryover: p.persistentItems.filter(
      (i) => !i.isResolved && i.tier === "HIGH",
    ).length,
    hesitationWithoutResolution: hesitation,
    lastEvent: conflictEvent ?? prev.conflict.lastEvent,
    conflictHistory,
  };

  // ── 2. Working Memory Monitor ────────────────────────────────────────────
  const occupiedSlots = p.wmSlots.filter((s) => s.occupied);
  const activeSlotCount = occupiedSlots.length;
  const slotOccupancyByClass: Record<string, number> = {};
  for (const s of occupiedSlots) {
    const t = s.type ?? "UNKNOWN";
    slotOccupancyByClass[t] = (slotOccupancyByClass[t] ?? 0) + 1;
  }
  const staleSlots = occupiedSlots.filter((s) => s.freshness < 0.3).length;
  const staleRetentionRate =
    activeSlotCount > 0 ? staleSlots / activeSlotCount : 0;
  const criticalSlots = occupiedSlots.filter((s) => s.isCritical).length;
  const decisiveFactRetentionRate =
    activeSlotCount > 0 ? criticalSlots / activeSlotCount : 0;
  const churnHistory = rolling(prev.workingMemory.churnHistory, p.wmAdmitted);
  const churnRate =
    churnHistory.length > 0
      ? churnHistory.reduce((s, v) => s + v, 0) / churnHistory.length
      : 0;
  const gatePrecision =
    p.wmAdmitted > 0
      ? Math.min(
          1,
          p.wmSlots.filter((s) => s.occupied && s.isCritical).length /
            p.wmAdmitted,
        )
      : 0;

  let wmEvent: MonitorEvent | null = null;
  if (
    activeSlotCount >= 4 &&
    activeSlotCount <= 7 &&
    staleRetentionRate < 0.2 &&
    decisiveFactRetentionRate > 0.6
  ) {
    wmEvent = "WM-Gate-Healthy";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "WorkingMemory",
      event: wmEvent,
      value: decisiveFactRetentionRate,
      description: `WM gate healthy: ${activeSlotCount} slots, ${(decisiveFactRetentionRate * 100).toFixed(0)}% decisive`,
    });
  } else if (activeSlotCount >= 8) {
    wmEvent = "WM-Overload";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "WorkingMemory",
      event: wmEvent,
      value: activeSlotCount / 8,
      description: `WM overload: ${activeSlotCount} slots occupied`,
    });
  } else if (staleRetentionRate > 0.4) {
    wmEvent = "WM-Stale-Retention";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "WorkingMemory",
      event: wmEvent,
      value: staleRetentionRate,
      description: `Stale retention: ${(staleRetentionRate * 100).toFixed(0)}% of slots stale`,
    });
  } else if (decisiveFactRetentionRate < 0.3 && activeSlotCount > 0) {
    wmEvent = "WM-Decisive-Fact-Miss";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "WorkingMemory",
      event: wmEvent,
      value: decisiveFactRetentionRate,
      description: `Decisive fact miss: only ${(decisiveFactRetentionRate * 100).toFixed(0)}% critical items retained`,
    });
  }

  const workingMemoryMonitor: WorkingMemoryMonitor = {
    activeSlotCount,
    slotOccupancyByClass,
    admittedThisTick: p.wmAdmitted,
    rejectedThisTick: p.wmRejected,
    staleRetentionRate,
    decisiveFactRetentionRate,
    churnRate,
    overloadFrequency:
      wmEvent === "WM-Overload"
        ? prev.workingMemory.overloadFrequency + 1
        : prev.workingMemory.overloadFrequency,
    gatePrecision,
    churnHistory,
    lastEvent: wmEvent ?? prev.workingMemory.lastEvent,
  };

  // ── 3. Emergence Monitor ─────────────────────────────────────────────────
  const recentTypes = p.thoughtDiversityWindow.slice(0, 20);
  const thoughtHistory = recentTypes;
  const uniqueTypes = new Set(recentTypes).size;
  const thoughtDiversity = recentTypes.length > 0 ? uniqueTypes / 20 : 0;

  // Most common type count
  const typeCounts: Record<string, number> = {};
  for (const t of recentTypes) {
    typeCounts[t] = (typeCounts[t] ?? 0) + 1;
  }
  const maxTypeCount = Math.max(0, ...Object.values(typeCounts));
  const repeatedTemplateFraction =
    recentTypes.length > 0 ? maxTypeCount / 20 : 0;

  // Artifact probability
  const artifactProbability =
    p.emergenceCoherence > 0.95 ||
    (p.noveltyScore < 0.1 && p.emergenceScore > 0.7)
      ? 1
      : 0;

  // Latent mode diversity
  const recentModes = p.thoughtLog
    .slice(0, 20)
    .map((t) => t.cognitiveMode ?? "")
    .filter(Boolean);
  const latentModeDiversity = new Set(recentModes).size;

  let emergenceEvent: MonitorEvent | null = null;
  if (p.emergenceScore > 0.65 && !artifactProbability) {
    emergenceEvent = "Emergent-Candidate";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Emergence",
      event: emergenceEvent,
      value: p.emergenceScore,
      description: `Emergent candidate: score ${(p.emergenceScore * 100).toFixed(0)}%, coherence ${(p.emergenceCoherence * 100).toFixed(0)}%`,
    });
  } else if (repeatedTemplateFraction > 0.6) {
    emergenceEvent = "Collapse-to-Repetition";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Emergence",
      event: emergenceEvent,
      value: repeatedTemplateFraction,
      description: `Thought collapse: ${(repeatedTemplateFraction * 100).toFixed(0)}% repeated template`,
    });
  } else if (p.noveltyScore > 0.7 && p.emergenceCoherence < 0.3) {
    emergenceEvent = "High-Novelty-Low-Coherence";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Emergence",
      event: emergenceEvent,
      value: p.noveltyScore,
      description: `High novelty (${(p.noveltyScore * 100).toFixed(0)}%) but low coherence (${(p.emergenceCoherence * 100).toFixed(0)}%)`,
    });
  } else if (artifactProbability) {
    emergenceEvent = "Artifact-Likely";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Emergence",
      event: emergenceEvent,
      value: 1,
      description: `Artifact warning: coherence=${(p.emergenceCoherence * 100).toFixed(0)}% novelty=${(p.noveltyScore * 100).toFixed(0)}%`,
    });
  }

  const emergenceMonitor: EmergenceMonitor = {
    emergenceScore: p.emergenceScore,
    noveltyScore: p.noveltyScore,
    coherenceScore: p.emergenceCoherence,
    diversityScore: thoughtDiversity,
    repeatedCoherentPatterns: prev.emergence.repeatedCoherentPatterns,
    latentModeDiversity,
    thoughtDiversity,
    repeatedTemplateFraction,
    artifactProbability,
    usefulEmergenceCount:
      emergenceEvent === "Emergent-Candidate"
        ? prev.emergence.usefulEmergenceCount + 1
        : prev.emergence.usefulEmergenceCount,
    thoughtHistory,
    lastEvent: emergenceEvent ?? prev.emergence.lastEvent,
  };

  // ── 4. Regulation Monitor ────────────────────────────────────────────────
  const autonomicBalanceStability = clamp(
    1 - Math.abs(p.sympatheticTone - p.parasympatheticTone),
  );
  const stressMagnitude = clamp(
    p.sympatheticTone * 0.6 + p.selfStatePressure * 0.4,
  );
  const stabilityHistory = rolling(
    prev.regulation.stabilityHistory,
    p.selfStateStability,
  );
  // Recovery slope: last value minus value 5 positions ago
  const len = stabilityHistory.length;
  const recoverySlope =
    len >= 6
      ? (stabilityHistory[len - 1] ?? 0) - (stabilityHistory[len - 6] ?? 0)
      : 0;

  // Overloaded pathway fraction — uses regionActivations
  const overloadedPathwayFraction =
    p.regionActivations.length > 0
      ? p.regionActivations.filter((a) => a > 0.9).length /
        p.regionActivations.length
      : 0;

  let regulationEvent: MonitorEvent | null = null;
  if (p.selfStateStability > 0.7 && stressMagnitude < 0.4) {
    regulationEvent = "Regulation-Positive";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Regulation",
      event: regulationEvent,
      value: p.selfStateStability,
      description: `Regulation positive: stability ${(p.selfStateStability * 100).toFixed(0)}%, stress ${(stressMagnitude * 100).toFixed(0)}%`,
    });
  } else if (p.selfStatePressure > 0.8) {
    regulationEvent = "Overload-State";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Regulation",
      event: regulationEvent,
      value: p.selfStatePressure,
      description: `Overload: pressure ${(p.selfStatePressure * 100).toFixed(0)}%`,
    });
  } else if (recoverySlope > 0.05 && prev.regulation.prevStability < 0.4) {
    regulationEvent = "Recovery-Success";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Regulation",
      event: regulationEvent,
      value: recoverySlope,
      description: `Recovery success: +${(recoverySlope * 100).toFixed(1)}% stability slope`,
    });
  } else if (recoverySlope < -0.05 && stressMagnitude > 0.7) {
    regulationEvent = "Recovery-Failure";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Regulation",
      event: regulationEvent,
      value: Math.abs(recoverySlope),
      description: `Recovery failure: stress ${(stressMagnitude * 100).toFixed(0)}%, declining stability`,
    });
  } else if (
    Math.abs(p.regulationThresholds.threatTriggerThreshold - 0.4) > 0.15
  ) {
    regulationEvent = "Threshold-Protective-Shift";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Regulation",
      event: regulationEvent,
      value: Math.abs(p.regulationThresholds.threatTriggerThreshold - 0.4),
      description: `Threshold shift: threat trigger at ${(p.regulationThresholds.threatTriggerThreshold * 100).toFixed(0)}%`,
    });
  } else if (overloadedPathwayFraction > 0.2) {
    regulationEvent = "Runaway-Activation-Risk";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Regulation",
      event: regulationEvent,
      value: overloadedPathwayFraction,
      description: `Runaway activation: ${(overloadedPathwayFraction * 100).toFixed(0)}% of regions saturated`,
    });
  }

  const regulationMonitor: RegulationMonitor = {
    autonomicBalanceStability,
    stressMagnitude,
    recoverySlope,
    overloadFrequency:
      regulationEvent === "Overload-State"
        ? prev.regulation.overloadFrequency + 1
        : prev.regulation.overloadFrequency,
    regulationToThresholdShifts:
      regulationEvent === "Threshold-Protective-Shift"
        ? prev.regulation.regulationToThresholdShifts + 1
        : prev.regulation.regulationToThresholdShifts,
    stabilityUnderHighConflict:
      severity > 0.5
        ? p.selfStateStability
        : prev.regulation.stabilityUnderHighConflict,
    degradationUnderPressure:
      p.selfStatePressure > 0.7
        ? Math.max(0, prev.regulation.prevStability - p.selfStateStability)
        : 0,
    recoverySuccessRate:
      regulationEvent === "Recovery-Success"
        ? Math.min(1, prev.regulation.recoverySuccessRate + 0.1)
        : regulationEvent === "Recovery-Failure"
          ? Math.max(0, prev.regulation.recoverySuccessRate - 0.05)
          : prev.regulation.recoverySuccessRate,
    stabilityHistory,
    prevStability: p.selfStateStability,
    lastEvent: regulationEvent ?? prev.regulation.lastEvent,
  };

  // ── 5. Persistence Monitor ───────────────────────────────────────────────
  const unresolved = p.persistentItems.filter((i) => !i.isResolved);
  const unresolvedTensionCount = unresolved.length;
  const persistenceOverloadRisk = clamp(unresolvedTensionCount / 12);
  const carryoverRelevance =
    unresolved.length > 0
      ? unresolved.reduce((s, i) => s + i.strength, 0) / unresolved.length
      : 0;
  const persistenceHistory = rolling(
    prev.persistence.persistenceHistory,
    unresolvedTensionCount,
  );

  const hasSpecialReactivation = p.persistentItems.some(
    (i) => i.tier === "SPECIAL" && i.strength > 0.6 && !i.isResolved,
  );

  let persistenceEvent: MonitorEvent | null = null;
  if (carryoverRelevance > 0.5 && unresolvedTensionCount <= 6) {
    persistenceEvent = "Persistence-Useful";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Persistence",
      event: persistenceEvent,
      value: carryoverRelevance,
      description: `Useful persistence: ${unresolvedTensionCount} items, avg relevance ${(carryoverRelevance * 100).toFixed(0)}%`,
    });
  } else if (unresolvedTensionCount > 10) {
    persistenceEvent = "Persistence-Overload";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Persistence",
      event: persistenceEvent,
      value: unresolvedTensionCount / 12,
      description: `Persistence overload: ${unresolvedTensionCount} unresolved items`,
    });
  } else if (p.failureMemoryAffectedAction) {
    persistenceEvent = "Failure-Memory-Reused";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Persistence",
      event: persistenceEvent,
      value: p.failureMemoryStrength,
      description: `Failure memory shaped action: weight ${(p.failureMemoryStrength * 100).toFixed(0)}%`,
    });
  } else if (hasSpecialReactivation) {
    persistenceEvent = "Good-Reactivation";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Persistence",
      event: persistenceEvent,
      value: carryoverRelevance,
      description: "SPECIAL tier item reactivated with high strength",
    });
  } else if (unresolvedTensionCount > 5 && carryoverRelevance < 0.2) {
    persistenceEvent = "Meaningless-Carryover";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Persistence",
      event: persistenceEvent,
      value: carryoverRelevance,
      description: `Low-relevance carryover: ${unresolvedTensionCount} items avg ${(carryoverRelevance * 100).toFixed(0)}%`,
    });
  }

  const persistenceMonitor: PersistenceMonitor = {
    unresolvedTensionCount,
    persistenceUsefulnessScore:
      persistenceEvent === "Persistence-Useful"
        ? carryoverRelevance
        : prev.persistence.persistenceUsefulnessScore * 0.95,
    activeGoalRecurrence:
      p.goalHierarchyGoal === p.prevGoal
        ? prev.persistence.activeGoalRecurrence + 1
        : 0,
    persistenceOverloadRisk,
    carryoverRelevance,
    reactivationQuality: hasSpecialReactivation
      ? carryoverRelevance
      : prev.persistence.reactivationQuality * 0.99,
    failureMemoryRecallRate: clamp(
      prev.persistence.failureMemoryRecallRate * 0.9 +
        (p.failureMemoryAffectedAction ? 0.1 : 0),
    ),
    persistenceHistory,
    lastEvent: persistenceEvent ?? prev.persistence.lastEvent,
  };

  // ── 6. Compute Monitor ───────────────────────────────────────────────────
  const computeProxy = clamp(
    p.activeRegionFraction * 0.6 + (1 - p.sparseActivationRatio) * 0.4,
  );
  const efficiencyHistory = rolling(
    prev.compute.efficiencyHistory,
    p.sparseActivationRatio,
  );
  const efficiencyTrend =
    efficiencyHistory.length >= 10
      ? (efficiencyHistory[efficiencyHistory.length - 1] ?? 0) -
        (efficiencyHistory[Math.max(0, efficiencyHistory.length - 10)] ?? 0)
      : 0;
  const computePerUsefulBehavior =
    p.usefulBehaviorEventCount > 0
      ? computeProxy / p.usefulBehaviorEventCount
      : computeProxy;

  let computeEvent: MonitorEvent | null = null;
  if (p.sparseActivationRatio > 0.6 && p.activeRegionFraction < 0.4) {
    computeEvent = "Efficiency-Positive";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Compute",
      event: computeEvent,
      value: p.sparseActivationRatio,
      description: `Efficiency positive: sparse ${(p.sparseActivationRatio * 100).toFixed(0)}%, active ${(p.activeRegionFraction * 100).toFixed(0)}%`,
    });
  } else if (p.sparseActivationRatio < 0.3 && p.activeRegionFraction > 0.7) {
    computeEvent = "Efficiency-Regression";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Compute",
      event: computeEvent,
      value: 1 - p.sparseActivationRatio,
      description: `Efficiency regression: active ${(p.activeRegionFraction * 100).toFixed(0)}%, sparse only ${(p.sparseActivationRatio * 100).toFixed(0)}%`,
    });
  } else if (p.sparseActivationRatio > 0.7) {
    computeEvent = "Sparse-Control-Win";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Compute",
      event: computeEvent,
      value: p.sparseActivationRatio,
      description: `Sparse control win: ${(p.sparseActivationRatio * 100).toFixed(0)}% sparse ratio`,
    });
  }

  const computeMonitor: ComputeMonitor = {
    activeRegionFraction: p.activeRegionFraction,
    sparseActivationRatio: p.sparseActivationRatio,
    eventDrivenUpdateRate: p.eventDrivenUpdates,
    computeProxy,
    computePerUsefulBehavior,
    heavyComputeEscalations: p.heavyComputeEscalations,
    broadVsLocalRatio:
      p.heavyComputeEscalations > 0
        ? p.eventDrivenUpdates / Math.max(1, p.heavyComputeEscalations)
        : 0,
    efficiencyTrend,
    efficiencyHistory,
    lastEvent: computeEvent ?? prev.compute.lastEvent,
  };

  // ── 7. Topology Monitor ──────────────────────────────────────────────────
  const inhibitionEntries = Object.values(p.inhibitionMap);
  const moduleCompetitionSaturation =
    inhibitionEntries.length > 0
      ? inhibitionEntries.filter((v) => v < 0.9).length / 246
      : 0;
  const unusedPathwayFraction =
    p.regionActivations.length > 0
      ? p.regionActivations.filter((a) => a < 0.02).length /
        p.regionActivations.length
      : 0;
  const memoryInterferenceRate = clamp(
    workingMemoryMonitor.churnRate *
      (1 - workingMemoryMonitor.decisiveFactRetentionRate),
  );
  const predictionActionCoupling = clamp(
    p.predictionErrorFeedback.learningRateModulation / 2.5,
  );
  const regulationReach =
    inhibitionEntries.length > 0
      ? inhibitionEntries.filter((v) => v < 0.99).length /
        Math.max(1, p.regionActivations.length)
      : 0;
  const expansionJustified =
    p.recurrentExcitationAvg < 0.1 ||
    memoryInterferenceRate > 0.5 ||
    moduleCompetitionSaturation > 0.8;

  let topologyEvent: MonitorEvent | null = null;
  if (moduleCompetitionSaturation > 0.7) {
    topologyEvent = "Topology-Limiting-Competition";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Topology",
      event: topologyEvent,
      value: moduleCompetitionSaturation,
      description: `Competition saturation: ${(moduleCompetitionSaturation * 100).toFixed(0)}% of modules competing`,
    });
  } else if (memoryInterferenceRate > 0.5) {
    topologyEvent = "Memory-Interference-Bottleneck";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Topology",
      event: topologyEvent,
      value: memoryInterferenceRate,
      description: `Memory interference bottleneck: ${(memoryInterferenceRate * 100).toFixed(0)}%`,
    });
  } else if (p.recurrentExcitationAvg < 0.08) {
    topologyEvent = "Recurrence-Too-Shallow";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Topology",
      event: topologyEvent,
      value: p.recurrentExcitationAvg,
      description: `Recurrence shallow: avg excitation ${(p.recurrentExcitationAvg * 100).toFixed(1)}%`,
    });
  } else if (predictionActionCoupling < 0.4) {
    topologyEvent = "Prediction-Action-Weak-Link";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Topology",
      event: topologyEvent,
      value: predictionActionCoupling,
      description: `Prediction-action coupling weak: ${(predictionActionCoupling * 100).toFixed(0)}%`,
    });
  } else if (regulationReach < 0.2) {
    topologyEvent = "Regulation-Reach-Insufficient";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Topology",
      event: topologyEvent,
      value: regulationReach,
      description: `Regulation reach insufficient: only ${(regulationReach * 100).toFixed(0)}% of network reached`,
    });
  } else if (expansionJustified) {
    topologyEvent = "Topology-Expansion-Justified";
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "Topology",
      event: topologyEvent,
      value: 1,
      description:
        "Topology bottleneck detected — expansion justified by evidence",
    });
  }

  const topologyMonitor: TopologyMonitor = {
    moduleCompetitionSaturation,
    recurrenceDepth: p.recurrentExcitationAvg,
    memoryInterferenceRate,
    predictionActionCoupling,
    regulationReach,
    unusedPathwayFraction,
    overloadedPathwayFraction,
    effectiveConnectivity: clamp(
      1 - unusedPathwayFraction - overloadedPathwayFraction * 0.5,
    ),
    expansionJustified,
    lastEvent: topologyEvent ?? prev.topology.lastEvent,
  };

  // ── Self-Regulation Stack ────────────────────────────────────────────────
  const controlStateScore = clamp(
    (1 - stressMagnitude) * 0.25 +
      autonomicBalanceStability * 0.25 +
      (1 - persistenceOverloadRisk) * 0.2 +
      p.sparseActivationRatio * 0.15 +
      thoughtDiversity * 0.15,
  );

  let driftClass: DriftClass = "None";
  let driftSeverity = 0;

  // Check drift classes in priority order
  if (stressMagnitude > 0.8 && autonomicBalanceStability < 0.2) {
    driftClass = "Regulation-Drift";
    driftSeverity = stressMagnitude;
  } else if (p.sparseActivationRatio < 0.2 && p.activeRegionFraction > 0.8) {
    driftClass = "Efficiency-Drift";
    driftSeverity = 1 - p.sparseActivationRatio;
  } else if (severity > 0.7 && ticksInConflict >= 15) {
    driftClass = "Arbitration-Drift";
    driftSeverity = severity;
  } else if (repeatedTemplateFraction > 0.7) {
    driftClass = "Emergence-Drift";
    driftSeverity = repeatedTemplateFraction;
  } else if (unresolvedTensionCount > 12) {
    driftClass = "State-Drift";
    driftSeverity = clamp(unresolvedTensionCount / 15);
  }

  const correctionEngineActive = driftClass !== "None";
  const policyStrengthMap = { ...prev.selfRegulation.policyStrengthMap };
  if (correctionEngineActive) {
    policyStrengthMap[driftClass] = clamp(
      (policyStrengthMap[driftClass] ?? 0) + 0.05,
    );
    // Also track strategy shift count for conflict detection
    policyStrengthMap.strategyShift = p.strategyShiftCount;
  } else {
    // Record strategy shift count regardless
    policyStrengthMap.strategyShift = p.strategyShiftCount;
  }

  const selfRegulation: SelfRegulationStack = {
    controlStateScore,
    driftClass,
    driftSeverity,
    correctionEngineActive,
    adaptivePolicyUpdates: correctionEngineActive
      ? prev.selfRegulation.adaptivePolicyUpdates + 1
      : prev.selfRegulation.adaptivePolicyUpdates,
    consolidationEvents: prev.selfRegulation.consolidationEvents,
    policyStrengthMap,
    lastCorrectionTick: correctionEngineActive
      ? p.tick
      : prev.selfRegulation.lastCorrectionTick,
    lastEvent: correctionEngineActive
      ? `${driftClass} detected at tick ${p.tick}`
      : prev.selfRegulation.lastEvent,
  };

  // ── Overall Health Score ─────────────────────────────────────────────────
  // Each subsystem contributes its "healthy" fraction
  const conflictHealth = clamp(1 - conflictMonitor.currentConflictSeverity);
  const wmHealth = clamp(
    workingMemoryMonitor.decisiveFactRetentionRate * 0.5 +
      (1 - workingMemoryMonitor.staleRetentionRate) * 0.5,
  );
  const emergenceHealth = clamp(
    emergenceMonitor.emergenceScore * 0.4 +
      (1 - emergenceMonitor.repeatedTemplateFraction) * 0.3 +
      emergenceMonitor.thoughtDiversity * 0.3,
  );
  const regulationHealth = clamp(
    regulationMonitor.autonomicBalanceStability * 0.5 +
      (1 - regulationMonitor.stressMagnitude) * 0.5,
  );
  const persistenceHealth = clamp(
    1 - persistenceMonitor.persistenceOverloadRisk,
  );
  const computeHealth = clamp(
    computeMonitor.sparseActivationRatio * 0.6 +
      (1 - computeMonitor.activeRegionFraction) * 0.4,
  );
  const topologyHealth = clamp(
    (1 - topologyMonitor.unusedPathwayFraction) * 0.5 +
      topologyMonitor.predictionActionCoupling * 0.5,
  );

  const overallHealthScore = clamp(
    conflictHealth * 0.2 +
      wmHealth * 0.15 +
      emergenceHealth * 0.2 +
      regulationHealth * 0.2 +
      persistenceHealth * 0.1 +
      computeHealth * 0.1 +
      topologyHealth * 0.05,
  );

  // u2500u2500 Governance Boundary + Richer Regime + Maturity Integration u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500
  governanceBoundary.tick(p.tick);

  // Update richer regime detector from monitor state
  richerRegimeDetector.update({
    tick: p.tick,
    recurrenceInfluence: prev.topology.recurrenceDepth * 0.3,
    crossTimescaleCoeff: Math.min(1, prev.compute.eventDrivenUpdateRate * 0.5),
    ansThresholdShiftFraction:
      (prev.regulation.regulationToThresholdShifts / Math.max(1, p.tick)) * 10,
    predictionErrorRoutRevisions:
      prev.persistence.unresolvedTensionCount > 2 ? 1 : 0,
    memoryInfluenceFraction: prev.persistence.persistenceUsefulnessScore,
    arbitrationConflictsResolved: prev.conflict.timeToResolution > 0 ? 1 : 0,
    sparseActivationRatio: p.sparseActivationRatio,
    selfStateInfluenceFraction: Math.min(
      1,
      (prev.selfRegulation.adaptivePolicyUpdates / Math.max(1, p.tick)) * 50,
    ),
    failureRevisions: prev.selfRegulation.adaptivePolicyUpdates > 0 ? 1 : 0,
    behaviorVarianceFromState: prev.emergence.diversityScore,
    artifactProbability: prev.emergence.artifactProbability,
  });

  // Check governance boundary for any authored conclusions
  const richerEvent = richerRegimeDetector.getLatestEvent();
  if (richerEvent && richerEvent.tick === p.tick) {
    eventLog = addEvent(eventLog, {
      tick: p.tick,
      subsystem: "RicherRegime",
      event: "RicherRegimeCandidateEvent",
      value: richerEvent.coOccurrenceScore / 10,
      description: richerEvent.claimLabel,
    });
  }

  // Update maturity tracker
  maturityTracker.update({
    tick: p.tick,
    saturationRate:
      p.activeRegionFraction > 0.85 ? p.activeRegionFraction - 0.85 : 0,
    oscillationIndex: regulationMonitor.overloadFrequency * 0.3,
    competitionScore: clamp(
      1 -
        prev.conflict.currentConflictSeverity * 0.5 +
        prev.topology.effectiveConnectivity * 0.3,
    ),
    wmOccupancy: workingMemoryMonitor.activeSlotCount / 10,
    wmChurnRate: workingMemoryMonitor.churnRate,
    persistentTensionCount: persistenceMonitor.unresolvedTensionCount,
    ansModulationActive: regulationMonitor.regulationToThresholdShifts > 0,
    predictionErrorActive: prev.topology.predictionActionCoupling > 0.3,
    failureMemoryActive: persistenceMonitor.persistenceUsefulnessScore > 0.3,
    sparseActivationRatio: p.sparseActivationRatio,
    experimentRunnerLive: true,
    recordSystemLive: true,
    reportsGenerated: 0,
  });

  return {
    conflict: conflictMonitor,
    workingMemory: workingMemoryMonitor,
    emergence: emergenceMonitor,
    regulation: regulationMonitor,
    persistence: persistenceMonitor,
    compute: computeMonitor,
    topology: topologyMonitor,
    selfRegulation,
    eventLog,
    overallHealthScore,
    tick: p.tick,
  };
}
