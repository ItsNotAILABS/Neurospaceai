// ─── Movement Substrate Engine v1.0.0 ─────────────────────────────────────────
// Pure engine logic — no React, no side effects. Tick-driven.
// Layers: MainMovementBrain → RegionalBrains → JointClusters → ReflexLayer → BodyMesh

import {
  BODY_REGIONS,
  type BodyRegionId,
  type BodyStateMesh,
  CLUSTER_TO_REGION,
  JOINT_CLUSTERS,
  type JointClusterId,
  type JointClusterState,
  type JointSensorState,
  MOVEMENT_SUBSTRATE_VERSION,
  type MainMovementBrainState,
  type MovementMode,
  type MovementSubstrateState,
  type MovementSubstrateTuning,
  type MovementTelemetry,
  PIPELINE_STEPS,
  type PipelineStep,
  type PostureBias,
  type ReflexEvent,
  type RegionalMovementBrainState,
  type StrategicMovementIntent,
  type TacticalMovementContext,
} from "./movementSubstrateTypes";

// ── Default tuning ─────────────────────────────────────────────────────────
const defaultRegionalValue = (val: number): Record<BodyRegionId, number> =>
  Object.fromEntries(BODY_REGIONS.map((r) => [r, val])) as Record<
    BodyRegionId,
    number
  >;

export function defaultTuning(): MovementSubstrateTuning {
  return {
    embodimentFidelity: 0.85,
    reflexSensitivity: 0.7,
    bodyPreservationWeight: 0.6,
    balancePriority: 0.75,
    smoothnessVsAggression: 0.35,
    recoveryAggressiveness: 0.5,
    terrainAdaptationWeight: 0.6,
    injuryCompensationScale: 0.7,
    contactConfidence: 0.8,
    regionalStiffness: defaultRegionalValue(0.55),
    regionalResponsiveness: defaultRegionalValue(0.65),
    stepFrequency: 0.5,
    strideLength: 0.5,
    hipSwing: 0.4,
    armSwing: 0.45,
  };
}

// ── Body-state mesh initialization ─────────────────────────────────────────
function defaultJointSensor(clusterId: JointClusterId): JointSensorState {
  return {
    clusterId,
    angle: 0,
    velocity: 0,
    load: 0.1,
    orientation: [0, 0, 0],
    stabilityScore: 0.9,
    fatigueAnalog: 0,
    damageAnalog: 0,
    slipRisk: 0,
    mobilityConstraint: 0,
  };
}

export function defaultBodyMesh(): BodyStateMesh {
  return {
    joints: Object.fromEntries(
      JOINT_CLUSTERS.map((c) => [c, defaultJointSensor(c)]),
    ) as BodyStateMesh["joints"],
    centerOfMassEstimate: [0, 1.0, 0],
    overallStabilityScore: 0.9,
    contactPoints: { left_ankle_foot: true, right_ankle_foot: true },
    terrainDifficultyEstimate: 0.1,
    motionSmoothnessScore: 0.85,
    proprioceptiveConfidence: 0.9,
    totalFatigueLoad: 0,
    totalDamageLoad: 0,
  };
}

