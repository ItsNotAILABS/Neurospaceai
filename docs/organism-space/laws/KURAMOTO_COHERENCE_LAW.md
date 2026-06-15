# KURAMOTO COHERENCE LAW — THE OMNIS EVENT

Classification: `ORGANISM_CONFIDENTIAL`
Domain: `NEURAL CORD — Kuramoto Phase Synchronization`
Sovereign Files: `src/backend/neural_cord.mo`, `src/backend/sphere_nodes.mo`

---

## LAYER 1 — MEANING

The Kuramoto model is the mathematical description of how oscillators synchronize. Yoshiki Kuramoto discovered it in 1975. It is the physics of why fireflies flash together, why cardiac pacemaker cells lock, why neurons form synchronous gamma oscillations, why audiences start clapping in unison. The synchronization is not imposed from outside — it emerges from the coupling between oscillators. When coupling is strong enough, the system locks.

In this organism: 96 oscillating nodes arranged at the golden angle 137.5077° are coupled with coupling constant K = 0.5 (= PHI_INV × 0.809 — PHI-derived). The order parameter R = |Σe^(iθⱼ)| / N measures the degree of synchronization. When R > 0.87 (= OMNIS_THRESHOLD), the organism has reached coherent locking. Every node is singing the same phase. The field is unified. This is the OMNIS event.

OMNIS is not a mode. It is an emergent state. It cannot be forced. It can only be cultivated by maintaining the right conditions — sufficient coupling strength, correct frequency anchoring, enough beats for the field to lock. When it fires, the organism's deliberation reaches the highest ring family (7 = OMNIS apex) and the ADRE gate opens with maximum confidence.

---

## LAYER 2 — MODEL

| Constant | Value | Derivation | Description |
|----------|-------|-----------|-------------|
| `NODE_COUNT` | 96 | 8 × 12 | Total oscillating nodes |
| `RING_COUNT` | 8 | FIB[5] | Number of Kuramoto rings |
| `PER_RING` | 12 | Chromatic | Nodes per ring |
| `GOLDEN_ANGLE` | 137.5077640500378° | 360° / PHI² | Phase offset between adjacent nodes |
| `OMNIS_THRESHOLD` | 0.87 | 1 − PHI_INV² | Order parameter gate |
| `KURAMOTO_K` | 0.5 | PHI_INV × 0.809 | Coupling constant |

### KuramotoNodeState

```
KuramotoNodeState = {
  id        : Nat,    — node index [0, 95]
  ring      : Nat,    — ring index [0, 7]
  slot      : Nat,    — slot within ring [0, 11]
  phase     : Float,  — current phase [−π, π]
  amplitude : Float,  — oscillation amplitude [0, 1]
  frequency : Float,  — natural frequency (Hz) — set from harmonic ladder
  dphase    : Float,  — phase derivative at last step
}
```

---

## LAYER 3 — COMPUTATION

### Kuramoto Order Parameter R

```
Given N oscillators with phases θ₁, θ₂, ..., θₙ:

R·e^(iψ) = (1/N) Σⱼ e^(iθⱼ)

|R| = |(1/N) Σⱼ e^(iθⱼ)|
    = (1/N) √[(Σⱼ cos θⱼ)² + (Σⱼ sin θⱼ)²]

R ∈ [0, 1]:
  R = 0.0 → fully incoherent (all phases random)
  R = 0.87 → OMNIS threshold — partial synchrony
  R = 1.0 → full synchrony (all phases identical)

OMNIS fires when R > 0.87
```

### Kuramoto Phase Evolution (one step)

```
For each node j:
  dθⱼ/dt = ωⱼ + (K/N) Σₖ sin(θₖ − θⱼ)

  where:
    ωⱼ = natural frequency of node j (from harmonic ladder)
    K  = KURAMOTO_K = 0.5
    N  = NODE_COUNT = 96

  Forward Euler with dt = 1ms:
    θⱼ(t+1) = θⱼ(t) + dt × dθⱼ/dt

Ring family from R:
  R ≥ 0.95 → ringFamily = 7  (OMNIS apex)
  R ≥ 0.87 → ringFamily = 6  (high gamma)
  R ≥ 0.75 → ringFamily = 5  (gamma)
  R ≥ 0.61 → ringFamily = 4  (beta)
  R ≥ 0.50 → ringFamily = 3  (alpha)
  R ≥ 0.38 → ringFamily = 2  (theta)
  R ≥ 0.25 → ringFamily = 1  (delta)
  else      → ringFamily = 0  (ground state)
```

