// Auto-Maturation Loop — Core Brain Optimization Layer
// Proposes, tests, audits, promotes or rejects bounded architecture changes.
// No uncontrolled self-rewrite. All changes require evidence.

import type { OptimizationRecommendation } from "./connectionRegistry";

export type CandidateStatus =
  | "proposed"
  | "testing"
  | "promoted"
  | "rejected"
  | "rolled_back";

export interface CandidateChange {
  id: string;
  subsystem: string;
  description: string;
  status: CandidateStatus;
  baselineScore: number;
  candidateScore: number;
  evidence: string[];
  proposedAt: number;
  resolvedAt?: number;
  source:
    | "manual"
    | "connection_optimizer"
    | "threshold_engine"
    | "regulation_optimizer";
  connectionId?: string;
}

export interface MaturityVector {
  stability: number;
  selectivity: number;
  recurrence: number;
  regulation: number;
  adaptation: number;
  measurability: number;
}

export interface AutoMaturationLoopState {
  candidates: CandidateChange[];
  maturityVector: MaturityVector;
  promotionCount: number;
  rejectionCount: number;
  overallScore: number;
  lastConnectionIngest: number;
  connectionCandidatesActive: number;
}

const SUBSYSTEM_LABEL_MAP: Record<string, string> = {
  body_to_salience: "Body-State → Salience",
  cardio_ans_to_threshold: "CardioANS → Threshold",
  regulation_to_policy: "Regulation → Policy",
  memory_to_salience: "Memory → Salience",
  memory_to_action: "Memory → Action",
  prediction_to_salience: "Prediction → Salience",
  prediction_error_to_learning: "PredError → Learning",
  self_state_to_arbitration: "SelfState → Arbitration",
  cross_timescale: "Cross-Timescale Bridge",
  modulatory_broadcast: "Modulatory Broadcast",
  sensory_to_salience: "Sensory → Salience",
  salience_to_wm: "Salience → WorkingMemory",
  wm_to_arbitration: "WorkingMemory → Arbitration",
  arbitration_to_policy: "Arbitration → Policy",
  command_relay: "Command Relay",
};

const ACTION_DESCRIPTION_MAP: Record<string, (connId: string) => string> = {
  strengthen: (id) =>
    `Increase weight on ${SUBSYSTEM_LABEL_MAP[id] ?? id} — high usefulness under-expressed`,
  weaken: (id) =>
    `Reduce weight on ${SUBSYSTEM_LABEL_MAP[id] ?? id} — overweighted relative to usefulness`,
  gate: (id) =>
    `Apply gating condition to ${SUBSYSTEM_LABEL_MAP[id] ?? id} — overactive with failure association`,
  prune: (id) =>
    `Prune ${SUBSYSTEM_LABEL_MAP[id] ?? id} — low usefulness, high failure rate`,
  promote: (id) =>
    `Promote ${SUBSYSTEM_LABEL_MAP[id] ?? id} to structural pathway — high utility and reliability`,
};

