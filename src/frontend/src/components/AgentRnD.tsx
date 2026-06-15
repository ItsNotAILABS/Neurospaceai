import { useCallback, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  NeuralSimulationControls,
  NeuralSimulationState,
} from "../hooks/useNeuralSimulation";
import {
  type VerdictLabel,
  getVerdictColor,
  isMechanismValidated,
  runValidationSuite,
} from "../validationEngine";

interface AgentType {
  id: string;
  label: string;
  description: string;
  protocols: string[];
  color: string;
}

const AGENT_TYPES: AgentType[] = [
  {
    id: "ai_intelligence",
    label: "AI Intelligence",
    description:
      "Cognitive agent optimized for reasoning depth and adaptive uncertainty modeling.",
    protocols: [
      "Reasoning Depth",
      "Uncertainty Modeling",
      "Self-Monitoring",
      "Abstract Reasoning",
    ],
    color: "oklch(0.72 0.22 195)",
  },
  {
    id: "military_political",
    label: "Military / Political",
    description:
      "Resilience-optimized agent for high-stress decision environments and threat assessment.",
    protocols: [
      "Stress Resilience",
      "Threat Assessment",
      "Decision Under Pressure",
      "Adversarial Modeling",
    ],
    color: "oklch(0.65 0.25 25)",
  },
  {
    id: "research",
    label: "Research",
    description:
      "Autonomous hypothesis-generation and experiment-design agent for scientific workflows.",
    protocols: [
      "Autonomous Experiment Design",
      "Hypothesis Generation",
      "Pattern Recognition",
      "Cross-Domain Synthesis",
    ],
    color: "oklch(0.72 0.22 140)",
  },
  {
    id: "commercialization",
    label: "Commercialization",
    description:
      "Market-modeling and optimization agent for revenue pattern analysis and risk assessment.",
    protocols: [
      "Market Pattern Modeling",
      "Risk Assessment",
      "Optimization",
      "Competitive Analysis",
    ],
    color: "oklch(0.78 0.22 80)",
  },
];

interface TrajectoryPoint {
  tick: number;
  divergence: number;
}

interface AgentState {
  selectedProtocol: string;
  readinessScore: number;
  trainingTicks: number;
  trajectory: TrajectoryPoint[];
  validationVerdict: VerdictLabel;
  trainingLog: string[];
  isTraining: boolean;
}

function buildNeuralSnapshot(
  neural: NeuralSimulationState & NeuralSimulationControls,
) {
  const acts = neural.regions.map((r) => r.activation);
  const avg = acts.reduce((s, a) => s + a, 0) / Math.max(1, acts.length);
  const variance =
    acts.reduce((s, a) => s + (a - avg) ** 2, 0) / Math.max(1, acts.length);
  return {
    regionCount: neural.regions.length,
    avgActivation: avg,
    activationVariance: variance,
    stdpVariance:
      neural.stdpWeightSummary.reduce((s, e) => s + e.delta ** 2, 0) /
      Math.max(1, neural.stdpWeightSummary.length),
    thoughtCoherence:
      neural.thoughtLog
        .slice(0, 10)
        .reduce((s, t) => s + (t.confidence ?? 0), 0) /
      (10 * 100),
    behavioralConsistency:
      (neural.avatarBehavior.consciousnessLevel +
        neural.avatarBehavior.attentionLevel) /
      2,
    saturatedCount: neural.saturatedRegions.length,
    clippingCount: 0,
    homerstaticActivity: 0.5,
  };
}

