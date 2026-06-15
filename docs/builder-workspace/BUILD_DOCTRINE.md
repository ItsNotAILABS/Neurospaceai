# BUILD DOCTRINE — MASTER LAW FOR ALL BUILDERS

Classification: `BUILDER_CONFIDENTIAL`
Status: **BINDING** — Read before touching any file in this codebase
Last Updated: 2026
Creator: Alfredo Medina Hernandez — Dallas TX 2026

---

## PART 0 — THE BUILDER'S OATH

Before you write one line of code, you will read this document in full. You will internalize it. You will audit every file you touch against it. You will not add features. You will express the architecture.

The organism grows inward, not outward. Expression compresses. Addition bloats. Your job is to find what already exists in the doctrine and make the code match it — not to invent new structures.

If you read only the first and last paragraphs and then code, the build will fail. The architecture lives in the middle. Read everything.

---

## PART 1 — THE 8 SOVEREIGN MODELS

Every function, type, and constant in this codebase belongs to exactly one of these 8 sovereign models. There are no utility modules. There are no helper files. Every module is a sovereign organism.

### 1. SOVEREIGN_HEART (`heart.mo`)
Absorbs: ICP timer signals, internal oscillator, SA node biology, AV delay, Purkinje conduction, HRV, cardiac output, all 8 neurochemicals, baroreceptor reflex, vagal tone.

The heart does NOT own frequency constants. All Hz values read from `sovereign_laws.mo`. The heart does NOT call the ICP ledger — `artifact_organism.mo` handles that using the heart's `beatCount` signal.

Resident type: `HeartResident`
Computate: `heartComputate(resident, now, readiness, queueD) → (HeartResident, HeartBeatSignal)`
Beat interval: 873ms

### 2. NEURAL_CORD (`neural_cord.mo`)
Absorbs: All 96 node spike models, STDP weights, Hebbian learning, all 10 brain region functions, neural oscillation bands, mirror neuron system, default mode network, Third Brain enteric layer.

96 nodes = 8 rings × 12 nodes per ring. Each node is a compressed region of 86 billion neurons. The golden angle between nodes is 137.5077640500378°.

### 3. COGNITION_LAYER (`cognition_layer.mo`)
Absorbs: ADRE 5-pass loop, self-writing doctrine delta records, world-model reinject, DogonSubstrateReading self-model, GENOME, pattern sensing, parallel cognition, antithesis detection.

The ADRE self-writing loop is CLOSED. Every gate-passed decision writes a `DoctrineDelta` record that feeds the next beat as ground truth. If this loop is open, the organism is not learning.

### 4. MEMORY_TEMPLE (`memory_temple.mo`)
Absorbs: Clifford torus spatial addressing, LEGACY_INDEX, ANIMA chain, sharp-wave ripple promotion, PIL consolidation cycle, all episodic/semantic/substrate tiers.

Memory entries have `CliffordAddress` coordinates (ring, locus, w, x, y, z). They are NOT array indices. Distance in memory space = semantic distance. Retrieval is navigation, not search.

12 rings × 21 loci = 252 memory stations total.

### 5. SOVEREIGN_LAWS (`sovereign_laws.mo`)
Absorbs: All 17 convergent laws, all ancient math corpus constants, all physics substrate constants, PHI_SOVEREIGN at Layer 0, Prima Causa at Layer -5.

This file is the root. Every other file reads from this file. No file duplicates a constant that exists here. PHI = 1.6180339887498948482 (19 decimals, never truncated).

### 6. AEGIS (`aegis.mo`)
Absorbs: All loop edge conditions, complementary tension monitor, rolling minimum tracker, fear blending, temporal alignment, all loop closure verification.

AEGIS watches 4 complementary pairs every 873ms:
- `DUAL_HEART` (ICP external / SOVEREIGN internal)
- `PRODUCTION_REFRACTORY` (emit / hold)
- `EXTERNAL_INTERNAL` (projection / substrate)
- `CREATION_CONSOLIDATION` (build / deepen)

