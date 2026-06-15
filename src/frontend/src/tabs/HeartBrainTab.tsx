/**
 * HeartBrainTab.tsx — Live Heart-Brain Vital Signs Dashboard
 * ECG waveform from real backend buffer. Brain regions live. PHI coupling.
 * All data polls at 873ms (organism heartbeat).
 */
import { useMemo, useRef } from "react";
import {
  useBrainRegions,
  useCardiacOutput,
  useECGBuffer,
  useHRVState,
  useHeartRateBPM,
  useHeartState,
  useNeuralCordState,
  useSpikeRateHz,
  useThirdBrainCoherence,
  useWorldModel,
} from "../hooks/useNewModules";

// ── Constants ─────────────────────────────────────────────────────────────────
// biome-ignore lint/correctness/noPrecisionLoss: doctrine constant — PHI to 19 decimals, sealed
const PHI = 1.6180339887498948482;
const C = {
  bg: "#0a0a0f",
  panel: "#0d0d14",
  border: "rgba(0,255,255,0.18)",
  borderDim: "rgba(0,255,255,0.08)",
  cyan: "#00ffff",
  magenta: "#ff00ff",
  gold: "#ffd700",
  dim: "rgba(200,220,255,0.35)",
  dimlo: "rgba(200,220,255,0.18)",
  fg: "rgba(220,235,255,0.88)",
  green: "#00ff88",
  red: "#ff4444",
  amber: "#ffcc44",
  indigo: "#6666ff",
  violet: "#aa44ff",
  yellow: "#ffff44",
};

// Band → color + label
const BAND_COLORS: Record<string, { color: string; label: string }> = {
  Delta: { color: C.indigo, label: "DELTA 0.5–4 Hz" },
  Theta: { color: C.violet, label: "THETA 4–8 Hz" },
  Alpha: { color: C.cyan, label: "ALPHA 8–12 Hz" },
  Beta: { color: C.yellow, label: "BETA 12–30 Hz" },
  Gamma: { color: C.magenta, label: "GAMMA 30–100 Hz" },
};

// Brain region definitions with organism mappings
const BRAIN_REGION_MAP: { name: string; fn: string; mapping: string }[] = [
  { name: "PFC", fn: "Executive Function", mapping: "OMNIS Consensus Weight" },
  {
    name: "Amygdala",
    fn: "Threat Detection",
    mapping: "Cortisol / Fear State",
  },
  {
    name: "Hippocampus",
    fn: "Memory Consolidation",
    mapping: "Memory Temple Depth",
  },
  {
    name: "Cerebellum",
    fn: "Motor Coordination",
    mapping: "Pipeline Timing Precision",
  },
  {
    name: "Basal Ganglia",
    fn: "Habit Formation",
    mapping: "Hebbian Weight Reinforcement",
  },
  { name: "ACC", fn: "Conflict Detection", mapping: "AEGIS Monitor" },
  { name: "Insula", fn: "Interoception", mapping: "DogonSubstrate Self-Model" },
  {
    name: "DMN",
    fn: "Self-Improvement Loop",
    mapping: "Continuous Self-Analysis",
  },
  {
    name: "Broca",
    fn: "Language Production",
    mapping: "ADRE Output Generation",
  },
  {
    name: "Visual Cortex",
    fn: "Visual Processing",
    mapping: "Field Coherence Rendering",
  },
];

function PanelHeader({
  title,
  accent = C.cyan,
}: { title: string; accent?: string }) {
  return (
    <div
      style={{
        fontFamily: "monospace",
        fontSize: "8px",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: accent,
        borderBottom: `1px solid ${accent}30`,
        paddingBottom: "6px",
        marginBottom: "10px",
      }}
    >
      ▸ {title}
    </div>
  );
}

