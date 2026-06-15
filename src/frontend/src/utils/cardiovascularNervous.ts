/**
 * Cardiovascular-Nervous Axis
 * Full bidirectional brain-heart coupling with:
 *   1. Baroreflex (MAP → NTS → vagal HR modulation)
 *   2. Respiratory Sinus Arrhythmia (RSA)
 *   3. Vagal Tone Index (HF-HRV proxy)
 *   4. Brain-Heart Coupling (bidirectional)
 *   5. Sympathetic Chain (Hypothalamus → LC-NE → epinephrine)
 *
 * References:
 *   Thayer JF & Lane RD (2000). A model of neurovisceral integration in
 *     emotion regulation and dysregulation. J Affect Disord 61(3):201-216.
 *   Porges SW (2007). The polyvagal perspective. Biol Psychol 74(2):116-143.
 *   Berntson GG et al. (1997). Heart rate variability: origins, methods,
 *     and interpretive caveats. Psychophysiology 34(6):623-648.
 *   Critchley HD (2009). Psychophysiology of neural, cognitive and affective
 *     integration: fMRI and autonomic indicants. Int J Psychophysiol 73(2):88-94.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const HR_BASE = 72; // BPM resting
const HR_MIN = 45;
const HR_MAX = 130;

// Sympathetic/parasympathetic gain constants
const K_SYM = 28; // BPM per unit sympathetic drive
const K_PARA = 22; // BPM per unit parasympathetic (vagal) output

// Baroreflex
const K_BARO = 0.3; // baroreceptor gain
const TAU_BARO = 15; // ticks for baroreflex lag

// RSA: normal adult breathing 12-20 breaths/min → 0.2-0.33 Hz
// At 10 ms/tick: 0.25 Hz → period = 400 ticks → phase step = 2π/400
const RESP_RATE_DEFAULT = 15; // breaths/min

// HRV / vagal tone
const RMSSD_SCALE = 50; // ms; maps rmssd [0,50ms] → [0,1]

// Sympathetic chain lag
const EPI_LAG_TICKS = 5;

function clamp(v: number, lo = 0, hi = 1): number {
  return Math.max(lo, Math.min(hi, v));
}

// ─── State ────────────────────────────────────────────────────────────────────

export interface CardioNervousState {
  // Cardiovascular
  heartRateBPM: number;
  strokeVolume: number; // [0,1] normalized
  cardiacOutput: number; // HR × SV normalized
  MAP: number; // mean arterial pressure [0,1]
  rrInterval: number; // current RR interval (ms)
  rrHistory: number[]; // last 30 RR intervals for HRV

  // Baroreflex
  baroreceptorFiring: number; // [0,1]
  NTSactivation: number; // nucleus tractus solitarius
  vagalOutput: number; // [0,1] current vagal brake strength
  baroBuffer: number[]; // delayed MAP for lag modeling

  // RSA
  respiratoryPhase: number; // 0 – 2π
  respiratoryRate: number; // breaths/min
  rsaAmplitude: number; // BPM fluctuation from RSA

  // Vagal tone / HRV
  vagalToneIndex: number; // HF-HRV proxy [0,1]
  rmssd: number; // ms; root mean square of successive differences

  // Brain-heart coupling
  pfcHeartCoupling: number; // top-down vagal modulation from PFC
  amygdalaSympatheticDrive: number; // Amygdala → sympathetic boost
  insulaInteroceptiveSignal: number; // heart coherence → Insula

  // Sympathetic chain
  hypothalamusActivation: number;
  lcNEfiring: number; // locus coeruleus
  epinephrineLevel: number; // [0,1] delayed release
  epinephrineBuffer: number[]; // shift register for lag

  // Coherence
  heartCoherence: number; // [0,1] low RR variance = coherent/healthy
}

export interface CardioOutputs {
  sympatheticTone: number; // [0,1] for ANS layer
  parasympatheticTone: number; // [0,1] for ANS layer
  stressContrib: number; // [0,1] stress contribution
  recoveryContrib: number; // [0,1] recovery contribution
  insulaFeedback: number; // heart coherence → Insula activation
  vagalTone: number; // HF-HRV index [0,1]
  heartCoherence: number;
  heartRateBPM: number;
  rmssd: number;
  rsaAmplitude: number;
  baroreceptorFiring: number;
}

export function initCardioNervousState(): CardioNervousState {
  return {
    heartRateBPM: HR_BASE,
    strokeVolume: 0.7,
    cardiacOutput: 0.5,
    MAP: 0.5,
    rrInterval: 60000 / HR_BASE,
    rrHistory: Array(30).fill(60000 / HR_BASE),

    baroreceptorFiring: 0.5,
    NTSactivation: 0.5,
    vagalOutput: 0.5,
    baroBuffer: Array(TAU_BARO).fill(0.5),

    respiratoryPhase: 0,
    respiratoryRate: RESP_RATE_DEFAULT,
    rsaAmplitude: 5, // BPM

    vagalToneIndex: 0.5,
    rmssd: 25,

    pfcHeartCoupling: 0.0,
    amygdalaSympatheticDrive: 0.0,
    insulaInteroceptiveSignal: 0.5,

    hypothalamusActivation: 0.3,
    lcNEfiring: 0.3,
    epinephrineLevel: 0.0,
    epinephrineBuffer: Array(EPI_LAG_TICKS).fill(0),

    heartCoherence: 0.7,
  };
}

/**
 * Brain state inputs required by the cardiovascular-nervous system.
 */
