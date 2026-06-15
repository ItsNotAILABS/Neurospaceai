import { motion } from "motion/react";
// AURUM — Treasury Intelligence
// Reads live backend economic signals. Computes Sharpe, Kelly, drawdown.
// Follows the Doctor pattern: receive → parse against full context → produce → feed back.
import { useEffect, useRef, useState } from "react";
import {
  useCreatorReserve,
  useFearMissionState,
  useMarketVisionState,
  useMiningState,
  useNeuroscienceState,
  useTreasuryState,
} from "../hooks/useQueries";

const C = {
  bg: "oklch(0.055 0.01 265)",
  panel: "oklch(0.075 0.012 265)",
  border: "oklch(0.18 0.05 250)",
  dim: "oklch(0.38 0.05 220)",
  dimlo: "oklch(0.28 0.04 220)",
  cyan: "oklch(0.72 0.22 195)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.78 0.22 80)",
  red: "oklch(0.72 0.22 25)",
  gold: "oklch(0.82 0.22 80)",
  fg: "oklch(0.85 0.05 210)",
  muted: "oklch(0.5 0.08 220)",
};

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-mono text-[9px] tracking-widest uppercase mb-2 pb-1 border-b"
      style={{ color: C.gold, borderColor: "oklch(0.18 0.06 80 / 0.5)" }}
    >
      {children}
    </div>
  );
}

