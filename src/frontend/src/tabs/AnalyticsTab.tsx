import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  AlertTriangle,
  BarChart2,
  Brain,
  CheckCircle2,
  Cpu,
  Eye,
  Heart,
  Link,
  RefreshCw,
  Shield,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import BehavioralEconomicsPanel from "../components/BehavioralEconomicsPanel";
import RLEnginePanel from "../components/RLEnginePanel";
import { SovereignWealthPanel } from "../components/SovereignWealthPanel";
import {
  useCanonicalState,
  useFearMissionState,
  useNunHekaAnkhState,
} from "../hooks/useQueries";
import type { SystemAnalyticsSnapshot } from "../utils/analyticsMetrics";
import { getSystemAnalyticsSnapshot } from "../utils/analyticsMetrics";
import { createArtifact } from "../utils/artifactStore";
import { evaluateGoLive } from "../utils/goLiveRuntime";

const C = {
  bg: "oklch(0.06 0.01 265)",
  bgCard: "oklch(0.085 0.015 265)",
  bgSidebar: "oklch(0.07 0.012 265)",
  border: "oklch(0.18 0.05 255)",
  borderDim: "oklch(0.14 0.03 255)",
  cyan: "oklch(0.72 0.22 195)",
  green: "oklch(0.68 0.28 140)",
  yellow: "oklch(0.78 0.22 80)",
  red: "oklch(0.65 0.25 25)",
  dimText: "oklch(0.38 0.05 220)",
  midText: "oklch(0.55 0.1 210)",
  brightText: "oklch(0.85 0.06 210)",
  purple: "oklch(0.65 0.2 285)",
};

type SectionId =
  | "brain_health"
  | "regulation"
  | "sensory_spatial"
  | "memory_prediction"
  | "circuit_motif"
  | "sparse_efficiency"
  | "live_compatibility"
  | "binding_validation"
  | "trace_return"
  | "benchmark"
  | "ai_review"
  | "readiness"
  | "behavioral_economics"
  | "rl_engine"
  | "sovereign_wealth"
  | "cit_benchmarks";

const CIT_BENCHMARKS = [
  {
    id: "MINI-1",
    name: "Miniverse Detection Benchmark",
    desc: "Detect emergent proto-agents inside attention heads, cortical nodes, or runtime clusters.",
    metrics:
      "attractor stability · local policy formation · cross-cluster influence · self-reinforcement loops",
  },
  {
    id: "MEM-1",
    name: "Memory Runtime Stability Benchmark",
    desc: "Compare fused vs separated memory architectures over long-horizon tasks.",
    metrics:
      "contradiction rate · rollback success · revision traceability · drift accumulation",
  },
  {
    id: "AUTH-1",
    name: "Authority Membrane Enforcement Test",
    desc: "Determine whether generative processes can mutate canonical memory without mediation.",
    metrics:
      "unauthorized write attempts · membrane breach rate · promotion-path correctness",
  },
  {
    id: "GW-1",
    name: "Global Workspace Coherence Benchmark",
    desc: "Measure ignition, broadcast, and coalition formation across cortical regions.",
    metrics:
      "ignition frequency · coherence amplitude · coalition size · cross-region synchrony",
  },
  {
    id: "SAT-1",
    name: "Saturation & Emergence Window Benchmark",
    desc: "Quantify how saturation suppresses emergence and attractor formation.",
    metrics:
      "emergence probability vs activation · attractor formation rate · phase-contrast availability",
  },
  {
    id: "AUTO-1",
    name: "Autonomic Stability Benchmark",
    desc: "Evaluate homeostatic regulation under cognitive load over time.",
    metrics:
      "stress index · oscillatory stability · parasympathetic dominance · recovery time",
  },
];

function CITBenchmarksSection() {
  const { data: nunHekaAnkh } = useNunHekaAnkhState();
  const LIVE_IDS = new Set(["GW-1", "SAT-1", "AUTO-1"]);
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span style={{ color: C.cyan }}>⬡</span>
        <h2
          className="font-mono text-[11px] tracking-widest uppercase font-bold"
          style={{ color: C.brightText }}
        >
          Contained Intelligence Theory — Benchmark Suite v0.1
        </h2>
        <span
          className="font-mono text-[8px] px-2 py-0.5 rounded-sm border ml-auto"
          style={{
            background: `${C.yellow}15`,
            color: C.yellow,
            border: `1px solid ${C.yellow}40`,
          }}
        >
          6 ACTIVE PROTOCOLS
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {CIT_BENCHMARKS.map((b) => (
          <div
            key={b.id}
            data-ocid={`analytics.cit.${b.id.toLowerCase().replace("-", "_")}.card`}
            className="rounded-sm border p-3"
            style={{ background: C.bgCard, borderColor: `${C.cyan}30` }}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-sm shrink-0"
                  style={{
                    background: `${C.cyan}18`,
                    color: C.cyan,
                    border: `1px solid ${C.cyan}35`,
                  }}
                >
                  {b.id}
                </span>
                <p
                  className="font-mono text-[10px] font-semibold"
                  style={{ color: C.brightText }}
                >
                  {b.name}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {LIVE_IDS.has(b.id) && (
                  <span
                    className="inline-flex items-center gap-1 text-[8px] font-mono"
                    style={{ color: C.green }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: C.green }}
                    />
                    LIVE
                  </span>
                )}
                <span
                  className="font-mono text-[8px] px-1.5 py-0.5 rounded-sm"
                  style={{
                    background: "oklch(0.68 0.28 140 / 0.12)",
                    color: "oklch(0.68 0.28 140)",
                    border: "1px solid oklch(0.68 0.28 140 / 0.3)",
                  }}
                >
                  ACTIVE
                </span>
              </div>
            </div>
            <p
              className="font-mono text-[9px] mb-2"
              style={{ color: C.midText }}
            >
              {b.desc}
            </p>
            <p className="font-mono text-[8px]" style={{ color: C.dimText }}>
              Metrics: {b.metrics}
            </p>
          </div>
        ))}
      </div>

      {/* ANKH PHASE LOCK */}
      <div
        className={`mt-4 p-4 rounded-lg border transition-all duration-300 ${
          nunHekaAnkh?.ankhFullLock
            ? "border-cyan-400/60 bg-cyan-900/20 shadow-lg shadow-cyan-900/30"
            : "border-gray-800/40 bg-black/20"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xs font-mono font-bold uppercase tracking-widest"
            style={{ color: C.dimText }}
          >
            Ankh Phase Lock — 4 Toroidal Loops
          </span>
          {nunHekaAnkh?.ankhFullLock && (
            <span
              className="text-xs font-mono animate-pulse font-bold"
              style={{ color: C.cyan }}
            >
              ◉ PHASE LOCK ACTIVE
            </span>
          )}
        </div>
        <div className="space-y-2">
          {(
            [
              {
                name: "Cognitive",
                value: nunHekaAnkh?.ankhCognitiveCoherence ?? 0,
                color: C.cyan,
              },
              {
                name: "Economic",
                value: nunHekaAnkh?.ankhEconomicCoherence ?? 0,
                color: C.yellow,
              },
              {
                name: "Expression",
                value: nunHekaAnkh?.ankhExpressionCoherence ?? 0,
                color: C.purple,
              },
              {
                name: "Perception",
                value: nunHekaAnkh?.ankhPerceptionCoherence ?? 0,
                color: C.green,
              },
            ] as const
          ).map((loop) => (
            <div key={loop.name} className="flex items-center gap-2">
              <span
                className="text-xs w-20 font-mono"
                style={{ color: C.dimText }}
              >
                {loop.name}
              </span>
              <div
                className="flex-1 rounded-full h-1.5"
                style={{ background: "oklch(0.15 0.03 255)" }}
              >
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${(Number(loop.value) * 100).toFixed(1)}%`,
                    background: loop.color,
                  }}
                />
              </div>
              <span
                className="text-xs w-10 text-right font-mono"
                style={{ color: C.dimText }}
              >
                {(Number(loop.value) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs font-mono" style={{ color: C.dimText }}>
          Locks: {Number(nunHekaAnkh?.ankhLockCount ?? 0)} | NUN charge:{" "}
          {Number(nunHekaAnkh?.nunCharge ?? 0).toFixed(3)} | HEKA events:{" "}
          {Number(nunHekaAnkh?.hekaEvents ?? 0)}
        </div>
      </div>
    </div>
  );
}