const initialCandidates: CandidateChange[] = [
  {
    id: "cand_001",
    subsystem: "Salience",
    description:
      "Strengthen body_to_salience coupling under high stress conditions",
    status: "promoted",
    baselineScore: 0.61,
    candidateScore: 0.74,
    evidence: [
      "ΔU = +0.13",
      "Regulation score +8%",
      "No artifact increase",
      "Stable across 20 seeds",
    ],
    proposedAt: Date.now() - 86400000 * 3,
    resolvedAt: Date.now() - 86400000 * 1,
    source: "manual",
  },
  {
    id: "cand_002",
    subsystem: "Memory",
    description: "Add failure memory suppression bridge to route planning",
    status: "testing",
    baselineScore: 0.58,
    candidateScore: 0.68,
    evidence: ["Route revision quality +12%", "Pending ablation confirmation"],
    proposedAt: Date.now() - 86400000,
    source: "manual",
  },
  {
    id: "cand_003",
    subsystem: "Cardio/ANS",
    description: "Gate cardio_ans_to_threshold at parasympathetic > 0.7",
    status: "testing",
    baselineScore: 0.55,
    candidateScore: 0.62,
    evidence: [
      "Recovery transition quality up",
      "Awaiting cross-deployment test",
    ],
    proposedAt: Date.now() - 43200000,
    source: "manual",
  },
  {
    id: "cand_004",
    subsystem: "Cross-Timescale",
    description: "Fast-mid-slow bridge: slow memory bias to fast-loop caution",
    status: "proposed",
    baselineScore: 0,
    candidateScore: 0,
    evidence: [],
    proposedAt: Date.now() - 3600000,
    source: "threshold_engine",
  },
  {
    id: "cand_005",
    subsystem: "Computation",
    description: "Skip salience recompute when input delta < 0.02 threshold",
    status: "rejected",
    baselineScore: 0.72,
    candidateScore: 0.69,
    evidence: [
      "ΔU = -0.03",
      "Missed 4% of threat transitions",
      "Efficiency gain insufficient",
    ],
    proposedAt: Date.now() - 86400000 * 5,
    resolvedAt: Date.now() - 86400000 * 4,
    source: "manual",
  },
];

export function createAutoMaturationLoop(): AutoMaturationLoopState {
  const candidates = initialCandidates.map((c) => ({ ...c }));
  const promoted = candidates.filter((c) => c.status === "promoted").length;
  const rejected = candidates.filter((c) => c.status === "rejected").length;
  return {
    candidates,
    maturityVector: {
      stability: 0.78,
      selectivity: 0.65,
      recurrence: 0.71,
      regulation: 0.62,
      adaptation: 0.58,
      measurability: 0.84,
    },
    promotionCount: promoted,
    rejectionCount: rejected,
    overallScore: 0.7,
    lastConnectionIngest: 0,
    connectionCandidatesActive: 0,
  };
}

export function ingestConnectionRecommendations(
  loop: AutoMaturationLoopState,
  recommendations: OptimizationRecommendation[],
): AutoMaturationLoopState {
  // Find all already-active connectionIds in the loop
  const activeConnIds = new Set(
    loop.candidates
      .filter((c) => c.status === "proposed" || c.status === "testing")
      .map((c) => c.connectionId)
      .filter(Boolean),
  );

  const newCandidates: CandidateChange[] = [];
  for (const rec of recommendations) {
    if (activeConnIds.has(rec.connectionId)) continue;
    const subsystemLabel =
      SUBSYSTEM_LABEL_MAP[rec.connectionId] ?? rec.connectionId;
    const descriptionFn = ACTION_DESCRIPTION_MAP[rec.action];
    const description = descriptionFn
      ? descriptionFn(rec.connectionId)
      : `${rec.action} connection ${rec.connectionId}`;
    newCandidates.push({
      id: `conn_${rec.connectionId}_${Date.now() + newCandidates.length}`,
      subsystem: subsystemLabel,
      description,
      status: "proposed",
      source: "connection_optimizer",
      baselineScore: 0,
      candidateScore: 0,
      evidence: [
        `Optimizer action: ${rec.action}`,
        rec.reason,
        `Priority: ${(rec.priority * 100).toFixed(0)}%`,
        "Awaiting baseline batch",
      ],
      connectionId: rec.connectionId,
      proposedAt: Date.now(),
    });
  }

  if (newCandidates.length === 0 && loop.lastConnectionIngest > 0) {
    // No new recs — update timestamp only
    return { ...loop, lastConnectionIngest: Date.now() };
  }

  const updatedCandidates = [...loop.candidates, ...newCandidates];
  const connectionCandidatesActive = updatedCandidates.filter(
    (c) =>
      c.source === "connection_optimizer" &&
      (c.status === "proposed" || c.status === "testing"),
  ).length;

  return {
    ...loop,
    candidates: updatedCandidates,
    lastConnectionIngest: Date.now(),
    connectionCandidatesActive,
  };
}

