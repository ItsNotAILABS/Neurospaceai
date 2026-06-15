import { u as useActor, r as reactExports, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
const T = {
  bg: "#000000",
  headerBg: "#040404",
  green: "#00ff41",
  greenDim: "#006d1a",
  cyan: "#00e5ff",
  red: "#ff2020",
  redDim: "#5c0000",
  amber: "#ffaa00",
  dim: "#2a4a2e",
  dimText: "#3d6b42",
  gridLine: "#0d1a0e",
  border: "#0a2b0e",
  borderBright: "#00ff4160"
};
function formatHash(h) {
  if (!h) return "00000000";
  const s = String(h);
  if (!Number.isNaN(Number(h))) {
    return Number(h).toString(16).toUpperCase().padStart(8, "0").slice(0, 8);
  }
  return s.slice(0, 8).toUpperCase();
}
function shortBeat(b) {
  if (b === void 0 || b === null) return "--------";
  return String(b).padStart(8, "0");
}
function useFlicker(dep) {
  const [flickering, setFlickering] = reactExports.useState(false);
  const prevRef = reactExports.useRef(dep);
  reactExports.useEffect(() => {
    if (prevRef.current !== dep) {
      prevRef.current = dep;
      setFlickering(true);
      const t = setTimeout(() => setFlickering(false), 120);
      return () => clearTimeout(t);
    }
  }, [dep]);
  return flickering;
}
function StatusBar({
  beat,
  coherence,
  rValue,
  gatePass,
  sovereignActive,
  connected
}) {
  const flickerBeat = useFlicker(beat);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-0 shrink-0 border-b font-mono overflow-x-auto",
      style: {
        background: T.headerBg,
        borderColor: T.border,
        height: "28px",
        scrollbarWidth: "none"
      },
      "data-ocid": "operator.status_bar.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "px-3 text-[9px] tracking-[0.18em] font-bold shrink-0 border-r",
            style: { color: T.green, borderColor: T.border },
            children: "OPERATOR TERMINAL v1"
          }
        ),
        [
          {
            label: "BEAT",
            value: shortBeat(beat),
            color: flickerBeat ? T.amber : T.cyan
          },
          {
            label: "COHERENCE",
            value: coherence.toFixed(4),
            color: coherence > 0.87 ? T.green : coherence > 0.6 ? T.amber : T.red
          },
          {
            label: "R",
            value: rValue.toFixed(4),
            color: rValue > 0.87 ? T.green : rValue > 0.6 ? T.amber : T.red
          },
          {
            label: "GATE",
            value: gatePass ? "PASS" : "FAIL",
            color: gatePass ? T.green : T.red
          }
        ].map(({ label, value, color }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-1.5 px-3 h-full shrink-0 border-r",
            style: { borderColor: T.border },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "text-[8px] tracking-[0.15em]",
                  style: { color: T.dimText },
                  children: [
                    label,
                    ":"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[9px] font-bold tracking-[0.1em]",
                  style: {
                    color,
                    textShadow: i > 0 ? `0 0 6px ${color}80` : "none",
                    transition: "color 0.2s"
                  },
                  children: value
                }
              )
            ]
          },
          label
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-1.5 px-3 h-full shrink-0 border-r",
            style: { borderColor: T.border },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "inline-block w-[5px] h-[5px] rounded-full",
                  style: {
                    background: connected ? T.green : T.dim,
                    boxShadow: connected ? `0 0 4px ${T.green}` : "none"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[8px]",
                  style: { color: connected ? T.greenDim : T.dim },
                  children: connected ? "LIVE" : "CONNECTING"
                }
              )
            ]
          }
        ),
        sovereignActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex items-center gap-1.5 px-3 h-full shrink-0 border-r",
            style: { borderColor: T.borderBright },
            "data-ocid": "operator.sovereign_active.indicator",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[8px] tracking-[0.2em] font-bold",
                style: {
                  color: T.green,
                  textShadow: `0 0 8px ${T.green}`,
                  animation: "terminal-cursor 2s ease-in-out infinite"
                },
                children: "◆ SOVEREIGN VIEW ACTIVE"
              }
            )
          }
        )
      ]
    }
  );
}
function LawEnforcementColumn({
  laws,
  beat,
  loading
}) {
  const scrollRef = reactExports.useRef(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col border-r h-full",
      style: { borderColor: T.border, minWidth: 0 },
      "data-ocid": "operator.law_proofs.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "font-mono text-[8px] tracking-[0.2em] px-2 py-1.5 border-b shrink-0 flex items-center justify-between",
            style: {
              background: T.headerBg,
              borderColor: T.border,
              color: T.green
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "60 LAW PROOFS" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: T.dimText }, children: [
                "[",
                shortBeat(beat),
                "]"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: scrollRef,
            className: "flex-1 overflow-y-auto font-mono",
            style: {
              scrollbarWidth: "thin",
              scrollbarColor: `${T.dim} transparent`
            },
            "data-ocid": "operator.law_proofs.list",
            children: loading && laws.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex items-center justify-center h-16 text-[8px] tracking-[0.15em]",
                style: { color: T.dimText },
                "data-ocid": "operator.law_proofs.loading_state",
                children: "LOADING LAW REGISTRY…"
              }
            ) : laws.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex items-center justify-center h-16 text-[8px] tracking-[0.15em]",
                style: { color: T.dimText },
                "data-ocid": "operator.law_proofs.empty_state",
                children: "AWAITING PROOF BUNDLE…"
              }
            ) : laws.map((law, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-1.5 px-2 py-[2px] border-b",
                style: {
                  borderColor: T.gridLine,
                  background: i % 2 === 0 ? "transparent" : "#01060180"
                },
                "data-ocid": `operator.law.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[7px] font-bold w-10 shrink-0",
                      style: { color: law.passed ? T.green : T.red },
                      children: law.passed ? "[PASS]" : "[FAIL]"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[7px] w-10 shrink-0 tracking-wide",
                      style: { color: law.passed ? T.greenDim : T.redDim },
                      children: law.id
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[7px] flex-1 min-w-0 truncate",
                      style: { color: law.passed ? T.green : T.red },
                      title: law.name,
                      children: law.name
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[6px] shrink-0 font-mono",
                      style: { color: T.dimText },
                      children: formatHash(law.hash)
                    }
                  )
                ]
              },
              law.id
            ))
          }
        )
      ]
    }
  );
}
function TraceEntry({ entry }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border-b px-2 py-1.5 font-mono text-[7.5px]",
      style: { borderColor: T.gridLine },
      "data-ocid": "operator.adre_trace.entry",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: T.dimText }, children: "BEAT:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: T.cyan }, children: shortBeat(entry.beat) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "ml-auto text-[6px] px-1 py-px font-bold",
              style: {
                color: entry.gateOpen ? T.green : T.red,
                background: entry.gateOpen ? `${T.green}15` : `${T.red}15`,
                border: `1px solid ${entry.gateOpen ? T.green : T.red}40`
              },
              children: [
                "GATE ",
                entry.gateOpen ? "OPEN" : "CLOSED"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-[1px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: T.dimText }, children: "> FORWARD:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "flex-1 min-w-0 truncate",
                style: { color: T.green },
                title: entry.forwardInput,
                children: entry.forwardInput || "—"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: T.dimText }, children: "> BACK-CHECK:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                style: { color: entry.backCheckPassed >= 55 ? T.green : T.amber },
                children: [
                  "laws ",
                  entry.backCheckPassed,
                  "/60 passed"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: T.dimText }, children: "> RESONANCE:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "flex-1 min-w-0 truncate",
                style: { color: T.green },
                title: entry.resonanceOutput,
                children: entry.resonanceOutput || "—"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: T.dimText }, children: "> COMPRESS:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "flex-1 min-w-0 truncate",
                style: { color: T.cyan },
                title: entry.compressOutput,
                children: entry.compressOutput || "—"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: T.dimText }, children: "> GATE:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: entry.gateOpen ? T.green : T.red }, children: entry.gateOpen ? "OPEN" : "CLOSED" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: T.dimText }, children: "| confidence:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                style: {
                  color: entry.confidence > 0.8 ? T.green : entry.confidence > 0.5 ? T.amber : T.red
                },
                children: entry.confidence.toFixed(3)
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function ADREColumn({
  trace,
  loading
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col border-r h-full",
      style: { borderColor: T.border, minWidth: 0 },
      "data-ocid": "operator.adre_trace.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "font-mono text-[8px] tracking-[0.2em] px-2 py-1.5 border-b shrink-0 flex items-center justify-between",
            style: {
              background: T.headerBg,
              borderColor: T.border,
              color: T.green
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "ADRE DELIBERATION" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: T.dimText }, children: "[5-PASS]" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex-1 overflow-y-auto",
            style: {
              scrollbarWidth: "thin",
              scrollbarColor: `${T.dim} transparent`
            },
            "data-ocid": "operator.adre_trace.list",
            children: loading && trace.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex items-center justify-center h-16 font-mono text-[8px] tracking-[0.15em]",
                style: { color: T.dimText },
                "data-ocid": "operator.adre_trace.loading_state",
                children: "AWAITING DELIBERATION CYCLE…"
              }
            ) : trace.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex items-center justify-center h-16 font-mono text-[8px] tracking-[0.15em]",
                style: { color: T.dimText },
                "data-ocid": "operator.adre_trace.empty_state",
                children: "NO TRACE DATA YET"
              }
            ) : trace.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(TraceEntry, { entry }, `${entry.beat}-${i}`))
          }
        )
      ]
    }
  );
}
function MonologueColumn({
  entries,
  loading
}) {
  var _a;
  const listRef = reactExports.useRef(null);
  const flicker = useFlicker((_a = entries[0]) == null ? void 0 : _a.beat);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { minWidth: 0 },
      "data-ocid": "operator.monologue.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "font-mono text-[8px] tracking-[0.2em] px-2 py-1.5 border-b shrink-0 flex items-center justify-between",
            style: {
              background: T.headerBg,
              borderColor: T.border,
              color: T.green
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "LIVE MIND STATE" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "text-[7px]",
                  style: {
                    color: flicker ? T.green : T.dimText,
                    transition: "color 0.15s"
                  },
                  children: [
                    entries.length,
                    " THOUGHTS"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: listRef,
            className: "flex-1 overflow-y-auto font-mono",
            style: {
              scrollbarWidth: "thin",
              scrollbarColor: `${T.dim} transparent`
            },
            "data-ocid": "operator.monologue.list",
            children: loading && entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex items-center justify-center h-16 text-[8px] tracking-[0.15em]",
                style: { color: T.dimText },
                "data-ocid": "operator.monologue.loading_state",
                children: "STREAMING MIND STATE…"
              }
            ) : entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex items-center justify-center h-16 text-[8px] tracking-[0.15em]",
                style: { color: T.dimText },
                "data-ocid": "operator.monologue.empty_state",
                children: "AWAITING FIRST THOUGHT…"
              }
            ) : entries.map((entry, i) => {
              const thoughtColor = entry.isViolation ? T.red : entry.isOmnis ? T.cyan : T.green;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex gap-1.5 px-2 py-[3px] border-b text-[7.5px]",
                  style: {
                    borderColor: T.gridLine,
                    background: entry.isViolation ? `${T.red}06` : entry.isOmnis ? `${T.cyan}05` : i === 0 ? `${T.green}05` : "transparent",
                    opacity: i === 0 && flicker ? 0.6 : 1,
                    transition: "opacity 0.12s"
                  },
                  "data-ocid": `operator.monologue.item.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0", style: { color: T.dimText }, children: [
                      "[",
                      shortBeat(entry.beat),
                      "]"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "flex-1 min-w-0 break-words leading-relaxed",
                        style: { color: thoughtColor },
                        children: entry.thought
                      }
                    )
                  ]
                },
                `${entry.beat}-${i}`
              );
            })
          }
        )
      ]
    }
  );
}
function parseLaws(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map((item, i) => {
    const obj = item;
    return {
      id: obj.id ?? `L-${String(i + 1).padStart(2, "0")}`,
      name: obj.name ?? obj.lawName ?? `LAW_${i + 1}`,
      passed: Boolean(obj.passed ?? obj.pass ?? obj.gatePass ?? true),
      hash: String(obj.hash ?? obj.sacesiHash ?? obj.provenanceHash ?? i)
    };
  });
}
function parseTrace(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, 5).map((item) => {
    const obj = item;
    return {
      beat: obj.beat ?? 0,
      forwardInput: String(obj.forwardInput ?? obj.input ?? obj.action ?? ""),
      backCheckPassed: Number(
        obj.backCheckPassed ?? obj.lawsPassed ?? obj.passes ?? 60
      ),
      resonanceOutput: String(obj.resonanceOutput ?? obj.resonance ?? ""),
      compressOutput: String(obj.compressOutput ?? obj.compressed ?? ""),
      gateOpen: Boolean(obj.gateOpen ?? obj.gateResult ?? obj.gatePass ?? true),
      confidence: Number(
        obj.confidence ?? obj.finalConfidence ?? obj.confidenceScore ?? 1
      )
    };
  });
}
function parseMonologue(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, 20).map((item) => {
    const obj = item;
    const thought = String(
      obj.thought ?? obj.text ?? obj.message ?? obj.entry ?? ""
    );
    return {
      beat: obj.beat ?? 0,
      thought,
      isOmnis: Boolean(obj.isOmnis ?? obj.omnis) || thought.toUpperCase().includes("OMNIS"),
      isViolation: Boolean(obj.isViolation ?? obj.violation) || thought.toUpperCase().includes("VIOLATION") || thought.toUpperCase().includes("FAIL")
    };
  });
}
function parseSnapshot(raw) {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw;
  return {
    beat: obj.beat ?? obj.b ?? 0,
    coherence: Number(obj.coherence ?? obj.coh ?? 0),
    rValue: Number(obj.rValue ?? obj.r ?? obj.kuramotoR ?? 0),
    gatePass: Boolean(obj.gatePass ?? obj.gate ?? true),
    adreTrace: parseTrace(obj.adreTrace ?? obj.trace ?? [])
  };
}
function OperatorTerminalTab() {
  const { actor, isFetching } = useActor();
  const [snapshot, setSnapshot] = reactExports.useState(null);
  const [laws, setLaws] = reactExports.useState([]);
  const [monologue, setMonologue] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const intervalRef = reactExports.useRef(null);
  const mountedRef = reactExports.useRef(true);
  reactExports.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  reactExports.useEffect(() => {
    if (!actor || isFetching) return;
    const poll = async () => {
      try {
        const [snapRaw, lawsRaw, monologueRaw] = await Promise.all([
          actor.getOperatorSnapshot ? actor.getOperatorSnapshot() : Promise.resolve(null),
          actor.getLawProofs ? actor.getLawProofs() : Promise.resolve([]),
          actor.getMonologueStream ? actor.getMonologueStream() : Promise.resolve([])
        ]);
        if (!mountedRef.current) return;
        const snap = parseSnapshot(snapRaw);
        if (snap) setSnapshot(snap);
        setLaws(parseLaws(lawsRaw));
        setMonologue((prev) => {
          const fresh = parseMonologue(monologueRaw);
          if (fresh.length === 0) return prev;
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
  const coherence = (snapshot == null ? void 0 : snapshot.coherence) ?? 0;
  const rValue = (snapshot == null ? void 0 : snapshot.rValue) ?? 0;
  const gatePass = (snapshot == null ? void 0 : snapshot.gatePass) ?? false;
  const adreTrace = (snapshot == null ? void 0 : snapshot.adreTrace) ?? [];
  const connected = !loading && !!snapshot;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-hidden font-mono",
      style: { background: T.bg },
      "data-ocid": "operator.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes terminal-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes terminal-scan {
          0%, 100% { transform: scaleX(0.3); opacity: 0.4; }
          50% { transform: scaleX(1); opacity: 1; }
        }
      ` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatusBar,
          {
            beat,
            coherence,
            rValue,
            gatePass,
            sovereignActive: true,
            connected
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-1 overflow-hidden min-h-0 border-t",
            style: { borderColor: T.border },
            "data-ocid": "operator.columns.section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col", style: { width: "32%", minWidth: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LawEnforcementColumn, { laws, beat, loading }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col", style: { width: "34%", minWidth: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ADREColumn, { trace: adreTrace, loading }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col", style: { width: "34%", minWidth: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MonologueColumn, { entries: monologue, loading }) })
            ]
          }
        )
      ]
    }
  );
}
export {
  OperatorTerminalTab as default
};
