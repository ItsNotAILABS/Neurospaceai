# Design Brief — 3D Virtual Research Lab + Pharma Hub

## Purpose
The lab is NeuroEmergence Core's deep research environment — where the organism *thinks out loud*. A phi-proportioned, data-driven sanctuary where you observe neural emergence, run material experiments, watch avatar agents synthesize intelligence, and see the heartbeat of coherence at 873ms.

Pharma Hub (Wing 5) is a standalone neuropharmacology research wing with its own scientific visual identity — monitoring 24 neurochemicals, compound synthesis, receptor binding dynamics, and autonomous research agent operations.

## Tone & Aesthetic
Core Lab: Sacred geometry meets hard science. Luminescent, purposeful minimalism.
Pharma Hub: Clinical precision meets emergent complexity. Teal-cyan spectrum for scientific credibility (not military amber). Lab-focused, exact, data-dense.

## Differentiation
- **Core Lab**: 96-node Kuramoto brain, amber accents, material sandbox, avatar agents
- **Pharma Hub**: 24-neurochemical tracker, teal accents, compound synthesis curves, receptor dynamics, autonomous research agent INQUISITOR PHARM

## Color Palette
| Token | OKLCH | Purpose |
|-------|-------|----------|
| primary (core) | 0.72 0.18 50 | Amber energy, global accent |
| accent/brain (core) | 0.55 0.18 240 | Neural base, primary phase |
| pharma-accent | 0.62 0.24 175 | Teal scientific primary |
| pharma-button-bg | 0.48 0.2 168 | Teal interactive surfaces |
| pharma-glow | 0.68 0.26 172 | Teal luminescence |
| pharma-primary-intense | 0.65 0.28 170 | Teal emergence equivalent |
| background (all) | 0.04 0.01 220 | Dark substrate |
| lab-panel-bg (all) | 0.055 0.01 220 | Card/panel surfaces |

## Typography
JetBrains Mono (monospace grid aesthetic, data-display alignment, technical sovereignty)

## Structural Zones (Pharma Hub)
| Zone | Treatment | Content |
|------|-----------|----------|
| Pharma header | pharma-surface-mid bg, teal border-b | Wing title, current coherence |
| Chemical grid | 4×6 cards, pharma-glow on active | 24 neurochemicals (DA, 5-HT, NOR, ACH, GAB, GLU, COR, OXT, Mela, β-End, Anandam, SubP, NPY, CRH, VIP, CCK, Adeno, Hista, NO, BDNF, IGF-1, Prolac, Vasop, Dynorp) |
| Compound panel | teal accent buttons, neon-teal glow | Synthesis curves, receptor binding |
| Agent panel | INQUISITOR PHARM status, teal task indicator | Live task log, hypothesis queue |
| Report section | pharma-primary highlights | Research findings, contradiction log |

## Spacing & Rhythm
Base: --spacing-phi = 1rem | Phi multiples: 0.618rem, 1rem, 1.618rem, 2.618rem, 4.236rem, 6.854rem | All Pharma panels use phi-ratio units

## Motion
- **873ms pulse**: lab-pulse keyframe (opacity/brightness oscillate)
- **873ms teal glow**: pharma-specific neon-teal drop-shadow glow on active compounds
- **1.746s emergence**: lab-emergence equivalent fires when coherence ≥ 0.87

## Component Patterns (Pharma)
- **Chemical card**: compound name, current level (%), synthesis rate, receptor occupancy, active glow = teal
- **Compound curve**: synthesis/decay rates plotted in real time, teal grid, amber thresholds
- **Agent task**: INQUISITOR PHARM task indicator, teal task-in-progress, green on completion
- **Button**: Pharma context uses teal-bg, amber reserve for critical override actions

## Signature Details
- 24-neurochemical live state matrix (all biochemistry constants encoded as real substrate)
- Compound synthesis as live mathematical curves (not static graphs)
- INQUISITOR PHARM auto-generates research tasks seeded by organism hunger feedback
- Teal neon glow (pharma-neon-teal shadow) mimics luminescence precision of lab instruments
- No flat shading; luminescence via drop-shadow and filter bloom (consistent with core lab)

## Constraints
Sharp corners (--radius: 0px) | OKLCH color tokens only | All animations use --pulse-duration (873ms) and --pulse-easing | Pharma tokens never override core tokens (amber remains global) | No generic blue; teal must stay in 160–180° hue range
