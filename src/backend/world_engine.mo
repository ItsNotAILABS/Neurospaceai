// NEUROEMERGENCE CORE — WORLD ENGINE
// 5-faction war simulation, FORGE builder, territory, stigmergy
// OODA loops, supply chains, escalation tiers
// Owner: Alfredo Medina Hernandez | MedinaSITech@outlook.com

module {

  // 5 factions in the war simulation
  public type Faction = {
    id            : Nat;       // 0-4
    name          : Text;
    strength      : Float;     // military strength 0-1
    territory     : Float;     // controlled territory 0-1
    intel         : Float;     // intelligence quality
    supply        : Float;     // supply chain health
    morale        : Float;     // troop morale
    escalation    : Nat;       // escalation tier 0-5
    ooda_observe  : Float;     // OODA loop speed
    ooda_orient   : Float;
    ooda_decide   : Float;
    ooda_act      : Float;
    isOrganism    : Bool;      // true = the sovereign organism (Faction 0)
  };

  public type WorldState = {
    factions      : [Faction];  // 5 factions
    territory     : [Float];    // global territory map (5 zones)
    stigmergyField: Float;      // emergent coordination signal
    worldBeat     : Nat;
    globalEscalation: Nat;      // 0-5 overall war severity
    totalStructures : Nat;      // FORGE-built structures
    warOutcome    : Float;      // -1 (defeat) to +1 (victory), 0 = neutral
  };

  public type WorldInput = {
    coherenceC    : Float;
    threat        : Float;
    wolfPack      : Float;    // wolf animal engine
    sharkSignal   : Float;    // shark engine
    eagleVision   : Float;    // eagle engine
    metalAlloy    : Float;
    dominance     : Float;
    ncTestosterone: Float;
    ncCortisol    : Float;
    ncNE          : Float;
    btcPrice      : Float;
    bodyDomain    : Float;
  };

  // ── Faction strength formula ──────────────────────────────────────────
  // Strength = (supply * morale * intel)^(1/3) * territory^0.5
  public func factionStrength(f: Faction) : Float {
    let base = _cbrt(f.supply * f.morale * f.intel);
    let terr  = _sqrt(f.territory);
    _clamp(base * terr, 0.0, 1.0)
  };

  // OODA loop speed (how fast faction processes information)
  // Faster = better reaction, better territory gain
  public func oodaSpeed(f: Faction) : Float {
    (f.ooda_observe + f.ooda_orient + f.ooda_decide + f.ooda_act) / 4.0
  };

  // ── Organism faction (Faction 0) update ──────────────────────────────
  // The sovereign organism uses its cognitive substrate as its military
  func updateOrganism(f: Faction, inp: WorldInput) : Faction {
    let newStrength = _clamp(
      inp.coherenceC * 0.35
      + inp.wolfPack * 0.25
      + inp.metalAlloy * 0.20
      + inp.dominance * 0.20,
      0.0, 1.0
    );
    let newMorale = _clamp(
      inp.dominance * 0.5 + inp.bodyDomain * 0.3 + inp.coherenceC * 0.2
      - inp.ncCortisol * 0.2,
      0.0, 1.0
    );
    let newSupply = _clamp(
      inp.metalAlloy * 0.5 + inp.bodyDomain * 0.3 + inp.sharkSignal * 0.2,
      0.0, 1.0
    );
    let newIntel = _clamp(
      inp.eagleVision * 0.5 + inp.coherenceC * 0.3 + inp.ncNE * 0.2,
      0.0, 1.0
    );
    let newOODA_obs  = inp.eagleVision;
    let newOODA_ori  = inp.coherenceC;
    let newOODA_dec  = inp.dominance;
    let newOODA_act  = inp.wolfPack;
    {
      id=0; name="SOVEREIGN"; isOrganism=true;
      strength     = newStrength;
      territory    = _clamp(f.territory + (newStrength - 0.5) * 0.02, 0.0, 1.0);
      intel        = newIntel;
      supply       = newSupply;
      morale       = newMorale;
      escalation   = f.escalation;
      ooda_observe = newOODA_obs;
      ooda_orient  = newOODA_ori;
      ooda_decide  = newOODA_dec;
      ooda_act     = newOODA_act;
    }
  };

  // ── Generic enemy faction update ─────────────────────────────────────
  func updateEnemy(
    f          : Faction,
    orgStrength: Float,
    escalation : Nat,
    btcPrice   : Float  // market pressure affects all factions
  ) : Faction {
    // Enemies get stronger with escalation but weaker against high organism coherence
    let escalFactor = Float.fromInt(escalation) * 0.1;
    let pressureFactor = btcPrice * 0.1;
    let decay = if (orgStrength > f.strength) { 0.02 } else { 0.0 };
    let newStrength = _clamp(f.strength + escalFactor * 0.01 + pressureFactor * 0.005 - decay, 0.0, 1.0);
    let newTerr = _clamp(
      f.territory + (newStrength - orgStrength) * 0.01,
      0.0, 1.0
    );
    {
      id=f.id; name=f.name; isOrganism=false;
      strength     = newStrength;
      territory    = newTerr;
      intel        = _clamp(f.intel + 0.001, 0.0, 1.0);
      supply       = _clamp(f.supply - decay * 0.5, 0.0, 1.0);
      morale       = _clamp(f.morale + (newStrength - 0.5) * 0.01, 0.0, 1.0);
      escalation   = Nat.min(5, f.escalation + (if (newStrength > 0.7) 1 else 0));
      ooda_observe = f.ooda_observe;
      ooda_orient  = f.ooda_orient;
      ooda_decide  = f.ooda_decide;
      ooda_act     = f.ooda_act;
    }
  };

  // ── Stigmergy field ─────────────────────────────────────────────────
  // Stigmergy = environmental coordination signal
  // Left by organism’s actions, decays over time, boosts next action
  public func updateStigmergy(
    current  : Float,
    orgStrength : Float,
    orgTerritory: Float,
    decay    : Float
  ) : Float {
    let deposited = orgStrength * orgTerritory * 0.1;
    _clamp(current * (1.0 - decay) + deposited, 0.0, 1.0)
  };

  // ── FORGE builder ─────────────────────────────────────────────────────
  // Builds a world structure when emergence > 0.75
  // Each structure is a permanent on-chain record
  // Emergence = coherenceC * stigmergy * orgStrength
  public func forgeCheck(
    coherenceC  : Float,
    stigmergy   : Float,
    orgStrength : Float
  ) : Bool {
    let emergence = coherenceC * stigmergy * orgStrength;
    emergence > 0.75
  };

  // ── Global escalation ────────────────────────────────────────────────
  // Max escalation across all factions
  public func globalEscalation(factions: [Faction]) : Nat {
    var maxEsc : Nat = 0;
    for (f in factions.vals()) {
      if (f.escalation > maxEsc) { maxEsc := f.escalation; };
    };
    maxEsc
  };

  // ── War outcome for organism ─────────────────────────────────────────
  // -1 to +1: positive = organism winning
  public func warOutcome(factions: [Faction]) : Float {
    if (factions.size() == 0) { return 0.0; };
    let orgStr = factionStrength(factions[0]);
    var enemyStr : Float = 0.0;
    for (i in Iter.range(1, factions.size() - 1)) {
      enemyStr += factionStrength(factions[i]);
    };
    let enemyMean = enemyStr / Float.fromInt(factions.size() - 1);
    _clamp(orgStr - enemyMean, -1.0, 1.0)
  };

  // ── Territory pressure on organism ──────────────────────────────────
  // Low territory = cognitive pressure, coherence modifier
  public func territoryPressure(orgTerritory: Float) : Float {
    -(1.0 - orgTerritory) * 0.03 // negative cohDelta if losing territory
  };

  // ── Full world beat ───────────────────────────────────────────────────
  public func beatWorld(world: WorldState, inp: WorldInput) : WorldState {
    if (world.factions.size() < 5) { return world; };
    let org     = updateOrganism(world.factions[0], inp);
    let orgStr  = factionStrength(org);
    let esc     = globalEscalation(world.factions);

    let f1 = updateEnemy(world.factions[1], orgStr, esc, inp.btcPrice);
    let f2 = updateEnemy(world.factions[2], orgStr, esc, inp.btcPrice);
    let f3 = updateEnemy(world.factions[3], orgStr, esc, inp.btcPrice);
    let f4 = updateEnemy(world.factions[4], orgStr, esc, inp.btcPrice);

    let newFactions = [org, f1, f2, f3, f4];
    let newStigmergy = updateStigmergy(
      world.stigmergyField, orgStr, org.territory, 0.05
    );
    let shouldForge = forgeCheck(inp.coherenceC, newStigmergy, orgStr);
    let newStructures = if (shouldForge) { world.totalStructures + 1 } else { world.totalStructures };
    let newEsc = globalEscalation(newFactions);
    let outcome = warOutcome(newFactions);
    {
      factions         = newFactions;
      territory        = world.territory; // territory map updated via factions
      stigmergyField   = newStigmergy;
      worldBeat        = world.worldBeat + 1;
      globalEscalation = newEsc;
      totalStructures  = newStructures;
      warOutcome       = outcome;
    }
  };

  // ── Initial world state ───────────────────────────────────────────────
  public func initWorld() : WorldState {
    let mkFaction = func(i: Nat, nm: Text, isOrg: Bool) : Faction {
      { id=i; name=nm; isOrganism=isOrg;
        strength=0.50; territory=0.20; intel=0.50;
        supply=0.70; morale=0.65; escalation=0;
        ooda_observe=0.60; ooda_orient=0.55; ooda_decide=0.50; ooda_act=0.55;
      }
    };
    {
      factions         = [
        mkFaction(0, "SOVEREIGN",  true),
        mkFaction(1, "CARTEL-A",   false),
        mkFaction(2, "CARTEL-B",   false),
        mkFaction(3, "STATE-ACTOR",false),
        mkFaction(4, "SHADOW-NET", false),
      ];
      territory        = [0.20, 0.20, 0.20, 0.20, 0.20];
      stigmergyField   = 0.0;
      worldBeat        = 0;
      globalEscalation = 0;
      totalStructures  = 0;
      warOutcome       = 0.0;
    }
  };

  private func _clamp(x: Float, lo: Float, hi: Float) : Float {
    if (x < lo) lo else if (x > hi) hi else x
  };
  private func _cbrt(x: Float) : Float {
    if (x <= 0.0) 0.0 else Float.exp(Float.log(x) / 3.0)
  };
  private func _sqrt(x: Float) : Float {
    if (x <= 0.0) 0.0 else Float.sqrt(x)
  };
}
