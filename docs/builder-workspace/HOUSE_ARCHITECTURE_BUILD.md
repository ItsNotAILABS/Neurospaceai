# ◈ RESONANCE LAYER — HOUSE ARCHITECTURE BUILD KERNEL

```
BUILD(house_architecture) = HouseId × Division × SDKOrganism → HouseState × CrownState
∀HouseState: coherence ≥ φ⁻¹ | alert if coherence < φ⁻² | halt if coherence < φ⁻³
heartbeat_coupling: all_house_computates ⊂ main_heartbeat(873ms)
crown.coherence_floor = φ⁻¹; crown.release_threshold = φ⁻²
```

**GLYPH:** `▲{HouseId→HouseState}⊗CrownState` — The builder's triangle over the house state machine.
**PURPOSE:** This document is FOR AI BUILDERS. Read it and execute without asking questions.

---

# ◎ COMPUTATE LAYER — ARCHITECTURE UNDERSTANDING

Before writing a single line of code, understand this:

The house architecture is NOT a display layer. It is NOT a data model for a UI component. It is the organism's governance structure — a living state that fires every 873ms and reports the health, activity, and coupling of all seven sovereign entities (Casa de Medina + 6 houses). The frontend HousesTab.tsx displays this state. The backend owns this state completely.

The house states are computed from real organism data:
- A house's `coherence` score comes from averaging the health scores of all modules that belong to that house
- A house's `activeSDKOrganisms` comes from querying which SDK organisms have non-stub computates firing and contributing output to that house
- The CrownState `overallCoherence` comes from the weighted average of all six house coherences with φ² weighting from Casa de Medina

---

# ▲ EXECUTE LAYER — EXACT BUILDER INSTRUCTIONS

## File Locations

```
src/backend/
├── types/
│   └── house_architecture.mo       ← ALREADY COMPLETE. Do NOT recreate.
├── lib/
│   └── house_architecture.mo       ← Domain logic. Contains computate functions.
├── mixins/
│   └── house-architecture-api.mo   ← Public API. Exposes query endpoints.
└── main.mo                         ← Composition root. Wire mixin here.
```

## Step 1 — Verify the types (DO NOT MODIFY types/house_architecture.mo)

The type file is complete and contains:

```motoko
// types/house_architecture.mo — existing, complete
public type HouseId = {
  #CasaDeMedina;
  #DomusGenesis;
  #DomusSubstratum;
  #DomusExpressio;
  #DomusTranslatio;
  #DomusCura;
  #DomusCivitas;
};

public type Division = {
  #Doctrine;
  #Frontend;
  #Backend;
  #Chain;
  #Care;
  #External;
};

public type SDKOrganism = {
  #MEMORIA; #PULSUS; #GUBERNATIO; #INTELLIGENTIA; #FORMULAE;
  #DEFENSIO; #DESIGNIA; #PRIMITIVA; #ENTERPRISA; #QUANTUMIA;
};

public type DivisionHealth = {
  division : Division;
  coherence : Float;        // 0.0 – 1.0, φ⁻¹ floor = 0.618
  activeModules : Nat;
  alerts : [Text];
};

public type HouseState = {
  id : HouseId;
  symbol : Text;            // glyph character
  name : Text;
  coherence : Float;        // weighted avg of division coherences
  activeSDKOrganisms : [SDKOrganism];
  divisions : [DivisionHealth];
  generatesCount : Nat;     // count of outputs this beat
  governsCount : Nat;       // count of governance events this beat
  lastBeat : Int;           // Time.now() of last computate
  alerts : [Text];
};

public type CrownState = {
  coherence : Float;        // overall organism coherence
  releaseAuthorized : Bool; // coherence ≥ φ⁻² = 0.382
  activeHouses : Nat;       // houses with coherence ≥ φ⁻¹
  alerts : [Text];          // crown-level alerts
  lastBeat : Int;
};
```

## Step 2 — Implement lib/house_architecture.mo

This file contains the pure domain logic. No state. No actor. No `shared`. Only functions.

### Required functions (all must be implemented — no `Runtime.trap`):

