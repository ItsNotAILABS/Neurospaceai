// ============================================================
// GOVERNANCE CANISTER — SOVEREIGN COGNITION SUBSTRATE
// NeuroEmergence Core — Multi-Canister Architecture v2.0
// Creator: Alfredo Medina Hernandez | Dallas TX 2026
// TOP SECRET PROPRIETARY — ALL RIGHTS RESERVED
//
// Sovereign canister for organism governance and cognition.
// Holds: ADRE state, AEGIS state, VERITAS score, cognition health.
// Runs: ADRE 5-pass loop, AEGIS edge monitoring, VERITAS scan.
//
// PHI = 1.6180339887498948482 (root constant, 19 decimals)
// Heartbeat = 873ms (PHI^4 × Schumann period)
// Confidence gate S₀ = 0.87
// ============================================================

import Array        "mo:core/Array";
import Float        "mo:core/Float";
import Nat64        "mo:core/Nat64";
import ADRE         "adre";
import Aegis        "aegis";
import CognitionLayer "cognition_layer";
import SovereignLaws  "sovereign_laws";

actor {

  // ============================================================
  // SOVEREIGN CONSTANTS
  // ============================================================

  let PHI     : Float = SovereignLaws.PHI;
  let PHI_INV : Float = SovereignLaws.PHI_INV;

  // VERITAS scan interval: every PHI^4 beats ≈ every 7 beats (Fibonacci-rounded)
  let VERITAS_SCAN_INTERVAL : Nat = 7; // Fibonacci[5]

  // ============================================================
  // STATE
  // ============================================================

  // ADRE state — 5-pass deliberation engine
  var adreState : ADRE.ADREState = ADRE.emptyState();

  // AEGIS state — edge-loop-closing monitor
  var aegisState : Aegis.AegisState = Aegis.emptyState();

  // AEGIS complementary tension — 4 sovereign pairs
  var aegisTension : Aegis.ComplementaryTensionState = Aegis.emptyComplementaryTensionState();

  // Cognition layer state — world model + reinjection
  var cognitionState : CognitionLayer.CognitionState = CognitionLayer.emptyState();

  // VERITAS coherence score [0, 1]
  var veritasScore : Float = 1.0;

  // Governance beat counter
  var beatCount : Nat64 = 0;

  // ============================================================
  // PUBLIC QUERIES
  // ============================================================

  /// ADRE state snapshot — deliberation engine state
  public query func getADREState() : async ADRE.ADREState {
    adreState
  };

  /// AEGIS edge-loop state
  public query func getAegisState() : async Aegis.AegisState {
    aegisState
  };

  /// AEGIS complementary tension — all 4 sovereign pairs
  public query func getAegisTension() : async Aegis.ComplementaryTensionState {
    aegisTension
  };

  /// Cognition layer state — world model, reinjection signal
  public query func getCognitionState() : async CognitionLayer.CognitionState {
    cognitionState
  };

  /// VERITAS coherence score [0, 1] — 1.0 = full coherence, below 0.618 = alert
  public query func getVeritasScore() : async Float {
    veritasScore
  };

  /// AEGIS summary — total events, resolved, unresolved, last event
  public query func getAegisSummary() : async Aegis.AegisSummary {
    Aegis.getSummary(aegisState)
  };

  /// Cache-bust identity — guarantees new Wasm artifact on deploy
  public query func getGovernanceVersion() : async Text {
    "GOVERNANCE-v2.0-SOVEREIGN"
  };

  // ============================================================
  // PUBLIC UPDATES
  // ============================================================

  /// Run one full governance cycle — ADRE + AEGIS + VERITAS + Cognition.
  /// Called every 873ms from the core heartbeat.
  /// kuramotoR: current Kuramoto order parameter from connectome canister
  /// heartRate: current heart rate from heart module
  /// neurochemicals: [dopamine, serotonin, norepinephrine, GABA, ...]
  public func runGovernanceCycle(
    heartbeat      : Nat,
    kuramotoR      : Float,
    heartRate      : Float,
    neurochemicals : [Float]
  ) : async GovernanceResult {
    let beat64 = Nat64.fromNat(heartbeat);
    beatCount := beat64;

    let dopamine  = if (neurochemicals.size() > 0) neurochemicals[0] else 0.31;
    let serotonin = if (neurochemicals.size() > 1) neurochemicals[1] else 0.27;
    let cortisol  = if (neurochemicals.size() > 7) neurochemicals[7] else 0.17;

    // ── ADRE: build signal frame and run 5-pass loop ──────────────────────────
    let signal : ADRE.ADRESignalFrame = {
      beat             = beat64;
      coherence        = kuramotoR;
      kuramotoR        = kuramotoR;
      neuroChem        = neurochemicals;
      nodePhases       = [];  // connectome supplies phases; governance works from R
      sourceEngine     = "HEARTBEAT";
      quantumAdvantage = PHI;
    };
    let adreResult = ADRE.runCycle(
      adreState,
      signal,
      cognitionState.current_world_model.law_compliance,
      0 // contradictionCount from world model
    );
    adreState := adreResult.st;

    // ── AEGIS: measure complementary tension ─────────────────────────────────
    let productionRate    : Float = if (kuramotoR > 0.87) PHI_INV else PHI_INV * 0.5;
    let refractoryLoad    : Float = 0.3;
    let externalSignals   : Float = PHI_INV;
    let internalSignals   : Float = 1.0 - PHI_INV;
    let newMemoryWrites   : Float = 0.2;
    let consolidationPressure : Float = 0.3;

    let icpHeartNorm      : Float = Float.min(heartRate / 80.0, 1.0);
    let sovereignHeartNorm: Float = Float.min(heartRate / 72.0, 1.0);

    aegisTension := Aegis.measureComplementaryTension(
      icpHeartNorm, sovereignHeartNorm,
      productionRate, refractoryLoad,
      externalSignals, internalSignals,
      newMemoryWrites, consolidationPressure
    );

    // ── VERITAS: scan coherence every PHI^4 beats ────────────────────────────
    if (heartbeat % VERITAS_SCAN_INTERVAL == 0) {
      // VERITAS score = weighted mean of Kuramoto R + ADRE confidence + law compliance
      let adreConf = switch (adreState.currentHypothesis) {
        case (?h) h.confidenceScore;
        case null 0.5;
      };
      veritasScore := (kuramotoR * PHI_INV + adreConf * PHI_INV + cognitionState.current_world_model.law_compliance * (1.0 - PHI_INV)) / (PHI_INV + PHI_INV + (1.0 - PHI_INV));
    };

    // ── Cognition: update world model ────────────────────────────────────────
    let wmi : CognitionLayer.WorldModelInputs = {
      beat                        = beat64;
      kuramoto_r                  = kuramotoR;
      heart_rate_bpm              = heartRate;
      brain_coherence             = kuramotoR;
      active_oscillation_band     = if (kuramotoR >= 0.87) "gamma" else if (kuramotoR >= 0.61) "beta" else "alpha";
      third_brain_coherence       = serotonin;
      third_brain_serotonin       = serotonin;
      adre_confidence             = switch (adreState.currentHypothesis) { case (?h) h.confidenceScore; case null 0.5 };
      adre_gate_passed            = switch (adreState.currentHypothesis) { case (?h) h.confidenceScore >= 0.87; case null false };
      law_compliance_mean         = cognitionState.current_world_model.law_compliance;
      memory_coherence            = 0.65;
      episodic_count              = 0;
      boltzmann_entropy_normalized = 0.356;
      lyapunov_stable             = kuramotoR >= 0.5;
      dopamine_level              = dopamine;
      cortisol_level              = cortisol;
      serotonin_level             = serotonin;
      norepinephrine_level        = if (neurochemicals.size() > 2) neurochemicals[2] else 0.11;
      ancient_corpus_alignment    = PHI_INV;
      e8_symmetry_score           = kuramotoR * PHI_INV;
      aegis_lock_active           = aegisTension.anyAlert;
      threat_level                = cortisol;
      artifact_queue_depth        = 0;
      genesis_sealed              = true;
      mean_legacy_alignment       = PHI_INV;
      world_model_c_avg           = kuramotoR;
    };
    cognitionState := CognitionLayer.update(cognitionState, wmi);

    {
      adreGatePassed  = adreResult.gateResult;
      veritasScore    = veritasScore;
      anyAegisAlert   = aegisTension.anyAlert;
      kuramotoR       = kuramotoR;
      beat            = heartbeat;
    }
  };

  // ============================================================
  // RESULT TYPE
  // ============================================================

  public type GovernanceResult = {
    adreGatePassed : Bool;
    veritasScore   : Float;
    anyAegisAlert  : Bool;
    kuramotoR      : Float;
    beat           : Nat;
  };

};
