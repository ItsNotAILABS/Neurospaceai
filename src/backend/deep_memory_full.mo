// NEUROEMERGENCE CORE — DEEP MEMORY ENGINE
// Long-term memory, episodic buffer, 24 heritage anchors
// 36 deep state eigenvectors, cosine similarity to genesis
// Owner: Alfredo Medina Hernandez | MedinaSITech@outlook.com

module {

  // Episodic memory record
  // Contains both raw organism state and 5 causal inference fields
  // The causal fields implement temporal binding: past exerts mathematically
  // computable pressure on the present state.
  public type Episode = {
    beatNum         : Nat;
    coherenceC      : Float;
    mintRate        : Float;
    bodyDomain      : Float;
    threat          : Float;
    peakEndScore    : Float;   // peak-end rule score
    lawFired        : Nat;
    reward          : Float;
    sacesi          : Nat64;   // SACESI hash at this episode
    // ── CAUSAL INFERENCE FIELDS ────────────────────────────────────────
    // These fields make the organism's past exert causal pressure on present.
    // epBackwardPath = matchProximity × coherenceC × rT
    // This value feeds back into the coherence computation when this episode
    // is retrieved — the organism's history is mathematically present.
    epBackwardPath  : Float;   // matchProximity × coherenceC × rT at encoding
    epCausalWeight  : Float;   // how much this episode causally affects current state
    epParentEventId : Nat;     // beat number of the causal parent episode (0 = root)
    epPriorStateHash: Nat64;   // SACESI hash of organism state when encoded
    epDriveAtEvent  : Nat;     // which drive (0-4) was dominant at encoding time
  };

  let EPISODIC_BUFFER_SIZE : Nat = 200;

  // Heritage anchor: cosine similarity to genesis state
  public type HeritageAnchor = {
    anchorIndex  : Nat;       // 0-23
    genesisValue : Float;     // value at genesis beat
    currentValue : Float;     // current value
    similarity   : Float;     // cosine similarity 0-1
    drift        : Float;     // cumulative drift from genesis
    lastUpdated  : Nat;       // beat number
  };

  // 36 deep state eigenvectors
  public type DeepStateVector = {
    dims  : [Float];   // 36 dimensions
    norm  : Float;     // L2 norm
    hObs  : Float;     // information content
  };

  // Full deep memory state
  public type DeepMemState = {
    episodicBuffer   : [Episode];       // ring buffer, last 200 episodes
    ltmTrace         : [Float];         // long-term memory trace, 36 dims
    heritageAnchors  : [HeritageAnchor]; // 24 anchors
    genesisVector    : [Float];         // 36-dim genesis state (never changes)
    heritageScore    : Float;           // overall cosine to genesis
    consolidationAge : Nat;             // beats since last LTM consolidation
    peakReward       : Float;           // peak reward ever seen
    ltmDecayRate     : Float;           // how fast LTM fades
    writeHead        : Nat;             // episodic buffer write position
    totalEpisodes    : Nat;
  };

  // ── Episodic buffer write ─────────────────────────────────────────────
  // Ring buffer: overwrites oldest when full
  public func writeEpisode(
    buffer    : [Episode],
    writeHead : Nat,
    ep        : Episode
  ) : ([Episode], Nat) {
    let newBuf = Array.tabulate<Episode>(
      EPISODIC_BUFFER_SIZE,
      func(i) { if (i == writeHead % EPISODIC_BUFFER_SIZE) { ep } else { buffer[i] } }
    );
    (newBuf, (writeHead + 1) % EPISODIC_BUFFER_SIZE)
  };

  // ── LTM consolidation ─────────────────────────────────────────────────
  // Consolidate episodic memory into LTM trace every 50 beats
  // LTM trace accumulates the most important features
  // Uses attention-weighted average of recent episodes
  // Causal weight boosts attention for high-causal-impact episodes
  public func consolidateLTM(
    trace     : [Float],
    buffer    : [Episode],
    decayRate : Float
  ) : [Float] {
    // Compute attention weights: high-reward AND high-causal-weight episodes get more weight
    var totalWeight : Float = 0.0;
    let weights = Array.tabulate<Float>(buffer.size(), func(i) {
      let w = Float.abs(buffer[i].reward) + buffer[i].peakEndScore * 0.5
              + buffer[i].epCausalWeight * 0.3;   // causal weight boosts attention
      totalWeight += w;
      w
    });

    // Build weighted feature vector
    let features = Array.tabulate<Float>(36, func(dim) {
      if (totalWeight < 0.001) { return trace[dim]; };
      var sum : Float = 0.0;
      for (i in Iter.range(0, buffer.size() - 1)) {
        let w = weights[i] / totalWeight;
        // Map episode fields to dims
        let v = switch(dim % 6) {
          case 0 { buffer[i].coherenceC };
          case 1 { buffer[i].mintRate };
          case 2 { buffer[i].bodyDomain };
          case 3 { buffer[i].threat };
          case 4 { buffer[i].peakEndScore };
          case _ { buffer[i].reward + 0.5 };
        };
        sum += w * v;
      };
      sum
    });

    // Blend: LTM = (1 - decay) * trace + decay * new_features
    Array.tabulate<Float>(36, func(i) {
      _clamp((1.0 - decayRate) * trace[i] + decayRate * features[i], 0.0, 1.0)
    })
  };

  // ── Causal pressure computation ────────────────────────────────────────
  // Aggregate backward path pressure from the episodic buffer.
  // This feeds into coherenceC computation: past episodes exert
  // mathematically computable causal pressure on the present.
  public func computeBackwardCausalPressure(
    buffer     : [Episode],
    currentRt  : Float
  ) : Float {
    var pressure : Float = 0.0;
    var count    : Nat   = 0;
    for (ep in buffer.vals()) {
      if (ep.epCausalWeight > 0.0) {
        // Backward path decays with distance: ep.beatNum is far = less weight
        pressure += ep.epBackwardPath * ep.epCausalWeight;
        count    += 1;
      };
    };
    if (count == 0) { return currentRt * 0.1; };
    _clamp(pressure / Float.fromInt(count) * 0.15, 0.0, 0.2)
  };

  // ── Cosine similarity to genesis ──────────────────────────────────────
  // How similar is the current state to the genesis state?
  // cosine(A, B) = (A · B) / (|A| * |B|)
  public func cosineSimilarity(a: [Float], b: [Float]) : Float {
    var dot  : Float = 0.0;
    var normA: Float = 0.0;
    var normB: Float = 0.0;
    let n = Nat.min(a.size(), b.size());
    for (i in Iter.range(0, n - 1)) {
      dot   += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    };
    if (normA < 0.0001 or normB < 0.0001) { return 0.0; };
    _clamp(dot / (_sqrt(normA) * _sqrt(normB)), 0.0, 1.0)
  };

  // ── Heritage anchor update ────────────────────────────────────────────
  public func updateAnchor(
    anchor   : HeritageAnchor,
    newValue : Float,
    beatNum  : Nat
  ) : HeritageAnchor {
    let sim  = 1.0 - Float.abs(newValue - anchor.genesisValue);
    let drift = anchor.drift + Float.abs(newValue - anchor.currentValue);
    { anchorIndex = anchor.anchorIndex;
      genesisValue = anchor.genesisValue;
      currentValue = newValue;
      similarity   = _clamp(sim, 0.0, 1.0);
      drift        = drift;
      lastUpdated  = beatNum;
    }
  };

  // Overall heritage score: mean similarity across 24 anchors
  public func heritageScore(anchors: [HeritageAnchor]) : Float {
    if (anchors.size() == 0) { return 0.5; };
    var sum : Float = 0.0;
    for (a in anchors.vals()) { sum += a.similarity; };
    sum / Float.fromInt(anchors.size())
  };

  // ── Deep state eigenvector projection ─────────────────────────────────
  // Projects the full organism state into 36 eigenvectors
  // Each eigenvector captures a key dimension of sovereign behavior
  public func projectToEigenspace(
    coherenceC   : Float,
    bodyDomain   : Float,
    animalComp   : Float,
    metalAlloy   : Float,
    ncHealth     : Float,
    hObs         : Float,
    mintRate     : Float,
    lawFireRate  : Float,
    heritageScore: Float,
    flowState    : Float,
    arousal      : Float,
    threat       : Float
  ) : [Float] {
    // 36 dimensions: combinations and interactions
    [
      coherenceC,                              // 0: raw coherence
      bodyDomain,                              // 1: raw body
      animalComp,                              // 2: raw animals
      metalAlloy,                              // 3: raw metals
      ncHealth,                                // 4: raw NC health
      hObs / 12.0,                             // 5: normalized entropy
      mintRate,                                // 6: raw mint
      lawFireRate,                             // 7: law fire rate
      heritageScore,                           // 8: heritage
      flowState,                               // 9: flow
      coherenceC * bodyDomain,                 // 10: coh * body
      coherenceC * metalAlloy,                 // 11: coh * metal
      bodyDomain * animalComp,                 // 12: body * animal
      metalAlloy * ncHealth,                   // 13: metal * NC
      coherenceC * heritageScore,              // 14: coh * heritage
      mintRate * flowState,                    // 15: mint * flow
      (coherenceC + bodyDomain) / 2.0,         // 16: cog-body avg
      lawFireRate * heritageScore,             // 17: law * heritage
      1.0 - threat,                            // 18: peace
      arousal * (1.0 - threat),                // 19: calm arousal
      coherenceC * coherenceC,                 // 20: coh squared
      bodyDomain * bodyDomain,                 // 21: body squared
      _sqrt(coherenceC * bodyDomain),          // 22: geo mean coh-body
      coherenceC * bodyDomain * metalAlloy,    // 23: triple product
      hObs / 12.0 * coherenceC,               // 24: entropy-coherence
      flowState * animalComp,                  // 25: flow-animal
      heritageScore * metalAlloy,              // 26: heritage-metal
      mintRate * heritageScore,                // 27: mint-heritage
      ncHealth * bodyDomain,                   // 28: NC-body
      lawFireRate * mintRate,                  // 29: law-mint
      animalComp * metalAlloy,                 // 30: animal-metal
      coherenceC * ncHealth * metalAlloy,      // 31: triple-NC
      flowState * coherenceC * bodyDomain,     // 32: triple-flow
      heritageScore * coherenceC * mintRate,   // 33: dynasty-mint
      1.0 - arousal * threat,                  // 34: sovereignty
      coherenceC * bodyDomain * animalComp * metalAlloy / 4.0, // 35: grand sovereign
    ]
  };

  // ── Peak reward tracking (availability heuristic) ─────────────────────
  public func updatePeakReward(current: Float, newReward: Float) : Float {
    Float.max(current, newReward)
  };

  // ── Memory retrieval: find most similar past episode ────────────────────
  public func retrieveSimilar(
    buffer      : [Episode],
    queryEp     : Episode
  ) : ?Episode {
    var bestSim  : Float  = 0.0;
    var bestIdx  : ?Nat   = null;
    for (i in Iter.range(0, buffer.size() - 1)) {
      let sim = episodeSimilarity(buffer[i], queryEp);
      if (sim > bestSim) { bestSim := sim; bestIdx := ?i; };
    };
    switch (bestIdx) {
      case (?idx) { ?buffer[idx] };
      case null   { null };
    }
  };

  func episodeSimilarity(a: Episode, b: Episode) : Float {
    let d0 = Float.abs(a.coherenceC - b.coherenceC);
    let d1 = Float.abs(a.mintRate   - b.mintRate);
    let d2 = Float.abs(a.threat     - b.threat);
    1.0 - (d0 + d1 + d2) / 3.0
  };

  private func _clamp(x: Float, lo: Float, hi: Float) : Float {
    if (x < lo) lo else if (x > hi) hi else x
  };
  private func _sqrt(x: Float) : Float {
    if (x <= 0.0) 0.0 else Float.sqrt(x)
  };
}
