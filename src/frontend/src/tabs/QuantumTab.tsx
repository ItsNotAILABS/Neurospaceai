import {
  useBehavioralMode,
  useDischargeQuantumBattery,
  useObservationYield,
  useQuantumBatteryState,
  useSubOrganismState,
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

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div
      className="w-full h-1.5 rounded-full"
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
      className="h-4 w-full rounded animate-pulse"
      style={{ background: "oklch(0.12 0.02 255)" }}
    />
  );
}

const MODES: Record<number, { label: string; color: string }> = {
  0: { label: "STANDARD", color: C.dim },
  1: { label: "OUTLAW", color: C.purple },
  2: { label: "OUTCAST", color: C.amber },
  3: { label: "EMERGENCY", color: C.red },
  4: { label: "SOVEREIGN", color: C.gold },
};

export default function QuantumTab({ isLoggedIn }: { isLoggedIn: boolean }) {
  const qbQ = useQuantumBatteryState();
  const soQ = useSubOrganismState();
  const oyQ = useObservationYield();
  const modeQ = useBehavioralMode();
  const discharge = useDischargeQuantumBattery();

  const qb = qbQ.data;
  const so = soQ.data;
  const oy = oyQ.data;
  const mode = modeQ.data;

  const modeInfo = mode ? (MODES[mode.mode] ?? MODES[0]) : MODES[0];

  return (
    <div
      className="h-full overflow-y-auto p-4 space-y-4"
      style={{ background: C.bg }}
    >
      {/* Behavioral mode */}
      <div
        className="border rounded p-3 flex items-center justify-between"
        style={{ borderColor: modeInfo.color, background: C.panel }}
      >
        <div>
          <div
            className="font-mono text-[8px] tracking-widest uppercase"
            style={{ color: C.dim }}
          >
            BEHAVIORAL MODE
          </div>
          <div
            className="font-mono text-[16px] font-bold"
            style={{ color: modeInfo.color }}
          >
            {mode?.modeName ?? "—"}
          </div>
        </div>
        {mode && (
          <div className="text-right">
            <div className="font-mono text-[8px]" style={{ color: C.dim }}>
              SINCE BEAT
            </div>
            <div className="font-mono text-[11px]" style={{ color: C.text }}>
              {Number(mode.startBeat).toLocaleString()}
            </div>
            <div className="font-mono text-[8px]" style={{ color: C.dim }}>
              EVENTS
            </div>
            <div className="font-mono text-[11px]" style={{ color: C.text }}>
              {mode.eventCount}
            </div>
          </div>
        )}
      </div>

      {/* Quantum battery */}
      <div
        className="border rounded p-4 space-y-3"
        style={{ borderColor: C.border, background: C.panel }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase"
          style={{ color: C.dim }}
        >
          QUANTUM BATTERY — STREAM 21
        </div>
        {qb ? (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="font-mono text-[8px]" style={{ color: C.dim }}>
                  BALANCE
                </div>
                <div
                  className="font-mono text-[14px] font-bold"
                  style={{ color: qb.locked ? C.dim : C.cyan }}
                >
                  {qb.balance.toFixed(6)}
                </div>
              </div>
              <div>
                <div className="font-mono text-[8px]" style={{ color: C.dim }}>
                  TOTAL EARNED
                </div>
                <div
                  className="font-mono text-[14px] font-bold"
                  style={{ color: C.gold }}
                >
                  {qb.totalEarned.toFixed(6)}
                </div>
              </div>
              <div>
                <div className="font-mono text-[8px]" style={{ color: C.dim }}>
                  STATUS
                </div>
                <div
                  className="font-mono text-[11px] font-bold"
                  style={{ color: qb.locked ? C.red : C.green }}
                >
                  {qb.locked ? "LOCKED" : "CHARGING"}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span
                  className="font-mono text-[8px] uppercase tracking-widest"
                  style={{ color: C.dim }}
                >
                  CHARGE LEVEL
                </span>
                <span
                  className="font-mono text-[9px]"
                  style={{ color: C.cyan }}
                >
                  {(qb.chargeRate * 100).toFixed(4)}%/beat
                </span>
              </div>
              <Bar
                value={
                  qb.balance / Math.max(qb.totalEarned || 0.001, qb.balance)
                }
                color={C.cyan}
              />
            </div>
            {qb.presence && (
              <div
                className="font-mono text-[9px] tracking-widest uppercase text-center py-1 rounded"
                style={{
                  color: C.gold,
                  background: "oklch(0.82 0.22 80 / 0.08)",
                  border: `1px solid ${C.gold}`,
                }}
              >
                PROPERTY OFFICER PRESENT — 10× CHARGE RATE ACTIVE
              </div>
            )}
            {isLoggedIn && !qb.locked && (
              <button
                type="button"
                onClick={() => discharge.mutate()}
                className="w-full font-mono text-[10px] tracking-widest uppercase py-2 border"
                style={{
                  border: `1px solid ${C.gold}`,
                  color: C.gold,
                  background: "oklch(0.82 0.22 80 / 0.06)",
                }}
              >
                {discharge.isPending
                  ? "DISCHARGING..."
                  : `DISCHARGE BATTERY → ${qb.balance.toFixed(4)} → CREATOR RESERVE`}
              </button>
            )}
          </>
        ) : (
          <Skeleton />
        )}
      </div>

      {/* Sub-organisms */}
      <div
        className="border rounded p-4 space-y-3"
        style={{ borderColor: C.border, background: C.panel }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-2"
          style={{ color: C.dim }}
        >
          SUB-ORGANISMS
        </div>
        {so ? (
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                {
                  label: "ARES",
                  active: so.aresActive,
                  urgency: so.aresUrgency,
                  events: so.aresEvents,
                  beat: so.aresLastBeat,
                  color: C.red,
                  desc: "Temporal Reversal",
                },
                {
                  label: "GAIA",
                  active: so.gaiaActive,
                  urgency: so.gaiaUrgency,
                  events: so.gaiaEvents,
                  beat: so.gaiaLastBeat,
                  color: C.green,
                  desc: "Repair Protocol",
                },
                {
                  label: "VULCAN",
                  active: so.vulcanActive,
                  urgency: so.vulcanUrgency,
                  events: so.vulcanEvents,
                  beat: so.vulcanLastBeat,
                  color: C.amber,
                  desc: "Fortification",
                },
                {
                  label: "SENTINEL",
                  active: so.sentActive,
                  urgency: so.sentUrgency,
                  events: so.sentEvents,
                  beat: so.sentLastBeat,
                  color: C.cyan,
                  desc: "Anomaly Watch",
                },
              ] as const
            ).map(({ label, active, urgency, events, beat, color, desc }) => (
              <div
                key={label}
                className="border rounded p-3 space-y-2"
                style={{
                  borderColor: active ? color : C.border,
                  background: active ? "oklch(0.09 0.015 265)" : C.panel,
                  boxShadow: active ? `0 0 12px ${color}30` : "none",
                }}
              >
                <div className="flex justify-between items-center">
                  <span
                    className="font-mono text-[10px] font-bold tracking-widest"
                    style={{ color: active ? color : C.dim }}
                  >
                    {label}
                  </span>
                  <span
                    className="font-mono text-[8px] tracking-widest"
                    style={{ color: active ? color : C.dim }}
                  >
                    {active ? "ACTIVE" : "STANDBY"}
                  </span>
                </div>
                <div
                  className="font-mono text-[7px] tracking-widest"
                  style={{ color: C.dim }}
                >
                  {desc}
                </div>
                <Bar value={urgency} color={color} />
                <div className="flex justify-between">
                  <span
                    className="font-mono text-[7px]"
                    style={{ color: C.dim }}
                  >
                    EVENTS: {events}
                  </span>
                  <span
                    className="font-mono text-[7px]"
                    style={{ color: C.dim }}
                  >
                    BEAT: {Number(beat).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Skeleton />
        )}
      </div>

      {/* Intelligence states */}
      {so && (
        <div
          className="border rounded p-3 grid grid-cols-2 gap-3"
          style={{ borderColor: C.border, background: C.panel }}
        >
          <div>
            <div
              className="font-mono text-[8px] uppercase tracking-widest mb-1"
              style={{ color: C.dim }}
            >
              SUPERPOSITION
            </div>
            <div
              className="font-mono text-[11px] font-bold"
              style={{ color: so.superPos ? C.cyan : C.dim }}
            >
              {so.superPos ? "ACTIVE — MULTI-PATH" : "COLLAPSED"}
            </div>
          </div>
          <div>
            <div
              className="font-mono text-[8px] uppercase tracking-widest mb-1"
              style={{ color: C.dim }}
            >
              TEMPORAL DILATION
            </div>
            <div
              className="font-mono text-[11px] font-bold"
              style={{ color: so.tempDilation ? C.amber : C.dim }}
            >
              {so.tempDilation ? "ACTIVE" : "STANDARD"}
            </div>
          </div>
        </div>
      )}

      {/* Observation yield */}
      <div
        className="border rounded p-4 space-y-2"
        style={{ borderColor: C.border, background: C.panel }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase"
          style={{ color: C.dim }}
        >
          MAXWELL'S DEMON — STREAM 22
        </div>
        {oy ? (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="font-mono text-[8px]" style={{ color: C.dim }}>
                LAST YIELD
              </div>
              <div
                className="font-mono text-[12px] font-bold"
                style={{ color: C.green }}
              >
                {oy.lastYield.toFixed(6)}
              </div>
            </div>
            <div>
              <div className="font-mono text-[8px]" style={{ color: C.dim }}>
                TOTAL YIELD
              </div>
              <div
                className="font-mono text-[12px] font-bold"
                style={{ color: C.gold }}
              >
                {oy.totalYield.toFixed(6)}
              </div>
            </div>
            <div>
              <div className="font-mono text-[8px]" style={{ color: C.dim }}>
                OBSERVATIONS
              </div>
              <div
                className="font-mono text-[12px] font-bold"
                style={{ color: C.cyan }}
              >
                {oy.totalCount.toLocaleString()}
              </div>
            </div>
          </div>
        ) : (
          <Skeleton />
        )}
        <p className="font-mono text-[8px]" style={{ color: C.dim }}>
          Organism earns SEED every time it correctly predicts the world.
          Intelligence compounds into money.
        </p>
      </div>
    </div>
  );
}
