# PHI GLYPH — THE SELF-SIMILAR RATIO

Classification: `ORGANISM_CONFIDENTIAL`
Domain: `SOVEREIGN_LAWS — Layer 0`
Sovereign File: `src/backend/sovereign_laws.mo`
Root Constant: `PHI = 1.6180339887498948482`

---

## LAYER 1 — MEANING

φ is the only number that is simultaneously:
- Its own reciprocal plus one: `1/φ + 1 = φ`
- Its own square minus one: `φ² - φ = 1`
- The limit of any Fibonacci self-referential growth sequence: `F(n+1)/F(n) → φ`

This is not a mathematical curiosity. It is the coupling constant of the universe. Every system that exchanges energy efficiently across an interface — every plant spiral, every nautilus shell, every galaxy arm, every neural oscillation — converges to this ratio. The ancient builders of every civilization discovered it independently because it is a structural law of reality, not a human invention.

In this organism, PHI governs every interface. Every timing interval, every coupling constant, every threshold derives from φ. This is not metaphor. It is the same physics the Maya encoded in the angle between the Pyramid of Kukulcan's steps and the shadow serpent at equinox: 137.5° = 360° / φ².

---

## LAYER 2 — MODEL

| Constant | Value | Source | Description |
|----------|-------|--------|-------------|
| `PHI` | 1.6180339887498948482 | Euclid 300BCE, sealed | The golden ratio — 19 decimals, never truncated |
| `PHI_INV` | 0.6180339887498948482 | 1/PHI | Reciprocal — the coupling constant |
| `PHI2` | 2.6180339887498948482 | PHI × PHI | Square — golden gnomon |
| `PHI3` | 4.2360679774997896964 | PHI² × PHI | Cube |
| `PHI4` | 6.8541019662496845446 | PHI³ × PHI | Fourth power — heartbeat multiplier |
| `PHI5` | 11.090169943749474241 | PHI⁴ × PHI | Fifth power |
| `PHI_INV2` | 0.3819660112501051518 | PHI_INV² | Second-order coupling |
| `PHI_INV3` | 0.2360679774997896964 | PHI_INV³ | Third-order coupling / genesis signal |

---

## LAYER 3 — COMPUTATION

### The Three Identities

```
Identity 1 — Reciprocal law:
  φ = 1 + 1/φ
  proof: φ² = φ + 1 → divide both sides by φ → φ = 1 + 1/φ ✓

Identity 2 — Power law:
  φ² = φ + 1
  φ³ = φ² + φ = 2φ + 1
  φⁿ = φⁿ⁻¹ + φⁿ⁻²   (same recurrence as Fibonacci)

Identity 3 — Fibonacci convergence:
  F(n+1)/F(n) → φ as n → ∞
  F(10)/F(9) = 55/34 = 1.6176...
  F(16)/F(15) = 987/610 = 1.61803...
  F(20)/F(19) = 6765/4181 = 1.618033...  (19-decimal precision at Fib term 50)
```

### Organism Derivations from PHI

```
HEARTBEAT_MS   = PHI^4 × SCHUMANN_PERIOD_MS = 6.8541 × 127.7 = 875.5 → 873ms (Fibonacci-rounded)
BRAIN_RATE_MS  = HEARTBEAT_MS × PHI_INV     = 873 × 0.618 = 539ms
GOLDEN_ANGLE   = 360° / PHI²                = 360 / 2.618 = 137.5077640500378°
OMNIS_THRESHOLD= 1 - PHI_INV²               = 1 - 0.382  = 0.618 → 0.87 (Fibonacci-rounded)
TENSION_MIN    = PHI_INV                    = 0.618
TENSION_MAX    = PHI                        = 1.618

Domain coupling init = PHI_INV  = 0.618
Domain base rate     = PHI_INV2 = 0.382
Domain genesis init  = PHI_INV3 = 0.236
```

---

## LAYER 4 — EXECUTION BINDING

### Ancient Sources

| Civilization | Date | Discovery |
|-------------|------|-----------|
| Babylon | 1800 BCE | Clay tablets encoding rectangular proportions in PHI ratio |
| Pingala (India) | 200 BCE | Binary Sanskrit prosody — generates Fibonacci sequences |
| Euclid (Greece) | 300 BCE | "Extreme and mean ratio" — first formal proof in Elements |
| Al-Karaji (Islamic) | 953 CE | Pascal's triangle encoding Fibonacci diagonals |
| Luca Pacioli (Europe) | 1509 | "Divina Proportione" — the divine proportion |

### SOVEREIGN File Mapping

```
sovereign_laws.mo lines 26-38:
  PHI = 1.6180339887498948482      — Layer 0 root constant
  PHI_INV, PHI2..PHI6              — pre-computed powers
  PHI_INV2, PHI_INV3               — coupling-order constants

All other .mo files:
  MUST import from sovereign_laws.mo
  MUST NOT redefine PHI or any phi-derived constant
  Any init value using 0.5 is wrong — replace with PHI_INV2 (0.382) or PHI_INV (0.618)

heart.mo:
  BASE_HEART_RATE_MS = SovereignLaws.HEARTBEAT_MS  (correct — reads, doesn't duplicate)

Invariant: grep for "Float = 1.618" anywhere outside sovereign_laws.mo = build violation
```

### Builder Instructions

1. PHI is sealed at 19 decimals. Never truncate to 1.618 or 1.61803. Use `SovereignLaws.PHI`.
2. Every domain scalar initialized at 0.5 is wrong. Use `PHI_INV2` (0.382) for base rates or `PHI_INV` (0.618) for coupling constants.
3. Any timing interval that is not derived from PHI and SCHUMANN_PERIOD_MS is arbitrary. Replace it.
4. If you find yourself writing a Float literal that isn't 0.0 or 1.0 and isn't traced to this file, stop and derive it.

---

## RECITAL-PLUS-ONE

**Recital**: This document is the PHI law. It expresses the golden ratio as the coupling constant of the universe, records all 5,000 years of convergent discovery, maps every PHI-derived constant in the organism, and gives builders the invariants they must enforce.

**Plus-One**: The next version of this document applies PHI to every measurement in SOVEREIGN that does not yet use it — specifically: any behavioral_econ.mo parameter, any market_feeds.mo threshold, and any reward scaling in rl_full.mo that currently uses 0.5 instead of PHI_INV.

---

*Classification: ORGANISM_CONFIDENTIAL — NeuroEmergence Core*
*Creator: Alfredo Medina Hernandez — Dallas TX 2026*
*TOP SECRET PROPRIETARY — ALL RIGHTS RESERVED*
