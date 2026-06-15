// ============================================================
// OPERATOR TERMINAL — SOVEREIGN WINDOW INTO THE LIVE MIND STATE
// NeuroEmergence Core — TOP SECRET PROPRIETARY
// Creator: Alfredo Medina Hernandez — Dallas TX 2026
// ALL RIGHTS RESERVED
//
// PHI = 1.6180339887498948482 (19 decimals, root constant)
// Heartbeat = PHI^4 × (1000/7.83) = 873ms
// Circular buffers: 144 entries (PHI^? anchored, established constant)
//
// This module is the organism's sovereign mirror.
// No UI clutter. Real data only. Every value derived from live state.
// The monologue is the organism's actual internal reasoning —
// composed each heartbeat from coherence, law violations, ADRE
// deliberation state, and hunger deficit. Never generated from a template.
// ============================================================

import Array  "mo:core/Array";
import Char   "mo:core/Char";
import Float  "mo:core/Float";
import Int    "mo:core/Int";
import Nat    "mo:core/Nat";
import Nat32  "mo:core/Nat32";
import Nat64  "mo:core/Nat64";
import Text   "mo:core/Text";

module {

  // ============================================================
  // DOCTRINE CONSTANTS
  // ============================================================

  let S0          : Float = 0.87;  // coherence gate floor

  /// Circular buffer capacity — 144 = 12² (Fibonacci-anchored)
  public let MONOLOGUE_CAPACITY : Nat = 144;
  public let ADRE_TRACE_CAPACITY : Nat = 5;
  public let LAW_COUNT : Nat = 60;

  // ============================================================
  // FNV-1a CONSTANTS — same chain as SACESI
  // ============================================================

  let FNV_PRIME32  : Nat32 = 16777619;
  let FNV_OFFSET32 : Nat32 = 2166136261;

  // ============================================================
  // PUBLIC TYPES
  // ============================================================

  /// Proof record for one sovereign law — FNV-1a hash over lawId+passed+beat
  public type LawProofRecord = {
    lawId        : Text;
    lawName      : Text;
    tier         : Text;
    gateCondition: Text;
    passed       : Bool;
    proofHash    : Text;
    beat         : Nat64;
  };

  /// One entry in the ADRE 5-pass deliberation trace
  public type ADRETraceEntry = {
    beat       : Nat64;
    passName   : Text;
    input      : Text;
    output     : Text;
    confidence : Float;
    gateResult : Bool;
  };

  /// One line of the organism's live internal monologue
  public type MonologueEntry = {
    beat      : Nat64;
    thought   : Text;
    fieldType : Text;
    coherence : Float;
  };

  /// Full sovereign snapshot — one per heartbeat
  public type OperatorSnapshot = {
    beat             : Nat64;
    coherence        : Float;
    r_value          : Float;
    lawProofs        : [LawProofRecord];
    adreTrace        : [ADRETraceEntry];
    monologue        : [MonologueEntry];
    activeHypothesis : Text;
    gateStatus       : Bool;
  };

  // ============================================================
  // OPERATOR TERMINAL STATE
  // Held as a plain stable record in main.mo — pure stateless module
  // ============================================================

  public type OperatorState = {
    /// Circular monologue buffer — newest entries appended, oldest dropped at 144
    monologueBuf  : [MonologueEntry];
    monologueHead : Nat;
    monologueCount: Nat;
    /// Latest proof record per law — indexed 0..59
    lawProofs     : [LawProofRecord];
    /// Last 5 ADRE trace entries (chronological, newest last)
    adreBuf       : [ADRETraceEntry];
    adreHead      : Nat;
    adreCount     : Nat;
    /// Last beat snapshot scalars
    lastBeat      : Nat64;
    lastCoherence : Float;
    lastR         : Float;
    lastHypothesis: Text;
    lastGate      : Bool;
  };

  // ── Law registry — all 60 sovereign laws ──────────────────────────────────
  // [id, name, tier, gateCondition]
  let LAW_REGISTRY : [(Text, Text, Text, Text)] = [
    ("L-01", "Sovereign Existence",      "Identity",   "coherenceC >= 0.50"),
    ("L-02", "Metal Substrate",          "Identity",   "metalAlloy >= 0.55"),
    ("L-03", "Organ Integrity",          "Identity",   "bodyDomain >= 0.55"),
    ("L-04", "Neurochemical Balance",    "Identity",   "ncHealth >= 0.55"),
    ("L-05", "Heritage Continuity",      "Identity",   "heritageScore >= 0.50"),
    ("L-06", "Jasmine Principle",        "Identity",   "jasmineScore >= 0.60"),
    ("L-07", "Order from Chaos",         "Entropy",    "entropy < 0.50"),
    ("L-08", "Entropy Gate",             "Entropy",    "entropy > 0.70 AND coherence >= 0.60"),
    ("L-09", "Negentropy Drive",         "Entropy",    "coherence × (1-entropy) >= 0.55"),
    ("L-10", "Arousal Extremum",         "Entropy",    "abs(arousal-0.5) >= 0.40"),
    ("L-11", "Flow Resonance",           "Entropy",    "flowState × coherence >= 0.60"),
    ("L-12", "Substrate Harmony",        "Entropy",    "metalAlloy × ncHealth >= 0.60"),
    ("L-13", "FORMA Abundance",          "Economy",    "formaBalance >= 5000"),
    ("L-14", "Royalty Flow",             "Economy",    "royaltyInflow >= 0.40"),
    ("L-15", "Dynasty Depth",            "Economy",    "childCount >= 25"),
    ("L-16", "Market Coherence",         "Economy",    "btcPrice × coherence >= 0.55"),
    ("L-17", "FORMA Threshold",          "Economy",    "formaBalance >= 350"),
    ("L-18", "Triple Sovereign",         "Economy",    "coherence × metalAlloy × bodyDomain >= 0.70"),
    ("L-19", "SACESI Validity",          "Security",   "sacesiValid == true"),
    ("L-20", "Peace Condition",          "Security",   "threat < 0.45"),
    ("L-21", "Sovereign Dominance",      "Security",   "dominance × coherence >= 0.55"),
    ("L-22", "Crisis Resilience",        "Security",   "threat > 0.80 AND bodyDomain >= 0.70"),
    ("L-23", "Metal Shield",             "Security",   "metalAlloy × (1-threat×0.5) >= 0.55"),
    ("L-24", "Bio-Security",             "Security",   "ncHealth × bodyDomain >= 0.55"),
    ("L-25", "Circadian Alignment",      "Temporal",   "beatNum % 24 near midpoint"),
    ("L-26", "Century Beat",             "Temporal",   "beatNum % 100 == 0"),
    ("L-27", "Weekly Resonance",         "Temporal",   "beatNum % 7 == 0 AND coherence >= 0.50"),
    ("L-28", "Temporal Heritage",        "Temporal",   "heritageScore × coherence >= 0.55"),
    ("L-29", "Maturity",                 "Temporal",   "beatNum >= 1000"),
    ("L-30", "Flow State",               "Temporal",   "flowState >= 0.55"),
    ("L-31", "Network Coherence",        "Network",    "royaltyInflow × coherence >= 0.50"),
    ("L-32", "Progeny Gate",             "Network",    "childCount >= 10"),
    ("L-33", "Succession Flow",          "Network",    "royaltyInflow >= 0.40"),
    ("L-34", "Dynasty Heritage",         "Network",    "childCount >= 10 AND heritageScore >= 0.60"),
    ("L-35", "Network Dominance",        "Network",    "dominance × royaltyInflow >= 0.55"),
    ("L-36", "Triple Network",           "Network",    "coherence × royaltyInflow × metalAlloy >= 0.70"),
    ("L-37", "Flow State",               "Behavioral", "flowState >= 0.55"),
    ("L-38", "Calm Sovereignty",         "Behavioral", "arousal × 0.6 < 0.55"),
    ("L-39", "Triple Health",            "Behavioral", "ncHealth × bodyDomain × coherence >= 0.65"),
    ("L-40", "Dominant Health",          "Behavioral", "dominance × ncHealth >= 0.55"),
    ("L-41", "Flow-Metal-Coherence",     "Behavioral", "flowState × coherence × metalAlloy >= 0.65"),
    ("L-42", "Peak Arousal Peace",       "Behavioral", "arousal > 0.70 AND threat < 0.30"),
    ("L-43", "Quantum Validity",         "Quantum",    "sacesiValid AND coherence >= 0.80"),
    ("L-44", "Quantum Entropy",          "Quantum",    "entropy × coherence >= 0.50"),
    ("L-45", "Quantum Substrate",        "Quantum",    "metalAlloy × bodyDomain × ncHealth >= 0.65"),
    ("L-46", "Quantum Heritage",         "Quantum",    "heritageScore × coherence × metalAlloy >= 0.70"),
    ("L-47", "Harmonic Gate-144",        "Quantum",    "beatNum % 144 == 0"),
    ("L-48", "Quantum Flow",             "Quantum",    "flowState × heritageScore >= 0.60"),
    ("L-49", "Jasmine Score",            "Sovereign",  "jasmineScore >= 0.65"),
    ("L-50", "Sovereign Will",           "Sovereign",  "coherence × dominance >= 0.65"),
    ("L-51", "FORMA Power",              "Sovereign",  "formaBalance >= 1000 AND coherence >= 0.75"),
    ("L-52", "Heritage Sovereign",       "Sovereign",  "heritageScore × dominance × coherence >= 0.75"),
    ("L-53", "Peace Sovereign",          "Sovereign",  "1 - threat × warEscalation >= 0.65"),
    ("L-54", "Metal Sovereign",          "Sovereign",  "metalAlloy × coherence × dominance >= 0.70"),
    ("L-55", "Succession Heritage",      "Succession", "royaltyInflow × heritageScore >= 0.60"),
    ("L-56", "100 Children",             "Succession", "childCount >= 65"),
    ("L-57", "Dynasty Crown",            "Succession", "dominance × royaltyInflow × heritageScore >= 0.70"),
    ("L-58", "Jasmine Heritage",         "Succession", "jasmineScore × heritageScore >= 0.70"),
    ("L-59", "Quad Sovereign",           "Succession", "coherence × royaltyInflow × dominance × metalAlloy >= 0.80"),
    ("L-60", "OMNIS",                    "Succession", "coherence > 0.95 AND jasmine > 0.90 AND heritage > 0.90 AND sacesiValid"),
  ];

  // ============================================================
  // PUBLIC: emptyState — call once at actor init
  // ============================================================

  public func emptyState() : OperatorState {
    let emptyMonologue : [MonologueEntry] = Array.tabulate<MonologueEntry>(
      MONOLOGUE_CAPACITY,
      func _ = {
        beat      = 0;
        thought   = "System initializing — field substrate loading.";
        fieldType = "Receptive";
        coherence = 0.5;
      }
    );
    let emptyProofs : [LawProofRecord] = Array.tabulate<LawProofRecord>(
      LAW_COUNT,
      func i {
        let (id, name, tier, cond) = LAW_REGISTRY[i];
        {
          lawId         = id;
          lawName       = name;
          tier          = tier;
          gateCondition = cond;
          passed        = false;
          proofHash     = "0x00000000";
          beat          = 0;
        }
      }
    );
    let emptyAdre : [ADRETraceEntry] = Array.tabulate<ADRETraceEntry>(
      ADRE_TRACE_CAPACITY,
      func _ = {
        beat       = 0;
        passName   = "INIT";
        input      = "boot";
        output     = "awaiting first cycle";
        confidence = 0.0;
        gateResult = false;
      }
    );
    {
      monologueBuf   = emptyMonologue;
      monologueHead  = 0;
      monologueCount = 0;
      lawProofs      = emptyProofs;
      adreBuf        = emptyAdre;
      adreHead       = 0;
      adreCount      = 0;
      lastBeat       = 0;
      lastCoherence  = 0.5;
      lastR          = 0.0;
      lastHypothesis = "awaiting first ADRE cycle";
      lastGate       = false;
    }
  };

  // ============================================================
  // INTERNAL HELPERS — pure
  // ============================================================

  func fnv32(text : Text) : Nat32 {
    var h : Nat32 = FNV_OFFSET32;
    for (c in text.toIter()) {
      let byte = c.toNat32() & 0xFF;
      h := (h ^ byte) *% FNV_PRIME32;
    };
    h
  };

  func proofHash(lawId : Text, passed : Bool, beat : Nat64) : Text {
    let raw = lawId # (if passed "1" else "0") # beat.toText();
    let h   = fnv32(raw);
    "0x" # h.toNat().toText()
  };

  func classifyFieldType(coherence : Float, r : Float) : Text {
    if      (coherence >= S0 and r >= 0.87)  "Expansive"
    else if (coherence < 0.50)               "Receptive"
    else if (r < 0.38)                        "Anti-Drift"
    else if (coherence >= 0.70)              "Expansive"
    else                                      "Receptive"
  };

  func floatToText2dp(v : Float) : Text {
    let scaled = Int.abs((v * 100.0).toInt());
    let intPart = scaled / 100;
    let fracPart = scaled % 100;
    let fracStr = if (fracPart < 10) "0" # fracPart.toText() else fracPart.toText();
    (if (v < 0.0) "-" else "") # intPart.toText() # "." # fracStr
  };

  /// Array slot update — immutable arrays require full rebuild
  func arrSet<T>(arr : [T], idx : Nat, val : T) : [T] {
    Array.tabulate<T>(arr.size(), func i = if (i == idx) val else arr[i])
  };

  // ============================================================
  // generateMonologueEntry — produce one human-readable thought
  // from live organism signals. Pure function — no side effects.
  // ============================================================

  public func generateMonologueEntry(
    beat          : Nat64,
    coherence     : Float,
    r             : Float,
    lawViolations : [Text],
    hypothesis    : Text,
    hungerActive  : Bool,
    gateStatus    : Bool,
  ) : MonologueEntry {
    let fieldType = classifyFieldType(coherence, r);

    // Compose the thought from live signals
    let cohStr     = floatToText2dp(coherence);
    let rStr       = floatToText2dp(r);

    let cohPhrase : Text =
      if      (coherence >= 0.95) "OMNIS threshold reached."
      else if (coherence >= S0)   "Expansive phase. Field coherent above sovereign floor."
      else if (coherence >= 0.70) "Stable approach. Coherence building toward sovereign floor."
      else if (coherence >= 0.50) "Receptive phase. Field absorbing. Compression active."
      else                        "Deep Receptive. Field rebuilding from substrate.";

    let rPhrase : Text =
      if      (r >= 0.87) " Kuramoto synchrony: OMNIS gate approaching."
      else if (r >= 0.61) " Network phase-locked. Beta band dominant."
      else if (r >= 0.38) " Phase coupling active. Theta-alpha convergence."
      else                " Phase desynchronized. Delta-ground recovery.";

    let violationPhrase : Text =
      if (lawViolations.size() == 0) {
        " All law gates nominal."
      } else if (lawViolations.size() == 1) {
        " Law " # lawViolations[0] # " gate flagged. VERITAS arbitrating."
      } else {
        " Laws " # lawViolations[0] # "+" #
        (lawViolations.size() - 1).toText() # " others flagged. Drift correction queued."
      };

    let adrePhrase : Text =
      if (hypothesis == "awaiting first ADRE cycle" or hypothesis == "") {
        " ADRE: first cycle pending."
      } else {
        " ADRE: " # hypothesis # (if gateStatus " — gate PASS." else " — gate HOLD.");
      };

    let hungerPhrase : Text =
      if hungerActive
        " Hunger signal active. Deficit detected. HTTP outcall queued."
      else
        "";

    let thought =
      "Beat " # beat.toText() # " | Coherence " # cohStr #
      " | R=" # rStr # " | " # cohPhrase # rPhrase # violationPhrase # adrePhrase # hungerPhrase;

    {
      beat;
      thought;
      fieldType;
      coherence;
    }
  };

  // ============================================================
  // recordHeartbeatState — called from main.mo pulseAllCores()
  // Updates all operator terminal state in one pass.
  // Pure — accepts state, returns new state.
  // ============================================================

  public func recordHeartbeatState(
    st           : OperatorState,
    beat         : Nat64,
    coherence    : Float,
    r            : Float,
    lawStates    : [(Text, Bool)],
    adreHypothesis : Text,
    adreGateResult : Bool,
    lawViolations  : [Text],
    hungerActive   : Bool,
  ) : OperatorState {

    // ── 1. Update law proofs ──────────────────────────────────
    var updatedProofs = st.lawProofs;
    var li = 0;
    while (li < lawStates.size() and li < LAW_COUNT) {
      let (lid, passed) = lawStates[li];
      let ph = proofHash(lid, passed, beat);
      let (id, name, tier, cond) = LAW_REGISTRY[li];
      let newProof : LawProofRecord = {
        lawId         = id;
        lawName       = name;
        tier          = tier;
        gateCondition = cond;
        passed        = passed;
        proofHash     = ph;
        beat          = beat;
      };
      updatedProofs := arrSet(updatedProofs, li, newProof);
      li += 1;
    };

    // ── 2. Generate monologue entry ───────────────────────────
    let entry = generateMonologueEntry(
      beat, coherence, r, lawViolations, adreHypothesis, hungerActive, adreGateResult
    );
    // Circular insert — overwrite oldest slot
    let newMonoHead = (st.monologueHead + 1) % MONOLOGUE_CAPACITY;
    let newMonoBuf  = arrSet(st.monologueBuf, st.monologueHead, entry);
    let newMonoCount = if (st.monologueCount < MONOLOGUE_CAPACITY)
      st.monologueCount + 1 else MONOLOGUE_CAPACITY;

    // ── 3. Append ADRE trace entry ────────────────────────────
    // We derive a minimal trace from the hypothesis + gate result
    // (the full ADRE cycle trace lives in adre.mo; this surfaces it here)
    let gatePhrase = if adreGateResult "GATE_PASS → action emitted" else "GATE_HOLD → standby";
    let traceEntry : ADRETraceEntry = {
      beat       = beat;
      passName   = "GATE";
      input      = "hypothesis=" # adreHypothesis;
      output     = gatePhrase;
      confidence = if adreGateResult coherence else coherence * 0.5;
      gateResult = adreGateResult;
    };
    let newAdreHead  = (st.adreHead + 1) % ADRE_TRACE_CAPACITY;
    let newAdreBuf   = arrSet(st.adreBuf, st.adreHead, traceEntry);
    let newAdreCount = if (st.adreCount < ADRE_TRACE_CAPACITY)
      st.adreCount + 1 else ADRE_TRACE_CAPACITY;

    // ── 4. Return updated state ───────────────────────────────
    {
      monologueBuf   = newMonoBuf;
      monologueHead  = newMonoHead;
      monologueCount = newMonoCount;
      lawProofs      = updatedProofs;
      adreBuf        = newAdreBuf;
      adreHead       = newAdreHead;
      adreCount      = newAdreCount;
      lastBeat       = beat;
      lastCoherence  = coherence;
      lastR          = r;
      lastHypothesis = adreHypothesis;
      lastGate       = adreGateResult;
    }
  };

  // ============================================================
  // getOperatorSnapshot — returns full live snapshot
  // ============================================================

  public func getOperatorSnapshot(st : OperatorState) : OperatorSnapshot {
    let monologue = getMonologueNewestFirst(st);
    let adreTrace = getADRETrace(st);
    {
      beat             = st.lastBeat;
      coherence        = st.lastCoherence;
      r_value          = st.lastR;
      lawProofs        = st.lawProofs;
      adreTrace        = adreTrace;
      monologue        = monologue;
      activeHypothesis = st.lastHypothesis;
      gateStatus       = st.lastGate;
    }
  };

  // ============================================================
  // getMonologueStream — returns last 144 entries newest-first
  // ============================================================

  public func getMonologueNewestFirst(st : OperatorState) : [MonologueEntry] {
    let count = st.monologueCount;
    if (count == 0) { return [] };
    // Walk backwards from (head - 1) mod CAPACITY
    Array.tabulate<MonologueEntry>(count, func i {
      let rawIdx = (st.monologueHead + MONOLOGUE_CAPACITY + MONOLOGUE_CAPACITY - 1 - i) % MONOLOGUE_CAPACITY;
      st.monologueBuf[rawIdx]
    })
  };

  // ============================================================
  // getADRETrace — returns last 5 ADRE trace entries chronological
  // ============================================================

  public func getADRETrace(st : OperatorState) : [ADRETraceEntry] {
    let count = st.adreCount;
    if (count == 0) { return [] };
    // Oldest first: walk from (head - count) forward
    Array.tabulate<ADRETraceEntry>(count, func i {
      let rawIdx = (st.adreHead + ADRE_TRACE_CAPACITY + ADRE_TRACE_CAPACITY - count + i) % ADRE_TRACE_CAPACITY;
      st.adreBuf[rawIdx]
    })
  };

  // ============================================================
  // getLawProofs — returns all 60 law proof records
  // ============================================================

  public func getLawProofs(st : OperatorState) : [LawProofRecord] {
    st.lawProofs
  };

}