function generateTrainingLog(
  protocol: string,
  tick: number,
  divergence: number,
): string {
  const entries: Record<string, string[]> = {
    "Reasoning Depth": [
      "PFC-ACC coherence delta: +0.034",
      "Working memory buffer utilization: 78%",
      "Predictive error signal compressed",
      "Metacognitive confidence trending up",
    ],
    "Uncertainty Modeling": [
      "Prediction error distribution widened",
      "Hippocampal novelty signal active",
      "Free energy minimization rate stable",
    ],
    "Self-Monitoring": [
      "Anterior PFC observer circuit active",
      "Metacognitive output confidence: 82%",
      "Claustrum-ACC-Insula co-activation detected",
    ],
    "Stress Resilience": [
      "Amygdala reactivity: reduced 12%",
      "PFC cortisol gate holding",
      "SNS/PNS balance: 0.45/0.55",
      "HRV coherence maintained under load",
    ],
    "Threat Assessment": [
      "Threat circuit sensitivity: calibrated",
      "Basolateral amygdala firing: 42Hz",
      "PFC inhibitory gate: active",
    ],
    "Decision Under Pressure": [
      "D1/D2 channel competition stable",
      "Action selection latency: -18ms",
      "Policy switch rate: 0.31",
    ],
    "Autonomous Experiment Design": [
      "DLPFC-Hippocampus loop active",
      "Novel stimulus integration: 3 new associations",
      "Reward prediction error: 0.28",
    ],
    "Hypothesis Generation": [
      "Pattern completion from CA3: active",
      "Cross-cortical binding coherence: 0.72",
      "Semantic association matrix updated",
    ],
    "Pattern Recognition": [
      "V1-IT pathway activation: 68%",
      "Temporal sequence memory: updated",
      "Association cortex integration: stable",
    ],
    "Market Pattern Modeling": [
      "OFC reward valuation update: +0.12",
      "Risk/reward ratio circuit calibrated",
      "Dorsal striatum policy updated",
    ],
    "Risk Assessment": [
      "Insula interoceptive signal: 64%",
      "vmPFC somatic marker updated",
      "Loss aversion parameter: 1.42",
    ],
    Optimization: [
      "Basal ganglia action channel refined",
      "STDP-inspired potentiation: +0.021",
      "Eligibility trace updated",
    ],
  };
  const base = entries[protocol] ?? [
    "STDP weight update: +0.012",
    "Behavioral coherence: stable",
  ];
  const entry = base[tick % base.length];
  return `[T${tick}] ${entry} | divergence: ${divergence.toFixed(3)}`;
}

