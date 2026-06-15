import { useState } from "react";
import { useParallaxBuildStatus } from "../hooks/useQueries";

const PANEL = "oklch(0.075 0.012 265)";
const CYAN = "oklch(0.72 0.22 195)";
const GREEN = "oklch(0.72 0.2 155)";
const RED = "oklch(0.7 0.22 25)";
const DIM = "oklch(0.38 0.05 220)";
const FG = "oklch(0.82 0.04 220)";
const AMBER = "oklch(0.78 0.22 75)";
const DEEP = "oklch(0.042 0.008 265)";
const PURPLE = "oklch(0.72 0.22 280)";
const INDIGO = "oklch(0.62 0.18 260)";

// 36-system PARALLAX audit checklist (indices 0-35 match backend checklist)
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
  "War Simulation",
];

// Detailed descriptions for each system
const SYSTEM_DETAIL: Record<
  number,
  { phase: string; sub: string; dims?: number }
> = {
  0: {
    phase: "H",
    sub: "module on disk (shells.mo) — NOT imported by main.mo · HELIX_ALPHA conflict unresolved",
    dims: 22,
  },
  1: {
    phase: "G",
    sub: "module on disk (organs_full.mo) — NOT wired into heartbeat",
    dims: 18,
  },
  2: {
    phase: "F",
    sub: "module on disk (metals_full.mo) — Layer 0, READY to wire",
  },
  3: {
    phase: "F",
    sub: "module on disk (neurochemicals_full.mo) — Layer 0, READY to wire",
    dims: 21,
  },
  4: {
    phase: "G",
    sub: "module on disk (animal_engines.mo) — Layer 1, blocked on Layer 0",
    dims: 9,
  },
  5: {
    phase: "I",
    sub: "module on disk (quantum_ops_full.mo) — Layer 3, blocked on Layer 2",
    dims: 7,
  },
  6: {
    phase: "J",
    sub: "module on disk (laws_engine.mo) — Layer 4 · only 26/60 run inline in main.mo",
  },
  7: {
    phase: "H",
    sub: "module on disk (sphere_nodes.mo) — Layer 2, blocked on Layer 1",
    dims: 72,
  },
  8: {
    phase: "L",
    sub: "module on disk (deep_memory_full.mo) — Layer 6 · Episode type missing 5 causal fields",
    dims: 36,
  },
  9: {
    phase: "L",
    sub: "module on disk (deep_memory_full.mo) — 24 heritage anchors not yet wired",
    dims: 24,
  },
  10: {
    phase: "A",
    sub: "RUNNING inline main.mo · Nat32 FNV-1a chain · beats → chronoAnchor",
  },
  11: {
    phase: "K",
    sub: "NOT wired — needs MRC token from token_economy.mo (Layer 5)",
  },
  12: {
    phase: "I",
    sub: "module on disk (medina_engine.mo) — Layer 3, blocked on Layer 2",
    dims: 0,
  },
  13: {
    phase: "A",
    sub: "PARTIAL inline main.mo · FORMA balance + generation · gate multiplier not wired",
  },
  14: {
    phase: "A",
    sub: "RUNNING inline main.mo · ARES rollback + QMEM quantum memory",
  },
  15: {
    phase: "A",
    sub: "RUNNING inline main.mo · superposition path fork flag",
  },
  16: {
    phase: "A",
    sub: "RUNNING inline main.mo · temporal dilation active flag",
  },
  17: {
    phase: "F",
    sub: "PARTIAL inline main.mo · BTC parser works · ETH/ICP return 0.0 (market_feeds.mo not wired)",
  },
  18: {
    phase: "K",
    sub: "PARTIAL — 7 tokens inline main.mo · token_economy.mo (12 tokens) NOT wired — Layer 5",
  },
  19: {
    phase: "A",
    sub: "PARTIAL inline main.mo · scalar vars only · succession.mo module NOT wired",
  },
  20: {
    phase: "O",
    sub: "module on disk (principal_lock.mo) — imports at bottom (COMPILATION BUG)",
  },
  21: { phase: "O", sub: "module on disk — NOT wired into heartbeat" },
  22: { phase: "N", sub: "NOT WRITTEN — cycle_bank.mo does not exist yet" },
  23: { phase: "T", sub: "NOT WRITTEN — arbitrage engine not built" },
  24: { phase: "T", sub: "NOT WRITTEN — yield optimizer not built" },
  25: { phase: "T", sub: "NOT WRITTEN — mempool watcher not built" },
  26: { phase: "N", sub: "NOT WRITTEN — child_sdk.mo does not exist yet" },
  27: {
    phase: "A",
    sub: "RUNNING inline main.mo · 5-drive competition (simplified version)",
  },
  28: { phase: "S", sub: "NOT WRITTEN — macro signal layer not built" },
  29: { phase: "S", sub: "NOT WRITTEN — legal/IP automation not built" },
  30: {
    phase: "A",
    sub: "RUNNING inline main.mo · fd(k)=2.5×2^(k-4) Hz · body→brain PAC hierarchy",
  },
  31: {
    phase: "A",
    sub: "PARTIAL inline main.mo · 2.25x flat (not true x^0.88 Tversky-Kahneman)",
  },
  32: {
    phase: "A",
    sub: "RUNNING inline main.mo · 5 conditions · gates OMNIS + minting + ANIMA",
  },
  33: {
    phase: "A",
    sub: "RUNNING inline main.mo · 7 tokens → creator reserve 100%",
  },
  34: {
    phase: "A",
    sub: "RUNNING inline main.mo · OMNIS artifacts with doctrineHash + coherence",
  },
  35: {
    phase: "A",
    sub: "RUNNING inline main.mo · 5 factions · escalation tiers 1-4 · FORGE",
  },
};