// ── Initial state ───────────────────────────────────────────────────────────
export function initMovementSubstrate(
  tuning?: Partial<MovementSubstrateTuning>,
): MovementSubstrateState {
  const t = { ...defaultTuning(), ...tuning };
  const emptyRegions = Object.fromEntries(
    BODY_REGIONS.map((r) => [
      r,
      {
        regionId: r,
        targetActivation: 0.1,
        currentActivation: 0.1,
        coordinationLoad: 0.1,
        neighborNegotiations: {},
        localStabilityScore: 0.9,
        postureContribution: 0.3,
        locomotionContribution:
          r.includes("leg") || r === "pelvis_hips" ? 0.6 : 0.1,
        manipulationContribution:
          r.includes("arm") || r.includes("hand") ? 0.4 : 0.05,
        reflexOverrideActive: false,
      } as RegionalMovementBrainState,
    ]),
  ) as Record<BodyRegionId, RegionalMovementBrainState>;

  const emptyClusters = Object.fromEntries(
    JOINT_CLUSTERS.map((c) => [
      c,
      {
        clusterId: c,
        regionId: CLUSTER_TO_REGION[c],
        desiredActivation: 0.1,
        currentActivation: 0.1,
        stiffness: t.regionalStiffness[CLUSTER_TO_REGION[c]],
        damping: 0.5,
        contactAdaptation: 0.5,
        localStabilization: 0.9,
        smoothedOutput: 0.1,
        reflexOverride: false,
        loadBearing: c === "left_ankle_foot" || c === "right_ankle_foot",
      } as JointClusterState,
    ]),
  ) as Record<JointClusterId, JointClusterState>;

  const pipelineStatus = Object.fromEntries(
    PIPELINE_STEPS.map((s) => [s, "ok" as const]),
  ) as Record<PipelineStep, "ok" | "warn" | "skip">;

  return {
    version: MOVEMENT_SUBSTRATE_VERSION,
    tickCount: 0,
    timestampMs: Date.now(),
    mainBrain: {
      movementMode: "idle",
      postureBias: "upright",
      speedEnvelope: 0,
      forceEnvelope: 0.2,
      contactPreference: 0.8,
      stabilityThreshold: 0.35,
      bodyPreservationBias: t.bodyPreservationWeight,
      coordinationPriority: "stability",
      perRegionTargets: defaultRegionalValue(0.1),
      strategicInfluence: 0,
      tacticalInfluence: 0,
      conflictResolutionLog: [],
    },
    regions: emptyRegions,
    clusters: emptyClusters,
    reflexLayer: [],
    bodyMesh: defaultBodyMesh(),
    tuning: t,
    telemetry: {
      activeMovementMode: "idle",
      strategicInfluenceSummary: "No strategic input",
      tacticalInfluenceSummary: "No tactical input",
      stabilityScore: 0.9,
      bodyPreservationStatus: "nominal",
      movementSmoothness: 0.85,
      impairmentCompensation: 0,
      contactConfidence: 0.8,
      currentPostureBias: "upright",
      activeReflexCount: 0,
      highLoadClusters: [],
      regionPriorityMap: defaultRegionalValue(0.1),
      pipelineStepStatus: pipelineStatus,
    },
  };
}

// ── Neural-to-movement mapping helpers ─────────────────────────────────────
interface NeuralInputs {
  pfcActivation: number; // 0–1 executive
  amygdalaActivation: number; // 0–1 threat/urgency
  nacActivation: number; // 0–1 reward/motivation
  hippocampusActivation: number; // 0–1 memory
  fatigueLoad: number; // 0–1
  arousaLevel: number; // 0–1
  stressSignal: number; // 0–1
  recoverySignal: number; // 0–1
}

function deriveMovementMode(
  inputs: NeuralInputs,
  strategic: StrategicMovementIntent | null,
  tactical: TacticalMovementContext | null,
  currentMode: MovementMode,
): MovementMode {
  const fatigue = inputs.fatigueLoad;
  const urgency = inputs.amygdalaActivation;
  const drive = inputs.nacActivation;
  const stress = inputs.stressSignal;

  if (fatigue > 0.85 || inputs.recoverySignal > 0.8) return "recovery";
  if (
    strategic?.movementPriority === "retreat" ||
    (tactical?.suppressionLevel ?? 0) > 0.8
  ) {
    return stress > 0.6 ? "sprint" : "crouch";
  }
  if (tactical?.contactEngaged) return "combat_stance";
  if (urgency > 0.75 && drive > 0.5) return stress > 0.5 ? "sprint" : "run";
  if (drive > 0.4 && fatigue < 0.5) return "walk";
  if (strategic?.movementPriority === "hold")
    return currentMode === "prone" ? "prone" : "crouch";
  if (urgency < 0.2 && drive < 0.2) return "idle";
  return currentMode;
}

function derivePostureBias(
  inputs: NeuralInputs,
  tactical: TacticalMovementContext | null,
  mode: MovementMode,
): PostureBias {
  if (mode === "prone") return "low_profile";
  if (mode === "recovery" || inputs.fatigueLoad > 0.7) return "exhausted";
  if (mode === "combat_stance" || tactical?.contactEngaged)
    return "combat_ready";
  if ((tactical?.coverOpportunity ?? 0) > 0.6) return "defensive";
  if (mode === "sprint") return "forward_lean";
  return "upright";
}

