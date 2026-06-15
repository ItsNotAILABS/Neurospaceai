import type { EnergyComputeState } from "./coreBrainSchemas";
import { SCHEMA_VERSION } from "./coreBrainSchemas";

export class SparseComputeController {
  private localUpdates = 0;
  private broadUpdates = 0;
  private escalationCount = 0;
  private activeRegions = 0;
  private totalRegions = 246;
  private decisions = 0;
  private usefulBehaviors = 0;

  shouldBroadUpdate(
    salience: number,
    conflict: number,
    surprise: number,
  ): boolean {
    const justified = salience > 0.6 || conflict > 0.5 || surprise > 0.4;
    if (justified) this.broadUpdates++;
    else this.localUpdates++;
    return justified;
  }

  recordLocalUpdate(): void {
    this.localUpdates++;
  }
  recordBroadUpdate(): void {
    this.broadUpdates++;
    this.escalationCount++;
  }
  recordDecision(): void {
    this.decisions++;
  }
  recordUsefulBehavior(): void {
    this.usefulBehaviors++;
  }
  setActiveRegions(n: number): void {
    this.activeRegions = n;
  }

  getMetrics(): EnergyComputeState {
    const total = this.localUpdates + this.broadUpdates;
    return {
      schemaVersion: SCHEMA_VERSION,
      activeRegionFraction: this.activeRegions / this.totalRegions,
      sparseActivationRatio: total > 0 ? this.localUpdates / total : 1,
      eventQueueDepth: 0,
      localUpdateRate: this.localUpdates,
      broadUpdateRate: this.broadUpdates,
      computePressure: Math.min(1, this.broadUpdates / Math.max(1, total)),
      overloadEscalationCount: this.escalationCount,
      computePerDecision: this.decisions > 0 ? total / this.decisions : 0,
      computePerUsefulBehavior:
        this.usefulBehaviors > 0 ? total / this.usefulBehaviors : 0,
    };
  }
}

type MetricValue = number;

export class TelemetryIngest {
  private store: Map<string, Map<string, MetricValue[]>> = new Map();

  record(subsystem: string, metric: string, value: MetricValue): void {
    if (!this.store.has(subsystem)) this.store.set(subsystem, new Map());
    const sub = this.store.get(subsystem)!;
    if (!sub.has(metric)) sub.set(metric, []);
    const arr = sub.get(metric)!;
    arr.push(value);
    if (arr.length > 200) arr.shift();
  }

  getLatest(subsystem: string, metric: string): number {
    return this.store.get(subsystem)?.get(metric)?.at(-1) ?? 0;
  }

  getSnapshot(): Record<string, Record<string, number>> {
    const result: Record<string, Record<string, number>> = {};
    for (const [sub, metrics] of this.store.entries()) {
      result[sub] = {};
      for (const [m, vals] of metrics.entries()) {
        result[sub][m] = vals.at(-1) ?? 0;
      }
    }
    return result;
  }

  getHealthMetrics() {
    return this._sumSection("health");
  }
  getRegulationMetrics() {
    return this._sumSection("regulation");
  }
  getConnectionMetrics() {
    return this._sumSection("connections");
  }
  getMemoryMetrics() {
    return this._sumSection("memory");
  }
  getPredictionMetrics() {
    return this._sumSection("prediction");
  }
  getLearningMetrics() {
    return this._sumSection("learning");
  }
  getEfficiencyMetrics() {
    return this._sumSection("efficiency");
  }
  getEmergenceMetrics() {
    return this._sumSection("emergence");
  }
  getFailureMetrics() {
    return this._sumSection("failures");
  }

  private _sumSection(subsystem: string): Record<string, number> {
    const sub = this.store.get(subsystem);
    if (!sub) return {};
    const result: Record<string, number> = {};
    for (const [m, vals] of sub.entries()) {
      result[m] = vals.at(-1) ?? 0;
    }
    return result;
  }
}

export const globalTelemetry = new TelemetryIngest();
export const globalSparseCompute = new SparseComputeController();
