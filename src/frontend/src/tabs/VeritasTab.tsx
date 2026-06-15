// VERITAS — Validation Engine
// Reads ANIMA chain state, canonical state, observation yield.
// Computes signal consistency score, chain validity, trust per source.
import { motion } from "motion/react";
import {
  useCanonicalState,
  useFearMissionState,
  useNeuroscienceState,
  useObservationYield,
} from "../hooks/useQueries";

const C = {
  bg: "oklch(0.055 0.01 265)",
  panel: "oklch(0.075 0.012 265)",
  border: "oklch(0.18 0.05 250)",
  dim: "oklch(0.38 0.05 220)",
  dimlo: "oklch(0.28 0.04 220)",
  cyan: "oklch(0.72 0.22 195)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.78 0.22 80)",
  red: "oklch(0.72 0.22 25)",
  veritas: "oklch(0.72 0.20 160)",
  fg: "oklch(0.85 0.05 210)",
  muted: "oklch(0.5 0.08 220)",
};

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-mono text-[9px] tracking-widest uppercase mb-2 pb-1 border-b"
      style={{ color: C.veritas, borderColor: "oklch(0.18 0.06 160 / 0.5)" }}
    >
      {children}
    </div>
  );
}

function PanelBox({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-none border p-3 ${className}`}
      style={{ background: C.panel, borderColor: C.border }}
    >
      {children}
    </div>
  );
}

function SignalTrustMatrix({
  canon,
  neuro,
  fearM,
}: { canon: any; neuro: any; fearM: any }) {
  const signals = [
    {
      name: "COHERENCE",
      value: canon?.coh ?? 0,
      expected: 0.5,
      trust: Math.max(0, 1 - Math.abs((canon?.coh ?? 0.5) - 0.5) * 2),
    },
    {
      name: "BINDING",
      value: neuro?.bindingCoherence ?? 0,
      expected: 0.5,
      trust: Math.max(
        0,
        1 - Math.abs((neuro?.bindingCoherence ?? 0.5) - 0.5) * 2,
      ),
    },
    {
      name: "PREDICTION",
      value: neuro?.pcActiveInferenceScore ?? 0,
      expected: 0.7,
      trust: Math.min(1, (neuro?.pcActiveInferenceScore ?? 0) + 0.2),
    },
    {
      name: "VAGAL TONE",
      value: neuro?.vagalTone ?? 0.5,
      expected: 0.6,
      trust: Math.min(1, (neuro?.vagalTone ?? 0.5) + 0.1),
    },
    {
      name: "SALIENCE",
      value: neuro?.salienceNetworkScore ?? 0,
      expected: 0.5,
      trust: Math.max(
        0,
        1 - Math.abs((neuro?.salienceNetworkScore ?? 0.5) - 0.5) * 2,
      ),
    },
    {
      name: "BDNF",
      value: neuro?.bdnfLevel ?? 0.5,
      expected: 0.5,
      trust: Math.min(1, (neuro?.bdnfLevel ?? 0.5) + 0.2),
    },
    {
      name: "FEAR LEVEL",
      value: fearM?.fearLevel ?? 0,
      expected: 0.2,
      trust: Math.max(0, 1 - (fearM?.fearLevel ?? 0)),
    },
    {
      name: "COURAGE",
      value: fearM?.courageScore ?? 0.5,
      expected: 0.7,
      trust: Math.min(1, (fearM?.courageScore ?? 0.5) + 0.1),
    },
  ];

  const overallTrust =
    signals.reduce((s, sig) => s + sig.trust, 0) / signals.length;

  return (
    <PanelBox>
      <PanelTitle>▸ SIGNAL TRUST MATRIX — VERITAS VALIDATION</PanelTitle>
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="font-mono text-[9px]" style={{ color: C.dim }}>
            OVERALL TRUST SCORE
          </span>
          <span
            className="font-mono text-[11px] font-bold"
            style={{
              color:
                overallTrust > 0.7
                  ? C.green
                  : overallTrust > 0.4
                    ? C.amber
                    : C.red,
            }}
          >
            {(overallTrust * 100).toFixed(1)}%
          </span>
        </div>
        <div className="h-2" style={{ background: "oklch(0.12 0.01 265)" }}>
          <div
            className="h-full transition-all duration-700"
            style={{
              width: `${overallTrust * 100}%`,
              background:
                overallTrust > 0.7
                  ? C.veritas
                  : overallTrust > 0.4
                    ? C.amber
                    : C.red,
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {signals.map((sig) => (
          <div key={sig.name} className="flex items-center gap-2">
            <span
              className="font-mono text-[8px] w-20 shrink-0"
              style={{ color: C.dim }}
            >
              {sig.name}
            </span>
            <div
              className="w-16 h-1.5"
              style={{ background: "oklch(0.12 0.01 265)" }}
            >
              <div
                className="h-full transition-all duration-700"
                style={{
                  width: `${sig.value * 100}%`,
                  background:
                    sig.trust > 0.7
                      ? C.veritas
                      : sig.trust > 0.4
                        ? C.amber
                        : C.red,
                }}
              />
            </div>
            <span
              className="font-mono text-[8px] w-12 text-right shrink-0"
              style={{ color: C.fg }}
            >
              {(sig.value * 100).toFixed(1)}%
            </span>
            <div
              className="px-1 font-mono text-[7px] font-bold"
              style={{
                background: sig.trust > 0.7 ? `${C.green}20` : `${C.red}20`,
                color: sig.trust > 0.7 ? C.green : C.red,
              }}
            >
              {sig.trust > 0.7 ? "OK" : "CHK"}
            </div>
          </div>
        ))}
      </div>
    </PanelBox>
  );
}

function SacesiChainPanel({ canon }: { canon: any }) {
  const beat = Number(canon?.b ?? 0);
  const coherence = canon?.coh ?? 0;
  const jasminePass = canon?.jl ?? false;

  // Derive chain health from available signals
  const chainHealth =
    coherence > 0.5 && jasminePass
      ? "VALID"
      : coherence > 0.3
        ? "DEGRADED"
        : "CRITICAL";
  const chainColor =
    chainHealth === "VALID"
      ? C.veritas
      : chainHealth === "DEGRADED"
        ? C.amber
        : C.red;

  const chainMetrics = [
    { label: "CHAIN STATUS", value: chainHealth, color: chainColor },
    { label: "BEAT", value: beat.toLocaleString(), color: C.cyan },
    {
      label: "COHERENCE",
      value: `${(coherence * 100).toFixed(2)}%`,
      color: coherence > 0.75 ? C.green : C.amber,
    },
    {
      label: "JASMINE GATE",
      value: jasminePass ? "PASS" : "FAIL",
      color: jasminePass ? C.green : C.red,
    },
    {
      label: "OMNIS",
      value: canon?.qh != null && canon.qh >= 1.0 ? "FIRING" : "STANDBY",
      color: C.veritas,
    },
  ];

  return (
    <PanelBox>
      <PanelTitle>
        ▸ SACESI CHAIN HEALTH — CRYPTOGRAPHIC VERIFICATION
      </PanelTitle>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {chainMetrics.map(({ label, value, color }) => (
          <div key={label} className="flex flex-col gap-0.5">
            <span
              className="font-mono text-[7px] tracking-widest uppercase"
              style={{ color: C.dim }}
            >
              {label}
            </span>
            <span className="font-mono text-[10px] font-bold" style={{ color }}>
              {value}
            </span>
          </div>
        ))}
      </div>
      <div
        className="p-2 border"
        style={{
          borderColor: `${chainColor}40`,
          background:
            chainHealth === "VALID"
              ? "oklch(0.065 0.012 160)"
              : "oklch(0.07 0.015 25)",
        }}
      >
        <span className="font-mono text-[9px]" style={{ color: C.fg }}>
          {chainHealth === "VALID"
            ? "VERITAS: All signals consistent with SACESI chain. No inconsistencies detected. Organism integrity confirmed."
            : chainHealth === "DEGRADED"
              ? "VERITAS: Signal consistency degraded. Coherence below threshold. Monitoring for recovery."
              : "VERITAS: CRITICAL — Chain integrity compromised. Activating DURA perimeter. RIFT source tracing initiated."}
        </span>
      </div>
    </PanelBox>
  );
}

function NeuroscienceValidationPanel({ neuro }: { neuro: any }) {
  const engines = [
    {
      name: "THALAMOCORTICAL BINDING",
      score: neuro?.bindingCoherence ?? 0,
      ref: "Tononi IIT",
    },
    {
      name: "PREDICTIVE CODING",
      score: neuro?.pcActiveInferenceScore ?? 0,
      ref: "Friston",
    },
    {
      name: "INTEROCEPTION",
      score: neuro?.interceptiveScore ?? 0,
      ref: "Craig/Damasio",
    },
    {
      name: "DEFAULT MODE NETWORK",
      score: neuro?.metaCognitionScore ?? 0,
      ref: "Buckner",
    },
    {
      name: "SALIENCE NETWORK",
      score: neuro?.salienceNetworkScore ?? 0,
      ref: "Menon/Uddin",
    },
    { name: "NEUROPLASTICITY", score: neuro?.bdnfLevel ?? 0, ref: "BCM Rule" },
    {
      name: "CIRCADIAN RHYTHM",
      score: neuro?.circadianCoherence ?? 0,
      ref: "SCN",
    },
  ];

  return (
    <PanelBox>
      <PanelTitle>▸ 7 NEUROSCIENCE ENGINES — VALIDATION STATUS</PanelTitle>
      <div className="flex flex-col gap-1.5">
        {engines.map((eng) => (
          <div key={eng.name} className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{
                background: eng.score > 0.5 ? C.veritas : C.dimlo,
                boxShadow: eng.score > 0.5 ? `0 0 4px ${C.veritas}` : "none",
              }}
            />
            <span
              className="font-mono text-[8px] flex-1"
              style={{ color: C.dim }}
            >
              {eng.name}
            </span>
            <span
              className="font-mono text-[7px] w-16 text-right"
              style={{ color: C.dimlo }}
            >
              {eng.ref}
            </span>
            <span
              className="font-mono text-[9px] font-bold w-12 text-right"
              style={{ color: eng.score > 0.5 ? C.veritas : C.dimlo }}
            >
              {(eng.score * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </PanelBox>
  );
}

export default function VeritasTab() {
  const { data: canon } = useCanonicalState();
  const { data: neuro } = useNeuroscienceState();
  const { data: fearM } = useFearMissionState();
  const { data: obsYield } = useObservationYield();

  const overallTrust =
    [
      neuro?.bindingCoherence ?? 0,
      neuro?.pcActiveInferenceScore ?? 0,
      neuro?.vagalTone ?? 0.5,
      fearM?.courageScore ?? 0.5,
      1 - (fearM?.fearLevel ?? 0),
    ].reduce((s, v) => s + v, 0) / 5;

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: C.bg }}
      data-ocid="veritas.page"
    >
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ background: "oklch(0.065 0.012 160)", borderColor: C.border }}
        data-ocid="veritas.header.panel"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: C.veritas,
              boxShadow: `0 0 10px ${C.veritas}`,
            }}
          />
          <span
            className="font-mono text-lg font-bold tracking-widest"
            style={{ color: C.veritas }}
          >
            VERITAS
          </span>
          <span
            className="font-mono text-[9px] tracking-widest uppercase"
            style={{ color: C.dim }}
          >
            VALIDATION ENGINE
          </span>
        </div>
        <div className="flex items-center gap-4">
          {[
            [
              "TRUST SCORE",
              `${(overallTrust * 100).toFixed(1)}%`,
              overallTrust > 0.7
                ? C.green
                : overallTrust > 0.4
                  ? C.amber
                  : C.red,
            ],
            ["BEAT", Number(canon?.b ?? 0).toLocaleString(), C.cyan],
            [
              "OBS YIELD",
              obsYield
                ? `${Number((obsYield as any).hObs ?? 0).toFixed(3)}`
                : "—",
              C.veritas,
            ],
          ].map(([lbl, val, col]) => (
            <div key={String(lbl)} className="flex flex-col items-center">
              <span
                className="font-mono text-[8px] tracking-widest uppercase"
                style={{ color: C.dim }}
              >
                {lbl}
              </span>
              <span
                className="font-mono text-sm font-bold"
                style={{ color: String(col) }}
              >
                {val}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="flex flex-col gap-3 p-3">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <SacesiChainPanel canon={canon} />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <SignalTrustMatrix canon={canon} neuro={neuro} fearM={fearM} />
          <NeuroscienceValidationPanel neuro={neuro} />
        </motion.div>
      </div>
    </div>
  );
}
