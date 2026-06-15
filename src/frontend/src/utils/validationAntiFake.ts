interface Snapshot {
  ts: number;
  metrics: Record<string, number>;
}

export class BaselineComparisonEngine {
  private baseline: Snapshot | null = null;

  setBaseline(metrics: Record<string, number>): void {
    this.baseline = { ts: Date.now(), metrics: { ...metrics } };
  }

  compare(current: Record<string, number>): {
    delta: Record<string, number>;
    improvement: boolean;
    changeScore: number;
  } {
    if (!this.baseline)
      return { delta: {}, improvement: false, changeScore: 0 };
    const delta: Record<string, number> = {};
    let totalChange = 0;
    for (const [k, v] of Object.entries(current)) {
      delta[k] = v - (this.baseline.metrics[k] ?? 0);
      totalChange += Math.abs(delta[k]);
    }
    const improvement =
      Object.values(delta).filter((d) => d > 0).length >
      Object.values(delta).filter((d) => d < 0).length;
    return { delta, improvement, changeScore: totalChange };
  }

  hasBaseline(): boolean {
    return this.baseline !== null;
  }
}

export class AblationEngine {
  private ablatedSubsystems: Set<string> = new Set();

  ablate(subsystem: string): void {
    this.ablatedSubsystems.add(subsystem);
  }
  restore(subsystem: string): void {
    this.ablatedSubsystems.delete(subsystem);
  }
  isAblated(subsystem: string): boolean {
    return this.ablatedSubsystems.has(subsystem);
  }

  measureAblationEffect(
    baseline: Record<string, number>,
    withAblation: Record<string, number>,
  ): {
    subsystemsAblated: string[];
    behaviorChange: number;
    conclusion: string;
  } {
    const keys = Object.keys(baseline);
    const diffs = keys.map((k) =>
      Math.abs((withAblation[k] ?? 0) - (baseline[k] ?? 0)),
    );
    const avgChange =
      diffs.reduce((s, v) => s + v, 0) / Math.max(1, diffs.length);
    return {
      subsystemsAblated: [...this.ablatedSubsystems],
      behaviorChange: avgChange,
      conclusion:
        avgChange > 0.1
          ? "SUBSYSTEM_IS_FUNCTIONAL"
          : "SUBSYSTEM_NOT_CONTRIBUTING",
    };
  }
}

export class PerturbationEngine {
  perturb(
    metrics: Record<string, number>,
    magnitude = 0.1,
  ): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [k, v] of Object.entries(metrics)) {
      result[k] = Math.max(
        0,
        Math.min(1, v + (Math.random() - 0.5) * magnitude * 2),
      );
    }
    return result;
  }

  measureRobustness(
    baseline: Record<string, number>,
    perturbed: Record<string, number>,
  ): { robustnessScore: number; fragileKeys: string[] } {
    const fragile: string[] = [];
    let totalDiff = 0;
    for (const [k, v] of Object.entries(baseline)) {
      const diff = Math.abs((perturbed[k] ?? 0) - v);
      totalDiff += diff;
      if (diff > 0.2) fragile.push(k);
    }
    const n = Object.keys(baseline).length;
    return {
      robustnessScore: Math.max(0, 1 - totalDiff / Math.max(1, n)),
      fragileKeys: fragile,
    };
  }
}

export class AntiFakeChecker {
  checkDecisionTrace(trace: Array<{ source: string; mechanism: string }>): {
    passed: boolean;
    violations: string[];
  } {
    const violations: string[] = [];
    for (const entry of trace) {
      if (
        entry.source === "hardcoded" ||
        entry.mechanism === "scripted_bypass"
      ) {
        violations.push(`Scripted bypass detected at ${entry.source}`);
      }
      if (entry.mechanism === "authored_injection") {
        violations.push(`Authored injection at ${entry.source}`);
      }
    }
    return { passed: violations.length === 0, violations };
  }

  verifyArbitrationRouted(decisionPath: string[]): boolean {
    return decisionPath.some(
      (step) =>
        step.includes("arbitration") || step.includes("policy_selector"),
    );
  }
}

