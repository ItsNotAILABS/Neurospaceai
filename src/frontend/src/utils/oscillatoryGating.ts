// Oscillatory Gating — Neural Oscillations as Functional Gates
// Buzsaki & Draguhn 2004, Lisman & Jensen 2013, Jensen & Mazaheri 2010
//
// Theta (4-8 Hz):  gates episodic memory encoding/retrieval
// Gamma (30-80 Hz): gates local computation windows
// Alpha (8-12 Hz): active suppression of irrelevant regions
// Beta  (13-30 Hz): motor command gating

const TICKS_PER_SECOND = 10;

export interface OscillatoryState {
  thetaPhase: number; // [0, 2*pi]
  gammaPhase: number;
  alphaPhase: number;
  betaPhase: number;
  memoryEncodeGate: number; // theta trough → encode mode [0,1]
  memoryRetrieveGate: number; // theta peak → retrieve mode [0,1]
  localComputeGate: number; // gamma amplitude [0,1]
  suppressionGate: number; // alpha amplitude → suppression strength [0,1]
  motorGate: number; // beta gating of motor output [0,1]
  thetaGammaCoupling: number; // theta-gamma coupling strength [0,1]
  regionAlpha: Map<string, number>; // per-region alpha suppression
  encodingWindowOpen: boolean;
  retrievalWindowOpen: boolean;
  tick: number;
}

export function initOscillatoryState(): OscillatoryState {
  return {
    thetaPhase: 0,
    gammaPhase: 0,
    alphaPhase: 0,
    betaPhase: 0,
    memoryEncodeGate: 0,
    memoryRetrieveGate: 0,
    localComputeGate: 0.5,
    suppressionGate: 0,
    motorGate: 0.5,
    thetaGammaCoupling: 0.5,
    regionAlpha: new Map(),
    encodingWindowOpen: false,
    retrievalWindowOpen: false,
    tick: 0,
  };
}

export function updateOscillations(
  state: OscillatoryState,
  currentTick: number,
  acetylcholine: number,
  norepinephrine: number,
  taskClass: string,
  stressLevel: number,
): OscillatoryState {
  const TWO_PI = 2 * Math.PI;
  const thetaFreq = 6 + acetylcholine * 2; // 6-8 Hz (ACh boosts theta)
  const gammaFreq = 40 + norepinephrine * 30; // 40-70 Hz (NE boosts gamma)
  const alphaFreq = 10; // 10 Hz stable
  const betaFreq = 20 + stressLevel * 5; // 20-25 Hz

  state.thetaPhase =
    (state.thetaPhase + (TWO_PI * thetaFreq) / TICKS_PER_SECOND) % TWO_PI;
  state.gammaPhase =
    (state.gammaPhase + (TWO_PI * gammaFreq) / TICKS_PER_SECOND) % TWO_PI;
  state.alphaPhase =
    (state.alphaPhase + (TWO_PI * alphaFreq) / TICKS_PER_SECOND) % TWO_PI;
  state.betaPhase =
    (state.betaPhase + (TWO_PI * betaFreq) / TICKS_PER_SECOND) % TWO_PI;
  state.tick = currentTick;

  // Theta: trough (pi) = encode, peak (0) = retrieve
  const thetaCosine = Math.cos(state.thetaPhase);
  state.memoryEncodeGate = (1 - thetaCosine) / 2;
  state.memoryRetrieveGate = (1 + thetaCosine) / 2;
  state.encodingWindowOpen = state.memoryEncodeGate > 0.6;
  state.retrievalWindowOpen = state.memoryRetrieveGate > 0.6;

  // Alpha: ACh suppresses alpha power → more encoding
  const alphaPower = Math.max(0, 1 - acetylcholine * 0.6);
  state.suppressionGate = (alphaPower * (1 + Math.cos(state.alphaPhase))) / 2;

  // Gamma: local compute gate
  state.localComputeGate = (1 + Math.cos(state.gammaPhase)) / 2;
  if (taskClass === "EXPLORE" || taskClass === "MEMORY_RECALL") {
    state.localComputeGate = Math.min(1, state.localComputeGate * 1.2);
  }

  // Beta: motor gating (low beta = motor released)
  state.motorGate = 1 - (Math.cos(state.betaPhase) + 1) / 2;
  if (taskClass === "THREAT")
    state.motorGate = Math.min(1, state.motorGate + 0.3);

  // Theta-gamma coupling
  const gammaAmp = (1 + Math.cos(state.gammaPhase)) / 2;
  const couplingInstant = state.memoryEncodeGate * gammaAmp;
  state.thetaGammaCoupling +=
    (couplingInstant - state.thetaGammaCoupling) * 0.1;
  state.thetaGammaCoupling = Math.max(0, Math.min(1, state.thetaGammaCoupling));

  return state;
}

export function isRegionGatedToCompute(
  state: OscillatoryState,
  regionId: string,
  regionSalience: number,
): boolean {
  if (regionSalience > 0.7) return true; // high salience overrides suppression
  const regionAlphaLevel = state.regionAlpha.get(regionId) ?? 0;
  const effectiveSuppression = Math.min(
    1,
    state.suppressionGate + regionAlphaLevel,
  );
  const gammaAllows = state.localComputeGate > 0.3;
  const alphaBlocks = effectiveSuppression > 0.7 && regionSalience < 0.3;
  return gammaAllows && !alphaBlocks;
}

export function suppressRegions(
  state: OscillatoryState,
  suppressedRegionIds: string[],
  suppressionStrength: number,
): void {
  for (const id of suppressedRegionIds) {
    const current = state.regionAlpha.get(id) ?? 0;
    state.regionAlpha.set(id, Math.min(1, current + suppressionStrength));
  }
}

export function releaseRegionSuppression(
  state: OscillatoryState,
  regionId: string,
): void {
  const current = state.regionAlpha.get(regionId) ?? 0;
  state.regionAlpha.set(regionId, Math.max(0, current - 0.3));
}