function PanelBox({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-none border p-3 ${className}`}
      style={{ background: C.panel, borderColor: C.border }}
    >
      {children}
    </div>
  );
}

function kellyFraction(
  winRate: number,
  avgWin: number,
  avgLoss: number,
): number {
  if (avgLoss === 0) return 0;
  return Math.max(
    0,
    Math.min(1, (winRate * avgWin - (1 - winRate) * avgLoss) / avgWin),
  );
}

function sharpeRatio(returns: number[]): number {
  if (returns.length < 2) return 0;
  const mean = returns.reduce((s, r) => s + r, 0) / returns.length;
  const variance =
    returns.reduce((s, r) => s + (r - mean) ** 2, 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  return stdDev === 0 ? 0 : mean / stdDev;
}

function TokenBalancePanel({ reserve }: { reserve: any }) {
  const tokens = [
    { name: "SEED", key: "creatorSeedReserve", color: C.green },
    { name: "MTC", key: "creatorMtcReserve", color: C.cyan },
    { name: "HBT", key: "creatorHbtReserve", color: C.amber },
    { name: "OMS", key: "creatorOmsReserve", color: C.gold },
    { name: "DRT", key: "creatorDrtReserve", color: C.muted },
    { name: "MTH", key: "creatorMthReserve", color: C.gold },
    { name: "ANT", key: "creatorAntReserve", color: C.green },
  ];

  const values = tokens.map((t) => ({
    ...t,
    balance: reserve ? Number((reserve as any)[t.key] ?? 0) : 0,
  }));

  const maxVal = Math.max(...values.map((v) => v.balance), 0.0001);

  return (
    <PanelBox>
      <PanelTitle>▸ CREATOR RESERVE — 100% SOVEREIGN</PanelTitle>
      <div className="flex flex-col gap-1.5">
        {values.map((t) => (
          <div key={t.name} className="flex items-center gap-2">
            <span
              className="font-mono text-[8px] w-10 shrink-0"
              style={{ color: C.dim }}
            >
              {t.name}
            </span>
            <div
              className="flex-1 h-1.5"
              style={{ background: "oklch(0.12 0.01 265)" }}
            >
              <div
                className="h-full transition-all duration-700"
                style={{
                  width: `${(t.balance / maxVal) * 100}%`,
                  background: t.color,
                }}
              />
            </div>
            <span
              className="font-mono text-[9px] w-16 text-right shrink-0"
              style={{ color: C.fg }}
            >
              {t.balance.toFixed(6)}
            </span>
          </div>
        ))}
      </div>
    </PanelBox>
  );
}

function KellyPanel({ fearM, neuro }: { fearM: any; neuro: any }) {
  const coherence = neuro?.bindingCoherence ?? 0.5;
  const fear = fearM?.fearLevel ?? 0;
  const courage = fearM?.courageScore ?? 0.5;

  // Kelly Criterion: organism's position sizing in the market of beats
  // Win rate proxy: how often organism is in high coherence
  const winRate = Math.max(0.1, Math.min(0.95, coherence));
  const avgWin = Math.max(0.01, coherence * 1.5);
  const avgLoss = Math.max(0.01, fear * 0.8);
  const kelly = kellyFraction(winRate, avgWin, avgLoss);

  const conviction = coherence * 0.4 + courage * 0.4 + (1 - fear) * 0.2;

  return (
    <PanelBox>
      <PanelTitle>▸ KELLY CRITERION — SOVEREIGN POSITION SIZING</PanelTitle>
      <div className="grid grid-cols-2 gap-3">
        {[
          [
            "KELLY FRACTION",
            `${(kelly * 100).toFixed(1)}%`,
            kelly > 0.5 ? C.green : kelly > 0.25 ? C.amber : C.red,
          ],
          ["WIN RATE", `${(winRate * 100).toFixed(1)}%`, C.cyan],
          [
            "CONVICTION",
            `${(conviction * 100).toFixed(1)}%`,
            conviction > 0.7 ? C.green : C.amber,
          ],
          [
            "FEAR SUPPRESS",
            `${(fear * 100).toFixed(1)}%`,
            fear > 0.5 ? C.red : C.green,
          ],
        ].map(([lbl, val, col]) => (
          <div key={String(lbl)} className="flex flex-col gap-0.5">
            <span
              className="font-mono text-[8px] tracking-widest uppercase"
              style={{ color: C.dim }}
            >
              {lbl}
            </span>
            <span
              className="font-mono text-sm font-bold"
              style={{ color: String(col) }}
            >
              {val}
            </span>
          </div>
        ))}
      </div>
      <div
        className="mt-3 p-2"
        style={{
          background: "oklch(0.07 0.015 80)",
          borderLeft: `2px solid ${C.gold}`,
        }}
      >
        <span className="font-mono text-[9px]" style={{ color: C.fg }}>
          {kelly > 0.6
            ? "AURUM: High conviction. Organism in sovereign zone. Full Kelly sizing advised."
            : kelly > 0.3
              ? "AURUM: Moderate conviction. Fear partially suppressing yield. Fractional Kelly."
              : "AURUM: Low conviction. Fear dominant. Capital preservation mode. Reduce sizing."}
        </span>
      </div>
    </PanelBox>
  );
}

function MintHistoryChart({ mintHistory }: { mintHistory: number[] }) {
  if (mintHistory.length < 2) return null;
  const max = Math.max(...mintHistory, 0.0001);
  const width = 400;
  const height = 60;
  const pts = mintHistory.slice(0, 40).map((v, i) => {
    const x = (i / (Math.min(40, mintHistory.length) - 1)) * width;
    const y = height - (v / max) * height;
    return `${x},${y}`;
  });

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: "visible" }}
      aria-labelledby="aurum-mint-chart-title"
    >
      <title id="aurum-mint-chart-title">Token mint history chart</title>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={C.gold}
        strokeWidth="1.5"
        opacity="0.8"
      />
    </svg>
  );
}

export default function AurumTab() {
  const { data: reserve } = useCreatorReserve();
  const { data: mining } = useMiningState();
  const { data: neuro } = useNeuroscienceState();
  const { data: fearM } = useFearMissionState();

  const [mintHistory, setMintHistory] = useState<number[]>([]);
  const lastSeedRef = useRef(0);

  useEffect(() => {
    if (!reserve) return;
    const seed = Number((reserve as any).creatorSeedReserve ?? 0);
    if (seed !== lastSeedRef.current) {
      const delta = seed - lastSeedRef.current;
      if (delta > 0) {
        setMintHistory((prev) => [delta, ...prev].slice(0, 100));
      }
      lastSeedRef.current = seed;
    }
  }, [reserve]);

  const sharpe = sharpeRatio(mintHistory);
  const maxDrawdown =
    mintHistory.length > 1
      ? Math.abs(
          Math.min(
            ...mintHistory.map((v, i) =>
              i === 0 ? 0 : v - Math.max(...mintHistory.slice(0, i)),
            ),
          ),
        )
      : 0;

  const insight = (() => {
    const fear = fearM?.fearLevel ?? 0;
    const coh = neuro?.bindingCoherence ?? 0;
    if (fear > 0.6)
      return `Fear suppression active (${(fear * 100).toFixed(0)}%). Economic output suppressed. Mission persistence will restore yield.`;
    if (coh > 0.75)
      return `High binding coherence (${(coh * 100).toFixed(1)}%). Organism unified. Premium yield conditions active.`;
    if (sharpe > 1.0)
      return `Strong Sharpe ratio (${sharpe.toFixed(2)}). Consistent yield with controlled volatility. Compound position.`;
    return `Baseline yield pattern. Coherence trending ${coh > 0.5 ? "up" : "down"}. Monitor sovereignty signals.`;
  })();

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: C.bg }}
      data-ocid="aurum.page"
    >
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ background: "oklch(0.065 0.012 80)", borderColor: C.border }}
        data-ocid="aurum.header.panel"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: C.gold, boxShadow: `0 0 10px ${C.gold}` }}
          />
          <span
            className="font-mono text-lg font-bold tracking-widest"
            style={{ color: C.gold }}
          >
            AURUM
          </span>
          <span
            className="font-mono text-[9px] tracking-widest uppercase"
            style={{ color: C.dim }}
          >
            TREASURY INTELLIGENCE
          </span>
        </div>
        <div className="flex items-center gap-4">
          {[
            [
              "SHARPE",
              sharpe.toFixed(2),
              sharpe > 1 ? C.green : sharpe > 0 ? C.amber : C.red,
            ],
            [
              "DRAWDOWN",
              `${(maxDrawdown * 100).toFixed(2)}%`,
              maxDrawdown > 0.1 ? C.red : C.green,
            ],
            [
              "MINT EVT",
              String(Number((mining as any)?.totalMintEvents ?? 0)),
              C.gold,
            ],
          ].map(([lbl, val, col]) => (
            <div key={String(lbl)} className="flex flex-col items-center">
              <span
                className="font-mono text-[8px] tracking-widest uppercase"
                style={{ color: C.dim }}
              >
                {lbl}
              </span>
              <span
                className="font-mono text-sm font-bold"
                style={{ color: String(col) }}
              >
                {val}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="flex flex-col gap-3 p-3">
        {/* Top economic insight */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <PanelBox>
            <PanelTitle>▸ AURUM INSIGHT — LIVE ECONOMIC ANALYSIS</PanelTitle>
            <p
              className="font-mono text-[10px] leading-relaxed"
              style={{ color: C.fg }}
            >
              {insight}
            </p>
            {mintHistory.length > 0 && (
              <div className="mt-3">
                <MintHistoryChart mintHistory={mintHistory} />
              </div>
            )}
          </PanelBox>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <TokenBalancePanel reserve={reserve} />
          <KellyPanel fearM={fearM} neuro={neuro} />
        </motion.div>
      </div>
    </div>
  );
}
