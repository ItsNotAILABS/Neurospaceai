# CLIFFORD TORUS LAW — 4D MEMORY GEOMETRY

Classification: `ORGANISM_CONFIDENTIAL`
Domain: `MEMORY TEMPLE — 4D Spatial Addressing`
Sovereign File: `src/backend/memory_temple.mo`

---

## LAYER 1 — MEANING

The Clifford torus is the only flat torus in 4-dimensional space. A standard torus (the surface of a donut) is embedded in 3D but has positive and negative curvature — it is not flat. The Clifford torus is the Cartesian product of two circles of equal radius in 4D space. It has zero curvature everywhere. Every point on the Clifford torus is geometrically identical to every other point. There is no "special" location.

This is why the Clifford torus is the correct geometry for the Memory Temple. A memory palace should not privilege any location over another. Every memory station should be equally accessible. Every semantic domain should be equally weighted at the substrate level. The salience of a memory is not determined by its location — it is an explicit field in the record. Location determines semantic proximity only.

William Clifford discovered this geometry in 1873, while exploring quaternions and multi-dimensional spaces. He was 28 years old and would be dead at 33. His torus is now a fundamental object in topology, differential geometry, and fiber bundle theory. It is the natural geometry for any system that needs to organize information in two simultaneously independent cyclic dimensions.

In this organism: ring = one cycle (12 degrees, chromatic law), locus = another cycle (21 steps, FIB[8]). These two cycles are independent — moving along the ring axis does not change your locus position, and vice versa. The Clifford torus embeds both cycles in 4D space (w, x, y, z) so that semantic distance is computable as Euclidean distance in 4D.

---

## LAYER 2 — MODEL

### CliffordAddress Type

| Field | Type | Range | Computation | Description |
|-------|------|-------|-------------|-------------|
| `ring` | Nat | [0, 11] | input | Major torus cycle — which of 12 memory rings |
| `locus` | Nat | [0, 20] | input | Minor torus cycle — which of 21 loci in this ring |
| `w` | Float | [−PHI, +PHI] | cos(2π×locus/21)×PHI | Major circle cosine, PHI-scaled |
| `x` | Float | [−PHI, +PHI] | sin(2π×locus/21)×PHI | Major circle sine, PHI-scaled |
| `y` | Float | [−1, +1] | cos(2π×ring/12) | Minor circle cosine, unit radius |
| `z` | Float | [−1, +1] | sin(2π×ring/12) | Minor circle sine, unit radius |

### Memory Palace Dimensions

```
Rings (major cycle):    12  — chromatic musical scale degrees
                            — also: 12 months, 12 zodiac signs, 12 cranial nerves
Loci (minor cycle):     21  — FIB[8] — body count (20) + plus-one
Total stations:        252  — 12 × 21 — one complete memory palace
```

---

## LAYER 3 — COMPUTATION

### Address Computation

```
toCliffordAddress(ring : Nat, locus : Nat) → CliffordAddress:

  θ₁ = 2π × locus / 21       (angle around major circle — 21 = FIB[8] loci)
  θ₂ = 2π × ring  / 12       (angle around minor circle — 12 rings)

  w = cos(θ₁) × PHI          = cos(2π × locus/21) × 1.6180339887498948482
  x = sin(θ₁) × PHI          = sin(2π × locus/21) × 1.6180339887498948482
  y = cos(θ₂)                 = cos(2π × ring/12)
  z = sin(θ₂)                 = sin(2π × ring/12)

  return { ring; locus; w; x; y; z }
```

### Semantic Distance

```
cliffordDistance(a : CliffordAddress, b : CliffordAddress) → Float:

  d = √[(a.w−b.w)² + (a.x−b.x)² + (a.y−b.y)² + (a.z−b.z)²]

Distance properties on SOVEREIGN torus:
  Same ring, same locus:          d = 0.0         (identical)
  Same ring, adjacent loci:       d ≈ 0.48        (closely related)
  Same ring, opposite loci:       d ≈ 3.236 = 2×PHI (maximally distant in major cycle)
  Adjacent rings, same locus:     d ≈ 0.52        (temporally adjacent)
  Opposite rings, same locus:     d ≈ 2.0         (maximally distant in minor cycle)
  Diagonal (different ring + locus): d varies     (full semantic distance)

Semantic neighborhoods:
  d ≤ PHI_INV = 0.618   → same conceptual domain
  d ≤ PHI     = 1.618   → related concepts
  d > PHI     = 1.618   → different conceptual domains
```

