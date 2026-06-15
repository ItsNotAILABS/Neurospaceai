import { useState } from "react";
import type {
  LayerBIdentity,
  NeuralSimulationState,
} from "../hooks/useNeuralSimulation";

type DeploymentMode =
  | "intelligence"
  | "military"
  | "research"
  | "commercialization";

interface AgentProfile {
  id: string;
  name: string;
  createdAt: number;
  tick: number;
  globalArousal: number;
  dominantNT: string;
  topRegions: Array<{ region: string; activation: number }>;
  stdpSnapshot: Array<{ connection: string; weight: number; delta: number }>;
  ntState: {
    dopamine: number;
    serotonin: number;
    norepinephrine: number;
    gaba: number;
    glutamate: number;
    acetylcholine: number;
  };
  deploymentMode: DeploymentMode;
  identityTraits: LayerBIdentity;
  divergenceScore: number;
  continuousLearning: boolean;
  isLocked: boolean;
}

const MODE_CONFIGS: Record<
  DeploymentMode,
  {
    label: string;
    desc: string;
    color: string;
    traits: Partial<LayerBIdentity>;
  }
> = {
  intelligence: {
    label: "AI Intelligence Agent",
    desc: "High analytical capacity, broad memory recall, salience-driven reasoning. General-purpose AI reasoning system.",
    color: "oklch(0.72 0.22 195)",
    traits: {
      discipline: 0.9,
      cooperativeness: 0.8,
      impulsivity: 0.1,
      skepticism: 0.4,
    },
  },
  military: {
    label: "Military / Political Agent",
    desc: "High threat vigilance, rapid decision latency, disciplined under pressure. Strategic analysis and threat modeling.",
    color: "oklch(0.68 0.28 25)",
    traits: {
      aggression: 0.7,
      discipline: 0.9,
      skepticism: 0.8,
      cautiousness: 0.6,
    },
  },
  research: {
    label: "Research Agent",
    desc: "Clean baseline bias, high memory consolidation, maximum plasticity. Autonomous experiment protocol execution.",
    color: "oklch(0.78 0.26 140)",
    traits: {
      discipline: 0.8,
      resilience: 0.7,
      impulsivity: 0.2,
      cooperativeness: 0.6,
    },
  },
  commercialization: {
    label: "Commercialization Agent",
    desc: "Meta-agent that commercially monetizes across all deployed agents. High reward sensitivity, cooperative network awareness.",
    color: "oklch(0.82 0.22 80)",
    traits: {
      cooperativeness: 0.9,
      resilience: 0.8,
      aggression: 0.3,
      skepticism: 0.3,
    },
  },
};

const TRAIT_LABELS: Record<keyof LayerBIdentity, string> = {
  cautiousness: "Cautiousness",
  aggression: "Aggression",
  discipline: "Discipline",
  impulsivity: "Impulsivity",
  fatigue: "Fatigue",
  resilience: "Resilience",
  cooperativeness: "Cooperativeness",
  skepticism: "Skepticism",
};

const TRAIT_COLORS: Record<keyof LayerBIdentity, string> = {
  cautiousness: "oklch(0.72 0.22 220)",
  aggression: "oklch(0.68 0.28 25)",
  discipline: "oklch(0.78 0.24 195)",
  impulsivity: "oklch(0.75 0.26 55)",
  fatigue: "oklch(0.55 0.15 260)",
  resilience: "oklch(0.75 0.22 140)",
  cooperativeness: "oklch(0.72 0.22 310)",
  skepticism: "oklch(0.72 0.2 80)",
};

function TraitBar({
  trait,
  value,
}: { trait: keyof LayerBIdentity; value: number }) {
  const color = TRAIT_COLORS[trait];
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2">
      <span
        className="font-mono text-[8px] tracking-wider shrink-0"
        style={{ color: "oklch(0.45 0.06 220)", width: "88px" }}
      >
        {TRAIT_LABELS[trait]}
      </span>
      <div
        className="flex-1 h-[4px]"
        style={{ background: "oklch(0.12 0.02 260)" }}
      >
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: color,
            boxShadow: value > 0.6 ? `0 0 4px ${color}` : "none",
          }}
        />
      </div>
      <span
        className="font-mono text-[8px] shrink-0"
        style={{ color, width: "26px", textAlign: "right" }}
      >
        {pct}%
      </span>
    </div>
  );
}

