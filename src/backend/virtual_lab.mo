// ============================================================
// VIRTUAL LAB ENGINE — virtual_lab.mo
// NeuroEmergence Core — Sovereign Research Environment
// Creator: Alfredo Medina Hernandez | Dallas, TX 2026
// TOP SECRET PROPRIETARY — All rights reserved.
//
// RESIDENT/COMPUTATE SOVEREIGN PATTERN:
//   LabResident    — persistent state (sandboxes, avatars, labCoherence)
//   updateLabState — computate, called every 873ms heartbeat
//
// MATERIAL COUPLING COEFFICIENTS (PHI-derived, not arbitrary):
//   Dirt        = 1/PHI^3 = 0.2360679774997896964
//   SoftMetal   = 1/PHI^2 = 0.3819660112501051518
//   HardMetal   = 1/PHI   = 0.6180339887498948482
//   Crystalline = 1.0     (pure resonance — unity)
//
// FRACTAL DIMENSIONS (Hausdorff measures, not arbitrary):
//   Dirt:        1.87  (soil aggregate — measured)
//   SoftMetal:   2.12  (copper dendrite Hausdorff dimension)
//   HardMetal:   2.67  (iron grain boundary fractal)
//   Crystalline: 3.0   (perfect 3D space-filling)
//
// ATTRACTOR PARAMETERS (canonical literature values):
//   Lorenz sigma=10 rho=28 beta=8/3
//   Rossler a=0.2 b=0.2 c=5.7
//   Duffing alpha=-1 beta=1 delta=PHI_INV3 gamma=PHI_INV omega=SCHUMANN
//   Henon a=1.4 b=0.3
//
// PHI = 1.6180339887498948482 (19 decimals, sealed)
// Heartbeat = 873ms. All constants from sovereign_laws.mo.
// ============================================================

import SovereignLaws "sovereign_laws";
import ArtifactOrganism "artifact_organism";
import Float  "mo:core/Float";
import Nat    "mo:core/Nat";
import Nat64  "mo:core/Nat64";
import List   "mo:core/List";
import Array  "mo:core/Array";

