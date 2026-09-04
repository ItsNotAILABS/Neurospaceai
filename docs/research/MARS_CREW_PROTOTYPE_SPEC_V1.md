# NeurospaceAI Mars Crew Prototype — Build Specification V1

Status: first executable research target
Program: NeurospaceAI Human–AI Space Architecture
Date: 2026-09-04

## Objective

Simulate a four-person Mars crew operating a habitat and rover team while Earth communication is delayed or unavailable.

The prototype must test whether AI can improve crew capability without becoming an opaque authority.

## Scenario

A four-person crew is conducting a 30-day simulated surface mission.

Environment:

- one habitat;
- one local mission-control console;
- four crew members with different roles and workload;
- four rover agents;
- limited power, oxygen, water, food, compute, and bandwidth;
- 4–22 minute one-way Earth communication delay;
- scheduled communication windows;
- dust, thermal, navigation, sensor, and equipment faults;
- scientific targets with changing information value.

## Human roles

Each crew member has:

- role and authority scope;
- skills and training;
- fatigue and workload state;
- private memory;
- medical privacy boundary;
- current task queue;
- confidence and disagreement state;
- ability to approve, reject, modify, or escalate AI proposals.

Suggested roles:

- commander / mission planner;
- flight and habitat systems;
- science lead;
- crew medical officer / EVA lead.

The roles are simulation variables, not claims about real crew selection.

## AI roles

### Local mission-control AI

- maintains the mission state;
- proposes schedules;
- detects conflicts;
- summarizes rover and habitat state;
- simulates consequences;
- recommends escalation;
- drafts Earth communication bundles;
- never bypasses human authority.

### Memory AI

Routes information into:

- private memory;
- crew-shared memory;
- medical memory;
- public science memory;
- immutable safety log.

Every retrieval must show source, age, evidence class, access reason, and confidence.

### Medical decision-support AI

- monitors synthetic health data;
- compares against personal baseline;
- retrieves procedures;
- accounts for supplies and delay;
- presents possibilities and uncertainty;
- requires crew medical officer approval;
- records an evidence trace.

This is a research simulator, not a medical device.

### Robotics AI

- manages rover task proposals;
- plans safe routes;
- handles local obstacle avoidance;
- reports uncertainty;
- coordinates multi-rover work;
- requests human intervention when outside its envelope.

## Control modes

The prototype must support:

1. Direct control.
2. Shared control.
3. Supervisory control.
4. Delegated autonomy.
5. Collective multi-rover supervision.

Every mode switch creates a handoff receipt.

## Habitat state

Minimum simulated subsystems:

- power generation and storage;
- oxygen and carbon-dioxide balance;
- water and food inventory;
- thermal control;
- communications;
- compute and storage;
- airlock and EVA readiness;
- medical supplies;
- maintenance backlog;
- rover fleet status.

Each subsystem exposes telemetry, nominal range, degraded range, fault modes, and recovery actions.

## Memory record

Each record includes:

- record ID;
- owner and visibility class;
- symbol IDs;
- timestamp and clock uncertainty;
- source agent;
- observed/inferred/model/doctrine classification;
- confidence;
- parent mission, habitat, person, rover, or experiment;
- causal links;
- retention and expiry policy;
- correction and supersession history;
- content digest;
- synchronization status.

## Communication model

Earth messages and mission bundles include:

- origin and destination;
- creation time;
- delivery deadline;
- priority;
- privacy class;
- evidence class;
- digest;
- payload;
- custody history;
- acknowledgement state.

Test policies:

- FIFO;
- urgency-first;
- safety-first;
- evidence-aware;
- information-gain-aware;
- semantic summary before raw data.

## Fault scenarios

Initial scenarios:

- 30% packet loss during a rover task;
- delayed Earth instruction that conflicts with local reality;
- rover leader failure;
- false habitat sensor;
- power shortage;
- thermal excursion;
- medical anomaly with incomplete data;
- corrupted or stale memory;
- AI recommendation outside authority;
- simultaneous high-priority alarms;
- crew disagreement about an irreversible action.

## Verification surfaces

Every scenario must produce:

- input seed;
- environment configuration;
- model versions;
- crew actions;
- AI proposals;
- rejected and accepted actions;
- control handoffs;
- faults;
- communications;
- memory writes;
- final state;
- metrics;
- replay digest.

The public page should permit a viewer to replay the scenario and distinguish measured result, model output, and design doctrine.

## Initial success criteria

The prototype is successful when:

- the crew can continue safely through a communication outage;
- local AI proposals remain inside authority boundaries;
- humans catch injected AI errors;
- control can be reclaimed immediately;
- rover coordination degrades gracefully after agent loss;
- private and medical memory do not leak into public output;
- mission summaries remain auditable back to evidence;
- replay produces the same result from the same seed;
- workload and interruption metrics improve against a no-assistant baseline.

## Implementation order

### Slice 1: deterministic simulator

Create typed state for crew, habitat, rovers, communications, memory, and mission clock.

### Slice 2: event and receipt ledger

Record observations, proposals, approvals, actions, faults, and outcomes.

### Slice 3: delayed communications

Add link windows, latency, packet loss, custody, prioritization, and semantic bundles.

### Slice 4: local mission control

Add schedule proposals, fault summaries, digital-twin projections, and human approvals.

### Slice 5: rover swarm

Add shared maps, task allocation, leader loss, shared autonomy, and handoff modes.

### Slice 6: human memory boundaries

Add personal, crew, medical, public, and immutable memory routing with correction history.

### Slice 7: replay and public verification

Expose scenario playback, evidence traces, model versions, and KILN ownership/provenance receipts.

## First repository modules

Suggested future module layout:

- `src/sim/mars-crew/`
- `src/sim/mars-crew/crew.ts`
- `src/sim/mars-crew/habitat.ts`
- `src/sim/mars-crew/rovers.ts`
- `src/sim/mars-crew/comms.ts`
- `src/sim/mars-crew/memory.ts`
- `src/sim/mars-crew/receipts.ts`
- `src/sim/mars-crew/scenarios/`
- `src/frontend/src/tabs/MarsCrewLabTab.tsx`

The Motoko canister should store public registry metadata and verification anchors. Flight-like simulation state belongs in a dedicated runtime so a public ledger cannot become a hidden safety dependency.

## Design rule

The AI is not the captain, the doctor, the crew, or the robot.

It is the connective tissue that helps humans see, remember, simulate, coordinate, and act under distance.
