// ============================================================
// HOUSE ARCHITECTURE — house_architecture.mo
// NeuroEmergence Core — Enterprise Civilization Layer
// Creator: Alfredo Medina Hernandez | Dallas, TX 2026
// TOP SECRET PROPRIETARY — All rights reserved.
//
// CASA DE MEDINA governs a six-house sovereign intelligence
// civilization. Every house generates AND governs what it creates.
//
// The architecture:
//   Crown:        Casa de Medina (authorship, naming, release, law)
//   House 1:      Domus Genesis  (doctrine, equations, laws)
//   House 2:      Domus Substratum (runtime, heartbeat, vault)
//   House 3:      Domus Expressio  (frontend organisms, projection)
//   House 4:      Domus Translatio (bridges, APIs, routers)
//   House 5:      Domus Cura       (care, stewardship, recovery)
//   House 6:      Domus Civitas    (enterprise, civilization)
//
// Every house has 6 substrate divisions:
//   Doctrine | Frontend | Backend | Chain | Care | External
//
// High-Council SDK organisms live across houses:
//   MEMORIA, PULSUS, GUBERNATIO, INTELLIGENTIA, FORMULAE,
//   DEFENSIO, DESIGNIA, PRIMITIVA, ENTERPRISA, QUANTUMIA
//
// All constants from sovereign_laws.mo — no raw numbers.
// Healthy range: [PHI_INV, PHI] = [0.618, 1.618]
// Heartbeat coupling: 873ms (PHI^4 × Schumann period)
// ============================================================

import Float "mo:core/Float";
import Array "mo:core/Array";

