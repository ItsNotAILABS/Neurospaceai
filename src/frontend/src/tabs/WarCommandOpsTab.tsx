import { Html, OrbitControls } from "@react-three/drei";
/**
 * WarCommandOpsTab.tsx
 * Full WarCommandOps 3D command theater — dark amber/gold aesthetic.
 * 9 command nodes driven by Core Brain via liveBrainBus.
 */
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { liveBrainBus } from "../utils/liveBrainBus";
import {
  type CommandNode,
  type TheaterState,
  globalWarCommandOpsRuntime,
} from "../utils/warCommandOpsRuntime";

// ──────────────────────────────────────────────────────────────────────────────
const FACTION_COLORS: Record<string, string> = {
  delta: "#f59e0b",
  alpha: "#3b82f6",
  omega: "#ef4444",
};

const LAYER_RADIUS: Record<string, number> = {
  theater: 3.5,
  operational: 2.5,
  regional: 1.8,
};

function pct(v: number) {
  return `${(v * 100).toFixed(0)}%`;
}

const BAR = (val: number, color: string) => ({
  width: `${(val * 100).toFixed(0)}%`,
  height: 5,
  background: color,
  borderRadius: 1,
  transition: "width 0.3s ease",
});

// ──────────────────────────────────────────────────────────────────────────────
// Theater ground
function TheaterGround() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[300, 300, 40, 40]} />
        <meshStandardMaterial color="#0a1a0a" roughness={0.95} />
      </mesh>
      {/* Grid lines */}
      {Array.from({ length: 13 }, (_, i) => i * 25 - 150).map((x) => (
        <mesh
          key={`gx-${x}`}
          position={[x, 0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.15, 300]} />
          <meshStandardMaterial color="#1a2a1a" transparent opacity={0.5} />
        </mesh>
      ))}
      {Array.from({ length: 13 }, (_, i) => i * 25 - 150).map((z) => (
        <mesh
          key={`gz-${z}`}
          position={[0, 0.01, z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[300, 0.15]} />
          <meshStandardMaterial color="#1a2a1a" transparent opacity={0.5} />
        </mesh>
      ))}
    </>
  );
}

function SupplyDepots() {
  const depots = useMemo(
    () => [
      { x: -60, z: 0 },
      { x: 30, z: -80 },
      { x: 20, z: 80 },
    ],
    [],
  );
  return (
    <>
      {depots.map((d, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static useMemo array
        <group key={i} position={[d.x, 0, d.z]}>
          <mesh position={[0, 2, 0]}>
            <boxGeometry args={[6, 4, 6]} />
            <meshStandardMaterial
              color="#1a3a1a"
              emissive="#15803d"
              emissiveIntensity={0.3}
            />
          </mesh>
          <pointLight
            color="#22c55e"
            intensity={1.5}
            distance={15}
            position={[0, 5, 0]}
          />
        </group>
      ))}
    </>
  );
}

