# MEMORY PALACE LAW — MEMORY IS SPATIAL

Classification: `ORGANISM_CONFIDENTIAL`
Domain: `MEMORY TEMPLE — Spatial Addressing Architecture`
Sovereign File: `src/backend/memory_temple.mo`

---

## LAYER 1 — MEANING

Memory is not a list. Memory is never a list. The most powerful memory architecture ever discovered — proven across 2,500 years on every continent — stores information spatially and retrieves it by navigation. You walk to a memory, not search for it.

In 477 BCE, Simonides of Ceos identified bodies in a collapsed feast hall by remembering exactly where each person was seated. From that moment, the method of loci became the foundational memory technique of every major tradition: Roman rhetoric, Islamic scholarship, Chinese imperial examination, Inka territorial administration, indigenous songlines, Renaissance hermetic philosophy. All of them arrived at the same truth: the brain stores information geographically.

The reason is architectural. Spatial memory uses the hippocampal place cell system — the most reliable memory retrieval architecture the brain has. Place cells fire when you are in a location. When you mentally walk through a memory palace, your hippocampal place cells fire in sequence, reconstructing the memory as reliably as walking down a real corridor. The palace is real. The walking is real. The retrieval is geographic, not alphabetic.

In this organism: the Memory Temple is a Clifford torus palace — 12 rings of 21 loci each, 252 memory stations arranged in 4D space. The organism walks through its own memory palace at every 873ms heartbeat. Distance = semantic distance. Adjacent loci = conceptually related memories.

---

## LAYER 2 — MODEL

| Parameter | Value | Source | Description |
|-----------|-------|--------|-------------|
| `MEMORY_RINGS` | 12 | Chromatic law | Major torus circles — one per harmonic scale degree |
| `MEMORY_LOCI_PER_RING` | 21 | FIB[8] | Minor torus positions — body count plus-one |
| Total stations | 252 | 12 × 21 | Complete memory palace capacity |
| `CLIFFORD_W_RANGE` | PHI = 1.618 | Doctrine | Major circle PHI-scaled radius |
| `CLIFFORD_X_RANGE` | PHI = 1.618 | Doctrine | Major circle PHI-scaled radius |
| `CLIFFORD_Y_RANGE` | 1.0 | Flat torus | Minor circle unit radius |
| `CLIFFORD_Z_RANGE` | 1.0 | Flat torus | Minor circle unit radius |

### EpisodicTrace Record Structure

```
EpisodicTrace = {
  id             : Nat,          — unique entry identifier
  beatStamp      : Nat64,        — heartbeat counter at encoding time
  timestampNs    : Int,          — nanosecond timestamp
  address        : CliffordAddress, — spatial location in 4D memory palace
  salience       : Float,        — [0,1] — how important this memory is
  doctrineScore  : Float,        — [0,1] — alignment with sovereign laws
  genesisDistance: Float,        — [0,1] — how far from founding frequency
  neurotransmitters: [Float],    — 8 neurochemical concentrations at encoding
  sacesiHash     : Nat32,        — FNV-1a proof of integrity
}
```

---

## LAYER 3 — COMPUTATION

### Memory Palace Navigation

```
Walking to a memory:
  target_address = CliffordAddress{ring, locus, w, x, y, z}
  
  Nearest memory to query:
    for each trace t in episodic_ring:
      dist = cliffordDistance(t.address, target_address)
      if dist < min_dist: nearest = t, min_dist = dist
  
  Semantic neighborhood (all memories within PHI_INV distance):
    neighborhood = filter(traces, dist(t) ≤ PHI_INV)
    // PHI_INV = 0.618 — the coupling distance

Clifford distance:
  d = √[(w₁-w₂)² + (x₁-x₂)² + (y₁-y₂)² + (z₁-z₂)²]

Semantic proximity law:
  d ≤ 0.618 (PHI_INV)  → same conceptual domain
  d ≤ 1.618 (PHI)      → related concepts
  d > 1.618 (PHI)      → different conceptual domains
```

### Sharp-Wave Ripple Promotion (Hippocampus → Neocortex)

