// Cognitive Governance Layer — 6 Permanent Principles
// These are real computational laws that shape conditions for emergence.
// They never script behavior — they create constraints within which
// adaptive cognition emerges from the Core Brain tick.
//
// Biological basis:
//   Soft priors: PFC attentional set (Miller & Cohen 2001)
//   Precision weighting: Active inference / free energy (Friston 2010)
//   WM gating: PFC-hippocampal gating (O'Reilly & Frank 2006)
//   Persistence: Recurrent cortical dynamics (Wang 2001)
//   Feedback: Three-factor STDP (Schultz 1997, Frémaux 2016)
//   Homeostasis: Synaptic scaling (Turrigiano 2008)

import type { TaskClass } from "./taskClassMatrices";

const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SoftPriorVector {
  navigation: number;
  threat: number;
  memory: number;
  regulation: number;
  social: number;
  exploration: number;
  activeCategory: string;
}

export interface InfluenceFactors {
  P_m: number; // soft task prior
  Q_m: number; // precision / confidence (Bayesian, 1/(σ²+ε))
  S_m: number; // salience contribution
  C_m: number; // conflict relevance
  G_m: number; // goal / mission fit
  R_m: number; // regulation / body-state relevance
  E_m: number; // energy / efficiency modifier
}

export type WMSlotType =
  | "SITUATION"
  | "BODY_STATE"
  | "CONFLICT"
  | "GOAL"
  | "MEMORY";

export interface WMCandidate {
  id: string;
  type: WMSlotType;
  content: string;
  relevanceScore: number; // [0,1]
  staleness: number; // ticks since last refresh
  isCritical: boolean; // sticky — stays until resolved
  resolved: boolean;
}

export interface WMSlot {
  occupied: boolean;
  type: WMSlotType | null;
  content: string;
  freshness: number; // [0,1] — decays each tick
  isCritical: boolean;
  lastUpdatedTick: number;
}

export type PersistenceTier = "SHORT" | "MEDIUM" | "HIGH" | "SPECIAL";

export interface PersistentStateItem {
  id: string;
  tier: PersistenceTier;
  content: string;
  strength: number; // [0,1]
  ticksActive: number;
  isResolved: boolean;
  isCritical?: boolean; // if true, does not decay passively
  maxTicks: number; // tier-based TTL
}

export interface OutcomeRecord {
  context: string;
  outcome: "success" | "failure";
  tick: number;
  strength: number;
}

export interface FeedbackUpdateResult {
  updatedWeights: Map<string, number>;
  strategyShiftTriggered: boolean;
  strengthenedPaths: string[];
  depressedPaths: string[];
  ltpCount: number;
  ltdCount: number;
}

export interface HomeostaticCorrection {
  magnitude: number; // [0,1] — 0=none, 1=maximal correction
  type: "none" | "excitatory_boost" | "inhibitory_boost" | "load_shedding";
  excitabilityAdjust: number; // multiplicative, ~[0.8, 1.2]
  inhibitionAdjust: number;
  sparseTargetAdjust: number; // how much to tighten sparsity
  reason: string;
}

export interface GovernanceMetrics {
  softPriorActive: string;
  softPriorVector: SoftPriorVector;
  influenceTop: number;
  influenceFactors: InfluenceFactors;
  wmOccupancy: number; // [0,1] slots used / total
  wmSlots: WMSlot[];
  persistenceTier: PersistenceTier;
  persistenceItemCount: number;
  homeostaticCorrection: HomeostaticCorrection;
}

// ─── Variance Tracker for Precision Computation ────────────────────────────────
// EMA-based variance: σ²(t) = α*(x-μ)² + (1-α)*σ²(t-1)
// Precision = 1/(σ²+ε) per Friston active-inference framework

const VARIANCE_ALPHA = 0.05; // EMA decay — ~20 tick window
const PRECISION_EPS = 0.01;

export const varianceTracker = new Map<
  string,
  { mean: number; variance: number }
>();

export function updatePrecisionVariance(key: string, value: number): number {
  const state = varianceTracker.get(key) ?? { mean: value, variance: 0.1 };
  const delta = value - state.mean;
  const newMean = state.mean + VARIANCE_ALPHA * delta;
  const newVar = clamp(
    (1 - VARIANCE_ALPHA) * state.variance + VARIANCE_ALPHA * delta * delta,
    0.001,
    1,
  );
  varianceTracker.set(key, { mean: newMean, variance: newVar });
  return clamp(1 / (newVar + PRECISION_EPS));
}

