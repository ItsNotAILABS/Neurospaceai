import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type AvatarState,
  Region,
  type SimulationState,
} from "../types/backendStubs";
import { useActor } from "./useActor";

export { Region };

// ─── Frontend-only extended regions (not in backend) ───────────────────────
export enum FrontendRegion {
  Insula = "Insula",
  AnteriorCingulateCortex = "AnteriorCingulateCortex",
  OrbitalFrontalCortex = "OrbitalFrontalCortex",
  VisualCortex = "VisualCortex",
  AuditoryCortex = "AuditoryCortex",
  Hypothalamus = "Hypothalamus",
  NucleusAccumbens = "NucleusAccumbens",
  OlfactoryBulb = "OlfactoryBulb",
  CA1 = "CA1",
  CA3 = "CA3",
  DentateGyrus = "DentateGyrus",
  PurkinjeLayer = "PurkinjeLayer",
  DeepCerebellarNuclei = "DeepCerebellarNuclei",
  MedialdorsalThalamus = "MedialdorsalThalamus",
  PulvinarThalamus = "PulvinarThalamus",
  ParietalCortex = "ParietalCortex",
  TemporalCortex = "TemporalCortex",
  CingulateMotorArea = "CingulateMotorArea",
  Claustrum = "Claustrum",
  LateralHabenula = "LateralHabenula",
  SubstantiaNigra = "SubstantiaNigra",
  SuperiorTemporalSulcus = "SuperiorTemporalSulcus",
  DorsalACC = "DorsalACC",
  VentralTegmentalArea = "VentralTegmentalArea",
  LocusCoeruleus = "LocusCoeruleus",
  RapheNuclei = "RapheNuclei",
  VentralStriatum = "VentralStriatum",
  EntorhinalCortex = "EntorhinalCortex",
  PerirhinalCortex = "PerirhinalCortex",
  SupplementaryMotorArea = "SupplementaryMotorArea",
  VentralPallidum = "VentralPallidum",
  SpinoCerebellarTract = "SpinoCerebellarTract",
  PeriaqueductalGray = "PeriaqueductalGray",
  BedNucleusStria = "BedNucleusStria",
  MedialSeptum = "MedialSeptum",
  RetroSplenialCortex = "RetroSplenialCortex",
  FrontalPole_L = "FrontalPole_L",
  FrontalPole_R = "FrontalPole_R",
  MedialPFC_L = "MedialPFC_L",
  MedialPFC_R = "MedialPFC_R",
  VentralMPFC_L = "VentralMPFC_L",
  VentralMPFC_R = "VentralMPFC_R",
  DorsalMPFC_L = "DorsalMPFC_L",
  DorsalMPFC_R = "DorsalMPFC_R",
  InferiorFrontal_L = "InferiorFrontal_L",
  InferiorFrontal_R = "InferiorFrontal_R",
  MiddleFrontal_L = "MiddleFrontal_L",
  MiddleFrontal_R = "MiddleFrontal_R",
  SuperiorFrontal_L = "SuperiorFrontal_L",
  SuperiorFrontal_R = "SuperiorFrontal_R",
  PreCentralGyrus_L = "PreCentralGyrus_L",
  PreCentralGyrus_R = "PreCentralGyrus_R",
  PreMotorCortex_L = "PreMotorCortex_L",
  PreMotorCortex_R = "PreMotorCortex_R",
  PrimaryMotorCortex_L = "PrimaryMotorCortex_L",
  PrimaryMotorCortex_R = "PrimaryMotorCortex_R",
  PrimaryMotorHand_L = "PrimaryMotorHand_L",
  PrimaryMotorHand_R = "PrimaryMotorHand_R",
  PrimarySomatosensory_L = "PrimarySomatosensory_L",
  PrimarySomatosensory_R = "PrimarySomatosensory_R",
  SecondarySomatosensory_L = "SecondarySomatosensory_L",
  SecondarySomatosensory_R = "SecondarySomatosensory_R",
  PostCentralGyrus_L = "PostCentralGyrus_L",
  PostCentralGyrus_R = "PostCentralGyrus_R",
  SuperiorParietal_L = "SuperiorParietal_L",
  SuperiorParietal_R = "SuperiorParietal_R",
  InferiorParietal_L = "InferiorParietal_L",
  InferiorParietal_R = "InferiorParietal_R",
  PrecuneusRegion_L = "PrecuneusRegion_L",
  PrecuneusRegion_R = "PrecuneusRegion_R",
  AngularGyrus_L = "AngularGyrus_L",
  AngularGyrus_R = "AngularGyrus_R",
  Supramarginal_L = "Supramarginal_L",
  Supramarginal_R = "Supramarginal_R",
  SuperiorTemporalGyrus_L = "SuperiorTemporalGyrus_L",
  SuperiorTemporalGyrus_R = "SuperiorTemporalGyrus_R",
  MiddleTemporalGyrus_L = "MiddleTemporalGyrus_L",
  MiddleTemporalGyrus_R = "MiddleTemporalGyrus_R",
  InferiorTemporalGyrus_L = "InferiorTemporalGyrus_L",
  InferiorTemporalGyrus_R = "InferiorTemporalGyrus_R",
  FusiformGyrus_L = "FusiformGyrus_L",
  FusiformGyrus_R = "FusiformGyrus_R",
  TemporalPole_L = "TemporalPole_L",
  TemporalPole_R = "TemporalPole_R",
  PrimaryVisual_L = "PrimaryVisual_L",
  PrimaryVisual_R = "PrimaryVisual_R",
  SecondaryVisual_L = "SecondaryVisual_L",
  SecondaryVisual_R = "SecondaryVisual_R",
  V3Area_L = "V3Area_L",
  V3Area_R = "V3Area_R",
  V4Area_L = "V4Area_L",
  V4Area_R = "V4Area_R",
  MTArea_L = "MTArea_L",
  MTArea_R = "MTArea_R",
  LingualGyrus_L = "LingualGyrus_L",
  LingualGyrus_R = "LingualGyrus_R",
  OccipitalPole_L = "OccipitalPole_L",
  OccipitalPole_R = "OccipitalPole_R",
  RostralACC_L = "RostralACC_L",
  RostralACC_R = "RostralACC_R",
  CaudalACC_L = "CaudalACC_L",
  CaudalACC_R = "CaudalACC_R",
  MidCingulate_L = "MidCingulate_L",
  MidCingulate_R = "MidCingulate_R",
  PosteriorCingulate_L = "PosteriorCingulate_L",
  PosteriorCingulate_R = "PosteriorCingulate_R",
  RetrosplenialArea_L = "RetrosplenialArea_L",
  RetrosplenialArea_R = "RetrosplenialArea_R",
  AnteriorInsula_L = "AnteriorInsula_L",
  AnteriorInsula_R = "AnteriorInsula_R",
  PosteriorInsula_L = "PosteriorInsula_L",
  PosteriorInsula_R = "PosteriorInsula_R",
  Thalamus_L = "Thalamus_L",
  Thalamus_R = "Thalamus_R",
  Caudate_L = "Caudate_L",
  Caudate_R = "Caudate_R",
  Putamen_L = "Putamen_L",
  Putamen_R = "Putamen_R",
  Pallidum_L = "Pallidum_L",
  Pallidum_R = "Pallidum_R",
  Hippocampus_L = "Hippocampus_L",
  Hippocampus_R = "Hippocampus_R",
  Amygdala_L = "Amygdala_L",
  Amygdala_R = "Amygdala_R",
  Accumbens_L = "Accumbens_L",
  Accumbens_R = "Accumbens_R",
  CerebellarLobule_I_IV = "CerebellarLobule_I_IV",
  CerebellarLobule_V = "CerebellarLobule_V",
  CerebellarLobule_VI = "CerebellarLobule_VI",
  CerebellarLobule_VIIa = "CerebellarLobule_VIIa",
  CerebellarLobule_VIIb = "CerebellarLobule_VIIb",
  CerebellarLobule_VIII = "CerebellarLobule_VIII",
  CerebellarLobule_IX = "CerebellarLobule_IX",
  CerebellarLobule_X = "CerebellarLobule_X",
  CerebellarVermis = "CerebellarVermis",
  FrontalOperculum_L = "FrontalOperculum_L",
  FrontalOperculum_R = "FrontalOperculum_R",
  BrocaArea_L = "BrocaArea_L",
  BrocaArea_R = "BrocaArea_R",
  WernickeArea_L = "WernickeArea_L",
  WernickeArea_R = "WernickeArea_R",
  PlanumTemporale_L = "PlanumTemporale_L",
  PlanumTemporale_R = "PlanumTemporale_R",
  ParsOrbitalis_L = "ParsOrbitalis_L",
  ParsOrbitalis_R = "ParsOrbitalis_R",
  ParsTriangularis_L = "ParsTriangularis_L",
  ParsTriangularis_R = "ParsTriangularis_R",
  SubthalamicNucleus_L = "SubthalamicNucleus_L",
  SubthalamicNucleus_R = "SubthalamicNucleus_R",
  LateralGeniculateBody_L = "LateralGeniculateBody_L",
  LateralGeniculateBody_R = "LateralGeniculateBody_R",
  MedialGeniculateBody_L = "MedialGeniculateBody_L",
  MedialGeniculateBody_R = "MedialGeniculateBody_R",
  ZonaIncerta_L = "ZonaIncerta_L",
  ZonaIncerta_R = "ZonaIncerta_R",
  HabenularNucleus_L = "HabenularNucleus_L",
  HabenularNucleus_R = "HabenularNucleus_R",
  MamillaryBodies = "MamillaryBodies",
  PontineTegmentum = "PontineTegmentum",
  MedullaryReticular = "MedullaryReticular",
  SpleniumCorpusCallosum = "SpleniumCorpusCallosum",
  FornixBody = "FornixBody",
}

