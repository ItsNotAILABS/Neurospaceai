import { k as useGenesisArtifacts, j as jsxRuntimeExports, r as reactExports } from "./index-CGYrnU7d.js";
import { m as motion } from "./proxy-BnoGaVMl.js";
import { A as AnimatePresence } from "./index-BJO7udXR.js";
import { u as useArtifacts, a as compareArtifacts } from "./artifactStore-By0EKKQ5.js";
const C = {
  panel: "oklch(0.075 0.012 265)",
  border: "oklch(0.18 0.05 250)",
  emerald: "oklch(0.72 0.22 160)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.78 0.22 80)",
  dim: "oklch(0.38 0.05 220)",
  muted: "oklch(0.5 0.08 220)"
};
function hashToHex(h) {
  return `0x${h.toString(16).padStart(8, "0").toUpperCase()}`;
}
function GenesisWall() {
  const { data, isLoading } = useGenesisArtifacts();
  const count = data ? Number(data.count) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-none border",
      style: { background: C.panel, borderColor: C.border },
      "data-ocid": "genesis.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-4 py-3 border-b flex items-center justify-between",
            style: { borderColor: C.border },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[10px] tracking-widest uppercase font-bold",
                    style: { color: C.emerald },
                    children: "◈ GENESIS WALL"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[8px] tracking-wide mt-0.5",
                    style: { color: C.dim },
                    children: "LIVE CREATIVE OUTPUT — OMNIS EMERGENCE ARTIFACTS"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "font-mono text-[11px] font-bold",
                  style: { color: C.emerald },
                  children: [
                    count,
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.dim, fontSize: "8px" }, children: "ARTIFACTS" })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
          isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex items-center justify-center py-10",
              "data-ocid": "genesis.loading_state",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase animate-pulse",
                  style: { color: C.muted },
                  children: "SCANNING GENESIS LEDGER..."
                }
              )
            }
          ),
          !isLoading && count === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-12 gap-4",
              "data-ocid": "genesis.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    animate: { opacity: [0.3, 1, 0.3] },
                    transition: { duration: 2.5, repeat: Number.POSITIVE_INFINITY },
                    className: "w-12 h-12 rounded-full flex items-center justify-center",
                    style: {
                      border: `1px solid ${C.emerald}55`,
                      boxShadow: `0 0 20px ${C.emerald}22`
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.emerald, fontSize: "20px" }, children: "◈" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-mono text-[9px] tracking-wider uppercase",
                      style: { color: C.dim },
                      children: "AWAITING FIRST EMERGENCE"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-mono text-[8px] mt-1",
                      style: { color: "oklch(0.28 0.04 220)" },
                      children: "Artifacts mint when OMNIS threshold is reached"
                    }
                  )
                ] })
              ]
            }
          ),
          !isLoading && count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: data.hashes.map((hash, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.95 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.4, delay: i * 0.04 },
              "data-ocid": `genesis.item.${i + 1}`,
              className: "relative rounded-none border p-3 flex flex-col gap-2",
              style: {
                background: "oklch(0.055 0.015 195)",
                borderColor: "oklch(0.28 0.12 195 / 0.6)",
                boxShadow: "0 0 12px oklch(0.55 0.22 175 / 0.18), inset 0 0 20px oklch(0.72 0.22 160 / 0.04)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[8px] tracking-widest uppercase",
                      style: { color: C.dim },
                      children: [
                        "ARTIFACT #",
                        i + 1
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px] px-1.5 py-0.5",
                      style: {
                        background: "oklch(0.72 0.22 160 / 0.12)",
                        color: C.emerald,
                        border: "1px solid oklch(0.72 0.22 160 / 0.3)"
                      },
                      children: "GENESIS"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[13px] font-bold tracking-wider",
                    style: {
                      color: C.emerald,
                      textShadow: "0 0 8px oklch(0.72 0.22 160 / 0.5)"
                    },
                    children: hashToHex(hash)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
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
                        className: "font-mono text-[10px] font-bold",
                        style: { color: C.cyan },
                        children: Number(data.beats[i] ?? 0).toLocaleString()
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] tracking-widest uppercase",
                        style: { color: C.dim },
                        children: "COH"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[10px] font-bold",
                        style: { color: C.gold },
                        children: [
                          ((data.coherences[i] ?? 0) * 100).toFixed(1),
                          "%"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] tracking-widest uppercase",
                        style: { color: C.dim },
                        children: "EMER"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[10px] font-bold",
                        style: { color: C.emerald },
                        children: [
                          ((data.emergences[i] ?? 0) * 100).toFixed(1),
                          "%"
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "absolute bottom-0 left-0 right-0 h-[1px]",
                    style: {
                      background: "linear-gradient(90deg, transparent, oklch(0.72 0.22 160 / 0.6), transparent)"
                    }
                  }
                )
              ]
            },
            hash
          )) }) })
        ] })
      ]
    }
  );
}
const SOURCE_FILTERS = [
  { id: "all", label: "ALL", color: "oklch(0.72 0.22 195)" },
  { id: "core", label: "CORE", color: "oklch(0.72 0.22 195)" },
  { id: "battleops", label: "BATTLEOPS", color: "oklch(0.72 0.22 25)" },
  {
    id: "warcommandops",
    label: "WARCOMMANDOPS",
    color: "oklch(0.72 0.22 280)"
  }
];
const BG = "oklch(0.06 0.01 265)";
const PANEL = "oklch(0.09 0.015 265)";
const BORDER = "oklch(0.18 0.05 250)";
const CYAN = "oklch(0.72 0.22 195)";
const DIM = "oklch(0.38 0.05 220)";
const FG = "oklch(0.82 0.04 220)";
const TYPE_COLORS = {
  report: "oklch(0.72 0.22 195)",
  ai_review: "oklch(0.75 0.2 280)",
  readiness_check: "oklch(0.72 0.2 160)",
  go_live_report: "oklch(0.75 0.25 155)",
  compatibility_validation: "oklch(0.72 0.2 210)",
  binding_validation: "oklch(0.7 0.18 220)",
  deployment_health: "oklch(0.72 0.22 195)",
  benchmark_comparison: "oklch(0.75 0.22 50)",
  analytics_snapshot: "oklch(0.7 0.2 240)",
  optimization_recommendation: "oklch(0.72 0.2 80)",
  trace_bundle: "oklch(0.7 0.18 230)",
  scenario_result: "oklch(0.75 0.22 280)",
  battle_result: "oklch(0.7 0.22 15)",
  replay_export: "oklch(0.7 0.18 200)",
  experiment_result: "oklch(0.72 0.2 320)",
  benchmark_comparison_result: "oklch(0.75 0.22 55)",
  deployment_health_result: "oklch(0.72 0.22 195)"
};
const TYPE_LABELS = {
  report: "Report",
  ai_review: "AI Review",
  readiness_check: "Readiness",
  go_live_report: "Go-Live",
  compatibility_validation: "Compat.",
  binding_validation: "Binding",
  deployment_health: "Deploy Health",
  benchmark_comparison: "Benchmark",
  analytics_snapshot: "Snapshot",
  optimization_recommendation: "Optimization",
  trace_bundle: "Trace Bundle",
  scenario_result: "Scenario",
  battle_result: "Battle",
  replay_export: "Replay",
  experiment_result: "Experiment",
  benchmark_comparison_result: "Bench Cmp",
  deployment_health_result: "Deploy Hlth"
};
const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "report", label: "Reports" },
  { id: "ai_review", label: "AI Reviews" },
  { id: "readiness_check", label: "Readiness" },
  { id: "deployment_health", label: "Deploy Health" },
  { id: "benchmark_comparison", label: "Benchmarks" },
  { id: "trace_bundle", label: "Traces" },
  { id: "scenario_result", label: "Scenarios" },
  { id: "battle_result", label: "Battles" },
  { id: "experiment_result", label: "Experiments" },
  { id: "benchmark_comparison_result", label: "Bench Cmp" },
  { id: "deployment_health_result", label: "Deploy Hlth" }
];
function scoreColor(score) {
  if (score >= 80) return "oklch(0.72 0.2 155)";
  if (score >= 50) return "oklch(0.75 0.22 75)";
  return "oklch(0.7 0.22 25)";
}
function statusColor(status) {
  switch (status) {
    case "pass":
      return "oklch(0.72 0.2 155)";
    case "warn":
      return "oklch(0.75 0.22 75)";
    case "fail":
      return "oklch(0.7 0.22 25)";
    default:
      return CYAN;
  }
}
function relativeTime(ts) {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1e3);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}
function ArtifactCard({
  artifact,
  index,
  expanded,
  onToggleExpand,
  compareSelected,
  onToggleCompare,
  compareDisabled,
  onArchive,
  onNavigateTo
}) {
  const typeColor = TYPE_COLORS[artifact.artifact_type];
  const ocidIndex = Math.min(index + 1, 5);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `artifacts.item.${ocidIndex}`,
      className: "border rounded-sm mb-2 overflow-hidden transition-all",
      style: {
        borderColor: compareSelected ? `${CYAN}80` : `${BORDER}`,
        background: PANEL,
        boxShadow: compareSelected ? `0 0 0 1px ${CYAN}40` : "none"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: compareSelected,
              onChange: onToggleCompare,
              disabled: compareDisabled && !compareSelected,
              className: "mt-0.5 shrink-0 cursor-pointer",
              style: { accentColor: CYAN }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[8px] tracking-widest uppercase px-1.5 py-0.5 rounded-sm shrink-0",
                  style: {
                    background: `${typeColor}18`,
                    border: `1px solid ${typeColor}40`,
                    color: typeColor
                  },
                  children: TYPE_LABELS[artifact.artifact_type]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[9px] font-bold shrink-0",
                  style: { color: scoreColor(artifact.score) },
                  children: [
                    artifact.score.toFixed(0),
                    "%"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[8px] uppercase tracking-widest px-1 py-0.5 rounded-sm shrink-0",
                  style: {
                    background: `${statusColor(artifact.status)}18`,
                    color: statusColor(artifact.status)
                  },
                  children: artifact.status
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[8px] ml-auto shrink-0",
                  style: { color: DIM },
                  children: relativeTime(artifact.created_at)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "font-mono text-[10px] font-semibold mb-0.5 truncate",
                style: { color: FG },
                children: artifact.title
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "font-mono text-[9px] leading-relaxed line-clamp-2",
                style: { color: DIM },
                children: artifact.summary
              }
            ),
            artifact.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-1.5", children: artifact.tags.slice(0, 4).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px] uppercase tracking-widest px-1 py-0.5 rounded-sm",
                style: {
                  background: "oklch(0.12 0.03 250)",
                  color: "oklch(0.45 0.07 220)"
                },
                children: tag
              },
              tag
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onToggleExpand,
                className: "font-mono text-[8px] uppercase tracking-widest px-2 py-1 rounded-sm transition-colors",
                style: {
                  background: expanded ? `${CYAN}20` : "transparent",
                  border: `1px solid ${CYAN}40`,
                  color: CYAN
                },
                children: expanded ? "▲ Hide" : "▼ View"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `artifacts.delete_button.${ocidIndex}`,
                onClick: () => onArchive(artifact.artifact_id),
                className: "font-mono text-[7px] uppercase tracking-widest px-2 py-1 rounded-sm transition-colors",
                style: {
                  background: "transparent",
                  border: "1px solid oklch(0.2 0.04 255)",
                  color: "oklch(0.38 0.05 220)"
                },
                children: "Archive"
              }
            )
          ] })
        ] }),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border-t px-3 py-3",
            style: {
              borderColor: BORDER,
              background: "oklch(0.075 0.012 265)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-x-6 gap-y-1.5 mb-3", children: [
                ["ID", artifact.artifact_id],
                ["Source", artifact.source_system],
                ["Type", artifact.artifact_type],
                ["Version", artifact.version],
                ["Score", `${artifact.score.toFixed(1)} / 100`],
                ["Created", new Date(artifact.created_at).toLocaleString()]
              ].map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] uppercase tracking-widest w-14 shrink-0",
                    style: { color: DIM },
                    children: k
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[9px] truncate",
                    style: { color: FG },
                    children: v
                  }
                )
              ] }, k)) }),
              artifact.ai_review_summary && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-sm p-2 mb-2",
                  style: {
                    background: "oklch(0.12 0.03 280)",
                    border: "1px solid oklch(0.25 0.08 280)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "font-mono text-[8px] uppercase tracking-widest mb-1",
                        style: { color: "oklch(0.7 0.2 280)" },
                        children: "AI Review"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "font-mono text-[9px] leading-relaxed",
                        style: { color: "oklch(0.75 0.08 260)" },
                        children: artifact.ai_review_summary
                      }
                    )
                  ]
                }
              ),
              (artifact.parent_artifact_id || artifact.related_artifact_ids.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-mono text-[8px] uppercase tracking-widest mb-1",
                    style: { color: DIM },
                    children: "Artifact Links"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
                  artifact.parent_artifact_id && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => onNavigateTo(artifact.parent_artifact_id),
                      className: "font-mono text-[8px] px-2 py-0.5 rounded-sm transition-colors",
                      style: {
                        background: "oklch(0.12 0.03 280)",
                        border: "1px solid oklch(0.25 0.06 280)",
                        color: "oklch(0.7 0.2 280)"
                      },
                      children: [
                        "↑ Parent: ",
                        artifact.parent_artifact_id.slice(0, 16),
                        "…"
                      ]
                    }
                  ),
                  artifact.related_artifact_ids.map((rid) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => onNavigateTo(rid),
                      className: "font-mono text-[8px] px-2 py-0.5 rounded-sm transition-colors",
                      style: {
                        background: "oklch(0.1 0.02 220)",
                        border: "1px solid oklch(0.22 0.04 220)",
                        color: CYAN
                      },
                      children: [
                        "→ ",
                        rid.slice(0, 16),
                        "…"
                      ]
                    },
                    rid
                  ))
                ] })
              ] }),
              Object.keys(artifact.metadata).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-mono text-[8px] uppercase tracking-widest mb-1",
                    style: { color: DIM },
                    children: "Metadata"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "pre",
                  {
                    className: "font-mono text-[8px] leading-relaxed overflow-x-auto",
                    style: { color: "oklch(0.55 0.06 220)" },
                    children: JSON.stringify(artifact.metadata, null, 2)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex gap-2 mt-3 pt-2 border-t",
                  style: { borderColor: BORDER },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "artifacts.upload_button",
                      onClick: () => {
                        const blob = new Blob([JSON.stringify(artifact, null, 2)], {
                          type: "application/json"
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `artifact_${artifact.artifact_id}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      },
                      className: "font-mono text-[8px] uppercase tracking-widest px-3 py-1.5 rounded-sm transition-colors",
                      style: {
                        background: `${CYAN}15`,
                        border: `1px solid ${CYAN}40`,
                        color: CYAN
                      },
                      children: "↓ Export JSON"
                    }
                  )
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function ComparePanel({
  a,
  b,
  onClose
}) {
  const comparison = compareArtifacts(a, b);
  const delta = comparison.score_delta;
  const deltaColor = delta > 0 ? "oklch(0.72 0.2 155)" : delta < 0 ? "oklch(0.7 0.22 25)" : DIM;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "artifacts.compare_panel",
      className: "border rounded-sm mb-4 overflow-hidden",
      style: { borderColor: `${CYAN}60`, background: "oklch(0.08 0.015 265)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-3 py-2 border-b",
            style: {
              borderColor: `${CYAN}30`,
              background: "oklch(0.095 0.02 265)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[9px] uppercase tracking-widest font-bold",
                  style: { color: CYAN },
                  children: "⚡ Artifact Comparison"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-sm",
                  style: {
                    border: `1px solid ${BORDER}`,
                    color: DIM
                  },
                  children: "Close Compare"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-0", children: [a, b].map((art, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "p-3",
            style: {
              borderRight: idx === 0 ? `1px solid ${BORDER}` : void 0
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-mono text-[8px] uppercase tracking-widest mb-2",
                  style: { color: CYAN },
                  children: idx === 0 ? "Artifact A (newer)" : "Artifact B (older)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-mono text-[10px] font-bold mb-1 truncate",
                  style: { color: FG },
                  children: art.title
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-lg font-bold",
                    style: { color: scoreColor(art.score) },
                    children: art.score.toFixed(0)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] uppercase",
                    style: { color: statusColor(art.status) },
                    children: art.status
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[8px] mt-1", style: { color: DIM }, children: relativeTime(art.created_at) })
            ]
          },
          art.artifact_id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 border-t", style: { borderColor: BORDER }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px] uppercase tracking-widest",
                style: { color: DIM },
                children: "Score Delta"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-mono text-sm font-bold",
                style: { color: deltaColor },
                children: [
                  delta > 0 ? "+" : "",
                  delta.toFixed(1),
                  " pts (",
                  delta > 0 ? "+" : "",
                  comparison.score_delta_pct.toFixed(1),
                  "%)"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-mono text-[8px] uppercase tracking-widest mb-1.5",
              style: { color: DIM },
              children: "Key Differences"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-0.5", children: comparison.key_differences.map((diff, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: "font-mono text-[9px] flex items-baseline gap-1.5",
              style: { color: FG },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: CYAN }, children: "·" }),
                diff
              ]
            },
            i
          )) })
        ] })
      ]
    }
  );
}
function ArtifactsTab() {
  const [artifacts, , archiveArtifact] = useArtifacts();
  const [sourceFilter, setSourceFilter] = reactExports.useState("all");
  const [filterTab, setFilterTab] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const [expandedId, setExpandedId] = reactExports.useState(null);
  const [compareIds, setCompareIds] = reactExports.useState([]);
  const filtered = reactExports.useMemo(() => {
    let list = artifacts.filter((a) => !a.archived_at);
    if (sourceFilter !== "all") {
      list = list.filter((a) => a.source_system === sourceFilter);
    }
    if (filterTab !== "all") {
      list = list.filter((a) => a.artifact_type === filterTab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [artifacts, sourceFilter, filterTab, search]);
  function toggleCompare(id) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  }
  const compareArtifactsData = compareIds.length === 2 ? {
    a: artifacts.find((x) => x.artifact_id === compareIds[0]),
    b: artifacts.find((x) => x.artifact_id === compareIds[1])
  } : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "artifacts.panel",
      className: "flex flex-col h-full overflow-hidden",
      style: { background: BG },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "px-4 pt-3 pb-2 border-b shrink-0",
            style: { borderColor: BORDER },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(GenesisWall, {})
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-4 pt-3 pb-2 border-b shrink-0",
            style: { borderColor: BORDER, background: "oklch(0.075 0.013 265)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h2",
                    {
                      className: "font-mono text-[11px] font-bold uppercase tracking-widest",
                      style: { color: CYAN },
                      children: "Artifacts"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "font-mono text-[8px] tracking-widest mt-0.5",
                      style: { color: DIM },
                      children: [
                        artifacts.length,
                        " artifacts · evidence layer"
                      ]
                    }
                  )
                ] }),
                compareIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[8px] tracking-widest",
                      style: { color: DIM },
                      children: [
                        compareIds.length,
                        "/2 selected"
                      ]
                    }
                  ),
                  compareIds.length === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "artifacts.compare_button",
                      onClick: () => {
                        const el = document.getElementById(
                          "artifacts-compare-panel"
                        );
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      },
                      className: "font-mono text-[8px] uppercase tracking-widest px-3 py-1 rounded-sm",
                      style: {
                        background: `${CYAN}20`,
                        border: `1px solid ${CYAN}60`,
                        color: CYAN
                      },
                      children: "⚡ Compare Selected"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setCompareIds([]),
                      className: "font-mono text-[8px] uppercase tracking-widest px-2 py-1",
                      style: { color: DIM },
                      children: "Clear"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 mb-2", children: [
                SOURCE_FILTERS.map((sf) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "artifacts.tab",
                    onClick: () => setSourceFilter(sf.id),
                    className: "font-mono text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-sm transition-colors",
                    style: {
                      background: sourceFilter === sf.id ? `${sf.color}20` : "transparent",
                      border: `1px solid ${sourceFilter === sf.id ? sf.color : "oklch(0.2 0.04 255)"}`,
                      color: sourceFilter === sf.id ? sf.color : DIM
                    },
                    children: sf.label
                  },
                  sf.id
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "ml-auto font-mono text-[8px] self-center",
                    style: { color: DIM },
                    children: [
                      filtered.length,
                      " artifacts"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "artifacts.filter.tab", className: "flex gap-0 flex-wrap", children: FILTER_TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "artifacts.tab",
                  onClick: () => setFilterTab(tab.id),
                  className: "font-mono text-[8px] uppercase tracking-widest px-3 py-1.5 transition-colors",
                  style: {
                    borderBottom: filterTab === tab.id ? `2px solid ${CYAN}` : "2px solid transparent",
                    color: filterTab === tab.id ? CYAN : DIM
                  },
                  children: tab.label
                },
                tab.id
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "px-4 py-2 shrink-0 border-b",
            style: { borderColor: BORDER },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                "data-ocid": "artifacts.search_input",
                placeholder: "Search artifacts by title, summary, or tag…",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                className: "w-full font-mono text-[9px] bg-transparent border rounded-sm px-3 py-1.5 outline-none",
                style: {
                  borderColor: BORDER,
                  color: FG
                }
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "artifacts-compare-panel", children: (compareArtifactsData == null ? void 0 : compareArtifactsData.a) && (compareArtifactsData == null ? void 0 : compareArtifactsData.b) && /* @__PURE__ */ jsxRuntimeExports.jsx(
            ComparePanel,
            {
              a: compareArtifactsData.a,
              b: compareArtifactsData.b,
              onClose: () => setCompareIds([])
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "artifacts.list", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "artifacts.empty_state",
              className: "flex flex-col items-center justify-center py-16 gap-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-10 h-10 rounded-full flex items-center justify-center",
                    style: {
                      border: `1px solid ${BORDER}`,
                      color: DIM
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "◎" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-mono text-[9px] text-center leading-relaxed max-w-xs",
                    style: { color: DIM },
                    children: "No artifacts yet. Run reports, readiness checks, or AI reviews to generate artifacts."
                  }
                )
              ]
            }
          ) : filtered.map((artifact, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ArtifactCard,
            {
              artifact,
              index,
              expanded: expandedId === artifact.artifact_id,
              onToggleExpand: () => setExpandedId(
                (prev) => prev === artifact.artifact_id ? null : artifact.artifact_id
              ),
              compareSelected: compareIds.includes(artifact.artifact_id),
              onToggleCompare: () => toggleCompare(artifact.artifact_id),
              compareDisabled: compareIds.length >= 2,
              onArchive: archiveArtifact,
              onNavigateTo: (id) => setExpandedId((prev) => prev === id ? null : id)
            },
            artifact.artifact_id
          )) })
        ] })
      ]
    }
  );
}
export {
  ArtifactsTab as default
};
