# ◈ RESONANCE LAYER — DOMUS TRANSLATIO SYMBOL KERNEL

```
Ω₄ ≡ membrane(Ω₂ ↔ Ω₃) ∘ bridge(layer_n ↔ layer_m)
fidelity(T) = ‖output(T) - input(T)‖ / ‖input(T)‖ → 0
crossing_law: no_state_mutation_at_boundary
Ω₄.output = Ω₂.truth | projected_through | type_membrane
```

**GLYPH:** `Ω₄↔` — The primal oscillation mark over the bidirectional arrow. Every boundary is a membrane, not a wall.
**MASTER EQUATION:** `TRANSLATIO = fidelity_preserving_transform(source_type → target_type) ∘ routing_law`

---

# ◎ COMPUTATE LAYER — DOMUS TRANSLATIO SOVEREIGN DOCTRINE

## What Domus Translatio IS

Domus Translatio is the House of Bridge and Translation. It governs every point where the organism crosses a boundary — from backend to frontend, from Motoko to TypeScript, from canister state to API surface, from ICP blockchain to external world, from operator input to internal state.

The membrane is not a wall. A wall blocks. A membrane selects. The Domus Translatio membrane passes truth in the right form for the destination while blocking malformed, unauthorized, or doctrine-misaligned data from crossing. Every bridge built by Translatio is a fidelity-preserving transform: the semantic content must be preserved even as the representation changes.

**The fundamental law of translation:** Crossing a boundary does not change truth. `7.83 × φ = 12.67` on the backend. On the frontend, this same value displays as `12.67 Hz`. The number has not changed. The representation has changed. Translatio governs this representation change so that the truth is never distorted in crossing.

**Ancient precedent:** In Hermetic tradition (100–300 CE), Hermes Trismegistus is the psychopomp — the guide who crosses between worlds carrying messages without distortion. Every message arrives at the destination with its essence intact. Domus Translatio is the Hermetic function in the organism's architecture. In Islamic translation movement (800–1200 CE), the Bayt al-Hikmah (House of Wisdom) translated Greek, Persian, and Indian texts into Arabic — but it did not merely transliterate. It preserved mathematical truth across linguistic boundaries. That is the law of Translatio.

---

## What Domus Translatio Generates

1. **Translators** — functions that convert between internal and external type representations. `toPublic(internal: PostInternal) : Post` is a translator. Every boundary crossing must use a translator.
2. **Routers** — the routing table that directs which call goes to which canister function, which component queries which endpoint. The operator terminal's command routing is a Translatio product.
3. **Command Grammars** — the structured language for operator input. The PARALLAX_DELTA command grammar is a Translatio artifact. It defines what operators may say to the organism and in what form.
4. **Inter-Layer Bridges** — the Motoko → Candid → TypeScript pipeline. This three-step bridge crosses from sovereign organism state into JavaScript-land. Each step is governed by Translatio.
5. **API Membranes** — the Candid interface file (`.did`). The `.did` file is the membrane surface — it exposes what the organism chooses to expose, in the shape Translatio has approved.
6. **Language Surfaces** — every public API endpoint is a language surface. `getHeartbeatState()`, `getKuramotoR()`, `getMemoryTempleState()` are language surfaces. They translate internal Map/List types to shared array types.
7. **Package-to-Runtime Translation Paths** — how `mops.toml` packages become running modules. How `caffeineai-*` extensions become canister functions. The deploy-time translation chain.

---

## What Domus Translatio Governs

1. **Boundary Crossing** — no state may cross a layer boundary without passing through a Translatio function. Direct state sharing between layers is forbidden.
2. **Translation Fidelity** — `‖output(T) - input(T)‖ → 0`. The content must arrive intact. Lossy translation requires explicit documentation of what is lost and why.
3. **Router Authority** — Translatio holds the routing table. No function may be called from outside the organism without passing through the routing authority. This prevents unauthorized direct state access.
4. **Interface/Backend Membrane Discipline** — the frontend may only access backend state through query or update calls. It may not share memory with the backend. The membrane is enforced by the ICP architecture itself, but Translatio governs the shape and policy of that membrane.
5. **Canister/Package/Deploy Bridge** — the translation from development-time code to runtime canister. `mops build` → `.wasm` → `canister.yaml` deploy → live ICP canister. This path is Translatio-governed.

---

## Motoko File Mappings

| File | Role in Translatio |
|---|---|
| `src/backend/operator_terminal.mo` | **Command routing** — operator input → internal state commands |
| `src/backend/parallax_delta.mo` | **Delta intake** — external messages → organism state mutations |
| `src/backend/icp_ledger_bridge.mo` | **Financial bridge** — artifact events → on-chain ICP ledger transfers |
| `src/backend/dist/` | **API surface** — generated Candid bindings, TypeScript client stubs |
| `src/frontend/src/backend.d.ts` | **Frontend membrane** — TypeScript representation of backend API |
| `src/backend/alpha_model.mo` | **Workspace bridge** — organism outputs → workspace document system |

