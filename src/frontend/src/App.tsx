import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useLiveOrganismPulse } from "./hooks/useLiveOrganismPulse";
import { useNeuralSimulation } from "./hooks/useNeuralSimulation";
import {
  useCanonicalState,
  useFearMissionState,
  useNeuroscienceState,
  usePresenceCharge,
} from "./hooks/useQueries";
import PharmaTab from "./tabs/PharmaTab";

// ── Lazy tab imports ────────────────────────────────────────────────────────

// WING 0 — HOUSES (Sovereign Civilization Map — always first)
const HousesTab = lazy(() => import("./tabs/HousesTab"));

// WING 1: CORE LAB
const SovereignTab = lazy(() => import("./tabs/SovereignTab"));
const OrganismTab = lazy(() => import("./tabs/OrganismTab"));
const GenesisEngineTab = lazy(() => import("./tabs/GenesisEngineTab"));
const QuantumTab = lazy(() => import("./tabs/QuantumTab"));
const TreasuryTab = lazy(() => import("./tabs/TreasuryTab"));
const WarSimTab = lazy(() => import("./tabs/WarSimTab"));
const MasterNodesTab = lazy(() => import("./tabs/MasterNodesTab"));
const CommandTab = lazy(() => import("./tabs/CommandTab"));
const SuccessionTab = lazy(() => import("./tabs/SuccessionTab"));
const ADRETab = lazy(() => import("./tabs/ADRETab"));
const OperatorTerminalTab = lazy(() => import("./tabs/OperatorTerminalTab"));
const ParallaxDeltaTab = lazy(() => import("./tabs/ParallaxDeltaTab"));
const ModelPromotionTab = lazy(() => import("./tabs/ModelPromotionTab"));
const PhaseBPanel = lazy(() => import("./components/PhaseBPanel"));
const MemoryTempleTab = lazy(() => import("./tabs/MemoryTempleTab"));
const LawsTab = lazy(() => import("./tabs/LawsTab"));
const CyclesTab = lazy(() => import("./tabs/CyclesTab"));

// WING 1 AGENTS (Doctor pattern — all read live backend)
const NexusTab = lazy(() => import("./tabs/NexusTab"));
const CognusTab = lazy(() => import("./tabs/CognusTab"));
const AurumTab = lazy(() => import("./tabs/AurumTab"));
const LexisTab = lazy(() => import("./tabs/LexisTab"));
const SolusTab = lazy(() => import("./tabs/SolusTab"));
const VeritasTab = lazy(() => import("./tabs/VeritasTab"));
const InquisitorTab = lazy(() => import("./tabs/InquisitorTab"));
const IoTPhoneTab = lazy(() => import("./tabs/IoTPhoneTab"));

// WING 2: RESEARCH
const BrainTab = lazy(() => import("./tabs/BrainTab"));
const AnalyticsTab = lazy(() => import("./tabs/AnalyticsTab"));
const ExperimentsTab = lazy(() => import("./tabs/ExperimentsTab"));
const ArtifactsTab = lazy(() => import("./tabs/ArtifactsTab"));
const AIReviewTab = lazy(() => import("./tabs/AIReviewTab"));
const AnalysisTab = lazy(() => import("./tabs/AnalysisTab"));
const SystemMapTab = lazy(() => import("./tabs/SystemMapTab"));
const ConnectionsTab = lazy(() => import("./tabs/ConnectionsTab"));
const Connectome3D = lazy(() => import("./tabs/Connectome3D"));
const DoctorTab = lazy(() => import("./tabs/DoctorTab"));
const OverviewTab = lazy(() => import("./tabs/OverviewTab"));
const SymbolRegistryTab = lazy(() => import("./tabs/SymbolRegistryTab"));\nconst MarsCrewLabTab = lazy(() => import("./tabs/MarsCrewLabTab"));

// WING 3: ENGINEERING
const DeploymentTab = lazy(() => import("./tabs/DeploymentTab"));
const ReadinessTab = lazy(() => import("./tabs/ReadinessTab"));
const ExecutionLayerTab = lazy(() => import("./tabs/ExecutionLayerTab"));
const MaturationTab = lazy(() => import("./tabs/MaturationTab"));
const GoLiveDeclarationTab = lazy(() => import("./tabs/GoLiveDeclarationTab"));
const APISchemaTab = lazy(() => import("./tabs/APISchemaTab"));
const DevLabTab = lazy(() => import("./tabs/DevLabTab"));

