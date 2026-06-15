import { motion } from "motion/react";
import { VitalSubstratePanel } from "../components/VitalSubstratePanel";
import {
  useCanonicalState,
  useCoreStates,
  useDoctorReport,
  useEcologyState,
  useMilestoneAlerts,
} from "../hooks/useQueries";
import type { CoreState } from "../types/backendStubs";

// ── colour helpers ──────────────────────────────────────────────────────────
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
  fg: "oklch(0.85 0.05 210)",
  muted: "oklch(0.5 0.08 220)",
};

function MetricLabel({ text }: { text: string }) {
  return (
    <span
      className="font-mono text-[9px] tracking-widest uppercase"
      style={{ color: C.dim }}
    >
      {text}
    </span>
  );
}

function PanelBox({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-none border p-3 ${className}`}
      style={{
        background: C.panel,
        borderColor: C.border,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-mono text-[9px] tracking-widest uppercase mb-2 pb-1 border-b"
      style={{ color: C.cyan, borderColor: "oklch(0.18 0.06 195 / 0.5)" }}
    >
      {children}
    </div>
  );
}

// ── Banner ──────────────────────────────────────────────────────────────────
function SovereignHealthBanner() {
  const { data: doc, isLoading } = useDoctorReport();
  const { data: canon } = useCanonicalState();

  if (isLoading) {
    return (
      <div
        className="w-full px-4 py-3 flex items-center justify-center"
        style={{
          background: "oklch(0.08 0.015 265)",
          borderBottom: `1px solid ${C.border}`,
        }}
        data-ocid="doctor.loading_state"
      >
        <span
          className="font-mono text-[10px] tracking-widest uppercase animate-pulse"
          style={{ color: C.muted }}
        >
          SCANNING SUBSTRATE...
        </span>
      </div>
    );
  }

  const sh = doc ? Number(doc.sh) : 0;
  const statusLabel = sh === 0 ? "HEALTHY" : sh === 1 ? "WARNING" : "CRITICAL";
  const statusColor = sh === 0 ? C.green : sh === 1 ? C.amber : C.red;
  const bannerBg =
    sh === 0
      ? "oklch(0.068 0.012 140)"
      : sh === 1
        ? "oklch(0.072 0.014 80)"
        : "oklch(0.072 0.016 25)";

  const scan = doc ? Number(doc.scan) : 0;
  const cc = doc ? Number(doc.cc) : 0;
  const rd = doc ? `${(doc.rd * 100).toFixed(1)}%` : "—";
  const ds = doc ? `${(doc.ds * 100).toFixed(1)}%` : "—";
  const beatCount = canon ? Number(canon.b) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full px-5 py-3 flex flex-wrap items-center gap-4 border-b"
      style={{ background: bannerBg, borderColor: `${statusColor} / 0.3` }}
      data-ocid="doctor.health.panel"
    >
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{
            background: statusColor,
            boxShadow: `0 0 10px ${statusColor}`,
          }}
        />
        <span
          className="font-mono text-lg font-bold tracking-widest uppercase"
          style={{ color: statusColor }}
        >
          {statusLabel}
        </span>
      </div>

      <div className="h-6 w-px" style={{ background: C.border }} />

      {(
        [
          ["SCAN #", scan.toLocaleString()],
          ["CRITICAL", cc.toString()],
          ["REG DEBT", rd],
          ["DRIFT", ds],
          ["BEAT", beatCount.toLocaleString()],
        ] as [string, string][]
      ).map(([lbl, val]) => (
        <div key={lbl} className="flex flex-col items-center">
          <MetricLabel text={lbl} />
          <span
            className="font-mono text-[13px] font-bold tracking-wider"
            style={{
              color:
                lbl === "CRITICAL" && cc > 0
                  ? C.red
                  : lbl === "DRIFT" && doc && doc.ds > 0.3
                    ? C.amber
                    : C.fg,
            }}
          >
            {val}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

// ── Canonical strip ─────────────────────────────────────────────────────────
function CanonicalStrip() {
  const { data: c } = useCanonicalState();

  const metrics: Array<{ lbl: string; val: string; color: string }> = [
    {
      lbl: "BEAT",
      val: c ? Number(c.b).toLocaleString() : "—",
      color: C.cyan,
    },
    {
      lbl: "COH",
      val: c ? `${(c.coh * 100).toFixed(1)}%` : "—",
      color:
        c?.coh != null && c.coh > 0.75
          ? C.green
          : c?.coh != null && c.coh > 0.5
            ? C.amber
            : C.red,
    },
    {
      lbl: "KF-HZ",
      val: c ? c.kf.toFixed(3) : "—",
      color: C.cyan,
    },
    {
      lbl: "AROUSAL",
      val: c ? c.ar.toFixed(3) : "—",
      color:
        c?.ar != null && c.ar > 0.85
          ? C.red
          : c?.ar != null && c.ar > 0.5
            ? C.amber
            : C.green,
    },
    {
      lbl: "FREE-ENERGY",
      val: c ? c.fe.toFixed(4) : "—",
      color: C.muted,
    },
    {
      lbl: "EMERGENCE",
      val: c ? `${(c.es * 100).toFixed(1)}%` : "—",
      color:
        c?.es != null && c.es > 0.8
          ? C.green
          : c?.es != null && c.es > 0.5
            ? C.amber
            : C.muted,
    },
    {
      lbl: "OMNIS",
      val: c ? (c.qh >= 1.0 ? "FIRING" : "WAIT") : "—",
      color: c?.qh != null && c.qh >= 1.0 ? C.green : C.dimlo,
    },
    {
      lbl: "BOOTSTRAP",
      val: c ? (c.bc ? "DONE" : "INIT") : "—",
      color: c?.bc ? C.green : C.amber,
    },
    {
      lbl: "DRIVE",
      val: c ? Number(c.ad).toString() : "—",
      color: C.cyan,
    },
    {
      lbl: "EXPR-GATE",
      val: c ? (c.eg ? "OPEN" : "CLOSED") : "—",
      color: c?.eg ? C.green : C.dimlo,
    },
  ];

  return (
    <PanelBox data-ocid="doctor.canonical.panel">
      <PanelTitle>▸ CANONICAL STATE STRIP</PanelTitle>
      <div className="flex flex-wrap gap-4">
        {metrics.map(({ lbl, val, color }) => (
          <div key={lbl} className="flex flex-col items-center min-w-[60px]">
            <MetricLabel text={lbl} />
            <span
              className="font-mono text-[12px] font-bold tracking-wider"
              style={{ color }}
            >
              {val}
            </span>
          </div>
        ))}
      </div>
    </PanelBox>
  );
}

// ── Core card ────────────────────────────────────────────────────────────────
function CoreCard({ core, coreIndex }: { core: CoreState; coreIndex: number }) {
  const diag = Number(core.diag);
  const cardColor = !core.active
    ? "oklch(0.1 0.008 265)"
    : diag === 0
      ? "oklch(0.075 0.015 140)"
      : diag <= 2
        ? "oklch(0.08 0.015 80)"
        : "oklch(0.08 0.015 25)";

  const accentColor = !core.active
    ? C.dimlo
    : diag === 0
      ? C.green
      : diag <= 2
        ? C.amber
        : C.red;

  const diagLabels = ["OK", "DRF", "COH", "CNS", "CRT"];

  return (
    <div
      className="flex flex-col p-1.5 border"
      style={{
        width: "78px",
        background: cardColor,
        borderColor: `${accentColor} / 0.3`,
      }}
      data-ocid={`doctor.core.item.${coreIndex + 1}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className="font-mono text-[9px] font-bold tracking-wider"
          style={{ color: accentColor }}
        >
          C-{String(coreIndex).padStart(2, "0")}
        </span>
        {core.vital && (
          <span
            className="font-mono text-[7px]"
            style={{ color: C.cyan }}
            title="Vital substrate"
          >
            ★
          </span>
        )}
      </div>

      <div className="mb-0.5">
        <div className="h-1" style={{ background: "oklch(0.12 0.01 265)" }}>
          <div
            style={{
              width: `${Math.min(100, core.coh)}%`,
              height: "100%",
              background: C.green,
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>

      <div className="mb-1">
        <div className="h-1" style={{ background: "oklch(0.12 0.01 265)" }}>
          <div
            style={{
              width: `${Math.min(100, core.drift)}%`,
              height: "100%",
              background: C.red,
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className="font-mono text-[8px] tracking-wider"
          style={{ color: accentColor }}
        >
          {diagLabels[diag] ?? "?"}
        </span>
        <div
          className="w-[5px] h-[5px] rounded-full"
          style={{
            background: core.active ? accentColor : C.dimlo,
            boxShadow: core.active ? `0 0 4px ${accentColor}` : "none",
          }}
        />
      </div>
    </div>
  );
}

function CoreGrid() {
  const { data: cores, isLoading } = useCoreStates();

  return (
    <PanelBox data-ocid="doctor.cores.panel">
      <PanelTitle>▸ 43-CORE SUBSTRATE GRID</PanelTitle>
      {isLoading ? (
        <div
          className="font-mono text-[9px] tracking-widest uppercase animate-pulse"
          style={{ color: C.muted }}
          data-ocid="doctor.cores.loading_state"
        >
          SCANNING CORES...
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {(cores ?? []).map((core, coreIndex) => (
            <CoreCard
              key={`core-qsi-${String(core.qsi)}`}
              core={core}
              coreIndex={coreIndex}
            />
          ))}
          {(!cores || cores.length === 0) && (
            <span
              className="font-mono text-[9px] tracking-widest uppercase"
              style={{ color: C.muted }}
              data-ocid="doctor.cores.empty_state"
            >
              NO CORE DATA
            </span>
          )}
        </div>
      )}
    </PanelBox>
  );
}

// ── Neural Ecology ───────────────────────────────────────────────────────────
function NeuralEcologyPanel() {
  const { data: eco, isLoading } = useEcologyState();

  const budget = eco?.budget ?? Array(12).fill(0);
  const freqs = eco?.freqs ?? Array(12).fill(0);
  const pressure = eco?.pressure ?? 0;
  const maxBudget = Math.max(...budget, 0.0001);

  return (
    <PanelBox data-ocid="doctor.ecology.panel" className="h-full">
      <PanelTitle>▸ NEURAL ECOLOGY</PanelTitle>

      {isLoading ? (
        <div
          className="font-mono text-[9px] tracking-widest uppercase animate-pulse"
          style={{ color: C.muted }}
          data-ocid="doctor.ecology.loading_state"
        >
          SCANNING ECOLOGY...
        </div>
      ) : (
        <>
          <div className="mb-3">
            <div className="flex justify-between mb-0.5">
              <MetricLabel text="ECOLOGY PRESSURE" />
              <span
                className="font-mono text-[9px] font-bold"
                style={{
                  color:
                    pressure > 0.7 ? C.red : pressure > 0.4 ? C.amber : C.green,
                }}
              >
                {`${(pressure * 100).toFixed(1)}%`}
              </span>
            </div>
            <div
              className="h-1.5"
              style={{ background: "oklch(0.12 0.01 265)" }}
            >
              <div
                style={{
                  width: `${pressure * 100}%`,
                  height: "100%",
                  background:
                    pressure > 0.7 ? C.red : pressure > 0.4 ? C.amber : C.green,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {budget.slice(0, 12).map((b: number, i: number) => (
              <div
                key={`hz-region-H${String(i).padStart(2, "0")}`}
                className="flex items-center gap-2"
              >
                <span
                  className="font-mono text-[8px] w-8 shrink-0"
                  style={{ color: C.dim }}
                >
                  H-{String(i).padStart(2, "0")}
                </span>
                <div
                  className="flex-1 h-1"
                  style={{ background: "oklch(0.12 0.01 265)" }}
                >
                  <div
                    style={{
                      width: `${(b / maxBudget) * 100}%`,
                      height: "100%",
                      background: C.cyan,
                      opacity: 0.85,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
                <span
                  className="font-mono text-[8px] w-12 text-right shrink-0"
                  style={{ color: C.muted }}
                >
                  {freqs[i] != null
                    ? `${(freqs[i] as number).toFixed(2)} Hz`
                    : "—"}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </PanelBox>
  );
}

// ── Milestone Ledger ─────────────────────────────────────────────────────────
function MilestoneLedgerPanel() {
  const { data: m, isLoading } = useMilestoneAlerts();

  const milestones = [
    {
      key: "omnis",
      milestoneLabel: "OMNIS THRESHOLD",
      hit: m?.omnis ?? false,
      beat: m?.omnisB,
      color: C.green,
    },
    {
      key: "emer",
      milestoneLabel: "EMERGENCE EVENT",
      hit: m?.emer ?? false,
      beat: m?.emerB,
      color: C.cyan,
    },
    {
      key: "crit",
      milestoneLabel: "CRITICAL STATE",
      hit: m?.crit ?? false,
      beat: m?.critB,
      color: C.red,
    },
    {
      key: "boot",
      milestoneLabel: "BOOTSTRAP COMPLETE",
      hit: m?.boot ?? false,
      beat: m?.bootB,
      color: C.amber,
    },
  ];

  return (
    <PanelBox data-ocid="doctor.milestones.panel" className="h-full">
      <PanelTitle>▸ MILESTONE LEDGER</PanelTitle>

      {isLoading ? (
        <div
          className="font-mono text-[9px] tracking-widest uppercase animate-pulse"
          style={{ color: C.muted }}
          data-ocid="doctor.milestones.loading_state"
        >
          LOADING LEDGER...
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {milestones.map(({ key, milestoneLabel, hit, beat, color }) => (
            <div
              key={key}
              className="flex items-center gap-3 py-2 border-b"
              style={{
                borderColor: "oklch(0.15 0.03 250)",
                opacity: hit ? 1 : 0.45,
              }}
              data-ocid={`doctor.milestone.${key}.row`}
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  background: hit ? color : "oklch(0.15 0.02 265)",
                  boxShadow: hit ? `0 0 8px ${color}` : "none",
                  border: `1px solid ${hit ? color : "oklch(0.25 0.03 265)"}`,
                }}
              />
              <div className="flex-1">
                <div
                  className="font-mono text-[10px] tracking-widest uppercase font-bold"
                  style={{ color: hit ? color : C.dimlo }}
                >
                  {milestoneLabel}
                </div>
                {hit && beat !== undefined && (
                  <div
                    className="font-mono text-[8px] tracking-wider"
                    style={{ color: C.muted }}
                  >
                    Beat #{Number(beat).toLocaleString()}
                  </div>
                )}
              </div>
              <div
                className="font-mono text-[9px] tracking-widest"
                style={{ color: hit ? color : C.dimlo }}
              >
                {hit ? "✓" : "○"}
              </div>
            </div>
          ))}
        </div>
      )}
    </PanelBox>
  );
}

// ── No-actor fallback ────────────────────────────────────────────────────────
function NoSubstrate() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-16"
      data-ocid="doctor.error_state"
    >
      <div
        className="w-8 h-8 flex items-center justify-center border"
        style={{ borderColor: C.border, color: C.dim }}
      >
        ✕
      </div>
      <span
        className="font-mono text-[11px] tracking-widest uppercase"
        style={{ color: C.dim }}
      >
        CONNECT TO SUBSTRATE
      </span>
      <span
        className="font-mono text-[9px] tracking-widest"
        style={{ color: C.dimlo }}
      >
        Backend not responding — deploy canister first
      </span>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function DoctorTab() {
  const { data: canon, isLoading: canonLoading } = useCanonicalState();

  const showNoData = !canonLoading && canon === null;

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: C.bg }}
      data-ocid="doctor.page"
    >
      <SovereignHealthBanner />

      {showNoData ? (
        <NoSubstrate />
      ) : (
        <div className="flex flex-col gap-3 p-3">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            <CanonicalStrip />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <CoreGrid />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            <NeuralEcologyPanel />
            <MilestoneLedgerPanel />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
          >
            <VitalSubstratePanel />
          </motion.div>
        </div>
      )}
    </div>
  );
}
