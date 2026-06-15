/**
 * Neuromorphic Spiking — Leaky Integrate-and-Fire (LIF) model
 * for 5 gateway brain regions that act as gain-controllers for the
 * downstream Wilson-Cowan population dynamics.
 *
 * Biological parameters:
 *   V_threshold = -55 mV  (normalized to 1.0)
 *   V_rest      = -70 mV  (normalized to 0.0)
 *   V_reset     = -80 mV  (normalized to −0.15)
 *   tau_m       = 20 ms   membrane time constant
 *   tau_ref     = 2 ms    absolute refractory period (2 ticks @ 10 ms/tick)
 *   tau_AHP     = 50 ms   after-hyperpolarisation decay
 *   R_m         = 1.0     membrane resistance (normalized)
 *
 * References:
 *   Gerstner & Kistler (2002) Spiking Neuron Models, Cambridge UP.
 *   Izhikevich (2003) Simple model of spiking neurons, IEEE Trans NN.
 */

const GATEWAY_REGIONS = [
  "Thalamus",
  "Amygdala",
  "Hippocampus",
  "dACC",
  "LC-NE",
] as const;
export type GatewayRegion = (typeof GATEWAY_REGIONS)[number];

// LIF constants (all normalized)
const V_REST = 0.0;
const V_THRESHOLD = 1.0;
const V_RESET = -0.15;
const TAU_M = 20; // ms
const TAU_AHP = 50; // ms
const R_M = 1.0;
const REFRACTORY_TICKS = 2; // 2 × 10 ms = 20 ms (≈ tau_ref)
const AHP_INCREMENT = 0.3;
const BURST_WINDOW_MS = 50; // ms
const BURST_MIN_SPIKES = 3;

export interface LIFRegionState {
  V_m: number; // membrane potential [normalized, can be slightly negative]
  refractoryTicks: number; // countdown timer
  spikeHistory: number[]; // timestamps (ms) of recent spikes, kept within 100 ms
  isBursting: boolean;
  adaptationCurrent: number; // AHP current [0, 1]
  firingRate: number; // spikes / second estimate
  gainModulation: number; // [0.3, 2.0] — multiplier for downstream WC gain
}

export interface NeuromorphicState {
  regions: Map<string, LIFRegionState>;
  totalSpikes: number; // cumulative this session
  burstCount: number; // cumulative burst events
  networkFiringRate: number; // mean firing rate across gateway regions (Hz)
  energyCost: number; // normalized 0-1; scales with spike rate
  elapsedMs: number; // total simulated time in ms
}

function initLIFRegion(): LIFRegionState {
  return {
    V_m: V_REST,
    refractoryTicks: 0,
    spikeHistory: [],
    isBursting: false,
    adaptationCurrent: 0,
    firingRate: 0,
    gainModulation: 1.0,
  };
}

export function initNeuromorphicState(): NeuromorphicState {
  const regions = new Map<string, LIFRegionState>();
  for (const r of GATEWAY_REGIONS) {
    regions.set(r, initLIFRegion());
  }
  return {
    regions,
    totalSpikes: 0,
    burstCount: 0,
    networkFiringRate: 0,
    energyCost: 0,
    elapsedMs: 0,
  };
}

/**
 * Update the LIF model for all gateway regions.
 * populationActivations maps region IDs → Wilson-Cowan population activation [0,1].
 * dt_ms is the tick duration in milliseconds (typically 10 ms).
 */
export function updateNeuromorphicSpiking(
  state: NeuromorphicState,
  populationActivations: Map<string, number>,
  dt_ms: number,
): NeuromorphicState {
  const newRegions = new Map<string, LIFRegionState>();
  let totalSpikesThisTick = 0;
  let burstsThisTick = 0;
  const elapsedMs = state.elapsedMs + dt_ms;

  for (const regionId of GATEWAY_REGIONS) {
    const rs = state.regions.get(regionId) ?? initLIFRegion();
    const I_input = populationActivations.get(regionId) ?? 0;

    // Prune spike history older than 100 ms
    const pruned = rs.spikeHistory.filter((t) => elapsedMs - t <= 100);

    // Decay adaptation current: I_AHP(t) = I_AHP(0) * exp(-dt/tau_AHP)
    const adaptCurrent = rs.adaptationCurrent * Math.exp(-dt_ms / TAU_AHP);

    let V_m = rs.V_m;
    let refractoryTicks = rs.refractoryTicks;
    let spikeHistory = pruned;
    let spiked = false;

    if (refractoryTicks > 0) {
      // Absolute refractory: passive decay toward rest
      V_m = V_m + (dt_ms / TAU_M) * (V_REST - V_m);
      refractoryTicks = Math.max(0, refractoryTicks - 1);
    } else {
      // dV/dt = (-(V_m - V_rest) + R_m * I_input - I_AHP) / tau_m
      const dV =
        (dt_ms / TAU_M) * (-(V_m - V_REST) + R_M * I_input - adaptCurrent);
      V_m = V_m + dV;

      if (V_m >= V_THRESHOLD) {
        // Spike!
        spiked = true;
        V_m = V_RESET;
        refractoryTicks = REFRACTORY_TICKS;
        spikeHistory = [...pruned, elapsedMs];
        totalSpikesThisTick++;
      }
    }

    // Firing rate: spikes in last 100 ms × 10 (to get Hz)
    const spikesIn100ms = spikeHistory.filter(
      (t) => elapsedMs - t <= 100,
    ).length;
    const firingRate = spikesIn100ms * 10; // Hz

    // Burst detection: ≥3 spikes within last 50 ms
    const spikesIn50ms = spikeHistory.filter(
      (t) => elapsedMs - t <= BURST_WINDOW_MS,
    ).length;
    const isBursting = spikesIn50ms >= BURST_MIN_SPIKES;
    if (isBursting && !rs.isBursting) burstsThisTick++;

    // Gain modulation: high firing → gain boost; high adaptation → gain reduction
    const firingNorm = Math.min(firingRate / 80, 1.0); // normalize 0-80 Hz → 0-1
    const rawGain = 1.0 + 0.4 * firingNorm - 0.2 * adaptCurrent;
    const gainModulation = Math.max(0.3, Math.min(2.0, rawGain));

    newRegions.set(regionId, {
      V_m: Math.max(-0.5, Math.min(1.2, V_m)), // guard against runaway
      refractoryTicks,
      spikeHistory,
      isBursting,
      adaptationCurrent: spiked ? adaptCurrent + AHP_INCREMENT : adaptCurrent,
      firingRate,
      gainModulation,
    });
  }

  // Network-level metrics
  let totalFiringRate = 0;
  for (const rs of newRegions.values()) totalFiringRate += rs.firingRate;
  const networkFiringRate = totalFiringRate / GATEWAY_REGIONS.length;
  // Energy cost: proportional to spike rate (ATP-based, normalized)
  const energyCost = Math.min(
    1.0,
    (state.totalSpikes + totalSpikesThisTick) / 10000,
  );

  return {
    regions: newRegions,
    totalSpikes: state.totalSpikes + totalSpikesThisTick,
    burstCount: state.burstCount + burstsThisTick,
    networkFiringRate,
    energyCost,
    elapsedMs,
  };
}

/**
 * Get gain modulation value for a given region ID.
 * Returns 1.0 (neutral) for non-gateway regions.
 */
export function getGainModulation(
  state: NeuromorphicState,
  regionId: string,
): number {
  return state.regions.get(regionId)?.gainModulation ?? 1.0;
}
