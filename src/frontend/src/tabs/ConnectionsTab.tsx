import { useMemo } from "react";
import type {
  NeuralSimulationControls,
  NeuralSimulationState,
} from "../hooks/useNeuralSimulation";
import {
  createConnectionRegistry,
  getOptimizationRecommendations,
  updateConnectionWeights,
} from "../utils/connectionRegistry";
import type {
  CircuitMotif,
  Connection,
  OptimizationRecommendation,
} from "../utils/connectionRegistry";

type Neural = NeuralSimulationState & NeuralSimulationControls;

const BG = "oklch(0.06 0.01 265)";
const PANEL = "oklch(0.09 0.015 265)";
const BORDER = "oklch(0.18 0.05 255)";
const CYAN = "oklch(0.72 0.22 195)";
const GREEN = "oklch(0.68 0.28 140)";
const AMBER = "oklch(0.78 0.22 80)";
const RED = "oklch(0.72 0.22 25)";
const MUTED = "oklch(0.38 0.05 220)";
const DIM = "oklch(0.28 0.04 240)";
const GOLD = "oklch(0.78 0.22 80)";

// Circuit type color mapping (matches BrainVisualization)
const CIRCUIT_TYPE_COLORS: Record<string, string> = {
  motor: "#ff6b35",
  sensory: "#00d4ff",
  memory: "#a855f7",
  limbic: "#ec4899",
  regulatory: "#22c55e",
  callosal: "#fbbf24",
  ascending: "#c0d8ff",
  cognitive: "#3b82f6",
};

// Assign circuit type to registry connections by ID pattern
function inferCircuitType(id: string): string {
  const lower = id.toLowerCase();
  if (
    lower.includes("motor") ||
    lower.includes("cerebellum") ||
    lower.includes("basal") ||
    lower.includes("striatum")
  )
    return "motor";
  if (
    lower.includes("sensory") ||
    lower.includes("visual") ||
    lower.includes("auditory") ||
    lower.includes("thalamus")
  )
    return "sensory";
  if (
    lower.includes("hippocampus") ||
    lower.includes("memory") ||
    lower.includes("prediction") ||
    lower.includes("learning")
  )
    return "memory";
  if (
    lower.includes("amygdala") ||
    lower.includes("limbic") ||
    lower.includes("emotion") ||
    lower.includes("insula")
  )
    return "limbic";
  if (
    lower.includes("cingulate") ||
    lower.includes("regulation") ||
    lower.includes("body") ||
    lower.includes("cardio") ||
    lower.includes("ans")
  )
    return "regulatory";
  if (
    lower.includes("brainstem") ||
    lower.includes("arousal") ||
    lower.includes("locus") ||
    lower.includes("vta")
  )
    return "ascending";
  return "cognitive";
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="px-3 py-1.5 border-b shrink-0"
      style={{ borderColor: BORDER, background: "oklch(0.07 0.012 265)" }}
    >
      <span
        className="font-mono text-[9px] tracking-widest uppercase"
        style={{ color: MUTED }}
      >
        {children}
      </span>
    </div>
  );
}

function MiniBar({
  value,
  color,
  width = 80,
}: { value: number; color: string; width?: number }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width,
        height: 4,
        background: "oklch(0.14 0.03 255)",
        borderRadius: 2,
      }}
    >
      <div
        style={{
          width: `${value * 100}%`,
          height: "100%",
          background: color,
          borderRadius: 2,
          transition: "width 0.5s ease",
        }}
      />
    </div>
  );
}

function weightColor(v: number) {
  if (v > 0.75) return GREEN;
  if (v > 0.55) return CYAN;
  if (v > 0.4) return AMBER;
  return RED;
}

function actionColor(action: OptimizationRecommendation["action"]) {
  const map: Record<string, string> = {
    strengthen: GREEN,
    promote: CYAN,
    gate: AMBER,
    weaken: AMBER,
    prune: RED,
  };
  return map[action] ?? CYAN;
}

