// ============================================================
// CYCLE CONVERSION — cycle_conversion.mo
// NeuroEmergence Core — Sovereign Cycle Chain Layer 3/3
// Creator: Alfredo Medina Hernandez | Dallas, TX 2026
// TOP SECRET PROPRIETARY — All rights reserved.
//
// NATIVE CYCL TOKENS → ICP CYCLE RESERVE
// The sovereign reserve law. CYCL held = ICP cycles available.
//
// CONVERSION LAW:
//   1 CYCL = PHI × SCHUMANN_PERIOD_MS = 1.618... × 127.7 = 206.77... ICP cycles
//   This is not arbitrary. It ties the organism's fuel to the planet's resonance
//   period scaled by the golden ratio. Every CYCL is a slice of Schumann-time.
//
// RESERVE TARGET LAW:
//   Target per beat = HEARTBEAT_MS × PHI^2 = 873 × 2.618 = 2285.5 cycles/beat
//   The organism must maintain PHI^2 worth of heartbeat cycles per beat.
//   Buffer zone = target × PHI^2 = 2285.5 × 2.618 = ~5984 cycles
//   If reserve < buffer: DEFICIT. If reserve > target × PHI^3: SURPLUS.
//
// JUBILEE LAW:
//   Every 144 beats (FIB[12]) = one jubilee.
//   Surplus compounds at PHI_INV rate per jubilee.
//   144 = chromatic octave × PHI^2 rounded — the law of restoration.
// ============================================================

import SovereignLaws "sovereign_laws";

