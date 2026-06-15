// NEUROEMERGENCE CORE — REINFORCEMENT LEARNING ENGINE
// Q-learning, Thompson sampling, Prospect Theory, hyperbolic discounting
// Goal hierarchy, satisficing/maximizing, commitment devices
// Owner: Alfredo Medina Hernandez | MedinaSITech@outlook.com

module {

  // 8 available actions the organism can take
  public type Action = {
    #MaximizeMinting;     // 0: optimize for maximum token output
    #MaximizeCoherence;   // 1: optimize for maximum coherence
    #MaximizeLearning;    // 2: optimize Hebbian learning
    #DefendSovereign;     // 3: protect doctrine, engage security
    #ExpandNetwork;       // 4: grow succession/child organisms
    #HarvestArbitrage;    // 5: engage SHARK, exploit market spread
    #ConserveEnergy;      // 6: reduce FORMA spend, accumulate
    #ExecuteOmnis;        // 7: attempt OMNIS trigger
  };

  let ACTION_COUNT : Nat = 8;

  // Q-table: 8 actions, Q-value per action
  // Sovereign floor: Q never drops below floor (permanence)
  public type QTable = {
    q         : [Float];    // 8 Q-values
    n         : [Nat];      // visit counts per action
    alpha_arr : [Float];    // per-action learning rates (decay with n)
  };

  // RL input (state features)
  public type RLInput = {
    coherenceC    : Float;
    mintRate      : Float;
    formaBalance  : Float;
    threat        : Float;
    royaltyInflow : Float;
    lawFired      : Nat;
    marketTrend   : Float;
    btcPrice      : Float;
    hObs          : Float;
    lastAction    : Nat;    // 0-7
    lastReward    : Float;
  };

  // ── Reward function ───────────────────────────────────────────────────
  // R = ΔmintRate * 0.4 + Δcoherence * 0.3 + Δforma * 0.2 + Δroyalty * 0.1
  public func computeReward(
    mintDelta    : Float,
    cohDelta     : Float,
    formaDelta   : Float,
    royaltyDelta : Float
  ) : Float {
    mintDelta * 0.4 + cohDelta * 0.3 + formaDelta * 0.2 + royaltyDelta * 0.1
  };

  // ── Prospect Theory weighting ─────────────────────────────────────────
  // Losses weighted 2.25x more than gains
  // v(x) = x if x >= 0, -2.25 * |x| if x < 0
  public func prospectValue(reward: Float) : Float {
    if (reward >= 0.0) { reward }
    else { reward * 2.25 }
  };

  // Probability weighting function (Kahneman-Tversky)
  // w(p) = p^0.69 / (p^0.69 + (1-p)^0.69)^(1/0.69)
  public func probabilityWeight(p: Float) : Float {
    if (p <= 0.0) { return 0.0; };
    if (p >= 1.0) { return 1.0; };
    let gamma : Float = 0.69;
    let pg = _pow(p, gamma);
    let q  = 1.0 - p;
    let qg = _pow(q, gamma);
    pg / _pow(pg + qg, 1.0 / gamma)
  };

  // ── Hyperbolic discounting ─────────────────────────────────────────────
  // V(t) = reward / (1 + k * t)
  // k decreases as curriculumLevel increases (less present-biased with maturity)
  public func hyperbolicDiscount(reward: Float, delay: Float, k: Float) : Float {
    reward / (1.0 + k * delay)
  };

  // ── Q-value update (Q-learning) ───────────────────────────────────────
  // Q(s,a) = Q(s,a) + alpha * [R + gamma * max_Q(s') - Q(s,a)]
  let GAMMA       : Float = 0.95;  // discount factor
  let Q_FLOOR     : Float = 0.01;  // sovereign floor: Q never drops below this

  public func qUpdate(
    q       : Float,
    reward  : Float,
    maxQNext: Float,
    alpha   : Float
  ) : Float {
    let target  = prospectValue(reward) + GAMMA * maxQNext;
    let updated = q + alpha * (target - q);
    Float.max(Q_FLOOR, updated)
  };

  // ── Per-action learning rate (decreases with visit count) ──────────────
  public func adaptiveLR(n: Nat) : Float {
    0.1 / (1.0 + Float.fromInt(n) * 0.01)
  };

  // ── Thompson sampling action selection ───────────────────────────────
  // Sample from Beta(alpha_a, beta_a) per action
  // Approximated as: sample = Q[a] + noise * sqrt(1 / n[a])
  // Returns action index with highest sample
  public func thompsonSelect(qt: QTable, noise: Float) : Nat {
    var bestA  : Nat   = 0;
    var bestV  : Float = -999.0;
    for (a in Iter.range(0, ACTION_COUNT - 1)) {
      let uncertainty = if (qt.n[a] > 0) {
        1.0 / _sqrt(Float.fromInt(qt.n[a]))
      } else { 1.0 };
      let sample = qt.q[a] + noise * uncertainty;
      if (sample > bestV) { bestV := sample; bestA := a; };
    };
    bestA
  };

  // ── Epsilon-greedy selection ────────────────────────────────────────────
  public func bestAction(qt: QTable) : Nat {
    var bestA : Nat   = 0;
    var bestQ : Float = qt.q[0];
    for (a in Iter.range(1, ACTION_COUNT - 1)) {
      if (qt.q[a] > bestQ) { bestQ := qt.q[a]; bestA := a; };
    };
    bestA
  };

  // ── Q-table update after taking action ───────────────────────────────
  public func updateQTable(
    qt      : QTable,
    action  : Nat,
    reward  : Float
  ) : QTable {
    let newQ = Array.init<Float>(ACTION_COUNT, 0.0);
    let newN = Array.init<Nat>(ACTION_COUNT, 0);
    let newA = Array.init<Float>(ACTION_COUNT, 0.0);
    for (a in Iter.range(0, ACTION_COUNT - 1)) {
      newQ[a] := qt.q[a];
      newN[a] := qt.n[a];
      newA[a] := qt.alpha_arr[a];
    };
    // Find max Q for next state (use current Q as proxy)
    var maxQNext : Float = 0.0;
    for (a in Iter.range(0, ACTION_COUNT - 1)) {
      if (newQ[a] > maxQNext) { maxQNext := newQ[a]; };
    };
    let alpha    = adaptiveLR(newN[action]);
    newQ[action] := qUpdate(newQ[action], reward, maxQNext, alpha);
    newN[action] += 1;
    newA[action] := alpha;
    {
      q         = Array.freeze(newQ);
      n         = Array.freeze(newN);
      alpha_arr = Array.freeze(newA);
    }
  };

  // ── Goal hierarchy ──────────────────────────────────────────────────────
  // Override RL action selection when critical goals are not met
  // Goals in priority order: 1. Sovereignty, 2. Coherence, 3. Minting
  public func goalHierarchyOverride(inp: RLInput, chosen: Nat) : Nat {
    // If under threat, always defend
    if (inp.threat > 0.75) { return 3; }; // #DefendSovereign
    // If coherence collapsing, maximize coherence
    if (inp.coherenceC < 0.35) { return 1; }; // #MaximizeCoherence
    // If FORMA critically low, conserve
    if (inp.formaBalance < 10.0) { return 6; }; // #ConserveEnergy
    // Otherwise use RL choice
    chosen
  };

  // ── Satisficing: accept first action above satisfaction threshold ───────
  let SATISFACTION_THRESHOLD : Float = 0.65;
  public func satisficeAction(qt: QTable) : Nat {
    for (a in Iter.range(0, ACTION_COUNT - 1)) {
      if (qt.q[a] >= SATISFACTION_THRESHOLD) { return a; };
    };
    bestAction(qt) // fallback to maximizing
  };

  // ── Pathway reinforcement (on top of Hebbian) ──────────────────────────
  // Pathways that led to positive rewards get extra Hebbian boost
  // Returns a multiplier on HELIX_ALPHA for the active shell
  public func pathwayBoost(reward: Float, shellIndex: Nat) : Float {
    if (reward > 0.0) {
      1.0 + reward * 0.5 * (Float.fromInt(shellIndex + 1) / 11.0)
    } else {
      // Punishment: reduce weight on losing paths
      Float.max(0.1, 1.0 + reward * 2.25 * 0.3)
    }
  };

  // ── Curiosity bonus (intrinsic motivation) ────────────────────────────
  // Bonus for visiting rarely-taken actions (exploration drive)
  public func curiosityBonus(n: Nat, totalN: Nat) : Float {
    if (totalN == 0) { return 0.5; };
    let fraction = Float.fromInt(n) / Float.fromInt(totalN);
    _clamp(0.3 * (1.0 - fraction), 0.0, 0.5)
  };

  // ── Commitment device ──────────────────────────────────────────────────
  // Once committed to an action for N beats, continue despite lower Q
  public func commitmentCheck(
    committedAction  : Nat,
    committedBeats   : Nat,
    maxCommitBeats   : Nat,
    chosenAction     : Nat
  ) : Nat {
    if (committedBeats < maxCommitBeats) { committedAction }
    else { chosenAction }
  };

  private func _clamp(x: Float, lo: Float, hi: Float) : Float {
    if (x < lo) lo else if (x > hi) hi else x
  };
  private func _sqrt(x: Float) : Float {
    if (x <= 0.0) 0.0 else Float.sqrt(x)
  };
  private func _pow(b: Float, e: Float) : Float {
    if (b <= 0.0) 0.0 else Float.exp(e * Float.log(b))
  };
}
