import Array "mo:core/Array";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {
  let PHI : Float = 1.6180339887498948482;
  let TWO_PI : Float = 6.283185307179586;

  public type AvatarProfile = { #AXIOM; #PHANTOM; #SENTINEL; #FLUX };

  public type AvatarNeurochemProfile = {
    da: Float; ser: Float; ne: Float; glu: Float; gaba: Float; ach: Float;
  };

  public type AvatarBrainChipState = {
    id: Text; profile: AvatarProfile; phase: Float; amplitude: Float;
    coherenceWithCerebix: Float; dominantRegion: Text;
    neurochemicals: AvatarNeurochemProfile; currentTask: ?Text;
    behavioralState: Text; heartbeatTick: Nat;
  };

  public type HiveMindState = {
    avatars: [AvatarBrainChipState]; hiveCoherence: Float;
    dominantSharedState: Text; divergenceIndex: Float; cerebixPhase: Float;
  };

  func computeCoherence(avatars: [AvatarBrainChipState]) : Float {
    if (avatars.size() == 0) return 0.0;
    var sumCos : Float = 0.0; var sumSin : Float = 0.0;
    for (a in avatars.vals()) { sumCos += Float.cos(a.phase); sumSin += Float.sin(a.phase); };
    let n = avatars.size().toFloat();
    Float.sqrt(sumCos * sumCos + sumSin * sumSin) / n
  };

  func domState(coh: Float) : Text {
    if (coh > 0.7) "SYNCHRONIZED" else if (coh < 0.3) "DIVERGING" else "PARTIAL_SYNC"
  };

  public func initHiveMind() : HiveMindState {
    let avatars : [AvatarBrainChipState] = [
      { id="AXIOM"; profile=#AXIOM; phase=0.0; amplitude=0.7; coherenceWithCerebix=0.5;
        dominantRegion="Prefrontal Cortex";
        neurochemicals={ da=0.8; ser=0.5; ne=0.5; glu=0.6; gaba=0.5; ach=0.8 };
        currentTask=null; behavioralState="OBSERVING"; heartbeatTick=0 },
      { id="PHANTOM"; profile=#PHANTOM; phase=1.5708; amplitude=0.6; coherenceWithCerebix=0.4;
        dominantRegion="Default Mode Network";
        neurochemicals={ da=0.5; ser=0.8; ne=0.4; glu=0.8; gaba=0.3; ach=0.6 };
        currentTask=null; behavioralState="EXPLORING"; heartbeatTick=0 },
      { id="SENTINEL"; profile=#SENTINEL; phase=3.14159; amplitude=0.75; coherenceWithCerebix=0.6;
        dominantRegion="Amygdala";
        neurochemicals={ da=0.5; ser=0.4; ne=0.9; glu=0.6; gaba=0.6; ach=0.5 };
        currentTask=null; behavioralState="VIGILANT"; heartbeatTick=0 },
      { id="FLUX"; profile=#FLUX; phase=4.7124; amplitude=0.65; coherenceWithCerebix=0.45;
        dominantRegion="Anterior Cingulate Cortex";
        neurochemicals={ da=0.7; ser=0.6; ne=0.7; glu=0.9; gaba=0.2; ach=0.7 };
        currentTask=null; behavioralState="ADAPTING"; heartbeatTick=0 },
    ];
    let coh = computeCoherence(avatars);
    { avatars=avatars; hiveCoherence=coh; dominantSharedState=domState(coh);
      divergenceIndex=1.0-coh; cerebixPhase=0.0 }
  };

  public func tickHiveMind(state: HiveMindState, _timestamp: Int) : HiveMindState {
    let K : Float = 0.3;
    let K_cerebix : Float = 0.5;
    let dt : Float = 0.873;
    let n = state.avatars.size().toFloat();
    let omega : Float = TWO_PI * 7.83 * PHI;
    let updatedAvatars = state.avatars.map(
      func(av : AvatarBrainChipState) : AvatarBrainChipState {
        var couplingSum : Float = 0.0;
        for (other in state.avatars.vals()) {
          if (other.id != av.id) { couplingSum += Float.sin(other.phase - av.phase); };
        };
        let cerebixCoupling = K_cerebix * Float.sin(state.cerebixPhase - av.phase);
        let dPhase = (omega + (K / n) * couplingSum + cerebixCoupling) * dt;
        var newPhase = av.phase + dPhase;
        while (newPhase > TWO_PI) { newPhase -= TWO_PI; };
        while (newPhase < 0.0) { newPhase += TWO_PI; };
        let cohCerebix = (1.0 + Float.cos(newPhase - state.cerebixPhase)) / 2.0;
        let bState = if (av.currentTask != null) "SOLVING"
          else if (cohCerebix > 0.7) "SYNCHRONIZED" else "EXPLORING";
        { av with phase=newPhase; coherenceWithCerebix=cohCerebix;
          heartbeatTick=av.heartbeatTick+1; behavioralState=bState }
      }
    );
    let coh = computeCoherence(updatedAvatars);
    { avatars=updatedAvatars; hiveCoherence=coh; dominantSharedState=domState(coh);
      divergenceIndex=1.0-coh; cerebixPhase=state.cerebixPhase }
  };

  public func getAvatarFromState(state: HiveMindState, avatarId: Text) : ?AvatarBrainChipState {
    for (av in state.avatars.vals()) { if (av.id == avatarId) return ?av; };
    null
  };

  public func applyMining(state: HiveMindState, avatarId: Text, mineralType: Text, intensity: Float) : HiveMindState {
    let updated = state.avatars.map(func(av: AvatarBrainChipState) : AvatarBrainChipState {
      if (av.id != avatarId) return av;
      let c = av.neurochemicals;
      let newC : AvatarNeurochemProfile = if (mineralType == "DopamineVein") { { c with da=Float.min(1.0,c.da+intensity*0.1) } }
        else if (mineralType == "SerotoninVein") { { c with ser=Float.min(1.0,c.ser+intensity*0.08) } }
        else if (mineralType == "EndorphinCrystal") { { c with ser=Float.min(1.0,c.ser+intensity*0.05) } }
        else if (mineralType == "CortisolHazard") { { c with ne=Float.min(1.0,c.ne+intensity*0.15) } }
        else if (mineralType == "AcetylcholineOre") { { c with ach=Float.min(1.0,c.ach+intensity*0.09) } }
        else if (mineralType == "GABADeposit") { { c with gaba=Float.min(1.0,c.gaba+intensity*0.07) } }
        else { c };
      { av with neurochemicals=newC; behavioralState="MINING" }
    });
    { state with avatars=updated }
  };

  public func setCerebixPhase(state: HiveMindState, phase: Float) : HiveMindState {
    { state with cerebixPhase=phase }
  };
}
