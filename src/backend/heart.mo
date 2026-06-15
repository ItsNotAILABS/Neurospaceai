// ============================================================
// SOVEREIGN HEART MODULE — heart.mo
// NeuroEmergence Core — Sovereign Organism Biology
// Creator: Alfredo Medina Hernandez | Dallas, TX 2026
// TOP SECRET PROPRIETARY — All rights reserved.
// Unauthorized use strictly prohibited.
//
// Real Hodgkin-Huxley cardiac pacemaker biology.
// Ion channel gating dynamics. Cardiac output physics.
// HRV analysis. ECG waveform generation.
// Dual heart: ICP external skeleton + SOVEREIGN internal oscillator.
// Heart-brain PHI-ratio axis: 873ms heart ↔ 539ms brain.
//
// BIOLOGY ONLY. This module does not hold frequency constants.
// All constants read from SovereignLaws.
// ICP ledger bridge is in artifact_organism.mo — not here.
// ============================================================

import Float "mo:core/Float";
import Array "mo:core/Array";
import SovereignLaws "sovereign_laws";

module {

  // ============================================================
  // SECTION 1 — CONSTANTS (read from sovereign_laws — no duplication)
  // ============================================================

  /// PHI — read from sovereign_laws, not duplicated here
  public let PHI      : Float = SovereignLaws.PHI;

  /// SCHUMANN — Earth's fundamental resonance (Hz)
  public let SCHUMANN : Float = SovereignLaws.SCHUMANN_HZ;

  /// SOVEREIGN HEARTBEAT — PHI^4 × 127.7ms = 873ms (from sovereign_laws)
  public let BASE_HEART_RATE_MS : Float = SovereignLaws.HEARTBEAT_MS;

  /// BRAIN RATE — 873ms × PHI_INV = 539ms (from sovereign_laws)
  public let BRAIN_RATE_MS : Float = SovereignLaws.BRAIN_RATE_MS;

  /// SA NODE — action potential threshold (mV)
  public let SA_NODE_THRESHOLD : Float = -55.0;

  /// RESTING MEMBRANE POTENTIAL (mV)
  public let RESTING_POTENTIAL : Float = -70.0;

  /// PEAK ACTION POTENTIAL (mV)
  public let PEAK_POTENTIAL : Float = 30.0;

  /// AV NODE DELAY — OMNIS consensus delay analog (ms)
  public let AV_NODE_DELAY_MS : Float = 150.0;

  /// PURKINJE CONDUCTION — simultaneous distribution time (ms)
  public let PURKINJE_CONDUCTION_MS : Float = 40.0;

  /// FRANK-STARLING maximum stroke volume multiplier
  public let FRANK_STARLING_MAX : Float = 2.0;

  // Hodgkin-Huxley conductances (mS/cm²) and reversal potentials (mV)
  let CM      : Float = 1.0;    // membrane capacitance μF/cm²
  let GNA     : Float = 120.0;  // max Na conductance
  let GK      : Float = 36.0;   // max K conductance
  let GCA     : Float = 0.3;    // max Ca conductance
  let GL      : Float = 0.3;    // leak conductance
  let ENA     : Float = 60.0;   // Na reversal
  let EK      : Float = -90.0;  // K reversal
  let ECA     : Float = 120.0;  // Ca reversal
  let EL      : Float = -65.0;  // leak reversal

  // ============================================================
  // SECTION 2 — TYPES
  // ============================================================

  /// Full Hodgkin-Huxley gating state for one cardiac cycle
  public type HHState = {
    v         : Float;  // membrane potential (mV)
    m         : Float;  // Na activation gate [0,1]
    h         : Float;  // Na inactivation gate [0,1]
    n         : Float;  // K activation gate [0,1]
    d         : Float;  // Ca activation gate [0,1]
    f         : Float;  // Ca inactivation gate [0,1]
    beatCount : Nat;    // cumulative action potentials fired
  };

  /// Neurotransmitter modulation inputs from the organism field
  public type NeurotransmitterInfluence = {
    acetylcholine  : Float;  // vagal tone — slows rate
    norepinephrine : Float;  // sympathetic — accelerates rate
    cortisol       : Float;  // stress — accelerates rate
    serotonin      : Float;  // depth/stability — slows, deepens
  };

  /// Full sovereign heart state — everything the organism needs
  public type HeartState = {
    v                : Float;    // membrane potential (mV)
    m                : Float;    // Na gate
    h                : Float;    // Na inactivation gate
    n                : Float;    // K gate
    d                : Float;    // Ca activation gate
    f                : Float;    // Ca inactivation gate
    beatCount        : Nat;      // total beats fired since init
    currentRateMs    : Float;    // current inter-beat interval (ms)
    ecgBuffer        : [Float];  // 64-sample ECG waveform
    hrv_sdnn         : Float;    // HRV SDNN (ms) — health metric
    hrv_rmssd        : Float;    // HRV RMSSD (ms) — parasympathetic tone
    cardiacOutput    : Float;    // CO = HR(Hz) × SV
    avDelayMs        : Float;    // current AV node delay (ms)
    lastBeatIntervals: [Float];  // last 32 RR intervals (ms)
  };

  /// HRV diagnostic report
  public type HRVState = {
    sdnn   : Float;  // standard deviation of NN intervals
    rmssd  : Float;  // root mean square successive differences
    lfhf   : Float;  // autonomic balance ratio (LF/HF)
    health : Float;  // normalized health score [0,1]
  };

  // ============================================================
  // SECTION 3 — ION CHANNEL RATE FUNCTIONS (Hodgkin-Huxley)
  // ============================================================

  /// Alpha-m: Na activation opening rate
  /// αm(V) = 0.1(V+40)/(1-exp(-(V+40)/10)) if V≠-40, else 1.0
  public func computeAlphaM(v : Float) : Float {
    let offset = v + 40.0;
    if (Float.abs(offset) < 1e-7) {
      1.0
    } else {
      0.1 * offset / (1.0 - Float.exp(-offset / 10.0))
    }
  };

  /// Beta-m: Na activation closing rate
  /// βm(V) = 4.0 × exp(-(V+65)/18)
  public func computeBetaM(v : Float) : Float {
    4.0 * Float.exp(-(v + 65.0) / 18.0)
  };

  /// Alpha-h: Na inactivation opening rate
  /// αh(V) = 0.07 × exp(-(V+65)/20)
  public func computeAlphaH(v : Float) : Float {
    0.07 * Float.exp(-(v + 65.0) / 20.0)
  };

  /// Beta-h: Na inactivation closing rate
  /// βh(V) = 1/(1+exp(-(V+35)/10))
  public func computeBetaH(v : Float) : Float {
    1.0 / (1.0 + Float.exp(-(v + 35.0) / 10.0))
  };

  /// Alpha-n: K activation opening rate
  /// αn(V) = 0.01(V+55)/(1-exp(-(V+55)/10)) if V≠-55, else 0.1
  public func computeAlphaN(v : Float) : Float {
    let offset = v + 55.0;
    if (Float.abs(offset) < 1e-7) {
      0.1
    } else {
      0.01 * offset / (1.0 - Float.exp(-offset / 10.0))
    }
  };

  /// Beta-n: K activation closing rate
  /// βn(V) = 0.125 × exp(-(V+65)/80)
  public func computeBetaN(v : Float) : Float {
    0.125 * Float.exp(-(v + 65.0) / 80.0)
  };

  // ============================================================
  // SECTION 4 — HH STATE ADVANCE (Forward Euler)
  // ============================================================

  /// Compute all ionic currents and advance membrane potential + gating vars
  /// dt = time step in ms
  /// dV/dt = -(1/Cm)(INa + IK + ICa + Ileak)
  /// dm/dt = αm(V)(1-m) - βm(V)m   (and similarly h, n)
  /// d/f gating: simple first-order for Ca channel
  public func advanceHHState(state : HHState, dt : Float) : HHState {
    let v = state.v;
    let m = state.m;
    let h = state.h;
    let n = state.n;
    let d = state.d;
    let f = state.f;

    // Ion currents
    let iNa    = GNA * m * m * m * h * (v - ENA);
    let iK     = GK  * n * n * n * n * (v - EK);
    let iCa    = GCA * d * f           * (v - ECA);
    let iLeak  = GL                    * (v - EL);

    // dV/dt
    let dvdt = -(iNa + iK + iCa + iLeak) / CM;

    // Gating variable derivatives
    let am = computeAlphaM(v); let bm = computeBetaM(v);
    let ah = computeAlphaH(v); let bh = computeBetaH(v);
    let an = computeAlphaN(v); let bn = computeBetaN(v);

    let dmdt = am * (1.0 - m) - bm * m;
    let dhdt = ah * (1.0 - h) - bh * h;
    let dndt = an * (1.0 - n) - bn * n;

    // Calcium channel gating (simplified first-order)
    let adCa  = 1.0 / (1.0 + Float.exp(-(v + 10.0) / 6.5));
    let afCa  = 1.0 / (1.0 + Float.exp( (v + 25.0) / 6.5));
    let dddt  = (adCa - d) / 10.0;
    let dfdt  = (afCa - f) / 80.0;

    // Forward Euler integration
    let newV = clampF(v  + dt * dvdt, -90.0, 50.0);
    let newM = clampF(m  + dt * dmdt,  0.0,   1.0);
    let newH = clampF(h  + dt * dhdt,  0.0,   1.0);
    let newN = clampF(n  + dt * dndt,  0.0,   1.0);
    let newD = clampF(d  + dt * dddt,  0.0,   1.0);
    let newF = clampF(f  + dt * dfdt,  0.0,   1.0);

    {
      v         = newV;
      m         = newM;
      h         = newH;
      n         = newN;
      d         = newD;
      f         = newF;
      beatCount = state.beatCount;
    }
  };

  // ============================================================
  // SECTION 5 — SA NODE PACEMAKER
  // ============================================================

  /// SA node spontaneous firing — checks threshold, resets on fire
  /// Returns (new HH state, did_fire this step)
  public func saNodeFire(state : HHState, nt : NeurotransmitterInfluence) : (HHState, Bool) {
    if (state.v >= SA_NODE_THRESHOLD) {
      // Action potential fires — reset membrane, increment beat count
      let reset : HHState = {
        v         = RESTING_POTENTIAL;
        m         = 0.05;
        h         = 0.60;
        n         = 0.32;
        d         = state.d;
        f         = state.f;
        beatCount = state.beatCount + 1;
      };
      // After reset, apply autonomic modulation to d/f (Ca gates carry state)
      let _ = nt; // nt used in rate modulation — applied outside this fn
      (reset, true)
    } else {
      (state, false)
    }
  };

  /// Autonomic modulation of inter-beat interval
  /// Acetylcholine (vagal): slows rate — interval increases
  /// Norepinephrine (sympathetic): accelerates — interval decreases
  /// Cortisol (stress): accelerates
  /// Serotonin (depth): slows, deepens
  public func autonomicModulation(baseMsRate : Float, nt : NeurotransmitterInfluence) : Float {
    let ach_factor  = 1.0 + 0.3  * nt.acetylcholine;   // vagal slowing
    let norepi_factor = 1.0 - 0.3  * nt.norepinephrine; // sympathetic speeding
    let cortisol_factor = 1.0 - 0.2  * nt.cortisol;     // stress speeding
    let serotonin_factor = 1.0 + 0.15 * nt.serotonin;   // depth slowing
    let modulated = baseMsRate * ach_factor * norepi_factor * cortisol_factor * serotonin_factor;
    clampF(modulated, 400.0, 1500.0)  // physiological range: 40 BPM to 150 BPM
  };

  // ============================================================
  // SECTION 6 — AV NODE DELAY
  // ============================================================

  /// AV node delays the SA signal before ventricular activation
  /// High vagal tone = longer delay = deeper OMNIS processing
  /// vagalTone in [0,1]
  public func avNodeDelay(vagalTone : Float) : Float {
    clampF(AV_NODE_DELAY_MS - 30.0 * vagalTone, 120.0, 200.0)
  };

  // ============================================================
  // SECTION 7 — PURKINJE FIBER DISTRIBUTION
  // ============================================================

  /// Simultaneous signal distribution to all nodes within 40ms
  /// This is F4 (Staggered Pipeline) analog — all organisms receive signal at once
  /// signal: amplitude of the beat, nodeCount: number of receiving nodes
  /// delayMs: propagation delay from AV node
  public func purkinjePropagation(signal : Float, nodeCount : Nat, delayMs : Float) : [Float] {
    // All nodes receive signal × exp(-delay/40ms) simultaneously
    let attenuation = Float.exp(-delayMs / PURKINJE_CONDUCTION_MS);
    let attenuatedSignal = signal * attenuation;
    Array.tabulate<Float>(nodeCount, func(_i) { attenuatedSignal })
  };

  // ============================================================
  // SECTION 8 — CARDIAC OUTPUT (Frank-Starling Law)
  // ============================================================

  /// Stroke volume using Frank-Starling law
  /// EDV (end-diastolic volume): more queue → more filling → stronger contraction
  /// ESV (end-systolic volume): higher readiness → more ejection
  /// SV = EDV - ESV
  public func strokeVolume(readinessScore : Float, queueDepth : Float) : Float {
    let edv = 1.0 + clampF(queueDepth, 0.0, 2.0) * 0.5;
    let esv = 1.0 - clampF(readinessScore, 0.0, 1.0) * 0.5;
    let sv  = clampF(edv - esv, 0.0, FRANK_STARLING_MAX);
    sv
  };

  /// Cardiac Output = Heart Rate (Hz) × Stroke Volume
  /// CO measures total production throughput per second
  public func cardiacOutput(heartRateHz : Float, readinessScore : Float, queueDepth : Float) : Float {
    heartRateHz * strokeVolume(readinessScore, queueDepth)
  };

  // ============================================================
  // SECTION 9 — HRV ANALYSIS
  // ============================================================

  /// SDNN — standard deviation of NN (normal-to-normal) intervals
  /// SDNN > 50ms = healthy cardiac adaptability (clinical threshold)
  public func computeHRV_SDNN(intervals : [Float]) : Float {
    let n = intervals.size();
    if (n < 2) return 0.0;
    let nF = n.toFloat();
    let mean = intervals.foldLeft(0.0 : Float, func(acc : Float, x : Float) : Float { acc + x }) / nF;
    let variance = intervals.foldLeft(0.0 : Float, func(acc : Float, x : Float) : Float {
      let diff = x - mean;
      acc + diff * diff
    }) / nF;
    Float.sqrt(variance)
  };

  /// RMSSD — root mean square of successive differences
  /// RMSSD > 30ms = healthy parasympathetic tone (clinical threshold)
  public func computeHRV_RMSSD(intervals : [Float]) : Float {
    let n = intervals.size();
    if (n < 2) return 0.0;
    var sumSqDiff : Float = 0.0;
    var i = 0;
    while (i + 1 < n) {
      let diff = intervals[i + 1] - intervals[i];
      sumSqDiff += diff * diff;
      i += 1;
    };
    if (i == 0) return 0.0;
    Float.sqrt(sumSqDiff / i.toFloat())
  };

  /// HRV health score — normalized [0,1]
  /// Based on real clinical thresholds: SDNN=100ms excellent, RMSSD=50ms excellent
  public func hrv_health_score(sdnn : Float, rmssd : Float) : Float {
    let sdnnNorm  = clampF(sdnn  / 100.0, 0.0, 1.0);
    let rmssdNorm = clampF(rmssd / 50.0,  0.0, 1.0);
    clampF(sdnnNorm * 0.5 + rmssdNorm * 0.5, 0.0, 1.0)
  };

  /// LF/HF ratio — autonomic balance indicator
  /// Derived from SDNN (LF proxy) and RMSSD (HF proxy)
  /// Normal LF/HF ≈ 1.5-2.0 at rest. High = sympathetic dominance.
  public func computeLFHF(sdnn : Float, rmssd : Float) : Float {
    if (rmssd < 1.0) return 2.0;  // default sympathetic when no HRV data
    clampF(sdnn / rmssd, 0.1, 10.0)
  };

  // ============================================================
  // SECTION 10 — ECG WAVEFORM GENERATION
  // ============================================================

  /// Gaussian kernel for ECG wave shapes
  /// center: phase center [0,1], sigma: spread, amplitude: peak value
  func gaussianWave(phase : Float, center : Float, sigma : Float, amplitude : Float) : Float {
    let diff = phase - center;
    amplitude * Float.exp(-(diff * diff) / (2.0 * sigma * sigma))
  };

  /// Generate one ECG sample at normalized phase [0,1]
  /// P-wave: atrial depolarization (smooth gaussian at phase 0.15)
  /// QRS complex: ventricular depolarization (sharp spike at phase 0.45)
  /// T-wave: ventricular repolarization (broad dome at phase 0.65)
  public func generateECGSample(phase : Float) : Float {
    // P-wave: smooth gaussian, atrial depolarization
    let pWave   = gaussianWave(phase, 0.15, 0.04, 0.15);

    // QRS complex: Q-dip, R-peak, S-dip
    let qDip    = gaussianWave(phase, 0.42, 0.02, -0.10);
    let rPeak   = gaussianWave(phase, 0.45, 0.01,  1.00);
    let sDip    = gaussianWave(phase, 0.48, 0.02, -0.25);

    // T-wave: broad repolarization dome
    let tWave   = gaussianWave(phase, 0.65, 0.08, 0.35);

    pWave + qDip + rPeak + sDip + tWave
  };

  /// Generate a full ECG buffer: `samples` points over one beat interval
  public func generateECGBuffer(beatIntervalMs : Float, samples : Nat) : [Float] {
    if (samples == 0 or beatIntervalMs <= 0.0) return [];
    let samplesF = samples.toFloat();
    Array.tabulate<Float>(samples, func(i) {
      let phase = i.toFloat() / samplesF;
      generateECGSample(phase)
    })
  };

  // ============================================================
  // SECTION 11 — BARORECEPTOR REFLEX
  // ============================================================

  /// Blood pressure negative feedback on heart rate
  /// High BP → lower HR (baroreceptor reflex)
  /// Organism analog: high OMNIS consensus pressure → lower rate (deeper processing)
  public func baroreceptorReflex(currentBP : Float, targetBP : Float, currentHR : Float) : Float {
    let bpError = targetBP - currentBP;
    // Negative feedback: error positive (BP low) → increase HR
    //                    error negative (BP high) → decrease HR
    clampF(currentHR - 0.5 * bpError, 20.0, 220.0)
  };

  // ============================================================
  // SECTION 12 — MODULE-LEVEL HEART STATE (mutable)
  // ============================================================

  /// Initialize the heart at resting potential with physiological gating defaults
  public func initHeart() : HeartState {
    let initialHH : HHState = {
      v         = RESTING_POTENTIAL;
      m         = 0.05;   // near-closed Na activation
      h         = 0.60;   // partially inactivated Na
      n         = 0.32;   // partially activated K
      d         = 0.003;  // near-closed Ca activation
      f         = 0.999;  // near-open Ca inactivation
      beatCount = 0;
    };
    let initECG = generateECGBuffer(BASE_HEART_RATE_MS, 64);
    {
      v                 = initialHH.v;
      m                 = initialHH.m;
      h                 = initialHH.h;
      n                 = initialHH.n;
      d                 = initialHH.d;
      f                 = initialHH.f;
      beatCount         = 0;
      currentRateMs     = BASE_HEART_RATE_MS;
      ecgBuffer         = initECG;
      hrv_sdnn          = 50.0;  // baseline: healthy
      hrv_rmssd         = 30.0;  // baseline: healthy
      cardiacOutput     = 1000.0 / BASE_HEART_RATE_MS * 1.0;  // ~1.15 at rest
      avDelayMs         = AV_NODE_DELAY_MS;
      lastBeatIntervals = [];
    }
  };

  /// Advance the sovereign heart one simulation step
  /// dt: time step in ms (typically 1.0ms for HH accuracy)
  /// neurotransmitters: live neurochemical field state
  /// readiness: organism readiness score [0,1]
  /// queue: production queue depth [0,∞)
  /// Returns (new HeartState, did_fire_this_step)
  public func advanceHeart(
    current          : HeartState,
    neurotransmitters: NeurotransmitterInfluence,
    readiness        : Float,
    queueD           : Float,
    lastIntervalsIn  : [Float],
  ) : (HeartState, Bool) {
    // Reconstruct HH state from HeartState
    let hhIn : HHState = {
      v         = current.v;
      m         = current.m;
      h         = current.h;
      n         = current.n;
      d         = current.d;
      f         = current.f;
      beatCount = current.beatCount;
    };

    // Advance Hodgkin-Huxley equations (1ms step)
    let dt : Float = 1.0;
    let hhAdvanced = advanceHHState(hhIn, dt);

    // SA node firing check
    let (hhPost, fired) = saNodeFire(hhAdvanced, neurotransmitters);

    // Autonomic modulation of inter-beat interval
    let newRateMs = autonomicModulation(BASE_HEART_RATE_MS, neurotransmitters);

    // AV node delay (vagal tone from acetylcholine)
    let newAvDelay = avNodeDelay(neurotransmitters.acetylcholine);

    // Update beat interval history on fire
    let newIntervals : [Float] = if (fired) {
      // Append newRateMs, keep last 32 intervals
      let prev = lastIntervalsIn;
      let combined = prev.concat([newRateMs]);
      let len = combined.size();
      if (len > 32) {
        combined.sliceToArray<Float>(len - 32, len)
      } else {
        combined
      }
    } else {
      lastIntervalsIn
    };

    // HRV computation (updated when we have enough intervals)
    let sdnn  = if (newIntervals.size() >= 4) computeHRV_SDNN(newIntervals)  else current.hrv_sdnn;
    let rmssd = if (newIntervals.size() >= 4) computeHRV_RMSSD(newIntervals) else current.hrv_rmssd;

    // Cardiac output: CO = HR(Hz) × SV
    let hrHz = 1000.0 / newRateMs;
    let co   = cardiacOutput(hrHz, readiness, queueD);

    // Regenerate ECG buffer on each beat for live display
    let newEcg = if (fired) generateECGBuffer(newRateMs, 64) else current.ecgBuffer;

    let newState : HeartState = {
      v                 = hhPost.v;
      m                 = hhPost.m;
      h                 = hhPost.h;
      n                 = hhPost.n;
      d                 = hhPost.d;
      f                 = hhPost.f;
      beatCount         = hhPost.beatCount;
      currentRateMs     = newRateMs;
      ecgBuffer         = newEcg;
      hrv_sdnn          = sdnn;
      hrv_rmssd         = rmssd;
      cardiacOutput     = co;
      avDelayMs         = newAvDelay;
      lastBeatIntervals = newIntervals;
    };

    (newState, fired)
  };

  // ============================================================
  // SECTION 13 — QUERY HELPERS (pure, no state)
  // ============================================================

  /// Current BPM from interval
  public func heartRateBPM(rateMs : Float) : Float {
    if (rateMs <= 0.0) return 0.0;
    60000.0 / rateMs
  };

  /// Full HRV diagnostic from interval array
  public func computeHRVState(intervals : [Float]) : HRVState {
    let sdnn  = computeHRV_SDNN(intervals);
    let rmssd = computeHRV_RMSSD(intervals);
    let lfhf  = computeLFHF(sdnn, rmssd);
    let health = hrv_health_score(sdnn, rmssd);
    { sdnn; rmssd; lfhf; health }
  };

  // ============================================================
  // INTERNAL HELPERS
  // ============================================================

  func clampF(x : Float, lo : Float, hi : Float) : Float {
    if (x < lo) lo else if (x > hi) hi else x
  };

  // ============================================================
  // SECTION 14 — RESIDENT / COMPUTATE SPLIT
  // The heart's sovereign resident type.
  // All persistent heart state lives here — NOT in main.mo.
  // main.mo holds one var of this type and writes it back each beat.
  // ============================================================

  /// Sovereign heart resident — all persistent state
  public type HeartResident = {
    hhState       : HHState;
    heartState    : HeartState;
    hrvState      : HRVState;
    neurochemicals: NeurotransmitterInfluence;
    beatCount     : Nat;
    lastBeatMs    : Int;
  };

  /// Signal emitted by the heart each beat — consumed by other modules
  public type HeartBeatSignal = {
    bpm              : Float;
    coherence        : Float;    // cardiac coherence [0,1]
    hrvScore         : Float;    // HRV health score [0,1]
    frequencyEmission: Float;    // harmonic field frequency emission
    beatCount        : Nat;
    cardiacOutput    : Float;
  };

  /// Initialize the heart resident at resting state
  public func initHeartResident() : HeartResident {
    let hs = initHeart();
    let hhInit : HHState = {
      v = hs.v; m = hs.m; h = hs.h; n = hs.n;
      d = hs.d; f = hs.f; beatCount = 0;
    };
    let ntInit : NeurotransmitterInfluence = {
      acetylcholine  = SovereignLaws.PHI_INV2; // 0.382 base parasympathetic
      norepinephrine = SovereignLaws.PHI_INV3; // 0.236 base sympathetic
      cortisol       = SovereignLaws.PHI_INV3; // 0.236 base stress
      serotonin      = SovereignLaws.PHI_INV;  // 0.618 base stability
    };
    let hrv = computeHRVState([]);
    {
      hhState        = hhInit;
      heartState     = hs;
      hrvState       = hrv;
      neurochemicals = ntInit;
      beatCount      = 0;
      lastBeatMs     = 0;
    }
  };

  /// Heart computate — runs every 873ms heartbeat.
  /// Advances Hodgkin-Huxley biology, emits HeartBeatSignal.
  /// Returns (new resident, signal).
  /// frequency() — reads harmonic field from sovereign_laws.
  /// icpRecord() — signal.beatCount tells artifact_organism.mo to act.
  public func heartComputate(
    resident  : HeartResident,
    now       : Int,
    readiness : Float,
    queueD    : Float,
  ) : (HeartResident, HeartBeatSignal) {
    // 1. BIOLOGY — advance Hodgkin-Huxley, check SA node, update HRV
    let (newState, fired) = advanceHeart(
      resident.heartState,
      resident.neurochemicals,
      readiness,
      queueD,
      resident.heartState.lastBeatIntervals,
    );

    let newHH : HHState = {
      v = newState.v; m = newState.m; h = newState.h;
      n = newState.n; d = newState.d; f = newState.f;
      beatCount = if (fired) newState.beatCount else resident.hhState.beatCount;
    };

    let newBeatCount = if (fired) resident.beatCount + 1 else resident.beatCount;

    let intervals = newState.lastBeatIntervals;
    let hrv = if (intervals.size() >= 4) computeHRVState(intervals)
              else resident.hrvState;

    // 2. FREQUENCY — reads from sovereign_laws (heart does not own frequencies)
    let field = SovereignLaws.computeHarmonicField();
    // frequency emission: cardiac coherence × field identity
    let cardiacCoherence = clampF(
      (hrv.health * SovereignLaws.PHI_INV + newState.cardiacOutput * SovereignLaws.PHI_INV2),
      0.0, 1.0
    );
    let freqEmission = cardiacCoherence * field.fieldIdentity;

    // 3. SIGNAL — for icpRecord() in artifact_organism.mo
    let bpm = heartRateBPM(newState.currentRateMs);
    let signal : HeartBeatSignal = {
      bpm               = bpm;
      coherence         = cardiacCoherence;
      hrvScore          = hrv.health;
      frequencyEmission = freqEmission;
      beatCount         = newBeatCount;
      cardiacOutput     = newState.cardiacOutput;
    };

    let newResident : HeartResident = {
      hhState        = newHH;
      heartState     = newState;
      hrvState       = hrv;
      neurochemicals = resident.neurochemicals;
      beatCount      = newBeatCount;
      lastBeatMs     = now;
    };

    (newResident, signal)
  };

  /// Update neurochemicals in the heart resident (called from main.mo neuro-chem engine)
  public func withNeurochemicals(
    resident: HeartResident,
    nt      : NeurotransmitterInfluence,
  ) : HeartResident {
    { resident with neurochemicals = nt }
  };

}