// ─── Principle 1: Soft Task Priors ─────────────────────────────────────────────
// Biases recruitment readiness without locking it.
// Overridable by live salience, uncertainty, and regulation.
// Source: PFC task-set maintenance (Sakai 2008)

const TASK_PRIOR_TEMPLATES: Record<
  TaskClass,
  Omit<SoftPriorVector, "activeCategory">
> = {
  THREAT: {
    navigation: 0.3,
    threat: 0.9,
    memory: 0.5,
    regulation: 0.6,
    social: 0.2,
    exploration: 0.1,
  },
  NAVIGATE: {
    navigation: 0.9,
    threat: 0.3,
    memory: 0.5,
    regulation: 0.4,
    social: 0.3,
    exploration: 0.4,
  },
  EXPLORE: {
    navigation: 0.5,
    threat: 0.2,
    memory: 0.4,
    regulation: 0.3,
    social: 0.4,
    exploration: 0.9,
  },
  REST: {
    navigation: 0.2,
    threat: 0.1,
    memory: 0.4,
    regulation: 0.9,
    social: 0.5,
    exploration: 0.2,
  },
  CONFLICT: {
    navigation: 0.3,
    threat: 0.6,
    memory: 0.5,
    regulation: 0.7,
    social: 0.6,
    exploration: 0.3,
  },
  REWARD: {
    navigation: 0.6,
    threat: 0.2,
    memory: 0.5,
    regulation: 0.4,
    social: 0.5,
    exploration: 0.6,
  },
  MEMORY_RECALL: {
    navigation: 0.3,
    threat: 0.3,
    memory: 0.9,
    regulation: 0.4,
    social: 0.3,
    exploration: 0.4,
  },
  STRATEGY_SHIFT: {
    navigation: 0.5,
    threat: 0.4,
    memory: 0.6,
    regulation: 0.5,
    social: 0.4,
    exploration: 0.7,
  },
};

export function computeSoftPrior(
  taskClass: TaskClass,
  threatLevel: number,
  rewardSignal: number,
  conflictScore: number,
  noveltyScore: number,
  bodyPressure: number,
): SoftPriorVector {
  const base = TASK_PRIOR_TEMPLATES[taskClass];

  // Soft modulation — priors bend toward current state but don't lock
  const nav = clamp(
    base.navigation * (1 - threatLevel * 0.3) + rewardSignal * 0.1,
  );
  const threat = clamp(base.threat * (1 + threatLevel * 0.4));
  const memory = clamp(base.memory * (1 + noveltyScore * 0.2));
  const regulation = clamp(base.regulation * (1 + bodyPressure * 0.3));
  const social = clamp(base.social * (1 - conflictScore * 0.2));
  const exploration = clamp(
    base.exploration * (1 - threatLevel * 0.5) + noveltyScore * 0.2,
  );

  const vec = {
    navigation: nav,
    threat,
    memory,
    regulation,
    social,
    exploration,
  };
  const maxKey = (Object.keys(vec) as Array<keyof typeof vec>).reduce((a, b) =>
    vec[a] > vec[b] ? a : b,
  );

  return { ...vec, activeCategory: maxKey };
}

// ─── Principle 2: Precision-Weighted Influence Law ──────────────────────────────
// I_m = P_m × Q_m × S_m × C_m × G_m × R_m × E_m
// Each factor [0,1]; product reflects integrated relevance.
// Avoids flat activation — influence depends on all 7 dimensions simultaneously.

export function computeInfluenceLaw(factors: InfluenceFactors): number {
  const { P_m, Q_m, S_m, C_m, G_m, R_m, E_m } = factors;
  // Geometric mean-like product (7th root) keeps result in [0,1]
  // but we use the raw product scaled to stay sensitive to weak links
  const raw = P_m * Q_m * S_m * C_m * G_m * R_m * E_m;
  // 7th root normalises scale without losing the multiplicative structure
  return clamp(Math.max(0, raw) ** (1 / 7));
}

