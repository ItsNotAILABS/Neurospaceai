// NEUROEMERGENCE CORE — PHARMA EXPERIMENTS ENGINE
// Sovereign experiment computation for neuropharmacology research
// Owner: Alfredo Medina Hernandez | MedinaSITech@outlook.com

import Float "mo:core/Float";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Text "mo:core/Text";

module {

  public type ExperimentType = {
    #ControlledSession;
    #DoseResponseCurve;
    #CombinationProtocol;
    #LongitudinalStudy;
    #ReceptorMapping;
  };

  public type PKPDProfile = {
    compoundName : Text;
    dose         : Float;
    bbbCoeff     : Float;
    vd           : Float;
    halfLife     : Float;
    cmax         : Float;
    ke           : Float;
    auc          : Float;
  };

  public type CascadeEvent = {
    chemical   : Text;
    delta      : Float;
    timestamp  : Nat;
    trigger    : Text;
  };

  public type TimePoint = {
    t        : Float;
    conc     : Float;
    effect   : Float;
    receptor : Text;
  };

  public type ControlledSessionResult = {
    compoundName      : Text;
    dose              : Float;
    peakReceptor      : Text;
    peakOccupancy     : Float;
    regionalEffects   : [(Text, Float)];
    validationScore   : Float;
    durationTicks     : Nat;
    cascadeEvents     : [CascadeEvent];
  };

  public type DoseResponseResult = {
    compoundName    : Text;
    ec50            : Float;
    hillCoefficient : Float;
    therapeuticWindow : Float;
    curvePoints     : [(Float, Float)];
    maxEffect       : Float;
    minEffect       : Float;
  };

  public type CombinationResult = {
    compoundA      : Text;
    compoundB      : Text;
    synergyScore   : Float;
    antagonismScore: Float;
    combinedEffect : Float;
    aAloneEffect   : Float;
    bAloneEffect   : Float;
    recommendation : Text;
  };

  public type LongitudinalResult = {
    compoundName     : Text;
    sessions         : Nat;
    toleranceFactor  : Float;
    sensitizationIdx : Float;
    washoutRate      : Float;
    sessionPoints    : [(Nat, Float)];
    finalEfficacy    : Float;
  };

  public type ReceptorMappingResult = {
    compoundName    : Text;
    receptorProfiles  : [(Text, Float)];
    bindingKinetics   : [(Text, Float)];
    selectivityIndex  : Float;
    offTargetRisk     : Float;
  };

  public type HypothesisRecord = {
    id          : Nat;
    timestamp   : Nat;
    experimentType : ExperimentType;
    rationale   : Text;
    priority    : Float;
  };

  public type ExperimentHistoryEntry = {
    id            : Nat;
    timestamp     : Nat;
    experimentType : ExperimentType;
    compoundName  : Text;
    resultSummary : Text;
    validationScore : Float;
  };

  // ── Core math helpers ─────────────────────────────────────────────────

  func _clamp(v : Float, lo : Float, hi : Float) : Float {
    if (v < lo) { lo } else if (v > hi) { hi } else { v }
  };

  public func hill(c : Float, emax : Float, ec50 : Float, n : Float) : Float {
    let cn = Float.pow(c, n);
    let ec50n = Float.pow(ec50, n);
    emax * cn / (ec50n + cn)
  };

  public func concAt(cmax : Float, ke : Float, t : Float) : Float {
    cmax * Float.exp(-ke * t)
  };

  public func computePKPD(dose : Float, bbbCoeff : Float, vd : Float, halfLife : Float) : PKPDProfile {
    let cmax = dose * bbbCoeff / vd;
    let ke = 0.693 / halfLife;
    let auc = cmax / ke;
    {
      compoundName = "";
      dose = dose;
      bbbCoeff = bbbCoeff;
      vd = vd;
      halfLife = halfLife;
      cmax = cmax;
      ke = ke;
      auc = auc;
    }
  };

  // ── Controlled Session ──────────────────────────────────────────────

  public func computeControlledSession(
    compoundName : Text,
    dose : Float,
    baseReceptorAffinity : Float,
    durationTicks : Nat
  ) : ControlledSessionResult {
    let pk = computePKPD(dose, 0.85, 1.2, 4.0);
    let peakOcc = _clamp(pk.cmax * baseReceptorAffinity, 0.0, 1.0);
    let regions = [
      ("PrefrontalCortex", _clamp(peakOcc * 0.92, 0.0, 1.0)),
      ("Hippocampus", _clamp(peakOcc * 0.78, 0.0, 1.0)),
      ("Amygdala", _clamp(peakOcc * 0.65, 0.0, 1.0)),
      ("Thalamus", _clamp(peakOcc * 0.71, 0.0, 1.0)),
      ("BasalGanglia", _clamp(peakOcc * 0.83, 0.0, 1.0)),
      ("Cerebellum", _clamp(peakOcc * 0.55, 0.0, 1.0)),
      ("Brainstem", _clamp(peakOcc * 0.48, 0.0, 1.0)),
      ("Insula", _clamp(peakOcc * 0.69, 0.0, 1.0)),
    ];
    let valScore = _clamp(peakOcc * 0.85 + 0.1, 0.0, 1.0);
    let cascades = [
      { chemical = "dopamine"; delta = _clamp(peakOcc * 0.4, 0.0, 1.0); timestamp = durationTicks; trigger = compoundName },
      { chemical = "serotonin"; delta = _clamp(peakOcc * 0.35, 0.0, 1.0); timestamp = durationTicks; trigger = compoundName },
      { chemical = "cortisol"; delta = _clamp(peakOcc * 0.15, 0.0, 1.0); timestamp = durationTicks; trigger = compoundName },
    ];
    {
      compoundName = compoundName;
      dose = dose;
      peakReceptor = "5-HT1A";
      peakOccupancy = peakOcc;
      regionalEffects = regions;
      validationScore = valScore;
      durationTicks = durationTicks;
      cascadeEvents = cascades;
    }
  };

  // ── Dose-Response Curve ───────────────────────────────────────────────

  public func computeDoseResponse(
    compoundName : Text,
    doses : [Float],
    emax : Float,
    ec50 : Float,
    n : Float
  ) : DoseResponseResult {
    let points = doses.map(
      func(d) { (d, hill(d, emax, ec50, n)) }
    );
    let maxE = points.foldLeft(
      0.0, func(acc, p) { Float.max(acc, p.1) }
    );
    let minE = points.foldLeft(
      1.0, func(acc, p) { Float.min(acc, p.1) }
    );
    let tw = ec50 * 10.0;
    {
      compoundName = compoundName;
      ec50 = ec50;
      hillCoefficient = n;
      therapeuticWindow = tw;
      curvePoints = points;
      maxEffect = maxE;
      minEffect = minE;
    }
  };

  // ── Combination Protocol ──────────────────────────────────────────────

  public func computeCombination(
    compoundA : Text,
    compoundB : Text,
    effectA : Float,
    effectB : Float,
    combinedEffect : Float
  ) : CombinationResult {
    let expected = effectA + effectB - effectA * effectB;
    let synergy = _clamp(combinedEffect - expected, -1.0, 1.0);
    let antagonism = _clamp(expected - combinedEffect, 0.0, 1.0);
    let rec = if (synergy > 0.15) {
      "Strong synergy — proceed with caution"
    } else if (synergy > 0.05) {
      "Mild synergy — acceptable"
    } else if (antagonism > 0.15) {
      "Antagonism detected — avoid combination"
    } else {
      "Additive — no significant interaction"
    };
    {
      compoundA = compoundA;
      compoundB = compoundB;
      synergyScore = synergy;
      antagonismScore = antagonism;
      combinedEffect = combinedEffect;
      aAloneEffect = effectA;
      bAloneEffect = effectB;
      recommendation = rec;
    }
  };

  // ── Longitudinal Study ────────────────────────────────────────────────

  public func computeLongitudinal(
    compoundName : Text,
    sessions : Nat,
    baseEfficacy : Float
  ) : LongitudinalResult {
    let toleranceFactors : [Float] = [1.0, 0.618, 0.382, 0.236, 0.146];
    let pts = Array.tabulate(sessions, func(i) { i }).map(
      func(i) {
        let idx = if (i < toleranceFactors.size()) { i } else { toleranceFactors.size() - 1 };
        let tf = toleranceFactors[idx];
        (i, baseEfficacy * tf)
      }
    );
    let finalE = if (pts.size() > 0) {
      pts[pts.size() - 1].1
    } else { baseEfficacy };
    let sens = _clamp(baseEfficacy - finalE, 0.0, 1.0);
    {
      compoundName = compoundName;
      sessions = sessions;
      toleranceFactor = if (pts.size() > 0) { pts[0].1 / baseEfficacy } else { 1.0 };
      sensitizationIdx = sens;
      washoutRate = 0.693 / 4.0;
      sessionPoints = pts;
      finalEfficacy = finalE;
    }
  };

  // ── Receptor Mapping ────────────────────────────────────────────────

  public func computeReceptorMapping(
    compoundName : Text,
    affinities : [(Text, Float)]
  ) : ReceptorMappingResult {
    let kinetics = affinities.map(
      func(a) { (a.0, 1.0 / (a.1 + 0.001)) }
    );
    let maxAff = affinities.foldLeft(
      0.0, func(acc, a) { Float.max(acc, a.1) }
    );
    let minAff = affinities.foldLeft(
      1.0, func(acc, a) { Float.min(acc, a.1) }
    );
    let selIdx = if (minAff > 0.0) { maxAff / minAff } else { 0.0 };
    let offRisk = _clamp(1.0 - selIdx / 100.0, 0.0, 1.0);
    {
      compoundName = compoundName;
      receptorProfiles = affinities;
      bindingKinetics = kinetics;
      selectivityIndex = selIdx;
      offTargetRisk = offRisk;
    }
  };

  // ── Hypothesis Generation ───────────────────────────────────────────

  public func generateHypothesis(
    id : Nat,
    timestamp : Nat,
    da : Float,
    fiveht : Float,
    cortisol : Float,
    gaba : Float,
    betaEndorphin : Float
  ) : HypothesisRecord {
    let expType = if (da < 0.35 and fiveht < 0.35) {
      #CombinationProtocol
    } else if (cortisol > 0.75 and gaba < 0.40) {
      #DoseResponseCurve
    } else if (betaEndorphin < 0.25) {
      #ReceptorMapping
    } else if (da > 0.80) {
      #LongitudinalStudy
    } else {
      #ControlledSession
    };
    let rationale = switch (expType) {
      case (#CombinationProtocol) { "Low DA and 5-HT suggest dual-target intervention needed" };
      case (#DoseResponseCurve) { "High cortisol + low GABA indicates dose-dependent stress modulation" };
      case (#ReceptorMapping) { "Low beta-endorphin suggests opioid receptor profiling" };
      case (#LongitudinalStudy) { "High DA drive suggests tolerance/sensitization study" };
      case (#ControlledSession) { "Baseline state — standard controlled session recommended" };
    };
    let priority = switch (expType) {
      case (#CombinationProtocol) { 0.85 };
      case (#DoseResponseCurve) { 0.80 };
      case (#ReceptorMapping) { 0.75 };
      case (#LongitudinalStudy) { 0.70 };
      case (#ControlledSession) { 0.50 };
    };
    {
      id = id;
      timestamp = timestamp;
      experimentType = expType;
      rationale = rationale;
      priority = priority;
    }
  };

}
