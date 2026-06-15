import { useState } from "react";
import type {
  NeuralSimulationControls,
  NeuralSimulationState,
} from "../hooks/useNeuralSimulation";

type Neural = NeuralSimulationState & NeuralSimulationControls;

const BORDER = "oklch(0.18 0.05 255)";
const CYAN = "oklch(0.72 0.22 195)";
const GREEN = "oklch(0.68 0.28 140)";
const AMBER = "oklch(0.78 0.22 80)";
const RED = "oklch(0.72 0.22 25)";
const MUTED = "oklch(0.38 0.05 220)";
const DIM = "oklch(0.28 0.04 240)";
const PANEL = "oklch(0.09 0.015 265)";
const BG = "oklch(0.055 0.01 265)";

const OWNS = [
  "cognition runtime",
  "salience",
  "working memory",
  "persistence",
  "arbitration",
  "policy selection",
  "regulation",
  "cardio / ANS / interoception",
  "memory / prediction / learning",
  "sparse compute",
  "analytics core",
  "validation",
  "optimization / bounded auto-maturation",
  "readiness gate",
  "stable APIs",
  "integration contracts",
  "binding compatibility support",
];

const NOT_OWNS = [
  "war game world rendering",
  "war game terrain engine",
  "war game HUD",
  "war game combat presentation",
  "scenario builder UI",
  "command testbed presentation layer",
  "command HUD as a product UI",
  "external entity classes from other softwares",
];

const INTEGRATION_MATRIX = [
  {
    id: 1,
    direction: "IN",
    payload: "PerceptionPayload",
    purpose: "Send sensed world state into the brain",
    ownership: "War Game constructs, Core Brain validates",
    mutation: "No core mutation",
    validation: "Yes",
  },
  {
    id: 2,
    direction: "IN",
    payload: "EmbodimentPayload",
    purpose: "Send body/location/exposure/load state into the brain",
    ownership: "War Game constructs, Core Brain validates",
    mutation: "No core mutation",
    validation: "Yes",
  },
  {
    id: 3,
    direction: "IN",
    payload: "RegulationPayload",
    purpose: "Send deployment-generated stress/fatigue/urgency/body proxies",
    ownership: "War Game constructs, Core Brain validates",
    mutation: "No core mutation",
    validation: "Yes",
  },
  {
    id: 4,
    direction: "IN",
    payload: "GoalPayload",
    purpose: "Send objective/context/command state into the brain",
    ownership: "War Game constructs, Core Brain validates",
    mutation: "No core mutation",
    validation: "Yes",
  },
  {
    id: 5,
    direction: "IN",
    payload: "External action/outcome traces",
    purpose: "Send result data back into analytics/validation pathways",
    ownership: "War Game constructs, Core Brain ingests",
    mutation: "Only through bounded validation paths",
    validation: "Yes",
  },
  {
    id: 6,
    direction: "OUT",
    payload: "BrainActionPacket",
    purpose: "Send action decisions to the war game",
    ownership: "Core Brain constructs, War Game consumes",
    mutation: "War Game executes in its own domain only",
    validation: "Schema compatibility required",
  },
  {
    id: 7,
    direction: "OUT",
    payload: "Analytics / Health / Readiness",
    purpose: "Expose brain-side state summaries",
    ownership: "Core Brain constructs, War Game views",
    mutation: "No",
    validation: "Version compatibility required",
  },
  {
    id: 8,
    direction: "IN",
    payload: "Scenario PerceptionPayload",
    purpose: "Send scenario-scale perceived state into the brain",
    ownership: "Scenario constructs, Core Brain validates",
    mutation: "No core mutation",
    validation: "Yes",
  },
  {
    id: 9,
    direction: "IN",
    payload: "Scenario EmbodimentPayload",
    purpose: "Send context/body/scope state into the brain",
    ownership: "Scenario constructs, Core Brain validates",
    mutation: "No core mutation",
    validation: "Yes",
  },
  {
    id: 10,
    direction: "IN",
    payload: "Scenario RegulationPayload",
    purpose: "Send command burden/casualty/supply/urgency signals",
    ownership: "Scenario constructs, Core Brain validates",
    mutation: "No core mutation",
    validation: "Yes",
  },
  {
    id: 11,
    direction: "IN",
    payload: "Scenario GoalPayload",
    purpose: "Send command objectives/doctrine/chain context",
    ownership: "Scenario constructs, Core Brain validates",
    mutation: "No core mutation",
    validation: "Yes",
  },
  {
    id: 12,
    direction: "IN",
    payload: "Experiment results / command outcomes",
    purpose: "Send evaluation outcomes into analytics/validation",
    ownership: "Scenario constructs, Core Brain ingests",
    mutation: "Only through bounded validation paths",
    validation: "Yes",
  },
  {
    id: 13,
    direction: "OUT",
    payload: "BrainActionPacket",
    purpose: "Send command/operational decisions back",
    ownership: "Core Brain constructs, Scenario consumes",
    mutation: "Scenario executes in its own domain only",
    validation: "Schema compatibility required",
  },
  {
    id: 14,
    direction: "OUT",
    payload: "Analytics / Health / Readiness",
    purpose: "Expose brain-side state summaries",
    ownership: "Core Brain constructs, Scenario views",
    mutation: "No",
    validation: "Version compatibility required",
  },
];