export interface CardioNervousBrainInput {
  pfcActivation: number;
  amygdalaActivation: number;
  insulaActivation: number;
  hypothalamusActivation: number;
  currentHR: number;
  stressSignal: number;
  recoverySignal: number;
}

/**
 * Update the full cardiovascular-nervous axis.
 * dt_ms = tick duration in milliseconds.
 */
export function updateCardioNervousSystem(
  state: CardioNervousState,
  brain: CardioNervousBrainInput,
  dt_ms: number,
): { state: CardioNervousState; outputs: CardioOutputs } {
  // ── 1. Brain-Heart Coupling (descending) ────────────────────────────────
  // PFC ↑ → vagal output ↑ (top-down regulation; Thayer & Lane 2000)
  const pfcHeartCoupling = clamp(brain.pfcActivation * 0.8);

  // Amygdala ↑ → sympathetic drive ↑ (threat response; Critchley 2009)
  const amygdalaSympatheticDrive = clamp(brain.amygdalaActivation * 0.9);

  // ── 2. Sympathetic Chain ────────────────────────────────────────────────
  // Hypothalamus → LC-NE → adrenal (epinephrine)
  // LC-NE firing driven by threat/stress (Aston-Jones & Cohen 2005)
  const lcNEfiring = clamp(
    brain.hypothalamusActivation * 0.4 +
      amygdalaSympatheticDrive * 0.4 +
      brain.stressSignal * 0.2,
  );

  // Epinephrine: shift-register lag (catecholamine release delay ~50ms)
  const epiBuf = [...state.epinephrineBuffer.slice(1), lcNEfiring * 0.7];
  const epinephrineLevel = clamp(epiBuf[0] ?? 0);

  // ── 3. RSA — Respiratory Sinus Arrhythmia ───────────────────────────────
  // Breathing rate modulated slightly by stress
  const respiratoryRate = clamp(
    RESP_RATE_DEFAULT + brain.stressSignal * 6 - brain.recoverySignal * 3,
    10,
    25,
  );
  // Phase step per tick: (rate breaths/min / 60 s/min × 1 s/1000 ms) × dt_ms × 2π
  const phaseStep = (respiratoryRate / 60) * (dt_ms / 1000) * 2 * Math.PI;
  const respiratoryPhase = (state.respiratoryPhase + phaseStep) % (2 * Math.PI);
  // Inspiration (sin > 0): inhibits vagal → HR ↑ transient
  const rsaModulation = Math.sin(respiratoryPhase); // range [-1, 1]
  const rsaAmplitude = clamp(5 + (1 - epinephrineLevel) * 8, 2, 15); // more amplitude when calm

  // ── 4. Baroreflex ────────────────────────────────────────────────────────
  // Stroke volume modulated by sympathetic (inotropic effect)
  const strokeVolume = clamp(
    0.5 + epinephrineLevel * 0.3 - pfcHeartCoupling * 0.1,
    0.3,
    1.0,
  );
  // MAP from HR × SV (simplified Ohm's law for cardiovascular)
  const prevHR = state.heartRateBPM;
  const mapRaw = clamp((prevHR / HR_MAX) * 0.6 + strokeVolume * 0.4);
  // Baroreflex shift register (lag)
  const baroBuf = [...state.baroBuffer.slice(1), mapRaw];
  const mapDelayed = baroBuf[0] ?? 0.5;
  // Baroreceptor firing: sigmoid response to MAP
  const baroreceptorFiring = clamp(0.3 + K_BARO * (mapDelayed - 0.5));
  // NTS activation from baroreceptors
  const NTSactivation = clamp(baroreceptorFiring * 0.9);
  // Vagal output: baroreflex (NTS) + PFC top-down - Amygdala suppression
  const vagalOutput = clamp(
    NTSactivation * 0.5 +
      pfcHeartCoupling * 0.3 +
      brain.recoverySignal * 0.2 -
      amygdalaSympatheticDrive * 0.3,
  );

  // ── 5. Heart Rate Integration ────────────────────────────────────────────
  // HR = HR_base + sympathetic drive - parasympathetic brake + RSA
  const symDrive = epinephrineLevel * K_SYM;
  const paraBrake = vagalOutput * K_PARA;
  const rsaBpmContrib = rsaModulation * rsaAmplitude;
  const targetHR = HR_BASE + symDrive - paraBrake + rsaBpmContrib;
  // Smooth toward target (tau ≈ 20 ticks = 200ms, heart rate inertia)
  const newHR = clamp(
    state.heartRateBPM + (targetHR - state.heartRateBPM) * 0.05,
    HR_MIN,
    HR_MAX,
  );

  // ── 6. HRV computation ───────────────────────────────────────────────────
  const rrMs = 60000 / newHR;
  const newRRHistory = [...state.rrHistory.slice(1), rrMs];
  // RMSSD = sqrt( mean of squared successive differences )
  let sumSqDiff = 0;
  for (let i = 1; i < newRRHistory.length; i++) {
    const diff = newRRHistory[i] - newRRHistory[i - 1];
    sumSqDiff += diff * diff;
  }
  const rmssd = Math.sqrt(sumSqDiff / Math.max(1, newRRHistory.length - 1));
  // Vagal tone index: RMSSD normalized (high RMSSD = good vagal tone)
  const vagalToneIndex = clamp(rmssd / RMSSD_SCALE);

  // ── 7. Heart Coherence ───────────────────────────────────────────────────
  // Low coefficient of variation of RR = coherent (rhythmic, healthy)
  const rrMean = newRRHistory.reduce((a, b) => a + b, 0) / newRRHistory.length;
  const rrVariance =
    newRRHistory.reduce((s, v) => s + (v - rrMean) ** 2, 0) /
    newRRHistory.length;
  const rrCV = Math.sqrt(rrVariance) / Math.max(rrMean, 1);
  // Low CV → high coherence (but some HRV is healthy, so floor at 0.2)
  const heartCoherence = clamp(1 - rrCV * 5, 0.2, 1.0);

  // ── 8. Insula Interoceptive Feedback (ascending) ─────────────────────────
  // Heart coherence feeds back to Insula (interoception loop)
  const insulaInteroceptiveSignal = heartCoherence;

  // ── 9. Cardiac Output ────────────────────────────────────────────────────
  const cardiacOutput = clamp((newHR / HR_MAX) * strokeVolume);
  const MAP = clamp(mapRaw);

  // ── Output assembly ──────────────────────────────────────────────────────
  const sympatheticTone = clamp(
    epinephrineLevel * 0.6 + amygdalaSympatheticDrive * 0.4,
  );
  const parasympatheticTone = clamp(vagalOutput * 0.7 + pfcHeartCoupling * 0.3);
  const stressContrib = clamp(
    sympatheticTone * 0.8 + (1 - vagalToneIndex) * 0.2,
  );
  const recoveryContrib = clamp(
    parasympatheticTone * 0.7 + vagalToneIndex * 0.3,
  );

  const newState: CardioNervousState = {
    heartRateBPM: newHR,
    strokeVolume,
    cardiacOutput,
    MAP,
    rrInterval: rrMs,
    rrHistory: newRRHistory,

    baroreceptorFiring,
    NTSactivation,
    vagalOutput,
    baroBuffer: baroBuf,

    respiratoryPhase,
    respiratoryRate,
    rsaAmplitude,

    vagalToneIndex,
    rmssd,

    pfcHeartCoupling,
    amygdalaSympatheticDrive,
    insulaInteroceptiveSignal,

    hypothalamusActivation: brain.hypothalamusActivation,
    lcNEfiring,
    epinephrineLevel,
    epinephrineBuffer: epiBuf,

    heartCoherence,
  };

  const outputs: CardioOutputs = {
    sympatheticTone,
    parasympatheticTone,
    stressContrib,
    recoveryContrib,
    insulaFeedback: insulaInteroceptiveSignal,
    vagalTone: vagalToneIndex,
    heartCoherence,
    heartRateBPM: newHR,
    rmssd,
    rsaAmplitude,
    baroreceptorFiring,
  };

  return { state: newState, outputs };
}
