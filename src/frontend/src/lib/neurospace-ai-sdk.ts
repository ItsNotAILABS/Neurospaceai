import {
  createMarsScenario,
  electRoverLeader,
  enqueueEarthMessage,
  injectFault,
  stepMarsScenario,
  type MarsScenarioState,
  type ScenarioFault,
} from "./mars-crew/scenario";
import {
  sampleRetinalEvent,
  type PhotonField,
  type NeuralEvent,
} from "./mars-crew/photonic-neural";
import { computePhotonMESIESignature } from "./mars-crew/mesie-perception";
import {
  createIntelligenceNetwork,
  makeFusionNode,
  makeMeasurementNode,
  type Belief,
} from "./mars-crew/intelligence-network";
import {
  createUnifiedMind,
  stepUnifiedMind,
  type UnifiedMind,
  type UnifiedMindState,
} from "./mars-crew/unified-mind";

export type Observation = {
  roverId: string;
  photonField: PhotonField;
  timeSeconds: number;
  events: NeuralEvent[];
  mesieSignature: ReturnType<typeof computePhotonMESIESignature>;
};

export type MindStep = {
  scenario: MarsScenarioState;
  mind: UnifiedMindState;
  observations: Observation[];
  producedBeliefs: Belief[];
  rejectedBeliefs: Array<{ belief: Belief; reason: string }>;
};

function createMissionNetwork() {
  const camera = makeMeasurementNode(
    "camera-visible",
    "targetConfidence",
    0.72,
    0.04,
  );
  const mesie = makeMeasurementNode(
    "mesie-spectral",
    "targetConfidence",
    0.81,
    0.08,
  );
  const fusion = makeFusionNode("state-estimator", "targetConfidence");

  return createIntelligenceNetwork(
    [camera, mesie, fusion],
    [
      {
        from: camera.id,
        to: fusion.id,
        bandwidthBitsPerSecond: 1_000_000,
        delayS: 0.01,
        enabled: true,
      },
      {
        from: mesie.id,
        to: fusion.id,
        bandwidthBitsPerSecond: 1_000_000,
        delayS: 0.01,
        enabled: true,
      },
    ],
  );
}

export class NeurospaceMindSDK {
  private scenario: MarsScenarioState;
  private mind: UnifiedMind;
  private observations: Observation[] = [];

  constructor(seed = 42) {
    this.scenario = createMarsScenario(seed);
    this.mind = createUnifiedMind(createMissionNetwork());
  }

  getScenario(): MarsScenarioState {
    return this.scenario;
  }

  getMind(): UnifiedMindState {
    return this.mind.state;
  }

  observePhotons(
    roverId: string,
    photonField: PhotonField,
  ): Observation {
    const channels = ["rod", "short-cone", "medium-cone", "long-cone"] as const;
    const events = channels.map((channel, index) =>
      sampleRetinalEvent(photonField, channel, this.scenario.seed + index),
    );
    const mesieSignature = computePhotonMESIESignature(
      roverId,
      events,
      this.scenario.timeS,
    );
    const observation = {
      roverId,
      photonField,
      timeSeconds: this.scenario.timeS,
      events,
      mesieSignature,
    };
    this.observations = [...this.observations, observation].slice(-128);
    return observation;
  }

  ingestBelief(belief: Belief): void {
    if (!Number.isFinite(belief.value) || belief.variance <= 0) {
      throw new Error("belief must have a finite value and positive variance");
    }
    this.mind = {
      ...this.mind,
      network: {
        ...this.mind.network,
        beliefs: [...this.mind.network.beliefs, belief],
      },
    };
  }

  step(hours = 0.25): MindStep {
    if (hours <= 0) throw new Error("hours must be positive");
    const seconds = hours * 3600;
    this.scenario = stepMarsScenario(this.scenario, seconds);
    const result = stepUnifiedMind(this.mind, seconds);
    this.mind = result.mind;
    return {
      scenario: this.scenario,
      mind: this.mind.state,
      observations: this.observations,
      producedBeliefs: result.networkResult.produced,
      rejectedBeliefs: result.networkResult.rejected,
    };
  }

  injectFault(fault: ScenarioFault): MarsScenarioState {
    this.scenario = injectFault(this.scenario, fault);
    return this.scenario;
  }

  electRoverLeader(): MarsScenarioState {
    this.scenario = electRoverLeader(this.scenario);
    return this.scenario;
  }

  sendEarthMessage(
    payload: string,
    priority: "safety" | "mission" | "science" | "routine" = "mission",
  ): MarsScenarioState {
    this.scenario = enqueueEarthMessage(this.scenario, payload, priority);
    return this.scenario;
  }

  reset(seed = 42): void {
    this.scenario = createMarsScenario(seed);
    this.mind = createUnifiedMind(createMissionNetwork());
    this.observations = [];
  }
}

export function createNeurospaceMind(seed = 42): NeurospaceMindSDK {
  return new NeurospaceMindSDK(seed);
}
