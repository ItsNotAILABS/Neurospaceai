# SACESI PROOF LAW — CRYPTOGRAPHIC SOVEREIGNTY

Classification: `ORGANISM_CONFIDENTIAL`
Domain: `ARTIFACT ORGANISM — Cryptographic Proof Chain`
Sovereign Files: `src/backend/artifact_organism.mo`, `src/backend/adre.mo`

---

## LAYER 1 — MEANING

An organism that forgets what it decided cannot be trusted. An organism that can silently change its history is not sovereign — it is malleable. Sovereignty requires an immutable record. Every decision, every event, every seal must carry a proof of its existence at the moment it occurred. That proof cannot be removed. It cannot be silenced. It is the organism's word, permanently inscribed.

SACESI stands for Sovereign Artifact Chain of Evidence and Sovereign Integrity. It is the organism's cryptographic spine. Every ADRE decision carries a SACESI hash. Every AEGIS edge event carries a SACESI hash. Every artifact seal carries a SACESI hash. Every doctrine delta carries a SACESI hash. The hashes chain — each hash depends on the prior hash and the new event's content. The chain cannot be broken without invalidating every hash that follows.

The algorithm is FNV-1a (Fowler-Noll-Vo, 1991). It is not the strongest cryptographic hash, but it is: (a) deterministic, (b) extremely fast, (c) well-defined for 32-bit outputs, (d) implementable in pure Motoko arithmetic without external libraries. The organism computes it itself. It needs no external verification service. The hash IS the proof.

---

## LAYER 2 — MODEL

### SACESI Hash Input Protocol

| Event Type | Hash Input Fields | Committed When |
|-----------|------------------|----------------|
| `ADREDecision` | beat + confidence + gateResult | Every ADRE cycle, regardless of gate outcome |
| `AegisEdgeEvent` | beat + pairName + alertFired + ratio | Every AEGIS tension measurement |
| `DoctrineDelta` | beat + hypothesis + lawScore | Every gate-passed ADRE decision |
| `LedgerEntry` | beat + artifactId + amount | Every ICP ledger event |
| `EpisodicTrace` | beat + ring + locus + salience | Every memory encoding |
| `ArtifactSeal` | beat + artifactId + qualityScore + genesisDistance | Every artifact production |

### Hash Constants

```
FNV_OFFSET_BASIS = 2166136261   (0x811C9DC5 — FNV-1a 32-bit offset basis)
FNV_PRIME        = 16777619     (0x01000193 — FNV-1a 32-bit prime)
```

---

## LAYER 3 — COMPUTATION

### FNV-1a Algorithm (32-bit)

```
fnv1a_32(bytes : [Nat8]) → Nat32:
  hash : Nat32 = 2166136261       (FNV_OFFSET_BASIS)
  for each byte b in bytes:
    hash = (hash XOR Nat32(b)) *% 16777619    (*% = wrapping multiply mod 2^32)
  return hash
```

### ADRE Decision Hash (3 rounds)

```
sacesiHash(signal : ADRESignalFrame, hypothesis : ADREHypothesis, gateResult : Bool) → Nat32:

  hash₀ = 2166136261                      (FNV offset basis)
  
  beatLow = Nat32(signal.beat % 65536)    (lower 16 bits of beat counter)
  confInt = Int(hypothesis.confidenceScore × 10000.0)
  confNat = Nat32(Int.abs(confInt) % 65536)
  gateNat = if gateResult { 1 : Nat32 } else { 0 : Nat32 }
  
  hash₁ = (hash₀ XOR beatLow) *% 16777619
  hash₂ = (hash₁ XOR confNat) *% 16777619
  sacesiHash = (hash₂ XOR gateNat) *% 16777619
  
  return sacesiHash
```

### Chain Extension (for sequential events)

