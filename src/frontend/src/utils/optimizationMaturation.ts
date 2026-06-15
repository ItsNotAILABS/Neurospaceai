export interface Candidate {
  id: string;
  type: string;
  description: string;
  expectedGain: number;
  evidence: string[];
  sourceAttribution: string;
  rollbackSnapshot?: unknown;
}

export interface Score {
  candidateId: string;
  improvementScore: number;
  validated: boolean;
  recommendation: "promote" | "keep_experimental" | "reject" | "rollback";
}

abstract class BaseOptimizer {
  protected name: string;
  constructor(name: string) {
    this.name = name;
  }

  generateCandidates(metrics: Record<string, number>): Candidate[] {
    const weakKeys = Object.entries(metrics)
      .filter(([, v]) => v < 0.5)
      .map(([k]) => k)
      .slice(0, 2);
    return weakKeys.map((k, i) => ({
      id: `${this.name}_${k}_${i}`,
      type: this.name,
      description: `Optimize ${k} via ${this.name}`,
      expectedGain: 0.1 + Math.random() * 0.2,
      evidence: [`metric_${k}_below_threshold`],
      sourceAttribution: "internal_optimizer",
    }));
  }

  evaluate(candidate: Candidate, metrics: Record<string, number>): Score {
    const baseValue = metrics[candidate.type.toLowerCase()] ?? 0.5;
    const improved =
      baseValue + candidate.expectedGain * (0.5 + Math.random() * 0.5);
    const validated = improved > baseValue + 0.05;
    return {
      candidateId: candidate.id,
      improvementScore: improved - baseValue,
      validated,
      recommendation: validated ? "promote" : "reject",
    };
  }
}

export class ConnectionOptimizer extends BaseOptimizer {
  constructor() {
    super("connection");
  }
}
export class MotifOptimizer extends BaseOptimizer {
  constructor() {
    super("motif");
  }
}
export class ThresholdOptimizer extends BaseOptimizer {
  constructor() {
    super("threshold");
  }
}
export class RegulationOptimizer extends BaseOptimizer {
  constructor() {
    super("regulation");
  }
}
export class MemoryRouteOptimizer extends BaseOptimizer {
  constructor() {
    super("memory_route");
  }
}
export class PredictionOptimizer extends BaseOptimizer {
  constructor() {
    super("prediction");
  }
}
export class SparseComputeOptimizer extends BaseOptimizer {
  constructor() {
    super("sparse_compute");
  }
}

export class PromotionRollbackEngine {
  private queue: Candidate[] = [];
  private promoted: Candidate[] = [];
  private rollbackSnapshots = new Map<string, unknown>();

  enqueue(candidate: Candidate): void {
    this.queue.push(candidate);
  }

  promote(
    candidateId: string,
    snapshot: unknown,
  ): { success: boolean; reason: string } {
    const idx = this.queue.findIndex((c) => c.id === candidateId);
    if (idx === -1) return { success: false, reason: "Candidate not in queue" };
    const candidate = this.queue[idx];
    if (!candidate.evidence || candidate.evidence.length === 0) {
      return {
        success: false,
        reason: "No evidence provided — promotion blocked",
      };
    }
    this.rollbackSnapshots.set(candidateId, snapshot);
    this.promoted.push(candidate);
    this.queue.splice(idx, 1);
    return { success: true, reason: "Promoted with rollback snapshot stored" };
  }

  rollback(candidateId: string): { success: boolean; snapshot: unknown } {
    const snapshot = this.rollbackSnapshots.get(candidateId);
    if (!snapshot) return { success: false, snapshot: null };
    this.promoted = this.promoted.filter((c) => c.id !== candidateId);
    return { success: true, snapshot };
  }

  getQueue(): Candidate[] {
    return [...this.queue];
  }
  getPromoted(): Candidate[] {
    return [...this.promoted];
  }
}
