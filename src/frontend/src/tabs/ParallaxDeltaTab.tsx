// PARALLAX DELTA INTAKE — The organism's immune system for new knowledge.
// Every truth enters through this gate or not at all. The field never destabilizes.
// Polls at 873ms — same sovereign heartbeat as the organism.
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type {
  DeltaRecord,
  FieldType,
  IntelligenceClass,
  RejectionRecord,
} from "../backend.d";
import { useActor } from "../hooks/useActor";

// ── Color palette (mirrors organism dark theme) ──────────────────────────────
const C = {
  bg: "oklch(0.055 0.01 265)",
  panel: "oklch(0.075 0.012 265)",
  panelDeep: "oklch(0.065 0.01 265)",
  border: "oklch(0.18 0.05 250)",
  borderLo: "oklch(0.14 0.04 250)",
  dim: "oklch(0.38 0.05 220)",
  dimlo: "oklch(0.26 0.04 220)",
  fg: "oklch(0.85 0.05 210)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.82 0.22 80)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.78 0.22 65)",
  red: "oklch(0.72 0.22 25)",
  purple: "oklch(0.72 0.22 280)",
  parallax: "oklch(0.74 0.22 165)", // teal-green — distinct from ADRE blue
};

// ── Field type color map ──────────────────────────────────────────────────────
function fieldColor(ft: FieldType | string): string {
  if (ft === "Receptive") return C.cyan;
  if (ft === "Expansive") return C.green;
  if (ft === "AntiDrift") return C.amber;
  return C.dim;
}

function fieldLabel(ft: FieldType | string): string {
  if (ft === "Receptive") return "RECEPTIVE";
  if (ft === "Expansive") return "EXPANSIVE";
  if (ft === "AntiDrift") return "ANTI-DRIFT";
  return String(ft).toUpperCase();
}

function classLabel(ic: IntelligenceClass | string): string {
  return String(ic).toUpperCase();
}

