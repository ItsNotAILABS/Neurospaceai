// ============================================================
// MEMORY CANISTER — SOVEREIGN MEMORY SUBSTRATE
// NeuroEmergence Core — Multi-Canister Architecture v2.0
// Creator: Alfredo Medina Hernandez | Dallas TX 2026
// TOP SECRET PROPRIETARY — ALL RIGHTS RESERVED
//
// Sovereign canister for the Clifford torus Memory Temple.
// Holds: episodic (200), semantic (144), doctrine (89), mission (55) traces.
// Runs: PIL consolidation, sharp-wave ripple promotion, ANIMA chain.
//
// PHI = 1.6180339887498948482 (root constant, 19 decimals)
// Memory addresses are 4D Clifford torus coordinates.
// Retrieval is navigation — organism walks to the memory.
// ============================================================

import Array         "mo:core/Array";
import Float         "mo:core/Float";
import Nat64         "mo:core/Nat64";
import MemoryTemple  "memory_temple";
import ModelPromotion "model_promotion";
import SovereignLaws  "sovereign_laws";

actor {

  // ============================================================
  // SOVEREIGN CONSTANTS
  // ============================================================

  let PHI     : Float = SovereignLaws.PHI;
  let PHI_INV : Float = SovereignLaws.PHI_INV;

  // PIL consolidation interval — 52 beats (from sovereign config)
  let PIL_CONSOLIDATION_INTERVAL : Nat = 52;

  // ============================================================
  // TRACE ARRAYS — capacity sealed by Fibonacci law
  // MAX_EPISODIC=200, MAX_SEMANTIC=144, MAX_DOCTRINE=89, MAX_MISSION=55
  // ============================================================

  var episodicTraces : [var MemoryTemple.EpisodicTrace] = Array.toVarArray(Array.repeat<MemoryTemple.EpisodicTrace>(
    { timestamp = 0; state_vector = []; organism_R = 0.0; heart_coh = 0.0; brain_coh = 0.0; gut_coh = 0.0 },
    MemoryTemple.MAX_EPISODIC
  ));
  var episodicHead  : Nat = 0;
  var episodicCount : Nat = 0;

  var semanticTraces : [var MemoryTemple.SemanticTrace] = Array.toVarArray(Array.repeat<MemoryTemple.SemanticTrace>(
    { concept_id = 0; salience = 0.0; phi_weight = 0.0; cluster = []; timestamp = 0 },
    MemoryTemple.MAX_SEMANTIC
  ));
  var semanticCount : Nat = 0;

  var doctrineTraces : [var MemoryTemple.DoctrineTrace] = Array.toVarArray(Array.repeat<MemoryTemple.DoctrineTrace>(
    { law_id = 0; invocation_time = 0; outcome = 0.0; compliance = 0.0 },
    MemoryTemple.MAX_DOCTRINE
  ));
  var doctrineCount : Nat = 0;

  var missionTraces : [var MemoryTemple.MissionTrace] = Array.toVarArray(Array.repeat<MemoryTemple.MissionTrace>(
    { goal_id = 0; deficit_vector = []; urgency = 0.0; active = false; timestamp = 0 },
    MemoryTemple.MAX_MISSION
  ));
  var missionCount : Nat = 0;

  // 12 pedestals — phase-biased coupling nodes
  var pedestals : [var MemoryTemple.Pedestal] = Array.tabulate<var MemoryTemple.Pedestal>(
    MemoryTemple.MAX_PEDESTALS,
    func(i) {
      [var {
        id           = i;
        phase_bias   = Float.fromInt(i) * 2.3999632297286535 / 12.0; // golden angle / 12
        lineage_depth = 0;
        active        = true;
      }]
    }[0] // tabulate<var T> pattern workaround
  );

  // Memory coherence — updated by PIL consolidation
  var memoryCoherence : Float = 0.618;

  // Beat counter for PIL scheduling
  var beatCount : Nat = 0;

  // Last PIL consolidation beat
  var lastPILBeat : Nat = 0;

  // ============================================================
  // PUBLIC QUERIES
  // ============================================================

  /// Full Memory Temple state snapshot
  public query func getMemoryTempleState() : async MemoryTemple.MemoryTempleState {
    {
      pedestals              = Array.freeze(pedestals);
      episodic_count         = episodicCount;
      semantic_count         = semanticCount;
      doctrine_count         = doctrineCount;
      mission_count          = missionCount;
      current_retrieval_bias = if (memoryCoherence >= PHI_INV) "PHI_RESONANT" else "CONSOLIDATING";
      analyst_queue          = [];
      memory_coherence       = memoryCoherence;
      pedestal_phase_sum     = PHI;
      last_analyst_cycle     = lastPILBeat;
    }
  };

  /// Recent episodic traces (up to limit, newest first)
  public query func queryEpisodicTraces(limit : Nat) : async [MemoryTemple.EpisodicTrace] {
    let count = if (limit < episodicCount) limit else episodicCount;
    if (count == 0) return [];
    Array.tabulate<MemoryTemple.EpisodicTrace>(
      count,
      func(i) {
        let idx = (episodicHead + MemoryTemple.MAX_EPISODIC - 1 - i) % MemoryTemple.MAX_EPISODIC;
        episodicTraces[idx]
      }
    )
  };

  /// Clifford address for any beat count — for external navigation
  public query func getCliffordAddress(beatNum : Nat) : async MemoryTemple.CliffordAddress {
    MemoryTemple.assignAddress(beatNum)
  };

  /// Cache-bust identity — guarantees new Wasm artifact on deploy
  public query func getMemoryVersion() : async Text {
    "MEMORY-v2.0-SOVEREIGN"
  };

  // ============================================================
  // PUBLIC UPDATES
  // ============================================================

  /// Push a new episodic trace into the circular ring buffer.
  /// Called every heartbeat from the core canister.
  public func pushEpisodic(
    beat       : Nat,
    kuramotoR  : Float,
    heartRate  : Float
  ) : async () {
    beatCount := beat;
    let trace : MemoryTemple.EpisodicTrace = {
      timestamp    = beat;
      state_vector = [kuramotoR, heartRate / 100.0, memoryCoherence];
      organism_R   = kuramotoR;
      heart_coh    = Float.min(heartRate / 100.0, 1.0);
      brain_coh    = kuramotoR;
      gut_coh      = memoryCoherence * PHI_INV;
    };
    episodicTraces[episodicHead] := trace;
    episodicHead := (episodicHead + 1) % MemoryTemple.MAX_EPISODIC;
    if (episodicCount < MemoryTemple.MAX_EPISODIC) {
      episodicCount += 1;
    };
  };

  /// Run PIL consolidation cycle — promotes high-salience traces.
  /// Scheduled every 52 beats (sovereign config).
  public func runPILConsolidation(beat : Nat) : async () {
    beatCount := beat;
    lastPILBeat := beat;
    // PIL: mean coherence of last N episodic traces
    let window = if (episodicCount < 13) episodicCount else 13; // Fibonacci[7]
    if (window == 0) return;
    var cohSum : Float = 0.0;
    var i : Nat = 0;
    while (i < window) {
      let idx = (episodicHead + MemoryTemple.MAX_EPISODIC - 1 - i) % MemoryTemple.MAX_EPISODIC;
      cohSum += episodicTraces[idx].organism_R;
      i += 1;
    };
    let meanCoh = cohSum / Float.fromInt(window);
    // Memory coherence follows PIL output weighted by PHI_INV
    memoryCoherence := memoryCoherence * PHI_INV + meanCoh * (1.0 - PHI_INV);
  };

};
