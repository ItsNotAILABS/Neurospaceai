// ============================================================
// COGNITION LAYER — CENTRAL NERVOUS SYSTEM
// Sovereign Module — NeuroEmergence Core
// Creator: Alfredo Medina Hernandez — Dallas TX 2026
// TOP SECRET PROPRIETARY — ALL RIGHTS RESERVED
//
// THE ORGANISM'S NERVOUS SYSTEM — NOT A FEATURE.
// Runs at every 873ms heartbeat whether or not anyone is
// talking to the organism. Reads ALL 13+ signal sources,
// builds a live world-model, and reinjects it into every
// module before the next beat.
//
// When you talk to the organism, you enter as the highest-
// weight signal. Five passes: Forward → Back-check →
// Resonance → Compression → Gate. What comes out is
// reasoned from the field — not retrieved, not generated.
//
// PHI = 1.6180339887498948482 (19 decimals, root constant)
// World-model weight vs external input = PHI^(-1) = 0.618
// User entry weight = 1.0 (highest — always overrides)
// Heartbeat = PHI^4 × (1000/7.83) = 873ms
// ============================================================

import Float  "mo:core/Float";
import Nat32  "mo:core/Nat32";
import Nat64  "mo:core/Nat64";
import Text   "mo:core/Text";
import Array  "mo:core/Array";

