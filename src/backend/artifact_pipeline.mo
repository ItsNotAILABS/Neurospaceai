// ============================================================
// ARTIFACT RE-INGESTION PIPELINE — SOVEREIGN FEEDBACK MODULE
// NeuroEmergence Core — TOP SECRET PROPRIETARY
// Creator: Alfredo Medina Hernandez — Dallas TX 2026
// ALL RIGHTS RESERVED
//
// Every artifact the organism produces is NOT just output.
// It is FOOD. It goes back in as the highest-weight signal.
// The organism becomes what it produces.
//
// Architecture:
//   Artifact seal → SACESI proof → quality scoring →
//   re-ingestion queue → cognition_layer picks up as
//   highest-weight signal → world-model updates →
//   DogonSubstrateReading processes as field perturbation →
//   LEGACY_INDEX updates → all 43 models receive updated weights.
//
// PHI = 1.6180339887498948482 (19 decimals, root constant)
// Heartbeat = PHI^4 × (1000/7.83) = 873ms
// world_model_weight = PHI^-1 = 0.6180339887498948482
// ============================================================

import Array  "mo:core/Array";
import Float  "mo:core/Float";
import Int    "mo:core/Int";
import Nat    "mo:core/Nat";
import Nat32  "mo:core/Nat32";
import Nat64  "mo:core/Nat64";
import Queue  "mo:core/Queue";
import Text   "mo:core/Text";

