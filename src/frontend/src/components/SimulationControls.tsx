import { useState } from "react";
import type {
  NeuralSimulationControls,
  NeuralSimulationState,
} from "../hooks/useNeuralSimulation";
import { FrontendRegion, Region } from "../hooks/useQueries";
import type { ExtendedRegion } from "../hooks/useQueries";

interface SimulationControlsProps {
  neural: Pick<
    NeuralSimulationState & NeuralSimulationControls,
    | "isRunning"
    | "speed"
    | "start"
    | "pause"
    | "reset"
    | "setSpeed"
    | "injectStimulus"
    | "isConsolidating"
    | "consolidationCount"
    | "isMaturationActive"
    | "maturityScore"
    | "triggerConsolidation"
    | "startMaturationProtocol"
    | "stopMaturationProtocol"
  >;
}

interface StimulusConfig {
  label: string;
  region: ExtendedRegion;
  shortLabel: string;
  color: string;
  ocid: string;
}

const STIMULI: StimulusConfig[] = [
  {
    label: "Visual Stimulus",
    shortLabel: "VISUAL",
    region: Region.SensoryCortex,
    color: "oklch(0.72 0.22 195)",
    ocid: "stimulus.visual_button",
  },
  {
    label: "Auditory Stimulus",
    shortLabel: "AUDIO",
    region: Region.Thalamus,
    color: "oklch(0.7 0.2 220)",
    ocid: "stimulus.auditory_button",
  },
  {
    label: "Memory Recall",
    shortLabel: "MEMORY",
    region: Region.Hippocampus,
    color: "oklch(0.72 0.2 160)",
    ocid: "stimulus.memory_button",
  },
  {
    label: "Fear Response",
    shortLabel: "FEAR",
    region: Region.Amygdala,
    color: "oklch(0.68 0.28 25)",
    ocid: "stimulus.fear_button",
  },
  {
    label: "Motor Command",
    shortLabel: "MOTOR",
    region: Region.MotorCortex,
    color: "oklch(0.78 0.24 80)",
    ocid: "stimulus.motor_button",
  },
  {
    label: "Executive Focus",
    shortLabel: "EXEC",
    region: Region.PrefrontalCortex,
    color: "oklch(0.72 0.22 280)",
    ocid: "stimulus.executive_button",
  },
  {
    label: "Pain Response",
    shortLabel: "PAIN",
    region: FrontendRegion.Insula,
    color: "oklch(0.65 0.28 15)",
    ocid: "stimulus.pain_button",
  },
  {
    label: "Reward Signal",
    shortLabel: "REWARD",
    region: FrontendRegion.NucleusAccumbens,
    color: "oklch(0.82 0.26 55)",
    ocid: "stimulus.reward_button",
  },
  {
    label: "Olfactory Trigger",
    shortLabel: "OLFACT",
    region: FrontendRegion.OlfactoryBulb,
    color: "oklch(0.72 0.2 140)",
    ocid: "stimulus.olfactory_button",
  },
  {
    label: "Social Cue",
    shortLabel: "SOCIAL",
    region: FrontendRegion.AnteriorCingulateCortex,
    color: "oklch(0.75 0.22 310)",
    ocid: "stimulus.social_button",
  },
  {
    label: "REM Sleep",
    shortLabel: "REM",
    region: FrontendRegion.Hypothalamus,
    color: "oklch(0.62 0.18 250)",
    ocid: "stimulus.sleep_button",
  },
  {
    label: "Decision Making",
    shortLabel: "DECIDE",
    region: FrontendRegion.OrbitalFrontalCortex,
    color: "oklch(0.78 0.22 95)",
    ocid: "stimulus.decision_button",
  },
  {
    label: "Proprioception",
    shortLabel: "PROPRIO",
    region: FrontendRegion.PrimarySomatosensory_L,
    color: "oklch(0.72 0.2 175)",
    ocid: "stimulus.proprio_button",
  },
  {
    label: "Vestibular",
    shortLabel: "VESTIB",
    region: Region.Cerebellum,
    color: "oklch(0.7 0.22 240)",
    ocid: "stimulus.vestib_button",
  },
];