// TRUE phase roadmap — ordered by actual build dependency
const PHASES = [
  {
    id: "PRE",
    name: "Conflict Resolution + Pre-flight Fixes",
    lines: 0,
    canisters: 0,
    status: "ACTIVE",
  },
  {
    id: "F",
    name: "Layer 0 Wiring — Metals + NC + Succession + Market",
    lines: 500,
    canisters: 0,
    status: "NEXT",
  },
  {
    id: "G",
    name: "Layer 1 Wiring — Organs + Animal Engines",
    lines: 400,
    canisters: 0,
    status: "PENDING",
  },
  {
    id: "H",
    name: "Layer 2 Wiring — Shells + Sphere Nodes",
    lines: 600,
    canisters: 0,
    status: "PENDING",
  },
  {
    id: "I",
    name: "Layer 3 Wiring — MEDINA + Quantum Ops",
    lines: 600,
    canisters: 0,
    status: "PENDING",
  },
  {
    id: "J",
    name: "Layer 4 Wiring — Laws Engine + Behavioral Econ",
    lines: 600,
    canisters: 0,
    status: "PENDING",
  },
  {
    id: "K",
    name: "Layer 5 Wiring — 12-Token Stack + RL Engine",
    lines: 700,
    canisters: 0,
    status: "PENDING",
  },
  {
    id: "L",
    name: "Layer 6 Wiring — Deep Memory 200 Slots + Causal Fields",
    lines: 400,
    canisters: 0,
    status: "PENDING",
  },
  {
    id: "M",
    name: "Layer 7 Wiring — World Engine",
    lines: 300,
    canisters: 0,
    status: "PENDING",
  },
  {
    id: "N",
    name: "Write Missing — DeFi + Patent + CycleBank + ChildSDK",
    lines: 18000,
    canisters: 4,
    status: "PENDING",
  },
  {
    id: "O",
    name: "Quantum-Resistant Ratchet — principal_lock.mo upgrade",
    lines: 500,
    canisters: 0,
    status: "PENDING",
  },
  {
    id: "P",
    name: "360 Behavioral Output Unification",
    lines: 800,
    canisters: 0,
    status: "PENDING",
  },
  {
    id: "Q",
    name: "Shells 6-11 Full Math + 72 Sphere Nodes Expansion",
    lines: 85000,
    canisters: 32,
    status: "PENDING",
  },
  {
    id: "R",
    name: "MEDINA 4096 Dims Full Expansion",
    lines: 42000,
    canisters: 4,
    status: "PENDING",
  },
  {
    id: "S",
    name: "Economic Engine + Jacob's Ladder Full",
    lines: 48000,
    canisters: 20,
    status: "PENDING",
  },
  {
    id: "T",
    name: "RL + Arbitrage + Yield + Mempool Full",
    lines: 22000,
    canisters: 5,
    status: "PENDING",
  },
];

// Dimension block breakdown toward 4096 — TRUE built values
const DIM_BLOCKS = [
  {
    id: "B1",
    name: "Internal Organism State",
    target: 693,
    built: 284,
    color: CYAN,
  },
  {
    id: "B2",
    name: "Market & World Signals",
    target: 431,
    built: 12,
    color: AMBER,
  },
  { id: "B3", name: "Temporal History", target: 567, built: 52, color: GREEN },
  {
    id: "B4",
    name: "Network & Succession",
    target: 145,
    built: 3,
    color: PURPLE,
  },
  {
    id: "B5",
    name: "Sovereign & Doctrine",
    target: 173,
    built: 48,
    color: CYAN,
  },
  {
    id: "B6",
    name: "Reinforcement Learning",
    target: 202,
    built: 18,
    color: AMBER,
  },
  { id: "B7", name: "Macro Intelligence", target: 260, built: 0, color: RED },
  { id: "B8", name: "Derived Mathematical", target: 625, built: 0, color: DIM },
];

// Enterprise pipeline
const ENTERPRISE_SYSTEMS = [
  {
    name: "RL Engine",
    phase: "A",
    lines: 4500,
    status: "PARTIAL",
    detail:
      "5-drive inline in main.mo (simplified) · rl_full.mo on disk, NOT wired",
  },
  {
    name: "Mempool Watcher",
    phase: "T",
    lines: 3000,
    status: "NOT WRITTEN",
    detail: "BTC + ETH mempool → whale signals → MEDINA input",
  },
  {
    name: "Arbitrage Engine",
    phase: "T",
    lines: 3500,
    status: "NOT WRITTEN",
    detail: "ICDex ↔ UniswapV3 spread → creator reserve",
  },
  {
    name: "Yield Optimizer",
    phase: "N",
    lines: 4000,
    status: "NOT WRITTEN",
    detail: "Sharpe-weighted rotation: Lido / EigenLayer / NNS",
  },
  {
    name: "Child Organism SDK",
    phase: "N",
    lines: 5000,
    status: "NOT WRITTEN",
    detail: "100 GTK spawn · 20% royalty auto-wire · NOVA register",
  },
  {
    name: "Cycle Bank",
    phase: "N",
    lines: 2500,
    status: "NOT WRITTEN",
    detail: "5-tier alerts · daily burn rate projection · auto-top-up",
  },
  {
    name: "Patent Registry",
    phase: "N",
    lines: 2000,
    status: "NOT WRITTEN",
    detail: "Auto-patent on coherence peaks · SACESI-stamped · attorney-grade",
  },
];

