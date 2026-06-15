import { useState } from "react";
import type {
  NeuralSimulationControls,
  NeuralSimulationState,
} from "../hooks/useNeuralSimulation";
import {
  type FeatureClass,
  classifyFeature,
  getFeatureRegistry,
  promoteToCore,
} from "../utils/featureClassification";

interface DevelopmentLabProps {
  neural: NeuralSimulationState;
  controls: NeuralSimulationControls;
}

// ─── Pipeline Stage ───────────────────────────────────────────────────────────

interface PipelineStage {
  id: number;
  label: string;
  description: string;
}

const PIPELINE_STAGES: PipelineStage[] = [
  { id: 1, label: "Pre-Maturation", description: "Stimulus protocols active" },
  {
    id: 2,
    label: "Maturation Tracking",
    description: "STDP variance & entropy stability",
  },
  { id: 3, label: "Validation Gate", description: "Batch runs complete" },
  { id: 4, label: "Baseline Lock", description: "Mature state locked" },
  { id: 5, label: "Agent Ready", description: "Deployment readiness" },
];

// ─── Protocols ────────────────────────────────────────────────────────────────

interface Protocol {
  id: string;
  name: string;
  targetRegions: string[];
  estimatedTicks: number;
  rationale: string;
}

const PROTOCOLS: Protocol[] = [
  {
    id: "complexity_escalation",
    name: "Complexity Escalation",
    targetRegions: [
      "PrefrontalCortex",
      "Thalamus",
      "BasalGanglia",
      "Hippocampus",
    ],
    estimatedTicks: 500,
    rationale:
      "Gradually increases stimulation complexity to drive STDP weight divergence and prevent premature convergence.",
  },
  {
    id: "reward_threat_cycling",
    name: "Reward-Threat Cycling",
    targetRegions: [
      "NucleusAccumbens",
      "Amygdala",
      "PrefrontalCortex",
      "VentralTegmentalArea",
    ],
    estimatedTicks: 400,
    rationale:
      "Alternates reward and threat stimuli to establish amygdala-PFC balance and dopaminergic reward gating.",
  },
  {
    id: "memory_consolidation",
    name: "Memory Consolidation Sequence",
    targetRegions: [
      "Hippocampus",
      "EntorhinalCortex",
      "CA1",
      "CA3",
      "DentateGyrus",
    ],
    estimatedTicks: 600,
    rationale:
      "Hippocampal + entorhinal stimulation cycles to establish spatial memory and declarative consolidation.",
  },
  {
    id: "executive_load",
    name: "Executive Load Protocol",
    targetRegions: [
      "PrefrontalCortex",
      "Thalamus",
      "BasalGanglia",
      "AnteriorCingulateCortex",
    ],
    estimatedTicks: 450,
    rationale:
      "Sustained PFC-thalamo-striatal activation to develop executive control circuits and working memory.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-mono text-[9px] tracking-widest uppercase mb-2 pb-1 border-b"
      style={{
        color: "oklch(0.55 0.14 195)",
        borderColor: "oklch(0.2 0.04 255)",
        letterSpacing: "0.12em",
      }}
    >
      ▸ {children}
    </div>
  );
}

