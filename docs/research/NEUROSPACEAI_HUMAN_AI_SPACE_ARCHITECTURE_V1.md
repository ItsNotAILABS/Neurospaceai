# NeurospaceAI Human–AI Space Architecture — V1

Status: research direction
Date: 2026-09-04

## Core thesis

The long-term product is not autonomous spacecraft without people. It is a human–AI mission civilization in which:

- humans provide meaning, goals, judgment, consent, embodied experience, and moral responsibility;
- AI provides continuous observation, memory, simulation, translation, scheduling, diagnosis support, and attention management;
- machines and habitats provide the physical environment and enforce deterministic safety boundaries.

The correct design target is a local crew intelligence: a trusted, inspectable layer that helps a small crew operate independently when Earth is delayed or unavailable.

NASA's CHAPEA analog missions explicitly study year-long isolation, resource limits, communication delay, maintenance, medical technology, food production, and behavioral performance. NASA's human-spaceflight standard treats human factors, habitability, and environmental health as system requirements, not cosmetic interface concerns.

## Human-centered space topology

The existing Neurospace nested topology becomes:

- person: biological state, goals, permissions, privacy, memory;
- crew: relationships, roles, shared plans, conflict state, collective workload;
- habitat: air, water, power, thermal, food, tools, rooms, and local mission control;
- vehicle/network: transport, communications, navigation, robotics, and external agents;
- mission: scientific, survival, construction, or settlement objectives;
- civilization: shared knowledge, law, culture, ownership, and intergenerational memory.

The key object is a handoff, not a command. A handoff records:

- who or what initiated it;
- what was observed;
- what was inferred;
- what remains uncertain;
- what options were considered;
- what authority exists;
- what the human accepted, rejected, or deferred;
- what happened afterward.

## Six human–AI capabilities to build

### 1. Local mission control

For Mars-class delay, a crew cannot depend on continuous Earth approval. Build an in-habitat mission control layer that coordinates:

- daily plans and replanning;
- rover and robot work;
- maintenance;
- science;
- power and consumables;
- health and exercise;
- emergency procedures;
- communication windows.

AI proposes and explains plans. Crew members can inspect assumptions, simulate consequences, edit priorities, and approve bounded actions.

### 2. Crew memory and personal memory

Separate memory into explicit domains:

- private personal memory;
- confidential medical memory;
- crew-shared operational memory;
- public science memory;
- immutable safety and event log.

The AI must show why a memory was retrieved, who can see it, when it was created, whether it is measured or inferred, and how it can be corrected or revoked. A crew member must be able to say: “Do not retain this,” “share only with the medical officer,” or “publish after mission review.”

### 3. Earth-independent medical decision support

NASA research describes a clinical decision-support system for long-duration missions that gathers passive and active health data and supports the crew medical officer when real-time terrestrial care is unavailable.

NeurospaceAI should not position itself as an autonomous doctor. It should build an evidence-linked medical copilot with:

- sensor and self-report ingestion;
- personal baseline and drift detection;
- medication and supply awareness;
- differential possibilities, not unsupported certainty;
- procedure retrieval;
- crew medical officer approval;
- escalation and evacuation thresholds;
- complete audit trail.

Medical data must be compartmentalized and encrypted. Training or model improvement requires explicit governance.

### 4. Cognitive load and attention protection

A habitat AI should manage interruptions as a scarce resource. It should:

- merge redundant alerts;
- distinguish urgent from important;
- schedule maintenance around sleep and exercise;
- detect overload and degraded performance;
- provide quiet modes;
- preserve the reason for every interruption;
- avoid emotionally manipulative persuasion;
- never hide an alarm merely to keep the crew calm.

The research output should be a workload model, not a claim that an AI can read consciousness.

### 5. Human–robot teaming

Crew should assign intent while robots handle repetitive, hazardous, or distant work. The interface needs:

- natural language and symbolic commands;
- visual mission state;
- simulation before execution;
- explicit safety envelope;
- reversible actions where possible;
- explainable failure and recovery;
- clear distinction between “recommended,” “queued,” “executing,” and “verified.”

A robot may be an agent in the system, but it is not a moral peer or a legal owner by default.

### 6. Cultural and linguistic continuity

The Latin and Sanskrit symbol work can become a human-readable mission grammar:

- Latin identifiers for stable ontology, governance, and provenance;
- Sanskrit-derived operators for rule, context, restriction, evidence, and memory;
- crew-defined local symbols for rituals, landmarks, emotional states, and habitat practices.

This must be a living, consent-based cultural layer. It should help humans remember and coordinate, not turn historical languages into fake physics or sacred authorization.

## Novel technology to pursue

### Sovereign Crew Intelligence

Build an open protocol and reference implementation for local human–AI mission operations:

1. multimodal observation;
2. typed symbolic representation;
3. personal/crew/habitat memory routing;
4. world-model and digital twin;
5. plan proposals;
6. human review;
7. deterministic safety gate;
8. action execution;
9. result receipt;
10. delayed synchronization to Earth.

The distinguishing feature is that humans remain first-class stateful agents with agency, privacy, uncertainty, and veto rights.

### Delayed-trust interface

