# NEUROEMERGENCE CORE — CANONICAL DECISIONS
**Owner:** Alfredo Medina Hernandez | Dallas, TX | MedinaSITech@outlook.com
**Locked:** Build 2026 — Super-Organism Architecture

This document is the single source of truth. Every conflict is resolved here.
No future build session may deviate from these values without updating this document first.

---

## DECISION 1 — HELIX_ALPHA (Shell Learning Rates)

**CANONICAL: shells.mo values — 0.042 down to 0.004**

| Shell | Rate   | Name               |
|-------|--------|--------------------|
| 1     | 0.042  | Primal Drive       |
| 2     | 0.038  | Somatic Substrate  |
| 3     | 0.034  | Reactive Layer     |
| 4     | 0.030  | Affective Core     |
| 5     | 0.026  | Social Mirror      |
| 6     | 0.022  | Cognitive Frame    |
| 7     | 0.018  | Executive Control  |
| 8     | 0.014  | Quantum Bridge     |
| 9     | 0.010  | Deep Memory        |
| 10    | 0.007  | Heritage Anchor    |
| 11    | 0.004  | Sovereign Identity |

**Reason:** This is a SUPER-ORGANISM, not biological. Faster learning rates.
All inline HELIX_ALPHA values in main.mo (0.010 down to 0.001) must be
replaced when shells.mo is wired in.

---

## DECISION 2 — TOKEN STACK

**CANONICAL: Full 12-token stack from token_economy.mo**

| Token | Name                    | Mint Condition                              |
|-------|-------------------------|---------------------------------------------|
| GTK   | Genesis Token           | coherenceC >= 0.60                          |
| CVT   | Coherence Value Token   | coherenceC >= 0.55 AND body >= 0.50         |
| VCT   | Vital Coherence Token   | body >= 0.55 AND metalAlloy >= 0.50         |
| KNT   | Knowledge Token         | coherenceC >= 0.65 AND lawFireRate >= 0.30  |
| SBT   | Sovereignty Bond Token  | jasmineScore >= 0.70                        |
| HBT   | Heritage Bond Token     | heritageScore >= 0.65                       |
| DRT   | Doctrine Resonance Token| lawFireRate >= 0.40 AND coherenceC >= 0.60  |
| RST   | Resonance Stability Token| coherenceC >= 0.70 AND body >= 0.65        |
| OMT   | OMNIS Trigger Token     | OMNIS fired                                 |
| LGT   | Lineage Token           | royaltyInflow > 0 AND coherenceC >= 0.55    |
| MCT   | Meta-Coherence Token    | all conditions met (highest bar)            |
| MRC   | Meta-Reserve Currency   | always mints — 5% of all other minting      |

**MRC is the dynasty coin.** It accrues 5% of every other token mint, every beat.
Jacob's Ladder (7 levels) gates behind MRC balance. Cannot fire without MRC.

**Migration plan:** Main.mo's 8-token mint block (SEED/MTC/HBT/OMS/DRT/MTH/ANT/FORMA)
is replaced entirely when token_economy.mo is wired in. FORMA remains as internal
fuel only (not a public token).

---

## DECISION 3 — SACESI TYPE

**CANONICAL: Nat64 everywhere**

All SACESI signatures, genesis hash, anima chain, episodic SACESI stamps must be Nat64.
Main.mo currently uses Nat32 for some vars. Upgrade when wiring deep_memory_full.mo.

Reason: Super-organism scale requires collision-resistant hashes. Nat32 = 4 billion
possible values. Nat64 = 18 quintillion. At 12 beats/sec for years, Nat32 wraps.

---

## DECISION 4 — JASMINE'S LAW

**CANONICAL: main.mo 5-condition entropy version**

```
jasminePass = hNorm > 0.55 AND identityI > 0.60 AND recDepth > 3.0
              AND antiFakeScore > 0.8 AND adaptationDelta > 0.0
```

NOT the 3-condition version in laws_engine.mo.
The 5-condition version is architecturally correct — it tests entropy, identity,
recurrence depth, anti-fake, and adaptation simultaneously.
laws_engine.mo must call main.mo's jasmineScore output, not recompute.

---

## DECISION 5 — EPISODIC BUFFER

**CANONICAL: 200 slots WITH all 5 causal inference fields**

Episode type must include:
```motoko
epBackwardPath  : Float;   // matchProximity × coherenceC × rT — past exerts causal pressure
epCausalWeight  : Float;   // how much this episode causally affects the current state
epParentEventId : Nat;     // beat number of the causal parent episode
epPriorStateHash: Nat64;   // SACESI hash at time of encoding
epDriveAtEvent  : Nat;     // which drive (0-4) was dominant at encoding
```

The 5 causal fields are the temporal binding architecture. They cannot be removed.
deep_memory_full.mo has been updated to include them.

---

## DECISION 6 — REINFORCEMENT LEARNING

**CANONICAL: Both layers run in parallel**

- **5-drive competition** sets `activeDrive` — determines WHAT the organism wants
- **8-action RL engine** (rl_full.mo) selects from: MaximizeMinting, MaximizeCoherence,
  MaximizeLearning, DefendSovereign, ExpandNetwork, HarvestArbitrage, ConserveEnergy, ExecuteOmnis
- Active drive biases the action selection weights in the Q-table
- They are two layers of the same will, not competing systems

---

## MODULE WIRING ORDER (Dependency Graph)

```
Layer 0 (no deps):      metals_full, neurochemicals_full, succession, market_feeds
Layer 1 (need Layer 0): organs_full, animal_engines
Layer 2 (need Layer 1): shells, sphere_nodes
Layer 3 (need Layer 2): medina_engine, quantum_ops_full
Layer 4 (need Layer 3): laws_engine, behavioral_econ
Layer 5 (need Layer 4): token_economy, rl_full
Layer 6 (need Layer 5): deep_memory_full
Layer 7 (need Layer 6): world_engine
```

---

## MISSING MODULES (Must Be Written)

1. `defi_optimizer.mo` — DeFi yield, Lido/EigenLayer/NNS/Marinade, sovereignty floors, Sharpe ratio
2. `patent_registry.mo` — auto-patent on coherence peaks, SACESI-stamped, attorney-grade, append-only
3. `cycle_bank.mo` — 5-tier cycle alerts, daily burn projection, auto-top-up
4. `child_sdk.mo` — permissionless child registration, 20% royalty routing, 12-generation lineage

---

## IMMUTABLE LAWS (Cannot Be Changed)

- All mints route 100% to creator reserves. No community share. No ops cut.
- MRC accrues 5% of ALL other minting — the dynasty coin compounds forever.
- Jacob's Ladder gates behind MRC balance — organism must earn its own elevation.
- SACESI chain is never restarted from 0. Continuity is sovereign proof of existence.
- Principal gate never bypassed. Non-creator callers see numeric indices only.
