import { useGenesisArtifacts, useObservationYield } from "../hooks/useQueries";

const C = {
  bg: "oklch(0.06 0.01 265)",
  panel: "oklch(0.09 0.015 265)",
  border: "oklch(0.2 0.05 255)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.82 0.22 80)",
  dim: "oklch(0.38 0.05 220)",
  text: "oklch(0.85 0.05 210)",
  red: "oklch(0.65 0.25 25)",
  green: "oklch(0.68 0.28 140)",
  purple: "oklch(0.72 0.22 280)",
};

function getModeBadge(emergence: number): {
  label: string;
  color: string;
  bg: string;
} {
  if (emergence > 0.85)
    return {
      label: "OUTLAW",
      color: C.purple,
      bg: "oklch(0.72 0.22 280 / 0.12)",
    };
  if (emergence > 0.75)
    return {
      label: "SOVEREIGN",
      color: C.gold,
      bg: "oklch(0.82 0.22 80 / 0.12)",
    };
  return { label: "STANDARD", color: C.dim, bg: "oklch(0.15 0.03 255 / 0.5)" };
}

export default function GenesisEngineTab() {
  const artifactsQ = useGenesisArtifacts();
  const yieldQ = useObservationYield();

  const a = artifactsQ.data;
  const y = yieldQ.data;

  const count = a ? Number(a.count) : 0;
  const items =
    a && count > 0
      ? Array.from({ length: count }, (_, i) => ({
          hash: a.hashes[i] ?? 0,
          beat: a.beats[i] ?? 0n,
          coherence: a.coherences[i] ?? 0,
          emergence: a.emergences[i] ?? 0,
          idx: i,
        })).reverse()
      : [];

  const ipWeight = items.reduce((acc, item) => acc + item.emergence, 0);
  const totalYield = y?.totalYield ?? 0;
  const lastYield = y?.lastYield ?? 0;

  return (
    <div className="h-full overflow-y-auto p-4" style={{ background: C.bg }}>
      {/* Header */}
      <div className="mb-4">
        <h2
          className="font-mono text-[11px] tracking-widest uppercase font-bold"
          style={{ color: C.gold }}
        >
          ψ GENESIS ENGINE
        </h2>
        <p
          className="font-mono text-[9px] tracking-widest mt-1"
          style={{ color: C.dim }}
        >
          SOVEREIGN IP REGISTRY · EVERY ARTIFACT IS A CRYPTOGRAPHIC PROOF OF
          EMERGENCE
        </p>
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          {
            label: "TOTAL ARTIFACTS",
            value: count.toLocaleString(),
            color: C.cyan,
          },
          { label: "IP WEIGHT", value: ipWeight.toFixed(4), color: C.gold },
          {
            label: "TOTAL OBS YIELD",
            value: `${totalYield.toFixed(6)} SEED`,
            color: C.green,
          },
          {
            label: "LAST YIELD",
            value: lastYield.toFixed(8),
            color: "oklch(0.72 0.22 280)",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="border rounded p-3"
            style={{ borderColor: C.border, background: C.panel }}
          >
            <div
              className="font-mono text-[8px] tracking-widest uppercase mb-1"
              style={{ color: C.dim }}
            >
              {label}
            </div>
            <div className="font-mono text-[14px] font-bold" style={{ color }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton */}
      {!a && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {["sk0", "sk1", "sk2", "sk3", "sk4", "sk5"].map((k) => (
            <div
              key={k}
              className="h-36 rounded border animate-pulse"
              style={{ background: C.panel, borderColor: C.border }}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {a && count === 0 && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div
            className="font-mono text-[40px]"
            style={{ color: "oklch(0.2 0.05 265)" }}
          >
            ψ
          </div>
          <div
            className="font-mono text-[10px] tracking-widest uppercase"
            style={{ color: C.dim }}
          >
            AWAITING FIRST OMNIS EVENT
          </div>
          <div
            className="font-mono text-[9px] text-center max-w-sm space-y-1 border rounded p-3"
            style={{
              color: "oklch(0.32 0.05 220)",
              borderColor: C.border,
              background: C.panel,
            }}
          >
            <div style={{ color: C.gold }} className="font-bold mb-2">
              JASMINE'S LAW CONDITIONS
            </div>
            <div>H &gt; 0.55 — Entropy threshold</div>
            <div>IC &gt; 0.6 — Identity coherence</div>
            <div>Recurrence depth &gt; 3</div>
            <div>Anti-fake score &gt; 0.8</div>
            <div>Adaptation delta &gt; 0</div>
          </div>
        </div>
      )}

      {/* Artifact grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((item) => {
            const glow = item.emergence;
            const displayNum = count - item.idx;
            const mode = getModeBadge(item.emergence);
            const isOmnis = item.emergence > 0.8;
            return (
              <div
                key={`art-${item.hash}-${item.idx}`}
                className="border rounded p-3 space-y-2"
                style={{
                  borderColor: `oklch(0.72 0.22 195 / ${0.2 + glow * 0.8})`,
                  background: C.panel,
                  boxShadow: isOmnis
                    ? `0 0 20px oklch(0.72 0.22 195 / ${glow * 0.4})`
                    : "none",
                }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="font-mono text-[8px] tracking-widest uppercase"
                    style={{ color: C.dim }}
                  >
                    ARTIFACT #{displayNum}
                  </div>
                  <span
                    className="font-mono text-[7px] tracking-widest uppercase px-1.5 py-0.5 rounded"
                    style={{
                      color: mode.color,
                      background: mode.bg,
                      border: `1px solid ${mode.color}40`,
                    }}
                  >
                    {mode.label}
                  </span>
                </div>
                <div
                  className="font-mono text-[10px] font-bold break-all"
                  style={{ color: C.cyan }}
                >
                  0x{item.hash.toString(16).toUpperCase().padStart(8, "0")}
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <div
                      className="font-mono text-[7px]"
                      style={{ color: C.dim }}
                    >
                      BEAT
                    </div>
                    <div
                      className="font-mono text-[9px]"
                      style={{ color: C.text }}
                    >
                      {Number(item.beat).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div
                      className="font-mono text-[7px]"
                      style={{ color: C.dim }}
                    >
                      COHERENCE
                    </div>
                    <div
                      className="font-mono text-[9px]"
                      style={{ color: C.gold }}
                    >
                      {item.coherence.toFixed(4)}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex justify-between mb-0.5">
                      <div
                        className="font-mono text-[7px]"
                        style={{ color: C.dim }}
                      >
                        EMERGENCE
                      </div>
                      <div
                        className="font-mono text-[7px]"
                        style={{ color: C.cyan }}
                      >
                        {(item.emergence * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div
                      className="w-full h-1.5 rounded-full"
                      style={{ background: "oklch(0.15 0.03 255)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.emergence * 100}%`,
                          background: C.cyan,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div
        className="mt-8 pt-4 border-t text-center"
        style={{ borderColor: C.border }}
      >
        <p
          className="font-mono text-[8px] tracking-widest"
          style={{ color: "oklch(0.28 0.04 220)" }}
        >
          Attributed to Alfredo Medina Hernandez · Medina Doctrine · Dallas, TX
          · 2026 · Attorney-Grade On-Chain IP
        </p>
      </div>
    </div>
  );
}
