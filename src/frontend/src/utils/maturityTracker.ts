// MaturityTracker — 9 hard gate conditions
// "experiment-ready" badge is BLOCKED until ALL 9 pass
// Each condition is checked against real system state.

export type MaturityConditionId =
  | "stable-control-runtime"
  | "competition-before-commitment"
  | "gated-working-memory"
  | "persistent-state"
  | "body-state-regulation"
  | "prediction-error-handling"
  | "failure-changes-behavior"
  | "sparse-event-driven-compute"
  | "automatic-proof-live";

export interface MaturityCondition {
  id: MaturityConditionId;
  label: string;
  description: string;
  passed: boolean;
  score: number;
  evidence: string;
  lastChecked: number;
}

export interface MaturityState {
  conditions: MaturityCondition[];
  maturityScore: number;
  isExperimentReady: boolean;
  maturityFraction: number;
  lastUpdated: number;
  readinessLabel: string;
}

export class MaturityTracker {
  private state: MaturityState;
  private checkInterval = 10;
  private lastCheck = 0;

  constructor() {
    this.state = this.initState();
  }

  private initState(): MaturityState {
    const conditions: MaturityCondition[] = [
      {
        id: "stable-control-runtime",
        label: "Stable Control Runtime",
        description:
          "No constant saturation, collapse, or runaway oscillation. Bounded thresholds and stable transitions.",
        passed: false,
        score: 0,
        evidence: "awaiting data",
        lastChecked: 0,
      },
      {
        id: "competition-before-commitment",
        label: "Competition Before Commitment",
        description:
          "Outputs emerge through salience, arbitration, and thresholds. No flat equal-module influence.",
        passed: false,
        score: 0,
        evidence: "awaiting data",
        lastChecked: 0,
      },
      {
        id: "gated-working-memory",
        label: "Gated Working Memory",
        description:
          "Active workspace is scarce and selective. Context flooding under control.",
        passed: false,
        score: 0,
        evidence: "awaiting data",
        lastChecked: 0,
      },
      {
        id: "persistent-state",
        label: "Persistent State",
        description:
          "Goals, tensions, body pressures, and failures carry forward meaningfully.",
        passed: false,
        score: 0,
        evidence: "awaiting data",
        lastChecked: 0,
      },
      {
        id: "body-state-regulation",
        label: "Body-State Regulation",
        description:
          "Stress/recovery and regulation loops alter action and thresholds.",
        passed: false,
        score: 0,
        evidence: "awaiting data",
        lastChecked: 0,
      },
      {
        id: "prediction-error-handling",
        label: "Prediction/Error Handling",
        description: "Mismatch changes learning, salience, or policy.",
        passed: false,
        score: 0,
        evidence: "awaiting data",
        lastChecked: 0,
      },
      {
        id: "failure-changes-behavior",
        label: "Failure Changes Future Behavior",
        description:
          "Failure memory affects future policy. System doesn't repeat mistakes blindly.",
        passed: false,
        score: 0,
        evidence: "awaiting data",
        lastChecked: 0,
      },
      {
        id: "sparse-event-driven-compute",
        label: "Sparse/Event-Driven Compute",
        description:
          "Not all modules fire all the time. Compute cost is increasingly selective.",
        passed: false,
        score: 0,
        evidence: "awaiting data",
        lastChecked: 0,
      },
      {
        id: "automatic-proof-live",
        label: "Automatic Proof Live",
        description:
          "Baseline testing, repeated-run testing, recording, and reports are operational.",
        passed: false,
        score: 0,
        evidence: "awaiting data",
        lastChecked: 0,
      },
    ];

    return {
      conditions,
      maturityScore: 0,
      isExperimentReady: false,
      maturityFraction: 0,
      lastUpdated: Date.now(),
      readinessLabel: "Not ready — conditions not yet met",
    };
  }

