import { useEffect, useMemo, useRef, useState } from "react";
import { SharedTreatyPanel } from "../components/SharedTreatyPanel";
import {
  type DeploymentType,
  type IngestType,
  useBrainIntegrationSystem,
} from "../hooks/useBrainIntegrationSystem";
import type {
  NeuralSimulationControls,
  NeuralSimulationState,
} from "../hooks/useNeuralSimulation";
import { useCanonicalState, useFearMissionState } from "../hooks/useQueries";
import { createArtifact } from "../utils/artifactStore";
import { createDeploymentBindingManager } from "../utils/deploymentAdapters";
import { CONTRACT_VERSION } from "../utils/externalBindContract";
import { liveBrainBus } from "../utils/liveBrainBus";
import { runAutoChecks } from "../utils/readinessOrchestrator";

type Neural = NeuralSimulationState & NeuralSimulationControls;

const BORDER = "oklch(0.18 0.05 255)";
const CYAN = "oklch(0.72 0.22 195)";
const GREEN = "oklch(0.68 0.28 140)";
const AMBER = "oklch(0.78 0.22 80)";
const RED = "oklch(0.72 0.22 25)";
const MUTED = "oklch(0.38 0.05 220)";
const DIM = "oklch(0.28 0.04 240)";
const PANEL = "oklch(0.09 0.015 265)";
const PANEL_DARK = "oklch(0.07 0.012 265)";

const DEPLOYMENT_TYPES: DeploymentType[] = [
  "npc",
  "agent",
  "scenario",
  "robotics",
  "war_game",
  "command_testbed",
];

const INGEST_TYPES: IngestType[] = [
  "action_result",
  "outcome_trace",
  "failure_event",
  "route_outcome",
  "command_outcome",
  "experiment_result",
];

const API_GROUPS = [
  {
    group: "Instance Lifecycle",
    stability: "STABLE",
    endpoints: [
      {
        name: "create_instance",
        sig: "(request) → instance_id",
        fields:
          "instance_type, role_type, authority_level, scope_type, deployment_type, doctrine_profile",
      },
      { name: "destroy_instance", sig: "(instance_id)", fields: "instance_id" },
      {
        name: "get_instance_state",
        sig: "(instance_id) → BrainInstance",
        fields: "instance_id",
      },
    ],
  },
  {
    group: "Perception Ingest",
    stability: "STABLE",
    endpoints: [
      {
        name: "update_perception",
        sig: "(id, PerceptionPayload)",
        fields:
          "visible_entities[], audible_events[], terrain_features[], route_options[], objective_markers[], uncertainty_estimates[]",
      },
    ],
  },
  {
    group: "Embodiment Update",
    stability: "STABLE",
    endpoints: [
      {
        name: "update_embodiment",
        sig: "(id, EmbodimentPayload)",
        fields:
          "location, orientation, movement_state, stance, exposure, cover_quality, load_burden, damage_state, exertion_level",
      },
    ],
  },
  {
    group: "Regulation Update",
    stability: "STABLE",
    endpoints: [
      {
        name: "update_regulation",
        sig: "(id, RegulationPayload)",
        fields:
          "stress_signal, recovery_signal, fatigue_load, urgency_pressure, heart_rate_proxy, hrv_proxy, sympathetic_tone, parasympathetic_tone",
      },
    ],
  },
  {
    group: "Goal Context",
    stability: "STABLE",
    endpoints: [
      {
        name: "update_goal",
        sig: "(id, GoalContextPayload)",
        fields:
          "primary_goal, secondary_goals[], mission_relevance, rules_of_engagement, command_directives[], faction_state_summary",
      },
    ],
  },
  {
    group: "Runtime Step",
    stability: "STABLE",
    endpoints: [
      {
        name: "step_instance",
        sig: "(id, context) → BrainStepResult",
        fields:
          "dt, loop_type (fast|mid|slow), current_time, simulation_phase, event_flags[]",
      },
    ],
  },
  {
    group: "Action Output",
    stability: "STABLE",
    endpoints: [
      {
        name: "get_action",
        sig: "(id) → BrainActionPacket",
        fields:
          "policy_type, action_priority, route_id, target_id, movement_intent, retreat_flag, escalation_flag, rationale_summary, confidence_score",
      },
    ],
  },
  {
    group: "Analytics",
    stability: "STABLE",
    endpoints: [
      {
        name: "get_analytics_snapshot",
        sig: "(id) → AnalyticsPacket",
        fields:
          "instance health, compute usage, emergence metrics, regulation state",
      },
      {
        name: "get_brain_health",
        sig: "() → BrainHealthPacket",
        fields: "overall health, subsystem statuses, blocking failures",
      },
    ],
  },
  {
    group: "Validation / Experiment",
    stability: "BETA",
    endpoints: [
      {
        name: "run_ablation",
        sig: "(config) → AblationResult",
        fields: "ablation_target, batch_size, metrics[]",
      },
      {
        name: "run_perturbation",
        sig: "(config) → PerturbationResult",
        fields: "perturbation_type, magnitude, evaluation_window",
      },
      {
        name: "compare_baseline",
        sig: "(compare_config)",
        fields: "candidate_id, baseline_id, metric_set",
      },
      {
        name: "submit_candidate",
        sig: "(candidate_config)",
        fields: "description, evidence[], source_attribution",
      },
      {
        name: "get_maturation_recommendations",
        sig: "() → Recommendation[]",
        fields: "",
      },
    ],
  },
];

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="px-3 py-1.5 border-b shrink-0"
      style={{ borderColor: BORDER, background: PANEL_DARK }}
    >
      <span
        className="font-mono text-[9px] tracking-widest uppercase"
        style={{ color: MUTED }}
      >
        {children}
      </span>
    </div>
  );
}

function InnerTab({
  id,
  label,
  active,
  onClick,
}: { id: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      data-ocid={`deployment.${id}.tab`}
      onClick={onClick}
      className="font-mono text-[8px] tracking-widest uppercase px-3 py-1.5 border-b-2 transition-all whitespace-nowrap"
      style={{
        color: active ? CYAN : DIM,
        borderBottomColor: active ? CYAN : "transparent",
        background: active ? "oklch(0.08 0.01 265)" : "transparent",
      }}
    >
      {label}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: GREEN,
    inactive: AMBER,
    incompatible: RED,
    STABLE: GREEN,
    BETA: AMBER,
  };
  const c = map[status] ?? MUTED;
  return (
    <span
      className="font-mono text-[7px] tracking-widest uppercase px-1.5 py-0.5"
      style={{ background: `${c}18`, color: c, border: `1px solid ${c}35` }}
    >
      {status.toUpperCase()}
    </span>
  );
}

const ACTION_TYPE_COLORS: Record<string, string> = {
  MOVE: "oklch(0.72 0.22 220)",
  ATTACK: "oklch(0.72 0.22 25)",
  RETREAT: "oklch(0.78 0.22 60)",
  FREEZE: "oklch(0.78 0.22 80)",
  INVESTIGATE: "oklch(0.72 0.2 155)",
  ESCALATE: "oklch(0.72 0.2 290)",
  RECOVER: "oklch(0.72 0.22 195)",
  HOLD_POSITION: "oklch(0.72 0.2 200)",
  ISSUE_ORDER: "oklch(0.72 0.2 280)",
  ALLOCATE_RESOURCE: "oklch(0.72 0.22 50)",
  ROUTE_SELECT: "oklch(0.72 0.22 195)",
  INTERACT: "oklch(0.72 0.22 175)",
  IDLE: "oklch(0.38 0.05 220)",
};

function TraceFilterBtn({
  label,
  active,
  onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-mono text-[7px] uppercase tracking-widest px-2 py-0.5 rounded-sm transition-colors"
      style={{
        background: active ? "oklch(0.1 0.02 195)" : "transparent",
        border: `1px solid ${active ? "oklch(0.22 0.08 195)" : "oklch(0.18 0.04 255)"}`,
        color: active ? "oklch(0.72 0.22 195)" : "oklch(0.38 0.05 220)",
      }}
    >
      {label}
    </button>
  );
}

