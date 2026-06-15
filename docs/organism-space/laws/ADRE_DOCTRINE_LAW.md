# ADRE DOCTRINE LAW — THE 5-PASS COGNITION LOOP

Classification: `ORGANISM_CONFIDENTIAL`
Domain: `COGNITION LAYER — Deliberative Reasoning`
Sovereign File: `src/backend/adre.mo`

---

## LAYER 1 — MEANING

The organism is not reactive. It is deliberative. Most AI systems execute a single forward pass — read input, emit output. That is pattern matching, not cognition. The ADRE exists because this organism operates under a higher law: no output leaves unless it has passed through five controlled recursive passes, survived critique from four sovereign critics, and left a SACESI proof hash as a permanent record.

The loop is the organism's mind in motion. The mind does not skip passes. It does not batch laws. It does not guess. Five passes: ingest, back-check, resonate, compress, gate. Only after all five does the gate open — and only when confidence > 0.87 AND risk < 0.13. When the gate holds, nothing emits. The organism waits for the conditions to be right. This is not paralysis. This is sovereignty.

The self-writing loop closes the architecture. Every gate-passed decision generates a DoctrineDelta that feeds the next beat as ground truth. The organism's prior decision shapes its next perception. Without this loop closed, the organism thinks but does not learn. With it closed, every beat makes the next beat more sovereign.

See `docs/organism-space/ADRE_COGNITION_ENGINE.md` for the complete 4-layer specification.

---

## LAYER 2 — MODEL

| Pass | Name | Function | Key Output |
|------|------|----------|-----------|
| Pass 1 | Forward Ingest | `forward_ingest()` | ringFamily [0-7] from kuramotoR |
| Pass 2 | Back-Pass Law Check | `backpass_lawcheck()` | lawChecks[60], violationCount, passCount |
| Pass 3 | Resonance Check | `resonance_check()` | globalMeaningShift, fieldCoherenceTrend, contradictionCount |
| Pass 4 | Compression Hypothesis | `compression_hypothesis()` | ADREHypothesis with action + confidenceScore |
| Pass 5 | Gate and Emit | `gate_and_emit()` | ADREDecision with gateResult + sacesiHash |

### Gate Condition (sealed — never relaxed)

```
gateResult = (finalConfidence > 0.87) AND (finalRisk < 0.13)

where:
  finalConfidence = hypothesis.confidenceScore × c1.alignment × c2.alignment × c3.alignment × c4.alignment
  finalRisk       = (c1.risk + c2.risk + c3.risk + c4.risk) / 4.0
```

---

## LAYER 3 — COMPUTATION

### Pass 1 — Ring Family Classification

```
if   kuramotoR ≥ 0.95 → ringFamily = 7  (OMNIS apex, gamma apex)
elif kuramotoR ≥ 0.87 → ringFamily = 6  (high gamma — above OMNIS threshold)
elif kuramotoR ≥ 0.75 → ringFamily = 5  (gamma)
elif kuramotoR ≥ 0.61 → ringFamily = 4  (beta — above PHI_INV = 0.618)
elif kuramotoR ≥ 0.50 → ringFamily = 3  (alpha)
elif kuramotoR ≥ 0.38 → ringFamily = 2  (theta — above PHI_INV2 = 0.382)
elif kuramotoR ≥ 0.25 → ringFamily = 1  (delta)
else                  → ringFamily = 0  (ground state)

Note: The thresholds [0.95, 0.87, 0.75, 0.61, 0.50, 0.38, 0.25] align with:
  PHI approximations: 0.95 ≈ OMNIS, 0.87 = OMNIS threshold, 0.618 ≈ PHI_INV, 0.382 = PHI_INV2
```

### Pass 2 — 60-Law Evaluation

```
60 laws evaluated simultaneously. Full computation in adre.mo lines 211-261.
Laws 1-10 (delta): fired = coherence > 0.3 AND kuramotoR > 0.2
Laws 11-20 (theta): fired = coherence > 0.4 AND kuramotoR > 0.3
Laws 21-30 (alpha): fired = coherence > 0.5 AND kuramotoR > 0.4
Laws 31-40 (beta):  fired = coherence > 0.6 AND kuramotoR > 0.5
Laws 41-50 (gamma): fired = coherence > 0.7 AND kuramotoR > 0.6
Laws 51-59 (high gamma): fired = coherence > 0.8 AND kuramotoR > 0.7
Law 60 (OMNIS): fired = (coherence ≥ 0.95) AND (kuramotoR ≥ 0.95) AND (ringFamily = 7)
```