export type ExtendedRegion = Region | FrontendRegion;
export const ALL_EXTENDED_REGIONS: ExtendedRegion[] = [
  ...Object.values(Region),
  ...Object.values(FrontendRegion),
];

export function useSimulationState() {
  const { actor, isFetching } = useActor();
  return useQuery<SimulationState>({
    queryKey: ["simulationState"],
    queryFn: async () => {
      if (!actor)
        return {
          regionActivity: [],
          tick: 0n,
          activeNeurons: 0n,
          globalArousal: 0,
        };
      return actor.getSimulationState();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: false,
    staleTime: 0,
  });
}

export function useAvatarState() {
  const { actor, isFetching } = useActor();
  return useQuery<AvatarState>({
    queryKey: ["avatarState"],
    queryFn: async () => {
      if (!actor)
        return {
          motionLevel: 0,
          emotionValence: 0,
          attentionLevel: 0,
          consciousnessLevel: 0,
        };
      return actor.getAvatarState();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: false,
    staleTime: 0,
  });
}

export function useActiveNeurons() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[bigint, Region]>>({
    queryKey: ["activeNeurons"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveNeurons();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: false,
    staleTime: 0,
  });
}

export function useTickMutation() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.tick();
    },
  });
}

export function useInjectStimulusMutation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      region,
      intensity,
    }: { region: Region; intensity: number }) => {
      if (!actor) return;
      await actor.injectStimulus(region, intensity);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["simulationState"] });
      void queryClient.invalidateQueries({ queryKey: ["avatarState"] });
    },
  });
}

