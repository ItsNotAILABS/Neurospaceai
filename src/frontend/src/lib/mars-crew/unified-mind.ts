/**
 * Unified computational mind for NeurospaceAI.
 *
 * Specialist algorithms remain separate internally. This module creates a
 * bounded global workspace: attention selects salient beliefs, memory stores
 * the selected state, and policy emits one inspectable mission state.
 * It is an operational cognitive architecture, not a claim of consciousness.
 */

import {
  stepIntelligenceNetwork,
  type Belief,
  type IntelligenceNetwork,
  type NetworkStepResult,
} from "./intelligence-network";

export type WorkspaceItem = Belief & {
  salience: number;
  attentionReason: "precision" | "novelty" | "mission";
};

export type UnifiedMindState = {
  timeS: number;
  workspace: WorkspaceItem[];
  episodicMemory: WorkspaceItem[];
  dominantVariable: string | null;
  globalCoherence: number;
  predictionError: number;
  actionReadiness: number;
  humanApprovalRequired: boolean;
};

export type UnifiedMind = {
  network: IntelligenceNetwork;
  state: UnifiedMindState;
  events: string[];
};

function salienceFor(
  belief: Belief,
  previous: WorkspaceItem[],
): { value: number; reason: WorkspaceItem["attentionReason"] } {
  const precision = 1 / Math.max(belief.variance, Number.EPSILON);
  const wasPresent = previous.some(
    (item) =>
      item.variable === belief.variable &&
      Math.abs(item.value - belief.value) < Math.sqrt(belief.variance),
  );
  const novelty = wasPresent ? 1 : 2;
  const mission =
    belief.variable.includes("hazard") ||
    belief.variable.includes("health") ||
    belief.variable.includes("power")
      ? 2
      : 1;
  const value = precision * novelty * mission;
  const reason =
    mission > 1 ? "mission" : novelty > 1 ? "novelty" : "precision";
  return { value, reason };
}

function buildWorkspace(
  beliefs: Belief[],
  previous: WorkspaceItem[],
  capacity: number,
): WorkspaceItem[] {
  return beliefs
    .map((belief) => {
      const salience = salienceFor(belief, previous);
      return { ...belief, salience: salience.value, attentionReason: salience.reason };
    })
    .sort((a, b) => b.salience - a.salience)
    .slice(0, capacity);
}

function buildMindState(
  network: IntelligenceNetwork,
  previous: UnifiedMindState,
  produced: Belief[],
): UnifiedMindState {
  const workspace = buildWorkspace(
    [...network.beliefs, ...produced],
    previous.workspace,
    8,
  );
  const predictionError = produced.reduce(
    (sum, belief) => sum + Math.sqrt(Math.max(belief.variance, 0)),
    0,
  ) / Math.max(produced.length, 1);
  const globalCoherence =
    workspace.length === 0
      ? 0
      : workspace.reduce(
          (sum, item) => sum + 1 / (1 + Math.sqrt(item.variance)),
          0,
        ) / workspace.length;
  const urgent = workspace.some(
    (item) =>
      item.variable.includes("hazard") ||
      item.variable.includes("health") ||
      item.variable.includes("power"),
  );
  const actionReadiness = Math.max(
    0,
    Math.min(1, globalCoherence * (1 - Math.min(1, predictionError))),
  );

  return {
    timeS: network.timeS,
    workspace,
    episodicMemory: [...previous.episodicMemory, ...workspace].slice(-256),
    dominantVariable: workspace[0]?.variable ?? null,
    globalCoherence,
    predictionError,
    actionReadiness,
    humanApprovalRequired: urgent || actionReadiness < 0.5,
  };
}

export function createUnifiedMind(network: IntelligenceNetwork): UnifiedMind {
  const state: UnifiedMindState = {
    timeS: network.timeS,
    workspace: [],
    episodicMemory: [],
    dominantVariable: null,
    globalCoherence: 0,
    predictionError: 1,
    actionReadiness: 0,
    humanApprovalRequired: true,
  };
  return { network, state, events: ["mind-created"] };
}

export function stepUnifiedMind(
  mind: UnifiedMind,
  dtSeconds: number,
): { mind: UnifiedMind; networkResult: NetworkStepResult } {
  const networkResult = stepIntelligenceNetwork(mind.network, dtSeconds);
  const state = buildMindState(
    networkResult.network,
    mind.state,
    networkResult.produced,
  );
  return {
    mind: {
      network: networkResult.network,
      state,
      events: [
        ...mind.events,
        `workspace:${state.workspace.length}`,
        `dominant:${state.dominantVariable ?? "none"}`,
        `approval:${state.humanApprovalRequired ? "required" : "not-required"}`,
      ].slice(-200),
    },
    networkResult,
  };
}
