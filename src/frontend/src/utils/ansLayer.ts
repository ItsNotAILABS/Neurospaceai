// ANS / Interoceptive Regulation Layer
// Fully causal: world → ANS → neuromodulators → regional gain → behavior
// Not decorative. Every output variable causally modifies brain computation.

export interface ANSState {
  sympatheticTone: number; // [0,1] SNS activation
  parasympatheticTone: number; // [0,1] PNS activation
  autonomicBalanceIndex: number; // sym - para, clamped [-1,1]
  heartRateProxy: number; // 60-180 bpm
  hrvProxy: number; // [0,1] higher = more regulated
  stressSignal: number; // [0,1]
  recoverySignal: number; // [0,1]
  interoceptiveStateSignal: number; // [0,1]
  selfStateWeight: number; // how much ANS influences cognition
  prevBalanceIndex: number;

  // 6-channel neuromodulator output (causal chain from ANS to brain chemistry)
  // These directly modulate regional gain in the tick pipeline
  neuromodulators: {
    dopamine: number; // VTA: reward/motivation (Schultz 1997)
    norepinephrine: number; // LC: arousal/alertness (Aston-Jones 2005)
    serotonin: number; // Raphe: patience/recovery (Cools 2008)
    acetylcholine: number; // BF/septum: encoding mode (Hasselmo 1999)
    gaba: number; // inhibitory tone (Froemke 2015)
    glutamate: number; // excitatory drive (Bliss & Collingridge 1993)
  };

  // SNS pathway state (Hypothalamus → LC → Amygdala → Motor)
  hypothalamusActivation: number;
  locusCoeruleusActivation: number;

  // PNS pathway state (Vagus → NTS → Hippocampus → PFC)
  vagalTone: number;
  ntsMediationSignal: number;
}

