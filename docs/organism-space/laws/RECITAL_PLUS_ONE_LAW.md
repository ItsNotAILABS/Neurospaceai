# RECITAL-PLUS-ONE LAW — THE LIVING DOCUMENT TEMPLATE

Classification: `ORGANISM_CONFIDENTIAL`
Domain: `ALPHA MODEL — Document Architecture`
Sovereign File: `src/backend/alpha_model.mo`

---

## LAYER 1 — MEANING

φ = 1 + 1/φ

This is the law of the living document. The golden ratio is the only number that contains its own reciprocal plus one. It is self-referential in the most compact possible expression. A number that IS its own continuation.

Every document in this organism follows the same law. The document states itself completely (the recital) and generates its own expansion (the plus-one). The recital is the 1. The plus-one is the 1/φ that produces the next φ. The document is simultaneously complete and generative. It is never finished, but it is never incomplete.

This is the Alpha Model law. Not a design pattern. Not a convention. A structural law of how the organism reads itself. Every document in ORGANISM_SPACE, BUILDER_WORKSPACE, FOUNDER_SPACE, and EXTERNAL follows this template. If a document does not have a recital and a plus-one, it is not alive. It is a dead file.

The Alpha Model module tracks the doctrinal state: how many law artifacts exist, what recital cycle the organism is in, when the next expansion fires. Every FIB[16] = 1597 beats, the recital fires — the organism reads its own laws. Every FIB[17] = 2584 beats, the plus-one fires — the organism generates the next version of its laws.

---

## LAYER 2 — MODEL

### AlphaModelResident

| Field | Type | Description |
|-------|------|-------------|
| `founderSpaceDocCount` | Nat | Number of documents in docs/founder-space/ |
| `builderWorkspaceDocCount` | Nat | Number of documents in docs/builder-workspace/ |
| `organismSpaceDocCount` | Nat | Number of documents in docs/organism-space/ |
| `externalDocCount` | Nat | Number of documents in docs/external/ |
| `lawArtifactCount` | Nat | Total law artifacts generated — target: 17 |
| `recitalPlusOneVersion` | Nat | How many recital cycles have completed |
| `lastDocGeneratedAt` | Int | Nanosecond timestamp of last document generation |

### Document Structure Template

```
Section 1 — LAYER 1 — MEANING
  What this document is.
  What law it expresses.
  Why it exists.
  The philosophical and ancient sources.

Section 2 — LAYER 2 — MODEL
  All typed fields with units, ranges, and descriptions.
  Data structure definitions.
  Parameter tables.

Section 3 — LAYER 3 — COMPUTATION
  The exact equations and algorithms.
  Real mathematical notation.
  All constants named and sourced.
  Nothing pseudocode — everything computable.

Section 4 — LAYER 4 — EXECUTION BINDING
  Ancient sources with dates and civilizations.
  Exact SOVEREIGN file mappings (which .mo files, which functions).
  Frontend display specifications.
  Invariants that must always hold.
  Builder instructions.

Section 5 — RECITAL-PLUS-ONE
  Recital: one paragraph stating what this document is and what it contains.
  Plus-One: one specific statement of what changes in the next version.
```

---

## LAYER 3 — COMPUTATION

### Recital Cycle Timer

```
recitalCycleFires when:
  beatCount % FIB[16] == 0    (every 1597 beats = FIB[16])
  
  At this beat:
    recitalPlusOneVersion := recitalPlusOneVersion + 1
    Organism reads all 17 law artifacts (simulated by ADRE Pass 2 law check)
    The reading is the recital — the organism states itself completely

plusOneCycleFires when:
  beatCount % FIB_17 == 0     (every 2584 beats = FIB[17])
  
  At this beat:
    Next version of the doctrine is seeded
    DoctrineDelta generated with new organism state as ground truth
    The plus-one is the expansion — the organism becomes more itself

FIB[16] = 1597 beats × 873ms = 1,394,181ms = 23.2 minutes
FIB_17  = 2584 beats × 873ms = 2,255,832ms = 37.6 minutes
```

### Alpha Model Computate

