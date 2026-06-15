import { motion } from "motion/react";
import {
  useCreatorReserve,
  useSuccessionState,
  useTreasuryState,
  useVelaProjection,
} from "../hooks/useQueries";

const C = {
  panel: "oklch(0.075 0.012 265)",
  border: "oklch(0.18 0.05 250)",
  dim: "oklch(0.38 0.05 220)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.78 0.22 80)",
  green: "oklch(0.68 0.28 140)",
  emerald: "oklch(0.72 0.22 160)",
  muted: "oklch(0.5 0.08 220)",
  fg: "oklch(0.85 0.05 210)",
  btc: "oklch(0.78 0.22 55)",
  eth: "oklch(0.68 0.18 265)",
  icp: "oklch(0.72 0.22 300)",
};

const TOKEN_ROWS = [
  {
    key: "seed",
    label: "SEED",
    desc: "Formation Energy",
    color: "oklch(0.72 0.22 140)",
  },
  {
    key: "mtc",
    label: "MTC",
    desc: "Execution Proof",
    color: "oklch(0.72 0.22 195)",
  },
  {
    key: "hbt",
    label: "HBT",
    desc: "Learning Receipt",
    color: "oklch(0.72 0.22 240)",
  },
  {
    key: "oms",
    label: "OMS",
    desc: "Emergence Receipt",
    color: "oklch(0.78 0.22 80)",
  },
  {
    key: "drt",
    label: "DRT",
    desc: "Consequence Proof",
    color: "oklch(0.65 0.22 15)",
  },
  {
    key: "ant",
    label: "ANT",
    desc: "Continuity Proof",
    color: "oklch(0.72 0.22 165)",
  },
  {
    key: "mth",
    label: "MTH",
    desc: "Sovereignty (100M Hard Cap)",
    color: "oklch(0.78 0.22 55)",
  },
] as const;

