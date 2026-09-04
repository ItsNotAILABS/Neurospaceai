import { useMemo, useState } from "react";
import {
  CLAIMS,
  SYMBOLS,
  compileSymbol,
  type EvidenceClass,
} from "../lib/neurospace/symbol-registry";

const FILTERS: Array<"all" | EvidenceClass> = [
  "all",
  "established",
  "model",
  "doctrine",
];

export default function SymbolRegistryTab() {
  const [filter, setFilter] = useState<"all" | EvidenceClass>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(SYMBOLS[0]?.id ?? "ORIGO");

  const visibleSymbols = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return SYMBOLS.filter((symbol) => {
      const matchesFilter = filter === "all" || symbol.evidenceClass === filter;
      const matchesQuery =
        !normalized ||
        [symbol.id, symbol.display, symbol.transliteration, symbol.meaning]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  const selected = SYMBOLS.find((symbol) => symbol.id === selectedId) ?? SYMBOLS[0];
  const compiled = selected ? compileSymbol(selected.id, ["workspace", "claim"]) : null;

  return (
    <section className="space-y-5 p-5" aria-labelledby="symbol-registry-title">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/70">
          Neurospace / Deep Lab
        </p>
        <h1 id="symbol-registry-title" className="mt-2 text-2xl font-semibold text-white">
          Symbol Registry
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          A shared vocabulary for Latin logic, Sanskrit rule systems, memory, and evidence.
          Symbols are typed so every workspace action can carry a legible receipt.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["symbols", SYMBOLS.length, "canonical identifiers"],
          ["claims", CLAIMS.length, "evidence-bearing claims"],
          ["classes", 3, "established · model · doctrine"],
        ].map(([label, value, caption]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div className="text-2xl font-semibold text-white">{value}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-cyan-200">{label}</div>
            <div className="mt-2 text-xs text-slate-400">{caption}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/20 p-4 md:flex-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search symbols, transliterations, meanings…"
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500"
        />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-lg border px-3 py-2 text-xs uppercase tracking-wider transition ${
                filter === item
                  ? "border-cyan-300/70 bg-cyan-300/15 text-cyan-100"
                  : "border-white/10 text-slate-400 hover:border-white/30"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="grid gap-3 sm:grid-cols-2">
          {visibleSymbols.map((symbol) => (
            <button
              key={symbol.id}
              type="button"
              onClick={() => setSelectedId(symbol.id)}
              className={`rounded-xl border p-4 text-left transition ${
                selected?.id === symbol.id
                  ? "border-cyan-300/60 bg-cyan-300/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/25"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-2xl text-white">{symbol.display}</span>
                <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-wider text-cyan-200">
                  {symbol.evidenceClass}
                </span>
              </div>
              <div className="mt-3 font-mono text-xs text-cyan-100">{symbol.id}</div>
              <div className="mt-1 text-xs text-slate-400">{symbol.transliteration}</div>
              <p className="mt-3 text-sm leading-5 text-slate-300">{symbol.meaning}</p>
            </button>
          ))}
        </div>

        {selected && (
          <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/[0.05] p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">Compiled receipt</div>
            <div className="mt-4 text-4xl text-white">{selected.display}</div>
            <div className="mt-2 font-mono text-sm text-cyan-100">{compiled?.expression}</div>
            <dl className="mt-6 space-y-3 text-sm">
              <div><dt className="text-slate-500">Language</dt><dd className="text-slate-200">{selected.language}</dd></div>
              <div><dt className="text-slate-500">Category</dt><dd className="text-slate-200">{selected.category}</dd></div>
              <div><dt className="text-slate-500">Operator</dt><dd className="text-slate-200">{selected.operator}</dd></div>
              <div><dt className="text-slate-500">Source</dt><dd className="text-slate-200">{selected.source}</dd></div>
            </dl>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-4 text-xs uppercase tracking-[0.22em] text-cyan-200/70">Claim ledger</div>
        <div className="space-y-3">
          {CLAIMS.map((claim) => (
            <div key={claim.id} className="flex flex-col gap-2 border-t border-white/10 pt-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="font-mono text-xs text-cyan-100">{claim.id}</div>
                <div className="mt-1 text-sm text-white">{claim.statement}</div>
              </div>
              <span className="shrink-0 rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-wider text-slate-400">
                {claim.evidenceClass}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
