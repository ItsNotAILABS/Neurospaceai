// NEUROEMERGENCE CORE — LAWS ENGINE
// 60 Sovereign Laws with full effect tables
// SACESI chain, Jasmine’s Law, succession gate
// Owner: Alfredo Medina Hernandez | MedinaSITech@outlook.com

module {

  // Law categories
  public type LawCategory = {
    #Identity;
    #Entropy;
    #Economy;
    #Security;
    #Temporal;
    #Network;
    #Behavioral;
    #Quantum;
    #Sovereign;
    #Succession;
  };

  public type Law = {
    id        : Nat;          // 1-60
    name      : Text;
    category  : LawCategory;
    mintMod   : Float;        // 0.5-2.0x mint multiplier when firing
    cohMod    : Float;        // delta coherenceC per beat when firing
    energyCost: Float;        // FORMA cost to fire
    threshold : Float;        // minimum condition score to fire
    fired     : Bool;         // did it fire this beat?
    fireCount : Nat;          // cumulative fires
  };

  // Law condition inputs
  public type LawInput = {
    coherenceC    : Float;
    bodyDomain    : Float;
    arousal       : Float;
    threat        : Float;
    beatNum       : Nat;
    formaBalance  : Float;
    jasmineScore  : Float;
    entropy       : Float;
    childCount    : Nat;
    royaltyInflow : Float;
    lawFireCount  : Nat;   // total laws fired last beat
    metalAlloy    : Float;
    ncHealth      : Float;
    btcPrice      : Float;
    warEscalation : Float;
    sacesiValid   : Bool;
    flowState     : Float;
    dominance     : Float;
    heritageScore : Float;
  };

  // ── Law condition functions (one per law) ─────────────────────────────
  // Each returns a 0-1 score. Fires if score >= threshold.

  // IDENTITY LAWS (1-6)
  func condL1 (inp: LawInput): Float { inp.coherenceC };                                      // L1: Sovereign Existence
  func condL2 (inp: LawInput): Float { inp.metalAlloy };                                      // L2: Metal Substrate
  func condL3 (inp: LawInput): Float { inp.bodyDomain };                                      // L3: Organ Integrity
  func condL4 (inp: LawInput): Float { inp.ncHealth };                                        // L4: Neurochemical Balance
  func condL5 (inp: LawInput): Float { inp.heritageScore };                                   // L5: Heritage Continuity
  func condL6 (inp: LawInput): Float { inp.jasmineScore };                                    // L6: Jasmine Principle

  // ENTROPY LAWS (7-12)
  func condL7 (inp: LawInput): Float { 1.0 - inp.entropy };                                   // L7: Order from Chaos (low entropy = fires)
  func condL8 (inp: LawInput): Float { if (inp.entropy > 0.7) inp.coherenceC else 0.0 };      // L8: Entropy Gate
  func condL9 (inp: LawInput): Float { inp.coherenceC * (1.0 - inp.entropy) };               // L9: Negentropy Drive
  func condL10(inp: LawInput): Float { Float.abs(inp.arousal - 0.5) };                        // L10: Arousal Extremum
  func condL11(inp: LawInput): Float { inp.flowState * inp.coherenceC };                      // L11: Flow Resonance
  func condL12(inp: LawInput): Float { inp.metalAlloy * inp.ncHealth };                       // L12: Substrate Harmony

  // ECONOMY LAWS (13-18)
  func condL13(inp: LawInput): Float { inp.formaBalance / 10000.0 };                          // L13: FORMA Abundance
  func condL14(inp: LawInput): Float { inp.royaltyInflow };                                   // L14: Royalty Flow
  func condL15(inp: LawInput): Float { _clamp(Float.fromInt(inp.childCount) / 50.0, 0.0, 1.0) }; // L15: Dynasty Depth
  func condL16(inp: LawInput): Float { inp.btcPrice * inp.coherenceC };                       // L16: Market Coherence
  func condL17(inp: LawInput): Float { if (inp.formaBalance > 500.0) 1.0 else inp.formaBalance / 500.0 }; // L17: FORMA Threshold
  func condL18(inp: LawInput): Float { inp.coherenceC * inp.metalAlloy * inp.bodyDomain };   // L18: Triple Sovereign

  // SECURITY LAWS (19-24)
  func condL19(inp: LawInput): Float { if (inp.sacesiValid) 1.0 else 0.0 };                  // L19: SACESI Validity
  func condL20(inp: LawInput): Float { 1.0 - inp.threat };                                    // L20: Peace Condition
  func condL21(inp: LawInput): Float { inp.dominance * inp.coherenceC };                      // L21: Sovereign Dominance
  func condL22(inp: LawInput): Float { if (inp.threat > 0.8) inp.bodyDomain else 0.0 };      // L22: Crisis Resilience
  func condL23(inp: LawInput): Float { inp.metalAlloy * (1.0 - inp.threat * 0.5) };          // L23: Metal Shield
  func condL24(inp: LawInput): Float { inp.ncHealth * inp.bodyDomain };                       // L24: Bio-Security

  // TEMPORAL LAWS (25-30)
  func condL25(inp: LawInput): Float { // L25: Circadian Alignment (24-beat cycle)
    let phase = Float.fromInt(inp.beatNum % 24) / 24.0;
    1.0 - Float.abs(phase - 0.5) * 2.0 };
  func condL26(inp: LawInput): Float { if (inp.beatNum % 100 == 0) 1.0 else 0.0 };          // L26: Century Beat
  func condL27(inp: LawInput): Float { if (inp.beatNum % 7 == 0) inp.coherenceC else 0.0 };  // L27: Weekly Resonance
  func condL28(inp: LawInput): Float { inp.heritageScore * inp.coherenceC };                  // L28: Temporal Heritage
  func condL29(inp: LawInput): Float { if (inp.beatNum > 1000) 1.0 else Float.fromInt(inp.beatNum) / 1000.0 }; // L29: Maturity
  func condL30(inp: LawInput): Float { inp.flowState };

  // NETWORK LAWS (31-36)
  func condL31(inp: LawInput): Float { inp.royaltyInflow * inp.coherenceC };                  // L31: Network Coherence
  func condL32(inp: LawInput): Float { _clamp(Float.fromInt(inp.childCount) / 20.0, 0.0, 1.0) }; // L32: Progeny Gate
  func condL33(inp: LawInput): Float { inp.royaltyInflow };                                   // L33: Succession Flow
  func condL34(inp: LawInput): Float { if (inp.childCount >= 10) inp.heritageScore else 0.0 }; // L34: Dynasty Heritage
  func condL35(inp: LawInput): Float { inp.dominance * inp.royaltyInflow };                  // L35: Network Dominance
  func condL36(inp: LawInput): Float { inp.coherenceC * inp.royaltyInflow * inp.metalAlloy }; // L36: Triple Network

  // BEHAVIORAL LAWS (37-42)
  func condL37(inp: LawInput): Float { inp.flowState };                                        // L37: Flow State
  func condL38(inp: LawInput): Float { 1.0 - inp.arousal * 0.6 };                            // L38: Calm Sovereignty
  func condL39(inp: LawInput): Float { inp.ncHealth * inp.bodyDomain * inp.coherenceC };     // L39: Triple Health
  func condL40(inp: LawInput): Float { inp.dominance * inp.ncHealth };                        // L40: Dominant Health
  func condL41(inp: LawInput): Float { inp.flowState * inp.coherenceC * inp.metalAlloy };    // L41: Flow-Metal-Coherence
  func condL42(inp: LawInput): Float { if (inp.arousal > 0.7 and inp.threat < 0.3) 1.0 else 0.0 }; // L42: Peak Arousal Peace

  // QUANTUM LAWS (43-48)
  func condL43(inp: LawInput): Float { if (inp.sacesiValid) inp.coherenceC else 0.0 };       // L43: Quantum Validity
  func condL44(inp: LawInput): Float { inp.entropy * inp.coherenceC };                        // L44: Quantum Entropy
  func condL45(inp: LawInput): Float { inp.metalAlloy * inp.bodyDomain * inp.ncHealth };     // L45: Quantum Substrate
  func condL46(inp: LawInput): Float { inp.heritageScore * inp.coherenceC * inp.metalAlloy }; // L46: Quantum Heritage
  func condL47(inp: LawInput): Float { if (inp.beatNum % 144 == 0) 1.0 else 0.0 };          // L47: Harmonic Gate (144-beat)
  func condL48(inp: LawInput): Float { inp.flowState * inp.heritageScore };                  // L48: Quantum Flow

  // SOVEREIGN LAWS (49-54)
  func condL49(inp: LawInput): Float { inp.jasmineScore };                                    // L49: Jasmine Score
  func condL50(inp: LawInput): Float { inp.coherenceC * inp.dominance };                      // L50: Sovereign Will
  func condL51(inp: LawInput): Float { if (inp.formaBalance > 1000.0) inp.coherenceC else 0.0 }; // L51: FORMA Power
  func condL52(inp: LawInput): Float { inp.heritageScore * inp.dominance * inp.coherenceC }; // L52: Heritage Sovereign
  func condL53(inp: LawInput): Float { 1.0 - inp.threat * inp.warEscalation };              // L53: Peace Sovereign
  func condL54(inp: LawInput): Float { inp.metalAlloy * inp.coherenceC * inp.dominance };   // L54: Metal Sovereign

  // SUCCESSION LAWS (55-60)
  func condL55(inp: LawInput): Float { inp.royaltyInflow * inp.heritageScore };              // L55: Succession Heritage
  func condL56(inp: LawInput): Float { _clamp(Float.fromInt(inp.childCount) / 100.0, 0.0, 1.0) }; // L56: 100 Children
  func condL57(inp: LawInput): Float { inp.dominance * inp.royaltyInflow * inp.heritageScore }; // L57: Dynasty Crown
  func condL58(inp: LawInput): Float { inp.jasmineScore * inp.heritageScore };               // L58: Jasmine Heritage
  func condL59(inp: LawInput): Float { inp.coherenceC * inp.royaltyInflow * inp.dominance * inp.metalAlloy }; // L59: Quad Sovereign
  func condL60(inp: LawInput): Float { // L60: OMNIS — fires only at full coherence
    if (inp.coherenceC > 0.95 and inp.jasmineScore > 0.9 and inp.heritageScore > 0.9 and inp.sacesiValid) { 1.0 } else { 0.0 } };

  // ── Law effect tables ──────────────────────────────────────────────────
  // [mintMod, cohMod, energyCost, threshold]
  let LAW_EFFECTS : [[Float]] = [
    // Identity laws (1-6)
    [1.20,  0.005, 0.10, 0.50],  // L1
    [1.15,  0.004, 0.08, 0.55],  // L2
    [1.10,  0.003, 0.07, 0.55],  // L3
    [1.12,  0.004, 0.08, 0.55],  // L4
    [1.18,  0.006, 0.10, 0.50],  // L5
    [1.25,  0.008, 0.15, 0.60],  // L6
    // Entropy laws (7-12)
    [1.15,  0.005, 0.10, 0.50],  // L7
    [1.10,  0.003, 0.08, 0.60],  // L8
    [1.20,  0.007, 0.12, 0.55],  // L9
    [0.90, -0.003, 0.05, 0.40],  // L10 (extremum = slight penalty)
    [1.30,  0.010, 0.15, 0.60],  // L11
    [1.22,  0.007, 0.12, 0.60],  // L12
    // Economy laws (13-18)
    [1.40,  0.008, 0.20, 0.50],  // L13
    [1.35,  0.007, 0.18, 0.40],  // L14
    [1.50,  0.010, 0.25, 0.50],  // L15
    [1.25,  0.006, 0.12, 0.55],  // L16
    [1.60,  0.012, 0.30, 0.70],  // L17
    [1.80,  0.015, 0.40, 0.70],  // L18 — Triple Sovereign
    // Security laws (19-24)
    [1.10,  0.004, 0.08, 0.90],  // L19 (SACESI required)
    [1.15,  0.005, 0.10, 0.55],  // L20
    [1.20,  0.006, 0.12, 0.55],  // L21
    [1.30,  0.010, 0.15, 0.70],  // L22
    [1.18,  0.005, 0.10, 0.55],  // L23
    [1.16,  0.005, 0.09, 0.55],  // L24
    // Temporal laws (25-30)
    [1.12,  0.004, 0.08, 0.40],  // L25
    [2.00,  0.020, 0.50, 0.99],  // L26 — Century beat
    [1.20,  0.006, 0.12, 0.50],  // L27
    [1.22,  0.006, 0.12, 0.55],  // L28
    [1.30,  0.008, 0.15, 0.60],  // L29
    [1.25,  0.007, 0.12, 0.55],  // L30
    // Network laws (31-36)
    [1.25,  0.007, 0.15, 0.50],  // L31
    [1.40,  0.008, 0.20, 0.50],  // L32
    [1.35,  0.008, 0.18, 0.40],  // L33
    [1.50,  0.010, 0.25, 0.60],  // L34
    [1.45,  0.009, 0.22, 0.55],  // L35
    [1.75,  0.015, 0.35, 0.70],  // L36 — Triple Network
    // Behavioral laws (37-42)
    [1.30,  0.010, 0.15, 0.55],  // L37
    [1.10,  0.005, 0.08, 0.45],  // L38
    [1.40,  0.010, 0.20, 0.65],  // L39
    [1.25,  0.007, 0.12, 0.55],  // L40
    [1.50,  0.012, 0.25, 0.65],  // L41
    [1.35,  0.010, 0.15, 0.90],  // L42
    // Quantum laws (43-48)
    [1.20,  0.006, 0.10, 0.80],  // L43
    [1.25,  0.007, 0.12, 0.50],  // L44
    [1.35,  0.008, 0.18, 0.65],  // L45
    [1.45,  0.010, 0.22, 0.70],  // L46
    [2.50,  0.025, 0.60, 0.99],  // L47 — Harmonic 144
    [1.40,  0.010, 0.20, 0.60],  // L48
    // Sovereign laws (49-54)
    [1.50,  0.012, 0.25, 0.65],  // L49
    [1.60,  0.014, 0.30, 0.65],  // L50
    [1.70,  0.015, 0.35, 0.75],  // L51
    [1.80,  0.018, 0.40, 0.75],  // L52
    [1.55,  0.012, 0.28, 0.65],  // L53
    [1.75,  0.016, 0.35, 0.70],  // L54
    // Succession laws (55-60)
    [1.60,  0.014, 0.30, 0.60],  // L55
    [1.80,  0.018, 0.40, 0.65],  // L56
    [2.00,  0.022, 0.50, 0.70],  // L57 — Dynasty Crown
    [1.85,  0.020, 0.45, 0.70],  // L58
    [2.20,  0.025, 0.60, 0.80],  // L59 — Quad Sovereign
    [5.00,  0.100, 2.00, 0.99],  // L60 — OMNIS
  ];

  // ── Fire a single law ─────────────────────────────────────────────────────
  type CondFn = (LawInput) -> Float;
  let CONDITIONS : [CondFn] = [
    condL1, condL2, condL3, condL4, condL5, condL6,
    condL7, condL8, condL9, condL10, condL11, condL12,
    condL13, condL14, condL15, condL16, condL17, condL18,
    condL19, condL20, condL21, condL22, condL23, condL24,
    condL25, condL26, condL27, condL28, condL29, condL30,
    condL31, condL32, condL33, condL34, condL35, condL36,
    condL37, condL38, condL39, condL40, condL41, condL42,
    condL43, condL44, condL45, condL46, condL47, condL48,
    condL49, condL50, condL51, condL52, condL53, condL54,
    condL55, condL56, condL57, condL58, condL59, condL60,
  ];

  // ── Full law beat ───────────────────────────────────────────────────────
  public type LawResult = {
    firedCount  : Nat;
    mintMod     : Float;    // product of all fired mintMods
    cohDelta    : Float;    // sum of cohMods
    energyUsed  : Float;    // sum of energyCosts
    omnisFired  : Bool;     // L60 fired?
    fireBitmap  : [Bool];   // 60-element array
  };

  public func beatLaws(inp: LawInput) : LawResult {
    var count     : Nat   = 0;
    var mintProd  : Float = 1.0;
    var cohSum    : Float = 0.0;
    var energySum : Float = 0.0;
    var omnis     : Bool  = false;
    let bitmap    = Array.init<Bool>(60, false);

    for (i in Iter.range(0, 59)) {
      let score     = CONDITIONS[i](inp);
      let threshold = LAW_EFFECTS[i][3];
      if (score >= threshold) {
        bitmap[i]  := true;
        count      += 1;
        mintProd   *= LAW_EFFECTS[i][0];
        cohSum     += LAW_EFFECTS[i][1];
        energySum  += LAW_EFFECTS[i][2];
        if (i == 59) { omnis := true; };
      };
    };
    // Cap mint mod at 8.0x per beat to prevent runaway
    let cappedMint = _clamp(mintProd, 0.5, 8.0);
    {
      firedCount  = count;
      mintMod     = cappedMint;
      cohDelta    = _clamp(cohSum, -0.05, 0.15);
      energyUsed  = energySum;
      omnisFired  = omnis;
      fireBitmap  = Array.freeze(bitmap);
    }
  };

  // ── Jasmine’s Law — 5 conditions ────────────────────────────────────────
  // All 5 must be true for Jasmine to pass
  // J1: coherenceC >= 0.60
  // J2: bodyDomain >= 0.55
  // J3: jasmineScore >= 0.65
  // J4: sacesiValid == true
  // J5: formaBalance >= 100.0
  public func jasmineCheck(inp: LawInput) : (Bool, Float) {
    let j1 = inp.coherenceC >= 0.60;
    let j2 = inp.bodyDomain >= 0.55;
    let j3 = inp.jasmineScore >= 0.65;
    let j4 = inp.sacesiValid;
    let j5 = inp.formaBalance >= 100.0;
    let passCount = (if j1 1 else 0) + (if j2 1 else 0) + (if j3 1 else 0) +
                    (if j4 1 else 0) + (if j5 1 else 0);
    let score = Float.fromInt(passCount) / 5.0;
    (passCount == 5, score)
  };

  // ── SACESI FNV-1a chain ─────────────────────────────────────────────────
  let FNV_PRIME  : Nat64 = 1099511628211;
  let FNV_OFFSET : Nat64 = 14695981039346656037;

  public func sacesiUpdate(
    prev         : Nat64,
    firedCount   : Nat,
    mintMod      : Float,
    beatNum      : Nat64,
    coherenceC   : Float
  ) : Nat64 {
    var h = prev ^ FNV_OFFSET;
    h := (h ^ (Nat64.fromNat(firedCount) +% 1)) *% FNV_PRIME;
    h := (h ^ beatNum) *% FNV_PRIME;
    let mintInt = Nat64.fromNat(Int.abs(Float.toInt(mintMod * 1_000_000.0)));
    let cohInt  = Nat64.fromNat(Int.abs(Float.toInt(coherenceC * 1_000_000.0)));
    h := (h ^ mintInt) *% FNV_PRIME;
    h := (h ^ cohInt)  *% FNV_PRIME;
    h
  };

  // ── Law fire rate (fraction of 60 laws that fired) ───────────────────────
  public func lawFireRate(result: LawResult) : Float {
    Float.fromInt(result.firedCount) / 60.0
  };

  private func _clamp(x: Float, lo: Float, hi: Float) : Float {
    if (x < lo) lo else if (x > hi) hi else x
  };
}