export function useResetMutation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.resetSimulation();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["simulationState"] });
      void queryClient.invalidateQueries({ queryKey: ["avatarState"] });
      void queryClient.invalidateQueries({ queryKey: ["activeNeurons"] });
    },
  });
}

// ─── SOVEREIGN SUBSTRATE HOOKS ──────────────────────────────────────────────
import type {
  AnimalEngineState,
  BehavioralModeState,
  CanonicalState,
  CoreState,
  CreatorReserve,
  DoctorReport,
  EcologyState,
  EscalationTierState,
  ExtendedNeuroChem21,
  ExtendedOrganState,
  FactionBrainsState,
  GenesisArtifacts,
  MarketVisionState,
  MilestoneAlerts,
  MiningState,
  NeuroChem,
  ObservationYield,
  QuantumBatteryState,
  ShellState,
  SubOrganismState,
  SuccessionState,
  TreasuryState,
  VelaProjection,
  VitalSubstrate,
  WorldStructuresState,
} from "../types/backendStubs";

function mkQuery<T>(
  key: string,
  fn: (actor: any) => Promise<T>,
  interval = 5000,
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

export const useCanonicalState = mkQuery<CanonicalState>(
  "canonicalState",
  (a) => a.getCanonicalState(),
  5000,
);
export const useDoctorReport = mkQuery<DoctorReport>(
  "doctorReport",
  (a) => a.getDoctorReport(),
  5000,
);
export const useEcologyState = mkQuery<EcologyState>(
  "ecologyState",
  (a) => a.getEcologyState(),
  5000,
);
export const useMilestoneAlerts = mkQuery<MilestoneAlerts>(
  "milestoneAlerts",
  (a) => a.getMilestoneAlerts(),
  10000,
);
export const useCreatorReserve = mkQuery<CreatorReserve>(
  "creatorReserve",
  (a) => a.getCreatorReserve(),
  3000,
);
export const useTreasuryState = mkQuery<TreasuryState>(
  "treasuryState",
  (a) => a.getTreasuryState(),
  3000,
);
export const useNeuroChem = mkQuery<NeuroChem>(
  "neuroChem",
  (a) => a.getNeuroChem(),
  3000,
);
export const useVitalSubstrate = mkQuery<VitalSubstrate>(
  "vitalSubstrate",
  (a) => a.getVitalSubstrate(),
  3000,
);
export const useGenesisArtifacts = mkQuery<GenesisArtifacts>(
  "genesisArtifacts",
  (a) => a.getGenesisArtifacts(),
  30000,
);
export const useSuccessionState = mkQuery<SuccessionState>(
  "successionState",
  (a) => a.getSuccessionState(),
  3000,
);
export const useVelaProjection = mkQuery<VelaProjection>(
  "velaProjection",
  (a) => a.getVelaProjection(),
  3000,
);
export const useQuantumBatteryState = mkQuery<QuantumBatteryState>(
  "quantumBatteryState",
  (a) => a.getQuantumBatteryState(),
  3000,
);
export const useSubOrganismState = mkQuery<SubOrganismState>(
  "subOrganismState",
  (a) => a.getSubOrganismState(),
  3000,
);
export const useMarketVisionState = mkQuery<MarketVisionState>(
  "marketVisionState",
  (a) => a.getMarketVisionState(),
  10000,
);
export const useObservationYield = mkQuery<ObservationYield>(
  "observationYield",
  (a) => a.getObservationYield(),
  5000,
);
export const useFactionBrains = mkQuery<FactionBrainsState>(
  "factionBrains",
  (a) => a.getFactionBrains(),
  5000,
);
export const useWorldStructures = mkQuery<WorldStructuresState>(
  "worldStructures",
  (a) => a.getWorldStructures(),
  10000,
);
export const useEscalationTier = mkQuery<EscalationTierState>(
  "escalationTier",
  (a) => a.getEscalationTier(),
  10000,
);
export const useBehavioralMode = mkQuery<BehavioralModeState>(
  "behavioralMode",
  (a) => a.getBehavioralMode(),
  3000,
);
export const useMiningState = mkQuery<MiningState>(
  "miningState",
  (a) => a.getMiningState(),
  3000,
);

export function useCoreStates() {
  const { actor, isFetching } = useActor();
  return useQuery<CoreState[]>({
    queryKey: ["coreStates"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const results: CoreState[] = [];
        for (let i = 0; i < 43; i++) {
          const s = await (actor as any).getCoreState(BigInt(i));
          results.push(s);
        }
        return results;
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
    staleTime: 0,
  });
}

export function useSetCreatorPrincipal() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await (actor as any).setCreatorPrincipal();
    },
  });
}
export function usePresenceCharge() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await (actor as any).presenceCharge();
    },
  });
}
export function useDischargeQuantumBattery() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return 0;
      return await (actor as any).dischargeQuantumBattery();
    },
  });
}

