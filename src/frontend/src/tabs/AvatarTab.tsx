import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useState } from "react";
import { AvatarBrainChip } from "../components/AvatarBrainChip";
import { useMovementSubstrate } from "../hooks/useMovementSubstrate";
import { useHiveMindState } from "../hooks/useQueries";
import type {
  BodyRegionId,
  JointClusterId,
  MovementMode,
  MovementSubstrateTuning,
  PipelineStep,
  StrategicMovementIntent,
  TacticalMovementContext,
} from "../utils/movementSubstrateTypes";
import {
  BODY_REGIONS,
  CLUSTER_TO_REGION,
  JOINT_CLUSTERS,
  PIPELINE_STEPS,
} from "../utils/movementSubstrateTypes";

// ── Activation color helper ───────────────────────────────────────────────
function activationColor(v: number): string {
  const clamped = Math.max(0, Math.min(1, v));
  if (clamped < 0.33) {
    // cool blue-gray
    const t = clamped / 0.33;
    const l = 0.28 + t * 0.08;
    const c = 0.04 + t * 0.06;
    return `oklch(${l} ${c} 220)`;
  }
  if (clamped < 0.66) {
    // amber
    const t = (clamped - 0.33) / 0.33;
    const l = 0.36 + t * 0.2;
    const c = 0.1 + t * 0.12;
    const h = 220 - t * 175;
    return `oklch(${l} ${c} ${h})`;
  }
  // red-orange
  const t = (clamped - 0.66) / 0.34;
  const l = 0.56 + t * 0.05;
  const c = 0.22 + t * 0.08;
  const h = 45 - t * 20;
  return `oklch(${l} ${c} ${h})`;
}

function activationBg(v: number, alpha = 1): string {
  const color = activationColor(v);
  // extract oklch parts and add alpha
  const m = color.match(/oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/);
  if (!m) return color;
  return `oklch(${m[1]} ${m[2]} ${m[3]} / ${alpha})`;
}

function pipelineColor(status: "ok" | "warn" | "skip"): string {
  if (status === "ok") return "oklch(0.72 0.18 145)";
  if (status === "warn") return "oklch(0.75 0.22 85)";
  return "oklch(0.45 0.03 220)";
}

function modeColor(mode: MovementMode): string {
  const map: Record<MovementMode, string> = {
    idle: "oklch(0.55 0.05 220)",
    walk: "oklch(0.72 0.15 145)",
    run: "oklch(0.72 0.22 165)",
    sprint: "oklch(0.75 0.25 155)",
    crouch: "oklch(0.68 0.18 200)",
    prone: "oklch(0.62 0.14 210)",
    climb: "oklch(0.70 0.20 80)",
    swim: "oklch(0.68 0.18 225)",
    combat_stance: "oklch(0.70 0.26 35)",
    carry: "oklch(0.68 0.16 55)",
    recovery: "oklch(0.68 0.20 310)",
  };
  return map[mode] ?? "oklch(0.55 0.05 220)";
}

const REGION_LABELS: Record<BodyRegionId, string> = {
  head_neck: "HEAD / NECK",
  torso_spine: "TORSO / SPINE",
  left_arm: "LEFT ARM",
  right_arm: "RIGHT ARM",
  left_hand: "LEFT HAND",
  right_hand: "RIGHT HAND",
  pelvis_hips: "PELVIS / HIPS",
  left_leg: "LEFT LEG",
  right_leg: "RIGHT LEG",
};

const CLUSTER_LABELS: Record<JointClusterId, string> = {
  neck: "Neck",
  upper_spine: "Upper Spine",
  lower_spine_pelvis: "L-Spine / Pelvis",
  left_shoulder: "L Shoulder",
  right_shoulder: "R Shoulder",
  left_elbow_forearm: "L Elbow",
  right_elbow_forearm: "R Elbow",
  left_wrist: "L Wrist",
  right_wrist: "R Wrist",
  left_hand_fingers: "L Hand",
  right_hand_fingers: "R Hand",
  left_hip: "L Hip",
  right_hip: "R Hip",
  left_knee: "L Knee",
  right_knee: "R Knee",
  left_ankle_foot: "L Ankle",
  right_ankle_foot: "R Ankle",
};

const PIPELINE_LABELS: Record<PipelineStep, string> = {
  body_state_ingest: "BODY",
  env_ingest: "ENV",
  strategic_ingest: "STRAT",
  tactical_ingest: "TACT",
  main_brain_arbitration: "ARB",
  regional_decomposition: "REGION",
  cluster_execution: "CLUSTER",
  reflex_interception: "REFLEX",
  output_ik: "IK",
  telemetry_return: "TELEM",
};

// ── Body Map SVG ──────────────────────────────────────────────────────────
type BodyRegionSVGDef = {
  id: BodyRegionId;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rx?: number;
};

const BODY_SVG_REGIONS: BodyRegionSVGDef[] = [
  { id: "head_neck", label: "HEAD", x: 70, y: 8, w: 60, h: 52, rx: 28 },
  { id: "torso_spine", label: "TORSO", x: 52, y: 68, w: 96, h: 90, rx: 6 },
  { id: "left_arm", label: "L ARM", x: 8, y: 68, w: 38, h: 72, rx: 10 },
  { id: "right_arm", label: "R ARM", x: 154, y: 68, w: 38, h: 72, rx: 10 },
  { id: "left_hand", label: "L HAND", x: 4, y: 144, w: 34, h: 32, rx: 8 },
  { id: "right_hand", label: "R HAND", x: 162, y: 144, w: 34, h: 32, rx: 8 },
  { id: "pelvis_hips", label: "HIPS", x: 54, y: 162, w: 92, h: 40, rx: 6 },
  { id: "left_leg", label: "L LEG", x: 52, y: 206, w: 44, h: 110, rx: 8 },
  { id: "right_leg", label: "R LEG", x: 104, y: 206, w: 44, h: 110, rx: 8 },
];

