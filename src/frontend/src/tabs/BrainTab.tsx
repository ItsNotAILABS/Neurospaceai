import { useEffect, useMemo, useState } from "react";
import { ANSPanel } from "../components/ANSPanel";
import { BrainVisualization } from "../components/BrainVisualization";
import { CircuitMotifsPanel } from "../components/CircuitMotifsPanel";
import { CognitiveDashboard } from "../components/CognitiveDashboard";
import { CoreBrainMonitorPanel } from "../components/CoreBrainMonitorPanel";
import { NeuroChemPanel } from "../components/NeuroChem";
import { StatsPanel } from "../components/StatsPanel";
import type {
  NeuralSimulationControls,
  NeuralSimulationState,
  SilenceEntry,
  ThoughtEntry,
} from "../hooks/useNeuralSimulation";
import {
  useCanonicalState,
  useFearMissionState,
  useNeuroscienceState,
} from "../hooks/useQueries";

type Neural = NeuralSimulationState & NeuralSimulationControls;

// ─── Live Thought Feed ────────────────────────────────────────────────────────
function LiveThoughtFeed({
  thoughtLog,
  isRunning,
}: {
  thoughtLog: ThoughtEntry[];
  isRunning: boolean;
}) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const recent = thoughtLog.slice(0, 8);
  const latest = recent[0] ?? null;

  const getCircuitColor = (circuitType: string) => {
    switch (circuitType) {
      case "Threat":
        return "oklch(0.72 0.28 25)";
      case "Reward":
        return "oklch(0.78 0.26 55)";
      case "Memory":
        return "oklch(0.72 0.22 195)";
      case "Executive":
        return "oklch(0.75 0.24 260)";
      case "SelfAwareness":
        return "oklch(0.85 0.30 80)";
      case "Language":
        return "oklch(0.78 0.24 165)";
      case "Homeostatic":
        return "oklch(0.72 0.24 140)";
      default:
        return "oklch(0.65 0.18 220)";
    }
  };

  const getConfidenceBadgeStyle = (confidence: number) => {
    if (confidence >= 85)
      return { bg: "oklch(0.28 0.12 145)", text: "oklch(0.82 0.22 145)" };
    if (confidence >= 75)
      return { bg: "oklch(0.28 0.10 65)", text: "oklch(0.82 0.22 65)" };
    return { bg: "oklch(0.22 0.06 255)", text: "oklch(0.55 0.08 220)" };
  };

  return (
    <div
      data-ocid="thought_feed.panel"
      className="shrink-0 border-t flex flex-col"
      style={{
        borderColor: "oklch(0.22 0.06 255)",
        background: "oklch(0.055 0.012 265)",
        maxHeight: "280px",
        overflow: "hidden",
      }}
    >
      <div
        className="px-3 py-1.5 flex items-center gap-2 border-b shrink-0"
        style={{
          borderColor: "oklch(0.18 0.04 255)",
          background: "oklch(0.07 0.015 265)",
        }}
      >
        <span
          className="font-mono text-[9px] tracking-widest uppercase font-bold"
          style={{ color: "oklch(0.72 0.22 195)" }}
        >
          ◈ Neural Thought Stream
        </span>
        {isRunning && (
          <span
            style={{
              display: "inline-block",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "oklch(0.72 0.26 145)",
              boxShadow: "0 0 6px oklch(0.72 0.26 145)",
            }}
          />
        )}
        <span
          className="font-mono text-[8px] ml-auto"
          style={{ color: "oklch(0.35 0.05 220)" }}
        >
          {thoughtLog.length} thoughts
        </span>
      </div>

      {latest ? (
        <div
          className="px-3 py-2 shrink-0 cursor-pointer"
          onClick={() => setExpandedIdx(expandedIdx === -1 ? null : -1)}
          onKeyDown={(e) =>
            e.key === "Enter" && setExpandedIdx(expandedIdx === -1 ? null : -1)
          }
          style={{
            background: "oklch(0.09 0.025 255)",
            borderBottom: `1px solid ${getCircuitColor(latest.circuitType ?? "")}40`,
            borderLeft: `3px solid ${getCircuitColor(latest.circuitType ?? "")}`,
          }}
        >
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="font-mono text-[8px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded"
              style={{
                background: `${getCircuitColor(latest.circuitType ?? "")}22`,
                color: getCircuitColor(latest.circuitType ?? ""),
                border: `1px solid ${getCircuitColor(latest.circuitType ?? "")}55`,
              }}
            >
              {latest.circuitType ?? latest.dominantRegion.split("[")[0].trim()}
            </span>
            {latest.confidence > 0 &&
              (() => {
                const badge = getConfidenceBadgeStyle(latest.confidence);
                return (
                  <span
                    className="font-mono text-[8px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: badge.bg, color: badge.text }}
                  >
                    {latest.confidence}% conf
                  </span>
                );
              })()}
            {latest.behaviorCoupled && (
              <span
                className="font-mono text-[8px] px-1 py-0.5"
                style={{ color: "oklch(0.75 0.22 55)" }}
                title="Behavioral coupling detected"
              >
                ⚡ coupled
              </span>
            )}
            <span
              className="font-mono text-[7px] ml-auto shrink-0"
              style={{ color: "oklch(0.38 0.05 220)" }}
            >
              T{latest.tick} · {Math.round(latest.intensity * 100)}%
            </span>
          </div>
          <p
            className="font-mono text-[9px] leading-relaxed"
            style={{ color: "oklch(0.88 0.04 210)", wordBreak: "break-word" }}
          >
            {latest.thought}
          </p>
          {latest.neuralSources && latest.neuralSources.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {latest.neuralSources.slice(0, 3).map((src) => (
                <span
                  key={src.region as string}
                  className="font-mono text-[7px] px-1 rounded"
                  style={{
                    background: "oklch(0.12 0.03 260)",
                    color: "oklch(0.55 0.08 195)",
                  }}
                >
                  {(src.region as string).split("_")[0].slice(-14)}{" "}
                  {src.firingRate.toFixed(0)}Hz
                </span>
              ))}
            </div>
          )}
          <div
            className="mt-1.5 h-[2px] rounded"
            style={{ background: "oklch(0.14 0.03 260)" }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min(1, latest.intensity) * 100}%`,
                background: getCircuitColor(latest.circuitType ?? ""),
                transition: "width 0.4s ease",
                borderRadius: "2px",
              }}
            />
          </div>
          {expandedIdx === -1 && latest.provenance && (
            <p
              className="font-mono text-[7px] mt-1.5 leading-tight"
              style={{ color: "oklch(0.38 0.05 220)", wordBreak: "break-word" }}
            >
              {latest.provenance}
            </p>
          )}
        </div>
      ) : null}

      <div
        className="flex flex-col overflow-y-auto"
        style={{ maxHeight: "130px" }}
      >
        {recent.length === 0 ? (
          <div
            data-ocid="thought_feed.empty_state"
            className="px-3 py-3 font-mono text-[8px] italic text-center"
            style={{ color: "oklch(0.32 0.04 220)" }}
          >
            Awaiting neural co-activation threshold (75%)...
          </div>
        ) : (
          recent.map((entry, idx) => (
            <div
              key={`${entry.tick}-${idx}`}
              data-ocid={`thought_feed.item.${Math.min(idx + 1, 5)}`}
              className="px-3 py-1.5 flex flex-col gap-[2px] cursor-pointer"
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                setExpandedIdx(expandedIdx === idx ? null : idx)
              }
              style={{
                borderBottom: "1px solid oklch(0.1 0.02 260)",
                borderLeft:
                  idx === 0
                    ? `2px solid ${getCircuitColor(entry.circuitType ?? "")}`
                    : "2px solid oklch(0.16 0.03 250)",
                background: idx === 0 ? "oklch(0.08 0.02 255)" : "transparent",
                opacity: idx === 0 ? 1 : Math.max(0.4, 1 - idx * 0.12),
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-[7px] shrink-0"
                  style={{ color: "oklch(0.35 0.04 220)" }}
                >
                  T{entry.tick}
                </span>
                <span
                  className="font-mono text-[7px] tracking-wider uppercase truncate"
                  style={{ color: getCircuitColor(entry.circuitType ?? "") }}
                >
                  [
                  {(
                    entry.circuitType ??
                    entry.dominantRegion.split("[")[0].trim()
                  ).slice(0, 16)}
                  ]
                </span>
                {entry.confidence > 0 && (
                  <span
                    className="font-mono text-[6px] px-1 rounded shrink-0"
                    style={{
                      background:
                        entry.confidence >= 85
                          ? "oklch(0.22 0.08 145)"
                          : "oklch(0.22 0.05 65)",
                      color:
                        entry.confidence >= 85
                          ? "oklch(0.72 0.18 145)"
                          : "oklch(0.72 0.16 65)",
                    }}
                  >
                    {entry.confidence}%
                  </span>
                )}
                {entry.behaviorCoupled && (
                  <span
                    className="font-mono text-[6px]"
                    style={{ color: "oklch(0.65 0.20 55)" }}
                  >
                    ⚡
                  </span>
                )}
                <div
                  className="flex-1 h-[2px]"
                  style={{ background: "oklch(0.12 0.02 260)" }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(1, entry.intensity) * 100}%`,
                      background: getCircuitColor(entry.circuitType ?? ""),
                    }}
                  />
                </div>
              </div>
              <span
                className="font-mono text-[8px] italic leading-tight"
                style={{
                  color:
                    idx === 0 ? "oklch(0.82 0.16 195)" : "oklch(0.58 0.08 220)",
                }}
              >
                {entry.thought}
              </span>
              {expandedIdx === idx && entry.provenance && (
                <p
                  className="font-mono text-[7px] mt-1 leading-tight"
                  style={{
                    color: "oklch(0.42 0.06 220)",
                    wordBreak: "break-word",
                  }}
                >
                  {entry.provenance}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Brain Tab ────────────────────────────────────────────────────────────────

// ─── Criticality Monitor Panel ───────────────────────────────────────────────
function CriticalityPanel({ neural }: { neural: Neural }) {
  const cs = neural.criticalityState;
  if (!cs) return null;
  const regimeColor =
    cs.regime === "critical"
      ? "oklch(0.72 0.22 140)"
      : cs.regime === "sub-critical"
        ? "oklch(0.72 0.18 55)"
        : "oklch(0.68 0.28 25)";
  const sigmaRatio = Math.max(0, Math.min(1, (cs.branchingRatio - 0.5) / 1.0));
  const greenZone = cs.regime === "critical";
  return (
    <div
      className="shrink-0 px-3 py-2 border-t"
      style={{
        borderColor: "oklch(0.22 0.06 255)",
        background: "oklch(0.06 0.015 265)",
      }}
      data-ocid="criticality.panel"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="font-mono text-[8px] tracking-widest uppercase font-bold"
          style={{ color: "oklch(0.65 0.18 280)" }}
        >
          ⬡ Criticality Monitor
        </span>
        <span
          className="font-mono text-[7px] ml-auto px-1 rounded"
          style={{ color: regimeColor, background: "oklch(0.1 0.02 265)" }}
        >
          {cs.regime.toUpperCase()}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[7px] w-12 shrink-0"
            style={{ color: "oklch(0.42 0.06 220)" }}
          >
            σ (branch)
          </span>
          <div
            className="flex-1 h-[4px] rounded overflow-hidden"
            style={{ background: "oklch(0.12 0.03 260)" }}
          >
            <div
              style={{
                width: `${sigmaRatio * 100}%`,
                height: "100%",
                background: greenZone ? "oklch(0.72 0.22 140)" : regimeColor,
                borderRadius: "2px",
                transition: "width 0.8s ease",
              }}
            />
            {/* Green zone indicator 0.9-1.1 mapped to 40%-60% of bar */}
            <div style={{ position: "relative", height: 0 }}>
              <div
                style={{
                  position: "absolute",
                  left: "40%",
                  width: "20%",
                  height: "4px",
                  top: "-4px",
                  background: "oklch(0.72 0.22 140 / 0.25)",
                  borderRadius: "2px",
                }}
              />
            </div>
          </div>
          <span
            className="font-mono text-[8px] font-bold w-10 text-right"
            style={{ color: regimeColor }}
          >
            {cs.branchingRatio.toFixed(3)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
          <div className="flex justify-between">
            <span
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.38 0.05 220)" }}
            >
              Exc. Gain
            </span>
            <span
              className="font-mono text-[7px] font-bold"
              style={{ color: "oklch(0.72 0.22 140)" }}
            >
              {cs.excitabilityGain.toFixed(3)}
            </span>
          </div>
          <div className="flex justify-between">
            <span
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.38 0.05 220)" }}
            >
              Inh. Gain
            </span>
            <span
              className="font-mono text-[7px] font-bold"
              style={{ color: "oklch(0.72 0.18 55)" }}
            >
              {cs.inhibitoryGain.toFixed(3)}
            </span>
          </div>
          <div className="flex justify-between">
            <span
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.38 0.05 220)" }}
            >
              Power-law fit
            </span>
            <span
              className="font-mono text-[7px] font-bold"
              style={{ color: "oklch(0.65 0.18 195)" }}
            >
              {(cs.powerLawFit * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.38 0.05 220)" }}
            >
              Adj. events
            </span>
            <span
              className="font-mono text-[7px] font-bold"
              style={{ color: "oklch(0.52 0.12 280)" }}
            >
              {cs.adjustmentEvents}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Oscillatory State Panel ──────────────────────────────────────────────────
function OscillatoryPanel({ neural }: { neural: Neural }) {
  const os = neural.oscillatoryState;
  if (!os) return null;
  const bands = [
    {
      label: "Theta",
      value: os.memoryEncodeGate,
      color: "oklch(0.72 0.22 140)",
      desc: "4-8 Hz · Memory gate",
    },
    {
      label: "Gamma",
      value: os.localComputeGate,
      color: "oklch(0.72 0.26 280)",
      desc: "30-80 Hz · Local compute",
    },
    {
      label: "Alpha",
      value: os.suppressionGate,
      color: "oklch(0.72 0.18 55)",
      desc: "8-12 Hz · Suppression",
    },
    {
      label: "Beta",
      value: os.motorGate,
      color: "oklch(0.68 0.28 25)",
      desc: "13-30 Hz · Motor gate",
    },
  ];
  return (
    <div
      className="shrink-0 px-3 py-2 border-t"
      style={{
        borderColor: "oklch(0.22 0.06 255)",
        background: "oklch(0.06 0.015 265)",
      }}
      data-ocid="oscillatory.panel"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="font-mono text-[8px] tracking-widest uppercase font-bold"
          style={{ color: "oklch(0.65 0.18 280)" }}
        >
          ∿ Oscillatory State
        </span>
        <div className="flex items-center gap-1.5 ml-auto">
          <span
            className="font-mono text-[7px]"
            style={{
              color: os.encodingWindowOpen
                ? "oklch(0.72 0.22 140)"
                : "oklch(0.25 0.04 220)",
            }}
          >
            ● ENC
          </span>
          <span
            className="font-mono text-[7px]"
            style={{
              color: os.retrievalWindowOpen
                ? "oklch(0.60 0.22 220)"
                : "oklch(0.25 0.04 220)",
            }}
          >
            ● RET
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {bands.map(({ label, value, color, desc }) => (
          <div key={label} className="flex items-center gap-2" title={desc}>
            <span
              className="font-mono text-[7px] w-10 shrink-0"
              style={{ color: "oklch(0.42 0.06 220)" }}
            >
              {label}
            </span>
            <div
              className="flex-1 h-[3px] rounded overflow-hidden"
              style={{ background: "oklch(0.12 0.03 260)" }}
            >
              <div
                style={{
                  width: `${value * 100}%`,
                  height: "100%",
                  background: color,
                  borderRadius: "2px",
                  transition: "width 0.6s ease",
                }}
              />
            </div>
            <span
              className="font-mono text-[7px] w-8 text-right"
              style={{ color }}
            >
              {(value * 100).toFixed(0)}%
            </span>
          </div>
        ))}
        <div className="flex justify-between mt-0.5">
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.38 0.05 220)" }}
          >
            θ-γ Coupling
          </span>
          <span
            className="font-mono text-[7px] font-bold"
            style={{ color: "oklch(0.65 0.22 195)" }}
          >
            {(os.thetaGammaCoupling * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── 6-Channel Neuromodulator Panel ──────────────────────────────────────────

// ─── Neuromorphic Spike Monitor Panel (v34+) ─────────────────────────────────
function NeuromorphicPanel({ neural }: { neural: Neural }) {
  const ns = neural.neuromorphicState;
  if (!ns) return null;

  const GATEWAY = ["Thalamus", "Amygdala", "Hippocampus", "dACC", "LC-NE"];
  const vmColor = (vm: number) => {
    if (vm >= 0.85) return "oklch(0.72 0.28 25)"; // near-spike: red
    if (vm >= 0.6) return "oklch(0.80 0.26 55)"; // subthreshold high: amber
    return "oklch(0.60 0.22 220)"; // rest: blue
  };

  return (
    <div
      className="shrink-0 px-3 py-2 border-t"
      style={{
        borderColor: "oklch(0.22 0.06 255)",
        background: "oklch(0.055 0.012 265)",
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="font-mono text-[8px] tracking-widest uppercase font-bold"
          style={{ color: "oklch(0.68 0.22 175)" }}
        >
          ⚡ Neuromorphic Spike Monitor
        </span>
        <span
          className="font-mono text-[7px] ml-auto"
          style={{ color: "oklch(0.35 0.05 220)" }}
        >
          LIF Gateway • {ns.networkFiringRate.toFixed(1)} Hz net
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {GATEWAY.map((regionId) => {
          const rs = ns.regions.get(regionId);
          if (!rs) return null;
          const vm = Math.max(0, Math.min(1, rs.V_m));
          const adapt = Math.min(1, rs.adaptationCurrent);
          return (
            <div key={regionId} className="flex items-center gap-1.5">
              <span
                className="font-mono text-[7px] w-[62px] shrink-0 truncate"
                style={{ color: "oklch(0.45 0.08 220)" }}
              >
                {regionId}
              </span>
              {/* Vm bar */}
              <div
                className="flex-1 h-[3px] rounded"
                style={{ background: "oklch(0.12 0.03 260)" }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.round(vm * 100)}%`,
                    background: vmColor(vm),
                    borderRadius: "2px",
                    transition: "width 0.2s ease",
                  }}
                />
              </div>
              {/* Adaptation bar */}
              <div
                className="w-[20px] h-[3px] rounded"
                style={{ background: "oklch(0.12 0.03 260)" }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.round(adapt * 100)}%`,
                    background: "oklch(0.50 0.16 290)",
                    borderRadius: "2px",
                  }}
                />
              </div>
              <span
                className="font-mono text-[7px] w-[28px] text-right shrink-0"
                style={{ color: "oklch(0.55 0.12 175)" }}
              >
                {rs.firingRate.toFixed(0)}Hz
              </span>
              <span
                className="font-mono text-[7px] w-[22px] text-right shrink-0"
                style={{
                  color:
                    rs.gainModulation > 1.2
                      ? "oklch(0.75 0.22 55)"
                      : "oklch(0.38 0.06 220)",
                }}
              >
                ×{rs.gainModulation.toFixed(1)}
              </span>
              {rs.isBursting && (
                <span
                  className="font-mono text-[6px] px-1 rounded"
                  style={{
                    background: "oklch(0.25 0.12 25)",
                    color: "oklch(0.78 0.26 25)",
                  }}
                >
                  BURST
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div
        className="flex items-center gap-3 mt-1 pt-1 border-t"
        style={{ borderColor: "oklch(0.16 0.04 255)" }}
      >
        <span
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.35 0.05 220)" }}
        >
          spikes: {ns.totalSpikes}
        </span>
        <span
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.35 0.05 220)" }}
        >
          bursts: {ns.burstCount}
        </span>
        <span
          className="font-mono text-[7px] ml-auto"
          style={{ color: "oklch(0.50 0.16 290)" }}
        >
          E-cost: {(ns.energyCost * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

// ─── Global Workspace Theory Panel (v34+) ────────────────────────────────────
function GlobalWorkspacePanel({ neural }: { neural: Neural }) {
  const gw = neural.globalWorkspaceState;
  if (!gw) return null;

  const availability = gw.globalAvailability ?? 0;
  const coherence = gw.workspaceCoherence ?? 0;
  const isActive = gw.broadcastActive;

  return (
    <div
      className="shrink-0 px-3 py-2 border-t"
      style={{
        borderColor: "oklch(0.22 0.06 255)",
        background: "oklch(0.06 0.015 265)",
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="font-mono text-[8px] tracking-widest uppercase font-bold"
          style={{
            color: isActive ? "oklch(0.82 0.28 80)" : "oklch(0.55 0.16 260)",
          }}
        >
          ◎ Global Workspace
        </span>
        {isActive && (
          <span
            style={{
              display: "inline-block",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "oklch(0.82 0.28 80)",
              boxShadow: "0 0 8px oklch(0.82 0.28 80)",
            }}
          />
        )}
        <span
          className="font-mono text-[7px] ml-auto"
          style={{ color: "oklch(0.35 0.05 220)" }}
        >
          ignitions: {gw.ignitionEvents}
        </span>
      </div>
      {/* Broadcast status */}
      <div className="flex items-center gap-2 mb-1">
        <span
          className="font-mono text-[7px] w-[55px] shrink-0"
          style={{ color: "oklch(0.42 0.08 220)" }}
        >
          BROADCAST
        </span>
        <div
          className="flex-1 h-[3px] rounded"
          style={{ background: "oklch(0.12 0.03 260)" }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.round(availability * 100)}%`,
              background: isActive
                ? "oklch(0.82 0.28 80)"
                : "oklch(0.30 0.06 260)",
              borderRadius: "2px",
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <span
          className="font-mono text-[7px] w-[18px] text-right"
          style={{ color: "oklch(0.55 0.14 80)" }}
        >
          {isActive ? "ON" : "off"}
        </span>
      </div>
      {/* Coherence */}
      <div className="flex items-center gap-2 mb-1">
        <span
          className="font-mono text-[7px] w-[55px] shrink-0"
          style={{ color: "oklch(0.42 0.08 220)" }}
        >
          COHERENCE
        </span>
        <div
          className="flex-1 h-[3px] rounded"
          style={{ background: "oklch(0.12 0.03 260)" }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.round(coherence * 100)}%`,
              background: "oklch(0.68 0.22 195)",
              borderRadius: "2px",
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <span
          className="font-mono text-[7px] w-[22px] text-right"
          style={{ color: "oklch(0.68 0.22 195)" }}
        >
          {(coherence * 100).toFixed(0)}%
        </span>
      </div>
      {/* Coalition */}
      <div className="flex items-center gap-2">
        <span
          className="font-mono text-[7px] w-[55px] shrink-0"
          style={{ color: "oklch(0.42 0.08 220)" }}
        >
          COALITION
        </span>
        <span
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.55 0.14 80)" }}
        >
          {gw.meanCoalitionSize.toFixed(1)} regions
        </span>
        {gw.currentBroadcast && (
          <span
            className="font-mono text-[7px] ml-auto truncate max-w-[90px]"
            style={{ color: "oklch(0.60 0.18 220)" }}
          >
            {gw.currentBroadcast.dominantRegion}
          </span>
        )}
      </div>
      {gw.currentBroadcast && (
        <div className="mt-1">
          <span
            className="font-mono text-[6px] px-1.5 py-0.5 rounded"
            style={{
              background: "oklch(0.15 0.08 80)",
              color: "oklch(0.78 0.24 80)",
            }}
          >
            {gw.currentBroadcast.cognitiveMode}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Sensory Coupling Panel ──────────────────────────────────────────────────
function SensoryCouplingPanel() {
  const sensoryRelevance = 0.62;
  const uncertaintyBurden = 0.24;
  const degradationUnderLoad = 0.18;
  const salienceBoost =
    sensoryRelevance *
    (1 - uncertaintyBurden * 0.6) *
    (1 - degradationUnderLoad * 0.7);
  const wmGatePressure = uncertaintyBurden * 0.5 + degradationUnderLoad * 0.3;

  const fields: [string, string][] = [
    ["SENSORY RELEVANCE", sensoryRelevance.toFixed(2)],
    ["UNCERTAINTY BURDEN", uncertaintyBurden.toFixed(2)],
    ["DEGRADATION/LOAD", degradationUnderLoad.toFixed(2)],
    ["SALIENCE BOOST", salienceBoost.toFixed(3)],
    ["WM GATE PRESSURE", wmGatePressure.toFixed(3)],
  ];

  return (
    <div
      className="shrink-0 px-3 py-2 border-t"
      style={{
        borderColor: "oklch(0.22 0.06 255)",
        background: "oklch(0.055 0.012 265)",
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="font-mono text-[8px] tracking-widest uppercase font-bold"
          style={{ color: "oklch(0.68 0.18 200)" }}
        >
          ◈ Sensory Coupling
        </span>
        <span
          className="font-mono text-[7px] ml-auto"
          style={{ color: "oklch(0.35 0.05 220)" }}
        >
          salience ↔ WM gate
        </span>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {fields.map(([label, value]) => (
          <div
            key={label}
            className="rounded px-1 py-1 flex flex-col items-center"
            style={{ background: "oklch(0.09 0.02 265)" }}
          >
            <span
              className="font-mono text-[6px] uppercase tracking-widest text-center leading-tight mb-0.5"
              style={{ color: "oklch(0.38 0.06 220)" }}
            >
              {label}
            </span>
            <span
              className="font-mono text-[9px] font-bold"
              style={{ color: "oklch(0.72 0.18 200)" }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Cardiovascular-Nervous Axis Panel (v34+) ─────────────────────────────────
function CardioNervousPanel({ neural }: { neural: Neural }) {
  const cn = neural.cardioNervousState;
  if (!cn) return null;

  const hrColor =
    cn.heartRateBPM > 100
      ? "oklch(0.72 0.28 25)"
      : cn.heartRateBPM > 80
        ? "oklch(0.80 0.26 55)"
        : "oklch(0.72 0.22 145)";
  const vagalColor =
    cn.vagalToneIndex > 0.6
      ? "oklch(0.72 0.22 145)"
      : cn.vagalToneIndex > 0.3
        ? "oklch(0.80 0.26 55)"
        : "oklch(0.72 0.28 25)";
  const symBal = cn.amygdalaSympatheticDrive;
  const paraBal = cn.pfcHeartCoupling;

  return (
    <div
      className="shrink-0 px-3 py-2 border-t"
      style={{
        borderColor: "oklch(0.22 0.06 255)",
        background: "oklch(0.055 0.012 265)",
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="font-mono text-[8px] tracking-widest uppercase font-bold"
          style={{ color: "oklch(0.72 0.22 25)" }}
        >
          ♥ Cardiovascular-Nervous Axis
        </span>
        <span
          className="font-mono text-[8px] ml-auto font-bold"
          style={{ color: hrColor }}
        >
          {Math.round(cn.heartRateBPM)} BPM
        </span>
      </div>

      {/* HR bar */}
      <div className="flex items-center gap-2 mb-0.5">
        <span
          className="font-mono text-[7px] w-[55px] shrink-0"
          style={{ color: "oklch(0.42 0.08 220)" }}
        >
          HR
        </span>
        <div
          className="flex-1 h-[3px] rounded"
          style={{ background: "oklch(0.12 0.03 260)" }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.round(((cn.heartRateBPM - 45) / 85) * 100)}%`,
              background: hrColor,
              borderRadius: "2px",
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <span
          className="font-mono text-[7px] w-[30px] text-right"
          style={{ color: hrColor }}
        >
          {Math.round(cn.heartRateBPM)}bpm
        </span>
      </div>

      {/* HRV / RMSSD */}
      <div className="flex items-center gap-2 mb-0.5">
        <span
          className="font-mono text-[7px] w-[55px] shrink-0"
          style={{ color: "oklch(0.42 0.08 220)" }}
        >
          HRV/RMSSD
        </span>
        <div
          className="flex-1 h-[3px] rounded"
          style={{ background: "oklch(0.12 0.03 260)" }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.min(100, Math.round((cn.rmssd / 50) * 100))}%`,
              background: "oklch(0.68 0.22 175)",
              borderRadius: "2px",
              transition: "width 0.8s ease",
            }}
          />
        </div>
        <span
          className="font-mono text-[7px] w-[30px] text-right"
          style={{ color: "oklch(0.68 0.22 175)" }}
        >
          {cn.rmssd.toFixed(0)}ms
        </span>
      </div>

      {/* Vagal Tone */}
      <div className="flex items-center gap-2 mb-0.5">
        <span
          className="font-mono text-[7px] w-[55px] shrink-0"
          style={{ color: "oklch(0.42 0.08 220)" }}
        >
          VAGAL TONE
        </span>
        <div
          className="flex-1 h-[3px] rounded"
          style={{ background: "oklch(0.12 0.03 260)" }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.round(cn.vagalToneIndex * 100)}%`,
              background: vagalColor,
              borderRadius: "2px",
              transition: "width 0.8s ease",
            }}
          />
        </div>
        <span
          className="font-mono text-[7px] w-[30px] text-right"
          style={{ color: vagalColor }}
        >
          {(cn.vagalToneIndex * 100).toFixed(0)}%
        </span>
      </div>

      {/* Heart Coherence */}
      <div className="flex items-center gap-2 mb-0.5">
        <span
          className="font-mono text-[7px] w-[55px] shrink-0"
          style={{ color: "oklch(0.42 0.08 220)" }}
        >
          COHERENCE
        </span>
        <div
          className="flex-1 h-[3px] rounded"
          style={{ background: "oklch(0.12 0.03 260)" }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.round(cn.heartCoherence * 100)}%`,
              background: "oklch(0.72 0.22 145)",
              borderRadius: "2px",
              transition: "width 0.8s ease",
            }}
          />
        </div>
        <span
          className="font-mono text-[7px] w-[30px] text-right"
          style={{ color: "oklch(0.72 0.22 145)" }}
        >
          {(cn.heartCoherence * 100).toFixed(0)}%
        </span>
      </div>

      {/* RSA */}
      <div className="flex items-center gap-2 mb-0.5">
        <span
          className="font-mono text-[7px] w-[55px] shrink-0"
          style={{ color: "oklch(0.42 0.08 220)" }}
        >
          RSA AMP
        </span>
        <div
          className="flex-1 h-[3px] rounded"
          style={{ background: "oklch(0.12 0.03 260)" }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.min(100, Math.round((cn.rsaAmplitude / 15) * 100))}%`,
              background: "oklch(0.68 0.20 195)",
              borderRadius: "2px",
              transition: "width 0.8s ease",
            }}
          />
        </div>
        <span
          className="font-mono text-[7px] w-[30px] text-right"
          style={{ color: "oklch(0.68 0.20 195)" }}
        >
          ±{cn.rsaAmplitude.toFixed(1)}
        </span>
      </div>

      {/* Baroreflex */}
      <div className="flex items-center gap-2 mb-0.5">
        <span
          className="font-mono text-[7px] w-[55px] shrink-0"
          style={{ color: "oklch(0.42 0.08 220)" }}
        >
          BAROREFLEX
        </span>
        <div
          className="flex-1 h-[3px] rounded"
          style={{ background: "oklch(0.12 0.03 260)" }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.round(cn.baroreceptorFiring * 100)}%`,
              background: "oklch(0.60 0.18 260)",
              borderRadius: "2px",
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <span
          className="font-mono text-[7px] w-[30px] text-right"
          style={{ color: "oklch(0.60 0.18 260)" }}
        >
          {(cn.baroreceptorFiring * 100).toFixed(0)}%
        </span>
      </div>

      {/* Sympathetic/Parasympathetic balance */}
      <div
        className="mt-1 pt-1 border-t"
        style={{ borderColor: "oklch(0.16 0.04 255)" }}
      >
        <div className="flex items-center gap-1 mb-0.5">
          <span
            className="font-mono text-[6px] uppercase tracking-widest"
            style={{ color: "oklch(0.35 0.05 220)" }}
          >
            ANS BALANCE
          </span>
        </div>
        <div
          className="flex items-center gap-1 h-[5px] rounded overflow-hidden"
          style={{ background: "oklch(0.12 0.03 260)" }}
        >
          {/* Sympathetic (left, red) */}
          <div
            style={{
              height: "100%",
              width: `${Math.round(symBal * 50)}%`,
              background: "oklch(0.65 0.26 25)",
              transition: "width 0.5s ease",
            }}
          />
          {/* Center divider */}
          <div
            style={{
              width: "2px",
              height: "100%",
              background: "oklch(0.25 0.06 255)",
              flexShrink: 0,
            }}
          />
          {/* Parasympathetic (right, green) */}
          <div
            style={{
              height: "100%",
              width: `${Math.round(paraBal * 50)}%`,
              background: "oklch(0.65 0.22 145)",
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <div className="flex justify-between mt-0.5">
          <span
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.65 0.26 25)" }}
          >
            SYM {(cn.amygdalaSympatheticDrive * 100).toFixed(0)}%
          </span>
          <span
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.65 0.22 145)" }}
          >
            PNS {(cn.pfcHeartCoupling * 100).toFixed(0)}%
          </span>
        </div>
        {/* Brain-heart coupling labels */}
        <div className="flex justify-between mt-0.5">
          <span
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.35 0.05 220)" }}
          >
            Amy→SNS: {(cn.amygdalaSympatheticDrive * 100).toFixed(0)}%
          </span>
          <span
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.35 0.05 220)" }}
          >
            PFC→Vagal: {(cn.pfcHeartCoupling * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}

function NeuromodulatorPanel({ neural }: { neural: Neural }) {
  const nm = neural.neuromodulatorLevels;
  const pg = neural.plasticityGates;
  if (!nm || !pg) return null;
  const channels = [
    {
      label: "DA",
      value: nm.dopamine,
      color: "oklch(0.68 0.28 55)",
      desc: "Dopamine · Reward/motivation",
    },
    {
      label: "NE",
      value: nm.norepinephrine,
      color: "oklch(0.68 0.28 25)",
      desc: "Norepinephrine · Arousal/alertness",
    },
    {
      label: "5HT",
      value: nm.serotonin,
      color: "oklch(0.72 0.22 140)",
      desc: "Serotonin · Patience/recovery",
    },
    {
      label: "ACh",
      value: nm.acetylcholine,
      color: "oklch(0.72 0.26 195)",
      desc: "Acetylcholine · Encoding mode",
    },
    {
      label: "GABA",
      value: nm.gaba,
      color: "oklch(0.52 0.12 280)",
      desc: "GABA · Inhibitory stability",
    },
    {
      label: "Glu",
      value: nm.glutamate,
      color: "oklch(0.60 0.18 310)",
      desc: "Glutamate · Excitatory drive",
    },
  ];
  const modeColor: Record<string, string> = {
    encoding: "oklch(0.72 0.22 140)",
    retrieval: "oklch(0.60 0.22 220)",
    consolidation: "oklch(0.52 0.12 280)",
    exploratory: "oklch(0.72 0.26 195)",
    stressed: "oklch(0.68 0.28 25)",
  };
  return (
    <div
      className="shrink-0 px-3 py-2 border-t"
      style={{
        borderColor: "oklch(0.22 0.06 255)",
        background: "oklch(0.06 0.015 265)",
      }}
      data-ocid="neuromodulator.panel"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="font-mono text-[8px] tracking-widest uppercase font-bold"
          style={{ color: "oklch(0.65 0.18 280)" }}
        >
          ⬡ Neuromodulators
        </span>
        <span
          className="font-mono text-[7px] ml-auto px-1 rounded"
          style={{
            color: modeColor[pg.mode] ?? "oklch(0.5 0.1 220)",
            background: "oklch(0.1 0.02 265)",
          }}
        >
          {pg.mode.toUpperCase()}
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        {channels.map(({ label, value, color, desc }) => {
          const isDominant = pg.dominantModulator === label;
          return (
            <div key={label} className="flex items-center gap-2" title={desc}>
              <span
                className="font-mono text-[7px] w-8 shrink-0"
                style={{
                  color: isDominant ? color : "oklch(0.42 0.06 220)",
                  fontWeight: isDominant ? "bold" : "normal",
                }}
              >
                {label}
              </span>
              <div
                className="flex-1 h-[3px] rounded overflow-hidden"
                style={{ background: "oklch(0.12 0.03 260)" }}
              >
                <div
                  style={{
                    width: `${value * 100}%`,
                    height: "100%",
                    background: isDominant ? color : `${color}99`,
                    borderRadius: "2px",
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
              <span
                className="font-mono text-[7px] w-8 text-right"
                style={{ color: isDominant ? color : "oklch(0.40 0.05 220)" }}
              >
                {(value * 100).toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
      {pg.plasticityBlocked && (
        <div
          className="mt-1 font-mono text-[7px] text-center"
          style={{ color: "oklch(0.52 0.12 280)" }}
        >
          ⬡ GABA GATE: plasticity suppressed
        </div>
      )}
    </div>
  );
}

// ─── Predictive Coding Panel ──────────────────────────────────────────────────
function PredictiveCodingPanel({ neural }: { neural: Neural }) {
  const pc = neural.predictiveCoding;
  if (!pc) return null;
  const gradient =
    neural.tick > 0 && pc.globalFreeEnergy < 2 ? "↓ improving" : "↑ worsening";
  const gradientColor = gradient.startsWith("↓")
    ? "oklch(0.72 0.22 140)"
    : "oklch(0.68 0.28 25)";
  return (
    <div
      className="shrink-0 px-3 py-2 border-t"
      style={{
        borderColor: "oklch(0.22 0.06 255)",
        background: "oklch(0.06 0.015 265)",
      }}
      data-ocid="predictive.panel"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="font-mono text-[8px] tracking-widest uppercase font-bold"
          style={{ color: "oklch(0.65 0.18 280)" }}
        >
          ∿ Predictive Coding
        </span>
        <span
          className="font-mono text-[7px] ml-auto font-bold"
          style={{ color: gradientColor }}
        >
          {gradient}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
        <div className="flex justify-between">
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.38 0.05 220)" }}
          >
            Free Energy
          </span>
          <span
            className="font-mono text-[7px] font-bold"
            style={{ color: "oklch(0.60 0.22 220)" }}
          >
            {pc.globalFreeEnergy.toFixed(3)}
          </span>
        </div>
        <div className="flex justify-between">
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.38 0.05 220)" }}
          >
            Mismatch
          </span>
          <span
            className="font-mono text-[7px] font-bold"
            style={{
              color:
                pc.globalMismatch > 0.3
                  ? "oklch(0.68 0.28 25)"
                  : "oklch(0.72 0.22 140)",
            }}
          >
            {(pc.globalMismatch * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.38 0.05 220)" }}
          >
            Surprise
          </span>
          <span
            className="font-mono text-[7px] font-bold"
            style={{
              color:
                pc.surpriseScore > 0.5
                  ? "oklch(0.68 0.28 25)"
                  : "oklch(0.60 0.22 220)",
            }}
          >
            {(pc.surpriseScore * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.38 0.05 220)" }}
          >
            Learn Relev.
          </span>
          <span
            className="font-mono text-[7px] font-bold"
            style={{ color: "oklch(0.65 0.18 195)" }}
          >
            {(pc.learningRelevance * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Hemisphere Balance Panel ─────────────────────────────────────────────────
function HemisphereBalancePanel({ neural }: { neural: Neural }) {
  const data = useMemo(() => {
    const s = neural.sympatheticTone;
    const isR = neural.isRunning;
    const leftActivity = Math.min(1, 0.55 + (1 - s) * 0.3 + (isR ? 0.08 : 0));
    const rightActivity = Math.min(1, 0.5 + s * 0.32 + (isR ? 0.06 : 0));
    const callosaRate = Math.min(
      1,
      ((leftActivity + rightActivity) / 2) * 0.92,
    );
    const coherence = Math.min(
      1,
      1 - Math.abs(leftActivity - rightActivity) * 1.4,
    );
    const asymmetry = Math.abs(leftActivity - rightActivity);
    const dominant = leftActivity > rightActivity ? "LEFT" : "RIGHT";
    const topPaths = [
      { label: "M1-L ↔ M1-R", strength: Math.min(1, 0.88 + s * 0.06) },
      {
        label: "mPFC-L ↔ mPFC-R",
        strength: Math.min(1, 0.86 + (isR ? 0.08 : 0)),
      },
      { label: "THAL-L ↔ THAL-R", strength: Math.min(1, 0.85 + s * 0.04) },
    ];
    return {
      leftActivity,
      rightActivity,
      callosaRate,
      coherence,
      asymmetry,
      dominant,
      topPaths,
    };
  }, [neural.sympatheticTone, neural.isRunning]);

  const GOLD = "oklch(0.78 0.22 80)";
  const GREEN = "oklch(0.68 0.28 140)";
  const BLUE = "#3b82f6";
  const ORANGE = "#f97316";
  const MUTED2 = "oklch(0.38 0.05 220)";
  const DIM2 = "oklch(0.28 0.04 240)";
  const BORDER2 = "oklch(0.18 0.05 255)";

  return (
    <div
      className="shrink-0 px-3 py-2 border-t"
      style={{ borderColor: BORDER2, background: "oklch(0.065 0.015 265)" }}
      data-ocid="hemisphere.panel"
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="font-mono text-[8px] tracking-widest uppercase font-bold"
          style={{ color: "oklch(0.65 0.22 195)" }}
        >
          ⬡ Hemisphere Balance
        </span>
        <span
          className="font-mono text-[7px] px-1.5 py-0.5 rounded ml-auto"
          style={{
            background:
              data.dominant === "LEFT"
                ? "rgba(60,100,255,0.2)"
                : "rgba(255,120,50,0.2)",
            color: data.dominant === "LEFT" ? BLUE : ORANGE,
            border: `1px solid ${data.dominant === "LEFT" ? "rgba(60,100,255,0.4)" : "rgba(255,120,50,0.4)"}`,
          }}
        >
          {data.dominant} DOM
        </span>
      </div>

      {/* Dual hemisphere activity bars */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <div className="flex justify-between mb-0.5">
            <span
              className="font-mono text-[7px]"
              style={{ color: "rgba(80,140,255,0.8)" }}
            >
              ◀ Left
            </span>
            <span
              className="font-mono text-[7px] font-bold"
              style={{ color: BLUE }}
            >
              {(data.leftActivity * 100).toFixed(0)}%
            </span>
          </div>
          <div
            style={{
              height: 5,
              background: "oklch(0.14 0.03 260)",
              borderRadius: 2,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${data.leftActivity * 100}%`,
                background: BLUE,
                borderRadius: 2,
                transition: "width 0.8s ease",
              }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-0.5">
            <span
              className="font-mono text-[7px]"
              style={{ color: "rgba(255,140,60,0.8)" }}
            >
              Right ▶
            </span>
            <span
              className="font-mono text-[7px] font-bold"
              style={{ color: ORANGE }}
            >
              {(data.rightActivity * 100).toFixed(0)}%
            </span>
          </div>
          <div
            style={{
              height: 5,
              background: "oklch(0.14 0.03 260)",
              borderRadius: 2,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${data.rightActivity * 100}%`,
                background: ORANGE,
                borderRadius: 2,
                transition: "width 0.8s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* Callosum + coherence */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <div className="flex justify-between mb-0.5">
            <span className="font-mono text-[7px]" style={{ color: MUTED2 }}>
              Callosum Xfer
            </span>
            <span
              className="font-mono text-[7px] font-bold"
              style={{ color: GOLD }}
            >
              {(data.callosaRate * 100).toFixed(0)}%
            </span>
          </div>
          <div
            style={{
              height: 4,
              background: "oklch(0.14 0.03 260)",
              borderRadius: 2,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${data.callosaRate * 100}%`,
                background: GOLD,
                borderRadius: 2,
                transition: "width 0.8s ease",
              }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-0.5">
            <span className="font-mono text-[7px]" style={{ color: MUTED2 }}>
              Inter-Hem. Coh.
            </span>
            <span
              className="font-mono text-[7px] font-bold"
              style={{ color: GREEN }}
            >
              {(data.coherence * 100).toFixed(0)}%
            </span>
          </div>
          <div
            style={{
              height: 4,
              background: "oklch(0.14 0.03 260)",
              borderRadius: 2,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${data.coherence * 100}%`,
                background: GREEN,
                borderRadius: 2,
                transition: "width 0.8s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* Asymmetry index */}
      <div className="mb-2">
        <div className="flex justify-between mb-0.5">
          <span className="font-mono text-[7px]" style={{ color: MUTED2 }}>
            Asymmetry Index
          </span>
          <span
            className="font-mono text-[7px]"
            style={{
              color: data.asymmetry > 0.25 ? "oklch(0.78 0.22 80)" : GREEN,
            }}
          >
            {data.asymmetry.toFixed(3)} {data.asymmetry > 0.25 ? "⚠" : "✓"}
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
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              width: 1,
              height: "100%",
              background: "rgba(255,255,255,0.18)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: `${50 - data.leftActivity * 46}%`,
              width: `${data.leftActivity * 46}%`,
              height: "100%",
              background: "rgba(60,100,255,0.55)",
              borderRadius: "3px 0 0 3px",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              width: `${data.rightActivity * 46}%`,
              height: "100%",
              background: "rgba(255,120,50,0.55)",
              borderRadius: "0 3px 3px 0",
            }}
          />
        </div>
        <div className="flex justify-between mt-0.5">
          <span
            className="font-mono text-[6px]"
            style={{ color: "rgba(80,140,255,0.5)" }}
          >
            L
          </span>
          <span
            className="font-mono text-[6px]"
            style={{ color: "rgba(255,140,60,0.5)" }}
          >
            R
          </span>
        </div>
      </div>

      {/* Top inter-hemisphere pathways */}
      <div>
        <div
          className="font-mono text-[7px] tracking-widest uppercase mb-1"
          style={{ color: DIM2 }}
        >
          Top Cross-Hemisphere Pathways
        </div>
        {data.topPaths.map((p, i) => (
          <div
            key={p.label}
            className="flex items-center gap-1.5 mb-0.5"
            data-ocid={`hemisphere.item.${i + 1}`}
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: GOLD,
                flexShrink: 0,
              }}
            />
            <span
              className="font-mono text-[7px] flex-1"
              style={{ color: "oklch(0.58 0.1 200)" }}
            >
              {p.label}
            </span>
            <div
              style={{
                width: 48,
                height: 3,
                background: "oklch(0.14 0.03 260)",
                borderRadius: 2,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${p.strength * 100}%`,
                  background: GOLD,
                  borderRadius: 2,
                }}
              />
            </div>
            <span
              className="font-mono text-[6px]"
              style={{ color: GOLD, minWidth: 22 }}
            >
              {(p.strength * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BrainTab({ neural }: { neural: Neural }) {
  const { data: canon } = useCanonicalState();
  const { data: neuro } = useNeuroscienceState();
  const { data: fearM } = useFearMissionState();

  // Seed neural simulation with real organism signals on every backend update
  useEffect(() => {
    if (!canon) return;
    neural.seedFromBackend?.({
      coherence: canon.coh,
      arousal: canon.ar,
      identityI: canon.ic,
      fearLevel: fearM?.fearLevel,
      vagalTone: neuro?.vagalTone,
      consciousnessIndex: neuro?.consciousnessIndex,
      kuramotoR: fearM?.kuramotoR,
      missionLockActive: fearM?.missionLockActive,
      surrenderFloor: fearM?.surrenderFloor,
      courageScore: fearM?.courageScore,
      groundedScore: fearM?.groundedScore,
    });
  }, [canon, fearM, neuro, neural]);

  const regionActivities = neural.regionActivity.map(([region, activity]) => ({
    region,
    activity,
  }));
  const latestThoughtEntry = neural.thoughtLog[0] ?? null;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Real Organism Signal Feed */}
      {canon && (
        <div
          className="shrink-0 flex items-center gap-4 px-3 py-1 border-b font-mono text-[9px] tracking-[0.12em]"
          style={{
            background: "oklch(0.07 0.015 265)",
            borderColor: "oklch(0.18 0.05 255)",
          }}
        >
          <span style={{ color: "oklch(0.38 0.05 220)" }}>ORGANISM LIVE</span>
          <span style={{ color: "oklch(0.38 0.05 220)" }}>COH</span>
          <span
            style={{
              color:
                canon.coh > 0.7
                  ? "oklch(0.68 0.28 140)"
                  : canon.coh > 0.4
                    ? "oklch(0.78 0.22 80)"
                    : "oklch(0.65 0.25 25)",
            }}
          >
            {canon.coh.toFixed(3)}
          </span>
          <span style={{ color: "oklch(0.38 0.05 220)" }}>FEAR</span>
          <span
            style={{
              color:
                (fearM?.fearLevel ?? 0) > 0.5
                  ? "oklch(0.65 0.25 25)"
                  : "oklch(0.68 0.28 140)",
            }}
          >
            {(fearM?.fearLevel ?? 0).toFixed(3)}
          </span>
          <span style={{ color: "oklch(0.38 0.05 220)" }}>KHz</span>
          <span style={{ color: "oklch(0.72 0.22 195)" }}>
            {canon.kf.toFixed(3)}
          </span>
          <span style={{ color: "oklch(0.38 0.05 220)" }}>ψ-IDX</span>
          <span style={{ color: "oklch(0.72 0.22 195)" }}>
            {(neuro?.consciousnessIndex ?? 0).toFixed(3)}
          </span>
          <span style={{ color: "oklch(0.38 0.05 220)" }}>BEAT</span>
          <span style={{ color: "oklch(0.85 0.06 210)" }}>
            {String(Number(canon.b)).padStart(8, "0")}
          </span>
        </div>
      )}
      {/* Saturation Warning */}
      {neural.saturatedRegions.length > 0 && (
        <div
          className="shrink-0 px-3 py-2 flex items-start gap-2"
          style={{
            background: "oklch(0.18 0.08 30)",
            borderBottom: "1px solid oklch(0.35 0.12 30)",
          }}
        >
          <span
            className="font-mono text-[9px]"
            style={{ color: "oklch(0.85 0.18 30)" }}
          >
            ⚠ SATURATION DETECTED
          </span>
          <span
            className="font-mono text-[8px] leading-relaxed"
            style={{ color: "oklch(0.72 0.1 30)" }}
          >
            {neural.saturatedRegions.slice(0, 5).join(", ")}
            {neural.saturatedRegions.length > 5
              ? ` +${neural.saturatedRegions.length - 5} more`
              : ""}{" "}
            averaging &gt;90% activation.
          </span>
        </div>
      )}
      {/* Loop Closure Indicator */}
      {latestThoughtEntry?.behaviorCoupled && (
        <div
          className="shrink-0 px-3 py-1 flex items-center gap-2"
          style={{
            background: "oklch(0.12 0.05 145 / 0.6)",
            borderBottom: "1px solid oklch(0.45 0.18 145 / 0.3)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "oklch(0.72 0.26 145)",
              boxShadow: "0 0 6px oklch(0.72 0.26 145)",
            }}
          />
          <span
            className="font-mono text-[8px] tracking-widest"
            style={{ color: "oklch(0.72 0.22 145)" }}
          >
            LOOP CLOSED · PERCEPTION → STATE → ACTION → LEARNING ACTIVE
          </span>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Brain Visualization — 60% */}
        <section
          className="flex flex-col border-r"
          style={{
            flex: "0 0 60%",
            overflow: "hidden",
            borderColor: "oklch(0.18 0.05 255)",
          }}
        >
          <div
            className="px-3 py-1.5 shrink-0 border-b flex items-center justify-between"
            style={{
              borderColor: "oklch(0.18 0.04 255)",
              background: "oklch(0.07 0.012 265)",
            }}
          >
            <span
              className="font-mono text-[9px] tracking-widest uppercase"
              style={{ color: "oklch(0.38 0.06 220)" }}
            >
              Neural Connectome · 3D · Live Weights
            </span>
            <span
              className="font-mono text-[8px]"
              style={{ color: "oklch(0.5 0.1 195)" }}
            >
              DTI-Calibrated · STDP Active
            </span>
          </div>
          <div
            className="flex-1 relative"
            data-ocid="brain.canvas_target"
            style={{ background: "oklch(0.055 0.01 265)" }}
          >
            <BrainVisualization
              regionActivities={regionActivities}
              stdpWeights={neural.stdpWeightSummary}
            />
            {/* Weight legend */}
            <div
              className="absolute top-2 right-2 flex flex-col gap-1 pointer-events-none"
              style={{
                background: "oklch(0.08 0.015 260 / 0.88)",
                border: "1px solid oklch(0.18 0.05 255)",
                padding: "4px 6px",
              }}
            >
              <div
                className="font-mono text-[7px] tracking-widest uppercase mb-1"
                style={{ color: "oklch(0.35 0.05 220)" }}
              >
                Activity + Weight
              </div>
              {[
                { label: "INACTIVE", hsl: "hsl(232, 50%, 20%)" },
                { label: "LOW", hsl: "hsl(200, 60%, 35%)" },
                { label: "MEDIUM", hsl: "hsl(185, 75%, 50%)" },
                { label: "HIGH", hsl: "hsl(50, 85%, 60%)" },
                { label: "PEAK", hsl: "hsl(15, 90%, 55%)" },
              ].map(({ label, hsl }) => (
                <div key={label} className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: hsl }}
                  />
                  <span
                    className="font-mono text-[7px]"
                    style={{ color: "oklch(0.38 0.05 220)" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
              <div
                className="mt-1 pt-1 border-t"
                style={{ borderColor: "oklch(0.2 0.04 255)" }}
              >
                <div
                  className="font-mono text-[7px] mb-0.5"
                  style={{ color: "oklch(0.35 0.05 220)" }}
                >
                  Conn Weight
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="h-1 w-10 rounded"
                    style={{
                      background:
                        "linear-gradient(to right, hsl(220,70%,40%), hsl(15,80%,55%))",
                    }}
                  />
                  <span
                    className="font-mono text-[6px]"
                    style={{ color: "oklch(0.38 0.05 220)" }}
                  >
                    lo→hi
                  </span>
                </div>
              </div>
              {/* Eligibility trace indicator */}
              <div
                className="mt-1 pt-1 border-t"
                style={{ borderColor: "oklch(0.2 0.04 255)" }}
              >
                <div
                  className="font-mono text-[7px]"
                  style={{ color: "oklch(0.82 0.22 80)" }}
                >
                  ⚡ = active trace
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Panel — 40% */}
        <section
          className="flex flex-col"
          style={{ flex: 1, overflow: "hidden" }}
        >
          <div
            className="px-3 py-1.5 shrink-0 border-b"
            style={{
              borderColor: "oklch(0.18 0.04 255)",
              background: "oklch(0.07 0.012 265)",
            }}
          >
            <span
              className="font-mono text-[9px] tracking-widest uppercase"
              style={{ color: "oklch(0.38 0.06 220)" }}
            >
              Neural Stats · Matrix · Live Readouts
            </span>
          </div>
          {/* ── Hemisphere Balance Panel ─────────────────────────────── */}
          <HemisphereBalancePanel neural={neural} />
          <div className="flex-1 overflow-hidden min-h-0">
            <StatsPanel neural={neural} />
          </div>
          <LiveThoughtFeed
            thoughtLog={neural.thoughtLog}
            isRunning={neural.isRunning}
          />
          <ANSPanel ansState={neural.ansState} events={neural.eventLog} />
          {neural.selfStateModel && (
            <CognitiveDashboard
              selfState={neural.selfStateModel}
              goalHierarchy={neural.goalHierarchy}
              predictionState={neural.predictionState}
              failureMemory={neural.failureMemory}
            />
          )}
          {/* ── Criticality Monitor ─────────────────────────────────────── */}
          <CriticalityPanel neural={neural} />
          {/* ── Oscillatory State Panel ─────────────────────────────────── */}
          <OscillatoryPanel neural={neural} />
          {/* ── 6-Channel Neuromodulator Levels ─────────────────────────── */}
          <NeuromodulatorPanel neural={neural} />
          {/* ── Predictive Coding Panel ──────────────────────────────────── */}
          <PredictiveCodingPanel neural={neural} />
          {/* ── Neuromorphic Spike Monitor (v34+) ────────────────────────── */}
          <NeuromorphicPanel neural={neural} />
          {/* ── Global Workspace Theory Panel (v34+) ────────────────────── */}
          <GlobalWorkspacePanel neural={neural} />
          {/* ── Cardiovascular-Nervous Axis Panel (v34+) ─────────────────── */}
          <CardioNervousPanel neural={neural} />
          {/* ── Sensory Coupling Panel ──────────────────────────────────────── */}
          <SensoryCouplingPanel />
          {/* ── Neural Circuit Motifs Panel (v36+) ───────────────────────── */}
          <CircuitMotifsPanel state={neural.circuitMotifState} />
          {/* Metacognitive Monitor */}
          <div
            className="shrink-0 px-3 py-2 border-t"
            style={{
              borderColor: "oklch(0.22 0.06 255)",
              background: "oklch(0.06 0.015 265)",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="font-mono text-[8px] tracking-widest uppercase font-bold"
                style={{ color: "oklch(0.65 0.18 280)" }}
              >
                ⬡ Metacognitive Monitor
              </span>
              <span
                className="font-mono text-[7px] ml-auto"
                style={{ color: "oklch(0.35 0.05 220)" }}
              >
                Anterior PFC + Precuneus
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="flex-1 h-[3px] rounded"
                style={{ background: "oklch(0.14 0.03 260)" }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.round((neural.metacognitiveConfidence ?? 0) * 100)}%`,
                    background: "oklch(0.68 0.22 280)",
                    borderRadius: "2px",
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
              <span
                className="font-mono text-[8px] shrink-0"
                style={{ color: "oklch(0.68 0.22 280)" }}
              >
                {Math.round((neural.metacognitiveConfidence ?? 0) * 100)}%
              </span>
            </div>
            <p
              className="font-mono text-[7px] mt-0.5"
              style={{ color: "oklch(0.32 0.05 220)" }}
            >
              Read-only observer circuit · cannot alter firing (Frith 2002)
            </p>
            {/* Neuromorphic Sparse Computation Metrics (v32+) */}
            <div
              className="mt-2 pt-2 border-t"
              style={{ borderColor: "oklch(0.18 0.04 255)" }}
            >
              <span
                className="font-mono text-[8px] tracking-widest uppercase font-bold block mb-1"
                style={{ color: "oklch(0.55 0.18 175)" }}
              >
                ⚡ Sparse Compute
              </span>
              {/* SPARSE EFF row */}
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="font-mono text-[7px] w-[62px] shrink-0"
                  style={{ color: "oklch(0.42 0.08 220)" }}
                >
                  SPARSE EFF
                </span>
                <div
                  className="flex-1 h-[3px] rounded"
                  style={{ background: "oklch(0.14 0.03 260)" }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.round((neural.sparseComputeEfficiency ?? 0) * 100)}%`,
                      background: "oklch(0.65 0.22 175)",
                      borderRadius: "2px",
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
                <span
                  className="font-mono text-[7px] w-[28px] text-right shrink-0"
                  style={{ color: "oklch(0.65 0.22 175)" }}
                >
                  {Math.round((neural.sparseComputeEfficiency ?? 0) * 100)}%
                </span>
              </div>
              {/* ACTIVE REG row */}
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-[7px] w-[62px] shrink-0"
                  style={{ color: "oklch(0.42 0.08 220)" }}
                >
                  ACTIVE REG
                </span>
                <div
                  className="flex-1 h-[3px] rounded"
                  style={{ background: "oklch(0.14 0.03 260)" }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.round((neural.activeRegionFraction ?? 0) * 100)}%`,
                      background: "oklch(0.60 0.20 140)",
                      borderRadius: "2px",
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
                <span
                  className="font-mono text-[7px] w-[28px] text-right shrink-0"
                  style={{ color: "oklch(0.60 0.20 140)" }}
                >
                  {Math.round((neural.activeRegionFraction ?? 0) * 246)}/246
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Cognitive Governance Panel (v35+) ─────────────────────────── */}
        <section
          className="rounded border"
          style={{
            borderColor: "oklch(0.20 0.05 255)",
            background: "oklch(0.09 0.02 255)",
          }}
          data-ocid="brain.governance.panel"
        >
          <div
            className="px-3 py-2 border-b"
            style={{ borderColor: "oklch(0.18 0.04 255)" }}
          >
            <span
              className="font-mono text-[9px] tracking-widest uppercase font-bold"
              style={{ color: "oklch(0.72 0.22 195)" }}
            >
              🧠 Cognitive Governance
            </span>
            <span
              className="font-mono text-[7px] ml-2"
              style={{ color: "oklch(0.38 0.07 220)" }}
            >
              6 permanent principles · emergence-preserving control spine
            </span>
          </div>
          <div className="p-3 grid grid-cols-1 gap-3">
            {(() => {
              const gm = neural.governanceMetrics;
              if (!gm) return null;
              const pv = gm.softPriorVector;
              const priorKeys = [
                "navigation",
                "threat",
                "memory",
                "regulation",
                "social",
                "exploration",
              ] as const;
              const priorColors: Record<string, string> = {
                navigation: "oklch(0.65 0.22 240)",
                threat: "oklch(0.62 0.25 20)",
                memory: "oklch(0.68 0.20 280)",
                regulation: "oklch(0.65 0.22 175)",
                social: "oklch(0.70 0.18 130)",
                exploration: "oklch(0.68 0.22 70)",
              };
              const inf = gm.influenceFactors;
              const infLabels: Array<[keyof typeof inf, string]> = [
                ["P_m", "PRIOR"],
                ["Q_m", "PREC"],
                ["S_m", "SAL"],
                ["C_m", "CONF"],
                ["G_m", "GOAL"],
                ["R_m", "REG"],
                ["E_m", "EFF"],
              ];
              const hc = gm.homeostaticCorrection;
              const hcColor =
                hc.magnitude < 0.1
                  ? "oklch(0.62 0.22 145)"
                  : hc.magnitude < 0.4
                    ? "oklch(0.72 0.22 70)"
                    : "oklch(0.65 0.22 20)";
              const tierColors: Record<string, string> = {
                SHORT: "oklch(0.55 0.10 220)",
                MEDIUM: "oklch(0.62 0.18 280)",
                HIGH: "oklch(0.70 0.22 70)",
                SPECIAL: "oklch(0.65 0.25 20)",
              };
              return (
                <>
                  {/* Row 1: Soft Prior Bar Chart + Influence Law */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Soft Prior Vector */}
                    <div>
                      <span
                        className="font-mono text-[8px] tracking-widest uppercase font-bold block mb-1"
                        style={{ color: "oklch(0.55 0.12 240)" }}
                      >
                        1 · Soft Priors
                      </span>
                      <div className="space-y-0.5">
                        {priorKeys.map((key) => {
                          const val = pv[key] ?? 0;
                          const isActive = gm.softPriorActive === key;
                          return (
                            <div
                              key={key}
                              className="flex items-center gap-1.5"
                            >
                              <span
                                className="font-mono text-[7px] w-[58px] shrink-0 uppercase"
                                style={{
                                  color: isActive
                                    ? priorColors[key]
                                    : "oklch(0.38 0.07 220)",
                                }}
                              >
                                {isActive ? "▶ " : "  "}
                                {key.slice(0, 6)}
                              </span>
                              <div
                                className="flex-1 h-[4px] rounded"
                                style={{ background: "oklch(0.14 0.03 260)" }}
                              >
                                <div
                                  style={{
                                    height: "100%",
                                    width: `${Math.round(val * 100)}%`,
                                    background: isActive
                                      ? priorColors[key]
                                      : "oklch(0.30 0.08 240)",
                                    borderRadius: "2px",
                                    transition: "width 0.6s ease",
                                  }}
                                />
                              </div>
                              <span
                                className="font-mono text-[7px] w-[24px] text-right shrink-0"
                                style={{
                                  color: isActive
                                    ? priorColors[key]
                                    : "oklch(0.38 0.07 220)",
                                }}
                              >
                                {Math.round(val * 100)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Influence Law I_m */}
                    <div>
                      <span
                        className="font-mono text-[8px] tracking-widest uppercase font-bold block mb-1"
                        style={{ color: "oklch(0.55 0.12 195)" }}
                      >
                        2 · Influence Law I_m
                      </span>
                      <div
                        className="font-mono text-[7px] mb-1.5 px-1.5 py-1 rounded"
                        style={{
                          background: "oklch(0.12 0.03 255)",
                          color: "oklch(0.45 0.08 220)",
                        }}
                      >
                        P×Q×S×C×G×R×E = {gm.influenceTop.toFixed(3)}
                      </div>
                      <div className="space-y-0.5">
                        {infLabels.map(([key, label]) => {
                          const val = inf[key] ?? 0;
                          return (
                            <div
                              key={key}
                              className="flex items-center gap-1.5"
                            >
                              <span
                                className="font-mono text-[7px] w-[28px] shrink-0"
                                style={{ color: "oklch(0.42 0.08 220)" }}
                              >
                                {label}
                              </span>
                              <div
                                className="flex-1 h-[3px] rounded"
                                style={{ background: "oklch(0.14 0.03 260)" }}
                              >
                                <div
                                  style={{
                                    height: "100%",
                                    width: `${Math.round(val * 100)}%`,
                                    background: "oklch(0.62 0.20 195)",
                                    borderRadius: "2px",
                                    transition: "width 0.5s ease",
                                  }}
                                />
                              </div>
                              <span
                                className="font-mono text-[7px] w-[24px] text-right shrink-0"
                                style={{ color: "oklch(0.55 0.12 195)" }}
                              >
                                {val.toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: WM Slot Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="font-mono text-[8px] tracking-widest uppercase font-bold"
                        style={{ color: "oklch(0.55 0.12 280)" }}
                      >
                        3 · Working Memory Gate
                      </span>
                      <span
                        className="font-mono text-[7px]"
                        style={{ color: "oklch(0.45 0.10 280)" }}
                      >
                        {Math.round(gm.wmOccupancy * 8)}/8 slots
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((slotPos) => {
                        const slotIdx = slotPos - 1;
                        const slot = gm.wmSlots?.[slotIdx];
                        return (function renderSlot() {
                          const typeColors: Record<string, string> = {
                            SITUATION: "oklch(0.62 0.20 195)",
                            BODY_STATE: "oklch(0.65 0.22 145)",
                            CONFLICT: "oklch(0.65 0.22 20)",
                            GOAL: "oklch(0.68 0.22 70)",
                            MEMORY: "oklch(0.62 0.20 280)",
                          };
                          const bg = slot.occupied
                            ? slot.isCritical
                              ? "oklch(0.15 0.04 20)"
                              : "oklch(0.13 0.03 260)"
                            : "oklch(0.11 0.02 255)";
                          const border = slot.occupied
                            ? slot.isCritical
                              ? "oklch(0.45 0.15 20)"
                              : "oklch(0.22 0.06 260)"
                            : "oklch(0.17 0.04 255)";
                          return (
                            <div
                              key={`wm${slotPos}`}
                              className="rounded px-1.5 py-1 border"
                              style={{ background: bg, borderColor: border }}
                              data-ocid={`brain.wm.item.${slotPos}`}
                            >
                              {slot.occupied ? (
                                <>
                                  <div
                                    className="font-mono text-[6px] uppercase font-bold truncate"
                                    style={{
                                      color:
                                        typeColors[slot.type ?? "SITUATION"] ??
                                        "oklch(0.55 0.12 220)",
                                    }}
                                  >
                                    {slot.type?.slice(0, 4) ?? "??"}
                                    {slot.isCritical ? " ★" : ""}
                                  </div>
                                  <div
                                    className="font-mono text-[6px] truncate mt-0.5"
                                    style={{ color: "oklch(0.42 0.08 220)" }}
                                  >
                                    {slot.content?.slice(0, 12) ?? ""}
                                  </div>
                                  <div
                                    className="mt-0.5 h-[2px] rounded"
                                    style={{
                                      background: "oklch(0.14 0.03 260)",
                                    }}
                                  >
                                    <div
                                      style={{
                                        height: "100%",
                                        width: `${Math.round((slot.freshness ?? 0) * 100)}%`,
                                        background:
                                          typeColors[
                                            slot.type ?? "SITUATION"
                                          ] ?? "oklch(0.50 0.12 220)",
                                        borderRadius: "2px",
                                      }}
                                    />
                                  </div>
                                </>
                              ) : (
                                <div
                                  className="font-mono text-[6px] text-center py-0.5"
                                  style={{ color: "oklch(0.25 0.05 240)" }}
                                >
                                  —
                                </div>
                              )}
                            </div>
                          );
                        })();
                      })}
                    </div>
                  </div>

                  {/* Row 3: Persistence Tier + Homeostatic Spine */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Persistence Tiers */}
                    <div>
                      <span
                        className="font-mono text-[8px] tracking-widest uppercase font-bold block mb-1"
                        style={{ color: "oklch(0.55 0.12 70)" }}
                      >
                        4 · Persistence Tiers
                      </span>
                      <div className="space-y-0.5">
                        {(["SHORT", "MEDIUM", "HIGH", "SPECIAL"] as const).map(
                          (tier) => {
                            const isActive = gm.persistenceTier === tier;
                            return (
                              <div
                                key={tier}
                                className="flex items-center gap-2"
                              >
                                <span
                                  className="font-mono text-[7px] w-[44px] shrink-0"
                                  style={{
                                    color: isActive
                                      ? tierColors[tier]
                                      : "oklch(0.32 0.06 240)",
                                  }}
                                >
                                  {isActive ? "▶ " : "  "}
                                  {tier}
                                </span>
                                <span
                                  className="font-mono text-[7px]"
                                  style={{
                                    color: isActive
                                      ? tierColors[tier]
                                      : "oklch(0.28 0.05 240)",
                                  }}
                                >
                                  {isActive
                                    ? `${gm.persistenceItemCount} active`
                                    : "—"}
                                </span>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>

                    {/* Homeostatic Spine */}
                    <div>
                      <span
                        className="font-mono text-[8px] tracking-widest uppercase font-bold block mb-1"
                        style={{ color: "oklch(0.55 0.12 145)" }}
                      >
                        6 · Homeostatic Spine
                      </span>
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="flex-1 h-[5px] rounded"
                          style={{ background: "oklch(0.14 0.03 260)" }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${Math.round(hc.magnitude * 100)}%`,
                              background: hcColor,
                              borderRadius: "2px",
                              transition: "width 0.5s ease",
                            }}
                          />
                        </div>
                        <span
                          className="font-mono text-[7px] w-[28px] text-right shrink-0"
                          style={{ color: hcColor }}
                        >
                          {Math.round(hc.magnitude * 100)}%
                        </span>
                      </div>
                      <span
                        className="font-mono text-[6px] uppercase font-bold block"
                        style={{ color: hcColor }}
                      >
                        {hc.type === "none"
                          ? "within bounds"
                          : hc.type.replace("_", " ")}
                      </span>
                      <p
                        className="font-mono text-[6px] mt-0.5 leading-relaxed"
                        style={{ color: "oklch(0.32 0.05 220)" }}
                      >
                        {hc.reason?.slice(0, 60) ?? ""}
                      </p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </section>
        {/* u2500u2500 CoreBrain Runtime Monitor u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500 */}
        <section className="mt-4">
          <details>
            <summary
              className="font-mono text-[8px] tracking-widest uppercase font-bold cursor-pointer py-1 px-2 rounded-sm select-none"
              style={{
                color: "oklch(0.55 0.10 260)",
                background: "oklch(0.10 0.02 260)",
                border: "1px solid oklch(0.16 0.03 260)",
              }}
            >
              CORE BRAIN RUNTIME MONITOR u2014 7-Subsystem Stack
            </summary>
            <div className="mt-2">
              <CoreBrainMonitorPanel state={neural.coreMonitorState} />
            </div>
          </details>
        </section>

        {/* NEURO-CHEM — Internal Node 2 */}
        <section className="px-3 pb-3 pt-2">
          <NeuroChemPanel />
        </section>
      </div>
    </div>
  );
}