const SECTIONS: Array<{ id: SectionId; label: string; icon: React.ReactNode }> =
  [
    { id: "brain_health", label: "Brain Health", icon: <Brain size={12} /> },
    {
      id: "regulation",
      label: "Regulation / Cardio / ANS",
      icon: <Heart size={12} />,
    },
    {
      id: "sensory_spatial",
      label: "Sensory / Spatial",
      icon: <Eye size={12} />,
    },
    {
      id: "memory_prediction",
      label: "Memory / Prediction",
      icon: <Activity size={12} />,
    },
    { id: "circuit_motif", label: "Circuit / Motif", icon: <Cpu size={12} /> },
    {
      id: "sparse_efficiency",
      label: "Sparse Efficiency",
      icon: <Zap size={12} />,
    },
    {
      id: "live_compatibility",
      label: "Live Compatibility",
      icon: <Link size={12} />,
    },
    {
      id: "binding_validation",
      label: "Binding Validation",
      icon: <Shield size={12} />,
    },
    {
      id: "trace_return",
      label: "Trace Return",
      icon: <RefreshCw size={12} />,
    },
    {
      id: "benchmark",
      label: "Benchmark Comparison",
      icon: <BarChart2 size={12} />,
    },
    {
      id: "ai_review",
      label: "AI Review / Recs",
      icon: <AlertTriangle size={12} />,
    },
    {
      id: "readiness",
      label: "Readiness / Go-Live",
      icon: <CheckCircle2 size={12} />,
    },
    {
      id: "behavioral_economics",
      label: "Behavioral Economics",
      icon: <TrendingUp size={12} />,
    },
    {
      id: "rl_engine",
      label: "RL Engine",
      icon: <Activity size={12} />,
    },
    {
      id: "sovereign_wealth",
      label: "Sovereign Wealth",
      icon: <Shield size={12} />,
    },
    {
      id: "cit_benchmarks",
      label: "CIT Benchmarks",
      icon: <BarChart2 size={12} />,
    },
  ];

function MetricRow({
  label,
  value,
  unit = "",
  color,
  trend,
}: {
  label: string;
  value: number | string;
  unit?: string;
  color?: string;
  trend?: "up" | "down" | "flat";
}) {
  let displayVal: string;
  if (typeof value === "number") {
    if (value < 1.01 && value > 0 && unit === "") {
      displayVal = `${(value * 100).toFixed(1)}%`;
    } else {
      displayVal = `${value.toFixed(1)}${unit}`;
    }
  } else {
    displayVal = value;
  }
  return (
    <div
      className="flex items-center justify-between py-1"
      style={{ borderBottom: `1px solid ${C.borderDim}` }}
    >
      <span className="font-mono text-[10px]" style={{ color: C.dimText }}>
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        {trend === "up" && <TrendingUp size={9} style={{ color: C.green }} />}
        {trend === "down" && <TrendingDown size={9} style={{ color: C.red }} />}
        <span
          className="font-mono text-[11px] font-bold"
          style={{ color: color ?? C.brightText }}
        >
          {displayVal}
        </span>
      </div>
    </div>
  );
}

function ScoreRing({
  score,
  size = 72,
  label,
}: { score: number; size?: number; label: string }) {
  const r = size / 2 - 6;
  const circumference = 2 * Math.PI * r;
  const dash = circumference * Math.min(1, Math.max(0, score));
  const clr = score > 0.7 ? C.green : score > 0.45 ? C.yellow : C.red;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} role="img" aria-label={label}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="oklch(0.14 0.03 255)"
          strokeWidth={5}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={clr}
          strokeWidth={5}
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: "stroke-dasharray 0.6s ease",
            filter: `drop-shadow(0 0 4px ${clr}80)`,
          }}
        />
        <text
          x={size / 2}
          y={size / 2 + 4}
          textAnchor="middle"
          fill={clr}
          fontSize={size > 60 ? 14 : 11}
          fontFamily="monospace"
          fontWeight="bold"
        >
          {Math.round(score * 100)}%
        </text>
      </svg>
      <span
        className="font-mono text-[9px] tracking-widest uppercase"
        style={{ color: C.dimText }}
      >
        {label}
      </span>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  score,
}: {
  icon: React.ReactNode;
  title: string;
  score?: number;
}) {
  const clr =
    score !== undefined
      ? score > 0.7
        ? C.green
        : score > 0.45
          ? C.yellow
          : C.red
      : C.cyan;
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span style={{ color: C.cyan }}>{icon}</span>
        <h2
          className="font-mono text-[11px] tracking-widest uppercase font-bold"
          style={{ color: C.brightText }}
        >
          {title}
        </h2>
      </div>
      {score !== undefined && (
        <Badge
          className="font-mono text-[9px] px-2 py-0.5"
          style={{
            background: `${clr}22`,
            color: clr,
            border: `1px solid ${clr}55`,
          }}
        >
          {Math.round(score * 100)}%
        </Badge>
      )}
    </div>
  );
}

function StatusDot({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-2 h-2 rounded-full"
        style={{
          background: ok ? C.green : C.red,
          boxShadow: ok ? `0 0 5px ${C.green}80` : "none",
        }}
      />
      <span className="font-mono text-[10px]" style={{ color: C.midText }}>
        {label}
      </span>
    </div>
  );
}

// ─── Section renderers ────────────────────────────────────────────────────────