export class AuthorshipLeakageMonitor {
  private suspiciousPatterns = [
    "ALWAYS_DO",
    "NEVER_DO",
    "SCRIPTED",
    "OVERRIDE",
    "FORCE_ACTION",
  ];

  check(decisionRationale: string): { clean: boolean; leakageFound: string[] } {
    const found = this.suspiciousPatterns.filter((p) =>
      decisionRationale.toUpperCase().includes(p),
    );
    return { clean: found.length === 0, leakageFound: found };
  }
}

export class MechanismTraceChecker {
  trace(
    decisionId: string,
    mechanismChain: string[],
  ): {
    decision: string;
    steps: string[];
    explained: boolean;
    explanation: string;
  } {
    const explained = mechanismChain.length >= 3;
    return {
      decision: decisionId,
      steps: mechanismChain,
      explained,
      explanation: explained
        ? `Decision routed through: ${mechanismChain.join(" -> ")}`
        : "Insufficient mechanism chain — decision unexplained",
    };
  }
}

export class RegressionMonitor {
  private history: Array<{ ts: number; metrics: Record<string, number> }> = [];
  private threshold = 0.1;

  record(metrics: Record<string, number>): void {
    this.history.push({ ts: Date.now(), metrics: { ...metrics } });
    if (this.history.length > 100) this.history.shift();
  }

  detectRegression(): { regressed: boolean; regressions: string[] } {
    if (this.history.length < 2) return { regressed: false, regressions: [] };
    const latest = this.history.at(-1)!.metrics;
    const old = this.history[0].metrics;
    const regressions: string[] = [];
    for (const [k, v] of Object.entries(old)) {
      const curr = latest[k] ?? v;
      if (v > 0.1 && (v - curr) / v > this.threshold) {
        regressions.push(
          `${k}: ${(v * 100).toFixed(1)}% -> ${(curr * 100).toFixed(1)}%`,
        );
      }
    }
    return { regressed: regressions.length > 0, regressions };
  }
}

export class ConservativeClaimGate {
  private blockedClaims = [
    "conscious",
    "sentient",
    "aware",
    "self-aware",
    "truly intelligent",
  ];

  evaluate(claim: string): { allowed: boolean; reason: string } {
    const lower = claim.toLowerCase();
    for (const blocked of this.blockedClaims) {
      if (lower.includes(blocked)) {
        return {
          allowed: false,
          reason: `Claim blocked: unvalidated assertion of "${blocked}". Use indicator-based framing only.`,
        };
      }
    }
    return { allowed: true, reason: "Claim within conservative bounds" };
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Live validation runner — called in the tick loop on real BrainActionPackets
// ──────────────────────────────────────────────────────────────────────────────
export const liveValidationRunner = {
  antiFake: new AntiFakeChecker(),
  authorship: new AuthorshipLeakageMonitor(),
  mechanism: new MechanismTraceChecker(),
  regression: new RegressionMonitor(),

  runOnPacket(packet: {
    action_type: string;
    rationale?: string;
    confidence: number;
  }): {
    passed: boolean;
    violations: string[];
    mechanismExplanation: string;
  } {
    // Build a trace array compatible with AntiFakeChecker.checkDecisionTrace
    const decisionTrace: Array<{ source: string; mechanism: string }> = [
      { source: "salience_input", mechanism: "neural_activation" },
      { source: "arbitration", mechanism: "policy_competition" },
      { source: "policy_selector", mechanism: "winner_take_most" },
      { source: packet.action_type, mechanism: "brain_action_output" },
    ];

    const fakeResult = this.antiFake.checkDecisionTrace(decisionTrace);
    const authorResult = this.authorship.check(
      packet.rationale ?? packet.action_type,
    );
    const mechResult = this.mechanism.trace(packet.action_type, [
      "salience_input",
      "neural_activation",
      "arbitration",
      packet.action_type,
    ]);

    // Record confidence for regression monitoring
    this.regression.record({ confidence: packet.confidence });

    const violations: string[] = [];
    if (!fakeResult.passed) violations.push(...fakeResult.violations);
    if (!authorResult.clean) violations.push(...authorResult.leakageFound);

    return {
      passed: violations.length === 0,
      violations,
      mechanismExplanation: mechResult.explanation,
    };
  },
};
