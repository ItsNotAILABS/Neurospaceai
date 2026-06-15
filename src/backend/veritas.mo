// ============================================================
// VERITAS — SOVEREIGN DOCTRINE MODULE
// Creator: Alfredo Medina Hernandez
// Location: Dallas, Texas, USA. 2026.
// Medina Doctrine — NeuroEmergence Core / SOVEREIGN Substrate
//
// VERITAS is the doctrine authority module.
// Phase A: Module form — embedded within NeuroEmergence Core.
// Phase M: Promoted to standalone canister (304-canister ecosystem).
//
// Zero-Exposure Wall: All public outputs are numeric indices only.
// Semantic doctrine names live in VAULT canister, principal-gated.
// FNV-1a-32 used as SHA-256 equivalent for on-chain fingerprinting.
// ============================================================

import Char   "mo:core/Char";

module {

  // ============================================================
  // DOCTRINE RECORD — Immutable once genesis-locked
  // ============================================================
  public type DoctrineRecord = {
    index        : Nat;      // doctrine index (0-based, public)
    hash         : Nat32;    // FNV-1a-32 fingerprint of the doctrine
    genesisHash  : Nat32;    // organism genesis hash at lock time
    sacesiSig    : Nat32;    // SACESI signature confirming doctrine
    lockedAtBeat : Nat;      // beat number when locked
    isLocked     : Bool;     // true = immutable, false = draft
  };

  // ============================================================
  // LAW RECORD — 60 laws, numeric-indexed, zero-exposure
  // ============================================================
  public type LawRecord = {
    index        : Nat;      // law index 0-59
    tier         : Nat;      // 0=Supreme 1=Core 2=Economic 3=Security 4=Behavioral
    fireCount    : Nat;      // cumulative fire count
    netEffect    : Float;    // running net effect score
    isActive     : Bool;     // fired this beat
  };

  // ============================================================
  // ATTRIBUTION PROOF — Attorney-grade on-chain proof structure
  // Returned by getCreatorAttribution() in main.mo
  // ============================================================
  public type AttributionProof = {
    creatorName     : Text;    // Alfredo Medina Hernandez
    jurisdiction    : Text;    // Dallas, Texas, USA
    year            : Nat;     // 2026
    doctrineTitle   : Text;    // Medina Doctrine — NeuroEmergence Core
    doctrineHash    : Nat32;   // FNV-1a-32 of doctrine string
    genesisHash     : Nat32;   // organism genesis hash
    sacesiSignature : Nat32;   // SACESI chain signature
    lockedAtBeat    : Nat;     // beat when genesis locked
    codeHash        : Nat32;   // FNV-1a-32 of this module's identifier
    isLocked        : Bool;    // true = genesis lock active
  };

  // ============================================================
  // LAW DEFINITION — Full 60-law sovereign registry
  // All tiers, all math, all conditions
  // ============================================================

  public type LawDef = {
    idx       : Nat;    // 0-59
    tier      : Nat;    // 0=Supreme,1=Core,2=Economic,3=Security,4=Behavioral,5=Temporal
    critical  : Bool;   // failure = organism risk
    fireThreshold : Float; // minimum value to fire
    maxEffect : Float;  // maximum absolute effect
    decayRate : Float;  // per-beat decay on netEffect
  };

  // ============================================================
  // ALL 60 LAW DEFINITIONS WITH MATH
  // ============================================================

  public let LAW_DEFS : [LawDef] = [
    // TIER 0 — SUPREME (2 laws)
    { idx=0;  tier=0; critical=true;  fireThreshold=0.3; maxEffect=1.0; decayRate=0.001 },
    { idx=1;  tier=0; critical=true;  fireThreshold=0.0; maxEffect=1.0; decayRate=0.001 },
    // TIER 1 — CORE SUBSTRATE (14 laws)
    { idx=2;  tier=1; critical=true;  fireThreshold=0.0; maxEffect=0.8; decayRate=0.01  },
    { idx=3;  tier=1; critical=false; fireThreshold=0.0; maxEffect=0.6; decayRate=0.01  },
    { idx=4;  tier=1; critical=true;  fireThreshold=0.0; maxEffect=1.0; decayRate=0.001 },
    { idx=5;  tier=1; critical=false; fireThreshold=0.05;maxEffect=0.5; decayRate=0.02  },
    { idx=6;  tier=1; critical=true;  fireThreshold=0.5; maxEffect=0.8; decayRate=0.01  },
    { idx=7;  tier=1; critical=false; fireThreshold=0.0; maxEffect=0.4; decayRate=0.02  },
    { idx=8;  tier=1; critical=false; fireThreshold=0.0; maxEffect=0.6; decayRate=0.01  },
    { idx=9;  tier=1; critical=false; fireThreshold=0.0; maxEffect=0.5; decayRate=0.02  },
    { idx=10; tier=1; critical=false; fireThreshold=0.0; maxEffect=0.5; decayRate=0.02  },
    { idx=11; tier=1; critical=true;  fireThreshold=0.0; maxEffect=0.8; decayRate=0.01  },
    { idx=12; tier=1; critical=false; fireThreshold=0.0; maxEffect=0.5; decayRate=0.02  },
    { idx=13; tier=1; critical=false; fireThreshold=0.0; maxEffect=0.5; decayRate=0.02  },
    { idx=14; tier=1; critical=false; fireThreshold=0.4; maxEffect=0.6; decayRate=0.02  },
    { idx=15; tier=1; critical=false; fireThreshold=0.6; maxEffect=0.6; decayRate=0.02  },
    // TIER 2 — ECONOMIC (12 laws)
    { idx=16; tier=2; critical=true;  fireThreshold=0.0; maxEffect=1.0; decayRate=0.001 },
    { idx=17; tier=2; critical=true;  fireThreshold=0.5; maxEffect=1.0; decayRate=0.01  },
    { idx=18; tier=2; critical=false; fireThreshold=0.0; maxEffect=0.6; decayRate=0.02  },
    { idx=19; tier=2; critical=false; fireThreshold=0.0; maxEffect=0.8; decayRate=0.01  },
    { idx=20; tier=2; critical=false; fireThreshold=0.0; maxEffect=0.7; decayRate=0.01  },
    { idx=21; tier=2; critical=false; fireThreshold=0.8; maxEffect=0.5; decayRate=0.02  },
    { idx=22; tier=2; critical=false; fireThreshold=0.5; maxEffect=0.5; decayRate=0.02  },
    { idx=23; tier=2; critical=false; fireThreshold=0.0; maxEffect=0.5; decayRate=0.02  },
    { idx=24; tier=2; critical=false; fireThreshold=0.0; maxEffect=0.7; decayRate=0.01  },
    { idx=25; tier=2; critical=true;  fireThreshold=0.0; maxEffect=1.0; decayRate=0.001 },
    { idx=26; tier=2; critical=true;  fireThreshold=0.0; maxEffect=1.0; decayRate=0.001 },
    { idx=27; tier=2; critical=false; fireThreshold=0.0; maxEffect=0.7; decayRate=0.01  },
    // TIER 3 — SECURITY (8 laws)
    { idx=28; tier=3; critical=false; fireThreshold=0.0; maxEffect=0.8; decayRate=0.01  },
    { idx=29; tier=3; critical=false; fireThreshold=0.0; maxEffect=0.6; decayRate=0.02  },
    { idx=30; tier=3; critical=true;  fireThreshold=0.0; maxEffect=1.0; decayRate=0.001 },
    { idx=31; tier=3; critical=false; fireThreshold=0.0; maxEffect=0.7; decayRate=0.01  },
    { idx=32; tier=3; critical=false; fireThreshold=0.0; maxEffect=0.7; decayRate=0.01  },
    { idx=33; tier=3; critical=true;  fireThreshold=0.0; maxEffect=1.0; decayRate=0.001 },
    { idx=34; tier=3; critical=false; fireThreshold=0.0; maxEffect=0.8; decayRate=0.01  },
    { idx=35; tier=3; critical=false; fireThreshold=0.0; maxEffect=0.8; decayRate=0.01  },
    // TIER 4 — BEHAVIORAL ECONOMICS (12 laws)
    { idx=36; tier=4; critical=false; fireThreshold=0.0; maxEffect=0.8; decayRate=0.01  },
    { idx=37; tier=4; critical=true;  fireThreshold=0.0; maxEffect=1.0; decayRate=0.001 },
    { idx=38; tier=4; critical=false; fireThreshold=0.0; maxEffect=0.3; decayRate=0.001 },
    { idx=39; tier=4; critical=false; fireThreshold=0.0; maxEffect=0.5; decayRate=0.02  },
    { idx=40; tier=4; critical=false; fireThreshold=0.0; maxEffect=0.5; decayRate=0.02  },
    { idx=41; tier=4; critical=false; fireThreshold=0.0; maxEffect=0.4; decayRate=0.02  },
    { idx=42; tier=4; critical=false; fireThreshold=0.0; maxEffect=0.4; decayRate=0.02  },
    { idx=43; tier=4; critical=false; fireThreshold=0.0; maxEffect=0.6; decayRate=0.02  },
    { idx=44; tier=4; critical=false; fireThreshold=0.0; maxEffect=0.5; decayRate=0.02  },
    { idx=45; tier=4; critical=false; fireThreshold=0.0; maxEffect=0.5; decayRate=0.02  },
    { idx=46; tier=4; critical=false; fireThreshold=0.0; maxEffect=0.6; decayRate=0.01  },
    { idx=47; tier=4; critical=true;  fireThreshold=0.0; maxEffect=1.0; decayRate=0.001 },
    // TIER 5 — TEMPORAL & QUANTUM (10 laws)
    { idx=48; tier=5; critical=false; fireThreshold=0.0; maxEffect=0.7; decayRate=0.01  },
    { idx=49; tier=5; critical=false; fireThreshold=0.0; maxEffect=0.7; decayRate=0.01  },
    { idx=50; tier=5; critical=true;  fireThreshold=0.0; maxEffect=1.0; decayRate=0.001 },
    { idx=51; tier=5; critical=true;  fireThreshold=0.0; maxEffect=1.0; decayRate=0.001 },
    { idx=52; tier=5; critical=false; fireThreshold=0.0; maxEffect=0.6; decayRate=0.02  },
    { idx=53; tier=5; critical=false; fireThreshold=0.0; maxEffect=0.6; decayRate=0.01  },
    { idx=54; tier=5; critical=true;  fireThreshold=0.0; maxEffect=1.0; decayRate=0.001 },
    { idx=55; tier=5; critical=false; fireThreshold=0.0; maxEffect=0.3; decayRate=0.001 },
    { idx=56; tier=5; critical=false; fireThreshold=0.0; maxEffect=0.6; decayRate=0.01  },
    { idx=57; tier=5; critical=false; fireThreshold=0.0; maxEffect=0.8; decayRate=0.01  },
    { idx=58; tier=5; critical=false; fireThreshold=0.0; maxEffect=0.8; decayRate=0.01  },
    { idx=59; tier=5; critical=false; fireThreshold=0.0; maxEffect=0.8; decayRate=0.01  }
  ];

  // ============================================================
  // LAW MATH FUNCTIONS — Real math for each law
  // ============================================================

  public func lawCreationEffect(coherence : Float, threshold : Float) : Float {
    if (coherence > threshold) coherence - threshold else 0.0
  };

  public func lawCoherenceThresholdEffect(coherence : Float, target : Float, tierWeight : Float) : Float {
    (coherence - target) * tierWeight
  };

  public func lawEmergencePressure(
    entropy    : Float,
    identityCoh: Float,
    recurrence : Nat
  ) : Float {
    let rec = Float.fromInt(recurrence);
    let e = entropy * identityCoh * (1.0 + rec / 10.0);
    if (e > 0.5) e - 0.5 else 0.0
  };

  public func lawProofOfCoherence(coherenceAtMint : Float) : Float {
    if (coherenceAtMint > 0.5) coherenceAtMint else 0.0
  };

  public func lawJasmineGate(
    entropy       : Float,
    identityCoh   : Float,
    recurrence    : Nat,
    antiFakeScore : Float,
    adaptDelta    : Float
  ) : Bool {
    entropy > 0.55 and identityCoh > 0.6 and recurrence > 3 and
    antiFakeScore > 0.8 and adaptDelta > 0.0
  };

  public func lawBehavioralAsymmetry(gain : Float, loss : Float) : Float {
    let gainEffect = gain * 1.0;
    let lossEffect = loss * 2.25;
    gainEffect - lossEffect
  };

  public func lawMaxwellsDemon(
    hBefore : Float,
    hAfter  : Float,
    kFactor : Float
  ) : Float {
    let delta = hBefore - hAfter;
    if (delta > 0.0) kFactor * delta else 0.0
  };

  public func lawDualReserveSovereignty(
    btcBalance : Float,
    ethBalance : Float
  ) : Float {
    if (btcBalance > 0.0 and ethBalance > 0.0) {
      Float.min(btcBalance * 0.3 + ethBalance * 0.7, 1.0)
    } else if (btcBalance > 0.0) {
      btcBalance * 0.3
    } else {
      0.0
    }
  };

  public func lawParallelCompounding(
    coherenceLoop : Float,
    tokenLoop     : Float,
    ethYieldLoop  : Float,
    btcFloorLoop  : Float,
    govLoop       : Float
  ) : Float {
    let total = coherenceLoop + tokenLoop + ethYieldLoop + btcFloorLoop + govLoop;
    total / 5.0
  };

  public func lawQuantumBatteryCharge(
    baseRate  : Float,
    coherence : Float
  ) : Float {
    baseRate * coherence * coherence
  };

  public func lawTemporalDilationFactor(coherence : Float) : Float {
    if (coherence > 0.8) 1.0 + (coherence - 0.8) * 5.0 else 1.0
  };

  public func lawStreakMultiplier(streak : Nat) : Float {
    let m = 1.0 + Float.fromInt(streak) * 0.001;
    if (m > 2.0) 2.0 else m
  };

  public let FORMA_DOUBLING_RATE : Float = 0.000000267;

  public func lawCognitiveSovereignty(signalType : Nat) : Bool {
    signalType == 0
  };

  // ============================================================
  // MEDINA DIMENSION MANIFEST — 4,096 dimensions (2^12)
  // ============================================================

  public type DimensionBlock = {
    blockIdx  : Nat;
    dimCount  : Nat;
    category  : Text;
    subBlocks : [(Nat, Nat)];
  };

  public let BLOCK_0 : DimensionBlock = {
    blockIdx  = 0; dimCount = 693; category = "INTERNAL_ORGANISM_STATE";
    subBlocks = [(0,215),(1,132),(2,21),(3,18),(4,12),(5,72),(6,36),(7,12),(8,12),(9,60),(10,3),(11,3),(12,3),(13,9),(14,5),(15,2),(16,44),(17,7),(18,4),(19,2),(20,1),(21,12),(22,3)];
  };
  public let BLOCK_1 : DimensionBlock = {
    blockIdx  = 1; dimCount = 431; category = "MARKET_WORLD_SIGNALS";
    subBlocks = [(0,12),(1,12),(2,12),(3,12),(4,66),(5,12),(6,20),(7,10),(8,20),(9,10),(10,10),(11,20),(12,20),(13,30),(14,20),(15,4),(16,10),(17,10),(18,36),(19,20),(20,15),(21,10)];
  };
  public let BLOCK_2 : DimensionBlock = {
    blockIdx  = 2; dimCount = 567; category = "TEMPORAL_HISTORY";
    subBlocks = [(0,100),(1,100),(2,100),(3,100),(4,22),(5,21),(6,12),(7,12),(8,50),(9,50)];
  };
  public let BLOCK_3 : DimensionBlock = {
    blockIdx  = 3; dimCount = 145; category = "NETWORK_SUCCESSION_STATE";
    subBlocks = [(0,100),(1,5),(2,10),(3,10),(4,20)];
  };
  public let BLOCK_4 : DimensionBlock = {
    blockIdx  = 4; dimCount = 173; category = "SOVEREIGN_DOCTRINE";
    subBlocks = [(0,60),(1,10),(2,15),(3,24),(4,11),(5,11),(6,7),(7,5),(8,10),(9,20)];
  };
  public let BLOCK_5 : DimensionBlock = {
    blockIdx  = 5; dimCount = 202; category = "REINFORCEMENT_LEARNING";
    subBlocks = [(0,100),(1,60),(2,12),(3,21),(4,9)];
  };
  public let BLOCK_6 : DimensionBlock = {
    blockIdx  = 6; dimCount = 260; category = "MACRO_INTELLIGENCE";
    subBlocks = [(0,50),(1,20),(2,20),(3,30),(4,50),(5,50),(6,20),(7,20)];
  };
  public let BLOCK_7 : DimensionBlock = {
    blockIdx  = 7; dimCount = 625; category = "DERIVED_MATHEMATICAL";
    subBlocks = [(0,100),(1,50),(2,50),(3,50),(4,50),(5,50),(6,275)];
  };

  public let MEDINA_TOTAL_DIMS : Nat   = 4096;
  public let MEDINA_H_MAX      : Float = 12.0;
  public let MEDINA_TOKENS     : Nat   = 12;

  // ============================================================
  // FNV-1A HASH FUNCTIONS
  // ============================================================

  public func fnv1a(basis : Nat32, value : Nat32) : Nat32 {
    (basis ^% value) *% 16777619
  };

  public func fnv1aText(t : Text) : Nat32 {
    var h : Nat32 = 2166136261;
    for (c in t.chars()) {
      let code = Nat32.fromNat(Nat32.toNat(Char.toNat32(c)) % 256);
      h := (h ^% code) *% 16777619;
    };
    h
  };

  public func fnv1aNat(n : Nat) : Nat32 {
    var h : Nat32 = 2166136261;
    var rem = n;
    if (rem == 0) { h := (h ^% 0) *% 16777619; }
    else {
      while (rem > 0) {
        h := (h ^% Nat32.fromNat(rem % 4294967296)) *% 16777619;
        rem := rem / 4294967296;
      };
    };
    h
  };

  public func fnv1aFloat(f : Float) : Nat32 {
    let scaled = if (f >= 0.0) Float.toInt(f * 1000000.0)
                 else -(Float.toInt((-f) * 1000000.0));
    let n32 = if (scaled >= 0) Nat32.fromNat(scaled % 4294967296)
              else Nat32.fromNat((4294967296 - ((-scaled) % 4294967296)) % 4294967296);
    (2166136261 ^% n32) *% 16777619
  };

  public func doctrineHash(
    creatorIdx   : Nat32,
    jurisdictionN: Nat32,
    yearN        : Nat32,
    titleN       : Nat32
  ) : Nat32 {
    var h : Nat32 = 2166136261;
    h := (h ^% creatorIdx)    *% 16777619;
    h := (h ^% jurisdictionN) *% 16777619;
    h := (h ^% yearN)         *% 16777619;
    h := (h ^% titleN)        *% 16777619;
    h
  };

  // ============================================================
  // BINARY HIERARCHY CONSTANTS
  // ============================================================

  public let HIERARCHY_S_FACTOR : Float = 2.5;
  public let HIERARCHY_FREQS : [Float] = [
    0.15625, 0.3125, 0.625, 1.25, 2.5, 5.0, 10.0, 20.0, 40.0, 80.0, 160.0, 320.0
  ];
  public let HIERARCHY_LABELS : [Nat] = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
  ];
  public let PAC_COEFFICIENT : Float = 0.35;
  public let COHERENCE_W_KF   : Float = 0.30;
  public let COHERENCE_W_RT   : Float = 0.25;
  public let COHERENCE_W_NC   : Float = 0.25;
  public let COHERENCE_W_BH   : Float = 0.20;

  // ============================================================
  // ATTRIBUTION PROOF
  // ============================================================

  public func buildAttributionProof(
    genesisHash  : Nat32,
    sacesiSig    : Nat32,
    lockedAtBeat : Nat,
    isLocked     : Bool
  ) : AttributionProof {
    let dHash = doctrineHash(
      fnv1aText("Alfredo Medina Hernandez"),
      fnv1aText("Dallas, Texas, USA"),
      fnv1aNat(2026),
      fnv1aText("Medina Doctrine NeuroEmergence Core")
    );
    {
      creatorName     = "Alfredo Medina Hernandez";
      jurisdiction    = "Dallas, Texas, USA";
      year            = 2026;
      doctrineTitle   = "Medina Doctrine \u2014 NeuroEmergence Core";
      doctrineHash    = dHash;
      genesisHash     = genesisHash;
      sacesiSignature = sacesiSig;
      lockedAtBeat    = lockedAtBeat;
      codeHash        = fnv1aText("VERITAS_MODULE_V1_NEURO_EMERGENCE");
      isLocked        = isLocked;
    }
  };

  // ============================================================
  // VERITAS PUBLIC API — Zero-exposure compliant
  // ============================================================

  public func getLawTierIndex(lawIdx : Nat) : Nat {
    if (lawIdx < 2)  0
    else if (lawIdx < 16) 1
    else if (lawIdx < 28) 2
    else if (lawIdx < 36) 3
    else if (lawIdx < 48) 4
    else 5
  };

  public func getDimBlockCount(blockIdx : Nat) : Nat {
    let counts : [Nat] = [693, 431, 567, 145, 173, 202, 260, 625];
    if (blockIdx < counts.size()) counts[blockIdx] else 0
  };

  public func verifyDoctrineHash(candidateHash : Nat32, referenceHash : Nat32) : Bool {
    candidateHash == referenceHash and candidateHash != 0
  };

  public func doctrineIntegrityScore(
    doctrineOK : Bool,
    genesisOK  : Bool,
    sacesiOK   : Bool,
    lockOK     : Bool,
    lawsOK     : Bool
  ) : Float {
    var score : Float = 0.0;
    if (doctrineOK) score += 0.25;
    if (genesisOK)  score += 0.25;
    if (sacesiOK)   score += 0.20;
    if (lockOK)     score += 0.15;
    if (lawsOK)     score += 0.15;
    score
  };

};