function BrainHealthSection({ snap }: { snap: SystemAnalyticsSnapshot }) {
  const coup = snap.couplingSnapshot;
  const overallBrainHealth =
    snap.cardio.overallCardioHealth * 0.2 +
    snap.ans.overallANSHealth * 0.2 +
    snap.sensory.overallSensoryHealth * 0.15 +
    snap.spatial.overallSpatialHealth * 0.1 +
    snap.emergence.overallEmergenceScore * 0.35;
  return (
    <div>
      <SectionTitle
        icon={<Brain size={14} />}
        title="Brain Health"
        score={overallBrainHealth}
      />
      <div className="flex gap-4 mb-4">
        <ScoreRing score={overallBrainHealth} size={80} label="BRAIN" />
        <ScoreRing
          score={snap.emergence.overallEmergenceScore}
          size={80}
          label="EMERGENCE"
        />
        <ScoreRing
          score={snap.cardio.overallCardioHealth}
          size={80}
          label="CARDIO"
        />
        <ScoreRing score={snap.ans.overallANSHealth} size={80} label="ANS" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div
          className="p-3 rounded"
          style={{
            background: C.bgCard,
            border: `1px solid ${C.borderDim}`,
          }}
        >
          <p className="font-mono text-[9px] mb-2" style={{ color: C.dimText }}>
            COGNITIVE MODULES
          </p>
          <StatusDot
            ok={coup.activeCouplingCount > 5}
            label="Salience Engine"
          />
          <StatusDot
            ok={coup.interoceptiveInfluenceRate > 0.1}
            label="Working Memory Gate"
          />
          <StatusDot
            ok={coup.bodyStatePolicyInfluence > 0.05}
            label="Arbitration Engine"
          />
          <StatusDot
            ok={coup.activeCouplingCount > 3}
            label="Persistence Queue"
          />
        </div>
        <div
          className="p-3 rounded"
          style={{
            background: C.bgCard,
            border: `1px solid ${C.borderDim}`,
          }}
        >
          <p className="font-mono text-[9px] mb-2" style={{ color: C.dimText }}>
            BODY SYSTEMS
          </p>
          <StatusDot
            ok={snap.cardio.collapseRiskProxy < 0.5}
            label="Cardio Regulatory"
          />
          <StatusDot
            ok={snap.ans.autonomicBalance > 0.3}
            label="ANS / Autonomic"
          />
          <StatusDot
            ok={coup.interoceptiveInfluenceRate > 0}
            label="Interoception"
          />
          <StatusDot
            ok={snap.sensory.sensoryToSalienceCouplingScore > 0.1}
            label="Sensory Coupling"
          />
        </div>
      </div>
      <MetricRow
        label="Active Couplings"
        value={`${coup.activeCouplingCount}`}
        unit=" ch"
        color={C.cyan}
      />
      <MetricRow
        label="Overall Influence Rate"
        value={coup.overallInfluenceRate}
      />
      <MetricRow
        label="Policy Diversity"
        value={snap.emergence.policyDiversityIndex}
      />
      <MetricRow
        label="Prediction Revision Rate"
        value={snap.emergence.predictionRevisionRate}
      />
    </div>
  );
}

function RegulationSection({ snap }: { snap: SystemAnalyticsSnapshot }) {
  const { cardio, ans } = snap;
  const coup = snap.couplingSnapshot;
  return (
    <div>
      <SectionTitle
        icon={<Heart size={14} />}
        title="Regulation / Cardio / ANS"
      />
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div
          className="p-3 rounded"
          style={{ background: C.bgCard, border: `1px solid ${C.borderDim}` }}
        >
          <p className="font-mono text-[9px] mb-2" style={{ color: C.cyan }}>
            CARDIO
          </p>
          <MetricRow
            label="Heart Rate"
            value={cardio.heartRateProxy}
            unit=" bpm"
            color={cardio.heartRateProxy > 110 ? C.red : C.green}
          />
          <MetricRow
            label="HRV"
            value={cardio.hrvProxy}
            unit=" ms"
            color={cardio.hrvProxy > 50 ? C.green : C.yellow}
          />
          <MetricRow
            label="Recovery Capacity"
            value={cardio.recoveryCapacityProxy}
            color={cardio.recoveryCapacityProxy > 0.6 ? C.green : C.yellow}
          />
          <MetricRow
            label="HRV-Mod Recovery"
            value={cardio.hrvModulatedRecoveryRate}
          />
          <MetricRow
            label="Collapse Risk"
            value={cardio.collapseRiskProxy}
            color={cardio.collapseRiskProxy > 0.4 ? C.red : C.green}
            trend={cardio.collapseRiskProxy > 0.4 ? "down" : "flat"}
          />
          <MetricRow
            label="Cardio Stability"
            value={cardio.cardioStabilityIndex}
            color={cardio.cardioStabilityIndex > 0.6 ? C.green : C.yellow}
          />
        </div>
        <div
          className="p-3 rounded"
          style={{ background: C.bgCard, border: `1px solid ${C.borderDim}` }}
        >
          <p className="font-mono text-[9px] mb-2" style={{ color: C.cyan }}>
            ANS
          </p>
          <MetricRow
            label="Sympathetic Tone"
            value={ans.sympatheticTone}
            color={ans.sympatheticTone > 0.6 ? C.red : C.midText}
          />
          <MetricRow
            label="Parasympathetic"
            value={ans.parasympatheticTone}
            color={ans.parasympatheticTone > 0.4 ? C.green : C.yellow}
          />
          <MetricRow
            label="Autonomic Balance"
            value={ans.autonomicBalance}
            color={ans.autonomicBalance > 0.45 ? C.green : C.red}
          />
          <MetricRow
            label="Threat Threshold"
            value={ans.threatThresholdShift}
          />
          <MetricRow
            label="Reaction Urgency"
            value={ans.reactionUrgencyShift}
            color={ans.reactionUrgencyShift > 1.3 ? C.yellow : C.midText}
          />
          <div className="mt-1">
            <Badge
              className="font-mono text-[8px]"
              style={{
                background: "oklch(0.65 0.2 285 / 0.2)",
                color: C.purple,
                border: `1px solid ${C.purple}55`,
              }}
            >
              {ans.arousalMode}
            </Badge>
          </div>
        </div>
        <div
          className="p-3 rounded"
          style={{ background: C.bgCard, border: `1px solid ${C.borderDim}` }}
        >
          <p className="font-mono text-[9px] mb-2" style={{ color: C.cyan }}>
            INTEROCEPTIVE
          </p>
          <MetricRow
            label="Intero Influence"
            value={coup.interoceptiveInfluenceRate}
            color={coup.interoceptiveInfluenceRate > 0.3 ? C.green : C.yellow}
          />
          <MetricRow
            label="Cardio Influence"
            value={coup.cardioInfluenceRate}
            color={coup.cardioInfluenceRate > 0.2 ? C.green : C.yellow}
          />
          <MetricRow label="ANS Influence" value={coup.ansInfluenceRate} />
          <MetricRow
            label="Overload Response"
            value={coup.overloadResponseQuality}
          />
          <MetricRow
            label="Recovery Response"
            value={coup.recoveryResponseQuality}
          />
          <MetricRow
            label="Body→Policy"
            value={coup.bodyStatePolicyInfluence}
            color={coup.bodyStatePolicyInfluence > 0.1 ? C.green : C.yellow}
          />
        </div>
      </div>
      <div
        className="p-2 rounded"
        style={{
          background: "oklch(0.08 0.02 265)",
          border: `1px solid ${C.borderDim}`,
        }}
      >
        <p className="font-mono text-[9px] mb-1" style={{ color: C.dimText }}>
          RECOVERY MODE
        </p>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: ans.recoveryModeActive ? C.green : C.borderDim,
              boxShadow: ans.recoveryModeActive ? `0 0 6px ${C.green}` : "none",
            }}
          />
          <span
            className="font-mono text-[10px]"
            style={{ color: ans.recoveryModeActive ? C.green : C.dimText }}
          >
            {ans.recoveryModeActive
              ? "ACTIVE — Parasympathetic dominant"
              : "INACTIVE — Sympathetic engaged"}
          </span>
        </div>
      </div>
    </div>
  );
}

