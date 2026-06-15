// ─── Circuit Plasticity Modules ───────────────────────────────────────────────
// Real implementations of:
//   PathwayStrengthTracker, ConnectionScorer, MotifScorer,
//   ThresholdAdaptationEngine, TrustOrderingUpdater, StructuralPlasticityLight
//
// All modules expose telemetry and are wired into the runtime pipeline.

import type { LearningState } from "./coreBrainSchemas";

// ─── PathwayStrengthTracker ───────────────────────────────────────────────────
export interface PathwayRecord {
  pathwayId: string;
  source: string;
  target: string;
  strength: number; // 0-1
  activations: number; // total usage count
  successRate: number; // fraction of activations that led to good outcomes
  lastActiveTs: number;
  decayRate: number;
}

export class PathwayStrengthTracker {
  private pathways = new Map<string, PathwayRecord>();

  registerPathway(source: string, target: string): string {
    const id = `pw_${source}_${target}`;
    if (!this.pathways.has(id)) {
      this.pathways.set(id, {
        pathwayId: id,
        source,
        target,
        strength: 0.5,
        activations: 0,
        successRate: 0.5,
        lastActiveTs: Date.now(),
        decayRate: 0.001,
      });
    }
    return id;
  }

  recordActivation(pathwayId: string, success: boolean): void {
    const pw = this.pathways.get(pathwayId);
    if (!pw) return;
    pw.activations++;
    pw.lastActiveTs = Date.now();
    // Hebbian-style update: success strengthens, failure weakens
    const delta = success ? 0.02 : -0.015;
    pw.strength = Math.min(1, Math.max(0.05, pw.strength + delta));
    pw.successRate = pw.successRate * 0.95 + (success ? 1 : 0) * 0.05;
  }

  applyDecay(dtMs: number): void {
    for (const pw of this.pathways.values()) {
      const elapsed = (Date.now() - pw.lastActiveTs) / 1000;
      pw.strength = Math.max(
        0.05,
        pw.strength - pw.decayRate * elapsed * 0.01 * dtMs,
      );
    }
  }

  getStrength(source: string, target: string): number {
    return this.pathways.get(`pw_${source}_${target}`)?.strength ?? 0.5;
  }

  getAll(): PathwayRecord[] {
    return [...this.pathways.values()];
  }

  getMetrics(): {
    totalPathways: number;
    avgStrength: number;
    strongPathways: number;
    weakPathways: number;
  } {
    const all = this.getAll();
    const avg =
      all.reduce((s, p) => s + p.strength, 0) / Math.max(1, all.length);
    return {
      totalPathways: all.length,
      avgStrength: avg,
      strongPathways: all.filter((p) => p.strength > 0.7).length,
      weakPathways: all.filter((p) => p.strength < 0.3).length,
    };
  }
}

// ─── ConnectionScorer ─────────────────────────────────────────────────────────
export interface ConnectionScore {
  connectionId: string;
  relevanceScore: number; // how often this connection is used in real decisions
  efficiencyScore: number; // behavior quality per compute unit
  functionalScore: number; // combined
  pruneCandidate: boolean;
  promoteCandidate: boolean;
}

export class ConnectionScorer {
  score(
    connectionId: string,
    activationFrequency: number,
    usefulnessScore: number,
    computeCost: number,
    failureAssociation: number,
  ): ConnectionScore {
    const relevanceScore = Math.min(1, activationFrequency / 100);
    const efficiencyScore =
      computeCost > 0
        ? Math.min(1, usefulnessScore / computeCost)
        : usefulnessScore;
    const penalizedByFailure = efficiencyScore * (1 - failureAssociation * 0.4);
    const functionalScore = relevanceScore * 0.4 + penalizedByFailure * 0.6;

    return {
      connectionId,
      relevanceScore,
      efficiencyScore,
      functionalScore,
      pruneCandidate: functionalScore < 0.2,
      promoteCandidate: functionalScore > 0.8 && activationFrequency > 20,
    };
  }

  scoreAll(
    connections: Array<{
      id: string;
      activationFrequency: number;
      usefulnessScore: number;
      computeCost: number;
      failureAssociationScore: number;
    }>,
  ): ConnectionScore[] {
    return connections.map((c) =>
      this.score(
        c.id,
        c.activationFrequency,
        c.usefulnessScore,
        c.computeCost,
        c.failureAssociationScore,
      ),
    );
  }
}

