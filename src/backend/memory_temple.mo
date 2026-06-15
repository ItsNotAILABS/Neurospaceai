// ============================================================
// MEMORY TEMPLE — SOVEREIGN MEMORY SUBSTRATE
// Pedestal architecture: ancient/lineage memory pedestals as
// active coupling nodes. Continuity-first memory field.
// Coupled retrieval biased by heart/brain/middle-organ state.
// Internal analyst: continuous recommendation generation.
// Kernel-compressed equations only. No if-then trees.
// PHI = 1.6180339887498948482 (root constant, never hardcoded)
// ============================================================

import Float         "mo:core/Float";
import Array         "mo:core/Array";
import Nat           "mo:core/Nat";
import VarArray      "mo:core/VarArray";
import SovereignLaws "sovereign_laws";

module {

  // ============================================================
  // MODULE-LEVEL CONSTANTS — all derived from PHI (static)
  // ============================================================
  public let MAX_PEDESTALS : Nat  = 12;   // PHI^5 ≈ 11.09 → 12
  public let MAX_EPISODIC  : Nat  = 200;
  public let MAX_SEMANTIC  : Nat  = 144;  // PHI-Fibonacci
  public let MAX_DOCTRINE  : Nat  = 89;   // Fibonacci
  public let MAX_MISSION   : Nat  = 55;   // Fibonacci
  public let MAX_ANALYST   : Nat  = 21;   // PHI-Fibonacci
  public let MAX_LAWS      : Nat  = 60;   // sovereign law count

  let PHI        : Float = SovereignLaws.PHI;
  let GOLDEN_ANGLE : Float = 2.3999632297286535; // 137.5077640500378546° rad
  let PHI_INV3   : Float = SovereignLaws.PHI_INV3; // 1/PHI^3
  let PHI_SQ     : Float = SovereignLaws.PHI2;      // PHI^2

  // Tau = 2π — sealed
  let TAU        : Float = 6.28318530717958647692;

  // ============================================================
  // CLIFFORD TORUS SPATIAL ADDRESS
  // 4D coordinate in the memory palace.
  // ring  : 0..11  — which of the 12 memory rings
  // locus : 0..20  — which of the 21 loci per ring (Fibonacci[8])
  // w/x   : toroidal angles × PHI  (range ±PHI)
  // y/z   : poloidal angles        (range ±1.0)
  // Distance in this space = semantic distance.
  // Adjacent loci = conceptually related memories.
  // ============================================================
  public type CliffordAddress = {
    ring  : Nat;    // 0..11
    locus : Nat;    // 0..20
    w     : Float;  // cos(TAU × locus/21) × PHI
    x     : Float;  // sin(TAU × locus/21) × PHI
    y     : Float;  // cos(TAU × ring/12)
    z     : Float;  // sin(TAU × ring/12)
  };

  /// Compute the Clifford torus address for a given (ring, locus) pair.
  public func toCliffordAddress(ring : Nat, locus : Nat) : CliffordAddress {
    let rf = ring.toFloat();
    let lf = locus.toFloat();
    let rings_f  = SovereignLaws.MEMORY_RINGS.toFloat();
    let loci_f   = SovereignLaws.MEMORY_LOCI_PER_RING.toFloat();
    {
      ring;
      locus;
      w = Float.cos(TAU * lf / loci_f) * PHI;
      x = Float.sin(TAU * lf / loci_f) * PHI;
      y = Float.cos(TAU * rf / rings_f);
      z = Float.sin(TAU * rf / rings_f);
    }
  };

  /// Euclidean distance in 4D Clifford torus space — this is semantic distance.
  public func cliffordDistance(a : CliffordAddress, b : CliffordAddress) : Float {
    let dw = a.w - b.w;
    let dx = a.x - b.x;
    let dy = a.y - b.y;
    let dz = a.z - b.z;
    Float.sqrt(dw*dw + dx*dx + dy*dy + dz*dz)
  };

  /// Assign a Clifford address from a monotonic beat counter.
  /// ring  = beatCount mod 12
  /// locus = (beatCount / 12) mod 21
  public func assignAddress(beatCount : Nat) : CliffordAddress {
    let ring  = beatCount % SovereignLaws.MEMORY_RINGS;
    let locus = (beatCount / SovereignLaws.MEMORY_RINGS) % SovereignLaws.MEMORY_LOCI_PER_RING;
    toCliffordAddress(ring, locus)
  };

  // ============================================================
  // TYPES — shared, no var fields
  // ============================================================
  public type Pedestal = {
    id            : Nat;
    phase_bias    : Float;
    lineage_depth : Nat;
    active        : Bool;
  };

  /// EpisodicTrace — ORIGINAL stable shape (6 fields only).
  /// Adding fields to this type breaks upgrade compatibility (M0170).
  /// All new fields (beatStamp, salience, Clifford address, etc.) are stored
  /// in PARALLEL stable vars in main.mo. This type is frozen.
  public type EpisodicTrace = {
    timestamp    : Nat;
    state_vector : [Float];
    organism_R   : Float;
    heart_coh    : Float;
    brain_coh    : Float;
    gut_coh      : Float;
  };

  public type SemanticTrace = {
    concept_id : Nat;
    salience   : Float;
    phi_weight : Float;
    cluster    : [Nat];
    timestamp  : Nat;
  };

  public type DoctrineTrace = {
    law_id          : Nat;
    invocation_time : Nat;
    outcome         : Float;
    compliance      : Float;
  };

  public type MissionTrace = {
    goal_id        : Nat;
    deficit_vector : [Float];
    urgency        : Float;
    active         : Bool;
    timestamp      : Nat;
  };

  public type RecommendationVector = {
    consolidate     : [Nat];
    surface         : [Nat];
    lineage_pattern : Nat;
    analyst_cycle   : Nat;
    confidence      : Float;
  };

  public type MemoryTempleState = {
    pedestals              : [Pedestal];
    episodic_count         : Nat;
    semantic_count         : Nat;
    doctrine_count         : Nat;
    mission_count          : Nat;
    current_retrieval_bias : Text;
    analyst_queue          : [RecommendationVector];
    memory_coherence       : Float;
    pedestal_phase_sum     : Float;
    last_analyst_cycle     : Nat;
  };

  // State record passed in from actor — all mutable containers
  // The actor owns these; we mutate them in place.
  public type MemoryTempleRefs = {
    pedestals        : [var Pedestal];
    episodic_traces  : [var EpisodicTrace];
    semantic_traces  : [var SemanticTrace];
    doctrine_traces  : [var DoctrineTrace];
    mission_traces   : [var MissionTrace];
    analyst_queue    : [var RecommendationVector];
    law_compliance   : [var Float];
    law_call_count   : [var Nat];
    last_organ_coh   : [var Float];  // [0]=heart_coh, [1]=brain_coh, [2]=gut_coh
  };

  // ============================================================
  // PURE KERNELS — no state dependency
  // ============================================================

  func phi_pow(b : Float, e : Float) : Float {
    if (b <= 0.0) 0.0 else Float.exp(e * Float.log(b))
  };

  func l2_norm(v : [Float]) : Float {
    var sum : Float = 0.0;
    for (x in v.vals()) { sum += x * x };
    Float.sqrt(sum)
  };

  func clamp(x : Float, lo : Float, hi : Float) : Float {
    if (x < lo) lo else if (x > hi) hi else x
  };

  func attractor_strength(p : Pedestal) : Float {
    p.lineage_depth.toFloat() * phi_pow(PHI, p.lineage_depth.toFloat())
  };

  // ============================================================
  // DEFAULT VALUES — for VarArray.repeat initialization
  // ============================================================
  public let PEDESTAL_DEFAULT : Pedestal = {
    id = 0; phase_bias = 0.0; lineage_depth = 1; active = true;
  };
  public let EPISODIC_DEFAULT : EpisodicTrace = {
    timestamp    = 0;
    state_vector = [];
    organism_R   = 0.0;
    heart_coh    = 0.0;
    brain_coh    = 0.0;
    gut_coh      = 0.0;
  };
  public let SEMANTIC_DEFAULT : SemanticTrace = {
    concept_id = 0; salience = 0.0; phi_weight = 0.0; cluster = []; timestamp = 0;
  };
  public let DOCTRINE_DEFAULT : DoctrineTrace = {
    law_id = 0; invocation_time = 0; outcome = 0.0; compliance = 0.5;
  };
  public let MISSION_DEFAULT : MissionTrace = {
    goal_id = 0; deficit_vector = []; urgency = 0.0; active = false; timestamp = 0;
  };
  public let REC_DEFAULT : RecommendationVector = {
    consolidate = []; surface = []; lineage_pattern = 0; analyst_cycle = 0; confidence = 0.0;
  };

  // ============================================================
  // INIT — call once at actor start to seed pedestal phases
  // Writes directly into the refs.pedestals array
  // ============================================================
  public func initPedestals(refs : MemoryTempleRefs) : () {
    var i : Nat = 0;
    while (i < MAX_PEDESTALS) {
      let phase = GOLDEN_ANGLE * i.toFloat();
      let depth : Nat = MAX_PEDESTALS - i; // safe: loop guard ensures i < MAX_PEDESTALS
      refs.pedestals[i] := {
        id            = i;
        phase_bias    = phase;
        lineage_depth = depth;
        active        = true;
      };
      i += 1;
    };
  };

  // ============================================================
  // getPedestalPhaseInjection
  // ============================================================
  public func getPedestalPhaseInjection(refs : MemoryTempleRefs) : Float {
    var acc : Float = 0.0;
    var i   : Nat   = 0;
    while (i < MAX_PEDESTALS) {
      let p = refs.pedestals[i];
      acc += if (p.active) (attractor_strength(p) * Float.cos(p.phase_bias)) else 0.0;
      i   += 1;
    };
    acc / MAX_PEDESTALS.toFloat()
  };

  // ============================================================
  // recordEpisodic
  // Returns updated (episodic_head, beat_counter, memory_coherence)
  // CliffordAddress is written to mt_episodic_addresses (parallel array in main.mo).
  // This function returns the address so main.mo can store it separately.
  // ============================================================
  public func recordEpisodic(
    refs          : MemoryTempleRefs,
    episodic_head : Nat,
    beat_counter  : Nat,
    mem_coh       : Float,
    ts            : Nat,
    state_vec     : [Float],
    R             : Float,
    hc            : Float,
    bc            : Float,
    gc            : Float
  ) : (Nat, Nat, Float, CliffordAddress) {
    let slot = episodic_head % MAX_EPISODIC;
    let addr = assignAddress(beat_counter);
    refs.episodic_traces[slot] := {
      timestamp    = ts;
      state_vector = state_vec;
      organism_R   = R;
      heart_coh    = hc;
      brain_coh    = bc;
      gut_coh      = gc;
    };
    refs.last_organ_coh[0] := hc;
    refs.last_organ_coh[1] := bc;
    refs.last_organ_coh[2] := gc;
    (episodic_head + 1, beat_counter + 1, clamp(mem_coh * 0.97 + R * 0.03, 0.0, 1.0), addr)
  };

  // ============================================================
  // recordSemantic
  // Returns updated semantic_head
  // ============================================================
  public func recordSemantic(
    refs          : MemoryTempleRefs,
    semantic_head : Nat,
    beat_counter  : Nat,
    concept_id    : Nat,
    salience      : Float,
    depth         : Nat,
    cluster       : [Nat]
  ) : Nat {
    let slot = semantic_head % MAX_SEMANTIC;
    let pw   = salience * phi_pow(PHI, depth.toFloat());
    refs.semantic_traces[slot] := {
      concept_id;
      salience;
      phi_weight = pw;
      cluster;
      timestamp  = beat_counter;
    };
    semantic_head + 1
  };

  // ============================================================
  // recordDoctrine
  // Returns updated doctrine_head
  // ============================================================
  public func recordDoctrine(
    refs          : MemoryTempleRefs,
    doctrine_head : Nat,
    beat_counter  : Nat,
    law_id        : Nat,
    outcome       : Float
  ) : Nat {
    let lid  = law_id % MAX_LAWS;
    let n    = refs.law_call_count[lid];
    let prev = refs.law_compliance[lid];
    refs.law_compliance[lid]  := (prev * n.toFloat() + outcome) / (n + 1).toFloat();
    refs.law_call_count[lid]  := n + 1;
    let slot = doctrine_head % MAX_DOCTRINE;
    refs.doctrine_traces[slot] := {
      law_id          = lid;
      invocation_time = beat_counter;
      outcome;
      compliance      = refs.law_compliance[lid];
    };
    doctrine_head + 1
  };

  // ============================================================
  // recordMission
  // Returns updated mission_head
  // ============================================================
  public func recordMission(
    refs         : MemoryTempleRefs,
    mission_head : Nat,
    beat_counter : Nat,
    goal_id      : Nat,
    deficit_vec  : [Float],
    active       : Bool
  ) : Nat {
    let slot = mission_head % MAX_MISSION;
    refs.mission_traces[slot] := {
      goal_id;
      deficit_vector = deficit_vec;
      urgency        = l2_norm(deficit_vec);
      active;
      timestamp      = beat_counter;
    };
    mission_head + 1
  };

  // ============================================================
  // coupledRetrieval
  // ============================================================
  public func coupledRetrieval(
    refs                  : MemoryTempleRefs,
    episodic_head         : Nat,
    semantic_head         : Nat,
    doctrine_head         : Nat,
    mission_head          : Nat,
    _analyst_head         : Nat,
    analyst_cycle_counter : Nat,
    memory_coherence      : Float,
    heart_coh             : Float,
    brain_coh             : Float,
    gut_coh               : Float
  ) : MemoryTempleState {
    let ep_res  = heart_coh * 0.6 + brain_coh * 0.2 + gut_coh * 0.2;
    let sem_res = brain_coh * 0.6 + heart_coh * 0.2 + gut_coh * 0.2;
    let doc_res = gut_coh  * 0.4 + heart_coh * 0.3 + brain_coh * 0.3;
    let top_res = if (ep_res >= sem_res and ep_res >= doc_res) ep_res
                  else if (sem_res >= doc_res) sem_res
                  else doc_res;
    let mis_res = clamp(1.0 - top_res, 0.0, 1.0);
    let bias =
      if (ep_res >= sem_res and ep_res >= doc_res and ep_res >= mis_res) "episodic"
      else if (sem_res >= doc_res and sem_res >= mis_res) "semantic"
      else if (doc_res >= mis_res) "doctrine"
      else "mission";
    let psum = _pedestal_phase_sum(refs);
    {
      pedestals              = Array.tabulate(MAX_PEDESTALS, func(i : Nat) : Pedestal = refs.pedestals[i]);
      episodic_count         = Nat.min(episodic_head, MAX_EPISODIC);
      semantic_count         = Nat.min(semantic_head, MAX_SEMANTIC);
      doctrine_count         = Nat.min(doctrine_head, MAX_DOCTRINE);
      mission_count          = Nat.min(mission_head, MAX_MISSION);
      current_retrieval_bias = bias;
      analyst_queue          = Array.tabulate(MAX_ANALYST, func(i : Nat) : RecommendationVector = refs.analyst_queue[i]);
      memory_coherence;
      pedestal_phase_sum     = psum;
      last_analyst_cycle     = analyst_cycle_counter;
    }
  };

  // ============================================================
  // runAnalyst
  // Returns (RecommendationVector, updated analyst_head)
  // ============================================================
  public func runAnalyst(
    refs                  : MemoryTempleRefs,
    episodic_head         : Nat,
    semantic_head         : Nat,
    analyst_head          : Nat,
    memory_coherence      : Float,
    cycle                 : Nat
  ) : (RecommendationVector, Nat) {

    let consolidate_ids : [var Nat] = VarArray.repeat(0 : Nat, MAX_EPISODIC);
    var con_count : Nat = 0;
    var ei : Nat = 0;
    while (ei < MAX_EPISODIC and con_count < 8) {
      let t = refs.episodic_traces[ei];
      if (t.timestamp > 0 and t.organism_R > 0.0 and t.organism_R < PHI_INV3) {
        consolidate_ids[con_count] := ei;
        con_count += 1;
      };
      ei += 1;
    };

    let surface_ids : [var Nat] = VarArray.repeat(0 : Nat, MAX_SEMANTIC);
    var sur_count : Nat = 0;
    var si : Nat = 0;
    while (si < MAX_SEMANTIC and sur_count < 8) {
      let t = refs.semantic_traces[si];
      if (t.phi_weight > PHI_SQ) {
        surface_ids[sur_count] := si;
        sur_count += 1;
      };
      si += 1;
    };

    var best_pedestal : Nat   = 0;
    var best_score    : Float = -1.0e38;
    var pi : Nat = 0;
    while (pi < MAX_PEDESTALS) {
      let p     = refs.pedestals[pi];
      let score = if (p.active) (attractor_strength(p) * Float.cos(p.phase_bias)) else -1.0e38;
      if (score > best_score) { best_score := score; best_pedestal := pi };
      pi += 1;
    };

    let last_ep_R   = refs.episodic_traces[(episodic_head + MAX_EPISODIC - 1) % MAX_EPISODIC].organism_R;
    let last_sem_pw = refs.semantic_traces[(semantic_head + MAX_SEMANTIC - 1) % MAX_SEMANTIC].phi_weight;
    let confidence  = clamp(
      (memory_coherence + last_ep_R + clamp(last_sem_pw / PHI_SQ, 0.0, 1.0)) / 3.0,
      0.0, 1.0
    );

    let con_arr = Array.tabulate(con_count, func(k : Nat) : Nat = consolidate_ids[k]);
    let sur_arr = Array.tabulate(sur_count, func(k : Nat) : Nat = surface_ids[k]);

    let rec : RecommendationVector = {
      consolidate     = con_arr;
      surface         = sur_arr;
      lineage_pattern = best_pedestal;
      analyst_cycle   = cycle;
      confidence;
    };

    let slot = analyst_head % MAX_ANALYST;
    refs.analyst_queue[slot] := rec;
    (rec, analyst_head + 1)
  };

  // ============================================================
  // getMemoryTempleState
  // ============================================================
  public func getMemoryTempleState(
    refs                  : MemoryTempleRefs,
    episodic_head         : Nat,
    semantic_head         : Nat,
    doctrine_head         : Nat,
    mission_head          : Nat,
    analyst_cycle_counter : Nat,
    memory_coherence      : Float
  ) : MemoryTempleState {
    let hc   = refs.last_organ_coh[0];
    let bc   = refs.last_organ_coh[1];
    let gc   = refs.last_organ_coh[2];
    let bias = if (hc >= bc and hc >= gc) "episodic"
               else if (bc >= gc) "semantic"
               else "doctrine";
    {
      pedestals              = Array.tabulate(MAX_PEDESTALS, func(i : Nat) : Pedestal = refs.pedestals[i]);
      episodic_count         = Nat.min(episodic_head, MAX_EPISODIC);
      semantic_count         = Nat.min(semantic_head, MAX_SEMANTIC);
      doctrine_count         = Nat.min(doctrine_head, MAX_DOCTRINE);
      mission_count          = Nat.min(mission_head, MAX_MISSION);
      current_retrieval_bias = bias;
      analyst_queue          = Array.tabulate(MAX_ANALYST, func(i : Nat) : RecommendationVector = refs.analyst_queue[i]);
      memory_coherence;
      pedestal_phase_sum     = _pedestal_phase_sum(refs);
      last_analyst_cycle     = analyst_cycle_counter;
    }
  };

  // ============================================================
  // retrieveNearby — SPATIAL NAVIGATION
  // Returns all EpisodicTraces whose Clifford address is within
  // `radius` of `addr`. Retrieval is navigation, not search.
  // Distance = semantic distance. Adjacent loci = related memories.
  // episodic_addresses: parallel [var ?CliffordAddress] array from main.mo
  // ============================================================
  public func retrieveNearby(
    addr              : CliffordAddress,
    radius            : Float,
    refs              : MemoryTempleRefs,
    episodic_addresses: [var ?CliffordAddress]
  ) : [EpisodicTrace] {
    var result : [EpisodicTrace] = [];
    var i : Nat = 0;
    while (i < MAX_EPISODIC) {
      let t = refs.episodic_traces[i];
      // Only include slots that have been written (timestamp > 0)
      if (t.timestamp > 0) {
        switch (episodic_addresses[i]) {
          case (?addrI) {
            if (cliffordDistance(addr, addrI) < radius) {
              result := result.concat<EpisodicTrace>([t]);
            };
          };
          case null {};
        };
      };
      i += 1;
    };
    result
  };

  // ── PRIVATE HELPERS ──────────────────────────────────────────
  func _pedestal_phase_sum(refs : MemoryTempleRefs) : Float {
    var acc : Float = 0.0;
    var i   : Nat   = 0;
    while (i < MAX_PEDESTALS) {
      let p = refs.pedestals[i];
      acc += if (p.active) p.phase_bias else 0.0;
      i   += 1;
    };
    acc
  };

}