function Stat({
  label,
  value,
  color,
  sub,
}: {
  label: string;
  value: string;
  color: string;
  sub?: string;
}) {
  return (
    <div
      className="p-2 border flex flex-col gap-0.5"
      style={{ background: "oklch(0.055 0.01 265)", borderColor: C.border }}
    >
      <span
        className="font-mono text-[7px] tracking-widest uppercase"
        style={{ color: C.dim }}
      >
        {label}
      </span>
      <span className="font-mono text-[12px] font-bold" style={{ color }}>
        {value}
      </span>
      {sub && (
        <span className="font-mono text-[7px]" style={{ color: C.dim }}>
          {sub}
        </span>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-mono text-[9px] tracking-widest uppercase mb-2 pb-1 border-b"
      style={{ color: C.gold, borderColor: "oklch(0.18 0.06 80 / 0.5)" }}
    >
      {children}
    </div>
  );
}

export function SovereignWealthPanel() {
  const { data: reserve, isLoading: rLoading } = useCreatorReserve();
  const { data: treasury, isLoading: tLoading } = useTreasuryState();
  const { data: succession } = useSuccessionState();
  const { data: vela } = useVelaProjection();

  const isLoading = rLoading || tLoading;

  return (
    <div className="flex flex-col gap-4" data-ocid="wealth.panel">
      {/* Creator Reserve */}
      <div
        className="rounded-none border p-3"
        style={{ background: C.panel, borderColor: C.border }}
      >
        <SectionTitle>◈ CREATOR RESERVE — 100% SOVEREIGN</SectionTitle>

        {isLoading && (
          <div className="py-4 text-center" data-ocid="wealth.loading_state">
            <span
              className="font-mono text-[8px] tracking-widest uppercase animate-pulse"
              style={{ color: C.muted }}
            >
              LOADING RESERVE LEDGER...
            </span>
          </div>
        )}

        {!isLoading && (
          <>
            <div className="flex flex-col gap-1 mb-3">
              {TOKEN_ROWS.map((t) => (
                <div key={t.key} className="flex items-center gap-2">
                  <span
                    className="font-mono text-[8px] font-bold w-8 shrink-0"
                    style={{ color: t.color }}
                  >
                    {t.label}
                  </span>
                  <span
                    className="font-mono text-[7px] w-32 shrink-0"
                    style={{ color: C.dim }}
                  >
                    {t.desc}
                  </span>
                  <div
                    className="flex-1 h-[3px] rounded-full overflow-hidden"
                    style={{ background: "oklch(0.12 0.02 265)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(100, ((reserve ? ((reserve as any)[t.key] as number) : 0) / (t.key === "mth" ? 100_000_000 : 10_000)) * 100)}%`,
                      }}
                      transition={{ duration: 0.7 }}
                      style={{ background: t.color }}
                    />
                  </div>
                  <span
                    className="font-mono text-[9px] font-bold w-20 shrink-0 text-right"
                    style={{ color: t.color }}
                  >
                    {reserve
                      ? ((reserve as any)[t.key] as number).toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                          },
                        )
                      : "—"}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Stat
                label="Total Reserve"
                value={
                  reserve
                    ? reserve.total.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })
                    : "—"
                }
                color={C.gold}
              />
              <Stat
                label="Master Accumulator"
                value={
                  reserve
                    ? reserve.masterAccum.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })
                    : "—"
                }
                color={C.cyan}
                sub={`Push count: ${reserve ? Number(reserve.pushCount) : 0}`}
              />
            </div>
          </>
        )}
      </div>

      {/* Treasury */}
      <div
        className="rounded-none border p-3"
        style={{ background: C.panel, borderColor: C.border }}
      >
        <SectionTitle>◈ SOVEREIGN TREASURY — REAL-WORLD ASSETS</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <Stat
            label="ckBTC Balance"
            value={treasury ? treasury.ckBtc.toFixed(8) : "—"}
            color={C.btc}
            sub="Hard floor"
          />
          <Stat
            label="BTC Floor Reserve"
            value={treasury ? treasury.btcFloor.toFixed(8) : "—"}
            color={C.btc}
          />
          <Stat
            label="ETH Productive"
            value={treasury ? treasury.ethProd.toFixed(6) : "—"}
            color={C.eth}
            sub="4% APY staking"
          />
          <Stat
            label="ETH Signal"
            value={treasury ? treasury.ethSignal.toFixed(4) : "—"}
            color={C.eth}
          />
          <Stat
            label="ICP Signal"
            value={treasury ? treasury.icpSignal.toFixed(4) : "—"}
            color={C.icp}
          />
          <Stat
            label="NNS Staking Rewards"
            value={treasury ? treasury.nnsRewards.toFixed(4) : "—"}
            color={C.icp}
            sub="15% APY"
          />
          <Stat
            label="ETH Yield"
            value={treasury ? treasury.ethYield.toFixed(6) : "—"}
            color={C.eth}
          />
          <Stat
            label="FORMA Balance"
            value={treasury ? treasury.forma.toFixed(2) : "—"}
            color={C.muted}
            sub="Internal fuel"
          />
          <Stat
            label="FORMA Circulation"
            value={treasury ? treasury.formaCirc.toFixed(2) : "—"}
            color={C.muted}
            sub="Metabolism"
          />
        </div>

        <div
          className="mt-3 p-2 border font-mono text-[8px] tracking-wide"
          style={{
            background: "oklch(0.055 0.015 140 / 0.3)",
            borderColor: "oklch(0.28 0.10 140 / 0.4)",
            color: C.emerald,
          }}
        >
          ◈ COGNITIVE SOVEREIGNTY LAW — Market signals never touch cognition.
          Treasury signals route to treasury layer only. The organism's mind is
          sovereign from financial noise.
        </div>
      </div>

      {/* Succession */}
      {succession && (
        <div
          className="rounded-none border p-3"
          style={{ background: C.panel, borderColor: C.border }}
        >
          <SectionTitle>
            ◈ SUCCESSION STATE — GENERATIONAL COMPOUNDING
          </SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Stat
              label="Royalty Pct"
              value={`${Number(succession.royaltyPct)}%`}
              color={C.gold}
              sub="Every generation"
            />
            <Stat
              label="Royalty Accum"
              value={succession.royaltyAccum.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
              color={C.cyan}
            />
            <Stat
              label="License Fee (SEED)"
              value={succession.licFee.toFixed(2)}
              color={C.emerald}
            />
            <Stat
              label="Push Flag"
              value={succession.pushFlag ? "ACTIVE" : "IDLE"}
              color={succession.pushFlag ? C.green : C.dim}
            />
          </div>
          {succession.parentHash > 0 && (
            <div className="mt-2 font-mono text-[7px]" style={{ color: C.dim }}>
              PARENT HASH: 0x
              {succession.parentHash
                .toString(16)
                .padStart(8, "0")
                .toUpperCase()}
            </div>
          )}
        </div>
      )}

      {/* VELA Projection */}
      {vela && vela.steps.length > 0 && (
        <div
          className="rounded-none border p-3"
          style={{ background: C.panel, borderColor: C.border }}
        >
          <div
            className="font-mono text-[9px] tracking-widest uppercase mb-2 pb-1 border-b flex items-center justify-between"
            style={{ color: C.cyan, borderColor: "oklch(0.18 0.06 195 / 0.5)" }}
          >
            <span>◈ VELA PROJECTION — 50-STEP FORESIGHT</span>
            <span
              style={{
                color: vela.divergence > 0.5 ? "oklch(0.72 0.22 25)" : C.dim,
                fontSize: "7px",
              }}
            >
              DIV: {(vela.divergence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-end gap-[2px] h-12">
            {vela.steps.slice(0, 50).map((v, i) => {
              const stepKey = `s${i}-${v.toFixed(4)}`;
              return (
                <motion.div
                  key={stepKey}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(4, Math.abs(v) * 100)}%` }}
                  transition={{ duration: 0.4, delay: i * 0.01 }}
                  className="flex-1 rounded-none"
                  style={{
                    background:
                      v > 0
                        ? `oklch(0.68 0.22 160 / ${0.4 + Math.abs(v) * 0.6})`
                        : `oklch(0.65 0.22 25 / ${0.4 + Math.abs(v) * 0.6})`,
                    minWidth: "1px",
                  }}
                />
              );
            })}
          </div>
          <div
            className="flex justify-between font-mono text-[7px] mt-1"
            style={{ color: C.dim }}
          >
            <span>BEAT +1</span>
            <span>BEAT +50</span>
          </div>
        </div>
      )}
    </div>
  );
}
