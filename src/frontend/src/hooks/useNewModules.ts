/**
 * useNewModules.ts — React Query hooks for new sovereign backend modules
 * All polls at 873ms (PHI^4 × Schumann period) unless noted otherwise.
 * Uses (actor as any) for new methods not yet in backend.d.ts bindings.
 */

import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

// ── Shared factory ────────────────────────────────────────────────────────────
function mkMod<T>(
  key: string,
  fn: (actor: unknown) => Promise<T>,
  interval = 873,
) {
  return function useHook() {
    const { actor, isFetching } = useActor();
    return useQuery<T | null>({
      queryKey: [key],
      queryFn: async () => {
        if (!actor) return null;
        try {
          return await fn(actor);
        } catch {
          return null;
        }
      },
      enabled: !!actor && !isFetching,
      refetchInterval: interval,
      staleTime: 0,
    });
  };
}

// ── Heart State ────────────────────────────────────────────────────────────────
export interface HeartState {
  bpm: number;
  stroke_volume: number;
  cardiac_output: number;
  sa_node_rate: number;
  av_delay_ms: number;
  repolarization_state: number;
  refractory_active: boolean;
  vagal_dominance: boolean;
  sympathetic_surge: boolean;
  baroreceptor_dir: number; // -1.0 to 1.0
  acetylcholine: number;
  norepinephrine: number;
  calcium_ion: number;
  potassium_ion: number;
  beat: bigint;
}
export const useHeartState = mkMod<HeartState>("heartState", (a) =>
  (a as any).getHeartState(),
);

// ── ECG Buffer ────────────────────────────────────────────────────────────────
export const useECGBuffer = mkMod<number[]>("ecgBuffer", (a) =>
  (a as any).getECGBuffer(),
);

// ── Heart Rate BPM ────────────────────────────────────────────────────────────
export const useHeartRateBPM = mkMod<number>("heartRateBPM", (a) =>
  (a as any).getHeartRateBPM(),
);

// ── HRV State ─────────────────────────────────────────────────────────────────
export interface HRVState {
  sdnn: number;
  rmssd: number;
  lf_hf_ratio: number;
  pnn50: number;
  hrv_index: number;
}
export const useHRVState = mkMod<HRVState>("hrvState", (a) =>
  (a as any).getHRVState(),
);

// ── Cardiac Output ────────────────────────────────────────────────────────────
export interface CardiacOutput {
  liters_per_min: number;
  stroke_volume: number;
  ejection_fraction: number;
  preload: number;
  afterload: number;
}
export const useCardiacOutput = mkMod<CardiacOutput>("cardiacOutput", (a) =>
  (a as any).getCardiacOutput(),
);

// ── Neural Cord State ─────────────────────────────────────────────────────────
export interface NeuralCordState {
  ascending_hz: number;
  descending_hz: number;
  stdp_events: bigint;
  myelination_index: number;
  cord_coherence: number;
  conduction_velocity: number;
  synaptic_strength: number;
}
export const useNeuralCordState = mkMod<NeuralCordState>(
  "neuralCordState",
  (a) => (a as any).getNeuralCordState(),
);

// ── Brain Regions ─────────────────────────────────────────────────────────────
export interface BrainRegion {
  name: string;
  activation: number;
  organism_mapping: string;
  neurotransmitter: string;
  oscillation_hz: number;
}
export const useBrainRegions = mkMod<BrainRegion[]>("brainRegions", (a) =>
  (a as any).getBrainRegions(),
);

// ── Spike Rate Hz ─────────────────────────────────────────────────────────────
export const useSpikeRateHz = mkMod<number>("spikeRateHz", (a) =>
  (a as any).getSpikeRateHz(),
);

// ── Third Brain Coherence ─────────────────────────────────────────────────────
export interface ThirdBrainCoherence {
  enteric_coherence: number;
  serotonin_field: number;
  cosmological_lock: boolean;
  schumann_resonance: number;
  standing_waves: number[];
  drift_correction_active: boolean;
}
export const useThirdBrainCoherence = mkMod<ThirdBrainCoherence>(
  "thirdBrainCoherence",
  (a) => (a as any).getThirdBrainCoherence(),
);

// ── Ancient Corpus State ───────────────────────────────────────────────────────
export interface AncientCivState {
  name: string;
  symbol: string;
  current_value: number;
  active_formula: string;
  computation_result: string;
  cycle_progress: number;
  phi_alignment: number;
}
export interface AncientCorpusState {
  civilizations: AncientCivState[];
  master_phi_check: boolean;
  active_civilization_idx: number;
  beat_alignment_score: number;
  convergence_ratio: number;
  total_beats: bigint;
}
export const useAncientCorpusState = mkMod<AncientCorpusState>(
  "ancientCorpusState",
  (a) => (a as any).getAncientCorpusState(),
);

// ── Ancient Beat Alignment (query call with beat count arg) ───────────────────
export function useAncientBeatAlignment(beatCount: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<string | null>({
    queryKey: ["ancientBeatAlignment", beatCount.toString()],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await (actor as any).computeAncientBeatAlignment(beatCount);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 873,
    staleTime: 0,
  });
}

