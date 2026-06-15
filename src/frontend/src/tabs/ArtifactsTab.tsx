import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo, useState } from "react";
import { GenesisWall } from "../components/GenesisWall";
import {
  type Artifact,
  type ArtifactType,
  compareArtifacts,
  useArtifacts,
} from "../utils/artifactStore";

type SourceFilter = "all" | "core" | "battleops" | "warcommandops";

const SOURCE_FILTERS: Array<{
  id: SourceFilter;
  label: string;
  color: string;
}> = [
  { id: "all", label: "ALL", color: "oklch(0.72 0.22 195)" },
  { id: "core", label: "CORE", color: "oklch(0.72 0.22 195)" },
  { id: "battleops", label: "BATTLEOPS", color: "oklch(0.72 0.22 25)" },
  {
    id: "warcommandops",
    label: "WARCOMMANDOPS",
    color: "oklch(0.72 0.22 280)",
  },
];

// ─── Constants ───────────────────────────────────────────────────────────────
const BG = "oklch(0.06 0.01 265)";
const PANEL = "oklch(0.09 0.015 265)";
const BORDER = "oklch(0.18 0.05 250)";
const CYAN = "oklch(0.72 0.22 195)";
const DIM = "oklch(0.38 0.05 220)";
const FG = "oklch(0.82 0.04 220)";

const TYPE_COLORS: Record<ArtifactType, string> = {
  report: "oklch(0.72 0.22 195)",
  ai_review: "oklch(0.75 0.2 280)",
  readiness_check: "oklch(0.72 0.2 160)",
  go_live_report: "oklch(0.75 0.25 155)",
  compatibility_validation: "oklch(0.72 0.2 210)",
  binding_validation: "oklch(0.7 0.18 220)",
  deployment_health: "oklch(0.72 0.22 195)",
  benchmark_comparison: "oklch(0.75 0.22 50)",
  analytics_snapshot: "oklch(0.7 0.2 240)",
  optimization_recommendation: "oklch(0.72 0.2 80)",
  trace_bundle: "oklch(0.7 0.18 230)",
  scenario_result: "oklch(0.75 0.22 280)",
  battle_result: "oklch(0.7 0.22 15)",
  replay_export: "oklch(0.7 0.18 200)",
  experiment_result: "oklch(0.72 0.2 320)",
  benchmark_comparison_result: "oklch(0.75 0.22 55)",
  deployment_health_result: "oklch(0.72 0.22 195)",
};

const TYPE_LABELS: Record<ArtifactType, string> = {
  report: "Report",
  ai_review: "AI Review",
  readiness_check: "Readiness",
  go_live_report: "Go-Live",
  compatibility_validation: "Compat.",
  binding_validation: "Binding",
  deployment_health: "Deploy Health",
  benchmark_comparison: "Benchmark",
  analytics_snapshot: "Snapshot",
  optimization_recommendation: "Optimization",
  trace_bundle: "Trace Bundle",
  scenario_result: "Scenario",
  battle_result: "Battle",
  replay_export: "Replay",
  experiment_result: "Experiment",
  benchmark_comparison_result: "Bench Cmp",
  deployment_health_result: "Deploy Hlth",
};

type FilterTab =
  | "all"
  | "report"
  | "ai_review"
  | "readiness_check"
  | "deployment_health"
  | "benchmark_comparison"
  | "trace_bundle"
  | "scenario_result"
  | "battle_result"
  | "replay_export"
  | "experiment_result"
  | "benchmark_comparison_result"
  | "deployment_health_result";

const FILTER_TABS: Array<{ id: FilterTab; label: string }> = [
  { id: "all", label: "All" },
  { id: "report", label: "Reports" },
  { id: "ai_review", label: "AI Reviews" },
  { id: "readiness_check", label: "Readiness" },
  { id: "deployment_health", label: "Deploy Health" },
  { id: "benchmark_comparison", label: "Benchmarks" },
  { id: "trace_bundle", label: "Traces" },
  { id: "scenario_result", label: "Scenarios" },
  { id: "battle_result", label: "Battles" },
  { id: "experiment_result", label: "Experiments" },
  { id: "benchmark_comparison_result", label: "Bench Cmp" },
  { id: "deployment_health_result", label: "Deploy Hlth" },
];

function scoreColor(score: number): string {
  if (score >= 80) return "oklch(0.72 0.2 155)";
  if (score >= 50) return "oklch(0.75 0.22 75)";
  return "oklch(0.7 0.22 25)";
}