// ── Layer 1: Main Movement Brain ────────────────────────────────────────────
function tickMainBrain(
  prev: MainMovementBrainState,
  neural: NeuralInputs,
  strategic: StrategicMovementIntent | null,
  tactical: TacticalMovementContext | null,
  tuning: MovementSubstrateTuning,
  mesh: BodyStateMesh,
): MainMovementBrainState {
  const mode = deriveMovementMode(
    neural,
    strategic,
    tactical,
    prev.movementMode,
  );
  const posture = derivePostureBias(neural, tactical, mode);

  const strategicInfluence = strategic
    ? Math.min(
        1,
        strategic.speedBias * 0.4 +
          strategic.aggressionBias * 0.3 +
          strategic.cautionBias * 0.3,
      )
    : 0;
  const tacticalInfluence = tactical
    ? Math.min(
        1,
        tactical.urgencyMultiplier * 0.5 + tactical.immediateThreats * 0.5,
      )
    : 0;

  const speedEnvelope = Math.max(
    0,
    Math.min(
      1,
      neural.nacActivation * 0.4 +
        (strategic?.speedBias ?? 0) * 0.3 +
        (tactical?.urgencyMultiplier ?? 0) * 0.3 -
        neural.fatigueLoad * 0.5 +
        tuning.smoothnessVsAggression * 0.1,
    ),
  );

  const forceEnvelope = Math.max(
    0.1,
    Math.min(
      1,
      neural.amygdalaActivation * 0.4 +
        (strategic?.aggressionBias ?? 0) * 0.3 +
        (1 - neural.fatigueLoad) * 0.3,
    ),
  );

  // Per-region targets based on mode
  const targets: Record<BodyRegionId, number> = {
    head_neck: mode === "idle" ? 0.1 : mode === "combat_stance" ? 0.7 : 0.4,
    torso_spine: ["sprint", "run"].includes(mode)
      ? 0.75
      : mode === "idle"
        ? 0.15
        : 0.5,
    left_arm:
      mode === "combat_stance"
        ? 0.65
        : ["sprint", "run"].includes(mode)
          ? 0.55
          : 0.25,
    right_arm:
      mode === "combat_stance"
        ? 0.65
        : ["sprint", "run"].includes(mode)
          ? 0.55
          : 0.25,
    left_hand: mode === "combat_stance" ? 0.7 : 0.2,
    right_hand: mode === "combat_stance" ? 0.7 : 0.2,
    pelvis_hips: ["sprint", "run", "walk"].includes(mode)
      ? 0.8
      : mode === "idle"
        ? 0.2
        : 0.5,
    left_leg: ["sprint", "run", "walk"].includes(mode)
      ? 0.85
      : mode === "crouch"
        ? 0.6
        : 0.2,
    right_leg: ["sprint", "run", "walk"].includes(mode)
      ? 0.85
      : mode === "crouch"
        ? 0.6
        : 0.2,
  };

  // Body preservation: if damaged, reduce targets on damaged regions
  for (const r of BODY_REGIONS) {
    const regionDamage =
      JOINT_CLUSTERS.filter((c) => CLUSTER_TO_REGION[c] === r).reduce(
        (sum, c) => sum + (mesh.joints[c]?.damageAnalog ?? 0),
        0,
      ) / 3;
    if (regionDamage > 0.3) {
      targets[r] = Math.max(
        0.1,
        targets[r] * (1 - regionDamage * tuning.bodyPreservationWeight),
      );
    }
  }

  const conflictLog: string[] = [];
  if (strategicInfluence > 0.5 && tacticalInfluence > 0.5) {
    conflictLog.push(
      `Conflict: tactical urgency (${tacticalInfluence.toFixed(2)}) vs strategic bias (${strategicInfluence.toFixed(2)}) — tactical wins`,
    );
  }

  return {
    movementMode: mode,
    postureBias: posture,
    speedEnvelope,
    forceEnvelope,
    contactPreference: Math.min(
      1,
      mesh.overallStabilityScore + tuning.balancePriority * 0.3,
    ),
    stabilityThreshold: 0.25 + (1 - tuning.balancePriority) * 0.3,
    bodyPreservationBias: tuning.bodyPreservationWeight,
    coordinationPriority:
      neural.fatigueLoad > 0.7
        ? "recovery"
        : neural.stressSignal > 0.7
          ? "speed"
          : mode === "combat_stance"
            ? "stability"
            : "stability",
    perRegionTargets: targets,
    strategicInfluence,
    tacticalInfluence,
    conflictResolutionLog: conflictLog.slice(-5),
  };
}