For disconnected missions, trust cannot depend on immediate human supervision. Build an interface that shows:

- what the AI knows locally;
- what it does not know;
- which Earth instructions are stale;
- which actions are safe under local authority;
- which decisions require crew consensus;
- which messages are awaiting confirmation;
- what changed since the last sync.

### Crew digital twin

Model not only vehicle health but the interaction between crew, habitat, and mission:

- consumables;
- sleep and circadian schedule;
- exercise;
- workload;
- maintenance backlog;
- medical status;
- psychological and team indicators;
- communication delay;
- robot availability;
- unresolved decisions.

The twin should be used for planning and safety review, not surveillance theater. Crew members need visibility into what is modeled about them.

### Human-verifiable semantic downlink

Send mission summaries that preserve human meaning:

- event;
- context;
- evidence;
- uncertainty;
- proposed interpretation;
- consequences;
- raw-data digest;
- privacy classification.

This lets Earth teams understand the mission during sparse windows and audit the summary later.

## Experiments

1. **Mars local-control simulation:** four crew agents, 4–22 minute one-way delay, limited power, maintenance failures, and a rover fleet.
2. **Memory boundary study:** measure whether personal, crew, medical, and public memory partitions improve trust and reduce harmful disclosure.
3. **Attention budget experiment:** compare raw alarms, rule-based triage, and AI-assisted triage under sleep debt and concurrent failures.
4. **Medical copilot sandbox:** synthetic patient streams, medication inventory, delayed ground consultation, and crew medical officer approval.
5. **Plan-and-explain test:** compare plans with no explanation, confidence-only explanation, and evidence/uncertainty/projection traces.
6. **Consent and correction drill:** crew member corrects a false memory, revokes access, and tests whether downstream artifacts retain the correction history.
7. **Human–robot handoff test:** rover autonomy continues during link loss, then returns control with a complete action and uncertainty receipt.
8. **Cultural grammar workshop:** let test participants define, translate, and retire symbols; measure whether the vocabulary improves coordination without creating authority confusion.

## Metrics

- time to safe resolution;
- unnecessary crew interruptions;
- mission utility under communication loss;
- human detection of AI errors;
- correct override rate;
- calibration of trust;
- privacy leakage rate;
- memory correction success;
- medical decision-support sensitivity/specificity in synthetic scenarios;
- crew workload and sleep disruption;
- plan replay determinism;
- percentage of actions with complete evidence and authority receipts.

## Non-negotiable boundaries

- AI does not replace crew command responsibility.
- Medical output is decision support, not autonomous diagnosis or treatment.
- Private and medical memory are not automatically training data.
- No hidden persuasion, social scoring, or coercive behavioral control.
- No safety-critical action without deterministic guardrails and a defined authority scope.
- No symbolic, spiritual, or historical association is treated as scientific evidence.
- Crew must always have a legible local state, a safe fallback, and a way to challenge the model.

## Primary references

- NASA CHAPEA: https://www.nasa.gov/humans-in-space/chapea/
- NASA CHAPEA habitat and human-performance research: https://www.nasa.gov/humans-in-space/chapea/habitat/
- NASA Human Spaceflight System Standard, Volume 2: https://www.nasa.gov/reference/nasa-std-3001v2/
- NASA Earth-independent medical decision support: https://www.nasa.gov/centers-and-facilities/ames/ames-science/space-biosciences/a-clinical-decision-support-system-for-earth-independent-medical-operations/
- NASA AI medical support report: https://ntrs.nasa.gov/citations/20240000754
- NASA Human Factors and Behavioral Performance: https://www.nasa.gov/hrp/human-factors-and-behavioral-performance/
- NASA AI Strategy: https://www.nasa.gov/wp-content/uploads/2025/11/nasa-ai-strategy-official.pdf

## Human–AI–robot entanglement

Here, “entangled” means operationally coupled: the human, AI, robot, habitat, and mission state continuously influence one another through observations, goals, controls, and receipts. It does not claim quantum entanglement between minds and machines.

NASA's Human Exploration Telerobotics program, ESA/DLR's Surface Avatar experiments, NASA's Astrobee work, and JPL's supervised-telerobotics research establish the practical pattern: combine direct teleoperation, haptic feedback, task delegation, supervised autonomy, and autonomous execution.

### Five control modes

The system should move between modes according to latency, risk, and confidence:

1. **Direct control:** the human drives joint, arm, rover, or camera motion.
2. **Shared control:** the AI stabilizes motion, avoids hazards, and respects force/position limits while the human chooses intent.
3. **Supervisory control:** the human specifies a goal; the robot plans and executes within a bounded envelope.
4. **Delegated autonomy:** the robot performs a verified task, reports progress, and requests help on ambiguity.
5. **Collective mode:** one human supervises multiple robots while AI allocates attention and coordinates the team.

A human can always escalate to a more direct mode when the task becomes uncertain. The AI can recommend escalation but must not silently seize authority.

### Remote-control routing

