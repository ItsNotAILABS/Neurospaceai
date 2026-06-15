/**
 * AvatarBrainChip.tsx
 * 16-node sparse brain visualization for a single BattleOps avatar.
 * All state is deterministic — derived from entityId + PHI math + heartbeat tick.
 * No backend call needed.
 */
import { useEffect, useRef, useState } from "react";

const PHI = 1.618033988749895;
const HEARTBEAT_MS = 873;
const SYNC_THRESHOLD_MS = 900;

const BRAIN_REGIONS = [
  "Prefrontal Cortex",
  "Hippocampal Temple",
  "Amygdala Vigilans",
  "Anterior Cingulate",
  "Thalamic Relay",
  "Cerebellar Core",
  "Insular Field",
  "Basal Ganglia",
  "Temporal Integrator",
  "Occipital Proj.",
  "Broca Sovereign",
  "Default Mode Net",
  "Salience Network",
  "Enteric Intel.",
  "Reticular Activ.",
  "Corpus Callosum",
] as const;

export interface BrainChipState {
  tick: number;
  activations: number[]; // 0-1 per node, length 16
  coherenceR: number; // 0-1 local coherence
  dominantRegion: string;
  behavioralState: string;
  syncLocked: boolean;
  lastUpdateTime: number;
}

// ──────────────────────────────────────────────────────────────────────────────
// Deterministic seeded PRNG (xorshift32 based on entity hash + tick)
function hashStr(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (Math.imul(h, 0x01000193) | 0) >>> 0;
  }
  return h;
}

function seededRand(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    s = s >>> 0;
    return s / 0xffffffff;
  };
}

// Compute brain chip state from entity ID + global tick
export function computeBrainChipState(
  entityId: string,
  tick: number,
): BrainChipState {
  const idHash = hashStr(entityId);
  const rand = seededRand((idHash ^ (tick * 0x45d9f3b)) >>> 0);

  // Base activations — PHI-modulated per node using ring frequencies
  const activations: number[] = [];
  for (let i = 0; i < 16; i++) {
    // Each node has a natural frequency = PHI^(i mod 8) * base
    const freq = PHI ** ((i % 8) + 1);
    // Phase offset seeded from entity ID per node
    const phase = (hashStr(entityId + i) % 1000) / 1000;
    // Activation = base sine wave + noise
    const base =
      0.3 + 0.4 * Math.abs(Math.sin(tick * 0.01 * freq + phase * Math.PI * 2));
    const noise = (rand() - 0.5) * 0.15;
    activations.push(Math.max(0.02, Math.min(0.98, base + noise)));
  }

  // Local coherence R = 1 - variance of activations
  const mean = activations.reduce((a, b) => a + b, 0) / 16;
  const variance = activations.reduce((a, b) => a + (b - mean) ** 2, 0) / 16;
  const coherenceR = Math.max(0, Math.min(1, 1 - variance * 8));

  // Dominant region = highest activation
  let maxIdx = 0;
  for (let i = 1; i < 16; i++) {
    if (activations[i] > activations[maxIdx]) maxIdx = i;
  }
  const dominantRegion = BRAIN_REGIONS[maxIdx];

  // Top 3 regions drive behavioral state
  const sorted = activations
    .map((v, i) => ({ v, i }))
    .sort((a, b) => b.v - a.v);
  const top3 = sorted.slice(0, 3).map((x) => x.i);

  // Map top regions to behavioral labels
  const behavioralState = deriveBehavioralState(top3, activations);

  return {
    tick,
    activations,
    coherenceR,
    dominantRegion,
    behavioralState,
    syncLocked: true, // updated by the hook
    lastUpdateTime: Date.now(),
  };
}

