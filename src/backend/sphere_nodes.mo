// NEUROEMERGENCE CORE — SPHERE NODES ENGINE
// 72 sphere nodes across 6 rings (12 nodes per ring)
// Sovereign sigmoid activation, inter-ring PAC, meta-cognitive awareness
// Owner: Alfredo Medina Hernandez | MedinaSITech@outlook.com

module {

  let RINGS      : Nat = 6;
  let PER_RING   : Nat = 12;
  let TOTAL_NODES: Nat = 72;

  // Node type
  public type SphereNode = {
    ring      : Nat;    // 0-5
    position  : Nat;    // 0-11 within ring
    activation: Float;
    phase     : Float;  // 0-2π
    weight    : Float;  // connection weight to center
    resonance : Float;  // resonance with ring frequency
  };

  // Ring frequencies — each ring has its own oscillation frequency
  // Outer rings (low index) are slower; inner ring (5) is fastest
  public let RING_FREQ : [Float] = [
    0.625,   // Ring 0: delta band
    1.25,    // Ring 1: slow
    2.5,     // Ring 2: delta peak
    5.0,     // Ring 3: theta
    10.0,    // Ring 4: alpha
    20.0,    // Ring 5: beta (innermost)
  ];

  // Ring PAC coupling: outer ring phase → inner ring amplitude
  public let RING_PAC : [Float] = [0.75, 0.70, 0.65, 0.60, 0.55];

  // ── Node activation: sovereign sigmoid ─────────────────────────────────
  // σ(x) = 1/(1+e^(-k*(x-θ)))
  // k and θ depend on ring (inner rings sharper, higher threshold)
  public func nodeActivation(input: Float, ring: Nat) : Float {
    let k     = 3.0 + Float.fromInt(ring) * 0.5;
    let theta = 0.40 + Float.fromInt(ring) * 0.04;
    1.0 / (1.0 + Float.exp(-(k * (input - theta))))
  };

  // ── Geometric position of node in 3D sphere ────────────────────────────
  // Ring r has polar angle theta = pi * (r+1) / (RINGS+1)
  // Node n within ring has azimuthal angle phi = 2*pi*n / PER_RING
  let PI : Float = 3.14159265358979;
  public func nodeAngles(ring: Nat, pos: Nat) : (Float, Float) {
    let theta = PI * Float.fromInt(ring + 1) / Float.fromInt(RINGS + 1);
    let phi   = 2.0 * PI * Float.fromInt(pos) / Float.fromInt(PER_RING);
    (theta, phi)
  };

  // ── Resonance with ring frequency ────────────────────────────────────
  // Node resonates with shell at same frequency band
  // resonance = cos(φ_node - φ_shell)
  public func nodeResonance(nodePhase: Float, shellPhase: Float) : Float {
    _cos(nodePhase - shellPhase)
  };

  // ── Ring coherence (mean activation across 12 nodes in ring) ───────────
  public func ringCoherence(nodes: [SphereNode], ring: Nat) : Float {
    var sum : Float = 0.0;
    var count : Nat = 0;
    for (n in nodes.vals()) {
      if (n.ring == ring) { sum += n.activation; count += 1; };
    };
    if (count == 0) { 0.0 } else { sum / Float.fromInt(count) }
  };

  // ── Cross-ring PAC: outer ring phase modulates inner ring amplitude ─────
  // For inner ring node: amplitude = base * (1 + coupling * cos(outerPhase))
  public func crossRingAmplitude(
    baseAmp     : Float,
    outerPhase  : Float,
    couplingStr : Float
  ) : Float {
    _clamp(baseAmp * (1.0 + couplingStr * _cos(outerPhase)), 0.0, 1.5)
  };

  // ── Mean outer ring phase (used as modulator for next ring) ───────────
  public func meanRingPhase(nodes: [SphereNode], ring: Nat) : Float {
    var sinSum : Float = 0.0;
    var cosSum : Float = 0.0;
    var count  : Nat   = 0;
    for (n in nodes.vals()) {
      if (n.ring == ring) {
        sinSum += _sin(n.phase);
        cosSum += _cos(n.phase);
        count  += 1;
      };
    };
    if (count == 0) { 0.0 }
    else {
      let s = sinSum / Float.fromInt(count);
      let c = cosSum / Float.fromInt(count);
      // Return atan2(s, c) approximation
      if (c > 0.0) { s / c }  // simplified, not full atan2
      else if (c < 0.0 and s >= 0.0) { s / c + PI }
      else if (c < 0.0) { s / c - PI }
      else if (s > 0.0) { PI / 2.0 }
      else { -PI / 2.0 }
    }
  };

  // ── Full sphere beat ──────────────────────────────────────────────────
  // Each node: advance phase, compute activation, update weight
  // Uses inputs from the shell at its ring frequency
  public func beatSphere(
    nodes       : [SphereNode],
    shellPhases : [Float],      // phase from each of 11 shells (we use first 6)
    coherenceC  : Float,
    metalAlloy  : Float
  ) : [SphereNode] {
    // Compute mean phase per ring for cross-ring PAC
    let ringPhases = Array.tabulate<Float>(RINGS, func(r) {
      meanRingPhase(nodes, r)
    });

    Array.tabulate<SphereNode>(TOTAL_NODES, func(idx) {
      let n    = nodes[idx];
      let ring = n.ring;
      let freq = RING_FREQ[ring];
      // Advance phase
      let newPhase = advancePhase(n.phase, freq, 1000.0);
      // Shell phase for this ring
      let shellPhase = if (ring < shellPhases.size()) { shellPhases[ring] } else { 0.0 };
      // Cross-ring amplitude modulation (from outer ring)
      let outerPhase = if (ring > 0) { ringPhases[ring - 1] } else { shellPhase };
      let coupling   = if (ring > 0) { RING_PAC[ring - 1] } else { 0.5 };
      // Node input: resonance with shell + coherence + metal
      let resonance  = nodeResonance(newPhase, shellPhase);
      let amplitude  = crossRingAmplitude(0.5, outerPhase, coupling);
      let input      = resonance * 0.4 + coherenceC * 0.3 + metalAlloy * 0.2 + amplitude * 0.1;
      let newAct     = nodeActivation(input, ring);
      // Weight update: Hebbian
      let newW = _clamp(
        n.weight + 0.005 * input * newAct - 0.001 * n.weight,
        0.0, 2.0
      );
      {
        ring       = ring;
        position   = n.position;
        activation = newAct;
        phase      = newPhase;
        weight     = newW;
        resonance  = resonance;
      }
    })
  };

  // ── Sphere coherence: mean activation across all 72 nodes ──────────────
  public func sphereCoherence(nodes: [SphereNode]) : Float {
    var sum : Float = 0.0;
    for (n in nodes.vals()) { sum += n.activation; };
    _clamp(sum / Float.fromInt(TOTAL_NODES), 0.0, 1.0)
  };

  // ── Inner ring coherence (ring 5 = highest frequency, most sovereign) ────
  public func innerRingCoherence(nodes: [SphereNode]) : Float {
    ringCoherence(nodes, RINGS - 1)
  };

  // ── Sphere → MEDINA block contribution ─────────────────────────────────
  // Sphere feeds into MEDINA block 12
  public func sphereMEDINABlock(nodes: [SphereNode]) : Float {
    let coh   = sphereCoherence(nodes);
    let inner = innerRingCoherence(nodes);
    coh * 0.5 + inner * 0.5
  };

  // ── Initialize 72 nodes ───────────────────────────────────────────────
  public func initSphere() : [SphereNode] {
    Array.tabulate<SphereNode>(TOTAL_NODES, func(idx) {
      let ring = idx / PER_RING;
      let pos  = idx % PER_RING;
      let (_, phi) = nodeAngles(ring, pos);
      {
        ring       = ring;
        position   = pos;
        activation = 0.5;
        phase      = phi;  // staggered initial phases
        weight     = 0.5;
        resonance  = 0.5;
      }
    })
  };

  func advancePhase(currentPhase: Float, freq: Float, sampleRate: Float) : Float {
    let next = currentPhase + 2.0 * PI * freq / sampleRate;
    if (next >= 2.0 * PI) { next - 2.0 * PI } else { next }
  };

  private func _clamp(x: Float, lo: Float, hi: Float) : Float {
    if (x < lo) lo else if (x > hi) hi else x
  };
  private func _cos(x: Float) : Float {
    var xx = x;
    while (xx >  PI) { xx -= 2.0 * PI };
    while (xx < -PI) { xx += 2.0 * PI };
    let x2 = xx * xx;
    1.0 - x2/2.0 + x2*x2/24.0
  };
  private func _sin(x: Float) : Float {
    var xx = x;
    while (xx >  PI) { xx -= 2.0 * PI };
    while (xx < -PI) { xx += 2.0 * PI };
    let x2 = xx * xx;
    xx - xx*x2/6.0 + xx*x2*x2/120.0
  };
}