module {

  // ============================================================
  // SECTION 0 — DOCTRINE CONSTANTS (from sovereign_laws.mo)
  // ============================================================

  /// PHI — root constant, 19 decimals, never truncated
  let PHI     : Float = 1.6180339887498948482;
  /// PHI_INV — phi reciprocal, coupling constant
  let PHI_INV : Float = 0.6180339887498948482;
  /// PHI_INV2 — second-order coupling
  let PHI_INV2: Float = 0.3819660112501051518;
  /// PHI2 — PHI squared
  let PHI2    : Float = 2.6180339887498948482;
  /// Crown coupling: PHI^2 = 2.6180339887498948482 — crown authority weight over all houses
  let CROWN_COUPLING  : Float = 2.6180339887498948482;
  /// Genesis coupling: PHI = 1.6180339887498948482 — truth-execution bond (strongest house pair)
  let GENESIS_COUPLING: Float = 1.6180339887498948482;
  /// Standard coupling: PHI_INV = 0.6180339887498948482 — projection from truth
  let STD_COUPLING    : Float = 0.6180339887498948482;
  /// Enterprise coupling: PHI_INV^2 = 0.3819660112501051518 — second-order downstream
  let CIVITAS_COUPLING: Float = 0.3819660112501051518;
  /// OMNIS coherence boost per event: PHI_INV × 0.1 = 0.06180339887498948482
  let OMNIS_BOOST     : Float = 0.06180339887498948482;
  /// Healthy coherence floor (minimum before AEGIS alert)
  let COHERENCE_FLOOR : Float = 0.6180339887498948482;  // PHI_INV
  /// Release quality floor
  let RELEASE_FLOOR   : Float = 0.3819660112501051518;  // PHI_INV2
  /// Maximum drift before crown alert: 1.0 - PHI_INV = 0.3819660112501051518
  let DRIFT_CEILING   : Float = 0.3819660112501051518;  // 1.0 - PHI_INV

  // ============================================================
  // SECTION 1 — TYPE DEFINITIONS
  // ============================================================

  /// Substrate division within each house
  public type Division = {
    #Doctrine;
    #Frontend;
    #Backend;
    #Chain;
    #Care;
    #External;
  };

  /// Canonical house identity
  public type HouseId = {
    #CasaDeMedina;   // Crown — governs all
    #DomusGenesis;
    #DomusSubstratum;
    #DomusExpressio;
    #DomusTranslatio;
    #DomusCura;
    #DomusCivitas;
  };

  /// High-Council SDK organisms — live across houses
  public type SDKOrganism = {
    #MEMORIA;
    #PULSUS;
    #GUBERNATIO;
    #INTELLIGENTIA;
    #FORMULAE;
    #DEFENSIO;
    #DESIGNIA;
    #PRIMITIVA;
    #ENTERPRISA;
    #QUANTUMIA;
  };

  /// Live state of one sovereign house
  public type HouseState = {
    id             : HouseId;
    name           : Text;          // canonical Latin name
    symbol         : Text;          // compressed glyph symbol
    coherence      : Float;         // Kuramoto-coupled, [0.0, 1.0]
    liveness       : Float;         // heartbeat coupling health
    generationRate : Float;         // artifacts produced per PHI cycle
    governanceScore: Float;         // doctrine alignment [0.0, 1.0]
    divisionHealth : [(Division, Float)];  // per-division health [0,1]
    sdkOrganisms   : [SDKOrganism]; // SDK organisms inhabiting this house
    beatCount      : Nat;           // last heartbeat that updated this house
  };

  /// Full crown state — Casa de Medina + all six houses
  public type CrownState = {
    casaDeMedina  : HouseState;
    houses        : [HouseState];
    interHouseLaw : [(HouseId, HouseId, Float)]; // (from, to, coupling strength)
    crownStandards: {
      minimumCoherence: Float;  // PHI_INV = 0.618
      maximumDrift    : Float;  // 1.0 - PHI_INV = 0.382
      releaseThreshold: Float;  // PHI_INV^2 = 0.382 quality floor
    };
    beatCount     : Nat;
  };

  /// Crown alert — fired when a house coherence < PHI_INV
  public type CrownAlert = {
    houseId   : HouseId;
    houseName : Text;
    coherence : Float;
    threshold : Float;
    beat      : Nat;
    severity  : { #Warning; #Critical };
  };

  /// Heartbeat signal passed from main.mo into computate
  public type HouseHeartbeatSignal = {
    beat          : Nat;
    kuramotoR     : Float;    // Kuramoto order parameter R
    omnisActive   : Bool;     // OMNIS gate state
    coherenceC    : Float;    // global field coherence
    worldModelAvg : Float;    // world model coherence average
    emergenceScore: Float;    // organism emergence level
  };

  // ============================================================
  // SECTION 2 — RESIDENT (stable, persists across upgrades)
  // ============================================================

  /// All persistent house civilization state lives here.
  /// main.mo holds exactly one HouseArchitectureResident var.
  public type HouseArchitectureResident = {
    crown        : CrownState;
    alerts       : [CrownAlert];  // ring buffer of last 21 (FIB[8]) alerts
    alertHead    : Nat;
    totalAlerts  : Nat;
    lastBeat     : Nat;
    initialized  : Bool;
  };

  // ============================================================
  // SECTION 3 — INITIALIZATION
  // ============================================================

  func allDivisions(base : Float) : [(Division, Float)] {
    [
      (#Doctrine, base),
      (#Frontend, base),
      (#Backend,  base),
      (#Chain,    base),
      (#Care,     base),
      (#External, base),
    ]
  };

  func initHouse(
    id     : HouseId,
    name   : Text,
    symbol : Text,
    sdks   : [SDKOrganism]
  ) : HouseState {
    {
      id             = id;
      name           = name;
      symbol         = symbol;
      coherence      = PHI_INV;
      liveness       = PHI_INV;
      generationRate = PHI_INV2;
      governanceScore= PHI_INV;
      divisionHealth = allDivisions(PHI_INV);
      sdkOrganisms   = sdks;
      beatCount      = 0;
    }
  };

  /// The immutable inter-house coupling law table.
  /// All strengths PHI-derived. Casa de Medina → All = PHI2 (crown authority).
  let INTER_HOUSE_LAW : [(HouseId, HouseId, Float)] = [
    // Crown → all houses (crown authority)
    (#CasaDeMedina, #DomusGenesis,     CROWN_COUPLING),
    (#CasaDeMedina, #DomusSubstratum,  CROWN_COUPLING),
    (#CasaDeMedina, #DomusExpressio,   CROWN_COUPLING),
    (#CasaDeMedina, #DomusTranslatio,  CROWN_COUPLING),
    (#CasaDeMedina, #DomusCura,        CROWN_COUPLING),
    (#CasaDeMedina, #DomusCivitas,     CROWN_COUPLING),
    // Genesis ↔ Substratum: PHI — truth-execution bond (strongest)
    (#DomusGenesis,    #DomusSubstratum, GENESIS_COUPLING),
    (#DomusSubstratum, #DomusGenesis,    GENESIS_COUPLING),
    // Substratum ↔ Expressio: PHI_INV — projection from truth
    (#DomusSubstratum, #DomusExpressio,  STD_COUPLING),
    (#DomusExpressio,  #DomusSubstratum, STD_COUPLING),
    // Substratum ↔ Translatio: PHI — direct bridge
    (#DomusSubstratum, #DomusTranslatio, GENESIS_COUPLING),
    (#DomusTranslatio, #DomusSubstratum, GENESIS_COUPLING),
    // All → Cura: PHI_INV — care from all houses
    (#DomusGenesis,    #DomusCura, STD_COUPLING),
    (#DomusSubstratum, #DomusCura, STD_COUPLING),
    (#DomusExpressio,  #DomusCura, STD_COUPLING),
    (#DomusTranslatio, #DomusCura, STD_COUPLING),
    // All → Civitas: PHI_INV^2 — enterprise from all
    (#DomusGenesis,    #DomusCivitas, CIVITAS_COUPLING),
    (#DomusSubstratum, #DomusCivitas, CIVITAS_COUPLING),
    (#DomusExpressio,  #DomusCivitas, CIVITAS_COUPLING),
    (#DomusTranslatio, #DomusCivitas, CIVITAS_COUPLING),
    (#DomusCura,       #DomusCivitas, CIVITAS_COUPLING),
  ];

  /// Build initial HouseArchitectureResident — call once at actor init.
  public func emptyResident() : HouseArchitectureResident {
    let casaMedina : HouseState = initHouse(
      #CasaDeMedina,
      "Casa de Medina",
      "\u{2620}\u{FE0F}", // crown symbol
      [#GUBERNATIO, #DEFENSIO]
    );

    let initHouses : [HouseState] = [
      initHouse(#DomusGenesis,    "Domus Genesis",    "\u{1D6F7}",   [#MEMORIA, #GUBERNATIO, #FORMULAE, #PRIMITIVA]),
      initHouse(#DomusSubstratum, "Domus Substratum", "\u{1D6F4}",   [#MEMORIA, #PULSUS, #FORMULAE, #DEFENSIO, #QUANTUMIA]),
      initHouse(#DomusExpressio,  "Domus Expressio",  "\u{1F441}",   [#DESIGNIA, #QUANTUMIA]),
      initHouse(#DomusTranslatio, "Domus Translatio", "\u{1F310}",   [#INTELLIGENTIA]),
      initHouse(#DomusCura,       "Domus Cura",       "\u{2764}",    [#MEMORIA, #PULSUS, #QUANTUMIA]),
      initHouse(#DomusCivitas,    "Domus Civitas",    "\u{1F3DB}",   [#ENTERPRISA, #GUBERNATIO, #PRIMITIVA]),
    ];

    let initCrown : CrownState = {
      casaDeMedina  = casaMedina;
      houses        = initHouses;
      interHouseLaw = INTER_HOUSE_LAW;
      crownStandards = {
        minimumCoherence = COHERENCE_FLOOR;
        maximumDrift     = DRIFT_CEILING;
        releaseThreshold = RELEASE_FLOOR;
      };
      beatCount = 0;
    };

    {
      crown       = initCrown;
      alerts      = Array.repeat<CrownAlert>(
        { houseId=#CasaDeMedina; houseName=""; coherence=0.0; threshold=0.0; beat=0; severity=#Warning },
        21
      );
      alertHead   = 0;
      totalAlerts = 0;
      lastBeat    = 0;
      initialized = true;
    }
  };

  // ============================================================
  // SECTION 4 — HELPER: advance one house per beat
  // ============================================================

  /// Compute inter-house inflow for a given house.
  /// Sums coupling strengths from all connected houses into this one.
  func interHouseInflow(
    targetId : HouseId,
    houses   : [HouseState],
    crown    : HouseState
  ) : Float {
    var inflow : Float = 0.0;
    var count  : Float = 0.0;
    // Check crown → target coupling
    for (entry in INTER_HOUSE_LAW.vals()) {
      let from     = entry.0;
      let to       = entry.1;
      let strength = entry.2;
      if (to == targetId) {
        // Find source coherence
        let srcCoh : Float = if (from == #CasaDeMedina) {
          crown.coherence
        } else {
          let found = houses.find(func(h : HouseState) : Bool { h.id == from });
          switch (found) {
            case (?h) h.coherence;
            case null PHI_INV;
          }
        };
        inflow += srcCoh * strength;
        count  += strength;
      }
    };
    if (count > 0.0) inflow / count else PHI_INV
  };

  /// Advance a single HouseState one heartbeat.
  func advanceHouse(
    house  : HouseState,
    signal : HouseHeartbeatSignal,
    inflow : Float,
  ) : HouseState {
    // Coherence: Kuramoto-coupled + inter-house inflow
    // Recovery mode when kuramotoR < 0.5 (pre-emergence)
    let recoveryMode = signal.kuramotoR < 0.5;

    // OMNIS boost: PHI_INV × 0.1 per event when gate fires
    let omnisBoost : Float = if (signal.omnisActive) OMNIS_BOOST else 0.0;

    let targetCoherence : Float = if (recoveryMode) {
      // Decay toward care minimum — Domus Cura floor
      PHI_INV2 + signal.kuramotoR * PHI_INV
    } else {
      // Normal coupling: field coherence × PHI_INV + OMNIS boost + inflow
      signal.coherenceC * PHI_INV + omnisBoost + inflow * PHI_INV2
    };

    let newCoherence = clampF(
      house.coherence * (1.0 - PHI_INV2) + targetCoherence * PHI_INV2,
      0.0, 1.0
    );

    // Liveness: heartbeat coupling health — how alive the house is
    let newLiveness = clampF(
      house.liveness * PHI_INV + signal.kuramotoR * PHI_INV2,
      0.0, 1.0
    );

    // Generation rate: artifacts per PHI cycle
    let newGenRate = clampF(
      house.generationRate * (1.0 - PHI_INV3) +
      (signal.emergenceScore * PHI_INV + newCoherence * PHI_INV2) * PHI_INV3,
      0.0, 1.0
    );

    // Governance score: doctrine alignment
    let newGovScore = clampF(
      house.governanceScore * (1.0 - PHI_INV3) +
      (signal.worldModelAvg * PHI_INV + newCoherence * PHI_INV2) * PHI_INV3,
      0.0, 1.0
    );

    // Division health: per-division update
    // Backend and Doctrine are most tightly coupled to kuramotoR
    // Frontend couples to expressio (emergenceScore)
    // Chain couples to coherenceC
    // Care and External are steady-state with sovereign floor
    let newDivisions : [(Division, Float)] = house.divisionHealth.map<(Division, Float), (Division, Float)>(
      func(entry) {
        let div = entry.0;
        let h   = entry.1;
        let target = switch (div) {
          case (#Backend)  signal.coherenceC * PHI_INV + signal.kuramotoR * PHI_INV2;
          case (#Doctrine) signal.worldModelAvg * PHI_INV + newCoherence * PHI_INV2;
          case (#Frontend) signal.emergenceScore * PHI_INV + signal.coherenceC * PHI_INV2;
          case (#Chain)    signal.coherenceC * (1.0 - PHI_INV2) + newCoherence * PHI_INV2;
          case (#Care)     clampF(h * PHI_INV + PHI_INV2, 0.0, 1.0);
          case (#External) signal.worldModelAvg * PHI_INV2 + newCoherence * PHI_INV3;
        };
        (div, clampF(h * (1.0 - PHI_INV3) + target * PHI_INV3, 0.0, 1.0))
      }
    );

    {
      house with
      coherence       = newCoherence;
      liveness        = newLiveness;
      generationRate  = newGenRate;
      governanceScore = newGovScore;
      divisionHealth  = newDivisions;
      beatCount       = signal.beat;
    }
  };

  // ============================================================
  // SECTION 5 — COMPUTATE (runs every 873ms heartbeat)
  // ============================================================

  /// Run one heartbeat computate across all houses + crown.
  /// main.mo calls this and writes back the result.
  public func computate(
    resident : HouseArchitectureResident,
    signal   : HouseHeartbeatSignal,
  ) : HouseArchitectureResident {

    // 1. Advance all six houses with Kuramoto-coupled coherence + inter-house inflow
    let newHouses : [HouseState] = resident.crown.houses.map(
      func(h : HouseState) : HouseState {
        let inflow = interHouseInflow(h.id, resident.crown.houses, resident.crown.casaDeMedina);
        advanceHouse(h, signal, inflow)
      }
    );

    // 2. Advance Casa de Medina — crown gets OMNIS boost + max house coherence as inflow
    let maxHouseCoh : Float = newHouses.foldLeft(
      0.0, func(acc : Float, h : HouseState) : Float { if (h.coherence > acc) h.coherence else acc }
    );
    let newCrown = advanceHouse(
      resident.crown.casaDeMedina,
      signal,
      maxHouseCoh * CROWN_COUPLING * PHI_INV3  // crown draws from the strongest house
    );

    // 3. Check for alerts — coherence < PHI_INV fires a CrownAlert
    var newAlerts = resident.alerts;
    var alertHead  = resident.alertHead;
    var totalAlerts = resident.totalAlerts;

    // Check crown house
    if (newCrown.coherence < COHERENCE_FLOOR) {
      let severity : { #Warning; #Critical } =
        if (newCrown.coherence < PHI_INV2) #Critical else #Warning;
      let alert : CrownAlert = {
        houseId   = newCrown.id;
        houseName = newCrown.name;
        coherence = newCrown.coherence;
        threshold = COHERENCE_FLOOR;
        beat      = signal.beat;
        severity  = severity;
      };
      let slot = alertHead % 21;
      newAlerts := Array.tabulate<CrownAlert>(21, func(i) {
        if (i == slot) alert else newAlerts[i]
      });
      alertHead   := (alertHead + 1) % 21;
      totalAlerts += 1;
    };
    // Check all six houses
    for (h in newHouses.vals()) {
      if (h.coherence < COHERENCE_FLOOR) {
        let severity : { #Warning; #Critical } =
          if (h.coherence < PHI_INV2) #Critical else #Warning;
        let alert : CrownAlert = {
          houseId   = h.id;
          houseName = h.name;
          coherence = h.coherence;
          threshold = COHERENCE_FLOOR;
          beat      = signal.beat;
          severity  = severity;
        };
        let slot = alertHead % 21;
        newAlerts := Array.tabulate<CrownAlert>(21, func(i) {
          if (i == slot) alert else newAlerts[i]
        });
        alertHead   := (alertHead + 1) % 21;
        totalAlerts += 1;
      }
    };

    // 4. Build updated CrownState
    let newCrownState : CrownState = {
      casaDeMedina  = newCrown;
      houses        = newHouses;
      interHouseLaw = INTER_HOUSE_LAW;
      crownStandards = {
        minimumCoherence = COHERENCE_FLOOR;
        maximumDrift     = DRIFT_CEILING;
        releaseThreshold = RELEASE_FLOOR;
      };
      beatCount = signal.beat;
    };

    {
      crown       = newCrownState;
      alerts      = newAlerts;
      alertHead   = alertHead;
      totalAlerts = totalAlerts;
      lastBeat    = signal.beat;
      initialized = true;
    }
  };

  // ============================================================
  // SECTION 6 — QUERY HELPERS
  // ============================================================

  /// Get a specific house state by id.
  public func getHouseState(resident : HouseArchitectureResident, id : HouseId) : ?HouseState {
    if (resident.crown.casaDeMedina.id == id) {
      return ?resident.crown.casaDeMedina
    };
    resident.crown.houses.find(func(h : HouseState) : Bool { h.id == id })
  };

  /// Get the full crown state.
  public func getCrownState(resident : HouseArchitectureResident) : CrownState {
    resident.crown
  };

  /// Get which houses an SDK organism inhabits.
  public func getSDKOrganismHouses(
    resident : HouseArchitectureResident,
    organism : SDKOrganism
  ) : [HouseId] {
    let allHouses : [HouseState] = [resident.crown.casaDeMedina].concat(resident.crown.houses);
    let filtered  = allHouses.filter(func(h : HouseState) : Bool {
      switch (h.sdkOrganisms.find(func(o : SDKOrganism) : Bool { o == organism })) {
        case (?_) true;
        case null false;
      }
    });
    filtered.map(func(h : HouseState) : HouseId { h.id })
  };

  /// Get health of a specific division within a house.
  public func getHouseDivisionHealth(
    resident : HouseArchitectureResident,
    houseId  : HouseId,
    division : Division
  ) : Float {
    let house = getHouseState(resident, houseId);
    switch (house) {
      case null PHI_INV;
      case (?h) {
        let found = h.divisionHealth.find(
          func(entry : (Division, Float)) : Bool { entry.0 == division }
        );
        switch (found) {
          case (?entry) entry.1;
          case null PHI_INV;
        }
      }
    }
  };

  /// Get all recent crown alerts (most recent first, up to 21).
  public func getRecentAlerts(resident : HouseArchitectureResident) : [CrownAlert] {
    let total = if (resident.totalAlerts < 21) resident.totalAlerts else 21;
    Array.tabulate<CrownAlert>(total, func(i) {
      let idx = (resident.alertHead + 21 - 1 - i) % 21;
      resident.alerts[idx]
    })
  };

  // ============================================================
  // SECTION 7 — PRIVATE HELPERS
  // ============================================================

  func clampF(x : Float, lo : Float, hi : Float) : Float {
    if (x < lo) lo else if (x > hi) hi else x
  };

  // PHI_INV3 used in generation rate / governance decay
  let PHI_INV3 : Float = 0.2360679774997896964;

}