// ─── MotifScorer ─────────────────────────────────────────────────────────────
export type MotifType =
  | "recurrent_loop"
  | "inhibitory_competition"
  | "excitatory_relay"
  | "memory_salience_bridge"
  | "regulation_threshold_bridge"
  | "cross_timescale_bridge"
  | "modulatory_broadcast"
  | "prediction_error_route";

export interface MotifScore {
  motifId: string;
  motifType: MotifType;
  strength: number; // 0-1 aggregate strength of connections in motif
  activationCount: number;
  behavioralContribution: number; // estimated causal contribution to behavior
  isRequired: boolean; // must-have per architecture directive
  present: boolean;
}

export class MotifScorer {
  private motifs = new Map<string, MotifScore>();

  registerMotif(id: string, type: MotifType, isRequired = false): void {
    this.motifs.set(id, {
      motifId: id,
      motifType: type,
      strength: 0.5,
      activationCount: 0,
      behavioralContribution: 0,
      isRequired,
      present: true,
    });
  }

  recordMotifActivation(id: string, behavioralImpact: number): void {
    const m = this.motifs.get(id);
    if (!m) return;
    m.activationCount++;
    m.behavioralContribution =
      m.behavioralContribution * 0.95 + behavioralImpact * 0.05;
    m.strength = Math.min(1, m.strength + behavioralImpact * 0.01);
  }

  getAll(): MotifScore[] {
    return [...this.motifs.values()];
  }

  getMissingRequired(): string[] {
    return this.getAll()
      .filter((m) => m.isRequired && !m.present)
      .map((m) => m.motifId);
  }

  getMetrics(): {
    totalMotifs: number;
    activeMotifs: number;
    avgStrength: number;
    missingRequired: number;
    avgBehavioralContribution: number;
  } {
    const all = this.getAll();
    const active = all.filter((m) => m.activationCount > 0);
    return {
      totalMotifs: all.length,
      activeMotifs: active.length,
      avgStrength:
        all.reduce((s, m) => s + m.strength, 0) / Math.max(1, all.length),
      missingRequired: this.getMissingRequired().length,
      avgBehavioralContribution:
        active.reduce((s, m) => s + m.behavioralContribution, 0) /
        Math.max(1, active.length),
    };
  }
}

// ─── ThresholdAdaptationEngine ────────────────────────────────────────────────
// Real threshold adaptation: adjusts action/decision thresholds based on
// prediction error, regulation state, and learning signal.

export interface ThresholdAdaptationState {
  thresholds: Record<string, number>;
  adaptationHistory: Array<{ key: string; delta: number; ts: number }>;
  totalAdaptations: number;
  avgAdaptationMagnitude: number;
}

export class ThresholdAdaptationEngine {
  private state: ThresholdAdaptationState;

  constructor(initial: Record<string, number> = {}) {
    this.state = {
      thresholds: {
        action_commit: 0.5,
        memory_encode: 0.4,
        salience_admit: 0.35,
        prediction_update: 0.3,
        regulation_escalate: 0.6,
        recovery_trigger: 0.7,
        ...initial,
      },
      adaptationHistory: [],
      totalAdaptations: 0,
      avgAdaptationMagnitude: 0,
    };
  }

  adapt(
    predictionError: number,
    success: boolean,
    regulationLoad: number,
  ): void {
    const keys = Object.keys(this.state.thresholds);
    const learningRate = 0.03 + predictionError * 0.04;

    for (const key of keys) {
      const current = this.state.thresholds[key];
      let delta = 0;

      if (key === "action_commit") {
        // High regulation raises commit threshold (more caution)
        delta = success ? -learningRate * 0.5 : learningRate * regulationLoad;
      } else if (key === "memory_encode") {
        // Large prediction errors lower encode threshold (capture surprises)
        delta = predictionError > 0.3 ? -learningRate : learningRate * 0.3;
      } else if (key === "salience_admit") {
        // Overload raises admit threshold (filter more)
        delta = regulationLoad > 0.7 ? learningRate * 0.4 : -learningRate * 0.2;
      } else if (key === "regulation_escalate") {
        // Repeated failures lower escalation threshold (react faster)
        delta = success ? learningRate * 0.3 : -learningRate * 0.5;
      } else {
        delta = success ? -learningRate * 0.2 : learningRate * 0.2;
      }

      const newVal = Math.min(0.95, Math.max(0.05, current + delta));
      this.state.thresholds[key] = newVal;

      this.state.adaptationHistory.push({
        key,
        delta,
        ts: Date.now(),
      });
    }

    if (this.state.adaptationHistory.length > 1000) {
      this.state.adaptationHistory = this.state.adaptationHistory.slice(-500);
    }

    this.state.totalAdaptations++;
    const recent = this.state.adaptationHistory.slice(-50);
    this.state.avgAdaptationMagnitude =
      recent.reduce((s, r) => s + Math.abs(r.delta), 0) /
      Math.max(1, recent.length);
  }