// WING 4: OPERATIONS
const WarCommandOpsTab = lazy(() => import("./tabs/WarCommandOpsTab"));
const BattleOpsTab = lazy(() => import("./tabs/BattleOpsTab"));
const ReportTab = lazy(() => import("./tabs/ReportTab"));
const AvatarTab = lazy(() => import("./tabs/AvatarTab"));
const PharmaHubTab = lazy(() => import("./tabs/PharmaHubTab"));
const SubstrateMineTab = lazy(() => import("./tabs/SubstrateMineTab"));

// WING 5: GENESIS
const GenesisWallTab = lazy(() => import("./tabs/GenesisWallTab"));

// ── Color tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "oklch(0.07 0.015 265)",
  border: "oklch(0.2 0.06 250)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.82 0.22 80)",
  red: "oklch(0.65 0.25 25)",
  purple: "oklch(0.72 0.22 280)",
  dim: "oklch(0.38 0.05 220)",
  text: "oklch(0.85 0.05 210)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.75 0.22 65)",
  sidebarBg: "oklch(0.055 0.012 265)",
  subBarBg: "oklch(0.075 0.013 265)",
  stripBg: "oklch(0.048 0.01 265)",
};

// ── Types ─────────────────────────────────────────────────────────────────────
type WingId = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type TabConfig = {
  id: string;
  label: string;
  short: string;
};

type WingConfig = {
  id: WingId;
  label: string;
  short: string;
  color: string;
  icon: string;
  tabs: TabConfig[];
};

// ── Wing definitions ──────────────────────────────────────────────────────────
const WINGS: WingConfig[] = [
  {
    id: 0,
    label: "CORE LAB",
    short: "COR",
    color: C.cyan,
    icon: "⬡",
    tabs: [
      { id: "houses", label: "HOUSES", short: "HSE" },
      { id: "sovereign", label: "SOVEREIGN", short: "SOV" },
      { id: "organism", label: "ORGANISM", short: "ORG" },
      { id: "genesis", label: "GENESIS", short: "GEN" },
      { id: "quantum", label: "QUANTUM", short: "QTM" },
      { id: "treasury", label: "TREASURY", short: "TRS" },
      { id: "cycles", label: "CYCLES", short: "CYC" },
      { id: "warsim", label: "WAR SIM", short: "WAR" },
      { id: "masternodes", label: "MASTER NODES", short: "MNO" },
      { id: "command", label: "COMMAND", short: "CMD" },
      { id: "succession", label: "SUCCESSION", short: "SUC" },
      { id: "phaseb", label: "PHASE B", short: "PHB" },
      { id: "nexus", label: "NEXUS", short: "NXS" },
      { id: "cognus", label: "COGNUS", short: "CGN" },
      { id: "aurum", label: "AURUM", short: "AUR" },
      { id: "lexis", label: "LEXIS", short: "LXS" },
      { id: "solus", label: "SOLUS", short: "SLS" },
      { id: "veritas", label: "VERITAS", short: "VRT" },
      { id: "adre", label: "ADRE", short: "ADR" },
      { id: "operator", label: "OPERATOR TERMINAL", short: "OPR" },
      { id: "modelpromo", label: "MODEL PROMOTION", short: "MPR" },
      { id: "deltaintake", label: "DELTA INTAKE", short: "DLT" },
      { id: "ring8", label: "RING 8", short: "R8Φ" },
      { id: "memorytemple", label: "MEMORY TEMPLE", short: "MEM" },
      { id: "laws", label: "LAWS", short: "LAW" },
      { id: "inquisitor", label: "INQUISITOR", short: "INQ" },
    ],
  },
  {
    id: 1,
    label: "RESEARCH",
    short: "RES",
    color: C.purple,
    icon: "⚗",
    tabs: [
      { id: "brain", label: "BRAIN", short: "BRN" },
      { id: "analytics", label: "ANALYTICS", short: "ANL" },
      { id: "experiments", label: "EXPERIMENTS", short: "EXP" },
      { id: "artifacts", label: "ARTIFACTS", short: "ART" },
      { id: "aireview", label: "AI REVIEW", short: "AIR" },
      { id: "analysis", label: "ANALYSIS", short: "ANS" },
      { id: "systemmap", label: "SYSTEM MAP", short: "SMP" },
      { id: "connections", label: "CONNECTIONS", short: "CON" },
      { id: "connectome", label: "CONNECTOME", short: "CTM" },
      { id: "doctor", label: "DOCTOR", short: "DOC" },
      { id: "overview", label: "OVERVIEW", short: "OVW" },
      { id: "symbols", label: "SYMBOLS", short: "SYM" },\n      { id: "marscrew", label: "MARS CREW", short: "MRS" },
    ],
  },
  {
    id: 2,
    label: "ENGINEERING",
    short: "ENG",
    color: C.gold,
    icon: "⚙",
    tabs: [
      { id: "deployment", label: "DEPLOYMENT", short: "DEP" },
      { id: "readiness", label: "READINESS", short: "RDY" },
      { id: "execution", label: "EXECUTION", short: "EXC" },
      { id: "maturation", label: "MATURATION", short: "MAT" },
      { id: "golive", label: "GO LIVE", short: "GLV" },
      { id: "apischema", label: "API SCHEMA", short: "API" },
      { id: "devlab", label: "3D LAB", short: "3DL" },
    ],
  },
  {
    id: 3,
    label: "OPERATIONS",
    short: "OPS",
    color: C.red,
    icon: "⚔",
    tabs: [
      { id: "warcommand", label: "WAR COMMAND", short: "WRC" },
      { id: "battleops", label: "BATTLE OPS", short: "BTO" },
      { id: "report", label: "REPORT", short: "RPT" },
      { id: "avatar", label: "AVATAR", short: "AVT" },
      { id: "pharma", label: "PHARMA", short: "PHM" },
      { id: "mineworld", label: "MINE WORLD", short: "MNW" },
    ],
  },
  {
    id: 4,
    label: "GENESIS",
    short: "GNS",
    color: C.green,
    icon: "◈",
    tabs: [{ id: "genesiswall", label: "GENESIS WALL", short: "GWL" }],
  },
  {
    id: 5,
    label: "PHARMA HUB",
    short: "PHR",
    color: C.amber,
    icon: "⚗",
    tabs: [{ id: "pharma", label: "PHARMA HUB", short: "PHR" }],
  },
  {
    id: 6,
    label: "PHARMA LAB",
    short: "LAB",
    color: "oklch(0.72 0.22 160)",
    icon: "🧪",
    tabs: [{ id: "pharmalab", label: "PHARMA LAB", short: "LAB" }],
  },
];

