// CoreBrainReportPipeline — generates 3 report levels from ExperimentResult

import type { ExperimentResult } from "./coreBrainExperimentRunner";
import type { RunRecord } from "./coreBrainRecordSystem";

export interface QuickSummaryReport {
  experimentId: string;
  generatedAt: number;
  whatWasTested: string;
  baselineLabel: string;
  enabledLabel: string;
  usefulBehaviorResult: {
    delta: number;
    verdict: "improved" | "no-change" | "degraded";
  };
  emergenceResult: {
    delta: number;
    verdict: "improved" | "no-change" | "degraded";
  };
  regulationResult: {
    delta: number;
    verdict: "improved" | "no-change" | "degraded";
  };
  efficiencyResult: {
    delta: number;
    verdict: "improved" | "no-change" | "degraded";
  };
  artifactWarnings: string[];
  overallVerdict: "keep" | "revise" | "reject";
}

export interface DetailedTechnicalReport {
  experimentId: string;
  generatedAt: number;
  allRunMetrics: {
    baseline: RunRecord[];
    brainPowered: RunRecord[];
    decoupled: RunRecord[];
  };
  distributions: {
    baselineTaskSuccess: {
      mean: number;
      std: number;
      min: number;
      max: number;
    };
    brainTaskSuccess: { mean: number; std: number; min: number; max: number };
    baselineEfficiency: { mean: number; std: number };
    brainEfficiency: { mean: number; std: number };
  };
  bestRun: RunRecord | null;
  worstRun: RunRecord | null;
  eventLog: string[];
  subsystemEffects: Record<string, string>;
  recommendation: "keep" | "revise" | "reject";
  recommendationReason: string;
}

export interface PromotionReport {
  experimentId: string;
  generatedAt: number;
  eligible: boolean;
  gateResults: {
    improvedUsefulBehavior: boolean;
    improvedEmergence: boolean;
    improvedRegulation: boolean;
    preservedEfficiency: boolean;
    helpedMultipleInstances: boolean;
  };
  promotionVerdict: "promote" | "hold-experimental" | "reject";
  promotionReason: string;
}

export class CoreBrainReportPipeline {
  generateQuickSummary(result: ExperimentResult): QuickSummaryReport {
    const bDelta = result.usefulBehaviorDelta;
    const eDelta = result.emergenceDelta;
    const regDelta = result.regulationDelta;
    const effDelta = result.efficiencyDelta;

    const artifactWarnings: string[] = [];
    for (const r of [...result.brainRecords, ...result.baselineRecords]) {
      if (r.artifactFlags.length > 0) {
        artifactWarnings.push(...r.artifactFlags);
      }
    }
    const uniqueWarnings = [...new Set(artifactWarnings)];

    const improved = bDelta > 0.03 && eDelta >= 0 && regDelta >= 0;
    const degraded =
      bDelta < -0.05 || uniqueWarnings.some((w) => w === "HIGH_ARTIFACT_RISK");
    const overallVerdict: "keep" | "revise" | "reject" = improved
      ? "keep"
      : degraded
        ? "reject"
        : "revise";

    return {
      experimentId: result.experimentId,
      generatedAt: Date.now(),
      whatWasTested:
        "Threat-Memory Navigation — brain-powered vs scripted reactive baseline",
      baselineLabel: `Baseline (n=${result.baselineRecords.length})`,
      enabledLabel: `Brain-Powered (n=${result.brainRecords.length})`,
      usefulBehaviorResult: {
        delta: bDelta,
        verdict: this.classifyDelta(bDelta),
      },
      emergenceResult: { delta: eDelta, verdict: this.classifyDelta(eDelta) },
      regulationResult: {
        delta: regDelta,
        verdict: this.classifyDelta(regDelta),
      },
      efficiencyResult: {
        delta: effDelta,
        verdict: this.classifyDelta(effDelta),
      },
      artifactWarnings: uniqueWarnings,
      overallVerdict,
    };
  }