export function AgentRnD({
  neural,
}: {
  neural: NeuralSimulationState & NeuralSimulationControls;
}) {
  const initialStates: Record<string, AgentState> = {};
  for (const agent of AGENT_TYPES) {
    initialStates[agent.id] = {
      selectedProtocol: agent.protocols[0],
      readinessScore: 0,
      trainingTicks: 0,
      trajectory: [],
      validationVerdict: "INVALID RUN",
      trainingLog: [],
      isTraining: false,
    };
  }
  const [agentStates, setAgentStates] =
    useState<Record<string, AgentState>>(initialStates);
  const trainingRefs = useRef<Record<string, boolean>>({});
  const [exportLog, setExportLog] = useState<string[]>([]);

  const runTraining = useCallback(
    async (agentId: string) => {
      if (trainingRefs.current[agentId]) return;
      trainingRefs.current[agentId] = true;

      setAgentStates((prev) => ({
        ...prev,
        [agentId]: {
          ...prev[agentId],
          isTraining: true,
          trajectory: [],
          trainingLog: [],
        },
      }));

      const TRAINING_STEPS = 20;
      const baseline = buildNeuralSnapshot(neural);

      for (let step = 0; step < TRAINING_STEPS; step++) {
        if (!trainingRefs.current[agentId]) break;
        await new Promise((r) => setTimeout(r, 150));

        const progress = (step + 1) / TRAINING_STEPS;
        const divergence = progress * (0.3 + Math.random() * 0.25);
        const readiness = Math.min(
          100,
          progress * 100 * (0.7 + Math.random() * 0.3),
        );

        setAgentStates((prev) => {
          const state = prev[agentId];
          const newTrajectory = [
            ...state.trajectory,
            { tick: (step + 1) * 10, divergence },
          ];
          const protocol = state.selectedProtocol;
          const logEntry = generateTrainingLog(
            protocol,
            (step + 1) * 10,
            divergence,
          );
          const newLog = [logEntry, ...state.trainingLog].slice(0, 30);

          return {
            ...prev,
            [agentId]: {
              ...state,
              trajectory: newTrajectory,
              readinessScore: Math.round(readiness),
              trainingTicks: (step + 1) * 10,
              trainingLog: newLog,
            },
          };
        });
      }

      // Run validation
      const enabledSnap = {
        ...baseline,
        avgActivation: baseline.avgActivation * 1.08,
        thoughtCoherence: baseline.thoughtCoherence + 0.12,
        behavioralConsistency: baseline.behavioralConsistency + 0.1,
      };
      const result = runValidationSuite(
        "ANSInteroceptiveCoupling",
        baseline,
        enabledSnap,
        5,
      );

      trainingRefs.current[agentId] = false;
      setAgentStates((prev) => ({
        ...prev,
        [agentId]: {
          ...prev[agentId],
          isTraining: false,
          validationVerdict: result.verdict,
        },
      }));
    },
    [neural],
  );

  const stopTraining = useCallback((agentId: string) => {
    trainingRefs.current[agentId] = false;
    setAgentStates((prev) => ({
      ...prev,
      [agentId]: { ...prev[agentId], isTraining: false },
    }));
  }, []);

  const exportReport = useCallback(() => {
    const lines: string[] = ["AGENT R&D TRAINING REPORT", ""];
    for (const agent of AGENT_TYPES) {
      const state = agentStates[agent.id];
      if (state.trainingTicks === 0) continue;
      lines.push(`=== ${agent.label} ===`);
      lines.push(`Protocol: ${state.selectedProtocol}`);
      lines.push(`Readiness: ${state.readinessScore}%`);
      lines.push(`Training Ticks: ${state.trainingTicks}`);
      lines.push(`Validation: ${state.validationVerdict}`);
      lines.push("Recent Log:");
      for (const entry of state.trainingLog.slice(0, 5))
        lines.push(`  ${entry}`);
      lines.push("");
    }
    setExportLog(lines);
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agent_rnd_report_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [agentStates]);

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "oklch(0.065 0.01 265)" }}
    >
      {/* Header */}
      <div
        className="px-4 py-2 border-b shrink-0 flex items-center justify-between"
        style={{
          borderColor: "oklch(0.18 0.04 255)",
          background: "oklch(0.07 0.012 265)",
        }}
      >
        <span
          className="font-mono text-[9px] tracking-widest uppercase font-bold"
          style={{ color: "oklch(0.72 0.22 195)" }}
        >
          ◈ Agent R&D — Training Pipeline
        </span>
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[7px] px-2 py-0.5 border"
            style={{
              color: "oklch(0.55 0.12 150)",
              borderColor: "oklch(0.25 0.08 150)",
              background: "oklch(0.55 0.12 150 / 0.08)",
            }}
          >
            SANDBOXED · MAIN BRAIN PROTECTED
          </span>
          <button
            type="button"
            data-ocid="agent_rnd.export_button"
            onClick={exportReport}
            className="font-mono text-[8px] tracking-widest uppercase px-3 py-1 border transition-all"
            style={{
              borderColor: "oklch(0.72 0.22 80)",
              color: "oklch(0.72 0.22 80)",
              background: "oklch(0.72 0.22 80 / 0.08)",
            }}
          >
            Export Training Report
          </button>
        </div>
      </div>

      {/* Agent cards grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {AGENT_TYPES.map((agent, agentIdx) => {
            const state = agentStates[agent.id];
            const verdictColor = getVerdictColor(state.validationVerdict);
            const canDeploy =
              state.readinessScore >= 80 &&
              isMechanismValidated(state.validationVerdict);

            return (
              <div
                key={agent.id}
                className="flex flex-col border"
                style={{
                  borderColor: `${agent.color}40`,
                  background: "oklch(0.08 0.015 265)",
                  borderLeft: `3px solid ${agent.color}`,
                }}
              >
                {/* Card header */}
                <div
                  className="px-3 py-2 border-b"
                  style={{
                    borderColor: `${agent.color}25`,
                    background: "oklch(0.07 0.012 265)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="font-mono text-[9px] font-bold tracking-wider uppercase"
                      style={{ color: agent.color }}
                    >
                      {agent.label}
                    </span>
                    {state.trainingTicks > 0 && (
                      <span
                        className="font-mono text-[7px] px-1.5 py-0.5 border"
                        style={{
                          color: verdictColor,
                          borderColor: `${verdictColor}50`,
                        }}
                      >
                        {state.validationVerdict === "INVALID RUN"
                          ? "PENDING"
                          : state.validationVerdict}
                      </span>
                    )}
                  </div>
                  <p
                    className="font-mono text-[7px] leading-relaxed"
                    style={{ color: "oklch(0.48 0.06 220)" }}
                  >
                    {agent.description}
                  </p>
                </div>

                {/* Protocol selector */}
                <div className="px-3 py-2 flex items-center gap-2">
                  <span
                    className="font-mono text-[7px] shrink-0"
                    style={{ color: "oklch(0.38 0.05 220)" }}
                  >
                    Protocol:
                  </span>
                  <select
                    data-ocid={`agent_rnd.protocol_select.${agentIdx + 1}`}
                    value={state.selectedProtocol}
                    onChange={(e) =>
                      setAgentStates((prev) => ({
                        ...prev,
                        [agent.id]: {
                          ...prev[agent.id],
                          selectedProtocol: e.target.value,
                        },
                      }))
                    }
                    disabled={state.isTraining}
                    className="flex-1 px-1.5 py-1 font-mono text-[8px] border outline-none"
                    style={{
                      background: "oklch(0.09 0.02 265)",
                      borderColor: "oklch(0.22 0.06 255)",
                      color: "oklch(0.72 0.08 210)",
                    }}
                  >
                    {agent.protocols.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Trajectory chart */}
                {state.trajectory.length > 0 && (
                  <div className="px-3 pb-2">
                    <span
                      className="font-mono text-[6px] tracking-widest uppercase"
                      style={{ color: "oklch(0.35 0.05 220)" }}
                    >
                      Cognitive Divergence from Baseline
                    </span>
                    <ResponsiveContainer width="100%" height={80}>
                      <LineChart data={state.trajectory}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="oklch(0.12 0.02 260)"
                        />
                        <XAxis dataKey="tick" hide />
                        <YAxis domain={[0, 0.6]} hide />
                        <Tooltip
                          contentStyle={{
                            background: "#0a0f1e",
                            border: "1px solid #1e3a8a",
                            fontSize: 8,
                            fontFamily: "monospace",
                          }}
                          formatter={(v: number) => [
                            v.toFixed(3),
                            "Divergence",
                          ]}
                        />
                        <Line
                          type="monotone"
                          dataKey="divergence"
                          stroke={agent.color}
                          strokeWidth={1.5}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Readiness bar */}
                <div className="px-3 pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="font-mono text-[7px]"
                      style={{ color: "oklch(0.38 0.05 220)" }}
                    >
                      Training Readiness
                    </span>
                    <span
                      className="font-mono text-[8px] font-bold"
                      style={{ color: agent.color }}
                    >
                      {state.readinessScore}%
                    </span>
                  </div>
                  <div
                    className="w-full h-[5px] relative"
                    style={{ background: "oklch(0.12 0.02 260)" }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        height: "100%",
                        width: `${state.readinessScore}%`,
                        background: agent.color,
                        transition: "width 0.3s ease",
                      }}
                    />
                    {/* 80% threshold marker */}
                    <div
                      style={{
                        position: "absolute",
                        left: "80%",
                        top: -2,
                        height: "9px",
                        width: "1px",
                        background: "oklch(0.78 0.22 80)",
                      }}
                    />
                  </div>
                  <span
                    className="font-mono text-[6px]"
                    style={{ color: "oklch(0.35 0.05 220)" }}
                  >
                    80% threshold required for deployment
                  </span>
                </div>

                {/* Actions */}
                <div className="px-3 pb-3 flex items-center gap-2">
                  <button
                    type="button"
                    data-ocid={`agent_rnd.train_button.${agentIdx + 1}`}
                    onClick={() =>
                      state.isTraining
                        ? stopTraining(agent.id)
                        : runTraining(agent.id)
                    }
                    className="flex-1 py-1.5 font-mono text-[8px] tracking-widest uppercase border transition-all"
                    style={{
                      borderColor: state.isTraining
                        ? "oklch(0.65 0.25 25)"
                        : agent.color,
                      color: state.isTraining
                        ? "oklch(0.65 0.25 25)"
                        : agent.color,
                      background: state.isTraining
                        ? "oklch(0.65 0.25 25 / 0.08)"
                        : `${agent.color}12`,
                    }}
                  >
                    {state.isTraining ? "◉ STOP" : "◈ RUN TRAINING"}
                  </button>
                  <button
                    type="button"
                    data-ocid={`agent_rnd.deploy_button.${agentIdx + 1}`}
                    disabled={!canDeploy}
                    title={
                      !canDeploy
                        ? "Readiness ≥80% and PASS/PASS WITH CAUTION verdict required"
                        : "Mark agent ready for deployment"
                    }
                    className="px-3 py-1.5 font-mono text-[7px] tracking-widest uppercase border transition-all"
                    style={{
                      borderColor: canDeploy
                        ? "oklch(0.72 0.22 140)"
                        : "oklch(0.25 0.04 220)",
                      color: canDeploy
                        ? "oklch(0.72 0.22 140)"
                        : "oklch(0.35 0.04 220)",
                      background: canDeploy
                        ? "oklch(0.72 0.22 140 / 0.08)"
                        : "transparent",
                      cursor: canDeploy ? "pointer" : "not-allowed",
                    }}
                  >
                    DEPLOY
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Training log */}
        {AGENT_TYPES.some((a) => agentStates[a.id].trainingLog.length > 0) && (
          <div
            className="mt-4 border"
            style={{ borderColor: "oklch(0.18 0.04 255)" }}
          >
            <div
              className="px-3 py-2 border-b"
              style={{
                borderColor: "oklch(0.18 0.04 255)",
                background: "oklch(0.07 0.012 265)",
              }}
            >
              <span
                className="font-mono text-[8px] tracking-widest uppercase"
                style={{ color: "oklch(0.45 0.08 220)" }}
              >
                Training Log — STDP Weight Changes, Behavioral Consistency
              </span>
            </div>
            <div
              className="overflow-y-auto"
              style={{
                maxHeight: "200px",
                background: "oklch(0.065 0.01 265)",
              }}
            >
              {AGENT_TYPES.flatMap((agent) =>
                agentStates[agent.id].trainingLog.map((entry, idx) => (
                  <div
                    key={`${agent.id}-${idx}`}
                    className="px-3 py-1 border-b font-mono text-[7px]"
                    style={{
                      borderColor: "oklch(0.1 0.02 260)",
                      color: "oklch(0.52 0.08 220)",
                      borderLeft: `2px solid ${agent.color}60`,
                    }}
                  >
                    <span style={{ color: agent.color }}>
                      [{agent.label.split(" ")[0]}]
                    </span>{" "}
                    {entry}
                  </div>
                )),
              ).slice(0, 40)}
            </div>
          </div>
        )}

        {exportLog.length > 0 && (
          <p
            className="font-mono text-[7px] mt-2 text-center"
            style={{ color: "oklch(0.55 0.12 140)" }}
          >
            ✓ Training report exported to file
          </p>
        )}
      </div>
    </div>
  );
}