// ── Layer 2: Regional Movement Brains ──────────────────────────────────────
function tickRegionalBrains(
  prevRegions: Record<BodyRegionId, RegionalMovementBrainState>,
  mainBrain: MainMovementBrainState,
  mesh: BodyStateMesh,
  tuning: MovementSubstrateTuning,
  activeReflexes: ReflexEvent[],
): Record<BodyRegionId, RegionalMovementBrainState> {
  const result = { ...prevRegions };
  const alpha = tuning.regionalResponsiveness; // per-region approach speed

  for (const r of BODY_REGIONS) {
    const prev = prevRegions[r];
    const target = mainBrain.perRegionTargets[r];
    const resp = alpha[r];

    // Smooth toward target
    const current =
      prev.currentActivation + (target - prev.currentActivation) * resp * 0.15;

    // Compute region-level stability from cluster mesh
    const regionClusters = JOINT_CLUSTERS.filter(
      (c) => CLUSTER_TO_REGION[c] === r,
    );
    const localStability =
      regionClusters.reduce(
        (sum, c) => sum + (mesh.joints[c]?.stabilityScore ?? 0.9),
        0,
      ) / Math.max(1, regionClusters.length);

    // Is a reflex overriding this region?
    const reflexActive = activeReflexes.some((re) => re.regionId === r);

    result[r] = {
      ...prev,
      targetActivation: target,
      currentActivation: Math.max(0, Math.min(1, current)),
      coordinationLoad: Math.abs(target - prev.currentActivation),
      localStabilityScore: localStability,
      postureContribution:
        r === "torso_spine" || r === "pelvis_hips"
          ? current * 0.7
          : current * 0.3,
      locomotionContribution: ["left_leg", "right_leg", "pelvis_hips"].includes(
        r,
      )
        ? current * 0.85
        : current * 0.1,
      manipulationContribution: [
        "left_arm",
        "right_arm",
        "left_hand",
        "right_hand",
      ].includes(r)
        ? current * 0.75
        : 0,
      reflexOverrideActive: reflexActive,
    };
  }

  return result;
}

// ── Layer 3: Joint-Cluster Controllers ─────────────────────────────────────
function tickClusters(
  prevClusters: Record<JointClusterId, JointClusterState>,
  regions: Record<BodyRegionId, RegionalMovementBrainState>,
  mesh: BodyStateMesh,
  tuning: MovementSubstrateTuning,
  activeReflexes: ReflexEvent[],
): Record<JointClusterId, JointClusterState> {
  const result = { ...prevClusters };

  for (const c of JOINT_CLUSTERS) {
    const prev = prevClusters[c];
    const region = regions[CLUSTER_TO_REGION[c]];
    const sensor = mesh.joints[c];
    const reflexOverride = activeReflexes.find((re) => re.clusterId === c);

    const desired = reflexOverride
      ? Math.min(1, region.currentActivation + reflexOverride.intensity * 0.4)
      : region.currentActivation;

    const stiffness = tuning.regionalStiffness[CLUSTER_TO_REGION[c]];
    const damping = 0.4 + (1 - tuning.smoothnessVsAggression) * 0.3;

    // Smooth with impedance-like dynamics
    const error = desired - prev.currentActivation;
    const current =
      prev.currentActivation +
      error * stiffness * 0.2 -
      prev.currentActivation * (1 - damping) * 0.02;

    // Contact adaptation: load-bearing clusters respond to contact state
    const isContact = mesh.contactPoints[c] === true;
    const contactAdaptation = isContact
      ? Math.min(1, prev.contactAdaptation + 0.05)
      : Math.max(0, prev.contactAdaptation - 0.03);

    // Local stabilization: high slip risk → increase stiffness
    const localStabilization = Math.min(
      1,
      prev.localStabilization + sensor.slipRisk * 0.1 - 0.02,
    );

    // Smooth output: low-pass filter
    const smoothedOutput =
      prev.smoothedOutput * 0.75 + Math.max(0, Math.min(1, current)) * 0.25;

    result[c] = {
      ...prev,
      desiredActivation: desired,
      currentActivation: Math.max(0, Math.min(1, current)),
      stiffness,
      damping,
      contactAdaptation,
      localStabilization: Math.max(0, Math.min(1, localStabilization)),
      smoothedOutput,
      reflexOverride: !!reflexOverride,
      loadBearing:
        isContact ||
        c === "left_ankle_foot" ||
        c === "right_ankle_foot" ||
        c === "lower_spine_pelvis",
    };
  }

  return result;
}