export default function DeploymentTab({ neural }: { neural: Neural }) {
  const { data: canon } = useCanonicalState();
  const { data: fearM } = useFearMissionState();
  const integration = useBrainIntegrationSystem();
  const mgr = useMemo(() => createDeploymentBindingManager(), []);
  const [activeInnerTab, setActiveInnerTab] = useState("gate");
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [regName, setRegName] = useState("");
  const [regType, setRegType] = useState<DeploymentType>("npc");
  const [regVersion, setRegVersion] = useState("1.0.0");
  const [bindingInput, setBindingInput] = useState("{}");
  const [bindingResult, setBindingResult] = useState<{
    valid: boolean;
    errors: string[];
  } | null>(null);

  // Verify-live results per adapter
  const [verifyResults, setVerifyResults] = useState<
    Record<string, ReturnType<typeof liveBrainBus.verifyLive>>
  >({});
  // Trace log refresh counter
  const [traceTick, setTraceTick] = useState(0);
  const [traceAdapterFilter, setTraceAdapterFilter] = useState<
    "all" | "battleops-adapter-v1" | "warcommandops-adapter-v1"
  >("all");
  const traceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-start simulation when Deployment tab mounts
  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  useEffect(() => {
    if (!neural.isRunning && neural.start) {
      neural.start();
    }
  }, []);

  // Seed neural simulation with real organism signals
  useEffect(() => {
    if (!canon) return;
    neural.seedFromBackend?.({
      coherence: canon.coh,
      arousal: canon.ar,
      identityI: canon.ic,
      fearLevel: fearM?.fearLevel,
    });
  }, [canon, fearM, neural]);

  useEffect(() => {
    if (activeInnerTab === "trace_return") {
      traceIntervalRef.current = setInterval(
        () => setTraceTick((t) => t + 1),
        2000,
      );
    } else {
      if (traceIntervalRef.current) clearInterval(traceIntervalRef.current);
    }
    return () => {
      if (traceIntervalRef.current) clearInterval(traceIntervalRef.current);
    };
  }, [activeInnerTab]);

  // Compute readiness from live neural state
  const checks = useMemo(
    () =>
      runAutoChecks(
        {
          isRunning: neural.isRunning,
          regions: neural.regions,
          saturatedRegions: neural.saturatedRegions,
          tick: neural.tick,
          sympatheticTone: neural.sympatheticTone,
          stressLoad: neural.sympatheticTone * 0.8,
          heartRate: neural.heartRate ?? 70,
        },
        0.7,
        0.65,
        neural.isRunning,
        neural.isRunning,
      ),
    [
      neural.isRunning,
      neural.tick,
      neural.sympatheticTone,
      neural.saturatedRegions,
      neural.regions,
      neural.heartRate,
    ],
  );

  const readinessScore =
    checks.length > 0
      ? checks.reduce((s, c) => s + c.score, 0) / checks.length
      : 0;
  const blockingCount = checks
    .flatMap((c) => c.failures)
    .filter((f) => f.isBlocking).length;
  const gatePassed = integration.isGatePassed(readinessScore, blockingCount);
  const gateReasons = integration.getGateBlockReasons(
    readinessScore,
    blockingCount,
  );
  const ingestStats = integration.getIngestStats();

  function handleRegister() {
    if (!regName.trim()) return;
    integration.registerAdapter({
      adapter_name: regName,
      deployment_type: regType,
      contract_version: regVersion,
      supported_payload_versions: [regVersion],
      supported_instance_types: ["individual_agent"],
      supported_role_overlays: ["soldier"],
      supported_scope_overlays: ["local_tactical"],
      analytics_ingest_capabilities: ["action_result"],
    });
    setShowRegisterForm(false);
    setRegName("");
    setRegVersion("1.0.0");
  }

  function handleValidateBinding() {
    try {
      const map = JSON.parse(bindingInput);
      const result = integration.validateBindingMap(map);
      setBindingResult(result);
      createArtifact({
        artifact_type: "binding_validation",
        source_system: "core",
        title: "Binding Validation",
        summary: result.valid
          ? "Binding map validated successfully"
          : `Validation failed: ${result.errors?.join("; ")}`,
        score: result.valid ? 100 : 20,
        status: result.valid ? "pass" : "fail",
        tags: ["binding", "validation", "integration"],
        metadata: { valid: result.valid, errors: result.errors ?? [] },
        related_artifact_ids: [],
        version: "1.0.0",
      });
    } catch {
      setBindingResult({ valid: false, errors: ["Invalid JSON"] });
    }
  }

  const INNER_TABS = [
    { id: "gate", label: "Gate Status" },
    { id: "contract", label: "Int. Contract" },
    { id: "ingest", label: "Analytics Ingest" },
    { id: "binding", label: "Binding" },
    { id: "adapters", label: "Adapters" },
    { id: "api", label: "API Contract" },
    { id: "live_flow", label: "Live Flow" },
    { id: "trace_return", label: "Trace Return" },
    { id: "treaty", label: "Treaty" },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Real Organism Signal Feed */}
      {canon && (
        <div
          className="shrink-0 flex items-center gap-4 px-3 py-1 border-b font-mono text-[9px] tracking-[0.12em]"
          style={{ background: "oklch(0.07 0.015 265)", borderColor: BORDER }}
        >
          <span style={{ color: MUTED }}>ORGANISM LIVE</span>
          <span style={{ color: MUTED }}>COH</span>
          <span
            style={{
              color: canon.coh > 0.7 ? GREEN : canon.coh > 0.4 ? AMBER : RED,
            }}
          >
            {canon.coh.toFixed(3)}
          </span>
          <span style={{ color: MUTED }}>FEAR</span>
          <span style={{ color: (fearM?.fearLevel ?? 0) > 0.5 ? RED : GREEN }}>
            {(fearM?.fearLevel ?? 0).toFixed(3)}
          </span>
          <span style={{ color: MUTED }}>KHz</span>
          <span style={{ color: CYAN }}>{canon.kf.toFixed(3)}</span>
          <span style={{ color: MUTED }}>BEAT</span>
          <span style={{ color: "oklch(0.85 0.06 210)" }}>
            {String(Number(canon.b)).padStart(8, "0")}
          </span>
        </div>
      )}
      {/* Deployment Gate Banner */}
      <div
        className="px-4 py-2.5 shrink-0 border-b flex items-center justify-between gap-4"
        style={{
          background: gatePassed ? `${GREEN}12` : `${RED}12`,
          borderColor: gatePassed ? `${GREEN}40` : `${RED}40`,
          borderBottom: `2px solid ${gatePassed ? GREEN : RED}`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{
              background: gatePassed ? GREEN : RED,
              boxShadow: `0 0 8px ${gatePassed ? GREEN : RED}`,
            }}
          />
          <span
            className="font-mono text-[10px] font-bold tracking-widest uppercase"
            style={{ color: gatePassed ? GREEN : RED }}
          >
            DEPLOYMENT GATE: {gatePassed ? "CLEARED" : "BLOCKED"}
          </span>
          <span
            className="font-mono text-[9px]"
            style={{ color: gatePassed ? GREEN : AMBER }}
          >
            {(readinessScore * 100).toFixed(0)}% readiness · {blockingCount}{" "}
            blocking failures
          </span>
        </div>
        {!gatePassed && gateReasons.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {gateReasons.map((r) => (
              <span
                key={r}
                className="font-mono text-[7px]"
                style={{ color: RED }}
              >
                ✕ {r}
              </span>
            ))}
          </div>
        )}
        {gatePassed && (
          <span className="font-mono text-[8px]" style={{ color: GREEN }}>
            ✓ Brain deployment-eligible · {new Date().toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Inner Tab Bar */}
      <div
        className="flex border-b shrink-0 overflow-x-auto"
        style={{ background: PANEL_DARK, borderColor: BORDER }}
      >
        {INNER_TABS.map((t) => (
          <InnerTab
            key={t.id}
            id={t.id}
            label={t.label}
            active={activeInnerTab === t.id}
            onClick={() => setActiveInnerTab(t.id)}
          />
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {/* ── GATE STATUS ─────────────────────────────── */}
        {activeInnerTab === "gate" && (
          <div className="h-full overflow-y-auto p-3 flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  label: "Readiness Score",
                  value: `${(readinessScore * 100).toFixed(0)}%`,
                  color: readinessScore > 0.65 ? GREEN : RED,
                },
                {
                  label: "Blocking Failures",
                  value: blockingCount.toString(),
                  color: blockingCount === 0 ? GREEN : RED,
                },
                {
                  label: "Active Adapters",
                  value: integration.activeAdapterCount.toString(),
                  color: CYAN,
                },
                {
                  label: "Registered Adapters",
                  value: integration.registeredAdapterCount.toString(),
                  color: MUTED,
                },
                {
                  label: "Active Sessions",
                  value: integration.activeSessions
                    .filter((s) => s.status === "active")
                    .length.toString(),
                  color: AMBER,
                },
                {
                  label: "Ingest Events",
                  value: ingestStats.total.toString(),
                  color: "oklch(0.68 0.22 260)",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="border p-2 flex flex-col gap-0.5"
                  style={{ background: PANEL, borderColor: BORDER }}
                >
                  <span
                    className="font-mono text-[7px] uppercase"
                    style={{ color: DIM }}
                  >
                    {stat.label}
                  </span>
                  <span
                    className="font-mono text-lg font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            {!gatePassed && (
              <div
                className="border p-3 flex flex-col gap-1.5"
                style={{ background: `${RED}08`, borderColor: `${RED}30` }}
              >
                <span
                  className="font-mono text-[8px] tracking-widest uppercase"
                  style={{ color: RED }}
                >
                  Gate Blockers
                </span>
                {gateReasons.map((r) => (
                  <span
                    key={r}
                    className="font-mono text-[8px]"
                    style={{ color: AMBER }}
                  >
                    → {r}
                  </span>
                ))}
              </div>
            )}

            <div
              className="border p-3 flex flex-col gap-1.5"
              style={{ background: PANEL, borderColor: BORDER }}
            >
              <span
                className="font-mono text-[8px] tracking-widest uppercase"
                style={{ color: MUTED }}
              >
                Mutation Boundary Status
              </span>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: GREEN, boxShadow: `0 0 6px ${GREEN}` }}
                />
                <span
                  className="font-mono text-[9px] font-bold"
                  style={{ color: GREEN }}
                >
                  BOUNDARY ENFORCED — {integration.mutationBoundary.violations}{" "}
                  violations
                </span>
              </div>
              <span className="font-mono text-[7px]" style={{ color: DIM }}>
                All candidates routed to validation queue. No direct promotion
                permitted. Last check:{" "}
                {new Date(
                  integration.mutationBoundary.last_check_ts,
                ).toLocaleTimeString()}
              </span>
            </div>

            {/* Contract version info */}
            <div
              className="border p-3 flex flex-col gap-1"
              style={{ background: PANEL, borderColor: BORDER }}
            >
              <span
                className="font-mono text-[8px] tracking-widest uppercase"
                style={{ color: MUTED }}
              >
                Contract Version
              </span>
              <span
                className="font-mono text-[11px] font-bold"
                style={{ color: CYAN }}
              >
                {integration.contractVersion}
              </span>
              <span className="font-mono text-[7px]" style={{ color: DIM }}>
                Supported: {integration.supportedContractVersions.join(", ")}
              </span>
            </div>
          </div>
        )}

        {/* ── INTEGRATION CONTRACT ─────────────────────── */}
        {activeInnerTab === "contract" && (
          <div className="h-full overflow-y-auto">
            <SectionHeader>
              Registered Adapters · {integration.adapters.length} Total
            </SectionHeader>

            {/* Register form */}
            {showRegisterForm ? (
              <div
                className="p-3 border-b flex flex-col gap-2"
                style={{ borderColor: BORDER, background: `${CYAN}06` }}
              >
                <span
                  className="font-mono text-[9px] tracking-widest uppercase"
                  style={{ color: CYAN }}
                >
                  Register New Adapter
                </span>
                <div className="flex gap-2 flex-wrap">
                  <input
                    data-ocid="deployment.input"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Adapter name"
                    className="font-mono text-[9px] px-2 py-1 border flex-1"
                    style={{
                      background: PANEL,
                      borderColor: BORDER,
                      color: MUTED,
                      minWidth: 140,
                    }}
                  />
                  <select
                    data-ocid="deployment.select"
                    value={regType}
                    onChange={(e) =>
                      setRegType(e.target.value as DeploymentType)
                    }
                    className="font-mono text-[9px] px-2 py-1 border"
                    style={{
                      background: PANEL,
                      borderColor: BORDER,
                      color: MUTED,
                    }}
                  >
                    {DEPLOYMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <input
                    value={regVersion}
                    onChange={(e) => setRegVersion(e.target.value)}
                    placeholder="Contract version"
                    className="font-mono text-[9px] px-2 py-1 border w-28"
                    style={{
                      background: PANEL,
                      borderColor: BORDER,
                      color: MUTED,
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    data-ocid="deployment.confirm_button"
                    onClick={handleRegister}
                    className="font-mono text-[8px] tracking-widest uppercase px-3 py-1 border"
                    style={{
                      border: `1px solid ${GREEN}60`,
                      color: GREEN,
                      background: `${GREEN}10`,
                    }}
                  >
                    Register
                  </button>
                  <button
                    type="button"
                    data-ocid="deployment.cancel_button"
                    onClick={() => setShowRegisterForm(false)}
                    className="font-mono text-[8px] tracking-widest uppercase px-3 py-1 border"
                    style={{
                      border: `1px solid ${RED}60`,
                      color: RED,
                      background: `${RED}10`,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-2 border-b" style={{ borderColor: BORDER }}>
                <button
                  type="button"
                  data-ocid="deployment.open_modal_button"
                  onClick={() => setShowRegisterForm(true)}
                  className="font-mono text-[8px] tracking-widest uppercase px-3 py-1 border"
                  style={{
                    border: `1px solid ${CYAN}50`,
                    color: CYAN,
                    background: `${CYAN}08`,
                  }}
                >
                  + Register New Adapter
                </button>
              </div>
            )}

            {/* Adapters table */}
            <table className="w-full border-collapse">
              <thead>
                <tr
                  style={{
                    background: PANEL_DARK,
                    borderBottom: `1px solid ${BORDER}`,
                  }}
                >
                  {[
                    "Name",
                    "Type",
                    "Version",
                    "Status",
                    "Compat.",
                    "Sessions",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="py-1 px-2 text-left font-mono text-[7px] tracking-widest uppercase"
                      style={{ color: DIM }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {integration.adapters.map((adapter, i) => {
                  const compat = integration.checkCompatibility(
                    adapter.adapter_id,
                  );
                  const hasSession = integration.activeSessions.some(
                    (s) =>
                      s.adapter_id === adapter.adapter_id &&
                      s.status === "active",
                  );
                  return (
                    <tr
                      key={adapter.adapter_id}
                      data-ocid={`deployment.row.${i + 1}`}
                      style={{ borderBottom: "1px solid oklch(0.12 0.02 255)" }}
                    >
                      <td
                        className="py-1.5 px-2 font-mono text-[8px]"
                        style={{ color: "oklch(0.7 0.1 200)" }}
                      >
                        {adapter.adapter_name}
                      </td>
                      <td
                        className="py-1.5 px-2 font-mono text-[8px]"
                        style={{ color: MUTED }}
                      >
                        {adapter.deployment_type}
                      </td>
                      <td
                        className="py-1.5 px-2 font-mono text-[8px]"
                        style={{ color: DIM }}
                      >
                        {adapter.contract_version}
                      </td>
                      <td className="py-1.5 px-2">
                        <StatusBadge status={adapter.status} />
                      </td>
                      <td className="py-1.5 px-2">
                        {compat.compatible ? (
                          <span
                            className="font-mono text-[7px]"
                            style={{ color: GREEN }}
                          >
                            ✓ OK
                          </span>
                        ) : (
                          <span
                            className="font-mono text-[7px]"
                            style={{ color: RED }}
                          >
                            ✕ MISMATCH
                          </span>
                        )}
                        {compat.warnings.length > 0 && (
                          <span
                            className="font-mono text-[7px] ml-1"
                            style={{ color: AMBER }}
                          >
                            ⚠
                          </span>
                        )}
                      </td>
                      <td
                        className="py-1.5 px-2 font-mono text-[8px]"
                        style={{ color: hasSession ? GREEN : DIM }}
                      >
                        {hasSession ? "1 active" : "—"}
                      </td>
                      <td className="py-1.5 px-2">
                        <div className="flex gap-1">
                          {adapter.status !== "active" ? (
                            <button
                              type="button"
                              onClick={() =>
                                integration.activateAdapter(adapter.adapter_id)
                              }
                              className="font-mono text-[7px] uppercase px-1.5 py-0.5 border"
                              style={{
                                border: `1px solid ${GREEN}40`,
                                color: GREEN,
                                background: `${GREEN}08`,
                                opacity:
                                  adapter.status === "incompatible" ? 0.4 : 1,
                              }}
                              disabled={adapter.status === "incompatible"}
                            >
                              Activate
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                integration.deactivateAdapter(
                                  adapter.adapter_id,
                                )
                              }
                              className="font-mono text-[7px] uppercase px-1.5 py-0.5 border"
                              style={{
                                border: `1px solid ${AMBER}40`,
                                color: AMBER,
                                background: `${AMBER}08`,
                              }}
                            >
                              Deactivate
                            </button>
                          )}
                          {!hasSession ? (
                            <button
                              type="button"
                              data-ocid="deployment.session.button"
                              onClick={() => {
                                if (gatePassed) {
                                  integration.beginSession(
                                    adapter.adapter_id,
                                    true,
                                  );
                                }
                                liveBrainBus.start();
                                // Immediately dispatch a real perception payload so packetsReturned > 0
                                const activeRegions = neural.regions ?? [];
                                const avgActivation =
                                  activeRegions.length > 0
                                    ? activeRegions.reduce(
                                        (s, r) => s + (r.activation ?? 0),
                                        0,
                                      ) / activeRegions.length
                                    : 0.5;
                                liveBrainBus.routePayload(adapter.adapter_id, {
                                  threat_level: Math.min(
                                    1,
                                    (neural.sympatheticTone ?? 0.3) * 1.2,
                                  ),
                                  reward_level: Math.max(
                                    0,
                                    avgActivation - 0.2,
                                  ),
                                  novelty: 0.5,
                                  urgency: neural.sympatheticTone ?? 0.3,
                                  salience: avgActivation,
                                  fatigue:
                                    1 -
                                    (neural.heartRate
                                      ? Math.min(1, neural.heartRate / 100)
                                      : 0.5),
                                });
                              }}
                              title={
                                !gatePassed
                                  ? "Brain not ready for deployment — resolve readiness blockers first"
                                  : ""
                              }
                              className="font-mono text-[7px] uppercase px-1.5 py-0.5 border"
                              style={{
                                border: `1px solid ${CYAN}40`,
                                color: gatePassed ? CYAN : DIM,
                                background: `${CYAN}08`,
                                opacity:
                                  gatePassed && adapter.status === "active"
                                    ? 1
                                    : 0.4,
                                cursor:
                                  gatePassed && adapter.status === "active"
                                    ? "pointer"
                                    : "not-allowed",
                              }}
                              disabled={
                                !gatePassed || adapter.status !== "active"
                              }
                            >
                              Begin Session
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const sess = integration.activeSessions.find(
                                  (s) =>
                                    s.adapter_id === adapter.adapter_id &&
                                    s.status === "active",
                                );
                                if (sess)
                                  integration.endSession(sess.session_id);
                              }}
                              className="font-mono text-[7px] uppercase px-1.5 py-0.5 border"
                              style={{
                                border: `1px solid ${RED}40`,
                                color: RED,
                                background: `${RED}08`,
                              }}
                            >
                              End Session
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Version mismatch warnings */}
            {integration.getVersionMismatches().length > 0 && (
              <div
                className="p-3 border-t flex flex-col gap-1"
                style={{ borderColor: BORDER, background: `${AMBER}08` }}
              >
                <span
                  className="font-mono text-[8px] tracking-widest uppercase"
                  style={{ color: AMBER }}
                >
                  ⚠ Version Mismatches
                </span>
                {integration.getVersionMismatches().map((a) => (
                  <span
                    key={a.adapter_id}
                    className="font-mono text-[7px]"
                    style={{ color: MUTED }}
                  >
                    {a.adapter_name}: contract v{a.contract_version} — expected
                    v{integration.contractVersion}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── BRAIN BUS STATUS ─────────────────────────── */}
        {(() => {
          const busStatus = liveBrainBus.getBusStatus();
          return (
            <div
              className="px-3 py-1.5 border-b flex items-center gap-4 shrink-0"
              style={{ borderColor: BORDER, background: PANEL_DARK }}
              data-ocid="deployment.brain_bus.panel"
            >
              <span
                className="font-mono text-[8px] tracking-widest uppercase"
                style={{ color: "oklch(0.42 0.06 220)" }}
              >
                BRAIN BUS
              </span>
              <div className="flex items-center gap-1.5">
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: busStatus.isActive
                      ? GREEN
                      : "oklch(0.4 0.1 220)",
                    boxShadow: busStatus.isActive ? `0 0 6px ${GREEN}` : "none",
                  }}
                />
                <span
                  className="font-mono text-[8px] font-bold"
                  style={{
                    color: busStatus.isActive ? GREEN : "oklch(0.4 0.1 220)",
                  }}
                >
                  {busStatus.isActive ? "LIVE" : "OFFLINE"}
                </span>
              </div>
              <span className="font-mono text-[7px]" style={{ color: MUTED }}>
                PAYLOADS:{" "}
                <span style={{ color: CYAN }}>{busStatus.payloadsRouted}</span>
              </span>
              <span className="font-mono text-[7px]" style={{ color: MUTED }}>
                PACKETS:{" "}
                <span style={{ color: GREEN }}>
                  {busStatus.packetsReturned}
                </span>
              </span>
              <span className="font-mono text-[7px]" style={{ color: MUTED }}>
                LATENCY:{" "}
                <span
                  style={{ color: busStatus.latencyMs < 5 ? GREEN : AMBER }}
                >
                  {busStatus.latencyMs}ms
                </span>
              </span>
            </div>
          );
        })()}

        {/* ── PACKET FLOW INDICATOR ─────────────────────── */}
        {(() => {
          const busStatus = liveBrainBus.getBusStatus();
          if (busStatus.packetsReturned === 0) return null;
          return (
            <div
              className="px-3 py-1.5 shrink-0 flex items-center gap-2"
              style={{
                background: "oklch(0.13 0.04 140)",
                borderBottom: "1px solid oklch(0.72 0.22 140 / 0.3)",
              }}
              data-ocid="deployment.packet_flow.success_state"
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: GREEN,
                  boxShadow: `0 0 8px ${GREEN}`,
                  animation: "pulse 1.5s infinite",
                }}
              />
              <span
                className="font-mono text-[8px] font-bold tracking-widest"
                style={{ color: GREEN }}
              >
                LIVE — {busStatus.packetsReturned} BrainActionPacket
                {busStatus.packetsReturned !== 1 ? "s" : ""} flowing
              </span>
              <span
                className="font-mono text-[7px]"
                style={{ color: "oklch(0.55 0.12 140)" }}
              >
                · Go-Live payload gate cleared · Open Go-Live Declaration to
                declare
              </span>
            </div>
          );
        })()}

        {/* ── EXTERNAL BIND CONTRACT ────────────────────── */}
        {activeInnerTab === "bind" && (
          <div
            className="h-full flex flex-col overflow-hidden"
            data-ocid="deployment.bind_contract.panel"
          >
            <div
              className="px-3 py-2 border-b shrink-0"
              style={{ borderColor: BORDER, background: PANEL_DARK }}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="font-mono text-[8px] tracking-widest uppercase"
                  style={{ color: CYAN }}
                >
                  EXTERNAL BIND CONTRACT — v{CONTRACT_VERSION}
                </span>
                <button
                  type="button"
                  data-ocid="deployment.bind_contract.button"
                  onClick={async () => {
                    try {
                      const mod = await import("../utils/externalBindContract");
                      const raw = JSON.stringify(
                        {
                          CONTRACT_VERSION: mod.CONTRACT_VERSION,
                          PAYLOAD_SCHEMA_VERSION: mod.PAYLOAD_SCHEMA_VERSION,
                          CANONICAL_INSTANCE_TYPES:
                            mod.CANONICAL_INSTANCE_TYPES,
                        },
                        null,
                        2,
                      );
                      const text = `// externalBindContract.ts — copy this into BattleOps and WarCommandOps
// CONTRACT_VERSION: ${mod.CONTRACT_VERSION}
// PAYLOAD_SCHEMA_VERSION: ${mod.PAYLOAD_SCHEMA_VERSION}
//
// Paste into your project and call:
//   const client = new CoreBindClient();
//   const sessionId = client.begin_adapter_session("your-adapter-id", manifest);
//   const packet = client.step_brain(instanceId, perceptionPayload);
//   client.end_adapter_session(sessionId);

${raw}`;
                      await navigator.clipboard.writeText(text);
                    } catch {
                      // fallback
                    }
                  }}
                  className="font-mono text-[7px] uppercase px-2 py-0.5 border"
                  style={{
                    border: `1px solid ${CYAN}40`,
                    color: CYAN,
                    background: `${CYAN}08`,
                    cursor: "pointer",
                  }}
                >
                  Copy Contract
                </button>
              </div>
              <p
                className="font-mono text-[7px] mt-1"
                style={{ color: "oklch(0.45 0.06 220)" }}
              >
                Copy this file into your separate BattleOps and WarCommandOps
                Caffeine projects. Call begin_adapter_session on world entry,
                step_brain on each tick, and end_adapter_session on exit.
              </p>
            </div>
            <div
              className="flex-1 overflow-auto p-3"
              style={{ background: PANEL }}
            >
              <div
                className="font-mono text-[8px] leading-relaxed"
                style={{
                  color: "oklch(0.55 0.08 220)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {`// Endpoints (stable, CONTRACT_VERSION: ${CONTRACT_VERSION})

begin_adapter_session(adapterId, manifest) → sessionId
step_brain(instanceId, perceptionPayload) → BrainActionPacket
end_adapter_session(sessionId) → void
verify_live(adapterId) → { is_live, packets_returned, latency_ms }
ingest_action_result(payload) → void

// BrainActionPacket fields:
// action_type: MOVE | ATTACK | RETREAT | HOLD | INVESTIGATE | ISSUE_ORDER | IDLE
// action_params: typed per action_type
// confidence: 0–1
// salience_score: 0–1
// predicted_outcome: string
// trace_id: string
// instance_id: string
// timestamp: number

// PerceptionPayload fields:
// threat_level: 0–1
// reward_level: 0–1
// novelty: 0–1
// urgency: 0–1
// salience: 0–1
// fatigue: 0–1`}
              </div>
            </div>
          </div>
        )}

        {/* ── ANALYTICS INGEST ─────────────────────────── */}
        {activeInnerTab === "ingest" && (
          <div className="h-full flex flex-col overflow-hidden">
            {/* Stats bar */}
            <div
              className="px-3 py-2 border-b flex gap-4 shrink-0"
              style={{ borderColor: BORDER, background: PANEL_DARK }}
            >
              {[
                { label: "Total", value: ingestStats.total, color: CYAN },
                { label: "Valid", value: ingestStats.valid, color: GREEN },
                {
                  label: "Invalid",
                  value: ingestStats.invalid,
                  color: ingestStats.invalid > 0 ? RED : MUTED,
                },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span
                    className="font-mono text-[7px] uppercase"
                    style={{ color: DIM }}
                  >
                    {s.label}
                  </span>
                  <span
                    className="font-mono text-[10px] font-bold"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </span>
                </div>
              ))}
              <div className="ml-2 flex gap-2 flex-wrap">
                {(
                  Object.entries(ingestStats.by_type) as [IngestType, number][]
                ).map(([type, count]) => (
                  <span
                    key={type}
                    className="font-mono text-[7px]"
                    style={{ color: DIM }}
                  >
                    {type.replace(/_/g, "·")}:{" "}
                    <span style={{ color: MUTED }}>{count}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Mutation boundary */}
            <div
              className="px-3 py-1.5 border-b shrink-0 flex items-center gap-3"
              style={{ borderColor: BORDER }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: GREEN, boxShadow: `0 0 6px ${GREEN}` }}
              />
              <span
                className="font-mono text-[8px] font-bold"
                style={{ color: GREEN }}
              >
                BOUNDARY ENFORCED — {integration.mutationBoundary.violations}{" "}
                violations
              </span>
              <span className="font-mono text-[7px]" style={{ color: DIM }}>
                No direct mutation permitted through ingest path
              </span>
            </div>

            {/* Simulate ingest buttons */}
            <div
              className="px-3 py-2 border-b flex gap-1.5 flex-wrap shrink-0"
              style={{ borderColor: BORDER }}
            >
              <span
                className="font-mono text-[7px] uppercase self-center"
                style={{ color: DIM }}
              >
                Simulate:
              </span>
              {INGEST_TYPES.map((type) => {
                const activeAdapter = integration.adapters.find(
                  (a) => a.status === "active",
                );
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      activeAdapter &&
                      integration.simulateIngest(activeAdapter.adapter_id, type)
                    }
                    className="font-mono text-[7px] uppercase px-2 py-0.5 border"
                    style={{
                      border: `1px solid ${CYAN}35`,
                      color: CYAN,
                      background: `${CYAN}08`,
                    }}
                  >
                    {type.replace(/_/g, "·")}
                  </button>
                );
              })}
            </div>

            {/* Ingest log table */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full border-collapse">
                <thead
                  className="sticky top-0"
                  style={{ background: PANEL_DARK }}
                >
                  <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                    {[
                      "Source Adapter",
                      "Type",
                      "Ingested At",
                      "Schema",
                      "Summary",
                    ].map((h) => (
                      <th
                        key={h}
                        className="py-1 px-2 text-left font-mono text-[7px] tracking-widest uppercase"
                        style={{ color: DIM }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {integration.ingestLog.map((entry, i) => {
                    const adapter = integration.adapters.find(
                      (a) => a.adapter_id === entry.source_adapter,
                    );
                    return (
                      <tr
                        key={entry.id}
                        data-ocid={`deployment.row.${i + 1}`}
                        style={{
                          borderBottom: "1px solid oklch(0.11 0.02 260)",
                        }}
                      >
                        <td
                          className="py-1 px-2 font-mono text-[8px]"
                          style={{ color: "oklch(0.65 0.1 200)" }}
                        >
                          {adapter?.adapter_name ?? entry.source_adapter}
                        </td>
                        <td className="py-1 px-2">
                          <span
                            className="font-mono text-[7px] uppercase"
                            style={{ color: AMBER }}
                          >
                            {entry.type.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td
                          className="py-1 px-2 font-mono text-[7px]"
                          style={{ color: DIM }}
                        >
                          {new Date(entry.ingested_at).toLocaleTimeString()}
                        </td>
                        <td className="py-1 px-2">
                          <StatusBadge
                            status={
                              entry.schema_valid ? "active" : "incompatible"
                            }
                          />
                        </td>
                        <td
                          className="py-1 px-2 font-mono text-[7px]"
                          style={{
                            color: DIM,
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {entry.payload_summary}
                        </td>
                      </tr>
                    );
                  })}
                  {integration.ingestLog.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-6 text-center font-mono text-[9px]"
                        style={{ color: DIM }}
                        data-ocid="deployment.empty_state"
                      >
                        No ingest events — use Simulate buttons above
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── BINDING SUPPORT ──────────────────────────── */}
        {activeInnerTab === "binding" && (
          <div className="h-full overflow-y-auto p-3 flex flex-col gap-3">
            {/* Validate binding map tool */}
            <div
              className="border p-3 flex flex-col gap-2"
              style={{ background: PANEL, borderColor: BORDER }}
            >
              <span
                className="font-mono text-[9px] tracking-widest uppercase"
                style={{ color: MUTED }}
              >
                Validate Binding Map (JSON)
              </span>
              <textarea
                data-ocid="deployment.textarea"
                value={bindingInput}
                onChange={(e) => setBindingInput(e.target.value)}
                rows={4}
                className="font-mono text-[8px] px-2 py-1.5 border resize-none w-full"
                style={{
                  background: "oklch(0.08 0.01 265)",
                  borderColor: BORDER,
                  color: MUTED,
                }}
                placeholder='{ "soldier_entity": "individual_agent", "squad_leader_entity": "squad_leader" }'
              />
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  data-ocid="deployment.primary_button"
                  onClick={handleValidateBinding}
                  className="font-mono text-[8px] tracking-widest uppercase px-3 py-1 border"
                  style={{
                    border: `1px solid ${CYAN}50`,
                    color: CYAN,
                    background: `${CYAN}08`,
                  }}
                >
                  Validate Map
                </button>
                {bindingResult && (
                  <span
                    className="font-mono text-[8px]"
                    style={{ color: bindingResult.valid ? GREEN : RED }}
                  >
                    {bindingResult.valid
                      ? "✓ Valid binding map"
                      : `✕ ${bindingResult.errors.join("; ")}`}
                  </span>
                )}
              </div>
            </div>

            {/* Canonical instance types with requirements */}
            <SectionHeader>
              Canonical Instance Types ·{" "}
              {integration.canonicalInstanceTypes.length} Defined
            </SectionHeader>
            <div className="flex flex-col gap-1">
              {integration.canonicalInstanceTypes.map((type, i) => {
                const req = integration.getBindingRequirements(type);
                return (
                  <div
                    key={type}
                    data-ocid={`deployment.item.${i + 1}`}
                    className="border p-2 flex flex-col gap-1"
                    style={{ background: PANEL, borderColor: BORDER }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="font-mono text-[8px] font-bold"
                        style={{ color: CYAN }}
                      >
                        {type}
                      </span>
                      {req && (
                        <span
                          className="font-mono text-[7px] uppercase"
                          style={{ color: DIM }}
                        >
                          auth: {req.authority_level}
                        </span>
                      )}
                    </div>
                    {req && (
                      <div className="flex gap-3">
                        <span
                          className="font-mono text-[7px]"
                          style={{ color: DIM }}
                        >
                          Roles:{" "}
                          <span style={{ color: MUTED }}>
                            {req.required_role_overlays.join(", ")}
                          </span>
                        </span>
                        <span
                          className="font-mono text-[7px]"
                          style={{ color: DIM }}
                        >
                          Scopes:{" "}
                          <span style={{ color: MUTED }}>
                            {req.required_scope_overlays.join(", ")}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Role / Scope Overlay Matrix */}
            <SectionHeader>Role × Scope Overlay Matrix</SectionHeader>
            <div className="overflow-x-auto">
              <table className="border-collapse text-center">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <th
                      className="py-1 px-2 font-mono text-[7px]"
                      style={{ color: DIM }}
                    >
                      Role \ Scope
                    </th>
                    {integration.canonicalScopeOverlays.map((s) => (
                      <th
                        key={s}
                        className="py-1 px-2 font-mono text-[7px] uppercase"
                        style={{ color: DIM }}
                      >
                        {s}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {integration.canonicalRoleOverlays.map((role) => (
                    <tr
                      key={role}
                      style={{ borderBottom: "1px solid oklch(0.12 0.02 255)" }}
                    >
                      <td
                        className="py-1 px-2 font-mono text-[8px]"
                        style={{ color: CYAN }}
                      >
                        {role}
                      </td>
                      {integration.canonicalScopeOverlays.map((scope) => {
                        const res = integration.getOverlayRequirements(
                          role,
                          scope,
                        );
                        const validCombo = res.compatible;
                        return (
                          <td key={scope} className="py-1 px-2">
                            <span
                              className="font-mono text-[8px]"
                              style={{
                                color: validCombo
                                  ? GREEN
                                  : "oklch(0.18 0.04 255)",
                              }}
                            >
                              {validCombo ? "✓" : "·"}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ADAPTERS (original) ───────────────────────── */}
        {activeInnerTab === "adapters" && (
          <div className="h-full flex overflow-hidden">
            <section
              className="flex flex-col border-r"
              style={{
                flex: "0 0 52%",
                overflow: "hidden",
                borderColor: BORDER,
              }}
            >
              <SectionHeader>
                Deployment Adapters · {mgr.adapters.length} Targets
              </SectionHeader>
              <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
                {mgr.adapters.map((a, i) => {
                  const sc =
                    a.status === "active"
                      ? GREEN
                      : a.status === "standby"
                        ? AMBER
                        : RED;
                  return (
                    <div
                      key={a.id}
                      data-ocid={`deployment.item.${i + 1}`}
                      className="border p-3 flex flex-col gap-2"
                      style={{
                        background: PANEL,
                        borderColor: `${sc}30`,
                        borderTop: `2px solid ${sc}`,
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="font-mono text-[10px] font-bold"
                          style={{ color: "oklch(0.8 0.1 200)" }}
                        >
                          {a.name}
                        </span>
                        <span
                          className="font-mono text-[7px] tracking-widest uppercase px-1.5 py-0.5"
                          style={{
                            background: `${CYAN}18`,
                            color: CYAN,
                            border: `1px solid ${CYAN}30`,
                          }}
                        >
                          {a.type}
                        </span>
                      </div>
                      <p
                        className="font-mono text-[8px]"
                        style={{ color: MUTED }}
                      >
                        {a.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span
                            className="font-mono text-[7px] uppercase"
                            style={{ color: DIM }}
                          >
                            Instances
                          </span>
                          <span
                            className="font-mono text-[11px] font-bold"
                            style={{ color: sc }}
                          >
                            {a.boundInstances}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span
                            className="font-mono text-[7px] uppercase"
                            style={{ color: DIM }}
                          >
                            Status
                          </span>
                          <span
                            className="font-mono text-[8px] uppercase tracking-widest"
                            style={{ color: sc }}
                          >
                            {a.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {a.capabilities.map((cap) => (
                          <span
                            key={cap}
                            className="font-mono text-[7px] uppercase tracking-widest px-1 py-0.5"
                            style={{
                              background: "oklch(0.12 0.02 255)",
                              color: DIM,
                              border: "1px solid oklch(0.16 0.03 255)",
                            }}
                          >
                            {cap.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Binding table */}
              <div
                className="border-t flex flex-col shrink-0"
                style={{ borderColor: BORDER, maxHeight: "35%" }}
              >
                <SectionHeader>Entity Binding Table</SectionHeader>
                <div className="overflow-y-auto">
                  <table
                    data-ocid="deployment.table"
                    className="w-full border-collapse"
                  >
                    <thead>
                      <tr
                        style={{
                          background: "oklch(0.08 0.012 265)",
                          borderBottom: `1px solid ${BORDER}`,
                        }}
                      >
                        {["Entity Class", "Brain Type", "Role", "Scope"].map(
                          (h) => (
                            <th
                              key={h}
                              className="py-1 px-2 text-left font-mono text-[7px] tracking-widest uppercase"
                              style={{ color: DIM }}
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {mgr.bindingTable.map((b, i) => (
                        <tr
                          key={b.entityClass}
                          data-ocid={`deployment.row.${i + 20}`}
                          style={{
                            borderBottom: "1px solid oklch(0.12 0.02 255)",
                          }}
                        >
                          <td
                            className="py-1 px-2 font-mono text-[8px]"
                            style={{ color: "oklch(0.65 0.1 200)" }}
                          >
                            {b.entityClass}
                          </td>
                          <td
                            className="py-1 px-2 font-mono text-[8px]"
                            style={{ color: MUTED }}
                          >
                            {b.brainInstanceType}
                          </td>
                          <td
                            className="py-1 px-2 font-mono text-[8px]"
                            style={{ color: DIM }}
                          >
                            {b.roleOverlayId.replace("role_", "")}
                          </td>
                          <td
                            className="py-1 px-2 font-mono text-[8px]"
                            style={{ color: DIM }}
                          >
                            {b.scopeOverlayId.replace("scope_", "")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
            {/* Right: Role/scope overlays */}
            <section
              className="flex flex-col"
              style={{ flex: 1, overflow: "hidden" }}
            >
              <SectionHeader>Role Overlays · 8 Defined</SectionHeader>
              <div
                style={{
                  flex: "0 0 auto",
                  maxHeight: "50%",
                  overflowY: "auto",
                }}
              >
                {mgr.roleOverlays.map((r, i) => (
                  <div
                    key={r.id}
                    data-ocid={`deployment.item.${i + 5}`}
                    className="px-3 py-1.5 border-b flex items-center gap-3"
                    style={{ borderColor: "oklch(0.13 0.03 255)" }}
                  >
                    <span
                      className="font-mono text-[8px] w-32 shrink-0"
                      style={{ color: "oklch(0.65 0.1 200)" }}
                    >
                      {r.name}
                    </span>
                    <div className="flex items-center gap-2 flex-1">
                      <span
                        className="font-mono text-[7px] uppercase"
                        style={{ color: DIM }}
                      >
                        Risk
                      </span>
                      <div
                        style={{
                          width: 32,
                          height: 3,
                          background: "oklch(0.14 0.03 255)",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${r.riskTolerance * 100}%`,
                            height: "100%",
                            background: AMBER,
                          }}
                        />
                      </div>
                      <span
                        className="font-mono text-[7px] uppercase"
                        style={{ color: DIM }}
                      >
                        Auth
                      </span>
                      <div
                        style={{
                          width: 32,
                          height: 3,
                          background: "oklch(0.14 0.03 255)",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${r.authorityLevel * 100}%`,
                            height: "100%",
                            background: CYAN,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t" style={{ borderColor: BORDER }}>
                <SectionHeader>Scope Overlays · 5 Defined</SectionHeader>
                <div className="flex gap-1 p-2 flex-wrap">
                  {mgr.scopeOverlays.map((s) => (
                    <div
                      key={s.id}
                      className="px-2 py-1.5 border flex flex-col gap-0.5"
                      style={{
                        background: PANEL,
                        borderColor: "oklch(0.16 0.04 255)",
                        minWidth: 80,
                      }}
                    >
                      <span
                        className="font-mono text-[8px]"
                        style={{ color: CYAN }}
                      >
                        {s.name}
                      </span>
                      <span
                        className="font-mono text-[7px]"
                        style={{ color: DIM }}
                      >
                        Auth {(s.actionAuthority * 100).toFixed(0)}%
                      </span>
                      <span
                        className="font-mono text-[7px]"
                        style={{ color: DIM }}
                      >
                        Mem{" "}
                        {s.memoryHorizon >= 3600
                          ? `${s.memoryHorizon / 3600}h`
                          : `${s.memoryHorizon}s`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── API CONTRACT ─────────────────────────────── */}
        {activeInnerTab === "api" && (
          <div className="h-full overflow-y-auto">
            <div
              className="px-3 py-1.5 border-b flex items-center gap-3"
              style={{ borderColor: BORDER, background: PANEL_DARK }}
            >
              <span className="font-mono text-[8px]" style={{ color: MUTED }}>
                Contract v{integration.contractVersion}
              </span>
              <span className="font-mono text-[8px]" style={{ color: DIM }}>
                ·
              </span>
              <span className="font-mono text-[8px]" style={{ color: DIM }}>
                14 API Groups
              </span>
              <span className="font-mono text-[8px]" style={{ color: DIM }}>
                ·
              </span>
              <span className="font-mono text-[8px]" style={{ color: GREEN }}>
                9 STABLE · 5 BETA
              </span>
            </div>
            {API_GROUPS.map((group, gi) => (
              <div
                key={group.group}
                className="border-b"
                style={{ borderColor: BORDER }}
              >
                <div
                  className="px-3 py-1.5 flex items-center gap-2"
                  style={{ background: "oklch(0.08 0.012 265)" }}
                >
                  <span
                    className="font-mono text-[9px] font-bold"
                    style={{ color: "oklch(0.72 0.12 200)" }}
                  >
                    {String(gi + 1).padStart(2, "0")}. {group.group}
                  </span>
                  <StatusBadge status={group.stability} />
                </div>
                {group.endpoints.map((ep) => (
                  <div
                    key={ep.name}
                    className="px-4 py-2 border-t flex flex-col gap-0.5"
                    style={{ borderColor: "oklch(0.12 0.02 255)" }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono text-[9px] font-bold"
                        style={{ color: CYAN }}
                      >
                        {ep.name}
                      </span>
                      <span
                        className="font-mono text-[8px]"
                        style={{ color: DIM }}
                      >
                        {ep.sig}
                      </span>
                    </div>
                    {ep.fields && (
                      <span
                        className="font-mono text-[7px]"
                        style={{ color: DIM }}
                      >
                        fields: {ep.fields}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {/* ── LIVE FLOW ─────────────────────────────── */}
        {activeInnerTab === "live_flow" && (
          <div className="h-full overflow-y-auto p-4 space-y-4">
            <div
              className="rounded-sm border p-3"
              style={{ background: PANEL_DARK, borderColor: BORDER }}
            >
              <p
                className="font-mono text-[8px] uppercase tracking-widest mb-3"
                style={{ color: MUTED }}
              >
                BrainActionPacket Flow — Per Adapter
              </p>
              <div className="space-y-3">
                {integration.adapters
                  .filter(
                    (a) =>
                      a.adapter_name.includes("BattleOps") ||
                      a.adapter_name.includes("WarCommandOps") ||
                      a.deployment_type === "war_game" ||
                      a.deployment_type === "scenario",
                  )
                  .map((adapter) => {
                    const activeSession = integration.activeSessions.find(
                      (s) =>
                        s.adapter_id === adapter.adapter_id &&
                        s.status === "active",
                    );
                    // Real packet count from the brain bus trace log
                    const busStatus = liveBrainBus.getBusStatus();
                    const adapterTraces = liveBrainBus
                      .getTraceLog()
                      .filter((t) => t.adapter_id === adapter.adapter_id);
                    const packetCount = adapterTraces.length;
                    const recentPacket = liveBrainBus.getRecentPacket();
                    const lastAction =
                      adapterTraces[0]?.packet.action_type ??
                      recentPacket?.action_type ??
                      "—";
                    const lastPacketMs = adapterTraces[0]
                      ? Math.round(
                          (Date.now() - adapterTraces[0].timestamp) / 1000,
                        )
                      : null;
                    const vr = verifyResults[adapter.adapter_id];
                    return (
                      <div
                        key={adapter.adapter_id}
                        className="rounded-sm border p-3"
                        style={{
                          background: "oklch(0.07 0.012 265)",
                          borderColor: BORDER,
                        }}
                      >
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <p
                            className="font-mono text-[10px] font-semibold"
                            style={{ color: "oklch(0.82 0.04 220)" }}
                          >
                            {adapter.adapter_name}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm"
                              style={{
                                background: activeSession
                                  ? `${GREEN}18`
                                  : "oklch(0.1 0.02 260)",
                                color: activeSession ? GREEN : MUTED,
                              }}
                            >
                              {activeSession ? "SESSION ACTIVE" : "NO SESSION"}
                            </span>
                            <button
                              type="button"
                              data-ocid="deployment.primary_button"
                              onClick={() => {
                                const result = liveBrainBus.verifyLive(
                                  adapter.adapter_id,
                                );
                                setVerifyResults((prev) => ({
                                  ...prev,
                                  [adapter.adapter_id]: result,
                                }));
                              }}
                              className="font-mono text-[7px] uppercase tracking-widest px-2 py-0.5 rounded-sm transition-colors"
                              style={{
                                background: "oklch(0.1 0.02 195)",
                                border: "1px solid oklch(0.22 0.08 195)",
                                color: CYAN,
                              }}
                            >
                              VERIFY LIVE
                            </button>
                          </div>
                        </div>
                        {vr && (
                          <div
                            className="rounded-sm p-2 mb-2 flex flex-wrap gap-x-4 gap-y-0.5"
                            style={{
                              background: vr.is_live
                                ? `${GREEN}10`
                                : `${RED}10`,
                              border: `1px solid ${vr.is_live ? GREEN : RED}40`,
                            }}
                          >
                            <span
                              className="font-mono text-[9px] font-bold uppercase tracking-widest"
                              style={{ color: vr.is_live ? GREEN : RED }}
                            >
                              {vr.is_live ? "● LIVE" : "○ OFFLINE"}
                            </span>
                            {[
                              ["Pkts", vr.packets_returned.toString()],
                              [
                                "Last",
                                vr.last_packet_ms === Number.POSITIVE_INFINITY
                                  ? "—"
                                  : `${Math.round(vr.last_packet_ms)}ms ago`,
                              ],
                              ["Latency", `${vr.latency_ms.toFixed(1)}ms`],
                              ["Contract", vr.contract_version],
                            ].map(([k, v]) => (
                              <span
                                key={k}
                                className="font-mono text-[8px]"
                                style={{ color: DIM }}
                              >
                                {k}:{" "}
                                <span style={{ color: "oklch(0.72 0.22 195)" }}>
                                  {v}
                                </span>
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          {[
                            ["Packets Returned", packetCount.toString()],
                            ["Last Action Type", lastAction],
                            [
                              "Last Packet",
                              lastPacketMs !== null
                                ? `${lastPacketMs}s ago`
                                : "—",
                            ],
                            [
                              "ACK Status",
                              activeSession &&
                              packetCount > 0 &&
                              busStatus.isActive
                                ? "ACK RECEIVED"
                                : "—",
                            ],
                          ].map(([k, v]) => (
                            <div
                              key={k}
                              className="flex justify-between items-baseline"
                            >
                              <span
                                className="font-mono text-[8px]"
                                style={{ color: MUTED }}
                              >
                                {k}
                              </span>
                              <span
                                className="font-mono text-[9px] font-semibold"
                                style={{
                                  color:
                                    v === "ACK RECEIVED"
                                      ? GREEN
                                      : "oklch(0.72 0.22 195)",
                                }}
                              >
                                {v}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div
              className="rounded-sm border p-3"
              style={{ background: PANEL_DARK, borderColor: BORDER }}
            >
              <p
                className="font-mono text-[8px] uppercase tracking-widest mb-3"
                style={{ color: MUTED }}
              >
                Payload Flow Status — Canonical Input Payloads
              </p>
              <div className="space-y-2">
                {[
                  "PerceptionPayload",
                  "EmbodimentPayload",
                  "RegulationPayload",
                  "GoalPayload",
                ].map((ptype) => {
                  const activeSessions = integration.activeSessions.filter(
                    (s) => s.status === "active",
                  );
                  const hasSent = activeSessions.length > 0;
                  return (
                    <div
                      key={ptype}
                      className="flex items-center justify-between py-1.5 border-b"
                      style={{ borderColor: BORDER }}
                    >
                      <span
                        className="font-mono text-[9px]"
                        style={{ color: "oklch(0.82 0.04 220)" }}
                      >
                        {ptype}
                      </span>
                      <div className="flex gap-3">
                        {integration.adapters
                          .filter((a) => a.status === "active")
                          .slice(0, 3)
                          .map((adapter) => (
                            <span
                              key={adapter.adapter_id}
                              className="font-mono text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm"
                              style={{
                                background: hasSent
                                  ? `${GREEN}15`
                                  : "oklch(0.1 0.02 260)",
                                color: hasSent ? GREEN : MUTED,
                              }}
                            >
                              {adapter.adapter_name.split(" ")[0]}{" "}
                              {hasSent ? "SENT" : "IDLE"}
                            </span>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── TRACE RETURN ─────────────────────────── */}
        {activeInnerTab === "trace_return" &&
          (() => {
            void traceTick; // trigger re-render on interval
            const allTraces = liveBrainBus.getTraceLog();
            const adapterOptions = [
              "all",
              "battleops-adapter-v1",
              "warcommandops-adapter-v1",
            ] as const;
            return (
              <div className="h-full flex flex-col overflow-hidden">
                {/* Sub-header */}
                <div
                  className="shrink-0 px-4 py-2 border-b flex items-center gap-3"
                  style={{ borderColor: BORDER }}
                >
                  <p
                    className="font-mono text-[9px] uppercase tracking-widest font-bold"
                    style={{ color: CYAN }}
                  >
                    Trace Return Log
                  </p>
                  <div className="flex items-center gap-1 ml-auto">
                    {adapterOptions.map((opt) => (
                      <TraceFilterBtn
                        key={opt}
                        label={
                          opt === "all"
                            ? "ALL"
                            : opt.split("-")[0].toUpperCase()
                        }
                        active={traceAdapterFilter === opt}
                        onClick={() => setTraceAdapterFilter(opt)}
                      />
                    ))}
                  </div>
                </div>

                {/* Count row */}
                <div
                  className="shrink-0 px-4 py-1.5 border-b flex gap-4"
                  style={{ borderColor: BORDER }}
                >
                  {adapterOptions
                    .filter((a) => a !== "all")
                    .map((aid) => {
                      const cnt = allTraces.filter(
                        (t) => t.adapter_id === aid,
                      ).length;
                      return (
                        <span
                          key={aid}
                          className="font-mono text-[8px]"
                          style={{ color: DIM }}
                        >
                          {aid.split("-")[0].toUpperCase()}:{" "}
                          <span style={{ color: cnt > 0 ? GREEN : MUTED }}>
                            {cnt} traces
                          </span>
                        </span>
                      );
                    })}
                  <span
                    className="font-mono text-[8px] ml-auto"
                    style={{ color: DIM }}
                  >
                    Auto-refresh 2s
                  </span>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-y-auto">
                  {(() => {
                    const filtered =
                      traceAdapterFilter === "all"
                        ? allTraces
                        : allTraces.filter(
                            (t) => t.adapter_id === traceAdapterFilter,
                          );
                    if (filtered.length === 0) {
                      return (
                        <div
                          data-ocid="deployment.empty_state"
                          className="flex flex-col items-center justify-center h-40 gap-2"
                        >
                          <p
                            className="font-mono text-[9px] text-center"
                            style={{ color: DIM }}
                          >
                            No traces returned yet
                          </p>
                          <p
                            className="font-mono text-[8px] text-center max-w-xs"
                            style={{ color: "oklch(0.28 0.04 240)" }}
                          >
                            Start simulation and begin an adapter session to
                            generate live payload flow
                          </p>
                        </div>
                      );
                    }
                    return (
                      <table
                        className="w-full"
                        style={{ borderCollapse: "collapse" }}
                      >
                        <thead>
                          <tr style={{ background: "oklch(0.07 0.012 265)" }}>
                            {[
                              "Trace ID",
                              "Adapter",
                              "Action",
                              "Conf",
                              "Latency",
                              "Time",
                            ].map((h) => (
                              <th
                                key={h}
                                className="font-mono text-[7px] uppercase tracking-widest px-3 py-1.5 text-left"
                                style={{
                                  color: MUTED,
                                  borderBottom: `1px solid ${BORDER}`,
                                }}
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.slice(0, 100).map((tr, i) => {
                            const aColor =
                              (ACTION_TYPE_COLORS as Record<string, string>)[
                                tr.packet.action_type
                              ] ?? MUTED;
                            return (
                              <tr
                                key={tr.trace_id}
                                data-ocid={`deployment.item.${Math.min(i + 1, 5)}`}
                                style={{
                                  background:
                                    i % 2 === 0
                                      ? "oklch(0.07 0.012 265)"
                                      : "transparent",
                                  borderBottom: `1px solid ${BORDER}`,
                                }}
                              >
                                <td
                                  className="font-mono text-[8px] px-3 py-1.5"
                                  style={{ color: "oklch(0.45 0.07 220)" }}
                                >
                                  {tr.trace_id.slice(0, 16)}…
                                </td>
                                <td
                                  className="font-mono text-[8px] px-3 py-1.5"
                                  style={{ color: "oklch(0.72 0.22 195)" }}
                                >
                                  {tr.adapter_id.split("-")[0].toUpperCase()}
                                </td>
                                <td
                                  className="font-mono text-[8px] px-3 py-1.5 font-semibold"
                                  style={{ color: aColor }}
                                >
                                  {tr.packet.action_type}
                                </td>
                                <td
                                  className="font-mono text-[8px] px-3 py-1.5"
                                  style={{ color: "oklch(0.72 0.22 80)" }}
                                >
                                  {(tr.packet.confidence * 100).toFixed(0)}%
                                </td>
                                <td
                                  className="font-mono text-[8px] px-3 py-1.5"
                                  style={{ color: DIM }}
                                >
                                  {tr.latency_ms.toFixed(1)}ms
                                </td>
                                <td
                                  className="font-mono text-[8px] px-3 py-1.5"
                                  style={{ color: DIM }}
                                >
                                  {new Date(tr.timestamp).toLocaleTimeString()}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    );
                  })()}
                </div>
              </div>
            );
          })()}

        {/* ── TREATY ─────────────────────────── */}
        {activeInnerTab === "treaty" && (
          <div className="h-full overflow-y-auto p-4">
            <SharedTreatyPanel />
          </div>
        )}
      </div>
    </div>
  );
}
