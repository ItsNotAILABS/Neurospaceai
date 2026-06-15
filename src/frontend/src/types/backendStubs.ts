// Stub types for backend canister methods.
// These are placeholder types compiled in until pnpm bindgen runs against a
// live deployed canister and overwrites backend.d.ts with real types.
// Using [key: string]: any for open-ended fields so optional accesses like
// `d?.someField ?? fallback` resolve correctly without TypeScript unknown errors.

// ── Core simulation types ───────────────────────────────────────────────────

export enum Region {
  PrefrontalCortex = "PrefrontalCortex",
  MotorCortex = "MotorCortex",
  Hippocampus = "Hippocampus",
  Amygdala = "Amygdala",
  Thalamus = "Thalamus",
  Cerebellum = "Cerebellum",
  BrainStem = "BrainStem",
  Brainstem = "Brainstem",
  BasalGanglia = "BasalGanglia",
  SensoryCortex = "SensoryCortex",
}

export interface SimulationState {
  regionActivity: Array<[Region, number]>;
  tick: bigint;
  activeNeurons: bigint;
  globalArousal: number;
}

export interface AvatarState {
  motionLevel: number;
  emotionValence: number;
  attentionLevel: number;
  consciousnessLevel: number;
}

// ── Sovereign substrate types ───────────────────────────────────────────────

export interface CanonicalState {
  coh: number;
  ar: number;
  ic: number;
  fe: number;
  es: number;
  kf: number;
  b: bigint;
  eg: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface CoreState {
  coreId: bigint;
  coherence: number;
  frequency: number;
  phase: number;
  active: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface DoctorReport {
  coherence: number;
  fearLevel: number;
  missionProgress: number;
  healthScore: number;
  recommendations: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface NeuroChem {
  dopamine: number;
  serotonin: number;
  norepinephrine: number;
  acetylcholine: number;
  gaba: number;
  glutamate: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface VitalSubstrate {
  coherence: number;
  entropy: number;
  phi: number;
  kuramotoR: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface TreasuryState {
  balance: bigint;
  totalMinted: bigint;
  totalBurned: bigint;
  yieldRate: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface CreatorReserve {
  balance: bigint;
  reserved: bigint;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface GenesisArtifacts {
  artifacts: string[];
  count: bigint;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface SuccessionState {
  tier: number;
  nextThreshold: number;
  progress: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface VelaProjection {
  projectedCoherence: number;
  projectedTime: bigint;
  confidence: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface QuantumBatteryState {
  charge: number;
  capacity: number;
  dischargeRate: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface SubOrganismState {
  count: bigint;
  avgCoherence: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface MarketVisionState {
  marketScore: number;
  trend: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ObservationYield {
  yield: number;
  observations: bigint;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface FactionBrainsState {
  factions: Array<{ id: string; coherence: number }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface WorldStructuresState {
  structures: Array<{ id: string; active: boolean }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface EscalationTierState {
  tier: number;
  escalationFactor: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface BehavioralModeState {
  mode: number;
  modeName: string;
  sovereign: boolean;
  emergency: boolean;
  outlaw: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface MiningState {
  hashRate: number;
  totalMined: bigint;
  activeTargets: string[];
  yieldPerBeat: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface EcologyState {
  biodiversity: number;
  sustainability: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface MilestoneAlerts {
  alerts: string[];
  count: bigint;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ShellState {
  layer: number;
  resonance: number;
  phiCoupling: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ExtendedOrganState {
  organs: Array<{ name: string; health: number }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ExtendedNeuroChem21 {
  dopamine: number;
  serotonin: number;
  norepinephrine: number;
  acetylcholine: number;
  gaba: number;
  glutamate: number;
  oxytocin: number;
  cortisol: number;
  endorphin: number;
  anandamide: number;
  bdnf: number;
  ngu: number;
  vasopressin: number;
  melatonin: number;
  adenosine: number;
  histamine: number;
  glycine: number;
  aspartate: number;
  substance_p: number;
  nitric_oxide: number;
  crf: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface AnimalEngineState {
  survivalDrive: number;
  socialDrive: number;
  explorationDrive: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
