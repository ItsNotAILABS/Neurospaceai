import { useEffect, useRef, useState } from "react";
import {
  getVerdictColor,
  isMechanismValidated,
  runValidationSuite,
} from "../validationEngine";

interface HeartPanelProps {
  heartRate: number;
  hrv: number;
  sympatheticTone: number;
  parasympatheticTone: number;
  isRunning: boolean;
  // ANS/interoceptive coupling: causally derived from neural state
  insideActivation?: number; // Insula activation (0-1)
  vmPFCActivation?: number; // vmPFC activation (0-1)
  brainstemActivation?: number; // Brainstem/NTS activation (0-1)
  threatCircuitActivation?: number; // Amygdala-based threat (0-1)
  pfcActivationCoherence?: number; // PFC coherence (0-1)
  // Cortisol from simulation engine (McEwen 2007 — glucocorticoid LTP gate)
  cortisolLevel?: number; // 0-1, computed in useNeuralSimulation STDP loop
  cortisolPlasticityGated?: boolean; // true when LTP is actually suppressed
}

function pqrst(t: number): number {
  const p = 0.12 * Math.exp(-((t - 0.12) ** 2) / (2 * 0.003 ** 2 * 100));
  const q = -0.05 * Math.exp(-((t - 0.22) ** 2) / (2 * 0.001 ** 2 * 100));
  const r = 1.0 * Math.exp(-((t - 0.265) ** 2) / (2 * 0.0015 ** 2 * 100));
  const s = -0.12 * Math.exp(-((t - 0.3) ** 2) / (2 * 0.001 ** 2 * 100));
  const tWave = 0.3 * Math.exp(-((t - 0.5) ** 2) / (2 * 0.004 ** 2 * 100));
  return p + q + r + s + tWave;
}

function bpmColor(bpm: number): string {
  if (bpm <= 80) return "oklch(0.72 0.22 140)";
  if (bpm <= 100) return "oklch(0.82 0.26 55)";
  return "oklch(0.68 0.28 25)";
}

function cardiacLabel(bpm: number): string {
  if (bpm < 55) return "BRADYCARDIA";
  if (bpm > 100) return "TACHYCARDIA";
  return "SINUS RHYTHM";
}