// ─── Principle 3: Working Memory Gating ────────────────────────────────────────
// 7-8 slot scarce resource.
// Architecture: 3 SITUATION, 2 BODY_STATE, 2 CONFLICT, 1 GOAL, 1 MEMORY (9 max, contested)
// Slots admit only materially relevant candidates.
// Critical/unresolved items persist until settled or deprioritized.

const WM_TOTAL_SLOTS = 8;
const WM_FRESHNESS_DECAY = 0.03; // per tick
const WM_ADMIT_THRESHOLD = 0.4;
const SLOT_CAPS: Record<WMSlotType, number> = {
  SITUATION: 3,
  BODY_STATE: 2,
  CONFLICT: 2,
  GOAL: 1,
  MEMORY: 1,
};

export function gateWorkingMemory(
  candidates: WMCandidate[],
  currentSlots: WMSlot[],
  tick: number,
): WMSlot[] {
  // 1. Decay freshness on existing slots
  const decayed = currentSlots.map((slot) => ({
    ...slot,
    freshness: slot.occupied ? clamp(slot.freshness - WM_FRESHNESS_DECAY) : 0,
  }));

  // 2. Eject stale non-critical slots (freshness → 0)
  const active = decayed.map((slot) => {
    if (slot.occupied && !slot.isCritical && slot.freshness <= 0) {
      return {
        occupied: false,
        type: null,
        content: "",
        freshness: 0,
        isCritical: false,
        lastUpdatedTick: tick,
      };
    }
    return slot;
  });

  // 3. Count used slots per type
  const typeCounts: Record<WMSlotType, number> = {
    SITUATION: 0,
    BODY_STATE: 0,
    CONFLICT: 0,
    GOAL: 0,
    MEMORY: 0,
  };
  for (const slot of active) {
    if (slot.occupied && slot.type) typeCounts[slot.type]++;
  }

  // 4. Rank candidates by relevance, admit top ones below cap
  const sorted = [...candidates]
    .filter((c) => !c.resolved && c.relevanceScore >= WM_ADMIT_THRESHOLD)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  let slots = [...active];
  for (const cand of sorted) {
    if (typeCounts[cand.type] >= SLOT_CAPS[cand.type]) continue;
    const totalOccupied = slots.filter((s) => s.occupied).length;
    if (totalOccupied >= WM_TOTAL_SLOTS) break;
    // Find empty slot or displace lowest-freshness non-critical same-type
    const emptyIdx = slots.findIndex((s) => !s.occupied);
    const insertIdx =
      emptyIdx !== -1
        ? emptyIdx
        : slots.reduce((best, s, i) => {
            if (!s.isCritical && s.type === cand.type) {
              return s.freshness < (slots[best]?.freshness ?? 1) ? i : best;
            }
            return best;
          }, -1);
    if (insertIdx === -1) continue;
    slots[insertIdx] = {
      occupied: true,
      type: cand.type,
      content: cand.content,
      freshness: 1.0,
      isCritical: cand.isCritical,
      lastUpdatedTick: tick,
    };
    typeCounts[cand.type]++;
  }

  return slots;
}

export function initWorkingMemorySlots(): WMSlot[] {
  return Array.from({ length: WM_TOTAL_SLOTS }, () => ({
    occupied: false,
    type: null,
    content: "",
    freshness: 0,
    isCritical: false,
    lastUpdatedTick: 0,
  }));
}

// ─── Principle 4: Persistence Tiers ────────────────────────────────────────────
// Four levels of recurrent state — unresolved important tensions stay active.
// Source: Recurrent cortical dynamics (Wang 2001), prefrontal maintenance (Goldman-Rakic 1995)

const TIER_MAX_TICKS: Record<PersistenceTier, number> = {
  SHORT: 10,
  MEDIUM: 50,
  HIGH: 200, // active until resolved
  SPECIAL: 9999, // session-long failure patterns
};

export function initPersistentItems(): PersistentStateItem[] {
  return [];
}

export function addPersistentItem(
  items: PersistentStateItem[],
  item: Omit<PersistentStateItem, "ticksActive" | "isResolved"> & {
    isResolved?: boolean;
  },
): PersistentStateItem[] {
  const existing = items.findIndex((i) => i.id === item.id);
  const newItem: PersistentStateItem = {
    ...item,
    ticksActive: 0,
    isResolved: item.isResolved ?? false,
    maxTicks: TIER_MAX_TICKS[item.tier],
  };
  if (existing !== -1) {
    const updated = [...items];
    updated[existing] = {
      ...updated[existing],
      strength: item.strength,
      isResolved: item.isResolved ?? false,
    };
    return updated;
  }
  return [...items, newItem].slice(-50); // cap at 50 items
}

