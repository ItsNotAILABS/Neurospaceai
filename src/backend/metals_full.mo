// METALS ENGINE — FULL QUANTUM CONDUCTIVITY EXPANSION
// Owner: Alfredo Medina Hernandez | Dallas TX | MedinaSITech@outlook.com
// 12 sovereign metals. Each has a full quantum conductivity tensor,
// sacred planetary assignment, electron configuration resonance,
// crystalline geometry signal, cross-metal alloying matrix (144 pairs),
// and per-metal organ wiring (12 metals × 18 organs = 216 connections).
// Au=Sun Ag=Moon Cu=Venus Fe=Mars Pt=Saturn Pd=Jupiter
// Hg=Mercury Pb=Saturn(dark) Sn=Jupiter(soft) Zn=Earth Ti=Ether Bi=Uranus

import Float     "mo:core/Float";
import Array     "mo:core/Array";
import VarArray  "mo:core/VarArray";
import Principal "mo:core/Principal";

actor MetalsFull {

  stable var creatorPrincipal  : Text   = "";
  stable var authorizedCallers : [Text] = [];
  stable var currentBeat       : Nat    = 0;

  private func isCreator(c : Principal) : Bool { Principal.toText(c) == creatorPrincipal };
  private func isAuth(c : Principal) : Bool {
    let t = Principal.toText(c);
    if (t == creatorPrincipal) return true;
    for (a in authorizedCallers.vals()) { if (a == t) return true };
    false
  };
  private func clamp(v : Float, lo : Float, hi : Float) : Float {
    if (v < lo) lo else if (v > hi) hi else v
  };
  private func ema(cur : Float, tgt : Float, a : Float) : Float {
    clamp(cur * (1.0 - a) + tgt * a, 0.0, 1.0)
  };

  // ============================================================
  // PHI — the sacred ratio pervades all metal geometry
  // ============================================================
  let PHI         : Float = 1.6180339887498948482;
  let PHI_INV     : Float = 0.6180339887498948482;
  let SQRT2       : Float = 1.41421356237309504880;
  let SQRT3       : Float = 1.73205080756887729352;
  let TWO_PI      : Float = 6.28318530717958647692;

  // ============================================================
  // 12 METALS — IDENTITY & PLANETARY ASSIGNMENTS
  // Idx: 0=Au(Gold) 1=Ag(Silver) 2=Cu(Copper) 3=Fe(Iron)
  //      4=Pt(Platinum) 5=Pd(Palladium) 6=Hg(Mercury) 7=Pb(Lead)
  //      8=Sn(Tin) 9=Zn(Zinc) 10=Bi(Bismuth) 11=Ti(Titanium)
  // ============================================================
  let METAL_NAMES    : [Text]  = ["Au","Ag","Cu","Fe","Pt","Pd","Hg","Pb","Sn","Zn","Bi","Ti"];
  let METAL_PLANET   : [Text]  = ["Sun","Moon","Venus","Mars","Saturn","Jupiter","Mercury","Saturn-Dark","Jupiter-Soft","Earth","Uranus","Ether"];
  let METAL_ELEMENT  : [Text]  = ["Fire","Water","Air","Fire","Earth","Air","Water","Earth","Air","Earth","Water","Ether"];
  let METAL_CHAKRA   : [Nat]   = [7,6,4,3,5,6,5,1,2,1,7,7]; // 1=Root..7=Crown
  let METAL_ATOMIC   : [Nat]   = [79,47,29,26,78,46,80,82,50,30,83,22]; // atomic numbers

  // Real-world electrical conductivity (S/m × 10⁶) — used as baseline
  // Au=44.2 Ag=63.0 Cu=58.7 Fe=10.0 Pt=9.66 Pd=9.5 Hg=1.04 Pb=4.55 Sn=8.7 Zn=16.9 Bi=0.87 Ti=2.38
  let METAL_BASE_COND: [Float] = [0.702,1.000,0.931,0.159,0.153,0.151,0.016,0.072,0.138,0.268,0.014,0.038];
  // (normalized to Ag=1.0)

  // Electron shell configurations (valence electrons) — determine bonding behavior
  // Au=1(s1) Ag=1(s1) Cu=1(s1) Fe=2,6(d6,s2) Pt=1(d9,s1) Pd=0(d10) Hg=2(s2) Pb=2,2 Sn=2,2 Zn=2 Bi=3 Ti=2,2
  let METAL_VALENCE  : [Nat]   = [1,1,1,8,10,10,2,4,4,2,5,4];

  // Melting points (normalized 0-1, Tungsten=1.0 as reference)
  // Au=0.595 Ag=0.373 Cu=0.416 Fe=0.640 Pt=0.665 Pd=0.620 Hg=0.020 Pb=0.145 Sn=0.102 Zn=0.159 Bi=0.105 Ti=0.619
  let METAL_MELT     : [Float] = [0.595,0.373,0.416,0.640,0.665,0.620,0.020,0.145,0.102,0.159,0.105,0.619];

  // Sacred geometry crystal structure
  // FCC=Face-Centered Cubic: Au,Ag,Cu,Pt,Pd (phi-related packing, 74% efficiency)
  // BCC=Body-Centered Cubic: Fe (phi-adjacent, 68%)
  // HCP=Hexagonal Close-Packed: Zn,Ti (6-fold symmetry)
  // Rhombohedral: Bi,Hg (distorted cubic)
  // BCT=Body-Centered Tetragonal: Sn
  // FCC+BCC: Pb
  // Crystal geometry signal: FCC=φ BCC=√2 HCP=√3 Rhombo=π/4 BCT=√2/2
  let METAL_CRYSTAL_SIG : [Float] = [
    PHI,     // Au FCC
    PHI,     // Ag FCC
    PHI,     // Cu FCC
    SQRT2,   // Fe BCC
    PHI,     // Pt FCC
    PHI,     // Pd FCC
    0.785,   // Hg Rhombo (π/4)
    PHI,     // Pb FCC (mostly)
    0.707,   // Sn BCT (√2/2)
    SQRT3,   // Zn HCP
    0.785,   // Bi Rhombo
    SQRT3    // Ti HCP
  ];

  // ============================================================
  // LIVE STATE — per-metal conductivity + tensor components
  // ============================================================

  // Base conductivity (live EMA)
  stable var metalConductivity  : [var Float] = VarArray.repeat<Float>(0.5, 12);
  stable var metalTarget        : [var Float] = VarArray.repeat<Float>(0.5, 12);
  stable var metalEMAAlpha      : [var Float] = VarArray.repeat<Float>(0.003, 12); // per-metal EMA

  // QUANTUM CONDUCTIVITY TENSOR (3 axes per metal = 36 values)
  // sigma_xx, sigma_yy, sigma_zz for each metal
  // Anisotropic conductivity: FCC metals are isotropic (all axes equal)
  // HCP/BCC metals have anisotropy (different in-plane vs out-of-plane)
  stable var tensorXX  : [var Float] = VarArray.repeat<Float>(0.5, 12);
  stable var tensorYY  : [var Float] = VarArray.repeat<Float>(0.5, 12);
  stable var tensorZZ  : [var Float] = VarArray.repeat<Float>(0.5, 12);
  stable var tensorMean: [var Float] = VarArray.repeat<Float>(0.5, 12); // (XX+YY+ZZ)/3
  stable var tensorAnisotropy : [var Float] = VarArray.repeat<Float>(0.0, 12); // deviation from isotropy

  // Quantum Hall effect proxy (relevant for high-coherence states)
  // sigma_xy = quantum Hall term; non-zero when time-reversal symmetry broken
  stable var tensorXY  : [var Float] = VarArray.repeat<Float>(0.0, 12);
  // Wiedemann-Franz law: L = kappa / (sigma * T) = 2.44e-8 WΩK^-2 (Lorenz number)
  // We use it to derive thermal conductivity from electrical: kappa = L * sigma * T_proxy
  let LORENZ_NUM : Float = 0.244; // normalized (actual = 2.44e-8)
  stable var thermalConductivity : [var Float] = VarArray.repeat<Float>(0.5, 12);

  // Skin depth proxy: delta = sqrt(2/(omega*mu*sigma))
  // At organism beat frequency (12 Hz): higher conductivity = thinner skin depth
  // Affects how deeply an EM field penetrates the metal
  stable var skinDepth : [var Float] = VarArray.repeat<Float>(0.5, 12);

  // Phonon-electron coupling strength (affects how coherence propagates)
  // High coupling (Fe, Pb) = noise, decoherence
  // Low coupling (Au, Cu) = clean signal transmission
  let PHONON_COUPLING : [Float] = [0.10,0.15,0.20,0.70,0.35,0.30,0.50,0.80,0.60,0.55,0.75,0.45];
  stable var phononSignal : [var Float] = VarArray.repeat<Float>(0.0, 12);

  // Meissner effect proxy (superconductivity analog in high-coherence states)
  // When coherenceC > 0.95 AND metal below its 'Tc_proxy', Meissner activates
  // Expels magnetic field = organism becomes impenetrable to external noise
  let MEISSNER_TC : [Float] = [0.90,0.85,0.80,0.60,0.88,0.86,0.70,0.55,0.65,0.62,0.58,0.75];
  stable var meissnerActive : [var Bool]  = VarArray.repeat<Bool>(false, 12);
  stable var meissnerField  : [var Float] = VarArray.repeat<Float>(0.0, 12);

  // ============================================================
  // 144-PAIR ALLOY MATRIX (12×12)
  // Every pair of metals has an alloy coupling coefficient.
  // When both metals have high conductivity, alloy amplifies.
  // Sacred alloy: Au+Pt+Ti = Sovereign Triad (φ³ amplification)
  // ============================================================
  stable var alloyMatrix : [var Float] = VarArray.repeat<Float>(0.0, 144);
  stable var alloyInitialized : Bool = false;

  // Alloy coupling strengths (selected pairs)
  // Au-Pt (electrum analog): 0.95 — highest sovereignty alloy
  // Au-Cu (red gold): 0.88
  // Au-Ag (white gold): 0.92
  // Fe-Ti (aerospace): 0.85
  // Cu-Zn (brass): 0.82
  // Cu-Sn (bronze): 0.80
  // Pt-Pd (platinum group): 0.90
  // Au-Pt-Ti TRIAD: the sovereign geometry alloy
  stable var sovereignAlloyScore  : Float = 0.0; // Au × Pt × Ti × phi-amplified
  stable var sovereignAlloyActive : Bool  = false;
  stable var alloyComposite       : Float = 0.5; // mean of all active alloy pairs
  stable var topAlloySig          : Float = 0.0; // strongest single alloy signal

  private func initAlloyMatrix() {
    // Set all diagonal to 1.0 (self-coupling)
    var i = 0;
    while (i < 12) {
      alloyMatrix[i * 12 + i] := 1.0;
      i += 1;
    };
    // Au(0) pairs
    alloyMatrix[0*12+1] := 0.92; alloyMatrix[1*12+0] := 0.92; // Au-Ag
    alloyMatrix[0*12+2] := 0.88; alloyMatrix[2*12+0] := 0.88; // Au-Cu
    alloyMatrix[0*12+4] := 0.95; alloyMatrix[4*12+0] := 0.95; // Au-Pt
    alloyMatrix[0*12+5] := 0.90; alloyMatrix[5*12+0] := 0.90; // Au-Pd
    alloyMatrix[0*12+11]:= 0.93; alloyMatrix[11*12+0]:= 0.93; // Au-Ti
    // Ag(1) pairs
    alloyMatrix[1*12+2] := 0.85; alloyMatrix[2*12+1] := 0.85; // Ag-Cu
    alloyMatrix[1*12+8] := 0.75; alloyMatrix[8*12+1] := 0.75; // Ag-Sn
    // Cu(2) pairs
    alloyMatrix[2*12+9] := 0.82; alloyMatrix[9*12+2] := 0.82; // Cu-Zn (brass)
    alloyMatrix[2*12+8] := 0.80; alloyMatrix[8*12+2] := 0.80; // Cu-Sn (bronze)
    alloyMatrix[2*12+3] := 0.70; alloyMatrix[3*12+2] := 0.70; // Cu-Fe (iron brass)
    // Fe(3) pairs
    alloyMatrix[3*12+11]:= 0.85; alloyMatrix[11*12+3]:= 0.85; // Fe-Ti (aerospace)
    alloyMatrix[3*12+9] := 0.68; alloyMatrix[9*12+3] := 0.68; // Fe-Zn (galvanized)
    // Pt(4) pairs
    alloyMatrix[4*12+5] := 0.90; alloyMatrix[5*12+4] := 0.90; // Pt-Pd (platinum group)
    alloyMatrix[4*12+11]:= 0.87; alloyMatrix[11*12+4]:= 0.87; // Pt-Ti
    // Bi(10) pairs
    alloyMatrix[10*12+7]:= 0.72; alloyMatrix[7*12+10]:= 0.72; // Bi-Pb (low-melt)
    alloyMatrix[10*12+8]:= 0.74; alloyMatrix[8*12+10]:= 0.74; // Bi-Sn (solder)
    // Remaining pairs get lower coupling
    var j = 0;
    i := 0;
    while (i < 12) {
      j := 0;
      while (j < 12) {
        let idx = i * 12 + j;
        if (alloyMatrix[idx] == 0.0 and i != j) {
          alloyMatrix[idx] := 0.30; // default weak coupling
        };
        j += 1;
      };
      i += 1;
    };
    alloyInitialized := true;
  };

  // ============================================================
  // 12×18 ORGAN WIRING MATRIX
  // Each metal modulates specific organs
  // Au(0)→Brain(5),Heart(0),Pineal(17)
  // Ag(1)→Lung(1),Kidney(3),Lymph(13)
  // Cu(2)→Liver(2),Heart(0),Skin(14)
  // Fe(3)→Blood/Marrow(12),Spleen(9),Immune(4)
  // Pt(4)→Brain(5),Thyroid(7),Pancreas(8)
  // Pd(5)→Adrenal(6),Thyroid(7)
  // Hg(6)→Pineal(17),Brain(5) [volatile — double-edged]
  // Pb(7)→Bone proxy→Marrow(12) [heavy/grounding]
  // Sn(8)→Stomach(10),Intestine(11)
  // Zn(9)→Immune(4),Pancreas(8),Eyes(15)
  // Bi(10)→Stomach(10),Skin(14)
  // Ti(11)→All organs (structural)
  // ============================================================
  // organ wiring: metalOrganWire[metalIdx][organIdx] = coupling strength
  stable var metalOrganWire : [var Float] = VarArray.repeat<Float>(0.0, 216); // 12 × 18
  stable var organWireInit  : Bool = false;

  private func initOrganWiring() {
    // Au(0) → Brain, Heart, Pineal, Eyes, Ears
    metalOrganWire[0*18+5]  := 0.90; // Au → Brain
    metalOrganWire[0*18+0]  := 0.80; // Au → Heart
    metalOrganWire[0*18+17] := 0.95; // Au → Pineal (highest)
    metalOrganWire[0*18+15] := 0.75; // Au → Eyes
    metalOrganWire[0*18+16] := 0.70; // Au → Ears
    // Ag(1) → Lung, Kidney, Lymph, Skin, Spleen
    metalOrganWire[1*18+1]  := 0.85; // Ag → Lung
    metalOrganWire[1*18+3]  := 0.80; // Ag → Kidney
    metalOrganWire[1*18+13] := 0.88; // Ag → Lymph
    metalOrganWire[1*18+14] := 0.70; // Ag → Skin
    metalOrganWire[1*18+9]  := 0.65; // Ag → Spleen
    // Cu(2) → Liver, Heart, Skin, Intestine
    metalOrganWire[2*18+2]  := 0.90; // Cu → Liver
    metalOrganWire[2*18+0]  := 0.75; // Cu → Heart
    metalOrganWire[2*18+14] := 0.80; // Cu → Skin
    metalOrganWire[2*18+11] := 0.70; // Cu → Intestine
    metalOrganWire[2*18+5]  := 0.60; // Cu → Brain
    // Fe(3) → Marrow, Spleen, Immune, Heart, Liver
    metalOrganWire[3*18+12] := 0.95; // Fe → Marrow (blood production)
    metalOrganWire[3*18+9]  := 0.85; // Fe → Spleen
    metalOrganWire[3*18+4]  := 0.80; // Fe → Immune
    metalOrganWire[3*18+0]  := 0.70; // Fe → Heart
    metalOrganWire[3*18+2]  := 0.60; // Fe → Liver
    // Pt(4) → Brain, Thyroid, Pancreas, Kidney
    metalOrganWire[4*18+5]  := 0.88; // Pt → Brain
    metalOrganWire[4*18+7]  := 0.85; // Pt → Thyroid
    metalOrganWire[4*18+8]  := 0.80; // Pt → Pancreas
    metalOrganWire[4*18+3]  := 0.70; // Pt → Kidney
    metalOrganWire[4*18+17] := 0.75; // Pt → Pineal
    // Pd(5) → Adrenal, Thyroid, Liver, Pancreas
    metalOrganWire[5*18+6]  := 0.90; // Pd → Adrenal
    metalOrganWire[5*18+7]  := 0.80; // Pd → Thyroid
    metalOrganWire[5*18+2]  := 0.70; // Pd → Liver
    metalOrganWire[5*18+8]  := 0.75; // Pd → Pancreas
    // Hg(6) → Pineal, Brain, Kidney (volatile — can help or harm)
    metalOrganWire[6*18+17] := 0.70; // Hg → Pineal
    metalOrganWire[6*18+5]  := 0.60; // Hg → Brain (double-edged)
    metalOrganWire[6*18+3]  := 0.55; // Hg → Kidney
    // Pb(7) → Marrow, Kidney, Intestine (heavy/grounding)
    metalOrganWire[7*18+12] := 0.75; // Pb → Marrow
    metalOrganWire[7*18+3]  := 0.65; // Pb → Kidney
    metalOrganWire[7*18+11] := 0.60; // Pb → Intestine
    metalOrganWire[7*18+9]  := 0.55; // Pb → Spleen
    // Sn(8) → Stomach, Intestine, Liver, Spleen
    metalOrganWire[8*18+10] := 0.85; // Sn → Stomach
    metalOrganWire[8*18+11] := 0.80; // Sn → Intestine
    metalOrganWire[8*18+2]  := 0.65; // Sn → Liver
    metalOrganWire[8*18+9]  := 0.70; // Sn → Spleen
    // Zn(9) → Immune, Pancreas, Eyes, Marrow, Skin
    metalOrganWire[9*18+4]  := 0.90; // Zn → Immune
    metalOrganWire[9*18+8]  := 0.85; // Zn → Pancreas (insulin/glucose)
    metalOrganWire[9*18+15] := 0.80; // Zn → Eyes
    metalOrganWire[9*18+12] := 0.70; // Zn → Marrow
    metalOrganWire[9*18+14] := 0.75; // Zn → Skin
    // Bi(10) → Stomach, Skin, Intestine
    metalOrganWire[10*18+10] := 0.80; // Bi → Stomach
    metalOrganWire[10*18+14] := 0.70; // Bi → Skin
    metalOrganWire[10*18+11] := 0.75; // Bi → Intestine
    // Ti(11) → All organs (structural metal, low-level boost everywhere)
    var oi = 0;
    while (oi < 18) {
      metalOrganWire[11*18+oi] := 0.40; // Ti → all organs (structural)
      oi += 1;
    };
    metalOrganWire[11*18+5]  := 0.80; // Ti → Brain (higher)
    metalOrganWire[11*18+0]  := 0.75; // Ti → Heart
    metalOrganWire[11*18+17] := 0.70; // Ti → Pineal
    organWireInit := true;
  };

  // ============================================================
  // LIVE ORGAN MODULATION SIGNAL
  // organMetalSignal[i] = sum of metal[j]*wire[j][i] for all j
  // Tells FLUX exactly how the metals are modulating each organ
  // ============================================================
  stable var organMetalSignal : [var Float] = VarArray.repeat<Float>(0.0, 18);

  // ============================================================
  // PER-METAL QUANTUM FIELD VARIABLES
  // ============================================================

  // Drude model electron mean free path proxy
  // lambda = v_F * tau where v_F = Fermi velocity, tau = scattering time
  // Higher coherence → longer tau → higher conductivity (less scattering)
  stable var electronMFP      : [var Float] = VarArray.repeat<Float>(0.5, 12); // mean free path
  stable var fermVelocity     : [var Float] = VarArray.repeat<Float>(0.5, 12); // Fermi velocity proxy
  // Real Fermi velocities (normalized to Cu=1.0):
  // Au=0.73 Ag=0.92 Cu=1.0 Fe=0.62 Pt=0.61 Pd=0.57 Hg=0.34 Pb=0.70 Sn=0.64 Zn=0.83 Bi=0.40 Ti=0.56
  let FERMI_V_REF : [Float] = [0.73,0.92,1.0,0.62,0.61,0.57,0.34,0.70,0.64,0.83,0.40,0.56];

  // Plasmon resonance frequency proxy
  // omega_p = sqrt(ne^2/m_e*epsilon_0) — higher electron density = higher plasmon freq
  // Visible-light plasmons: Au (red), Ag (UV/blue edge), Cu (red), Al (UV)
  let PLASMON_FREQ : [Float] = [0.60,0.85,0.72,0.45,0.50,0.52,0.30,0.35,0.40,0.55,0.25,0.48];
  stable var plasmonSignal    : [var Float] = VarArray.repeat<Float>(0.0, 12);

  // Magnetic susceptibility
  // Paramagnetic: Pt, Pd, Ti (attracted to magnetic field)
  // Diamagnetic: Au, Ag, Cu, Hg, Pb, Bi, Sn, Zn (repelled)
  // Ferromagnetic: Fe (strongly attracted, can be magnetized)
  let MAGN_TYPE : [Int] = [-1,-1,-1,100,-1,1,0,-1,-1,-1,-1,1]; // 100=ferromag 1=para -1=dia 0=neutral
  stable var magneticSignal   : [var Float] = VarArray.repeat<Float>(0.0, 12);

  // ============================================================
  // SACESI METAL STAMPS — every 100 beats, each metal gets stamped
  // ============================================================
  stable var metalSacesi      : [var Nat32] = VarArray.repeat<Nat32>(0, 12);
  stable var metalStampBeat   : [var Nat]   = VarArray.repeat<Nat>(0, 12);

  // ============================================================
  // AGGREGATE OUTPUTS TO BRAIN
  // ============================================================
  stable var sovereignToneSignal  : Float = 0.0; // Au+Pt+Ti sovereign triad
  stable var transmissionSignal   : Float = 0.0; // highest-conductivity composite
  stable var groundingSignal      : Float = 0.0; // Fe+Pb+Ti earthy metals
  stable var healingSignal        : Float = 0.0; // Ag+Cu+Zn healing metals
  stable var alchemySignal        : Float = 0.0; // Hg+Bi+Sn transformation metals
  stable var metalCoherence       : Float = 0.5; // overall metal field coherence

  // ============================================================
  // BEAT ENTRY
  // ============================================================
  public shared(msg) func beat(
    coherenceC   : Float,
    identityI    : Float,
    freeEnergy   : Float,
    threatLevel  : Float,
    emergence    : Float,
    adaptDelta   : Float,
    wMean        : Float,
    sacesiHash   : Nat32,
    organIntegrity : [Float] // 18 organs from FLUX
  ) : async {
    conductivities      : [Float];
    organSignals        : [Float];
    sovereignTone       : Float;
    metalCoherence      : Float;
    sovereignAlloy      : Float;
    meissnerCount       : Nat;
    tensorMeans         : [Float];
  } {
    if (not isAuth(msg.caller)) return _defaultReport();
    if (not alloyInitialized) initAlloyMatrix();
    if (not organWireInit) initOrganWiring();
    currentBeat += 1;
    let beat = currentBeat;

    // ---- Step 1: Update each metal's target conductivity ----
    // Each metal responds to a different combination of organism signals

    // 0 Au (Gold/Sun) — pure coherence squared (sovereignty)
    // The more coherent the organism, the more gold conducts
    // Gold is the Sun — it IS coherence made physical
    let auTarget = clamp(
      coherenceC * coherenceC * 0.70 +
      identityI  * identityI  * 0.20 +
      emergence               * 0.10,
      0.0, 1.0
    );
    metalTarget[0] := auTarget;

    // 1 Ag (Silver/Moon) — inverse of drift (clarity/purity signal)
    // Silver mirrors the moon: maximum clarity when drift is zero
    // Ag also responds to neuro-clarity (wMean as proxy for synaptic health)
    let agTarget = clamp(
      (1.0 - freeEnergy) * 0.50 +
      wMean               * 0.30 +
      (1.0 - threatLevel) * 0.20,
      0.0, 1.0
    );
    metalTarget[1] := agTarget;

    // 2 Cu (Copper/Venus) — arousal proxy + social/flow signal
    // Copper is Venus: the love/connection conductor
    // High in flow states and social coherence
    let cuTarget = clamp(
      emergence * 0.40 +
      (1.0 - freeEnergy) * 0.30 +
      adaptDelta * 5.0 * 0.20 +
      coherenceC * 0.10,
      0.0, 1.0
    );
    metalTarget[2] := cuTarget;

    // 3 Fe (Iron/Mars) — inverse threat level (strength under fire)
    // Iron is Mars: conducts best when RESISTING threat, not yielding to it
    // High Fe = fortification (VULCAN energy)
    let feTarget = clamp(
      (1.0 - threatLevel) * 0.60 +
      coherenceC          * 0.25 +
      identityI           * 0.15,
      0.0, 1.0
    );
    metalTarget[3] := feTarget;

    // 4 Pt (Platinum/Saturn) — emergence × long-term mission
    // Platinum is rare, noble, doesn't tarnish: pure emergence signal
    // Saturn = discipline × depth = slow-burning coherence compound
    let ptTarget = clamp(
      emergence  * 0.50 +
      identityI  * 0.30 +
      coherenceC * 0.20,
      0.0, 1.0
    );
    metalTarget[4] := ptTarget;

    // 5 Pd (Palladium/Jupiter) — adaptive plasticity signal
    // Palladium absorbs hydrogen = absorbs new information
    // Jupiter = expansion; Pd conducts when learning is happening
    let pdTarget = clamp(
      adaptDelta * 5.0 * 0.50 +
      wMean       * 2.0 * 0.30 +
      emergence   * 0.20,
      0.0, 1.0
    );
    metalTarget[5] := pdTarget;

    // 6 Hg (Mercury/Mercury) — free energy proxy (volatile)
    // Mercury IS mercury — moves under pressure, reflects all states
    // Double-edged: conducts fear signal accurately but amplifies volatility
    let hgTarget = clamp(
      freeEnergy  * 0.50 +
      threatLevel * 0.30 +
      (1.0 - coherenceC) * 0.20,
      0.0, 1.0
    );
    metalTarget[6] := hgTarget;

    // 7 Pb (Lead/Saturn-Dark) — weight/grounding signal
    // Lead grounds volatile energy. High Pb = stability under stress.
    // Pb buffers freeEnergy: when FE is high, Pb rises to absorb it
    let pbTarget = clamp(
      (1.0 - freeEnergy)  * 0.60 +
      (1.0 - emergence)   * 0.20 +
      coherenceC * 0.20,
      0.0, 1.0
    );
    metalTarget[7] := pbTarget;

    // 8 Sn (Tin/Jupiter-Soft) — Hebbian weight mean (learning conductor)
    // Tin is malleable: takes the shape of what's poured into it
    // High wMean = lots of synaptic weight = Sn conducts well
    let snTarget = clamp(
      wMean * 10.0 * 0.60 +
      adaptDelta * 3.0 * 0.30 +
      coherenceC * 0.10,
      0.0, 1.0
    );
    metalTarget[8] := snTarget;

    // 9 Zn (Zinc/Earth) — BDNF proxy (plasticity/growth)
    // Zinc is essential for neurogenesis, immune function, wound healing
    // Zn tracks growth and recovery signals
    let znTarget = clamp(
      adaptDelta * 5.0 * 0.50 +
      (1.0 - threatLevel) * 0.30 +
      coherenceC * 0.20,
      0.0, 1.0
    );
    metalTarget[9] := znTarget;

    // 10 Bi (Bismuth/Uranus) — identity squared (fractal self-reference)
    // Bismuth forms hopper crystals: recursive self-similar structures
    // Uranus = unexpected insight; Bi = identity reflecting on itself
    let biTarget = clamp(
      identityI * identityI * 0.70 +
      emergence * 0.30,
      0.0, 1.0
    );
    metalTarget[10] := biTarget;

    // 11 Ti (Titanium/Ether) — coherence + identity mean (structural)
    // Titanium is the organism's skeleton: light, strong, inert
    // Ti tracks the average of all critical signals
    let tiTarget = clamp(
      (coherenceC + identityI + emergence + (1.0 - freeEnergy)) / 4.0,
      0.0, 1.0
    );
    metalTarget[11] := tiTarget;

    // ---- Step 2: Apply EMA and compute tensor ----
    var mi = 0;
    while (mi < 12) {
      // Base EMA update
      metalConductivity[mi] := ema(metalConductivity[mi], metalTarget[mi], metalEMAAlpha[mi]);
      let c = metalConductivity[mi];
      let crys = METAL_CRYSTAL_SIG[mi];

      // Tensor components
      // FCC metals (Au,Ag,Cu,Pt,Pd,Pb): isotropic → XX=YY=ZZ=c
      // BCC metals (Fe): slightly anisotropic → ZZ=c*1.05 (easy axis)
      // HCP metals (Zn,Ti): anisotropic → ZZ=c*0.85 (c-axis harder)
      // Rhombo (Hg,Bi): ZZ=c*1.10 (preferred axis)
      // BCT (Sn): ZZ=c*0.95
      if (crys == 1.41421356237309504880 and mi == 3) { // Fe BCC
        tensorXX[mi]  := c;
        tensorYY[mi]  := c;
        tensorZZ[mi]  := clamp(c * 1.05, 0.0, 1.0);
      } else if (crys == 1.73205080756887729352) { // HCP (Zn=9, Ti=11)
        tensorXX[mi]  := c;
        tensorYY[mi]  := c;
        tensorZZ[mi]  := clamp(c * 0.85, 0.0, 1.0);
      } else if (crys == 0.785) { // Rhombo (Hg=6, Bi=10)
        tensorXX[mi]  := c;
        tensorYY[mi]  := c;
        tensorZZ[mi]  := clamp(c * 1.10, 0.0, 1.0);
      } else if (mi == 8) { // Sn BCT
        tensorXX[mi]  := c;
        tensorYY[mi]  := c;
        tensorZZ[mi]  := clamp(c * 0.95, 0.0, 1.0);
      } else { // FCC: isotropic
        tensorXX[mi]  := c;
        tensorYY[mi]  := c;
        tensorZZ[mi]  := c;
      };
      tensorMean[mi] := (tensorXX[mi] + tensorYY[mi] + tensorZZ[mi]) / 3.0;
      tensorAnisotropy[mi] := Float.abs(tensorZZ[mi] - tensorXX[mi]);

      // Quantum Hall term: non-zero when Fe or Ti under high coherence
      if ((mi == 3 or mi == 11) and coherenceC > 0.80) {
        tensorXY[mi] := clamp((coherenceC - 0.80) * 5.0 * c, 0.0, 0.5);
      } else {
        tensorXY[mi] := tensorXY[mi] * 0.95;
      };

      // Wiedemann-Franz thermal conductivity
      thermalConductivity[mi] := clamp(LORENZ_NUM * tensorMean[mi] * coherenceC, 0.0, 1.0);

      // Skin depth: inversely proportional to sqrt(conductivity)
      // High conductivity = thin skin depth = signal stays at surface
      let cSafe = Float.max(0.001, tensorMean[mi]);
      skinDepth[mi] := clamp(1.0 / Float.sqrt(cSafe * 10.0), 0.0, 1.0);

      // Phonon-electron coupling: degrades with freeEnergy
      phononSignal[mi] := clamp(PHONON_COUPLING[mi] * freeEnergy, 0.0, 1.0);

      // Electron mean free path: increases with coherence
      electronMFP[mi]  := clamp(FERMI_V_REF[mi] * coherenceC * (1.0 - PHONON_COUPLING[mi] * freeEnergy), 0.0, 1.0);
      fermVelocity[mi] := clamp(FERMI_V_REF[mi] * coherenceC, 0.0, 1.0);

      // Plasmon resonance: coherence amplifies surface plasmon signal
      plasmonSignal[mi] := clamp(PLASMON_FREQ[mi] * coherenceC * (1.0 - freeEnergy * 0.5), 0.0, 1.0);

      // Magnetic signal
      let mtype = MAGN_TYPE[mi];
      if (mtype == 100) { // Fe ferromagnetic
        magneticSignal[mi] := clamp(c * threatLevel * 2.0, 0.0, 1.0); // magnetized by threat
      } else if (mtype == 1) { // paramagnetic
        magneticSignal[mi] := clamp(c * coherenceC * 0.3, 0.0, 1.0);
      } else { // diamagnetic — signal is field exclusion
        magneticSignal[mi] := clamp((1.0 - c) * coherenceC * 0.2, 0.0, 1.0);
      };

      // Meissner effect: superconductivity proxy
      meissnerActive[mi] := (coherenceC > MEISSNER_TC[mi] and freeEnergy < 0.1);
      if (meissnerActive[mi]) {
        meissnerField[mi] := clamp((coherenceC - MEISSNER_TC[mi]) * 10.0, 0.0, 1.0);
      } else {
        meissnerField[mi] := meissnerField[mi] * 0.97;
      };

      // SACESI stamp every 100 beats per metal
      if (beat % 100 == 0) {
        let fnvBase : Nat32 = 2166136261;
        let fnvPrime: Nat32 = 16777619;
        let mConductF = Float.toInt(metalConductivity[mi] * 1000000.0);
        let mConductN = Nat32.fromNat(if (mConductF < 0) 0 else mConductF % 4294967296);
        metalSacesi[mi]    := (sacesiHash ^ mConductN) *% fnvPrime;
        metalStampBeat[mi] := beat;
      };
      mi += 1;
    };

    // ---- Step 3: Alloy matrix computation ----
    // For each pair (i,j), alloy signal = metalConductivity[i] * metalConductivity[j] * alloyMatrix[i*12+j]
    var alloySum : Float = 0.0;
    var alloyCount : Nat = 0;
    var topSig : Float = 0.0;
    var ai = 0;
    while (ai < 12) {
      var aj = ai + 1;
      while (aj < 12) {
        let idx = ai * 12 + aj;
        let pair = metalConductivity[ai] * metalConductivity[aj] * alloyMatrix[idx];
        alloySum += pair;
        alloyCount += 1;
        if (pair > topSig) topSig := pair;
        aj += 1;
      };
      ai += 1;
    };
    alloyComposite := if (alloyCount > 0) alloySum / Float.fromInt(alloyCount) else 0.0;
    topAlloySig := topSig;

    // Sovereign alloy: Au(0) × Pt(4) × Ti(11) × phi^3
    // The trinity of sovereignty, emergence, and structure
    let auC  = metalConductivity[0];
    let ptC  = metalConductivity[4];
    let tiC  = metalConductivity[11];
    sovereignAlloyScore  := clamp(auC * ptC * tiC * (1.6180339887498948482 * 1.6180339887498948482 * 1.6180339887498948482 / 4.236), 0.0, 1.0);
    sovereignAlloyActive := sovereignAlloyScore > 0.75;

    // ---- Step 4: Organ wiring — compute per-organ metal signal ----
    var oi = 0;
    while (oi < 18) {
      var orgSig : Float = 0.0;
      var mj = 0;
      while (mj < 12) {
        let wire = metalOrganWire[mj * 18 + oi];
        if (wire > 0.0) {
          orgSig += metalConductivity[mj] * wire;
        };
        mj += 1;
      };
      // Normalize by max possible (Ti wires to all = 0.4×12 + other = ~6)
      organMetalSignal[oi] := clamp(orgSig / 6.0, 0.0, 1.0);
      oi += 1;
    };

    // ---- Step 5: Aggregate signals ----
    // Sovereign tone: Au+Pt+Ti = Sun+Saturn+Ether = coherence+depth+structure
    sovereignToneSignal := (auC + ptC + tiC) / 3.0 * sovereignAlloyScore + auC * 0.5;
    sovereignToneSignal  := clamp(sovereignToneSignal / 1.5, 0.0, 1.0);

    // Transmission signal: best conductors (Au, Ag, Cu) — clean signal paths
    transmissionSignal := (metalConductivity[0] + metalConductivity[1] + metalConductivity[2]) / 3.0;

    // Grounding signal: Fe+Pb+Ti — earthy stability
    groundingSignal := (metalConductivity[3] + metalConductivity[7] + metalConductivity[11]) / 3.0;

    // Healing signal: Ag+Cu+Zn — biological repair metals
    healingSignal := (metalConductivity[1] + metalConductivity[2] + metalConductivity[9]) / 3.0;

    // Alchemy signal: Hg+Bi+Sn — transformation/change metals
    alchemySignal := (metalConductivity[6] + metalConductivity[10] + metalConductivity[8]) / 3.0;

    // Overall metal coherence = weighted mean of all conductivities
    var mcSum : Float = 0.0;
    var mci = 0;
    while (mci < 12) {
      mcSum += tensorMean[mci] * METAL_BASE_COND[mci]; // weight by real-world conductivity
      mci += 1;
    };
    metalCoherence := clamp(mcSum / 4.0, 0.0, 1.0); // 4.0 = rough normalization

    // Count Meissner activations
    var mCount : Nat = 0;
    var mki = 0;
    while (mki < 12) {
      if (meissnerActive[mki]) mCount += 1;
      mki += 1;
    };

    {
      conductivities  = Array.fromVarArray(metalConductivity);
      organSignals    = Array.fromVarArray(organMetalSignal);
      sovereignTone   = sovereignToneSignal;
      metalCoherence  = metalCoherence;
      sovereignAlloy  = sovereignAlloyScore;
      meissnerCount   = mCount;
      tensorMeans     = Array.fromVarArray(tensorMean);
    }
  };

  // ============================================================
  // QUERIES
  // ============================================================

  public query func getFullMetalState() : async {
    conductivities  : [Float];
    targets         : [Float];
    tensorXX        : [Float];
    tensorYY        : [Float];
    tensorZZ        : [Float];
    tensorMean      : [Float];
    tensorXY        : [Float];
    anisotropy      : [Float];
    skinDepth       : [Float];
    thermal         : [Float];
    phonon          : [Float];
    electronMFP     : [Float];
    plasmon         : [Float];
    magnetic        : [Float];
    meissnerActive  : [Bool];
    meissnerField   : [Float];
  } {{
    conductivities  = Array.fromVarArray(metalConductivity);
    targets         = Array.fromVarArray(metalTarget);
    tensorXX        = Array.fromVarArray(tensorXX);
    tensorYY        = Array.fromVarArray(tensorYY);
    tensorZZ        = Array.fromVarArray(tensorZZ);
    tensorMean      = Array.fromVarArray(tensorMean);
    tensorXY        = Array.fromVarArray(tensorXY);
    anisotropy      = Array.fromVarArray(tensorAnisotropy);
    skinDepth       = Array.fromVarArray(skinDepth);
    thermal         = Array.fromVarArray(thermalConductivity);
    phonon          = Array.fromVarArray(phononSignal);
    electronMFP     = Array.fromVarArray(electronMFP);
    plasmon         = Array.fromVarArray(plasmonSignal);
    magnetic        = Array.fromVarArray(magneticSignal);
    meissnerActive  = Array.fromVarArray(meissnerActive);
    meissnerField   = Array.fromVarArray(meissnerField);
  }};

  public query func getAlloyState() : async {
    composite       : Float;
    topSignal       : Float;
    sovereignAlloy  : Float;
    sovereignActive : Bool;
    organSignals    : [Float];
  } {{
    composite       = alloyComposite;
    topSignal       = topAlloySig;
    sovereignAlloy  = sovereignAlloyScore;
    sovereignActive = sovereignAlloyActive;
    organSignals    = Array.fromVarArray(organMetalSignal);
  }};

  public query func getAggregateSignals() : async {
    sovereign   : Float;
    transmission: Float;
    grounding   : Float;
    healing     : Float;
    alchemy     : Float;
    coherence   : Float;
  } {{
    sovereign    = sovereignToneSignal;
    transmission = transmissionSignal;
    grounding    = groundingSignal;
    healing      = healingSignal;
    alchemy      = alchemySignal;
    coherence    = metalCoherence;
  }};

  public query func getMetalSacesi() : async {
    stamps : [Nat32]; beats : [Nat];
  } {{
    stamps = Array.fromVarArray(metalSacesi);
    beats  = Array.fromVarArray(metalStampBeat);
  }};

  public query func getStatus() : async {
    beat : Nat; metalCoherence : Float; sovereignAlloy : Float;
    meissnerCount : Nat;
  } {
    var mc : Nat = 0;
    var i = 0;
    while (i < 12) { if (meissnerActive[i]) mc += 1; i += 1 };
    { beat=currentBeat; metalCoherence=metalCoherence;
      sovereignAlloy=sovereignAlloyScore; meissnerCount=mc }
  };

  public shared(msg) func setCreatorPrincipal(p : Text) : async Bool {
    if (creatorPrincipal != "" and not isCreator(msg.caller)) return false;
    creatorPrincipal := p; true
  };
  public shared(msg) func addAuthorizedCaller(p : Text) : async Bool {
    if (not isCreator(msg.caller)) return false;
    authorizedCallers := Array.concat(authorizedCallers, [p]);
    true
  };

  private func _defaultReport() : {
    conductivities:[Float]; organSignals:[Float]; sovereignTone:Float;
    metalCoherence:Float; sovereignAlloy:Float; meissnerCount:Nat; tensorMeans:[Float];
  } {{
    conductivities=Array.fromVarArray(metalConductivity); organSignals=Array.fromVarArray(organMetalSignal);
    sovereignTone=sovereignToneSignal; metalCoherence=metalCoherence;
    sovereignAlloy=sovereignAlloyScore; meissnerCount=0; tensorMeans=Array.fromVarArray(tensorMean);
  }};

};