export function proposeChange(
  loop: AutoMaturationLoopState,
  subsystem: string,
  description: string,
): AutoMaturationLoopState {
  const newCandidate: CandidateChange = {
    id: `cand_${Date.now()}`,
    subsystem,
    description,
    status: "proposed",
    baselineScore: 0,
    candidateScore: 0,
    evidence: [],
    proposedAt: Date.now(),
    source: "manual",
  };
  return { ...loop, candidates: [...loop.candidates, newCandidate] };
}

export function evaluateCandidate(
  loop: AutoMaturationLoopState,
  id: string,
  baselineScore: number,
  candidateScore: number,
  evidence: string[],
): AutoMaturationLoopState {
  return {
    ...loop,
    candidates: loop.candidates.map((c) =>
      c.id === id
        ? {
            ...c,
            status: "testing" as CandidateStatus,
            baselineScore,
            candidateScore,
            evidence,
          }
        : c,
    ),
  };
}

export function promoteCandidate(
  loop: AutoMaturationLoopState,
  id: string,
): AutoMaturationLoopState {
  const updated = loop.candidates.map((c) =>
    c.id === id
      ? { ...c, status: "promoted" as CandidateStatus, resolvedAt: Date.now() }
      : c,
  );
  const connectionCandidatesActive = updated.filter(
    (c) =>
      c.source === "connection_optimizer" &&
      (c.status === "proposed" || c.status === "testing"),
  ).length;
  return {
    ...loop,
    candidates: updated,
    promotionCount: loop.promotionCount + 1,
    overallScore: Math.min(1, loop.overallScore + 0.02),
    connectionCandidatesActive,
  };
}

export function rejectCandidate(
  loop: AutoMaturationLoopState,
  id: string,
): AutoMaturationLoopState {
  const updated = loop.candidates.map((c) =>
    c.id === id
      ? { ...c, status: "rejected" as CandidateStatus, resolvedAt: Date.now() }
      : c,
  );
  const connectionCandidatesActive = updated.filter(
    (c) =>
      c.source === "connection_optimizer" &&
      (c.status === "proposed" || c.status === "testing"),
  ).length;
  return {
    ...loop,
    candidates: updated,
    rejectionCount: loop.rejectionCount + 1,
    connectionCandidatesActive,
  };
}

export function rollbackCandidate(
  loop: AutoMaturationLoopState,
  id: string,
): AutoMaturationLoopState {
  const updated = loop.candidates.map((c) =>
    c.id === id
      ? {
          ...c,
          status: "rolled_back" as CandidateStatus,
          resolvedAt: Date.now(),
        }
      : c,
  );
  return {
    ...loop,
    candidates: updated,
    overallScore: Math.max(0, loop.overallScore - 0.01),
  };
}

export function computeMaturityVector(
  loop: AutoMaturationLoopState,
  neuralState: {
    saturatedRegions?: string[];
    isRunning?: boolean;
    regions?: Array<{ activation: number }>;
  },
): AutoMaturationLoopState {
  const satRatio =
    (neuralState.saturatedRegions?.length ?? 0) /
    Math.max(1, neuralState.regions?.length ?? 246);
  const stability = Math.max(0.1, 1 - satRatio * 2);
  const avgAct = neuralState.regions
    ? neuralState.regions.reduce((s, r) => s + r.activation, 0) /
      neuralState.regions.length
    : 0.5;
  const selectivity = Math.max(0.1, 1 - avgAct);
  const mv: MaturityVector = {
    stability: stability * 0.9 + loop.maturityVector.stability * 0.1,
    selectivity: selectivity * 0.7 + loop.maturityVector.selectivity * 0.3,
    recurrence: loop.maturityVector.recurrence,
    regulation: loop.maturityVector.regulation,
    adaptation: loop.maturityVector.adaptation,
    measurability: loop.maturityVector.measurability,
  };
  const overall = Object.values(mv).reduce((s, v) => s + v, 0) / 6;
  return { ...loop, maturityVector: mv, overallScore: overall };
}