function ConnectionRow({ conn }: { conn: Connection }) {
  const wc = weightColor(conn.weight);
  const uc = weightColor(conn.usefulness);
  const circuitType = inferCircuitType(conn.id);
  const circuitColor =
    CIRCUIT_TYPE_COLORS[circuitType] ?? CIRCUIT_TYPE_COLORS.cognitive;

  return (
    <tr style={{ borderBottom: "1px solid oklch(0.13 0.03 255)" }}>
      <td className="py-1 px-2" style={{ maxWidth: 150, overflow: "hidden" }}>
        <div
          className="font-mono text-[9px] truncate"
          style={{ color: "oklch(0.7 0.1 200)" }}
        >
          {conn.id.replace(/_/g, " ")}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: circuitColor,
              flexShrink: 0,
            }}
          />
          <span
            className="font-mono text-[7px] uppercase tracking-wider"
            style={{ color: circuitColor, opacity: 0.85 }}
          >
            {circuitType}
          </span>
        </div>
      </td>
      <td className="py-1 px-2">
        <div className="flex items-center gap-1.5">
          <MiniBar value={conn.weight} color={wc} width={50} />
          <span className="font-mono text-[8px]" style={{ color: wc }}>
            {(conn.weight * 100).toFixed(0)}%
          </span>
        </div>
      </td>
      <td className="py-1 px-2">
        <div className="flex items-center gap-1.5">
          <MiniBar value={conn.usefulness} color={uc} width={44} />
          <span className="font-mono text-[8px]" style={{ color: uc }}>
            {(conn.usefulness * 100).toFixed(0)}%
          </span>
        </div>
      </td>
      <td className="py-1 px-2">
        <MiniBar
          value={conn.reliability}
          color={weightColor(conn.reliability)}
          width={36}
        />
      </td>
      <td
        className="py-1 px-2 font-mono text-[8px]"
        style={{ color: conn.failureAssociation > 0.25 ? RED : DIM }}
      >
        {(conn.failureAssociation * 100).toFixed(0)}%
      </td>
    </tr>
  );
}

function MotifRow({ motif }: { motif: CircuitMotif }) {
  return (
    <tr style={{ borderBottom: "1px solid oklch(0.13 0.03 255)" }}>
      <td
        className="py-1 px-2 font-mono text-[9px]"
        style={{ color: "oklch(0.65 0.1 200)" }}
      >
        {motif.label}
      </td>
      <td className="py-1 px-2">
        <div className="flex items-center gap-1">
          <MiniBar value={motif.activationFreq} color={CYAN} width={44} />
          <span className="font-mono text-[8px]" style={{ color: MUTED }}>
            {(motif.activationFreq * 100).toFixed(0)}%
          </span>
        </div>
      </td>
      <td className="py-1 px-2">
        <MiniBar value={motif.stabilityContribution} color={GREEN} width={40} />
      </td>
      <td className="py-1 px-2">
        <MiniBar
          value={motif.adaptationContribution}
          color={AMBER}
          width={40}
        />
      </td>
      <td className="py-1 px-2">
        <span
          className="font-mono text-[8px]"
          style={{ color: motif.collapseRisk > 0.2 ? RED : DIM }}
        >
          {(motif.collapseRisk * 100).toFixed(0)}%
        </span>
      </td>
    </tr>
  );
}

// Hemisphere connectivity derived from neural state
function useHemisphereConnectivity(neural: Neural) {
  return useMemo(() => {
    const stress = neural.sympatheticTone;
    const isRunning = neural.isRunning;
    const base = isRunning ? 0.62 : 0.48;

    // Simulate dynamic hemisphere scores based on neural state
    const leftInternalScore = Math.min(
      1,
      base + (1 - stress) * 0.22 + Math.sin(Date.now() * 0.0003) * 0.05,
    );
    const rightInternalScore = Math.min(
      1,
      base + stress * 0.18 + Math.cos(Date.now() * 0.0004) * 0.04,
    );
    const callosaScore = Math.min(
      1,
      ((leftInternalScore + rightInternalScore) / 2) * 0.92,
    );
    const coherence = Math.min(
      1,
      1 - Math.abs(leftInternalScore - rightInternalScore) * 1.5,
    );
    const dominance = leftInternalScore > rightInternalScore ? "LEFT" : "RIGHT";
    const asymmetryIndex = Math.abs(leftInternalScore - rightInternalScore);

    const topCrossPathways = [
      {
        label: "M1-L ↔ M1-R",
        type: "callosal",
        strength: 0.88 + stress * 0.06,
      },
      {
        label: "mPFC-L ↔ mPFC-R",
        type: "callosal",
        strength: 0.86 + (isRunning ? 0.08 : 0),
      },
      { label: "HIPP-L ↔ HIPP-R", type: "callosal", strength: 0.8 },
      { label: "V1-L ↔ V1-R", type: "callosal", strength: 0.82 },
      {
        label: "THAL-L ↔ THAL-R",
        type: "callosal",
        strength: 0.85 + stress * 0.04,
      },
    ];

    return {
      leftInternalScore,
      rightInternalScore,
      callosaScore,
      coherence,
      dominance,
      asymmetryIndex,
      topCrossPathways,
    };
  }, [neural.sympatheticTone, neural.isRunning]);
}

