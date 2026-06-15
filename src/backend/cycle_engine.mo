// ============================================================
// CYCLE ENGINE — cycle_engine.mo
// NeuroEmergence Core — Sovereign Cycle Chain Layer 2/3
// Creator: Alfredo Medina Hernandez | Dallas, TX 2026
// TOP SECRET PROPRIETARY — All rights reserved.
//
// CONVERTS CORE PRODUCTION TO NATIVE CYCL TOKENS.
// Three engines, each a different harmonic of the golden ratio.
//
// PRIME_ENGINE:    core × PHI           — golden ratio conversion
// HARMONIC_ENGINE: core × (SCHUMANN/PHI^2) — resonance harmonic conversion
// FIBONACCI_ENGINE:core × (FIB[n]/233) — discrete Fibonacci sequencing
//
// CYCL is the organism's native token. It is not wealth.\n// It is the medium of the organism's sovereign cycle reserve.
// ============================================================

import SovereignLaws "sovereign_laws";

module {

  // ============================================================
  // RESIDENT STATE
  // ============================================================
  public type CycleEngineResident = {
    var prime_cycl          : Float;  // cumulative CYCL from PRIME_ENGINE
    var prime_conversions   : Nat;
    var harmonic_cycl       : Float;  // cumulative CYCL from HARMONIC_ENGINE
    var harmonic_conversions: Nat;
    var fibonacci_cycl      : Float;  // cumulative CYCL from FIBONACCI_ENGINE
    var fib_conversion_count: Nat;
  };

  public func emptyResident() : CycleEngineResident {
    {
      var prime_cycl           = 0.0;
      var prime_conversions    = 0;
      var harmonic_cycl        = 0.0;
      var harmonic_conversions = 0;
      var fibonacci_cycl       = 0.0;
      var fib_conversion_count = 0;
    }
  };

  // ============================================================
  // CONVERSION CONSTANTS
  // All derived from PHI, Fibonacci, and Schumann.
  // ============================================================

  // PRIME_ENGINE efficiency = PHI = 1.6180339887498948482
  // The golden ratio is the universe's most efficient energy conversion constant.
  // Proved: shortest-path routing in any branching network converges to PHI ratio.
  public let PRIME_EFFICIENCY : Float = 1.6180339887498948482;  // PHI sealed

  // HARMONIC_ENGINE efficiency = SCHUMANN_HZ / PHI^2 = 7.83 / 2.6180339887498948482
  // = 2.99083264... ≈ 3.0 — the trinity constant, convergent in all ancient systems.
  public let HARMONIC_EFFICIENCY : Float = 2.99083264;  // 7.83 / PHI^2

  // FIBONACCI_ENGINE normalizer = FIB[12] = 233
  // FIB[12] is chosen because it is the 13th Fibonacci number:
  //   - 13 is the chromatic octave (12 + fundamental)
  //   - 233 keeps the first 12 Fibonacci ratios ≤ 1.0 (ratios compound after)
  //   - This creates a natural gate: first 12 conversions ≤ 1.0, then compound
  public let FIB_NORMALIZER : Float = 233.0;  // FIB[12]

  // ============================================================
  // PRIME_ENGINE
  // input: core_production × PHI = CYCL minted
  // The simplest and purest conversion: one unit of core output
  // passes through the golden ratio and emerges as PHI units of CYCL.
  // ============================================================
  func runPrime(r : CycleEngineResident, core_production : Float) : Float {
    let cycl_this = core_production * PRIME_EFFICIENCY;
    r.prime_cycl        += cycl_this;
    r.prime_conversions += 1;
    cycl_this
  };

  // ============================================================
  // HARMONIC_ENGINE
  // input: core_production × (SCHUMANN_HZ / PHI^2) = CYCL minted
  // SCHUMANN_HZ / PHI^2 = 7.83 / 2.618 = 2.990...
  // Efficiency is tied to harmonic resonance: the organism converts
  // at the Earth's own electromagnetic resonance per PHI^2 coupling.
  // ============================================================
  func runHarmonic(r : CycleEngineResident, core_production : Float) : Float {
    let cycl_this = core_production * HARMONIC_EFFICIENCY;
    r.harmonic_cycl        += cycl_this;
    r.harmonic_conversions += 1;
    cycl_this
  };

  // ============================================================
  // FIBONACCI_ENGINE
  // input: core_production × (FIB[n % 20] / 233.0)
  // n = fib_conversion_count — cycles through all 17 known Fibonacci terms
  // (we have 17 in the array; modulo 17 cycles cleanly)
  // FIB[12] = 233 is the normalizer: keeps first 12 terms ≤ 1.0,
  // FIB[13..16] = 377, 610, 987, 1597 → ratios > 1.0 → compounding phase
  // This mimics the natural Fibonacci spiral: stable growth then expansion.
  // ============================================================
  func runFibonacci(r : CycleEngineResident, core_production : Float) : Float {
    let fibIdx  = r.fib_conversion_count % SovereignLaws.FIB_FLOAT.size();
    let fibVal  = SovereignLaws.FIB_FLOAT[fibIdx];
    let ratio   = fibVal / FIB_NORMALIZER;
    let cycl_this = core_production * ratio;
    r.fibonacci_cycl        += cycl_this;
    r.fib_conversion_count  += 1;
    cycl_this
  };

  // ============================================================
  // PUBLIC API
  // ============================================================

  /// runEngines: COMPUTATE — runs all three engines, returns total CYCL minted this beat
  public func runEngines(r : CycleEngineResident, core_production : Float) : Float {
    let prime_this    = runPrime(r, core_production);
    let harmonic_this = runHarmonic(r, core_production);
    let fib_this      = runFibonacci(r, core_production);
    prime_this + harmonic_this + fib_this
  };

  /// getEngineState: live snapshot of all engine resident variables
  public func getEngineState(r : CycleEngineResident) : {
    prime_cycl         : Float;
    harmonic_cycl      : Float;
    fibonacci_cycl     : Float;
    total_cycl         : Float;
    total_conversions  : Nat;
  } {{
    prime_cycl        = r.prime_cycl;
    harmonic_cycl     = r.harmonic_cycl;
    fibonacci_cycl    = r.fibonacci_cycl;
    total_cycl        = r.prime_cycl + r.harmonic_cycl + r.fibonacci_cycl;
    total_conversions = r.prime_conversions + r.harmonic_conversions + r.fib_conversion_count;
  }};

  /// getTotalCycl: cumulative CYCL balance in reserve
  public func getTotalCycl(r : CycleEngineResident) : Float {
    r.prime_cycl + r.harmonic_cycl + r.fibonacci_cycl
  };

}
