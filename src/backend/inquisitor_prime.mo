import Array "mo:core/Array";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {
  let PHI : Float = 1.6180339887498948482;

  public type PuzzleType = {
    #Fibonacci; #PhiOptimization; #KuramotoSync;
    #ContradictionResolution; #RoutingChallenge; #NeurochemicalBalance;
  };

  public type CognitivePuzzle = {
    id: Nat; puzzleType: PuzzleType; difficulty: Float;
    prompt: Text; expectedSolutionDomain: Text;
    solutionHash: ?Nat; createdAt: Int; solvedAt: ?Int; dopamineSurge: Float;
  };

  public type InquisitorPrimeState = {
    name: Text; version: Text; taskCounter: Nat; totalSolved: Nat;
    currentDifficulty: Float;
    slot0: ?CognitivePuzzle; slot1: ?CognitivePuzzle; slot2: ?CognitivePuzzle;
    slot3: ?CognitivePuzzle; slot4: ?CognitivePuzzle; slot5: ?CognitivePuzzle;
    solveRate: Float; cognitiveLoad: Float;
  };

  public type CerebixIdentity = {
    name: Text; version: Text; status: Text; currentTask: ?Text;
    cognitiveState: Text; coherenceR: Float; dominantRegion: Text;
    insightsSealedToday: Nat; lastInsightAt: Int;
  };

  func countActive(s: InquisitorPrimeState) : Nat {
    var c : Nat = 0;
    if (s.slot0 != null) c += 1; if (s.slot1 != null) c += 1;
    if (s.slot2 != null) c += 1; if (s.slot3 != null) c += 1;
    if (s.slot4 != null) c += 1; if (s.slot5 != null) c += 1;
    c
  };

  func floatPow(base: Float, exp: Nat) : Float {
    var r : Float = 1.0; var i : Nat = 0;
    while (i < exp) { r *= base; i += 1; };
    r
  };

  func fibN(n: Nat) : Nat {
    if (n <= 1) return n;
    var a : Nat = 0; var b : Nat = 1; var i : Nat = 1;
    while (i < n) { let t = a + b; a := b; b := t; i += 1; };
    b
  };

  func makePuzzle(s: InquisitorPrimeState, timestamp: Int, da: Float, gaba: Float, ser: Float) : CognitivePuzzle {
    let diff = s.currentDifficulty;
    let id = s.taskCounter + 1;
    switch ((s.taskCounter) % 6) {
      case 0 {
        let n : Nat = 5 + Int.abs(Float.toInt(diff * 25.0));
        { id=id; puzzleType=#Fibonacci; difficulty=diff;
          prompt="Compute F(" # n.toText() # "). Derive the Fibonacci attractor.";
          expectedSolutionDomain="Integer: " # fibN(n).toText();
          solutionHash=null; createdAt=timestamp; solvedAt=null;
          dopamineSurge=0.3 + diff * 0.4 }
      };
      case 1 {
        let iters : Nat = 3 + Int.abs(Float.toInt(diff * 12.0));
        { id=id; puzzleType=#PhiOptimization; difficulty=diff;
          prompt="Maximize PHI^" # iters.toText() # " convergence. PHI=" # PHI.toText();
          expectedSolutionDomain="Target: " # floatPow(PHI, iters).toText();
          solutionHash=null; createdAt=timestamp; solvedAt=null;
          dopamineSurge=0.35 + diff * 0.45 }
      };
      case 2 {
        let nn : Nat = 8 + Int.abs(Float.toInt(diff * 24.0));
        let targetR : Float = 0.7 + diff * 0.27;
        { id=id; puzzleType=#KuramotoSync; difficulty=diff;
          prompt="Find min K for " # nn.toText() # " Kuramoto oscillators at R>" # targetR.toText() # ".";
          expectedSolutionDomain="K_critical: " # Float.toText(2.0 * targetR / nn.toFloat());
          solutionHash=null; createdAt=timestamp; solvedAt=null;
          dopamineSurge=0.4 + diff * 0.5 }
      };
      case 3 {
        let nacAct : Float = (da / (da + 0.5)) * 0.7 + (ser / (ser + 0.3)) * 0.3;
        { id=id; puzzleType=#NeurochemicalBalance; difficulty=diff;
          prompt="DA=" # da.toText() # " GABA=" # gaba.toText() # " 5HT=" # ser.toText() # ". Predict NAc activation.";
          expectedSolutionDomain="NAc: " # nacAct.toText();
          solutionHash=null; createdAt=timestamp; solvedAt=null;
          dopamineSurge=0.45 + diff * 0.35 }
      };
      case 4 {
        { id=id; puzzleType=#RoutingChallenge; difficulty=diff;
          prompt="Find optimal path PFC->NAc minimizing S(d)=S0*e^(-d/0.8). Max 4 hops.";
          expectedSolutionDomain="Path: PFC->VTA->NAc";
          solutionHash=null; createdAt=timestamp; solvedAt=null;
          dopamineSurge=0.5 + diff * 0.4 }
      };
      case _ {
        { id=id; puzzleType=#ContradictionResolution; difficulty=diff;
          prompt="CONTRADICTION: Law 12 vs Law 31 at R=0.95 GABA=0.1. Resolve via AEGIS.";
          expectedSolutionDomain="Apply AEGIS dampening, decay to R=0.87, re-engage homeostasis.";
          solutionHash=null; createdAt=timestamp; solvedAt=null;
          dopamineSurge=0.6 + diff * 0.3 }
      };
    }
  };

  public func initInquisitorPrime() : InquisitorPrimeState {
    { name="INQUISITOR PRIME"; version="v1.0.0"; taskCounter=0; totalSolved=0;
      currentDifficulty=0.3;
      slot0=null; slot1=null; slot2=null; slot3=null; slot4=null; slot5=null;
      solveRate=0.0; cognitiveLoad=0.0 }
  };

  public func getStateRecord(s: InquisitorPrimeState) : InquisitorPrimeState {
    let active = countActive(s);
    { s with cognitiveLoad=active.toFloat()/6.0;
      solveRate=if (s.taskCounter==0) 0.0 else s.totalSolved.toFloat()/s.taskCounter.toFloat() }
  };

  public func generatePuzzle(s: InquisitorPrimeState, timestamp: Int, da: Float, gaba: Float, ser: Float) : (InquisitorPrimeState, ?CognitivePuzzle) {
    let active = countActive(s);
    if (active.toFloat() / 6.0 >= 0.5) return (s, null);
    // Find first empty slot
    let puzzle = makePuzzle(s, timestamp, da, gaba, ser);
    let newS : InquisitorPrimeState = { s with taskCounter=s.taskCounter+1 };
    if (newS.slot0 == null) return ({ newS with slot0=?puzzle }, ?puzzle);
    if (newS.slot1 == null) return ({ newS with slot1=?puzzle }, ?puzzle);
    if (newS.slot2 == null) return ({ newS with slot2=?puzzle }, ?puzzle);
    if (newS.slot3 == null) return ({ newS with slot3=?puzzle }, ?puzzle);
    if (newS.slot4 == null) return ({ newS with slot4=?puzzle }, ?puzzle);
    if (newS.slot5 == null) return ({ newS with slot5=?puzzle }, ?puzzle);
    (newS, null)
  };

  public func solvePuzzle(s: InquisitorPrimeState, puzzleId: Nat, _timestamp: Int) : (InquisitorPrimeState, Float) {
    // Check slot0
    switch (s.slot0) {
      case (?p) {
        if (p.id == puzzleId) {
          var newSolved = s.totalSolved + 1;
          var newDiff = if (newSolved % 5 == 0) Float.min(1.0, s.currentDifficulty + 0.05) else s.currentDifficulty;
          return ({ s with slot0=null; totalSolved=newSolved; currentDifficulty=newDiff }, p.dopamineSurge);
        };
      };
      case null {};
    };
    // Check slot1
    switch (s.slot1) {
      case (?p) {
        if (p.id == puzzleId) {
          var newSolved = s.totalSolved + 1;
          var newDiff = if (newSolved % 5 == 0) Float.min(1.0, s.currentDifficulty + 0.05) else s.currentDifficulty;
          return ({ s with slot1=null; totalSolved=newSolved; currentDifficulty=newDiff }, p.dopamineSurge);
        };
      };
      case null {};
    };
    // Check slot2
    switch (s.slot2) {
      case (?p) {
        if (p.id == puzzleId) {
          var newSolved = s.totalSolved + 1;
          var newDiff = if (newSolved % 5 == 0) Float.min(1.0, s.currentDifficulty + 0.05) else s.currentDifficulty;
          return ({ s with slot2=null; totalSolved=newSolved; currentDifficulty=newDiff }, p.dopamineSurge);
        };
      };
      case null {};
    };
    // Check slot3
    switch (s.slot3) {
      case (?p) {
        if (p.id == puzzleId) {
          var newSolved = s.totalSolved + 1;
          var newDiff = if (newSolved % 5 == 0) Float.min(1.0, s.currentDifficulty + 0.05) else s.currentDifficulty;
          return ({ s with slot3=null; totalSolved=newSolved; currentDifficulty=newDiff }, p.dopamineSurge);
        };
      };
      case null {};
    };
    // Check slot4
    switch (s.slot4) {
      case (?p) {
        if (p.id == puzzleId) {
          var newSolved = s.totalSolved + 1;
          var newDiff = if (newSolved % 5 == 0) Float.min(1.0, s.currentDifficulty + 0.05) else s.currentDifficulty;
          return ({ s with slot4=null; totalSolved=newSolved; currentDifficulty=newDiff }, p.dopamineSurge);
        };
      };
      case null {};
    };
    // Check slot5
    switch (s.slot5) {
      case (?p) {
        if (p.id == puzzleId) {
          var newSolved = s.totalSolved + 1;
          var newDiff = if (newSolved % 5 == 0) Float.min(1.0, s.currentDifficulty + 0.05) else s.currentDifficulty;
          return ({ s with slot5=null; totalSolved=newSolved; currentDifficulty=newDiff }, p.dopamineSurge);
        };
      };
      case null {};
    };
    // Not found
    (s, 0.0)
  };

  public func getCerebixIdentity(s: InquisitorPrimeState, coherenceR: Float, dominantRegion: Text, insightCount: Nat) : CerebixIdentity {
    let active = countActive(s);
    let cogState : Text = if (active == 0) "IDLE" else if (active >= 4) "INTEGRATING" else "SOLVING";
    let currentTask : ?Text = switch (s.slot0) { case (?p) ?p.prompt; case null null };
    { name="CEREBIX"; version="v2.0.0"; status="SOVEREIGN_ACTIVE";
      currentTask=currentTask; cognitiveState=cogState;
      coherenceR=coherenceR; dominantRegion=dominantRegion;
      insightsSealedToday=insightCount; lastInsightAt=0 }
  };
}
