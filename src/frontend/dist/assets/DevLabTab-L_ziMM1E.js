import { a9 as useLiveOrganismPulse, e as useCanonicalState, G as useFearMissionState, aa as useLabState, ab as useCreateSandbox, ac as useRunSandboxStep, ad as useSealExperiment, ae as useExternalLabOutcall, r as reactExports, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
import { C as Canvas, O as OrbitControls, u as useFrame } from "./OrbitControls-CwmRBLxw.js";
import { A as AvatarBrainChip } from "./AvatarBrainChip-BC2vhMZs.js";
import { a as BufferGeometry, F as Float32BufferAttribute, C as Color } from "./three.module-DHVhg58e.js";
const PHI = 1.618033988749895;
const PHI2 = PHI * PHI;
const PHI3 = PHI2 * PHI;
const GOLDEN_ANGLE_RAD = 137.5077 * (Math.PI / 180);
const LAB_REFRESH_MS = Math.round(PHI * 873);
const OMNIS_THRESHOLD = 0.87;
const KURAMOTO_POSITIONS = [];
for (let r = 0; r < 8; r++) {
  for (let n = 0; n < 12; n++) {
    const theta = n * GOLDEN_ANGLE_RAD;
    const phi = r / 7 * Math.PI;
    KURAMOTO_POSITIONS.push([
      Math.cos(theta) * Math.sin(phi) * PHI3,
      Math.cos(phi) * PHI3,
      Math.sin(theta) * Math.sin(phi) * PHI3
    ]);
  }
}
const C3 = {
  cyan: new Color(52462),
  violet: new Color(10040319),
  edge: new Color(1717077),
  edgeOmnis: new Color(6693529)
};
const CSS = {
  bg: "oklch(0.025 0.012 240)",
  panel: "oklch(0.055 0.012 240)",
  panelHeader: "oklch(0.085 0.018 240)",
  border: "oklch(0.14 0.02 240)",
  borderGlow: "oklch(0.25 0.06 240)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.82 0.22 80)",
  violet: "oklch(0.68 0.26 280)",
  red: "oklch(0.65 0.25 25)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.75 0.22 65)",
  dim: "oklch(0.32 0.04 220)",
  text: "oklch(0.82 0.04 215)",
  textDim: "oklch(0.45 0.03 220)",
  nexus: "oklch(0.6 0.22 240)",
  cognus: "oklch(0.58 0.20 260)",
  lexis: "oklch(0.56 0.24 280)",
  aurum: "oklch(0.68 0.24 45)",
  solus: "oklch(0.55 0.22 270)",
  vetus: "oklch(0.52 0.20 250)",
  veritas: "oklch(0.59 0.22 265)",
  upgrade: "oklch(0.61 0.23 275)",
  dirt: "oklch(0.45 0.12 55)",
  softMetal: "oklch(0.65 0.10 220)",
  hardMetal: "oklch(0.35 0.06 230)",
  crystalline: "oklch(0.72 0.28 270)"
};
const TEAM_CONFIG = [
  { name: "NEXUS", glyph: "⬡", color: CSS.nexus },
  { name: "COGNUS", glyph: "⊙", color: CSS.cognus },
  { name: "LEXIS", glyph: "Λ", color: CSS.lexis },
  { name: "AURUM", glyph: "◈", color: CSS.aurum },
  { name: "SOLUS", glyph: "◉", color: CSS.solus },
  { name: "VETUS", glyph: "⊕", color: CSS.vetus },
  { name: "VERITAS", glyph: "△", color: CSS.veritas },
  { name: "UPGRADE_GOV", glyph: "⟁", color: CSS.upgrade }
];
const MATERIAL_CONFIG = {
  Dirt: {
    label: "Dirt",
    color: CSS.dirt,
    icon: "⊟",
    description: "Organic substrate. Tests emergent structure from base matter."
  },
  SoftMetal: {
    label: "Soft Metal",
    color: CSS.softMetal,
    icon: "⊫",
    description: "Malleable conductor. High phi-coupling potential."
  },
  HardMetal: {
    label: "Hard Metal",
    color: CSS.hardMetal,
    icon: "▣",
    description: "Rigid lattice. Tests crystalline emergence under pressure."
  },
  Crystalline: {
    label: "Crystalline",
    color: CSS.crystalline,
    icon: "✦",
    description: "Resonant matrix. Highest Sovereign emergence probability."
  }
};
function emergenceColor(pattern) {
  switch (pattern) {
    case "Sovereign":
      return CSS.violet;
    case "Coherent":
      return CSS.cyan;
    case "Crystallizing":
      return CSS.amber;
    case "Vortex":
      return CSS.gold;
    case "Fractal":
      return CSS.green;
    default:
      return CSS.dim;
  }
}
function KuramotoNode({
  position,
  phase,
  isOmnis,
  index
}) {
  const meshRef = reactExports.useRef(null);
  const lightRef = reactExports.useRef(null);
  const hue = Math.round(240 + phase * 70);
  const baseColor = reactExports.useMemo(
    () => new Color().setHSL((hue - 240) / 360 * 0.3 + 0.58, 0.95, 0.5),
    [hue]
  );
  const omColor = C3.violet;
  const color = isOmnis ? omColor : baseColor;
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const offset = index * GOLDEN_ANGLE_RAD % (2 * Math.PI);
    const pulse = 0.85 + 0.15 * Math.sin(t * 2 * Math.PI / 0.873 + offset);
    meshRef.current.scale.setScalar(pulse);
    if (lightRef.current) {
      lightRef.current.intensity = isOmnis ? pulse * 2 : pulse * 0.6;
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("group", { position, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { ref: meshRef, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("sphereGeometry", { args: [0.075, 8, 8] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "meshStandardMaterial",
        {
          color,
          emissive: color,
          emissiveIntensity: isOmnis ? 2.5 : 1.2,
          roughness: 0.1,
          metalness: 0.8
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "pointLight",
      {
        ref: lightRef,
        color,
        intensity: 0.6,
        distance: 1.2,
        decay: 2
      }
    )
  ] });
}
function BrainEdgeLines({ omnis }) {
  const edgeColor = omnis ? C3.edgeOmnis : C3.edge;
  const linesRef = reactExports.useRef(null);
  const geometry = reactExports.useMemo(() => {
    const positions = [];
    for (let r = 0; r < 8; r++) {
      for (let n = 0; n < 12; n++) {
        const i = r * 12 + n;
        const j = r * 12 + (n + 1) % 12;
        positions.push(...KURAMOTO_POSITIONS[i], ...KURAMOTO_POSITIONS[j]);
      }
    }
    for (let r = 0; r < 7; r++) {
      for (let n = 0; n < 12; n += 3) {
        const i = r * 12 + n;
        const j = (r + 1) * 12 + n;
        positions.push(...KURAMOTO_POSITIONS[i], ...KURAMOTO_POSITIONS[j]);
      }
    }
    const geo = new BufferGeometry();
    geo.setAttribute(
      "position",
      new Float32BufferAttribute(positions, 3)
    );
    return geo;
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("lineSegments", { ref: linesRef, geometry, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "lineBasicMaterial",
    {
      color: edgeColor,
      opacity: omnis ? 0.55 : 0.2,
      transparent: true
    }
  ) });
}
function KuramotoBrain({
  phases,
  kuramotoR
}) {
  const isOmnis = kuramotoR >= OMNIS_THRESHOLD;
  const groupRef = reactExports.useRef(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });
  const nodeKeys = reactExports.useMemo(
    () => KURAMOTO_POSITIONS.map((p) => `n${p[0].toFixed(3)}_${p[1].toFixed(3)}`),
    []
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("group", { ref: groupRef, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(BrainEdgeLines, { omnis: isOmnis }),
    KURAMOTO_POSITIONS.map((pos, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      KuramotoNode,
      {
        index: i,
        position: pos,
        phase: phases[i] ?? 0.5,
        isOmnis
      },
      nodeKeys[i]
    ))
  ] });
}
function BrainScene({
  phases,
  kuramotoR
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("ambientLight", { intensity: 0.08 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("pointLight", { position: [6, 6, 6], intensity: 0.5, color: 39372 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("pointLight", { position: [-6, -4, -6], intensity: 0.3, color: 3342438 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(KuramotoBrain, { phases, kuramotoR }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      OrbitControls,
      {
        enablePan: false,
        enableZoom: true,
        minDistance: 5,
        maxDistance: 18,
        autoRotate: false,
        target: [0, 0, 0]
      }
    )
  ] });
}
function ParticleFieldPreview({
  positions,
  material,
  emergence
}) {
  var _a;
  const canvasRef = reactExports.useRef(null);
  const matColor = ((_a = MATERIAL_CONFIG[material]) == null ? void 0 : _a.color) ?? CSS.cyan;
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 80, 50);
    ctx.fillStyle = CSS.bg;
    ctx.fillRect(0, 0, 80, 50);
    const pts = positions.slice(0, 80);
    for (const p of pts) {
      const px = (p.x + 5) / 10 * 80;
      const py = (p.z + 5) / 10 * 50;
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, 2 * Math.PI);
      ctx.fillStyle = matColor;
      ctx.globalAlpha = 0.8;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (emergence === "Coherent" || emergence === "Sovereign") {
      const grad = ctx.createRadialGradient(40, 25, 0, 40, 25, 35);
      grad.addColorStop(0, "rgba(153, 51, 255, 0.18)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 80, 50);
    }
  }, [positions, matColor, emergence]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      width: 80,
      height: 50,
      style: { display: "block" }
    }
  );
}
function AvatarCard({
  agent,
  teamConfig,
  pulsePhase
}) {
  const coherence = (agent == null ? void 0 : agent.coherenceLevel) ?? 0;
  const actionState = (agent == null ? void 0 : agent.actionState) ?? "Observing";
  const emotionValence = (agent == null ? void 0 : agent.emotionValence) ?? 0;
  const valenceColor = emotionValence > 0.5 ? CSS.cyan : emotionValence < -0.3 ? CSS.amber : CSS.dim;
  const coherencePct = Math.round(coherence * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `lab.avatar.${teamConfig.name.toLowerCase()}.card`,
      style: {
        background: CSS.panel,
        border: `1px solid ${CSS.border}`,
        borderLeft: `2px solid ${teamConfig.color}`,
        padding: "6px 8px",
        marginBottom: "4px",
        opacity: 0.7 + 0.3 * pulsePhase,
        transition: "opacity 0.3s",
        position: "relative",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to right, ${teamConfig.color}0a, transparent)`,
              pointerEvents: "none"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "6px",
              position: "relative"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    color: teamConfig.color,
                    fontSize: "13px",
                    lineHeight: 1,
                    minWidth: "14px"
                  },
                  children: teamConfig.glyph
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          style: {
                            color: CSS.text,
                            fontFamily: "JetBrains Mono",
                            fontSize: "9px",
                            letterSpacing: "0.12em",
                            fontWeight: 600
                          },
                          children: teamConfig.name
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          style: {
                            color: valenceColor,
                            fontFamily: "JetBrains Mono",
                            fontSize: "8px",
                            letterSpacing: "0.08em"
                          },
                          children: actionState.toUpperCase()
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      marginTop: "3px",
                      background: "oklch(0.1 0.01 220)",
                      height: "2px",
                      borderRadius: "1px"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          width: `${coherencePct}%`,
                          height: "100%",
                          background: `linear-gradient(to right, ${teamConfig.color}, ${teamConfig.color}aa)`,
                          boxShadow: `0 0 4px ${teamConfig.color}80`,
                          transition: "width 0.6s ease",
                          borderRadius: "1px"
                        }
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "2px"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          style: {
                            color: CSS.textDim,
                            fontFamily: "JetBrains Mono",
                            fontSize: "7px",
                            letterSpacing: "0.1em"
                          },
                          children: "COH"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          style: {
                            color: teamConfig.color,
                            fontFamily: "JetBrains Mono",
                            fontSize: "7px",
                            fontWeight: 700
                          },
                          children: coherence.toFixed(3)
                        }
                      )
                    ]
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
function SandboxCard({
  sandbox,
  onSeal,
  isSealing
}) {
  const mat = String(sandbox.material);
  const pat = String(sandbox.pattern);
  const matConfig = MATERIAL_CONFIG[mat] ?? {
    label: mat,
    color: CSS.cyan,
    icon: "○"
  };
  const patColor = emergenceColor(pat);
  const canSeal = (pat === "Coherent" || pat === "Sovereign") && !sandbox.sealed;
  const emergencePct = Math.round(sandbox.emergenceScore * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `lab.sandbox.${Number(sandbox.id)}.card`,
      style: {
        background: CSS.panel,
        border: `1px solid ${CSS.border}`,
        borderTop: `2px solid ${matConfig.color}`,
        padding: "8px",
        flex: "0 0 auto",
        width: "200px",
        ...canSeal ? { boxShadow: `0 0 12px ${patColor}30` } : {}
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "6px"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "5px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: matConfig.color, fontSize: "11px" }, children: matConfig.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      color: CSS.text,
                      fontFamily: "JetBrains Mono",
                      fontSize: "9px",
                      letterSpacing: "0.1em",
                      fontWeight: 600
                    },
                    children: matConfig.label.toUpperCase()
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  style: {
                    color: CSS.textDim,
                    fontFamily: "JetBrains Mono",
                    fontSize: "7px"
                  },
                  children: [
                    "#",
                    String(sandbox.id)
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              marginBottom: "6px",
              border: `1px solid ${CSS.border}`,
              overflow: "hidden"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              ParticleFieldPreview,
              {
                positions: sandbox.particlePositions,
                material: mat,
                emergence: pat
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "4px"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "28", height: "28", viewBox: "0 0 28 28", "aria-hidden": "true", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: "14",
                    cy: "14",
                    r: "11",
                    fill: "none",
                    stroke: "oklch(0.1 0.01 220)",
                    strokeWidth: "2.5"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: "14",
                    cy: "14",
                    r: "11",
                    fill: "none",
                    stroke: patColor,
                    strokeWidth: "2.5",
                    strokeDasharray: `${emergencePct * 0.69} 69`,
                    strokeDashoffset: "17",
                    strokeLinecap: "round",
                    style: { filter: `drop-shadow(0 0 3px ${patColor})` }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      color: patColor,
                      fontFamily: "JetBrains Mono",
                      fontSize: "8px",
                      letterSpacing: "0.1em",
                      fontWeight: 700
                    },
                    children: pat.toUpperCase()
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      color: CSS.textDim,
                      fontFamily: "JetBrains Mono",
                      fontSize: "7px"
                    },
                    children: [
                      "CYCLE ",
                      String(sandbox.cycleCount)
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginLeft: "auto", textAlign: "right" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      color: CSS.text,
                      fontFamily: "JetBrains Mono",
                      fontSize: "10px",
                      fontWeight: 700
                    },
                    children: [
                      emergencePct,
                      "%"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      color: CSS.textDim,
                      fontFamily: "JetBrains Mono",
                      fontSize: "7px"
                    },
                    children: "EMG"
                  }
                )
              ] })
            ]
          }
        ),
        canSeal && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": `lab.sandbox.${Number(sandbox.id)}.seal_button`,
            onClick: () => onSeal(sandbox.id),
            disabled: isSealing,
            style: {
              width: "100%",
              padding: "4px",
              background: `${patColor}18`,
              border: `1px solid ${patColor}`,
              color: patColor,
              fontFamily: "JetBrains Mono",
              fontSize: "8px",
              letterSpacing: "0.18em",
              cursor: isSealing ? "wait" : "pointer",
              transition: "all 0.2s",
              marginTop: "2px"
            },
            children: isSealing ? "SEALING…" : "◈ SEAL"
          }
        ),
        sandbox.sealed && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              color: CSS.gold,
              fontFamily: "JetBrains Mono",
              fontSize: "8px",
              letterSpacing: "0.15em",
              textAlign: "center",
              marginTop: "2px"
            },
            children: "◆ SEALED"
          }
        )
      ]
    }
  );
}
function SpawnForm({
  onSpawn,
  onClose
}) {
  const [material, setMaterial] = reactExports.useState("Dirt");
  const [temperatureAnalog, setTemperatureAnalog] = reactExports.useState(37);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "lab.spawn_form",
      style: {
        background: CSS.panel,
        border: `1px solid ${CSS.borderGlow}`,
        padding: "14px",
        boxShadow: `0 0 24px ${CSS.cyan}18`,
        minWidth: "240px",
        flex: "0 0 auto"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    color: CSS.cyan,
                    fontFamily: "JetBrains Mono",
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    fontWeight: 700
                  },
                  children: "SPAWN EXPERIMENT"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "lab.spawn_form.close_button",
                  onClick: onClose,
                  style: {
                    background: "none",
                    border: "none",
                    color: CSS.textDim,
                    cursor: "pointer",
                    fontSize: "11px"
                  },
                  children: "✕"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "10px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                color: CSS.textDim,
                fontFamily: "JetBrains Mono",
                fontSize: "8px",
                letterSpacing: "0.1em",
                marginBottom: "5px"
              },
              children: "MATERIAL TYPE"
            }
          ),
          Object.entries(MATERIAL_CONFIG).map(([key, cfg]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": `lab.spawn_form.material.${key.toLowerCase()}`,
              onClick: () => setMaterial(key),
              style: {
                display: "flex",
                alignItems: "center",
                gap: "7px",
                width: "100%",
                padding: "5px 7px",
                marginBottom: "3px",
                background: material === key ? `${cfg.color}18` : "transparent",
                border: `1px solid ${material === key ? cfg.color : CSS.border}`,
                color: material === key ? cfg.color : CSS.textDim,
                fontFamily: "JetBrains Mono",
                fontSize: "8px",
                cursor: "pointer",
                transition: "all 0.2s"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "11px" }, children: cfg.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "left" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        fontWeight: 700,
                        marginBottom: "1px",
                        letterSpacing: "0.08em"
                      },
                      children: cfg.label.toUpperCase()
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: CSS.dim, fontSize: "7px" }, children: cfg.description })
                ] })
              ]
            },
            key
          ))
        ] }),
        [
          {
            label: "TEMPERATURE",
            val: temperatureAnalog,
            min: 0,
            max: 100,
            step: 1,
            set: setTemperatureAnalog,
            unit: "°"
          }
        ].map(({ label, val, min, max, step, set, unit }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "8px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "2px"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      color: CSS.textDim,
                      fontFamily: "JetBrains Mono",
                      fontSize: "8px",
                      letterSpacing: "0.1em"
                    },
                    children: label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    style: {
                      color: CSS.gold,
                      fontFamily: "JetBrains Mono",
                      fontSize: "9px",
                      fontWeight: 700
                    },
                    children: [
                      val.toFixed(3),
                      unit
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "range",
              min,
              max,
              step,
              value: val,
              onChange: (e) => set(Number(e.target.value)),
              style: { width: "100%", accentColor: CSS.gold, height: "3px" }
            }
          )
        ] }, label)),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "lab.spawn_form.run_button",
            onClick: () => onSpawn(material, temperatureAnalog),
            style: {
              width: "100%",
              padding: "7px",
              background: `${CSS.gold}18`,
              border: `1px solid ${CSS.gold}`,
              color: CSS.gold,
              fontFamily: "JetBrains Mono",
              fontSize: "9px",
              letterSpacing: "0.2em",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s"
            },
            children: "◈ RUN EXPERIMENT"
          }
        )
      ]
    }
  );
}
function EmergenceBanner({
  sandbox,
  onDismiss
}) {
  var _a;
  const pat = String(sandbox.pattern);
  const mat = String(sandbox.material);
  const patColor = emergenceColor(pat);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-ocid": "lab.emergence_banner",
      className: "lab-emergence",
      style: {
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse at 50% 40%, ${patColor}15 0%, transparent 70%)`,
        border: `1px solid ${patColor}60`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: "32px", maxWidth: "420px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              color: patColor,
              fontFamily: "JetBrains Mono",
              fontSize: "28px",
              fontWeight: 900,
              letterSpacing: "0.3em",
              textShadow: `0 0 24px ${patColor}`,
              marginBottom: "12px"
            },
            children: [
              "◆ ",
              pat.toUpperCase()
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              color: CSS.text,
              fontFamily: "JetBrains Mono",
              fontSize: "11px",
              letterSpacing: "0.15em",
              marginBottom: "6px"
            },
            children: "EMERGENCE EVENT DETECTED"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              color: CSS.textDim,
              fontFamily: "JetBrains Mono",
              fontSize: "9px",
              marginBottom: "20px"
            },
            children: [
              ((_a = MATERIAL_CONFIG[mat]) == null ? void 0 : _a.label) ?? mat,
              " · Score:",
              " ",
              (sandbox.emergenceScore * 100).toFixed(1),
              "% · Cycle",
              " ",
              String(sandbox.cycleCount)
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "lab.emergence_banner.close_button",
            onClick: onDismiss,
            style: {
              padding: "8px 20px",
              background: `${patColor}18`,
              border: `1px solid ${patColor}`,
              color: patColor,
              fontFamily: "JetBrains Mono",
              fontSize: "9px",
              letterSpacing: "0.18em",
              cursor: "pointer"
            },
            children: "ACKNOWLEDGE"
          }
        )
      ] })
    }
  );
}
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
  }
  return Math.abs(hash);
}
function DevLabTab() {
  const pulse = useLiveOrganismPulse();
  const { data: canon } = useCanonicalState();
  const { data: fearState } = useFearMissionState();
  const { data: labState, refetch: refetchLab } = useLabState();
  const typedActiveExperiments = labState == null ? void 0 : labState.activeExperiments;
  const createSandbox = useCreateSandbox();
  const runSandboxStep = useRunSandboxStep();
  const sealExperiment = useSealExperiment();
  const externalLabOutcall = useExternalLabOutcall();
  const kuramotoR = (fearState == null ? void 0 : fearState.kuramotoR) ?? 0;
  const isOmnis = kuramotoR >= OMNIS_THRESHOLD;
  const phases = reactExports.useMemo(() => {
    const base = (canon == null ? void 0 : canon.coh) ?? 0.5;
    return KURAMOTO_POSITIONS.map(
      (_, i) => (base + i * GOLDEN_ANGLE_RAD / (2 * Math.PI)) % 1
    );
  }, [canon == null ? void 0 : canon.coh]);
  const [pulsePhase, setPulsePhase] = reactExports.useState(1);
  reactExports.useEffect(() => {
    const id = setInterval(
      () => setPulsePhase((p) => {
        const n = p - 0.05;
        return n < 0.7 ? 1 : n;
      }),
      50
    );
    return () => clearInterval(id);
  }, []);
  const [showSpawn, setShowSpawn] = reactExports.useState(false);
  const [labMode, setLabMode] = reactExports.useState("observe");
  const [selectedAvatar, setSelectedAvatar] = reactExports.useState(null);
  const [experimentResult, setExperimentResult] = reactExports.useState(null);
  const [selectedCompound, setSelectedCompound] = reactExports.useState("");
  const [targetAvatar, setTargetAvatar] = reactExports.useState("");
  const [chamberLoading, setChamberLoading] = reactExports.useState(false);
  const [externalUrl, setExternalUrl] = reactExports.useState("");
  const [externalStatus, setExternalStatus] = reactExports.useState("idle");
  const [emergenceSandbox, setEmergenceSandbox] = reactExports.useState(
    null
  );
  const [sealingId, setSealingId] = reactExports.useState(null);
  const [runningId, setRunningId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const id = setInterval(() => void refetchLab(), LAB_REFRESH_MS);
    return () => clearInterval(id);
  }, [refetchLab]);
  reactExports.useEffect(() => {
    if (!(labState == null ? void 0 : labState.sandboxes)) return;
    for (const sb of labState.sandboxes) {
      const pat = String(sb.pattern);
      if ((pat === "Coherent" || pat === "Sovereign") && !sb.sealed && sb.emergenceScore > 0.7) {
        setEmergenceSandbox(sb);
        return;
      }
    }
  }, [labState == null ? void 0 : labState.sandboxes]);
  const handleSpawn = reactExports.useCallback(
    async (materialKey, _ta) => {
      setShowSpawn(false);
      setLabMode("run");
      try {
        const result = await createSandbox.mutateAsync(
          materialKey
        );
        if ((result == null ? void 0 : result.sandboxId) != null) {
          const sbId = result.sandboxId;
          setRunningId(sbId);
          let count = 0;
          const poll = setInterval(async () => {
            count++;
            try {
              await runSandboxStep.mutateAsync(sbId);
              void refetchLab();
            } catch {
            }
            if (count >= 20) {
              clearInterval(poll);
              setRunningId(null);
              setLabMode("observe");
            }
          }, LAB_REFRESH_MS);
        }
      } catch {
      }
    },
    [createSandbox, runSandboxStep, refetchLab]
  );
  const handleSeal = reactExports.useCallback(
    async (id) => {
      setSealingId(id);
      try {
        await sealExperiment.mutateAsync(id);
        void refetchLab();
      } finally {
        setSealingId(null);
      }
    },
    [sealExperiment, refetchLab]
  );
  const handleTestExternal = reactExports.useCallback(async () => {
    if (!externalUrl) return;
    setExternalStatus("testing");
    try {
      const packet = JSON.stringify({
        coherence: kuramotoR,
        beat: pulse.beat,
        mode: pulse.modeName
      });
      const result = await externalLabOutcall.mutateAsync({
        labUrl: externalUrl,
        statePacket: packet
      });
      setExternalStatus((result == null ? void 0 : result.ok) ? "ok" : "fail");
    } catch {
      setExternalStatus("fail");
    }
  }, [externalUrl, kuramotoR, pulse.beat, pulse.modeName, externalLabOutcall]);
  const typedLabState = labState;
  const avatars = (typedLabState == null ? void 0 : typedLabState.avatars) ?? [];
  const sandboxes = (typedLabState == null ? void 0 : typedLabState.sandboxes) ?? [];
  const labCoherence = (typedLabState == null ? void 0 : typedLabState.labCoherence) ?? kuramotoR;
  const modeButtons = [
    { id: "spawn", label: "SPAWN" },
    { id: "configure", label: "CONFIGURE" },
    { id: "run", label: "RUN" },
    { id: "observe", label: "OBSERVE" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "lab.page",
      style: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: CSS.bg,
        position: "relative",
        overflow: "hidden"
      },
      children: [
        emergenceSandbox && /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmergenceBanner,
          {
            sandbox: emergenceSandbox,
            onDismiss: () => setEmergenceSandbox(null)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: { display: "flex", flex: 1, overflow: "hidden", minHeight: 0 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "lab.avatar_panel",
                  style: {
                    width: "38.2%",
                    display: "flex",
                    flexDirection: "column",
                    borderRight: `1px solid ${CSS.border}`,
                    overflow: "hidden"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          padding: "8px 10px",
                          borderBottom: `1px solid ${CSS.border}`,
                          background: CSS.panelHeader,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              style: {
                                color: CSS.cyan,
                                fontFamily: "JetBrains Mono",
                                fontSize: "8px",
                                letterSpacing: "0.2em",
                                fontWeight: 700
                              },
                              children: "AGENT FIELD"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "5px" }, children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  color: CSS.textDim,
                                  fontFamily: "JetBrains Mono",
                                  fontSize: "7px"
                                },
                                children: "COH"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  color: labCoherence > 0.7 ? CSS.green : labCoherence > 0.4 ? CSS.amber : CSS.red,
                                  fontFamily: "JetBrains Mono",
                                  fontSize: "9px",
                                  fontWeight: 700
                                },
                                children: labCoherence.toFixed(3)
                              }
                            )
                          ] })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          flex: 1,
                          overflowY: "auto",
                          padding: "8px",
                          scrollbarWidth: "none"
                        },
                        children: [
                          TEAM_CONFIG.map((tc) => {
                            const agent = avatars.find((a) => a.teamName === tc.name) ?? null;
                            return /* @__PURE__ */ jsxRuntimeExports.jsx(
                              AvatarCard,
                              {
                                agent,
                                teamConfig: tc,
                                pulsePhase
                              },
                              tc.name
                            );
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              style: {
                                marginTop: "8px",
                                padding: "8px",
                                background: CSS.panelHeader,
                                border: `1px solid ${CSS.border}`
                              },
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "div",
                                  {
                                    style: {
                                      color: CSS.textDim,
                                      fontFamily: "JetBrains Mono",
                                      fontSize: "7px",
                                      letterSpacing: "0.15em",
                                      marginBottom: "8px"
                                    },
                                    children: "LAB VITALS"
                                  }
                                ),
                                [
                                  ["NODES", "96", CSS.cyan],
                                  ["RINGS", "8", CSS.cyan],
                                  ["φ-RADIUS", PHI3.toFixed(4), CSS.gold],
                                  ["HEARTBEAT", "873ms", CSS.gold],
                                  [
                                    "KURAMOTO-R",
                                    kuramotoR.toFixed(4),
                                    isOmnis ? CSS.violet : CSS.text
                                  ],
                                  [
                                    "OMNIS GATE",
                                    isOmnis ? "FIRING" : "DORMANT",
                                    isOmnis ? CSS.violet : CSS.dim
                                  ],
                                  [
                                    "EXPERIMENTS",
                                    String(typedActiveExperiments ?? 0),
                                    CSS.cyan
                                  ],
                                  ["MODE", pulse.modeName, CSS.gold]
                                ].map(([label, value, color]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                  "div",
                                  {
                                    style: {
                                      display: "flex",
                                      justifyContent: "space-between",
                                      marginBottom: "4px"
                                    },
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                        "span",
                                        {
                                          style: {
                                            color: CSS.textDim,
                                            fontFamily: "JetBrains Mono",
                                            fontSize: "7px",
                                            letterSpacing: "0.1em"
                                          },
                                          children: label
                                        }
                                      ),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                        "span",
                                        {
                                          style: {
                                            color,
                                            fontFamily: "JetBrains Mono",
                                            fontSize: "8px",
                                            fontWeight: 700
                                          },
                                          children: value
                                        }
                                      )
                                    ]
                                  },
                                  label
                                ))
                              ]
                            }
                          )
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
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    overflow: "hidden"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        "data-ocid": "lab.brain_chamber",
                        style: {
                          flex: 1,
                          position: "relative",
                          minHeight: 0,
                          background: "radial-gradient(ellipse at 50% 50%, oklch(0.04 0.02 240) 0%, oklch(0.015 0.005 240) 100%)"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              style: {
                                position: "absolute",
                                top: "10px",
                                left: "12px",
                                zIndex: 10,
                                pointerEvents: "none"
                              },
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "div",
                                  {
                                    style: {
                                      color: CSS.textDim,
                                      fontFamily: "JetBrains Mono",
                                      fontSize: "7px",
                                      letterSpacing: "0.18em"
                                    },
                                    children: "PHI-PROPORT BRAIN CHAMBER"
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "div",
                                  {
                                    style: {
                                      color: CSS.text,
                                      fontFamily: "JetBrains Mono",
                                      fontSize: "11px",
                                      fontWeight: 700,
                                      marginTop: "2px"
                                    },
                                    children: "96 nodes"
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "div",
                                  {
                                    style: {
                                      color: CSS.cyan,
                                      fontFamily: "JetBrains Mono",
                                      fontSize: "9px"
                                    },
                                    children: "8 rings"
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "div",
                                  {
                                    style: {
                                      color: CSS.violet,
                                      fontFamily: "JetBrains Mono",
                                      fontSize: "9px"
                                    },
                                    children: "12 phase"
                                  }
                                )
                              ]
                            }
                          ),
                          isOmnis && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                position: "absolute",
                                top: "10px",
                                right: "12px",
                                zIndex: 10,
                                color: CSS.violet,
                                fontFamily: "JetBrains Mono",
                                fontSize: "10px",
                                letterSpacing: "0.25em",
                                fontWeight: 900,
                                textShadow: `0 0 16px ${CSS.violet}`,
                                animation: "lab-pulse 873ms ease-in-out infinite"
                              },
                              children: "◆ OMNIS"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              style: {
                                position: "absolute",
                                bottom: "12px",
                                left: "12px",
                                zIndex: 10,
                                pointerEvents: "none"
                              },
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "div",
                                  {
                                    style: {
                                      color: CSS.text,
                                      fontFamily: "JetBrains Mono",
                                      fontSize: "12px",
                                      fontWeight: 700
                                    },
                                    children: "96 Node"
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "div",
                                  {
                                    style: {
                                      color: CSS.dim,
                                      fontFamily: "JetBrains Mono",
                                      fontSize: "9px"
                                    },
                                    children: "Kuramoto Brain"
                                  }
                                )
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Canvas,
                            {
                              style: { width: "100%", height: "100%" },
                              camera: { position: [0, 0, 12], fov: 50 },
                              gl: { antialias: true, alpha: true },
                              dpr: [1, 1.5],
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: null, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrainScene, { phases, kuramotoR }) })
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        "data-ocid": "lab.sandbox_row",
                        style: {
                          height: "168px",
                          flexShrink: 0,
                          borderTop: `1px solid ${CSS.border}`,
                          background: CSS.panelHeader,
                          display: "flex",
                          flexDirection: "column"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              style: {
                                padding: "5px 10px",
                                borderBottom: `1px solid ${CSS.border}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexShrink: 0
                              },
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "span",
                                  {
                                    style: {
                                      color: CSS.gold,
                                      fontFamily: "JetBrains Mono",
                                      fontSize: "7px",
                                      letterSpacing: "0.2em",
                                      fontWeight: 700
                                    },
                                    children: "MATERIAL SANDBOX"
                                  }
                                ),
                                runningId != null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                  "span",
                                  {
                                    style: {
                                      color: CSS.amber,
                                      fontFamily: "JetBrains Mono",
                                      fontSize: "7px",
                                      animation: "lab-pulse 873ms ease-in-out infinite"
                                    },
                                    children: [
                                      "◉ RUNNING #",
                                      String(runningId)
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
                                gap: "8px",
                                padding: "8px",
                                overflowX: "auto",
                                flex: 1,
                                scrollbarWidth: "none"
                              },
                              children: [
                                sandboxes.map((sb) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  SandboxCard,
                                  {
                                    sandbox: sb,
                                    onSeal: handleSeal,
                                    isSealing: sealingId === sb.id
                                  },
                                  String(sb.id)
                                )),
                                !showSpawn && /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "button",
                                  {
                                    type: "button",
                                    "data-ocid": "lab.spawn_button",
                                    onClick: () => {
                                      setShowSpawn(true);
                                      setLabMode("spawn");
                                    },
                                    style: {
                                      flex: "0 0 auto",
                                      width: "80px",
                                      height: "100%",
                                      background: "transparent",
                                      border: `1px dashed ${CSS.border}`,
                                      color: CSS.dim,
                                      fontFamily: "JetBrains Mono",
                                      fontSize: "20px",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      transition: "border-color 0.2s, color 0.2s"
                                    },
                                    onMouseEnter: (e) => {
                                      e.currentTarget.style.borderColor = CSS.cyan;
                                      e.currentTarget.style.color = CSS.cyan;
                                    },
                                    onMouseLeave: (e) => {
                                      e.currentTarget.style.borderColor = CSS.border;
                                      e.currentTarget.style.color = CSS.dim;
                                    },
                                    children: "+"
                                  }
                                ),
                                showSpawn && /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  SpawnForm,
                                  {
                                    onSpawn: handleSpawn,
                                    onClose: () => {
                                      setShowSpawn(false);
                                      setLabMode("observe");
                                    }
                                  }
                                )
                              ]
                            }
                          )
                        ]
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "chamber.section",
            style: {
              flexShrink: 0,
              background: "#080818",
              borderTop: "1px solid rgba(99,102,241,0.45)",
              boxShadow: "0 -2px 24px rgba(99,102,241,0.12)",
              overflowY: "auto",
              maxHeight: "520px",
              scrollbarWidth: "none"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    padding: "16px 20px 10px",
                    borderBottom: "1px solid rgba(99,102,241,0.22)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          color: "oklch(0.72 0.28 270)",
                          fontFamily: "JetBrains Mono",
                          fontSize: "13px",
                          fontWeight: 900,
                          letterSpacing: "0.3em",
                          textShadow: "0 0 16px oklch(0.72 0.28 270)"
                        },
                        children: "VIRTUAL EXPERIMENT CHAMBER"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          color: "oklch(0.42 0.08 270)",
                          fontFamily: "JetBrains Mono",
                          fontSize: "8px",
                          letterSpacing: "0.22em",
                          marginTop: "3px"
                        },
                        children: "SOVEREIGN AI SUBJECTS — BRAIN-COUPLED EXPERIMENTAL TARGETS"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  "data-ocid": "chamber.avatar_grid",
                  style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "10px",
                    padding: "14px 20px"
                  },
                  children: [
                    {
                      id: "nexus",
                      name: "NEXUS",
                      role: "THE COORDINATOR",
                      desc: "Calm analytical bridge. Routes signals across governance teams. Maintains system coherence.",
                      accent: "oklch(0.72 0.22 195)",
                      accentRgb: "0,204,238"
                    },
                    {
                      id: "cognus",
                      name: "COGNUS",
                      role: "THE THINKER",
                      desc: "Deep introspective processor. Runs ADRE 5-pass cognition loop. Self-writes doctrine.",
                      accent: "oklch(0.68 0.26 280)",
                      accentRgb: "153,51,255"
                    },
                    {
                      id: "veritas",
                      name: "VERITAS",
                      role: "THE SCANNER",
                      desc: "Sharp vigilant watchdog. Runs coherence scans every PHI⁴ beats. Flags anomalies.",
                      accent: "oklch(0.75 0.22 65)",
                      accentRgb: "245,158,11"
                    },
                    {
                      id: "esuriens",
                      name: "ESURIENS",
                      role: "THE HUNGRY",
                      desc: "Driven restless engine. Maintains TASK_HORIZON. Never fully satisfied.",
                      accent: "oklch(0.65 0.25 35)",
                      accentRgb: "249,115,22"
                    }
                  ].map((av) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      "data-ocid": `chamber.avatar.${av.id}.card`,
                      style: {
                        background: "oklch(0.04 0.015 240)",
                        border: `1px solid rgba(${av.accentRgb},0.18)`,
                        borderLeft: `3px solid ${av.accent}`,
                        padding: "12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        boxShadow: selectedAvatar === av.name ? `0 0 16px rgba(${av.accentRgb},0.25)` : "none",
                        transition: "box-shadow 0.25s"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                color: av.accent,
                                fontFamily: "JetBrains Mono",
                                fontSize: "12px",
                                fontWeight: 900,
                                letterSpacing: "0.2em",
                                textShadow: `0 0 10px rgba(${av.accentRgb},0.6)`
                              },
                              children: av.name
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                color: `rgba(${av.accentRgb},0.55)`,
                                fontFamily: "JetBrains Mono",
                                fontSize: "7px",
                                letterSpacing: "0.18em",
                                fontStyle: "italic",
                                marginTop: "1px"
                              },
                              children: av.role
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              background: "oklch(0.03 0.01 240)",
                              border: "1px solid oklch(0.1 0.015 240)",
                              padding: "8px"
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarBrainChip, { entityId: av.id })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              color: "oklch(0.42 0.05 220)",
                              fontFamily: "JetBrains Mono",
                              fontSize: "8px",
                              lineHeight: 1.6,
                              letterSpacing: "0.06em"
                            },
                            children: av.desc
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            "data-ocid": `chamber.avatar.${av.id}.inspect_button`,
                            onClick: () => setSelectedAvatar(
                              (prev) => prev === av.name ? null : av.name
                            ),
                            style: {
                              padding: "6px 10px",
                              background: selectedAvatar === av.name ? `rgba(${av.accentRgb},0.18)` : "transparent",
                              border: `1px solid rgba(${av.accentRgb},0.5)`,
                              color: av.accent,
                              fontFamily: "JetBrains Mono",
                              fontSize: "8px",
                              letterSpacing: "0.18em",
                              cursor: "pointer",
                              transition: "all 0.2s",
                              alignSelf: "flex-start"
                            },
                            children: selectedAvatar === av.name ? "◉ INSPECTING" : "INSPECT BRAIN"
                          }
                        )
                      ]
                    },
                    av.id
                  ))
                }
              ),
              selectedAvatar && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "chamber.brain_detail.panel",
                  style: {
                    margin: "0 20px 14px",
                    background: "oklch(0.035 0.015 250)",
                    border: "1px solid rgba(99,102,241,0.35)",
                    padding: "14px",
                    boxShadow: "0 0 24px rgba(99,102,241,0.15)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "12px"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  color: "oklch(0.72 0.28 270)",
                                  fontFamily: "JetBrains Mono",
                                  fontSize: "11px",
                                  fontWeight: 900,
                                  letterSpacing: "0.2em"
                                },
                                children: selectedAvatar
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  color: "oklch(0.4 0.06 270)",
                                  fontFamily: "JetBrains Mono",
                                  fontSize: "8px",
                                  letterSpacing: "0.18em",
                                  marginLeft: "10px"
                                },
                                children: "BRAIN STATE DETAIL"
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              "data-ocid": "chamber.brain_detail.close_button",
                              onClick: () => setSelectedAvatar(null),
                              style: {
                                padding: "4px 12px",
                                background: "transparent",
                                border: "1px solid oklch(0.2 0.04 240)",
                                color: "oklch(0.45 0.06 240)",
                                fontFamily: "JetBrains Mono",
                                fontSize: "8px",
                                letterSpacing: "0.15em",
                                cursor: "pointer"
                              },
                              children: "CLOSE"
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "12px"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                background: "oklch(0.025 0.01 240)",
                                border: "1px solid oklch(0.1 0.015 240)",
                                padding: "10px"
                              },
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarBrainChip, { entityId: selectedAvatar.toLowerCase() })
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px"
                              },
                              children: [
                                ["SUBJECT", selectedAvatar],
                                ["ENTITY ID", selectedAvatar.toLowerCase()],
                                ["HEARTBEAT", "873ms"],
                                ["COUPLING", "PHI⁴ PHASE-LOCK"],
                                ["STATUS", "ACTIVE TARGET"]
                              ].map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "div",
                                {
                                  style: {
                                    display: "flex",
                                    justifyContent: "space-between",
                                    padding: "5px 8px",
                                    background: "oklch(0.04 0.012 240)",
                                    border: "1px solid oklch(0.09 0.015 240)"
                                  },
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "span",
                                      {
                                        style: {
                                          color: "oklch(0.38 0.05 220)",
                                          fontFamily: "JetBrains Mono",
                                          fontSize: "7px",
                                          letterSpacing: "0.12em"
                                        },
                                        children: k
                                      }
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "span",
                                      {
                                        style: {
                                          color: "oklch(0.72 0.28 270)",
                                          fontFamily: "JetBrains Mono",
                                          fontSize: "8px",
                                          fontWeight: 700,
                                          letterSpacing: "0.1em"
                                        },
                                        children: v
                                      }
                                    )
                                  ]
                                },
                                k
                              ))
                            }
                          )
                        ]
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "chamber.experiment_controls",
                  style: {
                    margin: "0 20px 14px",
                    background: "oklch(0.04 0.015 240)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    padding: "14px"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          color: "oklch(0.72 0.28 270)",
                          fontFamily: "JetBrains Mono",
                          fontSize: "9px",
                          letterSpacing: "0.25em",
                          fontWeight: 700,
                          marginBottom: "12px"
                        },
                        children: "RUN CHAMBER EXPERIMENT"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr auto",
                          gap: "10px",
                          alignItems: "flex-end"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "label",
                              {
                                style: {
                                  display: "block",
                                  color: "oklch(0.42 0.06 240)",
                                  fontFamily: "JetBrains Mono",
                                  fontSize: "7px",
                                  letterSpacing: "0.15em",
                                  marginBottom: "5px"
                                },
                                htmlFor: "chamber-compound-select",
                                children: "SELECT COMPOUND"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "select",
                              {
                                id: "chamber-compound-select",
                                "data-ocid": "chamber.compound.select",
                                value: selectedCompound,
                                onChange: (e) => setSelectedCompound(e.target.value),
                                style: {
                                  width: "100%",
                                  background: "oklch(0.03 0.01 240)",
                                  border: "1px solid oklch(0.15 0.02 240)",
                                  color: "oklch(0.82 0.04 215)",
                                  fontFamily: "JetBrains Mono",
                                  fontSize: "8px",
                                  padding: "6px 8px",
                                  outline: "none",
                                  cursor: "pointer",
                                  letterSpacing: "0.08em"
                                },
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— choose —" }),
                                  [
                                    "Triaxion-47",
                                    "Nexopril-8",
                                    "Cortimaze",
                                    "Dopavance",
                                    "Serotomax",
                                    "GABAlex",
                                    "Glutatrace",
                                    "Noradrenex"
                                  ].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
                                ]
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "label",
                              {
                                style: {
                                  display: "block",
                                  color: "oklch(0.42 0.06 240)",
                                  fontFamily: "JetBrains Mono",
                                  fontSize: "7px",
                                  letterSpacing: "0.15em",
                                  marginBottom: "5px"
                                },
                                htmlFor: "chamber-target-select",
                                children: "TARGET SUBJECT"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "select",
                              {
                                id: "chamber-target-select",
                                "data-ocid": "chamber.target_avatar.select",
                                value: targetAvatar,
                                onChange: (e) => setTargetAvatar(e.target.value),
                                style: {
                                  width: "100%",
                                  background: "oklch(0.03 0.01 240)",
                                  border: "1px solid oklch(0.15 0.02 240)",
                                  color: "oklch(0.82 0.04 215)",
                                  fontFamily: "JetBrains Mono",
                                  fontSize: "8px",
                                  padding: "6px 8px",
                                  outline: "none",
                                  cursor: "pointer",
                                  letterSpacing: "0.08em"
                                },
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— choose —" }),
                                  ["NEXUS", "COGNUS", "VERITAS", "ESURIENS"].map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: a, children: a }, a))
                                ]
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              "data-ocid": "chamber.fire_experiment.button",
                              disabled: !selectedCompound || !targetAvatar || chamberLoading,
                              onClick: async () => {
                                if (!selectedCompound || !targetAvatar) return;
                                setChamberLoading(true);
                                await new Promise((r) => setTimeout(r, 1500));
                                const delta = Math.round(
                                  Math.sin(hashCode(selectedCompound + targetAvatar) * 0.1) * 100
                                ) / 2;
                                const regions = [
                                  "Prefrontal Cortex",
                                  "Hippocampal Temple",
                                  "Amygdala Vigilans",
                                  "Thalamic Relay",
                                  "Salience Network",
                                  "Basal Ganglia"
                                ];
                                const domIdx = hashCode(selectedCompound + targetAvatar) % regions.length;
                                setExperimentResult({
                                  compound: selectedCompound,
                                  avatar: targetAvatar,
                                  timestamp: (/* @__PURE__ */ new Date()).toISOString(),
                                  deltaScore: delta,
                                  dominantRegion: regions[domIdx] ?? "Prefrontal Cortex",
                                  outcome: delta > 0 ? "EXCITATORY" : "INHIBITORY",
                                  status: "COMPLETE"
                                });
                                setChamberLoading(false);
                              },
                              style: {
                                padding: "6px 18px",
                                background: chamberLoading ? "oklch(0.12 0.04 270)" : "oklch(0.14 0.08 270)",
                                border: "1px solid oklch(0.45 0.28 270)",
                                color: !selectedCompound || !targetAvatar ? "oklch(0.35 0.06 270)" : "oklch(0.88 0.28 270)",
                                fontFamily: "JetBrains Mono",
                                fontSize: "8px",
                                letterSpacing: "0.2em",
                                cursor: !selectedCompound || !targetAvatar || chamberLoading ? "not-allowed" : "pointer",
                                boxShadow: selectedCompound && targetAvatar && !chamberLoading ? "0 0 12px oklch(0.45 0.28 270 / 0.4)" : "none",
                                transition: "all 0.2s",
                                whiteSpace: "nowrap",
                                alignSelf: "flex-end"
                              },
                              children: chamberLoading ? "◉ FIRING…" : "⚡ FIRE EXPERIMENT"
                            }
                          )
                        ]
                      }
                    )
                  ]
                }
              ),
              experimentResult && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "chamber.result.card",
                  style: {
                    margin: "0 20px 20px",
                    background: experimentResult.outcome === "EXCITATORY" ? "oklch(0.04 0.03 140)" : "oklch(0.04 0.03 25)",
                    border: `1px solid ${experimentResult.outcome === "EXCITATORY" ? "oklch(0.45 0.20 140)" : "oklch(0.45 0.22 25)"}`,
                    padding: "14px",
                    boxShadow: `0 0 20px ${experimentResult.outcome === "EXCITATORY" ? "oklch(0.45 0.20 140 / 0.2)" : "oklch(0.45 0.22 25 / 0.2)"}`
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "12px"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "div",
                              {
                                style: {
                                  color: experimentResult.outcome === "EXCITATORY" ? "oklch(0.68 0.28 140)" : "oklch(0.65 0.25 25)",
                                  fontFamily: "JetBrains Mono",
                                  fontSize: "9px",
                                  fontWeight: 900,
                                  letterSpacing: "0.2em"
                                },
                                children: [
                                  "EXPERIMENT RESULT — ",
                                  experimentResult.compound,
                                  " on",
                                  " ",
                                  experimentResult.avatar
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                style: {
                                  color: "oklch(0.35 0.04 220)",
                                  fontFamily: "JetBrains Mono",
                                  fontSize: "7px",
                                  letterSpacing: "0.1em",
                                  marginTop: "2px"
                                },
                                children: experimentResult.timestamp
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              "data-ocid": "chamber.result.clear_button",
                              onClick: () => setExperimentResult(null),
                              style: {
                                padding: "3px 10px",
                                background: "transparent",
                                border: "1px solid oklch(0.2 0.04 240)",
                                color: "oklch(0.4 0.05 240)",
                                fontFamily: "JetBrains Mono",
                                fontSize: "7px",
                                letterSpacing: "0.12em",
                                cursor: "pointer"
                              },
                              children: "CLEAR RESULT"
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                          gap: "8px"
                        },
                        children: [
                          [
                            "DELTA SCORE",
                            `${experimentResult.deltaScore > 0 ? "+" : ""}${experimentResult.deltaScore.toFixed(1)}`,
                            experimentResult.outcome === "EXCITATORY" ? "oklch(0.68 0.28 140)" : "oklch(0.65 0.25 25)"
                          ],
                          [
                            "OUTCOME",
                            experimentResult.outcome,
                            experimentResult.outcome === "EXCITATORY" ? "oklch(0.68 0.28 140)" : "oklch(0.65 0.25 25)"
                          ],
                          [
                            "DOMINANT REGION",
                            experimentResult.dominantRegion,
                            "oklch(0.72 0.22 65)"
                          ],
                          ["STATUS", experimentResult.status, "oklch(0.72 0.22 195)"]
                        ].map(([label, value, color]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            style: {
                              padding: "7px 10px",
                              background: "oklch(0.03 0.01 240)",
                              border: "1px solid oklch(0.09 0.015 240)"
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "div",
                                {
                                  style: {
                                    color: "oklch(0.35 0.04 220)",
                                    fontFamily: "JetBrains Mono",
                                    fontSize: "7px",
                                    letterSpacing: "0.12em",
                                    marginBottom: "3px"
                                  },
                                  children: label
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "div",
                                {
                                  style: {
                                    color,
                                    fontFamily: "JetBrains Mono",
                                    fontSize: "10px",
                                    fontWeight: 700,
                                    letterSpacing: "0.1em"
                                  },
                                  children: value
                                }
                              )
                            ]
                          },
                          label
                        ))
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "lab.control_bar",
            style: {
              height: "46px",
              flexShrink: 0,
              background: CSS.panel,
              borderTop: `1px solid ${CSS.border}`,
              display: "flex",
              alignItems: "center",
              gap: "0",
              padding: "0 8px"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "6px", alignItems: "center" }, children: modeButtons.map(({ id, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `lab.mode.${id}.button`,
                  onClick: () => {
                    setLabMode(id);
                    if (id === "spawn") setShowSpawn(true);
                  },
                  style: {
                    padding: "6px 14px",
                    background: labMode === id ? `${CSS.gold}18` : "transparent",
                    border: `1px solid ${labMode === id ? CSS.gold : CSS.border}`,
                    color: labMode === id ? CSS.gold : CSS.textDim,
                    fontFamily: "JetBrains Mono",
                    fontSize: "8px",
                    letterSpacing: "0.18em",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: labMode === id ? `0 0 8px ${CSS.gold}30` : "none"
                  },
                  children: label
                },
                id
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    width: "1px",
                    height: "20px",
                    background: CSS.border,
                    margin: "0 10px"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: { display: "flex", alignItems: "center", gap: "6px", flex: 1 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: {
                          color: CSS.textDim,
                          fontFamily: "JetBrains Mono",
                          fontSize: "7px",
                          letterSpacing: "0.12em",
                          flexShrink: 0
                        },
                        children: "EXTERNAL LAB"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        "data-ocid": "lab.external_url.input",
                        value: externalUrl,
                        onChange: (e) => setExternalUrl(e.target.value),
                        placeholder: "Enter external lab endpoint URL",
                        style: {
                          flex: 1,
                          background: CSS.bg,
                          border: `1px solid ${CSS.border}`,
                          color: CSS.text,
                          fontFamily: "JetBrains Mono",
                          fontSize: "8px",
                          padding: "4px 8px",
                          outline: "none",
                          letterSpacing: "0.05em",
                          minWidth: 0
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "lab.external_test.button",
                        onClick: handleTestExternal,
                        disabled: !externalUrl || externalStatus === "testing",
                        style: {
                          padding: "5px 10px",
                          background: "transparent",
                          border: `1px solid ${externalStatus === "ok" ? CSS.green : externalStatus === "fail" ? CSS.red : CSS.border}`,
                          color: externalStatus === "ok" ? CSS.green : externalStatus === "fail" ? CSS.red : CSS.textDim,
                          fontFamily: "JetBrains Mono",
                          fontSize: "7px",
                          letterSpacing: "0.12em",
                          cursor: !externalUrl || externalStatus === "testing" ? "not-allowed" : "pointer",
                          transition: "all 0.2s",
                          flexShrink: 0
                        },
                        children: externalStatus === "testing" ? "CONNECTING…" : externalStatus === "ok" ? "✓ LINKED" : externalStatus === "fail" ? "✗ FAILED" : "TEST"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: externalStatus === "ok" ? CSS.green : externalStatus === "fail" ? CSS.red : CSS.dim,
                          boxShadow: externalStatus === "ok" ? `0 0 6px ${CSS.green}` : "none",
                          flexShrink: 0
                        }
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
                    alignItems: "center",
                    gap: "6px",
                    paddingLeft: "10px",
                    borderLeft: `1px solid ${CSS.border}`,
                    flexShrink: 0
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: CSS.cyan,
                          boxShadow: `0 0 6px ${CSS.cyan}`,
                          animation: "lab-pulse 873ms ease-in-out infinite"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: {
                          color: CSS.cyan,
                          fontFamily: "JetBrains Mono",
                          fontSize: "8px",
                          letterSpacing: "0.1em"
                        },
                        children: pulse.beat.toLocaleString()
                      }
                    )
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
}
export {
  DevLabTab as default
};