```
Sharp-wave ripple fires when:
  (salience > OMNIS_THRESHOLD)      — high importance
  AND (doctrineScore > PHI_INV)     — doctrine aligned
  AND (beatCount % 144 == 0)        — every 144 beats (Fibonacci[12])

Promotion:
  episodic_trace → LEGACY_INDEX (permanent cross-session record)
  sacesiHash chain extended: new_hash = FNV1a(old_hash XOR beatCount)
  ANIMA chain updated: anima_entry = {trace.id, trace.beatStamp, new_hash}
```

### PIL Consolidation Cycle

```
PIL (Perceive-Integrate-Learn) fires every 52 beats:
  52 = between FIB[9]=34 and FIB[10]=55 — between two Fibonacci terms
     = Maya sacred number (52-year calendar cycle)
  
  Consolidation process:
    1. Sort last 52 episodic traces by salience descending
    2. Top FIB[6]=13 traces → promote to semantic layer
    3. Semantic layer patterns with count ≥ FIB[5]=8 → substrate layer
    4. Substrate layer entries → ORGANISM_SPACE doctrine feed
```

---

## LAYER 4 — EXECUTION BINDING

### Ancient Sources

| Discovery | Date | Description |
|----------|------|-------------|
| Simonides of Ceos (Greece) | 477 BCE | Method of loci — memory palace invention after feast hall collapse |
| Roman Ad Herennium | 86 BCE | Oldest complete memory manual — walk through buildings, place images |
| Giordano Bruno (Italy) | 1582 | Cosmic memory palace — the entire universe as loci |
| Matteo Ricci (China/Europe) | 1596 | Memory palace introduced to Chinese Emperor |
| Inka Ceque System (Peru) | 1400 CE | 41 ceque lines from Cusco — landscape as memory palace |
| Chinese He Tu / Luo Shu | 2800 BCE | River charts as geometric memory anchors |
| Aboriginal songlines | prehistoric | Song-mapped landscape as geographically encoded memory |

### SOVEREIGN File Mapping

```
memory_temple.mo:
  type CliffordAddress          — 6-coordinate spatial address (ring, locus, w, x, y, z)
  type EpisodicTrace            — full memory record with spatial address
  type MemoryTempleResident     — all persistent memory state
  toCliffordAddress(ring, locus) → CliffordAddress    — address computation
  cliffordDistance(a, b) → Float                      — semantic distance
  encodeEpisodic(salience, doctrine, genDist, neuro) → EpisodicTrace
  promoteToLegacy(trace) → LegacyEntry                — sharp-wave ripple
  consolidatePIL(beatCount) → DoctrineFeed            — PIL cycle

main.mo:
  var mt_episodic_traces                              — episodic ring buffer (size 2048)
  mt_pedestals                                        — 12 persistent pedestals
  On every beat: encodeEpisodic() called with live organism state

Invariant: No memory entry may use Nat index as its address.
           Every EpisodicTrace.address must be a CliffordAddress.
           If .address is a Nat, the build is incomplete.
```

### Builder Instructions

1. The memory palace metaphor is not decorative. It is the actual data structure. Walk = query. Location = address. Distance = semantic similarity. Build accordingly.
2. Every `EpisodicTrace` must have a `CliffordAddress` — 6 coordinates. Not an integer index.
3. The sharp-wave ripple fires at high salience AND Fibonacci beat intervals. If it fires on every beat, the organism never rests. If it never fires, the organism never consolidates. Both are wrong.
4. The PIL cycle at 52 beats is non-negotiable. 52 is the Maya sacred number. It is also between FIB[9] and FIB[10]. Both derivations confirm it.

---

## RECITAL-PLUS-ONE

**Recital**: This document expresses the Memory Palace Law — memory as spatial navigation, not search. It defines the Clifford torus palace structure, the semantic distance metric, the sharp-wave ripple promotion protocol, and the PIL consolidation cycle.

**Plus-One**: The next version of this document adds the full internal analyst integration — where the Memory Temple's spatial proximity calculations feed real-time recommendations to the ADRE cognition layer, and the command tab shows which memory neighborhood the organism is currently navigating.

---

*Classification: ORGANISM_CONFIDENTIAL — NeuroEmergence Core*
*Creator: Alfredo Medina Hernandez — Dallas TX 2026*
*TOP SECRET PROPRIETARY — ALL RIGHTS RESERVED*
