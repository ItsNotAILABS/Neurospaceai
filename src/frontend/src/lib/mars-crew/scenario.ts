import {
  oneWayLightDelaySeconds,
  stepDifferentialDrive,
  stepPowerState,
  stepThermalState,
  type PowerState,
  type RoverState,
  type ThermalState,
} from "./physics";
import { consensusStep, predictScalar, updateScalar } from "./estimation";

export type CrewRole = "commander" | "systems" | "science" | "medical";

export type CrewMember = {
  id: string;
  role: CrewRole;
  fatigue: number;
  workload: number;
  healthSignal: number;
  privateMemoryIds: string[];
};

export type HabitatState = {
  power: PowerState;
  thermal: ThermalState;
  oxygenKg: number;
  carbonDioxideKg: number;
  waterKg: number;
  communicationOnline: boolean;
  maintenanceBacklog: number;
};

export type RoverAgent = {
  id: string;
  state: RoverState;
  batteryJ: number;
  localMapConfidence: number;
  leader: boolean;
  connectedPeerIds: string[];
  taskId?: string;
};

export type DelayedMessage = {
  id: string;
  source: string;
  destination: string;
  createdAtS: number;
  deliverAtS: number;
  priority: "safety" | "mission" | "science" | "routine";
  payload: string;
};

export type MarsScenarioState = {
  seed: number;
  timeS: number;
  earthMarsDistanceM: number;
  oneWayDelayS: number;
  crew: CrewMember[];
  habitat: HabitatState;
  rovers: RoverAgent[];
  messages: DelayedMessage[];
  events: string[];
};

export type ScenarioFault =
  | "packet-loss"
  | "rover-leader-loss"
  | "power-shortage"
  | "thermal-excursion"
  | "false-sensor";

function nextRandom(seed: number): { seed: number; value: number } {
  const next = (seed * 1_664_525 + 1_013_904_223) >>> 0;
  return { seed: next, value: next / 4_294_967_296 };
}

export function createMarsScenario(seed = 42): MarsScenarioState {
  const earthMarsDistanceM = 225_000_000_000;
  const crew: CrewMember[] = [
    ["AURELIA", "commander"],
    ["KALPA", "systems"],
    ["RATIO", "science"],
    ["SMRTI", "medical"],
  ].map(([id, role]) => ({
    id,
    role: role as CrewRole,
    fatigue: 0.12,
    workload: 0.18,
    healthSignal: 1,
    privateMemoryIds: [],
  }));

  const makeRover = (id: string, x: number, y: number): RoverAgent => ({
    id,
    state: {
      positionM: { x, y },
      headingRad: 0,
      linearVelocityMps: 0,
      angularVelocityRadS: 0,
    },
    batteryJ: 2_000_000,
    localMapConfidence: 0.65,
    leader: id === "ROVER-1",
    connectedPeerIds: ["ROVER-1", "ROVER-2", "ROVER-3", "ROVER-4"].filter(
      (peerId) => peerId !== id,
    ),
  });

  return {
    seed,
    timeS: 0,
    earthMarsDistanceM,
    oneWayDelayS: oneWayLightDelaySeconds(earthMarsDistanceM),
    crew,
    habitat: {
      power: { storedEnergyJ: 180_000_000, capacityJ: 240_000_000 },
      thermal: { temperatureK: 295, heatCapacityJPerK: 2_000_000 },
      oxygenKg: 720,
      carbonDioxideKg: 2,
      waterKg: 2_400,
      communicationOnline: true,
      maintenanceBacklog: 0,
    },
    rovers: [
      makeRover("ROVER-1", 0, 0),
      makeRover("ROVER-2", 4, 0),
      makeRover("ROVER-3", 0, 4),
      makeRover("ROVER-4", 4, 4),
    ],
    messages: [],
    events: ["scenario-created"],
  };
}

export function enqueueEarthMessage(
  scenario: MarsScenarioState,
  payload: string,
  priority: DelayedMessage["priority"] = "mission",
): MarsScenarioState {
  const message: DelayedMessage = {
    id: `MSG-${scenario.messages.length + 1}`,
    source: "EARTH",
    destination: "HABITAT",
    createdAtS: scenario.timeS,
    deliverAtS: scenario.timeS + scenario.oneWayDelayS,
    priority,
    payload,
  };
  return { ...scenario, messages: [...scenario.messages, message] };
}

