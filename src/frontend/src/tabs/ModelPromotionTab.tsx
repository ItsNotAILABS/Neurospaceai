// MODEL PROMOTION REGISTRY
// M0 → M1 → M2 ADRE-Gated Promotion Chain
// 43 sovereign models — live tier state, proof counts, consumer counts, gate hashes.
// Polls backend at 873ms to match the sovereign heartbeat.
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ModelPromotionRecord, PromotionSummary } from "../backend.d";
import { ModelTier } from "../backend.d";
import { useActor } from "../hooks/useActor";

// ── Color palette (organism dark theme) ─────────────────────────────────────
const C = {
  bg: "oklch(0.055 0.01 265)",
  panel: "oklch(0.075 0.012 265)",
  panelDeep: "oklch(0.065 0.01 265)",
  border: "oklch(0.18 0.05 250)",
  borderLo: "oklch(0.14 0.04 250)",
  dim: "oklch(0.38 0.05 220)",
  dimlo: "oklch(0.26 0.04 220)",
  fg: "oklch(0.85 0.05 210)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.82 0.22 80)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.78 0.22 65)",
  red: "oklch(0.72 0.22 25)",
  gray: "oklch(0.42 0.02 250)",
  grayDim: "oklch(0.28 0.02 250)",
};

// ── Tier styling config ──────────────────────────────────────────────────────
const TIER_CONFIG: Record<
  ModelTier,
  { color: string; borderColor: string; glow: string; label: string }
> = {
  [ModelTier.M0]: {
    color: C.gray,
    borderColor: "oklch(0.3 0.02 250)",
    glow: "none",
    label: "M0",
  },
  [ModelTier.M1]: {
    color: "oklch(0.82 0.22 80)",
    borderColor: "oklch(0.6 0.2 80)",
    glow: "none",
    label: "M1",
  },
  [ModelTier.M2]: {
    color: C.cyan,
    borderColor: "oklch(0.65 0.22 195)",
    glow: "0 0 8px rgba(6,182,212,0.4)",
    label: "M2",
  },
};

type TierFilter = "ALL" | ModelTier;

// ── Sub-components ───────────────────────────────────────────────────────────
function TierBadge({ tier }: { tier: ModelTier }) {
  const t = TIER_CONFIG[tier];
  return (
    <span
      className="font-mono text-[8px] font-bold tracking-widest px-1.5 py-0.5 border"
      style={{
        color: t.color,
        borderColor: t.borderColor,
        background: `${t.color}18`,
        boxShadow: t.glow,
      }}
    >
      {t.label}
    </span>
  );
}

function SummaryCell({
  label,
  value,
  color,
}: { label: string; value: string; color: string }) {
  return (
    <div
      className="flex flex-col gap-1 p-3 border"
      style={{ background: C.panelDeep, borderColor: `${color}30` }}
    >
      <span
        className="font-mono text-[8px] tracking-widest uppercase"
        style={{ color: C.dim }}
      >
        {label}
      </span>
      <span
        className="font-mono text-2xl font-bold leading-none"
        style={{ color, textShadow: `0 0 12px ${color}50` }}
      >
        {value}
      </span>
    </div>
  );
}

function CoherenceBar({
  tier,
  proofCount,
}: {
  tier: ModelTier;
  proofCount: number;
}) {
  // Thresholds: M0→M1 needs 5 proofs, M1→M2 needs 20 proofs
  const threshold = tier === ModelTier.M0 ? 5 : tier === ModelTier.M1 ? 20 : 20;
  const pct = Math.min(100, Math.round((proofCount / threshold) * 100));
  const tierConf = TIER_CONFIG[tier];
  const atMax = pct >= 100;

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-mono text-[7px]" style={{ color: C.dimlo }}>
          PROOF PROGRESS
        </span>
        <span
          className="font-mono text-[7px] font-bold"
          style={{ color: atMax ? C.green : tierConf.color }}
        >
          {proofCount}/{threshold}
        </span>
      </div>
      <div className="h-1" style={{ background: "oklch(0.12 0.01 265)" }}>
        <div
          className="h-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: atMax ? C.green : tierConf.color,
            boxShadow: atMax ? `0 0 4px ${C.green}` : tierConf.glow,
          }}
        />
      </div>
    </div>
  );
}

