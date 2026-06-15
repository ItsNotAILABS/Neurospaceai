import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Shield,
  XCircle,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createArtifact } from "../utils/artifactStore";
import {
  type GoLiveCondition,
  type GoLiveResult,
  evaluateGoLive,
} from "../utils/goLiveRuntime";
import {
  CONTRACT_VERSION,
  PAYLOAD_SCHEMA_VERSION,
} from "../utils/integrationContractLayer";
import { liveBrainBus } from "../utils/liveBrainBus";

const SECTIONS = [
  {
    key: "core_runtime",
    title: "Runtime",
    group: "NeuroEmergence Core Go-Live Conditions",
    ocid: "golive.section.core_runtime.panel",
  },
  {
    key: "core_regulation",
    title: "Regulation",
    group: "NeuroEmergence Core Go-Live Conditions",
    ocid: "golive.section.core_regulation.panel",
  },
  {
    key: "core_circuit",
    title: "Circuitry / Memory / Prediction / Learning",
    group: "NeuroEmergence Core Go-Live Conditions",
    ocid: "golive.section.core_circuit.panel",
  },
  {
    key: "core_efficiency",
    title: "Efficiency",
    group: "NeuroEmergence Core Go-Live Conditions",
    ocid: "golive.section.core_efficiency.panel",
  },
  {
    key: "core_analytics",
    title: "Analytics / Validation",
    group: "NeuroEmergence Core Go-Live Conditions",
    ocid: "golive.section.core_analytics.panel",
  },
  {
    key: "core_integration",
    title: "Integration",
    group: "NeuroEmergence Core Go-Live Conditions",
    ocid: "golive.section.core_integration.panel",
  },
  {
    key: "core_live_battleops",
    title: "Live Deployment — Emergent BattleOps",
    group: "NeuroEmergence Core Go-Live Conditions",
    ocid: "golive.section.core_live_battleops.panel",
  },
  {
    key: "core_live_warops",
    title: "Live Deployment — Emergent WarCommandOps",
    group: "NeuroEmergence Core Go-Live Conditions",
    ocid: "golive.section.core_live_warops.panel",
  },
  {
    key: "core_reports",
    title: "Reports",
    group: "NeuroEmergence Core Go-Live Conditions",
    ocid: "golive.section.core_reports.panel",
  },
  {
    key: "shared_contract",
    title: "Shared Contract Conditions",
    group: "Section 5 — Shared Contract",
    ocid: "golive.section.shared_contract.panel",
  },
  {
    key: "blockers",
    title: "Active Go-Live Blockers",
    group: "Section 6 — Blockers",
    ocid: "golive.section.blockers.panel",
  },
];

function StatusIcon({ status }: { status: GoLiveCondition["status"] }) {
  if (status === "pass") {
    return (
      <CheckCircle2
        className="w-3.5 h-3.5 shrink-0"
        style={{ color: "oklch(0.72 0.22 155)" }}
      />
    );
  }
  if (status === "blocked") {
    return (
      <AlertTriangle
        className="w-3.5 h-3.5 shrink-0"
        style={{ color: "oklch(0.72 0.22 45)" }}
      />
    );
  }
  return (
    <XCircle
      className="w-3.5 h-3.5 shrink-0"
      style={{ color: "oklch(0.62 0.22 25)" }}
    />
  );
}

function ConditionRow({ condition }: { condition: GoLiveCondition }) {
  const isFailing = condition.status !== "pass";
  return (
    <div
      className="flex items-center gap-2 py-1 px-2 rounded"
      style={{
        background: isFailing ? "oklch(0.14 0.04 20 / 0.4)" : "transparent",
      }}
    >
      <StatusIcon status={condition.status} />
      <span
        className="font-mono text-[10px] flex-1"
        style={{
          color: isFailing ? "oklch(0.75 0.08 20)" : "oklch(0.62 0.04 220)",
        }}
      >
        {condition.label}
      </span>
      {isFailing && condition.blocker && (
        <span
          className="font-mono text-[8px] px-1 py-0.5 rounded"
          style={{
            background: "oklch(0.62 0.22 25 / 0.2)",
            color: "oklch(0.72 0.18 25)",
            border: "1px solid oklch(0.62 0.22 25 / 0.4)",
          }}
        >
          BLOCKER
        </span>
      )}
    </div>
  );
}

