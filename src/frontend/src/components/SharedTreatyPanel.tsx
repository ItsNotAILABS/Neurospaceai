import {
  CANONICAL_INSTANCE_TYPES,
  CANONICAL_ROLE_OVERLAYS,
} from "../hooks/useBrainIntegrationSystem";

const BG = "oklch(0.075 0.012 265)";
const BORDER = "oklch(0.18 0.05 250)";
const CYAN = "oklch(0.72 0.22 195)";
const GREEN = "oklch(0.72 0.2 155)";
const AMBER = "oklch(0.78 0.22 75)";
const DIM = "oklch(0.38 0.05 220)";
const FG = "oklch(0.82 0.04 220)";

const CONTRACT_VERSION = "1.0.0";
const PAYLOAD_SCHEMA_VERSION = "1.0.0";

const SYSTEMS = [
  {
    name: "NeuroEmergence Core",
    role: "HOST / INTELLIGENCE OWNER",
    status: "LIVE",
    color: GREEN,
  },
  {
    name: "Emergent BattleOps",
    role: "BATTLE DEPLOYMENT",
    status: "ADAPTER-LIVE",
    color: AMBER,
  },
  {
    name: "Emergent WarCommandOps",
    role: "COMMAND DEPLOYMENT",
    status: "ADAPTER-LIVE",
    color: AMBER,
  },
];

const CANONICAL_PAYLOADS = [
  "PerceptionPayload",
  "EmbodimentPayload",
  "RegulationPayload",
  "GoalPayload",
  "BrainActionPacket",
  "AnalyticsSnapshot",
  "BrainHealthSummary",
  "ReadinessStatus",
  "ValidationSummary",
  "MaturationRecommendationSet",
];

export function SharedTreatyPanel() {
  return (
    <div
      className="rounded-sm border p-4"
      style={{ background: BG, borderColor: BORDER }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span
          className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-sm"
          style={{
            background: `${CYAN}18`,
            border: `1px solid ${CYAN}40`,
            color: CYAN,
          }}
        >
          SHARED TREATY
        </span>
        <span
          className="font-mono text-[8px] tracking-widest"
          style={{ color: DIM }}
        >
          CONTRACT v
          <span className="font-bold" style={{ color: CYAN }}>
            {CONTRACT_VERSION}
          </span>
          {" · "}
          SCHEMA v
          <span className="font-bold" style={{ color: CYAN }}>
            {PAYLOAD_SCHEMA_VERSION}
          </span>
        </span>
      </div>

      {/* Systems */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
        {SYSTEMS.map((sys) => (
          <div
            key={sys.name}
            className="rounded-sm border p-2.5"
            style={{
              background: `${sys.color}08`,
              borderColor: `${sys.color}30`,
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                  background: sys.color,
                  boxShadow: `0 0 6px ${sys.color}`,
                }}
              />
              <span
                className="font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm"
                style={{ background: `${sys.color}20`, color: sys.color }}
              >
                {sys.status}
              </span>
            </div>
            <p
              className="font-mono text-[10px] font-semibold"
              style={{ color: FG }}
            >
              {sys.name}
            </p>
            <p className="font-mono text-[8px]" style={{ color: DIM }}>
              {sys.role}
            </p>
          </div>
        ))}
      </div>

      {/* Mutation boundary */}
      <div
        className="rounded-sm border px-3 py-2 mb-4 flex items-start gap-2"
        style={{
          background: "oklch(0.09 0.02 35)",
          borderColor: "oklch(0.3 0.12 35)",
        }}
      >
        <span
          style={{ color: "oklch(0.75 0.22 35)" }}
          className="shrink-0 text-xs"
        >
          ⚠
        </span>
        <div>
          <p
            className="font-mono text-[8px] uppercase tracking-widest mb-0.5"
            style={{ color: "oklch(0.75 0.22 35)" }}
          >
            MUTATION BOUNDARY
          </p>
          <p
            className="font-mono text-[9px]"
            style={{ color: "oklch(0.65 0.08 220)" }}
          >
            No direct core mutation. All changes via analytics ingest +
            validation queue.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Canonical instance types */}
        <div>
          <p
            className="font-mono text-[8px] uppercase tracking-widest mb-2"
            style={{ color: DIM }}
          >
            Canonical Instance Types
          </p>
          <div className="flex flex-wrap gap-1">
            {CANONICAL_INSTANCE_TYPES.map((t) => (
              <span
                key={t}
                className="font-mono text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm"
                style={{
                  background: "oklch(0.11 0.03 260)",
                  color: "oklch(0.5 0.08 220)",
                  border: "1px solid oklch(0.18 0.04 250)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Canonical payloads */}
        <div>
          <p
            className="font-mono text-[8px] uppercase tracking-widest mb-2"
            style={{ color: DIM }}
          >
            Canonical Payloads
          </p>
          <div className="flex flex-wrap gap-1">
            {CANONICAL_PAYLOADS.map((p) => (
              <span
                key={p}
                className="font-mono text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm"
                style={{
                  background: "oklch(0.11 0.03 280)",
                  color: "oklch(0.5 0.08 260)",
                  border: "1px solid oklch(0.18 0.04 270)",
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Role overlays */}
        <div>
          <p
            className="font-mono text-[8px] uppercase tracking-widest mb-2"
            style={{ color: DIM }}
          >
            Canonical Role Overlays
          </p>
          <div className="flex flex-wrap gap-1">
            {CANONICAL_ROLE_OVERLAYS.map((r) => (
              <span
                key={r}
                className="font-mono text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm"
                style={{
                  background: "oklch(0.11 0.03 195)",
                  color: "oklch(0.5 0.08 195)",
                  border: "1px solid oklch(0.18 0.04 200)",
                }}
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* Binding rules */}
        <div>
          <p
            className="font-mono text-[8px] uppercase tracking-widest mb-2"
            style={{ color: DIM }}
          >
            Binding Rules
          </p>
          <div className="space-y-1">
            {[
              "All adapters must pass compatibility validation",
              "Binding maps require canonical instance type match",
              "Version drift blocks live integration",
              "No direct weight/threshold mutation",
            ].map((rule) => (
              <div key={rule} className="flex items-start gap-1.5">
                <span
                  style={{ color: CYAN }}
                  className="font-mono text-[8px] shrink-0"
                >
                  ›
                </span>
                <span
                  className="font-mono text-[8px] leading-relaxed"
                  style={{ color: "oklch(0.55 0.06 220)" }}
                >
                  {rule}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