// ─── PARALLAX BUILD STATUS + BEHAVIORAL ECONOMICS + RL ENGINE ───────────────

export interface ParallaxBuildStatus {
  linesWritten: bigint;
  canistersLive: bigint;
  totalLines: bigint;
  totalCanisters: bigint;
  currentPhase: string;
  missionProgress: number;
  phasePercent: number;
  auditPassed: bigint;
  auditTotal: bigint;
  systemChecklist: Array<[bigint, boolean]>;
}

export interface BehavioralEconomicsState {
  netProspect: number;
  gain: number;
  loss: number;
  lossAversion: number;
  discountedValue: number;
  endowmentReserve: number;
  peakCoherence: number;
  peakEndScore: number;
  decisionFatigue: number;
  decisionCount: bigint;
  flowState: boolean;
  flowBeatCount: bigint;
  availabilityBias: number;
  satisficeThresh: number;
  mentalAccounts: number[];
}

export interface RLEngineState {
  lastReward: number;
  totalReward: number;
  pathwayBoost: number;
  alpha: number;
  gamma: number;
  qValues: number[];
  rewardHistory: number[];
  lawOutcome: number[];
}

export interface LawsRegistryState {
  fireCounts: bigint[];
  lastBeats: bigint[];
  netEffects: number[];
  activeNow: boolean[];
  totalFires: bigint;
  topLawIdx: bigint;
}

