// Bootstrap Initialization — fires ONCE at session start (tick === 0)
// Equivalent to genetic priors: sinoatrial node initial rhythm,
// resting-state DTI connectivity, baseline neuromodulator levels.
// After this fires, all internal dynamics are emergent — NO further scripts.

export interface BootstrapPriors {
  // Neuromodulator baselines (bounded [0,1])
  // Sources: Seamans & Yang 2004 (DA), Aston-Jones & Cohen 2005 (NE),
  //          Bhaskaran & Stewart 2018 (5HT), Hasselmo 2006 (ACh)
  dopamineBaseline: number;
  norepinephrineBaseline: number;
  serotoninBaseline: number;
  acetylcholineBaseline: number;
  gabaBaseline: number;
  glutamateBaseline: number;

  // Homeostatic targets (Turrigiano 2011 — synaptic scaling)
  targetMeanActivation: number; // 0.25 — sparse coding target
  targetSparsity: number; // 0.75 — fraction of silent regions
  targetBranchingRatio: number; // 1.0 — criticality target (Beggs & Plenz 2003)

  // Drive priors — not zero, not at max. Reflect resting animal state.
  hungerPrior: number;
  curiosityPrior: number;
  threatPrior: number;

  // Orienting bias — novelty circuits slightly primed (Sokolov 1963)
  noveltyOrientingBias: number;

  // Resting-state connectivity scaling factors (DTI-derived, Brainnetome Atlas)
  defaultModeNetworkBoost: number;
  salienceNetworkBoost: number;
  executiveNetworkBoost: number;

  // Heart rate bootstrap (Levy 1971)
  hrBase: number;
  hrvBase: number;
}

export const BOOTSTRAP_PRIORS: BootstrapPriors = {
  dopamineBaseline: 0.5,
  norepinephrineBaseline: 0.4,
  serotoninBaseline: 0.5,
  acetylcholineBaseline: 0.45,
  gabaBaseline: 0.6,
  glutamateBaseline: 0.5,

  targetMeanActivation: 0.25,
  targetSparsity: 0.75,
  targetBranchingRatio: 1.0,

  hungerPrior: 0.3,
  curiosityPrior: 0.4,
  threatPrior: 0.05,

  noveltyOrientingBias: 0.35,

  defaultModeNetworkBoost: 1.15,
  salienceNetworkBoost: 1.05,
  executiveNetworkBoost: 0.9,

  hrBase: 72,
  hrvBase: 0.7,
};

export interface BootstrapState {
  fired: boolean;
  tick: number;
  priors: BootstrapPriors;
}

export function createBootstrapState(): BootstrapState {
  return { fired: false, tick: 0, priors: BOOTSTRAP_PRIORS };
}

const DMN = [
  "PrefrontalCortex",
  "PosteriorCingulate",
  "AngularGyrus",
  "MedialPrefrontalCortex",
  "Precuneus",
];
const SN = ["Insula", "AnteriorCingulateCortex", "DorsalACC"];
const ECN = ["DorsolateralPFC", "PosteriorParietalCortex", "FrontalEyeField"];

// Returns true if bootstrap was applied this call (only on tick 0)
export function applyBootstrapIfNeeded(
  state: BootstrapState,
  currentTick: number,
  regions: Array<{ region: string; activation: number }>,
  neurotransmitters: {
    dopamine: number;
    serotonin: number;
    norepinephrine: number;
  },
): boolean {
  if (state.fired || currentTick > 0) return false;

  for (const rs of regions) {
    if (DMN.some((d) => rs.region.includes(d))) {
      rs.activation = Math.min(
        1,
        rs.activation * state.priors.defaultModeNetworkBoost,
      );
    } else if (SN.some((s) => rs.region.includes(s))) {
      rs.activation = Math.min(
        1,
        rs.activation * state.priors.salienceNetworkBoost,
      );
    } else if (ECN.some((e) => rs.region.includes(e))) {
      rs.activation = Math.min(
        1,
        rs.activation * state.priors.executiveNetworkBoost,
      );
    }
    if (rs.region.includes("Hippocampus") || rs.region.includes("Novelty")) {
      rs.activation = Math.max(
        rs.activation,
        state.priors.noveltyOrientingBias * 0.5,
      );
    }
  }

  neurotransmitters.dopamine = state.priors.dopamineBaseline;
  neurotransmitters.serotonin = state.priors.serotoninBaseline;
  neurotransmitters.norepinephrine = state.priors.norepinephrineBaseline;

  state.fired = true;
  state.tick = currentTick;
  return true;
}
