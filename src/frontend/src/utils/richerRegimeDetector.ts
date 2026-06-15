// RicherRegimeDetector
// PRE-REGISTERED INDICATORS — defined BEFORE any result is observed.
// 3-level claim hierarchy (enforced):
//   Level 1: Better adaptive behavior
//   Level 2: Richer emergence-supporting substrate
//   Level 3: Possible deeper regime shift worth studying (ONLY if L1+L2 sustained)
// This is NOT a consciousness detector.

export type RicherRegimeConditionId =
  | "recurrence"
  | "multi-timescale-coupling"
  | "body-state-pressure"
  | "prediction-error-loops"
  | "memory-persistence"
  | "conflict-arbitration"
  | "sparse-event-driven-control"
  | "self-state-regulation"
  | "learning-from-consequence"
  | "non-scripted-world-interaction";

export interface PreRegisteredIndicator {
  id: RicherRegimeConditionId;
  label: string;
  description: string;
  testCriteria: string;
  active: boolean;
  strength: number;
  measuredAt: number;
}

export const PRE_REGISTERED_INDICATORS: Omit<
  PreRegisteredIndicator,
  "active" | "strength" | "measuredAt"
>[] = [
  {
    id: "recurrence",
    label: "Recurrence",
    description:
      "State feeds back from previous ticks into current computation.",
    testCriteria:
      "Recurrent loop active and influencing activation by > 0.05 per tick",
  },
  {
    id: "multi-timescale-coupling",
    label: "Multi-Timescale Coupling",
    description:
      "Fast, mid, and slow loops are coupled — changes in one affect the others.",
    testCriteria:
      "Cross-timescale influence coefficient > 0.1 between fast and slow loops",
  },
  {
    id: "body-state-pressure",
    label: "Body-State Pressure",
    description:
      "Internal state drives behavior through pressure, not just reactive triggers.",
    testCriteria:
      "ANS modulation actively shifting thresholds for > 30% of ticks",
  },
  {
    id: "prediction-error-loops",
    label: "Prediction-Error Loops",
    description:
      "Expectation mismatches feed back to salience, uncertainty, and learning.",
    testCriteria:
      "PE signal causing route revision or learning gate update at least once per session",
  },
  {
    id: "memory-persistence",
    label: "Memory Persistence",
    description:
      "Useful state carries forward across cycles and shapes current behavior.",
    testCriteria:
      "Memory recall influencing salience or action on > 20% of ticks",
  },
  {
    id: "conflict-arbitration",
    label: "Conflict Arbitration",
    description:
      "Competing drives are resolved through real arbitration, not preset rules.",
    testCriteria:
      "Arbitration layer resolving at least one meaningful conflict per session",
  },
  {
    id: "sparse-event-driven-control",
    label: "Sparse/Event-Driven Control",
    description:
      "Computation is selective — only triggered by meaningful threshold crossings.",
    testCriteria:
      "Sparse activation ratio > 0.3 (> 30% of modules idle per tick)",
  },
  {
    id: "self-state-regulation",
    label: "Self-State Regulation",
    description:
      "The system monitors and acts on its own pressure, stability, and urgency.",
    testCriteria:
      "Self-state model influencing arbitration or recovery bias on > 25% of ticks",
  },
  {
    id: "learning-from-consequence",
    label: "Learning From Consequence/Failure",
    description:
      "The system changes future policy based on outcome of past actions.",
    testCriteria:
      "Failure memory causing route revision or policy down-weighting at least once",
  },
  {
    id: "non-scripted-world-interaction",
    label: "Non-Scripted World Interaction",
    description:
      "Behavior emerges from internal state meeting world, not pre-written sequences.",
    testCriteria:
      "Agent behavior varies based on internal state, not just environment state",
  },
];

export interface RicherRegimeCandidateEvent {
  eventType: "RicherRegimeCandidateEvent";
  tick: number;
  coOccurrenceScore: number;
  activeIndicators: RicherRegimeConditionId[];
  claimLevel: 1 | 2 | 3;
  claimLabel: string;
  claimDescription: string;
  artifactProbability: number;
  noteForResearcher: string;
}

export class RicherRegimeDetector {
  private indicators: PreRegisteredIndicator[];
  private events: RicherRegimeCandidateEvent[] = [];
  private level1MetTicks = 0;
  private level2MetTicks = 0;
  private currentTick = 0;

  constructor() {
    this.indicators = PRE_REGISTERED_INDICATORS.map((ind) => ({
      ...ind,
      active: false,
      strength: 0,
      measuredAt: 0,
    }));
  }