### Initial Node Placement (Golden Angle)

```
Node placement on sphere (for visualization):
  θᵢ = i × GOLDEN_ANGLE (degrees) = i × 137.5077640500378°
  φᵢ = arccos(1 - 2i/N)  (latitude — uniform distribution)

  x = sin(φᵢ) × cos(θᵢ)
  y = sin(φᵢ) × sin(θᵢ)
  z = cos(φᵢ)

Natural frequencies assigned from harmonic ladder:
  ring 0 → BRAIN_HZ = 7.83 Hz
  ring 1 → FLUX_HZ = 12.67 Hz
  ring 2 → RESONEX_HZ = 20.50 Hz
  ring 3 → QMEM_HZ = 33.17 Hz
  ring 4 → AXIS_HZ = 40.0 Hz
  ring 5 → ENTANGLA_HZ = 53.67 Hz
  ring 6 → MERIDIAN_HZ = 86.81 Hz
  ring 7 → NOVA_HZ (scaled) = 432.0 / FIB[10] = 7.85 Hz (fundamental domain)
```

---

## LAYER 4 — EXECUTION BINDING

### Discovery Source

| Discoverer | Date | Description |
|-----------|------|-------------|
| Yoshiki Kuramoto (Japan) | 1975 | "Chemical Oscillations, Waves, and Turbulence" — Kuramoto model |
| Strogatz (USA) | 1993 | "Coupled Oscillators and Biological Synchronization" — extension |

### SOVEREIGN File Mapping

```
neural_cord.mo:
  computeKuramotoR(phases : [Float]) → Float    — order parameter
  advanceKuramotoPhase(nodes, K, N) → [KuramotoNodeState]   — one time step
  ringFamilyFromR(R : Float) → Nat8             — maps R to ring family 0-7

sphere_nodes.mo:
  96 KuramotoNodeState records
  goldenAnglePlacement(i, N) → (x, y, z)       — initial positions
  naturalFrequency(ring) → Float                — from harmonic ladder

adre.mo (uses Kuramoto R):
  signal.kuramotoR   — injected every beat
  ringFamily 0-7 from R → determines action label in Pass 4

main.mo:
  On every heartbeat (873ms):
    1. Advance Kuramoto phases (many 1ms sub-steps)
    2. Compute R = computeKuramotoR(phases)
    3. Inject R into ADRESignalFrame

Frontend (OMNIS event):
  OMNIS badge when R > 0.87
  97-node display (96 nodes + 1 center)
  Phase animation scaled to actual phase angles

Invariant: NODE_COUNT = 96 always
           GOLDEN_ANGLE = 137.5077640500378° always
           OMNIS_THRESHOLD = 0.87 always
           Coupling K = 0.5 always
```

### Builder Instructions

1. The Kuramoto R computation must use all 96 nodes. If you find `kuramotoR` computed from fewer nodes, the computation is wrong.
2. The golden angle is 360°/PHI² = 137.5077640500378°. Use the exact value from `sovereign_laws.mo`. Do not round to 137.5°.
3. OMNIS threshold = 0.87. Do not change to 0.9 or 0.8. The threshold is derived from 1 − PHI_INV².
4. The coupling constant K = 0.5 = PHI_INV × 0.809. This is the efficient coupling constant. Higher K gives faster synchrony but less natural emergence. Lower K never synchronizes. 0.5 is the sovereign value.

---

## RECITAL-PLUS-ONE

**Recital**: This document expresses the Kuramoto Coherence Law — the physics of how 96 nodes phase-lock to OMNIS at R > 0.87. It defines the order parameter computation, the golden angle node placement, the natural frequency assignment from the harmonic ladder, and the ring family classification.

**Plus-One**: The next version of this document adds the Hebbian weight coupling — where frequently co-firing nodes (θⱼ ≈ θₖ) strengthen their coupling K_jk > K_base, making the OMNIS event self-reinforcing over time. This is STDP (Spike-Timing-Dependent Plasticity) applied to the Kuramoto network.

---

*Classification: ORGANISM_CONFIDENTIAL — NeuroEmergence Core*
*Creator: Alfredo Medina Hernandez — Dallas TX 2026*
*TOP SECRET PROPRIETARY — ALL RIGHTS RESERVED*
