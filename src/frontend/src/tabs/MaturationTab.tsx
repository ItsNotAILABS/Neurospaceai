import { useEffect, useMemo, useState } from "react";
import { useBrainIntegrationSystem } from "../hooks/useBrainIntegrationSystem";
import type {
  NeuralSimulationControls,
  NeuralSimulationState,
} from "../hooks/useNeuralSimulation";
import {
  type CandidateChange,
  type CandidateStatus,
  computeMaturityVector,
  createAutoMaturationLoop,
  ingestConnectionRecommendations,
  promoteCandidate,
  rejectCandidate,
  rollbackCandidate,
} from "../utils/autoMaturationLoop";
import {
  createConnectionRegistry,
  getOptimizationRecommendations,
  updateConnectionWeights,
} from "../utils/connectionRegistry";

type Neural = NeuralSimulationState & NeuralSimulationControls;

const BORDER = "oklch(0.18 0.05 255)";
const CYAN = "oklch(0.72 0.22 195)";
const GREEN = "oklch(0.68 0.28 140)";
const AMBER = "oklch(0.78 0.22 80)";
const RED = "oklch(0.72 0.22 25)";
const MUTED = "oklch(0.38 0.05 220)";
const DIM = "oklch(0.28 0.04 240)";
const PANEL = "oklch(0.09 0.015 265)";
const ORANGE = "oklch(0.72 0.22 45)";

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="px-3 py-1.5 border-b shrink-0"
      style={{ borderColor: BORDER, background: "oklch(0.07 0.012 265)" }}
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

function MiniBar({
  value,
  color,
  width = 100,
}: { value: number; color: string; width?: number }) {
  return (
    <div
      style={{
        width,
        height: 5,
        background: "oklch(0.14 0.03 255)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${value * 100}%`,
          height: "100%",
          background: color,
          borderRadius: 3,
          transition: "width 0.6s ease",
        }}
      />
    </div>
  );
}

const STATUS_META: Record<CandidateStatus, { color: string; label: string }> = {
  proposed: { color: MUTED, label: "PROPOSED" },
  testing: { color: AMBER, label: "TESTING" },
  promoted: { color: GREEN, label: "PROMOTED" },
  rejected: { color: RED, label: "REJECTED" },
  rolled_back: { color: "oklch(0.5 0.1 280)", label: "ROLLED BACK" },
};

const SOURCE_META: Record<
  CandidateChange["source"],
  { color: string; label: string }
> = {
  connection_optimizer: { color: CYAN, label: "CONN OPT" },
  manual: { color: DIM, label: "MANUAL" },
  threshold_engine: { color: AMBER, label: "THRESH" },
  regulation_optimizer: { color: AMBER, label: "REG OPT" },
};

const MV_LABELS: Array<{
  key: keyof ReturnType<typeof createAutoMaturationLoop>["maturityVector"];
  label: string;
  color: string;
}> = [
  { key: "stability", label: "Stability", color: GREEN },
  { key: "selectivity", label: "Selectivity", color: CYAN },
  { key: "recurrence", label: "Recurrence", color: "oklch(0.68 0.22 260)" },
  { key: "regulation", label: "Regulation", color: AMBER },
  { key: "adaptation", label: "Adaptation", color: "oklch(0.72 0.22 320)" },
  {
    key: "measurability",
    label: "Measurability",
    color: "oklch(0.65 0.2 180)",
  },
];