const SPEED_OPTIONS = [1, 5, 10, 20, 50];

export function SimulationControls({ neural }: SimulationControlsProps) {
  const [firingStimulus, setFiringStimulus] = useState<string | null>(null);

  const handleStimulus = (stimulus: StimulusConfig) => {
    setFiringStimulus(stimulus.shortLabel);
    neural.injectStimulus(stimulus.region, 1.0);
    setTimeout(() => setFiringStimulus(null), 800);
  };

  return (
    <div
      data-ocid="connectome.panel"
      className="h-full flex flex-col gap-0 overflow-hidden"
      style={{ background: "oklch(0.065 0.01 265)" }}
    >
      {/* Simulation controls */}
      <div
        className="px-3 py-2 border-b shrink-0"
        style={{ borderColor: "oklch(0.18 0.04 255)" }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-2"
          style={{ color: "oklch(0.38 0.06 220)" }}
        >
          ▸ Simulation Engine
        </div>

        {!neural.isRunning && (
          <div
            className="mb-2 font-mono text-[8px] tracking-[0.1em] uppercase text-center"
            style={{
              background: "oklch(0.65 0.28 25 / 0.12)",
              border: "1px solid oklch(0.65 0.28 25 / 0.4)",
              padding: "4px 8px",
              color: "oklch(0.75 0.25 55)",
              animation: "pulse_dot 2s ease-in-out infinite",
            }}
          >
            ▶ PRESS RUN TO ACTIVATE SIMULATION
          </div>
        )}

        {/* Consolidation status banner */}
        {neural.isConsolidating && (
          <div
            data-ocid="consolidation.status"
            className="mb-2 font-mono text-[8px] tracking-widest uppercase text-center"
            style={{
              background: "oklch(0.72 0.22 195 / 0.1)",
              border: "1px solid oklch(0.72 0.22 195 / 0.5)",
              padding: "4px 8px",
              color: "oklch(0.72 0.22 195)",
              animation: "pulse_neon 1s ease-in-out infinite",
            }}
          >
            ⟳ CONSOLIDATING — synaptic integration active
          </div>
        )}

        {/* Maturation protocol status */}
        {neural.isMaturationActive && (
          <div
            className="mb-2 font-mono text-[8px] tracking-widest uppercase text-center"
            style={{
              background: "oklch(0.75 0.22 140 / 0.1)",
              border: "1px solid oklch(0.75 0.22 140 / 0.5)",
              padding: "4px 8px",
              color: "oklch(0.75 0.22 140)",
            }}
          >
            ◈ MATURATION PROTOCOL ACTIVE · {neural.maturityScore ?? 0}% MATURE
          </div>
        )}

        <div className="flex gap-2 items-center">
          <button
            type="button"
            data-ocid="simulation.play_button"
            className={`sim-control-btn ${neural.isRunning ? "running" : "primary"} flex-1 flex items-center justify-center gap-2`}
            style={
              !neural.isRunning
                ? { animation: "pulse_neon 1.5s ease-in-out infinite" }
                : undefined
            }
            onClick={() => (neural.isRunning ? neural.pause() : neural.start())}
          >
            <span className="text-xs">{neural.isRunning ? "■" : "▶"}</span>
            <span>{neural.isRunning ? "PAUSE" : "RUN"}</span>
          </button>
          <button
            type="button"
            data-ocid="simulation.reset_button"
            className="sim-control-btn danger"
            onClick={() => neural.reset()}
          >
            RESET
          </button>
        </div>

        {/* Speed selector */}
        <div className="flex items-center gap-1 mt-2 flex-wrap">
          <span
            className="font-mono text-[8px] tracking-widest mr-1"
            style={{ color: "oklch(0.35 0.05 220)" }}
          >
            SPEED:
          </span>
          {SPEED_OPTIONS.map((s) => (
            <button
              type="button"
              key={s}
              className="font-mono text-[9px] px-2 py-[3px] border transition-all"
              style={{
                borderColor:
                  neural.speed === s
                    ? "oklch(0.72 0.22 195)"
                    : "oklch(0.22 0.05 255)",
                background:
                  neural.speed === s
                    ? "oklch(0.72 0.22 195 / 0.15)"
                    : "oklch(0.1 0.015 265)",
                color:
                  neural.speed === s
                    ? "oklch(0.82 0.18 195)"
                    : "oklch(0.45 0.06 220)",
                boxShadow:
                  neural.speed === s
                    ? "0 0 8px oklch(0.72 0.22 195 / 0.3)"
                    : "none",
              }}
              onClick={() => neural.setSpeed(s)}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 mt-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: neural.isRunning
                ? "oklch(0.68 0.28 140)"
                : "oklch(0.45 0.1 220)",
              boxShadow: neural.isRunning
                ? "0 0 6px oklch(0.68 0.28 140)"
                : "none",
              animation: neural.isRunning
                ? "pulse_neon 1s ease-in-out infinite"
                : "none",
            }}
          />
          <span
            className="font-mono text-[9px] tracking-widest"
            style={{
              color: neural.isRunning
                ? "oklch(0.68 0.22 140)"
                : "oklch(0.4 0.06 220)",
            }}
          >
            {neural.isRunning ? `ACTIVE — ${neural.speed}x SPEED` : "STANDBY"}
          </span>
        </div>
      </div>

      {/* Maturation & Consolidation controls */}
      <div
        className="px-3 py-2 border-b shrink-0"
        style={{ borderColor: "oklch(0.18 0.04 255)" }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-2"
          style={{ color: "oklch(0.38 0.06 220)" }}
        >
          ▸ Brain Development
        </div>
        <div className="flex gap-2 mb-2">
          {!neural.isMaturationActive ? (
            <button
              type="button"
              data-ocid="maturation.protocol_button"
              className="flex-1 py-1.5 px-3 border font-mono text-[8px] tracking-widest uppercase transition-all"
              style={{
                borderColor: "oklch(0.75 0.22 140)",
                color: "oklch(0.75 0.22 140)",
                background: "oklch(0.75 0.22 140 / 0.08)",
              }}
              onClick={() => neural.startMaturationProtocol()}
            >
              ◈ Start Maturation Protocol
            </button>
          ) : (
            <button
              type="button"
              data-ocid="maturation.stop_button"
              className="flex-1 py-1.5 px-3 border font-mono text-[8px] tracking-widest uppercase transition-all"
              style={{
                borderColor: "oklch(0.68 0.28 25)",
                color: "oklch(0.68 0.28 25)",
                background: "oklch(0.68 0.28 25 / 0.08)",
              }}
              onClick={() => neural.stopMaturationProtocol()}
            >
              ■ Stop Maturation
            </button>
          )}
          <button
            type="button"
            data-ocid="consolidation.trigger_button"
            className="py-1.5 px-3 border font-mono text-[8px] tracking-widest uppercase transition-all"
            style={{
              borderColor: neural.isConsolidating
                ? "oklch(0.72 0.22 195 / 0.4)"
                : "oklch(0.72 0.22 195)",
              color: neural.isConsolidating
                ? "oklch(0.5 0.1 220)"
                : "oklch(0.72 0.22 195)",
              background: "oklch(0.072 0.015 265)",
              cursor: neural.isConsolidating ? "not-allowed" : "pointer",
            }}
            onClick={() =>
              !neural.isConsolidating && neural.triggerConsolidation()
            }
            disabled={neural.isConsolidating}
          >
            ⟳ Consolidate
          </button>
        </div>
        {/* Maturity meter */}
        <div data-ocid="maturation.progress_meter">
          <div className="flex items-center justify-between mb-1">
            <span
              className="font-mono text-[7px] tracking-widest"
              style={{ color: "oklch(0.35 0.05 220)" }}
            >
              MATURITY
            </span>
            <span
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.6 0.15 140)" }}
            >
              {neural.maturityScore ?? 0}% · {neural.consolidationCount ?? 0}{" "}
              consolidations
            </span>
          </div>
          <div
            className="w-full h-1.5 relative"
            style={{ background: "oklch(0.12 0.02 260)" }}
          >
            <div
              className="absolute h-full left-0 transition-all duration-700"
              style={{
                width: `${neural.maturityScore ?? 0}%`,
                background:
                  "linear-gradient(90deg, oklch(0.6 0.2 195), oklch(0.75 0.22 140))",
                boxShadow:
                  (neural.maturityScore ?? 0) > 50
                    ? "0 0 6px oklch(0.75 0.22 140 / 0.4)"
                    : "none",
              }}
            />
          </div>
          <div className="flex justify-between mt-0.5">
            {["Developing", "Maturing", "Near-Mature", "Mature"].map(
              (label, i) => {
                const threshold = [0, 40, 70, 90][i];
                const active = (neural.maturityScore ?? 0) >= threshold;
                return (
                  <span
                    key={label}
                    className="font-mono text-[6px]"
                    style={{
                      color: active
                        ? "oklch(0.65 0.18 140)"
                        : "oklch(0.25 0.04 220)",
                    }}
                  >
                    {active ? "●" : "○"} {label}
                  </span>
                );
              },
            )}
          </div>
        </div>
      </div>

      {/* Stimulus injection panel */}
      <div className="flex-1 px-3 py-2 overflow-y-auto min-h-0">
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-2"
          style={{ color: "oklch(0.38 0.06 220)" }}
        >
          ▸ Stimulus Injection Array · 14 Channels
        </div>
        <div className="grid grid-cols-2 gap-[5px]">
          {STIMULI.map((stimulus) => {
            const isFiring = firingStimulus === stimulus.shortLabel;
            return (
              <button
                type="button"
                key={stimulus.shortLabel}
                data-ocid={stimulus.ocid}
                className={`stimulus-btn text-left flex flex-col gap-[2px] ${isFiring ? "firing" : ""}`}
                onClick={() => handleStimulus(stimulus)}
                style={
                  isFiring
                    ? {
                        borderColor: stimulus.color,
                        color: stimulus.color,
                        boxShadow: `0 0 14px ${stimulus.color}55, inset 0 0 8px ${stimulus.color}12`,
                        background: `${stimulus.color}10`,
                      }
                    : undefined
                }
              >
                <span
                  className="font-mono text-[8px] font-bold tracking-widest"
                  style={{
                    color: isFiring ? stimulus.color : "oklch(0.42 0.06 220)",
                  }}
                >
                  {stimulus.shortLabel}
                </span>
                <span className="text-[9px] leading-tight truncate">
                  {stimulus.label}
                </span>
                {isFiring && (
                  <span
                    className="text-[7px] font-bold tracking-widest animate-pulse-neon"
                    style={{ color: stimulus.color }}
                  >
                    FIRING
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Activity scale legend */}
        <div
          className="mt-3 pt-2 border-t"
          style={{ borderColor: "oklch(0.14 0.03 260)" }}
        >
          <div
            className="font-mono text-[7px] tracking-widest uppercase mb-1"
            style={{ color: "oklch(0.3 0.04 220)" }}
          >
            Activity Scale
          </div>
          <div className="flex gap-1 items-center flex-wrap">
            {[
              { color: "oklch(0.35 0.12 260)", label: "0%" },
              { color: "oklch(0.55 0.18 220)", label: "25%" },
              { color: "oklch(0.72 0.22 195)", label: "50%" },
              { color: "oklch(0.8 0.22 80)", label: "75%" },
              { color: "oklch(0.68 0.28 30)", label: "100%" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1">
                <div className="w-3 h-3" style={{ background: color }} />
                <span
                  className="font-mono text-[7px]"
                  style={{ color: "oklch(0.35 0.04 220)" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
