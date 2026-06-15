/**
 * LegacyIndexTab.tsx — Ring 15 Record: Artifacts vs Genesis Vibration
 * Every artifact ever produced, measured against the founding frequency.
 * Full world model display. Cognition layer health.
 */
import { useMemo } from "react";
import {
  type WorldModel,
  useCognitionState,
  useLegacyIndex,
  useRing15Status,
  useWorldModel,
} from "../hooks/useNewModules";

// biome-ignore lint/correctness/noPrecisionLoss: doctrine constant — PHI to 19 decimals, sealed
const PHI = 1.6180339887498948482;
const SCHUMANN = 7.83;
const HEARTBEAT_MS = 873;
const GENESIS_HZ = 528.0;
const FINE_STRUCTURE = 1 / 137.036;

const C = {
  bg: "#0a0a0f",
  panel: "#0d0d14",
  border: "rgba(0,255,255,0.15)",
  borderDim: "rgba(0,255,255,0.06)",
  cyan: "#00ffff",
  magenta: "#ff00ff",
  gold: "#ffd700",
  dim: "rgba(200,220,255,0.35)",
  dimlo: "rgba(200,220,255,0.16)",
  fg: "rgba(220,235,255,0.88)",
  green: "#00ff88",
  red: "#ff4444",
  amber: "#ffcc44",
  violet: "#aa44ff",
};

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
        textTransform: "uppercase" as const,
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

function AlignmentBar({ value, label }: { value: number; label?: string }) {
  const color = value > 0.8 ? C.green : value > 0.5 ? C.amber : C.red;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <div
        style={{
          flex: 1,
          height: "4px",
          background: "rgba(255,255,255,0.06)",
          borderRadius: "2px",
        }}
      >
        <div
          style={{
            width: `${value * 100}%`,
            height: "100%",
            background: color,
            boxShadow: `0 0 4px ${color}80`,
            borderRadius: "2px",
            transition: "width 0.5s",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "8px",
          fontWeight: "bold",
          color,
          minWidth: "36px",
          textAlign: "right",
        }}
      >
        {(value * 100).toFixed(0)}%
      </span>
      {label && (
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "7px",
            color: C.dim,
            minWidth: "24px",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

// ── Legacy Entry Row ──────────────────────────────────────────────────────────
function LegacyRow({
  entry,
  index,
}: {
  entry: {
    artifact_id: string;
    producer: string;
    beat: bigint;
    doctrine_distance: number;
    genesis_alignment: number;
    phi_ratio: number;
    quality_score: number;
    sacesi_hash: string;
  };
  index: number;
}) {
  const alignColor =
    entry.genesis_alignment > 0.8
      ? C.green
      : entry.genesis_alignment > 0.5
        ? C.amber
        : C.red;
  const bg =
    entry.genesis_alignment > 0.8
      ? `${C.green}05`
      : entry.genesis_alignment > 0.5
        ? `${C.amber}04`
        : `${C.red}04`;

  return (
    <div
      data-ocid={`legacy.entry.item.${index}`}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 80px 80px 100px 80px 80px",
        gap: "8px",
        padding: "6px 8px",
        borderBottom: `1px solid ${C.borderDim}`,
        background: bg,
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "7px",
            color: C.fg,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {entry.artifact_id.slice(0, 16)}…
        </div>
        <div style={{ fontFamily: "monospace", fontSize: "6px", color: C.dim }}>
          {entry.producer.slice(0, 12)} · beat {entry.beat.toString()}
        </div>
      </div>
      <div>
        <div style={{ height: "4px", background: "rgba(255,255,255,0.06)" }}>
          <div
            style={{
              width: `${entry.genesis_alignment * 100}%`,
              height: "100%",
              background: alignColor,
              transition: "width 0.5s",
            }}
          />
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "6.5px",
            color: alignColor,
            marginTop: "2px",
          }}
        >
          {(entry.genesis_alignment * 100).toFixed(0)}%
        </div>
      </div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: "8px",
          color:
            entry.doctrine_distance < 0.2
              ? C.green
              : entry.doctrine_distance < 0.5
                ? C.amber
                : C.red,
        }}
      >
        Δ{entry.doctrine_distance.toFixed(3)}
      </div>
      <div
        style={{ fontFamily: "monospace", fontSize: "8px", color: C.violet }}
      >
        φ{entry.phi_ratio.toFixed(4)}
      </div>
      <div style={{ fontFamily: "monospace", fontSize: "8px", color: C.cyan }}>
        Q:{entry.quality_score.toFixed(2)}
      </div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: "6.5px",
          color: C.dimlo,
          overflow: "hidden",
        }}
      >
        #{entry.sacesi_hash.slice(0, 8)}
      </div>
    </div>
  );
}