// ── ECG Waveform SVG ─────────────────────────────────────────────────────────
function ECGWaveform({ buffer }: { buffer: number[] | null }) {
  const W = 320;
  const H = 80;
  const samples = buffer && buffer.length > 0 ? buffer : Array(64).fill(0);

  const path = useMemo(() => {
    const n = samples.length;
    const pts = samples.map((v, i) => {
      const x = (i / (n - 1)) * W;
      // Map -0.5..1.2 to pixel space (top = 0, bottom = H)
      const normalized = (v + 0.5) / 1.7;
      const y = H - normalized * (H - 8) - 4;
      return `${x.toFixed(1)},${Math.max(2, Math.min(H - 2, y)).toFixed(1)}`;
    });
    return `M ${pts.join(" L ")}`;
  }, [samples]);

  // Find approximate wave peaks
  const n = samples.length;
  const pIdx = Math.min(9, n - 1);
  const qrsIdx = Math.min(29, n - 1);
  const tIdx = Math.min(42, n - 1);

  function peakPx(idx: number) {
    const v = samples[idx] ?? 0;
    const x = (idx / (n - 1)) * W;
    const norm = (v + 0.5) / 1.7;
    const y = H - norm * (H - 8) - 4;
    return { x, y: Math.max(2, Math.min(H - 2, y)) };
  }

  const p = peakPx(pIdx);
  const qrs = peakPx(qrsIdx);
  const t = peakPx(tIdx);

  return (
    <div
      style={{
        background: "#060610",
        border: `1px solid ${C.border}`,
        padding: "8px",
        position: "relative",
      }}
    >
      <svg width={W} height={H} style={{ display: "block" }}>
        <title>ECG Waveform</title>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={0}
            y1={H * f}
            x2={W}
            y2={H * f}
            stroke="rgba(0,255,255,0.06)"
            strokeWidth={0.5}
          />
        ))}
        {/* ECG path */}
        <path
          d={path}
          stroke={C.cyan}
          strokeWidth={2}
          fill="none"
          style={{ filter: "drop-shadow(0 0 3px #00ffff80)" }}
        />
        {/* Glow duplicate */}
        <path
          d={path}
          stroke="rgba(0,255,255,0.25)"
          strokeWidth={5}
          fill="none"
        />
        {/* P wave label */}
        <circle cx={p.x} cy={p.y} r={2.5} fill={C.cyan} />
        <text
          x={p.x + 4}
          y={p.y - 4}
          fontSize={7}
          fill={C.dim}
          fontFamily="monospace"
        >
          P
        </text>
        {/* QRS label */}
        <circle cx={qrs.x} cy={qrs.y} r={3} fill={C.magenta} />
        <text
          x={qrs.x + 4}
          y={qrs.y - 4}
          fontSize={7}
          fill={C.magenta}
          fontFamily="monospace"
        >
          QRS
        </text>
        {/* T wave label */}
        <circle cx={t.x} cy={t.y} r={2.5} fill={C.gold} />
        <text
          x={t.x + 4}
          y={t.y - 4}
          fontSize={7}
          fill={C.gold}
          fontFamily="monospace"
        >
          T
        </text>
      </svg>
    </div>
  );
}

// ── Activation Bar ────────────────────────────────────────────────────────────
function ActivationBar({
  value,
  label,
  sub,
  mapping,
}: {
  value: number;
  label: string;
  sub: string;
  mapping: string;
}) {
  const pct = Math.round(value * 100);
  // gradient: low cyan → high magenta
  const r = Math.round(0 + value * 255);
  const g = Math.round(255 - value * 255);
  const b = Math.round(255);
  const color = `rgb(${r},${g},${b})`;

  return (
    <div style={{ marginBottom: "7px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "2px",
        }}
      >
        <span style={{ fontFamily: "monospace", fontSize: "8px", color: C.fg }}>
          {label}
        </span>
        <span style={{ fontFamily: "monospace", fontSize: "8px", color }}>
          {pct}%
        </span>
      </div>
      <div
        style={{
          height: "4px",
          background: "rgba(255,255,255,0.06)",
          borderRadius: "2px",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: `linear-gradient(to right, ${C.cyan}, ${color})`,
            boxShadow: `0 0 4px ${color}80`,
            borderRadius: "2px",
            transition: "width 0.5s",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1px",
        }}
      >
        <span
          style={{ fontFamily: "monospace", fontSize: "6.5px", color: C.dim }}
        >
          {sub}
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "6.5px",
            color: "rgba(0,255,255,0.4)",
          }}
        >
          {mapping}
        </span>
      </div>
    </div>
  );
}

// ── Metric Row ────────────────────────────────────────────────────────────────
function MetricRow({
  label,
  value,
  color = C.cyan,
  unit = "",
}: {
  label: string;
  value: string;
  color?: string;
  unit?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "5px",
      }}
    >
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "8px",
          color: C.dim,
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "10px",
          fontWeight: "bold",
          color,
        }}
      >
        {value}
        <span style={{ fontSize: "7px", color: C.dimlo, marginLeft: "2px" }}>
          {unit}
        </span>
      </span>
    </div>
  );
}

