# Mathematical Intelligence Network — NeurospaceAI

## Definition

A Neurospace intelligence system is a network of specialized algorithms that receives observations, estimates hidden state, extracts structure, recalls relevant memory, evaluates actions, and emits bounded proposals.

It is intelligent in the engineering sense when it can:

- predict;
- reduce uncertainty;
- adapt to new evidence;
- coordinate multiple agents;
- choose under resource constraints;
- recover from error;
- explain and replay its decisions.

This definition does not assert subjective consciousness.

## Network

perception -> estimation -> spectral/MESIE -> memory -> planning -> policy -> action proposal

Feedback:

- action outcome -> perception;
- prediction error -> estimation;
- new signatures -> memory;
- resource state -> planning;
- human approval/rejection -> policy and memory.

Every message is a Belief:

- variable;
- value;
- variance;
- timestamp;
- source;
- evidence class.

## Mathematical foundations

### Bayesian precision fusion

For independent scalar observations with variance sigma_i squared:

precision_i = 1 / variance_i

fused_variance = 1 / sum(precision_i)

fused_value = fused_variance * sum(precision_i * value_i)

The implementation rejects non-positive or non-finite uncertainty.

### Information gain

For Gaussian belief variance:

information_gain = 0.5 * log(prior_variance / posterior_variance)

A measurement that reduces uncertainty produces positive information gain. This can drive active science and sensor selection.

### Decision utility

utility = information_gain
          - energy_weight * energy_cost
          - risk_weight * risk

This is a research objective function. The safety policy still constrains which actions may be proposed.

### Spectral intelligence

MESIE supplies spectral centroid, spread, band energy, coherence, harmonic alignment, and electro-distance. These are features for comparing observations, not evidence of consciousness.

### Network reliability

For a path of independent algorithm nodes:

path_reliability = product(node_reliability_i)

This helps the planner choose whether an answer has enough evidence or requires human review.

### Delay and staleness

A belief is stale when:

current_time - belief_timestamp > validity_window

A delayed belief must retain its original timestamp and link delay. The network must not silently treat an old Earth message as current local truth.

## Node responsibilities

- Perception: convert photons, telemetry, and human inputs into measurements.
- Estimation: maintain state and uncertainty using Kalman-style updates.
- Spectral: compute MESIE features and detect signal changes.
- Memory: retrieve and consolidate evidence-bearing records.
- Planning: score actions by mission value, energy, time, and risk.
- Policy: enforce authority, privacy, safety, and human override.

## Human position in the network

A human is not merely another sensor. Human nodes have:

- intent;
- values;
- consent;
- interpretation;
- authority;
- privacy;
- veto;
- responsibility.

The AI may request a decision, summarize state, simulate consequences, or execute a previously approved bounded task. It must not manufacture consent from a prediction.

## First experiments

1. Compare one large model against the specialist network on prediction error, energy, latency, and trace completeness.
2. Remove each node and measure degradation.
3. Inject contradictory measurements and verify uncertainty increases or the claim is rejected.
4. Add Mars delay and stale-message handling.
5. Compare MESIE features with baseline Euclidean and cosine metrics.
6. Put a human approval gate before irreversible actions and measure recovery from injected errors.
7. Test rover swarm consensus with packet loss and leader failure.
8. Replay identical seeds and require deterministic outputs.

## Current implementation

- src/frontend/src/lib/mars-crew/intelligence-network.ts
- src/frontend/src/lib/mars-crew/physics.ts
- src/frontend/src/lib/mars-crew/estimation.ts
- src/frontend/src/lib/mars-crew/photonic-neural.ts
- src/frontend/src/lib/mars-crew/perception.ts
- src/frontend/src/lib/mars-crew/mesie-bridge.ts
- src/frontend/src/lib/mars-crew/mesie-perception.ts
- src/frontend/src/lib/mars-crew/scenario.ts

## Hard boundary

The network is an explainable research system. It is not a flight controller, clinical system, legal authority, or proof of machine consciousness. Its claims remain bounded by its inputs, models, uncertainty, and tests.
