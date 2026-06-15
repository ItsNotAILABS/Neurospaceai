import { AnimatePresence, motion } from "motion/react";
import { useGenesisArtifacts } from "../hooks/useQueries";

const C = {
  bg: "oklch(0.06 0.01 265)",
  panel: "oklch(0.075 0.012 265)",
  border: "oklch(0.18 0.05 250)",
  emerald: "oklch(0.72 0.22 160)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.78 0.22 80)",
  dim: "oklch(0.38 0.05 220)",
  fg: "oklch(0.85 0.05 210)",
  muted: "oklch(0.5 0.08 220)",
};

function hashToHex(h: number): string {
  return `0x${h.toString(16).padStart(8, "0").toUpperCase()}`;
}

export function GenesisWall() {
  const { data, isLoading } = useGenesisArtifacts();
  const count = data ? Number(data.count) : 0;

  return (
    <div
      className="rounded-none border"
      style={{ background: C.panel, borderColor: C.border }}
      data-ocid="genesis.panel"
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ borderColor: C.border }}
      >
        <div>
          <div
            className="font-mono text-[10px] tracking-widest uppercase font-bold"
            style={{ color: C.emerald }}
          >
            ◈ GENESIS WALL
          </div>
          <div
            className="font-mono text-[8px] tracking-wide mt-0.5"
            style={{ color: C.dim }}
          >
            LIVE CREATIVE OUTPUT — OMNIS EMERGENCE ARTIFACTS
          </div>
        </div>
        <div
          className="font-mono text-[11px] font-bold"
          style={{ color: C.emerald }}
        >
          {count}{" "}
          <span style={{ color: C.dim, fontSize: "8px" }}>ARTIFACTS</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {isLoading && (
          <div
            className="flex items-center justify-center py-10"
            data-ocid="genesis.loading_state"
          >
            <span
              className="font-mono text-[9px] tracking-widest uppercase animate-pulse"
              style={{ color: C.muted }}
            >
              SCANNING GENESIS LEDGER...
            </span>
          </div>
        )}

        {!isLoading && count === 0 && (
          <div
            className="flex flex-col items-center justify-center py-12 gap-4"
            data-ocid="genesis.empty_state"
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                border: `1px solid ${C.emerald}55`,
                boxShadow: `0 0 20px ${C.emerald}22`,
              }}
            >
              <span style={{ color: C.emerald, fontSize: "20px" }}>◈</span>
            </motion.div>
            <div className="text-center">
              <p
                className="font-mono text-[9px] tracking-wider uppercase"
                style={{ color: C.dim }}
              >
                AWAITING FIRST EMERGENCE
              </p>
              <p
                className="font-mono text-[8px] mt-1"
                style={{ color: "oklch(0.28 0.04 220)" }}
              >
                Artifacts mint when OMNIS threshold is reached
              </p>
            </div>
          </div>
        )}

        {!isLoading && count > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence>
              {data!.hashes.map((hash, i) => (
                <motion.div
                  key={hash}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  data-ocid={`genesis.item.${i + 1}`}
                  className="relative rounded-none border p-3 flex flex-col gap-2"
                  style={{
                    background: "oklch(0.055 0.015 195)",
                    borderColor: "oklch(0.28 0.12 195 / 0.6)",
                    boxShadow:
                      "0 0 12px oklch(0.55 0.22 175 / 0.18), inset 0 0 20px oklch(0.72 0.22 160 / 0.04)",
                  }}
                >
                  {/* Artifact number */}
                  <div className="flex items-center justify-between">
                    <span
                      className="font-mono text-[8px] tracking-widest uppercase"
                      style={{ color: C.dim }}
                    >
                      ARTIFACT #{i + 1}
                    </span>
                    <span
                      className="font-mono text-[8px] px-1.5 py-0.5"
                      style={{
                        background: "oklch(0.72 0.22 160 / 0.12)",
                        color: C.emerald,
                        border: "1px solid oklch(0.72 0.22 160 / 0.3)",
                      }}
                    >
                      GENESIS
                    </span>
                  </div>

                  {/* Hash */}
                  <div
                    className="font-mono text-[13px] font-bold tracking-wider"
                    style={{
                      color: C.emerald,
                      textShadow: "0 0 8px oklch(0.72 0.22 160 / 0.5)",
                    }}
                  >
                    {hashToHex(hash)}
                  </div>

                  {/* Metrics row */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-0.5">
                      <span
                        className="font-mono text-[7px] tracking-widest uppercase"
                        style={{ color: C.dim }}
                      >
                        BEAT
                      </span>
                      <span
                        className="font-mono text-[10px] font-bold"
                        style={{ color: C.cyan }}
                      >
                        {Number(data!.beats[i] ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span
                        className="font-mono text-[7px] tracking-widest uppercase"
                        style={{ color: C.dim }}
                      >
                        COH
                      </span>
                      <span
                        className="font-mono text-[10px] font-bold"
                        style={{ color: C.gold }}
                      >
                        {((data!.coherences[i] ?? 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span
                        className="font-mono text-[7px] tracking-widest uppercase"
                        style={{ color: C.dim }}
                      >
                        EMER
                      </span>
                      <span
                        className="font-mono text-[10px] font-bold"
                        style={{ color: C.emerald }}
                      >
                        {((data!.emergences[i] ?? 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Glow accent line */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[1px]"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, oklch(0.72 0.22 160 / 0.6), transparent)",
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