function SectionCard({
  title,
  conditions,
  ocid,
}: {
  title: string;
  conditions: GoLiveCondition[];
  ocid: string;
}) {
  const [open, setOpen] = useState(true);
  const passing = conditions.filter((c) => c.status === "pass").length;
  const total = conditions.length;
  const allPass = passing === total;

  return (
    <div
      data-ocid={ocid}
      className="rounded border overflow-hidden"
      style={{
        background: "oklch(0.075 0.012 265)",
        borderColor: allPass ? "oklch(0.28 0.06 155)" : "oklch(0.28 0.08 20)",
      }}
    >
      <button
        type="button"
        className="w-full flex items-center gap-2 px-3 py-2 text-left"
        onClick={() => setOpen(!open)}
        style={{ background: "oklch(0.09 0.015 265 / 0.5)" }}
      >
        {open ? (
          <ChevronDown
            className="w-3 h-3"
            style={{ color: "oklch(0.45 0.06 220)" }}
          />
        ) : (
          <ChevronRight
            className="w-3 h-3"
            style={{ color: "oklch(0.45 0.06 220)" }}
          />
        )}
        <span
          className="font-mono text-[9px] tracking-widest uppercase flex-1"
          style={{ color: "oklch(0.65 0.06 220)" }}
        >
          {title}
        </span>
        <span
          className="font-mono text-[9px]"
          style={{
            color: allPass ? "oklch(0.72 0.22 155)" : "oklch(0.62 0.22 25)",
          }}
        >
          {passing}/{total}
        </span>
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: allPass
              ? "oklch(0.72 0.22 155)"
              : "oklch(0.62 0.22 25)",
            boxShadow: allPass
              ? "0 0 6px oklch(0.72 0.22 155)"
              : "0 0 6px oklch(0.62 0.22 25)",
          }}
        />
      </button>
      {open && (
        <div className="px-2 pb-2 pt-1 flex flex-col gap-0.5">
          {conditions.map((c) => (
            <ConditionRow key={c.id} condition={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = circ * score;
  const color =
    pct >= 95
      ? "oklch(0.72 0.22 155)"
      : pct >= 75
        ? "oklch(0.82 0.2 80)"
        : "oklch(0.62 0.22 25)";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 96, height: 96 }}
    >
      <svg
        width="96"
        height="96"
        className="-rotate-90"
        style={{ position: "absolute" }}
        aria-label="Go-live score ring"
        role="img"
      >
        <title>Go-live score ring</title>
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="oklch(0.15 0.03 265)"
          strokeWidth="6"
        />
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 4px ${color})`,
            transition: "stroke-dasharray 0.6s ease",
          }}
        />
      </svg>
      <div className="flex flex-col items-center">
        <span className="font-mono text-xl font-bold" style={{ color }}>
          {pct}%
        </span>
        <span
          className="font-mono text-[8px] tracking-widest"
          style={{ color: "oklch(0.38 0.05 220)" }}
        >
          PASS RATE
        </span>
      </div>
    </div>
  );
}

function SystemBadge({ label, ready }: { label: string; ready: boolean }) {
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded"
      style={{
        background: ready
          ? "oklch(0.72 0.22 155 / 0.08)"
          : "oklch(0.62 0.22 25 / 0.08)",
        border: `1px solid ${ready ? "oklch(0.72 0.22 155 / 0.3)" : "oklch(0.62 0.22 25 / 0.3)"}`,
      }}
    >
      <div
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background: ready ? "oklch(0.72 0.22 155)" : "oklch(0.62 0.22 25)",
          boxShadow: ready
            ? "0 0 5px oklch(0.72 0.22 155)"
            : "0 0 5px oklch(0.62 0.22 25)",
        }}
      />
      <span
        className="font-mono text-[9px]"
        style={{ color: "oklch(0.6 0.05 220)" }}
      >
        {label}
      </span>
      <span
        className="font-mono text-[8px] font-bold tracking-widest"
        style={{
          color: ready ? "oklch(0.72 0.22 155)" : "oklch(0.62 0.22 25)",
        }}
      >
        {ready ? "READY" : "BLOCKED"}
      </span>
    </div>
  );
}

export default function GoLiveDeclarationTab({
  neural: _neural,
}: { neural: unknown }) {
  const [result, setResult] = useState<GoLiveResult | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [declarationOpen, setDeclarationOpen] = useState(false);
  const [declared, setDeclared] = useState(false);
  const [busPacketsTick, setBusPacketsTick] = useState(0);
  const prevPacketsRef = useRef(0);

  const runEval = () => {
    setEvaluating(true);
    setTimeout(() => {
      const r = evaluateGoLive();
      setResult(r);
      setEvaluating(false);
      // Create go-live artifact
      const _pc = r.conditions.filter((c) => c.status === "pass").length;
      const _fc = r.conditions.filter((c) => c.status === "fail").length;
      const _wc = r.conditions.filter((c) => c.status === "blocked").length;
      createArtifact({
        artifact_type: "go_live_report",
        source_system: "core",
        title: `Go-Live Evaluation — ${new Date().toLocaleTimeString()}`,
        summary: `Score: ${r.score}% | ${_pc} passed / ${_fc} failed / ${_wc} warnings. Verdict: ${r.overallVerdict}`,
        score: r.score,
        status:
          r.overallVerdict === "GO_LIVE_COMPLETE"
            ? "pass"
            : _fc > 0
              ? "fail"
              : "warn",
        ai_review_summary:
          r.overallVerdict === "GO_LIVE_COMPLETE"
            ? "System is ready for deployment. All go-live conditions satisfied."
            : `Deployment blocked. ${_fc} conditions failed. Blockers: ${r.blockers.slice(0, 2).join("; ")}`,
        metadata: {
          passed: _pc,
          failed: _fc,
          warnings: _wc,
          verdict: r.overallVerdict,
          core_ready: r.coreReady,
        },
        related_artifact_ids: [],
        tags: [
          "go_live",
          "readiness",
          r.overallVerdict === "GO_LIVE_COMPLETE" ? "pass" : "blocked",
        ],
        version: "1.0.0",
      });
    }, 600);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  useEffect(() => {
    liveBrainBus.start();
    runEval();
  }, []);

  // Poll busPackets every 500ms so we react to packet arrival quickly
  useEffect(() => {
    const id = setInterval(() => setBusPacketsTick((t) => t + 1), 500);
    return () => clearInterval(id);
  }, []);

  // Auto-run evaluation when packet gate transitions from 0 → >0
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional dep on tick
  useEffect(() => {
    const current = liveBrainBus.getBusStatus().packetsReturned;
    if (prevPacketsRef.current === 0 && current > 0) {
      runEval();
    }
    prevPacketsRef.current = current;
  }, [busPacketsTick]);

  const isLive = result?.overallVerdict === "GO_LIVE_COMPLETE";
  const busPackets = liveBrainBus.getBusStatus().packetsReturned;
  const payloadGatePassed = busPackets > 0;

  // Group conditions by section
  const bySection = (key: string) =>
    result?.conditions.filter((c) => c.section === key) ?? [];

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "oklch(0.055 0.01 265)", overflow: "hidden" }}
    >
      {/* Header */}
      <div
        className="shrink-0 px-4 py-3 border-b flex items-start gap-3"
        style={{
          background: "oklch(0.065 0.012 265)",
          borderColor: "oklch(0.18 0.04 255)",
        }}
      >
        <div className="flex items-center gap-2 pt-0.5">
          <Shield
            className="w-4 h-4"
            style={{ color: "oklch(0.72 0.22 195)" }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="font-mono text-xs font-bold tracking-widest uppercase"
              style={{ color: "oklch(0.82 0.15 195)" }}
            >
              GO-LIVE DECLARATION PACK
            </span>
            <Badge
              className="font-mono text-[8px] tracking-wider"
              style={{
                background: "oklch(0.72 0.22 195 / 0.12)",
                color: "oklch(0.72 0.22 195)",
                border: "1px solid oklch(0.72 0.22 195 / 0.3)",
              }}
            >
              CONTRACT v{CONTRACT_VERSION}
            </Badge>
            <Badge
              className="font-mono text-[8px] tracking-wider"
              style={{
                background: "oklch(0.65 0.18 280 / 0.12)",
                color: "oklch(0.65 0.18 280)",
                border: "1px solid oklch(0.65 0.18 280 / 0.3)",
              }}
            >
              SCHEMA v{PAYLOAD_SCHEMA_VERSION}
            </Badge>
          </div>
          <p
            className="font-mono text-[9px] mt-0.5"
            style={{ color: "oklch(0.38 0.05 220)" }}
          >
            Final Shared Activation Contract — NeuroEmergence Core × Emergent
            BattleOps × Emergent WarCommandOps
          </p>
        </div>
        <Button
          data-ocid="golive.run_eval.button"
          size="sm"
          onClick={runEval}
          disabled={evaluating}
          className="shrink-0 font-mono text-[9px] tracking-widest uppercase h-7 px-3"
          style={{
            background: "oklch(0.72 0.22 195 / 0.15)",
            color: "oklch(0.72 0.22 195)",
            border: "1px solid oklch(0.72 0.22 195 / 0.4)",
          }}
        >
          {evaluating ? (
            <RefreshCw className="w-3 h-3 animate-spin mr-1" />
          ) : (
            <Zap className="w-3 h-3 mr-1" />
          )}
          {evaluating ? "Evaluating…" : "Run Evaluation"}
        </Button>
      </div>

      {/* Packet Gate Cleared Banner */}
      {payloadGatePassed && (
        <div
          className="px-4 py-2 shrink-0 flex items-center gap-3"
          style={{
            background: "oklch(0.12 0.05 140)",
            borderBottom: "1px solid oklch(0.72 0.22 140 / 0.4)",
          }}
          data-ocid="golive.packet_gate.success_state"
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "oklch(0.72 0.22 140)",
              boxShadow: "0 0 10px oklch(0.72 0.22 140)",
              flexShrink: 0,
            }}
          />
          <span
            className="font-mono text-[9px] font-bold tracking-widest"
            style={{ color: "oklch(0.82 0.22 140)" }}
          >
            PACKET GATE CLEARED — {busPackets} packet
            {busPackets !== 1 ? "s" : ""} confirmed
          </span>
          <span
            className="font-mono text-[8px]"
            style={{ color: "oklch(0.55 0.12 140)" }}
          >
            · Go-Live eligible ·{" "}
            {isLive
              ? "All conditions passed — click Declare to confirm"
              : "Run Evaluation to check remaining conditions"}
          </span>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: condition checklist */}
        <ScrollArea className="flex-1 min-w-0">
          <div className="p-3 flex flex-col gap-2">
            {/* Payload gate row */}
            <div
              data-ocid="golive.panel"
              className="rounded border p-3 mb-1"
              style={{
                background: payloadGatePassed
                  ? "oklch(0.08 0.02 155)"
                  : "oklch(0.08 0.02 25)",
                borderColor: payloadGatePassed
                  ? "oklch(0.28 0.12 155)"
                  : "oklch(0.28 0.12 25)",
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  style={{
                    color: payloadGatePassed
                      ? "oklch(0.72 0.2 155)"
                      : "oklch(0.72 0.22 25)",
                  }}
                >
                  {payloadGatePassed ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                </span>
                <span
                  className="font-mono text-[9px] font-bold"
                  style={{
                    color: payloadGatePassed
                      ? "oklch(0.72 0.2 155)"
                      : "oklch(0.72 0.22 25)",
                  }}
                >
                  Live payload flow confirmed ({busPackets} packets)
                </span>
                {!payloadGatePassed && (
                  <span
                    className="ml-auto font-mono text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm"
                    style={{
                      background: "oklch(0.28 0.12 25)22",
                      color: "oklch(0.72 0.22 25)",
                      border: "1px solid oklch(0.28 0.12 25)",
                    }}
                  >
                    BLOCKING
                  </span>
                )}
              </div>
              {!payloadGatePassed && (
                <p
                  className="font-mono text-[8px] mt-1 ml-5"
                  style={{ color: "oklch(0.55 0.1 25)" }}
                >
                  Start simulation and begin an adapter session to generate live
                  payload flow
                </p>
              )}
            </div>

            {/* Section 2 — Core conditions */}
            <div
              className="font-mono text-[8px] tracking-widest uppercase px-1 pb-1"
              style={{ color: "oklch(0.45 0.08 195)" }}
            >
              Section 2 — NeuroEmergence Core Go-Live Conditions
            </div>
            {SECTIONS.filter((s) => s.key.startsWith("core_")).map((s) => (
              <SectionCard
                key={s.key}
                title={s.title}
                conditions={bySection(s.key)}
                ocid={s.ocid}
              />
            ))}

            {/* Section 5 — Shared contract */}
            <div
              className="font-mono text-[8px] tracking-widest uppercase px-1 pb-1 mt-2"
              style={{ color: "oklch(0.45 0.08 195)" }}
            >
              Section 5 — Shared Contract Conditions
            </div>
            <SectionCard
              title="Shared Contract Conditions"
              conditions={bySection("shared_contract")}
              ocid="golive.section.shared_contract.panel"
            />

            {/* Section 6 — Blockers */}
            <div
              className="font-mono text-[8px] tracking-widest uppercase px-1 pb-1 mt-2"
              style={{ color: "oklch(0.55 0.18 25)" }}
            >
              Section 6 — Active Go-Live Blockers
            </div>
            <SectionCard
              title="Active Blocker Checks"
              conditions={bySection("blockers")}
              ocid="golive.section.blockers.panel"
            />

            {/* Section 7 — Proofs */}
            <div
              className="font-mono text-[8px] tracking-widest uppercase px-1 pb-1 mt-2"
              style={{ color: "oklch(0.45 0.08 195)" }}
            >
              Section 7 — Required Go-Live Proof
            </div>
            <div
              data-ocid="golive.proofs.panel"
              className="rounded border p-3"
              style={{
                background: "oklch(0.075 0.012 265)",
                borderColor: "oklch(0.18 0.04 255)",
              }}
            >
              {result ? (
                <div className="flex flex-col gap-1">
                  {Object.entries(result.proofs).map(([key, val]) => (
                    <div key={key} className="flex items-start gap-2">
                      <span
                        className="font-mono text-[9px] shrink-0"
                        style={{
                          color: "oklch(0.45 0.06 220)",
                          minWidth: "200px",
                        }}
                      >
                        {key}
                      </span>
                      <span
                        className="font-mono text-[9px] break-all"
                        style={{ color: "oklch(0.72 0.18 155)" }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <span
                  className="font-mono text-[9px]"
                  style={{ color: "oklch(0.38 0.05 220)" }}
                >
                  Run evaluation to populate proofs
                </span>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Right: verdict panel (sticky) */}
        <div
          className="w-64 shrink-0 border-l flex flex-col gap-3 p-3 overflow-y-auto"
          style={{
            background: "oklch(0.065 0.012 265)",
            borderColor: "oklch(0.18 0.04 255)",
          }}
          data-ocid="golive.verdict.panel"
        >
          {/* Score ring */}
          <div className="flex flex-col items-center gap-2 py-2">
            <ScoreRing score={result?.score ?? 0} />
            {evaluating && (
              <span
                className="font-mono text-[8px] tracking-widest animate-pulse"
                style={{ color: "oklch(0.55 0.08 195)" }}
              >
                EVALUATING…
              </span>
            )}
          </div>

          {/* System status badges */}
          <div className="flex flex-col gap-1.5">
            <span
              className="font-mono text-[8px] tracking-widest uppercase"
              style={{ color: "oklch(0.38 0.05 220)" }}
            >
              System Status
            </span>
            <SystemBadge
              label="NeuroEmergence Core"
              ready={result?.coreReady ?? false}
            />
            <SystemBadge
              label="Emergent BattleOps"
              ready={result?.battleOpsReady ?? false}
            />
            <SystemBadge
              label="Emergent WarCommandOps"
              ready={result?.warCommandOpsReady ?? false}
            />
          </div>

          {/* Overall verdict */}
          <div
            className="rounded p-2 text-center"
            style={{
              background: isLive
                ? "oklch(0.72 0.22 155 / 0.08)"
                : "oklch(0.62 0.22 25 / 0.08)",
              border: `1px solid ${isLive ? "oklch(0.72 0.22 155 / 0.4)" : "oklch(0.62 0.22 25 / 0.4)"}`,
            }}
          >
            <span
              className="font-mono text-[10px] font-bold tracking-widest"
              style={{
                color: isLive ? "oklch(0.82 0.22 155)" : "oklch(0.72 0.18 25)",
              }}
            >
              {result
                ? isLive
                  ? "✓ GO-LIVE COMPLETE"
                  : `BLOCKED — ${result.blockers.length} conditions unmet`
                : "AWAITING EVALUATION"}
            </span>
          </div>

          {/* Active blockers */}
          {result && result.blockers.length > 0 && (
            <div
              data-ocid="golive.blockers.panel"
              className="rounded border p-2 flex flex-col gap-1"
              style={{
                background: "oklch(0.09 0.015 265)",
                borderColor: "oklch(0.35 0.1 20)",
              }}
            >
              <span
                className="font-mono text-[8px] tracking-widest uppercase"
                style={{ color: "oklch(0.62 0.18 25)" }}
              >
                Active Blockers
              </span>
              {result.blockers.map((b, i) => (
                <div key={b} className="flex items-start gap-1">
                  <span
                    className="font-mono text-[8px] shrink-0"
                    style={{ color: "oklch(0.5 0.1 25)" }}
                  >
                    {i + 1}.
                  </span>
                  <span
                    className="font-mono text-[8px]"
                    style={{ color: "oklch(0.65 0.12 25)" }}
                  >
                    {b}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Declare Go-Live button */}
          <div className="mt-auto pt-2">
            <Button
              data-ocid="golive.declare.button"
              className="w-full font-mono text-[9px] tracking-widest uppercase h-9"
              disabled={!isLive || !result || !payloadGatePassed}
              onClick={() => setDeclarationOpen(true)}
              style={{
                background:
                  isLive && payloadGatePassed
                    ? "oklch(0.72 0.22 155 / 0.2)"
                    : "oklch(0.15 0.02 265)",
                color:
                  isLive && payloadGatePassed
                    ? "oklch(0.82 0.22 155)"
                    : "oklch(0.35 0.04 220)",
                border: `1px solid ${isLive && payloadGatePassed ? "oklch(0.72 0.22 155 / 0.5)" : "oklch(0.25 0.03 265)"}`,
                boxShadow:
                  isLive && payloadGatePassed
                    ? "0 0 12px oklch(0.72 0.22 155 / 0.2)"
                    : "none",
              }}
            >
              {isLive && payloadGatePassed
                ? "⚡ Declare Go-Live"
                : !payloadGatePassed
                  ? "Blocked — Payload gate: start simulation + begin session"
                  : `Blocked — ${result?.blockers.length ?? "?"} unmet conditions`}
            </Button>
          </div>

          {/* Version badges */}
          <div className="flex gap-1 flex-wrap pt-1">
            <span
              className="font-mono text-[7px] px-1.5 py-0.5 rounded"
              style={{
                background: "oklch(0.72 0.22 195 / 0.08)",
                color: "oklch(0.5 0.1 195)",
                border: "1px solid oklch(0.72 0.22 195 / 0.2)",
              }}
            >
              CONTRACT {CONTRACT_VERSION}
            </span>
            <span
              className="font-mono text-[7px] px-1.5 py-0.5 rounded"
              style={{
                background: "oklch(0.65 0.18 280 / 0.08)",
                color: "oklch(0.5 0.1 280)",
                border: "1px solid oklch(0.65 0.18 280 / 0.2)",
              }}
            >
              SCHEMA {PAYLOAD_SCHEMA_VERSION}
            </span>
          </div>
        </div>
      </div>

      {/* Declaration Modal */}
      <AnimatePresence>
        {declarationOpen && (
          <Dialog open={declarationOpen} onOpenChange={setDeclarationOpen}>
            <DialogContent
              data-ocid="golive.declaration.modal"
              className="max-w-lg"
              style={{
                background: "oklch(0.07 0.015 265)",
                border: "1px solid oklch(0.72 0.22 155 / 0.5)",
                boxShadow: "0 0 40px oklch(0.72 0.22 155 / 0.15)",
              }}
            >
              <DialogHeader>
                <DialogTitle>
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-2 pt-2"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: "oklch(0.72 0.22 155 / 0.15)",
                        border: "1px solid oklch(0.72 0.22 155 / 0.5)",
                        boxShadow: "0 0 20px oklch(0.72 0.22 155 / 0.3)",
                      }}
                    >
                      <CheckCircle2
                        className="w-6 h-6"
                        style={{ color: "oklch(0.82 0.22 155)" }}
                      />
                    </div>
                    <span
                      className="font-mono text-sm font-bold tracking-widest"
                      style={{ color: "oklch(0.82 0.22 155)" }}
                    >
                      {declared ? "GO-LIVE COMPLETE" : "Declare Go-Live"}
                    </span>
                  </motion.div>
                </DialogTitle>
              </DialogHeader>

              <div
                className="rounded p-3 my-2 font-mono text-[8px] leading-relaxed"
                style={{
                  background: "oklch(0.055 0.01 265)",
                  border: "1px solid oklch(0.22 0.04 255)",
                  color: "oklch(0.5 0.06 220)",
                }}
              >
                {declared ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col gap-1"
                  >
                    <span style={{ color: "oklch(0.82 0.22 155)" }}>
                      GO-LIVE COMPLETE — {new Date().toISOString()}
                    </span>
                    <span>
                      Every section in the GO-LIVE DECLARATION PACK has passed.
                    </span>
                    <span>No blocker exists.</span>
                    <span>Proof exists for all live flows.</span>
                    <span>All three systems are live together:</span>
                    <span style={{ color: "oklch(0.72 0.22 195)" }}>
                      {" "}
                      ✓ NeuroEmergence Core — LIVE
                    </span>
                    <span style={{ color: "oklch(0.72 0.22 195)" }}>
                      {" "}
                      ✓ Emergent BattleOps — LIVE
                    </span>
                    <span style={{ color: "oklch(0.72 0.22 195)" }}>
                      {" "}
                      ✓ Emergent WarCommandOps — LIVE
                    </span>
                  </motion.div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <span>The developer declares:</span>
                    <span className="mt-1">"GO-LIVE COMPLETE"</span>
                    <span className="mt-1">
                      All sections in this pack pass.
                    </span>
                    <span>No blocker exists.</span>
                    <span>Proof exists for all live flows.</span>
                    <span>All three systems are live together.</span>
                    <span
                      className="mt-2"
                      style={{ color: "oklch(0.62 0.12 45)" }}
                    >
                      This action is final. Confirm to declare the stack
                      GO-LIVE.
                    </span>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2">
                {!declared ? (
                  <>
                    <Button
                      data-ocid="golive.declaration.close_button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeclarationOpen(false)}
                      className="font-mono text-[9px] tracking-wider"
                      style={{ color: "oklch(0.45 0.05 220)" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      data-ocid="golive.declaration.confirm_button"
                      size="sm"
                      onClick={() => setDeclared(true)}
                      className="font-mono text-[9px] tracking-widest uppercase"
                      style={{
                        background: "oklch(0.72 0.22 155 / 0.2)",
                        color: "oklch(0.82 0.22 155)",
                        border: "1px solid oklch(0.72 0.22 155 / 0.5)",
                      }}
                    >
                      ⚡ Confirm Go-Live
                    </Button>
                  </>
                ) : (
                  <Button
                    data-ocid="golive.declaration.close_button"
                    size="sm"
                    onClick={() => setDeclarationOpen(false)}
                    className="font-mono text-[9px] tracking-widest uppercase"
                    style={{
                      background: "oklch(0.72 0.22 155 / 0.15)",
                      color: "oklch(0.72 0.22 155)",
                      border: "1px solid oklch(0.72 0.22 155 / 0.3)",
                    }}
                  >
                    Close
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
