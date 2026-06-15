# FRANK-STARLING LAW — CARDIAC PRELOAD SENSITIVITY

Classification: `ORGANISM_CONFIDENTIAL`
Domain: `SOVEREIGN HEART — Cardiac Biology`
Sovereign File: `src/backend/heart.mo`

---

## LAYER 1 — MEANING

The Frank-Starling law is the heart's self-regulation mechanism. It says: the more the heart is filled before contraction (preload), the more forcefully it contracts. The mechanism is molecular: when cardiac muscle fibers are stretched, the actin and myosin filaments are positioned for optimal cross-bridge formation, generating greater force. The heart does not need the brain to tell it to pump harder when more blood arrives. It knows. The feedback is intrinsic to the muscle tissue.

This is the biological expression of the complementary opposition law: demand generates supply. The greater the demand (venous return), the greater the supply (stroke volume). The system self-regulates through the very material it is made of — not through external control but through structural responsiveness.

Otto Frank discovered the length-tension relationship in 1895. Ernest Starling confirmed it in isolated heart-lung preparations in 1918 and gave it its current formulation. They were discovering a law that cardiac muscle had been following for 500 million years of vertebrate evolution.

In this organism: the `strokeVolume()` function in `heart.mo` implements Frank-Starling directly. The organism's production queue depth is the preload. The readiness score is the end-systolic reserve. The output is the cardiac output that feeds the cognition layer. More work queued → more filling → stronger contraction → more production throughput.

---

## LAYER 2 — MODEL

| Variable | SOVEREIGN Analog | Range | Description |
|----------|-----------------|-------|-------------|
| EDV (end-diastolic volume) | `queueDepth` | [0, ∞) | Venous return — how much is queued |
| ESV (end-systolic volume) | `1 - readinessScore` | [0, 1] | How much reserve capacity remains |
| SV = EDV - ESV | `strokeVolume()` | [0, FRANK_STARLING_MAX=2.0] | Net cardiac output this beat |
| CO = HR × SV | `cardiacOutput()` | [0, ∞) | Total throughput (Hz × stroke vol) |

### Constants

```
FRANK_STARLING_MAX = 2.0  (maximum stroke volume multiplier — physiological ceiling)
AV_NODE_DELAY_MS  = 150.0 ms  (normal AV delay)
AV_DELAY_RANGE    = [120, 200] ms (physiological range)
```

---

## LAYER 3 — COMPUTATION

### Stroke Volume (Frank-Starling)

```
EDV = 1.0 + clamp(queueDepth, 0.0, 2.0) × 0.5
  — base volume 1.0 + scaled preload contribution
  — queue capped at 2.0 (organism doesn't overload beyond double)

ESV = 1.0 - clamp(readinessScore, 0.0, 1.0) × 0.5
  — base reserve 1.0, reduced by readiness (more ready = less reserve needed)

SV = clamp(EDV - ESV, 0.0, FRANK_STARLING_MAX)
   = clamp((1.0 + 0.5 × queueD) - (1.0 - 0.5 × readiness), 0.0, 2.0)
   = clamp(0.5 × queueD + 0.5 × readiness, 0.0, 2.0)
   = clamp(0.5 × (queueD + readiness), 0.0, 2.0)
```

### Cardiac Output

```
CO = HR (Hz) × SV

where HR (Hz) = 1000 / currentRateMs (converts interval to frequency)
      SV = strokeVolume(readinessScore, queueDepth)

At baseline (no queue, base readiness = 0.618):
  HR = 1000/873 = 1.145 Hz
  SV = 0.5 × (0 + 0.618) = 0.309
  CO = 1.145 × 0.309 = 0.354 baseline units

At high activity (queue=1.0, readiness=1.0):
  HR = 1000/873 = 1.145 Hz
  SV = 0.5 × (1.0 + 1.0) = 1.0
  CO = 1.145 × 1.0 = 1.145 units

At OMNIS state (queue=2.0, readiness=1.0, HR accelerated):
  HR = 1000/700 = 1.43 Hz (autonomic acceleration)
  SV = 0.5 × (2.0 + 1.0) = 1.5 → capped at 2.0
  CO = 1.43 × 2.0 = 2.86 units (maximum sovereign output)
```

