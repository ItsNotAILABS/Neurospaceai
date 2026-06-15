var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
function avgFields(records) {
  if (records.length === 0) return {};
  const result = {};
  const keys = Object.keys(records[0]);
  for (const k of keys) {
    const vals = records.map(
      (r) => r[k] ?? 0
    );
    result[k] = vals.reduce((s, v) => s + v, 0) / records.length;
  }
  return result;
}
class CoreBrainRecordSystem {
  constructor() {
    __publicField(this, "records", []);
    __publicField(this, "maxRecords", 500);
  }
  addRecord(record) {
    this.records.push(record);
    if (this.records.length > this.maxRecords) {
      this.records = this.records.slice(-this.maxRecords);
    }
    this.saveToStorage();
  }
  getRecords() {
    return [...this.records];
  }
  getLatestTrace() {
    return this.records.length > 0 ? this.records[this.records.length - 1].coreTrace : null;
  }
  getByExperiment(experimentId) {
    return this.records.filter((r) => r.metadata.experimentId === experimentId);
  }
  getStatsSummary(experimentId) {
    const recs = this.getByExperiment(experimentId);
    if (recs.length === 0) {
      return {
        runCount: 0,
        avgBehavior: {},
        avgEfficiency: {},
        avgRegulation: {},
        avgEmergence: {},
        bestRun: null,
        worstRun: null
      };
    }
    const sorted = [...recs].sort(
      (a, b) => a.behavior.taskSuccess - b.behavior.taskSuccess
    );
    return {
      runCount: recs.length,
      avgBehavior: avgFields(
        recs.map((r) => r.behavior)
      ),
      avgEfficiency: avgFields(
        recs.map((r) => r.efficiency)
      ),
      avgRegulation: avgFields(
        recs.map((r) => r.regulation)
      ),
      avgEmergence: avgFields(
        recs.map((r) => r.emergence)
      ),
      bestRun: sorted[sorted.length - 1],
      worstRun: sorted[0]
    };
  }
  exportCSV(experimentId) {
    const recs = experimentId ? this.getByExperiment(experimentId) : this.records;
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
      "selfStateCoherence"
    ];
    const rows = recs.map(
      (r) => [
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
        r.regulation.selfStateCoherence
      ].join(",")
    );
    return [headers.join(","), ...rows].join("\n");
  }
  saveToStorage() {
    try {
      sessionStorage.setItem(
        "coreBrainRecords",
        JSON.stringify(this.records.slice(-100))
      );
    } catch {
    }
  }
  loadFromStorage() {
    try {
      const stored = sessionStorage.getItem("coreBrainRecords");
      if (stored) this.records = JSON.parse(stored);
    } catch {
    }
  }
  clear() {
    this.records = [];
    sessionStorage.removeItem("coreBrainRecords");
  }
}
const coreBrainRecordSystem = new CoreBrainRecordSystem();
export {
  coreBrainRecordSystem as c
};