export function applyPersistenceTiers(
  stateItems: PersistentStateItem[],
  _currentTick: number,
): PersistentStateItem[] {
  return stateItems
    .map((item) => ({
      ...item,
      ticksActive: item.ticksActive + 1,
      strength:
        (item.isCritical ?? false)
          ? item.strength // critical items don't decay passively
          : clamp(
              item.strength -
                0.002 *
                  (item.tier === "SHORT" ? 5 : item.tier === "MEDIUM" ? 2 : 1),
            ),
    }))
    .filter((item) => {
      if (item.isResolved) return false;
      if (item.ticksActive > item.maxTicks && item.tier !== "SPECIAL")
        return false;
      if (item.strength <= 0.01 && item.tier === "SHORT") return false;
      return true;
    });
}

export function getDominantTier(items: PersistentStateItem[]): PersistenceTier {
  const active = items.filter((i) => !i.isResolved);
  if (active.some((i) => i.tier === "SPECIAL")) return "SPECIAL";
  if (active.some((i) => i.tier === "HIGH")) return "HIGH";
  if (active.some((i) => i.tier === "MEDIUM")) return "MEDIUM";
  return "SHORT";
}

// ─── Principle 5: Feedback-Based Updating ──────────────────────────────────────
// LTP/LTD on routing weights from repeated outcomes.
// η+ = 0.003, η- = 0.001 (conservative to preserve stability)
// Source: Eligibility-trace STDP (Frémaux et al. 2016)

const LTP_RATE = 0.003;
const LTD_RATE = 0.001;
const FAILURE_SHIFT_THRESHOLD = 3; // consecutive failures before LTD + strategy shift

export function applyFeedbackUpdate(
  routeWeights: Map<string, number>,
  outcomeHistory: OutcomeRecord[],
  failureMemory: Map<string, number>,
): FeedbackUpdateResult {
  const updatedWeights = new Map(routeWeights);
  const strengthenedPaths: string[] = [];
  const depressedPaths: string[] = [];
  let strategyShiftTriggered = false;
  let ltpCount = 0;
  let ltdCount = 0;

  // Group by context
  const contextOutcomes = new Map<string, OutcomeRecord[]>();
  for (const rec of outcomeHistory.slice(-20)) {
    const existing = contextOutcomes.get(rec.context) ?? [];
    contextOutcomes.set(rec.context, [...existing, rec]);
  }

  for (const [context, records] of contextOutcomes) {
    const successes = records.filter((r) => r.outcome === "success").length;
    const failures = records.filter((r) => r.outcome === "failure").length;
    const current = updatedWeights.get(context) ?? 1.0;

    if (successes > failures && successes >= 2) {
      // LTP: strengthen winning pathway
      const newWeight = clamp(current + LTP_RATE * successes, 0.3, 2.0);
      updatedWeights.set(context, newWeight);
      strengthenedPaths.push(context);
      ltpCount++;
      failureMemory.delete(context);
    } else if (failures >= FAILURE_SHIFT_THRESHOLD) {
      // LTD: depress failed pathway
      const newWeight = clamp(current - LTD_RATE * failures, 0.3, 2.0);
      updatedWeights.set(context, newWeight);
      depressedPaths.push(context);
      ltdCount++;
      strategyShiftTriggered = true;
      failureMemory.set(context, (failureMemory.get(context) ?? 0) + failures);
    }
  }

  return {
    updatedWeights,
    strategyShiftTriggered,
    strengthenedPaths,
    depressedPaths,
    ltpCount,
    ltdCount,
  };
}

// ─── Principle 6: Homeostatic Spine ────────────────────────────────────────────
// Checks active region fraction, overactivation, load, efficiency floor.
// Returns corrective signals — does NOT override emergence, only nudges conditions.
// Source: Synaptic scaling (Turrigiano 2008), homeostatic plasticity (Abbott & Nelson 2000)

