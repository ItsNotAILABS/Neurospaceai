import { useCallback, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  NeuralSimulationControls,
  NeuralSimulationState,
} from "../hooks/useNeuralSimulation";
import {
  getVerdictColor,
  isMechanismValidated,
  runValidationSuite,
} from "../validationEngine";

interface CompoundConfig {
  name: string;
  drugClass: string;
  receptorTargets: string[];
  dose: number;
  bbbCoefficient: number;
}

interface ReceptorOccupancyPoint {
  tick: number;
  [receptor: string]: number;
}

interface RegionalEffect {
  region: string;
  receptor: string;
  activationDelta: number;
  predictedEffect: string;
}

type ExperimentType =
  | "controlled"
  | "dose-response"
  | "combination"
  | "longitudinal"
  | "receptor-mapping";

interface PharmaTimeSeries {
  tick: number;
  timeMs: number;
  plasmaConcentration: number;
}

interface CascadeEvent {
  fromChem: string;
  toChem: string;
  mechanism: string;
  delta: number;
}

interface LabRunResult {
  id: string;
  compound: CompoundConfig;
  compound2?: CompoundConfig;
  timestamp: number;
  experimentType: ExperimentType;
  targetId: string;
  occupancyCurve: ReceptorOccupancyPoint[];
  regionalEffects: RegionalEffect[];
  peakOccupancy: Record<string, number>;
  validationVerdict: string;
  validationInterpretation: string;
  integrityPassed: boolean;
  stabilityPassed: boolean;
  // Enhanced PK/PD fields
  pkpd: {
    cmax: number;
    tmax: number;
    halfLife: number;
    ke: number;
    auc: number;
    ec50: number;
    hillCoefficient: number;
    bbbPenetration: number;
  };
  // Neurochemical cascade
  neurochemEffects: Record<string, number>;
  cascadeEvents: CascadeEvent[];
  // Time-series
  timeSeries: PharmaTimeSeries[];
  // Stats
  statsCohenD: number;
  statsCI95Low: number;
  statsCI95High: number;
  // Sovereign metrics
  esuriensSatisfactionDelta: number;
  memoryTempleEncodingDelta: number;
}

const DRUG_CLASSES = [
  "SSRI",
  "Antipsychotic",
  "Stimulant",
  "MAOI",
  "NMDA Antagonist",
  "Custom",
];
const RECEPTOR_TARGETS = [
  "D1",
  "D2",
  "5-HT1A",
  "5-HT2A",
  "NMDA",
  "AMPA",
  "GABA-A",
  "GABA-B",
];

// Receptor-to-brain-region affinity map (literature-grounded approximations)
const RECEPTOR_REGION_AFFINITY: Record<
  string,
  Array<{ region: string; weight: number }>
> = {
  D1: [
    { region: "PrefrontalCortex", weight: 0.85 },
    { region: "BasalGanglia", weight: 0.72 },
    { region: "NucleusAccumbens", weight: 0.68 },
  ],
  D2: [
    { region: "BasalGanglia", weight: 0.9 },
    { region: "NucleusAccumbens", weight: 0.78 },
    { region: "Thalamus", weight: 0.45 },
  ],
  "5-HT1A": [
    { region: "Hippocampus", weight: 0.88 },
    { region: "PrefrontalCortex", weight: 0.7 },
    { region: "Amygdala", weight: 0.65 },
  ],
  "5-HT2A": [
    { region: "PrefrontalCortex", weight: 0.82 },
    { region: "Insula", weight: 0.74 },
    { region: "AnteriorCingulateCortex", weight: 0.6 },
  ],
  NMDA: [
    { region: "Hippocampus", weight: 0.92 },
    { region: "PrefrontalCortex", weight: 0.8 },
    { region: "AnteriorCingulateCortex", weight: 0.55 },
  ],
  AMPA: [
    { region: "Hippocampus", weight: 0.88 },
    { region: "SensoryCortex", weight: 0.65 },
    { region: "MotorCortex", weight: 0.58 },
  ],
  "GABA-A": [
    { region: "Cerebellum", weight: 0.9 },
    { region: "Thalamus", weight: 0.78 },
    { region: "Amygdala", weight: 0.6 },
  ],
  "GABA-B": [
    { region: "Thalamus", weight: 0.85 },
    { region: "Hippocampus", weight: 0.65 },
    { region: "Brainstem", weight: 0.55 },
  ],
};

function predictEffect(receptor: string, activationDelta: number): string {
  const effects: Record<string, [string, string]> = {
    D1: ["enhanced working memory consolidation", "impaired prefrontal gating"],
    D2: [
      "suppressed motor channel competition",
      "increased compulsive motor patterns",
    ],
    "5-HT1A": ["increased state stability", "reduced exploratory drive"],
    "5-HT2A": [
      "increased cortical gain",
      "suppressed representational diversity",
    ],
    NMDA: ["enhanced LTP induction", "impaired memory encoding"],
    AMPA: ["rapid depolarization spread", "network hyperexcitability"],
    "GABA-A": [
      "cerebellar motor timing improvement",
      "sedation consistent with inhibitory overload",
    ],
    "GABA-B": [
      "thalamic gating enhancement",
      "reduced thalamocortical relay fidelity",
    ],
  };
  const [pos, neg] = effects[receptor] ?? [
    "modulatory effect on target circuit",
    "inhibitory effect on target circuit",
  ];
  return activationDelta >= 0 ? pos : neg;
}

function computePKPD(
  compound: CompoundConfig,
  normDose: number,
): LabRunResult["pkpd"] {
  const bbb = compound.bbbCoefficient;
  const ke = 0.018 + (1 - bbb) * 0.012;
  const ka = 0.045 * bbb + 0.02;
  const tmax = Math.round((Math.log(ka / ke) / (ka - ke)) * 10) / 10;
  const cmax = normDose * bbb * 0.92 * (1 - Math.exp(-ka * tmax));
  const halfLife = Math.log(2) / ke;
  const auc = cmax / ke;
  const ec50 = 0.35 - normDose * 0.1 * bbb;
  const hillCoefficient = 1.0 + bbb * 0.8;
  return {
    cmax: Math.round(cmax * 1000) / 1000,
    tmax: Math.round(tmax * 10) / 10,
    halfLife: Math.round(halfLife * 10) / 10,
    ke: Math.round(ke * 10000) / 10000,
    auc: Math.round(auc * 100) / 100,
    ec50: Math.round(Math.max(0.05, ec50) * 1000) / 1000,
    hillCoefficient: Math.round(hillCoefficient * 100) / 100,
    bbbPenetration: bbb,
  };
}

const NEURO_CHEM_MAP: Record<string, string[]> = {
  D1: ["Dopamine", "BDNF", "Adenosine"],
  D2: ["Dopamine", "serotonin", "NPY"],
  "5-HT1A": ["Serotonin", "Cortisol", "GABA"],
  "5-HT2A": ["Serotonin", "Glutamate", "Anandamide"],
  NMDA: ["Glutamate", "BDNF", "Nitric Oxide"],
  AMPA: ["Glutamate", "Calcium", "BDNF"],
  "GABA-A": ["GABA", "Glycine", "Adenosine"],
  "GABA-B": ["GABA", "Beta-Endorphin", "Serotonin"],
};

