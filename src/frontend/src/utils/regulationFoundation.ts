import type {
  AutonomicState,
  CardioState,
  InteroceptiveState,
} from "./coreBrainSchemas";
import { SCHEMA_VERSION } from "./coreBrainSchemas";

export function computeInteroceptiveState(inputs: {
  rawStress: number;
  rawFatigue: number;
  rawUrgency: number;
  rawConfidence: number;
  exertion: number;
}): InteroceptiveState {
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const s = clamp(inputs.rawStress);
  const f = clamp(inputs.rawFatigue);
  const u = clamp(inputs.rawUrgency);
  return {
    schemaVersion: SCHEMA_VERSION,
    stressSignal: s,
    recoverySignal: clamp(1 - s * 0.7 - f * 0.3),
    fatigueLoad: f,
    urgencyPressure: u,
    stabilityPressure: clamp(1 - u),
    overloadLevel: clamp((s + f + u) / 3),
    confidencePressure: clamp(inputs.rawConfidence),
    selfStateWeight: clamp(s * 0.4 + f * 0.3 + u * 0.3),
    interoceptiveCoherence: clamp(1 - Math.abs(s - f) * 0.5),
  };
}

export function computeCardioState(
  interoceptive: InteroceptiveState,
  exertion: number,
): CardioState {
  const hr = 60 + exertion * 80 + interoceptive.stressSignal * 40;
  const hrv = Math.max(5, 80 - exertion * 50 - interoceptive.stressSignal * 30);
  const sustainedEffort = Math.min(
    1,
    (exertion + interoceptive.fatigueLoad) / 2,
  );
  const collapseRisk = Math.max(
    0,
    (interoceptive.fatigueLoad - 0.7) * 2 + (exertion - 0.8) * 1.5,
  );
  return {
    schemaVersion: SCHEMA_VERSION,
    heartRateProxy: hr,
    hrvProxy: hrv,
    circulationPressureProxy: Math.min(1, (hr - 60) / 120),
    recoveryCapacityProxy: Math.max(0, 1 - interoceptive.fatigueLoad),
    sustainedEffortIndex: sustainedEffort,
    exertionBurden: Math.min(1, exertion),
    cardioStabilityIndex: Math.max(0, 1 - collapseRisk * 0.5),
    collapseRiskProxy: Math.max(0, Math.min(1, collapseRisk)),
  };
}

export function computeANSState(
  cardio: CardioState,
  interoceptive: InteroceptiveState,
): AutonomicState {
  const sym = Math.min(
    1,
    interoceptive.stressSignal * 0.6 + interoceptive.urgencyPressure * 0.4,
  );
  const para = Math.min(
    1,
    interoceptive.recoverySignal * 0.7 + cardio.recoveryCapacityProxy * 0.3,
  );
  const balance = sym - para;
  let arousal: AutonomicState["arousalMode"] = "calm";
  if (sym > 0.8) arousal = "overloaded";
  else if (sym > 0.55) arousal = "reactive";
  else if (sym > 0.3) arousal = "alert";
  return {
    schemaVersion: SCHEMA_VERSION,
    sympatheticTone: sym,
    parasympatheticTone: para,
    autonomicBalanceIndex: balance,
    arousalMode: arousal,
    threatThresholdModifier: 1 - sym * 0.4,
    reactionSpeedModifier: 1 + sym * 0.5 - interoceptive.fatigueLoad * 0.3,
    recoveryTransitionState:
      interoceptive.recoverySignal > 0.6
        ? "recovering"
        : interoceptive.stressSignal > 0.7
          ? "transitioning"
          : "normal",
  };
}

export function applyThresholdShifts(
  baseThresholds: Record<string, number>,
  autonomic: AutonomicState,
  interoceptive: InteroceptiveState,
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const [key, base] of Object.entries(baseThresholds)) {
    const shift =
      -autonomic.sympatheticTone * 0.2 + interoceptive.fatigueLoad * 0.15;
    result[key] = Math.max(0.05, Math.min(0.95, base + shift));
  }
  return result;
}

export function computeRecoveryRate(
  cardio: CardioState,
  autonomic: AutonomicState,
): number {
  return Math.max(
    0,
    cardio.recoveryCapacityProxy * 0.6 + autonomic.parasympatheticTone * 0.4,
  );
}

export function checkOverload(
  interoceptive: InteroceptiveState,
  cardio: CardioState,
): { overloaded: boolean; severity: number; recommendations: string[] } {
  const severity = (interoceptive.overloadLevel + cardio.collapseRiskProxy) / 2;
  const overloaded = severity > 0.6;
  const recommendations: string[] = [];
  if (interoceptive.fatigueLoad > 0.7) recommendations.push("REDUCE_EXERTION");
  if (interoceptive.stressSignal > 0.8) recommendations.push("SEEK_COVER");
  if (cardio.collapseRiskProxy > 0.5) recommendations.push("EMERGENCY_REST");
  return { overloaded, severity, recommendations };
}

export function computeSustainedEffortCapacity(
  cardio: CardioState,
  interoceptive: InteroceptiveState,
): number {
  return Math.max(
    0,
    cardio.sustainedEffortIndex * (1 - interoceptive.fatigueLoad * 0.5),
  );
}
