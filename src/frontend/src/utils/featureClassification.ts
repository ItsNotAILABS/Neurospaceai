// Feature Classification Registry — Phase 7 Governance
// Every change to the Core Brain is classified and tracked.

export type FeatureClass = "core-worthy" | "wrapper-only" | "experimental";

export interface FeatureRecord {
  id: string;
  name: string;
  description: string;
  classification: FeatureClass;
  promotedToCore: boolean;
  addedAt: number; // ordinal sequence
  instancesImproved: string[]; // deployment instances that benefited
  passedBenchmark: boolean;
}

const FEATURE_REGISTRY: FeatureRecord[] = [
  {
    id: "stdp_plasticity",
    name: "Three-Factor STDP",
    classification: "core-worthy",
    promotedToCore: true,
    instancesImproved: ["avatar", "npc", "scenario", "emergence_lab"],
    passedBenchmark: true,
    description:
      "Eligibility trace + outcome-gated weight updates (Izhikevich 2007)",
    addedAt: 1,
  },
  {
    id: "homeostatic_scaling",
    name: "Homeostatic Scaling",
    classification: "core-worthy",
    promotedToCore: true,
    instancesImproved: ["avatar", "npc", "scenario", "pharma"],
    passedBenchmark: true,
    description:
      "Target-rate homeostatic downscaling; prevents saturation drift",
    addedAt: 2,
  },
  {
    id: "sparse_ticking",
    name: "Sparse Event-Driven Ticking",
    classification: "core-worthy",
    promotedToCore: true,
    instancesImproved: ["avatar", "scenario", "edge"],
    passedBenchmark: true,
    description:
      "Skip quiescent regions below change threshold — energy-saving",
    addedAt: 3,
  },
  {
    id: "ans_layer",
    name: "ANS / Interoceptive Layer",
    classification: "experimental",
    promotedToCore: false,
    instancesImproved: [],
    passedBenchmark: false,
    description:
      "Bounded ANS regulation: sympathetic/parasympathetic modulation of cortical regions",
    addedAt: 4,
  },
  {
    id: "cross_session_memory",
    name: "Cross-Session Memory",
    classification: "core-worthy",
    promotedToCore: false,
    instancesImproved: ["avatar"],
    passedBenchmark: false,
    description:
      "STDP weight snapshot reinstatement across sessions via localStorage",
    addedAt: 5,
  },
  {
    id: "winner_take_most_salience",
    name: "Winner-Take-Most Salience",
    classification: "core-worthy",
    promotedToCore: true,
    instancesImproved: ["avatar", "npc", "scenario"],
    passedBenchmark: true,
    description:
      "Top-k regions get 1.3x gain, suppressed 0.7x — salience-driven attention routing",
    addedAt: 6,
  },
  {
    id: "thought_episode_merging",
    name: "Thought Episode Merging",
    classification: "wrapper-only",
    promotedToCore: false,
    instancesImproved: ["avatar"],
    passedBenchmark: true,
    description:
      "Sustained homeostatic drives merged into single episode cards",
    addedAt: 7,
  },
  {
    id: "strategy_shift",
    name: "Strategy Shift from Failure",
    classification: "experimental",
    promotedToCore: false,
    instancesImproved: [],
    passedBenchmark: false,
    description:
      "LTD penalty on repeatedly-failed action pathways; promotes alternative strategies",
    addedAt: 8,
  },
  {
    id: "hunger_auto_relief",
    name: "Hunger Auto-Relief",
    classification: "wrapper-only",
    promotedToCore: false,
    instancesImproved: ["avatar"],
    passedBenchmark: true,
    description: "Auto-reset hunger to 15% at 100% to prevent override lock",
    addedAt: 9,
  },
  {
    id: "closed_loop_embodiment",
    name: "Closed-Loop Embodiment",
    classification: "core-worthy",
    promotedToCore: true,
    instancesImproved: ["avatar", "scenario", "emergence_lab"],
    passedBenchmark: true,
    description:
      "Perceive → state update → attention → action → outcome → STDP — no scripted behavior",
    addedAt: 10,
  },
  {
    id: "prediction_expectation_layer",
    name: "Prediction / Expectation Layer",
    classification: "core-worthy",
    promotedToCore: false,
    instancesImproved: ["avatar", "scenario", "emergence_lab", "npc"],
    passedBenchmark: false,
    description:
      "Forward model with mismatch detection; surprise-gated plasticity; novelty accumulator; feeds dACC conflict and hippocampal encoding",
    addedAt: 11,
  },
  {
    id: "self_state_model",
    name: "Self-State Model",
    classification: "core-worthy",
    promotedToCore: false,
    instancesImproved: ["avatar", "npc", "scenario"],
    passedBenchmark: false,
    description:
      "Bounded meta-model: pressure, stability, confidence, urgency, regulation. Drives hesitate/commit/withdraw flags and dynamic action threshold",
    addedAt: 11,
  },
  {
    id: "goal_hierarchy",
    name: "Goal Hierarchy (3-tier)",
    classification: "core-worthy",
    promotedToCore: false,
    instancesImproved: ["avatar", "npc", "scenario", "emergence_lab"],
    passedBenchmark: false,
    description:
      "Emergent 3-tier goal structure: immediate drive, active task, survival override. Derived from actual neural/drive signals, not scripted",
    addedAt: 11,
  },
  {
    id: "failure_memory",
    name: "Failure Memory + Counterfactual Routing",
    classification: "core-worthy",
    promotedToCore: false,
    instancesImproved: ["avatar", "scenario", "emergence_lab"],
    passedBenchmark: false,
    description:
      "Long-term negative episodic memory for failed action contexts; suppresses repeated failures; counterfactual safer-vs-riskier route comparison",
    addedAt: 11,
  },
];
// In-memory mutable copy for runtime classification updates
let registry: FeatureRecord[] = FEATURE_REGISTRY.map((f) => ({ ...f }));

export function getFeatureRegistry(): FeatureRecord[] {
  return registry;
}

export function classifyFeature(
  id: string,
  classification: FeatureClass,
): void {
  const rec = registry.find((f) => f.id === id);
  if (rec) rec.classification = classification;
}

export function promoteToCore(id: string): void {
  const rec = registry.find((f) => f.id === id);
  if (rec) {
    rec.promotedToCore = true;
    rec.classification = "core-worthy";
  }
}

export function getCoreFeatures(): FeatureRecord[] {
  return registry.filter((f) => f.classification === "core-worthy");
}

export function getExperimentalFeatures(): FeatureRecord[] {
  return registry.filter((f) => f.classification === "experimental");
}

export function resetRegistry(): void {
  registry = FEATURE_REGISTRY.map((f) => ({ ...f }));
}