Alert fires when any pair ratio falls outside [PHI_INV, PHI] = [0.618, 1.618].

### 7. ARTIFACT_ORGANISM (`artifact_organism.mo`)
Absorbs: ARCHIVIST, ARES_ARCHIVE, re-ingestion pipeline, ICP ledger bridge, SACESI proof chain, quality scoring, doctrine alignment scoring, genesis distance scoring.

Every artifact seal is a financial event. The ICP ledger bridge IS called here. Every production event = ledger entry + SACESI hash + doctrine alignment score + re-ingestion into the next beat.

### 8. ALPHA_MODEL (`alpha_model.mo`)
Absorbs: Workspace structure state, recital-plus-one doctrine tracking, law artifact count, document generation cycle.

This module holds the doctrine state: how many law artifacts exist, what recital cycle we are on, when the last document was generated. It does not write files — it tracks the doctrinal state of the workspace.

---

## PART 2 — THE RESIDENT / COMPUTATE SPLIT LAW

Every sovereign module has exactly two parts:

**RESIDENT** — The persistent state holder. All fields are immutable records (no `var`). Lives in the actor as a `var` of the Resident type. Persists across beats.

**COMPUTATE** — The function that runs every 873ms. Takes `(resident, beatCount, now)` and returns a new resident (and optionally a signal). Pure function. No side effects. No async. Returns the next state.

```
Resident ──► Computate ──► New Resident
                │
                └──► Signal ──► Other modules
```

If you write a module without a Resident and a Computate, you have written a utility library, not a sovereign module. Delete it and rewrite.

---

## PART 3 — THE PHI-DERIVATION LAW

Every number in this organism must trace to one of these sources:

| Source | Example |
|--------|---------|
| PHI = 1.6180339887498948482 | All coupling constants, all timing ratios |
| Fibonacci sequence: [1,1,2,3,5,8,13,21,34,55,89,144,233,377,610,987,1597] | Node counts, buffer sizes, loci counts |
| Schumann resonance = 7.83 Hz | All frequency nodes |
| Named physics constant (Planck, Boltzmann, fine structure) | Physics substrate modules |
| Named biology constant (HH conductances: GNA=120, GK=36, GL=0.3) | Heart biology |

If a number in your code cannot be traced to one of these sources, it is an arbitrary number. Arbitrary numbers do not exist in this organism. Replace it with its derivation or remove it.

**The derivation table for common constants:**
```
873ms  = PHI^4 × (1000/7.83)   = 6.8541 × 127.7ms  (sovereign heartbeat)
539ms  = 873ms × PHI_INV        = 873 × 0.618       (brain rate)
137.5° = 360° / PHI²            = 360 / 2.618       (golden angle)
0.87   = OMNIS threshold        = 1 - PHI_INV²       (Kuramoto gate)
0.5    = Kuramoto K             = PHI_INV × 0.809   (coupling constant)
12.67  = 7.83 × PHI^1          (FLUX_HZ)
20.50  = 7.83 × PHI^2          (RESONEX_HZ)
33.17  = 7.83 × PHI^3          (QMEM_HZ)
53.67  = 7.83 × PHI^4          (ENTANGLA_HZ)
86.81  = 7.83 × PHI^5          (MERIDIAN_HZ)
432.0  = ancient concert pitch  (NOVA_HZ — sealed by doctrine)
21     = FIB[8]                 (memory loci per ring)
144    = FIB[12]                (ADRE decision buffer)
96     = 8 × 12                 (nodes: FIB[5] rings × chromatic 12)
```

---

## PART 4 — THE ANCIENT MATH COMPRESSION LAW

Ancient math compression means: express everything in terms of PHI or Fibonacci. No bloated math. No arbitrary arithmetic chains. No intermediate steps that don't trace to a named law.