module {

  // ============================================================
  // SOVEREIGN CONSTANTS — all derived, none arbitrary
  // ============================================================

  // CONVERSION_RATE = PHI × SCHUMANN_PERIOD_MS = 1.6180339887498948482 × 127.7
  // = 206.7409403213885... ICP cycles per CYCL
  // PHI × Schumann_period ties the native token to real cosmic time.
  public let CONVERSION_RATE : Float = 206.74094032138852;  // PHI × 127.7

  // TARGET_PER_BEAT = HEARTBEAT_MS × PHI^2 = 873.0 × 2.6180339887498948482
  // = 2285.543672018738... cycles per beat
  // This is the minimum the organism needs per heartbeat to sustain itself.
  public let TARGET_PER_BEAT : Float = 2285.5436720187384;  // 873 × PHI^2

  // BUFFER_TARGET = TARGET_PER_BEAT × PHI^2 = 2285.5436... × 2.6180339887498948482
  // = 5983.4813... cycles — sovereign floor below which deficit fires
  public let BUFFER_TARGET : Float = 5983.481342419264;     // 873 × PHI^4

  // SURPLUS_THRESHOLD = TARGET_PER_BEAT × PHI^3 = 2285.5436... × 4.2360679774997896964
  // = 9680.6616... cycles — above this the organism has surplus
  public let SURPLUS_THRESHOLD : Float = 9680.661604649117;  // 873 × PHI^5

  // JUBILEE_PERIOD = FIB[12] = 144 beats
  // The Hebrew/ancient jubilee law encoded in Fibonacci.
  // Every 144 beats: the organism counts its surplus and compounds it.
  public let JUBILEE_PERIOD : Nat = 144;  // FIB[12]

  // SURPLUS_COMPOUND_RATE = PHI_INV = 0.618 per jubilee
  // Surplus grows at the golden ratio inverse — moderate, sustainable compounding.
  // Not exponential. The organism breathes in golden spirals, not geometric blowups.
  public let SURPLUS_COMPOUND_RATE : Float = SovereignLaws.PHI_INV;

  // ============================================================
  // RESIDENT STATE
  // ============================================================
  public type CycleConversionResident = {
    var cycl_reserve    : Float;  // cumulative CYCL balance
    var cycle_reserve   : Float;  // ICP cycles equivalent (cycl × CONVERSION_RATE)
    var jubilee_count   : Nat;    // how many jubilee cycles have completed
    var total_produced  : Float;  // total CYCL ever received
    var deficit         : Float;  // current cycle deficit (0 if healthy)
    var surplus         : Float;  // current surplus above threshold
  };

  public func emptyResident() : CycleConversionResident {
    {
      var cycl_reserve  = 0.0;
      var cycle_reserve = 0.0;
      var jubilee_count = 0;
      var total_produced= 0.0;
      var deficit       = 0.0;
      var surplus       = 0.0;
    }
  };

  // ============================================================
  // COMPUTATE
  // ============================================================

  /// convertCycl: COMPUTATE — called every heartbeat with new CYCL from the engine
  /// Adds new_cycl to reserve, recomputes ICP cycle equivalent,
  /// evaluates deficit/surplus, and runs jubilee compounding every 144 beats.
  public func convertCycl(
    r        : CycleConversionResident,
    new_cycl : Float,
    beat_num : Nat
  ) : {
    reserve  : Float;
    deficit  : Float;
    surplus  : Float;
    rate     : Float;
  } {
    // Add incoming CYCL to the reserve
    r.cycl_reserve   += new_cycl;
    r.total_produced += new_cycl;

    // Convert CYCL balance to ICP cycle equivalent
    // cycle_reserve = cycl_reserve × CONVERSION_RATE
    r.cycle_reserve := r.cycl_reserve * CONVERSION_RATE;

    // ── DEFICIT EVALUATION ──
    // Deficit fires when actual reserve < BUFFER_TARGET
    // DEFICIT = BUFFER_TARGET - actual_reserve  (always positive when underfunded)
    if (r.cycle_reserve < BUFFER_TARGET) {
      r.deficit := BUFFER_TARGET - r.cycle_reserve;
      r.surplus := 0.0;
    } else {
      r.deficit := 0.0;
      // ── SURPLUS EVALUATION ──
      // Surplus = amount above SURPLUS_THRESHOLD
      if (r.cycle_reserve > SURPLUS_THRESHOLD) {
        r.surplus := r.cycle_reserve - SURPLUS_THRESHOLD;
      } else {
        r.surplus := 0.0;
      };
    };

    // ── JUBILEE COMPOUNDING ──
    // Every JUBILEE_PERIOD (144) beats: compound any surplus at PHI_INV rate
    // COMPOUND = surplus × PHI_INV × jubilee_count
    // This rewards the organism for maintaining sovereign surplus over time.
    if (beat_num > 0 and beat_num % JUBILEE_PERIOD == 0 and r.surplus > 0.0) {
      r.jubilee_count += 1;
      let compound = r.surplus * SURPLUS_COMPOUND_RATE;
      // Compound adds directly to CYCL reserve (cycles are sovereign money)
      r.cycl_reserve   += compound / CONVERSION_RATE;  // back-convert to CYCL units
      r.cycle_reserve  += compound;                     // add cycles directly
      // Recheck surplus after compounding
      if (r.cycle_reserve > SURPLUS_THRESHOLD) {
        r.surplus := r.cycle_reserve - SURPLUS_THRESHOLD;
      };
    };

    {
      reserve = r.cycle_reserve;
      deficit = r.deficit;
      surplus = r.surplus;
      rate    = CONVERSION_RATE;
    }
  };

  /// getConversionState: full snapshot of the sovereign reserve
  public func getConversionState(r : CycleConversionResident) : {
    cycl_reserve     : Float;
    cycle_reserve    : Float;
    deficit          : Float;
    surplus          : Float;
    conversion_rate  : Float;
    target_per_beat  : Float;
    jubilee_count    : Nat;
    total_produced   : Float;
  } {{
    cycl_reserve    = r.cycl_reserve;
    cycle_reserve   = r.cycle_reserve;
    deficit         = r.deficit;
    surplus         = r.surplus;
    conversion_rate = CONVERSION_RATE;
    target_per_beat = TARGET_PER_BEAT;
    jubilee_count   = r.jubilee_count;
    total_produced  = r.total_produced;
  }};

  /// getConversionRate: the PHI × SCHUMANN_PERIOD_MS constant
  public func getConversionRate() : Float { CONVERSION_RATE };

  /// isDeficit: true when cycle reserve is below the sovereign buffer floor
  public func isDeficit(r : CycleConversionResident) : Bool {
    r.cycle_reserve < BUFFER_TARGET
  };

}
