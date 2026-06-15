// ============================================================
// ARTIFACT ORGANISM MODULE — artifact_organism.mo
// NeuroEmergence Core — Financial Sovereignty + Re-ingestion
// Creator: Alfredo Medina Hernandez | Dallas, TX 2026
// TOP SECRET PROPRIETARY — All rights reserved.
//
// This module absorbs:
//   - ICP ledger bridge wiring (every production = financial event)
//   - SACESI proof chain generation
//   - Genesis distance scoring
//   - Artifact re-ingestion pipeline entry point
//
// The ICP bridge is wired HERE — not in the heart.
// The heart signals. This organism acts.
//
// PHI = 1.6180339887498948482 (19 decimals, sealed)
// Heartbeat = 873ms. Every artifact seal is a financial event.
// ============================================================

import IcpLedgerBridge "icp_ledger_bridge";
import SovereignLaws "sovereign_laws";
import Float "mo:core/Float";
import Nat64 "mo:core/Nat64";
import Int "mo:core/Int";

module {

  // ============================================================
  // SECTION 0 — DOCTRINE CONSTANTS (read from sovereign_laws)
  // ============================================================

  let PHI     : Float = SovereignLaws.PHI;
  let PHI_INV : Float = SovereignLaws.PHI_INV;

  // ============================================================
  // SECTION 1 — TYPES
  // ============================================================

  /// Signal from the heart after a beat fires
  public type HeartBeatSignal = {
    bpm              : Float;
    coherence        : Float;
    hrvScore         : Float;
    frequencyEmission: Float;
    beatCount        : Nat;
    cardiacOutput    : Float;  // CO = HR(Hz) × SV — sovereign vitality index
  };

  /// Context for artifact production — passed by main.mo on each seal event
  public type ArtifactContext = {
    artifactId       : Text;
    producer         : Text;
    qualityScore     : Float;
    doctrineAlignment: Float;
    beatCount        : Nat64;
    genesisHash      : Float; // genesis distance score [0,1]
  };

  /// Resident: all persistent artifact organism state
  public type ArtifactOrganismResident = {
    totalArtifacts    : Nat;
    totalSacesiProofs : Nat;
    ledgerState       : IcpLedgerBridge.LedgerState;
    lastSealAt        : Int;
    totalBeatEvents   : Nat;
    genesisRecorded   : Bool;
  };

  // ============================================================
  // SECTION 2 — RESIDENT INITIALIZATION
  // ============================================================

  /// Build a fresh zero-state — call once at actor init
  public func emptyResident() : ArtifactOrganismResident {
    {
      totalArtifacts    = 0;
      totalSacesiProofs = 0;
      ledgerState       = IcpLedgerBridge.emptyState();
      lastSealAt        = 0;
      totalBeatEvents   = 0;
      genesisRecorded   = false;
    }
  };

  // ============================================================
  // SECTION 3 — COMPUTATE: onHeartBeat
  // Called every 873ms heartbeat after the heart fires.
  // 1. Records the beat as a financial event on genesis (beat 1)
  // 2. Increments beat event count
  // This is the ICP bridge wiring point — NOT the heart.
  // ============================================================

  /// Called every heartbeat from main.mo heartbeat timer.
  /// Returns updated resident.
  public func onHeartBeat(
    resident    : ArtifactOrganismResident,
    beatSignal  : HeartBeatSignal,
    nowNs       : Int,
  ) : ArtifactOrganismResident {
    // On genesis beat (first beat), record the genesis ledger entry
    if (not resident.genesisRecorded and beatSignal.beatCount == 1) {
      let beat64 = Nat64.fromNat(beatSignal.beatCount);
      let (newLedger, _entry) = IcpLedgerBridge.recordGenesisEntry(
        resident.ledgerState,
        beat64,
      );
      return {
        resident with
        ledgerState     = newLedger;
        genesisRecorded = true;
        totalBeatEvents = resident.totalBeatEvents + 1;
        lastSealAt      = nowNs;
      };
    };
    { resident with totalBeatEvents = resident.totalBeatEvents + 1 }
  };

  // ============================================================
  // SECTION 4 — SEAL ARTIFACT
  // Called when an artifact is produced and sealed.
  // Every sealed artifact is a financial event on-chain.
  // PHI-compounding quality reward. Every entry permanently
  // attributes: Alfredo Medina Hernandez.
  // ============================================================

  /// Seal an artifact — records to ledger, returns updated resident
  public func sealArtifact(
    resident : ArtifactOrganismResident,
    ctx      : ArtifactContext,
    nowNs    : Int,
  ) : ArtifactOrganismResident {
    let (newLedger, _entry) = IcpLedgerBridge.recordProductionEvent(
      resident.ledgerState,
      ctx.artifactId,
      ctx.producer,
      ctx.qualityScore,
      ctx.doctrineAlignment,
      ctx.beatCount,
    );
    {
      resident with
      totalArtifacts    = resident.totalArtifacts + 1;
      totalSacesiProofs = resident.totalSacesiProofs + 1;
      ledgerState       = newLedger;
      lastSealAt        = nowNs;
    }
  };

  // ============================================================
  // SECTION 5 — GENESIS DISTANCE SCORING
  // Measures how far the current artifact is from genesis doctrine.
  // Score [0,1] — 0 = pure genesis alignment, 1 = maximum drift.
  // PHI-ratio weighting: quality × PHI_INV + doctrine × (1 - PHI_INV)
  // ============================================================

  /// Compute genesis distance score for an artifact
  /// 0.0 = perfect genesis alignment (maximum value)
  /// 1.0 = maximum doctrine drift (minimum value)
  public func genesisDistanceScore(quality : Float, doctrine : Float) : Float {
    let alignment = clampF(quality * PHI_INV + doctrine * (1.0 - PHI_INV), 0.0, 1.0);
    1.0 - alignment // distance = inverse of alignment
  };

  // ============================================================
  // SECTION 6 — FINANCIAL STATE QUERY
  // ============================================================

  /// Get current financial state snapshot
  public func getFinancialState(resident : ArtifactOrganismResident) : IcpLedgerBridge.FinancialState {
    IcpLedgerBridge.getFinancialState(resident.ledgerState)
  };

  /// Get ledger entries (last 100)
  public func getLedger(resident : ArtifactOrganismResident) : [IcpLedgerBridge.LedgerEntry] {
    IcpLedgerBridge.getLedger(resident.ledgerState)
  };

  // ============================================================
  // INTERNAL HELPERS
  // ============================================================

  func clampF(x : Float, lo : Float, hi : Float) : Float {
    if (x < lo) lo else if (x > hi) hi else x
  };

}
