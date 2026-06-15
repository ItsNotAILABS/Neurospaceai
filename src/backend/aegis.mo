// ============================================================
// AEGIS — EVERY LOOP EDGE CLOSED
// NeuroEmergence Core — TOP SECRET PROPRIETARY
// Creator: Alfredo Medina Hernandez — Dallas TX 2026
// ALL RIGHTS RESERVED
//
// AEGIS does not add new behavior. It makes existing behavior
// COMPLETE. Every loop that almost closes, AEGIS closes it.
//
// Four edge conditions monitored across all 8 ring types:
//   1. Monitor boundary — ring monitor function near a limit
//   2. Rolling minimum  — quality score drifting toward threshold
//   3. Fear blending    — cortisol affecting output below refractory
//   4. Temporal misalign — async timing offset between rings
//
// All events recorded with FNV-1a SACESI proofs.
//
// PHI = 1.6180339887498948482 (19 decimals, root constant)
// PHI^-2 = 0.3819660112501051518 (temporal correction step)
// Circular event log: 144 entries (12² Fibonacci-anchored)
// ============================================================

import Array  "mo:core/Array";
import Float  "mo:core/Float";
import Int    "mo:core/Int";
import Nat    "mo:core/Nat";
import Nat32  "mo:core/Nat32";
import Nat64  "mo:core/Nat64";
import Text   "mo:core/Text";