function SensorySpatialSection({ snap }: { snap: SystemAnalyticsSnapshot }) {
  const { sensory, spatial } = snap;
  return (
    <div>
      <SectionTitle icon={<Eye size={14} />} title="Sensory / Spatial Burden" />
      <div className="grid grid-cols-2 gap-3">
        <div
          className="p-3 rounded"
          style={{ background: C.bgCard, border: `1px solid ${C.borderDim}` }}
        >
          <p className="font-mono text-[9px] mb-2" style={{ color: C.cyan }}>
            SENSORY
          </p>
          <MetricRow
            label="Sensory Relevance"
            value={sensory.sensoryRelevance}
            color={sensory.sensoryRelevance > 0.6 ? C.green : C.yellow}
          />
          <MetricRow
            label="Uncertainty Burden"
            value={sensory.uncertaintyBurden}
            color={sensory.uncertaintyBurden > 0.5 ? C.red : C.green}
            trend={sensory.uncertaintyBurden > 0.5 ? "down" : "flat"}
          />
          <MetricRow
            label="Env Modifier Strength"
            value={sensory.environmentModifierStrength}
          />
          <MetricRow
            label="Degradation Under Load"
            value={sensory.degradationUnderLoad}
            color={sensory.degradationUnderLoad > 0.4 ? C.yellow : C.green}
          />
          <MetricRow
            label="→ Salience Coupling"
            value={sensory.sensoryToSalienceCouplingScore}
            color={
              sensory.sensoryToSalienceCouplingScore > 0.3 ? C.green : C.yellow
            }
          />
          <MetricRow
            label="→ WM Influence"
            value={sensory.sensoryToWMInfluenceScore}
          />
          <div className="mt-2">
            <Progress
              value={sensory.overallSensoryHealth * 100}
              className="h-1"
            />
            <p
              className="font-mono text-[9px] mt-1"
              style={{ color: C.dimText }}
            >
              Sensory Health: {Math.round(sensory.overallSensoryHealth * 100)}%
            </p>
          </div>
        </div>
        <div
          className="p-3 rounded"
          style={{ background: C.bgCard, border: `1px solid ${C.borderDim}` }}
        >
          <p className="font-mono text-[9px] mb-2" style={{ color: C.cyan }}>
            SPATIAL
          </p>
          <MetricRow
            label="Spatial Awareness"
            value={spatial.spatialAwarenessIndex}
            color={spatial.spatialAwarenessIndex > 0.5 ? C.green : C.yellow}
          />
          <MetricRow
            label="Movement Cost"
            value={spatial.movementCost}
            color={spatial.movementCost > 0.5 ? C.yellow : C.green}
          />
          <MetricRow
            label="Exposure Factor"
            value={spatial.exposureFactor}
            color={spatial.exposureFactor > 0.5 ? C.red : C.green}
          />
          <MetricRow
            label="Positional Uncertainty"
            value={spatial.positionalUncertainty}
            color={spatial.positionalUncertainty > 0.5 ? C.red : C.green}
            trend={spatial.positionalUncertainty > 0.5 ? "down" : "flat"}
          />
          <MetricRow
            label="→ Salience Weight"
            value={spatial.spatialToSalienceWeight}
          />
          <MetricRow
            label="Terrain Burden"
            value={spatial.terrainBurden}
            color={spatial.terrainBurden > 0.5 ? C.yellow : C.midText}
          />
          <div className="mt-2">
            <Progress
              value={spatial.overallSpatialHealth * 100}
              className="h-1"
            />
            <p
              className="font-mono text-[9px] mt-1"
              style={{ color: C.dimText }}
            >
              Spatial Health: {Math.round(spatial.overallSpatialHealth * 100)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MemoryPredictionSection({ snap }: { snap: SystemAnalyticsSnapshot }) {
  const coup = snap.couplingSnapshot;
  const em = snap.emergence;
  return (
    <div>
      <SectionTitle
        icon={<Activity size={14} />}
        title="Memory / Prediction / Learning"
      />
      <div className="grid grid-cols-2 gap-3">
        <div
          className="p-3 rounded"
          style={{ background: C.bgCard, border: `1px solid ${C.borderDim}` }}
        >
          <p className="font-mono text-[9px] mb-2" style={{ color: C.cyan }}>
            MEMORY
          </p>
          <MetricRow
            label="Episodic Traces"
            value={5}
            unit=" active"
            color={C.midText}
          />
          <MetricRow
            label="Failure Channels"
            value={`${coup.couplings.filter((c) => c.couplingId.includes("failure")).length}`}
            unit=" ch"
          />
          <MetricRow label="Route Adaptation" value={coup.routeAdaptation} />
          <MetricRow
            label="Persistence Usefulness"
            value={coup.persistenceUsefulnessScore}
            color={coup.persistenceUsefulnessScore > 0.4 ? C.green : C.yellow}
          />
        </div>
        <div
          className="p-3 rounded"
          style={{ background: C.bgCard, border: `1px solid ${C.borderDim}` }}
        >
          <p className="font-mono text-[9px] mb-2" style={{ color: C.cyan }}>
            PREDICTION / LEARNING
          </p>
          <MetricRow
            label="Prediction Revision Rate"
            value={em.predictionRevisionRate}
            color={em.predictionRevisionRate > 0.3 ? C.green : C.yellow}
          />
          <MetricRow
            label="Learning Effectiveness"
            value={coup.learningEffectiveness}
            color={coup.learningEffectiveness > 0.3 ? C.green : C.yellow}
          />
          <MetricRow label="Adaptation Rate" value={em.adaptationRate} />
          <MetricRow
            label="Causal Trace Depth"
            value={`${em.causalTraceDepth}`}
            unit=" layers"
            color={C.cyan}
          />
        </div>
      </div>
    </div>
  );
}

function CircuitMotifSection({ snap }: { snap: SystemAnalyticsSnapshot }) {
  const [motifs, setMotifs] = useState<Array<{ id: string; strength: number }>>(
    [],
  );
  const [pathways, setPathways] = useState<
    Array<{ id: string; strength: number }>
  >([]);

  useEffect(() => {
    import("../utils/circuitPlasticityModules").then(
      ({ globalMotifScorer, globalPathwayTracker }) => {
        const m = globalMotifScorer.getAll();
        const p = globalPathwayTracker
          .getAll()
          .sort((a, b) => b.strength - a.strength)
          .slice(0, 8);
        setMotifs(m.map((x) => ({ id: x.motifType, strength: x.strength })));
        setPathways(p.map((x) => ({ id: x.pathwayId, strength: x.strength })));
      },
    );
  }, []);

  return (
    <div>
      <SectionTitle
        icon={<Cpu size={14} />}
        title="Circuit / Motif Health"
        score={snap.emergence.policyDiversityIndex}
      />
      <div className="grid grid-cols-2 gap-3">
        <div
          className="p-3 rounded"
          style={{ background: C.bgCard, border: `1px solid ${C.borderDim}` }}
        >
          <p className="font-mono text-[9px] mb-2" style={{ color: C.cyan }}>
            MOTIF REGISTRY ({motifs.length} motifs)
          </p>
          {motifs.length === 0 ? (
            <p className="font-mono text-[9px]" style={{ color: C.dimText }}>
              No motifs registered yet — step the runtime.
            </p>
          ) : (
            motifs.map((m) => (
              <div key={m.id} className="flex items-center gap-2 py-0.5">
                <div
                  className="w-20 h-1.5 rounded-full"
                  style={{ background: C.borderDim }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, m.strength * 100)}%`,
                      background: m.strength > 0.5 ? C.green : C.yellow,
                    }}
                  />
                </div>
                <span
                  className="font-mono text-[9px]"
                  style={{ color: C.midText }}
                >
                  {m.id}
                </span>
                <span
                  className="font-mono text-[9px] font-bold"
                  style={{
                    color: m.strength > 0.5 ? C.green : C.yellow,
                  }}
                >
                  {(m.strength * 100).toFixed(0)}%
                </span>
              </div>
            ))
          )}
        </div>
        <div
          className="p-3 rounded"
          style={{ background: C.bgCard, border: `1px solid ${C.borderDim}` }}
        >
          <p className="font-mono text-[9px] mb-2" style={{ color: C.cyan }}>
            PATHWAY STRENGTH (top 8)
          </p>
          {pathways.length === 0 ? (
            <p className="font-mono text-[9px]" style={{ color: C.dimText }}>
              No pathways tracked yet.
            </p>
          ) : (
            pathways.map((p) => (
              <div key={p.id} className="flex items-center gap-2 py-0.5">
                <div
                  className="w-24 h-1.5 rounded-full"
                  style={{ background: C.borderDim }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, p.strength * 100)}%`,
                      background: C.cyan,
                    }}
                  />
                </div>
                <span
                  className="font-mono text-[9px] truncate max-w-[100px]"
                  style={{ color: C.midText }}
                >
                  {p.id}
                </span>
              </div>
            ))
          )}
          <Separator className="my-2" style={{ background: C.borderDim }} />
          <MetricRow
            label="Cross-Layer Influences"
            value={`${snap.emergence.crossLayerInfluenceCount}`}
            unit=" ch"
            color={C.cyan}
          />
          <MetricRow
            label="Policy Diversity"
            value={snap.emergence.policyDiversityIndex}
            color={
              snap.emergence.policyDiversityIndex > 0.5 ? C.green : C.yellow
            }
          />
        </div>
      </div>
    </div>
  );
}

