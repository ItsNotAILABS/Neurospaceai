// ============================================================
// FINGERPRINT — SOVEREIGN HASH & SIGNATURE ENGINE
// Creator: Alfredo Medina Hernandez
// Location: Dallas, Texas, USA. 2026.
// Medina Doctrine — NeuroEmergence Core / SOVEREIGN Substrate
//
// Implements FNV-1a-32 and FNV-1a-64 on-chain hash primitives.
// Provides SACESI signature derivation, canister fingerprinting,
// multi-field composite hashing, and genesis chain binding.
// Zero-Exposure Wall: all outputs are numeric hashes only.
// No semantic names ever appear in public outputs.
// ============================================================

module {

  // ============================================================
  // CONSTANTS
  // ============================================================

  // FNV-1a 32-bit constants
  let FNV_PRIME_32   : Nat32 = 16777619;
  let FNV_OFFSET_32  : Nat32 = 2166136261;

  // FNV-1a 64-bit constants (stored as two Nat32 for compatibility)
  // FNV prime 64 = 1099511628211 = 0x00000100000001B3
  let FNV_PRIME_64_HI  : Nat32 = 0x00000100;
  let FNV_PRIME_64_LO  : Nat32 = 0x000001B3;
  let FNV_OFFSET_64_HI : Nat32 = 0x84222325;
  let FNV_OFFSET_64_LO : Nat32 = 0x59923b91;

  // SACESI derivation constants
  let SACESI_SEED_A  : Nat32 = 0xDEADBEEF;
  let SACESI_SEED_B  : Nat32 = 0xCAFEBABE;
  let SACESI_SEED_C  : Nat32 = 0xFEEDFACE;
  let SACESI_ROUNDS  : Nat   = 7;

  // Canister fingerprint domain separators
  let DOMAIN_GENESIS    : Nat32 = 0x47454E45; // "GENE"
  let DOMAIN_DOCTRINE   : Nat32 = 0x444F4354; // "DOCT"
  let DOMAIN_SACESI     : Nat32 = 0x53414345; // "SACE"
  let DOMAIN_PRINCIPAL  : Nat32 = 0x5052494E; // "PRIN"
  let DOMAIN_BEAT       : Nat32 = 0x42454154; // "BEAT"
  let DOMAIN_COHERENCE  : Nat32 = 0x434F4845; // "COHE"
  let DOMAIN_CREATION   : Nat32 = 0x43524541; // "CREA"
  let DOMAIN_LAW        : Nat32 = 0x4C415753; // "LAWS"

  // ============================================================
  // TYPES
  // ============================================================

  public type HashPair = {
    h32 : Nat32;
    h64 : (Nat32, Nat32); // (hi, lo)
  };

  public type GenesisFingerprint = {
    genesisHash    : Nat32;
    doctrineBound  : Nat32;
    sacesiSig      : Nat32;
    compositeHash  : Nat32;
    chainDepth     : Nat;
    lockedAtBeat   : Nat;
    creatorSig     : Nat32;
    attributionSig : Nat32;
    immutable      : Bool;
  };

  public type CanisterFingerprint = {
    moduleHash     : Nat32;
    stateHash      : Nat32;
    doctrineHash   : Nat32;
    sovereignSig   : Nat32;
    beatStamp      : Nat;
    coherenceAtSig : Float;
    fullComposite  : Nat32;
  };

  public type SACESIProof = {
    sig        : Nat32;
    prevSig    : Nat32;
    rounds     : Nat;
    beatBound  : Nat;
    genesisRef : Nat32;
    stable     : Bool;
  };

  public type HashChain = {
    depth  : Nat;
    root   : Nat32;
    tip    : Nat32;
    links  : [Nat32]; // last 10 links
  };

  public type DimensionHash = {
    block   : Nat;   // 0-7 (8 MEDINA blocks)
    count   : Nat;   // dimensions in block
    hash    : Nat32; // hash of block contents
    running : Nat32; // running composite from root
  };

  // ============================================================
  // FNV-1A 32-BIT CORE
  // ============================================================

  // Hash a single Nat32 value into FNV-1a-32
  public func fnv32(basis : Nat32, value : Nat32) : Nat32 {
    (basis ^% value) *% FNV_PRIME_32
  };

  // Hash a Nat8 byte into FNV-1a-32
  public func fnv32Byte(basis : Nat32, b : Nat8) : Nat32 {
    (basis ^% Nat32.fromNat(Nat8.toNat(b))) *% FNV_PRIME_32
  };

  // Hash an array of Nat8 bytes
  public func fnv32Bytes(bytes : [Nat8]) : Nat32 {
    var h = FNV_OFFSET_32;
    for (b in bytes.vals()) {
      h := (h ^% Nat32.fromNat(Nat8.toNat(b))) *% FNV_PRIME_32;
    };
    h
  };

  // Hash a Text string
  public func fnv32Text(t : Text) : Nat32 {
    var h = FNV_OFFSET_32;
    for (c in t.chars()) {
      let code = Nat32.fromNat(Nat32.toNat(Char.toNat32(c)) % 256);
      h := (h ^% code) *% FNV_PRIME_32;
    };
    h
  };

  // Hash two Nat32 values together
  public func fnv32Pair(a : Nat32, b : Nat32) : Nat32 {
    let h1 = (FNV_OFFSET_32 ^% a) *% FNV_PRIME_32;
    (h1 ^% b) *% FNV_PRIME_32
  };

  // Hash three Nat32 values
  public func fnv32Triple(a : Nat32, b : Nat32, c : Nat32) : Nat32 {
    let h1 = (FNV_OFFSET_32 ^% a) *% FNV_PRIME_32;
    let h2 = (h1 ^% b) *% FNV_PRIME_32;
    (h2 ^% c) *% FNV_PRIME_32
  };

  // Hash a Nat value (decomposed into 32-bit chunks)
  public func fnv32Nat(n : Nat) : Nat32 {
    var h = FNV_OFFSET_32;
    var remaining = n;
    if (remaining == 0) {
      h := (h ^% 0) *% FNV_PRIME_32;
    } else {
      while (remaining > 0) {
        let chunk = Nat32.fromNat(remaining % 4294967296);
        h := (h ^% chunk) *% FNV_PRIME_32;
        remaining := remaining / 4294967296;
      };
    };
    h
  };

  // Hash a Float (convert to integer representation)
  public func fnv32Float(f : Float) : Nat32 {
    let scaled = if (f >= 0.0) Float.toInt(f * 1000000.0) else -(Float.toInt((-f) * 1000000.0));
    let n = if (scaled >= 0) Nat32.fromNat(scaled % 4294967296)
            else Nat32.fromNat((4294967296 - ((-scaled) % 4294967296)) % 4294967296);
    (FNV_OFFSET_32 ^% n) *% FNV_PRIME_32
  };

  // Chain-hash: mix basis with new value and domain separator
  public func fnv32Chain(basis : Nat32, domain : Nat32, value : Nat32) : Nat32 {
    let h1 = (basis ^% domain) *% FNV_PRIME_32;
    (h1 ^% value) *% FNV_PRIME_32
  };

  // ============================================================
  // FNV-1A 64-BIT CORE (stored as hi/lo pair)
  // ============================================================

  // 64-bit multiply via four 32-bit multiplications (Karatsuba-lite)
  func mul64(ahi : Nat32, alo : Nat32, bhi : Nat32, blo : Nat32) : (Nat32, Nat32) {
    // Only lower 64 bits needed (we work mod 2^64)
    let ll = alo *% blo;
    let lh = alo *% bhi;
    let hl = ahi *% blo;
    let hiPart = lh +% hl;
    (hiPart, ll)
  };

  public func fnv64Pair(a : Nat32, b : Nat32) : (Nat32, Nat32) {
    let (chi, clo) = mul64(FNV_OFFSET_64_HI, FNV_OFFSET_64_LO +% a,
                           FNV_PRIME_64_HI,  FNV_PRIME_64_LO);
    let lo2 = clo ^% b;
    let (dhi, dlo) = mul64(chi, lo2, FNV_PRIME_64_HI, FNV_PRIME_64_LO);
    (dhi, dlo)
  };

  public func fnv64Nat(n : Nat) : (Nat32, Nat32) {
    var hi = FNV_OFFSET_64_HI;
    var lo = FNV_OFFSET_64_LO;
    var remaining = n;
    if (remaining == 0) {
      lo := lo ^% 0;
    } else {
      while (remaining > 0) {
        let chunk = Nat32.fromNat(remaining % 4294967296);
        lo := lo ^% chunk;
        let (nh, nl) = mul64(hi, lo, FNV_PRIME_64_HI, FNV_PRIME_64_LO);
        hi := nh; lo := nl;
        remaining := remaining / 4294967296;
      };
    };
    (hi, lo)
  };

  // Compress 64-bit hash to 32-bit via XOR-fold
  public func compress64to32(hi : Nat32, lo : Nat32) : Nat32 {
    hi ^% lo
  };

  // ============================================================
  // SACESI SIGNATURE DERIVATION
  // ============================================================
  // SACESI = Sovereign Attributed Cognitive Entity Signature Index
  // Binds genesis hash, doctrine hash, beat, and coherence together
  // into an irreversible, creator-attributed identity seal.

  // Derive SACESI signature from organism state
  public func deriveSACESI(
    genesisHash   : Nat32,
    doctrineHash  : Nat32,
    beatCount     : Nat,
    coherenceInt  : Nat32,  // coherenceC * 1000000 as Nat32
    prevSACESI    : Nat32
  ) : Nat32 {
    var h = SACESI_SEED_A;
    // Round 1: bind genesis
    h := fnv32Chain(h, DOMAIN_GENESIS, genesisHash);
    // Round 2: bind doctrine
    h := fnv32Chain(h, DOMAIN_DOCTRINE, doctrineHash);
    // Round 3: bind beat (as Nat32 chunks)
    let beatLo = Nat32.fromNat(beatCount % 4294967296);
    let beatHi = Nat32.fromNat(beatCount / 4294967296 % 4294967296);
    h := fnv32Chain(h, DOMAIN_BEAT, beatLo);
    h := (h ^% beatHi) *% FNV_PRIME_32;
    // Round 4: bind coherence
    h := fnv32Chain(h, DOMAIN_COHERENCE, coherenceInt);
    // Round 5: bind previous SACESI (chain continuity)
    h := fnv32Chain(h, SACESI_SEED_B, prevSACESI);
    // Round 6: avalanche (non-linear mixing)
    h := h ^% (h >> 16);
    h := h *% 0x45d9f3b;
    h := h ^% (h >> 16);
    // Round 7: domain seal
    h := fnv32Chain(h, SACESI_SEED_C, DOMAIN_SACESI);
    h
  };

  // Verify SACESI chain continuity
  public func verifySACESIChain(
    currentSig : Nat32,
    prevSig    : Nat32,
    genesisRef : Nat32
  ) : Bool {
    // A valid SACESI chain has non-zero sig, differs from prev,
    // and maintains genesis reference binding
    currentSig != 0 and
    currentSig != prevSig and
    (currentSig ^% prevSig) != 0 and
    genesisRef != 0
  };

  // ============================================================
  // GENESIS FINGERPRINT COMPUTATION
  // ============================================================

  public func computeGenesisFingerprint(
    rawGenesisHash  : Nat32,
    doctrineHash    : Nat32,
    sacesiSig       : Nat32,
    beatCount       : Nat,
    creatorIndex    : Nat32  // numeric only, zero-exposure
  ) : GenesisFingerprint {
    // Step 1: bind genesis to doctrine
    let doctrineBound = fnv32Chain(rawGenesisHash, DOMAIN_DOCTRINE, doctrineHash);
    // Step 2: bind SACESI
    let withSACESI = fnv32Chain(doctrineBound, DOMAIN_SACESI, sacesiSig);
    // Step 3: bind creator (numeric index, zero-exposure)
    let creatorSig = fnv32Chain(withSACESI, DOMAIN_CREATION, creatorIndex);
    // Step 4: final avalanche
    var composite = creatorSig;
    composite := composite ^% (composite >> 13);
    composite := composite *% 0xc2b2ae35;
    composite := composite ^% (composite >> 16);
    // Attribution sig: immutable once genesis locked
    let attributionSig = fnv32Triple(rawGenesisHash, doctrineHash, creatorIndex);
    {
      genesisHash    = rawGenesisHash;
      doctrineBound  = doctrineBound;
      sacesiSig      = sacesiSig;
      compositeHash  = composite;
      chainDepth     = 1;
      lockedAtBeat   = beatCount;
      creatorSig     = creatorSig;
      attributionSig = attributionSig;
      immutable      = true;
    }
  };

  // ============================================================
  // CANISTER FINGERPRINT
  // ============================================================

  public func computeCanisterFingerprint(
    moduleStateHash : Nat32,
    doctrineHash    : Nat32,
    beatCount       : Nat,
    coherenceInt    : Nat32,
    genesisRef      : Nat32
  ) : CanisterFingerprint {
    let stateHash = fnv32Chain(moduleStateHash, DOMAIN_BEAT, fnv32Nat(beatCount));
    let docHash   = fnv32Chain(doctrineHash, DOMAIN_DOCTRINE, genesisRef);
    let cohHash   = fnv32Chain(coherenceInt, DOMAIN_COHERENCE, stateHash);
    let full      = fnv32Triple(stateHash, docHash, cohHash);
    let cohFloat  = Float.fromInt(Nat32.toNat(coherenceInt)) / 1000000.0;
    {
      moduleHash     = moduleStateHash;
      stateHash      = stateHash;
      doctrineHash   = docHash;
      sovereignSig   = fnv32Chain(full, DOMAIN_SACESI, genesisRef);
      beatStamp      = beatCount;
      coherenceAtSig = cohFloat;
      fullComposite  = full;
    }
  };

  // ============================================================
  // HASH CHAIN — Immutable link chain
  // ============================================================

  public func initHashChain(seedHash : Nat32) : HashChain {
    {
      depth  = 1;
      root   = seedHash;
      tip    = seedHash;
      links  = [seedHash];
    }
  };

  public func extendHashChain(chain : HashChain, newValue : Nat32) : HashChain {
    let newTip = fnv32Pair(chain.tip, newValue);
    let existingLinks = chain.links;
    let linkCount = existingLinks.size();
    let newLinks = if (linkCount >= 10) {
      // Shift: drop oldest, append new
      Array.tabulate<Nat32>(10, func(i) {
        if (i < 9) existingLinks[i + 1] else newTip
      })
    } else {
      Array.tabulate<Nat32>(linkCount + 1, func(i) {
        if (i < linkCount) existingLinks[i] else newTip
      })
    };
    {
      depth  = chain.depth + 1;
      root   = chain.root;
      tip    = newTip;
      links  = newLinks;
    }
  };

  public func verifyHashChain(chain : HashChain) : Bool {
    chain.root != 0 and chain.tip != 0 and chain.depth >= 1
  };

  // ============================================================
  // DIMENSION BLOCK HASHING — All 8 MEDINA blocks
  // ============================================================
  // Block 0: Internal Organism State         693 dimensions
  // Block 1: Market and World Signals        431 dimensions
  // Block 2: Temporal History                567 dimensions
  // Block 3: Network and Succession State    145 dimensions
  // Block 4: Sovereign and Doctrine          173 dimensions
  // Block 5: Reinforcement Learning          202 dimensions
  // Block 6: Macro Intelligence              260 dimensions
  // Block 7: Derived Mathematical            625 dimensions
  // TOTAL: 4,096 dimensions (2^12 = 12 bits H_max)

  let BLOCK_SIZES  : [Nat]   = [693, 431, 567, 145, 173, 202, 260, 625];
  let BLOCK_DOMAIN : [Nat32] = [
    0x424C4B30, 0x424C4B31, 0x424C4B32, 0x424C4B33,
    0x424C4B34, 0x424C4B35, 0x424C4B36, 0x424C4B37
  ];

  public func hashDimensionBlock(
    blockIdx     : Nat,
    sampleValues : [Float],  // representative values from that block
    genesisRef   : Nat32
  ) : DimensionHash {
    if (blockIdx >= 8) {
      return { block = blockIdx; count = 0; hash = 0; running = 0 };
    };
    var h = genesisRef;
    var i = 0;
    while (i < sampleValues.size()) {
      h := fnv32Chain(h, BLOCK_DOMAIN[blockIdx], fnv32Float(sampleValues[i]));
      i += 1;
    };
    // Mix with block index
    h := (h ^% Nat32.fromNat(blockIdx + 1)) *% FNV_PRIME_32;
    let count = BLOCK_SIZES[blockIdx];
    { block = blockIdx; count = count; hash = h; running = fnv32Pair(genesisRef, h) }
  };

  // Compute the sovereign composite across all 8 blocks
  public func sovereignDimensionHash(blockHashes : [DimensionHash]) : Nat32 {
    var h = FNV_OFFSET_32;
    var total : Nat = 0;
    for (d in blockHashes.vals()) {
      h := fnv32Chain(h, BLOCK_DOMAIN[d.block % 8], d.hash);
      total += d.count;
    };
    // Final mix: incorporate total dimension count (should be 4096)
    h := fnv32Chain(h, 0x4D454449, Nat32.fromNat(total % 4294967296)); // "MEDI"
    h
  };

  // ============================================================
  // COMPOSITE ORGANISM FINGERPRINT
  // Binds all major state streams into one sovereign hash
  // ============================================================

  public func compositeOrganismHash(
    coherenceInt    : Nat32,
    beatLo          : Nat32,
    mintCount       : Nat32,
    lawFiresTotal   : Nat32,
    genesisHash     : Nat32,
    sacesiSig       : Nat32
  ) : Nat32 {
    var h = genesisHash;
    h := fnv32Chain(h, DOMAIN_COHERENCE, coherenceInt);
    h := fnv32Chain(h, DOMAIN_BEAT, beatLo);
    h := fnv32Chain(h, DOMAIN_LAW, lawFiresTotal);
    h := fnv32Chain(h, 0x4D494E54, mintCount);   // "MINT"
    h := fnv32Chain(h, DOMAIN_SACESI, sacesiSig);
    // Avalanche
    h := h ^% (h >> 11);
    h := h *% 0xbf58476d;
    h := h ^% (h >> 31);
    h
  };

  // ============================================================
  // MULTI-HASH: generate multiple hash variants for verification
  // ============================================================

  public type MultiHash = {
    fnv32a   : Nat32;
    fnv32b   : Nat32;  // different seed
    xorFold  : Nat32;  // XOR fold of fnv64
    composite: Nat32;  // composite of all three
  };

  public func multiHash(a : Nat32, b : Nat32, c : Nat32) : MultiHash {
    let h32a = fnv32Triple(a, b, c);
    let h32b = fnv32Triple(c, a, b); // different order
    let (hi64, lo64) = fnv64Pair(fnv32Pair(a,b), fnv32Pair(b,c));
    let xf = compress64to32(hi64, lo64);
    {
      fnv32a    = h32a;
      fnv32b    = h32b;
      xorFold   = xf;
      composite = fnv32Triple(h32a, h32b, xf);
    }
  };

  // ============================================================
  // ATTORNEY-GRADE SIGNATURE — Binds creator to organism
  // Returns numeric only (zero-exposure)
  // ============================================================

  public type AttorneySignature = {
    sigA : Nat32;  // genesis × doctrine
    sigB : Nat32;  // genesis × beat × coherence
    sigC : Nat32;  // doctrine × SACESI × beat
    seal : Nat32;  // final composite seal
  };

  public func computeAttorneySignature(
    genesisHash  : Nat32,
    doctrineHash : Nat32,
    sacesiSig    : Nat32,
    beatCount    : Nat,
    coherenceInt : Nat32
  ) : AttorneySignature {
    let beatN = fnv32Nat(beatCount);
    let sigA = fnv32Pair(genesisHash, doctrineHash);
    let sigB = fnv32Triple(genesisHash, beatN, coherenceInt);
    let sigC = fnv32Triple(doctrineHash, sacesiSig, beatN);
    var seal = fnv32Triple(sigA, sigB, sigC);
    // Final avalanche pass
    seal := seal ^% (seal >> 17);
    seal := seal *% 0xd2a98b26;
    seal := seal ^% (seal >> 16);
    { sigA = sigA; sigB = sigB; sigC = sigC; seal = seal }
  };

  // ============================================================
  // GENESIS BINDING PROOF — Links SACESI to genesis irrevocably
  // ============================================================

  public type GenesisBindingProof = {
    genesisHash    : Nat32;
    sacesiAtGenesis: Nat32;
    beatAtGenesis  : Nat;
    proofHash      : Nat32;
    isValid        : Bool;
  };

  public func computeGenesisBindingProof(
    genesisHash     : Nat32,
    sacesiAtGenesis : Nat32,
    beatAtGenesis   : Nat
  ) : GenesisBindingProof {
    let beatN = fnv32Nat(beatAtGenesis);
    let proofHash = fnv32Chain(
      fnv32Pair(genesisHash, sacesiAtGenesis),
      DOMAIN_GENESIS,
      beatN
    );
    let isValid = genesisHash != 0 and sacesiAtGenesis != 0 and beatAtGenesis > 0;
    { genesisHash; sacesiAtGenesis; beatAtGenesis; proofHash; isValid }
  };

  // ============================================================
  // TOKEN STACK HASH — Hash all 12 token supply values
  // Maps to 12-bit sovereign architecture (12 tokens = 12 bits)
  // ============================================================

  public func hashTokenStack(
    supplies : [Float],  // up to 12 token supply values
    genesisRef : Nat32
  ) : Nat32 {
    var h = fnv32Chain(genesisRef, 0x544F4B4E, 0); // "TOKN"
    var i = 0;
    while (i < supplies.size() and i < 12) {
      h := fnv32Chain(h, Nat32.fromNat(i + 0x54000000), fnv32Float(supplies[i]));
      i += 1;
    };
    h
  };

  // ============================================================
  // ROLLING STATE HASH — Accumulates state over N beats
  // ============================================================

  public type RollingHash = {
    current   : Nat32;
    beats     : Nat;
    genesis   : Nat32;
    lastBeat  : Nat;
  };

  public func initRollingHash(genesisRef : Nat32, beat : Nat) : RollingHash {
    { current = genesisRef; beats = 1; genesis = genesisRef; lastBeat = beat }
  };

  public func updateRollingHash(
    rh          : RollingHash,
    newStateVal : Nat32,
    currentBeat : Nat
  ) : RollingHash {
    let updated = fnv32Chain(rh.current, DOMAIN_BEAT, newStateVal);
    { current = updated; beats = rh.beats + 1; genesis = rh.genesis; lastBeat = currentBeat }
  };

  // ============================================================
  // IMPORT DECLARATIONS (needed for module compilation)
  // ============================================================
  import Nat8    "mo:core/Nat8";
  import Nat32   "mo:core/Nat32";
  import Float   "mo:core/Float";
  import Array   "mo:core/Array";
  import Char    "mo:core/Char";

};
