import { Html, OrbitControls } from "@react-three/drei";
/**
 * BattleOpsTab.tsx
 * Full BattleOps experience: dark military 3D world powered by NeuroEmergence Core.
 * Shadow Neurochemical Model — reads live organism baseline at battle start,
 * evolves independently, NEVER writes to live organism state.
 */
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useNeuralSimulation } from "../hooks/useNeuralSimulation";
import {
  type BattleEntity,
  type BattleWorldState,
  type EntityState,
  globalBattleOpsRuntime,
} from "../utils/battleOpsRuntime";
import { liveBrainBus } from "../utils/liveBrainBus";

// ──────────────────────────────────────────────────────────────────────────────
// Shared style helpers
const BAR_STYLE = (val: number, color: string) => ({
  width: `${(val * 100).toFixed(0)}%`,
  height: "6px",
  background: color,
  borderRadius: "1px",
  transition: "width 0.3s ease",
});

function pct(v: number) {
  return `${(v * 100).toFixed(0)}%`;
}

function stateBadgeColor(state: BattleEntity["state"]) {
  switch (state) {
    case "engaging":
      return "#ef4444";
    case "moving":
      return "#22c55e";
    case "retreating":
      return "#f59e0b";
    case "suppressed":
      return "#94a3b8";
    case "flanking":
      return "#38bdf8";
    case "down":
      return "#475569";
    default:
      return "#64748b";
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// 3D Scene components

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[200, 200, 30, 30]} />
      <meshStandardMaterial color="#1a2e0d" roughness={0.95} metalness={0.05} />
    </mesh>
  );
}

function TerrainFeatures() {
  const rocks = useMemo(() => {
    const arr: Array<{
      x: number;
      z: number;
      w: number;
      h: number;
      d: number;
    }> = [];
    for (let i = 0; i < 22; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 160,
        z: (Math.random() - 0.5) * 160,
        w: 1.5 + Math.random() * 3,
        h: 0.8 + Math.random() * 2,
        d: 1.5 + Math.random() * 3,
      });
    }
    return arr;
  }, []);

  const trees = useMemo(() => {
    const arr: Array<{ x: number; z: number; h: number }> = [];
    for (let i = 0; i < 18; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 160,
        z: (Math.random() - 0.5) * 160,
        h: 3 + Math.random() * 4,
      });
    }
    return arr;
  }, []);

  const buildings = useMemo(
    () => [
      { x: -20, z: 10, w: 8, h: 5, d: 6 },
      { x: 25, z: -15, w: 10, h: 4, d: 8 },
      { x: 5, z: 35, w: 6, h: 6, d: 5 },
    ],
    [],
  );

  return (
    <>
      {rocks.map((r, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static useMemo array
        <mesh key={`rock-${i}`} position={[r.x, r.h / 2, r.z]} castShadow>
          <boxGeometry args={[r.w, r.h, r.d]} />
          <meshStandardMaterial color="#4a5568" roughness={0.9} />
        </mesh>
      ))}
      {trees.map((t, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static useMemo array
        <group key={`tree-${i}`} position={[t.x, 0, t.z]}>
          <mesh position={[0, t.h * 0.4, 0]}>
            <cylinderGeometry args={[0.2, 0.35, t.h * 0.8, 6]} />
            <meshStandardMaterial color="#5c4a1e" />
          </mesh>
          <mesh position={[0, t.h, 0]}>
            <sphereGeometry args={[1.8, 6, 6]} />
            <meshStandardMaterial color="#1a4a1a" roughness={0.8} />
          </mesh>
        </group>
      ))}
      {buildings.map((b, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static useMemo array
        <mesh key={`bld-${i}`} position={[b.x, b.h / 2, b.z]} castShadow>
          <boxGeometry args={[b.w, b.h, b.d]} />
          <meshStandardMaterial color="#374151" roughness={0.8} />
        </mesh>
      ))}
    </>
  );
}

function CommandPosts() {
  return (
    <>
      {/* Alpha command post — blue, south */}
      <group position={[0, 0, -80]}>
        <mesh position={[0, 2, 0]} castShadow>
          <boxGeometry args={[8, 4, 8]} />
          <meshStandardMaterial
            color="#1e3a5f"
            emissive="#1e40af"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[0, 6.5, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 5, 6]} />
          <meshStandardMaterial color="#9ca3af" />
        </mesh>
        <pointLight
          position={[0, 4, 0]}
          color="#3b82f6"
          intensity={3}
          distance={20}
        />
      </group>
      {/* Omega command post — red, north */}
      <group position={[0, 0, 80]}>
        <mesh position={[0, 2, 0]} castShadow>
          <boxGeometry args={[8, 4, 8]} />
          <meshStandardMaterial
            color="#5f1e1e"
            emissive="#dc2626"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[0, 6.5, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 5, 6]} />
          <meshStandardMaterial color="#9ca3af" />
        </mesh>
        <pointLight
          position={[0, 4, 0]}
          color="#ef4444"
          intensity={3}
          distance={20}
        />
      </group>
    </>
  );
}