// ── Layer 4: Reflex Layer ──────────────────────────────────────────────────
function tickReflexLayer(
  prevReflexes: ReflexEvent[],
  mesh: BodyStateMesh,
  mainBrain: MainMovementBrainState,
  tuning: MovementSubstrateTuning,
  _tick: number,
): ReflexEvent[] {
  // Age existing reflexes
  const aged = prevReflexes
    .map((r) => ({ ...r, remainingTicks: r.remainingTicks - 1 }))
    .filter((r) => r.remainingTicks > 0);

  const newReflexes: ReflexEvent[] = [...aged];
  const sensitivity = tuning.reflexSensitivity;
  const now = Date.now();

  const alreadyActive = (t: string) => aged.some((r) => r.reflexType === t);

  // slip_correction
  const ankleSlip = Math.max(
    mesh.joints.left_ankle_foot?.slipRisk ?? 0,
    mesh.joints.right_ankle_foot?.slipRisk ?? 0,
  );
  if (ankleSlip > 0.5 * sensitivity && !alreadyActive("slip_correction")) {
    newReflexes.push({
      reflexType: "slip_correction",
      clusterId: ankleSlip > 0.6 ? "left_ankle_foot" : "right_ankle_foot",
      regionId: "left_leg",
      activationReason: `Ankle slip risk ${ankleSlip.toFixed(2)}`,
      intensity: ankleSlip,
      remainingTicks: 8,
      startedAt: now,
    });
  }

  // balance_rescue
  if (
    mesh.overallStabilityScore < mainBrain.stabilityThreshold &&
    !alreadyActive("balance_rescue")
  ) {
    newReflexes.push({
      reflexType: "balance_rescue",
      clusterId: "lower_spine_pelvis",
      regionId: "pelvis_hips",
      activationReason: `Stability ${mesh.overallStabilityScore.toFixed(2)} < threshold ${mainBrain.stabilityThreshold.toFixed(2)}`,
      intensity: 1 - mesh.overallStabilityScore,
      remainingTicks: 12,
      startedAt: now,
    });
  }

  // joint_overload_reduction
  for (const c of JOINT_CLUSTERS) {
    if (
      mesh.joints[c]?.load > 0.85 &&
      !alreadyActive("joint_overload_reduction")
    ) {
      newReflexes.push({
        reflexType: "joint_overload_reduction",
        clusterId: c,
        regionId: CLUSTER_TO_REGION[c],
        activationReason: `Joint ${c} load ${mesh.joints[c].load.toFixed(2)}`,
        intensity: mesh.joints[c].load - 0.8,
        remainingTicks: 6,
        startedAt: now,
      });
    }
  }

  // posture_rescue — if torso_spine stability degrades
  if (
    (mesh.joints.upper_spine?.stabilityScore ?? 1) < 0.4 &&
    !alreadyActive("posture_rescue")
  ) {
    newReflexes.push({
      reflexType: "posture_rescue",
      clusterId: "upper_spine",
      regionId: "torso_spine",
      activationReason: "Upper spine destabilizing",
      intensity: 0.7,
      remainingTicks: 10,
      startedAt: now,
    });
  }

  // terrain_adaptation_snap
  if (
    mesh.terrainDifficultyEstimate > 0.6 * sensitivity &&
    !alreadyActive("terrain_adaptation_snap")
  ) {
    newReflexes.push({
      reflexType: "terrain_adaptation_snap",
      clusterId: "left_ankle_foot",
      regionId: "left_leg",
      activationReason: `Terrain difficulty ${mesh.terrainDifficultyEstimate.toFixed(2)}`,
      intensity: mesh.terrainDifficultyEstimate * 0.6,
      remainingTicks: 5,
      startedAt: now,
    });
  }

  // foot_placement_correction — triggered by low proprioceptive confidence
  if (
    mesh.proprioceptiveConfidence < 0.5 &&
    !alreadyActive("foot_placement_correction")
  ) {
    newReflexes.push({
      reflexType: "foot_placement_correction",
      clusterId: "right_ankle_foot",
      regionId: "right_leg",
      activationReason: `Proprioceptive confidence ${mesh.proprioceptiveConfidence.toFixed(2)}`,
      intensity: 1 - mesh.proprioceptiveConfidence,
      remainingTicks: 7,
      startedAt: now,
    });
  }

  return newReflexes.slice(-10); // cap at 10 concurrent reflexes
}