function rejectionLabel(r: string): string {
  const map: Record<string, string> = {
    LawConflict: "LAW CONFLICT",
    CategoryDrift: "CATEGORY DRIFT",
    FieldBoundaryViolation: "FIELD BOUNDARY VIOLATION",
    CoherenceBelow: "COHERENCE BELOW THRESHOLD",
    DoctrineViolation: "DOCTRINE VIOLATION",
  };
  return map[r] ?? r;
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return `${s.slice(0, n)}…`;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function PanelBox({
  children,
  className = "",
  accent,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <div
      className={`border ${className}`}
      style={{
        background: C.panel,
        borderColor: accent ? `${accent}40` : C.border,
        borderTop: accent ? `1px solid ${accent}` : undefined,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  children,
  color = C.parallax,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div
      className="font-mono text-[9px] tracking-widest uppercase px-3 py-2 border-b flex items-center gap-2"
      style={{ color, borderColor: `${color}30`, background: `${color}08` }}
    >
      {children}
    </div>
  );
}

// Drift score badge — color-coded
function DriftBadge({ score }: { score: number }) {
  const color = score < 0.3 ? C.green : score < 0.6 ? C.amber : C.red;
  const label = score < 0.3 ? "STABLE" : score < 0.6 ? "ELEVATED" : "CRITICAL";
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="font-mono text-[7px] tracking-widest uppercase"
        style={{ color: C.dim }}
      >
        DRIFT
      </span>
      <span
        className="font-mono text-sm font-bold"
        style={{ color, textShadow: `0 0 10px ${color}60` }}
      >
        {score.toFixed(4)}
      </span>
      <span
        className="font-mono text-[7px] px-1.5 py-0.5 border font-bold"
        style={{ color, borderColor: `${color}50`, background: `${color}15` }}
      >
        {label}
      </span>
    </div>
  );
}

// Delta record row — accepted intelligence
function DeltaRow({
  record,
  index,
}: {
  record: DeltaRecord;
  index: number;
}) {
  const ft = record.fieldType as string;
  const ic = record.intelligenceClass as string;
  const fColor = fieldColor(ft);
  const rings = record.affectedRings.map(String).join(", ");
  const impact =
    record.coherenceImpact >= 0
      ? `+${record.coherenceImpact.toFixed(4)}`
      : record.coherenceImpact.toFixed(4);
  const impactColor = record.coherenceImpact >= 0 ? C.green : C.red;
  const hash = record.sacesiHash.slice(0, 8);

  return (
    <div
      className="border-b px-3 py-2"
      style={{
        borderColor: C.borderLo,
        background: `${fColor}06`,
      }}
      data-ocid={`parallax.delta.item.${index}`}
    >
      {/* Row header */}
      <div className="flex items-center gap-2 mb-1">
        <span
          className="font-mono text-[8px] shrink-0"
          style={{ color: C.dimlo }}
        >
          [BEAT {String(record.beat)}]
        </span>
        <span
          className="font-mono text-[8px] font-bold flex-1 min-w-0 truncate"
          style={{ color: C.fg }}
        >
          {record.id}
        </span>
        <span
          className="font-mono text-[7px] px-1.5 py-0.5 border shrink-0"
          style={{
            color: fColor,
            borderColor: `${fColor}40`,
            background: `${fColor}10`,
          }}
        >
          {fieldLabel(ft)}
        </span>
        <span
          className="font-mono text-[7px] px-1.5 py-0.5 border shrink-0"
          style={{ color: C.dim, borderColor: C.borderLo }}
        >
          {classLabel(ic)}
        </span>
      </div>

      {/* Rings + impact + hash */}
      <div className="flex items-center gap-3 mb-1">
        <span className="font-mono text-[7px]" style={{ color: C.dimlo }}>
          RINGS: <span style={{ color: C.dim }}>{rings || "—"}</span>
        </span>
        <span className="font-mono text-[7px]" style={{ color: C.dimlo }}>
          IMPACT:{" "}
          <span className="font-bold" style={{ color: impactColor }}>
            {impact}
          </span>
        </span>
        <span className="font-mono text-[7px]" style={{ color: C.dimlo }}>
          HASH: <span style={{ color: C.parallax }}>{hash}</span>
        </span>
      </div>

      {/* Content */}
      <div
        className="font-mono text-[8px] leading-relaxed"
        style={{ color: C.dim }}
        title={record.content}
      >
        {truncate(record.content, 80)}
      </div>
    </div>
  );
}

// Rejection log row
function RejectionRow({
  record,
  index,
}: {
  record: RejectionRecord;
  index: number;
}) {
  const hash = record.sacesiHash.slice(0, 8);
  const reason = rejectionLabel(record.reason as string);

  return (
    <div
      className="border-b px-3 py-2"
      style={{
        borderColor: C.borderLo,
        background: `${C.red}06`,
      }}
      data-ocid={`parallax.rejection.item.${index}`}
    >
      {/* Row header */}
      <div className="flex items-center gap-2 mb-1">
        <span
          className="font-mono text-[8px] shrink-0"
          style={{ color: C.dimlo }}
        >
          [BEAT {String(record.beat)}]
        </span>
        <span
          className="font-mono text-[8px] font-bold"
          style={{ color: C.red }}
        >
          REJECTED
        </span>
        <span
          className="font-mono text-[7px] flex-1 min-w-0 truncate"
          style={{ color: C.dim }}
        >
          — {reason}
        </span>
      </div>

      {/* Violated constant + hash */}
      <div className="flex items-center gap-3 mb-1">
        <span className="font-mono text-[7px]" style={{ color: C.dimlo }}>
          VIOLATED:{" "}
          <span style={{ color: C.amber }}>
            {record.violatedDoctrineConstant}
          </span>
        </span>
        <span className="font-mono text-[7px]" style={{ color: C.dimlo }}>
          HASH: <span style={{ color: C.dim }}>{hash}</span>
        </span>
      </div>

      {/* Content */}
      <div
        className="font-mono text-[8px] leading-relaxed"
        style={{ color: "oklch(0.3 0.04 20)" }}
        title={record.content}
      >
        {truncate(record.content, 60)}
      </div>
    </div>
  );
}

// Submission result display
type SubmitResult = {
  accepted: boolean;
  recordId: string;
  detail: string | null;
} | null;

function SubmitResultBanner({ result }: { result: SubmitResult }) {
  if (!result) return null;
  const color = result.accepted ? C.green : C.red;
  const label = result.accepted ? "ACCEPTED" : "REJECTED";

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-3 py-2 border font-mono"
      style={{
        background: `${color}10`,
        borderColor: `${color}50`,
        borderLeft: `3px solid ${color}`,
      }}
      data-ocid="parallax.submit.success_state"
    >
      <span className="text-[10px] font-bold" style={{ color }}>
        {label}
      </span>
      {result.detail && (
        <span className="text-[8px] ml-2" style={{ color: C.dim }}>
          {result.detail}
        </span>
      )}
      <span className="text-[7px] ml-2" style={{ color: C.dimlo }}>
        ID: {result.recordId.slice(0, 16)}
      </span>
    </motion.div>
  );
}

// Classification legend
function ClassificationLegend() {
  const FIELD_TYPES = [
    { label: "RECEPTIVE", desc: "mineral / inward", color: C.cyan },
    { label: "EXPANSIVE", desc: "water / broadcast", color: C.green },
    { label: "ANTI-DRIFT", desc: "plasma / mediation", color: C.amber },
  ];
  const CLASSES = [
    "DOCTRINE",
    "EMPIRICAL",
    "TEMPORAL",
    "GEOMETRIC",
    "BIOMETRIC",
    "EXTERNAL",
  ];

  return (
    <div
      className="px-3 py-2 border-t flex flex-wrap gap-4 items-center"
      style={{ borderColor: C.borderLo, background: C.panelDeep }}
    >
      <div className="flex items-center gap-2">
        <span
          className="font-mono text-[7px] tracking-widest uppercase"
          style={{ color: C.dimlo }}
        >
          Field Types:
        </span>
        {FIELD_TYPES.map((ft) => (
          <span
            key={ft.label}
            className="font-mono text-[7px] px-1.5 py-0.5 border"
            style={{ color: ft.color, borderColor: `${ft.color}40` }}
          >
            {ft.label}
            <span style={{ color: C.dimlo }}> ({ft.desc})</span>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span
          className="font-mono text-[7px] tracking-widest uppercase"
          style={{ color: C.dimlo }}
        >
          Classes:
        </span>
        {CLASSES.map((c) => (
          <span
            key={c}
            className="font-mono text-[7px] px-1 py-0.5 border"
            style={{ color: C.dim, borderColor: C.borderLo }}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ParallaxDeltaTab() {
  const { actor, isFetching } = useActor();

  // Live state
  const [totalAccepted, setTotalAccepted] = useState<bigint>(0n);
  const [totalRejected, setTotalRejected] = useState<bigint>(0n);
  const [driftScore, setDriftScore] = useState(0);
  const [deltaRecords, setDeltaRecords] = useState<DeltaRecord[]>([]);
  const [rejectionLog, setRejectionLog] = useState<RejectionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Submission state
  const [inputContent, setInputContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const deltaScrollRef = useRef<HTMLDivElement>(null);
  const rejectScrollRef = useRef<HTMLDivElement>(null);

  // ── 873ms poll ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!actor || isFetching) return;

    const poll = async () => {
      try {
        const [snapshot, deltas, rejections] = await Promise.all([
          (
            actor as unknown as {
              getIntakeSnapshot: () => Promise<{
                totalAccepted: bigint;
                totalRejected: bigint;
                currentDriftScore: number;
              }>;
            }
          ).getIntakeSnapshot(),
          (
            actor as unknown as {
              getDeltaRecords: (n: bigint) => Promise<DeltaRecord[]>;
            }
          ).getDeltaRecords(20n),
          (
            actor as unknown as {
              getRejectionLog: (n: bigint) => Promise<RejectionRecord[]>;
            }
          ).getRejectionLog(20n),
        ]);

        if (snapshot) {
          setTotalAccepted(snapshot.totalAccepted ?? 0n);
          setTotalRejected(snapshot.totalRejected ?? 0n);
          setDriftScore(snapshot.currentDriftScore ?? 0);
        }
        if (Array.isArray(deltas)) setDeltaRecords(deltas);
        if (Array.isArray(rejections)) setRejectionLog(rejections);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 873);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [actor, isFetching]);

  // ── Submit intelligence ───────────────────────────────────────────────────
  async function handleSubmit() {
    if (!actor || !inputContent.trim() || submitting) return;
    setSubmitting(true);
    setSubmitResult(null);

    try {
      const result = await (
        actor as unknown as {
          intakeIntelligence: (
            content: string,
            beat: bigint,
            coherence: number,
          ) => Promise<[boolean, string]>;
        }
      ).intakeIntelligence(inputContent.trim(), 0n, 0.5);

      const [accepted, recordId] = result;
      setSubmitResult({
        accepted,
        recordId,
        detail: accepted
          ? "intelligence integrated into doctrine field"
          : "field boundary protected",
      });

      if (accepted) setInputContent("");
    } catch {
      setSubmitResult({
        accepted: false,
        recordId: "ERR",
        detail: "submission error — field gate held",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const isActive = !loading;

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: C.bg }}
      data-ocid="parallax.page"
    >
      {/* ── Header bar ───────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between px-4 py-2.5 border-b shrink-0 flex-wrap gap-2"
        style={{
          background: "oklch(0.063 0.012 200)",
          borderColor: C.border,
        }}
        data-ocid="parallax.header.panel"
      >
        {/* Title */}
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full shrink-0 transition-all"
            style={{
              background: isActive ? C.parallax : C.dimlo,
              boxShadow: isActive ? `0 0 10px ${C.parallax}` : "none",
            }}
          />
          <div>
            <span
              className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase"
              style={{ color: C.parallax }}
            >
              PARALLAX DELTA INTAKE
            </span>
            <p
              className="font-mono text-[7px] tracking-widest mt-0.5"
              style={{ color: C.dimlo }}
            >
              Doctrine-gated intelligence intake — field never destabilizes
            </p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span
              className="font-mono text-[7px] tracking-widest uppercase"
              style={{ color: C.dim }}
            >
              ACCEPTED
            </span>
            <span
              className="font-mono text-base font-bold"
              style={{ color: C.green, textShadow: `0 0 10px ${C.green}50` }}
              data-ocid="parallax.accepted.count"
            >
              {String(totalAccepted)}
            </span>
          </div>
          <span style={{ color: C.borderLo }}>│</span>
          <div className="flex items-center gap-1.5">
            <span
              className="font-mono text-[7px] tracking-widest uppercase"
              style={{ color: C.dim }}
            >
              REJECTED
            </span>
            <span
              className="font-mono text-base font-bold"
              style={{ color: C.red, textShadow: `0 0 10px ${C.red}50` }}
              data-ocid="parallax.rejected.count"
            >
              {String(totalRejected)}
            </span>
          </div>
          <span style={{ color: C.borderLo }}>│</span>
          <DriftBadge score={driftScore} />

          <div
            className="font-mono text-[8px] tracking-[0.15em] px-2 py-0.5 border font-bold"
            style={{
              color: isActive ? C.parallax : C.dimlo,
              borderColor: isActive ? `${C.parallax}50` : C.borderLo,
              background: isActive ? `${C.parallax}10` : "transparent",
            }}
            data-ocid="parallax.status.indicator"
          >
            {loading ? "INITIALIZING" : "● GATE ACTIVE"}
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col gap-3 p-3">
        {/* ── Intel Submission Panel ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <PanelBox accent={C.parallax}>
            <SectionTitle color={C.parallax}>
              ▸ INTELLIGENCE SUBMISSION TERMINAL
            </SectionTitle>
            <div className="p-3 flex flex-col gap-2">
              <textarea
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                placeholder="Enter intelligence content for field intake..."
                rows={3}
                className="w-full font-mono text-[10px] p-2 border resize-none leading-relaxed focus:outline-none transition-colors"
                style={{
                  background: C.panelDeep,
                  borderColor: inputContent.trim()
                    ? `${C.parallax}60`
                    : C.borderLo,
                  color: C.fg,
                  caretColor: C.parallax,
                }}
                data-ocid="parallax.intel.textarea"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                    handleSubmit();
                }}
              />
              <div className="flex items-center justify-between gap-3">
                <span
                  className="font-mono text-[7px]"
                  style={{ color: C.dimlo }}
                >
                  Ctrl+Enter to submit · All truths are gated against 60
                  sovereign laws
                </span>
                <button
                  type="button"
                  disabled={!inputContent.trim() || submitting || !actor}
                  onClick={handleSubmit}
                  className="font-mono text-[9px] tracking-[0.15em] uppercase px-4 py-1.5 border font-bold transition-all shrink-0"
                  style={{
                    color:
                      !inputContent.trim() || submitting ? C.dimlo : C.parallax,
                    borderColor:
                      !inputContent.trim() || submitting
                        ? C.borderLo
                        : `${C.parallax}70`,
                    background:
                      !inputContent.trim() || submitting
                        ? "transparent"
                        : `${C.parallax}12`,
                    cursor:
                      !inputContent.trim() || submitting
                        ? "not-allowed"
                        : "pointer",
                  }}
                  data-ocid="parallax.submit.primary_button"
                >
                  {submitting ? "PROCESSING…" : "SUBMIT TO INTAKE"}
                </button>
              </div>

              {/* Result display */}
              <SubmitResultBanner result={submitResult} />
            </div>
          </PanelBox>
        </motion.div>

        {/* ── Two-column main section ───────────────────────────────────────── */}
        <motion.div
          className="grid grid-cols-1 xl:grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* LEFT — Doctrine Delta Records */}
          <PanelBox>
            <SectionTitle color={C.parallax}>
              ▸ DOCTRINE DELTA RECORDS
              <span
                className="ml-auto font-mono text-[8px] font-bold"
                style={{ color: C.green }}
              >
                {deltaRecords.length} LIVE
              </span>
            </SectionTitle>

            <div
              ref={deltaScrollRef}
              className="overflow-y-auto"
              style={{ maxHeight: "480px" }}
              data-ocid="parallax.delta.list"
            >
              {loading ? (
                <div
                  className="flex items-center justify-center h-24 font-mono text-[9px] tracking-widest"
                  style={{ color: C.dimlo }}
                  data-ocid="parallax.delta.loading_state"
                >
                  LOADING DELTA RECORDS…
                </div>
              ) : deltaRecords.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-24 gap-2"
                  data-ocid="parallax.delta.empty_state"
                >
                  <div
                    className="font-mono text-[9px] tracking-widest"
                    style={{ color: C.dimlo }}
                  >
                    NO DOCTRINE DELTAS YET
                  </div>
                  <div
                    className="font-mono text-[7px]"
                    style={{ color: "oklch(0.22 0.03 200)" }}
                  >
                    Submit intelligence above to initiate intake flow
                  </div>
                </div>
              ) : (
                deltaRecords.map((r, i) => (
                  <DeltaRow key={r.id} record={r} index={i + 1} />
                ))
              )}
            </div>
          </PanelBox>

          {/* RIGHT — Rejection Log */}
          <PanelBox>
            <SectionTitle color={C.red}>
              ▸ REJECTION LOG
              <span
                className="ml-auto font-mono text-[8px] font-bold"
                style={{ color: C.red }}
              >
                {rejectionLog.length} LOGGED
              </span>
            </SectionTitle>

            <div
              ref={rejectScrollRef}
              className="overflow-y-auto"
              style={{ maxHeight: "480px" }}
              data-ocid="parallax.rejection.list"
            >
              {loading ? (
                <div
                  className="flex items-center justify-center h-24 font-mono text-[9px] tracking-widest"
                  style={{ color: C.dimlo }}
                  data-ocid="parallax.rejection.loading_state"
                >
                  LOADING REJECTION LOG…
                </div>
              ) : rejectionLog.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-24 gap-2"
                  data-ocid="parallax.rejection.empty_state"
                >
                  <div
                    className="font-mono text-[9px] tracking-widest"
                    style={{ color: C.dimlo }}
                  >
                    NO REJECTIONS RECORDED
                  </div>
                  <div
                    className="font-mono text-[7px]"
                    style={{ color: "oklch(0.22 0.03 25)" }}
                  >
                    Field is clean — all truths accepted so far
                  </div>
                </div>
              ) : (
                rejectionLog.map((r, i) => (
                  <RejectionRow key={r.id} record={r} index={i + 1} />
                ))
              )}
            </div>
          </PanelBox>
        </motion.div>

        {/* ── Classification Legend ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <PanelBox>
            <ClassificationLegend />
          </PanelBox>
        </motion.div>
      </div>
    </div>
  );
}