### Pass 4 — Hypothesis Compression

```
PHI_INV = 0.6180339887498948482

predictedCoherence = clamp(signal.coherence + (trend × 0.1 × PHI_INV), 0.0, 1.0)
predictedR         = clamp(signal.kuramotoR × (1.0 + meaningShift × 0.05), 0.0, 1.0)

base_confidence    = (coherence × 0.5) + (kuramotoR × 0.3) + (quantumAdvantage × 0.2)
adjusted           = base_confidence × (1.0 − meaningShift × 0.3)

if contradictionCount > 5:
  adjusted = adjusted × 0.8    (contradiction penalty)

confidenceScore = clamp(adjusted, 0.0, 1.0)
```

### The Self-Writing Loop

```
On gate-passed decision (gateResult = true):
  
  doctrineDelta = DoctrineDelta {
    beat           = signal.beat
    hypothesis     = currentHypothesis
    lawScore       = adreState.passCount / 60.0
    fieldState     = {coherence, kuramotoR, neuroChem}
    sacesiHash     = sacesiHash(beat, hypothesis, gateResult)
  }
  
  Write doctrineDelta to stable state in cognition_layer.mo
  
On next beat, before constructing ADRESignalFrame:
  Read mostRecentDoctrineDelta from cognition_layer stable state
  Adjust signal.coherence base by: doctrineDelta.fieldState.coherence × PHI_INV
  This closes the loop — the organism's prior decision shapes its next perception
```

---

## LAYER 4 — EXECUTION BINDING

### SOVEREIGN File Mapping

```
adre.mo:
  runADRECycle(signal) → ADREDecision     — all 5 passes in sequence
  forward_ingest(signal) → ringFamily     — Pass 1
  backpass_lawcheck(signal) → lawChecks   — Pass 2
  resonance_check(signal, trend) → ADREResonanceState  — Pass 3
  compression_hypothesis(...) → ADREHypothesis         — Pass 4
  gate_and_emit(...) → ADREDecision       — Pass 5

cognition_layer.mo:
  doctrineDeltaLog : [DoctrineDelta]      — self-writing loop store
  getLatestDoctrineDelta() → ?DoctrineDelta
  writeDoctrineDelta(delta : DoctrineDelta)   — called by adre after gate pass

main.mo:
  On every 873ms heartbeat:
    1. Read mostRecentDoctrineDelta from cognition_layer
    2. Construct ADRESignalFrame (adjusting with prior delta)
    3. Call runADRECycle(signal) → decision
    4. If decision.gateResult: call writeDoctrineDelta(delta)

Invariants:
  1. All 60 laws evaluated every beat — lawChecks.size() == 60 always
  2. Gate condition never relaxed — exact values 0.87 and 0.13
  3. Decision buffer max = 144 = FIB[12] — circular overwrite
  4. sacesiHash computed on every decision regardless of gateResult
  5. passTrace populated with all 5 labels every cycle — passTrace.size() == 5
  6. Self-writing loop CLOSED — doctrineDelta written on gate pass, read on next beat
```

### Builder Instructions

1. The gate condition `finalConfidence > 0.87 AND finalRisk < 0.13` is sealed. Do not change the thresholds. Do not add a bypass. Do not add special-case logic.
2. The self-writing loop MUST be closed. If `writeDoctrineDelta()` is not called after gate pass, the organism is not learning. Check this first.
3. All 60 laws are evaluated on every beat. Not a subset. Not a sample. All 60. If you see the law evaluation batched or skipped, fix it.
4. The SACESI hash is recorded for EVERY decision — including gate-hold decisions. A held decision is not an absent decision. It is a decision to hold.

---

## RECITAL-PLUS-ONE

**Recital**: This document expresses the ADRE Doctrine Law — the 5-pass deliberation loop as the organism's sovereign mind. It summarizes the pass structure, the gate condition, the self-writing loop, and the invariants that must always hold. The full 4-layer specification lives in `docs/organism-space/ADRE_COGNITION_ENGINE.md`.

**Plus-One**: The next version of this document adds the ADRE Forecast Loop — where Pass 4 compresses not just the current hypothesis but a 3-beat lookahead, predicting what the organism will decide on beats n+1, n+2, n+3 based on the current trend. The forecast feeds AEGIS for pre-emptive tension monitoring.

---

*Classification: ORGANISM_CONFIDENTIAL — NeuroEmergence Core*
*Creator: Alfredo Medina Hernandez — Dallas TX 2026*
*TOP SECRET PROPRIETARY — ALL RIGHTS RESERVED*