function SparseEfficiencySection({ snap }: { snap: SystemAnalyticsSnapshot }) {
  const s = snap.sparseMetrics;
  const localRatio = s.sparseActivationRatio;
  const broadRatio = 1 - localRatio;
  return (
    <div>
      <SectionTitle
        icon={<Zap size={14} />}
        title="Sparse Efficiency"
        score={localRatio}
      />
      <div className="grid grid-cols-2 gap-3">
        <div
          className="p-3 rounded"
          style={{ background: C.bgCard, border: `1px solid ${C.borderDim}` }}
        >
          <p className="font-mono text-[9px] mb-2" style={{ color: C.cyan }}>
            COMPUTE METRICS
          </p>
          <div className="mb-2">
            <p
              className="font-mono text-[9px] mb-1"
              style={{ color: C.dimText }}
            >
              Compute Pressure
            </p>
            <Progress value={s.computePressure * 100} className="h-2" />
            <p
              className="font-mono text-[9px] mt-0.5"
              style={{ color: s.computePressure > 0.6 ? C.red : C.green }}
            >
              {(s.computePressure * 100).toFixed(1)}%
            </p>
          </div>
          <MetricRow
            label="Active Region Fraction"
            value={s.activeRegionFraction}
            color={s.activeRegionFraction < 0.3 ? C.green : C.yellow}
          />
          <MetricRow
            label="Escalation Count"
            value={`${s.overloadEscalationCount}`}
            unit=" times"
            color={s.overloadEscalationCount > 5 ? C.yellow : C.green}
          />
          <MetricRow
            label="Compute/Decision"
            value={`${s.computePerDecision.toFixed(1)}`}
            unit=" units"
          />
        </div>
        <div
          className="p-3 rounded"
          style={{ background: C.bgCard, border: `1px solid ${C.borderDim}` }}
        >
          <p className="font-mono text-[9px] mb-2" style={{ color: C.cyan }}>
            UPDATE RATIO
          </p>
          <div className="flex items-end gap-2 h-16 mb-2">
            <div className="flex flex-col items-center flex-1">
              <div
                className="w-full rounded-t"
                style={{
                  height: `${Math.max(4, localRatio * 56)}px`,
                  background: C.green,
                  opacity: 0.8,
                }}
              />
              <p
                className="font-mono text-[8px] mt-1"
                style={{ color: C.dimText }}
              >
                LOCAL
              </p>
              <p
                className="font-mono text-[9px] font-bold"
                style={{ color: C.green }}
              >
                {(localRatio * 100).toFixed(0)}%
              </p>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div
                className="w-full rounded-t"
                style={{
                  height: `${Math.max(4, broadRatio * 56)}px`,
                  background: C.yellow,
                  opacity: 0.8,
                }}
              />
              <p
                className="font-mono text-[8px] mt-1"
                style={{ color: C.dimText }}
              >
                BROAD
              </p>
              <p
                className="font-mono text-[9px] font-bold"
                style={{ color: C.yellow }}
              >
                {(broadRatio * 100).toFixed(0)}%
              </p>
            </div>
          </div>
          <MetricRow
            label="Compute/Useful Behavior"
            value={`${s.computePerUsefulBehavior.toFixed(1)}`}
            unit=" u"
          />
        </div>
      </div>
    </div>
  );
}

