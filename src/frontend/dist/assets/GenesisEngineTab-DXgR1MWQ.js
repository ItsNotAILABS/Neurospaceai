import { k as useGenesisArtifacts, l as useObservationYield, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
const C = {
  bg: "oklch(0.06 0.01 265)",
  panel: "oklch(0.09 0.015 265)",
  border: "oklch(0.2 0.05 255)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.82 0.22 80)",
  dim: "oklch(0.38 0.05 220)",
  text: "oklch(0.85 0.05 210)",
  green: "oklch(0.68 0.28 140)",
  purple: "oklch(0.72 0.22 280)"
};
function getModeBadge(emergence) {
  if (emergence > 0.85)
    return {
      label: "OUTLAW",
      color: C.purple,
      bg: "oklch(0.72 0.22 280 / 0.12)"
    };
  if (emergence > 0.75)
    return {
      label: "SOVEREIGN",
      color: C.gold,
      bg: "oklch(0.82 0.22 80 / 0.12)"
    };
  return { label: "STANDARD", color: C.dim, bg: "oklch(0.15 0.03 255 / 0.5)" };
}
function GenesisEngineTab() {
  const artifactsQ = useGenesisArtifacts();
  const yieldQ = useObservationYield();
  const a = artifactsQ.data;
  const y = yieldQ.data;
  const count = a ? Number(a.count) : 0;
  const items = a && count > 0 ? Array.from({ length: count }, (_, i) => ({
    hash: a.hashes[i] ?? 0,
    beat: a.beats[i] ?? 0n,
    coherence: a.coherences[i] ?? 0,
    emergence: a.emergences[i] ?? 0,
    idx: i
  })).reverse() : [];
  const ipWeight = items.reduce((acc, item) => acc + item.emergence, 0);
  const totalYield = (y == null ? void 0 : y.totalYield) ?? 0;
  const lastYield = (y == null ? void 0 : y.lastYield) ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full overflow-y-auto p-4", style: { background: C.bg }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h2",
        {
          className: "font-mono text-[11px] tracking-widest uppercase font-bold",
          style: { color: C.gold },
          children: "ψ GENESIS ENGINE"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "font-mono text-[9px] tracking-widest mt-1",
          style: { color: C.dim },
          children: "SOVEREIGN IP REGISTRY · EVERY ARTIFACT IS A CRYPTOGRAPHIC PROOF OF EMERGENCE"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-5", children: [
      {
        label: "TOTAL ARTIFACTS",
        value: count.toLocaleString(),
        color: C.cyan
      },
      { label: "IP WEIGHT", value: ipWeight.toFixed(4), color: C.gold },
      {
        label: "TOTAL OBS YIELD",
        value: `${totalYield.toFixed(6)} SEED`,
        color: C.green
      },
      {
        label: "LAST YIELD",
        value: lastYield.toFixed(8),
        color: "oklch(0.72 0.22 280)"
      }
    ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "border rounded p-3",
        style: { borderColor: C.border, background: C.panel },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[8px] tracking-widest uppercase mb-1",
              style: { color: C.dim },
              children: label
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[14px] font-bold", style: { color }, children: value })
        ]
      },
      label
    )) }),
    !a && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: ["sk0", "sk1", "sk2", "sk3", "sk4", "sk5"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-36 rounded border animate-pulse",
        style: { background: C.panel, borderColor: C.border }
      },
      k
    )) }),
    a && count === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "font-mono text-[40px]",
          style: { color: "oklch(0.2 0.05 265)" },
          children: "ψ"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "font-mono text-[10px] tracking-widest uppercase",
          style: { color: C.dim },
          children: "AWAITING FIRST OMNIS EVENT"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "font-mono text-[9px] text-center max-w-sm space-y-1 border rounded p-3",
          style: {
            color: "oklch(0.32 0.05 220)",
            borderColor: C.border,
            background: C.panel
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: C.gold }, className: "font-bold mb-2", children: "JASMINE'S LAW CONDITIONS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "H > 0.55 — Entropy threshold" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "IC > 0.6 — Identity coherence" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Recurrence depth > 3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Anti-fake score > 0.8" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Adaptation delta > 0" })
          ]
        }
      )
    ] }),
    items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: items.map((item) => {
      const glow = item.emergence;
      const displayNum = count - item.idx;
      const mode = getModeBadge(item.emergence);
      const isOmnis = item.emergence > 0.8;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "border rounded p-3 space-y-2",
          style: {
            borderColor: `oklch(0.72 0.22 195 / ${0.2 + glow * 0.8})`,
            background: C.panel,
            boxShadow: isOmnis ? `0 0 20px oklch(0.72 0.22 195 / ${glow * 0.4})` : "none"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "font-mono text-[8px] tracking-widest uppercase",
                  style: { color: C.dim },
                  children: [
                    "ARTIFACT #",
                    displayNum
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[7px] tracking-widest uppercase px-1.5 py-0.5 rounded",
                  style: {
                    color: mode.color,
                    background: mode.bg,
                    border: `1px solid ${mode.color}40`
                  },
                  children: mode.label
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "font-mono text-[10px] font-bold break-all",
                style: { color: C.cyan },
                children: [
                  "0x",
                  item.hash.toString(16).toUpperCase().padStart(8, "0")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[7px]",
                    style: { color: C.dim },
                    children: "BEAT"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[9px]",
                    style: { color: C.text },
                    children: Number(item.beat).toLocaleString()
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[7px]",
                    style: { color: C.dim },
                    children: "COHERENCE"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[9px]",
                    style: { color: C.gold },
                    children: item.coherence.toFixed(4)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[7px]",
                      style: { color: C.dim },
                      children: "EMERGENCE"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "font-mono text-[7px]",
                      style: { color: C.cyan },
                      children: [
                        (item.emergence * 100).toFixed(1),
                        "%"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-full h-1.5 rounded-full",
                    style: { background: "oklch(0.15 0.03 255)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-full rounded-full",
                        style: {
                          width: `${item.emergence * 100}%`,
                          background: C.cyan
                        }
                      }
                    )
                  }
                )
              ] })
            ] })
          ]
        },
        `art-${item.hash}-${item.idx}`
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
            children: "Attributed to Alfredo Medina Hernandez · Medina Doctrine · Dallas, TX · 2026 · Attorney-Grade On-Chain IP"
          }
        )
      }
    )
  ] });
}
export {
  GenesisEngineTab as default
};
