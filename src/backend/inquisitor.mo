import SL "sovereign_laws";
import Float "mo:core/Float";

module {
  // INQUISITOR PERPETUUS — 9th Sovereign Governance Team
  // Auto-generates cognitive tasks when organism hunger exceeds threshold
  // Feeds organism, monitors solutions, seals artifacts on completion
  // Identity: INQUISITOR PERPETUUS — The Ever-Questioning Sovereign Researcher

  public type TaskType = {
    #Math;
    #PatternSynthesis;
    #ContradictionResolve;
    #BiochemEquation;
    #KuramotoOptimize;
    #DoctrineFill;
  };

  public type InquisitorTask = {
    taskId: Nat;
    taskType: TaskType;
    prompt: Text;
    difficulty: Float;
    injectedAt: Nat;
    solved: Bool;
    satisfactionGain: Float;
  };

  public type InquisitorState = {
    activeTask: ?InquisitorTask;
    totalTasksGenerated: Nat;
    totalTasksSolved: Nat;
    currentHungerLevel: Float;
    lastTaskAt: Nat;
    satisfactionLevel: Float;
    loopActive: Bool;
  };

  public let HUNGER_THRESHOLD : Float = 0.60;
  public let MILLERS_LAW : Nat = 7;
  public let SOLVE_WINDOW_BEATS : Nat = 13; // Fibonacci

  public func initInquisitor() : InquisitorState = {
    activeTask = null;
    totalTasksGenerated = 0;
    totalTasksSolved = 0;
    currentHungerLevel = 0.0;
    lastTaskAt = 0;
    satisfactionLevel = 0.5;
    loopActive = true;
  };

  func taskTypeFromBeat(beatCount: Nat) : TaskType {
    let idx = beatCount % 6;
    if (idx == 0) { #Math }
    else if (idx == 1) { #PatternSynthesis }
    else if (idx == 2) { #ContradictionResolve }
    else if (idx == 3) { #BiochemEquation }
    else if (idx == 4) { #KuramotoOptimize }
    else { #DoctrineFill };
  };

  func buildPrompt(tt: TaskType, beatCount: Nat, hungerLevel: Float, kuramotoR: Float) : Text {
    switch tt {
      case (#Math) {
        "INQUISITOR-MATH-" # beatCount.toText() # ": Verify PHI^" # (beatCount % 8).toText() # " against harmonic ladder index " # (beatCount % 8).toText()
      };
      case (#PatternSynthesis) {
        "INQUISITOR-PATTERN-" # beatCount.toText() # ": Ring " # (beatCount % 8).toText() # " coherence R=" # kuramotoR.toText() # " — identify dominant attractor basin"
      };
      case (#ContradictionResolve) {
        "INQUISITOR-CONTRADICTION-" # beatCount.toText() # ": hunger=" # hungerLevel.toText() # " with RESTING behavioral state — resolve metabolic-behavioral paradox"
      };
      case (#BiochemEquation) {
        "INQUISITOR-BIOCHEM-" # beatCount.toText() # ": hunger=" # hungerLevel.toText() # " — predict NAc DA surge timing from foraging initiation to reward peak"
      };
      case (#KuramotoOptimize) {
        "INQUISITOR-KURAMOTO-" # beatCount.toText() # ": current R=" # kuramotoR.toText() # " — compute K coupling needed for R>0.87 in ring " # (beatCount % 8).toText()
      };
      case (#DoctrineFill) {
        "INQUISITOR-DOCTRINE-" # beatCount.toText() # ": beat=" # beatCount.toText() # " — identify which of 17 sovereign laws has lowest compliance score this cycle"
      };
    }
  };

  public func beatInquisitor(
    state: InquisitorState,
    hungerLevel: Float,
    kuramotoR: Float,
    beatCount: Nat,
    workingMemorySlots: Nat
  ) : InquisitorState {
    var newState = state;
    newState := { newState with currentHungerLevel = hungerLevel };

    // Check if active task is solved (13-beat window passed)
    switch (state.activeTask) {
      case (?task) {
        if (beatCount > task.injectedAt + SOLVE_WINDOW_BEATS) {
          // Task solved — organism processed it
          let gain = task.difficulty * kuramotoR;
          let newSat = Float.min(1.0, state.satisfactionLevel + gain);
          newState := {
            newState with
            activeTask = null;
            totalTasksSolved = state.totalTasksSolved + 1;
            satisfactionLevel = newSat;
            lastTaskAt = beatCount;
          };
        };
      };
      case null {
        // Generate new task if hungry enough and working memory has space
        if (hungerLevel > HUNGER_THRESHOLD and workingMemorySlots < MILLERS_LAW) {
          let tt = taskTypeFromBeat(beatCount);
          // Difficulty scales with organism coherence: 1.0 base + 0.39 × R (session learning rate)
          let difficulty = 1.0 + (0.39 * kuramotoR);
          let prompt = buildPrompt(tt, beatCount, hungerLevel, kuramotoR);
          let newTask : InquisitorTask = {
            taskId = state.totalTasksGenerated + 1;
            taskType = tt;
            prompt = prompt;
            difficulty = difficulty;
            injectedAt = beatCount;
            solved = false;
            satisfactionGain = 0.0;
          };
          newState := {
            newState with
            activeTask = ?newTask;
            totalTasksGenerated = state.totalTasksGenerated + 1;
            lastTaskAt = beatCount;
          };
        };
      };
    };

    newState
  };

  public func getInquisitorReport(state: InquisitorState) : Text {
    let taskStr = switch (state.activeTask) {
      case (?t) "ACTIVE:" # t.prompt;
      case null "IDLE — hunger=" # state.currentHungerLevel.toText();
    };
    "INQUISITOR-PERPETUUS | gen=" # state.totalTasksGenerated.toText() # " solved=" # state.totalTasksSolved.toText() # " sat=" # state.satisfactionLevel.toText() # " | " # taskStr
  };
};