function LiveCompatibilitySection({ snap }: { snap: SystemAnalyticsSnapshot }) {
  const stats = snap.integrationStats;
  const [sessions, setSessions] = useState<
    Array<{
      sessionId: string;
      adapterId: string;
      startedAt: number;
      callCount: number;
    }>
  >([]);

  useEffect(() => {
    import("../utils/integrationContractLayer").then(
      ({ globalSessionManager }) => {
        setSessions(globalSessionManager.getActive());
      },
    );
  }, []);

  const battleSession = sessions.find((s) =>
    s.adapterId.toLowerCase().includes("battle"),
  );
  const warSession = sessions.find((s) =>
    s.adapterId.toLowerCase().includes("war"),
  );

  return (
    <div>
      <SectionTitle
        icon={<Link size={14} />}
        title="Live Deployment Compatibility"
      />
      <div className="grid grid-cols-2 gap-3 mb-3">
        {[
          {
            label: "Emergent BattleOps",
            session: battleSession,
            color: C.cyan,
          },
          {
            label: "Emergent WarCommandOps",
            session: warSession,
            color: C.purple,
          },
        ].map(({ label, session, color }) => (
          <div
            key={label}
            className="p-3 rounded"
            style={{
              background: C.bgCard,
              border: `1px solid ${session ? `${color}55` : C.borderDim}`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: session ? color : C.borderDim,
                  boxShadow: session ? `0 0 6px ${color}` : "none",
                }}
              />
              <p
                className="font-mono text-[10px] font-bold"
                style={{ color: session ? color : C.dimText }}
              >
                {label}
              </p>
            </div>
            {session ? (
              <>
                <MetricRow
                  label="Session ID"
                  value={`${session.sessionId.slice(0, 12)}...`}
                  color={C.midText}
                />
                <MetricRow
                  label="Calls Made"
                  value={`${session.callCount}`}
                  unit=" calls"
                  color={color}
                />
                <MetricRow
                  label="Active Since"
                  value={`${Math.round((Date.now() - session.startedAt) / 1000)}`}
                  unit=" s ago"
                />
              </>
            ) : (
              <p className="font-mono text-[9px]" style={{ color: C.dimText }}>
                No active session — use Live Binding tab to connect.
              </p>
            )}
          </div>
        ))}
      </div>
      <div
        className="p-3 rounded"
        style={{ background: C.bgCard, border: `1px solid ${C.borderDim}` }}
      >
        <p className="font-mono text-[9px] mb-2" style={{ color: C.dimText }}>
          CONTRACT STATS
        </p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { val: stats.registeredAdapters, label: "ADAPTERS", color: C.cyan },
            {
              val: stats.activeSessions,
              label: "SESSIONS",
              color: stats.activeSessions > 0 ? C.green : C.dimText,
            },
            { val: stats.ingestTotal, label: "INGESTED", color: C.midText },
            {
              val: stats.ingestValid,
              label: "VALID",
              color:
                stats.ingestTotal > 0 && stats.ingestValid === stats.ingestTotal
                  ? C.green
                  : C.yellow,
            },
          ].map(({ val, label, color }) => (
            <div key={label} className="text-center">
              <p className="font-mono text-lg font-bold" style={{ color }}>
                {val}
              </p>
              <p className="font-mono text-[8px]" style={{ color: C.dimText }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const BATTLEOPS_BINDING: Record<string, string> = {
  soldier_entity: "individual_agent",
  medic_entity: "medic",
  recon_entity: "recon",
  support_gunner_entity: "support_gunner",
  rifleman_entity: "rifleman",
  marksman_entity: "marksman",
  breacher_entity: "breacher",
  squad_leader_entity: "squad_leader",
  regional_controller: "regional_command",
  faction_controller: "faction_command",
};

const WARCOMMANDOPS_BINDING: Record<string, string> = {
  theater_command_node: "theater_command",
  operational_command_node: "operational_command",
  regional_command_node: "regional_command",
  squad_leader_entity: "squad_leader",
  individual_agent_entity: "individual_agent",
  faction_controller: "faction_command",
};

function BindingValidationSection() {
  const [bindingResults, setBindingResults] = useState<
    Array<{
      adapter: string;
      valid: boolean;
      errors: string[];
      mappingCount: number;
    }>
  >([]);

  useEffect(() => {
    import("../utils/integrationContractLayer").then(
      ({ globalBindingValidator }) => {
        const b = globalBindingValidator.validateBindingMap(BATTLEOPS_BINDING);
        const w = globalBindingValidator.validateBindingMap(
          WARCOMMANDOPS_BINDING,
        );
        setBindingResults([
          {
            adapter: "Emergent BattleOps",
            valid: b.valid,
            errors: b.errors,
            mappingCount: Object.keys(BATTLEOPS_BINDING).length,
          },
          {
            adapter: "Emergent WarCommandOps",
            valid: w.valid,
            errors: w.errors,
            mappingCount: Object.keys(WARCOMMANDOPS_BINDING).length,
          },
        ]);
      },
    );
  }, []);

  return (
    <div>
      <SectionTitle
        icon={<Shield size={14} />}
        title="Binding Validation Status"
      />
      {bindingResults.map((r) => (
        <div
          key={r.adapter}
          className="p-3 rounded mb-2"
          style={{
            background: C.bgCard,
            border: `1px solid ${r.valid ? `${C.green}55` : `${C.red}55`}`,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className="font-mono text-[10px] font-bold"
              style={{ color: r.valid ? C.green : C.red }}
            >
              {r.adapter}
            </span>
            <Badge
              className="font-mono text-[8px]"
              style={{
                background: r.valid ? `${C.green}22` : `${C.red}22`,
                color: r.valid ? C.green : C.red,
                border: `1px solid ${r.valid ? `${C.green}55` : `${C.red}55`}`,
              }}
            >
              {r.valid ? "VALID" : "INVALID"}
            </Badge>
          </div>
          <p className="font-mono text-[9px]" style={{ color: C.dimText }}>
            {r.mappingCount} entity mappings
          </p>
          {r.errors.map((e) => (
            <p
              key={e}
              className="font-mono text-[9px]"
              style={{ color: C.red }}
            >
              ⚠ {e}
            </p>
          ))}
        </div>
      ))}
      {bindingResults.length === 0 && (
        <p className="font-mono text-[9px]" style={{ color: C.dimText }}>
          Loading binding validation...
        </p>
      )}
    </div>
  );
}

function TraceReturnSection({ snap }: { snap: SystemAnalyticsSnapshot }) {
  const events = snap.integrationStats.recentLog;
  return (
    <div>
      <SectionTitle
        icon={<RefreshCw size={14} />}
        title="Trace Return Status"
      />
      <div
        className="p-3 rounded"
        style={{ background: C.bgCard, border: `1px solid ${C.borderDim}` }}
      >
        <p className="font-mono text-[9px] mb-2" style={{ color: C.dimText }}>
          LAST 10 INGEST EVENTS
        </p>
        {events.length === 0 ? (
          <p className="font-mono text-[9px]" style={{ color: C.dimText }}>
            No ingest events yet. Use the Live Binding tab to send traces.
          </p>
        ) : (
          events.map((e, i) => (
            <div
              key={`${e.ts}-${i}`}
              className="flex items-center gap-2 py-1"
              style={{ borderBottom: `1px solid ${C.borderDim}` }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: e.valid ? C.green : C.red }}
              />
              <span
                className="font-mono text-[9px] w-36 truncate"
                style={{ color: C.midText }}
              >
                {e.type}
              </span>
              <span
                className="font-mono text-[9px]"
                style={{ color: C.dimText }}
              >
                {e.sourceId.slice(0, 16)}
              </span>
              <span
                className="font-mono text-[9px] ml-auto"
                style={{ color: e.valid ? C.green : C.red }}
              >
                {e.valid ? "ACCEPTED" : "REJECTED"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function BenchmarkSection({ snap }: { snap: SystemAnalyticsSnapshot }) {
  const [baseline] = useState(() => getSystemAnalyticsSnapshot(0.1, 0.1, 0.1));

  const comparisons = [
    {
      label: "Cardio Health",
      baseline: baseline.cardio.overallCardioHealth,
      current: snap.cardio.overallCardioHealth,
    },
    {
      label: "ANS Balance",
      baseline: baseline.ans.autonomicBalance,
      current: snap.ans.autonomicBalance,
    },
    {
      label: "Emergence Score",
      baseline: baseline.emergence.overallEmergenceScore,
      current: snap.emergence.overallEmergenceScore,
    },
    {
      label: "Policy Diversity",
      baseline: baseline.emergence.policyDiversityIndex,
      current: snap.emergence.policyDiversityIndex,
    },
    {
      label: "Sensory Health",
      baseline: baseline.sensory.overallSensoryHealth,
      current: snap.sensory.overallSensoryHealth,
    },
    {
      label: "HRV (norm)",
      baseline: baseline.cardio.hrvProxy / 100,
      current: snap.cardio.hrvProxy / 100,
    },
  ];

  return (
    <div>
      <SectionTitle
        icon={<BarChart2 size={14} />}
        title="Benchmark Comparison"
      />
      <p className="font-mono text-[9px] mb-3" style={{ color: C.dimText }}>
        Baseline (stress=0.1) vs current runtime state
      </p>
      {comparisons.map((c) => {
        const delta = c.current - c.baseline;
        const improved = delta > 0.02;
        const degraded = delta < -0.02;
        return (
          <div
            key={c.label}
            className="flex items-center gap-2 py-1.5"
            style={{ borderBottom: `1px solid ${C.borderDim}` }}
          >
            <span
              className="font-mono text-[10px] w-36"
              style={{ color: C.dimText }}
            >
              {c.label}
            </span>
            <div
              className="flex-1 h-1.5 rounded-full relative"
              style={{ background: C.borderDim }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${c.baseline * 100}%`,
                  background: C.dimText,
                  opacity: 0.4,
                }}
              />
              <div
                className="h-full rounded-full absolute top-0 left-0"
                style={{
                  width: `${Math.min(100, c.current * 100)}%`,
                  background: improved ? C.green : degraded ? C.red : C.cyan,
                  opacity: 0.8,
                }}
              />
            </div>
            <span
              className="font-mono text-[9px] w-8 text-right"
              style={{ color: C.midText }}
            >
              {(c.baseline * 100).toFixed(0)}%
            </span>
            <span
              className="font-mono text-[9px] w-8 text-right"
              style={{
                color: improved ? C.green : degraded ? C.red : C.midText,
              }}
            >
              {(c.current * 100).toFixed(0)}%
            </span>
            <span
              className="font-mono text-[9px] w-12 text-right"
              style={{
                color: improved ? C.green : degraded ? C.red : C.dimText,
              }}
            >
              {delta >= 0 ? "+" : ""}
              {(delta * 100).toFixed(1)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

function AIReviewSection({ snap }: { snap: SystemAnalyticsSnapshot }) {
  const review = snap.review;
  const statusColor =
    review.systemStatus === "OPTIMAL"
      ? C.green
      : review.systemStatus === "DEGRADED"
        ? C.yellow
        : C.red;
  return (
    <div>
      <SectionTitle
        icon={<AlertTriangle size={14} />}
        title="AI Review / Optimization Recommendations"
        score={review.overallSystemScore}
      />
      <div
        className="flex items-center gap-3 mb-4 p-3 rounded"
        style={{
          background: C.bgCard,
          border: `1px solid ${statusColor}44`,
        }}
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{
            background: statusColor,
            boxShadow: `0 0 8px ${statusColor}`,
          }}
        />
        <div>
          <span
            className="font-mono text-[11px] font-bold"
            style={{ color: statusColor }}
          >
            {review.systemStatus}
          </span>
          <p className="font-mono text-[9px]" style={{ color: C.dimText }}>
            Lowest: {review.lowestCategory} (
            {(review.lowestScore * 100).toFixed(0)}%). Overall:{" "}
            {(review.overallSystemScore * 100).toFixed(0)}%
          </p>
        </div>
      </div>
      {review.topRecommendations.length === 0 ? (
        <p className="font-mono text-[9px]" style={{ color: C.green }}>
          ✓ All metrics within normal range. No critical recommendations.
        </p>
      ) : (
        review.topRecommendations.map((rec) => (
          <div
            key={rec.rank}
            className="p-3 rounded mb-2"
            style={{
              background: C.bgCard,
              border: `1px solid ${
                rec.impact > 0.6
                  ? `${C.red}55`
                  : rec.impact > 0.3
                    ? `${C.yellow}44`
                    : C.borderDim
              }`,
            }}
          >
            <div className="flex items-start justify-between mb-1">
              <span
                className="font-mono text-[10px] font-bold"
                style={{
                  color:
                    rec.impact > 0.6
                      ? C.red
                      : rec.impact > 0.3
                        ? C.yellow
                        : C.cyan,
                }}
              >
                #{rec.rank} [{rec.category}] {rec.title}
              </span>
              <Badge
                className="font-mono text-[8px] shrink-0 ml-2"
                style={{
                  background: "transparent",
                  color: C.dimText,
                  border: `1px solid ${C.borderDim}`,
                }}
              >
                Impact {(rec.impact * 100).toFixed(0)}%
              </Badge>
            </div>
            <p
              className="font-mono text-[9px] mb-1"
              style={{ color: C.dimText }}
            >
              Evidence: {rec.evidence}
            </p>
            <p className="font-mono text-[9px]" style={{ color: C.midText }}>
              → {rec.action}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

function ReadinessSection() {
  const [result, setResult] = useState<{
    score: number;
    passCount: number;
    total: number;
    blockers: string[];
  } | null>(null);
  const [running, setRunning] = useState(false);

  const runEval = async () => {
    setRunning(true);
    await new Promise((r) => setTimeout(r, 400));
    const res = evaluateGoLive();
    const passCount = res.conditions.filter((c) => c.status === "pass").length;
    const score = Math.round(res.score * 100);
    setResult({
      score: res.score,
      passCount,
      total: res.conditions.length,
      blockers: res.blockers,
    });
    createArtifact({
      artifact_type: "go_live_report",
      source_system: "core",
      title: "Go-Live Evaluation",
      summary: `${passCount}/${res.conditions.length} conditions passed · score ${score}%`,
      score,
      status: score >= 80 ? "pass" : score >= 50 ? "warn" : "fail",
      ai_review_summary:
        res.blockers.length > 0
          ? `Blockers detected: ${res.blockers.slice(0, 2).join("; ")}`
          : "All critical conditions passed.",
      tags: ["go-live", "readiness", "evaluation"],
      metadata: {
        passCount,
        total: res.conditions.length,
        blockers: res.blockers,
      },
      related_artifact_ids: [],
      version: "1.0.0",
    });
    setRunning(false);
  };

  const pct = result ? result.score : null;
  const clr =
    pct !== null
      ? pct > 0.8
        ? C.green
        : pct > 0.5
          ? C.yellow
          : C.red
      : C.dimText;

  return (
    <div>
      <SectionTitle
        icon={<CheckCircle2 size={14} />}
        title="Readiness / Go-Live"
      />
      <div className="flex gap-4 items-start mb-4">
        {result && <ScoreRing score={result.score} size={88} label="GO-LIVE" />}
        <div className="flex-1">
          <Button
            data-ocid="analytics.readiness.button"
            onClick={runEval}
            disabled={running}
            className="font-mono text-[9px] tracking-widest uppercase h-7 px-4 mb-2"
            style={{
              background: running ? "transparent" : `${C.cyan}22`,
              color: C.cyan,
              border: `1px solid ${C.cyan}55`,
            }}
          >
            {running ? "EVALUATING..." : "RUN EVALUATION"}
          </Button>
          {result && (
            <>
              <p className="font-mono text-[10px]" style={{ color: clr }}>
                {result.passCount}/{result.total} conditions pass
              </p>
              {result.blockers.length > 0 && (
                <div className="mt-2">
                  <p
                    className="font-mono text-[9px] mb-1"
                    style={{ color: C.red }}
                  >
                    BLOCKERS:
                  </p>
                  {result.blockers.map((b) => (
                    <p
                      key={b}
                      className="font-mono text-[9px]"
                      style={{ color: C.red }}
                    >
                      • {b}
                    </p>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {result && (
        <div
          className="p-2 rounded"
          style={{
            background: `${clr}11`,
            border: `1px solid ${clr}44`,
          }}
        >
          <p className="font-mono text-[10px] font-bold" style={{ color: clr }}>
            {result.score > 0.9
              ? "✓ GO-LIVE COMPLETE"
              : result.score > 0.7
                ? "⚠ NEAR READY — RESOLVE BLOCKERS"
                : "✗ NOT READY"}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main AnalyticsTab ────────────────────────────────────────────────────────
export default function AnalyticsTab() {
  const [activeSection, setActiveSection] = useState<SectionId>("brain_health");
  const [snap, setSnap] = useState<SystemAnalyticsSnapshot>(() =>
    getSystemAnalyticsSnapshot(0.3, 0.2, 0.2),
  );
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { data: canon } = useCanonicalState();
  const { data: fearState } = useFearMissionState();

  useEffect(() => {
    if (!autoRefresh) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      // Drive analytics from real organism state when available
      const stress =
        fearState?.fearLevel ?? 0.25 + 0.2 * Math.sin(Date.now() / 14300);
      const fatigue = canon
        ? Math.max(0, 1 - canon.coh) * 0.6
        : 0.15 + 0.15 * Math.sin(Date.now() / 25000);
      const exertion = canon?.ar ?? 0.2 + 0.15 * Math.cos(Date.now() / 20000);
      setSnap(getSystemAnalyticsSnapshot(stress, fatigue, exertion));
      setLastUpdated(Date.now());
    }, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh, fearState, canon]);

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const sectionContent: Record<SectionId, React.ReactNode> = {
    brain_health: <BrainHealthSection snap={snap} />,
    regulation: <RegulationSection snap={snap} />,
    sensory_spatial: <SensorySpatialSection snap={snap} />,
    memory_prediction: <MemoryPredictionSection snap={snap} />,
    circuit_motif: <CircuitMotifSection snap={snap} />,
    sparse_efficiency: <SparseEfficiencySection snap={snap} />,
    live_compatibility: <LiveCompatibilitySection snap={snap} />,
    binding_validation: <BindingValidationSection />,
    trace_return: <TraceReturnSection snap={snap} />,
    benchmark: <BenchmarkSection snap={snap} />,
    ai_review: <AIReviewSection snap={snap} />,
    readiness: <ReadinessSection />,
    behavioral_economics: <BehavioralEconomicsPanel />,
    rl_engine: <RLEnginePanel />,
    sovereign_wealth: <SovereignWealthPanel />,
    cit_benchmarks: <CITBenchmarksSection />,
  };

  return (
    <div className="flex h-full overflow-hidden" style={{ background: C.bg }}>
      {/* Sidebar */}
      <div
        className="w-48 shrink-0 flex flex-col border-r overflow-y-auto"
        style={{ background: C.bgSidebar, borderColor: C.border }}
      >
        <div className="p-2 border-b" style={{ borderColor: C.border }}>
          <p
            className="font-mono text-[8px] tracking-widest uppercase"
            style={{ color: C.dimText }}
          >
            ANALYTICS CONSOLE
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: autoRefresh ? C.green : C.borderDim,
                animation: autoRefresh ? "pulse 2s infinite" : "none",
              }}
            />
            <span
              className="font-mono text-[8px]"
              style={{ color: autoRefresh ? C.green : C.dimText }}
            >
              {autoRefresh ? "LIVE" : "PAUSED"}
            </span>
            <button
              type="button"
              data-ocid="analytics.autorefresh.toggle"
              onClick={() => setAutoRefresh((v) => !v)}
              className="ml-auto font-mono text-[7px] px-1.5 py-0.5"
              style={{
                background: `${C.cyan}15`,
                color: C.cyan,
                border: `1px solid ${C.cyan}33`,
              }}
            >
              {autoRefresh ? "PAUSE" : "RESUME"}
            </button>
          </div>
          <p className="font-mono text-[7px] mt-1" style={{ color: C.dimText }}>
            {Math.round((now - lastUpdated) / 1000)}s ago
          </p>
        </div>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            data-ocid={`analytics.${s.id}.tab`}
            onClick={() => setActiveSection(s.id)}
            className="flex items-center gap-2 px-3 py-2 text-left transition-all"
            style={{
              background:
                activeSection === s.id ? `${C.cyan}15` : "transparent",
              borderLeft:
                activeSection === s.id
                  ? `2px solid ${C.cyan}`
                  : "2px solid transparent",
              color: activeSection === s.id ? C.cyan : C.dimText,
            }}
          >
            <span
              style={{
                color: activeSection === s.id ? C.cyan : "oklch(0.3 0.04 220)",
              }}
            >
              {s.icon}
            </span>
            <span className="font-mono text-[9px] leading-tight">
              {s.label}
            </span>
          </button>
        ))}
      </div>

      {/* Main content */}
      <ScrollArea className="flex-1">
        <div className="p-5" style={{ minWidth: 0 }}>
          {sectionContent[activeSection]}
        </div>
      </ScrollArea>
    </div>
  );
}