const HOMEOSTATIC_ACTIVE_FRACTION_TARGET = 0.35; // ~86/246 regions
const HOMEOSTATIC_ACTIVE_FRACTION_MAX = 0.6;
const HOMEOSTATIC_GLOBAL_ACTIVATION_MAX = 0.75;
const HOMEOSTATIC_EFFICIENCY_FLOOR = 0.2;
const HOMEOSTATIC_LOAD_MAX = 0.85;

export function enforceHomeostaticSpine(
  activeRegionFraction: number,
  globalActivation: number,
  computeLoad: number,
  sparseEfficiency: number,
): HomeostaticCorrection {
  // Detect overactivation
  if (globalActivation > HOMEOSTATIC_GLOBAL_ACTIVATION_MAX) {
    const excess = globalActivation - HOMEOSTATIC_GLOBAL_ACTIVATION_MAX;
    return {
      magnitude: clamp(excess * 2),
      type: "inhibitory_boost",
      excitabilityAdjust: clamp(1.0 - excess * 0.5, 0.7, 1.0),
      inhibitionAdjust: clamp(1.0 + excess * 0.8, 1.0, 1.5),
      sparseTargetAdjust: clamp(excess * 0.3),
      reason: `Global activation ${(globalActivation * 100).toFixed(0)}% > ${(HOMEOSTATIC_GLOBAL_ACTIVATION_MAX * 100).toFixed(0)}% ceiling`,
    };
  }

  // Detect over-dense region recruitment
  if (activeRegionFraction > HOMEOSTATIC_ACTIVE_FRACTION_MAX) {
    const excess = activeRegionFraction - HOMEOSTATIC_ACTIVE_FRACTION_MAX;
    return {
      magnitude: clamp(excess * 1.5),
      type: "inhibitory_boost",
      excitabilityAdjust: clamp(1.0 - excess * 0.3, 0.8, 1.0),
      inhibitionAdjust: clamp(1.0 + excess * 0.5, 1.0, 1.3),
      sparseTargetAdjust: clamp(excess * 0.2),
      reason: `Active region fraction ${(activeRegionFraction * 100).toFixed(0)}% exceeds sparse target`,
    };
  }

  // Detect excessive compute load
  if (computeLoad > HOMEOSTATIC_LOAD_MAX) {
    const excess = computeLoad - HOMEOSTATIC_LOAD_MAX;
    return {
      magnitude: clamp(excess * 1.2),
      type: "load_shedding",
      excitabilityAdjust: 1.0,
      inhibitionAdjust: 1.0,
      sparseTargetAdjust: clamp(excess * 0.4),
      reason: `Compute load ${(computeLoad * 100).toFixed(0)}% — shedding sparse budget`,
    };
  }

  // Detect hypo-activity — sparse floor violation
  if (
    activeRegionFraction < HOMEOSTATIC_ACTIVE_FRACTION_TARGET * 0.3 &&
    sparseEfficiency < HOMEOSTATIC_EFFICIENCY_FLOOR
  ) {
    return {
      magnitude: 0.15,
      type: "excitatory_boost",
      excitabilityAdjust: 1.1,
      inhibitionAdjust: 0.95,
      sparseTargetAdjust: 0,
      reason:
        "Under-activation — light excitatory nudge to restore sparse dynamics",
    };
  }

  return {
    magnitude: 0,
    type: "none",
    excitabilityAdjust: 1.0,
    inhibitionAdjust: 1.0,
    sparseTargetAdjust: 0,
    reason: "Within homeostatic bounds",
  };
}

// ─── Governance Metrics Builder ─────────────────────────────────────────────────

export function buildGovernanceMetrics(
  softPrior: SoftPriorVector,
  influenceFactors: InfluenceFactors,
  wmSlots: WMSlot[],
  persistentItems: PersistentStateItem[],
  homeostaticCorrection: HomeostaticCorrection,
): GovernanceMetrics {
  const occupied = wmSlots.filter((s) => s.occupied).length;
  const dominantTier = getDominantTier(persistentItems);
  const activeItems = persistentItems.filter((i) => !i.isResolved);

  return {
    softPriorActive: softPrior.activeCategory,
    softPriorVector: softPrior,
    influenceTop: computeInfluenceLaw(influenceFactors),
    influenceFactors,
    wmOccupancy: occupied / WM_TOTAL_SLOTS,
    wmSlots,
    persistenceTier: dominantTier,
    persistenceItemCount: activeItems.length,
    homeostaticCorrection,
  };
}