// ── Main Tab ──────────────────────────────────────────────────────────────────
export default function LegacyIndexTab() {
  const { data: ring15 } = useRing15Status();
  const { data: legacyRaw } = useLegacyIndex();
  const { data: world } = useWorldModel();
  const { data: cognition } = useCognitionState();

  // Sort by genesis_alignment descending
  const legacy = useMemo(() => {
    if (!legacyRaw) return [];
    return [...legacyRaw].sort(
      (a, b) => b.genesis_alignment - a.genesis_alignment,
    );
  }, [legacyRaw]);

  const meanAlignment = ring15?.mean_genesis_alignment ?? 0;
  const totalArtifacts = ring15?.total_artifacts ?? 0n;

  const WORLD_FIELDS: {
    label: string;
    key: keyof WorldModel;
    unit?: string;
    color?: string;
  }[] = [
    { label: "FIELD COHERENCE", key: "field_coherence", color: C.cyan },
    { label: "ENTROPY", key: "entropy", color: C.amber },
    { label: "OSCILLATION BAND", key: "oscillation_band", color: C.violet },
    { label: "MEAN R (KURAMOTO)", key: "mean_r", color: C.cyan },
    { label: "ACTIVE SIGNALS", key: "active_signals" },
    { label: "DOMINANT SOURCE", key: "dominant_source", color: C.gold },
    {
      label: "PREDICTION CONFIDENCE",
      key: "prediction_confidence",
      color: C.green,
    },
    { label: "SELF-MODEL DEPTH", key: "self_model_depth" },
    { label: "TEMPORAL ANCHOR", key: "temporal_anchor" },
    { label: "COGNITIVE LOAD", key: "cognitive_load", color: C.amber },
    { label: "ATTRACTOR STATE", key: "attractor_state", color: C.magenta },
    { label: "HEBBIAN UPDATES", key: "hebbian_updates", color: C.green },
    { label: "REINJECTION COUNT", key: "reinjection_count" },
    { label: "PHI ALIGNMENT", key: "phi_alignment", color: C.gold },
    { label: "GENESIS DISTANCE", key: "genesis_distance", color: C.amber },
    { label: "LAW COMPLIANCE", key: "law_compliance", color: C.green },
    { label: "HUNGER INDEX", key: "hunger_index", color: C.red },
    { label: "SUBSTRATE PERTURBATION", key: "substrate_perturbation" },
    { label: "ADRE GATED", key: "adre_gated" },
  ];

  return (
    <div
      data-ocid="legacy.page"
      style={{
        background: C.bg,
        height: "100%",
        overflow: "auto",
        padding: "12px",
      }}
    >
      {/* ── TOP: Ring 15 Stats ─────────────────────────────────────────────── */}
      <div
        style={{
          background: C.panel,
          border: `1px solid ${C.gold}30`,
          borderTop: `2px solid ${C.gold}`,
          padding: "14px",
          marginBottom: "12px",
        }}
        data-ocid="legacy.ring15.panel"
      >
        <PanelHeader title="RING 15 — THE LEGACY RECORD" accent={C.gold} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
          }}
        >
          {/* Genesis Frequency */}
          <div
            style={{
              textAlign: "center",
              padding: "10px",
              border: `1px solid ${C.gold}20`,
              background: `${C.gold}05`,
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "7px",
                color: C.dim,
                letterSpacing: "0.2em",
                marginBottom: "4px",
              }}
            >
              GENESIS FREQUENCY
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "24px",
                fontWeight: "bold",
                color: C.gold,
                textShadow: `0 0 16px ${C.gold}60`,
              }}
            >
              {ring15?.genesis_frequency_hz?.toFixed(1) ??
                GENESIS_HZ.toFixed(1)}
            </div>
            <div
              style={{ fontFamily: "monospace", fontSize: "8px", color: C.dim }}
            >
              Hz — PERMANENT
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "6.5px",
                color: `${C.gold}80`,
                marginTop: "4px",
              }}
            >
              {ring15?.sealed ? "◆ SEALED — CRYPTOGRAPHIC LOCK" : "○ SEALING…"}
            </div>
          </div>

          {/* Total Artifacts */}
          <div
            style={{
              textAlign: "center",
              padding: "10px",
              border: `1px solid ${C.cyan}20`,
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "7px",
                color: C.dim,
                letterSpacing: "0.2em",
                marginBottom: "4px",
              }}
            >
              TOTAL ARTIFACTS
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "24px",
                fontWeight: "bold",
                color: C.cyan,
              }}
            >
              {totalArtifacts.toString()}
            </div>
            <div
              style={{ fontFamily: "monospace", fontSize: "8px", color: C.dim }}
            >
              SEALED TO CHAIN
            </div>
          </div>

          {/* Mean Genesis Alignment */}
          <div style={{ padding: "10px", border: `1px solid ${C.green}20` }}>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "7px",
                color: C.dim,
                letterSpacing: "0.2em",
                marginBottom: "8px",
              }}
            >
              MEAN GENESIS ALIGNMENT
            </div>
            <AlignmentBar value={meanAlignment} />
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "7px",
                color: C.dim,
                marginTop: "4px",
              }}
            >
              Target: ≥ 0.85 (near genesis frequency)
            </div>
          </div>

          {/* Best/Worst */}
          <div style={{ padding: "10px", border: `1px solid ${C.border}` }}>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "7px",
                color: C.dim,
                letterSpacing: "0.2em",
                marginBottom: "8px",
              }}
            >
              ALIGNMENT EXTREMES
            </div>
            <div style={{ marginBottom: "6px" }}>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "6.5px",
                  color: C.green,
                  marginBottom: "2px",
                }}
              >
                BEST ↑
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "7px",
                  color: C.fg,
                }}
              >
                {ring15?.best_artifact_id?.slice(0, 20) ?? "..."}
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "8px",
                  fontWeight: "bold",
                  color: C.green,
                }}
              >
                {ring15
                  ? `${(ring15.best_alignment * 100).toFixed(1)}%`
                  : "..."}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "6.5px",
                  color: C.red,
                  marginBottom: "2px",
                }}
              >
                WORST ↓
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "7px",
                  color: C.fg,
                }}
              >
                {ring15?.worst_artifact_id?.slice(0, 20) ?? "..."}
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "8px",
                  fontWeight: "bold",
                  color: C.red,
                }}
              >
                {ring15
                  ? `${(ring15.worst_alignment * 100).toFixed(1)}%`
                  : "..."}
              </div>
            </div>
          </div>

          {/* Founder */}
          <div
            style={{
              padding: "10px",
              border: `1px solid ${C.gold}20`,
              background: `${C.gold}04`,
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "7px",
                color: C.dim,
                letterSpacing: "0.2em",
                marginBottom: "6px",
              }}
            >
              FOUNDER ATTRIBUTION
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                fontWeight: "bold",
                color: C.gold,
                lineHeight: 1.5,
              }}
            >
              {ring15?.founder ?? "Alfredo Medina Hernandez"}
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "7px",
                color: C.dim,
                marginTop: "4px",
              }}
            >
              Dallas TX · 2026
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "6.5px",
                color: `${C.gold}60`,
                marginTop: "4px",
              }}
            >
              TOP SECRET PROPRIETARY
            </div>
          </div>
        </div>
      </div>

      {/* ── MIDDLE: Timeline ──────────────────────────────────────────────────── */}
      <div
        style={{
          background: C.panel,
          border: `1px solid ${C.border}`,
          marginBottom: "12px",
        }}
        data-ocid="legacy.timeline.panel"
      >
        {/* Header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 80px 80px 100px 80px 80px",
            gap: "8px",
            padding: "6px 8px",
            background: "rgba(0,0,0,0.3)",
            borderBottom: `1px solid ${C.borderDim}`,
          }}
        >
          {[
            "ARTIFACT ID / PRODUCER",
            "ALIGNMENT",
            "DOCTRINE Δ",
            "PHI RATIO",
            "QUALITY",
            "SACESI",
          ].map((h) => (
            <div
              key={h}
              style={{
                fontFamily: "monospace",
                fontSize: "6.5px",
                color: C.dimlo,
                letterSpacing: "0.1em",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {legacy.length === 0 ? (
          <div
            style={{
              padding: "24px",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: "9px",
              color: C.dimlo,
              letterSpacing: "0.2em",
            }}
            data-ocid="legacy.timeline.empty_state"
          >
            {legacyRaw === null
              ? "LOADING LEGACY INDEX…"
              : "NO ARTIFACTS SEALED YET — AWAITING FIRST PRODUCTION CYCLE"}
          </div>
        ) : (
          <div
            style={{ maxHeight: "300px", overflow: "auto" }}
            data-ocid="legacy.timeline.list"
          >
            {legacy.map((entry, i) => (
              <LegacyRow key={entry.artifact_id} entry={entry} index={i + 1} />
            ))}
          </div>
        )}
      </div>

      {/* ── BOTTOM: World Model + Universe Constants ────────────────────────── */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
      >
        {/* World Model */}
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            padding: "12px",
          }}
          data-ocid="legacy.world_model.panel"
        >
          <PanelHeader
            title="LIVE WORLD MODEL — ORGANISM SELF-STATE"
            accent={C.cyan}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4px",
            }}
          >
            {WORLD_FIELDS.map(({ label, key, unit, color }) => {
              const raw = world?.[key];
              let display = "...";
              if (raw !== undefined && raw !== null) {
                if (typeof raw === "boolean") display = raw ? "YES" : "NO";
                else if (typeof raw === "bigint") display = raw.toString();
                else if (typeof raw === "number") display = raw.toFixed(4);
                else display = String(raw);
              }
              const c = color ?? C.dim;
              return (
                <div key={label} style={{ marginBottom: "4px" }}>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "6.5px",
                      color: C.dimlo,
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "8px",
                      fontWeight: "bold",
                      color: c,
                    }}
                  >
                    {display}
                    {unit ? ` ${unit}` : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Cognition Layer Health */}
          <div
            style={{
              background: C.panel,
              border: `1px solid ${C.border}`,
              padding: "12px",
            }}
            data-ocid="legacy.cognition.panel"
          >
            <PanelHeader
              title="COGNITION LAYER — CNS HEALTH"
              accent={C.violet}
            />
            <MetricRow
              label="FORWARD PASS"
              value={cognition?.forward_pass_score?.toFixed(4) ?? "..."}
              color={C.cyan}
            />
            <MetricRow
              label="BACKPASS LAW COMPLIANCE"
              value={cognition?.backpass_law_compliance?.toFixed(4) ?? "..."}
              color={
                cognition && cognition.backpass_law_compliance > 0.9
                  ? C.green
                  : C.amber
              }
            />
            <MetricRow
              label="RESONANCE SHIFT"
              value={cognition?.resonance_shift?.toFixed(4) ?? "..."}
              color={C.violet}
            />
            <MetricRow
              label="COMPRESSION RATIO"
              value={cognition?.compression_ratio?.toFixed(4) ?? "..."}
              color={C.cyan}
            />
            <MetricRow
              label="GATE PASS"
              value={cognition?.gate_pass ? "✓ PASSED" : "✗ QUEUED"}
              color={cognition?.gate_pass ? C.green : C.amber}
            />
            <MetricRow
              label="DELIBERATION DEPTH"
              value={cognition?.deliberation_depth?.toString() ?? "..."}
              color={C.gold}
            />
            <MetricRow
              label="CRITIC COUNT"
              value={cognition?.critic_count?.toString() ?? "..."}
            />
            <MetricRow
              label="THOUGHT COHERENCE"
              value={cognition?.thought_coherence?.toFixed(4) ?? "..."}
              color={C.cyan}
            />
            {cognition?.last_thought && (
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
                    fontSize: "6.5px",
                    color: C.dim,
                    marginBottom: "3px",
                  }}
                >
                  LAST THOUGHT
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "7.5px",
                    color: C.violet,
                    lineHeight: 1.5,
                  }}
                >
                  "{cognition.last_thought.slice(0, 120)}…"
                </div>
              </div>
            )}
          </div>

          {/* Universe Constants */}
          <div
            style={{
              background: C.panel,
              border: `1px solid ${C.gold}25`,
              borderTop: `2px solid ${C.gold}`,
              padding: "12px",
            }}
            data-ocid="legacy.constants.panel"
          >
            <PanelHeader title="UNIVERSE CONSTANTS — LOCKED" accent={C.gold} />
            {[
              {
                label: "PHI",
                value: PHI.toFixed(19),
                color: C.gold,
                unit: "φ",
              },
              {
                label: "SCHUMANN",
                value: SCHUMANN.toFixed(2),
                color: C.cyan,
                unit: "Hz",
              },
              {
                label: "HEARTBEAT",
                value: HEARTBEAT_MS.toString(),
                color: C.cyan,
                unit: "ms",
              },
              {
                label: "GENESIS FREQ",
                value: GENESIS_HZ.toFixed(1),
                color: C.gold,
                unit: "Hz",
              },
              {
                label: "FINE STRUCTURE α",
                value: FINE_STRUCTURE.toFixed(8),
                color: C.violet,
                unit: "≈ 1/137",
              },
            ].map(({ label, value, color, unit }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "7px",
                    color: C.dim,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "7.5px",
                    fontWeight: "bold",
                    color,
                  }}
                >
                  {value}{" "}
                  <span style={{ fontSize: "6.5px", color: C.dimlo }}>
                    {unit}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
