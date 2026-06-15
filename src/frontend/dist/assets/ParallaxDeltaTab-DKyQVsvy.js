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
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.78 0.22 65)",
  red: "oklch(0.72 0.22 25)",
  parallax: "oklch(0.74 0.22 165)"
  // teal-green — distinct from ADRE blue
};
function fieldColor(ft) {
  if (ft === "Receptive") return C.cyan;
  if (ft === "Expansive") return C.green;
  if (ft === "AntiDrift") return C.amber;
  return C.dim;
}
function fieldLabel(ft) {
  if (ft === "Receptive") return "RECEPTIVE";
  if (ft === "Expansive") return "EXPANSIVE";
  if (ft === "AntiDrift") return "ANTI-DRIFT";
  return String(ft).toUpperCase();
}
function classLabel(ic) {
  return String(ic).toUpperCase();
}
function rejectionLabel(r) {
  const map = {
    LawConflict: "LAW CONFLICT",
    CategoryDrift: "CATEGORY DRIFT",
    FieldBoundaryViolation: "FIELD BOUNDARY VIOLATION",
    CoherenceBelow: "COHERENCE BELOW THRESHOLD",
    DoctrineViolation: "DOCTRINE VIOLATION"
  };
  return map[r] ?? r;
}
function truncate(s, n) {
  if (s.length <= n) return s;
  return `${s.slice(0, n)}…`;
}
function PanelBox({
  children,
  className = "",
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `border ${className}`,
      style: {
        background: C.panel,
        borderColor: accent ? `${accent}40` : C.border,
        borderTop: accent ? `1px solid ${accent}` : void 0
      },
      children
    }
  );
}
function SectionTitle({
  children,
  color = C.parallax
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "font-mono text-[9px] tracking-widest uppercase px-3 py-2 border-b flex items-center gap-2",
      style: { color, borderColor: `${color}30`, background: `${color}08` },
      children
    }
  );
}
function DriftBadge({ score }) {
  const color = score < 0.3 ? C.green : score < 0.6 ? C.amber : C.red;
  const label = score < 0.3 ? "STABLE" : score < 0.6 ? "ELEVATED" : "CRITICAL";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-mono text-[7px] tracking-widest uppercase",
        style: { color: C.dim },
        children: "DRIFT"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-mono text-sm font-bold",
        style: { color, textShadow: `0 0 10px ${color}60` },
        children: score.toFixed(4)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-mono text-[7px] px-1.5 py-0.5 border font-bold",
        style: { color, borderColor: `${color}50`, background: `${color}15` },
        children: label
      }
    )
  ] });
}
function DeltaRow({
  record,
  index
}) {
  const ft = record.fieldType;
  const ic = record.intelligenceClass;
  const fColor = fieldColor(ft);
  const rings = record.affectedRings.map(String).join(", ");
  const impact = record.coherenceImpact >= 0 ? `+${record.coherenceImpact.toFixed(4)}` : record.coherenceImpact.toFixed(4);
  const impactColor = record.coherenceImpact >= 0 ? C.green : C.red;
  const hash = record.sacesiHash.slice(0, 8);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border-b px-3 py-2",
      style: {
        borderColor: C.borderLo,
        background: `${fColor}06`
      },
      "data-ocid": `parallax.delta.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[8px] shrink-0",
              style: { color: C.dimlo },
              children: [
                "[BEAT ",
                String(record.beat),
                "]"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8px] font-bold flex-1 min-w-0 truncate",
              style: { color: C.fg },
              children: record.id
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] px-1.5 py-0.5 border shrink-0",
              style: {
                color: fColor,
                borderColor: `${fColor}40`,
                background: `${fColor}10`
              },
              children: fieldLabel(ft)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] px-1.5 py-0.5 border shrink-0",
              style: { color: C.dim, borderColor: C.borderLo },
              children: classLabel(ic)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: C.dimlo }, children: [
            "RINGS: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.dim }, children: rings || "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: C.dimlo }, children: [
            "IMPACT:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", style: { color: impactColor }, children: impact })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: C.dimlo }, children: [
            "HASH: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.parallax }, children: hash })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "font-mono text-[8px] leading-relaxed",
            style: { color: C.dim },
            title: record.content,
            children: truncate(record.content, 80)
          }
        )
      ]
    }
  );
}
function RejectionRow({
  record,
  index
}) {
  const hash = record.sacesiHash.slice(0, 8);
  const reason = rejectionLabel(record.reason);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border-b px-3 py-2",
      style: {
        borderColor: C.borderLo,
        background: `${C.red}06`
      },
      "data-ocid": `parallax.rejection.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[8px] shrink-0",
              style: { color: C.dimlo },
              children: [
                "[BEAT ",
                String(record.beat),
                "]"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8px] font-bold",
              style: { color: C.red },
              children: "REJECTED"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[7px] flex-1 min-w-0 truncate",
              style: { color: C.dim },
              children: [
                "— ",
                reason
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: C.dimlo }, children: [
            "VIOLATED:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.amber }, children: record.violatedDoctrineConstant })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: C.dimlo }, children: [
            "HASH: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.dim }, children: hash })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "font-mono text-[8px] leading-relaxed",
            style: { color: "oklch(0.3 0.04 20)" },
            title: record.content,
            children: truncate(record.content, 60)
          }
        )
      ]
    }
  );
}
function SubmitResultBanner({ result }) {
  if (!result) return null;
  const color = result.accepted ? C.green : C.red;
  const label = result.accepted ? "ACCEPTED" : "REJECTED";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: -4 },
      animate: { opacity: 1, y: 0 },
      className: "px-3 py-2 border font-mono",
      style: {
        background: `${color}10`,
        borderColor: `${color}50`,
        borderLeft: `3px solid ${color}`
      },
      "data-ocid": "parallax.submit.success_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold", style: { color }, children: label }),
        result.detail && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] ml-2", style: { color: C.dim }, children: result.detail }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[7px] ml-2", style: { color: C.dimlo }, children: [
          "ID: ",
          result.recordId.slice(0, 16)
        ] })
      ]
    }
  );
}
function ClassificationLegend() {
  const FIELD_TYPES = [
    { label: "RECEPTIVE", desc: "mineral / inward", color: C.cyan },
    { label: "EXPANSIVE", desc: "water / broadcast", color: C.green },
    { label: "ANTI-DRIFT", desc: "plasma / mediation", color: C.amber }
  ];
  const CLASSES = [
    "DOCTRINE",
    "EMPIRICAL",
    "TEMPORAL",
    "GEOMETRIC",
    "BIOMETRIC",
    "EXTERNAL"
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "px-3 py-2 border-t flex flex-wrap gap-4 items-center",
      style: { borderColor: C.borderLo, background: C.panelDeep },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] tracking-widest uppercase",
              style: { color: C.dimlo },
              children: "Field Types:"
            }
          ),
          FIELD_TYPES.map((ft) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[7px] px-1.5 py-0.5 border",
              style: { color: ft.color, borderColor: `${ft.color}40` },
              children: [
                ft.label,
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: C.dimlo }, children: [
                  " (",
                  ft.desc,
                  ")"
                ] })
              ]
            },
            ft.label
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] tracking-widest uppercase",
              style: { color: C.dimlo },
              children: "Classes:"
            }
          ),
          CLASSES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7px] px-1 py-0.5 border",
              style: { color: C.dim, borderColor: C.borderLo },
              children: c
            },
            c
          ))
        ] })
      ]
    }
  );
}
function ParallaxDeltaTab() {
  const { actor, isFetching } = useActor();
  const [totalAccepted, setTotalAccepted] = reactExports.useState(0n);
  const [totalRejected, setTotalRejected] = reactExports.useState(0n);
  const [driftScore, setDriftScore] = reactExports.useState(0);
  const [deltaRecords, setDeltaRecords] = reactExports.useState([]);
  const [rejectionLog, setRejectionLog] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [inputContent, setInputContent] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [submitResult, setSubmitResult] = reactExports.useState(null);
  const intervalRef = reactExports.useRef(null);
  const deltaScrollRef = reactExports.useRef(null);
  const rejectScrollRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!actor || isFetching) return;
    const poll = async () => {
      try {
        const [snapshot, deltas, rejections] = await Promise.all([
          actor.getIntakeSnapshot(),
          actor.getDeltaRecords(20n),
          actor.getRejectionLog(20n)
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
  async function handleSubmit() {
    if (!actor || !inputContent.trim() || submitting) return;
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const result = await actor.intakeIntelligence(inputContent.trim(), 0n, 0.5);
      const [accepted, recordId] = result;
      setSubmitResult({
        accepted,
        recordId,
        detail: accepted ? "intelligence integrated into doctrine field" : "field boundary protected"
      });
      if (accepted) setInputContent("");
    } catch {
      setSubmitResult({
        accepted: false,
        recordId: "ERR",
        detail: "submission error — field gate held"
      });
    } finally {
      setSubmitting(false);
    }
  }
  const isActive = !loading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-y-auto",
      style: { background: C.bg },
      "data-ocid": "parallax.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -4 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4 },
            className: "flex items-center justify-between px-4 py-2.5 border-b shrink-0 flex-wrap gap-2",
            style: {
              background: "oklch(0.063 0.012 200)",
              borderColor: C.border
            },
            "data-ocid": "parallax.header.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-3 h-3 rounded-full shrink-0 transition-all",
                    style: {
                      background: isActive ? C.parallax : C.dimlo,
                      boxShadow: isActive ? `0 0 10px ${C.parallax}` : "none"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[11px] font-bold tracking-[0.2em] uppercase",
                      style: { color: C.parallax },
                      children: "PARALLAX DELTA INTAKE"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-mono text-[7px] tracking-widest mt-0.5",
                      style: { color: C.dimlo },
                      children: "Doctrine-gated intelligence intake — field never destabilizes"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px] tracking-widest uppercase",
                      style: { color: C.dim },
                      children: "ACCEPTED"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-base font-bold",
                      style: { color: C.green, textShadow: `0 0 10px ${C.green}50` },
                      "data-ocid": "parallax.accepted.count",
                      children: String(totalAccepted)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.borderLo }, children: "│" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px] tracking-widest uppercase",
                      style: { color: C.dim },
                      children: "REJECTED"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-base font-bold",
                      style: { color: C.red, textShadow: `0 0 10px ${C.red}50` },
                      "data-ocid": "parallax.rejected.count",
                      children: String(totalRejected)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.borderLo }, children: "│" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DriftBadge, { score: driftScore }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[8px] tracking-[0.15em] px-2 py-0.5 border font-bold",
                    style: {
                      color: isActive ? C.parallax : C.dimlo,
                      borderColor: isActive ? `${C.parallax}50` : C.borderLo,
                      background: isActive ? `${C.parallax}10` : "transparent"
                    },
                    "data-ocid": "parallax.status.indicator",
                    children: loading ? "INITIALIZING" : "● GATE ACTIVE"
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
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { accent: C.parallax, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { color: C.parallax, children: "▸ INTELLIGENCE SUBMISSION TERMINAL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex flex-col gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "textarea",
                    {
                      value: inputContent,
                      onChange: (e) => setInputContent(e.target.value),
                      placeholder: "Enter intelligence content for field intake...",
                      rows: 3,
                      className: "w-full font-mono text-[10px] p-2 border resize-none leading-relaxed focus:outline-none transition-colors",
                      style: {
                        background: C.panelDeep,
                        borderColor: inputContent.trim() ? `${C.parallax}60` : C.borderLo,
                        color: C.fg,
                        caretColor: C.parallax
                      },
                      "data-ocid": "parallax.intel.textarea",
                      onKeyDown: (e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                          handleSubmit();
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px]",
                        style: { color: C.dimlo },
                        children: "Ctrl+Enter to submit · All truths are gated against 60 sovereign laws"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        disabled: !inputContent.trim() || submitting || !actor,
                        onClick: handleSubmit,
                        className: "font-mono text-[9px] tracking-[0.15em] uppercase px-4 py-1.5 border font-bold transition-all shrink-0",
                        style: {
                          color: !inputContent.trim() || submitting ? C.dimlo : C.parallax,
                          borderColor: !inputContent.trim() || submitting ? C.borderLo : `${C.parallax}70`,
                          background: !inputContent.trim() || submitting ? "transparent" : `${C.parallax}12`,
                          cursor: !inputContent.trim() || submitting ? "not-allowed" : "pointer"
                        },
                        "data-ocid": "parallax.submit.primary_button",
                        children: submitting ? "PROCESSING…" : "SUBMIT TO INTAKE"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SubmitResultBanner, { result: submitResult })
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "grid grid-cols-1 xl:grid-cols-2 gap-3",
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.3, delay: 0.1 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionTitle, { color: C.parallax, children: [
                    "▸ DOCTRINE DELTA RECORDS",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "ml-auto font-mono text-[8px] font-bold",
                        style: { color: C.green },
                        children: [
                          deltaRecords.length,
                          " LIVE"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      ref: deltaScrollRef,
                      className: "overflow-y-auto",
                      style: { maxHeight: "480px" },
                      "data-ocid": "parallax.delta.list",
                      children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "flex items-center justify-center h-24 font-mono text-[9px] tracking-widest",
                          style: { color: C.dimlo },
                          "data-ocid": "parallax.delta.loading_state",
                          children: "LOADING DELTA RECORDS…"
                        }
                      ) : deltaRecords.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "flex flex-col items-center justify-center h-24 gap-2",
                          "data-ocid": "parallax.delta.empty_state",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: "font-mono text-[9px] tracking-widest",
                                style: { color: C.dimlo },
                                children: "NO DOCTRINE DELTAS YET"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: "font-mono text-[7px]",
                                style: { color: "oklch(0.22 0.03 200)" },
                                children: "Submit intelligence above to initiate intake flow"
                              }
                            )
                          ]
                        }
                      ) : deltaRecords.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(DeltaRow, { record: r, index: i + 1 }, r.id))
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionTitle, { color: C.red, children: [
                    "▸ REJECTION LOG",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "ml-auto font-mono text-[8px] font-bold",
                        style: { color: C.red },
                        children: [
                          rejectionLog.length,
                          " LOGGED"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      ref: rejectScrollRef,
                      className: "overflow-y-auto",
                      style: { maxHeight: "480px" },
                      "data-ocid": "parallax.rejection.list",
                      children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "flex items-center justify-center h-24 font-mono text-[9px] tracking-widest",
                          style: { color: C.dimlo },
                          "data-ocid": "parallax.rejection.loading_state",
                          children: "LOADING REJECTION LOG…"
                        }
                      ) : rejectionLog.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "flex flex-col items-center justify-center h-24 gap-2",
                          "data-ocid": "parallax.rejection.empty_state",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: "font-mono text-[9px] tracking-widest",
                                style: { color: C.dimlo },
                                children: "NO REJECTIONS RECORDED"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: "font-mono text-[7px]",
                                style: { color: "oklch(0.22 0.03 25)" },
                                children: "Field is clean — all truths accepted so far"
                              }
                            )
                          ]
                        }
                      ) : rejectionLog.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(RejectionRow, { record: r, index: i + 1 }, r.id))
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 4 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.3, delay: 0.15 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(PanelBox, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClassificationLegend, {}) })
            }
          )
        ] })
      ]
    }
  );
}
export {
  ParallaxDeltaTab as default
};
