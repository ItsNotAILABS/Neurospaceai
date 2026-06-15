import { motion } from "motion/react";
// COGNUS — Analytics Engine
// Reads live backend signals. Computes momentum, correlations, anomalies.
// Follows the Doctor pattern: receive → parse against full context → produce → feed back.
import { useEffect, useRef, useState } from "react";
import {
  useCanonicalState,
  useCreatorReserve,
  useFearMissionState,
  useMiningState,
  useNeuroscienceState,
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
  teal: "oklch(0.72 0.18 175)",
  fg: "oklch(0.85 0.05 210)",
  muted: "oklch(0.5 0.08 220)",
};

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-mono text-[9px] tracking-widest uppercase mb-2 pb-1 border-b"
      style={{ color: C.teal, borderColor: "oklch(0.18 0.06 175 / 0.5)" }}
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

interface SignalWindow {
  beat: number;
  coherence: number;
  bindingCoherence: number;
  pcActiveInferenceScore: number;
  vagalTone: number;
  salienceNetworkScore: number;
  bdnfLevel: number;
  fearLevel: number;
  consciousnessIndex: number;
}

interface MomentumIndicator {
  label: string;
  current: number;
  prev: number;
  trend: "up" | "down" | "stable";
  color: string;
}

function DomainScalarsPanel({ canon }: { canon: any }) {
  const domains = [
    { label: "IDENTITY", key: "id", val: 0.5 },
    { label: "MISSION", key: "ms", val: 0.5 },
    { label: "COGNITION", key: "cg", val: 0.5 },
    { label: "MEMORY", key: "mm", val: 0.5 },
    { label: "ADAPTATION", key: "ad", val: 0.5 },
    { label: "TEMPORAL", key: "tm", val: 0.5 },
  ];

  const allVals = [
    canon?.coh ?? 0.5,
    canon?.kf ?? 0.5,
    canon?.ar ?? 0.3,
    canon?.fe ?? 0.1,
    canon?.es ?? 0.5,
    canon?.coh ?? 0.5,
  ];

  return (
    <PanelBox>
      <PanelTitle>▸ 12 DOMAIN SCALAR MONITOR</PanelTitle>
      <div className="flex flex-col gap-1.5">
        {domains.map((d, i) => {
          const val = allVals[i] ?? 0.5;
          const color = val > 0.7 ? C.green : val > 0.4 ? C.amber : C.red;
          return (
            <div key={d.key} className="flex items-center gap-2">
              <span
                className="font-mono text-[8px] w-20 shrink-0"
                style={{ color: C.dim }}
              >
                {d.label}
              </span>
              <div
                className="flex-1 h-1.5"
                style={{ background: "oklch(0.12 0.01 265)" }}
              >
                <div
                  className="h-full transition-all duration-700"
                  style={{ width: `${val * 100}%`, background: color }}
                />
              </div>
              <span
                className="font-mono text-[9px] w-12 text-right"
                style={{ color }}
              >
                {(val * 100).toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </PanelBox>
  );
}

function MomentumPanel({ windows }: { windows: SignalWindow[] }) {
  const indicators: MomentumIndicator[] = [
    {
      label: "COH MOMENTUM",
      current: windows[0]?.coherence ?? 0,
      prev: windows[10]?.coherence ?? 0,
      trend: "stable",
      color: C.teal,
    },
    {
      label: "BINDING MOMENTUM",
      current: windows[0]?.bindingCoherence ?? 0,
      prev: windows[10]?.bindingCoherence ?? 0,
      trend: "stable",
      color: C.cyan,
    },
    {
      label: "INFERENCE MOMENTUM",
      current: windows[0]?.pcActiveInferenceScore ?? 0,
      prev: windows[10]?.pcActiveInferenceScore ?? 0,
      trend: "stable",
      color: C.green,
    },
    {
      label: "CONSCIOUSNESS MOMENTUM",
      current: windows[0]?.consciousnessIndex ?? 0,
      prev: windows[10]?.consciousnessIndex ?? 0,
      trend: "stable",
      color: C.amber,
    },
  ].map((ind) => ({
    ...ind,
    trend:
      ind.current > ind.prev + 0.005
        ? "up"
        : ind.current < ind.prev - 0.005
          ? "down"
          : "stable",
  })) as MomentumIndicator[];

  return (
    <PanelBox>
      <PanelTitle>▸ MOMENTUM VECTORS (ROLLING WINDOW)</PanelTitle>
      <div className="flex flex-col gap-2">
        {indicators.map((ind) => (
          <div key={ind.label} className="flex items-center gap-3">
            <span
              className="font-mono text-[8px] w-36 shrink-0"
              style={{ color: C.dim }}
            >
              {ind.label}
            </span>
            <span
              className="font-mono text-lg leading-none"
              style={{
                color:
                  ind.trend === "up"
                    ? C.green
                    : ind.trend === "down"
                      ? C.red
                      : C.muted,
              }}
            >
              {ind.trend === "up" ? "↑" : ind.trend === "down" ? "↓" : "→"}
            </span>
            <span
              className="font-mono text-[10px] font-bold"
              style={{ color: ind.color }}
            >
              {(ind.current * 100).toFixed(1)}%
            </span>
            <span className="font-mono text-[8px]" style={{ color: C.dimlo }}>
              prev: {(ind.prev * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </PanelBox>
  );
}

interface SessionReport {
  beatRange: string;
  avgCoherence: number;
  avgBinding: number;
  avgInference: number;
  anomalies: string[];
  generated: number;
}

function SessionReportPanel({ reports }: { reports: SessionReport[] }) {
  return (
    <PanelBox>
      <PanelTitle>▸ SESSION REPORTS — ACADEMIC FORMAT</PanelTitle>
      <div
        className="flex flex-col gap-2 max-h-80 overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {reports.length === 0 && (
          <span
            className="font-mono text-[9px]"
            style={{ color: C.dimlo }}
            data-ocid="cognus.reports.empty_state"
          >
            Reports generate automatically every 100 beats.
          </span>
        )}
        {reports.map((rpt, i) => (
          <div
            key={rpt.generated}
            className="p-2 border"
            style={{
              borderColor: C.border,
              background: "oklch(0.065 0.01 265)",
            }}
            data-ocid={`cognus.report.item.${i + 1}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className="font-mono text-[9px] font-bold"
                style={{ color: C.teal }}
              >
                BEATS {rpt.beatRange}
              </span>
              <span className="font-mono text-[8px]" style={{ color: C.dimlo }}>
                {new Date(rpt.generated).toLocaleTimeString()}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-1">
              {[
                ["AVG COH", rpt.avgCoherence],
                ["AVG BIND", rpt.avgBinding],
                ["AVG INF", rpt.avgInference],
              ].map(([lbl, val]) => (
                <div key={String(lbl)} className="flex flex-col">
                  <span
                    className="font-mono text-[7px]"
                    style={{ color: C.dim }}
                  >
                    {lbl}
                  </span>
                  <span
                    className="font-mono text-[10px] font-bold"
                    style={{ color: C.fg }}
                  >
                    {(Number(val) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
            {rpt.anomalies.length > 0 && (
              <div className="mt-1">
                {rpt.anomalies.map((a, ai) => (
                  <div
                    key={`anomaly-${String(ai)}`}
                    className="font-mono text-[8px]"
                    style={{ color: C.amber }}
                  >
                    ⚠ {a}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </PanelBox>
  );
}

export default function CognusTab() {
  const { data: canon } = useCanonicalState();
  const { data: neuro } = useNeuroscienceState();
  const { data: fearM } = useFearMissionState();
  const { data: mining } = useMiningState();

  const [windows, setWindows] = useState<SignalWindow[]>([]);
  const [reports, setReports] = useState<SessionReport[]>([]);
  const windowBeatRef = useRef(0);

  useEffect(() => {
    if (!canon) return;
    const beat = Number(canon.b);
    if (beat === windowBeatRef.current) return;
    windowBeatRef.current = beat;

    const win: SignalWindow = {
      beat,
      coherence: canon.coh ?? 0,
      bindingCoherence: neuro?.bindingCoherence ?? 0,
      pcActiveInferenceScore: neuro?.pcActiveInferenceScore ?? 0,
      vagalTone: neuro?.vagalTone ?? 0.5,
      salienceNetworkScore: neuro?.salienceNetworkScore ?? 0,
      bdnfLevel: neuro?.bdnfLevel ?? 0.5,
      fearLevel: fearM?.fearLevel ?? 0,
      consciousnessIndex: neuro?.consciousnessIndex ?? 0,
    };

    setWindows((prev) => [win, ...prev].slice(0, 200));

    // Generate session report every 100 beats
    if (beat > 0 && beat % 100 === 0) {
      setWindows((prevW) => {
        const recent = prevW.slice(0, Math.min(100, prevW.length));
        if (recent.length === 0) return prevW;
        const avg = (key: keyof SignalWindow) =>
          recent.reduce((s, w) => s + Number(w[key]), 0) / recent.length;

        const avgCoh = avg("coherence");
        const avgBind = avg("bindingCoherence");
        const avgInf = avg("pcActiveInferenceScore");
        const anomalies: string[] = [];

        if (avgCoh < 0.5)
          anomalies.push(
            `Coherence below baseline: ${(avgCoh * 100).toFixed(1)}%`,
          );
        if (avg("fearLevel") > 0.5)
          anomalies.push(
            `Elevated fear suppression: ${(avg("fearLevel") * 100).toFixed(1)}%`,
          );
        if (avg("bdnfLevel") < 0.3)
          anomalies.push(
            `BDNF deficiency detected: ${(avg("bdnfLevel") * 100).toFixed(1)}%`,
          );

        const report: SessionReport = {
          beatRange: `${beat - 100}–${beat}`,
          avgCoherence: avgCoh,
          avgBinding: avgBind,
          avgInference: avgInf,
          anomalies,
          generated: Date.now(),
        };

        setReports((prev) => [report, ...prev].slice(0, 20));
        return prevW;
      });
    }
  }, [canon, neuro, fearM]);

  const beat = Number(canon?.b ?? 0);

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: C.bg }}
      data-ocid="cognus.page"
    >
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ background: "oklch(0.065 0.012 175)", borderColor: C.border }}
        data-ocid="cognus.header.panel"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: C.teal, boxShadow: `0 0 10px ${C.teal}` }}
          />
          <span
            className="font-mono text-lg font-bold tracking-widest"
            style={{ color: C.teal }}
          >
            COGNUS
          </span>
          <span
            className="font-mono text-[9px] tracking-widest uppercase"
            style={{ color: C.dim }}
          >
            ANALYTICS ENGINE
          </span>
        </div>
        <div className="flex items-center gap-4">
          {[
            ["BEAT", beat.toLocaleString(), C.cyan],
            ["WINDOWS", windows.length.toString(), C.teal],
            ["REPORTS", reports.length.toString(), C.green],
            [
              "MINING",
              mining ? String((mining as any).miningLevel ?? 0) : "—",
              C.amber,
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
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <DomainScalarsPanel canon={canon} />
          <MomentumPanel windows={windows} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <SessionReportPanel reports={reports} />
        </motion.div>
      </div>
    </div>
  );
}