function BodyMapSVG({
  regions,
  selectedRegion,
  onSelectRegion,
}: {
  regions: ReturnType<typeof useMovementSubstrate>["state"]["regions"];
  selectedRegion: BodyRegionId | null;
  onSelectRegion: (id: BodyRegionId) => void;
}) {
  return (
    <svg
      viewBox="0 0 200 330"
      width="200"
      height="330"
      role="img"
      aria-label="Body activation map showing regional states"
      style={{ display: "block", margin: "0 auto" }}
    >
      {/* Silhouette outline */}
      <ellipse
        cx="100"
        cy="34"
        rx="34"
        ry="30"
        fill="none"
        stroke="oklch(0.35 0.04 220)"
        strokeWidth="0.5"
      />
      <rect
        x="52"
        y="68"
        width="96"
        height="90"
        rx="6"
        fill="none"
        stroke="oklch(0.35 0.04 220)"
        strokeWidth="0.5"
      />
      <line
        x1="100"
        y1="158"
        x2="100"
        y2="202"
        stroke="oklch(0.35 0.04 220)"
        strokeWidth="0.5"
      />
      {BODY_SVG_REGIONS.map((r) => {
        const activation = regions[r.id]?.currentActivation ?? 0;
        const isSelected = selectedRegion === r.id;
        const reflexActive = regions[r.id]?.reflexOverrideActive ?? false;
        return (
          <g
            key={r.id}
            onClick={() => onSelectRegion(r.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onSelectRegion(r.id);
            }}
            tabIndex={0}
            style={{ cursor: "pointer" }}
          >
            <rect
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              rx={r.rx ?? 4}
              fill={activationBg(activation, 0.72)}
              stroke={
                isSelected
                  ? "oklch(0.85 0.25 200)"
                  : reflexActive
                    ? "oklch(0.75 0.28 60)"
                    : "oklch(0.32 0.04 220)"
              }
              strokeWidth={isSelected ? 2.5 : reflexActive ? 1.5 : 1}
              style={{
                filter: isSelected
                  ? "drop-shadow(0 0 4px oklch(0.85 0.25 200 / 0.6))"
                  : "none",
                transition: "fill 0.15s ease",
              }}
            />
            <text
              x={r.x + r.w / 2}
              y={r.y + r.h / 2 + 4}
              textAnchor="middle"
              fontSize="6.5"
              fontFamily="JetBrains Mono, monospace"
              fill="oklch(0.85 0.04 220)"
              fontWeight="600"
              letterSpacing="0.5"
              style={{ pointerEvents: "none" }}
            >
              {r.label}
            </text>
            <text
              x={r.x + r.w / 2}
              y={r.y + r.h / 2 + 13}
              textAnchor="middle"
              fontSize="5.5"
              fontFamily="JetBrains Mono, monospace"
              fill={activationColor(activation)}
              style={{ pointerEvents: "none" }}
            >
              {(activation * 100).toFixed(0)}%
            </text>
            {reflexActive && (
              <circle
                cx={r.x + r.w - 6}
                cy={r.y + 6}
                r={4}
                fill="oklch(0.75 0.28 60 / 0.9)"
                style={{ animation: "pulse 1s ease-in-out infinite" }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── Mini bar ──────────────────────────────────────────────────────────────
function MiniBar({
  value,
  color,
  label,
}: { value: number; color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        style={{
          color: "oklch(0.5 0.04 220)",
          fontSize: "9px",
          fontFamily: "JetBrains Mono, monospace",
          width: 52,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 4,
          background: "oklch(0.22 0.03 220)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.max(0, Math.min(100, value * 100))}%`,
            height: "100%",
            background: color,
            transition: "width 0.12s ease",
            borderRadius: 2,
          }}
        />
      </div>
      <span
        style={{
          color: "oklch(0.6 0.05 220)",
          fontSize: "9px",
          fontFamily: "JetBrains Mono, monospace",
          width: 28,
          textAlign: "right",
        }}
      >
        {(value * 100).toFixed(0)}%
      </span>
    </div>
  );
}

// ── Activation bar ────────────────────────────────────────────────────────
function ActivationBar({ value, label }: { value: number; label?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {label && (
        <span
          style={{
            color: "oklch(0.5 0.04 220)",
            fontSize: "9px",
            fontFamily: "JetBrains Mono, monospace",
            width: 44,
            flexShrink: 0,
          }}
        >
          {label}
        </span>
      )}
      <div
        style={{
          flex: 1,
          height: 5,
          background: "oklch(0.18 0.03 220)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.max(0, Math.min(100, value * 100))}%`,
            height: "100%",
            background: activationColor(value),
            transition: "width 0.12s ease",
            borderRadius: 2,
          }}
        />
      </div>
      <span
        style={{
          color: activationColor(value),
          fontSize: "9px",
          fontFamily: "JetBrains Mono, monospace",
          width: 28,
          textAlign: "right",
        }}
      >
        {(value * 100).toFixed(0)}%
      </span>
    </div>
  );
}

// ── Labeled slider ────────────────────────────────────────────────────────
function TuningSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  ocid,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  ocid?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between items-center">
        <span
          style={{
            color: "oklch(0.6 0.05 220)",
            fontSize: "10px",
            fontFamily: "JetBrains Mono, monospace",
            letterSpacing: "0.03em",
          }}
        >
          {label}
        </span>
        <span
          style={{
            color: "oklch(0.75 0.15 200)",
            fontSize: "10px",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {value.toFixed(2)}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        data-ocid={ocid}
        className="mt-0.5"
      />
    </div>
  );
}

// ── Main AvatarTab ────────────────────────────────────────────────────────
export function AvatarTab() {
  const { state, setStrategicIntent, setTacticalContext, applyTuning } =
    useMovementSubstrate();
  const [selectedRegion, setSelectedRegion] = useState<BodyRegionId | null>(
    null,
  );
  const [clustersExpanded, setClustersExpanded] = useState(false);

  // Local tuning state for sliders
  const [tuning, setTuning] = useState<MovementSubstrateTuning>(
    () => state.tuning,
  );

  const handleTuning = useCallback(
    (key: keyof MovementSubstrateTuning, value: number) => {
      setTuning((prev) => {
        const next = { ...prev, [key]: value };
        applyTuning({ [key]: value });
        return next;
      });
    },
    [applyTuning],
  );

  const handleRegionalTuning = useCallback(
    (
      type: "regionalStiffness" | "regionalResponsiveness",
      region: BodyRegionId,
      value: number,
    ) => {
      setTuning((prev) => {
        const next = {
          ...prev,
          [type]: { ...prev[type], [region]: value },
        };
        applyTuning({ [type]: next[type] });
        return next;
      });
    },
    [applyTuning],
  );

  // Preset handlers
  const applyPreset = useCallback(
    (preset: "combat" | "stealth" | "recovery" | "baseline") => {
      const presets: Record<string, Partial<MovementSubstrateTuning>> = {
        combat: {
          embodimentFidelity: 0.9,
          reflexSensitivity: 0.9,
          bodyPreservationWeight: 0.4,
          balancePriority: 0.8,
          smoothnessVsAggression: 0.8,
          recoveryAggressiveness: 0.7,
          stepFrequency: 0.75,
          strideLength: 0.7,
        },
        stealth: {
          embodimentFidelity: 0.8,
          reflexSensitivity: 0.6,
          bodyPreservationWeight: 0.7,
          balancePriority: 0.9,
          smoothnessVsAggression: 0.1,
          recoveryAggressiveness: 0.3,
          stepFrequency: 0.3,
          strideLength: 0.35,
          hipSwing: 0.15,
          armSwing: 0.1,
        },
        recovery: {
          embodimentFidelity: 0.7,
          reflexSensitivity: 0.8,
          bodyPreservationWeight: 0.95,
          balancePriority: 0.95,
          smoothnessVsAggression: 0.05,
          recoveryAggressiveness: 0.9,
          injuryCompensationScale: 0.9,
          stepFrequency: 0.25,
          strideLength: 0.25,
        },
        baseline: {
          embodimentFidelity: 0.85,
          reflexSensitivity: 0.7,
          bodyPreservationWeight: 0.6,
          balancePriority: 0.75,
          smoothnessVsAggression: 0.35,
          recoveryAggressiveness: 0.5,
          terrainAdaptationWeight: 0.6,
          injuryCompensationScale: 0.7,
          contactConfidence: 0.8,
          stepFrequency: 0.5,
          strideLength: 0.5,
          hipSwing: 0.4,
          armSwing: 0.45,
        },
      };
      const p = presets[preset];
      setTuning((prev) => ({ ...prev, ...p }));
      applyTuning(p);
    },
    [applyTuning],
  );

  // Strategic intent state
  const [stratPriority, setStratPriority] =
    useState<StrategicMovementIntent["movementPriority"]>("none");
  const [stratSpeed, setStratSpeed] = useState(0.5);
  const [stratStealth, setStratStealth] = useState(0.2);
  const [stratAggression, setStratAggression] = useState(0.5);
  const [stratCaution, setStratCaution] = useState(0.3);

  // Tactical context state
  const [tactThreats, setTactThreats] = useState(0.3);
  const [tactCover, setTactCover] = useState(0.5);
  const [tactTerrain, setTactTerrain] = useState(0.2);
  const [tactSuppression, setTactSuppression] = useState(0.1);
  const [tactUrgency, setTactUrgency] = useState(0.4);
  const [tactContact, setTactContact] = useState(false);

  const sendStrategic = useCallback(() => {
    setStrategicIntent({
      source: "warcommand",
      movementPriority: stratPriority,
      speedBias: stratSpeed,
      stealthBias: stratStealth,
      aggressionBias: stratAggression,
      cautionBias: stratCaution,
      timestamp: Date.now(),
    });
  }, [
    setStrategicIntent,
    stratPriority,
    stratSpeed,
    stratStealth,
    stratAggression,
    stratCaution,
  ]);

  const clearStrategic = useCallback(
    () => setStrategicIntent(null),
    [setStrategicIntent],
  );

  const sendTactical = useCallback(() => {
    setTacticalContext({
      source: "battleops",
      immediateThreats: tactThreats,
      coverOpportunity: tactCover,
      terrainChallenge: tactTerrain,
      suppressionLevel: tactSuppression,
      urgencyMultiplier: tactUrgency,
      contactEngaged: tactContact,
      timestamp: Date.now(),
    });
  }, [
    setTacticalContext,
    tactThreats,
    tactCover,
    tactTerrain,
    tactSuppression,
    tactUrgency,
    tactContact,
  ]);

  const clearTactical = useCallback(
    () => setTacticalContext(null),
    [setTacticalContext],
  );

  const {
    telemetry,
    mainBrain,
    regions,
    clusters,
    reflexLayer,
    bodyMesh,
    tickCount,
    timestampMs,
  } = state;

  const selectedRegionData = selectedRegion ? regions[selectedRegion] : null;
  const selectedRegionClusters = selectedRegion
    ? JOINT_CLUSTERS.filter((c) => CLUSTER_TO_REGION[c] === selectedRegion)
    : [];

  return (
    <div
      style={{
        background: "oklch(0.10 0.02 220)",
        minHeight: "100%",
        color: "oklch(0.85 0.04 220)",
        fontFamily: "JetBrains Mono, monospace",
      }}
      className="p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "oklch(0.72 0.22 145)",
              boxShadow: "0 0 8px oklch(0.72 0.22 145 / 0.8)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          <h1
            style={{
              fontSize: "13px",
              letterSpacing: "0.12em",
              fontWeight: 700,
              color: "oklch(0.88 0.06 220)",
              textTransform: "uppercase",
            }}
          >
            Movement Substrate Control
          </h1>
          <Badge
            style={{
              background: `${modeColor(telemetry.activeMovementMode)}22`,
              color: modeColor(telemetry.activeMovementMode),
              border: `1px solid ${modeColor(telemetry.activeMovementMode)}44`,
              fontSize: "9px",
              letterSpacing: "0.08em",
              fontFamily: "JetBrains Mono, monospace",
              padding: "2px 6px",
            }}
          >
            {telemetry.activeMovementMode.toUpperCase().replace("_", " ")}
          </Badge>
        </div>
        <div
          style={{
            fontSize: "9px",
            color: "oklch(0.42 0.04 220)",
            letterSpacing: "0.05em",
          }}
        >
          TICK {tickCount} · {new Date(timestampMs).toLocaleTimeString()}
        </div>
      </div>

      <Tabs defaultValue="bodymap" className="w-full">
        <TabsList
          style={{
            background: "oklch(0.14 0.03 220)",
            border: "1px solid oklch(0.22 0.04 220)",
            padding: "3px",
            height: "auto",
            gap: "2px",
            borderRadius: "6px",
            marginBottom: "16px",
          }}
          className="flex w-full"
        >
          {[
            { value: "bodymap", label: "BODY MAP", ocid: "avatar.bodymap.tab" },
            { value: "regions", label: "REGIONS", ocid: "avatar.regions.tab" },
            {
              value: "telemetry",
              label: "TELEMETRY",
              ocid: "avatar.telemetry.tab",
            },
            { value: "tuning", label: "TUNING", ocid: "avatar.tuning.tab" },
            {
              value: "integration",
              label: "INTEGRATION",
              ocid: "avatar.integration.tab",
            },
          ].map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              data-ocid={t.ocid}
              style={{
                flex: 1,
                fontSize: "9px",
                letterSpacing: "0.08em",
                padding: "5px 4px",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── PANEL 1: BODY MAP ──────────────────────────────────────── */}
        <TabsContent value="bodymap">
          <div className="flex gap-4 flex-col lg:flex-row">
            {/* Left: SVG + summary */}
            <div
              className="flex flex-col items-center gap-4"
              style={{ minWidth: 220 }}
            >
              <div
                style={{
                  background: "oklch(0.13 0.03 220)",
                  border: "1px solid oklch(0.22 0.04 220)",
                  borderRadius: 8,
                  padding: "12px 16px",
                }}
              >
                <div
                  style={{
                    fontSize: "8px",
                    letterSpacing: "0.12em",
                    color: "oklch(0.45 0.04 220)",
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  BODY ACTIVATION MAP
                </div>
                <BodyMapSVG
                  regions={regions}
                  selectedRegion={selectedRegion}
                  onSelectRegion={(id) =>
                    setSelectedRegion((prev) => (prev === id ? null : id))
                  }
                />
                <div
                  style={{
                    fontSize: "8px",
                    color: "oklch(0.4 0.04 220)",
                    textAlign: "center",
                    marginTop: 6,
                  }}
                >
                  Click region to inspect
                </div>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-2 w-full">
                <div
                  style={{
                    background: "oklch(0.13 0.03 220)",
                    border: "1px solid oklch(0.22 0.04 220)",
                    borderRadius: 6,
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "8px",
                      color: "oklch(0.45 0.04 220)",
                      marginBottom: 4,
                    }}
                  >
                    STABILITY
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: activationColor(telemetry.stabilityScore),
                    }}
                  >
                    {(telemetry.stabilityScore * 100).toFixed(0)}
                  </div>
                  <div
                    style={{ fontSize: "7px", color: "oklch(0.38 0.04 220)" }}
                  >
                    / 100
                  </div>
                </div>
                <div
                  style={{
                    background: "oklch(0.13 0.03 220)",
                    border: `1px solid ${modeColor(telemetry.activeMovementMode)}33`,
                    borderRadius: 6,
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "8px",
                      color: "oklch(0.45 0.04 220)",
                      marginBottom: 4,
                    }}
                  >
                    MODE
                  </div>
                  <div
                    style={{
                      fontSize: "8px",
                      fontWeight: 700,
                      color: modeColor(telemetry.activeMovementMode),
                      letterSpacing: "0.05em",
                    }}
                  >
                    {telemetry.activeMovementMode
                      .replace("_", " ")
                      .toUpperCase()}
                  </div>
                </div>
                <div
                  style={{
                    background: "oklch(0.13 0.03 220)",
                    border: "1px solid oklch(0.22 0.04 220)",
                    borderRadius: 6,
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "8px",
                      color: "oklch(0.45 0.04 220)",
                      marginBottom: 4,
                    }}
                  >
                    POSTURE
                  </div>
                  <div
                    style={{
                      fontSize: "7px",
                      fontWeight: 700,
                      color: "oklch(0.72 0.18 200)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {telemetry.currentPostureBias
                      .replace("_", " ")
                      .toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Region detail + reflexes + pipeline */}
            <div className="flex flex-col gap-3 flex-1">
              {/* Selected region detail */}
              {selectedRegionData ? (
                <div
                  style={{
                    background: "oklch(0.13 0.03 220)",
                    border: "1px solid oklch(0.28 0.06 200)",
                    borderRadius: 8,
                    padding: "12px",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.1em",
                        fontWeight: 700,
                        color: "oklch(0.80 0.10 200)",
                      }}
                    >
                      {REGION_LABELS[selectedRegion!]}
                    </span>
                    <div className="flex items-center gap-2">
                      {selectedRegionData.reflexOverrideActive && (
                        <Badge
                          style={{
                            background: "oklch(0.75 0.28 60 / 0.15)",
                            color: "oklch(0.75 0.28 60)",
                            border: "1px solid oklch(0.75 0.28 60 / 0.4)",
                            fontSize: "8px",
                            animation: "pulse 1s ease-in-out infinite",
                          }}
                        >
                          REFLEX ACTIVE
                        </Badge>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedRegion(null)}
                        style={{
                          color: "oklch(0.4 0.04 220)",
                          fontSize: "10px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <ActivationBar
                      value={selectedRegionData.currentActivation}
                      label="CURRENT"
                    />
                    <ActivationBar
                      value={selectedRegionData.targetActivation}
                      label="TARGET"
                    />
                    <MiniBar
                      value={selectedRegionData.locomotionContribution}
                      color="oklch(0.72 0.22 145)"
                      label="LOCO"
                    />
                    <MiniBar
                      value={selectedRegionData.postureContribution}
                      color="oklch(0.72 0.18 200)"
                      label="POSTURE"
                    />
                    <MiniBar
                      value={selectedRegionData.manipulationContribution}
                      color="oklch(0.72 0.20 280)"
                      label="MANIP"
                    />
                  </div>
                  {selectedRegionClusters.length > 0 && (
                    <div className="mt-3">
                      <div
                        style={{
                          fontSize: "8px",
                          color: "oklch(0.42 0.04 220)",
                          marginBottom: 6,
                          letterSpacing: "0.08em",
                        }}
                      >
                        JOINT CLUSTERS
                      </div>
                      <div className="flex flex-col gap-1">
                        {selectedRegionClusters.map((c) => {
                          const cl = clusters[c];
                          return (
                            <div key={c} className="flex items-center gap-2">
                              <span
                                style={{
                                  color: "oklch(0.55 0.05 220)",
                                  fontSize: "9px",
                                  width: 110,
                                }}
                              >
                                {CLUSTER_LABELS[c]}
                              </span>
                              <ActivationBar value={cl.currentActivation} />
                              {cl.reflexOverride && (
                                <span
                                  style={{
                                    color: "oklch(0.75 0.28 60)",
                                    fontSize: "8px",
                                  }}
                                >
                                  ⚡
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  data-ocid="avatar.bodymap.empty_state"
                  style={{
                    background: "oklch(0.13 0.03 220)",
                    border: "1px solid oklch(0.20 0.03 220)",
                    borderRadius: 8,
                    padding: "20px 12px",
                    textAlign: "center",
                    color: "oklch(0.4 0.04 220)",
                    fontSize: "10px",
                  }}
                >
                  Select a region on the body map to inspect
                </div>
              )}

              {/* Active Reflexes */}
              <div
                style={{
                  background: "oklch(0.13 0.03 220)",
                  border: "1px solid oklch(0.22 0.04 220)",
                  borderRadius: 8,
                  padding: "12px",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.1em",
                      color: "oklch(0.55 0.05 220)",
                    }}
                  >
                    ACTIVE REFLEXES
                  </span>
                  <Badge
                    style={{
                      background:
                        reflexLayer.length > 0
                          ? "oklch(0.75 0.28 60 / 0.15)"
                          : "oklch(0.18 0.03 220)",
                      color:
                        reflexLayer.length > 0
                          ? "oklch(0.75 0.28 60)"
                          : "oklch(0.42 0.04 220)",
                      border: `1px solid ${reflexLayer.length > 0 ? "oklch(0.75 0.28 60 / 0.3)" : "oklch(0.25 0.03 220)"}`,
                      fontSize: "8px",
                    }}
                  >
                    {reflexLayer.length}
                  </Badge>
                </div>
                {reflexLayer.length === 0 ? (
                  <div
                    style={{ fontSize: "9px", color: "oklch(0.38 0.04 220)" }}
                  >
                    No active reflexes
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {reflexLayer.map((rx, i) => (
                      <div
                        key={rx.reflexType + rx.clusterId + rx.startedAt}
                        data-ocid={`avatar.reflex.item.${i + 1}`}
                        className="flex items-center gap-2"
                        style={{
                          background: "oklch(0.16 0.03 220)",
                          borderRadius: 4,
                          padding: "4px 8px",
                          border: "1px solid oklch(0.75 0.28 60 / 0.2)",
                        }}
                      >
                        <span
                          style={{
                            color: "oklch(0.72 0.22 60)",
                            fontSize: "9px",
                            fontWeight: 600,
                            flex: 1,
                          }}
                        >
                          {rx.reflexType.replace(/_/g, " ").toUpperCase()}
                        </span>
                        <span
                          style={{
                            color: "oklch(0.52 0.05 220)",
                            fontSize: "8px",
                          }}
                        >
                          {rx.clusterId}
                        </span>
                        <div
                          style={{
                            width: 48,
                            height: 4,
                            background: "oklch(0.20 0.03 220)",
                            borderRadius: 2,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${rx.intensity * 100}%`,
                              height: "100%",
                              background: "oklch(0.72 0.28 45)",
                              borderRadius: 2,
                            }}
                          />
                        </div>
                        <span
                          style={{
                            color: "oklch(0.42 0.04 220)",
                            fontSize: "8px",
                            width: 20,
                          }}
                        >
                          {rx.remainingTicks}t
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pipeline Status */}
              <div
                style={{
                  background: "oklch(0.13 0.03 220)",
                  border: "1px solid oklch(0.22 0.04 220)",
                  borderRadius: 8,
                  padding: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.1em",
                    color: "oklch(0.55 0.05 220)",
                    marginBottom: 8,
                  }}
                >
                  PIPELINE STATUS
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {PIPELINE_STEPS.map((step) => {
                    const status = telemetry.pipelineStepStatus[step];
                    return (
                      <div
                        key={step}
                        style={{
                          background: `${pipelineColor(status)}15`,
                          border: `1px solid ${pipelineColor(status)}40`,
                          borderRadius: 3,
                          padding: "3px 6px",
                          fontSize: "8px",
                          color: pipelineColor(status),
                          letterSpacing: "0.06em",
                          fontWeight: 600,
                        }}
                      >
                        {PIPELINE_LABELS[step]}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── PANEL 2: REGIONS ──────────────────────────────────────── */}
        <TabsContent value="regions">
          <div className="flex flex-col gap-4">
            {/* 9 region cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {BODY_REGIONS.map((regionId) => {
                const r = regions[regionId];
                return (
                  <div
                    key={regionId}
                    data-ocid="avatar.region.card"
                    style={{
                      background: "oklch(0.13 0.03 220)",
                      border: `1px solid ${r.reflexOverrideActive ? "oklch(0.72 0.28 60 / 0.5)" : "oklch(0.22 0.04 220)"}`,
                      borderRadius: 8,
                      padding: "10px 12px",
                      boxShadow: r.reflexOverrideActive
                        ? "0 0 12px oklch(0.72 0.28 60 / 0.15)"
                        : "none",
                      animation: r.reflexOverrideActive
                        ? "pulse 1.5s ease-in-out infinite"
                        : "none",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        style={{
                          fontSize: "9px",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          color: "oklch(0.75 0.08 220)",
                        }}
                      >
                        {REGION_LABELS[regionId]}
                      </span>
                      {r.reflexOverrideActive && (
                        <span
                          style={{
                            fontSize: "7px",
                            color: "oklch(0.72 0.28 60)",
                          }}
                        >
                          ⚡ REFLEX
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <ActivationBar value={r.currentActivation} label="CURR" />
                      <ActivationBar value={r.targetActivation} label="TGT" />
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                      <MiniBar
                        value={r.locomotionContribution}
                        color="oklch(0.72 0.22 145)"
                        label="LOCO"
                      />
                      <MiniBar
                        value={r.postureContribution}
                        color="oklch(0.72 0.18 200)"
                        label="POSTURE"
                      />
                      <MiniBar
                        value={r.manipulationContribution}
                        color="oklch(0.72 0.20 280)"
                        label="MANIP"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cluster table */}
            <div
              style={{
                background: "oklch(0.13 0.03 220)",
                border: "1px solid oklch(0.22 0.04 220)",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                data-ocid="avatar.cluster.toggle"
                onClick={() => setClustersExpanded((p) => !p)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "oklch(0.60 0.06 220)",
                  fontSize: "9px",
                  letterSpacing: "0.10em",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                <span>
                  JOINT CLUSTER TABLE ({JOINT_CLUSTERS.length} CLUSTERS)
                </span>
                <span>{clustersExpanded ? "▲" : "▼"}</span>
              </button>
              {clustersExpanded && (
                <ScrollArea style={{ maxHeight: 400 }}>
                  <Table>
                    <TableHeader>
                      <TableRow style={{ borderColor: "oklch(0.22 0.04 220)" }}>
                        {[
                          "CLUSTER",
                          "REGION",
                          "CURR",
                          "DESIRED",
                          "STIFF",
                          "DAMP",
                          "CONTACT",
                          "LOAD",
                          "REFLEX",
                        ].map((h) => (
                          <TableHead
                            key={h}
                            style={{
                              fontSize: "8px",
                              color: "oklch(0.45 0.04 220)",
                              letterSpacing: "0.06em",
                              padding: "6px 8px",
                            }}
                          >
                            {h}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {JOINT_CLUSTERS.map((cId) => {
                        const cl = clusters[cId];
                        const isHighLoad = cl.smoothedOutput > 0.75;
                        return (
                          <TableRow
                            key={cId}
                            style={{
                              borderColor: "oklch(0.18 0.03 220)",
                              background: isHighLoad
                                ? "oklch(0.75 0.22 60 / 0.06)"
                                : "transparent",
                            }}
                          >
                            <TableCell
                              style={{
                                fontSize: "9px",
                                color: isHighLoad
                                  ? "oklch(0.78 0.22 60)"
                                  : "oklch(0.65 0.06 220)",
                                padding: "5px 8px",
                                fontFamily: "JetBrains Mono, monospace",
                              }}
                            >
                              {CLUSTER_LABELS[cId]}
                            </TableCell>
                            <TableCell
                              style={{
                                fontSize: "8px",
                                color: "oklch(0.45 0.04 220)",
                                padding: "5px 8px",
                              }}
                            >
                              {cl.regionId.replace("_", " ")}
                            </TableCell>
                            <TableCell style={{ padding: "5px 8px" }}>
                              <span
                                style={{
                                  fontSize: "9px",
                                  color: activationColor(cl.currentActivation),
                                  fontFamily: "JetBrains Mono, monospace",
                                }}
                              >
                                {(cl.currentActivation * 100).toFixed(0)}%
                              </span>
                            </TableCell>
                            <TableCell style={{ padding: "5px 8px" }}>
                              <span
                                style={{
                                  fontSize: "9px",
                                  color: "oklch(0.55 0.05 220)",
                                  fontFamily: "JetBrains Mono, monospace",
                                }}
                              >
                                {(cl.desiredActivation * 100).toFixed(0)}%
                              </span>
                            </TableCell>
                            <TableCell style={{ padding: "5px 8px" }}>
                              <span
                                style={{
                                  fontSize: "9px",
                                  color: "oklch(0.55 0.06 200)",
                                  fontFamily: "JetBrains Mono, monospace",
                                }}
                              >
                                {cl.stiffness.toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell style={{ padding: "5px 8px" }}>
                              <span
                                style={{
                                  fontSize: "9px",
                                  color: "oklch(0.50 0.05 220)",
                                  fontFamily: "JetBrains Mono, monospace",
                                }}
                              >
                                {cl.damping.toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell style={{ padding: "5px 8px" }}>
                              <span
                                style={{
                                  fontSize: "9px",
                                  color:
                                    cl.contactAdaptation > 0.5
                                      ? "oklch(0.72 0.22 145)"
                                      : "oklch(0.38 0.04 220)",
                                  fontFamily: "JetBrains Mono, monospace",
                                }}
                              >
                                {cl.contactAdaptation.toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell style={{ padding: "5px 8px" }}>
                              <span
                                style={{
                                  fontSize: "9px",
                                  color: cl.loadBearing
                                    ? "oklch(0.72 0.22 145)"
                                    : "oklch(0.38 0.04 220)",
                                  fontFamily: "JetBrains Mono, monospace",
                                }}
                              >
                                {cl.loadBearing ? "YES" : "NO"}
                              </span>
                            </TableCell>
                            <TableCell style={{ padding: "5px 8px" }}>
                              {cl.reflexOverride && (
                                <span
                                  style={{
                                    color: "oklch(0.75 0.28 60)",
                                    fontSize: "9px",
                                  }}
                                >
                                  ⚡
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ── PANEL 3: TELEMETRY ────────────────────────────────────── */}
        <TabsContent value="telemetry">
          <div className="flex flex-col gap-4">
            {/* Top row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Movement mode */}
              <div
                style={{
                  background: "oklch(0.13 0.03 220)",
                  border: `1px solid ${modeColor(telemetry.activeMovementMode)}33`,
                  borderRadius: 8,
                  padding: "14px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "8px",
                    color: "oklch(0.42 0.04 220)",
                    marginBottom: 8,
                    letterSpacing: "0.1em",
                  }}
                >
                  MOVEMENT MODE
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: modeColor(telemetry.activeMovementMode),
                    letterSpacing: "0.06em",
                    textShadow: `0 0 12px ${modeColor(telemetry.activeMovementMode)}60`,
                  }}
                >
                  {telemetry.activeMovementMode.replace("_", " ").toUpperCase()}
                </div>
                <div
                  style={{
                    fontSize: "8px",
                    color: "oklch(0.42 0.04 220)",
                    marginTop: 6,
                  }}
                >
                  {telemetry.currentPostureBias.replace("_", " ").toUpperCase()}
                </div>
              </div>

              {/* Strategic influence */}
              <div
                style={{
                  background: "oklch(0.13 0.03 220)",
                  border: "1px solid oklch(0.22 0.04 220)",
                  borderRadius: 8,
                  padding: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "8px",
                    color: "oklch(0.60 0.10 200)",
                    marginBottom: 6,
                    letterSpacing: "0.1em",
                  }}
                >
                  WARCOMMAND INPUT
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    color: "oklch(0.62 0.06 220)",
                    lineHeight: 1.5,
                    marginBottom: 8,
                  }}
                >
                  {telemetry.strategicInfluenceSummary}
                </div>
                <MiniBar
                  value={mainBrain.strategicInfluence}
                  color="oklch(0.65 0.18 200)"
                  label="INFLUENCE"
                />
              </div>

              {/* Tactical influence */}
              <div
                style={{
                  background: "oklch(0.13 0.03 220)",
                  border: "1px solid oklch(0.22 0.04 220)",
                  borderRadius: 8,
                  padding: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "8px",
                    color: "oklch(0.68 0.18 45)",
                    marginBottom: 6,
                    letterSpacing: "0.1em",
                  }}
                >
                  BATTLEOPS INPUT
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    color: "oklch(0.62 0.06 220)",
                    lineHeight: 1.5,
                    marginBottom: 8,
                  }}
                >
                  {telemetry.tacticalInfluenceSummary}
                </div>
                <MiniBar
                  value={mainBrain.tacticalInfluence}
                  color="oklch(0.72 0.22 45)"
                  label="INFLUENCE"
                />
              </div>
            </div>

            {/* Body-State Mesh */}
            <div
              style={{
                background: "oklch(0.13 0.03 220)",
                border: "1px solid oklch(0.22 0.04 220)",
                borderRadius: 8,
                padding: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.10em",
                  color: "oklch(0.55 0.05 220)",
                  marginBottom: 10,
                }}
              >
                BODY-STATE MESH
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  {
                    label: "OVERALL STABILITY",
                    value: bodyMesh.overallStabilityScore,
                  },
                  {
                    label: "MOTION SMOOTHNESS",
                    value: bodyMesh.motionSmoothnessScore,
                  },
                  {
                    label: "PROPRIOCEPTIVE CONF",
                    value: bodyMesh.proprioceptiveConfidence,
                  },
                  { label: "TOTAL FATIGUE", value: bodyMesh.totalFatigueLoad },
                  {
                    label: "TERRAIN DIFFICULTY",
                    value: bodyMesh.terrainDifficultyEstimate,
                  },
                  {
                    label: "CONTACT POINTS",
                    value:
                      Object.values(bodyMesh.contactPoints).filter(Boolean)
                        .length / 4,
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <div
                      style={{
                        fontSize: "8px",
                        color: "oklch(0.42 0.04 220)",
                        marginBottom: 3,
                        letterSpacing: "0.06em",
                      }}
                    >
                      {item.label}
                    </div>
                    <ActivationBar value={item.value} />
                  </div>
                ))}
              </div>
            </div>

            {/* Joint sensor heatmap */}
            <div
              style={{
                background: "oklch(0.13 0.03 220)",
                border: "1px solid oklch(0.22 0.04 220)",
                borderRadius: 8,
                padding: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.10em",
                  color: "oklch(0.55 0.05 220)",
                  marginBottom: 10,
                }}
              >
                JOINT LOAD HEATMAP
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-1.5">
                {JOINT_CLUSTERS.map((cId) => {
                  const load = clusters[cId]?.smoothedOutput ?? 0;
                  return (
                    <div
                      key={cId}
                      title={`${CLUSTER_LABELS[cId]}: ${(load * 100).toFixed(0)}%`}
                      style={{
                        background: activationBg(load, 0.8),
                        borderRadius: 4,
                        padding: "5px 4px",
                        textAlign: "center",
                        border: "1px solid oklch(0.22 0.04 220)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "6.5px",
                          color: "oklch(0.85 0.04 220)",
                          letterSpacing: "0.04em",
                          lineHeight: 1.2,
                          marginBottom: 2,
                        }}
                      >
                        {CLUSTER_LABELS[cId].toUpperCase()}
                      </div>
                      <div
                        style={{
                          fontSize: "9px",
                          fontWeight: 700,
                          color: activationColor(load),
                        }}
                      >
                        {(load * 100).toFixed(0)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Conflict Resolution Log */}
            <div
              style={{
                background: "oklch(0.13 0.03 220)",
                border: "1px solid oklch(0.22 0.04 220)",
                borderRadius: 8,
                padding: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.10em",
                  color: "oklch(0.55 0.05 220)",
                  marginBottom: 8,
                }}
              >
                CONFLICT RESOLUTION LOG
              </div>
              {mainBrain.conflictResolutionLog.length === 0 ? (
                <div style={{ fontSize: "9px", color: "oklch(0.35 0.04 220)" }}>
                  No conflicts recorded
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {mainBrain.conflictResolutionLog.slice(-5).map((entry, i) => (
                    <div
                      key={entry}
                      data-ocid={`avatar.conflict.item.${i + 1}`}
                      style={{
                        fontSize: "9px",
                        color: "oklch(0.62 0.10 45)",
                        background: "oklch(0.16 0.04 220)",
                        borderRadius: 3,
                        padding: "4px 8px",
                        borderLeft: "2px solid oklch(0.72 0.22 45 / 0.5)",
                      }}
                    >
                      {entry}
                    </div>
                  ))}
                </div>
              )}
              <div
                style={{
                  fontSize: "8px",
                  color: "oklch(0.38 0.04 220)",
                  marginTop: 8,
                }}
              >
                TICK {tickCount} ·{" "}
                {new Date(timestampMs).toISOString().slice(11, 23)}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── PANEL 4: TUNING ───────────────────────────────────────── */}
        <TabsContent value="tuning">
          <ScrollArea style={{ height: "calc(100vh - 200px)" }}>
            <div className="flex flex-col gap-4 pr-2">
              {/* Presets */}
              <div
                style={{
                  background: "oklch(0.13 0.03 220)",
                  border: "1px solid oklch(0.22 0.04 220)",
                  borderRadius: 8,
                  padding: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.10em",
                    color: "oklch(0.55 0.05 220)",
                    marginBottom: 10,
                  }}
                >
                  PRESETS
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    data-ocid="avatar.preset.combat.button"
                    onClick={() => applyPreset("combat")}
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.06em",
                      background: "oklch(0.65 0.22 35 / 0.2)",
                      border: "1px solid oklch(0.65 0.22 35 / 0.5)",
                      color: "oklch(0.75 0.22 35)",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    COMBAT READY
                  </Button>
                  <Button
                    size="sm"
                    data-ocid="avatar.preset.stealth.button"
                    onClick={() => applyPreset("stealth")}
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.06em",
                      background: "oklch(0.60 0.18 280 / 0.2)",
                      border: "1px solid oklch(0.60 0.18 280 / 0.5)",
                      color: "oklch(0.70 0.18 280)",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    STEALTH WALK
                  </Button>
                  <Button
                    size="sm"
                    data-ocid="avatar.preset.recovery.button"
                    onClick={() => applyPreset("recovery")}
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.06em",
                      background: "oklch(0.65 0.20 310 / 0.2)",
                      border: "1px solid oklch(0.65 0.20 310 / 0.5)",
                      color: "oklch(0.72 0.20 310)",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    RECOVERY MODE
                  </Button>
                  <Button
                    size="sm"
                    data-ocid="avatar.preset.baseline.button"
                    onClick={() => applyPreset("baseline")}
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.06em",
                      background: "oklch(0.18 0.03 220)",
                      border: "1px solid oklch(0.30 0.04 220)",
                      color: "oklch(0.62 0.06 220)",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    BASELINE
                  </Button>
                </div>
              </div>

              {/* Core parameters */}
              <div
                style={{
                  background: "oklch(0.13 0.03 220)",
                  border: "1px solid oklch(0.22 0.04 220)",
                  borderRadius: 8,
                  padding: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.10em",
                    color: "oklch(0.55 0.05 220)",
                    marginBottom: 12,
                  }}
                >
                  CORE PARAMETERS
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TuningSlider
                    label="Embodiment Fidelity"
                    value={tuning.embodimentFidelity}
                    onChange={(v) => handleTuning("embodimentFidelity", v)}
                    ocid="avatar.tuning.embodiment.input"
                  />
                  <TuningSlider
                    label="Reflex Sensitivity"
                    value={tuning.reflexSensitivity}
                    onChange={(v) => handleTuning("reflexSensitivity", v)}
                    ocid="avatar.tuning.reflex.input"
                  />
                  <TuningSlider
                    label="Body Preservation"
                    value={tuning.bodyPreservationWeight}
                    onChange={(v) => handleTuning("bodyPreservationWeight", v)}
                    ocid="avatar.tuning.preservation.input"
                  />
                  <TuningSlider
                    label="Balance Priority"
                    value={tuning.balancePriority}
                    onChange={(v) => handleTuning("balancePriority", v)}
                    ocid="avatar.tuning.balance.input"
                  />
                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between items-center">
                      <span
                        style={{
                          color: "oklch(0.6 0.05 220)",
                          fontSize: "10px",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        Smooth ← → Aggressive
                      </span>
                      <span
                        style={{
                          color: "oklch(0.75 0.15 200)",
                          fontSize: "10px",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        {tuning.smoothnessVsAggression.toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      value={[tuning.smoothnessVsAggression]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={([v]) =>
                        handleTuning("smoothnessVsAggression", v)
                      }
                      data-ocid="avatar.tuning.smoothness.input"
                    />
                  </div>
                  <TuningSlider
                    label="Recovery Aggressiveness"
                    value={tuning.recoveryAggressiveness}
                    onChange={(v) => handleTuning("recoveryAggressiveness", v)}
                    ocid="avatar.tuning.recovery.input"
                  />
                  <TuningSlider
                    label="Terrain Adaptation"
                    value={tuning.terrainAdaptationWeight}
                    onChange={(v) => handleTuning("terrainAdaptationWeight", v)}
                    ocid="avatar.tuning.terrain.input"
                  />
                  <TuningSlider
                    label="Injury Compensation"
                    value={tuning.injuryCompensationScale}
                    onChange={(v) => handleTuning("injuryCompensationScale", v)}
                    ocid="avatar.tuning.injury.input"
                  />
                  <TuningSlider
                    label="Contact Confidence"
                    value={tuning.contactConfidence}
                    onChange={(v) => handleTuning("contactConfidence", v)}
                    ocid="avatar.tuning.contact.input"
                  />
                </div>
              </div>

              {/* Gait */}
              <div
                style={{
                  background: "oklch(0.13 0.03 220)",
                  border: "1px solid oklch(0.22 0.04 220)",
                  borderRadius: 8,
                  padding: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.10em",
                    color: "oklch(0.55 0.05 220)",
                    marginBottom: 12,
                  }}
                >
                  GAIT PARAMETERS
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TuningSlider
                    label="Step Frequency"
                    value={tuning.stepFrequency}
                    onChange={(v) => handleTuning("stepFrequency", v)}
                    ocid="avatar.tuning.stepfreq.input"
                  />
                  <TuningSlider
                    label="Stride Length"
                    value={tuning.strideLength}
                    onChange={(v) => handleTuning("strideLength", v)}
                    ocid="avatar.tuning.stride.input"
                  />
                  <TuningSlider
                    label="Hip Swing"
                    value={tuning.hipSwing}
                    onChange={(v) => handleTuning("hipSwing", v)}
                    ocid="avatar.tuning.hipswing.input"
                  />
                  <TuningSlider
                    label="Arm Swing"
                    value={tuning.armSwing}
                    onChange={(v) => handleTuning("armSwing", v)}
                    ocid="avatar.tuning.armswing.input"
                  />
                </div>
              </div>

              {/* Per-region stiffness */}
              <div
                style={{
                  background: "oklch(0.13 0.03 220)",
                  border: "1px solid oklch(0.22 0.04 220)",
                  borderRadius: 8,
                  padding: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.10em",
                    color: "oklch(0.55 0.05 220)",
                    marginBottom: 12,
                  }}
                >
                  PER-REGION STIFFNESS
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {BODY_REGIONS.map((r) => (
                    <TuningSlider
                      key={r}
                      label={REGION_LABELS[r].split(" / ")[0]}
                      value={tuning.regionalStiffness[r]}
                      onChange={(v) =>
                        handleRegionalTuning("regionalStiffness", r, v)
                      }
                      ocid="avatar.tuning.stiffness.input"
                    />
                  ))}
                </div>
              </div>

              {/* Per-region responsiveness */}
              <div
                style={{
                  background: "oklch(0.13 0.03 220)",
                  border: "1px solid oklch(0.22 0.04 220)",
                  borderRadius: 8,
                  padding: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.10em",
                    color: "oklch(0.55 0.05 220)",
                    marginBottom: 12,
                  }}
                >
                  PER-REGION RESPONSIVENESS
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {BODY_REGIONS.map((r) => (
                    <TuningSlider
                      key={r}
                      label={REGION_LABELS[r].split(" / ")[0]}
                      value={tuning.regionalResponsiveness[r]}
                      onChange={(v) =>
                        handleRegionalTuning("regionalResponsiveness", r, v)
                      }
                      ocid="avatar.tuning.responsiveness.input"
                    />
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ── PANEL 5: INTEGRATION ──────────────────────────────────── */}
        <TabsContent value="integration">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strategic Intent (WarCommand) */}
            <div
              style={{
                background: "oklch(0.13 0.03 220)",
                border: "1px solid oklch(0.45 0.12 200 / 0.4)",
                borderRadius: 8,
                padding: "14px",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "oklch(0.65 0.18 200)",
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.10em",
                    color: "oklch(0.70 0.12 200)",
                  }}
                >
                  WARCOMMAND — STRATEGIC INTENT
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <Label
                    style={{
                      fontSize: "9px",
                      color: "oklch(0.52 0.05 220)",
                      letterSpacing: "0.08em",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    MOVEMENT PRIORITY
                  </Label>
                  <Select
                    value={stratPriority}
                    onValueChange={(v) =>
                      setStratPriority(
                        v as StrategicMovementIntent["movementPriority"],
                      )
                    }
                  >
                    <SelectTrigger
                      data-ocid="avatar.strategic.priority.select"
                      style={{
                        marginTop: 4,
                        fontSize: "10px",
                        fontFamily: "JetBrains Mono, monospace",
                        background: "oklch(0.16 0.03 220)",
                        border: "1px solid oklch(0.26 0.04 220)",
                        color: "oklch(0.75 0.06 220)",
                      }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        background: "oklch(0.16 0.03 220)",
                        border: "1px solid oklch(0.26 0.04 220)",
                      }}
                    >
                      {(
                        [
                          "advance",
                          "hold",
                          "retreat",
                          "flank",
                          "regroup",
                          "none",
                        ] as const
                      ).map((p) => (
                        <SelectItem
                          key={p}
                          value={p}
                          style={{
                            fontSize: "10px",
                            fontFamily: "JetBrains Mono, monospace",
                            color: "oklch(0.72 0.06 220)",
                          }}
                        >
                          {p.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <TuningSlider
                  label="Speed Bias"
                  value={stratSpeed}
                  onChange={setStratSpeed}
                  ocid="avatar.strategic.speed.input"
                />
                <TuningSlider
                  label="Stealth Bias"
                  value={stratStealth}
                  onChange={setStratStealth}
                  ocid="avatar.strategic.stealth.input"
                />
                <TuningSlider
                  label="Aggression Bias"
                  value={stratAggression}
                  onChange={setStratAggression}
                  ocid="avatar.strategic.aggression.input"
                />
                <TuningSlider
                  label="Caution Bias"
                  value={stratCaution}
                  onChange={setStratCaution}
                  ocid="avatar.strategic.caution.input"
                />
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  data-ocid="avatar.strategic.send.button"
                  onClick={sendStrategic}
                  style={{
                    flex: 1,
                    fontSize: "9px",
                    letterSpacing: "0.08em",
                    background: "oklch(0.52 0.16 200 / 0.25)",
                    border: "1px solid oklch(0.52 0.16 200 / 0.6)",
                    color: "oklch(0.75 0.18 200)",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  SEND STRATEGIC INTENT
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid="avatar.strategic.clear.button"
                  onClick={clearStrategic}
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.06em",
                    background: "oklch(0.16 0.03 220)",
                    border: "1px solid oklch(0.26 0.04 220)",
                    color: "oklch(0.52 0.05 220)",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  CLEAR
                </Button>
              </div>
            </div>

            {/* Tactical Context (BattleOps) */}
            <div
              style={{
                background: "oklch(0.13 0.03 220)",
                border: "1px solid oklch(0.55 0.18 45 / 0.35)",
                borderRadius: 8,
                padding: "14px",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "oklch(0.72 0.22 45)",
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.10em",
                    color: "oklch(0.72 0.18 45)",
                  }}
                >
                  BATTLEOPS — TACTICAL CONTEXT
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <TuningSlider
                  label="Immediate Threats"
                  value={tactThreats}
                  onChange={setTactThreats}
                  ocid="avatar.tactical.threats.input"
                />
                <TuningSlider
                  label="Cover Opportunity"
                  value={tactCover}
                  onChange={setTactCover}
                  ocid="avatar.tactical.cover.input"
                />
                <TuningSlider
                  label="Terrain Challenge"
                  value={tactTerrain}
                  onChange={setTactTerrain}
                  ocid="avatar.tactical.terrain.input"
                />
                <TuningSlider
                  label="Suppression Level"
                  value={tactSuppression}
                  onChange={setTactSuppression}
                  ocid="avatar.tactical.suppression.input"
                />
                <TuningSlider
                  label="Urgency Multiplier"
                  value={tactUrgency}
                  onChange={setTactUrgency}
                  ocid="avatar.tactical.urgency.input"
                />
                <div className="flex items-center gap-2 mt-1">
                  <Checkbox
                    id="contact-engaged"
                    checked={tactContact}
                    onCheckedChange={(v) => setTactContact(!!v)}
                    data-ocid="avatar.tactical.contact.checkbox"
                    style={{ borderColor: "oklch(0.35 0.06 220)" }}
                  />
                  <Label
                    htmlFor="contact-engaged"
                    style={{
                      fontSize: "10px",
                      color: "oklch(0.60 0.06 220)",
                      fontFamily: "JetBrains Mono, monospace",
                      cursor: "pointer",
                    }}
                  >
                    CONTACT ENGAGED
                  </Label>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  data-ocid="avatar.tactical.send.button"
                  onClick={sendTactical}
                  style={{
                    flex: 1,
                    fontSize: "9px",
                    letterSpacing: "0.08em",
                    background: "oklch(0.55 0.18 45 / 0.22)",
                    border: "1px solid oklch(0.55 0.18 45 / 0.55)",
                    color: "oklch(0.78 0.22 45)",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  SEND TACTICAL CONTEXT
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid="avatar.tactical.clear.button"
                  onClick={clearTactical}
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.06em",
                    background: "oklch(0.16 0.03 220)",
                    border: "1px solid oklch(0.26 0.04 220)",
                    color: "oklch(0.52 0.05 220)",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  CLEAR
                </Button>
              </div>
            </div>

            {/* Live Response Preview */}
            <div
              style={{
                background: "oklch(0.13 0.03 220)",
                border: "1px solid oklch(0.22 0.04 220)",
                borderRadius: 8,
                padding: "14px",
              }}
              className="md:col-span-2"
            >
              <div
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.10em",
                  color: "oklch(0.55 0.05 220)",
                  marginBottom: 12,
                }}
              >
                LIVE RESPONSE PREVIEW
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  style={{
                    background: `${modeColor(telemetry.activeMovementMode)}15`,
                    border: `1px solid ${modeColor(telemetry.activeMovementMode)}30`,
                    borderRadius: 6,
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "7px",
                      color: "oklch(0.42 0.04 220)",
                      marginBottom: 4,
                      letterSpacing: "0.08em",
                    }}
                  >
                    MOVEMENT MODE
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: modeColor(telemetry.activeMovementMode),
                    }}
                  >
                    {telemetry.activeMovementMode
                      .replace("_", " ")
                      .toUpperCase()}
                  </div>
                </div>
                <div
                  style={{
                    background: "oklch(0.16 0.03 220)",
                    border: "1px solid oklch(0.24 0.04 220)",
                    borderRadius: 6,
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "7px",
                      color: "oklch(0.42 0.04 220)",
                      marginBottom: 4,
                      letterSpacing: "0.08em",
                    }}
                  >
                    POSTURE BIAS
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      color: "oklch(0.70 0.12 200)",
                    }}
                  >
                    {telemetry.currentPostureBias
                      .replace("_", " ")
                      .toUpperCase()}
                  </div>
                </div>
                <div
                  style={{
                    background: "oklch(0.16 0.03 220)",
                    border: "1px solid oklch(0.24 0.04 220)",
                    borderRadius: 6,
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "7px",
                      color: "oklch(0.42 0.04 220)",
                      marginBottom: 4,
                      letterSpacing: "0.08em",
                    }}
                  >
                    STRATEGIC INFLUENCE
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "oklch(0.68 0.18 200)",
                    }}
                  >
                    {(mainBrain.strategicInfluence * 100).toFixed(0)}%
                  </div>
                </div>
                <div
                  style={{
                    background: "oklch(0.16 0.03 220)",
                    border: "1px solid oklch(0.24 0.04 220)",
                    borderRadius: 6,
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "7px",
                      color: "oklch(0.42 0.04 220)",
                      marginBottom: 4,
                      letterSpacing: "0.08em",
                    }}
                  >
                    TACTICAL INFLUENCE
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "oklch(0.72 0.22 45)",
                    }}
                  >
                    {(mainBrain.tacticalInfluence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── HIVE MIND SECTION ─────────────────────────────────────────── */}
      <HiveMindSection />
    </div>
  );
}

function HiveMindSection() {
  const [collapsed, setCollapsed] = useState(false);
  const { data: hive } = useHiveMindState();

  const coherence = hive?.coherence ?? 0.72;
  const dominant = hive?.dominantSharedState ?? "SYNCHRONIZED";
  const avatars = hive?.avatars ?? [
    {
      id: "AXIOM",
      behavioralState: "SOLVING",
      da: 0.74,
      ser: 0.61,
      ne: 0.55,
      cerebraSyncPct: 87,
    },
    {
      id: "PHANTOM",
      behavioralState: "OBSERVING",
      da: 0.58,
      ser: 0.72,
      ne: 0.43,
      cerebraSyncPct: 79,
    },
    {
      id: "SENTINEL",
      behavioralState: "SYNCHRONIZED",
      da: 0.63,
      ser: 0.68,
      ne: 0.71,
      cerebraSyncPct: 94,
    },
    {
      id: "FLUX",
      behavioralState: "MINING",
      da: 0.81,
      ser: 0.49,
      ne: 0.66,
      cerebraSyncPct: 73,
    },
  ];

  const coherenceColor =
    coherence > 0.7
      ? "oklch(0.68 0.28 140)"
      : coherence > 0.3
        ? "oklch(0.78 0.22 80)"
        : "oklch(0.65 0.25 25)";

  const badges: Record<string, string> = {
    AXIOM: "ANALYTICAL",
    PHANTOM: "CREATIVE",
    SENTINEL: "VIGILANT",
    FLUX: "ADAPTIVE",
  };

  return (
    <div
      data-ocid="hivemind.section"
      style={{
        margin: "12px 8px 8px",
        border: "1px solid oklch(0.22 0.06 240)",
        borderRadius: 8,
        background: "oklch(0.09 0.018 260)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <button
        type="button"
        data-ocid="hivemind.collapse_toggle"
        onClick={() => setCollapsed((c) => !c)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "7px 12px",
          background: "oklch(0.11 0.025 260)",
          borderBottom: collapsed ? "none" : "1px solid oklch(0.18 0.05 240)",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            letterSpacing: "0.18em",
            color: "oklch(0.62 0.22 195)",
            fontWeight: 700,
          }}
        >
          HIVE MIND — AVATAR CONSCIOUSNESS NETWORK
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "oklch(0.4 0.05 220)",
          }}
        >
          {collapsed ? "►" : "▼"}
        </span>
      </button>

      {!collapsed && (
        <div style={{ padding: "10px 12px" }}>
          {/* Coherence bar + dominant state */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 8,
                color: "oklch(0.42 0.04 220)",
                letterSpacing: "0.1em",
                whiteSpace: "nowrap",
              }}
            >
              COHERENCE
            </span>
            <div
              style={{
                flex: 1,
                height: 6,
                background: "oklch(0.14 0.03 250)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${coherence * 100}%`,
                  height: "100%",
                  background: coherenceColor,
                  borderRadius: 3,
                  transition: "width 0.4s",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                color: coherenceColor,
                fontWeight: 700,
                minWidth: 32,
              }}
            >
              {(coherence * 100).toFixed(0)}%
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 8,
                color: "oklch(0.55 0.12 200)",
                letterSpacing: "0.08em",
                padding: "2px 6px",
                border: "1px solid oklch(0.22 0.06 240)",
                borderRadius: 4,
              }}
            >
              {dominant}
            </span>
          </div>

          {/* Avatar cards 2x2 */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            {avatars.map((av) => (
              <div
                key={av.id}
                data-ocid={`hivemind.avatar.${av.id.toLowerCase()}`}
                style={{
                  background: "oklch(0.12 0.025 255)",
                  border: "1px solid oklch(0.2 0.05 240)",
                  borderRadius: 6,
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                {/* Name + badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "oklch(0.85 0.06 210)",
                    }}
                  >
                    {av.id}
                  </span>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 7,
                      color: "oklch(0.6 0.14 195)",
                      letterSpacing: "0.1em",
                      padding: "1px 5px",
                      border: "1px solid oklch(0.22 0.07 220)",
                      borderRadius: 3,
                    }}
                  >
                    {badges[av.id] ?? "AGENT"}
                  </span>
                </div>

                {/* Brain chip */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <AvatarBrainChip entityId={av.id} />
                </div>

                {/* Behavioral state */}
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 8,
                    color: "oklch(0.72 0.22 140)",
                    letterSpacing: "0.1em",
                    textAlign: "center",
                  }}
                >
                  {av.behavioralState}
                </div>

                {/* Neurochemical pills */}
                <div
                  style={{ display: "flex", gap: 4, justifyContent: "center" }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 7,
                      padding: "1px 5px",
                      borderRadius: 10,
                      background: "oklch(0.22 0.08 80)",
                      color: "oklch(0.82 0.22 80)",
                    }}
                  >
                    DA {(av.da * 100).toFixed(0)}
                  </span>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 7,
                      padding: "1px 5px",
                      borderRadius: 10,
                      background: "oklch(0.18 0.06 200)",
                      color: "oklch(0.72 0.2 200)",
                    }}
                  >
                    5HT {(av.ser * 100).toFixed(0)}
                  </span>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 7,
                      padding: "1px 5px",
                      borderRadius: 10,
                      background: "oklch(0.20 0.08 280)",
                      color: "oklch(0.72 0.18 280)",
                    }}
                  >
                    NE {(av.ne * 100).toFixed(0)}
                  </span>
                </div>

                {/* CEREBIX sync */}
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 7,
                      color: "oklch(0.42 0.04 220)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    CEREBIX SYNC
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 3,
                      background: "oklch(0.14 0.03 250)",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${av.cerebraSyncPct}%`,
                        height: "100%",
                        background: "oklch(0.68 0.22 195)",
                        borderRadius: 2,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 7,
                      color: "oklch(0.62 0.18 195)",
                      minWidth: 24,
                    }}
                  >
                    {av.cerebraSyncPct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AvatarTab;
