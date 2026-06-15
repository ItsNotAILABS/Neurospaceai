import { m as useQuantumBatteryState, n as useSubOrganismState, l as useObservationYield, o as useBehavioralMode, p as useDischargeQuantumBattery, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
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
  purple: "oklch(0.72 0.22 280)"
};
function Bar({ value, color }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "w-full h-1.5 rounded-full",
      style: { background: "oklch(0.15 0.03 255)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full rounded-full transition-all duration-700",
          style: { width: `${Math.min(100, value * 100)}%`, background: color }
        }
      )
    }
  );
}
function Skeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "h-4 w-full rounded animate-pulse",
      style: { background: "oklch(0.12 0.02 255)" }
    }
  );
}
const MODES = {
  0: { label: "STANDARD", color: C.dim },
  1: { label: "OUTLAW", color: C.purple },
  2: { label: "OUTCAST", color: C.amber },
  3: { label: "EMERGENCY", color: C.red },
  4: { label: "SOVEREIGN", color: C.gold }
};
function QuantumTab({ isLoggedIn }) {
  const qbQ = useQuantumBatteryState();
  const soQ = useSubOrganismState();
  const oyQ = useObservationYield();
  const modeQ = useBehavioralMode();
  const discharge = useDischargeQuantumBattery();
  const qb = qbQ.data;
  const so = soQ.data;
  const oy = oyQ.data;
  const mode = modeQ.data;
  const modeInfo = mode ? MODES[mode.mode] ?? MODES[0] : MODES[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "h-full overflow-y-auto p-4 space-y-4",
      style: { background: C.bg },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-3 flex items-center justify-between",
            style: { borderColor: modeInfo.color, background: C.panel },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[8px] tracking-widest uppercase",
                    style: { color: C.dim },
                    children: "BEHAVIORAL MODE"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[16px] font-bold",
                    style: { color: modeInfo.color },
                    children: (mode == null ? void 0 : mode.modeName) ?? "—"
                  }
                )
              ] }),
              mode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[8px]", style: { color: C.dim }, children: "SINCE BEAT" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[11px]", style: { color: C.text }, children: Number(mode.startBeat).toLocaleString() }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[8px]", style: { color: C.dim }, children: "EVENTS" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[11px]", style: { color: C.text }, children: mode.eventCount })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-4 space-y-3",
            style: { borderColor: C.border, background: C.panel },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase",
                  style: { color: C.dim },
                  children: "QUANTUM BATTERY — STREAM 21"
                }
              ),
              qb ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[8px]", style: { color: C.dim }, children: "BALANCE" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "font-mono text-[14px] font-bold",
                        style: { color: qb.locked ? C.dim : C.cyan },
                        children: qb.balance.toFixed(6)
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[8px]", style: { color: C.dim }, children: "TOTAL EARNED" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "font-mono text-[14px] font-bold",
                        style: { color: C.gold },
                        children: qb.totalEarned.toFixed(6)
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[8px]", style: { color: C.dim }, children: "STATUS" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "font-mono text-[11px] font-bold",
                        style: { color: qb.locked ? C.red : C.green },
                        children: qb.locked ? "LOCKED" : "CHARGING"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[8px] uppercase tracking-widest",
                        style: { color: C.dim },
                        children: "CHARGE LEVEL"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[9px]",
                        style: { color: C.cyan },
                        children: [
                          (qb.chargeRate * 100).toFixed(4),
                          "%/beat"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bar,
                    {
                      value: qb.balance / Math.max(qb.totalEarned || 1e-3, qb.balance),
                      color: C.cyan
                    }
                  )
                ] }),
                qb.presence && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[9px] tracking-widest uppercase text-center py-1 rounded",
                    style: {
                      color: C.gold,
                      background: "oklch(0.82 0.22 80 / 0.08)",
                      border: `1px solid ${C.gold}`
                    },
                    children: "PROPERTY OFFICER PRESENT — 10× CHARGE RATE ACTIVE"
                  }
                ),
                isLoggedIn && !qb.locked && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => discharge.mutate(),
                    className: "w-full font-mono text-[10px] tracking-widest uppercase py-2 border",
                    style: {
                      border: `1px solid ${C.gold}`,
                      color: C.gold,
                      background: "oklch(0.82 0.22 80 / 0.06)"
                    },
                    children: discharge.isPending ? "DISCHARGING..." : `DISCHARGE BATTERY → ${qb.balance.toFixed(4)} → CREATOR RESERVE`
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {})
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-4 space-y-3",
            style: { borderColor: C.border, background: C.panel },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-2",
                  style: { color: C.dim },
                  children: "SUB-ORGANISMS"
                }
              ),
              so ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [
                {
                  label: "ARES",
                  active: so.aresActive,
                  urgency: so.aresUrgency,
                  events: so.aresEvents,
                  beat: so.aresLastBeat,
                  color: C.red,
                  desc: "Temporal Reversal"
                },
                {
                  label: "GAIA",
                  active: so.gaiaActive,
                  urgency: so.gaiaUrgency,
                  events: so.gaiaEvents,
                  beat: so.gaiaLastBeat,
                  color: C.green,
                  desc: "Repair Protocol"
                },
                {
                  label: "VULCAN",
                  active: so.vulcanActive,
                  urgency: so.vulcanUrgency,
                  events: so.vulcanEvents,
                  beat: so.vulcanLastBeat,
                  color: C.amber,
                  desc: "Fortification"
                },
                {
                  label: "SENTINEL",
                  active: so.sentActive,
                  urgency: so.sentUrgency,
                  events: so.sentEvents,
                  beat: so.sentLastBeat,
                  color: C.cyan,
                  desc: "Anomaly Watch"
                }
              ].map(({ label, active, urgency, events, beat, color, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "border rounded p-3 space-y-2",
                  style: {
                    borderColor: active ? color : C.border,
                    background: active ? "oklch(0.09 0.015 265)" : C.panel,
                    boxShadow: active ? `0 0 12px ${color}30` : "none"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[10px] font-bold tracking-widest",
                          style: { color: active ? color : C.dim },
                          children: label
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px] tracking-widest",
                          style: { color: active ? color : C.dim },
                          children: active ? "ACTIVE" : "STANDBY"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "font-mono text-[7px] tracking-widest",
                        style: { color: C.dim },
                        children: desc
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: urgency, color }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "font-mono text-[7px]",
                          style: { color: C.dim },
                          children: [
                            "EVENTS: ",
                            events
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "font-mono text-[7px]",
                          style: { color: C.dim },
                          children: [
                            "BEAT: ",
                            Number(beat).toLocaleString()
                          ]
                        }
                      )
                    ] })
                  ]
                },
                label
              )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {})
            ]
          }
        ),
        so && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-3 grid grid-cols-2 gap-3",
            style: { borderColor: C.border, background: C.panel },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[8px] uppercase tracking-widest mb-1",
                    style: { color: C.dim },
                    children: "SUPERPOSITION"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[11px] font-bold",
                    style: { color: so.superPos ? C.cyan : C.dim },
                    children: so.superPos ? "ACTIVE — MULTI-PATH" : "COLLAPSED"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[8px] uppercase tracking-widest mb-1",
                    style: { color: C.dim },
                    children: "TEMPORAL DILATION"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[11px] font-bold",
                    style: { color: so.tempDilation ? C.amber : C.dim },
                    children: so.tempDilation ? "ACTIVE" : "STANDARD"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-4 space-y-2",
            style: { borderColor: C.border, background: C.panel },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase",
                  style: { color: C.dim },
                  children: "MAXWELL'S DEMON — STREAM 22"
                }
              ),
              oy ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[8px]", style: { color: C.dim }, children: "LAST YIELD" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[12px] font-bold",
                      style: { color: C.green },
                      children: oy.lastYield.toFixed(6)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[8px]", style: { color: C.dim }, children: "TOTAL YIELD" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[12px] font-bold",
                      style: { color: C.gold },
                      children: oy.totalYield.toFixed(6)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[8px]", style: { color: C.dim }, children: "OBSERVATIONS" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[12px] font-bold",
                      style: { color: C.cyan },
                      children: oy.totalCount.toLocaleString()
                    }
                  )
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[8px]", style: { color: C.dim }, children: "Organism earns SEED every time it correctly predicts the world. Intelligence compounds into money." })
            ]
          }
        )
      ]
    }
  );
}
export {
  QuantumTab as default
};