function deriveBehavioralState(top3: number[], activations: number[]): string {
  // Index guide: 0=PFC, 1=Hippo, 2=Amygdala, 3=ACC, 4=Thalamus,
  //              5=Cerebellum, 6=Insula, 7=BasalGanglia, 8=Temporal,
  //              9=Occipital, 10=Broca, 11=DMN, 12=Salience, 13=Enteric,
  //              14=Reticular, 15=Corpus

  const hasAmygdala = top3.includes(2);
  const hasPFC = top3.includes(0);
  const hasHippo = top3.includes(1);
  const hasDMN = top3.includes(11);
  const hasSalience = top3.includes(12);
  const hasReticular = top3.includes(14);
  const hasBasal = top3.includes(7);
  const amygdalaHigh = activations[2] > 0.7;

  if (hasAmygdala && amygdalaHigh) return "THREAT-RESPONSE";
  if (hasPFC && hasBasal) return "EXECUTIVE-CTRL";
  if (hasSalience && hasReticular) return "HIGH-ALERT";
  if (hasHippo && hasPFC) return "PLANNING";
  if (hasDMN) return "SELF-MODEL";
  if (hasHippo) return "ENCODING";
  if (hasSalience) return "SCANNING";
  if (hasReticular) return "AROUSED";
  return "BASELINE";
}

// ──────────────────────────────────────────────────────────────────────────────
// Region color by functional group
function regionColor(idx: number, activation: number): string {
  // Color bands by functional group
  const groups = [
    "#3b82f6", // 0 PFC — blue
    "#22c55e", // 1 Hippocampus — green
    "#ef4444", // 2 Amygdala — red
    "#f59e0b", // 3 ACC — amber
    "#8b5cf6", // 4 Thalamus — purple
    "#06b6d4", // 5 Cerebellum — cyan
    "#f97316", // 6 Insula — orange
    "#84cc16", // 7 Basal Ganglia — lime
    "#a78bfa", // 8 Temporal — violet
    "#fbbf24", // 9 Occipital — gold
    "#34d399", // 10 Broca — teal
    "#60a5fa", // 11 DMN — sky
    "#fb923c", // 12 Salience — warm orange
    "#4ade80", // 13 Enteric — light green
    "#c084fc", // 14 Reticular — light purple
    "#f472b6", // 15 Corpus Callosum — pink
  ];
  const base = groups[idx] ?? "#64748b";
  // Scale brightness by activation
  return activation > 0.6 ? base : `${base}88`;
}

// ──────────────────────────────────────────────────────────────────────────────
// Hook
export function useAvatarBrainChip(entityId: string): BrainChipState {
  const tickRef = useRef(0);
  const lastUpdateRef = useRef(Date.now());
  const [state, setState] = useState<BrainChipState>(() =>
    computeBrainChipState(entityId, 0),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current++;
      const now = Date.now();
      const elapsed = now - lastUpdateRef.current;
      lastUpdateRef.current = now;

      const next = computeBrainChipState(entityId, tickRef.current);
      next.syncLocked = elapsed <= SYNC_THRESHOLD_MS;
      next.lastUpdateTime = now;
      setState(next);
    }, HEARTBEAT_MS);

    return () => clearInterval(interval);
  }, [entityId]);

  return state;
}

// ──────────────────────────────────────────────────────────────────────────────
// Component
interface AvatarBrainChipProps {
  entityId: string;
}

