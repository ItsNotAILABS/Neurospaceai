var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { S as SCHEMA_VERSION } from "./index-CGYrnU7d.js";
class PathwayStrengthTracker {
  constructor() {
    __publicField(this, "pathways", /* @__PURE__ */ new Map());
  }
  registerPathway(source, target) {
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
        decayRate: 1e-3
      });
    }
    return id;
  }
  recordActivation(pathwayId, success) {
    const pw = this.pathways.get(pathwayId);
    if (!pw) return;
    pw.activations++;
    pw.lastActiveTs = Date.now();
    const delta = success ? 0.02 : -0.015;
    pw.strength = Math.min(1, Math.max(0.05, pw.strength + delta));
    pw.successRate = pw.successRate * 0.95 + (success ? 1 : 0) * 0.05;
  }
  applyDecay(dtMs) {
    for (const pw of this.pathways.values()) {
      const elapsed = (Date.now() - pw.lastActiveTs) / 1e3;
      pw.strength = Math.max(
        0.05,
        pw.strength - pw.decayRate * elapsed * 0.01 * dtMs
      );
    }
  }
  getStrength(source, target) {
    var _a;
    return ((_a = this.pathways.get(`pw_${source}_${target}`)) == null ? void 0 : _a.strength) ?? 0.5;
  }
  getAll() {
    return [...this.pathways.values()];
  }
  getMetrics() {
    const all = this.getAll();
    const avg = all.reduce((s, p) => s + p.strength, 0) / Math.max(1, all.length);
    return {
      totalPathways: all.length,
      avgStrength: avg,
      strongPathways: all.filter((p) => p.strength > 0.7).length,
      weakPathways: all.filter((p) => p.strength < 0.3).length
    };
  }
}
class MotifScorer {
  constructor() {
    __publicField(this, "motifs", /* @__PURE__ */ new Map());
  }
  registerMotif(id, type, isRequired = false) {
    this.motifs.set(id, {
      motifId: id,
      motifType: type,
      strength: 0.5,
      activationCount: 0,
      behavioralContribution: 0,
      isRequired,
      present: true
    });
  }
  recordMotifActivation(id, behavioralImpact) {
    const m = this.motifs.get(id);
    if (!m) return;
    m.activationCount++;
    m.behavioralContribution = m.behavioralContribution * 0.95 + behavioralImpact * 0.05;
    m.strength = Math.min(1, m.strength + behavioralImpact * 0.01);
  }
  getAll() {
    return [...this.motifs.values()];
  }
  getMissingRequired() {
    return this.getAll().filter((m) => m.isRequired && !m.present).map((m) => m.motifId);
  }
  getMetrics() {
    const all = this.getAll();
    const active = all.filter((m) => m.activationCount > 0);
    return {
      totalMotifs: all.length,
      activeMotifs: active.length,
      avgStrength: all.reduce((s, m) => s + m.strength, 0) / Math.max(1, all.length),
      missingRequired: this.getMissingRequired().length,
      avgBehavioralContribution: active.reduce((s, m) => s + m.behavioralContribution, 0) / Math.max(1, active.length)
    };
  }
}
class ThresholdAdaptationEngine {
  constructor(initial = {}) {
    __publicField(this, "state");
    this.state = {
      thresholds: {
        action_commit: 0.5,
        memory_encode: 0.4,
        salience_admit: 0.35,
        prediction_update: 0.3,
        regulation_escalate: 0.6,
        recovery_trigger: 0.7,
        ...initial
      },
      adaptationHistory: [],
      totalAdaptations: 0,
      avgAdaptationMagnitude: 0
    };
  }
  adapt(predictionError, success, regulationLoad) {
    const keys = Object.keys(this.state.thresholds);
    const learningRate = 0.03 + predictionError * 0.04;
    for (const key of keys) {
      const current = this.state.thresholds[key];
      let delta = 0;
      if (key === "action_commit") {
        delta = success ? -learningRate * 0.5 : learningRate * regulationLoad;
      } else if (key === "memory_encode") {
        delta = predictionError > 0.3 ? -learningRate : learningRate * 0.3;
      } else if (key === "salience_admit") {
        delta = regulationLoad > 0.7 ? learningRate * 0.4 : -learningRate * 0.2;
      } else if (key === "regulation_escalate") {
        delta = success ? learningRate * 0.3 : -learningRate * 0.5;
      } else {
        delta = success ? -learningRate * 0.2 : learningRate * 0.2;
      }
      const newVal = Math.min(0.95, Math.max(0.05, current + delta));
      this.state.thresholds[key] = newVal;
      this.state.adaptationHistory.push({
        key,
        delta,
        ts: Date.now()
      });
    }
    if (this.state.adaptationHistory.length > 1e3) {
      this.state.adaptationHistory = this.state.adaptationHistory.slice(-500);
    }
    this.state.totalAdaptations++;
    const recent = this.state.adaptationHistory.slice(-50);
    this.state.avgAdaptationMagnitude = recent.reduce((s, r) => s + Math.abs(r.delta), 0) / Math.max(1, recent.length);
  }
  get(key) {
    return this.state.thresholds[key] ?? 0.5;
  }
  getState() {
    return { ...this.state, thresholds: { ...this.state.thresholds } };
  }
  getMetrics() {
    const baseline = 0.5;
    const drift = Object.values(this.state.thresholds).reduce(
      (s, v) => s + Math.abs(v - baseline),
      0
    ) / Math.max(1, Object.values(this.state.thresholds).length);
    return {
      totalAdaptations: this.state.totalAdaptations,
      avgMagnitude: this.state.avgAdaptationMagnitude,
      thresholds: { ...this.state.thresholds },
      driftFromBaseline: drift
    };
  }
}
class TrustOrderingUpdater {
  constructor() {
    __publicField(this, "trust", {});
    __publicField(this, "updateCount", 0);
  }
  initialize(sources, baseValue = 0.5) {
    for (const s of sources) {
      if (this.trust[s] === void 0) this.trust[s] = baseValue;
    }
  }
  update(sourceId, wasUseful, magnitude = 0.05) {
    const current = this.trust[sourceId] ?? 0.5;
    const delta = wasUseful ? magnitude : -magnitude * 0.7;
    this.trust[sourceId] = Math.min(0.95, Math.max(0.05, current + delta));
    this.updateCount++;
  }
  getTrustOrdering() {
    return { ...this.trust };
  }
  getRanked() {
    return Object.entries(this.trust).sort((a, b) => b[1] - a[1]).map(([source, trust]) => ({ source, trust }));
  }
  applyToLearningState(learning) {
    return {
      ...learning,
      trustOrdering: { ...this.trust }
    };
  }
  getMetrics() {
    const vals = Object.values(this.trust);
    return {
      totalSources: vals.length,
      updateCount: this.updateCount,
      highTrustCount: vals.filter((v) => v > 0.7).length,
      lowTrustCount: vals.filter((v) => v < 0.3).length,
      avgTrust: vals.reduce((s, v) => s + v, 0) / Math.max(1, vals.length)
    };
  }
}
const globalPathwayTracker = new PathwayStrengthTracker();
const globalMotifScorer = new MotifScorer();
new ThresholdAdaptationEngine();
const globalTrustOrdering = new TrustOrderingUpdater();
const REQUIRED_MOTIFS = [
  { id: "mot_recurrent_loop", type: "recurrent_loop" },
  { id: "mot_inhibitory_comp", type: "inhibitory_competition" },
  { id: "mot_excitatory_relay", type: "excitatory_relay" },
  { id: "mot_mem_salience_bridge", type: "memory_salience_bridge" },
  { id: "mot_reg_threshold_bridge", type: "regulation_threshold_bridge" },
  { id: "mot_cross_timescale", type: "cross_timescale_bridge" },
  { id: "mot_modulatory_broadcast", type: "modulatory_broadcast" },
  { id: "mot_prediction_error_route", type: "prediction_error_route" }
];
for (const m of REQUIRED_MOTIFS) {
  globalMotifScorer.registerMotif(m.id, m.type, true);
}
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
  "sensory_coupling"
]);
const REQUIRED_PATHWAYS = [
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
  ["regulation", "threshold_shifts"]
];
for (const [src, tgt] of REQUIRED_PATHWAYS) {
  globalPathwayTracker.registerPathway(src, tgt);
}
const circuitPlasticityModules = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MotifScorer,
  PathwayStrengthTracker,
  ThresholdAdaptationEngine,
  TrustOrderingUpdater,
  globalMotifScorer,
  globalPathwayTracker,
  globalTrustOrdering
}, Symbol.toStringTag, { value: "Module" }));
function computeInteroceptiveState(inputs) {
  const clamp = (v) => Math.max(0, Math.min(1, v));
  const s = clamp(inputs.rawStress);
  const f = clamp(inputs.rawFatigue);
  const u = clamp(inputs.rawUrgency);
  return {
    schemaVersion: SCHEMA_VERSION,
    stressSignal: s,
    recoverySignal: clamp(1 - s * 0.7 - f * 0.3),
    fatigueLoad: f,
    urgencyPressure: u,
    stabilityPressure: clamp(1 - u),
    overloadLevel: clamp((s + f + u) / 3),
    confidencePressure: clamp(inputs.rawConfidence),
    selfStateWeight: clamp(s * 0.4 + f * 0.3 + u * 0.3),
    interoceptiveCoherence: clamp(1 - Math.abs(s - f) * 0.5)
  };
}
function computeCardioState(interoceptive, exertion) {
  const hr = 60 + exertion * 80 + interoceptive.stressSignal * 40;
  const hrv = Math.max(5, 80 - exertion * 50 - interoceptive.stressSignal * 30);
  const sustainedEffort = Math.min(
    1,
    (exertion + interoceptive.fatigueLoad) / 2
  );
  const collapseRisk = Math.max(
    0,
    (interoceptive.fatigueLoad - 0.7) * 2 + (exertion - 0.8) * 1.5
  );
  return {
    schemaVersion: SCHEMA_VERSION,
    heartRateProxy: hr,
    hrvProxy: hrv,
    circulationPressureProxy: Math.min(1, (hr - 60) / 120),
    recoveryCapacityProxy: Math.max(0, 1 - interoceptive.fatigueLoad),
    sustainedEffortIndex: sustainedEffort,
    exertionBurden: Math.min(1, exertion),
    cardioStabilityIndex: Math.max(0, 1 - collapseRisk * 0.5),
    collapseRiskProxy: Math.max(0, Math.min(1, collapseRisk))
  };
}
function computeANSState(cardio, interoceptive) {
  const sym = Math.min(
    1,
    interoceptive.stressSignal * 0.6 + interoceptive.urgencyPressure * 0.4
  );
  const para = Math.min(
    1,
    interoceptive.recoverySignal * 0.7 + cardio.recoveryCapacityProxy * 0.3
  );
  const balance = sym - para;
  let arousal = "calm";
  if (sym > 0.8) arousal = "overloaded";
  else if (sym > 0.55) arousal = "reactive";
  else if (sym > 0.3) arousal = "alert";
  return {
    schemaVersion: SCHEMA_VERSION,
    sympatheticTone: sym,
    parasympatheticTone: para,
    autonomicBalanceIndex: balance,
    arousalMode: arousal,
    threatThresholdModifier: 1 - sym * 0.4,
    reactionSpeedModifier: 1 + sym * 0.5 - interoceptive.fatigueLoad * 0.3,
    recoveryTransitionState: interoceptive.recoverySignal > 0.6 ? "recovering" : interoceptive.stressSignal > 0.7 ? "transitioning" : "normal"
  };
}
export {
  computeCardioState as a,
  computeANSState as b,
  computeInteroceptiveState as c,
  globalPathwayTracker as d,
  circuitPlasticityModules as e,
  globalMotifScorer as g
};
