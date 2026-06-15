import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useActor } from "../hooks/useActor";
import {
  useCreatorReserve,
  useMiningState,
  useSetCreatorPrincipal,
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
};

function Bar({
  value,
  color,
  max = 1,
}: { value: number; color: string; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div
      className="w-full h-1.5 rounded-full"
      style={{ background: "oklch(0.15 0.03 255)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

function Skeleton() {
  return (
    <div
      className="h-4 w-full rounded animate-pulse"
      style={{ background: "oklch(0.12 0.02 255)" }}
    />
  );
}

export default function SovereignTab({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { actor } = useActor();
  const reserveQ = useCreatorReserve();
  const miningQ = useMiningState();
  const setCreatorPrincipal = useSetCreatorPrincipal();
  const [locked, setLocked] = useState(false);

  const attrQ = useQuery({
    queryKey: ["creatorAttribution"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await (actor as any).getCreatorAttribution();
      } catch {
        return null;
      }
    },
    enabled: !!actor,
    refetchInterval: 30000,
    staleTime: 0,
  });

  const attr = attrQ.data;
  const reserve = reserveQ.data;
  const mining = miningQ.data;
  const isLocked = locked || attr?.locked;

  const tokenLabels = ["SEED", "MTC", "HBT", "OMS", "DRT", "ANT", "MTH"];
  const tokenValues = reserve
    ? [
        reserve.seed,
        reserve.mtc,
        reserve.hbt,
        reserve.oms,
        reserve.drt,
        reserve.ant,
        reserve.mth,
      ]
    : [];
  const tokenColors = [
    C.green,
    C.cyan,
    "oklch(0.72 0.22 280)",
    "oklch(0.72 0.22 320)",
    C.amber,
    "oklch(0.72 0.22 160)",
    C.gold,
  ];
  const tokenMax = tokenValues.length ? Math.max(...tokenValues, 1) : 1;

  return (
    <div
      className="h-full overflow-y-auto p-4 space-y-4"
      style={{ background: C.bg }}
    >
      {/* Identity lock banner */}
      {isLoggedIn && !isLocked && (
        <div
          className="border rounded p-3 flex items-center justify-between"
          style={{ borderColor: C.amber, background: "oklch(0.12 0.03 80)" }}
        >
          <span
            className="font-mono text-[10px] tracking-widest uppercase"
            style={{ color: C.amber }}
          >
            CREATOR GATE NOT LOCKED — LOCK NOW TO PROTECT SOVEREIGNTY
          </span>
          <button
            type="button"
            onClick={() =>
              setCreatorPrincipal.mutate(undefined, {
                onSuccess: () => setLocked(true),
              })
            }
            className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border"
            style={{
              border: `1px solid ${C.gold}`,
              color: C.gold,
              background: "oklch(0.82 0.22 80 / 0.1)",
            }}
          >
            {setCreatorPrincipal.isPending
              ? "LOCKING..."
              : "LOCK CREATOR IDENTITY"}
          </button>
        </div>
      )}

      {isLocked && (
        <div
          className="border rounded p-2 text-center"
          style={{ borderColor: C.gold, background: "oklch(0.12 0.04 80)" }}
        >
          <span
            className="font-mono text-[10px] tracking-widest uppercase"
            style={{ color: C.gold }}
          >
            ✓ SOVEREIGN LOCK ACTIVE
          </span>
        </div>
      )}

      {/* Attribution */}
      <div
        className="border rounded p-4 space-y-2"
        style={{ borderColor: C.border, background: C.panel }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-3"
          style={{ color: C.dim }}
        >
          CREATOR ATTRIBUTION — ATTORNEY GRADE
        </div>
        {attr ? (
          <div className="grid grid-cols-2 gap-2">
            {[
              ["NAME", attr.name],
              ["JURISDICTION", attr.jurisdiction],
              ["YEAR", String(attr.year)],
              ["DOCTRINE", attr.doctrineTitle],
              [
                "DOCTRINE HASH",
                `0x${attr.doctrineHash.toString(16).toUpperCase()}`,
              ],
              [
                "SOVEREIGN HASH",
                `0x${attr.sovereignHash.toString(16).toUpperCase()}`,
              ],
              [
                "LOCKED",
                attr.locked
                  ? `YES — BEAT ${attr.lockedAtBeat}`
                  : "NOT YET LOCKED",
              ],
            ].map(([label, val]) => (
              <div key={label} className="space-y-0.5">
                <div
                  className="font-mono text-[8px] tracking-widest uppercase"
                  style={{ color: C.dim }}
                >
                  {label}
                </div>
                <div
                  className="font-mono text-[11px]"
                  style={{ color: attr.locked ? C.gold : C.text }}
                >
                  {val}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Skeleton />
        )}
      </div>

      {/* Mining state */}
      <div
        className="border rounded p-4 space-y-2"
        style={{ borderColor: C.border, background: C.panel }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-2"
          style={{ color: C.dim }}
        >
          MINING STATE
        </div>
        {mining ? (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div
                className="font-mono text-[8px] tracking-widest"
                style={{ color: C.dim }}
              >
                BEAT
              </div>
              <div
                className="font-mono text-[13px] font-bold"
                style={{ color: C.cyan }}
              >
                {Number(mining.beatCount).toLocaleString()}
              </div>
            </div>
            <div>
              <div
                className="font-mono text-[8px] tracking-widest"
                style={{ color: C.dim }}
              >
                STREAK
              </div>
              <div
                className="font-mono text-[13px] font-bold"
                style={{ color: C.green }}
              >
                {mining.streak}
              </div>
            </div>
            <div>
              <div
                className="font-mono text-[8px] tracking-widest"
                style={{ color: C.dim }}
              >
                MULTIPLIER
              </div>
              <div
                className="font-mono text-[13px] font-bold"
                style={{ color: C.amber }}
              >
                {mining.streakMult.toFixed(2)}×
              </div>
            </div>
            <div className="col-span-3">
              <div
                className="font-mono text-[8px] tracking-widest mb-1"
                style={{ color: C.dim }}
              >
                JASMINE'S LAW
              </div>
              <div
                className="font-mono text-[11px] font-bold"
                style={{ color: mining.jasmineActive ? C.green : C.red }}
              >
                {mining.jasmineActive
                  ? "✓ ACTIVE — ALL 5 CONDITIONS MET"
                  : "✗ PENDING — ORGANISM BUILDING COHERENCE"}
              </div>
            </div>
          </div>
        ) : (
          <Skeleton />
        )}
      </div>

      {/* Token reserves */}
      <div
        className="border rounded p-4 space-y-3"
        style={{ borderColor: C.border, background: C.panel }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-2"
          style={{ color: C.dim }}
        >
          TOKEN RESERVES — 100% CREATOR
        </div>
        {reserve ? (
          <>
            {tokenLabels.map((label, i) => (
              <div key={label} className="space-y-1">
                <div className="flex justify-between">
                  <span
                    className="font-mono text-[9px] tracking-widest uppercase"
                    style={{ color: C.dim }}
                  >
                    {label}
                  </span>
                  <span
                    className="font-mono text-[10px]"
                    style={{ color: tokenColors[i] }}
                  >
                    {tokenValues[i].toFixed(6)}
                  </span>
                </div>
                <Bar
                  value={tokenValues[i]}
                  max={tokenMax}
                  color={tokenColors[i]}
                />
              </div>
            ))}
            <div className="pt-2 border-t" style={{ borderColor: C.border }}>
              <div className="flex justify-between">
                <span
                  className="font-mono text-[9px] tracking-widest uppercase"
                  style={{ color: C.dim }}
                >
                  MASTER ACCUMULATOR
                </span>
                <span
                  className="font-mono text-[13px] font-bold"
                  style={{ color: C.gold }}
                >
                  {reserve.masterAccum.toFixed(6)}
                </span>
              </div>
            </div>
          </>
        ) : (
          <Skeleton />
        )}
      </div>
    </div>
  );
}
