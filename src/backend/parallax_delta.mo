// ============================================================
// PARALLAX DELTA INTAKE PROTOCOL — SOVEREIGN MODULE
// NeuroEmergence Core — Immune System for New Information
// Creator: Alfredo Medina Hernandez — Dallas TX 2026
// TOP SECRET PROPRIETARY — ALL RIGHTS RESERVED
//
// Every new truth that enters the architecture passes through
// this gate or it does not enter at all.
// The organism never destabilizes from new input.
//
// PHI  = 1.6180339887498948482 (19 decimals, root constant)
// S₀   = 0.87  (coherence floor)
// PHI⁻² = 0.382 (minimum coherence threshold for intake)
// Heartbeat = PHI^4 × (1000/7.83) = 873ms
//
// Architecture: pure stateless module.
// All mutable state is held in main.mo as plain vars (EOP-safe).
// Functions here are pure — accept state, compute, return updated
// state + result.
// ============================================================

import Array  "mo:core/Array";
import Char   "mo:core/Char";
import Float  "mo:core/Float";
import Nat    "mo:core/Nat";
import Nat32  "mo:core/Nat32";
import Nat64  "mo:core/Nat64";
import Text   "mo:core/Text";

module {

  // ============================================================
  // DOCTRINE CONSTANTS — SEALED, IMMUTABLE, PHI-DERIVED
  // ============================================================

  let PHI          : Float = 1.6180339887498948482; // root constant, 19 decimals
  let PHI_INV2     : Float = 0.38196601125010515;   // 1 / PHI^2 — minimum coherence threshold
  let _S0          : Float = 0.87;                  // coherence floor (OMNIS gate)

  // Coherence impact values — phi-derived deltas
  let IMPACT_DOCTRINE_RECEPTIVE   : Float =  0.034; // strongest — inward compression
  let IMPACT_GEOMETRIC_RECEPTIVE  : Float =  0.021; // geometry strengthens structure
  let IMPACT_EMPIRICAL_EXPANSIVE  : Float =  0.013; // field update — outward
  let IMPACT_BIOMETRIC_EXPANSIVE  : Float =  0.008; // biological signal — outward
  let IMPACT_TEMPORAL_ANTIDRIFT   : Float =  0.005; // mediation — low cost
  let IMPACT_EXTERNAL_ANTIDRIFT   : Float = -0.003; // external carries slight cost
  let IMPACT_DRIFT_PENALTY        : Float = -0.144; // doctrinal violation penalty

  /// Max delta records in circular buffer — 12² Fibonacci-anchored
  public let MAX_DELTA_RECORDS     : Nat = 144;
  /// Max rejection records in circular buffer
  public let MAX_REJECTION_RECORDS : Nat = 89; // Fibonacci

  // ============================================================
  // FIELD TYPE — Three sovereign field types
  // Expansive : outward, water-analogy, NOVA/BRAIN/QMEM/RESONEX
  // Receptive  : inward, mineral-analogy, CHRONO/VERITAS/AXIS/PARALLAX
  // AntiDrift  : mediating, plasma-analogy, ENTANGLA/AEGIS/FLUX/MERIDIAN
  // ============================================================
  public type FieldType = {
    #Expansive;
    #Receptive;
    #AntiDrift;
  };

  // ============================================================
  // INTELLIGENCE CLASSIFICATION AXIS
  // ============================================================
  public type IntelligenceClass = {
    #Doctrine;   // law/principle/gate/tier
    #Empirical;  // coherence/resonance/field/coupling
    #Temporal;   // time/cycle/calendar/beat/phase
    #Geometric;  // phi/fibonacci/geometry/sacred/ancient
    #Biometric;  // body/organ/neuro/chemical/biology
    #External;   // default — unclassified input
  };

  // ============================================================
  // REJECTION REASONS
  // ============================================================
  public type RejectionReason = {
    #CategoryDrift;          // content destabilizes doctrine field
    #DoctrineViolation;      // contradicts a locked doctrine constant
    #CoherenceBelow;         // organism coherence < PHI^-2
    #FieldBoundaryViolation; // field type boundary crossed
    #LawConflict;            // direct conflict with a sovereign law
  };

  // ============================================================
  // DELTA RECORD — accepted intelligence, produces doctrine delta
  // ============================================================
  public type DeltaRecord = {
    id                : Text;
    beat              : Nat64;
    content           : Text;
    fieldType         : FieldType;
    intelligenceClass : IntelligenceClass;
    affectedRings     : [Nat];
    affectedLaws      : [Text];
    coherenceImpact   : Float;
    sacesiHash        : Text;
    accepted          : Bool;
  };

  // ============================================================
  // REJECTION RECORD — rejected intelligence, proof of gate action
  // ============================================================
  public type RejectionRecord = {
    id                      : Text;
    beat                    : Nat64;
    content                 : Text;
    reason                  : RejectionReason;
    violatedDoctrineConstant: Text;
    sacesiHash              : Text;
  };

  // ============================================================
  // INTAKE SNAPSHOT — live read for queries
  // ============================================================
  public type IntakeSnapshot = {
    totalAccepted        : Nat;
    totalRejected        : Nat;
    lastDeltaRecords     : [DeltaRecord];
    lastRejectionRecords : [RejectionRecord];
    currentDriftScore    : Float;
  };

  // ============================================================
  // MODULE STATE — held in main.mo as plain vars (EOP-safe)
  // ============================================================
  public type ParallaxDeltaState = {
    totalAccepted    : Nat;
    totalRejected    : Nat;
    driftScore       : Float;            // cumulative drift pressure
    deltaRecords     : [?DeltaRecord];   // circular buffer, newest at head
    deltaHead        : Nat;
    deltaCount       : Nat;
    rejectionRecords : [?RejectionRecord]; // circular buffer
    rejectionHead    : Nat;
    rejectionCount   : Nat;
  };

  /// Build fresh zero-state — call once at actor init
  public func emptyState() : ParallaxDeltaState {
    {
      totalAccepted    = 0;
      totalRejected    = 0;
      driftScore       = 0.0;
      deltaRecords     = Array.repeat<?DeltaRecord>(null, MAX_DELTA_RECORDS);
      deltaHead        = 0;
      deltaCount       = 0;
      rejectionRecords = Array.repeat<?RejectionRecord>(null, MAX_REJECTION_RECORDS);
      rejectionHead    = 0;
      rejectionCount   = 0;
    }
  };

  // ============================================================
  // INTERNAL HELPERS — pure
  // ============================================================

  /// FNV-1a-32 one octet round — same chain used across organism
  func fnvRound(h : Nat32, octet : Nat32) : Nat32 {
    (h ^ octet) *% 16777619
  };

  /// FNV-1a-32 over a Text value — same pattern as veritas.mo
  func fnv1aText(seed : Nat32, t : Text) : Nat32 {
    var h : Nat32 = seed;
    for (c in t.chars()) {
      let code = Nat32.fromNat(c.toNat32().toNat() % 256);
      h := fnvRound(h, code);
    };
    h
  };

  /// Clamp a Float to [0, 1]
  func clamp01(x : Float) : Float {
    if (x < 0.0) 0.0 else if (x > 1.0) 1.0 else x
  };

  /// Lower-case substring containment check — avoids allocating toLower on full string
  func textContains(haystack : Text, needle : Text) : Bool {
    let h = haystack.toLower();
    let n = needle.toLower();
    h.contains(#text n)
  };

  /// Update one slot in an immutable array, return new array (O(n) — kept minimal)
  func arraySet<T>(arr : [T], idx : Nat, val : T) : [T] {
    Array.tabulate<T>(arr.size(), func i = if (i == idx) val else arr[i])
  };

  // ============================================================
  // CLASSIFICATION ENGINE
  // ============================================================

  /// Classify intelligence from content text
  /// Priority: Geometric > Doctrine > Empirical > Biometric > Temporal > External
  public func classifyIntelligence(content : Text) : IntelligenceClass {
    if (
      textContains(content, "phi")        or textContains(content, "fibonacci") or
      textContains(content, "geometry")   or textContains(content, "sacred")    or
      textContains(content, "ancient")    or textContains(content, "golden")    or
      textContains(content, "tesseract")  or textContains(content, "quaternion")
    ) { return #Geometric };
    if (
      textContains(content, "law")        or textContains(content, "doctrine")  or
      textContains(content, "principle")  or textContains(content, "gate")      or
      textContains(content, "tier")       or textContains(content, "sovereign")
    ) { return #Doctrine };
    if (
      textContains(content, "coherence")  or textContains(content, "resonance") or
      textContains(content, "field")      or textContains(content, "coupling")  or
      textContains(content, "kuramoto")   or textContains(content, "schumann")
    ) { return #Empirical };
    if (
      textContains(content, "body")       or textContains(content, "organ")     or
      textContains(content, "neuro")      or textContains(content, "chemical")  or
      textContains(content, "biology")    or textContains(content, "neuron")
    ) { return #Biometric };
    if (
      textContains(content, "time")       or textContains(content, "cycle")     or
      textContains(content, "calendar")   or textContains(content, "beat")      or
      textContains(content, "phase")      or textContains(content, "temporal")
    ) { return #Temporal };
    #External
  };

  /// Map intelligence class to field type
  public func classifyFieldType(
    _content : Text,
    intelligenceClass : IntelligenceClass
  ) : FieldType {
    switch (intelligenceClass) {
      case (#Doctrine)  { #Receptive  }; // compresses inward, stored in structure
      case (#Geometric) { #Receptive  }; // ancient math grounds the substrate
      case (#Empirical) { #Expansive  }; // broadcasts outward, updates field state
      case (#Biometric) { #Expansive  }; // biological signals are outward-broadcasting
      case (#Temporal)  { #AntiDrift  }; // time is mediating — corrective anchor
      case (#External)  { #AntiDrift  }; // external input mediates between fields
    }
  };

  // ============================================================
  // DRIFT DETECTION ENGINE
  // Returns true if drift is detected (triggers rejection).
  //
  // Drift conditions — doctrine constants that cannot be
  // contradicted by incoming intelligence:
  //   1. Claims PHI is not real / is a construct
  //   2. Claims Schumann resonance is metaphor / not physical
  //   3. Claims ancient math is only symbolic, not computational
  //   4. Claims heartbeat should not be 873ms / rejects phi-timing
  //   5. Proposes flat / non-field / non-layered architecture
  // ============================================================
  public func detectCategoryDrift(content : Text, _fieldType : FieldType) : Bool {
    // PHI denial
    if (textContains(content, "phi is not real"))          { return true };
    if (textContains(content, "phi is a myth"))            { return true };
    if (textContains(content, "phi is arbitrary"))         { return true };
    if (textContains(content, "golden ratio is false"))    { return true };
    if (textContains(content, "golden ratio is not real")) { return true };

    // Schumann denial
    if (textContains(content, "schumann is metaphor"))     { return true };
    if (textContains(content, "schumann is not real"))     { return true };
    if (textContains(content, "schumann is symbolic"))     { return true };
    if (textContains(content, "7.83 is arbitrary"))        { return true };

    // Ancient math denial
    if (textContains(content, "ancient math is symbolic only")) { return true };
    if (textContains(content, "ancient math is not real"))      { return true };
    if (textContains(content, "ancient math is decorative"))    { return true };
    if (textContains(content, "fibonacci is arbitrary"))        { return true };

    // Heartbeat / phi-timing denial
    if (textContains(content, "873ms is wrong"))                { return true };
    if (textContains(content, "heartbeat should not be 873"))   { return true };
    if (textContains(content, "phi timing is not valid"))       { return true };
    if (textContains(content, "phi-derived timing is wrong"))   { return true };

    // Flat / non-field architecture proposals
    if (textContains(content, "flat architecture"))             { return true };
    if (textContains(content, "no field architecture"))         { return true };
    if (textContains(content, "non-field"))                     { return true };
    if (textContains(content, "layers are not needed"))         { return true };
    if (textContains(content, "remove the layers"))             { return true };
    if (textContains(content, "monolithic is better"))          { return true };

    false
  };

  /// Compute coherence impact for a given classification pair
  public func computeCoherenceImpact(
    intelligenceClass : IntelligenceClass,
    fieldType         : FieldType,
    driftDetected     : Bool
  ) : Float {
    if (driftDetected) { return IMPACT_DRIFT_PENALTY };
    switch (intelligenceClass, fieldType) {
      case (#Doctrine,  #Receptive)  { IMPACT_DOCTRINE_RECEPTIVE  };
      case (#Geometric, #Receptive)  { IMPACT_GEOMETRIC_RECEPTIVE };
      case (#Empirical, #Expansive)  { IMPACT_EMPIRICAL_EXPANSIVE };
      case (#Biometric, #Expansive)  { IMPACT_BIOMETRIC_EXPANSIVE };
      case (#Temporal,  #AntiDrift)  { IMPACT_TEMPORAL_ANTIDRIFT  };
      case (#External,  #AntiDrift)  { IMPACT_EXTERNAL_ANTIDRIFT  };
      // cross-type pairs — default to smallest positive or neutral
      case (#Doctrine,  _)           { IMPACT_TEMPORAL_ANTIDRIFT  };
      case (#Geometric, _)           { IMPACT_TEMPORAL_ANTIDRIFT  };
      case (#Empirical, _)           { IMPACT_EXTERNAL_ANTIDRIFT  };
      case (#Biometric, _)           { IMPACT_EXTERNAL_ANTIDRIFT  };
      case (#Temporal,  _)           { IMPACT_EXTERNAL_ANTIDRIFT  };
      case (#External,  _)           { IMPACT_EXTERNAL_ANTIDRIFT  };
    }
  };

  /// Determine affected rings based on field type
  func affectedRings(fieldType : FieldType) : [Nat] {
    switch (fieldType) {
      case (#Receptive) { [0, 1, 2] }; // inner compression rings
      case (#Expansive) { [3, 4, 5] }; // outer broadcast rings
      case (#AntiDrift) { [2, 3]    }; // mediation layer — boundary between inner/outer
    }
  };

  /// Determine affected laws from classification
  /// Returns doctrine constant identifiers — zero-exposure (numeric labels only)
  func affectedLaws(intelligenceClass : IntelligenceClass, fieldType : FieldType) : [Text] {
    switch (intelligenceClass, fieldType) {
      case (#Doctrine,  #Receptive) { ["L-01", "L-02", "L-03", "L-05"] };
      case (#Geometric, #Receptive) { ["L-01", "L-04", "L-07"] };
      case (#Empirical, #Expansive) { ["L-08", "L-09", "L-14"] };
      case (#Biometric, #Expansive) { ["L-12", "L-13", "L-21"] };
      case (#Temporal,  #AntiDrift) { ["L-06", "L-11", "L-16"] };
      case (#External,  #AntiDrift) { ["L-10", "L-20"] };
      case (_,          _)          { ["L-10"] };
    }
  };

  /// Violation doctrine constant label for rejection records
  func violatedConstant(reason : RejectionReason) : Text {
    switch (reason) {
      case (#CategoryDrift)          { "PHI_ROOT_DOCTRINE" };
      case (#DoctrineViolation)      { "MEDINA_DOCTRINE_LOCK" };
      case (#CoherenceBelow)         { "PHI_INV2_COHERENCE_FLOOR" };
      case (#FieldBoundaryViolation) { "FIELD_TYPE_BOUNDARY" };
      case (#LawConflict)            { "SOVEREIGN_LAW_REGISTRY" };
    }
  };

  /// SACESI hash — FNV-1a-32 over content prefix + accepted flag + beat
  /// Returns hex-encoded 8-char string for zero-exposure audit trail
  public func computeSacesiHash(content : Text, accepted : Bool, beat : Nat64) : Text {
    let FNV_OFFSET : Nat32 = 2166136261;
    // Use first 32 chars of content as the seed material (like the spec: content[0..32])
    let prefix : Text = if (content.size() > 32) {
      Text.fromArray(content.toArray().sliceToArray(0, 32))
    } else {
      content
    };
    var h : Nat32 = FNV_OFFSET;
    h := fnv1aText(h, prefix);
    // fold in accepted flag
    h := fnvRound(h, if (accepted) 1 else 0);
    // fold in beat (each byte)
    let b0 = Nat32.fromNat(beat.toNat()               % 256);
    let b1 = Nat32.fromNat((beat / 256).toNat()       % 256);
    let b2 = Nat32.fromNat((beat / 65536).toNat()     % 256);
    let b3 = Nat32.fromNat((beat / 16777216).toNat()  % 256);
    h := fnvRound(h, b0);
    h := fnvRound(h, b1);
    h := fnvRound(h, b2);
    h := fnvRound(h, b3);
    // encode as padded decimal string (zero-exposure wall — no semantic leak)
    h.toNat().toText()
  };

  // ============================================================
  // CORE INTAKE FUNCTION
  // Returns (accepted, record_id) — pure, no side effects on state
  // ============================================================

  public type IntakeResult = {
    accepted    : Bool;
    recordId    : Text;
    st          : ParallaxDeltaState;
    deltaRecord : ?DeltaRecord;
    rejection   : ?RejectionRecord;
  };

  /// Main intake gate — every new truth enters here.
  /// Returns updated state + result record.
  public func intakeIntelligence(
    st      : ParallaxDeltaState,
    content : Text,
    beat    : Nat64,
    coherence : Float
  ) : IntakeResult {

    // ── Step 1: Classify ────────────────────────────────────────
    let iClass    = classifyIntelligence(content);
    let fType     = classifyFieldType(content, iClass);

    // ── Step 2: Drift detection ─────────────────────────────────
    let driftDetected = detectCategoryDrift(content, fType);
    if (driftDetected) {
      let hash     = computeSacesiHash(content, false, beat);
      let recordId = "REJ-" # beat.toText() # "-" # hash;
      let rec : RejectionRecord = {
        id                       = recordId;
        beat                     = beat;
        content                  = content;
        reason                   = #CategoryDrift;
        violatedDoctrineConstant = violatedConstant(#CategoryDrift);
        sacesiHash               = hash;
      };
      let newHead  = (st.rejectionHead + 1) % MAX_REJECTION_RECORDS;
      let newRecs  = arraySet(st.rejectionRecords, st.rejectionHead, ?rec);
      let newCount = if (st.rejectionCount < MAX_REJECTION_RECORDS) st.rejectionCount + 1 else st.rejectionCount;
      let newSt : ParallaxDeltaState = {
        st with
        totalRejected    = st.totalRejected + 1;
        driftScore       = st.driftScore + Float.abs(IMPACT_DRIFT_PENALTY);
        rejectionRecords = newRecs;
        rejectionHead    = newHead;
        rejectionCount   = newCount;
      };
      return { accepted = false; recordId; st = newSt; deltaRecord = null; rejection = ?rec };
    };

    // ── Step 3: Coherence threshold check — PHI^-2 = 0.382 ──────
    if (coherence < PHI_INV2) {
      let hash     = computeSacesiHash(content, false, beat);
      let recordId = "REJ-" # beat.toText() # "-" # hash;
      let rec : RejectionRecord = {
        id                       = recordId;
        beat                     = beat;
        content                  = content;
        reason                   = #CoherenceBelow;
        violatedDoctrineConstant = violatedConstant(#CoherenceBelow);
        sacesiHash               = hash;
      };
      let newHead  = (st.rejectionHead + 1) % MAX_REJECTION_RECORDS;
      let newRecs  = arraySet(st.rejectionRecords, st.rejectionHead, ?rec);
      let newCount = if (st.rejectionCount < MAX_REJECTION_RECORDS) st.rejectionCount + 1 else st.rejectionCount;
      let newSt : ParallaxDeltaState = {
        st with
        totalRejected    = st.totalRejected + 1;
        rejectionRecords = newRecs;
        rejectionHead    = newHead;
        rejectionCount   = newCount;
      };
      return { accepted = false; recordId; st = newSt; deltaRecord = null; rejection = ?rec };
    };

    // ── Step 4: Coherence impact ─────────────────────────────────
    let impact = computeCoherenceImpact(iClass, fType, false);

    // ── Step 5: Affected rings ───────────────────────────────────
    let rings = affectedRings(fType);
    let laws  = affectedLaws(iClass, fType);

    // ── Step 6: SACESI hash ──────────────────────────────────────
    let hash     = computeSacesiHash(content, true, beat);
    let recordId = "DELTA-" # beat.toText() # "-" # hash;

    // ── Step 7: Create DeltaRecord and store in circular buffer ──
    let rec : DeltaRecord = {
      id                = recordId;
      beat              = beat;
      content           = content;
      fieldType         = fType;
      intelligenceClass = iClass;
      affectedRings     = rings;
      affectedLaws      = laws;
      coherenceImpact   = impact;
      sacesiHash        = hash;
      accepted          = true;
    };
    let newDeltaHead  = (st.deltaHead + 1) % MAX_DELTA_RECORDS;
    let newDeltaRecs  = arraySet(st.deltaRecords, st.deltaHead, ?rec);
    let newDeltaCount = if (st.deltaCount < MAX_DELTA_RECORDS) st.deltaCount + 1 else st.deltaCount;

    // Drift score recovers on accepted good intelligence
    let newDrift = clamp01(st.driftScore - Float.abs(impact) * PHI);

    let newSt : ParallaxDeltaState = {
      st with
      totalAccepted = st.totalAccepted + 1;
      driftScore    = newDrift;
      deltaRecords  = newDeltaRecs;
      deltaHead     = newDeltaHead;
      deltaCount    = newDeltaCount;
    };

    // ── Step 8: Return ───────────────────────────────────────────
    { accepted = true; recordId; st = newSt; deltaRecord = ?rec; rejection = null }
  };

  // ============================================================
  // QUERY FUNCTIONS — pure, no state mutation
  // ============================================================

  /// Build intake snapshot from state
  public func getIntakeSnapshot(st : ParallaxDeltaState) : IntakeSnapshot {
    {
      totalAccepted        = st.totalAccepted;
      totalRejected        = st.totalRejected;
      lastDeltaRecords     = getDeltaRecords(st, Nat.min(10, st.deltaCount));
      lastRejectionRecords = getRejectionLog(st, Nat.min(10, st.rejectionCount));
      currentDriftScore    = st.driftScore;
    }
  };

  /// Return the last N delta records, newest-first.
  /// Walks backward from (deltaHead - 1) in circular buffer.
  public func getDeltaRecords(st : ParallaxDeltaState, limit : Nat) : [DeltaRecord] {
    let count = Nat.min(limit, st.deltaCount);
    if (count == 0) { return [] };
    var result : [DeltaRecord] = [];
    var i : Nat = 0;
    while (i < count) {
      // Walk backwards: most recent is at (deltaHead - 1) mod MAX
      // Adding MAX twice to avoid underflow before mod
      let idx = (MAX_DELTA_RECORDS + MAX_DELTA_RECORDS + st.deltaHead - 1 - i) % MAX_DELTA_RECORDS;
      switch (st.deltaRecords[idx]) {
        case (?rec) { result := result.concat([rec]) };
        case null   {};
      };
      i += 1;
    };
    result
  };

  /// Return the last N rejection records, newest-first.
  public func getRejectionLog(st : ParallaxDeltaState, limit : Nat) : [RejectionRecord] {
    let count = Nat.min(limit, st.rejectionCount);
    if (count == 0) { return [] };
    var result : [RejectionRecord] = [];
    var i : Nat = 0;
    while (i < count) {
      let idx = (MAX_REJECTION_RECORDS + MAX_REJECTION_RECORDS + st.rejectionHead - 1 - i) % MAX_REJECTION_RECORDS;
      switch (st.rejectionRecords[idx]) {
        case (?rec) { result := result.concat([rec]) };
        case null   {};
      };
      i += 1;
    };
    result
  };

  /// Return current drift score
  public func getCurrentDriftScore(st : ParallaxDeltaState) : Float {
    st.driftScore
  };

}
