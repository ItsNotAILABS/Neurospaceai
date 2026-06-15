/**
 * Global Workspace Theory (GWT) Implementation
 * Based on Baars (1988) and Dehaene et al. (2011).
 *
 * The global workspace: a 'blackboard' architecture where a coalition
 * of highly active, salient, and precise regions wins a competition and
 * broadcasts their content globally — making information available to
 * all specialist modules simultaneously.
 *
 * References:
 *   Baars BJ (1988) A Cognitive Theory of Consciousness. Cambridge UP.
 *   Dehaene S, Changeux JP (2011) Experimental and theoretical approaches
 *     to conscious processing. Neuron 70(2):200-227.
 *   Mashour GA et al. (2020) Conscious Processing and the Global Neuronal
 *     Workspace Hypothesis. Neuron 105(5):776-798.
 */

const IGNITION_THRESHOLD = 0.65; // combined activation × salience × precision
const PRE_BROADCAST_WINDOW = 20; // ticks (200 ms competition window)
const WORKSPACE_REFRACTORY = 30; // ticks (~300 ms refractory after broadcast)
const BROADCAST_DURATION = 5; // ticks broadcast remains active
const TOP_K_COALITION = 5; // max coalition size

export interface GWTBroadcast {
  dominantRegion: string;
  coalition: string[];
  activationLevel: number;
  cognitiveMode: string;
  coherence: number;
  tick: number;
}

export interface GlobalWorkspaceState {
  broadcastActive: boolean;
  broadcastTicksRemaining: number;
  currentBroadcast: GWTBroadcast | null;
  ignitionEvents: number;
  meanCoalitionSize: number;
  workspaceCoherence: number; // cosine-similarity-like measure of coalition
  globalAvailability: number; // [0,1] current tick information access
  workspaceRefractoryTicks: number; // countdown to allow next ignition
  candidateAccumulator: Map<string, number>; // accumulates combined score per region
  competitionTick: number; // how long current competition has run
  coalitionSizeHistory: number[]; // for mean computation
  coherenceHistory: number[]; // for reporting
  broadcastHistory: GWTBroadcast[]; // last 10 broadcasts
}

export function initGlobalWorkspaceState(): GlobalWorkspaceState {
  return {
    broadcastActive: false,
    broadcastTicksRemaining: 0,
    currentBroadcast: null,
    ignitionEvents: 0,
    meanCoalitionSize: 0,
    workspaceCoherence: 0,
    globalAvailability: 0,
    workspaceRefractoryTicks: 0,
    candidateAccumulator: new Map(),
    competitionTick: 0,
    coalitionSizeHistory: [],
    coherenceHistory: [],
    broadcastHistory: [],
  };
}

/**
 * Compute a cognitive mode label from the coalition.
 * This is a pure decoder — no scripted behavior.
 */
function inferCognitiveMode(
  coalition: string[],
  activations: Map<string, number>,
): string {
  const avg = (regions: string[]) =>
    regions.reduce((s, r) => s + (activations.get(r) ?? 0), 0) /
    Math.max(regions.length, 1);

  const threatScore = avg(["Amygdala", "PAG", "BedNucleus"]);
  const rewardScore = avg(["NucleusAccumbens", "VentralTegmentalArea"]);
  const memScore = avg(["Hippocampus", "EntorhinalCortex"]);
  const execScore = avg([
    "PrefrontalCortex",
    "DLPFC",
    "AnteriorCingulateCortex",
  ]);
  const thalScore = avg(["Thalamus"]);

  const scores: Record<string, number> = {
    THREAT_APPRAISAL: threatScore,
    REWARD_PURSUIT: rewardScore,
    MEMORY_RECALL: memScore,
    EXECUTIVE_CONTROL: execScore,
    SENSORY_RELAY: thalScore,
    EXPLORATORY_CURIOSITY: (rewardScore + thalScore) * 0.5,
    ORIENT: coalition.includes("Thalamus") ? 0.5 : 0,
  };

  let best = "ORIENT";
  let bestVal = 0;
  for (const [mode, val] of Object.entries(scores)) {
    if (val > bestVal) {
      bestVal = val;
      best = mode;
    }
  }
  return best;
}

/**
 * Compute coalition coherence: mean pairwise activation similarity
 * (simplified cosine-similarity proxy).
 */
function computeCoalitionCoherence(
  coalition: string[],
  activations: Map<string, number>,
): number {
  if (coalition.length < 2) return 1.0;
  const vals = coalition.map((r) => activations.get(r) ?? 0);
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const variance = vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length;
  // Coherence = 1 - normalized std (low variance among coalition = high coherence)
  return Math.max(0, Math.min(1, 1 - Math.sqrt(variance)));
}

/**
 * Update the global workspace state.
 * @param state    current GWT state
 * @param activations   region activation map
 * @param salienceMap   region salience map
 * @param precisionMap  region precision (inverse variance) map
 * @param currentTick   simulation tick counter
 */