export function AvatarBrainChip({ entityId }: AvatarBrainChipProps) {
  const brain = useAvatarBrainChip(entityId);

  return (
    <div
      data-ocid="avatar_brain_chip.panel"
      style={{
        fontFamily: "monospace",
        fontSize: 9,
        color: "#94a3b8",
        userSelect: "none",
      }}
    >
      {/* Header row: coherence + sync */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
          padding: "5px 8px",
          background: "rgba(234,179,8,0.06)",
          border: "1px solid rgba(234,179,8,0.15)",
        }}
      >
        <div>
          <span style={{ color: "#64748b", fontSize: 8, letterSpacing: 1 }}>
            COHERENCE R
          </span>
          <span
            style={{
              color:
                brain.coherenceR > 0.7
                  ? "#22c55e"
                  : brain.coherenceR > 0.4
                    ? "#f59e0b"
                    : "#ef4444",
              fontWeight: "bold",
              fontSize: 12,
              marginLeft: 6,
            }}
          >
            {brain.coherenceR.toFixed(3)}
          </span>
        </div>
        {/* Sync indicator */}
        <div
          data-ocid="avatar_brain_chip.sync_status"
          style={{ display: "flex", alignItems: "center", gap: 4 }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: brain.syncLocked ? "#22c55e" : "#f59e0b",
              display: "inline-block",
              boxShadow: brain.syncLocked
                ? "0 0 5px #22c55e"
                : "0 0 5px #f59e0b",
            }}
          />
          <span
            style={{
              color: brain.syncLocked ? "#22c55e" : "#f59e0b",
              fontSize: 9,
              letterSpacing: 1,
              fontWeight: "bold",
            }}
          >
            {brain.syncLocked ? "LOCKED" : "DRIFT"}
          </span>
          <span style={{ color: "#374151", fontSize: 8, marginLeft: 2 }}>
            873ms
          </span>
        </div>
      </div>

      {/* Dominant region + behavioral state */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
          gap: 6,
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "4px 6px",
            background: "#0f172a",
            border: "1px solid #1e293b",
          }}
        >
          <div
            style={{
              color: "#475569",
              fontSize: 7,
              letterSpacing: 1,
              marginBottom: 2,
            }}
          >
            DOMINANT REGION
          </div>
          <div
            style={{
              color: "#eab308",
              fontSize: 9,
              fontWeight: "bold",
              lineHeight: 1.2,
            }}
          >
            {brain.dominantRegion}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            padding: "4px 6px",
            background: "#0f172a",
            border: "1px solid #1e293b",
          }}
        >
          <div
            style={{
              color: "#475569",
              fontSize: 7,
              letterSpacing: 1,
              marginBottom: 2,
            }}
          >
            BEHAVIORAL STATE
          </div>
          <div
            data-ocid="avatar_brain_chip.behavioral_state"
            style={{
              color: "#f59e0b",
              fontSize: 9,
              fontWeight: "bold",
              lineHeight: 1.2,
            }}
          >
            {brain.behavioralState}
          </div>
        </div>
      </div>

      {/* 16 node activation bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {BRAIN_REGIONS.map((region, i) => {
          const activation = brain.activations[i] ?? 0;
          const color = regionColor(i, activation);
          const isDominant = region === brain.dominantRegion;
          return (
            <div
              key={region}
              data-ocid={`avatar_brain_chip.node.${i + 1}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: isDominant ? "1px 3px" : "0",
                background: isDominant ? "rgba(234,179,8,0.06)" : "transparent",
                borderLeft: isDominant
                  ? "2px solid #eab30855"
                  : "2px solid transparent",
              }}
            >
              {/* Region index */}
              <span
                style={{
                  color: "#374151",
                  fontSize: 7,
                  minWidth: 12,
                  textAlign: "right",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {/* Label */}
              <span
                style={{
                  color: isDominant ? "#eab308" : "#4b5563",
                  fontSize: 8,
                  minWidth: 84,
                  letterSpacing: isDominant ? 0.5 : 0,
                  fontWeight: isDominant ? "bold" : "normal",
                }}
              >
                {region}
              </span>
              {/* Bar track */}
              <div
                style={{
                  flex: 1,
                  height: 5,
                  background: "#0f172a",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${(activation * 100).toFixed(1)}%`,
                    height: "100%",
                    background: color,
                    borderRadius: 1,
                    transition: "width 0.6s ease",
                    boxShadow: activation > 0.7 ? `0 0 4px ${color}` : "none",
                  }}
                />
              </div>
              {/* Value */}
              <span
                style={{ color, fontSize: 8, minWidth: 28, textAlign: "right" }}
              >
                {(activation * 100).toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Tick counter */}
      <div
        style={{
          marginTop: 8,
          textAlign: "right",
          color: "#1e293b",
          fontSize: 7,
          letterSpacing: 1,
        }}
      >
        T{brain.tick} · PHI^4 = {(PHI ** 4).toFixed(4)}
      </div>
    </div>
  );
}

export default AvatarBrainChip;
