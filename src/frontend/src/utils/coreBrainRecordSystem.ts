// CoreBrainRecordSystem — unified recorder for all experiments
// Records per run: metadata, behavior, emergence, efficiency, regulation, core trace, artifacts

export interface RunMetadata {
  experimentId: string;
  runId: string;
  timestamp: number;
  coreBrainVersion: string;
  systemVersion: string;
  scenario: string;
  instanceType: "baseline" | "brain-powered" | "decoupled-control";
  baselineVersion: string;
  enabledModules: string[];
  seed: number;
}

export interface BehaviorMetrics {
  taskSuccess: number;
  routeEfficiency: number;
  adaptationRate: number;
  recoverySuccess: number;
  hesitationCount: number;
  explorationScore: number;
  threatAvoidance: number;
  coherenceScore: number;
}

export interface EmergenceMetrics {
  emergenceScore: number;
  noveltyScore: number;
  repeatedCoherentPatternCount: number;
  thoughtDiversity: number;
  usefulEmergenceCount: number;
  repeatedTemplateFraction: number;
  artifactProbability: number;
}

export interface EfficiencyMetrics {
  avgLatencyMs: number;
  maxLatencyMs: number;
  activeRegionFraction: number;
  sparseActivationRatio: number;
  eventDrivenUpdateRate: number;
  computeProxy: number;
  computePerSuccessfulTask: number;
  computePerUsefulBehaviorEvent: number;
}

export interface RegulationMetrics {
  autonomicBalanceStability: number;
  stressMagnitude: number;
  recoverySlope: number;
  interoceptiveVariance: number;
  selfStateCoherence: number;
}

export interface CoreTrace {
  dominantMode: string;
  salienceTarget: string;
  memoryState: string;
  actionTendency: string;
  conflictScore: number;
  uncertaintyScore: number;
  predictionErrorProfile: number[];
  bodyStateProfile: number[];
  pathwayChanges: string[];
}

export interface RunRecord {
  metadata: RunMetadata;
  behavior: BehaviorMetrics;
  emergence: EmergenceMetrics;
  efficiency: EfficiencyMetrics;
  regulation: RegulationMetrics;
  coreTrace: CoreTrace;
  artifactFlags: string[];
  replayReference?: string;
  stateTraceSnapshot?: Record<string, number>;
}

function avgFields<T>(records: T[]): T {
  if (records.length === 0) return {} as T;
  const result: Record<string, number> = {};
  const keys = Object.keys(records[0] as object);
  for (const k of keys) {
    const vals = records.map(
      (r) => ((r as Record<string, unknown>)[k] as number) ?? 0,
    );
    result[k] = vals.reduce((s, v) => s + v, 0) / records.length;
  }
  return result as unknown as T;
}

export class CoreBrainRecordSystem {
  private records: RunRecord[] = [];
  private maxRecords = 500;

  addRecord(record: RunRecord): void {
    this.records.push(record);
    if (this.records.length > this.maxRecords) {
      this.records = this.records.slice(-this.maxRecords);
    }
    this.saveToStorage();
  }

  getRecords(): RunRecord[] {
    return [...this.records];
  }

  getLatestTrace(): CoreTrace | null {
    return this.records.length > 0
      ? this.records[this.records.length - 1].coreTrace
      : null;
  }

  getByExperiment(experimentId: string): RunRecord[] {
    return this.records.filter((r) => r.metadata.experimentId === experimentId);
  }

