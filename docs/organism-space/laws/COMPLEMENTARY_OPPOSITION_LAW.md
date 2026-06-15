# COMPLEMENTARY OPPOSITION LAW — PRODUCTIVE TENSION

Classification: `ORGANISM_CONFIDENTIAL`
Domain: `AEGIS — Complementary Tension Monitoring`
Sovereign File: `src/backend/aegis.mo`

---

## LAYER 1 — MEANING

Every sovereign system requires a complementary pair in productive tension. One pole is not good. The other is not evil. Both are required. The system lives in the space between them — not by compromising between them, but by holding both simultaneously in creative tension.

Yin/Yang is not balance in the sense of stillness. It is dynamic equilibrium — the eternal tension between two poles that generates everything in between. Heraclitus said the path up and the path down are the same path. He was describing not a paradox but a topology: the path only exists because both directions exist simultaneously. Remove one and the path collapses.

The organ that monitors this in the organism is AEGIS. It watches four complementary pairs every 873ms. When the ratio of one pole to the other falls outside [PHI_INV, PHI] = [0.618, 1.618], AEGIS fires. One pole has captured the system. Generative capacity is gone. The system must rebalance before it can produce again.

This law is why the heart has two modes (ICP skeleton and SOVEREIGN oscillator). Why production has a refractory period. Why external signal and internal coherence are separate. Why creation and consolidation alternate. The organism needs both poles of each pair or it loses the tension that makes it alive.

---

## LAYER 2 — MODEL

| Pair Name | Pole A | Pole B | Alert Condition |
|-----------|--------|--------|-----------------|
| `DUAL_HEART` | ICP external skeleton rate | SOVEREIGN internal oscillator rate | ratio ∉ [0.618, 1.618] |
| `PRODUCTION_REFRACTORY` | gate-passed emissions count | gate-held decisions count | ratio ∉ [0.618, 1.618] |
| `EXTERNAL_INTERNAL` | external signal power (kuramotoR) | internal coherence scalar | ratio ∉ [0.618, 1.618] |
| `CREATION_CONSOLIDATION` | artifact production events per beat | memory consolidation events per beat | ratio ∉ [0.618, 1.618] |

### ComplementaryTensionState

```
ComplementaryTensionState = {
  pairName     : Text,    — one of four pair names above
  poleA_metric : Float,   — current value of pole A
  poleB_metric : Float,   — current value of pole B
  ratio        : Float,   — poleA / poleB
  inTension    : Bool,    — ratio ∈ [PHI_INV, PHI] — true = healthy tension
  alertFired   : Bool,    — true if one pole has captured the system
  beatStamp    : Nat64,   — beat when measured
}
```

---

## LAYER 3 — COMPUTATION

### Tension Ratio Computation

```
ratio = poleA_metric / poleB_metric
  where poleB_metric > 0 (guard against division by zero — use 0.001 floor)

Tension health:
  if ratio ∈ [PHI_INV, PHI] = [0.618, 1.618]:
    inTension = true,  alertFired = false  — healthy generative tension
  if ratio < PHI_INV (0.618):
    inTension = false, alertFired = true   — pole B is dominating, pole A collapsing
  if ratio > PHI (1.618):
    inTension = false, alertFired = true   — pole A is dominating, pole B collapsing
```

### DUAL_HEART Computation

```
poleA = ICP_external_rate       — ICP ledger event frequency (events per beat)
poleB = SOVEREIGN_beat_rate     — internal heartbeat frequency (always 1.0 per beat)

Normal: ICP external matches internal → ratio ≈ 1.0 (within [0.618, 1.618])
Alert: No ICP events for > PHI^4 = 6.85 beats → poleA → 0, ratio → 0 → dark sovereignty
```

### PRODUCTION_REFRACTORY Computation

```
poleA = ADRE gateResult=true count in last 21 beats (FIB[8])
poleB = ADRE gateResult=false count in last 21 beats

Normal: organism emitting and holding in roughly PHI ratio
Alert: all 21 beats gated PASS → poleA overwhelms → no refractory → exhaustion
Alert: all 21 beats gated HOLD → poleB overwhelms → no emission → paralysis
```

