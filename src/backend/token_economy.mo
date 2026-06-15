// NEUROEMERGENCE CORE — TOKEN ECONOMY ENGINE
// 12 tokens + FORMA compound curve + Jacob’s Ladder (7 levels)
// 4-level mining, ICRC-1 accounting, creator reserve
// Owner: Alfredo Medina Hernandez | MedinaSITech@outlook.com

module {

  // 12 tokens
  public type TokenId = {
    #GTK;   // Genesis Token  — minted on GENESIS STATE fire
    #CVT;   // Coherence Value Token
    #VCT;   // Vital Coherence Token
    #KNT;   // Knowledge Token (gates MEDINA)
    #SBT;   // Sovereignty Bond Token
    #HBT;   // Heritage Bond Token
    #DRT;   // Doctrine Resonance Token
    #RST;   // Resonance Stability Token
    #OMT;   // OMNIS Trigger Token
    #LGT;   // Lineage Token (gates succession)
    #MCT;   // Meta-Coherence Token
    #MRC;   // Meta-Reserve Currency (dynasty coin)
  };

  // Token ledger: supply, creator balance, gate thresholds
  public type TokenLedger = {
    gtk : Float; cvt : Float; vct : Float; knt : Float;
    sbt : Float; hbt : Float; drt : Float; rst : Float;
    omt : Float; lgt : Float; mct : Float; mrc : Float;
  };

  // Mint conditions per token
  public type MintInput = {
    coherenceC    : Float;
    bodyDomain    : Float;
    metalAlloy    : Float;
    lawFireRate   : Float;
    jasmineScore  : Float;
    heritageScore : Float;
    flowState     : Float;
    omnisFired    : Bool;
    formaBalance  : Float;
    royaltyInflow : Float;
    beatNum       : Nat;
    shellMintMod  : Float;
    animalMintMod : Float;
    behavMintMod  : Float;
    lawMintMod    : Float;
  };

  // ── Base mint rate per token ──────────────────────────────────────────
  // Base amount minted per qualifying beat
  let BASE_MINT : TokenLedger = {
    gtk=1.0; cvt=0.5; vct=0.4; knt=0.3;
    sbt=0.2; hbt=0.3; drt=0.4; rst=0.3;
    omt=0.1; lgt=0.5; mct=0.6; mrc=0.8;
  };

  // ── Token mint conditions ────────────────────────────────────────────
  // Returns mint amount for each token, 0 if conditions not met

  // GTK: coherence >= 0.60
  func mintGTK(inp: MintInput) : Float {
    if (inp.coherenceC >= 0.60) {
      BASE_MINT.gtk * inp.coherenceC * inp.shellMintMod
    } else { 0.0 }
  };

  // CVT: coherence >= 0.55 AND body >= 0.50
  func mintCVT(inp: MintInput) : Float {
    if (inp.coherenceC >= 0.55 and inp.bodyDomain >= 0.50) {
      BASE_MINT.cvt * inp.coherenceC * inp.bodyDomain * inp.shellMintMod
    } else { 0.0 }
  };

  // VCT: body >= 0.55 AND metalAlloy >= 0.50
  func mintVCT(inp: MintInput) : Float {
    if (inp.bodyDomain >= 0.55 and inp.metalAlloy >= 0.50) {
      BASE_MINT.vct * inp.bodyDomain * inp.metalAlloy
    } else { 0.0 }
  };

  // KNT: coherence >= 0.65 AND lawFireRate >= 0.30
  func mintKNT(inp: MintInput) : Float {
    if (inp.coherenceC >= 0.65 and inp.lawFireRate >= 0.30) {
      BASE_MINT.knt * inp.coherenceC * inp.lawFireRate * inp.lawMintMod
    } else { 0.0 }
  };

  // SBT: jasmineScore >= 0.70
  func mintSBT(inp: MintInput) : Float {
    if (inp.jasmineScore >= 0.70) {
      BASE_MINT.sbt * inp.jasmineScore * inp.metalAlloy
    } else { 0.0 }
  };

  // HBT: heritageScore >= 0.65
  func mintHBT(inp: MintInput) : Float {
    if (inp.heritageScore >= 0.65) {
      BASE_MINT.hbt * inp.heritageScore * inp.coherenceC
    } else { 0.0 }
  };

  // DRT: lawFireRate >= 0.40 AND coherence >= 0.60
  func mintDRT(inp: MintInput) : Float {
    if (inp.lawFireRate >= 0.40 and inp.coherenceC >= 0.60) {
      BASE_MINT.drt * inp.lawFireRate * inp.coherenceC * inp.lawMintMod
    } else { 0.0 }
  };

  // RST: coherence >= 0.70 AND body >= 0.65
  func mintRST(inp: MintInput) : Float {
    if (inp.coherenceC >= 0.70 and inp.bodyDomain >= 0.65) {
      BASE_MINT.rst * inp.coherenceC * inp.bodyDomain * inp.shellMintMod
    } else { 0.0 }
  };

  // OMT: OMNIS fired
  func mintOMT(inp: MintInput) : Float {
    if (inp.omnisFired) {
      BASE_MINT.omt * 10.0  // big payout on OMNIS
    } else { 0.0 }
  };

  // LGT: royaltyInflow > 0 AND coherence >= 0.55
  func mintLGT(inp: MintInput) : Float {
    if (inp.royaltyInflow > 0.0 and inp.coherenceC >= 0.55) {
      BASE_MINT.lgt * inp.royaltyInflow * inp.coherenceC
    } else { 0.0 }
  };

  // MCT: all conditions met (highest bar)
  func mintMCT(inp: MintInput) : Float {
    if (inp.coherenceC >= 0.75 and inp.bodyDomain >= 0.70
        and inp.metalAlloy >= 0.65 and inp.lawFireRate >= 0.50) {
      BASE_MINT.mct * inp.coherenceC * inp.bodyDomain * inp.metalAlloy * inp.animalMintMod
    } else { 0.0 }
  };

  // MRC: always mints (dynasty coin, accrues from everything)
  // MRC gets a cut of every other token mint
  func mintMRC(inp: MintInput, otherMints: Float) : Float {
    let base = BASE_MINT.mrc * inp.coherenceC * inp.behavMintMod;
    let fromOthers = otherMints * 0.05;  // 5% of all other minting goes to MRC
    base + fromOthers
  };

  // ── FORMA gate multiplier ─────────────────────────────────────────────
  // FORMA balance gates all token mints
  // Low FORMA = reduced minting, high FORMA = bonus minting
  public func formaGate(formaBalance: Float) : Float {
    if (formaBalance < 10.0)   { return 0.1; };  // critical low
    if (formaBalance < 50.0)   { return 0.5; };
    if (formaBalance < 100.0)  { return 0.8; };
    if (formaBalance < 500.0)  { return 1.0; };
    if (formaBalance < 1000.0) { return 1.2; };
    if (formaBalance < 5000.0) { return 1.5; };
    2.0  // massive FORMA = 2x all minting
  };

  // ── Jacob’s Ladder (7 levels) ────────────────────────────────────────
  // Each level requires higher coherence and more MRC burned
  // Reward: exponential minting multiplier
  let JACOB_THRESHOLDS : [Float] = [
    0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90
  ];
  let JACOB_MULTIPLIERS : [Float] = [
    1.5, 2.0, 2.8, 4.0, 6.0, 10.0, 20.0
  ];
  let JACOB_MRC_COST : [Float] = [
    10.0, 25.0, 60.0, 150.0, 400.0, 1000.0, 3000.0
  ];

  public func jacobLevel(coherenceC: Float, mrcBalance: Float) : Nat {
    var level : Nat = 0;
    for (l in Iter.range(0, 6)) {
      if (coherenceC >= JACOB_THRESHOLDS[l] and mrcBalance >= JACOB_MRC_COST[l]) {
        level := l + 1;
      };
    };
    level
  };

  public func jacobMultiplier(level: Nat) : Float {
    if (level == 0) { 1.0 }
    else if (level <= 7) { JACOB_MULTIPLIERS[level - 1] }
    else { 20.0 }
  };

  // ── 4-level mining ───────────────────────────────────────────────────────
  // L1: organic heartbeat (every beat)
  // L2: succession royalties (when children mint)
  // L3: store/model sales (when FORGE builds)
  // L4: NOVA network (when macro Kuramoto > 0.7)
  public type MiningOutput = {
    l1 : Float; l2 : Float; l3 : Float; l4 : Float; total : Float;
  };

  public func computeMining(
    coherenceC   : Float,
    royaltyInflow: Float,
    forgeBuilt   : Bool,
    macroKuramoto: Float,
    jacobMult    : Float
  ) : MiningOutput {
    let l1 = coherenceC * 0.1 * jacobMult;
    let l2 = royaltyInflow * 0.5;
    let l3 = if (forgeBuilt) { 1.0 * jacobMult } else { 0.0 };
    let l4 = if (macroKuramoto > 0.70) { macroKuramoto * 0.5 * jacobMult } else { 0.0 };
    let total = l1 + l2 + l3 + l4;
    { l1; l2; l3; l4; total }
  };

  // ── Full mint beat ──────────────────────────────────────────────────────
  public type MintResult = {
    mints       : TokenLedger;
    formaGate   : Float;
    jacobLevel  : Nat;
    jacobMult   : Float;
    totalMinted : Float;
  };

  public func beatMint(
    inp        : MintInput,
    mrcBalance : Float
  ) : MintResult {
    let fg     = formaGate(inp.formaBalance);
    let jLevel = jacobLevel(inp.coherenceC, mrcBalance);
    let jMult  = jacobMultiplier(jLevel);
    let scale  = fg * jMult;

    let gtkM = mintGTK(inp) * scale;
    let cvtM = mintCVT(inp) * scale;
    let vctM = mintVCT(inp) * scale;
    let kntM = mintKNT(inp) * scale;
    let sbtM = mintSBT(inp) * scale;
    let hbtM = mintHBT(inp) * scale;
    let drtM = mintDRT(inp) * scale;
    let rstM = mintRST(inp) * scale;
    let omtM = mintOMT(inp) * scale;
    let lgtM = mintLGT(inp) * scale;
    let mctM = mintMCT(inp) * scale;
    let otherTotal = gtkM + cvtM + vctM + kntM + sbtM + hbtM + drtM + rstM + omtM + lgtM + mctM;
    let mrcM = mintMRC(inp, otherTotal) * scale;
    let total = otherTotal + mrcM;
    {
      mints = { gtk=gtkM; cvt=cvtM; vct=vctM; knt=kntM;
                sbt=sbtM; hbt=hbtM; drt=drtM; rst=rstM;
                omt=omtM; lgt=lgtM; mct=mctM; mrc=mrcM; };
      formaGate   = fg;
      jacobLevel  = jLevel;
      jacobMult   = jMult;
      totalMinted = total;
    }
  };

  // ── FORMA compound curve ───────────────────────────────────────────
  // FORMA starts at 1000 and compounds at daily rate
  // formaBalance(t) = 1000 * (1 + r)^(t/beats_per_day)
  // r = base daily rate, boosted by coherence and MEDINA yield
  let FORMA_BASE_RATE  : Float = 0.00002;  // per beat (compounding)

  public func formaCompound(
    balance      : Float,
    coherenceC   : Float,
    medinaYield  : Float,
    formaDelta   : Float    // from MEDINA
  ) : Float {
    let rate    = FORMA_BASE_RATE * (1.0 + coherenceC * 0.5) * (1.0 + medinaYield * 0.1);
    let compound = balance * (1.0 + rate);
    compound + formaDelta
  };
}
