/**
 * Mathematical intelligence network for NeurospaceAI.
 *
 * Intelligence is represented as a network of specialist algorithms:
 * perception, estimation, spectral analysis, memory, planning, and policy.
 * Nodes exchange typed beliefs with uncertainty and resource cost.
 *
 * This is a research architecture, not a claim of consciousness.
 */

export type IntelligenceDomain =
  | "perception"
  | "estimation"
  | "spectral"
  | "memory"
  | "planning"
  | "policy";

export type Belief = {
  variable: string;
  value: number;
  variance: number;
  timestampS: number;
  source: string;
  evidenceClass: "measurement" | "inference" | "model" | "doctrine";
};

export type AlgorithmNode = {
  id: string;
  domain: IntelligenceDomain;
  energyCostJ: number;
  latencyS: number;
  reliability: number;
  process: (beliefs: Belief[], timeS: number) => Belief[];
};

export type AlgorithmEdge = {
  from: string;
  to: string;
  bandwidthBitsPerSecond: number;
  delayS: number;
  enabled: boolean;
};

export type IntelligenceNetwork = {
  nodes: AlgorithmNode[];
  edges: AlgorithmEdge[];
  beliefs: Belief[];
  timeS: number;
  energySpentJ: number;
  events: string[];
};

export type NetworkStepResult = {
  network: IntelligenceNetwork;
  produced: Belief[];
  rejected: Array<{ belief: Belief; reason: string }>;
};

function weightedFusion(beliefs: Belief[]): Belief | null {
  if (beliefs.length === 0) return null;
  const valid = beliefs.filter(
    (belief) =>
      Number.isFinite(belief.value) &&
      Number.isFinite(belief.variance) &&
      belief.variance > 0,
  );
  if (valid.length === 0) return null;

  const totalPrecision = valid.reduce(
    (sum, belief) => sum + 1 / belief.variance,
    0,
  );
  const value = valid.reduce(
    (sum, belief) => sum + belief.value / belief.variance,
    0,
  ) / totalPrecision;

  return {
    variable: valid[0].variable,
    value,
    variance: 1 / totalPrecision,
    timestampS: Math.max(...valid.map((belief) => belief.timestampS)),
    source: "bayesian-fusion",
    evidenceClass: "inference",
  };
}

export function createIntelligenceNetwork(
  nodes: AlgorithmNode[],
  edges: AlgorithmEdge[],
  timeS = 0,
): IntelligenceNetwork {
  return {
    nodes,
    edges,
    beliefs: [],
    timeS,
    energySpentJ: 0,
    events: ["network-created"],
  };
}

function incomingBeliefs(
  network: IntelligenceNetwork,
  nodeId: string,
): Belief[] {
  const incoming = network.edges
    .filter((edge) => edge.to === nodeId && edge.enabled)
    .map((edge) => edge.from);
  return network.beliefs.filter((belief) => incoming.includes(belief.source));
}

export function stepIntelligenceNetwork(
  network: IntelligenceNetwork,
  dtSeconds: number,
): NetworkStepResult {
  if (dtSeconds <= 0) throw new Error("dtSeconds must be positive");

  const produced: Belief[] = [];
  const rejected: NetworkStepResult["rejected"] = [];

  for (const node of network.nodes) {
    const inputs = incomingBeliefs(network, node.id);
    const outputs = node.process(inputs, network.timeS + dtSeconds);

    for (const belief of outputs) {
      if (belief.variance <= 0 || !Number.isFinite(belief.variance)) {
        rejected.push({ belief, reason: "invalid-uncertainty" });
        continue;
      }
      if (belief.source !== node.id) {
        rejected.push({ belief, reason: "source-identity-mismatch" });
        continue;
      }
      produced.push(belief);
    }
  }

  const availableEnergy =
    network.beliefs.find((belief) => belief.variable === "availableEnergyJ")?.value ??
    Number.POSITIVE_INFINITY;

  const acceptedEnergy = network.nodes.reduce(
    (sum, node) => sum + node.energyCostJ,
    0,
  );

  if (acceptedEnergy > availableEnergy) {
    for (const belief of produced.splice(0)) {
      rejected.push({ belief, reason: "energy-budget-exceeded" });
    }
  }

  const nextBeliefs = [...network.beliefs, ...produced];
  const byVariable = new Map<string, Belief[]>();
  for (const belief of nextBeliefs) {
    const bucket = byVariable.get(belief.variable) ?? [];
    bucket.push(belief);
    byVariable.set(belief.variable, bucket);
  }

  const fused = [...byVariable.values()]
    .map(weightedFusion)
    .filter((belief): belief is Belief => belief !== null);

  return {
    network: {
      ...network,
      beliefs: fused,
      timeS: network.timeS + dtSeconds,
      energySpentJ: network.energySpentJ + acceptedEnergy,
      events: [
        ...network.events,
        `step:${(network.timeS + dtSeconds).toFixed(3)}`,
        `produced:${produced.length}`,
        `rejected:${rejected.length}`,
      ].slice(-200),
    },
    produced,
    rejected,
  };
}

export function makeMeasurementNode(
  id: string,
  variable: string,
  value: number,
  variance: number,
): AlgorithmNode {
  return {
    id,
    domain: "perception",
    energyCostJ: 1,
    latencyS: 0.01,
    reliability: 0.99,
    process: (_beliefs, timeS) => [
      {
        variable,
        value,
        variance,
        timestampS: timeS,
        source: id,
        evidenceClass: "measurement",
      },
    ],
  };
}

export function makeFusionNode(
  id: string,
  variable: string,
): AlgorithmNode {
  return {
    id,
    domain: "estimation",
    energyCostJ: 2,
    latencyS: 0.02,
    reliability: 0.98,
    process: (beliefs, timeS) => {
      const matching = beliefs.filter((belief) => belief.variable === variable);
      const fused = weightedFusion(matching);
      return fused
        ? [{ ...fused, source: id, timestampS: timeS }]
        : [];
    },
  };
}

export function informationGain(
  priorVariance: number,
  posteriorVariance: number,
): number {
  if (priorVariance <= 0 || posteriorVariance <= 0) {
    throw new Error("variances must be positive");
  }
  return 0.5 * Math.log(priorVariance / posteriorVariance);
}

export function actionUtility(
  informationGainValue: number,
  energyCostJ: number,
  risk: number,
  weights = { information: 1, energy: 0.001, risk: 2 },
): number {
  return (
    weights.information * informationGainValue -
    weights.energy * energyCostJ -
    weights.risk * risk
  );
}
