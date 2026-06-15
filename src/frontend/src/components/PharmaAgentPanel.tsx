import { useEffect, useRef, useState } from "react";

// ── Teal pharma tokens ──────────────────────────────────────────────────────
const T_PRIMARY = "oklch(0.72 0.18 195)";
const T_NEON = "oklch(0.88 0.22 192)";
const T_DIM = "oklch(0.42 0.08 200)";
const T_DIMMER = "oklch(0.30 0.05 210)";
const T_BORDER = "oklch(0.22 0.08 215)";
const T_BORDER_MID = "oklch(0.16 0.05 220)";
const T_SURFACE = "oklch(0.065 0.013 230)";
const _T_CARD = "oklch(0.085 0.016 225)";
const T_AMBER = "oklch(0.75 0.22 65)";
const T_RED = "oklch(0.65 0.25 25)";
const T_YELLOW = "oklch(0.82 0.20 95)";
const T_INHIBIT = "oklch(0.72 0.18 195)";

const PHI = 1.618033988749895;

type Chemical = {
  abbr: string;
  name: string;
  value: number;
  category: "excitatory" | "inhibitory" | "stress" | "hunger";
};

function barColor(cat: Chemical["category"]) {
  if (cat === "excitatory") return T_AMBER;
  if (cat === "inhibitory") return T_INHIBIT;
  if (cat === "stress") return T_RED;
  return T_YELLOW;
}

function getSignificance(v: number): "HIGH" | "MEDIUM" | "LOW" {
  if (v > 0.75) return "HIGH";
  if (v > 0.5) return "MEDIUM";
  return "LOW";
}

function researchTag(abbr: string): string {
  const map: Record<string, string> = {
    DPA: "#dopamine-saturation",
    SER: "#serotonin-reuptake",
    NOR: "#norepinephrine-gating",
    GABA: "#gaba-inhibition",
    GLU: "#glutamate-excitation",
    ACH: "#acetylcholine-modulation",
    COR: "#cortisol-hpa-axis",
    NPY: "#npy-hunger-drive",
  };
  return map[abbr] ?? "#neuromodulation";
}

const EXPERIMENT_TEMPLATES: Record<string, string> = {
  DPA: "Dopamine receptor D2 saturation threshold test at current NAc activation level",
  SER: "Serotonin reuptake inhibition response under elevated cortical load",
  NOR: "Norepinephrine alpha-2A thalamic gating efficacy at current LC-NE output",
  GABA: "GABAergic inhibitory cascade timing analysis during current activation pattern",
  GLU: "Glutamate mGluR2/3 presynaptic dampening kinetics under surge conditions",
  ACH: "Acetylcholine nicotinic receptor M1/M2 modulation assay in hippocampal loop",
  COR: "CRH-R1 antagonist HPA axis stress clamp response at current cortisol proxy",
  NPY: "NPY Y1/Y5 receptor activation threshold mapping during metabolic drive elevation",
};