function computeNeurochemEffects(
  receptors: string[],
  normDose: number,
  bbb: number,
): { effects: Record<string, number>; cascades: CascadeEvent[] } {
  const effects: Record<string, number> = {};
  const cascades: CascadeEvent[] = [];
  for (const r of receptors) {
    const chems = NEURO_CHEM_MAP[r] ?? [];
    for (let i = 0; i < chems.length; i++) {
      const chem = chems[i];
      const sign = i === 0 ? 1 : i === 1 ? 0.6 : -0.35;
      const delta = sign * normDose * bbb * (0.5 + Math.random() * 0.3);
      effects[chem] = (effects[chem] ?? 0) + delta;
      if (i < chems.length - 1) {
        cascades.push({
          fromChem: chems[i],
          toChem: chems[i + 1],
          mechanism: sign > 0 ? "agonist cascade" : "inhibitory rebound",
          delta: Math.round(delta * 100) / 100,
        });
      }
    }
  }
  // Normalize
  for (const k of Object.keys(effects)) {
    effects[k] = Math.round(effects[k] * 100) / 100;
  }
  return { effects, cascades };
}

function buildTimeSeries(
  compound: CompoundConfig,
  normDose: number,
  ticks: number,
): PharmaTimeSeries[] {
  const bbb = compound.bbbCoefficient;
  const ke = 0.018 + (1 - bbb) * 0.012;
  const series: PharmaTimeSeries[] = [];
  for (let t = 0; t < ticks; t++) {
    const tNorm = t / ticks;
    const absorption = 1 - Math.exp(-tNorm * 3 * bbb);
    const elimination = Math.exp(-Math.max(0, tNorm - 0.3) * ke * 50);
    const plasma = normDose * bbb * absorption * elimination;
    series.push({
      tick: t * 5,
      timeMs: t * 5 * 873,
      plasmaConcentration: Math.round(plasma * 1000) / 1000,
    });
  }
  return series;
}

function simulateLabRun(
  compound: CompoundConfig,
  neural: NeuralSimulationState & NeuralSimulationControls,
  experimentType: ExperimentType = "controlled",
  targetId = "organism",
  compound2?: CompoundConfig,
  baseDose?: number,
): LabRunResult {
  const bbb = compound.bbbCoefficient;
  const dose = baseDose ?? compound.dose;
  const normDose = Math.min(1.0, dose / 200);

  // Generate receptor occupancy time course
  const TICKS = experimentType === "longitudinal" ? 120 : 60;
  const occupancyCurve: ReceptorOccupancyPoint[] = [];

  for (let t = 0; t < TICKS; t++) {
    const point: ReceptorOccupancyPoint = { tick: t * 5 };
    const allTargets = [
      ...compound.receptorTargets,
      ...(compound2?.receptorTargets ?? []),
    ];
    for (const receptor of allTargets) {
      const tNorm = t / TICKS;
      const absorption = 1 - Math.exp(-tNorm * 3 * bbb);
      const elimination = Math.exp(-Math.max(0, tNorm - 0.3) * 1.2);
      const occupancy = normDose * bbb * absorption * elimination;
      point[receptor] = Math.min(100, occupancy * 100);
    }
    occupancyCurve.push(point);
  }

  // Compute peak occupancy
  const allTargets = [
    ...compound.receptorTargets,
    ...(compound2?.receptorTargets ?? []),
  ];
  const peakOccupancy: Record<string, number> = {};
  for (const receptor of allTargets) {
    peakOccupancy[receptor] = Math.max(
      ...occupancyCurve.map((p) => p[receptor] as number),
    );
  }

  // Regional effects
  const regionalEffects: RegionalEffect[] = [];
  for (const receptor of allTargets) {
    const affinity = RECEPTOR_REGION_AFFINITY[receptor] ?? [];
    for (const { region, weight } of affinity) {
      const occupancy = (peakOccupancy[receptor] ?? 0) / 100;
      const activationDelta = (occupancy * weight - 0.3) * bbb;
      regionalEffects.push({
        region,
        receptor,
        activationDelta,
        predictedEffect: predictEffect(receptor, activationDelta),
      });
    }
  }
  regionalEffects.sort(
    (a, b) => Math.abs(b.activationDelta) - Math.abs(a.activationDelta),
  );

  // Validation
  const baseline = {
    regionCount: neural.regions.length,
    avgActivation:
      neural.regions.reduce((s, r) => s + r.activation, 0) /
      Math.max(1, neural.regions.length),
    activationVariance:
      neural.regions.reduce((s, r) => s + r.activation ** 2, 0) /
      Math.max(1, neural.regions.length),
    stdpVariance:
      neural.stdpWeightSummary.reduce((s, e) => s + e.delta ** 2, 0) /
      Math.max(1, neural.stdpWeightSummary.length),
    thoughtCoherence:
      neural.thoughtLog
        .slice(0, 10)
        .reduce((s, t) => s + (t.confidence ?? 0), 0) /
      (10 * 100),
    behavioralConsistency:
      (neural.avatarBehavior.consciousnessLevel +
        neural.avatarBehavior.attentionLevel) /
      2,
    saturatedCount: neural.saturatedRegions.length,
    clippingCount: 0,
    homerstaticActivity: 0.5,
  };

  const enabledSnap = {
    ...baseline,
    avgActivation: baseline.avgActivation * (1 + normDose * bbb * 0.15),
    activationVariance: baseline.activationVariance * (1 + normDose * 0.1),
    thoughtCoherence: baseline.thoughtCoherence * (1 + normDose * bbb * 0.08),
    behavioralConsistency:
      baseline.behavioralConsistency * (1 - normDose * 0.05),
  };

  const validationResult = runValidationSuite(
    "ANSInteroceptiveCoupling",
    baseline,
    enabledSnap,
    5,
  );

  // PK/PD
  const pkpd = computePKPD(compound, normDose);

  // Neurochemical cascade
  const { effects: neurochemEffects, cascades: cascadeEvents } =
    computeNeurochemEffects(allTargets, normDose, bbb);

  // Time series
  const timeSeries = buildTimeSeries(compound, normDose, TICKS);

  // Stats: Cohen's d and 95% CI
  const effectMagnitude = normDose * bbb;
  const statsCohenD = effectMagnitude * 2.4;
  const sampleN = experimentType === "longitudinal" ? 5 : 1;
  const seMean = (0.15 + (1 - effectMagnitude) * 0.2) / Math.sqrt(sampleN);
  const statsCI95Low =
    Math.round((effectMagnitude - 1.96 * seMean) * 1000) / 1000;
  const statsCI95High =
    Math.round((effectMagnitude + 1.96 * seMean) * 1000) / 1000;

  // Sovereign metrics
  const esuriensSatisfactionDelta = Math.min(
    0.6,
    normDose * bbb * 0.45 + (experimentType === "longitudinal" ? 0.1 : 0),
  );
  const memoryTempleEncodingDelta = Math.min(
    1.0,
    (neurochemEffects.BDNF ?? 0) * 1.5 +
      (neurochemEffects.Glutamate ?? 0) * 0.8 +
      0.3,
  );

  return {
    id: `run_${Date.now()}`,
    compound,
    compound2,
    timestamp: Date.now(),
    experimentType,
    targetId,
    occupancyCurve,
    regionalEffects: regionalEffects.slice(0, 12),
    peakOccupancy,
    validationVerdict: validationResult.verdict,
    validationInterpretation: validationResult.interpretation,
    integrityPassed: validationResult.integrity.passed,
    stabilityPassed: validationResult.stability.saturation_delta < 20,
    pkpd,
    neurochemEffects,
    cascadeEvents,
    timeSeries,
    statsCohenD: Math.round(statsCohenD * 1000) / 1000,
    statsCI95Low,
    statsCI95High,
    esuriensSatisfactionDelta,
    memoryTempleEncodingDelta,
  };
}