// Token economy — TRUE state (only 7 inline tokens, module not wired)
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
  { sym: "VCT", live: false, note: "Phase K" },
];

// Mission matrix
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
  { id: "M10", name: "Network Expansion", active: false },
];

// Wiring queue layers
const WIRE_LAYERS = [
  {
    layer: 0,
    modules: [
      "metals_full",
      "neurochemicals_full",
      "succession",
      "market_feeds",
    ],
    status: "READY" as "READY" | "BLOCKED" | "DONE",
    blockedBy: null,
  },
  {
    layer: 1,
    modules: ["organs_full", "animal_engines"],
    status: "BLOCKED" as "READY" | "BLOCKED" | "DONE",
    blockedBy: "Layer 0",
  },
  {
    layer: 2,
    modules: ["shells", "sphere_nodes"],
    status: "BLOCKED" as "READY" | "BLOCKED" | "DONE",
    blockedBy: "Layer 1",
  },
  {
    layer: 3,
    modules: ["medina_engine", "quantum_ops_full"],
    status: "BLOCKED" as "READY" | "BLOCKED" | "DONE",
    blockedBy: "Layer 2",
  },
  {
    layer: 4,
    modules: ["laws_engine", "behavioral_econ"],
    status: "BLOCKED" as "READY" | "BLOCKED" | "DONE",
    blockedBy: "Layer 3",
  },
  {
    layer: 5,
    modules: ["token_economy", "rl_full"],
    status: "BLOCKED" as "READY" | "BLOCKED" | "DONE",
    blockedBy: "Layer 4",
  },
  {
    layer: 6,
    modules: ["deep_memory_full"],
    status: "BLOCKED" as "READY" | "BLOCKED" | "DONE",
    blockedBy: "Layer 5",
  },
  {
    layer: 7,
    modules: ["world_engine"],
    status: "BLOCKED" as "READY" | "BLOCKED" | "DONE",
    blockedBy: "Layer 6",
  },
];

// Pre-flight bugs that must be fixed before any wiring
const PREFLIGHT_BUGS = [
  {
    id: 1,
    file: "principal_lock.mo",
    issue: "imports at bottom of file",
    severity: "COMPILATION ERROR",
  },
  {
    id: 2,
    file: "market_feeds.mo",
    issue: "missing import Int32",
    severity: "COMPILATION ERROR",
  },
  {
    id: 3,
    file: "All 16 modules",
    issue: "missing stdlib imports at top",
    severity: "COMPILATION ERROR",
  },
  {
    id: 4,
    file: "deep_memory_full.mo",
    issue:
      "Episode type missing 5 causal fields (epBackwardPath, epCausalWeight, epParentEventId, epPriorStateHash, epDriveAtEvent)",
    severity: "DATA LOSS",
  },
  {
    id: 5,
    file: "shells.mo",
    issue: "PAC_SKIP defined but never called in runAllShells()",
    severity: "DEAD CODE",
  },
];

function TerminalRow({
  label,
  value,
  valueColor,
  note,
}: {
  label: string;
  value: string;
  valueColor?: string;
  note?: string;
}) {
  return (
    <div className="flex items-baseline gap-1.5 font-mono text-[9px] leading-[1.75]">
      <span className="shrink-0" style={{ color: CYAN }}>
        ║
      </span>
      <span className="w-[128px] shrink-0" style={{ color: DIM }}>
        {label}
      </span>
      <span className="font-bold" style={{ color: valueColor ?? GREEN }}>
        {value}
      </span>
      {note && (
        <span style={{ color: DIM }} className="ml-1">
          {note}
        </span>
      )}
    </div>
  );
}

function BarRow({
  label,
  pct,
  color,
}: {
  label: string;
  pct: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 font-mono text-[8px] mb-1">
      <span className="w-[120px] shrink-0" style={{ color: DIM }}>
        {label}
      </span>
      <div
        className="flex-1 h-[3px] rounded-full"
        style={{ background: "oklch(0.12 0.03 250)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${Math.min(100, Math.max(0, pct))}%`,
            background: color,
            boxShadow: `0 0 4px ${color}80`,
          }}
        />
      </div>
      <span className="w-10 text-right" style={{ color }}>
        {pct.toFixed(1)}%
      </span>
    </div>
  );
}

type Section =
  | "audit"
  | "phases"
  | "dimensions"
  | "enterprise"
  | "tokens"
  | "missions"
  | "wirequeue";