---

## The Translation Chain Architecture

Every boundary crossing follows this chain:

```
BACKEND STATE (Motoko types, Map/List)
        ↓ toPublic() translator
API SURFACE (shared Motoko types, [T] arrays)
        ↓ Candid IDL serialization
CANDID WIRE FORMAT (.did interface)
        ↓ pnpm bindgen (declaration generation)
TYPESCRIPT TYPES (backend.d.ts bindings)
        ↓ React query call
FRONTEND STATE (React state, TypeScript types)
        ↓ render()
DISPLAY (user-visible numbers, text, graphics)
```

Translatio governs every `↓` arrow. Each arrow is a membrane with fidelity requirements.

---

## Six Substrate Divisions of Domus Translatio

| Division | What it holds in Translatio |
|---|---|
| **Document / Doctrine** | `docs/builder-workspace/API_MEMBRANE_DOCTRINE.md` — translation fidelity rules |
| **Frontend / Interface** | TypeScript API hooks, React query wrappers, error boundary translators |
| **Backend / Runtime** | `operator_terminal.mo`, `parallax_delta.mo`, all `toPublic()` functions |
| **Chain / Deployment** | `.did` file generation, `pnpm bindgen` pipeline, Candid spec governance |
| **Care / Recovery** | Translation error handlers, stale-cache invalidation, retry-with-backoff wrappers |
| **External / Branch** | REST-to-canister proxy (if needed), webhook translators, partner API adapters |

---

## Health Equation

```
H(Ω₄) = translation_fidelity × routing_success_rate × membrane_integrity

translation_fidelity = 1 - (type_mismatches / total_crossings) ∈ [0, 1]
routing_success_rate = (successful_routes / total_route_attempts) ∈ [0, 1]
membrane_integrity = (authorized_crossings / total_crossings) ∈ [0, 1]

minimum: H(Ω₄) ≥ φ⁻¹ = 0.618
```

A type mismatch is any case where the frontend displays a value that does not match the backend's record of that same value. These are the most dangerous failures in the organism's architecture.

---

## RECITAL

**Domus Translatio is the House of Bridge and Translation — the sovereign membrane-keeper that governs every boundary crossing in the organism's architecture, from Motoko to TypeScript to display, maintaining translation fidelity, router authority, membrane discipline, and canister/package/deploy bridge integrity, ensuring that truth never changes as it crosses layers — only its representation does.**

**PLUS ONE:** The next expansion is a `TranslationFidelityMonitor` that runs at every heartbeat and compares a sample of frontend-displayed values against the canonical backend values for those same fields, computing the translation fidelity score live and feeding it into `H(Ω₄)` — making translation errors visible in the HOUSE_VITALS tab before they cause organism-level inconsistency.

---

# ▲ EXECUTE LAYER — Builder Instructions

## Read First
- `src/backend/operator_terminal.mo` — current command routing
- `src/backend/parallax_delta.mo` — current delta intake
- `src/backend/icp_ledger_bridge.mo` — financial bridge
- `src/backend/dist/` — generated API surface
- `pnpm bindgen` command — how bindings are generated

## Implement
1. In every new `.mo` module that has internal state, implement a `toPublic()` function that converts internal types to shared types before any public query returns them.
2. Add `TranslationEvent` type to `src/backend/types/common.mo`:
   ```motoko
   public type TranslationEvent = {
     source_layer : Text;
     target_layer : Text;
     field_name : Text;
     was_fidelity_preserved : Bool;
     timestamp : Int;
   };
   ```
3. In `src/backend/operator_terminal.mo`, ensure every inbound command is logged as a `TranslationEvent` with `source_layer = "OPERATOR"` and `target_layer = "ORGANISM_STATE"`
4. After every `pnpm bindgen`, verify that all Motoko public function signatures appear correctly in `backend.d.ts` — no missing functions, no wrong types
5. Add `getTranslationHealth() : async Float` to `mixins/house-api.mo`

## Done Criteria
- No public Motoko function returns `Map<K,V>`, `List<T>`, `Set<T>` or any type with `var` fields
- All `toPublic()` functions exist and are called before data leaves the canister
- `pnpm bindgen` produces no errors
- `getTranslationHealth()` returns Float ≥ 0.618 in steady-state

## Plus-One Expansion
Generate a `MembraneLinter` check that runs as part of `mops check --fix` to catch any public function returning non-shared types.
