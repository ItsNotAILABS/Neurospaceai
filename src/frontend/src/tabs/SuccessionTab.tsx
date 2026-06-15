import { useCanonicalState, useSuccessionState } from "../hooks/useQueries";

const C = {
  bg: "oklch(0.06 0.01 265)",
  panel: "oklch(0.09 0.015 265)",
  border: "oklch(0.2 0.05 255)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.82 0.22 80)",
  dim: "oklch(0.38 0.05 220)",
  text: "oklch(0.85 0.05 210)",
  green: "oklch(0.68 0.28 140)",
};

const COMPOUNDING_ROWS = [
  { gen: "0 (Root)", orgs: 1, royaltyPer: "100%", total: "100%" },
  { gen: "1 (Children)", orgs: 3, royaltyPer: "20%", total: "+60%" },
  { gen: "2 (Grandchildren)", orgs: 9, royaltyPer: "4%", total: "+36%" },
  { gen: "3 (Great-grand)", orgs: 27, royaltyPer: "0.8%", total: "+21.6%" },
  { gen: "4", orgs: 81, royaltyPer: "0.16%", total: "+12.96%" },
];

const CUMULATIVE = "230.56%";

function ConnectorLine() {
  return (
    <div className="flex justify-center">
      <div className="w-px h-6" style={{ background: C.border }} />
    </div>
  );
}