const BLOCKED_OPS = [
  "direct mutation of connection weights",
  "direct mutation of thresholds",
  "direct mutation of memory stores",
  "direct promotion of candidate changes",
  "direct bypass of arbitration/policy logic",
  "deployment-side authored semantic injections into the brain core",
];

const VERSIONING_RULES = [
  "All payload schemas must have explicit version identifiers",
  "All adapters must declare supported contract version",
  "Core Brain must reject incompatible adapter versions",
  "Backward compatibility rules must be explicit",
  "Any breaking API/schema change requires version bump and migration note",
];

const COMPATIBILITY_RULES = [
  "War Game adapter compatibility must be validated before session starts",
  "Real War Scenario adapter compatibility must be validated before session starts",
  "Binding maps must be validated before activation",
  "Unsupported role/scope overlays must be rejected",
];

const MAY_DO = [
  "create instances",
  "send typed payloads",
  "step instances",
  "receive actions",
  "read analytics",
  "ingest outcome traces",
  "submit candidate changes through bounded validation",
];

const MAY_NOT_DO = [
  "directly change weights",
  "directly change thresholds",
  "directly change memory stores",
  "directly alter optimization promotion state",
  "directly bypass arbitration/policy selection",
  "directly write semantic authored conclusions into the core",
];

const CANDIDATE_RULES = [
  "all candidate changes require source attribution",
  "all candidate changes require validation queue entry",
  "all candidate changes require rollback path",
  "no candidate change may promote directly without validation",
];

function FlowNode({ label, sub }: { label: string; sub?: string }) {
  return (
    <div
      className="px-3 py-2 border text-center flex flex-col gap-0.5"
      style={{
        background: "oklch(0.08 0.015 265)",
        borderColor: `${CYAN}60`,
        minWidth: 120,
      }}
    >
      <span
        className="font-mono text-[9px] tracking-wider"
        style={{ color: CYAN }}
      >
        {label}
      </span>
      {sub && (
        <span className="font-mono text-[7px]" style={{ color: MUTED }}>
          {sub}
        </span>
      )}
    </div>
  );
}

function FlowArrow({
  label,
  color = CYAN,
}: { label?: string; color?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ minWidth: 32 }}
    >
      <div
        style={{ width: 1, height: label ? 6 : 10, background: `${color}60` }}
      />
      {label && (
        <span
          className="font-mono text-[6px] tracking-wider px-1"
          style={{ color: MUTED, whiteSpace: "nowrap" }}
        >
          {label}
        </span>
      )}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: "4px solid transparent",
          borderRight: "4px solid transparent",
          borderTop: `5px solid ${color}80`,
        }}
      />
    </div>
  );
}

