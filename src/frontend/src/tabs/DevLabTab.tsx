// DevLabTab.tsx — 3D Virtual Research Lab
// PHI — canonical 19-decimal value in neuroemergencecore.toml; JS double precision limit here
// SCHUMANN = 7.83 Hz → period = 127.7ms
// HEARTBEAT = PHI^4 × 127.7ms = 873ms
// LAB REFRESH = PHI × 873ms = 1412ms

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import type { AvatarAgent, MaterialType, Sandbox } from "../backend";
import type { LabState } from "../backend";
import { AvatarBrainChip } from "../components/AvatarBrainChip";
import { useLiveOrganismPulse } from "../hooks/useLiveOrganismPulse";
import {
  useCanonicalState,
  useCreateSandbox,
  useExternalLabOutcall,
  useFearMissionState,
  useLabState,
  useRunSandboxStep,
  useSealExperiment,
} from "../hooks/useQueries";

// ── PHI constants (exact, no truncation) ─────────────────────────────────────
// PHI truncated to JS max-precision (1.618033988749895) — full 19-decimal value documented in neuroemergencecore.toml
const PHI = 1.618033988749895;
const PHI2 = PHI * PHI; // 2.6180339887498948482
const PHI3 = PHI2 * PHI; // 4.2360679774997896964
const GOLDEN_ANGLE_RAD = 137.5077 * (Math.PI / 180);
const LAB_REFRESH_MS = Math.round(PHI * 873); // 1412ms
const OMNIS_THRESHOLD = 0.87;

// ── 96-node Kuramoto positions (golden-angle, 8 rings × 12, radius=PHI^3) ──
const KURAMOTO_POSITIONS: [number, number, number][] = [];
for (let r = 0; r < 8; r++) {
  for (let n = 0; n < 12; n++) {
    const theta = n * GOLDEN_ANGLE_RAD;
    const phi = (r / 7) * Math.PI;
    KURAMOTO_POSITIONS.push([
      Math.cos(theta) * Math.sin(phi) * PHI3,
      Math.cos(phi) * PHI3,
      Math.sin(theta) * Math.sin(phi) * PHI3,
    ]);
  }
}

// ── Three.js color constants ──────────────────────────────────────────────────
const C3 = {
  cyan: new THREE.Color(0x00ccee),
  violet: new THREE.Color(0x9933ff),
  edge: new THREE.Color(0x1a3355),
  edgeOmnis: new THREE.Color(0x662299),
};

// ── CSS color tokens ─────────────────────────────────────────────────────────
const CSS = {
  bg: "oklch(0.025 0.012 240)",
  panel: "oklch(0.055 0.012 240)",
  panelHeader: "oklch(0.085 0.018 240)",
  border: "oklch(0.14 0.02 240)",
  borderGlow: "oklch(0.25 0.06 240)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.82 0.22 80)",
  violet: "oklch(0.68 0.26 280)",
  red: "oklch(0.65 0.25 25)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.75 0.22 65)",
  dim: "oklch(0.32 0.04 220)",
  text: "oklch(0.82 0.04 215)",
  textDim: "oklch(0.45 0.03 220)",
  nexus: "oklch(0.6 0.22 240)",
  cognus: "oklch(0.58 0.20 260)",
  lexis: "oklch(0.56 0.24 280)",
  aurum: "oklch(0.68 0.24 45)",
  solus: "oklch(0.55 0.22 270)",
  vetus: "oklch(0.52 0.20 250)",
  veritas: "oklch(0.59 0.22 265)",
  upgrade: "oklch(0.61 0.23 275)",
  dirt: "oklch(0.45 0.12 55)",
  softMetal: "oklch(0.65 0.10 220)",
  hardMetal: "oklch(0.35 0.06 230)",
  crystalline: "oklch(0.72 0.28 270)",
};

const TEAM_CONFIG = [
  { name: "NEXUS", glyph: "⬡", color: CSS.nexus },
  { name: "COGNUS", glyph: "⊙", color: CSS.cognus },
  { name: "LEXIS", glyph: "Λ", color: CSS.lexis },
  { name: "AURUM", glyph: "◈", color: CSS.aurum },
  { name: "SOLUS", glyph: "◉", color: CSS.solus },
  { name: "VETUS", glyph: "⊕", color: CSS.vetus },
  { name: "VERITAS", glyph: "△", color: CSS.veritas },
  { name: "UPGRADE_GOV", glyph: "⟁", color: CSS.upgrade },
];

const MATERIAL_CONFIG: Record<
  string,
  { label: string; color: string; description: string; icon: string }
> = {
  Dirt: {
    label: "Dirt",
    color: CSS.dirt,
    icon: "⊟",
    description:
      "Organic substrate. Tests emergent structure from base matter.",
  },
  SoftMetal: {
    label: "Soft Metal",
    color: CSS.softMetal,
    icon: "⊫",
    description: "Malleable conductor. High phi-coupling potential.",
  },
  HardMetal: {
    label: "Hard Metal",
    color: CSS.hardMetal,
    icon: "▣",
    description: "Rigid lattice. Tests crystalline emergence under pressure.",
  },
  Crystalline: {
    label: "Crystalline",
    color: CSS.crystalline,
    icon: "✦",
    description: "Resonant matrix. Highest Sovereign emergence probability.",
  },
};

