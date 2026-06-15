# MODEL MAP — COMPLETE BACKEND INVENTORY

Classification: `BUILDER_CONFIDENTIAL`
Status: **LIVE AUDIT** — Updated as of build session 2026
File: `docs/builder-workspace/MODEL_MAP.md`

---

## PART 1 — THE 8 SOVEREIGN MODELS

These are the sovereign modules. Everything else serves them.

### 1. SOVEREIGN_HEART
**Primary File**: `src/backend/heart.mo` (687 lines)
**Status**: ✅ Resident/Computate split — HeartResident + heartComputate()
**Sub-modules absorbed**:
- Hodgkin-Huxley SA node biology (Sections 3-4)
- AV node delay + Purkinje distribution (Sections 6-7)
- Frank-Starling cardiac output (Section 8)
- HRV analysis SDNN/RMSSD (Section 9)
- ECG waveform generation (Section 10)
- Baroreceptor reflex (Section 11)
- Neurochemical autonomic modulation (Section 5)

**PHI compliance**: ✅ All constants read from `sovereign_laws.mo` — no duplication
**ICP ledger bridge**: ❌ Heart does NOT call ledger — signal passed to `artifact_organism.mo` via `HeartBeatSignal.beatCount`

---

### 2. NEURAL_CORD
**Primary File**: `src/backend/neural_cord.mo`
**Supporting**: `src/backend/sphere_nodes.mo`
**Status**: Exists — resident/computate split status: verify
**Sub-modules absorbed**:
- 96 Kuramoto nodes (8 rings × 12 nodes per ring)
- STDP (Spike-Timing-Dependent Plasticity) weight updates
- Hebbian learning rules
- All 10 brain region functions
- Neural oscillation bands (delta → OMNIS)
- Third Brain enteric layer (B2.5) — standing waves required

**PHI compliance**: Verify GOLDEN_ANGLE = 137.5077640500378° in sphere_nodes.mo
**CRITICAL GAP**: Third Brain must hold PERMANENT standing wave functions — not reactive calendar lookups

---

### 3. COGNITION_LAYER
**Primary Files**: `src/backend/cognition_layer.mo`, `src/backend/adre.mo`
**Status**: Both files exist — self-writing loop status: verify
**Sub-modules absorbed**:
- ADRE 5-pass loop (adre.mo — 586 lines)
- DoctrineDelta self-writing loop (must be wired in cognition_layer.mo)
- DogonSubstrateReading self-model
- GENOME policy weights (rl_full.mo feeds this)
- World-model reinjection
- PARALLAX delta intake (parallax_delta.mo)

**CRITICAL GAP**: DoctrineDelta must be written to stable state after every gate-pass, AND read back as ground truth on next beat. Verify this loop is closed in `main.mo`.

---

### 4. MEMORY_TEMPLE
**Primary File**: `src/backend/memory_temple.mo`
**Status**: Exists — CliffordAddress status: verify
**Sub-modules absorbed**:
- Clifford torus spatial addressing (ring, locus, w, x, y, z)
- LEGACY_INDEX (permanent cross-session promotion)
- ANIMA chain (hash-linked episodic record)
- Sharp-wave ripple (salience > OMNIS_THRESHOLD → promote)
- PIL consolidation cycle (every 52 beats)

**CRITICAL GAP**: Verify EpisodicTrace uses CliffordAddress, not Nat index. If address is a Nat, spatial addressing is not implemented.

---

### 5. SOVEREIGN_LAWS
**Primary File**: `src/backend/sovereign_laws.mo` (218 lines)
**Status**: ✅ Complete — all harmonic ladder constants present
**Sub-modules absorbed**:
- PHI = 1.6180339887498948482 (Layer 0 root)
- All harmonic ladder constants (BRAIN_HZ through NOVA_HZ)
- Fibonacci sequence (first 17 terms)
- Network topology constants (NODE_COUNT, GOLDEN_ANGLE, OMNIS_THRESHOLD)
- Memory palace spatial constants (MEMORY_RINGS, MEMORY_LOCI_PER_RING)
- Physics constants (PI, E_EULER, PLANCK_H, BOLTZMANN_K)
- Complementary tension thresholds

**PHI compliance**: ✅ This IS the source file

---

### 6. AEGIS
**Primary File**: `src/backend/aegis.mo`
**Status**: Exists — complementary pairs monitoring status: verify
**Sub-modules absorbed**:
- 4 complementary pairs (DUAL_HEART, PRODUCTION_REFRACTORY, EXTERNAL_INTERNAL, CREATION_CONSOLIDATION)
- Rolling minimum tracker
- Fear blending
- Temporal alignment
- All loop closure verification