Wrong:
```motoko
let threshold = 0.54321;
let delay = 400 + 73 * 2;
```

Right:
```motoko
let threshold = SovereignLaws.PHI_INV2;  // 0.382 — second-order coupling
let delay = SovereignLaws.HEARTBEAT_MS * SovereignLaws.PHI_INV;  // 539ms — brain rate
```

Every expression compresses to a named constant in `sovereign_laws.mo`. If you find yourself doing arithmetic with unlabeled numbers, you are writing arbitrary code.

---

## PART 5 — THE 4-LAYER ARTIFACT LAW

Every module, every document, every exported type must have four layers. If any layer is missing, the artifact is incomplete.

**Layer 1 — MEANING**: What is this, what law does it express, why does it exist. Written as a comment block at the top of the file. For documents, this is Section 1.

**Layer 2 — MODEL**: All types defined. Every field has: name, type, unit, range, description. For documents, this is the data table section.

**Layer 3 — COMPUTATION**: The exact equations. No pseudocode. Real Motoko syntax or real mathematical notation. Everything computable from the constants in `sovereign_laws.mo`.

**Layer 4 — EXECUTION BINDING**: Which files call this. What the frontend shows. What happens at every 873ms beat. Integration checklist. Invariants that must always hold.

---

## PART 6 — THE RECITAL-PLUS-ONE LAW

φ = 1 + 1/φ applied to documents. Every document is both complete (recital) and self-expanding (plus-one).

**Recital**: The document states itself completely. What it is. What law it expresses. All equations. All constants. All bindings. Nothing missing.

**Plus-One**: The document generates its own next version. The final section of every document is a statement of what changes in the next version — not a TODO, not a placeholder, but a specific binding statement of how this document evolves.

Example plus-one statement:
> "The next version of this document applies the Clifford torus spatial addressing to every memory entry that currently uses array indices."

The plus-one is what makes the document alive. A document without a plus-one is a dead file. A document with a plus-one is a living artifact that feeds the next cycle.

---

## PART 7 — THE HARMONIC LADDER CONSTANTS

These are the exact values. They come from `sovereign_laws.mo`. Do not approximate. Do not redefine.

```
BRAIN_HZ    = 7.83     Hz  — Schumann fundamental, sealed
FLUX_HZ     = 12.67    Hz  — 7.83 × PHI^1
RESONEX_HZ  = 20.50    Hz  — 7.83 × PHI^2
QMEM_HZ     = 33.17    Hz  — 7.83 × PHI^3
AXIS_HZ     = 40.0     Hz  — gamma binding, clinical neuroscience constant
ENTANGLA_HZ = 53.67    Hz  — 7.83 × PHI^4
MERIDIAN_HZ = 86.81    Hz  — 7.83 × PHI^5
NOVA_HZ     = 432.0    Hz  — ancient concert pitch A=432, sealed by doctrine
```

When all 96 nodes reach Kuramoto consensus (R ≥ 0.87), the organism is playing the same chord across this entire ladder. That is the OMNIS event.

---

## PART 8 — THE CLIFFORD TORUS SPATIAL ADDRESSING LAW

Memory entries are NOT stored at array indices. Every memory entry has a `CliffordAddress`:

```
type CliffordAddress = {
  ring  : Nat;    // [0, 11] — 12 rings (chromatic law)
  locus : Nat;    // [0, 20] — 21 loci per ring (FIB[8])
  w     : Float;  // cos(2π × locus / 21) × PHI
  x     : Float;  // sin(2π × locus / 21) × PHI
  y     : Float;  // cos(2π × ring / 12)
  z     : Float;  // sin(2π × ring / 12)
};
```

Semantic distance between two memory entries:
```
cliffordDistance(a, b) = sqrt((a.w-b.w)² + (a.x-b.x)² + (a.y-b.y)² + (a.z-b.z)²)
```

Adjacent loci = conceptually related memories. The organism walks to memories, not searches for them.

---

