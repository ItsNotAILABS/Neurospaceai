// Attractor Dynamics — Working Memory via Energy Landscape
// WM is held by stable attractors, not a simple buffer array.
// Based on Hopfield 1982 (energy function) and
// Compte et al. 2000 (persistent activity in PFC via NMDA recurrence).
//
// Energy: E(x) = -0.5 * xT * W_rec * x + Phi(x)
// New input must overcome attractor energy barrier to update WM state.
// This gives persistence without scripting it.

const MAX_WM_ITEMS = 7; // Miller's Law (Miller 1956: 7 +/- 2)
const ENERGY_BARRIER = 0.35;
const ATTRACTOR_DECAY = 0.005;
const RECURRENT_STRENGTH = 0.6; // NMDA-like recurrent excitation

export interface AttractorItem {
  regionId: string;
  activation: number;
  energy: number;
  encodedAt: number;
  reinforced: number;
  salience: number;
  novelty: number;
}

export interface AttractorState {
  items: AttractorItem[];
  globalEnergy: number;
  capacity: number; // items / MAX_WM_ITEMS
  dominantItem: string | null;
  lastUpdateTick: number;
  displacementEvents: number;
  reinforcementEvents: number;
}

export function initAttractorState(): AttractorState {
  return {
    items: [],
    globalEnergy: 0,
    capacity: 0,
    dominantItem: null,
    lastUpdateTick: 0,
    displacementEvents: 0,
    reinforcementEvents: 0,
  };
}

function computeItemEnergy(
  item: AttractorItem,
  allItems: AttractorItem[],
): number {
  let energy = -(item.activation * item.activation * 0.5);
  for (const other of allItems) {
    if (other.regionId === item.regionId) continue;
    energy -= item.activation * other.activation * RECURRENT_STRENGTH * 0.1;
  }
  return energy;
}

export function attemptWMEncode(
  state: AttractorState,
  regionId: string,
  incomingActivation: number,
  incomingSalience: number,
  incomingNovelty: number,
  currentTick: number,
  gatingSignal: number, // PFC gate g_i must be > 0.65
): { encoded: boolean; displaced: string | null } {
  if (gatingSignal < 0.65) return { encoded: false, displaced: null };

  const existing = state.items.find((i) => i.regionId === regionId);
  if (existing) {
    existing.activation = Math.min(
      1,
      existing.activation + incomingActivation * 0.3,
    );
    existing.energy = computeItemEnergy(existing, state.items);
    existing.reinforced++;
    state.reinforcementEvents++;
    return { encoded: true, displaced: null };
  }

  const incomingEnergy = -(incomingActivation * incomingActivation * 0.5);

  if (state.items.length < MAX_WM_ITEMS) {
    if (incomingActivation < 0.25) return { encoded: false, displaced: null };
    state.items.push({
      regionId,
      activation: incomingActivation,
      energy: incomingEnergy,
      encodedAt: currentTick,
      reinforced: 0,
      salience: incomingSalience,
      novelty: incomingNovelty,
    });
    state.capacity = state.items.length / MAX_WM_ITEMS;
    state.dominantItem = state.items.reduce((a, b) =>
      a.activation > b.activation ? a : b,
    ).regionId;
    state.lastUpdateTick = currentTick;
    return { encoded: true, displaced: null };
  }

  const weakest = state.items.reduce((a, b) =>
    a.activation < b.activation ? a : b,
  );
  const displacementDelta = Math.abs(incomingEnergy) - Math.abs(weakest.energy);

  if (displacementDelta > ENERGY_BARRIER * incomingSalience) {
    const displacedId = weakest.regionId;
    state.items = state.items.filter((i) => i.regionId !== weakest.regionId);
    state.items.push({
      regionId,
      activation: incomingActivation,
      energy: incomingEnergy,
      encodedAt: currentTick,
      reinforced: 0,
      salience: incomingSalience,
      novelty: incomingNovelty,
    });
    state.displacementEvents++;
    state.capacity = state.items.length / MAX_WM_ITEMS;
    state.dominantItem = state.items.reduce((a, b) =>
      a.activation > b.activation ? a : b,
    ).regionId;
    state.lastUpdateTick = currentTick;
    return { encoded: true, displaced: displacedId };
  }

  return { encoded: false, displaced: null };
}

export function decayAttractors(
  state: AttractorState,
  currentTick: number,
): void {
  for (const item of state.items) {
    const ageFactor = 1 + (currentTick - item.encodedAt) * 0.001;
    const reinforceFactor = Math.max(0.3, 1 - item.reinforced * 0.05);
    item.activation = Math.max(
      0,
      item.activation - ATTRACTOR_DECAY * ageFactor * reinforceFactor,
    );
    item.energy = computeItemEnergy(item, state.items);
  }
  state.items = state.items.filter((i) => i.activation > 0.05);
  state.globalEnergy = state.items.reduce(
    (sum, i) => sum + Math.abs(i.energy),
    0,
  );
  state.capacity = state.items.length / MAX_WM_ITEMS;
  state.dominantItem =
    state.items.length > 0
      ? state.items.reduce((a, b) => (a.activation > b.activation ? a : b))
          .regionId
      : null;
}

export function getWMActivationOverlay(
  state: AttractorState,
): Map<string, number> {
  const overlay = new Map<string, number>();
  for (const item of state.items) {
    overlay.set(item.regionId, item.activation * 0.2);
  }
  return overlay;
}