// ── Geometry State ────────────────────────────────────────────────────────────
export interface GeometryState {
  e8_symmetry_score: number;
  tesseract_w: number;
  tesseract_x: number;
  tesseract_y: number;
  tesseract_z: number;
  hopf_fiber_angles: number[];
  quaternion_r: number;
  quaternion_i: number;
  quaternion_j: number;
  quaternion_k: number;
  penrose_memory_addresses: number[];
  calabi_yau_points: number[];
  octonion_strength: number;
  ring0_node_positions: number[];
  law_manifold_curvature: number;
}
export const useGeometryState = mkMod<GeometryState>("geometryState", (a) =>
  (a as any).getGeometryState(),
);

// ── Octonion Field Strength ────────────────────────────────────────────────────
export const useOctonionFieldStrength = mkMod<number>(
  "octonionFieldStrength",
  (a) => (a as any).octonionFieldStrength(),
);

// ── AEGIS Events ──────────────────────────────────────────────────────────────
export interface AegisEvent {
  ring_id: number;
  event_type: string;
  drift_score: number;
  correction_applied: boolean;
  beat: bigint;
  description: string;
}
export const useAegisEvents = mkMod<AegisEvent[]>("aegisEvents", (a) =>
  (a as any).getAegisEvents(),
);

// ── AEGIS Summary ─────────────────────────────────────────────────────────────
export interface AegisSummary {
  total_corrections: bigint;
  active_monitors: number;
  fear_blend_active: boolean;
  rolling_min_score: number;
  edge_conditions_caught: bigint;
}
export const useAegisSummary = mkMod<AegisSummary>("aegisSummary", (a) =>
  (a as any).getAegisSummary(),
);

// ── AEGIS Health Score ────────────────────────────────────────────────────────
export const useAegisHealthScore = mkMod<number>("aegisHealthScore", (a) =>
  (a as any).getAegisHealthScore(),
);

// ── Financial State ───────────────────────────────────────────────────────────
export interface FinancialState {
  total_balance_icp: number;
  total_balance_e8s: bigint;
  total_entries: bigint;
  total_artifacts_sealed: bigint;
  best_artifact_value_icp: number;
  mean_quality_score: number;
  ledger_hash: string;
  founder_attribution: string;
  genesis_sealed: boolean;
  last_update_beat: bigint;
}
export const useFinancialState = mkMod<FinancialState>(
  "financialState",
  (a) => (a as any).getFinancialState(),
  2000,
);

// ── Ledger ────────────────────────────────────────────────────────────────────
export interface LedgerEntry {
  id: string;
  entry_type: string;
  producer: string;
  token_amount_icp: number;
  quality_score: number;
  doctrine_score: number;
  beat: bigint;
  sacesi_hash: string;
  genesis_alignment: number;
}
export const useLedger = mkMod<LedgerEntry[]>(
  "ledger",
  (a) => (a as any).getLedger(),
  2000,
);

// ── Token Reward Computation ───────────────────────────────────────────────────
export function useComputeTokenReward(quality: number, doctrine: number) {
  const { actor, isFetching } = useActor();
  return useQuery<number | null>({
    queryKey: ["computeTokenReward", quality, doctrine],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await (actor as any).computeTokenReward(quality, doctrine);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 873,
    staleTime: 0,
  });
}

// ── World Model ───────────────────────────────────────────────────────────────
export interface WorldModel {
  field_coherence: number;
  entropy: number;
  oscillation_band: string;
  mean_r: number;
  active_signals: number;
  dominant_source: string;
  prediction_confidence: number;
  self_model_depth: number;
  temporal_anchor: bigint;
  last_reinject_beat: bigint;
  cognitive_load: number;
  attractor_state: string;
  hebbian_updates: bigint;
  reinjection_count: bigint;
  phi_alignment: number;
  genesis_distance: number;
  law_compliance: number;
  hunger_index: number;
  substrate_perturbation: number;
  adre_gated: boolean;
}
export const useWorldModel = mkMod<WorldModel>("worldModel", (a) =>
  (a as any).getWorldModel(),
);

// ── Cognition State ───────────────────────────────────────────────────────────
export interface CognitionState {
  world_model_beat: bigint;
  forward_pass_score: number;
  backpass_law_compliance: number;
  resonance_shift: number;
  compression_ratio: number;
  gate_pass: boolean;
  deliberation_depth: number;
  last_thought: string;
  thought_coherence: number;
  critic_count: number;
}
export const useCognitionState = mkMod<CognitionState>("cognitionState", (a) =>
  (a as any).getCognitionState(),
);

// ── Legacy Index ──────────────────────────────────────────────────────────────
export interface LegacyEntry {
  artifact_id: string;
  producer: string;
  beat: bigint;
  doctrine_distance: number;
  genesis_alignment: number;
  phi_ratio: number;
  quality_score: number;
  sacesi_hash: string;
}
export const useLegacyIndex = mkMod<LegacyEntry[]>(
  "legacyIndex",
  (a) => (a as any).getLegacyIndex(),
  5000,
);

// ── Ring 15 Status ────────────────────────────────────────────────────────────
export interface Ring15Status {
  genesis_frequency_hz: number;
  total_artifacts: bigint;
  mean_genesis_alignment: number;
  best_artifact_id: string;
  worst_artifact_id: string;
  best_alignment: number;
  worst_alignment: number;
  sealed: boolean;
  ring_active: boolean;
  founder: string;
}
export const useRing15Status = mkMod<Ring15Status>(
  "ring15Status",
  (a) => (a as any).getRing15Status(),
  2000,
);