  getStatsSummary(experimentId: string): {
    runCount: number;
    avgBehavior: BehaviorMetrics;
    avgEfficiency: EfficiencyMetrics;
    avgRegulation: RegulationMetrics;
    avgEmergence: EmergenceMetrics;
    bestRun: RunRecord | null;
    worstRun: RunRecord | null;
  } {
    const recs = this.getByExperiment(experimentId);
    if (recs.length === 0) {
      return {
        runCount: 0,
        avgBehavior: {} as BehaviorMetrics,
        avgEfficiency: {} as EfficiencyMetrics,
        avgRegulation: {} as RegulationMetrics,
        avgEmergence: {} as EmergenceMetrics,
        bestRun: null,
        worstRun: null,
      };
    }
    const sorted = [...recs].sort(
      (a, b) => a.behavior.taskSuccess - b.behavior.taskSuccess,
    );
    return {
      runCount: recs.length,
      avgBehavior: avgFields(
        recs.map((r) => r.behavior) as unknown as Record<string, number>[],
      ) as unknown as BehaviorMetrics,
      avgEfficiency: avgFields(
        recs.map((r) => r.efficiency) as unknown as Record<string, number>[],
      ) as unknown as EfficiencyMetrics,
      avgRegulation: avgFields(
        recs.map((r) => r.regulation) as unknown as Record<string, number>[],
      ) as unknown as RegulationMetrics,
      avgEmergence: avgFields(
        recs.map((r) => r.emergence) as unknown as Record<string, number>[],
      ) as unknown as EmergenceMetrics,
      bestRun: sorted[sorted.length - 1],
      worstRun: sorted[0],
    };
  }

  exportCSV(experimentId?: string): string {
    const recs = experimentId
      ? this.getByExperiment(experimentId)
      : this.records;
    if (recs.length === 0) return "";
    const headers = [
      "experimentId",
      "runId",
      "timestamp",
      "scenario",
      "instanceType",
      "seed",
      "taskSuccess",
      "routeEfficiency",
      "adaptationRate",
      "recoverySuccess",
      "hesitationCount",
      "explorationScore",
      "threatAvoidance",
      "coherenceScore",
      "emergenceScore",
      "noveltyScore",
      "thoughtDiversity",
      "usefulEmergenceCount",
      "artifactProbability",
      "avgLatencyMs",
      "activeRegionFraction",
      "sparseActivationRatio",
      "computeProxy",
      "autonomicBalanceStability",
      "stressMagnitude",
      "recoverySlope",
      "selfStateCoherence",
    ];
    const rows = recs.map((r) =>
      [
        r.metadata.experimentId,
        r.metadata.runId,
        r.metadata.timestamp,
        r.metadata.scenario,
        r.metadata.instanceType,
        r.metadata.seed,
        r.behavior.taskSuccess,
        r.behavior.routeEfficiency,
        r.behavior.adaptationRate,
        r.behavior.recoverySuccess,
        r.behavior.hesitationCount,
        r.behavior.explorationScore,
        r.behavior.threatAvoidance,
        r.behavior.coherenceScore,
        r.emergence.emergenceScore,
        r.emergence.noveltyScore,
        r.emergence.thoughtDiversity,
        r.emergence.usefulEmergenceCount,
        r.emergence.artifactProbability,
        r.efficiency.avgLatencyMs,
        r.efficiency.activeRegionFraction,
        r.efficiency.sparseActivationRatio,
        r.efficiency.computeProxy,
        r.regulation.autonomicBalanceStability,
        r.regulation.stressMagnitude,
        r.regulation.recoverySlope,
        r.regulation.selfStateCoherence,
      ].join(","),
    );
    return [headers.join(","), ...rows].join("\n");
  }

  private saveToStorage(): void {
    try {
      sessionStorage.setItem(
        "coreBrainRecords",
        JSON.stringify(this.records.slice(-100)),
      );
    } catch {
      /* quota exceeded, skip */
    }
  }

  loadFromStorage(): void {
    try {
      const stored = sessionStorage.getItem("coreBrainRecords");
      if (stored) this.records = JSON.parse(stored);
    } catch {
      /* corrupted, skip */
    }
  }

  clear(): void {
    this.records = [];
    sessionStorage.removeItem("coreBrainRecords");
  }
}

export const coreBrainRecordSystem = new CoreBrainRecordSystem();