function clampANS(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

export function initANSState(): ANSState {
  return {
    sympatheticTone: 0.2,
    parasympatheticTone: 0.5,
    autonomicBalanceIndex: -0.3,
    heartRateProxy: 72,
    hrvProxy: 0.7,
    stressSignal: 0.15,
    recoverySignal: 0.55,
    interoceptiveStateSignal: 0.2,
    selfStateWeight: 0.05,
    prevBalanceIndex: -0.3,
    neuromodulators: {
      dopamine: 0.5,
      norepinephrine: 0.4,
      serotonin: 0.5,
      acetylcholine: 0.45,
      gaba: 0.6,
      glutamate: 0.5,
    },
    hypothalamusActivation: 0.2,
    locusCoeruleusActivation: 0.2,
    vagalTone: 0.55,
    ntsMediationSignal: 0.35,
  };
}

export function updateANS(
  prev: ANSState,
  threatLevel: number,
  rewardLevel: number,
  globalArousal: number,
  tdError = 0,
  noveltyScore = 0,
): ANSState {
  const threat = clampANS(threatLevel);
  const reward = clampANS(rewardLevel);
  const arousal = clampANS(globalArousal);
  const ema = (prev: number, target: number, tau: number) =>
    clampANS(prev + (target - prev) * (1 / tau));

  // --- SNS PATHWAY: Hypothalamus → LC → Amygdala → Motor ---
  const hypothalamusTarget = clampANS(
    threat * 0.6 + arousal * 0.3 + (1 - reward) * 0.1,
  );
  const hypothalamusActivation = ema(
    prev.hypothalamusActivation,
    hypothalamusTarget,
    8,
  );
  const lcTarget = clampANS(hypothalamusActivation * 0.7 + threat * 0.3);
  const locusCoeruleusActivation = ema(
    prev.locusCoeruleusActivation,
    lcTarget,
    5,
  );

  // --- PNS PATHWAY: Vagus → NTS → Hippocampus → PFC ---
  const vagalTarget = clampANS(
    (1 - threat) * 0.5 + reward * 0.3 + (1 - arousal) * 0.2,
  );
  const vagalTone = ema(prev.vagalTone, vagalTarget, 12);
  const ntsTarget = clampANS(vagalTone * 0.8 + reward * 0.2);
  const ntsMediationSignal = ema(prev.ntsMediationSignal, ntsTarget, 10);

  // --- TONE COMPUTATION ---
  const sympatheticTarget = clampANS(
    threat * 0.6 + arousal * 0.3 + (1 - reward) * 0.1,
  );
  const sympatheticTone = clampANS(
    prev.sympatheticTone + (sympatheticTarget - prev.sympatheticTone) * 0.1,
  );
  const parasympTarget = clampANS(
    (1 - threat) * 0.5 + reward * 0.3 + (1 - arousal) * 0.2,
  );
  const parasympatheticTone = clampANS(
    prev.parasympatheticTone +
      (parasympTarget - prev.parasympatheticTone) * 0.05,
  );
  const autonomicBalanceIndex = Math.max(
    -1,
    Math.min(1, sympatheticTone - parasympatheticTone),
  );

  const heartRateProxy = Math.max(
    60,
    Math.min(180, 70 + sympatheticTone * 60 - parasympatheticTone * 20),
  );
  const hrvProxy = clampANS(1 - sympatheticTone * 0.6);
  const stressSignal = clampANS(sympatheticTone * 0.7 + (1 - hrvProxy) * 0.3);
  const recoverySignal = clampANS(parasympatheticTone * 0.8 + hrvProxy * 0.2);
  const interoceptiveStateSignal = clampANS(
    (stressSignal + (1 - recoverySignal)) / 2,
  );
  const selfStateWeight = clampANS(
    interoceptiveStateSignal * 0.4 + Math.abs(autonomicBalanceIndex) * 0.1,
  );

  // --- 6-CHANNEL NEUROMODULATOR UPDATE ---
  // Causal chain: ANS state → nuclei activity → neuromodulator release → regional gain
  const prev_nm = prev.neuromodulators;

  // DA: VTA → dopamine. Reward + positive TD error raise DA.
  const daTarget = clampANS(
    0.5 + (tdError ?? 0) * 0.4 + reward * 0.3 - threat * 0.2,
  );
  const dopamine = clampANS(ema(prev_nm.dopamine, daTarget, 20));

  // NE: LC → norepinephrine. LC activation directly maps to NE release.
  const neTarget = clampANS(
    locusCoeruleusActivation * 0.7 + noveltyScore * 0.3,
  );
  const norepinephrine = clampANS(ema(prev_nm.norepinephrine, neTarget, 15));

  // 5HT: Raphe → serotonin. PNS/vagal tone drives serotonin.
  const shtTarget = clampANS(
    parasympatheticTone * 0.6 + (1 - threat) * 0.3 + reward * 0.1,
  );
  const serotonin = clampANS(ema(prev_nm.serotonin, shtTarget, 30));

  // ACh: BF/septum → acetylcholine. Arousal + novelty = encoding mode.
  const achTarget = clampANS(
    arousal * 0.4 + noveltyScore * 0.4 + (1 - sympatheticTone * 0.5) * 0.2,
  );
  const acetylcholine = clampANS(ema(prev_nm.acetylcholine, achTarget, 25));

  // GABA: inhibitory tone rises during rest (Froemke 2015)
  const gabaTarget = clampANS(
    (1 - arousal) * 0.5 + parasympatheticTone * 0.3 + 0.2,
  );
  const gaba = clampANS(ema(prev_nm.gaba, gabaTarget, 40));

  // Glu: excitatory drive, reciprocal with GABA
  const gluTarget = clampANS(
    arousal * 0.4 + (1 - prev_nm.gaba) * 0.3 + reward * 0.3,
  );
  const glutamate = clampANS(ema(prev_nm.glutamate, gluTarget, 20));

  return {
    sympatheticTone,
    parasympatheticTone,
    autonomicBalanceIndex,
    heartRateProxy,
    hrvProxy,
    stressSignal,
    recoverySignal,
    interoceptiveStateSignal,
    selfStateWeight,
    prevBalanceIndex: prev.autonomicBalanceIndex,
    neuromodulators: {
      dopamine,
      norepinephrine,
      serotonin,
      acetylcholine,
      gaba,
      glutamate,
    },
    hypothalamusActivation,
    locusCoeruleusActivation,
    vagalTone,
    ntsMediationSignal,
  };
}

// Apply ANS + neuromodulator state to brain regions
// This IS the causal connection: body state → brain gain
export function applyANSToBrainRegions(
  ansState: ANSState,
  regions: Array<{ region: string; activation: number }>,
): void {
  const nm = ansState.neuromodulators;
  for (const rs of regions) {
    const r = rs.region;
    let delta = 0;

    // Amygdala: stress + NE upregulation (LeDoux 2000)
    if (r === "Amygdala") {
      delta = ansState.stressSignal * 0.15 + nm.norepinephrine * 0.08;
    }
    // PFC: stress degrades executive function; serotonin and para recovery protect it
    else if (r === "PrefrontalCortex" || r === "DorsolateralPFC") {
      delta =
        -(ansState.stressSignal * 0.08) +
        nm.serotonin * 0.04 +
        ansState.ntsMediationSignal * 0.03;
    }
    // Hippocampus: ACh encoding gate + vagal support (Hasselmo 1999)
    else if (r === "Hippocampus") {
      delta =
        ansState.recoverySignal * 0.05 +
        nm.acetylcholine * 0.06 +
        ansState.vagalTone * 0.03;
    }
    // Insula: interoceptive signal drives insular cortex
    else if (r === "Insula") {
      delta = ansState.interoceptiveStateSignal * 0.12;
    }
    // ACC/dACC: autonomic imbalance → conflict monitoring
    else if (r === "AnteriorCingulateCortex" || r === "DorsalACC") {
      delta = Math.abs(ansState.autonomicBalanceIndex) * 0.08;
    }
    // LC: directly reflects NE (it IS the LC)
    else if (r === "LocusCoeruleus") {
      delta = (ansState.locusCoeruleusActivation - rs.activation) * 0.3;
    }
    // Hypothalamus: directly reflects SNS activation
    else if (r === "Hypothalamus") {
      delta = (ansState.hypothalamusActivation - rs.activation) * 0.2;
    }
    // VTA: dopamine release gate
    else if (r === "VentralTegmentalArea") {
      delta = nm.dopamine * 0.06;
    }
    // Raphe: serotonin
    else if (r === "Raphe" || r === "RapheMagnus") {
      delta = nm.serotonin * 0.05;
    }
    // NAc: DA-modulated reward
    else if (r === "NucleusAccumbens") {
      delta = nm.dopamine * 0.07;
    }
    // Basal ganglia: DA modulates action selection
    else if (r === "BasalGanglia" || r === "Striatum") {
      delta = nm.dopamine * 0.05 - nm.gaba * 0.03;
    }

    if (delta !== 0) {
      rs.activation = Math.max(0, Math.min(1, rs.activation + delta));
    }
  }
}

export function getANSEventType(ansState: ANSState): string | null {
  if (ansState.recoverySignal > 0.7 && ansState.stressSignal < 0.3)
    return "REGULATION_POSITIVE";
  if (ansState.stressSignal > 0.85) return "STRESS_PEAK";
  if (
    Math.abs(ansState.prevBalanceIndex) > 0.5 &&
    Math.abs(ansState.autonomicBalanceIndex) < 0.1
  )
    return "AUTONOMIC_BALANCE_RESTORED";
  return null;
}