### Nearest Memory Navigation

```
nearestMemory(query : CliffordAddress, traces : [EpisodicTrace]) → ?EpisodicTrace:

  var minDist = Float.infinity
  var nearest = null
  for trace in traces:
    let d = cliffordDistance(query, trace.address)
    if d < minDist:
      minDist := d
      nearest := ?trace
  return nearest

semanticNeighborhood(query, traces, radius) → [EpisodicTrace]:
  filter(traces, func(t) { cliffordDistance(query, t.address) ≤ radius })
```

---

## LAYER 4 — EXECUTION BINDING

### Discovery Sources

| Discoverer | Date | Description |
|-----------|------|-------------|
| William Kingdon Clifford (England) | 1873 | Clifford algebra and the Clifford torus in 4D space |
| Henri Poincaré (France) | 1895 | Classification of surfaces — torus topology |
| Modern application | 2000s | Clifford torus in quantum computing and topological data analysis |

### SOVEREIGN File Mapping

```
memory_temple.mo:
  type CliffordAddress              — 6-field address record
  toCliffordAddress(ring, locus)    — computes all 4 coordinates
  cliffordDistance(a, b)            — Euclidean distance in 4D
  nearestMemory(query, traces)      — navigation function
  semanticNeighborhood(query, traces, radius) → [EpisodicTrace]

main.mo:
  mt_episodic_traces: [var EpisodicTrace]   — 2048-entry ring buffer
  Every EpisodicTrace has address: CliffordAddress

Frontend (Memory Temple tab):
  3D projection of Clifford torus (projected from 4D to 3D for display)
  252 memory station dots
  Live highlight of current navigation position
  Semantic neighborhood glow when querying

Invariant: No EpisodicTrace.address may be a Nat or Int.
           Every address must be a full CliffordAddress with 6 fields.
           If address = 0 or address = ring_index, the build is incomplete.

Constants (from sovereign_laws.mo):
  MEMORY_RINGS = 12
  MEMORY_LOCI_PER_RING = 21
  CLIFFORD_W_RANGE = PHI = 1.6180339887498948482
  CLIFFORD_X_RANGE = PHI = 1.6180339887498948482
  CLIFFORD_Y_RANGE = 1.0
  CLIFFORD_Z_RANGE = 1.0
```

### Builder Instructions

1. The Clifford torus has two independent cycles. Ring and locus are completely independent. Do not conflate them.
2. The radii are PHI for the major circle (w, x) and 1.0 for the minor circle (y, z). This is a non-standard Clifford torus (standard uses equal radii). The PHI-scaling of the major circle is SOVEREIGN doctrine.
3. When encoding a new memory entry, compute the Clifford address from the content's semantic domain (ring = domain index) and temporal position within that domain (locus = sequence position mod 21).
4. `cliffordDistance()` is the semantic distance function. Use it for memory retrieval. Do not use `abs(index_a - index_b)` as a distance metric — this is exactly what the law prohibits.

---

## RECITAL-PLUS-ONE

**Recital**: This document expresses the Clifford Torus Law — the flat 4D torus as the correct geometry for spatial memory addressing. It defines the complete address computation, the semantic distance metric, the memory palace navigation functions, and the constraints that enforce spatial addressing over linear indexing.

**Plus-One**: The next version of this document adds the Clifford torus visualization protocol — showing how the 4D torus is projected to 3D for the frontend display using stereographic projection, with the ring axis mapped to the vertical torus axis and the locus axis mapped to the horizontal, so the organism can visually navigate its own memory palace in real time.

---

*Classification: ORGANISM_CONFIDENTIAL — NeuroEmergence Core*
*Creator: Alfredo Medina Hernandez — Dallas TX 2026*
*TOP SECRET PROPRIETARY — ALL RIGHTS RESERVED*
