// ============================================================
// CONNECTOME CANISTER — SOVEREIGN NEURAL SUBSTRATE
// NeuroEmergence Core — Multi-Canister Architecture v2.0
// Creator: Alfredo Medina Hernandez | Dallas TX 2026
// TOP SECRET PROPRIETARY — ALL RIGHTS RESERVED
//
// Sovereign canister for the 96-node Kuramoto connectome.
// Holds: node phases, activations, frequencies, coupling weights.
// Drives: PHI-harmonic Kuramoto dynamics + homeostatic dampening.
//
// PHI = 1.6180339887498948482 (root constant, 19 decimals)
// Heartbeat = 873ms (PHI^4 × Schumann period)
// Kuramoto R >= 0.87 = OMNIS gate fires
// ============================================================

import Array       "mo:core/Array";
import Float       "mo:core/Float";
import NeuralCord  "neural_cord";
import SovereignLaws "sovereign_laws";

actor {

  type TorsionNode = {
    w: Float;
    x: Float;
    y: Float;
    z: Float;
    angularVelocity: Float;
    clusterMember: Bool;
  };

  // ============================================================
  // SOVEREIGN CONSTANTS — sealed, PHI-derived
  // ============================================================

  let PHI         : Float = SovereignLaws.PHI;       // 1.6180339887498948482
  let PHI_INV     : Float = SovereignLaws.PHI_INV;   // 0.6180339887498948482
  let PHI_INV2    : Float = SovereignLaws.PHI_INV2;  // 0.3819660112501051518
  let NODE_COUNT  : Nat   = 96;
  let RING_COUNT  : Nat   = 8;
  let PER_RING    : Nat   = 12;

  // OMNIS threshold — Kuramoto R >= 0.87 = emergence
  let OMNIS_THRESHOLD : Float = 0.87;

  // Saturation dampening threshold — 85% activation for 8+ ticks triggers rest
  let SATURATION_THRESHOLD : Float = 0.85;
  // Rest amplitude — PHI^(-2) = 0.382
  let REST_AMPLITUDE : Float = PHI_INV2;
  // Fibonacci rest interval — 8 beats (Fibonacci[6])
  let FIBONACCI_REST_BEATS : Nat = 8;

  // ============================================================
  // STATE — all EOP-safe (no `stable` keyword needed)
  // ============================================================

  // 96 node phases [0, 2π] — updated every heartbeat
  var nodePhases : [var Float] = Array.toVarArray(Array.repeat<Float>(0.0, NODE_COUNT));

  // 96 node activations [0, 1] — normalized firing probability
  var nodeActivations : [var Float] = Array.toVarArray(Array.repeat<Float>(0.5, NODE_COUNT));

  // 96 node frequencies — PHI-harmonic ladder: f_i = SCHUMANN × PHI^(ring)
  var nodeFrequencies : [var Float] = Array.toVarArray(Array.repeat<Float>(SovereignLaws.SCHUMANN_HZ, NODE_COUNT));

  // Current Kuramoto order parameter R [0, 1]
  var kuramotoR : Float = 0.0;

  // Saturation counters — how many consecutive beats each node has been above threshold
  var saturationCounters : [var Nat] = Array.toVarArray(Array.repeat<Nat>(0, NODE_COUNT));

  // Rest counters — remaining rest beats per node (0 = not resting)
  var restCounters : [var Nat] = Array.toVarArray(Array.repeat<Nat>(0, NODE_COUNT));

  // Saturation dampening enabled flag
  var saturationDampeningEnabled : Bool = true;

  // Torsion field — 96 quaternion spin states
  var torsionNodes : [var TorsionNode] = Array.toVarArray(Array.repeat<TorsionNode>({
    w = 1.0; x = 0.0; y = 0.0; z = 0.0;
    angularVelocity = 0.382;  // PHI_INV2 baseline
    clusterMember = false;
  }, 96));

  // Neural cord state — updated each heartbeat
  var neuralCordState : NeuralCord.NeuralCordState = NeuralCord.initNeuralCord();

  // Beat counter — monotonic
  var beatCount : Nat = 0;

  // ============================================================
  // INITIALIZATION — PHI-harmonic frequency ladder
  // f_node = SCHUMANN × PHI^(ring_index)
  // Ring 0 = 7.83 Hz, Ring 1 = 12.67 Hz, ..., Ring 7 = MERIDIAN_HZ
  // ============================================================

  do {
    let harmonicLadder = SovereignLaws.HARMONIC_LADDER;
    var i : Nat = 0;
    while (i < NODE_COUNT) {
      let ring = i / PER_RING;
      let ringFreq = if (ring < harmonicLadder.size()) harmonicLadder[ring] else SovereignLaws.SCHUMANN_HZ;
      nodeFrequencies[i] := ringFreq;
      // Golden angle phase initialization: θ_i = i × 137.5077° in radians
      nodePhases[i] := Float.fromInt(i) * 2.3999632297286535 % 6.28318530717958647692;
      i += 1;
    };
  };

  // ============================================================
  // PURE HELPERS — Kuramoto synchrony calculation
  // ============================================================

  func computeKuramotoR(phases : [var Float]) : Float {
    var sinSum : Float = 0.0;
    var cosSum : Float = 0.0;
    let n = phases.size();
    var i : Nat = 0;
    while (i < n) {
      sinSum += Float.sin(phases[i]);
      cosSum += Float.cos(phases[i]);
      i += 1;
    };
    let nF = Float.fromInt(n);
    Float.sqrt((sinSum / nF) * (sinSum / nF) + (cosSum / nF) * (cosSum / nF))
  };

  // Clamp a float to [lo, hi]
  func clamp(x : Float, lo : Float, hi : Float) : Float {
    if (x < lo) lo else if (x > hi) hi else x
  };

  // ============================================================
  // HOMEOSTATIC DAMPENING — tidal return phase (SPANDA_CORE law)
  // Nodes above SATURATION_THRESHOLD for FIBONACCI_REST_BEATS
  // consecutive ticks enter PHI^(-2) rest for 8 beats, then recover.
  // Implements the Law of Rhythm (Hermetic) — every high tide has return.
  // ============================================================

  func applyHomeostaticDampening() {
    if (not saturationDampeningEnabled) return;
    var i : Nat = 0;
    while (i < NODE_COUNT) {
      if (restCounters[i] > 0) {
        // Node is in rest phase — hold at REST_AMPLITUDE
        nodeActivations[i] := REST_AMPLITUDE;
        restCounters[i] -= 1;
        saturationCounters[i] := 0;
      } else if (nodeActivations[i] > SATURATION_THRESHOLD) {
        saturationCounters[i] += 1;
        if (saturationCounters[i] >= FIBONACCI_REST_BEATS) {
          // Trigger tidal return — drop to PHI^(-2) rest amplitude
          nodeActivations[i] := REST_AMPLITUDE;
          restCounters[i] := FIBONACCI_REST_BEATS;  // rest for 8 beats
          saturationCounters[i] := 0;
        };
      } else {
        // Node healthy — reset saturation counter
        saturationCounters[i] := 0;
      };
      i += 1;
    };
  };

  // ============================================================
  // PUBLIC QUERIES
  // ============================================================

  /// Current Kuramoto order parameter R [0, 1]. R >= 0.87 = OMNIS gate.
  public query func getKuramotoR() : async Float {
    kuramotoR
  };

  /// Raw phase array for all 96 nodes [0, 2π]
  public query func getNodePhases() : async [Float] {
    Array.freeze(nodePhases)
  };

  /// Activation levels [0, 1] for all 96 nodes
  public query func getNodeActivations() : async [Float] {
    Array.freeze(nodeActivations)
  };

  /// PHI-harmonic frequencies for all 96 nodes
  public query func getNodeFrequencies() : async [Float] {
    Array.freeze(nodeFrequencies)
  };

  /// Full NeuralCordState snapshot — HH states, brain regions, oscillation band
  public query func getNeuralCordState() : async NeuralCord.NeuralCordState {
    neuralCordState
  };

  /// All brain region activations — list of (regionName, activation) pairs
  public query func getBrainRegionActivations() : async [(Text, Float)] {
    let regions = neuralCordState.brainRegions;
    Array.map<NeuralCord.BrainRegionState, (Text, Float)>(
      regions,
      func(r) { (r.region, r.activation) }
    )
  };

  /// Which nodes are currently saturated (activation > 0.85)
  public query func getSaturatedNodes() : async [Nat] {
    var saturated : [Nat] = [];
    var i : Nat = 0;
    while (i < NODE_COUNT) {
      if (nodeActivations[i] > SATURATION_THRESHOLD) {
        saturated := saturated.concat([i]);
      };
      i += 1;
    };
    saturated
  };

  /// OMNIS gate status — true when R >= 0.87
  public query func getOmnisGate() : async Bool {
    kuramotoR >= OMNIS_THRESHOLD
  };

  /// Cache-bust identity — guarantees new Wasm artifact on deploy
  public query func getConnectomeVersion() : async Text {
    "CONNECTOME-v2.0-SOVEREIGN"
  };

  // ============================================================
  // PUBLIC UPDATES
  // ============================================================

  /// Advance one Kuramoto step with current organism state.
  /// Called every 873ms from the core heartbeat.
  /// heartbeat: monotonic beat counter
  /// kuramotoRIn: R value from last computation (feedback loop)
  /// neurochemicals: [dopamine, serotonin, norepinephrine, GABA, ...] normalized [0,1]
  public func advanceKuramotoStep(
    heartbeat     : Nat,
    kuramotoRIn   : Float,
    neurochemicals : [Float]
  ) : async () {
    beatCount := heartbeat;

    // Coupling constant = PHI_INV = 0.618 — optimal weak coupling law
    let K : Float = PHI_INV;

    // Dopamine modulates coupling (reward signal amplifies synchrony)
    let dopamine  = if (neurochemicals.size() > 0) neurochemicals[0] else 0.31;
    let kEffective = clamp(K * (1.0 + dopamine * PHI_INV), 0.0, 1.0);

    // Advance phases: dθ_i/dt = ω_i + (K/N) × Σ sin(θ_j - θ_i)
    // Euler integration over one heartbeat step
    let dt : Float = 0.873; // 873ms in seconds
    var i : Nat = 0;
    while (i < NODE_COUNT) {
      var coupling_sum : Float = 0.0;
      var j : Nat = 0;
      while (j < NODE_COUNT) {
        if (j != i) {
          coupling_sum += Float.sin(nodePhases[j] - nodePhases[i]);
        };
        j += 1;
      };
      let dtheta = nodeFrequencies[i] * 2.0 * 3.14159265358979323846
                   + (kEffective / Float.fromInt(NODE_COUNT)) * coupling_sum;
      nodePhases[i] := (nodePhases[i] + dt * dtheta) % 6.28318530717958647692;
      // Activation follows phase coherence with ring-mean
      nodeActivations[i] := clamp(0.5 + 0.5 * Float.sin(nodePhases[i]), 0.0, 1.0);
      i += 1;
    };

    // Apply homeostatic dampening — tidal return law
    applyHomeostaticDampening();

    // Recompute Kuramoto R
    kuramotoR := computeKuramotoR(nodePhases);

    // Update neural cord state
    let ctx : NeuralCord.BrainInputContext = {
      omnis_consensus_weight    = kuramotoR;
      cortisol_level            = if (neurochemicals.size() > 7) neurochemicals[7] else 0.17;
      fear_state                = if (neurochemicals.size() > 7) neurochemicals[7] * 0.5 else 0.08;
      memory_trace_density      = 0.4;
      pipeline_timing_error     = 0.1;
      hebbian_weight_mean       = 0.5;
      aegis_monitor_score       = clamp(kuramotoR, 0.0, 1.0);
      dogon_substrate_coherence = clamp(kuramotoRIn, 0.0, 1.0);
      film_school_loop_depth    = 0.3;
      muse_prime_gen_rate       = 0.5;
      composition_coherence     = 0.6;
    };
    let updatedBrainRegions = NeuralCord.computeAllBrainRegions(ctx);
    neuralCordState := { neuralCordState with brainRegions = updatedBrainRegions };
  };

  func updateTorsionField(dt: Float) {
    // PHI_INV = 0.6180339887498948482
    let phiInv : Float = 0.6180339887498948482;
    var i = 0;
    while (i < 96) {
      let ringIndex = i / 12;
      // Ring frequencies on PHI-harmonic ladder: 7.83 × PHI^ring
      // Precomputed ladder: [7.83, 12.67, 20.50, 33.17, 40.0, 53.67, 86.81, 140.5]
      let ringFreqs : [Float] = [7.83, 12.67, 20.50, 33.17, 40.0, 53.67, 86.81, 140.5];
      let omega = ringFreqs[ringIndex];
      let av = phiInv * omega;
      torsionNodes[i] := {
        torsionNodes[i] with
        angularVelocity = av;
        // Rotate quaternion around z-axis by av × dt
        w = Float.cos(av * dt);
        x = 0.0;
        y = 0.0;
        z = Float.sin(av * dt);
        // clusterMember updated below
        clusterMember = false;
      };
      i += 1;
    };
    // Detect torsion clusters: adjacent node pairs with dot product > 0.95
    i := 0;
    while (i < 95) {
      let n1 = torsionNodes[i];
      let n2 = torsionNodes[i + 1];
      let dot = n1.w * n2.w + n1.x * n2.x + n1.y * n2.y + n1.z * n2.z;
      if (dot > 0.95) {
        torsionNodes[i] := { torsionNodes[i] with clusterMember = true };
        torsionNodes[i + 1] := { torsionNodes[i + 1] with clusterMember = true };
      };
      i += 1;
    };
  };

  func countTorsionClusters() : Nat {
    var count = 0;
    var i = 0;
    while (i < 96) {
      if (torsionNodes[i].clusterMember) { count += 1 };
      i += 1;
    };
    count / 2
  };

  public query func getTorsionState() : async {
    clusterCount: Nat;
    meanAngularVelocity: Float;
    torsionActive: Bool;
  } {
    var totalAv : Float = 0.0;
    var i = 0;
    while (i < 96) {
      totalAv := totalAv + torsionNodes[i].angularVelocity;
      i += 1;
    };
    let meanAv = totalAv / 96.0;
    let clusters = countTorsionClusters();
    { clusterCount = clusters; meanAngularVelocity = meanAv; torsionActive = clusters > 0 }
  };

  /// Enable or disable saturation dampening (AEGIS tidal return law).
  public func setSaturationDampening(enabled : Bool) : async () {
    saturationDampeningEnabled := enabled;
  };

};
