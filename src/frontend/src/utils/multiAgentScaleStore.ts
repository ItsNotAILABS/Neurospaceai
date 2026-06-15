// ─── Multi-Agent Scale Validation Store ─────────────────────────────────────
// Shared singleton: persists the last concurrent scale test result so that
// goLiveRuntime.ts can gate on it without running the test itself.

export interface MultiAgentScaleResult {
  verdict: "NOT_RUN" | "PASS" | "WARN" | "FAIL";
  tps?: number;
  avgLatency?: number;
  maxLatency?: number;
  agentCount?: number;
  packets?: number;
  runAt?: number;
}

export const multiAgentScaleStore: MultiAgentScaleResult = {
  verdict: "NOT_RUN",
};

export function setMultiAgentScaleResult(r: MultiAgentScaleResult): void {
  Object.assign(multiAgentScaleStore, r);
  try {
    localStorage.setItem("multi_agent_scale", JSON.stringify(r));
  } catch {
    // ignore quota errors
  }
}

export function loadMultiAgentScaleResult(): void {
  try {
    const saved = localStorage.getItem("multi_agent_scale");
    if (saved) Object.assign(multiAgentScaleStore, JSON.parse(saved));
  } catch {
    // ignore
  }
}

// Auto-load on module import
loadMultiAgentScaleResult();
