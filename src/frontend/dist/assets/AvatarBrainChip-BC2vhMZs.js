import { j as jsxRuntimeExports, r as reactExports } from "./index-CGYrnU7d.js";
const PHI = 1.618033988749895;
const HEARTBEAT_MS = 873;
const SYNC_THRESHOLD_MS = 900;
const BRAIN_REGIONS = [
  "Prefrontal Cortex",
  "Hippocampal Temple",
  "Amygdala Vigilans",
  "Anterior Cingulate",
  "Thalamic Relay",
  "Cerebellar Core",
  "Insular Field",
  "Basal Ganglia",
  "Temporal Integrator",
  "Occipital Proj.",
  "Broca Sovereign",
  "Default Mode Net",
  "Salience Network",
  "Enteric Intel.",
  "Reticular Activ.",
  "Corpus Callosum"
];
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (Math.imul(h, 16777619) | 0) >>> 0;
  }
  return h;
}
function seededRand(seed) {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    s = s >>> 0;
    return s / 4294967295;
  };
}
function computeBrainChipState(entityId, tick) {
  const idHash = hashStr(entityId);
  const rand = seededRand((idHash ^ tick * 73244475) >>> 0);
  const activations = [];
  for (let i = 0; i < 16; i++) {
    const freq = PHI ** (i % 8 + 1);
    const phase = hashStr(entityId + i) % 1e3 / 1e3;
    const base = 0.3 + 0.4 * Math.abs(Math.sin(tick * 0.01 * freq + phase * Math.PI * 2));
    const noise = (rand() - 0.5) * 0.15;
    activations.push(Math.max(0.02, Math.min(0.98, base + noise)));
  }
  const mean = activations.reduce((a, b) => a + b, 0) / 16;
  const variance = activations.reduce((a, b) => a + (b - mean) ** 2, 0) / 16;
  const coherenceR = Math.max(0, Math.min(1, 1 - variance * 8));
  let maxIdx = 0;
  for (let i = 1; i < 16; i++) {
    if (activations[i] > activations[maxIdx]) maxIdx = i;
  }
  const dominantRegion = BRAIN_REGIONS[maxIdx];
  const sorted = activations.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v);
  const top3 = sorted.slice(0, 3).map((x) => x.i);
  const behavioralState = deriveBehavioralState(top3, activations);
  return {
    tick,
    activations,
    coherenceR,
    dominantRegion,
    behavioralState,
    syncLocked: true,
    // updated by the hook
    lastUpdateTime: Date.now()
  };
}
function deriveBehavioralState(top3, activations) {
  const hasAmygdala = top3.includes(2);
  const hasPFC = top3.includes(0);
  const hasHippo = top3.includes(1);
  const hasDMN = top3.includes(11);
  const hasSalience = top3.includes(12);
  const hasReticular = top3.includes(14);
  const hasBasal = top3.includes(7);
  const amygdalaHigh = activations[2] > 0.7;
  if (hasAmygdala && amygdalaHigh) return "THREAT-RESPONSE";
  if (hasPFC && hasBasal) return "EXECUTIVE-CTRL";
  if (hasSalience && hasReticular) return "HIGH-ALERT";
  if (hasHippo && hasPFC) return "PLANNING";
  if (hasDMN) return "SELF-MODEL";
  if (hasHippo) return "ENCODING";
  if (hasSalience) return "SCANNING";
  if (hasReticular) return "AROUSED";
  return "BASELINE";
}
function regionColor(idx, activation) {
  const groups = [
    "#3b82f6",
    // 0 PFC — blue
    "#22c55e",
    // 1 Hippocampus — green
    "#ef4444",
    // 2 Amygdala — red
    "#f59e0b",
    // 3 ACC — amber
    "#8b5cf6",
    // 4 Thalamus — purple
    "#06b6d4",
    // 5 Cerebellum — cyan
    "#f97316",
    // 6 Insula — orange
    "#84cc16",
    // 7 Basal Ganglia — lime
    "#a78bfa",
    // 8 Temporal — violet
    "#fbbf24",
    // 9 Occipital — gold
    "#34d399",
    // 10 Broca — teal
    "#60a5fa",
    // 11 DMN — sky
    "#fb923c",
    // 12 Salience — warm orange
    "#4ade80",
    // 13 Enteric — light green
    "#c084fc",
    // 14 Reticular — light purple
    "#f472b6"
    // 15 Corpus Callosum — pink
  ];
  const base = groups[idx] ?? "#64748b";
  return activation > 0.6 ? base : `${base}88`;
}
function useAvatarBrainChip(entityId) {
  const tickRef = reactExports.useRef(0);
  const lastUpdateRef = reactExports.useRef(Date.now());
  const [state, setState] = reactExports.useState(
    () => computeBrainChipState(entityId, 0)
  );
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current++;
      const now = Date.now();
      const elapsed = now - lastUpdateRef.current;
      lastUpdateRef.current = now;
      const next = computeBrainChipState(entityId, tickRef.current);
      next.syncLocked = elapsed <= SYNC_THRESHOLD_MS;
      next.lastUpdateTime = now;
      setState(next);
    }, HEARTBEAT_MS);
    return () => clearInterval(interval);
  }, [entityId]);
  return state;
}
function AvatarBrainChip({ entityId }) {
  const brain = useAvatarBrainChip(entityId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "avatar_brain_chip.panel",
      style: {
        fontFamily: "monospace",
        fontSize: 9,
        color: "#94a3b8",
        userSelect: "none"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
              padding: "5px 8px",
              background: "rgba(234,179,8,0.06)",
              border: "1px solid rgba(234,179,8,0.15)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#64748b", fontSize: 8, letterSpacing: 1 }, children: "COHERENCE R" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      color: brain.coherenceR > 0.7 ? "#22c55e" : brain.coherenceR > 0.4 ? "#f59e0b" : "#ef4444",
                      fontWeight: "bold",
                      fontSize: 12,
                      marginLeft: 6
                    },
                    children: brain.coherenceR.toFixed(3)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "avatar_brain_chip.sync_status",
                  style: { display: "flex", alignItems: "center", gap: 4 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: {
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: brain.syncLocked ? "#22c55e" : "#f59e0b",
                          display: "inline-block",
                          boxShadow: brain.syncLocked ? "0 0 5px #22c55e" : "0 0 5px #f59e0b"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: {
                          color: brain.syncLocked ? "#22c55e" : "#f59e0b",
                          fontSize: 9,
                          letterSpacing: 1,
                          fontWeight: "bold"
                        },
                        children: brain.syncLocked ? "LOCKED" : "DRIFT"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#374151", fontSize: 8, marginLeft: 2 }, children: "873ms" })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
              gap: 6
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    flex: 1,
                    padding: "4px 6px",
                    background: "#0f172a",
                    border: "1px solid #1e293b"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          color: "#475569",
                          fontSize: 7,
                          letterSpacing: 1,
                          marginBottom: 2
                        },
                        children: "DOMINANT REGION"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          color: "#eab308",
                          fontSize: 9,
                          fontWeight: "bold",
                          lineHeight: 1.2
                        },
                        children: brain.dominantRegion
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    flex: 1,
                    padding: "4px 6px",
                    background: "#0f172a",
                    border: "1px solid #1e293b"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          color: "#475569",
                          fontSize: 7,
                          letterSpacing: 1,
                          marginBottom: 2
                        },
                        children: "BEHAVIORAL STATE"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        "data-ocid": "avatar_brain_chip.behavioral_state",
                        style: {
                          color: "#f59e0b",
                          fontSize: 9,
                          fontWeight: "bold",
                          lineHeight: 1.2
                        },
                        children: brain.behavioralState
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 3 }, children: BRAIN_REGIONS.map((region, i) => {
          const activation = brain.activations[i] ?? 0;
          const color = regionColor(i, activation);
          const isDominant = region === brain.dominantRegion;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `avatar_brain_chip.node.${i + 1}`,
              style: {
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: isDominant ? "1px 3px" : "0",
                background: isDominant ? "rgba(234,179,8,0.06)" : "transparent",
                borderLeft: isDominant ? "2px solid #eab30855" : "2px solid transparent"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      color: "#374151",
                      fontSize: 7,
                      minWidth: 12,
                      textAlign: "right"
                    },
                    children: String(i + 1).padStart(2, "0")
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      color: isDominant ? "#eab308" : "#4b5563",
                      fontSize: 8,
                      minWidth: 84,
                      letterSpacing: isDominant ? 0.5 : 0,
                      fontWeight: isDominant ? "bold" : "normal"
                    },
                    children: region
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      flex: 1,
                      height: 5,
                      background: "#0f172a",
                      borderRadius: 1,
                      overflow: "hidden"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          width: `${(activation * 100).toFixed(1)}%`,
                          height: "100%",
                          background: color,
                          borderRadius: 1,
                          transition: "width 0.6s ease",
                          boxShadow: activation > 0.7 ? `0 0 4px ${color}` : "none"
                        }
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    style: { color, fontSize: 8, minWidth: 28, textAlign: "right" },
                    children: [
                      (activation * 100).toFixed(0),
                      "%"
                    ]
                  }
                )
              ]
            },
            region
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              marginTop: 8,
              textAlign: "right",
              color: "#1e293b",
              fontSize: 7,
              letterSpacing: 1
            },
            children: [
              "T",
              brain.tick,
              " · PHI^4 = ",
              (PHI ** 4).toFixed(4)
            ]
          }
        )
      ]
    }
  );
}
export {
  AvatarBrainChip as A
};