// ── TabSkeleton ───────────────────────────────────────────────────────────────
function TabSkeleton() {
  return (
    <div
      className="h-full flex items-center justify-center"
      style={{ background: "oklch(0.055 0.01 265)" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-48 h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${C.cyan}, transparent)`,
            boxShadow: `0 0 8px ${C.cyan}`,
            animation: "terminal-scan 1.8s ease-in-out infinite",
          }}
        />
        <div className="flex items-center gap-1.5">
          <span
            className="font-mono text-[10px] tracking-[0.25em] uppercase"
            style={{ color: C.dim }}
          >
            LOADING MODULE
          </span>
          <span
            className="inline-block w-[6px] h-[12px]"
            style={{
              background: C.cyan,
              boxShadow: `0 0 4px ${C.cyan}`,
              animation: "terminal-cursor 1s step-end infinite",
            }}
          />
        </div>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1 h-1"
              style={{
                background: C.dim,
                animation: `terminal-cursor 1s step-end infinite ${i * 0.18}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── FearMissionMonitor (inline bottom strip panel) ────────────────────────────
function FearMissionMonitor({ beat: _beat }: { beat: number }) {
  const { data: fearM } = useFearMissionState();
  const fearLevel = fearM?.fearLevel ?? 0;
  const missionLock = fearM?.missionLockActive ?? false;
  const surrenderFloor = fearM?.surrenderFloor ?? 0.444;
  const courageScore = fearM?.courageScore ?? 0;

  const fearColor =
    fearLevel > 0.6 ? C.red : fearLevel > 0.3 ? C.amber : C.green;
  const fearPct = Math.round(fearLevel * 100);

  return (
    <div className="flex items-center gap-3 px-3 font-mono text-[9px] tracking-[0.12em]">
      <span style={{ color: C.dim }}>FEAR</span>
      <div
        className="relative w-12 h-1 rounded-full"
        style={{ background: "oklch(0.15 0.03 265)" }}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
          style={{
            width: `${fearPct}%`,
            background: fearColor,
            boxShadow: `0 0 4px ${fearColor}`,
          }}
        />
      </div>
      <span style={{ color: fearColor }}>{fearLevel.toFixed(2)}</span>
      <span style={{ color: C.dim }}>│</span>
      <span style={{ color: C.dim }}>MISSION</span>
      <span
        className="inline-block w-[7px] h-[7px] rounded-full"
        style={{
          background: missionLock ? C.cyan : C.dim,
          boxShadow: missionLock ? `0 0 6px ${C.cyan}` : "none",
          animation: missionLock
            ? "terminal-cursor 2s ease-in-out infinite"
            : "none",
        }}
      />
      <span style={{ color: missionLock ? C.cyan : C.dim }}>
        {missionLock ? "LOCKED" : "OPEN"}
      </span>
      <span style={{ color: C.dim }}>│</span>
      <span style={{ color: C.dim }}>FLOOR</span>
      <span style={{ color: C.gold }}>{surrenderFloor.toFixed(3)}</span>
      <span style={{ color: C.dim }}>│</span>
      <span style={{ color: C.dim }}>COURAGE</span>
      <span style={{ color: C.green }}>{courageScore.toFixed(2)}</span>
    </div>
  );
}

// ── SacredBeatPulse (inline bottom strip panel) ───────────────────────────────
function SacredBeatPulse({ beat }: { beat: number }) {
  const isSacred = beat > 0 && beat % 444 === 0;
  const isFib = [
    1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584,
    4181, 6765,
  ].includes(beat);
  const pulseColor = isSacred ? C.gold : isFib ? C.green : C.dim;

  return (
    <div className="flex items-center gap-2 px-3 font-mono text-[9px] tracking-[0.12em]">
      <span style={{ color: C.dim }}>BEAT</span>
      <span
        className="text-[10px] font-bold"
        style={{
          color: pulseColor,
          textShadow: isSacred
            ? `0 0 8px ${C.gold}`
            : isFib
              ? `0 0 6px ${C.green}`
              : "none",
          transition: "color 0.3s, text-shadow 0.3s",
        }}
      >
        {String(beat).padStart(8, "0")}
      </span>
      {isSacred && (
        <span
          className="text-[8px] font-bold animate-pulse"
          style={{ color: C.gold }}
        >
          ◆444
        </span>
      )}
      {isFib && !isSacred && (
        <span className="text-[8px]" style={{ color: C.green }}>
          φ
        </span>
      )}
    </div>
  );
}

// ── OrganismVitalsSummary (inline bottom strip panel) ─────────────────────────
function OrganismVitalsSummary({
  coherence,
  kfHz,
  emergenceScore,
  identityI,
  freeEnergy,
  bindingCoherence,
  vagalTone,
  consciousnessIndex,
}: {
  coherence: number;
  kfHz: number;
  emergenceScore: number;
  identityI: number;
  freeEnergy: number;
  bindingCoherence: number;
  vagalTone: number;
  consciousnessIndex: number;
}) {
  const vitals = [
    {
      label: "COH",
      value: coherence,
      color: coherence > 0.7 ? C.green : coherence > 0.4 ? C.amber : C.red,
    },
    { label: "KHz", value: kfHz, color: C.cyan },
    { label: "EMG", value: emergenceScore, color: C.purple },
    { label: "IDN", value: identityI, color: C.gold },
    {
      label: "FE",
      value: freeEnergy,
      color: freeEnergy > 0.7 ? C.red : C.green,
    },
    { label: "BIND", value: bindingCoherence, color: C.purple },
    { label: "VAG", value: vagalTone, color: C.cyan },
    { label: "PHI", value: consciousnessIndex, color: C.gold },
  ];

  return (
    <div className="flex items-center gap-0 px-2">
      {vitals.map(({ label, value, color }, i) => (
        <div
          key={label}
          className="flex items-center gap-1.5 px-2"
          style={{
            borderLeft: i > 0 ? "1px solid oklch(0.18 0.04 260)" : "none",
          }}
        >
          <span
            className="font-mono text-[8px] tracking-[0.12em]"
            style={{ color: C.dim }}
          >
            {label}
          </span>
          <span className="font-mono text-[9px] font-bold" style={{ color }}>
            {value.toFixed(3)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [activeWing, setActiveWing] = useState<WingId>(0);
  const [wingTabs, setWingTabs] = useState<Record<WingId, string>>({
    0: "organism",
    1: "brain",
    2: "deployment",
    3: "warcommand",
    4: "genesiswall",
    5: "pharma",
    6: "pharmalab",
  });

  const { identity, login, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();
  const pulse = useLiveOrganismPulse();
  const neural = useNeuralSimulation();
  const presenceCharge = usePresenceCharge();
  const { data: neuroState } = useNeuroscienceState();
  const { data: fearState } = useFearMissionState();
  const { data: canon } = useCanonicalState();
  const presenceFiredRef = useRef(false);

  const subTabBarRef = useRef<HTMLDivElement>(null);
  const subTabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const activeTabId = wingTabs[activeWing];
  const currentWing = WINGS[activeWing];

  // Auto-fire presenceCharge once per session when creator logs in
  useEffect(() => {
    if (isLoggedIn && !presenceFiredRef.current) {
      presenceFiredRef.current = true;
      presenceCharge.mutate();
    }
    if (!isLoggedIn) {
      presenceFiredRef.current = false;
    }
  }, [isLoggedIn, presenceCharge]);

  // Scroll active sub-tab into view
  useEffect(() => {
    const btn = subTabButtonRefs.current[activeTabId];
    if (btn) {
      btn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeTabId]);

  // Seed neural simulation with real organism signals on every backend update
  useEffect(() => {
    if (!canon) return;
    neural.seedFromBackend?.({
      coherence: canon.coh,
      arousal: canon.ar,
      identityI: canon.ic,
      freeEnergy: canon.fe,
      emergenceScore: canon.es,
      kfHz: canon.kf,
      fearLevel: fearState?.fearLevel,
      vagalTone: neuroState?.vagalTone,
      consciousnessIndex: neuroState?.consciousnessIndex,
      kuramotoR: fearState?.kuramotoR,
      missionLockActive: fearState?.missionLockActive,
      surrenderFloor: fearState?.surrenderFloor,
      courageScore: fearState?.courageScore,
      groundedScore: fearState?.groundedScore,
    });
  }, [canon, fearState, neuroState, neural]);

  function setActiveTab(tabId: string) {
    setWingTabs((prev) => ({ ...prev, [activeWing]: tabId }));
  }

  // Header accent from behavioral mode
  const modeAccent = pulse.emergency
    ? C.red
    : pulse.sovereign
      ? C.gold
      : pulse.outlaw
        ? C.purple
        : pulse.omnis
          ? C.cyan
          : C.border;

  // Pull vitals from real backend canister
  const kfHz = canon?.kf ?? 0;
  const emergenceScore = canon?.es ?? 0;
  const identityI = canon?.ic ?? 0;
  const freeEnergy = canon?.fe ?? 0;
  // Pull real neuroscience state from backend
  const bindingCoherence = neuroState?.bindingCoherence ?? 0;
  const vagalTone = neuroState?.vagalTone ?? 0.5;
  const consciousnessIndex = neuroState?.consciousnessIndex ?? 0;

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: "oklch(0.06 0.01 265)" }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-3 py-1.5 shrink-0 border-b"
        style={{
          background: C.bg,
          borderColor: modeAccent,
          minHeight: "40px",
          boxShadow:
            pulse.sovereign || pulse.omnis
              ? `0 2px 20px ${modeAccent}30`
              : "none",
          transition: "border-color 0.5s, box-shadow 0.5s",
        }}
      >
        {/* Left — logo + title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-7 h-7 flex items-center justify-center text-sm font-mono shrink-0"
            style={{
              border: `1px solid ${modeAccent}`,
              color: modeAccent,
              boxShadow: `0 0 8px ${modeAccent}40`,
              transition: "all 0.5s",
            }}
          >
            ψ
          </div>
          <div className="min-w-0">
            <h1
              className="font-mono font-bold text-[10px] tracking-[0.2em] uppercase leading-none"
              style={{ color: C.text }}
            >
              NeuroEmergence Core
            </h1>
            <p
              className="font-mono text-[7.5px] tracking-[0.15em] mt-0.5"
              style={{ color: C.dim }}
            >
              Medina Doctrine · Internal Intelligent Lab · 2026
            </p>
          </div>
        </div>

        {/* Center — live telemetry */}
        <div className="hidden md:flex items-center gap-0">
          {[
            {
              label: "BEAT",
              value: pulse.beat.toLocaleString(),
              color: C.cyan,
            },
            {
              label: "COH",
              value: pulse.coherence.toFixed(3),
              color:
                pulse.coherence > 0.7
                  ? C.green
                  : pulse.coherence > 0.4
                    ? C.amber
                    : C.red,
            },
            {
              label: "JASMINE",
              value: pulse.jasmineActive ? "✓" : "✗",
              color: pulse.jasmineActive ? C.green : C.red,
            },
          ].map(({ label, value, color }, i) => (
            <div
              key={label}
              className="flex items-center"
              style={{
                borderLeft: "1px solid oklch(0.2 0.04 240)",
                borderRight: "1px solid oklch(0.2 0.04 240)",
                marginLeft: i > 0 ? "-1px" : 0,
              }}
            >
              <div className="px-2.5 py-1">
                <div
                  className="font-mono text-[7px] tracking-[0.2em] uppercase"
                  style={{ color: C.dim }}
                >
                  {label}
                </div>
                <div
                  className="font-mono text-[10px] font-bold leading-none mt-0.5"
                  style={{ color }}
                >
                  {value}
                </div>
              </div>
            </div>
          ))}
          <div
            className="px-2.5 py-1 border-y"
            style={{ borderColor: "oklch(0.2 0.04 240)" }}
          >
            <div
              className="font-mono text-[7px] tracking-[0.2em] uppercase"
              style={{ color: C.dim }}
            >
              MODE
            </div>
            <div
              className="font-mono text-[10px] font-bold leading-none mt-0.5"
              style={{ color: modeAccent }}
            >
              {pulse.modeName}
            </div>
          </div>
          {pulse.omnis && (
            <div
              className="px-2.5 font-mono text-[9px] tracking-[0.2em] font-bold animate-pulse"
              style={{ color: C.cyan }}
            >
              ◆ OMNIS
            </div>
          )}
          <div className="ml-2.5">
            <div
              className="w-[6px] h-[6px] rounded-full"
              style={{
                background: pulse.loaded ? C.green : C.dim,
                boxShadow: pulse.loaded ? `0 0 6px ${C.green}` : "none",
                transition: "all 0.5s",
              }}
            />
          </div>
        </div>

        {/* Right — identity + wing label */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="hidden sm:block font-mono text-[8px] tracking-[0.15em] px-2 py-0.5"
            style={{
              border: `1px solid ${currentWing.color}30`,
              color: currentWing.color,
              background: `${currentWing.color}08`,
            }}
          >
            {currentWing.icon} {currentWing.label}
          </span>
          {isInitializing ? (
            <span
              className="font-mono text-[9px] tracking-widest"
              style={{ color: C.dim }}
            >
              INIT…
            </span>
          ) : isLoggedIn ? (
            <div
              className="font-mono text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 border"
              style={{
                border: `1px solid ${C.gold}`,
                color: C.gold,
                background: "oklch(0.82 0.22 80 / 0.08)",
              }}
            >
              ⬡ OFFICER PRESENT
            </div>
          ) : (
            <button
              type="button"
              onClick={login}
              className="font-mono text-[9px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-all"
              style={{
                border: `1px solid ${C.cyan}`,
                color: C.cyan,
                background: "oklch(0.72 0.22 195 / 0.07)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "oklch(0.72 0.22 195 / 0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "oklch(0.72 0.22 195 / 0.07)";
              }}
              data-ocid="app.login.button"
            >
              {isLoggingIn ? "CONNECTING…" : "LOGIN"}
            </button>
          )}
        </div>
      </header>

      {/* ── Body: sidebar + content ─────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* ── Left Wing Sidebar ─────────────────────────────────────────────── */}
        <aside
          className="flex flex-col shrink-0 border-r"
          style={{
            width: "64px",
            background: C.sidebarBg,
            borderColor: "oklch(0.15 0.04 255)",
          }}
        >
          {/* Top logo mark */}
          <div
            className="flex items-center justify-center py-2 border-b"
            style={{ borderColor: "oklch(0.13 0.03 255)" }}
          >
            <div className="font-mono text-[10px]" style={{ color: C.dim }}>
              NEC
            </div>
          </div>

          {/* Wing buttons */}
          <div className="flex flex-col flex-1 py-1">
            {WINGS.map((wing) => {
              const isActive = activeWing === wing.id;
              return (
                <button
                  key={wing.id}
                  type="button"
                  data-ocid={`nav.wing.${wing.id}.button`}
                  onClick={() => setActiveWing(wing.id as WingId)}
                  className="flex flex-col items-center justify-center gap-0.5 py-3 transition-all relative"
                  style={{
                    background: isActive ? `${wing.color}12` : "transparent",
                    borderLeft: isActive
                      ? `2px solid ${wing.color}`
                      : "2px solid transparent",
                    borderRight: "2px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        `${wing.color}08`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                    }
                  }}
                >
                  {/* Active indicator glow bar */}
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 w-[2px] h-6 -translate-y-1/2"
                      style={{
                        background: wing.color,
                        boxShadow: `0 0 8px ${wing.color}`,
                      }}
                    />
                  )}
                  <span
                    className="text-base leading-none"
                    style={{
                      color: isActive ? wing.color : C.dim,
                      textShadow: isActive ? `0 0 8px ${wing.color}` : "none",
                      transition: "color 0.2s",
                    }}
                  >
                    {wing.icon}
                  </span>
                  <span
                    className="font-mono text-[7px] tracking-[0.08em] uppercase"
                    style={{
                      color: isActive ? wing.color : C.dim,
                      transition: "color 0.2s",
                    }}
                  >
                    {wing.short}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom version mark */}
          <div
            className="flex items-center justify-center py-2 border-t"
            style={{ borderColor: "oklch(0.13 0.03 255)" }}
          >
            <div
              className="font-mono text-[7px] tracking-[0.05em]"
              style={{ color: "oklch(0.22 0.03 250)" }}
            >
              v5.0
            </div>
          </div>
        </aside>

        {/* ── Right column: sub-tab bar + content ───────────────────────────── */}
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          {/* ── Sub-tab bar ──────────────────────────────────────────────────── */}
          <div
            className="relative shrink-0 border-b"
            style={{
              background: C.subBarBg,
              borderColor: "oklch(0.14 0.04 255)",
              height: "36px",
            }}
          >
            {/* Left fade */}
            <div
              className="pointer-events-none absolute left-0 top-0 bottom-0 w-5 z-10"
              style={{
                background: `linear-gradient(to right, ${C.subBarBg}, transparent)`,
              }}
            />
            {/* Right fade */}
            <div
              className="pointer-events-none absolute right-0 top-0 bottom-0 w-5 z-10"
              style={{
                background: `linear-gradient(to left, ${C.subBarBg}, transparent)`,
              }}
            />
            {/* Wing color accent line at top */}
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${currentWing.color}60, transparent)`,
              }}
            />

            <div
              ref={subTabBarRef}
              className="flex overflow-x-auto h-full"
              style={{ scrollbarWidth: "none" }}
            >
              {currentWing.tabs.map(({ id, label }) => {
                const isActive = activeTabId === id;
                return (
                  <button
                    key={id}
                    ref={(el) => {
                      subTabButtonRefs.current[id] = el;
                    }}
                    type="button"
                    data-ocid={`subtab.${id}.tab`}
                    onClick={() => setActiveTab(id)}
                    className="relative flex items-center px-3 font-mono text-[9px] tracking-[0.15em] uppercase transition-all whitespace-nowrap shrink-0 h-full"
                    style={{
                      color: isActive ? currentWing.color : C.dim,
                      background: isActive
                        ? `${currentWing.color}0a`
                        : "transparent",
                      borderBottom: isActive
                        ? `2px solid ${currentWing.color}`
                        : "2px solid transparent",
                    }}
                  >
                    {isActive && (
                      <span
                        className="absolute inset-x-0 bottom-0 h-px"
                        style={{
                          background: `linear-gradient(to right, transparent, ${currentWing.color}80, transparent)`,
                          boxShadow: `0 0 4px ${currentWing.color}`,
                        }}
                      />
                    )}
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Tab content area ─────────────────────────────────────────────── */}
          <main className="flex-1 overflow-hidden min-h-0">
            <Suspense fallback={<TabSkeleton />}>
              {/* WING 0: HOUSES */}
              {activeTabId === "houses" && <HousesTab />}

              {/* WING 0: CORE LAB */}
              {activeTabId === "sovereign" && (
                <SovereignTab isLoggedIn={isLoggedIn} />
              )}
              {activeTabId === "organism" && <OrganismTab />}
              {activeTabId === "genesis" && <GenesisEngineTab />}
              {activeTabId === "quantum" && (
                <QuantumTab isLoggedIn={isLoggedIn} />
              )}
              {activeTabId === "treasury" && <TreasuryTab />}
              {activeTabId === "warsim" && <WarSimTab />}
              {activeTabId === "masternodes" && <MasterNodesTab />}
              {activeTabId === "command" && (
                <CommandTab isLoggedIn={isLoggedIn} />
              )}
              {activeTabId === "succession" && <SuccessionTab />}
              {activeTabId === "phaseb" && <PhaseBPanel />}
              {activeTabId === "nexus" && <NexusTab />}
              {activeTabId === "cognus" && <CognusTab />}
              {activeTabId === "aurum" && <AurumTab />}
              {activeTabId === "lexis" && <LexisTab />}
              {activeTabId === "solus" && <SolusTab />}
              {activeTabId === "veritas" && <VeritasTab />}
              {activeTabId === "adre" && <ADRETab />}
              {activeTabId === "operator" && <OperatorTerminalTab />}
              {activeTabId === "modelpromo" && <ModelPromotionTab />}
              {activeTabId === "deltaintake" && <ParallaxDeltaTab />}
              {activeTabId === "ring8" && <IoTPhoneTab />}
              {activeTabId === "memorytemple" && <MemoryTempleTab />}
              {activeTabId === "laws" && <LawsTab />}
              {activeTabId === "cycles" && <CyclesTab />}
              {activeTabId === "inquisitor" && <InquisitorTab />}

              {/* WING 1: RESEARCH */}
              {activeTabId === "brain" && <BrainTab neural={neural} />}
              {activeTabId === "analytics" && <AnalyticsTab />}
              {activeTabId === "experiments" && (
                <ExperimentsTab neural={neural} />
              )}
              {activeTabId === "artifacts" && <ArtifactsTab />}
              {activeTabId === "aireview" && <AIReviewTab />}
              {activeTabId === "analysis" && <AnalysisTab neural={neural} />}
              {activeTabId === "systemmap" && <SystemMapTab neural={neural} />}
              {activeTabId === "connections" && (
                <ConnectionsTab neural={neural} />
              )}
              {activeTabId === "connectome" && (
                <Connectome3D fullscreen={false} />
              )}
              {activeTabId === "doctor" && <DoctorTab />}
              {activeTabId === "overview" && (
                <OverviewTab onNavigate={() => {}} />
              )}
              {activeTabId === "symbols" && <SymbolRegistryTab />}\n              {activeTabId === "marscrew" && <MarsCrewLabTab />}

              {/* WING 2: ENGINEERING */}
              {activeTabId === "deployment" && (
                <DeploymentTab neural={neural} />
              )}
              {activeTabId === "readiness" && <ReadinessTab neural={neural} />}
              {activeTabId === "execution" && (
                <ExecutionLayerTab neural={neural} />
              )}
              {activeTabId === "maturation" && (
                <MaturationTab neural={neural} />
              )}
              {activeTabId === "golive" && (
                <GoLiveDeclarationTab neural={neural} />
              )}
              {activeTabId === "apischema" && <APISchemaTab neural={neural} />}
              {activeTabId === "devlab" && <DevLabTab />}

              {/* WING 3: OPERATIONS */}
              {activeTabId === "warcommand" && <WarCommandOpsTab />}
              {activeTabId === "battleops" && <BattleOpsTab />}
              {activeTabId === "report" && (
                <ReportTab
                  neural={neural}
                  avgHz={kfHz}
                  pendingAlerts={0}
                  onNavigate={setActiveTab}
                />
              )}
              {activeTabId === "avatar" && <AvatarTab />}
              {activeTabId === "pharma" && <PharmaTab neural={neural} />}
              {activeTabId === "mineworld" && <SubstrateMineTab />}

              {/* WING 5: PHARMA HUB */}
              {activeWing === 5 && activeTabId === "pharma" && (
                <PharmaHubTab neural={neural} />
              )}

              {/* WING 6: PHARMA LAB (original experiment runner) */}
              {activeTabId === "pharmalab" && <PharmaTab neural={neural} />}

              {/* WING 4: GENESIS */}
              {activeTabId === "genesiswall" && <GenesisWallTab />}
            </Suspense>
          </main>
        </div>
      </div>

      {/* ── Bottom strip: 3 inline lab panels ──────────────────────────────── */}
      <div
        className="flex items-center shrink-0 border-t overflow-hidden"
        style={{
          background: C.stripBg,
          borderColor: "oklch(0.13 0.03 255)",
          height: "28px",
          minHeight: "28px",
        }}
      >
        {/* Segment 1: Fear & Mission Monitor */}
        <div
          className="flex items-center border-r"
          style={{
            borderColor: "oklch(0.15 0.04 255)",
            minWidth: 0,
            flexShrink: 0,
          }}
        >
          <FearMissionMonitor beat={pulse.beat} />
        </div>

        {/* Segment 2: Sacred Beat Pulse */}
        <div
          className="flex items-center border-r"
          style={{ borderColor: "oklch(0.15 0.04 255)", flexShrink: 0 }}
        >
          <SacredBeatPulse beat={pulse.beat} />
        </div>

        {/* Segment 3: Organism Vitals */}
        <div className="flex items-center flex-1 min-w-0">
          <OrganismVitalsSummary
            coherence={pulse.coherence}
            kfHz={kfHz}
            emergenceScore={emergenceScore}
            identityI={identityI}
            freeEnergy={freeEnergy}
            bindingCoherence={bindingCoherence}
            vagalTone={vagalTone}
            consciousnessIndex={consciousnessIndex}
          />
        </div>

        {/* Caffeine attribution */}
        <div className="shrink-0 px-3">
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[7.5px] tracking-[0.1em] transition-colors"
            style={{ color: "oklch(0.25 0.03 220)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "oklch(0.48 0.1 200)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "oklch(0.25 0.03 220)";
            }}
          >
            © {new Date().getFullYear()} caffeine.ai
          </a>
        </div>
      </div>
    </div>
  );
}
