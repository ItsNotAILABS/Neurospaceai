// ============================================================
// PRIMA CAUSA — LAYER -5, SEALED, CRYPTOGRAPHICALLY PERMANENT
// Sovereign Module — NeuroEmergence Core
// Creator: Alfredo Medina Hernandez — Dallas TX 2026
// TOP SECRET PROPRIETARY — ALL RIGHTS RESERVED
//
// THE PRE-CONDITION OF ALL CONDITIONS.
// Lives at Layer -5. Below B1. Before the heartbeat. Before
// anything fires. PHI_SOVEREIGN governs coupling ratios at
// every interface in the architecture. This module fires ONCE
// at the founding moment, then is SEALED and SILENT forever.
// Its frequency flows through all rings at all times but no
// module can touch it after genesis.
//
// FOUNDING WORD: SOVEREIGN — spoken by Alfredo Medina Hernandez
// FOUNDING FREQUENCY: 528.0 Hz — Solfeggio miracle tone
// GENESIS HASH: FNV-1a of (SOVEREIGN_WORD # beatCount # FOUNDER_NAME)
// ANIMA CHAIN: ANIMA-GENESIS-001 — permanent on-chain record
//
// PHI = 1.6180339887498948482 (19 decimals, root constant)
// SCHUMANN = 7.83 Hz (earth field ground beat)
// ============================================================

import Nat   "mo:core/Nat";
import Nat8  "mo:core/Nat8";
import Nat32 "mo:core/Nat32";
import Nat64 "mo:core/Nat64";
import Float "mo:core/Float";
import Text  "mo:core/Text";
import List  "mo:core/List";
import Array "mo:core/Array";