module {

  // ============================================================
  // DOCTRINE CONSTANTS — SEALED, IMMUTABLE, PHI-DERIVED
  // ============================================================

  let PHI       : Float = 1.6180339887498948482;
  let PHI_INV2  : Float = 0.3819660112501051518; // PHI^-2 for temporal correction
  let _GABA_MAX : Float = 0.2;                   // max cortisol suppression

  /// Circular event log capacity — 144 = 12² (Fibonacci-anchored)
  public let MAX_EVENTS : Nat = 144;
  /// Rolling minimum window — 8 beats
  public let ROLLING_WINDOW : Nat = 8;
  /// Number of ring types monitored
  public let RING_COUNT : Nat = 8;

  // FNV-1a constants
  let FNV_PRIME32  : Nat32 = 16777619;
  let FNV_OFFSET32 : Nat32 = 2166136261;

  // ============================================================
  // SECTION 1 — TYPES
  // ============================================================

  /// One detected edge event with SACESI proof.
  public type AegisEdgeEvent = {
    ring_id            : Nat;
    edge_type          : Text;  // "monitor_boundary" | "rolling_minimum" | "fear_blend" | "temporal_misalign"
    detected_value     : Float;
    threshold          : Float;
    correction_applied : Float;
    sacesi_proof       : Text;
    beat_at_detection  : Nat64;
    resolved           : Bool;
  };

  /// Summary returned by getAegisSummary.
  public type AegisSummary = {
    total_events  : Nat;
    resolved      : Nat;
    unresolved    : Nat;
    last_event    : ?AegisEdgeEvent;
  };

  // ============================================================
  // COMPLEMENTARY TENSION MONITOR — PHI-LAW
  // Four complementary pairs that MUST maintain generative tension.
  // Ratio must stay within [PHI_INV, PHI] = [0.618, 1.618].
  // When ratio exits this band, one pole is collapsing — AEGIS alerts.
  // This is the Yin/Yang law expressed as computable architecture.
  // ============================================================

  /// One complementary pair with its current tension state.
  public type ComplementaryPair = {
    name    : Text;
    poleA   : Float;  // current value of pole A (0-1 normalized)
    poleB   : Float;  // current value of pole B (0-1 normalized)
    ratio   : Float;  // poleA / poleB — healthy range [PHI_INV, PHI]
    tension : Float;  // |ratio - 1.0| — 0.0 = perfect balance, rising = collapse
    alert   : Bool;   // true when ratio outside [PHI_INV, PHI]
  };

  /// State of all four complementary pairs — computed every 873ms.
  public type ComplementaryTensionState = {
    dualHeart            : ComplementaryPair; // ICP external vs SOVEREIGN internal
    productionRefractory : ComplementaryPair; // artifact production vs refractory load
    externalInternal     : ComplementaryPair; // world-model external vs doctrine signals
    creationConsolidation: ComplementaryPair; // new memory writes vs PIL consolidation
    overallTension       : Float;  // PHI_INV-weighted mean of all four tensions
    anyAlert             : Bool;   // true if any pair is in alert
  };

  /// Build the default (balanced) ComplementaryTensionState.
  public func emptyComplementaryTensionState() : ComplementaryTensionState {
    let balanced : ComplementaryPair = {
      name = ""; poleA = 0.5; poleB = 0.5; ratio = 1.0; tension = 0.0; alert = false
    };
    {
      dualHeart             = { balanced with name = "DUAL_HEART" };
      productionRefractory  = { balanced with name = "PRODUCTION_REFRACTORY" };
      externalInternal      = { balanced with name = "EXTERNAL_INTERNAL" };
      creationConsolidation = { balanced with name = "CREATION_CONSOLIDATION" };
      overallTension        = 0.0;
      anyAlert              = false;
    }
  };

  /// Compute complementary tension for all four sovereign pairs.
  /// Called every heartbeat from main.mo after AEGIS cycle.
  public func measureComplementaryTension(
    icpHeartRate          : Float, // ICP timer regularity [0,1]
    sovereignHeartRate    : Float, // HRV-adjusted organism rate [0,1]
    productionRate        : Float, // artifacts produced per cycle [0,1]
    refractoryLoad        : Float, // refractory pressure [0,1]
    externalSignals       : Float, // world-model external signal weight [0,1]
    internalSignals       : Float, // doctrine/memory signal weight [0,1]
    newMemoryWrites       : Float, // episodic writes this cycle [0,1]
    consolidationPressure : Float  // PIL consolidation load [0,1]
  ) : ComplementaryTensionState {
    let phi    : Float = 1.6180339887498948482;
    let phiInv : Float = 0.6180339887498948482;

    func makePair(name : Text, a : Float, b : Float) : ComplementaryPair {
      let safeB  = if (b < 0.001) 0.001 else b;
      let ratio  = a / safeB;
      let tension = Float.abs(ratio - 1.0);
      let alert  = ratio < phiInv or ratio > phi;
      { name; poleA = a; poleB = b; ratio; tension; alert }
    };

    let dh = makePair("DUAL_HEART",             icpHeartRate,       sovereignHeartRate);
    let pr = makePair("PRODUCTION_REFRACTORY",  productionRate,     refractoryLoad);
    let ei = makePair("EXTERNAL_INTERNAL",      externalSignals,    internalSignals);
    let cc = makePair("CREATION_CONSOLIDATION", newMemoryWrites,    consolidationPressure);
    // PHI_INV-weighted mean — substrate coupling constant, not arithmetic mean
    let overall = (dh.tension + pr.tension + ei.tension + cc.tension) * phiInv / 4.0;
    let anyAlert = dh.alert or pr.alert or ei.alert or cc.alert;
    {
      dualHeart             = dh;
      productionRefractory  = pr;
      externalInternal      = ei;
      creationConsolidation = cc;
      overallTension        = overall;
      anyAlert;
    }
  };

  /// Full AEGIS state — held as plain var in main.mo (EOP-safe).
  /// NOTE: complementaryTension is stored as a SEPARATE stable var
  /// (aegisComplementaryTension) in main.mo for upgrade compatibility.
  /// Do NOT add new fields here — use parallel stable vars instead.
  public type AegisState = {
    /// Circular event log, capped at MAX_EVENTS
    events       : [AegisEdgeEvent];
    eventHead    : Nat;
    eventCount   : Nat;
    /// Per-ring rolling quality score buffers (RING_COUNT × ROLLING_WINDOW)
    rollingBufs  : [[Float]];  // outer = ring, inner = last N scores
    /// Total events emitted lifetime (for health scoring)
    totalEvents  : Nat64;
    unresolvedCount : Nat64;
  };

  // ============================================================
  // STATE CONSTRUCTOR
  // ============================================================

  public func emptyState() : AegisState = {
    events          = Array.repeat<AegisEdgeEvent>(
      {
        ring_id           = 0;
        edge_type         = "init";
        detected_value    = 0.0;
        threshold         = 0.0;
        correction_applied = 0.0;
        sacesi_proof      = "0x00000000";
        beat_at_detection = 0;
        resolved          = true;
      },
      MAX_EVENTS
    );
    eventHead       = 0;
    eventCount      = 0;
    rollingBufs     = Array.repeat<[Float]>(
      Array.repeat<Float>(0.5, ROLLING_WINDOW),
      RING_COUNT
    );
    totalEvents     = 0;
    unresolvedCount = 0;
  };

  // ============================================================
  // INTERNAL HELPERS — pure functions
  // ============================================================

  func clamp(x : Float, lo : Float, hi : Float) : Float {
    if (x < lo) lo else if (x > hi) hi else x
  };

  func clamp01(x : Float) : Float { clamp(x, 0.0, 1.0) };

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

  func buildProof(ring_id : Nat, edge_type : Text, value : Float, beat : Nat64) : Text {
    let valInt : Int = (value * 1_000_000.0).toInt();
    let raw = ring_id.toText() # edge_type # valInt.toText() # beat.toText();
    nat32ToHex(fnv32_text(raw))
  };

  /// Slot update for immutable arrays — builds new array.
  func arrSet<T>(arr : [T], idx : Nat, val : T) : [T] {
    Array.tabulate<T>(arr.size(), func i = if (i == idx) val else arr[i])
  };

  // ============================================================
  // SECTION 2 — MONITOR WRAPPER
  // ============================================================

  /// Check if ring value is within 5% of either boundary.
  /// If edge detected: emit AegisEdgeEvent with correction.
  /// Correction clamps value to 10% inside bounds (not on the edge).
  public func monitorRing(
    ring_id     : Nat,
    curr        : Float,
    lower_bound : Float,
    upper_bound : Float,
    beatCount   : Nat64
  ) : ?AegisEdgeEvent {
    let lowerEdge = lower_bound * 1.05;
    let upperEdge = upper_bound * 0.95;
    if (curr <= lowerEdge or curr >= upperEdge) {
      let correction = clamp(curr, lower_bound * 1.1, upper_bound * 0.9);
      let proof = buildProof(ring_id, "monitor_boundary", curr, beatCount);
      ?{
        ring_id;
        edge_type          = "monitor_boundary";
        detected_value     = curr;
        threshold          = if (curr <= lowerEdge) lower_bound else upper_bound;
        correction_applied = correction;
        sacesi_proof       = proof;
        beat_at_detection  = beatCount;
        resolved           = true; // correction applied — loop closed
      }
    } else {
      null
    }
  };

  // ============================================================
  // SECTION 3 — ROLLING MINIMUM TRACKER
  // ============================================================

  /// Append a new quality score for a ring, trim to ROLLING_WINDOW.
  /// Returns updated state.
  public func updateRollingMinimum(
    st      : AegisState,
    ring_id : Nat,
    newScore : Float
  ) : AegisState {
    if (ring_id >= RING_COUNT) { return st };
    let oldBuf = st.rollingBufs[ring_id];
    // Shift left, append new score at end
    let n = ROLLING_WINDOW;
    let newBuf : [Float] = Array.tabulate<Float>(n, func i {
      if (i + 1 < n) oldBuf[i + 1] else newScore
    });
    let newBufs = arrSet(st.rollingBufs, ring_id, newBuf);
    { st with rollingBufs = newBufs }
  };

  /// If the last 3 scores are all decreasing AND within 20% of threshold,
  /// return Some(projected beat offset when it will cross).
  /// Returns None if healthy.
  public func checkDriftTowardThreshold(
    st        : AegisState,
    ring_id   : Nat,
    threshold : Float
  ) : ?Float {
    if (ring_id >= RING_COUNT) { return null };
    let buf = st.rollingBufs[ring_id];
    let n = ROLLING_WINDOW;
    // Last 3 values: positions n-3, n-2, n-1
    let v0 = buf[n - 3];
    let v1 = buf[n - 2];
    let v2 = buf[n - 1];
    // All decreasing
    let allDecreasing = (v1 < v0) and (v2 < v1);
    // Approaching within 20% of threshold
    let gapToThreshold = v2 - threshold;
    let withinRange = gapToThreshold >= 0.0 and gapToThreshold <= Float.abs(threshold) * 0.20;
    if (allDecreasing and withinRange) {
      // Project crossing: linear extrapolation from decay rate
      let decayRate = (v0 - v2) / 2.0;
      let beatsToThreshold = if (decayRate > 0.0) gapToThreshold / decayRate else 999.0;
      ?beatsToThreshold
    } else {
      null
    }
  };

  // ============================================================
  // SECTION 4 — FEAR BLENDING DETECTOR
  // ============================================================

  /// True if cortisol is elevated (> 0.6) but below refractory (0.8)
  /// AND output quality is degraded (< 0.7).
  /// This catches the cortisol state that degrades output without
  /// triggering a full refractory period — the loop that almost closes.
  public func detectFearBlend(
    cortisolLevel       : Float,
    refractory_threshold : Float,
    output_quality      : Float
  ) : Bool {
    (cortisolLevel > 0.6) and (cortisolLevel < refractory_threshold) and (output_quality < 0.7)
  };

  /// GABA-equivalent cortisol suppression correction.
  /// cortisol_suppression = min(0.2, (cortisol - 0.6) × 0.5)
  /// adjusted_quality = output_quality + suppression × PHI
  /// Clamped to [0,1].
  public func correctFearBlend(cortisol : Float, output_quality : Float) : Float {
    let suppression = Float.min(0.2, (cortisol - 0.6) * 0.5);
    clamp01(output_quality + suppression * PHI)
  };

  // ============================================================
  // SECTION 5 — TEMPORAL ALIGNMENT
  // ============================================================

  /// True if timing offset exceeds tolerance.
  public func detectTemporalMisalign(
    expected_ms : Float,
    actual_ms   : Float,
    tolerance_ms : Float
  ) : Bool {
    Float.abs(expected_ms - actual_ms) > tolerance_ms
  };

  /// PHI^-2 correction step — gradual convergence, never hard reset.
  /// corrected = actual + (expected - actual) × 0.382
  public func correctTemporalMisalign(expected_ms : Float, actual_ms : Float) : Float {
    actual_ms + (expected_ms - actual_ms) * PHI_INV2
  };

  // ============================================================
  // SECTION 6 — AEGIS CYCLE (runs every 873ms heartbeat)
  // ============================================================

  /// Full AEGIS pass over all 8 rings.
  /// - Monitors ring boundaries
  /// - Checks rolling minimum drift
  /// - Detects fear blend
  /// - Returns list of all edge events this cycle
  /// - Appends to circular event log (capped at 144)
  public func runAegisCycle(
    st              : AegisState,
    beatCount       : Nat64,
    ringCoherences  : [Float],  // length = RING_COUNT (or fewer, pads with 0.5)
    cortisolLevel   : Float,
    outputQuality   : Float
  ) : { st : AegisState; events : [AegisEdgeEvent] } {
    var newSt = st;
    var cycleEvents : [AegisEdgeEvent] = [];

    // ── Pass 1: monitor all rings ─────────────────────────────
    var ri = 0;
    while (ri < RING_COUNT) {
      let curr = if (ri < ringCoherences.size()) ringCoherences[ri] else 0.5;
      // Standard coherence bounds: [0.0, 1.0] — edges at 5% of bounds
      switch (monitorRing(ri, curr, 0.0, 1.0, beatCount)) {
        case (?ev) {
          cycleEvents := cycleEvents.concat([ev]);
        };
        case null {};
      };
      // Update rolling minimum
      newSt := updateRollingMinimum(newSt, ri, curr);
      // Check drift toward floor threshold (0.3 = doctrine anti-drift floor)
      switch (checkDriftTowardThreshold(newSt, ri, 0.3)) {
        case (?projBeat) {
          let proof = buildProof(ri, "rolling_minimum", curr, beatCount);
          let driftEv : AegisEdgeEvent = {
            ring_id            = ri;
            edge_type          = "rolling_minimum";
            detected_value     = curr;
            threshold          = 0.3;
            correction_applied = projBeat; // projected beats to crossing
            sacesi_proof       = proof;
            beat_at_detection  = beatCount;
            resolved           = false; // projection — not yet resolved
          };
          cycleEvents := cycleEvents.concat([driftEv]);
        };
        case null {};
      };
      ri := ri + 1;
    };

    // ── Pass 2: fear blend detection ─────────────────────────
    let refractory_threshold : Float = 0.8;
    if (detectFearBlend(cortisolLevel, refractory_threshold, outputQuality)) {
      let corrected = correctFearBlend(cortisolLevel, outputQuality);
      let proof = buildProof(0, "fear_blend", cortisolLevel, beatCount);
      let fearEv : AegisEdgeEvent = {
        ring_id            = 0; // organism-level — not ring-specific
        edge_type          = "fear_blend";
        detected_value     = cortisolLevel;
        threshold          = refractory_threshold;
        correction_applied = corrected;
        sacesi_proof       = proof;
        beat_at_detection  = beatCount;
        resolved           = true; // GABA correction applied
      };
      cycleEvents := cycleEvents.concat([fearEv]);
    };

    // ── Append all events to circular log ────────────────────
    var newEvents = newSt.events;
    var newHead   = newSt.eventHead;
    var newCount  = newSt.eventCount;
    var newTotal  = newSt.totalEvents;
    var newUnresolved = newSt.unresolvedCount;

    for (ev in cycleEvents.values()) {
      newEvents := arrSet(newEvents, newHead % MAX_EVENTS, ev);
      newHead   := newHead + 1;
      newCount  := if (newCount < MAX_EVENTS) newCount + 1 else MAX_EVENTS;
      newTotal  := newTotal + 1;
      if (not ev.resolved) { newUnresolved := newUnresolved + 1 };
    };

    let finalSt : AegisState = {
      newSt with
      events          = newEvents;
      eventHead       = newHead;
      eventCount      = newCount;
      totalEvents     = newTotal;
      unresolvedCount = newUnresolved;
    };
    { st = finalSt; events = cycleEvents }
  };

  // ============================================================
  // QUERY HELPERS — pure read functions
  // ============================================================

  /// Ordered event list from circular buffer (newest-last).
  public func collectEvents(st : AegisState) : [AegisEdgeEvent] {
    if (st.eventCount == 0) { return [] };
    let startSlot = if (st.eventCount < MAX_EVENTS) 0
                    else st.eventHead % MAX_EVENTS;
    Array.tabulate<AegisEdgeEvent>(st.eventCount, func i {
      st.events[(startSlot + i) % MAX_EVENTS]
    })
  };

  /// Health score: 1.0 - (unresolved / total). All resolved = 1.0.
  public func getHealthScore(st : AegisState) : Float {
    if (st.totalEvents == 0) { return 1.0 };
    let unresF = st.unresolvedCount.toNat().toFloat();
    let totalF = st.totalEvents.toNat().toFloat();
    clamp01(1.0 - unresF / totalF)
  };

  /// Latest event (most recently appended), or null.
  public func getLastEvent(st : AegisState) : ?AegisEdgeEvent {
    if (st.eventCount == 0) { return null };
    // Safe Nat subtraction — eventHead > 0 checked above via ternary
    let lastSlot = if (st.eventHead == 0) { MAX_EVENTS - 1 } else { (st.eventHead + MAX_EVENTS - 1) % MAX_EVENTS };
    ?(st.events[lastSlot])
  };

  public func getSummary(st : AegisState) : AegisSummary {
    let allEvents = collectEvents(st);
    var resolvedCount : Nat = 0;
    for (ev in allEvents.values()) {
      if (ev.resolved) { resolvedCount := resolvedCount + 1 };
    };
    {
      total_events = st.eventCount;
      resolved     = resolvedCount;
      unresolved   = if (st.eventCount >= resolvedCount) st.eventCount - resolvedCount else 0;
      last_event   = getLastEvent(st);
    }
  };

  /// Read the current complementary tension state — all 4 sovereign pairs.
  /// Pass aegisComplementaryTension (the separate stable var from main.mo).
  public func getComplementaryTension(cts : ComplementaryTensionState) : ComplementaryTensionState {
    cts
  };

  /// No-op compatibility shim — complementaryTension is now a separate stable var.
  /// Call measureComplementaryTension() directly and write to aegisComplementaryTension.
  /// This function is kept for API compatibility only.
  public func withComplementaryTension(
    st  : AegisState,
    _cts : ComplementaryTensionState
  ) : AegisState {
    st
  };

}
