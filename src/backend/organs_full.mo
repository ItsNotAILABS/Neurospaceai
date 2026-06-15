// NEUROEMERGENCE CORE — ORGANS ENGINE
// 18 Sovereign Organs with full substrate mathematics
// Each organ: delta equation, health score, cascade effects
// Owner: Alfredo Medina Hernandez | MedinaSITech@outlook.com

module {

  // 18 sovereign organs
  public type Organs = {
    // Primary life organs
    cardium      : Float;  // heart — cardiac coherence, blood pressure
    pneuma       : Float;  // lungs — respiratory rhythm, oxygen delivery
    hepatos      : Float;  // liver — metabolic processing, detox
    nephron      : Float;  // kidneys — filtration, electrolyte balance
    // Brain regions
    cerebrum     : Float;  // cortex — executive function, reasoning
    amygdala     : Float;  // threat processing, emotional salience
    hippocampus  : Float;  // memory encoding, spatial navigation
    thalamus     : Float;  // sensory relay, consciousness gating
    hypothalamus : Float;  // homeostasis, hormone regulation
    cerebellum   : Float;  // coordination, timing, motor learning
    // Endocrine
    adrenal      : Float;  // cortisol/epinephrine production
    thyroid      : Float;  // metabolic rate, energy regulation
    pineal       : Float;  // circadian, melatonin, temporal anchor
    // Immune/Gut
    spleen       : Float;  // immune modulation, blood filtration
    gut_brain    : Float;  // enteric nervous system, 2nd brain
    // Vascular/Lymph
    aorta        : Float;  // systemic blood pressure, flow
    lymph_net    : Float;  // immune surveillance, waste removal
    // Energy
    mitochondria : Float;  // ATP production, energy substrate
  };

  // Homeostatic baselines
  public let ORG_BASELINE : Organs = {
    cardium=0.72; pneuma=0.70; hepatos=0.68; nephron=0.70;
    cerebrum=0.65; amygdala=0.45; hippocampus=0.60; thalamus=0.65;
    hypothalamus=0.68; cerebellum=0.65;
    adrenal=0.40; thyroid=0.60; pineal=0.55;
    spleen=0.65; gut_brain=0.62;
    aorta=0.72; lymph_net=0.60;
    mitochondria=0.75;
  };

  // Input state for organ dynamics
  public type OrgInput = {
    coherenceC   : Float;
    arousal      : Float;
    threat       : Float;
    ncDopamine   : Float;
    ncCortisol   : Float;
    ncSerotonin  : Float;
    ncNE         : Float;
    ncGABA       : Float;
    ncACh        : Float;
    ncBDNF       : Float;
    beatNum      : Nat;
    metalAlloy   : Float;  // sovereign alloy from metals engine
  };

  // ── Organ delta equations ─────────────────────────────────────────────
  // Each organ: dOrgan/dt = f(inputs, other_organs, NC) - decay*(organ - base)

  func dCardium(o: Organs, inp: OrgInput) : Float {
    // Heart: driven by coherence and arousal, damped by GABA
    let drive = inp.coherenceC * 0.4 + inp.arousal * 0.3 - inp.ncCortisol * 0.3;
    let homeostasis = -0.05 * (o.cardium - ORG_BASELINE.cardium);
    drive * 0.03 + homeostasis
  };

  func dPneuma(o: Organs, inp: OrgInput) : Float {
    // Lungs: respiratory coherence with heart (cardio-respiratory coupling)
    let coupling = 0.15 * (o.cardium - o.pneuma);  // entrain to heart
    let drive    = inp.ncACh * 0.3 - inp.threat * 0.2;
    let homeostasis = -0.04 * (o.pneuma - ORG_BASELINE.pneuma);
    drive * 0.025 + coupling + homeostasis
  };

  func dHepatos(o: Organs, inp: OrgInput) : Float {
    // Liver: metabolic load driven by arousal, supported by BDNF
    let load        = inp.arousal * 0.4 + inp.threat * 0.2;
    let support     = inp.ncBDNF * 0.4;
    let homeostasis = -0.04 * (o.hepatos - ORG_BASELINE.hepatos);
    (support - load) * 0.02 + homeostasis
  };

  func dNephron(o: Organs, inp: OrgInput) : Float {
    // Kidneys: electrolyte driven by cortisol and coherence
    let drive       = inp.coherenceC * 0.3 - inp.ncCortisol * 0.4;
    let homeostasis = -0.035 * (o.nephron - ORG_BASELINE.nephron);
    drive * 0.02 + homeostasis
  };

  func dCerebrum(o: Organs, inp: OrgInput) : Float {
    // Cortex: driven by all executive inputs
    let cogLoad     = inp.coherenceC * 0.5 + inp.ncACh * 0.3 + inp.ncBDNF * 0.2;
    let fatigue     = inp.ncCortisol * 0.3 + inp.ncNE * 0.1;
    let homeostasis = -0.03 * (o.cerebrum - ORG_BASELINE.cerebrum);
    (cogLoad - fatigue) * 0.03 + homeostasis
  };

  func dAmygdala(o: Organs, inp: OrgInput) : Float {
    // Amygdala: threat sensor — high threat = high activation
    let threatDrive = inp.threat * 0.6 + inp.ncNE * 0.4;
    let suppress    = inp.ncSerotonin * 0.3 + inp.ncGABA * 0.4;
    let homeostasis = -0.06 * (o.amygdala - ORG_BASELINE.amygdala);
    (threatDrive - suppress) * 0.04 + homeostasis
  };

  func dHippocampus(o: Organs, inp: OrgInput) : Float {
    // Hippocampus: memory consolidation, needs ACh and BDNF, hurt by cortisol
    let memorize    = inp.ncACh * 0.4 + inp.ncBDNF * 0.4;
    let hurt        = inp.ncCortisol * 0.5;  // cortisol kills hippocampus
    let homeostasis = -0.03 * (o.hippocampus - ORG_BASELINE.hippocampus);
    (memorize - hurt) * 0.025 + homeostasis
  };

  func dThalamus(o: Organs, inp: OrgInput) : Float {
    // Thalamus: relay gate — coherence opens it, threat narrows it
    let gate        = inp.coherenceC * 0.5 - inp.threat * 0.3;
    let homeostasis = -0.04 * (o.thalamus - ORG_BASELINE.thalamus);
    gate * 0.03 + homeostasis
  };

  func dHypothalamus(o: Organs, inp: OrgInput) : Float {
    // Hypothalamus: homeostasis hub — detects deviations
    let deviation   = Float.abs(inp.coherenceC - 0.7) * 0.4;
    let correction  = -deviation * 0.3;
    let homeostasis = -0.05 * (o.hypothalamus - ORG_BASELINE.hypothalamus);
    correction * 0.02 + homeostasis
  };

  func dCerebellum(o: Organs, inp: OrgInput) : Float {
    // Cerebellum: timing, coordination — entrains to cardium and pneuma
    let timing      = (o.cardium + o.pneuma) * 0.25;
    let drive       = inp.coherenceC * 0.3 + timing;
    let homeostasis = -0.04 * (o.cerebellum - ORG_BASELINE.cerebellum);
    drive * 0.02 + homeostasis
  };

  func dAdrenal(o: Organs, inp: OrgInput) : Float {
    // Adrenal: activated by threat, produces cortisol/epinephrine
    let activation  = inp.threat * 0.6 + inp.arousal * 0.4;
    let homeostasis = -0.05 * (o.adrenal - ORG_BASELINE.adrenal);
    activation * 0.03 + homeostasis
  };

  func dThyroid(o: Organs, inp: OrgInput) : Float {
    // Thyroid: metabolic rate — driven by coherence demand
    let demand      = inp.coherenceC * 0.4 + inp.arousal * 0.3;
    let homeostasis = -0.03 * (o.thyroid - ORG_BASELINE.thyroid);
    demand * 0.02 + homeostasis
  };

  func dPineal(o: Organs, inp: OrgInput) : Float {
    // Pineal: temporal anchor — tied to beat count circadian rhythm
    let circadian   = _sin(Float.fromInt(inp.beatNum % 1440) * 3.14159 / 720.0) * 0.3 + 0.5;
    let homeostasis = -0.02 * (o.pineal - circadian);
    homeostasis
  };

  func dSpleen(o: Organs, inp: OrgInput) : Float {
    // Spleen: immune, filters at high coherence
    let immunity    = inp.coherenceC * 0.4 - inp.ncCortisol * 0.4;
    let homeostasis = -0.04 * (o.spleen - ORG_BASELINE.spleen);
    immunity * 0.02 + homeostasis
  };

  func dGutBrain(o: Organs, inp: OrgInput) : Float {
    // Gut-brain: enteric nervous system — mirrors main brain
    let mirror      = o.cerebrum * 0.3 + inp.ncSerotonin * 0.5;
    let homeostasis = -0.04 * (o.gut_brain - ORG_BASELINE.gut_brain);
    (mirror - o.gut_brain) * 0.05 + homeostasis
  };

  func dAorta(o: Organs, inp: OrgInput) : Float {
    // Aorta: systemic pressure — couples to heart, modulated by alloy
    let pressure    = o.cardium * 0.5 + inp.metalAlloy * 0.3;
    let homeostasis = -0.04 * (o.aorta - ORG_BASELINE.aorta);
    (pressure - o.aorta) * 0.04 + homeostasis
  };

  func dLymphNet(o: Organs, inp: OrgInput) : Float {
    // Lymphatic: immune surveillance, driven by spleen
    let flow        = o.spleen * 0.4 + inp.coherenceC * 0.3;
    let homeostasis = -0.03 * (o.lymph_net - ORG_BASELINE.lymph_net);
    (flow - o.lymph_net) * 0.03 + homeostasis
  };

  func dMitochondria(o: Organs, inp: OrgInput) : Float {
    // Mitochondria: ATP production — scales with demand
    let demand      = inp.arousal * 0.4 + inp.coherenceC * 0.4;
    let alloyBoost  = inp.metalAlloy * 0.2;
    let homeostasis = -0.03 * (o.mitochondria - ORG_BASELINE.mitochondria);
    (demand + alloyBoost - o.mitochondria * 0.1) * 0.025 + homeostasis
  };

  // ── Full organs beat ──────────────────────────────────────────────────
  public func beatOrgans(o: Organs, inp: OrgInput) : Organs {
    {
      cardium      = _clamp(o.cardium      + dCardium(o, inp),     0.0, 1.0);
      pneuma       = _clamp(o.pneuma       + dPneuma(o, inp),      0.0, 1.0);
      hepatos      = _clamp(o.hepatos      + dHepatos(o, inp),     0.0, 1.0);
      nephron      = _clamp(o.nephron      + dNephron(o, inp),     0.0, 1.0);
      cerebrum     = _clamp(o.cerebrum     + dCerebrum(o, inp),    0.0, 1.0);
      amygdala     = _clamp(o.amygdala     + dAmygdala(o, inp),    0.0, 1.0);
      hippocampus  = _clamp(o.hippocampus  + dHippocampus(o, inp), 0.0, 1.0);
      thalamus     = _clamp(o.thalamus     + dThalamus(o, inp),    0.0, 1.0);
      hypothalamus = _clamp(o.hypothalamus + dHypothalamus(o, inp),0.0, 1.0);
      cerebellum   = _clamp(o.cerebellum   + dCerebellum(o, inp),  0.0, 1.0);
      adrenal      = _clamp(o.adrenal      + dAdrenal(o, inp),     0.0, 1.0);
      thyroid      = _clamp(o.thyroid      + dThyroid(o, inp),     0.0, 1.0);
      pineal       = _clamp(o.pineal       + dPineal(o, inp),      0.0, 1.0);
      spleen       = _clamp(o.spleen       + dSpleen(o, inp),      0.0, 1.0);
      gut_brain    = _clamp(o.gut_brain    + dGutBrain(o, inp),    0.0, 1.0);
      aorta        = _clamp(o.aorta        + dAorta(o, inp),       0.0, 1.0);
      lymph_net    = _clamp(o.lymph_net    + dLymphNet(o, inp),    0.0, 1.0);
      mitochondria = _clamp(o.mitochondria + dMitochondria(o, inp),0.0, 1.0);
    }
  };

  // ── Composite body domain score ───────────────────────────────────────
  // Weighted average of all organ health
  public func bodyDomain(o: Organs) : Float {
    let vals : [Float] = [
      o.cardium*1.4, o.pneuma*1.3, o.hepatos*1.1, o.nephron*1.1,
      o.cerebrum*1.5, o.amygdala*0.8, o.hippocampus*1.3, o.thalamus*1.2,
      o.hypothalamus*1.2, o.cerebellum*1.0,
      o.adrenal*0.9, o.thyroid*1.0, o.pineal*0.8,
      o.spleen*0.9, o.gut_brain*1.1,
      o.aorta*1.2, o.lymph_net*0.9,
      o.mitochondria*1.4
    ];
    var sum : Float = 0.0;
    var wSum : Float = 0.0;
    // weights embedded in vals already
    let weights : [Float] = [
      1.4, 1.3, 1.1, 1.1, 1.5, 0.8, 1.3, 1.2, 1.2, 1.0,
      0.9, 1.0, 0.8, 0.9, 1.1, 1.2, 0.9, 1.4
    ];
    for (i in Iter.range(0, 17)) {
      let rawVals : [Float] = [
        o.cardium, o.pneuma, o.hepatos, o.nephron,
        o.cerebrum, o.amygdala, o.hippocampus, o.thalamus,
        o.hypothalamus, o.cerebellum,
        o.adrenal, o.thyroid, o.pineal,
        o.spleen, o.gut_brain,
        o.aorta, o.lymph_net,
        o.mitochondria
      ];
      sum  += rawVals[i] * weights[i];
      wSum += weights[i];
    };
    if (wSum > 0.0) { _clamp(sum / wSum, 0.0, 1.0) } else { 0.5 }
  };

  // ── Critical organ failure check ──────────────────────────────────────
  // Returns true if any vital organ is critically low
  public func criticalCheck(o: Organs) : Bool {
    o.cardium < 0.15 or o.pneuma < 0.15 or o.cerebrum < 0.10 or
    o.mitochondria < 0.10 or o.thalamus < 0.10
  };

  // ── Organ → minting modifier ──────────────────────────────────────────
  // High organ health = higher mint rates
  public func organMintMod(o: Organs) : Float {
    let dom = bodyDomain(o);
    0.5 + dom * 1.5  // range [0.5, 2.0]
  };

  private func _clamp(x: Float, lo: Float, hi: Float) : Float {
    if (x < lo) lo else if (x > hi) hi else x
  };
  private func _sin(x: Float) : Float {
    var xx = x;
    while (xx >  3.14159265) { xx -= 6.28318530 };
    while (xx < -3.14159265) { xx += 6.28318530 };
    let x2 = xx * xx;
    xx - xx*x2/6.0 + xx*x2*x2/120.0
  };
}