function ModelCard({
  record,
  index,
  onRequestPromotion,
}: {
  record: ModelPromotionRecord;
  index: number;
  onRequestPromotion: (id: string) => void;
}) {
  const [showOverlay, setShowOverlay] = useState(false);
  const tierConf = TIER_CONFIG[record.tier];
  const proofCount = record.proofBundles.length;
  const gateHashDisplay =
    record.adreGateHash.length >= 8
      ? record.adreGateHash.slice(0, 8).toUpperCase()
      : record.adreGateHash.toUpperCase();
  const canPromote =
    record.tier === ModelTier.M0 || record.tier === ModelTier.M1;

  return (
    <div
      className="relative border flex flex-col gap-2 p-3 transition-all"
      style={{
        background: C.panel,
        borderColor: record.pendingPromotion
          ? `${C.amber}60`
          : `${tierConf.borderColor}50`,
        boxShadow: record.tier === ModelTier.M2 ? tierConf.glow : "none",
      }}
      data-ocid={`modelpromo.model.item.${index}`}
    >
      {/* Pending indicator bar */}
      {record.pendingPromotion && (
        <div
          className="absolute top-0 left-0 right-0 h-px animate-pulse"
          style={{ background: C.amber, boxShadow: `0 0 6px ${C.amber}` }}
        />
      )}

      {/* Header row: name + tier badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span
            className="font-mono text-[9px] font-bold tracking-wide truncate"
            style={{ color: C.fg }}
          >
            {record.name}
          </span>
          <span
            className="font-mono text-[7px] tracking-widest"
            style={{ color: C.dimlo }}
          >
            {record.id}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {record.pendingPromotion && (
            <span
              className="font-mono text-[6px] font-bold px-1 py-0.5 animate-pulse"
              style={{
                color: C.amber,
                background: `${C.amber}18`,
                border: `1px solid ${C.amber}50`,
              }}
            >
              PENDING
            </span>
          )}
          <TierBadge tier={record.tier} />
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-1">
        <div className="flex flex-col gap-0.5">
          <span
            className="font-mono text-[6px] tracking-widest uppercase"
            style={{ color: C.dim }}
          >
            PROOFS
          </span>
          <span
            className="font-mono text-[10px] font-bold"
            style={{ color: tierConf.color }}
          >
            {proofCount}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span
            className="font-mono text-[6px] tracking-widest uppercase"
            style={{ color: C.dim }}
          >
            CONSUMERS
          </span>
          <span
            className="font-mono text-[10px] font-bold"
            style={{ color: C.cyan }}
          >
            {String(record.consumerCount)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span
            className="font-mono text-[6px] tracking-widest uppercase"
            style={{ color: C.dim }}
          >
            GATE HASH
          </span>
          <span
            className="font-mono text-[8px] font-bold"
            style={{ color: C.dimlo }}
          >
            {gateHashDisplay || "——"}
          </span>
        </div>
      </div>

      {/* Proof progress bar */}
      <CoherenceBar tier={record.tier} proofCount={proofCount} />

      {/* Promote button for M0/M1 */}
      {canPromote && (
        <button
          type="button"
          className="font-mono text-[7px] tracking-widest uppercase py-1 border transition-all mt-0.5"
          style={{
            color: tierConf.color,
            borderColor: `${tierConf.borderColor}60`,
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              `${tierConf.color}12`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
          }}
          onClick={() => setShowOverlay(true)}
          data-ocid={`modelpromo.promote.open_modal_button.${index}`}
        >
          ▲ REQUEST PROMOTION → {record.tier === ModelTier.M0 ? "M1" : "M2"}
        </button>
      )}

      {/* Promotion overlay */}
      {showOverlay && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10"
          style={{
            background: "oklch(0.06 0.015 265 / 0.96)",
            border: `1px solid ${tierConf.borderColor}`,
          }}
          data-ocid={`modelpromo.promote.dialog.${index}`}
        >
          <div className="flex flex-col items-center gap-1">
            <span
              className="font-mono text-[8px] tracking-widest"
              style={{ color: C.dim }}
            >
              PROMOTE MODEL
            </span>
            <span
              className="font-mono text-[10px] font-bold"
              style={{ color: C.fg }}
            >
              {record.name}
            </span>
            <span className="font-mono text-[7px]" style={{ color: C.dimlo }}>
              {record.tier} → {record.tier === ModelTier.M0 ? "M1" : "M2"}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="font-mono text-[8px] tracking-widest px-3 py-1.5 border transition-all"
              style={{
                color: tierConf.color,
                borderColor: tierConf.borderColor,
                background: `${tierConf.color}12`,
              }}
              onClick={() => {
                setShowOverlay(false);
                onRequestPromotion(record.id);
              }}
              data-ocid={`modelpromo.promote.confirm_button.${index}`}
            >
              CONFIRM
            </button>
            <button
              type="button"
              className="font-mono text-[8px] tracking-widest px-3 py-1.5 border transition-all"
              style={{
                color: C.dim,
                borderColor: C.borderLo,
                background: "transparent",
              }}
              onClick={() => setShowOverlay(false)}
              data-ocid={`modelpromo.promote.cancel_button.${index}`}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Flash banner ─────────────────────────────────────────────────────────────
function FlashBanner({
  message,
  success,
}: { message: string; success: boolean }) {
  const color = success ? C.green : C.red;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="font-mono text-[9px] tracking-widest text-center py-2 border"
      style={{
        color,
        borderColor: `${color}50`,
        background: `${color}10`,
        boxShadow: `0 0 12px ${color}30`,
      }}
      data-ocid="modelpromo.flash.toast"
    >
      {message}
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ModelPromotionTab() {
  const { actor, isFetching } = useActor();
  const [records, setRecords] = useState<ModelPromotionRecord[]>([]);
  const [summary, setSummary] = useState<PromotionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [tierFilter, setTierFilter] = useState<TierFilter>("ALL");
  const [flash, setFlash] = useState<{
    message: string;
    success: boolean;
  } | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!actor || isFetching) return;
    const poll = async () => {
      try {
        const [snap, sum] = await Promise.all([
          (
            actor as Record<string, (...args: unknown[]) => Promise<unknown>>
          ).getPromotionSnapshot?.() as Promise<ModelPromotionRecord[]>,
          (
            actor as Record<string, (...args: unknown[]) => Promise<unknown>>
          ).getPromotionSummary?.() as Promise<PromotionSummary>,
        ]);
        if (snap) setRecords(snap);
        if (sum) setSummary(sum);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };
    poll();
    intervalRef.current = setInterval(poll, 873);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [actor, isFetching]);

  const handleRequestPromotion = async (modelId: string) => {
    if (!actor) return;
    try {
      // Use the last ADRE gate hash "ADRE-AUTO" as the gate token from the current cycle
      const result = (await (
        actor as Record<string, (...args: unknown[]) => Promise<unknown>>
      ).requestModelPromotion?.(modelId, "ADRE-AUTO")) as [boolean, string];
      const success = result?.[0] ?? false;
      const msg = result?.[1] ?? "UNKNOWN RESULT";
      setFlash({
        message: success
          ? `▲ PROMOTION GRANTED: ${msg}`
          : `✗ PROMOTION DENIED: ${msg}`,
        success,
      });
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      flashTimerRef.current = setTimeout(() => setFlash(null), 4000);
      // Refresh snapshot immediately after promotion
      try {
        const [snap, sum] = await Promise.all([
          (
            actor as Record<string, (...args: unknown[]) => Promise<unknown>>
          ).getPromotionSnapshot?.() as Promise<ModelPromotionRecord[]>,
          (
            actor as Record<string, (...args: unknown[]) => Promise<unknown>>
          ).getPromotionSummary?.() as Promise<PromotionSummary>,
        ]);
        if (snap) setRecords(snap);
        if (sum) setSummary(sum);
      } catch {
        /* silent */
      }
    } catch {
      setFlash({
        message: "✗ PROMOTION REQUEST FAILED — ACTOR UNREACHABLE",
        success: false,
      });
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      flashTimerRef.current = setTimeout(() => setFlash(null), 4000);
    }
  };

  const filtered = records.filter((r) =>
    tierFilter === "ALL" ? true : r.tier === tierFilter,
  );

  const m0 = summary
    ? Number(summary.m0Count)
    : records.filter((r) => r.tier === ModelTier.M0).length;
  const m1 = summary
    ? Number(summary.m1Count)
    : records.filter((r) => r.tier === ModelTier.M1).length;
  const m2 = summary
    ? Number(summary.m2Count)
    : records.filter((r) => r.tier === ModelTier.M2).length;
  const totalProofs = summary ? Number(summary.totalProofBundles) : 0;

  const FILTERS: { id: TierFilter; label: string; color: string }[] = [
    { id: "ALL", label: "ALL", color: C.cyan },
    { id: ModelTier.M0, label: "M0", color: C.gray },
    { id: ModelTier.M1, label: "M1", color: C.gold },
    { id: ModelTier.M2, label: "M2", color: C.cyan },
  ];

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: C.bg }}
      data-ocid="modelpromo.page"
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between px-4 py-3 border-b shrink-0"
        style={{ background: "oklch(0.065 0.012 230)", borderColor: C.border }}
        data-ocid="modelpromo.header.panel"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 shrink-0"
            style={{
              background: loading ? C.dimlo : C.cyan,
              boxShadow: loading ? "none" : `0 0 10px ${C.cyan}`,
              transition: "all 0.5s",
            }}
          />
          <span
            className="font-mono text-xl font-bold tracking-widest"
            style={{ color: C.cyan }}
          >
            MODEL PROMOTION REGISTRY
          </span>
        </div>
        <div
          className="font-mono text-[8px] tracking-widest"
          style={{ color: C.dimlo }}
        >
          M0 → M1 → M2 ADRE-GATED PROMOTION CHAIN
        </div>
      </motion.div>

      {/* ── Flash banner ────────────────────────────────────────────────────── */}
      {flash && (
        <div className="px-3 pt-2">
          <FlashBanner message={flash.message} success={flash.success} />
        </div>
      )}

      <div className="flex flex-col gap-3 p-3">
        {/* ── Summary bar ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="grid grid-cols-4 gap-2"
          data-ocid="modelpromo.summary.section"
        >
          <SummaryCell label="M0 MODELS" value={String(m0)} color={C.gray} />
          <SummaryCell label="M1 MODELS" value={String(m1)} color={C.gold} />
          <SummaryCell label="M2 MODELS" value={String(m2)} color={C.cyan} />
          <SummaryCell
            label="TOTAL PROOF BUNDLES"
            value={String(totalProofs)}
            color={C.green}
          />
        </motion.div>

        {/* ── Tier filter buttons ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-2"
          data-ocid="modelpromo.tier_filter.section"
        >
          <span
            className="font-mono text-[8px] tracking-widest"
            style={{ color: C.dim }}
          >
            FILTER:
          </span>
          {FILTERS.map(({ id, label, color }) => {
            const isActive = tierFilter === id;
            return (
              <button
                key={id}
                type="button"
                className="font-mono text-[8px] tracking-widest px-2.5 py-1 border transition-all"
                style={{
                  color: isActive ? color : C.dim,
                  borderColor: isActive ? `${color}70` : C.borderLo,
                  background: isActive ? `${color}14` : "transparent",
                  boxShadow:
                    isActive && id === "ALL" ? `0 0 8px ${color}25` : "none",
                }}
                onClick={() => setTierFilter(id)}
                data-ocid={`modelpromo.filter.${label.toLowerCase()}.tab`}
              >
                {label}
              </button>
            );
          })}
          <span
            className="font-mono text-[8px] ml-auto"
            style={{ color: C.dimlo }}
          >
            {filtered.length} MODELS
          </span>
        </motion.div>

        {/* ── Model grid ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          {loading ? (
            <div
              className="flex items-center justify-center h-32 border font-mono text-[9px] tracking-widest"
              style={{
                borderColor: C.borderLo,
                background: C.panel,
                color: C.dimlo,
              }}
              data-ocid="modelpromo.grid.loading_state"
            >
              <span style={{ color: C.cyan }}>●</span>&nbsp;LOADING MODEL
              REGISTRY…
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center h-32 border gap-2 font-mono"
              style={{ borderColor: C.borderLo, background: C.panel }}
              data-ocid="modelpromo.grid.empty_state"
            >
              <span
                className="text-[10px] tracking-widest"
                style={{ color: C.dimlo }}
              >
                NO MODELS IN TIER {tierFilter}
              </span>
              <button
                type="button"
                className="text-[8px] tracking-widest px-2 py-1 border transition-all"
                style={{ color: C.cyan, borderColor: `${C.cyan}50` }}
                onClick={() => setTierFilter("ALL")}
              >
                SHOW ALL
              </button>
            </div>
          ) : (
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              }}
              data-ocid="modelpromo.grid.list"
            >
              {filtered.map((record, i) => (
                <ModelCard
                  key={record.id}
                  record={record}
                  index={i + 1}
                  onRequestPromotion={handleRequestPromotion}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Legend ───────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="flex items-center gap-4 border-t pt-3"
          style={{ borderColor: C.borderLo }}
          data-ocid="modelpromo.legend.section"
        >
          <span
            className="font-mono text-[7px] tracking-widest"
            style={{ color: C.dimlo }}
          >
            TIER LEGEND:
          </span>
          {[
            { tier: ModelTier.M0, desc: "UNVALIDATED — GROUND STATE" },
            { tier: ModelTier.M1, desc: "VALIDATED — MULTI-CONSUMER PROOF" },
            { tier: ModelTier.M2, desc: "SOVEREIGN — FULL FIELD COUPLING" },
          ].map(({ tier, desc }) => (
            <div key={tier} className="flex items-center gap-1.5">
              <TierBadge tier={tier} />
              <span
                className="font-mono text-[6px] tracking-wide"
                style={{ color: C.dim }}
              >
                {desc}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