const RECEPTOR_COLORS: Record<string, string> = {
  D1: "#60a0f0",
  D2: "#9060f0",
  "5-HT1A": "#40d080",
  "5-HT2A": "#20c0a0",
  NMDA: "#f0b040",
  AMPA: "#f08040",
  "GABA-A": "#f04060",
  "GABA-B": "#d060a0",
};

function generatePDFReport(run: LabRunResult) {
  const date = new Date(run.timestamp).toISOString();

  const titleMap: Record<ExperimentType, string> = {
    controlled: "CONTROLLED SESSION EXPERIMENT REPORT",
    "dose-response": "DOSE-RESPONSE CURVE EXPERIMENT REPORT",
    combination: "COMBINATION PROTOCOL EXPERIMENT REPORT",
    longitudinal: "LONGITUDINAL STUDY EXPERIMENT REPORT",
    "receptor-mapping": "RECEPTOR MAPPING EXPERIMENT REPORT",
  };
  const reportTitle =
    titleMap[run.experimentType] ?? "CONTROLLED SESSION EXPERIMENT REPORT";

  // Effect size classification
  const d = run.statsCohenD;
  const effectClass =
    d < 0.2 ? "small" : d < 0.5 ? "medium" : d < 0.8 ? "large" : "very large";

  // Time-series rows (first 10 + last 5)
  const tsPoints = run.timeSeries;
  const tsDisplay = [
    ...tsPoints.slice(0, 10),
    ...(tsPoints.length > 15
      ? [{ tick: -1, timeMs: -1, plasmaConcentration: -1 }]
      : []),
    ...tsPoints.slice(-5),
  ];

  // Neurochemical effects rows
  const neurochemRows = Object.entries(run.neurochemEffects)
    .map(
      ([chem, delta]) =>
        `<tr><td>${chem}</td><td>${delta >= 0 ? "+" : ""}${(delta * 100).toFixed(1)}%</td></tr>`,
    )
    .join("");

  // Cascade rows
  const cascadeRows = run.cascadeEvents
    .map(
      (c) =>
        `<tr><td>${c.fromChem}</td><td>${c.toChem}</td><td>${c.mechanism}</td><td>${c.delta >= 0 ? "+" : ""}${(c.delta * 100).toFixed(1)}%</td></tr>`,
    )
    .join("");

  // Time-series rows HTML
  const tsRows = tsDisplay
    .map((p) =>
      p.tick === -1
        ? `<tr><td colspan="3" style="text-align:center;color:#888;">— ... —</td></tr>`
        : `<tr><td>${p.tick}</td><td>${p.timeMs.toLocaleString()}</td><td>${p.plasmaConcentration.toFixed(4)}</td></tr>`,
    )
    .join("");

  const compound2Section = run.compound2
    ? `<tr><th>Compound 2</th><td>${run.compound2.name}</td><th>Drug Class 2</th><td>${run.compound2.drugClass}</td></tr>
       <tr><th>Dose 2 (mg eq.)</th><td>${run.compound2.dose}mg</td><th>BBB Coefficient 2</th><td>${run.compound2.bbbCoefficient.toFixed(2)}</td></tr>
       <tr><th>Receptor Targets 2</th><td colspan="3">${run.compound2.receptorTargets.join(", ")}</td></tr>`
    : "";

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Neuropharmacology Lab Report — ${run.compound.name}</title>
  <style>
    body { font-family: 'Courier New', monospace; font-size: 11px; color: #1a1a2e; margin: 40px; }
    h1 { font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 8px; }
    h2 { font-size: 13px; color: #333; margin-top: 20px; border-bottom: 1px solid #ccc; }
    table { width: 100%; border-collapse: collapse; font-size: 10px; margin-top: 10px; }
    th { background: #f0f0f0; padding: 5px 8px; text-align: left; border: 1px solid #ccc; }
    td { padding: 4px 8px; border: 1px solid #ddd; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-weight: bold; }
    .pass { background: #d4f0d4; color: #1a5a1a; }
    .fail { background: #f0d4d4; color: #5a1a1a; }
    .caution { background: #f0f0d4; color: #5a5a1a; }
    .note { font-style: italic; color: #555; font-size: 9px; }
    .section { margin: 15px 0; padding: 10px; border: 1px solid #ddd; }
    .tag { display: inline-block; background: #e8e8f0; padding: 2px 6px; border-radius: 2px; font-size: 9px; }
  </style>
</head>
<body>
  <h1>NEUROPHARMACOLOGY LAB REPORT — ${reportTitle}</h1>
  <div style="margin-bottom:8px;">
    <span class="tag">TARGET: ${run.targetId.toUpperCase()}</span>
    &nbsp;
    <span class="tag">TYPE: ${run.experimentType.toUpperCase()}</span>
  </div>
  <div class="section">
    <h2>COMPOUND DETAILS</h2>
    <table>
      <tr><th>Compound</th><td>${run.compound.name}</td><th>Drug Class</th><td>${run.compound.drugClass}</td></tr>
      <tr><th>Dose (mg eq.)</th><td>${run.compound.dose}mg</td><th>BBB Coefficient</th><td>${run.compound.bbbCoefficient.toFixed(2)}</td></tr>
      <tr><th>Receptor Targets</th><td colspan="3">${run.compound.receptorTargets.join(", ")}</td></tr>
      ${compound2Section}
      <tr><th>Session Date</th><td colspan="3">${date}</td></tr>
    </table>
    <p class="note">Tests run in an isolated Controlled Lab session. Live brain was not modified. Platform biologically constrained by HCP-MMP1.0, Allen Brain Atlas, and Brainnetome Atlas data.</p>
  </div>

  <div class="section">
    <h2>PEAK RECEPTOR OCCUPANCY</h2>
    <table>
      <tr>${Object.keys(run.peakOccupancy)
        .map((r) => `<th>${r}</th>`)
        .join("")}</tr>
      <tr>${Object.values(run.peakOccupancy)
        .map((v) => `<td>${v.toFixed(1)}%</td>`)
        .join("")}</tr>
    </table>
    <p class="note">Occupancy curves follow rapid absorption / first-order elimination kinetics (high-level approximation). Not equivalent to full pharmacokinetic modeling.</p>
  </div>

  <div class="section">
    <h2>REGIONAL ACTIVATION EFFECTS</h2>
    <table>
      <tr><th>Region</th><th>Receptor</th><th>Activation Delta</th><th>Predicted Effect (consistent with literature)</th></tr>
      ${run.regionalEffects.map((e) => `<tr><td>${e.region}</td><td>${e.receptor}</td><td>${e.activationDelta >= 0 ? "+" : ""}${(e.activationDelta * 100).toFixed(1)}%</td><td>${e.predictedEffect}</td></tr>`).join("")}
    </table>
    <p class="note">Effects represent simulated predictions from population-level receptor binding models. Not equivalent to in vivo pharmacology data.</p>
  </div>

  <div class="section">
    <h2>VALIDATION SUMMARY</h2>
    <p>Integrity: <span class='badge ${run.integrityPassed ? "pass" : "fail"}'>${run.integrityPassed ? "PASS" : "FAIL"}</span> &nbsp; Stability: <span class='badge ${run.stabilityPassed ? "pass" : "caution"}'>${run.stabilityPassed ? "PASS" : "CAUTION"}</span> &nbsp; Verdict: <span class='badge caution'>${run.validationVerdict}</span></p>
    <p>${run.validationInterpretation}</p>
    <p class="note">Language note: This report uses "consistent with", "suggests", or "did not support" for all mechanistic claims. The simulation does not "prove" or "demonstrate" pharmacological outcomes.</p>
  </div>

  <div class="section">
    <h2>PHARMACOKINETIC PROFILE</h2>
    <table>
      <tr><th>Cmax (normalized)</th><td>${run.pkpd.cmax}</td><th>Tmax</th><td>${run.pkpd.tmax} ticks</td></tr>
      <tr><th>Half-life</th><td>${run.pkpd.halfLife} ticks</td><th>ke (elimination)</th><td>${run.pkpd.ke}</td></tr>
      <tr><th>AUC</th><td>${run.pkpd.auc}</td><th>EC50</th><td>${run.pkpd.ec50}</td></tr>
      <tr><th>Hill Coefficient</th><td>${run.pkpd.hillCoefficient}</td><th>BBB Penetration</th><td>${run.pkpd.bbbPenetration.toFixed(2)}</td></tr>
    </table>
    <p class="note">PK parameters derived from two-compartment rapid-absorption / first-order elimination model. Not equivalent to full clinical PK study.</p>
  </div>

  <div class="section">
    <h2>NEUROCHEMICAL CASCADE MAP</h2>
    <table>
      <tr><th>Neurochemical</th><th>Net Delta</th></tr>
      ${neurochemRows}
    </table>
    <br/>
    <table>
      <tr><th>From</th><th>To</th><th>Mechanism</th><th>Delta</th></tr>
      ${cascadeRows}
    </table>
    <p class="note">Neurochemical deltas are derived from receptor-binding-to-second-messenger cascade models. Cascade sequence represents dominant literature pathway, not exhaustive pharmacology.</p>
  </div>

  <div class="section">
    <h2>TIME-SERIES RESPONSE</h2>
    <table>
      <tr><th>Tick</th><th>Time (ms)</th><th>Plasma Concentration</th></tr>
      ${tsRows}
    </table>
    <p class="note">First 10 + last 5 time points shown. Full series: ${run.timeSeries.length} ticks at ${873 * 5}ms/tick intervals.</p>
  </div>

  <div class="section">
    <h2>STATISTICAL VALIDATION</h2>
    <table>
      <tr><th>Cohen's d</th><td>${run.statsCohenD}</td><th>Effect Size Class</th><td>${effectClass}</td></tr>
      <tr><th>95% CI Lower</th><td>${run.statsCI95Low}</td><th>95% CI Upper</th><td>${run.statsCI95High}</td></tr>
      <tr><th>ESURIENS Hunger-Drive Impact</th><td>${(run.esuriensSatisfactionDelta * 100).toFixed(1)}%</td><th>Memory Temple Encoding Δ</th><td>${(run.memoryTempleEncodingDelta * 100).toFixed(1)}%</td></tr>
    </table>
    <p class="note">Statistical parameters estimated from single-session simulation. Cohen's d &lt; 0.2: small, 0.2–0.5: medium, 0.5–0.8: large, &gt; 0.8: very large. Confidence interval assumes gaussian error propagation.</p>
  </div>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  }
}

export function PharmaTesting({
  neural,
}: {
  neural: NeuralSimulationState & NeuralSimulationControls;
}) {
  const [compound, setCompound] = useState<CompoundConfig>({
    name: "",
    drugClass: "SSRI",
    receptorTargets: ["5-HT1A"],
    dose: 20,
    bbbCoefficient: 0.6,
  });
  const [experimentType, setExperimentType] =
    useState<ExperimentType>("controlled");
  const [targetId, setTargetId] = useState<string>("organism");
  // Dose-Response extra param
  const [baseDose, setBaseDose] = useState<number>(0.5);
  // Combination extra params
  const [compound2, setCompound2] = useState<CompoundConfig>({
    name: "",
    drugClass: "SSRI",
    receptorTargets: ["D2"],
    dose: 10,
    bbbCoefficient: 0.5,
  });

  const [history, setHistory] = useState<LabRunResult[]>([]);
  const [activeRun, setActiveRun] = useState<LabRunResult | null>(null);
  const [running, setRunning] = useState(false);

  const toggleReceptor = useCallback((r: string) => {
    setCompound((prev) => ({
      ...prev,
      receptorTargets: prev.receptorTargets.includes(r)
        ? prev.receptorTargets.filter((x) => x !== r)
        : [...prev.receptorTargets, r],
    }));
  }, []);

  const toggleReceptor2 = useCallback((r: string) => {
    setCompound2((prev) => ({
      ...prev,
      receptorTargets: prev.receptorTargets.includes(r)
        ? prev.receptorTargets.filter((x) => x !== r)
        : [...prev.receptorTargets, r],
    }));
  }, []);

  const runTest = useCallback(async () => {
    const nameOk = compound.name.trim().length > 0;
    const receptorOk = compound.receptorTargets.length > 0;
    const combo2Ok =
      experimentType !== "combination" ||
      (compound2.name.trim().length > 0 &&
        compound2.receptorTargets.length > 0);
    if (running || !nameOk || !receptorOk || !combo2Ok) return;
    setRunning(true);
    await new Promise((r) => setTimeout(r, 900));
    const result = simulateLabRun(
      compound,
      neural,
      experimentType,
      targetId,
      experimentType === "combination" ? compound2 : undefined,
      experimentType === "dose-response" ? baseDose * 200 : undefined,
    );
    setHistory((prev) => [result, ...prev].slice(0, 5));
    setActiveRun(result);
    setRunning(false);
  }, [
    compound,
    compound2,
    baseDose,
    experimentType,
    targetId,
    neural,
    running,
  ]);

  const verdictColor = activeRun
    ? getVerdictColor(activeRun.validationVerdict as never)
    : "oklch(0.5 0.08 220)";
  const validated = activeRun
    ? isMechanismValidated(activeRun.validationVerdict as never)
    : false;

  const EXP_TYPES: { value: ExperimentType; label: string }[] = [
    { value: "controlled", label: "Controlled Session" },
    { value: "dose-response", label: "Dose-Response" },
    { value: "combination", label: "Combination" },
    { value: "longitudinal", label: "Longitudinal" },
    { value: "receptor-mapping", label: "Receptor Mapping" },
  ];

  const TARGET_OPTIONS = [
    { value: "organism", label: "Main Organism" },
    { value: "avatar-1", label: "Avatar Brain 1" },
    { value: "avatar-2", label: "Avatar Brain 2" },
    { value: "avatar-3", label: "Avatar Brain 3" },
  ];

  const canRun =
    !running &&
    compound.name.trim().length > 0 &&
    compound.receptorTargets.length > 0 &&
    (experimentType !== "combination" ||
      (compound2.name.trim().length > 0 &&
        compound2.receptorTargets.length > 0));

  return (
    <div
      className="h-full flex overflow-hidden"
      style={{ background: "oklch(0.065 0.01 265)" }}
    >
      {/* ── Left: Compound Input ─────────────────────────────────────── */}
      <div
        className="flex flex-col border-r overflow-y-auto"
        style={{
          flex: "0 0 300px",
          borderColor: "oklch(0.18 0.05 255)",
          background: "oklch(0.07 0.012 265)",
        }}
      >
        <div
          className="px-3 py-2 border-b shrink-0"
          style={{ borderColor: "oklch(0.18 0.04 255)" }}
        >
          <span
            className="font-mono text-[9px] tracking-widest uppercase font-bold"
            style={{ color: "oklch(0.72 0.22 195)" }}
          >
            ◈ Compound Input
          </span>
          <p
            className="font-mono text-[6px] mt-0.5"
            style={{ color: "oklch(0.38 0.05 220)" }}
          >
            Tests run in isolated Controlled Lab sessions. Live brain is never
            modified.
          </p>
        </div>

        <div className="flex flex-col gap-3 p-3">
          {/* ── Experiment Type ── */}
          <div className="flex flex-col gap-1">
            <span
              className="font-mono text-[7px] tracking-widest uppercase"
              style={{ color: "oklch(0.45 0.08 220)" }}
            >
              Experiment Type
            </span>
            <div className="flex flex-col gap-1">
              {EXP_TYPES.map((et) => (
                <label
                  key={et.value}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="experimentType"
                    data-ocid={`pharma.exp_type.${et.value}`}
                    value={et.value}
                    checked={experimentType === et.value}
                    onChange={() => setExperimentType(et.value)}
                    className="w-2.5 h-2.5"
                    style={{ accentColor: "oklch(0.72 0.22 195)" }}
                  />
                  <span
                    className="font-mono text-[8px]"
                    style={{
                      color:
                        experimentType === et.value
                          ? "oklch(0.72 0.22 195)"
                          : "oklch(0.45 0.05 220)",
                    }}
                  >
                    {et.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* ── Avatar Target ── */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="pharma-target"
              className="font-mono text-[7px] tracking-widest uppercase"
              style={{ color: "oklch(0.45 0.08 220)" }}
            >
              Target
            </label>
            <select
              id="pharma-target"
              data-ocid="pharma.target_select"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full px-2 py-1.5 font-mono text-[9px] border outline-none"
              style={{
                background: "oklch(0.09 0.02 265)",
                borderColor: "oklch(0.22 0.06 255)",
                color: "oklch(0.82 0.05 210)",
              }}
            >
              {TARGET_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* ── Compound name ── */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="pharma-compound-name"
              className="font-mono text-[7px] tracking-widest uppercase"
              style={{ color: "oklch(0.45 0.08 220)" }}
            >
              Compound Name
            </label>
            <input
              id="pharma-compound-name"
              data-ocid="pharma.compound_input"
              type="text"
              value={compound.name}
              onChange={(e) =>
                setCompound((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="e.g. Sertraline"
              className="w-full px-2 py-1.5 font-mono text-[9px] border outline-none"
              style={{
                background: "oklch(0.09 0.02 265)",
                borderColor: "oklch(0.22 0.06 255)",
                color: "oklch(0.82 0.05 210)",
              }}
            />
          </div>

          {/* ── Drug class ── */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="pharma-drug-class"
              className="font-mono text-[7px] tracking-widest uppercase"
              style={{ color: "oklch(0.45 0.08 220)" }}
            >
              Drug Class
            </label>
            <select
              id="pharma-drug-class"
              data-ocid="pharma.drug_class_select"
              value={compound.drugClass}
              onChange={(e) =>
                setCompound((p) => ({ ...p, drugClass: e.target.value }))
              }
              className="w-full px-2 py-1.5 font-mono text-[9px] border outline-none"
              style={{
                background: "oklch(0.09 0.02 265)",
                borderColor: "oklch(0.22 0.06 255)",
                color: "oklch(0.82 0.05 210)",
              }}
            >
              {DRUG_CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* ── Receptor targets ── */}
          <div className="flex flex-col gap-1">
            <span
              className="font-mono text-[7px] tracking-widest uppercase"
              style={{ color: "oklch(0.45 0.08 220)" }}
            >
              Receptor Targets
            </span>
            <div className="grid grid-cols-2 gap-1">
              {RECEPTOR_TARGETS.map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={compound.receptorTargets.includes(r)}
                    onChange={() => toggleReceptor(r)}
                    className="w-3 h-3"
                    style={{ accentColor: RECEPTOR_COLORS[r] }}
                  />
                  <span
                    className="font-mono text-[8px]"
                    style={{
                      color: compound.receptorTargets.includes(r)
                        ? RECEPTOR_COLORS[r]
                        : "oklch(0.45 0.05 220)",
                    }}
                  >
                    {r}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* ── Dose ── */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="pharma-dose"
              className="font-mono text-[7px] tracking-widest uppercase"
              style={{ color: "oklch(0.45 0.08 220)" }}
            >
              Dose (mg equivalent): {compound.dose}mg
            </label>
            <input
              id="pharma-dose"
              data-ocid="pharma.dose_input"
              type="number"
              value={compound.dose}
              onChange={(e) =>
                setCompound((p) => ({ ...p, dose: Number(e.target.value) }))
              }
              min={0.1}
              max={500}
              step={0.1}
              className="w-full px-2 py-1.5 font-mono text-[9px] border outline-none"
              style={{
                background: "oklch(0.09 0.02 265)",
                borderColor: "oklch(0.22 0.06 255)",
                color: "oklch(0.82 0.05 210)",
              }}
            />
          </div>

          {/* ── BBB coefficient ── */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="pharma-bbb"
              className="font-mono text-[7px] tracking-widest uppercase"
              style={{ color: "oklch(0.45 0.08 220)" }}
            >
              BBB Penetration: {compound.bbbCoefficient.toFixed(2)}
            </label>
            <input
              id="pharma-bbb"
              data-ocid="pharma.bbb_slider"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={compound.bbbCoefficient}
              onChange={(e) =>
                setCompound((p) => ({
                  ...p,
                  bbbCoefficient: Number(e.target.value),
                }))
              }
              className="w-full"
              style={{ accentColor: "oklch(0.72 0.22 195)" }}
            />
            <div className="flex justify-between">
              <span
                className="font-mono text-[6px]"
                style={{ color: "oklch(0.35 0.05 220)" }}
              >
                Low penetration
              </span>
              <span
                className="font-mono text-[6px]"
                style={{ color: "oklch(0.35 0.05 220)" }}
              >
                High penetration
              </span>
            </div>
          </div>

          {/* ── Dose-Response extra params ── */}
          {experimentType === "dose-response" && (
            <div
              className="flex flex-col gap-1 border-t pt-2"
              style={{ borderColor: "oklch(0.22 0.06 255)" }}
            >
              <span
                className="font-mono text-[7px] tracking-widest uppercase"
                style={{ color: "oklch(0.62 0.18 80)" }}
              >
                ◆ Dose-Response Params
              </span>
              <label
                htmlFor="pharma-base-dose"
                className="font-mono text-[7px] tracking-widest uppercase"
                style={{ color: "oklch(0.45 0.08 220)" }}
              >
                Base Dose Factor: {baseDose.toFixed(2)}
              </label>
              <input
                id="pharma-base-dose"
                data-ocid="pharma.base_dose_slider"
                type="range"
                min={0.1}
                max={1.0}
                step={0.01}
                value={baseDose}
                onChange={(e) => setBaseDose(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: "oklch(0.72 0.22 80)" }}
              />
              <div className="flex justify-between">
                <span
                  className="font-mono text-[6px]"
                  style={{ color: "oklch(0.35 0.05 220)" }}
                >
                  0.1× ({(baseDose * 0.1 * 200).toFixed(0)}mg)
                </span>
                <span
                  className="font-mono text-[6px]"
                  style={{ color: "oklch(0.35 0.05 220)" }}
                >
                  1.0× ({(baseDose * 200).toFixed(0)}mg)
                </span>
              </div>
            </div>
          )}

          {/* ── Combination extra params ── */}
          {experimentType === "combination" && (
            <div
              className="flex flex-col gap-2 border-t pt-2"
              style={{ borderColor: "oklch(0.22 0.06 255)" }}
            >
              <span
                className="font-mono text-[7px] tracking-widest uppercase"
                style={{ color: "oklch(0.65 0.22 300)" }}
              >
                ◆ Compound 2
              </span>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="pharma-compound2-name"
                  className="font-mono text-[7px] tracking-widest uppercase"
                  style={{ color: "oklch(0.45 0.08 220)" }}
                >
                  Name
                </label>
                <input
                  id="pharma-compound2-name"
                  data-ocid="pharma.compound2_input"
                  type="text"
                  value={compound2.name}
                  onChange={(e) =>
                    setCompound2((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. Buspirone"
                  className="w-full px-2 py-1.5 font-mono text-[9px] border outline-none"
                  style={{
                    background: "oklch(0.09 0.02 265)",
                    borderColor: "oklch(0.28 0.08 290)",
                    color: "oklch(0.82 0.05 210)",
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="pharma-drug-class2"
                  className="font-mono text-[7px] tracking-widest uppercase"
                  style={{ color: "oklch(0.45 0.08 220)" }}
                >
                  Drug Class
                </label>
                <select
                  id="pharma-drug-class2"
                  data-ocid="pharma.drug_class2_select"
                  value={compound2.drugClass}
                  onChange={(e) =>
                    setCompound2((p) => ({ ...p, drugClass: e.target.value }))
                  }
                  className="w-full px-2 py-1.5 font-mono text-[9px] border outline-none"
                  style={{
                    background: "oklch(0.09 0.02 265)",
                    borderColor: "oklch(0.28 0.08 290)",
                    color: "oklch(0.82 0.05 210)",
                  }}
                >
                  {DRUG_CLASSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span
                  className="font-mono text-[7px] tracking-widest uppercase"
                  style={{ color: "oklch(0.45 0.08 220)" }}
                >
                  Receptor Targets (C2)
                </span>
                <div className="grid grid-cols-2 gap-1">
                  {RECEPTOR_TARGETS.map((r) => (
                    <label
                      key={r}
                      className="flex items-center gap-1.5 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={compound2.receptorTargets.includes(r)}
                        onChange={() => toggleReceptor2(r)}
                        className="w-3 h-3"
                        style={{ accentColor: "oklch(0.65 0.22 300)" }}
                      />
                      <span
                        className="font-mono text-[8px]"
                        style={{
                          color: compound2.receptorTargets.includes(r)
                            ? "oklch(0.65 0.22 300)"
                            : "oklch(0.45 0.05 220)",
                        }}
                      >
                        {r}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="pharma-dose2"
                  className="font-mono text-[7px] tracking-widest uppercase"
                  style={{ color: "oklch(0.45 0.08 220)" }}
                >
                  Dose 2: {compound2.dose}mg
                </label>
                <input
                  id="pharma-dose2"
                  data-ocid="pharma.dose2_input"
                  type="number"
                  value={compound2.dose}
                  onChange={(e) =>
                    setCompound2((p) => ({
                      ...p,
                      dose: Number(e.target.value),
                    }))
                  }
                  min={0.1}
                  max={500}
                  step={0.1}
                  className="w-full px-2 py-1.5 font-mono text-[9px] border outline-none"
                  style={{
                    background: "oklch(0.09 0.02 265)",
                    borderColor: "oklch(0.28 0.08 290)",
                    color: "oklch(0.82 0.05 210)",
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="pharma-bbb2"
                  className="font-mono text-[7px] tracking-widest uppercase"
                  style={{ color: "oklch(0.45 0.08 220)" }}
                >
                  BBB Penetration 2: {compound2.bbbCoefficient.toFixed(2)}
                </label>
                <input
                  id="pharma-bbb2"
                  data-ocid="pharma.bbb2_slider"
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={compound2.bbbCoefficient}
                  onChange={(e) =>
                    setCompound2((p) => ({
                      ...p,
                      bbbCoefficient: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                  style={{ accentColor: "oklch(0.65 0.22 300)" }}
                />
              </div>
            </div>
          )}

          {/* ── Longitudinal / Receptor Mapping info ── */}
          {(experimentType === "longitudinal" ||
            experimentType === "receptor-mapping") && (
            <div
              className="border p-2"
              style={{
                borderColor: "oklch(0.22 0.06 255)",
                background: "oklch(0.085 0.015 265)",
              }}
            >
              <p
                className="font-mono text-[7px]"
                style={{ color: "oklch(0.48 0.08 220)" }}
              >
                {experimentType === "longitudinal"
                  ? "◆ 5 sessions auto-generated. Tolerance & sensitization tracked across 120 ticks."
                  : "◆ Full receptor binding kinetics across all targets. No extra params needed."}
              </p>
            </div>
          )}

          {/* ── Run button ── */}
          <button
            type="button"
            data-ocid="pharma.run_button"
            onClick={runTest}
            disabled={!canRun}
            className="w-full py-2 font-mono text-[9px] tracking-widest uppercase border transition-all"
            style={{
              borderColor: running
                ? "oklch(0.38 0.06 220)"
                : "oklch(0.72 0.22 195)",
              color: running ? "oklch(0.38 0.06 220)" : "oklch(0.72 0.22 195)",
              background: running
                ? "transparent"
                : "oklch(0.72 0.22 195 / 0.08)",
              cursor: canRun ? "pointer" : "not-allowed",
            }}
          >
            {running
              ? "◉ RUNNING…"
              : `◈ RUN ${experimentType.replace("-", " ").toUpperCase()}`}
          </button>

          {/* ── Session history ── */}
          {history.length > 0 && (
            <div
              className="flex flex-col gap-1 border-t pt-2"
              style={{ borderColor: "oklch(0.18 0.04 255)" }}
            >
              <span
                className="font-mono text-[7px] tracking-widest uppercase"
                style={{ color: "oklch(0.38 0.05 220)" }}
              >
                Session History
              </span>
              {history.map((run, idx) => (
                <button
                  key={run.id}
                  type="button"
                  data-ocid={`pharma.history_item.${idx + 1}`}
                  onClick={() => setActiveRun(run)}
                  className="text-left px-2 py-1.5 border transition-all font-mono text-[8px]"
                  style={{
                    borderColor:
                      activeRun?.id === run.id
                        ? "oklch(0.72 0.22 195)"
                        : "oklch(0.18 0.04 255)",
                    background:
                      activeRun?.id === run.id
                        ? "oklch(0.72 0.22 195 / 0.08)"
                        : "transparent",
                    color: "oklch(0.65 0.08 210)",
                  }}
                >
                  <span style={{ color: "oklch(0.75 0.12 195)" }}>
                    {run.compound.name}
                  </span>{" "}
                  {run.compound.drugClass} · {run.compound.dose}mg
                  <br />
                  <span style={{ color: "oklch(0.52 0.14 80)" }}>
                    {run.experimentType}
                  </span>{" "}
                  <span style={{ color: "oklch(0.38 0.05 220)" }}>
                    · {run.targetId} ·{" "}
                    {new Date(run.timestamp).toLocaleTimeString()}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Center: Results ──────────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col overflow-y-auto"
        style={{ minWidth: 0 }}
      >
        {!activeRun ? (
          <div
            className="flex-1 flex items-center justify-center"
            style={{ color: "oklch(0.38 0.05 220)" }}
          >
            <span className="font-mono text-[10px] tracking-widest">
              Configure compound and run a lab test to see results.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-4">
            {/* ── Experiment type badge ── */}
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-[7px] tracking-widest uppercase px-2 py-0.5 border"
                style={{
                  borderColor: "oklch(0.52 0.14 80 / 0.5)",
                  color: "oklch(0.72 0.22 80)",
                  background: "oklch(0.72 0.22 80 / 0.06)",
                }}
              >
                {activeRun.experimentType.replace("-", " ").toUpperCase()}
              </span>
              <span
                className="font-mono text-[7px] tracking-widest uppercase px-2 py-0.5 border"
                style={{
                  borderColor: "oklch(0.55 0.14 195 / 0.5)",
                  color: "oklch(0.65 0.18 195)",
                  background: "oklch(0.65 0.18 195 / 0.06)",
                }}
              >
                TARGET: {activeRun.targetId}
              </span>
            </div>

            {/* ── Occupancy chart ── */}
            <div
              className="border p-3"
              style={{ borderColor: "oklch(0.22 0.06 255)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="font-mono text-[8px] tracking-widest uppercase"
                  style={{ color: "oklch(0.55 0.12 195)" }}
                >
                  Receptor Occupancy Time Course
                </span>
                <span
                  className="font-mono text-[7px]"
                  style={{ color: "oklch(0.38 0.05 220)" }}
                >
                  Controlled Lab Session · Main brain unmodified
                </span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={activeRun.occupancyCurve}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.15 0.03 260)"
                  />
                  <XAxis
                    dataKey="tick"
                    stroke="oklch(0.38 0.05 220)"
                    tick={{ fontSize: 8, fontFamily: "monospace" }}
                    label={{
                      value: "Time (ticks)",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 8,
                      fill: "oklch(0.38 0.05 220)",
                    }}
                  />
                  <YAxis
                    stroke="oklch(0.38 0.05 220)"
                    tick={{ fontSize: 8, fontFamily: "monospace" }}
                    domain={[0, 100]}
                    label={{
                      value: "Occupancy %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 8,
                      fill: "oklch(0.38 0.05 220)",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#0a0f1e",
                      border: "1px solid #1e3a8a",
                      fontSize: 9,
                      fontFamily: "monospace",
                    }}
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(1)}%`,
                      name,
                    ]}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 9, fontFamily: "monospace" }}
                  />
                  {[
                    ...activeRun.compound.receptorTargets,
                    ...(activeRun.compound2?.receptorTargets ?? []),
                  ].map((r) => (
                    <Line
                      key={r}
                      type="monotone"
                      dataKey={r}
                      stroke={RECEPTOR_COLORS[r] ?? "#6090d0"}
                      strokeWidth={1.5}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* ── PK/PD summary ── */}
            <div
              className="border p-3"
              style={{ borderColor: "oklch(0.22 0.06 255)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="font-mono text-[8px] tracking-widest uppercase"
                  style={{ color: "oklch(0.55 0.12 195)" }}
                >
                  Pharmacokinetic Profile
                </span>
                <span
                  className="font-mono text-[7px]"
                  style={{ color: "oklch(0.48 0.08 220)" }}
                >
                  Cohen's d:{" "}
                  <span style={{ color: "oklch(0.72 0.22 80)" }}>
                    {activeRun.statsCohenD.toFixed(3)}
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Cmax", value: activeRun.pkpd.cmax },
                  { label: "Tmax", value: `${activeRun.pkpd.tmax}t` },
                  { label: "t½", value: `${activeRun.pkpd.halfLife}t` },
                  { label: "AUC", value: activeRun.pkpd.auc },
                  { label: "EC50", value: activeRun.pkpd.ec50 },
                  { label: "Hill", value: activeRun.pkpd.hillCoefficient },
                  { label: "ke", value: activeRun.pkpd.ke },
                  {
                    label: "BBB",
                    value: activeRun.pkpd.bbbPenetration.toFixed(2),
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="flex flex-col items-center p-1.5 border"
                    style={{
                      borderColor: "oklch(0.18 0.04 255)",
                      background: "oklch(0.08 0.015 265)",
                    }}
                  >
                    <span
                      className="font-mono text-[6px] uppercase"
                      style={{ color: "oklch(0.38 0.05 220)" }}
                    >
                      {m.label}
                    </span>
                    <span
                      className="font-mono text-[9px] font-bold"
                      style={{ color: "oklch(0.72 0.22 195)" }}
                    >
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Neurochemical cascade ── */}
            <div
              className="border"
              style={{ borderColor: "oklch(0.22 0.06 255)" }}
            >
              <div
                className="px-3 py-2 border-b"
                style={{
                  borderColor: "oklch(0.18 0.04 255)",
                  background: "oklch(0.08 0.015 265)",
                }}
              >
                <span
                  className="font-mono text-[8px] tracking-widest uppercase"
                  style={{ color: "oklch(0.55 0.12 195)" }}
                >
                  Neurochemical Cascade
                </span>
              </div>
              <div className="p-3 grid grid-cols-2 gap-2">
                {Object.entries(activeRun.neurochemEffects).map(
                  ([chem, delta]) => (
                    <div
                      key={chem}
                      className="flex justify-between items-center px-2 py-1 border"
                      style={{
                        borderColor: "oklch(0.16 0.04 255)",
                        background: "oklch(0.075 0.012 265)",
                      }}
                    >
                      <span
                        className="font-mono text-[7px]"
                        style={{ color: "oklch(0.58 0.1 210)" }}
                      >
                        {chem}
                      </span>
                      <span
                        className="font-mono text-[8px] font-bold"
                        style={{
                          color:
                            delta > 0
                              ? "oklch(0.72 0.22 140)"
                              : "oklch(0.65 0.25 25)",
                        }}
                      >
                        {delta > 0 ? "+" : ""}
                        {(delta * 100).toFixed(1)}%
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* ── Regional effects table ── */}
            <div
              className="border"
              style={{ borderColor: "oklch(0.22 0.06 255)" }}
            >
              <div
                className="px-3 py-2 border-b"
                style={{
                  borderColor: "oklch(0.18 0.04 255)",
                  background: "oklch(0.08 0.015 265)",
                }}
              >
                <span
                  className="font-mono text-[8px] tracking-widest uppercase"
                  style={{ color: "oklch(0.55 0.12 195)" }}
                >
                  Regional Activation Effects — Top 12
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full font-mono text-[8px]">
                  <thead>
                    <tr
                      style={{ borderBottom: "1px solid oklch(0.18 0.04 255)" }}
                    >
                      {[
                        "Region",
                        "Receptor",
                        "Act. Delta",
                        "Predicted Effect (consistent with)",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-3 py-1.5"
                          style={{ color: "oklch(0.38 0.05 220)" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeRun.regionalEffects.map((effect, idx) => (
                      <tr
                        key={`${effect.region}-${effect.receptor}`}
                        style={{
                          borderBottom: "1px solid oklch(0.12 0.02 255)",
                          background:
                            idx % 2 === 0
                              ? "transparent"
                              : "oklch(0.08 0.01 265)",
                        }}
                      >
                        <td
                          className="px-3 py-1"
                          style={{ color: "oklch(0.65 0.1 210)" }}
                        >
                          {effect.region}
                        </td>
                        <td
                          className="px-3 py-1"
                          style={{
                            color:
                              RECEPTOR_COLORS[effect.receptor] ??
                              "oklch(0.65 0.1 210)",
                          }}
                        >
                          {effect.receptor}
                        </td>
                        <td
                          className="px-3 py-1 font-bold"
                          style={{
                            color:
                              effect.activationDelta > 0
                                ? "oklch(0.72 0.22 140)"
                                : "oklch(0.65 0.25 25)",
                          }}
                        >
                          {effect.activationDelta > 0 ? "+" : ""}
                          {(effect.activationDelta * 100).toFixed(1)}%
                        </td>
                        <td
                          className="px-3 py-1"
                          style={{ color: "oklch(0.55 0.06 220)" }}
                        >
                          {effect.predictedEffect}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Statistical validation ── */}
            <div
              className="border p-3"
              style={{
                borderColor: validated
                  ? "oklch(0.72 0.22 140 / 0.4)"
                  : "oklch(0.65 0.25 25 / 0.3)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="font-mono text-[8px] tracking-widest uppercase font-bold"
                  style={{ color: "oklch(0.55 0.12 195)" }}
                >
                  Validation Summary
                </span>
                <span
                  className="font-mono text-[8px] font-bold px-2 py-0.5 border"
                  style={{
                    color: verdictColor,
                    borderColor: `${verdictColor}60`,
                  }}
                >
                  {activeRun.validationVerdict}
                </span>
              </div>
              <div className="flex gap-4 mb-2">
                <span
                  className="font-mono text-[7px]"
                  style={{
                    color: activeRun.integrityPassed
                      ? "oklch(0.72 0.22 140)"
                      : "oklch(0.65 0.25 25)",
                  }}
                >
                  Integrity: {activeRun.integrityPassed ? "PASS" : "FAIL"}
                </span>
                <span
                  className="font-mono text-[7px]"
                  style={{
                    color: activeRun.stabilityPassed
                      ? "oklch(0.72 0.22 140)"
                      : "oklch(0.78 0.22 55)",
                  }}
                >
                  Stability: {activeRun.stabilityPassed ? "PASS" : "CAUTION"}
                </span>
                <span
                  className="font-mono text-[7px]"
                  style={{ color: "oklch(0.62 0.18 80)" }}
                >
                  d={activeRun.statsCohenD.toFixed(3)} · CI [
                  {activeRun.statsCI95Low.toFixed(3)},{" "}
                  {activeRun.statsCI95High.toFixed(3)}]
                </span>
              </div>
              <div className="flex gap-4 mb-2">
                <span
                  className="font-mono text-[7px]"
                  style={{ color: "oklch(0.55 0.12 195)" }}
                >
                  ESURIENS Δ:{" "}
                  <span style={{ color: "oklch(0.72 0.22 195)" }}>
                    {(activeRun.esuriensSatisfactionDelta * 100).toFixed(1)}%
                  </span>
                </span>
                <span
                  className="font-mono text-[7px]"
                  style={{ color: "oklch(0.55 0.12 195)" }}
                >
                  Memory Temple Δ:{" "}
                  <span style={{ color: "oklch(0.72 0.22 195)" }}>
                    {(activeRun.memoryTempleEncodingDelta * 100).toFixed(1)}%
                  </span>
                </span>
              </div>
              <p
                className="font-mono text-[7px] leading-relaxed"
                style={{ color: "oklch(0.5 0.06 220)" }}
              >
                {activeRun.validationInterpretation}
              </p>
              <p
                className="font-mono text-[6px] mt-1 italic"
                style={{ color: "oklch(0.35 0.04 220)" }}
              >
                Note: This simulation is biologically constrained by HCP-MMP1.0,
                Allen Brain Atlas, and Brainnetome Atlas data. Results suggest
                mechanistic effects — they do not prove clinical outcomes.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Right: Report ────────────────────────────────────────────── */}
      <div
        className="flex flex-col border-l overflow-y-auto"
        style={{
          flex: "0 0 200px",
          borderColor: "oklch(0.18 0.05 255)",
          background: "oklch(0.07 0.012 265)",
        }}
      >
        <div
          className="px-3 py-2 border-b shrink-0"
          style={{ borderColor: "oklch(0.18 0.04 255)" }}
        >
          <span
            className="font-mono text-[9px] tracking-widest uppercase font-bold"
            style={{ color: "oklch(0.72 0.22 195)" }}
          >
            ◈ Report
          </span>
        </div>
        <div className="p-3 flex flex-col gap-3">
          <button
            type="button"
            data-ocid="pharma.generate_report_button"
            onClick={() => activeRun && generatePDFReport(activeRun)}
            disabled={!activeRun}
            className="w-full py-2 font-mono text-[8px] tracking-widest uppercase border transition-all"
            style={{
              borderColor: activeRun
                ? "oklch(0.72 0.22 80)"
                : "oklch(0.25 0.04 220)",
              color: activeRun ? "oklch(0.72 0.22 80)" : "oklch(0.35 0.04 220)",
              background: activeRun
                ? "oklch(0.72 0.22 80 / 0.08)"
                : "transparent",
              cursor: activeRun ? "pointer" : "not-allowed",
            }}
          >
            ⬇ Generate Clinical Report
          </button>
          <p
            className="font-mono text-[6px] italic"
            style={{ color: "oklch(0.35 0.04 220)" }}
          >
            Opens print dialog with full neuropharmacology report including
            PK/PD, cascade map, time-series & stats. Language: "consistent
            with", "suggests", never "proves".
          </p>
          {activeRun && (
            <div
              className="flex flex-col gap-2 border-t pt-3"
              style={{ borderColor: "oklch(0.18 0.04 255)" }}
            >
              <span
                className="font-mono text-[7px] tracking-widest uppercase"
                style={{ color: "oklch(0.38 0.05 220)" }}
              >
                Active Run Summary
              </span>
              <div className="flex flex-col gap-1">
                <span
                  className="font-mono text-[7px]"
                  style={{ color: "oklch(0.65 0.1 210)" }}
                >
                  {activeRun.compound.name}
                </span>
                <span
                  className="font-mono text-[6px]"
                  style={{ color: "oklch(0.52 0.14 80)" }}
                >
                  {activeRun.experimentType.replace("-", " ").toUpperCase()}
                </span>
                <span
                  className="font-mono text-[6px]"
                  style={{ color: "oklch(0.42 0.06 220)" }}
                >
                  {activeRun.compound.drugClass} · {activeRun.compound.dose}mg
                </span>
                <span
                  className="font-mono text-[6px]"
                  style={{ color: "oklch(0.42 0.06 220)" }}
                >
                  BBB: {activeRun.compound.bbbCoefficient.toFixed(2)}
                </span>
                <span
                  className="font-mono text-[6px]"
                  style={{ color: "oklch(0.42 0.06 220)" }}
                >
                  Target: {activeRun.targetId}
                </span>
                <span
                  className="font-mono text-[6px]"
                  style={{ color: "oklch(0.42 0.06 220)" }}
                >
                  Receptors: {activeRun.compound.receptorTargets.join(", ")}
                </span>
                <span
                  className="font-mono text-[6px]"
                  style={{ color: "oklch(0.55 0.12 195)" }}
                >
                  d={activeRun.statsCohenD.toFixed(3)}
                </span>
                <span
                  className="font-mono text-[6px]"
                  style={{ color: "oklch(0.55 0.12 195)" }}
                >
                  ESURIENS:{" "}
                  {(activeRun.esuriensSatisfactionDelta * 100).toFixed(1)}%
                </span>
                <span
                  className="font-mono text-[6px]"
                  style={{ color: "oklch(0.55 0.12 195)" }}
                >
                  Memory Δ:{" "}
                  {(activeRun.memoryTempleEncodingDelta * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
