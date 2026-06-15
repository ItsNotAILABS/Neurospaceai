// Core Brain Memory Persistence — cross-session weight reinstatement
// Saves STDP weight deltas and route preference vectors at session end.
// On session init, reloads them so the brain retains learned tendencies.

const STORAGE_KEY = "core_brain_weights_v1";
const ROUTE_KEY = "core_brain_routes_v1";
const MAX_SNAPSHOTS = 5; // keep last 5 sessions

export interface WeightSnapshot {
  sessionId: string;
  timestamp: number;
  coreBrainVersion: string;
  weights: Record<string, number>; // connKey -> delta
  routePreferences: Record<string, number>; // region -> preference score
  maturityScore: number;
}

export function saveWeightSnapshot(snapshot: WeightSnapshot): void {
  try {
    const existing = loadAllSnapshots();
    existing.unshift(snapshot);
    const trimmed = existing.slice(0, MAX_SNAPSHOTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn("[MemoryPersistence] Could not save snapshot:", e);
  }
}

export function loadAllSnapshots(): WeightSnapshot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WeightSnapshot[];
  } catch {
    return [];
  }
}

export function loadLatestSnapshot(): WeightSnapshot | null {
  const all = loadAllSnapshots();
  return all.length > 0 ? all[0] : null;
}

export function clearSnapshots(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ROUTE_KEY);
}

export function getMemoryStats(): {
  snapshotCount: number;
  oldestSession: string | null;
  newestSession: string | null;
} {
  const all = loadAllSnapshots();
  return {
    snapshotCount: all.length,
    oldestSession: all.length > 0 ? all[all.length - 1].sessionId : null,
    newestSession: all.length > 0 ? all[0].sessionId : null,
  };
}