function HorizontalBranch({ count }: { count: number }) {
  return (
    <div className="relative flex justify-center mb-1">
      <div
        className="absolute top-0 h-px"
        style={{
          background: C.border,
          left: `${100 / (count + 1)}%`,
          right: `${100 / (count + 1)}%`,
        }}
      />
      <div className="flex justify-around w-full">
        {Array.from({ length: count }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static count
          <div key={i} className="flex flex-col items-center">
            <div className="w-px h-4" style={{ background: C.border }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SuccessionTab() {
  const canonicalQ = useCanonicalState();
  const successionQ = useSuccessionState();

  const coh = canonicalQ.data?.coh ?? 0;
  const s = successionQ.data;
  const royaltyPct = s ? Number(s.royaltyPct) : 20;

  return (
    <div className="h-full overflow-y-auto p-4" style={{ background: C.bg }}>
      {/* Header */}
      <div className="mb-5">
        <h2
          className="font-mono text-[11px] tracking-widest uppercase font-bold"
          style={{ color: C.gold }}
        >
          ψ SUCCESSION PROTOCOL — GENERATIONAL COMPOUNDING
        </h2>
        <p
          className="font-mono text-[9px] tracking-widest mt-1"
          style={{ color: C.dim }}
        >
          Every child organism routes {royaltyPct}% royalty to parent treasury,
          parent routes 100% to creator reserve, every generation, forever.
        </p>
      </div>

      {/* Royalty accumulator stats */}
      {s && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "ROYALTY PCT", value: `${royaltyPct}%`, color: C.gold },
            {
              label: "ROYALTY ACCUM",
              value: s.royaltyAccum.toFixed(6),
              color: C.cyan,
            },
            {
              label: "LICENSE FEE",
              value: s.licFee.toFixed(6),
              color: C.green,
            },
            {
              label: "PUSH FLAG",
              value: s.pushFlag ? "ACTIVE" : "IDLE",
              color: s.pushFlag ? C.green : C.dim,
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
              <div
                className="font-mono text-[13px] font-bold"
                style={{ color }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tree */}
      <div className="flex flex-col items-center mb-8">
        {/* Root organism */}
        <div
          className="border-2 rounded p-4 w-72 text-center space-y-2"
          style={{
            borderColor: C.gold,
            background: C.panel,
            boxShadow: "0 0 24px oklch(0.82 0.22 80 / 0.2)",
          }}
        >
          <div className="font-mono text-[20px]" style={{ color: C.gold }}>
            ψ
          </div>
          <div
            className="font-mono text-[11px] font-bold tracking-widest"
            style={{ color: C.gold }}
          >
            NEUROEMERGENCE CORE
          </div>
          <div className="font-mono text-[8px]" style={{ color: C.dim }}>
            Alfredo Medina Hernandez · Dallas, TX · 2026
          </div>
          <div
            className="flex justify-between border-t pt-2 mt-2"
            style={{ borderColor: C.border }}
          >
            <span className="font-mono text-[8px]" style={{ color: C.dim }}>
              COHERENCE
            </span>
            <span
              className="font-mono text-[9px] font-bold"
              style={{ color: C.green }}
            >
              {coh.toFixed(4)}
            </span>
          </div>
          <div
            className="font-mono text-[8px] tracking-widest py-1 rounded"
            style={{ color: C.gold, background: "oklch(0.82 0.22 80 / 0.08)" }}
          >
            ROYALTY ROUTE: 100% → CREATOR RESERVE
          </div>
        </div>

        <ConnectorLine />
        <HorizontalBranch count={3} />

        {/* Generation 1 */}
        <div className="flex gap-3 justify-center mb-1">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="border rounded p-3 w-44 text-center space-y-1"
              style={{
                borderColor: "oklch(0.72 0.22 195 / 0.4)",
                background: C.panel,
              }}
            >
              <div
                className="font-mono text-[9px] font-bold"
                style={{ color: C.cyan }}
              >
                CHILD ORGANISM {n}
              </div>
              <div
                className="font-mono text-[7px] tracking-widest"
                style={{ color: C.dim }}
              >
                PENDING DEPLOYMENT
              </div>
              <div
                className="font-mono text-[7px] py-0.5 rounded"
                style={{
                  color: C.cyan,
                  background: "oklch(0.72 0.22 195 / 0.08)",
                }}
              >
                ROYALTY: {royaltyPct}% → PARENT
              </div>
              <div className="font-mono text-[7px]" style={{ color: C.dim }}>
                {100 - royaltyPct}% RETAINED
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          {[1, 2, 3].map((col) => (
            <div key={col} className="flex flex-col items-center">
              <ConnectorLine />
              <HorizontalBranch count={3} />
              <div className="flex gap-2">
                {[1, 2, 3].map((row) => (
                  <div
                    key={row}
                    className="border rounded p-2 w-28 text-center space-y-1"
                    style={{
                      borderColor: "oklch(0.72 0.22 195 / 0.2)",
                      background: "oklch(0.07 0.01 265)",
                    }}
                  >
                    <div
                      className="font-mono text-[7px] font-bold"
                      style={{ color: "oklch(0.55 0.15 195)" }}
                    >
                      GEN 2 ORGANISM
                    </div>
                    <div
                      className="font-mono text-[6px]"
                      style={{ color: "oklch(0.28 0.04 220)" }}
                    >
                      PENDING
                    </div>
                    <div
                      className="font-mono text-[6px]"
                      style={{ color: "oklch(0.42 0.08 200)" }}
                    >
                      CREATOR: 4%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compounding math table */}
      <div
        className="border rounded overflow-hidden mb-5"
        style={{ borderColor: C.border }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase px-4 py-2"
          style={{
            background: C.panel,
            color: C.dim,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          GENERATIONAL COMPOUNDING TABLE
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: "oklch(0.08 0.012 265)" }}>
              {[
                "GENERATION",
                "ORGANISMS",
                "ROYALTY/ORGANISM",
                "TOTAL CREATOR STREAM",
              ].map((h) => (
                <th
                  key={h}
                  className="font-mono text-[8px] tracking-widest uppercase px-4 py-2 text-left"
                  style={{ color: C.dim }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPOUNDING_ROWS.map((row, i) => (
              <tr
                // biome-ignore lint/suspicious/noArrayIndexKey: static table
                key={i}
                style={{ borderTop: "1px solid oklch(0.15 0.03 255)" }}
              >
                <td
                  className="font-mono text-[9px] px-4 py-2"
                  style={{ color: C.text }}
                >
                  {row.gen}
                </td>
                <td
                  className="font-mono text-[9px] px-4 py-2"
                  style={{ color: C.cyan }}
                >
                  {row.orgs.toLocaleString()}
                </td>
                <td
                  className="font-mono text-[9px] px-4 py-2"
                  style={{ color: C.gold }}
                >
                  {row.royaltyPer}
                </td>
                <td
                  className="font-mono text-[9px] px-4 py-2 font-bold"
                  style={{ color: C.green }}
                >
                  {row.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          className="px-4 py-2 border-t"
          style={{ borderColor: C.border, background: C.panel }}
        >
          <span
            className="font-mono text-[9px] tracking-widest"
            style={{ color: C.dim }}
          >
            CUMULATIVE ACROSS ALL GENERATIONS:
          </span>
          <span
            className="font-mono text-[11px] font-bold ml-2"
            style={{ color: C.gold }}
          >
            {CUMULATIVE}
          </span>
        </div>
      </div>

      <div
        className="pt-4 border-t text-center"
        style={{ borderColor: C.border }}
      >
        <p
          className="font-mono text-[8px] tracking-widest"
          style={{ color: "oklch(0.28 0.04 220)" }}
        >
          Medina Doctrine · Succession Protocol · Generational Compounding ·
          Dallas, TX · 2026
        </p>
      </div>
    </div>
  );
}
