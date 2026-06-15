import { u as useActor, r as reactExports, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
import { m as motion } from "./proxy-BnoGaVMl.js";
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
  adre: "oklch(0.74 0.22 230)"
};
const RING_LABELS = {
  0: "DELTA GROUND",
  1: "THETA BRIDGE",
  2: "ALPHA FIELD",
  3: "BETA COMPUTE",
  4: "GAMMA SHARP",
  5: "HIGH GAMMA",
  6: "SUPRA GAMMA",
  7: "OMNIS APEX"
};
function PanelBox({
  children,
  className = "",
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `border p-3 ${className}`,
      style: {
        background: C.panel,
        borderColor: accent ? `${accent}40` : C.border,
        borderTop: accent ? `1px solid ${accent}` : void 0
      },
      children
    }
  );
}
function PanelTitle({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "font-mono text-[9px] tracking-widest uppercase mb-2 pb-1 border-b",
      style: { color: C.adre, borderColor: `${C.adre}40` },
      children
    }
  );
}
function MetricCard({
  label,
  value,
  color,
  sub
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col gap-1 p-3 border",
      style: { background: C.panelDeep, borderColor: `${color}30` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[8px] tracking-widest uppercase",
            style: { color: C.dim },
            children: label
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-xl font-bold leading-none",
            style: { color, textShadow: `0 0 12px ${color}50` },
            children: value
          }
        ),
        sub && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: C.dimlo }, children: sub })
      ]
    }
  );
}
function PassStrip({ decision }) {
  const PASSES = [
    { id: "FWD", label: "FORWARD", desc: "Ingest & classify signal" },
    { id: "BCK", label: "BACK-PASS", desc: "Cross-check against law registry" },
    { id: "RES", label: "RESONANCE", desc: "Test global meaning shift" },
    { id: "CMP", label: "COMPRESSION", desc: "Reduce to stable invariants" },
    { id: "GATE", label: "GATE", desc: "Emit if all constraints pass" }
  ];
  const complete = decision !== null;
  const gatePass = (decision == null ? void 0 : decision.gateResult) ?? false;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", "data-ocid": "adre.pass_strip.section", children: PASSES.map((pass, i) => {
    const isGate = pass.id === "GATE";
    const passColor = isGate ? gatePass ? C.green : C.red : complete ? C.green : C.dimlo;
    const bgColor = isGate ? gatePass ? `${C.green}18` : `${C.red}12` : complete ? `${C.green}10` : "transparent";
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex-1 flex flex-col items-center gap-1 py-2 px-1 border transition-all",
        style: { borderColor: `${passColor}50`, background: bgColor },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[8px] tracking-widest font-bold",
              style: { color: passColor },
              children: [
                complete ? isGate ? gatePass ? "✓" : "✗" : "✓" : "○",
                " P",
                i + 1
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] tracking-wide text-center",
              style: { color: complete ? C.dim : C.dimlo },
              children: pass.label
            }
          )
        ]
      },
      pass.id
    );
  }) });
}
function LawSummaryBar({ summary }) {
  const passes = (summary == null ? void 0 : summary.passes) ?? 0;
  const violations = (summary == null ? void 0 : summary.violations) ?? 0;
  const omnis = (summary == null ? void 0 : summary.omnisFired) ?? false;
  const pct = Math.round(passes / 60 * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { accent: omnis ? C.gold : void 0, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ 60 SOVEREIGN LAWS" }),
      omnis && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "font-mono text-[8px] tracking-[0.2em] px-2 py-0.5 border font-bold animate-pulse",
          style: {
            color: C.gold,
            borderColor: C.gold,
            background: `${C.gold}15`,
            boxShadow: `0 0 12px ${C.gold}60`
          },
          "data-ocid": "adre.omnis.badge",
          children: "◆ OMNIS FIRED"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex-1 h-2",
          style: { background: "oklch(0.12 0.01 265)" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full transition-all duration-700",
              style: {
                width: `${pct}%`,
                background: C.green,
                boxShadow: pct > 90 ? `0 0 8px ${C.green}` : "none"
              }
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "font-mono text-[10px] font-bold shrink-0",
          style: { color: C.green },
          children: [
            passes,
            "/60"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "font-mono text-[8px] shrink-0",
          style: { color: violations > 0 ? C.red : C.dim },
          children: [
            violations,
            " violations"
          ]
        }
      )
    ] })
  ] });
}
function HypothesisPanel({ decision }) {
  if (!decision) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ CURRENT HYPOTHESIS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex items-center justify-center h-16 font-mono text-[9px] tracking-widest",
          style: { color: C.dimlo },
          "data-ocid": "adre.hypothesis.empty_state",
          children: "AWAITING FIRST DELIBERATION CYCLE…"
        }
      )
    ] });
  }
  const h = decision.hypothesis;
  const ringLabel = RING_LABELS[h.ringFamily] ?? `RING ${h.ringFamily}`;
  const ringColor = h.ringFamily === 7 ? C.gold : h.ringFamily >= 4 ? C.purple : C.cyan;
  const confPct = Math.round(h.confidenceScore * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { accent: C.adre, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelTitle, { children: [
      "▸ CURRENT HYPOTHESIS — BEAT ",
      String(decision.beat)
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "font-mono text-base font-bold tracking-wide mb-1",
          style: { color: C.fg, wordBreak: "break-word" },
          "data-ocid": "adre.hypothesis.action",
          children: h.action
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "font-mono text-[7px] px-1.5 py-0.5 border",
            style: {
              color: ringColor,
              borderColor: `${ringColor}50`,
              background: `${ringColor}10`
            },
            children: [
              "RING ",
              h.ringFamily,
              ": ",
              ringLabel
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: C.dim }, children: [
          "BEAT CREATED ",
          String(h.beatCreated)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 mb-3", children: [
      {
        label: "CONFIDENCE",
        value: `${confPct}%`,
        color: confPct > 80 ? C.green : confPct > 50 ? C.amber : C.red
      },
      {
        label: "PRED COHERENCE",
        value: h.predictedCoherence.toFixed(4),
        color: h.predictedCoherence > 0.87 ? C.green : C.amber
      },
      {
        label: "PRED R",
        value: h.predictedR.toFixed(4),
        color: h.predictedR > 0.87 ? C.green : C.amber
      }
    ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[7px] tracking-widest uppercase",
          style: { color: C.dim },
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] font-bold", style: { color }, children: value })
    ] }, label)) }),
    decision.passTrace.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-1 flex-wrap",
        "data-ocid": "adre.pass_trace.section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] tracking-widest",
              style: { color: C.dim },
              children: "TRACE:"
            }
          ),
          decision.passTrace.map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px] px-1 py-0.5",
                style: { color: C.adre, background: `${C.adre}15` },
                children: step
              }
            ),
            i < decision.passTrace.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px] mx-0.5",
                style: { color: C.dimlo },
                children: "→"
              }
            )
          ] }, step))
        ]
      }
    )
  ] });
}
function CriticsPanel({ decision }) {
  if (!decision || decision.critics.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ INTERNAL CRITICS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex items-center justify-center h-12 font-mono text-[9px] tracking-widest",
          style: { color: C.dimlo },
          "data-ocid": "adre.critics.empty_state",
          children: "NO CRITICS ACTIVE"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelTitle, { children: [
      "▸ INTERNAL CRITICS — ",
      decision.critics.length,
      " ACTIVE"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2", children: decision.critics.map((critic, i) => {
      const alignPct = Math.round(critic.alignmentScore * 100);
      const alignColor = alignPct > 70 ? C.green : alignPct > 40 ? C.amber : C.red;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "border p-2 flex flex-col gap-1.5",
          style: {
            borderColor: critic.contradictionDetected ? `${C.red}60` : C.borderLo,
            background: critic.contradictionDetected ? `${C.red}08` : C.panelDeep
          },
          "data-ocid": `adre.critic.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[8px] font-bold tracking-wide",
                  style: { color: C.adre },
                  children: critic.criticId
                }
              ),
              critic.contradictionDetected && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[6px] px-1 py-0.5 font-bold",
                  style: { color: C.red, background: `${C.red}20` },
                  children: "CONTRADICTION"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[7px]",
                    style: { color: C.dim },
                    children: "ALIGNMENT"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono text-[7px] font-bold",
                    style: { color: alignColor },
                    children: [
                      alignPct,
                      "%"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-1",
                  style: { background: "oklch(0.12 0.01 265)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full transition-all",
                      style: { width: `${alignPct}%`, background: alignColor }
                    }
                  )
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[6px]",
                    style: { color: C.dim },
                    children: "PASS"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] font-bold ml-1",
                    style: { color: C.green },
                    children: critic.passCount
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[6px]",
                    style: { color: C.dim },
                    children: "VIOLATION"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] font-bold ml-1",
                    style: { color: critic.violationCount > 0 ? C.red : C.dim },
                    children: critic.violationCount
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[6px]",
                    style: { color: C.dim },
                    children: "RISK"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] font-bold ml-1",
                    style: { color: critic.riskScore > 0.6 ? C.red : C.amber },
                    children: critic.riskScore.toFixed(2)
                  }
                )
              ] })
            ] }),
            critic.recommendation && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[7px] leading-relaxed border-t pt-1 line-clamp-2",
                style: { color: C.dim, borderColor: C.borderLo },
                title: critic.recommendation,
                children: critic.recommendation
              }
            )
          ]
        },
        critic.criticId
      );
    }) })
  ] });
}
function DecisionRow({
  decision,
  index,
  expanded,
  onToggle
}) {
  const confPct = Math.round(decision.finalConfidence * 100);
  const riskPct = Math.round(decision.finalRisk * 100);
  const rowBg = decision.gateResult ? `${C.green}08` : `${C.red}06`;
  const gateColor = decision.gateResult ? C.green : C.red;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border-b",
      style: { borderColor: C.borderLo, background: rowBg },
      "data-ocid": `adre.decision.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full flex items-center gap-2 px-2 py-1.5 cursor-pointer transition-all text-left",
            onClick: onToggle,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[8px] w-16 shrink-0",
                  style: { color: C.dimlo },
                  children: [
                    "#",
                    String(decision.beat)
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[8px] flex-1 min-w-0 truncate",
                  style: { color: C.fg },
                  children: decision.actionId
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[8px] w-10 text-right shrink-0",
                  style: { color: confPct > 80 ? C.green : C.amber },
                  children: [
                    confPct,
                    "%"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[8px] w-8 text-right shrink-0",
                  style: { color: riskPct > 60 ? C.red : C.dim },
                  children: [
                    "R",
                    riskPct
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[7px] px-1.5 py-0.5 shrink-0 font-bold",
                  style: {
                    color: gateColor,
                    background: `${gateColor}15`,
                    border: `1px solid ${gateColor}40`
                  },
                  children: decision.gateResult ? "EMITTED" : "QUEUED"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[8px]", style: { color: C.dimlo }, children: expanded ? "▲" : "▼" })
            ]
          }
        ),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-2 pb-2 pt-1 border-t",
            style: { borderColor: C.borderLo },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-1 mb-2", children: [
                ["ACTION", decision.hypothesis.action],
                [
                  "RING FAMILY",
                  `${decision.hypothesis.ringFamily}: ${RING_LABELS[decision.hypothesis.ringFamily] ?? "UNKNOWN"}`
                ],
                [
                  "SACESI HASH",
                  `0x${decision.sacesiHash.toString(16).toUpperCase()}`
                ],
                ["MEMORY COMMIT", `${decision.memoryCommit.slice(0, 24)}…`]
              ].map(([label, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: C.dim }, children: [
                  label,
                  ":",
                  " "
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: C.fg }, children: value })
              ] }, label)) }),
              decision.critics.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: decision.critics.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[6px] px-1 py-0.5 border",
                  style: {
                    color: c.contradictionDetected ? C.red : C.dim,
                    borderColor: c.contradictionDetected ? `${C.red}50` : C.borderLo
                  },
                  children: [
                    c.criticId,
                    " ",
                    c.alignmentScore.toFixed(2)
                  ]
                },
                c.criticId
              )) })
            ]
          }
        )
      ]
    }
  );
}
function ADRETab() {
  const { actor, isFetching } = useActor();
  const [resonanceState, setResonanceState] = reactExports.useState(null);
  const [lawSummary, setLawSummary] = reactExports.useState(null);
  const [lastDecision, setLastDecision] = reactExports.useState(null);
  const [decisionQueue, setDecisionQueue] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [expandedRow, setExpandedRow] = reactExports.useState(null);
  const intervalRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!actor || isFetching) return;
    const poll = async () => {
      var _a, _b, _c, _d;
      try {
        const [res, law, last, queue] = await Promise.all([
          (_a = actor.getADREResonanceState) == null ? void 0 : _a.call(actor),
          (_b = actor.getADRELawSummary) == null ? void 0 : _b.call(actor),
          (_c = actor.getADRELastDecision) == null ? void 0 : _c.call(actor),
          (_d = actor.getADREDecisionQueue) == null ? void 0 : _d.call(actor)
        ]);
        if (res) setResonanceState(res);
        if (law) setLawSummary(law);
        if (last && Array.isArray(last) && last.length > 0)
          setLastDecision(last[0]);
        else if (last && !Array.isArray(last))
          setLastDecision(last);
        if (queue && Array.isArray(queue))
          setDecisionQueue(queue.slice(0, 20));
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
  const meaningColor = !resonanceState ? C.dim : resonanceState.globalMeaningShift < 0.1 ? C.green : resonanceState.globalMeaningShift < 0.2 ? C.amber : C.red;
  const coherenceTrendColor = !resonanceState ? C.dim : resonanceState.fieldCoherenceTrend > 0.87 ? C.green : resonanceState.fieldCoherenceTrend > 0.7 ? C.amber : C.red;
  const contColor = !resonanceState ? C.dim : resonanceState.contradictionCount <= 3 ? C.green : resonanceState.contradictionCount <= 7 ? C.amber : C.red;
  const isActive = resonanceState !== null;
  const beatDisplay = resonanceState ? String(resonanceState.lastUpdatedBeat) : "—";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-y-auto",
      style: { background: C.bg },
      "data-ocid": "adre.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -4 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4 },
            className: "flex items-center justify-between px-4 py-3 border-b shrink-0",
            style: { background: "oklch(0.065 0.012 230)", borderColor: C.border },
            "data-ocid": "adre.header.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-3 h-3 rounded-full shrink-0",
                    style: {
                      background: isActive ? C.adre : C.dimlo,
                      boxShadow: isActive ? `0 0 10px ${C.adre}` : "none",
                      transition: "all 0.5s"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-xl font-bold tracking-widest",
                    style: { color: C.adre },
                    children: "ADRE"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[9px] tracking-widest uppercase",
                    style: { color: C.dim },
                    children: "Auro Deliberation & Resonance Engine"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px] tracking-widest uppercase",
                      style: { color: C.dim },
                      children: "BEAT"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-sm font-bold",
                      style: { color: C.cyan },
                      children: beatDisplay
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[8px] tracking-[0.15em] px-2 py-0.5 border font-bold",
                    style: {
                      color: isActive ? C.green : C.dimlo,
                      borderColor: isActive ? `${C.green}50` : C.borderLo,
                      background: isActive ? `${C.green}10` : "transparent"
                    },
                    "data-ocid": "adre.status.indicator",
                    children: loading ? "INITIALIZING" : isActive ? "● REASONING" : "○ STANDBY"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.3, delay: 0.05 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ 5-PASS DELIBERATION LOOP" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(PassStrip, { decision: lastDecision })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.3, delay: 0.1 },
              "data-ocid": "adre.resonance_metrics.section",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  MetricCard,
                  {
                    label: "Global Meaning Shift",
                    value: resonanceState ? resonanceState.globalMeaningShift.toFixed(4) : "——",
                    color: meaningColor,
                    sub: !resonanceState ? "awaiting data" : resonanceState.globalMeaningShift < 0.1 ? "stable" : resonanceState.globalMeaningShift < 0.2 ? "moderate drift" : "high drift"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  MetricCard,
                  {
                    label: "Field Coherence Trend",
                    value: resonanceState ? resonanceState.fieldCoherenceTrend.toFixed(4) : "——",
                    color: coherenceTrendColor,
                    sub: !resonanceState ? "awaiting data" : resonanceState.fieldCoherenceTrend > 0.87 ? "above OMNIS threshold" : resonanceState.fieldCoherenceTrend > 0.7 ? "below threshold" : "degraded"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  MetricCard,
                  {
                    label: "Contradictions",
                    value: resonanceState ? String(resonanceState.contradictionCount) : "—",
                    color: contColor,
                    sub: !resonanceState ? "awaiting data" : resonanceState.contradictionCount <= 3 ? "nominal" : resonanceState.contradictionCount <= 7 ? "elevated" : "critical"
                  }
                )
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.3, delay: 0.15 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(LawSummaryBar, { summary: lawSummary })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "grid grid-cols-1 xl:grid-cols-2 gap-3",
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.3, delay: 0.2 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(HypothesisPanel, { decision: lastDecision }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CriticsPanel, { decision: lastDecision })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.3, delay: 0.25 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelTitle, { children: [
                  "▸ DECISION QUEUE — LAST ",
                  decisionQueue.length,
                  " CYCLES"
                ] }),
                decisionQueue.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex items-center justify-center h-16 font-mono text-[9px] tracking-widest",
                    style: { color: C.dimlo },
                    "data-ocid": "adre.decision_queue.empty_state",
                    children: loading ? "LOADING DECISION HISTORY…" : "NO DECISIONS RECORDED YET"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "overflow-y-auto",
                    style: { maxHeight: "320px" },
                    "data-ocid": "adre.decision_queue.list",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "flex items-center gap-2 px-2 py-1 border-b",
                          style: { borderColor: C.borderLo, background: C.panelDeep },
                          children: [
                            ["BEAT", "ACTION ID", "CONF", "RISK", "STATUS"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: `font-mono text-[7px] tracking-widest uppercase shrink-0 ${h === "ACTION ID" ? "flex-1" : h === "BEAT" ? "w-16" : h === "CONF" ? "w-10 text-right" : h === "RISK" ? "w-8 text-right" : ""}`,
                                style: { color: C.dimlo },
                                children: h
                              },
                              h
                            )),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4" })
                          ]
                        }
                      ),
                      decisionQueue.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        DecisionRow,
                        {
                          decision: d,
                          index: i + 1,
                          expanded: expandedRow === i,
                          onToggle: () => setExpandedRow(expandedRow === i ? null : i)
                        },
                        `${d.beat}-${i}`
                      ))
                    ]
                  }
                )
              ] })
            }
          )
        ] })
      ]
    }
  );
}
export {
  ADRETab as default
};
