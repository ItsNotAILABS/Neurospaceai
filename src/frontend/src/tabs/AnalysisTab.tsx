import { useEffect } from "react";
import { AblationStudies } from "../components/AblationStudies";
import { EmotionAnalysisPanel } from "../components/EmotionAnalysisPanel";
import { HeartPanel } from "../components/HeartPanel";
import type {
  NeuralSimulationControls,
  NeuralSimulationState,
  SilenceEntry,
} from "../hooks/useNeuralSimulation";
import {
  useCanonicalState,
  useFearMissionState,
  useNeuroscienceState,
} from "../hooks/useQueries";

type Neural = NeuralSimulationState & NeuralSimulationControls;

export default function AnalysisTab({ neural }: { neural: Neural }) {
  const { data: canon } = useCanonicalState();
  const { data: fearState } = useFearMissionState();
  const { data: neuroState } = useNeuroscienceState();

  // Seed neural simulation with real organism signals
  useEffect(() => {
    if (!canon) return;
    neural.seedFromBackend?.({
      coherence: canon.coh,
      arousal: canon.ar,
      identityI: canon.ic,
      fearLevel: fearState?.fearLevel,
      vagalTone: neuroState?.vagalTone,
      consciousnessIndex: neuroState?.consciousnessIndex,
      kuramotoR: fearState?.kuramotoR,
      missionLockActive: fearState?.missionLockActive,
      surrenderFloor: fearState?.surrenderFloor,
      courageScore: fearState?.courageScore,
      groundedScore: fearState?.groundedScore,
    });
  }, [canon, fearState, neuroState, neural]);

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
                (fearState?.fearLevel ?? 0) > 0.5
                  ? "oklch(0.65 0.25 25)"
                  : "oklch(0.68 0.28 140)",
            }}
          >
            {(fearState?.fearLevel ?? 0).toFixed(3)}
          </span>
          <span style={{ color: "oklch(0.38 0.05 220)" }}>KHz</span>
          <span style={{ color: "oklch(0.72 0.22 195)" }}>
            {canon.kf.toFixed(3)}
          </span>
          <span style={{ color: "oklch(0.38 0.05 220)" }}>ψ-IDX</span>
          <span style={{ color: "oklch(0.72 0.22 195)" }}>
            {(neuroState?.consciousnessIndex ?? 0).toFixed(3)}
          </span>
          <span style={{ color: "oklch(0.38 0.05 220)" }}>BEAT</span>
          <span style={{ color: "oklch(0.85 0.06 210)" }}>
            {String(Number(canon.b)).padStart(8, "0")}
          </span>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        {/* EmotionAnalysisPanel — 33% */}
        <section
          className="flex flex-col border-r"
          style={{
            flex: "0 0 33%",
            overflow: "hidden",
            borderColor: "oklch(0.18 0.05 255)",
          }}
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
              Analysis · Emotions · Plutchik
            </span>
          </div>
          <div className="flex-1 overflow-hidden min-h-0">
            <EmotionAnalysisPanel neural={neural} />
          </div>
        </section>

        {/* HeartPanel + Silence + Saturation — 34% */}
        <section
          className="flex flex-col border-r"
          style={{
            flex: "0 0 34%",
            overflow: "hidden",
            borderColor: "oklch(0.18 0.05 255)",
          }}
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
              Cardiac · ANS · HRV
            </span>
          </div>
          <div className="flex-1 overflow-hidden min-h-0">
            <HeartPanel
              heartRate={neural.heartRate}
              hrv={neural.hrv}
              sympatheticTone={neural.sympatheticTone}
              parasympatheticTone={neural.parasympatheticTone}
              isRunning={neural.isRunning}
              insideActivation={
                neural.regions.find((r) =>
                  (r.region as string).toLowerCase().includes("insula"),
                )?.activation ?? 0.4
              }
              vmPFCActivation={
                neural.regions.find((r) =>
                  (r.region as string).toLowerCase().includes("orbital"),
                )?.activation ?? 0.5
              }
              brainstemActivation={
                neural.regions.find((r) =>
                  (r.region as string).toLowerCase().includes("brainstem"),
                )?.activation ?? 0.3
              }
              threatCircuitActivation={
                neural.regions.find((r) =>
                  (r.region as string).toLowerCase().includes("amygdala"),
                )?.activation ?? 0.2
              }
              pfcActivationCoherence={neural.metacognitiveConfidence ?? 0.5}
              cortisolLevel={neural.cortisolLevel}
              cortisolPlasticityGated={neural.cortisolPlasticityGated}
            />
          </div>
          {/* Silence Log */}
          <div
            className="shrink-0 border-t overflow-y-auto"
            style={{
              borderColor: "oklch(0.22 0.06 255)",
              background: "oklch(0.06 0.015 265)",
              maxHeight: "160px",
            }}
          >
            <div
              className="px-3 py-1.5 sticky top-0 border-b"
              style={{
                borderColor: "oklch(0.18 0.04 255)",
                background: "oklch(0.07 0.015 265)",
              }}
            >
              <span
                className="font-mono text-[8px] tracking-widest uppercase font-bold"
                style={{ color: "oklch(0.55 0.12 220)" }}
              >
                ◌ Silence Log — Valid Scientific Data
              </span>
            </div>
            {!neural.silenceLog || neural.silenceLog.length === 0 ? (
              <div
                data-ocid="silence_log.empty_state"
                className="px-3 py-2 font-mono text-[7px] italic"
                style={{ color: "oklch(0.32 0.04 220)" }}
              >
                No silence periods logged yet.
              </div>
            ) : (
              <div className="flex flex-col">
                {neural.silenceLog
                  .slice()
                  .reverse()
                  .map((entry: SilenceEntry, idx: number) => (
                    <div
                      key={`${entry.fromTick}-${entry.toTick}-${idx}`}
                      data-ocid={`silence_log.item.${Math.min(idx + 1, 3)}`}
                      className="px-3 py-1.5 border-b"
                      style={{ borderColor: "oklch(0.1 0.02 260)" }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono text-[7px]"
                          style={{ color: "oklch(0.45 0.06 220)" }}
                        >
                          T{entry.fromTick}–T{entry.toTick}
                        </span>
                        <span
                          className="font-mono text-[7px] text-right ml-auto"
                          style={{ color: "oklch(0.35 0.04 220)" }}
                        >
                          {entry.toTick - entry.fromTick} ticks
                        </span>
                      </div>
                      <p
                        className="font-mono text-[7px] leading-tight mt-0.5"
                        style={{ color: "oklch(0.42 0.06 220)" }}
                      >
                        {entry.reason}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
          {/* Saturation Monitor */}
          <div
            className="shrink-0 border-t overflow-y-auto"
            style={{
              borderColor: "oklch(0.22 0.06 255)",
              background: "oklch(0.06 0.015 265)",
              maxHeight: "140px",
            }}
          >
            <div
              className="px-3 py-1.5 sticky top-0 border-b flex items-center gap-2"
              style={{
                borderColor: "oklch(0.18 0.04 255)",
                background: "oklch(0.07 0.015 265)",
              }}
            >
              <span
                className="font-mono text-[8px] tracking-widest uppercase font-bold"
                style={{
                  color:
                    neural.saturatedRegions.length > 0
                      ? "oklch(0.75 0.18 30)"
                      : "oklch(0.55 0.12 150)",
                }}
              >
                {neural.saturatedRegions.length > 0
                  ? "⚠ Saturation Monitor"
                  : "✓ Saturation Monitor"}
              </span>
            </div>
            {neural.saturatedRegions.length === 0 ? (
              <div
                data-ocid="saturation.empty_state"
                className="px-3 py-2 font-mono text-[7px] italic"
                style={{ color: "oklch(0.45 0.08 150)" }}
              >
                No saturated regions detected.
              </div>
            ) : (
              <div className="flex flex-col">
                {neural.saturatedRegions
                  .slice(0, 5)
                  .map((region: string, idx: number) => (
                    <div
                      key={region}
                      data-ocid={`saturation.item.${Math.min(idx + 1, 3)}`}
                      className="px-3 py-1 border-b flex items-center gap-2"
                      style={{ borderColor: "oklch(0.1 0.02 260)" }}
                    >
                      <span
                        className="font-mono text-[8px] font-bold"
                        style={{ color: "oklch(0.75 0.18 30)" }}
                      >
                        SATURATED
                      </span>
                      <span
                        className="font-mono text-[7px]"
                        style={{ color: "oklch(0.6 0.08 30)" }}
                      >
                        {region}
                      </span>
                    </div>
                  ))}
                {neural.saturatedRegions.length > 5 && (
                  <div
                    className="px-3 py-1 font-mono text-[7px]"
                    style={{ color: "oklch(0.45 0.06 30)" }}
                  >
                    +{neural.saturatedRegions.length - 5} more
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Ablation + Batch Run — 33% */}
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
              Ablation Studies · Batch Run
            </span>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0">
            <AblationStudies neural={neural} />
            {/* Batch Run Panel */}
            <div
              className="m-3 border"
              style={{
                background: "oklch(0.075 0.012 265)",
                borderColor: "oklch(0.2 0.05 255)",
              }}
            >
              <div
                className="px-3 py-2 border-b flex items-center gap-2"
                style={{ borderColor: "oklch(0.18 0.04 255)" }}
              >
                <span
                  className="font-mono text-[9px] tracking-widest uppercase"
                  style={{ color: "oklch(0.38 0.06 220)" }}
                >
                  Batch Run · Reproducibility
                </span>
                {neural.batchRunActive && (
                  <span
                    className="ml-auto font-mono text-[8px] animate-pulse"
                    style={{ color: "oklch(0.82 0.26 80)" }}
                  >
                    ● RUNNING {neural.batchRunProgress}/{neural.batchRunTarget}
                  </span>
                )}
              </div>
              <div className="p-3 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  {[20, 50, 100].map((n) => (
                    <button
                      key={n}
                      type="button"
                      data-ocid="batch.primary_button"
                      onClick={() =>
                        !neural.batchRunActive && neural.startBatchRun(n)
                      }
                      disabled={neural.batchRunActive}
                      className="font-mono text-[8px] tracking-widest uppercase px-3 py-1 transition-all disabled:opacity-40"
                      style={{
                        border: "1px solid oklch(0.45 0.15 195)",
                        background: "oklch(0.45 0.15 195 / 0.1)",
                        color: "oklch(0.72 0.22 195)",
                      }}
                    >
                      Run ×{n}
                    </button>
                  ))}
                  {neural.batchRunActive && (
                    <button
                      type="button"
                      data-ocid="batch.cancel_button"
                      onClick={neural.stopBatchRun}
                      className="font-mono text-[8px] tracking-widest uppercase px-3 py-1 transition-all ml-auto"
                      style={{
                        border: "1px solid oklch(0.45 0.15 25)",
                        background: "oklch(0.45 0.15 25 / 0.1)",
                        color: "oklch(0.72 0.2 25)",
                      }}
                    >
                      Stop
                    </button>
                  )}
                </div>
                {(neural.batchRunActive || neural.batchRunProgress > 0) && (
                  <div>
                    <div
                      className="h-[4px] rounded overflow-hidden"
                      style={{ background: "oklch(0.12 0.02 260)" }}
                    >
                      <div
                        className="h-full transition-all"
                        data-ocid="batch.loading_state"
                        style={{
                          width: `${neural.batchRunTarget > 0 ? Math.round((neural.batchRunProgress / neural.batchRunTarget) * 100) : 0}%`,
                          background: "oklch(0.72 0.22 195)",
                        }}
                      />
                    </div>
                    <div
                      className="font-mono text-[8px] mt-1"
                      style={{ color: "oklch(0.4 0.06 220)" }}
                    >
                      {neural.batchRunProgress} / {neural.batchRunTarget}{" "}
                      sessions
                    </div>
                  </div>
                )}
                {neural.batchRunResults.length > 0 && (
                  <div className="overflow-x-auto">
                    <table
                      className="w-full font-mono text-[8px]"
                      style={{ borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr
                          style={{
                            borderBottom: "1px solid oklch(0.2 0.04 255)",
                          }}
                        >
                          {[
                            "#",
                            "Entropy",
                            "Sat.",
                            "Thoughts",
                            "Habit.",
                            "Nav.",
                            "PI",
                          ].map((h) => (
                            <th
                              key={h}
                              className="px-2 py-1 text-left"
                              style={{ color: "oklch(0.45 0.08 220)" }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {neural.batchRunResults.map((r, i) => (
                          <tr
                            key={r.sessionId}
                            data-ocid={`batch.item.${i + 1}`}
                            style={{
                              borderBottom:
                                "1px solid oklch(0.14 0.03 255 / 0.5)",
                            }}
                          >
                            <td
                              className="px-2 py-[2px]"
                              style={{ color: "oklch(0.38 0.06 220)" }}
                            >
                              {i + 1}
                            </td>
                            <td
                              className="px-2 py-[2px]"
                              style={{ color: "oklch(0.72 0.22 195)" }}
                            >
                              {r.shannonEntropy.toFixed(3)}
                            </td>
                            <td
                              className="px-2 py-[2px]"
                              style={{
                                color:
                                  r.saturatedCount > 0
                                    ? "oklch(0.72 0.22 25)"
                                    : "oklch(0.55 0.08 150)",
                              }}
                            >
                              {r.saturatedCount}
                            </td>
                            <td
                              className="px-2 py-[2px]"
                              style={{ color: "oklch(0.6 0.1 220)" }}
                            >
                              {r.thoughtCount}
                            </td>
                            <td
                              className="px-2 py-[2px]"
                              style={{
                                color: r.habituationDetected
                                  ? "oklch(0.72 0.22 140)"
                                  : "oklch(0.35 0.05 220)",
                              }}
                            >
                              {r.habituationDetected ? "✓" : "–"}
                            </td>
                            <td
                              className="px-2 py-[2px]"
                              style={{
                                color: r.goalDirectedNav
                                  ? "oklch(0.72 0.22 195)"
                                  : "oklch(0.35 0.05 220)",
                              }}
                            >
                              {r.goalDirectedNav ? "✓" : "–"}
                            </td>
                            <td
                              className="px-2 py-[2px]"
                              style={{ color: "oklch(0.65 0.14 280)" }}
                            >
                              {r.plasticityIndex.toFixed(4)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
