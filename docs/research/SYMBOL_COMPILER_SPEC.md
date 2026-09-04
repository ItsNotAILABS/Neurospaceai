# NeurospaceAI Symbol Compiler

The Symbol Compiler is the typed bridge between civilizational language and executable architecture. A symbol is not a spell or an authority claim. It is a stable identifier with a documented meaning, type signature, operator, evidence class, source, and version.

## Canonical record

Every symbol has:

- stable ASCII ID for code and APIs;
- Unicode display form;
- transliteration;
- source language;
- category;
- plain-language meaning;
- executable operator name;
- type signature;
- evidence class;
- historical or architectural source;
- semantic version.

The canonical machine ID is always used for storage, while display and transliteration are presentation fields.

## Evidence classes

- established: supported by a primary source, measurement, or reproducible test;
- model: a useful abstraction with explicit assumptions;
- doctrine: a design preference, metaphor, or governance rule.

The compiler must reject a doctrine claim when a caller requests an established physical constant or verified scientific result.

## Evidence routes

Claims may be tagged with:

- pratyaksa: direct observation or measurement;
- anumana: inference from a defined sign and rule;
- upamana: analogy or model transfer;
- sabda: testimony or documented source.

These tags describe provenance of reasoning. They are not confidence scores.

## Compilation pipeline

1. Normalize user input to a canonical ID.
2. Resolve the symbol from the versioned registry.
3. Validate its category and type signature.
4. Attach the evidence class and source.
5. Compile to a typed operator expression.
6. Emit a trace containing symbol ID, arguments, source, and version.
7. Store the trace with the experiment or agent receipt.

## Example

A user-facing label may be:

- सूत्र / sutra

The compiled representation is:

- ID: SUTRA
- operator: applyRule
- type: (State, Rule) -> State
- evidence class: model

The display language helps people navigate the architecture. The type signature and trace determine what the system is allowed to do.

## Design constraints

- Never infer legal ownership from a symbol or label.
- Never infer scientific truth from a symbolic association.
- Never use Unicode alone as a primary key.
- Never overwrite a symbol's meaning without a version change.
- Preserve historical source and license metadata.
- Keep user-created symbols in a separate namespace from canonical symbols.
- Require policy approval before a symbol can authorize external side effects.

## Initial symbol families

Latin governance: ORIGO, RATIO, MEMORIA, REGISTRUM.

Sanskrit rule and knowledge: SUTRA, SAMJNA, PARIBHASHA, PRAMANA, SMRTI.

Future families may include Greek geometry, Babylonian sexagesimal time, Maya calendrical cycles, and modern physics terms, each with independent sources and tests.