export const useParallaxBuildStatus = mkQuery<ParallaxBuildStatus>(
  "parallaxBuildStatus",
  (a) => a.getParallaxBuildStatus(),
  10000,
);

export const useBehavioralEconomicsState = mkQuery<BehavioralEconomicsState>(
  "behavioralEconomicsState",
  (a) => a.getBehavioralEconomicsState(),
  3000,
);

export const useRLEngineState = mkQuery<RLEngineState>(
  "rlEngineState",
  (a) => a.getRLEngineState(),
  3000,
);

export const useLawsRegistryState = mkQuery<LawsRegistryState>(
  "lawsRegistryState",
  (a) => a.getLawsRegistryState(),
  5000,
);

export interface PublicStatus {
  publicCoherenceIndex: number;
  networkOrganismCount: bigint;
  jubileeCountdown: bigint;
  beatCount: bigint;
  totalPatentEvents: bigint;
  emergenceScore: number;
  missionProgressPct: number;
  liveSystemsCount: bigint;
  tokenMintCount: bigint;
  antiFakeScore: number;
  rlPathwayBoost: number;
  lawTotalFires: bigint;
}

export const usePublicStatus = mkQuery<PublicStatus>(
  "publicStatus",
  (a) => a.getPublicStatus(),
  5000,
);

// ─── PHASE B HOOKS ──────────────────────────────────────────────────────────

export const useShellState = mkQuery<ShellState>(
  "shellState",
  (a) => a.getShellState(),
  2000,
);

export const useExtendedOrganState = mkQuery<ExtendedOrganState>(
  "extendedOrganState",
  (a) => a.getExtendedOrganState(),
  2000,
);

export const useExtendedNeuroChem21 = mkQuery<ExtendedNeuroChem21>(
  "extendedNeuroChem21",
  (a) => a.getExtendedNeuroChem21(),
  2000,
);

export const useAnimalEngineState = mkQuery<AnimalEngineState>(
  "animalEngineState",
  (a) => a.getAnimalEngineState(),
  2000,
);

// ─── NEUROSCIENCE EXPANSION HOOKS ───────────────────────────────────────────

export interface FearMissionState {
  fearLevel: number;
  fearVelocity: number;
  amygdalaActivation: number;
  hpaAxisState: number;
  fightFlightFreeze: number;
  adrenalBlastActive: boolean;
  courageScore: number;
  missionLockActive: boolean;
  darkNightActive: boolean;
  darkNightCount: bigint;
  missionPersistence: number;
  streakCounter: bigint;
  surrenderFloor: number;
  groundedScore: number;
  conqueredFearCount: bigint;
  kuramotoR: number;
  phaseResetCount: bigint;
  bhCouplingCoherence: number;
  valBasinCrossCount: bigint;
  beatCount: bigint;
}

