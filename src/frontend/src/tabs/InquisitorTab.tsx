import { useEffect, useState } from "react";
import { useInquisitorState } from "../hooks/useQueries";

const C = {
  bg: "oklch(0.06 0.01 265)",
  panel: "oklch(0.09 0.015 265)",
  border: "oklch(0.2 0.05 255)",
  borderDim: "oklch(0.14 0.03 255)",
  cyan: "oklch(0.72 0.22 195)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.78 0.22 60)",
  red: "oklch(0.65 0.25 25)",
  purple: "oklch(0.65 0.2 285)",
  blue: "oklch(0.62 0.22 240)",
  yellow: "oklch(0.80 0.22 90)",
  orange: "oklch(0.72 0.22 50)",
  gold: "oklch(0.82 0.22 80)",
  dim: "oklch(0.38 0.05 220)",
  mid: "oklch(0.55 0.1 210)",
  text: "oklch(0.85 0.05 210)",
};

const TASK_TYPE_COLORS: Record<string, string> = {
  Math: C.blue,
  PatternSynthesis: C.purple,
  ContradictionResolve: C.orange,
  BiochemEquation: C.green,
  KuramotoOptimize: C.cyan,
  DoctrineFill: C.yellow,
};

type CascadeEvent = {
  type: "task_start" | "task_complete";
  taskType: string;
  prompt: string;
  timestamp: Date;
  beat: number;
};

