// OperatorTerminalTab.tsx — Sovereign Operator Terminal
// TOP SECRET PROPRIETARY — Alfredo Medina Hernandez, Dallas TX 2026
// Pure signal. No decoration. The operator sees the organism's actual live mind state.
import { useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";

// ── Terminal color palette ────────────────────────────────────────────────────
const T = {
  bg: "#000000",
  panelBg: "#020202",
  headerBg: "#040404",
  green: "#00ff41",
  greenDim: "#006d1a",
  greenGlow: "rgba(0,255,65,0.15)",
  cyan: "#00e5ff",
  cyanDim: "#005f69",
  red: "#ff2020",
  redDim: "#5c0000",
  amber: "#ffaa00",
  dim: "#2a4a2e",
  dimText: "#3d6b42",
  gridLine: "#0d1a0e",
  border: "#0a2b0e",
  borderBright: "#00ff4160",
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface LawProof {
  id: string;
  name: string;
  passed: boolean;
  hash: string;
}

interface ADRETraceEntry {
  beat: bigint | number;
  forwardInput: string;
  backCheckPassed: number;
  resonanceOutput: string;
  compressOutput: string;
  gateOpen: boolean;
  confidence: number;
}

interface MonologueEntry {
  beat: bigint | number;
  thought: string;
  isOmnis: boolean;
  isViolation: boolean;
}

interface OperatorSnapshot {
  beat: bigint | number;
  coherence: number;
  rValue: number;
  gatePass: boolean;
  adreTrace: ADRETraceEntry[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatHash(h: string | number | undefined): string {
  if (!h) return "00000000";
  const s = String(h);
  // If it's a number, convert to hex
  if (!Number.isNaN(Number(h))) {
    return Number(h).toString(16).toUpperCase().padStart(8, "0").slice(0, 8);
  }
  return s.slice(0, 8).toUpperCase();
}

function shortBeat(b: bigint | number | undefined): string {
  if (b === undefined || b === null) return "--------";
  return String(b).padStart(8, "0");
}

// ── Flicker hook — brief opacity flash on data update ─────────────────────────
function useFlicker(dep: unknown): boolean {
  const [flickering, setFlickering] = useState(false);
  const prevRef = useRef(dep);
  useEffect(() => {
    if (prevRef.current !== dep) {
      prevRef.current = dep;
      setFlickering(true);
      const t = setTimeout(() => setFlickering(false), 120);
      return () => clearTimeout(t);
    }
  }, [dep]);
  return flickering;
}

// ── Status Bar ────────────────────────────────────────────────────────────────
function StatusBar({
  beat,
  coherence,
  rValue,
  gatePass,
  sovereignActive,
  connected,
}: {
  beat: number;
  coherence: number;
  rValue: number;
  gatePass: boolean;
  sovereignActive: boolean;
  connected: boolean;
}) {
  const flickerBeat = useFlicker(beat);

  return (
    <div
      className="flex items-center gap-0 shrink-0 border-b font-mono overflow-x-auto"
      style={{
        background: T.headerBg,
        borderColor: T.border,
        height: "28px",
        scrollbarWidth: "none",
      }}
      data-ocid="operator.status_bar.panel"
    >
      {/* Terminal label */}
      <span
        className="px-3 text-[9px] tracking-[0.18em] font-bold shrink-0 border-r"
        style={{ color: T.green, borderColor: T.border }}
      >
        OPERATOR TERMINAL v1
      </span>

      {/* Separator helper */}
      {(
        [
          {
            label: "BEAT",
            value: shortBeat(beat),
            color: flickerBeat ? T.amber : T.cyan,
          },
          {
            label: "COHERENCE",
            value: coherence.toFixed(4),
            color:
              coherence > 0.87 ? T.green : coherence > 0.6 ? T.amber : T.red,
          },
          {
            label: "R",
            value: rValue.toFixed(4),
            color: rValue > 0.87 ? T.green : rValue > 0.6 ? T.amber : T.red,
          },
          {
            label: "GATE",
            value: gatePass ? "PASS" : "FAIL",
            color: gatePass ? T.green : T.red,
          },
        ] as const
      ).map(({ label, value, color }, i) => (
        <div
          key={label}
          className="flex items-center gap-1.5 px-3 h-full shrink-0 border-r"
          style={{ borderColor: T.border }}
        >
          <span
            className="text-[8px] tracking-[0.15em]"
            style={{ color: T.dimText }}
          >
            {label}:
          </span>
          <span
            className="text-[9px] font-bold tracking-[0.1em]"
            style={{
              color,
              textShadow: i > 0 ? `0 0 6px ${color}80` : "none",
              transition: "color 0.2s",
            }}
          >
            {value}
          </span>
        </div>
      ))}

      {/* Connection status */}
      <div
        className="flex items-center gap-1.5 px-3 h-full shrink-0 border-r"
        style={{ borderColor: T.border }}
      >
        <span
          className="inline-block w-[5px] h-[5px] rounded-full"
          style={{
            background: connected ? T.green : T.dim,
            boxShadow: connected ? `0 0 4px ${T.green}` : "none",
          }}
        />
        <span
          className="text-[8px]"
          style={{ color: connected ? T.greenDim : T.dim }}
        >
          {connected ? "LIVE" : "CONNECTING"}
        </span>
      </div>

      {/* Sovereign indicator */}
      {sovereignActive && (
        <div
          className="flex items-center gap-1.5 px-3 h-full shrink-0 border-r"
          style={{ borderColor: T.borderBright }}
          data-ocid="operator.sovereign_active.indicator"
        >
          <span
            className="text-[8px] tracking-[0.2em] font-bold"
            style={{
              color: T.green,
              textShadow: `0 0 8px ${T.green}`,
              animation: "terminal-cursor 2s ease-in-out infinite",
            }}
          >
            ◆ SOVEREIGN VIEW ACTIVE
          </span>
        </div>
      )}
    </div>
  );
}

// ── Law Enforcement Column ────────────────────────────────────────────────────
function LawEnforcementColumn({
  laws,
  beat,
  loading,
}: {
  laws: LawProof[];
  beat: number;
  loading: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="flex flex-col border-r h-full"
      style={{ borderColor: T.border, minWidth: 0 }}
      data-ocid="operator.law_proofs.panel"
    >
      {/* Column header */}
      <div
        className="font-mono text-[8px] tracking-[0.2em] px-2 py-1.5 border-b shrink-0 flex items-center justify-between"
        style={{
          background: T.headerBg,
          borderColor: T.border,
          color: T.green,
        }}
      >
        <span>60 LAW PROOFS</span>
        <span style={{ color: T.dimText }}>[{shortBeat(beat)}]</span>
      </div>

      {/* Law list */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto font-mono"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: `${T.dim} transparent`,
        }}
        data-ocid="operator.law_proofs.list"
      >
        {loading && laws.length === 0 ? (
          <div
            className="flex items-center justify-center h-16 text-[8px] tracking-[0.15em]"
            style={{ color: T.dimText }}
            data-ocid="operator.law_proofs.loading_state"
          >
            LOADING LAW REGISTRY…
          </div>
        ) : laws.length === 0 ? (
          <div
            className="flex items-center justify-center h-16 text-[8px] tracking-[0.15em]"
            style={{ color: T.dimText }}
            data-ocid="operator.law_proofs.empty_state"
          >
            AWAITING PROOF BUNDLE…
          </div>
        ) : (
          laws.map((law, i) => (
            <div
              key={law.id}
              className="flex items-center gap-1.5 px-2 py-[2px] border-b"
              style={{
                borderColor: T.gridLine,
                background: i % 2 === 0 ? "transparent" : "#01060180",
              }}
              data-ocid={`operator.law.item.${i + 1}`}
            >
              <span
                className="text-[7px] font-bold w-10 shrink-0"
                style={{ color: law.passed ? T.green : T.red }}
              >
                {law.passed ? "[PASS]" : "[FAIL]"}
              </span>
              <span
                className="text-[7px] w-10 shrink-0 tracking-wide"
                style={{ color: law.passed ? T.greenDim : T.redDim }}
              >
                {law.id}
              </span>
              <span
                className="text-[7px] flex-1 min-w-0 truncate"
                style={{ color: law.passed ? T.green : T.red }}
                title={law.name}
              >
                {law.name}
              </span>
              <span
                className="text-[6px] shrink-0 font-mono"
                style={{ color: T.dimText }}
              >
                {formatHash(law.hash)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── ADRE Trace Entry ──────────────────────────────────────────────────────────
function TraceEntry({ entry }: { entry: ADRETraceEntry }) {
  return (
    <div
      className="border-b px-2 py-1.5 font-mono text-[7.5px]"
      style={{ borderColor: T.gridLine }}
      data-ocid="operator.adre_trace.entry"
    >
      <div className="flex items-center gap-2 mb-1">
        <span style={{ color: T.dimText }}>BEAT:</span>
        <span style={{ color: T.cyan }}>{shortBeat(entry.beat)}</span>
        <span
          className="ml-auto text-[6px] px-1 py-px font-bold"
          style={{
            color: entry.gateOpen ? T.green : T.red,
            background: entry.gateOpen ? `${T.green}15` : `${T.red}15`,
            border: `1px solid ${entry.gateOpen ? T.green : T.red}40`,
          }}
        >
          GATE {entry.gateOpen ? "OPEN" : "CLOSED"}
        </span>
      </div>
      <div className="space-y-[1px]">
        <div className="flex gap-1.5">
          <span style={{ color: T.dimText }}>&#62; FORWARD:</span>
          <span
            className="flex-1 min-w-0 truncate"
            style={{ color: T.green }}
            title={entry.forwardInput}
          >
            {entry.forwardInput || "—"}
          </span>
        </div>
        <div className="flex gap-1.5">
          <span style={{ color: T.dimText }}>&#62; BACK-CHECK:</span>
          <span
            style={{ color: entry.backCheckPassed >= 55 ? T.green : T.amber }}
          >
            laws {entry.backCheckPassed}/60 passed
          </span>
        </div>
        <div className="flex gap-1.5">
          <span style={{ color: T.dimText }}>&#62; RESONANCE:</span>
          <span
            className="flex-1 min-w-0 truncate"
            style={{ color: T.green }}
            title={entry.resonanceOutput}
          >
            {entry.resonanceOutput || "—"}
          </span>
        </div>
        <div className="flex gap-1.5">
          <span style={{ color: T.dimText }}>&#62; COMPRESS:</span>
          <span
            className="flex-1 min-w-0 truncate"
            style={{ color: T.cyan }}
            title={entry.compressOutput}
          >
            {entry.compressOutput || "—"}
          </span>
        </div>
        <div className="flex gap-1.5">
          <span style={{ color: T.dimText }}>&#62; GATE:</span>
          <span style={{ color: entry.gateOpen ? T.green : T.red }}>
            {entry.gateOpen ? "OPEN" : "CLOSED"}
          </span>
          <span style={{ color: T.dimText }}>| confidence:</span>
          <span
            style={{
              color:
                entry.confidence > 0.8
                  ? T.green
                  : entry.confidence > 0.5
                    ? T.amber
                    : T.red,
            }}
          >
            {entry.confidence.toFixed(3)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── ADRE Deliberation Column ──────────────────────────────────────────────────
function ADREColumn({
  trace,
  loading,
}: {
  trace: ADRETraceEntry[];
  loading: boolean;
}) {
  return (
    <div
      className="flex flex-col border-r h-full"
      style={{ borderColor: T.border, minWidth: 0 }}
      data-ocid="operator.adre_trace.panel"
    >
      {/* Header */}
      <div
        className="font-mono text-[8px] tracking-[0.2em] px-2 py-1.5 border-b shrink-0 flex items-center justify-between"
        style={{
          background: T.headerBg,
          borderColor: T.border,
          color: T.green,
        }}
      >
        <span>ADRE DELIBERATION</span>
        <span style={{ color: T.dimText }}>[5-PASS]</span>
      </div>

      {/* Trace entries */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: `${T.dim} transparent`,
        }}
        data-ocid="operator.adre_trace.list"
      >
        {loading && trace.length === 0 ? (
          <div
            className="flex items-center justify-center h-16 font-mono text-[8px] tracking-[0.15em]"
            style={{ color: T.dimText }}
            data-ocid="operator.adre_trace.loading_state"
          >
            AWAITING DELIBERATION CYCLE…
          </div>
        ) : trace.length === 0 ? (
          <div
            className="flex items-center justify-center h-16 font-mono text-[8px] tracking-[0.15em]"
            style={{ color: T.dimText }}
            data-ocid="operator.adre_trace.empty_state"
          >
            NO TRACE DATA YET
          </div>
        ) : (
          trace.map((entry, i) => (
            <TraceEntry key={`${entry.beat}-${i}`} entry={entry} />
          ))
        )}
      </div>
    </div>
  );
}

// ── Monologue Column ──────────────────────────────────────────────────────────
function MonologueColumn({
  entries,
  loading,
}: {
  entries: MonologueEntry[];
  loading: boolean;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const flicker = useFlicker(entries[0]?.beat);

  // Newest at top — no auto-scroll needed
  return (
    <div
      className="flex flex-col h-full"
      style={{ minWidth: 0 }}
      data-ocid="operator.monologue.panel"
    >
      {/* Header */}
      <div
        className="font-mono text-[8px] tracking-[0.2em] px-2 py-1.5 border-b shrink-0 flex items-center justify-between"
        style={{
          background: T.headerBg,
          borderColor: T.border,
          color: T.green,
        }}
      >
        <span>LIVE MIND STATE</span>
        <span
          className="text-[7px]"
          style={{
            color: flicker ? T.green : T.dimText,
            transition: "color 0.15s",
          }}
        >
          {entries.length} THOUGHTS
        </span>
      </div>

      {/* Entries — newest first */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto font-mono"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: `${T.dim} transparent`,
        }}
        data-ocid="operator.monologue.list"
      >
        {loading && entries.length === 0 ? (
          <div
            className="flex items-center justify-center h-16 text-[8px] tracking-[0.15em]"
            style={{ color: T.dimText }}
            data-ocid="operator.monologue.loading_state"
          >
            STREAMING MIND STATE…
          </div>
        ) : entries.length === 0 ? (
          <div
            className="flex items-center justify-center h-16 text-[8px] tracking-[0.15em]"
            style={{ color: T.dimText }}
            data-ocid="operator.monologue.empty_state"
          >
            AWAITING FIRST THOUGHT…
          </div>
        ) : (
          entries.map((entry, i) => {
            const thoughtColor = entry.isViolation
              ? T.red
              : entry.isOmnis
                ? T.cyan
                : T.green;
            return (
              <div
                key={`${entry.beat}-${i}`}
                className="flex gap-1.5 px-2 py-[3px] border-b text-[7.5px]"
                style={{
                  borderColor: T.gridLine,
                  background: entry.isViolation
                    ? `${T.red}06`
                    : entry.isOmnis
                      ? `${T.cyan}05`
                      : i === 0
                        ? `${T.green}05`
                        : "transparent",
                  opacity: i === 0 && flicker ? 0.6 : 1,
                  transition: "opacity 0.12s",
                }}
                data-ocid={`operator.monologue.item.${i + 1}`}
              >
                <span className="shrink-0" style={{ color: T.dimText }}>
                  [{shortBeat(entry.beat)}]
                </span>
                <span
                  className="flex-1 min-w-0 break-words leading-relaxed"
                  style={{ color: thoughtColor }}
                >
                  {entry.thought}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── Normaliser — parse raw backend shapes into known types ────────────────────
function parseLaws(raw: unknown): LawProof[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item: unknown, i: number) => {
    const obj = item as Record<string, unknown>;
    return {
      id: (obj.id as string) ?? `L-${String(i + 1).padStart(2, "0")}`,
      name: (obj.name as string) ?? (obj.lawName as string) ?? `LAW_${i + 1}`,
      passed: Boolean(obj.passed ?? obj.pass ?? obj.gatePass ?? true),
      hash: String(obj.hash ?? obj.sacesiHash ?? obj.provenanceHash ?? i),
    };
  });
}

function parseTrace(raw: unknown): ADRETraceEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, 5).map((item: unknown) => {
    const obj = item as Record<string, unknown>;
    return {
      beat: (obj.beat as bigint | number) ?? 0,
      forwardInput: String(obj.forwardInput ?? obj.input ?? obj.action ?? ""),
      backCheckPassed: Number(
        obj.backCheckPassed ?? obj.lawsPassed ?? obj.passes ?? 60,
      ),
      resonanceOutput: String(obj.resonanceOutput ?? obj.resonance ?? ""),
      compressOutput: String(obj.compressOutput ?? obj.compressed ?? ""),
      gateOpen: Boolean(obj.gateOpen ?? obj.gateResult ?? obj.gatePass ?? true),
      confidence: Number(
        obj.confidence ?? obj.finalConfidence ?? obj.confidenceScore ?? 1,
      ),
    };
  });
}

function parseMonologue(raw: unknown): MonologueEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, 20).map((item: unknown) => {
    const obj = item as Record<string, unknown>;
    const thought = String(
      obj.thought ?? obj.text ?? obj.message ?? obj.entry ?? "",
    );
    return {
      beat: (obj.beat as bigint | number) ?? 0,
      thought,
      isOmnis:
        Boolean(obj.isOmnis ?? obj.omnis) ||
        thought.toUpperCase().includes("OMNIS"),
      isViolation:
        Boolean(obj.isViolation ?? obj.violation) ||
        thought.toUpperCase().includes("VIOLATION") ||
        thought.toUpperCase().includes("FAIL"),
    };
  });
}

function parseSnapshot(raw: unknown): OperatorSnapshot | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  return {
    beat: (obj.beat as bigint | number) ?? (obj.b as bigint | number) ?? 0,
    coherence: Number(obj.coherence ?? obj.coh ?? 0),
    rValue: Number(obj.rValue ?? obj.r ?? obj.kuramotoR ?? 0),
    gatePass: Boolean(obj.gatePass ?? obj.gate ?? true),
    adreTrace: parseTrace(obj.adreTrace ?? obj.trace ?? []),
  };
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function OperatorTerminalTab() {
  const { actor, isFetching } = useActor();
  const [snapshot, setSnapshot] = useState<OperatorSnapshot | null>(null);
  const [laws, setLaws] = useState<LawProof[]>([]);
  const [monologue, setMonologue] = useState<MonologueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!actor || isFetching) return;

    const poll = async () => {
      try {
        const [snapRaw, lawsRaw, monologueRaw] = await Promise.all([
          (actor as Record<string, unknown>).getOperatorSnapshot
            ? (
                actor as unknown as {
                  getOperatorSnapshot: () => Promise<unknown>;
                }
              ).getOperatorSnapshot()
            : Promise.resolve(null),
          (actor as Record<string, unknown>).getLawProofs
            ? (
                actor as unknown as { getLawProofs: () => Promise<unknown> }
              ).getLawProofs()
            : Promise.resolve([]),
          (actor as Record<string, unknown>).getMonologueStream
            ? (
                actor as unknown as {
                  getMonologueStream: () => Promise<unknown>;
                }
              ).getMonologueStream()
            : Promise.resolve([]),
        ]);

        if (!mountedRef.current) return;

        const snap = parseSnapshot(snapRaw);
        if (snap) setSnapshot(snap);
        setLaws(parseLaws(lawsRaw));
        // Prepend newest entries to monologue (newest first)
        setMonologue((prev) => {
          const fresh = parseMonologue(monologueRaw);
          if (fresh.length === 0) return prev;
          // Merge new entries at top, keep total <= 20
          const merged = [...fresh, ...prev].slice(0, 20);
          return merged;
        });
        setLoading(false);
      } catch {
        if (mountedRef.current) setLoading(false);
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 873);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [actor, isFetching]);

  const beat = snapshot ? Number(snapshot.beat) : 0;
  const coherence = snapshot?.coherence ?? 0;
  const rValue = snapshot?.rValue ?? 0;
  const gatePass = snapshot?.gatePass ?? false;
  const adreTrace = snapshot?.adreTrace ?? [];
  const connected = !loading && !!snapshot;

  return (
    <div
      className="flex flex-col h-full overflow-hidden font-mono"
      style={{ background: T.bg }}
      data-ocid="operator.page"
    >
      {/* CSS for terminal animations */}
      <style>{`
        @keyframes terminal-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes terminal-scan {
          0%, 100% { transform: scaleX(0.3); opacity: 0.4; }
          50% { transform: scaleX(1); opacity: 1; }
        }
      `}</style>

      {/* ── Status Bar ─────────────────────────────────────────────────────── */}
      <StatusBar
        beat={beat}
        coherence={coherence}
        rValue={rValue}
        gatePass={gatePass}
        sovereignActive={true}
        connected={connected}
      />

      {/* ── Three-column panel ──────────────────────────────────────────────── */}
      <div
        className="flex flex-1 overflow-hidden min-h-0 border-t"
        style={{ borderColor: T.border }}
        data-ocid="operator.columns.section"
      >
        {/* LEFT — Law Enforcement Proofs (fixed width, scrollable) */}
        <div className="flex flex-col" style={{ width: "32%", minWidth: 0 }}>
          <LawEnforcementColumn laws={laws} beat={beat} loading={loading} />
        </div>

        {/* CENTER — ADRE Reasoning Trace */}
        <div className="flex flex-col" style={{ width: "34%", minWidth: 0 }}>
          <ADREColumn trace={adreTrace} loading={loading} />
        </div>

        {/* RIGHT — Organism Monologue */}
        <div className="flex flex-col" style={{ width: "34%", minWidth: 0 }}>
          <MonologueColumn entries={monologue} loading={loading} />
        </div>
      </div>
    </div>
  );
}