function StatusBadge({ pass, label }: { pass: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="font-mono text-[8px] font-bold px-1.5 py-0.5 rounded"
        style={{
          background: pass ? "oklch(0.2 0.1 150)" : "oklch(0.2 0.1 25)",
          color: pass ? "oklch(0.82 0.2 150)" : "oklch(0.82 0.18 25)",
          border: `1px solid ${pass ? "oklch(0.4 0.16 150)" : "oklch(0.4 0.16 25)"}`,
        }}
      >
        {pass ? "PASS" : "FAIL"}
      </span>
      <span
        className="font-mono text-[9px]"
        style={{ color: "oklch(0.55 0.08 220)" }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

// ─── Feature Classification Panel ────────────────────────────────────────────
function FeatureClassificationPanel() {
  const [registry, setRegistry] = useState(() => getFeatureRegistry());

  const handleClassify = (id: string, cls: FeatureClass) => {
    classifyFeature(id, cls);
    setRegistry([...getFeatureRegistry()]);
  };

  const handlePromote = (id: string) => {
    promoteToCore(id);
    setRegistry([...getFeatureRegistry()]);
  };

  const classColors: Record<FeatureClass, { bg: string; text: string }> = {
    "core-worthy": { bg: "oklch(0.18 0.08 255)", text: "oklch(0.72 0.22 195)" },
    "wrapper-only": {
      bg: "oklch(0.16 0.04 240)",
      text: "oklch(0.55 0.08 220)",
    },
    experimental: { bg: "oklch(0.18 0.08 65)", text: "oklch(0.78 0.22 65)" },
  };

  return (
    <section
      className="rounded border p-4"
      style={{
        background: "oklch(0.075 0.012 265)",
        borderColor: "oklch(0.2 0.05 255)",
      }}
      data-ocid="devlab.feature_registry.panel"
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="font-mono text-[9px] tracking-widest uppercase font-bold"
          style={{ color: "oklch(0.72 0.22 195)" }}
        >
          ⬡ Core Brain — Feature Classification Registry
        </span>
        <span
          className="font-mono text-[7px] ml-auto"
          style={{ color: "oklch(0.35 0.05 220)" }}
        >
          Phase 7 Governance
        </span>
      </div>
      <div
        className="font-mono text-[7px] mb-3 leading-relaxed"
        style={{ color: "oklch(0.45 0.07 220)" }}
      >
        Every Core Brain feature is classified. Only core-worthy features that
        improve multiple instances, reduce complexity, and pass benchmarks are
        promoted.
      </div>

      {/* Table */}
      <div
        className="rounded border overflow-hidden"
        style={{ borderColor: "oklch(0.18 0.04 255)" }}
      >
        {/* Header */}
        <div
          className="grid font-mono text-[7px] tracking-widest uppercase px-3 py-1.5"
          style={{
            gridTemplateColumns: "minmax(120px,2fr) 100px 1fr 60px 80px",
            background: "oklch(0.09 0.015 265)",
            color: "oklch(0.38 0.05 220)",
            borderBottom: "1px solid oklch(0.16 0.04 255)",
            gap: "8px",
          }}
        >
          <span>Feature</span>
          <span>Classification</span>
          <span>Instances Improved</span>
          <span>Benchmark</span>
          <span>Promoted</span>
        </div>

        {/* Rows */}
        {registry.map((feat) => {
          const clsStyle = classColors[feat.classification];
          return (
            <div
              key={feat.id}
              data-ocid="devlab.feature.row"
              className="grid px-3 py-2 border-b items-center"
              style={{
                gridTemplateColumns: "minmax(120px,2fr) 100px 1fr 60px 80px",
                borderColor: "oklch(0.13 0.03 255)",
                gap: "8px",
              }}
            >
              {/* Name + description */}
              <div>
                <div
                  className="font-mono text-[8px] font-bold"
                  style={{ color: "oklch(0.72 0.14 220)" }}
                >
                  {feat.name}
                </div>
                <div
                  className="font-mono text-[6px] leading-tight mt-0.5"
                  style={{ color: "oklch(0.38 0.05 220)" }}
                >
                  {feat.description}
                </div>
              </div>

              {/* Classification badge */}
              <div>
                <span
                  className="font-mono text-[6px] tracking-wider uppercase px-1.5 py-0.5 rounded"
                  style={{
                    background: clsStyle.bg,
                    color: clsStyle.text,
                  }}
                >
                  {feat.classification}
                </span>
                {/* Quick reclassify buttons */}
                <div className="flex gap-1 mt-1">
                  {feat.classification !== "core-worthy" && (
                    <button
                      type="button"
                      onClick={() => handleClassify(feat.id, "core-worthy")}
                      className="font-mono text-[5px] px-1 py-0.5 rounded cursor-pointer"
                      style={{
                        background: "oklch(0.14 0.06 255)",
                        color: "oklch(0.55 0.12 195)",
                      }}
                    >
                      core
                    </button>
                  )}
                  {feat.classification !== "experimental" && (
                    <button
                      type="button"
                      onClick={() => handleClassify(feat.id, "experimental")}
                      className="font-mono text-[5px] px-1 py-0.5 rounded cursor-pointer"
                      style={{
                        background: "oklch(0.14 0.05 65)",
                        color: "oklch(0.65 0.18 65)",
                      }}
                    >
                      exp
                    </button>
                  )}
                </div>
              </div>

              {/* Instances improved */}
              <div className="flex flex-wrap gap-0.5">
                {feat.instancesImproved.length > 0 ? (
                  feat.instancesImproved.map((inst) => (
                    <span
                      key={inst}
                      className="font-mono text-[5px] px-1 py-0.5 rounded"
                      style={{
                        background: "oklch(0.12 0.04 255)",
                        color: "oklch(0.48 0.08 220)",
                      }}
                    >
                      {inst}
                    </span>
                  ))
                ) : (
                  <span
                    className="font-mono text-[6px]"
                    style={{ color: "oklch(0.28 0.04 220)" }}
                  >
                    none yet
                  </span>
                )}
              </div>

              {/* Benchmark */}
              <div>
                <span
                  className="font-mono text-[7px] font-bold"
                  style={{
                    color: feat.passedBenchmark
                      ? "oklch(0.72 0.22 145)"
                      : "oklch(0.55 0.12 25)",
                  }}
                >
                  {feat.passedBenchmark ? "✓ pass" : "pending"}
                </span>
              </div>

              {/* Promoted */}
              <div className="flex flex-col gap-1">
                <span
                  className="font-mono text-[7px] font-bold"
                  style={{
                    color: feat.promotedToCore
                      ? "oklch(0.72 0.22 195)"
                      : "oklch(0.42 0.06 220)",
                  }}
                >
                  {feat.promotedToCore ? "✓ core" : "—"}
                </span>
                {!feat.promotedToCore &&
                  feat.passedBenchmark &&
                  feat.classification === "core-worthy" && (
                    <button
                      type="button"
                      onClick={() => handlePromote(feat.id)}
                      data-ocid="devlab.feature.primary_button"
                      className="font-mono text-[5px] px-1 py-0.5 rounded cursor-pointer"
                      style={{
                        background: "oklch(0.18 0.08 195)",
                        color: "oklch(0.72 0.22 195)",
                      }}
                    >
                      promote
                    </button>
                  )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="flex gap-4 mt-3">
        {(
          ["core-worthy", "wrapper-only", "experimental"] as FeatureClass[]
        ).map((cls) => {
          const count = registry.filter((f) => f.classification === cls).length;
          const clsStyle = classColors[cls];
          return (
            <div key={cls} className="flex items-center gap-1.5">
              <span
                className="font-mono text-[5px] tracking-wider uppercase px-1 py-0.5 rounded"
                style={{ background: clsStyle.bg, color: clsStyle.text }}
              >
                {cls}
              </span>
              <span
                className="font-mono text-[7px]"
                style={{ color: "oklch(0.55 0.08 220)" }}
              >
                {count}
              </span>
            </div>
          );
        })}
        <span
          className="font-mono text-[7px] ml-auto"
          style={{ color: "oklch(0.35 0.05 220)" }}
        >
          {registry.filter((f) => f.promotedToCore).length}/{registry.length}{" "}
          promoted to core
        </span>
      </div>
    </section>
  );
}

export function DevelopmentLab({ neural, controls }: DevelopmentLabProps) {
  const [activeProtocol, setActiveProtocol] = useState<string | null>(null);
  const [protocolProgress, setProtocolProgress] = useState(0);

  // ── Pipeline stage logic ──────────────────────────────────────────────────
  const batchComplete = neural.batchRunResults.length >= 20;
  const saturationCleared = neural.saturatedRegions.length < 3;
  const thoughtCoherent = neural.thoughtLog.length > 10;
  const debugCleared = !neural.isDebugRun;
  const maturityReady = neural.maturityScore >= 60;

  function getPipelineStage(): number {
    if (!maturityReady) return 1;
    if (!saturationCleared || !thoughtCoherent || !debugCleared) return 2;
    if (!batchComplete) return 3;
    return 4; // Baseline lock and agent ready depend on external action
  }

  const currentStage = getPipelineStage();

  // ── Plasticity index convergence check ───────────────────────────────────
  const plasticityIndex =
    neural.stdpWeightSummary.length > 0
      ? neural.stdpWeightSummary.reduce((s, e) => s + Math.abs(e.delta), 0) /
        neural.stdpWeightSummary.length
      : null;
  const stdpStable = plasticityIndex !== null && plasticityIndex < 0.005;

  // ── Agent readiness ───────────────────────────────────────────────────────
  const m = neural.maturityScore / 100;
  const threatCircuitProxy =
    neural.regionActivity.find(([r]) => r === "Amygdala")?.[1] ?? 0;
  const pfcProxy =
    neural.regionActivity.find(([r]) => r === "PrefrontalCortex")?.[1] ?? 0;

  const aiReadiness = Math.round(
    (m * 0.5 + (thoughtCoherent ? 0.25 : 0) + (saturationCleared ? 0.25 : 0)) *
      100,
  );
  const milReadiness = Math.round(
    (m * 0.4 +
      Math.min(pfcProxy, 0.3) +
      (threatCircuitProxy > 0.1 ? 0.2 : 0) +
      (batchComplete ? 0.1 : 0)) *
      100,
  );
  const resReadiness = Math.round(
    (m * 0.4 + (batchComplete ? 0.4 : 0) + (stdpStable ? 0.2 : 0)) * 100,
  );
  const commReadiness = Math.round(
    (aiReadiness >= 60 ? 0.33 : 0) +
      (milReadiness >= 60 ? 0.33 : 0) +
      (resReadiness >= 60 ? 0.34 : 0) * 100,
  );

  const agentCards = [
    {
      id: "ai",
      label: "AI Intelligence",
      readiness: aiReadiness,
      color: "oklch(0.72 0.22 195)",
      gaps: [
        !thoughtCoherent && "Low thought coherence (< 10 entries)",
        !saturationCleared && "Regions saturated — dynamic range impaired",
        !maturityReady && `Maturity ${neural.maturityScore}% — target ≥ 60%`,
      ].filter(Boolean) as string[],
    },
    {
      id: "military",
      label: "Military / Political",
      readiness: milReadiness,
      color: "oklch(0.72 0.22 25)",
      gaps: [
        !batchComplete && "No reproducibility run (batch < 20)",
        !maturityReady && `Maturity ${neural.maturityScore}% — target ≥ 60%`,
        pfcProxy < 0.3 &&
          "PFC activation low — executive control underdeveloped",
      ].filter(Boolean) as string[],
    },
    {
      id: "research",
      label: "Research",
      readiness: resReadiness,
      color: "oklch(0.82 0.26 80)",
      gaps: [
        !batchComplete && "Reproducibility not validated (batch < 20)",
        !stdpStable && "STDP weights not converged",
        !maturityReady && `Maturity ${neural.maturityScore}% — target ≥ 60%`,
      ].filter(Boolean) as string[],
    },
    {
      id: "commercialization",
      label: "Commercialization",
      readiness: commReadiness,
      color: "oklch(0.78 0.22 310)",
      gaps: [
        aiReadiness < 60 && `AI Intelligence below 60% (${aiReadiness}%)`,
        milReadiness < 60 && `Military/Political below 60% (${milReadiness}%)`,
        resReadiness < 60 && `Research below 60% (${resReadiness}%)`,
      ].filter(Boolean) as string[],
    },
  ];

  // ── Protocol runner (simplified — calls maturation + injects targeted stims) ──
  function runProtocol(protocol: Protocol) {
    setActiveProtocol(protocol.id);
    setProtocolProgress(0);
    controls.startMaturationProtocol();
    // Inject targeted stims for this protocol
    // We simulate progress via a counter
    let tick = 0;
    const interval = setInterval(() => {
      tick += 50;
      setProtocolProgress(
        Math.min(100, Math.round((tick / protocol.estimatedTicks) * 100)),
      );
      if (tick >= protocol.estimatedTicks) {
        clearInterval(interval);
        setActiveProtocol(null);
        setProtocolProgress(0);
      }
    }, 100);
  }

  function stopProtocol() {
    controls.stopMaturationProtocol();
    setActiveProtocol(null);
    setProtocolProgress(0);
  }

  // ── Maturity criteria ─────────────────────────────────────────────────────
  const criteria = [
    { label: "Saturation cleared (< 3 regions)", pass: saturationCleared },
    { label: "STDP variance converging", pass: stdpStable },
    { label: "Thought coherence (> 10 entries)", pass: thoughtCoherent },
    { label: "Debug run cleared", pass: debugCleared },
    { label: "Batch validation (≥ 20 sessions)", pass: batchComplete },
  ];
  const passCount = criteria.filter((c) => c.pass).length;
  const fullyReady = passCount === criteria.length;

  return (
    <div
      className="h-full overflow-y-auto"
      style={{ background: "oklch(0.06 0.01 265)" }}
    >
      <div className="flex flex-col gap-4 p-4 max-w-5xl mx-auto">
        {/* ── Pipeline Status Bar ── */}
        <section
          className="rounded border p-4"
          style={{
            background: "oklch(0.075 0.012 265)",
            borderColor: "oklch(0.2 0.05 255)",
          }}
          data-ocid="devlab.pipeline.panel"
        >
          <SectionHeader>Maturation Pipeline</SectionHeader>
          <div className="flex items-stretch gap-0 overflow-x-auto">
            {PIPELINE_STAGES.map((stage, idx) => {
              const completed = stage.id < currentStage;
              const active = stage.id === currentStage;
              const future = stage.id > currentStage;
              return (
                <div
                  key={stage.id}
                  className="flex items-center flex-1 min-w-0"
                >
                  <div
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded flex-1"
                    style={{
                      background: active
                        ? "oklch(0.12 0.04 195)"
                        : completed
                          ? "oklch(0.1 0.03 150)"
                          : "oklch(0.09 0.015 265)",
                      border: `1px solid ${
                        active
                          ? "oklch(0.55 0.18 195)"
                          : completed
                            ? "oklch(0.4 0.14 150)"
                            : "oklch(0.18 0.04 255)"
                      }`,
                      opacity: future ? 0.45 : 1,
                    }}
                  >
                    <div
                      className="font-mono text-[8px] font-bold"
                      style={{
                        color: active
                          ? "oklch(0.82 0.22 195)"
                          : completed
                            ? "oklch(0.78 0.2 150)"
                            : "oklch(0.4 0.06 220)",
                      }}
                    >
                      {completed ? "✓" : active ? "●" : `${stage.id}`}{" "}
                      {stage.label}
                    </div>
                    <div
                      className="font-mono text-[7px] text-center"
                      style={{ color: "oklch(0.38 0.06 220)" }}
                    >
                      {stage.description}
                    </div>
                  </div>
                  {idx < PIPELINE_STAGES.length - 1 && (
                    <div
                      className="h-px w-4 shrink-0"
                      style={{
                        background:
                          stage.id < currentStage
                            ? "oklch(0.45 0.14 150)"
                            : "oklch(0.2 0.04 255)",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* ── Pre-Maturation Protocol Panel ── */}
          <section
            className="rounded border flex flex-col"
            style={{
              background: "oklch(0.075 0.012 265)",
              borderColor: "oklch(0.2 0.05 255)",
            }}
          >
            <div className="p-4">
              <SectionHeader>Pre-Maturation Protocols</SectionHeader>

              {neural.isMaturationActive && activeProtocol && (
                <div
                  className="mb-3 px-3 py-2 rounded font-mono text-[8px]"
                  style={{
                    background: "oklch(0.12 0.06 195)",
                    border: "1px solid oklch(0.45 0.16 195)",
                    color: "oklch(0.82 0.2 195)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="animate-pulse">
                      ● RUNNING:{" "}
                      {PROTOCOLS.find((p) => p.id === activeProtocol)?.name}
                    </span>
                    <button
                      type="button"
                      data-ocid="devlab.protocol.cancel_button"
                      onClick={stopProtocol}
                      className="font-mono text-[7px] px-2 py-0.5 rounded"
                      style={{
                        background: "oklch(0.3 0.1 25 / 0.3)",
                        color: "oklch(0.75 0.18 25)",
                        border: "1px solid oklch(0.4 0.14 25)",
                      }}
                    >
                      Stop
                    </button>
                  </div>
                  <div
                    className="h-[3px] rounded overflow-hidden"
                    style={{ background: "oklch(0.18 0.04 255)" }}
                  >
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${protocolProgress}%`,
                        background: "oklch(0.72 0.22 195)",
                      }}
                    />
                  </div>
                  <div
                    className="mt-1"
                    style={{ color: "oklch(0.55 0.1 195)" }}
                  >
                    {protocolProgress}% complete
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {PROTOCOLS.map((protocol) => (
                  <div
                    key={protocol.id}
                    className="rounded border p-2.5"
                    style={{
                      background: "oklch(0.085 0.015 265)",
                      borderColor: "oklch(0.18 0.04 255)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <div
                          className="font-mono text-[9px] font-bold"
                          style={{ color: "oklch(0.78 0.18 195)" }}
                        >
                          {protocol.name}
                        </div>
                        <div
                          className="font-mono text-[7px]"
                          style={{ color: "oklch(0.45 0.07 220)" }}
                        >
                          Targets:{" "}
                          {protocol.targetRegions.slice(0, 3).join(", ")}
                          {protocol.targetRegions.length > 3 &&
                            ` +${protocol.targetRegions.length - 3}`}
                        </div>
                        <div
                          className="font-mono text-[7px] mt-0.5"
                          style={{
                            color: "oklch(0.4 0.06 220)",
                            lineHeight: "1.4",
                          }}
                        >
                          {protocol.rationale}
                        </div>
                        <div
                          className="font-mono text-[7px] mt-0.5"
                          style={{ color: "oklch(0.38 0.06 220)" }}
                        >
                          ~{protocol.estimatedTicks} ticks
                        </div>
                      </div>
                      <button
                        type="button"
                        data-ocid={`devlab.protocol.${protocol.id}.button`}
                        onClick={() => runProtocol(protocol)}
                        disabled={
                          !!(neural.isMaturationActive && activeProtocol)
                        }
                        className="font-mono text-[7px] tracking-widest uppercase px-2 py-1 rounded shrink-0 disabled:opacity-40 transition-all"
                        style={{
                          border: "1px solid oklch(0.45 0.14 195)",
                          background: "oklch(0.45 0.14 195 / 0.1)",
                          color: "oklch(0.72 0.2 195)",
                        }}
                      >
                        Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Maturity Tracker ── */}
          <section
            className="rounded border flex flex-col"
            style={{
              background: "oklch(0.075 0.012 265)",
              borderColor: "oklch(0.2 0.05 255)",
            }}
            data-ocid="devlab.maturity.panel"
          >
            <div className="p-4">
              <SectionHeader>Maturity Tracker</SectionHeader>

              {/* Maturity gauge */}
              <div className="flex flex-col gap-1 mb-4">
                <div className="flex items-end justify-between">
                  <span
                    className="font-mono text-[28px] font-bold leading-none"
                    style={{
                      color:
                        neural.maturityScore >= 80
                          ? "oklch(0.82 0.22 150)"
                          : neural.maturityScore >= 50
                            ? "oklch(0.82 0.22 80)"
                            : "oklch(0.75 0.2 25)",
                    }}
                  >
                    {neural.maturityScore.toFixed(1)}
                  </span>
                  <span
                    className="font-mono text-[10px] mb-1"
                    style={{ color: "oklch(0.4 0.06 220)" }}
                  >
                    / 100
                  </span>
                </div>
                <div
                  className="h-[6px] rounded overflow-hidden"
                  style={{ background: "oklch(0.12 0.02 260)" }}
                >
                  <div
                    className="h-full rounded transition-all duration-500"
                    style={{
                      width: `${neural.maturityScore}%`,
                      background:
                        neural.maturityScore >= 80
                          ? "oklch(0.72 0.22 150)"
                          : neural.maturityScore >= 50
                            ? "oklch(0.72 0.22 80)"
                            : "oklch(0.65 0.2 25)",
                    }}
                  />
                </div>
                <div
                  className="font-mono text-[8px]"
                  style={{ color: "oklch(0.38 0.06 220)" }}
                >
                  Maturity Index
                </div>
              </div>

              {/* Criteria list */}
              <div className="flex flex-col gap-1.5 mb-4">
                {criteria.map((c) => (
                  <StatusBadge key={c.label} pass={c.pass} label={c.label} />
                ))}
              </div>

              {/* Overall readiness */}
              <div
                className="rounded px-3 py-2 font-mono text-[9px] font-bold"
                style={{
                  background: fullyReady
                    ? "oklch(0.15 0.1 150)"
                    : "oklch(0.15 0.08 25)",
                  border: `1px solid ${
                    fullyReady ? "oklch(0.45 0.18 150)" : "oklch(0.4 0.14 25)"
                  }`,
                  color: fullyReady
                    ? "oklch(0.85 0.22 150)"
                    : "oklch(0.85 0.18 25)",
                }}
              >
                {fullyReady ? (
                  "✓ READY TO LOCK BASELINE"
                ) : (
                  <>
                    ✗ NOT READY —{" "}
                    <span
                      className="font-normal"
                      style={{ color: "oklch(0.65 0.12 25)" }}
                    >
                      {criteria.length - passCount} criteria failing
                    </span>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* ── Validation & Batch Run Panel ── */}
        <section
          className="rounded border p-4"
          style={{
            background: "oklch(0.075 0.012 265)",
            borderColor: "oklch(0.2 0.05 255)",
          }}
          data-ocid="devlab.batch.panel"
        >
          <SectionHeader>Validation &amp; Batch Run Protocol</SectionHeader>

          <div className="flex items-center gap-2 mb-3">
            {([20, 50, 100] as const).map((n) => (
              <button
                key={n}
                type="button"
                data-ocid="devlab.batch.primary_button"
                onClick={() =>
                  !neural.batchRunActive && controls.startBatchRun(n)
                }
                disabled={neural.batchRunActive}
                className="font-mono text-[8px] tracking-widest uppercase px-3 py-1.5 rounded transition-all disabled:opacity-40"
                style={{
                  border: "1px solid oklch(0.45 0.15 195)",
                  background: "oklch(0.45 0.15 195 / 0.1)",
                  color: "oklch(0.72 0.22 195)",
                }}
              >
                Run ×{n}
              </button>
            ))}
            {neural.batchRunActive && (
              <button
                type="button"
                data-ocid="devlab.batch.cancel_button"
                onClick={controls.stopBatchRun}
                className="font-mono text-[8px] tracking-widest uppercase px-3 py-1.5 rounded transition-all ml-auto"
                style={{
                  border: "1px solid oklch(0.4 0.12 25)",
                  background: "oklch(0.4 0.12 25 / 0.1)",
                  color: "oklch(0.72 0.2 25)",
                }}
              >
                Stop
              </button>
            )}
            {neural.batchRunActive && (
              <span
                className="font-mono text-[8px] animate-pulse ml-2"
                style={{ color: "oklch(0.82 0.26 80)" }}
              >
                ● RUNNING {neural.batchRunProgress}/{neural.batchRunTarget}
              </span>
            )}
          </div>

          {/* Progress bar */}
          {(neural.batchRunActive || neural.batchRunProgress > 0) && (
            <div className="mb-3">
              <div
                className="h-[4px] rounded overflow-hidden"
                style={{ background: "oklch(0.12 0.02 260)" }}
              >
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${
                      neural.batchRunTarget > 0
                        ? Math.round(
                            (neural.batchRunProgress / neural.batchRunTarget) *
                              100,
                          )
                        : 0
                    }%`,
                    background: "oklch(0.72 0.22 195)",
                  }}
                  data-ocid="devlab.batch.loading_state"
                />
              </div>
              <div
                className="font-mono text-[8px] mt-1"
                style={{ color: "oklch(0.4 0.06 220)" }}
              >
                {neural.batchRunProgress} / {neural.batchRunTarget} sessions
                complete
              </div>
            </div>
          )}

          {/* Results table */}
          {neural.batchRunResults.length > 0 ? (
            <div className="overflow-x-auto">
              <table
                className="w-full font-mono text-[8px]"
                style={{ borderCollapse: "collapse" }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid oklch(0.2 0.04 255)",
                    }}
                  >
                    {[
                      "#",
                      "Entropy",
                      "Sat.",
                      "Thoughts",
                      "Habit.",
                      "Nav.",
                      "Plasticity",
                      "Arousal",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-2 py-1 text-left"
                        style={{ color: "oklch(0.45 0.08 220)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {neural.batchRunResults.map((r, i) => (
                    <tr
                      key={r.sessionId}
                      data-ocid={`devlab.batch.item.${i + 1}`}
                      style={{
                        borderBottom: "1px solid oklch(0.14 0.03 255 / 0.5)",
                      }}
                    >
                      <td
                        className="px-2 py-[2px]"
                        style={{ color: "oklch(0.38 0.06 220)" }}
                      >
                        {i + 1}
                      </td>
                      <td
                        className="px-2 py-[2px]"
                        style={{ color: "oklch(0.72 0.22 195)" }}
                      >
                        {r.shannonEntropy.toFixed(3)}
                      </td>
                      <td
                        className="px-2 py-[2px]"
                        style={{
                          color:
                            r.saturatedCount > 0
                              ? "oklch(0.72 0.22 25)"
                              : "oklch(0.55 0.08 150)",
                        }}
                      >
                        {r.saturatedCount}
                      </td>
                      <td
                        className="px-2 py-[2px]"
                        style={{ color: "oklch(0.6 0.1 220)" }}
                      >
                        {r.thoughtCount}
                      </td>
                      <td
                        className="px-2 py-[2px]"
                        style={{
                          color: r.habituationDetected
                            ? "oklch(0.72 0.22 140)"
                            : "oklch(0.35 0.05 220)",
                        }}
                      >
                        {r.habituationDetected ? "✓" : "–"}
                      </td>
                      <td
                        className="px-2 py-[2px]"
                        style={{
                          color: r.goalDirectedNav
                            ? "oklch(0.72 0.22 195)"
                            : "oklch(0.35 0.05 220)",
                        }}
                      >
                        {r.goalDirectedNav ? "✓" : "–"}
                      </td>
                      <td
                        className="px-2 py-[2px]"
                        style={{ color: "oklch(0.65 0.14 280)" }}
                      >
                        {r.plasticityIndex.toFixed(4)}
                      </td>
                      <td
                        className="px-2 py-[2px]"
                        style={{ color: "oklch(0.62 0.12 220)" }}
                      >
                        {Math.round(r.peakArousal * 100)}%
                      </td>
                    </tr>
                  ))}

                  {/* Summary row */}
                  {neural.batchRunResults.length > 1 &&
                    (() => {
                      const results = neural.batchRunResults;
                      const mean = (arr: number[]) =>
                        arr.reduce((s, v) => s + v, 0) / arr.length;
                      const std = (arr: number[]) => {
                        const mn = mean(arr);
                        return Math.sqrt(mean(arr.map((v) => (v - mn) ** 2)));
                      };
                      const entropies = results.map((r) => r.shannonEntropy);
                      const plasticities = results.map(
                        (r) => r.plasticityIndex,
                      );
                      const habRate =
                        results.filter((r) => r.habituationDetected).length /
                        results.length;
                      const navRate =
                        results.filter((r) => r.goalDirectedNav).length /
                        results.length;
                      const reproducible = habRate >= 0.7 || navRate >= 0.7;
                      return (
                        <tr
                          style={{
                            borderTop: "1px solid oklch(0.3 0.06 255)",
                            background: "oklch(0.1 0.015 265)",
                          }}
                        >
                          <td
                            className="px-2 py-1 font-bold"
                            style={{ color: "oklch(0.5 0.08 220)" }}
                          >
                            μ±σ
                          </td>
                          <td
                            className="px-2 py-1"
                            style={{ color: "oklch(0.72 0.22 195)" }}
                          >
                            {mean(entropies).toFixed(3)}±
                            {std(entropies).toFixed(3)}
                          </td>
                          <td
                            className="px-2 py-1"
                            colSpan={2}
                            style={{ color: "oklch(0.5 0.08 220)" }}
                          >
                            <span
                              className="font-bold"
                              style={{
                                color: reproducible
                                  ? "oklch(0.72 0.22 140)"
                                  : "oklch(0.72 0.22 25)",
                              }}
                            >
                              {reproducible
                                ? "✓ REPRODUCIBLE"
                                : "✗ NOT REPRODUCIBLE"}
                            </span>
                          </td>
                          <td
                            className="px-2 py-1"
                            style={{ color: "oklch(0.6 0.1 220)" }}
                          >
                            {Math.round(habRate * 100)}%
                          </td>
                          <td
                            className="px-2 py-1"
                            style={{ color: "oklch(0.6 0.1 220)" }}
                          >
                            {Math.round(navRate * 100)}%
                          </td>
                          <td
                            className="px-2 py-1"
                            style={{ color: "oklch(0.65 0.14 280)" }}
                          >
                            {mean(plasticities).toFixed(4)}±
                            {std(plasticities).toFixed(4)}
                          </td>
                          <td />
                        </tr>
                      );
                    })()}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              className="font-mono text-[8px] text-center py-4"
              style={{ color: "oklch(0.35 0.05 220)" }}
              data-ocid="devlab.batch.empty_state"
            >
              Run ×20, ×50, or ×100 sessions to test reproducibility across
              matched conditions.
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* ── Baseline Lock Panel ── */}
          <section
            className="rounded border p-4"
            style={{
              background: "oklch(0.075 0.012 265)",
              borderColor: "oklch(0.2 0.05 255)",
            }}
            data-ocid="devlab.baseline.panel"
          >
            <SectionHeader>Baseline Lock Status</SectionHeader>
            <div
              className="rounded px-3 py-2.5 font-mono text-[9px]"
              style={{
                background: "oklch(0.12 0.06 45)",
                border: "1px solid oklch(0.38 0.14 45)",
                color: "oklch(0.82 0.16 45)",
              }}
            >
              <div className="font-bold mb-1">Baseline: NOT LOCKED</div>
              <div style={{ color: "oklch(0.55 0.1 45)" }}>
                Complete validation gate (batch ≥ 20, saturation cleared) then
                lock baseline from the Agent R&amp;D tab.
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-1">
              <div
                className="font-mono text-[8px]"
                style={{ color: "oklch(0.4 0.06 220)" }}
              >
                Baseline lock requirements:
              </div>
              {[
                { label: "Batch ≥ 20 sessions", pass: batchComplete },
                { label: "Saturation cleared", pass: saturationCleared },
                { label: "Maturity ≥ 60%", pass: maturityReady },
              ].map((item) => (
                <StatusBadge
                  key={item.label}
                  pass={item.pass}
                  label={item.label}
                />
              ))}
            </div>
          </section>

          {/* ── Maturation Controls ── */}
          <section
            className="rounded border p-4"
            style={{
              background: "oklch(0.075 0.012 265)",
              borderColor: "oklch(0.2 0.05 255)",
            }}
            data-ocid="devlab.maturation.panel"
          >
            <SectionHeader>Maturation Controls</SectionHeader>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                data-ocid="devlab.maturation.primary_button"
                onClick={controls.startMaturationProtocol}
                disabled={neural.isMaturationActive}
                className="font-mono text-[9px] tracking-widest uppercase px-4 py-2 rounded transition-all disabled:opacity-40 w-full"
                style={{
                  border: "1px solid oklch(0.5 0.18 150)",
                  background: "oklch(0.5 0.18 150 / 0.1)",
                  color: "oklch(0.78 0.22 150)",
                }}
              >
                {neural.isMaturationActive
                  ? "● Maturation Active"
                  : "Start Full Maturation Protocol"}
              </button>
              {neural.isMaturationActive && (
                <button
                  type="button"
                  data-ocid="devlab.maturation.cancel_button"
                  onClick={controls.stopMaturationProtocol}
                  className="font-mono text-[9px] tracking-widest uppercase px-4 py-2 rounded transition-all w-full"
                  style={{
                    border: "1px solid oklch(0.4 0.12 25)",
                    background: "oklch(0.4 0.12 25 / 0.1)",
                    color: "oklch(0.72 0.2 25)",
                  }}
                >
                  Stop Maturation
                </button>
              )}
              <div
                className="font-mono text-[7px] mt-1"
                style={{ color: "oklch(0.38 0.06 220)" }}
              >
                Full maturation runs all 4 protocols in sequence at complexity
                10, auto-triggering consolidation every 60 ticks.
              </div>
            </div>
          </section>
        </div>

        {/* ── Agent Readiness Scores ── */}
        <section
          className="rounded border p-4"
          style={{
            background: "oklch(0.075 0.012 265)",
            borderColor: "oklch(0.2 0.05 255)",
          }}
          data-ocid="devlab.agents.panel"
        >
          <SectionHeader>Agent Deployment Readiness</SectionHeader>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {agentCards.map((agent) => (
              <div
                key={agent.id}
                className="rounded border p-3 flex flex-col gap-2"
                data-ocid={`devlab.agents.${agent.id}.card`}
                style={{
                  background: "oklch(0.085 0.015 265)",
                  borderColor: "oklch(0.18 0.04 255)",
                }}
              >
                <div
                  className="font-mono text-[8px] font-bold"
                  style={{ color: agent.color }}
                >
                  {agent.label}
                </div>

                {/* Readiness gauge */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-end justify-between">
                    <span
                      className="font-mono text-[20px] font-bold leading-none"
                      style={{
                        color:
                          agent.readiness >= 70
                            ? "oklch(0.82 0.22 150)"
                            : agent.readiness >= 40
                              ? "oklch(0.82 0.22 80)"
                              : "oklch(0.72 0.2 25)",
                      }}
                    >
                      {Math.min(agent.readiness, 100)}
                    </span>
                    <span
                      className="font-mono text-[8px] mb-0.5"
                      style={{ color: "oklch(0.38 0.06 220)" }}
                    >
                      %
                    </span>
                  </div>
                  <div
                    className="h-[3px] rounded overflow-hidden"
                    style={{ background: "oklch(0.12 0.02 260)" }}
                  >
                    <div
                      className="h-full rounded transition-all"
                      style={{
                        width: `${Math.min(agent.readiness, 100)}%`,
                        background:
                          agent.readiness >= 70
                            ? "oklch(0.72 0.22 150)"
                            : agent.readiness >= 40
                              ? "oklch(0.72 0.22 80)"
                              : "oklch(0.65 0.2 25)",
                      }}
                    />
                  </div>
                </div>

                {/* Gaps */}
                {agent.gaps.length > 0 ? (
                  <div className="flex flex-col gap-0.5">
                    <div
                      className="font-mono text-[7px]"
                      style={{ color: "oklch(0.4 0.06 220)" }}
                    >
                      Key gaps:
                    </div>
                    {agent.gaps.slice(0, 3).map((gap) => (
                      <div
                        key={gap}
                        className="font-mono text-[7px] flex gap-1"
                        style={{ color: "oklch(0.55 0.1 45)" }}
                      >
                        <span style={{ color: "oklch(0.65 0.18 25)" }}>•</span>
                        {gap}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="font-mono text-[7px]"
                    style={{ color: "oklch(0.72 0.2 150)" }}
                  >
                    ✓ All criteria met
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Feature Classification Registry (Phase 7 Governance) ── */}
        <FeatureClassificationPanel />
      </div>
    </div>
  );
}
