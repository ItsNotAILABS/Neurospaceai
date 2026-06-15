// ============================================================
// BRAIN ROUTING ENGINE — 32-Region Neuroanatomical Routing
// Real neuroscience math: STDP, signal propagation, pathway dynamics
// ============================================================

import Array "mo:core/Array";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Int "mo:core/Int";

module {

  // ============================================================
  // TYPES
  // ============================================================

  public type RegionId = Nat;

  public type RegionState = {
    id : RegionId;
    name : Text;
    activation : Float;        // 0.0–1.0
    baselineHz : Float;          // intrinsic oscillation frequency
    currentHz : Float;           // live frequency
    amplitude : Float;           // oscillation amplitude
    phase : Float;               // 0.0–2π
    energy : Float;              // metabolic energy pool
    neurochemicalProfile : [Float]; // 24-chemical vector
    lastFired : Nat;             // beat timestamp
    saturationCount : Nat;       // consecutive beats > 0.85
    isDampened : Bool;           // homeostatic dampening active
  };

  // ============================================================
  // TYPE ALIASES FOR EXTERNAL MODULES
  // ============================================================

  public type BrainRegion32 = RegionState;
  public type NeuroanatomicalPathway = Pathway;

  // ============================================================
  // MODULE-LEVEL STATE
  // ============================================================

  public func getRoutingState() : RoutingState {
    initializeState()
  };

  public func getActivePathways() : [Pathway] {
    let state = initializeState();
    state.pathways.filter<Pathway>(func(p : Pathway) : Bool { p.weight > 0.1 })
  };

  public type PathwayType = {
    #Excitatory;
    #Inhibitory;
    #Modulatory;
    #Neuromodulatory;
  };

  public type Pathway = {
    source : RegionId;
    target : RegionId;
    pathType : PathwayType;
    weight : Float;              // synaptic strength
    delay : Nat;                 // propagation delay in beats
    plasticityRate : Float;      // STDP learning rate
    lastActive : Nat;
  };

  public type RoutingState = {
    regions : [RegionState];
    pathways : [Pathway];
    globalCoherence : Float;
    lastUpdateBeat : Nat;
  };

  public type SignalPacket = {
    origin : RegionId;
    target : RegionId;
    strength : Float;
    neurochemicalTag : Nat;      // index into 24-chemical vector
    timestamp : Nat;
  };

  public type STDPUpdate = {
    preRegion : RegionId;
    postRegion : RegionId;
    deltaWeight : Float;
    causalWindow : Int;          // ms (positive = pre before post)
  };

  public type RoutingMetrics = {
    activePathways : Nat;
    meanPathwayWeight : Float;
    coherenceIndex : Float;
    dominantRegion : RegionId;
    top3Pathways : [(RegionId, RegionId, Float)];
  };

  // ============================================================
  // CONSTANTS — 32 Regions (16 existing + 16 new)
  // ============================================================

  public let REGION_NAMES : [Text] = [
    // Original 16
    "Prefrontal Cortex", "Hippocampus", "Amygdala", "Anterior Cingulate",
    "Thalamus", "Cerebellum", "Insula", "Basal Ganglia",
    "Temporal Lobe", "Occipital Lobe", "Broca Area", "Default Mode Network",
    "Salience Network", "Enteric Brain", "Reticular Formation", "Corpus Callosum",
    // New 16
    "Nucleus Accumbens", "Ventral Tegmental Area", "Locus Coeruleus", "Raphe Nuclei",
    "Substantia Nigra", "Caudate Nucleus", "Putamen", "Globus Pallidus",
    "Subthalamic Nucleus", "Nucleus Basalis", "Entorhinal Cortex", "Parahippocampal Gyrus",
    "Orbitofrontal Cortex", "Ventromedial PFC", "Dorsolateral PFC", "Superior Colliculus"
  ];

  public let REGION_BASELINE_HZ : [Float] = [
    40.0, 8.0,  6.0,  8.0,   // PFC, Hippocampus, Amygdala, ACC
    10.0, 30.0, 8.0,  20.0,  // Thalamus, Cerebellum, Insula, Basal Ganglia
    10.0, 10.0, 8.0,  10.0,  // Temporal, Occipital, Broca, DMN
    10.0, 3.0,  8.0,  20.0,  // Salience, Enteric, Reticular, Corpus Callosum
    4.0,  4.0,  6.0,  4.0,   // NAc, VTA, LC, Raphe
    4.0,  20.0, 20.0, 20.0,  // Substantia Nigra, Caudate, Putamen, Globus Pallidus
    20.0, 30.0, 8.0,  8.0,   // STN, Nucleus Basalis, Entorhinal, Parahippocampal
    8.0,  8.0,  40.0, 30.0   // OFC, vmPFC, dlPFC, Superior Colliculus
  ];

  // ============================================================
  // 10 REAL NEUROANATOMICAL PATHWAYS
  // ============================================================

  public func initializePathways() : [Pathway] {
    [
      // 1. Mesolimbic pathway (VTA → NAc): reward, dopamine
      { source = 17; target = 16; pathType = #Neuromodulatory; weight = 0.75; delay = 2; plasticityRate = 0.05; lastActive = 0 },
      // 2. Mesocortical pathway (VTA → PFC): motivation, cognition
      { source = 17; target = 0;  pathType = #Neuromodulatory; weight = 0.60; delay = 3; plasticityRate = 0.04; lastActive = 0 },
      // 3. Nigrostriatal pathway (Substantia Nigra → Putamen): movement
      { source = 20; target = 22; pathType = #Excitatory;       weight = 0.80; delay = 1; plasticityRate = 0.03; lastActive = 0 },
      // 4. Serotonergic raphe projections (Raphe → Hippocampus): mood, memory
      { source = 19; target = 1;  pathType = #Neuromodulatory; weight = 0.55; delay = 4; plasticityRate = 0.04; lastActive = 0 },
      // 5. Noradrenergic locus coeruleus → Thalamus: arousal, attention
      { source = 18; target = 4;  pathType = #Neuromodulatory; weight = 0.70; delay = 1; plasticityRate = 0.05; lastActive = 0 },
      // 6. Hippocampal-entorhinal loop (Hippocampus ↔ Entorhinal)
      { source = 1;  target = 26; pathType = #Excitatory;       weight = 0.85; delay = 1; plasticityRate = 0.06; lastActive = 0 },
      { source = 26; target = 1;  pathType = #Excitatory;       weight = 0.80; delay = 1; plasticityRate = 0.06; lastActive = 0 },
      // 7. Cortico-striatal loop (PFC → Caudate → Thalamus → PFC)
      { source = 0;  target = 21; pathType = #Excitatory;       weight = 0.65; delay = 2; plasticityRate = 0.04; lastActive = 0 },
      { source = 21; target = 4;  pathType = #Inhibitory;        weight = 0.70; delay = 1; plasticityRate = 0.03; lastActive = 0 },
      { source = 4;  target = 0;  pathType = #Excitatory;       weight = 0.60; delay = 2; plasticityRate = 0.04; lastActive = 0 },
      // 8. Hyperdirect pathway (PFC → Subthalamic Nucleus): rapid stopping
      { source = 0;  target = 24; pathType = #Excitatory;       weight = 0.90; delay = 1; plasticityRate = 0.02; lastActive = 0 },
      // 9. Default mode network (DMN ↔ Posterior cingulate proxy via ACC)
      { source = 11; target = 3;  pathType = #Excitatory;       weight = 0.50; delay = 3; plasticityRate = 0.03; lastActive = 0 },
      { source = 3;  target = 11; pathType = #Excitatory;       weight = 0.50; delay = 3; plasticityRate = 0.03; lastActive = 0 },
      // 10. Cholinergic basal forebrain → Cortex (Nucleus Basalis → PFC)
      { source = 25; target = 0;  pathType = #Neuromodulatory; weight = 0.65; delay = 2; plasticityRate = 0.04; lastActive = 0 }
    ]
  };

  // ============================================================
  // INITIALIZATION
  // ============================================================

  public func initializeRegions() : [RegionState] {
    Array.tabulate<RegionState>(32, func(i) {
      {
        id = i;
        name = REGION_NAMES[i];
        activation = 0.1;
        baselineHz = REGION_BASELINE_HZ[i];
        currentHz = REGION_BASELINE_HZ[i];
        amplitude = 0.2;
        phase = i.toFloat() * 0.19634954084936207; // i * 2π/32
        energy = 0.5;
        neurochemicalProfile = Array.tabulate<Float>(24, func(_) { 0.1 });
        lastFired = 0;
        saturationCount = 0;
        isDampened = false;
      }
    })
  };

  public func initializeState() : RoutingState {
    {
      regions = initializeRegions();
      pathways = initializePathways();
      globalCoherence = 0.0;
      lastUpdateBeat = 0;
    }
  };

  // ============================================================
  // CORE FUNCTIONS
  // ============================================================

  // Clamp helper
  func clamp(v : Float, lo : Float, hi : Float) : Float {
    if (v < lo) lo else if (v > hi) hi else v
  };

  // 1. Propagate signal along a pathway with delay and decay
  public func propagateSignal(state : RoutingState, packet : SignalPacket, currentBeat : Nat) : RoutingState {
    let targetIdx = packet.target;
    if (targetIdx >= state.regions.size()) return state;

    let targetRegion = state.regions[targetIdx];
    // Find pathway weight
    var pathWeight : Float = 0.1;
    for (p in state.pathways.vals()) {
      if (p.source == packet.origin and p.target == packet.target) {
        pathWeight := p.weight;
      };
    };

    // Delay-decay: signal attenuates with delay
    let delayFactor = Float.exp(-0.1 * Int.toFloat(if (currentBeat > packet.timestamp) currentBeat - packet.timestamp else 0));
    let effectiveStrength = packet.strength * pathWeight * delayFactor;

    // Update target activation
    let newActivation = clamp(targetRegion.activation + effectiveStrength * 0.3, 0.0, 1.0);
    let newEnergy = clamp(targetRegion.energy - effectiveStrength * 0.05, 0.0, 1.0);

    let updatedRegion : RegionState = {
      targetRegion with
      activation = newActivation;
      energy = newEnergy;
      lastFired = currentBeat;
    };

    let newRegions = Array.tabulate(state.regions.size(), func(i) {
      if (i == targetIdx) updatedRegion else state.regions[i]
    });

    { state with regions = newRegions }
  };

  // 2. STDP weight update: causal window determines potentiation or depression
  public func applySTDP(state : RoutingState, preId : RegionId, postId : RegionId, preTime : Nat, postTime : Nat) : RoutingState {
    let dt = postTime.toInt() - preTime.toInt();
    let dtFloat = dt.toFloat();

    // STDP kernel: A+ * exp(-dt/τ+) for dt>0, -A- * exp(dt/τ-) for dt<0
    let aPlus = 0.05;
    let aMinus = 0.03;
    let tauPlus = 20.0;
    let tauMinus = 20.0;

    let deltaWeight = if (dt > 0) {
      aPlus * Float.exp(-dtFloat / tauPlus)
    } else if (dt < 0) {
      -aMinus * Float.exp(dtFloat / tauMinus)
    } else {
      0.0
    };

    let newPathways = Array.tabulate(state.pathways.size(), func(i) {
      let p = state.pathways[i];
      if (p.source == preId and p.target == postId) {
        { p with weight = clamp(p.weight + deltaWeight * p.plasticityRate, 0.0, 1.0) }
      } else { p }
    });

    { state with pathways = newPathways }
  };

  // 3. Compute global coherence across all regions (Kuramoto-like order parameter)
  public func computeGlobalCoherence(state : RoutingState) : Float {
    var sumReal : Float = 0.0;
    var sumImag : Float = 0.0;
    for (r in state.regions.vals()) {
      let w = r.activation;
      sumReal += w * Float.cos(r.phase);
      sumImag += w * Float.sin(r.phase);
    };
    let n = state.regions.size().toFloat();
    Float.sqrt(sumReal * sumReal + sumImag * sumImag) / n
  };

  // 4. Route signal through multiple hops with pathway constraints
  public func routeMultiHop(state : RoutingState, origin : RegionId, target : RegionId, strength : Float, maxHops : Nat, currentBeat : Nat) : RoutingState {
    if (maxHops == 0 or origin == target) return state;

    // Find best next hop: highest weight pathway from current position toward target
    var bestNext : ?RegionId = null;
    var bestWeight : Float = 0.0;

    for (p in state.pathways.vals()) {
      if (p.source == origin and p.weight > bestWeight) {
        // Simple heuristic: prefer pathways that reduce "distance" to target
        let distImprovement = Float.abs(Int.toFloat(if (target > p.target) target - p.target else p.target - target)) < Float.abs(Int.toFloat(if (target > origin) target - origin else origin - target));
        if (distImprovement or p.target == target) {
          bestWeight := p.weight;
          bestNext := ?p.target;
        };
      };
    };

    switch (bestNext) {
      case null { state };
      case (?nextId) {
        let packet : SignalPacket = {
          origin = origin;
          target = nextId;
          strength = strength * bestWeight;
          neurochemicalTag = 0;
          timestamp = currentBeat;
        };
        let s1 = propagateSignal(state, packet, currentBeat);
        routeMultiHop(s1, nextId, target, strength * bestWeight, maxHops - 1, currentBeat)
      };
    }
  };

  // 5. Update all region phases and frequencies (Kuramoto-like local dynamics)
  public func updateRegionDynamics(state : RoutingState, globalCoupling : Float, dt : Float) : RoutingState {
    let newRegions = Array.tabulate(state.regions.size(), func(i) {
      let r = state.regions[i];
      // Natural frequency drift toward baseline
      let freqDrift = (r.baselineHz - r.currentHz) * 0.01;
      // Coupling from connected regions
      var couplingSum : Float = 0.0;
      for (p in state.pathways.vals()) {
        if (p.target == i) {
          let sourceRegion = state.regions[p.source];
          couplingSum += p.weight * Float.sin(sourceRegion.phase - r.phase);
        };
      };
      let newHz = r.currentHz + freqDrift + globalCoupling * couplingSum * dt;
      let newPhase = r.phase + newHz * dt * 0.001; // Hz to rad/ms
      let wrappedPhase = newPhase - Int.abs(Float.toInt(newPhase / 6.283185307179586)).toFloat() * 6.283185307179586;

      { r with
        currentHz = clamp(newHz, 0.5, 100.0);
        phase = wrappedPhase;
      }
    });

    { state with regions = newRegions }
  };

  // 6. Apply homeostatic dampening to saturated regions
  public func applyHomeostaticDampening(state : RoutingState, currentBeat : Nat) : RoutingState {
    let newRegions = Array.tabulate(state.regions.size(), func(i) {
      let r = state.regions[i];
      if (r.activation > 0.85) {
        let newSatCount = r.saturationCount + 1;
        if (newSatCount >= 8 and not r.isDampened) {
          // Trigger dampening: amplitude drops to PHI^(-2) = 0.382
          { r with
            activation = 0.382;
            amplitude = 0.382;
            saturationCount = newSatCount;
            isDampened = true;
            energy = clamp(r.energy + 0.2, 0.0, 1.0); // partial metabolic recovery
          }
        } else if (r.isDampened) {
          // Recovery phase: linear ramp back
          let recoveryRate = 0.05;
          { r with
            activation = clamp(r.activation + recoveryRate, 0.0, 0.8);
            amplitude = clamp(r.amplitude + recoveryRate, 0.0, 0.8);
            saturationCount = if (r.activation < 0.5) 0 else newSatCount;
            isDampened = r.activation < 0.5;
          }
        } else {
          { r with saturationCount = newSatCount }
        }
      } else {
        { r with
          saturationCount = 0;
          isDampened = false;
        }
      }
    });

    { state with regions = newRegions }
  };

  // 7. Compute routing metrics summary
  public func computeRoutingMetrics(state : RoutingState) : RoutingMetrics {
    var activeCount : Nat = 0;
    var weightSum : Float = 0.0;
    var maxActivation : Float = 0.0;
    var dominantIdx : Nat = 0;

    for (r in state.regions.vals()) {
      if (r.activation > 0.3) { activeCount += 1 };
      if (r.activation > maxActivation) {
        maxActivation := r.activation;
        dominantIdx := r.id;
      };
    };

    for (p in state.pathways.vals()) {
      weightSum += p.weight;
    };

    let meanWeight = if (state.pathways.size() > 0) {
      weightSum / state.pathways.size().toFloat()
    } else { 0.0 };

    // Top 3 pathways by weight
    var top3 : [(RegionId, RegionId, Float)] = [];
    for (p in state.pathways.vals()) {
      if (top3.size() < 3 or p.weight > top3[2].2) {
        let newEntry = (p.source, p.target, p.weight);
        top3 := top3.concat([newEntry]);
        // Simple sort descending by weight
        top3 := top3.sort<(RegionId, RegionId, Float)>(func(a, b) {
          if (a.2 > b.2) #less else if (a.2 < b.2) #greater else #equal
        });
        if (top3.size() > 3) {
          top3 := [top3[0], top3[1], top3[2]];
        };
      };
    };

    {
      activePathways = activeCount;
      meanPathwayWeight = meanWeight;
      coherenceIndex = computeGlobalCoherence(state);
      dominantRegion = dominantIdx;
      top3Pathways = top3;
    }
  };

  // 8. Thalamic gating: modulate signal strength based on thalamic activation
  public func applyThalamicGating(state : RoutingState, signal : SignalPacket) : SignalPacket {
    let thalamusIdx : Nat = 4;
    if (thalamusIdx >= state.regions.size()) return signal;
    let thal = state.regions[thalamusIdx];
    // Thalamus acts as a gate: high activation = open gate, low = attenuate
    let gateFactor = clamp(thal.activation * 1.5, 0.1, 1.0);
    { signal with strength = signal.strength * gateFactor }
  };

  // 9. Hippocampal theta modulation: boost signals during theta bursts
  public func applyHippocampalTheta(state : RoutingState, signal : SignalPacket, currentBeat : Nat) : SignalPacket {
    let hippIdx : Nat = 1;
    if (hippIdx >= state.regions.size()) return signal;
    let hipp = state.regions[hippIdx];
    // Theta rhythm ~8 Hz = 125ms period; boost during peak phase
    let thetaPhase = Int.toFloat(currentBeat % 8) / 8.0 * 6.283185307179586;
    let phaseDiff = Float.abs(hipp.phase - thetaPhase);
    let thetaBoost = 1.0 + 0.5 * Float.cos(phaseDiff); // 1.0–1.5x boost
    { signal with strength = signal.strength * clamp(thetaBoost, 1.0, 1.5) }
  };

  // 10. Amygdala threat modulation: suppress non-essential pathways under threat
  public func applyAmygdalaThreatModulation(state : RoutingState, signal : SignalPacket) : SignalPacket {
    let amyIdx : Nat = 2;
    if (amyIdx >= state.regions.size()) return signal;
    let amy = state.regions[amyIdx];
    if (amy.activation > 0.7) {
      // High amygdala = threat state: suppress non-essential signals, boost defensive
      let isDefensive = signal.target == amyIdx or signal.target == 4 or signal.target == 18; // Amygdala, Thalamus, LC
      let threatFactor = if (isDefensive) 1.3 else 0.5;
      { signal with strength = signal.strength * threatFactor }
    } else {
      signal
    }
  };

  // ============================================================
  // FULL UPDATE CYCLE (convenience)
  // ============================================================

  public func runRoutingCycle(state : RoutingState, globalCoupling : Float, currentBeat : Nat) : RoutingState {
    var s = state;
    s := updateRegionDynamics(s, globalCoupling, 1.0);
    s := applyHomeostaticDampening(s, currentBeat);
    s := { s with globalCoherence = computeGlobalCoherence(s); lastUpdateBeat = currentBeat };
    s
  };

};