function emergenceColor(pattern: string): string {
  switch (pattern) {
    case "Sovereign":
      return CSS.violet;
    case "Coherent":
      return CSS.cyan;
    case "Crystallizing":
      return CSS.amber;
    case "Vortex":
      return CSS.gold;
    case "Fractal":
      return CSS.green;
    default:
      return CSS.dim;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// THREE.JS BRAIN COMPONENTS
// ────────────────────────────────────────────────────────────────────────────

function KuramotoNode({
  position,
  phase,
  isOmnis,
  index,
}: {
  position: [number, number, number];
  phase: number;
  isOmnis: boolean;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const hue = Math.round(240 + phase * 70);
  const baseColor = useMemo(
    () => new THREE.Color().setHSL(((hue - 240) / 360) * 0.3 + 0.58, 0.95, 0.5),
    [hue],
  );
  const omColor = C3.violet;
  const color = isOmnis ? omColor : baseColor;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const offset = (index * GOLDEN_ANGLE_RAD) % (2 * Math.PI);
    const pulse = 0.85 + 0.15 * Math.sin((t * 2 * Math.PI) / 0.873 + offset);
    meshRef.current.scale.setScalar(pulse);
    if (lightRef.current) {
      lightRef.current.intensity = isOmnis ? pulse * 2.0 : pulse * 0.6;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isOmnis ? 2.5 : 1.2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        color={color}
        intensity={0.6}
        distance={1.2}
        decay={2}
      />
    </group>
  );
}

function BrainEdgeLines({ omnis }: { omnis: boolean }) {
  const edgeColor = omnis ? C3.edgeOmnis : C3.edge;
  const linesRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const positions: number[] = [];
    // Ring edges
    for (let r = 0; r < 8; r++) {
      for (let n = 0; n < 12; n++) {
        const i = r * 12 + n;
        const j = r * 12 + ((n + 1) % 12);
        positions.push(...KURAMOTO_POSITIONS[i], ...KURAMOTO_POSITIONS[j]);
      }
    }
    // Cross-ring edges (every 3rd node)
    for (let r = 0; r < 7; r++) {
      for (let n = 0; n < 12; n += 3) {
        const i = r * 12 + n;
        const j = (r + 1) * 12 + n;
        positions.push(...KURAMOTO_POSITIONS[i], ...KURAMOTO_POSITIONS[j]);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    return geo;
  }, []);

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial
        color={edgeColor}
        opacity={omnis ? 0.55 : 0.2}
        transparent
      />
    </lineSegments>
  );
}

function KuramotoBrain({
  phases,
  kuramotoR,
}: { phases: number[]; kuramotoR: number }) {
  const isOmnis = kuramotoR >= OMNIS_THRESHOLD;
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  const nodeKeys = useMemo(
    () =>
      KURAMOTO_POSITIONS.map((p) => `n${p[0].toFixed(3)}_${p[1].toFixed(3)}`),
    [],
  );

  return (
    <group ref={groupRef}>
      <BrainEdgeLines omnis={isOmnis} />
      {KURAMOTO_POSITIONS.map((pos, i) => (
        <KuramotoNode
          key={nodeKeys[i]}
          index={i}
          position={pos}
          phase={phases[i] ?? 0.5}
          isOmnis={isOmnis}
        />
      ))}
    </group>
  );
}

function BrainScene({
  phases,
  kuramotoR,
}: { phases: number[]; kuramotoR: number }) {
  return (
    <>
      <ambientLight intensity={0.08} />
      <pointLight position={[6, 6, 6]} intensity={0.5} color={0x0099cc} />
      <pointLight position={[-6, -4, -6]} intensity={0.3} color={0x330066} />
      <KuramotoBrain phases={phases} kuramotoR={kuramotoR} />
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={5}
        maxDistance={18}
        autoRotate={false}
        target={[0, 0, 0]}
      />
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// PARTICLE FIELD PREVIEW (2D canvas per sandbox)
// ────────────────────────────────────────────────────────────────────────────

function ParticleFieldPreview({
  positions,
  material,
  emergence,
}: {
  positions: { x: number; y: number; z: number }[];
  material: string;
  emergence: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const matColor = MATERIAL_CONFIG[material]?.color ?? CSS.cyan;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 80, 50);
    ctx.fillStyle = CSS.bg;
    ctx.fillRect(0, 0, 80, 50);
    const pts = positions.slice(0, 80);
    for (const p of pts) {
      const px = ((p.x + 5) / 10) * 80;
      const py = ((p.z + 5) / 10) * 50;
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, 2 * Math.PI);
      ctx.fillStyle = matColor;
      ctx.globalAlpha = 0.8;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (emergence === "Coherent" || emergence === "Sovereign") {
      const grad = ctx.createRadialGradient(40, 25, 0, 40, 25, 35);
      grad.addColorStop(0, "rgba(153, 51, 255, 0.18)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 80, 50);
    }
  }, [positions, matColor, emergence]);

  return (
    <canvas
      ref={canvasRef}
      width={80}
      height={50}
      style={{ display: "block" }}
    />
  );
}

// ────────────────────────────────────────────────────────────────────────────
// AVATAR AGENT CARD
// ────────────────────────────────────────────────────────────────────────────

function AvatarCard({
  agent,
  teamConfig,
  pulsePhase,
}: {
  agent: AvatarAgent | null;
  teamConfig: { name: string; glyph: string; color: string };
  pulsePhase: number;
}) {
  const coherence = agent?.coherenceLevel ?? 0;
  const actionState = (agent?.actionState as string) ?? "Observing";
  const emotionValence = agent?.emotionValence ?? 0;
  const valenceColor =
    emotionValence > 0.5
      ? CSS.cyan
      : emotionValence < -0.3
        ? CSS.amber
        : CSS.dim;
  const coherencePct = Math.round(coherence * 100);

  return (
    <div
      data-ocid={`lab.avatar.${teamConfig.name.toLowerCase()}.card`}
      style={{
        background: CSS.panel,
        border: `1px solid ${CSS.border}`,
        borderLeft: `2px solid ${teamConfig.color}`,
        padding: "6px 8px",
        marginBottom: "4px",
        opacity: 0.7 + 0.3 * pulsePhase,
        transition: "opacity 0.3s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to right, ${teamConfig.color}0a, transparent)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          position: "relative",
        }}
      >
        <span
          style={{
            color: teamConfig.color,
            fontSize: "13px",
            lineHeight: 1,
            minWidth: "14px",
          }}
        >
          {teamConfig.glyph}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                color: CSS.text,
                fontFamily: "JetBrains Mono",
                fontSize: "9px",
                letterSpacing: "0.12em",
                fontWeight: 600,
              }}
            >
              {teamConfig.name}
            </span>
            <span
              style={{
                color: valenceColor,
                fontFamily: "JetBrains Mono",
                fontSize: "8px",
                letterSpacing: "0.08em",
              }}
            >
              {actionState.toUpperCase()}
            </span>
          </div>
          <div
            style={{
              marginTop: "3px",
              background: "oklch(0.1 0.01 220)",
              height: "2px",
              borderRadius: "1px",
            }}
          >
            <div
              style={{
                width: `${coherencePct}%`,
                height: "100%",
                background: `linear-gradient(to right, ${teamConfig.color}, ${teamConfig.color}aa)`,
                boxShadow: `0 0 4px ${teamConfig.color}80`,
                transition: "width 0.6s ease",
                borderRadius: "1px",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "2px",
            }}
          >
            <span
              style={{
                color: CSS.textDim,
                fontFamily: "JetBrains Mono",
                fontSize: "7px",
                letterSpacing: "0.1em",
              }}
            >
              COH
            </span>
            <span
              style={{
                color: teamConfig.color,
                fontFamily: "JetBrains Mono",
                fontSize: "7px",
                fontWeight: 700,
              }}
            >
              {coherence.toFixed(3)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// SANDBOX CARD
// ────────────────────────────────────────────────────────────────────────────

function SandboxCard({
  sandbox,
  onSeal,
  isSealing,
}: { sandbox: Sandbox; onSeal: (id: bigint) => void; isSealing: boolean }) {
  const mat = String(sandbox.material);
  const pat = String(sandbox.pattern);
  const matConfig = MATERIAL_CONFIG[mat] ?? {
    label: mat,
    color: CSS.cyan,
    icon: "○",
    description: "",
  };
  const patColor = emergenceColor(pat);
  const canSeal =
    (pat === "Coherent" || pat === "Sovereign") && !sandbox.sealed;
  const emergencePct = Math.round(sandbox.emergenceScore * 100);

  return (
    <div
      data-ocid={`lab.sandbox.${Number(sandbox.id)}.card`}
      style={{
        background: CSS.panel,
        border: `1px solid ${CSS.border}`,
        borderTop: `2px solid ${matConfig.color}`,
        padding: "8px",
        flex: "0 0 auto",
        width: "200px",
        ...(canSeal ? { boxShadow: `0 0 12px ${patColor}30` } : {}),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "6px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ color: matConfig.color, fontSize: "11px" }}>
            {matConfig.icon}
          </span>
          <span
            style={{
              color: CSS.text,
              fontFamily: "JetBrains Mono",
              fontSize: "9px",
              letterSpacing: "0.1em",
              fontWeight: 600,
            }}
          >
            {matConfig.label.toUpperCase()}
          </span>
        </div>
        <span
          style={{
            color: CSS.textDim,
            fontFamily: "JetBrains Mono",
            fontSize: "7px",
          }}
        >
          #{String(sandbox.id)}
        </span>
      </div>

      <div
        style={{
          marginBottom: "6px",
          border: `1px solid ${CSS.border}`,
          overflow: "hidden",
        }}
      >
        <ParticleFieldPreview
          positions={sandbox.particlePositions}
          material={mat}
          emergence={pat}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "4px",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
          <circle
            cx="14"
            cy="14"
            r="11"
            fill="none"
            stroke="oklch(0.1 0.01 220)"
            strokeWidth="2.5"
          />
          <circle
            cx="14"
            cy="14"
            r="11"
            fill="none"
            stroke={patColor}
            strokeWidth="2.5"
            strokeDasharray={`${emergencePct * 0.69} 69`}
            strokeDashoffset="17"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 3px ${patColor})` }}
          />
        </svg>
        <div>
          <div
            style={{
              color: patColor,
              fontFamily: "JetBrains Mono",
              fontSize: "8px",
              letterSpacing: "0.1em",
              fontWeight: 700,
            }}
          >
            {pat.toUpperCase()}
          </div>
          <div
            style={{
              color: CSS.textDim,
              fontFamily: "JetBrains Mono",
              fontSize: "7px",
            }}
          >
            CYCLE {String(sandbox.cycleCount)}
          </div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div
            style={{
              color: CSS.text,
              fontFamily: "JetBrains Mono",
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            {emergencePct}%
          </div>
          <div
            style={{
              color: CSS.textDim,
              fontFamily: "JetBrains Mono",
              fontSize: "7px",
            }}
          >
            EMG
          </div>
        </div>
      </div>

      {canSeal && (
        <button
          type="button"
          data-ocid={`lab.sandbox.${Number(sandbox.id)}.seal_button`}
          onClick={() => onSeal(sandbox.id)}
          disabled={isSealing}
          style={{
            width: "100%",
            padding: "4px",
            background: `${patColor}18`,
            border: `1px solid ${patColor}`,
            color: patColor,
            fontFamily: "JetBrains Mono",
            fontSize: "8px",
            letterSpacing: "0.18em",
            cursor: isSealing ? "wait" : "pointer",
            transition: "all 0.2s",
            marginTop: "2px",
          }}
        >
          {isSealing ? "SEALING…" : "◈ SEAL"}
        </button>
      )}
      {sandbox.sealed && (
        <div
          style={{
            color: CSS.gold,
            fontFamily: "JetBrains Mono",
            fontSize: "8px",
            letterSpacing: "0.15em",
            textAlign: "center",
            marginTop: "2px",
          }}
        >
          ◆ SEALED
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// SPAWN FORM
// ────────────────────────────────────────────────────────────────────────────

function SpawnForm({
  onSpawn,
  onClose,
}: {
  onSpawn: (m: string, ta: number) => void;
  onClose: () => void;
}) {
  const [material, setMaterial] = useState<string>("Dirt");
  const [temperatureAnalog, setTemperatureAnalog] = useState(37);

  return (
    <div
      data-ocid="lab.spawn_form"
      style={{
        background: CSS.panel,
        border: `1px solid ${CSS.borderGlow}`,
        padding: "14px",
        boxShadow: `0 0 24px ${CSS.cyan}18`,
        minWidth: "240px",
        flex: "0 0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            color: CSS.cyan,
            fontFamily: "JetBrains Mono",
            fontSize: "9px",
            letterSpacing: "0.2em",
            fontWeight: 700,
          }}
        >
          SPAWN EXPERIMENT
        </span>
        <button
          type="button"
          data-ocid="lab.spawn_form.close_button"
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: CSS.textDim,
            cursor: "pointer",
            fontSize: "11px",
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <div
          style={{
            color: CSS.textDim,
            fontFamily: "JetBrains Mono",
            fontSize: "8px",
            letterSpacing: "0.1em",
            marginBottom: "5px",
          }}
        >
          MATERIAL TYPE
        </div>
        {Object.entries(MATERIAL_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            type="button"
            data-ocid={`lab.spawn_form.material.${key.toLowerCase()}`}
            onClick={() => setMaterial(key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              width: "100%",
              padding: "5px 7px",
              marginBottom: "3px",
              background: material === key ? `${cfg.color}18` : "transparent",
              border: `1px solid ${material === key ? cfg.color : CSS.border}`,
              color: material === key ? cfg.color : CSS.textDim,
              fontFamily: "JetBrains Mono",
              fontSize: "8px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: "11px" }}>{cfg.icon}</span>
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: "1px",
                  letterSpacing: "0.08em",
                }}
              >
                {cfg.label.toUpperCase()}
              </div>
              <div style={{ color: CSS.dim, fontSize: "7px" }}>
                {cfg.description}
              </div>
            </div>
          </button>
        ))}
      </div>

      {[
        {
          label: "TEMPERATURE",
          val: temperatureAnalog,
          min: 0,
          max: 100,
          step: 1,
          set: setTemperatureAnalog,
          unit: "°",
        },
      ].map(({ label, val, min, max, step, set, unit }) => (
        <div key={label} style={{ marginBottom: "8px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "2px",
            }}
          >
            <span
              style={{
                color: CSS.textDim,
                fontFamily: "JetBrains Mono",
                fontSize: "8px",
                letterSpacing: "0.1em",
              }}
            >
              {label}
            </span>
            <span
              style={{
                color: CSS.gold,
                fontFamily: "JetBrains Mono",
                fontSize: "9px",
                fontWeight: 700,
              }}
            >
              {val.toFixed(3)}
              {unit}
            </span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={val}
            onChange={(e) => set(Number(e.target.value))}
            style={{ width: "100%", accentColor: CSS.gold, height: "3px" }}
          />
        </div>
      ))}

      <button
        type="button"
        data-ocid="lab.spawn_form.run_button"
        onClick={() => onSpawn(material, temperatureAnalog)}
        style={{
          width: "100%",
          padding: "7px",
          background: `${CSS.gold}18`,
          border: `1px solid ${CSS.gold}`,
          color: CSS.gold,
          fontFamily: "JetBrains Mono",
          fontSize: "9px",
          letterSpacing: "0.2em",
          fontWeight: 700,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        ◈ RUN EXPERIMENT
      </button>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// EMERGENCE EVENT BANNER (fullscreen overlay)
// ────────────────────────────────────────────────────────────────────────────

function EmergenceBanner({
  sandbox,
  onDismiss,
}: { sandbox: Sandbox; onDismiss: () => void }) {
  const pat = String(sandbox.pattern);
  const mat = String(sandbox.material);
  const patColor = emergenceColor(pat);

  return (
    <div
      data-ocid="lab.emergence_banner"
      className="lab-emergence"
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse at 50% 40%, ${patColor}15 0%, transparent 70%)`,
        border: `1px solid ${patColor}60`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div style={{ textAlign: "center", padding: "32px", maxWidth: "420px" }}>
        <div
          style={{
            color: patColor,
            fontFamily: "JetBrains Mono",
            fontSize: "28px",
            fontWeight: 900,
            letterSpacing: "0.3em",
            textShadow: `0 0 24px ${patColor}`,
            marginBottom: "12px",
          }}
        >
          ◆ {pat.toUpperCase()}
        </div>
        <div
          style={{
            color: CSS.text,
            fontFamily: "JetBrains Mono",
            fontSize: "11px",
            letterSpacing: "0.15em",
            marginBottom: "6px",
          }}
        >
          EMERGENCE EVENT DETECTED
        </div>
        <div
          style={{
            color: CSS.textDim,
            fontFamily: "JetBrains Mono",
            fontSize: "9px",
            marginBottom: "20px",
          }}
        >
          {MATERIAL_CONFIG[mat]?.label ?? mat} · Score:{" "}
          {(sandbox.emergenceScore * 100).toFixed(1)}% · Cycle{" "}
          {String(sandbox.cycleCount)}
        </div>
        <button
          type="button"
          data-ocid="lab.emergence_banner.close_button"
          onClick={onDismiss}
          style={{
            padding: "8px 20px",
            background: `${patColor}18`,
            border: `1px solid ${patColor}`,
            color: patColor,
            fontFamily: "JetBrains Mono",
            fontSize: "9px",
            letterSpacing: "0.18em",
            cursor: "pointer",
          }}
        >
          ACKNOWLEDGE
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// MAIN LAB
// ────────────────────────────────────────────────────────────────────────────

export default function DevLabTab() {
  const pulse = useLiveOrganismPulse();
  const { data: canon } = useCanonicalState();
  const { data: fearState } = useFearMissionState();
  const { data: labState, refetch: refetchLab } = useLabState();
  const typedActiveExperiments = (labState as LabState | null)
    ?.activeExperiments;

  const createSandbox = useCreateSandbox();
  const runSandboxStep = useRunSandboxStep();
  const sealExperiment = useSealExperiment();
  const externalLabOutcall = useExternalLabOutcall();

  const kuramotoR = fearState?.kuramotoR ?? 0;
  const isOmnis = kuramotoR >= OMNIS_THRESHOLD;

  // Generate 96 phases from coherence + golden-angle offset per node
  const phases = useMemo(() => {
    const base = canon?.coh ?? 0.5;
    return KURAMOTO_POSITIONS.map(
      (_, i) => (base + (i * GOLDEN_ANGLE_RAD) / (2 * Math.PI)) % 1,
    );
  }, [canon?.coh]);

  // Heartbeat pulse phase (0..1) for avatar cards
  const [pulsePhase, setPulsePhase] = useState(1);
  useEffect(() => {
    const id = setInterval(
      () =>
        setPulsePhase((p) => {
          const n = p - 0.05;
          return n < 0.7 ? 1 : n;
        }),
      50,
    );
    return () => clearInterval(id);
  }, []);

  const [showSpawn, setShowSpawn] = useState(false);
  const [labMode, setLabMode] = useState<
    "spawn" | "configure" | "run" | "observe"
  >("observe");
  // ── VIRTUAL EXPERIMENT CHAMBER state (appended — do not move) ──────────────
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [experimentResult, setExperimentResult] = useState<{
    compound: string;
    avatar: string;
    timestamp: string;
    deltaScore: number;
    dominantRegion: string;
    outcome: string;
    status: string;
  } | null>(null);
  const [selectedCompound, setSelectedCompound] = useState("");
  const [targetAvatar, setTargetAvatar] = useState("");
  const [chamberLoading, setChamberLoading] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
  const [externalStatus, setExternalStatus] = useState<
    "idle" | "testing" | "ok" | "fail"
  >("idle");
  const [emergenceSandbox, setEmergenceSandbox] = useState<Sandbox | null>(
    null,
  );
  const [sealingId, setSealingId] = useState<bigint | null>(null);
  const [runningId, setRunningId] = useState<bigint | null>(null);

  // Poll lab state at PHI×873ms
  useEffect(() => {
    const id = setInterval(() => void refetchLab(), LAB_REFRESH_MS);
    return () => clearInterval(id);
  }, [refetchLab]);

  // Detect emergence events
  useEffect(() => {
    if (!labState?.sandboxes) return;
    for (const sb of labState.sandboxes) {
      const pat = String(sb.pattern);
      if (
        (pat === "Coherent" || pat === "Sovereign") &&
        !sb.sealed &&
        sb.emergenceScore > 0.7
      ) {
        setEmergenceSandbox(sb);
        return;
      }
    }
  }, [labState?.sandboxes]);

  const handleSpawn = useCallback(
    async (materialKey: string, _ta: number) => {
      setShowSpawn(false);
      setLabMode("run");
      try {
        const result = await createSandbox.mutateAsync(
          materialKey as MaterialType,
        );
        if (result?.sandboxId != null) {
          const sbId = result.sandboxId as bigint;
          setRunningId(sbId);
          let count = 0;
          const poll = setInterval(async () => {
            count++;
            try {
              await runSandboxStep.mutateAsync(sbId);
              void refetchLab();
            } catch {
              /* ignore */
            }
            if (count >= 20) {
              clearInterval(poll);
              setRunningId(null);
              setLabMode("observe");
            }
          }, LAB_REFRESH_MS);
          void poll;
        }
      } catch {
        /* ignore */
      }
    },
    [createSandbox, runSandboxStep, refetchLab],
  );

  const handleSeal = useCallback(
    async (id: bigint) => {
      setSealingId(id);
      try {
        await sealExperiment.mutateAsync(id);
        void refetchLab();
      } finally {
        setSealingId(null);
      }
    },
    [sealExperiment, refetchLab],
  );

  const handleTestExternal = useCallback(async () => {
    if (!externalUrl) return;
    setExternalStatus("testing");
    try {
      const packet = JSON.stringify({
        coherence: kuramotoR,
        beat: pulse.beat,
        mode: pulse.modeName,
      });
      const result = await externalLabOutcall.mutateAsync({
        labUrl: externalUrl,
        statePacket: packet,
      });
      setExternalStatus(result?.ok ? "ok" : "fail");
    } catch {
      setExternalStatus("fail");
    }
  }, [externalUrl, kuramotoR, pulse.beat, pulse.modeName, externalLabOutcall]);

  const typedLabState = labState as LabState | null;
  const avatars = typedLabState?.avatars ?? [];
  const sandboxes = typedLabState?.sandboxes ?? [];
  const labCoherence = typedLabState?.labCoherence ?? kuramotoR;

  const modeButtons: { id: typeof labMode; label: string }[] = [
    { id: "spawn", label: "SPAWN" },
    { id: "configure", label: "CONFIGURE" },
    { id: "run", label: "RUN" },
    { id: "observe", label: "OBSERVE" },
  ];

  return (
    <div
      data-ocid="lab.page"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: CSS.bg,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {emergenceSandbox && (
        <EmergenceBanner
          sandbox={emergenceSandbox}
          onDismiss={() => setEmergenceSandbox(null)}
        />
      )}

      {/* Main body */}
      <div
        style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}
      >
        {/* LEFT PANEL — 38.2% (1/φ²) */}
        <div
          data-ocid="lab.avatar_panel"
          style={{
            width: "38.2%",
            display: "flex",
            flexDirection: "column",
            borderRight: `1px solid ${CSS.border}`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "8px 10px",
              borderBottom: `1px solid ${CSS.border}`,
              background: CSS.panelHeader,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                color: CSS.cyan,
                fontFamily: "JetBrains Mono",
                fontSize: "8px",
                letterSpacing: "0.2em",
                fontWeight: 700,
              }}
            >
              AGENT FIELD
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span
                style={{
                  color: CSS.textDim,
                  fontFamily: "JetBrains Mono",
                  fontSize: "7px",
                }}
              >
                COH
              </span>
              <span
                style={{
                  color:
                    labCoherence > 0.7
                      ? CSS.green
                      : labCoherence > 0.4
                        ? CSS.amber
                        : CSS.red,
                  fontFamily: "JetBrains Mono",
                  fontSize: "9px",
                  fontWeight: 700,
                }}
              >
                {labCoherence.toFixed(3)}
              </span>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "8px",
              scrollbarWidth: "none",
            }}
          >
            {TEAM_CONFIG.map((tc) => {
              const agent = avatars.find((a) => a.teamName === tc.name) ?? null;
              return (
                <AvatarCard
                  key={tc.name}
                  agent={agent}
                  teamConfig={tc}
                  pulsePhase={pulsePhase}
                />
              );
            })}

            <div
              style={{
                marginTop: "8px",
                padding: "8px",
                background: CSS.panelHeader,
                border: `1px solid ${CSS.border}`,
              }}
            >
              <div
                style={{
                  color: CSS.textDim,
                  fontFamily: "JetBrains Mono",
                  fontSize: "7px",
                  letterSpacing: "0.15em",
                  marginBottom: "8px",
                }}
              >
                LAB VITALS
              </div>
              {(
                [
                  ["NODES", "96", CSS.cyan],
                  ["RINGS", "8", CSS.cyan],
                  ["φ-RADIUS", PHI3.toFixed(4), CSS.gold],
                  ["HEARTBEAT", "873ms", CSS.gold],
                  [
                    "KURAMOTO-R",
                    kuramotoR.toFixed(4),
                    isOmnis ? CSS.violet : CSS.text,
                  ],
                  [
                    "OMNIS GATE",
                    isOmnis ? "FIRING" : "DORMANT",
                    isOmnis ? CSS.violet : CSS.dim,
                  ],
                  [
                    "EXPERIMENTS",
                    String(typedActiveExperiments ?? 0),
                    CSS.cyan,
                  ],
                  ["MODE", pulse.modeName, CSS.gold],
                ] as [string, string, string][]
              ).map(([label, value, color]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      color: CSS.textDim,
                      fontFamily: "JetBrains Mono",
                      fontSize: "7px",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      color,
                      fontFamily: "JetBrains Mono",
                      fontSize: "8px",
                      fontWeight: 700,
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER PANEL — 61.8% (1/φ) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          {/* 3D Brain chamber */}
          <div
            data-ocid="lab.brain_chamber"
            style={{
              flex: 1,
              position: "relative",
              minHeight: 0,
              background:
                "radial-gradient(ellipse at 50% 50%, oklch(0.04 0.02 240) 0%, oklch(0.015 0.005 240) 100%)",
            }}
          >
            {/* Top-left labels */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "12px",
                zIndex: 10,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  color: CSS.textDim,
                  fontFamily: "JetBrains Mono",
                  fontSize: "7px",
                  letterSpacing: "0.18em",
                }}
              >
                PHI-PROPORT BRAIN CHAMBER
              </div>
              <div
                style={{
                  color: CSS.text,
                  fontFamily: "JetBrains Mono",
                  fontSize: "11px",
                  fontWeight: 700,
                  marginTop: "2px",
                }}
              >
                96 nodes
              </div>
              <div
                style={{
                  color: CSS.cyan,
                  fontFamily: "JetBrains Mono",
                  fontSize: "9px",
                }}
              >
                8 rings
              </div>
              <div
                style={{
                  color: CSS.violet,
                  fontFamily: "JetBrains Mono",
                  fontSize: "9px",
                }}
              >
                12 phase
              </div>
            </div>
            {isOmnis && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "12px",
                  zIndex: 10,
                  color: CSS.violet,
                  fontFamily: "JetBrains Mono",
                  fontSize: "10px",
                  letterSpacing: "0.25em",
                  fontWeight: 900,
                  textShadow: `0 0 16px ${CSS.violet}`,
                  animation: "lab-pulse 873ms ease-in-out infinite",
                }}
              >
                ◆ OMNIS
              </div>
            )}
            {/* Bottom label */}
            <div
              style={{
                position: "absolute",
                bottom: "12px",
                left: "12px",
                zIndex: 10,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  color: CSS.text,
                  fontFamily: "JetBrains Mono",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                96 Node
              </div>
              <div
                style={{
                  color: CSS.dim,
                  fontFamily: "JetBrains Mono",
                  fontSize: "9px",
                }}
              >
                Kuramoto Brain
              </div>
            </div>
            <Canvas
              style={{ width: "100%", height: "100%" }}
              camera={{ position: [0, 0, 12], fov: 50 }}
              gl={{ antialias: true, alpha: true }}
              dpr={[1, 1.5]}
            >
              <Suspense fallback={null}>
                <BrainScene phases={phases} kuramotoR={kuramotoR} />
              </Suspense>
            </Canvas>
          </div>

          {/* Sandbox row */}
          <div
            data-ocid="lab.sandbox_row"
            style={{
              height: "168px",
              flexShrink: 0,
              borderTop: `1px solid ${CSS.border}`,
              background: CSS.panelHeader,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "5px 10px",
                borderBottom: `1px solid ${CSS.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  color: CSS.gold,
                  fontFamily: "JetBrains Mono",
                  fontSize: "7px",
                  letterSpacing: "0.2em",
                  fontWeight: 700,
                }}
              >
                MATERIAL SANDBOX
              </span>
              {runningId != null && (
                <span
                  style={{
                    color: CSS.amber,
                    fontFamily: "JetBrains Mono",
                    fontSize: "7px",
                    animation: "lab-pulse 873ms ease-in-out infinite",
                  }}
                >
                  ◉ RUNNING #{String(runningId)}
                </span>
              )}
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                padding: "8px",
                overflowX: "auto",
                flex: 1,
                scrollbarWidth: "none",
              }}
            >
              {sandboxes.map((sb) => (
                <SandboxCard
                  key={String(sb.id)}
                  sandbox={sb}
                  onSeal={handleSeal}
                  isSealing={sealingId === sb.id}
                />
              ))}
              {!showSpawn && (
                <button
                  type="button"
                  data-ocid="lab.spawn_button"
                  onClick={() => {
                    setShowSpawn(true);
                    setLabMode("spawn");
                  }}
                  style={{
                    flex: "0 0 auto",
                    width: "80px",
                    height: "100%",
                    background: "transparent",
                    border: `1px dashed ${CSS.border}`,
                    color: CSS.dim,
                    fontFamily: "JetBrains Mono",
                    fontSize: "20px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      CSS.cyan;
                    (e.currentTarget as HTMLButtonElement).style.color =
                      CSS.cyan;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      CSS.border;
                    (e.currentTarget as HTMLButtonElement).style.color =
                      CSS.dim;
                  }}
                >
                  +
                </button>
              )}
              {showSpawn && (
                <SpawnForm
                  onSpawn={handleSpawn}
                  onClose={() => {
                    setShowSpawn(false);
                    setLabMode("observe");
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
           VIRTUAL EXPERIMENT CHAMBER — appended below existing 3D view
          ══════════════════════════════════════════════════════════════════ */}
      <div
        data-ocid="chamber.section"
        style={{
          flexShrink: 0,
          background: "#080818",
          borderTop: "1px solid rgba(99,102,241,0.45)",
          boxShadow: "0 -2px 24px rgba(99,102,241,0.12)",
          overflowY: "auto",
          maxHeight: "520px",
          scrollbarWidth: "none",
        }}
      >
        {/* Chamber header */}
        <div
          style={{
            padding: "16px 20px 10px",
            borderBottom: "1px solid rgba(99,102,241,0.22)",
          }}
        >
          <div
            style={{
              color: "oklch(0.72 0.28 270)",
              fontFamily: "JetBrains Mono",
              fontSize: "13px",
              fontWeight: 900,
              letterSpacing: "0.3em",
              textShadow: "0 0 16px oklch(0.72 0.28 270)",
            }}
          >
            VIRTUAL EXPERIMENT CHAMBER
          </div>
          <div
            style={{
              color: "oklch(0.42 0.08 270)",
              fontFamily: "JetBrains Mono",
              fontSize: "8px",
              letterSpacing: "0.22em",
              marginTop: "3px",
            }}
          >
            SOVEREIGN AI SUBJECTS — BRAIN-COUPLED EXPERIMENTAL TARGETS
          </div>
        </div>

        {/* 2×2 Avatar grid */}
        <div
          data-ocid="chamber.avatar_grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "10px",
            padding: "14px 20px",
          }}
        >
          {(
            [
              {
                id: "nexus",
                name: "NEXUS",
                role: "THE COORDINATOR",
                desc: "Calm analytical bridge. Routes signals across governance teams. Maintains system coherence.",
                accent: "oklch(0.72 0.22 195)",
                accentRgb: "0,204,238",
              },
              {
                id: "cognus",
                name: "COGNUS",
                role: "THE THINKER",
                desc: "Deep introspective processor. Runs ADRE 5-pass cognition loop. Self-writes doctrine.",
                accent: "oklch(0.68 0.26 280)",
                accentRgb: "153,51,255",
              },
              {
                id: "veritas",
                name: "VERITAS",
                role: "THE SCANNER",
                desc: "Sharp vigilant watchdog. Runs coherence scans every PHI⁴ beats. Flags anomalies.",
                accent: "oklch(0.75 0.22 65)",
                accentRgb: "245,158,11",
              },
              {
                id: "esuriens",
                name: "ESURIENS",
                role: "THE HUNGRY",
                desc: "Driven restless engine. Maintains TASK_HORIZON. Never fully satisfied.",
                accent: "oklch(0.65 0.25 35)",
                accentRgb: "249,115,22",
              },
            ] as const
          ).map((av) => (
            <div
              key={av.id}
              data-ocid={`chamber.avatar.${av.id}.card`}
              style={{
                background: "oklch(0.04 0.015 240)",
                border: `1px solid rgba(${av.accentRgb},0.18)`,
                borderLeft: `3px solid ${av.accent}`,
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                boxShadow:
                  selectedAvatar === av.name
                    ? `0 0 16px rgba(${av.accentRgb},0.25)`
                    : "none",
                transition: "box-shadow 0.25s",
              }}
            >
              {/* Card header */}
              <div>
                <div
                  style={{
                    color: av.accent,
                    fontFamily: "JetBrains Mono",
                    fontSize: "12px",
                    fontWeight: 900,
                    letterSpacing: "0.2em",
                    textShadow: `0 0 10px rgba(${av.accentRgb},0.6)`,
                  }}
                >
                  {av.name}
                </div>
                <div
                  style={{
                    color: `rgba(${av.accentRgb},0.55)`,
                    fontFamily: "JetBrains Mono",
                    fontSize: "7px",
                    letterSpacing: "0.18em",
                    fontStyle: "italic",
                    marginTop: "1px",
                  }}
                >
                  {av.role}
                </div>
              </div>

              {/* Brain chip inline */}
              <div
                style={{
                  background: "oklch(0.03 0.01 240)",
                  border: "1px solid oklch(0.1 0.015 240)",
                  padding: "8px",
                }}
              >
                <AvatarBrainChip entityId={av.id} />
              </div>

              {/* Role description */}
              <div
                style={{
                  color: "oklch(0.42 0.05 220)",
                  fontFamily: "JetBrains Mono",
                  fontSize: "8px",
                  lineHeight: 1.6,
                  letterSpacing: "0.06em",
                }}
              >
                {av.desc}
              </div>

              {/* Inspect button */}
              <button
                type="button"
                data-ocid={`chamber.avatar.${av.id}.inspect_button`}
                onClick={() =>
                  setSelectedAvatar((prev) =>
                    prev === av.name ? null : av.name,
                  )
                }
                style={{
                  padding: "6px 10px",
                  background:
                    selectedAvatar === av.name
                      ? `rgba(${av.accentRgb},0.18)`
                      : "transparent",
                  border: `1px solid rgba(${av.accentRgb},0.5)`,
                  color: av.accent,
                  fontFamily: "JetBrains Mono",
                  fontSize: "8px",
                  letterSpacing: "0.18em",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  alignSelf: "flex-start",
                }}
              >
                {selectedAvatar === av.name ? "◉ INSPECTING" : "INSPECT BRAIN"}
              </button>
            </div>
          ))}
        </div>

        {/* Brain state detail panel (inline, not overlay — to stay within flex column) */}
        {selectedAvatar && (
          <div
            data-ocid="chamber.brain_detail.panel"
            style={{
              margin: "0 20px 14px",
              background: "oklch(0.035 0.015 250)",
              border: "1px solid rgba(99,102,241,0.35)",
              padding: "14px",
              boxShadow: "0 0 24px rgba(99,102,241,0.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <div>
                <span
                  style={{
                    color: "oklch(0.72 0.28 270)",
                    fontFamily: "JetBrains Mono",
                    fontSize: "11px",
                    fontWeight: 900,
                    letterSpacing: "0.2em",
                  }}
                >
                  {selectedAvatar}
                </span>
                <span
                  style={{
                    color: "oklch(0.4 0.06 270)",
                    fontFamily: "JetBrains Mono",
                    fontSize: "8px",
                    letterSpacing: "0.18em",
                    marginLeft: "10px",
                  }}
                >
                  BRAIN STATE DETAIL
                </span>
              </div>
              <button
                type="button"
                data-ocid="chamber.brain_detail.close_button"
                onClick={() => setSelectedAvatar(null)}
                style={{
                  padding: "4px 12px",
                  background: "transparent",
                  border: "1px solid oklch(0.2 0.04 240)",
                  color: "oklch(0.45 0.06 240)",
                  fontFamily: "JetBrains Mono",
                  fontSize: "8px",
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                }}
              >
                CLOSE
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              {/* Full brain chip expanded */}
              <div
                style={{
                  background: "oklch(0.025 0.01 240)",
                  border: "1px solid oklch(0.1 0.015 240)",
                  padding: "10px",
                }}
              >
                <AvatarBrainChip entityId={selectedAvatar.toLowerCase()} />
              </div>
              {/* Stats sidebar */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {(
                  [
                    ["SUBJECT", selectedAvatar],
                    ["ENTITY ID", selectedAvatar.toLowerCase()],
                    ["HEARTBEAT", "873ms"],
                    ["COUPLING", "PHI⁴ PHASE-LOCK"],
                    ["STATUS", "ACTIVE TARGET"],
                  ] as [string, string][]
                ).map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "5px 8px",
                      background: "oklch(0.04 0.012 240)",
                      border: "1px solid oklch(0.09 0.015 240)",
                    }}
                  >
                    <span
                      style={{
                        color: "oklch(0.38 0.05 220)",
                        fontFamily: "JetBrains Mono",
                        fontSize: "7px",
                        letterSpacing: "0.12em",
                      }}
                    >
                      {k}
                    </span>
                    <span
                      style={{
                        color: "oklch(0.72 0.28 270)",
                        fontFamily: "JetBrains Mono",
                        fontSize: "8px",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Experiment controls */}
        <div
          data-ocid="chamber.experiment_controls"
          style={{
            margin: "0 20px 14px",
            background: "oklch(0.04 0.015 240)",
            border: "1px solid rgba(99,102,241,0.25)",
            padding: "14px",
          }}
        >
          <div
            style={{
              color: "oklch(0.72 0.28 270)",
              fontFamily: "JetBrains Mono",
              fontSize: "9px",
              letterSpacing: "0.25em",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            RUN CHAMBER EXPERIMENT
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: "10px",
              alignItems: "flex-end",
            }}
          >
            {/* Compound selector */}
            <div>
              <label
                style={{
                  display: "block",
                  color: "oklch(0.42 0.06 240)",
                  fontFamily: "JetBrains Mono",
                  fontSize: "7px",
                  letterSpacing: "0.15em",
                  marginBottom: "5px",
                }}
                htmlFor="chamber-compound-select"
              >
                SELECT COMPOUND
              </label>
              <select
                id="chamber-compound-select"
                data-ocid="chamber.compound.select"
                value={selectedCompound}
                onChange={(e) => setSelectedCompound(e.target.value)}
                style={{
                  width: "100%",
                  background: "oklch(0.03 0.01 240)",
                  border: "1px solid oklch(0.15 0.02 240)",
                  color: "oklch(0.82 0.04 215)",
                  fontFamily: "JetBrains Mono",
                  fontSize: "8px",
                  padding: "6px 8px",
                  outline: "none",
                  cursor: "pointer",
                  letterSpacing: "0.08em",
                }}
              >
                <option value="">— choose —</option>
                {[
                  "Triaxion-47",
                  "Nexopril-8",
                  "Cortimaze",
                  "Dopavance",
                  "Serotomax",
                  "GABAlex",
                  "Glutatrace",
                  "Noradrenex",
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Avatar selector */}
            <div>
              <label
                style={{
                  display: "block",
                  color: "oklch(0.42 0.06 240)",
                  fontFamily: "JetBrains Mono",
                  fontSize: "7px",
                  letterSpacing: "0.15em",
                  marginBottom: "5px",
                }}
                htmlFor="chamber-target-select"
              >
                TARGET SUBJECT
              </label>
              <select
                id="chamber-target-select"
                data-ocid="chamber.target_avatar.select"
                value={targetAvatar}
                onChange={(e) => setTargetAvatar(e.target.value)}
                style={{
                  width: "100%",
                  background: "oklch(0.03 0.01 240)",
                  border: "1px solid oklch(0.15 0.02 240)",
                  color: "oklch(0.82 0.04 215)",
                  fontFamily: "JetBrains Mono",
                  fontSize: "8px",
                  padding: "6px 8px",
                  outline: "none",
                  cursor: "pointer",
                  letterSpacing: "0.08em",
                }}
              >
                <option value="">— choose —</option>
                {["NEXUS", "COGNUS", "VERITAS", "ESURIENS"].map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Fire button */}
            <button
              type="button"
              data-ocid="chamber.fire_experiment.button"
              disabled={!selectedCompound || !targetAvatar || chamberLoading}
              onClick={async () => {
                if (!selectedCompound || !targetAvatar) return;
                setChamberLoading(true);
                await new Promise((r) => setTimeout(r, 1500));
                const delta =
                  Math.round(
                    Math.sin(hashCode(selectedCompound + targetAvatar) * 0.1) *
                      100,
                  ) / 2; // -50..+50
                const regions = [
                  "Prefrontal Cortex",
                  "Hippocampal Temple",
                  "Amygdala Vigilans",
                  "Thalamic Relay",
                  "Salience Network",
                  "Basal Ganglia",
                ];
                const domIdx =
                  hashCode(selectedCompound + targetAvatar) % regions.length;
                setExperimentResult({
                  compound: selectedCompound,
                  avatar: targetAvatar,
                  timestamp: new Date().toISOString(),
                  deltaScore: delta,
                  dominantRegion: regions[domIdx] ?? "Prefrontal Cortex",
                  outcome: delta > 0 ? "EXCITATORY" : "INHIBITORY",
                  status: "COMPLETE",
                });
                setChamberLoading(false);
              }}
              style={{
                padding: "6px 18px",
                background: chamberLoading
                  ? "oklch(0.12 0.04 270)"
                  : "oklch(0.14 0.08 270)",
                border: "1px solid oklch(0.45 0.28 270)",
                color:
                  !selectedCompound || !targetAvatar
                    ? "oklch(0.35 0.06 270)"
                    : "oklch(0.88 0.28 270)",
                fontFamily: "JetBrains Mono",
                fontSize: "8px",
                letterSpacing: "0.2em",
                cursor:
                  !selectedCompound || !targetAvatar || chamberLoading
                    ? "not-allowed"
                    : "pointer",
                boxShadow:
                  selectedCompound && targetAvatar && !chamberLoading
                    ? "0 0 12px oklch(0.45 0.28 270 / 0.4)"
                    : "none",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
                alignSelf: "flex-end",
              }}
            >
              {chamberLoading ? "◉ FIRING…" : "⚡ FIRE EXPERIMENT"}
            </button>
          </div>
        </div>

        {/* Experiment result card */}
        {experimentResult && (
          <div
            data-ocid="chamber.result.card"
            style={{
              margin: "0 20px 20px",
              background:
                experimentResult.outcome === "EXCITATORY"
                  ? "oklch(0.04 0.03 140)"
                  : "oklch(0.04 0.03 25)",
              border: `1px solid ${
                experimentResult.outcome === "EXCITATORY"
                  ? "oklch(0.45 0.20 140)"
                  : "oklch(0.45 0.22 25)"
              }`,
              padding: "14px",
              boxShadow: `0 0 20px ${
                experimentResult.outcome === "EXCITATORY"
                  ? "oklch(0.45 0.20 140 / 0.2)"
                  : "oklch(0.45 0.22 25 / 0.2)"
              }`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "12px",
              }}
            >
              <div>
                <div
                  style={{
                    color:
                      experimentResult.outcome === "EXCITATORY"
                        ? "oklch(0.68 0.28 140)"
                        : "oklch(0.65 0.25 25)",
                    fontFamily: "JetBrains Mono",
                    fontSize: "9px",
                    fontWeight: 900,
                    letterSpacing: "0.2em",
                  }}
                >
                  EXPERIMENT RESULT — {experimentResult.compound} on{" "}
                  {experimentResult.avatar}
                </div>
                <div
                  style={{
                    color: "oklch(0.35 0.04 220)",
                    fontFamily: "JetBrains Mono",
                    fontSize: "7px",
                    letterSpacing: "0.1em",
                    marginTop: "2px",
                  }}
                >
                  {experimentResult.timestamp}
                </div>
              </div>
              <button
                type="button"
                data-ocid="chamber.result.clear_button"
                onClick={() => setExperimentResult(null)}
                style={{
                  padding: "3px 10px",
                  background: "transparent",
                  border: "1px solid oklch(0.2 0.04 240)",
                  color: "oklch(0.4 0.05 240)",
                  fontFamily: "JetBrains Mono",
                  fontSize: "7px",
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                }}
              >
                CLEAR RESULT
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "8px",
              }}
            >
              {(
                [
                  [
                    "DELTA SCORE",
                    `${experimentResult.deltaScore > 0 ? "+" : ""}${experimentResult.deltaScore.toFixed(1)}`,
                    experimentResult.outcome === "EXCITATORY"
                      ? "oklch(0.68 0.28 140)"
                      : "oklch(0.65 0.25 25)",
                  ],
                  [
                    "OUTCOME",
                    experimentResult.outcome,
                    experimentResult.outcome === "EXCITATORY"
                      ? "oklch(0.68 0.28 140)"
                      : "oklch(0.65 0.25 25)",
                  ],
                  [
                    "DOMINANT REGION",
                    experimentResult.dominantRegion,
                    "oklch(0.72 0.22 65)",
                  ],
                  ["STATUS", experimentResult.status, "oklch(0.72 0.22 195)"],
                ] as [string, string, string][]
              ).map(([label, value, color]) => (
                <div
                  key={label}
                  style={{
                    padding: "7px 10px",
                    background: "oklch(0.03 0.01 240)",
                    border: "1px solid oklch(0.09 0.015 240)",
                  }}
                >
                  <div
                    style={{
                      color: "oklch(0.35 0.04 220)",
                      fontFamily: "JetBrains Mono",
                      fontSize: "7px",
                      letterSpacing: "0.12em",
                      marginBottom: "3px",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      color,
                      fontFamily: "JetBrains Mono",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM CONTROL BAR */}
      <div
        data-ocid="lab.control_bar"
        style={{
          height: "46px",
          flexShrink: 0,
          background: CSS.panel,
          borderTop: `1px solid ${CSS.border}`,
          display: "flex",
          alignItems: "center",
          gap: "0",
          padding: "0 8px",
        }}
      >
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {modeButtons.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              data-ocid={`lab.mode.${id}.button`}
              onClick={() => {
                setLabMode(id);
                if (id === "spawn") setShowSpawn(true);
              }}
              style={{
                padding: "6px 14px",
                background: labMode === id ? `${CSS.gold}18` : "transparent",
                border: `1px solid ${labMode === id ? CSS.gold : CSS.border}`,
                color: labMode === id ? CSS.gold : CSS.textDim,
                fontFamily: "JetBrains Mono",
                fontSize: "8px",
                letterSpacing: "0.18em",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: labMode === id ? `0 0 8px ${CSS.gold}30` : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          style={{
            width: "1px",
            height: "20px",
            background: CSS.border,
            margin: "0 10px",
          }}
        />

        <div
          style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1 }}
        >
          <span
            style={{
              color: CSS.textDim,
              fontFamily: "JetBrains Mono",
              fontSize: "7px",
              letterSpacing: "0.12em",
              flexShrink: 0,
            }}
          >
            EXTERNAL LAB
          </span>
          <input
            type="text"
            data-ocid="lab.external_url.input"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            placeholder="Enter external lab endpoint URL"
            style={{
              flex: 1,
              background: CSS.bg,
              border: `1px solid ${CSS.border}`,
              color: CSS.text,
              fontFamily: "JetBrains Mono",
              fontSize: "8px",
              padding: "4px 8px",
              outline: "none",
              letterSpacing: "0.05em",
              minWidth: 0,
            }}
          />
          <button
            type="button"
            data-ocid="lab.external_test.button"
            onClick={handleTestExternal}
            disabled={!externalUrl || externalStatus === "testing"}
            style={{
              padding: "5px 10px",
              background: "transparent",
              border: `1px solid ${externalStatus === "ok" ? CSS.green : externalStatus === "fail" ? CSS.red : CSS.border}`,
              color:
                externalStatus === "ok"
                  ? CSS.green
                  : externalStatus === "fail"
                    ? CSS.red
                    : CSS.textDim,
              fontFamily: "JetBrains Mono",
              fontSize: "7px",
              letterSpacing: "0.12em",
              cursor:
                !externalUrl || externalStatus === "testing"
                  ? "not-allowed"
                  : "pointer",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            {externalStatus === "testing"
              ? "CONNECTING…"
              : externalStatus === "ok"
                ? "✓ LINKED"
                : externalStatus === "fail"
                  ? "✗ FAILED"
                  : "TEST"}
          </button>
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background:
                externalStatus === "ok"
                  ? CSS.green
                  : externalStatus === "fail"
                    ? CSS.red
                    : CSS.dim,
              boxShadow:
                externalStatus === "ok" ? `0 0 6px ${CSS.green}` : "none",
              flexShrink: 0,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            paddingLeft: "10px",
            borderLeft: `1px solid ${CSS.border}`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: CSS.cyan,
              boxShadow: `0 0 6px ${CSS.cyan}`,
              animation: "lab-pulse 873ms ease-in-out infinite",
            }}
          />
          <span
            style={{
              color: CSS.cyan,
              fontFamily: "JetBrains Mono",
              fontSize: "8px",
              letterSpacing: "0.1em",
            }}
          >
            {pulse.beat.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
