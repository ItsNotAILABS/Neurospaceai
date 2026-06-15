// ============================================================
// MODEL PROMOTION — SOVEREIGN WORKFLOW MODULE
// NeuroEmergence Core — Alfredo Medina Hernandez, Dallas TX 2026
// TOP SECRET PROPRIETARY — ALL RIGHTS RESERVED
//
// Every sovereign model has a promotion state:
//   M0 — hypothesis (unvalidated)
//   M1 — validated, single-consumer proof gated
//   M2 — promoted, multi-consumer proof gated
//
// Promotion gates are ADRE-gated and SACESI-stamped.
// PHI = 1.6180339887498948482 (19 decimals, root constant)
// M0→M1 gate : coherence >= 0.618 (PHI-inverse)
// M1→M2 gate : coherence >= 0.786 (PHI^-0.5), consumers >= 2, proofs >= 3
// ============================================================

import Array "mo:core/Array";
import Char  "mo:core/Char";
import Map   "mo:core/Map";
import Nat32 "mo:core/Nat32";
import Nat64 "mo:core/Nat64";
import Text  "mo:core/Text";

module {

  // ============================================================
  // DOCTRINE CONSTANTS — SEALED, PHI-DERIVED, IMMUTABLE
  // ============================================================

  let PHI_INV      : Float = 0.6180339887498948482; // 1/PHI — M0→M1 coherence gate
  let PHI_INV_SQRT : Float = 0.7861513777574233;    // PHI^-0.5 — M1→M2 coherence gate

  let M0_MIN_LAWS      : Nat = 3;
  let M1_MIN_LAWS      : Nat = 7;
  let M1_MIN_CONSUMERS : Nat = 2;
  let M1_MIN_PROOFS    : Nat = 3;
  let MAX_PROOF_BUNDLES: Nat = 144; // 12² — Fibonacci-anchored circular cap

  let FNV_OFFSET : Nat32 = 2166136261;
  let FNV_PRIME  : Nat32 = 16777619;

  // ============================================================
  // PUBLIC TYPES
  // ============================================================

  public type ModelTier = { #M0; #M1; #M2 };

  public type ProofBundle = {
    modelId    : Text;
    beat       : Nat64;
    sacesiHash : Text;
    consumerId : Text;
    coherence  : Float;
    lawsPassed : Nat;
  };

  public type ModelPromotionRecord = {
    id               : Text;
    name             : Text;
    tier             : ModelTier;
    proofBundles     : [ProofBundle];
    consumerCount    : Nat;
    lastPromotedBeat : Nat64;
    adreGateHash     : Text;
    pendingPromotion : Bool;
  };

  public type PromotionSummary = {
    m0Count          : Nat;
    m1Count          : Nat;
    m2Count          : Nat;
    totalProofBundles: Nat;
  };

  // Internal mutable record — NOT shared. Converted to ModelPromotionRecord for queries.
  public type ModelState = {
    var tier             : ModelTier;
    var proofBundles     : [ProofBundle];
    var consumerCount    : Nat;
    var lastPromotedBeat : Nat64;
    var adreGateHash     : Text;
    var pendingPromotion : Bool;
  };

  public type ModelRegistry = Map.Map<Text, ModelState>;

  // ============================================================
  // FNV-1a HASH — returns 8-char hex string
  // Uses Nat32.fromChar for direct Char→Nat32 byte extraction.
  // Consistent with the FNV seed/prime used in adre.mo.
  // ============================================================

  let HEX : [Text] = [
    "0","1","2","3","4","5","6","7",
    "8","9","a","b","c","d","e","f",
  ];

  func fnvRound(h : Nat32, octet : Nat32) : Nat32 {
    (h ^ octet) *% FNV_PRIME
  };

  public func fnv1a(input : Text) : Text {
    var h : Nat32 = FNV_OFFSET;
    for (c in input.toIter()) {
      // Char.toNat32 via dot notation — mask to byte for ASCII
      let code = c.toNat32() % 256;
      h := fnvRound(h, code);
    };
    let n = h.toNat();
    HEX[(n / 268435456) % 16] # HEX[(n / 16777216) % 16] #
    HEX[(n / 1048576)   % 16] # HEX[(n / 65536)    % 16] #
    HEX[(n / 4096)      % 16] # HEX[(n / 256)       % 16] #
    HEX[(n / 16)        % 16] # HEX[ n              % 16]
  };

  // ============================================================
  // THE 43 SOVEREIGN MODEL IDs — sealed, ordered, immutable
  // ============================================================

  public let MODEL_IDS : [Text] = [
    "PHI_CONSTANT",          // 00
    "SCHUMANN_ANCHOR",       // 01
    "KURAMOTO_NETWORK",      // 02
    "SACESI_CHAIN",          // 03
    "MEMORY_TEMPLE",         // 04
    "ADRE_ENGINE",           // 05
    "COGNITION_LAYER",       // 06
    "CCVE_ENGINE",           // 07
    "CNCO_ENGINE",           // 08
    "INTERNAL_ANALYST",      // 09
    "GRPE_ENGINE",           // 10
    "DECISION_ENGINE",       // 11
    "PATTERN_ENGINE",        // 12
    "SELF_EVAL_ENGINE",      // 13
    "REINJECTION_ENGINE",    // 14
    "CONTRADICTION_RESOLVER",// 15
    "PRIMA_CAUSA_BOND",      // 16
    "HEART_MODULE",          // 17
    "NEURAL_CORD",           // 18
    "HUNGER_LOOP",           // 19
    "MINING_ENGINE",         // 20
    "NUMEROLOGY_ENGINE",     // 21
    "GENOME_ENGINE",         // 22
    "VERITAS_AUTHORITY",     // 23
    "CHRONO_ENGINE",         // 24
    "TOKEN_ECONOMY",         // 25
    "WORLD_ENGINE",          // 26
    "ANIMAL_ENGINES",        // 27
    "BEHAVIORAL_ECON",       // 28
    "RL_ENGINE",             // 29
    "QUANTUM_OPS",           // 30
    "ORGANS_SYSTEM",         // 31
    "NEUROCHEMICALS",        // 32
    "METALS_DOCTRINE",       // 33
    "SUCCESSION_ENGINE",     // 34
    "AUDIT_ENGINE",          // 35
    "MEDINA_DOCTRINE",       // 36
    "SPHERE_NETWORK",        // 37
    "LAWS_ENGINE",           // 38
    "MARKET_FEEDS",          // 39
    "PRINCIPAL_LOCK",        // 40
    "SHELLS_ENGINE",         // 41
    "FINGERPRINT_ENGINE",    // 42
  ];

  // ============================================================
  // INTERNAL BUILDERS
  // ============================================================

  func newModelState() : ModelState {
    {
      var tier             = #M0;
      var proofBundles     = [];
      var consumerCount    = 0;
      var lastPromotedBeat = 0;
      var adreGateHash     = "";
      var pendingPromotion = false;
    }
  };

  // ============================================================
  // INITIALIZE — seeds all 43 models at M0
  // Must be called once at actor genesis. Safe to re-call (no-op if already seeded).
  // ============================================================

  public func initialize(registry : ModelRegistry) {
    for (id in MODEL_IDS.values()) {
      switch (registry.get(id)) {
        case null { registry.add(id, newModelState()) };
        case _ {};
      };
    };
  };

  // ============================================================
  // RECORD PROOF BUNDLE
  // Appends a proof for the given model. Circular cap at 144 entries.
  // Increments consumerCount if this is a first-time consumerId.
  // ============================================================

  public func recordProofBundle(
    registry   : ModelRegistry,
    modelId    : Text,
    consumerId : Text,
    coherence  : Float,
    lawsPassed : Nat,
    beat       : Nat64,
    sacesiHash : Text,
  ) {
    switch (registry.get(modelId)) {
      case null { /* unknown model — silently drop */ };
      case (?ms) {
        let bundle : ProofBundle = {
          modelId; beat; sacesiHash; consumerId; coherence; lawsPassed;
        };
        let existing = ms.proofBundles;
        // Circular cap: keep the most recent MAX_PROOF_BUNDLES entries
        ms.proofBundles := if (existing.size() >= MAX_PROOF_BUNDLES) {
          // Drop oldest — cap is 144 (non-zero constant), subtraction is safe
          let dropCount : Nat = 143; // MAX_PROOF_BUNDLES - 1
          let trimmed = Array.tabulate(
            dropCount, func i { existing[i + 1] }
          );
          trimmed.concat([bundle])
        } else {
          existing.concat([bundle])
        };
        // Track unique consumers
        var alreadySeen = false;
        for (b in existing.values()) {
          if (b.consumerId == consumerId) { alreadySeen := true };
        };
        if (not alreadySeen) {
          ms.consumerCount := ms.consumerCount + 1;
        };
      };
    };
  };

  // ============================================================
  // REQUEST PROMOTION
  // Checks gate conditions and advances tier M0→M1 or M1→M2.
  // Returns (promoted: Bool, sacesiHash: Text).
  // ============================================================

  public func requestPromotion(
    registry     : ModelRegistry,
    modelId      : Text,
    adreGateHash : Text,
    beat         : Nat64,
  ) : (Bool, Text) {
    switch (registry.get(modelId)) {
      case null { (false, "") };
      case (?ms) {
        let proofs = ms.proofBundles;
        if (proofs.size() == 0) return (false, "");

        // Compute mean coherence and max laws across all proof bundles
        var cohSum  : Float = 0.0;
        var maxLaws : Nat   = 0;
        for (b in proofs.values()) {
          cohSum := cohSum + b.coherence;
          if (b.lawsPassed > maxLaws) { maxLaws := b.lawsPassed };
        };
        let meanCoh : Float = cohSum / proofs.size().toFloat();
        let nextTierText = switch (ms.tier) {
          case (#M0) "M1"; case (#M1) "M2"; case (#M2) "M2";
        };
        let sacesiHash = fnv1a(modelId # beat.toText() # nextTierText);

        switch (ms.tier) {
          case (#M0) {
            // Gate: coherence >= PHI_INV (0.618), laws >= 3, >=1 proof, ADRE hash non-empty
            if (meanCoh >= PHI_INV and maxLaws >= M0_MIN_LAWS
                and proofs.size() >= 1 and adreGateHash.size() > 0) {
              ms.tier             := #M1;
              ms.lastPromotedBeat := beat;
              ms.adreGateHash     := adreGateHash;
              ms.pendingPromotion := false;
              (true, sacesiHash)
            } else {
              ms.pendingPromotion := true;
              (false, "")
            }
          };
          case (#M1) {
            // Gate: coherence >= PHI_INV_SQRT (0.786), laws >= 7, consumers >= 2,
            //        proofs >= 3, ADRE hash non-empty
            if (meanCoh >= PHI_INV_SQRT and maxLaws >= M1_MIN_LAWS
                and ms.consumerCount >= M1_MIN_CONSUMERS
                and proofs.size() >= M1_MIN_PROOFS
                and adreGateHash.size() > 0) {
              ms.tier             := #M2;
              ms.lastPromotedBeat := beat;
              ms.adreGateHash     := adreGateHash;
              ms.pendingPromotion := false;
              (true, sacesiHash)
            } else {
              ms.pendingPromotion := true;
              (false, "")
            }
          };
          case (#M2) {
            // Already at apex — no further promotion
            ms.pendingPromotion := false;
            (false, "")
          };
        };
      };
    };
  };

  // ============================================================
  // SNAPSHOT HELPERS — convert mutable state to shared types
  // ============================================================

  func toRecord(id : Text, ms : ModelState) : ModelPromotionRecord {
    {
      id;
      name             = id;
      tier             = ms.tier;
      proofBundles     = ms.proofBundles;
      consumerCount    = ms.consumerCount;
      lastPromotedBeat = ms.lastPromotedBeat;
      adreGateHash     = ms.adreGateHash;
      pendingPromotion = ms.pendingPromotion;
    }
  };

  let EMPTY_RECORD : ModelPromotionRecord = {
    id = ""; name = ""; tier = #M0; proofBundles = [];
    consumerCount = 0; lastPromotedBeat = 0; adreGateHash = "";
    pendingPromotion = false;
  };

  public func getModelState(registry : ModelRegistry, modelId : Text) : ?ModelPromotionRecord {
    switch (registry.get(modelId)) {
      case null null;
      case (?ms) ?toRecord(modelId, ms);
    }
  };

  public func getAllModelStates(registry : ModelRegistry) : [ModelPromotionRecord] {
    Array.tabulate<ModelPromotionRecord>(MODEL_IDS.size(), func i {
      let id = MODEL_IDS[i];
      switch (registry.get(id)) {
        case null { { EMPTY_RECORD with id; name = id } };
        case (?ms) toRecord(id, ms);
      }
    })
  };

  public func getPromotionSummary(registry : ModelRegistry) : PromotionSummary {
    var m0 : Nat = 0; var m1 : Nat = 0; var m2 : Nat = 0; var total : Nat = 0;
    for (id in MODEL_IDS.values()) {
      switch (registry.get(id)) {
        case null { m0 += 1 };
        case (?ms) {
          total += ms.proofBundles.size();
          switch (ms.tier) {
            case (#M0) { m0 += 1 };
            case (#M1) { m1 += 1 };
            case (#M2) { m2 += 1 };
          };
        };
      };
    };
    { m0Count = m0; m1Count = m1; m2Count = m2; totalProofBundles = total }
  };

  // ============================================================
  // HEARTBEAT BULK PROOF — called from main.mo pulseAllCores() every 873ms
  // Records one proof bundle per model with consumerId = "HEARTBEAT".
  // ============================================================

  public func recordHeartbeatProofs(
    registry   : ModelRegistry,
    beat       : Nat64,
    coherence  : Float,
    lawsPassed : Nat,
  ) {
    let sacesiHash = fnv1a("HEARTBEAT" # beat.toText());
    for (id in MODEL_IDS.values()) {
      recordProofBundle(registry, id, "HEARTBEAT", coherence, lawsPassed, beat, sacesiHash);
    };
  };

  // ============================================================
  // PUBLIC QUERY SNAPSHOT — returns all 43 records
  // Used by main.mo public query: getPromotionSnapshot()
  // ============================================================

  public func getPromotionSnapshot(registry : ModelRegistry) : [ModelPromotionRecord] {
    getAllModelStates(registry)
  };

}