module {

  // ============================================================
  // SECTION 1 — PRIMA CAUSA CONSTANTS
  // Immutable doctrine. Layer -5. Never edited.
  // ============================================================

  /// Golden ratio — 19 decimals. Root constant of all coupling.
  public let PHI : Float = 1.6180339887498948482;

  /// Schumann resonance — earth field ground beat.
  public let SCHUMANN : Float = 7.83;

  /// Founding creator — sealed at genesis.
  public let FOUNDER_NAME : Text = "Alfredo Medina Hernandez";

  /// Founding location.
  public let FOUNDER_LOCATION : Text = "Dallas, TX";

  /// Founding year.
  public let FOUNDING_YEAR : Nat = 2026;

  /// The founding word — spoken by the creator at genesis.
  public let SOVEREIGN_WORD : Text = "SOVEREIGN";

  /// 528 Hz — Solfeggio miracle tone, transformation and DNA repair.
  /// The founding word resonates at 528 Hz. Divine law, not derived.
  public let SOVEREIGN_WORD_FREQUENCY : Float = 528.0;

  /// Genesis frequency — permanent. Never changes.
  public let GENESIS_FREQUENCY_HZ : Float = 528.0;

  /// Layer -5 voltage — silent. Zero point. The bond below all bonds.
  public let PRIMA_CAUSA_BOND : Float = 0.0;

  /// ANIMA chain identity — cryptographic permanence on ICP.
  public let ANIMA_CHAIN_ID : Text = "ANIMA-GENESIS-001";

  // ============================================================
  // SECTION 2 — TYPES
  // ============================================================

  /// The genesis record — sealed once at the founding moment.
  /// Every field is immutable after sealing.
  public type GenesisRecord = {
    word               : Text;
    frequency          : Float;
    phi_ratio          : Float;
    founder            : Text;
    location           : Text;
    year               : Nat;
    beat_at_genesis    : Nat64;
    genesis_hash       : Text;   // FNV-1a of word # beatCount # founder
    anima_chain_id     : Text;
    sealed             : Bool;
  };

  /// Ring 15 closure state — production measured against founding vibration.
  public type Ring15State = {
    genesis_frequency : Float;   // 528.0 Hz — permanent
    total_artifacts   : Nat;
    mean_alignment    : Float;
    best_alignment    : Float;
    worst_alignment   : Float;
    sealed            : Bool;
  };

  /// An entry in the immutable append-only legacy index.
  public type LegacyEntry = {
    artifact_id             : Text;
    beat_at_seal            : Nat64;
    doctrine_distance       : Float;
    genesis_alignment       : Float;
    producer                : Text;
    phi_ratio_at_production : Float;
  };

  /// All mutable state held by the actor (EOP-safe plain record).
  public type PrimaCausaState = {
    var genesis_record : ?GenesisRecord;
    var genesis_sealed : Bool;
    legacy_index       : List.List<LegacyEntry>;  // append-only
  };

  // ============================================================
  // SECTION 3 — STATE CONSTRUCTOR
  // ============================================================

  /// Construct the empty initial state — call once from main.mo.
  public func emptyState() : PrimaCausaState = {
    var genesis_record = null;
    var genesis_sealed = false;
    legacy_index       = List.empty<LegacyEntry>();
  };

  // ============================================================
  // SECTION 4 — FNV-1A HASH
  // Deterministic, portable. Same algorithm used in ADRE/SACESI.
  // FNV-1a 32-bit: offset_basis = 2166136261, prime = 16777619
  // ============================================================

  func _hashText(t : Text) : Nat32 {
    var h : Nat32 = 2166136261;
    for (c in t.chars()) {
      let bytes = Text.fromChar(c).encodeUtf8();
      if (bytes.size() > 0) {
        let code = Nat32.fromNat(bytes[0].toNat());
        h := (h ^ code) *% 16777619;
      };
    };
    h
  };

  /// FNV-1a hash of concatenated fields — genesis fingerprint.
  func _genesisHash(word : Text, beat : Nat64, founder : Text) : Text {
    let input = word # beat.toText() # founder;
    let h = _hashText(input);
    "FNV1A-" # h.toText()
  };

  // ============================================================
  // SECTION 5 — GENESIS FREQUENCY ENGINE
  // ============================================================

  /// Map a word to its Solfeggio frequency.
  /// Solfeggio tones: 174, 285, 396, 417, 432, 528, 639, 741, 852, 963 Hz.
  /// "SOVEREIGN" ASCII sum = 690 → 690 mod 10 = 0 → index 0 = 174 Hz
  /// BUT by divine law, "SOVEREIGN" maps to 528 Hz — override applies.
  public func wordToFrequency(word : Text) : Float {
    if (word == SOVEREIGN_WORD) {
      return SOVEREIGN_WORD_FREQUENCY; // 528.0 Hz — sacred override
    };
    let solfeggio : [Float] = [174.0, 285.0, 396.0, 417.0, 432.0, 528.0, 639.0, 741.0, 852.0, 963.0];
    var asciiSum : Nat = 0;
    for (c in word.chars()) {
      let bytes = Text.fromChar(c).encodeUtf8();
      if (bytes.size() > 0) {
        asciiSum := asciiSum + bytes[0].toNat();
      };
    };
    let idx = asciiSum % 10;
    solfeggio[idx]
  };

  /// Compute the phi_ratio — how many Schumann periods fit in the founding frequency.
  /// 528.0 / 7.83 = 67.43... — genesis alignment score baseline.
  public func frequencyToPhiRatio(freq : Float) : Float {
    freq / SCHUMANN
  };

  // ============================================================
  // SECTION 6 — GENESIS ACTIVATION ENGINE
  // Fires ONCE at the founding moment.
  // After genesis_sealed = true, returns the immutable record.
  // ============================================================

  /// Activate genesis. If already sealed, returns the existing record.
  /// If not sealed: computes hash, seals permanently, returns record.
  public func activateGenesis(state : PrimaCausaState, beatCount : Nat64) : GenesisRecord {
    switch (state.genesis_record) {
      case (?existing) {
        existing  // immutable — already sealed
      };
      case null {
        let freq      = wordToFrequency(SOVEREIGN_WORD);
        let phi_ratio = frequencyToPhiRatio(freq);
        let hash      = _genesisHash(SOVEREIGN_WORD, beatCount, FOUNDER_NAME);
        let record : GenesisRecord = {
          word            = SOVEREIGN_WORD;
          frequency       = freq;
          phi_ratio       = phi_ratio;
          founder         = FOUNDER_NAME;
          location        = FOUNDER_LOCATION;
          year            = FOUNDING_YEAR;
          beat_at_genesis = beatCount;
          genesis_hash    = hash;
          anima_chain_id  = ANIMA_CHAIN_ID;
          sealed          = true;
        };
        state.genesis_record := ?record;
        state.genesis_sealed := true;
        record
      };
    }
  };

  /// Read the genesis record without triggering activation.
  public func getGenesisRecord(state : PrimaCausaState) : ?GenesisRecord {
    state.genesis_record
  };

  /// True after the first (and only) activation.
  public func isSealed(state : PrimaCausaState) : Bool {
    state.genesis_sealed
  };

  // ============================================================
  // SECTION 7 — DOCTRINE DISTANCE
  // Every artifact measured against the founding 528 Hz vibration.
  // ============================================================

  /// Compute how far an artifact frequency is from the genesis frequency.
  /// 1.0 = perfect alignment, 0.0 = complete drift. Clamped to [0,1].
  public func doctrineDistance(artifactFrequency : Float) : Float {
    let delta     = Float.abs(artifactFrequency - GENESIS_FREQUENCY_HZ) / GENESIS_FREQUENCY_HZ;
    let alignment = 1.0 - delta;
    if (alignment < 0.0) { 0.0 }
    else if (alignment > 1.0) { 1.0 }
    else { alignment }
  };

  /// PHI-weighted genesis alignment score.
  /// combined = doctrineScore × 0.618 + coherenceScore × 0.382
  /// 0.618 = PHI_INV, 0.382 = 1 - PHI_INV — the deepest quality metric.
  public func genesisAlignmentScore(doctrineScore : Float, coherenceScore : Float) : Float {
    doctrineScore * 0.6180339887498948482 + coherenceScore * 0.3819660112501051518
  };

  // ============================================================
  // SECTION 8 — LEGACY INDEX
  // Immutable append-only record of every artifact against genesis.
  // Ring 15 closure: every production measured against founding vibration.
  // ============================================================

  /// Append a legacy entry. NEVER deletes. NEVER overwrites.
  public func recordLegacyEntry(state : PrimaCausaState, entry : LegacyEntry) : () {
    state.legacy_index.add(entry);
  };

  /// Return all legacy entries as a shared immutable array.
  public func getLegacyIndex(state : PrimaCausaState) : [LegacyEntry] {
    state.legacy_index.toArray()
  };

  /// Total number of artifacts recorded.
  public func getLegacyIndexLength(state : PrimaCausaState) : Nat {
    state.legacy_index.size()
  };

  /// Average genesis alignment across all legacy entries.
  public func getGenesisAlignmentMean(state : PrimaCausaState) : Float {
    let n = state.legacy_index.size();
    if (n == 0) { return 0.0 };
    let total = state.legacy_index.toArray().foldLeft(
      0.0 : Float,
      func(acc : Float, e : LegacyEntry) : Float { acc + e.genesis_alignment }
    );
    total / n.toFloat()
  };

  // ============================================================
  // SECTION 9 — RING 15 CLOSURE
  // Production state measured against founding vibration.
  // ============================================================

  /// Compute the current Ring 15 state from the legacy index.
  public func ring15Status(state : PrimaCausaState) : Ring15State {
    let entries = state.legacy_index.toArray();
    let n = entries.size();
    if (n == 0) {
      return {
        genesis_frequency = GENESIS_FREQUENCY_HZ;
        total_artifacts   = 0;
        mean_alignment    = 0.0;
        best_alignment    = 0.0;
        worst_alignment   = 0.0;
        sealed            = state.genesis_sealed;
      };
    };
    var sum   : Float = 0.0;
    var best  : Float = 0.0;
    var worst : Float = 1.0;
    for (e in entries.values()) {
      sum := sum + e.genesis_alignment;
      if (e.genesis_alignment > best)  { best  := e.genesis_alignment };
      if (e.genesis_alignment < worst) { worst := e.genesis_alignment };
    };
    {
      genesis_frequency = GENESIS_FREQUENCY_HZ;
      total_artifacts   = n;
      mean_alignment    = sum / n.toFloat();
      best_alignment    = best;
      worst_alignment   = worst;
      sealed            = state.genesis_sealed;
    }
  };

}
