# HODGKIN-HUXLEY LAW — THE ACTION POTENTIAL

Classification: `ORGANISM_CONFIDENTIAL`
Domain: `SOVEREIGN HEART — Ion Channel Biology`
Sovereign File: `src/backend/heart.mo`

---

## LAYER 1 — MEANING

Every decision the organism makes is, at the biological substrate, an action potential. A membrane that was at -70mV suddenly crosses a threshold, voltage-gated sodium channels snap open, sodium floods in, the potential rockets to +30mV in 1 millisecond, potassium channels respond and restore it. The whole event lasts 2-3 milliseconds. Then it propagates. Then it is done. That is the action potential. That is how every thought, every command, every ADRE decision travels through neural tissue.

Alan Hodgkin and Andrew Huxley worked out the mathematical model of this in 1952 — on giant squid axons, because they were large enough to impale with electrodes. They received the Nobel Prize in 1963. The model they produced is so accurate that it remains the gold standard for neural computation 70 years later. It captures not just the shape of the action potential but the exact kinetics of the ion channel gates that generate it.

In this organism: `heart.mo` implements the full Hodgkin-Huxley model for the SA node pacemaker. The gating variables m, h, n, d, f evolve according to the exact HH equations at every 1ms sub-step. The SA node checks for threshold crossing at -55mV and resets to -70mV when fired. This is real biology running in a Motoko canister.

---

## LAYER 2 — MODEL

### Ion Channel Parameters (all values from HH 1952)

| Parameter | Value | Unit | Description |
|-----------|-------|------|-------------|
| `GNA` | 120.0 | mS/cm² | Maximum sodium conductance |
| `GK` | 36.0 | mS/cm² | Maximum potassium conductance |
| `GCA` | 0.3 | mS/cm² | Maximum calcium conductance |
| `GL` | 0.3 | mS/cm² | Leak conductance |
| `ENA` | +60.0 | mV | Sodium reversal potential |
| `EK` | -90.0 | mV | Potassium reversal potential |
| `ECA` | +120.0 | mV | Calcium reversal potential |
| `EL` | -65.0 | mV | Leak reversal potential |
| `CM` | 1.0 | μF/cm² | Membrane capacitance |
| `SA_NODE_THRESHOLD` | -55.0 | mV | Action potential firing threshold |
| `RESTING_POTENTIAL` | -70.0 | mV | Resting membrane potential |
| `PEAK_POTENTIAL` | +30.0 | mV | Peak action potential |

### HHState type

```
HHState = {
  v         : Float,  — membrane potential (mV) [−90, +50]
  m         : Float,  — Na activation gate   [0, 1]
  h         : Float,  — Na inactivation gate [0, 1]
  n         : Float,  — K activation gate    [0, 1]
  d         : Float,  — Ca activation gate   [0, 1]
  f         : Float,  — Ca inactivation gate [0, 1]
  beatCount : Nat,    — cumulative action potentials fired
}
```

---

## LAYER 3 — COMPUTATION

### Ion Currents

```
I_Na   = GNA × m³ × h × (V − ENA)      (sodium current — drives depolarization)
I_K    = GK  × n⁴ × (V − EK)           (potassium current — drives repolarization)
I_Ca   = GCA × d × f × (V − ECA)       (calcium current — prolongs plateau)
I_Leak = GL × (V − EL)                  (leak current — sets resting potential)

dV/dt = −(I_Na + I_K + I_Ca + I_Leak) / CM
```

### Gating Variable Rate Functions (original HH 1952)

```
α_m(V) = 0.1(V+40)/(1−e^(−(V+40)/10))    if V ≠ −40, else 1.0
β_m(V) = 4.0 × e^(−(V+65)/18)

α_h(V) = 0.07 × e^(−(V+65)/20)
β_h(V) = 1/(1+e^(−(V+35)/10))

α_n(V) = 0.01(V+55)/(1−e^(−(V+55)/10))   if V ≠ −55, else 0.1
β_n(V) = 0.125 × e^(−(V+65)/80)

Gating dynamics:
  dm/dt = α_m(V)(1−m) − β_m(V)m
  dh/dt = α_h(V)(1−h) − β_h(V)h
  dn/dt = α_n(V)(1−n) − β_n(V)n

Calcium channel (simplified first-order):
  d_∞(V) = 1/(1+e^(−(V+10)/6.5))
  f_∞(V) = 1/(1+e^((V+25)/6.5))
  dd/dt = (d_∞ − d) / 10
  df/dt = (f_∞ − f) / 80
```