function LiveDot() {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
      style={{
        background: C.green,
        boxShadow: `0 0 5px ${C.green}`,
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    />
  );
}

function Bar({
  value,
  color,
  height = "h-2",
}: {
  value: number;
  color: string;
  height?: string;
}) {
  return (
    <div
      className={`w-full ${height} rounded-full`}
      style={{ background: "oklch(0.15 0.03 255)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${Math.min(100, value * 100)}%`,
          background: color,
          boxShadow: value > 0.7 ? `0 0 6px ${color}80` : "none",
        }}
      />
    </div>
  );
}

export default function InquisitorTab() {
  const { data } = useInquisitorState();

  const [eventLog, setEventLog] = useState<CascadeEvent[]>([]);
  const [prevHasTask, setPrevHasTask] = useState<boolean | null>(null);
  const [beatCounter, setBeatCounter] = useState(0);

  // Tick beat counter in sync with polling
  useEffect(() => {
    const t = setInterval(() => setBeatCounter((b) => b + 1), 873);
    return () => clearInterval(t);
  }, []);

  // Append cascade events on task state transitions
  useEffect(() => {
    if (!data) return;
    if (prevHasTask === null) {
      setPrevHasTask(data.hasActiveTask);
      return;
    }
    if (!prevHasTask && data.hasActiveTask) {
      // task started
      setEventLog((prev) =>
        [
          {
            type: "task_start" as const,
            taskType: data.activeTaskType,
            prompt: data.activeTaskPrompt,
            timestamp: new Date(),
            beat: beatCounter,
          },
          ...prev,
        ].slice(0, 20),
      );
    } else if (prevHasTask && !data.hasActiveTask) {
      // task completed
      setEventLog((prev) =>
        [
          {
            type: "task_complete" as const,
            taskType: data.activeTaskType,
            prompt: data.activeTaskPrompt || "(completed)",
            timestamp: new Date(),
            beat: beatCounter,
          },
          ...prev,
        ].slice(0, 20),
      );
    }
    setPrevHasTask(data.hasActiveTask);
  }, [data, prevHasTask, beatCounter]);

  const hunger = data?.hungerLevel ?? 0;
  const satisfaction = data?.satisfactionLevel ?? 0;
  const generated = data ? Number(data.totalGenerated) : 0;
  const solved = data ? Number(data.totalSolved) : 0;
  const successRate = generated > 0 ? solved / generated : 0;
  const taskColor = TASK_TYPE_COLORS[data?.activeTaskType ?? ""] ?? C.cyan;
  const hungerColor = hunger > 0.8 ? C.red : hunger > 0.6 ? C.amber : C.mid;

  return (
    <div
      className="h-full overflow-y-auto p-4 space-y-4"
      style={{ background: C.bg }}
      data-ocid="inquisitor.page"
    >
      {/* ── Header ── */}
      <div
        className="border rounded p-4"
        style={{ borderColor: `${C.cyan}60`, background: C.panel }}
        data-ocid="inquisitor.header.panel"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div
              className="font-mono text-[8px] tracking-[0.25em] uppercase mb-0.5"
              style={{ color: C.dim }}
            >
              GOVERNANCE TEAM IX
            </div>
            <h1
              className="font-mono text-[16px] font-bold tracking-widest uppercase"
              style={{ color: C.cyan, textShadow: `0 0 20px ${C.cyan}60` }}
            >
              INQUISITOR PERPETUUS
            </h1>
            <p className="font-mono text-[9px] mt-0.5" style={{ color: C.mid }}>
              9th Sovereign Governance Team — The Ever-Questioning Researcher
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <LiveDot />
            <span
              className="font-mono text-[8px] tracking-widest px-2 py-0.5 rounded-sm"
              style={{
                background: `${C.green}18`,
                color: C.green,
                border: `1px solid ${C.green}40`,
              }}
            >
              LOOP ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* ── Hunger + Satisfaction ── */}
      <div
        className="border rounded p-4"
        style={{ borderColor: C.border, background: C.panel }}
        data-ocid="inquisitor.hunger.panel"
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-3"
          style={{ color: C.dim }}
        >
          HUNGER STATUS
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span
                className="font-mono text-[10px]"
                style={{ color: hungerColor }}
              >
                HUNGER DRIVE
              </span>
              <span
                className="font-mono text-[11px] font-bold"
                style={{ color: hungerColor }}
              >
                {(hunger * 100).toFixed(1)}%
              </span>
            </div>
            <Bar value={hunger} color={hungerColor} height="h-3" />
            {hunger > 0.6 && (
              <p
                className="font-mono text-[8px] mt-1"
                style={{ color: C.amber }}
              >
                ⚠ HIGH DRIVE — Task generation threshold active
              </p>
            )}
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span
                className="font-mono text-[10px]"
                style={{ color: C.green }}
              >
                SATISFACTION
              </span>
              <span
                className="font-mono text-[11px] font-bold"
                style={{ color: C.green }}
              >
                {(satisfaction * 100).toFixed(1)}%
              </span>
            </div>
            <Bar value={satisfaction} color={C.green} height="h-3" />
          </div>
        </div>
      </div>

      {/* ── Active Task ── */}
      <div
        className="border rounded p-4"
        style={{ borderColor: C.border, background: C.panel }}
        data-ocid="inquisitor.active_task.panel"
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-3"
          style={{ color: C.dim }}
        >
          ACTIVE TASK
        </div>
        {data?.hasActiveTask ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-[9px] px-2 py-0.5 rounded-sm font-bold"
                style={{
                  background: `${taskColor}18`,
                  color: taskColor,
                  border: `1px solid ${taskColor}45`,
                }}
              >
                {data.activeTaskType}
              </span>
              <div className="flex items-center gap-1.5">
                <LiveDot />
                <span className="font-mono text-[8px]" style={{ color: C.mid }}>
                  ORGANISM IS WORKING...
                </span>
              </div>
            </div>
            <div
              className="rounded p-3 font-mono text-[9px] leading-relaxed"
              style={{
                background: "oklch(0.07 0.012 265)",
                border: `1px solid ${C.borderDim}`,
                color: C.text,
              }}
              data-ocid="inquisitor.active_task.prompt"
            >
              {data.activeTaskPrompt || "(generating prompt…)"}
            </div>
          </div>
        ) : (
          <div
            className="text-center py-4"
            data-ocid="inquisitor.active_task.empty_state"
          >
            <p
              className="font-mono text-[10px] tracking-widest uppercase"
              style={{ color: C.dim }}
            >
              IDLE — Awaiting hunger threshold
            </p>
            <p
              className="font-mono text-[8px] mt-1"
              style={{ color: "oklch(0.28 0.04 220)" }}
            >
              Task generation activates when hunger drive exceeds threshold
            </p>
          </div>
        )}
      </div>

      {/* ── Stats ── */}
      <div
        className="border rounded p-4"
        style={{ borderColor: C.border, background: C.panel }}
        data-ocid="inquisitor.stats.panel"
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-3"
          style={{ color: C.dim }}
        >
          STATS
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "GENERATED",
              value: generated.toLocaleString(),
              color: C.text,
            },
            { label: "SOLVED", value: solved.toLocaleString(), color: C.green },
            {
              label: "SUCCESS RATE",
              value: `${(successRate * 100).toFixed(1)}%`,
              color:
                successRate > 0.7
                  ? C.green
                  : successRate > 0.4
                    ? C.amber
                    : C.red,
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded p-3 text-center"
              style={{
                background: "oklch(0.07 0.012 265)",
                border: `1px solid ${C.borderDim}`,
              }}
            >
              <div
                className="font-mono text-[16px] font-bold"
                style={{ color }}
              >
                {value}
              </div>
              <div
                className="font-mono text-[7px] tracking-widest uppercase mt-1"
                style={{ color: C.dim }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Task Cascade Events ── */}
      <div
        className="border rounded p-4"
        style={{ borderColor: C.border, background: C.panel }}
        data-ocid="inquisitor.cascade_events.panel"
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-3"
          style={{ color: C.dim }}
        >
          TASK CASCADE EVENTS
        </div>
        {eventLog.length === 0 ? (
          <div
            className="text-center py-3"
            data-ocid="inquisitor.cascade_events.empty_state"
          >
            <p className="font-mono text-[9px]" style={{ color: C.dim }}>
              Cascade log empty — events appear as tasks start and complete
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {eventLog.slice(0, 5).map((ev, i) => {
              const evColor = TASK_TYPE_COLORS[ev.taskType] ?? C.cyan;
              const isStart = ev.type === "task_start";
              return (
                <div
                  key={`${ev.timestamp.getTime()}-${i}`}
                  data-ocid={`inquisitor.cascade_events.item.${i + 1}`}
                  className="flex items-start gap-2 py-1.5 px-2 rounded-sm"
                  style={{
                    background: isStart
                      ? `${evColor}08`
                      : "oklch(0.07 0.012 265)",
                    borderLeft: `2px solid ${isStart ? evColor : C.green}60`,
                  }}
                >
                  <span
                    className="font-mono text-[8px] shrink-0 mt-0.5"
                    style={{ color: isStart ? evColor : C.green }}
                  >
                    {isStart ? "▶" : "✓"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className="font-mono text-[8px] font-bold"
                        style={{ color: evColor }}
                      >
                        {ev.taskType}
                      </span>
                      <span
                        className="font-mono text-[7px]"
                        style={{ color: C.dim }}
                      >
                        beat {ev.beat} ·{" "}
                        {ev.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </div>
                    <p
                      className="font-mono text-[8px] truncate"
                      style={{ color: C.mid }}
                    >
                      {ev.prompt}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