function ContestedZones() {
  const zones = useMemo(
    () => [
      { x: -10, z: -30 },
      { x: 15, z: 40 },
    ],
    [],
  );
  const [pulse, setPulse] = useState(0);
  useFrame((_, dt) => setPulse((p) => p + dt * 2));

  return (
    <>
      {zones.map((z) => (
        <mesh
          key={`zone-${z.x.toFixed(0)}-${z.z.toFixed(0)}`}
          position={[z.x, 0.1, z.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <sphereGeometry args={[4 + Math.sin(pulse) * 0.5, 16, 16]} />
          <meshStandardMaterial
            color="#eab308"
            emissive="#ca8a04"
            emissiveIntensity={0.5 + Math.sin(pulse) * 0.3}
            transparent
            opacity={0.35}
          />
        </mesh>
      ))}
    </>
  );
}

function ConnectionLines({ nodes }: { nodes: CommandNode[] }) {
  const lines = useMemo(() => {
    const pairs: Array<[CommandNode, CommandNode]> = [];
    // Theater → Operational connections
    const theaters = nodes.filter((n) => n.layer === "theater");
    const ops = nodes.filter((n) => n.layer === "operational");
    const regionals = nodes.filter((n) => n.layer === "regional");
    for (const t of theaters) {
      for (const o of ops) {
        if (o.faction === t.faction) pairs.push([t, o]);
      }
    }
    for (const o of ops) {
      for (const r of regionals) {
        if (r.faction === o.faction) pairs.push([o, r]);
      }
    }
    return pairs;
  }, [nodes]);

  return (
    <>
      {lines.map(([a, b], i) => {
        const start = new THREE.Vector3(...a.position);
        const end = new THREE.Vector3(...b.position);
        const dir = end.clone().sub(start);
        const mid = start.clone().add(dir.clone().multiplyScalar(0.5));
        const len = dir.length();
        const up = new THREE.Vector3(0, 1, 0);
        const quat = new THREE.Quaternion().setFromUnitVectors(
          up,
          dir.clone().normalize(),
        );
        const color = FACTION_COLORS[a.faction] ?? "#ffffff";
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: stable computed pairs
          <mesh key={i} position={mid} quaternion={quat}>
            <cylinderGeometry args={[0.12, 0.12, len, 6]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.4}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}
    </>
  );
}

function CommandNodeMesh({
  node,
  selected,
  onClick,
}: {
  node: CommandNode;
  selected: boolean;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [t, setT] = useState(0);
  useFrame((_, dt) => setT((prev) => prev + dt));

  const r = LAYER_RADIUS[node.layer] ?? 2;
  const h =
    node.layer === "theater" ? 6 : node.layer === "operational" ? 4 : 2.5;
  const color = FACTION_COLORS[node.faction] ?? "#ffffff";
  const scale = 1 + Math.sin(t * 1.5) * 0.04;

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Three.js canvas element
    <group
      ref={groupRef}
      position={node.position}
      scale={[scale, 1, scale]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Hexagonal prism body */}
      <mesh position={[0, h / 2, 0]} castShadow>
        <cylinderGeometry args={[r, r * 1.1, h, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={
            selected ? 0.8 : 0.25 + node.metaAwarenessScore * 0.3
          }
          metalness={0.3}
          roughness={0.6}
        />
      </mesh>
      {/* Glow ring */}
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[r * 1.1, r * 1.5, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5 + Math.sin(t) * 0.2}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Point light */}
      <pointLight
        color={color}
        intensity={2 + node.burdenLevel}
        distance={20}
        position={[0, h, 0]}
      />
      {/* Label */}
      <Html
        position={[0, h + 2.5, 0]}
        center
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            color,
            letterSpacing: 1,
            whiteSpace: "nowrap",
            textShadow: `0 0 8px ${color}`,
            background: "rgba(0,0,0,0.5)",
            padding: "2px 6px",
          }}
        >
          {node.name.split(" ").slice(0, 2).join(" ")}
        </div>
      </Html>
      {/* Selection ring */}
      {selected && (
        <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r * 1.6, r * 2, 32]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={1.5}
          />
        </mesh>
      )}
    </group>
  );
}

function TheaterScene({
  theaterState,
  selectedId,
  onSelectNode,
}: {
  theaterState: TheaterState;
  selectedId: string | null;
  onSelectNode: (id: string | null) => void;
}) {
  return (
    <>
      <color attach="background" args={["#04080d"]} />
      <fog attach="fog" args={["#0d1117", 45, 220]} />
      <ambientLight intensity={0.15} color="#2a3040" />
      <directionalLight
        position={[50, 80, 30]}
        intensity={0.8}
        color="#c8a860"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight
        position={[-30, 30, -40]}
        intensity={0.3}
        color="#405060"
      />

      <TheaterGround />
      <SupplyDepots />
      <ContestedZones />
      <ConnectionLines nodes={theaterState.nodes} />

      {theaterState.nodes.map((node) => (
        <CommandNodeMesh
          key={node.id}
          node={node}
          selected={selectedId === node.id}
          onClick={() => onSelectNode(selectedId === node.id ? null : node.id)}
        />
      ))}

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI / 2.3}
        minDistance={10}
        maxDistance={200}
      />
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Command Node Inspection Panel
function NodePanel({
  node,
  traces,
  onClose,
}: {
  node: CommandNode;
  traces: TheaterState["traceLog"];
  onClose: () => void;
}) {
  const recent = traces.filter((t) => t.nodeId === node.id).slice(0, 3);
  const factionColor = FACTION_COLORS[node.faction] ?? "#ffffff";

  return (
    <div
      data-ocid="warcommandops.node_panel"
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        width: 296,
        background: "rgba(4,8,13,0.93)",
        border: `1px solid ${factionColor}22`,
        borderLeft: `3px solid ${factionColor}`,
        padding: "14px",
        fontFamily: "monospace",
        fontSize: 11,
        color: "#c8c0a8",
        backdropFilter: "blur(8px)",
        zIndex: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div>
          <div
            style={{
              color: factionColor,
              fontSize: 12,
              fontWeight: "bold",
              letterSpacing: 1,
            }}
          >
            {node.name}
          </div>
          <div style={{ color: "#64748b", fontSize: 9 }}>
            {node.layer.toUpperCase()} · {node.faction.toUpperCase()}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: "transparent",
            border: "1px solid #374151",
            color: "#94a3b8",
            padding: "2px 8px",
            cursor: "pointer",
            fontSize: 10,
          }}
        >
          CLOSE
        </button>
      </div>

      {/* Meta-awareness */}
      <div
        style={{
          marginBottom: 10,
          padding: "6px 8px",
          background: "rgba(245,158,11,0.07)",
          border: "1px solid #92400e33",
        }}
      >
        <div
          style={{
            color: "#92400e",
            fontSize: 9,
            letterSpacing: 1,
            marginBottom: 4,
          }}
        >
          META-AWARENESS
        </div>
        <div style={{ background: "#1e293b", borderRadius: 1 }}>
          <div style={BAR(node.metaAwarenessScore, factionColor)} />
        </div>
        <div style={{ color: factionColor, fontSize: 10, marginTop: 3 }}>
          {pct(node.metaAwarenessScore)}
        </div>
      </div>

      {/* State bars */}
      {[
        { label: "BURDEN", val: node.burdenLevel, color: "#ef4444" },
        { label: "UNCERTAINTY", val: node.uncertaintyLevel, color: "#f59e0b" },
        { label: "SUPPLY", val: node.supplyStatus, color: "#22c55e" },
        { label: "MORALE", val: node.morale, color: "#3b82f6" },
      ].map(({ label, val, color }) => (
        <div key={label} style={{ marginBottom: 6 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <span style={{ color: "#64748b", fontSize: 9 }}>{label}</span>
            <span style={{ color }}>{pct(val)}</span>
          </div>
          <div style={{ background: "#1e293b", borderRadius: 1 }}>
            <div style={BAR(val, color)} />
          </div>
        </div>
      ))}

      {/* Brain action */}
      <div
        style={{
          marginBottom: 10,
          padding: "6px 8px",
          background: "#0a0f18",
          border: "1px solid #1e293b",
        }}
      >
        <div
          style={{
            color: "#64748b",
            fontSize: 9,
            letterSpacing: 1,
            marginBottom: 4,
          }}
        >
          LAST BRAIN ACTION
        </div>
        <div style={{ color: factionColor, fontSize: 12, fontWeight: "bold" }}>
          {node.lastActionType}
        </div>
        <div style={{ marginTop: 4, background: "#1e293b", borderRadius: 1 }}>
          <div style={BAR(node.lastConfidence, "#3b82f6")} />
        </div>
        <div style={{ color: "#64748b", fontSize: 9, marginTop: 2 }}>
          CONFIDENCE {pct(node.lastConfidence)}
        </div>
      </div>

      {/* Objectives */}
      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            color: "#64748b",
            fontSize: 9,
            letterSpacing: 1,
            marginBottom: 6,
          }}
        >
          OBJECTIVES
        </div>
        {node.objectives.map((obj) => (
          <div
            key={obj}
            style={{ fontSize: 9, color: "#94a3b8", marginBottom: 3 }}
          >
            ◦ {obj}
          </div>
        ))}
      </div>

      {/* Recent traces */}
      {recent.length > 0 && (
        <div style={{ borderTop: "1px solid #1e293b", paddingTop: 8 }}>
          <div
            style={{
              color: "#64748b",
              fontSize: 9,
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            RECENT TRACES
          </div>
          {recent.map((t, _i) => (
            <div
              key={t.nodeId + String(t.tick) + t.actionType}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 3,
                fontSize: 9,
                color:
                  t.outcome === "success"
                    ? "#22c55e"
                    : t.outcome === "failure"
                      ? "#ef4444"
                      : "#94a3b8",
              }}
            >
              <span>
                T{t.tick} {t.actionType}
              </span>
              <span>
                MA:{(t.metaAwarenessScore * 100).toFixed(0)}%{" "}
                {t.outcome.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Benchmark Panel
function BenchmarkPanel({ state }: { state: TheaterState }) {
  const maxScore = Math.max(
    state.deltaScore,
    state.alphaScore,
    state.omegaScore,
    1,
  );
  const entries = [
    { label: "DELTA", score: state.deltaScore, color: "#f59e0b" },
    { label: "ALPHA", score: state.alphaScore, color: "#3b82f6" },
    { label: "OMEGA", score: state.omegaScore, color: "#ef4444" },
  ];
  const leader = entries.reduce(
    (a, b) => (b.score > a.score ? b : a),
    entries[0],
  );

  return (
    <div
      data-ocid="warcommandops.benchmark_panel"
      style={{
        position: "absolute",
        bottom: 48,
        left: 16,
        width: 220,
        background: "rgba(4,8,13,0.88)",
        border: "1px solid #92400e33",
        padding: "12px",
        fontFamily: "monospace",
        fontSize: 10,
        backdropFilter: "blur(6px)",
        zIndex: 10,
      }}
    >
      <div
        style={{
          color: "#92400e",
          fontSize: 9,
          letterSpacing: 1,
          marginBottom: 10,
        }}
      >
        BENCHMARK COMPARISON
      </div>
      {entries.map(({ label, score, color }) => (
        <div key={label} style={{ marginBottom: 8 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 3,
            }}
          >
            <span
              style={{
                color: label === leader.label ? color : "#64748b",
                fontWeight: label === leader.label ? "bold" : "normal",
              }}
            >
              {label} {label === leader.label ? "LEADING" : ""}
            </span>
            <span style={{ color }}>{score.toFixed(1)}</span>
          </div>
          <div style={{ background: "#1e293b", borderRadius: 1 }}>
            <div
              style={{
                width: `${((score / maxScore) * 100).toFixed(0)}%`,
                height: 6,
                background: color,
                borderRadius: 1,
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Theater-level status bar
function TheaterStatusBar({ state }: { state: TheaterState }) {
  const bus = liveBrainBus.getBusStatus();
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(4,8,13,0.92)",
        borderTop: "1px solid #92400e33",
        padding: "6px 16px",
        display: "flex",
        gap: 24,
        alignItems: "center",
        fontFamily: "monospace",
        fontSize: 10,
        color: "#64748b",
        backdropFilter: "blur(4px)",
        zIndex: 10,
        flexWrap: "wrap",
      }}
    >
      <span style={{ color: "#f59e0b" }}>WARCOMMANDOPS</span>
      <span>
        TICK <span style={{ color: "#94a3b8" }}>{state.tick}</span>
      </span>
      <span>
        PRESSURE{" "}
        <span
          style={{
            color: state.strategicPressure > 0.6 ? "#ef4444" : "#f59e0b",
          }}
        >
          {pct(state.strategicPressure)}
        </span>
      </span>
      <span>
        LOGISTICS{" "}
        <span
          style={{ color: state.logisticsHealth > 0.5 ? "#22c55e" : "#f59e0b" }}
        >
          {pct(state.logisticsHealth)}
        </span>
      </span>
      <span>
        UNCERTAINTY{" "}
        <span style={{ color: "#94a3b8" }}>
          {pct(state.sensingUncertainty)}
        </span>
      </span>
      <span style={{ color: bus.isActive ? "#22c55e" : "#475569" }}>
        BRAIN BUS {bus.isActive ? "LIVE" : "OFF"}
      </span>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Start Menu
function WarCommandOpsStartMenu({ onEnter }: { onEnter: () => void }) {
  const bus = liveBrainBus.getBusStatus();
  return (
    <div
      style={{
        height: "100%",
        background: "#04080d",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "monospace",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Hex grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(245,158,11,0.06) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          pointerEvents: "none",
        }}
      />

      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div
          style={{
            fontSize: 9,
            color: "#92400e",
            letterSpacing: 8,
            marginBottom: 12,
            opacity: 0.8,
          }}
        >
          NEUROEMERGENCE CORE
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: "bold",
            color: "#e2e8f0",
            letterSpacing: 4,
            lineHeight: 1.1,
          }}
        >
          EMERGENT
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: "bold",
            color: "#f59e0b",
            letterSpacing: 4,
            marginBottom: 6,
          }}
        >
          WARCOMMANDOPS
        </div>
        <div
          style={{
            fontSize: 10,
            color: "#64748b",
            letterSpacing: 3,
            marginBottom: 40,
          }}
        >
          STRATEGIC AI · 9 COMMAND NODES · 3-FACTION BENCHMARK
        </div>

        <div
          style={{
            display: "flex",
            gap: 24,
            justifyContent: "center",
            marginBottom: 40,
            padding: "12px 24px",
            background: "rgba(245,158,11,0.05)",
            border: "1px solid #92400e33",
          }}
        >
          <span
            style={{ fontSize: 9, color: bus.isActive ? "#22c55e" : "#475569" }}
          >
            ● CORE {bus.isActive ? "LIVE" : "OFFLINE"}
          </span>
          <span style={{ fontSize: 9, color: "#475569" }}>9 NODES</span>
          <span style={{ fontSize: 9, color: "#475569" }}>
            DELTA · ALPHA · OMEGA
          </span>
        </div>

        <button
          type="button"
          data-ocid="warcommandops.observer_button"
          onClick={onEnter}
          style={{
            background: "transparent",
            border: "2px solid #f59e0b",
            color: "#f59e0b",
            padding: "14px 48px",
            fontSize: 14,
            letterSpacing: 4,
            cursor: "pointer",
            fontFamily: "monospace",
            transition: "all 0.2s",
            marginBottom: 16,
            display: "block",
            width: "100%",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(245,158,11,0.15)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
          }}
        >
          ENTER THEATER
        </button>

        <div style={{ fontSize: 9, color: "#374151", letterSpacing: 2 }}>
          THEATER · OPERATIONAL · REGIONAL COMMAND LAYERS
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Theater World component
function TheaterWorld() {
  const [theaterState, setTheaterState] = useState<TheaterState>(() => {
    if (!globalWarCommandOpsRuntime.isInitialized()) {
      globalWarCommandOpsRuntime.init();
    }
    return (
      globalWarCommandOpsRuntime.getState() ?? {
        tick: 0,
        sessionId: "init",
        nodes: [],
        deltaScore: 0,
        alphaScore: 0,
        omegaScore: 0,
        strategicPressure: 0,
        logisticsHealth: 1,
        sensingUncertainty: 0,
        traceLog: [],
      }
    );
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = globalWarCommandOpsRuntime.tick(800);
      setTheaterState({ ...next });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const selectedNode = selectedId
    ? (theaterState.nodes.find((n) => n.id === selectedId) ?? null)
    : null;

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <Canvas
        camera={{ position: [0, 110, 130], fov: 52 }}
        shadows
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <TheaterScene
            theaterState={theaterState}
            selectedId={selectedId}
            onSelectNode={setSelectedId}
          />
        </Suspense>
      </Canvas>

      {selectedNode && (
        <NodePanel
          node={selectedNode}
          traces={theaterState.traceLog}
          onClose={() => setSelectedId(null)}
        />
      )}

      <BenchmarkPanel state={theaterState} />
      <TheaterStatusBar state={theaterState} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Root export
export default function WarCommandOpsTab() {
  const [mode, setMode] = useState<"menu" | "theater">("menu");

  return (
    <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
      {mode === "menu" && (
        <WarCommandOpsStartMenu onEnter={() => setMode("theater")} />
      )}
      {mode === "theater" && <TheaterWorld />}
    </div>
  );
}
