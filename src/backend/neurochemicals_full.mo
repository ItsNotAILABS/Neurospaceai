// NEUROEMERGENCE CORE — NEUROCHEMICALS ENGINE
// 21 Sovereign Neurochemicals with full biological dynamics
// Production, decay, receptor saturation, cross-modulation
// Owner: Alfredo Medina Hernandez | MedinaSITech@outlook.com

module {

  // 23 neurochemicals (target 24 — Oxytocin already present)
  public type NC = {
    // Monoamines
    dopamine          : Float;  // reward, motivation, minting drive
    serotonin         : Float;  // mood stability, law compliance
    norepinephrine    : Float;  // arousal, threat response
    epinephrine       : Float;  // emergency override, ARES trigger
    // Acetylcholine
    acetylcholine     : Float;  // learning, attention, Hebbian gating
    // Inhibitory
    gaba              : Float;  // inhibition, coherence damping
    glycine           : Float;  // spinal inhibition, reflex gating
    // Excitatory
    glutamate         : Float;  // excitation, plasticity, war sim
    // Neuropeptides
    oxytocin          : Float;  // social bonding, NOVA succession
    vasopressin       : Float;  // memory consolidation, heritage
    beta_endorphin    : Float;  // pain modulation, reward smoothing
    substance_p       : Float;  // pain signal, threat encoding
    neuropeptide_y    : Float;  // stress resilience, metabolic
    dynorphin         : Float;  // kappa-opioid, dysphoria, stress-induced aversion
    // Purines
    adenosine         : Float;  // sleep pressure, reset drive
    // Lipids
    anandamide        : Float;  // flow state, creative resonance
    two_ag            : Float;  // synaptic retrograde, memory consolidation
    // Gases
    nitric_oxide      : Float;  // vascular, long-range signaling
    // Growth factors
    bdnf              : Float;  // synaptic growth, Hebbian amplification
    ngf               : Float;  // neural growth, new shell sprouting
    // Hormones (CNS-active)
    cortisol          : Float;  // chronic stress, coherence degradation
    testosterone      : Float;  // assertive drive, dominance, war sim
    histamine         : Float;  // H1/H3 receptor, wakefulness, appetite, cognition
  };

  // Baseline (homeostatic) levels
  public let NC_BASELINE : NC = {
    dopamine       = 0.55; serotonin     = 0.60; norepinephrine = 0.45;
    epinephrine    = 0.20; acetylcholine = 0.50; gaba           = 0.65;
    glycine        = 0.55; glutamate     = 0.50; oxytocin       = 0.40;
    vasopressin    = 0.45; beta_endorphin= 0.50; substance_p    = 0.30;
    neuropeptide_y = 0.50; dynorphin     = 0.20; adenosine      = 0.35;
    anandamide     = 0.45; two_ag        = 0.40; nitric_oxide   = 0.50;
    bdnf           = 0.70; ngf           = 0.55; cortisol       = 0.25;
    testosterone   = 0.50; histamine     = 0.40;
  };

  // Max levels (receptor saturation ceiling)
  public let NC_MAX : NC = {
    dopamine       = 1.0; serotonin     = 1.0; norepinephrine = 1.0;
    epinephrine    = 1.0; acetylcholine = 1.0; gaba           = 1.0;
    glycine        = 1.0; glutamate     = 1.0; oxytocin       = 1.0;
    vasopressin    = 1.0; beta_endorphin= 1.0; substance_p    = 1.0;
    neuropeptide_y = 1.0; dynorphin     = 1.0; adenosine      = 1.0;
    anandamide     = 1.0; two_ag        = 1.0; nitric_oxide   = 1.0;
    bdnf           = 1.5; ngf           = 1.2; cortisol       = 1.0;
    testosterone   = 1.0; histamine     = 1.0;
  };

  // Production rates (how fast each chemical is synthesized per beat)
  let PROD : NC = {
    dopamine       = 0.040; serotonin     = 0.030; norepinephrine = 0.035;
    epinephrine    = 0.015; acetylcholine = 0.045; gaba           = 0.050;
    glycine        = 0.040; glutamate     = 0.060; oxytocin       = 0.020;
    vasopressin    = 0.025; beta_endorphin= 0.030; substance_p    = 0.025;
    neuropeptide_y = 0.035; dynorphin     = 0.015; adenosine      = 0.045;
    anandamide     = 0.020; two_ag        = 0.025; nitric_oxide   = 0.050;
    bdnf           = 0.030; ngf           = 0.020; cortisol       = 0.015;
    testosterone   = 0.010; histamine     = 0.035;
  };

  // Decay rates (how fast each chemical degrades per beat)
  let DECAY : NC = {
    dopamine       = 0.035; serotonin     = 0.025; norepinephrine = 0.040;
    epinephrine    = 0.060; acetylcholine = 0.040; gaba           = 0.045;
    glycine        = 0.035; glutamate     = 0.055; oxytocin       = 0.030;
    vasopressin    = 0.020; beta_endorphin= 0.025; substance_p    = 0.050;
    neuropeptide_y = 0.030; dynorphin     = 0.025; adenosine     = 0.020; anandamide     = 0.030;
    two_ag         = 0.035; nitric_oxide  = 0.070; bdnf           = 0.015;
    ngf            = 0.010; cortisol      = 0.012; testosterone   = 0.008; histamine     = 0.030;
  };

  // ── Single chemical update: dC/dt = prod*(1-C/Cmax)*stim - decay*(C-base) ──
  func updateOne(
    current  : Float,
    baseline : Float,
    maxVal   : Float,
    prod     : Float,
    decay    : Float,
    stimulus : Float   // 0-1 external drive for this chemical
  ) : Float {
    let delta = prod * (1.0 - current/maxVal) * stimulus
                - decay * (current - baseline);
    _clamp(current + delta, 0.0, maxVal)
  };

  // ── Stimulus computation per chemical from organism state ──────────────
  // Each chemical has specific triggers
  public type OrgState = {
    coherenceC    : Float;
    arousal       : Float;
    threat        : Float;
    socialSignal  : Float;
    mintRate      : Float;
    painLevel     : Float;
    flowState     : Float;
    stressLevel   : Float;
    learningRate  : Float;
    dominance     : Float;
  };

  func computeStimuli(org: OrgState, nc: NC) : NC {
    {
      // Dopamine: coherence × mintRate × (1 - adenosine)
      dopamine       = _clamp(org.coherenceC * org.mintRate * (1.0 - nc.adenosine * 0.5), 0.0, 1.0);
      // Serotonin: social signal × flow state, suppressed by cortisol
      serotonin      = _clamp(org.socialSignal * 0.6 + org.flowState * 0.4 - nc.cortisol * 0.3, 0.0, 1.0);
      // Norepinephrine: arousal × threat
      norepinephrine = _clamp(org.arousal * 0.5 + org.threat * 0.5, 0.0, 1.0);
      // Epinephrine: high threat only
      epinephrine    = _clamp(org.threat * org.arousal, 0.0, 1.0);
      // Acetylcholine: learning × coherence
      acetylcholine  = _clamp(org.learningRate * 0.7 + org.coherenceC * 0.3, 0.0, 1.0);
      // GABA: inversely related to arousal
      gaba           = _clamp(1.0 - org.arousal * 0.7, 0.0, 1.0);
      // Glycine: stable baseline, slight inverse of threat
      glycine        = _clamp(1.0 - org.threat * 0.4, 0.0, 1.0);
      // Glutamate: arousal × learning
      glutamate      = _clamp(org.arousal * 0.5 + org.learningRate * 0.5, 0.0, 1.0);
      // Oxytocin: social signal × succession activity
      oxytocin       = _clamp(org.socialSignal * 0.8 + org.flowState * 0.2, 0.0, 1.0);
      // Vasopressin: stress × dominance
      vasopressin    = _clamp(org.stressLevel * 0.4 + org.dominance * 0.6, 0.0, 1.0);
      // Beta-endorphin: inverse of pain, modulated by coherence
      beta_endorphin = _clamp((1.0 - org.painLevel) * 0.6 + org.coherenceC * 0.4, 0.0, 1.0);
      // Substance P: pain level directly
      substance_p    = _clamp(org.painLevel * 0.9 + org.threat * 0.1, 0.0, 1.0);
      // Neuropeptide Y: stress resilience
      neuropeptide_y = _clamp(1.0 - org.stressLevel * 0.5, 0.0, 1.0);
      // Adenosine: accumulates with activity, resets on high coherence
      adenosine      = _clamp(org.arousal * 0.3 + (1.0 - org.coherenceC) * 0.2, 0.0, 1.0);
      // Anandamide: flow state × low stress
      anandamide     = _clamp(org.flowState * 0.7 + (1.0 - org.stressLevel) * 0.3, 0.0, 1.0);
      // 2-AG: learning × memory consolidation
      two_ag         = _clamp(org.learningRate * 0.6 + org.coherenceC * 0.4, 0.0, 1.0);
      // Nitric oxide: vascular, high coherence drives it
      nitric_oxide   = _clamp(org.coherenceC * 0.7 + org.arousal * 0.3, 0.0, 1.0);
      // BDNF: coherence × learning × low stress
      bdnf           = _clamp(org.coherenceC * org.learningRate * (1.0 - org.stressLevel * 0.5), 0.0, 1.5);
      // NGF: slow growth factor, driven by sustained coherence
      ngf            = _clamp(org.coherenceC * 0.6 + nc.bdnf * 0.4, 0.0, 1.2);
      // Cortisol: chronic stress accumulates it
      cortisol       = _clamp(org.stressLevel * 0.7 + org.threat * 0.3, 0.0, 1.0);
      // Testosterone: dominance × war escalation
      testosterone   = _clamp(org.dominance * 0.6 + org.arousal * 0.4, 0.0, 1.0);
      // Dynorphin: stress-induced aversion, KOR activation
      dynorphin      = _clamp(org.stressLevel * 0.7 + org.painLevel * 0.3, 0.0, 1.0);
      // Histamine: arousal/waking signal, H1/H3 receptor activation
      histamine      = _clamp(org.arousal * 0.6 + (1.0 - nc.adenosine) * 0.4, 0.0, 1.0);
    }
  };

  // ── Full NC beat update ───────────────────────────────────────────────
  public func beatNC(nc: NC, org: OrgState) : NC {
    let stim = computeStimuli(org, nc);
    {
      dopamine       = updateOne(nc.dopamine,       NC_BASELINE.dopamine,       NC_MAX.dopamine,       PROD.dopamine,       DECAY.dopamine,       stim.dopamine);
      serotonin      = updateOne(nc.serotonin,      NC_BASELINE.serotonin,      NC_MAX.serotonin,      PROD.serotonin,      DECAY.serotonin,      stim.serotonin);
      norepinephrine = updateOne(nc.norepinephrine, NC_BASELINE.norepinephrine, NC_MAX.norepinephrine, PROD.norepinephrine, DECAY.norepinephrine, stim.norepinephrine);
      epinephrine    = updateOne(nc.epinephrine,    NC_BASELINE.epinephrine,    NC_MAX.epinephrine,    PROD.epinephrine,    DECAY.epinephrine,    stim.epinephrine);
      acetylcholine  = updateOne(nc.acetylcholine,  NC_BASELINE.acetylcholine,  NC_MAX.acetylcholine,  PROD.acetylcholine,  DECAY.acetylcholine,  stim.acetylcholine);
      gaba           = updateOne(nc.gaba,           NC_BASELINE.gaba,           NC_MAX.gaba,           PROD.gaba,           DECAY.gaba,           stim.gaba);
      glycine        = updateOne(nc.glycine,        NC_BASELINE.glycine,        NC_MAX.glycine,        PROD.glycine,        DECAY.glycine,        stim.glycine);
      glutamate      = updateOne(nc.glutamate,      NC_BASELINE.glutamate,      NC_MAX.glutamate,      PROD.glutamate,      DECAY.glutamate,      stim.glutamate);
      oxytocin       = updateOne(nc.oxytocin,       NC_BASELINE.oxytocin,       NC_MAX.oxytocin,       PROD.oxytocin,       DECAY.oxytocin,       stim.oxytocin);
      vasopressin    = updateOne(nc.vasopressin,    NC_BASELINE.vasopressin,    NC_MAX.vasopressin,    PROD.vasopressin,    DECAY.vasopressin,    stim.vasopressin);
      beta_endorphin = updateOne(nc.beta_endorphin, NC_BASELINE.beta_endorphin, NC_MAX.beta_endorphin, PROD.beta_endorphin, DECAY.beta_endorphin, stim.beta_endorphin);
      substance_p    = updateOne(nc.substance_p,    NC_BASELINE.substance_p,    NC_MAX.substance_p,    PROD.substance_p,    DECAY.substance_p,    stim.substance_p);
      neuropeptide_y = updateOne(nc.neuropeptide_y, NC_BASELINE.neuropeptide_y, NC_MAX.neuropeptide_y, PROD.neuropeptide_y, DECAY.neuropeptide_y, stim.neuropeptide_y);
      adenosine      = updateOne(nc.adenosine,      NC_BASELINE.adenosine,      NC_MAX.adenosine,      PROD.adenosine,      DECAY.adenosine,      stim.adenosine);
      anandamide     = updateOne(nc.anandamide,     NC_BASELINE.anandamide,     NC_MAX.anandamide,     PROD.anandamide,     DECAY.anandamide,     stim.anandamide);
      two_ag         = updateOne(nc.two_ag,         NC_BASELINE.two_ag,         NC_MAX.two_ag,         PROD.two_ag,         DECAY.two_ag,         stim.two_ag);
      nitric_oxide   = updateOne(nc.nitric_oxide,   NC_BASELINE.nitric_oxide,   NC_MAX.nitric_oxide,   PROD.nitric_oxide,   DECAY.nitric_oxide,   stim.nitric_oxide);
      bdnf           = updateOne(nc.bdnf,           NC_BASELINE.bdnf,           NC_MAX.bdnf,           PROD.bdnf,           DECAY.bdnf,           stim.bdnf);
      ngf            = updateOne(nc.ngf,            NC_BASELINE.ngf,            NC_MAX.ngf,            PROD.ngf,            DECAY.ngf,            stim.ngf);
      cortisol       = updateOne(nc.cortisol,       NC_BASELINE.cortisol,       NC_MAX.cortisol,       PROD.cortisol,       DECAY.cortisol,       stim.cortisol);
      testosterone   = updateOne(nc.testosterone,   NC_BASELINE.testosterone,   NC_MAX.testosterone,   PROD.testosterone,   DECAY.testosterone,   stim.testosterone);
      dynorphin      = updateOne(nc.dynorphin,      NC_BASELINE.dynorphin,      NC_MAX.dynorphin,      PROD.dynorphin,      DECAY.dynorphin,      stim.dynorphin);
      histamine      = updateOne(nc.histamine,      NC_BASELINE.histamine,      NC_MAX.histamine,      PROD.histamine,      DECAY.histamine,      stim.histamine);
    }
  };

  // ── NC → organism modulation outputs ─────────────────────────────────
  // How the NC state modulates everything else
  public type NCMod = {
    hebbianBoost   : Float;  // multiplier on Hebbian learning
    mintBoost      : Float;  // multiplier on all token minting
    coherenceMod   : Float;  // delta to coherenceC
    arousalMod     : Float;  // sets arousal drive
    lawCompMod     : Float;  // law compliance multiplier
    memoryMod      : Float;  // memory consolidation rate
    warMod         : Float;  // war sim aggression
    successionMod  : Float;  // succession / NOVA activity
    flowMod        : Float;  // flow state boost
    stressMod      : Float;  // stress level output
    dynorphinMod   : Float;  // dysphoria/aversion modulation
    histamineMod     : Float;  // wakefulness/arousal modulation
  };

  public func computeNCMod(nc: NC) : NCMod {
    {
      // Hebbian boost: ACh × BDNF × (1 - adenosine)
      hebbianBoost  = nc.acetylcholine * nc.bdnf * (1.0 - nc.adenosine * 0.5);
      // Mint boost: dopamine × (1 - cortisol×0.5) × anandamide
      mintBoost     = nc.dopamine * (1.0 - nc.cortisol * 0.5) * (0.5 + nc.anandamide * 0.5);
      // Coherence: serotonin + nitric_oxide, reduced by glutamate overload
      coherenceMod  = (nc.serotonin * 0.4 + nc.nitric_oxide * 0.3 - nc.glutamate * 0.2) * 0.05;
      // Arousal: NE + epinephrine - GABA - adenosine
      arousalMod    = _clamp(nc.norepinephrine * 0.5 + nc.epinephrine * 0.5 - nc.gaba * 0.3 - nc.adenosine * 0.2, 0.0, 1.0);
      // Law compliance: serotonin × oxytocin × (1 - testosterone×0.3)
      lawCompMod    = nc.serotonin * nc.oxytocin * (1.0 - nc.testosterone * 0.3);
      // Memory: ACh × vasopressin × 2-AG
      memoryMod     = nc.acetylcholine * nc.vasopressin * nc.two_ag;
      // War aggression: testosterone × norepinephrine × (1 - serotonin×0.5)
      warMod        = nc.testosterone * nc.norepinephrine * (1.0 - nc.serotonin * 0.5);
      // Succession: oxytocin × vasopressin
      successionMod = nc.oxytocin * nc.vasopressin;
      // Flow: anandamide × dopamine × (1 - substance_p×0.5)
      flowMod       = nc.anandamide * nc.dopamine * (1.0 - nc.substance_p * 0.5);
      // Stress: cortisol × substance_p × (1 - neuropeptide_y×0.5)
      stressMod     = nc.cortisol * nc.substance_p * (1.0 - nc.neuropeptide_y * 0.5);
      dynorphinMod  = nc.dynorphin * (1.0 - nc.beta_endorphin * 0.5);
      histamineMod  = nc.histamine * (1.0 - nc.adenosine * 0.5);
    }
  };

  // ── Receptor downregulation ───────────────────────────────────────────
  // After prolonged high levels, receptors downregulate (tolerance)
  // Returns effective level after tolerance adjustment
  public func effectiveLevel(current: Float, tolerance: Float) : Float {
    current * (1.0 - tolerance * 0.4)
  };

  // ── NC composite health score ─────────────────────────────────────────
  // Measures how close NC is to ideal homeostatic balance
  public func ncHealthScore(nc: NC) : Float {
    let deviations = [
      Float.abs(nc.dopamine       - NC_BASELINE.dopamine),
      Float.abs(nc.serotonin      - NC_BASELINE.serotonin),
      Float.abs(nc.norepinephrine - NC_BASELINE.norepinephrine),
      Float.abs(nc.gaba           - NC_BASELINE.gaba),
      Float.abs(nc.glutamate      - NC_BASELINE.glutamate),
      Float.abs(nc.cortisol       - NC_BASELINE.cortisol),
      Float.abs(nc.bdnf           - NC_BASELINE.bdnf),
      Float.abs(nc.dynorphin      - NC_BASELINE.dynorphin),
      Float.abs(nc.histamine      - NC_BASELINE.histamine),
    ];
    var sumDev : Float = 0.0;
    for (d in deviations.vals()) { sumDev += d; };
    let _devLen : Int = deviations.size();
    var devLenF : Float = 0.0;
    var _di : Nat = 0;
    while (_di < deviations.size()) { devLenF += 1.0; _di += 1; };
    _clamp(1.0 - sumDev / devLenF, 0.0, 1.0)
  };

  // SOVEREIGN FIELD COUPLING — 8 core neurochemicals mapped to field parameters
  public type FieldCouplingState = {
    kuramotoK: Float;
    restIntervalBeats: Nat;
    spandaAmplitude: Float;
    torsionSpinMult: Float;
    hekaFreqHz: Float;
    nmdaLtp: Float;
    amygdalaSuppress: Float;
    aegisStressGate: Float;
  };

  public func computeFieldCoupling(nc: NC) : FieldCouplingState {
    // DA → Kuramoto K: base 0.5, DA boosts up to 0.5 more (range 0.5-1.0)
    let kuramotoK = 0.5 + (nc.dopamine * 0.5);

    // GABA → rest interval: Fibonacci-scaled (8, 13, 21, 34 beats by quartile)
    let restIntervalBeats : Nat =
      if (nc.gaba < 0.25) { 8 }
      else if (nc.gaba < 0.50) { 13 }
      else if (nc.gaba < 0.75) { 21 }
      else { 34 };

    // 5-HT → SPANDA amplitude multiplier (range 0.3-0.7)
    let spandaAmplitude = 0.3 + (nc.serotonin * 0.4);

    // NE → TORSION spin multiplier (range: PHI_INV to ~0.764)
    // PHI_INV = 0.618, PHI_INV2 = 0.382
    let torsionSpinMult = 0.618 + (nc.norepinephrine * 0.382);

    // ACh → HEKA resonance frequency (range 7.83-20.83 Hz)
    let hekaFreqHz = 7.83 + (nc.acetylcholine * 13.0);

    // Glutamate → NMDA LTP gate (0 below 0.4, linear 0.4-0.8, 1.0 above 0.8)
    let nmdaLtp =
      if (nc.glutamate < 0.4) { 0.0 }
      else if (nc.glutamate > 0.8) { 1.0 }
      else { (nc.glutamate - 0.4) / 0.4 };

    // Oxytocin → Amygdala suppression (range 0-0.8; session data: amygdala at 4%)
    let amygdalaSuppress = nc.oxytocin * 0.8;

    // Cortisol → AEGIS stress gate (range 0.15-1.0)
    let aegisStressGate = 0.15 + (nc.cortisol * 0.85);

    { kuramotoK; restIntervalBeats; spandaAmplitude; torsionSpinMult; hekaFreqHz; nmdaLtp; amygdalaSuppress; aegisStressGate }
  };

  private func _clamp(x: Float, lo: Float, hi: Float) : Float {
    if (x < lo) lo else if (x > hi) hi else x
  };
}
