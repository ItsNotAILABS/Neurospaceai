/**
 * MESIE bridge for NeurospaceAI.
 *
 * Ported as a typed, dependency-free runtime boundary from:
 * FreddyCreates/Multi-Element-Spectral-Intelligence-Engine-MESIE-
 *
 * The bridge keeps MESIE's spectral components, Electro Layer signatures,
 * coherence, harmonic alignment, and Ancient Engine node lineage available
 * to the Mars perception and science-planning layers.
 */

export type MESIESpectralComponent = {
  name: string;
  frequencyHz: number[];
  amplitude: number[];
  elementWeight?: number;
  nodeId?: string;
};

export type MESIEAncientNode = {
  nodeId: string;
  lineageTags: string[];
  symbolicWeight?: number;
  resonanceGroup?: string;
};

export type MESIEMultiElementRecord = {
  recordId: string;
  components: MESIESpectralComponent[];
  ancientNodes?: MESIEAncientNode[];
  lineage: string[];
};

export type MESIEElectroSignature = {
  spectralCentroidHz: number;
  spectralSpreadHz: number;
  bandEnergy: Record<string, number>;
  frequencyResonance: number;
  coherence: number;
  harmonicAlignment: number;
};

export const MESIE_LINEAGE =
  "FreddyCreates/Multi-Element-Spectral-Intelligence-Engine-MESIE-";

function interpolate(
  x: number[],
  y: number[],
  target: number,
): number {
  if (x.length === 0 || y.length === 0) return 0;
  if (target <= x[0]) return y[0];
  if (target >= x[x.length - 1]) return y[y.length - 1];

  for (let index = 1; index < x.length; index += 1) {
    if (target <= x[index]) {
      const ratio = (target - x[index - 1]) / (x[index] - x[index - 1]);
      return y[index - 1] + ratio * (y[index] - y[index - 1]);
    }
  }
  return y[y.length - 1];
}

function aggregate(
  record: MESIEMultiElementRecord,
): { frequencyHz: number[]; amplitude: number[] } {
  const base = record.components[0];
  if (!base) return { frequencyHz: [], amplitude: [] };

  const frequencyHz = [...base.frequencyHz];
  const amplitude = frequencyHz.map((frequency) =>
    record.components.reduce(
      (sum, component) =>
        sum +
        Math.abs(
          interpolate(component.frequencyHz, component.amplitude, frequency),
        ) *
          Math.max(component.elementWeight ?? 1, 0),
      0,
    ),
  );
  return { frequencyHz, amplitude };
}

export function computeMESIESignature(
  record: MESIEMultiElementRecord,
): MESIEElectroSignature {
  const { frequencyHz, amplitude } = aggregate(record);
  if (frequencyHz.length === 0) {
    return {
      spectralCentroidHz: 0,
      spectralSpreadHz: 0,
      bandEnergy: {},
      frequencyResonance: 0,
      coherence: 0,
      harmonicAlignment: 0,
    };
  }

  const total = Math.max(amplitude.reduce((sum, value) => sum + value, 0), 1e-12);
  const centroidHz = frequencyHz.reduce(
    (sum, frequency, index) => sum + frequency * amplitude[index],
    0,
  ) / total;
  const spreadHz = Math.sqrt(
    frequencyHz.reduce(
      (sum, frequency, index) =>
        sum + (frequency - centroidHz) ** 2 * amplitude[index],
      0,
    ) / total,
  );

  const bands: Array<[number, number, string]> = [
    [0, 1, "band_low"],
    [1, 10, "band_mid"],
    [10, 100, "band_high"],
    [100, Number.POSITIVE_INFINITY, "band_ultra"],
  ];
  const bandEnergy = Object.fromEntries(
    bands.map(([low, high, name]) => [
      name,
      amplitude.reduce(
        (sum, value, index) =>
          sum + (frequencyHz[index] >= low && frequencyHz[index] < high ? value : 0),
        0,
      ),
    ]),
  );

  const mean = amplitude.reduce((sum, value) => sum + value, 0) /
    Math.max(amplitude.length, 1);
  const frequencyResonance = Math.max(...amplitude) / Math.max(mean, 1e-12);

  let coherence = 1;
  if (record.components.length > 1) {
    const deviations = frequencyHz.map((frequency) => {
      const values = record.components.map((component) =>
        interpolate(component.frequencyHz, component.amplitude, frequency),
      );
      const average = values.reduce((sum, value) => sum + value, 0) / values.length;
      return Math.sqrt(
        values.reduce((sum, value) => sum + (value - average) ** 2, 0) /
          values.length,
      );
    });
    coherence = 1 / (1 + deviations.reduce((sum, value) => sum + value, 0) / deviations.length);
  }

  const peakIndex = amplitude.indexOf(Math.max(...amplitude));
  const positiveFrequencies = frequencyHz.filter((frequency) => frequency > 0);
  const baseFrequency = Math.max(Math.min(...positiveFrequencies, frequencyHz[peakIndex]), 1e-12);
  const harmonicRatio = frequencyHz[peakIndex] / baseFrequency;
  const harmonicAlignment = 1 / (1 + Math.abs(harmonicRatio - Math.round(harmonicRatio)));

  return {
    spectralCentroidHz: centroidHz,
    spectralSpreadHz: spreadHz,
    bandEnergy,
    frequencyResonance,
    coherence,
    harmonicAlignment,
  };
}

export function electroDistance(
  reference: MESIEElectroSignature,
  candidate: MESIEElectroSignature,
): number {
  const bandKeys = new Set([
    ...Object.keys(reference.bandEnergy),
    ...Object.keys(candidate.bandEnergy),
  ]);
  const bandDelta = [...bandKeys].reduce(
    (sum, key) =>
      sum +
      (reference.bandEnergy[key] ?? 0) ** 2 -
      2 * (reference.bandEnergy[key] ?? 0) * (candidate.bandEnergy[key] ?? 0) +
      (candidate.bandEnergy[key] ?? 0) ** 2,
    0,
  );
  const vector = [
    reference.spectralCentroidHz - candidate.spectralCentroidHz,
    reference.spectralSpreadHz - candidate.spectralSpreadHz,
    reference.frequencyResonance - candidate.frequencyResonance,
    reference.coherence - candidate.coherence,
    reference.harmonicAlignment - candidate.harmonicAlignment,
    Math.sqrt(Math.max(0, bandDelta)),
  ];
  return Math.hypot(...vector);
}

export function ancientNodeAlignment(
  reference: MESIEMultiElementRecord,
  candidate: MESIEMultiElementRecord,
): number {
  const referenceIds = new Set(
    reference.components.map((component) => component.nodeId).filter(Boolean),
  );
  const candidateIds = new Set(
    candidate.components.map((component) => component.nodeId).filter(Boolean),
  );
  if (referenceIds.size === 0 && candidateIds.size === 0) return 1;
  if (referenceIds.size === 0 || candidateIds.size === 0) return 0;
  const intersection = [...referenceIds].filter((id) => candidateIds.has(id)).length;
  const union = new Set([...referenceIds, ...candidateIds]).size;
  return intersection / union;
}
