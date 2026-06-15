// Self-State Model — Phase 4 Additional Systems
// Bounded internal meta-model: what cognitive/body state am I currently in?
// Variables are graded [0-1], derived from actual neural + ANS + drive state.
// Feeds back into: action gating, hesitation, confidence modulation.
//
// "what state am I in" → drives thought decoder interpretation
// "how pressured am I" → affects action urgency and persistence
// "how stable am I" → gates complex planning vs survival mode
// "how confident am I" → threshold for action commitment
// "how urgent is action" → determines wait vs commit transition

export interface SelfStateModel {
  // Core dimensions
  currentStateLabel: string; // discrete readable label
  pressure: number; // 0-1: composite internal pressure (stress + hunger + threat)
  stability: number; // 0-1: how stable/coherent internal state is
  confidence: number; // 0-1: epistemic confidence in current action plan
  urgency: number; // 0-1: how urgently action is needed
  regulation: number; // 0-1: autonomic regulation quality (inverse of stress)
  // Derived signals for behavior modulation
  shouldHesitate: boolean; // high uncertainty + moderate urgency
  shouldCommit: boolean; // high confidence + high urgency
  shouldWithdraw: boolean; // extreme pressure + low stability
  actionThreshold: number; // dynamic gate threshold for action commitment
  // History for trend detection
  pressureHistory: number[]; // last 20 ticks
  stabilityHistory: number[];
}

export function initSelfStateModel(): SelfStateModel {
  return {
    currentStateLabel: "CALIBRATING",
    pressure: 0.2,
    stability: 0.7,
    confidence: 0.5,
    urgency: 0.2,
    regulation: 0.7,
    shouldHesitate: false,
    shouldCommit: false,
    shouldWithdraw: false,
    actionThreshold: 0.5,
    pressureHistory: [],
    stabilityHistory: [],
  };
}

export function updateSelfStateModel(
  prev: SelfStateModel,
  inputs: {
    stressSignal: number; // from ANS
    recoverySignal: number; // from ANS
    hungerDrive: number; // 0-1
    threatLevel: number; // Amygdala activation
    pfcActivation: number; // PFC — executive control
    metacognitiveConfidence: number; // from existing metacog monitor
    globalArousal: number; // 0-1
    conflictSignal: number; // dACC activation
    predictionMismatch: number; // from prediction layer
  },
): SelfStateModel {
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const ema = (prev: number, now: number, lr: number) =>
    prev + (now - prev) * lr;

  // Pressure: composite of stress, hunger, threat
  const pressureRaw = clamp(
    inputs.stressSignal * 0.35 +
      inputs.hungerDrive * 0.25 +
      inputs.threatLevel * 0.3 +
      (1 - inputs.recoverySignal) * 0.1,
  );
  const pressure = clamp(ema(prev.pressure, pressureRaw, 0.12));

  // Stability: inversely related to prediction mismatch, conflict, and arousal variance
  const stabilityRaw = clamp(
    inputs.pfcActivation * 0.4 +
      (1 - inputs.predictionMismatch) * 0.3 +
      (1 - inputs.conflictSignal) * 0.2 +
      inputs.recoverySignal * 0.1,
  );
  const stability = clamp(ema(prev.stability, stabilityRaw, 0.08));

  // Confidence: metacognitive + PFC + inverse arousal
  const confidenceRaw = clamp(
    inputs.metacognitiveConfidence * 0.5 +
      inputs.pfcActivation * 0.3 +
      (1 - Math.abs(inputs.globalArousal - 0.5) * 2) * 0.2,
  );
  const confidence = clamp(ema(prev.confidence, confidenceRaw, 0.1));

  // Urgency: threat + hunger + arousal spike
  const urgencyRaw = clamp(
    inputs.threatLevel * 0.45 +
      inputs.hungerDrive * 0.3 +
      inputs.globalArousal * 0.25,
  );
  const urgency = clamp(ema(prev.urgency, urgencyRaw, 0.15));

  // Regulation quality
  const regulation = clamp(
    inputs.recoverySignal * 0.7 + (1 - inputs.stressSignal) * 0.3,
  );

  // Behavior flags
  const shouldHesitate = confidence < 0.4 && urgency > 0.3 && urgency < 0.8;
  const shouldCommit = confidence > 0.65 && urgency > 0.55;
  const shouldWithdraw = pressure > 0.8 && stability < 0.3;

  // Dynamic action threshold — lower when urgent/threatened, higher when calm/exploring
  const actionThreshold = clamp(0.5 - urgency * 0.2 + stability * 0.1);

  // State label
  let currentStateLabel: string;
  if (shouldWithdraw) currentStateLabel = "OVERWHELMED";
  else if (pressure > 0.7) currentStateLabel = "HIGH_PRESSURE";
  else if (shouldCommit) currentStateLabel = "ACTION_READY";
  else if (shouldHesitate) currentStateLabel = "ASSESSING";
  else if (stability > 0.7 && confidence > 0.6)
    currentStateLabel = "STABLE_CONFIDENT";
  else if (urgency > 0.6) currentStateLabel = "ALERT";
  else if (regulation > 0.7) currentStateLabel = "REGULATED";
  else currentStateLabel = "TRANSITIONING";

  // History (last 20 ticks)
  const pressureHistory = [...prev.pressureHistory, pressure].slice(-20);
  const stabilityHistory = [...prev.stabilityHistory, stability].slice(-20);

  return {
    currentStateLabel,
    pressure,
    stability,
    confidence,
    urgency,
    regulation,
    shouldHesitate,
    shouldCommit,
    shouldWithdraw,
    actionThreshold,
    pressureHistory,
    stabilityHistory,
  };
}

export function getSelfStateEventType(model: SelfStateModel): string | null {
  if (model.shouldWithdraw) return "OVERWHELM_TRIGGER";
  if (model.shouldCommit && model.confidence > 0.8)
    return "HIGH_CONFIDENCE_ACTION";
  if (model.pressure > 0.75 && model.stability < 0.3)
    return "INSTABILITY_WARNING";
  return null;
}
