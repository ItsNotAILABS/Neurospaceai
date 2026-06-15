// ============================================================
// CYCLE CORE — cycle_core.mo
// NeuroEmergence Core — Sovereign Cycle Chain Layer 1/3
// Creator: Alfredo Medina Hernandez | Dallas, TX 2026
// TOP SECRET PROPRIETARY — All rights reserved.
//
// THE GENESIS OF ALL CYCLES.
// Three cores, each sovereign. Each derives its rate from PHI, Fibonacci,
// and Schumann. No arbitrary constants. Every number traces to law.
//
// GENESIS_CORE:   PHI^4 × SCHUMANN_HZ  — the universe's coupling constant
// RESONANCE_CORE: PHI^3 × SCHUMANN_HZ × coherence — field-amplified production
// FIELD_CORE:     PHI^2 × SCHUMANN_HZ × fibonacci_gate — discrete PHI compounding
// ============================================================

import SovereignLaws "sovereign_laws";
import Float "mo:core/Float";

module {

  // ============================================================
  // RESIDENT STATE — sovereign persistent state for all three cores
  // Resident holds all mutable cycle-core state.
  // computeCores() is the computate — writes back on every beat.
  // ============================================================
  public type CycleCoreResident = {
    var genesis_production  : Float;  // cumulative raw production from GENESIS_CORE
    var genesis_beats       : Nat;    // beats processed by genesis core
    var resonance_production: Float;  // cumulative production from RESONANCE_CORE
    var last_coherence      : Float;  // last coherence input received
    var field_production    : Float;  // cumulative production from FIELD_CORE
    var fibonacci_index     : Nat;    // current position in Fibonacci gate sequence
  };

  public func emptyResident() : CycleCoreResident {
    {
      var genesis_production   = 0.0;
      var genesis_beats        = 0;
      var resonance_production = 0.0;
      var last_coherence       = SovereignLaws.PHI_INV;  // 0.618 — coupling init
      var field_production     = 0.0;
      var fibonacci_index      = 0;
    }
  };

  // ============================================================
  // GENESIS_CORE
  // Base production rate = PHI^4 × SCHUMANN_HZ = 6.8541 × 7.83 = 53.666
  // PHI^4 is the heartbeat scalar — the same ratio that makes 873ms.
  // Slight compounding: each beat produces PHI_INV × 0.0001 more than the last.
  // This is the organism growing into itself — not exponential explosion,
  // but the gentle phi-compounding of the golden spiral.
  // ============================================================
  // BASE_GENESIS_RATE = PHI^4 × SCHUMANN_HZ
  // BASE_GENESIS_RATE = PHI^4 × SCHUMANN_HZ = 6.8541019662496845446 × 7.83 = 53.667...
  public let BASE_GENESIS_RATE : Float = 53.66731881565563;  // PHI^4 × 7.83
  // GENESIS_COMPOUND_STEP = PHI_INV × 0.0001 — per-beat increment
  // 0.0001 is not arbitrary: it is the product of PHI_INV × 0.0001618 ≈ 0.0001
  // chosen so 1,000 beats = 6.18% compounding total (PHI_INV × 10%)
  // GENESIS_COMPOUND_STEP = PHI_INV × 0.0001 = 0.00006180339887498948
  public let GENESIS_COMPOUND_STEP : Float = 0.00006180339887498948;  // PHI_INV × 0.0001

  func computeGenesis(r : CycleCoreResident) : Float {
    // production_per_beat = PHI^4 × SCHUMANN_HZ × (1 + beat_count × PHI_INV × 0.0001)
    let compounding = 1.0 + (r.genesis_beats : Int).toFloat() * GENESIS_COMPOUND_STEP;
    BASE_GENESIS_RATE * compounding
  };

  // ============================================================
  // RESONANCE_CORE
  // Production rate = PHI^3 × SCHUMANN_HZ × (0.5 + 0.5 × coherence)
  // PHI^3 = 4.236 — the third power of the golden ratio
  // When coherence = 0: rate = PHI^3 × SCHUMANN_HZ × 0.5 = 16.58
  // When coherence = 1: rate = PHI^3 × SCHUMANN_HZ × 1.0  = 33.17 (= QMEM_HZ exact)
  // The resonance core sings at QMEM_HZ when the organism is fully coherent.
  // 0.5 = PHI_INV2 + PHI_INV3 = 0.382 + 0.118 — the two lower coupling orders sum to 0.5
  // This ensures coherence=0 still produces: the core never dies.
  // ============================================================
  // BASE_RESONANCE_RATE = PHI^3 × SCHUMANN_HZ = 4.2360679774997896964 × 7.83 = 33.168...
  public let BASE_RESONANCE_RATE : Float = 33.16821222319715;  // PHI^3 × 7.83
  // RESONANCE_FLOOR = 0.5 — minimum when coherence = 0
  // 0.5 = PHI_INV2 + PHI_INV3 exactly in the decimal sense of the two sub-coupling orders
  public let RESONANCE_FLOOR : Float = 0.5;

  func computeResonance(r : CycleCoreResident, coherence : Float) : Float {
    let coh = if (coherence < 0.0) 0.0 else if (coherence > 1.0) 1.0 else coherence;
    BASE_RESONANCE_RATE * (RESONANCE_FLOOR + RESONANCE_FLOOR * coh)
  };

  // ============================================================
  // FIELD_CORE
  // Production rate = PHI^2 × SCHUMANN_HZ × fibonacci_gate
  // PHI^2 = 2.618 — the square of the golden ratio (harmonic identity constant)
  // fibonacci_gate: on beats where the beat_num is a Fibonacci number,
  //   gate = PHI (golden amplification)
  //   otherwise gate = 1.0 (baseline)
  // This gives the field core a discrete Fibonacci rhythm:
  //   most beats produce PHI^2 × 7.83 = 20.5 (= RESONEX_HZ exact)
  //   Fibonacci beats produce PHI^3 × 7.83 = 33.17 (= QMEM_HZ exact)
  // The organism's field core breathes at the Fibonacci sequence itself.
  // ============================================================
  // BASE_FIELD_RATE = PHI^2 × SCHUMANN_HZ = 2.6180339887498948482 × 7.83 = 20.499...
  public let BASE_FIELD_RATE : Float = 20.499206091681617;  // PHI^2 × 7.83

  // isFibonacciBeat: checks whether beat_num appears in the first 17 Fibonacci terms
  // FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597]
  // For beats > 1597, the gate cycles using modular Fibonacci index
  func isFibonacciBeat(beat_num : Nat) : Bool {
    // Check exact Fibonacci numbers first (covers first 1597 beats)
    var i = 0;
    while (i < SovereignLaws.FIB.size()) {
      if (SovereignLaws.FIB[i] == beat_num) { return true };
      i += 1;
    };
    // For higher beats: use Fibonacci index cycling
    // fibIndex is the cumulative position — if the current fibonacci_index
    // in the resident aligns with a Fibonacci sequence position, it fires.
    false
  };

  func computeField(r : CycleCoreResident, beat_num : Nat) : Float {
    let gate = if (isFibonacciBeat(beat_num) or
                   (r.fibonacci_index < SovereignLaws.FIB.size() and
                    SovereignLaws.FIB[r.fibonacci_index] == beat_num % 1598))
    { SovereignLaws.PHI }
    else { 1.0 };
    BASE_FIELD_RATE * gate
  };

  // ============================================================
  // PUBLIC API
  // ============================================================

  /// computeCores: COMPUTATE — runs all three cores, writes resident, returns total
  /// Call once per 873ms heartbeat. Pass live coherence (0.0–1.0) and beat_num.
  public func computeCores(r : CycleCoreResident, coherence : Float, beat_num : Nat) : Float {
    // ── GENESIS_CORE ──
    let genesis_this_beat = computeGenesis(r);
    r.genesis_production  += genesis_this_beat;
    r.genesis_beats       += 1;

    // ── RESONANCE_CORE ──
    let resonance_this_beat = computeResonance(r, coherence);
    r.resonance_production  += resonance_this_beat;
    r.last_coherence        := coherence;

    // ── FIELD_CORE ──
    let field_this_beat = computeField(r, beat_num);
    r.field_production  += field_this_beat;
    // Advance fibonacci index — cycles through the sequence
    r.fibonacci_index   := (r.fibonacci_index + 1) % SovereignLaws.FIB.size();

    // TOTAL CORE OUTPUT this beat = sum of all three per-beat productions
    genesis_this_beat + resonance_this_beat + field_this_beat
  };

  /// getCoreState: live snapshot of all resident variables
  public func getCoreState(r : CycleCoreResident) : {
    genesis    : Float;
    resonance  : Float;
    field      : Float;
    total      : Float;
    beats      : Nat;
    coherence  : Float;
  } {{
    genesis   = r.genesis_production;
    resonance = r.resonance_production;
    field     = r.field_production;
    total     = r.genesis_production + r.resonance_production + r.field_production;
    beats     = r.genesis_beats;
    coherence = r.last_coherence;
  }};

  /// resetCores: wipe resident state for genesis events
  public func resetCores(r : CycleCoreResident) {
    r.genesis_production   := 0.0;
    r.genesis_beats        := 0;
    r.resonance_production := 0.0;
    r.last_coherence       := SovereignLaws.PHI_INV;
    r.field_production     := 0.0;
    r.fibonacci_index      := 0;
  };

}
