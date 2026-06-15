// Regulation Score — 4th Scoring Dimension
// Reg_s = delta1*Stab + delta2*Rec + delta3*Bal + delta4*Flex
//   Stab = stability under pressure
//   Rec  = recovery quality after stress
//   Bal  = autonomic balance quality
//   Flex = adaptive behavioral flexibility under body-state load

export interface RegulationScoreState {
  stabilityHistory: number[];
  recoveryHistory: number[];
  balanceHistory: number[];
  flexibilityHistory: number[];
  stabilityScore: number;
  recoveryScore: number;
  balanceScore: number;
  flexibilityScore: number;
  compositeRegulationScore: number;
  peakStressThisPeriod: number;
  recoveryStartTick: number | null;
  recoveryLatency: number | null;
  weights: { stab: number; rec: number; bal: number; flex: number };
}

export function initRegulationScoreState(): RegulationScoreState {
  return {
    stabilityHistory: [],
    recoveryHistory: [],
    balanceHistory: [],
    flexibilityHistory: [],
    stabilityScore: 0.5,
    recoveryScore: 0.5,
    balanceScore: 0.5,
    flexibilityScore: 0.5,
    compositeRegulationScore: 0.5,
    peakStressThisPeriod: 0,
    recoveryStartTick: null,
    recoveryLatency: null,
    weights: { stab: 0.3, rec: 0.3, bal: 0.25, flex: 0.15 },
  };
}

export function updateRegulationScore(
  state: RegulationScoreState,
  inputs: {
    stressSignal: number;
    recoverySignal: number;
    autonomicBalanceIndex: number; // [-1,1] target ~+0.15
    hrvProxy: number;
    selfStatePressure: number;
    selfStateStability: number;
    behaviorAdaptedToState: boolean;
    currentTick: number;
  },
): RegulationScoreState {
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const { weights } = state;

  // STABILITY: HRV + self-state stability
  const stabilityInstant = clamp(
    inputs.hrvProxy * 0.4 +
      inputs.selfStateStability * 0.4 +
      (1 - inputs.selfStatePressure) * 0.2,
  );
  state.stabilityHistory = [...state.stabilityHistory, stabilityInstant].slice(
    -100,
  );
  state.stabilityScore =
    state.stabilityHistory.reduce((a, b) => a + b, 0) /
    Math.max(state.stabilityHistory.length, 1);

  // RECOVERY: measure latency from stress peak to recovery signal > 0.7
  if (inputs.stressSignal > state.peakStressThisPeriod) {
    state.peakStressThisPeriod = inputs.stressSignal;
  }
  if (
    state.recoveryStartTick === null &&
    state.peakStressThisPeriod > 0.5 &&
    inputs.stressSignal < state.peakStressThisPeriod * 0.5
  ) {
    state.recoveryStartTick = inputs.currentTick;
  }
  if (state.recoveryStartTick !== null && inputs.recoverySignal > 0.7) {
    state.recoveryLatency = inputs.currentTick - state.recoveryStartTick;
    const recoveryInstant = clamp(
      1 - Math.max(0, state.recoveryLatency - 10) / 50,
    );
    state.recoveryHistory = [...state.recoveryHistory, recoveryInstant].slice(
      -20,
    );
    state.recoveryScore =
      state.recoveryHistory.reduce((a, b) => a + b, 0) /
      Math.max(state.recoveryHistory.length, 1);
    state.recoveryStartTick = null;
    state.peakStressThisPeriod = inputs.stressSignal;
  }

  // BALANCE: target para-sympathetic dominance of ~+0.15
  const targetBalance = 0.15;
  const balanceError = Math.abs(inputs.autonomicBalanceIndex - targetBalance);
  const balanceInstant = clamp(1 - balanceError * 1.5);
  state.balanceHistory = [...state.balanceHistory, balanceInstant].slice(-100);
  state.balanceScore =
    state.balanceHistory.reduce((a, b) => a + b, 0) /
    Math.max(state.balanceHistory.length, 1);

  // FLEXIBILITY: did behavior match internal state?
  const flexInstant = inputs.behaviorAdaptedToState ? 1.0 : 0.3;
  state.flexibilityHistory = [...state.flexibilityHistory, flexInstant].slice(
    -50,
  );
  state.flexibilityScore =
    state.flexibilityHistory.reduce((a, b) => a + b, 0) /
    Math.max(state.flexibilityHistory.length, 1);

  state.compositeRegulationScore = clamp(
    weights.stab * state.stabilityScore +
      weights.rec * state.recoveryScore +
      weights.bal * state.balanceScore +
      weights.flex * state.flexibilityScore,
  );

  return state;
}