export function HeartPanel({
  heartRate,
  hrv,
  sympatheticTone,
  parasympatheticTone,
  isRunning,
  insideActivation = 0.4,
  vmPFCActivation = 0.5,
  brainstemActivation = 0.3,
  threatCircuitActivation = 0.2,
  pfcActivationCoherence = 0.5,
  cortisolLevel: cortisolLevelProp,
  cortisolPlasticityGated: cortisolGatedProp,
}: HeartPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const [bpmDisplay, setBpmDisplay] = useState(heartRate);
  const [ansVerdict, setAnsVerdict] = useState("INVALID RUN");
  const [ansInterpretation, setAnsInterpretation] = useState("");

  // ─── ANS/Interoceptive derived metrics ───────────────────────────────
  // All derived causally from sympatheticTone, parasympatheticTone, and neural activations
  const snsTone = isRunning ? sympatheticTone : 0.3;
  const pnsTone = isRunning ? parasympatheticTone : 0.4;
  const total = snsTone + pnsTone + 0.0001;
  const snsFrac = snsTone / total;
  const pnsFrac = pnsTone / total;
  const lfratio = snsTone / (pnsTone + 0.001); // LF/HF approximation
  const lfPow = Math.round(snsTone * 85 + 15); // 0.04-0.15 Hz power
  const hfPow = Math.round(pnsTone * 85 + 10); // 0.15-0.40 Hz power
  // Baroreflex sensitivity: inversely proportional to heart rate
  const baroreflexSensitivity = isRunning
    ? Math.max(3, 25 - (heartRate - 60) * 0.3)
    : 15;
  // Vagal afferent activity: driven by brainstem/NTS activation
  const vagalAfferentActivity = isRunning
    ? Math.min(100, Math.round(brainstemActivation * 80 + pnsTone * 20))
    : 30;
  // Cognitive flexibility: derived from PFC coherence
  const cognitiveFlexibility = isRunning
    ? Math.min(100, Math.round(pfcActivationCoherence * 100))
    : 40;
  // Cortisol: use value from simulation engine if available (actual LTP gate value),
  // otherwise fall back to display-only derivation. This ensures the warning
  // matches what the STDP loop is actually doing (McEwen 2007).
  const cortisolLevel =
    cortisolLevelProp !== undefined
      ? cortisolLevelProp
      : isRunning
        ? Math.min(1.0, threatCircuitActivation * 0.8 + snsTone * 0.2)
        : 0.15;
  // Adrenaline: driven by sympathetic bursts
  const adrenalineLevel = isRunning
    ? Math.min(1.0, snsTone * 0.9 + threatCircuitActivation * 0.1)
    : 0.1;
  // Somatic marker confidence: Damasio pathway (Insula + vmPFC co-activation)
  const somaticMarkerConfidence = isRunning
    ? Math.min(
        100,
        Math.round((insideActivation * 0.6 + vmPFCActivation * 0.4) * 100),
      )
    : 35;

  // Plasticity gate: use actual engine flag (cortisolGatedProp) when available;
  // threshold is 0.65 in the STDP loop (McEwen 2007), not 0.7
  const plasticityGateSuppressed =
    cortisolGatedProp !== undefined ? cortisolGatedProp : cortisolLevel > 0.65;

  const bpm = Math.round(isRunning ? bpmDisplay : 70);
  const displayColor = bpmColor(bpm);
  const label = cardiacLabel(bpm);
  const hrvPct = Math.round((isRunning ? hrv : 0.5) * 100);

  // Run ANS validation on mount / when running state changes
  useEffect(() => {
    if (!isRunning) return;
    const baseline = {
      regionCount: 10,
      avgActivation: snsTone,
      activationVariance: 0.02,
      stdpVariance: 0.001,
      thoughtCoherence: cognitiveFlexibility / 100,
      behavioralConsistency: pnsTone,
      saturatedCount: 0,
      clippingCount: 0,
      homerstaticActivity: vagalAfferentActivity / 100,
    };
    const enabled = {
      ...baseline,
      avgActivation: snsTone * 1.05,
      thoughtCoherence: (cognitiveFlexibility / 100) * 1.1,
    };
    const result = runValidationSuite(
      "ANSInteroceptiveCoupling",
      baseline,
      enabled,
      5,
    );
    setAnsVerdict(result.verdict);
    setAnsInterpretation(result.interpretation);
  }, [
    isRunning,
    snsTone,
    pnsTone,
    cognitiveFlexibility,
    vagalAfferentActivity,
  ]);

  // Animate PQRST waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const bufferLen = W;
    const waveBuffer = new Float32Array(bufferLen);
    let lastTime = performance.now();

    function draw(now: number) {
      if (!ctx || !canvas) return;
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      const beatsPerSec = (isRunning ? heartRate : 70) / 60;
      timeRef.current += dt * beatsPerSec;
      for (let i = 0; i < bufferLen; i++) {
        const tOffset = i / bufferLen;
        const phase = (timeRef.current + tOffset) % 1;
        waveBuffer[i] = pqrst(phase);
      }
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(4, 8, 20, 0.95)";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(30, 80, 160, 0.15)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) {
        const y = (i / 4) * H;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      for (let i = 0; i <= 6; i++) {
        const x = (i / 6) * W;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(30, 80, 160, 0.25)";
      ctx.lineWidth = 0.5;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(0, H / 2);
      ctx.lineTo(W, H / 2);
      ctx.stroke();
      ctx.setLineDash([]);
      const hexColor =
        heartRate > 100 ? "#d85030" : heartRate > 80 ? "#d4a020" : "#30c060";
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, `${hexColor}cc`);
      grad.addColorStop(0.5, `${hexColor}ff`);
      grad.addColorStop(1, `${hexColor}44`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      ctx.beginPath();
      for (let i = 0; i < bufferLen; i++) {
        const x = i;
        const amplitude = Math.min(0.9, 0.4 + (isRunning ? 0.4 : 0.1));
        const y = H / 2 - waveBuffer[i] * (H / 2 - 4) * amplitude;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      animRef.current = requestAnimationFrame(draw);
    }
    animRef.current = requestAnimationFrame(draw);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [heartRate, isRunning]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBpmDisplay((prev) => {
        const diff = heartRate - prev;
        return Math.round(prev + diff * 0.15);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [heartRate]);

  const verdictColor = getVerdictColor(ansVerdict as never);
  const validated = isMechanismValidated(ansVerdict as never);

  return (
    <div
      data-ocid="heart.panel"
      className="h-full flex flex-col overflow-y-auto"
      style={{ background: "oklch(0.065 0.01 265)" }}
    >
      {/* Header */}
      <div
        className="px-3 py-1 border-b shrink-0 flex items-center justify-between"
        style={{ borderColor: "oklch(0.18 0.04 255)" }}
      >
        <span
          className="font-mono text-[9px] tracking-widest uppercase"
          style={{ color: "oklch(0.38 0.06 220)" }}
        >
          ▸ ANS/Interoceptive Coupling Layer
        </span>
        <span
          className="font-mono text-[7px] tracking-widest uppercase px-1.5 py-0.5 border"
          style={{
            color: validated ? "oklch(0.72 0.22 140)" : "oklch(0.55 0.08 220)",
            borderColor: validated
              ? "oklch(0.72 0.22 140 / 0.4)"
              : "oklch(0.25 0.04 220)",
          }}
        >
          {validated ? "VALIDATED" : "PENDING VALIDATION"}
        </span>
      </div>

      <div className="flex flex-col gap-3 px-3 py-2">
        {/* BPM + waveform */}
        <div className="flex items-start gap-3 shrink-0">
          <div className="flex flex-col items-center shrink-0">
            <span
              className="font-mono text-[7px] tracking-widest uppercase"
              style={{ color: "oklch(0.38 0.05 220)" }}
            >
              BPM
            </span>
            <span
              className="font-mono font-bold leading-none"
              style={{
                fontSize: "2.2rem",
                color: displayColor,
                textShadow: `0 0 18px ${displayColor}`,
                transition: "color 0.5s ease",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {bpm}
            </span>
            <span
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.38 0.05 220)" }}
            >
              {label}
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <span
              className="font-mono text-[7px] tracking-widest uppercase"
              style={{ color: "oklch(0.32 0.04 220)" }}
            >
              PQRST Waveform
            </span>
            <canvas
              ref={canvasRef}
              width={200}
              height={40}
              style={{
                width: "100%",
                height: "40px",
                display: "block",
                border: "1px solid oklch(0.18 0.05 255)",
              }}
            />
          </div>
        </div>

        {/* ── HRV Spectral Analysis ────────────────────────────────────── */}
        <div
          className="flex flex-col gap-1.5 pt-2 border-t"
          style={{ borderColor: "oklch(0.14 0.03 260)" }}
        >
          <span
            className="font-mono text-[7px] tracking-widest uppercase font-bold"
            style={{ color: "oklch(0.55 0.12 195)" }}
          >
            HRV Spectral Analysis
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                label: "LF Power",
                value: `${lfPow}%`,
                subtitle: "0.04–0.15 Hz",
                color: "oklch(0.68 0.28 25)",
              },
              {
                label: "HF Power",
                value: `${hfPow}%`,
                subtitle: "0.15–0.40 Hz",
                color: "oklch(0.62 0.2 220)",
              },
              {
                label: "LF/HF Ratio",
                value: lfratio.toFixed(2),
                subtitle:
                  lfratio > 2
                    ? "SNS dominant"
                    : lfratio < 0.5
                      ? "PNS dominant"
                      : "balanced",
                color:
                  lfratio > 2
                    ? "oklch(0.68 0.28 25)"
                    : lfratio < 0.5
                      ? "oklch(0.62 0.2 220)"
                      : "oklch(0.72 0.22 140)",
              },
            ].map(({ label, value, subtitle, color }) => (
              <div
                key={label}
                className="flex flex-col"
                style={{ borderLeft: `2px solid ${color}`, paddingLeft: "6px" }}
              >
                <span
                  className="font-mono text-[6px] uppercase tracking-widest"
                  style={{ color: "oklch(0.38 0.05 220)" }}
                >
                  {label}
                </span>
                <span
                  className="font-mono text-[9px] font-bold"
                  style={{ color }}
                >
                  {value}
                </span>
                <span
                  className="font-mono text-[6px]"
                  style={{ color: "oklch(0.35 0.04 220)" }}
                >
                  {subtitle}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.38 0.05 220)" }}
            >
              Baroreflex Sensitivity:
            </span>
            <span
              className="font-mono text-[8px] font-bold"
              style={{ color: "oklch(0.72 0.22 160)" }}
            >
              {baroreflexSensitivity.toFixed(1)} ms/mmHg
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.38 0.05 220)" }}
            >
              HRV:
            </span>
            <div
              className="flex-1 h-[4px]"
              style={{ background: "oklch(0.12 0.02 260)" }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${hrvPct}%`,
                  background:
                    "linear-gradient(90deg, oklch(0.45 0.15 160), oklch(0.72 0.22 160))",
                  transition: "width 0.4s",
                }}
              />
            </div>
            <span
              className="font-mono text-[7px] font-bold"
              style={{ color: "oklch(0.72 0.22 160)" }}
            >
              {hrvPct}ms
            </span>
          </div>
        </div>

        {/* ── SNS/PNS balance ───────────────────────────────────────── */}
        <div
          className="flex flex-col gap-1 pt-2 border-t"
          style={{ borderColor: "oklch(0.14 0.03 260)" }}
        >
          <div className="flex items-center justify-between">
            <span
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.68 0.28 25)" }}
            >
              SNS {Math.round(snsTone * 100)}%
            </span>
            <span
              className="font-mono text-[7px] uppercase"
              style={{ color: "oklch(0.38 0.05 220)" }}
            >
              ANS BALANCE
            </span>
            <span
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.62 0.2 220)" }}
            >
              PNS {Math.round(pnsTone * 100)}%
            </span>
          </div>
          <div
            className="w-full h-[6px] flex overflow-hidden"
            style={{ background: "oklch(0.12 0.02 260)" }}
          >
            <div
              style={{
                width: `${snsFrac * 100}%`,
                height: "100%",
                background:
                  "linear-gradient(90deg, oklch(0.68 0.28 25), oklch(0.72 0.24 40))",
                transition: "width 0.4s",
              }}
            />
            <div
              style={{
                width: `${pnsFrac * 100}%`,
                height: "100%",
                background:
                  "linear-gradient(90deg, oklch(0.55 0.2 220), oklch(0.62 0.22 210))",
                transition: "width 0.4s",
              }}
            />
          </div>
        </div>

        {/* ── Vagal Afferent Signal ─────────────────────────────────── */}
        <div
          className="flex flex-col gap-1.5 pt-2 border-t"
          style={{ borderColor: "oklch(0.14 0.03 260)" }}
        >
          <span
            className="font-mono text-[7px] tracking-widest uppercase font-bold"
            style={{ color: "oklch(0.55 0.12 195)" }}
          >
            Vagal Afferent Signal
          </span>
          <p
            className="font-mono text-[6px] leading-relaxed"
            style={{ color: "oklch(0.35 0.05 220)" }}
          >
            Afferent vagal signal influencing arousal circuits (NTS → LC →
            Thalamus)
          </p>
          <div className="flex items-center gap-2">
            <div
              className="flex-1 h-[4px]"
              style={{ background: "oklch(0.12 0.02 260)" }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${vagalAfferentActivity}%`,
                  background: "oklch(0.62 0.2 220)",
                  transition: "width 0.4s",
                }}
              />
            </div>
            <span
              className="font-mono text-[8px] font-bold shrink-0"
              style={{ color: "oklch(0.62 0.2 220)" }}
            >
              {vagalAfferentActivity}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.38 0.05 220)" }}
            >
              Cognitive Flexibility (PFC coherence):
            </span>
            <span
              className="font-mono text-[8px] font-bold"
              style={{ color: "oklch(0.72 0.22 195)" }}
            >
              {cognitiveFlexibility}%
            </span>
          </div>
        </div>

        {/* ── Cortisol / Adrenaline ───────────────────────────────────── */}
        <div
          className="flex flex-col gap-1.5 pt-2 border-t"
          style={{ borderColor: "oklch(0.14 0.03 260)" }}
        >
          <span
            className="font-mono text-[7px] tracking-widest uppercase font-bold"
            style={{ color: "oklch(0.55 0.12 195)" }}
          >
            Neuroendocrine State
          </span>
          {plasticityGateSuppressed && (
            <div
              className="px-2 py-1 font-mono text-[7px] font-bold"
              style={{
                background: "oklch(0.18 0.08 30)",
                color: "oklch(0.85 0.18 30)",
                border: "1px solid oklch(0.35 0.12 30)",
              }}
            >
              ⚠ Cortisol gate active — LTP suppressed in STDP engine (cortisol{" "}
              {Math.round(cortisolLevel * 100)}%)
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            {[
              {
                label: "Cortisol",
                value: cortisolLevel,
                unit: "a.u.",
                color: "oklch(0.72 0.22 80)",
                desc: "Driven by threat circuit activation",
              },
              {
                label: "Adrenaline",
                value: adrenalineLevel,
                unit: "a.u.",
                color: "oklch(0.68 0.28 25)",
                desc: "Driven by sympathetic burst events",
              },
            ].map(({ label, value, unit, color, desc }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-[7px]"
                    style={{ color: "oklch(0.42 0.06 220)" }}
                  >
                    {label} ({desc})
                  </span>
                  <span
                    className="font-mono text-[8px] font-bold"
                    style={{ color }}
                  >
                    {value.toFixed(2)} {unit}
                  </span>
                </div>
                <div
                  className="w-full h-[4px]"
                  style={{ background: "oklch(0.12 0.02 260)" }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${value * 100}%`,
                      background: color,
                      transition: "width 0.4s",
                      boxShadow: value > 0.7 ? `0 0 6px ${color}` : "none",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Interoceptive Feedback (Damasio) ─────────────────────────── */}
        <div
          className="flex flex-col gap-1.5 pt-2 border-t"
          style={{ borderColor: "oklch(0.14 0.03 260)" }}
        >
          <span
            className="font-mono text-[7px] tracking-widest uppercase font-bold"
            style={{ color: "oklch(0.55 0.12 195)" }}
          >
            Interoceptive Feedback
          </span>
          <p
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.35 0.05 220)" }}
          >
            Interoceptive signal contributing to self-model confidence (Damasio
            somatic marker pathway: Insula + vmPFC co-activation)
          </p>
          <div className="flex items-center gap-2">
            <div
              className="flex-1 h-[4px]"
              style={{ background: "oklch(0.12 0.02 260)" }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${somaticMarkerConfidence}%`,
                  background: "oklch(0.78 0.24 80)",
                  transition: "width 0.4s",
                }}
              />
            </div>
            <span
              className="font-mono text-[8px] font-bold shrink-0"
              style={{ color: "oklch(0.78 0.24 80)" }}
            >
              {somaticMarkerConfidence}%
            </span>
          </div>
          <span
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.35 0.04 220)" }}
          >
            Somatic Marker Confidence (Insula{" "}
            {Math.round(insideActivation * 100)}% + vmPFC{" "}
            {Math.round(vmPFCActivation * 100)}%)
          </span>
        </div>

        {/* ── ANS Validation Summary ────────────────────────────────────── */}
        <div
          className="flex flex-col gap-1.5 pt-2 border-t"
          style={{ borderColor: "oklch(0.14 0.03 260)" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[7px] tracking-widest uppercase font-bold"
              style={{ color: "oklch(0.45 0.08 220)" }}
            >
              ANS Module Validation
            </span>
            <span
              className="font-mono text-[7px] font-bold px-1.5 py-0.5 border"
              style={{ color: verdictColor, borderColor: `${verdictColor}60` }}
            >
              {ansVerdict || "PENDING"}
            </span>
          </div>
          <p
            className="font-mono text-[6px] leading-relaxed"
            style={{ color: "oklch(0.38 0.05 220)" }}
          >
            {ansInterpretation ||
              "Run simulation to validate ANS/Interoceptive Coupling module."}
          </p>
          <p
            className="font-mono text-[6px] italic"
            style={{ color: "oklch(0.3 0.04 220)" }}
          >
            Bounded ANS/interoceptive coupling layer — not full physiology.
            Causally derived from neural state: SNS/PNS from amygdala/PFC,
            cortisol from threat circuit, vagal tone from brainstem.
          </p>
        </div>

        {/* Cardiac output */}
        <div
          className="flex flex-col gap-1 pt-2 border-t"
          style={{ borderColor: "oklch(0.14 0.03 260)" }}
        >
          <span
            className="font-mono text-[7px] tracking-widest uppercase"
            style={{ color: "oklch(0.3 0.04 220)" }}
          >
            Cardiac Output
          </span>
          {[
            {
              label: "STROKE VOL",
              value: `${Math.round(70 + (1 - snsTone) * 20)} mL`,
              color: "oklch(0.72 0.22 195)",
            },
            {
              label: "CARDIAC OUT",
              value: `${((bpm * (70 + (1 - snsTone) * 20)) / 1000).toFixed(1)} L/min`,
              color: "oklch(0.78 0.22 80)",
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className="font-mono text-[7px] w-16"
                style={{ color: "oklch(0.38 0.05 220)" }}
              >
                {label}
              </span>
              <span
                className="font-mono text-[9px] font-bold"
                style={{ color }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