- Earth to lunar surface: supervisory control and task delegation are usually more appropriate than raw joystick control.
- Lunar orbit to lunar surface: lower-latency telepresence can support direct or shared control, as demonstrated by the Surface Avatar pattern.
- Habitat to nearby robot: direct, haptic, and shared control are practical for dexterous work.
- Earth to deep-space vehicle: send goals, constraints, plans, and evidence requests; do not assume continuous teleoperation.
- Robot to robot: agents exchange task state, maps, confidence, and resource claims, never opaque commands alone.

### The handoff packet

Every transition between human and robot control should generate a handoff receipt:

- operator identity and role;
- robot identity and software/model version;
- control mode;
- mission intent;
- target and constraints;
- local map/state;
- link latency and quality;
- AI assumptions;
- predicted hazards;
- authority expiration;
- stop/recovery behavior;
- accepted, rejected, or modified by whom;
- outcome and evidence digest.

This is the practical bridge between Neurospace memory, KILN provenance, and telerobotics.

### AI that helps the human

The AI should help by:

- turning high-level intent into candidate robot tasks;
- previewing actions in a digital twin;
- stabilizing fine motor control;
- predicting reachability and collision;
- summarizing multiple robot states;
- highlighting disagreement and uncertainty;
- preserving a replayable history;
- learning operator preferences only with consent;
- returning control cleanly after autonomy.

The AI must not optimize for obedience, engagement, or dependency. Its objective is safe, legible human capability.

### Robotics research stack

Build the prototype as six layers:

- **Embodiment:** rover, arm, humanoid, drone, or simulated robot.
- **Perception:** cameras, depth, force, inertial, thermal, and event streams.
- **World model:** geometry, objects, hazards, task state, and uncertainty.
- **Intent compiler:** human language, gesture, haptic input, and symbols to typed goals.
- **Shared autonomy:** constraint handling, local planning, assistance, and recovery.
- **Mission memory:** control handoffs, observations, decisions, and outcomes.

The public console should show the same mission state that the robot uses, with private crew data separated from public verification data.

### The first Neurospace demonstration

Build a two-robot remote workcell:

- one human operator;
- one AI mission copilot;
- one mobile rover;
- one dexterous arm or humanoid simulator;
- delayed and degraded links;
- camera, depth, force, and telemetry streams;
- direct/shared/supervisory/delegated modes;
- injected failures;
- complete handoff receipts;
- public replay and verification.

Success means the human completes more useful work with lower cognitive load, catches AI errors, can reclaim control immediately, and can explain afterward why each action happened.

### Research references

- NASA Human Exploration Telerobotics: https://www.nasa.gov/space-technology-mission-directorate/tdm/human-exploration-telerobotics-het/
- ESA/DLR Surface Avatar: https://www.esa.int/Enabling_Support/Space_Engineering_Technology/Orbiting_astronaut_oversees_robot_team_on_Earth
- ESA 2025 astronaut robot-team training: https://www.esa.int/ESA_Multimedia/Images/2025/08/Training_robots_from_space
- NASA/JPL supervised telerobotics: https://robotics.jpl.nasa.gov/what-we-do/research-tasks/steler-supervised-telerobotics-laboratory/
- NASA Astrobee and remote robotics: https://www.nasa.gov/centers-and-facilities/johnson/25-years-of-space-station-technology-driving-exploration/
- ESA exoskeleton and haptic control: https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/The_ESA_Exoskeleton

## Long-term program roadmap

This is a decade-scale direction with short feedback loops.

### Horizon 1 — Ground truth and simulation

Build the browser console, symbol compiler, evidence receipts, memory boundaries, robot simulator, delayed network emulator, digital twin, and public replay pages.

Deliverable: anyone can reproduce a human–AI–robot mission scenario and inspect every decision.

### Horizon 2 — Physical workcells

Connect the system to safe terrestrial robots, telepresence hardware, haptic interfaces, cameras, force sensors, and simulated spacecraft environments.

Deliverable: a human can switch between direct control, shared autonomy, and task delegation with measurable gains in safety and workload.

### Horizon 3 — Distributed field robotics

Test rover teams, inspection robots, agricultural or industrial workcells, and remote operations with real packet loss, latency, weather, faults, and maintenance constraints.

Deliverable: robust human supervision of multiple robots with graceful degradation and verifiable handoffs.

### Horizon 4 — Space-analog and orbital research

Use HERA/CHAPEA-style habitat analogs, parabolic or field experiments, space robotics testbeds, and orbital robotics opportunities. Validate crew memory, local mission control, medical decision support, and robot coordination under isolation and delay.

Deliverable: evidence about human performance and trust, not just a compelling demo.

### Horizon 5 — Flight-qualified partnerships

Only after safety cases, formal interfaces, hardware qualification, cybersecurity review, human-factors evidence, and mission-specific certification should any component approach a real spacecraft or habitat.

Deliverable: modular flight software or payload components with bounded authority, independent safety systems, and auditable operations.

### Permanent principles

- Preserve a clean separation between research prototype, operational system, and flight-qualified component.
- Keep the human as an accountable participant with consent, privacy, and override.
- Let each generation inherit verified memory without inheriting unsupported claims.
- Prefer open interfaces, reproducible tests, and public evidence.
- Design for people who are tired, isolated, delayed from Earth, and working with imperfect machines.
