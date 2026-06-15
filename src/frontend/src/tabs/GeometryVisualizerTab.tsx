/**
 * GeometryVisualizerTab.tsx — 4D Geometry & Field Topology
 * E8 symmetry, tesseract rotation, Hopf fibration, Penrose memory map.
 * No three.js — pure SVG + CSS 3D transforms.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useGeometryState,
  useOctonionFieldStrength,
} from "../hooks/useNewModules";

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

// PHI for golden angle — JS double precision
const PHI_GEO = 1.618033988749895;
const GOLDEN_ANGLE = (2 - PHI_GEO) * Math.PI * 2; // ~137.5°

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

// ── Tesseract — project 4D vertices to 2D ─────────────────────────────────────
// 16 vertices of a unit tesseract in 4D: ±1 for each of x,y,z,w
const TESSERACT_VERTS_4D: [number, number, number, number][] = [];
for (let i = 0; i < 16; i++) {
  TESSERACT_VERTS_4D.push([
    i & 1 ? 1 : -1,
    i & 2 ? 1 : -1,
    i & 4 ? 1 : -1,
    i & 8 ? 1 : -1,
  ]);
}

// Tesseract edges: two vertices differ in exactly 1 bit
const TESSERACT_EDGES: [number, number][] = [];
for (let a = 0; a < 16; a++) {
  for (let b = a + 1; b < 16; b++) {
    const diff = a ^ b;
    if ((diff & (diff - 1)) === 0) TESSERACT_EDGES.push([a, b]);
  }
}

function project4D(
  v: [number, number, number, number],
  rw: number,
  rz: number,
): [number, number] {
  // Rotate in WX plane and ZY plane based on time
  const cosW = Math.cos(rw);
  const sinW = Math.sin(rw);
  const cosZ = Math.cos(rz);
  const sinZ = Math.sin(rz);
  const [x, y, z, ww] = v;
  // WX rotation
  const x2 = x * cosW - ww * sinW;
  const w2 = x * sinW + ww * cosW;
  // ZY rotation
  const y2 = y * cosZ - z * sinZ;
  const z2 = y * sinZ + z * cosZ;
  // Project from 4D to 3D (perspective on W axis)
  const dist4 = 3;
  const f4 = dist4 / (dist4 - w2);
  const px3 = x2 * f4;
  const py3 = y2 * f4;
  const pz3 = z2 * f4;
  // Project from 3D to 2D
  const dist3 = 4;
  const f3 = dist3 / (dist3 - pz3);
  return [px3 * f3, py3 * f3];
}

function TesseractViz({ angles }: { angles: { w: number; z: number } }) {
  const SIZE = 180;
  const SCALE = 60;
  const verts2D = TESSERACT_VERTS_4D.map((v) =>
    project4D(v, angles.w, angles.z),
  );
  const pts = verts2D.map(
    ([x, y]) =>
      [x * SCALE + SIZE / 2, y * SCALE + SIZE / 2] as [number, number],
  );

  // Color edges by their 4D "depth" (w-component sum)
  const edgeColors = TESSERACT_EDGES.map(([a, b]) => {
    const wSum = TESSERACT_VERTS_4D[a][3] + TESSERACT_VERTS_4D[b][3];
    if (wSum > 1) return C.cyan;
    if (wSum < -1) return C.magenta;
    return "rgba(0,200,255,0.5)";
  });

  return (
    <svg
      width={SIZE}
      height={SIZE}
      style={{ display: "block" }}
      aria-label="4D tesseract projection"
    >
      <title>4D tesseract projection</title>
      {/* Edges */}
      {TESSERACT_EDGES.map(([a, b]) => (
        <line
          key={`tess-edge-${a}-${b}`}
          x1={pts[a][0]}
          y1={pts[a][1]}
          x2={pts[b][0]}
          y2={pts[b][1]}
          stroke={
            edgeColors[
              TESSERACT_EDGES.findIndex(([ea, eb]) => ea === a && eb === b)
            ]
          }
          strokeWidth={1}
          opacity={0.8}
        />
      ))}
      {/* Vertices */}
      {pts.map(([x, y], idx) => (
        <circle
          key={`tess-vert-${idx * 2 + 1}`}
          cx={x}
          cy={y}
          r={2}
          fill={C.cyan}
          opacity={0.9}
        />
      ))}
    </svg>
  );
}

