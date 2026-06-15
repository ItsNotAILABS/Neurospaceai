import { motion } from "motion/react";
import { useNeuroChem } from "../hooks/useQueries";

const C = {
  panel: "oklch(0.075 0.012 265)",
  border: "oklch(0.18 0.05 250)",
  dim: "oklch(0.38 0.05 220)",
  cyan: "oklch(0.72 0.22 195)",
  muted: "oklch(0.5 0.08 220)",
};

const CHEMS: Array<{
  key: string;
  label: string;
  fullName: string;
  color: string;
  type: "excitatory" | "inhibitory" | "stress" | "social";
}> = [
  {
    key: "dpa",
    label: "DPA",
    fullName: "Dopamine",
    color: "oklch(0.78 0.26 55)",
    type: "excitatory",
  },
  {
    key: "ser",
    label: "SER",
    fullName: "Serotonin",
    color: "oklch(0.72 0.20 195)",
    type: "inhibitory",
  },
  {
    key: "nor",
    label: "NOR",
    fullName: "Norepinephrine",
    color: "oklch(0.72 0.25 30)",
    type: "excitatory",
  },
  {
    key: "ach",
    label: "ACH",
    fullName: "Acetylcholine",
    color: "oklch(0.72 0.22 160)",
    type: "excitatory",
  },
  {
    key: "gab",
    label: "GAB",
    fullName: "GABA",
    color: "oklch(0.68 0.18 240)",
    type: "inhibitory",
  },
  {
    key: "glu",
    label: "GLU",
    fullName: "Glutamate",
    color: "oklch(0.75 0.25 45)",
    type: "excitatory",
  },
  {
    key: "cor",
    label: "COR",
    fullName: "Cortisol",
    color: "oklch(0.65 0.25 15)",
    type: "stress",
  },
  {
    key: "oxt",
    label: "OXT",
    fullName: "Oxytocin",
    color: "oklch(0.78 0.22 320)",
    type: "social",
  },
];

export function NeuroChemPanel() {
  const { data, isLoading } = useNeuroChem();

  return (
    <div
      className="rounded-none border p-3"
      style={{ background: C.panel, borderColor: C.border }}
      data-ocid="neurochem.panel"
    >
      <div
        className="font-mono text-[9px] tracking-widest uppercase mb-3 pb-1 border-b flex items-center justify-between"
        style={{
          color: "oklch(0.72 0.22 160)",
          borderColor: "oklch(0.18 0.06 160 / 0.5)",
        }}
      >
        <span>◈ NEURO-CHEM — Internal Node 2</span>
        <span style={{ color: C.dim, fontSize: "7px" }}>
          8 NEUROTRANSMITTERS
        </span>
      </div>

      {isLoading && (
        <div className="py-4 text-center" data-ocid="neurochem.loading_state">
          <span
            className="font-mono text-[8px] tracking-widest uppercase animate-pulse"
            style={{ color: C.muted }}
          >
            SCANNING NEURO-CHEM...
          </span>
        </div>
      )}

      {!isLoading && (
        <div className="flex flex-col gap-2">
          {CHEMS.map((chem) => {
            const val = data ? ((data as any)[chem.key] as number) : 0;
            const pct = Math.max(0, Math.min(1, val)) * 100;
            return (
              <div key={chem.key} className="flex items-center gap-2">
                <div
                  className="font-mono text-[8px] w-8 shrink-0 text-right"
                  style={{ color: chem.color }}
                >
                  {chem.label}
                </div>
                <div
                  className="font-mono text-[7px] w-24 shrink-0"
                  style={{ color: C.dim }}
                >
                  {chem.fullName}
                </div>
                <div
                  className="flex-1 h-[5px] rounded-full overflow-hidden"
                  style={{ background: "oklch(0.12 0.02 265)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{
                      background: chem.color,
                      boxShadow: `0 0 4px ${chem.color}80`,
                    }}
                  />
                </div>
                <div
                  className="font-mono text-[8px] w-8 shrink-0 text-right"
                  style={{ color: chem.color }}
                >
                  {pct.toFixed(0)}%
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
