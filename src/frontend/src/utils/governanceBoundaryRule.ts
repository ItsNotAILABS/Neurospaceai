// GovernanceBoundaryRule — Hard Architectural Boundary
// The governance layer MAY: bias, gate, stabilize, suppress, recruit, prioritize,
//   persist, update, regulate, allocate compute, trigger recovery, trigger escalation
// The governance layer MAY NOT: author final semantic conclusions, force predetermined
//   high-level behaviors, inject canned thought sequences, bypass competition/arbitration
//   except in explicit hard safety mode, fake emergence with hidden behavior trees
//
// Rule: governance shapes conditions, not outcomes

export type GovernanceViolationType =
  | "AUTHORED_SEMANTIC_CONCLUSION"
  | "FORCED_BEHAVIOR_SEQUENCE"
  | "CANNED_THOUGHT_INJECTION"
  | "SCRIPTED_BYPASS"
  | "FAKE_EMERGENCE";

export interface GovernanceViolation {
  type: GovernanceViolationType;
  source: string;
  description: string;
  tick: number;
  severity: "warn" | "block";
}

export interface GovernanceBoundaryState {
  violations: GovernanceViolation[];
  violationCount: number;
  lastViolationTick: number;
  isClean: boolean;
}

export class GovernanceBoundaryRule {
  private violations: GovernanceViolation[] = [];
  private currentTick = 0;

  check(action: {
    type: string;
    source: string;
    description: string;
    bypassesCompetition?: boolean;
    forcesSemanticOutput?: boolean;
    injectsCannedSequence?: boolean;
  }): { allowed: boolean; violation?: GovernanceViolation } {
    // BLOCK conditions
    if (action.forcesSemanticOutput) {
      const v: GovernanceViolation = {
        type: "AUTHORED_SEMANTIC_CONCLUSION",
        source: action.source,
        description: `Governance layer attempted to author semantic conclusion: ${action.description}`,
        tick: this.currentTick,
        severity: "block",
      };
      this.violations.push(v);
      if (this.violations.length > 200)
        this.violations = this.violations.slice(-200);
      return { allowed: false, violation: v };
    }

    if (action.injectsCannedSequence) {
      const v: GovernanceViolation = {
        type: "CANNED_THOUGHT_INJECTION",
        source: action.source,
        description: `Governance layer injected canned thought sequence: ${action.description}`,
        tick: this.currentTick,
        severity: "block",
      };
      this.violations.push(v);
      if (this.violations.length > 200)
        this.violations = this.violations.slice(-200);
      return { allowed: false, violation: v };
    }

    if (action.bypassesCompetition) {
      const v: GovernanceViolation = {
        type: "SCRIPTED_BYPASS",
        source: action.source,
        description: `Governance layer bypassed competition/arbitration: ${action.description}`,
        tick: this.currentTick,
        severity: "block",
      };
      this.violations.push(v);
      if (this.violations.length > 200)
        this.violations = this.violations.slice(-200);
      return { allowed: false, violation: v };
    }

    // WARN conditions
    const scriptedPatterns = [
      "FORCE_",
      "INJECT_",
      "SCRIPT_",
      "HARDCODE_",
      "FAKE_",
    ];
    const isScripted = scriptedPatterns.some((p) =>
      action.type.toUpperCase().startsWith(p),
    );
    if (isScripted) {
      const v: GovernanceViolation = {
        type: "FORCED_BEHAVIOR_SEQUENCE",
        source: action.source,
        description: `Possible scripted behavior pattern detected in: ${action.type} — ${action.description}`,
        tick: this.currentTick,
        severity: "warn",
      };
      this.violations.push(v);
      if (this.violations.length > 200)
        this.violations = this.violations.slice(-200);
      return { allowed: true, violation: v };
    }

    return { allowed: true };
  }

  tick(t: number): void {
    this.currentTick = t;
  }

  getState(): GovernanceBoundaryState {
    const recent = this.violations.filter(
      (v) => v.tick > this.currentTick - 100,
    );
    return {
      violations: this.violations.slice(-50),
      violationCount: this.violations.length,
      lastViolationTick:
        this.violations.length > 0
          ? this.violations[this.violations.length - 1].tick
          : -1,
      isClean: !recent.some((v) => v.severity === "block"),
    };
  }

  clearLog(): void {
    this.violations = [];
  }
}

export const governanceBoundary = new GovernanceBoundaryRule();
