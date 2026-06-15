import { u as useActor, b as useCreatorReserve, c as useMiningState, d as useSetCreatorPrincipal, r as reactExports, a as useQuery, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
const C = {
  bg: "oklch(0.06 0.01 265)",
  panel: "oklch(0.09 0.015 265)",
  border: "oklch(0.2 0.05 255)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.82 0.22 80)",
  green: "oklch(0.68 0.28 140)",
  dim: "oklch(0.38 0.05 220)",
  text: "oklch(0.85 0.05 210)",
  amber: "oklch(0.78 0.22 80)",
  red: "oklch(0.65 0.25 25)"
};
function Bar({
  value,
  color,
  max = 1
}) {
  const pct = Math.min(100, value / max * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "w-full h-1.5 rounded-full",
      style: { background: "oklch(0.15 0.03 255)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full rounded-full transition-all duration-700",
          style: { width: `${pct}%`, background: color }
        }
      )
    }
  );
}
function Skeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "h-4 w-full rounded animate-pulse",
      style: { background: "oklch(0.12 0.02 255)" }
    }
  );
}
function SovereignTab({ isLoggedIn }) {
  const { actor } = useActor();
  const reserveQ = useCreatorReserve();
  const miningQ = useMiningState();
  const setCreatorPrincipal = useSetCreatorPrincipal();
  const [locked, setLocked] = reactExports.useState(false);
  const attrQ = useQuery({
    queryKey: ["creatorAttribution"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCreatorAttribution();
      } catch {
        return null;
      }
    },
    enabled: !!actor,
    refetchInterval: 3e4,
    staleTime: 0
  });
  const attr = attrQ.data;
  const reserve = reserveQ.data;
  const mining = miningQ.data;
  const isLocked = locked || (attr == null ? void 0 : attr.locked);
  const tokenLabels = ["SEED", "MTC", "HBT", "OMS", "DRT", "ANT", "MTH"];
  const tokenValues = reserve ? [
    reserve.seed,
    reserve.mtc,
    reserve.hbt,
    reserve.oms,
    reserve.drt,
    reserve.ant,
    reserve.mth
  ] : [];
  const tokenColors = [
    C.green,
    C.cyan,
    "oklch(0.72 0.22 280)",
    "oklch(0.72 0.22 320)",
    C.amber,
    "oklch(0.72 0.22 160)",
    C.gold
  ];
  const tokenMax = tokenValues.length ? Math.max(...tokenValues, 1) : 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "h-full overflow-y-auto p-4 space-y-4",
      style: { background: C.bg },
      children: [
        isLoggedIn && !isLocked && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-3 flex items-center justify-between",
            style: { borderColor: C.amber, background: "oklch(0.12 0.03 80)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[10px] tracking-widest uppercase",
                  style: { color: C.amber },
                  children: "CREATOR GATE NOT LOCKED — LOCK NOW TO PROTECT SOVEREIGNTY"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setCreatorPrincipal.mutate(void 0, {
                    onSuccess: () => setLocked(true)
                  }),
                  className: "font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border",
                  style: {
                    border: `1px solid ${C.gold}`,
                    color: C.gold,
                    background: "oklch(0.82 0.22 80 / 0.1)"
                  },
                  children: setCreatorPrincipal.isPending ? "LOCKING..." : "LOCK CREATOR IDENTITY"
                }
              )
            ]
          }
        ),
        isLocked && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "border rounded p-2 text-center",
            style: { borderColor: C.gold, background: "oklch(0.12 0.04 80)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[10px] tracking-widest uppercase",
                style: { color: C.gold },
                children: "✓ SOVEREIGN LOCK ACTIVE"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-4 space-y-2",
            style: { borderColor: C.border, background: C.panel },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-3",
                  style: { color: C.dim },
                  children: "CREATOR ATTRIBUTION — ATTORNEY GRADE"
                }
              ),
              attr ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: [
                ["NAME", attr.name],
                ["JURISDICTION", attr.jurisdiction],
                ["YEAR", String(attr.year)],
                ["DOCTRINE", attr.doctrineTitle],
                [
                  "DOCTRINE HASH",
                  `0x${attr.doctrineHash.toString(16).toUpperCase()}`
                ],
                [
                  "SOVEREIGN HASH",
                  `0x${attr.sovereignHash.toString(16).toUpperCase()}`
                ],
                [
                  "LOCKED",
                  attr.locked ? `YES — BEAT ${attr.lockedAtBeat}` : "NOT YET LOCKED"
                ]
              ].map(([label, val]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[8px] tracking-widest uppercase",
                    style: { color: C.dim },
                    children: label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[11px]",
                    style: { color: attr.locked ? C.gold : C.text },
                    children: val
                  }
                )
              ] }, label)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {})
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-4 space-y-2",
            style: { borderColor: C.border, background: C.panel },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-2",
                  style: { color: C.dim },
                  children: "MINING STATE"
                }
              ),
              mining ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[8px] tracking-widest",
                      style: { color: C.dim },
                      children: "BEAT"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[13px] font-bold",
                      style: { color: C.cyan },
                      children: Number(mining.beatCount).toLocaleString()
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[8px] tracking-widest",
                      style: { color: C.dim },
                      children: "STREAK"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[13px] font-bold",
                      style: { color: C.green },
                      children: mining.streak
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[8px] tracking-widest",
                      style: { color: C.dim },
                      children: "MULTIPLIER"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "font-mono text-[13px] font-bold",
                      style: { color: C.amber },
                      children: [
                        mining.streakMult.toFixed(2),
                        "×"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[8px] tracking-widest mb-1",
                      style: { color: C.dim },
                      children: "JASMINE'S LAW"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[11px] font-bold",
                      style: { color: mining.jasmineActive ? C.green : C.red },
                      children: mining.jasmineActive ? "✓ ACTIVE — ALL 5 CONDITIONS MET" : "✗ PENDING — ORGANISM BUILDING COHERENCE"
                    }
                  )
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {})
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border rounded p-4 space-y-3",
            style: { borderColor: C.border, background: C.panel },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-2",
                  style: { color: C.dim },
                  children: "TOKEN RESERVES — 100% CREATOR"
                }
              ),
              reserve ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                tokenLabels.map((label, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[9px] tracking-widest uppercase",
                        style: { color: C.dim },
                        children: label
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[10px]",
                        style: { color: tokenColors[i] },
                        children: tokenValues[i].toFixed(6)
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bar,
                    {
                      value: tokenValues[i],
                      max: tokenMax,
                      color: tokenColors[i]
                    }
                  )
                ] }, label)),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 border-t", style: { borderColor: C.border }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[9px] tracking-widest uppercase",
                      style: { color: C.dim },
                      children: "MASTER ACCUMULATOR"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[13px] font-bold",
                      style: { color: C.gold },
                      children: reserve.masterAccum.toFixed(6)
                    }
                  )
                ] }) })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {})
            ]
          }
        )
      ]
    }
  );
}
export {
  SovereignTab as default
};