function CandidateCard({
  candidate,
  isExternal,
  onPromote,
  onReject,
  onRollback,
}: {
  candidate: CandidateChange;
  isExternal?: boolean;
  onPromote: (id: string) => void;
  onReject: (id: string) => void;
  onRollback: (id: string) => void;
}) {
  const meta = STATUS_META[candidate.status];
  const sourceMeta = SOURCE_META[candidate.source];
  const delta = candidate.candidateScore - candidate.baselineScore;
  const testing = candidate.status === "testing";
  const promoted = candidate.status === "promoted";

  return (
    <div
      className="border flex flex-col gap-1.5 p-3"
      style={{
        background: PANEL,
        borderColor: `${meta.color}30`,
        borderLeft: `2px solid ${meta.color}`,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span
            className="font-mono text-[9px]"
            style={{ color: "oklch(0.7 0.12 200)" }}
          >
            {candidate.subsystem}
          </span>
          <span
            className="font-mono text-[8px]"
            style={{ color: MUTED, maxWidth: 260 }}
          >
            {candidate.description}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0 flex-wrap justify-end">
          {isExternal && (
            <span
              className="font-mono text-[7px] tracking-widest uppercase px-1 py-0.5"
              style={{
                background: `${ORANGE}20`,
                color: ORANGE,
                border: `1px solid ${ORANGE}40`,
              }}
            >
              EXTERNAL
            </span>
          )}
          <span
            className="font-mono text-[7px] tracking-widest uppercase px-1 py-0.5"
            style={{
              background: `${sourceMeta.color}15`,
              color: sourceMeta.color,
              border: `1px solid ${sourceMeta.color}25`,
            }}
          >
            {sourceMeta.label}
          </span>
          <span
            className="font-mono text-[7px] tracking-widest uppercase px-1.5 py-0.5"
            style={{
              background: `${meta.color}18`,
              color: meta.color,
              border: `1px solid ${meta.color}30`,
            }}
          >
            {meta.label}
          </span>
        </div>
      </div>

      {(candidate.baselineScore > 0 || candidate.candidateScore > 0) && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span
              className="font-mono text-[7px] uppercase"
              style={{ color: DIM }}
            >
              Base
            </span>
            <span className="font-mono text-[8px]" style={{ color: MUTED }}>
              {(candidate.baselineScore * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="font-mono text-[7px] uppercase"
              style={{ color: DIM }}
            >
              Cand
            </span>
            <span className="font-mono text-[8px]" style={{ color: CYAN }}>
              {(candidate.candidateScore * 100).toFixed(0)}%
            </span>
          </div>
          {delta !== 0 && (
            <span
              className="font-mono text-[8px]"
              style={{ color: delta > 0 ? GREEN : RED }}
            >
              {delta > 0 ? "+" : ""}
              {(delta * 100).toFixed(0)}%
            </span>
          )}
        </div>
      )}

      {candidate.evidence.length > 0 && (
        <div className="flex flex-col gap-0.5">
          {candidate.evidence.map((e) => (
            <span
              key={e}
              className="font-mono text-[7px]"
              style={{ color: DIM }}
            >
              · {e}
            </span>
          ))}
        </div>
      )}

      {testing && (
        <div className="flex gap-1.5 mt-1">
          <button
            type="button"
            data-ocid="maturation.confirm_button"
            onClick={() => onPromote(candidate.id)}
            className="font-mono text-[8px] tracking-widest uppercase px-2 py-1 border transition-all"
            style={{
              border: `1px solid ${GREEN}60`,
              color: GREEN,
              background: `${GREEN}10`,
            }}
          >
            Promote
          </button>
          <button
            type="button"
            data-ocid="maturation.cancel_button"
            onClick={() => onReject(candidate.id)}
            className="font-mono text-[8px] tracking-widest uppercase px-2 py-1 border transition-all"
            style={{
              border: `1px solid ${RED}60`,
              color: RED,
              background: `${RED}10`,
            }}
          >
            Reject
          </button>
        </div>
      )}
      {promoted && (
        <button
          type="button"
          data-ocid="maturation.delete_button"
          onClick={() => onRollback(candidate.id)}
          className="font-mono text-[8px] tracking-widest uppercase px-2 py-1 border self-start transition-all"
          style={{
            border: `1px solid ${AMBER}60`,
            color: AMBER,
            background: `${AMBER}10`,
          }}
        >
          Rollback
        </button>
      )}
    </div>
  );
}

// ─── External Candidate Submission Form ──────────────────────────────────

interface ExternalCandidateForm {
  description: string;
  evidenceItems: string[];
  sourceAdapterId: string;
  sourceType: "internal" | "external";
}

function ExternalCandidateFormPanel({
  adapters,
  onSubmit,
  onClose,
}: {
  adapters: Array<{ adapter_id: string; adapter_name: string }>;
  onSubmit: (form: ExternalCandidateForm) => void;
  onClose: () => void;
}) {
  const [description, setDescription] = useState("");
  const [evidenceItems, setEvidenceItems] = useState<string[]>([
    "ΔU > 0 measured over 20 seeds",
  ]);
  const [newEvidence, setNewEvidence] = useState("");
  const [sourceAdapterId, setSourceAdapterId] = useState(
    adapters[0]?.adapter_id ?? "manual",
  );
  const [sourceType, setSourceType] = useState<"internal" | "external">(
    "external",
  );
  const [error, setError] = useState("");

  function handleAddEvidence() {
    if (newEvidence.trim()) {
      setEvidenceItems((prev) => [...prev, newEvidence.trim()]);
      setNewEvidence("");
    }
  }

  function handleRemoveEvidence(i: number) {
    setEvidenceItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleSubmit() {
    if (!description.trim()) {
      setError("Description is required");
      return;
    }
    if (evidenceItems.length < 1) {
      setError("At least 1 evidence item required");
      return;
    }
    onSubmit({ description, evidenceItems, sourceAdapterId, sourceType });
  }

  return (
    <div
      className="border p-3 flex flex-col gap-2"
      style={{
        background: "oklch(0.08 0.015 265)",
        borderColor: `${ORANGE}35`,
      }}
      data-ocid="maturation.panel"
    >
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-[9px] tracking-widest uppercase"
          style={{ color: ORANGE }}
        >
          Submit External Candidate
        </span>
        <span className="font-mono text-[7px]" style={{ color: DIM }}>
          Candidates go to validation queue only. No direct promotion.
        </span>
      </div>

      {/* Source type + adapter */}
      <div className="flex gap-2">
        <select
          data-ocid="maturation.select"
          value={sourceType}
          onChange={(e) =>
            setSourceType(e.target.value as "internal" | "external")
          }
          className="font-mono text-[8px] px-2 py-1 border"
          style={{ background: PANEL, borderColor: BORDER, color: MUTED }}
        >
          <option value="internal">internal</option>
          <option value="external">external</option>
        </select>
        <select
          value={sourceAdapterId}
          onChange={(e) => setSourceAdapterId(e.target.value)}
          className="font-mono text-[8px] px-2 py-1 border flex-1"
          style={{ background: PANEL, borderColor: BORDER, color: MUTED }}
        >
          <option value="manual">manual</option>
          {adapters.map((a) => (
            <option key={a.adapter_id} value={a.adapter_id}>
              {a.adapter_name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <textarea
        data-ocid="maturation.textarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        placeholder="Describe the candidate architecture change..."
        className="font-mono text-[8px] px-2 py-1.5 border resize-none w-full"
        style={{ background: PANEL, borderColor: BORDER, color: MUTED }}
      />

      {/* Evidence items */}
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[7px] uppercase" style={{ color: DIM }}>
          Evidence (min 1 required)
        </span>
        {evidenceItems.map((ev) => (
          <div key={ev} className="flex items-center gap-1">
            <span
              className="font-mono text-[7px] flex-1"
              style={{ color: MUTED }}
            >
              · {ev}
            </span>
            <button
              type="button"
              onClick={() => handleRemoveEvidence(evidenceItems.indexOf(ev))}
              className="font-mono text-[7px] px-1"
              style={{ color: RED }}
            >
              ×
            </button>
          </div>
        ))}
        <div className="flex gap-1">
          <input
            value={newEvidence}
            onChange={(e) => setNewEvidence(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddEvidence();
            }}
            placeholder="Add evidence item…"
            className="font-mono text-[8px] px-2 py-1 border flex-1"
            style={{ background: PANEL, borderColor: BORDER, color: MUTED }}
          />
          <button
            type="button"
            onClick={handleAddEvidence}
            className="font-mono text-[8px] uppercase px-2 py-1 border"
            style={{
              border: `1px solid ${DIM}`,
              color: DIM,
              background: PANEL,
            }}
          >
            +
          </button>
        </div>
      </div>

      {error && (
        <span className="font-mono text-[7px]" style={{ color: RED }}>
          {error}
        </span>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          data-ocid="maturation.submit_button"
          onClick={handleSubmit}
          className="font-mono text-[8px] tracking-widest uppercase px-3 py-1 border"
          style={{
            border: `1px solid ${ORANGE}60`,
            color: ORANGE,
            background: `${ORANGE}10`,
          }}
        >
          Submit to Queue
        </button>
        <button
          type="button"
          data-ocid="maturation.close_button"
          onClick={onClose}
          className="font-mono text-[8px] tracking-widest uppercase px-3 py-1 border"
          style={{
            border: `1px solid ${DIM}40`,
            color: DIM,
            background: PANEL,
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function MaturationTab({ neural }: { neural: Neural }) {
  const [loop, setLoop] = useState(() => createAutoMaturationLoop());
  const [showExternalForm, setShowExternalForm] = useState(false);
  const integration = useBrainIntegrationSystem();

  // Build registry and get optimizer recommendations
  const registry = useMemo(
    () =>
      updateConnectionWeights(createConnectionRegistry(), {
        sympatheticTone: neural.sympatheticTone,
        stressLoad: neural.sympatheticTone * 0.8,
        isRunning: neural.isRunning,
      }),
    [neural.sympatheticTone, neural.isRunning],
  );

  const recs = useMemo(
    () => getOptimizationRecommendations(registry),
    [registry],
  );

  // Wire ConnectionOptimizationEngine -> AutoMaturationLoop
  useEffect(() => {
    setLoop((l) => ingestConnectionRecommendations(l, recs));
  }, [recs]);

  const liveLoop = useMemo(
    () =>
      computeMaturityVector(loop, {
        saturatedRegions: neural.saturatedRegions,
        isRunning: neural.isRunning,
        regions: neural.regions,
      }),
    [loop, neural.saturatedRegions, neural.isRunning, neural.regions],
  );

  const mv = liveLoop.maturityVector;
  const overallPct = (liveLoop.overallScore * 100).toFixed(0);

  // Compute seconds since last ingest
  const ingestAge =
    liveLoop.lastConnectionIngest > 0
      ? Math.floor((Date.now() - liveLoop.lastConnectionIngest) / 1000)
      : null;

  // External candidates from integration system
  const externalCandidates = integration.candidateQueue;

  function handleExternalSubmit(form: ExternalCandidateForm) {
    const adapter = integration.adapters.find(
      (a) => a.adapter_id === form.sourceAdapterId,
    );
    integration.submitCandidate({
      source_type: form.sourceType,
      source_adapter_id:
        form.sourceAdapterId !== "manual" ? form.sourceAdapterId : undefined,
      description: form.description,
      evidence: form.evidenceItems,
      attribution: adapter
        ? `${adapter.adapter_name} / ${form.sourceType}`
        : `manual / ${form.sourceType}`,
    });
    setShowExternalForm(false);
  }

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left: Maturity Vector */}
      <section
        className="flex flex-col border-r"
        style={{ flex: "0 0 32%", overflow: "hidden", borderColor: BORDER }}
      >
        <SectionHeader>Maturity Vector · 6 Dimensions</SectionHeader>
        <div className="p-3 flex flex-col gap-3">
          {MV_LABELS.map(({ key, label, color }) => (
            <div key={key} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-[9px] tracking-widest uppercase"
                  style={{ color: MUTED }}
                >
                  {label}
                </span>
                <span className="font-mono text-[9px]" style={{ color }}>
                  {(mv[key] * 100).toFixed(0)}%
                </span>
              </div>
              <MiniBar value={mv[key]} color={color} width={220} />
            </div>
          ))}
        </div>

        {/* Overall + Stats */}
        <div
          className="border-t p-3 flex flex-col gap-2"
          style={{ borderColor: BORDER }}
        >
          <div className="flex items-center justify-between">
            <span
              className="font-mono text-[9px] tracking-widest uppercase"
              style={{ color: MUTED }}
            >
              Overall Score
            </span>
            <span
              className="font-mono text-sm font-bold"
              style={{
                color:
                  liveLoop.overallScore > 0.7
                    ? GREEN
                    : liveLoop.overallScore > 0.5
                      ? AMBER
                      : RED,
              }}
            >
              {overallPct}%
            </span>
          </div>
          <MiniBar
            value={liveLoop.overallScore}
            color={liveLoop.overallScore > 0.7 ? GREEN : AMBER}
            width={220}
          />
          <div className="flex gap-3 mt-1">
            <div className="flex flex-col">
              <span
                className="font-mono text-[7px] uppercase"
                style={{ color: DIM }}
              >
                Promoted
              </span>
              <span
                className="font-mono text-[11px] font-bold"
                style={{ color: GREEN }}
              >
                {liveLoop.promotionCount}
              </span>
            </div>
            <div className="flex flex-col">
              <span
                className="font-mono text-[7px] uppercase"
                style={{ color: DIM }}
              >
                Rejected
              </span>
              <span
                className="font-mono text-[11px] font-bold"
                style={{ color: RED }}
              >
                {liveLoop.rejectionCount}
              </span>
            </div>
            <div className="flex flex-col">
              <span
                className="font-mono text-[7px] uppercase"
                style={{ color: DIM }}
              >
                In Testing
              </span>
              <span
                className="font-mono text-[11px] font-bold"
                style={{ color: AMBER }}
              >
                {
                  liveLoop.candidates.filter((c) => c.status === "testing")
                    .length
                }
              </span>
            </div>
            <div className="flex flex-col">
              <span
                className="font-mono text-[7px] uppercase"
                style={{ color: DIM }}
              >
                External
              </span>
              <span
                className="font-mono text-[11px] font-bold"
                style={{ color: ORANGE }}
              >
                {externalCandidates.length}
              </span>
            </div>
          </div>
        </div>

        {/* Connection Optimizer Wiring Status */}
        <div
          className="border-t p-3 flex flex-col gap-1.5"
          style={{ borderColor: BORDER }}
        >
          <div className="flex items-center gap-2">
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background:
                  liveLoop.connectionCandidatesActive > 0 ? GREEN : DIM,
                boxShadow:
                  liveLoop.connectionCandidatesActive > 0
                    ? `0 0 6px ${GREEN}`
                    : "none",
                flexShrink: 0,
              }}
            />
            <span
              className="font-mono text-[8px] tracking-widest uppercase"
              style={{
                color: liveLoop.connectionCandidatesActive > 0 ? GREEN : DIM,
              }}
            >
              Connection Optimizer Wired
            </span>
          </div>
          <span className="font-mono text-[7px]" style={{ color: DIM }}>
            Last ingest: {ingestAge !== null ? `${ingestAge}s ago` : "Pending"}
          </span>
          <span className="font-mono text-[7px]" style={{ color: MUTED }}>
            Active conn-sourced candidates:{" "}
            <span style={{ color: CYAN }}>
              {liveLoop.connectionCandidatesActive}
            </span>
          </span>
        </div>
      </section>

      {/* Right: Candidate Queue */}
      <section
        className="flex flex-col"
        style={{ flex: 1, overflow: "hidden" }}
      >
        <div
          className="flex items-center justify-between border-b px-3 py-1.5 shrink-0"
          style={{ borderColor: BORDER, background: "oklch(0.07 0.012 265)" }}
        >
          <span
            className="font-mono text-[9px] tracking-widest uppercase"
            style={{ color: MUTED }}
          >
            Candidate Change Queue
          </span>
          <button
            type="button"
            data-ocid="maturation.open_modal_button"
            onClick={() => setShowExternalForm((v) => !v)}
            className="font-mono text-[8px] tracking-widest uppercase px-2 py-1 border transition-all"
            style={{
              border: `1px solid ${ORANGE}50`,
              color: ORANGE,
              background: showExternalForm ? `${ORANGE}15` : `${ORANGE}08`,
            }}
          >
            {showExternalForm ? "× Cancel" : "+ Submit External"}
          </button>
        </div>

        {/* External form */}
        {showExternalForm && (
          <div
            className="px-2 py-2 border-b shrink-0"
            style={{ borderColor: BORDER }}
          >
            <ExternalCandidateFormPanel
              adapters={integration.adapters.filter(
                (a) => a.status === "active",
              )}
              onSubmit={handleExternalSubmit}
              onClose={() => setShowExternalForm(false)}
            />
          </div>
        )}

        {/* Mutation boundary reminder if form open */}
        {showExternalForm && (
          <div
            className="px-3 py-1.5 border-b shrink-0 flex items-center gap-2"
            style={{ borderColor: BORDER }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: GREEN }}
            />
            <span className="font-mono text-[7px]" style={{ color: GREEN }}>
              Mutation boundary enforced — candidates go to queue only, no
              direct promotion
            </span>
          </div>
        )}

        <div
          data-ocid="maturation.list"
          className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5"
        >
          {/* External candidates from integration system */}
          {externalCandidates.map((ec, i) => (
            <div
              key={ec.id}
              data-ocid={`maturation.item.${i + 1}`}
              className="border flex flex-col gap-1.5 p-3"
              style={{
                background: PANEL,
                borderColor: `${ORANGE}30`,
                borderLeft: `2px solid ${ORANGE}`,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-0.5">
                  <span
                    className="font-mono text-[9px]"
                    style={{ color: "oklch(0.7 0.12 200)" }}
                  >
                    External Submission
                  </span>
                  <span
                    className="font-mono text-[8px]"
                    style={{ color: MUTED, maxWidth: 260 }}
                  >
                    {ec.description}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className="font-mono text-[7px] tracking-widest uppercase px-1 py-0.5"
                    style={{
                      background: `${ORANGE}20`,
                      color: ORANGE,
                      border: `1px solid ${ORANGE}40`,
                    }}
                  >
                    EXTERNAL
                  </span>
                  <span
                    className="font-mono text-[7px] tracking-widest uppercase px-1 py-0.5"
                    style={{
                      background: `${AMBER}18`,
                      color: AMBER,
                      border: `1px solid ${AMBER}30`,
                    }}
                  >
                    {ec.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                {ec.evidence.map((e) => (
                  <span
                    key={e}
                    className="font-mono text-[7px]"
                    style={{ color: DIM }}
                  >
                    · {e}
                  </span>
                ))}
              </div>
              <span className="font-mono text-[7px]" style={{ color: DIM }}>
                Attribution: {ec.attribution} ·{" "}
                {new Date(ec.submitted_at).toLocaleTimeString()}
              </span>
              {ec.status === "pending" && (
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      integration.reviewCandidate(
                        ec.id,
                        "promote",
                        "Evidence sufficient",
                      )
                    }
                    className="font-mono text-[7px] uppercase px-2 py-0.5 border"
                    style={{
                      border: `1px solid ${GREEN}50`,
                      color: GREEN,
                      background: `${GREEN}08`,
                    }}
                  >
                    Promote
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      integration.reviewCandidate(
                        ec.id,
                        "reject",
                        "Insufficient evidence",
                      )
                    }
                    className="font-mono text-[7px] uppercase px-2 py-0.5 border"
                    style={{
                      border: `1px solid ${RED}50`,
                      color: RED,
                      background: `${RED}08`,
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Internal candidates */}
          {liveLoop.candidates.map((c, i) => (
            <div
              key={c.id}
              data-ocid={`maturation.item.${i + externalCandidates.length + 1}`}
            >
              <CandidateCard
                candidate={c}
                isExternal={false}
                onPromote={(id) => setLoop((l) => promoteCandidate(l, id))}
                onReject={(id) => setLoop((l) => rejectCandidate(l, id))}
                onRollback={(id) => setLoop((l) => rollbackCandidate(l, id))}
              />
            </div>
          ))}

          {liveLoop.candidates.length === 0 &&
            externalCandidates.length === 0 && (
              <div
                data-ocid="maturation.empty_state"
                className="p-6 text-center font-mono text-[9px]"
                style={{ color: DIM }}
              >
                No candidates in queue
              </div>
            )}
        </div>
      </section>
    </div>
  );
}