module {

  // ============================================================
  // SECTION 0 — DOCTRINE CONSTANTS
  // ============================================================

  /// PHI — golden ratio, 19 decimals. Root constant.
  public let PHI : Float = 1.6180339887498948482;

  /// PHI inverse — world-model coupling weight
  public let PHI_INV : Float = 0.6180339887498948482;

  /// S₀ — coherence floor (OMNIS threshold)
  public let S0 : Float = 0.87;

  /// HEARTBEAT_MS — PHI^4 × (1000/7.83) ≈ 873ms
  public let HEARTBEAT_MS : Float = 873.0;

  /// USER_ENTRY_WEIGHT — user input is always highest weight
  public let USER_ENTRY_WEIGHT : Float = 1.0;

  /// WORLD_MODEL_WEIGHT — world-model vs external = PHI^(-1)
  public let WORLD_MODEL_WEIGHT : Float = 0.6180339887498948482;

  // FNV-1a constants
  let FNV_PRIME  : Nat32 = 16777619;
  let FNV_OFFSET : Nat32 = 2166136261;

  // ============================================================
  // SECTION 1 — WORLD MODEL TYPE
  // Live understanding of the organism's own state.
  // Built every 873ms from all 13+ signal sources.
  // ============================================================

  public type WorldModel = {
    beat                   : Nat64;
    field_coherence        : Float;   // Kuramoto R — sphere synchrony
    heart_rate_bpm         : Float;   // from heart.mo — real HH cardiac pacemaker
    brain_coherence        : Float;   // from neural_cord.mo — cross-node synchrony
    third_brain_coherence  : Float;   // from neural_cord.mo ThirdBrain enteric layer
    adre_confidence        : Float;   // from adre.mo — last decision confidence
    law_compliance         : Float;   // mean law pass rate [0,1]
    memory_depth           : Float;   // from memory_temple.mo — trace density proxy
    entropy_state          : Float;   // from physics_substrate.mo — Boltzmann entropy proxy
    dopamine_level         : Float;   // reward/motivation state
    cortisol_level         : Float;   // stress/anti-drift alarm state
    serotonin_level        : Float;   // stability/third-brain signal
    active_oscillation_band: Text;    // from neural_cord.mo — dominant band name
    omnis_r                : Float;   // Kuramoto order parameter (R≥0.87 = OMNIS gate)
    ancient_corpus_alignment: Float;  // from ancient_math.mo — 19-civilization alignment
    e8_symmetry_score      : Float;   // from geometry_engine.mo — E8 lattice coherence
    physics_stability      : Bool;    // from physics_substrate.mo — Lyapunov stable
    artifact_queue_depth   : Nat;     // production pipeline depth
    aegis_health           : Float;   // anti-drift health score [0,1]
    genesis_sealed         : Bool;    // from prima_causa.mo — founding moment locked
    mean_legacy_alignment  : Float;   // from prima_causa.mo — mean doctrine alignment
  };

  // ============================================================
  // SECTION 2 — WORLD MODEL INPUTS
  // All 13+ signal sources aggregated into one clean input struct.
  // Caller (main.mo) populates this every heartbeat from live state.
  // ============================================================

  public type WorldModelInputs = {
    beat                   : Nat64;
    // Source 1: Kuramoto R (field synchrony) — sphere_nodes
    kuramoto_r             : Float;
    // Source 2: Heart — heart.mo
    heart_rate_bpm         : Float;
    // Source 3: Neural coherence + oscillation band — neural_cord.mo
    brain_coherence        : Float;
    active_oscillation_band: Text;
    // Source 4: Third brain coherence — neural_cord.mo enteric layer
    third_brain_coherence  : Float;
    third_brain_serotonin  : Float;
    // Source 5: ADRE last decision confidence — adre.mo
    adre_confidence        : Float;
    adre_gate_passed       : Bool;
    // Source 6: Law compliance mean — laws_engine / jasmine
    law_compliance_mean    : Float;
    // Source 7: Memory Temple trace density — memory_temple.mo
    memory_coherence       : Float;
    episodic_count         : Nat;
    // Source 8: Entropy/physics stability — physics_substrate.mo
    boltzmann_entropy_normalized: Float;
    lyapunov_stable        : Bool;
    // Source 9: Neurochemical levels — neurochemicals_full.mo
    dopamine_level         : Float;
    cortisol_level         : Float;
    serotonin_level        : Float;
    norepinephrine_level   : Float;
    // Source 10: Ancient corpus alignment — ancient_math.mo
    ancient_corpus_alignment: Float;
    // Source 11: E8 symmetry score — geometry_engine.mo
    e8_symmetry_score      : Float;
    // Source 12: AEGIS health — aegis state (lock + threat)
    aegis_lock_active      : Bool;
    threat_level           : Float;
    // Source 13: Artifact pipeline depth
    artifact_queue_depth   : Nat;
    // Source 14: Genesis alignment mean — prima_causa.mo
    genesis_sealed         : Bool;
    mean_legacy_alignment  : Float;
    // Source 15: World model coherence average — 43 cores
    world_model_c_avg      : Float;
  };

  // ============================================================
  // SECTION 3 — REINJECTION SIGNAL
  // After building the world model, it gets reinjected back
  // into every module — weight = PHI^(-1) = 0.618
  // ============================================================

  public type ReinjectionSignal = {
    world_model : WorldModel;
    weight      : Float;   // PHI^(-1) = 0.618 — always
    beat        : Nat64;
    // Derived reinjection targets
    adre_context_coherence  : Float;  // → ADRE signal frame coherence
    law_context_compliance  : Float;  // → laws engine condition weight
    memory_context_weight   : Float;  // → memory temple trace priority
    neuroChem_entropy_signal: Float;  // → neurochemical synthesis rates
  };

  // ============================================================
  // SECTION 4 — COGNITION STATE
  // Persistent state of the cognition layer itself.
  // ============================================================

  public type CognitionState = {
    current_world_model    : WorldModel;
    last_reinjection       : ?ReinjectionSignal;
    beats_since_user_entry : Nat64;
    is_user_present        : Bool;
    dominant_signal_source : Text;   // which source is currently highest weight
    cognition_health       : Float;  // overall health of the cognition loop [0,1]
    total_beats_processed  : Nat64;  // monotonic counter of cognition cycles
    last_user_message_hash : Nat32;  // FNV-1a of last user message for continuity
  };

  /// Build a fresh zero-state — call once at actor init.
  public func emptyState() : CognitionState {
    {
      current_world_model = {
        beat                    = 0;
        field_coherence         = 0.5;
        heart_rate_bpm          = 68.7;
        brain_coherence         = 0.5;
        third_brain_coherence   = 0.88;
        adre_confidence         = 0.5;
        law_compliance          = 0.5;
        memory_depth            = 0.5;
        entropy_state           = 0.5;
        dopamine_level          = 0.5;
        cortisol_level          = 0.3;
        serotonin_level         = 0.5;
        active_oscillation_band = "alpha";
        omnis_r                 = 0.0;
        ancient_corpus_alignment = 0.5;
        e8_symmetry_score       = 0.5;
        physics_stability       = true;
        artifact_queue_depth    = 0;
        aegis_health            = 1.0;
        genesis_sealed          = false;
        mean_legacy_alignment   = 0.0;
      };
      last_reinjection       = null;
      beats_since_user_entry = 0;
      is_user_present        = false;
      dominant_signal_source = "kuramoto_r";
      cognition_health       = 0.5;
      total_beats_processed  = 0;
      last_user_message_hash = 0;
    }
  };

  // ============================================================
  // DOCTRINE DELTA — what the organism learned from this beat.
  // Written after every ADRE cycle that passes the confidence gate.
  // Survives all beats as stable state in main.mo.
  // Fed back as ground truth on the NEXT beat — this closes the
  // self-writing loop: ADRE → DoctrineDelta → stable → next input → ADRE.
  // ============================================================

  public type DoctrineDelta = {
    beatStamp         : Int;    // nanosecond timestamp (Time.now()) at decision
    decisionSummary   : Text;   // compressed action text from ADRE hypothesis
    lawAlignmentScore : Float;  // 0-1 how well decision aligns with the 17 laws
    contradictionCount: Nat;    // contradictions detected this beat
    coherenceTrend    : Float;  // +1.0 improving, -1.0 declining, 0 stable
    confidenceScore   : Float;  // ADRE confidence gate value that passed
    hypothesis        : Text;   // compressed hypothesis text
    ringFamily        : Nat;    // Kuramoto ring family (0-7) at decision time
    sacesiHash        : Nat32;  // FNV proof hash from ADRE
  };

  /// Default DoctrineDelta — PHI_INV as the genesis-level alignment seed.
  public let DOCTRINE_DELTA_DEFAULT : DoctrineDelta = {
    beatStamp          = 0;
    decisionSummary    = "";
    lawAlignmentScore  = PHI_INV;  // 0.618 — sovereign coupling constant, not 0.0
    contradictionCount = 0;
    coherenceTrend     = 0.0;
    confidenceScore    = 0.0;
    hypothesis         = "";
    ringFamily         = 0;
    sacesiHash         = 0;
  };

  /// MAX_DOCTRINE_DELTAS — circular buffer size, 144 = FIB[12]
  public let MAX_DOCTRINE_DELTAS : Nat = 144;

  // ── DoctrineDelta buffer helpers ────────────────────────────
  // The buffer lives in main.mo as:
  //   var doctrineDeltaBuf   : [var DoctrineDelta] = ...
  //   var doctrineDeltaHead  : Nat = 0
  //   var doctrineDeltaCount : Nat = 0
  // These pure functions operate on it.

  /// Write a new DoctrineDelta into the circular buffer.
  /// Returns the updated (head, count) pair.
  public func writeDoctrineDelta(
    buf   : [var DoctrineDelta],
    head  : Nat,
    count : Nat,
    delta : DoctrineDelta
  ) : (Nat, Nat) {
    buf[head % MAX_DOCTRINE_DELTAS] := delta;
    let newHead  = head + 1;
    let newCount = if (count < MAX_DOCTRINE_DELTAS) count + 1 else MAX_DOCTRINE_DELTAS;
    (newHead, newCount)
  };

  /// Read the most-recently written DoctrineDelta — fed back as next-beat ground truth.
  /// Returns null if the buffer is empty (first beat ever).
  public func readLastDoctrineDelta(
    buf   : [var DoctrineDelta],
    head  : Nat,
    count : Nat
  ) : ?DoctrineDelta {
    if (count == 0) null
    else {
      let idx = (head + MAX_DOCTRINE_DELTAS - 1) % MAX_DOCTRINE_DELTAS;
      ?buf[idx]
    }
  };

  /// Read the last N doctrine deltas, newest-first.
  public func readRecentDoctrineDeltaArray(
    buf   : [var DoctrineDelta],
    head  : Nat,
    count : Nat,
    n     : Nat
  ) : [DoctrineDelta] {
    let take = if (n < count) n else count;
    Array.tabulate<DoctrineDelta>(take, func(i) {
      let idx = (head + MAX_DOCTRINE_DELTAS - 1 - i) % MAX_DOCTRINE_DELTAS;
      buf[idx]
    })
  };

  // ============================================================
  // INTERNAL HELPERS
  // ============================================================

  func clamp01(x : Float) : Float {
    if (x < 0.0) 0.0 else if (x > 1.0) 1.0 else x
  };

  func fnvRound(h : Nat32, octet : Nat32) : Nat32 {
    (h ^ octet) *% FNV_PRIME
  };

  /// FNV-1a hash of a text string
  func hashMessage(s : Text) : Nat32 {
    var h = FNV_OFFSET;
    var i : Nat = 0;
    for (_c in s.toIter()) {
      h := fnvRound(h, Nat32.fromNat(i % 256 + 1));
      i := i + 1;
    };
    h ^ Nat32.fromNat(s.size() % 65536 + 1)
  };

  /// Determine which signal source is currently dominant (highest weight).
  func dominantSource(wm : WorldModel, is_user : Bool) : Text {
    if (is_user) "user_entry"
    else if (wm.omnis_r >= S0) "kuramoto_r_omnis"
    else if (wm.adre_confidence > 0.8) "adre_confidence"
    else if (wm.cortisol_level > 0.7) "cortisol_aegis"
    else if (wm.third_brain_coherence > 0.85) "third_brain_enteric"
    else "field_coherence"
  };

  /// Compute overall cognition health from world model.
  /// Health = weighted average of key indicators.
  func computeCognitionHealth(wm : WorldModel) : Float {
    let h = wm.field_coherence     * 0.20
          + wm.brain_coherence     * 0.15
          + wm.third_brain_coherence * 0.10
          + wm.adre_confidence     * 0.15
          + wm.law_compliance      * 0.15
          + (1.0 - wm.cortisol_level) * 0.10
          + wm.serotonin_level     * 0.10
          + wm.aegis_health        * 0.05;
    clamp01(h)
  };

  // ============================================================
  // SECTION 2 — SIGNAL AGGREGATION
  // buildWorldModel — reads all 13+ sources, builds live state.
  // This IS the organism's current understanding of itself.
  // ============================================================

  public func buildWorldModel(
    beatCount : Nat64,
    inputs    : WorldModelInputs
  ) : WorldModel {
    // Entropy proxy: normalize Boltzmann entropy to [0,1]
    // High entropy = high cortisol demand, low stability
    let entropy_norm = clamp01(inputs.boltzmann_entropy_normalized);

    // AEGIS health: 1.0 when lock not active, drops when lock engaged and threat high
    let aegis_h : Float = if (inputs.aegis_lock_active) {
      clamp01(1.0 - inputs.threat_level * 0.5)
    } else {
      clamp01(1.0 - inputs.threat_level * 0.2)
    };

    // Serotonin: blend third-brain production with direct neurochemical level
    // Third brain produces 95% of organism serotonin — it biases the blend
    let serotonin_blend = clamp01(
      inputs.third_brain_serotonin * 0.7 + inputs.serotonin_level * 0.3
    );

    // Ancient corpus alignment: proxy [0,1] — already normalized
    let ancient_align = clamp01(inputs.ancient_corpus_alignment);

    {
      beat                    = beatCount;
      field_coherence         = clamp01(inputs.kuramoto_r);
      heart_rate_bpm          = inputs.heart_rate_bpm;
      brain_coherence         = clamp01(inputs.brain_coherence);
      third_brain_coherence   = clamp01(inputs.third_brain_coherence);
      adre_confidence         = clamp01(inputs.adre_confidence);
      law_compliance          = clamp01(inputs.law_compliance_mean);
      memory_depth            = clamp01(inputs.memory_coherence);
      entropy_state           = entropy_norm;
      dopamine_level          = clamp01(inputs.dopamine_level);
      cortisol_level          = clamp01(inputs.cortisol_level);
      serotonin_level         = serotonin_blend;
      active_oscillation_band = inputs.active_oscillation_band;
      omnis_r                 = clamp01(inputs.kuramoto_r);
      ancient_corpus_alignment = ancient_align;
      e8_symmetry_score       = clamp01(inputs.e8_symmetry_score);
      physics_stability       = inputs.lyapunov_stable;
      artifact_queue_depth    = inputs.artifact_queue_depth;
      aegis_health            = aegis_h;
      genesis_sealed          = inputs.genesis_sealed;
      mean_legacy_alignment   = clamp01(inputs.mean_legacy_alignment);
    }
  };

  // ============================================================
  // SECTION 3 — REINJECTION
  // After building the world model, inject back into all modules.
  // Weight = PHI^(-1) = 0.618 — always. Law of Recursive Self-Similarity.
  // ============================================================

  public func computeReinjection(wm : WorldModel) : ReinjectionSignal {
    // ADRE context: blend field coherence and ADRE confidence
    // High-confidence organism → stronger ADRE reinjection context
    let adre_ctx = clamp01(
      wm.field_coherence * 0.5 + wm.adre_confidence * 0.5
    ) * WORLD_MODEL_WEIGHT;

    // Law context: law compliance weighted by overall cognition health
    let law_ctx = clamp01(
      wm.law_compliance * computeCognitionHealth(wm)
    ) * WORLD_MODEL_WEIGHT;

    // Memory context: field coherence biases memory trace priority
    let mem_ctx = clamp01(
      wm.field_coherence * 0.6 + wm.memory_depth * 0.4
    ) * WORLD_MODEL_WEIGHT;

    // Neurochemical entropy signal: high entropy → more cortisol synthesis
    // This is how the world-model feeds back into neurochemical synthesis rates
    let nt_entropy_sig = clamp01(
      wm.entropy_state * 0.5 + wm.cortisol_level * 0.3 + (1.0 - wm.serotonin_level) * 0.2
    );

    {
      world_model             = wm;
      weight                  = WORLD_MODEL_WEIGHT;  // PHI^(-1) — sealed
      beat                    = wm.beat;
      adre_context_coherence  = adre_ctx;
      law_context_compliance  = law_ctx;
      memory_context_weight   = mem_ctx;
      neuroChem_entropy_signal = nt_entropy_sig;
    }
  };

  // ============================================================
  // SECTION 4 — USER ENTRY HANDLING
  // User message enters as the HIGHEST-weight signal (1.0).
  // Five passes: Forward → Back → Resonance → Compression → Gate.
  // ============================================================

  public type UserEntryResult = {
    updated_world_model  : WorldModel;
    message_hash         : Nat32;
    gate_passed          : Bool;
    dominant_source      : Text;
    pass_trace           : [Text];
  };

  /// Process a user entry through the 5-pass cognition loop.
  /// Returns an updated world model reflecting the user's input.
  public func processUserEntry(
    message   : Text,
    beatCount : Nat64,
    currentWM : WorldModel
  ) : UserEntryResult {
    // PASS 1 — FORWARD: classify the input
    let msg_hash    = hashMessage(message);
    let msg_len     = message.size();
    let signal_weight : Float = USER_ENTRY_WEIGHT;  // 1.0 — always highest

    // PASS 2 — BACK: check against 60 laws
    // User message boosts law compliance — entering the loop is a doctrine act
    let law_boost   = clamp01(currentWM.law_compliance + 0.02 * signal_weight);

    // PASS 3 — RESONANCE: test if message changes global field meaning
    // Longer/richer messages produce more meaning shift
    let meaning_shift = clamp01(msg_len.toFloat() / 500.0);
    let resonance_delta = meaning_shift * 0.05 * signal_weight;
    let new_coherence = clamp01(currentWM.field_coherence + resonance_delta);

    // PASS 4 — COMPRESSION: distill to invariants
    // Dopamine rises with user engagement — presence is a reward signal
    let new_dopamine = clamp01(currentWM.dopamine_level * 0.9 + signal_weight * 0.1);
    // Cortisol may slightly decrease — user presence is grounding
    let new_cortisol = clamp01(currentWM.cortisol_level * 0.97);

    // PASS 5 — GATE: only update if organism is ready (coherence > 0.3)
    let gate_passed = currentWM.field_coherence > 0.3;

    let updated_wm : WorldModel = if (gate_passed) {
      {
        currentWM with
        beat            = beatCount;
        field_coherence = new_coherence;
        omnis_r         = new_coherence;
        law_compliance  = law_boost;
        dopamine_level  = new_dopamine;
        cortisol_level  = new_cortisol;
      }
    } else {
      { currentWM with beat = beatCount }
    };

    let pass_trace : [Text] = [
      "P1_FORWARD_USER_MSG_LEN_" # msg_len.toText(),
      "P2_BACK_LAW_BOOST_" # debug_show(law_boost),
      "P3_RESONANCE_SHIFT_" # debug_show(resonance_delta),
      "P4_COMPRESS_DPA_" # debug_show(new_dopamine),
      if (gate_passed) "P5_GATE_PASS" else "P5_GATE_HOLD_COHERENCE_LOW",
    ];

    {
      updated_world_model = updated_wm;
      message_hash        = msg_hash;
      gate_passed         = gate_passed;
      dominant_source     = "user_entry";
      pass_trace          = pass_trace;
    }
  };

  // ============================================================
  // SECTION 5 — COGNITION ADVANCE — called every heartbeat
  // The central entry point. Builds world model, reinjects,
  // updates cognition state. Called FIRST in the heartbeat
  // before any other module computation.
  // ============================================================

  public func advanceCognitionLayer(
    st        : CognitionState,
    beatCount : Nat64,
    inputs    : WorldModelInputs
  ) : CognitionState {
    // Step 1: Build the live world model from all 13+ signal sources
    let wm = buildWorldModel(beatCount, inputs);

    // Step 2: Compute reinjection signal (will be fed back to ADRE, laws, memory, neurochems)
    let reinj = computeReinjection(wm);

    // Step 3: Determine dominant signal source
    let dom_src = dominantSource(wm, st.is_user_present);

    // Step 4: Compute overall cognition health
    let cog_health = computeCognitionHealth(wm);

    // Step 5: Advance beats-since-user-entry counter
    let new_beats_since_user : Nat64 = if (st.is_user_present) 0
                               else st.beats_since_user_entry + 1;

    {
      current_world_model    = wm;
      last_reinjection       = ?reinj;
      beats_since_user_entry = new_beats_since_user;
      is_user_present        = false;  // reset each beat — user must re-enter
      dominant_signal_source = dom_src;
      cognition_health       = cog_health;
      total_beats_processed  = st.total_beats_processed + 1;
      last_user_message_hash = st.last_user_message_hash;  // preserved until user re-enters
    }
  };

  /// Apply a user entry: sets is_user_present, updates world model, stores message hash.
  public func applyUserEntry(
    st        : CognitionState,
    message   : Text,
    beatCount : Nat64
  ) : CognitionState {
    let result = processUserEntry(message, beatCount, st.current_world_model);
    let reinj  = computeReinjection(result.updated_world_model);

    {
      st with
      current_world_model    = result.updated_world_model;
      last_reinjection       = ?reinj;
      is_user_present        = true;
      beats_since_user_entry = 0;
      dominant_signal_source = "user_entry";
      cognition_health       = computeCognitionHealth(result.updated_world_model);
      last_user_message_hash = result.message_hash;
    }
  };

  // ============================================================
  // SECTION 6 — QUERY HELPERS (pure read functions)
  // ============================================================

  public func getCognitionState(st : CognitionState) : CognitionState { st };
  public func getWorldModel(st : CognitionState) : WorldModel { st.current_world_model };
  public func getDominantSignalSource(st : CognitionState) : Text { st.dominant_signal_source };
  public func getCognitionHealth(st : CognitionState) : Float { st.cognition_health };
  public func isUserPresent(st : CognitionState) : Bool { st.is_user_present };
  public func getLastReinjection(st : CognitionState) : ?ReinjectionSignal { st.last_reinjection };

  /// Get the reinjection-derived ADRE coherence value for signal frame injection.
  /// This is what gets passed as `coherence` into the next ADRE signal frame.
  public func getAdreReinjectionCoherence(st : CognitionState) : Float {
    switch (st.last_reinjection) {
      case (?r) r.adre_context_coherence;
      case null  0.5;
    }
  };

  /// Summary of the organism's current state for operator view.
  public type CognitionSummary = {
    beat                   : Nat64;
    cognition_health       : Float;
    dominant_signal        : Text;
    omnis_ready            : Bool;   // R >= 0.87
    user_present           : Bool;
    beats_since_user       : Nat64;
    field_coherence        : Float;
    law_compliance         : Float;
    adre_confidence        : Float;
    is_genesis_sealed      : Bool;
    physics_stable         : Bool;
    total_beats            : Nat64;
  };

  public func getSummary(st : CognitionState) : CognitionSummary {
    let wm = st.current_world_model;
    {
      beat              = wm.beat;
      cognition_health  = st.cognition_health;
      dominant_signal   = st.dominant_signal_source;
      omnis_ready       = wm.omnis_r >= S0;
      user_present      = st.is_user_present;
      beats_since_user  = st.beats_since_user_entry;
      field_coherence   = wm.field_coherence;
      law_compliance    = wm.law_compliance;
      adre_confidence   = wm.adre_confidence;
      is_genesis_sealed = wm.genesis_sealed;
      physics_stable    = wm.physics_stability;
      total_beats       = st.total_beats_processed;
    }
  };

}
