import { SPEED_OF_LIGHT_M_S, type NeuralEvent } from "./photonic-neural";
import {
  computeMESIESignature,
  type MESIEMultiElementRecord,
  type MESIEElectroSignature,
} from "./mesie-bridge";

const channelFrequencyOffsetHz: Record<NeuralEvent["channel"], number> = {
  rod: 498,
  "short-cone": 420,
  "medium-cone": 534,
  "long-cone": 564,
};

export function photonEventsToMESIERecord(
  roverId: string,
  events: NeuralEvent[],
  timeSeconds: number,
): MESIEMultiElementRecord {
  const components = events.map((event) => {
    const wavelengthNm = channelFrequencyOffsetHz[event.channel];
    const frequencyHz = SPEED_OF_LIGHT_M_S / (wavelengthNm * 1e-9);
    return {
      name: `${roverId}:${event.channel}`,
      frequencyHz: [frequencyHz],
      amplitude: [event.signal],
      elementWeight: 1,
      nodeId: `${roverId}:retina:${event.channel}`,
    };
  });

  return {
    recordId: `${roverId}:photon-field:${timeSeconds.toFixed(3)}`,
    components,
    ancientNodes: [
      {
        nodeId: `${roverId}:retina`,
        lineageTags: ["MESIE", "photonic-neural", "rover-perception"],
        symbolicWeight: 1,
        resonanceGroup: "visual-sensorium",
      },
    ],
    lineage: [
      "NeurospaceAI",
      "MESIE",
      "photons",
      "retinal-channel",
      "neural-event",
    ],
  };
}

export function computePhotonMESIESignature(
  roverId: string,
  events: NeuralEvent[],
  timeSeconds: number,
): MESIEElectroSignature {
  return computeMESIESignature(
    photonEventsToMESIERecord(roverId, events, timeSeconds),
  );
}
