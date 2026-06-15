// ============================================================
// ADRE — AURO DELIBERATION & RESONANCE ENGINE
// Sovereign Module — NeuroEmergence Core
// Creator: Alfredo Medina Hernandez — Dallas TX 2026
// TOP SECRET PROPRIETARY — ALL RIGHTS RESERVED
//
// 5-Pass Cognition Loop firing at every 873ms heartbeat.
// PHI = 1.6180339887498948482 (19 decimals, root constant)
// Heartbeat = PHI^4 × (1000/7.83) = 873ms
// Confidence gate = 0.87 (S₀ coherence floor)
// Risk gate = 0.13 (1 - S₀ inverse)
//
// Architecture: pure stateless module. All mutable state is held
// in main.mo as plain stable vars (EOP-safe). Functions here are
// pure — they accept state, compute, return updated state + result.
// ============================================================

import Array  "mo:core/Array";
import Float  "mo:core/Float";
import Int    "mo:core/Int";
import Nat    "mo:core/Nat";
import Nat8   "mo:core/Nat8";
import Nat32  "mo:core/Nat32";
import Nat64  "mo:core/Nat64";
import Text   "mo:core/Text";
import CognitionLayer "cognition_layer";

module {

  // ============================================================
  // DOCTRINE CONSTANTS — SEALED, IMMUTABLE, PHI-DERIVED
  // ============================================================

  let _PHI        : Float = 1.6180339887498948482; // golden ratio, 19 decimals, root constant
  let PHI_INV     : Float = 0.6180339887498948482; // 1 / PHI
  let S0          : Float = 0.87;                  // coherence floor
  let CONFIDENCE_GATE : Float = 0.87;
  let RISK_GATE       : Float = 0.13;

  /// Max decisions in the circular queue — 12² Fibonacci-anchored
  public let MAX_DECISIONS    : Nat = 144;
  /// Coherence ring buffer size
  public let COHERENCE_RING_SIZE : Nat = 100;

  // ============================================================
  // PUBLIC TYPES
  // ============================================================

  /// Signal frame injected from the organism every 873ms
  public type ADRESignalFrame = {
    beat            : Nat64;
    coherence       : Float;
    kuramotoR       : Float;
    neuroChem       : [Float];
    nodePhases      : [Float];
    sourceEngine    : Text;
    quantumAdvantage: Float;
  };

  /// Compressed hypothesis produced by Pass 4
  public type ADREHypothesis = {
    action              : Text;
    predictedCoherence  : Float;
    predictedR          : Float;
    confidenceScore     : Float;
    ringFamily          : Nat8;
    beatCreated         : Nat64;
  };

  /// Critique report from one internal critic in Pass 5
  public type ADRECriticReport = {
    criticId              : Text;
    violationCount        : Nat32;
    passCount             : Nat32;
    alignmentScore        : Float;
    riskScore             : Float;
    opportunityScore      : Float;
    contradictionDetected : Bool;
    recommendation        : Text;
  };

  /// Final decision record emitted after Pass 5 gate
  public type ADREDecision = {
    beat            : Nat64;
    actionId        : Text;
    hypothesis      : ADREHypothesis;
    critics         : [ADRECriticReport];
    finalConfidence : Float;
    finalRisk       : Float;
    gateResult      : Bool;
    sacesiHash      : Nat32;
    memoryCommit    : Text;
    passTrace       : [Text];
  };

  /// Global resonance field trend computed in Pass 3
  public type ADREResonanceState = {
    globalMeaningShift    : Float;
    fieldCoherenceTrend   : Float;
    contradictionCount    : Nat32;
    lastUpdatedBeat       : Nat64;
  };

  /// Stable snapshot of all ADRE state — held in main.mo as plain vars
  public type ADREState = {
    currentSignal     : ?ADRESignalFrame;
    currentHypothesis : ?ADREHypothesis;
    lawChecks         : [Bool];
    critics           : [ADRECriticReport];
    decisionQueue     : [ADREDecision];
    lastEmitBeat      : Nat64;
    resonanceState    : ADREResonanceState;
    passLog           : [Text];
    beatCount         : Nat64;
    /// Circular ring buffer for coherence trend (size = COHERENCE_RING_SIZE)
    coherenceRing     : [Float];
    coherenceRingHead : Nat;
    /// Circular decision buffer (size = MAX_DECISIONS)
    decisionBuf       : [?ADREDecision];
    decisionCount     : Nat;
    decisionHead      : Nat;
  };

  /// Build a fresh zero-state — call once at actor init
  public func emptyState() : ADREState {
    {
      currentSignal     = null;
      currentHypothesis = null;
      lawChecks         = [];
      critics           = [];
      decisionQueue     = [];
      lastEmitBeat      = 0;
      resonanceState    = {
        globalMeaningShift  = 0.0;
        fieldCoherenceTrend = 0.0;
        contradictionCount  = 0;
        lastUpdatedBeat     = 0;
      };
      passLog           = [];
      beatCount         = 0;
      coherenceRing     = Array.repeat<Float>(0.0, COHERENCE_RING_SIZE);
      coherenceRingHead = 0;
      decisionBuf       = Array.repeat<?ADREDecision>(null, MAX_DECISIONS);
      decisionCount     = 0;
      decisionHead      = 0;
    }
  };

  // ============================================================
  // INTERNAL HELPERS — pure functions
  // ============================================================

  func clamp01(x : Float) : Float {
    if (x < 0.0) 0.0 else if (x > 1.0) 1.0 else x
  };

  func ringMean(ring : [Float]) : Float {
    var sum : Float = 0.0;
    for (v in ring.values()) { sum := sum + v };
    if (ring.size() == 0) 0.0 else sum / ring.size().toFloat()
  };

  func fnvRound(h : Nat32, octet : Nat32) : Nat32 {
    (h ^ octet) *% 16777619
  };

  func classifyRingFamily(r : Float) : Nat8 {
    if      (r >= 0.95) 7
    else if (r >= 0.87) 6
    else if (r >= 0.75) 5
    else if (r >= 0.61) 4
    else if (r >= 0.50) 3
    else if (r >= 0.38) 2
    else if (r >= 0.25) 1
    else                0
  };

  func ringAction(family : Nat8) : Text {
    if      (family == 7) "OMNIS_RESONANCE_EMIT"
    else if (family == 6) "HIGH_GAMMA_PROPAGATE"
    else if (family == 5) "GAMMA_INTEGRATE"
    else if (family == 4) "BETA_STABILIZE"
    else if (family == 3) "ALPHA_GROUND"
    else if (family == 2) "THETA_COMPRESS"
    else if (family == 1) "DELTA_RECOVER"
    else                  "GROUND_STATE_HOLD"
  };

  /// Update one slot in an immutable array, return new array
  func arraySet<T>(arr : [T], idx : Nat, val : T) : [T] {
    Array.tabulate<T>(arr.size(), func i = if (i == idx) val else arr[i])
  };

  // ============================================================
  // PASS 1 — FORWARD INGEST
  // ============================================================

  func forward_ingest(
    st     : ADREState,
    signal : ADRESignalFrame
  ) : { st : ADREState; frame : ADRESignalFrame; ringFamily : Nat8 } {
    let family   = classifyRingFamily(signal.kuramotoR);
    let newRing  = arraySet(st.coherenceRing, st.coherenceRingHead, signal.coherence);
    let newHead  = (st.coherenceRingHead + 1) % COHERENCE_RING_SIZE;
    let newSt    = { st with
      currentSignal     = ?signal;
      coherenceRing     = newRing;
      coherenceRingHead = newHead;
    };
    { st = newSt; frame = signal; ringFamily = family }
  };

  // ============================================================
  // PASS 2 — BACKPASS LAW CHECK
  // groundTruthLawScore: if present, biases the coherence threshold
  // downward proportionally — organism's last known law alignment
  // seeds this beat's expectation. Previous good alignment makes
  // the organism more permissive in pass 2; contradiction load tightens it.
  // ============================================================

  func backpass_lawcheck(
    st                 : ADREState,
    frame              : ADRESignalFrame,
    ringFamily         : Nat8,
    groundTruthLawScore: Float,    // from last DoctrineDelta.lawAlignmentScore
    groundTruthContradictions: Nat // from last DoctrineDelta.contradictionCount
  ) : { st : ADREState; lawChecks : [Bool]; violationCount : Nat32; passCount : Nat32 } {
    var violations : Nat32 = 0;
    var passes     : Nat32 = 0;

    // Ground truth bias: high law alignment from last beat → slightly lower threshold
    // High contradiction load → slightly higher threshold (organism is cautious)
    let bias : Float = groundTruthLawScore * 0.05
                     - groundTruthContradictions.toFloat() * 0.003;

    let checksArr = Array.tabulate(60, func i {
      let fired : Bool = if (i == 59) {
        frame.coherence >= 0.95 and frame.kuramotoR >= 0.95 and ringFamily == 7
      } else if (i >= 50) {
        frame.coherence > (0.8 - bias) and frame.kuramotoR > 0.7
      } else if (i >= 40) {
        frame.coherence > (0.7 - bias) and frame.kuramotoR > 0.6
      } else if (i >= 30) {
        frame.coherence > (0.6 - bias) and frame.kuramotoR > 0.5
      } else if (i >= 20) {
        frame.coherence > (0.5 - bias) and frame.kuramotoR > 0.4
      } else if (i >= 10) {
        frame.coherence > (0.4 - bias) and frame.kuramotoR > 0.3
      } else {
        frame.coherence > (0.3 - bias) and frame.kuramotoR > 0.2
      };
      fired
    });

    for (b in checksArr.values()) {
      if (b) { passes     := passes     + 1 }
      else   { violations := violations + 1 };
    };

    let newSt = { st with lawChecks = checksArr };
    { st = newSt; lawChecks = checksArr; violationCount = violations; passCount = passes }
  };

  // ============================================================
  // PASS 3 — RESONANCE CHECK
  // groundTruthCoherenceTrend: feeds in from last DoctrineDelta.
  // Positive trend → seed ring mean higher (organism remembers improving).
  // Negative trend → seed ring mean lower (organism remembers declining).
  // ============================================================

  func resonance_check(
    st                      : ADREState,
    frame                   : ADRESignalFrame,
    lc                      : [Bool],
    groundTruthCoherenceTrend: Float   // from last DoctrineDelta.coherenceTrend
  ) : { st : ADREState; rs : ADREResonanceState } {
    let ringTrend    = ringMean(st.coherenceRing);
    // Bias the trend with the ground truth from the last beat
    let trend        = clamp01(ringTrend + groundTruthCoherenceTrend * 0.05);
    let coherenceDelta = frame.coherence - trend;
    let meaningShift   = Float.abs(coherenceDelta) / (trend + 0.0001);

    var contradictions : Nat32 = 0;
    var j : Nat = 1;
    while (j < lc.size()) {
      if (lc[j] != lc[j - 1]) { contradictions := contradictions + 1 };
      j := j + 1;
    };

    let rs : ADREResonanceState = {
      globalMeaningShift  = clamp01(meaningShift);
      fieldCoherenceTrend = trend;
      contradictionCount  = contradictions;
      lastUpdatedBeat     = frame.beat;
    };
    { st = { st with resonanceState = rs }; rs }
  };

  // ============================================================
  // PASS 4 — COMPRESSION HYPOTHESIS
  // ============================================================

  func compression_hypothesis(
    st         : ADREState,
    frame      : ADRESignalFrame,
    resonance  : ADREResonanceState,
    ringFamily : Nat8
  ) : { st : ADREState; hyp : ADREHypothesis } {
    let predictedCoherence = clamp01(
      frame.coherence + (resonance.fieldCoherenceTrend * 0.1 * PHI_INV)
    );
    let predictedR = clamp01(
      frame.kuramotoR * (1.0 + resonance.globalMeaningShift * 0.05)
    );
    let base = (frame.coherence * 0.5) + (frame.kuramotoR * 0.3) + (frame.quantumAdvantage * 0.2);
    var adjusted = base * (1.0 - resonance.globalMeaningShift * 0.3);
    if (resonance.contradictionCount > 5) { adjusted := adjusted * 0.8 };

    let hyp : ADREHypothesis = {
      action             = ringAction(ringFamily);
      predictedCoherence = predictedCoherence;
      predictedR         = predictedR;
      confidenceScore    = clamp01(adjusted);
      ringFamily         = ringFamily;
      beatCreated        = frame.beat;
    };
    { st = { st with currentHypothesis = ?hyp }; hyp }
  };

  // ============================================================
  // PASS 5 — GATE AND EMIT
  // ============================================================

  func gate_and_emit(
    st         : ADREState,
    hypothesis : ADREHypothesis,
    resonance  : ADREResonanceState,
    lc         : [Bool],
    frame      : ADRESignalFrame
  ) : { st : ADREState; decision : ADREDecision } {

    let c1 : ADRECriticReport = {
      criticId              = "VERITAS";
      violationCount        = if (frame.coherence < S0) 1 else 0;
      passCount             = if (frame.coherence >= S0) 1 else 0;
      alignmentScore        = frame.coherence;
      riskScore             = 1.0 - frame.coherence;
      opportunityScore      = frame.coherence * PHI_INV;
      contradictionDetected = false;
      recommendation        = if (frame.coherence >= S0) "COHERENCE_CLEAR" else "DEFER_COHERENCE_LOW";
    };

    var lawPassCount : Nat32 = 0;
    for (b in lc.values()) { if (b) { lawPassCount := lawPassCount + 1 } };
    let lawViolationCount : Nat32 = 60 - lawPassCount;
    let c2 : ADRECriticReport = {
      criticId              = "LAWS_ENGINE";
      violationCount        = lawViolationCount;
      passCount             = lawPassCount;
      alignmentScore        = lawPassCount.toNat().toFloat() / 60.0;
      riskScore             = lawViolationCount.toNat().toFloat() / 60.0;
      opportunityScore      = (lawPassCount.toNat().toFloat() / 60.0) * PHI_INV;
      contradictionDetected = lawViolationCount > 30;
      recommendation        = if (lawViolationCount == 0) "ALL_LAWS_CLEAR"
                              else "VIOLATIONS_" # lawViolationCount.toText();
    };

    let genomeViolation : Nat32 = if (resonance.contradictionCount > 10) 1 else 0;
    let c3 : ADRECriticReport = {
      criticId              = "GENOME";
      violationCount        = genomeViolation;
      passCount             = 1 - genomeViolation;
      alignmentScore        = hypothesis.confidenceScore;
      riskScore             = clamp01(resonance.globalMeaningShift * 0.5);
      opportunityScore      = hypothesis.confidenceScore * PHI_INV;
      contradictionDetected = resonance.contradictionCount > 10;
      recommendation        = if (resonance.contradictionCount <= 10) "POLICY_ALIGNED"
                              else "CONTRADICTION_LOAD_HIGH";
    };

    let memContradiction = resonance.contradictionCount > 5;
    let memAlignment : Float = if (resonance.fieldCoherenceTrend > S0)
      resonance.fieldCoherenceTrend
    else
      S0 * 0.9;
    let c4 : ADRECriticReport = {
      criticId              = "MEMORY_TEMPLE";
      violationCount        = if (memContradiction) 1 else 0;
      passCount             = if (not memContradiction) 1 else 0;
      alignmentScore        = memAlignment;
      riskScore             = if (memContradiction) 0.4 else 0.1;
      opportunityScore      = memAlignment * PHI_INV;
      contradictionDetected = memContradiction;
      recommendation        = if (not memContradiction) "MEMORY_CONTINUOUS"
                              else "MEMORY_CONTRADICTION_FLAGGED";
    };

    let criticsList = [c1, c2, c3, c4];

    var finalConfidence : Float = hypothesis.confidenceScore;
    for (c in criticsList.values()) { finalConfidence := finalConfidence * c.alignmentScore };
    finalConfidence := clamp01(finalConfidence);

    var riskSum : Float = 0.0;
    for (c in criticsList.values()) { riskSum := riskSum + c.riskScore };
    let finalRisk  : Float = clamp01(riskSum / 4.0);
    let gateResult : Bool  = (finalConfidence > CONFIDENCE_GATE) and (finalRisk < RISK_GATE);

    let beatLow  : Nat32 = Nat32.fromNat(frame.beat.toNat() % 65536);
    let confInt  : Int   = (hypothesis.confidenceScore * 10000.0).toInt();
    let confNat  : Nat32 = Nat32.fromNat(Int.abs(confInt) % 65536);
    let gateNat  : Nat32 = if (gateResult) 1 else 0;

    var sacesiHash : Nat32 = 2166136261;
    sacesiHash := fnvRound(sacesiHash, beatLow);
    sacesiHash := fnvRound(sacesiHash, confNat);
    sacesiHash := fnvRound(sacesiHash, gateNat);

    let memoryCommit : Text = if (gateResult)
      "COMMIT_BEAT_" # frame.beat.toText()
    else
      "DEFERRED_BEAT_" # frame.beat.toText();

    let decision : ADREDecision = {
      beat            = frame.beat;
      actionId        = hypothesis.action # "_" # frame.beat.toText();
      hypothesis      = hypothesis;
      critics         = criticsList;
      finalConfidence = finalConfidence;
      finalRisk       = finalRisk;
      gateResult      = gateResult;
      sacesiHash      = sacesiHash;
      memoryCommit    = memoryCommit;
      passTrace       = [];
    };

    let slot    = st.decisionHead % MAX_DECISIONS;
    let newBuf  = arraySet(st.decisionBuf, slot, ?decision);
    let newHead = st.decisionHead + 1;
    let newCount = if (st.decisionCount < MAX_DECISIONS) st.decisionCount + 1 else MAX_DECISIONS;
    let newLastEmit = if (gateResult) frame.beat else st.lastEmitBeat;

    let newSt : ADREState = { st with
      critics      = criticsList;
      decisionBuf  = newBuf;
      decisionHead = newHead;
      decisionCount= newCount;
      lastEmitBeat = newLastEmit;
    };
    { st = newSt; decision }
  };

  // ============================================================
  // HELPER — reconstruct ordered decision list from circular buffer
  // ============================================================

  public func collectDecisions(st : ADREState) : [ADREDecision] {
    if (st.decisionCount == 0) return [];
    let startSlot = if (st.decisionCount < MAX_DECISIONS) 0
                    else st.decisionHead % MAX_DECISIONS;
    var results : [ADREDecision] = [];
    var k : Nat = 0;
    while (k < st.decisionCount) {
      let slot = (startSlot + k) % MAX_DECISIONS;
      switch (st.decisionBuf[slot]) {
        case (?d) { results := results.concat<ADREDecision>([d]) };
        case null {};
      };
      k := k + 1;
    };
    results
  };

  // ============================================================
  // MAIN ENTRY POINT — runADRECycle
  // Accepts current state + optional ground truth DoctrineDelta.
  // Returns:
  //   st         — updated ADRE state
  //   decision   — this beat's ADREDecision
  //   pendingDelta — if not null, caller MUST write this to the
  //                  DoctrineDelta buffer in main.mo to close the loop.
  //
  // SELF-WRITING LOOP:
  //   ADRE runs → if confidence > 0.87 → pendingDelta is set
  //   main.mo writes pendingDelta to doctrineDeltaBuf
  //   next beat: main.mo reads last delta → passes as groundTruth
  //   → ADRE is biased by its own previous best decisions
  //   → organism improves with every 873ms heartbeat
  // ============================================================

  public func runADRECycle(
    st          : ADREState,
    signal      : ADRESignalFrame,
    groundTruth : ?CognitionLayer.DoctrineDelta
  ) : { st : ADREState; decision : ADREDecision; pendingDelta : ?CognitionLayer.DoctrineDelta } {

    // Extract ground truth biases from last DoctrineDelta
    let (gtLawScore, gtContradictions, gtCoherenceTrend) : (Float, Nat, Float) =
      switch (groundTruth) {
        case (?d) (d.lawAlignmentScore, d.contradictionCount, d.coherenceTrend);
        case null (PHI_INV, 0, 0.0);
      };

    let r1 = forward_ingest(st, signal);
    let r2 = backpass_lawcheck(r1.st, r1.frame, r1.ringFamily, gtLawScore, gtContradictions);
    let r3 = resonance_check(r2.st, r1.frame, r2.lawChecks, gtCoherenceTrend);
    let r4 = compression_hypothesis(r3.st, r1.frame, r3.rs, r1.ringFamily);
    let r5 = gate_and_emit(r4.st, r4.hyp, r3.rs, r2.lawChecks, r1.frame);

    let passTrace : [Text] = [
      "P1_INGEST_RING_" # r1.ringFamily.toText(),
      "P2_LAWCHECK_V" # r2.violationCount.toText() # "_P" # r2.passCount.toText(),
      "P3_RESONANCE_TREND_" # debug_show(r3.rs.fieldCoherenceTrend),
      "P4_HYPOTHESIS_" # r4.hyp.action,
      if (r5.decision.gateResult) "P5_GATE_PASS" else "P5_GATE_HOLD",
    ];

    let finalSt : ADREState = { r5.st with
      beatCount = r5.st.beatCount + 1;
      passLog   = passTrace;
    };
    let finalDecision : ADREDecision = { r5.decision with passTrace = passTrace };

    // DOCTRINE DELTA — write back if confidence gate passed
    // coherenceTrend: +1 if improving vs last ground truth, -1 if declining, 0 if stable
    let coherenceTrend : Float =
      if (r3.rs.fieldCoherenceTrend > gtCoherenceTrend + 0.01) 1.0
      else if (r3.rs.fieldCoherenceTrend < gtCoherenceTrend - 0.01) -1.0
      else 0.0;

    let maybeDelta : ?CognitionLayer.DoctrineDelta =
      if (finalDecision.gateResult) {
        let lawScore = r4.hyp.confidenceScore * (r2.passCount.toNat().toFloat() / 60.0);
        ?{
          beatStamp          = signal.beat.toNat().toInt();
          decisionSummary    = r4.hyp.action;
          lawAlignmentScore  = clamp01(lawScore);
          contradictionCount = r3.rs.contradictionCount.toNat();
          coherenceTrend;
          confidenceScore    = finalDecision.finalConfidence;
          hypothesis         = r4.hyp.action;
          ringFamily         = Nat.fromNat8(r1.ringFamily);
          sacesiHash         = finalDecision.sacesiHash;
        }
      } else null;

    { st = finalSt; decision = finalDecision; pendingDelta = maybeDelta }
  };

  // ============================================================
  // QUERY HELPERS — pure read functions
  // ============================================================

  public func getADREState(st : ADREState) : ADREState {
    { st with decisionQueue = collectDecisions(st) }
  };

  public func getDecisionQueue(st : ADREState) : [ADREDecision] {
    collectDecisions(st)
  };

  public func getCurrentHypothesis(st : ADREState) : ?ADREHypothesis {
    st.currentHypothesis
  };

  public func getResonanceState(st : ADREState) : ADREResonanceState {
    st.resonanceState
  };

  public func getLastDecision(st : ADREState) : ?ADREDecision {
    if (st.decisionCount == 0) return null;
    let offset : Nat = if (st.decisionHead == 0) MAX_DECISIONS - 1 else st.decisionHead - 1;
    st.decisionBuf[offset % MAX_DECISIONS]
  };

  public func getLawCheckSummary(st : ADREState) : { passes : Nat32; violations : Nat32; omnisFired : Bool } {
    var passes : Nat32 = 0;
    var violations : Nat32 = 0;
    for (b in st.lawChecks.values()) {
      if (b) { passes := passes + 1 } else { violations := violations + 1 };
    };
    let omnisFired : Bool = if (st.lawChecks.size() >= 60) st.lawChecks[59] else false;
    { passes; violations; omnisFired }
  };

}