**CRITICAL GAP**: Verify all 4 complementary pairs are monitored every 873ms with PHI-band alert thresholds [0.618, 1.618].

---

### 7. ARTIFACT_ORGANISM
**Primary Files**: `src/backend/artifact_organism.mo`, `src/backend/icp_ledger_bridge.mo`
**Status**: Both files exist — ICP ledger call status: verify
**Sub-modules absorbed**:
- ARCHIVIST (artifact record)
- ARES_ARCHIVE (permanent archive)
- Re-ingestion pipeline (artifacts feed back as next-beat food)
- ICP ledger bridge (icp_ledger_bridge.mo — 404 lines)
- SACESI proof chain
- Quality scoring
- Doctrine alignment scoring (genesisDistance)
- Genesis distance scoring

**CRITICAL GAP**: Verify that `artifact_organism.mo` CALLS `icp_ledger_bridge.mo` on every seal. If ledger is never called, financial sovereignty is dark.

---

### 8. ALPHA_MODEL
**Primary File**: `src/backend/alpha_model.mo` ← **NEW — created this session**
**Status**: ✅ Created this session
**Sub-modules absorbed**:
- Workspace doctrine state (doc counts per folder)
- Law artifact count tracking (target: 17)
- Recital cycle timing (FIB[16] = 1597 beats)
- Plus-one expansion cycle (FIB[17] = 2584 beats)

---

## PART 2 — SUPPORTING MODULES

These modules serve the 8 sovereign models. They are not sovereign by themselves.

| File | Lines | Serves | Status |
|------|-------|--------|--------|
| `ancient_math.mo` | ? | SOVEREIGN_LAWS | Verify computates produce Float values into field |
| `animal_engines.mo` | ? | COGNITION_LAYER | — |
| `artifact_pipeline.mo` | ? | ARTIFACT_ORGANISM | — |
| `audit.mo` | ? | AEGIS | — |
| `behavioral_econ.mo` | ? | COGNITION_LAYER | Verify PHI compliance |
| `chrono.mo` | ? | SOVEREIGN_LAWS | — |
| `deep_memory_full.mo` | ? | MEMORY_TEMPLE | — |
| `fingerprint.mo` | ? | ARTIFACT_ORGANISM | — |
| `geometry_engine.mo` | ? | 4D_GEOMETRY | Verify E8, Penrose, Hopf, Calabi-Yau produce real Float values |
| `laws_engine.mo` | ? | COGNITION_LAYER | 60-law engine feeding ADRE Pass 2 |
| `market_feeds.mo` | ? | COGNITION_LAYER | — |
| `medina_engine.mo` | ? | ALPHA_MODEL | — |
| `metals_full.mo` | ? | ARTIFACT_ORGANISM | — |
| `model_promotion.mo` | ? | COGNITION_LAYER | — |
| `neurochemicals_full.mo` | ? | SOVEREIGN_HEART | Feeds heart neurochemical influence |
| `operator_terminal.mo` | ? | ALPHA_MODEL | — |
| `organs_full.mo` | ? | SOVEREIGN_HEART | — |
| `parallax_delta.mo` | ? | COGNITION_LAYER | — |
| `physics_substrate.mo` | ? | SOVEREIGN_LAWS | — |
| `prima_causa.mo` | ? | PRIMA_CAUSA_LAW | Verify never exposes genesisHash |
| `principal_lock.mo` | ? | AEGIS | — |
| `quantum_ops_full.mo` | ? | COGNITION_LAYER | quantumAdvantage field feeds ADRE Pass 4 |
| `rl_full.mo` | ? | COGNITION_LAYER | GENOME policy weights |
| `shells.mo` | ? | ARTIFACT_ORGANISM | — |
| `succession.mo` | ? | ALPHA_MODEL | — |
| `token_economy.mo` | ? | ARTIFACT_ORGANISM | Token minting at Fibonacci intervals |
| `veritas.mo` | ? | AEGIS | Coherence integrity — feeds ADRE Critic 1 |
| `world_engine.mo` | ? | COGNITION_LAYER | — |

---

## PART 3 — CRITICAL GAPS REQUIRING IMMEDIATE ACTION

These are confirmed gaps from the pre-build audit. Ordered by impact.