module {

  // ============================================================
  // DOCTRINE CONSTANTS — SEALED, IMMUTABLE, PHI-DERIVED
  // ============================================================

  let PHI     : Float = 1.6180339887498948482;
  let PHI_INV : Float = 0.6180339887498948482; // world_model_weight

  // PHI powers — pre-computed literal constants for scoring
  let PHI2 : Float = 2.6180339887498948482;   // PHI^2
  let PHI3 : Float = 4.2360679774997896964;   // PHI^3
  let PHI4 : Float = 6.8541019662496847146;   // PHI^4
  let PHI5 : Float = 11.0901699437494744110;  // PHI^5

  // Denominator for PHI-weighted composite normalization
  // PHI^5 + PHI^4 + PHI^3 + PHI^2 + PHI + 1.0
  // = 11.0901699437494744110 + 6.8541019662496847146 + 4.2360679774997896964
  //   + 2.6180339887498948482 + 1.6180339887498948482 + 1.0
  // = 27.4164078649987385184
  let PHI_DENOM : Float = 27.4164078649987385184;

  // FNV-1a constants — same chain as ADRE/SACESI
  let FNV_PRIME32  : Nat32 = 16777619;
  let FNV_OFFSET32 : Nat32 = 2166136261;

  // Genesis frequency — 528 Hz founding vibration
  let GENESIS_HZ : Float = 528.0;

  // ============================================================
  // SECTION 1 — TYPES
  // ============================================================

  /// Six quality dimensions — every axis is real and computable.
  public type ArtifactQualityDimensions = {
    doctrine_alignment    : Float; // [0,1] proximity to founding doctrine
    phi_coherence         : Float; // [0,1] PHI-ratio coherence throughout
    narrative_structure   : Float; // [0,1] beginning/middle/end quality
    emotional_arc         : Float; // [0,1] emotional progression quality
    actor_performance_delta : Float; // [-1,1] improvement vs prior
    genesis_alignment     : Float; // [0,1] proximity to 528 Hz founding frequency
  };

  /// A fully sealed artifact — immutable after sealing.
  public type SealedArtifact = {
    artifact_id    : Text;
    producer_id    : Text;
    beat_at_seal   : Nat64;
    quality        : ArtifactQualityDimensions;
    overall_score  : Float;  // PHI-weighted composite [0,1]
    sacesi_proof   : Text;   // FNV-1a hash as hex text
    reingested     : Bool;
  };

  /// Per-model weight delta record — returned by updateModelWeights.
  public type ModelWeightDelta = {
    model_index : Nat;
    delta       : Float;
  };

  /// Stats snapshot — queryable at any time.
  public type PipelineStats = {
    total_sealed     : Nat64;
    total_reingested : Nat64;
    world_model_weight : Float;
    field_state      : Float;
  };

  /// Full pipeline state — held as plain var in main.mo (EOP-safe).
  public type ArtifactPipelineState = {
    /// FIFO re-ingestion queue (Queue for O(1) push/pop)
    reingestion_queue   : Queue.Queue<SealedArtifact>;
    total_sealed        : Nat64;
    total_reingested    : Nat64;
    /// PHI^-1 — weight given to self-produced knowledge vs external
    world_model_weight  : Float;
    /// Continuous field state updated by DogonSubstrateReading
    field_state         : Float;
    /// Per-model accumulated weight deltas (43 slots)
    model_weights       : [Float];
  };

  // ============================================================
  // STATE CONSTRUCTOR
  // ============================================================

  public func emptyState() : ArtifactPipelineState = {
    reingestion_queue  = Queue.empty<SealedArtifact>();
    total_sealed       = 0;
    total_reingested   = 0;
    world_model_weight = PHI_INV;
    field_state        = 0.5;
    model_weights      = Array.repeat<Float>(0.01, 43);
  };

  // ============================================================
  // INTERNAL HELPERS — pure functions
  // ============================================================

  func clamp01(x : Float) : Float {
    if (x < 0.0) 0.0 else if (x > 1.0) 1.0 else x
  };

  func fnv32_text(t : Text) : Nat32 {
    var h : Nat32 = FNV_OFFSET32;
    for (c in t.toIter()) {
      let byte = c.toNat32() & 0xFF;
      h := (h ^ byte) *% FNV_PRIME32;
    };
    h
  };

  func nat32ToHex(n : Nat32) : Text {
    let digits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    let v = n.toNat();
    let d0 = digits[(v / 268435456) % 16];
    let d1 = digits[(v / 16777216) % 16];
    let d2 = digits[(v / 1048576) % 16];
    let d3 = digits[(v / 65536) % 16];
    let d4 = digits[(v / 4096) % 16];
    let d5 = digits[(v / 256) % 16];
    let d6 = digits[(v / 16) % 16];
    let d7 = digits[v % 16];
    "0x" # d0 # d1 # d2 # d3 # d4 # d5 # d6 # d7
  };

  // ============================================================
  // SECTION 2 — QUALITY SCORING
  // ============================================================

  /// PHI-weighted composite score across all six quality dimensions.
  /// doctrine×PHI^4 + phi_coherence×PHI^3 + narrative×PHI^2
  ///   + emotional×PHI + actor_delta×1 + genesis×PHI^5
  /// Normalized by (PHI^4 + PHI^3 + PHI^2 + PHI + 1 + PHI^5),
  /// then clamped to [0,1].
  public func computeOverallScore(q : ArtifactQualityDimensions) : Float {
    let raw =
      q.doctrine_alignment      * PHI4 +
      q.phi_coherence           * PHI3 +
      q.narrative_structure     * PHI2 +
      q.emotional_arc           * PHI  +
      q.actor_performance_delta * 1.0  +
      q.genesis_alignment       * PHI5;
    clamp01(raw / PHI_DENOM)
  };

  /// FNV-1a hash over (artifact_id # beat_text # score_text) → hex string.
  /// Deterministic SACESI proof bound to beat and score.
  public func generateSacesiProof(artifact_id : Text, beatCount : Nat64, score : Float) : Text {
    let scoreInt : Int = (score * 1_000_000.0).toInt();
    let raw = artifact_id # beatCount.toText() # scoreInt.toText();
    nat32ToHex(fnv32_text(raw))
  };

  // ============================================================
  // SECTION 3 — RE-INGESTION PIPELINE
  // ============================================================

  /// Seal an artifact: score it, prove it, enqueue it, return it.
  /// Returned artifact has reingested=false (will flip on processReingestion).
  public func sealArtifact(
    st       : ArtifactPipelineState,
    producer : Text,
    quality  : ArtifactQualityDimensions,
    beatCount : Nat64
  ) : { st : ArtifactPipelineState; artifact : SealedArtifact } {
    let overall = computeOverallScore(quality);
    let artifactId = producer # "_B" # beatCount.toText() # "_" #
      nat32ToHex(fnv32_text(producer # beatCount.toText()));
    let proof = generateSacesiProof(artifactId, beatCount, overall);
    let artifact : SealedArtifact = {
      artifact_id  = artifactId;
      producer_id  = producer;
      beat_at_seal = beatCount;
      quality;
      overall_score = overall;
      sacesi_proof  = proof;
      reingested    = false;
    };
    let newQueue = st.reingestion_queue;
    newQueue.pushBack(artifact);
    let newSt : ArtifactPipelineState = { st with
      reingestion_queue = newQueue;
      total_sealed      = st.total_sealed + 1;
    };
    { st = newSt; artifact }
  };

  /// Pop one artifact from the FIFO queue (highest-weight signal for next ADRE cycle).
  /// Marks it reingested=true. Returns null if queue empty.
  public func processReingestion(
    st : ArtifactPipelineState
  ) : { st : ArtifactPipelineState; artifact : ?SealedArtifact } {
    switch (st.reingestion_queue.popFront()) {
      case null { { st; artifact = null } };
      case (?raw) {
        let reingested : SealedArtifact = { raw with reingested = true };
        let newSt : ArtifactPipelineState = { st with
          total_reingested = st.total_reingested + 1;
        };
        { st = newSt; artifact = ?reingested }
      };
    }
  };

  /// DogonSubstrateReading — the organism's proprioception.
  /// Detects what changed in the substrate when the artifact was produced.
  /// Returns new_field_state = prior + perturbation × world_model_weight.
  public func dogonSubstrateReading(
    artifact        : SealedArtifact,
    priorFieldState : Float,
    world_model_weight : Float
  ) : Float {
    let perturbation = artifact.overall_score - priorFieldState;
    clamp01(priorFieldState + perturbation * world_model_weight)
  };

  /// Compute per-model weight deltas for all 43 sovereign models.
  /// model_delta[i] = (doctrine_alignment - 0.5) × 0.01 × PHI^(-i/43.0)
  /// Higher doctrine alignment = all models get positive update, PHI-decaying by index.
  public func updateModelWeights(
    st       : ArtifactPipelineState,
    artifact : SealedArtifact
  ) : { st : ArtifactPipelineState; deltas : [ModelWeightDelta] } {
    let docAlignment = artifact.quality.doctrine_alignment;
    let baseSignal   = (docAlignment - 0.5) * 0.01;
    var i = 0;
    var newWeights = st.model_weights;
    let deltas = Array.tabulate(43, func(idx) {
      let decay = phi_pow_neg(idx.toFloat() / 43.0);
      let delta = baseSignal * decay;
      { model_index = idx; delta }
    });
    // Apply deltas to accumulated model weights
    newWeights := Array.tabulate<Float>(43, func(idx) {
      let d = deltas[idx].delta;
      clamp01(st.model_weights[idx] + d)
    });
    let newSt : ArtifactPipelineState = { st with
      model_weights = newWeights;
    };
    { st = newSt; deltas }
  };

  // PHI^(-x) = exp(-x × ln(PHI))
  func phi_pow_neg(x : Float) : Float {
    Float.exp(-x * Float.log(PHI))
  };

  // ============================================================
  // SECTION 4 — LEGACY INDEX WRITE HELPER
  // ============================================================

  /// Build a PrimaCausa.LegacyEntry record from a SealedArtifact.
  /// Call PrimaCausa.recordLegacyEntry(pcState, entry) in main.mo.
  public func toLegacyEntry(artifact : SealedArtifact) : {
    artifact_id             : Text;
    beat_at_seal            : Nat64;
    doctrine_distance       : Float;
    genesis_alignment       : Float;
    producer                : Text;
    phi_ratio_at_production : Float;
  } {
    // doctrine_distance = 1.0 - doctrine_alignment (distance from perfect)
    let doc_dist = 1.0 - artifact.quality.doctrine_alignment;
    {
      artifact_id             = artifact.artifact_id;
      beat_at_seal            = artifact.beat_at_seal;
      doctrine_distance       = clamp01(doc_dist);
      genesis_alignment       = artifact.quality.genesis_alignment;
      producer                = artifact.producer_id;
      phi_ratio_at_production = artifact.quality.phi_coherence * PHI;
    }
  };

  // ============================================================
  // QUERY HELPERS — pure read functions
  // ============================================================

  public func getQueueDepth(st : ArtifactPipelineState) : Nat {
    st.reingestion_queue.size()
  };

  public func getStats(st : ArtifactPipelineState) : PipelineStats = {
    total_sealed       = st.total_sealed;
    total_reingested   = st.total_reingested;
    world_model_weight = st.world_model_weight;
    field_state        = st.field_state;
  };

  public func getFieldState(st : ArtifactPipelineState) : Float {
    st.field_state
  };

  public func getModelWeights(st : ArtifactPipelineState) : [Float] {
    st.model_weights
  };

  /// Apply the DogonSubstrateReading result back into state.
  public func applyFieldState(
    st             : ArtifactPipelineState,
    newFieldState  : Float
  ) : ArtifactPipelineState {
    { st with field_state = newFieldState }
  };

}