function HemisphereConnectivityPanel({ neural }: { neural: Neural }) {
  const hemi = useHemisphereConnectivity(neural);

  return (
    <div
      className="shrink-0 border-t"
      style={{ borderColor: BORDER }}
      data-ocid="hemisphere.panel"
    >
      <SectionHeader>Hemisphere Connectivity</SectionHeader>
      <div className="p-2 flex flex-col gap-2">
        {/* L vs R score */}
        <div className="grid grid-cols-2 gap-2">
          <div
            className="px-2 py-1.5 rounded border"
            style={{
              background: "oklch(0.09 0.02 250)",
              borderColor: "rgba(60,100,255,0.3)",
            }}
          >
            <div
              className="font-mono text-[7px] tracking-widest uppercase mb-1"
              style={{ color: "rgba(80,140,255,0.8)" }}
            >
              Left Hemisphere
            </div>
            <div className="flex items-center gap-1.5">
              <MiniBar
                value={hemi.leftInternalScore}
                color="#3b82f6"
                width={50}
              />
              <span
                className="font-mono text-[8px] font-bold"
                style={{ color: "#3b82f6" }}
              >
                {(hemi.leftInternalScore * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <div
            className="px-2 py-1.5 rounded border"
            style={{
              background: "oklch(0.09 0.02 250)",
              borderColor: "rgba(255,120,50,0.3)",
            }}
          >
            <div
              className="font-mono text-[7px] tracking-widest uppercase mb-1"
              style={{ color: "rgba(255,140,60,0.8)" }}
            >
              Right Hemisphere
            </div>
            <div className="flex items-center gap-1.5">
              <MiniBar
                value={hemi.rightInternalScore}
                color="#f97316"
                width={50}
              />
              <span
                className="font-mono text-[8px] font-bold"
                style={{ color: "#f97316" }}
              >
                {(hemi.rightInternalScore * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Callosal + coherence row */}
        <div className="grid grid-cols-3 gap-1.5">
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[7px]" style={{ color: MUTED }}>
              Corpus Callosum
            </span>
            <div className="flex items-center gap-1">
              <MiniBar value={hemi.callosaScore} color={GOLD} width={44} />
              <span
                className="font-mono text-[7px] font-bold"
                style={{ color: GOLD }}
              >
                {(hemi.callosaScore * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[7px]" style={{ color: MUTED }}>
              Coherence
            </span>
            <div className="flex items-center gap-1">
              <MiniBar value={hemi.coherence} color={GREEN} width={44} />
              <span
                className="font-mono text-[7px] font-bold"
                style={{ color: GREEN }}
              >
                {(hemi.coherence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[7px]" style={{ color: MUTED }}>
              Dominance
            </span>
            <span
              className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded text-center"
              style={{
                background:
                  hemi.dominance === "LEFT"
                    ? "rgba(60,100,255,0.2)"
                    : "rgba(255,120,50,0.2)",
                color: hemi.dominance === "LEFT" ? "#3b82f6" : "#f97316",
                border: `1px solid ${hemi.dominance === "LEFT" ? "rgba(60,100,255,0.4)" : "rgba(255,120,50,0.4)"}`,
              }}
            >
              {hemi.dominance}
            </span>
          </div>
        </div>

        {/* Asymmetry slider */}
        <div>
          <div className="flex justify-between mb-0.5">
            <span className="font-mono text-[7px]" style={{ color: MUTED }}>
              Asymmetry Index
            </span>
            <span
              className="font-mono text-[7px]"
              style={{ color: hemi.asymmetryIndex > 0.2 ? AMBER : GREEN }}
            >
              {hemi.asymmetryIndex.toFixed(3)}
            </span>
          </div>
          <div
            className="relative"
            style={{
              height: 6,
              background: "oklch(0.14 0.03 255)",
              borderRadius: 3,
            }}
          >
            {/* Center marker */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                width: 1,
                height: "100%",
                background: "rgba(255,255,255,0.2)",
              }}
            />
            {/* L side fill */}
            <div
              style={{
                position: "absolute",
                left: `${50 - hemi.leftInternalScore * 48}%`,
                width: `${hemi.leftInternalScore * 48}%`,
                height: "100%",
                background: "rgba(60,100,255,0.6)",
                borderRadius: "3px 0 0 3px",
              }}
            />
            {/* R side fill */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                width: `${hemi.rightInternalScore * 48}%`,
                height: "100%",
                background: "rgba(255,120,50,0.6)",
                borderRadius: "0 3px 3px 0",
              }}
            />
          </div>
          <div className="flex justify-between mt-0.5">
            <span
              className="font-mono text-[6px]"
              style={{ color: "rgba(80,140,255,0.6)" }}
            >
              L
            </span>
            <span
              className="font-mono text-[6px]"
              style={{ color: "rgba(255,140,60,0.6)" }}
            >
              R
            </span>
          </div>
        </div>

        {/* Top cross-hemisphere pathways */}
        <div>
          <div
            className="font-mono text-[7px] tracking-widest uppercase mb-1"
            style={{ color: DIM }}
          >
            Top Cross-Hemisphere Pathways
          </div>
          <div className="flex flex-col gap-0.5">
            {hemi.topCrossPathways.map((p, i) => (
              <div
                key={p.label}
                className="flex items-center gap-1.5"
                data-ocid={`hemisphere.item.${i + 1}`}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: GOLD,
                    flexShrink: 0,
                  }}
                />
                <span
                  className="font-mono text-[8px] flex-1"
                  style={{ color: "oklch(0.65 0.1 200)" }}
                >
                  {p.label}
                </span>
                <MiniBar value={p.strength} color={GOLD} width={48} />
                <span className="font-mono text-[7px]" style={{ color: GOLD }}>
                  {(p.strength * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConnectionsTab({ neural }: { neural: Neural }) {
  const registry = useMemo(() => {
    const r = createConnectionRegistry();
    return updateConnectionWeights(r, {
      stressLoad: neural.sympatheticTone,
      sympatheticTone: neural.sympatheticTone,
      isRunning: neural.isRunning,
    });
  }, [neural.sympatheticTone, neural.isRunning]);

  const recs = useMemo(
    () => getOptimizationRecommendations(registry),
    [registry],
  );

  // Computed coupling pairs from live neural state
  const couplingPairs = useMemo(() => {
    const s = neural.sympatheticTone;
    const isR = neural.isRunning;
    return [
      {
        a: "Body-State",
        b: "Salience",
        strength: Math.min(1, 0.55 + s * 0.25),
        type: "regulatory",
      },
      {
        a: "Cardio/ANS",
        b: "Threshold",
        strength: Math.min(1, 0.49 + s * 0.32),
        type: "regulatory",
      },
      {
        a: "Regulation",
        b: "Policy",
        strength: Math.min(1, 0.62 + (isR ? 0.12 : 0)),
        type: "regulatory",
      },
      {
        a: "Memory",
        b: "Salience",
        strength: Math.min(1, 0.63 + (isR ? 0.1 : 0)),
        type: "memory",
      },
      {
        a: "PredErr",
        b: "Learning",
        strength: Math.min(1, 0.79 + (isR ? 0.08 : 0)),
        type: "ascending",
      },
      {
        a: "Salience",
        b: "WorkMem",
        strength: Math.min(1, 0.74 + (isR ? 0.1 : 0)),
        type: "cognitive",
      },
    ];
  }, [neural.sympatheticTone, neural.isRunning]);

  return (
    <div className="h-full flex overflow-hidden" style={{ background: BG }}>
      {/* Left: Connection class table */}
      <section
        className="flex flex-col border-r"
        style={{ flex: "0 0 42%", overflow: "hidden", borderColor: BORDER }}
      >
        <SectionHeader>
          Connection Classes · {registry.connections.length} Pathways
        </SectionHeader>
        <div className="flex-1 overflow-y-auto min-h-0">
          <table className="w-full border-collapse">
            <thead>
              <tr
                style={{
                  background: "oklch(0.08 0.012 265)",
                  borderBottom: `1px solid ${BORDER}`,
                }}
              >
                {["Connection / Type", "Weight", "Useful", "Rel.", "Fail"].map(
                  (h) => (
                    <th
                      key={h}
                      className="py-1 px-2 text-left font-mono text-[7px] tracking-widest uppercase"
                      style={{ color: DIM }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {registry.connections.map((c) => (
                <ConnectionRow
                  key={c.id}
                  conn={c}
                  data-ocid={"connections.row"}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Cross-layer coupling — live values */}
        <div className="shrink-0 border-t" style={{ borderColor: BORDER }}>
          <SectionHeader>Cross-Layer Coupling · Live</SectionHeader>
          <div className="p-2 grid grid-cols-2 gap-1">
            {couplingPairs.map((pair) => {
              const col = CIRCUIT_TYPE_COLORS[pair.type] ?? CYAN;
              return (
                <div
                  key={`${pair.a}-${pair.b}`}
                  className="flex items-center gap-2 px-2 py-1 rounded"
                  style={{
                    background: PANEL,
                    borderLeft: `2px solid ${col}50`,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-mono text-[8px]"
                      style={{ color: "oklch(0.6 0.1 200)" }}
                    >
                      {pair.a} → {pair.b}
                    </div>
                    <MiniBar value={pair.strength} color={col} width={56} />
                  </div>
                  <span
                    className="font-mono text-[7px] font-bold"
                    style={{ color: pair.strength < 0.55 ? AMBER : GREEN }}
                  >
                    {pair.strength < 0.55 ? "WEAK" : "OK"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hemisphere connectivity */}
        <HemisphereConnectivityPanel neural={neural} />
      </section>

      {/* Right: Motifs + Recommendations */}
      <section
        className="flex flex-col"
        style={{ flex: 1, overflow: "hidden" }}
      >
        <SectionHeader>
          Circuit Motif Registry · {registry.motifs.length} Motifs
        </SectionHeader>
        <div
          style={{
            flex: "0 0 auto",
            overflow: "hidden",
            maxHeight: "38%",
            overflowY: "auto",
          }}
        >
          <table className="w-full border-collapse">
            <thead>
              <tr
                style={{
                  background: "oklch(0.08 0.012 265)",
                  borderBottom: `1px solid ${BORDER}`,
                }}
              >
                {["Motif", "Freq", "Stab", "Adapt", "Risk"].map((h) => (
                  <th
                    key={h}
                    className="py-1 px-2 text-left font-mono text-[8px] tracking-widest uppercase"
                    style={{ color: DIM }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {registry.motifs.map((m) => (
                <MotifRow key={m.id} motif={m} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Optimization Recommendations */}
        <div
          className="flex flex-col border-t"
          style={{ borderColor: BORDER, flex: 1, overflow: "hidden" }}
        >
          <SectionHeader>
            Optimization Engine · Top Recommendations
          </SectionHeader>
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
            {recs.length === 0 && (
              <div
                data-ocid="connections.empty_state"
                className="p-4 text-center font-mono text-[9px]"
                style={{ color: DIM }}
              >
                No recommendations — system within bounds
              </div>
            )}
            {recs.map((rec, i) => (
              <div
                key={rec.connectionId}
                data-ocid={`connections.item.${i + 1}`}
                className="px-3 py-2 border flex flex-col gap-0.5"
                style={{
                  background: PANEL,
                  borderColor: `${actionColor(rec.action)}40`,
                  borderLeft: `2px solid ${actionColor(rec.action)}`,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="font-mono text-[9px]"
                    style={{ color: "oklch(0.65 0.1 200)" }}
                  >
                    {rec.connectionId.replace(/_/g, " ")}
                  </span>
                  <span
                    className="font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5"
                    style={{
                      background: `${actionColor(rec.action)}20`,
                      color: actionColor(rec.action),
                      border: `1px solid ${actionColor(rec.action)}40`,
                    }}
                  >
                    {rec.action}
                  </span>
                </div>
                <span className="font-mono text-[8px]" style={{ color: MUTED }}>
                  {rec.reason}
                </span>
                <div className="mt-0.5">
                  <MiniBar
                    value={rec.priority}
                    color={actionColor(rec.action)}
                    width={120}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