// ── Layer 5: Body-State Mesh Update ────────────────────────────────────────
function tickBodyMesh(
  prev: BodyStateMesh,
  neural: NeuralInputs,
  clusters: Record<JointClusterId, JointClusterState>,
  tuning: MovementSubstrateTuning,
): BodyStateMesh {
  const updatedJoints = { ...prev.joints };

  for (const c of JOINT_CLUSTERS) {
    const cluster = clusters[c];
    const prevJoint = prev.joints[c];

    // Propagate neural fatigue into joint sensors
    const fatigueAnalog = Math.min(
      1,
      prevJoint.fatigueAnalog * 0.98 + neural.fatigueLoad * 0.02,
    );
    const slipRisk = Math.max(
      0,
      prevJoint.slipRisk + prev.terrainDifficultyEstimate * 0.05 - 0.03,
    );
    const load = Math.min(
      1,
      cluster.smoothedOutput * 0.7 + prevJoint.load * 0.3,
    );
    const angle =
      Math.sin(Date.now() * 0.001 + c.length * 0.3) *
      cluster.smoothedOutput *
      0.5;
    const velocity =
      Math.abs(cluster.currentActivation - cluster.desiredActivation) * 2;
    const stabilityScore = Math.max(
      0.1,
      1 - slipRisk * 0.4 - fatigueAnalog * 0.2 - load * 0.1,
    );

    updatedJoints[c] = {
      ...prevJoint,
      angle,
      velocity,
      load,
      fatigueAnalog,
      slipRisk: Math.min(1, slipRisk),
      stabilityScore,
      mobilityConstraint: Math.max(
        0,
        prevJoint.damageAnalog * tuning.injuryCompensationScale * 0.8,
      ),
    };
  }

  const overallStability =
    Object.values(updatedJoints).reduce((s, j) => s + j.stabilityScore, 0) /
    JOINT_CLUSTERS.length;
  const totalFatigue =
    Object.values(updatedJoints).reduce((s, j) => s + j.fatigueAnalog, 0) /
    JOINT_CLUSTERS.length;
  const smoothness =
    1 -
    Object.values(updatedJoints).reduce((s, j) => s + j.velocity, 0) /
      JOINT_CLUSTERS.length /
      2;
  const propConf = Math.max(
    0.2,
    Math.min(1, overallStability * 0.8 + (1 - totalFatigue) * 0.2),
  );

  return {
    ...prev,
    joints: updatedJoints,
    overallStabilityScore: overallStability,
    motionSmoothnessScore: Math.max(0, Math.min(1, smoothness)),
    proprioceptiveConfidence: propConf,
    totalFatigueLoad: totalFatigue,
    terrainDifficultyEstimate: Math.max(
      0,
      prev.terrainDifficultyEstimate + (Math.random() - 0.5) * 0.02,
    ),
  };
}

