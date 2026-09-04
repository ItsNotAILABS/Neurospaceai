import {
  centerSurroundContrast,
  sampleRetinalEvent,
  stepLIF,
  type LIFState,
  type NeuralEvent,
  type PhotonField,
  type RetinalChannel,
} from "./photonic-neural";

export type VisualPatch = {
  id: string;
  wavelengthNm: number;
  irradianceWPerM2: number;
  centerExposureM2: number;
  surroundIrradianceWPerM2: number;
  hazardPrior: number;
};

export type RoverPerception = {
  roverId: string;
  timeSeconds: number;
  events: NeuralEvent[];
  contrast: number;
  spike: boolean;
  visualConfidence: number;
  hazardScore: number;
  evidence: "measured-sensor" | "model-inference";
};

const channels: RetinalChannel[] = [
  "rod",
  "short-cone",
  "medium-cone",
  "long-cone",
];

export function perceiveVisualPatch(
  roverId: string,
  patch: VisualPatch,
  timeSeconds: number,
  lifState: LIFState,
  seed = 1,
): { perception: RoverPerception; lifState: LIFState } {
  const baseField: PhotonField = {
    irradianceWPerM2: patch.irradianceWPerM2,
    wavelengthNm: patch.wavelengthNm,
    exposureAreaM2: patch.centerExposureM2,
    exposureSeconds: 0.01,
  };
  const events = channels.map((channel, index) =>
    sampleRetinalEvent(baseField, channel, seed + index),
  );
  const contrast = centerSurroundContrast(
    patch.irradianceWPerM2,
    patch.surroundIrradianceWPerM2,
  );
  const neuralInput = Math.max(0, contrast) + events.reduce(
    (sum, event) => sum + event.signal,
    0,
  ) / Math.max(events.length, 1);
  const neural = stepLIF(lifState, neuralInput, 0.01, timeSeconds);
  const photonConfidence = Math.min(
    1,
    events.reduce((sum, event) => sum + event.count, 0) / 100,
  );
  const visualConfidence = Math.max(
    0,
    Math.min(1, 0.5 * photonConfidence + 0.5 * (neural.spike ? 1 : 0)),
  );

  return {
    perception: {
      roverId,
      timeSeconds,
      events,
      contrast,
      spike: neural.spike,
      visualConfidence,
      hazardScore: Math.max(
        0,
        Math.min(1, patch.hazardPrior * (0.5 + 0.5 * visualConfidence)),
      ),
      evidence: "model-inference",
    },
    lifState: neural.state,
  };
}

export function rankVisualPatches(
  patches: RoverPerception[],
): RoverPerception[] {
  return [...patches].sort(
    (a, b) =>
      b.hazardScore * b.visualConfidence -
      a.hazardScore * a.visualConfidence,
  );
}
