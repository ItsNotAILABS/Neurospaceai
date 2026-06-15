// Connection Registry — Core Brain Connection Optimization Layer
// 15 connection classes, 10 circuit motifs, optimization engine
// All weights are 0-1 normalized; connections causally affect arbitration/regulation

export interface Connection {
  id: string;
  source: string;
  target: string;
  weight: number;
  reliability: number;
  activationFreq: number;
  usefulness: number;
  failureAssociation: number;
  computeCost: number;
  decay: number;
  stateSensitivity: number;
}

export interface CircuitMotif {
  id: string;
  label: string;
  activationFreq: number;
  stabilityContribution: number;
  adaptationContribution: number;
  regulationContribution: number;
  computeCost: number;
  collapseRisk: number;
}

export interface OptimizationRecommendation {
  connectionId: string;
  action: "strengthen" | "weaken" | "gate" | "prune" | "promote";
  reason: string;
  priority: number; // 0-1
}

export interface ConnectionRegistry {
  connections: Connection[];
  motifs: CircuitMotif[];
  lastUpdated: number;
}

const DEFAULT_CONNECTIONS: Connection[] = [
  {
    id: "sensory_to_salience",
    source: "Sensory",
    target: "Salience",
    weight: 0.82,
    reliability: 0.88,
    activationFreq: 0.91,
    usefulness: 0.85,
    failureAssociation: 0.08,
    computeCost: 0.3,
    decay: 0.05,
    stateSensitivity: 0.6,
  },
  {
    id: "salience_to_wm",
    source: "Salience",
    target: "WorkingMemory",
    weight: 0.74,
    reliability: 0.79,
    activationFreq: 0.78,
    usefulness: 0.76,
    failureAssociation: 0.12,
    computeCost: 0.35,
    decay: 0.08,
    stateSensitivity: 0.7,
  },
  {
    id: "wm_to_arbitration",
    source: "WorkingMemory",
    target: "Arbitration",
    weight: 0.71,
    reliability: 0.75,
    activationFreq: 0.72,
    usefulness: 0.73,
    failureAssociation: 0.15,
    computeCost: 0.4,
    decay: 0.07,
    stateSensitivity: 0.65,
  },
  {
    id: "arbitration_to_policy",
    source: "Arbitration",
    target: "Policy",
    weight: 0.86,
    reliability: 0.9,
    activationFreq: 0.85,
    usefulness: 0.88,
    failureAssociation: 0.05,
    computeCost: 0.25,
    decay: 0.04,
    stateSensitivity: 0.5,
  },
  {
    id: "memory_to_salience",
    source: "Memory",
    target: "Salience",
    weight: 0.63,
    reliability: 0.68,
    activationFreq: 0.61,
    usefulness: 0.66,
    failureAssociation: 0.2,
    computeCost: 0.45,
    decay: 0.1,
    stateSensitivity: 0.75,
  },
  {
    id: "memory_to_action",
    source: "Memory",
    target: "Action",
    weight: 0.58,
    reliability: 0.62,
    activationFreq: 0.55,
    usefulness: 0.6,
    failureAssociation: 0.22,
    computeCost: 0.5,
    decay: 0.12,
    stateSensitivity: 0.8,
  },
  {
    id: "prediction_to_salience",
    source: "Prediction",
    target: "Salience",
    weight: 0.67,
    reliability: 0.7,
    activationFreq: 0.64,
    usefulness: 0.69,
    failureAssociation: 0.18,
    computeCost: 0.42,
    decay: 0.09,
    stateSensitivity: 0.72,
  },
  {
    id: "prediction_error_to_learning",
    source: "PredictionError",
    target: "Learning",
    weight: 0.79,
    reliability: 0.83,
    activationFreq: 0.76,
    usefulness: 0.81,
    failureAssociation: 0.1,
    computeCost: 0.38,
    decay: 0.06,
    stateSensitivity: 0.68,
  },
  {
    id: "body_to_salience",
    source: "BodyState",
    target: "Salience",
    weight: 0.55,
    reliability: 0.6,
    activationFreq: 0.58,
    usefulness: 0.57,
    failureAssociation: 0.25,
    computeCost: 0.28,
    decay: 0.11,
    stateSensitivity: 0.9,
  },
  {
    id: "cardio_ans_to_threshold",
    source: "CardioANS",
    target: "Threshold",
    weight: 0.49,
    reliability: 0.53,
    activationFreq: 0.47,
    usefulness: 0.51,
    failureAssociation: 0.3,
    computeCost: 0.22,
    decay: 0.14,
    stateSensitivity: 0.88,
  },
  {
    id: "regulation_to_policy",
    source: "Regulation",
    target: "Policy",
    weight: 0.62,
    reliability: 0.66,
    activationFreq: 0.59,
    usefulness: 0.64,
    failureAssociation: 0.21,
    computeCost: 0.33,
    decay: 0.1,
    stateSensitivity: 0.82,
  },
  {
    id: "self_state_to_arbitration",
    source: "SelfState",
    target: "Arbitration",
    weight: 0.57,
    reliability: 0.61,
    activationFreq: 0.54,
    usefulness: 0.59,
    failureAssociation: 0.24,
    computeCost: 0.36,
    decay: 0.13,
    stateSensitivity: 0.85,
  },
  {
    id: "cross_timescale",
    source: "SlowMemory",
    target: "FastSalience",
    weight: 0.44,
    reliability: 0.48,
    activationFreq: 0.41,
    usefulness: 0.46,
    failureAssociation: 0.32,
    computeCost: 0.55,
    decay: 0.16,
    stateSensitivity: 0.7,
  },
  {
    id: "modulatory_broadcast",
    source: "Modulator",
    target: "GlobalGain",
    weight: 0.71,
    reliability: 0.76,
    activationFreq: 0.69,
    usefulness: 0.74,
    failureAssociation: 0.14,
    computeCost: 0.48,
    decay: 0.07,
    stateSensitivity: 0.6,
  },
  {
    id: "command_relay",
    source: "CommandHierarchy",
    target: "LocalPolicy",
    weight: 0.66,
    reliability: 0.71,
    activationFreq: 0.63,
    usefulness: 0.68,
    failureAssociation: 0.17,
    computeCost: 0.3,
    decay: 0.08,
    stateSensitivity: 0.55,
  },
];

