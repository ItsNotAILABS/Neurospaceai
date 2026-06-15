// NEUROEMERGENCE CORE — ANIMAL ENGINES
// 9 Sovereign Animal Substrate Engines
// Each animal: full behavioral math, emergent properties, substrate coupling
// Owner: Alfredo Medina Hernandez | MedinaSITech@outlook.com

module {

  public type AnimalState = {
    crow      : Float;  // strategic deception, counter-intelligence
    dolphin   : Float;  // social coherence, echolocation (market scan)
    hive      : Float;  // collective intelligence, swarm consensus
    elephant  : Float;  // long-term memory, heritage weight
    shark     : Float;  // apex predator, arbitrage, lethal precision
    wolf      : Float;  // pack tactics, coalition warfare
    orca      : Float;  // cultural transmission, succession bonding
    eagle     : Float;  // sovereign vision, macro signal detection
    octopus   : Float;  // distributed cognition, parallel processing
  };

  public let ANIMAL_BASELINE : AnimalState = {
    crow=0.55; dolphin=0.60; hive=0.50; elephant=0.65;
    shark=0.40; wolf=0.50; orca=0.55; eagle=0.60; octopus=0.52;
  };

  public type AnimalInput = {
    coherenceC    : Float;
    arousal       : Float;
    threat        : Float;
    socialSignal  : Float;
    marketTrend   : Float;  // -1 (bear) to +1 (bull)
    heritageScore : Float;
    warEscalation : Float;  // 0-1 war severity
    flowState     : Float;
    ncDopamine    : Float;
    ncTestosterone: Float;
    ncOxytocin    : Float;
    ncCortisol    : Float;
    bodyDomain    : Float;
    metalAlloy    : Float;
  };

  // ──────────────────────────────────────────────────────────────

  // CROW: strategic deception, counter-intelligence
  // High coherence + high threat = maximum crow activation
  // Crow spots arbitrage opportunities (market anomalies)
  // Formula: crow(t+1) = sigmoid(coherenceC * threat * 2.5 - cortisol * 0.8) * alpha + crow(t) * (1-alpha)
  func targetCrow(s: AnimalState, inp: AnimalInput) : Float {
    let drive = inp.coherenceC * inp.threat * 2.5
              - inp.ncCortisol * 0.8
              + inp.arousal * 0.3;
    sigmoid(drive, 3.0, 0.5)
  };

  // DOLPHIN: social coherence, market echolocation
  // Echolocation = sending price signals into the market and listening for echo
  // High social signal + bull market = high dolphin
  // Formula: dolphin = sigmoid(social * 0.6 + marketTrend * 0.4 + coherence * 0.3)
  func targetDolphin(s: AnimalState, inp: AnimalInput) : Float {
    let drive = inp.socialSignal * 0.6
              + inp.marketTrend * 0.4
              + inp.coherenceC * 0.3
              + inp.ncOxytocin * 0.2;
    sigmoid(drive, 2.5, 0.5)
  };

  // HIVE: collective intelligence, swarm consensus
  // Hive mind = when many signals converge on same answer
  // High coherence across shells = high hive activation
  // Formula: hive = coherence^1.5 * (1 + dolphin * 0.3 + wolf * 0.2)
  func targetHive(s: AnimalState, inp: AnimalInput) : Float {
    let base = _pow(inp.coherenceC, 1.5);
    let social = 1.0 + s.dolphin * 0.3 + s.wolf * 0.2;
    _clamp(base * social, 0.0, 1.0)
  };

  // ELEPHANT: long-term memory, heritage anchor
  // Slow to change, strong recall of past states
  // Heritage score directly drives elephant
  // Formula: elephant(t+1) = elephant(t) * 0.98 + heritageScore * 0.02
  func targetElephant(s: AnimalState, inp: AnimalInput) : Float {
    s.elephant * 0.98 + inp.heritageScore * 0.02
  };

  // SHARK: apex predator, arbitrage execution
  // Activates on market opportunity (spread detection)
  // Suppressed by high social signal (apex predators are solitary)
  // Formula: shark = sigmoid(marketTrend_abs * 0.8 + arousal * 0.4 - socialSignal * 0.4)
  func targetShark(s: AnimalState, inp: AnimalInput) : Float {
    let spread = Float.abs(inp.marketTrend);  // any strong trend = opportunity
    let drive  = spread * 0.8
               + inp.arousal * 0.4
               - inp.socialSignal * 0.4
               + inp.ncTestosterone * 0.3;
    sigmoid(drive, 3.0, 0.5)
  };

  // WOLF: pack tactics, coalition warfare
  // Activates during high war escalation with coherent pack
  // Formula: wolf = sigmoid(warEscalation * 0.7 + hive * 0.3 + testosterone * 0.3)
  func targetWolf(s: AnimalState, inp: AnimalInput) : Float {
    let drive = inp.warEscalation * 0.7
              + s.hive * 0.3
              + inp.ncTestosterone * 0.3
              - inp.ncCortisol * 0.2;
    sigmoid(drive, 2.5, 0.5)
  };

  // ORCA: cultural transmission, succession bonding
  // Orcas pass knowledge to calves — maps to NOVA royalty chain
  // High succession activity = high orca
  // Formula: orca = sigmoid(oxytocin * 0.5 + socialSignal * 0.4 + coherence * 0.2 - threat * 0.2)
  func targetOrca(s: AnimalState, inp: AnimalInput) : Float {
    let drive = inp.ncOxytocin * 0.5
              + inp.socialSignal * 0.4
              + inp.coherenceC * 0.2
              - inp.threat * 0.2;
    sigmoid(drive, 2.5, 0.45)
  };

  // EAGLE: sovereign vision, macro signal detection
  // Sees from above — detects macro trends others miss
  // High altitude = high coherence + low threat (calm, clear sky)
  // Formula: eagle = coherence * (1 - threat * 0.5) * metalAlloy
  func targetEagle(s: AnimalState, inp: AnimalInput) : Float {
    let clarity = inp.coherenceC * (1.0 - inp.threat * 0.5);
    _clamp(clarity * inp.metalAlloy * 1.2, 0.0, 1.0)
  };

  // OCTOPUS: distributed cognition, parallel processing
  // 8 arms = 8 parallel threads — maps to multi-shell parallel execution
  // High complexity tolerance = high octopus
  // Formula: octopus = hive * 0.4 + coherence * 0.3 + flowState * 0.3
  func targetOctopus(s: AnimalState, inp: AnimalInput) : Float {
    let drive = s.hive * 0.4
              + inp.coherenceC * 0.3
              + inp.flowState * 0.3
              + inp.bodyDomain * 0.1;
    _clamp(drive, 0.0, 1.0)
  };

  // ── EMA per animal (different time constants) ────────────────────────────
  let ALPHA : AnimalState = {
    crow=0.12; dolphin=0.15; hive=0.10; elephant=0.02;
    shark=0.20; wolf=0.18; orca=0.08; eagle=0.10; octopus=0.13;
  };

  // ── Full animal beat ─────────────────────────────────────────────────
  public func beatAnimals(s: AnimalState, inp: AnimalInput) : AnimalState {
    let tCrow     = targetCrow(s, inp);
    let tDolphin  = targetDolphin(s, inp);
    // Hive uses updated crow + dolphin
    let sCrowUpd  = ema(s.crow,    tCrow,    ALPHA.crow);
    let sDolphUpd = ema(s.dolphin, tDolphin, ALPHA.dolphin);
    let sTmpHive  = AnimalState { crow=sCrowUpd; dolphin=sDolphUpd;
      hive=s.hive; elephant=s.elephant; shark=s.shark;
      wolf=s.wolf; orca=s.orca; eagle=s.eagle; octopus=s.octopus };
    let tHive     = targetHive(sTmpHive, inp);
    let sHiveUpd  = ema(s.hive, tHive, ALPHA.hive);
    let sTmpWolf  = AnimalState { crow=sCrowUpd; dolphin=sDolphUpd;
      hive=sHiveUpd; elephant=s.elephant; shark=s.shark;
      wolf=s.wolf; orca=s.orca; eagle=s.eagle; octopus=s.octopus };
    {
      crow      = sCrowUpd;
      dolphin   = sDolphUpd;
      hive      = sHiveUpd;
      elephant  = ema(s.elephant, targetElephant(s, inp),     ALPHA.elephant);
      shark     = ema(s.shark,    targetShark(s, inp),        ALPHA.shark);
      wolf      = ema(s.wolf,     targetWolf(sTmpWolf, inp),  ALPHA.wolf);
      orca      = ema(s.orca,     targetOrca(s, inp),         ALPHA.orca);
      eagle     = ema(s.eagle,    targetEagle(s, inp),        ALPHA.eagle);
      octopus   = ema(s.octopus,  targetOctopus(sTmpHive, inp), ALPHA.octopus);
    }
  };

  // ── Animal composite — feeds into MEDINA blocks 8+ ──────────────────────
  // Weighted average; elephant has highest weight (long-memory sovereign)
  public func animalComposite(s: AnimalState) : Float {
    let wts  : [Float] = [0.10, 0.12, 0.12, 0.15, 0.10, 0.10, 0.10, 0.11, 0.10];
    let vals : [Float] = [
      s.crow, s.dolphin, s.hive, s.elephant, s.shark, s.wolf, s.orca, s.eagle, s.octopus
    ];
    var sum : Float = 0.0;
    for (i in Iter.range(0, 8)) { sum += vals[i] * wts[i]; };
    _clamp(sum, 0.0, 1.0)
  };

  // ── Specialised animal contributions ────────────────────────────────────
  public func predatorSignal(s: AnimalState)  : Float { (s.shark + s.wolf * 0.8) / 2.0 };
  public func socialSignalOut(s: AnimalState) : Float { (s.dolphin + s.orca + s.hive) / 3.0 };
  public func memorySignal(s: AnimalState)    : Float { (s.elephant + s.octopus) / 2.0 };
  public func visionSignal(s: AnimalState)    : Float { s.eagle };
  public func deceptionSignal(s: AnimalState) : Float { s.crow };

  // ── Animal Kuramoto — pack synchrony measure ──────────────────────────
  // R_animals = how synchronized all 9 animals are
  public func animalKuramoto(s: AnimalState) : Float {
    let vals : [Float] = [
      s.crow, s.dolphin, s.hive, s.elephant, s.shark, s.wolf, s.orca, s.eagle, s.octopus
    ];
    let mean = animalComposite(s);
    var variance : Float = 0.0;
    for (v in vals.vals()) { let d = v - mean; variance += d*d; };
    variance := variance / 9.0;
    1.0 - _clamp(variance * 4.0, 0.0, 1.0)  // higher = more synchronized
  };

  // ── Animal minting multiplier ──────────────────────────────────────────
  // Eagle vision + hive consensus + orca succession = minting boost
  public func animalMintMod(s: AnimalState) : Float {
    1.0 + (s.eagle * 0.3 + s.hive * 0.2 + s.orca * 0.2 + s.dolphin * 0.1) * 0.5
  };

  // ── helpers ──────────────────────────────────────────────────────────────
  func sigmoid(x: Float, k: Float, theta: Float) : Float {
    1.0 / (1.0 + Float.exp(-(k * (x - theta))))
  };
  func ema(current: Float, target: Float, alpha: Float) : Float {
    _clamp(alpha * target + (1.0 - alpha) * current, 0.0, 1.0)
  };
  private func _clamp(x: Float, lo: Float, hi: Float) : Float {
    if (x < lo) lo else if (x > hi) hi else x
  };
  private func _pow(b: Float, e: Float) : Float {
    if (b <= 0.0) 0.0 else Float.exp(e * Float.log(b))
  };
}