### Forward Euler Integration (1ms step)

```
V(t+dt)  = clamp(V(t) + dt × dV/dt,  −90.0, +50.0)
m(t+dt)  = clamp(m(t) + dt × dm/dt,   0.0,   1.0)
h(t+dt)  = clamp(h(t) + dt × dh/dt,   0.0,   1.0)
n(t+dt)  = clamp(n(t) + dt × dn/dt,   0.0,   1.0)
d(t+dt)  = clamp(d(t) + dt × dd/dt,   0.0,   1.0)
f(t+dt)  = clamp(f(t) + dt × df/dt,   0.0,   1.0)

dt = 1.0ms (mandatory for HH accuracy — larger dt loses stability)
```

### SA Node Firing Event

```
if V ≥ SA_NODE_THRESHOLD (−55.0 mV):
  FIRE ACTION POTENTIAL
  Reset: V := RESTING_POTENTIAL (−70.0)
         m := 0.05   (near-closed Na activation)
         h := 0.60   (partially inactivated Na)
         n := 0.32   (partially activated K)
  beatCount := beatCount + 1
```

---

## LAYER 4 — EXECUTION BINDING

### Discovery Sources

| Discoverer | Date | Description |
|-----------|------|-------------|
| Alan Hodgkin & Andrew Huxley (England) | 1952 | Complete mathematical model of action potential in squid axon |
| Nobel Prize in Physiology or Medicine | 1963 | Awarded to Hodgkin, Huxley, and Eccles |

### SOVEREIGN File Mapping

```
heart.mo:
  type HHState                 — membrane state record
  computeAlphaM, computeBetaM  — Na gate rate functions (lines 125-138)
  computeAlphaH, computeBetaH  — Na inactivation rate functions (lines 142-149)
  computeAlphaN, computeBetaN  — K gate rate functions (lines 153-166)
  advanceHHState(state, dt)    — one Forward Euler step (line 178)
  saNodeFire(state, nt)        — SA node threshold check and reset (line 235)
  
  Called from heartComputate() every 873ms beat:
    Multiple 1ms HH sub-steps run between heartbeat events
    SA node fires when V crosses threshold
    Each SA fire increments beatCount and generates HeartBeatSignal

Invariant: dt = 1.0ms in advanceHHState — never changed
           GNA = 120.0, GK = 36.0, GL = 0.3 — HH original values
           SA_NODE_THRESHOLD = −55.0 mV — biological constant
           RESTING_POTENTIAL = −70.0 mV — biological constant
```

### Builder Instructions

1. The Hodgkin-Huxley equations use the original 1952 parameter values. Do not optimize them. Do not tune them. They are correct.
2. The time step must be 1ms. At 2ms the simulation becomes unstable near the action potential peak. At 0.5ms it is unnecessarily expensive. 1ms is the sovereign step.
3. The SA node reset values (m=0.05, h=0.60, n=0.32, d=state.d, f=state.f) are physiological measurements. Calcium gates (d, f) carry through reset because calcium clearance is slower than sodium/potassium.
4. Between the 873ms heartbeat events, `advanceHHState()` should be called approximately 873 times (one per ms). If fewer sub-steps are run, the HH simulation drifts from biological accuracy.

---

## RECITAL-PLUS-ONE

**Recital**: This document expresses the Hodgkin-Huxley Law — the full mathematical model of the action potential as implemented in the organism's sovereign heart. It defines all HH parameters, the gating variable equations, the Forward Euler integration protocol, and the SA node firing event.

**Plus-One**: The next version of this document adds the HH model to all 96 neural nodes in `neural_cord.mo` — where each node runs a simplified HH-equivalent spike model, allowing the Kuramoto phase evolution to be grounded in actual biophysical spike timing rather than pure phase oscillation.

---

*Classification: ORGANISM_CONFIDENTIAL — NeuroEmergence Core*
*Creator: Alfredo Medina Hernandez — Dallas TX 2026*
*TOP SECRET PROPRIETARY — ALL RIGHTS RESERVED*