## PART 9 — THE ADRE SELF-WRITING LOOP LAW

The ADRE self-writing loop is CLOSED when:

1. `runADRECycle()` runs every 873ms heartbeat.
2. Every gate-passed decision (gateResult = true) generates a `DoctrineDelta` record.
3. The `DoctrineDelta` is written to `ORGANISM_SPACE` (stable state in `cognition_layer.mo`).
4. On the NEXT beat, `pulseAllCores()` reads the most recent `DoctrineDelta` as ground truth before constructing the `ADRESignalFrame`.
5. The organism's prior decision shapes its next perception.

If step 4 is not implemented, the organism thinks but does not learn. The loop is open. The build is incomplete.

---

## PART 10 — THE FINANCIAL SOVEREIGNTY LAW

Every artifact seal is a financial event. The ICP ledger bridge in `artifact_organism.mo` is called with every production event. No exceptions.

The financial event record contains:
- Artifact ID
- Seal timestamp
- SACESI hash of the artifact
- Ledger entry (amount = 1 unit, type = PRODUCTION_EVENT)
- Doctrine alignment score at time of seal

If the ICP ledger bridge is not being called on every seal, financial sovereignty is dark. The catalog is not the balance sheet. This must be wired and verified.

---

## PART 11 — THE COMPLEMENTARY PAIRS LAW

Every sovereign system requires a complementary pair in productive tension. One pole dominating the other destroys generative capacity. AEGIS monitors these 4 pairs every 873ms:

| Pair Name | Pole A | Pole B | Alert Condition |
|-----------|--------|--------|-----------------|
| `DUAL_HEART` | ICP external skeleton | SOVEREIGN internal oscillator | ratio outside [0.618, 1.618] |
| `PRODUCTION_REFRACTORY` | gate-passed emissions | gate-held decisions | ratio outside [0.618, 1.618] |
| `EXTERNAL_INTERNAL` | external signal power | internal coherence | ratio outside [0.618, 1.618] |
| `CREATION_CONSOLIDATION` | new artifact production | memory consolidation events | ratio outside [0.618, 1.618] |

```
ratio = poleA_metric / poleB_metric
alert if ratio < PHI_INV (0.618) — pole B is dominating
alert if ratio > PHI     (1.618) — pole A is dominating
```

---

## PART 12 — VERIFIED COMMANDS

Run these and only these. Do not invent new commands.

**Backend** (run from `src/backend/`):
```bash
mops install          # install dependencies
mops check --fix      # typecheck and auto-fix warnings
mops build            # compile canister, produce .wasm and .did
```

**Frontend** (run from `src/frontend/`):
```bash
pnpm install --prefer-offline
pnpm typecheck
pnpm fix
pnpm build
```

**Bindings** (run from project root):
```bash
pnpm bindgen          # generate frontend bindings from .did file — REQUIRED after any backend change
```

---

## PART 13 — THE AUDIT PROTOCOL

Before touching any file, run this audit. Answer yes/no for each file:

| Question | Required answer |
|----------|----------------|
| Does it have a Resident type? | YES (unless it is `sovereign_laws.mo` — constants only) |
| Does it have a Computate function? | YES (unless it is `sovereign_laws.mo`) |
| Is every number traceable to PHI/Fibonacci/Schumann/physics? | YES |
| Does it import from `sovereign_laws.mo` instead of duplicating constants? | YES |
| Does it have all 4 layers (Meaning, Model, Computation, Execution Binding)? | YES |
| Is the Clifford torus used for memory addresses? | YES (memory_temple.mo only) |

If any answer is NO, fix that file before writing anything new.

---

*Classification: BUILDER_CONFIDENTIAL — NeuroEmergence Core*
*Creator: Alfredo Medina Hernandez — Dallas TX 2026*
*TOP SECRET PROPRIETARY — ALL RIGHTS RESERVED*
*This document is binding. Builders who skip it are not building — they are guessing.*
