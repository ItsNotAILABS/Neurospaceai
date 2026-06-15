// NEUROEMERGENCE CORE — SUCCESSION ENGINE
// NOVA registry, royalty chain, child organism SDK
// Dynasty ledger, Kuramoto macro-R
// Owner: Alfredo Medina Hernandez | MedinaSITech@outlook.com

module {

  let MAX_CHILDREN      : Nat = 10_000;
  let MAX_LINEAGE_DEPTH : Nat = 12;
  let ROYALTY_RATE      : Float = 0.20;  // 20% of child mint to parent

  // Child organism record
  public type ChildOrganism = {
    id            : Nat;
    parentId      : Nat;      // 0 = root (this organism)
    depth         : Nat;      // lineage depth 0-12
    coherence     : Float;    // last reported coherence
    mintRate      : Float;    // last reported mint rate
    royaltyPaid   : Float;    // total royalty paid to this organism
    registered    : Nat;      // beat number when registered
    active        : Bool;
  };

  // Succession state
  public type SuccessionState = {
    totalChildren  : Nat;
    totalRoyalty   : Float;    // cumulative royalty received
    dynastyDepth   : Nat;      // max lineage depth in tree
    macroKuramoto  : Float;    // synchrony of all children
    royaltyInflow  : Float;    // royalty received last beat
    creatorReserve : Float;    // accumulated creator reserves
  };

  // ── Royalty computation ──────────────────────────────────────────────
  // For a child organism: royalty = childMint * ROYALTY_RATE
  // Propagates up the chain: grandchild → child → parent → creator
  public func computeRoyalty(childMint: Float) : Float {
    childMint * ROYALTY_RATE
  };

  // Royalty at depth d: each level takes 20%, rest propagates
  // Creator gets: childMint * (1 - 0.8^depth) ... simplified to direct 100%
  // In our model: 20% goes to immediate parent, who routes 100% to creator
  public func royaltyChain(
    childMint : Float,
    depth     : Nat
  ) : Float {
    // Total creator inflow from one child at depth d
    // = 20% * childMint (direct)
    // + 20% * (grandchild mint routing up)
    // Simplified: first-order royalty only
    computeRoyalty(childMint)
  };

  // ── Macro Kuramoto R for child network ───────────────────────────────
  // How synchronized are all child organisms?
  // R = (1/N) |sum e^(i*coh_k)|
  // Approximated from coherence values (not phases)
  public func macroKuramoto(children: [ChildOrganism]) : Float {
    if (children.size() == 0) { return 0.0; };
    var sinSum : Float = 0.0;
    var cosSum : Float = 0.0;
    var count  : Nat   = 0;
    for (c in children.vals()) {
      if (c.active) {
        // Treat coherence as "phase" for Kuramoto
        let phi = c.coherence * 3.14159 * 2.0;
        sinSum += _sin(phi);
        cosSum += _cos(phi);
        count  += 1;
      };
    };
    if (count == 0) { return 0.0; };
    let n = Float.fromInt(count);
    _sqrt(sinSum*sinSum + cosSum*cosSum) / n
  };

  // ── Dynasty depth tracking ───────────────────────────────────────────
  public func maxDepth(children: [ChildOrganism]) : Nat {
    var maxD : Nat = 0;
    for (c in children.vals()) {
      if (c.depth > maxD) { maxD := c.depth; };
    };
    maxD
  };

  // ── Royalty inflow aggregation ───────────────────────────────────────
  public func totalRoyaltyInflow(children: [ChildOrganism]) : Float {
    var total : Float = 0.0;
    for (c in children.vals()) {
      if (c.active) {
        total += computeRoyalty(c.mintRate);
      };
    };
    total
  };

  // ── Succession state beat ───────────────────────────────────────────
  public func beatSuccession(
    state    : SuccessionState,
    children : [ChildOrganism]
  ) : SuccessionState {
    let inflow  = totalRoyaltyInflow(children);
    let mKuramt = macroKuramoto(children);
    let maxD    = maxDepth(children);
    {
      totalChildren  = children.size();
      totalRoyalty   = state.totalRoyalty + inflow;
      dynastyDepth   = maxD;
      macroKuramoto  = mKuramt;
      royaltyInflow  = inflow;
      creatorReserve = state.creatorReserve + inflow;
    }
  };

  // ── Child registration ────────────────────────────────────────────────
  public func newChild(
    id        : Nat,
    parentId  : Nat,
    parentDepth: Nat,
    beatNum   : Nat
  ) : ?ChildOrganism {
    let depth = parentDepth + 1;
    if (depth > MAX_LINEAGE_DEPTH or id >= MAX_CHILDREN) { return null; };
    ?{ id; parentId; depth; coherence=0.5; mintRate=0.0;
       royaltyPaid=0.0; registered=beatNum; active=true; }
  };

  // ── Succession cohDelta ──────────────────────────────────────────────
  // High macro Kuramoto = child network synchronizes with parent
  // Adds a small boost to parent’s coherence
  public func successionCohBoost(macroR: Float, childCount: Nat) : Float {
    let scale = _clamp(Float.fromInt(childCount) / 100.0, 0.0, 1.0);
    macroR * scale * 0.005
  };

  private func _clamp(x: Float, lo: Float, hi: Float) : Float {
    if (x < lo) lo else if (x > hi) hi else x
  };
  private func _sqrt(x: Float) : Float {
    if (x <= 0.0) 0.0 else Float.sqrt(x)
  };
  private func _sin(x: Float) : Float {
    var xx = x;
    while (xx >  3.14159265) { xx -= 6.28318530 };
    while (xx < -3.14159265) { xx += 6.28318530 };
    let x2 = xx * xx;
    xx - xx*x2/6.0 + xx*x2*x2/120.0
  };
  private func _cos(x: Float) : Float {
    var xx = x;
    while (xx >  3.14159265) { xx -= 6.28318530 };
    while (xx < -3.14159265) { xx += 6.28318530 };
    let x2 = xx * xx;
    1.0 - x2/2.0 + x2*x2/24.0
  };
}