function statusColor(status: Artifact["status"]): string {
  switch (status) {
    case "pass":
      return "oklch(0.72 0.2 155)";
    case "warn":
      return "oklch(0.75 0.22 75)";
    case "fail":
      return "oklch(0.7 0.22 25)";
    default:
      return CYAN;
  }
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

// ─── Artifact Card ────────────────────────────────────────────────────────────
function ArtifactCard({
  artifact,
  index,
  expanded,
  onToggleExpand,
  compareSelected,
  onToggleCompare,
  compareDisabled,
  onArchive,
  onNavigateTo,
}: {
  artifact: Artifact;
  index: number;
  expanded: boolean;
  onToggleExpand: () => void;
  compareSelected: boolean;
  onToggleCompare: () => void;
  compareDisabled: boolean;
  onArchive: (id: string) => void;
  onNavigateTo: (id: string) => void;
}) {
  const typeColor = TYPE_COLORS[artifact.artifact_type];
  const ocidIndex = Math.min(index + 1, 5);

  return (
    <div
      data-ocid={`artifacts.item.${ocidIndex}`}
      className="border rounded-sm mb-2 overflow-hidden transition-all"
      style={{
        borderColor: compareSelected ? `${CYAN}80` : `${BORDER}`,
        background: PANEL,
        boxShadow: compareSelected ? `0 0 0 1px ${CYAN}40` : "none",
      }}
    >
      {/* Card header */}
      <div className="flex items-start gap-2 p-3">
        {/* Compare checkbox */}
        <input
          type="checkbox"
          checked={compareSelected}
          onChange={onToggleCompare}
          disabled={compareDisabled && !compareSelected}
          className="mt-0.5 shrink-0 cursor-pointer"
          style={{ accentColor: CYAN }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {/* Type badge */}
            <span
              className="font-mono text-[8px] tracking-widest uppercase px-1.5 py-0.5 rounded-sm shrink-0"
              style={{
                background: `${typeColor}18`,
                border: `1px solid ${typeColor}40`,
                color: typeColor,
              }}
            >
              {TYPE_LABELS[artifact.artifact_type]}
            </span>

            {/* Score badge */}
            <span
              className="font-mono text-[9px] font-bold shrink-0"
              style={{ color: scoreColor(artifact.score) }}
            >
              {artifact.score.toFixed(0)}%
            </span>

            {/* Status badge */}
            <span
              className="font-mono text-[8px] uppercase tracking-widest px-1 py-0.5 rounded-sm shrink-0"
              style={{
                background: `${statusColor(artifact.status)}18`,
                color: statusColor(artifact.status),
              }}
            >
              {artifact.status}
            </span>

            {/* Timestamp */}
            <span
              className="font-mono text-[8px] ml-auto shrink-0"
              style={{ color: DIM }}
            >
              {relativeTime(artifact.created_at)}
            </span>
          </div>

          {/* Title */}
          <p
            className="font-mono text-[10px] font-semibold mb-0.5 truncate"
            style={{ color: FG }}
          >
            {artifact.title}
          </p>

          {/* Summary */}
          <p
            className="font-mono text-[9px] leading-relaxed line-clamp-2"
            style={{ color: DIM }}
          >
            {artifact.summary}
          </p>

          {/* Tags */}
          {artifact.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {artifact.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[7px] uppercase tracking-widest px-1 py-0.5 rounded-sm"
                  style={{
                    background: "oklch(0.12 0.03 250)",
                    color: "oklch(0.45 0.07 220)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* View + Archive buttons */}
        <div className="flex flex-col gap-1 shrink-0">
          <button
            type="button"
            onClick={onToggleExpand}
            className="font-mono text-[8px] uppercase tracking-widest px-2 py-1 rounded-sm transition-colors"
            style={{
              background: expanded ? `${CYAN}20` : "transparent",
              border: `1px solid ${CYAN}40`,
              color: CYAN,
            }}
          >
            {expanded ? "▲ Hide" : "▼ View"}
          </button>
          <button
            type="button"
            data-ocid={`artifacts.delete_button.${ocidIndex}`}
            onClick={() => onArchive(artifact.artifact_id)}
            className="font-mono text-[7px] uppercase tracking-widest px-2 py-1 rounded-sm transition-colors"
            style={{
              background: "transparent",
              border: "1px solid oklch(0.2 0.04 255)",
              color: "oklch(0.38 0.05 220)",
            }}
          >
            Archive
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div
          className="border-t px-3 py-3"
          style={{
            borderColor: BORDER,
            background: "oklch(0.075 0.012 265)",
          }}
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mb-3">
            {[
              ["ID", artifact.artifact_id],
              ["Source", artifact.source_system],
              ["Type", artifact.artifact_type],
              ["Version", artifact.version],
              ["Score", `${artifact.score.toFixed(1)} / 100`],
              ["Created", new Date(artifact.created_at).toLocaleString()],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline gap-2">
                <span
                  className="font-mono text-[8px] uppercase tracking-widest w-14 shrink-0"
                  style={{ color: DIM }}
                >
                  {k}
                </span>
                <span
                  className="font-mono text-[9px] truncate"
                  style={{ color: FG }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>

          {artifact.ai_review_summary && (
            <div
              className="rounded-sm p-2 mb-2"
              style={{
                background: "oklch(0.12 0.03 280)",
                border: "1px solid oklch(0.25 0.08 280)",
              }}
            >
              <p
                className="font-mono text-[8px] uppercase tracking-widest mb-1"
                style={{ color: "oklch(0.7 0.2 280)" }}
              >
                AI Review
              </p>
              <p
                className="font-mono text-[9px] leading-relaxed"
                style={{ color: "oklch(0.75 0.08 260)" }}
              >
                {artifact.ai_review_summary}
              </p>
            </div>
          )}

          {/* Related artifacts */}
          {(artifact.parent_artifact_id ||
            artifact.related_artifact_ids.length > 0) && (
            <div className="mb-2">
              <p
                className="font-mono text-[8px] uppercase tracking-widest mb-1"
                style={{ color: DIM }}
              >
                Artifact Links
              </p>
              <div className="flex flex-wrap gap-1">
                {artifact.parent_artifact_id && (
                  <button
                    type="button"
                    onClick={() => onNavigateTo(artifact.parent_artifact_id!)}
                    className="font-mono text-[8px] px-2 py-0.5 rounded-sm transition-colors"
                    style={{
                      background: "oklch(0.12 0.03 280)",
                      border: "1px solid oklch(0.25 0.06 280)",
                      color: "oklch(0.7 0.2 280)",
                    }}
                  >
                    ↑ Parent: {artifact.parent_artifact_id.slice(0, 16)}…
                  </button>
                )}
                {artifact.related_artifact_ids.map((rid) => (
                  <button
                    key={rid}
                    type="button"
                    onClick={() => onNavigateTo(rid)}
                    className="font-mono text-[8px] px-2 py-0.5 rounded-sm transition-colors"
                    style={{
                      background: "oklch(0.1 0.02 220)",
                      border: "1px solid oklch(0.22 0.04 220)",
                      color: CYAN,
                    }}
                  >
                    → {rid.slice(0, 16)}…
                  </button>
                ))}
              </div>
            </div>
          )}

          {Object.keys(artifact.metadata).length > 0 && (
            <div>
              <p
                className="font-mono text-[8px] uppercase tracking-widest mb-1"
                style={{ color: DIM }}
              >
                Metadata
              </p>
              <pre
                className="font-mono text-[8px] leading-relaxed overflow-x-auto"
                style={{ color: "oklch(0.55 0.06 220)" }}
              >
                {JSON.stringify(artifact.metadata, null, 2)}
              </pre>
            </div>
          )}
          <div
            className="flex gap-2 mt-3 pt-2 border-t"
            style={{ borderColor: BORDER }}
          >
            <button
              type="button"
              data-ocid="artifacts.upload_button"
              onClick={() => {
                const blob = new Blob([JSON.stringify(artifact, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `artifact_${artifact.artifact_id}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="font-mono text-[8px] uppercase tracking-widest px-3 py-1.5 rounded-sm transition-colors"
              style={{
                background: `${CYAN}15`,
                border: `1px solid ${CYAN}40`,
                color: CYAN,
              }}
            >
              ↓ Export JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Compare Panel ────────────────────────────────────────────────────────────
function ComparePanel({
  a,
  b,
  onClose,
}: {
  a: Artifact;
  b: Artifact;
  onClose: () => void;
}) {
  const comparison = compareArtifacts(a, b);
  const delta = comparison.score_delta;
  const deltaColor =
    delta > 0 ? "oklch(0.72 0.2 155)" : delta < 0 ? "oklch(0.7 0.22 25)" : DIM;

  return (
    <div
      data-ocid="artifacts.compare_panel"
      className="border rounded-sm mb-4 overflow-hidden"
      style={{ borderColor: `${CYAN}60`, background: "oklch(0.08 0.015 265)" }}
    >
      <div
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{
          borderColor: `${CYAN}30`,
          background: "oklch(0.095 0.02 265)",
        }}
      >
        <span
          className="font-mono text-[9px] uppercase tracking-widest font-bold"
          style={{ color: CYAN }}
        >
          ⚡ Artifact Comparison
        </span>
        <button
          type="button"
          onClick={onClose}
          className="font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-sm"
          style={{
            border: `1px solid ${BORDER}`,
            color: DIM,
          }}
        >
          Close Compare
        </button>
      </div>

      <div className="grid grid-cols-2 gap-0">
        {[a, b].map((art, idx) => (
          <div
            key={art.artifact_id}
            className="p-3"
            style={{
              borderRight: idx === 0 ? `1px solid ${BORDER}` : undefined,
            }}
          >
            <p
              className="font-mono text-[8px] uppercase tracking-widest mb-2"
              style={{ color: CYAN }}
            >
              {idx === 0 ? "Artifact A (newer)" : "Artifact B (older)"}
            </p>
            <p
              className="font-mono text-[10px] font-bold mb-1 truncate"
              style={{ color: FG }}
            >
              {art.title}
            </p>
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-lg font-bold"
                style={{ color: scoreColor(art.score) }}
              >
                {art.score.toFixed(0)}
              </span>
              <span
                className="font-mono text-[8px] uppercase"
                style={{ color: statusColor(art.status) }}
              >
                {art.status}
              </span>
            </div>
            <p className="font-mono text-[8px] mt-1" style={{ color: DIM }}>
              {relativeTime(art.created_at)}
            </p>
          </div>
        ))}
      </div>

      {/* Delta */}
      <div className="px-3 py-2 border-t" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-3 mb-2">
          <span
            className="font-mono text-[8px] uppercase tracking-widest"
            style={{ color: DIM }}
          >
            Score Delta
          </span>
          <span
            className="font-mono text-sm font-bold"
            style={{ color: deltaColor }}
          >
            {delta > 0 ? "+" : ""}
            {delta.toFixed(1)} pts ({delta > 0 ? "+" : ""}
            {comparison.score_delta_pct.toFixed(1)}%)
          </span>
        </div>

        <p
          className="font-mono text-[8px] uppercase tracking-widest mb-1.5"
          style={{ color: DIM }}
        >
          Key Differences
        </p>
        <ul className="space-y-0.5">
          {comparison.key_differences.map((diff, i) => (
            <li
              // biome-ignore lint/suspicious/noArrayIndexKey: stable positional list
              key={i}
              className="font-mono text-[9px] flex items-baseline gap-1.5"
              style={{ color: FG }}
            >
              <span style={{ color: CYAN }}>·</span>
              {diff}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Main Tab ─────────────────────────────────────────────────────────────────
export default function ArtifactsTab() {
  const [artifacts, , archiveArtifact] = useArtifacts();
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let list = artifacts.filter((a) => !a.archived_at);
    if (sourceFilter !== "all") {
      list = list.filter((a) => a.source_system === sourceFilter);
    }
    if (filterTab !== "all") {
      list = list.filter((a) => a.artifact_type === filterTab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [artifacts, sourceFilter, filterTab, search]);

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id]; // slide window
      return [...prev, id];
    });
  }

  const compareArtifactsData =
    compareIds.length === 2
      ? {
          a: artifacts.find((x) => x.artifact_id === compareIds[0])!,
          b: artifacts.find((x) => x.artifact_id === compareIds[1])!,
        }
      : null;

  return (
    <div
      data-ocid="artifacts.panel"
      className="flex flex-col h-full overflow-hidden"
      style={{ background: BG }}
    >
      {/* GENESIS WALL */}
      <div
        className="px-4 pt-3 pb-2 border-b shrink-0"
        style={{ borderColor: BORDER }}
      >
        <GenesisWall />
      </div>
      {/* Header */}
      <div
        className="px-4 pt-3 pb-2 border-b shrink-0"
        style={{ borderColor: BORDER, background: "oklch(0.075 0.013 265)" }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2
              className="font-mono text-[11px] font-bold uppercase tracking-widest"
              style={{ color: CYAN }}
            >
              Artifacts
            </h2>
            <p
              className="font-mono text-[8px] tracking-widest mt-0.5"
              style={{ color: DIM }}
            >
              {artifacts.length} artifacts · evidence layer
            </p>
          </div>

          {compareIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-[8px] tracking-widest"
                style={{ color: DIM }}
              >
                {compareIds.length}/2 selected
              </span>
              {compareIds.length === 2 && (
                <button
                  type="button"
                  data-ocid="artifacts.compare_button"
                  onClick={() => {
                    const el = document.getElementById(
                      "artifacts-compare-panel",
                    );
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="font-mono text-[8px] uppercase tracking-widest px-3 py-1 rounded-sm"
                  style={{
                    background: `${CYAN}20`,
                    border: `1px solid ${CYAN}60`,
                    color: CYAN,
                  }}
                >
                  ⚡ Compare Selected
                </button>
              )}
              <button
                type="button"
                onClick={() => setCompareIds([])}
                className="font-mono text-[8px] uppercase tracking-widest px-2 py-1"
                style={{ color: DIM }}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Source filter */}
        <div className="flex gap-1 mb-2">
          {SOURCE_FILTERS.map((sf) => (
            <button
              key={sf.id}
              type="button"
              data-ocid="artifacts.tab"
              onClick={() => setSourceFilter(sf.id)}
              className="font-mono text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-sm transition-colors"
              style={{
                background:
                  sourceFilter === sf.id ? `${sf.color}20` : "transparent",
                border: `1px solid ${sourceFilter === sf.id ? sf.color : "oklch(0.2 0.04 255)"}`,
                color: sourceFilter === sf.id ? sf.color : DIM,
              }}
            >
              {sf.label}
            </button>
          ))}
          <span
            className="ml-auto font-mono text-[8px] self-center"
            style={{ color: DIM }}
          >
            {filtered.length} artifacts
          </span>
        </div>

        {/* Filter tabs */}
        <div data-ocid="artifacts.filter.tab" className="flex gap-0 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-ocid="artifacts.tab"
              onClick={() => setFilterTab(tab.id)}
              className="font-mono text-[8px] uppercase tracking-widest px-3 py-1.5 transition-colors"
              style={{
                borderBottom:
                  filterTab === tab.id
                    ? `2px solid ${CYAN}`
                    : "2px solid transparent",
                color: filterTab === tab.id ? CYAN : DIM,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div
        className="px-4 py-2 shrink-0 border-b"
        style={{ borderColor: BORDER }}
      >
        <input
          type="text"
          data-ocid="artifacts.search_input"
          placeholder="Search artifacts by title, summary, or tag…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full font-mono text-[9px] bg-transparent border rounded-sm px-3 py-1.5 outline-none"
          style={{
            borderColor: BORDER,
            color: FG,
          }}
        />
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {/* Compare panel */}
        <div id="artifacts-compare-panel">
          {compareArtifactsData?.a && compareArtifactsData?.b && (
            <ComparePanel
              a={compareArtifactsData.a}
              b={compareArtifactsData.b}
              onClose={() => setCompareIds([])}
            />
          )}
        </div>

        {/* Artifact list */}
        <div data-ocid="artifacts.list">
          {filtered.length === 0 ? (
            <div
              data-ocid="artifacts.empty_state"
              className="flex flex-col items-center justify-center py-16 gap-3"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  border: `1px solid ${BORDER}`,
                  color: DIM,
                }}
              >
                <span className="text-lg">◎</span>
              </div>
              <p
                className="font-mono text-[9px] text-center leading-relaxed max-w-xs"
                style={{ color: DIM }}
              >
                No artifacts yet. Run reports, readiness checks, or AI reviews
                to generate artifacts.
              </p>
            </div>
          ) : (
            filtered.map((artifact, index) => (
              <ArtifactCard
                key={artifact.artifact_id}
                artifact={artifact}
                index={index}
                expanded={expandedId === artifact.artifact_id}
                onToggleExpand={() =>
                  setExpandedId((prev) =>
                    prev === artifact.artifact_id ? null : artifact.artifact_id,
                  )
                }
                compareSelected={compareIds.includes(artifact.artifact_id)}
                onToggleCompare={() => toggleCompare(artifact.artifact_id)}
                compareDisabled={compareIds.length >= 2}
                onArchive={archiveArtifact}
                onNavigateTo={(id) =>
                  setExpandedId((prev) => (prev === id ? null : id))
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
