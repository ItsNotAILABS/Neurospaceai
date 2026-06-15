import { u as useActor, r as reactExports, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
import { m as motion } from "./proxy-BnoGaVMl.js";
var ModelTier = /* @__PURE__ */ ((ModelTier2) => {
  ModelTier2["M0"] = "M0";
  ModelTier2["M1"] = "M1";
  ModelTier2["M2"] = "M2";
  return ModelTier2;
})(ModelTier || {});
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
  gray: "oklch(0.42 0.02 250)"
};
const TIER_CONFIG = {
  [ModelTier.M0]: {
    color: C.gray,
    borderColor: "oklch(0.3 0.02 250)",
    glow: "none",
    label: "M0"
  },
  [ModelTier.M1]: {
    color: "oklch(0.82 0.22 80)",
    borderColor: "oklch(0.6 0.2 80)",
    glow: "none",
    label: "M1"
  },
  [ModelTier.M2]: {
    color: C.cyan,
    borderColor: "oklch(0.65 0.22 195)",
    glow: "0 0 8px rgba(6,182,212,0.4)",
    label: "M2"
  }
};
function TierBadge({ tier }) {
  const t = TIER_CONFIG[tier];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "font-mono text-[8px] font-bold tracking-widest px-1.5 py-0.5 border",
      style: {
        color: t.color,
        borderColor: t.borderColor,
        background: `${t.color}18`,
        boxShadow: t.glow
      },
      children: t.label
    }
  );
}
function SummaryCell({
  label,
  value,
  color
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
            className: "font-mono text-2xl font-bold leading-none",
            style: { color, textShadow: `0 0 12px ${color}50` },
            children: value
          }
        )
      ]
    }
  );
}
function CoherenceBar({
  tier,
  proofCount
}) {
  const threshold = tier === ModelTier.M0 ? 5 : tier === ModelTier.M1 ? 20 : 20;
  const pct = Math.min(100, Math.round(proofCount / threshold * 100));
  const tierConf = TIER_CONFIG[tier];
  const atMax = pct >= 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: C.dimlo }, children: "PROOF PROGRESS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "font-mono text-[7px] font-bold",
          style: { color: atMax ? C.green : tierConf.color },
          children: [
            proofCount,
            "/",
            threshold
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1", style: { background: "oklch(0.12 0.01 265)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-full transition-all duration-700",
        style: {
          width: `${pct}%`,
          background: atMax ? C.green : tierConf.color,
          boxShadow: atMax ? `0 0 4px ${C.green}` : tierConf.glow
        }
      }
    ) })
  ] });
}
function ModelCard({
  record,
  index,
  onRequestPromotion
}) {
  const [showOverlay, setShowOverlay] = reactExports.useState(false);
  const tierConf = TIER_CONFIG[record.tier];
  const proofCount = record.proofBundles.length;
  const gateHashDisplay = record.adreGateHash.length >= 8 ? record.adreGateHash.slice(0, 8).toUpperCase() : record.adreGateHash.toUpperCase();
  const canPromote = record.tier === ModelTier.M0 || record.tier === ModelTier.M1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative border flex flex-col gap-2 p-3 transition-all",
      style: {
        background: C.panel,
        borderColor: record.pendingPromotion ? `${C.amber}60` : `${tierConf.borderColor}50`,
        boxShadow: record.tier === ModelTier.M2 ? tierConf.glow : "none"
      },
      "data-ocid": `modelpromo.model.item.${index}`,
      children: [
        record.pendingPromotion && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-0 left-0 right-0 h-px animate-pulse",
            style: { background: C.amber, boxShadow: `0 0 6px ${C.amber}` }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[9px] font-bold tracking-wide truncate",
                style: { color: C.fg },
                children: record.name
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[7px] tracking-widest",
                style: { color: C.dimlo },
                children: record.id
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
            record.pendingPromotion && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[6px] font-bold px-1 py-0.5 animate-pulse",
                style: {
                  color: C.amber,
                  background: `${C.amber}18`,
                  border: `1px solid ${C.amber}50`
                },
                children: "PENDING"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TierBadge, { tier: record.tier })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[6px] tracking-widest uppercase",
                style: { color: C.dim },
                children: "PROOFS"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[10px] font-bold",
                style: { color: tierConf.color },
                children: proofCount
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[6px] tracking-widest uppercase",
                style: { color: C.dim },
                children: "CONSUMERS"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[10px] font-bold",
                style: { color: C.cyan },
                children: String(record.consumerCount)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[6px] tracking-widest uppercase",
                style: { color: C.dim },
                children: "GATE HASH"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px] font-bold",
                style: { color: C.dimlo },
                children: gateHashDisplay || "——"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CoherenceBar, { tier: record.tier, proofCount }),
        canPromote && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "font-mono text-[7px] tracking-widest uppercase py-1 border transition-all mt-0.5",
            style: {
              color: tierConf.color,
              borderColor: `${tierConf.borderColor}60`,
              background: "transparent"
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.background = `${tierConf.color}12`;
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.background = "transparent";
            },
            onClick: () => setShowOverlay(true),
            "data-ocid": `modelpromo.promote.open_modal_button.${index}`,
            children: [
              "▲ REQUEST PROMOTION → ",
              record.tier === ModelTier.M0 ? "M1" : "M2"
            ]
          }
        ),
        showOverlay && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "absolute inset-0 flex flex-col items-center justify-center gap-3 z-10",
            style: {
              background: "oklch(0.06 0.015 265 / 0.96)",
              border: `1px solid ${tierConf.borderColor}`
            },
            "data-ocid": `modelpromo.promote.dialog.${index}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] tracking-widest",
                    style: { color: C.dim },
                    children: "PROMOTE MODEL"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[10px] font-bold",
                    style: { color: C.fg },
                    children: record.name
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[7px]", style: { color: C.dimlo }, children: [
                  record.tier,
                  " → ",
                  record.tier === ModelTier.M0 ? "M1" : "M2"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "font-mono text-[8px] tracking-widest px-3 py-1.5 border transition-all",
                    style: {
                      color: tierConf.color,
                      borderColor: tierConf.borderColor,
                      background: `${tierConf.color}12`
                    },
                    onClick: () => {
                      setShowOverlay(false);
                      onRequestPromotion(record.id);
                    },
                    "data-ocid": `modelpromo.promote.confirm_button.${index}`,
                    children: "CONFIRM"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "font-mono text-[8px] tracking-widest px-3 py-1.5 border transition-all",
                    style: {
                      color: C.dim,
                      borderColor: C.borderLo,
                      background: "transparent"
                    },
                    onClick: () => setShowOverlay(false),
                    "data-ocid": `modelpromo.promote.cancel_button.${index}`,
                    children: "CANCEL"
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
function FlashBanner({
  message,
  success
}) {
  const color = success ? C.green : C.red;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: -8 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0 },
      className: "font-mono text-[9px] tracking-widest text-center py-2 border",
      style: {
        color,
        borderColor: `${color}50`,
        background: `${color}10`,
        boxShadow: `0 0 12px ${color}30`
      },
      "data-ocid": "modelpromo.flash.toast",
      children: message
    }
  );
}
function ModelPromotionTab() {
  const { actor, isFetching } = useActor();
  const [records, setRecords] = reactExports.useState([]);
  const [summary, setSummary] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [tierFilter, setTierFilter] = reactExports.useState("ALL");
  const [flash, setFlash] = reactExports.useState(null);
  const intervalRef = reactExports.useRef(null);
  const flashTimerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!actor || isFetching) return;
    const poll = async () => {
      var _a, _b;
      try {
        const [snap, sum] = await Promise.all([
          (_a = actor.getPromotionSnapshot) == null ? void 0 : _a.call(actor),
          (_b = actor.getPromotionSummary) == null ? void 0 : _b.call(actor)
        ]);
        if (snap) setRecords(snap);
        if (sum) setSummary(sum);
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
  const handleRequestPromotion = async (modelId) => {
    var _a, _b, _c;
    if (!actor) return;
    try {
      const result = await ((_a = actor.requestModelPromotion) == null ? void 0 : _a.call(actor, modelId, "ADRE-AUTO"));
      const success = (result == null ? void 0 : result[0]) ?? false;
      const msg = (result == null ? void 0 : result[1]) ?? "UNKNOWN RESULT";
      setFlash({
        message: success ? `▲ PROMOTION GRANTED: ${msg}` : `✗ PROMOTION DENIED: ${msg}`,
        success
      });
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      flashTimerRef.current = setTimeout(() => setFlash(null), 4e3);
      try {
        const [snap, sum] = await Promise.all([
          (_b = actor.getPromotionSnapshot) == null ? void 0 : _b.call(actor),
          (_c = actor.getPromotionSummary) == null ? void 0 : _c.call(actor)
        ]);
        if (snap) setRecords(snap);
        if (sum) setSummary(sum);
      } catch {
      }
    } catch {
      setFlash({
        message: "✗ PROMOTION REQUEST FAILED — ACTOR UNREACHABLE",
        success: false
      });
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      flashTimerRef.current = setTimeout(() => setFlash(null), 4e3);
    }
  };
  const filtered = records.filter(
    (r) => tierFilter === "ALL" ? true : r.tier === tierFilter
  );
  const m0 = summary ? Number(summary.m0Count) : records.filter((r) => r.tier === ModelTier.M0).length;
  const m1 = summary ? Number(summary.m1Count) : records.filter((r) => r.tier === ModelTier.M1).length;
  const m2 = summary ? Number(summary.m2Count) : records.filter((r) => r.tier === ModelTier.M2).length;
  const totalProofs = summary ? Number(summary.totalProofBundles) : 0;
  const FILTERS = [
    { id: "ALL", label: "ALL", color: C.cyan },
    { id: ModelTier.M0, label: "M0", color: C.gray },
    { id: ModelTier.M1, label: "M1", color: C.gold },
    { id: ModelTier.M2, label: "M2", color: C.cyan }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-y-auto",
      style: { background: C.bg },
      "data-ocid": "modelpromo.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -4 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4 },
            className: "flex items-center justify-between px-4 py-3 border-b shrink-0",
            style: { background: "oklch(0.065 0.012 230)", borderColor: C.border },
            "data-ocid": "modelpromo.header.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-3 h-3 shrink-0",
                    style: {
                      background: loading ? C.dimlo : C.cyan,
                      boxShadow: loading ? "none" : `0 0 10px ${C.cyan}`,
                      transition: "all 0.5s"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-xl font-bold tracking-widest",
                    style: { color: C.cyan },
                    children: "MODEL PROMOTION REGISTRY"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[8px] tracking-widest",
                  style: { color: C.dimlo },
                  children: "M0 → M1 → M2 ADRE-GATED PROMOTION CHAIN"
                }
              )
            ]
          }
        ),
        flash && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FlashBanner, { message: flash.message, success: flash.success }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.3, delay: 0.05 },
              className: "grid grid-cols-4 gap-2",
              "data-ocid": "modelpromo.summary.section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCell, { label: "M0 MODELS", value: String(m0), color: C.gray }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCell, { label: "M1 MODELS", value: String(m1), color: C.gold }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCell, { label: "M2 MODELS", value: String(m2), color: C.cyan }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SummaryCell,
                  {
                    label: "TOTAL PROOF BUNDLES",
                    value: String(totalProofs),
                    color: C.green
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 4 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.3, delay: 0.1 },
              className: "flex items-center gap-2",
              "data-ocid": "modelpromo.tier_filter.section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] tracking-widest",
                    style: { color: C.dim },
                    children: "FILTER:"
                  }
                ),
                FILTERS.map(({ id, label, color }) => {
                  const isActive = tierFilter === id;
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "font-mono text-[8px] tracking-widest px-2.5 py-1 border transition-all",
                      style: {
                        color: isActive ? color : C.dim,
                        borderColor: isActive ? `${color}70` : C.borderLo,
                        background: isActive ? `${color}14` : "transparent",
                        boxShadow: isActive && id === "ALL" ? `0 0 8px ${color}25` : "none"
                      },
                      onClick: () => setTierFilter(id),
                      "data-ocid": `modelpromo.filter.${label.toLowerCase()}.tab`,
                      children: label
                    },
                    id
                  );
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono text-[8px] ml-auto",
                    style: { color: C.dimlo },
                    children: [
                      filtered.length,
                      " MODELS"
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.3, delay: 0.15 },
              children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center justify-center h-32 border font-mono text-[9px] tracking-widest",
                  style: {
                    borderColor: C.borderLo,
                    background: C.panel,
                    color: C.dimlo
                  },
                  "data-ocid": "modelpromo.grid.loading_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: C.cyan }, children: "●" }),
                    " LOADING MODEL REGISTRY…"
                  ]
                }
              ) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col items-center justify-center h-32 border gap-2 font-mono",
                  style: { borderColor: C.borderLo, background: C.panel },
                  "data-ocid": "modelpromo.grid.empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "text-[10px] tracking-widest",
                        style: { color: C.dimlo },
                        children: [
                          "NO MODELS IN TIER ",
                          tierFilter
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        className: "text-[8px] tracking-widest px-2 py-1 border transition-all",
                        style: { color: C.cyan, borderColor: `${C.cyan}50` },
                        onClick: () => setTierFilter("ALL"),
                        children: "SHOW ALL"
                      }
                    )
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "grid gap-2",
                  style: {
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))"
                  },
                  "data-ocid": "modelpromo.grid.list",
                  children: filtered.map((record, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ModelCard,
                    {
                      record,
                      index: i + 1,
                      onRequestPromotion: handleRequestPromotion
                    },
                    record.id
                  ))
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { duration: 0.3, delay: 0.25 },
              className: "flex items-center gap-4 border-t pt-3",
              style: { borderColor: C.borderLo },
              "data-ocid": "modelpromo.legend.section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[7px] tracking-widest",
                    style: { color: C.dimlo },
                    children: "TIER LEGEND:"
                  }
                ),
                [
                  { tier: ModelTier.M0, desc: "UNVALIDATED — GROUND STATE" },
                  { tier: ModelTier.M1, desc: "VALIDATED — MULTI-CONSUMER PROOF" },
                  { tier: ModelTier.M2, desc: "SOVEREIGN — FULL FIELD COUPLING" }
                ].map(({ tier, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TierBadge, { tier }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[6px] tracking-wide",
                      style: { color: C.dim },
                      children: desc
                    }
                  )
                ] }, tier))
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  ModelPromotionTab as default
};