export interface NeuroscienceState {
  // A. Thalamocortical Binding
  bindingCoherence: number;
  thalamicGain: number;
  reentryStrength: number;
  consciousnessIndex: number;
  bindingPeakEver: number;
  // B. Predictive Coding
  pcPredictedCoherence: number;
  pcPredictionError: number;
  pcPrecisionWeight: number;
  pcBelief: number;
  pcActiveInferenceScore: number;
  pcSurpriseAccum: number;
  // C. Interoception
  interceptiveScore: number;
  insulaActivation: number;
  accActivation: number;
  vagalTone: number;
  somaticMarker: number;
  bodyBrainCoherence: number;
  // D. Default Mode Network
  dmnActivation: number;
  selfReferentialScore: number;
  futureSimScore: number;
  pastIntegrationScore: number;
  metaCognitionScore: number;
  // E. Salience Network
  salienceNetworkScore: number;
  attentionFocus: number;
  salienceShiftCount: bigint;
  centralExecutiveScore: number;
  // F. Neuroplasticity
  bdnfLevel: number;
  ltpEvents: bigint;
  ltdEvents: bigint;
  bcmThreshold: number;
  metaplasticityScore: number;
  homeostaticScaling: number;
  structuralPlasticity: number;
  plasticityDebt: number;
  // G. Circadian
  circadianPhase: number;
  ultradianPhase: number;
  circadianPeakScore: number;
  adenosineLevel: number;
  melatoninLevel: number;
  circadianCoherence: number;
}

export const useFearMissionState = mkQuery<FearMissionState>(
  "fearMissionState",
  (a) => a.getFearMissionState(),
  3000,
);

export const useNeuroscienceState = mkQuery<NeuroscienceState>(
  "neuroscienceState",
  (a) => a.getNeuroscienceState(),
  3000,
);

// ─── IoT PHONE INTERFACE — Ring 8 External Node ──────────────────────────────
// PHI^4 × Schumann period (127.7ms) = 873ms heartbeat
// This poll interval synchronizes the display with the organism's actual heartbeat

export interface IoTStatePacket {
  coherence: number;
  omnis_active: boolean;
  beat_count: bigint;
  dominant_band: string;
  active_rings: bigint;
  phi_phase: number;
  timestamp_ms: bigint;
  heartbeat_interval_ms: bigint;
}

export const useIoTStatePacket = mkQuery<IoTStatePacket>(
  "iotStatePacket",
  (a) => a.getIoTStatePacket(),
  873, // PHI^4 × 127.7ms — exactly the organism's heartbeat interval
);

// ─── VIRTUAL LAB HOOKS ─────────────────────────────────────────────────────────────────────────
// LAB_REFRESH = PHI × 873ms = 1412ms

// ─── HIVE MIND & SUBSTRATE MINE HOOKS ──────────────────────────────────────

export interface HiveMindAvatarState {
  id: string;
  behavioralState: string;
  da: number;
  ser: number;
  ne: number;
  cerebraSyncPct: number;
}

export interface HiveMindState {
  coherence: number;
  dominantSharedState: string;
  avatars: HiveMindAvatarState[];
}

