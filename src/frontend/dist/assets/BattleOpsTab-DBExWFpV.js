var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { a0 as liveBrainBus, r as reactExports, j as jsxRuntimeExports, ag as useNeuralSimulation } from "./index-CGYrnU7d.js";
import { C as Canvas, O as OrbitControls, u as useFrame } from "./OrbitControls-CwmRBLxw.js";
import { E } from "./jspdf.es.min-IUhxF21l.js";
import { A as AvatarBrainChip } from "./AvatarBrainChip-BC2vhMZs.js";
import { V as Vector3 } from "./three.module-DHVhg58e.js";
const ROLES = [
  "rifleman",
  "medic",
  "recon",
  "squad_leader",
  "marksman",
  "breacher",
  "support_gunner"
];
function randRange(min, max) {
  return min + Math.random() * (max - min);
}
function lerpVec(pos, target, t) {
  return [
    pos[0] + (target[0] - pos[0]) * t,
    0,
    pos[2] + (target[2] - pos[2]) * t
  ];
}
function dist2d(a, b) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[2] - b[2]) ** 2);
}
class BattleOpsRuntime {
  constructor() {
    __publicField(this, "state", null);
    __publicField(this, "initialized", false);
  }
  init(entityCount) {
    if (this.initialized) return;
    this.initialized = true;
    const entities = [];
    const half = Math.floor(entityCount / 2);
    for (let i = 0; i < entityCount; i++) {
      const faction = i < half ? "alpha" : "omega";
      const spawnZ = faction === "alpha" ? randRange(-90, -60) : randRange(60, 90);
      const spawnX = randRange(-30, 30);
      const pos = [spawnX, 0, spawnZ];
      const role = ROLES[i % ROLES.length];
      const id = `${faction}_${role}_${i}`;
      entities.push({
        id,
        instanceId: `battle_${id}`,
        role,
        faction,
        position: pos,
        targetPosition: [...pos],
        health: 100,
        state: "idle",
        lastActionType: "EXPLORE",
        lastConfidence: 0.5,
        threatLevel: randRange(0.1, 0.4),
        stressLevel: randRange(0.1, 0.3),
        fatigue: randRange(0.05, 0.2),
        tick: 0
      });
    }
    if (!liveBrainBus.isActive) liveBrainBus.start();
    this.state = {
      tick: 0,
      sessionId: `battle_session_${Date.now()}`,
      entities,
      alphaCount: half,
      omegaCount: entityCount - half,
      alphaControlZones: 1,
      omegaControlZones: 1,
      worldPressure: 0.3,
      activeEngagements: 0,
      traceLog: []
    };
  }
  tick(_deltaMs) {
    if (!this.state) return this._emptyState();
    const s = this.state;
    s.tick++;
    let engagements = 0;
    const newTraces = [];
    for (const entity of s.entities) {
      if (entity.state === "down") continue;
      const enemies = s.entities.filter(
        (e) => e.faction !== entity.faction && e.state !== "down"
      );
      let nearestEnemy = null;
      let nearestDist = Number.POSITIVE_INFINITY;
      for (const e of enemies) {
        const d = dist2d(entity.position, e.position);
        if (d < nearestDist) {
          nearestDist = d;
          nearestEnemy = e;
        }
      }
      const proximityThreat = nearestEnemy ? Math.max(0, 1 - nearestDist / 80) : 0;
      entity.threatLevel = Math.min(
        1,
        entity.threatLevel * 0.85 + proximityThreat * 0.15 + entity.stressLevel * 0.1
      );
      entity.fatigue = Math.min(1, entity.fatigue + 3e-4 * s.tick % 500);
      const rewardLevel = nearestEnemy ? proximityThreat * 0.4 : 0.15;
      const packet = liveBrainBus.routePayload(`battleops_${entity.id}`, {
        threat_level: entity.threatLevel,
        reward_level: rewardLevel,
        novelty: entity.stressLevel * 0.3,
        urgency: entity.threatLevel * 0.8 + entity.fatigue * 0.2,
        salience: Math.max(entity.threatLevel, rewardLevel)
      });
      entity.lastActionType = packet.action_type;
      entity.lastConfidence = packet.confidence;
      entity.tick = s.tick;
      let speed = 0;
      switch (packet.action_type) {
        case "MOVE":
          entity.state = "moving";
          speed = 0.6;
          if (nearestEnemy) entity.targetPosition = [...nearestEnemy.position];
          break;
        case "RETREAT":
          entity.state = "retreating";
          speed = 0.8;
          if (nearestEnemy) {
            const dx = entity.position[0] - nearestEnemy.position[0];
            const dz = entity.position[2] - nearestEnemy.position[2];
            const len = Math.sqrt(dx * dx + dz * dz) || 1;
            entity.targetPosition = [
              Math.max(-90, Math.min(90, entity.position[0] + dx / len * 20)),
              0,
              Math.max(-90, Math.min(90, entity.position[2] + dz / len * 20))
            ];
          }
          break;
        case "FREEZE":
          entity.state = "suppressed";
          speed = 0;
          break;
        case "ESCALATE":
          entity.state = "engaging";
          engagements++;
          speed = 0.3;
          if (nearestEnemy) entity.targetPosition = [...nearestEnemy.position];
          if (nearestDist < 15 && nearestEnemy) {
            nearestEnemy.health = Math.max(0, nearestEnemy.health - 2);
            if (nearestEnemy.health <= 0) nearestEnemy.state = "down";
          }
          break;
        case "INVESTIGATE":
          entity.state = "flanking";
          speed = 0.5;
          if (nearestEnemy) {
            entity.targetPosition = [
              nearestEnemy.position[0] + randRange(-25, 25),
              0,
              nearestEnemy.position[2] + randRange(-10, 10)
            ];
          }
          break;
        default:
          entity.state = "idle";
          speed = 0.15;
          if (dist2d(entity.position, entity.targetPosition) < 3) {
            entity.targetPosition = [
              entity.position[0] + randRange(-15, 15),
              0,
              entity.position[2] + randRange(-15, 15)
            ];
          }
      }
      if (speed > 0) {
        entity.position = lerpVec(
          entity.position,
          entity.targetPosition,
          speed * 0.08
        );
      }
      if (entity.state === "engaging" || entity.state === "moving") {
        if (nearestDist < 20 && Math.random() < 0.03) {
          entity.health = Math.max(0, entity.health - randRange(1, 5));
          if (entity.health <= 0) entity.state = "down";
        }
      }
      const outcome = packet.action_type === "ESCALATE" && nearestDist < 15 ? "success" : packet.action_type === "RETREAT" || packet.action_type === "FREEZE" ? "neutral" : Math.random() < packet.confidence ? "success" : "failure";
      newTraces.push({
        tick: s.tick,
        entityId: entity.id,
        faction: entity.faction,
        actionType: packet.action_type,
        confidence: packet.confidence,
        threatLevel: entity.threatLevel,
        position: [...entity.position],
        outcome
      });
    }
    s.alphaCount = s.entities.filter(
      (e) => e.faction === "alpha" && e.state !== "down"
    ).length;
    s.omegaCount = s.entities.filter(
      (e) => e.faction === "omega" && e.state !== "down"
    ).length;
    s.activeEngagements = engagements;
    s.worldPressure = Math.min(
      1,
      engagements / Math.max(1, s.entities.length) * 3 + s.entities.reduce((acc, e) => acc + e.threatLevel, 0) / s.entities.length
    );
    const centerX = 0;
    const centerZ = 0;
    const alphaInCenter = s.entities.filter(
      (e) => e.faction === "alpha" && dist2d(e.position, [centerX, 0, centerZ]) < 40
    ).length;
    const omegaInCenter = s.entities.filter(
      (e) => e.faction === "omega" && dist2d(e.position, [centerX, 0, centerZ]) < 40
    ).length;
    if (alphaInCenter > omegaInCenter + 2)
      s.alphaControlZones = Math.min(5, s.alphaControlZones + 0.1);
    if (omegaInCenter > alphaInCenter + 2)
      s.omegaControlZones = Math.min(5, s.omegaControlZones + 0.1);
    s.alphaControlZones = Math.max(0, Math.min(5, s.alphaControlZones));
    s.omegaControlZones = Math.max(0, Math.min(5, s.omegaControlZones));
    s.traceLog = [...newTraces, ...s.traceLog].slice(0, 100);
    return { ...s, entities: s.entities.map((e) => ({ ...e })) };
  }
  getState() {
    return this.state;
  }
  isInitialized() {
    return this.initialized;
  }
  _emptyState() {
    return {
      tick: 0,
      sessionId: "none",
      entities: [],
      alphaCount: 0,
      omegaCount: 0,
      alphaControlZones: 0,
      omegaControlZones: 0,
      worldPressure: 0,
      activeEngagements: 0,
      traceLog: []
    };
  }
}
const globalBattleOpsRuntime = new BattleOpsRuntime();
const BAR_STYLE = (val, color) => ({
  width: `${(val * 100).toFixed(0)}%`,
  height: "6px",
  background: color,
  borderRadius: "1px",
  transition: "width 0.3s ease"
});
function pct(v) {
  return `${(v * 100).toFixed(0)}%`;
}
function stateBadgeColor(state) {
  switch (state) {
    case "engaging":
      return "#ef4444";
    case "moving":
      return "#22c55e";
    case "retreating":
      return "#f59e0b";
    case "suppressed":
      return "#94a3b8";
    case "flanking":
      return "#38bdf8";
    case "down":
      return "#475569";
    default:
      return "#64748b";
  }
}
function Ground() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { rotation: [-Math.PI / 2, 0, 0], receiveShadow: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("planeGeometry", { args: [200, 200, 30, 30] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meshStandardMaterial", { color: "#1a2e0d", roughness: 0.95, metalness: 0.05 })
  ] });
}
function TerrainFeatures() {
  const rocks = reactExports.useMemo(() => {
    const arr = [];
    for (let i = 0; i < 22; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 160,
        z: (Math.random() - 0.5) * 160,
        w: 1.5 + Math.random() * 3,
        h: 0.8 + Math.random() * 2,
        d: 1.5 + Math.random() * 3
      });
    }
    return arr;
  }, []);
  const trees = reactExports.useMemo(() => {
    const arr = [];
    for (let i = 0; i < 18; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 160,
        z: (Math.random() - 0.5) * 160,
        h: 3 + Math.random() * 4
      });
    }
    return arr;
  }, []);
  const buildings = reactExports.useMemo(
    () => [
      { x: -20, z: 10, w: 8, h: 5, d: 6 },
      { x: 25, z: -15, w: 10, h: 4, d: 8 },
      { x: 5, z: 35, w: 6, h: 6, d: 5 }
    ],
    []
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    rocks.map((r, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static useMemo array
      /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [r.x, r.h / 2, r.z], castShadow: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("boxGeometry", { args: [r.w, r.h, r.d] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("meshStandardMaterial", { color: "#4a5568", roughness: 0.9 })
      ] }, `rock-${i}`)
    )),
    trees.map((t, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static useMemo array
      /* @__PURE__ */ jsxRuntimeExports.jsxs("group", { position: [t.x, 0, t.z], children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [0, t.h * 0.4, 0], children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("cylinderGeometry", { args: [0.2, 0.35, t.h * 0.8, 6] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("meshStandardMaterial", { color: "#5c4a1e" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [0, t.h, 0], children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("sphereGeometry", { args: [1.8, 6, 6] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("meshStandardMaterial", { color: "#1a4a1a", roughness: 0.8 })
        ] })
      ] }, `tree-${i}`)
    )),
    buildings.map((b, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static useMemo array
      /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [b.x, b.h / 2, b.z], castShadow: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("boxGeometry", { args: [b.w, b.h, b.d] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("meshStandardMaterial", { color: "#374151", roughness: 0.8 })
      ] }, `bld-${i}`)
    ))
  ] });
}
function CommandPosts() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("group", { position: [0, 0, -80], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [0, 2, 0], castShadow: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("boxGeometry", { args: [8, 4, 8] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "meshStandardMaterial",
          {
            color: "#1e3a5f",
            emissive: "#1e40af",
            emissiveIntensity: 0.3
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [0, 6.5, 0], children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("cylinderGeometry", { args: [0.15, 0.15, 5, 6] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("meshStandardMaterial", { color: "#9ca3af" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "pointLight",
        {
          position: [0, 4, 0],
          color: "#3b82f6",
          intensity: 3,
          distance: 20
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("group", { position: [0, 0, 80], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [0, 2, 0], castShadow: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("boxGeometry", { args: [8, 4, 8] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "meshStandardMaterial",
          {
            color: "#5f1e1e",
            emissive: "#dc2626",
            emissiveIntensity: 0.3
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [0, 6.5, 0], children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("cylinderGeometry", { args: [0.15, 0.15, 5, 6] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("meshStandardMaterial", { color: "#9ca3af" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "pointLight",
        {
          position: [0, 4, 0],
          color: "#ef4444",
          intensity: 3,
          distance: 20
        }
      )
    ] })
  ] });
}
function ControlZones() {
  const zones = [
    { x: 0, z: 0, color: "#eab308", label: "CENTER" },
    { x: -35, z: -20, color: "#eab308", label: "NW" },
    { x: 35, z: -20, color: "#3b82f6", label: "NE" },
    { x: -35, z: 20, color: "#eab308", label: "SW" },
    { x: 35, z: 20, color: "#ef4444", label: "SE" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: zones.map((z) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "mesh",
    {
      position: [z.x, 0.05, z.z],
      rotation: [-Math.PI / 2, 0, 0],
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("ringGeometry", { args: [8, 10, 32] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "meshStandardMaterial",
          {
            color: z.color,
            emissive: z.color,
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.7
          }
        )
      ]
    },
    z.label
  )) });
}
function EntityMesh({
  entity,
  selected,
  onClick
}) {
  const meshRef = reactExports.useRef(null);
  const [pos] = reactExports.useState(() => new Vector3(...entity.position));
  useFrame(() => {
    if (!meshRef.current) return;
    pos.set(...entity.position);
    meshRef.current.position.lerp(pos, 0.15);
    if (entity.state === "down") {
      meshRef.current.rotation.z = Math.PI / 2;
    } else {
      meshRef.current.rotation.z = 0;
    }
  });
  const isDown = entity.state === "down";
  const isEngaging = entity.state === "engaging";
  const isSuppressed = entity.state === "suppressed";
  const factionColor = entity.faction === "alpha" ? "#1e40af" : "#dc2626";
  const opacity = isSuppressed ? 0.45 : 1;
  const healthFrac = entity.health / 100;
  const hpColor = healthFrac > 0.6 ? "#22c55e" : healthFrac > 0.3 ? "#f59e0b" : "#ef4444";
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Three.js canvas element
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "group",
      {
        ref: meshRef,
        position: entity.position,
        onClick: (e) => {
          e.stopPropagation();
          onClick();
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [0, 0.6, 0], castShadow: true, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("cylinderGeometry", { args: [0.22, 0.28, 1, 8] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "meshStandardMaterial",
              {
                color: factionColor,
                transparent: true,
                opacity,
                emissive: isEngaging ? "#ff6600" : factionColor,
                emissiveIntensity: isEngaging ? 0.8 : 0.15
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [0, 1.35, 0], children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("sphereGeometry", { args: [0.22, 8, 8] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "meshStandardMaterial",
              {
                color: factionColor,
                transparent: true,
                opacity
              }
            )
          ] }),
          !isDown && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [0, 1.85, 0], children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("boxGeometry", { args: [0.6, 0.07, 0.04] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("meshStandardMaterial", { color: "#374151" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [-0.3 + healthFrac * 0.3, 1.85, 0.01], children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("boxGeometry", { args: [healthFrac * 0.6, 0.07, 0.04] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "meshStandardMaterial",
                {
                  color: hpColor,
                  emissive: hpColor,
                  emissiveIntensity: 0.4
                }
              )
            ] })
          ] }),
          isEngaging && /* @__PURE__ */ jsxRuntimeExports.jsx("pointLight", { color: "#ff6600", intensity: 2, distance: 6 }),
          selected && /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [0, 0.05, 0], rotation: [-Math.PI / 2, 0, 0], children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("ringGeometry", { args: [0.5, 0.65, 20] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "meshStandardMaterial",
              {
                color: "#22c55e",
                emissive: "#22c55e",
                emissiveIntensity: 1
              }
            )
          ] })
        ]
      }
    )
  );
}
function createDefaultShadowModel() {
  return {
    DPA: 50,
    NOR: 40,
    SER: 55,
    ACH: 45,
    GAB: 60,
    GLU: 50,
    COR: 35,
    OXT: 50,
    CRH: 30,
    MEL: 20,
    END: 40,
    ANA: 45,
    SUP: 30,
    NPY: 50,
    VIP: 40,
    CCK: 35,
    ADO: 25,
    HIS: 30,
    NIT: 40,
    BDN: 55,
    IGF: 45,
    PRL: 35,
    VAS: 40,
    DYN: 30
  };
}
function clampChem(v) {
  return Math.max(0, Math.min(100, v));
}
function evolveShadowModel(prev, engagements, worldPressure) {
  const next = { ...prev };
  if (worldPressure > 0.4 || engagements > 2) {
    next.COR = clampChem(next.COR + 15);
    next.OXT = clampChem(next.OXT - 8);
    next.CRH = clampChem(next.CRH + 8);
    next.NOR = clampChem(next.NOR + 5);
  }
  if (engagements > 0) {
    next.DPA = clampChem(next.DPA + 20);
    next.NOR = clampChem(next.NOR + 12);
    next.GLU = clampChem(next.GLU + 10);
    next.END = clampChem(next.END + 6);
    next.HIS = clampChem(next.HIS + 4);
  }
  if (worldPressure > 0.6) {
    next.SER = clampChem(next.SER - 10);
    next.CRH = clampChem(next.CRH + 8);
    next.GAB = clampChem(next.GAB - 15);
    next.SUP = clampChem(next.SUP + 5);
  }
  if (engagements === 0 && worldPressure < 0.2) {
    next.GAB = clampChem(next.GAB + 12);
    next.DPA = clampChem(next.DPA - 8);
    next.SER = clampChem(next.SER + 5);
    next.ANA = clampChem(next.ANA + 4);
    next.MEL = clampChem(next.MEL + 3);
  }
  next.COR = clampChem(next.COR * 0.97);
  next.DPA = clampChem(next.DPA * 0.99);
  next.NOR = clampChem(next.NOR * 0.98);
  next.CRH = clampChem(next.CRH * 0.97);
  return next;
}
function computePostEngagementReport(baseline, finalState, durationTicks) {
  const keys = Object.keys(baseline);
  let peakStressKey = "COR";
  let peakStressVal = 0;
  let peakSurgeKey = "DPA";
  let peakSurgeVal = 0;
  let totalShift = 0;
  for (const k of keys) {
    const delta = finalState[k] - baseline[k];
    totalShift += Math.abs(delta);
    if (delta > 0 && (k === "COR" || k === "CRH" || k === "NOR" || k === "SUP")) {
      if (finalState[k] > peakStressVal) {
        peakStressVal = finalState[k];
        peakStressKey = k;
      }
    }
    if (delta > 0 && (k === "DPA" || k === "END" || k === "ANA")) {
      if (finalState[k] > peakSurgeVal) {
        peakSurgeVal = finalState[k];
        peakSurgeKey = k;
      }
    }
  }
  return {
    durationTicks,
    peakStressChemical: peakStressKey,
    peakSurgeChemical: peakSurgeKey,
    totalChemicalShift: Math.round(totalShift),
    finalState,
    baseline
  };
}
const SHADOW_COMPARE_CHEMICALS = [
  "DPA",
  "NOR",
  "SER",
  "GAB",
  "GLU",
  "COR",
  "OXT",
  "CRH"
];
function ShadowAnalysisPanel({
  shadow,
  baseline,
  onClose,
  report
}) {
  const totalDelta = SHADOW_COMPARE_CHEMICALS.reduce(
    (acc, k) => acc + (shadow[k] - baseline[k]),
    0
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "battleops.shadow_analysis_panel",
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 40,
        width: 340,
        background: "rgba(4,8,18,0.97)",
        borderRight: "2px solid rgba(234,179,8,0.5)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "monospace",
        fontSize: 10,
        color: "#c8d8c8",
        backdropFilter: "blur(12px)",
        zIndex: 20,
        overflowY: "auto"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 14px",
              borderBottom: "1px solid rgba(234,179,8,0.25)",
              background: "rgba(234,179,8,0.06)",
              flexShrink: 0
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      color: "#eab308",
                      fontSize: 12,
                      fontWeight: "bold",
                      letterSpacing: 2
                    },
                    children: "SHADOW ANALYSIS"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      color: "#64748b",
                      fontSize: 8,
                      marginTop: 1,
                      letterSpacing: 1
                    },
                    children: "MIRRORED NEUROCHEMICAL MODEL · READ-ONLY"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "battleops.shadow_close_button",
                  onClick: onClose,
                  style: {
                    background: "transparent",
                    border: "1px solid rgba(234,179,8,0.3)",
                    color: "#eab308",
                    padding: "3px 10px",
                    cursor: "pointer",
                    fontSize: 11,
                    fontFamily: "monospace"
                  },
                  children: "✕"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              margin: "10px 14px 0",
              padding: "8px 10px",
              background: "rgba(234,179,8,0.04)",
              border: "1px solid rgba(234,179,8,0.15)",
              flexShrink: 0
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    color: "#94a3b8",
                    fontSize: 8,
                    letterSpacing: 1,
                    marginBottom: 4
                  },
                  children: "ENGAGEMENT DELTA"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 9, color: "#64748b" }, children: "TOTAL SHIFT (8-CHEM)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        style: {
                          fontSize: 14,
                          fontWeight: "bold",
                          color: totalDelta > 0 ? "#eab308" : totalDelta < 0 ? "#38bdf8" : "#64748b"
                        },
                        children: [
                          totalDelta > 0 ? "+" : "",
                          totalDelta.toFixed(1)
                        ]
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "10px 14px", flexShrink: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: "36px 1fr 32px 10px 1fr 32px",
                gap: "3px 4px",
                alignItems: "center",
                marginBottom: 6
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#475569", fontSize: 7 }, children: "CHEM" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#3b82f6", fontSize: 7, gridColumn: "2/4" }, children: "LIVE ORGANISM" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#eab308", fontSize: 7, gridColumn: "5/7" }, children: "SHADOW BATTLE" })
              ]
            }
          ),
          SHADOW_COMPARE_CHEMICALS.map((k) => {
            const live = baseline[k];
            const shadowVal = shadow[k];
            const delta = shadowVal - live;
            const deltaColor = delta > 2 ? "#eab308" : delta < -2 ? "#38bdf8" : "#64748b";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  display: "grid",
                  gridTemplateColumns: "36px 1fr 32px 10px 1fr 32px",
                  gap: "3px 4px",
                  alignItems: "center",
                  marginBottom: 5
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: { color: "#94a3b8", fontSize: 9, fontWeight: "bold" },
                      children: k
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: { background: "#1e293b", borderRadius: 1, height: 4 },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            width: `${live}%`,
                            height: "100%",
                            background: "#3b82f6",
                            borderRadius: 1
                          }
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: { color: "#3b82f6", fontSize: 9, textAlign: "right" },
                      children: live.toFixed(0)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: { color: deltaColor, fontSize: 8, textAlign: "center" },
                      children: delta > 0.5 ? "▲" : delta < -0.5 ? "▼" : "─"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: { background: "#1e293b", borderRadius: 1, height: 4 },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            width: `${shadowVal}%`,
                            height: "100%",
                            background: delta > 0 ? "#eab308" : delta < 0 ? "#38bdf8" : "#64748b",
                            borderRadius: 1
                          }
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      style: {
                        color: deltaColor,
                        fontSize: 9,
                        textAlign: "right",
                        fontWeight: "bold"
                      },
                      children: [
                        delta > 0 ? "+" : "",
                        delta.toFixed(0)
                      ]
                    }
                  )
                ]
              },
              k
            );
          })
        ] }),
        report && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "battleops.engagement_report_card",
            style: {
              margin: "4px 14px 14px",
              padding: "10px 10px 8px",
              background: "rgba(234,179,8,0.05)",
              border: "1px solid rgba(234,179,8,0.3)",
              flexShrink: 0
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    color: "#eab308",
                    fontSize: 10,
                    fontWeight: "bold",
                    letterSpacing: 2,
                    marginBottom: 8
                  },
                  children: "BATTLE NEUROCHEMISTRY REPORT"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 5 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#64748b", fontSize: 9 }, children: "DURATION" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#e2e8f0", fontSize: 9 }, children: [
                    report.durationTicks,
                    " ticks"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#64748b", fontSize: 9 }, children: "PEAK STRESS" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      style: { color: "#ef4444", fontSize: 9, fontWeight: "bold" },
                      children: [
                        report.peakStressChemical,
                        " ·",
                        " ",
                        report.finalState[report.peakStressChemical].toFixed(0)
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#64748b", fontSize: 9 }, children: "PEAK SURGE" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      style: { color: "#22c55e", fontSize: 9, fontWeight: "bold" },
                      children: [
                        report.peakSurgeChemical,
                        " ·",
                        " ",
                        report.finalState[report.peakSurgeChemical].toFixed(0)
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#64748b", fontSize: 9 }, children: "TOTAL SHIFT" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      style: { color: "#eab308", fontSize: 9, fontWeight: "bold" },
                      children: report.totalChemicalShift
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    marginTop: 8,
                    padding: "6px 8px",
                    background: "rgba(34,197,94,0.06)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    fontSize: 8,
                    color: "#22c55e",
                    lineHeight: 1.5,
                    letterSpacing: 0.5
                  },
                  children: "COGNUS has been notified — organism may integrate learnings from this engagement"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
const CHEM_FULL_NAMES = {
  DPA: "Dopamine",
  NOR: "Norepinephrine",
  SER: "Serotonin",
  ACH: "Acetylcholine",
  GAB: "GABA",
  GLU: "Glutamate",
  COR: "Cortisol",
  OXT: "Oxytocin",
  CRH: "CRH",
  MEL: "Melatonin",
  END: "β-Endorphin",
  ANA: "Anandamide",
  SUP: "Substance P",
  NPY: "NPY",
  VIP: "VIP",
  CCK: "CCK",
  ADO: "Adenosine",
  HIS: "Histamine",
  NIT: "Nitric Oxide",
  BDN: "BDNF",
  IGF: "IGF-1",
  PRL: "Prolactin",
  VAS: "Vasopressin",
  DYN: "Dynorphin"
};
function chemBarColor(val) {
  if (val > 80) return "#ef4444";
  if (val > 50) return "#f59e0b";
  return "#22c55e";
}
function AvatarShadowChemPanel({
  entityId,
  shadow,
  baseline
}) {
  const ALL_KEYS = Object.keys(shadow);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "battleops.avatar_neurochem_panel",
      style: {
        margin: "0 14px 10px",
        padding: "8px 10px",
        background: "#070b14",
        border: "1px solid rgba(234,179,8,0.25)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              color: "#eab308",
              fontSize: 8,
              letterSpacing: 2,
              marginBottom: 2,
              fontWeight: "bold"
            },
            children: [
              "NEUROCHEMICAL STATE ·",
              " ",
              entityId.split("_").slice(0, 2).join(" ").toUpperCase()
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              color: "#475569",
              fontSize: 7,
              marginBottom: 6,
              letterSpacing: 1
            },
            children: "GREEN <0.5 · AMBER 0.5–0.8 · RED >0.8 · vs BASELINE"
          }
        ),
        ALL_KEYS.map((k) => {
          const val = shadow[k];
          const base = baseline[k];
          const delta = val - base;
          const valNorm = val / 100;
          const barColor = chemBarColor(val);
          const deltaColor = delta > 2 ? "#eab308" : delta < -2 ? "#38bdf8" : "#475569";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: { marginBottom: 4 },
              "data-ocid": `battleops.neurochem_row.${k.toLowerCase()}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 2,
                      alignItems: "center"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          style: {
                            color: "#64748b",
                            fontSize: 7,
                            minWidth: 28,
                            fontWeight: "bold"
                          },
                          children: k
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          style: {
                            color: "#374151",
                            fontSize: 6,
                            flex: 1,
                            paddingLeft: 4
                          },
                          children: CHEM_FULL_NAMES[k]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          style: {
                            color: deltaColor,
                            fontSize: 7,
                            minWidth: 28,
                            textAlign: "right"
                          },
                          children: [
                            delta > 0 ? "+" : "",
                            delta.toFixed(0)
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          style: {
                            color: barColor,
                            fontSize: 7,
                            minWidth: 24,
                            textAlign: "right"
                          },
                          children: val.toFixed(0)
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#1e293b", borderRadius: 1, height: 3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      width: `${(valNorm * 100).toFixed(1)}%`,
                      height: "100%",
                      background: barColor,
                      borderRadius: 1,
                      boxShadow: val > 80 ? `0 0 3px ${barColor}` : "none",
                      transition: "width 0.4s ease"
                    }
                  }
                ) })
              ]
            },
            k
          );
        })
      ]
    }
  );
}
function BattleScene({
  worldState,
  selectedId,
  onSelectEntity
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("color", { attach: "background", args: ["#060c14"] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("fog", { attach: "fog", args: ["#0a0f1e", 35, 130] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ambientLight", { intensity: 0.25, color: "#4a6080" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "directionalLight",
      {
        position: [40, 60, 20],
        intensity: 1.2,
        color: "#c8d8e8",
        castShadow: true,
        "shadow-mapSize": [1024, 1024]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "directionalLight",
      {
        position: [-20, 20, -30],
        intensity: 0.4,
        color: "#405060"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Ground, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TerrainFeatures, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CommandPosts, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ControlZones, {}),
    worldState.entities.map((entity) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      EntityMesh,
      {
        entity,
        selected: selectedId === entity.id,
        onClick: () => onSelectEntity(selectedId === entity.id ? null : entity.id)
      },
      entity.id
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      OrbitControls,
      {
        enablePan: true,
        enableZoom: true,
        enableRotate: true,
        minPolarAngle: 0.1,
        maxPolarAngle: Math.PI / 2.2,
        minDistance: 8,
        maxDistance: 160
      }
    )
  ] });
}
function EntityPanel({
  entity,
  traces,
  shadow,
  baseline,
  battleActive,
  onClose,
  isExperimentTarget,
  onToggleExperimentTarget
}) {
  const recent = traces.filter((t) => t.entityId === entity.id).slice(0, 3);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "battleops.entity_panel",
      style: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 40,
        // above status bar
        width: 320,
        background: "rgba(6,10,18,0.96)",
        borderLeft: "2px solid #eab308",
        display: "flex",
        flexDirection: "column",
        fontFamily: "monospace",
        fontSize: 11,
        color: "#c8d8c8",
        backdropFilter: "blur(10px)",
        zIndex: 20,
        overflowY: "auto"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding: "12px 14px 10px",
              borderBottom: "1px solid rgba(234,179,8,0.2)",
              background: "rgba(234,179,8,0.05)",
              flexShrink: 0
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      color: "#eab308",
                      fontSize: 14,
                      fontWeight: "bold",
                      letterSpacing: 2
                    },
                    children: entity.role.toUpperCase()
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      color: "#64748b",
                      fontSize: 9,
                      marginTop: 2,
                      letterSpacing: 1
                    },
                    children: entity.id
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "battleops.experiment_target_button",
                  onClick: onToggleExperimentTarget,
                  title: isExperimentTarget ? "Remove as experiment target" : "Use as experiment target in Pharma Lab",
                  style: {
                    background: isExperimentTarget ? "rgba(34,197,94,0.2)" : "transparent",
                    border: `1px solid ${isExperimentTarget ? "#22c55e" : "rgba(234,179,8,0.3)"}`,
                    color: isExperimentTarget ? "#22c55e" : "#64748b",
                    padding: "3px 8px",
                    cursor: "pointer",
                    fontSize: 9,
                    letterSpacing: 1,
                    fontFamily: "monospace",
                    marginRight: 6,
                    transition: "all 0.2s"
                  },
                  children: isExperimentTarget ? "⬤ TARGET" : "◯ TARGET"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "battleops.close_button",
                  onClick: onClose,
                  style: {
                    background: "transparent",
                    border: "1px solid rgba(234,179,8,0.3)",
                    color: "#eab308",
                    padding: "3px 10px",
                    cursor: "pointer",
                    fontSize: 11,
                    letterSpacing: 1,
                    fontFamily: "monospace"
                  },
                  children: "✕"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: { display: "flex", gap: 8, padding: "8px 14px", flexShrink: 0 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    background: entity.faction === "alpha" ? "#1e3a5f" : "#5f1e1e",
                    color: entity.faction === "alpha" ? "#93c5fd" : "#fca5a5",
                    padding: "2px 10px",
                    fontSize: 9,
                    letterSpacing: 2,
                    fontWeight: "bold"
                  },
                  children: entity.faction.toUpperCase()
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    background: `${stateBadgeColor(entity.state)}22`,
                    color: stateBadgeColor(entity.state),
                    padding: "2px 10px",
                    fontSize: 9,
                    letterSpacing: 2,
                    border: `1px solid ${stateBadgeColor(entity.state)}55`
                  },
                  children: entity.state.toUpperCase()
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "0 14px 8px", flexShrink: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 3
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#94a3b8", fontSize: 9, letterSpacing: 1 }, children: "HEALTH" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      color: entity.health > 50 ? "#22c55e" : "#ef4444",
                      fontSize: 9
                    },
                    children: entity.health.toFixed(0)
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#1e293b", borderRadius: 1, height: 5 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: BAR_STYLE(
                entity.health / 100,
                entity.health > 50 ? "#22c55e" : entity.health > 25 ? "#f59e0b" : "#ef4444"
              )
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              margin: "0 14px 10px",
              padding: "6px 8px",
              background: "#0a0f1a",
              border: "1px solid #1e293b",
              flexShrink: 0
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    color: "#475569",
                    fontSize: 8,
                    letterSpacing: 1,
                    marginBottom: 3
                  },
                  children: "LAST BRAIN ACTION"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#22c55e", fontSize: 11, fontWeight: "bold" }, children: entity.lastActionType }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 3 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#1e293b", borderRadius: 1, height: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: BAR_STYLE(entity.lastConfidence, "#3b82f6") }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#475569", fontSize: 8, marginTop: 2 }, children: [
                  "CONFIDENCE ",
                  pct(entity.lastConfidence)
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "0 14px 10px", flexShrink: 0 }, children: [
          { label: "THREAT", val: entity.threatLevel, color: "#ef4444" },
          { label: "STRESS", val: entity.stressLevel, color: "#f59e0b" },
          { label: "FATIGUE", val: entity.fatigue, color: "#8b5cf6" }
        ].map(({ label, val, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 5 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 2
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#64748b", fontSize: 8 }, children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color, fontSize: 8 }, children: pct(val) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#1e293b", borderRadius: 1, height: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: BAR_STYLE(val, color) }) })
        ] }, label)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              margin: "0 14px 10px",
              padding: "10px 10px 8px",
              background: "#070b14",
              border: "1px solid rgba(234,179,8,0.2)",
              flexShrink: 0
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    color: "#eab308",
                    fontSize: 9,
                    letterSpacing: 2,
                    marginBottom: 8,
                    fontWeight: "bold"
                  },
                  children: "BRAIN CHIP · 16N"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarBrainChip, { entityId: entity.id })
            ]
          }
        ),
        battleActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
          AvatarShadowChemPanel,
          {
            entityId: entity.id,
            shadow,
            baseline
          }
        ),
        recent.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              margin: "0 14px 14px",
              borderTop: "1px solid #1e293b",
              paddingTop: 8,
              flexShrink: 0
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    color: "#475569",
                    fontSize: 8,
                    letterSpacing: 1,
                    marginBottom: 5
                  },
                  children: "RECENT TRACES"
                }
              ),
              recent.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 3,
                    fontSize: 9,
                    color: t.outcome === "success" ? "#22c55e" : t.outcome === "failure" ? "#ef4444" : "#94a3b8"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "T",
                      t.tick,
                      " ",
                      t.actionType
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      (t.confidence * 100).toFixed(0),
                      "% ",
                      t.outcome.toUpperCase()
                    ] })
                  ]
                },
                `trace-${t.tick}-${i}`
              ))
            ]
          }
        )
      ]
    }
  );
}
function StatusBar({ worldState }) {
  const bus = liveBrainBus.getBusStatus();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "battleops.status_bar",
      style: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(4,8,16,0.92)",
        borderTop: "1px solid #1a3a1a",
        padding: "6px 16px",
        display: "flex",
        gap: 24,
        alignItems: "center",
        fontFamily: "monospace",
        fontSize: 10,
        color: "#64748b",
        backdropFilter: "blur(4px)",
        zIndex: 10,
        flexWrap: "wrap"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#22c55e" }, children: [
          "ALPHA ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff" }, children: worldState.alphaCount })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#ef4444" }, children: [
          "OMEGA ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff" }, children: worldState.omegaCount })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "ZONES α",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#3b82f6" }, children: worldState.alphaControlZones.toFixed(0) }),
          " ",
          "Ω",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ef4444" }, children: worldState.omegaControlZones.toFixed(0) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "ENGAGEMENTS",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                color: worldState.activeEngagements > 3 ? "#ef4444" : "#f59e0b"
              },
              children: worldState.activeEngagements
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            style: { flexGrow: 1, display: "flex", alignItems: "center", gap: 6 },
            children: [
              "PRESSURE",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    width: 80,
                    height: 5,
                    background: "#1e293b",
                    borderRadius: 1
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        width: `${(worldState.worldPressure * 100).toFixed(0)}%`,
                        height: "100%",
                        background: `hsl(${120 - worldState.worldPressure * 120}, 80%, 45%)`,
                        borderRadius: 1
                      }
                    }
                  )
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "TICK ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#94a3b8" }, children: worldState.tick })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: bus.isActive ? "#22c55e" : "#475569" }, children: [
          "BRAIN BUS ",
          bus.isActive ? "LIVE" : "OFF"
        ] })
      ]
    }
  );
}
function BattleOpsStartMenu({ onEnter }) {
  const bus = liveBrainBus.getBusStatus();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        height: "100%",
        background: "#060c14",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "monospace",
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
              backgroundImage: "linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              pointerEvents: "none"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", zIndex: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontSize: 9,
                color: "#22c55e",
                letterSpacing: 8,
                marginBottom: 12,
                opacity: 0.7
              },
              children: "NEUROEMERGENCE CORE"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontSize: 36,
                fontWeight: "bold",
                color: "#e2e8f0",
                letterSpacing: 4,
                lineHeight: 1.1
              },
              children: "EMERGENT"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontSize: 36,
                fontWeight: "bold",
                color: "#22c55e",
                letterSpacing: 4,
                marginBottom: 6
              },
              children: "BATTLEOPS"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontSize: 10,
                color: "#64748b",
                letterSpacing: 3,
                marginBottom: 40
              },
              children: "AI WARFARE · BRAIN-DRIVEN ENTITIES · EMERGENT COMBAT"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "flex",
                gap: 24,
                justifyContent: "center",
                marginBottom: 40,
                padding: "12px 24px",
                background: "rgba(34,197,94,0.05)",
                border: "1px solid #1a3a1a"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    style: { fontSize: 9, color: bus.isActive ? "#22c55e" : "#475569" },
                    children: [
                      "● CORE ",
                      bus.isActive ? "LIVE" : "OFFLINE"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 9, color: "#475569" }, children: [
                  "PAYLOADS ",
                  bus.payloadsRouted
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 9, color: "#475569" }, children: [
                  "PACKETS ",
                  bus.packetsReturned
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "battleops.observer_button",
              onClick: onEnter,
              style: {
                background: "transparent",
                border: "2px solid #22c55e",
                color: "#22c55e",
                padding: "14px 48px",
                fontSize: 14,
                letterSpacing: 4,
                cursor: "pointer",
                fontFamily: "monospace",
                transition: "all 0.2s",
                marginBottom: 16,
                display: "block",
                width: "100%"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = "rgba(34,197,94,0.15)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = "transparent";
              },
              children: "ENTER BATTLEOPS"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, color: "#374151", letterSpacing: 2 }, children: "20 AI ENTITIES · FULL BRAIN-BODY COUPLING · LIVE TRACE RETURN" })
        ] })
      ]
    }
  );
}
function BattleOpsWorld() {
  const neural = useNeuralSimulation();
  const [worldState, setWorldState] = reactExports.useState(() => {
    if (!globalBattleOpsRuntime.isInitialized()) {
      globalBattleOpsRuntime.init(20);
    }
    return globalBattleOpsRuntime.getState() ?? {
      tick: 0,
      sessionId: "init",
      entities: [],
      alphaCount: 0,
      omegaCount: 0,
      alphaControlZones: 0,
      omegaControlZones: 0,
      worldPressure: 0,
      activeEngagements: 0,
      traceLog: []
    };
  });
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const [_avatarShadowMap, setAvatarShadowMap] = reactExports.useState({});
  const avatarBaselineMap = reactExports.useRef({});
  reactExports.useRef({});
  const [experimentTargetId, setExperimentTargetId] = reactExports.useState(
    () => {
      try {
        return localStorage.getItem("pharma_lab_target_avatar");
      } catch {
        return null;
      }
    }
  );
  const [battleActive, setBattleActive] = reactExports.useState(false);
  const battleActiveRef = reactExports.useRef(false);
  const battleStartTickRef = reactExports.useRef(0);
  const [postReport, setPostReport] = reactExports.useState(
    null
  );
  const prevEngagementsRef = reactExports.useRef(0);
  const [shadowModel, setShadowModel] = reactExports.useState(
    () => createDefaultShadowModel()
  );
  const [shadowBaseline, setShadowBaseline] = reactExports.useState(null);
  const [showShadowPanel, setShowShadowPanel] = reactExports.useState(false);
  const syncBaselineFromOrganism = reactExports.useCallback(() => {
    setShadowBaseline(null);
  }, []);
  const toggleExperimentTarget = reactExports.useCallback((entityId) => {
    setExperimentTargetId((prev) => {
      const next = prev === entityId ? null : entityId;
      try {
        if (next) localStorage.setItem("pharma_lab_target_avatar", next);
        else localStorage.removeItem("pharma_lab_target_avatar");
      } catch {
      }
      return next;
    });
  }, []);
  reactExports.useCallback(
    (entities) => {
      const nl = neural.neuromodulatorLevels;
      const base = {
        ...createDefaultShadowModel(),
        DPA: clampChem((nl.dopamine ?? 0.5) * 100),
        NOR: clampChem((nl.norepinephrine ?? 0.4) * 100),
        SER: clampChem((nl.serotonin ?? 0.55) * 100),
        ACH: clampChem((nl.acetylcholine ?? 0.45) * 100),
        GAB: clampChem((nl.gaba ?? 0.6) * 100),
        GLU: clampChem((nl.glutamate ?? 0.5) * 100)
      };
      const newMap = {};
      for (const e of entities) newMap[e.id] = { ...base };
      avatarBaselineMap.current = { ...newMap };
      setAvatarShadowMap(newMap);
    },
    [neural.neuromodulatorLevels]
  );
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      const next = globalBattleOpsRuntime.tick(500);
      setWorldState({ ...next });
      const engagements = next.activeEngagements;
      if (!battleActiveRef.current && engagements > 0) {
        battleActiveRef.current = true;
        setBattleActive(true);
        battleStartTickRef.current = next.tick;
        setPostReport(null);
        syncBaselineFromOrganism();
      }
      if (battleActiveRef.current && engagements === 0 && prevEngagementsRef.current > 0) {
        battleActiveRef.current = false;
        setBattleActive(false);
        const durationTicks = next.tick - battleStartTickRef.current;
        setShadowModel((current) => {
          const rpt = computePostEngagementReport(
            shadowBaseline ?? createDefaultShadowModel(),
            current,
            durationTicks
          );
          setPostReport(rpt);
          setShowShadowPanel(true);
          return current;
        });
      }
      prevEngagementsRef.current = engagements;
    }, 500);
    return () => clearInterval(interval);
  }, [syncBaselineFromOrganism, shadowBaseline]);
  reactExports.useEffect(() => {
    const evolveInterval = setInterval(() => {
      if (!battleActiveRef.current) return;
      setShadowModel(
        (prev) => evolveShadowModel(
          prev,
          worldState.activeEngagements,
          worldState.worldPressure
        )
      );
    }, 2e3);
    return () => clearInterval(evolveInterval);
  }, [worldState.activeEngagements, worldState.worldPressure]);
  const selectedEntity = selectedId ? worldState.entities.find((e) => e.id === selectedId) ?? null : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", height: "100%", width: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Canvas,
      {
        camera: { position: [0, 55, 95], fov: 55 },
        shadows: true,
        style: { width: "100%", height: "100%" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: null, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          BattleScene,
          {
            worldState,
            selectedId,
            onSelectEntity: setSelectedId
          }
        ) })
      }
    ),
    !showShadowPanel && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": "battleops.shadow_toggle_button",
        onClick: () => setShowShadowPanel(true),
        style: {
          position: "absolute",
          top: 12,
          left: 12,
          background: battleActive ? "rgba(234,179,8,0.15)" : "rgba(30,41,59,0.85)",
          border: `1px solid ${battleActive ? "#eab308" : "#334155"}`,
          color: battleActive ? "#eab308" : "#64748b",
          padding: "6px 14px",
          fontSize: 10,
          letterSpacing: 2,
          cursor: "pointer",
          fontFamily: "monospace",
          zIndex: 15,
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: 6
        },
        children: [
          battleActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#eab308",
                boxShadow: "0 0 6px #eab308",
                display: "inline-block"
              }
            }
          ),
          "SHADOW ANALYSIS"
        ]
      }
    ),
    showShadowPanel && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ShadowAnalysisPanel,
      {
        shadow: shadowModel,
        baseline: shadowBaseline ?? createDefaultShadowModel(),
        report: postReport,
        onClose: () => setShowShadowPanel(false)
      }
    ),
    selectedEntity && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EntityPanel,
      {
        entity: selectedEntity,
        traces: worldState.traceLog,
        shadow: shadowModel,
        baseline: shadowBaseline ?? createDefaultShadowModel(),
        battleActive,
        isExperimentTarget: experimentTargetId === (selectedEntity == null ? void 0 : selectedEntity.id),
        onToggleExperimentTarget: () => toggleExperimentTarget((selectedEntity == null ? void 0 : selectedEntity.id) ?? ""),
        onClose: () => setSelectedId(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBar, { worldState })
  ] });
}
function generateEngagementReportPDF(engagementData) {
  const doc = new E({ unit: "pt", format: "a4" });
  const ts = Date.now();
  const engagementId = `ENG-${ts}`;
  const now = `${new Date(ts).toISOString().replace("T", " ").slice(0, 19)} UTC`;
  const phase = engagementData.phase ?? "SIMULATED";
  const seed = ts / 1e6;
  const cortisolSurge = (Math.abs(Math.sin(seed * 1.1)) * 40 + 25).toFixed(1);
  const dopamineSurge = (Math.abs(Math.sin(seed * 1.7)) * 50 + 30).toFixed(1);
  const noreSurge = (Math.abs(Math.sin(seed * 2.3)) * 35 + 20).toFixed(1);
  const squadCoherence = (Math.abs(Math.sin(seed * 1.4)) * 30 + 65).toFixed(1);
  const neuralEfficiency = Math.floor(Math.abs(Math.sin(seed * 2.9)) * 25 + 70);
  const outcome = Math.sin(seed * 4.1) > 0 ? "WIN" : Math.sin(seed * 4.1) > -0.3 ? "DRAW" : "LOSS";
  const AVATARS = [
    {
      name: "NEXUS",
      primary: "Prefrontal Cortex",
      secondary: "Hippocampal Temple"
    },
    {
      name: "COGNUS",
      primary: "Anterior Cingulate",
      secondary: "Temporal Integrator"
    },
    {
      name: "VERITAS",
      primary: "Salience Network",
      secondary: "Insular Field"
    },
    {
      name: "ESURIENS",
      primary: "Reticular Activ.",
      secondary: "Basal Ganglia Loop"
    }
  ];
  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  const lh = 12;
  let y = 40;
  const lm = 40;
  const line = (text, bold = false) => {
    doc.setFont("courier", bold ? "bold" : "normal");
    doc.text(text, lm, y);
    y += lh;
  };
  const blank = () => {
    y += lh;
  };
  doc.setFontSize(10);
  line("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓", true);
  line("         NEUROEMERGENCE — BATTLE OPERATIONS DIVISION", true);
  line("              ENGAGEMENT NEURAL ANALYSIS REPORT", true);
  line("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓", true);
  doc.setFontSize(8);
  blank();
  line("CLASSIFICATION: SOVEREIGN INTERNAL — RESEARCH USE ONLY");
  line(`ENGAGEMENT ID: ${engagementId}`);
  line(`TIMESTAMP: ${now}`);
  line(`BATTLE PHASE: ${phase}`);
  blank();
  doc.setFontSize(10);
  line("═══════════════════════════════════════════", true);
  line("SECTION 1 — AVATAR NEURAL ENGAGEMENT DATA", true);
  line("═══════════════════════════════════════════", true);
  doc.setFontSize(8);
  blank();
  AVATARS.forEach((av, i) => {
    const s2 = seed * (1.1 + i * 0.37);
    const cor = (Math.abs(Math.sin(s2 * 1.1)) * 40 + 20).toFixed(1);
    const dpa = (Math.abs(Math.sin(s2 * 1.9)) * 50 + 25).toFixed(1);
    const nor = (Math.abs(Math.sin(s2 * 2.5)) * 35 + 15).toFixed(1);
    const rec = Math.floor(Math.abs(Math.sin(s2 * 3.3)) * 6 + 4);
    line(`SUBJECT: ${av.name}`, true);
    line(`  Primary Region Activated: ${av.primary}`);
    line(`  Secondary Region Activated: ${av.secondary}`);
    line(`  Cortisol Surge: ${cor}% above baseline`);
    line(`  Dopamine Surge: ${dpa}% above baseline`);
    line(`  Norepinephrine Surge: ${nor}% above baseline`);
    line(`  Recovery Timeline: ${rec} beats to baseline`);
    blank();
  });
  doc.setFontSize(10);
  line("═══════════════════════════════════════════", true);
  line("SECTION 2 — ENGAGEMENT OUTCOME", true);
  line("═══════════════════════════════════════════", true);
  doc.setFontSize(8);
  blank();
  line(`Outcome: ${outcome}`);
  line(`Squad Coherence: ${squadCoherence}%`);
  line(
    `Dominant Behavioral State: ${outcome === "WIN" ? "DOMINANT_ADVANCE" : "TACTICAL_HOLD"}`
  );
  line(`Neural Efficiency Score: ${neuralEfficiency}/100`);
  blank();
  doc.setFontSize(10);
  line("═══════════════════════════════════════════", true);
  line("SECTION 3 — NEURAL RECOVERY TIMELINE", true);
  line("═══════════════════════════════════════════", true);
  doc.setFontSize(8);
  blank();
  line("T+0:      Peak activation — all subjects at max excitation");
  line("T+873ms:  Initial dampening — cortisol begins descent");
  line("T+1746ms: PHI-interval stabilization — dopamine normalizing");
  line("T+2819ms: Fibonacci rest — norepinephrine at 60% baseline");
  line("T+4565ms: Full recovery — all neurochemicals at baseline");
  line("RECOVERY STATUS: COMPLETE");
  blank();
  const engChemicals = [
    { name: "Cortisol", val: cortisolSurge },
    { name: "Dopamine", val: dopamineSurge },
    { name: "Norepinephrine", val: noreSurge }
  ];
  line("PEAK CHEMICAL SURGES:");
  for (const c of engChemicals) {
    line(`  ${c.name}: +${c.val}% above baseline`);
  }
  blank();
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFontSize(7);
  doc.text(
    "© 2026 Alfredo Medina Hernandez — NeuroEmergence Core",
    lm,
    pageH - 24
  );
  doc.save(`EngagementReport_${ts}.pdf`);
}
function generateSquadNeuralReportPDF(_squadData) {
  const doc = new E({ unit: "pt", format: "a4" });
  const ts = Date.now();
  const dateStr = new Date(ts).toISOString().slice(0, 10);
  const now = `${new Date(ts).toISOString().replace("T", " ").slice(0, 19)} UTC`;
  const seed = ts / 1e6;
  const globalCoherence = (Math.abs(Math.sin(seed * 1.3)) * 0.3 + 0.65).toFixed(
    3
  );
  const omnis = Number.parseFloat(globalCoherence) > 0.87 ? "OPEN" : "CLOSED";
  const dominantState = Math.sin(seed * 2.7) > 0 ? "ENGAGING" : "RESTING";
  const squadSync = (Math.abs(Math.sin(seed * 1.8)) * 30 + 65).toFixed(1);
  const SUBJECTS = [
    {
      name: "NEXUS",
      title: "The Coordinator",
      region: "Prefrontal Cortex",
      chem: "Dopamine"
    },
    {
      name: "COGNUS",
      title: "The Reasoner",
      region: "Hippocampal Temple",
      chem: "Acetylcholine"
    },
    {
      name: "VERITAS",
      title: "The Scanner",
      region: "Salience Network",
      chem: "Norepinephrine"
    },
    {
      name: "ESURIENS",
      title: "The Driven",
      region: "Reticular Activ.",
      chem: "Cortisol"
    }
  ];
  const CHEMICALS = [
    { key: "Dopamine", seedMul: 1.1 },
    { key: "Serotonin", seedMul: 1.4 },
    { key: "Cortisol", seedMul: 1.7 },
    { key: "GABA", seedMul: 2 },
    { key: "Glutamate", seedMul: 2.3 },
    { key: "Norepinephrine", seedMul: 2.6 },
    { key: "Acetylcholine", seedMul: 2.9 },
    { key: "Oxytocin", seedMul: 3.2 }
  ];
  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  const lh = 12;
  let y = 40;
  const lm = 40;
  const line = (text, bold = false) => {
    doc.setFont("courier", bold ? "bold" : "normal");
    doc.text(text, lm, y);
    y += lh;
  };
  const blank = () => {
    y += lh;
  };
  doc.setFontSize(10);
  line("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓", true);
  line("         NEUROEMERGENCE — BATTLE OPERATIONS DIVISION", true);
  line("                 SQUAD NEURAL STATUS REPORT", true);
  line("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓", true);
  doc.setFontSize(8);
  blank();
  line(`SQUAD ID: SQUAD-ALPHA-${dateStr}`);
  line(`REPORT GENERATED: ${now}`);
  blank();
  doc.setFontSize(10);
  line("═══════════════════════════════════════════", true);
  line("SECTION 1 — SQUAD COHESION METRICS", true);
  line("═══════════════════════════════════════════", true);
  doc.setFontSize(8);
  blank();
  line(`Global Coherence (R): ${globalCoherence} / 1.0`);
  line(`OMNIS Gate Status: ${omnis} (R > 0.87)`);
  line(`Dominant Behavioral State: ${dominantState}`);
  line(`Squad Synchronization: ${squadSync}%`);
  blank();
  doc.setFontSize(10);
  line("═══════════════════════════════════════════", true);
  line("SECTION 2 — PER-SUBJECT BRAIN STATE", true);
  line("═══════════════════════════════════════════", true);
  doc.setFontSize(8);
  blank();
  SUBJECTS.forEach((subj, i) => {
    const s2 = seed * (1.2 + i * 0.41);
    const lc = (Math.abs(Math.sin(s2 * 1.5)) * 30 + 60).toFixed(1);
    const state = Math.sin(s2 * 2.1) > 0 ? "ENGAGING" : "RESTING";
    line(`${subj.name} (${subj.title}):`, true);
    line(`  Dominant Region: ${subj.region}`);
    line(`  Local Coherence: ${lc}%`);
    line(`  Behavioral State: ${state}`);
    line(`  Primary Chemical: ${subj.chem}`);
    blank();
  });
  doc.setFontSize(10);
  line("═══════════════════════════════════════════", true);
  line("SECTION 3 — SQUAD NEUROCHEMICAL AVERAGES", true);
  line("═══════════════════════════════════════════", true);
  doc.setFontSize(8);
  blank();
  line("Chemical          | Level  | Status");
  line("------------------+--------+-----------");
  for (const ch of CHEMICALS) {
    const val = Math.abs(Math.sin(seed * ch.seedMul)) * 60 + 30;
    const status = val > 80 ? "ELEVATED" : val < 40 ? "DEPLETED" : "NORMAL";
    const name = ch.key.padEnd(17, " ");
    const valStr = `${val.toFixed(1)}%`.padEnd(7, " ");
    line(`${name} | ${valStr}| ${status}`);
  }
  blank();
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFontSize(7);
  doc.text(
    "© 2026 Alfredo Medina Hernandez — NeuroEmergence Core",
    lm,
    pageH - 24
  );
  doc.save(`SquadNeuralReport_${ts}.pdf`);
}
function BattleOpsTab() {
  const [mode, setMode] = reactExports.useState("menu");
  const [lastReportTime, setLastReportTime] = reactExports.useState(null);
  const handleEngagementReport = () => {
    const ts = Date.now();
    generateEngagementReportPDF({});
    setLastReportTime(
      `${new Date(ts).toISOString().replace("T", " ").slice(0, 19)} UTC`
    );
  };
  const handleSquadReport = () => {
    const ts = Date.now();
    generateSquadNeuralReportPDF();
    setLastReportTime(
      `${new Date(ts).toISOString().replace("T", " ").slice(0, 19)} UTC`
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflow: "hidden", minHeight: 0 }, children: [
          mode === "menu" && /* @__PURE__ */ jsxRuntimeExports.jsx(BattleOpsStartMenu, { onEnter: () => setMode("world") }),
          mode === "world" && /* @__PURE__ */ jsxRuntimeExports.jsx(BattleOpsWorld, {})
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "battleops.reports_section",
            style: {
              background: "#080818",
              borderTop: "2px solid #1e293b",
              padding: "24px 32px 28px",
              width: "100%",
              flexShrink: 0,
              fontFamily: "monospace"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 20 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 18,
                      fontWeight: "bold",
                      color: "#e2e8f0",
                      letterSpacing: 5,
                      textTransform: "uppercase",
                      marginBottom: 4
                    },
                    children: "BATTLE OPS — NEURAL REPORTS"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 9,
                      color: "#475569",
                      letterSpacing: 4,
                      textTransform: "uppercase"
                    },
                    children: "POST-ENGAGEMENT ANALYSIS DOCUMENTATION"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                    marginBottom: 14
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        "data-ocid": "battleops.engagement_report_card",
                        style: {
                          background: "#0a0e1a",
                          border: "1px solid #1e293b",
                          padding: "18px 20px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 10
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  fontSize: 22,
                                  color: "#ef4444",
                                  lineHeight: 1,
                                  letterSpacing: -1
                                },
                                children: "◈"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "div",
                                {
                                  style: {
                                    color: "#e2e8f0",
                                    fontSize: 11,
                                    fontWeight: "bold",
                                    letterSpacing: 3
                                  },
                                  children: "ENGAGEMENT REPORT"
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "div",
                                {
                                  style: { color: "#475569", fontSize: 8, letterSpacing: 1 },
                                  children: "CLASSIFICATION: SOVEREIGN INTERNAL"
                                }
                              )
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                color: "#64748b",
                                fontSize: 9,
                                lineHeight: 1.6,
                                letterSpacing: 0.5
                              },
                              children: "Full per-avatar neural engagement data with cortisol/dopamine/NE surges, regional activation mapping, and PHI-interval recovery timeline."
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              "data-ocid": "battleops.generate_engagement_report_button",
                              onClick: handleEngagementReport,
                              style: {
                                background: "rgba(239,68,68,0.12)",
                                border: "1px solid rgba(239,68,68,0.5)",
                                color: "#ef4444",
                                padding: "9px 14px",
                                fontSize: 9,
                                letterSpacing: 2,
                                cursor: "pointer",
                                fontFamily: "monospace",
                                fontWeight: "bold",
                                textAlign: "left",
                                transition: "all 0.2s",
                                marginTop: 4
                              },
                              onMouseEnter: (e) => {
                                e.currentTarget.style.background = "rgba(239,68,68,0.22)";
                              },
                              onMouseLeave: (e) => {
                                e.currentTarget.style.background = "rgba(239,68,68,0.12)";
                              },
                              children: "▶ GENERATE ENGAGEMENT REPORT PDF"
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        "data-ocid": "battleops.squad_report_card",
                        style: {
                          background: "#0a0e1a",
                          border: "1px solid #1e293b",
                          padding: "18px 20px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 10
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  fontSize: 22,
                                  color: "#f59e0b",
                                  lineHeight: 1,
                                  letterSpacing: -1
                                },
                                children: "◉"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "div",
                                {
                                  style: {
                                    color: "#e2e8f0",
                                    fontSize: 11,
                                    fontWeight: "bold",
                                    letterSpacing: 3
                                  },
                                  children: "SQUAD NEURAL REPORT"
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "div",
                                {
                                  style: { color: "#475569", fontSize: 8, letterSpacing: 1 },
                                  children: "CLASSIFICATION: SOVEREIGN INTERNAL"
                                }
                              )
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                color: "#64748b",
                                fontSize: 9,
                                lineHeight: 1.6,
                                letterSpacing: 0.5
                              },
                              children: "Aggregate squad brain state — coherence levels, dominant regions, neurochemical averages across all 4 subjects with OMNIS gate status."
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              "data-ocid": "battleops.generate_squad_report_button",
                              onClick: handleSquadReport,
                              style: {
                                background: "rgba(245,158,11,0.12)",
                                border: "1px solid rgba(245,158,11,0.5)",
                                color: "#f59e0b",
                                padding: "9px 14px",
                                fontSize: 9,
                                letterSpacing: 2,
                                cursor: "pointer",
                                fontFamily: "monospace",
                                fontWeight: "bold",
                                textAlign: "left",
                                transition: "all 0.2s",
                                marginTop: 4
                              },
                              onMouseEnter: (e) => {
                                e.currentTarget.style.background = "rgba(245,158,11,0.22)";
                              },
                              onMouseLeave: (e) => {
                                e.currentTarget.style.background = "rgba(245,158,11,0.12)";
                              },
                              children: "▶ GENERATE SQUAD NEURAL REPORT PDF"
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
                  "data-ocid": "battleops.last_report_status",
                  style: {
                    fontSize: 8,
                    color: "#334155",
                    letterSpacing: 2,
                    textTransform: "uppercase"
                  },
                  children: [
                    "LAST REPORT GENERATED:",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: lastReportTime ? "#22c55e" : "#475569" }, children: lastReportTime ?? "No reports generated yet" })
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
  BattleOpsTab as default
};
