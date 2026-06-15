import { r as reactExports, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
import { u as useArtifacts, c as createArtifact } from "./artifactStore-By0EKKQ5.js";
const BG = "oklch(0.055 0.01 265)";
const PANEL = "oklch(0.075 0.012 265)";
const BORDER = "oklch(0.18 0.05 250)";
const CYAN = "oklch(0.72 0.22 195)";
const GREEN = "oklch(0.72 0.2 155)";
const AMBER = "oklch(0.78 0.22 75)";
const RED = "oklch(0.7 0.22 25)";
const PURPLE = "oklch(0.75 0.2 280)";
const DIM = "oklch(0.38 0.05 220)";
const FG = "oklch(0.82 0.04 220)";
const BASE_RECOMMENDATIONS = [
  {
    id: "rec_001",
    title: "Strengthen cross-hemispheric corpus callosum pathways",
    impact: "HIGH",
    rationale: "Inter-hemispheric weight transfer is the primary bottleneck for emergent bilateral coordination. Low callosal pathway strength limits global brain coherence.",
    action: "Increase callosal connection weights by 35%, add bidirectional motif tagging for all callosal arcs.",
    status: "IN_PROGRESS",
    module: "core-circuit"
  },
  {
    id: "rec_002",
    title: "Tune ANS sympathetic/parasympathetic balance threshold",
    impact: "HIGH",
    rationale: "Sustained sympathetic dominance under fatigue suppresses recovery pathways. Regulatory rebound is too slow, causing extended overload states.",
    action: "Reduce parasympathetic re-engagement threshold from 0.7 to 0.55 under fatigue > 0.6.",
    status: "PENDING",
    module: "core-regulation"
  },
  {
    id: "rec_003",
    title: "Improve prediction error routing to salience engine",
    impact: "HIGH",
    rationale: "Prediction error signals are not consistently amplifying salience for novel stimuli. This reduces the system's ability to prioritize surprise-driven learning.",
    action: "Add dedicated prediction-error-to-salience bridge motif with weight 0.8 on mismatch > 0.4.",
    status: "PENDING",
    module: "core-memory"
  },
  {
    id: "rec_004",
    title: "Reduce sparse compute escalation latency",
    impact: "MED",
    rationale: "Compute escalation from local to broad update takes 3-5 ticks under high load. This delays critical arbitration under urgency pressure.",
    action: "Implement preemptive escalation trigger at urgency > 0.75 before overload threshold is reached.",
    status: "PENDING",
    module: "core-runtime"
  },
  {
    id: "rec_005",
    title: "Deepen cardio-to-threshold coupling",
    impact: "MED",
    rationale: "Cardio collapse risk above 0.85 is not sufficiently lowering action selection confidence. The coupling coefficient is too weak for extreme exertion states.",
    action: "Increase cardio-to-threshold bridge weight to 0.65 when collapse_risk > 0.8.",
    status: "IN_PROGRESS",
    module: "core-regulation"
  },
  {
    id: "rec_006",
    title: "Add failure memory recall to approach/avoid bias",
    impact: "MED",
    rationale: "Failure memory is stored but insufficiently driving approach/avoid circuit bias. Recent route failures should suppress approach bias in analogous contexts.",
    action: "Route failure_memory recall confidence directly into NAC inhibition pathway with weight 0.5.",
    status: "PENDING",
    module: "core-circuit"
  },
  {
    id: "rec_007",
    title: "Implement state-dependent learning rate modulation",
    impact: "MED",
    rationale: "Learning rate is currently static per epoch. High-regulation states should suppress plasticity to prevent trauma-driven over-fitting.",
    action: "Multiply base learning rate by (1 - regulation_burden * 0.5) on each learning step.",
    status: "IMPLEMENTED",
    module: "core-learning"
  },
  {
    id: "rec_008",
    title: "Add semantic clustering to episodic memory consolidation",
    impact: "LOW",
    rationale: "Episodic memory consolidation currently uses temporal proximity. Semantic similarity clustering would improve context-driven recall accuracy.",
    action: "Implement cosine similarity clustering pass in the slow-loop consolidation step.",
    status: "PENDING",
    module: "core-memory"
  },
  {
    id: "rec_009",
    title: "Harden binding validation on schema version drift",
    impact: "LOW",
    rationale: "Current version compatibility check is major-version only. Minor version drift can introduce silent schema mismatches in complex payloads.",
    action: "Extend version check to include minor version matching for payload fields with breaking changes.",
    status: "PENDING",
    module: "core-integration"
  },
  {
    id: "rec_010",
    title: "Optimize working memory gate under high salience load",
    impact: "MED",
    rationale: "Working memory gate admits all high-salience items under burst conditions, causing slot exhaustion. Competitive suppression is needed.",
    action: "Add lateral inhibition pass after salience ranking before WM admission. Top 5 only.",
    status: "PENDING",
    module: "core-runtime"
  }
];
const MATURATION_HISTORY = [
  {
    id: "mat_001",
    candidate: "Callosal weight +25%",
    timestamp: Date.now() - 36e5 * 48,
    outcome: "promoted",
    module: "core-circuit"
  },
  {
    id: "mat_002",
    candidate: "State-dependent LR",
    timestamp: Date.now() - 36e5 * 24,
    outcome: "promoted",
    module: "core-learning"
  },
  {
    id: "mat_003",
    candidate: "Cardio bridge v2",
    timestamp: Date.now() - 36e5 * 12,
    outcome: "pending",
    module: "core-regulation"
  },
  {
    id: "mat_004",
    candidate: "Motif density +15%",
    timestamp: Date.now() - 36e5 * 6,
    outcome: "rejected",
    module: "core-circuit"
  }
];
const OPTIMIZATION_PHASES = [
  {
    phase: 1,
    title: "Circuit Optimization",
    color: CYAN,
    items: [
      { label: "Strengthen callosal pathways", done: true },
      { label: "Add bidirectional motif tagging", done: true },
      { label: "Increase NAC-amygdala competition weight", done: false },
      { label: "Add prediction-error salience bridge", done: false }
    ]
  },
  {
    phase: 2,
    title: "Regulation Tuning",
    color: GREEN,
    items: [
      { label: "Tune ANS balance threshold", done: false },
      { label: "Deepen cardio-to-threshold coupling", done: true },
      { label: "Optimize recovery controller ramp", done: false },
      { label: "Add interoceptive overload gating", done: false }
    ]
  },
  {
    phase: 3,
    title: "Memory / Prediction",
    color: PURPLE,
    items: [
      { label: "Failure memory to approach/avoid routing", done: false },
      { label: "State-dependent learning rate", done: true },
      { label: "Semantic clustering in consolidation", done: false },
      { label: "Prediction error to salience amplification", done: false }
    ]
  },
  {
    phase: 4,
    title: "Integration Hardening",
    color: AMBER,
    items: [
      { label: "Minor version binding validation", done: false },
      { label: "Working memory lateral inhibition", done: false },
      { label: "Sparse compute preemptive escalation", done: false },
      { label: "Full go-live trace validation", done: false }
    ]
  }
];
function impactColor(impact) {
  switch (impact) {
    case "HIGH":
      return RED;
    case "MED":
      return AMBER;
    case "LOW":
      return GREEN;
  }
}
function statusColor(status) {
  switch (status) {
    case "IMPLEMENTED":
      return GREEN;
    case "IN_PROGRESS":
      return CYAN;
    case "PENDING":
      return DIM;
  }
}
function relativeTime(ts) {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1e3);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  return hr < 24 ? `${hr}h ago` : `${Math.floor(hr / 24)}d ago`;
}
function AIReviewTab() {
  const [artifacts] = useArtifacts();
  const [recommendations, setRecommendations] = reactExports.useState(BASE_RECOMMENDATIONS);
  const [expanded, setExpanded] = reactExports.useState(null);
  const [applyingId, setApplyingId] = reactExports.useState(null);
  const aiArtifacts = artifacts.filter((a) => a.artifact_type === "ai_review").slice(0, 3);
  const implementedCount = recommendations.filter(
    (r) => r.status === "IMPLEMENTED"
  ).length;
  const inProgressCount = recommendations.filter(
    (r) => r.status === "IN_PROGRESS"
  ).length;
  const highImpactPending = recommendations.filter(
    (r) => r.impact === "HIGH" && r.status === "PENDING"
  ).length;
  const overallScore = Math.round(
    implementedCount / recommendations.length * 60 + inProgressCount / recommendations.length * 25 + (highImpactPending === 0 ? 15 : 0)
  );
  const assessmentLabel = overallScore >= 60 ? "STRONG" : overallScore >= 35 ? "MODERATE" : "NEEDS WORK";
  const assessmentColor = overallScore >= 60 ? GREEN : overallScore >= 35 ? AMBER : RED;
  function handleApply(id) {
    setApplyingId(id);
    setTimeout(() => {
      var _a;
      setRecommendations(
        (prev) => prev.map(
          (r) => r.id === id ? {
            ...r,
            status: r.status === "PENDING" ? "IN_PROGRESS" : r.status
          } : r
        )
      );
      createArtifact({
        artifact_type: "optimization_recommendation",
        source_system: "core",
        title: `Applied: ${((_a = recommendations.find((r) => r.id === id)) == null ? void 0 : _a.title) ?? "Recommendation"}`,
        summary: "Recommendation applied via AI Review tab. Candidate queued for maturation testing.",
        score: 72,
        status: "info",
        ai_review_summary: "Candidate change submitted to validation queue. Evidence-based promotion pending.",
        metadata: { recommendation_id: id },
        related_artifact_ids: [],
        tags: ["ai_review", "optimization", "candidate"],
        version: "1.0.0"
      });
      setApplyingId(null);
    }, 800);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "h-full overflow-y-auto p-4 space-y-4",
      style: { background: BG },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "rounded-sm border p-4",
            style: { background: PANEL, borderColor: BORDER },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-mono text-[8px] uppercase tracking-widest mb-1",
                    style: { color: DIM },
                    children: "AI System Analysis"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-lg font-bold tracking-wide",
                      style: { color: assessmentColor },
                      children: assessmentLabel
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[8px] uppercase px-2 py-0.5 rounded-sm",
                      style: {
                        background: `${assessmentColor}18`,
                        color: assessmentColor,
                        border: `1px solid ${assessmentColor}40`
                      },
                      children: [
                        overallScore,
                        "% optimization progress"
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4", children: [
                { label: "Implemented", value: implementedCount, color: GREEN },
                { label: "In Progress", value: inProgressCount, color: CYAN },
                {
                  label: "High Impact Pending",
                  value: highImpactPending,
                  color: RED
                }
              ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-mono text-[18px] font-bold",
                    style: { color: stat.color },
                    children: stat.value
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-mono text-[8px] uppercase tracking-widest",
                    style: { color: DIM },
                    children: stat.label
                  }
                )
              ] }, stat.label)) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-mono text-[8px] uppercase tracking-widest mb-2",
              style: { color: DIM },
              children: "Top Recommendations — Ranked by Impact"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: recommendations.map((rec, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `ai_review.item.${Math.min(i + 1, 5)}`,
              className: "rounded-sm border overflow-hidden",
              style: {
                background: PANEL,
                borderColor: expanded === rec.id ? `${CYAN}50` : BORDER
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm shrink-0",
                      style: {
                        background: `${impactColor(rec.impact)}18`,
                        color: impactColor(rec.impact),
                        border: `1px solid ${impactColor(rec.impact)}40`
                      },
                      children: rec.impact
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm shrink-0",
                      style: {
                        background: `${statusColor(rec.status)}15`,
                        color: statusColor(rec.status)
                      },
                      children: rec.status.replace("_", " ")
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-mono text-[10px] font-semibold flex-1 min-w-0 truncate",
                      style: { color: FG },
                      children: rec.title
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px] shrink-0",
                      style: { color: DIM },
                      children: rec.module
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setExpanded(expanded === rec.id ? null : rec.id),
                      className: "font-mono text-[8px] uppercase tracking-widest px-2 py-1 rounded-sm shrink-0 transition-colors",
                      style: { border: `1px solid ${BORDER}`, color: DIM },
                      children: expanded === rec.id ? "▲" : "▼"
                    }
                  )
                ] }),
                expanded === rec.id && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "border-t px-3 py-3 space-y-2",
                    style: {
                      borderColor: BORDER,
                      background: "oklch(0.065 0.01 265)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "font-mono text-[8px] uppercase tracking-widest mb-1",
                            style: { color: DIM },
                            children: "Rationale"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "font-mono text-[9px] leading-relaxed",
                            style: { color: "oklch(0.65 0.06 220)" },
                            children: rec.rationale
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "font-mono text-[8px] uppercase tracking-widest mb-1",
                            style: { color: DIM },
                            children: "Suggested Action"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "font-mono text-[9px] leading-relaxed",
                            style: { color: "oklch(0.65 0.06 220)" },
                            children: rec.action
                          }
                        )
                      ] }),
                      rec.status !== "IMPLEMENTED" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          "data-ocid": `ai_review.submit_button.${Math.min(i + 1, 5)}`,
                          disabled: applyingId === rec.id,
                          onClick: () => handleApply(rec.id),
                          className: "font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-sm transition-all",
                          style: {
                            background: applyingId === rec.id ? `${GREEN}10` : `${CYAN}18`,
                            border: `1px solid ${applyingId === rec.id ? GREEN : CYAN}50`,
                            color: applyingId === rec.id ? GREEN : CYAN,
                            opacity: applyingId === rec.id ? 0.7 : 1
                          },
                          children: applyingId === rec.id ? "⟳ Applying…" : "▶ Apply Recommendation"
                        }
                      )
                    ]
                  }
                )
              ]
            },
            rec.id
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-sm border p-3",
            style: { background: PANEL, borderColor: BORDER },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-mono text-[8px] uppercase tracking-widest mb-3",
                  style: { color: DIM },
                  children: "Auto-Improvement Tracking — Maturation Loop"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: ["Candidate", "Module", "Timestamp", "Outcome"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "th",
                  {
                    className: "font-mono text-[8px] uppercase tracking-widest text-left pb-2 pr-4",
                    style: { color: DIM },
                    children: h
                  },
                  h
                )) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: MATURATION_HISTORY.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    "data-ocid": "ai_review.row",
                    className: "border-t",
                    style: { borderColor: BORDER },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "td",
                        {
                          className: "font-mono text-[9px] py-1.5 pr-4",
                          style: { color: FG },
                          children: row.candidate
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "td",
                        {
                          className: "font-mono text-[8px] py-1.5 pr-4",
                          style: { color: DIM },
                          children: row.module
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "td",
                        {
                          className: "font-mono text-[8px] py-1.5 pr-4",
                          style: { color: DIM },
                          children: relativeTime(row.timestamp)
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm",
                          style: {
                            background: `${row.outcome === "promoted" ? GREEN : row.outcome === "rejected" ? RED : AMBER}18`,
                            color: row.outcome === "promoted" ? GREEN : row.outcome === "rejected" ? RED : AMBER
                          },
                          children: row.outcome
                        }
                      ) })
                    ]
                  },
                  row.id
                )) })
              ] }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-mono text-[8px] uppercase tracking-widest mb-2",
              style: { color: DIM },
              children: "Optimization Plan"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3", children: OPTIMIZATION_PHASES.map((phase) => {
            const doneCount = phase.items.filter((i) => i.done).length;
            const pct = Math.round(doneCount / phase.items.length * 100);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-sm border p-3",
                style: {
                  background: "oklch(0.065 0.01 265)",
                  borderColor: `${phase.color}30`
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[8px] uppercase tracking-widest",
                        style: { color: phase.color },
                        children: [
                          "Phase ",
                          phase.phase
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[9px] font-bold",
                        style: { color: phase.color },
                        children: [
                          pct,
                          "%"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-mono text-[10px] font-semibold mb-2",
                      style: { color: FG },
                      children: phase.title
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-full rounded-full h-1 mb-2",
                      style: { background: "oklch(0.12 0.03 250)" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "h-1 rounded-full",
                          style: { width: `${pct}%`, background: phase.color }
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: phase.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[9px] shrink-0 mt-0.5",
                        style: { color: item.done ? GREEN : DIM },
                        children: item.done ? "✓" : "○"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[8px] leading-relaxed",
                        style: {
                          color: item.done ? "oklch(0.55 0.08 155)" : "oklch(0.45 0.05 220)",
                          textDecoration: item.done ? "line-through" : "none"
                        },
                        children: item.label
                      }
                    )
                  ] }, item.label)) })
                ]
              },
              phase.phase
            );
          }) })
        ] }),
        aiArtifacts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-sm border p-3",
            style: { background: PANEL, borderColor: BORDER },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-mono text-[8px] uppercase tracking-widest mb-3",
                  style: { color: DIM },
                  children: "AI Review Artifact History"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: aiArtifacts.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": `ai_review.card.${i + 1}`,
                  className: "flex items-start gap-3 p-2 rounded-sm border",
                  style: {
                    background: "oklch(0.065 0.01 265)",
                    borderColor: BORDER
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "font-mono text-[10px] font-semibold truncate",
                          style: { color: FG },
                          children: a.title
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[8px]", style: { color: DIM }, children: [
                        relativeTime(a.created_at),
                        " · score: ",
                        a.score.toFixed(0)
                      ] }),
                      a.ai_review_summary && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "font-mono text-[8px] mt-0.5 line-clamp-2",
                          style: { color: "oklch(0.55 0.06 220)" },
                          children: a.ai_review_summary
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[9px] font-bold shrink-0",
                        style: {
                          color: a.score >= 80 ? GREEN : a.score >= 50 ? AMBER : RED
                        },
                        children: [
                          a.score.toFixed(0),
                          "%"
                        ]
                      }
                    )
                  ]
                },
                a.artifact_id
              )) })
            ]
          }
        )
      ]
    }
  );
}
export {
  AIReviewTab as default
};