  update(metrics: {
    tick: number;
    saturationRate: number;
    oscillationIndex: number;
    competitionScore: number;
    wmOccupancy: number;
    wmChurnRate: number;
    persistentTensionCount: number;
    ansModulationActive: boolean;
    predictionErrorActive: boolean;
    failureMemoryActive: boolean;
    sparseActivationRatio: number;
    experimentRunnerLive: boolean;
    recordSystemLive: boolean;
    reportsGenerated: number;
  }): void {
    if (metrics.tick - this.lastCheck < this.checkInterval) return;
    this.lastCheck = metrics.tick;

    const c = this.state.conditions;

    const stabilityScore = Math.max(
      0,
      1 - metrics.saturationRate * 2 - metrics.oscillationIndex,
    );
    c[0].score = stabilityScore;
    c[0].passed = stabilityScore > 0.6;
    c[0].evidence = `saturation=${(metrics.saturationRate * 100).toFixed(0)}% oscillation=${metrics.oscillationIndex.toFixed(2)}`;

    c[1].score = metrics.competitionScore;
    c[1].passed = metrics.competitionScore > 0.5;
    c[1].evidence = `competition score=${metrics.competitionScore.toFixed(2)}`;

    const wmScore =
      metrics.wmOccupancy < 0.9
        ? Math.max(0, 1 - metrics.wmChurnRate * 0.5)
        : 0.2;
    c[2].score = wmScore;
    c[2].passed = wmScore > 0.5 && metrics.wmOccupancy < 0.95;
    c[2].evidence = `WM occupancy=${(metrics.wmOccupancy * 100).toFixed(0)}% churn=${metrics.wmChurnRate.toFixed(2)}`;

    const persistScore = Math.min(1, metrics.persistentTensionCount / 3);
    c[3].score = persistScore;
    c[3].passed = metrics.persistentTensionCount >= 1;
    c[3].evidence = `active tensions=${metrics.persistentTensionCount}`;

    c[4].score = metrics.ansModulationActive ? 0.8 : 0.1;
    c[4].passed = metrics.ansModulationActive;
    c[4].evidence = `ANS modulation=${metrics.ansModulationActive ? "active" : "inactive"}`;

    c[5].score = metrics.predictionErrorActive ? 0.8 : 0.1;
    c[5].passed = metrics.predictionErrorActive;
    c[5].evidence = `prediction-error=${metrics.predictionErrorActive ? "active" : "inactive"}`;

    c[6].score = metrics.failureMemoryActive ? 0.8 : 0.1;
    c[6].passed = metrics.failureMemoryActive;
    c[6].evidence = `failure memory=${metrics.failureMemoryActive ? "revising policy" : "inactive"}`;

    c[7].score = metrics.sparseActivationRatio;
    c[7].passed = metrics.sparseActivationRatio > 0.3;
    c[7].evidence = `sparse ratio=${(metrics.sparseActivationRatio * 100).toFixed(0)}%`;

    const proofScore =
      (metrics.experimentRunnerLive ? 0.4 : 0) +
      (metrics.recordSystemLive ? 0.3 : 0) +
      Math.min(0.3, metrics.reportsGenerated * 0.1);
    c[8].score = proofScore;
    c[8].passed =
      metrics.experimentRunnerLive &&
      metrics.recordSystemLive &&
      metrics.reportsGenerated > 0;
    c[8].evidence = `runner=${metrics.experimentRunnerLive} recorder=${metrics.recordSystemLive} reports=${metrics.reportsGenerated}`;

    this.state.maturityScore = c.filter((x) => x.passed).length;
    this.state.isExperimentReady = c.every((x) => x.passed);
    this.state.maturityFraction = this.state.maturityScore / 9;
    this.state.lastUpdated = Date.now();
    this.state.conditions = [...c];
    this.state.readinessLabel = this.state.isExperimentReady
      ? "EXPERIMENT-READY — all 9 conditions met"
      : `${this.state.maturityScore}/9 conditions met — not yet ready`;

    for (const x of c) {
      x.lastChecked = metrics.tick;
    }
  }

  getState(): MaturityState {
    return { ...this.state };
  }

  isExperimentReady(): boolean {
    return this.state.isExperimentReady;
  }

  getScore(): number {
    return this.state.maturityScore;
  }
}

export const maturityTracker = new MaturityTracker();