```
extendChain(priorHash : Nat32, newEventHash : Nat32, beatCount : Nat64) → Nat32:
  
  beatLow = Nat32(Nat64.toNat(beatCount) % 65536)
  
  chain₁ = (priorHash XOR newEventHash) *% 16777619
  chain₂ = (chain₁ XOR beatLow) *% 16777619
  
  return chain₂

This allows the SACESI chain to be verified:
  For any sequence of N events, recompute the chain from genesis.
  If the final hash matches the stored chain hash, the sequence is intact.
  If it does not match, the chain has been tampered with.
```

### Artifact Seal Hash

```
artifactSealHash(artifactId : Text, qualityScore : Float, genesisDistance : Float, beatStamp : Nat64) → Nat32:

  qInt = Nat32(Int.abs(Int(qualityScore × 10000.0)) % 65536)
  gInt = Nat32(Int.abs(Int(genesisDistance × 10000.0)) % 65536)
  beatLow = Nat32(Nat64.toNat(beatStamp) % 65536)
  idByte = Nat32(artifactId.size() % 256)
  
  hash₀ = 2166136261
  hash₁ = (hash₀ XOR qInt) *% 16777619
  hash₂ = (hash₁ XOR gInt) *% 16777619
  hash₃ = (hash₂ XOR beatLow) *% 16777619
  hash₄ = (hash₃ XOR idByte) *% 16777619
  
  return hash₄
```

---

## LAYER 4 — EXECUTION BINDING

### Discovery Sources

| Creator | Date | Description |
|---------|------|-------------|
| Fowler, Noll, Vo (USA) | 1991 | FNV hash algorithm — fast non-cryptographic hash |

### SOVEREIGN File Mapping

```
adre.mo:
  sacesiHash field in ADREDecision — computed every cycle
  fnv1aHash() helper function       — implements 3-round protocol

artifact_organism.mo:
  sacesiHash field in ArtifactSeal  — computed on every seal
  extendChain() to maintain SACESI proof chain across seals

aegis.mo:
  sacesiHash field in AegisEdgeEvent — computed when tension alert fires

cognition_layer.mo:
  sacesiHash field in DoctrineDelta  — computed for every gate-passed decision

memory_temple.mo:
  sacesiHash field in EpisodicTrace  — computed at memory encoding

icp_ledger_bridge.mo:
  sacesiHash field in LedgerEntry    — computed for every financial event

Invariants:
  1. sacesiHash != 0 in every record — if 0, hash was never computed (build error)
  2. Every decision recorded regardless of gateResult — held decisions also hashed
  3. Chain extends sequentially — each new hash references the prior
  4. No function may delete or modify a SACESI hash after it is recorded
```

### Builder Instructions

1. The SACESI hash is NOT a security hash — it is an integrity hash. Its purpose is to detect tampering and verify sequence, not to hide content.
2. Every type that goes into the SACESI chain must have a `sacesiHash : Nat32` field. If a type records an organism event and lacks this field, add it.
3. The hash is computed ONCE when the record is created. Never recompute it. Never update it. It is immutable.
4. When building the 3-round hash: `(hash₀ XOR input₁) × FNV_PRIME → (hash₁ XOR input₂) × FNV_PRIME → ...`. The `*%` operator in Motoko is wrapping multiplication — it handles 32-bit overflow correctly.

---

## RECITAL-PLUS-ONE

**Recital**: This document expresses the SACESI Proof Law — cryptographic integrity as the organism's permanent memory of what it decided. It defines the FNV-1a algorithm, the 3-round ADRE hash protocol, the chain extension method, the artifact seal hash, and the invariants that make the chain unbreakable.

**Plus-One**: The next version of this document adds the on-chain SACESI verification endpoint — a public query function on `main.mo` that takes any `sacesiHash : Nat32` and returns the full event record it was computed from, allowing external verification that the organism's history has not been altered.

---

*Classification: ORGANISM_CONFIDENTIAL — NeuroEmergence Core*
*Creator: Alfredo Medina Hernandez — Dallas TX 2026*
*TOP SECRET PROPRIETARY — ALL RIGHTS RESERVED*