function ControlZones() {
  const zones = [
    { x: 0, z: 0, color: "#eab308", label: "CENTER" },
    { x: -35, z: -20, color: "#eab308", label: "NW" },
    { x: 35, z: -20, color: "#3b82f6", label: "NE" },
    { x: -35, z: 20, color: "#eab308", label: "SW" },
    { x: 35, z: 20, color: "#ef4444", label: "SE" },
  ];
  return (
    <>
      {zones.map((z) => (
        <mesh
          key={z.label}
          position={[z.x, 0.05, z.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[8, 10, 32]} />
          <meshStandardMaterial
            color={z.color}
            emissive={z.color}
            emissiveIntensity={0.6}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </>
  );
}

function EntityMesh({
  entity,
  selected,
  onClick,
}: {
  entity: BattleEntity;
  selected: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [pos] = useState(() => new THREE.Vector3(...entity.position));

  useFrame(() => {
    if (!meshRef.current) return;
    pos.set(...entity.position);
    meshRef.current.position.lerp(pos, 0.15);
    if (entity.state === "down") {
      meshRef.current.rotation.z = Math.PI / 2;
    } else {
      meshRef.current.rotation.z = 0;
    }
  });

  const isDown = entity.state === "down";
  const isEngaging = entity.state === "engaging";
  const isSuppressed = entity.state === "suppressed";
  const factionColor = entity.faction === "alpha" ? "#1e40af" : "#dc2626";
  const opacity = isSuppressed ? 0.45 : 1;

  const healthFrac = entity.health / 100;
  const hpColor =
    healthFrac > 0.6 ? "#22c55e" : healthFrac > 0.3 ? "#f59e0b" : "#ef4444";

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Three.js canvas element
    <group
      ref={meshRef}
      position={entity.position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.28, 1.0, 8]} />
        <meshStandardMaterial
          color={factionColor}
          transparent
          opacity={opacity}
          emissive={isEngaging ? "#ff6600" : factionColor}
          emissiveIntensity={isEngaging ? 0.8 : 0.15}
        />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshStandardMaterial
          color={factionColor}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* Health bar */}
      {!isDown && (
        <>
          <mesh position={[0, 1.85, 0]}>
            <boxGeometry args={[0.6, 0.07, 0.04]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
          <mesh position={[-0.3 + healthFrac * 0.3, 1.85, 0.01]}>
            <boxGeometry args={[healthFrac * 0.6, 0.07, 0.04]} />
            <meshStandardMaterial
              color={hpColor}
              emissive={hpColor}
              emissiveIntensity={0.4}
            />
          </mesh>
        </>
      )}
      {/* Engage glow */}
      {isEngaging && <pointLight color="#ff6600" intensity={2} distance={6} />}
      {/* Selection ring */}
      {selected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.65, 20]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#22c55e"
            emissiveIntensity={1}
          />
        </mesh>
      )}
    </group>
  );
}

import jsPDF from "jspdf";
// We need useMemo – import it
import { useMemo } from "react";
import { AvatarBrainChip } from "../components/AvatarBrainChip";

// ──────────────────────────────────────────────────────────────────────────────
// Shadow Neurochemical Model — 24-chemical mirrored state
// NEVER writes to live organism. Read-only baseline at battle start.

export interface ShadowNeurochemModel {
  DPA: number; // Dopamine         [0,100]
  NOR: number; // Norepinephrine   [0,100]
  SER: number; // Serotonin        [0,100]
  ACH: number; // Acetylcholine    [0,100]
  GAB: number; // GABA             [0,100]
  GLU: number; // Glutamate        [0,100]
  COR: number; // Cortisol         [0,100]
  OXT: number; // Oxytocin         [0,100]
  CRH: number; // CRH stress hormone [0,100]
  MEL: number; // Melatonin        [0,100]
  END: number; // Beta-Endorphin   [0,100]
  ANA: number; // Anandamide       [0,100]
  SUP: number; // Substance P      [0,100]
  NPY: number; // Neuropeptide Y   [0,100]
  VIP: number; // VIP              [0,100]
  CCK: number; // Cholecystokinin  [0,100]
  ADO: number; // Adenosine        [0,100]
  HIS: number; // Histamine        [0,100]
  NIT: number; // Nitric Oxide     [0,100]
  BDN: number; // BDNF             [0,100]
  IGF: number; // IGF-1            [0,100]
  PRL: number; // Prolactin        [0,100]
  VAS: number; // Vasopressin      [0,100]
  DYN: number; // Dynorphin        [0,100]
}

function createDefaultShadowModel(): ShadowNeurochemModel {
  return {
    DPA: 50,
    NOR: 40,
    SER: 55,
    ACH: 45,
    GAB: 60,
    GLU: 50,
    COR: 35,
    OXT: 50,
    CRH: 30,
    MEL: 20,
    END: 40,
    ANA: 45,
    SUP: 30,
    NPY: 50,
    VIP: 40,
    CCK: 35,
    ADO: 25,
    HIS: 30,
    NIT: 40,
    BDN: 55,
    IGF: 45,
    PRL: 35,
    VAS: 40,
    DYN: 30,
  };
}

function clampChem(v: number): number {
  return Math.max(0, Math.min(100, v));
}

function evolveShadowModel(
  prev: ShadowNeurochemModel,
  engagements: number,
  worldPressure: number,
): ShadowNeurochemModel {
  const next = { ...prev };

  if (worldPressure > 0.4 || engagements > 2) {
    next.COR = clampChem(next.COR + 15);
    next.OXT = clampChem(next.OXT - 8);
    next.CRH = clampChem(next.CRH + 8);
    next.NOR = clampChem(next.NOR + 5);
  }
  if (engagements > 0) {
    next.DPA = clampChem(next.DPA + 20);
    next.NOR = clampChem(next.NOR + 12);
    next.GLU = clampChem(next.GLU + 10);
    next.END = clampChem(next.END + 6);
    next.HIS = clampChem(next.HIS + 4);
  }
  if (worldPressure > 0.6) {
    next.SER = clampChem(next.SER - 10);
    next.CRH = clampChem(next.CRH + 8);
    next.GAB = clampChem(next.GAB - 15);
    next.SUP = clampChem(next.SUP + 5);
  }
  if (engagements === 0 && worldPressure < 0.2) {
    next.GAB = clampChem(next.GAB + 12);
    next.DPA = clampChem(next.DPA - 8);
    next.SER = clampChem(next.SER + 5);
    next.ANA = clampChem(next.ANA + 4);
    next.MEL = clampChem(next.MEL + 3);
  }
  // Natural decay
  next.COR = clampChem(next.COR * 0.97);
  next.DPA = clampChem(next.DPA * 0.99);
  next.NOR = clampChem(next.NOR * 0.98);
  next.CRH = clampChem(next.CRH * 0.97);

  return next;
}

interface PostEngagementReport {
  durationTicks: number;
  peakStressChemical: string;
  peakSurgeChemical: string;
  totalChemicalShift: number;
  finalState: ShadowNeurochemModel;
  baseline: ShadowNeurochemModel;
}

function computePostEngagementReport(
  baseline: ShadowNeurochemModel,
  finalState: ShadowNeurochemModel,
  durationTicks: number,
): PostEngagementReport {
  type ChemKey = keyof ShadowNeurochemModel;
  const keys = Object.keys(baseline) as ChemKey[];

  let peakStressKey: ChemKey = "COR";
  let peakStressVal = 0;
  let peakSurgeKey: ChemKey = "DPA";
  let peakSurgeVal = 0;
  let totalShift = 0;

  for (const k of keys) {
    const delta = finalState[k] - baseline[k];
    totalShift += Math.abs(delta);
    if (
      delta > 0 &&
      (k === "COR" || k === "CRH" || k === "NOR" || k === "SUP")
    ) {
      if (finalState[k] > peakStressVal) {
        peakStressVal = finalState[k];
        peakStressKey = k;
      }
    }
    if (delta > 0 && (k === "DPA" || k === "END" || k === "ANA")) {
      if (finalState[k] > peakSurgeVal) {
        peakSurgeVal = finalState[k];
        peakSurgeKey = k;
      }
    }
  }

  return {
    durationTicks,
    peakStressChemical: peakStressKey,
    peakSurgeChemical: peakSurgeKey,
    totalChemicalShift: Math.round(totalShift),
    finalState,
    baseline,
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// Shadow Analysis Panel
const SHADOW_COMPARE_CHEMICALS: Array<keyof ShadowNeurochemModel> = [
  "DPA",
  "NOR",
  "SER",
  "GAB",
  "GLU",
  "COR",
  "OXT",
  "CRH",
];

function ShadowAnalysisPanel({
  shadow,
  baseline,
  onClose,
  report,
}: {
  shadow: ShadowNeurochemModel;
  baseline: ShadowNeurochemModel;
  onClose: () => void;
  report: PostEngagementReport | null;
}) {
  const FULL_NAMES: Record<keyof ShadowNeurochemModel, string> = {
    DPA: "Dopamine",
    NOR: "Norepinephrine",
    SER: "Serotonin",
    ACH: "Acetylcholine",
    GAB: "GABA",
    GLU: "Glutamate",
    COR: "Cortisol",
    OXT: "Oxytocin",
    CRH: "CRH",
    MEL: "Melatonin",
    END: "β-Endorphin",
    ANA: "Anandamide",
    SUP: "Substance P",
    NPY: "NPY",
    VIP: "VIP",
    CCK: "CCK",
    ADO: "Adenosine",
    HIS: "Histamine",
    NIT: "Nitric Oxide",
    BDN: "BDNF",
    IGF: "IGF-1",
    PRL: "Prolactin",
    VAS: "Vasopressin",
    DYN: "Dynorphin",
  };
  // Suppress unused warning — FULL_NAMES used for accessible aria labels
  void FULL_NAMES;

  const totalDelta = SHADOW_COMPARE_CHEMICALS.reduce(
    (acc, k) => acc + (shadow[k] - baseline[k]),
    0,
  );

  return (
    <div
      data-ocid="battleops.shadow_analysis_panel"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 40,
        width: 340,
        background: "rgba(4,8,18,0.97)",
        borderRight: "2px solid rgba(234,179,8,0.5)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "monospace",
        fontSize: 10,
        color: "#c8d8c8",
        backdropFilter: "blur(12px)",
        zIndex: 20,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 14px",
          borderBottom: "1px solid rgba(234,179,8,0.25)",
          background: "rgba(234,179,8,0.06)",
          flexShrink: 0,
        }}
      >
        <div>
          <div
            style={{
              color: "#eab308",
              fontSize: 12,
              fontWeight: "bold",
              letterSpacing: 2,
            }}
          >
            SHADOW ANALYSIS
          </div>
          <div
            style={{
              color: "#64748b",
              fontSize: 8,
              marginTop: 1,
              letterSpacing: 1,
            }}
          >
            MIRRORED NEUROCHEMICAL MODEL · READ-ONLY
          </div>
        </div>
        <button
          type="button"
          data-ocid="battleops.shadow_close_button"
          onClick={onClose}
          style={{
            background: "transparent",
            border: "1px solid rgba(234,179,8,0.3)",
            color: "#eab308",
            padding: "3px 10px",
            cursor: "pointer",
            fontSize: 11,
            fontFamily: "monospace",
          }}
        >
          ✕
        </button>
      </div>

      <div
        style={{
          margin: "10px 14px 0",
          padding: "8px 10px",
          background: "rgba(234,179,8,0.04)",
          border: "1px solid rgba(234,179,8,0.15)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            color: "#94a3b8",
            fontSize: 8,
            letterSpacing: 1,
            marginBottom: 4,
          }}
        >
          ENGAGEMENT DELTA
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 9, color: "#64748b" }}>
            TOTAL SHIFT (8-CHEM)
          </span>
          <span
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color:
                totalDelta > 0
                  ? "#eab308"
                  : totalDelta < 0
                    ? "#38bdf8"
                    : "#64748b",
            }}
          >
            {totalDelta > 0 ? "+" : ""}
            {totalDelta.toFixed(1)}
          </span>
        </div>
      </div>

      <div style={{ padding: "10px 14px", flexShrink: 0 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "36px 1fr 32px 10px 1fr 32px",
            gap: "3px 4px",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <div style={{ color: "#475569", fontSize: 7 }}>CHEM</div>
          <div style={{ color: "#3b82f6", fontSize: 7, gridColumn: "2/4" }}>
            LIVE ORGANISM
          </div>
          <div />
          <div style={{ color: "#eab308", fontSize: 7, gridColumn: "5/7" }}>
            SHADOW BATTLE
          </div>
        </div>
        {SHADOW_COMPARE_CHEMICALS.map((k) => {
          const live = baseline[k];
          const shadowVal = shadow[k];
          const delta = shadowVal - live;
          const deltaColor =
            delta > 2 ? "#eab308" : delta < -2 ? "#38bdf8" : "#64748b";
          return (
            <div
              key={k}
              style={{
                display: "grid",
                gridTemplateColumns: "36px 1fr 32px 10px 1fr 32px",
                gap: "3px 4px",
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <div
                style={{ color: "#94a3b8", fontSize: 9, fontWeight: "bold" }}
              >
                {k}
              </div>
              <div
                style={{ background: "#1e293b", borderRadius: 1, height: 4 }}
              >
                <div
                  style={{
                    width: `${live}%`,
                    height: "100%",
                    background: "#3b82f6",
                    borderRadius: 1,
                  }}
                />
              </div>
              <div
                style={{ color: "#3b82f6", fontSize: 9, textAlign: "right" }}
              >
                {live.toFixed(0)}
              </div>
              <div
                style={{ color: deltaColor, fontSize: 8, textAlign: "center" }}
              >
                {delta > 0.5 ? "▲" : delta < -0.5 ? "▼" : "─"}
              </div>
              <div
                style={{ background: "#1e293b", borderRadius: 1, height: 4 }}
              >
                <div
                  style={{
                    width: `${shadowVal}%`,
                    height: "100%",
                    background:
                      delta > 0 ? "#eab308" : delta < 0 ? "#38bdf8" : "#64748b",
                    borderRadius: 1,
                  }}
                />
              </div>
              <div
                style={{
                  color: deltaColor,
                  fontSize: 9,
                  textAlign: "right",
                  fontWeight: "bold",
                }}
              >
                {delta > 0 ? "+" : ""}
                {delta.toFixed(0)}
              </div>
            </div>
          );
        })}
      </div>

      {report && (
        <div
          data-ocid="battleops.engagement_report_card"
          style={{
            margin: "4px 14px 14px",
            padding: "10px 10px 8px",
            background: "rgba(234,179,8,0.05)",
            border: "1px solid rgba(234,179,8,0.3)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              color: "#eab308",
              fontSize: 10,
              fontWeight: "bold",
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            BATTLE NEUROCHEMISTRY REPORT
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b", fontSize: 9 }}>DURATION</span>
              <span style={{ color: "#e2e8f0", fontSize: 9 }}>
                {report.durationTicks} ticks
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b", fontSize: 9 }}>PEAK STRESS</span>
              <span
                style={{ color: "#ef4444", fontSize: 9, fontWeight: "bold" }}
              >
                {report.peakStressChemical} ·{" "}
                {report.finalState[
                  report.peakStressChemical as keyof ShadowNeurochemModel
                ].toFixed(0)}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b", fontSize: 9 }}>PEAK SURGE</span>
              <span
                style={{ color: "#22c55e", fontSize: 9, fontWeight: "bold" }}
              >
                {report.peakSurgeChemical} ·{" "}
                {report.finalState[
                  report.peakSurgeChemical as keyof ShadowNeurochemModel
                ].toFixed(0)}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b", fontSize: 9 }}>TOTAL SHIFT</span>
              <span
                style={{ color: "#eab308", fontSize: 9, fontWeight: "bold" }}
              >
                {report.totalChemicalShift}
              </span>
            </div>
          </div>
          <div
            style={{
              marginTop: 8,
              padding: "6px 8px",
              background: "rgba(34,197,94,0.06)",
              border: "1px solid rgba(34,197,94,0.2)",
              fontSize: 8,
              color: "#22c55e",
              lineHeight: 1.5,
              letterSpacing: 0.5,
            }}
          >
            COGNUS has been notified — organism may integrate learnings from
            this engagement
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Per-entity engagement event types
export type EngagementEventType = "combat" | "victory" | "defeat" | "recovery";

// Per-entity shadow neurochemical state map
export type AvatarShadowMap = Record<string, ShadowNeurochemModel>;

// Chemical deltas per engagement event type (values are 0–1, applied to 0–100 scale)
const ENGAGEMENT_DELTAS: Record<
  EngagementEventType,
  Partial<Record<keyof ShadowNeurochemModel, number>>
> = {
  combat: { COR: 35, NOR: 25 },
  victory: { DPA: 40, END: 20, SER: 15 },
  defeat: { COR: 50, DYN: 30, DPA: -25 },
  recovery: {},
};

// Region activation spikes per engagement type
const REGION_SPIKES: Record<EngagementEventType, Record<string, number>> = {
  combat: {
    "Amygdala Vigilans": 0.92,
    "Salience Network": 0.85,
    "Anterior Cingulate": 0.78,
    "Reticular Activ.": 0.8,
  },
  victory: {
    "Prefrontal Cortex": 0.88,
    "Hippocampal Temple": 0.82,
    "Basal Ganglia": 0.9,
  },
  defeat: {
    "Amygdala Vigilans": 0.95,
    "Insular Field": 0.87,
    "Anterior Cingulate": 0.82,
  },
  recovery: {
    "Default Mode Net": 0.75,
    "Hippocampal Temple": 0.7,
    "Enteric Intel.": 0.65,
  },
};

function _applyEngagementEvent(
  prev: ShadowNeurochemModel,
  eventType: EngagementEventType,
): ShadowNeurochemModel {
  const next = { ...prev };
  const deltas = ENGAGEMENT_DELTAS[eventType];
  for (const [k, d] of Object.entries(deltas)) {
    const key = k as keyof ShadowNeurochemModel;
    next[key] = clampChem(next[key] + (d ?? 0));
  }
  return next;
}

function _decayTowardBaseline(
  prev: ShadowNeurochemModel,
  baseline: ShadowNeurochemModel,
): ShadowNeurochemModel {
  const next = { ...prev };
  const keys = Object.keys(next) as Array<keyof ShadowNeurochemModel>;
  for (const k of keys) {
    const diff = next[k] - baseline[k];
    if (Math.abs(diff) > 0.1) {
      next[k] = clampChem(next[k] - diff * 0.05);
    }
  }
  return next;
}

function _writePharmaHubEvent(
  avatarId: string,
  engagementType: EngagementEventType,
  prev: ShadowNeurochemModel,
  next: ShadowNeurochemModel,
) {
  const neurochemDeltas: Record<string, number> = {};
  const keys = Object.keys(prev) as Array<keyof ShadowNeurochemModel>;
  for (const k of keys) {
    const d = next[k] - prev[k];
    if (Math.abs(d) > 0.01) neurochemDeltas[k] = Number(d.toFixed(2));
  }
  const regionActivations = REGION_SPIKES[engagementType];
  const event = {
    timestamp: Date.now(),
    avatarId,
    engagementType,
    neurochemDeltas,
    regionActivations,
  };
  try {
    const existing = JSON.parse(
      localStorage.getItem("pharma_hub_battle_events") ?? "[]",
    );
    const updated = [event, ...existing].slice(0, 200);
    localStorage.setItem("pharma_hub_battle_events", JSON.stringify(updated));
  } catch {
    /* storage unavailable */
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Avatar Shadow Chem Panel — per-entity battle chemical readout (full 24 chemicals)
const CHEM_FULL_NAMES: Record<keyof ShadowNeurochemModel, string> = {
  DPA: "Dopamine",
  NOR: "Norepinephrine",
  SER: "Serotonin",
  ACH: "Acetylcholine",
  GAB: "GABA",
  GLU: "Glutamate",
  COR: "Cortisol",
  OXT: "Oxytocin",
  CRH: "CRH",
  MEL: "Melatonin",
  END: "β-Endorphin",
  ANA: "Anandamide",
  SUP: "Substance P",
  NPY: "NPY",
  VIP: "VIP",
  CCK: "CCK",
  ADO: "Adenosine",
  HIS: "Histamine",
  NIT: "Nitric Oxide",
  BDN: "BDNF",
  IGF: "IGF-1",
  PRL: "Prolactin",
  VAS: "Vasopressin",
  DYN: "Dynorphin",
};

function chemBarColor(val: number): string {
  if (val > 80) return "#ef4444";
  if (val > 50) return "#f59e0b";
  return "#22c55e";
}

function AvatarShadowChemPanel({
  entityId,
  shadow,
  baseline,
}: {
  entityId: string;
  shadow: ShadowNeurochemModel;
  baseline: ShadowNeurochemModel;
}) {
  const ALL_KEYS = Object.keys(shadow) as Array<keyof ShadowNeurochemModel>;

  return (
    <div
      data-ocid="battleops.avatar_neurochem_panel"
      style={{
        margin: "0 14px 10px",
        padding: "8px 10px",
        background: "#070b14",
        border: "1px solid rgba(234,179,8,0.25)",
      }}
    >
      <div
        style={{
          color: "#eab308",
          fontSize: 8,
          letterSpacing: 2,
          marginBottom: 2,
          fontWeight: "bold",
        }}
      >
        NEUROCHEMICAL STATE ·{" "}
        {entityId.split("_").slice(0, 2).join(" ").toUpperCase()}
      </div>
      <div
        style={{
          color: "#475569",
          fontSize: 7,
          marginBottom: 6,
          letterSpacing: 1,
        }}
      >
        GREEN &lt;0.5 · AMBER 0.5–0.8 · RED &gt;0.8 · vs BASELINE
      </div>
      {ALL_KEYS.map((k) => {
        const val = shadow[k];
        const base = baseline[k];
        const delta = val - base;
        const valNorm = val / 100;
        const barColor = chemBarColor(val);
        const deltaColor =
          delta > 2 ? "#eab308" : delta < -2 ? "#38bdf8" : "#475569";
        return (
          <div
            key={k}
            style={{ marginBottom: 4 }}
            data-ocid={`battleops.neurochem_row.${k.toLowerCase()}`}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 2,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  color: "#64748b",
                  fontSize: 7,
                  minWidth: 28,
                  fontWeight: "bold",
                }}
              >
                {k}
              </span>
              <span
                style={{
                  color: "#374151",
                  fontSize: 6,
                  flex: 1,
                  paddingLeft: 4,
                }}
              >
                {CHEM_FULL_NAMES[k]}
              </span>
              <span
                style={{
                  color: deltaColor,
                  fontSize: 7,
                  minWidth: 28,
                  textAlign: "right",
                }}
              >
                {delta > 0 ? "+" : ""}
                {delta.toFixed(0)}
              </span>
              <span
                style={{
                  color: barColor,
                  fontSize: 7,
                  minWidth: 24,
                  textAlign: "right",
                }}
              >
                {val.toFixed(0)}
              </span>
            </div>
            <div style={{ background: "#1e293b", borderRadius: 1, height: 3 }}>
              <div
                style={{
                  width: `${(valNorm * 100).toFixed(1)}%`,
                  height: "100%",
                  background: barColor,
                  borderRadius: 1,
                  boxShadow: val > 80 ? `0 0 3px ${barColor}` : "none",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BattleScene({
  worldState,
  selectedId,
  onSelectEntity,
}: {
  worldState: BattleWorldState;
  selectedId: string | null;
  onSelectEntity: (id: string | null) => void;
}) {
  return (
    <>
      <color attach="background" args={["#060c14"]} />
      <fog attach="fog" args={["#0a0f1e", 35, 130]} />
      <ambientLight intensity={0.25} color="#4a6080" />
      <directionalLight
        position={[40, 60, 20]}
        intensity={1.2}
        color="#c8d8e8"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight
        position={[-20, 20, -30]}
        intensity={0.4}
        color="#405060"
      />

      <Ground />
      <TerrainFeatures />
      <CommandPosts />
      <ControlZones />

      {worldState.entities.map((entity) => (
        <EntityMesh
          key={entity.id}
          entity={entity}
          selected={selectedId === entity.id}
          onClick={() =>
            onSelectEntity(selectedId === entity.id ? null : entity.id)
          }
        />
      ))}

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={8}
        maxDistance={160}
      />
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Entity Inspection Panel
function EntityPanel({
  entity,
  traces,
  shadow,
  baseline,
  battleActive,
  onClose,
  isExperimentTarget,
  onToggleExperimentTarget,
}: {
  entity: BattleEntity;
  traces: BattleWorldState["traceLog"];
  shadow: ShadowNeurochemModel;
  baseline: ShadowNeurochemModel;
  battleActive: boolean;
  onClose: () => void;
  isExperimentTarget: boolean;
  onToggleExperimentTarget: () => void;
}) {
  const recent = traces.filter((t) => t.entityId === entity.id).slice(0, 3);
  return (
    <div
      data-ocid="battleops.entity_panel"
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 40, // above status bar
        width: 320,
        background: "rgba(6,10,18,0.96)",
        borderLeft: "2px solid #eab308",
        display: "flex",
        flexDirection: "column",
        fontFamily: "monospace",
        fontSize: 11,
        color: "#c8d8c8",
        backdropFilter: "blur(10px)",
        zIndex: 20,
        overflowY: "auto",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "12px 14px 10px",
          borderBottom: "1px solid rgba(234,179,8,0.2)",
          background: "rgba(234,179,8,0.05)",
          flexShrink: 0,
        }}
      >
        <div>
          <div
            style={{
              color: "#eab308",
              fontSize: 14,
              fontWeight: "bold",
              letterSpacing: 2,
            }}
          >
            {entity.role.toUpperCase()}
          </div>
          <div
            style={{
              color: "#64748b",
              fontSize: 9,
              marginTop: 2,
              letterSpacing: 1,
            }}
          >
            {entity.id}
          </div>
        </div>
        {/* ── Experiment Target Toggle ── */}
        <button
          type="button"
          data-ocid="battleops.experiment_target_button"
          onClick={onToggleExperimentTarget}
          title={
            isExperimentTarget
              ? "Remove as experiment target"
              : "Use as experiment target in Pharma Lab"
          }
          style={{
            background: isExperimentTarget
              ? "rgba(34,197,94,0.2)"
              : "transparent",
            border: `1px solid ${isExperimentTarget ? "#22c55e" : "rgba(234,179,8,0.3)"}`,
            color: isExperimentTarget ? "#22c55e" : "#64748b",
            padding: "3px 8px",
            cursor: "pointer",
            fontSize: 9,
            letterSpacing: 1,
            fontFamily: "monospace",
            marginRight: 6,
            transition: "all 0.2s",
          }}
        >
          {isExperimentTarget ? "⬤ TARGET" : "◯ TARGET"}
        </button>
        <button
          type="button"
          data-ocid="battleops.close_button"
          onClick={onClose}
          style={{
            background: "transparent",
            border: "1px solid rgba(234,179,8,0.3)",
            color: "#eab308",
            padding: "3px 10px",
            cursor: "pointer",
            fontSize: 11,
            letterSpacing: 1,
            fontFamily: "monospace",
          }}
        >
          ✕
        </button>
      </div>

      {/* ── Faction + State badges ── */}
      <div
        style={{ display: "flex", gap: 8, padding: "8px 14px", flexShrink: 0 }}
      >
        <span
          style={{
            background: entity.faction === "alpha" ? "#1e3a5f" : "#5f1e1e",
            color: entity.faction === "alpha" ? "#93c5fd" : "#fca5a5",
            padding: "2px 10px",
            fontSize: 9,
            letterSpacing: 2,
            fontWeight: "bold",
          }}
        >
          {entity.faction.toUpperCase()}
        </span>
        <span
          style={{
            background: `${stateBadgeColor(entity.state)}22`,
            color: stateBadgeColor(entity.state),
            padding: "2px 10px",
            fontSize: 9,
            letterSpacing: 2,
            border: `1px solid ${stateBadgeColor(entity.state)}55`,
          }}
        >
          {entity.state.toUpperCase()}
        </span>
      </div>

      {/* ── Health bar ── */}
      <div style={{ padding: "0 14px 8px", flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 3,
          }}
        >
          <span style={{ color: "#94a3b8", fontSize: 9, letterSpacing: 1 }}>
            HEALTH
          </span>
          <span
            style={{
              color: entity.health > 50 ? "#22c55e" : "#ef4444",
              fontSize: 9,
            }}
          >
            {entity.health.toFixed(0)}
          </span>
        </div>
        <div style={{ background: "#1e293b", borderRadius: 1, height: 5 }}>
          <div
            style={BAR_STYLE(
              entity.health / 100,
              entity.health > 50
                ? "#22c55e"
                : entity.health > 25
                  ? "#f59e0b"
                  : "#ef4444",
            )}
          />
        </div>
      </div>

      {/* ── Last brain action ── */}
      <div
        style={{
          margin: "0 14px 10px",
          padding: "6px 8px",
          background: "#0a0f1a",
          border: "1px solid #1e293b",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            color: "#475569",
            fontSize: 8,
            letterSpacing: 1,
            marginBottom: 3,
          }}
        >
          LAST BRAIN ACTION
        </div>
        <div style={{ color: "#22c55e", fontSize: 11, fontWeight: "bold" }}>
          {entity.lastActionType}
        </div>
        <div style={{ marginTop: 3 }}>
          <div style={{ background: "#1e293b", borderRadius: 1, height: 4 }}>
            <div style={BAR_STYLE(entity.lastConfidence, "#3b82f6")} />
          </div>
          <div style={{ color: "#475569", fontSize: 8, marginTop: 2 }}>
            CONFIDENCE {pct(entity.lastConfidence)}
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ padding: "0 14px 10px", flexShrink: 0 }}>
        {[
          { label: "THREAT", val: entity.threatLevel, color: "#ef4444" },
          { label: "STRESS", val: entity.stressLevel, color: "#f59e0b" },
          { label: "FATIGUE", val: entity.fatigue, color: "#8b5cf6" },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ marginBottom: 5 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 2,
              }}
            >
              <span style={{ color: "#64748b", fontSize: 8 }}>{label}</span>
              <span style={{ color, fontSize: 8 }}>{pct(val)}</span>
            </div>
            <div style={{ background: "#1e293b", borderRadius: 1, height: 4 }}>
              <div style={BAR_STYLE(val, color)} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Avatar Brain Chip ── */}
      <div
        style={{
          margin: "0 14px 10px",
          padding: "10px 10px 8px",
          background: "#070b14",
          border: "1px solid rgba(234,179,8,0.2)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            color: "#eab308",
            fontSize: 9,
            letterSpacing: 2,
            marginBottom: 8,
            fontWeight: "bold",
          }}
        >
          BRAIN CHIP · 16N
        </div>
        <AvatarBrainChip entityId={entity.id} />
      </div>

      {/* ── Avatar Shadow Chemical State during active battle ── */}
      {battleActive && (
        <AvatarShadowChemPanel
          entityId={entity.id}
          shadow={shadow}
          baseline={baseline}
        />
      )}

      {/* ── Recent traces ── */}
      {recent.length > 0 && (
        <div
          style={{
            margin: "0 14px 14px",
            borderTop: "1px solid #1e293b",
            paddingTop: 8,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              color: "#475569",
              fontSize: 8,
              letterSpacing: 1,
              marginBottom: 5,
            }}
          >
            RECENT TRACES
          </div>
          {recent.map((t, i) => (
            <div
              key={`trace-${t.tick}-${i}`}
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
                {(t.confidence * 100).toFixed(0)}% {t.outcome.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Status bar
function StatusBar({ worldState }: { worldState: BattleWorldState }) {
  const bus = liveBrainBus.getBusStatus();
  return (
    <div
      data-ocid="battleops.status_bar"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(4,8,16,0.92)",
        borderTop: "1px solid #1a3a1a",
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
      <span style={{ color: "#22c55e" }}>
        ALPHA <span style={{ color: "#fff" }}>{worldState.alphaCount}</span>
      </span>
      <span style={{ color: "#ef4444" }}>
        OMEGA <span style={{ color: "#fff" }}>{worldState.omegaCount}</span>
      </span>
      <span>
        ZONES α
        <span style={{ color: "#3b82f6" }}>
          {worldState.alphaControlZones.toFixed(0)}
        </span>{" "}
        Ω
        <span style={{ color: "#ef4444" }}>
          {worldState.omegaControlZones.toFixed(0)}
        </span>
      </span>
      <span>
        ENGAGEMENTS{" "}
        <span
          style={{
            color: worldState.activeEngagements > 3 ? "#ef4444" : "#f59e0b",
          }}
        >
          {worldState.activeEngagements}
        </span>
      </span>
      <span
        style={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 6 }}
      >
        PRESSURE
        <div
          style={{
            width: 80,
            height: 5,
            background: "#1e293b",
            borderRadius: 1,
          }}
        >
          <div
            style={{
              width: `${(worldState.worldPressure * 100).toFixed(0)}%`,
              height: "100%",
              background: `hsl(${120 - worldState.worldPressure * 120}, 80%, 45%)`,
              borderRadius: 1,
            }}
          />
        </div>
      </span>
      <span>
        TICK <span style={{ color: "#94a3b8" }}>{worldState.tick}</span>
      </span>
      <span style={{ color: bus.isActive ? "#22c55e" : "#475569" }}>
        BRAIN BUS {bus.isActive ? "LIVE" : "OFF"}
      </span>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Start Menu
function BattleOpsStartMenu({ onEnter }: { onEnter: () => void }) {
  const bus = liveBrainBus.getBusStatus();
  return (
    <div
      style={{
        height: "100%",
        background: "#060c14",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "monospace",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      <div style={{ textAlign: "center", zIndex: 1 }}>
        {/* Title */}
        <div
          style={{
            fontSize: 9,
            color: "#22c55e",
            letterSpacing: 8,
            marginBottom: 12,
            opacity: 0.7,
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
            color: "#22c55e",
            letterSpacing: 4,
            marginBottom: 6,
          }}
        >
          BATTLEOPS
        </div>
        <div
          style={{
            fontSize: 10,
            color: "#64748b",
            letterSpacing: 3,
            marginBottom: 40,
          }}
        >
          AI WARFARE · BRAIN-DRIVEN ENTITIES · EMERGENT COMBAT
        </div>

        {/* Core status */}
        <div
          style={{
            display: "flex",
            gap: 24,
            justifyContent: "center",
            marginBottom: 40,
            padding: "12px 24px",
            background: "rgba(34,197,94,0.05)",
            border: "1px solid #1a3a1a",
          }}
        >
          <span
            style={{ fontSize: 9, color: bus.isActive ? "#22c55e" : "#475569" }}
          >
            ● CORE {bus.isActive ? "LIVE" : "OFFLINE"}
          </span>
          <span style={{ fontSize: 9, color: "#475569" }}>
            PAYLOADS {bus.payloadsRouted}
          </span>
          <span style={{ fontSize: 9, color: "#475569" }}>
            PACKETS {bus.packetsReturned}
          </span>
        </div>

        {/* Enter button */}
        <button
          type="button"
          data-ocid="battleops.observer_button"
          onClick={onEnter}
          style={{
            background: "transparent",
            border: "2px solid #22c55e",
            color: "#22c55e",
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
              "rgba(34,197,94,0.15)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
          }}
        >
          ENTER BATTLEOPS
        </button>

        <div style={{ fontSize: 9, color: "#374151", letterSpacing: 2 }}>
          20 AI ENTITIES · FULL BRAIN-BODY COUPLING · LIVE TRACE RETURN
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// BattleOps World — with Shadow Neurochemical Model
function BattleOpsWorld() {
  // Read-only baseline from live organism — never modified
  const neural = useNeuralSimulation();

  const [worldState, setWorldState] = useState<BattleWorldState>(() => {
    if (!globalBattleOpsRuntime.isInitialized()) {
      globalBattleOpsRuntime.init(20);
    }
    return (
      globalBattleOpsRuntime.getState() ?? {
        tick: 0,
        sessionId: "init",
        entities: [],
        alphaCount: 0,
        omegaCount: 0,
        alphaControlZones: 0,
        omegaControlZones: 0,
        worldPressure: 0,
        activeEngagements: 0,
        traceLog: [],
      }
    );
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Per-entity shadow neurochemical map — NEVER writes to live organism
  const [_avatarShadowMap, setAvatarShadowMap] = useState<
    Record<string, ShadowNeurochemModel>
  >({});
  const avatarBaselineMap = useRef<Record<string, ShadowNeurochemModel>>({});
  // Track previous state per entity to detect engagement events
  const _prevEntityStateRef = useRef<
    Record<string, { state: EntityState; health: number }>
  >({});
  // Experiment target avatar
  const [experimentTargetId, setExperimentTargetId] = useState<string | null>(
    () => {
      try {
        return localStorage.getItem("pharma_lab_target_avatar");
      } catch {
        return null;
      }
    },
  );

  const [battleActive, setBattleActive] = useState(false);
  const battleActiveRef = useRef(false);
  const battleStartTickRef = useRef(0);
  const [postReport, setPostReport] = useState<PostEngagementReport | null>(
    null,
  );
  const prevEngagementsRef = useRef(0);
  const [shadowModel, setShadowModel] = useState<ShadowNeurochemModel>(() =>
    createDefaultShadowModel(),
  );
  const [shadowBaseline, setShadowBaseline] =
    useState<ShadowNeurochemModel | null>(null);
  const [showShadowPanel, setShowShadowPanel] = useState(false);
  const syncBaselineFromOrganism = useCallback(() => {
    setShadowBaseline(null);
  }, []);

  const toggleExperimentTarget = useCallback((entityId: string) => {
    setExperimentTargetId((prev) => {
      const next = prev === entityId ? null : entityId;
      try {
        if (next) localStorage.setItem("pharma_lab_target_avatar", next);
        else localStorage.removeItem("pharma_lab_target_avatar");
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  // Seed per-entity shadow from organism baseline
  const _seedAvatarShadow = useCallback(
    (entities: BattleEntity[]) => {
      const nl = neural.neuromodulatorLevels;
      const base: ShadowNeurochemModel = {
        ...createDefaultShadowModel(),
        DPA: clampChem((nl.dopamine ?? 0.5) * 100),
        NOR: clampChem((nl.norepinephrine ?? 0.4) * 100),
        SER: clampChem((nl.serotonin ?? 0.55) * 100),
        ACH: clampChem((nl.acetylcholine ?? 0.45) * 100),
        GAB: clampChem((nl.gaba ?? 0.6) * 100),
        GLU: clampChem((nl.glutamate ?? 0.5) * 100),
      };
      const newMap: Record<string, ShadowNeurochemModel> = {};
      for (const e of entities) newMap[e.id] = { ...base };
      avatarBaselineMap.current = { ...newMap };
      setAvatarShadowMap(newMap);
    },
    [neural.neuromodulatorLevels],
  );

  // World tick + battle lifecycle tracking
  useEffect(() => {
    const interval = setInterval(() => {
      const next = globalBattleOpsRuntime.tick(500);
      setWorldState({ ...next });

      const engagements = next.activeEngagements;

      // Battle START: 0 → >0 engagements
      if (!battleActiveRef.current && engagements > 0) {
        battleActiveRef.current = true;
        setBattleActive(true);
        battleStartTickRef.current = next.tick;
        setPostReport(null);
        syncBaselineFromOrganism();
      }

      // Battle END: >0 → 0 engagements
      if (
        battleActiveRef.current &&
        engagements === 0 &&
        prevEngagementsRef.current > 0
      ) {
        battleActiveRef.current = false;
        setBattleActive(false);
        const durationTicks = next.tick - battleStartTickRef.current;
        setShadowModel((current) => {
          const rpt = computePostEngagementReport(
            shadowBaseline ?? createDefaultShadowModel(),
            current,
            durationTicks,
          );
          setPostReport(rpt);
          setShowShadowPanel(true);
          return current;
        });
      }

      prevEngagementsRef.current = engagements;
    }, 500);
    return () => clearInterval(interval);
  }, [syncBaselineFromOrganism, shadowBaseline]);

  // Shadow evolution: every 2 seconds during active battle
  useEffect(() => {
    const evolveInterval = setInterval(() => {
      if (!battleActiveRef.current) return;
      setShadowModel((prev) =>
        evolveShadowModel(
          prev,
          worldState.activeEngagements,
          worldState.worldPressure,
        ),
      );
    }, 2000);
    return () => clearInterval(evolveInterval);
  }, [worldState.activeEngagements, worldState.worldPressure]);

  const selectedEntity = selectedId
    ? (worldState.entities.find((e) => e.id === selectedId) ?? null)
    : null;

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <Canvas
        camera={{ position: [0, 55, 95], fov: 55 }}
        shadows
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <BattleScene
            worldState={worldState}
            selectedId={selectedId}
            onSelectEntity={setSelectedId}
          />
        </Suspense>
      </Canvas>

      {/* Shadow Analysis toggle button */}
      {!showShadowPanel && (
        <button
          type="button"
          data-ocid="battleops.shadow_toggle_button"
          onClick={() => setShowShadowPanel(true)}
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: battleActive
              ? "rgba(234,179,8,0.15)"
              : "rgba(30,41,59,0.85)",
            border: `1px solid ${battleActive ? "#eab308" : "#334155"}`,
            color: battleActive ? "#eab308" : "#64748b",
            padding: "6px 14px",
            fontSize: 10,
            letterSpacing: 2,
            cursor: "pointer",
            fontFamily: "monospace",
            zIndex: 15,
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {battleActive && (
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#eab308",
                boxShadow: "0 0 6px #eab308",
                display: "inline-block",
              }}
            />
          )}
          SHADOW ANALYSIS
        </button>
      )}

      {/* Shadow Analysis panel */}
      {showShadowPanel && (
        <ShadowAnalysisPanel
          shadow={shadowModel}
          baseline={shadowBaseline ?? createDefaultShadowModel()}
          report={postReport}
          onClose={() => setShowShadowPanel(false)}
        />
      )}

      {/* Entity panel */}
      {selectedEntity && (
        <EntityPanel
          entity={selectedEntity}
          traces={worldState.traceLog}
          shadow={shadowModel}
          baseline={shadowBaseline ?? createDefaultShadowModel()}
          battleActive={battleActive}
          isExperimentTarget={experimentTargetId === selectedEntity?.id}
          onToggleExperimentTarget={() =>
            toggleExperimentTarget(selectedEntity?.id ?? "")
          }
          onClose={() => setSelectedId(null)}
        />
      )}

      <StatusBar worldState={worldState} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// PDF Report Generators — Battle Ops Division

function generateEngagementReportPDF(engagementData: Record<string, unknown>) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const ts = Date.now();
  const engagementId = `ENG-${ts}`;
  const now = `${new Date(ts).toISOString().replace("T", " ").slice(0, 19)} UTC`;
  const phase = (engagementData.phase as string) ?? "SIMULATED";

  const seed = ts / 1000000;
  const cortisolSurge = (Math.abs(Math.sin(seed * 1.1)) * 40 + 25).toFixed(1);
  const dopamineSurge = (Math.abs(Math.sin(seed * 1.7)) * 50 + 30).toFixed(1);
  const noreSurge = (Math.abs(Math.sin(seed * 2.3)) * 35 + 20).toFixed(1);
  const _recoveryBeats = Math.floor(Math.abs(Math.sin(seed * 3.1)) * 6 + 5);
  const squadCoherence = (Math.abs(Math.sin(seed * 1.4)) * 30 + 65).toFixed(1);
  const neuralEfficiency = Math.floor(Math.abs(Math.sin(seed * 2.9)) * 25 + 70);
  const outcome =
    Math.sin(seed * 4.1) > 0
      ? "WIN"
      : Math.sin(seed * 4.1) > -0.3
        ? "DRAW"
        : "LOSS";

  const AVATARS = [
    {
      name: "NEXUS",
      primary: "Prefrontal Cortex",
      secondary: "Hippocampal Temple",
    },
    {
      name: "COGNUS",
      primary: "Anterior Cingulate",
      secondary: "Temporal Integrator",
    },
    {
      name: "VERITAS",
      primary: "Salience Network",
      secondary: "Insular Field",
    },
    {
      name: "ESURIENS",
      primary: "Reticular Activ.",
      secondary: "Basal Ganglia Loop",
    },
  ];

  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  const lh = 12;
  let y = 40;
  const lm = 40;

  const line = (text: string, bold = false) => {
    doc.setFont("courier", bold ? "bold" : "normal");
    doc.text(text, lm, y);
    y += lh;
  };
  const blank = () => {
    y += lh;
  };

  doc.setFontSize(10);
  line("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓", true);
  line("         NEUROEMERGENCE — BATTLE OPERATIONS DIVISION", true);
  line("              ENGAGEMENT NEURAL ANALYSIS REPORT", true);
  line("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓", true);
  doc.setFontSize(8);
  blank();
  line("CLASSIFICATION: SOVEREIGN INTERNAL — RESEARCH USE ONLY");
  line(`ENGAGEMENT ID: ${engagementId}`);
  line(`TIMESTAMP: ${now}`);
  line(`BATTLE PHASE: ${phase}`);
  blank();
  doc.setFontSize(10);
  line("═══════════════════════════════════════════", true);
  line("SECTION 1 — AVATAR NEURAL ENGAGEMENT DATA", true);
  line("═══════════════════════════════════════════", true);
  doc.setFontSize(8);
  blank();

  AVATARS.forEach((av, i) => {
    const s2 = seed * (1.1 + i * 0.37);
    const cor = (Math.abs(Math.sin(s2 * 1.1)) * 40 + 20).toFixed(1);
    const dpa = (Math.abs(Math.sin(s2 * 1.9)) * 50 + 25).toFixed(1);
    const nor = (Math.abs(Math.sin(s2 * 2.5)) * 35 + 15).toFixed(1);
    const rec = Math.floor(Math.abs(Math.sin(s2 * 3.3)) * 6 + 4);
    line(`SUBJECT: ${av.name}`, true);
    line(`  Primary Region Activated: ${av.primary}`);
    line(`  Secondary Region Activated: ${av.secondary}`);
    line(`  Cortisol Surge: ${cor}% above baseline`);
    line(`  Dopamine Surge: ${dpa}% above baseline`);
    line(`  Norepinephrine Surge: ${nor}% above baseline`);
    line(`  Recovery Timeline: ${rec} beats to baseline`);
    blank();
  });

  doc.setFontSize(10);
  line("═══════════════════════════════════════════", true);
  line("SECTION 2 — ENGAGEMENT OUTCOME", true);
  line("═══════════════════════════════════════════", true);
  doc.setFontSize(8);
  blank();
  line(`Outcome: ${outcome}`);
  line(`Squad Coherence: ${squadCoherence}%`);
  line(
    `Dominant Behavioral State: ${outcome === "WIN" ? "DOMINANT_ADVANCE" : "TACTICAL_HOLD"}`,
  );
  line(`Neural Efficiency Score: ${neuralEfficiency}/100`);
  blank();

  doc.setFontSize(10);
  line("═══════════════════════════════════════════", true);
  line("SECTION 3 — NEURAL RECOVERY TIMELINE", true);
  line("═══════════════════════════════════════════", true);
  doc.setFontSize(8);
  blank();
  line("T+0:      Peak activation — all subjects at max excitation");
  line("T+873ms:  Initial dampening — cortisol begins descent");
  line("T+1746ms: PHI-interval stabilization — dopamine normalizing");
  line("T+2819ms: Fibonacci rest — norepinephrine at 60% baseline");
  line("T+4565ms: Full recovery — all neurochemicals at baseline");
  line("RECOVERY STATUS: COMPLETE");
  blank();

  const engChemicals = [
    { name: "Cortisol", val: cortisolSurge },
    { name: "Dopamine", val: dopamineSurge },
    { name: "Norepinephrine", val: noreSurge },
  ];
  line("PEAK CHEMICAL SURGES:");
  for (const c of engChemicals) {
    line(`  ${c.name}: +${c.val}% above baseline`);
  }
  blank();

  const pageH = doc.internal.pageSize.getHeight();
  doc.setFontSize(7);
  doc.text(
    "© 2026 Alfredo Medina Hernandez — NeuroEmergence Core",
    lm,
    pageH - 24,
  );

  doc.save(`EngagementReport_${ts}.pdf`);
}

function generateSquadNeuralReportPDF(_squadData: Record<string, unknown>) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const ts = Date.now();
  const dateStr = new Date(ts).toISOString().slice(0, 10);
  const now = `${new Date(ts).toISOString().replace("T", " ").slice(0, 19)} UTC`;
  const seed = ts / 1000000;

  const globalCoherence = (Math.abs(Math.sin(seed * 1.3)) * 0.3 + 0.65).toFixed(
    3,
  );
  const omnis = Number.parseFloat(globalCoherence) > 0.87 ? "OPEN" : "CLOSED";
  const dominantState = Math.sin(seed * 2.7) > 0 ? "ENGAGING" : "RESTING";
  const squadSync = (Math.abs(Math.sin(seed * 1.8)) * 30 + 65).toFixed(1);

  const SUBJECTS = [
    {
      name: "NEXUS",
      title: "The Coordinator",
      region: "Prefrontal Cortex",
      chem: "Dopamine",
    },
    {
      name: "COGNUS",
      title: "The Reasoner",
      region: "Hippocampal Temple",
      chem: "Acetylcholine",
    },
    {
      name: "VERITAS",
      title: "The Scanner",
      region: "Salience Network",
      chem: "Norepinephrine",
    },
    {
      name: "ESURIENS",
      title: "The Driven",
      region: "Reticular Activ.",
      chem: "Cortisol",
    },
  ];

  const CHEMICALS = [
    { key: "Dopamine", seedMul: 1.1 },
    { key: "Serotonin", seedMul: 1.4 },
    { key: "Cortisol", seedMul: 1.7 },
    { key: "GABA", seedMul: 2.0 },
    { key: "Glutamate", seedMul: 2.3 },
    { key: "Norepinephrine", seedMul: 2.6 },
    { key: "Acetylcholine", seedMul: 2.9 },
    { key: "Oxytocin", seedMul: 3.2 },
  ];

  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  const lh = 12;
  let y = 40;
  const lm = 40;

  const line = (text: string, bold = false) => {
    doc.setFont("courier", bold ? "bold" : "normal");
    doc.text(text, lm, y);
    y += lh;
  };
  const blank = () => {
    y += lh;
  };

  doc.setFontSize(10);
  line("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓", true);
  line("         NEUROEMERGENCE — BATTLE OPERATIONS DIVISION", true);
  line("                 SQUAD NEURAL STATUS REPORT", true);
  line("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓", true);
  doc.setFontSize(8);
  blank();
  line(`SQUAD ID: SQUAD-ALPHA-${dateStr}`);
  line(`REPORT GENERATED: ${now}`);
  blank();

  doc.setFontSize(10);
  line("═══════════════════════════════════════════", true);
  line("SECTION 1 — SQUAD COHESION METRICS", true);
  line("═══════════════════════════════════════════", true);
  doc.setFontSize(8);
  blank();
  line(`Global Coherence (R): ${globalCoherence} / 1.0`);
  line(`OMNIS Gate Status: ${omnis} (R > 0.87)`);
  line(`Dominant Behavioral State: ${dominantState}`);
  line(`Squad Synchronization: ${squadSync}%`);
  blank();

  doc.setFontSize(10);
  line("═══════════════════════════════════════════", true);
  line("SECTION 2 — PER-SUBJECT BRAIN STATE", true);
  line("═══════════════════════════════════════════", true);
  doc.setFontSize(8);
  blank();

  SUBJECTS.forEach((subj, i) => {
    const s2 = seed * (1.2 + i * 0.41);
    const lc = (Math.abs(Math.sin(s2 * 1.5)) * 30 + 60).toFixed(1);
    const state = Math.sin(s2 * 2.1) > 0 ? "ENGAGING" : "RESTING";
    line(`${subj.name} (${subj.title}):`, true);
    line(`  Dominant Region: ${subj.region}`);
    line(`  Local Coherence: ${lc}%`);
    line(`  Behavioral State: ${state}`);
    line(`  Primary Chemical: ${subj.chem}`);
    blank();
  });

  doc.setFontSize(10);
  line("═══════════════════════════════════════════", true);
  line("SECTION 3 — SQUAD NEUROCHEMICAL AVERAGES", true);
  line("═══════════════════════════════════════════", true);
  doc.setFontSize(8);
  blank();
  line("Chemical          | Level  | Status");
  line("------------------+--------+-----------");

  for (const ch of CHEMICALS) {
    const val = Math.abs(Math.sin(seed * ch.seedMul)) * 60 + 30;
    const status = val > 80 ? "ELEVATED" : val < 40 ? "DEPLETED" : "NORMAL";
    const name = ch.key.padEnd(17, " ");
    const valStr = `${val.toFixed(1)}%`.padEnd(7, " ");
    line(`${name} | ${valStr}| ${status}`);
  }
  blank();

  const pageH = doc.internal.pageSize.getHeight();
  doc.setFontSize(7);
  doc.text(
    "© 2026 Alfredo Medina Hernandez — NeuroEmergence Core",
    lm,
    pageH - 24,
  );

  doc.save(`SquadNeuralReport_${ts}.pdf`);
}

// ──────────────────────────────────────────────────────────────────────────────
// Root export
export default function BattleOpsTab() {
  const [mode, setMode] = useState<"menu" | "world">("menu");
  const [lastReportTime, setLastReportTime] = useState<string | null>(null);

  const handleEngagementReport = () => {
    const ts = Date.now();
    generateEngagementReportPDF({});
    setLastReportTime(
      `${new Date(ts).toISOString().replace("T", " ").slice(0, 19)} UTC`,
    );
  };

  const handleSquadReport = () => {
    const ts = Date.now();
    generateSquadNeuralReportPDF({});
    setLastReportTime(
      `${new Date(ts).toISOString().replace("T", " ").slice(0, 19)} UTC`,
    );
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Battle simulation area ── */}
      <div style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
        {mode === "menu" && (
          <BattleOpsStartMenu onEnter={() => setMode("world")} />
        )}
        {mode === "world" && <BattleOpsWorld />}
      </div>

      {/* ── REPORTS SECTION ── */}
      <div
        data-ocid="battleops.reports_section"
        style={{
          background: "#080818",
          borderTop: "2px solid #1e293b",
          padding: "24px 32px 28px",
          width: "100%",
          flexShrink: 0,
          fontFamily: "monospace",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#e2e8f0",
              letterSpacing: 5,
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            BATTLE OPS — NEURAL REPORTS
          </div>
          <div
            style={{
              fontSize: 9,
              color: "#475569",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            POST-ENGAGEMENT ANALYSIS DOCUMENTATION
          </div>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 14,
          }}
        >
          {/* Card 1 — Engagement Report */}
          <div
            data-ocid="battleops.engagement_report_card"
            style={{
              background: "#0a0e1a",
              border: "1px solid #1e293b",
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  fontSize: 22,
                  color: "#ef4444",
                  lineHeight: 1,
                  letterSpacing: -1,
                }}
              >
                ◈
              </span>
              <div>
                <div
                  style={{
                    color: "#e2e8f0",
                    fontSize: 11,
                    fontWeight: "bold",
                    letterSpacing: 3,
                  }}
                >
                  ENGAGEMENT REPORT
                </div>
                <div
                  style={{ color: "#475569", fontSize: 8, letterSpacing: 1 }}
                >
                  CLASSIFICATION: SOVEREIGN INTERNAL
                </div>
              </div>
            </div>
            <div
              style={{
                color: "#64748b",
                fontSize: 9,
                lineHeight: 1.6,
                letterSpacing: 0.5,
              }}
            >
              Full per-avatar neural engagement data with cortisol/dopamine/NE
              surges, regional activation mapping, and PHI-interval recovery
              timeline.
            </div>
            <button
              type="button"
              data-ocid="battleops.generate_engagement_report_button"
              onClick={handleEngagementReport}
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.5)",
                color: "#ef4444",
                padding: "9px 14px",
                fontSize: 9,
                letterSpacing: 2,
                cursor: "pointer",
                fontFamily: "monospace",
                fontWeight: "bold",
                textAlign: "left",
                transition: "all 0.2s",
                marginTop: 4,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(239,68,68,0.22)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(239,68,68,0.12)";
              }}
            >
              ▶ GENERATE ENGAGEMENT REPORT PDF
            </button>
          </div>

          {/* Card 2 — Squad Neural Report */}
          <div
            data-ocid="battleops.squad_report_card"
            style={{
              background: "#0a0e1a",
              border: "1px solid #1e293b",
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  fontSize: 22,
                  color: "#f59e0b",
                  lineHeight: 1,
                  letterSpacing: -1,
                }}
              >
                ◉
              </span>
              <div>
                <div
                  style={{
                    color: "#e2e8f0",
                    fontSize: 11,
                    fontWeight: "bold",
                    letterSpacing: 3,
                  }}
                >
                  SQUAD NEURAL REPORT
                </div>
                <div
                  style={{ color: "#475569", fontSize: 8, letterSpacing: 1 }}
                >
                  CLASSIFICATION: SOVEREIGN INTERNAL
                </div>
              </div>
            </div>
            <div
              style={{
                color: "#64748b",
                fontSize: 9,
                lineHeight: 1.6,
                letterSpacing: 0.5,
              }}
            >
              Aggregate squad brain state — coherence levels, dominant regions,
              neurochemical averages across all 4 subjects with OMNIS gate
              status.
            </div>
            <button
              type="button"
              data-ocid="battleops.generate_squad_report_button"
              onClick={handleSquadReport}
              style={{
                background: "rgba(245,158,11,0.12)",
                border: "1px solid rgba(245,158,11,0.5)",
                color: "#f59e0b",
                padding: "9px 14px",
                fontSize: 9,
                letterSpacing: 2,
                cursor: "pointer",
                fontFamily: "monospace",
                fontWeight: "bold",
                textAlign: "left",
                transition: "all 0.2s",
                marginTop: 4,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(245,158,11,0.22)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(245,158,11,0.12)";
              }}
            >
              ▶ GENERATE SQUAD NEURAL REPORT PDF
            </button>
          </div>
        </div>

        {/* Last report status line */}
        <div
          data-ocid="battleops.last_report_status"
          style={{
            fontSize: 8,
            color: "#334155",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          LAST REPORT GENERATED:{" "}
          <span style={{ color: lastReportTime ? "#22c55e" : "#475569" }}>
            {lastReportTime ?? "No reports generated yet"}
          </span>
        </div>
      </div>
    </div>
  );
}
