import { r as reactExports, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
const BORDER = "oklch(0.18 0.05 255)";
const CYAN = "oklch(0.72 0.22 195)";
const GREEN = "oklch(0.68 0.28 140)";
const AMBER = "oklch(0.78 0.22 80)";
const RED = "oklch(0.72 0.22 25)";
const MUTED = "oklch(0.38 0.05 220)";
const DIM = "oklch(0.28 0.04 240)";
const PANEL = "oklch(0.09 0.015 265)";
const BG = "oklch(0.055 0.01 265)";
const OWNS = [
  "cognition runtime",
  "salience",
  "working memory",
  "persistence",
  "arbitration",
  "policy selection",
  "regulation",
  "cardio / ANS / interoception",
  "memory / prediction / learning",
  "sparse compute",
  "analytics core",
  "validation",
  "optimization / bounded auto-maturation",
  "readiness gate",
  "stable APIs",
  "integration contracts",
  "binding compatibility support"
];
const NOT_OWNS = [
  "war game world rendering",
  "war game terrain engine",
  "war game HUD",
  "war game combat presentation",
  "scenario builder UI",
  "command testbed presentation layer",
  "command HUD as a product UI",
  "external entity classes from other softwares"
];
const INTEGRATION_MATRIX = [
  {
    id: 1,
    direction: "IN",
    payload: "PerceptionPayload",
    purpose: "Send sensed world state into the brain",
    ownership: "War Game constructs, Core Brain validates",
    mutation: "No core mutation",
    validation: "Yes"
  },
  {
    id: 2,
    direction: "IN",
    payload: "EmbodimentPayload",
    purpose: "Send body/location/exposure/load state into the brain",
    ownership: "War Game constructs, Core Brain validates",
    mutation: "No core mutation",
    validation: "Yes"
  },
  {
    id: 3,
    direction: "IN",
    payload: "RegulationPayload",
    purpose: "Send deployment-generated stress/fatigue/urgency/body proxies",
    ownership: "War Game constructs, Core Brain validates",
    mutation: "No core mutation",
    validation: "Yes"
  },
  {
    id: 4,
    direction: "IN",
    payload: "GoalPayload",
    purpose: "Send objective/context/command state into the brain",
    ownership: "War Game constructs, Core Brain validates",
    mutation: "No core mutation",
    validation: "Yes"
  },
  {
    id: 5,
    direction: "IN",
    payload: "External action/outcome traces",
    purpose: "Send result data back into analytics/validation pathways",
    ownership: "War Game constructs, Core Brain ingests",
    mutation: "Only through bounded validation paths",
    validation: "Yes"
  },
  {
    id: 6,
    direction: "OUT",
    payload: "BrainActionPacket",
    purpose: "Send action decisions to the war game",
    ownership: "Core Brain constructs, War Game consumes",
    mutation: "War Game executes in its own domain only",
    validation: "Schema compatibility required"
  },
  {
    id: 7,
    direction: "OUT",
    payload: "Analytics / Health / Readiness",
    purpose: "Expose brain-side state summaries",
    ownership: "Core Brain constructs, War Game views",
    mutation: "No",
    validation: "Version compatibility required"
  },
  {
    id: 8,
    direction: "IN",
    payload: "Scenario PerceptionPayload",
    purpose: "Send scenario-scale perceived state into the brain",
    ownership: "Scenario constructs, Core Brain validates",
    mutation: "No core mutation",
    validation: "Yes"
  },
  {
    id: 9,
    direction: "IN",
    payload: "Scenario EmbodimentPayload",
    purpose: "Send context/body/scope state into the brain",
    ownership: "Scenario constructs, Core Brain validates",
    mutation: "No core mutation",
    validation: "Yes"
  },
  {
    id: 10,
    direction: "IN",
    payload: "Scenario RegulationPayload",
    purpose: "Send command burden/casualty/supply/urgency signals",
    ownership: "Scenario constructs, Core Brain validates",
    mutation: "No core mutation",
    validation: "Yes"
  },
  {
    id: 11,
    direction: "IN",
    payload: "Scenario GoalPayload",
    purpose: "Send command objectives/doctrine/chain context",
    ownership: "Scenario constructs, Core Brain validates",
    mutation: "No core mutation",
    validation: "Yes"
  },
  {
    id: 12,
    direction: "IN",
    payload: "Experiment results / command outcomes",
    purpose: "Send evaluation outcomes into analytics/validation",
    ownership: "Scenario constructs, Core Brain ingests",
    mutation: "Only through bounded validation paths",
    validation: "Yes"
  },
  {
    id: 13,
    direction: "OUT",
    payload: "BrainActionPacket",
    purpose: "Send command/operational decisions back",
    ownership: "Core Brain constructs, Scenario consumes",
    mutation: "Scenario executes in its own domain only",
    validation: "Schema compatibility required"
  },
  {
    id: 14,
    direction: "OUT",
    payload: "Analytics / Health / Readiness",
    purpose: "Expose brain-side state summaries",
    ownership: "Core Brain constructs, Scenario views",
    mutation: "No",
    validation: "Version compatibility required"
  }
];
const BLOCKED_OPS = [
  "direct mutation of connection weights",
  "direct mutation of thresholds",
  "direct mutation of memory stores",
  "direct promotion of candidate changes",
  "direct bypass of arbitration/policy logic",
  "deployment-side authored semantic injections into the brain core"
];
const VERSIONING_RULES = [
  "All payload schemas must have explicit version identifiers",
  "All adapters must declare supported contract version",
  "Core Brain must reject incompatible adapter versions",
  "Backward compatibility rules must be explicit",
  "Any breaking API/schema change requires version bump and migration note"
];
const COMPATIBILITY_RULES = [
  "War Game adapter compatibility must be validated before session starts",
  "Real War Scenario adapter compatibility must be validated before session starts",
  "Binding maps must be validated before activation",
  "Unsupported role/scope overlays must be rejected"
];
const MAY_DO = [
  "create instances",
  "send typed payloads",
  "step instances",
  "receive actions",
  "read analytics",
  "ingest outcome traces",
  "submit candidate changes through bounded validation"
];
const MAY_NOT_DO = [
  "directly change weights",
  "directly change thresholds",
  "directly change memory stores",
  "directly alter optimization promotion state",
  "directly bypass arbitration/policy selection",
  "directly write semantic authored conclusions into the core"
];
const CANDIDATE_RULES = [
  "all candidate changes require source attribution",
  "all candidate changes require validation queue entry",
  "all candidate changes require rollback path",
  "no candidate change may promote directly without validation"
];
function FlowNode({ label, sub }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "px-3 py-2 border text-center flex flex-col gap-0.5",
      style: {
        background: "oklch(0.08 0.015 265)",
        borderColor: `${CYAN}60`,
        minWidth: 120
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[9px] tracking-wider",
            style: { color: CYAN },
            children: label
          }
        ),
        sub && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: MUTED }, children: sub })
      ]
    }
  );
}
function FlowArrow({
  label,
  color = CYAN
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center",
      style: { minWidth: 32 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: { width: 1, height: label ? 6 : 10, background: `${color}60` }
          }
        ),
        label && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[6px] tracking-wider px-1",
            style: { color: MUTED, whiteSpace: "nowrap" },
            children: label
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              width: 0,
              height: 0,
              borderLeft: "4px solid transparent",
              borderRight: "4px solid transparent",
              borderTop: `5px solid ${color}80`
            }
          }
        )
      ]
    }
  );
}
function SystemMapTab({ neural: _neural }) {
  const [versioningOpen, setVersioningOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-y-auto",
      style: { background: BG, color: "oklch(0.75 0.06 220)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "shrink-0 px-6 py-4 border-b",
            style: { borderColor: BORDER, background: "oklch(0.07 0.012 265)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[11px] tracking-widest uppercase",
                  style: { color: MUTED },
                  children: "PACK 1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h1",
                {
                  className: "font-mono text-lg tracking-widest uppercase",
                  style: { color: CYAN },
                  children: "SYSTEM MAP"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px]", style: { color: MUTED }, children: "Core Brain Software — Master Architecture Reference" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5 p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[9px] tracking-widest uppercase mb-2",
                style: { color: MUTED },
                children: "SOFTWARE IDENTITY"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "border p-3 flex flex-col gap-2",
                  style: {
                    background: PANEL,
                    borderColor: `${GREEN}40`,
                    borderLeft: `2px solid ${GREEN}`
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "font-mono text-[8px] tracking-widest uppercase mb-1",
                        style: { color: GREEN },
                        children: "THIS SOFTWARE OWNS"
                      }
                    ),
                    OWNS.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px] mt-0.5",
                          style: { color: GREEN },
                          children: "✓"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px]",
                          style: { color: "oklch(0.62 0.1 150)" },
                          children: item
                        }
                      )
                    ] }, item))
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "border p-3 flex flex-col gap-2",
                  style: {
                    background: PANEL,
                    borderColor: `${AMBER}40`,
                    borderLeft: `2px solid ${AMBER}`
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "font-mono text-[8px] tracking-widest uppercase mb-1",
                        style: { color: AMBER },
                        children: "THIS SOFTWARE DOES NOT OWN"
                      }
                    ),
                    NOT_OWNS.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px] mt-0.5",
                          style: { color: AMBER },
                          children: "○"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px]",
                          style: { color: "oklch(0.55 0.1 80)" },
                          children: item
                        }
                      )
                    ] }, item))
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "system_map.card",
              className: "border p-4 font-mono text-[9px] text-center tracking-wide",
              style: {
                background: "oklch(0.07 0.01 265)",
                borderColor: `${CYAN}50`,
                color: CYAN,
                boxShadow: `0 0 20px ${CYAN}15`
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "text-[7px] tracking-widest uppercase mb-1",
                    style: { color: MUTED },
                    children: "ASSET RULE"
                  }
                ),
                "This software is the intelligence asset. The other two softwares are deployments.",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                "No deployment may directly mutate the core asset."
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[9px] tracking-widest uppercase mb-3",
                style: { color: MUTED },
                children: "HIGH-LEVEL FLOW"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "border p-4 flex flex-col gap-4",
                style: { background: PANEL, borderColor: BORDER },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0 flex-wrap", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FlowNode, { label: "War Game Software" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FlowArrow, {}),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FlowNode,
                        {
                          label: "WarGameIntegrationAdapter",
                          sub: "translation layer"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FlowArrow, {}),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FlowNode, { label: "Core Brain APIs", sub: "Integration Contracts" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FlowArrow, {}),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FlowNode, { label: "Core Brain Runtime", sub: "intelligence asset" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0 flex-wrap", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FlowNode, { label: "Real War Scenario", sub: "Software" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FlowArrow, {}),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FlowNode,
                        {
                          label: "CommandTestbedAdapter",
                          sub: "translation layer"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FlowArrow, {}),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FlowNode, { label: "Core Brain APIs", sub: "Integration Contracts" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FlowArrow, {}),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FlowNode, { label: "Core Brain Runtime", sub: "intelligence asset" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t", style: { borderColor: BORDER } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "font-mono text-[7px] tracking-widest uppercase mb-1",
                        style: { color: MUTED },
                        children: "RETURN FLOW"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0 flex-wrap", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FlowNode, { label: "Core Brain Runtime", sub: "intelligence asset" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FlowArrow, { color: GREEN }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FlowNode,
                        {
                          label: "BrainActionPacket",
                          sub: "Analytics / Health / Readiness"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FlowArrow, { color: GREEN }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FlowNode, { label: "adapters" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FlowArrow, { color: GREEN }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FlowNode, { label: "external softwares" })
                    ] })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[9px] tracking-widest uppercase mb-2",
                style: { color: MUTED },
                children: "CROSS-SOFTWARE INTEGRATION MATRIX"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "border overflow-x-auto",
                style: { background: PANEL, borderColor: BORDER },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "table",
                  {
                    className: "w-full font-mono text-[8px]",
                    "data-ocid": "system_map.table",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "tr",
                        {
                          style: {
                            background: "oklch(0.07 0.012 265)",
                            borderBottom: `1px solid ${BORDER}`
                          },
                          children: [
                            "#",
                            "DIR",
                            "PAYLOAD",
                            "PURPOSE",
                            "OWNERSHIP",
                            "MUTATION",
                            "VALIDATION"
                          ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "th",
                            {
                              className: "px-2 py-2 text-left tracking-widest",
                              style: { color: MUTED },
                              children: h
                            },
                            h
                          ))
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: INTEGRATION_MATRIX.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "tr",
                        {
                          "data-ocid": `system_map.row.${i + 1}`,
                          className: "border-b",
                          style: { borderColor: `${BORDER}60` },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5", style: { color: DIM }, children: row.id }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "px-1.5 py-0.5 font-mono text-[7px] tracking-widest",
                                style: {
                                  background: row.direction === "IN" ? "oklch(0.72 0.22 195 / 0.15)" : "oklch(0.68 0.28 140 / 0.15)",
                                  color: row.direction === "IN" ? CYAN : GREEN,
                                  border: `1px solid ${row.direction === "IN" ? CYAN : GREEN}40`
                                },
                                children: row.direction
                              }
                            ) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5", style: { color: CYAN }, children: row.payload }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "td",
                              {
                                className: "px-2 py-1.5",
                                style: { color: "oklch(0.55 0.06 220)" },
                                children: row.purpose
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5", style: { color: DIM }, children: row.ownership }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  color: row.mutation === "No" || row.mutation === "No core mutation" ? RED : row.mutation.startsWith("Only") ? AMBER : "oklch(0.55 0.06 220)"
                                },
                                children: row.mutation
                              }
                            ) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  color: row.validation === "Yes" ? GREEN : AMBER
                                },
                                children: row.validation
                              }
                            ) })
                          ]
                        },
                        row.id
                      )) })
                    ]
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[9px] tracking-widest uppercase mb-2",
                style: { color: MUTED },
                children: "BLOCKED OPERATIONS"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "border p-4 flex flex-col gap-2",
                style: {
                  background: "oklch(0.07 0.01 265)",
                  borderColor: `${RED}60`,
                  borderLeft: `3px solid ${RED}`
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[8px] tracking-widest uppercase mb-1",
                      style: { color: RED },
                      children: "BLOCKED EVERYWHERE"
                    }
                  ),
                  BLOCKED_OPS.map((op) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[8px]", style: { color: RED }, children: "✗" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[8px]",
                        style: { color: "oklch(0.55 0.12 25)" },
                        children: op
                      }
                    )
                  ] }, op))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "system_map.versioning.toggle",
                className: "w-full flex items-center justify-between px-3 py-2 border font-mono text-[9px] tracking-widest uppercase transition-all",
                style: {
                  background: versioningOpen ? PANEL : "oklch(0.07 0.012 265)",
                  borderColor: BORDER,
                  color: versioningOpen ? CYAN : MUTED
                },
                onClick: () => setVersioningOpen((v) => !v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "VERSIONING RULES — PACK 6" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: MUTED }, children: versioningOpen ? "▲" : "▼" })
                ]
              }
            ),
            versioningOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "border border-t-0 p-4 flex flex-col gap-2",
                style: { background: PANEL, borderColor: BORDER },
                children: [...VERSIONING_RULES, ...COMPATIBILITY_RULES].map((rule) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px] mt-0.5",
                      style: { color: CYAN },
                      children: "→"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px]",
                      style: { color: "oklch(0.55 0.06 220)" },
                      children: rule
                    }
                  )
                ] }, rule))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[9px] tracking-widest uppercase mb-2",
                style: { color: MUTED },
                children: "MUTATION-BOUNDARY RULES"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "border p-3 flex flex-col gap-2",
                  style: {
                    background: PANEL,
                    borderColor: `${GREEN}40`,
                    borderLeft: `2px solid ${GREEN}`
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "font-mono text-[8px] tracking-widest uppercase mb-1",
                        style: { color: GREEN },
                        children: "MAY DO"
                      }
                    ),
                    MAY_DO.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px] mt-0.5",
                          style: { color: GREEN },
                          children: "✓"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px]",
                          style: { color: "oklch(0.55 0.08 150)" },
                          children: item
                        }
                      )
                    ] }, item))
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "border p-3 flex flex-col gap-2",
                  style: {
                    background: PANEL,
                    borderColor: `${RED}40`,
                    borderLeft: `2px solid ${RED}`
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "font-mono text-[8px] tracking-widest uppercase mb-1",
                        style: { color: RED },
                        children: "MAY NOT DO"
                      }
                    ),
                    MAY_NOT_DO.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px] mt-0.5",
                          style: { color: RED },
                          children: "✗"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px]",
                          style: { color: "oklch(0.55 0.12 25)" },
                          children: item
                        }
                      )
                    ] }, item))
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[9px] tracking-widest uppercase mb-2",
                style: { color: MUTED },
                children: "CANDIDATE CHANGE RULES"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "border p-4 flex flex-col gap-2",
                style: { background: PANEL, borderColor: `${AMBER}40` },
                children: CANDIDATE_RULES.map((rule, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-start gap-2",
                    "data-ocid": `system_map.item.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px] px-1 shrink-0",
                          style: {
                            background: "oklch(0.78 0.22 80 / 0.15)",
                            color: AMBER,
                            border: `1px solid ${AMBER}30`
                          },
                          children: i + 1
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px]",
                          style: { color: "oklch(0.55 0.1 80)" },
                          children: rule
                        }
                      )
                    ]
                  },
                  rule
                ))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "border p-4 font-mono text-[9px] text-center tracking-wide",
              style: {
                background: "oklch(0.06 0.01 25)",
                borderColor: `${RED}60`,
                color: RED,
                boxShadow: `0 0 20px ${RED}10`,
                marginBottom: "1rem"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "text-[7px] tracking-widest uppercase mb-2",
                    style: { color: "oklch(0.45 0.08 25)" },
                    children: "FINAL RULE"
                  }
                ),
                "If compatibility is unclear, reject. If mutation is unsafe, reject. If validation is missing, reject."
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  SystemMapTab as default
};
