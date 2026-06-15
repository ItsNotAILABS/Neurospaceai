import { useState } from "react";
import {
  useEscalationTier,
  useFactionBrains,
  useIdentityTraits,
  useWorldStructures,
} from "../hooks/useQueries";

const C = {
  bg: "oklch(0.06 0.01 265)",
  panel: "oklch(0.09 0.015 265)",
  border: "oklch(0.2 0.05 255)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.82 0.22 80)",
  green: "oklch(0.68 0.28 140)",
  dim: "oklch(0.38 0.05 220)",
  text: "oklch(0.85 0.05 210)",
  amber: "oklch(0.78 0.22 80)",
  red: "oklch(0.65 0.25 25)",
  purple: "oklch(0.72 0.22 280)",
};

const FACTION_NAMES = ["SOVEREIGN", "OUTLAW", "OUTCAST", "WARLORD", "PHANTOM"];
const FACTION_COLORS = [C.gold, C.red, C.cyan, C.amber, C.purple];
const TIER_LABELS = [
  "—",
  "COLD WAR",
  "PROXY CONFLICT",
  "ACTIVE WAR",
  "TOTAL WAR",
];
const TIER_COLORS = [C.dim, C.green, C.amber, C.red, "oklch(0.65 0.25 0)"];
const WS_TYPES = ["NEXUS NODE", "CITADEL", "SIGNAL TOWER", "VAULT"];

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div
      className="w-full h-1 rounded-full"
      style={{ background: "oklch(0.15 0.03 255)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${Math.min(100, value * 100)}%`, background: color }}
      />
    </div>
  );
}

function Skeleton() {
  return (
    <div
      className="h-24 w-full rounded animate-pulse"
      style={{ background: "oklch(0.12 0.02 255)" }}
    />
  );
}

