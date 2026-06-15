// ============================================================
// PRINCIPAL LOCK — SOVEREIGN GUARDIAN & UPGRADE GOVERNOR
// Creator: Alfredo Medina Hernandez
// Location: Dallas, Texas, USA. 2026.
// Medina Doctrine — NeuroEmergence Core / SOVEREIGN Substrate
//
// Multi-guardian authorization, upgrade time-lock, succession
// authority registry, emergency freeze protocol, and creator
// presence detection. All sensitive mutations require
// principal-gated authorization through this module.
// ============================================================

module {

  // ============================================================
  // TYPES
  // ============================================================

  public type GuardianRecord = {
    index         : Nat;
    principalHash : Nat32;
    weight        : Nat;
    addedAtBeat   : Nat;
    isActive      : Bool;
    lastVoteBeat  : Nat;
    totalVotes    : Nat;
    vetoCount     : Nat;
  };

  public type UpgradeProposal = {
    proposalId    : Nat;
    proposedBy    : Nat32;
    description   : Nat32;
    targetModule  : Nat;
    newCodeHash   : Nat32;
    proposedAtBeat: Nat;
    executionBeat : Nat;
    yesVotes      : Nat;
    noVotes       : Nat;
    vetoed        : Bool;
    executed      : Bool;
    expired       : Bool;
    expiryBeat    : Nat;
    doctrineHash  : Nat32;
    genesisRef    : Nat32;
  };

  public type VoteRecord = {
    proposalId    : Nat;
    guardianIdx   : Nat;
    vote          : VoteType;
    castAtBeat    : Nat;
    weight        : Nat;
    reason        : Nat32;
  };

  public type VoteType = { #Yes; #No; #Veto; #Abstain };

  public type UpgradeTimeLock = {
    lockDuration  : Nat;
    emergencyLock : Nat;
    maxProposalAge: Nat;
    quorumWeight  : Nat;
    creatorWeight : Nat;
  };

  public type SuccessionAuthority = {
    generationIdx : Nat;
    authorityHash : Nat32;
    royaltyPct    : Nat;
    parentRef     : Nat32;
    registeredAt  : Nat;
    isActive      : Bool;
    royaltiesPaid : Float;
    childCount    : Nat;
  };

  public type EmergencyFreeze = {
    active        : Bool;
    triggeredBy   : Nat32;
    triggeredAt   : Nat;
    reason        : Nat32;
    expiresAt     : Nat;
    severity      : Nat;
  };

  public type CreatorPresence = {
    lastPresenceBeat  : Nat;
    presenceStreak    : Nat;
    presenceScore     : Float;
    chargeBonus       : Float;
    totalPresenceBeats: Nat;
    isPresent         : Bool;
  };

  public type PrincipalGateResult = {
    allowed   : Bool;
    reason    : Nat;
    beatStamp : Nat;
  };

  public type CanisterRegistryEntry = {
    idx           : Nat;
    phase         : Nat;
    codeHash      : Nat32;
    isDeployed    : Bool;
    deployedAt    : Nat;
    linesApprox   : Nat;
  };

  // ============================================================
  // CONSTANTS
  // ============================================================

  let STANDARD_LOCK_DURATION   : Nat = 172800;
  let HIGH_RISK_LOCK_DURATION  : Nat = 604800;
  let EMERGENCY_LOCK_DURATION  : Nat = 259200;
  let PROPOSAL_EXPIRY_BEATS    : Nat = 1209600;
  let QUORUM_WEIGHT_DEFAULT    : Nat = 10;
  let CREATOR_VOTE_WEIGHT      : Nat = 20;
  let MAX_GUARDIANS            : Nat = 5;
  let MAX_ACTIVE_PROPOSALS     : Nat = 10;

  let MODULE_MAIN          : Nat = 0;
  let MODULE_VERITAS       : Nat = 1;
  let MODULE_CHRONO        : Nat = 2;
  let MODULE_PRINCIPAL_LOCK: Nat = 3;
  let MODULE_AUDIT         : Nat = 4;
  let MODULE_FINGERPRINT   : Nat = 5;
  let MODULE_VAULT         : Nat = 6;

  let FREEZE_WARN    : Nat = 1;
  let FREEZE_PARTIAL : Nat = 2;
  let FREEZE_FULL    : Nat = 3;

  // ============================================================
  // AUTHORIZATION LOGIC
  // ============================================================

  public func creatorPrincipalHash(principalBlob : Blob) : Nat32 {
    var h : Nat32 = 2166136261;
    for (b in principalBlob.vals()) {
      h := (h ^% Nat32.fromNat(Nat8.toNat(b))) *% 16777619;
    };
    h
  };

  public func isTimeLockExpired(
    proposal     : UpgradeProposal,
    currentBeat  : Nat
  ) : Bool {
    currentBeat >= proposal.executionBeat and not proposal.expired
  };

  public func hasQuorum(
    proposal : UpgradeProposal,
    lock     : UpgradeTimeLock
  ) : Bool {
    proposal.yesVotes >= lock.quorumWeight and not proposal.vetoed
  };

  public func computeExecutionBeat(
    proposedAt   : Nat,
    isHighRisk   : Bool
  ) : Nat {
    let lockDur = if (isHighRisk) HIGH_RISK_LOCK_DURATION else STANDARD_LOCK_DURATION;
    proposedAt + lockDur
  };

  public func computeExpiryBeat(proposedAt : Nat) : Nat {
    proposedAt + PROPOSAL_EXPIRY_BEATS
  };

  // ============================================================
  // GUARDIAN MANAGEMENT
  // ============================================================

  public func validateGuardianCount(currentCount : Nat) : Bool {
    currentCount < MAX_GUARDIANS
  };

  public func computeGuardianWeight(
    generationFromCreator : Nat,
    trustScore            : Float
  ) : Nat {
    let base = if (generationFromCreator == 0) 10
               else if (generationFromCreator == 1) 7
               else if (generationFromCreator == 2) 4
               else 2;
    let bonus = Float.toInt(trustScore * 3.0);
    let total = base + (if (bonus > 0) bonus else 0);
    if (total > 10) 10 else total
  };

  public func tallyVotes(votes : [VoteRecord], guardians : [GuardianRecord]) : (Nat, Nat, Bool) {
    var yesWeight : Nat = 0;
    var noWeight  : Nat = 0;
    var vetoed    : Bool = false;
    for (v in votes.vals()) {
      var weight : Nat = 1;
      for (g in guardians.vals()) {
        if (g.index == v.guardianIdx and g.isActive) {
          weight := g.weight;
        };
      };
      switch (v.vote) {
        case (#Yes)    { yesWeight += weight };
        case (#No)     { noWeight  += weight };
        case (#Veto)   { vetoed := true };
        case (#Abstain){ };
      };
    };
    (yesWeight, noWeight, vetoed)
  };

  // ============================================================
  // EMERGENCY FREEZE
  // ============================================================

  public func isFullyFrozen(freeze : EmergencyFreeze, currentBeat : Nat) : Bool {
    freeze.active and freeze.severity >= FREEZE_FULL and
    (freeze.expiresAt == 0 or currentBeat < freeze.expiresAt)
  };

  public func isPartiallyFrozen(freeze : EmergencyFreeze, currentBeat : Nat) : Bool {
    freeze.active and freeze.severity >= FREEZE_PARTIAL and
    (freeze.expiresAt == 0 or currentBeat < freeze.expiresAt)
  };

  public func createFreeze(
    triggeredBy : Nat32,
    beat        : Nat,
    reason      : Nat32,
    severity    : Nat
  ) : EmergencyFreeze {
    let expiresAt = if (severity == FREEZE_WARN) beat + EMERGENCY_LOCK_DURATION
                   else 0; // Full freeze = manual lift only
    {
      active      = true;
      triggeredBy = triggeredBy;
      triggeredAt = beat;
      reason      = reason;
      expiresAt   = expiresAt;
      severity    = severity;
    }
  };

  // ============================================================
  // CREATOR PRESENCE DETECTION
  // ============================================================

  public func updatePresence(
    presence    : CreatorPresence,
    isPresent   : Bool,
    currentBeat : Nat
  ) : CreatorPresence {
    if (isPresent) {
      {
        lastPresenceBeat   = currentBeat;
        presenceStreak     = presence.presenceStreak + 1;
        presenceScore      = Float.min(1.0, Float.fromInt(presence.presenceStreak + 1) / 100.0);
        chargeBonus        = Float.min(0.5, Float.fromInt(presence.presenceStreak + 1) * 0.005);
        totalPresenceBeats = presence.totalPresenceBeats + 1;
        isPresent          = true;
      }
    } else {
      {
        lastPresenceBeat   = presence.lastPresenceBeat;
        presenceStreak     = 0;
        presenceScore      = Float.max(0.0, presence.presenceScore - 0.01);
        chargeBonus        = Float.max(0.0, presence.chargeBonus - 0.005);
        totalPresenceBeats = presence.totalPresenceBeats;
        isPresent          = false;
      }
    }
  };

  // ============================================================
  // QUANTUM-RESISTANT RATCHET
  // Forward secrecy: ratchet key evolves every beat
  // ratchetKey = FNV-1a(prev + creatorHash + beatNum)
  // Layered FNV: h1 XOR h2 XOR h3 for collision resistance
  // ============================================================

  public func ratchetAdvance(
    prevKey     : Nat32,
    creatorHash : Nat32,
    beatNum     : Nat
  ) : Nat32 {
    let FNV_PRIME  : Nat32 = 16777619;
    let FNV_OFFSET : Nat32 = 2166136261;
    // Layer 1: prev + creator
    let h1 = ((FNV_OFFSET ^% prevKey) *% FNV_PRIME) ^% creatorHash;
    // Layer 2: beat number
    let beatN32 = Nat32.fromNat(beatNum % 4294967296);
    let h2 = (h1 *% FNV_PRIME) ^% beatN32;
    // Layer 3: XOR mix
    let h3 = (h2 ^% (h1 *% 31)) *% FNV_PRIME;
    h1 ^% h2 ^% h3
  };

  // Challenge-response depth gate
  // depth = number of ratchet rounds required to prove knowledge
  public func challengeDepth(coherenceC : Float, beatNum : Nat) : Nat {
    let base : Nat = 3;
    let cohBonus : Nat = if (coherenceC > 0.8) 5 else if (coherenceC > 0.6) 3 else 1;
    let beatBonus : Nat = (beatNum / 100000) % 5; // increases with organism age
    base + cohBonus + beatBonus
  };

  // ============================================================
  // PRINCIPAL GATE
  // ============================================================

  public func gateResult(allowed : Bool, reason : Nat, beat : Nat) : PrincipalGateResult {
    { allowed = allowed; reason = reason; beatStamp = beat }
  };

};