export function updateGlobalWorkspace(
  state: GlobalWorkspaceState,
  activations: Map<string, number>,
  salienceMap: Map<string, number>,
  precisionMap: Map<string, number>,
  currentTick: number,
): GlobalWorkspaceState {
  // Decay refractory
  const refractoryTicks = Math.max(0, state.workspaceRefractoryTicks - 1);
  const broadcastTicksRemaining = Math.max(
    0,
    state.broadcastTicksRemaining - 1,
  );
  const broadcastActive = broadcastTicksRemaining > 0;

  // Compute combined ignition score for each region
  const combinedScores = new Map<string, number>();
  for (const [regionId, act] of activations.entries()) {
    const sal = salienceMap.get(regionId) ?? act;
    const prec = precisionMap.get(regionId) ?? 0.5;
    const score = act * Math.sqrt(sal) * (0.5 + 0.5 * prec);
    combinedScores.set(regionId, score);
  }

  // Accumulate candidate evidence (prevents single-tick false ignitions)
  const newAccumulator = new Map<string, number>(state.candidateAccumulator);
  const ACCUMULATION_DECAY = 0.85;
  for (const [r, score] of combinedScores.entries()) {
    const prev = (newAccumulator.get(r) ?? 0) * ACCUMULATION_DECAY;
    newAccumulator.set(r, prev + score * (1 - ACCUMULATION_DECAY));
  }

  // Find candidates above ignition threshold in accumulated signal
  const candidates: Array<{ region: string; score: number }> = [];
  for (const [r, acc] of newAccumulator.entries()) {
    if (acc > IGNITION_THRESHOLD) {
      candidates.push({ region: r, score: acc });
    }
  }

  // Sort by score, take top-K
  candidates.sort((a, b) => b.score - a.score);
  const topCandidates = candidates.slice(0, TOP_K_COALITION);

  let competitionTick = state.competitionTick;
  let newIgnitionEvents = state.ignitionEvents;
  let newCoalitionSizeHistory = [...state.coalitionSizeHistory];
  let newCoherenceHistory = [...state.coherenceHistory];
  let newBroadcastHistory = [...state.broadcastHistory];
  let newBroadcastActive = broadcastActive;
  let newBroadcastTicksRemaining = broadcastTicksRemaining;
  let newRefractoryTicks = refractoryTicks;
  let newCurrentBroadcast = state.currentBroadcast;
  let globalAvailability = broadcastActive ? 1.0 : 0.0;

  // Attempt ignition if candidates exist and workspace not refractory
  if (topCandidates.length >= 2 && refractoryTicks === 0) {
    competitionTick++;
    if (competitionTick >= PRE_BROADCAST_WINDOW) {
      // IGNITION: broadcast fires
      const coalition = topCandidates.map((c) => c.region);
      const dominantRegion = topCandidates[0]?.region ?? "Unknown";
      const activationLevel = topCandidates[0]?.score ?? 0;
      const coherence = computeCoalitionCoherence(coalition, activations);
      const cognitiveMode = inferCognitiveMode(coalition, activations);

      const broadcast: GWTBroadcast = {
        dominantRegion,
        coalition,
        activationLevel,
        cognitiveMode,
        coherence,
        tick: currentTick,
      };

      newBroadcastActive = true;
      newBroadcastTicksRemaining = BROADCAST_DURATION;
      newCurrentBroadcast = broadcast;
      newIgnitionEvents++;
      newRefractoryTicks = WORKSPACE_REFRACTORY;
      competitionTick = 0;
      globalAvailability = 1.0;

      newCoalitionSizeHistory = [
        ...newCoalitionSizeHistory.slice(-50),
        coalition.length,
      ];
      newCoherenceHistory = [...newCoherenceHistory.slice(-50), coherence];
      newBroadcastHistory = [broadcast, ...newBroadcastHistory.slice(0, 9)];
    }
  } else if (topCandidates.length < 2) {
    competitionTick = 0; // reset competition if candidates drop out
  }

  const meanCoalitionSize =
    newCoalitionSizeHistory.length > 0
      ? newCoalitionSizeHistory.reduce((a, b) => a + b, 0) /
        newCoalitionSizeHistory.length
      : 0;
  const workspaceCoherence =
    newCoherenceHistory.length > 0
      ? newCoherenceHistory.reduce((a, b) => a + b, 0) /
        newCoherenceHistory.length
      : 0;

  return {
    broadcastActive: newBroadcastActive,
    broadcastTicksRemaining: newBroadcastTicksRemaining,
    currentBroadcast: newCurrentBroadcast,
    ignitionEvents: newIgnitionEvents,
    meanCoalitionSize,
    workspaceCoherence,
    globalAvailability,
    workspaceRefractoryTicks: newRefractoryTicks,
    candidateAccumulator: newAccumulator,
    competitionTick,
    coalitionSizeHistory: newCoalitionSizeHistory,
    coherenceHistory: newCoherenceHistory,
    broadcastHistory: newBroadcastHistory,
  };
}