function buildHypotheses(dominantAbbr: string): string[] {
  const map: Record<string, string[]> = {
    DPA: [
      "HYPOTHESIS 1: Low-dose D2 partial agonist at D2R autoreceptor normalisation of dopaminergic overdrive",
      "HYPOTHESIS 2: D1 PAM co-administration with mGluR5 NAM fronto-striatal stability restoration",
      "HYPOTHESIS 3: COMT inhibition at PFC catechol-O-methyltransferase sustained working-memory potentiation",
    ],
    SER: [
      "HYPOTHESIS 1: 5-HT2A SAM at cortical pyramidal cells elevation of oscillatory stability index",
      "HYPOTHESIS 2: SERT allosteric modulator at serotonin transporter sustained synaptic 5-HT elevation",
      "HYPOTHESIS 3: 5-HT1A autoreceptor desensitiser at raphe-cortical loop acceleration of steady-state onset",
    ],
    NOR: [
      "HYPOTHESIS 1: alpha-2A agonist at LC-NE output thalamic gating enhancement under arousal load",
      "HYPOTHESIS 2: NET reuptake inhibitor at prefrontal norepinephrine working-memory bandwidth extension",
      "HYPOTHESIS 3: beta-1 antagonist at cortical adrenoceptor reduction of hyperarousal-driven saturation",
    ],
    GABA: [
      "HYPOTHESIS 1: GABA-A alpha-5 negative PAM at hippocampal interneurons selective disinhibition for LTP",
      "HYPOTHESIS 2: GABA-B antagonist at presynaptic terminal release of inhibitory suppression on PFC output",
      "HYPOTHESIS 3: KCC2 upregulator at chloride transporter restoration of inhibitory polarity gradient",
    ],
    GLU: [
      "HYPOTHESIS 1: mGluR2/3 orthosteric agonist at presynaptic terminal glutamate surge dampening",
      "HYPOTHESIS 2: NMDA GluN2B antagonist at postsynaptic NMDAR reduction of excitotoxic risk threshold",
      "HYPOTHESIS 3: AMPA PAM at low dose enhancement of signal-to-noise ratio in cortical circuits",
    ],
    ACH: [
      "HYPOTHESIS 1: M1 PAM at hippocampal muscarinic receptors memory consolidation potentiation",
      "HYPOTHESIS 2: AChE inhibitor partial at basal forebrain cholinergic tone elevation in theta burst phase",
      "HYPOTHESIS 3: alpha-7 nAChR agonist at PFC nicotinic receptors attention gating enhancement",
    ],
    COR: [
      "HYPOTHESIS 1: CRH-R1 antagonist at paraventricular nucleus HPA axis stress response attenuation",
      "HYPOTHESIS 2: 11-beta-HSD1 inhibitor at hippocampal glucocorticoid receptors neuroprotection",
      "HYPOTHESIS 3: FKBP51 inhibitor at GR-chaperone complex stress sensitivity normalisation",
    ],
    NPY: [
      "HYPOTHESIS 1: NPY Y1 antagonist at hypothalamic feeding circuit metabolic drive recalibration",
      "HYPOTHESIS 2: GLP-1 receptor agonist at brainstem satiety nodes appetite-cognition balance restoration",
      "HYPOTHESIS 3: AgRP inhibitor at arcuate nucleus suppression of orexigenic overdrive",
    ],
  };
  return (
    map[dominantAbbr] ?? [
      "HYPOTHESIS 1: Receptor agonist at target site modulation of downstream signalling",
      "HYPOTHESIS 2: Allosteric modulator at binding domain enhancement of selectivity profile",
      "HYPOTHESIS 3: Reuptake inhibitor at transporter site prolonged synaptic dwell time",
    ]
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PharmaAgentPanel({ neural }: { neural: any }) {
  const [trialCounter, setTrialCounter] = useState(0);
  const [trials, setTrials] = useState<string[]>([]);
  const [hypotheses, setHypotheses] = useState<string[]>([
    "HYPOTHESIS 1: D2 partial agonist at NAc autoreceptor — normalization of dopaminergic baseline",
    "HYPOTHESIS 2: 5-HT2A SAM at cortical pyramidal cells — oscillatory stability elevation",
    "HYPOTHESIS 3: GABA-A alpha-5 NAM at hippocampal interneurons — LTP disinhibition",
  ]);
  const [findings, setFindings] = useState<
    { tick: number; chem: string; sig: string; tag: string }[]
  >([]);
  const counterRef = useRef(0);

  // Derive chemical values from neural
  const nt = (neural.neurotransmitters ?? {}) as Record<string, number>;
  const chemicals: Chemical[] = [
    {
      abbr: "DPA",
      name: "Dopamine",
      value: Math.min(1, (nt.dopamine ?? 0.45) * 100) / 100,
      category: "excitatory",
    },
    {
      abbr: "SER",
      name: "Serotonin",
      value: Math.min(1, (nt.serotonin ?? 0.38) * 100) / 100,
      category: "inhibitory",
    },
    {
      abbr: "NOR",
      name: "Norepinephrine",
      value: Math.min(1, (nt.norepinephrine ?? 0.42) * 100) / 100,
      category: "excitatory",
    },
    {
      abbr: "GABA",
      name: "GABA",
      value: Math.min(1, (nt.gaba ?? 0.55) * 100) / 100,
      category: "inhibitory",
    },
    {
      abbr: "GLU",
      name: "Glutamate",
      value: Math.min(1, (nt.glutamate ?? 0.6) * 100) / 100,
      category: "excitatory",
    },
    {
      abbr: "ACH",
      name: "Acetylcholine",
      value: Math.min(1, (nt.acetylcholine ?? 0.35) * 100) / 100,
      category: "inhibitory",
    },
    {
      abbr: "COR",
      name: "Cortisol",
      value: Math.min(1, ((neural.cortisolLevel as number) ?? 0.3) * 100) / 100,
      category: "stress",
    },
    {
      abbr: "NPY",
      name: "NPY Proxy",
      value: Math.min(1, ((neural.hungerDrive as number) ?? 0.48) * 100) / 100,
      category: "hunger",
    },
  ];

  const dominant = chemicals.reduce((a, b) => (a.value > b.value ? a : b));
  const tick = (neural.tick as number) ?? 0;

  // Auto-Experiment Generator — 8000ms
  // biome-ignore lint/correctness/useExhaustiveDependencies: interval polls latest chemicals on its own schedule
  useEffect(() => {
    const id = setInterval(() => {
      counterRef.current += 1;
      const cnt = counterRef.current;
      setTrialCounter(cnt);
      const abbr = chemicals.reduce((a, b) => (a.value > b.value ? a : b)).abbr;
      const desc =
        EXPERIMENT_TEMPLATES[abbr] ??
        "Neuromodulator receptor binding kinetics analysis";
      const entry = `TRIAL-${abbr}-${String(cnt).padStart(3, "0")}: ${desc}`;
      setTrials((prev) => [entry, ...prev].slice(0, 10));
    }, 8000);
    return () => clearInterval(id);
  }, []);

  // Compound Hypothesis Panel — 15000ms
  // biome-ignore lint/correctness/useExhaustiveDependencies: interval polls latest chemicals on its own schedule
  useEffect(() => {
    const id = setInterval(() => {
      const abbr = chemicals.reduce((a, b) => (a.value > b.value ? a : b)).abbr;
      setHypotheses(buildHypotheses(abbr));
    }, 15000);
    return () => clearInterval(id);
  }, []);

  // Findings Log — 20000ms
  // biome-ignore lint/correctness/useExhaustiveDependencies: interval polls latest chemicals/neural on its own schedule
  useEffect(() => {
    const id = setInterval(() => {
      const chem = chemicals.reduce((a, b) => (a.value > b.value ? a : b));
      const sig = getSignificance(chem.value);
      const tag = researchTag(chem.abbr);
      setFindings((prev) =>
        [
          { tick: (neural.tick as number) ?? 0, chem: chem.name, sig, tag },
          ...prev,
        ].slice(0, 8),
      );
    }, 20000);
    return () => clearInterval(id);
  }, []);

  const _ = trialCounter; // suppress unused lint
  void _;

  return (
    <div
      className="h-full overflow-y-auto flex flex-col gap-0"
      style={{ background: T_SURFACE }}
      data-ocid="pharma.agent.panel"
    >
      {/* ── SECTION 1: Agent Identity ──────────────────────────────────── */}
      <div
        className="shrink-0 px-5 py-4 border-b"
        style={{
          borderColor: T_BORDER,
          background: "oklch(0.075 0.016 225)",
          boxShadow: `0 0 24px ${T_PRIMARY}14`,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            {/* Glow accent bar */}
            <div
              className="w-8 h-0.5 mb-2"
              style={{ background: T_NEON, boxShadow: `0 0 8px ${T_NEON}` }}
            />
            <div
              className="font-mono text-[15px] font-bold tracking-[0.25em] uppercase leading-none"
              style={{ color: T_NEON, textShadow: `0 0 12px ${T_NEON}80` }}
            >
              INQUISITOR PHARM
            </div>
            <div
              className="font-mono text-[8px] tracking-[0.3em] uppercase mt-1"
              style={{ color: T_DIM }}
            >
              SOVEREIGN NEUROPHARMACOLOGY RESEARCHER
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span
              className="font-mono text-[8px] tracking-[0.15em] px-2 py-0.5 border"
              style={{
                color: T_PRIMARY,
                borderColor: T_BORDER,
                background: "oklch(0.12 0.04 210 / 0.6)",
              }}
            >
              v1.0.0
            </span>
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: T_NEON,
                  boxShadow: `0 0 6px ${T_NEON}`,
                  animation: "pulse 2s infinite",
                }}
              />
              <span
                className="font-mono text-[7px] tracking-[0.2em] uppercase"
                style={{ color: T_DIM }}
              >
                ACTIVE | MONITORING
              </span>
            </div>
          </div>
        </div>
        <div
          className="mt-3 pt-3 border-t font-mono text-[7px] tracking-[0.12em] uppercase"
          style={{ borderColor: T_BORDER_MID, color: T_DIMMER }}
        >
          PHI={PHI} · HEARTBEAT=873ms · SUBSTRATE=CONNECTOME ·
          DOMAIN=NEUROPHARMACOLOGY
        </div>
      </div>

      {/* ── SECTION 2: Live Chemical Monitor ───────────────────────────── */}
      <div
        className="shrink-0 px-4 py-4 border-b"
        style={{ borderColor: T_BORDER_MID }}
        data-ocid="pharma.agent.chem_monitor"
      >
        <div
          className="font-mono text-[8px] tracking-[0.25em] uppercase mb-3"
          style={{ color: T_DIM }}
        >
          LIVE CHEMICAL SUBSTRATE MONITOR
        </div>
        <div className="grid grid-cols-3 gap-2">
          {chemicals.map((c) => {
            const pct = Math.round(c.value * 100);
            const col = barColor(c.category);
            return (
              <div
                key={c.abbr}
                className="border p-2 flex flex-col gap-1"
                style={{
                  borderColor: `${col}30`,
                  background: `${col}06`,
                }}
                data-ocid={`pharma.agent.chem.${c.abbr.toLowerCase()}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-[9px] font-bold tracking-wider"
                    style={{ color: col }}
                  >
                    {c.abbr}
                  </span>
                  <span className="font-mono text-[8px]" style={{ color: col }}>
                    {pct}%
                  </span>
                </div>
                <div
                  className="relative h-[3px] w-full rounded-none overflow-hidden"
                  style={{ background: "oklch(0.12 0.02 230)" }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                      width: `${pct}%`,
                      background: col,
                      boxShadow: pct > 75 ? `0 0 4px ${col}` : undefined,
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
                <span
                  className="font-mono text-[6px] tracking-[0.1em] truncate"
                  style={{ color: T_DIMMER }}
                >
                  {c.name}
                </span>
              </div>
            );
          })}
        </div>
        <div
          className="mt-2 font-mono text-[7px] tracking-[0.12em] uppercase"
          style={{ color: T_DIMMER }}
        >
          DOMINANT: {dominant.abbr} — {Math.round(dominant.value * 100)}% · TICK{" "}
          {tick}
        </div>
      </div>

      {/* ── SECTION 3: Auto-Experiment Generator ───────────────────────── */}
      <div
        className="shrink-0 px-4 py-4 border-b"
        style={{ borderColor: T_BORDER_MID }}
        data-ocid="pharma.agent.trial_log"
      >
        <div
          className="font-mono text-[8px] tracking-[0.25em] uppercase mb-2"
          style={{ color: T_DIM }}
        >
          AUTO-EXPERIMENT GENERATOR
        </div>
        <div className="font-mono text-[7px] mb-3" style={{ color: T_DIMMER }}>
          Autonomous trial generation · interval = 8000ms · focus:{" "}
          {dominant.abbr}
        </div>
        {trials.length === 0 ? (
          <div
            className="font-mono text-[7px] text-center py-4 border"
            style={{ borderColor: T_BORDER_MID, color: T_DIMMER }}
            data-ocid="pharma.agent.trial_log.empty_state"
          >
            AWAITING FIRST TRIAL CYCLE...
          </div>
        ) : (
          <div
            className="overflow-y-auto flex flex-col gap-0.5"
            style={{ maxHeight: "200px" }}
          >
            {trials.map((t, i) => (
              <div
                key={t}
                className="px-3 py-1.5 border-l-2 font-mono text-[7px] leading-relaxed"
                style={{
                  borderColor: i === 0 ? T_NEON : T_BORDER,
                  color: i === 0 ? T_PRIMARY : T_DIMMER,
                  background:
                    i === 0 ? "oklch(0.72 0.18 195 / 0.05)" : "transparent",
                }}
                data-ocid={`pharma.agent.trial_log.item.${i + 1}`}
              >
                {t}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── SECTION 4: Compound Hypothesis Panel ───────────────────────── */}
      <div
        className="shrink-0 px-4 py-4 border-b"
        style={{ borderColor: T_BORDER_MID }}
        data-ocid="pharma.agent.hypotheses"
      >
        <div
          className="font-mono text-[8px] tracking-[0.25em] uppercase mb-3"
          style={{ color: T_DIM }}
        >
          COMPOUND HYPOTHESIS PANEL
        </div>
        <div className="font-mono text-[7px] mb-3" style={{ color: T_DIMMER }}>
          Updated every 15000ms · dominant chemical: {dominant.abbr}
        </div>
        <div className="flex flex-col gap-2">
          {hypotheses.map((h, i) => (
            <div
              key={h}
              className="border-l-2 px-3 py-2"
              style={{
                borderColor: i === 0 ? T_NEON : T_BORDER,
                background: "oklch(0.085 0.015 225)",
              }}
              data-ocid={`pharma.agent.hypothesis.${i + 1}`}
            >
              <div
                className="font-mono text-[7px] leading-relaxed"
                style={{ color: i === 0 ? T_PRIMARY : T_DIMMER }}
              >
                {h}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 5: Findings Log ─────────────────────────────────────── */}
      <div className="shrink-0 px-4 py-4" data-ocid="pharma.agent.findings_log">
        <div
          className="font-mono text-[8px] tracking-[0.25em] uppercase mb-2"
          style={{ color: T_DIM }}
        >
          RESEARCH FINDINGS LOG
        </div>
        <div className="font-mono text-[7px] mb-3" style={{ color: T_DIMMER }}>
          Entries recorded every 20000ms · max 8 entries
        </div>
        {findings.length === 0 ? (
          <div
            className="font-mono text-[7px] text-center py-4 border"
            style={{ borderColor: T_BORDER_MID, color: T_DIMMER }}
            data-ocid="pharma.agent.findings_log.empty_state"
          >
            NO FINDINGS RECORDED YET — MONITORING ACTIVE
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {findings.map((f, i) => {
              const sigColor =
                f.sig === "HIGH" ? T_RED : f.sig === "MEDIUM" ? T_AMBER : T_DIM;
              return (
                <div
                  key={`${f.tick}-${i}`}
                  className="flex items-center justify-between px-3 py-1.5 border font-mono text-[7px]"
                  style={{
                    borderColor: T_BORDER_MID,
                    background: "oklch(0.08 0.014 225)",
                  }}
                  data-ocid={`pharma.agent.findings_log.item.${i + 1}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span style={{ color: T_DIMMER }}>T{f.tick}</span>
                    <span style={{ color: T_PRIMARY }} className="truncate">
                      {f.chem}
                    </span>
                    <span
                      style={{ color: f.tag ? T_DIMMER : T_DIMMER }}
                      className="truncate"
                    >
                      {f.tag}
                    </span>
                  </div>
                  <span
                    className="shrink-0 px-2 py-0.5 border font-mono text-[6px] tracking-[0.15em] uppercase"
                    style={{
                      color: sigColor,
                      borderColor: `${sigColor}40`,
                      background: `${sigColor}0a`,
                    }}
                  >
                    {f.sig}
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
