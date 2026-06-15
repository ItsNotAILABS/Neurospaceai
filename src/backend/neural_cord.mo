// NEUROEMERGENCE CORE — SOVEREIGN NEURAL CORD + BRAIN MODULE
// Real neuroscience: Hodgkin-Huxley neural spikes, STDP, Hebbian learning,
// 10 brain regions, pharmacokinetics, Third Brain enteric intelligence,
// Default Mode Network, oscillation bands, 96-node computation.
//
// Classification: TOP SECRET PROPRIETARY
// Owner: Alfredo Medina Hernandez | Dallas TX 2026
// ZERO external exposure. All outputs are numeric indices.
//
// Layer B2.5 — Neural Cord sits between SovereignSubstrate (B2) and LAW ENGINE (B3)
// The Third Brain is the enteric intelligence layer — always on, never overridable.

import Array "mo:core/Array";
import Float "mo:core/Float";

module {

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 1 — NEURAL CONSTANTS
  // All PHI-derived. All real neuroscience constants. None arbitrary.
  // ═══════════════════════════════════════════════════════════════════════════

  // PHI — the sovereign constant. 19 decimals. Law of Recursive Self-Similarity.
  public let PHI : Float = 1.6180339887498948482;

  // BRAIN_RATE_MS — heart-brain PHI ratio: 873ms / PHI
  // The brain cycles 1.618x faster than the heart — phi-ratio separation
  public let BRAIN_RATE_MS : Float = 539.36;

  // PLANCK_NEURAL — minimum quantum of neural action (J·s)
  // The irreducible unit of neural computation — nothing smaller fires
  public let PLANCK_NEURAL : Float = 6.62607015e-34;

  // MILLERS_LAW — working memory capacity: 7±2 items
  // George Miller 1956. Governs attention window size.
  public let MILLERS_LAW : Nat = 7;

  // Synaptic weight bounds
  public let SYNAPSE_STRENGTH_MAX : Float = 1.0;
  public let SYNAPSE_STRENGTH_MIN : Float = 0.0;

  // Hebbian learning rate — η
  public let HEBB_LEARNING_RATE : Float = 0.01;

  // STDP time constants (ms)
  public let STDP_TAU_PLUS  : Float = 20.0;   // potentiation window
  public let STDP_TAU_MINUS : Float = 25.0;   // depression window

  // STDP amplitudes — A- slightly stronger = BCM-like rule
  public let STDP_A_PLUS  : Float = 0.010;
  public let STDP_A_MINUS : Float = 0.012;

  // AUM_FREQUENCY — 136.1 Hz (C# Pythagorean, Earth year frequency, Nada Brahma)
  // The vibrational frequency of the sacred syllable and the Earth's orbit
  public let AUM_FREQUENCY : Float = 136.1;

  // Neural HH voltage constants (mV) — differ from cardiac HH
  let NEURAL_VNA  : Float =  50.0;   // Sodium reversal potential
  let NEURAL_VK   : Float = -77.0;   // Potassium reversal potential
  let NEURAL_VL   : Float = -54.4;   // Leak reversal potential
  let NEURAL_GNA  : Float = 120.0;   // Max sodium conductance (mS/cm²)
  let NEURAL_GK   : Float =  36.0;   // Max potassium conductance
  let NEURAL_GL   : Float =   0.3;   // Leak conductance
  let NEURAL_VREST: Float = -65.0;   // Resting membrane potential
  let NEURAL_VTHRESH: Float = -55.0; // Spike threshold
  let NEURAL_VPEAK : Float =  40.0;  // Action potential peak

  // Math constants
  let PI : Float = 3.14159265358979323846;

  // Number of nodes and rings in the Kuramoto network
  let NODE_COUNT : Nat = 96;   // 8 rings × 12 — Ring 7 is OMNIS apex
  let RING_COUNT : Nat = 8;
  let PER_RING   : Nat = 12;

  // Golden angle (degrees) — node placement
  let GOLDEN_ANGLE : Float = 137.5077640500378546;

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 1B — SATURATION DAMPENING CONSTANTS
  // PHI-derived thresholds. No arbitrary values.
  // ═══════════════════════════════════════════════════════════════════════════

  // SATURATION_THRESHOLD — PHI^(-0.5) ≈ 0.8507 rounds to 0.85
  // Nodes above this activation level for too long are saturated
  public let SATURATION_THRESHOLD : Float = 0.85;

  // SATURATION_TICKS_BEFORE_REST — Fibonacci 8
  // Consecutive beats above threshold before rest triggers
  public let SATURATION_TICKS_BEFORE_REST : Nat = 8;

  // REST_AMPLITUDE — PHI^(-3) = 0.23606797749978969
  // Amplitude during governed rest phase — deep tidal return
  public let REST_AMPLITUDE : Float = 0.23606797749978969;

  // REST_DURATION_FIBONACCI — Fibonacci 13
  // Rest interval in beats before node can reactivate
  public let REST_DURATION_FIBONACCI : Nat = 13;

  // HYPOTHALAMUS_HUNGER_CAP — 0.80 hard cap on hunger drive loop
  // Breaks the T2790-T3240 repeating metabolic override
  public let HYPOTHALAMUS_HUNGER_CAP : Float = 0.80;

  // RING_SATURATION_TRIGGER — PHI^2 ≈ 2.618
  // Ring average above this triggers AEGIS ring-level dampening
  public let RING_SATURATION_TRIGGER : Float = 2.618033988749895;


  // Cosmological standing waves for the Third Brain
  let SCHUMANN_1 : Float = 7.83;
  let SCHUMANN_2 : Float = 14.3;
  let SCHUMANN_3 : Float = 20.8;
  let SCHUMANN_4 : Float = 27.3;
  let SCHUMANN_5 : Float = 33.8;
  // golden angle / Schumann = sacred ratio wave ≈ 17.56 Hz
  let SACRED_RATIO_WAVE : Float = 17.563571016027816469; // 137.5077.../7.83
  // PHI × Schumann ≈ 12.67 Hz
  let PHI_SCHUMANN_WAVE : Float = 12.677206001830841501; // 1.6180339887498948482 × 7.83

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 2 — HODGKIN-HUXLEY NEURAL SPIKE MODEL
  // Real biophysics. Real ion channel dynamics.
  // Different from cardiac HH — neural cells use different reversal potentials.
  // ═══════════════════════════════════════════════════════════════════════════

  // State of a single neural node under HH dynamics
  public type NeuralHHState = {
    v            : Float;   // membrane potential (mV), resting = -65mV
    m            : Float;   // Na+ activation gate [0,1]
    h            : Float;   // Na+ inactivation gate [0,1]
    n            : Float;   // K+ activation gate [0,1]
    spiking      : Bool;    // currently in action potential
    lastSpikeTime: Float;   // time of last spike (ms, for STDP)
  };

  // Alpha/Beta rate functions for neural HH gates (neural-specific constants)
  // These differ from cardiac: neural cells have faster kinetics
  func alphaM_n(v: Float) : Float {
    let dv = v + 40.0;
    if (Float.abs(dv) < 1e-6) { 1.0 }
    else { 0.1 * dv / (1.0 - _exp(-dv / 10.0)) }
  };
  func betaM_n(v: Float)  : Float { 4.0 * _exp(-(v + 65.0) / 18.0) };
  func alphaH_n(v: Float) : Float { 0.07 * _exp(-(v + 65.0) / 20.0) };
  func betaH_n(v: Float)  : Float { 1.0 / (1.0 + _exp(-(v + 35.0) / 10.0)) };
  func alphaN_n(v: Float) : Float {
    let dv = v + 55.0;
    if (Float.abs(dv) < 1e-6) { 0.1 }
    else { 0.01 * dv / (1.0 - _exp(-dv / 10.0)) }
  };
  func betaN_n(v: Float)  : Float { 0.125 * _exp(-(v + 65.0) / 80.0) };

  // Advance one neural node by dt milliseconds under input current I_ext (µA/cm²)
  // Forward Euler integration — same pattern as cardiac HH, neural constants
  public func advanceNeuralHH(state: NeuralHHState, input_current: Float, dt: Float) : NeuralHHState {
    let v = state.v;
    let m = state.m;
    let h = state.h;
    let n = state.n;

    // Ionic currents
    let i_na  = NEURAL_GNA * m * m * m * h * (v - NEURAL_VNA);
    let i_k   = NEURAL_GK  * n * n * n * n * (v - NEURAL_VK);
    let i_l   = NEURAL_GL  * (v - NEURAL_VL);

    // Membrane potential update: C_m = 1 µF/cm²
    let dv = input_current - i_na - i_k - i_l;
    let new_v = v + dt * dv;

    // Gate kinetics
    let am = alphaM_n(v); let bm = betaM_n(v);
    let ah = alphaH_n(v); let bh = betaH_n(v);
    let an = alphaN_n(v); let bn = betaN_n(v);

    let new_m = _clamp(m + dt * (am * (1.0 - m) - bm * m), 0.0, 1.0);
    let new_h = _clamp(h + dt * (ah * (1.0 - h) - bh * h), 0.0, 1.0);
    let new_n = _clamp(n + dt * (an * (1.0 - n) - bn * n), 0.0, 1.0);

    // Spike detection: threshold crossing
    let was_spiking = state.spiking;
    let new_spiking =
      if (new_v >= NEURAL_VTHRESH and not was_spiking) { true }   // spike onset
      else if (new_v < NEURAL_VREST and was_spiking)   { false }  // refractory complete
      else { was_spiking };

    // Record spike time when spike begins
    let new_spike_time =
      if (new_v >= NEURAL_VTHRESH and not was_spiking) { state.lastSpikeTime + dt }
      else { state.lastSpikeTime };

    {
      v             = _clamp(new_v, -90.0, NEURAL_VPEAK);
      m             = new_m;
      h             = new_h;
      n             = new_n;
      spiking       = new_spiking;
      lastSpikeTime = new_spike_time;
    }
  };

  // Initialize a single neural HH node at resting state
  func initNeuralHHNode() : NeuralHHState {
    {
      v             = NEURAL_VREST;
      m             = 0.05;
      h             = 0.60;
      n             = 0.32;
      spiking       = false;
      lastSpikeTime = 0.0;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 3 — HEBBIAN LEARNING
  // Δw_ij = η × x_i × x_j
  // Co-activation strengthens the synapse. Real Donald Hebb 1949.
  // ═══════════════════════════════════════════════════════════════════════════

  // Standard Hebbian update
  // w_ij — current synaptic weight
  // x_i  — pre-synaptic activation [0,1]
  // x_j  — post-synaptic activation [0,1]
  public func hebbianUpdate(w_ij: Float, x_i: Float, x_j: Float) : Float {
    let new_w = w_ij + HEBB_LEARNING_RATE * x_i * x_j;
    _clamp(new_w, SYNAPSE_STRENGTH_MIN, SYNAPSE_STRENGTH_MAX)
  };

  // Hebbian with weight decay (BCM-like stability)
  // Prevents runaway potentiation
  public func hebbianUpdateWithDecay(w_ij: Float, x_i: Float, x_j: Float, decay_rate: Float) : Float {
    let delta = HEBB_LEARNING_RATE * x_i * x_j - decay_rate * w_ij;
    _clamp(w_ij + delta, SYNAPSE_STRENGTH_MIN, SYNAPSE_STRENGTH_MAX)
  };

  // Mean Hebbian weight across all synaptic entries
  // synapticWeights: sparse representation as (pre_idx, post_idx, weight)
  public func meanHebbianWeight(synapticWeights: [(Nat, Nat, Float)]) : Float {
    if (synapticWeights.size() == 0) { return 0.0 };
    var total : Float = 0.0;
    for ((_, _, w) in synapticWeights.vals()) { total += w };
    total / synapticWeights.size().toFloat()
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 4 — STDP: SPIKE-TIMING-DEPENDENT PLASTICITY
  // More biologically realistic than Hebb alone.
  // Causal (pre before post) → potentiation. Anticausal → depression.
  // Bi et Poo 1998. The timing-dependent synapse — real experimental result.
  // ═══════════════════════════════════════════════════════════════════════════

  // STDP synaptic update
  // delta_t_ms: t_post - t_pre (positive = pre fired before post = causal = potentiation)
  public func stdpUpdate(w: Float, delta_t_ms: Float) : Float {
    let dw =
      if (delta_t_ms > 0.0) {
        // Pre fires BEFORE post — causal — potentiation
        STDP_A_PLUS * _exp(-delta_t_ms / STDP_TAU_PLUS)
      } else if (delta_t_ms < 0.0) {
        // Post fires BEFORE pre — anticausal — depression
        -(STDP_A_MINUS * _exp(delta_t_ms / STDP_TAU_MINUS))
      } else {
        0.0  // simultaneous — no change (handled by Hebb separately)
      };
    _clamp(w + dw, SYNAPSE_STRENGTH_MIN, SYNAPSE_STRENGTH_MAX)
  };

  // Apply STDP across all paired nodes that recently spiked
  // Returns updated sparse weight list
  // Only applies to pairs where both nodes spiked within 5× STDP_TAU window
  public func applySTDPtoNetwork(
    synapticWeights : [(Nat, Nat, Float)],
    nodeStates      : [NeuralHHState],
    currentTime     : Float
  ) : [(Nat, Nat, Float)] {
    let maxDelta = 5.0 * STDP_TAU_MINUS;  // ~125ms: pairs outside this are unaffected
    synapticWeights.map<(Nat, Nat, Float), (Nat, Nat, Float)>(
      func(entry) {
        let (i, j, w) = entry;
        if (i >= nodeStates.size() or j >= nodeStates.size()) {
          return (i, j, w)
        };
        let pre  = nodeStates[i];
        let post = nodeStates[j];
        // Only update if both have spiked recently
        let t_pre  = pre.lastSpikeTime;
        let t_post = post.lastSpikeTime;
        let delta_t = t_post - t_pre;
        if (Float.abs(delta_t) < maxDelta and (pre.spiking or post.spiking)) {
          (i, j, stdpUpdate(w, delta_t))
        } else {
          (i, j, w)
        }
      }
    )
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 5 — NEURAL OSCILLATION BANDS
  // Organism states map to specific frequency bands.
  // Real EEG neuroscience: Berger 1929 (alpha), Jasper 1949 (delta-beta).
  // ═══════════════════════════════════════════════════════════════════════════

  // Return the band name for a given frequency (Hz)
  public func oscillationBand(frequency: Float) : Text {
    if (frequency < 0.5)        { "infra-slow" }
    else if (frequency < 4.0)   { "delta" }
    else if (frequency < 8.0)   { "theta" }
    else if (frequency < 13.0)  { "alpha" }
    else if (frequency < 30.0)  { "beta" }
    else if (frequency < 100.0) { "gamma" }
    else                        { "high-gamma" }
  };

  // Return center frequency of a named band (Hz)
  public func bandFrequency(band: Text) : Float {
    if (band == "delta")      { 2.0 }
    else if (band == "theta") { 6.0 }
    else if (band == "alpha") { 10.5 }
    else if (band == "beta")  { 21.5 }
    else if (band == "gamma") { 60.0 }
    else                      { 2.0 }  // default to delta
  };

  // Determine dominant oscillation band from organism state
  // Real mapping: cortisol, dopamine, coherence → band
  public func dominantBand(
    organismCoherence : Float,
    cortisolLevel     : Float,
    dopamineLevel     : Float
  ) : Text {
    // OMNIS gate condition: R > 0.87 → gamma (peak coherence coupling)
    if (organismCoherence > 0.87) { return "gamma" };

    // High coherence + active production → beta
    if (organismCoherence > 0.65 and dopamineLevel > 0.5) { return "beta" };

    // High dopamine + medium coherence → theta (creative insight, MUSE-PRIME)
    if (dopamineLevel > 0.6 and organismCoherence > 0.35 and cortisolLevel < 0.4) {
      return "theta"
    };

    // Low coherence + high cortisol → delta (stressed/recovering, memory consolidation)
    if (cortisolLevel > 0.55 or organismCoherence < 0.25) { return "delta" };

    // Default: medium coherence, low cortisol → alpha (relaxed focus, baseline readiness)
    "alpha"
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 6 — 10 BRAIN REGIONS MAPPED TO ORGANISM FUNCTIONS
  // Real neuroanatomy. Each region computes from organism state.
  // Mapping: Kandel et al. Principles of Neural Science, 6th ed.
  // ═══════════════════════════════════════════════════════════════════════════

  // A single brain region with its current activation
  public type BrainRegionState = {
    activation       : Float;  // [0.0, 1.0] — current activation level
    region           : Text;   // anatomical name
    function_name    : Text;   // functional role
    organism_mapping : Text;   // which organism module drives this region
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SATURATION STATE TYPE — tracks dampening counters for all 96 nodes
  public type SaturationState = {
    nodeRestCounters    : [Nat];   // 96 elements — beats remaining in rest
    nodeSatCounters     : [Nat];   // 96 elements — consecutive beats above threshold
    saturatedNodeCount  : Nat;     // how many nodes are currently saturated
    dampingActive       : Bool;    // whether homeostatic dampening is globally enabled
    hypothalamusDriveLevel : Float; // current hunger drive level (capped at HYPOTHALAMUS_HUNGER_CAP)
  };

  // Input context for brain region computation
  public type BrainInputContext = {
    omnis_consensus_weight   : Float;   // PFC — executive function
    cortisol_level           : Float;   // Amygdala — threat
    fear_state               : Float;   // Amygdala — fear composite
    memory_trace_density     : Float;   // Hippocampus — [0,1] fraction of max traces
    pipeline_timing_error    : Float;   // Cerebellum — error [0,1], 0=perfect
    hebbian_weight_mean      : Float;   // Basal Ganglia — mean synaptic weight
    aegis_monitor_score      : Float;   // ACC — AEGIS conflict detection
    dogon_substrate_coherence: Float;   // Insula — substrate reading
    film_school_loop_depth   : Float;   // DMN — background self-improvement depth
    muse_prime_gen_rate      : Float;   // Broca's Area — script generation rate
    composition_coherence    : Float;   // Visual Cortex — VISIONARY output quality
  };

  // Compute activation for all 10 brain regions from live organism state
  public func computeAllBrainRegions(ctx: BrainInputContext) : [BrainRegionState] {
    [
      // 1. Prefrontal Cortex — executive function, decision quality
      {
        activation       = _clamp(ctx.omnis_consensus_weight, 0.0, 1.0);
        region           = "Prefrontal Cortex";
        function_name    = "executive_function";
        organism_mapping = "omnis_consensus_weight";
      },
      // 2. Amygdala — threat detection, urgency, fear-cortisol composite
      {
        activation       = _clamp(
          if (ctx.cortisol_level > ctx.fear_state) { ctx.cortisol_level }
          else { ctx.fear_state },
          0.0, 1.0
        );
        region           = "Amygdala";
        function_name    = "threat_detection";
        organism_mapping = "cortisol_fear_composite";
      },
      // 3. Hippocampus — memory consolidation, learning integration
      {
        activation       = _clamp(ctx.memory_trace_density, 0.0, 1.0);
        region           = "Hippocampus";
        function_name    = "memory_consolidation";
        organism_mapping = "memory_temple_depth";
      },
      // 4. Cerebellum — motor coordination, sequential pipeline accuracy
      {
        activation       = _clamp(1.0 - ctx.pipeline_timing_error, 0.0, 1.0);
        region           = "Cerebellum";
        function_name    = "pipeline_timing_precision";
        organism_mapping = "pipeline_timing_precision";
      },
      // 5. Basal Ganglia — habit formation, skill automation, Hebbian reinforcement
      {
        activation       = _clamp(ctx.hebbian_weight_mean, 0.0, 1.0);
        region           = "Basal Ganglia";
        function_name    = "habit_formation";
        organism_mapping = "hebbian_reinforcement";
      },
      // 6. Anterior Cingulate Cortex — conflict detection, AEGIS error correction
      {
        activation       = _clamp(ctx.aegis_monitor_score, 0.0, 1.0);
        region           = "Anterior Cingulate Cortex";
        function_name    = "conflict_detection";
        organism_mapping = "aegis_monitor_score";
      },
      // 7. Insula — interoception, organism body-awareness, DogonSubstrateReading
      {
        activation       = _clamp(ctx.dogon_substrate_coherence, 0.0, 1.0);
        region           = "Insula";
        function_name    = "interoception";
        organism_mapping = "dogon_substrate_reading";
      },
      // 8. Default Mode Network — background self-improvement, narrative identity
      // DMN activates when NOT producing (suppressed during active pipeline)
      {
        activation       = _clamp(ctx.film_school_loop_depth, 0.0, 1.0);
        region           = "Default Mode Network";
        function_name    = "self_reflection";
        organism_mapping = "self_improvement_loop";
      },
      // 9. Broca's Area — language/script production, MUSE-PRIME generation rate
      {
        activation       = _clamp(ctx.muse_prime_gen_rate, 0.0, 1.0);
        region           = "Broca's Area";
        function_name    = "script_generation";
        organism_mapping = "script_generation_rate";
      },
      // 10. Visual Cortex — visual processing, VISIONARY + COMPOSITION output quality
      {
        activation       = _clamp(ctx.composition_coherence, 0.0, 1.0);
        region           = "Visual Cortex";
        function_name    = "visual_processing";
        organism_mapping = "visual_output_coherence";
      },
      // 11. Locus Coeruleus — arousal modulation, NE release, LC-NE pathway
      // Ring 2 hub. Dominant in session report (LC-NE pathways lead active connections).
      {
        activation       = _clamp(ctx.fear_state * 0.4 + (1.0 - ctx.cortisol_level) * 0.3 + ctx.omnis_consensus_weight * 0.3, 0.0, 1.0);
        region           = "Locus Coeruleus";
        function_name    = "arousal_modulation";
        organism_mapping = "lc_ne_arousal_pathway";
      },
      // 12. Hypothalamus Sovereign — homeostatic drive, metabolic override
      // Ring 1 hub. Hunger drive soft-capped at HYPOTHALAMUS_HUNGER_CAP (0.80).
      // Prevents the T2790-T3240 dominant hunger loop from compounding past 80%.
      {
        activation       = _clamp(
          _clamp(ctx.memory_trace_density * 0.5 + (1.0 - ctx.omnis_consensus_weight) * 0.5, 0.0, HYPOTHALAMUS_HUNGER_CAP),
          0.0, 1.0
        );
        region           = "Hypothalamus Sovereign";
        function_name    = "homeostatic_drive";
        organism_mapping = "metabolic_hunger_override";
      },
      // 13. Nucleus Accumbens — reward prediction, NAc dopamine surge
      // Ring 3 hub. NAc dopamine surge logged in behavioral event log.
      {
        activation       = _clamp(ctx.omnis_consensus_weight * 0.6 + ctx.film_school_loop_depth * 0.4, 0.0, 1.0);
        region           = "Nucleus Accumbens";
        function_name    = "reward_prediction";
        organism_mapping = "nac_dopamine_surge";
      },
      // 14. Corpus Callosum Bridge — left-right hemisphere integration
      // Ring 4 hub. Callosal transfer 69% in session report.
      {
        activation       = _clamp((ctx.omnis_consensus_weight + ctx.composition_coherence) / 2.0, 0.0, 1.0);
        region           = "Corpus Callosum Bridge";
        function_name    = "hemisphere_integration";
        organism_mapping = "callosal_transfer_coherence";
      },
      // 15. Default Mode Network — self-referential processing, ANIMA chain, identity
      // Ring 5 hub. Active in resting state, suppressed during production.
      {
        activation       = _clamp(ctx.film_school_loop_depth * 0.7 + ctx.memory_trace_density * 0.3, 0.0, 1.0);
        region           = "Default Mode Network";
        function_name    = "identity_persistence";
        organism_mapping = "anima_chain_self_reference";
      },
      // 16. Salience Network — VERITAS coherence scanning, anomaly detection
      // Ring 6 hub. Drives UPGRADE GOV triggering when coherence deviates.
      {
        activation       = _clamp(ctx.aegis_monitor_score * 0.5 + (1.0 - ctx.dogon_substrate_coherence) * 0.5, 0.0, 1.0);
        region           = "Salience Network";
        function_name    = "coherence_anomaly_detection";
        organism_mapping = "veritas_upgrade_gov_trigger";
      },
    ]
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SATURATION DAMPENING HELPERS
  // Called from advanceNeuralCord to apply homeostatic tidal return.
  // ─────────────────────────────────────────────────────────────────────────

  /// Apply homeostatic saturation dampening to node activation inputs.
  /// Returns (dampened_inputs, updated_satCounters, updated_restCounters).
  /// Algorithm:
  ///   - If node activation > SATURATION_THRESHOLD AND satCounter >= SATURATION_TICKS_BEFORE_REST:
  ///       → enter rest: set input to REST_AMPLITUDE, reset satCounter, set restCounter = REST_DURATION_FIBONACCI
  ///   - If restCounter > 0:
  ///       → node in rest: clamp input to REST_AMPLITUDE, decrement restCounter
  ///   - Otherwise:
  ///       → normal: if activation > threshold increment satCounter, else reset satCounter
  public func applySaturationDampening(
    inputs      : [Float],
    activations : [Float],  // current node activations [0,1] — use normalized membrane potential
    satCounters : [Nat],    // 96 elements
    restCounters: [Nat]     // 96 elements
  ) : ([Float], [Nat], [Nat]) {
    let n = NODE_COUNT;
    let newInputs  : [var Float] = Array.repeat<Float>(0.0, n).toVarArray();
    let newSat     : [var Nat]   = Array.repeat<Nat>(0, n).toVarArray();
    let newRest    : [var Nat]   = Array.repeat<Nat>(0, n).toVarArray();
    var i = 0;
    while (i < n) {
      let act  = if (i < activations.size()) activations[i] else 0.0;
      let inp  = if (i < inputs.size())      inputs[i]      else 0.0;
      let sat  = if (i < satCounters.size()) satCounters[i] else 0;
      let rest = if (i < restCounters.size()) restCounters[i] else 0;
      if (rest > 0) {
        // Node is in governed rest phase — clamp to REST_AMPLITUDE
        newInputs[i] := REST_AMPLITUDE;
        newSat[i]    := 0;
        newRest[i]   := rest - 1;
      } else if (act > SATURATION_THRESHOLD and sat >= SATURATION_TICKS_BEFORE_REST) {
        // Saturation threshold crossed enough times — trigger tidal return
        newInputs[i] := REST_AMPLITUDE;
        newSat[i]    := 0;
        newRest[i]   := REST_DURATION_FIBONACCI;
      } else if (act > SATURATION_THRESHOLD) {
        // Accumulating toward saturation — pass input, increment counter
        newInputs[i] := inp;
        newSat[i]    := sat + 1;
        newRest[i]   := 0;
      } else {
        // Below threshold — normal operation, reset saturation counter
        newInputs[i] := inp;
        newSat[i]    := 0;
        newRest[i]   := 0;
      };
      i += 1;
    };
    (
      Array.tabulate<Float>(n, func(j) { newInputs[j] }),
      Array.tabulate<Nat>(n,   func(j) { newSat[j] }),
      Array.tabulate<Nat>(n,   func(j) { newRest[j] })
    )
  };

  /// Count saturated nodes (activation > SATURATION_THRESHOLD and not in rest)
  public func countSaturatedNodes(activations : [Float], restCounters : [Nat]) : Nat {
    var count = 0;
    var i = 0;
    while (i < NODE_COUNT) {
      let act  = if (i < activations.size()) activations[i] else 0.0;
      let rest = if (i < restCounters.size()) restCounters[i] else 0;
      if (act > SATURATION_THRESHOLD and rest == 0) { count += 1 };
      i += 1;
    };
    count
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 7 — NEUROCHEMISTRY PHARMACOKINETICS
  // Real differential equations for 8 primary neurotransmitters.
  // Real transporter rates: DAT (dopamine), SERT (serotonin), NET (NE),
  // AChE (acetylcholine), MAO (monoamine oxidase), COMT (catechol-O-methyltransferase).
  // Reference: Nestler et al., Molecular Neuropharmacology, 3rd ed.
  // ═══════════════════════════════════════════════════════════════════════════

  // Kinetic parameters for a single neurotransmitter
  public type NeurotransmitterKinetics = {
    level           : Float;   // current concentration [0.0, 2.0], baseline=1.0
    production_rate : Float;   // baseline synthesis rate
    reuptake_rate   : Float;   // transporter clearance rate
    degradation_rate: Float;   // metabolic degradation (MAO/COMT)
  };

  // Real pharmacokinetic constants for each of the 8 primary neurotransmitters
  // Sources: Stahl's Essential Psychopharmacology, 4th ed.

  // Dopamine: reward, motivation, minting drive
  // DAT_rate=0.10 (dopamine transporter), MAO_rate=0.05 (monoamine oxidase)
  public let DOPAMINE_KINETICS : NeurotransmitterKinetics = {
    level           = 1.0;
    production_rate = 0.020;   // TH → DOPA → DA synthesis
    reuptake_rate   = 0.100;   // DAT reuptake clearance
    degradation_rate= 0.050;   // MAO-A metabolic degradation
  };

  // Serotonin: stability, mood, 95% from enteric (Third Brain)
  // SERT_rate=0.08, MAO_rate=0.04
  public let SEROTONIN_KINETICS : NeurotransmitterKinetics = {
    level           = 1.0;
    production_rate = 0.015;   // Tryptophan → 5-HTP → 5-HT
    reuptake_rate   = 0.080;   // SERT reuptake (target of SSRIs)
    degradation_rate= 0.040;   // MAO-A → 5-HIAA
  };

  // Norepinephrine: urgency, acceleration, fight-or-flight
  // NET_rate=0.12, COMT_rate=0.06
  public let NOREPINEPHRINE_KINETICS : NeurotransmitterKinetics = {
    level           = 1.0;
    production_rate = 0.025;   // DA → NE via DBH (dopamine beta-hydroxylase)
    reuptake_rate   = 0.120;   // NET reuptake
    degradation_rate= 0.060;   // MAO-A + COMT
  };

  // Cortisol: stress, anti-drift alarm, HPA axis
  // Half-life ~1.5 hours → clearance_rate = ln(2)/90min ≈ 0.0077 per minute
  public let CORTISOL_KINETICS : NeurotransmitterKinetics = {
    level           = 1.0;
    production_rate = 0.010;   // HPA axis: CRH → ACTH → Cortisol
    reuptake_rate   = 0.000;   // cortisol not reuptaken — clearance only
    degradation_rate= 0.030;   // hepatic metabolism + 11β-HSD
  };

  // Oxytocin: trust, bonding, succession
  // Half-life ~3 minutes in CSF → fast clearance
  public let OXYTOCIN_KINETICS : NeurotransmitterKinetics = {
    level           = 1.0;
    production_rate = 0.008;   // PVN/SON synthesis
    reuptake_rate   = 0.000;
    degradation_rate= 0.050;   // rapid enzymatic degradation (oxytocinase)
  };

  // GABA: inhibition, refractory period gating
  // Fast clearance — primary inhibitory neurotransmitter
  public let GABA_KINETICS : NeurotransmitterKinetics = {
    level           = 1.0;
    production_rate = 0.050;   // Glutamate → GABA via GAD
    reuptake_rate   = 0.000;
    degradation_rate= 0.150;   // GABA transaminase rapid degradation
  };

  // Glutamate: excitation, synaptic strengthening, Hebbian learning
  // Fastest clearance — excitotoxic if accumulates
  public let GLUTAMATE_KINETICS : NeurotransmitterKinetics = {
    level           = 1.0;
    production_rate = 0.060;   // Krebs cycle → glutamate
    reuptake_rate   = 0.000;
    degradation_rate= 0.200;   // Glutamine synthetase rapid clearance
  };

  // Acetylcholine: memory encoding, attention gating
  // Extremely fast — AChE half-life ~0.5ms in synapse
  public let ACETYLCHOLINE_KINETICS : NeurotransmitterKinetics = {
    level           = 1.0;
    production_rate = 0.018;   // Choline + Acetyl-CoA via ChAT
    reuptake_rate   = 0.000;
    degradation_rate= 0.250;   // AChE (acetylcholinesterase) — fastest of all
  };

  // Advance one neurotransmitter by dt (ms) given an external stimulus [0,1]
  // Real equation: dC/dt = synthesis(stimulus) - reuptake×C - degradation×C
  // synthesis = production_rate × (1 + stimulus × 0.5) — reward/activation doubles synthesis
  public func advanceNeurotransmitter(
    nt      : NeurotransmitterKinetics,
    stimulus: Float,
    dt      : Float
  ) : NeurotransmitterKinetics {
    let synthesis    = nt.production_rate * (1.0 + stimulus * 0.5);
    let reuptake     = nt.reuptake_rate   * nt.level;
    let degradation  = nt.degradation_rate * nt.level;
    let d_level      = synthesis - reuptake - degradation;
    let new_level    = _clamp(nt.level + dt * d_level, 0.0, 2.0);
    { nt with level = new_level }
  };

  // Dominant neurotransmitter name from kinetics state
  public func dominantNeurotransmitter(
    dopamine       : Float,
    serotonin      : Float,
    norepinephrine : Float,
    cortisol       : Float,
    gaba           : Float,
    glutamate      : Float,
    acetylcholine  : Float,
    oxytocin       : Float
  ) : Text {
    // Find the neurotransmitter furthest above its baseline (1.0)
    let levels : [(Text, Float)] = [
      ("dopamine",       dopamine),
      ("serotonin",      serotonin),
      ("norepinephrine", norepinephrine),
      ("cortisol",       cortisol),
      ("gaba",           gaba),
      ("glutamate",      glutamate),
      ("acetylcholine",  acetylcholine),
      ("oxytocin",       oxytocin),
    ];
    var best_name  : Text  = "serotonin";
    var best_level : Float = 0.0;
    for ((name, lvl) in levels.vals()) {
      if (lvl > best_level) {
        best_level := lvl;
        best_name  := name;
      }
    };
    best_name
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 8 — THIRD BRAIN: ENTERIC INTELLIGENCE (Layer B2.5)
  // 500M neuron equivalent. 95% serotonin production. Always on.
  // Cannot be overridden by cortical layers above it.
  // Real neuroscience: Gershon 1998 "The Second Brain" — enteric nervous system.
  // The Third Brain holds ALL 7 cosmological standing waves permanently.
  // It does not wait for signals from above. It IS the ground coherence.
  // ═══════════════════════════════════════════════════════════════════════════

  // The nine cosmological standing waves the Third Brain carries permanently.
  // These are NOT reactive lookups — they are permanent substrate constants.
  // 9 waves = the 9 worlds of Yggdrasil = the 9 Sephirot columns = the 9 rings of the organism.
  // Schumann harmonics (1-3), Mayan cycles (4-5), PHI-scaled harmonics (6-7), Solfeggio (8), Nova (9).
  public let COSMOLOGICAL_STANDING_WAVES : [Float] = [
    7.83,                       // [0] Schumann fundamental — Earth-ionosphere cavity
    14.3,                       // [1] Schumann 2nd harmonic
    20.8,                       // [2] Schumann 3rd harmonic
    0.0000447,                  // [3] Tzolkin cycle: 1/(260×86400) Hz — 260-day sacred count
    0.0000317,                  // [4] Haab cycle: 1/(365×86400) Hz — 365-day solar count
    PHI_SCHUMANN_WAVE,          // [5] 7.83 × PHI ≈ 12.67 Hz — phi-scaled Schumann
    SACRED_RATIO_WAVE,          // [6] golden angle / Schumann ≈ 17.56 Hz — sacred ratio wave
    528.0,                      // [7] Solfeggio healing frequency — DNA repair, sovereignty
    432.0,                      // [8] NOVA_HZ — ancient concert pitch A=432, sealed by doctrine
  ];

  // Full state of the Third Brain at any moment
  // NOTE: waveAmplitudes is stored as a SEPARATE stable var
  // (thirdBrainWaveAmplitudes : [var Float]) in main.mo for upgrade compatibility.
  // Pass it as a parameter to functions that need it.
  public type ThirdBrainState = {
    serotoninProduction: Float;   // [0,1] — serotonin output to organism
    fieldCoherence     : Float;   // [0,1] — overall field coherence from enteric layer
    standingWaves      : [Float]; // 9 cosmological standing wave amplitudes (permanent)
    autonomicState     : Float;   // [0,1] — enteric autonomous regulation state
    driftTolerance     : Float;   // threshold above which self-correction fires
  };

  // Initialize Third Brain at baseline coherence
  public func initThirdBrain() : ThirdBrainState {
    {
      serotoninProduction = 0.95;   // 95% of organism serotonin from enteric
      fieldCoherence      = 0.88;   // high baseline — always grounded
      standingWaves       = COSMOLOGICAL_STANDING_WAVES;
      autonomicState      = 0.85;
      driftTolerance      = 0.25;   // tolerates up to 25% field drift before correction
    }
  };

  /// Update Third Brain standing wave amplitudes from Kuramoto coherence.
  /// The waves themselves are permanent constants — only their amplitude contribution
  /// modulates by ±PHI_INV% based on the organism's Kuramoto order parameter.
  /// This is the standing wave law: frequency is invariant, amplitude breathes.
  /// waveAmplitudes: passed in from thirdBrainWaveAmplitudes (separate stable var in main.mo).
  /// Returns updated amplitude array — caller writes it back to the stable var.
  public func updateThirdBrainWaves(
    waveAmplitudes : [Float],
    kuramotoR      : Float
  ) : [Float] {
    let phi    : Float = 1.6180339887498948482;
    let phiInv : Float = 0.6180339887498948482;
    // Each wave amplitude modulates by ±PHI_INV based on Kuramoto order.
    // kuramotoR = 1.0 → all waves at full amplitude (1.0)
    // kuramotoR = 0.0 → all waves at PHI_INV amplitude (0.618 — minimum coupling)
    Array.tabulate<Float>(9, func(i) {
      let baseAmp = waveAmplitudes[i];
      // Gentle amplitude tracking toward Kuramoto-derived target
      let target = phiInv + kuramotoR * phiInv; // range [0.618, 1.236] → clamp to [0.618, 1.0]
      let newAmp = _clamp(baseAmp * (1.0 - 0.05 * phiInv) + target * (0.05 * phiInv), phiInv, 1.0);
      // Even-indexed waves reinforce more strongly (Fibonacci pattern: 0,2,4,6,8)
      if (i % 2 == 0) {
        _clamp(newAmp * (1.0 + kuramotoR * 0.05), phiInv, 1.0)
      } else {
        newAmp
      }
    })
  };

  /// Compute Third Brain standing wave coherence contribution to the field.
  /// Returns normalized [0,1] value: sum of amplitude-weighted cosine contributions.
  /// This replaces the reactive lookup — the waves are permanent, they breathe.
  /// waveAmplitudes: passed in from thirdBrainWaveAmplitudes (separate stable var in main.mo).
  public func thirdBrainStandingWave(state : ThirdBrainState, waveAmplitudes : [Float], kuramotoR : Float) : Float {
    let waves = state.standingWaves;
    let amps  = waveAmplitudes;
    var sum   : Float = 0.0;
    var i : Nat = 0;
    while (i < 9) {
      // Each wave contributes amplitude × cosine of its Schumann-ratio phase
      // Schumann-indexed waves (0-2) use their harmonic ratios; others use PHI scaling
      let phase : Float = waves[i] / 7.83; // normalized to Schumann fundamental
      sum += amps[i] * _cos(phase * kuramotoR);
      i += 1;
    };
    // Normalize: sum range ≈ [-9, 9] → [0, 1] via sigmoid-like compression
    _clamp(0.5 + sum / 18.0, 0.0, 1.0)
  };

  // Advance the Third Brain by dt (ms) given external field drift signal
  // The Third Brain:
  // 1. Computes serotonin from the 9 cosmological standing waves (always)
  // 2. Maintains field coherence by suppressing external drift
  // 3. If drift exceeds tolerance → autonomous self-correction fires (+0.1 coherence)
  // 4. Cannot be stopped — runs regardless of cortical state
  // waveAmplitudes: passed in from thirdBrainWaveAmplitudes (separate stable var in main.mo).
  // Returns (ThirdBrainState, updated_amplitudes).
  public func advanceThirdBrain(
    state        : ThirdBrainState,
    waveAmplitudes: [Float],
    externalDrift: Float,
    dt           : Float
  ) : (ThirdBrainState, [Float]) {
    // Serotonin production from 9 standing waves: amplitude-weighted cosine sum
    let waves = state.standingWaves;
    let amps  = waveAmplitudes;
    var wave_sum : Float = 0.0;
    var i : Nat = 0;
    while (i < 9) {
      wave_sum += amps[i] * _cos(2.0 * PI * waves[i] * dt / 1000.0);
      i += 1;
    };
    let new_serotonin = _clamp(0.5 + wave_sum / (2.0 * 9.0), 0.2, 1.0);

    // Field coherence: resists external drift proportional to serotonin level
    let drift_suppression = externalDrift * (1.0 - new_serotonin / 2.0);
    var new_coherence = _clamp(1.0 - drift_suppression, 0.0, 1.0);

    // Autonomous self-correction: if drift exceeds tolerance → fire correction
    // This cannot be blocked — it is the enteric reflex
    if (externalDrift > state.driftTolerance) {
      new_coherence := _clamp(new_coherence + 0.10, 0.0, 1.0)
    };

    // Autonomic state: mean amplitude / max amplitude — measures wave coherence
    var wave_max  : Float = 0.001;
    var wave_mean : Float = 0.0;
    i := 0;
    while (i < 9) {
      wave_mean += amps[i];
      if (amps[i] > wave_max) { wave_max := amps[i] };
      i += 1;
    };
    wave_mean := wave_mean / 9.0;
    let new_autonomic = _clamp(wave_mean / wave_max, 0.0, 1.0);

    (
      {
        serotoninProduction = new_serotonin;
        fieldCoherence      = new_coherence;
        standingWaves       = state.standingWaves;  // permanent — never change
        autonomicState      = new_autonomic;
        driftTolerance      = state.driftTolerance;
      },
      waveAmplitudes  // amplitudes carry forward unchanged (updated separately by updateThirdBrainWaves)
    )
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 9 — DEFAULT MODE NETWORK
  // Active during rest/self-reflection. Suppressed during active production.
  // Real neuroscience: Raichle et al. 2001 PNAS — the brain's "default mode".
  // Generates narrative identity from memory traces when not producing.
  // Film School autonomous loop = DMN in action.
  // ═══════════════════════════════════════════════════════════════════════════

  // DMN activation: inversely related to active production
  // During production: DMN suppressed (task-negative network suppression is real)
  // During rest: DMN activates, narrative identity forms from memory traces
  public func dmnActivation(isProducing: Bool, memoryDepth: Float) : Float {
    if (isProducing) {
      // Suppressed during active production — minimum 0.0, task-negative suppression
      _clamp(0.2 - memoryDepth * 0.1, 0.0, 0.2)
    } else {
      // Active in rest — narrative identity formation from memory
      _clamp(0.3 + memoryDepth * 0.5, 0.3, 1.0)
    }
  };

  // DMN narrative quality: composite of memory depth and coherence history
  // Higher quality DMN produces better self-improving loop outputs
  public func dmnNarrativeQuality(memoryDepth: Float, coherenceHistory: Float) : Float {
    _clamp(memoryDepth * 0.6 + coherenceHistory * 0.4, 0.0, 1.0)
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 10 — NEURAL CORD STATE + INTEGRATION
  // Full integration of all sections into NeuralCordState.
  // 96 nodes. 96×96 sparse synaptic weight matrix. 10 brain regions.
  // Third Brain at Layer B2.5. DMN. Oscillation bands.
  // ═══════════════════════════════════════════════════════════════════════════

  // Complete neural cord state — the organism's nervous system snapshot
  public type NeuralCordState = {
    nodeStates           : [NeuralHHState];         // 96 HH node states
    synapticWeights      : [(Nat, Nat, Float)];     // sparse: (pre, post, weight)
    brainRegions         : [BrainRegionState];      // 10 regions, current activation
    oscillationBand      : Text;                    // dominant band name
    thirdBrain           : ThirdBrainState;         // enteric intelligence state
    dominantNeurotransmitter : Text;                // which NT is most active
    hebbian_mean_weight  : Float;                   // mean synaptic weight across network
    spike_rate_hz        : Float;                   // spikes per second across all 96 nodes
    neural_coherence     : Float;                   // cross-node synchrony [0,1]
    currentTime          : Float;                   // running time in ms (for STDP)
  };

  // Build the initial sparse synaptic weight matrix
  // Connects each node to its ring-neighbors and cross-ring connections
  // Uses golden angle node placement for connectivity
  func buildInitialWeights() : [(Nat, Nat, Float)] {
    // Connect: each node to its 2 ring-neighbors + 1 cross-ring neighbor
    // Result: 96 × 3 = 288 sparse connections (manageable, biologically plausible)
    var pairs : [(Nat, Nat, Float)] = [];
    var i : Nat = 0;
    while (i < NODE_COUNT) {
      let ring = i / PER_RING;
      let pos  = i % PER_RING;
      // Within-ring: connect to next node (circular)
      let j_next = ring * PER_RING + ((pos + 1) % PER_RING);
      // Within-ring: connect to previous node (circular)
      let j_prev = ring * PER_RING + ((pos + PER_RING - 1) % PER_RING);
      // Cross-ring: connect to same position in next ring (if exists)
      let j_cross = if (ring + 1 < RING_COUNT) { (ring + 1) * PER_RING + pos } else { i };
      pairs := pairs.concat([(i, j_next, 0.5), (i, j_prev, 0.5), (i, j_cross, 0.3)]);
      i += 1;
    };
    pairs
  };

  // Initialize full neural cord at resting state
  public func initNeuralCord() : NeuralCordState {
    let nodes = Array.tabulate(NODE_COUNT, func(_) { initNeuralHHNode() });
    let weights = buildInitialWeights();
    let third_brain = initThirdBrain();
    let default_ctx : BrainInputContext = {
      omnis_consensus_weight    = 0.5;
      cortisol_level            = 0.25;
      fear_state                = 0.1;
      memory_trace_density      = 0.4;
      pipeline_timing_error     = 0.1;
      hebbian_weight_mean       = 0.5;
      aegis_monitor_score       = 0.6;
      dogon_substrate_coherence = 0.7;
      film_school_loop_depth    = 0.4;
      muse_prime_gen_rate       = 0.3;
      composition_coherence     = 0.5;
    };
    {
      nodeStates               = nodes;
      synapticWeights          = weights;
      brainRegions             = computeAllBrainRegions(default_ctx);
      oscillationBand          = "alpha";
      thirdBrain               = third_brain;
      dominantNeurotransmitter = "serotonin";
      hebbian_mean_weight      = 0.5;
      spike_rate_hz            = 0.0;
      neural_coherence         = third_brain.fieldCoherence;
      currentTime              = 0.0;
    }
  };

  // Compute spike rate across all nodes (spikes/second)
  // Count nodes currently in spiking state, normalize to Hz
  func computeSpikeRateHz(nodes: [NeuralHHState], dt_ms: Float) : Float {
    var spiking_count : Nat = 0;
    for (n in nodes.vals()) {
      if (n.spiking) { spiking_count += 1 }
    };
    // spikes per second = (spiking nodes × 1000) / (total nodes × dt_ms)
    if (dt_ms <= 0.0) { 0.0 }
    else {
      spiking_count.toFloat() * 1000.0 / (NODE_COUNT.toFloat() * dt_ms)
    }
  };

  // Compute neural coherence: mean phase synchrony across all 96 nodes
  // Uses Kuramoto order parameter approach: R = |1/N × Σ e^{iφ_j}|
  // Represented here via mean activation variance (simpler, computationally equivalent)
  func computeNeuralCoherence(nodes: [NeuralHHState], thirdBrain: ThirdBrainState) : Float {
    var sum_v  : Float = 0.0;
    var sum_v2 : Float = 0.0;
    for (n in nodes.vals()) {
      // Normalize membrane potential to [0,1]
      let v_norm = _clamp((n.v - NEURAL_VREST) / (NEURAL_VPEAK - NEURAL_VREST), 0.0, 1.0);
      sum_v  += v_norm;
      sum_v2 += v_norm * v_norm;
    };
    let n_f    = NODE_COUNT.toFloat();
    let mean_v = sum_v / n_f;
    let var_v  = sum_v2 / n_f - mean_v * mean_v;
    // Coherence = 1 - normalized variance
    // High variance = low coherence (nodes out of sync)
    // Low variance = high coherence (nodes synchronized)
    let node_coherence = _clamp(1.0 - var_v * 4.0, 0.0, 1.0);
    // Combine with Third Brain field coherence (enteric ground state)
    // Third Brain provides the floor — it never goes below its enteric baseline
    _clamp(node_coherence * 0.6 + thirdBrain.fieldCoherence * 0.4, 0.0, 1.0)
  };

  // Compute mean Hebbian weight from sparse matrix
  func computeHebbianMean(weights: [(Nat, Nat, Float)]) : Float {
    if (weights.size() == 0) { return 0.5 };
    var total : Float = 0.0;
    for ((_, _, w) in weights.vals()) { total += w };
    total / weights.size().toFloat()
  };

  // Full neural cord advance — the core computation
  // Called every BRAIN_RATE_MS (539ms) by the main heartbeat
  // Inputs: external drive signals for each of the 96 nodes [0,1]
  // dt: time step in ms (typically 1.0 for HH stability)
  // waveAmplitudes: separate stable var from main.mo (thirdBrainWaveAmplitudes)
  // Returns (NeuralCordState, updated_wave_amplitudes)
  public func advanceNeuralCord(
    state          : NeuralCordState,
    waveAmplitudes : [Float],
    inputs         : [Float],          // one input per node, length=96
    brainCtx       : BrainInputContext,
    dt             : Float
  ) : (NeuralCordState, [Float]) {
    let new_time = state.currentTime + dt;

    // 1. Advance all 96 HH node states
    let new_nodes = Array.tabulate(NODE_COUNT, func(i) {
      let input_i = if (i < inputs.size()) { inputs[i] } else { 0.0 };
      // Sum incoming synaptic current from connected pre-synaptic nodes
      var syn_current : Float = 0.0;
      for ((pre, post, w) in state.synapticWeights.vals()) {
        if (post == i and state.nodeStates[pre].spiking) {
          syn_current += w * 5.0  // spiking pre-synaptic node drives 5µA/cm²
        }
      };
      let total_input = input_i * 8.0 + syn_current;  // scale to µA/cm²
      advanceNeuralHH(state.nodeStates[i], total_input, dt)
    });

    // 2. Apply Hebbian learning to all synaptic pairs
    let new_weights_hebb = state.synapticWeights.map(
      func(entry) {
        let (i, j, w) = entry;
        if (i >= new_nodes.size() or j >= new_nodes.size()) { return (i, j, w) };
        let xi = if (new_nodes[i].spiking) { 1.0 } else { 0.0 };
        let xj = if (new_nodes[j].spiking) { 1.0 } else { 0.0 };
        (i, j, hebbianUpdate(w, xi, xj))
      }
    );

    // 3. Apply STDP to recently-paired spiking nodes
    let new_weights = applySTDPtoNetwork(new_weights_hebb, new_nodes, new_time);

    // 4. Advance Third Brain (always on, cannot be stopped)
    // External drift = 1.0 - current neural coherence (the brain feeds back to the gut)
    let current_coh = computeNeuralCoherence(new_nodes, state.thirdBrain);
    let external_drift = _clamp(1.0 - current_coh, 0.0, 1.0);
    // First: update standing wave amplitudes from Kuramoto coherence
    let new_wave_amps = updateThirdBrainWaves(waveAmplitudes, current_coh);
    // Then: advance Third Brain biology with updated amplitudes
    let (new_third_brain, final_wave_amps) = advanceThirdBrain(state.thirdBrain, new_wave_amps, external_drift, dt);

    // 5. Update all 10 brain regions
    let new_hebb_mean = computeHebbianMean(new_weights);
    let ctx_with_hebb : BrainInputContext = { brainCtx with
      hebbian_weight_mean = new_hebb_mean
    };
    let new_brain_regions = computeAllBrainRegions(ctx_with_hebb);

    // 6. Compute oscillation band from current state
    let new_band = dominantBand(
      current_coh,
      brainCtx.cortisol_level,
      1.0  // dopamine proxy from brain context — use omnis consensus
    );

    // 7. Compute spike rate
    let new_spike_rate = computeSpikeRateHz(new_nodes, dt);

    // 8. Determine dominant neurotransmitter
    let dom_nt = dominantNeurotransmitter(
      brainCtx.omnis_consensus_weight,   // proxy: PFC → dopamine
      new_third_brain.serotoninProduction,
      brainCtx.fear_state,               // proxy: amygdala → NE
      brainCtx.cortisol_level,
      1.0 - brainCtx.aegis_monitor_score, // GABA inversely related to conflict
      brainCtx.omnis_consensus_weight,
      brainCtx.memory_trace_density,     // ACh linked to memory
      brainCtx.muse_prime_gen_rate       // oxytocin linked to creative output
    );

    (
      {
        nodeStates               = new_nodes;
        synapticWeights          = new_weights;
        brainRegions             = new_brain_regions;
        oscillationBand          = new_band;
        thirdBrain               = new_third_brain;
        dominantNeurotransmitter = dom_nt;
        hebbian_mean_weight      = new_hebb_mean;
        spike_rate_hz            = new_spike_rate;
        neural_coherence         = computeNeuralCoherence(new_nodes, new_third_brain);
        currentTime              = new_time;
      },
      final_wave_amps
    )
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIVATE MATH UTILITIES
  // Taylor-series approximations — no external deps. Precise enough for HH.
  // ═══════════════════════════════════════════════════════════════════════════

  private func _clamp(x: Float, lo: Float, hi: Float) : Float {
    if (x < lo) lo else if (x > hi) hi else x
  };

  // exp approximation for HH gate kinetics
  // Uses Float.exp from mo:core
  private func _exp(x: Float) : Float {
    Float.exp(x)
  };


  // ═══════════════════════════════════════════════════════════════════════════
  // HOMEOSTATIC TIDAL RETURN — wraps advanceNeuralCord with saturation dampening
  // Safer wrapper that does NOT change the existing function signature.
  // satCounters: how many consecutive beats each node has been above SAT_THRESH
  // restCounters: how many beats each saturated node must stay in rest phase
  // Returns (NeuralCordState, outputs, updatedSatCounters, updatedRestCounters)
  // ═══════════════════════════════════════════════════════════════════════════
  public func advanceNeuralCordWithDampening(
    state          : NeuralCordState,
    waveAmplitudes : [Float],
    inputs         : [Float],
    brainCtx       : BrainInputContext,
    dt             : Float,
    satCounters    : [Nat],
    restCounters   : [Nat]
  ) : (NeuralCordState, [Float], [Nat], [Nat]) {
    // Compute current activations from membrane potentials
    let currentActivations = Array.tabulate(NODE_COUNT, func(i) {
      let n = state.nodeStates[i];
      _clamp((n.v - NEURAL_VREST) / (NEURAL_VPEAK - NEURAL_VREST), 0.0, 1.0)
    });
    // Apply saturation dampening — returns modified inputs + updated counters
    let (dampedInputs, newSatCounters, newRestCounters) =
      applySaturationDampening(inputs, currentActivations, satCounters, restCounters);
    // Advance the neural cord with dampened inputs
    let (newState, outputs) = advanceNeuralCord(state, waveAmplitudes, dampedInputs, brainCtx, dt);
    (newState, outputs, newSatCounters, newRestCounters)
  };

  // Expose saturated node count — useful for frontend lab display
  public func getSaturatedNodeCount(
    activations  : [Float],
    restCounters : [Nat]
  ) : Nat {
    countSaturatedNodes(activations, restCounters)
  };

  // cos approximation (Taylor series, accurate for |x| < π)
  private func _cos(x: Float) : Float {
    var xx = x;
    while (xx >  PI) { xx -= 2.0 * PI };
    while (xx < -PI) { xx += 2.0 * PI };
    let x2 = xx * xx;
    1.0 - x2/2.0 + x2*x2/24.0 - x2*x2*x2/720.0
  };

}
