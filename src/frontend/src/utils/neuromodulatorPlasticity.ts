// Neuromodulator-Dependent Plasticity Gates
// Different neuromodulators gate different types of learning.
// This makes pharmacology scientifically meaningful:
// changing neuromodulator levels changes HOW the brain learns.
//
// ACh → memory encoding (Hasselmo 1999)
// DA  → reward learning (Schultz 1997)
// NE  → novelty/structural plasticity (Aston-Jones 2005)
// 5HT → harm-avoidance learning (Cools 2008)
// GABA→ stability gate (Froemke 2015)
// Glu → NMDA-dependent LTP induction (Bliss & Collingridge 1993)

export interface NeuromodulatorLevels {
  dopamine: number; // DA  [0,1]
  norepinephrine: number; // NE  [0,1]
  serotonin: number; // 5HT [0,1]
  acetylcholine: number; // ACh [0,1]
  gaba: number; // GABA[0,1]
  glutamate: number; // Glu [0,1]
}

export interface PlasticityGates {
  encodingLR: number; // ACh-dependent encoding rate
  rewardLR: number; // DA-dependent reward LTP
  avoidanceLR: number; // 5HT-dependent harm-avoidance
  structuralLR: number; // NE-dependent novelty-driven change
  stabilityGate: number; // GABA-dependent plasticity permission [0,1]
  nmdaGate: number; // Glu-dependent NMDA opening probability
  mode: "encoding" | "retrieval" | "consolidation" | "exploratory" | "stressed";
  effectiveLR: number; // combined effective learning rate this tick
  dominantModulator: string;
  plasticityBlocked: boolean; // GABA > 0.85 → no plasticity
}

export function computePlasticityGates(
  nm: NeuromodulatorLevels,
  tdError: number,
  isNoveltyEvent: boolean,
): PlasticityGates {
  const clamp = (v: number) => Math.max(0, Math.min(2, v));

  // ACh: high ACh = encoding mode, low ACh = retrieval mode
  const encodingLR = clamp(nm.acetylcholine * 1.5);

  // DA: positive TD error gates reward-pathway LTP (Schultz 1997)
  const rewardLR = clamp(nm.dopamine * Math.max(0, tdError + 0.5) * 2);

  // 5HT: harm-avoidance learning (Cools 2008)
  const avoidanceLR = clamp(nm.serotonin * 0.8 + (1 - nm.dopamine) * 0.4);

  // NE: novelty-triggered structural plasticity
  const structuralLR = clamp(nm.norepinephrine * (isNoveltyEvent ? 1.8 : 0.5));

  // GABA: inhibitory gate — high GABA suppresses plasticity
  const stabilityGate = clamp(1 - Math.max(0, nm.gaba - 0.5) * 2);

  // Glu: NMDA gate — higher Glu → lower LTP threshold
  const nmdaGate = clamp(nm.glutamate * 1.2);

  const plasticityBlocked = nm.gaba > 0.85;

  const effectiveLR = plasticityBlocked
    ? 0
    : clamp(
        (encodingLR * 0.3 +
          rewardLR * 0.3 +
          structuralLR * 0.2 +
          avoidanceLR * 0.1) *
          stabilityGate *
          nmdaGate,
      );

  const modulatorScores: Record<string, number> = {
    DA: rewardLR,
    ACh: encodingLR,
    NE: structuralLR,
    "5HT": avoidanceLR,
    GABA: 1 - stabilityGate,
    Glu: nmdaGate,
  };
  const dominant = Object.entries(modulatorScores).sort(
    ([, a], [, b]) => b - a,
  )[0][0];

  let mode: PlasticityGates["mode"];
  if (plasticityBlocked) mode = "consolidation";
  else if (nm.acetylcholine > 0.6 && encodingLR > 0.8) mode = "encoding";
  else if (nm.acetylcholine < 0.4) mode = "retrieval";
  else if (isNoveltyEvent && nm.norepinephrine > 0.6) mode = "exploratory";
  else if (nm.norepinephrine > 0.7 && tdError < -0.3) mode = "stressed";
  else mode = "encoding";

  return {
    encodingLR,
    rewardLR,
    avoidanceLR,
    structuralLR,
    stabilityGate,
    nmdaGate,
    mode,
    effectiveLR,
    dominantModulator: dominant,
    plasticityBlocked,
  };
}

// Causal chain: world/body → ANS → neuromodulators → regional gain → behavior
export function updateNeuromodulators(
  current: NeuromodulatorLevels,
  ansSympatheticTone: number,
  ansParasympatheticTone: number,
  tdError: number,
  globalArousal: number,
  noveltyScore: number,
  threatLevel: number,
  rewardLevel: number,
): NeuromodulatorLevels {
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const ema = (prev: number, target: number, tau: number) =>
    prev + (target - prev) * (1 / tau);

  // DA: VTA dopamine encodes reward prediction error (Schultz 1997)
  const daTarget = clamp(
    0.5 + tdError * 0.4 + rewardLevel * 0.3 - threatLevel * 0.2,
  );
  const dopamine = clamp(ema(current.dopamine, daTarget, 20));

  // NE: LC-NE system (Aston-Jones 2005)
  const neTarget = clamp(
    ansSympatheticTone * 0.5 + globalArousal * 0.3 + noveltyScore * 0.2,
  );
  const norepinephrine = clamp(ema(current.norepinephrine, neTarget, 15));

  // 5HT: Raphe nucleus (Cools 2008)
  const shtTarget = clamp(
    ansParasympatheticTone * 0.6 + (1 - threatLevel) * 0.3 + rewardLevel * 0.1,
  );
  const serotonin = clamp(ema(current.serotonin, shtTarget, 30));

  // ACh: arousal + novelty → encoding mode (Hasselmo 1999)
  const achTarget = clamp(
    globalArousal * 0.4 +
      noveltyScore * 0.4 +
      (1 - ansSympatheticTone * 0.5) * 0.2,
  );
  const acetylcholine = clamp(ema(current.acetylcholine, achTarget, 25));

  // GABA: inhibitory tone rises during rest/consolidation (Froemke 2015)
  const gabaTarget = clamp(
    (1 - globalArousal) * 0.5 + ansParasympatheticTone * 0.3 + 0.2,
  );
  const gaba = clamp(ema(current.gaba, gabaTarget, 40));

  // Glu: excitatory drive (reciprocal with GABA)
  const gluTarget = clamp(
    globalArousal * 0.4 + (1 - current.gaba) * 0.3 + rewardLevel * 0.3,
  );
  const glutamate = clamp(ema(current.glutamate, gluTarget, 20));

  return {
    dopamine,
    norepinephrine,
    serotonin,
    acetylcholine,
    gaba,
    glutamate,
  };
}

export function initNeuromodulatorLevels(): NeuromodulatorLevels {
  return {
    dopamine: 0.5,
    norepinephrine: 0.4,
    serotonin: 0.5,
    acetylcholine: 0.45,
    gaba: 0.6,
    glutamate: 0.5,
  };
}
