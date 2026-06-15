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
const QA_LS_KEY = "brain_qa_release_checklist";
const API_GROUPS = [
  {
    id: "lifecycle",
    label: "Instance Lifecycle API",
    functions: [
      {
        name: "create_instance",
        signature: "create_instance(config) -> instance_id",
        description: "Create a new brain instance with the given config",
        fields: [
          "instance_type",
          "role_type",
          "authority_level",
          "scope_type",
          "deployment_type",
          "doctrine_profile",
          "perception_profile",
          "action_profile",
          "memory_horizon_profile"
        ],
        returns: "instance_id: string"
      },
      {
        name: "destroy_instance",
        signature: "destroy_instance(instance_id)",
        description: "Permanently destroy a brain instance"
      },
      {
        name: "pause_instance",
        signature: "pause_instance(instance_id)",
        description: "Pause all runtime loops for an instance"
      },
      {
        name: "resume_instance",
        signature: "resume_instance(instance_id)",
        description: "Resume a paused brain instance"
      },
      {
        name: "reset_instance",
        signature: "reset_instance(instance_id)",
        description: "Reset instance state to initialized baseline"
      },
      {
        name: "get_instance_state",
        signature: "get_instance_state(instance_id) -> InstanceState",
        description: "Retrieve current lifecycle state",
        returns: "InstanceState"
      }
    ]
  },
  {
    id: "input",
    label: "Input APIs",
    functions: [
      {
        name: "update_perception",
        signature: "update_perception(instance_id, perception_payload)",
        description: "Send sensed world state into the brain",
        fields: [
          "visible_entities[]",
          "audible_events[]",
          "terrain_features[]",
          "route_options[]",
          "local_allies[]",
          "local_enemies[]",
          "objective_markers[]",
          "environment_modifiers[]",
          "uncertainty_estimates[]",
          "time_context",
          "region_context"
        ]
      },
      {
        name: "update_embodiment",
        signature: "update_embodiment(instance_id, embodiment_payload)",
        description: "Send body/location/exposure/load state into the brain",
        fields: [
          "location",
          "orientation",
          "movement_state",
          "stance",
          "exposure",
          "cover_quality",
          "load_burden",
          "equipment_weight",
          "damage_state",
          "exertion_level",
          "local_constraints"
        ]
      },
      {
        name: "update_regulation_state",
        signature: "update_regulation_state(instance_id, regulation_payload)",
        description: "Send stress/fatigue/urgency/body proxies into the brain",
        fields: [
          "stress_signal",
          "recovery_signal",
          "fatigue_load",
          "urgency_pressure",
          "overload_level",
          "confidence_pressure",
          "heart_rate_proxy",
          "hrv_proxy",
          "recovery_capacity_proxy",
          "sympathetic_tone",
          "parasympathetic_tone",
          "autonomic_balance_index"
        ]
      },
      {
        name: "update_goal_context",
        signature: "update_goal_context(instance_id, goal_payload)",
        description: "Send objective/context/command state into the brain",
        fields: [
          "primary_goal",
          "secondary_goals[]",
          "mission_relevance",
          "objective_priority",
          "rules_of_engagement",
          "command_directives[]",
          "faction_state_summary",
          "squad_state_summary",
          "command_chain_context"
        ]
      }
    ]
  },
  {
    id: "runtime",
    label: "Runtime API",
    functions: [
      {
        name: "step_instance",
        signature: "step_instance(instance_id, runtime_context) -> BrainStepResult",
        description: "Advance brain runtime by one tick",
        fields: [
          "dt",
          "loop_type",
          "current_time",
          "simulation_phase",
          "event_flags[]"
        ],
        returns: "BrainStepResult: { action_packet, analytics_delta, health_status, events_emitted[] }"
      }
    ]
  },
  {
    id: "output",
    label: "Output APIs",
    functions: [
      {
        name: "get_action_output",
        signature: "get_action_output(instance_id) -> BrainActionPacket",
        description: "Retrieve the current action decision from the brain",
        fields: [
          "policy_type",
          "action_priority",
          "route_id",
          "target_id",
          "movement_intent",
          "support_request",
          "medic_request",
          "regroup_flag",
          "retreat_flag",
          "escalation_flag",
          "formation_shift",
          "relay_command",
          "rationale_summary",
          "confidence_score"
        ],
        returns: "BrainActionPacket"
      }
    ]
  },
  {
    id: "analytics",
    label: "Analytics APIs",
    functions: [
      {
        name: "get_analytics_snapshot",
        signature: "get_analytics_snapshot(instance_id) -> AnalyticsSnapshot",
        description: "Full analytics snapshot for a single instance"
      },
      {
        name: "get_group_analytics",
        signature: "get_group_analytics(group_id) -> GroupAnalytics",
        description: "Aggregated analytics for a group of instances"
      },
      {
        name: "get_command_analytics",
        signature: "get_command_analytics(command_id) -> CommandAnalytics",
        description: "Command-level aggregated analytics"
      },
      {
        name: "get_brain_health",
        signature: "get_brain_health() -> BrainHealthReport",
        description: "Overall brain health summary"
      },
      {
        name: "get_connection_metrics",
        signature: "get_connection_metrics() -> ConnectionMetrics",
        description: "Connection registry and motif health metrics"
      },
      {
        name: "get_emergence_metrics",
        signature: "get_emergence_metrics() -> EmergenceMetrics",
        description: "Emergence score and indicator vector"
      },
      {
        name: "get_readiness_status",
        signature: "get_readiness_status() -> ReadinessStatus",
        description: "Current readiness gate status"
      }
    ]
  },
  {
    id: "validation",
    label: "Validation / Optimization APIs",
    functions: [
      {
        name: "run_ablation",
        signature: "run_ablation(config) -> AblationResult",
        description: "Run controlled ablation test batch"
      },
      {
        name: "run_perturbation",
        signature: "run_perturbation(config) -> PerturbationResult",
        description: "Run perturbation experiment batch"
      },
      {
        name: "compare_baseline",
        signature: "compare_baseline(config) -> BaselineComparison",
        description: "Compare current performance against baseline"
      },
      {
        name: "get_maturation_recommendations",
        signature: "get_maturation_recommendations() -> Recommendation[]",
        description: "Get auto-maturation candidate list"
      },
      {
        name: "get_validation_summary",
        signature: "get_validation_summary() -> ValidationSummary",
        description: "Aggregate validation status across all modules"
      },
      {
        name: "submit_candidate_change",
        signature: "submit_candidate_change(candidate_config) -> SubmissionReceipt",
        description: "Submit bounded candidate change for validation queue",
        fields: [
          "source_attribution (required)",
          "evidence[] (required)",
          "rollback_path (required)",
          "change_description",
          "affected_subsystems[]"
        ]
      }
    ]
  },
  {
    id: "integration",
    label: "Integration Contract APIs",
    functions: [
      {
        name: "register_adapter",
        signature: "register_adapter(adapter_manifest) -> adapter_id",
        description: "Register an external adapter with the contract registry",
        fields: [
          "adapter_name",
          "deployment_type",
          "contract_version",
          "supported_payload_versions",
          "supported_instance_types",
          "supported_role_overlays",
          "supported_scope_overlays",
          "analytics_ingest_capabilities"
        ]
      },
      {
        name: "validate_adapter_compatibility",
        signature: "validate_adapter_compatibility(adapter_id) -> CompatibilityResult",
        description: "Validate adapter version and schema compatibility"
      },
      {
        name: "begin_adapter_session",
        signature: "begin_adapter_session(adapter_id) -> session_token",
        description: "Start an authenticated adapter session"
      },
      {
        name: "end_adapter_session",
        signature: "end_adapter_session(adapter_id)",
        description: "Terminate an active adapter session"
      },
      {
        name: "get_supported_contract_versions",
        signature: "get_supported_contract_versions() -> string[]",
        description: "List all supported contract versions"
      },
      {
        name: "get_supported_instance_types",
        signature: "get_supported_instance_types() -> InstanceType[]",
        description: "List all canonical instance types"
      },
      {
        name: "get_supported_role_overlays",
        signature: "get_supported_role_overlays() -> RoleOverlay[]",
        description: "List all supported role overlays"
      },
      {
        name: "get_supported_scope_overlays",
        signature: "get_supported_scope_overlays() -> ScopeOverlay[]",
        description: "List all supported scope overlays"
      },
      {
        name: "get_required_payload_fields",
        signature: "get_required_payload_fields(instance_type, role_type, scope_type) -> FieldSpec[]",
        description: "Get required fields for a given binding combination"
      },
      {
        name: "validate_binding_map",
        signature: "validate_binding_map(binding_map) -> ValidationResult",
        description: "Validate an external binding map against core contracts"
      },
      {
        name: "get_binding_requirements",
        signature: "get_binding_requirements(instance_type) -> BindingRequirements",
        description: "Get binding requirements for a given instance type"
      },
      {
        name: "get_overlay_requirements",
        signature: "get_overlay_requirements(role_type, scope_type) -> OverlayRequirements",
        description: "Get overlay requirements for role/scope combination"
      }
    ]
  },
  {
    id: "ingest",
    label: "External Analytics Ingest APIs",
    functions: [
      {
        name: "ingest_external_action_result",
        signature: "ingest_external_action_result(payload)",
        description: "Ingest action execution result from external software",
        fields: [
          "source_attribution",
          "schema_version",
          "instance_id",
          "action_taken",
          "outcome",
          "timestamp"
        ]
      },
      {
        name: "ingest_external_outcome_trace",
        signature: "ingest_external_outcome_trace(payload)",
        description: "Ingest full outcome trace for analytics processing",
        fields: [
          "source_attribution",
          "schema_version",
          "trace_events[]",
          "session_id"
        ]
      },
      {
        name: "ingest_external_failure_event",
        signature: "ingest_external_failure_event(payload)",
        description: "Ingest failure event into failure memory pathway"
      },
      {
        name: "ingest_external_route_outcome",
        signature: "ingest_external_route_outcome(payload)",
        description: "Ingest route execution outcome for route memory"
      },
      {
        name: "ingest_external_command_outcome",
        signature: "ingest_external_command_outcome(payload)",
        description: "Ingest command-level outcome for command analytics"
      },
      {
        name: "ingest_external_experiment_result",
        signature: "ingest_external_experiment_result(payload)",
        description: "Ingest experiment result into validation pathway"
      }
    ]
  }
];
const QA_CATEGORIES = [
  {
    id: "architecture",
    label: "Architecture",
    items: [
      "all required modules implemented",
      "no critical stubs remain",
      "schemas stable and versioned"
    ]
  },
  {
    id: "runtime",
    label: "Runtime",
    items: [
      "fast loop works",
      "mid loop works",
      "slow loop works",
      "no dead loop",
      "no stalled instances",
      "event queue healthy"
    ]
  },
  {
    id: "regulation",
    label: "Regulation",
    items: [
      "interoception affects decisions",
      "cardio affects endurance/recovery",
      "ANS affects urgency/thresholds",
      "overload/recovery change behavior"
    ]
  },
  {
    id: "circuitry",
    label: "Circuitry",
    items: [
      "registry and motifs active",
      "required bridges active",
      "recurrent pathways working",
      "connection scoring working"
    ]
  },
  {
    id: "memory",
    label: "Memory / Prediction / Learning",
    items: [
      "episodic writes active",
      "recalls active",
      "failure memory active",
      "route memory active",
      "prediction error active",
      "learning changes future behavior"
    ]
  },
  {
    id: "efficiency",
    label: "Efficiency",
    items: [
      "sparse compute active",
      "event-driven updates active",
      "compute escalation bounded"
    ]
  },
  {
    id: "analytics",
    label: "Analytics / Validation",
    items: [
      "analytics complete",
      "anti-fake checks active",
      "regression checks active",
      "reports generate automatically"
    ]
  },
  {
    id: "integration",
    label: "Integration",
    items: [
      "APIs callable",
      "contract registry active",
      "adapter compatibility active",
      "binding validation active",
      "external analytics ingest active",
      "no direct external mutation path"
    ]
  },
  {
    id: "readiness",
    label: "Readiness",
    items: [
      "Full Readiness Report = READY",
      "Anti-Fake Integrity Report = PASS",
      "Integration Readiness Report = PASS",
      "zero blocking failures remain"
    ]
  }
];
const RELEASE_BLOCKERS = [
  "any anti-fake blocker",
  "any direct mutation path",
  "any missing critical bridge",
  "any dead/stalled runtime",
  "any invalid API boundary",
  "any failed readiness gate"
];
const ERROR_RULES = [
  "Reject invalid schema versions",
  "Reject unknown adapter sessions",
  "Reject unauthorized mutation attempts",
  "Reject incomplete payloads",
  "Attach source attribution to all external ingests and emit typed error responses"
];
function buildDefaultChecklist() {
  const result = {};
  for (const cat of QA_CATEGORIES) {
    for (const item of cat.items) {
      result[`${cat.id}::${item}`] = false;
    }
  }
  return result;
}
function APISchemaTab({ neural: _neural }) {
  const [activeGroup, setActiveGroup] = reactExports.useState("lifecycle");
  const [checklist, setChecklist] = reactExports.useState(() => {
    try {
      const raw = localStorage.getItem(QA_LS_KEY);
      if (raw) return { ...buildDefaultChecklist(), ...JSON.parse(raw) };
    } catch {
    }
    return buildDefaultChecklist();
  });
  reactExports.useEffect(() => {
    try {
      localStorage.setItem(QA_LS_KEY, JSON.stringify(checklist));
    } catch {
    }
  }, [checklist]);
  const totalItems = Object.keys(checklist).length;
  const passedItems = Object.values(checklist).filter(Boolean).length;
  const overallReady = passedItems === totalItems;
  const toggleItem = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const activeGroupData = API_GROUPS.find((g) => g.id === activeGroup);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
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
                  children: "PACK 4 + PACK 5"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h1",
                {
                  className: "font-mono text-lg tracking-widest uppercase",
                  style: { color: CYAN },
                  children: "API / SCHEMA REFERENCE"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px]", style: { color: MUTED }, children: "Consolidated API Pack + QA Release Checklist" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "nav",
            {
              className: "flex flex-col shrink-0 border-r overflow-y-auto",
              style: {
                width: 200,
                background: "oklch(0.07 0.012 265)",
                borderColor: BORDER
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 border-b", style: { borderColor: BORDER }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] tracking-widest uppercase",
                    style: { color: MUTED },
                    children: "API GROUPS"
                  }
                ) }),
                API_GROUPS.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `api_schema.${group.id}.tab`,
                    onClick: () => setActiveGroup(group.id),
                    className: "text-left px-3 py-2 border-b font-mono text-[8px] tracking-wide transition-all",
                    style: {
                      borderColor: `${BORDER}60`,
                      color: activeGroup === group.id ? CYAN : MUTED,
                      background: activeGroup === group.id ? "oklch(0.09 0.015 265)" : "transparent",
                      borderLeft: activeGroup === group.id ? `2px solid ${CYAN}` : "2px solid transparent"
                    },
                    children: group.label
                  },
                  group.id
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "px-3 py-2 border-b mt-2",
                    style: { borderColor: BORDER },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[8px] tracking-widest uppercase",
                        style: { color: MUTED },
                        children: "QA CHECKLIST"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "api_schema.qa.tab",
                    onClick: () => setActiveGroup("qa"),
                    className: "text-left px-3 py-2 border-b font-mono text-[8px] tracking-wide transition-all",
                    style: {
                      borderColor: `${BORDER}60`,
                      color: activeGroup === "qa" ? CYAN : MUTED,
                      background: activeGroup === "qa" ? "oklch(0.09 0.015 265)" : "transparent",
                      borderLeft: activeGroup === "qa" ? `2px solid ${CYAN}` : "2px solid transparent"
                    },
                    children: "QA / Release Gate"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-5 flex flex-col gap-4", children: activeGroup === "qa" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[11px] tracking-widest uppercase",
                    style: { color: MUTED },
                    children: "QA / RELEASE GATE"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[8px]", style: { color: DIM }, children: "Pack 5 — All items must pass before release" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono text-[10px]",
                    style: { color: MUTED },
                    children: [
                      passedItems,
                      " / ",
                      totalItems
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[9px] px-2 py-1 tracking-widest uppercase",
                    style: {
                      background: overallReady ? "oklch(0.68 0.28 140 / 0.2)" : "oklch(0.72 0.22 25 / 0.2)",
                      color: overallReady ? GREEN : RED,
                      border: `1px solid ${overallReady ? GREEN : RED}50`
                    },
                    children: overallReady ? "READY" : "BLOCKED"
                  }
                )
              ] })
            ] }),
            QA_CATEGORIES.map((cat) => {
              const catPassed = cat.items.filter(
                (item) => checklist[`${cat.id}::${item}`]
              ).length;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "border p-4 flex flex-col gap-2",
                  style: { background: PANEL, borderColor: BORDER },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[9px] tracking-widest uppercase",
                          style: { color: CYAN },
                          children: cat.label
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "font-mono text-[8px]",
                          style: {
                            color: catPassed === cat.items.length ? GREEN : MUTED
                          },
                          children: [
                            catPassed,
                            "/",
                            cat.items.length
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          height: 3,
                          background: "oklch(0.14 0.03 255)",
                          borderRadius: 2,
                          overflow: "hidden",
                          marginBottom: 4
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              width: `${catPassed / cat.items.length * 100}%`,
                              height: "100%",
                              background: catPassed === cat.items.length ? GREEN : CYAN,
                              transition: "width 0.4s ease",
                              borderRadius: 2
                            }
                          }
                        )
                      }
                    ),
                    cat.items.map((item, idx) => {
                      const key = `${cat.id}::${item}`;
                      const checked = checklist[key];
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "label",
                        {
                          className: "flex items-center gap-2 cursor-pointer",
                          "data-ocid": `api_schema.${cat.id}.checkbox.${idx + 1}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "input",
                              {
                                type: "checkbox",
                                checked,
                                onChange: () => toggleItem(key),
                                style: { accentColor: GREEN }
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "font-mono text-[8px]",
                                style: {
                                  color: checked ? GREEN : "oklch(0.55 0.06 220)"
                                },
                                children: item
                              }
                            )
                          ]
                        },
                        key
                      );
                    })
                  ]
                },
                cat.id
              );
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "border p-4 flex flex-col gap-2",
                style: {
                  background: "oklch(0.06 0.01 25)",
                  borderColor: `${RED}60`,
                  borderLeft: `3px solid ${RED}`
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[8px] tracking-widest uppercase mb-1",
                      style: { color: RED },
                      children: "RELEASE BLOCKERS — HARD GATES"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: RELEASE_BLOCKERS.map((blocker) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[7px] px-2 py-1",
                      style: {
                        background: "oklch(0.72 0.22 25 / 0.15)",
                        color: RED,
                        border: `1px solid ${RED}40`
                      },
                      children: [
                        "✗ ",
                        blocker
                      ]
                    },
                    blocker
                  )) })
                ]
              }
            )
          ] }) : activeGroupData ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[11px] tracking-widest uppercase mb-0.5",
                  style: { color: MUTED },
                  children: "API GROUP"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "font-mono text-sm tracking-wide",
                  style: { color: CYAN },
                  children: activeGroupData.label
                }
              )
            ] }),
            activeGroup === "ingest" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "border p-3 flex flex-col gap-2",
                style: {
                  background: "oklch(0.07 0.01 265)",
                  borderColor: `${AMBER}50`
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[8px] tracking-widest uppercase mb-1",
                      style: { color: AMBER },
                      children: "ERROR RULES — ALL APIS"
                    }
                  ),
                  ERROR_RULES.map((rule) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[8px]",
                        style: { color: AMBER },
                        children: "!"
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
                  ] }, rule))
                ]
              }
            ),
            activeGroupData.functions.map((fn) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "border p-4 flex flex-col gap-2",
                style: {
                  background: PANEL,
                  borderColor: BORDER,
                  borderLeft: `2px solid ${CYAN}40`
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "code",
                    {
                      className: "font-mono text-[10px] break-all",
                      style: { color: CYAN },
                      children: fn.signature
                    }
                  ),
                  fn.description && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-mono text-[8px]",
                      style: { color: MUTED },
                      children: fn.description
                    }
                  ),
                  fn.fields && fn.fields.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 mt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] tracking-widest uppercase",
                        style: { color: DIM },
                        children: "PAYLOAD FIELDS"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: fn.fields.map((field) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] px-1.5 py-0.5",
                        style: {
                          background: "oklch(0.12 0.02 265)",
                          color: "oklch(0.58 0.1 200)",
                          border: `1px solid ${BORDER}`
                        },
                        children: field
                      },
                      field
                    )) })
                  ] }),
                  fn.returns && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] tracking-widest uppercase",
                        style: { color: DIM },
                        children: "RETURNS"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "code",
                      {
                        className: "font-mono text-[8px]",
                        style: { color: GREEN },
                        children: fn.returns
                      }
                    )
                  ] })
                ]
              },
              fn.name
            )),
            activeGroup !== "ingest" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "border p-3 flex flex-col gap-2",
                style: {
                  background: "oklch(0.07 0.01 265)",
                  borderColor: `${AMBER}40`
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[8px] tracking-widest uppercase mb-1",
                      style: { color: AMBER },
                      children: "ERROR RULES — APPLY TO ALL APIS"
                    }
                  ),
                  ERROR_RULES.map((rule) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[8px]",
                        style: { color: AMBER },
                        children: "!"
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
                  ] }, rule))
                ]
              }
            )
          ] }) : null })
        ] })
      ]
    }
  );
}
export {
  APISchemaTab as default
};
