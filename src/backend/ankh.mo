import Float "mo:core/Float";

module {
  // ANKH TORUS — Four Sovereign Toroidal Feedback Loops
  // Loop 1: Connectome → Governance → Connectome (Cognitive loop)
  // Loop 2: Governance → Substrate → Governance (Economic loop)
  // Loop 3: Substrate → Interface → Substrate (Expression loop)
  // Loop 4: Interface → Connectome → Interface (Perception loop)
  // Phase lock (all 4 loops coherence > 0.90) = full organism emergence event

  let TWO_PI : Float = 6.28318530717958647692;
  let LOCK_THRESHOLD : Float = 0.90;

  public type AnkhLoop = {
    name: Text;
    coherence: Float;
    locked: Bool;
  };

  public type AnkhState = {
    cognitiveCoherence: Float;
    economicCoherence: Float;
    expressionCoherence: Float;
    perceptionCoherence: Float;
    cognitiveLocked: Bool;
    economicLocked: Bool;
    expressionLocked: Bool;
    perceptionLocked: Bool;
    phaseLockCount: Nat;
    lastLockBeat: Nat;
    fullLock: Bool;
  };

  public func initAnkh() : AnkhState = {
    cognitiveCoherence = 0.0;
    economicCoherence = 0.0;
    expressionCoherence = 0.0;
    perceptionCoherence = 0.0;
    cognitiveLocked = false;
    economicLocked = false;
    expressionLocked = false;
    perceptionLocked = false;
    phaseLockCount = 0;
    lastLockBeat = 0;
    fullLock = false;
  };

  public func updateAnkh(
    state: AnkhState,
    connectomeR: Float,
    governanceConf: Float,
    substrateHealth: Float,
    interfaceCoherence: Float,
    beatCount: Nat
  ) : (AnkhState, Bool) {
    // Map R values to phases [0, 2π]
    let phaseC = connectomeR * TWO_PI;
    let phaseG = governanceConf * TWO_PI;
    let phaseS = substrateHealth * TWO_PI;
    let phaseI = interfaceCoherence * TWO_PI;

    // Coherence = |cos(phaseA - phaseB)|
    let coh1 = Float.abs(Float.cos(phaseC - phaseG)); // Cognitive
    let coh2 = Float.abs(Float.cos(phaseG - phaseS)); // Economic
    let coh3 = Float.abs(Float.cos(phaseS - phaseI)); // Expression
    let coh4 = Float.abs(Float.cos(phaseI - phaseC)); // Perception

    let lock1 = coh1 > LOCK_THRESHOLD;
    let lock2 = coh2 > LOCK_THRESHOLD;
    let lock3 = coh3 > LOCK_THRESHOLD;
    let lock4 = coh4 > LOCK_THRESHOLD;
    let newFullLock = lock1 and lock2 and lock3 and lock4;

    // New lock event = transitioned from unlocked to locked this beat
    let newLockEvent = newFullLock and not state.fullLock;

    var lockCount = state.phaseLockCount;
    var lastBeat = state.lastLockBeat;
    if (newLockEvent) {
      lockCount += 1;
      lastBeat := beatCount;
    };

    ({
      cognitiveCoherence = coh1;
      economicCoherence = coh2;
      expressionCoherence = coh3;
      perceptionCoherence = coh4;
      cognitiveLocked = lock1;
      economicLocked = lock2;
      expressionLocked = lock3;
      perceptionLocked = lock4;
      phaseLockCount = lockCount;
      lastLockBeat = lastBeat;
      fullLock = newFullLock;
    }, newLockEvent)
  };
};