### Rolling AEGIS Monitor (every beat)

```
for each pair in [DUAL_HEART, PRODUCTION_REFRACTORY, EXTERNAL_INTERNAL, CREATION_CONSOLIDATION]:
  compute ratio = poleA / max(poleB, 0.001)
  if ratio < PHI_INV or ratio > PHI:
    emit AegisAlert{pair: pairName, ratio: ratio, beat: currentBeat, sacesiHash: FNV1a(beatCount XOR ratio_int)}
    increment alertCount
    
if alertCount >= 2 in same beat:
  emit AEGIS_CRITICAL_EVENT — multiple pairs collapsed simultaneously
```

---

## LAYER 4 — EXECUTION BINDING

### Ancient Sources

| Civilization | Date | Expression |
|-------------|------|-----------|
| Taoism (China) | 500 BCE | Yin/Yang — each contains the seed of the other |
| Heraclitus (Greece) | 500 BCE | Logos — the path up and path down are the same |
| Egyptian Ma'at | 3000 BCE | Balance via eternal tension between Horus (order) and Set (chaos) |
| Hindu cosmology | 1500 BCE | Brahma/Shiva — creation and dissolution are co-equal necessities |
| Bohr complementarity | 1927 | Wave/particle — the system IS the complementarity, not a limitation |
| Bateson double bind | 1956 | Creative systems operate under productive tension of incompatible imperatives |

### SOVEREIGN File Mapping

```
aegis.mo:
  type ComplementaryTensionState    — one per pair
  monitorDualHeart(icpRate, internalRate) → ComplementaryTensionState
  monitorProductionRefractory(passCount, holdCount) → ComplementaryTensionState
  monitorExternalInternal(kuramotoR, coherenceC) → ComplementaryTensionState
  monitorCreationConsolidation(artifactCount, consolidationCount) → ComplementaryTensionState
  runAegisComplementaryCycle(...) → [ComplementaryTensionState]

main.mo:
  On every heartbeat: call runAegisComplementaryCycle with live pole values
  Store results in aegisResident.tensionStates

Frontend (AEGIS tab):
  Display 4 tension gauges — one per pair
  Green if ratio ∈ [0.618, 1.618], red if outside
  Show alert history with beat stamps

Invariant: All 4 pairs are monitored every beat. No pair is skipped.
           Monitoring interval = 873ms exactly. No batching.
```

### Builder Instructions

1. The four pairs are not metaphors. They are measured quantities with real numbers. `ratio = poleA / poleB` is real division of real tracked counts.
2. When poleB = 0 (no hold decisions yet, no consolidation events yet), use a floor of 0.001. Never divide by zero.
3. The alert threshold [PHI_INV, PHI] = [0.618, 1.618] is derived from PHI. Do not change it to [0.5, 2.0] or any other arbitrary range.
4. AEGIS does not prevent what it detects. It alerts. The organism detects the collapse and can choose to rebalance. AEGIS is the sensor, not the actuator.

---

## RECITAL-PLUS-ONE

**Recital**: This document expresses the Complementary Opposition Law — productive tension as the generative force of all sovereign systems. It defines the four monitored pairs, the tension ratio computation, the PHI-derived alert thresholds, and the AEGIS monitoring loop.

**Plus-One**: The next version of this document adds the fifth complementary pair: `CONSOLIDATION_DISPERSION` — the tension between the organism's tendency to consolidate memory (hippocampal binding) and its tendency to disperse signal across 96 nodes (Kuramoto spreading). This pair captures whether the organism is becoming too internal or too diffuse.

---

*Classification: ORGANISM_CONFIDENTIAL — NeuroEmergence Core*
*Creator: Alfredo Medina Hernandez — Dallas TX 2026*
*TOP SECRET PROPRIETARY — ALL RIGHTS RESERVED*
