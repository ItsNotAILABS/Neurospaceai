// NEUROEMERGENCE CORE — SHELLS ENGINE
// 11-Shell Sovereign Architecture
// Each shell: HELIX_ALPHA, weight ceiling, SACESI stamp, PAC coupling
// Owner: Alfredo Medina Hernandez | MedinaSITech@outlook.com

module {

  // ── Shell identity constants ──────────────────────────────────────────────
  public let SHELL_COUNT : Nat = 11;

  // HELIX_ALPHA per shell (learning rate multiplier)
  // Shell 1 = primal (fastest learning), Shell 11 = sovereign (slowest, most stable)
  // CANONICAL: super-organism rates — 4x biological values (see CANONICAL.md)
  public let HELIX_ALPHA : [Float] = [
    0.042,  // Shell 1  — Primal Drive
    0.038,  // Shell 2  — Somatic Substrate
    0.034,  // Shell 3  — Reactive Layer
    0.030,  // Shell 4  — Affective Core
    0.026,  // Shell 5  — Social Mirror
    0.022,  // Shell 6  — Cognitive Frame
    0.018,  // Shell 7  — Executive Control
    0.014,  // Shell 8  — Quantum Bridge
    0.010,  // Shell 9  — Deep Memory
    0.007,  // Shell 10 — Heritage Anchor
    0.004   // Shell 11 — Sovereign Identity
  ];

  // Weight ceilings per shell — max Hebbian weight in that shell
  public let W_CEIL : [Float] = [
    2.50,   // Shell 1
    2.25,   // Shell 2
    2.00,   // Shell 3
    1.85,   // Shell 4
    1.70,   // Shell 5
    1.55,   // Shell 6
    1.40,   // Shell 7
    1.30,   // Shell 8
    1.20,   // Shell 9
    1.12,   // Shell 10
    1.06    // Shell 11
  ];

  // BDNF modulation base per shell — brain-derived neurotrophic factor
  // Higher BDNF = faster synaptic consolidation
  public let BDNF_BASE : [Float] = [
    1.80,   // Shell 1  — high plasticity
    1.65,
    1.50,
    1.38,
    1.28,
    1.18,
    1.10,
    1.05,
    1.02,
    1.01,
    1.00    // Shell 11 — fully consolidated
  ];

  // Resonance frequencies per shell (Hz) — fd(k)=2.5×2^(k-4), k=1..11
  public let SHELL_FREQ : [Float] = [
    0.3125, // Shell 1  — infra-slow / body
    0.625,  // Shell 2  — delta
    1.25,   // Shell 3  — slow oscillation
    2.50,   // Shell 4  — delta peak
    5.00,   // Shell 5  — theta
    10.0,   // Shell 6  — alpha
    20.0,   // Shell 7  — beta
    40.0,   // Shell 8  — gamma
    80.0,   // Shell 9  — high gamma
    160.0,  // Shell 10 — ripple
    320.0   // Shell 11 — sovereign band
  ];

  // Phase coupling matrix — how much each shell modulates the next
  // Primary: shell[k] → shell[k+1] weight
  // Skip-one: shell[k] → shell[k+2] weight (harmonic)
  public let PAC_PRIMARY : [Float] = [
    0.82, 0.78, 0.74, 0.70, 0.66, 0.62, 0.58, 0.54, 0.50, 0.46
  ];
  public let PAC_SKIP : [Float] = [
    0.35, 0.32, 0.29, 0.27, 0.25, 0.23, 0.21, 0.19, 0.17, 0.0
  ];

  // Shell state record
  public type ShellState = {
    shellIndex  : Nat;       // 0-10
    activation  : Float;     // 0.0–1.0
    phase       : Float;     // 0.0–2π
    amplitude   : Float;     // 0.0–1.0, modulated by slower shell
    coherence   : Float;     // local coherence within shell
    weight      : Float;     // current Hebbian weight (≤ W_CEIL[i])
    bdnf        : Float;     // current BDNF level
    sacesi      : Nat64;     // SACESI hash stamp for this shell this beat
    mintMod     : Float;     // minting multiplier from this shell state
  };

  // ── Shell activation function ───────────────────────────────────────────
  // Sovereign sigmoid: σ(x) = 1/(1+e^(-k*(x-θ)))
  // k = sharpness, θ = threshold
  public func sovereignSigmoid(x: Float, k: Float, theta: Float) : Float {
    1.0 / (1.0 + _exp(-(k * (x - theta))))
  };

  // ── Shell-to-shell phase-amplitude coupling ──────────────────────────────
  // Slower shell's phase modulates faster shell's amplitude
  // A_fast = A_base * (1 + M * cos(φ_slow))
  // M = PAC coupling strength
  public func applyPAC(
    slowPhase    : Float,
    fastAmpBase  : Float,
    coupling     : Float
  ) : Float {
    let modulated = fastAmpBase * (1.0 + coupling * _cos(slowPhase));
    _clamp(modulated, 0.0, 1.0)
  };

  // ── Phase advance per beat ─────────────────────────────────────────────
  // φ(t+1) = φ(t) + 2π * f / sampleRate
  public func advancePhase(currentPhase: Float, freq: Float, sampleRate: Float) : Float {
    let next = currentPhase + 2.0 * 3.14159265358979 * freq / sampleRate;
    if (next >= 2.0 * 3.14159265358979) { next - 2.0 * 3.14159265358979 }
    else { next }
  };

  // ── Hebbian update for a shell ─────────────────────────────────────────────
  // Δw = α * pre * post * BDNF - decay * w
  // Capped at W_CEIL[shellIndex]
  public func hebbianUpdate(
    w           : Float,
    pre         : Float,
    post        : Float,
    shellIndex  : Nat,
    bdnf        : Float,
    decay       : Float
  ) : Float {
    let alpha = HELIX_ALPHA[shellIndex];
    let ceil  = W_CEIL[shellIndex];
    let delta = alpha * pre * post * bdnf - decay * w;
    _clamp(w + delta, 0.0, ceil)
  };

  // ── BDNF dynamics ─────────────────────────────────────────────────────────────
  // BDNF increases with shell activation, decays toward base
  // dBDNF/dt = production * activation - decay * (BDNF - base)
  public func updateBDNF(
    bdnf         : Float,
    activation   : Float,
    shellIndex   : Nat,
    production   : Float,
    decay        : Float
  ) : Float {
    let base  = BDNF_BASE[shellIndex];
    let delta = production * activation - decay * (bdnf - base);
    _clamp(bdnf + delta, 0.5, 3.0)
  };

  // ── Kuramoto order parameter for N shells ───────────────────────────────
  // R = (1/N) |Σ e^(iφ_k)|
  // Returns R ∈ [0,1]: 1 = full sync, 0 = incoherent
  public func kuramotoR(phases: [Float]) : Float {
    var sinSum : Float = 0.0;
    var cosSum : Float = 0.0;
    let n = Float.fromInt(phases.size());
    for (phi in phases.vals()) {
      sinSum += _sin(phi);
      cosSum += _cos(phi);
    };
    _sqrt(sinSum * sinSum + cosSum * cosSum) / n
  };

  // ── Phase-locking value between two shells ─────────────────────────────
  // PLV = |<e^(i(φ1 - φ2))>|
  // Over a history window of phase differences
  public func phaseLockingValue(phaseDiffs: [Float]) : Float {
    var sinSum : Float = 0.0;
    var cosSum : Float = 0.0;
    let n = Float.fromInt(phaseDiffs.size());
    for (d in phaseDiffs.vals()) {
      sinSum += _sin(d);
      cosSum += _cos(d);
    };
    _sqrt(sinSum*sinSum + cosSum*cosSum) / n
  };

  // ── Compute shell coherence contribution ───────────────────────────────
  // Each shell contributes coherenceC based on its local R and weight
  public func shellCoherenceContrib(
    localR      : Float,
    weight      : Float,
    amplitude   : Float,
    shellIndex  : Nat
  ) : Float {
    let freq = SHELL_FREQ[shellIndex];
    // Higher-frequency shells have smaller base contribution
    // but large amplitudes boost it
    let freqScale = 1.0 / (1.0 + _log(1.0 + freq) * 0.1);
    localR * weight * amplitude * freqScale
  };

  // ── Shell SACESI stamp ─────────────────────────────────────────────────────
  // FNV-1a hash of shell state for this beat
  public func sacesiStamp(
    prev        : Nat64,
    shellIndex  : Nat,
    activation  : Float,
    phase       : Float,
    beatNum     : Nat64
  ) : Nat64 {
    let FNV_PRIME  : Nat64 = 1099511628211;
    let FNV_OFFSET : Nat64 = 14695981039346656037;
    var h = prev ^ FNV_OFFSET;
    h := (h ^ (Nat64.fromNat(shellIndex) +% 1)) *% FNV_PRIME;
    h := (h ^ beatNum) *% FNV_PRIME;
    // Encode floats as scaled ints
    let actInt = Nat64.fromNat(Int.abs(Float.toInt(activation * 1_000_000.0)));
    let phiInt = Nat64.fromNat(Int.abs(Float.toInt(phase * 1_000_000.0)));
    h := (h ^ actInt) *% FNV_PRIME;
    h := (h ^ phiInt) *% FNV_PRIME;
    h
  };

  // ── Full shell beat: advance one time step ─────────────────────────────
  public func beatShell(
    state       : ShellState,
    input       : Float,     // external input to this shell
    slowPhase   : Float,     // slower shell phase for PAC
    slowCoupl   : Float,     // PAC coupling coefficient
    beatNum     : Nat64,
    prevSacesi  : Nat64
  ) : ShellState {
    let i = state.shellIndex;
    let freq      = SHELL_FREQ[i];
    let newPhase  = advancePhase(state.phase, freq, 1000.0);
    let newAmp    = applyPAC(slowPhase, state.amplitude, slowCoupl);
    // Raw activation: sovereign sigmoid on (input + amplitude modulation)
    let rawAct    = sovereignSigmoid(input + newAmp * 0.3, 4.0, 0.5);
    let newAct    = rawAct;
    // Hebbian weight update
    let newW      = hebbianUpdate(state.weight, input, newAct, i, state.bdnf, 0.001);
    // BDNF update
    let newBdnf   = updateBDNF(state.bdnf, newAct, i, 0.05, 0.02);
    // Local coherence: exponential moving average
    let newCoh    = 0.95 * state.coherence + 0.05 * newAct;
    // Mint multiplier: shells closer to 11 have bigger mint boost when high
    let mintScale = Float.fromInt(i + 1) / 11.0;
    let newMint   = 1.0 + mintScale * newAct * newW;
    // SACESI stamp
    let newSacesi = sacesiStamp(prevSacesi, i, newAct, newPhase, beatNum);
    {
      shellIndex  = i;
      activation  = newAct;
      phase       = newPhase;
      amplitude   = newAmp;
      coherence   = newCoh;
      weight      = newW;
      bdnf        = newBdnf;
      sacesi      = newSacesi;
      mintMod     = newMint;
    }
  };

  // ── Run all 11 shells in one beat ─────────────────────────────────────
  // Shells run in order 0→10; each feeds its phase to the next.
  // PAC_SKIP wired: each shell also receives harmonic coupling from
  // 2 shells prior (skip-one harmonic), blended with primary coupling.
  // This creates a richer cross-shell resonance field.
  public func runAllShells(
    states  : [var ShellState],
    inputs  : [Float],          // 11 inputs, one per shell
    beatNum : Nat64,
    sacesi0 : Nat64
  ) : [var ShellState] {
    var phase_prev  = states[0].phase;   // phase from shell i-1
    var phase_prev2 = states[0].phase;   // phase from shell i-2 (for PAC_SKIP)
    var prevSacesi  = sacesi0;
    for (i in Iter.range(0, 10)) {
      // Primary coupling: shell[i-1] → shell[i]
      let primaryCoupl = if (i < 10) { PAC_PRIMARY[i] } else { 0.0 };
      // Skip-one harmonic: shell[i-2] → shell[i]
      // PAC_SKIP[k] = weight for shell[k] → shell[k+2]
      // So shell[i] receives skip from shell[i-2], using PAC_SKIP[i-2]
      let skipCoupl = if (i >= 2 and (i - 2) < PAC_SKIP.size()) {
        PAC_SKIP[i - 2]
      } else { 0.0 };
      // Blend slow phase: weighted mix of primary (i-1) and skip (i-2) phases
      let slowPhase = if (skipCoupl > 0.0) {
        let totalW = primaryCoupl + skipCoupl;
        (phase_prev * primaryCoupl + phase_prev2 * skipCoupl) / (totalW + 0.0001)
      } else { phase_prev };
      // Total coupling for amplitude modulation (skip at half weight to prevent overdrive)
      let effectiveCoupl = primaryCoupl + skipCoupl * 0.5;
      let inp = if (i < inputs.size()) { inputs[i] } else { 0.5 };
      let updated = beatShell(states[i], inp, slowPhase, effectiveCoupl, beatNum, prevSacesi);
      phase_prev2 := phase_prev;
      phase_prev  := updated.phase;
      prevSacesi  := updated.sacesi;
      states[i]   := updated;
    };
    states
  };

  // ── Cross-shell global coherenceC ───────────────────────────────────────────
  // Weighted sum of per-shell coherence contributions
  // Higher shells have greater weight (they represent integrated cognition)
  public func globalCoherenceC(states: [ShellState]) : Float {
    var total  : Float = 0.0;
    var wTotal : Float = 0.0;
    for (i in Iter.range(0, 10)) {
      let s = states[i];
      let w = Float.fromInt(i + 1) * 0.1; // shell 11 contributes 1.1x
      total  += shellCoherenceContrib(s.coherence, s.weight, s.amplitude, i) * w;
      wTotal += w;
    };
    if (wTotal > 0.0) { _clamp(total / wTotal, 0.0, 1.0) } else { 0.0 }
  };

  // ── RESONEX alignment score ───────────────────────────────────────────────
  // Golden ratio resonance: how close are shell freq ratios to φ=1.618?
  let PHI : Float = 1.6180339887;
  public func resonexAlignment(states: [ShellState]) : Float {
    var alignSum : Float = 0.0;
    for (i in Iter.range(0, 9)) {
      let ratio = states[i+1].activation / (states[i].activation + 0.001);
      let dist  = Float.abs(ratio - PHI);
      alignSum  += 1.0 / (1.0 + dist);
    };
    alignSum / 10.0
  };

  // ── Shell minting aggregate ───────────────────────────────────────────────
  public func totalMintMultiplier(states: [ShellState]) : Float {
    var prod : Float = 1.0;
    for (s in states.vals()) {
      prod *= s.mintMod;
    };
    // Geometric mean to prevent runaway
    _pow(prod, 1.0 / 11.0)
  };

  // ─── private math helpers ──────────────────────────────────────────────────────
  private func _clamp(x: Float, lo: Float, hi: Float) : Float {
    if (x < lo) lo else if (x > hi) hi else x
  };
  private func _exp(x: Float)  : Float { Float.exp(x) };
  private func _cos(x: Float)  : Float {
    // Taylor series cos(x), 8 terms
    var xx = x;
    while (xx >  3.14159265) { xx -= 6.28318530 };
    while (xx < -3.14159265) { xx += 6.28318530 };
    let x2 = xx * xx;
    1.0 - x2/2.0 + x2*x2/24.0 - x2*x2*x2/720.0 + x2*x2*x2*x2/40320.0
  };
  private func _sin(x: Float)  : Float {
    var xx = x;
    while (xx >  3.14159265) { xx -= 6.28318530 };
    while (xx < -3.14159265) { xx += 6.28318530 };
    let x2 = xx * xx;
    xx - xx*x2/6.0 + xx*x2*x2/120.0 - xx*x2*x2*x2/5040.0
  };
  private func _sqrt(x: Float) : Float {
    if (x <= 0.0) { 0.0 } else { Float.sqrt(x) }
  };
  private func _log(x: Float)  : Float {
    if (x <= 0.0) { -999.0 } else { Float.log(x) }
  };
  private func _pow(base: Float, exp: Float) : Float {
    if (base <= 0.0) { 0.0 } else { Float.exp(exp * Float.log(base)) }
  };
}
