import { r as reactExports, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
import { u as useBrainIntegrationSystem } from "./useBrainIntegrationSystem-yuzi11xJ.js";
import { u as updateConnectionWeights, c as createConnectionRegistry, g as getOptimizationRecommendations } from "./connectionRegistry-BpvrHavl.js";
const SUBSYSTEM_LABEL_MAP = {
  body_to_salience: "Body-State → Salience",
  cardio_ans_to_threshold: "CardioANS → Threshold",
  regulation_to_policy: "Regulation → Policy",
  memory_to_salience: "Memory → Salience",
  memory_to_action: "Memory → Action",
  prediction_to_salience: "Prediction → Salience",
  prediction_error_to_learning: "PredError → Learning",
  self_state_to_arbitration: "SelfState → Arbitration",
  cross_timescale: "Cross-Timescale Bridge",
  modulatory_broadcast: "Modulatory Broadcast",
  sensory_to_salience: "Sensory → Salience",
  salience_to_wm: "Salience → WorkingMemory",
  wm_to_arbitration: "WorkingMemory → Arbitration",
  arbitration_to_policy: "Arbitration → Policy",
  command_relay: "Command Relay"
};
const ACTION_DESCRIPTION_MAP = {
  strengthen: (id) => `Increase weight on ${SUBSYSTEM_LABEL_MAP[id] ?? id} — high usefulness under-expressed`,
  weaken: (id) => `Reduce weight on ${SUBSYSTEM_LABEL_MAP[id] ?? id} — overweighted relative to usefulness`,
  gate: (id) => `Apply gating condition to ${SUBSYSTEM_LABEL_MAP[id] ?? id} — overactive with failure association`,
  prune: (id) => `Prune ${SUBSYSTEM_LABEL_MAP[id] ?? id} — low usefulness, high failure rate`,
  promote: (id) => `Promote ${SUBSYSTEM_LABEL_MAP[id] ?? id} to structural pathway — high utility and reliability`
};
const initialCandidates = [
  {
    id: "cand_001",
    subsystem: "Salience",
    description: "Strengthen body_to_salience coupling under high stress conditions",
    status: "promoted",
    baselineScore: 0.61,
    candidateScore: 0.74,
    evidence: [
      "ΔU = +0.13",
      "Regulation score +8%",
      "No artifact increase",
      "Stable across 20 seeds"
    ],
    proposedAt: Date.now() - 864e5 * 3,
    resolvedAt: Date.now() - 864e5 * 1,
    source: "manual"
  },
  {
    id: "cand_002",
    subsystem: "Memory",
    description: "Add failure memory suppression bridge to route planning",
    status: "testing",
    baselineScore: 0.58,
    candidateScore: 0.68,
    evidence: ["Route revision quality +12%", "Pending ablation confirmation"],
    proposedAt: Date.now() - 864e5,
    source: "manual"
  },
  {
    id: "cand_003",
    subsystem: "Cardio/ANS",
    description: "Gate cardio_ans_to_threshold at parasympathetic > 0.7",
    status: "testing",
    baselineScore: 0.55,
    candidateScore: 0.62,
    evidence: [
      "Recovery transition quality up",
      "Awaiting cross-deployment test"
    ],
    proposedAt: Date.now() - 432e5,
    source: "manual"
  },
  {
    id: "cand_004",
    subsystem: "Cross-Timescale",
    description: "Fast-mid-slow bridge: slow memory bias to fast-loop caution",
    status: "proposed",
    baselineScore: 0,
    candidateScore: 0,
    evidence: [],
    proposedAt: Date.now() - 36e5,
    source: "threshold_engine"
  },
  {
    id: "cand_005",
    subsystem: "Computation",
    description: "Skip salience recompute when input delta < 0.02 threshold",
    status: "rejected",
    baselineScore: 0.72,
    candidateScore: 0.69,
    evidence: [
      "ΔU = -0.03",
      "Missed 4% of threat transitions",
      "Efficiency gain insufficient"
    ],
    proposedAt: Date.now() - 864e5 * 5,
    resolvedAt: Date.now() - 864e5 * 4,
    source: "manual"
  }
];
function createAutoMaturationLoop() {
  const candidates = initialCandidates.map((c) => ({ ...c }));
  const promoted = candidates.filter((c) => c.status === "promoted").length;
  const rejected = candidates.filter((c) => c.status === "rejected").length;
  return {
    candidates,
    maturityVector: {
      stability: 0.78,
      selectivity: 0.65,
      recurrence: 0.71,
      regulation: 0.62,
      adaptation: 0.58,
      measurability: 0.84
    },
    promotionCount: promoted,
    rejectionCount: rejected,
    overallScore: 0.7,
    lastConnectionIngest: 0,
    connectionCandidatesActive: 0
  };
}
function ingestConnectionRecommendations(loop, recommendations) {
  const activeConnIds = new Set(
    loop.candidates.filter((c) => c.status === "proposed" || c.status === "testing").map((c) => c.connectionId).filter(Boolean)
  );
  const newCandidates = [];
  for (const rec of recommendations) {
    if (activeConnIds.has(rec.connectionId)) continue;
    const subsystemLabel = SUBSYSTEM_LABEL_MAP[rec.connectionId] ?? rec.connectionId;
    const descriptionFn = ACTION_DESCRIPTION_MAP[rec.action];
    const description = descriptionFn ? descriptionFn(rec.connectionId) : `${rec.action} connection ${rec.connectionId}`;
    newCandidates.push({
      id: `conn_${rec.connectionId}_${Date.now() + newCandidates.length}`,
      subsystem: subsystemLabel,
      description,
      status: "proposed",
      source: "connection_optimizer",
      baselineScore: 0,
      candidateScore: 0,
      evidence: [
        `Optimizer action: ${rec.action}`,
        rec.reason,
        `Priority: ${(rec.priority * 100).toFixed(0)}%`,
        "Awaiting baseline batch"
      ],
      connectionId: rec.connectionId,
      proposedAt: Date.now()
    });
  }
  if (newCandidates.length === 0 && loop.lastConnectionIngest > 0) {
    return { ...loop, lastConnectionIngest: Date.now() };
  }
  const updatedCandidates = [...loop.candidates, ...newCandidates];
  const connectionCandidatesActive = updatedCandidates.filter(
    (c) => c.source === "connection_optimizer" && (c.status === "proposed" || c.status === "testing")
  ).length;
  return {
    ...loop,
    candidates: updatedCandidates,
    lastConnectionIngest: Date.now(),
    connectionCandidatesActive
  };
}
function promoteCandidate(loop, id) {
  const updated = loop.candidates.map(
    (c) => c.id === id ? { ...c, status: "promoted", resolvedAt: Date.now() } : c
  );
  const connectionCandidatesActive = updated.filter(
    (c) => c.source === "connection_optimizer" && (c.status === "proposed" || c.status === "testing")
  ).length;
  return {
    ...loop,
    candidates: updated,
    promotionCount: loop.promotionCount + 1,
    overallScore: Math.min(1, loop.overallScore + 0.02),
    connectionCandidatesActive
  };
}
function rejectCandidate(loop, id) {
  const updated = loop.candidates.map(
    (c) => c.id === id ? { ...c, status: "rejected", resolvedAt: Date.now() } : c
  );
  const connectionCandidatesActive = updated.filter(
    (c) => c.source === "connection_optimizer" && (c.status === "proposed" || c.status === "testing")
  ).length;
  return {
    ...loop,
    candidates: updated,
    rejectionCount: loop.rejectionCount + 1,
    connectionCandidatesActive
  };
}
function rollbackCandidate(loop, id) {
  const updated = loop.candidates.map(
    (c) => c.id === id ? {
      ...c,
      status: "rolled_back",
      resolvedAt: Date.now()
    } : c
  );
  return {
    ...loop,
    candidates: updated,
    overallScore: Math.max(0, loop.overallScore - 0.01)
  };
}
function computeMaturityVector(loop, neuralState) {
  var _a, _b;
  const satRatio = (((_a = neuralState.saturatedRegions) == null ? void 0 : _a.length) ?? 0) / Math.max(1, ((_b = neuralState.regions) == null ? void 0 : _b.length) ?? 246);
  const stability = Math.max(0.1, 1 - satRatio * 2);
  const avgAct = neuralState.regions ? neuralState.regions.reduce((s, r) => s + r.activation, 0) / neuralState.regions.length : 0.5;
  const selectivity = Math.max(0.1, 1 - avgAct);
  const mv = {
    stability: stability * 0.9 + loop.maturityVector.stability * 0.1,
    selectivity: selectivity * 0.7 + loop.maturityVector.selectivity * 0.3,
    recurrence: loop.maturityVector.recurrence,
    regulation: loop.maturityVector.regulation,
    adaptation: loop.maturityVector.adaptation,
    measurability: loop.maturityVector.measurability
  };
  const overall = Object.values(mv).reduce((s, v) => s + v, 0) / 6;
  return { ...loop, maturityVector: mv, overallScore: overall };
}
const BORDER = "oklch(0.18 0.05 255)";
const CYAN = "oklch(0.72 0.22 195)";
const GREEN = "oklch(0.68 0.28 140)";
const AMBER = "oklch(0.78 0.22 80)";
const RED = "oklch(0.72 0.22 25)";
const MUTED = "oklch(0.38 0.05 220)";
const DIM = "oklch(0.28 0.04 240)";
const PANEL = "oklch(0.09 0.015 265)";
const ORANGE = "oklch(0.72 0.22 45)";
function SectionHeader({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "px-3 py-1.5 border-b shrink-0",
      style: { borderColor: BORDER, background: "oklch(0.07 0.012 265)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-[9px] tracking-widest uppercase",
          style: { color: MUTED },
          children
        }
      )
    }
  );
}
function MiniBar({
  value,
  color,
  width = 100
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        width,
        height: 5,
        background: "oklch(0.14 0.03 255)",
        borderRadius: 3,
        overflow: "hidden"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            width: `${value * 100}%`,
            height: "100%",
            background: color,
            borderRadius: 3,
            transition: "width 0.6s ease"
          }
        }
      )
    }
  );
}
const STATUS_META = {
  proposed: { color: MUTED, label: "PROPOSED" },
  testing: { color: AMBER, label: "TESTING" },
  promoted: { color: GREEN, label: "PROMOTED" },
  rejected: { color: RED, label: "REJECTED" },
  rolled_back: { color: "oklch(0.5 0.1 280)", label: "ROLLED BACK" }
};
const SOURCE_META = {
  connection_optimizer: { color: CYAN, label: "CONN OPT" },
  manual: { color: DIM, label: "MANUAL" },
  threshold_engine: { color: AMBER, label: "THRESH" },
  regulation_optimizer: { color: AMBER, label: "REG OPT" }
};
const MV_LABELS = [
  { key: "stability", label: "Stability", color: GREEN },
  { key: "selectivity", label: "Selectivity", color: CYAN },
  { key: "recurrence", label: "Recurrence", color: "oklch(0.68 0.22 260)" },
  { key: "regulation", label: "Regulation", color: AMBER },
  { key: "adaptation", label: "Adaptation", color: "oklch(0.72 0.22 320)" },
  {
    key: "measurability",
    label: "Measurability",
    color: "oklch(0.65 0.2 180)"
  }
];
function CandidateCard({
  candidate,
  isExternal,
  onPromote,
  onReject,
  onRollback
}) {
  const meta = STATUS_META[candidate.status];
  const sourceMeta = SOURCE_META[candidate.source];
  const delta = candidate.candidateScore - candidate.baselineScore;
  const testing = candidate.status === "testing";
  const promoted = candidate.status === "promoted";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border flex flex-col gap-1.5 p-3",
      style: {
        background: PANEL,
        borderColor: `${meta.color}30`,
        borderLeft: `2px solid ${meta.color}`
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[9px]",
                style: { color: "oklch(0.7 0.12 200)" },
                children: candidate.subsystem
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px]",
                style: { color: MUTED, maxWidth: 260 },
                children: candidate.description
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0 flex-wrap justify-end", children: [
            isExternal && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px] tracking-widest uppercase px-1 py-0.5",
                style: {
                  background: `${ORANGE}20`,
                  color: ORANGE,
                  border: `1px solid ${ORANGE}40`
                },
                children: "EXTERNAL"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px] tracking-widest uppercase px-1 py-0.5",
                style: {
                  background: `${sourceMeta.color}15`,
                  color: sourceMeta.color,
                  border: `1px solid ${sourceMeta.color}25`
                },
                children: sourceMeta.label
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px] tracking-widest uppercase px-1.5 py-0.5",
                style: {
                  background: `${meta.color}18`,
                  color: meta.color,
                  border: `1px solid ${meta.color}30`
                },
                children: meta.label
              }
            )
          ] })
        ] }),
        (candidate.baselineScore > 0 || candidate.candidateScore > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px] uppercase",
                style: { color: DIM },
                children: "Base"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[8px]", style: { color: MUTED }, children: [
              (candidate.baselineScore * 100).toFixed(0),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px] uppercase",
                style: { color: DIM },
                children: "Cand"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[8px]", style: { color: CYAN }, children: [
              (candidate.candidateScore * 100).toFixed(0),
              "%"
            ] })
          ] }),
          delta !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[8px]",
              style: { color: delta > 0 ? GREEN : RED },
              children: [
                delta > 0 ? "+" : "",
                (delta * 100).toFixed(0),
                "%"
              ]
            }
          )
        ] }),
        candidate.evidence.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-0.5", children: candidate.evidence.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "font-mono text-[7px]",
            style: { color: DIM },
            children: [
              "· ",
              e
            ]
          },
          e
        )) }),
        testing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "maturation.confirm_button",
              onClick: () => onPromote(candidate.id),
              className: "font-mono text-[8px] tracking-widest uppercase px-2 py-1 border transition-all",
              style: {
                border: `1px solid ${GREEN}60`,
                color: GREEN,
                background: `${GREEN}10`
              },
              children: "Promote"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "maturation.cancel_button",
              onClick: () => onReject(candidate.id),
              className: "font-mono text-[8px] tracking-widest uppercase px-2 py-1 border transition-all",
              style: {
                border: `1px solid ${RED}60`,
                color: RED,
                background: `${RED}10`
              },
              children: "Reject"
            }
          )
        ] }),
        promoted && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "maturation.delete_button",
            onClick: () => onRollback(candidate.id),
            className: "font-mono text-[8px] tracking-widest uppercase px-2 py-1 border self-start transition-all",
            style: {
              border: `1px solid ${AMBER}60`,
              color: AMBER,
              background: `${AMBER}10`
            },
            children: "Rollback"
          }
        )
      ]
    }
  );
}
function ExternalCandidateFormPanel({
  adapters,
  onSubmit,
  onClose
}) {
  var _a;
  const [description, setDescription] = reactExports.useState("");
  const [evidenceItems, setEvidenceItems] = reactExports.useState([
    "ΔU > 0 measured over 20 seeds"
  ]);
  const [newEvidence, setNewEvidence] = reactExports.useState("");
  const [sourceAdapterId, setSourceAdapterId] = reactExports.useState(
    ((_a = adapters[0]) == null ? void 0 : _a.adapter_id) ?? "manual"
  );
  const [sourceType, setSourceType] = reactExports.useState(
    "external"
  );
  const [error, setError] = reactExports.useState("");
  function handleAddEvidence() {
    if (newEvidence.trim()) {
      setEvidenceItems((prev) => [...prev, newEvidence.trim()]);
      setNewEvidence("");
    }
  }
  function handleRemoveEvidence(i) {
    setEvidenceItems((prev) => prev.filter((_, idx) => idx !== i));
  }
  function handleSubmit() {
    if (!description.trim()) {
      setError("Description is required");
      return;
    }
    if (evidenceItems.length < 1) {
      setError("At least 1 evidence item required");
      return;
    }
    onSubmit({ description, evidenceItems, sourceAdapterId, sourceType });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border p-3 flex flex-col gap-2",
      style: {
        background: "oklch(0.08 0.015 265)",
        borderColor: `${ORANGE}35`
      },
      "data-ocid": "maturation.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[9px] tracking-widest uppercase",
              style: { color: ORANGE },
              children: "Submit External Candidate"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: DIM }, children: "Candidates go to validation queue only. No direct promotion." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              "data-ocid": "maturation.select",
              value: sourceType,
              onChange: (e) => setSourceType(e.target.value),
              className: "font-mono text-[8px] px-2 py-1 border",
              style: { background: PANEL, borderColor: BORDER, color: MUTED },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "internal", children: "internal" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "external", children: "external" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: sourceAdapterId,
              onChange: (e) => setSourceAdapterId(e.target.value),
              className: "font-mono text-[8px] px-2 py-1 border flex-1",
              style: { background: PANEL, borderColor: BORDER, color: MUTED },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "manual", children: "manual" }),
                adapters.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: a.adapter_id, children: a.adapter_name }, a.adapter_id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            "data-ocid": "maturation.textarea",
            value: description,
            onChange: (e) => setDescription(e.target.value),
            rows: 2,
            placeholder: "Describe the candidate architecture change...",
            className: "font-mono text-[8px] px-2 py-1.5 border resize-none w-full",
            style: { background: PANEL, borderColor: BORDER, color: MUTED }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px] uppercase", style: { color: DIM }, children: "Evidence (min 1 required)" }),
          evidenceItems.map((ev) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-mono text-[7px] flex-1",
                style: { color: MUTED },
                children: [
                  "· ",
                  ev
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => handleRemoveEvidence(evidenceItems.indexOf(ev)),
                className: "font-mono text-[7px] px-1",
                style: { color: RED },
                children: "×"
              }
            )
          ] }, ev)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: newEvidence,
                onChange: (e) => setNewEvidence(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter") handleAddEvidence();
                },
                placeholder: "Add evidence item…",
                className: "font-mono text-[8px] px-2 py-1 border flex-1",
                style: { background: PANEL, borderColor: BORDER, color: MUTED }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleAddEvidence,
                className: "font-mono text-[8px] uppercase px-2 py-1 border",
                style: {
                  border: `1px solid ${DIM}`,
                  color: DIM,
                  background: PANEL
                },
                children: "+"
              }
            )
          ] })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: RED }, children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "maturation.submit_button",
              onClick: handleSubmit,
              className: "font-mono text-[8px] tracking-widest uppercase px-3 py-1 border",
              style: {
                border: `1px solid ${ORANGE}60`,
                color: ORANGE,
                background: `${ORANGE}10`
              },
              children: "Submit to Queue"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "maturation.close_button",
              onClick: onClose,
              className: "font-mono text-[8px] tracking-widest uppercase px-3 py-1 border",
              style: {
                border: `1px solid ${DIM}40`,
                color: DIM,
                background: PANEL
              },
              children: "Cancel"
            }
          )
        ] })
      ]
    }
  );
}
function MaturationTab({ neural }) {
  const [loop, setLoop] = reactExports.useState(() => createAutoMaturationLoop());
  const [showExternalForm, setShowExternalForm] = reactExports.useState(false);
  const integration = useBrainIntegrationSystem();
  const registry = reactExports.useMemo(
    () => updateConnectionWeights(createConnectionRegistry(), {
      sympatheticTone: neural.sympatheticTone,
      stressLoad: neural.sympatheticTone * 0.8,
      isRunning: neural.isRunning
    }),
    [neural.sympatheticTone, neural.isRunning]
  );
  const recs = reactExports.useMemo(
    () => getOptimizationRecommendations(registry),
    [registry]
  );
  reactExports.useEffect(() => {
    setLoop((l) => ingestConnectionRecommendations(l, recs));
  }, [recs]);
  const liveLoop = reactExports.useMemo(
    () => computeMaturityVector(loop, {
      saturatedRegions: neural.saturatedRegions,
      isRunning: neural.isRunning,
      regions: neural.regions
    }),
    [loop, neural.saturatedRegions, neural.isRunning, neural.regions]
  );
  const mv = liveLoop.maturityVector;
  const overallPct = (liveLoop.overallScore * 100).toFixed(0);
  const ingestAge = liveLoop.lastConnectionIngest > 0 ? Math.floor((Date.now() - liveLoop.lastConnectionIngest) / 1e3) : null;
  const externalCandidates = integration.candidateQueue;
  function handleExternalSubmit(form) {
    const adapter = integration.adapters.find(
      (a) => a.adapter_id === form.sourceAdapterId
    );
    integration.submitCandidate({
      source_type: form.sourceType,
      source_adapter_id: form.sourceAdapterId !== "manual" ? form.sourceAdapterId : void 0,
      description: form.description,
      evidence: form.evidenceItems,
      attribution: adapter ? `${adapter.adapter_name} / ${form.sourceType}` : `manual / ${form.sourceType}`
    });
    setShowExternalForm(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "flex flex-col border-r",
        style: { flex: "0 0 32%", overflow: "hidden", borderColor: BORDER },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "Maturity Vector · 6 Dimensions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 flex flex-col gap-3", children: MV_LABELS.map(({ key, label, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase",
                  style: { color: MUTED },
                  children: label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[9px]", style: { color }, children: [
                (mv[key] * 100).toFixed(0),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBar, { value: mv[key], color, width: 220 })
          ] }, key)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "border-t p-3 flex flex-col gap-2",
              style: { borderColor: BORDER },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[9px] tracking-widest uppercase",
                      style: { color: MUTED },
                      children: "Overall Score"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-sm font-bold",
                      style: {
                        color: liveLoop.overallScore > 0.7 ? GREEN : liveLoop.overallScore > 0.5 ? AMBER : RED
                      },
                      children: [
                        overallPct,
                        "%"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  MiniBar,
                  {
                    value: liveLoop.overallScore,
                    color: liveLoop.overallScore > 0.7 ? GREEN : AMBER,
                    width: 220
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] uppercase",
                        style: { color: DIM },
                        children: "Promoted"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[11px] font-bold",
                        style: { color: GREEN },
                        children: liveLoop.promotionCount
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] uppercase",
                        style: { color: DIM },
                        children: "Rejected"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[11px] font-bold",
                        style: { color: RED },
                        children: liveLoop.rejectionCount
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] uppercase",
                        style: { color: DIM },
                        children: "In Testing"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[11px] font-bold",
                        style: { color: AMBER },
                        children: liveLoop.candidates.filter((c) => c.status === "testing").length
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] uppercase",
                        style: { color: DIM },
                        children: "External"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[11px] font-bold",
                        style: { color: ORANGE },
                        children: externalCandidates.length
                      }
                    )
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "border-t p-3 flex flex-col gap-1.5",
              style: { borderColor: BORDER },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: liveLoop.connectionCandidatesActive > 0 ? GREEN : DIM,
                        boxShadow: liveLoop.connectionCandidatesActive > 0 ? `0 0 6px ${GREEN}` : "none",
                        flexShrink: 0
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px] tracking-widest uppercase",
                      style: {
                        color: liveLoop.connectionCandidatesActive > 0 ? GREEN : DIM
                      },
                      children: "Connection Optimizer Wired"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: DIM }, children: [
                  "Last ingest: ",
                  ingestAge !== null ? `${ingestAge}s ago` : "Pending"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: MUTED }, children: [
                  "Active conn-sourced candidates:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: CYAN }, children: liveLoop.connectionCandidatesActive })
                ] })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "flex flex-col",
        style: { flex: 1, overflow: "hidden" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between border-b px-3 py-1.5 shrink-0",
              style: { borderColor: BORDER, background: "oklch(0.07 0.012 265)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[9px] tracking-widest uppercase",
                    style: { color: MUTED },
                    children: "Candidate Change Queue"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "maturation.open_modal_button",
                    onClick: () => setShowExternalForm((v) => !v),
                    className: "font-mono text-[8px] tracking-widest uppercase px-2 py-1 border transition-all",
                    style: {
                      border: `1px solid ${ORANGE}50`,
                      color: ORANGE,
                      background: showExternalForm ? `${ORANGE}15` : `${ORANGE}08`
                    },
                    children: showExternalForm ? "× Cancel" : "+ Submit External"
                  }
                )
              ]
            }
          ),
          showExternalForm && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "px-2 py-2 border-b shrink-0",
              style: { borderColor: BORDER },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ExternalCandidateFormPanel,
                {
                  adapters: integration.adapters.filter(
                    (a) => a.status === "active"
                  ),
                  onSubmit: handleExternalSubmit,
                  onClose: () => setShowExternalForm(false)
                }
              )
            }
          ),
          showExternalForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-3 py-1.5 border-b shrink-0 flex items-center gap-2",
              style: { borderColor: BORDER },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-1.5 h-1.5 rounded-full",
                    style: { background: GREEN }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: GREEN }, children: "Mutation boundary enforced — candidates go to queue only, no direct promotion" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "maturation.list",
              className: "flex-1 overflow-y-auto p-2 flex flex-col gap-1.5",
              children: [
                externalCandidates.map((ec, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": `maturation.item.${i + 1}`,
                    className: "border flex flex-col gap-1.5 p-3",
                    style: {
                      background: PANEL,
                      borderColor: `${ORANGE}30`,
                      borderLeft: `2px solid ${ORANGE}`
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[9px]",
                              style: { color: "oklch(0.7 0.12 200)" },
                              children: "External Submission"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[8px]",
                              style: { color: MUTED, maxWidth: 260 },
                              children: ec.description
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[7px] tracking-widest uppercase px-1 py-0.5",
                              style: {
                                background: `${ORANGE}20`,
                                color: ORANGE,
                                border: `1px solid ${ORANGE}40`
                              },
                              children: "EXTERNAL"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[7px] tracking-widest uppercase px-1 py-0.5",
                              style: {
                                background: `${AMBER}18`,
                                color: AMBER,
                                border: `1px solid ${AMBER}30`
                              },
                              children: ec.status.toUpperCase()
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-0.5", children: ec.evidence.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "font-mono text-[7px]",
                          style: { color: DIM },
                          children: [
                            "· ",
                            e
                          ]
                        },
                        e
                      )) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: DIM }, children: [
                        "Attribution: ",
                        ec.attribution,
                        " ·",
                        " ",
                        new Date(ec.submitted_at).toLocaleTimeString()
                      ] }),
                      ec.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => integration.reviewCandidate(
                              ec.id,
                              "promote",
                              "Evidence sufficient"
                            ),
                            className: "font-mono text-[7px] uppercase px-2 py-0.5 border",
                            style: {
                              border: `1px solid ${GREEN}50`,
                              color: GREEN,
                              background: `${GREEN}08`
                            },
                            children: "Promote"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => integration.reviewCandidate(
                              ec.id,
                              "reject",
                              "Insufficient evidence"
                            ),
                            className: "font-mono text-[7px] uppercase px-2 py-0.5 border",
                            style: {
                              border: `1px solid ${RED}50`,
                              color: RED,
                              background: `${RED}08`
                            },
                            children: "Reject"
                          }
                        )
                      ] })
                    ]
                  },
                  ec.id
                )),
                liveLoop.candidates.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    "data-ocid": `maturation.item.${i + externalCandidates.length + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CandidateCard,
                      {
                        candidate: c,
                        isExternal: false,
                        onPromote: (id) => setLoop((l) => promoteCandidate(l, id)),
                        onReject: (id) => setLoop((l) => rejectCandidate(l, id)),
                        onRollback: (id) => setLoop((l) => rollbackCandidate(l, id))
                      }
                    )
                  },
                  c.id
                )),
                liveLoop.candidates.length === 0 && externalCandidates.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    "data-ocid": "maturation.empty_state",
                    className: "p-6 text-center font-mono text-[9px]",
                    style: { color: DIM },
                    children: "No candidates in queue"
                  }
                )
              ]
            }
          )
        ]
      }
    )
  ] });
}
export {
  MaturationTab as default
};