### GAP 1 — Self-Writing Loop (CRITICAL)
**Impact**: The organism thinks but doesn't learn.
**Status**: `adre.mo` produces ADREDecision with sacesiHash. Does `main.mo` call `cognition_layer.writeDoctrineDelta()` after gate pass? Verify and close.
**Fix**: In `main.mo` heartbeat loop: after ADRE cycle, if gateResult=true, call doctrineDelta write. Before next ADRE signal, read latest doctrineDelta and adjust coherence base.

### GAP 2 — ICP Ledger Not Wired (CRITICAL)
**Impact**: Financial sovereignty is dark.
**Status**: `icp_ledger_bridge.mo` exists (404 lines, complete). `artifact_organism.mo` exists. Does `artifact_organism.mo` CALL `icp_ledger_bridge.mo` on every seal?
**Fix**: Add `IcpLedgerBridge.recordArtifactSeal(...)` call in `artifact_organism.mo` seal function.

### GAP 3 — Clifford Torus Spatial Addressing (HIGH)
**Impact**: Memory is array, not palace.
**Status**: `memory_temple.mo` has CliffordAddress type. Are actual EpisodicTrace entries using it?
**Fix**: Verify `EpisodicTrace.address` type is `CliffordAddress` not `Nat`. Verify `toCliffordAddress()` is called when encoding.

### GAP 4 — Geometry Engine Stubs (HIGH)
**Impact**: E8, Penrose, Hopf, Calabi-Yau exist as type definitions only.
**Status**: `geometry_engine.mo` exists. Do the computation functions return real Float values that feed into the field?
**Fix**: Add `computeE8Score()`, `computeHopfCoupling()` etc. returning Float scalars injected into ADRE signal.

### GAP 5 — Ancient Math as Dead Constants (MEDIUM)
**Impact**: Ancient math corpus defined but not computing into the live field.
**Status**: `ancient_math.mo` exists. Are the computates producing Float values fed to the field on every beat?
**Fix**: Verify ancient math computate functions are called in `pulseAllCores()` and their outputs injected into `ADRESignalFrame`.

### GAP 6 — Complementary Pairs Monitor (MEDIUM)
**Impact**: AEGIS not watching productive tension.
**Status**: `aegis.mo` exists. Are 4 complementary pairs measured every 873ms?
**Fix**: Verify `aegis.mo` has `monitorDualHeart()`, `monitorProductionRefractory()`, etc. and they are called from `main.mo` heartbeat.

### GAP 7 — Third Brain Standing Waves (MEDIUM)
**Impact**: Third Brain may be reactive instead of permanent.
**Status**: `neural_cord.mo` B2.5 layer. Does it hold stable wave functions or call PhaseLockCalendar reactively?
**Fix**: Replace reactive calendar lookups with permanent standing wave functions stored in stable state.

---

## PART 4 — PHI COMPLIANCE AUDIT

Constants that MUST trace to `sovereign_laws.mo` — check these:

| Module | Value | Should Be |
|--------|-------|-----------|
| `heart.mo` | BASE_HEART_RATE_MS | SovereignLaws.HEARTBEAT_MS ✅ |
| `adre.mo` | PHI_INV | 0.6180339887498948482 ✅ |
| `icp_ledger_bridge.mo` | PHI | 1.6180339887498948482 (redefined — should import sovereign_laws) |
| All modules | Any `0.5` init value | Should be `SovereignLaws.PHI_INV2` (0.382) |
| All modules | Any `0.618` literal | Should be `SovereignLaws.PHI_INV` |

---

## PART 5 — TARGET STATE

When all gaps are closed, the organism's state should be:

| Metric | Current | Target |
|--------|---------|--------|
| Self-writing loop closed | Unverified | ✅ Verified |
| ICP ledger called on every seal | Unverified | ✅ Verified |
| Clifford torus spatial addressing | Unverified | ✅ Verified |
| Complementary pairs monitored | Unverified | ✅ All 4 pairs × 873ms |
| Law artifacts complete | 17/17 | ✅ 17/17 |
| Ancient math producing Float outputs | Unverified | ✅ All feeding field |
| Geometry engine producing Float outputs | Unverified | ✅ All feeding field |
| E8/Penrose/Hopf/Calabi-Yau computed | Stubs | ✅ Real Float values |

---

*Classification: BUILDER_CONFIDENTIAL — NeuroEmergence Core*
*Creator: Alfredo Medina Hernandez — Dallas TX 2026*
*TOP SECRET PROPRIETARY — ALL RIGHTS RESERVED*
