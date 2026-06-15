import { r as reactExports, u as useActor, z as usePresenceCharge, p as useDischargeQuantumBattery, d as useSetCreatorPrincipal, A as useMutation, j as jsxRuntimeExports, B as useMemoryTempleState } from "./index-CGYrnU7d.js";
const C = {
  bg: "oklch(0.06 0.01 265)",
  panel: "oklch(0.09 0.015 265)",
  border: "oklch(0.2 0.05 255)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.82 0.22 80)",
  dim: "oklch(0.38 0.05 220)",
  text: "oklch(0.85 0.05 210)",
  red: "oklch(0.65 0.25 25)",
  green: "oklch(0.68 0.28 140)"
};
function now() {
  return (/* @__PURE__ */ new Date()).toTimeString().slice(0, 8);
}
function CmdButton({
  label,
  desc,
  color,
  onClick,
  loading,
  warning
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border rounded p-3 space-y-2",
      style: {
        borderColor: warning ? C.red : C.border,
        background: warning ? "oklch(0.65 0.25 25 / 0.05)" : C.panel
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "font-mono text-[8px] leading-relaxed",
            style: { color: C.dim },
            children: desc
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            disabled: loading,
            onClick,
            className: "w-full font-mono text-[9px] tracking-widest uppercase px-3 py-2 border transition-all disabled:opacity-50",
            style: {
              borderColor: color,
              color,
              background: `${color.replace(")", " / 0.08)")}`
            },
            children: loading ? "EXECUTING…" : label
          }
        )
      ]
    }
  );
}
function MemoryTempleDiagnostics() {
  const { data } = useMemoryTempleState();
  const val = (v, decimals) => {
    if (v === void 0 || v === null) return "---";
    if (typeof v === "number" && decimals !== void 0)
      return v.toFixed(decimals);
    return String(v);
  };
  const rows = [
    {
      label: "EPISODIC",
      value: data ? String(data.episodic_count) : "---",
      color: C.cyan
    },
    {
      label: "SEMANTIC",
      value: data ? String(data.semantic_count) : "---",
      color: "oklch(0.72 0.22 280)"
    },
    {
      label: "DOCTRINE",
      value: data ? String(data.doctrine_count) : "---",
      color: C.gold
    },
    {
      label: "MISSION",
      value: data ? String(data.mission_count) : "---",
      color: C.red
    },
    {
      label: "PEDESTAL PHASE SUM",
      value: val(data == null ? void 0 : data.pedestal_phase_sum, 4),
      color: C.cyan
    },
    {
      label: "ANALYST QUEUE",
      value: data ? `${data.analyst_queue.length} items` : "---",
      color: "oklch(0.72 0.22 280)"
    },
    {
      label: "MEMORY COHERENCE",
      value: val(data == null ? void 0 : data.memory_coherence, 4),
      color: C.green
    },
    {
      label: "RETRIEVAL BIAS",
      value: data ? data.current_retrieval_bias.toUpperCase() : "---",
      color: C.gold
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border rounded p-3 space-y-2",
      style: { borderColor: C.border, background: C.panel },
      "data-ocid": "command.memory-temple.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[9px] tracking-[0.2em] font-bold uppercase",
              style: { color: C.gold },
              children: "MEMORY TEMPLE"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex-1 h-px",
              style: { background: "oklch(0.18 0.04 255)" }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: rows.map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-baseline", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[7.5px] tracking-[0.12em]",
              style: { color: C.dim },
              children: label
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8.5px] font-bold",
              style: { color },
              children: value
            }
          )
        ] }, label)) })
      ]
    }
  );
}
function CommandTab({ isLoggedIn }) {
  const [log, setLog] = reactExports.useState([]);
  const [threat, setThreat] = reactExports.useState(0.5);
  const [novelty, setNovelty] = reactExports.useState(0.5);
  const [embodiment, setEmbodiment] = reactExports.useState(0.5);
  const [social, setSocial] = reactExports.useState(0.5);
  const [btcPrice, setBtcPrice] = reactExports.useState(65e3);
  const [ethPrice, setEthPrice] = reactExports.useState(3200);
  const [icpPrice, setIcpPrice] = reactExports.useState(12);
  const addLog = (cmd, result, ok) => {
    setLog((prev) => [{ ts: now(), cmd, result, ok }, ...prev].slice(0, 50));
  };
  const { actor } = useActor();
  const presenceCharge = usePresenceCharge();
  const dischargeQ = useDischargeQuantumBattery();
  const setCreator = useSetCreatorPrincipal();
  const injectPerceptionMut = useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.injectPerception(
        threat,
        novelty,
        embodiment,
        social
      );
    },
    onSuccess: () => addLog(
      "INJECT_PERCEPTION",
      `T:${threat.toFixed(2)} N:${novelty.toFixed(2)} E:${embodiment.toFixed(2)} S:${social.toFixed(2)}`,
      true
    ),
    onError: (e) => addLog("INJECT_PERCEPTION", e.message, false)
  });
  const setTreasurySigMut = useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.setTreasurySignals(btcPrice, ethPrice, icpPrice);
    },
    onSuccess: () => addLog(
      "SET_TREASURY_SIGNALS",
      `BTC:${btcPrice} ETH:${ethPrice} ICP:${icpPrice}`,
      true
    ),
    onError: (e) => addLog("SET_TREASURY_SIGNALS", e.message, false)
  });
  if (!isLoggedIn) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "h-full flex flex-col items-center justify-center gap-4",
        style: { background: C.bg },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[48px]",
              style: { color: "oklch(0.18 0.05 265)" },
              children: "ψ"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[11px] tracking-widest uppercase",
              style: { color: C.dim },
              children: "CREATOR AUTHENTICATION REQUIRED"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[9px] text-center max-w-xs",
              style: { color: "oklch(0.3 0.04 220)" },
              children: "Use the LOGIN button in the header to authenticate with Internet Identity and access the Command Terminal."
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full overflow-y-auto p-4", style: { background: C.bg }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h2",
        {
          className: "font-mono text-[11px] tracking-widest uppercase font-bold",
          style: { color: C.gold },
          children: "ψ CREATOR COMMAND TERMINAL"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "font-mono text-[9px] tracking-widest mt-1",
          style: { color: C.dim },
          children: "DIRECT ORGANISM CONTROL — ALL ACTIONS AUTHENTICATED AND LOGGED"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "font-mono text-[9px] tracking-widest uppercase",
            style: { color: C.dim },
            children: "COMMANDS"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CmdButton,
          {
            label: "PRESENCE CHARGE",
            desc: "Activates SOVEREIGN mode. Quantum battery charges at 10× for 100 beats.",
            color: C.gold,
            loading: presenceCharge.isPending,
            onClick: () => {
              presenceCharge.mutate(void 0, {
                onSuccess: () => addLog(
                  "PRESENCE_CHARGE",
                  "SOVEREIGN MODE ACTIVATED · Quantum battery at 10× charge",
                  true
                ),
                onError: (e) => addLog("PRESENCE_CHARGE", e.message, false)
              });
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CmdButton,
          {
            label: "DISCHARGE QUANTUM BATTERY",
            desc: "Sweeps full quantum reserve balance into creator MTH reserve in one beat.",
            color: C.cyan,
            loading: dischargeQ.isPending,
            onClick: () => {
              dischargeQ.mutate(void 0, {
                onSuccess: (amount) => {
                  var _a;
                  return addLog(
                    "DISCHARGE_QUANTUM",
                    `DISCHARGE COMPLETE · ${((_a = amount == null ? void 0 : amount.toFixed) == null ? void 0 : _a.call(amount, 6)) ?? "?"} MTH routed to creator reserve`,
                    true
                  );
                },
                onError: (e) => addLog("DISCHARGE_QUANTUM", e.message, false)
              });
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-3 space-y-3",
            style: { borderColor: C.border, background: C.panel },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[8px] tracking-widest uppercase",
                  style: { color: C.dim },
                  children: "INJECT PERCEPTION"
                }
              ),
              [
                ["THREAT", threat, setThreat],
                ["NOVELTY", novelty, setNovelty],
                ["EMBODIMENT", embodiment, setEmbodiment],
                ["SOCIAL", social, setSocial]
              ].map(([lbl, val, setter]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px]",
                      style: { color: C.dim },
                      children: lbl
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px]",
                      style: { color: C.cyan },
                      children: val.toFixed(2)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "range",
                    min: 0,
                    max: 1,
                    step: 0.01,
                    value: val,
                    onChange: (e) => setter(Number(e.target.value)),
                    className: "w-full h-1 accent-cyan-400",
                    "data-ocid": `command.${lbl.toLowerCase()}.input`
                  }
                )
              ] }, lbl)),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  disabled: injectPerceptionMut.isPending,
                  onClick: () => injectPerceptionMut.mutate(),
                  className: "w-full font-mono text-[9px] tracking-widest uppercase px-3 py-2 border transition-all disabled:opacity-50",
                  style: {
                    borderColor: C.cyan,
                    color: C.cyan,
                    background: "oklch(0.72 0.22 195 / 0.08)"
                  },
                  "data-ocid": "command.inject.button",
                  children: injectPerceptionMut.isPending ? "INJECTING…" : "INJECT"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-3 space-y-3",
            style: { borderColor: C.border, background: C.panel },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[8px] tracking-widest uppercase",
                  style: { color: C.dim },
                  children: "SET TREASURY SIGNALS"
                }
              ),
              [
                ["BTC PRICE (USD)", btcPrice, setBtcPrice],
                ["ETH PRICE (USD)", ethPrice, setEthPrice],
                ["ICP PRICE (USD)", icpPrice, setIcpPrice]
              ].map(([lbl, val, setter]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px]",
                      style: { color: C.dim },
                      children: lbl
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[8px]",
                      style: { color: C.gold },
                      children: [
                        "$",
                        val.toLocaleString()
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    value: val,
                    onChange: (e) => setter(Number(e.target.value)),
                    className: "w-full font-mono text-[9px] px-2 py-1 border rounded bg-transparent",
                    style: { borderColor: C.border, color: C.text },
                    "data-ocid": `command.${lbl.split(" ")[0].toLowerCase()}.input`
                  }
                )
              ] }, lbl)),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  disabled: setTreasurySigMut.isPending,
                  onClick: () => setTreasurySigMut.mutate(),
                  className: "w-full font-mono text-[9px] tracking-widest uppercase px-3 py-2 border transition-all disabled:opacity-50",
                  style: {
                    borderColor: C.gold,
                    color: C.gold,
                    background: "oklch(0.82 0.22 80 / 0.08)"
                  },
                  "data-ocid": "command.treasury.button",
                  children: setTreasurySigMut.isPending ? "UPDATING…" : "SET SIGNALS"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-3 space-y-2",
            style: {
              borderColor: C.red,
              background: "oklch(0.65 0.25 25 / 0.05)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[8px] leading-relaxed",
                  style: { color: C.dim },
                  children: "One-time permanent principal binding. Cannot be undone."
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[7px] tracking-widest p-2 rounded",
                  style: {
                    color: C.red,
                    background: "oklch(0.65 0.25 25 / 0.1)",
                    border: "1px solid oklch(0.65 0.25 25 / 0.3)"
                  },
                  children: "⚠ WARNING: This action permanently binds your Internet Identity principal to this canister. Irreversible."
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  disabled: setCreator.isPending,
                  onClick: () => {
                    setCreator.mutate(void 0, {
                      onSuccess: () => addLog(
                        "LOCK_CREATOR_IDENTITY",
                        "CREATOR IDENTITY LOCKED · Principal bound to canister",
                        true
                      ),
                      onError: (e) => addLog("LOCK_CREATOR_IDENTITY", e.message, false)
                    });
                  },
                  className: "w-full font-mono text-[9px] tracking-widest uppercase px-3 py-2 border transition-all disabled:opacity-50",
                  style: {
                    borderColor: C.red,
                    color: C.red,
                    background: "oklch(0.65 0.25 25 / 0.08)"
                  },
                  "data-ocid": "command.lock_identity.button",
                  children: setCreator.isPending ? "LOCKING…" : "LOCK CREATOR IDENTITY"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MemoryTempleDiagnostics, {})
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "font-mono text-[9px] tracking-widest uppercase",
            style: { color: C.dim },
            children: "RESPONSE LOG"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-3 h-96 md:h-full overflow-y-auto space-y-1",
            style: { borderColor: C.border, background: C.panel },
            "data-ocid": "command.log.panel",
            children: [
              log.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[9px] tracking-widest",
                  style: { color: "oklch(0.22 0.04 255)" },
                  children: "AWAITING COMMANDS…"
                }
              ) }),
              log.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "font-mono text-[8px] leading-relaxed border-b py-1",
                  style: { borderColor: "oklch(0.15 0.03 255)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: C.dim }, children: [
                      "[",
                      entry.ts,
                      "] "
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.cyan }, children: entry.cmd }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.dim }, children: " · " }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: entry.ok ? C.green : C.red }, children: entry.result })
                  ]
                },
                i
              ))
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  CommandTab as default
};
