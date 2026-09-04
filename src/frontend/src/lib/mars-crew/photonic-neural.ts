/**
 * Photon-to-neural-signal primitives for NeurospaceAI.
 *
 * This models a simplified sensor/retina pathway:
 * photons -> wavelength response -> Poisson arrivals -> temporal adaptation
 * -> event/spike output.
 *
 * It is an engineering and neuroscience-inspired simulator, not a clinical
 * model of a human eye or brain.
 */

export const PLANCK_CONSTANT_J_S = 6.626_070_15e-34;
export const SPEED_OF_LIGHT_M_S = 299_792_458;

export type PhotonField = {
  irradianceWPerM2: number;
  wavelengthNm: number;
  exposureAreaM2: number;
  exposureSeconds: number;
};

export type RetinalChannel = "rod" | "short-cone" | "medium-cone" | "long-cone";

export type NeuralEvent = {
  channel: RetinalChannel;
  timeSeconds: number;
  count: number;
  signal: number;
};

export type LIFState = {
  membranePotential: number;
  threshold: number;
  leakPerSecond: number;
  refractoryUntilSeconds: number;
};

function assertFiniteNonNegative(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be finite and non-negative`);
  }
}

export function photonEnergyJ(wavelengthNm: number): number {
  assertFiniteNonNegative(wavelengthNm, "wavelengthNm");
  if (wavelengthNm === 0) throw new Error("wavelengthNm must be positive");
  return (
    (PLANCK_CONSTANT_J_S * SPEED_OF_LIGHT_M_S) /
    (wavelengthNm * 1e-9)
  );
}

export function expectedPhotonCount(field: PhotonField): number {
  assertFiniteNonNegative(field.irradianceWPerM2, "irradianceWPerM2");
  assertFiniteNonNegative(field.exposureAreaM2, "exposureAreaM2");
  assertFiniteNonNegative(field.exposureSeconds, "exposureSeconds");
  return (
    (field.irradianceWPerM2 *
      field.exposureAreaM2 *
      field.exposureSeconds) /
    photonEnergyJ(field.wavelengthNm)
  );
}

/** Mulberry32 gives repeatable photon arrivals for replayable experiments. */
function seededRandom(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

/** Knuth's exact Poisson sampler for small and moderate photon counts. */
export function poissonSample(mean: number, seed = 1): number {
  assertFiniteNonNegative(mean, "mean");
  const random = seededRandom(seed);
  const limit = Math.exp(-mean);
  let product = 1;
  let count = 0;
  while (product > limit && count < 1_000_000) {
    product *= Math.max(random(), Number.MIN_VALUE);
    count += 1;
  }
  return Math.max(0, count - 1);
}

const spectralResponse: Record<RetinalChannel, (wavelengthNm: number) => number> = {
  rod: (wavelengthNm) =>
    Math.exp(-0.5 * ((wavelengthNm - 498) / 45) ** 2),
  "short-cone": (wavelengthNm) =>
    Math.exp(-0.5 * ((wavelengthNm - 420) / 35) ** 2),
  "medium-cone": (wavelengthNm) =>
    Math.exp(-0.5 * ((wavelengthNm - 534) / 45) ** 2),
  "long-cone": (wavelengthNm) =>
    Math.exp(-0.5 * ((wavelengthNm - 564) / 50) ** 2),
};

export function sampleRetinalEvent(
  field: PhotonField,
  channel: RetinalChannel,
  seed = 1,
): NeuralEvent {
  const response = spectralResponse[channel](field.wavelengthNm);
  const count = poissonSample(expectedPhotonCount(field) * response, seed);
  return {
    channel,
    timeSeconds: field.exposureSeconds,
    count,
    signal: count * response,
  };
}

/** One leaky integrate-and-fire update. */
export function stepLIF(
  state: LIFState,
  input: number,
  dtSeconds: number,
  timeSeconds: number,
): { state: LIFState; spike: boolean } {
  if (dtSeconds < 0) throw new Error("dtSeconds must be non-negative");
  const decay = Math.exp(-state.leakPerSecond * dtSeconds);
  const potential = state.membranePotential * decay + input * (1 - decay);
  const refractory = timeSeconds < state.refractoryUntilSeconds;
  const spike = !refractory && potential >= state.threshold;

  return {
    state: {
      ...state,
      membranePotential: spike ? 0 : potential,
      refractoryUntilSeconds: spike ? timeSeconds + 0.002 : state.refractoryUntilSeconds,
    },
    spike,
  };
}

/**
 * Difference-of-Gaussians-style contrast signal: a compact approximation of
 * center-surround retinal filtering before downstream neural processing.
 */
export function centerSurroundContrast(
  center: number,
  surround: number,
  centerWeight = 1,
  surroundWeight = 0.5,
): number {
  return centerWeight * center - surroundWeight * surround;
}
