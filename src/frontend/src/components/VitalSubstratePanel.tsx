import { motion } from "motion/react";
import { useVitalSubstrate } from "../hooks/useQueries";

const C = {
  panel: "oklch(0.075 0.012 265)",
  border: "oklch(0.18 0.05 250)",
  dim: "oklch(0.38 0.05 220)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.78 0.22 80)",
  red: "oklch(0.72 0.22 25)",
  muted: "oklch(0.5 0.08 220)",
  cyan: "oklch(0.72 0.22 195)",
};

const ORGANS = [
  { key: "heart", label: "HEART" },
  { key: "lung", label: "LUNG" },
  { key: "liver", label: "LIVER" },
  { key: "kidney", label: "KIDNEY" },
  { key: "immune", label: "IMMUNE" },
] as const;

function organColor(v: number) {
  if (v > 0.8) return C.green;
  if (v > 0.5) return C.amber;
  return C.red;
}

export function VitalSubstratePanel() {
  const { data, isLoading } = useVitalSubstrate();

  const threat = data?.threat ?? 0;
  const aegisLock = data?.aegisLock ?? false;
  const aegisBeat = data ? Number(data.aegisBeat) : 0;

  return (
    <div
      className="rounded-none border p-3"
      style={{ background: C.panel, borderColor: C.border }}
      data-ocid="vital.panel"
    >
      <div
        className="font-mono text-[9px] tracking-widest uppercase mb-3 pb-1 border-b flex items-center justify-between"
        style={{ color: C.green, borderColor: "oklch(0.18 0.06 140 / 0.5)" }}
      >
        <span>◈ VITAL SUBSTRATE — Internal Node 5</span>
        {aegisLock && (
          <span
            className="font-mono text-[7px] px-1.5 py-0.5"
            style={{
              background: "oklch(0.72 0.22 25 / 0.18)",
              color: C.red,
              border: "1px solid oklch(0.72 0.22 25 / 0.5)",
              animation: "pulse 1s infinite",
            }}
            data-ocid="vital.aegis.toggle"
          >
            ⚠ AEGIS LOCK
          </span>
        )}
      </div>

      {isLoading && (
        <div className="py-4 text-center" data-ocid="vital.loading_state">
          <span
            className="font-mono text-[8px] tracking-widest uppercase animate-pulse"
            style={{ color: C.muted }}
          >
            SCANNING VITAL SUBSTRATE...
          </span>
        </div>
      )}

      {!isLoading && (
        <div className="flex flex-col gap-2">
          {/* Organ bars */}
          {ORGANS.map((organ) => {
            const val = data ? ((data as any)[organ.key] as number) : 0;
            const pct = Math.max(0, Math.min(1, val)) * 100;
            const color = organColor(val);
            return (
              <div key={organ.key} className="flex items-center gap-2">
                <div
                  className="font-mono text-[8px] w-14 shrink-0"
                  style={{ color }}
                >
                  {organ.label}
                </div>
                <div
                  className="flex-1 h-[5px] rounded-none overflow-hidden"
                  style={{ background: "oklch(0.12 0.02 265)" }}
                >
                  <motion.div
                    className="h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{
                      background: color,
                      boxShadow: `0 0 3px ${color}88`,
                    }}
                  />
                </div>
                <div
                  className="font-mono text-[8px] w-8 shrink-0 text-right"
                  style={{ color }}
                >
                  {pct.toFixed(0)}%
                </div>
              </div>
            );
          })}

          {/* Separator */}
          <div className="my-1 h-[1px]" style={{ background: C.border }} />

          {/* Threat level */}
          <div className="flex items-center gap-2">
            <div
              className="font-mono text-[8px] w-14 shrink-0"
              style={{
                color: threat > 0.8 ? C.red : threat > 0.5 ? C.amber : C.dim,
              }}
            >
              THREAT
            </div>
            <div
              className="flex-1 h-[5px] rounded-none overflow-hidden"
              style={{ background: "oklch(0.12 0.02 265)" }}
            >
              <motion.div
                className="h-full"
                initial={{ width: 0 }}
                animate={{ width: `${threat * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                  background:
                    threat > 0.8 ? C.red : threat > 0.5 ? C.amber : C.green,
                  boxShadow: threat > 0.8 ? `0 0 6px ${C.red}` : "none",
                }}
              />
            </div>
            <div
              className="font-mono text-[8px] w-8 shrink-0 text-right"
              style={{ color: threat > 0.8 ? C.red : C.dim }}
            >
              {(threat * 100).toFixed(0)}%
            </div>
          </div>

          {/* Aegis info */}
          {aegisBeat > 0 && (
            <div className="font-mono text-[7px] mt-1" style={{ color: C.dim }}>
              AEGIS LOCK BEAT: {aegisBeat.toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