export function useHiveMindState() {
  const { actor, isFetching } = useActor();
  return useQuery<HiveMindState>({
    queryKey: ["hiveMind"],
    queryFn: async () => {
      // Derive from live neuroChem + canonical state — no dedicated backend endpoint needed
      if (!actor)
        return {
          coherence: 0.72,
          dominantSharedState: "SYNCHRONIZED",
          avatars: [
            {
              id: "AXIOM",
              behavioralState: "SOLVING",
              da: 0.74,
              ser: 0.61,
              ne: 0.55,
              cerebraSyncPct: 87,
            },
            {
              id: "PHANTOM",
              behavioralState: "OBSERVING",
              da: 0.58,
              ser: 0.72,
              ne: 0.43,
              cerebraSyncPct: 79,
            },
            {
              id: "SENTINEL",
              behavioralState: "SYNCHRONIZED",
              da: 0.63,
              ser: 0.68,
              ne: 0.71,
              cerebraSyncPct: 94,
            },
            {
              id: "FLUX",
              behavioralState: "MINING",
              da: 0.81,
              ser: 0.49,
              ne: 0.66,
              cerebraSyncPct: 73,
            },
          ],
        };
      try {
        const nc = await (
          actor as unknown as Record<
            string,
            (...args: unknown[]) => Promise<unknown>
          >
        ).getNeuroChem();
        const ncRec = nc as Record<string, number>;
        const da = typeof ncRec?.dopamine === "number" ? ncRec.dopamine : 0.7;
        const ser =
          typeof ncRec?.serotonin === "number" ? ncRec.serotonin : 0.65;
        const ne =
          typeof ncRec?.norepinephrine === "number"
            ? ncRec.norepinephrine
            : 0.6;
        const coherence = Math.min(1, (da + ser + ne) / 3 + 0.1);
        const states = ["SOLVING", "OBSERVING", "SYNCHRONIZED", "MINING"];
        const dominant =
          coherence > 0.75
            ? "SYNCHRONIZED"
            : coherence > 0.5
              ? "SOLVING"
              : "OBSERVING";
        return {
          coherence,
          dominantSharedState: dominant,
          avatars: [
            {
              id: "AXIOM",
              behavioralState: states[0],
              da,
              ser: ser * 0.9,
              ne: ne * 0.95,
              cerebraSyncPct: Math.round(coherence * 90 + 5),
            },
            {
              id: "PHANTOM",
              behavioralState: states[1],
              da: da * 0.85,
              ser,
              ne: ne * 0.8,
              cerebraSyncPct: Math.round(coherence * 85 + 5),
            },
            {
              id: "SENTINEL",
              behavioralState: states[2],
              da: da * 0.9,
              ser: ser * 0.95,
              ne,
              cerebraSyncPct: Math.round(coherence * 95 + 3),
            },
            {
              id: "FLUX",
              behavioralState: states[3],
              da: Math.min(1, da * 1.1),
              ser: ser * 0.75,
              ne: ne * 1.05,
              cerebraSyncPct: Math.round(coherence * 80 + 5),
            },
          ],
        };
      } catch {
        return {
          coherence: 0.72,
          dominantSharedState: "SYNCHRONIZED",
          avatars: [
            {
              id: "AXIOM",
              behavioralState: "SOLVING",
              da: 0.74,
              ser: 0.61,
              ne: 0.55,
              cerebraSyncPct: 87,
            },
            {
              id: "PHANTOM",
              behavioralState: "OBSERVING",
              da: 0.58,
              ser: 0.72,
              ne: 0.43,
              cerebraSyncPct: 79,
            },
            {
              id: "SENTINEL",
              behavioralState: "SYNCHRONIZED",
              da: 0.63,
              ser: 0.68,
              ne: 0.71,
              cerebraSyncPct: 94,
            },
            {
              id: "FLUX",
              behavioralState: "MINING",
              da: 0.81,
              ser: 0.49,
              ne: 0.66,
              cerebraSyncPct: 73,
            },
          ],
        };
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 2000,
    staleTime: 0,
  });
}

export interface MineDeposit {
  id: string;
  type: string;
  x: number;
  z: number;
  amount: number;
}

export interface MineAvatarPos {
  id: string;
  x: number;
  z: number;
}

export interface SubstrateMineState {
  tick: number;
  totalExtracted: number;
  dominantMineral: string;
  deposits: MineDeposit[];
  avatarPositions: MineAvatarPos[];
}

export function useSubstrateMineState() {
  const { actor, isFetching } = useActor();
  return useQuery<SubstrateMineState>({
    queryKey: ["substrateMine"],
    queryFn: async () => {
      // Derive from miningState if available
      if (!actor) return _defaultMineState();
      try {
        const ms = await (
          actor as unknown as Record<
            string,
            (...args: unknown[]) => Promise<unknown>
          >
        ).getMiningState();
        const m = ms as Record<string, unknown>;
        const tick =
          typeof m?.tick === "bigint"
            ? Number(m.tick)
            : typeof m?.tick === "number"
              ? m.tick
              : 0;
        const totalExtracted =
          typeof m?.totalExtracted === "number" ? m.totalExtracted : 0;
        const dominant =
          typeof m?.dominantMineral === "string"
            ? m.dominantMineral
            : "DopamineVein";
        return {
          ..._defaultMineState(),
          tick,
          totalExtracted,
          dominantMineral: dominant,
        };
      } catch {
        return _defaultMineState();
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 2000,
    staleTime: 0,
  });
}

function _defaultMineState(): SubstrateMineState {
  return {
    tick: 0,
    totalExtracted: 0,
    dominantMineral: "DopamineVein",
    deposits: [
      { id: "d1", type: "DopamineVein", x: -180, z: -120, amount: 340 },
      { id: "d2", type: "SerotoninVein", x: 200, z: -80, amount: 280 },
      { id: "d3", type: "EndorphinCrystal", x: 50, z: 180, amount: 190 },
      { id: "d4", type: "CortisolHazard", x: -220, z: 200, amount: 140 },
      { id: "d5", type: "AcetylcholineOre", x: 300, z: 100, amount: 220 },
      { id: "d6", type: "GABADeposit", x: -50, z: -280, amount: 310 },
    ],
    avatarPositions: [
      { id: "AXIOM", x: -80, z: -60 },
      { id: "PHANTOM", x: 120, z: 40 },
      { id: "SENTINEL", x: -20, z: 100 },
      { id: "FLUX", x: 180, z: -140 },
    ],
  };
}

export function useManualMineDeposit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (depositId: string) => {
      if (!actor) return null;
      try {
        return await (
          actor as unknown as Record<
            string,
            (...args: unknown[]) => Promise<unknown>
          >
        ).mineDeposit(depositId);
      } catch {
        return null;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["substrateMine"] });
      void queryClient.invalidateQueries({ queryKey: ["miningState"] });
    },
  });
}

