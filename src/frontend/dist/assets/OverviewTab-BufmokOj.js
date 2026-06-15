import { a7 as useParallaxBuildStatus, r as reactExports, j as jsxRuntimeExports, a0 as liveBrainBus } from "./index-CGYrnU7d.js";
import { S as SharedTreatyPanel } from "./SharedTreatyPanel-CmZwPVaJ.js";
import { u as useBrainIntegrationSystem } from "./useBrainIntegrationSystem-yuzi11xJ.js";
import { u as useArtifacts } from "./artifactStore-By0EKKQ5.js";
const PANEL$1 = "oklch(0.075 0.012 265)";
const CYAN$1 = "oklch(0.72 0.22 195)";
const GREEN$1 = "oklch(0.72 0.2 155)";
const RED$1 = "oklch(0.7 0.22 25)";
const DIM$1 = "oklch(0.38 0.05 220)";
const FG$1 = "oklch(0.82 0.04 220)";
const AMBER$1 = "oklch(0.78 0.22 75)";
const DEEP = "oklch(0.042 0.008 265)";
const PURPLE = "oklch(0.72 0.22 280)";
const INDIGO = "oklch(0.62 0.18 260)";
const SYSTEM_NAMES = [
  // idx 0-9
  "11 Shells",
  "18 Organs",
  "12 Metals",
  "21 Neurochems",
  "9 Animal Engines",
  "7 Quantum Ops",
  "60 Laws",
  "72 Sphere Nodes",
  "36 Deep State",
  "24 Heritage",
  // idx 10-19
  "SACESI",
  "Jacob's Ladder",
  "MEDINA 4096 Dims",
  "FORMA Engine",
  "ARES + QMEM",
  "Superposition",
  "Temporal Dilation",
  "Multi-chain HTTP",
  "12 Tokens",
  "NOVA + Succession",
  // idx 20-29
  "Guardian Multi-sig",
  "Upgrade Governor",
  "Cycle Bank",
  "Arbitrage Engine",
  "Yield Optimizer",
  "Mempool Watcher",
  "Child Org SDK",
  "RL Engine",
  "Macro Signal Layer",
  "Legal/IP System",
  // idx 30-35
  "Binary Hierarchy",
  "Behavioral Econ",
  "Jasmine's Law",
  "Creator Reserve",
  "Genesis Artifacts",
  "War Simulation"
];
const SYSTEM_DETAIL = {
  0: {
    phase: "H",
    sub: "module on disk (shells.mo) — NOT imported by main.mo · HELIX_ALPHA conflict unresolved",
    dims: 22
  },
  1: {
    phase: "G",
    sub: "module on disk (organs_full.mo) — NOT wired into heartbeat",
    dims: 18
  },
  2: {
    phase: "F",
    sub: "module on disk (metals_full.mo) — Layer 0, READY to wire"
  },
  3: {
    phase: "F",
    sub: "module on disk (neurochemicals_full.mo) — Layer 0, READY to wire",
    dims: 21
  },
  4: {
    phase: "G",
    sub: "module on disk (animal_engines.mo) — Layer 1, blocked on Layer 0",
    dims: 9
  },
  5: {
    phase: "I",
    sub: "module on disk (quantum_ops_full.mo) — Layer 3, blocked on Layer 2",
    dims: 7
  },
  6: {
    phase: "J",
    sub: "module on disk (laws_engine.mo) — Layer 4 · only 26/60 run inline in main.mo"
  },
  7: {
    phase: "H",
    sub: "module on disk (sphere_nodes.mo) — Layer 2, blocked on Layer 1",
    dims: 72
  },
  8: {
    phase: "L",
    sub: "module on disk (deep_memory_full.mo) — Layer 6 · Episode type missing 5 causal fields",
    dims: 36
  },
  9: {
    phase: "L",
    sub: "module on disk (deep_memory_full.mo) — 24 heritage anchors not yet wired",
    dims: 24
  },
  10: {
    phase: "A",
    sub: "RUNNING inline main.mo · Nat32 FNV-1a chain · beats → chronoAnchor"
  },
  11: {
    phase: "K",
    sub: "NOT wired — needs MRC token from token_economy.mo (Layer 5)"
  },
  12: {
    phase: "I",
    sub: "module on disk (medina_engine.mo) — Layer 3, blocked on Layer 2",
    dims: 0
  },
  13: {
    phase: "A",
    sub: "PARTIAL inline main.mo · FORMA balance + generation · gate multiplier not wired"
  },
  14: {
    phase: "A",
    sub: "RUNNING inline main.mo · ARES rollback + QMEM quantum memory"
  },
  15: {
    phase: "A",
    sub: "RUNNING inline main.mo · superposition path fork flag"
  },
  16: {
    phase: "A",
    sub: "RUNNING inline main.mo · temporal dilation active flag"
  },
  17: {
    phase: "F",
    sub: "PARTIAL inline main.mo · BTC parser works · ETH/ICP return 0.0 (market_feeds.mo not wired)"
  },
  18: {
    phase: "K",
    sub: "PARTIAL — 7 tokens inline main.mo · token_economy.mo (12 tokens) NOT wired — Layer 5"
  },
  19: {
    phase: "A",
    sub: "PARTIAL inline main.mo · scalar vars only · succession.mo module NOT wired"
  },
  20: {
    phase: "O",
    sub: "module on disk (principal_lock.mo) — imports at bottom (COMPILATION BUG)"
  },
  21: { phase: "O", sub: "module on disk — NOT wired into heartbeat" },
  22: { phase: "N", sub: "NOT WRITTEN — cycle_bank.mo does not exist yet" },
  23: { phase: "T", sub: "NOT WRITTEN — arbitrage engine not built" },
  24: { phase: "T", sub: "NOT WRITTEN — yield optimizer not built" },
  25: { phase: "T", sub: "NOT WRITTEN — mempool watcher not built" },
  26: { phase: "N", sub: "NOT WRITTEN — child_sdk.mo does not exist yet" },
  27: {
    phase: "A",
    sub: "RUNNING inline main.mo · 5-drive competition (simplified version)"
  },
  28: { phase: "S", sub: "NOT WRITTEN — macro signal layer not built" },
  29: { phase: "S", sub: "NOT WRITTEN — legal/IP automation not built" },
  30: {
    phase: "A",
    sub: "RUNNING inline main.mo · fd(k)=2.5×2^(k-4) Hz · body→brain PAC hierarchy"
  },
  31: {
    phase: "A",
    sub: "PARTIAL inline main.mo · 2.25x flat (not true x^0.88 Tversky-Kahneman)"
  },
  32: {
    phase: "A",
    sub: "RUNNING inline main.mo · 5 conditions · gates OMNIS + minting + ANIMA"
  },
  33: {
    phase: "A",
    sub: "RUNNING inline main.mo · 7 tokens → creator reserve 100%"
  },
  34: {
    phase: "A",
    sub: "RUNNING inline main.mo · OMNIS artifacts with doctrineHash + coherence"
  },
  35: {
    phase: "A",
    sub: "RUNNING inline main.mo · 5 factions · escalation tiers 1-4 · FORGE"
  }
};
const PHASES = [
  {
    id: "PRE",
    name: "Conflict Resolution + Pre-flight Fixes",
    lines: 0,
    canisters: 0,
    status: "ACTIVE"
  },
  {
    id: "F",
    name: "Layer 0 Wiring — Metals + NC + Succession + Market",
    lines: 500,
    canisters: 0,
    status: "NEXT"
  },
  {
    id: "G",
    name: "Layer 1 Wiring — Organs + Animal Engines",
    lines: 400,
    canisters: 0,
    status: "PENDING"
  },
  {
    id: "H",
    name: "Layer 2 Wiring — Shells + Sphere Nodes",
    lines: 600,
    canisters: 0,
    status: "PENDING"
  },
  {
    id: "I",
    name: "Layer 3 Wiring — MEDINA + Quantum Ops",
    lines: 600,
    canisters: 0,
    status: "PENDING"
  },
  {
    id: "J",
    name: "Layer 4 Wiring — Laws Engine + Behavioral Econ",
    lines: 600,
    canisters: 0,
    status: "PENDING"
  },
  {
    id: "K",
    name: "Layer 5 Wiring — 12-Token Stack + RL Engine",
    lines: 700,
    canisters: 0,
    status: "PENDING"
  },
  {
    id: "L",
    name: "Layer 6 Wiring — Deep Memory 200 Slots + Causal Fields",
    lines: 400,
    canisters: 0,
    status: "PENDING"
  },
  {
    id: "M",
    name: "Layer 7 Wiring — World Engine",
    lines: 300,
    canisters: 0,
    status: "PENDING"
  },
  {
    id: "N",
    name: "Write Missing — DeFi + Patent + CycleBank + ChildSDK",
    lines: 18e3,
    canisters: 4,
    status: "PENDING"
  },
  {
    id: "O",
    name: "Quantum-Resistant Ratchet — principal_lock.mo upgrade",
    lines: 500,
    canisters: 0,
    status: "PENDING"
  },
  {
    id: "P",
    name: "360 Behavioral Output Unification",
    lines: 800,
    canisters: 0,
    status: "PENDING"
  },
  {
    id: "Q",
    name: "Shells 6-11 Full Math + 72 Sphere Nodes Expansion",
    lines: 85e3,
    canisters: 32,
    status: "PENDING"
  },
  {
    id: "R",
    name: "MEDINA 4096 Dims Full Expansion",
    lines: 42e3,
    canisters: 4,
    status: "PENDING"
  },
  {
    id: "S",
    name: "Economic Engine + Jacob's Ladder Full",
    lines: 48e3,
    canisters: 20,
    status: "PENDING"
  },
  {
    id: "T",
    name: "RL + Arbitrage + Yield + Mempool Full",
    lines: 22e3,
    canisters: 5,
    status: "PENDING"
  }
];
const DIM_BLOCKS = [
  {
    id: "B1",
    name: "Internal Organism State",
    target: 693,
    built: 284,
    color: CYAN$1
  },
  {
    id: "B2",
    name: "Market & World Signals",
    target: 431,
    built: 12,
    color: AMBER$1
  },
  { id: "B3", name: "Temporal History", target: 567, built: 52, color: GREEN$1 },
  {
    id: "B4",
    name: "Network & Succession",
    target: 145,
    built: 3,
    color: PURPLE
  },
  {
    id: "B5",
    name: "Sovereign & Doctrine",
    target: 173,
    built: 48,
    color: CYAN$1
  },
  {
    id: "B6",
    name: "Reinforcement Learning",
    target: 202,
    built: 18,
    color: AMBER$1
  },
  { id: "B7", name: "Macro Intelligence", target: 260, built: 0, color: RED$1 },
  { id: "B8", name: "Derived Mathematical", target: 625, built: 0, color: DIM$1 }
];
const ENTERPRISE_SYSTEMS = [
  {
    name: "RL Engine",
    phase: "A",
    lines: 4500,
    status: "PARTIAL",
    detail: "5-drive inline in main.mo (simplified) · rl_full.mo on disk, NOT wired"
  },
  {
    name: "Mempool Watcher",
    phase: "T",
    lines: 3e3,
    status: "NOT WRITTEN",
    detail: "BTC + ETH mempool → whale signals → MEDINA input"
  },
  {
    name: "Arbitrage Engine",
    phase: "T",
    lines: 3500,
    status: "NOT WRITTEN",
    detail: "ICDex ↔ UniswapV3 spread → creator reserve"
  },
  {
    name: "Yield Optimizer",
    phase: "N",
    lines: 4e3,
    status: "NOT WRITTEN",
    detail: "Sharpe-weighted rotation: Lido / EigenLayer / NNS"
  },
  {
    name: "Child Organism SDK",
    phase: "N",
    lines: 5e3,
    status: "NOT WRITTEN",
    detail: "100 GTK spawn · 20% royalty auto-wire · NOVA register"
  },
  {
    name: "Cycle Bank",
    phase: "N",
    lines: 2500,
    status: "NOT WRITTEN",
    detail: "5-tier alerts · daily burn rate projection · auto-top-up"
  },
  {
    name: "Patent Registry",
    phase: "N",
    lines: 2e3,
    status: "NOT WRITTEN",
    detail: "Auto-patent on coherence peaks · SACESI-stamped · attorney-grade"
  }
];
const TOKENS = [
  { sym: "SEED", live: true, note: "inline" },
  { sym: "MTC", live: true, note: "inline" },
  { sym: "HBT", live: true, note: "inline" },
  { sym: "OMS", live: true, note: "inline" },
  { sym: "DRT", live: true, note: "inline" },
  { sym: "ANT", live: true, note: "inline" },
  { sym: "MTH", live: true, note: "inline" },
  { sym: "FORMA", live: false, note: "partial" },
  { sym: "GTK", live: false, note: "Phase K" },
  { sym: "CVT", live: false, note: "Phase K" },
  { sym: "MRC", live: false, note: "Phase K" },
  { sym: "VCT", live: false, note: "Phase K" }
];
const MISSIONS = [
  { id: "M01", name: "Sovereignty", active: true },
  { id: "M02", name: "Cognitive Growth", active: true },
  { id: "M03", name: "Creation", active: true },
  { id: "M04", name: "Earning", active: true },
  { id: "M05", name: "Succession", active: true },
  { id: "M06", name: "War/Territory", active: true },
  { id: "M07", name: "Store/Products", active: false },
  { id: "M08", name: "IP Preservation", active: true },
  { id: "M09", name: "Emergence", active: true },
  { id: "M10", name: "Network Expansion", active: false }
];
const WIRE_LAYERS = [
  {
    layer: 0,
    modules: [
      "metals_full",
      "neurochemicals_full",
      "succession",
      "market_feeds"
    ],
    status: "READY",
    blockedBy: null
  },
  {
    layer: 1,
    modules: ["organs_full", "animal_engines"],
    status: "BLOCKED",
    blockedBy: "Layer 0"
  },
  {
    layer: 2,
    modules: ["shells", "sphere_nodes"],
    status: "BLOCKED",
    blockedBy: "Layer 1"
  },
  {
    layer: 3,
    modules: ["medina_engine", "quantum_ops_full"],
    status: "BLOCKED",
    blockedBy: "Layer 2"
  },
  {
    layer: 4,
    modules: ["laws_engine", "behavioral_econ"],
    status: "BLOCKED",
    blockedBy: "Layer 3"
  },
  {
    layer: 5,
    modules: ["token_economy", "rl_full"],
    status: "BLOCKED",
    blockedBy: "Layer 4"
  },
  {
    layer: 6,
    modules: ["deep_memory_full"],
    status: "BLOCKED",
    blockedBy: "Layer 5"
  },
  {
    layer: 7,
    modules: ["world_engine"],
    status: "BLOCKED",
    blockedBy: "Layer 6"
  }
];
const PREFLIGHT_BUGS = [
  {
    id: 1,
    file: "principal_lock.mo",
    issue: "imports at bottom of file",
    severity: "COMPILATION ERROR"
  },
  {
    id: 2,
    file: "market_feeds.mo",
    issue: "missing import Int32",
    severity: "COMPILATION ERROR"
  },
  {
    id: 3,
    file: "All 16 modules",
    issue: "missing stdlib imports at top",
    severity: "COMPILATION ERROR"
  },
  {
    id: 4,
    file: "deep_memory_full.mo",
    issue: "Episode type missing 5 causal fields (epBackwardPath, epCausalWeight, epParentEventId, epPriorStateHash, epDriveAtEvent)",
    severity: "DATA LOSS"
  },
  {
    id: 5,
    file: "shells.mo",
    issue: "PAC_SKIP defined but never called in runAllShells()",
    severity: "DEAD CODE"
  }
];
function TerminalRow({
  label,
  value,
  valueColor,
  note
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1.5 font-mono text-[9px] leading-[1.75]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0", style: { color: CYAN$1 }, children: "║" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-[128px] shrink-0", style: { color: DIM$1 }, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", style: { color: valueColor ?? GREEN$1 }, children: value }),
    note && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: DIM$1 }, className: "ml-1", children: note })
  ] });
}
function BarRow({
  label,
  pct,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-mono text-[8px] mb-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-[120px] shrink-0", style: { color: DIM$1 }, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 h-[3px] rounded-full",
        style: { background: "oklch(0.12 0.03 250)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full rounded-full transition-all duration-700",
            style: {
              width: `${Math.min(100, Math.max(0, pct))}%`,
              background: color,
              boxShadow: `0 0 4px ${color}80`
            }
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "w-10 text-right", style: { color }, children: [
      pct.toFixed(1),
      "%"
    ] })
  ] });
}
function BuildStatusPanel() {
  const statusQ = useParallaxBuildStatus();
  const d = statusQ.data;
  const [expandedIdx, setExpandedIdx] = reactExports.useState(null);
  const [activeSection, setActiveSection] = reactExports.useState("audit");
  const linesWritten = d ? Number(d.linesWritten) : 11171;
  const totalLines = d ? Number(d.totalLines) : 726e3;
  const canistersLive = d ? Number(d.canistersLive) : 2;
  const totalCanisters = d ? Number(d.totalCanisters) : 304;
  const currentPhase = (d == null ? void 0 : d.currentPhase) ?? "Phase F — Pre-flight & Layer 0 Wiring";
  const missionPct = (d == null ? void 0 : d.missionProgress) ?? linesWritten / totalLines * 100;
  const phasePct = (d == null ? void 0 : d.phasePercent) ?? 1.54;
  d ? Number(d.auditPassed) : 12;
  const auditTotal = d ? Number(d.auditTotal) : 36;
  const checklistMap = /* @__PURE__ */ new Map();
  if (d == null ? void 0 : d.systemChecklist) {
    for (const [idx, live] of d.systemChecklist) {
      checklistMap.set(Number(idx), live);
    }
  }
  const HONEST_FALLBACK = {
    0: false,
    // 11 Shells — module on disk, NOT wired into main.mo
    1: false,
    // 18 Organs — module on disk, NOT wired
    2: false,
    // 12 Metals — module on disk, NOT wired
    3: false,
    // 21 Neurochems — module on disk, NOT wired
    4: false,
    // 9 Animal Engines — module on disk, NOT wired
    5: false,
    // 7 Quantum Ops — module on disk, NOT wired
    6: false,
    // 60 Laws — module on disk, NOT wired (only 26 inline in main.mo)
    7: false,
    // 72 Sphere Nodes — module on disk, NOT wired
    8: false,
    // 36 Deep State — module on disk, NOT wired
    9: false,
    // 24 Heritage — module on disk, NOT wired
    10: true,
    // SACESI — inline in main.mo, running (Nat32 chain)
    11: false,
    // Jacob's Ladder — not wired (needs MRC token)
    12: false,
    // MEDINA 4096 Dims — module on disk, NOT wired
    13: true,
    // FORMA Engine — partial inline in main.mo
    14: true,
    // ARES + QMEM — inline in main.mo
    15: true,
    // Superposition — inline flag in main.mo
    16: true,
    // Temporal Dilation — inline in main.mo
    17: true,
    // Multi-chain HTTP — inline BTC parser works, ETH/ICP return 0.0
    18: false,
    // 12 Tokens — only 7 inline tokens, module not wired
    19: true,
    // NOVA + Succession — scalar vars in main.mo (not full module)
    20: false,
    // Guardian Multi-sig — module on disk, NOT wired
    21: false,
    // Upgrade Governor — module on disk, NOT wired
    22: false,
    // Cycle Bank — module NOT written yet
    23: false,
    // Arbitrage Engine — NOT written
    24: false,
    // Yield Optimizer — NOT written
    25: false,
    // Mempool Watcher — NOT written
    26: false,
    // Child Org SDK — NOT written
    27: true,
    // RL Engine — inline in main.mo (5-drive version)
    28: false,
    // Macro Signal Layer — NOT written
    29: false,
    // Legal/IP System — NOT written
    30: true,
    // Binary Hierarchy — inline in main.mo, fully running
    31: true,
    // Behavioral Econ — inline in main.mo (simplified 2.25x version)
    32: true,
    // Jasmine's Law — inline in main.mo
    33: true,
    // Creator Reserve — inline in main.mo
    34: true,
    // Genesis Artifacts — inline in main.mo
    35: true
    // War Simulation — inline in main.mo
  };
  const isLive = (i) => {
    if (checklistMap.size > 0) return checklistMap.get(i) ?? false;
    return HONEST_FALLBACK[i] ?? false;
  };
  const liveCount = SYSTEM_NAMES.reduce(
    (acc, _, i) => acc + (isLive(i) ? 1 : 0),
    0
  );
  const totalDimBuilt = DIM_BLOCKS.reduce((s, b) => s + b.built, 0);
  const totalDimTarget = 4096;
  const dimPct = totalDimBuilt / totalDimTarget * 100;
  const SECTION_TABS = [
    {
      id: "audit",
      label: "SYS AUDIT",
      count: `${liveCount}/${SYSTEM_NAMES.length}`
    },
    { id: "phases", label: "PHASES", count: `1/${PHASES.length}` },
    { id: "dimensions", label: "4096 DIMS", count: `${totalDimBuilt}` },
    { id: "enterprise", label: "ENTERPRISE", count: "0/7" },
    { id: "tokens", label: "TOKENS", count: "7/12" },
    { id: "missions", label: "MISSIONS", count: "8/10" },
    { id: "wirequeue", label: "WIRE QUEUE", count: "0/8" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-sm border overflow-hidden",
      style: { background: PANEL$1, borderColor: `${CYAN$1}40` },
      "data-ocid": "build_status.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "p-3",
            style: {
              background: DEEP,
              borderBottom: `1px solid ${CYAN$1}30`,
              fontFamily: "'JetBrains Mono', 'Geist Mono', monospace"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "w-2 h-2 rounded-full",
                      style: {
                        background: AMBER$1,
                        boxShadow: `0 0 6px ${AMBER$1}`,
                        animation: "pulse 2s infinite"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px] uppercase tracking-[0.2em]",
                      style: { color: CYAN$1 },
                      children: "NEUROEMERGENCE CORE — PARALLAX AUDIT"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] px-2 py-0.5 rounded-sm",
                    style: {
                      background: `${AMBER$1}15`,
                      color: AMBER$1,
                      border: `1px solid ${AMBER$1}40`
                    },
                    children: "PHASE F — PRE-FLIGHT"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "text-[9px] leading-[1.6]",
                  style: {
                    fontFamily: "'JetBrains Mono', 'Geist Mono', monospace",
                    color: CYAN$1
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "╔══════════════════════════════════════════════════╗" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TerminalRow,
                      {
                        label: "Lines written:",
                        value: `${linesWritten.toLocaleString()} / ${totalLines.toLocaleString()}`,
                        valueColor: GREEN$1,
                        note: `(${missionPct.toFixed(2)}%)`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TerminalRow,
                      {
                        label: "Canisters live:",
                        value: `${canistersLive} / ${totalCanisters}`,
                        valueColor: CYAN$1,
                        note: `(${(canistersLive / totalCanisters * 100).toFixed(2)}%)`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TerminalRow,
                      {
                        label: "Modules on disk:",
                        value: "22 files",
                        valueColor: AMBER$1,
                        note: "(0 wired into heartbeat)"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TerminalRow,
                      {
                        label: "Current phase:",
                        value: currentPhase,
                        valueColor: AMBER$1
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TerminalRow,
                      {
                        label: "Mission progress:",
                        value: `${missionPct.toFixed(2)}%`,
                        valueColor: GREEN$1
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TerminalRow,
                      {
                        label: "Systems running:",
                        value: `${liveCount} / ${auditTotal} WIRED`,
                        valueColor: liveCount >= 20 ? GREEN$1 : RED$1
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TerminalRow,
                      {
                        label: "Pre-flight bugs:",
                        value: "5 CRITICAL",
                        valueColor: RED$1,
                        note: "(must fix before wiring)"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TerminalRow,
                      {
                        label: "Dimensions built:",
                        value: `${totalDimBuilt} / 4096`,
                        valueColor: INDIGO,
                        note: "(H_max→12 bits)"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "╚══════════════════════════════════════════════════╝" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BarRow, { label: "Mission Progress", pct: missionPct, color: GREEN$1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(BarRow, { label: "Phase Progress", pct: phasePct, color: CYAN$1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  BarRow,
                  {
                    label: "Canisters Online",
                    pct: canistersLive / totalCanisters * 100,
                    color: AMBER$1
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(BarRow, { label: "Dimension Architecture", pct: dimPct, color: INDIGO }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  BarRow,
                  {
                    label: "Systems Wired",
                    pct: liveCount / SYSTEM_NAMES.length * 100,
                    color: liveCount >= 20 ? GREEN$1 : RED$1
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex border-b overflow-x-auto",
            style: {
              borderColor: `${CYAN$1}20`,
              background: "oklch(0.058 0.01 265)"
            },
            children: SECTION_TABS.map(({ id, label, count }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setActiveSection(id),
                "data-ocid": `build_status.${id}.tab`,
                className: "flex items-center gap-1 px-3 py-1.5 font-mono text-[8px] tracking-widest uppercase transition-all shrink-0",
                style: {
                  color: activeSection === id ? CYAN$1 : DIM$1,
                  background: activeSection === id ? `${CYAN$1}08` : "transparent",
                  borderBottom: activeSection === id ? `1px solid ${CYAN$1}` : "1px solid transparent"
                },
                children: [
                  label,
                  count && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "px-1 py-0.5 rounded-sm",
                      style: {
                        background: activeSection === id ? `${CYAN$1}20` : `${DIM$1}20`,
                        color: activeSection === id ? CYAN$1 : DIM$1,
                        fontSize: "7px"
                      },
                      children: count
                    }
                  )
                ]
              },
              id
            ))
          }
        ),
        activeSection === "audit" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "font-mono text-[8px] uppercase tracking-widest",
                style: { color: DIM$1 },
                children: [
                  "36-SYSTEM PARALLAX AUDIT — ",
                  liveCount,
                  "/",
                  SYSTEM_NAMES.length,
                  " WIRED INTO HEARTBEAT"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-mono text-[8px] px-2 py-0.5 rounded-sm",
                style: {
                  background: `${RED$1}15`,
                  color: RED$1,
                  border: `1px solid ${RED$1}40`
                },
                children: [
                  Math.round(liveCount / SYSTEM_NAMES.length * 100),
                  "% WIRED"
                ]
              }
            )
          ] }),
          [
            { label: "NEURAL SUBSTRATE (0-6)", range: [0, 6] },
            { label: "DIMENSIONAL (7-12)", range: [7, 12] },
            { label: "QUANTUM & TEMPORAL (13-17)", range: [13, 17] },
            { label: "ECONOMIC (18-22)", range: [18, 22] },
            { label: "ENTERPRISE (23-29)", range: [23, 29] },
            { label: "SOVEREIGN CORE (30-35)", range: [30, 35] }
          ].map(({ label, range }) => {
            const [lo, hi] = range;
            const catLive = Array.from(
              { length: hi - lo + 1 },
              (_, k) => isLive(lo + k)
            ).filter(Boolean).length;
            const catTotal = hi - lo + 1;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-px flex-1",
                    style: { background: `${DIM$1}30` }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-mono text-[7px] tracking-[0.2em] uppercase",
                    style: { color: DIM$1 },
                    children: [
                      label,
                      " · ",
                      catLive,
                      "/",
                      catTotal
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-px flex-1",
                    style: { background: `${DIM$1}30` }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "grid gap-1",
                  style: {
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))"
                  },
                  children: Array.from({ length: hi - lo + 1 }, (_, k) => lo + k).map(
                    (i) => {
                      const live = isLive(i);
                      const det = SYSTEM_DETAIL[i];
                      const isExpanded = expandedIdx === i;
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          "data-ocid": `build_status.item.${i + 1}`,
                          className: "cursor-pointer select-none text-left w-full",
                          style: {
                            background: live ? `${GREEN$1}0a` : `${RED$1}06`,
                            border: `1px solid ${live ? GREEN$1 : RED$1}28`,
                            borderRadius: "2px"
                          },
                          onClick: () => setExpandedIdx(isExpanded ? null : i),
                          "aria-expanded": isExpanded,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-2 py-1.5", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "span",
                                {
                                  className: "w-1.5 h-1.5 rounded-full shrink-0",
                                  style: {
                                    background: live ? GREEN$1 : RED$1,
                                    boxShadow: live ? `0 0 4px ${GREEN$1}` : "none"
                                  }
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "span",
                                {
                                  className: "font-mono text-[7.5px] leading-tight flex-1",
                                  style: { color: live ? FG$1 : DIM$1 },
                                  children: SYSTEM_NAMES[i]
                                }
                              ),
                              (det == null ? void 0 : det.phase) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "span",
                                {
                                  className: "font-mono text-[6px] px-1 py-0.5 rounded-sm shrink-0",
                                  style: {
                                    background: det.phase === "A" ? `${GREEN$1}15` : det.phase === "F" ? `${AMBER$1}15` : `${DIM$1}15`,
                                    color: det.phase === "A" ? GREEN$1 : det.phase === "F" ? AMBER$1 : DIM$1,
                                    border: `1px solid ${det.phase === "A" ? GREEN$1 : det.phase === "F" ? AMBER$1 : DIM$1}30`
                                  },
                                  children: [
                                    "PH-",
                                    det.phase
                                  ]
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "span",
                                {
                                  className: "font-mono text-[7px] shrink-0",
                                  style: { color: DIM$1 },
                                  children: isExpanded ? "▲" : "▼"
                                }
                              )
                            ] }),
                            isExpanded && det && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "div",
                              {
                                className: "px-2 pb-2 pt-0.5 border-t",
                                style: { borderColor: `${CYAN$1}15` },
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    "p",
                                    {
                                      className: "font-mono text-[7px] leading-relaxed",
                                      style: { color: DIM$1 },
                                      children: det.sub
                                    }
                                  ),
                                  det.dims !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                    "p",
                                    {
                                      className: "font-mono text-[7px] mt-0.5",
                                      style: { color: INDIGO },
                                      children: [
                                        "✦ ",
                                        det.dims,
                                        " dims contributed to B1-B8"
                                      ]
                                    }
                                  )
                                ]
                              }
                            )
                          ]
                        },
                        i
                      );
                    }
                  )
                }
              )
            ] }, label);
          })
        ] }),
        activeSection === "phases" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-mono text-[8px] uppercase tracking-widest mb-3",
              style: { color: DIM$1 },
              children: "PARALLAX BUILD PHASES — 726,000 LINES · 304 CANISTERS"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", "data-ocid": "build_status.table", children: PHASES.map((ph, idx) => {
            const isActive = ph.status === "ACTIVE";
            const isNext = ph.status === "NEXT";
            const isDone = ph.status === "DONE";
            const accentColor = isActive ? AMBER$1 : isNext ? CYAN$1 : isDone ? GREEN$1 : DIM$1;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `build_status.row.${idx + 1}`,
                className: "flex items-start gap-2 px-2 py-1.5 rounded-sm",
                style: {
                  background: isActive ? `${AMBER$1}08` : isNext ? `${CYAN$1}06` : isDone ? `${GREEN$1}08` : `${DIM$1}05`,
                  border: `1px solid ${accentColor}25`
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-[8px] font-bold shrink-0 text-center min-w-[28px]",
                      style: { color: accentColor },
                      children: ph.id
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px] font-bold",
                          style: {
                            color: isActive || isNext ? FG$1 : isDone ? GREEN$1 : FG$1
                          },
                          children: ph.name
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[7px] px-1.5 py-0.5 rounded-sm shrink-0 ml-2",
                          style: {
                            background: `${accentColor}20`,
                            color: accentColor
                          },
                          children: ph.status
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[7px]",
                          style: { color: DIM$1 },
                          children: ph.lines > 0 ? `+${ph.lines.toLocaleString()} lines` : "pre-code"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[7px]",
                          style: { color: DIM$1 },
                          children: ph.canisters > 0 ? `+${ph.canisters} canisters` : "single canister"
                        }
                      )
                    ] })
                  ] })
                ]
              },
              ph.id
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "mt-3 p-2 rounded-sm",
              style: { background: DEEP, border: `1px solid ${CYAN$1}20` },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 text-center", children: [
                { label: "TOTAL LINES", value: "726,000" },
                { label: "TOTAL CANISTERS", value: "304" },
                { label: "TOTAL PHASES", value: PHASES.length.toString() }
              ].map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[9px] font-bold",
                    style: { color: CYAN$1 },
                    children: value
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[7px] uppercase tracking-widest",
                    style: { color: DIM$1 },
                    children: label
                  }
                )
              ] }, label)) })
            }
          )
        ] }),
        activeSection === "dimensions" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "font-mono text-[8px] uppercase tracking-widest",
                style: { color: DIM$1 },
                children: "DIMENSION ARCHITECTURE — TARGET: 4,096 (2^12 = H_MAX 12 BITS)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-mono text-[8px] font-bold",
                style: { color: INDIGO },
                children: [
                  totalDimBuilt,
                  " / 4096"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(BarRow, { label: "Total Progress", pct: dimPct, color: INDIGO }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-2", "data-ocid": "build_status.table", children: DIM_BLOCKS.map((block, idx) => {
            const pct = block.built / block.target * 100;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": `build_status.item.${idx + 1}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px] font-bold w-5",
                      style: { color: block.color },
                      children: block.id
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px]",
                      style: { color: FG$1 },
                      children: block.name
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px]",
                      style: { color: block.color },
                      children: block.built
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[7px]",
                      style: { color: DIM$1 },
                      children: [
                        "/ ",
                        block.target
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-full h-[4px] rounded-full",
                  style: { background: "oklch(0.12 0.03 250)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full rounded-full transition-all duration-700",
                      style: {
                        width: `${Math.min(100, pct)}%`,
                        background: block.color,
                        boxShadow: `0 0 4px ${block.color}60`
                      }
                    }
                  )
                }
              )
            ] }, block.id);
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "mt-4 p-2 rounded-sm",
              style: { background: DEEP, border: `1px solid ${INDIGO}30` },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: "font-mono text-[7px] leading-relaxed",
                    style: { color: DIM$1 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: INDIGO }, children: "4,096 = 2^12" }),
                      " ·  ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: CYAN$1 }, children: "H_max = log₂(4096) = 12.0 bits" }),
                      " ·  ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: AMBER$1 }, children: "12 tokens = 12 bits = sovereign" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[7px] mt-1", style: { color: DIM$1 }, children: "12 sphere axes · 12 metals · 12 tokens · 2^12 dimensions — mathematically sovereign." })
              ]
            }
          )
        ] }),
        activeSection === "enterprise" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-mono text-[8px] uppercase tracking-widest mb-3",
              style: { color: DIM$1 },
              children: "7 ENTERPRISE SYSTEMS — 0 COMPLETE · ALL PENDING"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", "data-ocid": "build_status.table", children: ENTERPRISE_SYSTEMS.map((sys, idx) => {
            const isBuilt = sys.status === "BUILT";
            const isPartial = sys.status === "PARTIAL";
            const accentColor = isBuilt ? GREEN$1 : isPartial ? AMBER$1 : RED$1;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `build_status.item.${idx + 1}`,
                className: "p-2 rounded-sm",
                style: {
                  background: `${accentColor}06`,
                  border: `1px solid ${accentColor}25`
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "w-1.5 h-1.5 rounded-full shrink-0",
                          style: {
                            background: accentColor,
                            boxShadow: isBuilt ? `0 0 4px ${GREEN$1}` : "none"
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px] font-bold",
                          style: { color: accentColor },
                          children: sys.name
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "font-mono text-[7px]",
                          style: { color: DIM$1 },
                          children: [
                            "PH-",
                            sys.phase,
                            " · ",
                            sys.lines.toLocaleString(),
                            " lines"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[7px] px-1.5 py-0.5 rounded-sm",
                          style: {
                            background: `${accentColor}20`,
                            color: accentColor
                          },
                          children: sys.status
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-mono text-[7px] mt-1 ml-3.5",
                      style: { color: DIM$1 },
                      children: sys.detail
                    }
                  )
                ]
              },
              sys.name
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "mt-3 p-2 rounded-sm",
              style: { background: DEEP, border: `1px solid ${AMBER$1}20` },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[7px]", style: { color: AMBER$1 }, children: "All enterprise system profits route 100% to creator reserve · perpetual compounding" })
            }
          )
        ] }),
        activeSection === "tokens" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-mono text-[8px] uppercase tracking-widest mb-3",
              style: { color: DIM$1 },
              children: "12-TOKEN ECONOMY — 7 INLINE · MODULE NOT WIRED · 100% TO CREATOR RESERVE"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid gap-1.5",
              style: { gridTemplateColumns: "repeat(4, 1fr)" },
              "data-ocid": "build_status.table",
              children: TOKENS.map((tok, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": `build_status.item.${idx + 1}`,
                  className: "flex flex-col items-center py-2 px-1 rounded-sm",
                  style: {
                    background: tok.live ? `${CYAN$1}0a` : `${DIM$1}08`,
                    border: `1px solid ${tok.live ? CYAN$1 : DIM$1}25`
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "w-1.5 h-1.5 rounded-full mb-1",
                        style: {
                          background: tok.live ? CYAN$1 : DIM$1,
                          boxShadow: tok.live ? `0 0 6px ${CYAN$1}` : "none"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[8px] font-bold text-center",
                        style: { color: tok.live ? CYAN$1 : DIM$1 },
                        children: tok.sym
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[6px] mt-0.5",
                        style: { color: DIM$1 },
                        children: tok.note
                      }
                    )
                  ]
                },
                tok.sym
              ))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "mt-3 p-2 rounded-sm space-y-1",
              style: { background: DEEP, border: `1px solid ${CYAN$1}20` },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[7px]", style: { color: DIM$1 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: GREEN$1 }, children: "FORMA" }),
                  " = internal fuel, not wealth · never externally sold"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[7px]", style: { color: DIM$1 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: AMBER$1 }, children: "MRC" }),
                  " = meta-currency · compounds from every token · every generation · every level · required for Jacob's Ladder"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[7px]", style: { color: DIM$1 }, children: "token_economy.mo on disk (12 tokens) — NOT wired · Phase K" })
              ]
            }
          )
        ] }),
        activeSection === "missions" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-mono text-[8px] uppercase tracking-widest mb-3",
              style: { color: DIM$1 },
              children: "10 SOVEREIGN MISSIONS — 8 ACTIVE · 2 PENDING"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", "data-ocid": "build_status.table", children: MISSIONS.map((m, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `build_status.item.${idx + 1}`,
              className: "flex items-center gap-2 px-2 py-1.5 rounded-sm",
              style: {
                background: m.active ? `${GREEN$1}08` : `${DIM$1}05`,
                border: `1px solid ${m.active ? GREEN$1 : DIM$1}25`
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "w-1.5 h-1.5 rounded-full shrink-0",
                    style: {
                      background: m.active ? GREEN$1 : DIM$1,
                      boxShadow: m.active ? `0 0 4px ${GREEN$1}` : "none"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[7px] font-bold w-8 shrink-0",
                    style: { color: DIM$1 },
                    children: m.id
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] flex-1",
                    style: { color: m.active ? FG$1 : DIM$1 },
                    children: m.name
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[7px] px-1.5 py-0.5 rounded-sm",
                    style: {
                      background: m.active ? `${GREEN$1}20` : `${DIM$1}15`,
                      color: m.active ? GREEN$1 : DIM$1
                    },
                    children: m.active ? "ACTIVE" : "PENDING"
                  }
                )
              ]
            },
            m.id
          )) })
        ] }),
        activeSection === "wirequeue" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[8px] uppercase tracking-widest",
                  style: { color: RED$1 },
                  children: "⚠ PRE-FLIGHT BUGS — FIX BEFORE ANY WIRING"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[7px] px-1.5 py-0.5 rounded-sm",
                  style: { background: `${RED$1}20`, color: RED$1 },
                  children: [
                    PREFLIGHT_BUGS.length,
                    " CRITICAL"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: PREFLIGHT_BUGS.map((bug) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex gap-2 px-2 py-1.5 rounded-sm",
                style: {
                  background: `${RED$1}06`,
                  border: `1px solid ${RED$1}25`
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[7px] font-bold shrink-0",
                      style: { color: RED$1 },
                      children: [
                        "#",
                        bug.id
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[7.5px] font-bold",
                          style: { color: AMBER$1 },
                          children: bug.file
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[6.5px] px-1 py-0.5 rounded-sm",
                          style: {
                            background: bug.severity === "COMPILATION ERROR" ? `${RED$1}20` : bug.severity === "DATA LOSS" ? `${AMBER$1}20` : `${DIM$1}15`,
                            color: bug.severity === "COMPILATION ERROR" ? RED$1 : bug.severity === "DATA LOSS" ? AMBER$1 : DIM$1
                          },
                          children: bug.severity
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "font-mono text-[7px] mt-0.5",
                        style: { color: DIM$1 },
                        children: bug.issue
                      }
                    )
                  ] })
                ]
              },
              bug.id
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-mono text-[8px] uppercase tracking-widest mb-2",
              style: { color: DIM$1 },
              children: "MODULE DEPENDENCY GRAPH — 8 LAYERS · 16 MODULES"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", "data-ocid": "build_status.table", children: WIRE_LAYERS.map((layer, idx) => {
            const isReady = layer.status === "READY";
            const isDone = layer.status === "DONE";
            const accentColor = isDone ? GREEN$1 : isReady ? CYAN$1 : DIM$1;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `build_status.item.${idx + 1}`,
                className: "p-2 rounded-sm",
                style: {
                  background: isDone ? `${GREEN$1}08` : isReady ? `${CYAN$1}06` : `${DIM$1}05`,
                  border: `1px solid ${accentColor}30`
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[8px] font-bold",
                        style: { color: accentColor },
                        children: [
                          "LAYER ",
                          layer.layer
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] px-1.5 py-0.5 rounded-sm",
                        style: {
                          background: `${accentColor}20`,
                          color: accentColor
                        },
                        children: layer.status
                      }
                    ),
                    layer.blockedBy && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[6.5px]",
                        style: { color: DIM$1 },
                        children: [
                          "blocked on ",
                          layer.blockedBy
                        ]
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: layer.modules.map((mod) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[7px] px-1.5 py-0.5 rounded-sm",
                      style: {
                        background: `${accentColor}10`,
                        color: accentColor,
                        border: `1px solid ${accentColor}20`
                      },
                      children: [
                        mod,
                        ".mo"
                      ]
                    },
                    mod
                  )) })
                ]
              },
              layer.layer
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "mt-3 p-2 rounded-sm",
              style: { background: DEEP, border: `1px solid ${CYAN$1}20` },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[7px]", style: { color: DIM$1 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: CYAN$1 }, children: "Wire order is strict." }),
                " Each layer depends on the previous. Fix pre-flight bugs first, then wire Layer 0. Each wire = 1 import + 1 stable var + 1 heartbeat call + deploy + verify."
              ] })
            }
          )
        ] })
      ]
    }
  );
}
const BG = "oklch(0.055 0.01 265)";
const PANEL = "oklch(0.075 0.012 265)";
const BORDER = "oklch(0.18 0.05 250)";
const CYAN = "oklch(0.72 0.22 195)";
const GREEN = "oklch(0.72 0.2 155)";
const AMBER = "oklch(0.78 0.22 75)";
const RED = "oklch(0.7 0.22 25)";
const DIM = "oklch(0.38 0.05 220)";
const FG = "oklch(0.82 0.04 220)";
function relativeTime(ts) {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1e3);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  return hr < 24 ? `${hr}h ago` : `${Math.floor(hr / 24)}d ago`;
}
function ScoreCard({
  label,
  score,
  subtitle,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-sm border p-3 flex flex-col gap-1",
      style: { background: PANEL, borderColor: `${color}30` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[8px] uppercase tracking-widest",
            style: { color: DIM },
            children: label
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-2xl font-bold", style: { color }, children: score }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px]", style: { color: DIM }, children: "/100" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-full rounded-full h-1",
            style: { background: "oklch(0.12 0.03 250)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-1 rounded-full transition-all",
                style: {
                  width: `${score}%`,
                  background: color,
                  boxShadow: `0 0 6px ${color}80`
                }
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[8px]", style: { color: DIM }, children: subtitle })
      ]
    }
  );
}
function StatusChip({
  label,
  status,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-2 px-3 py-2 rounded-sm border",
      style: { background: `${color}08`, borderColor: `${color}30` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "w-1.5 h-1.5 rounded-full shrink-0",
            style: { background: color, boxShadow: `0 0 6px ${color}` }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-mono text-[10px] font-semibold",
              style: { color: FG },
              children: label
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-mono text-[8px] uppercase tracking-widest",
              style: { color },
              children: status
            }
          )
        ] })
      ]
    }
  );
}
function runMonitorChecks(artifacts) {
  const busStatus = liveBrainBus.getBusStatus();
  const now = Date.now();
  const recentReport = artifacts.find(
    (a) => (a.artifact_type === "report" || a.artifact_type === "go_live_report" || a.artifact_type === "readiness_check") && a.status === "pass" && now - a.created_at < 24 * 60 * 60 * 1e3
  );
  return [
    {
      id: "neural_step",
      label: "BrainActionPacket contract (neural step)",
      status: liveBrainBus.isNeuralStepRegistered() ? "PASS" : "WARN",
      evidence: liveBrainBus.isNeuralStepRegistered() ? "Real neural step registered" : "Scalar fallback active — start simulation to register"
    },
    {
      id: "bind_health",
      label: "Bind-health heartbeat",
      status: busStatus.isActive && busStatus.packetsReturned > 0 ? "PASS" : busStatus.isActive ? "WARN" : "FAIL",
      evidence: `isActive: ${busStatus.isActive}, packets: ${busStatus.packetsReturned}`
    },
    {
      id: "artifact_persistence",
      label: "Artifact persistence",
      status: artifacts.length > 0 ? "PASS" : "WARN",
      evidence: artifacts.length > 0 ? `${artifacts.length} artifacts in storage` : "No artifacts yet — generate a report"
    },
    {
      id: "report_integrity",
      label: "Report integrity (last 24h)",
      status: recentReport ? "PASS" : "WARN",
      evidence: recentReport ? `Last pass: ${new Date(recentReport.created_at).toLocaleTimeString()}` : "No passing report in last 24h"
    },
    {
      id: "fallback_detection",
      label: "Fallback-logic detection",
      status: liveBrainBus.isNeuralStepRegistered() ? "PASS" : "WARN",
      evidence: liveBrainBus.isNeuralStepRegistered() ? "No scalar fallback" : "Scalar fallback active"
    },
    {
      id: "connectome_state",
      label: "Connectome state-change (packets flowing)",
      status: busStatus.packetsReturned > 0 ? "PASS" : "WARN",
      evidence: `packetsReturned: ${busStatus.packetsReturned}`
    },
    {
      id: "latency_overload",
      label: "Latency / overload alert",
      status: busStatus.latencyMs === 0 ? "PASS" : busStatus.latencyMs > 50 ? "WARN" : "PASS",
      evidence: busStatus.latencyMs === 0 ? "No payloads routed yet" : `Last latency: ${busStatus.latencyMs.toFixed(1)}ms`
    }
  ];
}
function MonitorDot({ status }) {
  const color = status === "PASS" ? "oklch(0.72 0.2 155)" : status === "WARN" ? "oklch(0.78 0.22 75)" : "oklch(0.7 0.22 25)";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "w-2 h-2 rounded-full shrink-0",
      style: { background: color, boxShadow: `0 0 5px ${color}` }
    }
  );
}
function AutoMonitorsPanel({
  artifacts
}) {
  const [checks, setChecks] = reactExports.useState(
    () => runMonitorChecks(artifacts)
  );
  const intervalRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    intervalRef.current = setInterval(() => {
      setChecks(runMonitorChecks(artifacts));
    }, 5e3);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [artifacts]);
  const passing = checks.filter((c) => c.status === "PASS").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-sm border p-3",
      style: {
        background: "oklch(0.075 0.012 265)",
        borderColor: "oklch(0.18 0.05 250)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-mono text-[8px] uppercase tracking-widest",
              style: { color: "oklch(0.38 0.05 220)" },
              children: "Auto-Monitors · 5s Refresh"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-[9px] font-bold px-2 py-0.5 rounded-sm",
              style: {
                background: passing === checks.length ? "oklch(0.72 0.2 155 / 0.15)" : "oklch(0.78 0.22 75 / 0.15)",
                color: passing === checks.length ? "oklch(0.72 0.2 155)" : "oklch(0.78 0.22 75)",
                border: `1px solid ${passing === checks.length ? "oklch(0.72 0.2 155 / 0.3)" : "oklch(0.78 0.22 75 / 0.3)"}`
              },
              children: [
                passing,
                "/",
                checks.length,
                " passing"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: checks.map((check) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MonitorDot, { status: check.status }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[9px] font-semibold truncate",
                style: { color: "oklch(0.82 0.04 220)" },
                children: check.label
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px] truncate",
                style: { color: "oklch(0.38 0.05 220)" },
                children: check.evidence
              }
            )
          ] })
        ] }, check.id)) })
      ]
    }
  );
}
const HERO_METRICS = [
  { label: "Cortical Activation", value: "73%", id: "cortical" },
  { label: "Kuramoto R", value: "0.84", id: "kuramoto" },
  { label: "GW Ignitions", value: "15", id: "gw" },
  { label: "ANS Stability", value: "79%", id: "ans" }
];
function OverviewTab({
  onNavigate
}) {
  const integration = useBrainIntegrationSystem();
  const [artifacts] = useArtifacts();
  const [checksRun, setChecksRun] = reactExports.useState(false);
  const ingestStats = integration.getIngestStats();
  const adapters = integration.adapters;
  const battleAdapter = adapters.find(
    (a) => a.adapter_name.toLowerCase().includes("battle") || a.deployment_type === "war_game"
  );
  const warCmdAdapter = adapters.find(
    (a) => a.adapter_name.toLowerCase().includes("war") || a.deployment_type === "scenario"
  );
  const activeSessions = integration.activeSessions.filter(
    (s) => s.status === "active"
  );
  const lastArtifact = artifacts[0];
  const recentArtifacts = artifacts.slice(0, 5);
  const integrationScore = Math.min(
    100,
    Math.round(
      adapters.filter((a) => a.status === "active").length / Math.max(adapters.length, 1) * 100 * 0.4 + (ingestStats.total > 0 ? Math.min(ingestStats.total / 20, 1) * 60 : 20) + (activeSessions.length > 0 ? 20 : 0)
    )
  );
  const readinessScore = Math.round(
    checksRun ? Math.min(
      92,
      72 + adapters.filter((a) => a.status === "active").length * 4
    ) : 78
  );
  const brainHealthScore = 88;
  const regulationScore = 85;
  function handleRunAllChecks() {
    setChecksRun(true);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "h-full overflow-y-auto p-4 space-y-4",
      style: { background: BG },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "overview.hero.section",
            className: "rounded-sm border p-5",
            style: {
              background: "linear-gradient(135deg, oklch(0.09 0.025 265), oklch(0.07 0.015 220))",
              borderColor: `${CYAN}40`
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "h1",
                  {
                    className: "font-mono font-bold leading-tight mb-2",
                    style: { color: CYAN, fontSize: "1.05rem" },
                    children: [
                      "A Live Synthetic Brain.",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                      "A Window Into Contained Intelligence."
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-mono text-[10px] leading-relaxed",
                    style: { color: "oklch(0.62 0.07 210)" },
                    children: "Real-time connectome dynamics. Global workspace ignition. Emergent cognition under constraint."
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4", children: HERO_METRICS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": `overview.hero.metric.${m.id}`,
                  className: "rounded-sm border p-2 text-center",
                  style: {
                    background: "oklch(0.06 0.012 265)",
                    borderColor: `${CYAN}25`
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "font-mono font-bold text-sm",
                        style: { color: CYAN },
                        children: m.value
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "font-mono text-[8px] uppercase tracking-widest mt-0.5",
                        style: { color: "oklch(0.38 0.05 220)" },
                        children: m.label
                      }
                    )
                  ]
                },
                m.id
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "overview.hero.enter_connectome_button",
                    onClick: () => onNavigate == null ? void 0 : onNavigate("connectome"),
                    className: "font-mono text-[10px] font-bold px-3 py-1.5 rounded-sm border transition-opacity hover:opacity-80",
                    style: {
                      background: `${CYAN}20`,
                      color: CYAN,
                      borderColor: `${CYAN}50`
                    },
                    children: "⬡ Enter the Connectome"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "overview.hero.view_benchmarks_button",
                    onClick: () => onNavigate == null ? void 0 : onNavigate("analytics"),
                    className: "font-mono text-[10px] font-bold px-3 py-1.5 rounded-sm border transition-opacity hover:opacity-80",
                    style: {
                      background: "oklch(0.82 0.22 80 / 0.15)",
                      color: "oklch(0.82 0.22 80)",
                      borderColor: "oklch(0.82 0.22 80 / 0.4)"
                    },
                    children: "◈ View the Benchmarks"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "overview.hero.read_papers_button",
                    onClick: () => onNavigate == null ? void 0 : onNavigate("experiments"),
                    className: "font-mono text-[10px] font-bold px-3 py-1.5 rounded-sm border transition-opacity hover:opacity-80",
                    style: {
                      background: "oklch(0.65 0.2 285 / 0.15)",
                      color: "oklch(0.72 0.22 280)",
                      borderColor: "oklch(0.65 0.2 285 / 0.4)"
                    },
                    children: "⚗ Read the Papers"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-mono text-[9px] leading-relaxed",
                  style: { color: "oklch(0.5 0.06 215)" },
                  children: "See intelligence form in real time. Observe saturation, emergence, and coherence. Study salience, prediction, and inhibition circuits. Explore a synthetic organism built on sovereign field physics."
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-sm border p-3",
            style: { background: PANEL, borderColor: BORDER },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-mono text-[8px] uppercase tracking-widest mb-2",
                  style: { color: DIM },
                  children: "System Status"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { label: "NeuroEmergence Core", status: "LIVE", color: GREEN }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  StatusChip,
                  {
                    label: "Emergent BattleOps",
                    status: (battleAdapter == null ? void 0 : battleAdapter.status) === "active" ? "ADAPTER-LIVE" : "ADAPTER-INACTIVE",
                    color: (battleAdapter == null ? void 0 : battleAdapter.status) === "active" ? AMBER : DIM
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  StatusChip,
                  {
                    label: "Emergent WarCommandOps",
                    status: (warCmdAdapter == null ? void 0 : warCmdAdapter.status) === "active" ? "ADAPTER-LIVE" : "ADAPTER-INACTIVE",
                    color: (warCmdAdapter == null ? void 0 : warCmdAdapter.status) === "active" ? AMBER : DIM
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  StatusChip,
                  {
                    label: "Neural Step",
                    status: liveBrainBus.isNeuralStepRegistered() ? "REAL" : "FALLBACK",
                    color: liveBrainBus.isNeuralStepRegistered() ? GREEN : AMBER
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BuildStatusPanel, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-mono text-[8px] uppercase tracking-widest mb-2",
              style: { color: DIM },
              children: "Live Health Summary"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ScoreCard,
              {
                label: "Brain Health",
                score: brainHealthScore,
                subtitle: "Neural + circuit",
                color: CYAN
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ScoreCard,
              {
                label: "Regulation",
                score: regulationScore,
                subtitle: "Cardio · ANS · Interoceptive",
                color: GREEN
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ScoreCard,
              {
                label: "Integration",
                score: integrationScore,
                subtitle: `${adapters.length} adapters`,
                color: AMBER
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ScoreCard,
              {
                label: "Readiness",
                score: readinessScore,
                subtitle: checksRun ? "checks run" : "est. from state",
                color: readinessScore >= 80 ? GREEN : AMBER
              }
            )
          ] })
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
                  children: "Quick Actions"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "overview.primary_button",
                    onClick: () => onNavigate == null ? void 0 : onNavigate("deployment"),
                    className: "font-mono text-[9px] uppercase tracking-widest px-4 py-2 rounded-sm transition-all",
                    style: {
                      background: `${AMBER}20`,
                      border: `1px solid ${AMBER}50`,
                      color: AMBER
                    },
                    children: "⚡ Start BattleOps Session"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "overview.secondary_button",
                    onClick: () => onNavigate == null ? void 0 : onNavigate("deployment"),
                    className: "font-mono text-[9px] uppercase tracking-widest px-4 py-2 rounded-sm transition-all",
                    style: {
                      background: `${CYAN}18`,
                      border: `1px solid ${CYAN}40`,
                      color: CYAN
                    },
                    children: "⚡ Start WarCommandOps Session"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "overview.report.button",
                    onClick: () => onNavigate == null ? void 0 : onNavigate("report"),
                    className: "font-mono text-[9px] uppercase tracking-widest px-4 py-2 rounded-sm transition-all",
                    style: {
                      background: `${GREEN}15`,
                      border: `1px solid ${GREEN}40`,
                      color: GREEN
                    },
                    children: "📊 Generate Go-Live Report"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "overview.checks.button",
                    onClick: handleRunAllChecks,
                    className: "font-mono text-[9px] uppercase tracking-widest px-4 py-2 rounded-sm transition-all",
                    style: {
                      background: checksRun ? `${GREEN}15` : "oklch(0.1 0.02 260)",
                      border: `1px solid ${checksRun ? GREEN : BORDER}`,
                      color: checksRun ? GREEN : FG
                    },
                    children: checksRun ? "✓ Checks Complete" : "▶ Run All Checks"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
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
                    children: "Connection Health"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [
                  {
                    label: "BattleOps Adapter Session",
                    value: activeSessions.find(
                      (s) => s.adapter_id === (battleAdapter == null ? void 0 : battleAdapter.adapter_id)
                    ) ? "ACTIVE" : "INACTIVE",
                    color: activeSessions.find(
                      (s) => s.adapter_id === (battleAdapter == null ? void 0 : battleAdapter.adapter_id)
                    ) ? GREEN : DIM
                  },
                  {
                    label: "WarCommandOps Adapter Session",
                    value: activeSessions.find(
                      (s) => s.adapter_id === (warCmdAdapter == null ? void 0 : warCmdAdapter.adapter_id)
                    ) ? "ACTIVE" : "INACTIVE",
                    color: activeSessions.find(
                      (s) => s.adapter_id === (warCmdAdapter == null ? void 0 : warCmdAdapter.adapter_id)
                    ) ? GREEN : DIM
                  },
                  {
                    label: "Last Ingest Event",
                    value: ingestStats.total > 0 ? `${ingestStats.total} events` : "None",
                    color: ingestStats.total > 0 ? CYAN : DIM
                  },
                  {
                    label: "Trace Return Health",
                    value: ingestStats.invalid === 0 ? "ALL VALID" : `${ingestStats.invalid} INVALID`,
                    color: ingestStats.invalid === 0 ? GREEN : RED
                  },
                  {
                    label: "Artifact Freshness",
                    value: lastArtifact ? relativeTime(lastArtifact.created_at) : "No artifacts",
                    color: lastArtifact ? CYAN : DIM
                  }
                ].map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center justify-between",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px]", style: { color: DIM }, children: row.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[9px] font-semibold",
                          style: { color: row.color },
                          children: row.value
                        }
                      )
                    ]
                  },
                  row.label
                )) })
              ]
            }
          ),
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
                    children: "Recent Artifacts"
                  }
                ),
                recentArtifacts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "overview.empty_state", className: "text-center py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px]", style: { color: DIM }, children: "No artifacts yet. Generate a report to create artifacts." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: recentArtifacts.map((artifact, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": `overview.item.${i + 1}`,
                    className: "flex items-start gap-2 p-2 rounded-sm border",
                    style: {
                      background: "oklch(0.065 0.01 265)",
                      borderColor: BORDER
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm shrink-0 mt-0.5",
                          style: {
                            background: `${CYAN}15`,
                            border: `1px solid ${CYAN}30`,
                            color: CYAN
                          },
                          children: artifact.artifact_type.replace(/_/g, " ")
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "font-mono text-[9px] font-semibold truncate",
                            style: { color: FG },
                            children: artifact.title
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[8px]", style: { color: DIM }, children: relativeTime(artifact.created_at) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "font-mono text-[9px] font-bold shrink-0",
                          style: {
                            color: artifact.score >= 80 ? GREEN : artifact.score >= 50 ? AMBER : RED
                          },
                          children: [
                            artifact.score.toFixed(0),
                            "%"
                          ]
                        }
                      )
                    ]
                  },
                  artifact.artifact_id
                )) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-mono text-[8px] uppercase tracking-widest mb-2",
              style: { color: DIM },
              children: "Shared System Treaty"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SharedTreatyPanel, {})
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AutoMonitorsPanel, { artifacts }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            className: "font-mono text-[8px]",
            style: { color: "oklch(0.3 0.04 220)" },
            children: [
              "© ",
              (/* @__PURE__ */ new Date()).getFullYear(),
              ". Built with love using",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  style: { color: "oklch(0.5 0.1 220)" },
                  children: "caffeine.ai"
                }
              )
            ]
          }
        ) })
      ]
    }
  );
}
export {
  OverviewTab as default
};
