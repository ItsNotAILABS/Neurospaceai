// NEUROEMERGENCE CORE — BEHAVIORAL ECONOMICS ENGINE
// Prospect Theory, hyperbolic discounting, mental accounting
// Availability heuristic, anchoring, peak-end rule, flow state
// Decision fatigue, self-determination theory
// Owner: Alfredo Medina Hernandez | MedinaSITech@outlook.com

module {

  // Full behavioral economics state
  public type BehavEconState = {
    // Mental accounting (per-token reference points)
    refPointBTC      : Float;   // BTC anchor price (first seen)
    refPointETH      : Float;
    refPointICP      : Float;
    gainSensitivity  : Float;   // 0.5-2.0, how much gains matter
    lossSensitivity  : Float;   // 1.0-4.0, how much losses matter (always > gain)
    // Availability heuristic
    recentSalienceScore : Float; // how vivid/recent are bad events?
    // Anchoring
    anchorSet        : Bool;    // first market signal received?
    // Peak-end rule
    peakCoherence    : Float;   // highest coherence seen in current episode
    endCoherence     : Float;   // coherence at episode end
    episodeReward    : Float;   // perceived episode reward = (peak + end) / 2
    episodeCount     : Nat;
    // Flow state
    flowScore        : Float;   // 0-1 (challenge-skill balance)
    skillLevel       : Float;   // accumulated competence
    challengeLevel   : Float;   // current difficulty
    // Decision fatigue
    decisionCount    : Nat;     // decisions made this beat window
    cognitiveLoad    : Float;   // accumulated fatigue 0-1
    // Self-determination theory
    autonomyScore    : Float;   // perceived agency 0-1
    competenceScore  : Float;   // mastery feeling 0-1
    relatednessScore : Float;   // social connection 0-1
    intrinsicMotivation: Float; // emergent drive
    // Hyperbolic discounting
    presentBias      : Float;   // k parameter (decays with maturity)
    curriculumLevel  : Nat;     // organism maturity
    // Mental accounting buckets
    mintingAccount   : Float;   // perceived minting wealth
    successionAccount: Float;   // perceived dynasty wealth
    securityAccount  : Float;   // perceived safety reserve
  };

  public type BehavInput = {
    btcPrice      : Float;
    ethPrice      : Float;
    icpPrice      : Float;
    coherenceC    : Float;
    mintRate      : Float;
    threat        : Float;
    socialSignal  : Float;
    lawFired      : Nat;
    beatNum       : Nat;
    formaBalance  : Float;
    childCount    : Nat;
    royaltyInflow : Float;
  };

  // ── Prospect Theory value function ──────────────────────────────────────
  // v(x) = gain_sensitivity * x^0.88  if x >= 0
  //      = -loss_sensitivity * |x|^0.88  if x < 0
  public func prospectValueFull(
    x              : Float,
    gainSensitivity: Float,
    lossSensitivity: Float
  ) : Float {
    let alpha : Float = 0.88;
    if (x >= 0.0) {
      gainSensitivity * _pow(x, alpha)
    } else {
      -(lossSensitivity * _pow(-x, alpha))
    }
  };

  // ── Anchoring update ───────────────────────────────────────────────
  // First price seen becomes permanent anchor
  // All future prices evaluated relative to anchor
  public func anchoredPerception(
    currentPrice : Float,
    anchorPrice  : Float
  ) : Float {
    if (anchorPrice <= 0.0) { return 0.5; };
    let ratio = currentPrice / anchorPrice;
    // Above anchor = gain perception, below = loss perception
    // Compressed by 0.88 power law
    if (ratio >= 1.0) {
      _clamp(_pow(ratio - 1.0, 0.88), 0.0, 1.0)
    } else {
      -_clamp(_pow(1.0 - ratio, 0.88) * 2.25, 0.0, 1.0)
    }
  };

  // ── Availability heuristic ───────────────────────────────────────────
  // Recent vivid events are overweighted in decision making
  // salience = vividness * recency_weight
  // recency_weight decays exponentially with age
  public func updateSalience(
    current     : Float,
    newEvent    : Float,  // 0 = nothing, 1 = very vivid event
    decayRate   : Float
  ) : Float {
    // Decay old salience and add new
    let decayed = current * (1.0 - decayRate);
    _clamp(decayed + newEvent * 0.5, 0.0, 1.0)
  };

  // How availability heuristic distorts probability estimate
  // High salience of bad events = overestimate probability of bad outcomes
  public func availabilityBias(
    trueProbability : Float,
    salience        : Float
  ) : Float {
    let bias = salience * 0.3;  // max 30% distortion
    _clamp(trueProbability + bias, 0.0, 1.0)
  };

  // ── Peak-end rule ────────────────────────────────────────────────────
  // Episode remembered by (peak + end) / 2, not average
  public func peakEndReward(
    peakCoherence : Float,
    endCoherence  : Float
  ) : Float {
    (peakCoherence + endCoherence) / 2.0
  };

  public func updatePeakEnd(
    state         : BehavEconState,
    currentCoh    : Float,
    episodeEnded  : Bool
  ) : (Float, Float, Float) {
    // Returns (new peak, new end, new episodeReward)
    let newPeak = Float.max(state.peakCoherence, currentCoh);
    let newEnd  = currentCoh;
    if (episodeEnded) {
      (0.0, currentCoh, peakEndReward(newPeak, currentCoh))
    } else {
      (newPeak, newEnd, state.episodeReward)
    }
  };

  // ── Flow state (challenge-skill balance) ─────────────────────────────
  // Flow zone: challenge ≈ skill (ratio 0.8-1.2)
  // Flow score = 1 - |challenge/skill - 1|^0.5
  public func computeFlowScore(challenge: Float, skill: Float) : Float {
    if (skill <= 0.001) { return 0.0; };
    let ratio = challenge / skill;
    let deviation = Float.abs(ratio - 1.0);
    _clamp(1.0 - _pow(deviation, 0.5), 0.0, 1.0)
  };

  // Flow amplifies minting and learning
  public func flowAmplifier(flowScore: Float) : Float {
    1.0 + flowScore * 0.8  // up to 1.8x at perfect flow
  };

  // Update skill level (increases when challenge slightly exceeds skill)
  public func updateSkillLevel(skill: Float, challenge: Float, flowScore: Float) : Float {
    let growth = if (challenge > skill) {
      (challenge - skill) * 0.01 * flowScore
    } else { 0.0 };
    _clamp(skill + growth, 0.0, 1.0)
  };

  // ── Decision fatigue ───────────────────────────────────────────────────
  // More decisions in a window = higher cognitive load = lower threshold performance
  public func decisionFatigueEffect(
    cogLoad    : Float,
    baseThresh : Float  // normal threshold
  ) : Float {
    // Fatigue raises thresholds (harder to decide)
    baseThresh + cogLoad * 0.15
  };

  // Cognitive load update: increases per decision, recovers over time
  public func updateCogLoad(current: Float, decisionsThisBeat: Nat, recovery: Float) : Float {
    let load = current + Float.fromInt(decisionsThisBeat) * 0.05;
    let rec  = load * recovery;
    _clamp(load - rec, 0.0, 1.0)
  };

  // ── Self-determination theory ────────────────────────────────────────
  // Autonomy: high when organism chooses own actions (low threat)
  // Competence: grows with successful law firing
  // Relatedness: grows with succession/child count
  // Intrinsic motivation = f(autonomy, competence, relatedness)

  public func updateAutonomy(threat: Float, dominance: Float) : Float {
    _clamp(dominance * (1.0 - threat * 0.5), 0.0, 1.0)
  };

  public func updateCompetence(current: Float, lawFired: Nat, coherenceC: Float) : Float {
    let gain = Float.fromInt(lawFired) * 0.002 * coherenceC;
    _clamp(current + gain - 0.001, 0.0, 1.0)  // slow decay
  };

  public func updateRelatedness(childCount: Nat, royaltyInflow: Float) : Float {
    let childFactor   = _clamp(Float.fromInt(childCount) / 100.0, 0.0, 1.0);
    let royaltyFactor = _clamp(royaltyInflow, 0.0, 1.0);
    (childFactor * 0.6 + royaltyFactor * 0.4)
  };

  public func intrinsicMotivation(
    autonomy    : Float,
    competence  : Float,
    relatedness : Float
  ) : Float {
    // Multiplicative: all three needed for peak motivation
    let base = (autonomy + competence + relatedness) / 3.0;
    let synergy = autonomy * competence * relatedness;  // interaction term
    _clamp(base * 0.7 + synergy * 0.3, 0.0, 1.0)
  };

  // ── Mental accounting ─────────────────────────────────────────────────
  // Each account tracked separately, losses in one don’t offset gains in another
  public func updateMintingAccount(
    current     : Float,
    mintRate    : Float,
    refPoint    : Float
  ) : Float {
    let delta = mintRate - refPoint;
    let value = prospectValueFull(delta, 1.0, 2.25);
    _clamp(current + value * 0.01, 0.0, 2.0)
  };

  // ── Present bias (k parameter dynamics) ─────────────────────────────
  // k starts high (high present bias), decays as curriculumLevel grows
  // k(L) = k0 / (1 + L * 0.1)
  public func presentBiasK(curriculumLevel: Nat) : Float {
    let k0 : Float = 0.5;
    k0 / (1.0 + Float.fromInt(curriculumLevel) * 0.1)
  };

  // ── Full behavioral econ beat ───────────────────────────────────────
  public func beatBehavEcon(state: BehavEconState, inp: BehavInput) : BehavEconState {
    // Anchor setting (first beat only)
    let newRefBTC = if (not state.anchorSet) { inp.btcPrice } else { state.refPointBTC };
    let newRefETH = if (not state.anchorSet) { inp.ethPrice } else { state.refPointETH };
    let newRefICP = if (not state.anchorSet) { inp.icpPrice } else { state.refPointICP };

    // Salience (bad events = high threat or coherence collapse)
    let newEvent   = if (inp.coherenceC < 0.3 or inp.threat > 0.8) { 0.8 } else { 0.0 };
    let newSalience = updateSalience(state.recentSalienceScore, newEvent, 0.05);

    // Peak-end
    let episodeEnded = inp.beatNum % 144 == 0; // 144-beat episodes
    let (newPeak, newEnd, newEpisodeReward) =
      updatePeakEnd(state, inp.coherenceC, episodeEnded);

    // Flow state
    let challengeLevel = inp.threat * 0.5 + (1.0 - inp.coherenceC) * 0.3 + inp.mintRate * 0.2;
    let newSkill       = updateSkillLevel(state.skillLevel, challengeLevel, state.flowScore);
    let newFlow        = computeFlowScore(challengeLevel, newSkill);

    // Decision fatigue
    let decisionsThisBeat = if (inp.lawFired > 0) { 1 } else { 0 };
    let newCogLoad = updateCogLoad(state.cognitiveLoad, decisionsThisBeat, 0.05);

    // Self-determination
    let newAutonomy    = updateAutonomy(inp.threat, 0.5 + inp.coherenceC * 0.5);
    let newCompetence  = updateCompetence(state.competenceScore, inp.lawFired, inp.coherenceC);
    let newRelatedness = updateRelatedness(inp.childCount, inp.royaltyInflow);
    let newIM          = intrinsicMotivation(newAutonomy, newCompetence, newRelatedness);

    // Mental accounting
    let newMintAcc     = updateMintingAccount(state.mintingAccount, inp.mintRate, 0.5);
    let newSuccAcc     = _clamp(state.successionAccount + inp.royaltyInflow * 0.01, 0.0, 2.0);
    let newSecAcc      = _clamp(state.securityAccount + (1.0 - inp.threat) * 0.002 - inp.threat * 0.005, 0.0, 2.0);

    // Present bias
    let newK = presentBiasK(state.curriculumLevel);

    {
      refPointBTC         = newRefBTC;
      refPointETH         = newRefETH;
      refPointICP         = newRefICP;
      gainSensitivity     = state.gainSensitivity;
      lossSensitivity     = state.lossSensitivity;
      recentSalienceScore = newSalience;
      anchorSet           = true;
      peakCoherence       = newPeak;
      endCoherence        = newEnd;
      episodeReward       = newEpisodeReward;
      episodeCount        = if episodeEnded { state.episodeCount + 1 } else { state.episodeCount };
      flowScore           = newFlow;
      skillLevel          = newSkill;
      challengeLevel      = challengeLevel;
      decisionCount       = decisionsThisBeat;
      cognitiveLoad       = newCogLoad;
      autonomyScore       = newAutonomy;
      competenceScore     = newCompetence;
      relatednessScore    = newRelatedness;
      intrinsicMotivation = newIM;
      presentBias         = newK;
      curriculumLevel     = state.curriculumLevel;
      mintingAccount      = newMintAcc;
      successionAccount   = newSuccAcc;
      securityAccount     = newSecAcc;
    }
  };

  // ── Behavioral modifier to minting ────────────────────────────────────
  // Flow + intrinsic motivation + low fatigue = minting multiplier
  public func behavMintMod(state: BehavEconState) : Float {
    let flowBoost = flowAmplifier(state.flowScore);
    let motivBoost = 0.8 + state.intrinsicMotivation * 0.4;
    let fatigueHit = 1.0 - state.cognitiveLoad * 0.3;
    _clamp(flowBoost * motivBoost * fatigueHit, 0.5, 2.5)
  };

  private func _clamp(x: Float, lo: Float, hi: Float) : Float {
    if (x < lo) lo else if (x > hi) hi else x
  };
  private func _pow(b: Float, e: Float) : Float {
    if (b <= 0.0) 0.0 else Float.exp(e * Float.log(b))
  };
}