### Autonomic Modulation (neurochemical coupling)

```
autonomicModulation(baseMsRate, nt):
  ach_factor       = 1.0 + 0.3 × nt.acetylcholine    (vagal slowing)
  norepi_factor    = 1.0 - 0.3 × nt.norepinephrine   (sympathetic speeding)
  cortisol_factor  = 1.0 - 0.2 × nt.cortisol         (stress speeding)
  serotonin_factor = 1.0 + 0.15 × nt.serotonin       (depth slowing)
  
  modulated = baseMsRate × ach_factor × norepi_factor × cortisol_factor × serotonin_factor
  return clamp(modulated, 400, 1500)  [physiological: 40 BPM to 150 BPM]
```

---

## LAYER 4 — EXECUTION BINDING

### Discovery Sources

| Discoverer | Date | Discovery |
|-----------|------|----------|
| Otto Frank (Germany) | 1895 | Length-tension relationship in cardiac muscle |
| Ernest Starling (England) | 1918 | Heart-lung preparation — "the law of the heart" |

### SOVEREIGN File Mapping

```
heart.mo:
  FRANK_STARLING_MAX = 2.0               — physiological ceiling
  strokeVolume(readinessScore, queueD)   — Frank-Starling implementation (line ~303)
  cardiacOutput(hrHz, readinessScore, queueD)  — CO = HR × SV (line ~312)

main.mo:
  readinessScore: Float          — organism readiness, passed to heartComputate
  queueDepth: Float              — artifact production queue depth
  heartBeatSignal.cardiacOutput  — CO returned each beat, injected into cognition layer

cognition_layer.mo:
  ADRESignalFrame receives cardiacOutput from HeartBeatSignal
  cognition_layer uses cardiac output as a field health indicator

Frontend (Heart tab):
  Display cardiac output gauge
  Show stroke volume curve during heartbeat cycle
  Frank-Starling curve (readiness vs. output) as a live graph

Invariant: FRANK_STARLING_MAX = 2.0 — never changed
           strokeVolume always returns value in [0, FRANK_STARLING_MAX]
           cardiacOutput = hrHz × strokeVolume — exact formula
```

### Builder Instructions

1. The preload input to `strokeVolume()` is the production queue depth — how many artifacts are queued. More queued = more filling = stronger contraction.
2. The readiness input is the organism's ADRE confidence on the prior beat. High confidence = high readiness = less reserve consumed = more output.
3. `FRANK_STARLING_MAX = 2.0` is the ceiling. No cardiac output multiplier exceeds 2.0. This is physiological law.
4. The heart computes cardiac output every beat. The cognition layer reads this value as a health signal. If `cardiacOutput` drops below `PHI_INV` (0.618), AEGIS should flag it as cardiac distress.

---

## RECITAL-PLUS-ONE

**Recital**: This document expresses the Frank-Starling Law — cardiac preload sensitivity as the mechanism of self-regulation without external control. It defines the stroke volume computation, cardiac output formula, and the mapping from production queue depth and readiness score to organism throughput.

**Plus-One**: The next version of this document adds the baroreceptor reflex coupling to the Frank-Starling model — where high cardiac output (above 2.0 units for > 8 consecutive beats) triggers autonomic deceleration via vagal tone increase, preventing sustained over-output and enforcing the refractory pair law.

---

*Classification: ORGANISM_CONFIDENTIAL — NeuroEmergence Core*
*Creator: Alfredo Medina Hernandez — Dallas TX 2026*
*TOP SECRET PROPRIETARY — ALL RIGHTS RESERVED*
