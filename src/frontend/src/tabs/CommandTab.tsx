import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useActor } from "../hooks/useActor";
import {
  useDischargeQuantumBattery,
  useMemoryTempleState,
  usePresenceCharge,
  useSetCreatorPrincipal,
} from "../hooks/useQueries";

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
};

interface LogEntry {
  ts: string;
  cmd: string;
  result: string;
  ok: boolean;
}

function now() {
  return new Date().toTimeString().slice(0, 8);
}

function CmdButton({
  label,
  desc,
  color,
  onClick,
  loading,
  warning,
}: {
  label: string;
  desc: string;
  color: string;
  onClick: () => void;
  loading: boolean;
  warning?: boolean;
}) {
  return (
    <div
      className="border rounded p-3 space-y-2"
      style={{
        borderColor: warning ? C.red : C.border,
        background: warning ? "oklch(0.65 0.25 25 / 0.05)" : C.panel,
      }}
    >
      <p
        className="font-mono text-[8px] leading-relaxed"
        style={{ color: C.dim }}
      >
        {desc}
      </p>
      <button
        type="button"
        disabled={loading}
        onClick={onClick}
        className="w-full font-mono text-[9px] tracking-widest uppercase px-3 py-2 border transition-all disabled:opacity-50"
        style={{
          borderColor: color,
          color,
          background: `${color.replace(")", " / 0.08)")}`,
        }}
      >
        {loading ? "EXECUTING…" : label}
      </button>
    </div>
  );
}

