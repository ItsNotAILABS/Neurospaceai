import Array "mo:core/Array";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {
  let PHI : Float = 1.6180339887498948482;

  public type MineralType = { #DopamineVein; #SerotoninVein; #EndorphinCrystal; #CortisolHazard; #AcetylcholineOre; #GABADeposit };

  public type MineralDeposit = {
    id: Nat; mineralType: MineralType; x: Float; z: Float; y: Float;
    intensity: Float; depleted: Bool; regenTicks: Nat;
  };

  public type AvatarMineState = {
    avatarId: Text; x: Float; z: Float; y: Float;
    heading: Float; speed: Float; currentAction: Text;
    targetDepositId: ?Nat; resourcesCollected: Float;
  };

  public type MinePulseReport = {
    tick: Nat; activeAvatars: Nat; totalMined: Float;
    dominantMineral: Text; cerebixObservation: Text;
  };

  public type SubstrateMineState = {
    tick: Nat; deposits: [MineralDeposit];
    avatarStates: [AvatarMineState]; pulseLog: [MinePulseReport];
    totalResourcesExtracted: Float;
  };

  func phiNoise(x: Float, z: Float, seed: Float) : Float {
    let f1 = Float.sin(x * PHI * 0.01 + seed) * Float.cos(z * PHI * 0.0618 + seed);
    let f2 = Float.sin(x * 0.0382 + z * PHI * 0.023 + seed * PHI);
    let f3 = Float.cos(x * PHI * 0.0145 + z * 0.089 + seed);
    ((f1 + f2 + f3) / 3.0 + 1.0) / 2.0
  };

  func terrainH(x: Float, z: Float) : Float {
    (phiNoise(x, z, PHI) + phiNoise(x*PHI, z*PHI, PHI*PHI)*0.3 + phiNoise(x*PHI*PHI, z*PHI*PHI, 1.0)*0.1) * 80.0
  };

  func mineralForIdx(i: Nat) : MineralType {
    switch (i % 6) {
      case 0 { #DopamineVein }; case 1 { #SerotoninVein }; case 2 { #EndorphinCrystal };
      case 3 { #CortisolHazard }; case 4 { #AcetylcholineOre }; case _ { #GABADeposit };
    }
  };

  func buildDeposit(i: Nat) : MineralDeposit {
    let angle = i.toFloat() * PHI * 6.28318;
    let radius = i.toFloat() * 38.0 + 100.0;
    let x = Float.min(950.0, Float.max(50.0, 500.0 + radius * Float.cos(angle)));
    let z = Float.min(950.0, Float.max(50.0, 500.0 + radius * Float.sin(angle)));
    { id=i; mineralType=mineralForIdx(i); x=x; z=z; y=terrainH(x,z);
      intensity=0.5 + phiNoise(x,z,i.toFloat())*0.5; depleted=false; regenTicks=0 }
  };

  public func initMineState() : SubstrateMineState {
    let deposits = Array.tabulate(24, buildDeposit);
    let avatars : [AvatarMineState] = [
      { avatarId="AXIOM"; x=100.0; z=100.0; y=terrainH(100.0,100.0); heading=0.0; speed=2.0; currentAction="EXPLORING"; targetDepositId=null; resourcesCollected=0.0 },
      { avatarId="PHANTOM"; x=900.0; z=100.0; y=terrainH(900.0,100.0); heading=3.14159; speed=2.0; currentAction="EXPLORING"; targetDepositId=null; resourcesCollected=0.0 },
      { avatarId="SENTINEL"; x=100.0; z=900.0; y=terrainH(100.0,900.0); heading=1.5708; speed=2.0; currentAction="EXPLORING"; targetDepositId=null; resourcesCollected=0.0 },
      { avatarId="FLUX"; x=900.0; z=900.0; y=terrainH(900.0,900.0); heading=4.7124; speed=2.0; currentAction="EXPLORING"; targetDepositId=null; resourcesCollected=0.0 },
    ];
    { tick=0; deposits=deposits; avatarStates=avatars; pulseLog=[]; totalResourcesExtracted=0.0 }
  };

  public func getMineState(state: SubstrateMineState) : SubstrateMineState { state };

  public func tickMine(state: SubstrateMineState) : SubstrateMineState {
    let newTick = state.tick + 1;
    var newExtracted = state.totalResourcesExtracted;
    let updated = state.avatarStates.map(func(av: AvatarMineState) : AvatarMineState {
      var nearestId : ?Nat = null; var nearestDist : Float = 999999.0; var di : Nat = 0;
      while (di < state.deposits.size()) {
        let dep = state.deposits[di];
        if (not dep.depleted) {
          let dx = dep.x - av.x; let dz = dep.z - av.z;
          let dist = Float.sqrt(dx*dx + dz*dz);
          if (dist < nearestDist) { nearestDist := dist; nearestId := ?dep.id; };
        };
        di += 1;
      };
      switch (nearestId) {
        case (?did) {
          let dep = state.deposits[did];
          let dx = dep.x - av.x; let dz = dep.z - av.z;
          let dist = Float.sqrt(dx*dx + dz*dz);
          if (dist < 10.0) {
            newExtracted += 0.02;
            { av with currentAction="MINING"; targetDepositId=?did; resourcesCollected=av.resourcesCollected+0.02 }
          } else {
            let nx = av.x + (dx/dist)*2.0; let nz = av.z + (dz/dist)*2.0;
            { av with x=nx; z=nz; y=terrainH(nx,nz); currentAction="MOVING"; targetDepositId=?did }
          }
        };
        case null { { av with currentAction="RESTING" } };
      }
    });
    let obs = "CEREBIX observes: AXIOM=" # updated[0].currentAction;
    let report : MinePulseReport = { tick=newTick; activeAvatars=4; totalMined=newExtracted; dominantMineral="DopamineVein"; cerebixObservation=obs };
    let newLog = if (state.pulseLog.size() >= 10) {
      var r : [MinePulseReport] = [];
      var i : Nat = 1;
      while (i < state.pulseLog.size()) { r := r.concat([state.pulseLog[i]]); i += 1; };
      r.concat([report])
    } else { state.pulseLog.concat([report]) };
    { tick=newTick; deposits=state.deposits; avatarStates=updated; pulseLog=newLog; totalResourcesExtracted=newExtracted }
  };

  public func manualMine(state: SubstrateMineState, _avatarId: Text, depositId: Nat) : ?{neurotransmitter: Text; delta: Float} {
    if (depositId >= state.deposits.size()) return null;
    let dep = state.deposits[depositId];
    if (dep.depleted) return null;
    let nt = switch (dep.mineralType) {
      case (#DopamineVein) "dopamine"; case (#SerotoninVein) "serotonin";
      case (#EndorphinCrystal) "endorphin"; case (#CortisolHazard) "cortisol";
      case (#AcetylcholineOre) "acetylcholine"; case (#GABADeposit) "gaba";
    };
    let delta = switch (dep.mineralType) {
      case (#DopamineVein) dep.intensity*0.1; case (#SerotoninVein) dep.intensity*0.08;
      case (#EndorphinCrystal) dep.intensity*0.05; case (#CortisolHazard) dep.intensity*0.15;
      case (#AcetylcholineOre) dep.intensity*0.09; case (#GABADeposit) dep.intensity*0.07;
    };
    ?{ neurotransmitter=nt; delta=delta }
  };

  public func getDepositsNearby(state: SubstrateMineState, x: Float, z: Float, radius: Float) : [MineralDeposit] {
    state.deposits.filter(func(d: MineralDeposit) : Bool {
      let dx = d.x - x; let dz = d.z - z;
      Float.sqrt(dx*dx + dz*dz) <= radius and not d.depleted
    })
  };
}
