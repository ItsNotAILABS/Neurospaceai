// ─── Coupling Telemetry ───────────────────────────────────────────────────────
// Tracks all required coupling measurements from the architecture directive.
// Every coupling listed in Section 3 must be measurable here.

export interface CouplingMeasurement {
  couplingId: string;
  sourceName: string;
  targetName: string;
  influenceRate: number; // fraction of ticks where source changed target
  lastMagnitude: number; // size of last influence
  totalInfluences: number;
  avgMagnitude: number;
  active: boolean; // was this coupling exercised recently?
}

export interface CouplingTelemetrySnapshot {
  ts: number;
  couplings: CouplingMeasurement[];
  overallInfluenceRate: number;
  activeCouplingCount: number;
  interoceptiveInfluenceRate: number;
  cardioInfluenceRate: number;
  ansInfluenceRate: number;
  sensoryUncertaintyBurden: number;
  bodyStatePolicyInfluence: number;
  overloadResponseQuality: number;
  recoveryResponseQuality: number;
  predictionRevisionRate: number;
  learningEffectiveness: number;
  routeAdaptation: number;
  policyDiversityScore: number;
  persistenceUsefulnessScore: number;
  computeEfficiencyUnderStress: number;
}

class CouplingTelemetryStore {
  private couplings = new Map<string, CouplingMeasurement>();
  private tickCount = 0;
  private lastSnapshot: CouplingTelemetrySnapshot | null = null;

  private ensureCoupling(
    id: string,
    source: string,
    target: string,
  ): CouplingMeasurement {
    if (!this.couplings.has(id)) {
      this.couplings.set(id, {
        couplingId: id,
        sourceName: source,
        targetName: target,
        influenceRate: 0,
        lastMagnitude: 0,
        totalInfluences: 0,
        avgMagnitude: 0,
        active: false,
      });
    }
    return this.couplings.get(id)!;
  }

  /**
   * Record a coupling event. magnitude=0 means no influence this tick.
   */
  record(id: string, source: string, target: string, magnitude: number): void {
    const c = this.ensureCoupling(id, source, target);
    const influenced = magnitude > 0.01;
    c.influenceRate = c.influenceRate * 0.97 + (influenced ? 1 : 0) * 0.03;
    c.lastMagnitude = magnitude;
    if (influenced) {
      c.totalInfluences++;
      c.avgMagnitude = c.avgMagnitude * 0.95 + magnitude * 0.05;
    }
    c.active = influenced;
  }

  tick(): void {
    this.tickCount++;
  }

  /**
   * Generate a snapshot with all required measurable outputs.
   */
  snapshot(
    overrides: Partial<CouplingTelemetrySnapshot> = {},
  ): CouplingTelemetrySnapshot {
    const all = [...this.couplings.values()];
    const active = all.filter((c) => c.active);

    const avg = (ids: string[]): number => {
      const matching = all.filter((c) =>
        ids.some((id) => c.couplingId.startsWith(id)),
      );
      if (matching.length === 0) return 0;
      return (
        matching.reduce((s, c) => s + c.influenceRate, 0) / matching.length
      );
    };

    const interoceptiveRate = avg(["interoception_"]);
    const cardioRate = avg(["cardio_"]);
    const ansRate = avg(["ans_"]);

    const snap: CouplingTelemetrySnapshot = {
      ts: Date.now(),
      couplings: all,
      overallInfluenceRate:
        all.reduce((s, c) => s + c.influenceRate, 0) / Math.max(1, all.length),
      activeCouplingCount: active.length,
      interoceptiveInfluenceRate: interoceptiveRate,
      cardioInfluenceRate: cardioRate,
      ansInfluenceRate: ansRate,
      sensoryUncertaintyBurden:
        this.couplings.get("sensory_uncertainty_confidence")?.lastMagnitude ??
        0,
      bodyStatePolicyInfluence:
        this.couplings.get("interoception_arbitration")?.influenceRate ?? 0,
      overloadResponseQuality:
        this.couplings.get("overload_recovery_bias")?.influenceRate ?? 0,
      recoveryResponseQuality:
        this.couplings.get("cardio_recovery")?.influenceRate ?? 0,
      predictionRevisionRate:
        this.couplings.get("prediction_error_policy_revision")?.influenceRate ??
        0,
      learningEffectiveness:
        this.couplings.get("prediction_error_learning")?.influenceRate ?? 0,
      routeAdaptation:
        this.couplings.get("memory_action_bias")?.influenceRate ?? 0,
      policyDiversityScore: 0, // computed externally from arbitration output
      persistenceUsefulnessScore: 0, // computed externally
      computeEfficiencyUnderStress:
        this.couplings.get("regulation_sparse_compute")?.influenceRate ?? 0,
      ...overrides,
    };

    this.lastSnapshot = snap;
    return snap;
  }

  getLastSnapshot(): CouplingTelemetrySnapshot | null {
    return this.lastSnapshot;
  }

  getCoupling(id: string): CouplingMeasurement | undefined {
    return this.couplings.get(id);
  }

  getAll(): CouplingMeasurement[] {
    return [...this.couplings.values()];
  }
}

export const globalCouplingTelemetry = new CouplingTelemetryStore();

/**
 * Initialize all required couplings from Section 3 of the directive.
 * Called once at startup so all coupling IDs are registered.
 */
export function initializeRequiredCouplings(): void {
  const REQUIRED_COUPLINGS: Array<[string, string, string]> = [
    ["interoception_salience", "interoception", "salience"],
    ["interoception_working_memory", "interoception", "working_memory_gate"],
    ["interoception_arbitration", "interoception", "arbitration_thresholds"],
    ["cardio_persistence", "cardio_state", "persistence_capacity"],
    ["cardio_sustained_task", "cardio_state", "sustained_task_viability"],
    ["cardio_recovery", "cardio_state", "recovery_behavior"],
    [
      "ans_urgency_sensitivity",
      "autonomic_state",
      "urgency_threat_sensitivity",
    ],
    ["ans_commitment_speed", "autonomic_state", "commitment_speed"],
    [
      "sensory_uncertainty_confidence",
      "sensory_uncertainty",
      "confidence_pressure",
    ],
    ["overload_recovery_bias", "overload", "recovery_bias_policy_shift"],
    ["memory_salience_bias", "memory", "salience_bias"],
    ["memory_action_bias", "memory", "action_bias"],
    ["prediction_error_salience", "prediction_error", "salience"],
    ["prediction_error_learning", "prediction_error", "learning"],
    ["prediction_error_policy_revision", "prediction_error", "policy_revision"],
    [
      "regulation_sparse_compute",
      "regulation_state",
      "sparse_compute_escalation",
    ],
    ["regulation_threshold_shifts", "regulation_state", "threshold_shifts"],
    [
      "cross_timescale_policy_bias",
      "cross_timescale_memory_regulation",
      "fast_loop_policy_bias",
    ],
  ];

  for (const [id, source, target] of REQUIRED_COUPLINGS) {
    globalCouplingTelemetry.record(id, source, target, 0);
  }
}

// Initialize on import
initializeRequiredCouplings();