export function UniversalBrainAgent({
  neural,
  onClose,
}: {
  neural: NeuralSimulationState;
  onClose: () => void;
}) {
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [selectedMode, setSelectedMode] =
    useState<DeploymentMode>("intelligence");
  const [baselineLocked, setBaselineLocked] = useState(false);
  const [lockedTick, setLockedTick] = useState<number | null>(null);

  const topRegions = [...neural.regions]
    .sort((a, b) => b.activation - a.activation)
    .slice(0, 8)
    .map((r) => ({ region: r.region as string, activation: r.activation }));

  function exportProfile(): AgentProfile {
    return {
      id: `agent_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: `${MODE_CONFIGS[selectedMode].label} #${agents.length + 1}`,
      createdAt: Date.now(),
      tick: neural.tick,
      globalArousal: neural.globalArousal,
      dominantNT: neural.avatarBehavior.dominantNT,
      topRegions,
      stdpSnapshot: neural.stdpWeightSummary.slice(0, 10),
      ntState: { ...neural.neurotransmitters },
      deploymentMode: selectedMode,
      identityTraits: { ...neural.layerB },
      divergenceScore: 0,
      continuousLearning: true,
      isLocked: baselineLocked,
    };
  }

  function cloneAgent() {
    setAgents((prev) => [...prev, exportProfile()]);
  }

  function lockBaseline() {
    setBaselineLocked(true);
    setLockedTick(neural.tick);
  }

  function downloadExport(agent: AgentProfile) {
    const json = JSON.stringify(agent, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${agent.name.replace(/\s+/g, "_")}_T${agent.tick}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const config = MODE_CONFIGS[selectedMode];

  return (
    <div
      data-ocid="agent.modal"
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "oklch(0 0 0 / 0.75)" }}
    >
      <div
        className="flex flex-col overflow-hidden"
        style={{
          width: "min(820px, 97vw)",
          maxHeight: "92vh",
          background: "oklch(0.065 0.01 265)",
          border: `1px solid ${config.color}44`,
          boxShadow: `0 0 50px ${config.color}18`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 shrink-0 border-b"
          style={{ borderColor: "oklch(0.18 0.05 250)" }}
        >
          <div>
            <h2
              className="font-mono font-bold text-sm tracking-widest uppercase"
              style={{ color: "oklch(0.85 0.05 210)" }}
            >
              ◈ Universal Brain Agent
            </h2>
            <p
              className="font-mono text-[9px] tracking-widest mt-0.5"
              style={{ color: "oklch(0.38 0.06 220)" }}
            >
              Modular Cognitive OS · Export · Deploy · Continuous Learning
            </p>
          </div>
          <button
            type="button"
            data-ocid="agent.close_button"
            onClick={onClose}
            className="font-mono text-xs px-3 py-1 border transition-colors"
            style={{
              color: "oklch(0.5 0.08 220)",
              borderColor: "oklch(0.22 0.05 250)",
            }}
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-0">
          {/* Brain State + Maturity */}
          <div
            className="p-4 border"
            style={{
              background: "oklch(0.065 0.01 265)",
              borderColor: "oklch(0.18 0.05 255)",
            }}
          >
            <div
              className="font-mono text-[9px] tracking-widest uppercase mb-3"
              style={{ color: "oklch(0.38 0.06 220)" }}
            >
              Current Brain State · T{neural.tick}
            </div>
            <div className="grid grid-cols-4 gap-3 mb-3">
              {[
                {
                  label: "MATURITY",
                  value: `${neural.maturityScore ?? 0}%`,
                  color: "oklch(0.75 0.22 140)",
                },
                {
                  label: "AROUSAL",
                  value: `${Math.round(neural.globalArousal * 100)}%`,
                  color: "oklch(0.72 0.22 195)",
                },
                {
                  label: "CONSOLIDATIONS",
                  value: `${neural.consolidationCount ?? 0}`,
                  color: "oklch(0.78 0.22 80)",
                },
                {
                  label: "BEHAVIOR",
                  value: neural.layerD?.dominant?.replace("_", " ") ?? "—",
                  color: "oklch(0.72 0.22 310)",
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <span
                    className="font-mono text-[7px] tracking-widest uppercase"
                    style={{ color: "oklch(0.35 0.05 220)" }}
                  >
                    {label}
                  </span>
                  <span
                    className="font-mono text-[10px] font-bold"
                    style={{ color }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
            {/* Maturity bar */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span
                  className="font-mono text-[7px] tracking-widest uppercase"
                  style={{ color: "oklch(0.35 0.05 220)" }}
                >
                  Brain Maturity Progress
                </span>
                <span
                  className="font-mono text-[8px]"
                  style={{ color: "oklch(0.5 0.12 140)" }}
                >
                  {(neural.maturityScore ?? 0) < 40
                    ? "DEVELOPING"
                    : (neural.maturityScore ?? 0) < 70
                      ? "MATURING"
                      : (neural.maturityScore ?? 0) < 90
                        ? "NEAR-MATURE"
                        : "MATURE"}
                </span>
              </div>
              <div
                className="w-full h-2 relative"
                style={{ background: "oklch(0.12 0.02 260)" }}
              >
                <div
                  className="absolute h-full left-0 transition-all duration-500"
                  style={{
                    width: `${neural.maturityScore ?? 0}%`,
                    background:
                      (neural.maturityScore ?? 0) > 70
                        ? "oklch(0.75 0.22 140)"
                        : "oklch(0.68 0.22 80)",
                    boxShadow:
                      (neural.maturityScore ?? 0) > 70
                        ? "0 0 8px oklch(0.75 0.22 140 / 0.5)"
                        : "none",
                  }}
                />
              </div>
            </div>
            {baselineLocked && lockedTick !== null && (
              <div
                className="font-mono text-[8px] tracking-widest px-2 py-1 mt-2"
                style={{
                  color: "oklch(0.78 0.24 80)",
                  background: "oklch(0.78 0.24 80 / 0.08)",
                  border: "1px solid oklch(0.78 0.24 80 / 0.3)",
                }}
              >
                ◈ BASELINE LOCKED at T{lockedTick} — agents exported from this
                state
              </div>
            )}
          </div>

          {/* Identity Traits (Layer B) */}
          <div
            data-ocid="layer_b.panel"
            className="p-4 border"
            style={{
              background: "oklch(0.065 0.01 265)",
              borderColor: "oklch(0.18 0.05 255)",
            }}
          >
            <div
              className="font-mono text-[9px] tracking-widest uppercase mb-3"
              style={{ color: "oklch(0.38 0.06 220)" }}
            >
              Layer B — Identity Model · Neuromodulator-Driven Personality
            </div>
            <div className="grid grid-cols-1 gap-[5px]">
              {neural.layerB &&
                (Object.keys(TRAIT_LABELS) as (keyof LayerBIdentity)[]).map(
                  (trait) => (
                    <TraitBar
                      key={trait}
                      trait={trait}
                      value={neural.layerB[trait] ?? 0}
                    />
                  ),
                )}
            </div>
          </div>

          {/* Deployment mode selector */}
          <div>
            <div
              className="font-mono text-[9px] tracking-widest uppercase mb-2"
              style={{ color: "oklch(0.38 0.06 220)" }}
            >
              Deployment Mode — Each Agent Acts as an Individual
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(MODE_CONFIGS) as DeploymentMode[]).map((mode) => {
                const { label, desc, color } = MODE_CONFIGS[mode];
                const active = selectedMode === mode;
                const ocidMap: Record<DeploymentMode, string> = {
                  intelligence: "agent.intelligence_tab",
                  military: "agent.military_tab",
                  research: "agent.research_tab",
                  commercialization: "agent.commercialization_tab",
                };
                return (
                  <button
                    key={mode}
                    type="button"
                    data-ocid={ocidMap[mode]}
                    onClick={() => setSelectedMode(mode)}
                    className="p-3 border text-left transition-all"
                    style={{
                      borderColor: active ? color : "oklch(0.18 0.05 255)",
                      background: active
                        ? `oklch(from ${color} l c h / 0.07)`
                        : "oklch(0.065 0.01 265)",
                    }}
                  >
                    <div
                      className="font-mono text-[9px] font-bold uppercase tracking-widest mb-1 flex items-center gap-2"
                      style={{ color: active ? color : "oklch(0.45 0.07 220)" }}
                    >
                      <span
                        className="inline-block w-2 h-2 shrink-0"
                        style={{
                          background: color,
                          boxShadow: active ? `0 0 6px ${color}` : "none",
                        }}
                      />
                      {label}
                    </div>
                    <div
                      className="font-mono text-[7px] leading-relaxed"
                      style={{ color: "oklch(0.35 0.05 220)" }}
                    >
                      {desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Continuous learning note */}
          <div
            className="px-3 py-2 border font-mono text-[8px] tracking-widest"
            style={{
              borderColor: "oklch(0.72 0.22 195 / 0.3)",
              color: "oklch(0.6 0.15 195)",
              background: "oklch(0.072 0.015 265)",
            }}
          >
            ⟳ All agents continue adaptive learning post-export — each diverges
            independently from the baseline over time. The exported state is the
            starting point, not a cage.
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              data-ocid="agent.lock_baseline.button"
              onClick={lockBaseline}
              disabled={baselineLocked}
              className="flex-1 py-2 px-4 border font-mono text-[10px] tracking-widest uppercase transition-all"
              style={{
                borderColor: baselineLocked
                  ? "oklch(0.3 0.05 220)"
                  : "oklch(0.78 0.24 80)",
                color: baselineLocked
                  ? "oklch(0.3 0.05 220)"
                  : "oklch(0.78 0.24 80)",
                background: baselineLocked
                  ? "transparent"
                  : "oklch(0.78 0.24 80 / 0.08)",
                cursor: baselineLocked ? "not-allowed" : "pointer",
              }}
            >
              {baselineLocked ? "✓ Baseline Locked" : "Lock Baseline State"}
            </button>
            <button
              type="button"
              data-ocid="agent.clone.button"
              onClick={cloneAgent}
              className="flex-1 py-2 px-4 border font-mono text-[10px] tracking-widest uppercase transition-all"
              style={{
                borderColor: config.color,
                color: config.color,
                background: `${config.color}12`,
              }}
            >
              Deploy {MODE_CONFIGS[selectedMode].label.split(" ")[0]} Agent (
              {agents.length})
            </button>
          </div>

          {/* Deployed agents list */}
          {agents.length > 0 && (
            <div>
              <div
                className="font-mono text-[9px] tracking-widest uppercase mb-2"
                style={{ color: "oklch(0.38 0.06 220)" }}
              >
                Deployed Agents ({agents.length}) — Each Acts Independently
              </div>
              <div className="flex flex-col gap-1">
                {agents.map((agent, i) => {
                  const mColor = MODE_CONFIGS[agent.deploymentMode].color;
                  return (
                    <div
                      key={agent.id}
                      data-ocid={`agent.item.${i + 1}`}
                      className="flex items-center justify-between px-3 py-2 border"
                      style={{
                        borderColor: `${mColor}44`,
                        background: "oklch(0.065 0.01 265)",
                      }}
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-mono text-[8px] font-bold"
                            style={{ color: mColor }}
                          >
                            [{MODE_CONFIGS[agent.deploymentMode].label}]
                          </span>
                          <span
                            className="font-mono text-[9px] font-bold"
                            style={{ color: "oklch(0.75 0.2 195)" }}
                          >
                            {agent.name}
                          </span>
                        </div>
                        <span
                          className="font-mono text-[7px]"
                          style={{ color: "oklch(0.35 0.05 220)" }}
                        >
                          T{agent.tick} · Maturity {neural.maturityScore ?? 0}%
                          · Divergence {agent.divergenceScore.toFixed(2)} ·
                          Learning: Active
                        </span>
                      </div>
                      <button
                        type="button"
                        data-ocid={`agent.export_button.${i + 1}`}
                        onClick={() => downloadExport(agent)}
                        className="font-mono text-[8px] px-2 py-1 border transition-colors"
                        style={{ borderColor: mColor, color: mColor }}
                      >
                        Export JSON
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