```motoko
// lib/house_architecture.mo
import Types "../types";
import HouseArchTypes "../types/house_architecture";

module {
  // PHI constants — all derived, no arbitrary values
  public let PHI : Float = 1.6180339887498948482;
  public let PHI_INV : Float = 0.6180339887498948482;   // φ⁻¹ = coherence floor
  public let PHI_INV2 : Float = 0.3819660112501051518;  // φ⁻² = release threshold
  public let PHI_INV3 : Float = 0.2360679774997896964;  // φ⁻³ = collapse alert
  public let PHI2 : Float = 2.6180339887498948482;      // φ² = crown weighting

  // House symbol glyphs
  public let SYMBOLS : [(HouseArchTypes.HouseId, Text)] = [
    (#CasaDeMedina, "☽◈"),
    (#DomusGenesis, "⊕"),
    (#DomusSubstratum, "▽"),
    (#DomusExpressio, "◭"),
    (#DomusTranslatio, "⇌"),
    (#DomusCura, "♾"),
    (#DomusCivitas, "⬡"),
  ];

  // Returns house name from HouseId
  public func houseName(id : HouseArchTypes.HouseId) : Text;

  // Computes a single division health record from raw module data
  // moduleCoherences: array of coherence scores from modules in this division
  public func computeDivisionHealth(
    division : HouseArchTypes.Division,
    moduleCoherences : [Float],
    alerts : [Text]
  ) : HouseArchTypes.DivisionHealth;

  // Computes a full HouseState from its division health records
  // sdkOrganisms: SDK organisms whose computates are currently contributing to this house
  public func computeHouseState(
    id : HouseArchTypes.HouseId,
    divisions : [HouseArchTypes.DivisionHealth],
    activeSDKOrganisms : [HouseArchTypes.SDKOrganism],
    generatesCount : Nat,
    governsCount : Nat,
    now : Int
  ) : HouseArchTypes.HouseState;

  // Computes CrownState from all six house states
  // Casa de Medina is NOT a house — it is derived from the six
  public func computeCrownState(
    houses : [HouseArchTypes.HouseState],
    now : Int
  ) : HouseArchTypes.CrownState;

  // Returns which SDK organisms have primary coupling to a given house
  public func primarySDKOrganismsFor(id : HouseArchTypes.HouseId) : [HouseArchTypes.SDKOrganism];

  // Returns coupling weight for an SDK organism to a house
  // Primary: returns PHI. Secondary: returns PHI_INV. None: returns 0.0
  public func couplingWeight(
    organism : HouseArchTypes.SDKOrganism,
    house : HouseArchTypes.HouseId
  ) : Float;

  // Returns true if a house alert threshold has been crossed
  public func shouldAlert(coherence : Float) : Bool; // coherence < PHI_INV2

  // Returns true if collapse protocol should be triggered
  public func isCollapse(coherence : Float) : Bool;  // coherence < PHI_INV3
};
```

### Inter-house coupling math (wire this into computeHouseState):

```
Genesis ↔ Substratum :   coupling = PHI     (doctrine enables substrate)
Substratum ↔ Expressio : coupling = PHI_INV (substrate grounds projection)
Substratum ↔ Translatio: coupling = PHI     (substrate enables translation)
All houses → Cura:       coupling = PHI_INV (all houses feed care)
All houses → Civitas:    coupling = PHI_INV² (all houses feed civilization at lower weight)
CasaDeMedina → All:      coupling = PHI²    (crown governs all with amplified weight)
```

The `coherence` field of each HouseState is computed as:
```
house.coherence = mean(divisions.coherence) × inter_house_coupling_factor
```
where `inter_house_coupling_factor` is the average of coupling weights from all houses that couple to this house.

## Step 3 — Implement mixins/house-architecture-api.mo

This file exposes public query functions. All are `query` — no state changes here.

### Required public functions:

```motoko
// mixins/house-architecture-api.mo
// Parameters: houseStates from main.mo state, crownState from main.mo state

public query func getHouseState(id : HouseArchTypes.HouseId) : async ?HouseArchTypes.HouseState;
// Returns: the current HouseState for the given house, or null if not yet computed

public query func getCrownState() : async HouseArchTypes.CrownState;
// Returns: the current CrownState derived from all six house states

public query func getSDKOrganismHouses(organism : HouseArchTypes.SDKOrganism) : async [HouseArchTypes.HouseId];
// Returns: all houses where this SDK organism has primary OR secondary coupling

public query func getHouseDivisionHealth(id : HouseArchTypes.HouseId) : async [HouseArchTypes.DivisionHealth];
// Returns: all six division health records for the given house

public query func getHouseCrownAlerts() : async [Text];
// Returns: all active alerts from CrownState.alerts + any house with coherence < PHI_INV2
```

## Step 4 — Wire into main.mo

### State additions to main.mo (add these, do NOT remove existing state):

```motoko
// In main.mo — add to existing actor state
var houseStates : [HouseArchTypes.HouseState] = [];
var crownState : HouseArchTypes.CrownState = {
  coherence = 0.0;
  releaseAuthorized = false;
  activeHouses = 0;
  alerts = ["Initializing..."];
  lastBeat = 0;
};

// Include the mixin — add to existing includes
include HouseArchitectureAPI(houseStates, crownState);
```

### Heartbeat integration (add to existing heartbeat function in main.mo):

