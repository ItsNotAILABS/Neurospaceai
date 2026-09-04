# NeurospaceAI Physics and Algorithms Contract — V1

Status: prototype foundation
Date: 2026-09-04

## Purpose

This document defines the real physics and algorithms for the Mars crew, habitat, AI, and robotics simulator.

The system has three layers:

1. Physics: what the environment and hardware do.
2. Estimation and planning: what agents believe and choose under uncertainty.
3. Human meaning and governance: what people intend, authorize, remember, and verify.

Latin/Sanskrit symbols annotate the third layer and the evidence path. They do not replace physical models.

## 1. Space-time and communication physics

For two nodes separated by distance d:

t_one_way = d / c

where c = 299,792,458 m/s.

Round-trip time is 2 times the one-way delay.

For store-and-forward communication:

t_delivery = t_propagation + t_queue + t_processing + t_retransmission

Packet loss and link windows are separate variables. A message can arrive late without being lost.

Use a Bundle Protocol-inspired envelope containing source, destination, creation timestamp, expiry, priority, custody history, payload digest, privacy class, evidence class, and acknowledgement state.

## 2. Orbital and planetary geometry

For the first simulator, use a two-body approximation:

acceleration = -mu * position / norm(position)^3 + perturbation_acceleration

where mu = GM for the central body.

Use a fixed-step fourth-order Runge-Kutta integrator for deterministic testing. Later, add JPL SPICE kernels for mission-grade geometry and time conversion.

Every state includes reference frame, epoch, position, velocity, covariance, and time quality.

Never mix Mars-fixed, inertial, habitat-local, and rover-local coordinates without an explicit frame transform.

## 3. State estimation

Use an Extended Kalman Filter for initial navigation and habitat state estimation.

State prediction:

x_next = f(x, u) + process_noise

Covariance prediction:

P_next = F P F_transpose + Q

Measurement innovation:

residual = z - h(x)

Kalman gain:

K = P H_transpose (H P H_transpose + R)^-1

State update:

x_updated = x_predicted + K residual

Use Joseph-form covariance updates in implementation for numerical stability.

Initial sensors are IMU, visual landmarks, wheel odometry, depth, and habitat pressure, temperature, CO2, power, and storage telemetry.

The UI must display estimate, measurement, uncertainty, and rejected outlier separately.

## 4. Habitat physics

Power balance:

E_next = E + charging_efficiency * P_charge * dt - P_load * dt / discharge_efficiency

with 0 <= E <= E_max.

Loads include life support, compute, communications, thermal control, robotics, and crew equipment.

Thermal balance:

C * dT/dt = P_internal + P_solar - P_radiated - P_conducted

Radiated heat:

P_radiated = emissivity * Stefan_Boltzmann_constant * area * (T^4 - T_environment^4)

Use Kelvin for temperature and watts for power. Every simplified coefficient must be labeled as a model parameter.

For oxygen, carbon dioxide, water, and food:

mass_next = mass + mass_in - mass_out - mass_consumed

The simulator does not claim to model real human physiology until validated parameters are sourced.

## 5. Rover and robot dynamics

Start with a differential-drive rover:

x_velocity = v cos(theta)
y_velocity = v sin(theta)
theta_velocity = omega

Subject to speed, turn-rate, acceleration, battery, terrain slope, slip, obstacle clearance, and communication-range constraints.

For arms or humanoid simulators, use joint limits, velocity limits, collision constraints, and force thresholds. AI proposes task-space goals; the low-level controller remains bounded.

## 6. Planning and decision algorithms

At each control cycle, solve a finite-horizon constrained optimization that minimizes tracking error, control effort, and risk while satisfying dynamics, obstacle, power, thermal, communications, authority, and crew-safety constraints.

Only the first action is applied. The system updates its model and replans.

When the true state is not observable, represent belief as P(state | observations, actions). Use a simplified POMDP or belief-space planner for high-level decisions. Never describe an uncertain belief as a fact.

For candidate science observation a:

information_gain = entropy_prior - expected_entropy_after_observation

Select observations by information gain minus weighted energy, time, and risk cost.

## 7. Multi-agent robotics

Represent rover communication as a graph G=(V,E) with Laplacian L.

A basic consensus law is:

state_change_i = -k * sum(state_i - state_neighbor)

The discrete implementation must test disconnected graphs, stale data, clock drift, and leader loss.

Task allocation can begin with a scored auction:

bid = information_gain - energy_cost - time_cost - risk + capability_match

No rover may claim a task without reporting the state and assumptions used for its bid.

## 8. Fault detection and recovery

Start with residual-based detection:

residual = measurement - predicted_measurement

Normalize by innovation covariance:

NIS = residual_transpose * covariance_inverse * residual

A fault candidate is generated when NIS exceeds a configured threshold for a defined duration. Threshold and duration are parameters with provenance.

Use a fault graph to propagate consequences across power, thermal, communications, payload, and crew workload.

Recovery planning compares safe mode, degraded operation, repair task, crew intervention, and delayed Earth escalation.

Every recovery has an authority scope and rollback or stop behavior.

## 9. Human-AI-robot control

The control mode is a state machine:

direct -> shared -> supervisory -> delegated -> collective

Transitions depend on link latency, task risk, estimator uncertainty, robot confidence, human workload, authority, and reversibility.

Every transition creates a typed event containing coordinate frame, state relation, control rule, evidence, prohibited actions, retained trace, operator identity, and consent.

The symbol is metadata. Equations and state estimates determine whether the action is valid.

## 10. Human cognitive-load model

Begin with an operational workload index:

Load = a interruptions + b active_tasks + c unresolved_decisions + d uncertainty + e sleep_debt

The coefficients are experimental parameters. Compare raw alerting, rule-based triage, and AI triage with explanations.

Measure missed alarms, unnecessary interruptions, task completion, response time, and recovery quality.

## 11. Reproducibility

Every run stores random seed, integrator, timestep, constants, units, model version, scenario, initial state, observations, estimator outputs, planner outputs, human decisions, faults, final state, metrics, and digest.

Claim labels:

- Established: standard physics, sourced constant, or reproducible result.
- Model: approximation or algorithm with assumptions.
- Doctrine: human value, naming system, policy preference, or metaphor.

## Initial implementation order

1. mars-crew/physics.ts: time, delay, power, thermal, rover kinematics.
2. mars-crew/estimation.ts: EKF and residual checks.
3. mars-crew/planning.ts: constrained scoring and MPC-compatible interfaces.
4. mars-crew/swarm.ts: graph consensus and task auction.
5. mars-crew/receipts.ts: evidence and control handoffs.
6. mars-crew/scenario.ts: deterministic seeded faults.
7. MarsCrewLabTab.tsx: visualization and replay.

## Primary references

- NASA NAIF SPICE: https://naif.jpl.nasa.gov/
- NASA/JPL autonomous systems: https://www.jpl.nasa.gov/about/strategic-implementation-plan/capabilities/2/
- NASA/JPL EKF navigation: https://robotics.jpl.nasa.gov/what-we-do/research-tasks/spacecraft-pin-point-landing/
- NASA/JPL autonomous spacecraft operations: https://ai.jpl.nasa.gov/public/projects/ops-for-autonomy/
- NASA distributed spacecraft autonomy: https://www.nasa.gov/centers-and-facilities/ames/what-is-nasas-distributed-spacecraft-autonomy/
- IETF Bundle Protocol v7: https://datatracker.ietf.org/doc/rfc9171/
