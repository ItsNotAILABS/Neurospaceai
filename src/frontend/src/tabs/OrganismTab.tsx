import { Suspense, lazy, useState } from "react";
import {
  useCanonicalState,
  useDoctorReport,
  useEcologyState,
  useNeuroChem,
  useVitalSubstrate,
} from "../hooks/useQueries";

const Connectome3D = lazy(() => import("./Connectome3D"));

const C = {
  bg: "oklch(0.06 0.01 265)",
  panel: "oklch(0.09 0.015 265)",
  border: "oklch(0.2 0.05 255)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.82 0.22 80)",
  green: "oklch(0.68 0.28 140)",
  dim: "oklch(0.38 0.05 220)",
  text: "oklch(0.85 0.05 210)",
  amber: "oklch(0.78 0.22 80)",
  red: "oklch(0.65 0.25 25)",
};

function Bar({
  value,
  color,
  label,
  max = 1,
}: { value: number; color: string; label: string; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between">
        <span
          className="font-mono text-[8px] tracking-widest uppercase"
          style={{ color: C.dim }}
        >
          {label}
        </span>
        <span className="font-mono text-[9px]" style={{ color }}>
          {value.toFixed(3)}
        </span>
      </div>
      <div
        className="w-full h-1.5 rounded-full"
        style={{ background: "oklch(0.15 0.03 255)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div
      className="h-4 w-full rounded animate-pulse"
      style={{ background: "oklch(0.12 0.02 255)" }}
    />
  );
}

const HZ_LABELS = [
  "IDENTITY",
  "MISSION",
  "BODY",
  "WORLD",
  "SOCIAL",
  "COGNITION",
  "GOALS",
  "MEMORY",
  "CONSEQUENCE",
  "ADAPTATION",
  "TEMPORAL",
  "EVALUATION",
];

export default function OrganismTab() {
  const [fullscreen, setFullscreen] = useState(false);
  const canonicalQ = useCanonicalState();
  const doctorQ = useDoctorReport();
  const neuroChemQ = useNeuroChem();
  const vitalQ = useVitalSubstrate();
  const ecologyQ = useEcologyState();

  const c = canonicalQ.data;
  const doc = doctorQ.data;
  const nc = neuroChemQ.data;
  const vital = vitalQ.data;
  const eco = ecologyQ.data;

  const isOmnis = c?.eg ?? false;
  const coh = c?.coh ?? 0;
  const isCritical = coh < 0.3;
  const glowColor = isOmnis ? C.cyan : isCritical ? C.red : C.green;

  const healthColor = (v: number) =>
    v > 0.7 ? C.green : v > 0.4 ? C.amber : C.red;
  const docStatus = doc
    ? Number(doc.sh) === 0
      ? "HEALTHY"
      : Number(doc.sh) === 1
        ? "WARNING"
        : "CRITICAL"
    : "—";
  const docStatusColor = doc
    ? Number(doc.sh) === 0
      ? C.green
      : Number(doc.sh) === 1
        ? C.amber
        : C.red
    : C.dim;

  return (
    <div
      className="h-full overflow-y-auto p-4 space-y-4"
      style={{
        background: C.bg,
        boxShadow: isOmnis
          ? "inset 0 0 60px oklch(0.72 0.22 195 / 0.08)"
          : "none",
      }}
    >
      {/* Fullscreen connectome overlay */}
      {fullscreen && (
        <div className="fixed inset-0 z-50" style={{ background: "#050811" }}>
          <Suspense
            fallback={
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  color: C.dim,
                  fontFamily: "monospace",
                  fontSize: "10px",
                }}
              >
                LOADING CONNECTOME…
              </div>
            }
          >
            <Connectome3D fullscreen />
          </Suspense>
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 border z-10"
            style={{
              borderColor: C.cyan,
              color: C.cyan,
              background: "oklch(0.06 0.01 265 / 0.9)",
            }}
            data-ocid="organism.connectome.close_button"
          >
            ⊟ COLLAPSE
          </button>
        </div>
      )}

      {/* 3D Connectome panel */}
      <div
        className="border rounded overflow-hidden relative"
        style={{
          borderColor: isOmnis ? C.cyan : C.border,
          background: "#050811",
          boxShadow: isOmnis ? "0 0 20px oklch(0.72 0.22 195 / 0.2)" : "none",
        }}
      >
        <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
          <span
            className="font-mono text-[8px] tracking-widest"
            style={{ color: C.dim }}
          >
            3D CONNECTOME — LIVE
          </span>
          <button
            type="button"
            onClick={() => setFullscreen(true)}
            className="font-mono text-[8px] tracking-widest uppercase px-2 py-1 border"
            style={{
              borderColor: C.border,
              color: C.dim,
              background: "oklch(0.06 0.01 265 / 0.8)",
            }}
            data-ocid="organism.connectome.open_modal_button"
          >
            ⊞ FULL VIEW
          </button>
        </div>
        <Suspense
          fallback={
            <div
              style={{
                height: "280px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "monospace",
                fontSize: "10px",
                color: "#334",
              }}
            >
              INITIALIZING CONNECTOME…
            </div>
          }
        >
          <Connectome3D fullscreen={false} />
        </Suspense>
      </div>

      {/* Core metrics */}
      <div
        className="border rounded p-4"
        style={{
          borderColor: isOmnis ? C.cyan : C.border,
          background: C.panel,
          boxShadow: isOmnis ? "0 0 20px oklch(0.72 0.22 195 / 0.2)" : "none",
        }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-3"
          style={{ color: C.dim }}
        >
          ORGANISM CORE STATE — LIVE
        </div>
        {c ? (
          <>
            <div className="mb-4">
              <div className="flex justify-between items-end mb-1">
                <span
                  className="font-mono text-[9px] tracking-widest uppercase"
                  style={{ color: C.dim }}
                >
                  COHERENCE
                </span>
                <span
                  className="font-mono text-[22px] font-bold"
                  style={{
                    color: glowColor,
                    textShadow: `0 0 20px ${glowColor}`,
                  }}
                >
                  {coh.toFixed(4)}
                </span>
              </div>
              <div
                className="w-full h-3 rounded-full"
                style={{ background: "oklch(0.15 0.03 255)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${coh * 100}%`,
                    background: glowColor,
                    boxShadow: `0 0 8px ${glowColor}`,
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Bar value={c.es} color={C.cyan} label="EMERGENCE" />
              <Bar value={c.ic} color={C.gold} label="IDENTITY COH" />
              <Bar value={c.ar} color={C.amber} label="AROUSAL" />
              <Bar value={c.fe} color={C.red} label="FREE ENERGY" />
              <Bar value={c.kf} color={C.green} label="kfHz SYNC" />
              <Bar value={c.qh} color={"oklch(0.72 0.22 280)"} label="Q-HIVE" />
            </div>
            <div
              className="mt-3 pt-3 border-t flex items-center justify-between"
              style={{ borderColor: C.border }}
            >
              <span
                className="font-mono text-[9px] tracking-widest uppercase"
                style={{ color: C.dim }}
              >
                BEAT
              </span>
              <span
                className="font-mono text-[13px] font-bold"
                style={{ color: C.cyan }}
              >
                {Number(c.b).toLocaleString()}
              </span>
              <span
                className="font-mono text-[9px] tracking-widest uppercase"
                style={{ color: C.dim }}
              >
                EXPRESSION GATE
              </span>
              <span
                className="font-mono text-[11px] font-bold"
                style={{ color: c.eg ? C.green : C.dim }}
              >
                {c.eg ? "OPEN" : "CLOSED"}
              </span>
            </div>
          </>
        ) : (
          <Skeleton />
        )}
      </div>

      {/* Doctor report */}
      <div
        className="border rounded p-4"
        style={{ borderColor: C.border, background: C.panel }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-3"
          style={{ color: C.dim }}
        >
          DOCTOR AGENT
        </div>
        {doc ? (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="font-mono text-[8px]" style={{ color: C.dim }}>
                STATUS
              </div>
              <div
                className="font-mono text-[12px] font-bold"
                style={{ color: docStatusColor }}
              >
                {docStatus}
              </div>
            </div>
            <div>
              <div className="font-mono text-[8px]" style={{ color: C.dim }}>
                SCANS
              </div>
              <div
                className="font-mono text-[12px] font-bold"
                style={{ color: C.cyan }}
              >
                {Number(doc.scan).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="font-mono text-[8px]" style={{ color: C.dim }}>
                CRITICAL
              </div>
              <div
                className="font-mono text-[12px] font-bold"
                style={{ color: doc.cc > 0 ? C.red : C.green }}
              >
                {Number(doc.cc)}
              </div>
            </div>
          </div>
        ) : (
          <Skeleton />
        )}
      </div>

      {/* Neurotransmitters */}
      <div
        className="border rounded p-4 space-y-2"
        style={{ borderColor: C.border, background: C.panel }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-2"
          style={{ color: C.dim }}
        >
          NEUROTRANSMITTERS
        </div>
        {nc ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <Bar value={nc.dpa} color={C.gold} label="DOPAMINE" />
            <Bar value={nc.ser} color={C.cyan} label="SEROTONIN" />
            <Bar value={nc.nor} color={C.amber} label="NOREPINEPHRINE" />
            <Bar value={nc.ach} color={C.green} label="ACETYLCHOLINE" />
            <Bar value={nc.gab} color={"oklch(0.72 0.22 280)"} label="GABA" />
            <Bar
              value={nc.glu}
              color={"oklch(0.72 0.22 320)"}
              label="GLUTAMATE"
            />
            <Bar value={nc.cor} color={C.red} label="CORTISOL" />
            <Bar
              value={nc.oxt}
              color={"oklch(0.72 0.22 160)"}
              label="OXYTOCIN"
            />
          </div>
        ) : (
          <Skeleton />
        )}
      </div>

      {/* Vital organs */}
      <div
        className="border rounded p-4 space-y-2"
        style={{ borderColor: C.border, background: C.panel }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-2"
          style={{ color: C.dim }}
        >
          VITAL ORGANS
        </div>
        {vital ? (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <Bar
                value={vital.heart}
                color={healthColor(vital.heart)}
                label="HEART"
              />
              <Bar
                value={vital.lung}
                color={healthColor(vital.lung)}
                label="LUNG"
              />
              <Bar
                value={vital.liver}
                color={healthColor(vital.liver)}
                label="LIVER"
              />
              <Bar
                value={vital.kidney}
                color={healthColor(vital.kidney)}
                label="KIDNEY"
              />
              <Bar
                value={vital.immune}
                color={healthColor(vital.immune)}
                label="IMMUNE"
              />
              <Bar value={vital.threat} color={C.red} label="THREAT LEVEL" />
            </div>
            {vital.aegisLock && (
              <div
                className="mt-2 font-mono text-[9px] tracking-widest uppercase text-center py-1 rounded"
                style={{
                  color: C.red,
                  background: "oklch(0.65 0.25 25 / 0.1)",
                  border: `1px solid ${C.red}`,
                }}
              >
                ⚠ AEGIS LOCK ACTIVE — BEAT{" "}
                {Number(vital.aegisBeat).toLocaleString()}
              </div>
            )}
          </>
        ) : (
          <Skeleton />
        )}
      </div>

      {/* Hz nodes */}
      <div
        className="border rounded p-4"
        style={{ borderColor: C.border, background: C.panel }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-3"
          style={{ color: C.dim }}
        >
          12 Hz SUBSTRATE NODES
        </div>
        {eco ? (
          <div className="grid grid-cols-4 gap-2">
            {eco.freqs.slice(0, 12).map((freq, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static array
              <div key={i} className="space-y-1 text-center">
                <div
                  className="font-mono text-[7px] tracking-widest"
                  style={{ color: C.dim }}
                >
                  {HZ_LABELS[i] ?? `N${i}`}
                </div>
                <div
                  className="mx-auto rounded-full flex items-center justify-center"
                  style={{
                    width: "36px",
                    height: "36px",
                    border: `1px solid oklch(0.72 0.22 195 / ${Math.min(1, freq)})`,
                    background: `oklch(0.72 0.22 195 / ${Math.min(0.3, freq * 0.3)})`,
                    boxShadow:
                      freq > 0.7
                        ? "0 0 8px oklch(0.72 0.22 195 / 0.5)"
                        : "none",
                  }}
                >
                  <span
                    className="font-mono text-[8px] font-bold"
                    style={{ color: C.cyan }}
                  >
                    {freq.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Skeleton />
        )}
      </div>
    </div>
  );
}