// ── Memory Temple Diagnostics Section ────────────────────────────────────────
function MemoryTempleDiagnostics() {
  const { data } = useMemoryTempleState();

  const val = (v: string | number | undefined, decimals?: number): string => {
    if (v === undefined || v === null) return "---";
    if (typeof v === "number" && decimals !== undefined)
      return v.toFixed(decimals);
    return String(v);
  };

  const rows: Array<{ label: string; value: string; color: string }> = [
    {
      label: "EPISODIC",
      value: data ? String(data.episodic_count) : "---",
      color: C.cyan,
    },
    {
      label: "SEMANTIC",
      value: data ? String(data.semantic_count) : "---",
      color: "oklch(0.72 0.22 280)",
    },
    {
      label: "DOCTRINE",
      value: data ? String(data.doctrine_count) : "---",
      color: C.gold,
    },
    {
      label: "MISSION",
      value: data ? String(data.mission_count) : "---",
      color: C.red,
    },
    {
      label: "PEDESTAL PHASE SUM",
      value: val(data?.pedestal_phase_sum, 4),
      color: C.cyan,
    },
    {
      label: "ANALYST QUEUE",
      value: data ? `${data.analyst_queue.length} items` : "---",
      color: "oklch(0.72 0.22 280)",
    },
    {
      label: "MEMORY COHERENCE",
      value: val(data?.memory_coherence, 4),
      color: C.green,
    },
    {
      label: "RETRIEVAL BIAS",
      value: data ? data.current_retrieval_bias.toUpperCase() : "---",
      color: C.gold,
    },
  ];

  return (
    <div
      className="border rounded p-3 space-y-2"
      style={{ borderColor: C.border, background: C.panel }}
      data-ocid="command.memory-temple.section"
    >
      {/* Heading + separator */}
      <div className="flex items-center gap-3">
        <span
          className="font-mono text-[9px] tracking-[0.2em] font-bold uppercase"
          style={{ color: C.gold }}
        >
          MEMORY TEMPLE
        </span>
        <div
          className="flex-1 h-px"
          style={{ background: "oklch(0.18 0.04 255)" }}
        />
      </div>

      {/* Stat rows */}
      <div className="space-y-1">
        {rows.map(({ label, value, color }) => (
          <div key={label} className="flex justify-between items-baseline">
            <span
              className="font-mono text-[7.5px] tracking-[0.12em]"
              style={{ color: C.dim }}
            >
              {label}
            </span>
            <span
              className="font-mono text-[8.5px] font-bold"
              style={{ color }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CommandTab({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [log, setLog] = useState<LogEntry[]>([]);
  const [threat, setThreat] = useState(0.5);
  const [novelty, setNovelty] = useState(0.5);
  const [embodiment, setEmbodiment] = useState(0.5);
  const [social, setSocial] = useState(0.5);
  const [btcPrice, setBtcPrice] = useState(65000);
  const [ethPrice, setEthPrice] = useState(3200);
  const [icpPrice, setIcpPrice] = useState(12);

  const addLog = (cmd: string, result: string, ok: boolean) => {
    setLog((prev) => [{ ts: now(), cmd, result, ok }, ...prev].slice(0, 50));
  };

  const { actor } = useActor();

  const presenceCharge = usePresenceCharge();
  const dischargeQ = useDischargeQuantumBattery();
  const setCreator = useSetCreatorPrincipal();

  const injectPerceptionMut = useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await (actor as any).injectPerception(
        threat,
        novelty,
        embodiment,
        social,
      );
    },
    onSuccess: () =>
      addLog(
        "INJECT_PERCEPTION",
        `T:${threat.toFixed(2)} N:${novelty.toFixed(2)} E:${embodiment.toFixed(2)} S:${social.toFixed(2)}`,
        true,
      ),
    onError: (e: Error) => addLog("INJECT_PERCEPTION", e.message, false),
  });

  const setTreasurySigMut = useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await (actor as any).setTreasurySignals(btcPrice, ethPrice, icpPrice);
    },
    onSuccess: () =>
      addLog(
        "SET_TREASURY_SIGNALS",
        `BTC:${btcPrice} ETH:${ethPrice} ICP:${icpPrice}`,
        true,
      ),
    onError: (e: Error) => addLog("SET_TREASURY_SIGNALS", e.message, false),
  });

  if (!isLoggedIn) {
    return (
      <div
        className="h-full flex flex-col items-center justify-center gap-4"
        style={{ background: C.bg }}
      >
        <div
          className="font-mono text-[48px]"
          style={{ color: "oklch(0.18 0.05 265)" }}
        >
          ψ
        </div>
        <div
          className="font-mono text-[11px] tracking-widest uppercase"
          style={{ color: C.dim }}
        >
          CREATOR AUTHENTICATION REQUIRED
        </div>
        <div
          className="font-mono text-[9px] text-center max-w-xs"
          style={{ color: "oklch(0.3 0.04 220)" }}
        >
          Use the LOGIN button in the header to authenticate with Internet
          Identity and access the Command Terminal.
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4" style={{ background: C.bg }}>
      <div className="mb-4">
        <h2
          className="font-mono text-[11px] tracking-widest uppercase font-bold"
          style={{ color: C.gold }}
        >
          ψ CREATOR COMMAND TERMINAL
        </h2>
        <p
          className="font-mono text-[9px] tracking-widest mt-1"
          style={{ color: C.dim }}
        >
          DIRECT ORGANISM CONTROL — ALL ACTIONS AUTHENTICATED AND LOGGED
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* LEFT — Commands */}
        <div className="space-y-3">
          <div
            className="font-mono text-[9px] tracking-widest uppercase"
            style={{ color: C.dim }}
          >
            COMMANDS
          </div>

          {/* Presence Charge */}
          <CmdButton
            label="PRESENCE CHARGE"
            desc="Activates SOVEREIGN mode. Quantum battery charges at 10× for 100 beats."
            color={C.gold}
            loading={presenceCharge.isPending}
            onClick={() => {
              presenceCharge.mutate(undefined, {
                onSuccess: () =>
                  addLog(
                    "PRESENCE_CHARGE",
                    "SOVEREIGN MODE ACTIVATED · Quantum battery at 10× charge",
                    true,
                  ),
                onError: (e: Error) =>
                  addLog("PRESENCE_CHARGE", e.message, false),
              });
            }}
          />

          {/* Discharge Quantum Battery */}
          <CmdButton
            label="DISCHARGE QUANTUM BATTERY"
            desc="Sweeps full quantum reserve balance into creator MTH reserve in one beat."
            color={C.cyan}
            loading={dischargeQ.isPending}
            onClick={() => {
              dischargeQ.mutate(undefined, {
                onSuccess: (amount) =>
                  addLog(
                    "DISCHARGE_QUANTUM",
                    `DISCHARGE COMPLETE · ${(amount as number)?.toFixed?.(6) ?? "?"} MTH routed to creator reserve`,
                    true,
                  ),
                onError: (e: Error) =>
                  addLog("DISCHARGE_QUANTUM", e.message, false),
              });
            }}
          />

          {/* Inject Perception */}
          <div
            className="border rounded p-3 space-y-3"
            style={{ borderColor: C.border, background: C.panel }}
          >
            <div
              className="font-mono text-[8px] tracking-widest uppercase"
              style={{ color: C.dim }}
            >
              INJECT PERCEPTION
            </div>
            {(
              [
                ["THREAT", threat, setThreat],
                ["NOVELTY", novelty, setNovelty],
                ["EMBODIMENT", embodiment, setEmbodiment],
                ["SOCIAL", social, setSocial],
              ] as [string, number, (v: number) => void][]
            ).map(([lbl, val, setter]) => (
              <div key={lbl} className="space-y-1">
                <div className="flex justify-between">
                  <span
                    className="font-mono text-[8px]"
                    style={{ color: C.dim }}
                  >
                    {lbl}
                  </span>
                  <span
                    className="font-mono text-[8px]"
                    style={{ color: C.cyan }}
                  >
                    {val.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={val}
                  onChange={(e) => setter(Number(e.target.value))}
                  className="w-full h-1 accent-cyan-400"
                  data-ocid={`command.${lbl.toLowerCase()}.input`}
                />
              </div>
            ))}
            <button
              type="button"
              disabled={injectPerceptionMut.isPending}
              onClick={() => injectPerceptionMut.mutate()}
              className="w-full font-mono text-[9px] tracking-widest uppercase px-3 py-2 border transition-all disabled:opacity-50"
              style={{
                borderColor: C.cyan,
                color: C.cyan,
                background: "oklch(0.72 0.22 195 / 0.08)",
              }}
              data-ocid="command.inject.button"
            >
              {injectPerceptionMut.isPending ? "INJECTING…" : "INJECT"}
            </button>
          </div>

          {/* Set Treasury Signals */}
          <div
            className="border rounded p-3 space-y-3"
            style={{ borderColor: C.border, background: C.panel }}
          >
            <div
              className="font-mono text-[8px] tracking-widest uppercase"
              style={{ color: C.dim }}
            >
              SET TREASURY SIGNALS
            </div>
            {(
              [
                ["BTC PRICE (USD)", btcPrice, setBtcPrice],
                ["ETH PRICE (USD)", ethPrice, setEthPrice],
                ["ICP PRICE (USD)", icpPrice, setIcpPrice],
              ] as [string, number, (v: number) => void][]
            ).map(([lbl, val, setter]) => (
              <div key={lbl} className="space-y-1">
                <div className="flex justify-between">
                  <span
                    className="font-mono text-[8px]"
                    style={{ color: C.dim }}
                  >
                    {lbl}
                  </span>
                  <span
                    className="font-mono text-[8px]"
                    style={{ color: C.gold }}
                  >
                    ${val.toLocaleString()}
                  </span>
                </div>
                <input
                  type="number"
                  value={val}
                  onChange={(e) => setter(Number(e.target.value))}
                  className="w-full font-mono text-[9px] px-2 py-1 border rounded bg-transparent"
                  style={{ borderColor: C.border, color: C.text }}
                  data-ocid={`command.${lbl.split(" ")[0].toLowerCase()}.input`}
                />
              </div>
            ))}
            <button
              type="button"
              disabled={setTreasurySigMut.isPending}
              onClick={() => setTreasurySigMut.mutate()}
              className="w-full font-mono text-[9px] tracking-widest uppercase px-3 py-2 border transition-all disabled:opacity-50"
              style={{
                borderColor: C.gold,
                color: C.gold,
                background: "oklch(0.82 0.22 80 / 0.08)",
              }}
              data-ocid="command.treasury.button"
            >
              {setTreasurySigMut.isPending ? "UPDATING…" : "SET SIGNALS"}
            </button>
          </div>

          {/* Lock Creator Identity */}
          <div
            className="border rounded p-3 space-y-2"
            style={{
              borderColor: C.red,
              background: "oklch(0.65 0.25 25 / 0.05)",
            }}
          >
            <div
              className="font-mono text-[8px] leading-relaxed"
              style={{ color: C.dim }}
            >
              One-time permanent principal binding. Cannot be undone.
            </div>
            <div
              className="font-mono text-[7px] tracking-widest p-2 rounded"
              style={{
                color: C.red,
                background: "oklch(0.65 0.25 25 / 0.1)",
                border: "1px solid oklch(0.65 0.25 25 / 0.3)",
              }}
            >
              ⚠ WARNING: This action permanently binds your Internet Identity
              principal to this canister. Irreversible.
            </div>
            <button
              type="button"
              disabled={setCreator.isPending}
              onClick={() => {
                setCreator.mutate(undefined, {
                  onSuccess: () =>
                    addLog(
                      "LOCK_CREATOR_IDENTITY",
                      "CREATOR IDENTITY LOCKED · Principal bound to canister",
                      true,
                    ),
                  onError: (e: Error) =>
                    addLog("LOCK_CREATOR_IDENTITY", e.message, false),
                });
              }}
              className="w-full font-mono text-[9px] tracking-widest uppercase px-3 py-2 border transition-all disabled:opacity-50"
              style={{
                borderColor: C.red,
                color: C.red,
                background: "oklch(0.65 0.25 25 / 0.08)",
              }}
              data-ocid="command.lock_identity.button"
            >
              {setCreator.isPending ? "LOCKING…" : "LOCK CREATOR IDENTITY"}
            </button>
          </div>

          {/* ── MEMORY TEMPLE DIAGNOSTICS ──────────────────────────────── */}
          <MemoryTempleDiagnostics />
        </div>

        {/* RIGHT — Response Log */}
        <div className="space-y-3">
          <div
            className="font-mono text-[9px] tracking-widest uppercase"
            style={{ color: C.dim }}
          >
            RESPONSE LOG
          </div>
          <div
            className="border rounded p-3 h-96 md:h-full overflow-y-auto space-y-1"
            style={{ borderColor: C.border, background: C.panel }}
            data-ocid="command.log.panel"
          >
            {log.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <span
                  className="font-mono text-[9px] tracking-widest"
                  style={{ color: "oklch(0.22 0.04 255)" }}
                >
                  AWAITING COMMANDS…
                </span>
              </div>
            )}
            {log.map((entry, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: log entries
                key={i}
                className="font-mono text-[8px] leading-relaxed border-b py-1"
                style={{ borderColor: "oklch(0.15 0.03 255)" }}
              >
                <span style={{ color: C.dim }}>[{entry.ts}] </span>
                <span style={{ color: C.cyan }}>{entry.cmd}</span>
                <span style={{ color: C.dim }}> · </span>
                <span style={{ color: entry.ok ? C.green : C.red }}>
                  {entry.result}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
