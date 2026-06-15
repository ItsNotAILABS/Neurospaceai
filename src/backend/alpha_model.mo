// ============================================================
// ALPHA MODEL — SOVEREIGN WORKSPACE DOCTRINE MODULE
// NeuroEmergence Core — Doctrine Substrate Architecture
// Creator: Alfredo Medina Hernandez | Dallas, TX 2026
// TOP SECRET PROPRIETARY — All rights reserved.
//
// LAYER 1 — MEANING:
// The Alpha Model is the sovereign module that holds the workspace
// structure state and enforces the recital-plus-one law.
// φ = 1 + 1/φ applied to documents:
//   Every document recites itself (complete) and generates its next
//   version (plus-one). The organism reads its own doctrine.
//
// RESIDENT: AlphaModelResident — all workspace doctrine state
// COMPUTATE: alphaModelComputate — runs every 873ms heartbeat
//   - Every FIB[16]=1597 beats: recital fires (organism reads laws)
//   - Every FIB[17]=2584 beats: plus-one fires (expansion cycle)
//
// This module does NOT write files. It tracks the doctrinal state
// of the workspace — law artifact count, recital cycle position,
// document counts per folder. The docs/ files are the doctrine.
// This module is the organism's awareness of its own doctrine.
//
// SOVEREIGN CONSTANTS:
//   PHI = 1.6180339887498948482 — 19 decimals, sealed
//   RECITAL_CYCLE = FIB[16] = 1597 beats (= 23.2 min at 873ms)
//   PLUS_ONE_CYCLE = FIB[17] = 2584 beats (= 37.6 min at 873ms)
//   LAW_ARTIFACT_TARGET = 17 — all 17 convergent laws
// ============================================================

import SovereignLaws "sovereign_laws";