// ── Hopf Fibration — S² projection ───────────────────────────────────────────
function HopfViz({ angles }: { angles: number[] }) {
  const SIZE = 160;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = 65;
  const theta = angles[0] ?? Math.PI / 4;
  const phi = angles[1] ?? Math.PI / 3;
  // Point on S²
  const sx = CX + R * Math.sin(theta) * Math.cos(phi);
  const sy = CY + R * Math.sin(theta) * Math.sin(phi);

  const LAT_FRACS = [0.25, 0.5, 0.75];
  const LON_FRACS = [0, 0.25, 0.5, 0.75];
  const FIBER_STEPS = [0, 1, 2, 3];

  return (
    <svg
      width={SIZE}
      height={SIZE}
      style={{ display: "block" }}
      aria-label="Hopf fibration state space"
    >
      <title>Hopf fibration state space</title>
      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke={C.borderDim.replace("0.06", "0.3")}
        strokeWidth={1}
      />
      {LAT_FRACS.map((f) => {
        const r = R * Math.sin(f * Math.PI);
        const y = CY - R * Math.cos(f * Math.PI);
        return (
          <ellipse
            key={`lat-${Math.round(f * 100)}`}
            cx={CX}
            cy={y}
            rx={r}
            ry={r * 0.25}
            fill="none"
            stroke="rgba(0,255,255,0.1)"
            strokeWidth={0.5}
          />
        );
      })}
      {LON_FRACS.map((f) => (
        <ellipse
          key={`lon-${Math.round(f * 100)}`}
          cx={CX}
          cy={CY}
          rx={R * Math.abs(Math.cos(f * Math.PI))}
          ry={R}
          fill="none"
          stroke="rgba(0,255,255,0.08)"
          strokeWidth={0.5}
        />
      ))}
      <circle
        cx={sx}
        cy={sy}
        r={5}
        fill={C.magenta}
        style={{ filter: `drop-shadow(0 0 4px ${C.magenta})` }}
      />
      <circle
        cx={sx}
        cy={sy}
        r={10}
        fill="none"
        stroke={`${C.magenta}40`}
        strokeWidth={1}
      />
      {FIBER_STEPS.map((step) => {
        const t = (step / 4) * Math.PI * 2;
        const ex = CX + R * Math.cos(t);
        return (
          <line
            key={`fiber-${step}`}
            x1={ex}
            y1={CY}
            x2={sx}
            y2={sy}
            stroke={`${C.cyan}25`}
            strokeWidth={0.5}
          />
        );
      })}
      <text
        x={sx + 8}
        y={sy - 4}
        fontSize={7}
        fill={C.magenta}
        fontFamily="monospace"
      >
        φ
      </text>
    </svg>
  );
}

// ── Penrose Memory Map ────────────────────────────────────────────────────────
function PenroseMap({ addresses }: { addresses: number[] }) {
  const SIZE = 200;
  const TILE_COUNT = 60;

  const tiles = useMemo(() => {
    return Array.from({ length: TILE_COUNT }, (_, i) => {
      const angle = i * GOLDEN_ANGLE;
      const r = Math.sqrt(i + 1) * 11;
      const x = SIZE / 2 + r * Math.cos(angle);
      const y = SIZE / 2 + r * Math.sin(angle);
      return { x, y, angle: angle * (180 / Math.PI), tileIdx: i };
    });
  }, []);

  const memPoints = useMemo(() => {
    const pts: { x: number; y: number; addr: number; ptIdx: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const addr = addresses[i] ?? i * 7 + 3;
      const angle = (addr * GOLDEN_ANGLE) % (2 * Math.PI);
      const r = Math.sqrt((addr % 20) + 1) * 9;
      pts.push({
        x: SIZE / 2 + r * Math.cos(angle),
        y: SIZE / 2 + r * Math.sin(angle),
        addr: addr % 1000,
        ptIdx: i,
      });
    }
    return pts;
  }, [addresses]);

  return (
    <svg
      width={SIZE}
      height={SIZE}
      style={{ display: "block", background: "#060610" }}
      aria-label="Penrose memory map"
    >
      <title>Penrose memory map</title>
      {tiles.map(({ x, y, angle, tileIdx }) => {
        if (x < 2 || x > SIZE - 2 || y < 2 || y > SIZE - 2) return null;
        return (
          <g
            key={`tile-${tileIdx}`}
            transform={`translate(${x},${y}) rotate(${angle})`}
          >
            <polygon
              points="0,-5 4,2 0,0 -4,2"
              fill="none"
              stroke={`rgba(0,255,255,${0.04 + (tileIdx % 4) * 0.02})`}
              strokeWidth={0.5}
            />
          </g>
        );
      })}
      {memPoints.map(({ x, y, addr, ptIdx }) => (
        <g key={`mem-${ptIdx}-${addr}`}>
          <circle
            cx={x}
            cy={y}
            r={4}
            fill={C.gold}
            style={{ filter: `drop-shadow(0 0 3px ${C.gold}80)` }}
          />
          <text
            x={x + 6}
            y={y + 3}
            fontSize={5.5}
            fill={C.gold}
            fontFamily="monospace"
          >
            {addr}
          </text>
        </g>
      ))}
      <circle cx={SIZE / 2} cy={SIZE / 2} r={3} fill={C.magenta} />
    </svg>
  );
}