export default function BuildStatusPanel() {
  const statusQ = useParallaxBuildStatus();
  const d = statusQ.data;
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("audit");

  // TRUE values — corrected from honest audit
  const linesWritten = d ? Number(d.linesWritten) : 11171;
  const totalLines = d ? Number(d.totalLines) : 726000;
  const canistersLive = d ? Number(d.canistersLive) : 2;
  const totalCanisters = d ? Number(d.totalCanisters) : 304;
  const currentPhase =
    d?.currentPhase ?? "Phase F — Pre-flight & Layer 0 Wiring";
  const missionPct = d?.missionProgress ?? (linesWritten / totalLines) * 100;
  const phasePct = d?.phasePercent ?? 1.54;
  const _auditPassed = d ? Number(d.auditPassed) : 12;
  const auditTotal = d ? Number(d.auditTotal) : 36;

  const checklistMap = new Map<number, boolean>();
  if (d?.systemChecklist) {
    for (const [idx, live] of d.systemChecklist) {
      checklistMap.set(Number(idx), live);
    }
  }

  // TRUE HONEST FALLBACK — reflects what is ACTUALLY wired into main.mo heartbeat
  const HONEST_FALLBACK: Record<number, boolean> = {
    0: false, // 11 Shells — module on disk, NOT wired into main.mo
    1: false, // 18 Organs — module on disk, NOT wired
    2: false, // 12 Metals — module on disk, NOT wired
    3: false, // 21 Neurochems — module on disk, NOT wired
    4: false, // 9 Animal Engines — module on disk, NOT wired
    5: false, // 7 Quantum Ops — module on disk, NOT wired
    6: false, // 60 Laws — module on disk, NOT wired (only 26 inline in main.mo)
    7: false, // 72 Sphere Nodes — module on disk, NOT wired
    8: false, // 36 Deep State — module on disk, NOT wired
    9: false, // 24 Heritage — module on disk, NOT wired
    10: true, // SACESI — inline in main.mo, running (Nat32 chain)
    11: false, // Jacob's Ladder — not wired (needs MRC token)
    12: false, // MEDINA 4096 Dims — module on disk, NOT wired
    13: true, // FORMA Engine — partial inline in main.mo
    14: true, // ARES + QMEM — inline in main.mo
    15: true, // Superposition — inline flag in main.mo
    16: true, // Temporal Dilation — inline in main.mo
    17: true, // Multi-chain HTTP — inline BTC parser works, ETH/ICP return 0.0
    18: false, // 12 Tokens — only 7 inline tokens, module not wired
    19: true, // NOVA + Succession — scalar vars in main.mo (not full module)
    20: false, // Guardian Multi-sig — module on disk, NOT wired
    21: false, // Upgrade Governor — module on disk, NOT wired
    22: false, // Cycle Bank — module NOT written yet
    23: false, // Arbitrage Engine — NOT written
    24: false, // Yield Optimizer — NOT written
    25: false, // Mempool Watcher — NOT written
    26: false, // Child Org SDK — NOT written
    27: true, // RL Engine — inline in main.mo (5-drive version)
    28: false, // Macro Signal Layer — NOT written
    29: false, // Legal/IP System — NOT written
    30: true, // Binary Hierarchy — inline in main.mo, fully running
    31: true, // Behavioral Econ — inline in main.mo (simplified 2.25x version)
    32: true, // Jasmine's Law — inline in main.mo
    33: true, // Creator Reserve — inline in main.mo
    34: true, // Genesis Artifacts — inline in main.mo
    35: true, // War Simulation — inline in main.mo
  };

  const isLive = (i: number): boolean => {
    if (checklistMap.size > 0) return checklistMap.get(i) ?? false;
    return HONEST_FALLBACK[i] ?? false;
  };

  const liveCount = SYSTEM_NAMES.reduce(
    (acc, _, i) => acc + (isLive(i) ? 1 : 0),
    0,
  );

  const totalDimBuilt = DIM_BLOCKS.reduce((s, b) => s + b.built, 0);
  const totalDimTarget = 4096;
  const dimPct = (totalDimBuilt / totalDimTarget) * 100;

  const SECTION_TABS: Array<{ id: Section; label: string; count?: string }> = [
    {
      id: "audit",
      label: "SYS AUDIT",
      count: `${liveCount}/${SYSTEM_NAMES.length}`,
    },
    { id: "phases", label: "PHASES", count: `1/${PHASES.length}` },
    { id: "dimensions", label: "4096 DIMS", count: `${totalDimBuilt}` },
    { id: "enterprise", label: "ENTERPRISE", count: "0/7" },
    { id: "tokens", label: "TOKENS", count: "7/12" },
    { id: "missions", label: "MISSIONS", count: "8/10" },
    { id: "wirequeue", label: "WIRE QUEUE", count: "0/8" },
  ];

  return (
    <div
      className="rounded-sm border overflow-hidden"
      style={{ background: PANEL, borderColor: `${CYAN}40` }}
      data-ocid="build_status.panel"
    >
      {/* Terminal header block */}
      <div
        className="p-3"
        style={{
          background: DEEP,
          borderBottom: `1px solid ${CYAN}30`,
          fontFamily: "'JetBrains Mono', 'Geist Mono', monospace",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: AMBER,
                boxShadow: `0 0 6px ${AMBER}`,
                animation: "pulse 2s infinite",
              }}
            />
            <span
              className="font-mono text-[8px] uppercase tracking-[0.2em]"
              style={{ color: CYAN }}
            >
              NEUROEMERGENCE CORE — PARALLAX AUDIT
            </span>
          </div>
          <span
            className="font-mono text-[8px] px-2 py-0.5 rounded-sm"
            style={{
              background: `${AMBER}15`,
              color: AMBER,
              border: `1px solid ${AMBER}40`,
            }}
          >
            PHASE F — PRE-FLIGHT
          </span>
        </div>

        {/* Box-drawing terminal rows */}
        <div
          className="text-[9px] leading-[1.6]"
          style={{
            fontFamily: "'JetBrains Mono', 'Geist Mono', monospace",
            color: CYAN,
          }}
        >
          <div>╔══════════════════════════════════════════════════╗</div>
          <TerminalRow
            label="Lines written:"
            value={`${linesWritten.toLocaleString()} / ${totalLines.toLocaleString()}`}
            valueColor={GREEN}
            note={`(${missionPct.toFixed(2)}%)`}
          />
          <TerminalRow
            label="Canisters live:"
            value={`${canistersLive} / ${totalCanisters}`}
            valueColor={CYAN}
            note={`(${((canistersLive / totalCanisters) * 100).toFixed(2)}%)`}
          />
          <TerminalRow
            label="Modules on disk:"
            value="22 files"
            valueColor={AMBER}
            note="(0 wired into heartbeat)"
          />
          <TerminalRow
            label="Current phase:"
            value={currentPhase}
            valueColor={AMBER}
          />
          <TerminalRow
            label="Mission progress:"
            value={`${missionPct.toFixed(2)}%`}
            valueColor={GREEN}
          />
          <TerminalRow
            label="Systems running:"
            value={`${liveCount} / ${auditTotal} WIRED`}
            valueColor={liveCount >= 20 ? GREEN : RED}
          />
          <TerminalRow
            label="Pre-flight bugs:"
            value="5 CRITICAL"
            valueColor={RED}
            note="(must fix before wiring)"
          />
          <TerminalRow
            label="Dimensions built:"
            value={`${totalDimBuilt} / 4096`}
            valueColor={INDIGO}
            note={"(H_max→12 bits)"}
          />
          <div>╚══════════════════════════════════════════════════╝</div>
        </div>

        {/* Progress bars */}
        <div className="mt-3 space-y-0.5">
          <BarRow label="Mission Progress" pct={missionPct} color={GREEN} />
          <BarRow label="Phase Progress" pct={phasePct} color={CYAN} />
          <BarRow
            label="Canisters Online"
            pct={(canistersLive / totalCanisters) * 100}
            color={AMBER}
          />
          <BarRow label="Dimension Architecture" pct={dimPct} color={INDIGO} />
          <BarRow
            label="Systems Wired"
            pct={(liveCount / SYSTEM_NAMES.length) * 100}
            color={liveCount >= 20 ? GREEN : RED}
          />
        </div>
      </div>

      {/* Section tabs */}
      <div
        className="flex border-b overflow-x-auto"
        style={{
          borderColor: `${CYAN}20`,
          background: "oklch(0.058 0.01 265)",
        }}
      >
        {SECTION_TABS.map(({ id, label, count }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveSection(id)}
            data-ocid={`build_status.${id}.tab`}
            className="flex items-center gap-1 px-3 py-1.5 font-mono text-[8px] tracking-widest uppercase transition-all shrink-0"
            style={{
              color: activeSection === id ? CYAN : DIM,
              background: activeSection === id ? `${CYAN}08` : "transparent",
              borderBottom:
                activeSection === id
                  ? `1px solid ${CYAN}`
                  : "1px solid transparent",
            }}
          >
            {label}
            {count && (
              <span
                className="px-1 py-0.5 rounded-sm"
                style={{
                  background: activeSection === id ? `${CYAN}20` : `${DIM}20`,
                  color: activeSection === id ? CYAN : DIM,
                  fontSize: "7px",
                }}
              >
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* === SYS AUDIT section === */}
      {activeSection === "audit" && (
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <p
              className="font-mono text-[8px] uppercase tracking-widest"
              style={{ color: DIM }}
            >
              36-SYSTEM PARALLAX AUDIT — {liveCount}/{SYSTEM_NAMES.length} WIRED
              INTO HEARTBEAT
            </p>
            <span
              className="font-mono text-[8px] px-2 py-0.5 rounded-sm"
              style={{
                background: `${RED}15`,
                color: RED,
                border: `1px solid ${RED}40`,
              }}
            >
              {Math.round((liveCount / SYSTEM_NAMES.length) * 100)}% WIRED
            </span>
          </div>
          {[
            { label: "NEURAL SUBSTRATE (0-6)", range: [0, 6] },
            { label: "DIMENSIONAL (7-12)", range: [7, 12] },
            { label: "QUANTUM & TEMPORAL (13-17)", range: [13, 17] },
            { label: "ECONOMIC (18-22)", range: [18, 22] },
            { label: "ENTERPRISE (23-29)", range: [23, 29] },
            { label: "SOVEREIGN CORE (30-35)", range: [30, 35] },
          ].map(({ label, range }) => {
            const [lo, hi] = range;
            const catLive = Array.from({ length: hi - lo + 1 }, (_, k) =>
              isLive(lo + k),
            ).filter(Boolean).length;
            const catTotal = hi - lo + 1;
            return (
              <div key={label} className="mb-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className="h-px flex-1"
                    style={{ background: `${DIM}30` }}
                  />
                  <span
                    className="font-mono text-[7px] tracking-[0.2em] uppercase"
                    style={{ color: DIM }}
                  >
                    {label} · {catLive}/{catTotal}
                  </span>
                  <div
                    className="h-px flex-1"
                    style={{ background: `${DIM}30` }}
                  />
                </div>
                <div
                  className="grid gap-1"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                  }}
                >
                  {Array.from({ length: hi - lo + 1 }, (_, k) => lo + k).map(
                    (i) => {
                      const live = isLive(i);
                      const det = SYSTEM_DETAIL[i];
                      const isExpanded = expandedIdx === i;
                      return (
                        <button
                          key={i}
                          type="button"
                          data-ocid={`build_status.item.${i + 1}`}
                          className="cursor-pointer select-none text-left w-full"
                          style={{
                            background: live ? `${GREEN}0a` : `${RED}06`,
                            border: `1px solid ${live ? GREEN : RED}28`,
                            borderRadius: "2px",
                          }}
                          onClick={() => setExpandedIdx(isExpanded ? null : i)}
                          aria-expanded={isExpanded}
                        >
                          <div className="flex items-center gap-1.5 px-2 py-1.5">
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{
                                background: live ? GREEN : RED,
                                boxShadow: live ? `0 0 4px ${GREEN}` : "none",
                              }}
                            />
                            <span
                              className="font-mono text-[7.5px] leading-tight flex-1"
                              style={{ color: live ? FG : DIM }}
                            >
                              {SYSTEM_NAMES[i]}
                            </span>
                            {det?.phase && (
                              <span
                                className="font-mono text-[6px] px-1 py-0.5 rounded-sm shrink-0"
                                style={{
                                  background:
                                    det.phase === "A"
                                      ? `${GREEN}15`
                                      : det.phase === "F"
                                        ? `${AMBER}15`
                                        : `${DIM}15`,
                                  color:
                                    det.phase === "A"
                                      ? GREEN
                                      : det.phase === "F"
                                        ? AMBER
                                        : DIM,
                                  border: `1px solid ${
                                    det.phase === "A"
                                      ? GREEN
                                      : det.phase === "F"
                                        ? AMBER
                                        : DIM
                                  }30`,
                                }}
                              >
                                PH-{det.phase}
                              </span>
                            )}
                            <span
                              className="font-mono text-[7px] shrink-0"
                              style={{ color: DIM }}
                            >
                              {isExpanded ? "▲" : "▼"}
                            </span>
                          </div>
                          {isExpanded && det && (
                            <div
                              className="px-2 pb-2 pt-0.5 border-t"
                              style={{ borderColor: `${CYAN}15` }}
                            >
                              <p
                                className="font-mono text-[7px] leading-relaxed"
                                style={{ color: DIM }}
                              >
                                {det.sub}
                              </p>
                              {det.dims !== undefined && (
                                <p
                                  className="font-mono text-[7px] mt-0.5"
                                  style={{ color: INDIGO }}
                                >
                                  ✦ {det.dims} dims contributed to B1-B8
                                </p>
                              )}
                            </div>
                          )}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === PHASES section === */}
      {activeSection === "phases" && (
        <div className="p-3">
          <p
            className="font-mono text-[8px] uppercase tracking-widest mb-3"
            style={{ color: DIM }}
          >
            PARALLAX BUILD PHASES — 726,000 LINES · 304 CANISTERS
          </p>
          <div className="space-y-1" data-ocid="build_status.table">
            {PHASES.map((ph, idx) => {
              const isActive = ph.status === "ACTIVE";
              const isNext = ph.status === "NEXT";
              const isDone = ph.status === "DONE";
              const accentColor = isActive
                ? AMBER
                : isNext
                  ? CYAN
                  : isDone
                    ? GREEN
                    : DIM;
              return (
                <div
                  key={ph.id}
                  data-ocid={`build_status.row.${idx + 1}`}
                  className="flex items-start gap-2 px-2 py-1.5 rounded-sm"
                  style={{
                    background: isActive
                      ? `${AMBER}08`
                      : isNext
                        ? `${CYAN}06`
                        : isDone
                          ? `${GREEN}08`
                          : `${DIM}05`,
                    border: `1px solid ${accentColor}25`,
                  }}
                >
                  <div
                    className="font-mono text-[8px] font-bold shrink-0 text-center min-w-[28px]"
                    style={{ color: accentColor }}
                  >
                    {ph.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className="font-mono text-[8px] font-bold"
                        style={{
                          color: isActive || isNext ? FG : isDone ? GREEN : FG,
                        }}
                      >
                        {ph.name}
                      </span>
                      <span
                        className="font-mono text-[7px] px-1.5 py-0.5 rounded-sm shrink-0 ml-2"
                        style={{
                          background: `${accentColor}20`,
                          color: accentColor,
                        }}
                      >
                        {ph.status}
                      </span>
                    </div>
                    <div className="flex gap-3 mt-0.5">
                      <span
                        className="font-mono text-[7px]"
                        style={{ color: DIM }}
                      >
                        {ph.lines > 0
                          ? `+${ph.lines.toLocaleString()} lines`
                          : "pre-code"}
                      </span>
                      <span
                        className="font-mono text-[7px]"
                        style={{ color: DIM }}
                      >
                        {ph.canisters > 0
                          ? `+${ph.canisters} canisters`
                          : "single canister"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div
            className="mt-3 p-2 rounded-sm"
            style={{ background: DEEP, border: `1px solid ${CYAN}20` }}
          >
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: "TOTAL LINES", value: "726,000" },
                { label: "TOTAL CANISTERS", value: "304" },
                { label: "TOTAL PHASES", value: PHASES.length.toString() },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div
                    className="font-mono text-[9px] font-bold"
                    style={{ color: CYAN }}
                  >
                    {value}
                  </div>
                  <div
                    className="font-mono text-[7px] uppercase tracking-widest"
                    style={{ color: DIM }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === DIMENSIONS section === */}
      {activeSection === "dimensions" && (
        <div className="p-3">
          <div className="flex items-center justify-between mb-1">
            <p
              className="font-mono text-[8px] uppercase tracking-widest"
              style={{ color: DIM }}
            >
              DIMENSION ARCHITECTURE — TARGET: 4,096 (2^12 = H_MAX 12 BITS)
            </p>
            <span
              className="font-mono text-[8px] font-bold"
              style={{ color: INDIGO }}
            >
              {totalDimBuilt} / 4096
            </span>
          </div>
          <BarRow label="Total Progress" pct={dimPct} color={INDIGO} />
          <div className="mt-3 space-y-2" data-ocid="build_status.table">
            {DIM_BLOCKS.map((block, idx) => {
              const pct = (block.built / block.target) * 100;
              return (
                <div key={block.id} data-ocid={`build_status.item.${idx + 1}`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono text-[8px] font-bold w-5"
                        style={{ color: block.color }}
                      >
                        {block.id}
                      </span>
                      <span
                        className="font-mono text-[8px]"
                        style={{ color: FG }}
                      >
                        {block.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono text-[7px]"
                        style={{ color: block.color }}
                      >
                        {block.built}
                      </span>
                      <span
                        className="font-mono text-[7px]"
                        style={{ color: DIM }}
                      >
                        / {block.target}
                      </span>
                    </div>
                  </div>
                  <div
                    className="w-full h-[4px] rounded-full"
                    style={{ background: "oklch(0.12 0.03 250)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(100, pct)}%`,
                        background: block.color,
                        boxShadow: `0 0 4px ${block.color}60`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div
            className="mt-4 p-2 rounded-sm"
            style={{ background: DEEP, border: `1px solid ${INDIGO}30` }}
          >
            <p
              className="font-mono text-[7px] leading-relaxed"
              style={{ color: DIM }}
            >
              <span style={{ color: INDIGO }}>4,096 = 2^12</span>
              {" ·  "}
              <span style={{ color: CYAN }}>
                H_max = log₂(4096) = 12.0 bits
              </span>
              {" ·  "}
              <span style={{ color: AMBER }}>
                12 tokens = 12 bits = sovereign
              </span>
            </p>
            <p className="font-mono text-[7px] mt-1" style={{ color: DIM }}>
              12 sphere axes · 12 metals · 12 tokens · 2^12 dimensions —
              mathematically sovereign.
            </p>
          </div>
        </div>
      )}

      {/* === ENTERPRISE section === */}
      {activeSection === "enterprise" && (
        <div className="p-3">
          <p
            className="font-mono text-[8px] uppercase tracking-widest mb-3"
            style={{ color: DIM }}
          >
            7 ENTERPRISE SYSTEMS — 0 COMPLETE · ALL PENDING
          </p>
          <div className="space-y-1.5" data-ocid="build_status.table">
            {ENTERPRISE_SYSTEMS.map((sys, idx) => {
              const isBuilt = sys.status === "BUILT";
              const isPartial = sys.status === "PARTIAL";
              const accentColor = isBuilt ? GREEN : isPartial ? AMBER : RED;
              return (
                <div
                  key={sys.name}
                  data-ocid={`build_status.item.${idx + 1}`}
                  className="p-2 rounded-sm"
                  style={{
                    background: `${accentColor}06`,
                    border: `1px solid ${accentColor}25`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{
                          background: accentColor,
                          boxShadow: isBuilt ? `0 0 4px ${GREEN}` : "none",
                        }}
                      />
                      <span
                        className="font-mono text-[8px] font-bold"
                        style={{ color: accentColor }}
                      >
                        {sys.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono text-[7px]"
                        style={{ color: DIM }}
                      >
                        PH-{sys.phase} · {sys.lines.toLocaleString()} lines
                      </span>
                      <span
                        className="font-mono text-[7px] px-1.5 py-0.5 rounded-sm"
                        style={{
                          background: `${accentColor}20`,
                          color: accentColor,
                        }}
                      >
                        {sys.status}
                      </span>
                    </div>
                  </div>
                  <p
                    className="font-mono text-[7px] mt-1 ml-3.5"
                    style={{ color: DIM }}
                  >
                    {sys.detail}
                  </p>
                </div>
              );
            })}
          </div>
          <div
            className="mt-3 p-2 rounded-sm"
            style={{ background: DEEP, border: `1px solid ${AMBER}20` }}
          >
            <p className="font-mono text-[7px]" style={{ color: AMBER }}>
              All enterprise system profits route 100% to creator reserve ·
              perpetual compounding
            </p>
          </div>
        </div>
      )}

      {/* === TOKENS section === */}
      {activeSection === "tokens" && (
        <div className="p-3">
          <p
            className="font-mono text-[8px] uppercase tracking-widest mb-3"
            style={{ color: DIM }}
          >
            12-TOKEN ECONOMY — 7 INLINE · MODULE NOT WIRED · 100% TO CREATOR
            RESERVE
          </p>
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
            data-ocid="build_status.table"
          >
            {TOKENS.map((tok, idx) => (
              <div
                key={tok.sym}
                data-ocid={`build_status.item.${idx + 1}`}
                className="flex flex-col items-center py-2 px-1 rounded-sm"
                style={{
                  background: tok.live ? `${CYAN}0a` : `${DIM}08`,
                  border: `1px solid ${tok.live ? CYAN : DIM}25`,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full mb-1"
                  style={{
                    background: tok.live ? CYAN : DIM,
                    boxShadow: tok.live ? `0 0 6px ${CYAN}` : "none",
                  }}
                />
                <span
                  className="font-mono text-[8px] font-bold text-center"
                  style={{ color: tok.live ? CYAN : DIM }}
                >
                  {tok.sym}
                </span>
                <span
                  className="font-mono text-[6px] mt-0.5"
                  style={{ color: DIM }}
                >
                  {tok.note}
                </span>
              </div>
            ))}
          </div>
          <div
            className="mt-3 p-2 rounded-sm space-y-1"
            style={{ background: DEEP, border: `1px solid ${CYAN}20` }}
          >
            <p className="font-mono text-[7px]" style={{ color: DIM }}>
              <span style={{ color: GREEN }}>FORMA</span> = internal fuel, not
              wealth · never externally sold
            </p>
            <p className="font-mono text-[7px]" style={{ color: DIM }}>
              <span style={{ color: AMBER }}>MRC</span> = meta-currency ·
              compounds from every token · every generation · every level ·
              required for Jacob&apos;s Ladder
            </p>
            <p className="font-mono text-[7px]" style={{ color: DIM }}>
              token_economy.mo on disk (12 tokens) — NOT wired · Phase K
            </p>
          </div>
        </div>
      )}

      {/* === MISSIONS section === */}
      {activeSection === "missions" && (
        <div className="p-3">
          <p
            className="font-mono text-[8px] uppercase tracking-widest mb-3"
            style={{ color: DIM }}
          >
            10 SOVEREIGN MISSIONS — 8 ACTIVE · 2 PENDING
          </p>
          <div className="space-y-1" data-ocid="build_status.table">
            {MISSIONS.map((m, idx) => (
              <div
                key={m.id}
                data-ocid={`build_status.item.${idx + 1}`}
                className="flex items-center gap-2 px-2 py-1.5 rounded-sm"
                style={{
                  background: m.active ? `${GREEN}08` : `${DIM}05`,
                  border: `1px solid ${m.active ? GREEN : DIM}25`,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background: m.active ? GREEN : DIM,
                    boxShadow: m.active ? `0 0 4px ${GREEN}` : "none",
                  }}
                />
                <span
                  className="font-mono text-[7px] font-bold w-8 shrink-0"
                  style={{ color: DIM }}
                >
                  {m.id}
                </span>
                <span
                  className="font-mono text-[8px] flex-1"
                  style={{ color: m.active ? FG : DIM }}
                >
                  {m.name}
                </span>
                <span
                  className="font-mono text-[7px] px-1.5 py-0.5 rounded-sm"
                  style={{
                    background: m.active ? `${GREEN}20` : `${DIM}15`,
                    color: m.active ? GREEN : DIM,
                  }}
                >
                  {m.active ? "ACTIVE" : "PENDING"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === WIRE QUEUE section === */}
      {activeSection === "wirequeue" && (
        <div className="p-3">
          {/* Pre-flight bugs block */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="font-mono text-[8px] uppercase tracking-widest"
                style={{ color: RED }}
              >
                ⚠ PRE-FLIGHT BUGS — FIX BEFORE ANY WIRING
              </span>
              <span
                className="font-mono text-[7px] px-1.5 py-0.5 rounded-sm"
                style={{ background: `${RED}20`, color: RED }}
              >
                {PREFLIGHT_BUGS.length} CRITICAL
              </span>
            </div>
            <div className="space-y-1">
              {PREFLIGHT_BUGS.map((bug) => (
                <div
                  key={bug.id}
                  className="flex gap-2 px-2 py-1.5 rounded-sm"
                  style={{
                    background: `${RED}06`,
                    border: `1px solid ${RED}25`,
                  }}
                >
                  <span
                    className="font-mono text-[7px] font-bold shrink-0"
                    style={{ color: RED }}
                  >
                    #{bug.id}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="font-mono text-[7.5px] font-bold"
                        style={{ color: AMBER }}
                      >
                        {bug.file}
                      </span>
                      <span
                        className="font-mono text-[6.5px] px-1 py-0.5 rounded-sm"
                        style={{
                          background:
                            bug.severity === "COMPILATION ERROR"
                              ? `${RED}20`
                              : bug.severity === "DATA LOSS"
                                ? `${AMBER}20`
                                : `${DIM}15`,
                          color:
                            bug.severity === "COMPILATION ERROR"
                              ? RED
                              : bug.severity === "DATA LOSS"
                                ? AMBER
                                : DIM,
                        }}
                      >
                        {bug.severity}
                      </span>
                    </div>
                    <p
                      className="font-mono text-[7px] mt-0.5"
                      style={{ color: DIM }}
                    >
                      {bug.issue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wiring layers */}
          <p
            className="font-mono text-[8px] uppercase tracking-widest mb-2"
            style={{ color: DIM }}
          >
            MODULE DEPENDENCY GRAPH — 8 LAYERS · 16 MODULES
          </p>
          <div className="space-y-1.5" data-ocid="build_status.table">
            {WIRE_LAYERS.map((layer, idx) => {
              const isReady = layer.status === "READY";
              const isDone = layer.status === "DONE";
              const accentColor = isDone ? GREEN : isReady ? CYAN : DIM;
              return (
                <div
                  key={layer.layer}
                  data-ocid={`build_status.item.${idx + 1}`}
                  className="p-2 rounded-sm"
                  style={{
                    background: isDone
                      ? `${GREEN}08`
                      : isReady
                        ? `${CYAN}06`
                        : `${DIM}05`,
                    border: `1px solid ${accentColor}30`,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono text-[8px] font-bold"
                        style={{ color: accentColor }}
                      >
                        LAYER {layer.layer}
                      </span>
                      <span
                        className="font-mono text-[7px] px-1.5 py-0.5 rounded-sm"
                        style={{
                          background: `${accentColor}20`,
                          color: accentColor,
                        }}
                      >
                        {layer.status}
                      </span>
                      {layer.blockedBy && (
                        <span
                          className="font-mono text-[6.5px]"
                          style={{ color: DIM }}
                        >
                          blocked on {layer.blockedBy}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {layer.modules.map((mod) => (
                      <span
                        key={mod}
                        className="font-mono text-[7px] px-1.5 py-0.5 rounded-sm"
                        style={{
                          background: `${accentColor}10`,
                          color: accentColor,
                          border: `1px solid ${accentColor}20`,
                        }}
                      >
                        {mod}.mo
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary note */}
          <div
            className="mt-3 p-2 rounded-sm"
            style={{ background: DEEP, border: `1px solid ${CYAN}20` }}
          >
            <p className="font-mono text-[7px]" style={{ color: DIM }}>
              <span style={{ color: CYAN }}>Wire order is strict.</span> Each
              layer depends on the previous. Fix pre-flight bugs first, then
              wire Layer 0. Each wire = 1 import + 1 stable var + 1 heartbeat
              call + deploy + verify.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