export default function SystemMapTab({ neural: _neural }: { neural: Neural }) {
  const [versioningOpen, setVersioningOpen] = useState(false);

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: BG, color: "oklch(0.75 0.06 220)" }}
    >
      {/* Header */}
      <div
        className="shrink-0 px-6 py-4 border-b"
        style={{ borderColor: BORDER, background: "oklch(0.07 0.012 265)" }}
      >
        <div className="flex flex-col gap-0.5">
          <span
            className="font-mono text-[11px] tracking-widest uppercase"
            style={{ color: MUTED }}
          >
            PACK 1
          </span>
          <h1
            className="font-mono text-lg tracking-widest uppercase"
            style={{ color: CYAN }}
          >
            SYSTEM MAP
          </h1>
          <p className="font-mono text-[10px]" style={{ color: MUTED }}>
            Core Brain Software — Master Architecture Reference
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5 p-5">
        {/* Software Identity */}
        <section>
          <div
            className="font-mono text-[9px] tracking-widest uppercase mb-2"
            style={{ color: MUTED }}
          >
            SOFTWARE IDENTITY
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div
              className="border p-3 flex flex-col gap-2"
              style={{
                background: PANEL,
                borderColor: `${GREEN}40`,
                borderLeft: `2px solid ${GREEN}`,
              }}
            >
              <div
                className="font-mono text-[8px] tracking-widest uppercase mb-1"
                style={{ color: GREEN }}
              >
                THIS SOFTWARE OWNS
              </div>
              {OWNS.map((item) => (
                <div key={item} className="flex items-start gap-1.5">
                  <span
                    className="font-mono text-[8px] mt-0.5"
                    style={{ color: GREEN }}
                  >
                    ✓
                  </span>
                  <span
                    className="font-mono text-[8px]"
                    style={{ color: "oklch(0.62 0.1 150)" }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="border p-3 flex flex-col gap-2"
              style={{
                background: PANEL,
                borderColor: `${AMBER}40`,
                borderLeft: `2px solid ${AMBER}`,
              }}
            >
              <div
                className="font-mono text-[8px] tracking-widest uppercase mb-1"
                style={{ color: AMBER }}
              >
                THIS SOFTWARE DOES NOT OWN
              </div>
              {NOT_OWNS.map((item) => (
                <div key={item} className="flex items-start gap-1.5">
                  <span
                    className="font-mono text-[8px] mt-0.5"
                    style={{ color: AMBER }}
                  >
                    ○
                  </span>
                  <span
                    className="font-mono text-[8px]"
                    style={{ color: "oklch(0.55 0.1 80)" }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Asset Rule */}
        <div
          data-ocid="system_map.card"
          className="border p-4 font-mono text-[9px] text-center tracking-wide"
          style={{
            background: "oklch(0.07 0.01 265)",
            borderColor: `${CYAN}50`,
            color: CYAN,
            boxShadow: `0 0 20px ${CYAN}15`,
          }}
        >
          <div
            className="text-[7px] tracking-widest uppercase mb-1"
            style={{ color: MUTED }}
          >
            ASSET RULE
          </div>
          This software is the intelligence asset. The other two softwares are
          deployments.
          <br />
          No deployment may directly mutate the core asset.
        </div>

        {/* High-Level Flow */}
        <section>
          <div
            className="font-mono text-[9px] tracking-widest uppercase mb-3"
            style={{ color: MUTED }}
          >
            HIGH-LEVEL FLOW
          </div>
          <div
            className="border p-4 flex flex-col gap-4"
            style={{ background: PANEL, borderColor: BORDER }}
          >
            {/* Forward flows */}
            <div className="flex flex-col gap-2">
              {/* Flow 1 */}
              <div className="flex items-center gap-0 flex-wrap">
                <FlowNode label="War Game Software" />
                <FlowArrow />
                <FlowNode
                  label="WarGameIntegrationAdapter"
                  sub="translation layer"
                />
                <FlowArrow />
                <FlowNode label="Core Brain APIs" sub="Integration Contracts" />
                <FlowArrow />
                <FlowNode label="Core Brain Runtime" sub="intelligence asset" />
              </div>
              {/* Flow 2 */}
              <div className="flex items-center gap-0 flex-wrap">
                <FlowNode label="Real War Scenario" sub="Software" />
                <FlowArrow />
                <FlowNode
                  label="CommandTestbedAdapter"
                  sub="translation layer"
                />
                <FlowArrow />
                <FlowNode label="Core Brain APIs" sub="Integration Contracts" />
                <FlowArrow />
                <FlowNode label="Core Brain Runtime" sub="intelligence asset" />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: BORDER }} />

            {/* Return flow */}
            <div className="flex flex-col gap-1">
              <div
                className="font-mono text-[7px] tracking-widest uppercase mb-1"
                style={{ color: MUTED }}
              >
                RETURN FLOW
              </div>
              <div className="flex items-center gap-0 flex-wrap">
                <FlowNode label="Core Brain Runtime" sub="intelligence asset" />
                <FlowArrow color={GREEN} />
                <FlowNode
                  label="BrainActionPacket"
                  sub="Analytics / Health / Readiness"
                />
                <FlowArrow color={GREEN} />
                <FlowNode label="adapters" />
                <FlowArrow color={GREEN} />
                <FlowNode label="external softwares" />
              </div>
            </div>
          </div>
        </section>

        {/* Integration Matrix */}
        <section>
          <div
            className="font-mono text-[9px] tracking-widest uppercase mb-2"
            style={{ color: MUTED }}
          >
            CROSS-SOFTWARE INTEGRATION MATRIX
          </div>
          <div
            className="border overflow-x-auto"
            style={{ background: PANEL, borderColor: BORDER }}
          >
            <table
              className="w-full font-mono text-[8px]"
              data-ocid="system_map.table"
            >
              <thead>
                <tr
                  style={{
                    background: "oklch(0.07 0.012 265)",
                    borderBottom: `1px solid ${BORDER}`,
                  }}
                >
                  {[
                    "#",
                    "DIR",
                    "PAYLOAD",
                    "PURPOSE",
                    "OWNERSHIP",
                    "MUTATION",
                    "VALIDATION",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-2 py-2 text-left tracking-widest"
                      style={{ color: MUTED }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INTEGRATION_MATRIX.map((row, i) => (
                  <tr
                    key={row.id}
                    data-ocid={`system_map.row.${i + 1}`}
                    className="border-b"
                    style={{ borderColor: `${BORDER}60` }}
                  >
                    <td className="px-2 py-1.5" style={{ color: DIM }}>
                      {row.id}
                    </td>
                    <td className="px-2 py-1.5">
                      <span
                        className="px-1.5 py-0.5 font-mono text-[7px] tracking-widest"
                        style={{
                          background:
                            row.direction === "IN"
                              ? "oklch(0.72 0.22 195 / 0.15)"
                              : "oklch(0.68 0.28 140 / 0.15)",
                          color: row.direction === "IN" ? CYAN : GREEN,
                          border: `1px solid ${row.direction === "IN" ? CYAN : GREEN}40`,
                        }}
                      >
                        {row.direction}
                      </span>
                    </td>
                    <td className="px-2 py-1.5" style={{ color: CYAN }}>
                      {row.payload}
                    </td>
                    <td
                      className="px-2 py-1.5"
                      style={{ color: "oklch(0.55 0.06 220)" }}
                    >
                      {row.purpose}
                    </td>
                    <td className="px-2 py-1.5" style={{ color: DIM }}>
                      {row.ownership}
                    </td>
                    <td className="px-2 py-1.5">
                      <span
                        style={{
                          color:
                            row.mutation === "No" ||
                            row.mutation === "No core mutation"
                              ? RED
                              : row.mutation.startsWith("Only")
                                ? AMBER
                                : "oklch(0.55 0.06 220)",
                        }}
                      >
                        {row.mutation}
                      </span>
                    </td>
                    <td className="px-2 py-1.5">
                      <span
                        style={{
                          color: row.validation === "Yes" ? GREEN : AMBER,
                        }}
                      >
                        {row.validation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Blocked Operations */}
        <section>
          <div
            className="font-mono text-[9px] tracking-widest uppercase mb-2"
            style={{ color: MUTED }}
          >
            BLOCKED OPERATIONS
          </div>
          <div
            className="border p-4 flex flex-col gap-2"
            style={{
              background: "oklch(0.07 0.01 265)",
              borderColor: `${RED}60`,
              borderLeft: `3px solid ${RED}`,
            }}
          >
            <div
              className="font-mono text-[8px] tracking-widest uppercase mb-1"
              style={{ color: RED }}
            >
              BLOCKED EVERYWHERE
            </div>
            {BLOCKED_OPS.map((op) => (
              <div key={op} className="flex items-start gap-2">
                <span className="font-mono text-[8px]" style={{ color: RED }}>
                  ✗
                </span>
                <span
                  className="font-mono text-[8px]"
                  style={{ color: "oklch(0.55 0.12 25)" }}
                >
                  {op}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Versioning Rules */}
        <section>
          <button
            type="button"
            data-ocid="system_map.versioning.toggle"
            className="w-full flex items-center justify-between px-3 py-2 border font-mono text-[9px] tracking-widest uppercase transition-all"
            style={{
              background: versioningOpen ? PANEL : "oklch(0.07 0.012 265)",
              borderColor: BORDER,
              color: versioningOpen ? CYAN : MUTED,
            }}
            onClick={() => setVersioningOpen((v) => !v)}
          >
            <span>VERSIONING RULES — PACK 6</span>
            <span style={{ color: MUTED }}>{versioningOpen ? "▲" : "▼"}</span>
          </button>
          {versioningOpen && (
            <div
              className="border border-t-0 p-4 flex flex-col gap-2"
              style={{ background: PANEL, borderColor: BORDER }}
            >
              {[...VERSIONING_RULES, ...COMPATIBILITY_RULES].map((rule) => (
                <div key={rule} className="flex items-start gap-2">
                  <span
                    className="font-mono text-[8px] mt-0.5"
                    style={{ color: CYAN }}
                  >
                    →
                  </span>
                  <span
                    className="font-mono text-[8px]"
                    style={{ color: "oklch(0.55 0.06 220)" }}
                  >
                    {rule}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Mutation-Boundary Rules */}
        <section>
          <div
            className="font-mono text-[9px] tracking-widest uppercase mb-2"
            style={{ color: MUTED }}
          >
            MUTATION-BOUNDARY RULES
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div
              className="border p-3 flex flex-col gap-2"
              style={{
                background: PANEL,
                borderColor: `${GREEN}40`,
                borderLeft: `2px solid ${GREEN}`,
              }}
            >
              <div
                className="font-mono text-[8px] tracking-widest uppercase mb-1"
                style={{ color: GREEN }}
              >
                MAY DO
              </div>
              {MAY_DO.map((item) => (
                <div key={item} className="flex items-start gap-1.5">
                  <span
                    className="font-mono text-[8px] mt-0.5"
                    style={{ color: GREEN }}
                  >
                    ✓
                  </span>
                  <span
                    className="font-mono text-[8px]"
                    style={{ color: "oklch(0.55 0.08 150)" }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="border p-3 flex flex-col gap-2"
              style={{
                background: PANEL,
                borderColor: `${RED}40`,
                borderLeft: `2px solid ${RED}`,
              }}
            >
              <div
                className="font-mono text-[8px] tracking-widest uppercase mb-1"
                style={{ color: RED }}
              >
                MAY NOT DO
              </div>
              {MAY_NOT_DO.map((item) => (
                <div key={item} className="flex items-start gap-1.5">
                  <span
                    className="font-mono text-[8px] mt-0.5"
                    style={{ color: RED }}
                  >
                    ✗
                  </span>
                  <span
                    className="font-mono text-[8px]"
                    style={{ color: "oklch(0.55 0.12 25)" }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Candidate Change Rules */}
        <section>
          <div
            className="font-mono text-[9px] tracking-widest uppercase mb-2"
            style={{ color: MUTED }}
          >
            CANDIDATE CHANGE RULES
          </div>
          <div
            className="border p-4 flex flex-col gap-2"
            style={{ background: PANEL, borderColor: `${AMBER}40` }}
          >
            {CANDIDATE_RULES.map((rule, i) => (
              <div
                key={rule}
                className="flex items-start gap-2"
                data-ocid={`system_map.item.${i + 1}`}
              >
                <span
                  className="font-mono text-[8px] px-1 shrink-0"
                  style={{
                    background: "oklch(0.78 0.22 80 / 0.15)",
                    color: AMBER,
                    border: `1px solid ${AMBER}30`,
                  }}
                >
                  {i + 1}
                </span>
                <span
                  className="font-mono text-[8px]"
                  style={{ color: "oklch(0.55 0.1 80)" }}
                >
                  {rule}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Final Rule */}
        <div
          className="border p-4 font-mono text-[9px] text-center tracking-wide"
          style={{
            background: "oklch(0.06 0.01 25)",
            borderColor: `${RED}60`,
            color: RED,
            boxShadow: `0 0 20px ${RED}10`,
            marginBottom: "1rem",
          }}
        >
          <div
            className="text-[7px] tracking-widest uppercase mb-2"
            style={{ color: "oklch(0.45 0.08 25)" }}
          >
            FINAL RULE
          </div>
          If compatibility is unclear, reject. If mutation is unsafe, reject. If
          validation is missing, reject.
        </div>
      </div>
    </div>
  );
}