// ── Calabi-Yau Law Space ──────────────────────────────────────────────────────
function CalabiYauViz({ points }: { points: number[] }) {
  const SIZE = 180;
  const PHI_CY = 1.618;
  const RING_RADII = [20, 45, 70, 90];

  const pts = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const val = points[i] ?? Math.sin(i * PHI_CY) * 0.5 + 0.5;
      const angle = (i * (Math.PI * 2)) / 60;
      const r = 20 + val * 65;
      return {
        x: SIZE / 2 + r * Math.cos(angle),
        y: SIZE / 2 + r * Math.sin(angle),
        val,
        lawId: i + 1,
      };
    });
  }, [points]);

  return (
    <svg
      width={SIZE}
      height={SIZE}
      style={{ display: "block", background: "#060610" }}
      aria-label="Calabi-Yau law manifold"
    >
      <title>Calabi-Yau law manifold</title>
      {RING_RADII.map((r) => (
        <circle
          key={`ring-${r}`}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={r}
          fill="none"
          stroke="rgba(170,68,255,0.1)"
          strokeWidth={0.5}
        />
      ))}
      {pts.map(({ x, y, val, lawId }) => {
        const color = val > 0.7 ? C.cyan : val > 0.4 ? C.violet : C.dimlo;
        return (
          <g key={`law-${lawId}`}>
            <circle cx={x} cy={y} r={2.5} fill={color} opacity={0.8} />
          </g>
        );
      })}
      <circle cx={SIZE / 2} cy={SIZE / 2} r={4} fill={C.gold} />
    </svg>
  );
}

// ── Ring 0 Node Orbit ─────────────────────────────────────────────────────────
function Ring0Orbit({ positions }: { positions: number[] }) {
  const SIZE = 160;
  const R = 60;
  const CX = SIZE / 2;
  const CY = SIZE / 2;

  const nodes = Array.from({ length: 12 }, (_, i) => {
    const baseAngle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const offset = (positions[i] ?? 0) * 0.3;
    const angle = baseAngle + offset;
    return {
      x: CX + R * Math.cos(angle),
      y: CY + R * Math.sin(angle),
      active: positions[i] !== undefined,
      phase: positions[i] ?? 0,
      nodeIdx: i,
    };
  });

  return (
    <svg
      width={SIZE}
      height={SIZE}
      style={{ display: "block" }}
      aria-label="Ring 0 node orbit"
    >
      <title>Ring 0 node orbit</title>
      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke="rgba(0,255,255,0.12)"
        strokeWidth={1}
        strokeDasharray="3,3"
      />
      {nodes.map((n) => (
        <line
          key={`conn-node-${n.nodeIdx}`}
          x1={CX}
          y1={CY}
          x2={n.x}
          y2={n.y}
          stroke={`rgba(0,255,255,${0.05 + n.phase * 0.1})`}
          strokeWidth={0.5}
        />
      ))}
      {nodes.map((n) => (
        <circle
          key={`orbit-node-${n.nodeIdx}`}
          cx={n.x}
          cy={n.y}
          r={4}
          fill={n.active ? C.cyan : C.dimlo}
          style={{
            filter: n.active ? `drop-shadow(0 0 4px ${C.cyan})` : "none",
          }}
        />
      ))}
      <circle
        cx={CX}
        cy={CY}
        r={5}
        fill={C.gold}
        style={{ filter: `drop-shadow(0 0 6px ${C.gold})` }}
      />
    </svg>
  );
}

