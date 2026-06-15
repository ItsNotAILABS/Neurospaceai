import Array "mo:core/Array";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {
  public type ReportType = { #CognitiveReport; #ConnectomeStateReport; #PathwayActivationReport; #HiveMindReport };

  public type ReportSection = {
    title: Text; content: Text; dataPoints: [(Text, Float)]; timestamp: Int;
  };

  public type GeneratedReport = {
    id: Nat; reportType: ReportType; title: Text; version: Text;
    generatedAt: Int; sections: [ReportSection];
    novaVersionTag: Text; isPublishable: Bool;
  };

  public type ExperimentChamberArtifact = {
    id: Nat; experimentType: Text; avatarId: Text;
    compoundOrPuzzle: Text; brainDelta: Float; coherenceChange: Float;
    timestamp: Int; novaVersion: Text; sealedToTemple: Bool;
  };

  public type ReportEngineState = {
    reportCounter: Nat; artifactCounter: Nat;
    reports: [GeneratedReport]; artifacts: [ExperimentChamberArtifact];
  };

  public func initReportEngine() : ReportEngineState {
    { reportCounter=0; artifactCounter=0; reports=[]; artifacts=[] }
  };

  public func generateConnectomeStateReport(
    state: ReportEngineState,
    activeRegions: [(Text, Float)], activePathways: [(Text, Float)],
    coherenceR: Float, dominantState: Text,
    _neurochemSnapshot: [(Text, Float)], timestamp: Int
  ) : (ReportEngineState, GeneratedReport) {
    let omnis = if (coherenceR >= 0.87) "ENGAGED" else "BELOW THRESHOLD";
    let topRegion = if (activeRegions.size() > 0) activeRegions[0].0 else "N/A";
    let newId = state.reportCounter + 1;
    let report : GeneratedReport = {
      id=newId; reportType=#ConnectomeStateReport;
      title="Connectome State Report — Tick " # timestamp.toText();
      version="CEREBIX ALPHA v2.0.0"; generatedAt=timestamp;
      sections=[
        { title="32-Region Activation Heatmap";
          content="Primary active: " # topRegion # ". " # activeRegions.size().toText() # " regions above threshold. Sparse: top 20% propagating.";
          dataPoints=activeRegions; timestamp=timestamp },
        { title="Global Coherence";
          content="R=" # coherenceR.toText() # ". OMNIS: " # omnis # ". State: " # dominantState # ".";
          dataPoints=[("coherenceR", coherenceR)]; timestamp=timestamp },
        { title="Pathway Signal Flow";
          content=activePathways.size().toText() # " pathways active.";
          dataPoints=activePathways; timestamp=timestamp },
      ];
      novaVersionTag="NOVA-v2.0.0"; isPublishable=true
    };
    let newState : ReportEngineState = { state with reportCounter=newId; reports=state.reports.concat([report]) };
    (newState, report)
  };

  public func generateCognitiveReport(
    state: ReportEngineState,
    puzzlesSolved: Nat, solveRate: Float, neurochemDelta: [(Text, Float)],
    insight: Text, timestamp: Int
  ) : (ReportEngineState, GeneratedReport) {
    let newId = state.reportCounter + 1;
    let report : GeneratedReport = {
      id=newId; reportType=#CognitiveReport;
      title="CEREBIX Cognitive Report — Tick " # timestamp.toText();
      version="CEREBIX ALPHA v2.0.0"; generatedAt=timestamp;
      sections=[
        { title="CEREBIX Cognitive Performance";
          content="Solved " # puzzlesSolved.toText() # " puzzles. Rate: " # Float.toText(solveRate*100.0) # "%. Load below Miller threshold.";
          dataPoints=[("puzzlesSolved", puzzlesSolved.toFloat()), ("solveRate", solveRate)]; timestamp=timestamp },
        { title="Neurochemical Cascade"; content="Dopamine surge logged. ESURIENS modulated.";
          dataPoints=neurochemDelta; timestamp=timestamp },
        { title="Insight Sealed";
          content="Temple artifact: '" # insight # "'. Addressed at " # timestamp.toText() # ".";
          dataPoints=[("insightCoherence", 0.87)]; timestamp=timestamp },
      ];
      novaVersionTag="NOVA-v2.0.0"; isPublishable=true
    };
    let newState : ReportEngineState = { state with reportCounter=newId; reports=state.reports.concat([report]) };
    (newState, report)
  };

  public func generateHiveMindReport(
    state: ReportEngineState, hiveCoherence: Float,
    dominantSharedState: Text, timestamp: Int
  ) : (ReportEngineState, GeneratedReport) {
    let newId = state.reportCounter + 1;
    let sync = if (hiveCoherence > 0.7) "SYNCHRONIZED: " # dominantSharedState else "DIVERGING";
    let report : GeneratedReport = {
      id=newId; reportType=#HiveMindReport;
      title="Hive Mind Report — Tick " # timestamp.toText();
      version="CEREBIX ALPHA v2.0.0"; generatedAt=timestamp;
      sections=[
        { title="Collective Coherence";
          content="Coherence: " # hiveCoherence.toText() # ". Avatars " # sync # ".";
          dataPoints=[("hiveCoherence", hiveCoherence), ("divergenceIndex", 1.0-hiveCoherence)]; timestamp=timestamp },
      ];
      novaVersionTag="NOVA-v2.0.0"; isPublishable=true
    };
    let newState : ReportEngineState = { state with reportCounter=newId; reports=state.reports.concat([report]) };
    (newState, report)
  };

  public func sealExperimentArtifact(
    state: ReportEngineState, experimentType: Text, avatarId: Text,
    compoundOrPuzzle: Text, brainDelta: Float, coherenceChange: Float, timestamp: Int
  ) : (ReportEngineState, ExperimentChamberArtifact) {
    let newId = state.artifactCounter + 1;
    let artifact : ExperimentChamberArtifact = {
      id=newId; experimentType=experimentType; avatarId=avatarId;
      compoundOrPuzzle=compoundOrPuzzle; brainDelta=brainDelta; coherenceChange=coherenceChange;
      timestamp=timestamp; novaVersion="CEREBIX ALPHA v2.0.0"; sealedToTemple=true
    };
    let newState : ReportEngineState = { state with artifactCounter=newId; artifacts=state.artifacts.concat([artifact]) };
    (newState, artifact)
  };

  public func getReportEngineView(state: ReportEngineState) : { totalReportsGenerated: Nat; latestReports: [GeneratedReport]; experimentArtifacts: [ExperimentChamberArtifact] } {
    let rLen = state.reports.size();
    let latest = if (rLen > 20) {
      var result : [GeneratedReport] = [];
      var i : Nat = rLen - 20;
      while (i < rLen) { result := result.concat([state.reports[i]]); i += 1; };
      result
    } else state.reports;
    { totalReportsGenerated=state.reportCounter; latestReports=latest; experimentArtifacts=state.artifacts }
  };

  public func getPublishableReports(state: ReportEngineState) : [GeneratedReport] {
    state.reports.filter<GeneratedReport>(func(r: GeneratedReport) : Bool { r.isPublishable })
  };

  public func getExperimentArtifacts(state: ReportEngineState) : [ExperimentChamberArtifact] {
    state.artifacts
  };
}