// ── Telemetry aggregation ──────────────────────────────────────────────────
function buildTelemetry(
  mainBrain: MainMovementBrainState,
  mesh: BodyStateMesh,
  reflexes: ReflexEvent[],
  clusters: Record<JointClusterId, JointClusterState>,
  strategic: StrategicMovementIntent | null,
  tactical: TacticalMovementContext | null,
): MovementTelemetry {
  const highLoad = JOINT_CLUSTERS.filter(
    (c) => clusters[c].smoothedOutput > 0.75,
  );
  const regionPriority = Object.fromEntries(
    BODY_REGIONS.map((r) => [r, mainBrain.perRegionTargets[r]]),
  ) as Record<BodyRegionId, number>;

  const pipelineStatus = Object.fromEntries(
    [
      "body_state_ingest",
      "env_ingest",
      "strategic_ingest",
      "tactical_ingest",
      "main_brain_arbitration",
      "regional_decomposition",
      "cluster_execution",
      "reflex_interception",
      "output_ik",
      "telemetry_return",
    ].map((s) => [
      s,
      s === "strategic_ingest" && !strategic
        ? "skip"
        : s === "tactical_ingest" && !tactical
          ? "skip"
          : mesh.overallStabilityScore < 0.3 && s === "output_ik"
            ? "warn"
            : "ok",
    ]),
  ) as MovementTelemetry["pipelineStepStatus"];

  const bodyPreservation: MovementTelemetry["bodyPreservationStatus"] =
    mesh.totalDamageLoad > 0.5
      ? "critical"
      : mesh.totalDamageLoad > 0.2
        ? "compensating"
        : "nominal";

  return {
    activeMovementMode: mainBrain.movementMode,
    strategicInfluenceSummary: strategic
      ? `WarCommand: ${strategic.movementPriority} | speed ${strategic.speedBias.toFixed(2)} | stealth ${strategic.stealthBias.toFixed(2)}`
      : "No strategic input",
    tacticalInfluenceSummary: tactical
      ? `BattleOps: threats ${tactical.immediateThreats.toFixed(2)} | suppression ${tactical.suppressionLevel.toFixed(2)} | contact ${tactical.contactEngaged}`
      : "No tactical input",
    stabilityScore: mesh.overallStabilityScore,
    bodyPreservationStatus: bodyPreservation,
    movementSmoothness: mesh.motionSmoothnessScore,
    impairmentCompensation: mesh.totalDamageLoad,
    contactConfidence: mesh.proprioceptiveConfidence,
    currentPostureBias: mainBrain.postureBias,
    activeReflexCount: reflexes.length,
    highLoadClusters: highLoad,
    regionPriorityMap: regionPriority,
    pipelineStepStatus: pipelineStatus,
  };
}

// ── Main tick function ─────────────────────────────────────────────────────
export function tickMovementSubstrate(
  prev: MovementSubstrateState,
  neural: NeuralInputs,
  strategic: StrategicMovementIntent | null,
  tactical: TacticalMovementContext | null,
  tuningOverride?: Partial<MovementSubstrateTuning>,
): MovementSubstrateState {
  const tuning = tuningOverride
    ? { ...prev.tuning, ...tuningOverride }
    : prev.tuning;
  const tick = prev.tickCount + 1;

  // Step 1-2: Body-state mesh (uses previous cluster outputs)
  const mesh = tickBodyMesh(prev.bodyMesh, neural, prev.clusters, tuning);

  // Step 3-5: Main brain arbitration
  const mainBrain = tickMainBrain(
    prev.mainBrain,
    neural,
    strategic,
    tactical,
    tuning,
    mesh,
  );

  // Step 6: Regional decomposition
  const regions = tickRegionalBrains(
    prev.regions,
    mainBrain,
    mesh,
    tuning,
    prev.reflexLayer,
  );

  // Step 7: Cluster execution
  const clusters = tickClusters(
    prev.clusters,
    regions,
    mesh,
    tuning,
    prev.reflexLayer,
  );

  // Step 8: Reflex interception
  const reflexLayer = tickReflexLayer(
    prev.reflexLayer,
    mesh,
    mainBrain,
    tuning,
    tick,
  );

  // Step 9-10: Telemetry
  const telemetry = buildTelemetry(
    mainBrain,
    mesh,
    reflexLayer,
    clusters,
    strategic,
    tactical,
  );

  return {
    ...prev,
    tickCount: tick,
    timestampMs: Date.now(),
    mainBrain,
    regions,
    clusters,
    reflexLayer,
    bodyMesh: mesh,
    tuning,
    telemetry,
  };
}

export type { NeuralInputs };