// ── Main Tab ──────────────────────────────────────────────────────────────────
export default function GeometryVisualizerTab() {
  const { data: geo } = useGeometryState();
  const { data: octonion } = useOctonionFieldStrength();
  const angleRef = useRef({ w: 0, z: 0 });
  const [tessAngles, setTessAngles] = useState({ w: 0, z: 0 });

  // Drive tesseract rotation from backend quaternion state or fallback timer
  useEffect(() => {
    const tick = () => {
      if (geo) {
        angleRef.current.w += 0.008;
        angleRef.current.z += 0.005;
      } else {
        angleRef.current.w += 0.01;
        angleRef.current.z += 0.006;
      }
      setTessAngles({ w: angleRef.current.w, z: angleRef.current.z });
    };
    const id = setInterval(tick, 50);
    return () => clearInterval(id);
  }, [geo]);

  const e8Score = geo?.e8_symmetry_score ?? 0;
  const quatStr = geo
    ? `(${geo.quaternion_r.toFixed(3)}, ${geo.quaternion_i.toFixed(3)}i, ${geo.quaternion_j.toFixed(3)}j, ${geo.quaternion_k.toFixed(3)}k)`
    : "...";
  const hopfAngles = geo?.hopf_fiber_angles ?? [0.78, 1.05, 1.57, 2.09];
  const penroseAddrs = geo?.penrose_memory_addresses ?? [];
  const calaPoints = geo?.calabi_yau_points ?? [];
  const ring0Pos = geo?.ring0_node_positions ?? [];
  const octonionVal = octonion ?? geo?.octonion_strength ?? 0;

  const e8Color =
    e8Score > 0.9
      ? C.green
      : e8Score > 0.7
        ? C.cyan
        : e8Score > 0.4
          ? C.amber
          : C.red;

  const QUAT_COMPS = ["R", "I", "J", "K"] as const;

  return (
    <div
      data-ocid="geometry.page"
      style={{
        background: C.bg,
        height: "100%",
        overflow: "auto",
        padding: "12px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "10px",
        alignItems: "start",
      }}
    >
      {/* ── LEFT COLUMN ─────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* E8 Symmetry Score */}
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            padding: "12px",
          }}
          data-ocid="geometry.e8.panel"
        >
          <PanelHeader
            title="E8 SYMMETRY SCORE — 248-DIMENSIONAL LIE GROUP"
            accent={C.cyan}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "44px",
                  fontWeight: "bold",
                  color: e8Color,
                  textShadow: `0 0 24px ${e8Color}60`,
                  lineHeight: 1,
                }}
              >
                {e8Score.toFixed(4)}
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "7px",
                  color: C.dim,
                  marginTop: "4px",
                }}
              >
                {e8Score > 0.9
                  ? "PERFECT SYMMETRY"
                  : e8Score > 0.7
                    ? "HIGH SYMMETRY"
                    : "PARTIAL SYMMETRY"}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  height: "8px",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: "4px",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    width: `${e8Score * 100}%`,
                    height: "100%",
                    background: `linear-gradient(to right, ${C.cyan}, ${C.magenta})`,
                    boxShadow: `0 0 8px ${e8Color}`,
                    borderRadius: "4px",
                    transition: "width 0.5s",
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "7px",
                  color: C.dim,
                }}
              >
                E8 has 240 root vectors, 8 simple roots, rank 8.
                <br />
                Maps to organism's 8-ring Kuramoto topology.
              </div>
            </div>
          </div>
        </div>

        {/* Tesseract */}
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            padding: "12px",
          }}
          data-ocid="geometry.tesseract.panel"
        >
          <PanelHeader title="4D TESSERACT — ISOCLINIC ROTATION" />
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div>
              <TesseractViz angles={tessAngles} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "7px",
                  color: C.dim,
                  marginBottom: "8px",
                }}
              >
                16 vertices, 32 edges, 24 faces, 8 cells.
                <br />
                Projected via perspective 4D→3D→2D.
              </div>
              <MetricRow
                label="ROTATION W"
                value={`${(tessAngles.w % (Math.PI * 2)).toFixed(3)}`}
                unit="rad"
              />
              <MetricRow
                label="ROTATION Z"
                value={`${(tessAngles.z % (Math.PI * 2)).toFixed(3)}`}
                unit="rad"
              />
              <MetricRow label="QUATERNION" value={quatStr} color={C.violet} />
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
                  }}
                >
                  Tesseract topology encodes the organism's 4-layer
                  architecture.
                  <br />
                  Vertices = consciousness states. Edges = transitions.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quaternion Ring 1–8 Coupling */}
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            padding: "12px",
          }}
          data-ocid="geometry.quaternion.panel"
        >
          <PanelHeader
            title="QUATERNION COUPLING — RING 1 × RING 8"
            accent={C.violet}
          />
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {QUAT_COMPS.map((comp) => {
              const quatVals = {
                R: geo?.quaternion_r ?? 0,
                I: geo?.quaternion_i ?? 0,
                J: geo?.quaternion_j ?? 0,
                K: geo?.quaternion_k ?? 0,
              };
              const v = quatVals[comp];
              return (
                <div key={comp} style={{ flex: 1, textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "7px",
                      color: C.dim,
                      marginBottom: "4px",
                    }}
                  >
                    {comp}
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: C.violet,
                      textShadow: `0 0 8px ${C.violet}60`,
                    }}
                  >
                    {v.toFixed(3)}
                  </div>
                  <div
                    style={{
                      height: "3px",
                      background: "rgba(255,255,255,0.06)",
                      marginTop: "4px",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.abs(v) * 100}%`,
                        background: C.violet,
                        transition: "width 0.5s",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
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
              }}
            >
              q = r + i𝐢 + j𝐣 + k𝐤 | |q|² = r²+i²+j²+k² = 1<br />
              Quaternion rotations represent phase coupling between Ring 1
              (DELTA) and Ring 8 (OMNIS).
            </div>
          </div>
        </div>

        {/* Ring 0 node orbit */}
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            padding: "12px",
          }}
          data-ocid="geometry.ring0.panel"
        >
          <PanelHeader title="RING 0 — NODE ORBIT POSITIONS" />
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Ring0Orbit positions={ring0Pos} />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "7px",
                  color: C.dim,
                  lineHeight: 1.6,
                }}
              >
                12 nodes placed at golden angle intervals.
                <br />
                Phase offset = quaternion coupling strength.
                <br />
                Center (gold) = Prima Causa Layer -5 anchor.
              </div>
              <div style={{ marginTop: "8px" }}>
                <MetricRow
                  label="LAW MANIFOLD CURVATURE"
                  value={geo?.law_manifold_curvature?.toFixed(4) ?? "..."}
                  color={C.amber}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN ────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Hopf Fibration */}
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            padding: "12px",
          }}
          data-ocid="geometry.hopf.panel"
        >
          <PanelHeader
            title="HOPF FIBRATION — S³ → S² STATE SPACE"
            accent={C.magenta}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <HopfViz angles={hopfAngles} />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "7px",
                  color: C.dim,
                  lineHeight: 1.6,
                  marginBottom: "8px",
                }}
              >
                Current organism state mapped onto S².
                <br />
                Magenta point = live field coherence position.
                <br />
                Fiber lines = phase space trajectories.
              </div>
              {hopfAngles.slice(0, 4).map((a, fIdx) => (
                <MetricRow
                  key={`hopf-fiber-${fIdx + 1}`}
                  label={`FIBER ANGLE ${fIdx + 1}`}
                  value={a.toFixed(4)}
                  unit="rad"
                  color={C.magenta}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Penrose Memory Map */}
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            padding: "12px",
          }}
          data-ocid="geometry.penrose.panel"
        >
          <PanelHeader
            title="PENROSE MEMORY MAP — 12 RECENT ADDRESSES"
            accent={C.gold}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div>
              <PenroseMap addresses={penroseAddrs} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "7px",
                  color: C.dim,
                  lineHeight: 1.6,
                }}
              >
                Golden angle spiral tiling (137.5077°) from Memory Temple
                pedestals.
                <br />
                Gold points = recent memory addresses.
                <br />
                Pattern is aperiodic but locally ordered — same as
                quasicrystals.
              </div>
              <div
                style={{
                  marginTop: "8px",
                  fontFamily: "monospace",
                  fontSize: "6.5px",
                  color: C.gold,
                }}
              >
                ∠GOLDEN = 137.5077° = 360° × (2 − PHI)
              </div>
              <div style={{ marginTop: "8px" }}>
                {penroseAddrs.slice(0, 6).map((addr, mIdx) => (
                  <div
                    key={`mem-addr-${mIdx + 1}`}
                    style={{
                      fontFamily: "monospace",
                      fontSize: "7px",
                      color: C.dim,
                    }}
                  >
                    MEM-{(mIdx + 1).toString().padStart(2, "0")}:{" "}
                    <span style={{ color: C.gold }}>
                      0x{addr.toString(16).toUpperCase().padStart(4, "0")}
                    </span>
                  </div>
                ))}
                {penroseAddrs.length === 0 && (
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "7px",
                      color: C.dimlo,
                    }}
                  >
                    awaiting memory data...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Octonion Field Strength */}
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            padding: "12px",
          }}
          data-ocid="geometry.octonion.panel"
        >
          <PanelHeader
            title="OCTONION FIELD STRENGTH — 8D ALGEBRA"
            accent={C.violet}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "38px",
                  fontWeight: "bold",
                  color: C.violet,
                  textShadow: `0 0 20px ${C.violet}60`,
                  lineHeight: 1,
                }}
              >
                {octonionVal.toFixed(4)}
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "7px",
                  color: C.dim,
                  marginTop: "4px",
                }}
              >
                𝕆 = 8-dimensional normed division algebra
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  height: "6px",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: "3px",
                  marginBottom: "6px",
                }}
              >
                <div
                  style={{
                    width: `${octonionVal * 100}%`,
                    height: "100%",
                    background: `linear-gradient(to right, ${C.violet}, ${C.magenta})`,
                    boxShadow: `0 0 6px ${C.violet}`,
                    borderRadius: "3px",
                    transition: "width 0.5s",
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "6.5px",
                  color: C.dim,
                  lineHeight: 1.5,
                }}
              >
                O = ℝ ⊕ ℝ⁷ — non-associative, non-commutative.
                <br />
                Governs coupling between all 8 organism rings simultaneously.
                <br />
                |e₀|²+|e₁|²+...+|e₇|² = field integrity measure.
              </div>
            </div>
          </div>
        </div>

        {/* Calabi-Yau Law Space */}
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            padding: "12px",
          }}
          data-ocid="geometry.calabi_yau.panel"
        >
          <PanelHeader
            title="CALABI-YAU LAW MANIFOLD — 60 DIMENSIONS → 2D"
            accent={C.cyan}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <CalabiYauViz points={calaPoints} />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "7px",
                  color: C.dim,
                  lineHeight: 1.6,
                }}
              >
                Each of 60 sovereign laws = 1 dimension.
                <br />
                Projected via PHI-weighted Calabi-Yau folding.
                <br />
                Cyan = law passing. Violet = moderate. Dim = failing.
              </div>
              <div style={{ marginTop: "10px" }}>
                <MetricRow
                  label="E8 SYMMETRY"
                  value={e8Score.toFixed(4)}
                  color={e8Color}
                />
                <MetricRow
                  label="OCTONION STR"
                  value={octonionVal.toFixed(4)}
                  color={C.violet}
                />
                <MetricRow
                  label="QUATERNION |q|"
                  value={(geo
                    ? Math.sqrt(
                        geo.quaternion_r ** 2 +
                          geo.quaternion_i ** 2 +
                          geo.quaternion_j ** 2 +
                          geo.quaternion_k ** 2,
                      ).toFixed(4)
                    : "..."
                  ).toString()}
                  color={C.cyan}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