module {

  // ============================================================
  // SECTION 0 — DOCTRINE CONSTANTS (from sovereign_laws.mo)
  // ============================================================

  let PHI      : Float = SovereignLaws.PHI;
  let PHI_INV  : Float = SovereignLaws.PHI_INV;
  let PHI_INV2 : Float = SovereignLaws.PHI_INV2;
  let PHI_INV3 : Float = SovereignLaws.PHI_INV3;
  let PHI2     : Float = SovereignLaws.PHI2;
  let OMNIS    : Float = SovereignLaws.OMNIS_THRESHOLD;
  let PI       : Float = SovereignLaws.PI;

  // Material coupling coefficients — sealed PHI powers
  let COUPLING_DIRT        : Float = PHI_INV3; // 0.236...
  let COUPLING_SOFT_METAL  : Float = PHI_INV2; // 0.382...
  let COUPLING_HARD_METAL  : Float = PHI_INV;  // 0.618...
  let COUPLING_CRYSTALLINE : Float = 1.0;      // unity

  // Hausdorff fractal dimensions (physical constants)
  let FRACTAL_DIRT        : Float = 1.87;
  let FRACTAL_SOFT_METAL  : Float = 2.12;
  let FRACTAL_HARD_METAL  : Float = 2.67;
  let FRACTAL_CRYSTALLINE : Float = 3.0;

  public let MAX_SANDBOXES     : Nat = 13; // FIB[7]
  public let MAX_AVATARS       : Nat = 8;  // one per internal team
  public let DEFAULT_PARTICLES : Nat = 8;  // FIB[5]

  // ============================================================
  // SECTION 1 — TYPES
  // ============================================================

  public type Vec3 = { x : Float; y : Float; z : Float };

  public type MaterialType = {
    #Dirt; #SoftMetal; #HardMetal; #Crystalline;
  };

  public type GeometricAttractor = {
    #Lorenz; #Rossler; #Duffing; #Henon;
  };

  public type EmergencePattern = {
    #Formless; #Crystallizing; #Vortex; #Fractal; #Coherent; #Sovereign;
  };

  public type ActionState = {
    #Observing; #Computing; #Synthesizing; #Reporting; #Healing; #Governing;
  };

  public type Sandbox = {
    id                : Nat;
    material          : MaterialType;
    fieldIntensity    : Float;
    phiCoupling       : Float;
    temperatureAnalog : Float;
    cycleCount        : Nat;
    emergenceScore    : Float;
    pattern           : EmergencePattern;
    particlePositions : [Vec3];
    sealed            : Bool;
    artifactId        : ?Nat;
  };

  public type AvatarAgent = {
    teamName        : Text;
    coherenceLevel  : Float;
    attentionVector : Vec3;
    emotionValence  : Float;
    actionState     : ActionState;
  };

  public type LabResident = {
    sandboxes        : List.List<Sandbox>;
    avatars          : List.List<AvatarAgent>;
    labCoherence     : Float;
    nextSandboxId    : Nat;
    nextArtifactId   : Nat;
    totalExperiments : Nat;
    initialized      : Bool;
  };

  public type LabState = {
    sandboxes         : [Sandbox];
    avatars           : [AvatarAgent];
    labCoherence      : Float;
    activeExperiments : Nat;
  };

  // ============================================================
  // SECTION 2 — RESIDENT INITIALIZATION
  // ============================================================

  let TEAM_NAMES : [Text] = [
    "NEXUS", "COGNUS", "LEXIS", "AURUM",
    "SOLUS", "VETUS", "VERITAS", "UPGRADE_GOV"
  ];

  public func emptyResident() : LabResident {
    let avatarList = List.empty<AvatarAgent>();
    let n = TEAM_NAMES.size();
    var i = 0;
    while (i < n) {
      let fi    = i.toFloat();
      let nf    = n.toFloat();
      let angle = fi * 2.0 * PI / nf;
      avatarList.add({
        teamName        = TEAM_NAMES[i];
        coherenceLevel  = PHI_INV;
        attentionVector = {
          x = Float.cos(angle);
          y = Float.sin(angle);
          z = PHI_INV3;
        };
        emotionValence  = 0.0;
        actionState     = #Observing;
      });
      i += 1;
    };
    {
      sandboxes        = List.empty<Sandbox>();
      avatars          = avatarList;
      labCoherence     = PHI_INV;
      nextSandboxId    = 0;
      nextArtifactId   = 1;
      totalExperiments = 0;
      initialized      = true;
    }
  };

  // ============================================================
  // SECTION 3 — MATERIAL HELPERS
  // ============================================================

  public func materialCouplingCoeff(m : MaterialType) : Float {
    switch m {
      case (#Dirt)        COUPLING_DIRT;
      case (#SoftMetal)   COUPLING_SOFT_METAL;
      case (#HardMetal)   COUPLING_HARD_METAL;
      case (#Crystalline) COUPLING_CRYSTALLINE;
    }
  };

  public func materialFractalDimension(m : MaterialType) : Float {
    switch m {
      case (#Dirt)        FRACTAL_DIRT;
      case (#SoftMetal)   FRACTAL_SOFT_METAL;
      case (#HardMetal)   FRACTAL_HARD_METAL;
      case (#Crystalline) FRACTAL_CRYSTALLINE;
    }
  };

  public func materialAttractor(m : MaterialType) : GeometricAttractor {
    switch m {
      case (#Dirt)        #Lorenz;
      case (#SoftMetal)   #Rossler;
      case (#HardMetal)   #Duffing;
      case (#Crystalline) #Henon;
    }
  };

  // ============================================================
  // SECTION 4 — EMERGENCE COMPUTATION
  //
  // score = kuramotoR x fractalDim x phiCoupling x couplingCoeff / 3.0
  // Pattern thresholds (PHI-derived):
  //   Formless:      score < PHI_INV3  (0.236)
  //   Crystallizing: score >= PHI_INV3
  //   Vortex:        score >= PHI_INV  (0.618)
  //   Fractal:       Vortex AND score x PHI2 >= 1.0
  //   Coherent:      score >= OMNIS x PHI_INV  (~0.538)
  //   Sovereign:     score >= OMNIS   (0.87)
  // ============================================================

  func computeEmergenceScore(
    kuramotoR   : Float,
    m           : MaterialType,
    phiCoupling : Float,
  ) : Float {
    let raw = kuramotoR * materialFractalDimension(m) * phiCoupling * materialCouplingCoeff(m);
    clampF(raw / 3.0, 0.0, 1.0)
  };

  func scoreToPattern(score : Float) : EmergencePattern {
    if (score >= OMNIS)                              { #Sovereign }
    else if (score >= OMNIS * PHI_INV)               { #Coherent }
    else if (score >= PHI_INV and score * PHI2 >= 1.0) { #Fractal }
    else if (score >= PHI_INV)                       { #Vortex }
    else if (score >= PHI_INV3)                      { #Crystallizing }
    else                                             { #Formless }
  };

  // ============================================================
  // SECTION 5 — PARTICLE PHYSICS
  // dt = PHI_INV3 (sovereign time step)
  //
  // Lorenz:  sigma=10 rho=28 beta=8/3
  // Rossler: a=0.2 b=0.2 c=5.7
  // Duffing: alpha=-1 beta=1 delta=PHI_INV3 gamma=PHI_INV omega=Schumann
  // Henon:   a=1.4 b=0.3
  // ============================================================

  func lorenzStep(p : Vec3, dt : Float) : Vec3 {
    let sigma : Float = 10.0;
    let rho   : Float = 28.0;
    let beta  : Float = 2.6666666666666665; // 8/3
    let dx = sigma * (p.y - p.x);
    let dy = p.x * (rho - p.z) - p.y;
    let dz = p.x * p.y - beta * p.z;
    { x = p.x + dx * dt; y = p.y + dy * dt; z = p.z + dz * dt }
  };

  func rosslerStep(p : Vec3, dt : Float) : Vec3 {
    let a : Float = 0.2;
    let b : Float = 0.2;
    let c : Float = 5.7;
    let dx = -(p.y + p.z);
    let dy = p.x + a * p.y;
    let dz = b + p.z * (p.x - c);
    { x = p.x + dx * dt; y = p.y + dy * dt; z = p.z + dz * dt }
  };

  func duffingStep(p : Vec3, dt : Float, t : Float) : Vec3 {
    let alpha : Float = -1.0;
    let beta2 : Float = 1.0;
    let delta : Float = PHI_INV3;
    let gamma : Float = PHI_INV;
    let omega : Float = SovereignLaws.SCHUMANN_HZ;
    let force = p.x * (alpha + beta2 * p.x * p.x) - delta * p.y + gamma * Float.cos(omega * t);
    { x = p.x + p.y * dt; y = p.y + force * dt; z = p.z + omega * dt }
  };

  func henonStep(p : Vec3) : Vec3 {
    let a : Float = 1.4;
    let b : Float = 0.3;
    { x = 1.0 - a * p.x * p.x + p.y; y = b * p.x; z = p.z * PHI_INV }
  };

  func applyAttractor(p : Vec3, m : MaterialType, dt : Float, t : Float) : Vec3 {
    switch m {
      case (#Dirt)        { lorenzStep(p, dt) };
      case (#SoftMetal)   { rosslerStep(p, dt) };
      case (#HardMetal)   { duffingStep(p, dt, t) };
      case (#Crystalline) { henonStep(p) };
    }
  };

  func magnitude3(v : Vec3) : Float {
    Float.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
  };

  func addVec(a : Vec3, b : Vec3) : Vec3 {
    { x = a.x + b.x; y = a.y + b.y; z = a.z + b.z }
  };

  func scaleVec(v : Vec3, s : Float) : Vec3 {
    { x = v.x * s; y = v.y * s; z = v.z * s }
  };

  func centroid(pts : [Vec3]) : Vec3 {
    let n = pts.size();
    if (n == 0) { return { x = 0.0; y = 0.0; z = 0.0 } };
    let sum = pts.foldLeft({ x = 0.0; y = 0.0; z = 0.0 }, func(acc, p) {
      addVec(acc, p)
    });
    let nf = n.toFloat();
    { x = sum.x / nf; y = sum.y / nf; z = sum.z / nf }
  };

  func fieldForceVec(
    p             : Vec3,
    fieldIntensity: Float,
    kuramotoR     : Float,
    phiCoupling   : Float,
    couplingCoeff : Float,
  ) : Vec3 {
    let mag = magnitude3(p);
    if (mag < 1.0e-10) { return { x = 0.0; y = 0.0; z = 0.0 } };
    let fScalar = fieldIntensity * kuramotoR * phiCoupling * couplingCoeff * PHI;
    { x = (p.x / mag) * fScalar; y = (p.y / mag) * fScalar; z = (p.z / mag) * fScalar }
  };

  func stepParticles(
    positions     : [Vec3],
    m             : MaterialType,
    fieldIntensity: Float,
    kuramotoR     : Float,
    phiCoupling   : Float,
    cycleCount    : Nat,
  ) : [Vec3] {
    let dt    = PHI_INV3;
    let t     = cycleCount.toFloat() * dt;
    let coeff = materialCouplingCoeff(m);
    positions.map<Vec3, Vec3>(func(p) {
      let attracted = applyAttractor(p, m, dt, t);
      let force     = fieldForceVec(attracted, fieldIntensity, kuramotoR, phiCoupling, coeff);
      addVec(attracted, scaleVec(force, dt))
    })
  };

  // ============================================================
  // SECTION 6 — AVATAR AGENT COMPUTATION
  // ============================================================

  func computeActionState(coherence : Float, valence : Float) : ActionState {
    if (coherence >= OMNIS)              { #Governing }
    else if (coherence >= PHI_INV2 * PHI) {
      if (valence >= 0.0) { #Synthesizing } else { #Healing }
    }
    else if (coherence >= PHI_INV)       { #Computing }
    else if (coherence >= PHI_INV3)      { #Reporting }
    else                                 { #Observing }
  };

  func findHighestEmergenceSandbox(sandboxes : List.List<Sandbox>) : ?Sandbox {
    let arr = sandboxes.toArray();
    if (arr.size() == 0) { return null };
    var best = arr[0];
    for (s in arr.values()) {
      if (s.emergenceScore > best.emergenceScore) { best := s };
    };
    ?best
  };

  func updateAvatars(
    avatars   : List.List<AvatarAgent>,
    kuramotoR : Float,
    sandboxes : List.List<Sandbox>,
  ) : List.List<AvatarAgent> {
    let focusPos : Vec3 = switch (findHighestEmergenceSandbox(sandboxes)) {
      case null    { { x = 0.0; y = 0.0; z = 0.0 } };
      case (?s) {
        if (s.particlePositions.size() == 0) { { x = 0.0; y = 0.0; z = 0.0 } }
        else { centroid(s.particlePositions) }
      };
    };
    let n      = avatars.size();
    let nf     = (if (n == 0) 1 else n).toFloat();
    let result = List.empty<AvatarAgent>();
    var i      = 0;
    for (av in avatars.values()) {
      let fi          = i.toFloat();
      let phaseOffset = fi * SovereignLaws.GOLDEN_ANGLE * PI / 180.0;
      let coherence   = clampF(kuramotoR * PHI_INV + fi * PHI_INV3 / nf, 0.0, 1.0);
      let valence     = clampF((kuramotoR - PHI_INV) * 2.0, -1.0, 1.0);
      result.add({
        teamName        = av.teamName;
        coherenceLevel  = coherence;
        attentionVector = {
          x = focusPos.x + Float.cos(phaseOffset) * PHI_INV3;
          y = focusPos.y + Float.sin(phaseOffset) * PHI_INV3;
          z = focusPos.z * PHI_INV;
        };
        emotionValence  = valence;
        actionState     = computeActionState(coherence, valence);
      });
      i += 1;
    };
    result
  };

  // ============================================================
  // SECTION 7 — COMPUTATE: updateLabState
  // Called every 873ms heartbeat from main.mo.
  // ============================================================

  public func updateLabState(resident : LabResident, kuramotoR : Float) : LabResident {
    let updatedAvatars = updateAvatars(resident.avatars, kuramotoR, resident.sandboxes);
    {
      resident with
      avatars      = updatedAvatars;
      labCoherence = clampF(kuramotoR * PHI_INV, 0.0, 1.0);
    }
  };

  // ============================================================
  // SECTION 8 — SANDBOX CREATION
  // ============================================================

  func initParticles(count : Nat, m : MaterialType) : [Vec3] {
    let result = List.empty<Vec3>();
    let coeff  = materialCouplingCoeff(m);
    let cf     = (if (count == 0) 1 else count).toFloat();
    var i = 0;
    while (i < count) {
      let fi    = i.toFloat();
      let angle = fi * SovereignLaws.GOLDEN_ANGLE * PI / 180.0;
      let r     = coeff + fi * PHI_INV3 / cf;
      result.add({
        x = r * Float.cos(angle);
        y = r * Float.sin(angle);
        z = r * Float.sin(angle * PHI_INV);
      });
      i += 1;
    };
    result.toArray()
  };

  public func createSandbox(
    resident : LabResident,
    material : MaterialType,
  ) : { #ok : (Sandbox, LabResident); #err : Text } {
    if (resident.sandboxes.size() >= MAX_SANDBOXES) {
      return #err("Max sandboxes (" # MAX_SANDBOXES.toText() # ") reached");
    };
    let sandbox : Sandbox = {
      id                = resident.nextSandboxId;
      material          = material;
      fieldIntensity    = PHI_INV;
      phiCoupling       = PHI_INV;
      temperatureAnalog = PHI_INV3;
      cycleCount        = 0;
      emergenceScore    = 0.0;
      pattern           = #Formless;
      particlePositions = initParticles(DEFAULT_PARTICLES, material);
      sealed            = false;
      artifactId        = null;
    };
    let newList = resident.sandboxes.clone();
    newList.add(sandbox);
    #ok(sandbox, {
      resident with
      sandboxes     = newList;
      nextSandboxId = resident.nextSandboxId + 1;
    })
  };

  // ============================================================
  // SECTION 9 — SIMULATION STEP
  // ============================================================

  public func runSandboxStep(
    resident  : LabResident,
    sandboxId : Nat,
    kuramotoR : Float,
  ) : { #ok : (Sandbox, LabResident); #err : Text } {
    let matchId = sandboxId;
    let idxOpt = resident.sandboxes.findIndex(func(s : Sandbox) : Bool {
      Nat.equal(s.id, matchId)
    });
    switch idxOpt {
      case null { #err("Sandbox " # sandboxId.toText() # " not found") };
      case (?i) {
        let s = resident.sandboxes.at(i);
        if (s.sealed) { return #err("Sandbox is sealed — immutable after sealing") };
        let newPositions = stepParticles(
          s.particlePositions, s.material,
          s.fieldIntensity, kuramotoR,
          s.phiCoupling, s.cycleCount,
        );
        let newScore   = computeEmergenceScore(kuramotoR, s.material, s.phiCoupling);
        let newPattern = scoreToPattern(newScore);
        let updated : Sandbox = {
          s with
          particlePositions = newPositions;
          emergenceScore    = newScore;
          pattern           = newPattern;
          cycleCount        = s.cycleCount + 1;
        };
        let newBoxes = resident.sandboxes.clone();
        newBoxes.put(i, updated);
        #ok(updated, { resident with sandboxes = newBoxes })
      };
    }
  };

  // ============================================================
  // SECTION 10 — SEAL EXPERIMENT
  // ============================================================

  public func sealExperiment(
    resident         : LabResident,
    artifactOrganism : ArtifactOrganism.ArtifactOrganismResident,
    sandboxId        : Nat,
    beatCount        : Nat,
    nowNs            : Int,
  ) : { #ok : (Nat, LabResident, ArtifactOrganism.ArtifactOrganismResident); #err : Text } {
    let matchId = sandboxId;
    let idxOpt = resident.sandboxes.findIndex(func(s : Sandbox) : Bool {
      Nat.equal(s.id, matchId)
    });
    switch idxOpt {
      case null { #err("Sandbox " # sandboxId.toText() # " not found") };
      case (?i) {
        let s = resident.sandboxes.at(i);
        if (s.sealed) { return #err("Sandbox already sealed") };
        let artId  = resident.nextArtifactId;
        let artCtx : ArtifactOrganism.ArtifactContext = {
          artifactId        = "LAB-SBX-" # sandboxId.toText() # "-" # artId.toText();
          producer          = "VirtualLabEngine";
          qualityScore      = s.emergenceScore;
          doctrineAlignment = s.phiCoupling;
          beatCount         = Nat64.fromNat(beatCount);
          genesisHash       = ArtifactOrganism.genesisDistanceScore(s.emergenceScore, s.phiCoupling);
        };
        let newArtOrg = ArtifactOrganism.sealArtifact(artifactOrganism, artCtx, nowNs);
        let sealed : Sandbox = { s with sealed = true; artifactId = ?artId };
        let newBoxes = resident.sandboxes.clone();
        newBoxes.put(i, sealed);
        #ok(artId, {
          resident with
          sandboxes        = newBoxes;
          nextArtifactId   = artId + 1;
          totalExperiments = resident.totalExperiments + 1;
        }, newArtOrg)
      };
    }
  };

  // ============================================================
  // SECTION 11 — QUERY
  // ============================================================

  public func getLabState(resident : LabResident) : LabState {
    let sandboxArr = resident.sandboxes.toArray();
    var activeCount : Nat = 0;
    for (s in sandboxArr.values()) {
      if (not s.sealed) { activeCount += 1 };
    };
    {
      sandboxes         = sandboxArr;
      avatars           = resident.avatars.toArray();
      labCoherence      = resident.labCoherence;
      activeExperiments = activeCount;
    }
  };

  // ============================================================
  // INTERNAL HELPERS
  // ============================================================

  func clampF(x : Float, lo : Float, hi : Float) : Float {
    if (x < lo) { lo } else if (x > hi) { hi } else { x }
  };

};