  update(metrics: {
    tick: number;
    recurrenceInfluence: number;
    crossTimescaleCoeff: number;
    ansThresholdShiftFraction: number;
    predictionErrorRoutRevisions: number;
    memoryInfluenceFraction: number;
    arbitrationConflictsResolved: number;
    sparseActivationRatio: number;
    selfStateInfluenceFraction: number;
    failureRevisions: number;
    behaviorVarianceFromState: number;
    artifactProbability: number;
  }): void {
    this.currentTick = metrics.tick;

    this.indicators[0].active = metrics.recurrenceInfluence > 0.05;
    this.indicators[0].strength = Math.min(
      1,
      metrics.recurrenceInfluence / 0.2,
    );

    this.indicators[1].active = metrics.crossTimescaleCoeff > 0.1;
    this.indicators[1].strength = Math.min(
      1,
      metrics.crossTimescaleCoeff / 0.3,
    );

    this.indicators[2].active = metrics.ansThresholdShiftFraction > 0.3;
    this.indicators[2].strength = Math.min(
      1,
      metrics.ansThresholdShiftFraction / 0.6,
    );

    this.indicators[3].active = metrics.predictionErrorRoutRevisions > 0;
    this.indicators[3].strength = Math.min(
      1,
      metrics.predictionErrorRoutRevisions / 3,
    );

    this.indicators[4].active = metrics.memoryInfluenceFraction > 0.2;
    this.indicators[4].strength = Math.min(
      1,
      metrics.memoryInfluenceFraction / 0.5,
    );

    this.indicators[5].active = metrics.arbitrationConflictsResolved > 0;
    this.indicators[5].strength = Math.min(
      1,
      metrics.arbitrationConflictsResolved / 5,
    );

    this.indicators[6].active = metrics.sparseActivationRatio > 0.3;
    this.indicators[6].strength = Math.min(
      1,
      metrics.sparseActivationRatio / 0.7,
    );

    this.indicators[7].active = metrics.selfStateInfluenceFraction > 0.25;
    this.indicators[7].strength = Math.min(
      1,
      metrics.selfStateInfluenceFraction / 0.6,
    );

    this.indicators[8].active = metrics.failureRevisions > 0;
    this.indicators[8].strength = Math.min(1, metrics.failureRevisions / 3);

    this.indicators[9].active = metrics.behaviorVarianceFromState > 0.3;
    this.indicators[9].strength = Math.min(
      1,
      metrics.behaviorVarianceFromState / 0.7,
    );

    for (const ind of this.indicators) {
      ind.measuredAt = metrics.tick;
    }

    this.checkForEvent(metrics.artifactProbability);
  }

  private checkForEvent(artifactProbability: number): void {
    const activeIndicators = this.indicators
      .filter((i) => i.active)
      .map((i) => i.id);
    const score = activeIndicators.length;

    if (score < 5) return;

    const level1Indicators: RicherRegimeConditionId[] = [
      "recurrence",
      "memory-persistence",
      "learning-from-consequence",
    ];
    const level1Met = level1Indicators.every((id) =>
      activeIndicators.includes(id),
    );
    if (!level1Met) return;

    this.level1MetTicks++;

    const level2Indicators: RicherRegimeConditionId[] = [
      "body-state-pressure",
      "prediction-error-loops",
      "conflict-arbitration",
      "non-scripted-world-interaction",
    ];
    const level2Met = level2Indicators.every((id) =>
      activeIndicators.includes(id),
    );
    if (level2Met) this.level2MetTicks++;

    const level3Eligible =
      level2Met &&
      this.level1MetTicks > 50 &&
      this.level2MetTicks > 20 &&
      score >= 8 &&
      artifactProbability < 0.2;

    const claimLevel: 1 | 2 | 3 = level3Eligible ? 3 : level2Met ? 2 : 1;

    const event: RicherRegimeCandidateEvent = {
      eventType: "RicherRegimeCandidateEvent",
      tick: this.currentTick,
      coOccurrenceScore: score,
      activeIndicators,
      claimLevel,
      claimLabel:
        claimLevel === 1
          ? "Level 1: Better Adaptive Behavior"
          : claimLevel === 2
            ? "Level 2: Richer Emergence-Supporting Substrate"
            : "Level 3: Possible Deeper Regime Shift — Warrants Study",
      claimDescription:
        claimLevel === 1
          ? "The system shows improved adaptive behavior based on multiple active indicators."
          : claimLevel === 2
            ? "The substrate supports richer emergence. Multiple regulatory and memory conditions are co-active."
            : "Multiple high-quality conditions are co-active and sustained. This warrants careful scientific study. This is NOT a consciousness detection.",
      artifactProbability,
      noteForResearcher: `${score}/10 pre-registered indicators active. Claim level ${claimLevel} of 3. ${claimLevel < 3 ? "Run ablations to separate mechanism from coincidence. " : ""}Artifact probability: ${(artifactProbability * 100).toFixed(0)}%. Do not advance beyond Level ${claimLevel} without ablation evidence.`,
    };

    const last = this.events[this.events.length - 1];
    if (
      !last ||
      Math.abs(last.coOccurrenceScore - score) >= 1 ||
      this.currentTick - last.tick > 20
    ) {
      this.events.push(event);
      if (this.events.length > 100) this.events = this.events.slice(-100);
    }
  }

  getLatestEvent(): RicherRegimeCandidateEvent | null {
    return this.events.length > 0 ? this.events[this.events.length - 1] : null;
  }

  getEvents(): RicherRegimeCandidateEvent[] {
    return [...this.events];
  }

  getIndicators(): PreRegisteredIndicator[] {
    return [...this.indicators];
  }

  getActiveCount(): number {
    return this.indicators.filter((i) => i.active).length;
  }
}

export const richerRegimeDetector = new RicherRegimeDetector();
