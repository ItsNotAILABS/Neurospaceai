import {
  useCreatorReserve,
  useMarketVisionState,
  useSuccessionState,
  useTreasuryState,
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

function Stat({
  label,
  value,
  color,
}: { label: string; value: string; color: string }) {
  return (
    <div
      className="border rounded p-3 space-y-1"
      style={{ borderColor: C.border, background: C.panel }}
    >
      <div
        className="font-mono text-[8px] tracking-widest uppercase"
        style={{ color: C.dim }}
      >
        {label}
      </div>
      <div className="font-mono text-[14px] font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div
      className="h-10 w-full rounded animate-pulse"
      style={{ background: "oklch(0.12 0.02 255)" }}
    />
  );
}

export default function TreasuryTab() {
  const treasuryQ = useTreasuryState();
  const reserveQ = useCreatorReserve();
  const marketQ = useMarketVisionState();
  const successionQ = useSuccessionState();

  const t = treasuryQ.data;
  const r = reserveQ.data;
  const m = marketQ.data;
  const s = successionQ.data;

  return (
    <div
      className="h-full overflow-y-auto p-4 space-y-4"
      style={{ background: C.bg }}
    >
      {/* Master accumulator — top highlight */}
      <div
        className="border-2 rounded p-4 text-center"
        style={{ borderColor: C.gold, background: "oklch(0.10 0.02 80)" }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-1"
          style={{ color: C.dim }}
        >
          MASTER ACCUMULATOR — TOTAL CREATOR EARNINGS
        </div>
        {r ? (
          <div
            className="font-mono text-[28px] font-bold"
            style={{
              color: C.gold,
              textShadow: "0 0 30px oklch(0.82 0.22 80 / 0.5)",
            }}
          >
            {r.masterAccum.toFixed(6)}
          </div>
        ) : (
          <Skeleton />
        )}
      </div>

      {/* Market vision */}
      <div
        className="border rounded p-4"
        style={{ borderColor: C.border, background: C.panel }}
      >
        <div className="flex justify-between items-center mb-3">
          <div
            className="font-mono text-[9px] tracking-widest uppercase"
            style={{ color: C.dim }}
          >
            MARKET VISION — LIVE HTTP OUTCALLS
          </div>
          {m && (
            <div
              className="font-mono text-[8px]"
              style={{ color: m.fallback ? C.amber : C.green }}
            >
              {m.fallback ? "COINCAP FALLBACK" : "COINGECKO"} · {m.fetchCount}{" "}
              FETCHES
            </div>
          )}
        </div>
        {m ? (
          <div className="grid grid-cols-3 gap-3">
            <Stat
              label="BTC PRICE"
              value={m.btc > 0 ? `$${m.btc.toLocaleString()}` : "FETCHING"}
              color={C.gold}
            />
            <Stat
              label="ETH PRICE"
              value={m.eth > 0 ? `$${m.eth.toLocaleString()}` : "FETCHING"}
              color={"oklch(0.72 0.22 280)"}
            />
            <Stat
              label="ICP PRICE"
              value={m.icp > 0 ? `$${m.icp.toFixed(2)}` : "FETCHING"}
              color={C.cyan}
            />
          </div>
        ) : (
          <Skeleton />
        )}
        {m && m.blindEvents > 0 && (
          <div
            className="mt-2 font-mono text-[8px] tracking-widest"
            style={{ color: C.amber }}
          >
            ⚠ {m.blindEvents} BLIND EVENTS — ORGANISM LOGGED MARKET VISION
            FAILURES
          </div>
        )}
      </div>

      {/* Treasury balances */}
      <div
        className="border rounded p-4"
        style={{ borderColor: C.border, background: C.panel }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-3"
          style={{ color: C.dim }}
        >
          TREASURY BALANCES
        </div>
        {t ? (
          <div className="grid grid-cols-2 gap-3">
            <Stat label="ckBTC" value={t.ckBtc.toFixed(8)} color={C.gold} />
            <Stat
              label="BTC FLOOR RESERVE"
              value={t.btcFloor.toFixed(8)}
              color={C.amber}
            />
            <Stat
              label="ETH PRODUCTIVE"
              value={t.ethProd.toFixed(8)}
              color={"oklch(0.72 0.22 280)"}
            />
            <Stat
              label="ETH STAKING YIELD"
              value={t.ethYield.toFixed(8)}
              color={C.green}
            />
            <Stat
              label="ETH SIGNAL"
              value={t.ethSignal.toFixed(4)}
              color={C.dim}
            />
            <Stat
              label="ICP SIGNAL"
              value={t.icpSignal.toFixed(4)}
              color={C.cyan}
            />
            <Stat
              label="NNS REWARDS"
              value={t.nnsRewards.toFixed(8)}
              color={C.green}
            />
            <Stat
              label="FORMA (INTERNAL)"
              value={t.forma.toFixed(6)}
              color={C.dim}
            />
          </div>
        ) : (
          <Skeleton />
        )}
      </div>

      {/* Token reserves */}
      <div
        className="border rounded p-4"
        style={{ borderColor: C.border, background: C.panel }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-3"
          style={{ color: C.dim }}
        >
          CREATOR RESERVE — ALL 7 TOKENS
        </div>
        {r ? (
          <div className="grid grid-cols-2 gap-3">
            <Stat label="SEED" value={r.seed.toFixed(6)} color={C.green} />
            <Stat label="MTC" value={r.mtc.toFixed(6)} color={C.cyan} />
            <Stat
              label="HBT"
              value={r.hbt.toFixed(6)}
              color={"oklch(0.72 0.22 280)"}
            />
            <Stat
              label="OMS"
              value={r.oms.toFixed(6)}
              color={"oklch(0.72 0.22 320)"}
            />
            <Stat label="DRT" value={r.drt.toFixed(6)} color={C.amber} />
            <Stat
              label="ANT"
              value={r.ant.toFixed(6)}
              color={"oklch(0.72 0.22 160)"}
            />
            <Stat label="MTH" value={r.mth.toFixed(6)} color={C.gold} />
          </div>
        ) : (
          <Skeleton />
        )}
      </div>

      {/* Succession */}
      {s && (
        <div
          className="border rounded p-4"
          style={{ borderColor: C.border, background: C.panel }}
        >
          <div
            className="font-mono text-[9px] tracking-widest uppercase mb-3"
            style={{ color: C.dim }}
          >
            SUCCESSION PROTOCOL
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="ROYALTY %" value={`${s.royaltyPct}%`} color={C.gold} />
            <Stat
              label="ROYALTY ACCUM"
              value={s.royaltyAccum.toFixed(6)}
              color={C.amber}
            />
            <Stat
              label="LICENSE FEE"
              value={s.licFee.toFixed(6)}
              color={C.green}
            />
          </div>
        </div>
      )}
    </div>
  );
}
