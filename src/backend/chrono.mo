// ============================================================
// CHRONO — SOVEREIGN TIME, GENESIS LOCK & BEAT LEDGER
// Creator: Alfredo Medina Hernandez
// Location: Dallas, Texas, USA. 2026.
// Medina Doctrine — NeuroEmergence Core / SOVEREIGN Substrate
//
// Phase A canonical time authority. Manages genesis lock
// protocol, beat ledger, temporal compression, jubilee
// countdown, ARES temporal reversal math, and creator
// presence detection. All beats are permanently logged.
// ============================================================

module {

  // ============================================================
  // TYPES
  // ============================================================

  public type GenesisRecord = {
    genesisHash    : Nat32;   // immutable organism genesis hash
    doctrineHash   : Nat32;   // doctrine hash at genesis
    sacesiAtGenesis: Nat32;   // SACESI signature at lock
    lockedAtBeat   : Nat;     // beat number when locked
    lockTimestamp  : Int;     // ICP nanosecond timestamp
    creatorIndex   : Nat32;   // numeric only, zero-exposure
    isLocked       : Bool;    // true = immutable forever
    chainRoot      : Nat32;   // root of the beat chain
    genesisVersion : Nat;     // version of genesis protocol (1=Phase A)
  };

  public type BeatRecord = {
    beatNum    : Nat;     // beat number
    stateHash  : Nat32;  // FNV hash of key state at this beat
    coherence  : Nat32;  // coherence * 1000000 as Nat32
    mintEvent  : Bool;   // was a mint event this beat?
    lawFires   : Nat;    // number of laws that fired
    entropy    : Nat32;  // entropy * 1000000 as Nat32
  };

  public type BeatLedger = {
    totalBeats : Nat;
    lastBeat   : BeatRecord;
    rollingHash: Nat32;   // rolling FNV chain of all beat hashes
    genesisRef : Nat32;   // reference to genesis hash
  };

  // Temporal compression: fold N beats into a summary
  public type TemporalFold = {
    fromBeat     : Nat;
    toBeat       : Nat;
    beatCount    : Nat;
    foldedHash   : Nat32;  // FNV-folded hash of all beats in range
    avgCoherence : Nat32;  // average coherence * 1000000
    mintCount    : Nat;    // total mints in range
    maxCoherence : Nat32;  // peak coherence in range
    minCoherence : Nat32;  // trough coherence in range
    netEffect    : Float;  // net effect score across the fold
  };

  // Jubilee: every JUBILEE_PERIOD beats, a Jubilee event fires
  // Jubilee resets streak multiplier cap, boosts all reserves
  public type JubileeState = {
    periodBeats   : Nat;    // beats per jubilee cycle
    currentCycle  : Nat;    // current jubilee cycle number
    nextJubilee   : Nat;    // beat when next jubilee fires
    lastJubilee   : Nat;    // beat when last jubilee fired
    totalJubilees : Nat;    // total jubilee events fired
    jubileeReward : Float;  // reward issued on last jubilee
    jackpotMulti  : Float;  // jackpot multiplier (compounds each cycle)
  };

  public type TemporalDilationState = {
    isActive        : Bool;
    dilationFactor  : Float;  // how many cognitive beats per real beat
    activatedAt     : Nat;    // beat when dilation began
    expiresAt       : Nat;    // beat when dilation ends
    passCount       : Nat;    // total cognitive beats processed
    coherenceAtAct  : Float;  // coherence when activated
    totalDilations  : Nat;    // lifetime dilation activations
  };

  // ARES temporal reversal state
  // ARES can roll back up to ARES_ROLLBACK_DEPTH beats
  public type ARESState = {
    isActive        : Bool;
    urgency         : Float;  // 0.0-1.0
    threshold       : Float;  // urgency needed to activate
    eventCount      : Nat;    // events processed
    lastEventBeat   : Nat;
    cumulativeImpact: Float;
    rollbackDepth   : Nat;    // how many beats to roll back
    rollbackTarget  : Nat;    // target beat for reversal
    snapshotHash    : Nat32;  // state hash before reversal
    reversalActive  : Bool;   // in middle of reversal
  };

  // Creator presence time-window
  public type PresenceWindow = {
    beatIdx  : Nat;   // modular window index
    present  : Bool;  // was creator present?
    scoreAt  : Float; // presence score at this window
  };

  // Beat history: last N beats (rolling ring buffer)
  public type BeatHistory = {
    records     : [BeatRecord]; // fixed-size ring
    headIdx     : Nat;          // current head
    capacity    : Nat;          // ring size
  };

  // ============================================================
  // CONSTANTS
  // ============================================================

  // Jubilee constants
  public let JUBILEE_PERIOD       : Nat   = 50;      // every 50 beats
  public let JUBILEE_JACKPOT_RATE : Float = 0.05;    // 5% per cycle compounding
  public let JUBILEE_BASE_REWARD  : Float = 0.1;     // base reward on jubilee

  // Temporal dilation constants
  public let DILATION_MIN_COHERENCE : Float = 0.8;  // minimum coherence to activate
  public let DILATION_DURATION      : Nat   = 5;    // dilation lasts 5 real beats
  public let DILATION_MAX_FACTOR    : Float = 6.0;  // maximum cognitive beat multiplier
  public let DILATION_COOLDOWN      : Nat   = 20;   // beats before can re-activate

  // ARES constants
  public let ARES_URGENCY_THRESHOLD : Float = 0.7;  // urgency to trigger reversal
  public let ARES_ROLLBACK_MAX      : Nat   = 5;    // max beats to roll back
  public let ARES_IMPACT_DECAY      : Float = 0.95; // cumulative impact decay rate

  // Beat ledger
  public let BEAT_HISTORY_SIZE  : Nat = 100;  // rolling history slots
  public let TEMPORAL_FOLD_SIZE : Nat = 50;   // fold every 50 beats

  // Phase-Amplitude Coupling period calculation
  // period_k = 1.0 / freq_k seconds
  // In beats (1 beat ~ 1 sec on ICP):
  public let NODE_PERIODS : [Nat] = [
    6,    // node 0: 1/0.15625 ~ 6 beats
    3,    // node 1: 1/0.3125  ~ 3 beats
    2,    // node 2: 1/0.625   ~ 2 beats
    1,    // node 3: 1/1.25    ~ 1 beat
    1,    // node 4: sub-beat
    1,    // node 5: sub-beat
    1,    // node 6: sub-beat
    1,    // node 7: sub-beat
    1,    // node 8: sub-beat
    1,    // node 9: sub-beat
    1,    // node 10: sub-beat
    1     // node 11: sub-beat
  ];

  // ============================================================
  // GENESIS LOCK PROTOCOL
  // ============================================================

  // Initialize a new genesis record (pre-lock state)
  public func initGenesis(
    rawHash     : Nat32,
    docHash     : Nat32,
    creatorIdx  : Nat32,
    currentBeat : Nat
  ) : GenesisRecord {
    {
      genesisHash     = rawHash;
      doctrineHash    = docHash;
      sacesiAtGenesis = 0;     // set at lock time
      lockedAtBeat    = currentBeat;
      lockTimestamp   = 0;     // set at lock time
      creatorIndex    = creatorIdx;
      isLocked        = false;
      chainRoot       = rawHash;
      genesisVersion  = 1;
    }
  };

  // Lock genesis: makes record immutable
  public func lockGenesis(
    record    : GenesisRecord,
    sacesiSig : Nat32,
    timestamp : Int,
    lockBeat  : Nat
  ) : GenesisRecord {
    if (record.isLocked) return record; // already locked, no-op
    {
      genesisHash     = record.genesisHash;
      doctrineHash    = record.doctrineHash;
      sacesiAtGenesis = sacesiSig;
      lockedAtBeat    = lockBeat;
      lockTimestamp   = timestamp;
      creatorIndex    = record.creatorIndex;
      isLocked        = true;
      chainRoot       = record.chainRoot;
      genesisVersion  = record.genesisVersion;
    }
  };

  // Verify genesis record integrity
  public func verifyGenesis(record : GenesisRecord) : Bool {
    record.isLocked and
    record.genesisHash != 0 and
    record.sacesiAtGenesis != 0 and
    record.lockedAtBeat > 0 and
    record.creatorIndex != 0
  };

  // ============================================================
  // BEAT LEDGER
  // ============================================================

  public func createBeatRecord(
    beatNum   : Nat,
    stateHash : Nat32,
    coherence : Float,
    mintEvent : Bool,
    lawFires  : Nat,
    entropy   : Float
  ) : BeatRecord {
    {
      beatNum   = beatNum;
      stateHash = stateHash;
      coherence = Nat32.fromNat(Float.toInt(Float.abs(coherence) * 1000000.0) % 4294967296);
      mintEvent = mintEvent;
      lawFires  = lawFires;
      entropy   = Nat32.fromNat(Float.toInt(Float.abs(entropy) * 1000000.0) % 4294967296);
    }
  };

  // Update the rolling beat ledger
  public func updateBeatLedger(
    ledger    : BeatLedger,
    newRecord : BeatRecord
  ) : BeatLedger {
    let newRolling = ((ledger.rollingHash ^% newRecord.stateHash) *% 16777619);
    {
      totalBeats  = ledger.totalBeats + 1;
      lastBeat    = newRecord;
      rollingHash = newRolling;
      genesisRef  = ledger.genesisRef;
    }
  };

  public func initBeatLedger(genesisRef : Nat32) : BeatLedger {
    {
      totalBeats  = 0;
      lastBeat    = { beatNum=0; stateHash=0; coherence=0; mintEvent=false; lawFires=0; entropy=0 };
      rollingHash = genesisRef;
      genesisRef  = genesisRef;
    }
  };

  // ============================================================
  // BEAT HISTORY RING BUFFER
  // ============================================================

  // Update rolling history: insert at head (ring buffer semantics)
  // Given stable var arrays in main.mo, we provide the index computation
  public func nextHistoryIdx(currentIdx : Nat, capacity : Nat) : Nat {
    (currentIdx + 1) % capacity
  };

  // ============================================================
  // TEMPORAL COMPRESSION — Beat Folding
  // ============================================================

  // Create a temporal fold from an array of beat records
  public func foldBeats(
    records   : [BeatRecord],
    fromBeat  : Nat,
    genesisRef: Nat32
  ) : TemporalFold {
    if (records.size() == 0) {
      return {
        fromBeat     = fromBeat; toBeat = fromBeat; beatCount = 0;
        foldedHash   = genesisRef; avgCoherence = 0;
        mintCount    = 0; maxCoherence = 0; minCoherence = 0;
        netEffect    = 0.0;
      };
    };
    var h          = genesisRef;
    var cohSum     : Nat = 0;
    var mintCount  : Nat = 0;
    var maxCoh     : Nat32 = 0;
    var minCoh     : Nat32 = 4294967295;
    var netEff     : Float = 0.0;
    var lastBeat   : Nat   = fromBeat;
    for (r in records.vals()) {
      h := (h ^% r.stateHash) *% 16777619;
      cohSum += Nat32.toNat(r.coherence);
      if (r.mintEvent) mintCount += 1;
      if (r.coherence > maxCoh) maxCoh := r.coherence;
      if (r.coherence < minCoh) minCoh := r.coherence;
      let cohF = Float.fromInt(Nat32.toNat(r.coherence)) / 1000000.0;
      netEff += cohF - 0.5;
      lastBeat := r.beatNum;
    };
    let n = records.size();
    {
      fromBeat     = fromBeat;
      toBeat       = lastBeat;
      beatCount    = n;
      foldedHash   = h;
      avgCoherence = Nat32.fromNat(cohSum / n);
      mintCount    = mintCount;
      maxCoherence = maxCoh;
      minCoherence = if (minCoh == 4294967295) 0 else minCoh;
      netEffect    = netEff / Float.fromInt(n);
    }
  };

  // ============================================================
  // JUBILEE PROTOCOL
  // ============================================================

  public func initJubilee() : JubileeState {
    {
      periodBeats   = JUBILEE_PERIOD;
      currentCycle  = 0;
      nextJubilee   = JUBILEE_PERIOD;
      lastJubilee   = 0;
      totalJubilees = 0;
      jubileeReward = 0.0;
      jackpotMulti  = 1.0;
    }
  };

  // Check if jubilee fires this beat
  public func checkJubilee(state : JubileeState, currentBeat : Nat) : Bool {
    currentBeat >= state.nextJubilee and currentBeat % JUBILEE_PERIOD == 0
  };

  // Compute jubilee reward based on cycle compounding
  // reward = baseReward * jackpotMultiplier * coherence
  public func computeJubileeReward(
    state     : JubileeState,
    coherence : Float
  ) : Float {
    JUBILEE_BASE_REWARD * state.jackpotMulti * coherence
  };

  // Advance jubilee state after firing
  public func advanceJubilee(
    state     : JubileeState,
    firedAt   : Nat,
    reward    : Float
  ) : JubileeState {
    let newMulti = state.jackpotMulti * (1.0 + JUBILEE_JACKPOT_RATE);
    {
      periodBeats   = state.periodBeats;
      currentCycle  = state.currentCycle + 1;
      nextJubilee   = firedAt + JUBILEE_PERIOD;
      lastJubilee   = firedAt;
      totalJubilees = state.totalJubilees + 1;
      jubileeReward = reward;
      jackpotMulti  = if (newMulti > 10.0) 10.0 else newMulti; // cap at 10x
    }
  };

  // Countdown to next jubilee
  public func jubileeCountdown(state : JubileeState, currentBeat : Nat) : Nat {
    if (currentBeat >= state.nextJubilee) 0
    else state.nextJubilee - currentBeat
  };

  // ============================================================
  // TEMPORAL DILATION
  // ============================================================

  public func initTemporalDilation() : TemporalDilationState {
    {
      isActive       = false;
      dilationFactor = 1.0;
      activatedAt    = 0;
      expiresAt      = 0;
      passCount      = 0;
      coherenceAtAct = 0.0;
      totalDilations = 0;
    }
  };

  // Check if dilation can be activated
  public func canActivateDilation(
    state       : TemporalDilationState,
    coherence   : Float,
    currentBeat : Nat
  ) : Bool {
    not state.isActive and
    coherence >= DILATION_MIN_COHERENCE and
    (state.expiresAt == 0 or currentBeat >= state.expiresAt + DILATION_COOLDOWN)
  };

  // Compute dilation factor from coherence
  // factor = 1.0 + (C - 0.8) * 5.0, capped at DILATION_MAX_FACTOR
  public func computeDilationFactor(coherence : Float) : Float {
    if (coherence <= DILATION_MIN_COHERENCE) return 1.0;
    let raw = 1.0 + (coherence - DILATION_MIN_COHERENCE) * 5.0;
    if (raw > DILATION_MAX_FACTOR) DILATION_MAX_FACTOR else raw
  };

  // Activate temporal dilation
  public func activateDilation(
    state       : TemporalDilationState,
    coherence   : Float,
    currentBeat : Nat
  ) : TemporalDilationState {
    let factor = computeDilationFactor(coherence);
    {
      isActive       = true;
      dilationFactor = factor;
      activatedAt    = currentBeat;
      expiresAt      = currentBeat + DILATION_DURATION;
      passCount      = 0;
      coherenceAtAct = coherence;
      totalDilations = state.totalDilations + 1;
    }
  };

  // Update dilation each beat
  public func tickDilation(
    state       : TemporalDilationState,
    currentBeat : Nat
  ) : TemporalDilationState {
    if (not state.isActive) return state;
    if (currentBeat >= state.expiresAt) {
      // Deactivate
      {
        isActive       = false;
        dilationFactor = 1.0;
        activatedAt    = state.activatedAt;
        expiresAt      = state.expiresAt;
        passCount      = state.passCount;
        coherenceAtAct = state.coherenceAtAct;
        totalDilations = state.totalDilations;
      }
    } else {
      let cogPasses = Float.toInt(state.dilationFactor);
      {
        isActive       = true;
        dilationFactor = state.dilationFactor;
        activatedAt    = state.activatedAt;
        expiresAt      = state.expiresAt;
        passCount      = state.passCount + (if (cogPasses > 0) cogPasses else 1);
        coherenceAtAct = state.coherenceAtAct;
        totalDilations = state.totalDilations;
      }
    }
  };

  // Cognitive beats processed due to dilation (used for accelerated compute)
  public func cognitiveBeatsThisTick(state : TemporalDilationState) : Nat {
    if (not state.isActive) return 1;
    let n = Float.toInt(state.dilationFactor);
    if (n <= 0) 1 else n
  };

  // ============================================================
  // ARES TEMPORAL REVERSAL
  // ============================================================

  public func initARES() : ARESState {
    {
      isActive         = false;
      urgency          = 0.0;
      threshold        = ARES_URGENCY_THRESHOLD;
      eventCount       = 0;
      lastEventBeat    = 0;
      cumulativeImpact = 0.0;
      rollbackDepth    = 0;
      rollbackTarget   = 0;
      snapshotHash     = 0;
      reversalActive   = false;
    }
  };

  // Update ARES urgency based on coherence drop and threat events
  public func updateARESUrgency(
    state       : ARESState,
    coherence   : Float,
    threat      : Float,
    currentBeat : Nat
  ) : ARESState {
    let prevCoh = 0.6; // baseline
    let cohDrop = if (coherence < prevCoh) prevCoh - coherence else 0.0;
    let urgencyDelta = cohDrop * 2.0 + threat * 1.0;
    let newUrgency = Float.min(1.0, state.urgency * ARES_IMPACT_DECAY + urgencyDelta);
    {
      isActive         = newUrgency >= state.threshold or state.isActive;
      urgency          = newUrgency;
      threshold        = state.threshold;
      eventCount       = if (urgencyDelta > 0.0) state.eventCount + 1 else state.eventCount;
      lastEventBeat    = if (urgencyDelta > 0.0) currentBeat else state.lastEventBeat;
      cumulativeImpact = state.cumulativeImpact + urgencyDelta;
      rollbackDepth    = state.rollbackDepth;
      rollbackTarget   = state.rollbackTarget;
      snapshotHash     = state.snapshotHash;
      reversalActive   = state.reversalActive;
    }
  };

  // Compute rollback target
  public func computeRollbackTarget(
    currentBeat  : Nat,
    urgency      : Float
  ) : Nat {
    // Higher urgency = deeper rollback
    let depth = Float.toInt(urgency * Float.fromInt(ARES_ROLLBACK_MAX));
    let d = if (depth < 1) 1 else if (depth > ARES_ROLLBACK_MAX) ARES_ROLLBACK_MAX else depth;
    if (currentBeat > d) currentBeat - d else 0
  };

  // Initiate ARES reversal
  public func initiateARESReversal(
    state        : ARESState,
    currentBeat  : Nat,
    snapshotHash : Nat32
  ) : ARESState {
    let depth  = Float.toInt(state.urgency * Float.fromInt(ARES_ROLLBACK_MAX));
    let dClamped = if (depth < 1) 1 else if (depth > ARES_ROLLBACK_MAX) ARES_ROLLBACK_MAX else depth;
    let target = if (currentBeat > dClamped) currentBeat - dClamped else 0;
    {
      isActive         = state.isActive;
      urgency          = state.urgency;
      threshold        = state.threshold;
      eventCount       = state.eventCount;
      lastEventBeat    = state.lastEventBeat;
      cumulativeImpact = state.cumulativeImpact;
      rollbackDepth    = dClamped;
      rollbackTarget   = target;
      snapshotHash     = snapshotHash;
      reversalActive   = true;
    }
  };

  // Clear ARES after reversal completes
  public func clearARES(state : ARESState) : ARESState {
    {
      isActive         = false;
      urgency          = state.urgency * 0.5; // partial decay
      threshold        = state.threshold;
      eventCount       = state.eventCount;
      lastEventBeat    = state.lastEventBeat;
      cumulativeImpact = state.cumulativeImpact;
      rollbackDepth    = 0;
      rollbackTarget   = 0;
      snapshotHash     = state.snapshotHash;
      reversalActive   = false;
    }
  };

  // ============================================================
  // BINARY HIERARCHY OSCILLATION PHASE TRACKING
  // ============================================================
  // Phase of node k at beat b:
  //   phase_k(b) = 2*pi * freq_k * b  (mod 2*pi)
  // Since 2*pi is not available, approximate with Nat32 ring:
  //   phaseInt_k(b) = (b * PHASE_MULT_k) % PHASE_RING
  // PHASE_RING = 2^32 (wraps naturally with Nat32)

  // Phase multipliers for each node (scaled to Nat32 range)
  // mult_k = round(freq_k / MAX_FREQ * PHASE_RING)
  // Normalized so node 11 (320 Hz) uses full ring
  public let PHASE_MULT : [Nat32] = [
    Nat32.fromNat(488782),    // node 0:  0.15625/320 * 2^32
    Nat32.fromNat(977563),    // node 1:  0.3125/320
    Nat32.fromNat(1955126),   // node 2:  0.625/320
    Nat32.fromNat(3910253),   // node 3:  1.25/320
    Nat32.fromNat(7820506),   // node 4:  2.5/320
    Nat32.fromNat(15641012),  // node 5:  5.0/320
    Nat32.fromNat(31282024),  // node 6: 10.0/320
    Nat32.fromNat(62564048),  // node 7: 20.0/320
    Nat32.fromNat(125128096), // node 8: 40.0/320
    Nat32.fromNat(250256192), // node 9: 80.0/320
    Nat32.fromNat(500512384), // node 10: 160.0/320
    Nat32.fromNat(4294967295) // node 11: 320/320 (full ring)
  ];

  // Compute integer phase for node k at beat b
  public func nodePhase(nodeIdx : Nat, beat : Nat) : Nat32 {
    if (nodeIdx >= PHASE_MULT.size()) return 0;
    // Nat32 wraps naturally
    PHASE_MULT[nodeIdx] *% Nat32.fromNat(beat % 4294967296)
  };

  // Approximate cos(phase) using first-order Chebyshev in [0, 2^32)
  // cos_approx(p) in range [-1, 1], returned as Float
  // Uses bit-manipulation approximation:
  //   normalized = phase / 2^32 ∈ [0, 1)
  //   x = 2*normalized ∈ [0, 2) represents angle/pi
  //   cos(x*pi) ≈ 1 - 2*(x mod 2) if x ∈ [0,1), or 2*(x mod 2) - 3 if [1,2)
  public func cosApprox(phase : Nat32) : Float {
    // Normalize to [0, 1)
    let norm = Float.fromInt(Nat32.toNat(phase)) / 4294967296.0;
    let angle = norm * 2.0; // 0..2 represents 0..2*pi in turns
    // Parabolic cosine approximation (accurate enough for PAC)
    if (angle < 0.5) {
      1.0 - 8.0 * angle * angle
    } else if (angle < 1.0) {
      let a = angle - 0.5;
      -1.0 + 8.0 * a * (1.0 - a)
    } else if (angle < 1.5) {
      let a = angle - 1.0;
      -1.0 + 8.0 * a * a
    } else {
      let a = angle - 1.5;
      1.0 - 8.0 * a * (1.0 - a)
    }
  };

  // Phase-Amplitude Coupling: compute amplitude modulation for node k+1
  // driven by phase of node k
  // amp[k+1] := amp[k+1] * (1 + PAC_COEFF * cos(phase[k])) / 2
  public func computePAC(
    baseAmp    : Float,
    driverPhase: Nat32,
    pacCoeff   : Float
  ) : Float {
    let cosVal = cosApprox(driverPhase);
    let modulated = baseAmp * (1.0 + pacCoeff * cosVal) / 2.0;
    // Floor: amplitude never goes below 5% of base
    let floor = baseAmp * 0.05;
    if (modulated < floor) floor else modulated
  };

  // ============================================================
  // TEMPORAL SIGNAL FUNCTIONS
  // ============================================================

  // Hyperbolic discount factor: d(t) = 1 / (1 + k*t)
  // Used in behavioral economics engine (L-Hyperbolic Discounting)
  public func hyperbolicDiscount(kFactor : Float, delay : Nat) : Float {
    let t = Float.fromInt(delay);
    1.0 / (1.0 + kFactor * t)
  };

  // Exponential discount factor: d(t) = r^t
  // Classic economic discounting
  public func exponentialDiscount(rate : Float, delay : Nat) : Float {
    let t = Float.fromInt(delay);
    // rate^t via exp(t * ln(rate))
    let lnRate = if (rate <= 0.0) -10.0 else if (rate >= 1.0) 0.0
                 else Float.log(rate);
    Float.exp(t * lnRate)
  };

  // Beat-indexed value decay: V(t) = V0 * decay^(t - t0)
  // Used for LTM power-law decay
  public func powerLawDecay(
    initialVal  : Float,
    decayConst  : Float,
    beatsElapsed: Nat
  ) : Float {
    if (beatsElapsed == 0) return initialVal;
    let t = Float.fromInt(beatsElapsed);
    initialVal * Float.exp(-(decayConst) * Float.log(1.0 + t))
  };

  // ============================================================
  // IMPORTS
  // ============================================================
  import Nat32  "mo:core/Nat32";
  import Float  "mo:core/Float";
  import Array  "mo:core/Array";
  import Int    "mo:core/Int";

};