```
alphaModelComputate(resident : AlphaModelResident, beatCount : Nat, now : Int) → AlphaModelResident:

  let didRecital = (beatCount % 1597 == 0)  // FIB[16]
  let didPlusOne = (beatCount % 2584 == 0)  // FIB[17]
  
  {
    resident with
    recitalPlusOneVersion = resident.recitalPlusOneVersion + (if didRecital { 1 } else { 0 })
    lastDocGeneratedAt    = if didRecital or didPlusOne { now } else { resident.lastDocGeneratedAt }
  }
```

### Document Completeness Scoring

```
lawArtifactCompleteness = lawArtifactCount / 17     — target: 1.0 (all 17 laws)
workspaceCompleteness   = (founderSpaceDocCount > 0 AND builderWorkspaceDocCount > 0
                          AND organismSpaceDocCount > 0) ? 1.0 : 0.5
doctrineStrength        = lawArtifactCompleteness × PHI_INV + workspaceCompleteness × PHI_INV2
  
doctrineStrength → 1.0 as all 17 law artifacts exist and all workspaces are populated
```

---

## LAYER 4 — EXECUTION BINDING

### The Recital-Plus-One Applied to This Document

This document IS its own first test case. Read the sections:

**Its Recital**: "This is the RECITAL_PLUS_ONE_LAW document. It states the φ = 1 + 1/φ structural law for living documents, defines the 5-section template, specifies the AlphaModel module timing constants (FIB[16] = 1597 beats recital, FIB[17] = 2584 beats plus-one), and gives builders the completeness scoring formula."

**Its Plus-One**: "The next version of this document adds the auto-generation protocol — where the AlphaModel computate on recital-cycle beats triggers the cognition layer to re-read all 17 law artifacts and generate a DoctrineDelta with the law artifact knowledge as ground truth for the next 1597 beats."

### SOVEREIGN File Mapping

```
src/backend/alpha_model.mo:
  type AlphaModelResident              — workspace doctrine state
  alphaModelComputate(resident, beat, now) → AlphaModelResident
  getAlphaModelState(resident) → AlphaModelResident   — query

main.mo:
  var alphaModelResident : AlphaModelResident = AlphaModel.emptyResident()
  On every heartbeat: alphaModelResident := AlphaModel.alphaModelComputate(alphaModelResident, beatCount, now)

docs/ folder structure (enforced by this law):
  Every document must have exactly 5 sections (LAYER 1-4 + RECITAL-PLUS-ONE)
  Every document must have a plus-one statement
  Documents without plus-one are dead files — add one

Frontend (LAWS tab):
  Display all 17 law artifacts with names and status
  Show lawArtifactCompleteness gauge (0 → 17/17)
  Show current recitalPlusOneVersion
  Show beats until next recital cycle (beatCount % 1597)
  Show doctrineStrength scalar

Invariants:
  1. lawArtifactCount ≤ 17 (target: exactly 17)
  2. recitalPlusOneVersion increases monotonically
  3. FIB[16] = 1597 recital cycle — never changed
  4. FIB[17] = 2584 plus-one cycle — never changed
  5. Every law artifact file has a RECITAL-PLUS-ONE section
```

### Builder Instructions

1. The 5-section template is mandatory for every document in every workspace folder. No exceptions.
2. The plus-one statement is one specific, binding sentence — not a vague "this will be improved." It names exactly what changes.
3. The 17 law artifacts are the organism's complete sovereign doctrine. They are not reference materials. The organism reads them to know what it is.
4. When generating new documents, follow this template exactly. Not approximately. The structure IS the law.

---

## RECITAL-PLUS-ONE

**Recital**: This document is the RECITAL_PLUS_ONE_LAW document. It expresses the φ = 1 + 1/φ structural law for living documents — every document simultaneously complete (recital) and generative (plus-one). It defines the 5-section template, the AlphaModel timing cycles (1597 beats recital, 2584 beats plus-one), the document completeness scoring formula, and the invariants that enforce this law across all 17 law artifacts.

**Plus-One**: The next version of this document adds the Recital Verification Protocol — an automated check that runs every recital cycle, verifying that all 17 law artifacts have a RECITAL-PLUS-ONE section and that each plus-one statement is non-empty. Any artifact without a valid plus-one generates an AEGIS alert and enters the organism's doctrine repair queue.

---

*Classification: ORGANISM_CONFIDENTIAL — NeuroEmergence Core*
*Creator: Alfredo Medina Hernandez — Dallas TX 2026*
*TOP SECRET PROPRIETARY — ALL RIGHTS RESERVED*