  get(key: string): number {
    return this.state.thresholds[key] ?? 0.5;
  }

  getState(): ThresholdAdaptationState {
    return { ...this.state, thresholds: { ...this.state.thresholds } };
  }

  getMetrics(): {
    totalAdaptations: number;
    avgMagnitude: number;
    thresholds: Record<string, number>;
    driftFromBaseline: number;
  } {
    const baseline = 0.5;
    const drift =
      Object.values(this.state.thresholds).reduce(
        (s, v) => s + Math.abs(v - baseline),
        0,
      ) / Math.max(1, Object.values(this.state.thresholds).length);
    return {
      totalAdaptations: this.state.totalAdaptations,
      avgMagnitude: this.state.avgAdaptationMagnitude,
      thresholds: { ...this.state.thresholds },
      driftFromBaseline: drift,
    };
  }
}

// ─── TrustOrderingUpdater ─────────────────────────────────────────────────────
// Updates trust ordering over information sources / routes / modules.
// High trust = higher weight in arbitration and memory recall.

export class TrustOrderingUpdater {
  private trust: Record<string, number> = {};
  private updateCount = 0;

  initialize(sources: string[], baseValue = 0.5): void {
    for (const s of sources) {
      if (this.trust[s] === undefined) this.trust[s] = baseValue;
    }
  }

  update(sourceId: string, wasUseful: boolean, magnitude = 0.05): void {
    const current = this.trust[sourceId] ?? 0.5;
    const delta = wasUseful ? magnitude : -magnitude * 0.7;
    this.trust[sourceId] = Math.min(0.95, Math.max(0.05, current + delta));
    this.updateCount++;
  }

  getTrustOrdering(): Record<string, number> {
    return { ...this.trust };
  }

  getRanked(): Array<{ source: string; trust: number }> {
    return Object.entries(this.trust)
      .sort((a, b) => b[1] - a[1])
      .map(([source, trust]) => ({ source, trust }));
  }

  applyToLearningState(learning: LearningState): LearningState {
    return {
      ...learning,
      trustOrdering: { ...this.trust },
    };
  }

  getMetrics(): {
    totalSources: number;
    updateCount: number;
    highTrustCount: number;
    lowTrustCount: number;
    avgTrust: number;
  } {
    const vals = Object.values(this.trust);
    return {
      totalSources: vals.length,
      updateCount: this.updateCount,
      highTrustCount: vals.filter((v) => v > 0.7).length,
      lowTrustCount: vals.filter((v) => v < 0.3).length,
      avgTrust: vals.reduce((s, v) => s + v, 0) / Math.max(1, vals.length),
    };
  }
}

// ─── StructuralPlasticityLight ────────────────────────────────────────────────
// Lightweight structural plasticity: proposes new connections / pruning
// based on co-activation patterns + pathway strength signals.
// Does NOT directly mutate — produces candidate proposals only.

export interface PlasticityCandidate {
  type: "add" | "prune" | "strengthen";
  source: string;
  target: string;
  reason: string;
  evidence: number; // 0-1 strength of evidence
  ts: number;
}

export class StructuralPlasticityLight {
  private candidates: PlasticityCandidate[] = [];
  private coActivationMap = new Map<string, Map<string, number>>();

  recordCoActivation(regionA: string, regionB: string): void {
    if (!this.coActivationMap.has(regionA))
      this.coActivationMap.set(regionA, new Map());
    const map = this.coActivationMap.get(regionA)!;
    map.set(regionB, (map.get(regionB) ?? 0) + 1);
  }

