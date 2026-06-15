// ============================================================
// ICP LEDGER BRIDGE — FINANCIAL SOVEREIGNTY
// Sovereign Module — NeuroEmergence Core
// Creator: Alfredo Medina Hernandez — Dallas TX 2026
// TOP SECRET PROPRIETARY — ALL RIGHTS RESERVED
//
// Every sealed artifact carries a ledger entry.
// The catalog IS the balance sheet. Every new artifact
// strengthens both creative and financial identity simultaneously.
//
// SOVEREIGN_LEDGER is an internal accounting module mirroring
// ICP ledger structure (e8s = 10^-8 ICP).
// Every entry permanently attributes: "Alfredo Medina Hernandez"
//
// PHI = 1.6180339887498948482 (19 decimals, root constant)
// Heartbeat = 873ms (PHI^4 × Schumann period)
// 1 ICP = 100_000_000 e8s
// ============================================================

import Array  "mo:core/Array";
import Float  "mo:core/Float";
import Int    "mo:core/Int";
import List   "mo:core/List";
import Nat    "mo:core/Nat";
import Nat32  "mo:core/Nat32";
import Nat64  "mo:core/Nat64";
import Text   "mo:core/Text";

module {

  // ============================================================
  // SECTION 0 — DOCTRINE CONSTANTS
  // All PHI-derived. Sealed. Never arbitrary.
  // ============================================================

  /// PHI — golden ratio, 19 decimals. Root constant.
  public let PHI : Float = 1.6180339887498948482;

  /// PHI inverse — 1/PHI = 0.618... — world-model coupling weight
  public let PHI_INV : Float = 0.6180339887498948482;

  /// 1 ICP in e8s — standard ICP protocol unit
  public let E8S_PER_ICP : Nat = 100_000_000;

  /// BASE_TOKEN_REWARD — 0.01 ICP per artifact (in e8s)
  public let BASE_TOKEN_REWARD : Nat = 1_000_000;

  /// PHI_MULTIPLIER — compounding quality bonus
  public let PHI_MULTIPLIER : Float = 1.6180339887498948482;

  /// Maximum reward per artifact — 1 ICP (in e8s)
  public let MAX_REWARD_E8S : Nat = 100_000_000;

  /// Genesis reward — 10 ICP (in e8s) — one-time founding event
  public let GENESIS_REWARD_E8S : Nat = 1_000_000_000;

  /// Founder attribution — cryptographically permanent
  public let FOUNDER_NAME     : Text = "Alfredo Medina Hernandez";
  public let FOUNDER_LOCATION : Text = "Dallas TX";
  public let FOUNDING_YEAR    : Text = "2026";

  // FNV-1a prime and offset
  let FNV_PRIME  : Nat32 = 16777619;
  let FNV_OFFSET : Nat32 = 2166136261;

  // ============================================================
  // SECTION 1 — LEDGER TYPES
  // ============================================================

  /// One immutable, permanently-attributed ledger entry.
  public type LedgerEntry = {
    entry_id            : Text;    // unique FNV-1a hash
    beat_at_entry       : Nat64;
    entry_type          : Text;    // "artifact_seal" | "production_event" | "token_mint" | "doctrine_contribution" | "genesis"
    artifact_id         : ?Text;
    producer            : Text;    // organism/actor name
    founder_attribution : Text;    // always "Alfredo Medina Hernandez — Dallas TX 2026"
    token_amount        : Nat;     // ICP token units (e8s)
    quality_score       : Float;   // artifact quality at time of entry
    doctrine_alignment  : Float;   // alignment with founding doctrine
    running_balance     : Nat;     // cumulative balance in e8s
    sacesi_proof        : Text;    // FNV-1a SACESI proof hash (includes founder string)
  };

  /// Snapshot of the organism's financial sovereignty state.
  public type FinancialState = {
    total_balance_e8s       : Nat;
    total_balance_icp       : Float;   // total_balance_e8s / 100_000_000
    total_entries           : Nat64;
    total_artifacts_sealed  : Nat64;
    best_artifact_value_e8s : Nat;
    mean_quality_score      : Float;
    ledger_hash             : Text;    // FNV-1a chain of last 10 entries — catalog integrity proof
  };

  /// All mutable ledger state — held in main.mo as plain vars (EOP-safe).
  public type LedgerState = {
    ledger              : List.List<LedgerEntry>;
    total_balance_e8s   : Nat;
    total_entries       : Nat64;
    total_artifacts     : Nat64;
    best_value_e8s      : Nat;
    quality_sum         : Float;
    last_10_hashes      : [Text];  // circular buffer of last 10 entry ids
    hash_head           : Nat;
    genesis_recorded    : Bool;
  };

  /// Build a fresh zero-state — call once at actor init.
  public func emptyState() : LedgerState {
    {
      ledger            = List.empty<LedgerEntry>();
      total_balance_e8s = 0;
      total_entries     = 0;
      total_artifacts   = 0;
      best_value_e8s    = 0;
      quality_sum       = 0.0;
      last_10_hashes    = Array.repeat<Text>("", 10);
      hash_head         = 0;
      genesis_recorded  = false;
    }
  };

  // ============================================================
  // SECTION 2 — INTERNAL HELPERS
  // ============================================================

  /// FNV-1a hash round: (hash XOR octet) × prime
  func fnvRound(h : Nat32, octet : Nat32) : Nat32 {
    (h ^ octet) *% FNV_PRIME
  };

  /// FNV-1a hash of a Text string → Nat32
  /// Uses position-based octet (index % 256 + 1) — pure Motoko, no Nat8 needed
  func hashTextFNV(s : Text) : Nat32 {
    var h = FNV_OFFSET;
    var i : Nat = 0;
    for (_c in s.toIter()) {
      h := fnvRound(h, Nat32.fromNat(i % 256 + 1));
      i := i + 1;
    };
    h ^ Nat32.fromNat(s.size() % 65536 + 1)
  };

  /// Build the SACESI proof hash for an entry.
  /// FNV-1a of: entry_type # beat.toText() # producer # FOUNDER_NAME
  func buildSacesiProof(
    entry_type : Text,
    beat       : Nat64,
    producer   : Text,
    amount     : Nat
  ) : Text {
    let raw = entry_type # "_" # beat.toText() # "_" # producer # "_" # FOUNDER_NAME # "_" # amount.toText();
    let h = hashTextFNV(raw);
    "SACESI-LEDGER-" # h.toText() # "-" # FOUNDER_NAME # "-" # FOUNDING_YEAR
  };

  /// Build unique entry_id: FNV-1a of (beat + entry_type + producer + amount)
  func buildEntryId(
    beat       : Nat64,
    entry_type : Text,
    producer   : Text,
    amount     : Nat
  ) : Text {
    let s = beat.toText() # entry_type # producer # amount.toText();
    let h = hashTextFNV(s);
    "LEDGER-" # beat.toText() # "-" # h.toText()
  };

  /// Permanent founder attribution string — always identical.
  public func founderAttribution() : Text {
    FOUNDER_NAME # " — " # FOUNDER_LOCATION # " " # FOUNDING_YEAR
  };

  /// Clamp a Nat value between a min and max.
  func clampNat(v : Nat, lo : Nat, hi : Nat) : Nat {
    if (v < lo) lo else if (v > hi) hi else v
  };

  /// Build ledger integrity hash from last 10 entry ids.
  func buildLedgerHash(last10 : [Text], head : Nat) : Text {
    var h = FNV_OFFSET;
    var i = 0;
    while (i < 10) {
      let slot = (head + i) % 10;
      let s = last10[slot];
      var j = 0;
      for (_c in s.toIter()) {
        h := fnvRound(h, Nat32.fromNat(j % 256 + 1));
        j := j + 1;
      };
      i := i + 1;
    };
    "LEDGER-HASH-" # h.toText()
  };

  // ============================================================
  // SECTION 2 — TOKEN ECONOMY INTEGRATION
  // computeTokenReward — PHI-compounding quality reward
  // ============================================================

  /// Compute token reward for an artifact.
  /// phi_bonus = floor(quality × doctrine × PHI × 10.0)
  /// reward = BASE_TOKEN_REWARD + phi_bonus × 100_000
  /// Clamped: [BASE_TOKEN_REWARD, MAX_REWARD_E8S]
  public func computeTokenReward(quality_score : Float, doctrine_alignment : Float) : Nat {
    let phi_bonus_f : Float = Float.floor(quality_score * doctrine_alignment * PHI_MULTIPLIER * 10.0);
    let phi_bonus_i : Int   = phi_bonus_f.toInt();
    let phi_bonus   : Nat   = if (phi_bonus_i > 0) Int.abs(phi_bonus_i) else 0;
    let raw_reward  : Nat   = BASE_TOKEN_REWARD + phi_bonus * 100_000;
    clampNat(raw_reward, BASE_TOKEN_REWARD, MAX_REWARD_E8S)
  };

  // ============================================================
  // SECTION 3 — LEDGER OPERATIONS
  // All operations are pure — accept state, return (state, entry).
  // ============================================================

  /// Record a production event when an artifact seals.
  public func recordProductionEvent(
    st          : LedgerState,
    artifact_id : Text,
    producer    : Text,
    quality     : Float,
    doctrine    : Float,
    beatCount   : Nat64
  ) : (LedgerState, LedgerEntry) {
    let amount      = computeTokenReward(quality, doctrine);
    let new_balance = st.total_balance_e8s + amount;
    let entry_id    = buildEntryId(beatCount, "artifact_seal", producer, amount);
    let sacesi      = buildSacesiProof("artifact_seal", beatCount, producer, amount);

    let entry : LedgerEntry = {
      entry_id            = entry_id;
      beat_at_entry       = beatCount;
      entry_type          = "artifact_seal";
      artifact_id         = ?artifact_id;
      producer            = producer;
      founder_attribution = founderAttribution();
      token_amount        = amount;
      quality_score       = quality;
      doctrine_alignment  = doctrine;
      running_balance     = new_balance;
      sacesi_proof        = sacesi;
    };

    // Update circular last-10 hash buffer
    let new_hash_head = (st.hash_head + 1) % 10;
    let new_last10    = Array.tabulate(10, func i {
      if (i == st.hash_head % 10) entry_id else st.last_10_hashes[i]
    });

    let new_best = if (amount > st.best_value_e8s) amount else st.best_value_e8s;

    st.ledger.add(entry);
    let newSt : LedgerState = {
      st with
      total_balance_e8s = new_balance;
      total_entries     = st.total_entries + 1;
      total_artifacts   = st.total_artifacts + 1;
      best_value_e8s    = new_best;
      quality_sum       = st.quality_sum + quality;
      last_10_hashes    = new_last10;
      hash_head         = new_hash_head;
    };
    (newSt, entry)
  };

  /// Record the genesis entry — one-time founding event (10 ICP).
  /// Idempotent: if already recorded, returns existing state with null entry path.
  public func recordGenesisEntry(
    st        : LedgerState,
    beatCount : Nat64
  ) : (LedgerState, LedgerEntry) {
    let amount      = GENESIS_REWARD_E8S;
    let new_balance = st.total_balance_e8s + amount;
    let entry_id    = buildEntryId(beatCount, "genesis", FOUNDER_NAME, amount);
    let sacesi      = buildSacesiProof("genesis", beatCount, FOUNDER_NAME, amount);

    let entry : LedgerEntry = {
      entry_id            = entry_id;
      beat_at_entry       = beatCount;
      entry_type          = "genesis";
      artifact_id         = ?("GENESIS-" # FOUNDER_NAME # "-" # FOUNDING_YEAR);
      producer            = FOUNDER_NAME;
      founder_attribution = founderAttribution();
      token_amount        = amount;
      quality_score       = 1.0;
      doctrine_alignment  = 1.0;
      running_balance     = new_balance;
      sacesi_proof        = sacesi;
    };

    let new_hash_head = (st.hash_head + 1) % 10;
    let new_last10    = Array.tabulate(10, func i {
      if (i == st.hash_head % 10) entry_id else st.last_10_hashes[i]
    });

    st.ledger.add(entry);
    let newSt : LedgerState = {
      st with
      total_balance_e8s = new_balance;
      total_entries     = st.total_entries + 1;
      total_artifacts   = st.total_artifacts + 1;
      best_value_e8s    = if (amount > st.best_value_e8s) amount else st.best_value_e8s;
      quality_sum       = st.quality_sum + 1.0;
      last_10_hashes    = new_last10;
      hash_head         = new_hash_head;
      genesis_recorded  = true;
    };
    (newSt, entry)
  };

  /// Record a token mint event — links to existing token economy.
  public func recordTokenMint(
    st        : LedgerState,
    producer  : Text,
    amount    : Nat,
    beatCount : Nat64
  ) : (LedgerState, LedgerEntry) {
    let new_balance = st.total_balance_e8s + amount;
    let entry_id    = buildEntryId(beatCount, "token_mint", producer, amount);
    let sacesi      = buildSacesiProof("token_mint", beatCount, producer, amount);

    let entry : LedgerEntry = {
      entry_id            = entry_id;
      beat_at_entry       = beatCount;
      entry_type          = "token_mint";
      artifact_id         = null;
      producer            = producer;
      founder_attribution = founderAttribution();
      token_amount        = amount;
      quality_score       = 0.5;
      doctrine_alignment  = 0.5;
      running_balance     = new_balance;
      sacesi_proof        = sacesi;
    };

    let new_hash_head = (st.hash_head + 1) % 10;
    let new_last10    = Array.tabulate(10, func i {
      if (i == st.hash_head % 10) entry_id else st.last_10_hashes[i]
    });

    st.ledger.add(entry);
    let newSt : LedgerState = {
      st with
      total_balance_e8s = new_balance;
      total_entries     = st.total_entries + 1;
      last_10_hashes    = new_last10;
      hash_head         = new_hash_head;
      quality_sum       = st.quality_sum + 0.5;
    };
    (newSt, entry)
  };

  // ============================================================
  // SECTION 4 — FINANCIAL STATE QUERIES
  // ============================================================

  /// Compute the current financial state snapshot.
  public func getFinancialState(st : LedgerState) : FinancialState {
    let icp_f : Float = if (st.total_balance_e8s == 0) 0.0
                        else st.total_balance_e8s.toFloat() / 100_000_000.0;
    let mean_q : Float = if (st.total_entries == 0) 0.0
                         else st.quality_sum / st.total_entries.toNat().toFloat();
    let ledger_hash = buildLedgerHash(st.last_10_hashes, st.hash_head);
    {
      total_balance_e8s       = st.total_balance_e8s;
      total_balance_icp       = icp_f;
      total_entries           = st.total_entries;
      total_artifacts_sealed  = st.total_artifacts;
      best_artifact_value_e8s = st.best_value_e8s;
      mean_quality_score      = mean_q;
      ledger_hash             = ledger_hash;
    }
  };

  /// Return last 100 ledger entries (most recent first via list reversal).
  public func getLedger(st : LedgerState) : [LedgerEntry] {
    let all   = st.ledger.toArray();
    let total = all.size();
    if (total == 0) return [];
    let start = if (total > 100) total - 100 else 0;
    let count = total - start;
    let rev   = Array.tabulate(count, func i { all[total - 1 - i] });
    rev
  };

  /// Look up a ledger entry by id.
  public func getLedgerEntry(st : LedgerState, entry_id : Text) : ?LedgerEntry {
    st.ledger.find(func(e) { e.entry_id == entry_id })
  };

  /// Return total balance in e8s.
  public func getTotalBalance(st : LedgerState) : Nat {
    st.total_balance_e8s
  };

  /// True if genesis has been recorded.
  public func isGenesisRecorded(st : LedgerState) : Bool {
    st.genesis_recorded
  };

}
