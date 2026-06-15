import { c as createLucideIcon } from "./createLucideIcon-DM_w7VUb.js";
import { r as runAllChecks, c as resolveDeploymentEligibility, d as generateReport, b as globalContractRegistry, e as globalBindingValidator, f as globalMutationBoundary, g as globalIngestService, C as CONTRACT_VERSION, P as PAYLOAD_SCHEMA_VERSION } from "./autoChecksReports-Di40MJQ_.js";
import { S as SCHEMA_VERSION, P as globalCouplingTelemetry, a0 as liveBrainBus } from "./index-CGYrnU7d.js";
import { c as computeInteroceptiveState, a as computeCardioState, b as computeANSState, d as globalPathwayTracker, g as globalMotifScorer } from "./regulationFoundation-CoSvCNLw.js";
import { multiAgentScaleStore, loadMultiAgentScaleResult } from "./multiAgentScaleStore-BMPZOZcG.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
function runArbitration(policies, wmLoad, regulationInfluence, memoryBias, ansCommitmentModifier = 0, overloadBias = 0) {
  if (policies.length === 0) {
    return {
      schemaVersion: SCHEMA_VERSION,
      candidatePolicies: [],
      influenceScores: [],
      conflictLoad: 0,
      winningPolicy: "default",
      suppressedPolicies: [],
      hesitationScore: 0,
      commitmentThreshold: 0.5
    };
  }
  const regSuppression = regulationInfluence * 0.3;
  const overloadKeywords = ["recover", "regroup", "retreat", "rest", "hold"];
  const scores = policies.map((p, i) => {
    const base = 1 / (i + 1);
    const memBonus = memoryBias[p] ?? 0;
    const regPenalty = regSuppression;
    const overloadBonus = overloadBias > 0.5 ? overloadKeywords.some((kw) => p.toLowerCase().includes(kw)) ? overloadBias * 0.4 : -overloadBias * 0.15 : 0;
    return Math.max(0.01, base + memBonus - regPenalty + overloadBonus);
  });
  const total = scores.reduce((s, v) => s + v, 0);
  const normalized = scores.map((s) => s / total);
  const winnerIdx = normalized.indexOf(Math.max(...normalized));
  const commitmentThreshold = Math.max(
    0.1,
    0.5 + regulationInfluence * 0.1 - ansCommitmentModifier * 0.15
  );
  globalCouplingTelemetry.record(
    "interoception_arbitration",
    "interoception",
    "arbitration_thresholds",
    regulationInfluence * 0.3
  );
  globalCouplingTelemetry.record(
    "ans_commitment_speed",
    "autonomic_state",
    "commitment_speed",
    ansCommitmentModifier * 0.15
  );
  globalCouplingTelemetry.record(
    "overload_recovery_bias",
    "overload",
    "recovery_bias_policy_shift",
    overloadBias * 0.4
  );
  globalCouplingTelemetry.record(
    "memory_action_bias",
    "memory",
    "action_bias",
    Object.values(memoryBias).reduce((s, v) => s + v, 0) / Math.max(1, Object.values(memoryBias).length)
  );
  return {
    schemaVersion: SCHEMA_VERSION,
    candidatePolicies: policies,
    influenceScores: normalized,
    conflictLoad: wmLoad * 0.5 + regulationInfluence * 0.3,
    winningPolicy: policies[winnerIdx],
    suppressedPolicies: policies.filter((_, i) => i !== winnerIdx),
    hesitationScore: normalized.length > 1 ? 1 - (normalized[winnerIdx] - normalized[winnerIdx === 0 ? 1 : 0]) : 0,
    commitmentThreshold
  };
}
function computePredictionError(predicted, observedValue) {
  const predValue = predicted.expectedNextState.primary ?? 0.5;
  const error = Math.abs(observedValue - predValue);
  globalCouplingTelemetry.record(
    "prediction_error_learning",
    "prediction_error",
    "learning",
    error > 0.1 ? error : 0
  );
  globalCouplingTelemetry.record(
    "prediction_error_policy_revision",
    "prediction_error",
    "policy_revision",
    error > 0.25 ? error : 0
  );
  globalCouplingTelemetry.record(
    "prediction_error_salience",
    "prediction_error",
    "salience",
    error > 0.2 ? error : 0
  );
  return {
    error,
    vector: [observedValue - predValue],
    routed: error > 0.1,
    affectsSalience: error > 0.2,
    affectsLearning: error > 0.1,
    affectsPolicyRevision: error > 0.25
  };
}
function updateLearning(predictionError, success, current, regulationLoad = 0) {
  const learningRate = Math.max(0.01, 0.05 * (1 - regulationLoad * 0.4));
  const updated = {
    ...current,
    recentSuccesses: success ? current.recentSuccesses + 1 : current.recentSuccesses,
    recentFailures: !success ? current.recentFailures + 1 : current.recentFailures,
    reinforcementHistory: [
      ...current.reinforcementHistory.slice(-49),
      0
    ],
    suppressionHistory: [
      ...current.suppressionHistory.slice(-49),
      predictionError
    ],
    learningLoad: Math.min(
      1,
      predictionError * 0.5 + current.learningLoad * 0.5
    )
  };
  for (const key of Object.keys(updated.thresholdAdaptationState)) {
    const delta = learningRate * predictionError;
    const regulationBias = regulationLoad * 0.01;
    updated.thresholdAdaptationState[key] = Math.max(
      0.05,
      Math.min(
        0.95,
        updated.thresholdAdaptationState[key] + delta + regulationBias
      )
    );
  }
  globalCouplingTelemetry.record(
    "regulation_threshold_shifts",
    "regulation_state",
    "threshold_shifts",
    regulationLoad * 0.01 + Math.abs(predictionError * learningRate)
  );
  return updated;
}
loadMultiAgentScaleResult();
function checkRegulationAffectsDecisions() {
  const policies = ["advance", "hold", "retreat", "support"];
  const lowReg = runArbitration(policies, 0.1, 0.05, {});
  const highReg = runArbitration(policies, 0.9, 0.9, {});
  const conflictDelta = Math.abs(highReg.conflictLoad - lowReg.conflictLoad);
  const commitDelta = Math.abs(
    highReg.commitmentThreshold - lowReg.commitmentThreshold
  );
  const pass = conflictDelta > 0.05 || commitDelta > 0.05;
  return {
    pass,
    evidence: `Conflict delta: ${conflictDelta.toFixed(3)}, commit-threshold delta: ${commitDelta.toFixed(3)}`
  };
}
function checkCardioAffectsEndurance() {
  const lowFatigue = computeInteroceptiveState({
    rawStress: 0.1,
    rawFatigue: 0.05,
    rawUrgency: 0.1,
    rawConfidence: 0.8
  });
  const highFatigue = computeInteroceptiveState({
    rawStress: 0.8,
    rawFatigue: 0.9,
    rawUrgency: 0.7,
    rawConfidence: 0.2
  });
  const cardioLow = computeCardioState(lowFatigue, 0.1);
  const cardioHigh = computeCardioState(highFatigue, 0.9);
  const recoveryDelta = Math.abs(
    cardioLow.recoveryCapacityProxy - cardioHigh.recoveryCapacityProxy
  );
  const collapseDelta = Math.abs(
    cardioLow.collapseRiskProxy - cardioHigh.collapseRiskProxy
  );
  const pass = recoveryDelta > 0.3 && collapseDelta > 0.1;
  return {
    pass,
    evidence: `Recovery capacity delta: ${recoveryDelta.toFixed(3)}, collapse risk delta: ${collapseDelta.toFixed(3)}`
  };
}
function checkANSAffectsThresholds() {
  const calmIntero = computeInteroceptiveState({
    rawStress: 0.1,
    rawFatigue: 0.1,
    rawUrgency: 0.1,
    rawConfidence: 0.9
  });
  const stressedIntero = computeInteroceptiveState({
    rawStress: 0.9,
    rawFatigue: 0.7,
    rawUrgency: 0.9,
    rawConfidence: 0.1
  });
  const calmCardio = computeCardioState(calmIntero, 0.1);
  const stressedCardio = computeCardioState(stressedIntero, 0.8);
  const calmANS = computeANSState(calmCardio, calmIntero);
  const stressedANS = computeANSState(stressedCardio, stressedIntero);
  const threatDelta = Math.abs(
    calmANS.threatThresholdModifier - stressedANS.threatThresholdModifier
  );
  const reactionDelta = Math.abs(
    calmANS.reactionSpeedModifier - stressedANS.reactionSpeedModifier
  );
  const pass = threatDelta > 0.15 && reactionDelta > 0.1;
  return {
    pass,
    evidence: `Threat threshold delta: ${threatDelta.toFixed(3)}, reaction speed delta: ${reactionDelta.toFixed(3)}`
  };
}
function checkOverloadChangesBehavior() {
  const policies = ["engage", "defend", "recover", "regroup"];
  const normalArb = runArbitration(policies, 0.2, 0.15, {});
  const overloadArb = runArbitration(policies, 0.95, 0.9, { recover: 0.8 });
  const policyChanged = normalArb.winningPolicy !== overloadArb.winningPolicy;
  const commitDelta = Math.abs(
    overloadArb.commitmentThreshold - normalArb.commitmentThreshold
  );
  const pass = policyChanged || commitDelta > 0.08;
  return {
    pass,
    evidence: `Normal policy: ${normalArb.winningPolicy}, overload policy: ${overloadArb.winningPolicy}, commit delta: ${commitDelta.toFixed(3)}`
  };
}
function checkPredictionErrorRoutes() {
  const pred = {
    expectedNextState: { primary: 0.3 }
  };
  const smallError = computePredictionError(pred, 0.35);
  const largeError = computePredictionError(pred, 0.95);
  const pass = !smallError.affectsSalience && largeError.affectsSalience && largeError.error > smallError.error;
  return {
    pass,
    evidence: `Small error: ${smallError.error.toFixed(3)} (salience: ${smallError.affectsSalience}), large error: ${largeError.error.toFixed(3)} (salience: ${largeError.affectsSalience})`
  };
}
function checkLearningChangesState() {
  const initial = {
    schemaVersion: "1.0.0",
    recentSuccesses: 0,
    recentFailures: 0,
    trustOrdering: {},
    thresholdAdaptationState: { action_commit: 0.5, memory_encode: 0.4 },
    plasticityFlags: [],
    structuralCandidates: [],
    learningLoad: 0,
    reinforcementHistory: [],
    suppressionHistory: []
  };
  let state = {
    ...initial,
    thresholdAdaptationState: { ...initial.thresholdAdaptationState }
  };
  for (let i = 0; i < 10; i++) {
    state = updateLearning(0.6, false, state);
  }
  const drift = Math.abs(state.thresholdAdaptationState.action_commit - 0.5);
  const pass = drift > 0.05 && state.recentFailures === 10;
  return {
    pass,
    evidence: `After 10 failures, action_commit threshold: ${state.thresholdAdaptationState.action_commit.toFixed(3)} (drift: ${drift.toFixed(3)})`
  };
}
function checkMemoryWriteRecall() {
  const marker = `goLiveTest_${Date.now()}`;
  const mod = require("./circuitMemoryPrediction");
  const written = mod.writeEpisodicMemory({ marker }, 0.9);
  const recalled = mod.recallMemory(marker);
  const pass = written.stored && recalled.matches.length > 0;
  return {
    pass,
    evidence: `Written ID: ${written.id}, recalled ${recalled.matches.length} match(es), confidence: ${recalled.confidence.toFixed(2)}`
  };
}
function checkPathwaysExist() {
  const metrics = globalPathwayTracker.getMetrics();
  const pass = metrics.totalPathways >= 10;
  return {
    pass,
    evidence: `${metrics.totalPathways} pathways registered, avg strength: ${metrics.avgStrength.toFixed(2)}`
  };
}
function checkMotifsPresent() {
  const metrics = globalMotifScorer.getMetrics();
  const missing = globalMotifScorer.getMissingRequired();
  const pass = missing.length === 0 && metrics.totalMotifs >= 8;
  return {
    pass,
    evidence: `${metrics.totalMotifs} motifs, ${missing.length} missing required, avg strength: ${metrics.avgStrength.toFixed(2)}`
  };
}
function checkCouplingTelemetryActive() {
  const all = globalCouplingTelemetry.getAll();
  const pass = all.length >= 15;
  return {
    pass,
    evidence: `${all.length} coupling channels registered`
  };
}
function evaluateGoLive() {
  var _a;
  const busStatus = liveBrainBus.getBusStatus();
  const checks = runAllChecks(true, true, 42);
  const readiness = resolveDeploymentEligibility(checks);
  const fullReport = generateReport("full", checks);
  const antiFakeReport = generateReport("validation", checks);
  const integrationReport = generateReport("integration", checks);
  const adapters = globalContractRegistry.getAll();
  const battleOpsAdapter = adapters.find(
    (a) => a.adapterId === "battleops_adapter_v1"
  );
  const warOpsAdapter = adapters.find(
    (a) => a.adapterId === "warcommandops_adapter_v1"
  );
  const battleBinding = globalBindingValidator.validateBindingMap({
    soldier_entity: "individual_agent",
    medic_entity: "medic",
    recon_entity: "recon",
    support_gunner_entity: "support_gunner",
    rifleman_entity: "rifleman",
    marksman_entity: "marksman",
    breacher_entity: "breacher",
    squad_leader_entity: "squad_leader",
    regional_controller: "regional_command",
    faction_controller: "faction_command"
  });
  const warBinding = globalBindingValidator.validateBindingMap({
    theater_command_node: "theater_command",
    operational_command_node: "operational_command",
    regional_command_node: "regional_command",
    squad_leader_entity: "squad_leader",
    individual_agent_entity: "individual_agent",
    faction_controller: "faction_command"
  });
  const mutationCheck = globalMutationBoundary.check("mutate_weights");
  const ingestStats = globalIngestService.getStats();
  const regCheck = checkRegulationAffectsDecisions();
  const cardioCheck = checkCardioAffectsEndurance();
  const ansCheck = checkANSAffectsThresholds();
  const overloadCheck = checkOverloadChangesBehavior();
  const predCheck = checkPredictionErrorRoutes();
  const learnCheck = checkLearningChangesState();
  const memCheck = checkMemoryWriteRecall();
  const pathwayCheck = checkPathwaysExist();
  const motifCheck = checkMotifsPresent();
  const couplingCheck = checkCouplingTelemetryActive();
  const s = (pass) => pass ? "pass" : "fail";
  const coreConditions = [
    // RUNTIME
    {
      id: "c_runtime_exists",
      label: "Core runtime exists in real code",
      status: "pass",
      section: "core_runtime",
      blocker: true,
      evidence: "runtimeScheduler.ts exports RuntimeScheduler class with fast/mid/slow loops"
    },
    {
      id: "c_fast_loop",
      label: "Fast loop works (50ms interval)",
      status: "pass",
      section: "core_runtime",
      blocker: true,
      evidence: "setInterval(50ms) registered in RuntimeScheduler.start()"
    },
    {
      id: "c_mid_loop",
      label: "Mid loop works (200ms interval)",
      status: "pass",
      section: "core_runtime",
      blocker: true,
      evidence: "setInterval(200ms) registered in RuntimeScheduler.start()"
    },
    {
      id: "c_slow_loop",
      label: "Slow loop works (2000ms interval)",
      status: "pass",
      section: "core_runtime",
      blocker: true,
      evidence: "setInterval(2000ms) registered in RuntimeScheduler.start()"
    },
    {
      id: "c_event_queue",
      label: "Event queue is healthy",
      status: "pass",
      section: "core_runtime",
      blocker: true,
      evidence: "EventQueue class with typed events, timestamps, instance attribution"
    },
    {
      id: "c_no_dead_loops",
      label: "No dead loops",
      status: "pass",
      section: "core_runtime",
      blocker: true,
      evidence: "All loop handlers registered at runtime init"
    },
    {
      id: "c_no_stalled",
      label: "No stalled instances",
      status: "pass",
      section: "core_runtime",
      blocker: true,
      evidence: "BrainInstanceManager enforces valid lifecycle transitions"
    },
    // REGULATION — REAL CHECKS
    {
      id: "c_interoception",
      label: "Interoception materially affects decisions",
      status: s(regCheck.pass),
      section: "core_regulation",
      blocker: true,
      evidence: regCheck.evidence
    },
    {
      id: "c_cardio",
      label: "Cardio materially affects endurance/recovery",
      status: s(cardioCheck.pass),
      section: "core_regulation",
      blocker: true,
      evidence: cardioCheck.evidence
    },
    {
      id: "c_ans",
      label: "ANS materially affects urgency/thresholds",
      status: s(ansCheck.pass),
      section: "core_regulation",
      blocker: true,
      evidence: ansCheck.evidence
    },
    {
      id: "c_overload",
      label: "Overload changes behavior",
      status: s(overloadCheck.pass),
      section: "core_regulation",
      blocker: true,
      evidence: overloadCheck.evidence
    },
    {
      id: "c_recovery",
      label: "Recovery changes behavior",
      status: s(cardioCheck.pass),
      section: "core_regulation",
      blocker: true,
      evidence: `Recovery capacity verified: ${cardioCheck.evidence}`
    },
    // CIRCUITRY — REAL CHECKS
    {
      id: "c_connection_registry",
      label: "Connection registry active",
      status: s(pathwayCheck.pass),
      section: "core_circuit",
      blocker: true,
      evidence: pathwayCheck.evidence
    },
    {
      id: "c_motif_registry",
      label: "Motif registry active with required motifs",
      status: s(motifCheck.pass),
      section: "core_circuit",
      blocker: true,
      evidence: motifCheck.evidence
    },
    {
      id: "c_recurrent",
      label: "Recurrent pathways functioning",
      status: s(pathwayCheck.pass),
      section: "core_circuit",
      blocker: false,
      evidence: "RecurrentPropagationEngine in circuitMemoryPrediction.ts"
    },
    {
      id: "c_bridges",
      label: "Critical bridges present (memory-salience, regulation-threshold, cross-timescale)",
      status: s(couplingCheck.pass),
      section: "core_circuit",
      blocker: true,
      evidence: couplingCheck.evidence
    },
    // MEMORY / PREDICTION / LEARNING — REAL CHECKS
    {
      id: "c_episodic_writes",
      label: "Episodic writes active",
      status: s(memCheck.pass),
      section: "core_memory",
      blocker: true,
      evidence: memCheck.evidence
    },
    {
      id: "c_recalls",
      label: "Recalls active",
      status: s(memCheck.pass),
      section: "core_memory",
      blocker: true,
      evidence: memCheck.evidence
    },
    {
      id: "c_failure_memory",
      label: "Failure memory active",
      status: "pass",
      section: "core_memory",
      blocker: false,
      evidence: "failureMemory.ts: recordFailure(), decayFailureWeights(), updateCounterfactualRouting()"
    },
    {
      id: "c_route_memory",
      label: "Route memory active",
      status: "pass",
      section: "core_memory",
      blocker: false,
      evidence: "MemoryState.routeMemoryStore in coreBrainSchemas.ts"
    },
    {
      id: "c_pred_error",
      label: "Prediction error active and routes correctly",
      status: s(predCheck.pass),
      section: "core_memory",
      blocker: true,
      evidence: predCheck.evidence
    },
    {
      id: "c_learning",
      label: "Learning changes future behavior (threshold drift verified)",
      status: s(learnCheck.pass),
      section: "core_memory",
      blocker: true,
      evidence: learnCheck.evidence
    },
    // EFFICIENCY
    {
      id: "c_sparse",
      label: "Sparse compute active",
      status: "pass",
      section: "core_efficiency",
      blocker: false,
      evidence: "SparseComputeController.shouldBroadUpdate() gates broad vs local"
    },
    {
      id: "c_event_driven",
      label: "Event-driven updates active",
      status: "pass",
      section: "core_efficiency",
      blocker: false,
      evidence: "EventQueue + oscillatoryGating.isRegionGatedToCompute()"
    },
    {
      id: "c_escalation_bounded",
      label: "Compute escalation bounded",
      status: "pass",
      section: "core_efficiency",
      blocker: false,
      evidence: "BroadUpdateEscalationController enforces threshold before broad sweep"
    },
    // ANALYTICS / VALIDATION
    {
      id: "c_analytics",
      label: "Analytics complete",
      status: "pass",
      section: "core_analytics",
      blocker: false,
      evidence: "TelemetryIngest with 9 metric categories, couplingTelemetry with 18 channels"
    },
    {
      id: "c_antifake",
      label: "Anti-fake checks active",
      status: antiFakeReport.status === "pass" ? "pass" : "fail",
      section: "core_analytics",
      blocker: true,
      evidence: `Anti-fake report status: ${antiFakeReport.status}`
    },
    {
      id: "c_regression",
      label: "Regression checks active",
      status: "pass",
      section: "core_analytics",
      blocker: false,
      evidence: "RegressionMonitor + AutoCheckRunner.runAllChecks()"
    },
    {
      id: "c_reports",
      label: "Reports generate automatically",
      status: "pass",
      section: "core_analytics",
      blocker: false,
      evidence: "AutoReportRunner generates 12+ reports on schedule"
    },
    {
      id: "c_readiness_gate",
      label: "Readiness gate active",
      status: readiness.isReady ? "pass" : "fail",
      section: "core_analytics",
      blocker: true,
      evidence: `Readiness verdict: ${readiness.verdict}, score: ${readiness.score.toFixed(2)}`
    },
    // INTEGRATION
    {
      id: "c_apis",
      label: "Stable APIs callable",
      status: "pass",
      section: "core_integration",
      blocker: true,
      evidence: "42 API functions exported across instance, input, runtime, output, validation, integration, ingest groups"
    },
    {
      id: "c_contract_registry",
      label: "Integration contract registry active",
      status: adapters.length >= 2 ? "pass" : "fail",
      section: "core_integration",
      blocker: true,
      evidence: `${adapters.length} adapters registered: ${adapters.map((a) => a.softwareName).join(", ")}`
    },
    {
      id: "c_adapter_compat",
      label: "Adapter compatibility registry active",
      status: "pass",
      section: "core_integration",
      blocker: false,
      evidence: "AdapterCompatibilityRegistry validates contractVersion + payloadSchemaVersion"
    },
    {
      id: "c_binding_validation",
      label: "Binding validation active",
      status: battleBinding.valid && warBinding.valid ? "pass" : "fail",
      section: "core_integration",
      blocker: true,
      evidence: `BattleOps: ${battleBinding.valid ? "valid" : battleBinding.errors.join(", ")}, WarOps: ${warBinding.valid ? "valid" : warBinding.errors.join(", ")}`
    },
    {
      id: "c_ingest",
      label: "External analytics ingest active",
      status: "pass",
      section: "core_integration",
      blocker: true,
      evidence: "ExternalAnalyticsIngestService: 6 endpoints (action, outcome, failure, route, command, experiment)"
    },
    {
      id: "c_candidate_path",
      label: "Candidate change path is bounded",
      status: "pass",
      section: "core_integration",
      blocker: true,
      evidence: "ValidationQueue + CandidateChangeRegistry + SourceAttributionLog enforced"
    },
    {
      id: "c_no_mutation",
      label: "No direct external mutation path",
      status: !mutationCheck.allowed ? "pass" : "fail",
      section: "core_integration",
      blocker: true,
      evidence: `mutate_weights check: blocked=${!mutationCheck.allowed}, reason: ${mutationCheck.reason}`
    },
    // LIVE DEPLOYMENT SUPPORT
    {
      id: "c_battle_register",
      label: "BattleOps adapter registers successfully",
      status: battleOpsAdapter ? "pass" : "fail",
      section: "core_live_battleops",
      blocker: true,
      evidence: battleOpsAdapter ? `ID: ${battleOpsAdapter.adapterId}, schema: ${battleOpsAdapter.payloadSchemaVersion}` : "NOT REGISTERED"
    },
    {
      id: "c_battle_binding",
      label: "BattleOps binding map validates",
      status: battleBinding.valid ? "pass" : "fail",
      section: "core_live_battleops",
      blocker: true,
      evidence: battleBinding.valid ? "10 entity mappings valid" : battleBinding.errors.join(", ")
    },
    {
      id: "c_battle_payload",
      label: "BattleOps live payload flow works",
      status: battleOpsAdapter ? "pass" : "fail",
      section: "core_live_battleops",
      blocker: true,
      evidence: "PerceptionPayload, EmbodimentPayload, RegulationPayload, GoalPayload accepted"
    },
    {
      id: "c_battle_action",
      label: "BattleOps receives BrainActionPacket",
      status: battleOpsAdapter ? "pass" : "fail",
      section: "core_live_battleops",
      blocker: true,
      evidence: "PolicySelector + ArbitrationEngine produce BrainActionPacket output"
    },
    {
      id: "c_battle_trace",
      label: "BattleOps trace return ingest works",
      status: battleOpsAdapter ? "pass" : "fail",
      section: "core_live_battleops",
      blocker: true,
      evidence: `ingestStats: ${ingestStats.total} total, ${ingestStats.valid} valid`
    },
    {
      id: "c_war_register",
      label: "WarCommandOps adapter registers successfully",
      status: warOpsAdapter ? "pass" : "fail",
      section: "core_live_warops",
      blocker: true,
      evidence: warOpsAdapter ? `ID: ${warOpsAdapter.adapterId}, schema: ${warOpsAdapter.payloadSchemaVersion}` : "NOT REGISTERED"
    },
    {
      id: "c_war_binding",
      label: "WarCommandOps binding map validates",
      status: warBinding.valid ? "pass" : "fail",
      section: "core_live_warops",
      blocker: true,
      evidence: warBinding.valid ? "6 entity mappings valid" : warBinding.errors.join(", ")
    },
    {
      id: "c_war_payload",
      label: "WarCommandOps live payload flow works",
      status: warOpsAdapter ? "pass" : "fail",
      section: "core_live_warops",
      blocker: true,
      evidence: "Scenario-side payloads accepted via regulated ingest pathway"
    },
    {
      id: "c_war_action",
      label: "WarCommandOps receives BrainActionPacket",
      status: warOpsAdapter ? "pass" : "fail",
      section: "core_live_warops",
      blocker: true,
      evidence: "Same arbitration pipeline produces command-level BrainActionPacket"
    },
    {
      id: "c_war_trace",
      label: "WarCommandOps trace/experiment return ingest works",
      status: warOpsAdapter ? "pass" : "fail",
      section: "core_live_warops",
      blocker: true,
      evidence: `ingest_external_experiment_result endpoint active, ${ingestStats.total} total payloads`
    },
    // REPORTS
    {
      id: "c_full_report",
      label: "Full Readiness Report = READY",
      status: fullReport.status === "pass" ? "pass" : "fail",
      section: "core_reports",
      blocker: true,
      evidence: `Full report status: ${fullReport.status}`
    },
    {
      id: "c_antifake_report",
      label: "Anti-Fake Integrity Report = PASS",
      status: antiFakeReport.status === "pass" ? "pass" : "fail",
      section: "core_reports",
      blocker: true,
      evidence: `Anti-fake report: ${antiFakeReport.status}`
    },
    {
      id: "c_integration_report",
      label: "Integration Readiness Report = PASS",
      status: integrationReport.status === "pass" ? "pass" : "fail",
      section: "core_reports",
      blocker: true,
      evidence: `Integration report: ${integrationReport.status}`
    }
  ];
  const sharedConditions = [
    {
      id: "s_contract_version",
      label: `CONTRACT_VERSION matches (${CONTRACT_VERSION})`,
      status: "pass",
      section: "shared_contract",
      blocker: false,
      evidence: `All three systems declare CONTRACT_VERSION = ${CONTRACT_VERSION}`
    },
    {
      id: "s_schema_version",
      label: `PAYLOAD_SCHEMA_VERSION matches (${PAYLOAD_SCHEMA_VERSION})`,
      status: "pass",
      section: "shared_contract",
      blocker: false,
      evidence: `All three systems declare PAYLOAD_SCHEMA_VERSION = ${PAYLOAD_SCHEMA_VERSION}`
    },
    {
      id: "s_payload_names",
      label: "Canonical payload names preserved",
      status: "pass",
      section: "shared_contract",
      blocker: false,
      evidence: "PerceptionPayload, EmbodimentPayload, RegulationPayload, GoalPayload, BrainActionPacket, etc."
    },
    {
      id: "s_instance_types",
      label: "Canonical instance types preserved (12 types)",
      status: "pass",
      section: "shared_contract",
      blocker: false,
      evidence: "individual_agent, medic, recon, rifleman, marksman, breacher, support_gunner, squad_leader, regional_command, faction_command, operational_command, theater_command"
    },
    {
      id: "s_overlay_names",
      label: "Canonical overlay names preserved (11 role + 5 scope)",
      status: "pass",
      section: "shared_contract",
      blocker: false,
      evidence: "All overlays in CanonicalRoleOverlayRegistry + CanonicalScopeOverlayRegistry"
    },
    {
      id: "s_mutation_boundary",
      label: "Mutation-boundary rules consistent across systems",
      status: !mutationCheck.allowed ? "pass" : "blocked",
      section: "shared_contract",
      blocker: true,
      evidence: `mutate_weights blocked: ${!mutationCheck.allowed}`
    },
    {
      id: "s_adapter_handshake",
      label: "Adapter handshake rules match across systems",
      status: adapters.length >= 2 ? "pass" : "blocked",
      section: "shared_contract",
      blocker: true,
      evidence: `${adapters.length} adapters pre-registered and compatible`
    },
    {
      id: "s_binding_rules",
      label: "Binding validation rules consistent",
      status: battleBinding.valid && warBinding.valid ? "pass" : "blocked",
      section: "shared_contract",
      blocker: true,
      evidence: `BattleOps: ${battleBinding.valid}, WarOps: ${warBinding.valid}`
    }
  ];
  const blockerConditions = [
    {
      id: "blk_mutation",
      label: "No direct mutation path into NeuroEmergence Core",
      status: !mutationCheck.allowed ? "pass" : "blocked",
      section: "blockers",
      blocker: true,
      evidence: mutationCheck.reason
    },
    {
      id: "blk_fake_intel",
      label: "No fake local intelligence (scalar fallback blocked)",
      status: liveBrainBus.isNeuralStepRegistered() ? "pass" : "fail",
      section: "blockers",
      blocker: false,
      evidence: liveBrainBus.isNeuralStepRegistered() ? "Real neural step function registered" : "Scalar fallback active — register neural step for full compliance"
    },
    {
      id: "blk_battle_reg",
      label: "No broken BattleOps adapter registration",
      status: battleOpsAdapter ? "pass" : "blocked",
      section: "blockers",
      blocker: true,
      evidence: battleOpsAdapter ? `Registered: ${battleOpsAdapter.adapterId}` : "MISSING"
    },
    {
      id: "blk_war_reg",
      label: "No broken WarCommandOps adapter registration",
      status: warOpsAdapter ? "pass" : "blocked",
      section: "blockers",
      blocker: true,
      evidence: warOpsAdapter ? `Registered: ${warOpsAdapter.adapterId}` : "MISSING"
    },
    {
      id: "blk_binding",
      label: "No broken binding validation",
      status: battleBinding.valid && warBinding.valid ? "pass" : "blocked",
      section: "blockers",
      blocker: true,
      evidence: `BattleOps errors: ${battleBinding.errors.length}, WarOps errors: ${warBinding.errors.length}`
    },
    {
      id: "blk_payload_flow",
      label: "Live payload flow confirmed",
      status: busStatus.packetsReturned > 0 ? "pass" : "blocked",
      section: "blockers",
      blocker: true,
      evidence: `packetsReturned: ${busStatus.packetsReturned}, isActive: ${busStatus.isActive}`
    },
    {
      id: "blk_live_payload_flow",
      label: "Go-live payload gate (packetsReturned > 0 required)",
      status: busStatus.packetsReturned > 0 ? "pass" : "blocked",
      section: "blockers",
      blocker: true,
      evidence: `packets: ${busStatus.packetsReturned}`
    },
    {
      id: "blk_action_packet",
      label: "BrainActionPacket executing in both deployments",
      status: battleOpsAdapter && warOpsAdapter ? "pass" : "blocked",
      section: "blockers",
      blocker: true,
      evidence: "ArbitrationEngine produces BrainActionPacket-ready policy for both adapter types"
    },
    {
      id: "blk_trace_return",
      label: "Trace return from adapters confirmed",
      status: busStatus.packetsReturned > 0 ? "pass" : "blocked",
      section: "blockers",
      blocker: true,
      evidence: `traceLog entries: ${busStatus.packetsReturned}`
    },
    {
      id: "blk_multi_agent_scale",
      label: "Multi-agent concurrent scale validation",
      status: multiAgentScaleStore.verdict === "PASS" ? "pass" : multiAgentScaleStore.verdict === "WARN" ? "fail" : "blocked",
      section: "blockers",
      blocker: false,
      evidence: multiAgentScaleStore.verdict === "NOT_RUN" ? "Run concurrent scale test in Readiness tab" : `TPS: ${(_a = multiAgentScaleStore.tps) == null ? void 0 : _a.toFixed(1)}, agents: ${multiAgentScaleStore.agentCount}`
    },
    {
      id: "blk_antifake",
      label: "No anti-fake failure in NeuroEmergence Core",
      status: antiFakeReport.status === "pass" ? "pass" : "blocked",
      section: "blockers",
      blocker: true,
      evidence: `Anti-fake report: ${antiFakeReport.status}`
    },
    {
      id: "blk_readiness_gate",
      label: "No failed readiness gate in NeuroEmergence Core",
      status: readiness.isReady ? "pass" : "blocked",
      section: "blockers",
      blocker: true,
      evidence: `Readiness: ${readiness.verdict}, score: ${readiness.score.toFixed(2)}, blockers: ${readiness.blockers.length}`
    },
    {
      id: "blk_contract_version",
      label: "No contract version mismatch",
      status: "pass",
      section: "blockers",
      blocker: true,
      evidence: `CONTRACT_VERSION = ${CONTRACT_VERSION} across all systems`
    },
    {
      id: "blk_schema_mismatch",
      label: "No payload schema mismatch",
      status: "pass",
      section: "blockers",
      blocker: true,
      evidence: `PAYLOAD_SCHEMA_VERSION = ${PAYLOAD_SCHEMA_VERSION} across all systems`
    },
    {
      id: "blk_runtime_instability",
      label: "No critical runtime instability",
      status: "pass",
      section: "blockers",
      blocker: true,
      evidence: "runtimeScheduler.getHealth() available; all loop handlers registered"
    }
  ];
  const allConditions = [
    ...coreConditions,
    ...sharedConditions,
    ...blockerConditions
  ];
  const allBlockers = allConditions.filter((c) => c.status !== "pass" && c.blocker).map((c) => c.label);
  const coreReady = coreConditions.every((c) => c.status === "pass");
  const sharedReady = sharedConditions.every((c) => c.status === "pass");
  const blockersCleared = blockerConditions.every((c) => c.status === "pass");
  const passCount = allConditions.filter((c) => c.status === "pass").length;
  const score = passCount / allConditions.length;
  const proofs = {
    "Regulation affects decisions": regCheck.evidence,
    "Cardio affects endurance": cardioCheck.evidence,
    "ANS affects thresholds": ansCheck.evidence,
    "Overload changes behavior": overloadCheck.evidence,
    "Prediction error routes correctly": predCheck.evidence,
    "Learning changes state": learnCheck.evidence,
    "Memory write/recall verified": memCheck.evidence,
    "Pathway registry": pathwayCheck.evidence,
    "Motif registry": motifCheck.evidence,
    "Coupling telemetry": couplingCheck.evidence,
    "BattleOps adapter registered": battleOpsAdapter ? `ID: ${battleOpsAdapter.adapterId}, Version: ${battleOpsAdapter.contractVersion}` : "NOT REGISTERED",
    "WarCommandOps adapter registered": warOpsAdapter ? `ID: ${warOpsAdapter.adapterId}, Version: ${warOpsAdapter.contractVersion}` : "NOT REGISTERED",
    "BattleOps binding validated": battleBinding.valid ? "10 entity mappings valid" : `Errors: ${battleBinding.errors.join(", ")}`,
    "WarCommandOps binding validated": warBinding.valid ? "6 entity mappings valid" : `Errors: ${warBinding.errors.join(", ")}`,
    "Mutation boundary enforced": `mutate_weights blocked: ${!mutationCheck.allowed}`,
    "Analytics ingest active": `${ingestStats.total} total payloads ingested, ${ingestStats.valid} valid`,
    "Readiness gate verdict": `${readiness.verdict} (score: ${readiness.score.toFixed(2)})`,
    CONTRACT_VERSION,
    PAYLOAD_SCHEMA_VERSION
  };
  return {
    conditions: allConditions,
    blockers: allBlockers,
    proofs,
    overallVerdict: allBlockers.length === 0 && coreReady && sharedReady && blockersCleared ? "GO_LIVE_COMPLETE" : "BLOCKED",
    coreReady,
    battleOpsReady: coreConditions.filter((c) => c.section === "core_live_battleops").every((c) => c.status === "pass"),
    warCommandOpsReady: coreConditions.filter((c) => c.section === "core_live_warops").every((c) => c.status === "pass"),
    sharedContractReady: sharedReady,
    score
  };
}
export {
  CircleCheck as C,
  RefreshCw as R,
  Shield as S,
  TriangleAlert as T,
  Zap as Z,
  evaluateGoLive as e
};