export function useLabState() {
  const { actor, isFetching } = useActor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useQuery<any>({
    queryKey: ["labState"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await (actor as any).getLabState();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 1412,
    staleTime: 0,
  });
}

export function useCreateSandbox() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (material: string) => {
      if (!actor) return null;
      return await (actor as any).createSandbox(material);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["labState"] });
    },
  });
}

export function useRunSandboxStep() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sandboxId: bigint) => {
      if (!actor) return null;
      return await (actor as any).runSandboxStep(Number(sandboxId));
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["labState"] });
    },
  });
}

export function useSealExperiment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sandboxId: bigint) => {
      if (!actor) return null;
      return await (actor as any).sealExperiment(Number(sandboxId));
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["labState"] });
    },
  });
}

export function useExternalLabOutcall() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      labUrl,
      statePacket,
    }: { labUrl: string; statePacket: string }) => {
      if (!actor) return null;
      return await (actor as any).externalLabOutcall(labUrl, statePacket);
    },
  });
}

// ─── MEMORY TEMPLE ──────────────────────────────────────────────────────────────────────────────
// PHI^4 × Schumann = 873ms — memory field synchronized to heartbeat
export interface MemoryTemplePedestal {
  id: bigint;
  phase_bias: number;
  lineage_depth: bigint;
  active: boolean;
}

export interface MemoryTempleAnalystItem {
  consolidate: bigint[];
  surface: bigint[];
  lineage_pattern: bigint;
  analyst_cycle: bigint;
  confidence: number;
}

export interface MemoryTempleState {
  pedestals: MemoryTemplePedestal[];
  episodic_count: bigint;
  semantic_count: bigint;
  doctrine_count: bigint;
  mission_count: bigint;
  current_retrieval_bias: string; // "episodic" | "semantic" | "doctrine" | "mission"
  analyst_queue: MemoryTempleAnalystItem[];
  memory_coherence: number;
  pedestal_phase_sum: number;
  last_analyst_cycle: bigint;
}

export function useMemoryTempleState() {
  const { actor, isFetching } = useActor();
  return useQuery<MemoryTempleState | null>({
    queryKey: ["memoryTemple"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await (actor as any).getMemoryTempleState();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 873, // matches heartbeat
    staleTime: 800,
  });
}

export function useInquisitorState() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["inquisitorState"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await (actor as any).getInquisitorState();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 873,
    staleTime: 800,
  });
}

export function useNunHekaAnkhState() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["nunHekaAnkh"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await (actor as any).getNunHekaAnkhState();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 873,
    staleTime: 800,
  });
}

export function useIdentityTraits() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["identityTraits"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await (actor as any).getIdentityTraits();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 873,
    staleTime: 800,
  });
}
