import { u as useActor, a as useQuery, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
const C = {
  bg: "oklch(0.06 0.01 265)",
  panel: "oklch(0.09 0.015 265)",
  border: "oklch(0.2 0.05 255)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.82 0.22 80)",
  dim: "oklch(0.38 0.05 220)",
  text: "oklch(0.85 0.05 210)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.78 0.2 70)"
};
const NODES = [
  {
    id: "VAULT",
    live: true,
    desc: "Zero-Exposure Wall · Semantic Mapping · Vault Key Storage",
    details: [
      "ZERO-EXPOSURE WALL",
      "SEMANTIC MAPPING",
      "VAULT KEY",
      "JURISDICTION"
    ]
  },
  {
    id: "CHRONO",
    desc: "Temporal Coordination · Time-lock Events · Beat Synchronization"
  },
  {
    id: "NEXUS",
    desc: "Cross-Organism Routing · Ecosystem Signal Bus · Relay"
  },
  {
    id: "AEGIS",
    desc: "Defense Coordination · Threat Response · Lock Protocol"
  },
  {
    id: "ANIMA",
    desc: "Identity Chain · Continuity Verification · ANT Minting"
  },
  {
    id: "FORGE",
    desc: "Construction Engine · World Building · Structure Generation"
  },
  {
    id: "GENESIS",
    desc: "Artifact Aggregation · IP Registry · NFT Attribution"
  },
  {
    id: "OMNIS",
    desc: "Emergence Governance · OMNIS Arbitration · Quality Gate"
  },
  { id: "ARES", desc: "Temporal Reversal · Failed State Archive · Recovery" },
  {
    id: "GAIA",
    desc: "Repair Coordination · Substrate Healing · Recovery Boost"
  },
  {
    id: "SENTINEL",
    desc: "Anomaly Watch · Signal Monitoring · Threat Detection"
  },
  {
    id: "VULCAN",
    desc: "Fortification · Prediction Hardening · Defense Optimization"
  }
];
function MasterNodesTab() {
  const { actor } = useActor();
  const attrQ = useQuery({
    queryKey: ["creatorAttribution"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCreatorAttribution();
    },
    enabled: !!actor,
    refetchInterval: 3e4
  });
  const attr = attrQ.data;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full overflow-y-auto p-4", style: { background: C.bg }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h2",
        {
          className: "font-mono text-[11px] tracking-widest uppercase font-bold",
          style: { color: C.gold },
          children: "12 MASTER NODES — ECOSYSTEM MACRO-GOVERNORS"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "font-mono text-[9px] tracking-widest mt-1",
          style: { color: C.dim },
          children: "Each node is a sovereign intelligence coordinating one domain across the entire ecosystem."
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3", children: NODES.map((node) => {
      const isLive = node.live;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "border rounded p-3 space-y-2",
          style: {
            borderColor: isLive ? C.green : C.border,
            background: C.panel,
            boxShadow: isLive ? "0 0 16px oklch(0.68 0.28 140 / 0.15)" : "none"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[11px] font-bold tracking-widest",
                  style: { color: isLive ? C.green : C.cyan },
                  children: node.id
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px] tracking-widest uppercase px-1.5 py-0.5 rounded",
                  style: {
                    color: isLive ? C.green : C.amber,
                    background: isLive ? "oklch(0.68 0.28 140 / 0.12)" : "oklch(0.78 0.2 70 / 0.12)",
                    border: isLive ? "1px solid oklch(0.68 0.28 140 / 0.4)" : "1px solid oklch(0.78 0.2 70 / 0.4)"
                  },
                  children: isLive ? "DEPLOYED" : "PENDING"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "font-mono text-[8px] leading-relaxed",
                style: { color: C.dim },
                children: node.desc
              }
            ),
            isLive && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "space-y-1 mt-2 pt-2 border-t",
                style: { borderColor: C.border },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px]",
                        style: { color: C.dim },
                        children: "STATUS"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] font-bold",
                        style: { color: C.green },
                        children: "ACTIVE"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px]",
                        style: { color: C.dim },
                        children: "ZERO-EXPOSURE WALL"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] font-bold",
                        style: { color: C.green },
                        children: "ON"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px]",
                        style: { color: C.dim },
                        children: "SEMANTIC MAP"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] font-bold",
                        style: { color: C.gold },
                        children: "ENCRYPTED"
                      }
                    )
                  ] }),
                  attr && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "font-mono text-[7px]",
                          style: { color: C.dim },
                          children: "VAULT KEY"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "font-mono text-[8px] break-all",
                          style: { color: C.cyan },
                          children: [
                            "0x",
                            attr.doctrineHash.toString(16).toUpperCase().padStart(8, "0")
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[7px]",
                          style: { color: C.dim },
                          children: "JURISDICTION"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[7px] font-bold",
                          style: { color: C.text },
                          children: attr.jurisdiction
                        }
                      )
                    ] })
                  ] })
                ]
              }
            ),
            !isLive && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-8 h-8 rounded-full flex items-center justify-center",
                style: {
                  border: "1px solid oklch(0.78 0.2 70 / 0.3)",
                  color: C.amber
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", children: "0%" })
              }
            ) })
          ]
        },
        node.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "mt-8 pt-4 border-t text-center",
        style: { borderColor: C.border },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "font-mono text-[8px] tracking-widest",
            style: { color: "oklch(0.28 0.04 220)" },
            children: "Medina Doctrine · 12-Node Sovereign Ecosystem Architecture · Dallas, TX · 2026"
          }
        )
      }
    )
  ] });
}
export {
  MasterNodesTab as default
};
