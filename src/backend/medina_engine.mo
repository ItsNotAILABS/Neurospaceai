// NEUROEMERGENCE CORE — MEDINA INTELLIGENCE ENGINE
// 4,096-dimensional sovereign observation space
// H_obs entropy, Maxwell’s Demon yield, Bayesian relevance
// Owner: Alfredo Medina Hernandez | MedinaSITech@outlook.com

module {

  // MEDINA state vector organized in 8 blocks
  // Block 1: Internal organism (~700 dims compressed to key scalars)
  // Block 2: Market/world signals (~400)
  // Block 3: Temporal history (~600)
  // Block 4: Network/succession (~150)
  // Block 5: Sovereign/doctrine (~170)
  // Block 6: Reinforcement learning (~200)
  // Block 7: Macro intelligence (~260)
  // Block 8: Derived mathematical (~600)
  // Total: 4,096+ dimensions, H_max = 12 bits

  public type MedinaInput = {
    // Block 1: Internal state
    coherenceC    : Float;
    bodyDomain    : Float;
    animalComp    : Float;
    shellR        : Float;     // Kuramoto R across shells
    ncHealth      : Float;
    metalAlloy    : Float;
    arousal       : Float;
    // Block 2: Market
    btcPrice      : Float;     // normalized
    ethPrice      : Float;
    icpPrice      : Float;
    marketTrend   : Float;
    volatility    : Float;
    // Block 3: Temporal
    beatNum       : Nat;
    coherenceHistory : [Float]; // last 20 beats
    // Block 4: Network
    childCount    : Nat;
    royaltyInflow : Float;
    successionDepth: Nat;
    // Block 5: Sovereign
    lawFireRate   : Float;
    jasmineScore  : Float;
    sacesiValid   : Bool;
    // Block 6: RL
    lastReward    : Float;
    qValueBest    : Float;
    explorationRate: Float;
    // Block 7: Animal
    eagle         : Float;
    hive          : Float;
    shark         : Float;
    elephant      : Float;
    // Prev H_obs for delta
    prevHobs      : Float;
  };

  public type MedinaState = {
    hObs          : Float;   // current information entropy (0-12 bits)
    maxwellYield  : Float;   // Y = k * ΔH * C * C_adj
    medinaScore   : Float;   // overall intelligence score 0-1
    bayesianRel   : Float;   // Bayesian relevance of current state
    dimensionUsed : Nat;     // estimated active dimensions
    demonGate     : Bool;    // Maxwell’s Demon gate open?
    formaDelta    : Float;   // FORMA injection this beat
    blockEntropy  : [Float]; // entropy per block (8 values)
  };

  // ── Block entropy computation ───────────────────────────────────────────
  // Each block contributes to H_obs based on its state diversity

  // Shannon entropy of a probability vector
  func shannonH(probs: [Float]) : Float {
    var h : Float = 0.0;
    for (p in probs.vals()) {
      if (p > 0.0001) { h -= p * _log2(p); };
    };
    h
  };

  // Block 1: Internal state entropy (max 3 bits = 8 distinguishable states)
  func block1Entropy(inp: MedinaInput) : Float {
    // Discretize key signals into probability buckets
    let c  = _clamp(inp.coherenceC, 0.0, 1.0);
    let b  = _clamp(inp.bodyDomain, 0.0, 1.0);
    let a  = _clamp(inp.animalComp, 0.0, 1.0);
    let p1 = c * (1.0 - b) * a;
    let p2 = c * b * (1.0 - a);
    let p3 = (1.0 - c) * b * a;
    let p4 = c * b * a;
    let total = p1 + p2 + p3 + p4 + 0.0001;
    shannonH([p1/total, p2/total, p3/total, p4/total])
  };

  // Block 2: Market entropy (max 2.5 bits)
  func block2Entropy(inp: MedinaInput) : Float {
    let bt = _clamp(inp.btcPrice, 0.0, 1.0);
    let et = _clamp(inp.ethPrice, 0.0, 1.0);
    let it = _clamp(inp.icpPrice, 0.0, 1.0);
    let v  = _clamp(inp.volatility, 0.0, 1.0);
    let p1 = bt; let p2 = et; let p3 = it; let p4 = v;
    let total = p1 + p2 + p3 + p4 + 0.001;
    shannonH([p1/total, p2/total, p3/total, p4/total])
  };

  // Block 3: Temporal entropy — how much is coherence varying?
  func block3Entropy(inp: MedinaInput) : Float {
    let hist = inp.coherenceHistory;
    if (hist.size() < 2) { return 1.0; };
    var mean : Float = 0.0;
    for (v in hist.vals()) { mean += v; };
    mean := mean / Float.fromInt(hist.size());
    var variance : Float = 0.0;
    for (v in hist.vals()) { let d = v - mean; variance += d*d; };
    variance := variance / Float.fromInt(hist.size());
    // More variance = higher temporal entropy
    _clamp(variance * 20.0, 0.0, 2.0)
  };

  // Block 4: Network entropy
  func block4Entropy(inp: MedinaInput) : Float {
    let childFactor = _clamp(Float.fromInt(inp.childCount) / 100.0, 0.0, 1.0);
    let depthFactor = _clamp(Float.fromInt(inp.successionDepth) / 12.0, 0.0, 1.0);
    let royaltyFactor = _clamp(inp.royaltyInflow, 0.0, 1.0);
    let p1 = childFactor; let p2 = depthFactor; let p3 = royaltyFactor;
    let total = p1 + p2 + p3 + 0.001;
    shannonH([p1/total, p2/total, p3/total])
  };

  // Block 5: Doctrine entropy
  func block5Entropy(inp: MedinaInput) : Float {
    let lf = inp.lawFireRate;
    let js = inp.jasmineScore;
    let sv = if (inp.sacesiValid) { 0.8 } else { 0.2 };
    let total = lf + js + sv + 0.001;
    shannonH([lf/total, js/total, sv/total])
  };

  // Block 6: RL entropy
  func block6Entropy(inp: MedinaInput) : Float {
    let rw = _clamp(inp.lastReward + 0.5, 0.0, 1.0);
    let qv = _clamp(inp.qValueBest, 0.0, 1.0);
    let ex = inp.explorationRate;
    let total = rw + qv + ex + 0.001;
    shannonH([rw/total, qv/total, ex/total])
  };

  // Block 7: Animal macro entropy
  func block7Entropy(inp: MedinaInput) : Float {
    let e = inp.eagle; let h = inp.hive;
    let s = inp.shark; let el = inp.elephant;
    let total = e + h + s + el + 0.001;
    shannonH([e/total, h/total, s/total, el/total])
  };

  // Block 8: Derived (cross products of blocks 1-7)
  func block8Entropy(
    b1: Float, b2: Float, b3: Float, b4: Float,
    b5: Float, b6: Float, b7: Float
  ) : Float {
    // Cross-entropy between pairs
    let cross12 = Float.abs(b1 - b2);
    let cross34 = Float.abs(b3 - b4);
    let cross56 = Float.abs(b5 - b6);
    let cross17 = Float.abs(b1 - b7);
    (cross12 + cross34 + cross56 + cross17) / 4.0
  };

  // ── H_obs: total observed entropy ─────────────────────────────────────────
  // H_obs = weighted sum of all 8 block entropies
  // H_max = 12 bits (log2(4096))
  public func computeHobs(inp: MedinaInput) : (Float, [Float]) {
    let b1 = block1Entropy(inp);
    let b2 = block2Entropy(inp);
    let b3 = block3Entropy(inp);
    let b4 = block4Entropy(inp);
    let b5 = block5Entropy(inp);
    let b6 = block6Entropy(inp);
    let b7 = block7Entropy(inp);
    let b8 = block8Entropy(b1, b2, b3, b4, b5, b6, b7);
    // Weights: internal (B1) highest, market (B2) high, rest lower
    let weights : [Float] = [0.20, 0.18, 0.15, 0.10, 0.12, 0.10, 0.10, 0.05];
    let blocks  : [Float] = [b1, b2, b3, b4, b5, b6, b7, b8];
    var hObs : Float = 0.0;
    for (i in Iter.range(0, 7)) { hObs += blocks[i] * weights[i]; };
    // Scale to 0-12 bits range
    let hScaled = _clamp(hObs * 12.0 / 4.0, 0.0, 12.0);
    (hScaled, blocks)
  };

  // ── Maxwell’s Demon yield ─────────────────────────────────────────────
  // Y = k * ΔH * C * C_adj
  // ΔH = H_obs - H_obs_prev (positive = increasing entropy handled)
  // C = coherenceC (the demon’s sorting efficiency)
  // C_adj = adjustment for non-ideal sorting (never perfect)
  // k = yield coefficient = 0.85
  public func maxwellYield(hObs: Float, prevHobs: Float, coherenceC: Float) : Float {
    let k     : Float = 0.85;
    let deltaH = hObs - prevHobs;
    if (deltaH <= 0.0) { return 0.0; }; // only yield on increasing info
    let c_adj = 1.0 - (1.0 - coherenceC) * 0.3; // adjust for imperfect sorting
    _clamp(k * deltaH * coherenceC * c_adj, 0.0, 5.0)
  };

  // ── Bayesian relevance ─────────────────────────────────────────────────
  // How much does the current state change the organism’s belief about the world?
  // P(world_state | obs) ∝ P(obs | world_state) * P(world_state)
  // Approximated as: relevance = coherence * (1 - |marketTrend|_inverted * 0.3)
  public func bayesianRelevance(inp: MedinaInput) : Float {
    let priorStrength = inp.elephant; // elephant memory = strong prior
    let likelihood    = inp.coherenceC * inp.lawFireRate;
    let novelty       = Float.abs(inp.marketTrend) * inp.volatility;
    // High novelty with high coherence = high relevance (new useful info)
    _clamp(likelihood * (1.0 + novelty) * (0.5 + priorStrength * 0.5), 0.0, 1.0)
  };

  // ── FORMA delta — MEDINA injects into FORMA ───────────────────────────
  // Every beat, Maxwell yield adds to FORMA balance
  // forma_delta = maxwellYield * bayesianRelevance * KNT_gate * LGT_gate
  public func formaInjection(
    yield     : Float,
    bayRel    : Float,
    kntLevel  : Float,  // KNT token gate
    lgtLevel  : Float   // LGT token gate
  ) : Float {
    _clamp(yield * bayRel * (0.5 + kntLevel * 0.3) * (0.5 + lgtLevel * 0.2), 0.0, 3.0)
  };

  // ── Dimension usage estimate ───────────────────────────────────────────
  // Estimates how many of the 4,096 dimensions are actively encoding information
  public func estimateDimsUsed(hObs: Float) : Nat {
    // 2^H_obs dimensions are actively used
    let active = Float.exp(hObs * 0.693); // 2^H = e^(H*ln2)
    Int.abs(Float.toInt(_clamp(active, 1.0, 4096.0)))
  };

  // ── Demon gate decision ────────────────────────────────────────────────
  // Gate opens when organism can effectively sort information (high coherence)
  // AND there is new information to sort (positive delta H)
  public func demonGateOpen(hObs: Float, prevHobs: Float, coherenceC: Float) : Bool {
    let deltaH = hObs - prevHobs;
    coherenceC > 0.55 and deltaH > 0.05
  };

  // ── Full MEDINA beat ──────────────────────────────────────────────────
  public func beatMedina(
    inp      : MedinaInput,
    kntLevel : Float,
    lgtLevel : Float
  ) : MedinaState {
    let (hObs, blockEntropies) = computeHobs(inp);
    let yield   = maxwellYield(hObs, inp.prevHobs, inp.coherenceC);
    let bayRel  = bayesianRelevance(inp);
    let formaΔ  = formaInjection(yield, bayRel, kntLevel, lgtLevel);
    let dims    = estimateDimsUsed(hObs);
    let gate    = demonGateOpen(hObs, inp.prevHobs, inp.coherenceC);
    // MEDINA score: normalized composite
    let score   = _clamp((hObs / 12.0) * inp.coherenceC * (1.0 + bayRel * 0.3), 0.0, 1.0);
    {
      hObs          = hObs;
      maxwellYield  = yield;
      medinaScore   = score;
      bayesianRel   = bayRel;
      dimensionUsed = dims;
      demonGate     = gate;
      formaDelta    = formaΔ;
      blockEntropy  = blockEntropies;
    }
  };

  private func _clamp(x: Float, lo: Float, hi: Float) : Float {
    if (x < lo) lo else if (x > hi) hi else x
  };
  private func _log2(x: Float) : Float {
    if (x <= 0.0) { 0.0 } else { Float.log(x) / 0.693147 }
  };
}