const DEFAULT_MOTIFS: CircuitMotif[] = [
  {
    id: "recurrent_loop",
    label: "Recurrent Loop",
    activationFreq: 0.88,
    stabilityContribution: 0.82,
    adaptationContribution: 0.6,
    regulationContribution: 0.5,
    computeCost: 0.35,
    collapseRisk: 0.18,
  },
  {
    id: "inh_exc_competition",
    label: "Inh/Exc Competition",
    activationFreq: 0.81,
    stabilityContribution: 0.76,
    adaptationContribution: 0.72,
    regulationContribution: 0.6,
    computeCost: 0.4,
    collapseRisk: 0.12,
  },
  {
    id: "prediction_error_loop",
    label: "Prediction Error Loop",
    activationFreq: 0.74,
    stabilityContribution: 0.65,
    adaptationContribution: 0.84,
    regulationContribution: 0.55,
    computeCost: 0.45,
    collapseRisk: 0.15,
  },
  {
    id: "memory_salience_action",
    label: "Memory-Salience-Action",
    activationFreq: 0.67,
    stabilityContribution: 0.7,
    adaptationContribution: 0.78,
    regulationContribution: 0.62,
    computeCost: 0.5,
    collapseRisk: 0.2,
  },
  {
    id: "regulation_threshold",
    label: "Regulation-Threshold",
    activationFreq: 0.7,
    stabilityContribution: 0.78,
    adaptationContribution: 0.55,
    regulationContribution: 0.88,
    computeCost: 0.3,
    collapseRisk: 0.1,
  },
  {
    id: "local_microcircuit",
    label: "Local Microcircuit",
    activationFreq: 0.92,
    stabilityContribution: 0.71,
    adaptationContribution: 0.5,
    regulationContribution: 0.48,
    computeCost: 0.25,
    collapseRisk: 0.08,
  },
  {
    id: "fast_mid_slow_bridge",
    label: "Fast-Mid-Slow Bridge",
    activationFreq: 0.58,
    stabilityContribution: 0.68,
    adaptationContribution: 0.8,
    regulationContribution: 0.65,
    computeCost: 0.55,
    collapseRisk: 0.25,
  },
  {
    id: "modulatory_broadcast",
    label: "Modulatory Broadcast",
    activationFreq: 0.62,
    stabilityContribution: 0.6,
    adaptationContribution: 0.68,
    regulationContribution: 0.75,
    computeCost: 0.48,
    collapseRisk: 0.14,
  },
  {
    id: "self_state_integration",
    label: "Self-State Integration",
    activationFreq: 0.55,
    stabilityContribution: 0.65,
    adaptationContribution: 0.72,
    regulationContribution: 0.8,
    computeCost: 0.4,
    collapseRisk: 0.22,
  },
  {
    id: "cardio_autonomic",
    label: "Cardio-Autonomic",
    activationFreq: 0.5,
    stabilityContribution: 0.72,
    adaptationContribution: 0.45,
    regulationContribution: 0.85,
    computeCost: 0.28,
    collapseRisk: 0.16,
  },
];