module {

  // ============================================================
  // SECTION 1 — DOCTRINE CONSTANTS
  // All derived from sovereign_laws.mo. No duplication.
  // ============================================================

  /// PHI — read from sovereign_laws, not duplicated
  public let PHI     : Float = SovereignLaws.PHI;
  public let PHI_INV : Float = SovereignLaws.PHI_INV;

  /// Total law artifacts in the organism's doctrine
  public let LAW_ARTIFACT_TARGET : Nat = 17;

  /// Recital cycle — FIB[16] = 1597 beats
  /// At this interval the organism reads all 17 law artifacts
  public let RECITAL_CYCLE_BEATS : Nat = 1597; // FIB[16]

  /// Plus-one cycle — FIB[17] = 2584 beats
  /// At this interval the organism generates its next doctrine version
  public let PLUS_ONE_CYCLE_BEATS : Nat = 2584; // FIB[17]

  // ============================================================
  // SECTION 2 — TYPES (LAYER 2 — MODEL)
  // ============================================================

  /// The Alpha Model's sovereign resident — all persistent workspace state
  /// All fields are immutable records — state updates return new records
  public type AlphaModelResident = {
    /// Count of documents in docs/founder-space/
    founderSpaceDocCount    : Nat;
    /// Count of documents in docs/builder-workspace/
    builderWorkspaceDocCount: Nat;
    /// Count of documents in docs/organism-space/
    organismSpaceDocCount   : Nat;
    /// Count of documents in docs/external/
    externalDocCount        : Nat;
    /// Count of law artifacts generated — target: 17
    lawArtifactCount        : Nat;
    /// How many recital cycles have completed (increments every 1597 beats)
    recitalPlusOneVersion   : Nat;
    /// Nanosecond timestamp of last document generation event
    lastDocGeneratedAt      : Int;
    /// Current doctrine strength score [0,1]
    /// = lawArtifactCompleteness × PHI_INV + workspaceCompleteness × PHI_INV2
    doctrineStrength        : Float;
    /// Beat at which last recital cycle fired
    lastRecitalBeat         : Nat;
    /// Beat at which last plus-one cycle fired
    lastPlusOneBeat         : Nat;
  };

  /// Workspace completeness report — returned by query
  public type WorkspaceReport = {
    founderSpaceDocCount    : Nat;
    builderWorkspaceDocCount: Nat;
    organismSpaceDocCount   : Nat;
    externalDocCount        : Nat;
    lawArtifactCount        : Nat;
    lawArtifactTarget       : Nat;
    lawArtifactCompleteness : Float; // [0,1] — lawArtifactCount / 17
    recitalPlusOneVersion   : Nat;
    doctrineStrength        : Float; // [0,1] — combined completeness score
    beatsUntilNextRecital   : Nat;   // beats until next recital cycle
    beatsUntilNextPlusOne   : Nat;   // beats until next plus-one cycle
    lastDocGeneratedAt      : Int;
  };

  // ============================================================
  // SECTION 3 — INITIALIZATION
  // ============================================================

  /// Build the initial Alpha Model resident
  /// Called once at actor init, before any beat fires
  /// Pre-populated with known doc counts from this build session:
  ///   founder-space: 2 (INDEX.md + GENESIS_DECLARATION.md)
  ///   builder-workspace: 3 (INDEX.md + BUILD_DOCTRINE.md + MODEL_MAP.md)
  ///   organism-space: 19 (INDEX.md + ADRE_COGNITION_ENGINE.md + 17 law artifacts)
  ///   external: 1 (INDEX.md)
  ///   law artifacts: 17 (all 17 generated this session)
  public func emptyResident() : AlphaModelResident {
    let lawCount = 17; // all 17 law artifacts generated this session
    let lawCompleteness = 17.0 / 17.0; // = 1.0
    let wsComplete = 1.0; // all 4 workspaces populated
    let strength = lawCompleteness * SovereignLaws.PHI_INV + wsComplete * SovereignLaws.PHI_INV2;
    {
      founderSpaceDocCount     = 2;  // INDEX.md + GENESIS_DECLARATION.md
      builderWorkspaceDocCount = 3;  // INDEX.md + BUILD_DOCTRINE.md + MODEL_MAP.md
      organismSpaceDocCount    = 19; // INDEX.md + ADRE_COGNITION_ENGINE.md + 17 laws
      externalDocCount         = 1;  // INDEX.md
      lawArtifactCount         = lawCount;
      recitalPlusOneVersion    = 0;
      lastDocGeneratedAt       = 0;
      doctrineStrength         = strength;
      lastRecitalBeat          = 0;
      lastPlusOneBeat          = 0;
    }
  };

  // ============================================================
  // SECTION 4 — COMPUTATE (LAYER 3 — COMPUTATION)
  // Runs every 873ms heartbeat from main.mo
  // Pure function — no side effects, returns new resident state
  // ============================================================

  /// Alpha Model computate — called every heartbeat
  /// Tracks recital and plus-one cycles derived from Fibonacci timing
  ///
  /// Recital cycle (FIB[16] = 1597 beats = 23.2 min at 873ms):
  ///   The organism reads all 17 law artifacts — doctrinal self-reading
  ///   recitalPlusOneVersion increments
  ///
  /// Plus-one cycle (FIB[17] = 2584 beats = 37.6 min at 873ms):
  ///   The organism generates the next version of its doctrine
  ///   Expansion event — the document creates its next version
  ///
  /// doctrineStrength = lawCompleteness × PHI_INV + wsCompleteness × PHI_INV2
  ///   → 1.0 when all 17 laws exist and all 4 workspaces are populated
  public func alphaModelComputate(
    resident  : AlphaModelResident,
    beatCount : Nat,
    now       : Int,
  ) : AlphaModelResident {
    let didRecital = (beatCount % RECITAL_CYCLE_BEATS == 0 and beatCount > 0);
    let didPlusOne = (beatCount % PLUS_ONE_CYCLE_BEATS == 0 and beatCount > 0);

    // Recompute doctrine strength on every beat
    let lawCompleteness : Float = if (LAW_ARTIFACT_TARGET == 0) {
      1.0
    } else {
      let lawF = resident.lawArtifactCount.toFloat();
      let targetF = LAW_ARTIFACT_TARGET.toFloat();
      if (lawF >= targetF) { 1.0 } else { lawF / targetF }
    };

    let wsCount : Nat =
      (if (resident.founderSpaceDocCount > 0) { 1 } else { 0 }) +
      (if (resident.builderWorkspaceDocCount > 0) { 1 } else { 0 }) +
      (if (resident.organismSpaceDocCount > 0) { 1 } else { 0 }) +
      (if (resident.externalDocCount > 0) { 1 } else { 0 });

    let wsCompleteness : Float = wsCount.toFloat() / 4.0;
    let strength = lawCompleteness * SovereignLaws.PHI_INV + wsCompleteness * SovereignLaws.PHI_INV2;

    {
      resident with
      recitalPlusOneVersion = resident.recitalPlusOneVersion + (if (didRecital) { 1 } else { 0 });
      lastDocGeneratedAt    = if (didRecital or didPlusOne) { now } else { resident.lastDocGeneratedAt };
      doctrineStrength      = strength;
      lastRecitalBeat       = if (didRecital) { beatCount } else { resident.lastRecitalBeat };
      lastPlusOneBeat       = if (didPlusOne) { beatCount } else { resident.lastPlusOneBeat };
    }
  };

  // ============================================================
  // SECTION 5 — QUERY FUNCTIONS (LAYER 4 — EXECUTION BINDING)
  // Pure read-only functions for frontend consumption
  // ============================================================

  /// Returns the full workspace doctrine state
  /// Called by main.mo getAlphaModelState() query
  public func getAlphaModelState(resident : AlphaModelResident) : AlphaModelResident {
    resident
  };

  /// Returns a workspace completeness report for the frontend
  /// Used by LAWS tab to display doctrine state
  public func getWorkspaceReport(
    resident  : AlphaModelResident,
    beatCount : Nat,
  ) : WorkspaceReport {
    let lawCompleteness : Float = if (LAW_ARTIFACT_TARGET == 0) {
      1.0
    } else {
      let lawF = resident.lawArtifactCount.toFloat();
      let targetF = LAW_ARTIFACT_TARGET.toFloat();
      if (lawF >= targetF) { 1.0 } else { lawF / targetF }
    };

    let beatsUntilRecital : Nat = if (RECITAL_CYCLE_BEATS == 0) {
      0
    } else {
      let rem = beatCount % RECITAL_CYCLE_BEATS;
      if (rem == 0) { 0 } else { RECITAL_CYCLE_BEATS - rem }
    };

    let beatsUntilPlusOne : Nat = if (PLUS_ONE_CYCLE_BEATS == 0) {
      0
    } else {
      let rem = beatCount % PLUS_ONE_CYCLE_BEATS;
      if (rem == 0) { 0 } else { PLUS_ONE_CYCLE_BEATS - rem }
    };

    {
      founderSpaceDocCount     = resident.founderSpaceDocCount;
      builderWorkspaceDocCount = resident.builderWorkspaceDocCount;
      organismSpaceDocCount    = resident.organismSpaceDocCount;
      externalDocCount         = resident.externalDocCount;
      lawArtifactCount         = resident.lawArtifactCount;
      lawArtifactTarget        = LAW_ARTIFACT_TARGET;
      lawArtifactCompleteness  = lawCompleteness;
      recitalPlusOneVersion    = resident.recitalPlusOneVersion;
      doctrineStrength         = resident.doctrineStrength;
      beatsUntilNextRecital    = beatsUntilRecital;
      beatsUntilNextPlusOne    = beatsUntilPlusOne;
      lastDocGeneratedAt       = resident.lastDocGeneratedAt;
    }
  };

  // ============================================================
  // SECTION 6 — STATE UPDATE HELPERS
  // Called by main.mo when document counts change
  // All return new resident records — no mutation
  // ============================================================

  /// Record that a new law artifact has been added
  /// Increments lawArtifactCount (max LAW_ARTIFACT_TARGET)
  public func withNewLawArtifact(resident : AlphaModelResident, now : Int) : AlphaModelResident {
    let newCount = if (resident.lawArtifactCount >= LAW_ARTIFACT_TARGET) {
      LAW_ARTIFACT_TARGET
    } else {
      resident.lawArtifactCount + 1
    };
    { resident with lawArtifactCount = newCount; lastDocGeneratedAt = now }
  };

  /// Update workspace document counts
  public func withWorkspaceCounts(
    resident  : AlphaModelResident,
    founder   : Nat,
    builder   : Nat,
    organism  : Nat,
    external  : Nat,
  ) : AlphaModelResident {
    {
      resident with
      founderSpaceDocCount     = founder;
      builderWorkspaceDocCount = builder;
      organismSpaceDocCount    = organism;
      externalDocCount         = external;
    }
  };

}