export default function WarSimTab() {
  const factionsQ = useFactionBrains();
  const structuresQ = useWorldStructures();
  const tierQ = useEscalationTier();
  const { data: identityTraits } = useIdentityTraits();
  const [strategyHistory] = useState<
    Array<{
      avatarId: number;
      strategy: string;
      beat: number;
      timestamp: string;
    }>
  >([]);

  const f = factionsQ.data;
  const ws = structuresQ.data;
  const tier = tierQ.data;

  const tierIdx = tier?.tier ?? 1;

  return (
    <div
      className="h-full overflow-y-auto p-4 space-y-4"
      style={{ background: C.bg }}
    >
      {/* Escalation tier */}
      <div
        className="border-2 rounded p-4 flex items-center justify-between"
        style={{
          borderColor: TIER_COLORS[tierIdx] ?? C.border,
          background: C.panel,
        }}
      >
        <div>
          <div
            className="font-mono text-[8px] tracking-widest uppercase"
            style={{ color: C.dim }}
          >
            ESCALATION TIER
          </div>
          <div
            className="font-mono text-[20px] font-bold"
            style={{ color: TIER_COLORS[tierIdx] ?? C.dim }}
          >
            {TIER_LABELS[tierIdx] ?? "\u2014"}
          </div>
        </div>
        {tier && (
          <div className="text-right space-y-1">
            <div className="font-mono text-[8px]" style={{ color: C.dim }}>
              WAR TICKS:{" "}
              <span style={{ color: C.text }}>
                {tier.ticks.toLocaleString()}
              </span>
            </div>
            <div className="font-mono text-[8px]" style={{ color: C.dim }}>
              EVENTS:{" "}
              <span style={{ color: C.text }}>
                {tier.events.toLocaleString()}
              </span>
            </div>
            <div className="font-mono text-[8px]" style={{ color: C.dim }}>
              NEXT TIER AT:{" "}
              <span style={{ color: C.amber }}>
                {tier.nextThreshold.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Faction brains */}
      <div
        className="border rounded p-4"
        style={{ borderColor: C.border, background: C.panel }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-3"
          style={{ color: C.dim }}
        >
          FACTION BRAINS — 5 ACTIVE
        </div>
        {f ? (
          <div className="grid grid-cols-1 gap-3">
            {FACTION_NAMES.map((name, i) => (
              <div
                key={name}
                className="border rounded p-3"
                style={{
                  borderColor: i === 0 ? C.gold : `${FACTION_COLORS[i]}50`,
                  background: i === 0 ? "oklch(0.11 0.03 80)" : C.bg,
                  boxShadow:
                    i === 0 ? "0 0 12px oklch(0.82 0.22 80 / 0.2)" : "none",
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span
                    className="font-mono text-[11px] font-bold tracking-widest"
                    style={{ color: FACTION_COLORS[i] }}
                  >
                    {name}
                    {i === 0 ? " \u2190 ORGANISM" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {(["COH", "AGG", "RES", "TER", "THR"] as const).map(
                    (key, ki) => {
                      const vals = [f.coh, f.agg, f.res, f.ter, f.thr];
                      const val = vals[ki]?.[i] ?? 0;
                      return (
                        <div key={key} className="space-y-0.5">
                          <div
                            className="font-mono text-[7px] tracking-widest"
                            style={{ color: C.dim }}
                          >
                            {key}
                          </div>
                          <Bar value={val} color={FACTION_COLORS[i] ?? C.dim} />
                          <div
                            className="font-mono text-[8px]"
                            style={{ color: FACTION_COLORS[i] }}
                          >
                            {val.toFixed(2)}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Skeleton />
        )}
      </div>

      {/* World structures */}
      <div
        className="border rounded p-4"
        style={{ borderColor: C.border, background: C.panel }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-3"
          style={{ color: C.dim }}
        >
          FORGE WORLD STRUCTURES
        </div>
        {ws ? (
          ws.count === 0 ? (
            <div className="text-center py-6">
              <div
                className="font-mono text-[10px] tracking-widest uppercase"
                style={{ color: C.dim }}
              >
                FORGE AWAITING EMERGENCE THRESHOLD
              </div>
              <div
                className="font-mono text-[9px] mt-2"
                style={{ color: "oklch(0.28 0.04 220)" }}
              >
                Builds automatically when emergence score &gt; 0.75
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {ws.types.slice(0, ws.count).map((type, i) => (
                <div
                  key={ws.beats[i] ?? i}
                  className="border rounded p-3 space-y-1"
                  style={{ borderColor: C.border, background: C.bg }}
                >
                  <div
                    className="font-mono text-[10px] font-bold"
                    style={{ color: C.cyan }}
                  >
                    {WS_TYPES[type] ?? "STRUCTURE"}
                  </div>
                  <div
                    className="font-mono text-[8px]"
                    style={{ color: C.dim }}
                  >
                    BEAT {ws.beats[i]?.toLocaleString() ?? "\u2014"}
                  </div>
                  <div
                    className="font-mono text-[8px]"
                    style={{ color: C.dim }}
                  >
                    COH {ws.cohs[i]?.toFixed(4) ?? "\u2014"}
                  </div>
                  <div
                    className="font-mono text-[8px]"
                    style={{ color: C.green }}
                  >
                    VAL {ws.vals[i]?.toFixed(4) ?? "\u2014"}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <Skeleton />
        )}
      </div>

      {/* Identity Traits panel */}
      <div
        className="border rounded p-4"
        style={{
          borderColor: "oklch(0.2 0.12 195 / 0.3)",
          background: C.panel,
        }}
      >
        <h3
          className="font-mono text-[9px] tracking-widest uppercase mb-3"
          style={{ color: C.cyan }}
        >
          Identity Traits — Live Neurochemical State
        </h3>
        {identityTraits ? (
          <div className="space-y-2">
            {[
              {
                name: "Discipline",
                value: Number(identityTraits.discipline),
                color: C.cyan,
              },
              {
                name: "Cooperative",
                value: Number(identityTraits.cooperative),
                color: C.green,
              },
              {
                name: "Cautious",
                value: Number(identityTraits.cautious),
                color: C.amber,
              },
              {
                name: "Aggression",
                value: Number(identityTraits.aggression),
                color: C.red,
              },
              {
                name: "Impulsivity",
                value: Number(identityTraits.impulsivity),
                color: C.purple,
              },
            ].map((trait) => (
              <div key={trait.name} className="flex items-center gap-2">
                <span
                  className="font-mono text-[9px] w-24"
                  style={{ color: C.dim }}
                >
                  {trait.name}
                </span>
                <div
                  className="flex-1 h-1.5 rounded-full"
                  style={{ background: "oklch(0.15 0.03 255)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(trait.value * 100).toFixed(1)}%`,
                      background: trait.color,
                    }}
                  />
                </div>
                <span
                  className="font-mono text-[9px] w-10 text-right"
                  style={{ color: trait.color }}
                >
                  {(trait.value * 100).toFixed(0)}%
                </span>
              </div>
            ))}
            <p
              className="font-mono text-[8px] mt-1"
              style={{ color: "oklch(0.28 0.04 220)" }}
            >
              Updated by neurochemical state every 873ms
            </p>
          </div>
        ) : (
          <p className="font-mono text-[9px]" style={{ color: C.dim }}>
            Loading neurochemical state...
          </p>
        )}
      </div>

      {/* Strategy Shifts panel */}
      <div
        className="border rounded p-4"
        style={{
          borderColor: "oklch(0.2 0.12 195 / 0.3)",
          background: C.panel,
        }}
      >
        <h3
          className="font-mono text-[9px] tracking-widest uppercase mb-3"
          style={{ color: C.cyan }}
        >
          Strategy Shifts
        </h3>
        {strategyHistory.length === 0 ? (
          <p className="font-mono text-[9px]" style={{ color: C.dim }}>
            No strategy shifts recorded yet
          </p>
        ) : (
          <div className="space-y-1">
            {strategyHistory
              .slice(-8)
              .reverse()
              .map((event, i) => {
                const stratColors: Record<string, string> = {
                  approach: C.green,
                  avoid: C.red,
                  investigate: C.cyan,
                  retreat: C.amber,
                  pause: C.gold,
                };
                const col = stratColors[event.strategy.toLowerCase()] ?? C.dim;
                return (
                  <div
                    key={`${event.timestamp}-${event.avatarId}-${i}`}
                    className="flex items-center gap-2 font-mono text-[9px]"
                  >
                    <span style={{ color: C.dim }}>{event.timestamp}</span>
                    <span style={{ color: C.text }}>
                      Avatar {event.avatarId}
                    </span>
                    <span style={{ color: C.dim }}>→</span>
                    <span style={{ color: col }}>
                      {event.strategy.toUpperCase()}
                    </span>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