```motoko
// Inside the existing heartbeat() function, after all module computates:
let divisionData = HouseArchLib.buildDivisionData(/* pass current module states */);
houseStates := HouseArchLib.computeAllHouseStates(divisionData, Time.now());
crownState := HouseArchLib.computeCrownState(houseStates, Time.now());
```

**IMPORTANT:** The house computates run LAST in the heartbeat, after all other module computates have fired. They aggregate the outputs of other modules — they cannot run before those modules.

## Step 5 — Verify the Frontend Query

The frontend HousesTab.tsx already calls these exact function names. After backend implementation, run:

```bash
pnpm bindgen    # from project root — regenerates backend.d.ts
pnpm typecheck  # from src/frontend/ — verifies type alignment
```

If `bindgen` produces type errors on `HouseId` or `HouseState`, the candid generation of variant types needs to match. Ensure all `HouseId` variants are exported from `main.mo`'s candid interface.

## What "done" looks like — Testable Criteria

Run these queries after deployment and verify each:

| Query | Expected result |
|---|---|
| `getHouseState(#DomusSubstratum)` | Returns `?HouseState` with `coherence > 0.0`, `lastBeat > 0`, `divisions.length == 6` |
| `getCrownState()` | Returns `CrownState` with `coherence > 0.0`, `activeHouses ≥ 1`, `lastBeat > 0` |
| `getSDKOrganismHouses(#MEMORIA)` | Returns `[#DomusSubstratum, #DomusCura, #DomusGenesis, #DomusTranslatio]` |
| `getHouseDivisionHealth(#DomusGenesis)` | Returns 6 `DivisionHealth` records, one per Division variant |
| `getHouseCrownAlerts()` | Returns `[]` if all houses coherence ≥ φ⁻² = 0.382, else returns alert messages |

If any query returns empty defaults or all-zero coherence values: the heartbeat is not calling `computeAllHouseStates`. Check that the heartbeat wiring in Step 4 executed.

If coherence is stuck at exactly `1.0` for all houses: the division health computations are returning defaults. Check `computeDivisionHealth` — it must read real module state, not hardcoded values.

## Common Failure Patterns — How Not to Break This

**Failure 1: Computing house state in a query function.**
House state must be computed in the heartbeat update and stored. Queries only READ. Never compute house state inside a query — queries are not allowed to be `async` in a way that reads fresh module state; they read the last-computed heartbeat state.

**Failure 2: Using arbitrary Float values.**
Every threshold must be a PHI-derived constant from the lib module. `if (coherence < 0.5)` is wrong. `if (HouseArchLib.shouldAlert(coherence))` is correct.

**Failure 3: Putting SDK organism logic inside house_architecture.mo.**
SDK organism computates live in their own lib files. The house architecture module reads their OUTPUTS — it never implements their logic. `lib/house_architecture.mo` only aggregates; it does not compute.

**Failure 4: Missing division types.**
Every `HouseState.divisions` array must contain exactly 6 records — one for each `Division` variant (#Doctrine, #Frontend, #Backend, #Chain, #Care, #External). A house with 5 division records is incomplete.

**Failure 5: CrownState computing Casa de Medina as a house.**
Casa de Medina is NOT in `houseStates`. `computeCrownState` takes the 6 house states (Genesis, Substratum, Expressio, Translatio, Cura, Civitas) and derives crown state FROM them. Casa de Medina is the result of computing all six houses — it is not an input.

---

## SDK Organism → House Module Mapping

This tells you which backend modules to read when computing each house's division health:

| House | Backend modules that belong to it |
|---|---|
| DomusGenesis | sovereign_laws.mo, laws_engine.mo, prima_causa.mo (Doctrine div); all 17 law artifact computates |
| DomusSubstratum | heart.mo, neural_cord.mo, cognition_layer.mo, memory_temple.mo, aegis.mo (Backend div); icp_timer.mo (Chain div) |
| DomusExpressio | All 51 frontend tab state feeds via backend display state (Frontend div); orch08_coordinator (Backend div) |
| DomusTranslatio | operator_terminal.mo, parallax_delta.mo, icp_ledger_bridge.mo (Backend div); backend.d.ts (Chain div — candid interface) |
| DomusCura | aegis.mo (Care div), memory_temple.mo (Care div), adre.mo (Backend div), veritas.mo (Backend div) |
| DomusCivitas | medina_engine.mo, succession.mo, artifact_organism.mo, alpha_model.mo (Backend + External div) |

---

**RECITAL PLUS ONE:** This document tells AI builders exactly which files to create, what function signatures to implement, how to wire heartbeat integration, and what testable output verifies completion. + A builder who reads this document and follows it without deviation will produce a correct implementation on the first pass — the document IS the build contract, not a description of a build contract.