  proposeCandidates(
    pathways: PathwayRecord[],
    threshold = 10,
  ): PlasticityCandidate[] {
    const newCandidates: PlasticityCandidate[] = [];

    // Propose ADD for highly co-active pairs not yet connected
    for (const [source, targets] of this.coActivationMap.entries()) {
      for (const [target, count] of targets.entries()) {
        if (count >= threshold) {
          const alreadyConnected = pathways.some(
            (p) => p.source === source && p.target === target,
          );
          if (!alreadyConnected) {
            newCandidates.push({
              type: "add",
              source,
              target,
              reason: `Co-activated ${count} times`,
              evidence: Math.min(1, count / 50),
              ts: Date.now(),
            });
          }
        }
      }
    }

    // Propose PRUNE for consistently weak pathways
    for (const pw of pathways) {
      if (pw.strength < 0.15 && pw.activations > 20) {
        newCandidates.push({
          type: "prune",
          source: pw.source,
          target: pw.target,
          reason: `Strength ${pw.strength.toFixed(2)} after ${pw.activations} activations`,
          evidence: 1 - pw.strength,
          ts: Date.now(),
        });
      }
    }

    // Propose STRENGTHEN for high-success pathways
    for (const pw of pathways) {
      if (pw.successRate > 0.8 && pw.strength < 0.6 && pw.activations > 10) {
        newCandidates.push({
          type: "strengthen",
          source: pw.source,
          target: pw.target,
          reason: `High success rate ${(pw.successRate * 100).toFixed(0)}%`,
          evidence: pw.successRate,
          ts: Date.now(),
        });
      }
    }

    this.candidates = [...this.candidates.slice(-100), ...newCandidates];
    return newCandidates;
  }

  getCandidates(): PlasticityCandidate[] {
    return [...this.candidates];
  }

  getMetrics(): {
    totalCandidates: number;
    addCandidates: number;
    pruneCandidates: number;
    strengthenCandidates: number;
    avgEvidence: number;
  } {
    return {
      totalCandidates: this.candidates.length,
      addCandidates: this.candidates.filter((c) => c.type === "add").length,
      pruneCandidates: this.candidates.filter((c) => c.type === "prune").length,
      strengthenCandidates: this.candidates.filter(
        (c) => c.type === "strengthen",
      ).length,
      avgEvidence:
        this.candidates.reduce((s, c) => s + c.evidence, 0) /
        Math.max(1, this.candidates.length),
    };
  }
}

// ─── Global singleton instances ───────────────────────────────────────────────
export const globalPathwayTracker = new PathwayStrengthTracker();
export const globalConnectionScorer = new ConnectionScorer();
export const globalMotifScorer = new MotifScorer();
export const globalThresholdAdaptation = new ThresholdAdaptationEngine();
export const globalTrustOrdering = new TrustOrderingUpdater();
export const globalStructuralPlasticity = new StructuralPlasticityLight();

// Seed required motifs from architecture directive
const REQUIRED_MOTIFS: Array<{ id: string; type: MotifType }> = [
  { id: "mot_recurrent_loop", type: "recurrent_loop" },
  { id: "mot_inhibitory_comp", type: "inhibitory_competition" },
  { id: "mot_excitatory_relay", type: "excitatory_relay" },
  { id: "mot_mem_salience_bridge", type: "memory_salience_bridge" },
  { id: "mot_reg_threshold_bridge", type: "regulation_threshold_bridge" },
  { id: "mot_cross_timescale", type: "cross_timescale_bridge" },
  { id: "mot_modulatory_broadcast", type: "modulatory_broadcast" },
  { id: "mot_prediction_error_route", type: "prediction_error_route" },
];

for (const m of REQUIRED_MOTIFS) {
  globalMotifScorer.registerMotif(m.id, m.type, true);
}

// Seed trust ordering for core subsystems
globalTrustOrdering.initialize([
  "salience_engine",
  "working_memory",
  "arbitration",
  "regulation_layer",
  "cardio_layer",
  "ans_layer",
  "memory_engine",
  "prediction_engine",
  "learning_engine",
  "sensory_coupling",
]);

// Seed pathway tracking for required bridges
const REQUIRED_PATHWAYS: Array<[string, string]> = [
  ["interoception", "salience"],
  ["interoception", "working_memory"],
  ["interoception", "arbitration"],
  ["cardio", "persistence"],
  ["cardio", "sustained_task"],
  ["cardio", "recovery"],
  ["ans", "urgency_sensitivity"],
  ["ans", "commitment_speed"],
  ["sensory_uncertainty", "confidence_pressure"],
  ["overload", "recovery_bias"],
  ["memory", "salience_bias"],
  ["memory", "action_bias"],
  ["prediction_error", "salience"],
  ["prediction_error", "learning"],
  ["prediction_error", "policy_revision"],
  ["regulation", "sparse_compute"],
  ["regulation", "threshold_shifts"],
];

for (const [src, tgt] of REQUIRED_PATHWAYS) {
  globalPathwayTracker.registerPathway(src, tgt);
}