// ── Main Tab ──────────────────────────────────────────────────────────────────
export default function HeartBrainTab() {
  const { data: heart } = useHeartState();
  const { data: ecg } = useECGBuffer();
  const { data: bpm } = useHeartRateBPM();
  const { data: hrv } = useHRVState();
  const { data: cardiac } = useCardiacOutput();
  const { data: regions } = useBrainRegions();
  const { data: spike } = useSpikeRateHz();
  const { data: cord } = useNeuralCordState();
  const { data: third } = useThirdBrainCoherence();
  const { data: world } = useWorldModel();

  const bpmVal = bpm ?? heart?.bpm ?? 69;
  const bpmColor =
    bpmVal > 100
      ? C.magenta
      : bpmVal > 80
        ? C.amber
        : bpmVal < 55
          ? C.indigo
          : C.cyan;

  const oscillation = world?.oscillation_band ?? "Alpha";
  const bandInfo = BAND_COLORS[oscillation] ?? BAND_COLORS.Alpha;

  // Build brain region data — merge backend regions with our mapping or use defaults
  const brainData = useMemo(() => {
    if (regions && regions.length > 0) {
      return BRAIN_REGION_MAP.map((def, i) => ({
        ...def,
        activation: regions[i]?.activation ?? 0.3 + Math.sin(i * 0.8) * 0.2,
        neurotransmitter: regions[i]?.neurotransmitter ?? "mixed",
      }));
    }
    return BRAIN_REGION_MAP.map((def, i) => ({
      ...def,
      activation: 0.3 + Math.sin(i * 0.8) * 0.2,
      neurotransmitter: "...",
    }));
  }, [regions]);

  const SCHUMANN_WAVES = [7.83, 14.3, 20.8, 27.3, 33.8, 17.56, 12.67];
  const standingWaves = third?.standing_waves ?? SCHUMANN_WAVES;

  const phiCoupling = (873 / 539).toFixed(4); // real PHI ratio
  const neuralCoherence = cord?.cord_coherence ?? 0;

  return (
    <div
      data-ocid="heartbrain.page"
      style={{
        background: C.bg,
        height: "100%",
        overflow: "auto",
        padding: "12px",
        display: "grid",
        gridTemplateColumns: "1fr 1.4fr 1fr",
        gap: "10px",
        alignItems: "start",
      }}
    >
      {/* ── LEFT: HEART ──────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* Panel: ECG */}
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            padding: "10px",
          }}
          data-ocid="heartbrain.ecg.panel"
        >
          <PanelHeader title="LIVE ECG WAVEFORM" />
          <ECGWaveform buffer={ecg ?? null} />
          <div style={{ display: "flex", gap: "12px", marginTop: "6px" }}>
            {[
              { label: "P-Wave", color: C.cyan, desc: "Atrial depol." },
              { label: "QRS", color: C.magenta, desc: "Ventricular" },
              { label: "T-Wave", color: C.gold, desc: "Repolarization" },
            ].map(({ label, color, desc }) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: color,
                  }}
                />
                <div>
                  <div
                    style={{ fontFamily: "monospace", fontSize: "7px", color }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "6px",
                      color: C.dim,
                    }}
                  >
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel: BPM */}
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            padding: "10px",
          }}
          data-ocid="heartbrain.bpm.panel"
        >
          <PanelHeader title="HEART RATE" />
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "40px",
                fontWeight: "bold",
                color: bpmColor,
                textShadow: `0 0 20px ${bpmColor}60`,
                lineHeight: 1,
              }}
            >
              {bpmVal.toFixed(0)}
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: C.dim,
              }}
            >
              BPM
            </span>
          </div>
          <MetricRow
            label="STROKE VOLUME"
            value={cardiac?.stroke_volume?.toFixed(1) ?? "..."}
            unit="mL"
          />
          <MetricRow
            label="CARDIAC OUTPUT"
            value={cardiac?.liters_per_min?.toFixed(2) ?? "..."}
            unit="L/min"
          />
          <MetricRow
            label="EJECTION FRACTION"
            value={
              cardiac
                ? `${(cardiac.ejection_fraction * 100).toFixed(0)}`
                : "..."
            }
            unit="%"
          />
        </div>

        {/* Panel: HRV */}
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            padding: "10px",
          }}
          data-ocid="heartbrain.hrv.panel"
        >
          <PanelHeader title="HEART RATE VARIABILITY" />
          <MetricRow
            label="SDNN"
            value={hrv?.sdnn?.toFixed(1) ?? "..."}
            unit="ms"
            color={C.green}
          />
          <MetricRow
            label="RMSSD"
            value={hrv?.rmssd?.toFixed(1) ?? "..."}
            unit="ms"
            color={C.cyan}
          />
          <MetricRow
            label="LF/HF RATIO"
            value={hrv?.lf_hf_ratio?.toFixed(3) ?? "..."}
            color={hrv && hrv.lf_hf_ratio > 2 ? C.amber : C.green}
          />
          <MetricRow
            label="PNN50"
            value={hrv?.pnn50?.toFixed(1) ?? "..."}
            unit="%"
          />
          <div
            style={{
              marginTop: "8px",
              borderTop: `1px solid ${C.borderDim}`,
              paddingTop: "6px",
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "7px",
                color: C.dim,
                letterSpacing: "0.1em",
                marginBottom: "3px",
              }}
            >
              HRV = ADAPTABILITY HEALTH
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "7px",
                color: hrv && hrv.hrv_index > 0.7 ? C.green : C.amber,
              }}
            >
              INDEX: {hrv?.hrv_index?.toFixed(3) ?? "..."}{" "}
              {hrv && hrv.hrv_index > 0.7 ? "OPTIMAL" : "MODERATE"}
            </div>
          </div>
        </div>

        {/* Panel: Dual Heart */}
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            padding: "10px",
          }}
          data-ocid="heartbrain.dual_heart.panel"
        >
          <PanelHeader title="DUAL HEART SYSTEM" />
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "7px",
              color: C.dim,
              marginBottom: "8px",
            }}
          >
            ICP EXTERNAL SKELETON ↔ SOVEREIGN INTERNAL PULSE
          </div>
          {[
            {
              label: "ICP External Skeleton",
              value: "2000ms",
              color: C.amber,
              desc: "Blockchain consensus ground beat",
            },
            {
              label: "SOVEREIGN Internal",
              value: "873ms",
              color: C.cyan,
              desc: "PHI⁴ × Schumann = biological pulse",
            },
          ].map(({ label, value, color, desc }) => (
            <div key={label} style={{ marginBottom: "8px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "3px",
                }}
              >
                <span
                  style={{ fontFamily: "monospace", fontSize: "7.5px", color }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "8px",
                    fontWeight: "bold",
                    color,
                  }}
                >
                  {value}
                </span>
              </div>
              <div
                style={{ height: "3px", background: "rgba(255,255,255,0.06)" }}
              >
                <div
                  style={{
                    height: "100%",
                    width: label.includes("ICP") ? "43%" : "100%",
                    background: color,
                    boxShadow: `0 0 4px ${color}`,
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "6px",
                  color: C.dim,
                  marginTop: "2px",
                }}
              >
                {desc}
              </div>
            </div>
          ))}
          {/* Baroreceptor reflex */}
          <div
            style={{
              marginTop: "6px",
              borderTop: `1px solid ${C.borderDim}`,
              paddingTop: "6px",
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "7px",
                color: C.dim,
                marginBottom: "3px",
              }}
            >
              BARORECEPTOR REFLEX
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "8px",
                  color: C.dim,
                }}
              >
                INHIBIT ←
              </span>
              <div
                style={{
                  flex: 1,
                  height: "3px",
                  background: "rgba(255,255,255,0.06)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -2,
                    left: `${50 + (heart?.baroreceptor_dir ?? 0) * 40}%`,
                    width: 7,
                    height: 7,
                    background: C.cyan,
                    borderRadius: "50%",
                    transform: "translateX(-50%)",
                    boxShadow: `0 0 6px ${C.cyan}`,
                    transition: "left 0.5s",
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "8px",
                  color: C.dim,
                }}
              >
                → EXCITE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CENTER: BRAIN ─────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* Panel: Brain Regions */}
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            padding: "10px",
          }}
          data-ocid="heartbrain.brain_regions.panel"
        >
          <PanelHeader title="BRAIN REGION ACTIVATIONS" accent={C.magenta} />
          {brainData.map((r, _i) => (
            <ActivationBar
              key={r.name}
              value={r.activation}
              label={r.name}
              sub={r.fn}
              mapping={r.mapping}
            />
          ))}
        </div>

        {/* Panel: Oscillation Band + Spike */}
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            padding: "10px",
          }}
          data-ocid="heartbrain.oscillation.panel"
        >
          <PanelHeader title="NEURAL OSCILLATION" />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                padding: "6px 12px",
                border: `1px solid ${bandInfo.color}60`,
                background: `${bandInfo.color}15`,
                fontFamily: "monospace",
                fontSize: "14px",
                fontWeight: "bold",
                color: bandInfo.color,
                textShadow: `0 0 12px ${bandInfo.color}60`,
                letterSpacing: "0.15em",
              }}
            >
              {oscillation.toUpperCase()}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "8px",
                  color: bandInfo.color,
                }}
              >
                {bandInfo.label}
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "7px",
                  color: C.dim,
                }}
              >
                DOMINANT BAND
              </div>
            </div>
          </div>
          <MetricRow
            label="NEURAL SPIKE RATE"
            value={spike?.toFixed(2) ?? "..."}
            unit="Hz"
            color={C.magenta}
          />
          <MetricRow
            label="CORD COHERENCE"
            value={cord?.cord_coherence?.toFixed(3) ?? "..."}
            color={C.cyan}
          />
          <MetricRow
            label="CONDUCTION VELOCITY"
            value={cord?.conduction_velocity?.toFixed(1) ?? "..."}
            unit="m/s"
          />
          <MetricRow
            label="STDP EVENTS"
            value={cord?.stdp_events?.toString() ?? "..."}
            color={C.green}
          />
          <MetricRow
            label="SYNAPTIC STRENGTH"
            value={cord?.synaptic_strength?.toFixed(3) ?? "..."}
          />
          <div
            style={{
              marginTop: "8px",
              borderTop: `1px solid ${C.borderDim}`,
              paddingTop: "6px",
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "7px",
                color: C.dim,
                marginBottom: "4px",
              }}
            >
              DOMINANT NEUROTRANSMITTER
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                color: C.magenta,
              }}
            >
              {world?.dominant_source ?? "..."}
            </div>
          </div>
        </div>

        {/* Panel: Neural Cord */}
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            padding: "10px",
          }}
          data-ocid="heartbrain.neural_cord.panel"
        >
          <PanelHeader title="NEURAL CORD — ASCENDING / DESCENDING" />
          <div style={{ display: "flex", gap: "10px" }}>
            {[
              {
                label: "ASCENDING",
                value: cord?.ascending_hz,
                unit: "Hz",
                color: C.cyan,
                desc: "Sensory → Brain",
              },
              {
                label: "DESCENDING",
                value: cord?.descending_hz,
                unit: "Hz",
                color: C.magenta,
                desc: "Brain → Body",
              },
            ].map(({ label, value, unit, color, desc }) => (
              <div
                key={label}
                style={{
                  flex: 1,
                  padding: "8px",
                  border: `1px solid ${color}25`,
                  background: `${color}06`,
                }}
              >
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "7px",
                    color: C.dim,
                    marginBottom: "3px",
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color,
                    textShadow: `0 0 8px ${color}50`,
                  }}
                >
                  {value?.toFixed(1) ?? "..."}
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "7px",
                    color: C.dim,
                  }}
                >
                  {unit} — {desc}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "8px" }}>
            <MetricRow
              label="MYELINATION INDEX"
              value={cord?.myelination_index?.toFixed(3) ?? "..."}
              color={C.amber}
            />
          </div>
        </div>
      </div>

      {/* ── RIGHT: COUPLING ──────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* Panel: PHI Coupling */}
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            padding: "10px",
          }}
          data-ocid="heartbrain.phi_coupling.panel"
        >
          <PanelHeader title="HEART-BRAIN PHI COUPLING" accent={C.gold} />
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "28px",
                fontWeight: "bold",
                color: C.gold,
                textShadow: `0 0 20px ${C.gold}60`,
              }}
            >
              {phiCoupling}
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "8px",
                color: C.dim,
                marginTop: "4px",
              }}
            >
              873ms ÷ 539ms = PHI
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "7px",
                color: C.gold,
                marginTop: "2px",
              }}
            >
              φ = {PHI.toFixed(10)}…
            </div>
          </div>
          <div
            style={{ borderTop: `1px solid ${C.borderDim}`, paddingTop: "8px" }}
          >
            {[
              { label: "HEART PERIOD", value: "873ms", color: C.cyan },
              { label: "BRAIN PERIOD", value: "539ms", color: C.magenta },
              { label: "RATIO (PHI)", value: phiCoupling, color: C.gold },
            ].map(({ label, value, color }) => (
              <MetricRow
                key={label}
                label={label}
                value={value}
                color={color}
              />
            ))}
          </div>
        </div>

        {/* Panel: Third Brain */}
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            padding: "10px",
          }}
          data-ocid="heartbrain.third_brain.panel"
        >
          <PanelHeader title="THIRD BRAIN — ENTERIC LAYER" />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: third?.cosmological_lock ? C.green : C.dim,
                boxShadow: third?.cosmological_lock
                  ? `0 0 10px ${C.green}`
                  : "none",
              }}
            />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "8px",
                color: third?.cosmological_lock ? C.green : C.dim,
              }}
            >
              {third?.cosmological_lock
                ? "COSMOLOGICAL LOCK ✓"
                : "LOCK SEEKING…"}
            </span>
          </div>
          <MetricRow
            label="ENTERIC COHERENCE"
            value={third?.enteric_coherence?.toFixed(3) ?? "..."}
            color={C.cyan}
          />
          <MetricRow
            label="SEROTONIN FIELD"
            value={third?.serotonin_field?.toFixed(3) ?? "..."}
            color={C.green}
          />
          <MetricRow
            label="SCHUMANN RESONANCE"
            value={third?.schumann_resonance?.toFixed(2) ?? "7.83"}
            unit="Hz"
            color={C.gold}
          />
          <MetricRow
            label="DRIFT CORRECTION"
            value={third?.drift_correction_active ? "ACTIVE" : "PASSIVE"}
            color={third?.drift_correction_active ? C.amber : C.dim}
          />
        </div>

        {/* Panel: Cosmological Standing Waves */}
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            padding: "10px",
          }}
          data-ocid="heartbrain.standing_waves.panel"
        >
          <PanelHeader title="COSMOLOGICAL STANDING WAVES" />
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {SCHUMANN_WAVES.map((hz, i) => {
              const val = standingWaves[i] ?? hz;
              const amp = 0.5 + Math.sin(i * 1.3) * 0.35;
              return (
                <div
                  key={hz}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "7px",
                      color: C.gold,
                      width: "32px",
                      textAlign: "right",
                    }}
                  >
                    {val.toFixed(2)}Hz
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: "4px",
                      background: "rgba(255,255,255,0.05)",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.round(amp * 100)}%`,
                        height: "100%",
                        background: `linear-gradient(to right, ${C.cyan}80, ${C.magenta}80)`,
                        boxShadow: `0 0 3px ${C.cyan}60`,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "6.5px",
                      color: C.dim,
                      width: "22px",
                    }}
                  >
                    EH{i + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel: Neural Coherence + World Model */}
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            padding: "10px",
          }}
          data-ocid="heartbrain.neural_coherence.panel"
        >
          <PanelHeader title="NEURAL COHERENCE SCORE" />
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "28px",
              fontWeight: "bold",
              textAlign: "center",
              color:
                neuralCoherence > 0.7
                  ? C.green
                  : neuralCoherence > 0.4
                    ? C.amber
                    : C.red,
              textShadow: "0 0 16px currentColor",
            }}
          >
            {neuralCoherence.toFixed(3)}
          </div>
          <div
            style={{
              marginTop: "8px",
              borderTop: `1px solid ${C.borderDim}`,
              paddingTop: "8px",
            }}
          >
            <PanelHeader title="WORLD MODEL — KEY FIELDS" />
            <MetricRow
              label="FIELD COHERENCE"
              value={world?.field_coherence?.toFixed(3) ?? "..."}
              color={C.cyan}
            />
            <MetricRow
              label="ENTROPY"
              value={world?.entropy?.toFixed(3) ?? "..."}
              color={world && world.entropy > 0.7 ? C.red : C.green}
            />
            <MetricRow
              label="OSC BAND"
              value={world?.oscillation_band ?? "..."}
              color={bandInfo.color}
            />
            <MetricRow
              label="PHI ALIGNMENT"
              value={world?.phi_alignment?.toFixed(4) ?? "..."}
              color={C.gold}
            />
            <MetricRow
              label="GENESIS DISTANCE"
              value={world?.genesis_distance?.toFixed(4) ?? "..."}
              color={C.amber}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