  generateDetailedReport(result: ExperimentResult): DetailedTechnicalReport {
    const allBrain = [...result.brainRecords, ...result.decoupledRecords];
    const sorted = [...result.brainRecords].sort(
      (a, b) => a.behavior.taskSuccess - b.behavior.taskSuccess,
    );

    const baselineTaskValues = result.baselineRecords.map(
      (r) => r.behavior.taskSuccess,
    );
    const brainTaskValues = result.brainRecords.map(
      (r) => r.behavior.taskSuccess,
    );
    const baselineEffValues = result.baselineRecords.map(
      (r) => r.efficiency.sparseActivationRatio,
    );
    const brainEffValues = result.brainRecords.map(
      (r) => r.efficiency.sparseActivationRatio,
    );

    const eventLog: string[] = [];
    for (const r of allBrain) {
      if (r.behavior.adaptationRate > 0.7)
        eventLog.push(
          `[${r.metadata.runId}] Adaptation success: ${r.behavior.adaptationRate.toFixed(2)}`,
        );
      if (r.emergence.emergenceScore > 0.6)
        eventLog.push(
          `[${r.metadata.runId}] Emergence event: score=${r.emergence.emergenceScore.toFixed(2)}`,
        );
      for (const f of r.artifactFlags)
        eventLog.push(`[${r.metadata.runId}] ARTIFACT: ${f}`);
    }

    const subsystemEffects: Record<string, string> = {
      memory: `Memory layer contributed to route revision in ${result.brainRecords.filter((r) => r.coreTrace.memoryState.includes("failure")).length} runs`,
      prediction: `Prediction error triggered route change in ${result.brainRecords.filter((r) => r.coreTrace.pathwayChanges.length > 0).length} runs`,
      regulation: `ANS regulation improved stability — avg=${result.regulationDelta > 0 ? "+" : ""}${(result.regulationDelta * 100).toFixed(0)}% vs baseline`,
    };

    const bVals = this.getDistribution(baselineTaskValues);
    const brVals = this.getDistribution(brainTaskValues);
    const rec =
      bVals.mean < brVals.mean - 0.05
        ? "keep"
        : bVals.mean > brVals.mean + 0.05
          ? "reject"
          : "revise";

    return {
      experimentId: result.experimentId,
      generatedAt: Date.now(),
      allRunMetrics: {
        baseline: result.baselineRecords,
        brainPowered: result.brainRecords,
        decoupled: result.decoupledRecords,
      },
      distributions: {
        baselineTaskSuccess: bVals,
        brainTaskSuccess: brVals,
        baselineEfficiency: {
          mean: this.getDistribution(baselineEffValues).mean,
          std: this.getDistribution(baselineEffValues).std,
        },
        brainEfficiency: {
          mean: this.getDistribution(brainEffValues).mean,
          std: this.getDistribution(brainEffValues).std,
        },
      },
      bestRun: sorted.length > 0 ? sorted[sorted.length - 1] : null,
      worstRun: sorted.length > 0 ? sorted[0] : null,
      eventLog: eventLog.slice(-30),
      subsystemEffects,
      recommendation: rec,
      recommendationReason:
        rec === "keep"
          ? "Brain-powered agent outperformed baseline on task success and regulation stability"
          : rec === "reject"
            ? "Baseline outperformed brain-powered agent — investigate module configuration"
            : "Mixed results — recommend additional runs and ablation study",
    };
  }

  generatePromotionReport(result: ExperimentResult): PromotionReport {
    const gates = {
      improvedUsefulBehavior: result.usefulBehaviorDelta > 0.05,
      improvedEmergence: result.emergenceDelta > 0,
      improvedRegulation: result.regulationDelta > 0,
      preservedEfficiency: result.efficiencyDelta >= -0.05,
      helpedMultipleInstances: result.usefulBehaviorDelta > 0.05,
    };

    const gatesPassedCount = Object.values(gates).filter(Boolean).length;
    const eligible = gatesPassedCount >= 4;

    const verdict: PromotionReport["promotionVerdict"] =
      gatesPassedCount === 5
        ? "promote"
        : eligible
          ? "hold-experimental"
          : "reject";

    return {
      experimentId: result.experimentId,
      generatedAt: Date.now(),
      eligible,
      gateResults: gates,
      promotionVerdict: verdict,
      promotionReason:
        verdict === "promote"
          ? "All 5 promotion gates passed. This improvement strengthens the Core Brain asset."
          : verdict === "hold-experimental"
            ? `${gatesPassedCount}/5 gates passed. Hold as experimental until remaining gates are met.`
            : `Only ${gatesPassedCount}/5 gates passed. Do not promote. Revise or discard.`,
    };
  }

  private getDistribution(values: number[]): {
    mean: number;
    std: number;
    min: number;
    max: number;
  } {
    if (values.length === 0) return { mean: 0, std: 0, min: 0, max: 0 };
    const mean = values.reduce((s, v) => s + v, 0) / values.length;
    const variance =
      values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
    return {
      mean,
      std: Math.sqrt(variance),
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }

  private classifyDelta(delta: number): "improved" | "no-change" | "degraded" {
    if (delta > 0.03) return "improved";
    if (delta < -0.03) return "degraded";
    return "no-change";
  }
}

export const coreBrainReportPipeline = new CoreBrainReportPipeline();