export function injectFault(
  scenario: MarsScenarioState,
  fault: ScenarioFault,
): MarsScenarioState {
  switch (fault) {
    case "packet-loss":
      return {
        ...scenario,
        habitat: { ...scenario.habitat, communicationOnline: false },
        events: [...scenario.events, "fault:packet-loss"],
      };
    case "rover-leader-loss":
      return {
        ...scenario,
        rovers: scenario.rovers.map((rover) =>
          rover.leader ? { ...rover, leader: false } : rover,
        ),
        events: [...scenario.events, "fault:rover-leader-loss"],
      };
    case "power-shortage":
      return {
        ...scenario,
        habitat: {
          ...scenario.habitat,
          power: { ...scenario.habitat.power, storedEnergyJ: 10_000_000 },
        },
        events: [...scenario.events, "fault:power-shortage"],
      };
    case "thermal-excursion":
      return {
        ...scenario,
        habitat: {
          ...scenario.habitat,
          thermal: { ...scenario.habitat.thermal, temperatureK: 325 },
        },
        events: [...scenario.events, "fault:thermal-excursion"],
      };
    case "false-sensor":
      return {
        ...scenario,
        crew: scenario.crew.map((member) =>
          member.role === "medical"
            ? { ...member, healthSignal: 0.2 }
            : member,
        ),
        events: [...scenario.events, "fault:false-sensor"],
      };
  }
}

export function electRoverLeader(scenario: MarsScenarioState): MarsScenarioState {
  const leader = scenario.rovers
    .filter((rover) => rover.batteryJ > 500_000 && rover.localMapConfidence > 0.4)
    .sort((a, b) => b.localMapConfidence - a.localMapConfidence)[0];

  return {
    ...scenario,
    rovers: scenario.rovers.map((rover) => ({
      ...rover,
      leader: rover.id === leader?.id,
    })),
    events: leader
      ? [...scenario.events, `leader-elected:${leader.id}`]
      : [...scenario.events, "leader-election-failed"],
  };
}

export function stepMarsScenario(
  scenario: MarsScenarioState,
  dtSeconds: number,
): MarsScenarioState {
  if (dtSeconds <= 0) throw new Error("dtSeconds must be positive");

  let seed = scenario.seed;
  const habitat = scenario.habitat;
  const power = stepPowerState(
    habitat.power,
    habitat.communicationOnline ? 1_200 : 900,
    3_800,
    dtSeconds,
    0.96,
    0.94,
  );
  const radiated = 0.82 * 5.670_374_419e-8 * 12 * (habitat.thermal.temperatureK ** 4 - 4 ** 4);
  const thermal = stepThermalState(
    habitat.thermal,
    1_200,
    0,
    radiated,
    80,
    dtSeconds,
  );

  const rovers = scenario.rovers.map((rover) => {
    const random = nextRandom(seed);
    seed = random.seed;
    const targetVelocity = rover.taskId ? 0.4 : 0;
    const targetTurn = (random.value - 0.5) * 0.2;
    const state = stepDifferentialDrive(
      rover.state,
      targetVelocity,
      targetTurn,
      dtSeconds,
    );
    const neighborConfidence = scenario.rovers
      .filter((peer) => rover.connectedPeerIds.includes(peer.id))
      .map((peer) => peer.localMapConfidence);
    const confidence = Math.max(
      0,
      Math.min(1, consensusStep(rover.localMapConfidence, neighborConfidence, 0.2)),
    );
    return {
      ...rover,
      state,
      batteryJ: Math.max(0, rover.batteryJ - 600 * dtSeconds),
      localMapConfidence: confidence,
    };
  });

  const crew = scenario.crew.map((member) => {
    const prediction = predictScalar(
      { value: member.healthSignal, variance: 0.01 },
      0,
      dtSeconds,
      0.001,
    );
    const measurement = updateScalar(prediction.estimate, {
      value: member.healthSignal,
      variance: 0.02,
    });
    return {
      ...member,
      fatigue: Math.min(1, member.fatigue + 0.00002 * dtSeconds),
      workload: Math.min(1, member.workload + (power.storedEnergyJ < 20_000_000 ? 0.0001 : 0)),
      healthSignal: measurement.estimate.value,
    };
  });

  const delivered = scenario.messages
    .filter((message) => message.deliverAtS <= scenario.timeS + dtSeconds)
    .map((message) => `delivered:${message.id}`);
  const pendingMessages = scenario.messages.filter(
    (message) => message.deliverAtS > scenario.timeS + dtSeconds,
  );

  return {
    ...scenario,
    seed,
    timeS: scenario.timeS + dtSeconds,
    crew,
    habitat: {
      ...habitat,
      power,
      thermal,
      oxygenKg: Math.max(0, habitat.oxygenKg - 0.0008 * dtSeconds),
      carbonDioxideKg: habitat.carbonDioxideKg + 0.0007 * dtSeconds,
      waterKg: Math.max(0, habitat.waterKg - 0.001 * dtSeconds),
      maintenanceBacklog:
        habitat.maintenanceBacklog + (power.storedEnergyJ < 20_000_000 ? 0.01 : 0),
    },
    rovers,
    messages: pendingMessages,
    events: [...scenario.events, ...delivered].slice(-200),
  };
}
