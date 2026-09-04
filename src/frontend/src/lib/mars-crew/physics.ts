/**
 * Deterministic physics primitives for the Mars crew simulator.
 *
 * All distances are metres, time is seconds, mass is kilograms,
 * temperature is Kelvin, and power is watts.
 */

export const SPEED_OF_LIGHT_M_S = 299_792_458;
export const STEFAN_BOLTZMANN_W_M2_K4 = 5.670_374_419e-8;

export type Vec2 = { x: number; y: number };
export type Vec3 = { x: number; y: number; z: number };

export type OrbitalState = {
  positionM: Vec3;
  velocityMps: Vec3;
};

export type RoverState = {
  positionM: Vec2;
  headingRad: number;
  linearVelocityMps: number;
  angularVelocityRadS: number;
};

export type PowerState = {
  storedEnergyJ: number;
  capacityJ: number;
};

export type ThermalState = {
  temperatureK: number;
  heatCapacityJPerK: number;
};

const add3 = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.x + b.x,
  y: a.y + b.y,
  z: a.z + b.z,
});

const scale3 = (a: Vec3, factor: number): Vec3 => ({
  x: a.x * factor,
  y: a.y * factor,
  z: a.z * factor,
});

const norm3 = (a: Vec3): number => Math.hypot(a.x, a.y, a.z);

export function oneWayLightDelaySeconds(distanceM: number): number {
  if (!Number.isFinite(distanceM) || distanceM < 0) {
    throw new Error("distanceM must be a finite non-negative number");
  }
  return distanceM / SPEED_OF_LIGHT_M_S;
}

export function twoBodyAccelerationMps2(
  positionM: Vec3,
  gravitationalParameterM3S2: number,
): Vec3 {
  const radius = norm3(positionM);
  if (radius === 0) throw new Error("position cannot be the zero vector");
  const factor = -gravitationalParameterM3S2 / radius ** 3;
  return scale3(positionM, factor);
}

function orbitalDerivative(
  state: OrbitalState,
  gravitationalParameterM3S2: number,
): OrbitalState {
  return {
    positionM: state.velocityMps,
    velocityMps: twoBodyAccelerationMps2(
      state.positionM,
      gravitationalParameterM3S2,
    ),
  };
}

/** Fixed-step RK4 integration for deterministic two-body propagation. */
export function integrateTwoBodyRK4(
  state: OrbitalState,
  dtSeconds: number,
  gravitationalParameterM3S2: number,
): OrbitalState {
  if (!Number.isFinite(dtSeconds) || dtSeconds <= 0) {
    throw new Error("dtSeconds must be positive and finite");
  }
  const k1 = orbitalDerivative(state, gravitationalParameterM3S2);
  const k2 = orbitalDerivative(
    {
      positionM: add3(state.positionM, scale3(k1.positionM, dtSeconds / 2)),
      velocityMps: add3(state.velocityMps, scale3(k1.velocityMps, dtSeconds / 2)),
    },
    gravitationalParameterM3S2,
  );
  const k3 = orbitalDerivative(
    {
      positionM: add3(state.positionM, scale3(k2.positionM, dtSeconds / 2)),
      velocityMps: add3(state.velocityMps, scale3(k2.velocityMps, dtSeconds / 2)),
    },
    gravitationalParameterM3S2,
  );
  const k4 = orbitalDerivative(
    {
      positionM: add3(state.positionM, scale3(k3.positionM, dtSeconds)),
      velocityMps: add3(state.velocityMps, scale3(k3.velocityMps, dtSeconds)),
    },
    gravitationalParameterM3S2,
  );

  const weighted = (a: Vec3, b: Vec3, c: Vec3, d: Vec3): Vec3 =>
    scale3(
      add3(add3(a, scale3(b, 2)), add3(scale3(c, 2), d)),
      dtSeconds / 6,
    );

  return {
    positionM: add3(
      state.positionM,
      weighted(k1.positionM, k2.positionM, k3.positionM, k4.positionM),
    ),
    velocityMps: add3(
      state.velocityMps,
      weighted(k1.velocityMps, k2.velocityMps, k3.velocityMps, k4.velocityMps),
    ),
  };
}

export function stepPowerState(
  state: PowerState,
  generationW: number,
  loadW: number,
  dtSeconds: number,
  chargeEfficiency = 1,
  dischargeEfficiency = 1,
): PowerState {
  if (dtSeconds < 0 || generationW < 0 || loadW < 0) {
    throw new Error("power values and dtSeconds must be non-negative");
  }
  const deltaJ =
    generationW * chargeEfficiency * dtSeconds -
    (loadW * dtSeconds) / Math.max(dischargeEfficiency, Number.EPSILON);
  return {
    ...state,
    storedEnergyJ: Math.min(
      state.capacityJ,
      Math.max(0, state.storedEnergyJ + deltaJ),
    ),
  };
}

export function radiatedPowerW(
  emissivity: number,
  areaM2: number,
  temperatureK: number,
  environmentTemperatureK: number,
): number {
  if (
    emissivity < 0 ||
    emissivity > 1 ||
    areaM2 < 0 ||
    temperatureK < 0 ||
    environmentTemperatureK < 0
  ) {
    throw new Error("invalid thermal parameter");
  }
  return (
    emissivity *
    STEFAN_BOLTZMANN_W_M2_K4 *
    areaM2 *
    (temperatureK ** 4 - environmentTemperatureK ** 4)
  );
}

export function stepThermalState(
  state: ThermalState,
  internalPowerW: number,
  solarPowerW: number,
  radiatedPowerWValue: number,
  conductedPowerW: number,
  dtSeconds: number,
): ThermalState {
  const netPowerW =
    internalPowerW + solarPowerW - radiatedPowerWValue - conductedPowerW;
  return {
    ...state,
    temperatureK:
      state.temperatureK + (netPowerW * dtSeconds) / state.heatCapacityJPerK,
  };
}

export function stepDifferentialDrive(
  state: RoverState,
  linearVelocityMps: number,
  angularVelocityRadS: number,
  dtSeconds: number,
): RoverState {
  if (dtSeconds < 0) throw new Error("dtSeconds must be non-negative");
  return {
    positionM: {
      x: state.positionM.x + linearVelocityMps * Math.cos(state.headingRad) * dtSeconds,
      y: state.positionM.y + linearVelocityMps * Math.sin(state.headingRad) * dtSeconds,
    },
    headingRad: state.headingRad + angularVelocityRadS * dtSeconds,
    linearVelocityMps,
    angularVelocityRadS,
  };
}
