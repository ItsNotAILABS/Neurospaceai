import { e as useCanonicalState, G as useFearMissionState, r as reactExports, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
import { m as motion } from "./proxy-BnoGaVMl.js";
const C = {
  bg: "oklch(0.055 0.01 265)",
  panel: "oklch(0.075 0.012 265)",
  border: "oklch(0.18 0.05 250)",
  dim: "oklch(0.38 0.05 220)",
  dimlo: "oklch(0.28 0.04 220)",
  cyan: "oklch(0.72 0.22 195)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.78 0.22 80)",
  red: "oklch(0.72 0.22 25)",
  gold: "oklch(0.82 0.22 80)",
  sovereign: "oklch(0.75 0.20 50)",
  fg: "oklch(0.85 0.05 210)"
};
function PanelTitle({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "font-mono text-[9px] tracking-widest uppercase mb-2 pb-1 border-b",
      style: { color: C.sovereign, borderColor: "oklch(0.18 0.06 50 / 0.5)" },
      children
    }
  );
}
function PanelBox({
  children,
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `rounded-none border p-3 ${className}`,
      style: { background: C.panel, borderColor: C.border },
      children
    }
  );
}
const BASINS = [
  { name: "FAMILY", k: 3e-3, center: 0.75, color: C.green },
  { name: "FAITH", k: 4e-3, center: 0.8, color: C.cyan },
  { name: "SOVEREIGNTY", k: 5e-3, center: 0.85, color: C.gold },
  { name: "MASTERY", k: 2e-3, center: 0.7, color: C.sovereign }
];
function ValuesRadar({ fearM }) {
  const groundedScore = (fearM == null ? void 0 : fearM.groundedScore) ?? 0;
  const missionLocked = (fearM == null ? void 0 : fearM.missionLockActive) ?? false;
  const surrenderFloor = (fearM == null ? void 0 : fearM.surrenderFloor) ?? 0;
  const courage = (fearM == null ? void 0 : fearM.courageScore) ?? 0;
  const basinScores = [
    Math.min(1, groundedScore + 0.1),
    // FAMILY — groundedness
    missionLocked ? Math.min(1, surrenderFloor + 0.3) : surrenderFloor * 0.5,
    // FAITH
    Math.min(1, (fearM == null ? void 0 : fearM.missionPersistence) ?? 0),
    // SOVEREIGNTY
    Math.min(1, courage)
    // MASTERY
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ VALUES ATTRACTOR BASINS — HOOKE'S LAW GEOMETRY" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: BASINS.map((basin, i) => {
      const score = basinScores[i];
      const deviation = Math.abs(score - basin.center);
      const isAligned = deviation < 0.15;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-2 h-2 rounded-full shrink-0",
            style: {
              background: isAligned ? basin.color : C.red,
              boxShadow: isAligned ? `0 0 6px ${basin.color}` : "none"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[8px] w-20 shrink-0",
            style: { color: C.dim },
            children: basin.name
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex-1 h-1.5",
            style: { background: "oklch(0.12 0.01 265)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full transition-all duration-700",
                style: {
                  width: `${score * 100}%`,
                  background: isAligned ? basin.color : C.red
                }
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "font-mono text-[9px] w-12 text-right shrink-0",
            style: { color: isAligned ? basin.color : C.red },
            children: [
              (score * 100).toFixed(1),
              "%"
            ]
          }
        ),
        !isAligned && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[7px]", style: { color: C.red }, children: "DRIFT" })
      ] }, basin.name);
    }) })
  ] });
}
function IdentityTrajectory({ history }) {
  if (history.length < 2) return null;
  const recent = history.slice(0, 30);
  const maxI = Math.max(...recent.map((p) => p.identityI), 1e-4);
  const width = 400;
  const height = 50;
  const idPts = recent.map((p, i) => {
    const x = i / (recent.length - 1) * width;
    const y = height - p.identityI / maxI * height;
    return `${x},${y}`;
  });
  const grPts = recent.map((p, i) => {
    const x = i / (recent.length - 1) * width;
    const y = height - p.groundedScore * height;
    return `${x},${y}`;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ IDENTITY TRAJECTORY — GROUND TRUTH" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        width: "100%",
        viewBox: `0 0 ${width} ${height}`,
        style: { overflow: "visible" },
        "aria-labelledby": "solus-trajectory-title",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("title", { id: "solus-trajectory-title", children: "Identity trajectory over time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "polyline",
            {
              points: idPts.join(" "),
              fill: "none",
              stroke: C.sovereign,
              strokeWidth: "1.5",
              opacity: "0.9"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "polyline",
            {
              points: grPts.join(" "),
              fill: "none",
              stroke: C.green,
              strokeWidth: "1",
              opacity: "0.6",
              strokeDasharray: "3,3"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 mt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-px", style: { background: C.sovereign } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[8px]", style: { color: C.dim }, children: "IDENTITY" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-4 h-px",
            style: { background: C.green, borderTop: `1px dashed ${C.green}` }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[8px]", style: { color: C.dim }, children: "GROUNDED" })
      ] })
    ] })
  ] });
}
function MedinaDoctrinePanel({ fearM }) {
  const missionLocked = (fearM == null ? void 0 : fearM.missionLockActive) ?? false;
  const darkNight = (fearM == null ? void 0 : fearM.darkNightActive) ?? false;
  const surrenderFloor = (fearM == null ? void 0 : fearM.surrenderFloor) ?? 0;
  const streakCounter = Number((fearM == null ? void 0 : fearM.streakCounter) ?? 0);
  const conqueredFear = Number((fearM == null ? void 0 : fearM.conqueredFearCount) ?? 0);
  const doctrineLines = [
    {
      label: "MISSION LOCK",
      value: missionLocked ? "ACTIVE — PERMANENT" : "OPEN",
      ok: missionLocked
    },
    {
      label: "DARK NIGHT PROTOCOL",
      value: darkNight ? "FIRING" : "STANDBY",
      ok: !darkNight
    },
    {
      label: "SURRENDER FLOOR",
      value: surrenderFloor.toFixed(4),
      ok: surrenderFloor > 0
    },
    {
      label: "SOVEREIGNTY STREAK",
      value: streakCounter.toLocaleString(),
      ok: streakCounter > 0
    },
    {
      label: "CONQUERED FEARS",
      value: conqueredFear.toString(),
      ok: conqueredFear > 0
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ MEDINA DOCTRINE ENFORCEMENT LOG" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5", children: doctrineLines.map(({ label, value, ok }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between py-1 border-b",
        style: { borderColor: "oklch(0.12 0.02 265)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-1.5 h-1.5 rounded-full",
                style: { background: ok ? C.green : C.dimlo }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px]", style: { color: C.dim }, children: label })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[10px] font-bold",
              style: { color: ok ? C.sovereign : C.dimlo },
              children: value
            }
          )
        ]
      },
      label
    )) })
  ] });
}
function SolusTab() {
  const { data: canon } = useCanonicalState();
  const { data: fearM } = useFearMissionState();
  const [history, setHistory] = reactExports.useState([]);
  const [alerts, setAlerts] = reactExports.useState([]);
  const alertIdRef = reactExports.useRef(0);
  const lastBeatRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    if (!canon || !fearM) return;
    const beat = Number(canon.b);
    if (beat === lastBeatRef.current) return;
    lastBeatRef.current = beat;
    const point = {
      beat,
      identityI: 0.5,
      // Identity is not directly exposed in canonical; use groundedScore proxy
      groundedScore: fearM.groundedScore ?? 0,
      missionPersistence: fearM.missionPersistence ?? 0,
      timestamp: Date.now()
    };
    setHistory((prev) => [point, ...prev].slice(0, 200));
    BASINS.forEach((basin, i) => {
      const basinScore = i === 0 ? fearM.groundedScore ?? 0 : i === 1 ? fearM.surrenderFloor ?? 0 : i === 2 ? fearM.missionPersistence ?? 0 : fearM.courageScore ?? 0;
      const deviation = Math.abs(basinScore - basin.center);
      if (deviation > 0.25) {
        const alert = {
          id: ++alertIdRef.current,
          beat,
          basin: basin.name,
          deviation,
          text: `Identity drift in ${basin.name} basin: ${(deviation * 100).toFixed(1)}% deviation from attractor center. Hooke's restoring force active. Sovereignty floor protecting minimum.`
        };
        setAlerts((prev) => [alert, ...prev].slice(0, 20));
      }
    });
  }, [canon, fearM]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-y-auto",
      style: { background: C.bg },
      "data-ocid": "solus.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -4 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4 },
            className: "flex items-center justify-between px-4 py-3 border-b",
            style: { background: "oklch(0.065 0.012 50)", borderColor: C.border },
            "data-ocid": "solus.header.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-3 h-3 rounded-full",
                    style: {
                      background: C.sovereign,
                      boxShadow: `0 0 10px ${C.sovereign}`
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-lg font-bold tracking-widest",
                    style: { color: C.sovereign },
                    children: "SOLUS"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[9px] tracking-widest uppercase",
                    style: { color: C.dim },
                    children: "SOVEREIGN IDENTITY ENGINE"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: [
                [
                  "MISSION",
                  (fearM == null ? void 0 : fearM.missionLockActive) ? "LOCKED" : "OPEN",
                  (fearM == null ? void 0 : fearM.missionLockActive) ? C.green : C.amber
                ],
                [
                  "GROUNDED",
                  `${(((fearM == null ? void 0 : fearM.groundedScore) ?? 0) * 100).toFixed(1)}%`,
                  C.sovereign
                ],
                [
                  "ALERTS",
                  String(alerts.length),
                  alerts.length > 0 ? C.red : C.green
                ]
              ].map(([lbl, val, col]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] tracking-widest uppercase",
                    style: { color: C.dim },
                    children: lbl
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-sm font-bold",
                    style: { color: String(col) },
                    children: val
                  }
                )
              ] }, String(lbl))) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "grid grid-cols-1 md:grid-cols-2 gap-3",
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.35, delay: 0.05 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ValuesRadar, { fearM }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(MedinaDoctrinePanel, { fearM })
              ]
            }
          ),
          history.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.35, delay: 0.1 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(IdentityTrajectory, { history })
            }
          ),
          alerts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.35, delay: 0.15 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelBox, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PanelTitle, { children: "▸ IDENTITY DRIFT ALERTS" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex flex-col gap-2 max-h-48 overflow-y-auto",
                    style: { scrollbarWidth: "none" },
                    children: alerts.slice(0, 10).map((alert, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "p-2 border",
                        style: {
                          borderColor: `${C.red}40`,
                          background: "oklch(0.07 0.015 25)"
                        },
                        "data-ocid": `solus.alert.item.${i + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "font-mono text-[8px] font-bold",
                                style: { color: C.red },
                                children: alert.basin
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "span",
                              {
                                className: "font-mono text-[8px]",
                                style: { color: C.dim },
                                children: [
                                  "Beat #",
                                  alert.beat
                                ]
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px]", style: { color: C.fg }, children: alert.text })
                        ]
                      },
                      alert.id
                    ))
                  }
                )
              ] })
            }
          )
        ] })
      ]
    }
  );
}
export {
  SolusTab as default
};
