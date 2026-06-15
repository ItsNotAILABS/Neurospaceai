import { I as useInquisitorState, r as reactExports, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
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
  dim: "oklch(0.38 0.05 220)",
  mid: "oklch(0.55 0.1 210)",
  text: "oklch(0.85 0.05 210)"
};
const TASK_TYPE_COLORS = {
  Math: C.blue,
  PatternSynthesis: C.purple,
  ContradictionResolve: C.orange,
  BiochemEquation: C.green,
  KuramotoOptimize: C.cyan,
  DoctrineFill: C.yellow
};
function LiveDot() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "inline-block w-1.5 h-1.5 rounded-full shrink-0",
      style: {
        background: C.green,
        boxShadow: `0 0 5px ${C.green}`,
        animation: "pulse 1.5s ease-in-out infinite"
      }
    }
  );
}
function Bar({
  value,
  color,
  height = "h-2"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `w-full ${height} rounded-full`,
      style: { background: "oklch(0.15 0.03 255)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full rounded-full transition-all duration-700",
          style: {
            width: `${Math.min(100, value * 100)}%`,
            background: color,
            boxShadow: value > 0.7 ? `0 0 6px ${color}80` : "none"
          }
        }
      )
    }
  );
}
function InquisitorTab() {
  const { data } = useInquisitorState();
  const [eventLog, setEventLog] = reactExports.useState([]);
  const [prevHasTask, setPrevHasTask] = reactExports.useState(null);
  const [beatCounter, setBeatCounter] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const t = setInterval(() => setBeatCounter((b) => b + 1), 873);
    return () => clearInterval(t);
  }, []);
  reactExports.useEffect(() => {
    if (!data) return;
    if (prevHasTask === null) {
      setPrevHasTask(data.hasActiveTask);
      return;
    }
    if (!prevHasTask && data.hasActiveTask) {
      setEventLog(
        (prev) => [
          {
            type: "task_start",
            taskType: data.activeTaskType,
            prompt: data.activeTaskPrompt,
            timestamp: /* @__PURE__ */ new Date(),
            beat: beatCounter
          },
          ...prev
        ].slice(0, 20)
      );
    } else if (prevHasTask && !data.hasActiveTask) {
      setEventLog(
        (prev) => [
          {
            type: "task_complete",
            taskType: data.activeTaskType,
            prompt: data.activeTaskPrompt || "(completed)",
            timestamp: /* @__PURE__ */ new Date(),
            beat: beatCounter
          },
          ...prev
        ].slice(0, 20)
      );
    }
    setPrevHasTask(data.hasActiveTask);
  }, [data, prevHasTask, beatCounter]);
  const hunger = (data == null ? void 0 : data.hungerLevel) ?? 0;
  const satisfaction = (data == null ? void 0 : data.satisfactionLevel) ?? 0;
  const generated = data ? Number(data.totalGenerated) : 0;
  const solved = data ? Number(data.totalSolved) : 0;
  const successRate = generated > 0 ? solved / generated : 0;
  const taskColor = TASK_TYPE_COLORS[(data == null ? void 0 : data.activeTaskType) ?? ""] ?? C.cyan;
  const hungerColor = hunger > 0.8 ? C.red : hunger > 0.6 ? C.amber : C.mid;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "h-full overflow-y-auto p-4 space-y-4",
      style: { background: C.bg },
      "data-ocid": "inquisitor.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "border rounded p-4",
            style: { borderColor: `${C.cyan}60`, background: C.panel },
            "data-ocid": "inquisitor.header.panel",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[8px] tracking-[0.25em] uppercase mb-0.5",
                    style: { color: C.dim },
                    children: "GOVERNANCE TEAM IX"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h1",
                  {
                    className: "font-mono text-[16px] font-bold tracking-widest uppercase",
                    style: { color: C.cyan, textShadow: `0 0 20px ${C.cyan}60` },
                    children: "INQUISITOR PERPETUUS"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] mt-0.5", style: { color: C.mid }, children: "9th Sovereign Governance Team — The Ever-Questioning Researcher" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LiveDot, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] tracking-widest px-2 py-0.5 rounded-sm",
                    style: {
                      background: `${C.green}18`,
                      color: C.green,
                      border: `1px solid ${C.green}40`
                    },
                    children: "LOOP ACTIVE"
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-4",
            style: { borderColor: C.border, background: C.panel },
            "data-ocid": "inquisitor.hunger.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-3",
                  style: { color: C.dim },
                  children: "HUNGER STATUS"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[10px]",
                        style: { color: hungerColor },
                        children: "HUNGER DRIVE"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[11px] font-bold",
                        style: { color: hungerColor },
                        children: [
                          (hunger * 100).toFixed(1),
                          "%"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: hunger, color: hungerColor, height: "h-3" }),
                  hunger > 0.6 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-mono text-[8px] mt-1",
                      style: { color: C.amber },
                      children: "⚠ HIGH DRIVE — Task generation threshold active"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[10px]",
                        style: { color: C.green },
                        children: "SATISFACTION"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[11px] font-bold",
                        style: { color: C.green },
                        children: [
                          (satisfaction * 100).toFixed(1),
                          "%"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: satisfaction, color: C.green, height: "h-3" })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-4",
            style: { borderColor: C.border, background: C.panel },
            "data-ocid": "inquisitor.active_task.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-3",
                  style: { color: C.dim },
                  children: "ACTIVE TASK"
                }
              ),
              (data == null ? void 0 : data.hasActiveTask) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[9px] px-2 py-0.5 rounded-sm font-bold",
                      style: {
                        background: `${taskColor}18`,
                        color: taskColor,
                        border: `1px solid ${taskColor}45`
                      },
                      children: data.activeTaskType
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LiveDot, {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[8px]", style: { color: C.mid }, children: "ORGANISM IS WORKING..." })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "rounded p-3 font-mono text-[9px] leading-relaxed",
                    style: {
                      background: "oklch(0.07 0.012 265)",
                      border: `1px solid ${C.borderDim}`,
                      color: C.text
                    },
                    "data-ocid": "inquisitor.active_task.prompt",
                    children: data.activeTaskPrompt || "(generating prompt…)"
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "text-center py-4",
                  "data-ocid": "inquisitor.active_task.empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "font-mono text-[10px] tracking-widest uppercase",
                        style: { color: C.dim },
                        children: "IDLE — Awaiting hunger threshold"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "font-mono text-[8px] mt-1",
                        style: { color: "oklch(0.28 0.04 220)" },
                        children: "Task generation activates when hunger drive exceeds threshold"
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-4",
            style: { borderColor: C.border, background: C.panel },
            "data-ocid": "inquisitor.stats.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-3",
                  style: { color: C.dim },
                  children: "STATS"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: [
                {
                  label: "GENERATED",
                  value: generated.toLocaleString(),
                  color: C.text
                },
                { label: "SOLVED", value: solved.toLocaleString(), color: C.green },
                {
                  label: "SUCCESS RATE",
                  value: `${(successRate * 100).toFixed(1)}%`,
                  color: successRate > 0.7 ? C.green : successRate > 0.4 ? C.amber : C.red
                }
              ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded p-3 text-center",
                  style: {
                    background: "oklch(0.07 0.012 265)",
                    border: `1px solid ${C.borderDim}`
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "font-mono text-[16px] font-bold",
                        style: { color },
                        children: value
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "font-mono text-[7px] tracking-widest uppercase mt-1",
                        style: { color: C.dim },
                        children: label
                      }
                    )
                  ]
                },
                label
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-4",
            style: { borderColor: C.border, background: C.panel },
            "data-ocid": "inquisitor.cascade_events.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-3",
                  style: { color: C.dim },
                  children: "TASK CASCADE EVENTS"
                }
              ),
              eventLog.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "text-center py-3",
                  "data-ocid": "inquisitor.cascade_events.empty_state",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px]", style: { color: C.dim }, children: "Cascade log empty — events appear as tasks start and complete" })
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: eventLog.slice(0, 5).map((ev, i) => {
                const evColor = TASK_TYPE_COLORS[ev.taskType] ?? C.cyan;
                const isStart = ev.type === "task_start";
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": `inquisitor.cascade_events.item.${i + 1}`,
                    className: "flex items-start gap-2 py-1.5 px-2 rounded-sm",
                    style: {
                      background: isStart ? `${evColor}08` : "oklch(0.07 0.012 265)",
                      borderLeft: `2px solid ${isStart ? evColor : C.green}60`
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px] shrink-0 mt-0.5",
                          style: { color: isStart ? evColor : C.green },
                          children: isStart ? "▶" : "✓"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[8px] font-bold",
                              style: { color: evColor },
                              children: ev.taskType
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              className: "font-mono text-[7px]",
                              style: { color: C.dim },
                              children: [
                                "beat ",
                                ev.beat,
                                " ·",
                                " ",
                                ev.timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit"
                                })
                              ]
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "font-mono text-[8px] truncate",
                            style: { color: C.mid },
                            children: ev.prompt
                          }
                        )
                      ] })
                    ]
                  },
                  `${ev.timestamp.getTime()}-${i}`
                );
              }) })
            ]
          }
        )
      ]
    }
  );
}
export {
  InquisitorTab as default
};