export function createConnectionRegistry(): ConnectionRegistry {
  return {
    connections: DEFAULT_CONNECTIONS.map((c) => ({ ...c })),
    motifs: DEFAULT_MOTIFS.map((m) => ({ ...m })),
    lastUpdated: Date.now(),
  };
}

export function updateConnectionWeights(
  registry: ConnectionRegistry,
  neuralState: {
    heartRate?: number;
    sympatheticTone?: number;
    stressLoad?: number;
    isRunning?: boolean;
  },
): ConnectionRegistry {
  const stress = neuralState.stressLoad ?? 0.3;
  const symp = neuralState.sympatheticTone ?? 0.4;
  const running = neuralState.isRunning ? 1 : 0;

  const updated = registry.connections.map((c) => {
    let dw = 0;
    if (c.id === "body_to_salience") dw = stress * 0.05 * running;
    else if (c.id === "cardio_ans_to_threshold") dw = symp * 0.04 * running;
    else if (c.id === "regulation_to_policy")
      dw = (1 - stress) * 0.03 * running;
    const newWeight = Math.max(
      0.1,
      Math.min(0.99, c.weight + dw - c.decay * 0.01),
    );
    return {
      ...c,
      weight: newWeight,
      activationFreq: running
        ? Math.min(0.99, c.activationFreq + 0.001)
        : c.activationFreq,
    };
  });

  return { ...registry, connections: updated, lastUpdated: Date.now() };
}

export function getOptimizationRecommendations(
  registry: ConnectionRegistry,
): OptimizationRecommendation[] {
  const recs: OptimizationRecommendation[] = [];

  for (const c of registry.connections) {
    if (c.usefulness < 0.55 && c.failureAssociation > 0.25) {
      recs.push({
        connectionId: c.id,
        action: "prune",
        reason: `Low usefulness (${(c.usefulness * 100).toFixed(0)}%) with high failure rate`,
        priority: 1 - c.usefulness,
      });
    } else if (c.usefulness > 0.75 && c.weight < 0.6) {
      recs.push({
        connectionId: c.id,
        action: "strengthen",
        reason: "High usefulness but weight is under-expressed",
        priority: c.usefulness - c.weight,
      });
    } else if (c.activationFreq > 0.8 && c.failureAssociation > 0.2) {
      recs.push({
        connectionId: c.id,
        action: "gate",
        reason: "Overactive with notable failure association",
        priority: c.failureAssociation,
      });
    } else if (c.usefulness > 0.8 && c.reliability > 0.85 && c.weight > 0.75) {
      recs.push({
        connectionId: c.id,
        action: "promote",
        reason:
          "High utility + reliability — candidate for structural promotion",
        priority: c.usefulness * c.reliability,
      });
    } else if (c.weight > 0.7 && c.usefulness < 0.6) {
      recs.push({
        connectionId: c.id,
        action: "weaken",
        reason: "Overweighted relative to usefulness",
        priority: c.weight - c.usefulness,
      });
    }
  }

  return recs.sort((a, b) => b.priority - a.priority).slice(0, 5);
}
